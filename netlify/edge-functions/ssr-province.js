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
// 2. SEO ENGINE (LSI & LOCALIZATION)
// ==========================================
const PROVINCE_SEO_DATA = {
    'chiangmai': {
        zones:['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'หลังมช', 'คูเมือง'],
        lsi:['สาวเหนือ', 'นักศึกษา มช.', 'ขาวหมวย', 'ตัวท็อปเชียงใหม่', 'เด็กเอ็นเชียงใหม่', 'รับงาน N'],
    },
    'bangkok': {
        zones:['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย'],
        lsi:['พริตตี้ กทม.', 'นางแบบสาว', 'ตัวท็อปกรุงเทพ', 'เด็กเอ็น', 'ฟิวแฟนคลุกวงใน', 'เพื่อนเที่ยว'],
    },
    'default': {
        zones:['ตัวเมือง', 'โซนยอดฮิต', 'พื้นที่ใกล้เคียง', 'โรงแรมชั้นนำ', 'คอนโดหรู'],
        lsi:['นักศึกษา', 'พริตตี้พาร์ทไทม์', 'หุ่นนางแบบ', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน', 'รับงานเอง'],
    }
};

// Image Optimizer ที่ปลอดภัย (ไม่กินโควต้า Render API ของ Supabase ฟรี)
const optimizeImg = (path, width = 400, height = 533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/placeholder-profile.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face/`);
    }
    if (path.startsWith('http')) return path;
    // ใช้ Standard Public URL เพื่อป้องกัน 404 หากไม่ได้สมัคร Pro Plan
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

// จัดการรูปแบบวันที่ให้เหมือน main.js
const formatDate = (dateString) => {
    if (!dateString) return 'ไม่ระบุ';
    try {
        const date = new Date(dateString);
        const thaiMonths =['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${(date.getFullYear() + 543).toString().slice(-2)}`;
    } catch (e) {
        return 'ไม่ระบุ';
    }
};

// Spintax SEO Generator
const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    
    if (count === 0) return `<p class="mb-4 text-pink-500 font-bold text-lg">🚀 เตรียมพบกับน้องๆ ไซด์ไลน์${provinceName} เร็วๆ นี้...</p><p>เรากำลังคัดสรร <strong>${data.lsi[0]}</strong> เกรดพรีเมียม แอดไลน์เพื่อสอบถามคิวหลุดก่อนใคร!</p>`;
    
    return `
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            พิกัด <span class="text-pink-600">รับงาน${provinceName}</span> รวมน้องๆ <span class="text-pink-600">${data.lsi[0]}</span> ตรงปก
        </h2>
        <p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg max-w-3xl mx-auto">
            กำลังหา <strong>ไซด์ไลน์${provinceName}</strong> หรือ <strong>${data.lsi[4]}</strong> อยู่ใช่ไหม? เราคัดโปรไฟล์ตัวท็อป งาน <strong>${data.lsi[1]}</strong> และ <strong>${data.lsi[2]}</strong> กว่า ${count} คน พร้อมดูแลคุณแบบฟิวแฟนแท้ๆ นัดง่าย ครอบคลุมโซน <strong>${data.zones.slice(0,4).join(', ')}</strong>
        </p>
        <div class="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-2xl border border-pink-100 dark:border-pink-800/50 mt-8 text-left max-w-4xl mx-auto shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i class="fas fa-shield-check text-green-500"></i> ทำไมต้องเลือกเรา?
            </h3>
            <ul class="space-y-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                <li class="flex items-start gap-2"><i class="fas fa-check-circle text-pink-500 mt-1"></i> <span><strong>ปลอดภัย 100%:</strong> จ่ายเงินหน้างานเท่านั้น <span class="text-red-500 font-bold">ไม่มีการโอนมัดจำล่วงหน้า</span></span></li>
                <li class="flex items-start gap-2"><i class="fas fa-check-circle text-pink-500 mt-1"></i> <span><strong>ตรงปกชัวร์:</strong> การันตีรูปจริง หากเจอตัวแล้วไม่ตรงปก สามารถปฏิเสธได้ทันที</span></li>
                <li class="flex items-start gap-2"><i class="fas fa-check-circle text-pink-500 mt-1"></i> <span><strong>รับงานเอง:</strong> ไม่ผ่านโมเดลลิ่ง คุยตรงกับน้องเพื่อนัดเวลาและสถานที่ได้อย่างเป็นส่วนตัว</span></li>
            </ul>
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

        // ตรวจสอบ Query Parameter เผื่อมีการแชร์ลิงก์แบบระบุโซนมาด้วย (เช่น ?q=นิมมาน)
        const searchQuery = url.searchParams.get('q') || '';

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // Fetch Province
        const { data: provinceData } = await supabase
            .from('provinces').select('nameThai, key').eq('key', provinceKey).maybeSingle();

        if (!provinceData) return context.next();

        // Fetch Profiles (จำกัดแค่ 40 คนเพื่อความเร็วในการ SSR ส่วนที่เหลือ Client จะดึงเอง)
        let query = supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate, isfeatured, lastUpdated, created_at, availability, likes')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(40);
        
        const { data: profiles } = await query;
        let safeProfiles = profiles ||[];

        // ถ้ามี Query โซน ให้ Filter ข้อมูลในฝั่ง Server เลย
        if (searchQuery) {
            safeProfiles = safeProfiles.filter(p => 
                (p.location && p.location.includes(searchQuery)) || 
                (p.name && p.name.includes(searchQuery))
            );
        }

        const provinceName = provinceData.nameThai;
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
        const CURRENT_YEAR = new Date().getFullYear() + 543; // ปี พ.ศ. 2569
        const CURRENT_MONTH = new Date().toLocaleString('th-TH', { month: 'long' });
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const firstImage = safeProfiles.length > 0 ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;

        // ==========================================
        // 4. METADATA & SCHEMA (SAFE FOR ADULT NICHE)
        // ==========================================
        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} ตัวท็อป ตรงปก ไม่มัดจำ (${CURRENT_MONTH} ${CURRENT_YEAR})`;
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} เด็กเอ็น รับงานเอง โซน ${seoData.zones.slice(0,3).join(', ')} อัปเดตล่าสุด ${safeProfiles.length} คน ✓ตรงปก 100% ✓ฟิวแฟน ✓ไม่ต้องโอนมัดจำ จ่ายหน้างาน ปลอดภัยที่สุด`;

        // Schema แบบ CollectionPage + ItemList ปลอดภัยต่อสายเทา 100%
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
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}/#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "description": description,
                    "isPartOf": { "@id": `${CONFIG.DOMAIN}/#website` }
                },
                {
                    "@type": "ItemList",
                    "name": `รายชื่อน้องๆ รับงานไซด์ไลน์ ${provinceName}`,
                    "description": `คัดสรรน้องๆ ตัวท็อปในจังหวัด${provinceName}`,
                    "numberOfItems": safeProfiles.length,
                    "itemListElement": safeProfiles.map((p, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Person",
                            "name": `น้อง${p.name.replace(/^น้อง/, '').trim()}`,
                            "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                            "image": optimizeImg(p.imagePath, 400, 533)
                        }
                    }))
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement":[
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                }
            ]
        };

        // ==========================================
        // 5. HTML GENERATION (EXACT MATCH WITH main.js)
        // ==========================================
        let cardsHTML = '';
        if (safeProfiles.length > 0) {
            // จำลองการสร้าง HTML ให้เหมือน createProfileCard() ใน main.js แบบ 100%
            cardsHTML = safeProfiles.map((p, i) => {
                const isEager = i < 6;
                const imgSrc = optimizeImg(p.imagePath, 400, 533);
                
                let statusClass = 'status-inquire';
                const avail = (p.availability || '').toLowerCase();
                if (avail.includes('ว่าง') || avail.includes('รับงาน')) statusClass = 'status-available';
                else if (avail.includes('ไม่ว่าง') || avail.includes('พัก')) statusClass = 'status-busy';

                const dateStr = formatDate(p.lastUpdated || p.created_at);
                const likeCount = p.likes || 0;

                return `
                <div class="profile-card-new-container">
                    <div class="profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-gray-200 dark:bg-gray-800 cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1" data-profile-id="${p.id}" data-profile-slug="${p.slug}">
                        
                        <div class="skeleton-loader absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse z-0"></div>
                        <img src="${imgSrc}" alt="น้อง${p.name} - ไซด์ไลน์${provinceName}" 
                             class="card-image w-full h-full object-cover transition-opacity duration-700 opacity-0 absolute inset-0 z-0" 
                             ${isEager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} 
                             width="300" height="400"
                             onload="this.classList.remove('opacity-0'); if(this.previousElementSibling) this.previousElementSibling.remove();"
                             onerror="this.src='/images/placeholder-profile.webp'; this.classList.remove('opacity-0');">
                             
                        <div class="absolute top-2 right-2 flex flex-col gap-1 items-end z-20 pointer-events-none">
                            <span class="availability-badge ${statusClass} shadow-md backdrop-blur-md bg-white/10 border border-white/20 text-[10px] font-bold px-2 py-1 rounded-full text-white">
                                ${p.availability || 'สอบถาม'}
                            </span>
                            ${p.isfeatured ? '<span class="featured-badge bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm"><i class="fas fa-star mr-1"></i>แนะนำ</span>' : ''}
                        </div>

                        <a href="/sideline/${p.slug}" class="card-link absolute inset-0 z-10" aria-labelledby="profile-name-${p.id}" tabindex="-1"></a>

                        <div class="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-between pointer-events-none" style="z-index: 20;">
                            <div class="card-header mt-8"></div>
                            <div class="card-footer-content pointer-events-auto">
                                <h3 id="profile-name-${p.id}" class="text-lg font-bold text-white drop-shadow-md leading-tight truncate pr-2">${p.name}</h3>
                                <p class="text-xs text-gray-300 flex items-center mt-0.5 mb-2">
                                    <i class="fas fa-map-marker-alt mr-1 text-pink-500"></i> ${provinceName}
                                </p>
                                <div class="date-stamp text-[10px] text-gray-400 flex items-center gap-1">
                                    <i class="far fa-clock text-[9px]"></i> <span>อัปเดต: ${dateStr}</span>
                                </div>
                                <div class="like-button-wrapper relative flex items-center gap-1.5 text-white cursor-pointer group/like hover:text-pink-400 transition-colors" style="pointer-events: auto !important; z-index: 50 !important; position: relative;" data-action="like" data-id="${p.id}" role="button" tabindex="0">
                                    <i class="fas fa-heart text-lg transition-transform duration-200 group-hover/like:scale-110"></i>
                                    <span class="like-count text-sm font-bold">${likeCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }

        // ==========================================
        // 6. RENDER FULL HTML (INTEGRATES WITH index.html STYLES)
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth antialiased dark:bg-gray-900 dark:text-gray-100 dark">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#db2777">

    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}, ฟิวแฟน, ตรงปก, ไม่มีมัดจำ" />
    <link rel="canonical" href="${provinceUrl}${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}" />

    <!-- Open Graph & Social -->
    <meta property="og:locale" content="th_TH">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">

    <!-- Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Tailwind CSS (Matched with main theme) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { darkMode: 'class', theme: { extend: { colors: { pink: { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843' } }, fontFamily: { sans: ['Prompt', 'sans-serif'] } } } };
    </script>
    
    <!-- Global Styles from index.html -->
    <link rel="stylesheet" href="/styles.css">

    <style>
        body { font-family: 'Prompt', sans-serif; background: linear-gradient(135deg, #0D0D0D, #4B0082); }
        /* CSS ำหรับ Card ที่ต้องใช้ก่อน JS โหลด */
        .profile-card-new { padding-top: 133.33%; } 
        .availability-badge.status-available { background-color: rgba(16, 185, 129, 0.9); }
        .availability-badge.status-busy { background-color: rgba(239, 68, 68, 0.9); }
        .availability-badge.status-inquire { background-color: rgba(245, 158, 11, 0.9); }
        
        .like-button-wrapper .fa-heart { text-shadow: 0 1px 4px rgba(0,0,0,0.6); color: rgba(255, 255, 255, 0.8); transition: all 0.2s; }
        .like-button-wrapper:hover .fa-heart { transform: scale(1.15); color: #fff; }
        .like-button-wrapper.liked .fa-heart { color: #ec4899; }
    </style>

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
</head>
<body class="antialiased dark:bg-gray-900 text-gray-900 dark:text-gray-100 loaded" data-page="location">

    <!-- Header (Mimics index.html) -->
    <header id="page-header" class="fixed top-0 left-0 w-full z-40 transition-colors duration-300 border-b border-transparent bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div class="container mx-auto px-4 h-14 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" aria-label="ไปที่หน้าแรก">
                   <img src="/images/logo-sidelinechiangmai.webp" alt="Logo" class="h-[28px] w-auto" width="240" height="28" />
                </a>
            </div>
            <div class="flex items-center gap-1 md:gap-3">
                <nav class="hidden lg:flex items-center gap-1 text-sm font-medium">
                    <a href="/profiles.html" class="px-3 py-2 rounded-full hover:bg-pink-500/10 hover:text-pink-500 transition-colors">น้องๆทั้งหมด</a>
                    <a href="/locations.html" class="px-3 py-2 rounded-full text-pink-600 font-bold">พิกัดพื้นที่</a>
                </nav>
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="bg-[#06c755] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:scale-105 transition shadow-lg shadow-green-600/20 hidden sm:flex items-center gap-2">
                    <i class="fab fa-line text-lg"></i> แอดไลน์
                </a>
            </div>
        </div>
    </header>

    <main class="pt-24 pb-16 container mx-auto px-4">
        
        <!-- SEO Content Block -->
        <section class="mb-12 text-center max-w-4xl mx-auto animate-fade-in-up bg-white/5 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-gray-700 shadow-xl">
            ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
            
            <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">ค้นหาตามโซนยอดฮิต</p>
                <div class="flex flex-wrap justify-center gap-2">
                    ${seoData.zones.map(z => `
                        <a href="/location/${provinceKey}?q=${encodeURIComponent(z)}" 
                           class="px-4 py-2 rounded-full border border-pink-200 dark:border-pink-800/60 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-pink-500 hover:text-pink-500 hover:shadow-md transition-all ${searchQuery === z ? 'ring-2 ring-pink-500 text-pink-600' : ''}">
                            📍 ${z}
                        </a>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Profiles Display Area (ID matches main.js for seamless hydration) -->
        <div id="profiles-display-area" class="space-y-12 md:space-y-16">
            <div class="section-content-wrapper animate-fade-in-up">
                <div class="px-2 sm:px-6 pt-4 pb-4">
                    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 class="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white leading-tight">
                            ${searchQuery ? `🔍 ผลการค้นหา "${searchQuery}" ใน${provinceName}` : `📍 น้องๆ ในจังหวัด <span class="text-pink-600">${provinceName}</span>`}
                        </h3>
                        <span class="inline-flex items-center px-4 py-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold text-sm border border-pink-100 dark:border-pink-800">พบ ${safeProfiles.length} รายการ</span>
                    </div>
                </div>
                
                <div class="profile-grid grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-2 sm:px-6 pb-12">
                    ${cardsHTML || '<div class="col-span-full text-center py-10 text-gray-500">ไม่พบโปรไฟล์ในโซนนี้ แอดไลน์เพื่อสอบถามเพิ่มเติมครับ</div>'}
                </div>
            </div>
        </div>

    </main>

    <!-- Client Script (Hydration Handover) -->
    <!-- ป้องกัน Main.js เรนเดอร์ทับซ้ำทันที โดยส่งค่า state ให้ Client -->
    <script>
        window.__SSR_INITIAL_PROVINCE__ = "${provinceKey}";
        window.__SSR_SEARCH_QUERY__ = "${searchQuery}";
    </script>
    
    <!-- 🟢 ใช้ Module Script ปกติเพื่อให้ main.js ทำงานต่อ -->
    <script type="module" src="/main.js"></script>

</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "Content-Type": "text/html; charset=utf-8", 
                "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY"
            } 
        });

    } catch (e) {
        console.error('SSR Critical Error:', e);
        // Fallback in case of DB failure
        return new Response('<h1>กำลังโหลดข้อมูลจังหวัด...</h1><script>setTimeout(()=>window.location.href="/", 1500);</script>', { 
            status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
};