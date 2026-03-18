import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION & HOT LINKS
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai',
    BRAND_TH: 'ไซด์ไลน์เชียงใหม่',
    TWITTER: '@sidelinecm',
    // Province Master List (SEO Optimized)
    PROVINCES: {
        chiangmai: { name: 'เชียงใหม่', zones: ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'ดอนคำ', 'บ้านสวน'] },
        lampang: { name: 'ลำปาง', zones: ['เกาะคา', 'เมืองลำปาง', 'แจ้ห่ม', 'งาว', 'เถิน', 'แม่ทะ'] },
        chiangrai: { name: 'เชียงราย', zones: ['ตัวเมืองเชียงราย', 'แม่จัน', 'เชียงของ', 'พาน', 'เทิง', 'แม่สรวย'] },
        phayao: { name: 'พะเยา', zones: ['ตัวเมืองพะเยา', 'เชียงคำ', 'เชียงม่วน', 'จุน'] },
        bangkok: { name: 'กรุงเทพ', zones: ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย'] },
        chonburi: { name: 'พัทยา', zones: ['พัทยาเหนือ', 'พัทยากลาง', 'พัทยาใต้', 'บางแสน', 'ศรีราชา'] }
    },
    
SOCIAL_LINKS: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@sidelinecm',
        twitter: 'https://twitter.com/sidelinechiangmai',
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280',
        biosite: 'https://bio.site/firstfiwfans.com',
        linktree: 'https://linktr.ee/kissmodel',
        bluesky: 'https://bsky.app/profile/sidelinechiangmai.bsky.social'
    }
};

