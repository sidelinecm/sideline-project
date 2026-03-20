import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// ==========================================
// 1. CONFIGURATION - FULL FEATURE
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai',
    BRAND_TH: 'ไซด์ไลน์เชียงใหม่',
    TWITTER: '@sidelinecm',
    CURRENT_YEAR: 2026,
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
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280'
    }
};

// ==========================================
// 2. HELPER FUNCTIONS - FULL
// ==========================================
const optimizeImg = (path, width = 400, height = 533, priority = false) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        const params = `/upload/f_auto,q_auto,w_${width},h_${height},c_fill,g_face,f_avif`;
        return path.replace('/upload/', params + '/');
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const getLocalZones = (provinceKey) => {
    return CONFIG.PROVINCES[provinceKey.toLowerCase()]?.zones || ['ตัวเมือง', 'พื้นที่ใกล้เคียง'];
};

const generateMasterSeoText = (province, zones, count) => {
    const intros = [
        `กำลังมองหา **ไซด์ไลน์${province}** อยู่ใช่ไหม? ที่นี่เรามีน้องๆ ให้เลือกกว่า ${count} คน ทุกโปรไฟล์คัดมาแล้วว่าตรงปก 100%`,
        `รวมพิกัด **รับงาน${province}** น้องๆ นักศึกษาและพริตตี้พรีเมียม พร้อมดูแลคุณแบบฟิวแฟนในราคาที่เป็นกันเอง`,
        `อัปเดตรายชื่อ **เด็กเอ็น${province}** ล่าสุดปี ${CONFIG.CURRENT_YEAR} เน้นงานคุณภาพ ปลอดภัย นัดง่าย ไม่ต้องผ่านโมเดลลิ่ง`
    ];
    
    const features = [
        `ให้บริการครอบคลุมพื้นที่ **${zones.slice(0, 5).join(', ')}** และโซนใกล้เคียง เดินทางสะดวก นัดหมายได้ตลอด 24 ชั่วโมง`,
        `มั่นใจได้ 100% ด้วยระบบ **จ่ายเงินหน้างาน** ไม่ต้องโอนมัดจำก่อนล่วงหน้า ปลอดภัยทั้งผู้ใช้บริการและน้องๆ`,
        `น้องๆ ทุกคนผ่านการยืนยันตัวตน มีรีวิวจากผู้ใช้งานจริง การันตีความเป็นกันเองและงานบริการระดับพรีเมียม`
    ];

    // สุ่มเนื้อหาทุกครั้งที่ Refresh เพื่อผลดีทาง SEO
    const randomInt = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    return `
        <p class="mb-6">${randomInt(intros)}</p>
        <p class="mb-0 text-white/60">${randomInt(features)}</p>
    `;
};

// ==========================================
// 3. CARDS GENERATOR - FULL RESPONSIVE
// ==========================================
const generateCardsHTML = (profiles, provinceName) => profiles.map((p, i) => `
<a href="/sideline/${p.slug}" class="profile-card group relative bg-gradient-to-b from-[#0a0a0a] to-black/60 rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-gold/40 transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col min-h-[340px] md:min-h-[380px]" style="contain: layout style;">
    <!-- Image Container - Fixed Aspect Ratio -->
    <div class="aspect-[3/4] relative overflow-hidden flex-shrink-0">
        <img src="${optimizeImg(p.imagePath, i < 4 ? 500 : 400, i < 4 ? 667 : 533)}" 
             alt="น้อง${p.name} รับงาน${provinceName} พิกัด ${p.location || provinceName}" 
             class="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05] group-hover:brightness-[1.05]"
             ${i < 4 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} 
             decoding="async" draggable="false">
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
        
        <!-- Verified Badge -->
        <div class="absolute bottom-3 left-3 z-10">
            <span class="bg-black/80 backdrop-blur-md text-gold text-[11px] sm:text-[10px] md:text-[9px] px-2.5 sm:px-3 py-1.5 rounded-full border border-gold/30 font-bold uppercase italic tracking-widest shadow-lg whitespace-nowrap">
                ● Verified Profile
            </span>
        </div>
        
        <!-- Featured Badge -->
        ${p.isfeatured ? `
        <div class="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500 text-black text-[11px] sm:text-[10px] md:text-[8px] font-black px-3 py-1.5 rounded-full uppercase shadow-2xl animate-pulse border-2 border-white/50">
            ★ Top Pick
        </div>` : ''}
    </div>
    
    <!-- Content -->
    <div class="p-4 md:p-5 lg:p-6 flex-1 flex flex-col justify-between">
        <div class="mb-3 md:mb-4">
            <div class="flex justify-between items-start mb-1.5">
                <h3 class="font-bold text-base sm:text-lg md:text-xl italic line-clamp-1 shimmer-gold leading-tight pr-2">
                    ${p.name}
                </h3>
                <span class="text-gold text-[13px] sm:text-xs md:text-sm font-black ml-2 flex-shrink-0 whitespace-nowrap">
                    ★ ${p.rate || '4.9'}
                </span>
            </div>
            <p class="text-[12px] md:text-[11px] text-white/85 font-bold uppercase tracking-widest line-clamp-1">
                ${p.location || provinceName}
            </p>
        </div>
        <span class="inline-block w-full bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold text-[12px] px-4 py-2.5 rounded-full border border-gold/30 font-bold uppercase tracking-wide text-center hover:from-gold/30 hover:to-gold/20 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 cursor-pointer group-hover:scale-[1.02]">
            ดูโปรไฟล์เต็ม
        </span>
    </div>
</a>`).join('');

