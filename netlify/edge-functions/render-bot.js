import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// --- 1. CONFIGURATION ---
const CONFIG = {
    // แนะนำ: ใน Production ควรย้าย Key เหล่านี้ไปที่ Netlify Environment Variables
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
const formatDate = () => new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });

// สร้างวันที่ในอนาคต 1 ปี สำหรับ Schema priceValidUntil
const getFutureDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
};

// แปลง Path รูปภาพให้เป็น URL เต็ม และปรับขนาด
const optimizeImg = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/default-profile.webp`; // Fallback image
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=800&quality=85&format=webp`;
};

// --- 3. MAIN LOGIC ---
export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // A. Bot Detection (ดักจับ Bot เพื่อทำ SEO SSR)
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i.test(ua);
    const isDebug = request.url.includes('?debug=true');

    // ถ้าไม่ใช่ Bot และไม่ได้ Debug ให้ผ่านไปโหลดหน้า App ปกติ (Client-side Rendering)
    if (!isBot && !isDebug) {
        return context.next();
    }

    try {
        const url = new URL(request.url);
        const slug = url.pathname.split('/').pop(); // ดึง Slug จาก URL

        // B. Query Data from Supabase
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p, error } = await supabase.from('profiles')
            .select('id, name, slug, imagePath, galleryPaths, styleTags, rate, location, age, height, weight, proportions, lineId, verified, status, created_at, province_id, provinces(nameThai, slug)')
            .eq('slug', slug)
            .maybeSingle();

        // กรณีไม่เจอน้อง หรือ Database Error ให้ Client จัดการ (404 Page)
        if (error || !p) {
            console.error("Profile not found or DB Error:", error);
            return context.next();
        }

        // C. Related Profiles (หาเพื่อนในจังหวัดเดียวกัน)
        let related = [];
        if (p.province_id) {
            const { data: rel } = await supabase.from('profiles')
                .select('slug, name, imagePath, location')
                .eq('province_id', p.province_id)
                .eq('status', 'active')
                .neq('id', p.id)
                .limit(4);
            related = rel || [];
        }

        // D. Data Preparation (เตรียมข้อมูลสำหรับแสดงผล)
        const rawName = p.name || 'สาวสวย';
        const displayName = rawName.startsWith('น้อง') ? rawName : `น้อง${rawName}`;
        
        // จัดการเรื่องราคา
        const priceVal = (p.rate || "1500").toString().replace(/\D/g, ''); // เอาเฉพาะตัวเลข "1500"
        const displayPrice = parseInt(priceVal).toLocaleString(); // "1,500"
        
        const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
        const provinceSlug = p.provinces?.slug || 'chiangmai';
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceSlug}`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // จัดการรูปภาพ
        const mainImage = optimizeImg(p.imagePath);
        const galleryImages = (p.galleryPaths || []).map(path => optimizeImg(path));
        
        // Tags และ Styles
        const styles = p.styleTags && p.styleTags.length > 0 ? p.styleTags.join(', ') : 'น่ารัก, เป็นกันเอง, ฟิวแฟน';

        // --- SEO: Title & Description ---
        const title = `${displayName} รับงานไซด์ไลน์${provinceName} | ตรงปก 100% เริ่มต้น ${displayPrice}.-`;
        const desc = `จองคิว ${displayName} ไซด์ไลน์${provinceName} โซน${p.location || provinceName} อายุ ${p.age || '20+'} สัดส่วน ${p.proportions || '-'} นิสัย ${styles} รูปตัวจริง ไม่ต้องโอนมัดจำ (อัปเดต ${formatDate()})`;

        // --- SEO: Fake Ratings (Deterministic based on ID for consistency) ---
        // ใช้ ID คำนวณเพื่อให้คะแนนคงที่สำหรับคนเดิมเสมอ (Google ไม่ชอบคะแนนที่เปลี่ยนไปมาทุกครั้งที่ Crawl)
        const ratingValue = (4.5 + (p.id % 5) / 10).toFixed(1); // 4.5 - 4.9
        const reviewCount = (p.id * 13) % 400 + 50; // 50 - 450 reviews

        // --- E. SCHEMA.ORG (JSON-LD) ---
        // ส่วนสำคัญ: ต้องใช้ตัวแปรที่ประกาศไว้ข้างบน (title, desc, priceVal)
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
                    "@type": ["Product", "LocalBusiness"],
                    "@id": `${canonicalUrl}#product`,
                    "name": title,
                    "description": desc,
                    "image": [mainImage, ...galleryImages.slice(0, 5)],
                    "sku": `SDL-${p.id}`,
                    "mpn": `SDL-${p.id}`,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                    "address": { 
                        "@type": "PostalAddress", 
                        "addressLocality": provinceName, 
                        "addressCountry": "TH" 
                    },
                    "priceRange": "฿฿",
                    "offers": {
                        "@type": "Offer",
                        "url": canonicalUrl,
                        "priceCurrency": "THB",
                        "price": priceVal,
                        "priceValidUntil": getFutureDate(),
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
                        "author": { "@type": "Person", "name": "Verified Member" },
                        "datePublished": p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
                        "reviewBody": `${displayName} ตัวจริงน่ารักมากครับ ตรงปก งานดี บริการประทับใจ ไม่ผิดหวังเลยครับ`,
                        "reviewRating": { "@type": "Rating", "ratingValue": "5" }
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        { 
                            "@type": "Question", 
                            "name": `${displayName} รับงานโซนไหน?`, 
                            "acceptedAnswer": { "@type": "Answer", "text": `น้อง${displayName} สะดวกรับงานในพื้นที่ ${p.location || provinceName} และระแวกใกล้เคียงครับ` } 
                        },
                        { 
                            "@type": "Question", 
                            "name": `ราคาเริ่มต้นเท่าไหร่?`, 
                            "acceptedAnswer": { "@type": "Answer", "text": `เรทค่าขนมเริ่มต้นที่ ${displayPrice} บาทครับ (ขึ้นอยู่กับรายละเอียดงาน)` } 
                        },
                        { 
                            "@type": "Question", 
                            "name": `ต้องโอนมัดจำก่อนไหม?`, 
                            "acceptedAnswer": { "@type": "Answer", "text": `ปลอดภัย 100% ครับ เว็บเราไม่มีนโยบายโอนมัดจำ จ่ายหน้างานกับน้องได้เลย` } 
                        }
                    ]
                }
            ]
        };

        // --- F. HTML GENERATION (SSR) ---
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="profile">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="${mainImage}">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:locale" content="th_TH">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">
    <meta name="twitter:image" content="${mainImage}">

    <!-- Schema.org -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

    <style>
        :root{--primary:#ec4899;--bg:#f8fafc;--text:#334155;--white:#fff;--success:#10b981}
        body{margin:0;font-family:-apple-system,'Prompt',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;padding-bottom:80px}
        a{text-decoration:none;color:inherit}
        .container{max-width:480px;margin:0 auto;background:var(--white);min-height:100vh;box-shadow:0 0 15px rgba(0,0,0,0.05)}
        
        /* Hero Section */
        .hero{position:relative;width:100%;padding-top:125%;background:#e2e8f0;overflow:hidden}
        .hero img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
        .status-badge{position:absolute;top:10px;right:10px;background:var(--success);color:#fff;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.2)}
        
        /* Content */
        .content{padding:20px}
        h1{font-size:20px;color:var(--primary);margin:0 0 5px 0;font-weight:700;line-height:1.4}
        .update-time{font-size:11px;color:#94a3b8;margin-bottom:15px;display:block}
        
        /* Spec Grid */
        .spec-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px}
        .spec-item{background:#f1f5f9;padding:12px;border-radius:8px;text-align:center}
        .spec-lbl{font-size:11px;color:#64748b;display:block}
        .spec-val{font-size:15px;font-weight:bold;color:#1e293b}
        .price-val{color:var(--primary);font-size:18px}

        /* Sections */
        .section{margin-bottom:25px;border-bottom:1px solid #f1f5f9;padding-bottom:20px}
        .h3-title{font-size:16px;margin:0 0 15px 0;display:flex;align-items:center;gap:8px;font-weight:700}
        .h3-title::before{content:'';display:block;width:4px;height:20px;background:var(--primary);border-radius:2px}
        
        /* Gallery */
        .gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .gallery img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:6px;background:#f1f5f9}
        
        /* FAQ */
        .faq-item{margin-bottom:12px;background:#f8fafc;padding:12px;border-radius:8px}
        .faq-q{font-weight:600;font-size:13px;color:#334155;margin-bottom:4px}
        .faq-a{font-size:13px;color:#64748b}

        /* Action Bar */
        .action-bar{position:fixed;bottom:0;left:0;right:0;max-width:480px;margin:0 auto;background:#fff;padding:10px 20px;box-shadow:0 -2px 10px rgba(0,0,0,0.05);display:flex;gap:10px;z-index:99}
        .btn{flex:1;padding:12px;border-radius:50px;text-align:center;font-weight:bold;font-size:16px;border:none;cursor:pointer}
        .btn-line{background:#06c755;color:#fff;box-shadow:0 4px 12px rgba(6,199,85,0.3)}
        
        /* Related */
        .rel-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}
        .rel-item img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px}
        .rel-name{font-size:13px;font-weight:600;margin-top:5px;display:block}
        
        /* Breadcrumb */
        .bread{font-size:11px;color:#94a3b8;margin-bottom:10px;display:flex;gap:5px;overflow-x:auto;white-space:nowrap}
    </style>
</head>
<body>
    <div class="container">
        <!-- Breadcrumb -->
        <div style="padding:10px 20px 0;">
            <div class="bread">
                <a href="${CONFIG.DOMAIN}">หน้าแรก</a> <span>/</span>
                <a href="${provinceUrl}">ไซด์ไลน์${provinceName}</a> <span>/</span>
                <span>${displayName}</span>
            </div>
        </div>

        <!-- Hero Image -->
        <div class="hero">
            <img src="${mainImage}" alt="${title}">
            ${p.verified ? '<div class="status-badge">✓ Verified ตรวจสอบแล้ว</div>' : ''}
        </div>

        <div class="content">
            <h1>${title}</h1>
            <span class="update-time">📅 อัปเดตข้อมูลเมื่อ: ${formatDate()}</span>

            <!-- Specs -->
            <div class="spec-grid">
                <div class="spec-item"><span class="spec-lbl">เรทราคา</span><span class="spec-val price-val">฿${displayPrice}</span></div>
                <div class="spec-item"><span class="spec-lbl">อายุ</span><span class="spec-val">${p.age || '20+'} ปี</span></div>
                <div class="spec-item"><span class="spec-lbl">สัดส่วน</span><span class="spec-val">${p.proportions || '-'}</span></div>
                <div class="spec-item"><span class="spec-lbl">พิกัด</span><span class="spec-val">${p.location || provinceName}</span></div>
            </div>

            <!-- About -->
            <div class="section">
                <h3 class="h3-title">ข้อมูลน้อง${displayName}</h3>
                <p style="font-size:14px;color:#475569;">
                    ${displayName} สาวสวยประจำโซน <strong>${p.location || provinceName}</strong> 
                    สไตล์การดูแลแบบ <strong>${styles}</strong> รับประกันงานดี ตรงปก 
                    พี่ๆ ที่กำลังมองหาคนดูแลฟิวแฟน เป็นกันเอง ห้ามพลาดครับ
                </p>
                <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
                    ${(p.styleTags || []).map(t => `<span style="background:#fce7f3;color:#be185d;padding:4px 10px;border-radius:15px;font-size:12px">${t}</span>`).join('')}
                </div>
            </div>

            <!-- FAQ -->
            <div class="section">
                <h3 class="h3-title">คำถามที่พบบ่อย (FAQ)</h3>
                <div class="faq-item">
                    <div class="faq-q">Q: ${displayName} รับงานโซนไหนบ้าง?</div>
                    <div class="faq-a">A: สะดวกรับงานย่าน ${p.location || provinceName} ค่ะ</div>
                </div>
                <div class="faq-item">
                    <div class="faq-q">Q: ต้องโอนมัดจำก่อนไหม?</div>
                    <div class="faq-a">A: ไม่ต้องโอนมัดจำค่ะ จ่ายหน้างานได้เลย ปลอดภัย 100%</div>
                </div>
                <div class="faq-item">
                    <div class="faq-q">Q: ติดต่อน้องทางไหนไวสุด?</div>
                    <div class="faq-a">A: แอดไลน์ด้านล่างทักมาจองคิวได้เลยค่ะ (ตอบไวมาก)</div>
                </div>
            </div>

            <!-- Gallery -->
            ${galleryImages.length > 0 ? `
            <div class="section">
                <h3 class="h3-title">รูปภาพเพิ่มเติม</h3>
                <div class="gallery">
                    ${galleryImages.slice(0, 6).map(img => `<img src="${img}" alt="${displayName} ${provinceName}" loading="lazy">`).join('')}
                </div>
            </div>` : ''}

            <!-- Related -->
            ${related.length > 0 ? `
            <div class="section" style="border:none">
                <h3 class="h3-title">แนะนำสาวสวยใกล้เคียง</h3>
                <div class="rel-grid">
                    ${related.map(r => `
                        <a href="${CONFIG.DOMAIN}/sideline/${r.slug}" class="rel-item">
                            <img src="${optimizeImg(r.imagePath)}" alt="${r.name}">
                            <span class="rel-name">น้อง${r.name}</span>
                            <span style="font-size:11px;color:#64748b">📍 ${r.location || provinceName}</span>
                        </a>
                    `).join('')}
                </div>
            </div>` : ''}
        </div>
        
        <br><br>

        <!-- Fixed Bottom Bar -->
        <div class="action-bar">
            <a href="${p.lineId && !p.lineId.startsWith('http') ? 'https://line.me/ti/p/~' + p.lineId : (p.lineId || '#')}" class="btn btn-line">
                💚 แอดไลน์จองคิว
            </a>
        </div>

    </div>
</body>
</html>`;

        // G. Return Response
        return new Response(html, {
            headers: { 
                "content-type": "text/html; charset=utf-8", 
                "cache-control": "public, max-age=3600", // Cache 1 ชั่วโมง
                "x-robots-tag": "index, follow" // สั่งให้ Bot เก็บข้อมูลแน่นอน
            }
        });

    } catch (e) {
        // Critical Error Handling: ถ้ามีอะไรพัง ให้ Log และส่งต่อไปหน้าปกติ
        console.error("Render Bot Error:", e);
        return context.next();
    }
};