// ==========================================
// 2. OPTIMIZED HELPERS (แก้ Image + Cache)
// ==========================================
const optimizeImg = (path, width = 400, height = 533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill,g_face,ar_3:4/`);
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ'],
        'chonburi': ['พัทยา', 'บางแสน', 'ศรีราชา', 'อมตะนคร']
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'พื้นที่ใกล้เคียง'];
};

// ฟังก์ชันสุ่มเนื้อหา SEO แบบพรีเมียม
const generateMasterSeoText = (province, zones, count) => {
    const intros = [
        `หาเด็ก**${province}** อยู่ใช่ไหม? พบกับน้องๆ **ไซด์ไลน์${province}** รับงานเองที่คัดสรรมาแล้วว่าตรงปก 100%`,
        `ศูนย์รวมโปรไฟล์คุณภาพ **รับงาน${province}** ทั้งน้องๆ นักศึกษา และพริตตี้พาร์ทไทม์ พร้อมดูแลคุณแบบฟิวแฟน`,
        `อยากหาเพื่อนเที่ยว เพื่อนดื่มใน **${province}**? เรามีน้องๆ **เด็กเอ็น${province}** ตัวท็อปพรีเมียมให้เลือกกว่า ${count} คน`
    ];
    const features = [
        `ครอบคลุมทุกพิกัดสำคัญในโซน **${zones.slice(0, 4).join(', ')}** ไม่ต้องผ่านโมเดลลิ่ง ติดต่อตรงได้ทันที`,
        `ปลอดภัยสูงสุดด้วยระบบ **จ่ายเงินหน้างาน ไม่ต้องโอนมัดจำ** น้องๆ ทุกคนพร้อมให้บริการอย่างจริงใจ`,
        `อัปเดตข้อมูลล่าสุดปี 2026 เน้นงานดี งานแรง เอาใจเก่ง พิกัด ${zones.slice(4, 7).join(', ')} นัดหมายง่าย`
    ];
    const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `<p class="mb-4">${spin(intros)}</p><p>${spin(features)}</p>`;
};

// ==========================================
// 3. MAIN SSR FUNCTION
// ==========================================
export default async (request, context) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // 3.1 Fetch Data
        const { data: provinceData } = await supabase.from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle();
        if (!provinceData) return context.next();

        const { data: profiles } = await supabase.from('profiles')
            .select('slug, name, imagePath, location, rate, isfeatured, lastUpdated')
            .eq('provinceKey', provinceData.key).eq('active', true)
            .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false }).limit(60);

        if (!profiles || profiles.length === 0) return context.next();

        const provinceName = provinceData.nameThai;
        const zones = getLocalZones(provinceKey);
        const CURRENT_YEAR = new Date().getFullYear();
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const firstImage = optimizeImg(profiles[0].imagePath, 1200, 630);

        // 🎯 4. SEO CONFIGURATION
        const title = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (${CURRENT_YEAR}) | น้องๆ รับงานเอง ฟิวแฟน ไม่มัดจำ`;
        const description = `รวมพิกัด ไซด์ไลน์${provinceName} รับงานเอง อัปเดตล่าสุด ${profiles.length} คน โซน ${zones.slice(0, 4).join(', ')} ✓การันตีตรงปก 100% ✓น้องนักศึกษา ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด`;

        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": `${CONFIG.DOMAIN}#website`,
                    "url": CONFIG.DOMAIN,
                    "name": CONFIG.BRAND_NAME,
                    "publisher": { "@id": `${CONFIG.DOMAIN}#organization` },
                    "potentialAction": { "@type": "SearchAction", "target": `${CONFIG.DOMAIN}/search?q={search_term_string}`, "query-input": "required name=search_term_string" }
                },
                {
                    "@type": ["Organization","LocalBusiness"],
                    "@id": `${CONFIG.DOMAIN}#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "image": firstImage,
                    "address": { "@type": "PostalAddress", "addressLocality": provinceName, "addressCountry": "TH" },
                    "priceRange": "฿1500 - ฿5000"
                },
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "description": description,
                    "image": { "@type": "ImageObject", "url": firstImage },
                    "breadcrumb": { "@id": `${provinceUrl}#breadcrumb` },
                    "mainEntity": { "@id": `${provinceUrl}#itemlist` }
                },
                {
                    "@type": "BreadcrumbList",
                    "@id": `${provinceUrl}#breadcrumb`,
                    "itemListElement":[
                        { "@type":"ListItem", "position":1, "name":"หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type":"ListItem", "position":2, "name":`ไซด์ไลน์${provinceName}`, "item": provinceUrl }
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
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายหน้างานเมื่อเจอตัวจริงเท่านั้นเพื่อความปลอดภัย" }
                        },
                        {
                            "@type": "Question",
                            "name": `น้องๆ รับงานโซนไหนบ้างใน${provinceName}?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `ครอบคลุมโซนยอดนิยม เช่น ${zones.slice(0, 5).join(', ')} และพื้นที่ใกล้เคียง สามารถนัดหมายที่โรงแรมหรือห้องพักได้` }
                        }
                    ]
                }
            ]
        };

        // 🎯 5. GENERATE HTML CARDS
        const cardsHTML = profiles.map((p, i) => `
            <a href="/sideline/${p.slug}" class="profile-card block group relative bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500 shadow-2xl">
                <div class="aspect-[3/4] relative overflow-hidden">
                    <img src="${optimizeImg(p.imagePath)}" alt="น้อง${p.name} รับงาน${provinceName} พิกัด ${p.location || provinceName}" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         ${i < 4 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    <div class="absolute bottom-4 left-4">
                        <span class="bg-black/60 backdrop-blur-md text-gold text-[9px] px-3 py-1 rounded-full border border-gold/20 font-bold uppercase italic tracking-widest">● Verified Profile</span>
                    </div>
                    ${p.isfeatured ? '<div class="absolute top-4 right-4 bg-gold text-black text-[8px] font-black px-3 py-1 rounded-full uppercase shadow-xl">Recommended</div>' : ''}
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-1">
                        <h3 class="font-bold text-lg italic shimmer-gold">${p.name}</h3>
                        <span class="text-gold text-xs font-bold">★ ${p.rate || '4.9'}</span>
                    </div>
                    <p class="text-[9px] text-white/40 font-bold uppercase tracking-widest">${p.location || provinceName}</p>
                </div>
            </a>`).join('');

// 🎯 6. FULL HTML OUTPUT - แก้ไขสมบูรณ์ทุกปัญหา
const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${provinceUrl}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="${CONFIG.TWITTER}">
    
    <!-- ✅ FIX 1: Preconnect + Preload -->
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" fetchpriority="high" href="${firstImage}">
    
    <!-- ✅ FIX 1: Non-blocking Resources -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css" media="print" onload="this.media='all'">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Plus+Jakarta+Sans:wght@300;400;600;700&family=Prompt:wght@300;400;700&display=swap" rel="stylesheet">
    
    <script src="https://cdn.tailwindcss.com" async></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
    <script src="https://unpkg.com/lucide@latest" defer></script>
    
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <!-- ✅ FIX 2,6,7: Complete CSS + Variables + Zone Tags -->
    <style>
        :root { 
            --dark: #050505; 
            --gold: #d4af37; 
            --glass: rgba(255, 255, 255, 0.03); 
            --white-med: rgba(255, 255, 255, 0.15);
            --white-high: rgba(255, 255, 255, 0.9);
        }
        body { 
            background: var(--dark); 
            color: #fff; 
            font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif; 
            overflow-x: hidden; 
            margin: 0; 
            font-display: swap;
        }
        .font-serif { font-family: 'Cinzel', serif; }
        .shimmer-gold { 
            background: linear-gradient(135deg, #b38728 0%, #fbf5b7 50%, #aa771c 100%); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
            background-size: 200% auto; 
            animation: shine 4s linear infinite; 
        }
        @keyframes shine { to { background-position: 200% center; } }
        
        /* ✅ High Contrast Glass */
        .glass-ui { 
            background: var(--glass); 
            backdrop-filter: blur(20px); 
            border: 1px solid var(--white-med); 
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        /* ✅ Profile Cards */
        .profile-card { 
            border: 1px solid var(--white-med); 
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .profile-card:hover { 
            transform: translateY(-12px); 
            box-shadow: 0 25px 50px -20px rgba(212,175,55,0.4), 0 0 0 1px var(--gold); 
            border-color: var(--gold);
        }
        /* ✅ Zone Tags High Contrast */
        .zone-tag {
            background: rgba(255,255,255,0.12) !important;
            border: 1px solid rgba(255,255,255,0.25) !important;
            color: var(--white-high) !important;
            font-weight: 700;
        }
        /* ✅ Accessibility */
        .sr-only { 
            position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; 
            overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; 
        }
        /* ✅ GSAP Safe */
        .gsap-safe { will-change: transform, opacity; contain: layout style; }
        /* ✅ Scrollbar */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .social-item { 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .social-item:hover { 
            transform: scale(1.05); 
            filter: brightness(1.2); 
        }


    

    .max-w-\[1500px\] { max-width: 1500px; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .mb-24 { margin-bottom: 6rem; }
    .aspect-\[3\/4\] { aspect-ratio: 3/4; }
    .rounded-\[2\.5rem\] { border-radius: 2.5rem; }
    .rounded-\[3\.5rem\] { border-radius: 3.5rem; }
    .rounded-\[3rem\] { border-radius: 3rem; }
    .text-\[9px\] { font-size: 9px; }
    .text-\[10px\] { font-size: 10px; }
    .text-\[11px\] { font-size: 11px; }
    .tracking-widest { letter-spacing: 0.1em; }
    
    /* ✅ Details Animation แก้ถูก */
    details[open] > summary > i[data-rotate] { 
        transform: rotate(45deg); 
        transition: transform 0.3s ease; 
    }
    
    /* ✅ Scrollbar */
    .hide-scrollbar::-webkit-scrollbar { display: none; }
</style>

</head>
<body class="bg-[#050505]">
    <!-- Navigation -->
    <nav id="main-nav" class="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center transition-all duration-500 backdrop-blur-md border-b border-gold/10 bg-black/20">
        <a href="/" class="text-xl md:text-2xl font-serif font-bold tracking-[0.2em] shimmer-gold">${CONFIG.BRAND_NAME}</a>
        <div class="text-[10px] font-bold tracking-widest text-white/60 uppercase">Directory / ${provinceName}</div>
    </nav>

    <!-- Hero Section - LCP Optimized -->
    <header class="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center px-6 overflow-hidden pt-20">
        <div class="absolute inset-0">
            <img 
                src="${firstImage}"
                srcset="${optimizeImg(profiles[0].imagePath, 400, 300)} 400w, ${optimizeImg(profiles[0].imagePath, 800, 500)} 800w, ${firstImage} 1200w"
                sizes="100vw"
                class="w-full h-full object-cover opacity-30 scale-105 gsap-safe" 
                alt="ไซด์ไลน์${provinceName} - โปรไฟล์พรีเมียมรับงาน ${provinceName}" 
                fetchpriority="high" 
                decoding="async"
                loading="eager">
            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-[#050505]"></div>
        </div>
        <div class="relative z-20 max-w-5xl space-y-6">
            <p class="reveal text-[10px] tracking-[0.6em] uppercase font-black text-gold opacity-0 translate-y-4">Premium Selection</p>
            <h1 class="reveal text-4xl md:text-8xl font-serif font-bold leading-tight opacity-0 translate-y-4">
                <span class="font-light italic text-white/90">Premium</span><br>
                <span class="shimmer-gold">ไซด์ไลน์${provinceName}</span>
            </h1>
        </div>
    </header>

    <main class="max-w-[1500px] mx-auto px-6 py-12">
        <!-- SEO Content Section -->
        <section class="mb-20 glass-ui p-8 md:p-16 rounded-[3.5rem] text-center">
            <h2 class="text-2xl md:text-4xl font-serif shimmer-gold mb-8 italic">หาเด็ก${provinceName} น้องๆ รับงานเอง ตัวท็อป</h2>
            <div class="text-white/85 text-base md:text-lg leading-loose max-w-4xl mx-auto font-light">
                ${generateMasterSeoText(provinceName, zones, profiles.length)}
            </div>
            <div class="flex flex-wrap justify-center gap-2 mt-10">
                ${zones.slice(0,6).map(z => `<span class="zone-tag text-[10px] px-5 py-2 rounded-full uppercase font-bold">#รับงาน${z}</span>`).join('')}
            </div>
        </section>

        <!-- Profiles Grid - Single Source -->
        <div id="gallery-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10 mb-24">
            ${profiles.map((p, i) => `
                <a href="/sideline/${p.slug}" class="profile-card block group relative bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div class="aspect-[3/4] relative overflow-hidden">
                        <img 
                            src="${optimizeImg(p.imagePath, 400, 533)}"
                            srcset="${optimizeImg(p.imagePath, 200, 267)} 200w, ${optimizeImg(p.imagePath, 400, 533)} 400w"
                            sizes="(max-width: 768px) 200px, 400px"
                            alt="น้อง${p.name} รับงาน${provinceName} พิกัด ${p.location || provinceName}" 
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 gsap-safe" 
                            ${i < 4 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} 
                            decoding="async">
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent/60 to-transparent"></div>
                        <div class="absolute bottom-4 left-4">
                            <span class="bg-black/70 backdrop-blur-md text-gold text-[9px] px-3 py-1 rounded-full border border-gold/30 font-bold uppercase italic text-white/95">● Verified Profile</span>
                        </div>
                        ${p.isfeatured ? '<div class="absolute top-4 right-4 bg-gold text-black text-[8px] font-black px-3 py-1 rounded-full uppercase shadow-2xl">Recommended</div>' : ''}
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-1">
                            <h3 class="font-bold text-lg italic shimmer-gold">${p.name}</h3>
                            <span class="text-gold text-xs font-bold">★ ${p.rate || '4.9'}</span>
                        </div>
                        <p class="text-[10px] text-white/70 font-bold uppercase tracking-widest">${p.location || provinceName}</p>
                    </div>
                </a>
            `).join('')}
        </div>

        <!-- Social Media Section -->
        <section class="social-media-section text-center py-12 bg-white/5 rounded-[3rem] border border-white/5 mb-24">
            <div class="px-4 mb-8">
                <h2 class="text-xl md:text-2xl font-bold shimmer-gold mb-2">ติดตามเราบน Social Media <i class="fas fa-hand-point-down ml-1"></i></h2>
                <p class="text-sm text-white/60">อัปเดตโปรไฟล์ใหม่ล่าสุดและโปรโมชั่นพิเศษก่อนใคร</p>
            </div>
            <div class="social-marquee-wrap overflow-x-auto hide-scrollbar px-4">
                <div class="flex flex-nowrap md:justify-center gap-4 py-2">
                    <a href="${CONFIG.SOCIAL_LINKS.linkedin}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-[#0077b5] px-4 py-2 rounded-xl text-sm" aria-label="ติดตาม LinkedIn"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-[#06c755] px-4 py-2 rounded-xl text-sm" aria-label="ติดต่อ LINE"><i class="fab fa-line"></i> LINE</a>
                    <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-black border border-white/20 px-4 py-2 rounded-xl text-sm" aria-label="ดู TikTok"><i class="fab fa-tiktok"></i> TikTok</a>
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-[#1da1f2] px-4 py-2 rounded-xl text-sm" aria-label="ติดตาม Twitter"><i class="fab fa-twitter"></i> Twitter</a>
                    <a href="${CONFIG.SOCIAL_LINKS.biosite}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-rose-500 px-4 py-2 rounded-xl text-sm" aria-label="ดู Bio.site">Bio.site</a>
                </div>
            </div>
            <div class="mt-8 px-6">
                <p class="inline-block text-[10px] md:text-xs font-bold text-white bg-red-700/80 px-6 py-2 rounded-full uppercase tracking-widest">
                    เว็บไซต์นี้สำหรับผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น
                </p>
            </div>
        </section>

        <!-- FAQ + Stats Section -->
        <section class="grid md:grid-cols-2 gap-10 mb-24 items-start">
            <div class="space-y-6">
                <h2 class="text-3xl font-serif shimmer-gold uppercase tracking-tighter">Common <span class="text-white italic">Questions</span></h2>
                <div class="space-y-4">
                    <details class="glass-ui p-6 rounded-2xl cursor-pointer group">
                        <summary class="flex justify-between font-bold text-xs uppercase tracking-widest items-center">
                            ต้องโอนมัดจำก่อนไหม? 
                            <i class="fas fa-plus w-4 h-4 transition-transform group-open:rotate-45 text-gold"></i>
                        </summary>
                        <div class="mt-4 text-sm text-white/70 leading-relaxed">ไม่ต้องโอนมัดจำครับ ระบบของเราเน้นนัดเจอ จ่ายเงินหน้างานเท่านั้น เพื่อความปลอดภัยสูงสุดของลูกค้า</div>
                    </details>
                    <details class="glass-ui p-6 rounded-2xl cursor-pointer group">
                        <summary class="flex justify-between font-bold text-xs uppercase tracking-widest items-center">
                            รูปภาพตรงปกหรือไม่? 
                            <i class="fas fa-plus w-4 h-4 transition-transform group-open:rotate-45 text-gold"></i>
                        </summary>
                        <div class="mt-4 text-sm text-white/70 leading-relaxed">เราคัดกรองโปรไฟล์อย่างดี หากนัดแล้วไม่ตรงปก ลูกค้าสามารถยกเลิกงานได้ทันทีครับ</div>
                    </details>
                </div>
            </div>
            <div class="glass-ui p-10 rounded-[3rem] border-gold/10">
                <h3 class="text-xl font-serif shimmer-gold mb-4 italic">Exclusive Area Coverage</h3>
                <p class="text-[10px] text-white/60 uppercase tracking-[0.2em] mb-8 leading-loose">
                    บริการครอบคลุมพิกัด: <span class="text-white/90">${zones.slice(0, 5).join(' • ')}</span>
                </p>
                <div class="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                    <div><div class="text-2xl font-bold text-gold">${profiles.length}+</div><div class="text-[9px] uppercase text-white/60 font-bold">Active Now</div></div>
                    <div><div class="text-2xl font-bold text-gold">100%</div><div class="text-[9px] uppercase text-white/60 font-bold">Safe Service</div></div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-white/5 pt-20 pb-10 border-t border-white/5">
        <div class="max-w-[1500px] mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                <div class="md:col-span-4 space-y-6">
                    <div class="text-2xl font-serif shimmer-gold tracking-widest uppercase">${CONFIG.BRAND_NAME}</div>
                    <p class="text-xs leading-relaxed text-white/60 max-w-sm">
                        แพลตฟอร์มไซด์ไลน์อันดับ 1 ใน${provinceName} มุ่งเน้นความโปร่งใส ปลอดภัย และบริการระดับพรีเมียม
                    </p>
                </div>
                <div class="md:col-span-2 md:col-start-6">
                    <h3 class="text-white text-xs font-bold mb-6 uppercase tracking-widest">เมนูหลัก</h3>
                    <ul class="space-y-3 text-[11px] text-white/60">
                        <li><a href="/" class="hover:text-gold transition-colors">หน้าแรก</a></li>
                        <li><a href="/profiles.html" class="hover:text-gold transition-colors">ค้นหาน้องๆ</a></li>
                    </ul>
                </div>
                <div class="md:col-span-3">
                    <h3 class="text-white text-xs font-bold mb-6 uppercase tracking-widest">พิกัดยอดนิยม</h3>
                    <ul class="grid grid-cols-1 gap-3 text-[11px] text-white/60">
                        ${zones.slice(0,4).map(z => `<li><a href="#" class="hover:text-gold transition-colors flex items-center gap-2"><span class="w-1 h-1 bg-gold/30 rounded-full"></span> รับงาน${z}</a></li>`).join('')}
                    </ul>
                </div>
                <div class="md:col-span-3">
                    <h3 class="text-white text-xs font-bold mb-6 uppercase tracking-widest">จองคิวน้องๆ</h3>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" 
                       class="flex items-center justify-center gap-2 bg-[#06c755] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#05b34c] transition-all shadow-lg shadow-green-500/20">
                        <i class="fab fa-line text-xl"></i> แอดไลน์จองคิว
                    </a>
                </div>
            </div>
            <div class="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-[9px] text-white/40 uppercase tracking-[0.3em]">© 2026 ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
                <div class="flex gap-8 text-[9px] text-white/40 font-bold uppercase tracking-widest">
                    <a href="/privacy-policy.html" class="hover:text-gold transition">Privacy</a>
                    <a href="/terms.html" class="hover:text-gold transition">Terms</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- ✅ FIX 6: Accessible Floating Line Button -->
    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" 
       aria-label="ติดต่อ Line สายตรงรับงาน ${provinceName}" 
       style="position: fixed; bottom: 30px; right: 30px; z-index: 9999; background-color: #06c755; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid white;">
        <i class="fab fa-line" style="font-size: 32px;" aria-hidden="true"></i>
        <span class="sr-only">Line Chat ${provinceName}</span>
    </a>

    <!-- ✅ FIX 1: Non-blocking Scripts -->
    <script>
        (function() {
            function initializePage() {
                // Lucide Icons
                if (typeof lucide !== 'undefined') lucide.createIcons();
                
                // GSAP Animations
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo('.reveal', 
                        { opacity: 0, y: 30 }, 
                        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out' }
                    );
                }
                
                // Nav Scroll Effect
                const nav = document.getElementById('main-nav');
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) {
                        nav.classList.add('bg-black/80', 'py-3');
                    } else {
                        nav.classList.remove('bg-black/80', 'py-3');
                    }
                }, { passive: true });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializePage);
            } else {
                initializePage();
            }
        })();
    </script>
</body>
</html>`;
return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });

    } catch (e) {
        console.error('Master SSR Error:', e);
        return context.next();
    }
};
