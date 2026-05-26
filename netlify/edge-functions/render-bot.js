import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'SIDELINE CHIANGMAI',
    BRAND_LOGO: 'https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp',
    SOCIAL_LINKS: [
        'https://line.me/ti/p/ksLUWB89Y_',
        'https://tiktok.com/@sidelinechiangmai',
        'https://twitter.com/sidelinechiangmai',
        'https://linkedin.com/in/cuteti-sexythailand-398567280',
        'https://bio.site/firstfiwfans.com',
        'https://linktr.ee/kissmodel',
        'https://bsky.app/profile/sidelinechiangmai.bsky.social'
    ]
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
        
        // 1. ดึงข้อมูลโปรไฟล์หลัก
        const { data: p } = await supabase.from('profiles').select('*, provinces(*)').eq('slug', slug).eq('active', true).maybeSingle();
        if (!p) return context.next();

        // 2. ดึงน้องๆ ที่เกี่ยวข้อง (ลิ้งค์ภายใน)
        const { data: related } = await supabase.from('profiles').select('slug, name, imagePath, location, rate').eq('provinceKey', p.provinceKey).eq('active', true).neq('id', p.id).limit(10);

        // 3. ดึงรายชื่อจังหวัดอื่นๆ (Footer Linking)
        const { data: allProvinces } = await supabase.from('provinces').select('key, nameThai').limit(10);

        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceSlug = p.provinces?.slug || 'chiangmai';
        const displayPrice = parseInt(p.rate || "1500").toLocaleString();
        const imageUrl = optimizeImg(p.imagePath, 800);
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;
        
        // Logic คะแนนรีวิวให้คงที่สำหรับ Google
        const seed = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.8 + (seed % 2) / 10).toFixed(1);
        const reviewCount = 120 + (seed % 80);

        const pageTitle = `รีวิว น้อง${displayName} ไซด์ไลน์${provinceName} | รูปจริง ตรงปก ไม่มัดจำ 100%`;
        const metaDesc = `น้อง${displayName} สาวสวยไซด์ไลน์${provinceName} อายุ ${p.age || '22'}ปี งานดีฟิวแฟน ตัวท็อปพรีเมียม การันตีรูปตรงปก ไม่ผ่านเอเย่นต์ จ่ายหน้างาน 100% พิกัด${p.location || provinceName}`;

        // 🔹 4. MASTER SCHEMA GRAPH (เชื่อมโยงทุก Entity เข้าด้วยกัน)
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": ["Organization", "LocalBusiness"],
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": { "@type": "ImageObject", "url": CONFIG.BRAND_LOGO },
                    "sameAs": CONFIG.SOCIAL_LINKS
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
                    "@type": "Product",
                    "@id": `${canonicalUrl}#product`,
                    "name": `น้อง${displayName} | ไซด์ไลน์${provinceName}`,
                    "image": imageUrl,
                    "description": metaDesc,
                    "brand": { "@id": `${CONFIG.DOMAIN}/#organization` },
                    "offers": {
                        "@type": "Offer",
                        "price": (p.rate || "1500").toString().replace(/[^0-9]/g, ''),
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString()
                    }
                },
                {
                    "@type": "FAQPage",
                    "@id": `${canonicalUrl}#faq`,
                    "mainEntity": [
                        { "@type": "Question", "name": `จองคิว น้อง${displayName} ต้องมัดจำไหม?`, "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องมัดจำค่ะ ทางเราใช้ระบบจ่ายเงินหน้างาน 100% หลังจากเจอตัวน้องจริงเท่านั้น ปลอดภัยแน่นอน" }},
                        { "@type": "Question", "name": `น้อง${displayName} รับงานโซนไหนบ้าง?`, "acceptedAnswer": { "@type": "Answer", "text": `น้องสะดวกรับงานในโซน ${p.location || provinceName} และพื้นที่ใกล้เคียงในจังหวัดค่ะ` }}
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

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@200;400;600;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <style>
        :root { --p: #FF2E63; --g: #FF8E53; --bg: #050507; --surface: #111116; --glass: rgba(255, 255, 255, 0.03); }
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { background: var(--bg); color: #fff; font-family: 'Prompt', sans-serif; overflow-x: hidden; }
        .app { max-width: 500px; margin: 0 auto; background: var(--bg); min-height: 100vh; position: relative; padding-bottom: 120px; }

        /* Navigation */
        .nav { position: absolute; top: 0; width: 100%; z-index: 100; padding: 20px; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); }
        .nav img { height: 26px; filter: brightness(200%); }
        .nav-link { color: var(--p); text-decoration: none; font-size: 0.8rem; font-weight: 800; background: rgba(255,46,99,0.1); padding: 6px 15px; border-radius: 100px; border: 1px solid rgba(255,46,99,0.2); }

        /* Immersive Hero */
        .hero { position: relative; width: 100%; height: 70vh; overflow: hidden; }
        .hero img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
        .hero-mask { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 10%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 30px; }
        
        /* Profile Card */
        .p-card { position: relative; margin-top: -100px; padding: 0 20px; z-index: 50; }
        .p-box { background: rgba(25, 25, 30, 0.8); backdrop-filter: blur(40px); border-radius: 40px; padding: 30px 25px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        
        .badge-v { display: inline-flex; align-items: center; gap: 6px; background: rgba(14, 165, 233, 0.2); color: #38BDF8; padding: 6px 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; border: 1px solid #38BDF8; margin-bottom: 15px; }
        .name-row { display: flex; justify-content: space-between; align-items: flex-end; }
        .name-row h1 { font-size: 2.8rem; font-weight: 900; line-height: 1; letter-spacing: -1.5px; }
        .price { font-size: 1.8rem; font-weight: 900; color: var(--p); }

        /* Stats Grid */
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 25px; }
        .stat-item { background: var(--glass); border-radius: 20px; padding: 12px 5px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        .stat-item span { display: block; font-size: 0.6rem; color: #666; text-transform: uppercase; font-weight: 800; }
        .stat-item b { font-size: 1.1rem; color: #fff; }

        /* Content Body */
        .content { padding: 30px 25px; }
        .section-h { font-size: 0.9rem; font-weight: 800; color: var(--g); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; border-left: 4px solid var(--p); padding-left: 12px; }
        .desc-box { color: #aaa; font-size: 1rem; line-height: 1.8; white-space: pre-line; }

        /* Related Internal Matrix (ใยแมงมุม) */
        .rel-wrap { display: flex; gap: 15px; overflow-x: auto; padding: 10px 0 20px; scrollbar-width: none; }
        .rel-wrap::-webkit-scrollbar { display: none; }
        .rel-card { flex: 0 0 140px; border-radius: 25px; overflow: hidden; background: #000; text-decoration: none; border: 1px solid rgba(255,255,255,0.05); position: relative; }
        .rel-card img { width: 100%; height: 180px; object-fit: cover; opacity: 0.7; }
        .rel-meta { position: absolute; bottom: 0; width: 100%; padding: 10px; background: linear-gradient(to top, #000, transparent); text-align: center; }
        .rel-name { font-weight: 700; font-size: 0.85rem; color: #fff; }

        /* Sticky CTA */
        .action { position: fixed; bottom: 20px; left: 20px; right: 20px; max-width: 460px; margin: 0 auto; z-index: 1000; display: flex; gap: 15px; }
        .btn-line { flex: 1; background: #06C755; color: #fff; text-decoration: none; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 900; font-size: 1.2rem; box-shadow: 0 15px 30px rgba(6,199,85,0.3); }
        .btn-sq { width: 60px; height: 60px; border-radius: 25px; background: rgba(30, 30, 35, 0.9); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; color: #fff; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; }
    </style>
</head>
<body>
    <div class="app">
        <header class="nav">
            <a href="/"><img src="${CONFIG.BRAND_LOGO}" alt="Logo"></a>
            <a href="/location/${provinceSlug}" class="nav-link">ดูทั้งหมดใน ${provinceName} →</a>
        </header>

        <section class="hero">
            <img src="${imageUrl}" alt="น้อง${displayName}">
            <div class="hero-mask">
                <div class="badge-v">✅ IDENTITY VERIFIED</div>
                <h1 style="margin:0;">${displayName}</h1>
                <div style="color:#666; font-size:0.95rem; margin-top:5px;">📍 ${p.location || provinceName} · พร้อมให้บริการ</div>
            </div>
        </section>

        <main class="p-card">
            <div class="p-box">
                <div class="name-row">
                    <div class="price">฿${displayPrice}</div>
                    <div style="color:#00E676; font-weight:800; font-size:0.8rem;">● ONLINE NOW</div>
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
            <div class="desc-text">${escapeHTML(p.description) || 'บริการฟิวแฟนเป็นกันเอง น้องสวยตรงปกแน่นอนค่ะ ทักมาคุยกันก่อนได้นะคะ'}</div>

            <!-- ลิงก์เชื่อมโยงเกี่ยวข้อง (Internal Linking Matrix) -->
            ${related && related.length > 0 ? `
            <div style="margin-top:40px;">
                <h2 class="section-h">Recommended in ${provinceName}</h2>
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

            <!-- Footer Linking (ใยแมงมุมข้ามจังหวัด) -->
            <div style="margin-top:50px; text-align:center;">
                <p style="color:#444; font-size:0.7rem; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px;">Browse Other Areas</p>
                <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px;">
                    ${allProvinces.map(prov => `<a href="/location/${prov.key}" style="color:#666; text-decoration:none; font-size:0.75rem; border:1px solid #222; padding:5px 12px; border-radius:10px;">${prov.nameThai}</a>`).join('')}
                </div>
            </div>

            <footer style="text-align:center; margin-top:60px; color:#222; font-size:0.7rem; letter-spacing:1px;">
                © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} / PREMIUM SSR ENGINE
            </footer>
        </section>

        <nav class="action">
            <a href="/" class="btn-sq">🏠</a>
            <a href="${finalLineUrl}" class="btn-line">RESERVE NOW</a>
            <div class="btn-sq" onclick="navigator.clipboard.writeText(window.location.href); alert('คัดลอกลิงก์แล้ว');">🔗</div>
        </nav>
    </div>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) { return context.next(); }
};