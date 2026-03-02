import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 🚀 3. Image Optimization
const optimizeImg = (path, isOG = false) => {
    if (!path) return CONFIG.DEFAULT_IMAGE;
    if (path.includes('res.cloudinary.com')) {
        const transform = isOG ? 'c_fill,w_800,h_1000,q_auto,f_auto' : 'c_scale,w_800,q_auto,f_auto';
        return path.replace('/upload/', `/upload/${transform}/`);
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

// 🛡️ 4. Circuit Breaker (แก้ Memory Leak)
const fetchWithTimeout = async (promise, ms = 4000) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout ${ms}ms`)), ms))
    ]);
};

// 🔐 5. Rate Limiting
const checkRateLimit = (context, request) => {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        const now = Date.now();
        const kvKey = `rate:${ip.slice(0, 20)}`;
        const calls = context.kv?.get({ key: kvKey })?.value || [];
        const recent = calls.filter(t => now - t < 3600000);
        if (recent.length >= 100) return { allowed: false };
        recent.unshift(now);
        context.kv?.put({ key: kvKey, value: recent.slice(0, 99), expirationTtl: 3600 });
        return { allowed: true };
    } catch { return { allowed: true }; }
};

// 📱 6. LINE URL Fix
const formatLineUrl = (lineId) => {
    if (!lineId) return 'https://line.me/ti/p/ksLUWB89Y_';
    if (lineId.startsWith('http')) return lineId;
    const cleanId = lineId.replace('@', '');
    return lineId.includes('@') ? `https://line.me/ti/p/~${cleanId}` : `https://line.me/ti/p/${cleanId}`;
};

export default async (request, context) => {
    // 🔐 Rate Limit ก่อน
    const rateLimit = checkRateLimit(context, request);
    if (!rateLimit.allowed) {
        return new Response('Too Many Requests', { status: 429, headers: { 'Retry-After': '3600' } });
    }

    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|lighthouse|headless/i.test(ua);
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();

        // 🔐 Slug Sanitization
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]).replace(/[^\w\-]/g, '').toLowerCase();
        
        const supabase = getSupabase();

        // ⚡ 7. Parallel Query + Fail-safe
        const [profileRes, relatedRes] = await Promise.allSettled([
            fetchWithTimeout(
                supabase.from('profiles').select('*, provinces(nameThai, key)').eq('slug', slug).eq('active', true).maybeSingle(),
                4000
            ),
            fetchWithTimeout(
                supabase.from('profiles').select('slug, name, imagePath').eq('active', true).limit(8),
                2500
            )
        ]);

        const p = profileRes.status === 'fulfilled' ? profileRes.value.data : null;
        if (!p) return context.next();

        // Filter related
        const related = (relatedRes.status === 'fulfilled' ? relatedRes.value.data : [])
            .filter(r => r.provinceKey === p.provinceKey && r.slug !== slug).slice(0, 4);

        // 8. Data Processing (แก้ parseInt)
        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
        const provinceKey = p.provinceKey || p.provinces?.key || 'chiangmai';
        const rawPrice = (p.rate || "1500").toString().replace(/\D/g, '');
        const displayPrice = rawPrice ? parseInt(rawPrice).toLocaleString() : '1,500';
        const imageUrl = optimizeImg(p.imageUrl, false);
        const ogImageUrl = optimizeImg(p.imagePath, true);
        const YEAR_TH = new Date().getFullYear() + 543 + 1;
        const BRAND_NAME = `Sideline ${provinceName}`;
        const finalLineUrl = formatLineUrl(p.lineId);

        // Rating
        const ratingValue = (4.5 + (slug.split('').reduce((a,c) => a + c.charCodeAt(0), 0) % 50 / 100)).toFixed(1);
        const reviewCount = 85 + (slug.split('').reduce((a,c) => a + c.charCodeAt(0), 0) % 120);

        // SEO Content
        const intro = spin(["แนะนำ", "พบกับ", "รีวิว", "พิกัดใหม่", "ห้ามพลาด"]);
        const style = spin(["ฟิวแฟนแท้ๆ", "เอาใจเก่งมาก", "งานเนี๊ยบตรงปก", "เป็นกันเอง", "น่ารักขี้อ้อน"]);
        const trust = spin(["ไม่ต้องโอนมัดจำ", "จ่ายหน้างานเท่านั้น", "เจอตัวค่อยจ่าย", "ปลอดภัย 100%"]);
        
        const pageTitle = `${intro} ${displayName} - ไซด์ไลน์${provinceName} ${style} (${YEAR_TH})`;
        const metaDesc = `${displayName} รับงานไซด์ไลน์${provinceName} ${trust} พิกัด ${p.location || provinceName}`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // 👑 9. Schema Markup สมบูรณ์
        const schema = {
            "@context": "https://schema.org",
            "@graph": [{
                "@type": ["Person", "Product"],
                "@id": `${canonicalUrl}#profile`,
                "name": displayName,
                "image": ogImageUrl,
                "description": metaDesc,
                "brand": { "@type": "Brand", "name": BRAND_NAME },
                "offers": {
                    "@type": "Offer",
                    "price": rawPrice,
                    "priceCurrency": "THB",
                    "availability": "https://schema.org/InStock"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": ratingValue,
                    "reviewCount": reviewCount.toString(),
                    "bestRating": "5",
                    "worstRating": "1"
                }
            }]
        };

        // 10. HTML (แก้ CSS)
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">
    
    <meta name="twitter:card" content="summary_large_image">
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    
    <style>
        :root{--primary:#db2777;--success:#06c755;--bg:#0f172a;--card:#1e293b;--txt:#f8fafc;}
        *{box-sizing:border-box;}
        body{margin:0;padding:0;font-family:'Prompt',sans-serif;background:var(--bg);color:var(--txt);line-height:1.6;display:flex;justify-content:center;}
        header{background:rgba(15,23,42,0.95);backdrop-filter:blur(10px);position:fixed;top:0;width:100%;max-width:500px;z-index:100;border-bottom:1px solid rgba(255,255,255,0.05);}
        .nav{height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;}
        .nav img{height:30px;}
        .nav-link{color:#fff;text-decoration:none;font-weight:600;font-size:14px;}
        .wrapper{width:100%;max-width:500px;background:var(--card);min-height:100vh;padding-top:60px;box-shadow:0 0 50px rgba(0,0,0,0.5);display:flex;flex-direction:column;}
        .hero{width:100%;aspect-ratio:3/4;object-fit:cover;background:#000;}
        .container{padding:25px;flex-grow:1;}
        .rating-stars{color:#fbbf24;font-size:14px;font-weight:800;margin-bottom:10px;}
        h1{font-size:28px;font-weight:800;margin:0 0 15px;line-height:1.2;background:linear-gradient(to right,#fff,var(--primary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:25px;}
        .info-box{background:rgba(255,255,255,0.03);padding:15px;border-radius:15px;border:1px solid rgba(255,255,255,0.08);}
        .info-box label{display:block;font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:4px;}
        .info-box span{font-size:18px;font-weight:800;color:#fff;}
        .desc{font-size:15px;color:#cbd5e1;margin-bottom:30px;white-space:pre-line;border-top:1px solid rgba(255,255,255,0.05);padding-top:20px;}
        .btn-line{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--success);color:#fff;padding:18px;border-radius:18px;text-decoration:none;font-weight:800;font-size:19px;box-shadow:0 10px 30px rgba(6,199,85,0.3);transition:0.3s;}
        .btn-line:hover{transform:scale(1.02);background:#05a546;}
        .related{margin-top:45px;border-top:1px solid rgba(255,255,255,0.05);padding-top:30px;}
        .related-title{font-weight:900;color:var(--primary);font-size:18px;margin-bottom:15px;}
        .related-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px;}
        .related-item{text-decoration:none;color:inherit;}
        .related-item img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px;margin-bottom:8px;}
        .related-name{font-weight:700;font-size:14px;text-align:center;display:block;}
        footer{text-align:center;padding:50px 20px;color:#64748b;font-size:11px;}
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
            <span class="rating-stars">⭐ ${ratingValue} (${reviewCount} รีวิว)</span>
            <h1>น้อง${displayName} ไซด์ไลน์${provinceName}</h1>
            <div class="info-grid">
                <div class="info-box"><label>ค่าขนมเริ่มต้น</label><span>฿${displayPrice}</span></div>
                <div class="info-box"><label>พิกัดรับงาน</label><span>${p.location || provinceName}</span></div>
            </div>
            <div class="desc">${p.description || metaDesc}</div>
            <a href="${finalLineUrl}" target="_blank" rel="noopener noreferrer" class="btn-line">
                <i class="fab fa-line" style="font-size:24px"></i>ทักไลน์จองคิว
            </a>
            ${related.length ? `
            <div class="related">
                <span class="related-title">🔥 น้องๆ แนะนำใน${provinceName}</span>
                <div class="related-grid">${related.map(r=>`
                    <a href="/sideline/${r.slug}" class="related-item">
                        <img src="${optimizeImg(r.imagePath)}" alt="${r.name}">
                        <span class="related-name">${r.name}</span>
                    </a>`).join('')}</div>
            </div>` : ''}
            <footer>© ${new Date().getFullYear()} ${BRAND_NAME}</footer>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow, max-image-preview:large",
                "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
                "x-rendered-by": "edge-bot-v3.0"
            }
        });

    } catch (e) {
        console.error("Render Error:", e);
        return context.next();
    }
};
