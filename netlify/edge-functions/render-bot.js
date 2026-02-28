import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    // BRAND_NAME เดิมถูกลบออก เพื่อไปใช้แบบ Dynamic ตามจังหวัดของน้อง
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith('http')) return path; 
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) return context.next();

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

        // --- เตรียมข้อมูล Dynamic ---
        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        const displayPrice = parseInt(p.rate || "1500").toLocaleString();
        const imageUrl = optimizeImg(p.imagePath);
        const CURRENT_YEAR = new Date().getFullYear() + 543;

        // ✅ แก้ไข: ชื่อแบรนด์ต้องเปลี่ยนตามจังหวัดของน้องคนนั้นๆ
        const DYNAMIC_BRAND = `Sideline ${provinceName}`;

        let finalLineUrl = p.lineId || 'ksLUMz3p_o';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;
        }

        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        const titleIntro = spin(["แนะนำ", "รีวิว", "พบกับ", "มาแรง", "ห้ามพลาด"]);
        const serviceWord = spin(["บริการฟิวแฟน", "เอาใจเก่ง", "งานดีตรงปก", "เป็นกันเอง", "ขี้อ้อน"]);
        const payWord = spin(["ไม่รับมัดจำ", "จ่ายหน้างานเท่านั้น", "เจอตัวค่อยจ่าย", "ปลอดภัย 100%"]);
        
        const pageTitle = `${titleIntro} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน ตรงปก (${CURRENT_YEAR})`;
        const metaDesc = `${displayName} รับงานไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี ${serviceWord} ${payWord} พิกัด${p.location || provinceName} รูปจริงตรงปก 100% จองคิวทักไลน์เลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // --- Schema Markup (JSON-LD) ---
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "WebPage",
                    "@id": canonicalUrl,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc
                },
                {
                    "@type": "Product",
                    "name": `${displayName} - ไซด์ไลน์${provinceName}`,
                    "image": [imageUrl],
                    "description": metaDesc,
                    "brand": { "@type": "Brand", "name": DYNAMIC_BRAND },
                    "offers": {
                        "@type": "Offer",
                        "price": (p.rate || "1500").toString().replace(/[^0-9]/g, ''),
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl,
                        "priceValidUntil": "2026-12-31"
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
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${DYNAMIC_BRAND}">

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root { --primary: #db2777; --success: #06c755; --dark: #0f172a; --card: #1e293b; }
        body { margin: 0; padding: 0; font-family: -apple-system, sans-serif; background: var(--dark); color: #f8fafc; line-height: 1.6; }
        .container { max-width: 500px; margin: 0 auto; background: var(--card); min-height: 100vh; }
        .hero-img { width: 100%; height: auto; display: block; aspect-ratio: 3/4; object-fit: cover; }
        .content { padding: 25px; }
        .rating { color: #fbbf24; font-weight: 800; font-size: 14px; margin-bottom: 10px; }
        h1 { color: #fff; font-size: 26px; margin: 0 0 20px 0; font-weight: 900; line-height: 1.2; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
        .info-item { background: rgba(255,255,255,0.05); border-radius: 15px; padding: 15px; border: 1px solid rgba(255,255,255,0.1); }
        .info-item label { display: block; font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
        .info-item span { font-size: 18px; font-weight: 800; color: #fff; }
        .desc { font-size: 15px; color: #cbd5e1; margin-bottom: 30px; white-space: pre-line; }
        .btn-line { display: flex; align-items: center; justify-content: center; background: var(--success); color: #fff; padding: 18px; border-radius: 15px; text-decoration: none; font-weight: 800; font-size: 18px; box-shadow: 0 10px 20px rgba(6,199,85,0.3); }
        .related-title { font-weight: 900; color: var(--primary); display: block; margin: 40px 0 20px; font-size: 18px; }
        .related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .related-card { text-decoration: none; color: inherit; }
        .related-card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 15px; }
        .related-name { font-weight: 700; margin-top: 10px; font-size: 14px; }
        .footer { text-align: center; font-size: 11px; color: #64748b; margin-top: 50px; padding-bottom: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" class="hero-img" alt="${displayName}">
        <div class="content">
            <div class="rating">⭐ ${ratingValue} (${reviewCount} รีวิว)</div>
            <h1>${displayName} - ไซด์ไลน์${provinceName}</h1>
            <div class="info-grid">
                <div class="info-item"><label>ค่าขนม</label><span>฿${displayPrice}</span></div>
                <div class="info-item"><label>พิกัด</label><span>${p.location || provinceName}</span></div>
            </div>
            <div class="desc">${p.description || metaDesc}</div>
            <a href="${finalLineUrl}" class="btn-line">ทักไลน์จองคิว ${displayName}</a>

            ${related.length > 0 ? `
            <span class="related-title">🔥 น้องๆ แนะนำใน${provinceName}:</span>
            <div class="related-grid">
                ${related.map(r => `
                    <a href="/sideline/${r.slug}" class="related-card">
                        <img src="${optimizeImg(r.imagePath)}" alt="${r.name}">
                        <div class="related-name">${r.name}</div>
                    </a>
                `).join('')}
            </div>` : ''}
            
            <div class="footer">
                © ${new Date().getFullYear()} ${DYNAMIC_BRAND} - ตรงปก ไม่มัดจำ 100%
            </div>
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