// ==========================================
// 3. MAIN SSR FUNCTION - COMPLETED VERSION
// ==========================================
export default async (request, context) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    // ดึงค่า provinceKey จาก URL หรือค่าเริ่มต้นเป็น chiangmai
    const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

    try {
        // ใช้ Environment Variables เพื่อความปลอดภัยสูงสุด (ถ้ามี)
        const supabase = createClient(
            CONFIG.SUPABASE_URL, 
            CONFIG.SUPABASE_KEY
        );

        // 3.1 Fetch Data - ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase
            .from('provinces')
            .select('id, nameThai, key')
            .eq('key', provinceKey)
            .maybeSingle();

        if (!provinceData) return context.next();

        // 3.2 Fetch Profiles - ดึงข้อมูลน้องๆ ในจังหวัดนั้นๆ
        const { data: profiles } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, location, rate, isfeatured, lastUpdated')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('lastUpdated', { ascending: false })
            .limit(60);

        if (!profiles || profiles.length === 0) return context.next();

        // --- เตรียมตัวแปรสำหรับ HTML ---
        const provinceName = provinceData.nameThai;
        const zones = getLocalZones(provinceKey);
        const CURRENT_YEAR = new Date().getFullYear();
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
const firstImage = (profiles && profiles.length > 0) 
    ? optimizeImg(profiles[0].imagePath, 1200, 630) // ไม่ต้องใส่ true บรรทัดนี้ เพราะฟังก์ชันรับแค่ 3 parameter
    : `${CONFIG.DOMAIN}/default-share.jpg`;
        // สร้างเนื้อหา SEO Hero (ส่วนที่ขาดไปในตอนแรก)
        const seoText = generateMasterSeoText(provinceName, zones, profiles.length);
        
        // สร้างการ์ดโปรไฟล์ทั้งหมด
        const cardsHTML = generateCardsHTML(profiles, provinceName);

        // 🎯 4. SEO CONFIGURATION - Schema.org
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
                    "publisher": { "@id": `${CONFIG.DOMAIN}#organization` }
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
                            "acceptedAnswer": { "@type": "Answer", "text": `ครอบคลุมโซนยอดนิยม เช่น ${zones.slice(0, 5).join(', ')} และพื้นที่ใกล้เคียง` }
                        }
                    ]
                }
            ]
        };


        // COMPLETE HTML OUTPUT
        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no, user-scalable=no">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${provinceUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="ไซด์ไลน์${provinceName}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${provinceUrl}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="${CONFIG.TWITTER}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${firstImage}">
    
    <!-- Preloads -->
    <link rel="preload" href="${firstImage}" as="image" fetchpriority="high">
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" media="print" onload="this.media='all'">
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography" defer></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { gold: '#d4af37' },
                    fontFamily: { 
                        serif: ['Cinzel', 'serif'],
                        sans: ['Plus Jakarta Sans', 'Prompt', 'sans-serif']
                    }
                }
            }
        }
    </script>
    
    <!-- Schema -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
