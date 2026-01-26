import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// --- CONFIGURATION ---
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

// --- HELPER FUNCTIONS ---

/**
 * Selects a random element from an array.
 * @param {Array<string>} arr - The array to choose from.
 * @returns {string} A random element from the array.
 */
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generates a list of local zones for a given province.
 * @param {string} provinceKey - The key for the province (e.g., 'chiangmai').
 * @returns {Array<string>} An array of zone names.
 */
const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมานเหมินท์', 'สันติธรรม', 'ช้างเผือก', 'แม่โจ้', 'หางดง', 'มช.', 'เจ็ดยอด', 'ท่าแพ'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'ทองหล่อ', 'เอกมัย', 'สีลม', 'สาทร'],
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'วอคกิ้งสตรีท', 'จอมเทียน', 'บางแสน', 'ศรีราชา', 'อมตะนคร'],
        'khon-kaen': ['มข.', 'กังสดาล', 'หลังมอ', 'ในเมือง', 'บึงแก่นนคร'],
        'phuket': ['ป่าตอง', 'กะทู้', 'ตัวเมืองภูเก็ต', 'ราไวย์', 'ถลาง']
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'ย่านธุรกิจ', 'โรงแรมชั้นนำ', 'ใกล้ฉัน'];
};

/**
 * Generates dynamic FAQ data for the page.
 * @param {string} provinceName - The Thai name of the province.
 * @param {Array<string>} zones - An array of local zones.
 * @returns {Array<{q: string, a: string}>} An array of FAQ objects.
 */
const generatePageData = (provinceName, zones) => {
    return {
        faq: [
            { q: `ไซด์ไลน์${provinceName} รับงานโซนไหนบ้าง?`, a: `น้องๆ ไซด์ไลน์${provinceName} ของเราให้บริการครอบคลุมหลายพื้นที่ โดยเฉพาะโซนยอดนิยมอย่าง ${zones.slice(0, 3).join(', ')} และพื้นที่ใกล้เคียงในตัวเมือง สามารถนัดหมายสถานที่สะดวกได้เลยครับ` },
            { q: `เรทราคาเริ่มต้นเท่าไหร่?`, a: `ค่าขนมเริ่มต้นที่ 1,500 - 2,000 บาท ขึ้นอยู่กับโปรไฟล์และประเภทงาน (ฟิวแฟน, ทานข้าว, เอนเตอร์เทน) สามารถดูราคาชัดเจนได้ที่หน้าโปรไฟล์น้องๆ แต่ละคนครับ` },
            { q: `ปลอดภัยไหม ต้องโอนมัดจำก่อนหรือเปล่า?`, a: `ปลอดภัย 100% ครับ! นโยบายหลักของเราคือ "ไม่รับโอนมัดจำ" ให้ลูกค้าชำระเงินหน้างานเมื่อเจอน้องตัวจริงแล้วเท่านั้น ตัดปัญหาการโดนโกงได้เลย` },
            { q: `ข้อมูลและรูปภาพตรงปกไหม?`, a: `ทีมงาน ${CONFIG.BRAND_NAME} มีการตรวจสอบตัวตนและคัดกรองน้องๆ อย่างเข้มงวด รับประกันว่ารูปตรงปก ไม่จกตา และให้บริการด้วยความสุภาพครับ` }
        ]
    };
};


// --- MAIN EDGE FUNCTION (BULLETPROOF VERSION) ---

