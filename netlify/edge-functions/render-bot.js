/**
 * [ SYSTEM BOT RENDERING CORE - PROD-READY OPTIMIZED 2026 ]
 * Project: First Model Hub - Serverless Crawler Handler
 * File: netlify/edge-functions/render-bot.js
 * Authority: Extended Crawler Identification, Dynamic Link Building & Cloudinary Parity
 * Features: Zero 404 Cloudinary Handler, Clean Typography, 100% Valid Schema.org Graph
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

// 🟢 แก้ไข PROVINCE_NAME_MAP ให้รองรับทั้งแบบมีขีดและไม่มีขีดกลาง
const PROVINCE_NAME_MAP = {
    chiangmai: "เชียงใหม่",
    "chiang-mai": "เชียงใหม่",
    chiangrai: "เชียงราย",
    "chiang-rai": "เชียงราย",
    lampang: "ลำปาง",
    lamphun: "ลำพูน",
    phitsanulok: "พิษณุโลก",
    bangkok: "กรุงเทพฯ",
    chonburi: "ชลบุรี",
    khonkaen: "ขอนแก่น",
    "khon-kaen": "ขอนแก่น",
    phuket: "ภูเก็ต",
    udonthani: "อุดรธานี",
    "udon-thani": "อุดรธานี",
    udon: "อุดรธานี",
    ayutthaya: "พระนครศรีอยุธยา",
    "phra-nakhon-si-ayutthaya": "พระนครศรีอยุธยา",
    suratthani: "สุราษฎร์ธานี",
    "surat-thani": "สุราษฎร์ธานี",
    ubon: "อุบลราชธานี",
    "ubon-ratchathani": "อุบลราชธานี"
};

// 🟢 1. จัดการคำผิดและปรับคำภาษาไทยให้สละสลวย
const sanitizeThaiText = (str) => {
    if (!str) return "";
    return String(str)
        .replace(/นิมาน/g, "นิมมาน")
        .replace(/นิทาน/g, "นิมมาน")
        .replace(/ฟื้นที่/g, "พื้นที่")
        .replace(/ไกล้เคียง/g, "ใกล้เคียง")
        .replace(/ใกล้เครยง/g, "ใกล้เคียง")
        .replace(/พาพับ/g, "พายัพ")
        .replace(/รับงาน ของแก่น/g, "รับงาน ขอนแก่น")
        .replace(/ตัวเมือง ของแก่น/g, "ตัวเมือง ขอนแก่น");
};

// 🟢 2. สุ่มรีวิวคงที่ ปลอดภัยต่อ Type Error และไม่สุ่มซ้ำ
const getDeterministicReviews = (slug, count = 3) => {
    const seed = String(slug || 'default');
    const charCodeSum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const poolLength = REVIEW_POOL.length;
    if (poolLength === 0) return [];

    const selected = [];
    const usedIndices = new Set();
    
    for (let i = 0; i < count; i++) {
        let index = (charCodeSum + i * 3) % poolLength;
        while (usedIndices.has(index) && usedIndices.size < poolLength) {
            index = (index + 1) % poolLength;
        }
        usedIndices.add(index);
        selected.push(REVIEW_POOL[index]);
    }
    return selected;
};

// 🟢 3. สุ่มค่าคงที่สำหรับสัดส่วน/อายุ/ส่วนสูง
const getDeterministicValue = (min, max, seedString, offset = 0) => {
    const seed = String(seedString || 'seed');
    const sum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + offset;
    const range = Math.max(1, max - min + 1);
    return Math.floor(min + (sum % range));
};

// 🟢 4. แปลงราคาอย่างแม่นยำ (ลบจุลภาค ป้องกัน 1,500 กลายเป็น 10)
const extractCleanNumber = (rawRate) => {
    if (!rawRate) return 1500;
    const cleanStr = String(rawRate).replace(/,/g, '');
    const match = cleanStr.match(/\d+/);
    if (!match) return 1500;
    let num = parseInt(match[0], 10);
    if (num > 0 && num < 500) num *= 10;
    return num >= 500 ? num : 1500;
};

// 🟢 5. จัดการรูปภาพ Cloudinary 100% ปลอดภัย ไร้ปัญหา 404 (บังคับใส่ images/ เสมอ)
const optimizeImg = (path, width = 600, height = 800) => {
    const defaultImg = `${CONFIG.DOMAIN}/images/firstmodelhub.webp`;
    if (!path || typeof path !== 'string' || !path.trim()) {
        return defaultImg;
    }

    const cleanPath = path.trim();
    const transform = height 
        ? `f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face` 
        : `f_auto,q_auto:eco,w_${width},c_scale`;

    // กรณีเป็น Full URL ของ Cloudinary
    if (cleanPath.includes('res.cloudinary.com')) {
        const uploadIdx = cleanPath.indexOf('/upload/');
        if (uploadIdx !== -1) {
            const prefix = cleanPath.substring(0, uploadIdx + 8);
            let afterUpload = cleanPath.substring(uploadIdx + 8);

            // ลบพารามิเตอร์ Transformation เดิมออกทั้งหมด
            afterUpload = afterUpload.replace(/^(?:[a-z]{1,4}_[a-z0-9_:-]+,?)+\//i, '');

            // ถ้าไม่มีโฟลเดอร์ images/ ให้เติมเข้าไป ป้องกันชื่อไฟล์ v0... ชนกับ Cloudinary Version
            if (!afterUpload.includes('images/')) {
                afterUpload = `images/${afterUpload.replace(/^v\d+\//i, '')}`;
            }

            return `${prefix}${transform}/${afterUpload}`;
        }
        return cleanPath;
    }

    // กรณีเป็น URL ภายนอกอื่นๆ
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
        return cleanPath;
    }

    // กรณีเป็น Relative Path จาก Supabase (เช่น "v0mjwv..." หรือ "images/v0mjwv...")
    let relPath = cleanPath.replace(/^\/+/, '');
    if (!relPath.startsWith('images/')) {
        relPath = `images/${relPath}`;
    }

    return `${CONFIG.CLOUDINARY_BASE_URL}${transform}/${relPath}`;
};

// 🟢 6. สร้าง SrcSet สำหรับรูป Responsive
const generateSrcSet = (path) => {
    if (!path || typeof path !== 'string') return '';
    const widths = [400, 600, 800];
    return widths.map(w => {
        const h = Math.round(w * (800 / 600)); 
        return `${optimizeImg(path, w, h)} ${w}w`;
    }).join(', ');
};

// 🟢 7. ฟังก์ชัน Escape & Strip HTML
const escapeHTML = (str) => (str !== null && str !== undefined) 
    ? String(str).replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag] || tag)) 
    : '';

const stripHTML = (str) => (str !== null && str !== undefined) 
    ? String(str).replace(/<[^>]*>?/gm, '').trim() 
    : '';

// 🟢 8. กรองข้อความ ASCII Art / สัญลักษณ์ตกแต่ง
const cleanAsciiArt = (text) => {
    if (!text) return '';
    return String(text)
        .replace(/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬╭╮╰╯┊●○★☆◆◇■□▲▼▶◀✦✧*🔭🐻‍❄️💦🫦🌷֒🐾]+/g, ' ')
        .replace(/[„•ㅅ•„જ⁀➴·˚༘⋆₊✮⸜⸝𐐪𐑂]+/g, ' ')
        .replace(/[^\u0E00-\u0E7F\w\s.,/%()+-]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
};

const getLocalizedZone = (location, provinceName) => {
    if (!location) return `โซนต่าง ๆ ในจังหวัด${provinceName}`;
    const cleanLoc = sanitizeThaiText(location).trim();
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
    const dynamicDomain = CONFIG.DOMAIN; 
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // ตรวจสอบว่าเป็น Bot / Crawler หรือไม่
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless|bingbot|yandex|duckduckgo|applebot|gptbot|chatgpt|cohere|anthropic|perplexity|mediapartners-google/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app', 'profiles'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 🟢 ตรวจสอบโปรไฟล์จากฐานข้อมูล Supabase ทั้ง Slug และ Numeric ID
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

        // ดึงรายชื่อน้องๆ โซนเดียวกันเพื่อทำ Internal Links
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
        
        const rawRate = extractCleanNumber(p.rate || p.price);
        const displayPrice = rawRate.toLocaleString() + ".-";
        
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
        
        const localizedZone = getLocalizedZone(p.location, provinceName);
        const naturalDescriptionText = getNaturalDescription(p, displayName, provinceName, ageVal, bwhVal, heightVal, weightVal, localizedZone, displayPrice);
        
        const pageTitle = `${displayName} ไซด์ไลน์${provinceName} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก 100%`;
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

        // =========================================================================
        // 🟢 SCHEMA.ORG JSON-LD GRAPH (100% VALID & RICH SNIPPETS READY)
        // =========================================================================
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
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
                {
                    "@type": "BreadcrumbList",
                    "@id": `${canonicalUrl}#breadcrumb`,
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": dynamicDomain },
                        { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceName}`, "item": correctProvinceUrl },
                        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                    ]
                },
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
<html lang="th" class="dark-theme dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle} | ${CONFIG.BRAND_NAME}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    
    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
    <link rel="preload" as="image" href="${lcpImageUrl}" ${imageSrcSet ? `imagesrcset="${imageSrcSet}" imagesizes="(max-width: 600px) 100vw, 400px"` : ''} fetchpriority="high">
    <meta name="theme-color" content="#060411">
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${baseImageUrl}">
    <meta property="og:image" content="${baseImageUrl}">
    <meta property="og:image:width" content="600">   
    <meta property="og:image:height" content="800">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">

    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">
    
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
</head>
<body>
    <div class="container" style="max-width: 680px; margin: 0 auto; padding: 1rem 1rem 5rem 1rem;">
        <header id="page-header" role="banner" style="position: relative; margin-bottom: 1rem;">
            <div class="header-logo-container">
                <a href="/" aria-label="ไปที่หน้าแรก FirstModelHub">
                    <span class="brand-logo-text">FirstModel<span class="hub-text">Hub</span><span class="star">🌟</span></span>
                </a>
            </div>
        </header>

        <nav aria-label="breadcrumb" style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 1rem; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <a href="/" style="color: var(--text-gray); text-decoration: none;">หน้าแรก</a> &raquo; 
            <a href="${correctProvinceUrl}" style="color: var(--primary-purple); text-decoration: none;">สาวรับงาน${provinceName}</a> &raquo; 
            <span>${displayName}</span>
        </nav>

        <main class="main-content">
            <article class="interactive-card" style="padding: 1.25rem; border-radius: 20px; background: rgba(9, 9, 12, 0.95); border: 1px solid rgba(192, 132, 252, 0.2);">
                <section class="hero-section">
                    <div style="position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 3/4; width: 100%;">
                        <img src="${lcpImageUrl}" 
                             ${imageSrcSet ? `srcset="${imageSrcSet}" sizes="(max-width: 600px) 100vw, 400px"` : ''}
                             class="hero-img" alt="${displayName} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" 
                             loading="eager" fetchpriority="high" decoding="sync" 
                             width="400" height="533" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </section>

                <header class="profile-meta-header" style="text-align: center; margin: 1.25rem 0 1rem 0;">
                    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; line-height: 1.3;">${pageTitle}</h1>
                    <div style="display: inline-flex; align-items: center; gap: 6px; margin-top: 6px;">
                        <span style="color: #FBBF24;">⭐ ${ratingValue}</span>
                        <span style="color: var(--text-muted); font-size: 12px;">(${reviewCount} รีวิว)</span>
                    </div>
                </header>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 1.25rem;">
                    <div class="spec-box" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted); font-size: 11.5px;">สัดส่วน</span>
                        <strong style="color: #FFF;">${bwhVal}</strong>
                    </div>
                    <div class="spec-box" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted); font-size: 11.5px;">ส่วนสูง / น้ำหนัก</span>
                        <strong style="color: #FFF;">${heightVal} ซม. / ${weightVal} กก.</strong>
                    </div>
                    <div class="spec-box" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted); font-size: 11.5px;">อายุ</span>
                        <strong style="color: #FFF;">${ageVal} ปี</strong>
                    </div>
                    <div class="spec-box" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted); font-size: 11.5px;">พิกัดบริการ</span>
                        <strong style="color: #C084FC;">${escapeHTML(sanitizeThaiText(p.location || provinceName))}</strong>
                    </div>
                </div>

                <div class="description" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 14px; color: var(--text-gray); font-size: 12px; line-height: 1.6; margin-bottom: 1.25rem;">
                    ${escapeHTML(naturalDescriptionText)}
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <a href="${finalLineUrl}" class="sidebar-line-btn" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background-color: #06C755; color: #FFFFFF; padding: 14px 0; border-radius: 100px; font-weight: 800; text-decoration: none; font-size: 14px; box-shadow: 0 4px 20px rgba(6, 199, 85, 0.4);" rel="nofollow noopener" target="_blank">
                        <i class="fab fa-line" style="font-size: 20px;"></i> แอดไลน์สอบถามคิว (จ่ายหน้างาน)
                    </a>
                </div>

                <section style="margin-bottom: 1.5rem; background: rgba(0,0,0,0.3); border-radius: 14px; padding: 14px; border: 1px solid rgba(255,255,255,0.06);">
                    <h2 style="color: #C084FC; text-align: center; font-weight: 800; font-size: 13.5px; margin-bottom: 10px;">ราคาบริการ</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                        <div style="background: rgba(255,255,255,0.03); padding: 10px 4px; border-radius: 10px;"><div>1 ชม.</div><strong style="color: #00E676;">${rawRate.toLocaleString()}.-</strong></div>
                        <div style="background: rgba(255,255,255,0.03); padding: 10px 4px; border-radius: 10px;"><div>2 ชม.</div><strong style="color: #00E676;">${Math.floor(rawRate * 1.8).toLocaleString()}.-</strong></div>
                        <div style="background: rgba(255,255,255,0.03); padding: 10px 4px; border-radius: 10px;"><div>ค้างคืน</div><strong style="color: #00E676;">${Math.floor(rawRate * 4.5).toLocaleString()}.-</strong></div>
                    </div>
                </section>

                <section style="margin-bottom: 1.5rem;">
                    <h2 style="color: #FFF; font-size: 13.5px; font-weight: 800; margin-bottom: 10px; text-align: center;">คำถามพบบ่อย</h2>
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px;">
                        <h3 style="font-size: 12px; color: #C084FC; margin-bottom: 4px;">Q: ${displayName} มีมัดจำไหม?</h3>
                        <p style="font-size: 11.5px; color: var(--text-gray); margin: 0;">ไม่มีนโยบายการรับเงินโอนจองมัดจำล่วงหน้าทุกกรณีค่ะ ลูกค้าสามารถนัดพบเจอตัวจริงหน้างานเพื่อตรวจสอบสิทธิ์ความตรงปกเรียบร้อยแล้ว ค่อยตกลงชำระค่าบริการหน้างานเพื่อความปลอดภัย 100%</p>
                    </div>
                </section>

                <section style="margin-bottom: 1.5rem;">
                    <h2 style="color: #FFF; font-size: 13.5px; font-weight: 800; margin-bottom: 10px; text-align: center;">รีวิวจากลูกค้า</h2>
                    ${dynamicReviews.map(t => `
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px; margin-bottom: 8px;">
                            <strong style="color: #FFF; font-size: 12px;">${escapeHTML(t.name)}</strong>
                            <p style="font-size: 11.5px; color: var(--text-gray); margin: 4px 0 0 0;">${escapeHTML(t.text)}</p>
                        </div>
                    `).join('')}
                </section>
                
                ${related.length > 0 ? `
                <section style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.25rem;">
                    <h2 style="color: #C084FC; font-size: 13.5px; font-weight: 800; margin-bottom: 12px; text-align: center;">น้องๆ แนะนำเพิ่มเติมในโซน${provinceName}</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                        ${related.map(r => {
                            const rawRelName = r.name || r.displayName || 'สาวสวย';
                            const cleanRelName = rawRelName.replace(/^(น้อง\s?)+/, "");
                            const displayRelName = `น้อง${cleanRelName}`;
                            const relImgPath = r.imagePath || r.image_url || r.photo || '';
                            return `
                            <a href="/sideline/${encodeURIComponent(r.slug || r.id)}" style="text-decoration: none; color: inherit; background: rgba(255,255,255,0.03); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); display: block; text-align: center;">
                                <img src="${optimizeImg(relImgPath, 300, 400)}" alt="${displayRelName} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" loading="lazy" width="300" height="400" style="width: 100%; aspect-ratio: 4/5; object-fit: cover;">
                                <div style="padding: 6px; font-size: 11px; font-weight: 800; color: #FFF;">${displayRelName}</div>
                            </a>
                            `;
                        }).join('')}
                    </div>
                    <div style="text-align: center;">
                        <a href="${correctProvinceUrl}" style="color: var(--primary-purple); font-size: 11.5px; font-weight: 800; text-decoration: none;">ดูน้องๆ รับงานโซน${provinceName} ทั้งหมด &rarr;</a>
                    </div>
                </section>
                ` : ''}

                <section style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.5rem;">
                    <h2 style="color: var(--primary-purple); font-size: 13.5px; font-weight: 800; text-align: center; margin-bottom: 8px;">แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัย</h2>
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px; font-size: 11px; color: var(--text-muted); line-height: 1.6;">
                        <p style="margin-bottom: 0.4rem;"><strong>✓ ข้อกำหนดอายุขั้นต่ำ</strong>: ผู้เข้าชมเพจและขอใช้สิทธิ์บริการจองคิวจะต้องมีอายุตั้งแต่ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</p>
                        <p style="margin-bottom: 0.4rem;"><strong>✓ มาตรการป้องกันมิจฉาชีพ</strong>: โปรดระมัดระวังการโอนเงินจองคิวมัดจำล่วงหน้า ทางระบบยึดมั่นนโยบายจ่ายหน้างานโดยตรงหลังเจอตัวน้องและตรวจสอบความถูกต้องตรงปกเท่านั้น</p>
                        <p><strong>✓ การรักษาความลับ (Zero-Log Policy)</strong>: ข้อมูลการติดต่อและการจองคิวทั้งหมดจะได้รับการดูแลภายใต้มาตรการความเป็นส่วนตัวสูงสุด</p>
                    </div>
                </section>
            </article>
        </main>
        
        <footer role="contentinfo" style="text-align: center; padding: 2rem 0; color: var(--text-muted); font-size: 11px;">
            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 8px;">
                <a href="/" style="color: var(--text-gray); text-decoration: none;">หน้าแรก</a>
                <a href="/profiles" style="color: var(--text-gray); text-decoration: none;">รวมโปรไฟล์</a>
                <a href="/locations" style="color: var(--text-gray); text-decoration: none;">พื้นที่บริการ</a>
            </div>
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
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        });

    } catch (err) {
        console.error("Bot rendering crash:", err);
        return context.next();
    }
};