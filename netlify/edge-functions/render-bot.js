/**
 * [ SYSTEM BOT RENDERING CORE - PROD-READY OPTIMIZED ]
 * Project: First Model Hub - Serverless Crawler Handler
 * Authority: Extended Crawler Identification, Dynamic Link Building & Schema Architecture
 * Year: 2026 Core Engine Compliant
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

const escapeHTML = (str) => str ? String(str).replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])) : '';
const stripHTML = (str) => str ? String(str).replace(/<[^>]*>?/gm, '').trim() : '';

export default async (request, context) => {
    const url = new URL(request.url);
    const dynamicDomain = `${url.protocol}//${url.host}`; 
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless|bingbot|yandex|duckduckgo|applebot|gptbot|chatgpt|cohere|anthropic|perplexity|mediapartners-google/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const rawSlug = pathParts[pathParts.length - 1];
        if (['province', 'category', 'search', 'app'].includes(rawSlug)) return context.next();

        // 🟢 1. สกัดและสร้างรูปแบบ Slug ภาษาไทยทุกเวอร์ชัน (กันปัญหา %E0... กับ ตัวหนังสือไทย)
        let decodedSlug = rawSlug;
        try {
            decodedSlug = decodeURIComponent(rawSlug);
        } catch {
            decodedSlug = rawSlug;
        }

        const searchSlugs = [...new Set([
            rawSlug,
            decodedSlug,
            rawSlug.toLowerCase(),
            decodedSlug.toLowerCase(),
            encodeURIComponent(decodedSlug)
        ])];

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 🟢 2. ค้นหาใน Supabase ด้วย .in() ครอบคลุมรูปแบบภาษาไทยทั้งหมด
        let { data: p } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate, age, height, weight, stats, bust, waist, hips, description, provinceKey, lineId, provinces(nameThai, key)')
            .in('slug', searchSlugs)
            .eq('active', true)
            .limit(1)
            .maybeSingle();

        // 🟢 3. ถ้ายังไม่เจอ และ slug เป็นตัวเลข ให้ค้นหาจาก ID สำรอง
        if (!p && /^\d+$/.test(decodedSlug)) {
            const { data: byId } = await supabase
                .from('profiles')
                .select('id, slug, name, imagePath, location, rate, age, height, weight, stats, bust, waist, hips, description, provinceKey, lineId, provinces(nameThai, key)')
                .eq('id', parseInt(decodedSlug, 10))
                .eq('active', true)
                .maybeSingle();
            p = byId;
        }

        if (!p) {
            return new Response(`<!DOCTYPE html><html lang="th"><head><meta name="robots" content="noindex, follow"><title>404 - ไม่พบหน้าเว็บ</title></head><body><h1>404 Not Found</h1></body></html>`, {
                status: 404,
                headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "no-store" } 
            });
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
        const provinceKey = p.provinces?.key || p.provinceKey || 'chiangmai';
        
        const correctProvinceUrl = `${dynamicDomain}/location/${provinceKey}`;
        
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

        const ageVal = p.age || getDeterministicValue(20, 26, decodedSlug, 1);
        const heightVal = p.height || getDeterministicValue(158, 168, decodedSlug, 2);
        
        let bwhVal = p.stats;
        if (!bwhVal) {
            if (p.bust && p.waist && p.hips) {
                bwhVal = `${p.bust}-${p.waist}-${p.hips}`;
            } else {
                const breastVal = getDeterministicValue(32, 36, decodedSlug, 4);
                const waistVal = getDeterministicValue(23, 26, decodedSlug, 5);
                const hipVal = getDeterministicValue(33, 37, decodedSlug, 6);
                bwhVal = `${breastVal}-${waistVal}-${hipVal}`;
            }
        }

        const charCodeSum = decodedSlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);
        
        const naturalDescriptionText = p.description && p.description.trim().length > 10 
            ? p.description.trim()
            : `ยินดีต้อนรับสู่โปรไฟล์แนะนำของ ${displayName} ผู้ให้บริการเพื่อนเที่ยวระดับพรีเมียมในย่าน ${p.location || provinceName} อายุ ${ageVal} ปี สัดส่วน ${bwhVal} สูง ${heightVal} ซม. สุภาพเรียบร้อย ดูแลดีสไตล์ฟิวแฟน ปลอดภัยไม่โอนมัดจำล่วงหน้า จ่ายหน้างานตรงกับน้องเมื่อเจอตัวจริงเท่านั้น`;
        
        const pageTitle = `${displayName} ไซด์ไลน์${provinceName} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก`;
        const metaDesc = `โปรไฟล์แนะนำของ ${displayName} สาวสวยไซด์ไลน์พิกัดบริการบริเวณ ${p.location || provinceName} อายุ ${ageVal} ปี สัดส่วน ${bwhVal} ดูแลเอาใจใส่เป็นกันเองสไตล์ฟิวแฟนอย่างสุภาพ ตรวจสอบประวัติจริงตรงปก ปลอดภัยสูงสุด ไร้เงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี`;
        
        const canonicalUrl = `${dynamicDomain}/sideline/${encodeURIComponent(p.slug || decodedSlug)}`;

        const dynamicReviews = getDeterministicReviews(decodedSlug, 3);
        const schemaReviews = dynamicReviews.map(t => ({
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": t.rating.toString(),
                "bestRating": "5"
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
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString()
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
    
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${lcpImageUrl}" fetchpriority="high">
    <meta name="theme-color" content="#FF2E63">
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${baseImageUrl}">
    <meta property="og:image" content="${baseImageUrl}">
    
    <link rel="shortcut icon" href="/images/favicon.ico">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
</head>
<body class="bg-gray-950 text-white font-sans">
    <div class="max-w-md mx-auto min-h-screen bg-gray-900 border-x border-gray-800 pb-20">
        <header class="p-4 border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
            <a href="/" class="text-lg font-black text-white">First Model <span class="text-purple-400">Hub</span></a>
        </header>

        <nav aria-label="breadcrumb" class="p-4 text-xs text-gray-400 flex items-center gap-1 flex-wrap">
            <a href="/" class="text-purple-400 hover:underline">หน้าแรก</a> &raquo; 
            <a href="${correctProvinceUrl}" class="text-purple-400 hover:underline">สาวรับงาน${provinceName}</a> &raquo; 
            <span class="text-gray-200">${displayName}</span>
        </nav>

        <main class="p-4 space-y-6">
            <section class="text-center">
                <img src="${lcpImageUrl}" 
                     ${imageSrcSet ? `srcset="${imageSrcSet}" sizes="(max-width: 600px) 100vw, 400px"` : ''}
                     class="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl border border-gray-800 mx-auto" 
                     alt="${displayName} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" 
                     loading="eager" fetchpriority="high" width="400" height="533">
                <h1 class="text-2xl font-black mt-4">${pageTitle}</h1>
                <div class="flex items-center justify-center gap-2 mt-2 text-yellow-400 font-bold text-sm">
                    <span>⭐ ${ratingValue}</span>
                    <span class="text-gray-400 font-normal">(${reviewCount} รีวิว)</span>
                </div>
            </section>

            <div class="grid grid-cols-2 gap-3">
                <div class="bg-purple-950/40 border border-purple-500/20 p-3 rounded-xl text-center">
                    <span class="text-xs text-purple-300 font-bold block">ค่าขนม</span>
                    <span class="text-xl font-black text-green-400">${displayPrice}</span>
                </div>
                <div class="bg-purple-950/40 border border-purple-500/20 p-3 rounded-xl text-center">
                    <span class="text-xs text-purple-300 font-bold block">อายุ</span>
                    <span class="text-xl font-black text-white">${ageVal} ปี</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="bg-gray-800/40 p-3 rounded-lg border border-gray-800 flex justify-between"><span class="text-gray-400">สัดส่วน</span><strong>${bwhVal}</strong></div>
                <div class="bg-gray-800/40 p-3 rounded-lg border border-gray-800 flex justify-between"><span class="text-gray-400">ส่วนสูง</span><strong>${heightVal} ซม.</strong></div>
            </div>

            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-800 text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                ${escapeHTML(naturalDescriptionText)}
            </div>

            <a href="${finalLineUrl}" class="block w-full py-3 text-center bg-green-600 hover:bg-green-500 text-white font-black text-lg rounded-full shadow-lg transition" rel="nofollow noopener" target="_blank">
                💬 ทักไลน์จองคิว${displayName}
            </a>

            <section class="border-t border-gray-800 pt-4">
                <h2 class="text-lg font-bold mb-3 text-purple-400">รีวิวจากผู้ใช้บริการ</h2>
                <div class="space-y-3">
                    ${dynamicReviews.map(t => `
                        <div class="bg-gray-800/30 p-3 rounded-xl border border-gray-800 text-xs">
                            <strong class="text-white block mb-1">${escapeHTML(t.name)}</strong>
                            <p class="text-gray-300">${escapeHTML(t.text)}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
        </main>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "X-XSS-Protection": "1; mode=block"
            }
        });

    } catch (err) {
        console.error("Bot rendering crash:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
};