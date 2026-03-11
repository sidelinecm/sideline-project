import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    LOGO: 'https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp',
    ADMIN_LINE: '@sidelinecm',
    PHONE: '098-xxx-xxxx'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path, width = 400, height = 533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/placeholder-profile.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/c_fill,w_${width},h_${height},g_faces,q_auto:best,f_webp/`);
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&format=webp`;
};

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai':['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'ตัวเมืองเชียงใหม่'],
        'khon-kaen':['มข.', 'กังสดาล', 'ริมบึงแก่นนคร', 'หลังมอ', 'เซ็นทรัลขอนแก่น'],
        'phuket':['ป่าตอง', 'กะตะ', 'กะรน', 'ตัวเมืองภูเก็ต', 'ฉลอง', 'ราไวย์'],
        'udonthani':['ยูดีทาวน์', 'เซ็นทรัลอุดร', 'หนองประจักษ์', 'โพศรี'],
        'chiangrai':['บ้านดู่', 'หอนาฬิกา', 'ริมกก', 'มฟล.']
    };
    return zones[provinceKey.toLowerCase()] ||['ย่านใจกลางเมือง', 'พื้นที่ใกล้เคียง'];
};

const fetchWithTimeout = (promise, ms = 4000) => {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Request Timeout')), ms));
    return Promise.race([promise, timeout]);
};

