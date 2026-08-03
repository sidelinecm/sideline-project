/**
 * [ SYSTEM BOT RENDERING CORE - PROD-READY OPTIMIZED 2026 ]
 * Project: First Model Hub - Serverless Crawler Handler
 * Authority: Extended Crawler Identification, Dynamic Link Building & Schema Architecture
 * Features: Unified UI/UX (Matched with SSR/Index), Clean Text Filter, High-Speed Image Preload
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    get SUPABASE_URL() {
        try { return Deno.env.get("SUPABASE_URL") || 'https://zxetzqwjaiumqhrpumln.supabase.co'; } catch { return 'https://zxetzqwjaiumqhrpumln.supabase.co'; }
    },
    get SUPABASE_KEY() {
        try { return Deno.env.get("SUPABASE_KEY") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; } catch { return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; }
    },
    DOMAIN: 'https://firstmodelhub.com',
    BRAND_NAME: 'First Model Hub',
    DEFAULT_TELEPHONE: 'LINE: @firstmodelhub',
    SOCIAL_PROFILES: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@firstmodelhub',
        twitter: 'https://twitter.com/firstmodelhub',
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280',
        biosite: 'https://bio.site/firstmodelhub',
        linktree: 'https://linktr.ee/firstmodelhub',
        bluesky: 'https://bsky.app/profile/firstmodelhub.bsky.social'
    }
};

const REVIEW_POOL = [
    { name: "พี่บอล", rating: 5, text: "ตรงปกมากครับ น้องบริการดีเยี่ยม ฟิวแฟนแท้ๆ เลย" },
    { name: "คุณเอก", rating: 5, text: "น้องเอาใจเก่งมาก สวยสมราคา จองง่ายปลอดภัยครับ" },
    { name: "พี่โจ", rating: 5, text: "จองผ่านไลน์ง่ายมาก ไม่ต้องโอนมัดจำ ไปหาหน้างานสบายใจสุดๆ" },
    { name: "คุณกอล์ฟ", rating: 5, text: "คุยง่ายเป็นกันเองมากครับ น้องน่ารักสไตล์ผู้ดี แนะนำเลยคนนี้ไม่ผิดหวัง" },
    { name: "พี่ยอด", rating: 5, text: "ตรงเวลาดีครับ สุภาพเรียบร้อย นิสัยดีตรงตามรูปภาพในโปรไฟล์เลย" },
    { name: "คุณเป้", rating: 5, text: "งานดีคุ้มราคามากครับ คุยเก่งเอาใจเก่ง ฟีลแฟนสุดใจเลยครับคนนี้" },
    { name: "พี่แม็กซ์", rating: 5, text: "น้องคุยสนุก ตลก น่ารักเป็นกันเอง ดูแลดีตั้งแต่เริ่มจนจบเลยครับ" },
    { name: "คุณต้น", rating: 5, text: "บริการประทับใจมาก สุภาพเรียบร้อย ไม่มีเร่งงานเลย แนะนำเลยครับ" },
    { name: "พี่แบงค์", rating: 5, text: "น้องหุ่นดี ผิวพรรณดีมาก ตรงปกไม่จกตา คุยไลน์นัดแนะก็ง่าย" },
    { name: "คุณเจ", rating: 5, text: "ฟีลดีอบอุ่นมากครับ สุภาพเรียบร้อย ดูแลดีตลอดเวลาที่อยู่ด้วยกัน" }
];

const getDeterministicReviews = (slug, count = 3) => {
    const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selected = [];
    for (let i = 0; i < count; i++) {
        const index = (charCodeSum + i * 3) % REVIEW_POOL.length;
        selected.push(REVIEW_POOL[index]);
    }
    return selected;
};

const getDeterministicValue = (min, max, seedString, offset = 0) => {
    const sum = seedString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + offset;
    return Math.floor(min + (sum % (max - min + 1)));
};

const optimizeImg = (path, width = 600, height = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/apple-touch-icon.png`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`);
    }
    return path.startsWith('http') 
        ? path 
        : `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover`;
};

const generateSrcSet = (path) => {
    if (!path) return '';
    const widths = [400, 600, 800];
    return widths.map(w => {
        const h = Math.round(w * (800 / 600)); 
        return `${optimizeImg(path, w, h)} ${w}w`;
    }).join(', ');
};

const escapeHTML = (str) => str ? str.replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])) : '';

const stripHTML = (str) => str ? str.replace(/<[^>]*>?/gm, '').trim() : '';

const cleanAsciiArt = (text) => {
    if (!text) return "";
    return text
        .replace(/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬]+/g, "")
        .replace(/[„•ㅅ•„]+/g, "")
        .replace(/\n\s*\n/g, "\n")
        .trim();
};

const getLocalizedZone = (location, provinceName) => {
    if (!location) return `โซนต่าง ๆ ในจังหวัด${provinceName}`;
    const cleanLoc = location.trim();
    if (cleanLoc.includes(provinceName)) {
        return `ย่าน${cleanLoc}`;
    }
    return `ย่าน${cleanLoc} ในจังหวัด${provinceName}`;
};

const getNaturalDescription = (p, displayName, provinceName, ageVal, bwhVal, localizedZone) => {
    if (p.description && p.description.trim().length > 10) {
        return cleanAsciiArt(p.description.trim());
    }
    return `ยินดีต้อนรับสู่โปรไฟล์แนะนำของ ${displayName} ผู้ให้บริการเพื่อนเที่ยวและนำเที่ยวระดับพรีเมียมในเขตพื้นที่ ${localizedZone} อายุ ${ageVal} ปี สัดส่วน ${bwhVal} รูปร่างสมส่วน ผิวพรรณดี พร้อมมอบการดูแลเอาใจใส่อย่างเป็นธรรมชาติในสไตล์ฟีลแฟนที่อบอุ่นและสุภาพเรียบร้อย การันตีความปลอดภัยสูงสุดด้วยเงื่อนไขตกลงนัดพบเจอตัวจริงหน้างานเรียบร้อยแล้วจึงค่อยชำระค่าบริการ ปราศจากการเรียกเก็บเงินจองมัดจำล่วงหน้าทุกกรณี`;
};

// ฟังก์ชันจำลองการสร้างการ์ด (ให้เหมือนหน้าหลัก/ssr-province.js)
const renderRelatedCardHtml = (p, hostUrl, provinceThaiName) => {
    const rawName = p.name || "สาวสวย";
    const pName = escapeHTML(rawName.trim().replace(/^(น้อง\s?)+/gi, ""));
    const pLoc = escapeHTML(p.location || provinceThaiName);
    const pUrl = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
    
    const imgUrl = optimizeImg(p.imagePath, 400, 500);
    const seoAltText = `โปรไฟล์น้อง${pName} สาวรับงานเอนเตอร์เทน จ.${provinceThaiName}`;

    return `
      <div class="profile-card-new-container" role="listitem">
        <article class="profile-card-new interactive-card"
             style="aspect-ratio: 4 / 5; width: 100%; position: relative; border-radius: 14px; overflow: hidden; background-color: #09090B; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); transition: transform 0.25s ease;">
            
            <img src="${imgUrl}" alt="${seoAltText}" title="${seoAltText}" width="300" height="400"
                 style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; filter: brightness(0.96);" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='${hostUrl}/images/firstmodelhub.webp';" />
                 
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 20%, transparent 38%); z-index: 10; pointer-events: none;"></div>
  
            <div style="position: absolute; top: 6px; left: 6px; z-index: 30; pointer-events: none; display: flex; flex-direction: column; gap: 3px; align-items: flex-start;">
                <span style="background: rgba(9, 9, 11, 0.82); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 4px;">
                    <span style="width: 5px; height: 5px; border-radius: 50%; background-color: #00E676; box-shadow: 0 0 6px #00E676; flex-shrink: 0;"></span>
                    <span style="letter-spacing: 0.02em;">รับงาน</span>
                </span>
            </div>
            
            <a href="${pUrl}" style="position: absolute; inset: 0; z-index: 25;" aria-label="ดูโปรไฟล์น้อง${pName}"></a>
  
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 6px 10px 8px 10px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 1px;">
                <h3 style="font-size: 13.5px; font-weight: 800; color: white; margin: 0; line-height: 1.2; text-shadow: 0 2px 4px rgba(0,0,0,0.95);">
                  น้อง${pName}
                </h3>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px; color: #D4D4D8; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 3px; margin-top: 2px;">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">
                        <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 2px;"></i> ${pLoc}
                    </span>
                </div>
            </div>
        </article>
      </div>
    `;
  };

export default async (request, context) => {
    const url = new URL(request.url);
    const dynamicDomain = `${url.protocol}//${url.host}`; 
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless|bingbot|yandex|duckduckgo|applebot|gptbot|chatgpt|cohere|anthropic|perplexity|mediapartners-google/i.test(ua);
    
    // หากต้องการให้ User ปกติเห็นหน้า SSR Render นี้ด้วย ให้ปิดเงื่อนไขนี้ได้ครับ
    if (!isBot && !url.searchParams.has('force_render')) return context.next();

    try {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate, age, description, provinceKey, lineId, has_video, verified, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) {
            return context.next();
        }

        let related = [];
        if (p.provinceKey) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location, id')
                .eq('provinceKey', p.provinceKey)
                .eq('active', true)
                .neq('id', p.id) 
                .limit(6);
            related = relatedData || [];
        }

        const rawName = p.name || 'สาวสวย';
        let cleanName = rawName.trim().replace(/^(น้อง\s?)+/gi, '');
        const displayName = `น้อง${cleanName}`;
        
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        
        const correctProvinceUrl = provinceKey === 'chiangmai' 
            ? dynamicDomain 
            : `${dynamicDomain}/location/${provinceKey}`;
        
        const cleanedRate = String(p.rate || "1500").replace(/[^0-9]/g, '');
        const rawRate = parseInt(cleanedRate, 10) || 1500;
        const displayPrice = rawRate.toLocaleString() + ".-";
        
        const baseImageUrl = optimizeImg(p.imagePath, 600, 800);
        const lcpImageUrl = optimizeImg(p.imagePath, 400, 533);
        const imageSrcSet = generateSrcSet(p.imagePath);
        
        let finalLineUrl = p.lineId || 'ksLUWB89Y_';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;
        }

        const ageVal = p.age || getDeterministicValue(20, 26, slug, 1);
        const heightVal = getDeterministicValue(158, 168, slug, 2);
        const weightVal = getDeterministicValue(44, 52, slug, 3);
        const breastVal = getDeterministicValue(32, 36, slug, 4);
        const waistVal = getDeterministicValue(23, 26, slug, 5);
        const hipVal = getDeterministicValue(33, 37, slug, 6);
        const bwhVal = `${breastVal}-${waistVal}-${hipVal}`;

        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);
        
        const localizedZone = getLocalizedZone(p.location, provinceName);
        const naturalDescriptionText = getNaturalDescription(p, displayName, provinceName, ageVal, bwhVal, localizedZone);
        
        const pageTitle = `${displayName} ไซด์ไลน์${provinceName} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก`;
        const metaDesc = `โปรไฟล์แนะนำของ ${displayName} สาวสวยไซด์ไลน์พิกัดบริการบริเวณ ${p.location || provinceName} อายุ ${ageVal} ปี สัดส่วน ${bwhVal} ดูแลเอาใจใส่เป็นกันเองสไตล์ฟิวแฟนอย่างสุภาพ ตรวจสอบประวัติจริงตรงปก ปลอดภัยสูงสุด ไร้เงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี`;
        
        const canonicalUrl = `${dynamicDomain}/sideline/${encodeURIComponent(slug)}`;

        // SEO Schema Generator
        const dynamicReviews = getDeterministicReviews(slug, 3);
        const schemaReviews = dynamicReviews.map(t => ({
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": t.rating.toString(),
                "bestRating": "5",
                "worstRating": "1"
            },
            "author": {
                "@type": "Person",
                "name": stripHTML(t.name)
            },
            "reviewBody": stripHTML(t.text)
        }));

        const breadcrumbElements = [
            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": dynamicDomain }
        ];

        if (provinceKey === 'chiangmai') {
            breadcrumbElements.push({ "@type": "ListItem", "position": 2, "name": "โปรไฟล์ทั้งหมด", "item": `${dynamicDomain}/profiles` });
        } else {
            breadcrumbElements.push({ "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": correctProvinceUrl });
        }

        breadcrumbElements.push({ "@type": "ListItem", "position": breadcrumbElements.length + 1, "name": displayName, "item": canonicalUrl });

        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": ["LocalBusiness", "EntertainmentBusiness"],
                    "@id": `${canonicalUrl}#serviceprovider`,
                    "name": `${displayName} - ไซด์ไลน์${provinceName}`,
                    "image": [baseImageUrl],
                    "description": stripHTML(metaDesc),
                    "telephone": CONFIG.DEFAULT_TELEPHONE,
                    "url": canonicalUrl,
                    "priceRange": "฿฿",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": Number(ratingValue) || 4.8,
                        "reviewCount": Number(reviewCount) || 150,
                        "bestRating": 5,
                        "worstRating": 1
                    },
                    "review": schemaReviews
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": breadcrumbElements
                },
                {
                    "@type": "FAQPage",
                    "@id": `${canonicalUrl}#faq`,
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `${displayName} ไซด์ไลน์${provinceName} มีความปลอดภัยและการชำระเงินอย่างไร?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `ทางระบบมีนโยบายให้ลูกค้าพบน้อง ${displayName} ยืนยันความตรงปกหน้างานแล้วจึงชำระค่าบริการแก่ตัวน้องโดยตรง ปราศจากการเรียกเก็บเงินจองคิวมัดจำล่วงหน้าทุกรูปแบบ เพื่อความคุ้มครองและความสบายใจสูงสุดของลูกค้า`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `ต้องการตรวจสอบตารางเวลาหรือขอจองคิว ${displayName} พิกัด ${p.location || provinceName} ได้ที่ช่องทางใด?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `สามารถดำเนินการคลิกแอดไลน์ปุ่ม 'ทักไลน์จองคิว' บนหน้าเว็บ เพื่อดำเนินการขอตรวจสอบคิวงาน สแตนด์บายตารางงาน และจองคิวรับบริการเพื่อความสะดวกและรวดเร็วที่สุดผ่านไลน์แอดมินเจ้าหน้าที่อย่างเป็นทางการ`
                            }
                        }
                    ]
                }
            ]
        };

        // 🟢 HTML รูปแบบใหม่ แสดงผลครบถ้วน 100% รวมถึง FAQ และ Pricing
        const html = `<!DOCTYPE html>
<html lang="th" class="dark-theme dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#5A2CBE">
    
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${lcpImageUrl}" ${imageSrcSet ? `imagesrcset="${imageSrcSet}" imagesizes="(max-width: 600px) 100vw, 400px"` : ''} fetchpriority="high">
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${baseImageUrl}">
    <meta property="og:image" content="${baseImageUrl}">
    <meta property="og:image:type" content="image/webp">
    <meta property="og:image:width" content="600">   
    <meta property="og:image:height" content="800">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">

    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">
    
    <!-- นำเข้าฟอนต์และสไตล์หลักของเว็บไซต์ -->
    <link rel="preload" href="/fonts/prompt-v11-latin_thai-700.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"></noscript>

    <script type="application/ld+json" id="dynamic-schema">${JSON.stringify(schemaData)}</script>
</head>
<body>

<!-- FLOATING APP DOCK -->
<nav class="floating-app-dock" aria-label="แถบควบคุมลอยตัวสำหรับมือถือ">
  <a href="/" class="dock-item">
    <i class="fas fa-home" aria-hidden="true"></i>
    <span>หน้าแรก</span>
  </a>
  <a href="${correctProvinceUrl}" class="dock-item active" style="color: var(--primary-purple); font-weight: 800;">
    <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
    <span>น้องๆ ${provinceName}</span>
  </a>
  <a href="/profiles" class="dock-item">
    <i class="fas fa-user-friends" aria-hidden="true"></i>
    <span>รวมน้องๆ</span>
  </a>
  <a href="${finalLineUrl}" target="_blank" rel="noopener nofollow" class="dock-item dock-item-line">
    <i class="fab fa-line" aria-hidden="true"></i>
    <span>จองคิว</span>
  </a>
</nav>

<!-- HEADER -->
<header id="page-header" role="banner">
    <div class="header-logo-container">
        <a href="/" aria-label="ไปที่หน้าแรก FirstModelHub">
           <span class="brand-logo-text">
             FirstModel<span class="hub-text">Hub</span><span class="star">🌟</span>
           </span>
        </a>
    </div>

    <div class="nav-controls">
        <nav class="desktop-nav" aria-label="เมนูหลัก">
            <a href="/profiles">รวมโปรไฟล์แนะนำ</a>
            <a href="/locations">พื้นที่ให้บริการ</a>
        </nav>
        <button class="theme-toggle-btn circle-btn-el" type="button" aria-label="เปลี่ยนโหมดแสงสว่าง">
            <i class="fas fa-moon theme-toggle-icon" aria-hidden="true"></i>
        </button>
        <button id="menu-toggle" class="circle-btn-el" type="button" aria-label="เปิดเมนู">
            <i class="fas fa-bars" aria-hidden="true"></i>
        </button>
    </div>
</header>

<!-- SIDEBAR -->
<aside id="sidebar-menu" aria-label="เมนูนำทางเคลื่อนที่">
    <div class="sidebar-header-div">
        <span style="color: #A1A1AA !important;">Navigation</span>
        <button id="close-menu-btn" class="sidebar-close-btn"><i class="fas fa-times" aria-hidden="true"></i></button>
    </div>
    <div class="sidebar-links-wrapper">
        <a href="/">หน้าแรก</a>
        <a href="${correctProvinceUrl}">โซน${provinceName}</a>
        <a href="/locations">พิกัดรับงานทั่วไทย</a>
        <a href="/about">เกี่ยวกับเรา & ปลอดภัย</a>
    </div>
</aside>
<div id="sidebar-overlay"></div>

<!-- MAIN CONTENT -->
<main id="main-content" style="padding-top: 80px; padding-bottom: 90px;">
    <div class="container" style="max-width: 850px;">
        
        <!-- BREADCRUMB -->
        <nav aria-label="breadcrumb" style="font-size: 11px; color: var(--text-muted); margin-bottom: 16px; padding: 0 10px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
            <a href="/" style="color: var(--primary-purple); text-decoration: none;"><i class="fas fa-home"></i> หน้าแรก</a> 
            <i class="fas fa-chevron-right" style="font-size: 8px;"></i>
            <a href="${correctProvinceUrl}" style="color: var(--primary-purple); text-decoration: none;">สาวรับงาน${provinceName}</a> 
            <i class="fas fa-chevron-right" style="font-size: 8px;"></i>
            <span style="color: #FFF; font-weight: 700;">${displayName}</span>
        </nav>

        <!-- PROFILE HERO & DETAILS (Glassmorphism Layout) -->
        <div class="interactive-card" style="padding: 16px; border-radius: 20px; border: 1px solid rgba(192, 132, 252, 0.3); background: linear-gradient(135deg, rgba(13, 8, 30, 0.85), rgba(9, 9, 12, 0.95)); display: grid; grid-template-columns: 1fr; gap: 20px;">
            
            <div style="width: 100%; max-width: 400px; margin: 0 auto; position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.6);">
                <img src="${lcpImageUrl}" ${imageSrcSet ? `srcset="${imageSrcSet}" sizes="(max-width: 600px) 100vw, 400px"` : ''} alt="${displayName} สาวรับงาน${provinceName}" style="width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block;" loading="eager" fetchpriority="high">
                <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 6px;">
                    <span style="background: rgba(9, 9, 11, 0.85); border: 1px solid rgba(0, 230, 118, 0.5); color: #00E676; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 100px; backdrop-filter: blur(8px);">🟢 พร้อมรับงาน</span>
                    ${p.verified ? `<span style="background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(52, 211, 153, 0.55); color: #00E676; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 100px; backdrop-filter: blur(8px);"><i class="fas fa-check-circle"></i> ยืนยันตัวตน</span>` : ''}
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 16px; text-align: center;">
                <div>
                    <h1 class="text-gradient-main" style="font-size: clamp(24px, 6vw, 32px); font-weight: 900; margin: 0; line-height: 1.2;">${displayName}</h1>
                    <p style="color: #C084FC; font-size: 13px; font-weight: 700; margin-top: 4px;"><i class="fas fa-map-marker-alt"></i> พิกัด: ${p.location || provinceName}</p>
                </div>

                <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 700; background: rgba(255,255,255,0.03); padding: 8px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="color: #FBBF24; display: flex; gap: 2px;">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                    </div>
                    <span style="color: #FFFFFF;">${ratingValue}</span>
                    <span style="color: #A1A1AA; font-weight: 400;">(${reviewCount} รีวิว)</span>
                </div>

                <!-- นำส่วนสูง สัดส่วน และราคาเริ่มต้น ไว้ใน Grid บนสุด -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 8px;">
                    <div style="background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(192, 132, 252, 0.2); padding: 10px; border-radius: 12px; display: flex; flex-direction: column;">
                        <span style="font-size: 10px; color: #E9D5FF; font-weight: 700;">อายุ</span>
                        <span style="font-size: 16px; font-weight: 900; color: #FFF;">${ageVal}</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 12px; display: flex; flex-direction: column;">
                        <span style="font-size: 10px; color: #A1A1AA; font-weight: 700;">ส่วนสูง</span>
                        <span style="font-size: 16px; font-weight: 900; color: #FFF;">${heightVal}</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 12px; display: flex; flex-direction: column;">
                        <span style="font-size: 10px; color: #A1A1AA; font-weight: 700;">สัดส่วน</span>
                        <span style="font-size: 13px; font-weight: 900; color: #FFF; line-height: 1.5;">${bwhVal}</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 12px; display: flex; flex-direction: column;">
                        <span style="font-size: 10px; color: #A1A1AA; font-weight: 700;">ค่าขนมเริ่ม</span>
                        <span style="font-size: 13px; font-weight: 900; color: #00E676; line-height: 1.5;">${displayPrice}</span>
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 16px; font-size: 12px; color: var(--text-gray); line-height: 1.6; text-align: left; white-space: pre-wrap;">${escapeHTML(naturalDescriptionText)}</div>

                <a href="${finalLineUrl}" class="btn-line" rel="nofollow noopener" target="_blank" style="background: linear-gradient(135deg, #11783B 0%, #00E676 100%); color: #FFF; padding: 14px 24px; border-radius: 100px; font-weight: 800; font-size: 16px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 10px 25px rgba(0, 230, 118, 0.3); transition: transform 0.2s;">
                    <i class="fab fa-line" style="font-size: 20px;"></i> ทักไลน์จองคิว
                </a>
            </div>
        </div>

        <!-- PRICING TABLE (แบบเต็ม) -->
        <section class="glass-panel" style="margin-top: 16px;">
            <h2 class="text-gradient-sub" style="font-size: 15px; font-weight: 800; text-align: center; margin-bottom: 12px;"><i class="fas fa-wallet" style="margin-right: 6px;"></i> เรทค่าบริการ (จ่ายหน้างาน 100%)</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 12px 8px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 10px; color: #A1A1AA; font-weight: 700; margin-bottom: 4px;">1 ชั่วโมง (1 น้ำ)</div>
                    <div style="font-size: 16px; font-weight: 900; color: #00E676;">${rawRate.toLocaleString()}.-</div>
                </div>
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 12px 8px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 10px; color: #A1A1AA; font-weight: 700; margin-bottom: 4px;">2 ชั่วโมง (2 น้ำ)</div>
                    <div style="font-size: 16px; font-weight: 900; color: #00E676;">${Math.floor(rawRate * 1.8).toLocaleString()}.-</div>
                </div>
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 12px 8px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 10px; color: #A1A1AA; font-weight: 700; margin-bottom: 4px;">ค้างคืน (ไม่จำกัด)</div>
                    <div style="font-size: 16px; font-weight: 900; color: #00E676;">${Math.floor(rawRate * 4.5).toLocaleString()}.-</div>
                </div>
            </div>
        </section>

        <!-- 🟢 คำถามพบบ่อย (เพิ่มกลับมาแล้วครับ!) -->
        <section class="glass-panel" style="margin-top: 16px;">
            <h2 class="text-gradient-sub" style="font-size: 15px; font-weight: 800; margin-bottom: 12px; text-align: center;"><i class="fas fa-question-circle" style="margin-right: 6px;"></i> คำถามที่พบบ่อย</h2>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 12px; border-radius: 12px;">
                <h3 style="font-size: 12px; font-weight: 800; color: #FFF; margin-bottom: 6px; display: flex; align-items: flex-start; gap: 6px;">
                    <span style="color: #C084FC;">Q:</span> ${displayName} มีมัดจำไหม?
                </h3>
                <p style="font-size: 11.5px; color: var(--text-gray); margin: 0; line-height: 1.5; padding-left: 20px; border-left: 2px solid rgba(192, 132, 252, 0.3);">
                    ไม่มีนโยบายการรับเงินโอนจองมัดจำล่วงหน้าใดๆ ทุกกรณีค่ะ ลูกค้าสามารถเดินทางมานัดพบหน้างานเพื่อตรวจสอบสิทธิ์ความตรงปกเรียบร้อยแล้ว ค่อยตกลงชำระค่าขนมโดยตรงหน้างานเพื่อความปลอดภัย 100%
                </p>
            </div>
        </section>

        <!-- REVIEWS -->
        <section style="margin-top: 24px;">
            <h2 class="text-gradient-main" style="font-size: 16px; font-weight: 800; text-align: center; margin-bottom: 12px;">รีวิวจากผู้ใช้บริการจริง</h2>
            <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                ${dynamicReviews.map(t => `
                    <div class="interactive-card" style="padding: 16px; background: rgba(13,8,30,0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="height: 28px; width: 28px; border-radius: 50%; background: rgba(192,132,252,0.2); border: 1px solid rgba(192,132,252,0.4); display: flex; align-items: center; justify-content: center; color: #C084FC; font-weight: 800; font-size: 12px;">${escapeHTML(t.name.charAt(0))}</div>
                                <span style="font-size: 12px; font-weight: 800; color: white;">${escapeHTML(t.name)}</span>
                            </div>
                            <div class="stars" style="color: #FBBF24; font-size: 10px;">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                        <p style="font-size: 11.5px; color: var(--text-gray); line-height: 1.5; margin: 0;">${escapeHTML(t.text)}</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- RELATED PROFILES -->
        ${related.length > 0 ? `
        <section style="margin-top: 32px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 0 4px;">
                <h2 style="font-size: 16px; font-weight: 800; color: white; margin: 0;">น้องๆ ในโซน <span style="color: #C084FC;">${provinceName}</span></h2>
                <a href="${correctProvinceUrl}" style="font-size: 11px; color: #C084FC; font-weight: 700; text-decoration: none;">ดูทั้งหมด <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="profiles-grid-row">
                ${related.map(r => renderRelatedCardHtml(r, hostUrl, provinceName)).join('')}
            </div>
        </section>
        ` : ''}

        <!-- SAFE-PLAY -->
        <section class="glass-panel" style="margin-top: 32px;">
            <h2 class="text-gradient-sub" style="font-size: 14px; font-weight: 800; text-align: center; margin-bottom: 12px;"><i class="fas fa-shield-alt"></i> นโยบายความปลอดภัย 100%</h2>
            <div style="font-size: 11px; color: var(--text-gray); line-height: 1.6; display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; gap: 8px;"><i class="fas fa-check-circle" style="color: #00E676; margin-top: 2px;"></i> <span><strong>ไม่มีการเรียกเก็บเงินมัดจำล่วงหน้า:</strong> จ่ายเงินโดยตรงกับน้องเมื่อตรวจสอบความตรงปกหน้างานแล้วเท่านั้น</span></div>
                <div style="display: flex; gap: 8px;"><i class="fas fa-check-circle" style="color: #00E676; margin-top: 2px;"></i> <span><strong>ข้อมูลเป็นความลับสูงสุด:</strong> (Zero-Log Policy) ข้อมูลการจองจะถูกลบทิ้งทันทีหลังเสร็จสิ้นบริการ</span></div>
                <div style="display: flex; gap: 8px;"><i class="fas fa-check-circle" style="color: #00E676; margin-top: 2px;"></i> <span><strong>สงวนสิทธิ์เฉพาะอายุ 20+:</strong> ผู้ใช้บริการต้องบรรลุนิติภาวะแล้วเท่านั้น</span></div>
            </div>
        </section>

    </div>
</main>

<!-- FOOTER -->
<footer style="border-top: 1px solid rgba(147, 51, 234, 0.15); background: rgba(14, 9, 30, 0.6); padding: 24px 16px 100px 16px;">
  <div class="container" style="max-width: 850px;">
    <div style="text-align: center; margin-bottom: 16px;">
      <span class="brand-logo-text" style="font-size: 18px;">
        FirstModel<span class="hub-text">Hub</span><span class="star">🌟</span>
      </span>
      <p style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">แพลตฟอร์มเพื่อนเที่ยวพรีเมียมอันดับ 1 ตรงปก 100% ปลอดภัย ไม่มัดจำ</p>
    </div>
    <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 11px; color: var(--text-muted);">
      <div style="display: flex; gap: 16px;">
          <a href="/" style="color: var(--text-muted); text-decoration: none;">หน้าแรก</a>
          <a href="/profiles" style="color: var(--text-muted); text-decoration: none;">รวมน้องๆ</a>
          <a href="/locations" style="color: var(--text-muted); text-decoration: none;">พิกัดรับงาน</a>
      </div>
      <p style="margin: 0; margin-top: 8px;">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}. All Rights Reserved.</p>
    </div>
  </div>
</footer>

<script type="module" src="/main.js"></script>

</body>
</html>`;

        return new Response(html, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "X-XSS-Protection": "1; mode=block",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        });

    } catch (err) {
        console.error("Bot rendering crash:", err);
        return context.next();
    }
};