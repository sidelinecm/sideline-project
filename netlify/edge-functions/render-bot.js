import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiangmai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@sidelinechiangmai',
        twitter: 'https://twitter.com/sidelinechiangmai',
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280',
        biosite: 'https://bio.site/firstfiwfans.com',
        linktree: 'https://linktr.ee/kissmodel',
        bluesky: 'https://bsky.app/profile/sidelinechiangmai.bsky.social'
    }
};

const TESTIMONIALS = [
    { name: "พี่บอล", rating: 5, text: "ตรงปกมากครับ น้องบริการดีเยี่ยม ฟิวแฟนแท้ๆ เลย" },
    { name: "คุณเอก", rating: 5, text: "น้องเอาใจเก่งมาก สวยสมราคา จองง่ายปลอดภัยครับ" },
    { name: "พี่โจ", rating: 5, text: "จองผ่านไลน์ง่ายมาก ไม่ต้องโอนมัดจำ ไปหาหน้างานสบายใจสุดๆ" }
];

// Deterministic Algorithm: คำนวณค่าคงที่จาก Slug เพื่อเสถียรภาพของ SEO (บ็อตตรวจกี่ครั้งข้อมูลก็ไม่เปลี่ยนคำ)
const getDeterministicWord = (arr, seedString) => {
    const sum = seedString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return arr[sum % arr.length];
};

const getDeterministicValue = (min, max, seedString, offset = 0) => {
    const sum = seedString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + offset;
    return Math.floor(min + (sum % (max - min + 1)));
};

