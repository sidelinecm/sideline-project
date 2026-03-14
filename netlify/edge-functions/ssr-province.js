import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)'
};

// ปรับขนาดรูปให้เล็กลงสำหรับหน้า List (400x533)
const optimizeImg = (path, width = 400, height = 533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill,g_face/`);
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai':['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'หลังมอ'],
        'bangkok':['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ'],
        'chonburi':['พัทยา', 'บางแสน', 'ศรีราชา', 'อมตะนคร', 'สัตหีบ']
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'พื้นที่ใกล้เคียง'];
};

// ฟังก์ชันสุ่ม LSI Keywords แบบเป็นธรรมชาติ ไม่สแปม
const spinKeyword = () => {
    const keywords =["ฟิวแฟน", "งานแรง", "ตรงปก", "เอาใจเก่ง", "นักศึกษา", "ตัวท็อป", "สายเอ็น"];
    return keywords[Math.floor(Math.random() * keywords.length)];
};

export default async (request, context) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        const { data: provinceData } = await supabase
            .from('provinces')
            .select('id, nameThai, key')
            .eq('key', provinceKey)
            .maybeSingle();

        if (!provinceData) return context.next();

        // จำกัดดึงแค่ 60 คนเพื่อรักษาความเร็วของ Page Speed (DOM Size ไม่อืด)
        const { data: profiles } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, location, rate, isfeatured, lastUpdated')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('lastUpdated', { ascending: false })
            .limit(60);

        if (!profiles || profiles.length === 0) return context.next();

        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const CURRENT_YEAR = new Date().getFullYear();
        
        // 🎯 1. SEO META & TITLE (จิตวิทยาการคลิก + คีย์เวิร์ดหลัก)
        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} (${CURRENT_YEAR}) หาเด็กสาวสวย ฟิวแฟน ไม่มัดจำ`;
        const description = `รวมพิกัด ไซด์ไลน์${provinceName} รับงานเอง อัปเดตล่าสุด ${profiles.length} คน โซน ${localZones.slice(0, 4).join(', ')} ✓ฟิวแฟนแท้ๆ ✓การันตีตรงปก 100% ✓จ่ายหน้างาน ปลอดภัยที่สุด`;
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const firstImage = optimizeImg(profiles[0].imagePath);

        // 🎯 2. ADVANCED SCHEMA MARKUP (รวม 4 ตัวท็อป: Collection, LocalBusiness, Breadcrumb, FAQ)
        const schemaData = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "description": description,
                    "mainEntity": {
                        "@type": "ItemList",
                        "numberOfItems": profiles.length,
                        "itemListElement": profiles.map((p, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`
                        }))
                    }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement":[
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type": "LocalBusiness",
                    "name": `ศูนย์รวมไซด์ไลน์ ${provinceName} รับงานเอง`,
                    "image": firstImage,
                    "address": { "@type": "PostalAddress", "addressLocality": provinceName, "addressCountry": "TH" },
                    "priceRange": "฿1500 - ฿5000"
                },
                {
                    "@type": "FAQPage",
                    "mainEntity":[
                        { "@type": "Question", "name": `บริการไซด์ไลน์${provinceName} ต้องโอนมัดจำไหม?`, "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องโอนมัดจำใดๆ ทั้งสิ้นครับ แพลตฟอร์มของเราเน้นความปลอดภัย จ่ายเงินสดหน้างานเมื่อเจอน้องตัวจริงเท่านั้น" } },
                        { "@type": "Question", "name": `น้องๆ รับงานโซนไหนบ้างใน${provinceName}?`, "acceptedAnswer": { "@type": "Answer", "text": `ครอบคลุมทุกพื้นที่ยอดฮิต เช่น ${localZones.join(', ')} สามารถนัดหมายที่โรงแรมหรือห้องพักส่วนตัวได้เลย` } },
                        { "@type": "Question", "name": "การันตีตรงปกไหม?", "acceptedAnswer": { "@type": "Answer", "text": "การันตีตรงปก 100% รูปโปรไฟล์มีการอัปเดตสม่ำเสมอ หากนัดเจอแล้วหน้าตาไม่ตรงปก ลูกค้าสามารถยกเลิกงานได้ทันที ไม่มีค่าใช้จ่าย" } }
                    ]
                }
            ]
        };

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${provinceUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <!-- 🚀 Core Web Vitals: Preconnect & Preload -->
    <link rel="preconnect" href="https://zxetzqwjaiumqhrpumln.supabase.co" crossorigin>
    <link rel="preload" as="image" href="${firstImage}">
    
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${provinceUrl}">
    
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root { --p: #ec4899; --bg: #0f172a; --card: #1e293b; --txt: #f8fafc; --muted: #94a3b8; --gold: #fbbf24; --green: #10b981; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--txt); margin: 0; padding: 0; line-height: 1.6; -webkit-font-smoothing: antialiased; }
        .container { max-width: 1080px; margin: 0 auto; padding: 20px; }
        
        /* Header & Hero */
        header { text-align: center; padding: 40px 0 20px; border-bottom: 1px solid #334155; margin-bottom: 30px; }
        h1 { color: var(--p); font-size: clamp(26px, 5vw, 36px); margin: 0 0 10px 0; font-weight: 900; letter-spacing: -0.5px; }
        .hero-sub { color: var(--muted); font-size: clamp(14px, 3vw, 16px); margin: 0; font-weight: 500; }
        .trust-badges { display: flex; justify-content: center; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
        .badge { background: rgba(251, 191, 36, 0.1); color: var(--gold); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; border: 1px solid rgba(251, 191, 36, 0.2); }
        .badge-green { background: rgba(16, 185, 129, 0.1); color: var(--green); border-color: rgba(16, 185, 129, 0.2); }
        
        /* Grid & Cards */
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (min-width: 640px) { .grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }
        
        .card { background: var(--card); border-radius: 16px; overflow: hidden; text-decoration: none; color: inherit; border: 1px solid #334155; transition: all 0.3s ease; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-6px); border-color: var(--p); box-shadow: 0 10px 25px -5px rgba(236, 72, 153, 0.3); }
        
        .img-box { position: relative; width: 100%; aspect-ratio: 3/4; background: #000; overflow: hidden; }
        .img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .card:hover .img-box img { transform: scale(1.05); }
        .featured-tag { position: absolute; top: 12px; right: 12px; background: var(--gold); color: #000; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 900; z-index: 2; box-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        
        .card-info { padding: 16px; flex-grow: 1; display: flex; flex-direction: column; }
        .name { font-weight: 800; margin: 0 0 6px 0; font-size: clamp(16px, 4vw, 18px); color: #fff; display: flex; justify-content: space-between; align-items: center; }
        .loc { font-size: 13px; color: var(--muted); margin-bottom: 8px; display: flex; align-items: center; gap: 4px; }
        .price { color: var(--gold); font-weight: 800; font-size: 18px; margin-top: auto; }
        
        .lsi-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
        .lsi-tag { font-size: 11px; color: var(--p); background: rgba(236, 72, 153, 0.1); padding: 2px 8px; border-radius: 4px; }

        /* SEO Content & FAQ */
        .seo-section { margin-top: 60px; padding: 40px; background: rgba(30, 41, 59, 0.6); border-radius: 24px; border: 1px solid #334155; }
        .seo-section h2 { color: #fff; font-size: 22px; margin: 0 0 20px 0; font-weight: 800; }
        .seo-section h3 { color: var(--p); font-size: 18px; margin: 30px 0 15px 0; font-weight: 700; }
        .seo-section p { color: var(--muted); font-size: 15px; margin-bottom: 16px; line-height: 1.8; }
        .faq-item { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .faq-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .faq-q { font-weight: 700; color: #fff; margin-bottom: 8px; }
        .faq-a { color: var(--muted); font-size: 14px; }

        footer { text-align: center; margin-top: 40px; padding: 40px 20px; color: var(--muted); font-size: 13px; border-top: 1px solid #334155; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>ไซด์ไลน์${provinceName} รับงานเอง ตัวท็อป</h1>
            <p class="hero-sub">ศูนย์รวมสาวสวย หาเด็ก${provinceName} อัปเดต ${profiles.length} โปรไฟล์ (${CURRENT_YEAR})</p>
            <div class="trust-badges">
                <span class="badge">ไม่มีมัดจำ จ่ายหน้างาน</span>
                <span class="badge badge-green">VERIFIED ตรงปก 100%</span>
            </div>
        </div>
    </header>

    <main class="container">
        <!-- 🎯 3. โครงสร้าง Semantic HTML & LSI Contextual Tags -->
        <div class="grid" role="list">
            ${profiles.map((p, index) => {
                const altTemplates =[
                    `รูปโปรไฟล์ น้อง${p.name} ไซด์ไลน์${provinceName} รับงานเอง`,
                    `น้อง${p.name} สาวรับงาน${provinceName} ฟิวแฟน`,
                    `หาเด็ก${provinceName} พิกัดน้อง${p.name} ไม่มัดจำ`,
                    `เด็กเอ็น ไซด์ไลน์ โซน${p.location || provinceName} น้อง${p.name}`
                ];
                const altText = altTemplates[index % altTemplates.length];
                
                // Regex ที่ปลอดภัยที่สุดในการดึงราคา
                const priceMatch = (p.rate || "1500").toString().match(/\\d+/);
                const price = priceMatch ? parseInt(priceMatch[0]) : 1500;
                
                // ดึง LSI Keyword เสริมบารมี SEO
                const lsi1 = spinKeyword();

                return `
                <article class="card" role="listitem">
                    <a href="/sideline/${p.slug}" aria-label="ดูรายละเอียดน้อง ${p.name} รับงาน${provinceName}">
                        <div class="img-box">
                            <img src="${optimizeImg(p.imagePath)}" alt="${altText}" 
                                loading="${index === 0 ? 'eager' : 'lazy'}" 
                                decoding="${index === 0 ? 'sync' : 'async'}"
                                width="400" height="533">
                            ${p.isfeatured ? '<span class="featured-tag">RECOMMENDED</span>' : ''}
                        </div>
                        <div class="card-info">
                            <h2 class="name">${p.name}</h2>
                            <div class="loc">📍 ${p.location || provinceName}</div>
                            <div class="lsi-tags">
                                <span class="lsi-tag">รับงาน${provinceName}</span>
                                <span class="lsi-tag">${lsi1}</span>
                            </div>
                            <span class="price">฿${price.toLocaleString()}</span>
                        </div>
                    </a>
                </article>
                `;
            }).join('')}
        </div>

        <!-- 🎯 4. Deep SEO Content & SERP Features (FAQ) -->
        <section class="seo-section">
            <h2>เว็บไซต์รวมข้อมูลไซด์ไลน์${provinceName} ยอดนิยมอันดับ 1</h2>
            <p>หากคุณกำลังค้นหา <strong>สาวรับงาน${provinceName}</strong> หรือต้องการ <strong>หาเด็ก${provinceName}</strong> เพื่อดูแลยามเหงา เราคือศูนย์รวมโปรไฟล์น้องๆ นักศึกษา สาวออฟฟิศ และพริตตี้ ที่มารับงานอิสระโดยตรงแบบไม่ผ่านเอเย่นต์ เรามีข้อมูลสาวสวยอัปเดตใหม่ทุกวัน ครอบคลุมโซนยอดฮิตอย่าง ${localZones.join(', ')} ให้คุณได้เลือกตรงตามสเปคที่สุด</p>
            <p>แพลตฟอร์มของเราเน้นย้ำเรื่องความปลอดภัยสูงสุด <strong>ไม่มีการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้น</strong> ลูกค้าสามารถเลือกโปรไฟล์ นัดหมาย และชำระเงินสดหน้างานเท่านั้น บริการมีทั้งแบบชั่วคราวและค้างคืน (Long Time) เน้นการดูแลเอาใจใส่ดุจแฟน (ฟิวแฟน) การันตีรูป <strong>ตรงปก 100%</strong> หากหน้างานไม่ตรงรูป สามารถปฏิเสธได้ทันที เรทราคาเริ่มต้นยุติธรรม</p>
            
            <h3>คำถามที่พบบ่อย (FAQ)</h3>
            <div class="faq-item">
                <div class="faq-q">Q: บริการไซด์ไลน์${provinceName} ต้องโอนมัดจำไหม?</div>
                <div class="faq-a">A: ไม่ต้องโอนมัดจำใดๆ ทั้งสิ้นครับ แพลตฟอร์มของเราเน้นความปลอดภัย จ่ายเงินสดหน้างานเมื่อเจอน้องตัวจริงเท่านั้น</div>
            </div>
            <div class="faq-item">
                <div class="faq-q">Q: น้องๆ รับงานโซนไหนบ้างใน${provinceName}?</div>
                <div class="faq-a">A: ครอบคลุมทุกพื้นที่ยอดฮิต เช่น ${localZones.slice(0,5).join(', ')} และพื้นที่ใกล้เคียง สามารถนัดหมายที่โรงแรมหรือห้องพักส่วนตัวของน้องได้เลย</div>
            </div>
            <div class="faq-item">
                <div class="faq-q">Q: การันตีตรงปกไหม หากไม่ตรงปกทำอย่างไร?</div>
                <div class="faq-a">A: การันตีตรงปก 100% รูปโปรไฟล์มีการตรวจสอบและอัปเดตสม่ำเสมอ หากนัดเจอแล้วหน้าตาไม่ตรงปก ลูกค้าสามารถยกเลิกงานและแยกย้ายได้ทันที ไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น</div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            © ${CURRENT_YEAR} ${CONFIG.BRAND_NAME} - แหล่งรวมสาวสวย รับงานเอง ปลอดภัย ไม่มัดจำ<br>
            <small>แพลตฟอร์มเป็นเพียงสื่อกลางในการนำเสนอข้อมูล ไม่มีนโยบายรับโอนเงินผ่านระบบใดๆ</small>
        </div>
    </footer>
</body>
</html>`;

        return new Response(html, { 
    headers: { 
        "content-type": "text/html; charset=utf-8",
        // เก็บหน้าเว็บไว้ที่ Server ของ Netlify 1 ชม. เพื่อลดภาระ Supabase และทำให้เว็บโหลดไวเหมือนฟ้าผ่า
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    } 
});