<style>
        :root {
            --dark: #121212;
            --gold: #d4af37;
            --glass: rgba(255,255,255,0.08);
            --white-med: rgba(255,255,255,0.12);
        }

        /* 1. Base Setup */
        * { box-sizing: border-box; }
        body {
            margin: 0; padding: 0;
            background: var(--dark);
            color: #f8f9fa;
            font-family: 'Plus Jakarta Sans', 'Prompt', system-ui, sans-serif;
            overflow-x: hidden;
            line-height: 1.6;
            min-height: 100vh;
        }

        /* 2. Container Utility */
        .container {
            width: 100%; 
            max-width: 1400px; /* ปรับให้พอดีกับหน้าจอส่วนใหญ่ */
            margin: 0 auto; 
            padding: 0 clamp(1rem, 5vw, 2.5rem);
        }

        /* 3. Custom Profile Card (Tailwind ทำไม่ได้ทั้งหมด) */
        .profile-card {
            contain: layout style;
            will-change: transform;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .profile-card:hover {
            transform: translateY(-10px) scale(1.01);
            box-shadow: 0 25px 50px -12px rgba(212, 175, 55, 0.3);
            z-index: 10;
        }

        /* 4. Effects & Shimmers */
        .shimmer-gold {
            background: linear-gradient(135deg, #b38728 0%, #fbf5b7 50%, #aa771c 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 200% 100%;
            animation: shimmer 4s ease-in-out infinite;
        }

        @keyframes shimmer {
            0%, 100% { background-position: 200% 0; }
            50% { background-position: 0 0; }
        }

        .glass-ui {
            background: var(--glass);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--white-med);
        }

        .zone-tag {
            background: rgba(255,255,255,0.1) !important;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.15);
            transition: all 0.3s ease;
        }
        
        .zone-tag:hover {
            background: var(--gold) !important;
            color: black !important;
            border-color: var(--gold);
        }

        /* 5. Utility Fixes */
        .aspect-portrait { aspect-ratio: 3/4; }
        
        /* ปรับตำแหน่ง FAB สำหรับ iPhone ที่มีรอยบากด้านล่าง */
        .fab-line {
            bottom: calc(clamp(1.25rem, 6vw, 2.25rem) + env(safe-area-inset-bottom));
        }
.profile-card .aspect-\[3\/4\] {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4; /* ล็อคสัดส่วนที่ระดับ Container */
    overflow: hidden;
    background: #1a1a1a; /* สีสำรอง */
}

.profile-card img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* ป้องกันรูปเบี้ยว 100% */
}
    </style>
</head>
<body class="bg-[#050505] text-white selection:bg-gold/30">
    <nav id="main-nav" class="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center transition-all duration-500 backdrop-blur-md border-b border-gold/10 bg-black/20">
        <a href="/" class="text-xl md:text-2xl font-serif font-bold tracking-[0.2em] shimmer-gold hover:scale-105 transition-transform duration-300">
            ${CONFIG.BRAND_NAME}
        </a>
        <div class="text-[10px] font-bold tracking-widest text-white/50 uppercase">
            Directory / <span class="text-gold">${provinceName}</span>
        </div>
    </nav>

