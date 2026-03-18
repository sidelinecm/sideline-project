import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)'
};

const optimizeImg = (path, width = 400) => {
    if (!path) return '/images/default.webp';
    
    // ถ้าเป็น Cloudinary ให้บีบอัดระดับ 'eco' (Economical) และเปลี่ยนเป็น WebP
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/f_webp,q_auto:eco,w_${width},c_limit/`);
    }
    
    // ถ้าเป็น Supabase Storage (พยายามเลี่ยงการเก็บรูปใหญ่ที่นี่)
    if (path.includes('supabase.co/storage')) {
        // ใช้ฟังก์ชัน URL Transformation ของ Supabase (ถ้าเปิดใช้งาน)
        return `${path}?width=${width}&quality=70`;
    }
    
    return path;
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
  "@graph": [

    {
      "@type": "WebSite",
      "@id": `${CONFIG.DOMAIN}#website`,
      "url": CONFIG.DOMAIN,
      "name": CONFIG.BRAND_NAME,
      "inLanguage": "th-TH",
      "publisher": {
        "@id": `${CONFIG.DOMAIN}#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${CONFIG.DOMAIN}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },

    {
      "@type": ["Organization","LocalBusiness"],
      "@id": `${CONFIG.DOMAIN}#organization`,
      "name": CONFIG.BRAND_NAME,
      "url": CONFIG.DOMAIN,
      "logo": `${CONFIG.DOMAIN}/images/logo.png`,
      "image": firstImage,
      "sameAs": [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://line.me/ti/p/ksLUWB89Y_"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": provinceName,
        "addressCountry": "TH"
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": provinceName
      },
      "priceRange": "฿1500 - ฿5000"
    },

    {
      "@type": "CollectionPage",
      "@id": `${provinceUrl}#webpage`,
      "url": provinceUrl,
      "name": title,
      "description": description,
      "inLanguage": "th-TH",
      "isPartOf": {
        "@id": `${CONFIG.DOMAIN}#website`
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": firstImage
      },
      "breadcrumb": {
        "@id": `${provinceUrl}#breadcrumb`
      },
      "mainEntity": {
        "@id": `${provinceUrl}#itemlist`
      }
    },

    {
      "@type": "BreadcrumbList",
      "@id": `${provinceUrl}#breadcrumb`,
      "itemListElement":[
        {
          "@type":"ListItem",
          "position":1,
          "name":"หน้าแรก",
          "item": CONFIG.DOMAIN
        },
        {
          "@type":"ListItem",
          "position":2,
          "name":`ไซด์ไลน์${provinceName}`,
          "item": provinceUrl
        }
      ]
    },

    {
      "@type": "ItemList",
      "@id": `${provinceUrl}#itemlist`,
      "numberOfItems": profiles.length,
      "itemListElement": profiles.map((p, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`
      }))
    },

    {
      "@type": "FAQPage",
      "@id": `${provinceUrl}#faq`,
      "mainEntity":[
        {
          "@type": "Question",
          "name": `บริการไซด์ไลน์${provinceName} ต้องโอนมัดจำไหม?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ไม่ต้องโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายหน้างานเมื่อเจอตัวจริงเท่านั้นเพื่อความปลอดภัย"
          }
        },
        {
          "@type": "Question",
          "name": `น้องๆ รับงานโซนไหนบ้างใน${provinceName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `ครอบคลุมโซนยอดนิยม เช่น ${localZones.join(', ')} และพื้นที่ใกล้เคียง สามารถนัดหมายที่โรงแรมหรือห้องพักได้`
          }
        },
        {
          "@type": "Question",
          "name": "การันตีตรงปกไหม?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "รูปโปรไฟล์มีการอัปเดตสม่ำเสมอ หากไม่ตรงปกสามารถยกเลิกงานได้ทันทีโดยไม่มีค่าใช้จ่าย"
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
<section class="social-media-section text-center py-8 md:py-10 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-inner mt-8 md:mt-12">

   <div class="social-links">
    <h2 class="social-disclaimer text-sm md:text-base text-gray-900 dark:text-gray-100 max-w-xl mx-auto px-4 font-extrabold" style="text-shadow:0 0 4px rgba(255,255,255,.6)">
      ติดตามเราบน Social Media 
      <i class="fas fa-hand-point-down ml-1" aria-hidden="true"></i>
    </h2>
    <p class="text-sm md:text-base font-medium text-gray-900 dark:text-gray-200 m-0 leading-tight">
      อัปเดตโปรไฟล์ใหม่ล่าสุดและโปรโมชั่นพิเศษได้ก่อนใคร
    </p>
  </div>

  <div class="social-marquee-wrap overflow-x-auto mt-4">
    <div class="social-marquee flex flex-nowrap justify-center gap-4 text-sm sm:text-base whitespace-nowrap py-2 px-4">

      <a href="https://www.linkedin.com/in/cuteti-sexythailand-398567280?trk=contact-info" 
   target="_blank" 
   rel="nofollow noopener noreferrer" 
   class="social-item linkedin inline-flex items-center font-bold text-white bg-[#0077b5] hover:bg-[#006097] focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg px-3 py-1 transition-colors duration-200" 
   title="ติดตามเราบน LinkedIn">
   <i class="fa-brands fa-linkedin mr-1" aria-hidden="true"></i>LinkedIn
</a>

      <a href="https://line.me/ti/p/ksLUWB89Y_" target="_blank" rel="nofollow noopener noreferrer"
         class="social-item line inline-flex items-center font-bold text-white bg-green-900 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-3 py-1 transition-colors duration-200"
         aria-label="ติดต่อเราทาง LINE" title="ติดต่อเราทาง LINE">
        <i class="fab fa-line mr-1" aria-hidden=true></i>LINE
      </a>

      <a href="https://tiktok.com/@sidelinecm" target="_blank" rel="nofollow noopener noreferrer"
         class="social-item tiktok inline-flex items-center font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg px-3 py-1 transition-colors duration-200"
         title="ดูวิดีโอของเราบน TikTok">
        <i class="fab fa-tiktok mr-1" aria-hidden=true></i>TikTok
      </a>

      <a href="https://twitter.com/sidelinechiangmai" target="_blank" rel="nofollow noopener noreferrer"
         class="social-item twitter inline-flex items-center font-bold text-white bg-sky-900 hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg px-3 py-1 transition-colors duration-200"
         title="ติดตามเราบน Twitter">
        <i class="fab fa-twitter mr-1" aria-hidden=true></i>Twitter
      </a>

      <a href="https://bio.site/firstfiwfans.com" target="_blank" rel="nofollow noopener noreferrer"
         title="เยี่ยมชม Bio.site Profile ของเรา"
         class="social-item bio-site inline-flex items-center justify-center gap-2 font-bold text-black bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 rounded-lg px-4 py-2 transition-colors duration-300 shadow-md">
        <img src="/images/favicon-32x32.png" alt="โลโก้ Bio.site" width="16" height="16" class="w-4 h-4" loading="lazy" decoding="async">
        Bio.site
      </a>

      <a href="https://linktr.ee/kissmodel" target="_blank" rel="nofollow noopener noreferrer"
         class="social-item linktree inline-flex items-center font-bold text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg px-3 py-1 transition-colors duration-200"
         title="รวมลิงก์ทั้งหมดของเราใน Linktree">
        <i class="fas fa-link mr-1" aria-hidden=true></i>Linktree
      </a>

      <a href="https://bsky.app/profile/sidelinechiangmai.bsky.social" 
   target="_blank" 
   rel="nofollow noopener noreferrer"
   class="social-item bluesky inline-flex items-center font-bold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg px-3 py-1 transition-colors"
   title="ติดตามเราบน Bluesky">
  <i class="fas fa-cloud mr-1"></i>Bluesky
</a>


    </div>
  </div>

  <p class="social-disclaimer text-xs md:text-sm text-center font-extrabold text-white bg-red-800 max-w-xl mx-auto px-4 py-2 mt-4 rounded-lg shadow-md leading-tight" role="alert">
    <strong>เว็บไซต์นี้สำหรับผู้ที่มีอายุ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</strong>
  </p>
</section>
    </main>

    <footer>
        <div class="container">
            © ${CURRENT_YEAR} ${CONFIG.BRAND_NAME} - แหล่งรวมสาวสวย รับงานเอง ปลอดภัย ไม่มัดจำ<br>
            <small>แพลตฟอร์มเป็นเพียงสื่อกลางในการนำเสนอข้อมูล ไม่มีนโยบายรับโอนเงินผ่านระบบใดๆ</small>
        </div>

  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
      <div class="md:col-span-4 space-y-4">
        <img src="/images/logo-sidelinechiangmai.webp" alt="Sideline Chiangmai Logo" class="h-7 w-auto mb-2 opacity-90 grayscale hover:grayscale-0 transition-all duration-500" loading="lazy">
        <p class="text-xs leading-relaxed max-w-sm">
          <strong>Sideline Chiangmai</strong> แพลตฟอร์มที่มุ่งเน้นความโปร่งใสและปลอดภัยอันดับ 1 ในเชียงใหม่ เราคัดกรองข้อมูลเพื่อให้มั่นใจว่าคุณจะได้รับประสบการณ์ที่ดีที่สุด
        </p>
      </div>
      <div class="md:col-span-2 md:col-start-6">
        <h3 class="text-gray-900 dark:text-white text-sm font-bold mb-4">เมนูหลัก</h3>
        <ul class="space-y-2.5 text-xs">
          <li><a href="/" class="hover:text-pink-500 transition-colors">หน้าแรก</a></li>
          <li><a href="/profiles.html" class="hover:text-pink-500 transition-colors">ค้นหาน้องๆ</a></li>
          <li><a href="/faq.html" class="hover:text-pink-500 transition-colors">คำถามที่พบบ่อย</a></li>
          <li><a href="/blog.html" class="hover:text-pink-500 transition-colors">บทความน่ารู้</a></li>
        </ul>
      </div>
      <div class="md:col-span-3">
        <h3 class="text-gray-900 dark:text-white text-sm font-bold mb-4">โซนยอดนิยม</h3>
        <ul id="popular-locations-footer" class="grid grid-cols-1 gap-2 text-xs">
          <li><a href="#" class="hover:text-pink-500 transition-colors flex items-center gap-2"><span class="w-1 h-1 bg-gray-300 rounded-full"></span> นิมมานเหมินท์</a></li>
          <li><a href="#" class="hover:text-pink-500 transition-colors flex items-center gap-2"><span class="w-1 h-1 bg-gray-300 rounded-full"></span> สันติธรรม / เจ็ดยอด</a></li>
          <li><a href="#" class="hover:text-pink-500 transition-colors flex items-center gap-2"><span class="w-1 h-1 bg-gray-300 rounded-full"></span> ช้างเผือก / มช.</a></li>
        </ul>
      </div>
      <div class="md:col-span-3">
        <h3 class="text-gray-900 dark:text-white text-sm font-bold mb-4">ติดต่อเรา</h3>
        <p class="text-xs mb-4">แอดมินตอบแชทไว 10.00 - 04.00 น.</p>
        <a href="https://line.me/ti/p/ksLUWB89Y_" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 bg-[#06c755] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#05a546] transition-all w-full shadow-lg shadow-green-500/20">
          <i class="fab fa-line text-lg"></i> แอดไลน์จองคิว
        </a>
      </div>
    </div>
    <div class="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-[10px] text-gray-400 uppercase tracking-widest">© 2026 Sideline Chiangmai. All Rights Reserved.</p>
      <div class="flex gap-6 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
        <a href="/privacy-policy.html" class="hover:text-pink-500 transition-colors">Privacy Policy</a>
        <a href="/terms.html" class="hover:text-pink-500 transition-colors">Terms of Service</a>
      </div>
    </div>
    <div class="mt-8 text-[10px] text-gray-400 text-center max-w-2xl mx-auto leading-relaxed opacity-60">
      เว็บไซต์นี้เป็นเพียงสื่อกลางในการแนะนำข้อมูลพิกัดและโปรไฟล์เท่านั้น ทางเว็บไซต์ไม่มีส่วนเกี่ยวข้องกับการกระทำผิดกฎหมายใดๆ ทั้งสิ้น ข้อมูลทั้งหมดถูกคัดกรองเพื่อความบันเทิงและเป็นข้อมูลสำหรับผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น
    </div>
  </div>
</footer>

</body>
</html>`;

       return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });
    } catch (e) {
        return context.next(); 
    }
};