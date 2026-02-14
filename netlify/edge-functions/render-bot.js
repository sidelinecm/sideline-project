import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2tneWlra2VpdWNuZHRuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzIyOTMsImV4cCI6MjA4NjEwODI5M30.-x6TN3XQS43QTKv4LpZv9AM4_Tm2q3R4Nd-KGo-KU1E',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    STORAGE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co/storage/v1/object/public/profile-images',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: ["https://linktr.ee/sidelinechiangmai", "https://x.com/Sdl_chiangmai"]
};

// Helper function to escape HTML
const escapeHtml = (str) => {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// Helper สุ่มคำเพื่อลดโอกาสเกิด Duplicate Content
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path, width = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=80&format=webp`;
};

export default async (request, context) => {
    const url = new URL(request.url);
    const path = url.pathname;

    // 🛑 บล็อก: ถ้าเป็นหน้าแรก หรือไม่ใช่หน้าโปรไฟล์ ให้ไป Client Render
    if (path === "/" || path === "/index.html" || !path.startsWith("/sideline/")) {
        return context.next();
    }

    // ตรวจสอบ User-Agent (รวม Bot สำคัญๆ)
    const ua = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|lighthouse|headless|bing|yahoo/i.test(ua);
    
    // Security/Geo Cloaking
    const geo = context.geo || {};
    const isSuspicious = !geo.city || (geo.country?.code !== 'TH' && geo.country?.code !== 'US');

    // ถ้าไม่ใช่ Bot และไม่ใช่พฤติกรรมน่าสงสัย ให้ไป Client Render ปกติ
    if (!isBot && !isSuspicious) return context.next();

    try {
        const pathParts = path.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();

        let slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        const cleanSlug = slug.includes('-') ? slug.split('-').slice(0, -1).join('-') : slug;
        
        // ตรวจสอบว่าไม่ใช่หน้า system
        if (['province', 'search', 'location', 'admin', 'login', 'register'].includes(slug)) {
            return context.next();
        }

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // ดึงข้อมูลโปรไฟล์
        const { data: profile } = await supabase
            .from('profiles')
            .select('*, provinces:provinces!provinceKey(*)')
            .or(`slug.eq."${slug}",slug.eq."${cleanSlug}"`) 
            .eq('active', true) 
            .maybeSingle();

        // 404 Handling: ถ้าหาไม่เจอ ให้ Client จัดการ (ซึ่งจะไปหน้า 404 เอง)
        if (!profile) return context.next();

        // ดึงข้อมูลโปรไฟล์ที่เกี่ยวข้อง (ลดจำนวน field เพื่อความเร็ว)
        let related = [];
        if (profile.provinceKey) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('provinceKey', profile.provinceKey)
                .eq('active', true)
                .neq('id', profile.id)
                .limit(4);
            related = relatedData || [];
        }

        // เตรียมข้อมูลสำหรับแสดงผล
        const displayName = profile.name.startsWith('น้อง') ? profile.name : `น้อง${profile.name}`;
        const rawPrice = (profile.rate || "1500").toString().replace(/[^0-9]/g, '');
        const displayPrice = (parseInt(rawPrice) || 1500).toLocaleString() + ".-";
        const imageUrl = optimizeImg(profile.imagePath, 800);
        const provinceName = profile.provinces?.nameThai || profile.location || 'เชียงใหม่';
        const ratingValue = (4.7 + (profile.id % 3) / 10).toFixed(1);
        const reviewCount = (120 + (profile.id % 80)).toString();
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${profile.slug}`;
        
        // จัดการ LINE URL
        let finalLineUrl = profile.lineId || 'ksLUMz3p_o';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;
        }

        // Escape HTML
        const safeDisplayName = escapeHtml(displayName);
        const safeProvinceName = escapeHtml(provinceName);
        const safeLocation = escapeHtml(profile.location || provinceName);
        const safeDescription = escapeHtml(profile.description || '');

        // --- SEO: CONTENT SPINNING (แก้ปัญหา Duplicate Content) ---
        const titleVariations = [
            `${safeDisplayName} ไซด์ไลน์${safeProvinceName} รับงานเอง ตรงปก ไม่ผ่านเอเย่นต์`,
            `รีวิว ${safeDisplayName} สาวสวย${safeProvinceName} ฟิวแฟน นิสัยดี`,
            `นัดเจอ ${safeDisplayName} พิกัด${safeLocation} จ่ายหน้างาน 100%`,
            `${safeDisplayName} รับงาน${safeProvinceName} รูปจริง ตัวจริง ตรงปก`
        ];
        const pageTitle = `${spin(titleVariations)} - ${CONFIG.BRAND_NAME}`;

        const descVariations = [
            `น้อง${safeDisplayName} อายุ ${profile.age || '20+'} ปี รับงานไซด์ไลน์${safeProvinceName} พิกัด${safeLocation} เป็นกันเอง`,
            `หาคนดูแลชั่วคราว? แนะนำ ${safeDisplayName} สาว${safeProvinceName} หน้าตาดี หุ่นดี ฟิวแฟนสุดๆ`,
            `ต้องการคนรู้ใจใน${safeProvinceName}? ทักหา ${safeDisplayName} ได้เลย รับงานเอง ไม่มัดจำ ปลอดภัย`
        ];
        const metaDesc = `${spin(descVariations)} ค่าขนม ${displayPrice} ทักไลน์จองคิวได้เลย`;

        // Schema.org
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Organization",
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": `${CONFIG.DOMAIN}/logo.png`,
                    "sameAs": CONFIG.SOCIAL_PROFILES
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${safeProvinceName}`, "item": `${CONFIG.DOMAIN}/location/${profile.provinceKey || 'chiang-mai'}` },
                        { "@type": "ListItem", "position": 3, "name": safeDisplayName, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": "Person",
                    "name": safeDisplayName,
                    "image": imageUrl,
                    "description": metaDesc,
                    "url": canonicalUrl,
                    "address": { "@type": "PostalAddress", "addressLocality": safeProvinceName, "addressRegion": "ประเทศไทย" },
                    "offers": { "@type": "Offer", "price": rawPrice, "priceCurrency": "THB", "availability": "https://schema.org/InStock" }
                },
                {
                    "@type": "AggregateRating",
                    "ratingValue": ratingValue,
                    "ratingCount": reviewCount,
                    "bestRating": "5",
                    "worstRating": "1",
                    "url": canonicalUrl
                }
            ]
        };

        // HTML Template
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <!-- Open Graph -->
    <meta property="og:locale" content="th_TH">
    <meta property="og:type" content="profile">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="800">
    <meta property="og:image:height" content="1067">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root { --primary: #db2777; --secondary: #06c755; --dark: #1f2937; --light: #f9fafb; --gray: #9ca3af; }
        body { font-family: -apple-system, sans-serif; background: #fff; color: var(--dark); line-height: 1.6; margin: 0; }
        .container { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #fff; }
        .header-image { width: 100%; height: auto; display: block; aspect-ratio: 3/4; object-fit: cover; background: #f3f4f6; }
        .content { padding: 24px; }
        .rating { color: #fbbf24; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 5px; }
        h1 { color: var(--primary); font-size: 22px; margin: 0 0 16px 0; font-weight: 800; line-height: 1.3; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .info-item { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: var(--light); }
        .info-item b { display: block; font-size: 11px; color: var(--gray); text-transform: uppercase; }
        .info-item span { font-size: 16px; font-weight: 700; color: #111827; }
        .cta-button { display: flex; align-items: center; justify-content: center; background: var(--secondary); color: #fff; padding: 16px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 4px 10px rgba(6, 199, 85, 0.3); margin: 20px 0; }
        .related-title { font-weight: 800; color: var(--primary); margin: 30px 0 15px; display: block; }
        .related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .related-card { text-decoration: none; color: inherit; }
        .related-image { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 10px; }
        .related-name { font-weight: 700; margin-top: 5px; font-size: 14px; }
        .footer { text-align: center; font-size: 12px; color: var(--gray); margin-top: 40px; padding: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" class="header-image" alt="${safeDisplayName}" width="480" height="640">
        <div class="content">
            <div class="rating">⭐ ${ratingValue} <span style="color:#999;font-weight:400;font-size:13px">(${reviewCount} รีวิว)</span></div>
            <h1>${pageTitle}</h1>
            
            <div class="info-grid">
                <div class="info-item"><b>ค่าขนมเริ่มต้น</b><span>${displayPrice}</span></div>
                <div class="info-item"><b>พิกัด</b><span>${safeLocation}</span></div>
            </div>
            
            <div style="color:#444;margin-bottom:20px;">${metaDesc}</div>
            <div style="font-size:14px;color:#666;">${safeDescription}</div>
            
            <a href="${finalLineUrl}" class="cta-button">📲 ทักไลน์จองคิว</a>
            
            ${related.length > 0 ? `
            <div class="related-section">
                <span class="related-title">🔥 น้องๆ ใน${safeProvinceName} ที่แนะนำ:</span>
                <div class="related-grid">
                    ${related.map(r => `
                    <a href="${CONFIG.DOMAIN}/sideline/${r.slug}" class="related-card">
                        <img src="${optimizeImg(r.imagePath, 300)}" class="related-image" alt="${escapeHtml(r.name)}" loading="lazy">
                        <div class="related-name">น้อง${escapeHtml(r.name)}</div>
                        <div style="font-size:11px;color:#888;">📍 ${escapeHtml(r.location || safeProvinceName)}</div>
                    </a>
                    `).join('')}
                </div>
            </div>` : ''}
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}</p>
                <p>แหล่งรวมไซด์ไลน์${safeProvinceName} อันดับ 1</p>
            </div>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                // Cache 2 ชั่วโมงสำหรับ Bot เพื่อให้เห็นความเปลี่ยนแปลงบ้าง
                "cache-control": "public, max-age=7200, s-maxage=86400",
                "vary": "User-Agent"
            } 
        });

    } catch (error) {
        console.error("SSR Profile Error:", error);
        return context.next();
    }
};