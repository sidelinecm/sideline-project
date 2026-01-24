/* global URL, Response, fetch */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Thailand'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ระบบจำลองโซนเชิงลึกตามจังหวัด (เพื่อ SEO ระดับอำเภอ/ย่าน)
const getLocalZones = (province) => {
    const zones = {
        'chiangmai': ['นิมมานเหิมินทร์', 'สันติธรรม', 'ย่านช้างเผือก', 'แถวแม่โจ้', 'โซนหางดง', 'ใกล้มหาวิทยาลัยเชียงใหม่'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'เลียบด่วน', 'โซนฝั่งธน'],
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'หาดจอมเทียน', 'ศรีราชา', 'โซนอมตะนคร']
    };
    return zones[province.toLowerCase()] || ['ตัวเมือง', 'ย่านใจกลางเมือง', 'ใกล้ที่พักคุณ', 'เดินทางสะดวก'];
};

export default async (request, context) => {
    const url = new URL(request.url);
    const provinceKey = url.pathname.split('/').pop();
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();

    // 1. Security & Bot Detection (Layer 1-3)
    const isBot = /googlebot|bingbot|slurp|duckduckgo|baiduspider|yandexbot/i.test(ua);
    const isSuspicious = /headless|python|axios|curl|wget|postman/i.test(ua);

    if (isSuspicious && !isBot) {
        return new Response("Forbidden", { status: 403 });
    }

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase.from('provinces').select('*').eq('slug', provinceKey).single();
        if (!provinceData) return context.next();

        // ดึงข้อมูลโปรไฟล์ (เจาะจงจังหวัด)
        const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .eq('province_id', provinceData.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);

        // 2. Advanced SEO Copywriting (Spintax)
        const title = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง โซน${randomZone} งานดีตรงปก 100%`;
        const description = `ค้นหาสาวไซด์ไลน์${provinceName} ยอดนิยมในโซน ${localZones.slice(0, 3).join(', ')} พบกับโปรไฟล์น้องๆ รับงานเอง ฟิวแฟน ไม่ผ่านเอเย่นต์ จ่ายหน้างาน ปลอดภัยที่สุดใน${provinceName}`;

// ==========================================
        // 4. ADVANCED STRUCTURED DATA (JSON-LD) - VERSION PROVINCE
        // ==========================================
        const avgRating = "4.8";
        const totalReviews = (profiles.length * 12 + 45).toString();
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}/logo.png` },
                    "sameAs": CONFIG.SOCIAL_PROFILES
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type": ["LocalBusiness", "Service"],
                    "@id": `${provinceUrl}#maincontent`,
                    "name": `ศูนย์รวมไซด์ไลน์${provinceName} รับงานเอง ตรงปก`,
                    "image": profiles.length > 0 ? [`${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${profiles[0].imagePath}`] : [],
                    "description": metaDescription,
                    "url": provinceUrl,
                    "telephone": "+66-XX-XXX-XXXX", // ใส่เบอร์ส่วนกลางถ้ามี
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": provinceName,
                        "addressCountry": "TH"
                    },
                    "geo": {
                        "@type": "GeoCircle",
                        "geoMidpoint": {
                            "@type": "GeoCoordinates",
                            "description": provinceName
                        },
                        "geoRadius": "50000"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": avgRating,
                        "reviewCount": totalReviews,
                        "bestRating": "5",
                        "worstRating": "1"
                    },
                    "priceRange": "฿1500 - ฿5000",
                    "areaServed": {
                        "@type": "AdministrativeArea",
                        "name": provinceName,
                        "sameAs": provinceName.includes("เชียงใหม่") ? "https://www.wikidata.org/wiki/Q42430" : undefined
                    }
                },
                {
                    "@type": "ItemList",
                    "name": `รายชื่อน้องๆ ไซด์ไลน์${provinceName} ยอดนิยม`,
                    "numberOfItems": profiles.length,
                    "itemListElement": profiles.slice(0, 15).map((p, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "item": {
                            "@type": "Service",
                            "name": p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`,
                            "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                            "image": `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}`,
                            "offers": {
                                "@type": "Offer",
                                "price": p.price || "1500",
                                "priceCurrency": "THB"
                            }
                        }
                    }))
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `หาไซด์ไลน์${provinceName} โซนไหนเดินทางสะดวกที่สุด?`,
                            "acceptedAnswer": { 
                                "@type": "Answer", 
                                "text": `ใน${provinceName} มีน้องๆ กระจายตัวอยู่ในหลายพิกัดยอดนิยม เช่น ${localZones.join(', ')} ซึ่งสามารถเดินทางไปหาหรือนัดพบน้องได้สะดวกครับ` 
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `การจองน้องๆ ใน${provinceName} ปลอดภัยแค่ไหน?`,
                            "acceptedAnswer": { 
                                "@type": "Answer", 
                                "text": "ปลอดภัย 100% ครับ เว็บไซต์เราไม่มีระบบโอนมัดจำล่วงหน้า คุณจะชำระเงินเมื่อเจอน้องตัวจริงเท่านั้น เพื่อป้องกันการถูกหลอก" 
                            }
                        }
                    ]
                }
            ]
        };

        // 4. HTML Structure (UX/UI & SEO Optimization)
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${CONFIG.DOMAIN}/province/${provinceKey}">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        :root { --p: #ec4899; --bg: #0f172a; }
        body { font-family: 'Sarabun', sans-serif; background: var(--bg); color: #fff; margin:0; padding:20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; margin-top:20px; }
        .card { background: #1e293b; border-radius: 12px; overflow: hidden; text-decoration: none; color: inherit; transition: 0.3s; border: 1px solid #334155; }
        .card:hover { transform: translateY(-5px); border-color: var(--p); }
        .img-w { position: relative; padding-top: 125%; }
        .img-w img { position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; }
        .card-d { padding: 10px; }
        .name { font-weight: bold; color: #fff; display: block; margin-bottom: 4px; }
        .loc { font-size: 12px; color: #94a3b8; }
        .v-badge { position: absolute; top: 8px; right: 8px; background: #10b981; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
        .h1-seo { color: var(--p); font-size: 22px; text-align: center; }
        .zone-info { background: #334155; padding: 10px; border-radius: 8px; font-size: 13px; margin: 15px 0; border-left: 4px solid var(--p); }
    </style>
</head>
<body>
    <div style="max-width: 800px; margin: auto;">
        <h1 class="h1-seo">พิกัดน้องๆ ไซด์ไลน์${provinceName}</h1>
        
        <div class="zone-info">
            <strong>📍 พื้นที่บริการยอดนิยม:</strong> ${localZones.join(' • ')}<br>
            พบกับน้องๆ งานดี เดินทางสะดวก ไม่ว่าคุณจะอยู่ในโซน ${randomZone} หรือพื้นที่ใกล้เคียง
        </div>

        <div class="grid">
            ${profiles.map(p => {
                const pName = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
                return `
                <a href="${CONFIG.DOMAIN}/sideline/${p.slug}" class="card">
                    <div class="img-w">
                        <img src="${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}?width=300&quality=70" alt="${pName}">
                        ${p.verified ? '<span class="v-badge">✓ ตัวจริง</span>' : ''}
                    </div>
                    <div class="card-d">
                        <span class="name">${pName}</span>
                        <div class="loc">📍 ${randomZone}</div>
                        <div style="color:#fbbf24; font-size:12px; margin-top:5px;">⭐ ${(4.7 + (p.id % 3) / 10).toFixed(1)}</div>
                    </div>
                </a>`;
            }).join('')}
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });

    } catch (e) {
        return new Response("Error", { status: 500 });
    }
};