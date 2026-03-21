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
    },
    CURRENT_YEAR: new Date().getFullYear() 
}; 

// ==========================================
// 2. HELPERS (IMAGE & SEO CONTENT)
// ==========================================
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
// 3. MAIN SSR FUNCTION (Completed & Optimized)
// ==========================================
export default async (request, context) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // 1. ดึงข้อมูลจังหวัดและตรวจสอบว่ามีในระบบไหม
        const { data: provinceData, error: provError } = await supabase
            .from('provinces')
            .select('id, nameThai, key')
            .eq('key', provinceKey)
            .maybeSingle();

        if (!provinceData || provError) return context.next();

        // 2. ดึงข้อมูลโปรไฟล์ที่ Active
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, location, rate, isfeatured, lastUpdated')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('lastUpdated', { ascending: false })
            .limit(60);

        if (!profiles || profiles.length === 0 || profileError) return context.next();

        const provinceName = provinceData.nameThai;
        const zones = getLocalZones(provinceKey);
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const firstImage = optimizeImg(profiles[0].imagePath, 1200, 630);

        // 🎯 4. SEO CONFIGURATION
        const title = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (${CONFIG.CURRENT_YEAR}) | น้องๆ รับงานเอง ฟิวแฟน ไม่มัดจำ`;
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
// สร้างเนื้อหา SEO
const seoText = generateMasterSeoText(provinceName, zones, profiles.length);

// เตรียมข้อมูลสำหรับ JSON-LD
const jsonLdProfiles = JSON.stringify(profiles.map((p, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
    "name": p.name,
    "image": optimizeImg(p.imagePath)
})));
        // COMPLETE HTML OUTPUT
        const html = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no, user-scalable=no">
    <title>${title} | ไซด์ไลน์พรีเมียม ${provinceName} ตัวท็อป รับงานเอง ปลอดภัย 100%</title>
    <meta name="description" content="${description} หาเด็ก${provinceName} น้องๆ รับงานเอง ตัวท็อปสุดในพื้นที่ ${zones.slice(0,5).join(', ')} จ่ายหน้างาน ไม่ต้องมัดจำ รูปจริง 100% อัปเดตทุกวัน ${CONFIG.CURRENT_YEAR}">
    <link rel="canonical" href="${provinceUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:200">
    
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็ก${provinceName}, ตัวท็อป${provinceName}, ${zones.slice(0,5).join(', ')}, จ่ายหน้างาน, ไม่มัดจำ, นักศึกษา${provinceName}">
    <meta name="author" content="${CONFIG.BRAND_NAME}">
    
    <meta property="og:title" content="${title} | ไซด์ไลน์ ${provinceName}">
    <meta property="og:description" content="${description.substring(0,160)}... จ่ายหน้างาน ปลอดภัย 100%">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="ไซด์ไลน์ตัวท็อป ${provinceName} ${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:locale" content="th_TH">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="${CONFIG.TWITTER}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description.substring(0,160)}...">
    <meta name="twitter:image" content="${firstImage}">
    
    <link rel="preload" href="${firstImage}" as="image" fetchpriority="high">
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap"></noscript>
    
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" media="print" onload="this.media='all'">
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography" defer></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: { gold: '#d4af37' },
                    fontFamily: { 
                        serif: ['Cinzel', 'serif'],
                        sans: ['Plus Jakarta Sans', 'Prompt', 'sans-serif']
                    },
                    screens: { 'xs': '475px' }
                }
            }
        }
    </script>
    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "${title}",
        "description": "${description}",
        "url": "${provinceUrl}",
        "provider": {
            "@type": "Organization",
            "name": "${CONFIG.BRAND_NAME}",
            "url": "https://${CONFIG.DOMAIN}"
        },
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": ${profiles.length},
            "itemListElement": ${jsonLdProfiles}
        },
        "areaServed": ["${provinceName}", "${zones.slice(0,5).join('", "')}"]
    }
    </script>
    
    <style>
        :root {
            --dark: #121212; --dark-bg: #050505; --gold: #d4af37;
            --glass: rgba(255,255,255,0.08); --white-med: rgba(255,255,255,0.12);
            --transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        * { box-sizing: border-box; }
        body {
            margin: 0; padding: 0; background: var(--dark-bg); color: #f8f9fa;
            font-family: 'Plus Jakarta Sans', 'Prompt', system-ui, sans-serif;
            overflow-x: hidden; line-height: 1.6; min-height: 100vh;
            text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; scroll-behavior: smooth;
        }

        header { min-height: 60vh; height: clamp(60vh, 70vw, 70vh); }
        .aspect-[3/4] { aspect-ratio: 3/4 !important; position: relative; overflow: hidden; }
        .profile-card img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }

        .container-fluid { width: 100%; max-width: 1600px; margin: 0 auto; padding: 0 clamp(1rem, 5vw, 3rem); }

        #gallery-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(clamp(160px, 22vw, 220px), 1fr));
            grid-auto-rows: clamp(240px, 32vw, 320px); gap: clamp(0.75rem, 3vw, 1.5rem); align-items: start;
        }

        .profile-card {
            contain: layout style size; will-change: transform; height: 100%; transition: var(--transition);
            position: relative; overflow: hidden; border-radius: 1.5rem; background: var(--dark);
            border: 1px solid rgba(255,255,255,0.05);
        }
        .profile-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 35px 60px -15px rgba(212,175,55,0.25); z-index: 20; }

        .shimmer-gold {
            background: linear-gradient(135deg, #b38728 0%, #fbf5b7 50%, #aa771c 100%); background-clip: text;
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 300% 100%;
            animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer { 0%,100%{background-position:200% 0} 50%{background-position:-100% 0} }

        .glass-ui { background: var(--glass); backdrop-filter: blur(20px); border: 1px solid var(--white-med); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        .zone-tag {
            background: rgba(255,255,255,0.08) !important; backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.12);
            transition: var(--transition); font-size: clamp(0.625rem, 1.5vw, 0.75rem); padding: 0.5rem 1rem;
        }
        .zone-tag:hover { background: var(--gold) !important; color: #000 !important; border-color: var(--gold); transform: scale(1.05); }

        .fab-line { bottom: max(1.5rem, env(safe-area-inset-bottom)); right: max(1.5rem, env(safe-area-inset-right)); }
        .hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>

<body class="bg-[#050505] text-white selection:bg-gold/30 antialiased">
    <nav id="main-nav" class="fixed top-0 w-full z-[100] px-4 md:px-6 py-4 flex justify-between items-center transition-all duration-500 backdrop-blur-xl border-b border-gold/10 bg-black/30 supports-[backdrop-filter:blur(20px)]:bg-black/20">
        <a href="/" class="text-lg md:text-2xl font-serif font-bold tracking-[0.15em] shimmer-gold hover:scale-105 transition-all duration-300">
            <span class="bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">${CONFIG.BRAND_NAME}</span>
        </a>
        <div class="hidden md:block text-[10px] font-bold tracking-widest text-white/60 uppercase">
            Directory / <span class="text-gold">${provinceName}</span>
        </div>
    </nav>

    <header class="relative flex items-center justify-center text-center px-4 md:px-6 overflow-hidden pt-20 md:pt-24">
        <div class="absolute inset-0 z-0">
            <picture class="block w-full h-[60vh] md:h-[70vh]">
                <img src="${firstImage}" alt="ภาพตัวอย่างไซด์ไลน์พรีเมียม ${provinceName}" 
                     class="w-full h-full object-cover object-center opacity-30" 
                     loading="eager" decoding="async" width="1920" height="1080">
            </picture>
            <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/80 to-[#050505]/100 z-10"></div>
        </div>
        <div class="relative z-20 container-fluid space-y-6 md:space-y-8">
            <p class="reveal text-[9px] md:text-[10px] tracking-[0.5em] uppercase font-black text-gold opacity-0 translate-y-8">Premium Selection ${CONFIG.CURRENT_YEAR}</p>
            <h1 class="reveal text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-[0.85] opacity-0 translate-y-8">
                <span class="font-light italic text-white/70 block text-xl md:text-3xl mb-4">Exclusive</span>
                <span class="shimmer-gold drop-shadow-2xl md:drop-shadow-3xl">ไซด์ไลน์<span class="text-white">${provinceName}</span></span>
            </h1>
        </div>
    </header>

    <main class="container-fluid py-16 md:py-24 lg:py-32">
        <section class="mb-16 lg:mb-24 glass-ui p-6 md:p-10 lg:p-16 rounded-3xl lg:rounded-[3.5rem] text-center mx-auto max-w-6xl shadow-2xl backdrop-blur-xl">
            <h2 class="text-2xl md:text-3xl lg:text-5xl font-serif shimmer-gold mb-6 md:mb-10 italic font-black">หาเด็ก${provinceName} ตัวท็อป รับงานเอง จ่ายหน้างาน</h2>
            <div class="text-white/70 text-sm md:text-base lg:text-lg leading-relaxed max-w-4xl mx-auto font-light mb-8 md:mb-12">${seoText}</div>
            <div class="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto">
                ${zones.slice(0, 12).map((z,i) => `<span class="zone-tag px-4 py-2 md:px-5 md:py-2.5 rounded-full border font-bold uppercase text-white/50 hover:text-black transition-all duration-300 cursor-default zone-tag-${i}">#รับงาน${z}</span>`).join('')}
            </div>
        </section>

        <div id="gallery-grid" class="mb-20 md:mb-28 lg:mb-36">${cardsHTML}</div>

        <section class="text-center py-20 md:py-24 bg-white/5 rounded-[2.5rem] lg:rounded-[3rem] border border-white/8 mb-20 md:mb-28 lg:mb-36 overflow-hidden glass-ui">
            <div class="px-6 md:px-8 mb-12">
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold shimmer-gold mb-4 md:mb-6">ติดตามเราบน Social <i class="fas fa-heart ml-2 text-red-400/60 animate-pulse text-xl"></i></h2>
                <p class="text-sm md:text-base text-white/60 font-light">อัปเดตโปรไฟล์ใหม่ รีวิวจริง และโปรโมชั่นก่อนใคร</p>
            </div>
            <div class="overflow-x-auto hide-scrollbar px-6 md:px-8 pb-6 md:pb-8">
                <div class="flex flex-nowrap gap-4 md:gap-6 py-4 whitespace-nowrap">
                    <a href="${CONFIG.SOCIAL_LINKS.linkedin}" target="_blank" rel="nofollow noopener" class="social-item flex items-center gap-2.5 font-bold text-white/90 bg-[#0077b5]/90 hover:bg-[#0077b5] px-6 py-3 md:px-7 md:py-3.5 rounded-2xl text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300"><i class="fab fa-linkedin text-lg md:text-xl"></i> LinkedIn</a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="nofollow noopener" class="social-item flex items-center gap-2.5 font-bold text-white bg-[#00b900]/90 hover:bg-[#00b900] px-6 py-3 md:px-7 md:py-3.5 rounded-2xl text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300"><i class="fab fa-line text-lg md:text-xl"></i> LINE OA</a>
                    <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="nofollow noopener" class="social-item flex items-center gap-2.5 font-bold text-white bg-black/90 border-2 border-white/30 hover:border-gold/50 px-6 py-3 md:px-7 md:py-3.5 rounded-2xl text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300"><i class="fab fa-tiktok text-lg md:text-xl animate-pulse"></i> TikTok</a>
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="nofollow noopener" class="social-item flex items-center gap-2.5 font-bold text-white bg-[#1d9bf0]/90 hover:bg-[#1d9bf0] px-6 py-3 md:px-7 md:py-3.5 rounded-2xl text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300"><i class="fab fa-x-twitter text-lg md:text-xl"></i> X (Twitter)</a>
                </div>
            </div>
            <div class="mt-12 px-6 md:px-12">
                <p class="inline-block text-[10px] md:text-sm font-bold text-white/90 bg-gradient-to-r from-red-900/50 to-red-800/30 border-2 border-red-500/40 px-8 md:px-10 py-4 md:py-5 rounded-3xl uppercase tracking-[0.15em] shadow-xl">⚠️ เว็บไซต์นี้สำหรับผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น</p>
            </div>
        </section>

        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-24 lg:mb-32 items-start">
            <div class="space-y-6 lg:space-y-8">
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-serif shimmer-gold uppercase tracking-tight">คำถามที่พบบ่อย <span class="text-white italic font-light">FAQ</span></h2>
                <div class="space-y-4 md:space-y-6">
                    <details class="glass-ui p-6 md:p-8 rounded-2xl lg:rounded-3xl cursor-pointer group border border-white/8 hover:border-gold/30 transition-all duration-400">
                        <summary class="flex justify-between font-bold text-sm md:text-base uppercase items-center pb-4">ต้องโอนมัดจำก่อนไหม? <i data-lucide="chevron-down" class="w-5 h-5 text-gold transition-transform duration-300 group-open:rotate-180"></i></summary>
                        <div class="mt-4 text-sm md:text-base text-white/70 border-t border-white/10 pt-6">ไม่ต้องโอนมัดจำครับ ระบบของเราเน้น <strong>นัดเจอ จ่ายเงินหน้างานเท่านั้น</strong></div>
                    </details>
                    <details class="glass-ui p-6 md:p-8 rounded-2xl lg:rounded-3xl cursor-pointer group border border-white/8 hover:border-gold/30 transition-all duration-400">
                        <summary class="flex justify-between font-bold text-sm md:text-base uppercase items-center pb-4">รูปภาพตรงปกหรือไม่? <i data-lucide="chevron-down" class="w-5 h-5 text-gold transition-transform duration-300 group-open:rotate-180"></i></summary>
                        <div class="mt-4 text-sm md:text-base text-white/70 border-t border-white/10 pt-6">น้องๆ ทุกคนตรวจสอบแล้ว หากไม่ตรงปก <strong>ยกเลิกได้ทันทีไม่มีค่าใช้จ่าย</strong></div>
                    </details>
                </div>
            </div>
            <div class="glass-ui p-8 md:p-12 lg:p-16 rounded-[2.5rem] lg:rounded-[3rem] border border-gold/15 relative overflow-hidden">
                <div class="relative z-10">
                    <h3 class="text-2xl md:text-3xl font-serif shimmer-gold mb-6 italic font-bold">พื้นที่บริการครบทุกโซน</h3>
                    <p class="text-xs md:text-sm text-white/50 uppercase tracking-[0.15em] mb-10 leading-relaxed">
                        พิกัดฮอตสุดใน <span class="text-white/90 font-bold">${provinceName}</span><br>
                        <span class="text-gold font-bold text-lg md:text-xl block mt-2">${zones.slice(0,6).join(' • ')}</span>
                    </p>
                    <div class="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                        <div><div class="text-4xl md:text-5xl font-black text-gold mb-2">${profiles.length}+</div><div class="text-xs uppercase text-white/40 font-bold">Active Profiles</div></div>
                        <div><div class="text-4xl md:text-5xl font-black text-gold mb-2">100%</div><div class="text-xs uppercase text-white/40 font-bold">Safe & Verified</div></div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-white/[0.03] pt-20 pb-16 border-t border-white/8 glass-ui">
        <div class="container-fluid">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
                <div class="md:col-span-4 space-y-6">
                    <div class="text-3xl font-serif shimmer-gold uppercase font-black">${CONFIG.BRAND_NAME}</div>
                    <p class="text-xs md:text-sm text-white/60">แพลตฟอร์มไซด์ไลน์พรีเมียมอันดับ 1 ใน ${provinceName}</p>
                </div>
                <div class="md:col-span-3 md:col-end-13 space-y-6">
                    <h3 class="text-white text-sm font-bold uppercase">Hot Zones</h3>
                    <ul class="grid grid-cols-2 gap-3 text-xs text-white/50">
                        ${zones.slice(0,8).map(z=>`<li><a href="/zone/${z.toLowerCase()}" class="hover:text-gold transition-all duration-300">รับงาน ${z}</a></li>`).join('')}
                    </ul>
                </div>
            </div>
            <p class="text-[10px] text-white/40 text-center uppercase tracking-[0.2em]">© ${CONFIG.CURRENT_YEAR} ${CONFIG.BRAND_NAME}. สงวนลิขสิทธิ์ทุกประการ.</p>
        </div>
    </footer>

    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer nofollow" class="fixed z-[999] fab-line w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#00b900] to-[#00d904] text-white flex items-center justify-center shadow-2xl border-4 border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 rounded-2xl">
        <i class="fab fa-line text-2xl md:text-3xl animate-bounce"></i>
    </a>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
    <script>
        function init(){
            if(typeof lucide!=='undefined')lucide.createIcons();
            if(typeof gsap!=='undefined'){
                gsap.fromTo('.reveal',{opacity:0,y:40},{opacity:1,y:0,duration:1.2,stagger:0.2,ease:'expo.out'});
            }
            const nav=document.getElementById('main-nav');
            window.addEventListener('scroll',()=>{
                window.scrollY>100?nav.classList.add('bg-black/95','py-3'):nav.classList.remove('bg-black/95','py-3');
            },{passive:true});
        }
        document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
    </script>
</body>
</html>`;

        return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

    } catch (error) {
        console.error('SSR Error:', error);
        return context.next();
    }
};