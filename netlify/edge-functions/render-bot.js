/**
 * [ SYSTEM BOT RENDERING CORE - PROD-READY OPTIMIZED 2026 ]
 * Project: First Model Hub - Serverless Crawler Handler
 * File: netlify/edge-functions/render-bot.js
 * Authority: Extended Crawler Identification, Dynamic Link Building & Schema Architecture
 * Features: Pure Cloudinary CDN, Clean Text Filter (No ASCII Art), High-Speed Image Preload, Schema Rating Fix
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

const CONFIG = {
    get SUPABASE_URL() {
        try { return Deno.env.get("SUPABASE_URL") || 'https://zxetzqwjaiumqhrpumln.supabase.co'; } catch { return 'https://zxetzqwjaiumqhrpumln.supabase.co'; }
    },
    get SUPABASE_KEY() {
        try { return Deno.env.get("SUPABASE_KEY") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; } catch { return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; }
    },
    DOMAIN: 'https://firstmodelhub.com',
    BRAND_NAME: 'FirstModelHub',
    CLOUDINARY_CLOUD_NAME: 'drffioary',
    CLOUDINARY_BASE_URL: 'https://res.cloudinary.com/drffioary/image/upload/',
    DEFAULT_TELEPHONE: '+66926997044',
    DISPLAY_LINE_ID: 'LINE: @firstmodelhub',
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

const PROVINCE_NAME_MAP = {
    chiangmai: "เชียงใหม่",
    chiangrai: "เชียงราย",
    lampang: "ลำปาง",
    lamphun: "ลำพูน",
    phitsanulok: "พิษณุโลก",
    bangkok: "กรุงเทพฯ",
    chonburi: "ชลบุรี",
    khonkaen: "ขอนแก่น",
    phuket: "ภูเก็ต",
    udonthani: "อุดรธานี",
    udon: "อุดรธานี",
    ayutthaya: "พระนครศรีอยุธยา",
    suratthani: "สุราษฎร์ธานี",
    ubon: "อุบลราชธานี"
};

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


const optimizeImg = (path, width = 400, height = 500) => {
    if (!path || typeof path !== 'string' || !path.trim()) {
        return `${CONFIG.DOMAIN}/images/firstmodelhub.webp`;
    }
    const cleanPath = path.trim();
    const transform = height 
        ? `f_auto,q_auto,w_${width},h_${height},c_fill` 
        : `c_scale,w_${width},q_auto,f_auto`;

    if (cleanPath.includes('res.cloudinary.com')) {
        const uploadIdx = cleanPath.indexOf('/upload/');
        if (uploadIdx !== -1) {
            const prefix = cleanPath.substring(0, uploadIdx + 8);
            let rest = cleanPath.substring(uploadIdx + 8);
            // ล้าง Transformation parameters เก่าที่อาจติดมาใน Database ออกทั้งหมด
            rest = rest.replace(/^([a-z0-9_,-:]+\/)+?(v\d+|images)/i, "$2");
            if (!rest.startsWith("v") && !rest.startsWith("images") && rest.includes("/")) {
                rest = rest.replace(/^[^/]+\//, "");
            }
            return `${prefix}${transform}/${rest}`;
        }
        return cleanPath;
    }

    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
        return cleanPath;
    }

    // กรณีเป็น Relative Path เช่น "v1771782437/images/..." หรือ "images/..." จาก Supabase
    return `${CONFIG.CLOUDINARY_BASE_URL}${transform}/${cleanPath.replace(/^\/+/, "")}`;
};

const generateSrcSet = (path) => {
    if (!path) return '';
    const widths = [400, 600, 800];
    return widths.map(w => {
        const h = Math.round(w * (800 / 600)); 
        return `${optimizeImg(path, w, h)} ${w}w`;
    }).join(', ');
};

const escapeHTML = (str) => str ? String(str).replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])) : '';
const stripHTML = (str) => str ? String(str).replace(/<[^>]*>?/gm, '').trim() : '';

const cleanAsciiArt = (text) => {
    if (!text) return "";
    return text
        .replace(/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬╭╮╰╯┊]+/g, "")
        .replace(/[„•ㅅ•„₊˚(\s\S)*?づ♡✦⁺.💦જ⁀➴🐻‍❄️ྀི·༘⋆*🔭🫦➏➒🌷͙֒𐐪🐾˖°●]+/g, " ")
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

const getNaturalDescription = (p, displayName, provinceName, ageVal, bwhVal, heightVal, weightVal, localizedZone, rateVal) => {
    const heightText = heightVal ? `ส่วนสูง ${heightVal} ซม.` : "";
    const weightText = weightVal ? `น้ำหนัก ${weightVal} กก.` : "";
    const skinText = (p.skinTone || p.skin_tone || "").trim() ? `ผิวพรรณ${p.skinTone || p.skin_tone}` : "ผิวพรรณเนียนสวย";
    const bioStats = [bwhVal ? `สัดส่วน ${bwhVal}` : "", heightText, weightText, skinText].filter(Boolean).join(" ");

    return `ยินดีต้อนรับสู่โปรไฟล์แนะนำของ ${displayName} ผู้ให้บริการเพื่อนเที่ยวและนำเที่ยวระดับพรีเมียมในเขตพื้นที่ ${localizedZone} อายุ ${ageVal} ปี ${bioStats} พร้อมมอบการดูแลเอาใจใส่อย่างเป็นธรรมชาติในสไตล์ฟีลแฟนที่อบอุ่นและสุภาพเรียบร้อย อัตราค่าขนมเริ่มต้น ${rateVal} การันตีความปลอดภัยสูงสุดด้วยเงื่อนไขตกลงนัดพบเจอตัวจริงหน้างานเรียบร้อยแล้วจึงค่อยชำระค่าบริการ ปราศจากการเรียกเก็บเงินจองมัดจำล่วงหน้าทุกกรณี`;
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
        if (['province', 'category', 'search', 'app', 'profiles'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 🟢 1. ตรวจสอบโปรไฟล์จากฐานข้อมูล Supabase ทั้ง Slug และ Numeric ID
        let profileQuery = supabase
            .from('profiles')
            .select('*')
            .eq('active', true);

        if (/^\d+$/.test(slug)) {
            profileQuery = profileQuery.eq('id', slug);
        } else {
            profileQuery = profileQuery.eq('slug', slug);
        }

        const { data: p } = await profileQuery.maybeSingle();

        if (!p) {
            return context.next();
        }

        // ดึงรายชื่อน้องๆ ที่อยู่ในโซนจังหวัดเดียวกันเพื่อทำ Cross-linking ดันคะแนน SEO
        let related = [];
        const provKeyToQuery = p.provinceKey || p.province_key || p.province_slug || 'chiangmai';
        if (provKeyToQuery) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('*')
                .eq('provinceKey', provKeyToQuery)
                .eq('active', true)
                .neq('id', p.id) 
                .limit(6);
            related = relatedData || [];
        }

        const rawName = p.name || p.displayName || 'สาวสวย';
        let cleanName = rawName.trim().replace(/^(น้อง\s?)+/gi, '');
        const displayName = `น้อง${cleanName}`;
        
        const provinceKey = provKeyToQuery.toLowerCase();
        const provinceName = p.provinceThai || p.province_thai || PROVINCE_NAME_MAP[provinceKey] || p.location || 'เชียงใหม่';
        
        const correctProvinceUrl = `${dynamicDomain}/location/${provinceKey}`;
        
        const cleanedRate = String(p.rate || p.price || "1500").replace(/[^0-9]/g, '');
        const rawRate = parseInt(cleanedRate, 10) || 1500;
        const displayPrice = rawRate.toLocaleString() + ".-";
        
        // 🟢 ดึงรูปภาพ Cloudinary จากทุกคอลัมน์ที่เป็นไปได้ใน Supabase
        const rawImgPath = p.imagePath || p.image_url || p.imageUrl || p.photo || p.avatar || '';
        const baseImageUrl = optimizeImg(rawImgPath, 600, 800);
        const lcpImageUrl = optimizeImg(rawImgPath, 400, 533);
        const imageSrcSet = generateSrcSet(rawImgPath);
        
        let finalLineUrl = p.line_id || p.lineId || p.line || 'ksLUWB89Y_';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/${finalLineUrl.replace(/^@/, '')}`;
        }

        const ageVal = p.age || getDeterministicValue(20, 26, slug, 1);
        const heightVal = p.height || getDeterministicValue(158, 168, slug, 2);
        const weightVal = p.weight || getDeterministicValue(44, 52, slug, 3);
        
        let bwhVal = p.stats || p.proportion || '';
        if (!bwhVal || bwhVal === '-') {
            const breastVal = p.bust || getDeterministicValue(32, 36, slug, 4);
            const waistVal = p.waist || getDeterministicValue(23, 26, slug, 5);
            const hipVal = p.hips || getDeterministicValue(33, 37, slug, 6);
            bwhVal = `${breastVal}-${waistVal}-${hipVal}`;
        }

        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.8 + (charCodeSum % 3) / 10).toFixed(1);
        const reviewCount = 120 + (charCodeSum % 80);
        
// ✅ ส่งค่าให้ครบทั้ง 9 ตัวตามลำดับ
const localizedZone = getLocalizedZone(p.location, provinceName);
const naturalDescriptionText = getNaturalDescription(p, displayName, provinceName, ageVal, bwhVal, heightVal, weightVal, localizedZone, displayPrice);
        
        const pageTitle = `${displayName} ไซด์ไลน์${provinceName} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก`;
        const metaDesc = `โปรไฟล์แนะนำของ ${displayName} สาวสวยไซด์ไลน์พิกัดบริการบริเวณ ${p.location || provinceName} อายุ ${ageVal} ปี สัดส่วน ${bwhVal} ดูแลเอาใจใส่เป็นกันเองสไตล์ฟิวแฟนอย่างสุภาพ ตรวจสอบประวัติจริงตรงปก ปลอดภัยสูงสุด ไร้เงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี`;
        
        const canonicalUrl = `${dynamicDomain}/sideline/${encodeURIComponent(p.slug || p.id)}`;

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
            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": dynamicDomain },
            { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceName}`, "item": correctProvinceUrl },
            { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
        ];

        // =========================================================================
        // 🟢 SCHEMA.ORG JSON-LD GRAPH (100% VALID & RICH RESULTS READY)
        // =========================================================================
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                // 1. นิติบุคคลผู้ให้บริการ / ธุรกิจความบันเทิงในพื้นที่
                {
                    "@type": ["LocalBusiness", "EntertainmentBusiness"],
                    "@id": `${canonicalUrl}#serviceprovider`,
                    "name": `${displayName} - ไซด์ไลน์${provinceName}`,
                    "image": [baseImageUrl],
                    "description": stripHTML(metaDesc),
                    "url": canonicalUrl,
                    "priceRange": "฿฿",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": p.location || provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": Number(ratingValue) || 4.9,
                        "reviewCount": Number(reviewCount) || 120,
                        "bestRating": 5,
                        "worstRating": 1
                    },
                    "review": schemaReviews
                },

                // 2. ข้อมูลโปรไฟล์บุคคล (Person Entity) ดึงสเปกลึกทั้งหมดให้ Googlebot ทราบ
                {
                    "@type": "Person",
                    "@id": `${canonicalUrl}#person`,
                    "name": displayName,
                    "gender": "Female",
                    "jobTitle": "ผู้ให้บริการเพื่อนเที่ยวและดูแลสไตล์ฟิวแฟน",
                    "description": stripHTML(naturalDescriptionText),
                    "image": baseImageUrl,
                    "url": canonicalUrl,
                    "height": `${heightVal} cm`,
                    "weight": `${weightVal} kg`,
                    "knowsAbout": [
                        "Girlfriend Experience (GFE)",
                        "เพื่อนเที่ยวฟิวแฟน",
                        `สาวรับงาน${provinceName}`,
                        `ไซด์ไลน์${provinceName}`
                    ],
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": p.location || provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "offers": {
                        "@type": "Offer",
                        "url": canonicalUrl,
                        "price": rawRate || 1500,
                        "priceCurrency": "THB",
                        "priceValidUntil": "2027-12-31",
                        "availability": "https://schema.org/InStock",
                        "description": "นัดพบเจอตัวจริงหน้างานเรียบร้อยแล้วจึงค่อยชำระค่าบริการ ปราศจากการเรียกเก็บเงินจองมัดจำล่วงหน้าทุกกรณี"
                    }
                },

                // 3. เส้นทาง Breadcrumb นำทางอย่างเป็นระบบ
                {
                    "@type": "BreadcrumbList",
                    "@id": `${canonicalUrl}#breadcrumb`,
                    "itemListElement": breadcrumbElements
                },

                // 4. คำถาม-คำตอบที่พบบ่อย (FAQPage) ระบุสเปก พิกัด และความปลอดภัยชัดเจน
                {
                    "@type": "FAQPage",
                    "@id": `${canonicalUrl}#faq`,
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `${displayName} มีสัดส่วน ส่วนสูง และพิกัดบริการที่ไหนบ้าง?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `${displayName} อายุ ${ageVal} ปี สัดส่วน ${bwhVal} ส่วนสูง ${heightVal} ซม. สแตนด์บายพร้อมดูแลในเขตพื้นที่ ${localizedZone} ดูแลสไตล์ฟิวแฟนอย่างอบอุ่น สุภาพ ตรงปก 100% ค่ะ`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `อัตราค่าบริการและเงื่อนไขการชำระเงินของ ${displayName} เป็นอย่างไร?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `อัตราค่าบริการเริ่มต้น ${displayPrice} นัดพบเจอตัวจริงตรวจสอบความตรงปกหน้างานเรียบร้อยแล้วจึงชำระเงินโดยตรง ไม่มีเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณีค่ะ`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `สามารถติดต่อตรวจสอบคิวงานหรือจองคิว ${displayName} ได้ทางใด?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `สามารถกดปุ่ม 'ทักไลน์จองคิว' บนหน้าโปรไฟล์ เพื่อตรวจสอบตารางงานและสแตนด์บายคิวบริการผ่านไลน์ทางการได้อย่างสะดวกรวดเร็วค่ะ`
                            }
                        }
                    ]
                }
            ]
        };

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} | สารบัญตรวจสอบประวัติตรงปก</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
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
        :root { 
    --p: #C084FC; 
    --s: #00E676; 
    --bg: #060411; 
    --card: #09090C; 
    --txt: #f8fafc; 
    --gold: #fbbf24; 
    --muted: #A1A1AA; 
    --bw: rgba(255,255,255,0.08); 
}
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
                         loading="eager" fetchpriority="high" decoding="sync" 
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
                            const rawRelName = r.name || r.displayName || 'สาวสวย';
                            const cleanRelName = rawRelName.replace(/^(น้อง\s?)+/, "");
                            const displayRelName = `น้อง${cleanRelName}`;
                            const relImgPath = r.imagePath || r.image_url || r.photo || '';
                            return `
                            <a href="/sideline/${encodeURIComponent(r.slug || r.id)}" class="related-card" title="${displayRelName}">
                                <img src="${optimizeImg(relImgPath, 300, 400)}" class="related-img" alt="${displayRelName} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" loading="lazy" width="300" height="400">
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