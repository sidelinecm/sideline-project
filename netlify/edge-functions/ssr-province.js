import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    LOGO: 'https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path, width = 600) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/c_scale,w_${width},q_auto,f_auto/`);
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai':['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค'],
        'khon-kaen':['มข.', 'กังสดาล', 'ริมบึงแก่นนคร', 'หลังมอ', 'เซ็นทรัลขอนแก่น'],
        'phuket':['ป่าตอง', 'กะตะ', 'กะรน', 'ตัวเมืองภูเก็ต', 'ฉลอง', 'ราไวย์'],
        'udonthani':['ยูดีทาวน์', 'เซ็นทรัลอุดร', 'หนองประจักษ์', 'โพศรี'],
        'chiangrai':['บ้านดู่', 'หอนาฬิกา', 'ริมกก', 'มฟล.']
    };
    return zones[provinceKey.toLowerCase()] ||['ย่านใจกลางเมือง', 'พื้นที่ใกล้เคียง'];
};

const fetchWithTimeout = (promise, ms = 5000) => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Database Request Timeout')), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

export default async (request, context) => {
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const [provinceRes, profilesRes] = await fetchWithTimeout(
            Promise.all([
                supabase.from('provinces').select('nameThai, key').eq('key', provinceKey).maybeSingle(),
                supabase.from('profiles')
                        .select('slug, name, imagePath, location, rate, isfeatured, availability')
                        .eq('provinceKey', provinceKey)
                        .eq('active', true)
                        .order('isfeatured', { ascending: false })
                        .order('lastUpdated', { ascending: false })
            ]),
            5000 
        );

        const provinceData = provinceRes?.data;
        const profiles = profilesRes?.data ||[];

        if (!provinceData || profiles.length === 0) return context.next();

        const provinceName = provinceData.nameThai;
        const profileCount = profiles.length;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        const YEAR_TH = new Date().getFullYear() + 543;
        const DYNAMIC_BRAND = `Sideline ${provinceName}`;

        const prices = profiles.map(p => {
            const val = parseInt((p.rate || "1500").toString().replace(/\D/g, ''));
            return (val > 20000 || val < 500) ? 1500 : val;
        });
        const minPrice = prices.length > 0 ? Math.min(...prices) : 1500;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 3000;

        const pageTitle = `พิกัดไซด์ไลน์${provinceName} รับงานเอง น้องๆ ${profileCount} คน โซน${randomZone} งานดีตรงปก (${YEAR_TH})`;
        const metaDesc = `รวมไซด์ไลน์${provinceName} ${profileCount} คน อัปเดตล่าสุด ${YEAR_TH} ครอบคลุมโซน ${localZones.slice(0, 4).join(', ')} คัดคนสวย รับงานเอง ฟิวแฟน รูปตรงปก ไม่มัดจำ จ่ายหน้างาน`;
        const canonicalUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const ogImage = optimizeImg(profiles[0]?.imagePath, 800);

        const faqData =[
            { q: `ไซด์ไลน์${provinceName} ต้องโอนมัดจำก่อนไหม?`, a: `เราให้ความสำคัญกับความปลอดภัยของลูกค้าเป็นหลัก ไม่มีนโยบายโอนมัดจำก่อน ลูกค้าทุกคนสามารถจองคิวและจ่ายเงินหน้างานได้ทันทีเมื่อพบตัวน้องครับ` },
            { q: `บริการไซด์ไลน์${provinceName} ปลอดภัยไหม?`, a: `เราคัดกรองน้องๆ ที่รับงานเองโดยตรง การันตีความเป็นมืออาชีพ ปลอดภัย และตรงปก 100% เพื่อประสบการณ์ที่ดีที่สุดของลูกค้า` },
            { q: `ทำไมต้องจองผ่านเว็บ Sideline ${provinceName}?`, a: `เราเป็นศูนย์รวมสาวสวยที่คัดคุณภาพตรงปก มีระบบรีวิวและสถานะการรับงานที่เป็นปัจจุบัน พร้อมช่วยเหลือลูกค้าตลอด 24 ชั่วโมง` }
        ];

        // 🌟 Schema จัดเต็ม ครอบคลุมทุกมิติ
        const schema = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "CollectionPage",
                    "@id": `${canonicalUrl}#webpage`,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc,
                    "inLanguage": "th-TH"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement":[
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": faqData.map(f => ({
                        "@type": "Question",
                        "name": f.q,
                        "acceptedAnswer": { "@type": "Answer", "text": f.a }
                    }))
                },
                {
                    "@type": "Service",
                    "@id": `${canonicalUrl}#service`,
                    "name": `บริการเพื่อนเที่ยวและไซด์ไลน์ ${provinceName}`,
                    "provider": { "@type": "Organization", "name": DYNAMIC_BRAND },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": (150 + profileCount * 5).toString()
                    },
                    "offers": {
                        "@type": "AggregateOffer",
                        "lowPrice": minPrice.toString(),
                        "highPrice": maxPrice.toString(),
                        "priceCurrency": "THB",
                        "offerCount": profileCount.toString()
                    }
                },
                {
                    "@type": "ItemList",
                    "numberOfItems": profileCount,
                    "itemListElement": profiles.slice(0, 20).map((p, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`
                    }))
                }
            ]
        };

        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#db2777">
    
    <!-- Meta Tags สำหรับ Social Share (LINE/FB) -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${DYNAMIC_BRAND}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${ogImage}">

    <link rel="preload" as="image" href="${optimizeImg(profiles[0]?.imagePath, 400)}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    <style>
        :root { --p: #db2777; --bg: #0f172a; --card: #1e293b; --txt: #f8fafc; }
        body { font-family: 'Prompt', sans-serif; background: var(--bg); color: var(--txt); margin: 0; }
        main { max-width: 1100px; margin: 0 auto; padding: 30px 20px; }
        h1 { font-size: 32px; font-weight: 900; margin-bottom: 10px; color: #fff; }
        h2 { font-size: 24px; color: #fff; margin-top: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
        .card { background: var(--card); border-radius: 16px; padding: 15px; text-decoration: none; color: white; border: 1px solid rgba(255,255,255,0.05); }
        .card:hover { border-color: var(--p); transform: translateY(-5px); transition: 0.3s; }
        .price { color: #fbbf24; font-weight: 900; font-size: 18px; }
        .faq-section { margin-top: 60px; padding: 30px; background: rgba(255,255,255,0.03); border-radius: 16px; }
        footer { text-align: center; padding: 40px; color: #64748b; font-size: 12px; }
    </style>
</head>
<body>
    <main>
        <section>
            <h1>ไซด์ไลน์${provinceName} รับงานเอง</h1>
            <p>ศูนย์รวมสาวสวย <strong>รับงาน${provinceName}</strong> เพื่อนเที่ยว ฟิวแฟน และน้องๆ เอนเตอร์เทนในย่าน ${localZones.slice(0, 5).join(', ')} การันตีตรงปก 100% ปลอดภัย จ่ายเงินหน้างานเท่านั้น</p>
        </section>

        <h2>รายชื่อน้องๆ ไซด์ไลน์ ${provinceName} แนะนำ</h2>
        <section class="grid">
            ${profiles.map(p => {
                const numericPrice = (parseInt((p.rate || "1500").toString().replace(/\D/g, '')) > 20000) ? 1500 : parseInt((p.rate || "1500").toString().replace(/\D/g, '')) || 1500;
                return `
                <a href="/sideline/${p.slug}" class="card" aria-label="ดูโปรไฟล์น้อง ${p.name}">
                    <img src="${optimizeImg(p.imagePath, 400)}" alt="${p.name} ไซด์ไลน์${provinceName}" loading="lazy" width="300" height="400" style="width:100%; height:auto; aspect-ratio:3/4; object-fit:cover; border-radius:8px;">
                    <h3 style="font-size:16px; margin: 10px 0 5px 0;">${p.name}</h3>
                    <p class="price">฿${numericPrice.toLocaleString()}</p>
                </a>`;
            }).join('')}
        </section>

        <section class="faq-section">
            <h2>คำถามที่พบบ่อย (FAQ) เกี่ยวกับไซด์ไลน์ ${provinceName}</h2>
            ${faqData.map(f => `
                <div style="margin-bottom:20px;">
                    <p style="font-weight:800; color:var(--p); margin-bottom:5px;">Q: ${f.q}</p>
                    <p style="color:#cbd5e1; font-size:14px;">A: ${f.a}</p>
                </div>
            `).join('')}
        </section>

        <footer>
            <p>© ${YEAR_TH} ${DYNAMIC_BRAND} - แพลตฟอร์มไซด์ไลน์ที่น่าเชื่อถือที่สุดในไทย</p>
            <p>Disclaimer: เว็บไซต์นี้จัดทำเพื่อการโฆษณาเท่านั้น ไม่เกี่ยวข้องกับการค้าประเวณีหรือกิจกรรมผิดกฎหมาย</p>
        </footer>
    </main>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8", 
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" 
            } 
        });
    } catch (e) { 
        console.error("SSR Province Error:", e.message);
        return context.next(); 
    }
};