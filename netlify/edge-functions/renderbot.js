
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// --- 1. CONFIGURATION ---
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Thailand',
    LOGO_URL: '/images/logo-sidelinechiangmai.webp',
    OG_PREVIEW: 'https://sidelinechiangmai.netlify.app/images/sidelinechiangmai-social-preview.webp',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

// --- 2. ADVANCED HELPERS ---
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];
const formatDate = () => new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
const getFutureDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
};

const optimizeImg = (path, width = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/default-profile.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=80&format=webp`;
};

const getLocalZones = (key) => {
    const zones = {
        'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'มช.', 'แม่โจ้', 'ท่าแพ', 'หางดง'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'เอกมัย', 'ทองหล่อ', 'สีลม', 'สาทร'],
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'บางแสน', 'ศรีราชา', 'เกาะล้าน', 'หนองปรือ'],
        'khon-kaen': ['มข.', 'กังสดาล', 'ในเมือง', 'เซ็นทรัลขอนแก่น']
    };
    
    let result = zones[key?.toLowerCase()] || ['ตัวเมือง', 'ย่านธุรกิจ', 'โรงแรมชั้นนำ', 'พิกัดยอดนิยม'];
    
    // Fallback: ถ้าข้อมูลมีน้อยกว่า 4 ให้เติมให้ครบ เพื่อความสวยงามของ SEO
    const fallbacks = ['พิกัดยอดนิยม', 'ย่านใจกลางเมือง', 'เดินทางสะดวก', 'ใกล้โรงแรมชั้นนำ'];
    let fIndex = 0;
    while (result.length < 4) {
        result.push(fallbacks[fIndex % fallbacks.length]);
        fIndex++;
    }
    return result;
};

// --- 3. MAIN ROUTER ---
export default async (request, context) => {
    const url = new URL(request.url);
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|curl|inspectiontool|lighthouse/i.test(ua);
    const isDebug = url.searchParams.get('debug') === 'true';

    if (!isBot && !isDebug) return context.next();

    const pathParts = url.pathname.split('/').filter(Boolean);
    const pageType = pathParts[0]; 
    const slug = pathParts[1];

    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    try {
        if (pageType === 'sideline' && slug) {
            return await handleProfilePage(supabase, slug);
        } else if ((pageType === 'location' || pageType === 'province') && slug) {
            // ส่งค่าครบถ้วนเพื่อป้องกัน Function Crash
            return await handleLocationPage(request, context, supabase, slug);
        }
        return context.next();
    } catch (e) {
        console.error("Critical SSR Error:", e);
        // หากพัง ให้ปล่อยให้ Netlify แสดงหน้า Client-side ปกติ แทนที่จะขึ้น Error
        return context.next(); 
    }
};


async function handleProfilePage(supabase, slug) {
    if (!slug || !/^[a-zA-Z0-9-_]+$/.test(slug)) return new Response("Invalid Slug", { status: 400 });

    const { data: p } = await supabase.from('profiles').select('*, provinces(nameThai, key)').eq('slug', slug).eq('active', true).maybeSingle();
    if (!p) return new Response("Profile Not Found", { status: 404 });

    // --- 1. Fallback & Data Cleaning (ระบบกันข้อมูลโบ๋) ---
    const displayName = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
    const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
    const provinceKey = p.provinces?.key || 'chiangmai';
    const location = p.location || 'ตัวเมือง';
    const stats = p.stats || '34-24-35';
    const age = p.age || '22';
    const height = p.height || '162';
    const rate = p.rate ? parseInt(p.rate).toLocaleString() : '1,500';
    
    // --- 2. URL & SEO Strings ---
    const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
    const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;
    const mainImg = optimizeImg(p.imagePath);
    const galleryImages = (p.galleryPaths || []).map(path => optimizeImg(path, 400));
    const isVerified = p.isfeatured === true; // ใช้ isfeatured แทนระบบ verified

    // --- 3. Internal Linking (จังหวัดใกล้เคียงเพื่อกระจาย Bot) ---
    const nearbyProvinces = [
        {n:'กรุงเทพ',s:'bangkok'}, {n:'เชียงใหม่',s:'chiangmai'}, {n:'ชลบุรี',s:'chonburi'}, 
        {n:'ขอนแก่น',s:'khon-kaen'}, {n:'ภูเก็ต',s:'phuket'}, {n:'ระยอง',s:'rayong'}
    ].filter(lp => lp.s !== provinceKey).slice(0, 6);

    const { data: related } = await supabase.from('profiles').select('slug, name, imagePath, location').eq('provinceKey', p.provinceKey).neq('id', p.id).eq('active', true).limit(4);
    const ratingValue = (4.7 + (p.id % 3) / 10).toFixed(1);
    const reviewCount = (p.id * 7) % 200 + 75;

    const pageTitle = `${displayName} ไซด์ไลน์${provinceName} ${location} รับงานเอง ไม่ผ่านเอเย่นต์ ตัวจริงตรงปก`;
    const metaDesc = `ติดต่อ ${displayName} (${age} ปี) ไซด์ไลน์${provinceName} ย่าน ${location} สเปค ${stats} สูง ${height} รับประกันตัวจริงตรงปก 100% ปลอดภัย ไม่ต้องโอนมัดจำก่อน เจอน้องก่อนจ่ายทีหลัง (อัปเดตล่าสุด ${formatDate()})`;

    const schemaData = {
        "@context": "https://schema.org/",
        "@graph": [
            { "@type": "Organization", "@id": `${CONFIG.DOMAIN}/#organization`, "name": CONFIG.BRAND_NAME, "url": CONFIG.DOMAIN, "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}${CONFIG.LOGO_URL}` }, "sameAs": CONFIG.SOCIAL_PROFILES },
            { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN }, { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }, { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }] },
            {
                "@type": ["Product", "LocalBusiness"], "name": pageTitle, "description": metaDesc, "image": [mainImg, ...galleryImages],
                "sku": `SDL-${p.id}`, "mpn": `SDL-${p.id}`, "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                "address": { "@type": "PostalAddress", "addressLocality": provinceName, "addressCountry": "TH" },
                "offers": { "@type": "Offer", "url": canonicalUrl, "price": (p.rate || "1500").replace(/\D/g,''), "priceCurrency": "THB", "availability": "https://schema.org/InStock", "priceValidUntil": getFutureDate() },
                "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingValue, "reviewCount": reviewCount.toString() }
            },
            {
                "@type": "FAQPage", "mainEntity": [
                    { "@type": "Question", "name": `จองคิว ${displayName} ต้องโอนมัดจำไหม?`, "acceptedAnswer": { "@type": "Answer", "text": `ไม่ต้องโอนมัดจำค่ะ เราเน้นความปลอดภัยสูงสุดให้พี่ๆ โดยจ่ายเงินหน้างานหลังจากที่ได้เจอน้อง ${p.name} แล้วเท่านั้นค่ะ` } },
                    { "@type": "Question", "name": `น้อง ${p.name} รับงานที่ไหนบ้าง?`, "acceptedAnswer": { "@type": "Answer", "text": `พิกัดหลักของน้องคือย่าน ${location} ใน${provinceName} ค่ะ ส่วนพื้นที่ใกล้เคียงในตัวเมืองสามารถสอบถามน้องได้โดยตรงผ่านไลน์ค่ะ` } }
                ]
            }
        ]
    };

    const lineIdClean = (p.lineId || '').replace('@', '').trim();
    const lineLink = (p.lineId || '').startsWith('http') ? p.lineId : `https://line.me/ti/p/~${lineIdClean}`;

    return new Response(`<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}"><link rel="canonical" href="${canonicalUrl}">
    <meta property="og:title" content="${pageTitle}"><meta property="og:description" content="${metaDesc}"><meta property="og:image" content="${mainImg}"><meta property="og:url" content="${canonicalUrl}"><meta property="og:type" content="profile">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        :root{--p:#ec4899;--bg:#f8fafc;--t:#1e293b;--white:#fff}
        body{margin:0;font-family:-apple-system,'Prompt',sans-serif;background:var(--bg);color:var(--t);line-height:1.6;padding-bottom:100px}
        a{text-decoration:none;color:inherit}
        .app{max-width:480px;margin:0 auto;background:var(--white);min-height:100vh;box-shadow:0 0 20px rgba(0,0,0,0.05)}
        header{padding:12px 20px;border-bottom:1px solid #f1f5f9;background:#fff;display:flex;justify-content:center}
        .nav-bread{padding:10px 20px;font-size:12px;color:#64748b;background:#fdf2f8}
        .hero{position:relative;width:100%;padding-top:125%;background:#e2e8f0}
        .hero img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
        .v-badge{position:absolute;top:10px;right:10px;background:#10b981;color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;z-index:2}
        .content{padding:20px}
        h1{font-size:22px;color:var(--p);margin:10px 0;line-height:1.3;font-weight:bold}
        h2{font-size:18px;color:var(--p);margin-top:30px;border-bottom:2px solid #fce7f3;padding-bottom:8px}
        .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}
        .info-item{background:#f1f5f9;padding:12px;border-radius:10px;text-align:center}
        .info-val{font-size:16px;font-weight:bold;color:#334155}
        .gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:15px 0}
        .gallery-grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;border:1px solid #eee}
        .btn-line{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);width:92%;max-width:440px;background:#06c755;color:#fff;text-align:center;padding:16px;border-radius:50px;font-weight:bold;font-size:18px;box-shadow:0 6px 20px rgba(6,199,85,0.4);z-index:100;text-decoration:none}
        .nearby-box{margin-top:40px;padding:20px;background:#f1f5f9;border-radius:12px;border:1px solid #e2e8f0}
        .nearby-flex{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
        .nearby-tag{background:#fff;border:1px solid #d1d5db;color:#4b5563;padding:6px 14px;border-radius:20px;font-size:13px;text-decoration:none}
    </style>
</head>
<body>
    <div class="app">
        <header><a href="${CONFIG.DOMAIN}"><img src="${CONFIG.LOGO_URL}" alt="${CONFIG.BRAND_NAME}" width="240" height="28" style="height:28px;width:auto"></a></header>
        <nav class="nav-bread">🏠 <a href="${CONFIG.DOMAIN}">หน้าแรก</a> &rsaquo; <a href="${provinceUrl}">ไซด์ไลน์${provinceName}</a> &rsaquo; ${displayName}</nav>
        <div class="hero">
            <img src="${mainImg}" alt="${displayName} ไซด์ไลน์${provinceName} ย่าน ${location} ตัวจริงตรงปก" fetchpriority="high">
            ${isVerified ? '<div class="v-badge">✓ ตัวจริงตรงปก 100%</div>' : ''}
        </div>
        <div class="content">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:10px">
                <span style="color:#fbbf24">⭐ ${ratingValue} <span style="color:#94a3b8">(${reviewCount} รีวิว)</span></span>
                <span style="color:#94a3b8">อัปเดต: ${formatDate()}</span>
            </div>
            
            <h1>${displayName} ไซด์ไลน์${provinceName} ${location} | รับงานเอง ไม่มัดจำ</h1>
            
            <p>พบกับ <strong>${displayName}</strong> สาวสวยไซด์ไลน์${provinceName} ย่าน ${location} น้องเป็นคนคุยสนุก ใจดี บริการแบบฟีลแฟน ดูแลประทับใจแน่นอน ที่สำคัญคือปลอดภัย 100% <em>"ไม่ต้องโอนมัดจำก่อน"</em> เจอน้องแล้วค่อยจ่ายหน้างานค่ะ</p>

            <div class="info-grid">
                <div class="info-item"><span>เรทค่าขนม</span><div class="info-val" style="color:var(--p)">฿${rate}</div></div>
                <div class="info-item"><span>สัดส่วน</span><div class="info-val">${stats}</div></div>
                <div class="info-item"><span>อายุ</span><div class="info-val">${age} ปี</div></div>
                <div class="info-item"><span>ส่วนสูง</span><div class="info-val">${height} ซม.</div></div>
            </div>

            ${galleryImages.length > 0 ? `
            <h2>📷 รูปภาพเพิ่มเติมของ ${displayName}</h2>
            <div class="gallery-grid">
                ${galleryImages.map((img, i) => {
                    // สร้างลิสต์คีย์เวิร์ดที่จะสลับกันแสดงในแต่ละรูป
                    const seoKeywords = ['ตัวจริงตรงปก', 'รับงานเอง', 'ไม่ผ่านเอเย่นต์', 'งานเอนเตอร์เทน', 'ฟีลแฟน'];
                    const extraKwd = seoKeywords[i % seoKeywords.length]; // สลับคีย์เวิร์ดไปเรื่อยๆ ตามลำดับรูป
                    
                    return `
                        <img src="${img}" 
                             alt="${displayName} ไซด์ไลน์${provinceName} ย่าน${location} ${extraKwd} รูปที่ ${i+1}" 
                             loading="lazy"
                             style="width:100%; object-fit:cover; border-radius:8px;">
                    `;
                }).join('')}
            </div>` : ''}

            <h2>📍 พิกัดและการนัดพบ</h2>
            <p>พิกัดหลักของน้องคือโซน <strong>${location}</strong> และพื้นที่ใกล้เคียงในตัวเมือง${provinceName} นัดหมายปลอดภัยในสถานที่ส่วนตัวหรือโรงแรมชั้นนำ ขอย้ำว่า <strong>ไม่มีการโอนเงินก่อนทุกกรณี</strong> เพื่อความสบายใจของพี่ๆ ค่ะ</p>
            
            <div style="margin-top:30px;padding:20px;background:#fff5f7;border-radius:12px;border:1px solid #fce7f3">
                <h3 style="margin-top:0;color:var(--p);font-size:16px">💬 รีวิวจากสมาชิกล่าสุด</h3>
                <p style="margin:0;font-size:14px;font-style:italic">"น้อง${p.name} งานดีมากครับ คุยเก่งเป็นกันเองสุดๆ ตัวจริงตรงปกไม่ผิดหวังเลย แนะนำครับ"</p>
                <div style="font-size:11px;color:#94a3b8;margin-top:8px">— Verified Member (คุณต้น)</div>
            </div>

            <div class="nearby-box">
                <h3 style="margin-top:0;font-size:15px;color:#374151">📍 ค้นหาไซด์ไลน์พื้นที่อื่นๆ</h3>
                <div class="nearby-flex">
                    ${nearbyProvinces.map(lp => `<a href="${CONFIG.DOMAIN}/location/${lp.s}" class="nearby-tag">ไซด์ไลน์${lp.n}</a>`).join('')}
                </div>
            </div>
            
            <div style="margin-top:40px;font-size:11px;color:#94a3b8;line-height:1.5">
                <strong>คำเตือน:</strong> ข้อมูลนี้จัดทำขึ้นเพื่อการตลาดและ SEO เท่านั้น โปรดใช้วิจารณญาณในการติดต่อสื่อสาร เว็บไซต์เป็นเพียงสื่อกลางรวบรวมโปรไฟล์
            </div>
        </div>
        <a href="${lineLink}" class="btn-line" target="_blank">📲 แอดไลน์จองคิว ${displayName}</a>
    </div>
</body>
</html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600", "X-Robots-Tag": "index, follow" } });
}

async function handleLocationPage(request, context, supabase, slug) {
    try {
        const cleanSlug = slug.toLowerCase().trim();
        const { data: province } = await supabase.from('provinces').select('*').ilike('key', cleanSlug).maybeSingle();
        if (!province) return context.next();

        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('provinceKey', province.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false }) // ดึงคนเด่นขึ้นก่อน
            .order('id', { ascending: false })
            .limit(60);

        const provinceName = province.nameThai;
        const localZones = getLocalZones(cleanSlug);
        const actualCount = profiles?.length || 0;
        const displayCountSEO = actualCount > 0 ? actualCount : "มากกว่า 15";

        const title = `ไซด์ไลน์${provinceName} เพื่อนเที่ยว งานเอนเตอร์เทน ตัวจริงตรงปก - ${CONFIG.BRAND_NAME}`;
        const desc = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง ครอบคลุมพื้นที่ ${localZones.slice(0, 4).join(', ')} พบกับน้องๆ ${displayCountSEO} คน ตรวจสอบแล้ว รูปตรงปก ปลอดภัย ไม่มีโอนมัดจำ จ่ายเงินหน้างาน (อัปเดตล่าสุด ${formatDate()})`;
        const canonicalUrl = `${CONFIG.DOMAIN}/location/${cleanSlug}`;
        
        const otherLocs = [
            {n:'กรุงเทพ',s:'bangkok'}, {n:'ชลบุรี',s:'chonburi'}, {n:'เชียงใหม่',s:'chiangmai'}, 
            {n:'ขอนแก่น',s:'khon-kaen'}, {n:'ภูเก็ต',s:'phuket'}, {n:'ระยอง',s:'rayong'}
        ].filter(i => i.s !== cleanSlug);

        const provinceRating = (4.7 + (province.id % 3) / 10).toFixed(1);
        const provinceReviews = (province.id * 23) % 150 + 120;

        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                { "@type": "Organization", "@id": `${CONFIG.DOMAIN}/#organization`, "name": CONFIG.BRAND_NAME, "url": CONFIG.DOMAIN, "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}${CONFIG.LOGO_URL}` } },
                { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN }, { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": canonicalUrl }] },
                { 
                    "@type": "Product", "name": `บริการเพื่อนเที่ยว ไซด์ไลน์${provinceName}`, "description": desc, "url": canonicalUrl, "image": CONFIG.OG_PREVIEW,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME }, "sku": `LOC-${cleanSlug}`,
                    "offers": { "@type": "AggregateOffer", "priceCurrency": "THB", "lowPrice": "1500", "highPrice": "5000", "offerCount": (actualCount || 15).toString(), "availability": "https://schema.org/InStock" },
                    "aggregateRating": { "@type": "AggregateRating", "ratingValue": provinceRating, "reviewCount": provinceReviews.toString() } 
                }
            ]
        };

        const profileGridHTML = actualCount > 0 
            ? profiles.map(p => {
                const isFeatured = p.isfeatured === true;
                const pName = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
                const pRate = parseInt(p.rate || 1500).toLocaleString();
                return `
                <a href="/sideline/${p.slug}" class="card ${isFeatured ? 'featured-card' : ''}">
                    <div class="card-img-box">
                        <img src="${optimizeImg(p.imagePath, 350)}" alt="${pName} ไซด์ไลน์${provinceName} ย่าน ${p.location || provinceName}" loading="lazy">
                        ${isFeatured ? '<div class="f-badge">แนะนำ 🔥</div>' : ''}
                    </div>
                    <div style="padding:12px">
                        <div style="font-weight:bold;color:#fff;font-size:16px">${pName}</div>
                        <div style="font-size:12px;color:#94a3b8">📍 ${p.location || provinceName}</div>
                        <div style="color:var(--p);font-weight:bold;margin-top:5px">฿${pRate}</div>
                    </div>
                </a>`;
            }).join('')
            : `<div class="box" style="text-align:center;width:100%;grid-column: 1 / -1;"><h2>กำลังอัปเดตข้อมูลน้องๆ ในพื้นที่ ${provinceName}</h2></div>`;

        return new Response(`<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${desc}"><link rel="canonical" href="${canonicalUrl}">
    <meta property="og:title" content="${title}"><meta property="og:image" content="${CONFIG.OG_PREVIEW}"><meta property="og:url" content="${canonicalUrl}">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        :root{--p:#ec4899;--bg:#0f172a;--c:#1e293b;--t:#f1f5f9}
        body{font-family:'Prompt',sans-serif;background:var(--bg);color:var(--t);margin:0;line-height:1.5}
        .container{max-width:1000px;margin:0 auto;padding:20px}
        header{text-align:center;padding:35px 20px;background:#1e293b;border-bottom:3px solid var(--p)}
        .z-tag{background:rgba(236,72,153,0.1);color:var(--p);padding:6px 14px;border-radius:20px;font-size:12px;border:1px solid var(--p);margin:4px;display:inline-block;text-decoration:none}
        .grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(165px, 1fr));gap:15px;margin:30px 0}
        .card{background:var(--c);border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;border:1px solid #334155;transition:0.3s;position:relative}
        .card-img-box{position:relative;padding-top:125%;background:#1e293b}
        .card-img-box img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
        .featured-card { border: 2px solid var(--p) !important; box-shadow: 0 0 15px rgba(236,72,153,0.3); transform: translateY(-3px); }
        .f-badge { position:absolute; top:8px; left:8px; background:var(--p); color:#fff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:bold; z-index:5; }
        .box{background:var(--c);padding:25px;border-radius:15px;margin:25px 0;border:1px solid #334155}
        h1,h2,h3{color:var(--p)}
        @media (max-width: 480px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
    </style>
</head>
<body>
    <header>
        <a href="${CONFIG.DOMAIN}"><img src="${CONFIG.LOGO_URL}" alt="${CONFIG.BRAND_NAME}" width="240"></a>
        <h1 style="color:#fff;font-size:24px;margin-top:20px">ไซด์ไลน์${provinceName} รับงานเอง</h1>
    </header>
    <main class="container">
        <div style="text-align:center;margin-bottom:20px">${localZones.map(z => `<span class="z-tag">📍 ${z}</span>`).join('')}</div>
        <div class="grid">${profileGridHTML}</div>
        <div class="box">
            <h3>ทำไมต้องเลือกหาเพื่อนเที่ยว${provinceName}กับเรา?</h3>
            <p>เราคืออันดับ 1 ในการรวบรวมโปรไฟล์น้องๆ ไซด์ไลน์${provinceName} ไม่ผ่านเอเย่นต์ มั่นใจได้ด้วยระบบตรวจสอบความถูกต้อง รูปตรงปก 100% และที่สำคัญคือ <strong>ปลอดภัย ไม่มีการโอนมัดจำก่อน</strong> เจอน้องแล้วค่อยจ่ายเงินหน้างานค่ะ</p>
        </div>
        <div style="text-align:center;margin-top:30px">
            <p style="color:#64748b;font-size:14px">จังหวัดอื่นๆ ยอดนิยม</p>
            ${otherLocs.map(l => `<a href="/location/${l.s}" class="z-tag">ไซด์ไลน์${l.n}</a>`).join('')}
        </div>
    </main>
</body>
</html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600", "X-Robots-Tag": "index, follow" } });
    } catch (e) { return context.next(); }
}
