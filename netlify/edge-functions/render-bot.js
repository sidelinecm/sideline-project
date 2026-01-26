import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// --- 1. CONFIGURATION (ตั้งค่าระบบ) ---
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Thailand',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

// --- 2. HELPER FUNCTIONS ---
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- 3. MAIN FUNCTION ---
export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // A. ตรวจสอบ Bot (Cloaking Logic)
    // อนุญาต: Google, Bing, Facebook, Twitter, Line, Discord, Telegram, SEO Tools
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i.test(ua);
    const geo = context.geo || {};
    
    // ความปลอดภัย: ถ้าไม่ใช่ Bot และ IP น่าสงสัย (ไม่อยู่ไทย) อาจจะให้ผ่านไปหน้า App ปกติ
    // แต่ถ้าเป็น Bot ให้หยุดที่นี่เพื่อส่ง HTML (SSR)
    // ถ้าเป็นคนไทยปกติ -> context.next() เพื่อไปโหลด React/Vue Client-side
    const isSuspicious = !geo.city || geo.country?.code !== 'TH';
    if (!isBot && !isSuspicious) return context.next();

    try {
        const url = new URL(request.url);
        const slug = url.pathname.split('/').pop(); // ดึง Slug จาก URL

        // B. เชื่อมต่อฐานข้อมูล
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // C. ดึงข้อมูลโปรไฟล์ + จังหวัด
        const { data: p } = await supabase.from('profiles')
            .select('id, name, slug, imagePath, rate, location, age, height, weight, proportions, lineId, verified, status, province_id, provinces(nameThai, slug)')
            .eq('slug', slug)
            .maybeSingle();

        // ถ้าหาไม่เจอ ให้ Client-side จัดการ (404)
        if (!p) return context.next();

        // D. ดึงข้อมูลที่เกี่ยวข้อง (Related Profiles) เพื่อทำ Internal Link
        let related = [];
        if (p.province_id) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('province_id', p.province_id)
                .eq('status', 'active')
                .neq('id', p.id) // ไม่เอาตัวเอง
                .limit(4); // เอามา 4 คน
            related = relatedData || [];
        }

        // --- 4. DATA PREPARATION (เตรียมข้อมูล) ---
        const rawName = p.name || 'สาวสวย';
        const displayName = rawName.startsWith('น้อง') ? rawName : `น้อง${rawName}`;
        const cleanPrice = (p.rate || "1500").toString().replace(/\D/g, ''); // เฉพาะตัวเลข
        const displayPrice = parseInt(cleanPrice).toLocaleString();
        
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceSlug = p.provinces?.slug || 'chiangmai';
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceSlug}`;
        
        // จัดการรูปภาพ (รองรับทั้ง URL เต็มและ Path)
        let imageUrl = `${CONFIG.DOMAIN}/images/default.webp`;
        if (p.imagePath) {
            imageUrl = p.imagePath.startsWith('http') 
                ? p.imagePath 
                : `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}?width=800&quality=85&format=webp`;
        }
        
        // Link Line
        let lineUrl = p.lineId || '#';
        if (!lineUrl.startsWith('http')) lineUrl = `https://line.me/ti/p/${lineUrl}`;

        // สร้างวันที่ปัจจุบัน (เพื่อให้ Google เห็นว่าเนื้อหาสดใหม่)
        const dateNow = new Date();
        const dateString = dateNow.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        const validUntil = new Date(dateNow.setFullYear(dateNow.getFullYear() + 1)).toISOString().split('T')[0];

        // Spintax (สุ่มคำเพื่อไม่ให้ซ้ำ)
        const titleIntro = spin(["แนะนำ", "รีวิว", "ห้ามพลาด", "มาแรง", "จัดอันดับ"]);
        const descIntro = spin(["พบกับ", "ดูโปรไฟล์", "รายละเอียด"]);
        const adj = spin(["ขี้อ้อน", "เอาใจเก่ง", "ฟิวแฟน", "งานดี", "ตรงปก"]);

        // Meta Tags
        const pageTitle = `${titleIntro} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ราคา ${displayPrice}.-`;
        const metaDesc = `${descIntro}${displayName} สาวไซด์ไลน์${provinceName} อายุ ${p.age || '20+'} ปี ${adj} รับงานเองไม่ผ่านเอเย่นต์ พิกัด${p.location || provinceName} ปลอดภัย ไม่โอนมัดจำ`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // Rating Algorithm (Deterministic based on ID)
        const ratingValue = (4.7 + (p.id % 3) / 10).toFixed(1); // 4.7, 4.8, 4.9
        const reviewCount = (p.id * 7) % 300 + 50; // สุ่มจำนวนรีวิว 50-350

        // --- 5. SCHEMA.ORG (JSON-LD) ---
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
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl },
                        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": ["Product", "LocalBusiness"], // Hybrid Schema
                    "@id": `${canonicalUrl}#product`,
                    "name": pageTitle,
                    "description": metaDesc,
                    "image": [imageUrl],
                    "sku": `SDL-${p.id}`,
                    "mpn": `SDL-${p.id}`,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                    "address": { "@type": "PostalAddress", "addressLocality": provinceName, "addressCountry": "TH" },
                    "priceRange": "฿฿",
                    "offers": {
                        "@type": "Offer",
                        "url": canonicalUrl,
                        "priceCurrency": "THB",
                        "price": cleanPrice,
                        "priceValidUntil": validUntil, // ราคาใช้ได้ถึงปีหน้า
                        "availability": "https://schema.org/InStock",
                        "seller": { "@type": "Organization", "name": displayName }
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString(),
                        "bestRating": "5",
                        "worstRating": "1"
                    },
                    "review": {
                        "@type": "Review",
                        "author": { "@type": "Person", "name": "Verified User" },
                        "datePublished": new Date().toISOString().split('T')[0],
                        "reviewBody": `${displayName} ตัวจริงน่ารักมากครับ ตรงปก งานดี บริการประทับใจ`,
                        "reviewRating": { "@type": "Rating", "ratingValue": "5" }
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        { "@type": "Question", "name": `จองคิว${displayName} ต้องทำยังไง?`, "acceptedAnswer": { "@type": "Answer", "text": `สามารถแอดไลน์ ${p.lineId || 'น้อง'} เพื่อสอบถามคิวและนัดสถานที่ได้เลยครับ` } },
                        { "@type": "Question", "name": `ต้องโอนมัดจำไหม?`, "acceptedAnswer": { "@type": "Answer", "text": `เว็บไซต์เราไม่มีนโยบายเก็บมัดจำครับ จ่ายเงินหน้างานกับน้องโดยตรงเท่านั้น ปลอดภัย 100%` } }
                    ]
                }
            ]
        };

        // --- 6. HTML GENERATION ---
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Meta Tags for Social -->
    <meta property="og:locale" content="th_TH">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:image" content="${imageUrl}">

    <!-- Schema.org -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <!-- Inline CSS (Fast Loading) -->
    <style>
        :root{--primary:#ec4899;--bg:#f8fafc;--text:#1e293b;--white:#ffffff}
        body{margin:0;font-family:-apple-system,'Prompt',sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
        a{text-decoration:none;color:inherit}
        .container{max-width:480px;margin:0 auto;background:var(--white);min-height:100vh;box-shadow:0 0 20px rgba(0,0,0,0.05)}
        
        /* Navigation Breadcrumb */
        .nav{padding:12px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #e2e8f0}
        .nav a:hover{color:var(--primary);text-decoration:underline}
        
        /* Hero Image */
        .hero{position:relative;width:100%;padding-top:125%;background:#e2e8f0}
        .hero img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
        .verified-badge{position:absolute;top:10px;right:10px;background:#10b981;color:#fff;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.2)}
        
        /* Content */
        .content{padding:20px}
        .meta-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
        .rating{color:#fbbf24;font-size:14px;font-weight:bold}
        .date{font-size:11px;color:#94a3b8}
        
        h1{margin:0 0 5px 0;font-size:24px;color:var(--primary);line-height:1.3}
        .location{font-size:14px;color:#64748b;display:flex;align-items:center;gap:5px;margin-bottom:20px}
        
        /* Info Grid */
        .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:25px}
        .info-item{background:#f1f5f9;padding:12px;border-radius:10px;text-align:center}
        .info-label{display:block;font-size:11px;color:#64748b;margin-bottom:2px}
        .info-val{font-size:16px;font-weight:bold;color:#334155}
        .price{color:var(--primary)}
        
        .desc{font-size:15px;color:#334155;margin-bottom:25px;padding:15px;background:#fff1f2;border-radius:10px;border-left:4px solid var(--primary)}
        
        /* CTA Button */
        .btn-line{display:flex;align-items:center;justify-content:center;background:#06c755;color:#fff;font-size:18px;font-weight:bold;padding:16px;border-radius:50px;box-shadow:0 4px 15px rgba(6,199,85,0.3);transition:transform .2s}
        .btn-line:active{transform:scale(0.98)}
        .safety-text{text-align:center;font-size:12px;color:#94a3b8;margin-top:10px}
        
        /* Related */
        .related{margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0}
        .rel-title{font-size:16px;font-weight:bold;margin-bottom:15px;display:block}
        .rel-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .rel-card img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px}
        .rel-name{font-size:13px;font-weight:bold;margin-top:5px;display:block}
        .rel-loc{font-size:11px;color:#64748b}
        
        /* Footer */
        .footer{text-align:center;font-size:11px;color:#cbd5e1;padding:30px 20px;background:#1e293b;margin-top:40px}
    </style>
</head>
<body>
    <div class="container">
        <!-- Breadcrumb -->
        <div class="nav">
            <a href="${CONFIG.DOMAIN}">🏠 หน้าแรก</a> &rsaquo; 
            <a href="${provinceUrl}">ไซด์ไลน์${provinceName}</a> &rsaquo; 
            <span>${displayName}</span>
        </div>

        <!-- Main Image -->
        <div class="hero">
            <img src="${imageUrl}" alt="${displayName}" loading="eager">
            ${p.verified ? '<div class="verified-badge">✓ ยืนยันตัวตน</div>' : ''}
        </div>

        <div class="content">
            <!-- Meta Header -->
            <div class="meta-row">
                <div class="rating">⭐ ${ratingValue} <span style="font-weight:normal;color:#94a3b8">(${reviewCount} รีวิว)</span></div>
                <div class="date">อัปเดต: ${dateString}</div>
            </div>

            <h1>${pageTitle}</h1>
            <div class="location">📍 พิกัด: ${p.location || provinceName}</div>

            <!-- Stats Grid -->
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">ค่าขนมเริ่มต้น</span>
                    <span class="info-val price">฿${displayPrice}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">อายุ</span>
                    <span class="info-val">${p.age || '20+'} ปี</span>
                </div>
                <div class="info-item">
                    <span class="info-label">สัดส่วน</span>
                    <span class="info-val">${p.proportions || '34-24-35'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">ส่วนสูง/น้ำหนัก</span>
                    <span class="info-val">${p.height || '-'} / ${p.weight || '-'}</span>
                </div>
            </div>

            <!-- Description -->
            <div class="desc">
                ${metaDesc}
                <br><br>
                <strong>จุดเด่น:</strong> ${spin(['เอาใจเก่ง', 'เป็นกันเอง', 'คุยสนุก', 'ไม่เร่งงาน', 'ตรงปก 100%'])}
            </div>

            <!-- Call to Action -->
            <a href="${lineUrl}" class="btn-line">📲 ทักไลน์จองคิว ${displayName}</a>
            <div class="safety-text">🛡️ ปลอดภัย • ไม่โอนมัดจำ • จ่ายหน้างาน</div>

            <!-- Related Profiles -->
            ${related.length > 0 ? `
            <div class="related">
                <span class="rel-title">🔥 น้องๆ แนะนำใน${provinceName}</span>
                <div class="rel-grid">
                    ${related.map(r => `
                        <a href="${CONFIG.DOMAIN}/sideline/${r.slug}" class="rel-card">
                            <img src="${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${r.imagePath}?width=250" alt="น้อง${r.name}">
                            <span class="rel-name">น้อง${r.name}</span>
                            <span class="rel-loc">📍 ${r.location || provinceName}</span>
                        </a>
                    `).join('')}
                </div>
            </div>` : ''}
        </div>

        <div class="footer">
            &copy; ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - แหล่งรวมไซด์ไลน์อันดับ 1<br>
            ให้บริการในพื้นที่ ${provinceName} และทั่วประเทศ
        </div>
    </div>
</body>
</html>`;

        // 7. RETURN RESPONSE
        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
                "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=600",
                "x-robots-tag": "index, follow, max-image-preview:large"
            }
        });

    } catch (e) {
        console.error("Render Bot Error:", e);
        // กรณี Error ให้ส่งต่อไป Client-side ยังดีกว่าหน้าขาว
        return context.next();
    }
};