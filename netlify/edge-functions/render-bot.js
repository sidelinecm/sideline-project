/**
 * [ SYSTEM BOT RENDERING CORE - PROD-READY OPTIMIZED 2026 ]
 * Project: First Model Hub - Serverless Crawler Handler
 * Authority: Extended Crawler Identification, Dynamic Link Building & Schema Architecture
 * Features: Clean Text Filter (No ASCII Art), High-Speed Image Preload, Schema Rating Fix
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    get SUPABASE_URL() {
        try { return Deno.env.get("SUPABASE_URL") || 'https://zxetzqwjaiumqhrpumln.supabase.co'; } catch { return 'https://zxetzqwjaiumqhrpumln.supabase.co'; }
    },
    get SUPABASE_KEY() {
        try { return Deno.env.get("SUPABASE_KEY") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; } catch { return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; }
    },
    PRIMARY_DOMAIN: 'https://firstmodelhub.com',
    BRAND_NAME: 'First Model Hub',
    DEFAULT_TELEPHONE: "+6620000000",
    SOCIAL_LINKS: {
    line: "https://line.me/ti/p/ksLUWB89Y_",
    tiktok: "https://tiktok.com/@sidelinecm",
    twitter: "https://twitter.com/sidelinechiangmai",
    linkedin: "https://www.linkedin.com/in/cuteti-sexythailand-398567280?trk=contact-info",
    biosite: "https://bio.site/firstfiwfans.com",
    linktree: "https://linktr.ee/kissmodel",
    bluesky: "https://bsky.app/profile/sidelinechiangmai.bsky.social"
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

// 🟢 ฟังก์ชั่น optimizeImg ที่แก้ไขแล้ว
const optimizeImg = (hostUrl, path, width = 400, height = 500) => {
  if (!path || typeof path !== "string") return `${CONFIG.PRIMARY_DOMAIN}/images/firstmodelhub.webp`;

  if (path.includes("res.cloudinary.com")) {
    // ลบ Transformation ปัจจุบันที่ติดมาใน URL ออกก่อน (เช่น /c_scale,w_400.../)
    const cleanCloudinaryUrl = path.replace(/\/upload\/(?:[^\/]+\/)*(v\d+\/)/, '/upload/$1');
    return cleanCloudinaryUrl.replace("/upload/", `/upload/f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face/`);
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=70&format=avif`;
};

const generateSrcSet = (path) => {
    if (!path) return '';
    const widths = [400, 600, 800];
    return widths.map(w => {
        const h = Math.round(w * (800 / 600)); 
        // 🟢 ตรวจสอบว่าตรงนี้แก้ให้มี null อยู่ตัวแรกหรือยัง
        return `${optimizeImg(null, path, w, h)} ${w}w`; 
    }).join(', ');
};

const escapeHTML = (str) => str ? str.replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])) : '';

const stripHTML = (str) => str ? str.replace(/<[^>]*>?/gm, '').trim() : '';

// 🟢 แก้ไข: ลบเฉพาะเส้นกรอบ ASCII ป้องกันตัวหนังสือและ Emoji แตกเป็นตัวต่างดาว 
const cleanAsciiArt = (text) => {
    if (!text) return "";
    return text
        .replace(/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬]+/g, "") // ลบเฉพาะเส้นกรอบ ASCII
        .replace(/[„•ㅅ•„]+/g, "")                 // ลบตัวการ์ตูน ASCII
        .replace(/\n\s*\n/g, "\n")                 // ลบบรรทัดว่างเกินจำเป็น
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

export default async (request, context) => {
    const url = new URL(request.url);
    const dynamicDomain = `${url.protocol}//${url.host}`; 
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless|bingbot|yandex|duckduckgo|applebot|gptbot|chatgpt|cohere|anthropic|perplexity|mediapartners-google/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate, age, description, provinceKey, lineId, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        // 🟢 แก้ไข: หากไม่เจอข้อมูลโปรไฟล์ ให้ปล่อยผ่านไปยัง Client-side JS แทนการตัดเป็น 404
        if (!p) {
            return context.next();
        }

        let related = [];
        if (p.provinceKey) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
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
        
        const baseImageUrl = optimizeImg(null, p.imagePath, 600, 800);
const lcpImageUrl = optimizeImg(null, p.imagePath, 400, 533);
        
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

        // 🟢 เพิ่ม worstRating: "1" ในทุกก้อน Review ของ Schema
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

        // 🟢 ถอด Tailwind CDN ออกจาก <head> และซิงค์ Preload Image ให้ใช้ imagesrcset ป้องกันโหลดซ้ำ
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} | สารบัญตรวจสอบประวัติตรงปก</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${lcpImageUrl}" ${imageSrcSet ? `imagesrcset="${imageSrcSet}" imagesizes="(max-width: 600px) 100vw, 400px"` : ''} fetchpriority="high">
    <meta name="theme-color" content="#FF2E63">
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${baseImageUrl}">
    <meta property="og:image" content="${baseImageUrl}">
    <meta property="og:image:width" content="600">   
    <meta property="og:image:height" content="800">
    
    <link rel="shortcut icon" href="/images/favicon.ico">
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">

    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root { --p:#FF2E63; --s:#34d399; --bg:#07070A; --card:#111116; --txt:#f8fafc; --gold:#fbbf24; --muted:#cbd5e1; --bw:rgba(255,255,255,0.06); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--txt); line-height: 1.6; overflow-x: hidden; }
        .container { position: relative; max-width: 500px; margin: 0 auto; background: var(--card); min-height: 100vh; box-shadow: 0 0 60px rgba(0,0,0,0.6); border-left: 1px solid var(--bw); border-right: 1px solid var(--bw); }
        @media (min-width: 768px) { .container { max-width: 600px; } }
        
        .fixed-nav { position: absolute; top: 0; left: 0; width: 100%; z-index: 100; background: linear-gradient(to bottom, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.4) 100%); backdrop-filter: blur(12px); border-bottom: 1px solid var(--bw); }
        .nav-content { display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; height: 64px; }
        .logo-text { font-size: 18px; font-weight: 800; color: #FFFFFF; text-decoration: none; }
        
        .breadcrumb { padding: 84px 1.25rem 0.5rem 1.25rem; font-size: 0.85rem; color: var(--muted); }
        .breadcrumb a { color: var(--p); text-decoration: none; }
        
        .main-content { padding: 0.5rem 1.25rem 2rem 1.25rem; }
        .hero-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 1.5rem; box-shadow: 0 24px 48px rgba(0,0,0,0.7); border: 1px solid var(--bw); display: block; }
        .profile-meta-header { text-align: center; margin: 1.5rem 0; }
        h1 { font-size: clamp(1.8rem, 5vw, 2.3rem); font-weight: 900; line-height: 1.2; }
        .rating { display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-weight: 700; font-size: 1.1rem; }
        .rating .stars { font-size: 1.2rem; filter: drop-shadow(0 0 6px rgba(250,204,21,0.4)); }
        .rating .rating-value { color: var(--gold); }
        .rating .review-count { color: var(--muted); font-size: 0.95rem; font-weight: 400; }
        .specs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin: 1.5rem 0; }
        .spec-box { background: rgba(255,255,255,0.02); border: 1px solid var(--bw); border-radius: 1rem; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; }
        .spec-box dt { font-size: 0.85rem; color: var(--muted); font-weight: 600; }
        .spec-box dd { font-size: 1.05rem; font-weight: 800; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; }
        .info-item { background: rgba(244,114,182,0.06); border: 1px solid rgba(244,114,182,0.2); border-radius: 1.25rem; padding: 1.25rem 0.75rem; text-align: center; }
        .info-label { font-size: 0.85rem; color: var(--p); font-weight: 700; display: block; }
        .info-value { font-size: 1.4rem; font-weight: 900; }
        .description { background: rgba(255,255,255,0.01); border-radius: 1.25rem; padding: 1.5rem; margin: 1.5rem 0; border: 1px solid var(--bw); white-space: pre-line; font-size: 1.05rem; }
        .btn-line { display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--p), #db2777); color: #fff; padding: 1.1rem 2rem; border-radius: 3rem; font-weight: 800; font-size: 1.2rem; text-decoration: none; width: 100%; box-shadow: 0 12px 32px rgba(255,46,99,0.3); transition: all 0.25s ease; }
        .pricing-section { margin: 2rem 0; background: rgba(0,0,0,0.2); border-radius: 1.25rem; padding: 1.5rem; border: 1px solid var(--bw); }
        .pricing-title { color: var(--p); text-align: center; font-weight: 800; font-size: 1.2rem; margin-bottom: 1.25rem; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center; }
        .pricing-item { background: rgba(255,255,255,0.03); padding: 0.85rem 0.5rem; border-radius: 0.85rem; border: 1px solid var(--bw); }
        .faq-section { margin: 2.5rem 0; }
        .faq-title { color: var(--p); font-size: 1.25rem; font-weight: 800; text-align: center; margin-bottom: 1.25rem; }
        .faq-item { background: rgba(255,255,255,0.02); border: 1px solid var(--bw); border-radius: 1rem; padding: 1.25rem; margin-bottom: 0.75rem; }
        .faq-item h3 { font-size: 1rem; color: var(--txt); margin-bottom: 0.5rem; }
        
        .related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
        .related-card { background: rgba(255,255,255,0.03); border-radius: 1.25rem; overflow: hidden; border: 1px solid var(--bw); text-decoration: none; color: inherit; display: block; transition: border-color 0.2s; }
        .related-card:hover { border-color: var(--p); }
        .related-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; }
        .related-name { padding: 0.75rem; text-align: center; font-weight: bold; font-size: 0.95rem; }
        .view-all-btn { display: block; text-align: center; color: var(--p); text-decoration: underline; font-weight: bold; margin-top: 1rem; }
        
        .testimonial { background: rgba(255,255,255,0.01); padding: 1.25rem; border-radius: 1.25rem; border: 1px solid var(--bw); margin-bottom: 1rem; }
        
        .footer { text-align: center; padding: 2.5rem 1rem; background: rgba(0,0,0,0.3); border-top: 1px solid var(--bw); margin-top: 3.5rem; color: var(--muted); font-size: 0.85rem; }
        .footer-nav { display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; }
        .footer-nav a { color: var(--muted); text-decoration: underline; }

        body {
            padding-top: env(safe-area-inset-top, 0px);
            padding-bottom: calc(75px + env(safe-area-inset-bottom, 0px));
        }

        @media (min-width: 768px) {
            body {
                padding-bottom: env(safe-area-inset-bottom, 0px);
            }
        }
    </style>
</head>
<body>

    <div class="container">
        <header class="fixed-nav">
            <div class="nav-content">
                <a href="/" class="logo-text">First Model <span style="color: #C084FC;">Hub</span></a>
            </div>
        </header>

        <nav aria-label="breadcrumb" class="breadcrumb">
            <a href="/">หน้าแรก</a> &raquo; 
            <a href="${correctProvinceUrl}">ดูรายชื่อน้องๆ ไซด์ไลน์${provinceName}</a> &raquo; 
            <span>${displayName}</span>
        </nav>

        <main class="main-content">
            <article>
                <section class="hero-section">
<img src="${lcpImageUrl}" 
     ${imageSrcSet ? `srcset="${imageSrcSet}" sizes="(max-width: 600px) 100vw, 400px"` : ''}
     class="hero-img" alt="${displayName} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" 
     loading="eager" fetchpriority="high" decoding="async" 
     width="400" height="533">
                </section>

                <header class="profile-meta-header">
                    <h1>${pageTitle}</h1>
                    <div class="rating">
                        <span class="stars">⭐</span>
                        <span class="rating-value">${ratingValue}</span>
                        <span class="review-count">คะแนนโหวตจากลูกค้า (${reviewCount} รีวิว)</span>
                    </div>
                </header>

                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">ค่าขนม</span>
                        <span class="info-value">${displayPrice}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">อายุ</span>
                        <span class="info-value">${ageVal} ปี</span>
                    </div>
                </div>

                <div class="specs-grid">
                    <dl class="spec-box"><dt>สัดส่วน</dt><dd>${bwhVal}</dd></dl>
                    <dl class="spec-box"><dt>ส่วนสูง</dt><dd>${heightVal} ซม.</dd></dl>
                </div>

                <div class="description">
                    ${escapeHTML(naturalDescriptionText)}
                </div>

                <a href="${finalLineUrl}" class="btn-line" rel="nofollow noopener" target="_blank">ทักไลน์จองคิว</a>

                <section class="pricing-section">
                    <h2 class="pricing-title">ราคาบริการ</h2>
                    <div class="pricing-grid">
                        <div class="pricing-item"><div>1 ชม.</div><strong>${rawRate.toLocaleString()}</strong></div>
                        <div class="pricing-item"><div>2 ชม.</div><strong>${Math.floor(rawRate * 1.8).toLocaleString()}</strong></div>
                        <div class="pricing-item"><div>ค้างคืน</div><strong>${Math.floor(rawRate * 4.5).toLocaleString()}</strong></div>
                    </div>
                </section>

                <section class="faq-section">
                    <h2 class="faq-title">คำถามพบบ่อย</h2>
                    <div class="faq-item">
                        <h3>${displayName} มีมัดจำไหม?</h3>
                        <p>ไม่มีนโยบายการรับเงินโอนจองมัดจำล่วงหน้าใดๆ ทุกกรณีค่ะ ลูกค้าสามารถเดินทางมานัดพบหน้างานเพื่อตรวจสอบสิทธิ์ความตรงปกเรียบร้อยแล้ว ค่อยตกลงชำระค่าขนมโดยตรงหน้างานเพื่อความปลอดภัย 100%</p>
                    </div>
                </section>

                <section>
                    <h2 class="faq-title">รีวิวจากลูกค้า</h2>
                    ${dynamicReviews.map(t => `
                        <div class="testimonial">
                            <strong>${escapeHTML(t.name)}</strong>
                            <p>${escapeHTML(t.text)}</p>
                        </div>
                    `).join('')}
                </section>
                
                ${related.length > 0 ? `
                <section class="faq-section" style="margin-top: 3.5rem;">
                    <h2 class="faq-title">น้องๆ โซน${provinceName} ที่น่าสนใจ</h2>
                    <div class="related-grid">
                        ${related.map(r => {
                            const rawRelName = r.name || 'สาวสวย';
                            const cleanRelName = rawRelName.replace(/^(น้อง\s?)+/, "");
                            const displayRelName = `น้อง${cleanRelName}`;
                            return `
                            <a href="/sideline/${encodeURIComponent(r.slug)}" class="related-card" title="${displayRelName}">
<img src="${optimizeImg(null, r.imagePath, 300, 400)}" class="related-img" alt="${displayRelName} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" loading="lazy" width="300" height="400">
                                <div class="related-name">${displayRelName}</div>
                            </a>
                            `;
                        }).join('')}
                    </div>
                    <a href="${correctProvinceUrl}" class="view-all-btn">ดูน้องๆ รับงานโซน${provinceName} ทั้งหมด</a>
                </section>
                ` : ''}

                <section class="faq-section" style="margin-top: 2.5rem; border-top: 1px solid var(--bw); padding-top: 2rem;">
                    <h2 class="faq-title">แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัย</h2>
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--bw); border-radius: 1rem; padding: 1.25rem; font-size: 0.85rem; color: var(--muted); line-height: 1.75;">
                        <p style="margin-bottom: 0.5rem;"><strong>✓ ข้อกำหนดอายุขั้นต่ำ</strong>: ผู้เข้าชมเพจและขอใช้สิทธิ์บริการจองคิวจะต้องมีอายุตั้งแต่ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</p>
                        <p style="margin-bottom: 0.5rem;"><strong>✓ มาตรการป้องกันมิจฉาชีพ</strong>: โปรดระมัดระวังการโอนเงินจองคิวมัดจำล่วงหน้า ทางระบบยึดมั่นนโยบายจ่ายหน้างานโดยตรงหลังเจอตัวน้องและตรวจสอบความถูกต้องตรงปกเท่านั้น</p>
                        <p><strong>✓ การรักษาความลับ (Zero-Log Policy)</strong>: ข้อมูลการติดต่อและการจองคิวทั้งหมดจะได้รับการดูแลภายใต้มาตรการความเป็นส่วนตัวสูงสุดและจะถูกลบออกจากระบบทันทีหลังจากงานเสร็จสิ้น</p>
                    </div>
                </section>
            </article>
        </main>
        
        <footer class="footer">
            <nav class="footer-nav">
                <a href="/">หน้าแรก</a>
                <a href="/profiles">โปรไฟล์น้องๆ ทั้งหมด</a>
                <a href="/locations">พิกัดรับงานทั่วประเทศ</a>
            </nav>
            © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - บริการด้วยความจริงใจ
        </footer>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "X-XSS-Protection": "1; mode=block",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
                "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
                "Content-Security-Policy": "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; script-src 'self' https: 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' https: 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self' https: wss:; frame-src 'self' https:;"
            }
        });

    } catch (err) {
        console.error("Bot rendering crash:", err);
        return context.next();
    }
};