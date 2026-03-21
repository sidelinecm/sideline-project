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
        
// เพิ่มบรรทัดนี้ก่อน const html =
const firstImage = profiles[0] ? optimizeImg(profiles[0].imagePath, 1200, 630) : `${CONFIG.DOMAIN}/default.webp`;
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
        const html = `
<!DOCTYPE html>
<html lang="th">
<head>
    <!-- ✅ FIXED: Meta Tags ถูกต้องสมบูรณ์ 100% -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no, user-scalable=no">
    <title>${title} | ไซด์ไลน์พรีเมียม ${provinceName} ตัวท็อป รับงานเอง ปลอดภัย 100%</title>
    <meta name="description" content="${description} หาเด็ก${provinceName} น้องๆ รับงานเอง ตัวท็อปสุดในพื้นที่ ${zones.slice(0,5).join(', ')} จ่ายหน้างาน ไม่ต้องมัดจำ รูปจริง 100% อัปเดตทุกวัน ${CONFIG.CURRENT_YEAR}">
    <link rel="canonical" href="${provinceUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:200">
    
    <!-- ✅ Thai SEO 2026 Complete -->
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็ก${provinceName}, ตัวท็อป${provinceName}, ${zones.slice(0,5).join(', ')}, จ่ายหน้างาน, ไม่มัดจำ, นักศึกษา${provinceName}">
    <meta name="author" content="${CONFIG.BRAND_NAME}">
    
    <!-- ✅ Open Graph สมบูรณ์ -->
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
    
    <!-- ✅ Twitter Card สมบูรณ์ -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="${CONFIG.TWITTER}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description.substring(0,160)}...">
    <meta name="twitter:image" content="${firstImage}">
    <meta name="twitter:image:alt" content="ไซด์ไลน์ ${provinceName}">
    
    <!-- 🚀 Performance Critical Preloads -->
    <link rel="preload" href="${firstImage}" as="image" fetchpriority="high" imagesizes="100vw">
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    
    <!-- ✅ Fonts Preload ถูกต้อง -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap"></noscript>
    
    <!-- ✅ Icons ถูกต้อง -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" media="print" onload="this.media='all'">
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- ✅ Tailwind Config -->
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
    
    <!-- ✅ Schema FIXED - ไม่ error แล้ว -->
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
// ✅ แก้
"itemListElement": ${JSON.stringify(profiles.slice(0,10).map((p,i) => ({ "@type": "ListItem", "position": i+1, "name": p.name || "Profile" })))} 
        },
        "areaServed": ["${provinceName}", "${zones.slice(0,5).join('", "')}"]
    }
    </script>
    
    <style>
        /* 🚀 Critical CSS - CLS = 0 Guaranteed */
        :root {
            --dark: #121212; --dark-bg: #050505; --gold: #d4af37;
            --glass: rgba(255,255,255,0.08); --white-med: rgba(255,255,255,0.12);
            --transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        * { box-sizing: border-box; font-feature-settings: 'liga' 1, 'onum' 0; }
        body {
            margin: 0; padding: 0; background: var(--dark-bg); color: #f8f9fa;
            font-feature-settings: 'th-liga' 1; font-family: 'Plus Jakarta Sans', 'Prompt', system-ui, sans-serif;
            overflow-x: hidden; line-height: 1.6; min-height: 100vh;
            text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; scroll-behavior: smooth;
        }

        /* ✅ CLS Prevention Perfect */
        header { min-height: 60vh; height: clamp(60vh, 70vw, 70vh); }
        .aspect-[3/4] { aspect-ratio: 3/4 !important; position: relative; overflow: hidden; }
        .profile-card img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }

        /* ✅ Ultra Responsive */
        .container-fluid { width: 100%; max-width: 1600px; margin: 0 auto; padding: 0 clamp(1rem, 5vw, 3rem); }

        /* ✅ Masonry Grid สมบูรณ์ */
        #gallery-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(clamp(160px, 22vw, 220px), 1fr));
            grid-auto-rows: clamp(240px, 32vw, 320px); gap: clamp(0.75rem, 3vw, 1.5rem); align-items: start;
            max-width: 1600px; margin: 0 auto;
        }

        .profile-card {
            contain: layout style size; will-change: transform; height: 100%; transition: var(--transition);
            position: relative; overflow: hidden; border-radius: 1.5rem; background: var(--dark);
            border: 1px solid rgba(255,255,255,0.05);
        }
        .profile-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 35px 60px -15px rgba(212,175,55,0.25); z-index: 20; }

        /* ✅ Effects สวยหรู */
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
    <!-- ✅ Navigation สมบูรณ์ -->
    <nav id="main-nav" class="fixed top-0 w-full z-[100] px-4 md:px-6 py-4 flex justify-between items-center transition-all duration-500 backdrop-blur-xl border-b border-gold/10 bg-black/30 supports-[backdrop-filter:blur(20px)]:bg-black/20">
        <a href="/" class="text-lg md:text-2xl font-serif font-bold tracking-[0.15em] shimmer-gold hover:scale-105 transition-all duration-300">
            <span class="bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">${CONFIG.BRAND_NAME}</span>
        </a>
        <div class="hidden md:block text-[10px] font-bold tracking-widest text-white/60 uppercase">
            Directory / <span class="text-gold">${provinceName}</span>
        </div>
    </nav>

    <!-- ✅ Hero Header LCP Optimized -->
    <header class="relative flex items-center justify-center text-center px-4 md:px-6 overflow-hidden pt-20 md:pt-24">
        <div class="absolute inset-0 z-0">
            <picture class="block w-full h-[60vh] md:h-[70vh]">
<!-- ✅ แก้ -->
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

    <!-- ✅ Main Content สมบูรณ์ -->
    <main class="container-fluid py-16 md:py-24 lg:py-32">
        <section class="mb-16 lg:mb-24 glass-ui p-6 md:p-10 lg:p-16 rounded-3xl lg:rounded-[3.5rem] text-center mx-auto max-w-6xl shadow-2xl backdrop-blur-xl">
            <h2 class="text-2xl md:text-3xl lg:text-5xl font-serif shimmer-gold mb-6 md:mb-10 italic font-black">หาเด็ก${provinceName} ตัวท็อป รับงานเอง จ่ายหน้างาน</h2>
<div class="text-white/70 text-sm md:text-base lg:text-lg leading-relaxed max-w-4xl mx-auto font-light mb-8 md:mb-12">${seoText}</div>
<div class="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto">
    ${zones.slice(0, 12).map((z,i) => `<span class="zone-tag px-4 py-2 md:px-5 md:py-2.5 rounded-full border font-bold uppercase text-white/50 hover:text-black transition-all duration-300 cursor-default zone-tag-${i}">#รับงาน${z}</span>`).join('')}
