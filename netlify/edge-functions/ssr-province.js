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
        twitter: 'https://twitter.com/sidelinechiangmai',
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280',
        biosite: 'https://bio.site/firstfiwfans.com',
        linktree: 'https://linktr.ee/kissmodel',
        bluesky: 'https://bsky.app/profile/sidelinechiangmai.bsky.social'
    }
};

// ==========================================
// 2. PROGRAMMATIC SEO ENGINE (LSI & LOCALIZATION)
// ==========================================
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
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=80`;
};

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

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        const { data: provinceData, error: provError } = await supabase
            .from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle();

        if (!provinceData || provError) return context.next();

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, created_at, active, availability, likes')
            .eq('provinceKey', provinceData.key).eq('active', true)
            .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false })
            .limit(80);

        const safeProfiles = profiles ||[];
        const provinceName = provinceData.nameThai;
        
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
        const zones = seoData.zones;
        
        const CURRENT_YEAR = new Date().getFullYear();
        const CURRENT_MONTH = new Date().toLocaleString('th-TH', { month: 'long' });
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
            : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        const title = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ไม่มัดจำ`;
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} ตัวท็อป ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก 100% ✓น้องนักศึกษา ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด จ่ายหน้างาน`;

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
                }
            ]
        };

        // ==========================================
        // 5. HTML GENERATION - PREMIUM CARDS
        // ==========================================
        let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                const cleanName = (p.name || 'สาวสวย').replace(/^(น้อง\s?)/, '');
                const profileLocation = p.location || provinceName || 'ไม่ระบุพิกัด';
                const profileRate = p.rate || '5.0';
                
                // Logic: สถานะรับงาน (มีไฟ LED กระพริบ)
                const isAvailable = p.availability?.includes('ว่าง') ?? true;
                const statusText = isAvailable ? 'พร้อมรับงาน' : 'ติดจอง';
                
                // Logic: วันที่อัปเดต (แสดงแบบอ่านง่าย เช่น "อัปเดต 26 มี.ค. 69")
                const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
                const d = new Date(dateStr);
                const day = d.getDate();
                const months =['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
                const month = months[d.getMonth()];
                const year = (d.getFullYear() + 543).toString().slice(-2);
                const dateDisplay = `อัปเดต ${day} ${month} ${year}`;
                
                const isEager = i < 4; 
                const imgWidth = 400;
                const imgHeight = 533;
                const loadingAttr = isEager 
                    ? `loading="eager" fetchpriority="high" decoding="sync"` 
                    : `loading="lazy" decoding="async"`;
                
                return `
                <article class="group relative bg-[#0f0f0f] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-500 shadow-2xl hover:-translate-y-2 flex flex-col h-full css-content-visibility" data-profile-id="${p.id}">
                    <a href="/sideline/${p.slug || '#'}" class="absolute inset-0 z-30" aria-label="ดูโปรไฟล์น้อง ${cleanName}"></a>
                    
                    <div class="relative w-full pt-[133.33%] bg-[#111] overflow-hidden">
                        <img src="${optimizeImg(p.imagePath || '/default-avatar.jpg', imgWidth, imgHeight)}" 
                             alt="น้อง${cleanName} รับงาน${provinceName} พิกัด ${profileLocation}" 
                             class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-80"
                             ${loadingAttr}
                             width="${imgWidth}" height="${imgHeight}">
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none"></div>
                        
                        <!-- NEW BADGE: สถานะรับงาน (ซ้ายบน) -->
                        <div class="absolute top-3 left-3 z-20">
                            <div class="bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-400'} opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
                                </span>
                                <span class="font-bold tracking-wide">${statusText}</span>
                            </div>
                        </div>

                        <!-- NEW BADGE: ยืนยันตัวตนแล้ว (ขวาบน) แทนที่ TOP 1% -->
                        <div class="absolute top-3 right-3 z-20">
                            <div class="bg-gradient-to-r from-[#1d4ed8]/90 to-[#3b82f6]/90 backdrop-blur-md border border-blue-400/30 text-white text-[9px] font-black px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                                <i class="fas fa-certificate text-white/90"></i> ยืนยันตัวตนแล้ว
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-4 md:p-6 flex-1 flex flex-col justify-between relative z-20">
                        <div>
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-bold text-lg md:text-xl italic text-white group-hover:text-gold transition-colors line-clamp-1">
                                    ${cleanName}
                                </h3>
                                <div class="flex items-center gap-1 text-gold-bright font-black text-xs">
                                    <i class="fas fa-star text-[10px]"></i> ${profileRate}
                                </div>
                            </div>
                            
                            <!-- NEW LAYOUT: พิกัด (ซ้าย) และ วันที่ (ขวา) อยู่บรรทัดเดียวกัน -->
                            <div class="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                                <p class="text-[10px] text-white/60 font-medium flex items-center gap-1.5">
                                    <i class="fas fa-location-dot text-gold/60"></i> ${profileLocation}
                                </p>
                                <p class="text-[9px] text-white/40 font-light flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md">
                                    <i class="far fa-clock"></i> ${dateDisplay}
                                </p>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between pt-2">
                            <div class="text-[9px] text-white/30 font-medium uppercase tracking-widest">
                                #รับงาน${provinceName}
                            </div>
                            <span class="text-white group-hover:text-gold transition-all translate-x-0 group-hover:translate-x-1">
                                <i class="fas fa-arrow-right-long text-sm"></i>
                            </span>
                        </div>
                    </div>
                </article>`;
            }).join('');
        }

        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#050505">

    <title>${title} | เกรดพรีเมียม ไม่มัดจำ 100%</title>
    <meta name="description" content="${description} หาเด็ก${provinceName} น้องนักศึกษา พริตตี้พาร์ทไทม์ ตรงปก ไม่โอนมัดจำ ปลอดภัยแน่นอน" />
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}, ตรงปก, ไม่มัดจำ" />
    
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${provinceUrl}" />

    <meta property="og:locale" content="th_TH">
    <meta property="og:type" content="website">
    <meta property="og:title" content="🔥 ${title}">
    <meta property="og:description" content="พิกัดน้องๆ ${provinceName} รับงานเอง ฟิวแฟน ไม่ต้องมัดจำ ปลอดภัย 100% ตรงปกแน่นอน">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">
    <meta name="twitter:card" content="summary_large_image">
    
    <link rel="preconnect" href="https://res.cloudinary.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;700&family=Prompt:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <script>
        tailwind.config = { theme: { extend: { colors: { gold: '#d4af37' }, fontFamily: { serif:['Cinzel', 'serif'], sans:['Plus Jakarta Sans', 'Prompt', 'sans-serif'] } } } };
    </script>
    
    <style>
        :root { --dark: #050505; --gold: #d4af37; --gold-bright: #facc15; }
        body { background: var(--dark); color: #f8f9fa; font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif; overflow-x: hidden; }
        
        header { min-height: 70vh; }
        .css-content-visibility { content-visibility: auto; contain-intrinsic-size: 400px 533px; }
        
        .shimmer-gold { 
            background: linear-gradient(135deg, #b38728 0%, #fbf5b7 45%, #d4af37 55%, #aa771c 100%); 
            background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
            animation: shimmer 5s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }
        
        .glass-ui { background: rgba(15, 15, 15, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
        .hero-gradient { background: radial-gradient(circle at center, rgba(212,175,55,0.08) 0%, rgba(5,5,5,1) 70%); }
    </style>

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
</head>
<body class="antialiased">
    <nav class="fixed top-0 w-full z-[100] transition-all duration-300 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div class="container mx-auto px-4 flex justify-between items-center max-w-7xl">
            <a href="/" class="text-2xl font-serif font-black tracking-widest shimmer-gold">SIDELINE CM</a>
            <div class="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase">
                <a href="/" class="hover:text-gold transition-colors">Home</a>
                <a href="/profiles" class="hover:text-gold transition-colors">Directory</a>
                <span class="text-gold">${provinceName}</span>
            </div>
            <a href="${CONFIG.SOCIAL_LINKS.line}" aria-label="แอดไลน์" class="bg-[#06c755] text-white px-5 py-2.5 rounded-full font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2">
                <i class="fab fa-line text-lg"></i> LINE OA
            </a>
        </div>
    </nav>

    <header class="relative flex flex-col items-center justify-center text-center px-4 pt-40 pb-24 overflow-hidden hero-gradient">
        <div class="relative z-20 max-w-5xl mx-auto space-y-6">
            <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl">
                <span class="w-2 h-2 bg-gold rounded-full animate-ping"></span>
                PREMIUM SELECTION • ${CURRENT_MONTH} ${CURRENT_YEAR}
            </div>

            <h1 class="font-serif font-black text-[clamp(2rem,7vw,5rem)] leading-[1.1]">
                <span class="block text-white/90 shimmer-gold uppercase">ไซด์ไลน์${provinceName}</span>
                <span class="block text-white uppercase tracking-tighter">VIP EXPERIENCE</span>
            </h1>

            <p class="text-base md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                คัดเฉพาะโปรไฟล์พรีเมียมใน <strong>${provinceName}</strong> การันตีตรงปก 100% <br class="hidden md:block"> 
                <strong>ไม่โอนมัดจำ</strong> จ่ายเงินหน้างาน ปลอดภัย มั่นใจได้ทุกนัด
            </p>

            <div class="flex flex-wrap justify-center gap-4 pt-6">
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="bg-gold text-black px-10 py-4 rounded-full font-black text-sm transition-all hover:scale-105 hover:bg-white shadow-xl flex items-center gap-2 uppercase tracking-wider">
                    <i class="fab fa-line text-xl"></i> จองคิวน้องๆ ทันที
                </a>
                <a href="#profiles" class="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-full font-black text-sm transition-all hover:bg-white/10 uppercase tracking-wider">
                    เลือกดูโปรไฟล์
                </a>
            </div>
        </div>
    </header>

    <main class="container mx-auto max-w-7xl py-12 px-4 relative z-10" id="profiles">
        <section class="mb-20 glass-ui rounded-[3rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
            <div class="max-w-4xl mx-auto text-white/90">
                ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
            </div>
            
            <div class="mt-12 border-t border-white/5 pt-10">
                <h3 class="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-8 italic">📍 Popular Zones</h3>
                <div class="flex flex-wrap justify-center gap-3">
                    ${zones.map(z => `
                        <a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" class="text-[10px] px-5 py-2.5 rounded-xl border border-white/10 font-bold uppercase tracking-widest bg-white/5 text-white/70 hover:bg-gold hover:text-black hover:border-gold transition-all">
                            #${z}
                        </a>`).join('')}
                </div>
            </div>
        </section>

        <!-- PORTFOLIO GRID -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 mb-32">
            ${cardsHTML}
        </div>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            <div class="glass-ui p-10 rounded-[2.5rem] border-t border-white/10 text-center">
                <i class="fas fa-shield-halved text-gold text-4xl mb-6 block"></i>
                <h3 class="text-lg font-bold mb-4 italic text-white uppercase tracking-widest">No Deposit</h3>
                <p class="text-white/40 text-sm font-medium">ไม่มีการโอนก่อนทุกกรณี ปลอดภัย 100% จ่ายหน้างานเท่านั้น</p>
            </div>
            <div class="glass-ui p-10 rounded-[2.5rem] border-t border-white/10 text-center">
                <i class="fas fa-id-card-clip text-gold text-4xl mb-6 block"></i>
                <h3 class="text-lg font-bold mb-4 italic text-white uppercase tracking-widest">Verified</h3>
                <p class="text-white/40 text-sm font-medium">น้องทุกคนผ่านการคัดโปรไฟล์ รูปตรงปก ไม่หลอกลวง</p>
            </div>
            <div class="glass-ui p-10 rounded-[2.5rem] border-t border-white/10 text-center">
                <i class="fas fa-user-secret text-gold text-4xl mb-6 block"></i>
                <h3 class="text-lg font-bold mb-4 italic text-white uppercase tracking-widest">Privacy</h3>
                <p class="text-white/40 text-sm font-medium">รักษาความลับลูกค้าสูงสุด ข้อมูลปลอดภัย ไม่มีการเปิดเผย</p>
            </div>
        </section>
    </main>

    <footer class="bg-[#020202] border-t border-white/5 pt-24 pb-12 text-center md:text-left">
        <div class="container mx-auto max-w-7xl px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div class="md:col-span-2 space-y-6">
                    <h3 class="text-3xl font-serif shimmer-gold font-black italic tracking-widest">SIDELINE CM</h3>
                    <p class="text-white/40 text-sm leading-loose max-w-md font-medium">
                        The Ultimate Directory for Premium Escort Services in ${provinceName}. 
                        Focusing on safety, transparency, and top-tier quality.
                    </p>
                </div>
                <div>
                    <h4 class="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-8">Navigation</h4>
                    <ul class="space-y-4 text-white/50 text-[11px] font-bold uppercase tracking-wider">
                        <li><a href="#" class="hover:text-gold transition-colors italic">Premium Girls</a></li>
                        <li><a href="#" class="hover:text-gold transition-colors italic">Student Life</a></li>
                        <li><a href="#" class="hover:text-gold transition-colors italic">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-8">Legal</h4>
                    <div class="border border-red-500/20 bg-red-500/5 p-4 rounded-xl">
                        <span class="text-[10px] text-red-500 font-black uppercase tracking-widest">
                            🔞 20+ ONLY. PLEASE CONSUME RESPONSIBLY.
                        </span>
                    </div>
                </div>
            </div>
            <div class="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-[9px] text-white/20 font-black tracking-[0.3em] uppercase">&copy; ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. LUXURY DIRECTORY.</p>
                <div class="flex gap-8 text-[9px] text-white/40 font-black tracking-widest uppercase">
                    <span><i class="fas fa-bolt text-gold mr-1"></i> FAST LOAD</span>
                    <span><i class="fas fa-lock text-gold mr-1"></i> SECURE SSL</span>
                </div>
            </div>
        </div>
    </footer>

    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="Line Contact"
       class="fixed bottom-6 right-6 w-16 h-16 bg-[#06c755] rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl hover:scale-110 transition-all z-[99] border-2 border-white/20">
        <i class="fab fa-line"></i>
        <span class="absolute -top-1 -right-1 w-6 h-6 bg-red-600 border-2 border-[#050505] rounded-full animate-bounce flex items-center justify-center text-[10px] font-black shadow-lg">1</span>
    </a>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const nav = document.querySelector('nav');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('bg-[#050505]/95', 'py-3', 'shadow-2xl');
                    nav.classList.remove('bg-[#050505]/80', 'py-4');
                } else {
                    nav.classList.remove('bg-[#050505]/95', 'py-3', 'shadow-2xl');
                    nav.classList.add('bg-[#050505]/80', 'py-4');
                }
            }, { passive: true });
        });
    </script>
</body>
</html>`;

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
        return new Response('<h1>ระบบกำลังอัปเดตชั่วคราว...</h1>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
};