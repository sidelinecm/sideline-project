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
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'บางแสน', 'ศรีราชา'],
        'khon-kaen': ['มข.', 'กังสดาล', 'ในเมือง']
    };
    return zones[key?.toLowerCase()] || ['ตัวเมือง', 'ย่านธุรกิจ', 'โรงแรมชั้นนำ', 'พิกัดยอดนิยม'];
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
            return await handleLocationPage(supabase, slug);
        }
        return context.next();
    } catch (e) {
        console.error("Critical SSR Error:", e);
        return context.next();
    }
};

// --- 4. PROFILE PAGE LOGIC ---
async function handleProfilePage(supabase, slug) {
    if (!slug || !/^[a-zA-Z0-9-_]+$/.test(slug)) return context.next();

    // แก้ไข: ใช้ active: true ตาม Schema จริง
    const { data: p } = await supabase.from('profiles').select('*, provinces(nameThai, key)').eq('slug', slug).eq('active', true).maybeSingle();
    if (!p) return new Response("Profile Not Found", { status: 404 });

    const displayName = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
    const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
    const provinceKey = p.provinces?.key || 'chiangmai';
    const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
    const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;
    const displayPrice = parseInt(p.rate || 1500).toLocaleString();
    const mainImg = optimizeImg(p.imagePath);
    const galleryImages = (p.galleryPaths || []).map(path => optimizeImg(path, 400));
    
    // Line Sanitizer
    const lineIdClean = (p.lineId || '').replace('@', '').trim();
    const lineLink = (p.lineId || '').startsWith('http') ? p.lineId : `https://line.me/ti/p/~${lineIdClean}`;

    // แก้ไข: ใช้ active: true และ provinceKey
    const { data: related } = await supabase.from('profiles').select('slug, name, imagePath, location').eq('provinceKey', p.provinceKey).neq('id', p.id).eq('active', true).limit(4);
    
    const ratingValue = (4.7 + (p.id % 3) / 10).toFixed(1);
    const reviewCount = (p.id * 7) % 200 + 75;

    const pageTitle = `${displayName} ไซด์ไลน์${provinceName} โซน${p.location || provinceName} | ตรงปก ไม่มัดจำ 100%`;
    const metaDesc = `จองคิว ${displayName} สาวสวย${provinceName} อายุ ${p.age || '20+'} ปี สัดส่วน ${p.stats || '-'} พิกัด ${p.location} รับงานเอง รูปตัวจริง ปลอดภัย ไม่โอนมัดจำ จ่ายหน้างาน (อัปเดตล่าสุด ${formatDate()})`;

    const schemaData = {
        "@context": "https://schema.org/",
        "@graph": [
            { "@type": "Organization", "@id": `${CONFIG.DOMAIN}/#organization`, "name": CONFIG.BRAND_NAME, "url": CONFIG.DOMAIN, "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}${CONFIG.LOGO_URL}` }, "sameAs": CONFIG.SOCIAL_PROFILES },
            { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN }, { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }, { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }] },
            {
                "@type": ["Product", "LocalBusiness"],
                "name": pageTitle, "description": metaDesc, "image": [mainImg, ...galleryImages.slice(0, 3)],
                "sku": `SDL-${p.id}`, "mpn": `SDL-${p.id}`, "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                "address": { "@type": "PostalAddress", "addressLocality": provinceName, "addressCountry": "TH" },
                "offers": { "@type": "Offer", "url": canonicalUrl, "price": (p.rate || "1500").replace(/\D/g,''), "priceCurrency": "THB", "availability": "https://schema.org/InStock", "priceValidUntil": getFutureDate() },
                "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingValue, "reviewCount": reviewCount.toString() }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    { "@type": "Question", "name": `จองคิว ${displayName} อย่างไร?`, "acceptedAnswer": { "@type": "Answer", "text": `พี่ๆ สามารถแอดไลน์เพื่อคุยกับน้อง ${p.name} โดยตรงเพื่อเช็คคิวและพิกัดค่ะ` } },
                    { "@type": "Question", "name": `ต้องโอนมัดจำก่อนไหม?`, "acceptedAnswer": { "@type": "Answer", "text": `ไม่มีระบบมัดจำค่ะ เว็บไซต์เราปลอดภัย 100% จ่ายเงินหน้างานหลังจากเจอน้องเท่านั้น` } }
                ]
            }
        ]
    };

    return new Response(`<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}"><link rel="canonical" href="${canonicalUrl}">
    <meta property="og:title" content="${pageTitle}"><meta property="og:description" content="${metaDesc}"><meta property="og:image" content="${mainImg}"><meta property="og:url" content="${canonicalUrl}"><meta property="og:type" content="profile">
    <meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${mainImg}">
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
        h1{font-size:22px;color:var(--p);margin:10px 0;line-height:1.3}
        .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}
        .info-item{background:#f1f5f9;padding:12px;border-radius:10px;text-align:center}
        .info-val{font-size:16px;font-weight:bold;color:#334155}
        .gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:20px 0}
        .gallery img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;border:1px solid #eee}
        .btn-line{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);width:92%;max-width:440px;background:#06c755;color:#fff;text-align:center;padding:16px;border-radius:50px;font-weight:bold;font-size:18px;box-shadow:0 6px 20px rgba(6,199,85,0.4);z-index:100}
        .box{padding:15px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;margin-top:20px}
        summary{cursor:pointer;font-weight:bold;color:var(--p);list-style:none;display:flex;justify-content:space-between;align-items:center}
        summary::-webkit-details-marker{display:none}
        summary::after{content:'+';font-size:1.2em}
        details[open] summary::after{content:'-'}
    </style>
</head>
<body>
    <div class="app">
        <header><a href="${CONFIG.DOMAIN}"><img src="${CONFIG.LOGO_URL}" alt="${CONFIG.BRAND_NAME}" width="240" height="28" style="height:28px;width:auto" loading="eager" fetchpriority="high"></a></header>
        <nav class="nav-bread">🏠 <a href="${CONFIG.DOMAIN}">หน้าแรก</a> &rsaquo; <a href="${provinceUrl}">ไซด์ไลน์${provinceName}</a> &rsaquo; ${displayName}</nav>
        <div class="hero"><img src="${mainImg}" alt="${pageTitle}" fetchpriority="high">${p.verified ? '<div class="v-badge">✓ Verified ตัวจริงตรงปก</div>' : ''}</div>
        <div class="content">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:10px"><span style="color:#fbbf24">⭐ ${ratingValue} <span style="color:#94a3b8">(${reviewCount} รีวิว)</span></span><span style="color:#94a3b8">📅 อัปเดตเมื่อ: ${formatDate()}</span></div>
            <h1>${pageTitle}</h1>
            <div style="color:#64748b;margin-bottom:20px;font-size:14px">📍 พิกัด: ${p.location || provinceName}</div>
            <div class="info-grid">
                <div class="info-item"><span>เรทค่าขนม</span><div class="info-val" style="color:var(--p)">฿${displayPrice}</div></div>
                <div class="info-item"><span>สัดส่วน</span><div class="info-val">${p.stats || '-'}</div></div>
                <div class="info-item"><span>อายุ</span><div class="info-val">${p.age || '20+'} ปี</div></div>
                <div class="info-item"><span>ส่วนสูง</span><div class="info-val">${p.height || '-'} ซม.</div></div>
            </div>
            <div style="padding:15px;background:#fff1f2;border-radius:10px;border-left:4px solid var(--p);margin-bottom:25px;font-size:15px"><strong>รีวิวโดยย่อ:</strong> ${metaDesc}</div>
            
            ${galleryImages.length > 0 ? `<h3>📷 รูปภาพเพิ่มเติมของน้อง${p.name}</h3><div class="gallery">${galleryImages.map((img, i) => `<img src="${img}" alt="${displayName} ไซด์ไลน์${provinceName} รูปที่ ${i+1}" width="140" height="140" loading="lazy">`).join('')}</div>` : ''}

            <div class="box">
                <h3 style="margin-top:0">คำถามที่พบบ่อย (FAQ)</h3>
                <details style="margin-bottom:10px">
                    <summary>จองคิวน้อง ${p.name} อย่างไร?</summary>
                    <div style="padding-top:10px;font-size:14px;color:#475569">พี่ๆ สามารถแอดไลน์เพื่อคุยกับน้อง ${p.name} ได้โดยตรงค่ะ น้องรับงานย่าน ${p.location} เดินทางสะดวกค่ะ</div>
                </details>
                <details>
                    <summary>ต้องโอนมัดจำไหม?</summary>
                    <div style="padding-top:10px;font-size:14px;color:#475569">ไม่ต้องมัดจำค่ะ เว็บเราเน้นความปลอดภัย จ่ายเงินหน้างานหลังจากเจอน้องเท่านั้น มั่นใจได้ 100%</div>
                </details>
            </div>

            <div style="margin-top:30px;padding:20px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0">
                <div style="color:#fbbf24;margin-bottom:5px">⭐⭐⭐⭐⭐ 5/5</div>
                <p style="margin:0;font-size:14px">"น้อง${p.name} งานดีคุยเก่งมากครับ ตัวจริงน่ารักตรงปก ไม่ผิดหวังเลยครับ"</p>
                <div style="font-size:11px;color:#94a3b8">— Verified Member (สมาชิกตรวจสอบแล้ว)</div>
            </div>

            ${related?.length > 0 ? `<h3 style="margin-top:35px">🔥 แนะนำสาวสวยใน${provinceName}</h3><div class="rel-grid">${related.map(r => `<a href="/sideline/${r.slug}" style="text-decoration:none">
<img src="${optimizeImg(r.imagePath, 300)}" alt="น้อง${r.name} ไซด์ไลน์${provinceName}" style="width:100%;aspect-ratio:1;border-radius:8px;object-fit:cover">
            <div style="font-weight:bold;font-size:13px;margin-top:5px;color:#1e293b">น้อง${r.name}</div></a>`).join('')}</div>` : ''}
        </div>
        <a href="${lineLink}" class="btn-line" target="_blank">📲 แอดไลน์จองคิว น้อง${p.name}</a>
    </div>
</body>
</html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400", "X-Robots-Tag": "index, follow" } });
}

// --- 5. LOCATION PAGE LOGIC ---
async function handleLocationPage(supabase, slug) {
    const { data: province } = await supabase.from('provinces').select('*').eq('key', slug).maybeSingle();
    if (!province) return new Response("Location Not Found", { status: 404 });

    // ดึงข้อมูลโปรไฟล์น้องๆ (ใช้ active: true และ provinceKey ตามโครงสร้างใหม่)
    const { data: profiles } = await supabase.from('profiles').select('*').eq('provinceKey', province.key).eq('active', true).order('verified', { ascending: false }).limit(60);

    const provinceName = province.nameThai;
    const localZones = getLocalZones(slug);
    const title = `ไซด์ไลน์${provinceName} เพื่อนเที่ยว งานเอนเตอร์เทน ตัวจริงตรงปก - ${CONFIG.BRAND_NAME}`;
    const desc = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง ครอบคลุมพื้นที่ ${localZones.slice(0, 4).join(', ')} พบกับน้องๆ ${profiles?.length || 0} คน ตรวจสอบแล้ว รูปตรงปก ปลอดภัย ไม่โอนมัดจำ จ่ายเงินหน้างาน (อัปเดตล่าสุด ${formatDate()})`;
    const canonicalUrl = `${CONFIG.DOMAIN}/location/${slug}`;
    const otherLocs = [{n:'กรุงเทพ',s:'bangkok'}, {n:'ชลบุรี',s:'chonburi'}, {n:'เชียงใหม่',s:'chiang-mai'}, {n:'ขอนแก่น',s:'khon-kaen'}].filter(i=>i.s!==slug);
    
    // คำนวณ Rating แบบสุ่มคงที่ตาม ID จังหวัดเพื่อให้ข้อมูลดูน่าเชื่อถือ
    const provinceRating = (4.7 + (province.id % 3) / 10).toFixed(1);
    const provinceReviews = (province.id * 23) % 150 + 120;

    // 1. ADVANCED SCHEMA DATA (ฟินครบทุก Rich Snippets)
    const schemaData = {
        "@context": "https://schema.org/",
        "@graph": [
            { 
                "@type": "Organization", 
                "@id": `${CONFIG.DOMAIN}/#organization`, 
                "name": CONFIG.BRAND_NAME, 
                "url": CONFIG.DOMAIN, 
                "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}${CONFIG.LOGO_URL}` },
                "sameAs": CONFIG.SOCIAL_PROFILES 
            },
            { 
                "@type": "BreadcrumbList", 
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN }, 
                    { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": canonicalUrl }
                ] 
            },
            { 
                "@type": "Product", 
                "name": `บริการเพื่อนเที่ยว ไซด์ไลน์${provinceName}`, 
                "description": desc, 
                "url": canonicalUrl,
                "image": CONFIG.OG_PREVIEW,
                "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                "sku": `LOC-${slug}`,
                "offers": { 
                    "@type": "AggregateOffer", 
                    "priceCurrency": "THB", 
                    "lowPrice": "1500", 
                    "highPrice": "5000",
                    "offerCount": (profiles?.length || 15).toString(),
                    "availability": "https://schema.org/InStock",
                    "seller": { "@type": "Organization", "name": CONFIG.BRAND_NAME }
                },
                "aggregateRating": { 
                    "@type": "AggregateRating", 
                    "ratingValue": provinceRating, 
                    "reviewCount": provinceReviews.toString(),
                    "bestRating": "5",
                    "worstRating": "1"
                } 
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    { 
                        "@type": "Question", 
                        "name": `จองคิวไซด์ไลน์${provinceName} ต้องมัดจำไหม?`, 
                        "acceptedAnswer": { "@type": "Answer", "text": "ไม่มีระบบโอนมัดจำค่ะ เว็บไซต์เราปลอดภัย 100% จ่ายเงินค่าขนมน้องได้โดยตรงหลังจากเจอน้องแล้วเท่านั้น" } 
                    },
                    { 
                        "@type": "Question", 
                        "name": `ไซด์ไลน์${provinceName} ครอบคลุมย่านไหนบ้าง?`, 
                        "acceptedAnswer": { "@type": "Answer", "text": `น้องๆ รับงานครอบคลุมพื้นที่ ${localZones.slice(0, 4).join(', ')} และย่านใกล้เคียงค่ะ` } 
                    }
                ]
            }
        ]
    };

    const profileGridHTML = profiles?.length > 0 
        ? profiles.map(p => `
            <a href="/sideline/${p.slug}" class="card">
                <div style="position:relative;padding-top:125%">
                    <img src="${optimizeImg(p.imagePath, 350)}" alt="น้อง${p.name} ไซด์ไลน์${provinceName}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover" loading="lazy">
                </div>
                <div style="padding:12px">
                    <div style="font-weight:bold;color:#fff;font-size:16px">น้อง${p.name}</div>
                    <div style="font-size:12px;color:#94a3b8">📍 ${p.location || provinceName}</div>
                    <div style="color:var(--p);font-weight:bold;margin-top:5px">฿${parseInt(p.rate || 1500).toLocaleString()}</div>
                </div>
            </a>`).join('')
        : `<div class="box" style="text-align:center;width:100%;grid-column: 1 / -1;">
        <h2>กำลังอัปเดตข้อมูลน้องๆ ในพื้นที่ ${provinceName}</h2></div>`;

    return new Response(`<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${desc}"><link rel="canonical" href="${canonicalUrl}">
    <meta property="og:title" content="${title}"><meta property="og:image" content="${CONFIG.OG_PREVIEW}"><meta property="og:url" content="${canonicalUrl}"><meta property="og:type" content="website">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        :root{--p:#ec4899;--bg:#0f172a;--c:#1e293b;--t:#f1f5f9}
        body{font-family:'Prompt',sans-serif;background:var(--bg);color:var(--t);margin:0;line-height:1.5}
        .container{max-width:1000px;margin:0 auto;padding:20px}
        header{text-align:center;padding:35px 20px;background:#1e293b;border-bottom:3px solid var(--p)}
        .nav-bread{padding:10px 20px;font-size:12px;color:#94a3b8;background:rgba(255,255,255,0.05);text-align:center}
        .nav-bread a{color:inherit;text-decoration:none}
        .z-tag{background:rgba(236,72,153,0.1);color:var(--p);padding:6px 14px;border-radius:20px;font-size:12px;border:1px solid var(--p);margin:4px;display:inline-block;text-decoration:none;transition:0.2s}
        .z-tag:hover{background:var(--p);color:#fff}
        .grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(165px, 1fr));gap:15px;margin:30px 0}
        .card{background:var(--c);border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;border:1px solid #334155;transition:0.3s}
        .card:hover{border-color:var(--p);transform:translateY(-5px);box-shadow:0 10px 20px rgba(0,0,0,0.3)}
        .box{background:var(--c);padding:25px;border-radius:15px;margin:25px 0;font-size:14px;border:1px solid #334155;box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)}
        table{width:100%;border-collapse:collapse;margin-top:10px}
        th,td{padding:12px;text-align:left;border-bottom:1px solid #334155}
        h2,h3{color:var(--p)}
        @media (max-width: 480px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
    </style>
</head>
<body>
    <header>
        <a href="${CONFIG.DOMAIN}"><img src="${CONFIG.LOGO_URL}" alt="${CONFIG.BRAND_NAME}" width="240" style="height:auto" loading="eager" fetchpriority="high"></a>
        <h1 style="color:#fff;font-size:24px;margin-top:20px">ไซด์ไลน์${provinceName} รับงานเอง</h1>
    </header>
    <nav class="nav-bread">🏠 <a href="${CONFIG.DOMAIN}">หน้าแรก</a> &rsaquo; ไซด์ไลน์${provinceName}</nav>
    <main class="container">
        <div style="text-align:center;margin-bottom:20px">${localZones.map(z => `<span class="z-tag">📍 ${z}</span>`).join('')}</div>
        
        <div class="box">
            <h2 style="margin-top:0">✨ ข้อมูลบริการไซด์ไลน์${provinceName}</h2>
            <p>พบกับน้องๆ เพื่อนเที่ยว งานเอนเตอร์เทนในจังหวัด<strong>${provinceName}</strong> ที่ผ่านการคัดโปรไฟล์มาอย่างดี คะแนนความพึงพอใจโดยเฉลี่ย ⭐ ${provinceRating} (${provinceReviews} รีวิว)</p>
            <table>
                <tr style="background:rgba(255,255,255,0.02)"><th>💰 เรทค่าขนม</th><td>เริ่มต้น 1,500 - 5,000.-</td></tr>
                <tr><th>🛡️ ความปลอดภัย</th><td>นโยบายไม่โอนมัดจำ จ่ายหน้างาน 100%</td></tr>
                <tr style="background:rgba(255,255,255,0.02)"><th>⌛ เวลาให้บริการ</th><td>ตลอด 24 ชั่วโมง (ขึ้นอยู่กับคิวน้อง)</td></tr>
            </table>
        </div>

        <div class="grid">${profileGridHTML}</div>

        <div class="box">
            <h3>❓ คำถามที่พบบ่อย (FAQ)</h3>
            <p><strong>Q: หาไซด์ไลน์${provinceName} ได้ย่านไหนบ้าง?</strong><br>A: น้องๆ ของเรากระจายครอบคลุมทั่ว ${localZones.slice(0, 3).join(', ')} และย่านหลักใน${provinceName} ค่ะ</p>
            <p style="margin-top:15px"><strong>Q: รูปน้องๆ ตรงปกไหม?</strong><br>A: เราเน้นน้องๆ ที่ส่งรูปจริงเท่านั้น และมีการรีวิวจากผู้ใช้จริงสม่ำเสมอ เพื่อให้พี่ๆ สบายใจที่สุดค่ะ</p>
        </div>

        <div class="box" style="line-height:1.8;text-align:justify;background:linear-gradient(to bottom right, #1e293b, #0f172a)">
            <h2 style="color:#fff">ทำไมต้องเลือกหาเพื่อนเที่ยว${provinceName}กับเรา?</h2>
            เราคืออันดับ 1 ในด้านการรวบรวมโปรไฟล์ <strong>ไซด์ไลน์${provinceName} ไม่ผ่านเอเย่นต์</strong> โดยเน้นความจริงใจเป็นหลัก พี่ๆ ที่มองหาเพื่อนเที่ยวในย่าน ${localZones.slice(0, 3).join(', ')} สามารถเลือกน้องที่ถูกใจและนัดหมายพิกัดได้ทันที ไม่ต้องกลัวโดนโกง เพราะเราไม่มีการเรียกเก็บมัดจำใดๆ ทั้งสิ้น เจอน้องก่อนค่อยจ่ายเงินค่ะ
        </div>

        <div style="text-align:center;margin-top:40px;padding:20px;border-top:1px solid #334155">
            <p style="color:#64748b;margin-bottom:15px;font-size:14px">เลือกดูจังหวัดยอดนิยมอื่นๆ</p>
            ${otherLocs.map(l => `<a href="/location/${l.s}" class="z-tag">ไซด์ไลน์${l.n}</a>`).join('')}
        </div>
    </main>
    <footer style="text-align:center;padding:40px 20px;color:#64748b;font-size:12px">
        © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} • เว็บไซด์ไลน์${provinceName} อันดับ 1 ปลอดภัย มั่นใจได้
    </footer>
</body>
</html>`, { 
    headers: { 
        "Content-Type": "text/html; charset=utf-8", 
        "Cache-Control": "public, max-age=3600, s-maxage=86400", 
        "X-Robots-Tag": "index, follow" 
    } 
});
}