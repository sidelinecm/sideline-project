import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    LOGO_URL: 'https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp',
    DEFAULT_IMAGE: 'https://sidelinechiangmai.netlify.app/images/sidelinechiangmai-social-preview.webp'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// [อัปเกรด] Image Optimization รองรับ Cloudinary สำหรับ OG Tags
const optimizeImg = (path, isOG = false) => {
    if (!path) return CONFIG.DEFAULT_IMAGE;
    if (path.includes('res.cloudinary.com')) {
        const transform = isOG ? 'c_fill,w_800,h_1000,q_auto,f_auto' : 'c_scale,w_800,q_auto,f_auto';
        return path.replace('/upload/', `/upload/${transform}/`);
    }
    if (path.startsWith('http')) return path; 
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

// [อัปเกรด] ฟังก์ชันกรอง LINE URL ให้ถูกต้อง
const formatLineUrl = (lineId) => {
    if (!lineId) return 'https://line.me/ti/p/ksLUWB89Y_';
    if (lineId.startsWith('http')) return lineId; 
    const cleanId = lineId.replace('@', '');
    return lineId.includes('@') 
        ? `https://line.me/ti/p/~${cleanId}`  
        : `https://line.me/ti/p/${cleanId}`;  
};

// 🛡️ [อัปเกรดความปลอดภัย] ฟังก์ชันสับสวิตช์ (Circuit Breaker) ตัดจบถ้าฐานข้อมูลค้าง
const fetchWithTimeout = (promise, ms = 4000) => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Database Request Timeout')), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // ดักจับ Bot แบบครอบคลุม
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|lighthouse|headless/i.test(ua);
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 🛡️ ใช้ fetchWithTimeout กำหนดเวลาดึงข้อมูลหลัก 4 วินาที
        const { data: p } = await fetchWithTimeout(
            supabase
                .from('profiles')
                .select('*, provinces(nameThai, key)')
                .eq('slug', slug)
                .eq('active', true)
                .maybeSingle(),
            4000
        );

        if (!p) return context.next();

        // 🛡️ ใช้ fetchWithTimeout กำหนดเวลาดึงเด็กแนะนำ 2.5 วินาที
        let related =[];
        if (p.provinceKey) {
            const { data: relatedData } = await fetchWithTimeout(
                supabase
                    .from('profiles')
                    .select('slug, name, imagePath')
                    .eq('provinceKey', p.provinceKey)
                    .eq('active', true)
                    .neq('id', p.id) 
                    .limit(4),
                2500
            );
            related = relatedData ||[];
        }

        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        
        // แยกตัวเลขราคาออกจาก text ป้องกันบั๊ก
        const rawPrice = (p.rate || "1500").toString().replace(/\D/g, '');
        const numericPrice = rawPrice ? parseInt(rawPrice) : 1500;
        
        const imageUrl = optimizeImg(p.imagePath, false);
        const ogImageUrl = optimizeImg(p.imagePath, true);
        // ปีปัจจุบันตาม พ.ศ. (บวกด้วย 1 เพื่อตั้งค่าวันหมดอายุราคาในปีหน้า)
        const currentYearTH = new Date().getFullYear() + 543;
        const BRAND_NAME = `Sideline ${provinceName}`;
        const finalLineUrl = formatLineUrl(p.lineId);

        // เปลี่ยนสมการสุ่ม Rating ให้ดูเป็นธรรมชาติ (4.5 - 5.0)
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.5 + ((charCodeSum % 50) / 100)).toFixed(1); 
        const reviewCount = 85 + (charCodeSum % 120);

        const intro = spin(["พิกัดใหม่", "รีวิว", "แนะนำ", "ห้ามพลาด", "พบกับ"]);
        const style = spin(["ฟิวแฟนแท้ๆ", "เอาใจเก่งมาก", "งานเนี๊ยบตรงปก", "สายอ้อนคุยสนุก", "ตรงปกไม่จกตา"]);
        const trust = spin(["ไม่ต้องโอนมัดจำ", "จ่ายหน้างานเท่านั้น", "เจอตัวค่อยจ่ายปลอดภัย", "จ่ายเงินตอนเจอ 100%"]);

        const pageTitle = `${intro} ${displayName} ไซด์ไลน์${provinceName} ${p.location || ''} ${style} (${currentYearTH})`;
        
        let baseDesc = p.description ? p.description.trim() : '';
        if (baseDesc.length < 50) {
            baseDesc = `น้อง${displayName} สาวสวยรับงานไซด์ไลน์${provinceName} อายุ ${p.age || '20+'} ปี หุ่นดีสัดส่วน ${p.stats || 'น่าค้นหา'} ${style}`;
        }
        const metaDesc = `${baseDesc} ${trust} พิกัดรับงาน: ${p.location || provinceName} จองคิวทักไลน์เลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // 👑 [Ultimate Schema] เทคนิค Multi-Entity ผูก 'Person' เข้ากับ 'Product'
        const schema = {
            "@context": "https://schema.org/",
            "@graph":[
                {
                    "@type": "ProfilePage",
                    "@id": `${canonicalUrl}#webpage`,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc,
                    "isPartOf": { "@type": "WebSite", "@id": `${CONFIG.DOMAIN}/#website` },
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement":[
                            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                            { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${provinceKey}` },
                            { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                        ]
                    }
                },
                {
                    "@type": ["Person", "Product"], 
                    "@id": `${canonicalUrl}#person`,
                    "name": `น้อง${displayName}`,
                    "gender": "Female",
                    "image": ogImageUrl,
                    "description": metaDesc,
                    "jobTitle": "Freelance Model & Entertainer",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": p.location || provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "brand": { "@type": "Brand", "name": BRAND_NAME },
                    "offers": {
                        "@type": "Offer",
                        "price": numericPrice.toString(),
                        "priceCurrency": "THB",
                        "availability": (p.availability?.includes('ไม่ว่าง') || p.availability?.includes('ติดจอง')) 
                                        ? "https://schema.org/OutOfStock" 
                                        : "https://schema.org/InStock",
                        "url": canonicalUrl,
                        "priceValidUntil": `${new Date().getFullYear() + 1}-12-31`
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString()
                    }
                }
            ]
        };

        // 🏗️ Semantic HTML5 + Inline CSS ที่รองรับ AI แบบสมบูรณ์
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#0f172a">
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">
    <meta property="og:site_name" content="${BRAND_NAME}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${ogImageUrl}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    
    <style>
        :root { --primary: #db2777; --success: #06c755; --bg: #0f172a; --card: #1e293b; --txt: #f8fafc; }
        body { margin: 0; padding: 0; font-family: 'Prompt', sans-serif; background: var(--bg); color: var(--txt); line-height: 1.6; display: flex; justify-content: center; }
        
        header { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); position: fixed; top: 0; width: 100%; max-width: 500px; z-index: 100; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav { height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
        .nav img { height: 30px; width: auto; }
        .nav-link { color: #fff; text-decoration: none; font-weight: 600; font-size: 14px; }

        .wrapper { width: 100%; max-width: 500px; background: var(--card); min-height: 100vh; padding-top: 60px; box-shadow: 0 0 50px rgba(0,0,0,0.5); display: flex; flex-direction: column; }
        .hero { width: 100%; aspect-ratio: 3/4; object-fit: cover; background: #000; }
        main { padding: 25px; flex-grow: 1; }
        
        .rating-stars { color: #fbbf24; font-size: 14px; font-weight: 800; margin-bottom: 10px; display: block; }
        h1 { font-size: 26px; font-weight: 800; margin: 0 0 15px; line-height: 1.3; background: linear-gradient(to right, #fff, var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
        .tag { background: rgba(219,39,119,0.15); color: #f472b6; font-size: 12px; padding: 4px 10px; border-radius: 100px; font-weight: 600;}

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 25px; }
        .info-box { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .info-box label { display: block; font-size: 11px; color: #94a3b8; font-weight: 700; margin-bottom: 4px; }
        .info-box span { font-size: 18px; font-weight: 800; color: #fff; }

        .desc { font-size: 15px; color: #cbd5e1; margin-bottom: 30px; white-space: pre-line; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; }
        
        .btn-line { display: flex; align-items: center; justify-content: center; gap: 10px; background: var(--success); color: #fff; padding: 16px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 18px; box-shadow: 0 8px 25px rgba(6,199,85,0.3); transition: transform 0.3s; }
        .btn-line:hover { transform: translateY(-2px); background: #05a546; }

        .related { margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 25px; }
        .related-title { font-weight: 800; color: #fff; font-size: 16px; margin-bottom: 15px; display: block; }
        .related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .related-item { text-decoration: none; color: inherit; background: rgba(0,0,0,0.2); border-radius: 10px; padding: 8px; border: 1px solid transparent; transition: border 0.3s;}
        .related-item:hover { border-color: var(--primary); }
        .related-item img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px; margin-bottom: 8px; }
        .related-name { font-weight: 700; font-size: 13px; text-align: center; display: block; }

        footer { text-align: center; padding: 40px 20px 30px; color: #64748b; font-size: 11px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <header>
            <div class="nav">
                <a href="/" aria-label="หน้าแรก"><img src="${CONFIG.LOGO_URL}" alt="Logo" width="120" height="24"></a>
                <a href="/location/${provinceKey}" class="nav-link">ดูน้องๆ ${provinceName}</a>
            </div>
        </header>

        <img src="${imageUrl}" class="hero" alt="น้อง${displayName} รับงาน${provinceName}" width="500" height="666">

        <main>
            <span class="rating-stars">⭐ ${ratingValue} (${reviewCount} รีวิวจากลูกค้า)</span>
            <h1>น้อง${displayName} ไซด์ไลน์${provinceName}</h1>
            
            ${p.styleTags && p.styleTags.length > 0 ? `
            <div class="tags-wrap">
                ${p.styleTags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>` : ''}
            
            <div class="info-grid">
                <div class="info-box"><label>ค่าขนมเริ่มต้น</label><span>฿${numericPrice.toLocaleString()}</span></div>
                <div class="info-box"><label>พิกัดรับงาน</label><span>${p.location || provinceName}</span></div>
            </div>

            <article class="desc">${p.description || metaDesc}</article>

            <a href="${finalLineUrl}" target="_blank" rel="noopener noreferrer" class="btn-line" aria-label="ทักไลน์น้อง${displayName}">
                <i class="fab fa-line" style="font-size:24px"></i> ทักไลน์จองคิว น้อง${displayName}
            </a>

            ${related.length > 0 ? `
            <section class="related">
                <span class="related-title">🔥 น้องๆ แนะนำในจังหวัด${provinceName}</span>
                <div class="related-grid">
                    ${related.map(r => `
                        <a href="/sideline/${r.slug}" class="related-item">
                            <img src="${optimizeImg(r.imagePath, false)}" alt="${r.name}" loading="lazy" width="200" height="200">
                            <span class="related-name">${r.name}</span>
                        </a>
                    `).join('')}
                </div>
            </section>` : ''}
        </main>
        
        <footer>
            <p>© ${new Date().getFullYear()} ${BRAND_NAME} - ศูนย์รวมพิกัดสาวสวยตรงปก</p>
            <p style="opacity:0.6; margin-top:5px;">อัปเดตข้อมูลล่าสุด: ${new Date(p.lastUpdated || p.created_at).toLocaleDateString('th-TH')}</p>
        </footer>
    </div>
</body>
</html>`;

        // 🚀 คืนค่า Response พร้อม Edge Caching ขั้นสุด
        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow, max-image-preview:large",
                "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800"
            } 
        });

    } catch (e) {
        // 🛡️ หากเกิด Error (เช่น Timeout หรือ ฐานข้อมูลล่ม) 
        // ปล่อยผ่านให้ Netlify ไปดึงไฟล์ Index.html มารัน Client-side ตามปกติ ไม่ให้เว็บล่ม
        console.error("Render Bot Fallback Triggered:", e.message);
        return context.next();
    }
};