export default async (request, context) => {
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

        const supabaseUrl = typeof Netlify !== 'undefined' ? Netlify.env.get('SUPABASE_URL') || CONFIG.SUPABASE_URL : CONFIG.SUPABASE_URL;
        const supabaseKey = typeof Netlify !== 'undefined' ? Netlify.env.get('SUPABASE_KEY') || CONFIG.SUPABASE_KEY : CONFIG.SUPABASE_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const [provinceRes, profilesRes] = await Promise.allSettled([
            fetchWithTimeout(supabase.from('provinces').select('nameThai, key').eq('key', provinceKey).maybeSingle()),
            fetchWithTimeout(supabase.from('profiles')
                .select('slug, name, imagePath, location, rate, isfeatured, availability, styleTags, age, stats, height, weight, skinTone, description')
                .eq('provinceKey', provinceKey)
                .eq('active', true)
                .order('isfeatured', { ascending: false })
                .order('lastUpdated', { ascending: false }))
        ]);

        const provinceData = provinceRes.status === 'fulfilled' ? provinceRes.value.data : null;
        const profiles = profilesRes.status === 'fulfilled' ? profilesRes.value.data || [] : [];

        if (!provinceData || profiles.length === 0) return context.next();

        const provinceName = provinceData.nameThai;
        const profileCount = profiles.length;
        const localZones = getLocalZones(provinceKey);
        const CURRENT_YEAR = new Date().getFullYear() + 543;
        const BRAND_NAME = `Sideline ${provinceName}`;

        const prices = profiles.map(p => parseInt((p.rate || "1500").toString().replace(/\D/g, ''))).filter(p => p > 0 && p <= 30000);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 1500;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 5000;

        // ✅ NEW: Standard Pricing Packages
        const pricingPackages = [
            { name: 'Quick', time: '40นาที', shots: '1', price: '1,300฿', include: 'Free condom+room' },
            { name: 'Standard', time: '60นาที', shots: '1', price: '1,800฿', include: 'Free condom+room+นวด' },
            { name: 'Premium', time: '90นาที', shots: '2', price: '2,300฿', include: 'Free everything + ฟิวแฟน' }
        ];

        const pageTitle = `ไซด์ไลน์${provinceName} รับงานเอง ตัวท็อป ${profileCount} คน (${CURRENT_YEAR}) ตรงปก ไม่มีมัดจำ`;
        const metaDesc = `รวมสาวสวย ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟนแท้ๆ อัปเดตล่าสุด ${profileCount} คน โซน${localZones.slice(0, 3).join(', ')} การันตีตรงปก 100% ปลอดภัย ชำระเงินหน้างาน`;

        // ✅ ENHANCED FAQ + Business Info
        const faqData = [
            { q: `บริการไซด์ไลน์${provinceName} มีการเก็บเงินมัดจำล่วงหน้าหรือไม่?`, a: `แพลตฟอร์มของเราให้ความสำคัญกับความปลอดภัย เรายืนยันว่า "ไม่มีมัดจำ" ลูกค้าสามารถนัดหมายและ "ชำระเงินหน้างานเท่านั้น" เมื่อได้เจอน้องตัวจริง` },
            { q: `มั่นใจได้อย่างไรว่าน้องๆ ที่รับงานจะ "ตรงปก"?`, a: `เรามีการตรวจสอบและคัดกรองโปรไฟล์อย่างเข้มงวด การันตี "ตรงปก 100%" หากนัดเจอแล้วหน้าตาไม่ตรงรูป สามารถยกเลิกได้ทันทีไม่มีค่าใช้จ่าย` },
            { q: `Sideline ${provinceName} คือเว็บอะไร?`, a: `เราเป็น #1 ศูนย์รวมไซด์ไลน์${provinceName} อัปเดตทุกวัน 10+ ปี รับงานเอง ไม่ผ่านเอเย่นต์ รีวิว 5,000+ ลูกค้า บริการ 24/7` },
            { q: `วิธีใช้งานเว็บไซต์ของเรา?`, a: `1.เลือกน้องที่ชอบ 2.แชท Line หรือโทร 3.นัดเวลา-สถานที่ 4.เจอตัวจริง จ่ายเงินหน้างาน บริการเสร็จแยกทาง` },
            { q: `การชำระเงินและการรับประกัน?`, a: `เงินสดหน้างานเท่านั้น (ไม่รับโอน/บัตร) หากมีปัญหาแจ้ง Admin ${CONFIG.ADMIN_LINE} ภายใน 30นาที คืนเงิน 50-100%` }
        ];

        const canonicalUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const ogImage = optimizeImg(profiles[0]?.imagePath, 800, 600);

        const schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "@id": `${canonicalUrl}#webpage`,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc,
                    "inLanguage": "th-TH",
                    "publisher": {
                        "@type": "Organization",
                        "name": BRAND_NAME,
                        "url": CONFIG.DOMAIN,
                        "logo": CONFIG.LOGO,
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "contactType": "customer service",
                            "telephone": CONFIG.PHONE,
                            "url": `https://line.me/ti/p/~${CONFIG.ADMIN_LINE.replace('@', '')}`
                        }
                    }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
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
                    "@type": "LocalBusiness",
                    "@id": `${canonicalUrl}#business`,
                    "name": `ศูนย์รวมไซด์ไลน์ ${provinceName} รับงานเอง`,
                    "image": ogImage,
                    "priceRange": `฿${minPrice} - ฿${maxPrice}`,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": provinceName,
                        "addressCountry": "TH"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": (350 + profileCount * 3).toString()
                    },
                    "offers": pricingPackages.map(pkg => ({
                        "@type": "Offer",
                        "name": pkg.name,
                        "price": pkg.price.replace('฿', ''),
                        "priceCurrency": "THB",
                        "description": `${pkg.time} ${pkg.shots} shots (${pkg.include})`
                    }))
                },
                {
                    "@type": "ItemList",
                    "numberOfItems": profileCount,
                    "itemListElement": profiles.slice(0, 30).map((p, i) => ({
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
    <meta name="theme-color" content="#0f172a">
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${BRAND_NAME}">
    <meta property="og:locale" content="th_TH">

    <meta name="twitter:card" content="summary_large_image">
    
    <link rel="preload" as="image" href="${optimizeImg(profiles[0]?.imagePath, 400, 533)}" fetchpriority="high">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
    
    <style>
        :root { 
            --p: #db2777; --bg: #0f172a; --bg-alt: #1e293b; 
            --card: #1e293b; --card-hover: #334155;
            --txt: #f8fafc; --txt-muted: #94a3b8; 
            --border: rgba(255,255,255,0.08); --gold: #fbbf24;
            --success: #10b981; --warning: #f59e0b;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Prompt', sans-serif; background: var(--bg); color: var(--txt); line-height: 1.6; -webkit-font-smoothing: antialiased; }
        
        .header-nav { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; padding: 15px 20px; text-align: center; }
        .header-nav img { height: 30px; width: auto; }
        
        .container { max-width: 1280px; margin: 0 auto; padding: 24px 16px; }

        .hero { text-align: center; padding: 30px 0 40px; border-bottom: 1px solid var(--border); margin-bottom: 30px; }
        .hero h1 { font-size: clamp(24px, 5.5vw, 40px); font-weight: 900; margin-bottom: 16px; line-height: 1.4; background: linear-gradient(135deg, #fff, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: clamp(14px, 3.5vw, 18px); color: var(--txt-muted); max-width: 850px; margin: 0 auto; line-height: 1.7; }
        
        .zone-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 20px; }
        .zone-badge { background: rgba(255,255,255,0.05); color: #cbd5e1; padding: 6px 14px; border-radius: 50px; font-size: 13px; border: 1px solid var(--border); }

        .section-title { font-size: clamp(20px, 5vw, 28px); font-weight: 800; margin: 40px 0 20px 0; color: #fff; display: flex; align-items: center; gap: 10px; }
        h2.section-title { margin-top: 0; }

        .grid { display: grid; gap: clamp(12px, 3vw, 24px); grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 640px) { .grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1280px) { .grid { grid-template-columns: repeat(5, 1fr); } }

        .card { background: var(--card); border-radius: 16px; overflow: hidden; text-decoration: none; color: white; display: flex; flex-direction: column; border: 1px solid var(--border); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }
        .card:hover { transform: translateY(-6px); border-color: var(--p); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); background: var(--card-hover); }
        
        .card-img-wrap { width: 100%; aspect-ratio: 3/4; position: relative; overflow: hidden; background: #000; }
        .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .card:hover .card-img-wrap img { transform: scale(1.05); }
        
        .badge-status { position: absolute; top: 10px; left: 10px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; color: #fff; backdrop-filter: blur(4px); box-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 2; }
        .badge-avail { background: rgba(16, 185, 129, 0.9); }
        .badge-busy { background: rgba(239, 68, 68, 0.9); }

        .card-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; flex-grow: 1; }
        .card-header { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .card-name { font-weight: 800; font-size: clamp(15px, 4vw, 18px); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff; }
        .card-price { color: var(--gold); font-size: clamp(14px, 3.5vw, 16px); font-weight: 800; margin: 0; flex-shrink: 0; }
        
        .card-specs { display: flex; gap: 6px; font-size: 11px; color: #cbd5e1; flex-wrap: wrap; }
        .card-specs span { background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 4px; }
        
        .card-location { color: var(--txt-muted); font-size: 12px; display: flex; align-items: center; gap: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .card-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
        .card-tag { background: rgba(219,39,119,0.15); color: #f472b6; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
        .card-tag-safe { background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; }

        /* ✅ NEW SECTIONS STYLES */
        .section { background: rgba(30, 41, 59, 0.6); border-radius: 20px; padding: 24px; margin-bottom: 24px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
        
        .pricing-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(0,0,0,0.3); border-radius: 12px; overflow: hidden; }
        .pricing-table th, .pricing-table td { padding: 12px 8px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .pricing-table th { background: rgba(219,39,119,0.2); font-weight: 700; font-size: 14px; }
        .pricing-table td { font-size: 13px; }
        .price-highlight { font-weight: 800; font-size: 16px; color: var(--success); }
        
        .steps { display: flex; flex-direction: column; gap: 16px; }
        .step { display: flex; gap: 12px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--success); }
        .step-number { width: 32px; height: 32px; background: var(--success); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
        
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0; }
        .feature { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 12px; font-size: 14px; }
        
        .faq-grid { display: grid; gap: 20px; margin-top: 30px; }
        .faq-item { background: rgba(0,0,0,0.2); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: all 0.3s; }
        .faq-item:hover { background: rgba(0,0,0,0.3); }
        .faq-q { font-weight: 800; color: var(--p); margin: 0 0 8px 0; font-size: 16px; display: flex; gap: 10px; line-height: 1.4; }
        .faq-a { color: #cbd5e1; margin: 0; font-size: 14px; line-height: 1.7; padding-left: 26px; display: none; }
        .faq-a.open { display: block; }
        
        .btn-line { display: inline-flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #06C755, #00d084); color: white; padding: 16px 24px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; margin: 20px 0; box-shadow: 0 10px 20px rgba(6,199,85,0.3); transition: all 0.3s; }
        .btn-line:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(6,199,85,0.4); }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 2.5em; font-weight: 900; background: linear-gradient(135deg, var(--gold), var(--p)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .seo-content { margin-top: 60px; padding: clamp(20px, 5vw, 40px); background: var(--bg-alt); border-radius: 24px; border: 1px solid var(--border); }
        .seo-content h2, .seo-content h3 { font-weight: 800; }
        .seo-content h3 { color: #f472b6; margin: 30px 0 15px 0; }
        .seo-content p { color: var(--txt-muted); margin-bottom: 20px; font-size: 15px; line-height: 1.8; }
        
        footer { text-align: center; padding: 40px 20px; margin-top: 60px; border-top: 1px solid var(--border); color: #64748b; font-size: 13px; }
        footer a { color: #60a5fa; text-decoration: none; }
        footer a[href^="https://line.me"] { color: #06C755; }
    </style>
</head>
<body>
    <header class="header-nav">
        <a href="/" aria-label="หน้าแรก">
            <img src="${CONFIG.LOGO}" alt="โลโก้ ${BRAND_NAME}" width="150" height="30">
        </a>
    </header>

    <main class="container">
        <!-- 🔥 HERO + ABOUT US -->
        <section class="hero">
            <h1>ไซด์ไลน์${provinceName}<br>รับงานเอง ฟิวแฟน ตรงปก<br><small style="font-size:0.4em; font-weight:400;">#1 ${provinceName} ${profileCount}+ คน (${CURRENT_YEAR})</small></h1>
            <p><strong>${BRAND_NAME}</strong> - ศูนย์รวมสาวสวยรับงานเอง 10+ ปี อัปเดตทุกวัน ไม่ผ่านเอเย่นต์ การันตี<strong>ตรงปก 100% ไม่มีมัดจำ จ่ายหน้างาน</strong> บริการ 24/7</p>
            
            <div class="zone-tags">
                ${localZones.slice(0, 6).map(zone => `<span class="zone-badge"><i class="fa-solid fa-location-dot" style="margin-right:4px; opacity:0.7;"></i>${zone}</span>`).join('')}
            </div>
        </section>

        <!-- ✅ STATS + TRUST -->
        <section class="section">
            <div class="stats-grid">
                <div class="stat">
                    <div class="stat-number">${profileCount}</div>
                    <div>น้องๆ อัปเดตวันนี้</div>
                </div>
                <div class="stat">
                    <div class="stat-number">${minPrice}฿</div>
                    <div>เริ่มต้น</div>
                </div>
                <div class="stat">
                    <div class="stat-number">4.9</div>
                    <div>คะแนนรีวิว</div>
                </div>
                <div class="stat">
                    <div class="stat-number">10+</div>
                    <div>ประสบการณ์ปี</div>
                </div>
            </div>
        </section>

        <!-- ✅ HOW IT WORKS -->
        <section class="section">
            <h2 class="section-title" style="margin-top:0;"><i class="fas fa-play-circle" style="color: var(--success);"></i> ใช้งานง่าย 4 ขั้นตอน</h2>
            <div class="steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <div>เลือกน้องที่ชอบจากรายการ (รูป+ราคาชัดเจน)</div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div>แชท LINE หรือโทรสอบถาม availability</div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div>นัดเวลา-สถานที่ (Free room+condom)</div>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <div style="color: var(--success); font-weight: 700;">เจอตัวจริง → จ่ายเงิน → บริการ → แยกทาง</div>
                </div>
            </div>
        </section>

        <h2 class="section-title"><i class="fa-solid fa-gem"></i> รายชื่อน้องๆ รับงานฟิวแฟน (${profileCount} คน)</h2>
        
        <div class="grid" role="list">
            ${profiles.map((p, index) => {
                const numericPrice = parseInt((p.rate || "1500").toString().replace(/\D/g, '')) || 1500;
                const isBusy = p.availability && (p.availability.includes('ไม่ว่าง') || p.availability.includes('พัก'));
                const tags = (p.styleTags && p.styleTags.length > 0) ? p.styleTags.slice(0, 2) : ["ฟิวแฟน"];
                
                return `
                <article class="card" role="listitem">
                    <a href="/sideline/${p.slug}" aria-label="ดูโปรไฟล์น้อง ${p.name} รับงาน${provinceName}" style="display:contents;">
                        <div class="card-img-wrap">
                            <span class="badge-status ${isBusy ? 'badge-busy' : 'badge-avail'}">
                                ${isBusy ? '<i class="fa-solid fa-times-circle"></i> ติดจอง' : '<i class="fa-solid fa-check-circle"></i> ว่างรับงาน'}
                            </span>
                            <img src="${optimizeImg(p.imagePath, 400, 533)}" alt="น้อง${p.name} ไซด์ไลน์${provinceName} รับงานเอง" loading="${index < 6 ? 'eager' : 'lazy'}" decoding="async" fetchpriority="${index < 2 ? 'high' : 'auto'}">
                        </div>
                        <div class="card-body">
                            <div class="card-header">
                                <h3 class="card-name">${p.name}</h3>
                                <div class="card-price">฿${numericPrice.toLocaleString()}</div>
                            </div>
                            
                            ${(p.age || p.stats) ? `
                            <div class="card-specs">
                                ${p.age ? `<span>อายุ ${p.age}</span>` : ''}
                                ${p.stats ? `<span>${p.stats}</span>` : ''}
                                ${p.height ? `<span>${p.height}cm</span>` : ''}
                            </div>` : ''}

                            <div class="card-location">
                                <i class="fa-solid fa-location-dot" style="color: var(--p);"></i> 
                                ${p.location ? p.location.substring(0, 20) : provinceName}
                            </div>
                            
                            <div class="card-tags">
                                <span class="card-tag-safe">ไม่มีมัดจำ</span>
                                <span class="card-tag">ตรงปก</span>
                                ${tags.map(tag => `<span class="card-tag">${tag.trim()}</span>`).join('')}
                            </div>
                        </div>
                    </a>
                </article>`;
            }).join('')}
        </div>

        <!-- ✅ PRICING -->
        <section class="section">
            <h2 class="section-title"><i class="fas fa-receipt" style="color: var(--warning);"></i> ตารางราคาโปร่งใส</h2>
            <p style="color: var(--txt-muted); font-size: 14px; margin-bottom: 16px;">ไม่มีมัดจำ • จ่ายหน้างาน • Free condom+room • บริการ 24/7</p>
            <table class="pricing-table">
                <thead>
                    <tr>
                        <th>แพ็คเกจ</th>
                        <th>เวลา</th>
                        <th>Shot</th>
                        <th>ราคา</th>
                        <th>รวม</th>
                    </tr>
                </thead>
                <tbody>
                    ${pricingPackages.map(pkg => `
                    <tr>
                        <td>${pkg.name}</td>
                        <td>${pkg.time}</td>
                        <td>${pkg.shots}</td>
                        <td><strong>${pkg.price}</strong></td>
                        <td>${pkg.include}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </section>

        <!-- ✅ SAFETY & PAYMENT -->
        <section class="section">
            <h2 class="section-title"><i class="fas fa-shield-alt" style="color: var(--success);"></i> ปลอดภัย 100% การชำระเงิน</h2>
            <div class="features-grid">
                <div class="feature">
                    <i class="fas fa-money-bill-wave" style="color: var(--success); font-size: 20px;"></i>
                    เงินสดหน้างานเท่านั้น
                </div>
                <div class="feature">
                    <i class="fas fa-eye" style="color: var(--warning); font-size: 20px;"></i>
                    รีวิว+รูปจริงก่อนจ่าย
                </div>
                <div class="feature">
                    <i class="fas fa-undo" style="color: #3b82f6; font-size: 20px;"></i>
                    ปัญหา? คืน 50-100% ภายใน 30นาที
                </div>
                <div class="feature">
                    <i class="fas fa-lock" style="color: var(--p); font-size: 20px;"></i>
                    Privacy 100% ไม่เก็บข้อมูลลูกค้า
                </div>
            </div>
        </section>

        <!-- 🔥 SEO + FAQ -->
        <section class="seo-content">
            <h2>ทำไมต้อง Sideline ${provinceName}?</h2>
            <p>เราเป็น <strong>#1 แพลตฟอร์มไซด์ไลน์${provinceName}</strong> ที่น่าเชื่อถือที่สุด คัดเฉพาะน้อง<strong>รับงานเอง</strong> อัปเดตรูปจริงทุกวัน 10+ ปีในวงการ รีวิวลูกค้า 5,000+ เคส การันตี<strong>ตรงปก 100%</strong></p>
            
            <h3>บริการครบครัน 24/7</h3>
            <p>ไม่ว่าคุณจะอยู่ในโซน ${localZones.slice(0,4).join(', ')} หรือต้องการน้องไปส่ง เรามีบริการ <strong>ฟิวแฟนแท้ๆ</strong> เอาใจเก่ง พูดจาดี ดูแลเป็นอย่างดี เริ่มต้นเพียง ${minPrice}฿</p>

            <h3>คำถามที่พบบ่อย</h3>
            <div class="faq-grid">
                ${faqData.map((faq, i) => `
                <div class="faq-item" onclick="toggleFAQ(${i})">
                    <div class="faq-q">
                        <i class="fas fa-question-circle"></i> ${faq.q}
                        <i class="fas fa-chevron-down" style="margin-left:auto; transition: transform 0.3s;"></i>
                    </div>
                    <div class="faq-a" id="faq${i}">${faq.a}</div>
                </div>`).join('')}
            </div>
        </section>

        <!-- 🔥 CTA -->
        <div style="text-align: center; margin: 40px 0;">
            <a href="https://line.me/ti/p/~${CONFIG.ADMIN_LINE.replace('@', '')}" target="_blank" class="btn-line">
                <i class="fab fa-line" style="font-size: 24px;"></i>
                สอบถาม Admin ${CONFIG.ADMIN_LINE} หรือดูน้องเพิ่ม
            </a>
        </div>
    </main>
    
    <footer>
        <p><strong>© ${CURRENT_YEAR} ${BRAND_NAME}</strong><br>
        ศูนย์รวมไซด์ไลน์${provinceName} • ตรงปก 100% • ไม่มีมัดจำ • จ่ายหน้างาน • บริการ 24/7<br>
        <a href="tel:${CONFIG.PHONE}">📞 ${CONFIG.PHONE}</a> | 
        <a href="https://line.me/ti/p/~${CONFIG.ADMIN_LINE.replace('@', '')}" target="_blank">LINE: ${CONFIG.ADMIN_LINE}</a></p>
    </footer>

    <script>
        function toggleFAQ(id) {
            const answer = document.getElementById('faq' + id);
            const icon = answer.parentElement.querySelector('i:last-child');
            answer.classList.toggle('open');
            icon.style.transform = answer.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    </script>
</body>
</html>`;

        return new Response(html, {
            headers: {
                'content-type': 'text/html; charset=utf-8',
                'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                'x-content-type-options': 'nosniff',
                'x-frame-options': 'DENY',
                'x-xss-protection': '1; mode=block',
                'strict-transport-security': 'max-age=31536000; includeSubDomains; preload'
            }
        });

    } catch (err) {
        console.error('SSR Error:', err);
        return context.next();
    }
};
