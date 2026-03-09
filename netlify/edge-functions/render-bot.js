import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    LOGO_URL: 'https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp',
    DEFAULT_IMAGE: 'https://sidelinechiangmai.netlify.app/images/sidelinechiangmai-social-preview.webp'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path, isOG = false) => {
    if (!path) return CONFIG.DEFAULT_IMAGE;
    if (path.includes('res.cloudinary.com')) {
        const transform = isOG ? 'c_fill,w_800,h_1000,q_auto,f_auto' : 'c_scale,w_800,q_auto,f_auto';
        return path.replace('/upload/', `/upload/${transform}/`);
    }
    if (path.startsWith('http')) return path; 
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const formatLineUrl = (lineId) => {
    if (!lineId) return 'https://line.me/ti/p/ksLUWB89Y_';
    if (lineId.startsWith('http')) return lineId; 
    const cleanId = lineId.replace('@', '');
    return lineId.includes('@') ? `https://line.me/ti/p/~${cleanId}` : `https://line.me/ti/p/${cleanId}`;  
};

const fetchWithTimeout = (promise, ms = 4000) => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Database Request Timeout')), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|lighthouse|headless/i.test(ua);
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p } = await fetchWithTimeout(
            supabase.from('profiles').select('*, provinces(nameThai, key)').eq('slug', slug).eq('active', true).maybeSingle(),
            4000
        );

        if (!p) return context.next();

        let related =[];
        if (p.provinceKey) {
            const { data: relatedData } = await fetchWithTimeout(
                supabase.from('profiles').select('slug, name, imagePath, location').eq('provinceKey', p.provinceKey).eq('active', true).neq('id', p.id).order('availability', { ascending: false }).limit(4),
                2500
            );
            related = relatedData ||[];
        }

        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        const currentYearTH = new Date().getFullYear() + 543;
        const BRAND_NAME = `Sideline ${provinceName}`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;
        const ogImageUrl = optimizeImg(p.imagePath, true);
        const imageUrl = optimizeImg(p.imagePath, false);
        const finalLineUrl = formatLineUrl(p.lineId);
        
        const style = spin(["ฟิวแฟนแท้ๆ", "เอาใจเก่งมาก", "งานเนี๊ยบตรงปก", "สายอ้อนคุยสนุก"]);
        const trust = spin(["ไม่ต้องโอนมัดจำ", "จ่ายหน้างานเท่านั้น", "ปลอดภัย 100%"]);
        
        const rawPrice = (p.rate || "1500").toString().replace(/\D/g, '');
        let numericPrice = parseInt(rawPrice) || 1500;
        if (numericPrice > 20000) numericPrice = 1500; 

        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.5 + ((charCodeSum % 50) / 100)).toFixed(1); 
        const reviewCount = 85 + (charCodeSum % 120);
        
        const pageTitle = `น้อง${displayName} รับงานไซด์ไลน์${provinceName} - ${style} (${currentYearTH})`;
        const metaDesc = `น้อง${displayName} ${provinceName} รับงาน${style} ${trust} พิกัดรับงาน: ${p.location || provinceName} ตรงปก ไม่มัดจำ ดูรูปโปรไฟล์เต็มๆ ได้ที่นี่!`;

       // 🌟 Schema อัปเดตล่าสุด (แก้ Error Person Review)
        const schema = {
            "@context": "https://schema.org/",
            "@graph":[
                {
                    "@type": "ProfilePage",
                    "@id": `${canonicalUrl}#webpage`,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc,
                    "mainEntity": { "@id": `${canonicalUrl}#person` }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement":[
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${provinceKey}` },
                        { "@type": "ListItem", "position": 3, "name": `น้อง${displayName}`, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": ["Person", "LocalBusiness"], // 👈 ทริคสำคัญ: รวม Person เข้ากับ LocalBusiness
                    "@id": `${canonicalUrl}#person`,
                    "name": `น้อง${displayName}`,
                    "image": ogImageUrl,
                    "jobTitle": "Freelance Entertainer",
                    "priceRange": "฿฿", // 👈 บังคับใส่เมื่อมี LocalBusiness
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": p.location || provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": numericPrice.toString(),
                        "priceCurrency": "THB",
                        "availability": (p.availability && p.availability.includes('ไม่ว่าง')) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                        "url": canonicalUrl
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString(),
                        "bestRating": "5.0",
                        "worstRating": "4.0"
                    },
                    "brand": { "@type": "Brand", "name": BRAND_NAME },
                    "knowsLanguage": ["Thai"]
                }
            ]
        };

        // 📱 HTML Template
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- SEO -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="theme-color" content="#0f172a">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:image:alt" content="โปรไฟล์น้อง${displayName} ไซด์ไลน์${provinceName}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="1600">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">
    <meta property="og:site_name" content="Sideline ${provinceName}">
    <meta property="og:locale" content="th_TH">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${ogImageUrl}">

    <!-- Preload Critical Resources -->
    <link rel="preload" href="${imageUrl}" as="image" fetchpriority="high">
    <link rel="preload" href="${CONFIG.LOGO_URL}" as="image" fetchpriority="high">
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">

    <!-- Structured Data -->
    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
    
    <style>
        /* 🎨 CSS (Same as before) */
        :root {
            --primary: #db2777; --primary-dark: #be185d;
            --success: #06c755; --success-dark: #059669;
            --bg: #0f172a; --card: #1e293b; --card-hover: #334155;
            --txt: #f8fafc; --txt-muted: #cbd5e1; --border: rgba(255,255,255,0.08);
        }

        *, *::before, *::after { box-sizing: border-box; }
        
        body {
            margin: 0; padding: 0; 
            font-family: 'Prompt', -apple-system, sans-serif;
            background: var(--bg); color: var(--txt);
            line-height: 1.6; overflow-x: hidden;
            display: flex; justify-content: center;
            contain: layout style;
        }
        
        header {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: saturate(180%) blur(20px);
            position: fixed; top: 0; width: 100%; max-width: 500px;
            z-index: 100; border-bottom: 1px solid var(--border);
            contain: layout style;
        }
        
        .nav {
            height: clamp(56px, 8vh, 64px);
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 clamp(16px, 4vw, 24px);
            contain: layout style;
        }
        
        .nav img { height: 28px; width: auto; }
        .nav-link {
            color: var(--txt); text-decoration: none;
            font-weight: 600; font-size: clamp(13px, 2.5vw, 15px);
            transition: opacity 0.2s ease;
        }
        .nav-link:hover { opacity: 0.8; }

        .wrapper {
            width: 100%; max-width: 500px;
            background: var(--card); min-height: 100vh;
            padding-top: 64px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
            display: flex; flex-direction: column;
            contain: layout style;
        }
        
        .hero {
            width: 100%; aspect-ratio: 3/4;
            object-fit: cover; background: #000;
            contain: layout style paint;
            loading: eager;
        }
        
        main { padding: clamp(20px, 5vw, 28px); flex-grow: 1; contain: layout style; }
        
        h1 {
            font-size: clamp(22px, 6vw, 28px); font-weight: 800;
            margin: 0 0 16px; line-height: 1.25;
            background: linear-gradient(135deg, var(--txt), var(--primary));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .tags-wrap {
            display: flex; flex-wrap: wrap; gap: 8px;
            margin-bottom: 24px; contain: layout style;
        }
        .tag {
            background: rgba(219,39,119,0.2); color: #f472b6;
            font-size: 12px; padding: 6px 12px; border-radius: 50px;
            font-weight: 600; backdrop-filter: blur(10px);
        }

        .info-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: clamp(10px, 3vw, 14px); margin-bottom: 28px;
        }
        .info-box {
            background: rgba(255,255,255,0.05);
            padding: clamp(14px, 4vw, 18px); border-radius: 16px;
            border: 1px solid var(--border); backdrop-filter: blur(10px);
            transition: all 0.2s ease;
        }
        .info-box:hover { background: rgba(255,255,255,0.08); transform: translateY(-1px); }
        .info-box label {
            display: block; font-size: 11px; color: #94a3b8;
            font-weight: 700; margin-bottom: 6px; text-transform: uppercase;
        }
        .info-box span {
            font-size: clamp(16px, 4vw, 20px); font-weight: 800; color: var(--txt);
        }

        .desc {
            font-size: clamp(14px, 3.5vw, 16px); color: var(--txt-muted);
            margin-bottom: 32px; padding: 24px;
            background: rgba(255,255,255,0.02); border-radius: 20px;
            border: 1px solid var(--border); white-space: pre-line;
        }
        
        .btn-line {
            display: flex; align-items: center; justify-content: center; gap: 12px;
            background: linear-gradient(135deg, var(--success), var(--success-dark));
            color: #fff; padding: clamp(16px, 5vw, 20px); border-radius: 20px;
            text-decoration: none; font-weight: 800; font-size: clamp(16px, 4vw, 18px);
            box-shadow: 0 12px 32px rgba(6,199,85,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            contain: layout style;
        }
        .btn-line:hover {
            transform: translateY(-3px); box-shadow: 0 20px 40px rgba(6,199,85,0.4);
            background: linear-gradient(135deg, #059669, #047857);
        }
        .btn-line i { font-size: 24px; }

        .related {
            margin-top: 48px; padding-top: 32px;
            border-top: 1px solid var(--border);
        }
        .related-title {
            font-weight: 800; color: var(--txt); font-size: clamp(16px, 4vw, 18px);
            margin-bottom: 20px; display: block;
        }
        .related-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: clamp(12px, 3vw, 16px);
        }
        .related-item {
            text-decoration: none; color: inherit;
            background: rgba(0,0,0,0.3); border-radius: 16px;
            padding: 12px; border: 1px solid transparent;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            contain: layout style;
        }
        .related-item:hover {
            border-color: var(--primary); background: rgba(219,39,119,0.1);
            transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.3);
        }
        .related-item img {
            width: 100%; aspect-ratio: 1/1; object-fit: cover;
            border-radius: 12px; margin-bottom: 10px; loading: lazy;
        }
        .related-name {
            font-weight: 700; font-size: 13px; text-align: center;
            display: block; line-height: 1.3;
        }

        footer {
            text-align: center; padding: 40px 24px 32px;
            color: #64748b; font-size: 12px; border-top: 1px solid var(--border);
        }

        .sr-only {
            position: absolute; width: 1px; height: 1px;
            padding: 0; margin: -1px; overflow: hidden;
            clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { animation-duration: 0.01ms !important; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <header>
            <div class="nav">
                <a href="/" aria-label="หน้าแรก" rel="home">
                    <img src="${CONFIG.LOGO_URL}" alt="Logo Sideline Thailand" width="120" height="24" loading="lazy">
                </a>
                <a href="/location/${provinceKey}" class="nav-link" rel="section">
                    ดูน้องๆ ${provinceName} ทั้งหมด
                </a>
            </div>
        </header>

        <img src="${imageUrl}" class="hero" 
             alt="น้อง${displayName} รับงานไซด์ไลน์${provinceName} - ตรงปก ${style}" 
             width="500" height="667" 
             decoding="async">

        <main>
            <h1>น้อง${displayName}<br>ไซด์ไลน์${provinceName}<br>${style}</h1>
            
            ${p.styleTags && p.styleTags.length > 0 ? `
            <div class="tags-wrap" aria-label="สไตล์การบริการ">
                ${p.styleTags.slice(0, 8).map(tag => `<span class="tag">#${tag.trim()}</span>`).join('')}
            </div>
            ` : ''}

            <h2 class="sr-only">ข้อมูลบริการ</h2>
            <div class="info-grid">
                <div class="info-box" aria-labelledby="price-label">
                    <label id="price-label">ค่าขนมเริ่มต้น</label>
                    <span>฿${numericPrice.toLocaleString('th-TH')}</span>
                </div>
                <div class="info-box" aria-labelledby="location-label">
                    <label id="location-label">พิกัดรับงาน</label>
                    <span>${(p.location || provinceName).trim()}</span>
                </div>
            </div>

            <h2 class="sr-only">รายละเอียด</h2>
            <article class="desc" aria-labelledby="desc-title">
                <h3 id="desc-title" class="sr-only">รายละเอียดและประสบการณ์</h3>
                ${(p.description || metaDesc).split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .map(line => `<p>${line}</p>`)
                    .join('')}
            </article>

            <a href="${finalLineUrl}" target="_blank" rel="noopener noreferrer me external" 
               class="btn-line" aria-label="ทัก LINE จองคิวกับน้อง${displayName}">
                <i class="fab fa-line"></i> 
                ทัก LINE จองคิว<br>น้อง${displayName}
            </a>

            ${related.length > 0 ? `
            <section class="related" aria-labelledby="related-title">
                <h2 id="related-title" class="related-title">
                    🔥 น้องๆ แนะนำใน ${provinceName}
                </h2>
                <div class="related-grid">
                    ${related.slice(0, 6).map(r => `
                        <a href="/sideline/${r.slug}" class="related-item" 
                           aria-label="ดูโปรไฟล์น้อง ${r.name}">
                            <img src="${optimizeImg(r.imagePath, false)}" 
                                 alt="${r.name} ไซด์ไลน์${provinceName}" 
                                 loading="lazy" width="200" height="200">
                            <h3 class="related-name">${r.name}</h3>
                        </a>
                    `).join('')}
                </div>
            </section>
            ` : ''}
        </main>
        
        <footer>
            <p>© ${new Date().getFullYear()} Sideline ${provinceName} - 
               แพลตฟอร์มคุณภาพ ตรงปก จ่ายหน้างาน</p>
            <p style="opacity:0.6; margin-top:8px; font-size:11px;">
                Disclaimer: จัดทำเพื่อการโฆษณา ไม่เกี่ยวข้องกิจกรรมผิดกฎหมาย
            </p>
            <p style="opacity:0.4; margin-top:4px; font-size:10px;">
                อัปเดต: ${new Date(p.lastUpdated || p.created_at || Date.now())
                    .toLocaleDateString('th-TH', { 
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    })}
            </p>
        </footer>
    </div>
</body>
</html>`;


        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow, max-image-preview:large",
                "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800"
            } 
        });

    } catch (e) {
        console.error("Render Bot Fallback Triggered:", e.message);
        return context.next();
    }
};