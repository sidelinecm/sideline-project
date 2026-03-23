import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. SYSTEM CONFIGURATION & HOT LINKS
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline CM',
    STORAGE_BUCKET: 'profile-images',
    SOCIAL_LINKS: {
        line: 'https://line.me/ti/p/ksLUWB89Y_'
    }
};

// ==========================================
// 2. UTILITIES (Sync กับ Client 100%)
// ==========================================
const escapeHTML = (str) => {
    return str ? String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag])) : '';
};

const optimizeImg = (path, width = 400) => {
    if (!path) return `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/c_scale,w_${width},q_auto,f_auto/`);
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/${CONFIG.STORAGE_BUCKET}/${path}`;
};

const formatDate = (dateString) => {
    if (!dateString) return 'ไม่ระบุ';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'เมื่อครู่นี้';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชม.ที่แล้ว`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} วันที่แล้ว`;
        
        const thaiMonths =['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const day = date.getDate();
        const month = thaiMonths[date.getMonth()];
        const year = (date.getFullYear() + 543).toString().slice(-2);
        
        return `${day} ${month} ${year}`;
    } catch (e) {
        return 'ไม่ระบุ';
    }
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
            .from('provinces')
            .select('id, nameThai, key')
            .eq('key', provinceKey)
            .maybeSingle();

        if (!provinceData || provError) {
            return context.next();
        }

        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, created_at, active, availability, likes')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(80);

        if (profilesError) {
            console.error('Fetch Profiles Error:', profilesError);
        }

        const safeProfiles = profiles ||[];
        const provinceName = escapeHTML(provinceData.nameThai);
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        let firstImage = `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
        if (safeProfiles.length > 0) {
            firstImage = optimizeImg(safeProfiles[0].imagePath || (safeProfiles[0].galleryPaths && safeProfiles[0].galleryPaths[0]), 800);
        }

        // ==========================================
        // 4. SEO & SCHEMA MARKUP
        // ==========================================
        const CURRENT_YEAR = new Date().getFullYear() + 543;
        const thaiMonthsFull =["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        const CURRENT_MONTH = thaiMonthsFull[new Date().getMonth()];
        
        const title = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ไม่มัดจำ`;
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} ตัวท็อป ${safeProfiles.length} คน รับงานเอง ✓การันตีตรงปก 100% ✓น้องนักศึกษา ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด จ่ายหน้างาน`;

        const schemaData = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "LocalBusiness",
                    "@id": `${provinceUrl}/#business`,
                    "name": `รับงาน${provinceName} - ไซด์ไลน์พรีเมียม`,
                    "url": provinceUrl,
                    "image": firstImage,
                    "description": description,
                    "priceRange": "฿1500 - ฿5000",
                    "address": { 
                        "@type": "PostalAddress", 
                        "addressLocality": provinceName, 
                        "addressCountry": "TH" 
                    }
                },
                {
                    "@type": "ItemList",
                    "name": `รายชื่อไซด์ไลน์ในจังหวัด ${provinceName}`,
                    "numberOfItems": safeProfiles.length,
                    "itemListElement": safeProfiles.slice(0, 10).map((p, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`
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
        // 5. HTML GENERATION (CARDS)
        // ==========================================
        let cardsHTML = '';
        if (safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                let cleanName = escapeHTML((p.name || '').trim().replace(/^(น้อง\s?)/, ''));
                cleanName = cleanName.toLowerCase();
                cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
                cleanName = `น้อง${cleanName}`;
                
                const pLoc = escapeHTML(p.location || '');
                const fullLocation = [provinceName, pLoc].filter(Boolean).join(' ').trim();
                
                const imgSrc = optimizeImg(p.imagePath || (p.galleryPaths && p.galleryPaths[0]), 400);
                
                let statusClass = 'status-inquire';
                let availText = escapeHTML(p.availability || 'สอบถาม');
                const availLower = availText.toLowerCase();
                if (availLower.includes('ว่าง') || availLower.includes('รับงาน')) {
                    statusClass = 'status-available';
                } else if (availLower.includes('ไม่ว่าง') || availLower.includes('พัก')) {
                    statusClass = 'status-busy';
                }

                const likeCount = p.likes || 0;
                const formattedDate = formatDate(p.created_at || p.lastUpdated);

                const isEager = i < 6;
                const loadingAttr = isEager ? `loading="eager" fetchpriority="high"` : `loading="lazy"`;

                return `
                <div class="profile-card-new-container">
                    <div class="profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-gray-200 dark:bg-gray-800 cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1" 
                         data-profile-id="${p.id}" data-profile-slug="${escapeHTML(p.slug)}">
                        
                        <!-- Layer 0: Skeleton & Image -->
                        <div class="skeleton-loader absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse z-0"></div>
                        <img src="${imgSrc}" 
                             alt="${cleanName} - ไซด์ไลน์${provinceName}"
                             class="card-image w-full h-full object-cover transition-opacity duration-700 absolute inset-0 z-0 opacity-100"
                             ${loadingAttr} width="300" height="400">
                             
                        <!-- Layer 1: Badges -->
                        <div class="absolute top-2 right-2 flex flex-col gap-1 items-end z-20 pointer-events-none">
                            <span class="availability-badge ${statusClass} shadow-md backdrop-blur-md bg-white/10 border border-white/20 text-[10px] font-bold px-2 py-1 rounded-full text-white">
                                ${availText}
                            </span>
                            ${p.isfeatured ? '<span class="featured-badge bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm"><i class="fas fa-star mr-1"></i>แนะนำ</span>' : ''}
                        </div>

                        <!-- Layer 2: Link -->
                        <a href="/sideline/${escapeHTML(p.slug)}" class="card-link absolute inset-0 z-10" tabindex="-1"></a>

                        <!-- Layer 3: Overlay & Content -->
                        <div class="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-between pointer-events-none" style="z-index: 20;">
                            <div class="card-header mt-8"></div>
                            
                            <div class="card-footer-content pointer-events-auto">
                                <h3 class="text-lg font-bold text-white drop-shadow-md leading-tight truncate pr-2">${cleanName}</h3>
                                <p class="text-xs text-gray-300 flex items-center mt-0.5 mb-2">
                                    <i class="fas fa-map-marker-alt mr-1 text-pink-500"></i> ${fullLocation}
                                </p>
                                <div class="date-stamp text-[10px] text-gray-400 flex items-center gap-1">
                                    <i class="far fa-clock text-[9px]"></i> 
                                    <span>อัปเดต: ${formattedDate}</span>
                                </div>
                                
                                <!-- Layer 4: Like Button -->
                                <div class="like-button-wrapper relative flex items-center gap-1.5 text-white cursor-pointer group/like hover:text-pink-400 transition-colors mt-1"
                                     style="pointer-events: auto !important; z-index: 50 !important;"
                                     data-action="like" data-id="${p.id}" role="button">
                                    <i class="fas fa-heart text-lg transition-transform duration-200 group-hover/like:scale-110"></i>
                                    <span class="like-count text-sm font-bold">${likeCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('');
        } else {
            cardsHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400 text-lg">🚀 เตรียมพบกับน้องๆ ไซด์ไลน์${provinceName} เร็วๆ นี้...</p>
                </div>
            `;
        }

        // ==========================================
        // 6. RENDER THE ULTIMATE HTML
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th" class="dark scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#111111">
    
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}, ตรงปก, ไม่มัดจำ, นัดเจอจ่ายหน้างาน" />
    <link rel="canonical" href="${provinceUrl}" />

    <!-- Open Graph (LINE/FB/X) -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${provinceUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${firstImage}" />
    <meta property="og:image:secure_url" content="${firstImage}" />
    <meta property="og:image:width" content="800" />
    <meta property="og:image:height" content="600" />
    <meta property="og:locale" content="th_TH" />
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${firstImage}" />

    <!-- Schema Markup -->
    <script type="application/ld+json" id="schema-jsonld-list">${JSON.stringify(schemaData["@graph"][0])}</script>
    <script type="application/ld+json" id="schema-jsonld-breadcrumb">${JSON.stringify(schemaData["@graph"][2])}</script>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { 
            darkMode: 'class',
            theme: { extend: { colors: { primary: '#ec4899' } } } 
        };
    </script>

    <!-- Anti-FOUC & Dark Mode Script -->
    <script>
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    </script>

    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <style>
        body { font-family: system-ui, -apple-system, sans-serif; transition: background-color 0.3s, color 0.3s; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .tailwind-loading { opacity: 0; transition: opacity 0.3s ease-in-out; }
        .tailwind-loaded { opacity: 1; }

        /* Custom Card Styles from Client CSS */
        .profile-card-new { aspect-ratio: 3/4; }
        .status-available { background-color: rgba(34, 197, 94, 0.85) !important; color: white !important; }
        .status-busy { background-color: rgba(239, 68, 68, 0.85) !important; color: white !important; }
        .status-inquire { background-color: rgba(107, 114, 128, 0.85) !important; color: white !important; }
        .liked i { color: #ec4899 !important; transform: scale(1.1); }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-[#050505] dark:text-gray-100 min-h-screen">

    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 py-3 flex justify-between items-center">
        <a href="/" class="text-xl font-black text-pink-500 tracking-wider">SIDELINE CM</a>
        <button id="themeToggle" class="theme-toggle-btn w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-lg shadow-inner">
            <i class="theme-toggle-icon fas fa-sun dark:fa-moon"></i>
        </button>
    </nav>

    <!-- Hero SEO Section -->
    <header class="pt-8 pb-4 px-4 text-center max-w-4xl mx-auto">
        <h1 class="text-2xl md:text-4xl font-black mb-3 dark:text-white leading-tight">
            งานเอนเตอร์เทน ไซด์ไลน์${provinceName} <br>
            <span class="text-pink-500 text-xl md:text-2xl">รูปตรงปก • ไม่โอนมัดจำ • ปลอดภัย 100%</span>
        </h1>
        <p class="text-sm md:text-base text-gray-600 dark:text-gray-400">
            รวมโปรไฟล์น้องๆ ยอดนิยม ครบทุกย่าน ติดต่อตรงไม่ผ่านเอเย่นต์ รับประกันความพึงพอใจ
        </p>
    </header>

    <!-- 🟢 พื้นที่แสดงผลโปรไฟล์ (Id ตรงกับ Client Script) -->
    <div id="profiles-display-area">
        <div class="section-content-wrapper animate-fade-in-up">
            <div class="px-4 sm:px-6 pt-8 pb-4">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div>
                        <h3 class="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white leading-tight">
                            📍 น้องๆ ในจังหวัด <span class="text-pink-600">${provinceName}</span>
                        </h3>
                    </div>
                    <div class="flex-shrink-0">
                        <span class="inline-flex items-center px-4 py-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold text-sm border border-pink-100 dark:border-pink-800">
                            พบ ${safeProfiles.length} รายการ
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Grid บังคับ 2 คอลัมน์บนมือถือ ตามสไตล์ที่คุณต้องการ -->
            <div class="profile-grid grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 sm:px-6 pb-12">
                ${cardsHTML}
            </div>
        </div>
    </div>

    <!-- Container สำหรับ Client Script โหลดข้อมูล (ซ่อนไว้ก่อน) -->
    <div id="loading-profiles-placeholder" style="display: none;"></div>

    <script>
        // ป้องกัน FOUC (เว็บกระพริบ)
        document.body.classList.add('tailwind-loading');
        const checkTailwind = setInterval(() => {
            if (window.tailwind) {
                clearInterval(checkTailwind);
                document.body.classList.remove('tailwind-loading');
                document.body.classList.add('tailwind-loaded');
                
                // เช็คสถานะการกดไลค์จาก LocalStorage ให้รูปหัวใจตรงกับเครื่องผู้ใช้ทันที
                setTimeout(() => {
                    const likedProfiles = JSON.parse(localStorage.getItem('liked_profiles') || '{}');
                    document.querySelectorAll('.profile-card-new').forEach(card => {
                        const id = card.getAttribute('data-profile-id');
                        if (id && likedProfiles[id]) {
                            const btn = card.querySelector('.like-button-wrapper');
                            if (btn) btn.classList.add('liked');
                        }
                    });
                }, 100);
            }
        }, 50);
        
        setTimeout(() => {
            clearInterval(checkTailwind);
            document.body.classList.remove('tailwind-loading');
            document.body.classList.add('tailwind-loaded');
        }, 2000);
    </script>
</body>
</html>`;

        // ==========================================
        // 7. RETURN CACHED RESPONSE
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
        return new Response('<h1 style="text-align:center;margin-top:20%;font-family:sans-serif;">ระบบกำลังอัปเดตชั่วคราว...</h1>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
};