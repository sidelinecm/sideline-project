/* global URL, Response */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // 1. ดักจับ Bot & Inspection Tools
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i.test(ua);
    
    // 2. ดักจับ Data Center/ต่างชาติ (ใช้ Netlify Geo - ฟรีและไม่ล่ม)
    const geo = context.geo || {};
    const isSuspicious = !geo.city || geo.country?.code !== 'TH'; 

    // ถ้าเป็นคนไทย (ผ่าน Netlify Geo) และไม่ใช่ Bot ให้ไปหน้าเว็บจริง
    if (!isBot && !isSuspicious) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const { data: p } = await supabase.from('profiles').select('*, provinces(nameThai, key)').eq('slug', slug).maybeSingle();
        
        if (!p) return context.next();

        // --- เตรียมข้อมูล SEO (จัดเต็ม) ---
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        const rawRate = p.rate ? parseInt(p.rate.toString().replace(/[^0-9]/g, '')) : 0;
        const displayPrice = rawRate > 0 ? `${rawRate.toLocaleString()}.-` : 'สอบถาม';
        const imageUrl = p.imagePath ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
        
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);
        
        const pageTitle = `น้อง${p.name} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน ตรงปก 100%`;
        const metaDesc = `น้อง${p.name} สาวไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี รับงานฟิวแฟน ไม่ต้องโอนมัดจำ รูปตรงปก 100% พิกัด${p.location || provinceName} จองคิวคลิกเลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // --- Schema @graph (Digital Footprint ครบสูตร) ---
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "BreadcrumbList",
                    "@id": `${canonicalUrl}#breadcrumb`,
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/sideline/province/${provinceKey}` },
                        { "@type": "ListItem", "position": 3, "name": `น้อง${p.name}`, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": "Service",
                    "name": `น้อง${p.name} ไซด์ไลน์${provinceName}`,
                    "image": imageUrl,
                    "description": metaDesc,
                    "provider": {
                        "@type": "Person",
                        "name": p.name,
                        "sameAs": [
                            "https://linktr.ee/sidelinechiangmai",
                            "https://x.com/Sdl_chiangmai"
                        ]
                    },
                    "areaServed": {
                        "@type": "AdministrativeArea",
                        "name": provinceName,
                        "sameAs": provinceName.includes("เชียงใหม่") ? "https://www.wikidata.org/wiki/Q42430" : undefined 
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString()
                    },
                    "review": {
                        "@type": "Review",
                        "author": { "@type": "Person", "name": "Verified User" },
                        "reviewBody": `น้อง${p.name} บริการดีมากครับ ตรงปกประทับใจ`,
                        "reviewRating": { "@type": "Rating", "ratingValue": "5" }
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
    <meta name="robots" content="index, follow">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        body { margin: 0; padding: 0; font-family: sans-serif; background-color: #ffffff; color: #333; }
        .container { max-width: 480px; margin: 0 auto; padding-bottom: 40px; }
        .hero-img { width: 100%; height: auto; display: block; }
        .content { padding: 20px; }
        h1 { color: #db2777; font-size: 22px; margin: 15px 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .info-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #f9fafb; font-size: 14px; }
        .btn-contact { display: block; text-align: center; background-color: #06c755; color: white; padding: 14px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 25px; box-shadow: 0 4px 10px rgba(6,199,85,0.3); }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" class="hero-img" alt="${p.name}">
        <div class="content">
            <div style="color: #facc15; font-weight: bold;">⭐ ${ratingValue} (${reviewCount} รีวิว)</div>
            <h1>${pageTitle}</h1>
            <div class="info-grid">
                <div class="info-card"><b>ราคาเริ่มต้น:</b><br>${displayPrice}</div>
                <div class="info-card"><b>พิกัด:</b><br>${p.location || provinceName}</div>
            </div>
            <a href="https://line.me/ti/p/${p.lineId || 'ksLUWB89Y_'}" class="btn-contact">📲 ติดต่อสอบถาม / จองคิวคลิก</a>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "index, follow" } 
        });

    } catch {
        return context.next();
    }
};