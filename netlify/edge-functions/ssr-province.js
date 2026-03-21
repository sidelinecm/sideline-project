import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. SYSTEM CONFIGURATION & HOT LINKS
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline CM (Thailand)',
    TWITTER: '@sidelinecm',
    
    SOCIAL_LINKS: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@sidelinecm',
        twitter: 'https://twitter.com/sidelinechiangmai'
    }
};

// ==========================================
// 2. PROGRAMMATIC SEO ENGINE (LSI & LOCALIZATION)
// ==========================================
// ฐานข้อมูลคำศัพท์เฉพาะพื้นที่ (LSI Keywords) ป้องกันปัญหา Duplicate Content จาก Google
const PROVINCE_SEO_DATA = {
    'chiangmai': {
        zones:['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'คูเมือง'],
        lsi:['สาวเหนือ', 'นักศึกษา มช.', 'ขาวหมวย', 'ตัวท็อปเชียงใหม่', 'เด็กเอ็นเชียงใหม่'],
        hotels:['โรงแรมแถวนิมมาน', 'ที่พักใกล้คูเมือง', 'คอนโดเจ็ดยอด']
    },
    'bangkok': {
        zones:['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย'],
        lsi:['พริตตี้ กทม.', 'นางแบบสาว', 'ตัวท็อปกรุงเทพ', 'เด็กเอ็น', 'ฟิวแฟนคลุกวงใน'],
        hotels:['คอนโดติด BTS', 'โรงแรมย่านสุขุมวิท', 'ที่พักห้วยขวาง']
    },
    'chonburi': {
        zones:['พัทยาเหนือ', 'พัทยากลาง', 'พัทยาใต้', 'บางแสน', 'ศรีราชา', 'อมตะนคร'],
        lsi:['สาวพัทยา', 'เด็ก ม.บูรพา', 'ตัวท็อปบางแสน', 'รับงานทะเล', 'ปาร์ตี้พูลวิลล่า'],
        hotels:['โรงแรมพัทยา', 'พูลวิลล่าพัทยา', 'คอนโดติดหาด']
    },
    'phuket': {
        zones:['ป่าตอง', 'ตัวเมืองภูเก็ต', 'ถลาง', 'กะทู้', 'ฉลอง', 'กะรน'],
        lsi:['สาวใต้', 'เด็กภูเก็ต', 'รับงานภูเก็ต', 'เพื่อนเที่ยวทะเล', 'เด็กเอ็นป่าตอง'],
        hotels:['โรงแรมป่าตอง', 'รีสอร์ทภูเก็ต', 'ที่พักกะทู้']
    },
    'khonkaen': {
        zones:['ตัวเมืองขอนแก่น', 'มข.', 'กังสดาล', 'หลังมอ', 'เซ็นทรัลขอนแก่น'],
        lsi:['สาวอีสาน', 'เด็ก มข.', 'น่ารักสไตล์เกาหลี', 'ตัวท็อปขอนแก่น', 'รับงานขอนแก่น'],
        hotels:['โรงแรมใกล้ มข.', 'ที่พักตัวเมืองขอนแก่น']
    },
    'default': {
        zones:['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู', 'หมู่บ้าน'],
        lsi:['นักศึกษา', 'พริตตี้พาร์ทไทม์', 'หุ่นนางแบบ', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน'],
        hotels:['โรงแรมในตัวเมือง', 'รีสอร์ทส่วนตัว', 'ที่พักของลูกค้า']
    }
};


const optimizeImg = (path, width = 400, height = 533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) {
            const transform = `f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face`;
            return path.replace('/upload/', `/upload/${transform}/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    // ✅ แก้ไขจุดที่ 2: ใช้ Supabase Render API เพื่อบีบอัดรูปสำรอง
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=80`;
};

// Ultimate Content Generator (สร้างเนื้อหาแบบไม่ซ้ำกันเลยในแต่ละจังหวัด)
const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    
    if (count === 0) return `<p class="mb-4 text-gold font-bold text-lg">🚀 เตรียมพบกับน้องๆ ไซด์ไลน์${provinceName} เร็วๆ นี้...</p><p>เรากำลังคัดสรร <strong>${data.lsi[0]}</strong> และ <strong>${data.lsi[1]}</strong> เกรดพรีเมียม เพื่อให้คุณได้รับบริการที่ดีที่สุด แอดไลน์เพื่อสอบถามคิวหลุดก่อนใคร!</p>`;
    
    const h2_spin =[
        `รวบรวมพิกัด <strong>รับงาน${provinceName}</strong> น้องๆ <strong>${data.lsi[0]}</strong> ตัวท็อปอัปเดตล่าสุด`,
        `หาเด็ก <strong>ไซด์ไลน์${provinceName}</strong> การันตีตรงปก 100% สไตล์ <strong>${data.lsi[1]}</strong>`,
        `ศูนย์รวม <strong>เด็กเอ็น${provinceName}</strong> และ <strong>${data.lsi[2]}</strong> บริการระดับพรีเมียม`
    ];

    const p1_spin =[
        `หากคุณกำลังมองหาความผ่อนคลายในพื้นที่ <strong>${provinceName}</strong> เรามีน้องๆ <strong>${data.lsi[3]}</strong> และ <strong>${data.lsi[4]}</strong> กว่า ${count} คน ที่พร้อมดูแลคุณแบบฟิวแฟน นัดง่าย ครอบคลุมพิกัด <strong>${data.zones.slice(0,3).join(', ')}</strong>`,
        `หมดปัญหาไม่ตรงปก! พบกับโปรไฟล์น้องๆ <strong>รับงาน${provinceName}</strong> ที่คัดกรองมาอย่างดี สะดวกโซนไหนเรามีหมด ไม่ว่าจะเป็น <strong>${data.zones.slice(0,3).join(', ')}</strong> สามารถนัดหมายที่ <strong>${data.hotels[0]}</strong> ได้ทันที`,
        `คัดมาให้แล้วเน้นๆ กับ <strong>${data.lsi[0]}</strong> และ <strong>${data.lsi[1]}</strong> ในพื้นที่ <strong>${provinceName}</strong> บริการเอาใจเก่ง ดื่มได้ เที่ยวได้ นัดเจอกันได้เลยที่ <strong>${data.hotels[0]}</strong> หรือ <strong>${data.hotels[1]}</strong>`
    ];

    const p2_spin =[
        `✅ <strong>จุดเด่นของเรา:</strong> ปลอดภัยที่สุดด้วยระบบ <strong>จ่ายเงินหน้างาน ไม่ต้องโอนมัดจำล่วงหน้า</strong> ป้องกันมิจฉาชีพ 100% น้องๆ รับงานเอง ไม่ผ่านโมเดลลิ่ง สนใจน้องคนไหนโซน <strong>${data.zones[3]}</strong> หรือ <strong>${data.zones[4]}</strong> คลิกดูโปรไฟล์ได้เลย`,
        `สัมผัสประสบการณ์เหนือระดับกับ <strong>ไซด์ไลน์${provinceName}</strong> ที่เน้นความปลอดภัย จ่ายเงินเมื่อเจอตัวจริงเท่านั้น ไร้กังวลเรื่องการโอนมัดจำ พร้อมบริการในพิกัดยอดฮิตเช่น <strong>${data.zones[3]}</strong> ตลอด 24 ชั่วโมง`
    ];

    const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    return `
        <h2 class="text-xl md:text-2xl font-serif text-white/90 mb-4 leading-relaxed tracking-wide">${spin(h2_spin)}</h2>
        <p class="mb-4 text-white/70 leading-loose text-sm md:text-base">${spin(p1_spin)}</p>
        <div class="text-white/70 leading-loose bg-white/5 p-4 md:p-6 rounded-xl border border-gold/20 shadow-inner text-sm md:text-base text-left">
            ${spin(p2_spin)}
        </div>
    `;
};

// ==========================================
// 3. MAIN SSR EDGE FUNCTION
// ==========================================
export default async (request, context) => {
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const rawProvinceKey = pathParts[pathParts.length - 1] || 'chiangmai';
        const provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase();

        // 3.1 Database Connection
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // Fetch Province Metadata
        const { data: provinceData, error: provError } = await supabase
            .from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle();

        if (!provinceData || provError) return context.next();

        // Fetch Profiles (Limit 80 for strong Local SEO indexing)
        const { data: profiles } = await supabase
            .from('profiles').select('slug, name, imagePath, location, rate, isfeatured, lastUpdated')
            .eq('provinceKey', provinceData.key).eq('active', true)
            .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false })
            .limit(80);

        const safeProfiles = profiles ||[];
        const provinceName = provinceData.nameThai;
        
        // Data Prep
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
        const zones = seoData.zones;
        
        const CURRENT_YEAR = new Date().getFullYear();
        const CURRENT_MONTH = new Date().toLocaleString('th-TH', { month: 'long' });
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
            : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        // ==========================================
        // 4. ENTERPRISE SCHEMA.ORG & METADATA
        // ==========================================
        const title = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (${CURRENT_MONTH} ${CURRENT_YEAR}) | รับงานเอง ไม่มัดจำ`;
        const description = safeProfiles.length > 0
            ? `รวมพิกัด ไซด์ไลน์${provinceName} รับงานเอง อัปเดตล่าสุด ${safeProfiles.length} คน โซน ${zones.slice(0, 3).join(', ')} ✓ตรงปก 100% ✓${seoData.lsi[0]} ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด จ่ายหน้างาน`
            : `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน ไม่ต้องโอนมัดจำ ปลอดภัย 100% ติดต่อเราได้ทันที`;

        const schemaData = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "WebSite",
                    "@id": `${CONFIG.DOMAIN}/#website`,
                    "url": CONFIG.DOMAIN,
                    "name": CONFIG.BRAND_NAME
                },
                {
                    "@type": ["LocalBusiness", "EntertainmentBusiness"],
                    "@id": `${provinceUrl}/#business`,
                    "name": `รับงาน${provinceName} - ไซด์ไลน์พรีเมียม`,
                    "url": provinceUrl,
                    "image": firstImage,
                    "description": description,
                    "telephone": "ติดต่อผ่าน Line Official",
                    "priceRange": "฿1500 - ฿5000",
                    "areaServed": {
                        "@type": "State",
                        "name": provinceName
                    },
                    "aggregateRating": safeProfiles.length > 0 ? {
                        "@type": "AggregateRating",
                        "ratingValue": (4.8 + Math.random() * 0.2).toFixed(1),
                        "reviewCount": String(safeProfiles.length * 18 + 245),
                        "bestRating": "5",
                        "worstRating": "1"
                    } : undefined,
                    "offers": safeProfiles.length > 0 ? {
                        "@type": "AggregateOffer",
                        "offerCount": String(safeProfiles.length),
                        "lowPrice": "1500",
                        "highPrice": "5000",
                        "priceCurrency": "THB"
                    } : undefined
                },
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}/#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "isPartOf": { "@id": `${CONFIG.DOMAIN}/#website` },
                    "about": { "@id": `${provinceUrl}/#business` }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement":[
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `รวมโปรไฟล์ทั้งหมด`, "item": `${CONFIG.DOMAIN}/profiles` },
                        { "@type": "ListItem", "position": 3, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type": "FAQPage",
                    "mainEntity":[
                        {
                            "@type": "Question",
                            "name": `น้องๆ รับงานโซนไหนบ้างใน${provinceName}?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `เรามีน้องๆ ครอบคลุมโซนยอดนิยม เช่น ${zones.slice(0, 5).join(', ')} และพื้นที่ใกล้เคียง นัดหมายได้ตลอด 24 ชม.` }
                        },
                        {
                            "@type": "Question",
                            "name": `บริการไซด์ไลน์${provinceName} ต้องโอนมัดจำไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายหน้างานเมื่อเจอตัวจริงเท่านั้น เพื่อความปลอดภัย ป้องกันมิจฉาชีพ 100%" }
                        }
                    ]
                }
            ]
        };

        // ==========================================
        // 5. HTML GENERATION (ZERO CLS & CONTENT-VISIBILITY)
        // ==========================================
        let cardsHTML = '';
        if (safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                const isEager = i < 6; // Preload ภาพ 6 รูปแรก والباقي Lazy Load
                const imgWidth = isEager ? 500 : 400;
                const imgHeight = isEager ? 667 : 533;
                
                return `
                <article class="group relative bg-[#0f0f0f] rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 hover:border-gold/60 transition-all duration-500 shadow-xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] hover:-translate-y-2 flex flex-col h-full css-content-visibility">
                    <a href="/sideline/${p.slug}" class="absolute inset-0 z-30" aria-label="ดูโปรไฟล์น้อง ${p.name}"></a>
                    
                    <div class="relative w-full pt-[133.33%] bg-[#111] overflow-hidden">
                        <img src="${optimizeImg(p.imagePath, imgWidth, imgHeight)}" 
                             alt="น้อง${p.name} รับงาน${provinceName} พิกัด ${p.location || provinceName}" 
                             class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-90"
                             ${isEager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} 
                             decoding="async" width="${imgWidth}" height="${imgHeight}">
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
                        
                        <div class="absolute bottom-3 left-3 z-20">
                            <span class="bg-black/90 backdrop-blur-md text-gold text-[10px] md:text-[9px] px-3 py-1.5 rounded-full border border-gold/30 font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                                <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span> 100% ตรงปก
                            </span>
                        </div>
                        
                        ${p.isfeatured ? '<div class="absolute top-3 right-3 z-20 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black text-[10px] md:text-[8px] font-black px-3 py-1.5 rounded-full uppercase shadow-[0_0_20px_rgba(212,175,55,0.5)]">🔥 ตัวท็อป</div>' : ''}
                    </div>
                    
                    <div class="p-5 flex-1 flex flex-col justify-end relative z-20">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-lg md:text-xl lg:text-2xl italic line-clamp-1 text-white group-hover:text-gold transition-colors">${p.name}</h3>
                            <span class="text-gold text-[11px] font-black flex-shrink-0 bg-gold/10 px-2.5 py-1 rounded-lg border border-gold/20">★ ${p.rate || '5.0'}</span>
                        </div>
                        <p class="text-[11px] md:text-[10px] text-white/50 font-bold uppercase tracking-widest line-clamp-1 mb-4 flex items-center gap-1.5"><i class="fas fa-map-marker-alt text-gold/50"></i> พิกัด: ${p.location || provinceName}</p>
                        
                        <div class="mt-auto">
                            <span class="w-full flex items-center justify-center gap-2 bg-white/5 text-white/80 text-[12px] md:text-[11px] px-4 py-3 rounded-xl border border-white/10 font-bold uppercase tracking-widest group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all duration-300">
                                <span>ดูรูปโปรไฟล์</span>
                                <i class="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                            </span>
                        </div>
                    </div>
                </article>`;
            }).join('');
        }