<header class="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center px-6 overflow-hidden">
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-[#050505] z-10"></div>
            <img src="${optimizeImg(profiles[0].imagePath, 1200, 800)}" 
                 alt="ไซด์ไลน์${provinceName}" 
                 class="absolute top-0 left-0 w-full h-full object-cover object-center opacity-40">
        </div>
        <div class="relative z-20 max-w-5xl space-y-6">
            <p class="reveal text-[10px] tracking-[0.6em] uppercase font-black text-gold opacity-0 translate-y-4">
                Premium Selection ${CONFIG.CURRENT_YEAR}
            </p>
            <h1 class="reveal text-4xl md:text-8xl font-serif font-bold leading-tight opacity-0 translate-y-4">
                <span class="font-light italic text-white/80 text-2xl md:text-4xl block mb-2">Exclusive</span>
                <span class="shimmer-gold drop-shadow-3xl">ไซด์ไลน์${provinceName}</span>
            </h1>
        </div>
    </header>

    <main class="max-w-[1500px] mx-auto px-6 py-12">
        <section class="mb-20 glass-ui p-8 md:p-16 rounded-[3.5rem] text-center border border-white/5 shadow-2xl">
            <h2 class="text-2xl md:text-4xl font-serif shimmer-gold mb-8 italic">หาเด็ก${provinceName} น้องๆ รับงานเอง ตัวท็อป</h2>
            <div class="text-white/60 text-base md:text-lg leading-loose max-w-4xl mx-auto font-light mb-10">
                ${generateMasterSeoText(provinceName, zones, profiles.length)}
            </div>
            
            <div class="flex flex-wrap justify-center gap-2">
                ${zones.slice(0, 10).map(z => `
                    <span class="text-[9px] md:text-[10px] px-5 py-2.5 bg-white/5 rounded-full border border-white/5 uppercase font-bold text-white/40 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 cursor-default">
                        #รับงาน${z}
                    </span>
                `).join('')}
            </div>
        </section>

        <div id="gallery-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10 mb-24">
            ${cardsHTML}
        </div>

        <section class="social-media-section text-center py-16 bg-white/[0.02] rounded-[3rem] border border-white/5 mb-24 overflow-hidden">
            <div class="px-4 mb-10">
                <h2 class="text-xl md:text-3xl font-bold shimmer-gold mb-3">ติดตามเราบน Social Media <i class="fas fa-heart ml-2 text-red-500/50 animate-pulse"></i></h2>
                <p class="text-sm text-gray-500">อัปเดตโปรไฟล์ใหม่ล่าสุดและรีวิวงานจริงก่อนใคร</p>
            </div>

            <div class="social-marquee-wrap overflow-x-auto hide-scrollbar px-4 pb-4">
                <div class="flex flex-nowrap md:justify-center gap-4 py-2">
                    <a href="${CONFIG.SOCIAL_LINKS.linkedin}" target="_blank" rel="nofollow" class="social-item flex items-center gap-2 font-bold text-white bg-[#0077b5] px-5 py-2.5 rounded-xl text-sm hover:scale-105 transition-transform"><i class="fa-brands fa-linkedin text-lg"></i> LinkedIn</a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="nofollow" class="social-item flex items-center gap-2 font-bold text-white bg-[#06c755] px-5 py-2.5 rounded-xl text-sm hover:scale-105 transition-transform"><i class="fab fa-line text-lg"></i> LINE OA</a>
                    <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="nofollow" class="social-item flex items-center gap-2 font-bold text-white bg-black border border-white/20 px-5 py-2.5 rounded-xl text-sm hover:scale-105 transition-transform"><i class="fab fa-tiktok text-lg"></i> TikTok</a>
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="nofollow" class="social-item flex items-center gap-2 font-bold text-white bg-[#1da1f2] px-5 py-2.5 rounded-xl text-sm hover:scale-105 transition-transform"><i class="fab fa-x-twitter text-lg"></i> Twitter</a>
                </div>
            </div>
            
            <div class="mt-10 px-6">
                <p class="inline-block text-[10px] md:text-xs font-bold text-white bg-red-900/40 border border-red-500/20 px-8 py-3 rounded-full uppercase tracking-[0.2em]">
                    เว็บไซต์นี้สำหรับผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น
                </p>
            </div>
        </section>

        <section class="grid md:grid-cols-2 gap-10 mb-24 items-start">
            <div class="space-y-6">
                <h2 class="text-3xl font-serif shimmer-gold uppercase tracking-tighter">Common <span class="text-white italic">Questions</span></h2>
                <div class="space-y-4">
                    <details class="glass-ui p-6 rounded-2xl cursor-pointer group border border-white/5 hover:border-gold/20 transition-all">
                        <summary class="flex justify-between font-bold text-xs uppercase tracking-widest items-center">ต้องโอนมัดจำก่อนไหม? <i data-lucide="plus" class="w-4 h-4 transition-transform group-open:rotate-45 text-gold"></i></summary>
                        <div class="mt-4 text-sm text-white/50 leading-relaxed border-t border-white/5 pt-4">ไม่ต้องโอนมัดจำครับ ระบบของเราเน้นนัดเจอ จ่ายเงินหน้างานเท่านั้น เพื่อความปลอดภัยสูงสุดของลูกค้าทุกท่าน</div>
                    </details>
                    <details class="glass-ui p-6 rounded-2xl cursor-pointer group border border-white/5 hover:border-gold/20 transition-all">
                        <summary class="flex justify-between font-bold text-xs uppercase tracking-widest items-center">รูปภาพตรงปกหรือไม่? <i data-lucide="plus" class="w-4 h-4 transition-transform group-open:rotate-45 text-gold"></i></summary>
                        <div class="mt-4 text-sm text-white/50 leading-relaxed border-t border-white/5 pt-4">น้องๆ ทุกคนได้รับการตรวจสอบเบื้องต้น หากนัดแล้วไม่ตรงปกหรือไม่พอใจ สามารถยกเลิกงานได้ทันทีโดยไม่มีค่าใช้จ่ายมัดจำครับ</div>
                    </details>
                </div>
            </div>
            
            <div class="glass-ui p-10 rounded-[3rem] border border-gold/10 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] rounded-full"></div>
                <h3 class="text-xl font-serif shimmer-gold mb-4 italic">Exclusive Area Coverage</h3>
                <p class="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-8 leading-loose">
                    บริการครอบคลุมพิกัด: <br>
                    <span class="text-white/80">${zones.slice(0, 8).join(' • ')}</span>
                </p>
                <div class="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                    <div>
                        <div class="text-3xl font-bold text-gold">${profiles.length}+</div>
                        <div class="text-[9px] uppercase text-white/30 font-bold tracking-widest">Active Now</div>
                    </div>
                    <div>
                        <div class="text-3xl font-bold text-gold">100%</div>
                        <div class="text-[9px] uppercase text-white/30 font-bold tracking-widest">Safe & Private</div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-white/[0.02] pt-20 pb-10 border-t border-white/5">
        <div class="max-w-[1500px] mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                <div class="md:col-span-4 space-y-6">
                    <div class="text-2xl font-serif shimmer-gold tracking-widest uppercase font-bold">${CONFIG.BRAND_NAME}</div>
                    <p class="text-xs leading-relaxed text-gray-500 max-w-sm">
                        แพลตฟอร์มพรีเมียมไซด์ไลน์อันดับ 1 ใน${provinceName} มุ่งเน้นความโปร่งใส ปลอดภัย และบริการระดับพิวแฟน (Girlfriend Experience) อัปเดตรายวัน
                    </p>
                </div>
                
                <div class="md:col-span-2 md:col-start-7 space-y-6">
                    <h3 class="text-white text-xs font-bold uppercase tracking-widest">Explore</h3>
                    <ul class="space-y-3 text-[11px] text-gray-500">
                        <li><a href="/" class="hover:text-gold transition-colors">หน้าแรก</a></li>
                        <li><a href="#" class="hover:text-gold transition-colors">น้องมาใหม่</a></li>
                        <li><a href="#" class="hover:text-gold transition-colors">ยอดนิยม</a></li>
                    </ul>
                </div>

                <div class="md:col-span-3 space-y-6">
                    <h3 class="text-white text-xs font-bold uppercase tracking-widest">Hot Locations</h3>
                    <ul class="grid grid-cols-1 gap-3 text-[11px] text-gray-500">
                        ${zones.slice(0, 4).map(z => `
                            <li><a href="#" class="hover:text-gold transition-colors flex items-center gap-2">
                                <span class="w-1 h-1 bg-gold/40 rounded-full"></span> รับงาน${z}
                            </a></li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <div class="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-[9px] text-gray-600 uppercase tracking-[0.3em]">© 2026 ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
                <div class="flex gap-8 text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                    <a href="#" class="hover:text-gold transition">Privacy Policy</a>
                    <a href="#" class="hover:text-gold transition">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <a href="${CONFIG.SOCIAL_LINKS.line}" 
       target="_blank" 
       rel="noopener noreferrer" 
       class="fixed bottom-[30px] right-[30px] z-[9999] bg-[#06c755] text-white w-[65px] h-[65px] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(6,199,85,0.4)] border-2 border-white/20 hover:scale-110 active:scale-95 transition-all duration-300">
        <i class="fab fa-line text-3xl"></i>
    </a>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
    <script>
        function initializePage() {
            // Lucide Icons setup
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // GSAP Entrance Animations
            if (typeof gsap !== 'undefined') {
                gsap.to('.reveal', { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1.4, 
                    stagger: 0.25, 
                    ease: 'expo.out' 
                });
            }

            // Smooth Scroll Navbar Effect
            const nav = document.getElementById('main-nav');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    nav.classList.add('bg-black/90', 'py-3', 'shadow-2xl');
                } else {
                    nav.classList.remove('bg-black/90', 'py-3', 'shadow-2xl');
                }
            }, { passive: true });
        }

        // Run when ready
        document.readyState === 'loading' 
            ? document.addEventListener('DOMContentLoaded', initializePage) 
            : initializePage();
    </script>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=3600, s-maxage=3600, immutable",
                "X-Content-Type-Options": "nosniff"
            }
        });

    } catch (e) {
        console.error('SSR Critical Error:', e);
        return context.next();
    }
};
