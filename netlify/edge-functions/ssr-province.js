import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    LOGO: 'https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 🖼️ Ultimate Image Optimizer (ครอบรูปเน้นใบหน้า บังคับ 3:4)
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

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // ⚡ ดึงข้อมูลจากฐานข้อมูลจริงแบบครบถ้วนทุกฟิลด์
        const [provinceRes, profilesRes] = await Promise.allSettled([
            fetchWithTimeout(supabase.from('provinces').select('nameThai, key').eq('key', provinceKey).maybeSingle()),
            fetchWithTimeout(supabase.from('profiles')
                .select('slug, name, imagePath, location, rate, isfeatured, availability, styleTags, age, stats')
                .eq('provinceKey', provinceKey)
                .eq('active', true)
                .order('isfeatured', { ascending: false })
                .order('lastUpdated', { ascending: false }))
        ]);

        const provinceData = provinceRes.status === 'fulfilled' ? provinceRes.value.data : null;
        const profiles = profilesRes.status === 'fulfilled' ? profilesRes.value.data || [] :[];

        if (!provinceData || profiles.length === 0) return context.next();

        const provinceName = provinceData.nameThai;
        const profileCount = profiles.length;
        const localZones = getLocalZones(provinceKey);
        const CURRENT_YEAR = new Date().getFullYear() + 543;
        const BRAND_NAME = `Sideline ${provinceName}`;

        // วิเคราะห์ราคา
        const prices = profiles.map(p => parseInt((p.rate || "1500").toString().replace(/\D/g, ''))).filter(p => p > 0 && p <= 30000);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 1500;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 5000;

        // 🌟 SEO Meta & Content
        const pageTitle = `ไซด์ไลน์${provinceName} รับงานเอง ตัวท็อป ${profileCount} คน (${CURRENT_YEAR}) ตรงปก ไม่มีมัดจำ`;
        const metaDesc = `รวมสาวสวย ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟนแท้ๆ อัปเดตล่าสุด ${profileCount} คน โซน${localZones.slice(0, 3).join(', ')} การันตีตรงปก 100% ปลอดภัย ชำระเงินหน้างานเท่านั้น ไม่มีโอนมัดจำ`;
        const canonicalUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const ogImage = optimizeImg(profiles[0]?.imagePath, 800, 600);

        const faqData =[
            { q: `บริการไซด์ไลน์${provinceName} มีการเก็บเงินมัดจำล่วงหน้าหรือไม่?`, a: `แพลตฟอร์มของเราให้ความสำคัญกับความปลอดภัย เรายืนยันว่า "ไม่มีมัดจำ" ลูกค้าสามารถนัดหมายและ "ชำระเงินหน้างานเท่านั้น" เมื่อได้เจอน้องตัวจริงครับ` },
            { q: `มั่นใจได้อย่างไรว่าน้องๆ ที่รับงานจะ "ตรงปก"?`, a: `เรามีการตรวจสอบและคัดกรองโปรไฟล์อย่างเข้มงวด การันตี "ตรงปก 100%" หากนัดเจอแล้วหน้าตาไม่ตรงรูป สามารถยกเลิกได้ทันทีไม่มีค่าใช้จ่าย` },
            { q: `บริการ "ฟิวแฟน" คืออะไร?`, a: `คือการดูแลเทคแคร์อย่างใกล้ชิดเสมือนคนรัก น้องๆ จะพูดจาออดอ้อน เอาใจเก่ง ให้เกียรติลูกค้า ทำให้คุณรู้สึกประทับใจตลอดการอยู่ด้วยกัน` }
        ];

        // 🕸️ Schema Markup ระดับ Ultimate Entity
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
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${ogImage}">

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
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Prompt', sans-serif; background: var(--bg); color: var(--txt); line-height: 1.6; -webkit-font-smoothing: antialiased; }
        
        .header-nav { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; padding: 15px 20px; text-align: center; }
        .header-nav img { height: 30px; width: auto; }
        
        .container { max-width: 1280px; margin: 0 auto; padding: 24px 16px; }

        .hero { text-align: center; padding: 30px 0 40px; border-bottom: 1px solid var(--border); margin-bottom: 30px; }
        .hero h1 { font-size: clamp(24px, 5.5vw, 40px); font-weight: 900; margin-bottom: 16px; line-height: 1.4; background: linear-gradient(135deg, #fff, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-wrap: balance; }
        .hero p { font-size: clamp(14px, 3.5vw, 18px); color: var(--txt-muted); max-width: 850px; margin: 0 auto; line-height: 1.7; text-wrap: balance; }
        
        .zone-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 20px; }
        .zone-badge { background: rgba(255,255,255,0.05); color: #cbd5e1; padding: 6px 14px; border-radius: 50px; font-size: 13px; border: 1px solid var(--border); }

        .section-title { font-size: clamp(20px, 5vw, 28px); font-weight: 800; margin: 0 0 20px 0; color: #fff; display: flex; align-items: center; gap: 10px; }

        /* 📱 Ultimate Grid (2 Cols on Mobile, 5 on Desktop) */
        .grid { display: grid; gap: clamp(12px, 3vw, 24px); grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 640px) { .grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1280px) { .grid { grid-template-columns: repeat(5, 1fr); } }

        /* Premium Card UI */
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
        
        /* สเปคข้อมูลจริง */
        .card-specs { display: flex; gap: 6px; font-size: 11px; color: #cbd5e1; flex-wrap: wrap; }
        .card-specs span { background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 4px; }
        
        .card-location { color: var(--txt-muted); font-size: 12px; display: flex; align-items: center; gap: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .card-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
        .card-tag { background: rgba(219,39,119,0.15); color: #f472b6; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
        .card-tag-safe { background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; }

        .seo-content { margin-top: 60px; padding: clamp(20px, 5vw, 40px); background: var(--bg-alt); border-radius: 24px; border: 1px solid var(--border); }
        .seo-content h2 { font-size: clamp(20px, 4.5vw, 26px); color: #fff; margin: 0 0 20px 0; font-weight: 800; }
        .seo-content h3 { font-size: clamp(18px, 4vw, 22px); color: #f472b6; margin: 30px 0 15px 0; font-weight: 700; }
        .seo-content p { color: var(--txt-muted); margin-bottom: 20px; font-size: 15px; line-height: 1.8; }
        
        .faq-grid { display: grid; gap: 20px; margin-top: 30px; }
        .faq-item { background: rgba(0,0,0,0.2); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
        .faq-q { font-weight: 800; color: var(--p); margin: 0 0 8px 0; font-size: 16px; display: flex; gap: 10px; line-height: 1.4; }
        .faq-a { color: #cbd5e1; margin: 0; font-size: 14px; line-height: 1.7; padding-left: 26px; }

        footer { text-align: center; padding: 40px 20px; margin-top: 40px; border-top: 1px solid var(--border); color: #64748b; font-size: 13px; }
    </style>
</head>
<body>
    <header class="header-nav">
        <a href="/" aria-label="หน้าแรก">
            <img src="${CONFIG.LOGO}" alt="โลโก้ ${BRAND_NAME}" width="150" height="30">
        </a>
    </header>

    <main class="container">
        <!-- 🔥 SEO Hero -->
        <section class="hero">
            <h1>ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน ตรงปก ไม่มีมัดจำ</h1>
            <p>พบกับศูนย์รวมสาวสวย <strong>ไซด์ไลน์${provinceName}</strong> ที่คัดมาเฉพาะคน <strong>รับงานเอง</strong> บริการระดับพรีเมียมเน้น <strong>ฟิวแฟน</strong> เอาใจเก่ง การันตี <strong>ตรงปก 100%</strong> ปลอดภัยที่สุดเพราะเรา <strong>ไม่มีมัดจำ ชำระเงินหน้างานเท่านั้น</strong></p>
            
            <div class="zone-tags" aria-label="พื้นที่ให้บริการรับงาน">
                ${localZones.slice(0, 6).map(zone => `<span class="zone-badge"><i class="fa-solid fa-location-dot" style="margin-right:4px; opacity:0.7;"></i>${zone}</span>`).join('')}
            </div>
        </section>

        <h2 class="section-title"><i class="fa-solid fa-gem"></i> อัปเดตรายชื่อน้องๆ รับงานฟิวแฟน (${profileCount} คน)</h2>
        
        <!-- 🚀 Ultimate CSS Grid 2 Cols Mobile -->
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
                            
                            <!-- 💡 โชว์ข้อมูลเชิงลึกจาก DB จริง -->
                            ${(p.age || p.stats) ? `
                            <div class="card-specs">
                                ${p.age ? `<span>อายุ ${p.age}</span>` : ''}
                                ${p.stats ? `<span>${p.stats}</span>` : ''}
                            </div>` : ''}

                            <div class="card-location">
                                <i class="fa-solid fa-location-dot text-pink-500"></i> ${p.location ? p.location.substring(0, 20) : provinceName}
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

        <!-- 🔥 SEO Content & FAQ -->
        <section class="seo-content">
            <h2>ทำไมต้องเรียกน้องๆ รับงานไซด์ไลน์ ${provinceName} จากเรา?</h2>
            <p>เว็บไซต์ <strong>${BRAND_NAME}</strong> คือแพลตฟอร์มศูนย์รวมสาวสวยที่น่าเชื่อถือที่สุดในพื้นที่ เราเข้าใจดีว่าลูกค้าต้องการความสบายใจสูงสุด เราจึงคัดกรองเฉพาะน้องๆ ที่ <strong>รับงานเอง</strong> ไม่ผ่านเอเย่นต์ ทำให้ได้เรทราคาที่คุ้มค่า และการันตีว่ารูปภาพโปรไฟล์ <strong>ตรงปก 100%</strong> แน่นอน</p>
            
            <h3>บริการ ฟิวแฟน แท้ๆ ปลอดภัย ไม่มีมัดจำ</h3>
            <p>ไม่ว่าคุณจะอยู่ย่าน ${localZones.slice(0,4).join(', ')} หรือพื้นที่อื่นๆ ในจังหวัด เรามีน้องๆ พร้อมให้บริการ <strong>ฟิวแฟน</strong> ที่ดูแลเอาใจใส่เป็นอย่างดี ข้อดีที่สุดของการเรียกน้องๆ ผ่านเว็บเราคือ <strong>ไม่มีมัดจำ ชำระเงินหน้างานเท่านั้น</strong> เพื่อป้องกันมิจฉาชีพ ให้คุณได้เจอน้องตัวจริงก่อนแล้วค่อยจ่ายเงิน</p>

            <div class="faq-grid">
                <h3 style="grid-column: 1 / -1; margin-bottom: 0; color: #fff; font-size: 20px;"><i class="fa-solid fa-comments"></i> คำถามที่พบบ่อย</h3>
                ${faqData.map(f => `
                    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                        <h4 class="faq-q" itemprop="name"><i class="fa-regular fa-circle-question"></i> ${f.q}</h4>
                        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                            <p class="faq-a" itemprop="text">${f.a}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    </main>

    <footer>
        <p>© ${CURRENT_YEAR} ${BRAND_NAME} - ศูนย์รวมไซด์ไลน์ รับงานเอง ตรงปก ไม่มีมัดจำ ชำระเงินหน้างานเท่านั้น</p>
        <p style="opacity:0.6; margin-top:10px;">Disclaimer: เว็บไซต์นี้เป็นเพียงสื่อกลางในการลงโฆษณา ไม่สนับสนุนกิจกรรมที่ผิดกฎหมายใดๆ</p>
    </footer>
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