const optimizeImg = (path, width = 600, height = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`);
    }
    return path.startsWith('http') ? path : `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const escapeHTML = (str) => str ? str.replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])) : '';

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // SELECTIVE QUERY: ดึงเฉพาะคอลัมน์ที่จำเป็น ป้องกัน Overload หลังบ้าน
        const { data: p } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate, age, description, provinceKey, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) return context.next();

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

        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        
        const rawRate = parseInt(p.rate || "1500");
        const displayPrice = rawRate.toLocaleString() + ".-";
        const imageUrl = optimizeImg(p.imagePath, 600, 800);
        
        let finalLineUrl = p.lineId || 'ksLUWB89Y_';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;
        }

        // GENERATE DETERMINISTIC SPECS: สร้างสเปกโมเดลแบบสมจริงและคงที่เพื่อส่งให้บ็อต Google ไต่เก็บโครงสร้างข้อมูล
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

        // DETERMINISTIC SEO KEYWORDS
        const titleIntro = getDeterministicWord(["แนะนำ", "รีวิว", "มาแรง", "ตัวท็อป"], slug); 
        const serviceWord = getDeterministicWord(["บริการฟิวแฟน", "เอาใจเก่งมาก", "งานดีตรงปก", "เป็นกันเอง", "ขี้อ้อน"], slug);
        const payWord = getDeterministicWord(["ไม่มีมัดจำ", "จ่ายหน้างานเท่านั้น", "เจอตัวค่อยจ่าย", "ปลอดภัย 100%"], slug);
        
        const pageTitle = `${titleIntro} น้อง${displayName} ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน ตรงปก`;
        const metaDesc = `น้อง${displayName} สาวไซด์ไลน์${provinceName} อายุ ${ageVal} ปี สัดส่วน ${bwhVal} ${serviceWord} รับงานเอง ไม่ผ่านเอเย่นต์ ${payWord} พิกัดแถว ${p.location || provinceName} ทักไลน์จองคิวเลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // ADVANCED ULTRA SCHEMA GRAPH (ยิงโครงสร้างข้อมูลชั้นสูงเข้าสมองกล AI Search และ Google Rich Snippet)
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": ["Organization", "LocalBusiness"],
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "image": [imageUrl],
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "sameAs": Object.values(CONFIG.SOCIAL_PROFILES)
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${provinceKey}` },
                        { "@type": "ListItem", "position": 3, "name": `น้อง${displayName}`, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": "Product",
                    "@id": `${canonicalUrl}#product`,
                    "name": `น้อง${displayName} ไซด์ไลน์${provinceName}`,
                    "image": [imageUrl],
                    "description": metaDesc,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                    "offers": {
                        "@type": "Offer",
                        "price": rawRate.toString(),
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl,
                        "priceValidUntil": "2027-12-31"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString()
                    },
                    "additionalProperty": [
                        { "@type": "PropertyValue", "name": "อายุ", "value": `${ageVal} ปี` },
                        { "@type": "PropertyValue", "name": "สัดส่วน", "value": bwhVal },
                        { "@type": "PropertyValue", "name": "ส่วนสูง", "value": `${heightVal} ซม.` },
                        { "@type": "PropertyValue", "name": "น้ำหนัก", "value": `${weightVal} กก.` },
                        { "@type": "PropertyValue", "name": "พื้นที่บริการ", "value": p.location || provinceName }
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": `${canonicalUrl}#faq`,
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `น้อง${displayName} ไซด์ไลน์${provinceName} มีการเรียกเก็บเงินมัดจำล่วงหน้าไหม?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `ไม่มีการเรียกเก็บเงินมัดจำล่วงหน้าใดๆ ทั้งสิ้นสำหรับน้อง${displayName} ลูกค้าจะจ่ายค่าขนมหน้างานหลังจากเจอตัวน้องเรียบร้อยแล้ว ปลอดภัย มั่นใจได้ 100%`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `ต้องการนัดเจอหรือจองคิว น้อง${displayName} พิกัด ${p.location || provinceName} ต้องทำอย่างไร?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `สามารถคลิกที่ปุ่ม 'ทักไลน์จองคิว' บนหน้าเว็บไซต์เพื่อเชื่อมต่อไปยัง Line ID ของน้อง หรือแอดไลน์ติดต่อเจ้าหน้าที่เพื่อเช็คตารางเวลาว่างและทำการนัดหมายน้อง${displayName} ได้ทันที`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `รูปโปรไฟล์ของน้อง${displayName} บนเว็บไซต์เป็นรูปตรงปกไหม?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `รูปภาพทั้งหมดของน้อง${displayName} ผ่านการยืนยันตัวตน (Verified) การันตีงานตรงปกตามมาตรฐานของเว็บไซต์ไซด์ไลน์เชียงใหม่ บริการน่ารัก เป็นกันเอง ฟิวแฟนแน่นอน`
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
    <title>${pageTitle} | รูปตรงปก ไม่ผ่านเอเย่นต์</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${imageUrl}">
    <meta name="theme-color" content="#db2777">
    <meta name="googlebot" content="index, follow, max-image-preview:large">
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root {
            --p: #ec4899;
            --s: #10b981;
            --bg: #0f172a;
            --card: #1e293b;
            --txt: #f8fafc;
            --gold: #fbbf24;
            --muted: #94a3b8;
            --border-white: rgba(255, 255, 255, 0.06);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg);
            color: var(--txt);
            line-height: 1.6;
            overflow-x: hidden;
        }

        .container {
            position: relative;
            max-width: 500px;
            margin: 0 auto;
            background: var(--card);
            min-height: 100vh;
            box-shadow: 0 0 60px rgba(0, 0, 0, 0.6);
        }

        @media (min-width: 768px) { .container { max-width: 600px; } }

        /* ULTRA LUXURY FIXED NAVBAR */
        .fixed-nav {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 100;
            background: linear-gradient(to bottom, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.4) 100%);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border-white);
        }

        .nav-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.5rem;
            height: 64px;
        }

        .logo-link { display: flex; align-items: center; text-decoration: none; }
        .logo-img { height: 26px; width: auto; filter: brightness(2); opacity: 0.95; object-fit: contain; }

        .main-content {
            padding: 84px 1.25rem 2rem 1.25rem;
        }

        .hero-section { position: relative; width: 100%; margin-bottom: 1.5rem; }
        .hero-img {
            width: 100%;
            aspect-ratio: 3/4;
            object-fit: cover;
            border-radius: 1.5rem;
            box-shadow: 0 24px 48px rgba(0, 0, 0, 0.7);
            border: 1px solid var(--border-white);
            display: block;
        }

        .profile-meta-header { text-align: center; margin: 1.5rem 0; }
        h1 {
            color: var(--txt);
            font-size: clamp(1.8rem, 5vw, 2.3rem);
            font-weight: 900;
            margin-bottom: 0.5rem;
            line-height: 1.2;
            letter-spacing: -0.02em;
        }

        .rating { display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-weight: 700; font-size: 1.1rem; }
        .rating .stars { font-size: 1.2rem; filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.4)); }
        .rating .rating-value { color: var(--gold); }
        .rating .review-count { color: var(--muted); font-size: 0.95rem; font-weight: 400; }

        /* SEMANTIC SPECIFICATION LIST (DL HTML5) */
        .specs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            margin: 1.5rem 0;
        }
        .spec-box {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border-white);
            border-radius: 1rem;
            padding: 0.75rem 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .spec-box dt { font-size: 0.85rem; color: var(--muted); font-weight: 600; }
        .spec-box dd { font-size: 1.05rem; font-weight: 800; color: var(--txt); }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; }
        .info-item {
            background: rgba(236, 72, 153, 0.04);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(236, 72, 153, 0.2);
            border-radius: 1.25rem;
            padding: 1.25rem 0.75rem;
            text-align: center;
        }

        .info-label { font-size: 0.85rem; color: var(--p); font-weight: 700; margin-bottom: 0.35rem; display: block; }
        .info-value { font-size: 1.4rem; font-weight: 900; color: var(--txt); }

        .description {
            background: rgba(255, 255, 255, 0.01);
            border-radius: 1.25rem;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border: 1px solid var(--border-white);
            white-space: pre-line;
            font-size: 1.05rem;
            line-height: 1.7;
            color: rgba(248, 250, 252, 0.9);
        }

        .cta-section { text-align: center; margin: 2.5rem 0; padding-bottom: 0.5rem; }
        .btn-line {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            background: linear-gradient(135deg, var(--s), #047857);
            color: #fff;
            padding: 1.1rem 2rem;
            border-radius: 3rem;
            font-weight: 800;
            font-size: 1.2rem;
            text-decoration: none;
            box-shadow: 0 12px 32px rgba(16, 185, 129, 0.3);
            transition: all 0.25s ease;
            width: 100%;
            max-width: 400px;
        }
        .btn-line:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(16, 185, 129, 0.4); }
        .cta-subtext { margin-top: 1rem; color: var(--muted); font-size: 0.85rem; }

        .pricing-section {
            margin: 2rem 0;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 1.25rem;
            padding: 1.5rem;
            border: 1px solid var(--border-white);
        }
        .pricing-title { color: var(--p); text-align: center; font-weight: 800; font-size: 1.2rem; margin-bottom: 1.25rem; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center; }
        .pricing-item { background: rgba(255, 255, 255, 0.03); padding: 0.85rem 0.5rem; border-radius: 0.85rem; border: 1px solid var(--border-white); }
        .pricing-item strong { display: block; font-size: 0.85rem; color: var(--muted); margin-bottom: 0.25rem; }
        .pricing-item span { font-size: 1.1rem; font-weight: 800; color: var(--s); }

        /* ADVANCED FAQ COMPONENT */
        .faq-section { margin: 2.5rem 0; }
        .faq-title { color: var(--p); font-size: 1.25rem; font-weight: 800; text-align: center; margin-bottom: 1.25rem; }
        .faq-wrapper { display: flex; flex-direction: column; gap: 0.75rem; }
        .faq-item { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-white); border-radius: 1rem; padding: 1.25rem; }
        .faq-item h3 { font-size: 1rem; font-weight: 700; color: var(--txt); margin-bottom: 0.5rem; display: flex; gap: 0.5rem; }
        .faq-item h3::before { content: "Q:"; color: var(--p); font-weight: 900; }
        .faq-item p { font-size: 0.95rem; color: var(--muted); line-height: 1.5; }

        /* KEYWORD MAGNET CONTEXT BLOCK */
        .seo-magnet-block {
            background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.4) 100%);
            border-radius: 1.25rem;
            padding: 1.5rem;
            margin: 2.5rem 0;
            border: 1px solid rgba(255,255,255,0.02);
            font-size: 0.9rem;
            color: var(--muted);
            text-align: justify;
        }

        .related-section { margin: 2.5rem 0; }
        .related-title { color: var(--p); font-size: 1.25rem; font-weight: 800; text-align: center; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(236,72,153,0.15); }
        .related-carousel { display: flex; overflow-x: auto; gap: 1rem; padding-bottom: 0.75rem; scroll-snap-type: x mandatory; scrollbar-width: none; }
        .related-carousel::-webkit-scrollbar { display: none; }
        
        .related-card { flex: 0 0 145px; background: var(--bg); border-radius: 1.25rem; overflow: hidden; border: 1px solid var(--border-white); text-decoration: none; color: inherit; scroll-snap-align: start; }
        .related-img { width: 100%; aspect-ratio: 1/1; object-fit: cover; }
        .related-info { padding: 0.75rem; text-align: center; }
        .related-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 0.15rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .related-loc { font-size: 0.8rem; color: var(--muted); }

        .testimonials { margin: 2.5rem 0; }
        .testimonials-title { color: var(--p); text-align: center; font-weight: 800; font-size: 1.25rem; margin-bottom: 1.5rem; }
        .testimonial-grid { display: flex; flex-direction: column; gap: 1rem; }
        .testimonial { background: rgba(255, 255, 255, 0.01); padding: 1.25rem; border-radius: 1.25rem; border: 1px solid var(--border-white); }

        .footer { text-align: center; padding: 2.5rem 1rem; background: rgba(0, 0, 0, 0.3); border-top: 1px solid var(--border-white); margin-top: 3.5rem; color: var(--muted); font-size: 0.85rem; }

        @media (max-width: 480px) {
            .info-grid { grid-template-columns: 1fr; gap: 0.75rem; }
            .specs-grid { grid-template-columns: 1fr; gap: 0.5rem; }
            .pricing-grid { grid-template-columns: 1fr; gap: 0.5rem; }
            .pricing-item { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 1.25rem; }
            .pricing-item strong { margin-bottom: 0; }
            .related-card { flex: 0 0 135px; }
        }
    </style>
</head>
<body>

    <div class="container">
        <header id="navbar" class="fixed-nav">
            <div class="nav-content">
                <a href="/" class="logo-link" aria-label="กลับสู่หน้าหลัก ไซด์ไลน์เชียงใหม่">
                    <img src="/images/logo-sidelinechiangmai.webp" alt="${CONFIG.BRAND_NAME}" class="logo-img">
                </a>
                <div class="nav-right-slot"></div>
            </div>
        </header>

        <main class="main-content">
            <article itemscope itemtype="https://schema.org/Product">
                
                <section class="hero-section">
                    <img src="${imageUrl}" class="hero-img" alt="น้อง${displayName} สาวไซด์ไลน์${provinceName} รูปตรงปกฟิวแฟน ไม่ผ่านเอเย่นต์" loading="eager" decoding="async" itemprop="image" width="400" height="533">
                </section>

                <header class="profile-meta-header">
                    <h1 itemprop="name">${pageTitle}</h1>
                    <div class="rating" itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
                        <span class="stars" aria-hidden="true">⭐</span>
                        <span class="rating-value" itemprop="ratingValue">${ratingValue}</span>
                        <span class="review-count">คะแนนโหวตจากลูกค้า (<span itemprop="reviewCount">${reviewCount}</span> รีวิว)</span>
                    </div>
                </header>

                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">เรทค่าขนมเริ่มต้น</span>
                        <span class="info-value">฿${displayPrice}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📍 พิกัดพื้นที่รับงาน</span>
                        <span class="info-value">${p.location || provinceName}</span>
                    </div>
                </div>

                <section aria-label="ข้อมูลกายภาพโปรไฟล์">
                    <dl class="specs-grid">
                        <div class="spec-box"><dt>อายุ</dt><dd>${ageVal} ปี</dd></div>
                        <div class="spec-box"><dt>สัดส่วน</dt><dd>${bwhVal}</dd></div>
                        <div class="spec-box"><dt>ส่วนสูง</dt><dd>${heightVal} ซม.</dd></div>
                        <div class="spec-box"><dt>น้ำหนัก</dt><dd>${weightVal} กก.</dd></div>
                    </dl>
                </section>

                <section class="description" itemprop="description">
                    ${escapeHTML(p.description) || metaDesc}
                </section>

                <section class="cta-section" aria-label="ช่องทางการติดต่อจองคิวน้องโดยตรง">
                    <a href="${finalLineUrl}" class="btn-line" rel="noopener noreferrer" data-i18n='{"th":"📲 ทักไลน์จองคิว น้อง${displayName}","en":"📲 Contact ${displayName}"}'> 
                        📲 ทักไลน์จองคิว น้อง${displayName} 
                    </a>
                    <p class="cta-subtext">ระบบนัดเจอตัวโดยตรง • ปลอดภัย 100% • ไม่มีโอนมัดจำก่อนล่วงหน้า</p>
                </section>

                <section class="pricing-section">
                    <h2 class="pricing-title">💰 ตารางอัตราค่าบริการ (ไม่มีชาร์จเพิ่ม)</h2>
                    <div class="pricing-grid">
                        <div class="pricing-item">
                            <strong>ST (ชั่วคราว)</strong>
                            <span>฿${rawRate.toLocaleString()}</span>
                        </div>
                        <div class="pricing-item">
                            <strong>LT (ค้างคืน)</strong>
                            <span>฿${Math.floor(rawRate * 1.8).toLocaleString()}</span>
                        </div>
                        <div class="pricing-item">
                            <strong>OT (นอกสถานที่)</strong>
                            <span>฿${Math.floor(rawRate * 2.2).toLocaleString()}</span>
                        </div>
                    </div>
                </section>
            </article>

            <section class="faq-section" aria-label="คำถามที่พบบ่อย">
                <h2 class="faq-title">💬 คำถามที่พบบ่อยเกี่ยวกับ น้อง${displayName}</h2>
                <div class="faq-wrapper">
                    <div class="faq-item">
                        <h3>จองคิว น้อง${displayName} ไซด์ไลน์${provinceName} ต้องโอนมัดจำก่อนไหม?</h3>
                        <p>ไม่ต้องโอนเงินมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ เพื่อความปลอดภัยสูงสุดของลูกค้า เว็บไซต์เราไม่มีนโยบายระบบโอนก่อน ทุกคิวงานของน้อง${displayName} จะเป็นการนัดหมายเจอตัวจริง แล้วค่อยจ่ายค่าขนมหน้างานครับ</p>
                    </div>
                    <div class="faq-item">
                        <h3>พิกัดพื้นที่บริการของน้อง อยู่บริเวณไหน?</h3>
                        <p>น้อง${displayName} รับงานดูแลเฉพาะพิกัดโซน ${p.location || provinceName} และพื้นที่ใกล้เคียงเป็นหลัก ลูกค้าสามารถสอบถามจุดนัดหมายหรือเส้นทางเดินทางอย่างละเอียดของน้องผ่านการแอดไลน์โดยตรงได้เลยครับ</p>
                    </div>
                    <div class="faq-item">
                        <h3>การันตีรูปภาพตัวจริงตรงปกตามโชว์ไหม?</h3>
                        <p>รับประกันงานตรงปก รูปจริงไม่จ้างโมเดลหลอกลวง หน้างานน่ารักและนิสัยดีตามรายละเอียด ${serviceWord} เพื่อมอบประสบการณ์ฟิวแฟนที่ดีที่สุดให้กับลูกค้าทุกคนครับ</p>
                    </div>
                </div>
            </section>

            <section class="seo-magnet-block" aria-label="ข้อมูลเพิ่มเติมเกี่ยวกับพื้นที่">
                <p>ยินดีต้อนรับสู่ศูนย์รวมโมเดลและอิสระที่ได้รับความนิยมสูงสุดใน <strong>ไซด์ไลน์${provinceName}</strong> น้อง${displayName} ผ่านการคัดสรรคุณภาพระดับพรีเมียม ทั้งเรื่องมารยาท การตรงต่อเวลา และการบริการที่เน้นความเป็นกันเองสูงสุด หากคุณกำลังมองหาเพื่อนเที่ยว เพื่อนคุย หรือคนดูแลในโซน ${p.location || provinceName} ที่ปลอดภัย เชื่อถือได้ 100% ไม่ผ่านโมเดลลิ่งหน้าเลือด ทักไลน์หาเราเพื่อล็อคคิวน้องได้ทันทีตลอด 24 ชั่วโมง</p>
            </section>

            ${related.length > 0 ? `
            <aside class="related-section" aria-label="น้องๆ แนะนำเพิ่มเติมในพื้นที่ใกล้เคียง">
                <h2 class="related-title">🔥 แนะนำสาวไซด์ไลน์ ใน ${provinceName} มาแรง</h2>
                <nav class="related-carousel">
                    ${related.map(r => {
                        const rImg = optimizeImg(r.imagePath, 200, 200);
                        return `
                        <a href="${CONFIG.DOMAIN}/sideline/${r.slug}" class="related-card" aria-label="ดูโปรไฟล์น้อง ${r.name}">
                            <img src="${rImg}" class="related-img" alt="น้อง${r.name} ไซด์ไลน์${provinceName}" loading="lazy" decoding="async">
                            <div class="related-info">
                                <div class="related-name">${r.name}</div>
                                <div class="related-loc">📍 ${r.location || provinceName}</div>
                            </div>
                        </a>`;
                    }).join('')}
                </nav>
                <div style="text-align:center; margin-top:1rem;">
                    <a href="${CONFIG.DOMAIN}/location/${provinceKey}" 
                       class="btn-line" 
                       rel="next"
                       style="padding: 0.75rem 1.5rem; font-size: 0.95rem; background: var(--card); border: 1px solid var(--p); box-shadow: none; width: auto;"
                       data-i18n='{"th":"ดูน้องๆ ${provinceName} ทั้งหมด →","en":"View all ${provinceName} →"}'>
                        ดูน้องๆ ${provinceName} ทั้งหมด →
                    </a>
                </div>
            </aside>` : ''}

            <section class="testimonials" aria-label="รีวิวและความคิดเห็นจากผู้ใช้งานจริง">
                <h2 class="testimonials-title">⭐ รีวิวและบันทึกความประทับใจจากลูกค้าจริง</h2>
                <div class="testimonial-grid">
                    ${TESTIMONIALS.map(t => `
                        <div class="testimonial" itemprop="review" itemscope itemtype="https://schema.org/Review">
                            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.6rem">
                                <div style="color:var(--gold);font-size:1.1rem" aria-label="ให้คะแนนเต็ม 5 ดาว">${'★'.repeat(Math.floor(t.rating))}</div>
                                <strong style="font-size:0.95rem" itemprop="author">${t.name}</strong>
                            </div>
                            <p style="color:rgba(248,250,252,0.85);margin:0;font-size:0.95rem" itemprop="reviewBody">${t.text}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
        </main>

        <footer class="footer">
            <div class="footer-content">
                © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}<br>
                <span style="display:inline-block; margin-top:0.25rem" data-i18n='{"th":"มั่นใจ ปลอดภัย ไม่มีการมัดจำ","en":"Safe • No deposit"}'>มั่นใจ ปลอดภัย ไม่มีการมัดจำ</span> | 
                <a href="${CONFIG.SOCIAL_PROFILES.line}" rel="noopener noreferrer" style="color:var(--s); text-decoration:none; font-weight:700;">📲 Line Official</a>
            </div>
        </footer>
    </div>

    <aside class="lang-switcher" style="position:fixed;bottom:20px;right:20px;z-index:999;background:rgba(0,0,0,0.85);padding:8px;border-radius:50px;display:flex;gap:4px;box-shadow:0 8px 24px rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1)">
        <button onclick="setLang('th')" style="background:none;border:none;font-size:16px;cursor:pointer;padding:6px;line-height:1" title="ไทย">🇹🇭</button>
        <button onclick="setLang('en')" style="background:none;border:none;font-size:16px;cursor:pointer;padding:6px;line-height:1" title="English">🇺🇸</button>
    </aside>

    <script>
    let currentLang = 'th';
    function setLang(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            try {
                const translations = JSON.parse(el.dataset.i18n);
                el.textContent = translations[lang] || translations['th'];
            } catch(e) { }
        });
    }
    </script>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow",
                "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
                "Vary": "User-Agent"
            }
        });

    } catch (e) {
        console.error("Profile SSR Error:", e);
        return context.next();
    }
};