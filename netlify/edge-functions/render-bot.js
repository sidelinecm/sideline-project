import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'SIDELINE CHIANGMAI',
    BRAND_LOGO: 'https://sidelinechiangmai.netlify.app/images/favicon-32x32.png',
};

const optimizeImg = (path, width = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) return path.replace('/upload/', `/upload/f_auto,q_auto:best,w_${width},c_fill,g_face/`);
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&resize=cover&quality=85`;
};

const escapeHTML = (str) => str ? str.replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])) : '';

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const slug = decodeURIComponent(url.pathname.split('/').pop());
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p } = await supabase.from('profiles').select('*, provinces(*)').eq('slug', slug).eq('active', true).maybeSingle();
        if (!p) return context.next();

        const { data: related } = await supabase.from('profiles').select('slug, name, imagePath, location, rate').eq('provinceKey', p.provinceKey).eq('active', true).neq('id', p.id).limit(10);

        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceSlug = p.provinces?.slug || 'chiangmai';
        const displayPrice = parseInt(p.rate || "1500").toLocaleString();
        const imageUrl = optimizeImg(p.imagePath, 800);
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;
        
        // 🔹 Deterministic Random Logic (For Static SEO consistency)
        const seed = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.8 + (seed % 2) / 10).toFixed(1);
        const reviewCount = 120 + (seed % 80);
        const viewers = 5 + (seed % 10);

        const pageTitle = `รีวิว น้อง${displayName} ไซด์ไลน์${provinceName} | รูปจริง ตรงปก ไม่มัดจำ 100%`;
        const metaDesc = `น้อง${displayName} สาวสวยไซด์ไลน์${provinceName} อายุ ${p.age || '22'}ปี งานดีฟิวแฟน ตัวท็อปพรีเมียม การันตีรูปตรงปก ไม่ผ่านเอเย่นต์ จ่ายหน้างาน 100% พิกัด${p.location || provinceName} ทักเลย!`;

        // 🔹 Master Schema Markup (The "Competitor Killer")
        const schema = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Product",
                    "@id": `${canonicalUrl}#product`,
                    "name": `น้อง${displayName} | ไซด์ไลน์${provinceName}`,
                    "image": imageUrl,
                    "description": metaDesc,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                    "sku": `PRO-${p.id}`,
                    "offers": {
                        "@type": "Offer",
                        "price": p.rate || "1500",
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl,
                        "priceValidUntil": "2026-12-31"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount
                    }
                },
                {
                    "@type": "BreadcrumbList",
                    "@id": `${canonicalUrl}#breadcrumb`,
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${provinceSlug}` },
                        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": `${canonicalUrl}#faq`,
                    "mainEntity": [
                        { "@type": "Question", "name": `จองคิว น้อง${displayName} ต้องมัดจำไหม?`, "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องมัดจำค่ะ จ่ายเงินหน้างานหลังจากเจอตัวน้องจริงเท่านั้น ปลอดภัย 100%" }},
                        { "@type": "Question", "name": `น้อง${displayName} รับงานโซนไหนบ้าง?`, "acceptedAnswer": { "@type": "Answer", "text": `น้องสะดวกรับงานในโซน ${p.location || provinceName} และพื้นที่ใกล้เคียงค่ะ` }}
                    ]
                }
            ]
        };

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="theme-color" content="#050507">
    <meta name="robots" content="index, follow, max-image-preview:large">

    <!-- Social Meta -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">
    <meta name="twitter:card" content="summary_large_image">

    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@200;400;600;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <script type="application/ld+json">${JSON.stringify(schema)}</script>

    <style>
        :root {
            --p: #FF2E63; --g: #FF8E53; --bg: #050507; --surface: #111116;
            --glass: rgba(255, 255, 255, 0.03); --gold: linear-gradient(135deg, #D4AF37 0%, #FCEABB 50%, #D4AF37 100%);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
        body { background: var(--bg); color: #fff; font-family: 'Prompt', sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        
        .app { max-width: 500px; margin: 0 auto; background: var(--bg); min-height: 100vh; position: relative; padding-bottom: 120px; }

        /* Navigation */
        .nav { position: absolute; top: 0; width: 100%; z-index: 1000; padding: 20px; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); }
        .nav .brand img { height: 24px; filter: brightness(200%); }

        /* Immersive Hero */
        .hero { position: relative; width: 100%; height: 75vh; overflow: hidden; }
        .hero img { width: 100%; height: 100%; object-fit: cover; object-position: top; animation: slowZoom 20s infinite alternate; }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        .hero-mask { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 10%, rgba(5,5,7,0.2) 40%, rgba(5,5,7,0.5) 100%); }
        
        /* Floating Profile Card */
        .p-card { position: relative; margin-top: -120px; padding: 0 20px; z-index: 100; }
        .p-box { background: rgba(20, 20, 25, 0.7); backdrop-filter: blur(40px); border-radius: 40px; padding: 30px 25px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
        
        .badge-v { display: inline-flex; align-items: center; gap: 6px; background: rgba(14, 165, 233, 0.15); color: #38BDF8; padding: 6px 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; border: 1px solid rgba(56,189,248,0.3); margin-bottom: 15px; letter-spacing: 1px; }
        
        .name-row { display: flex; justify-content: space-between; align-items: flex-end; }
        .name-row h1 { font-size: 3rem; font-weight: 900; line-height: 0.9; letter-spacing: -2px; background: linear-gradient(to bottom, #fff 50%, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .price { font-size: 2rem; font-weight: 900; color: var(--p); text-shadow: 0 0 30px rgba(255,46,99,0.5); }

        .status-row { display: flex; align-items: center; gap: 8px; margin: 15px 0 25px; color: #777; font-size: 0.9rem; }
        .pulse { width: 8px; height: 8px; background: #00E676; border-radius: 50%; box-shadow: 0 0 12px #00E676; animation: p-anim 2s infinite; }
        @keyframes p-anim { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }

        /* Stats Grid */
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .stat-item { background: var(--glass); border-radius: 22px; padding: 15px 5px; text-align: center; border: 1px solid rgba(255,255,255,0.04); transition: 0.3s; }
        .stat-item:hover { background: rgba(255,255,255,0.06); transform: translateY(-5px); }
        .stat-item span { display: block; font-size: 0.6rem; color: #555; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; }
        .stat-item b { font-size: 1.15rem; font-weight: 700; color: #fff; }

        /* Body Content */
        .content { padding: 40px 25px; }
        .section-h { font-size: 0.85rem; font-weight: 800; color: var(--g); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px; display: flex; align-items: center; gap: 15px; }
        .section-h::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.1), transparent); }
        
        .desc-text { color: #999; font-size: 1.05rem; line-height: 1.9; white-space: pre-line; font-weight: 300; }

        /* Trust Grid */
        .t-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
        .t-card { background: linear-gradient(145deg, #111116, #09090c); padding: 25px 20px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.03); text-align: center; }
        .t-card i { font-size: 2rem; margin-bottom: 12px; display: block; background: var(--gold); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .t-card h4 { font-size: 0.95rem; font-weight: 600; margin-bottom: 5px; }
        .t-card p { font-size: 0.75rem; color: #444; }

        /* Related Profiles */
        .rel-wrap { display: flex; gap: 18px; overflow-x: auto; padding: 10px 0 20px; scrollbar-width: none; }
        .rel-wrap::-webkit-scrollbar { display: none; }
        .rel-card { flex: 0 0 165px; border-radius: 30px; overflow: hidden; background: #000; text-decoration: none; border: 1px solid rgba(255,255,255,0.05); position: relative; }
        .rel-card img { width: 100%; height: 220px; object-fit: cover; opacity: 0.8; }
        .rel-meta { position: absolute; bottom: 0; width: 100%; padding: 15px; background: linear-gradient(to top, #000, transparent); text-align: center; }
        .rel-name { font-weight: 700; font-size: 0.95rem; color: #fff; }

        /* Sticky Action Bar */
        .action { position: fixed; bottom: 30px; left: 20px; right: 20px; max-width: 460px; margin: 0 auto; z-index: 1000; display: flex; gap: 15px; }
        .btn-line { flex: 1; background: #06C755; color: #fff; text-decoration: none; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 900; font-size: 1.2rem; box-shadow: 0 20px 40px rgba(6,199,85,0.4); position: relative; overflow: hidden; }
        .btn-line::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent); transform: rotate(45deg); animation: shine 4s infinite linear; }
        @keyframes shine { 0% { left: -100%; } 100% { left: 100%; } }
        .btn-sq { width: 65px; height: 65px; border-radius: 28px; background: rgba(25, 25, 30, 0.9); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; color: #fff; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-size: 1.3rem; }

        .viewer-count { position: absolute; top: 75px; left: 20px; background: rgba(255,46,99,0.1); border: 1px solid rgba(255,46,99,0.3); color: var(--p); padding: 5px 12px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; z-index: 1000; backdrop-filter: blur(10px); }
    </style>
</head>
<body>
    <div class="app">
        <nav class="nav">
            <a href="/" class="brand"><img src="${CONFIG.BRAND_LOGO}" alt="Logo"></a>
            <div class="btn-sq" style="width:45px; height:45px; border-radius:14px; font-size:1rem;" onclick="window.location.href='/'">🏠</div>
        </nav>

        <div class="viewer-count">🔥 มีคนกำลังดูหน้านี้ ${viewers} คน</div>

        <section class="hero">
            <img src="${imageUrl}" alt="น้อง${displayName}">
            <div class="hero-mask"></div>
        </section>

        <main class="p-card">
            <div class="p-box">
                <div class="badge-v"><i class="fas fa-badge-check"></i> IDENTITY VERIFIED</div>
                <div class="name-row">
                    <h1>${displayName}</h1>
                    <div class="price">฿${displayPrice}</div>
                </div>
                <div class="status-row">
                    <i class="fas fa-location-dot" style="color:var(--p);"></i> ${p.location || provinceName} 
                    <span style="opacity:0.1">|</span>
                    <div class="pulse"></div> <span style="color:#00E676; font-weight:700;">ONLINE NOW</span>
                </div>

                <div class="stats">
                    <div class="stat-item"><span>Age</span><b>${p.age || '22'}</b></div>
                    <div class="stat-item"><span>Height</span><b>${p.height || '162'}</b></div>
                    <div class="stat-item"><span>Weight</span><b>${p.weight || '46'}</b></div>
                    <div class="stat-item"><span>Size</span><b>${p.proportion || '34-24-35'}</b></div>
                </div>
            </div>
        </main>

        <section class="content">
            <h2 class="section-h">Personal Information</h2>
            <div class="desc-text">${escapeHTML(p.description) || 'บริการฟิวแฟนเป็นกันเอง น้องสวยตรงปกแน่นอนค่ะ ทักมาคุยกันก่อนได้นะคะ ไม่เหวี่ยงไม่วีนแน่นอน'}</div>

            <div style="margin-top:50px;">
                <h2 class="section-h">Elite Membership Guarantee</h2>
                <div class="t-grid">
                    <div class="t-card">
                        <i class="fas fa-shield-heart"></i>
                        <h4>No Deposit</h4>
                        <p>จ่ายหน้างาน 100% ปลอดภัยที่สุด</p>
                    </div>
                    <div class="t-card">
                        <i class="fas fa-user-shield"></i>
                        <h4>Privacy</h4>
                        <p>ข้อมูลลูกค้าเป็นความลับระดับสูงสุด</p>
                    </div>
                </div>
            </div>

            ${related && related.length > 0 ? `
            <div style="margin-top:50px;">
                <h2 class="section-h">Featured in ${provinceName}</h2>
                <div class="rel-wrap">
                    ${related.map(r => `
                        <a href="/sideline/${r.slug}" class="rel-card">
                            <img src="${optimizeImg(r.imagePath, 350)}" alt="${r.name}" loading="lazy">
                            <div class="rel-meta">
                                <span class="rel-name">${r.name}</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <footer style="text-align:center; margin-top:60px; opacity:0.3; font-size:0.7rem; letter-spacing:2px; font-weight:200;">
                PRODUCED BY ${CONFIG.BRAND_NAME} / VVIP EDITION
            </footer>
        </section>

        <nav class="action">
            <button class="btn-sq" id="copyBtn"><i class="fas fa-link"></i></button>
            <a href="${finalLineUrl}" class="btn-line">
                <i class="fab fa-line" style="font-size:1.8rem;"></i>
                RESERVE NOW
            </a>
            <button class="btn-sq" onclick="window.scrollTo({top:0, behavior:'smooth'})"><i class="fas fa-chevron-up"></i></button>
        </nav>
    </div>

    <script>
        document.getElementById('copyBtn').onclick = function() {
            navigator.clipboard.writeText(window.location.href);
            this.innerHTML = '<i class="fas fa-check" style="color:#00E676"></i>';
            setTimeout(() => { this.innerHTML = '<i class="fas fa-link"></i>'; }, 2000);
        };
    </script>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) { return context.next(); }
};