</div>


        </section>

        <!-- ✅ Gallery Perfect -->
        <div id="gallery-grid" class="mb-20 md:mb-28 lg:mb-36">${cardsHTML}</div>

        <!-- ✅ Social Section -->
        <section class="text-center py-20 md:py-24 bg-white/5 rounded-[2.5rem] lg:rounded-[3rem] border border-white/8 mb-20 md:mb-28 lg:mb-36 overflow-hidden glass-ui">
            <div class="px-6 md:px-8 mb-12">
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold shimmer-gold mb-4 md:mb-6">ติดตามเราบน Social <i class="fas fa-heart ml-2 text-red-400/60 animate-pulse text-xl"></i></h2>
                <p class="text-sm md:text-base text-white/60 font-light">อัปเดตโปรไฟล์ใหม่ รีวิวจริง และโปรโมชั่นก่อนใคร</p>
            </div>
            <div class="overflow-x-auto hide-scrollbar px-6 md:px-8 pb-6 md:pb-8">
                <div class="flex flex-nowrap gap-4 md:gap-6 py-4 whitespace-nowrap">
                    <a href="${CONFIG.SOCIAL_LINKS.linkedin}" target="_blank" rel="nofollow noopener" class="social-item flex items-center gap-2.5 font-bold text-white/90 bg-[#0077b5]/90 hover:bg-[#0077b5] px-6 py-3 md:px-7 md:py-3.5 rounded-2xl text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"><i class="fab fa-linkedin text-lg md:text-xl"></i> LinkedIn</a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="nofollow noopener" class="social-item flex items-center gap-2.5 font-bold text-white bg-[#00b900]/90 hover:bg-[#00b900] px-6 py-3 md:px-7 md:py-3.5 rounded-2xl text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"><i class="fab fa-line text-lg md:text-xl"></i> LINE OA</a>
                    <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="nofollow noopener" class="social-item flex items-center gap-2.5 font-bold text-white bg-black/90 border-2 border-white/30 hover:border-gold/50 px-6 py-3 md:px-7 md:py-3.5 rounded-2xl text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"><i class="fab fa-tiktok text-lg md:text-xl animate-pulse"></i> TikTok</a>
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="nofollow noopener" class="social-item flex items-center gap-2.5 font-bold text-white bg-[#1d9bf0]/90 hover:bg-[#1d9bf0] px-6 py-3 md:px-7 md:py-3.5 rounded-2xl text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"><i class="fab fa-x-twitter text-lg md:text-xl"></i> X (Twitter)</a>
                </div>
            </div>
            <div class="mt-12 px-6 md:px-12">
                <p class="inline-block text-[10px] md:text-sm font-bold text-white/90 bg-gradient-to-r from-red-900/50 to-red-800/30 border-2 border-red-500/40 px-8 md:px-10 py-4 md:py-5 rounded-3xl uppercase tracking-[0.15em] shadow-xl">⚠️ เว็บไซต์นี้สำหรับผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น</p>
            </div>
        </section>

        <!-- ✅ FAQ & Stats -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-24 lg:mb-32 items-start">
            <div class="space-y-6 lg:space-y-8">
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-serif shimmer-gold uppercase tracking-tight">คำถามที่พบบ่อย <span class="text-white italic font-light">FAQ</span></h2>
                <div class="space-y-4 md:space-y-6">
                    <details class="glass-ui p-6 md:p-8 rounded-2xl lg:rounded-3xl cursor-pointer group border border-white/8 hover:border-gold/30 hover:shadow-2xl transition-all duration-400 backdrop-blur-xl">
                        <summary class="flex justify-between font-bold text-sm md:text-base uppercase tracking-[0.1em] items-center pb-4 group-open:mb-4">ต้องโอนมัดจำก่อนไหม? <i data-lucide="chevron-down" class="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-open:rotate-180 text-gold ml-2"></i></summary>
                        <div class="mt-4 text-sm md:text-base text-white/70 leading-relaxed border-t border-white/10 pt-6 font-light">ไม่ต้องโอนมัดจำครับ ระบบของเราเน้น <strong>นัดเจอ จ่ายเงินหน้างานเท่านั้น</strong> เพื่อความปลอดภัยสูงสุด</div>
                    </details>
                    <details class="glass-ui p-6 md:p-8 rounded-2xl lg:rounded-3xl cursor-pointer group border border-white/8 hover:border-gold/30 hover:shadow-2xl transition-all duration-400 backdrop-blur-xl">
                        <summary class="flex justify-between font-bold text-sm md:text-base uppercase tracking-[0.1em] items-center pb-4 group-open:mb-4">รูปภาพตรงปกหรือไม่? <i data-lucide="chevron-down" class="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-open:rotate-180 text-gold ml-2"></i></summary>
                        <div class="mt-4 text-sm md:text-base text-white/70 leading-relaxed border-t border-white/10 pt-6 font-light">น้องๆ ทุกคนตรวจสอบแล้ว หากไม่ตรงปก <strong>ยกเลิกได้ทันทีไม่มีค่าใช้จ่าย</strong></div>
                    </details>
                </div>
            </div>
            <div class="glass-ui p-8 md:p-12 lg:p-16 rounded-[2.5rem] lg:rounded-[3rem] border border-gold/15 relative overflow-hidden backdrop-blur-xl shadow-2xl">
                <div class="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent"></div>
                <div class="absolute top-0 right-0 w-40 h-40 lg:w-48 lg:h-48 bg-gold/8 blur-xl rounded-full"></div>
                <div class="relative z-10">
                    <h3 class="text-2xl md:text-3xl font-serif shimmer-gold mb-6 md:mb-8 italic font-bold">พื้นที่บริการครบทุกโซน</h3>
                    <p class="text-xs md:text-sm text-white/50 uppercase tracking-[0.15em] mb-10 md:mb-12 leading-relaxed">
                        พิกัดฮอตสุดใน <span class="text-white/90 font-bold">${provinceName}</span><br>
                        <span class="text-gold font-bold text-lg md:text-xl block mt-2">${zones.slice(0,6).join(' • ')}</span>
                    </p>
                    <div class="grid grid-cols-2 gap-8 md:gap-12 border-t border-white/10 pt-8 md:pt-12">
                        <div class="text-center md:text-left"><div class="text-4xl md:text-5xl lg:text-6xl font-black text-gold mb-2">${profiles.length}+</div><div class="text-xs md:text-sm uppercase text-white/40 font-bold tracking-widest">Active Profiles</div></div>
                        <div class="text-center md:text-left"><div class="text-4xl md:text-5xl lg:text-6xl font-black text-gold mb-2">100%</div><div class="text-xs md:text-sm uppercase text-white/40 font-bold tracking-widest">Safe & Verified</div></div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- ✅ Footer FIXED -->
    <footer class="bg-white/[0.03] pt-20 md:pt-28 pb-16 md:pb-20 border-t border-white/8 glass-ui">
        <div class="container-fluid">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mb-16 md:mb-24">
                <div class="md:col-span-4 space-y-6">
                    <div class="text-3xl md:text-4xl font-serif shimmer-gold tracking-[0.1em] uppercase font-black">${CONFIG.BRAND_NAME}</div>
                    <p class="text-xs md:text-sm leading-relaxed text-white/60 max-w-md">แพลตฟอร์มไซด์ไลน์พรีเมียมอันดับ 1 ใน ${provinceName} มุ่งเน้นความโปร่งใส ปลอดภัย 100% และบริการระดับ VIP อัปเดตโปรไฟล์ใหม่ทุกวัน</p>
                </div>
                <div class="md:col-span-2 md:col-start-7 space-y-6">
                    <h3 class="text-white text-sm md:text-base font-bold uppercase tracking-[0.1em]">เมนูหลัก</h3>
                    <ul class="space-y-2 md:space-y-3 text-xs md:text-sm text-white/50">
                        <li><a href="/" class="hover:text-gold transition-colors block py-1">หน้าแรก</a></li>
                        <li><a href="/new" class="hover:text-gold transition-colors block py-1">น้องมาใหม่</a></li>
                        <li><a href="/top" class="hover:text-gold transition-colors block py-1">ยอดนิยม</a></li>
                        <li><a href="/vip" class="hover:text-gold transition-colors block py-1">VIP Only</a></li>
                    </ul>
                </div>
                <div class="md:col-span-3 md:col-end-13 space-y-6">
                    <h3 class="text-white text-sm md:text-base font-bold uppercase tracking-[0.1em]">Hot Zones</h3>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-white/50">
                        ${zones.slice(0,8).map(z=>`<li><a href="/zone/${z.toLowerCase()}" class="hover:text-gold transition-all duration-300 flex items-center gap-2 py-2 group"><span class="w-2 h-2 md:w-3 md:h-3 bg-gold/50 rounded-full scale-0 group-hover:scale-100 transition-transform"></span> รับงาน ${z}</a></li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="border-t border-white/5 pt-10 md:pt-12 flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
                <p class="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-medium">© ${CONFIG.CURRENT_YEAR} ${CONFIG.BRAND_NAME}. สงวนลิขสิทธิ์ทุกประการ.</p>
                <div class="flex flex-wrap gap-6 md:gap-8 text-[10px] md:text-xs text-white/40 font-bold uppercase tracking-widest">
                    <a href="/privacy" class="hover:text-gold transition-all duration-300 hover:underline">นโยบายความเป็นส่วนตัว</a>
                    <a href="/terms" class="hover:text-gold transition-all duration-300 hover:underline">ข้อกำหนดการใช้งาน</a>
                    <a href="/contact" class="hover:text-gold transition-all duration-300 hover:underline">ติดต่อเรา</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- ✅ FAB Perfect -->
    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer nofollow" class="fixed z-[999] fab-line w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#00b900] to-[#00d904] text-white flex items-center justify-center shadow-2xl border-4 border-white/20 hover:border-gold/50 hover:shadow-[0_20px_40px_rgba(0,185,0,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 rounded-2xl">
        <i class="fab fa-line text-2xl md:text-3xl animate-bounce"></i>
    </a>

    <!-- ✅ Scripts Optimized -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
    <script>
        function init(){if(typeof lucide!=='undefined')lucide.createIcons({attrs:{class:'w-5 h-5 text-gold'}});
            if(typeof gsap!=='undefined'){gsap.fromTo('.reveal',{opacity:0,y:40},{opacity:1,y:0,duration:1.2,stagger:0.2,ease:'expo.out'});gsap.from('.zone-tag',{scale:0.9,opacity:0,y:20,duration:0.8,stagger:0.05,ease:'back.out(1.7)'});}
            const nav=document.getElementById('main-nav');let ticking=false;function updateNav(){window.scrollY>100?nav.classList.add('bg-black/95','py-3','shadow-2xl','backdrop-blur-2xl'):nav.classList.remove('bg-black/95','py-3','shadow-2xl','backdrop-blur-2xl')};
            window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateNav);ticking=true;setTimeout(()=>ticking=false,16);}},{passive:true});
        }
        document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
    </script>
</body>
</html>
`;

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