// ==========================================
        // 6. RENDER THE ULTIMATE HTML (OPTIMIZED)
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${provinceUrl}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta property="og:image" content="${firstImage}">
    
    <!-- Resource Hints -->
    <link rel="preconnect" href="https://res.cloudinary.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=Prompt:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

    <!-- Tailwind Standard CDN with Custom Config -->
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <script>
        tailwind.config = { theme: { extend: { colors: { gold: '#d4af37' }, fontFamily: { serif:['Cinzel', 'serif'] } } } };
    </script>
    
    <style>
        :root { --dark: #050505; --gold: #d4af37; }
        body { background: var(--dark); color: #f8f9fa; font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif; min-height: 100vh; }
        
        /* Performance: ข้ามการวาดส่วนที่ยังมองไม่เห็น */
        .css-content-visibility { content-visibility: auto; contain-intrinsic-size: 800px; }
        
        /* Shimmer Gold Effect */
        .shimmer-gold { 
            background: linear-gradient(135deg, #b38728 0%, #fbf5b7 45%, #d4af37 55%, #aa771c 100%); 
            background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
            animation: shimmer 5s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }
        
        /* Zero CLS: จองพื้นที่รูปภาพอัตราส่วน 3:4 */
        .img-aspect-ratio { position: relative; padding-bottom: 133.33%; overflow: hidden; background: #111; border-radius: inherit; }
        .img-aspect-ratio img { position: absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        
        /* Glass UI */
        .glass-ui { background: rgba(15, 15, 15, 0.7); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.05); }
    </style>

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
</head>
<body>
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-[100] transition-all duration-300 py-3 md:py-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div class="container flex justify-between items-center max-w-7xl mx-auto px-4">
            <a href="/" class="text-xl md:text-2xl font-serif font-bold tracking-widest shimmer-gold">Sideline CM</a>
            <div class="hidden md:flex items-center gap-3 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase">
                <a href="/" class="hover:text-gold transition-colors">Home</a> <span>/</span>
                <span class="text-gold border-b border-gold/30 pb-0.5">${provinceName}</span>
            </div>
            <a href="${CONFIG.SOCIAL_LINKS.line}" class="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-[#06c755]/10 text-[#06c755] border border-[#06c755]/30">
                <i class="fab fa-line text-lg"></i>
            </a>
        </div>
    </nav>

    <!-- Header Section -->
    <header class="relative min-h-[50vh] md:min-h-[65vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-10 overflow-hidden">
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-[#050505] z-10"></div>
            ${safeProfiles.length > 0 ? `<img src="${firstImage}" class="w-full h-full object-cover opacity-[0.15] scale-110 blur-[2px]" alt="Background" fetchpriority="high">` : ''}
        </div>
        
        <div class="relative z-20 max-w-4xl mx-auto space-y-4 md:space-y-6">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 text-[10px] md:text-[11px] font-bold tracking-widest uppercase mb-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                อัปเดตล่าสุด: ${CURRENT_MONTH} ${CURRENT_YEAR}
            </div>
            <h1 class="font-serif font-bold drop-shadow-2xl text-[clamp(2.5rem,8vw,6.5rem)] leading-[1.05]">
                <span class="block text-2xl md:text-3xl lg:text-4xl text-white/80 italic font-light mb-2 md:mb-4">Exclusive</span>
                <span class="block shimmer-gold">ไซด์ไลน์${provinceName}</span>
            </h1>
            <p class="text-sm md:text-base text-white/50 max-w-2xl mx-auto mt-4 font-light tracking-wide">
                รวบรวมพิกัดน้องๆ ทั่ว${provinceName} เน้นงานตรงปก ฟิวแฟน ไม่ต้องผ่านโมเดลลิ่ง ปลอดภัย 100%
            </p>
        </div>
    </header>

    <main class="container max-w-7xl mx-auto py-8 md:py-12 px-4">
        
        <!-- SEO Text Block -->
        <section class="mb-12 md:mb-20 glass-ui rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 text-center relative overflow-hidden shadow-2xl">
            <div class="max-w-4xl mx-auto relative z-10">
                ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
            </div>
            
            <div class="border-t border-white/10 mt-8 md:mt-10 pt-8 md:pt-10 relative z-10">
                <h3 class="text-xs md:text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-6">📍 ค้นหาตามพิกัดยอดฮิตใน${provinceName}</h3>
                <div class="flex flex-wrap justify-center gap-2.5 md:gap-3">
                    ${zones.map(z => `
                        <a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" 
                           class="text-[11px] md:text-xs px-5 py-2.5 rounded-full border border-white/10 font-bold uppercase tracking-widest bg-white/5 hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 shadow-lg">
                           #รับงาน${z}
                        </a>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Listing Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 mb-20">
            ${safeProfiles.length > 0 ? cardsHTML : `
                <div class="col-span-full py-20 text-center glass-ui rounded-[2rem] border-dashed border-2 border-white/10">
                    <i class="fas fa-gem text-4xl text-gold/50 mb-6 animate-pulse"></i>
                    <h3 class="text-2xl font-serif text-white/90 mb-4">Coming Very Soon</h3>
                    <p class="text-white/50 max-w-sm mx-auto mb-8 text-sm">กำลังคัดกรองน้องๆ โซน${provinceName} เพื่อมาตรฐานที่สูงที่สุด</p>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" class="inline-flex items-center gap-2 bg-[#06c755] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#05b34c] transition-all shadow-xl shadow-green-500/20">แอดไลน์สอบถามคิว</a>
                </div>
            `}
        </div>

        <!-- Safety Footer Section -->
        <footer class="border-t border-white/10 pt-16 pb-12 mt-20 text-center md:text-left">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
                <div>
                    <h3 class="text-xl font-serif text-gold mb-3">${CONFIG.BRAND_NAME}</h3>
                    <p class="text-xs text-white/40 leading-relaxed">
                        ศูนย์รวม <strong>รับงาน${provinceName}</strong> อันดับ 1 เน้นความโปร่งใส ปลอดภัย<br> จ่ายเงินหน้างาน 100% ไม่ต้องโอนมัดจำ ป้องกันมิจฉาชีพ
                    </p>
                </div>
                <div class="md:text-right space-y-4">
                    <p class="inline-block text-[10px] font-bold text-red-300 bg-red-900/30 border border-red-500/20 px-4 py-2 rounded-lg uppercase tracking-widest">
                        🔞 เฉพาะผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น
                    </p>
                    <div class="flex justify-center md:justify-end gap-6 text-[10px] text-white/30 uppercase tracking-widest font-bold">
                        <a href="/privacy" class="hover:text-gold transition-colors">Privacy</a>
                        <a href="/terms" class="hover:text-gold transition-colors">Terms</a>
                        <span>&copy; ${CURRENT_YEAR}</span>
                    </div>
                </div>
            </div>
        </footer>
    </main>

    <!-- Floating Line Button -->
    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" 
       class="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-[#06c755] to-[#04a045] rounded-full flex items-center justify-center text-white text-3xl shadow-[0_10px_30px_rgba(6,199,85,0.4)] hover:-translate-y-2 hover:scale-105 transition-all duration-300 z-[99] border-2 border-white/20 group"
       aria-label="ติดต่อแอดมิน">
        <i class="fab fa-line drop-shadow-lg group-hover:rotate-12 transition-transform"></i>
        <span class="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-[#050505] rounded-full animate-bounce"></span>
    </a>

    <!-- Scripts -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const nav = document.querySelector('nav');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('bg-[#050505]/95', 'py-2', 'border-white/10');
                    nav.classList.remove('bg-[#050505]/80', 'py-3', 'border-white/5');
                } else {
                    nav.classList.remove('bg-[#050505]/95', 'py-2', 'border-white/10');
                    nav.classList.add('bg-[#050505]/80', 'py-3', 'border-white/5');
                }
            }, { passive: true });
        });
    </script>
</body>
</html>`;

        // ==========================================
        // 7. RETURN SWR CACHED RESPONSE & SECURITY HEADERS
        // ==========================================
        return new Response(html, { 
            headers: { 
                "Content-Type": "text/html; charset=utf-8", 
                "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=3600",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            } 
        });

    } catch (e) {
        console.error('SSR Critical Error:', e);
        return new Response(`
            <!DOCTYPE html>
            <html lang="th">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>ระบบกำลังอัปเดต - Sideline CM</title>
                <style>
                    body { background: #050505; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center; margin: 0; }
                    a { display: inline-block; background: #06c755; color: white; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; margin-top: 20px; }
                </style>
            </head>
            <body>
                <h1 style="color:#d4af37;">ระบบกำลังอัปเดตชั่วคราว</h1>
                <p>โปรดติดต่อจองคิวหรือสอบถามโดยตรงผ่าน Line</p>
                <a href="${CONFIG.SOCIAL_LINKS.line}">@sidelinecm</a>
            </body>
            </html>
        `, {
            status: 500, 
            headers: { 
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-store",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY"
            }
        });
    }
};