export default async (request, context) => {
    try {
        const url = new URL(request.url);
        const slug = url.pathname.split('/').pop();

        // 1. INPUT VALIDATION: Reject invalid slugs immediately.
        if (!slug || !/^[a-zA-Z0-9-_]+$/.test(slug)) {
            return new Response('Invalid request: Malformed slug.', { status: 400 });
        }

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // 2. DATA FETCHING: Get profile data.
        const { data: p, error: profileError } = await supabase.from('profiles')
            .select('id, name, slug, imagePath, rate, location, age, height, weight, proportions, lineId, verified, status, province_id, provinces(nameThai, slug)')
            .eq('slug', slug)
            .maybeSingle();

        // Handle database query errors gracefully.
        if (profileError) {
            console.error('Supabase Profile Error:', profileError.message);
            return new Response('Error: Could not retrieve data.', { status: 500 });
        }

        // 3. DATA VALIDATION: Ensure the profile exists and is active.
        if (!p || p.status !== 'active') {
            return context.next(); // Let the framework handle it as a 404 Not Found.
        }

        // Fetch related profiles (best-effort, won't fail the page if it errors)
        const { data: relatedData } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, location')
            .eq('province_id', p.province_id)
            .eq('status', 'active')
            .neq('id', p.id)
            .limit(4);
        const related = relatedData ?? [];

        // 4. BULLETPROOF DATA PREPARATION: Assume any field can be null/undefined.
        const id = p.id ?? 0;
        const rawName = p.name ?? 'สาวสวย';
        const displayName = rawName.startsWith('น้อง') ? rawName : `น้อง${rawName}`;
        
        const cleanPrice = (p.rate ?? "1500").toString().replace(/\D/g, '');
        const displayPrice = parseInt(cleanPrice).toLocaleString();

        const provinceName = p.provinces?.nameThai ?? p.location ?? 'เชียงใหม่';
        const provinceSlug = p.provinces?.slug ?? 'chiangmai';
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceSlug}`;
        const location = p.location ?? provinceName;
        const age = p.age ?? '20+';
        const height = p.height ?? '-';
        const weight = p.weight ?? '-';
        const proportions = p.proportions ?? '34-24-35';
        const lineId = p.lineId ?? '';
        const isVerified = p.verified ?? false;

        const zones = getLocalZones(provinceSlug);
        const pageData = generatePageData(provinceName, zones);

        let imageUrl = `${CONFIG.DOMAIN}/images/default.webp`;
        if (p.imagePath) {
            imageUrl = p.imagePath.startsWith('http')
                ? p.imagePath
                : `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}?width=800&quality=85&format=webp`;
        }
        
        const lineUrl = lineId && !lineId.startsWith('http')
            ? `https://line.me/ti/p/${lineId}`
            : lineId || '#';
        
        const dateNow = new Date();
        const dateString = dateNow.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        const validUntil = new Date(new Date().setFullYear(dateNow.getFullYear() + 1)).toISOString().split('T')[0];

        // Dynamic text generation for SEO
        const titleIntro = spin(["แนะนำ", "รีวิว", "โปรไฟล์", "ห้ามพลาด", "มาแรง"]);
        const descIntro = spin(["พบกับ", "ดูโปรไฟล์", "รายละเอียดของ", "ติดต่อ"]);
        const adj = spin(["ขี้อ้อน", "เอาใจเก่ง", "ฟิวแฟน", "งานดี", "ตรงปก", "น่ารัก"]);

        const pageTitle = `${titleIntro} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ราคา ${displayPrice}.-`;
        const metaDesc = `${descIntro} ${displayName} สาวไซด์ไลน์${provinceName} อายุ ${age} ปี ${adj} รับงานเองไม่ผ่านเอเย่นต์ พิกัด${location} ปลอดภัย ไม่ต้องโอนมัดจำ`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // Use ID for consistent "random" values, defaulting to 0 if ID is missing.
        const ratingValue = (4.7 + (id % 3) / 10).toFixed(1);
        const reviewCount = (id * 7) % 300 + 50;
        
        // --- SCHEMA.ORG JSON-LD ---
        const schema = {
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
                    "@type": ["Product", "LocalBusiness"],
                    "@id": `${canonicalUrl}#product`,
                    "name": pageTitle,
                    "description": metaDesc,
                    "image": [imageUrl],
                    "url": canonicalUrl,
                    "sku": `SDL-TH-${id}`,
                    "mpn": `SDL-TH-${id}`,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                    "address": { "@type": "PostalAddress", "addressLocality": provinceName, "addressCountry": "TH" },
                    "geo": { "@type": "GeoCoordinates", "latitude": "18.7883", "longitude": "98.9853" }, // Placeholder coordinates
                    "priceRange": "฿฿",
                    "telephone": "+66123456789", // Placeholder phone
                    "offers": {
                        "@type": "Offer",
                        "url": canonicalUrl,
                        "priceCurrency": "THB",
                        "price": cleanPrice,
                        "priceValidUntil": validUntil,
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
                        "author": { "@type": "Person", "name": "Verified Customer" },
                        "datePublished": new Date().toISOString().split('T')[0],
                        "reviewBody": `${displayName} ตัวจริงน่ารักมากครับ ตรงปก บริการดีเยี่ยม ประทับใจมากครับ`,
                        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5", "worstRating": "1" }
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        { "@type": "Question", "name": `จองคิว${displayName} ต้องทำอย่างไร?`, "acceptedAnswer": { "@type": "Answer", "text": `สามารถแอดไลน์ของน้อง (${lineId || 'ดูในโปรไฟล์'}) เพื่อสอบถามคิวงานและนัดหมายสถานที่ได้โดยตรงเลยครับ` } },
                        ...pageData.faq.map(item => ({
                            "@type": "Question",
                            "name": item.q,
                            "acceptedAnswer": { "@type": "Answer", "text": item.a }
                        }))
                    ]
                }
            ]
        };

    // --- HTML & CSS TEMPLATE ---
    const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta name="twitter:card" content="summary_large_image">

    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    
    <style>
        :root{--primary:#ec4899;--primary-light:#fff1f2;--bg:#f8fafc;--text:#1e293b;--text-light:#64748b;--white:#ffffff;--green:#06c755;--yellow:#fbbf24;--border:#e2e8f0;--radius:12px;--shadow:0 4px 15px rgba(0,0,0,0.05)}
        body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Prompt',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        .container{max-width:500px;margin:0 auto;background:var(--white);min-height:100vh;box-shadow:var(--shadow)}
        
        .breadcrumb{padding:12px 16px;font-size:12px;color:var(--text-light);border-bottom:1px solid var(--border)}
        .breadcrumb a:hover{color:var(--primary);text-decoration:underline}
        
        .hero{position:relative;width:100%;padding-top:125%;background:#f1f5f9}
        .hero img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
        .verified-badge{position:absolute;top:12px;right:12px;background:rgba(0,0,0,0.4);color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;backdrop-filter:blur(5px)}
        
        .content{padding:16px}
        .meta-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
        .rating{display:flex;align-items:center;gap:4px;color:var(--yellow);font-size:14px;font-weight:bold}
        .rating span{font-weight:normal;color:var(--text-light)}
        .date{font-size:11px;color:#94a3b8}
        
        h1{margin:0 0 4px 0;font-size:24px;color:var(--primary);line-height:1.3;font-weight:600}
        .location{font-size:14px;color:var(--text-light);display:flex;align-items:center;gap:5px;margin-bottom:20px}
        
        .info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px}
        .info-item{background:var(--bg);padding:12px;border-radius:var(--radius);text-align:center}
        .info-label{display:block;font-size:11px;color:var(--text-light);margin-bottom:2px}
        .info-val{font-size:16px;font-weight:bold;color:#334155}
        .price{color:var(--primary)}
        
        .desc{font-size:15px;color:#334155;margin-bottom:24px;padding:16px;background:var(--primary-light);border-radius:var(--radius);border-left:4px solid var(--primary)}
        
        .btn-line{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--green);color:var(--white);font-size:18px;font-weight:bold;padding:16px;border-radius:50px;box-shadow:0 4px 20px rgba(6,199,85,0.3);transition:transform .2s ease}
        .btn-line:active{transform:scale(0.97)}
        .safety-text{text-align:center;font-size:12px;color:#94a3b8;margin-top:12px}
        
        .related{margin-top:40px;padding-top:20px;border-top:1px solid var(--border)}
        .related h2{font-size:18px;font-weight:bold;margin:0 0 16px 0}
        .related-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .related-card img{width:100%;aspect-ratio:1/1.2;object-fit:cover;border-radius:var(--radius);margin-bottom:8px}
        .related-name{font-size:14px;font-weight:bold;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .related-loc{font-size:12px;color:var(--text-light)}
        
        .main-footer{text-align:center;font-size:12px;color:var(--text-light);padding:40px 20px 20px;background:var(--bg);margin-top:40px}

        @media(min-width: 400px) {
            .related-grid{grid-template-columns:repeat(4, 1fr); max-width: 100%;}
            .container{max-width:none;}
        }
    </style>
</head>
<body>
    <main class="container">
        <header>
            <nav class="breadcrumb">
                <a href="${CONFIG.DOMAIN}">🏠 หน้าแรก</a> &rsaquo; 
                <a href="${provinceUrl}">ไซด์ไลน์${provinceName}</a> &rsaquo; 
                <span>${displayName}</span>
            </nav>
            <div class="hero">
                <img src="${imageUrl}" alt="โปรไฟล์ ${displayName}" width="800" height="1000" fetchpriority="high">
                ${isVerified ? '<div class="verified-badge">✓ ยืนยันตัวตนแล้ว</div>' : ''}
            </div>
        </header>

        <article class="content">
            <section>
                <div class="meta-row">
                    <div class="rating">⭐ ${ratingValue} <span>(${reviewCount} รีวิว)</span></div>
                    <div class="date">อัปเดต: ${dateString}</div>
                </div>

                <h1>${pageTitle}</h1>
                <div class="location">📍 พิกัด: ${location}</div>

                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">ค่าขนม</span>
                        <span class="info-val price">฿${displayPrice}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">อายุ</span>
                        <span class="info-val">${age} ปี</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">สัดส่วน</span>
                        <span class="info-val">${proportions}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">สูง/หนัก</span>
                        <span class="info-val">${height} / ${weight}</span>
                    </div>
                </div>

                <div class="desc">
                    ${metaDesc}
                    <br><br>
                    <strong>จุดเด่น:</strong> ${spin(['เอาใจเก่ง', 'เป็นกันเอง', 'คุยสนุก', 'ไม่เร่งรีบ', 'ตรงปก 100%'])}
                </div>

                <a href="${lineUrl}" class="btn-line" target="_blank" rel="noopener noreferrer" aria-label="ทักไลน์เพื่อจองคิว">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.221 5.534c-1.332-1.332-3.08-2.064-4.971-2.064-3.896 0-7.061 3.164-7.061 7.061 0 1.41.416 2.733 1.154 3.86l-1.258 3.633 3.72-1.232c1.07.668 2.303 1.05 3.599 1.05h.003c3.896 0 7.061-3.164 7.061-7.061 0-1.892-.732-3.639-2.064-4.971l-.001-.001zm-4.971 12.09c-1.12 0-2.292-.294-3.32-.862l-.237-.141-2.472.815.828-2.41-.155-.247c-.621-1.003-.953-2.167-.953-3.391 0-3.238 2.633-5.871 5.871-5.871 1.574 0 3.053.613 4.152 1.711s1.711 2.578 1.711 4.152c0 3.237-2.633 5.87-5.87 5.87l-.005.003zm-2.01-6.938h-1.002v-1.003h1.002v1.003zm2.01 0h-1.002v-1.003h1.002v1.003zm2.01 0h-1.002v-1.003h1.002v1.003zm-6.02-3.01h-1.002v-1.003h1.002v1.003zm2.01 0h-1.002v-1.003h1.002v1.003zm2.01 0h-1.002v-1.003h1.002v1.003z"/></svg>
                    <span>ทักไลน์จองคิว</span>
                </a>
                <div class="safety-text">🛡️ ปลอดภัย 100% • ไม่ต้องโอนมัดจำ</div>
            </section>

            ${related.length > 0 ? `
            <aside class="related">
                <h2>🔥 น้องๆ แนะนำใน${provinceName}</h2>
                <div class="related-grid">
                    ${related.map(r => `
                        <a href="${CONFIG.DOMAIN}/sideline/${r.slug}" class="related-card">
                            <img src="${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${r.imagePath}?width=250" alt="รูปโปรไฟล์น้อง${r.name}" loading="lazy" width="250" height="300">
                            <span class="related-name">น้อง${r.name}</span>
                            <span class="related-loc">📍 ${r.location || provinceName}</span>
                        </a>
                    `).join('')}
                </div>
            </aside>` : ''}
        </article>

        <footer class="main-footer">
            &copy; ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}<br>
            ให้บริการใน${provinceName}และจังหวัดอื่นๆ ทั่วประเทศ
        </footer>
    </main>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
                "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=600",
                "x-robots-tag": "index, follow, max-image-preview:large"
            }
        });

    } catch (e) {
        // 5. CATCH-ALL ERROR HANDLING: Final safety net for unexpected errors.
        console.error("Critical Function Error:", e);
        return new Response("An unexpected error occurred on the server. Please try again later.", {
            status: 500,
            headers: { "content-type": "text/plain; charset=utf-8" }
        });
    }
};