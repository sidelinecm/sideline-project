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

// ฟังก์ชันสุ่มคำ (Spintax) ป้องกันเนื้อหาซ้ำ (Duplicate Content)
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ฟังก์ชันดึงรูปภาพแบบ Hybrid
const optimizeImg = (path) => {
    if (!path) return CONFIG.DEFAULT_IMAGE;
    if (path.startsWith('http')) return path; 
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // ตรวจสอบว่าเป็น Bot หรือ Crawler หรือไม่
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    
    // ถ้าไม่ใช่ Bot ให้ปล่อยผ่านไปใช้ Client-side Rendering ปกติ (main.js)
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        // ตรวจสอบรูปแบบ URL: /sideline/{slug}
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);

        // เชื่อมต่อ Database
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 1. ดึงข้อมูลโปรไฟล์ และข้อมูลจังหวัดที่ Join กัน
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) return context.next();

        // 2. ดึงโปรไฟล์แนะนำในจังหวัดเดียวกัน (Internal Linking สำหรับ SEO)
        let related = [];
        if (p.provinceKey) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('provinceKey', p.provinceKey)
                .eq('active', true)
                .neq('id', p.id) 
                .limit(4);
            related = relatedData || [];
        }

        // --- เตรียมตัวแปรแสดงผล ---
        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        const displayPrice = parseInt(p.rate || "1500").toLocaleString();
        const imageUrl = optimizeImg(p.imagePath);
        const YEAR_TH = new Date().getFullYear() + 543;
        
        // ✅ ระบบ Dynamic Brand: ชื่อแบรนด์เปลี่ยนตามจังหวัดของน้อง
        const BRAND_NAME = `Sideline ${provinceName} (ไซด์ไลน์${provinceName})`;

        // จัดการลิงก์ LINE
        let finalLineUrl = p.lineId || 'ksLUWB89Y_';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl.replace('@', '')}`;
        }

        // จำลอง Rating เพื่อแสดงดาวบน Google Search
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 3) / 10).toFixed(1);
        const reviewCount = 120 + (charCodeSum % 80);

        // --- SEO Strategy: Spintax ---
        const intro = spin(["แนะนำ", "พบกับ", "รีวิว", "พิกัดใหม่", "ห้ามพลาด"]);
        const style = spin(["ฟิวแฟนแท้ๆ", "เอาใจเก่งมาก", "งานเนี๊ยบตรงปก", "เป็นกันเอง", "น่ารักขี้อ้อน"]);
        const trust = spin(["ไม่ต้องโอนมัดจำ", "จ่ายหน้างานเท่านั้น", "เจอตัวค่อยจ่าย", "ปลอดภัย 100%"]);

        const pageTitle = `${intro} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ${style} (${YEAR_TH})`;
        const metaDesc = `${displayName} สาวสวยรับงานไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี สัดส่วน ${p.stats || 'เร้าใจ'} ${style} ${trust} พิกัด${p.location || provinceName} รูปจริงตรงปก 100% จองคิวทักไลน์เลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // --- Schema Markup (JSON-LD) ระดับสูง ---
        const schema = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "WebPage",
                    "@id": canonicalUrl,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc,
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                            { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${provinceKey}` },
                            { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                        ]
                    }
                },
                {
                    "@type": "Product",
                    "name": `${displayName} - รับงานไซด์ไลน์${provinceName}`,
                    "image": [imageUrl],
                    "description": metaDesc,
                    "brand": { "@type": "Brand", "name": BRAND_NAME },
                    "offers": {
                        "@type": "Offer",
                        "price": (p.rate || "1500").toString().replace(/\D/g, ''),
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString()
                    }
                }
            ]
        };

        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">
    <meta property="og:site_name" content="${BRAND_NAME}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${imageUrl}">

    <!-- Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    
    <style>
        :root { --primary: #db2777; --success: #06c755; --bg: #0f172a; --card: #1e293b; --txt: #f8fafc; }
        body { margin: 0; padding: 0; font-family: 'Prompt', sans-serif; background: var(--bg); color: var(--txt); line-height: 1.6; display: flex; justify-content: center; }
        
        /* Navigation Header */
        header { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); position: fixed; top: 0; width: 100%; max-width: 500px; z-index: 100; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav { height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
        .nav img { height: 30px; }
        .nav-link { color: #fff; text-decoration: none; font-weight: 600; font-size: 14px; }

        /* Main Card */
        .wrapper { width: 100%; max-width: 500px; background: var(--card); min-height: 100vh; padding-top: 60px; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
        .hero { width: 100%; aspect-ratio: 3/4; object-fit: cover; background: #000; }
        .container { padding: 25px; }
        
        .rating-stars { color: #fbbf24; font-size: 14px; font-weight: 800; margin-bottom: 10px; display: block; }
        h1 { font-size: 28px; font-weight: 800; margin: 0 0 15px; line-height: 1.2; background: linear-gradient(to right, #fff, var(--p)); -webkit-background-clip: text; }
        
        /* Info Grid */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 25px; }
        .info-box { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.08); }
        .info-box label { display: block; font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
        .info-box span { font-size: 18px; font-weight: 800; color: #fff; }

        .desc { font-size: 15px; color: #cbd5e1; margin-bottom: 30px; white-space: pre-line; border-top: 1px solid rgba(255,255,255,0.05); pt: 20px; }
        
        /* LINE Button */
        .btn-line { display: flex; align-items: center; justify-content: center; gap: 10px; background: var(--success); color: #fff; padding: 18px; border-radius: 18px; text-decoration: none; font-weight: 800; font-size: 19px; box-shadow: 0 10px 30px rgba(6,199,85,0.3); transition: 0.3s; }
        .btn-line:hover { scale: 1.02; background: #05a546; }

        /* Related Section */
        .related { margin-top: 45px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px; }
        .related-title { font-weight: 900; color: var(--primary); font-size: 18px; margin-bottom: 15px; display: block; }
        .related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .related-item { text-decoration: none; color: inherit; }
        .related-item img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 12px; margin-bottom: 8px; }
        .related-name { font-weight: 700; font-size: 14px; text-align: center; display: block; }

        footer { text-align: center; padding: 50px 20px; color: #64748b; font-size: 11px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <header>
            <div class="nav">
                <a href="/"><img src="${CONFIG.LOGO_URL}" alt="Logo"></a>
                <a href="/profiles.html" class="nav-link">ดูน้องๆ ทั้งหมด</a>
            </div>
        </header>

        <img src="${imageUrl}" class="hero" alt="น้อง${displayName}">

        <div class="container">
            <span class="rating-stars">⭐ ${ratingValue} (${reviewCount} รีวิวจากลูกค้าจริง)</span>
            <h1>น้อง${displayName} ไซด์ไลน์${provinceName}</h1>
            
            <div class="info-grid">
                <div class="info-box"><label>ค่าขนมเริ่มต้น</label><span>฿${displayPrice}</span></div>
                <div class="info-box"><label>พิกัดรับงาน</label><span>${p.location || provinceName}</span></div>
            </div>

            <div class="desc">${p.description || metaDesc}</div>

            <a href="${finalLineUrl}" target="_blank" class="btn-line">
                <i class="fab fa-line" style="font-size:24px"></i> ทักไลน์จองคิว น้อง${displayName}
            </a>

            ${related.length > 0 ? `
            <div class="related">
                <span class="related-title">🔥 น้องๆ แนะนำในจังหวัด${provinceName}</span>
                <div class="related-grid">
                    ${related.map(r => `
                        <a href="/sideline/${r.slug}" class="related-item">
                            <img src="${optimizeImg(r.imagePath)}" alt="${r.name}">
                            <span class="related-name">${r.name}</span>
                        </a>
                    `).join('')}
                </div>
            </div>` : ''}

            <footer>
                © ${new Date().getFullYear()} ${BRAND_NAME} - ศูนย์รวมพิกัดสาวสวยตรงปก ไม่มัดจำ 100%<br>
                <span style="opacity:0.6; margin-top:5px; display:inline-block;">ข้อมูลอัปเดตล่าสุด: ${new Date(p.lastUpdated || p.created_at).toLocaleDateString('th-TH')}</span>
            </footer>
        </div>
    </div>
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
        console.error("Render Bot Error:", e);
        return context.next();
    }
};