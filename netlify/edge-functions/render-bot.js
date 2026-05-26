import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'SIDELINE CHIANGMAI',
    BRAND_LOGO: '/images/logo-sidelinechiangmai.webp',
    SOCIAL_LINKS: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
    }
};

// --- HELPER FUNCTIONS ---
const optimizeImg = (path, width = 600, height = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face/`);
    }
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=75`;
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
        
        // 1. Fetch Profile
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai, key, slug)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) return context.next();

        // 2. Fetch Related Profiles (Same Province)
        const { data: related } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, location, rate')
            .eq('provinceKey', p.provinceKey)
            .eq('active', true)
            .neq('id', p.id) 
            .limit(8);

        // 3. Logic for SEO & Content
        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const displayPrice = parseInt(p.rate || "1500").toLocaleString() + " ฿";
        const imageUrl = optimizeImg(p.imagePath, 800, 1000);
        
        const seed = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (seed % 3) / 10).toFixed(1);
        const reviewCount = 110 + (seed % 95);

        let finalLineUrl = p.lineId || 'ksLUWB89Y_';
        if (!finalLineUrl.startsWith('http')) finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;

        const pageTitle = `น้อง${displayName} ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน ตรงปก 100%`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // FAQ Schema
        const faqData = [
            { q: `จองคิว น้อง${displayName} มีค่ามัดจำไหม?`, a: "ไม่มีค่ามัดจำค่ะ ทางเราใช้ระบบจ่ายเงินหน้างาน 100% หลังจากเจอตัวน้องแล้วเท่านั้น" },
            { q: `พิกัดรับงานของ น้อง${displayName} อยู่แถวไหน?`, a: `น้องสะดวกให้บริการในโซน ${p.location || provinceName} และพื้นที่ใกล้เคียงค่ะ` }
        ];

        // --- HTML RENDER ---
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="รีวิว น้อง${displayName} ไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี งานดีตรงปก บริการฟิวแฟนพรีเมียม ปลอดภัย ไม่มัดจำ พิกัด${p.location || provinceName}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="theme-color" content="#07070A">
    <meta name="robots" content="index, follow, max-image-preview:large">

    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org/",
        "@graph": [
            {
                "@type": "Product",
                "name": "น้อง${displayName} | ไซด์ไลน์${provinceName}",
                "image": "${imageUrl}",
                "brand": { "@type": "Brand", "name": "${CONFIG.BRAND_NAME}" },
                "offers": {
                    "@type": "Offer",
                    "price": "${p.rate || '1500'}",
                    "priceCurrency": "THB",
                    "availability": "https://schema.org/InStock",
                    "url": "${canonicalUrl}"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "${ratingValue}",
                    "reviewCount": "${reviewCount}"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": ${JSON.stringify(faqData.map(f => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": { "@type": "Answer", "text": f.a }
                })))}
            }
        ]
    }
    </script>

    <style>
        :root {
            --brand-pink: #FF2E63;
            --brand-gold: #FF8E53;
            --brand-dark: #07070A;
            --brand-surface: #111116;
            --text-main: #FFFFFF;
            --text-muted: #94A3B8;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { 
            background-color: #020204; 
            background-image: radial-gradient(circle at 50% 0%, #0c0a15 0%, #050508 50%, #020204 100%);
            color: var(--text-main); 
            font-family: 'Prompt', sans-serif; 
            line-height: 1.6; 
            overflow-x: hidden;
        }

        .app-container { max-width: 500px; margin: 0 auto; background: var(--brand-dark); min-height: 100vh; position: relative; }

        /* Header Navigation */
        .navbar {
            position: absolute; top: 0; width: 100%; z-index: 100;
            padding: 1.2rem 1.5rem; display: flex; align-items: center; justify-content: space-between;
            background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
        }
        .navbar .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff; }
        .navbar .logo img { height: 28px; filter: brightness(200%); }

        /* Hero Image Section */
        .hero { position: relative; width: 100%; aspect-ratio: 3/4.2; background: #000; overflow: hidden; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; }
        .hero img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
        .hero-mask { 
            position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; 
            background: linear-gradient(to top, var(--brand-dark) 10%, rgba(7,7,10,0.4) 50%, transparent 100%); 
        }

        /* Profile Header */
        .profile-header { position: relative; padding: 0 1.5rem; margin-top: -100px; z-index: 50; }
        .text-gradient-luxury {
            background: linear-gradient(135deg, var(--brand-pink) 10%, var(--brand-gold) 50%, #FCF6BA 90%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .badge-row { display: flex; gap: 8px; margin-bottom: 12px; }
        .badge { 
            background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); 
            border: 1px solid rgba(255,255,255,0.1); padding: 5px 12px; 
            border-radius: 100px; font-size: 0.7rem; font-weight: 700; color: #fff;
            display: flex; align-items: center; gap: 6px;
        }
        .badge i { color: var(--brand-pink); }
        .badge.verified { border-color: #0EA5E9; color: #0EA5E9; }

        .name-title { font-size: 3rem; font-weight: 800; line-height: 1; letter-spacing: -1.5px; margin-bottom: 5px; }
        .price-display { font-size: 1.8rem; font-weight: 800; color: var(--brand-pink); }

        /* Trust Bar */
        .trust-bar { 
            display: grid; grid-template-columns: 1fr 1fr 1fr; 
            background: var(--brand-surface); padding: 1.2rem; border-radius: 24px; 
            margin: 1.5rem 0; border: 1px solid rgba(255,255,255,0.05); text-align: center;
        }
        .trust-item span { display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; }
        .trust-item strong { font-size: 1.1rem; color: #fff; font-weight: 700; }

        /* Content Sections */
        .content-body { padding: 0 1.5rem 120px; }
        .glass-card { 
            background: rgba(255,255,255,0.02); backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; 
            border-radius: 28px; margin-bottom: 1.5rem;
        }

        .section-label { 
            font-size: 0.85rem; font-weight: 800; color: var(--brand-pink); 
            text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; display: block;
        }

        /* Stats Grid */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 1.5rem; }
        .stat-box { background: rgba(255,255,255,0.03); border-radius: 16px; padding: 10px 5px; text-align: center; border: 1px solid rgba(255,255,255,0.03); }
        .stat-box small { display: block; font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; }
        .stat-box b { font-size: 1rem; color: #fff; }

        .description { color: #CBD5E1; font-size: 1rem; line-height: 1.8; white-space: pre-line; }

        /* Related Profiles Carousel */
        .related-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
        .related-scroll::-webkit-scrollbar { display: none; }
        .rel-card { flex: 0 0 140px; background: var(--brand-surface); border-radius: 20px; overflow: hidden; text-decoration: none; border: 1px solid rgba(255,255,255,0.05); }
        .rel-card img { width: 100%; height: 160px; object-fit: cover; }
        .rel-info { padding: 10px; text-align: center; }
        .rel-name { font-weight: 700; font-size: 0.85rem; color: #fff; display: block; }
        .rel-price { font-size: 0.75rem; color: var(--brand-pink); font-weight: 700; }

        /* Sticky Bottom CTA */
        .action-bar { 
            position: fixed; bottom: 15px; left: 15px; right: 15px; 
            max-width: 470px; margin: 0 auto; z-index: 1000;
            background: rgba(7, 7, 10, 0.85); backdrop-filter: blur(25px); 
            border-radius: 30px; padding: 10px; display: flex; gap: 10px;
            border: 1px solid rgba(255,255,255,0.1); shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .btn-main { 
            flex: 1; background: #06C755; color: #fff; text-decoration: none; 
            border-radius: 25px; display: flex; align-items: center; justify-content: center; 
            gap: 8px; font-weight: 800; font-size: 1rem; 
            box-shadow: 0 10px 20px rgba(6,199,85,0.3);
        }
        .btn-side { 
            width: 50px; height: 50px; border-radius: 22px; 
            background: rgba(255,255,255,0.05); color: #fff; 
            display: flex; align-items: center; justify-content: center; 
            text-decoration: none; border: 1px solid rgba(255,255,255,0.1); 
        }

        .pulse { width: 6px; height: 6px; border-radius: 50%; background: #00E676; box-shadow: 0 0 10px #00E676; animation: blink 2s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    </style>
</head>
<body>
    <div class="app-container">
        
        <header class="navbar">
            <a href="/" class="logo">
                <img src="${CONFIG.BRAND_LOGO}" alt="Logo">
                <span style="font-weight:800; font-size:1rem; letter-spacing:1px;">${CONFIG.BRAND_NAME}</span>
            </a>
            <a href="/" class="btn-side" style="width:36px; height:36px; border-radius:12px;">🏠</a>
        </header>

        <section class="hero">
            <img src="${imageUrl}" alt="น้อง${displayName}" loading="eager">
            <div class="hero-mask"></div>
        </section>

        <main class="profile-header">
            <div class="badge-row">
                <div class="badge verified"><i class="fas fa-check-circle"></i> VERIFIED</div>
                <div class="badge online"><div class="pulse"></div> พร้อมให้บริการ</div>
            </div>

            <div class="title-block">
                <h1 class="name-title text-gradient-luxury">${displayName}</h1>
                <div class="price-display">${displayPrice} <span style="font-size:0.9rem; color:var(--text-muted); font-weight:400;">/ 1 ชม.</span></div>
            </div>

            <div class="loc-row" style="color:var(--text-muted); font-size:0.9rem; margin: 10px 0 20px;">
                <i class="fas fa-map-marker-alt" style="color:var(--brand-gold);"></i> ${p.location || provinceName} · โซนยอดฮิต
            </div>

            <div class="trust-bar">
                <div class="trust-item"><span style="color:var(--brand-gold);">Rating</span><strong>⭐ ${ratingValue}</strong></div>
                <div class="trust-item"><span>Reviews</span><strong>${reviewCount}+</strong></div>
                <div class="trust-item"><span>Safety</span><strong>100%</strong></div>
            </div>
        </main>

        <section class="content-body">
            
            <div class="glass-card">
                <div class="stats-grid">
                    <div class="stat-box"><small>อายุ</small><b>${p.age || '22'}</b></div>
                    <div class="stat-box"><small>สูง</small><b>${p.height || '162'}</b></div>
                    <div class="stat-box"><small>หนัก</small><b>${p.weight || '46'}</b></div>
                    <div class="stat-box"><small>สัดส่วน</small><b>${p.proportion || '34-24-35'}</b></div>
                </div>
                <span class="section-label">ข้อมูลรายละเอียด</span>
                <div class="description">${escapeHTML(p.description) || 'ยินดีที่ได้รู้จักค่ะ น้องสวยตรงปกแน่นอน บริการฟิวแฟนเป็นกันเอง ไม่เหวี่ยง ไม่วีน ทักมาคุยกันก่อนได้นะคะ'}</div>
            </div>

            <div class="glass-card" style="background: linear-gradient(135deg, rgba(255,46,99,0.05) 0%, transparent 100%);">
                <span class="section-label" style="color:var(--brand-gold);">💎 กฎกติกา & ความปลอดภัย</span>
                <ul style="list-style:none; font-size:0.85rem; color:var(--text-muted);">
                    <li style="margin-bottom:8px;"><i class="fas fa-shield-alt" style="color:var(--brand-pink); margin-right:8px;"></i> จ่ายหน้างาน 100% ไม่ต้องโอนมัดจำ</li>
                    <li style="margin-bottom:8px;"><i class="fas fa-user-check" style="color:var(--brand-pink); margin-right:8px;"></i> รับประกันตรงปก ไม่ตรงปกยกเลิกได้ทันที</li>
                    <li><i class="fas fa-clock" style="color:var(--brand-pink); margin-right:8px;"></i> กรุณานัดจองล่วงหน้า 1-2 ชั่วโมง</li>
                </ul>
            </div>

            ${related && related.length > 0 ? `
            <div style="margin-top: 2rem;">
                <span class="section-label">น้องๆ แนะนำในโซนเดียวกัน</span>
                <div class="related-scroll">
                    ${related.map(r => `
                        <a href="/sideline/${r.slug}" class="rel-card">
                            <img src="${optimizeImg(r.imagePath, 300, 400)}" alt="${r.name}" loading="lazy">
                            <div class="rel-info">
                                <span class="rel-name">${r.name}</span>
                                <span class="rel-price">฿${parseInt(r.rate || 1500).toLocaleString()}</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <footer style="text-align:center; margin-top:3rem; padding-top:2rem; border-top:1px solid rgba(255,255,255,0.05);">
                <p style="font-size:0.75rem; color:var(--text-muted); opacity:0.6;">
                    © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}<br>
                    ENTITY ENGINEERING & SEO OPTIMIZED
                </p>
            </footer>
        </section>

        <!-- Dynamic Action Bar -->
        <nav class="action-bar">
            <a href="https://sidelinechiangmai.netlify.app" class="btn-side">
                <i class="fas fa-search"></i>
            </a>
            <a href="${finalLineUrl}" class="btn-main">
                <i class="fab fa-line" style="font-size:1.4rem;"></i>
                แอดไลน์จองคิว
            </a>
            <button onclick="shareProfile()" class="btn-side">
                <i class="fas fa-share-nodes"></i>
            </button>
        </nav>

    </div>

    <script>
        function shareProfile() {
            if (navigator.share) {
                navigator.share({
                    title: '${displayName}',
                    text: 'ดูโปรไฟล์น้อง ${displayName} ไซด์ไลน์ ${provinceName} ตรงปก 100%',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('คัดลอกลิงก์โปรไฟล์แล้วค่ะ!');
            }
        }
    </script>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow",
                "Cache-Control": "public, s-maxage=86400"
            }
        });

    } catch (e) {
        console.error("Critical Profile Render Error:", e);
        return context.next();
    }
};