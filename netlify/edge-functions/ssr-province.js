import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. SYSTEM CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline CM (Thailand)',
    STORAGE_BUCKET: 'profile-images',
    SOCIAL: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        twitter: 'https://twitter.com/sidelinechiangmai',
        tiktok: 'https://tiktok.com/@sidelinecm'
    }
};

// ฐานข้อมูล LSI Keywords สำหรับสร้างเนื้อหาและลิงก์เชื่อมต่อ
const PROVINCE_LSI = {
    'chiangmai': {
        zones: ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'คูเมือง'],
        tags: ['สาวเหนือ', 'นักศึกษา มช.', 'ขาวหมวย', 'ตัวท็อปเชียงใหม่'],
        desc: 'ศูนย์รวมน้องๆ ไซด์ไลน์เชียงใหม่ พิกัดยอดฮิตนิมมานและสันติธรรม'
    },
    'lampang': {
        zones: ['ตัวเมืองลำปาง', 'เกาะคา', 'ห้างฉัตร', 'แม่เมาะ', 'สบตุ๋ย'],
        tags: ['สาวลำปาง', 'รับงานลำปาง', 'ตรงปก100%', 'นักศึกษาลำปาง'],
        desc: 'พิกัดลับน้องๆ ลำปาง รับงานเอง ฟิวแฟน ดูแลดีระดับพรีเมียม'
    },
    'bangkok': {
        zones: ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'สาทร', 'สีลม', 'ทองหล่อ'],
        tags: ['พริตตี้ กทม.', 'นางแบบ', 'ตัวท็อปกรุงเทพ', 'เด็กเอ็นกทม.'],
        desc: 'น้องๆ ไซด์ไลน์กรุงเทพฯ ครอบคลุมโซน BTS และ MRT ทั่วกรุง'
    },
    'default': {
        zones: ['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู'],
        tags: ['สาวสวย', 'ฟิวแฟน', 'ตรงปก', 'รับงานเอง'],
        desc: 'บริการน้องๆ ไซด์ไลน์เกรดพรีเมียม การันตีตรงปก ไม่ต้องโอนมัดจำ'
    }
};

// ==========================================
// 2. CORE UTILITIES (SYNC WITH CLIENT JS)
// ==========================================
const escapeHTML = (str) => str ? String(str).replace(/[&<>'"]/g, t => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[t])) : '';

const optimizeImg = (path, width = 400, height = 533) => {
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
        return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${(date.getFullYear() + 543).toString().slice(-2)}`;
    } catch (e) { return 'ไม่ระบุ'; }
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

        // Fetch Data
        const { data: provinceData } = await supabase.from('provinces').select('*').eq('key', provinceKey).maybeSingle();
        if (!provinceData) return context.next();

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, created_at, active, availability, likes')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(80);

        const safeProfiles = profiles || [];
        const provinceName = provinceData.nameThai;
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const seoInfo = PROVINCE_LSI[provinceKey] || PROVINCE_LSI['default'];
        
        const firstImg = safeProfiles.length > 0 ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;

        // ==========================================
        // 4. METADATA & SCHEMA (FULL JSON-LD)
        // ==========================================
        const CURRENT_YEAR = new Date().getFullYear() + 543;
        const pageTitle = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (อัปเดต ${CURRENT_YEAR}) | ตรงปก ไม่มัดจำ`;
        const pageDesc = `รวมน้องๆ ไซด์ไลน์${provinceName} ตัวท็อป ${safeProfiles.length} คน รับงานเอง ✓การันตีตรงปก 100% ✓น้องนักศึกษา ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด จ่ายหน้างานที่${provinceName}`;

        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "LocalBusiness",
                    "name": `บริการไซด์ไลน์${provinceName} Premium`,
                    "image": firstImg,
                    "url": provinceUrl,
                    "priceRange": "฿1500 - ฿5000",
                    "description": pageDesc,
                    "address": { "@type": "PostalAddress", "addressLocality": provinceName, "addressCountry": "TH" }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": provinceName, "item": provinceUrl }
                    ]
                },
                {
                    "@type": "ItemList",
                    "name": `รายชื่อน้องๆ ไซด์ไลน์ ${provinceName}`,
                    "numberOfItems": safeProfiles.length,
                    "itemListElement": safeProfiles.slice(0, 20).map((p, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`
                    }))
                }
            ]
        };

        // ==========================================
        // 5. HTML CARDS GENERATION (SYNC WITH CLIENT)
        // ==========================================
        let cardsHTML = safeProfiles.map((p, i) => {
            let cleanName = escapeHTML((p.name || '').trim().replace(/^(น้อง\s?)/, ''));
            cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            const displayName = `น้อง${cleanName}`;
            
            const pLoc = escapeHTML(p.location || '');
            const fullLoc = [provinceName, pLoc].filter(Boolean).join(' ').trim();
            const imgSrc = optimizeImg(p.imagePath || (p.galleryPaths && p.galleryPaths[0]), 400);
            
            let statusClass = 'status-inquire';
            let availText = escapeHTML(p.availability || 'สอบถาม');
            if (availText.includes('ว่าง') || availText.includes('รับงาน')) statusClass = 'status-available';
            else if (availText.includes('ไม่ว่าง') || availText.includes('พัก')) statusClass = 'status-busy';

            const likeCount = p.likes || 0;
            const updatedDate = formatDate(p.created_at || p.lastUpdated);

            return `
            <div class="profile-card-new-container">
                <div class="profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-gray-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl" 
                     data-profile-id="${p.id}" data-profile-slug="${p.slug}">
                    <img src="${imgSrc}" alt="${displayName} - ไซด์ไลน์${provinceName}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="${i < 4 ? 'eager' : 'lazy'}">
                    <div class="absolute top-2 right-2 flex flex-col gap-1 items-end z-20 pointer-events-none">
                        <span class="${statusClass} text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-md backdrop-blur-md bg-opacity-80">${availText}</span>
                        ${p.isfeatured ? '<span class="bg-yellow-400 text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm"><i class="fas fa-star mr-1"></i>แนะนำ</span>' : ''}
                    </div>
                    <a href="/sideline/${p.slug}" class="absolute inset-0 z-10"></a>
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 flex flex-col justify-end pointer-events-none">
                        <h3 class="text-lg font-bold text-white drop-shadow-md truncate pointer-events-auto">${displayName}</h3>
                        <p class="text-xs text-gray-300 flex items-center mt-0.5 pointer-events-auto"><i class="fas fa-map-marker-alt mr-1 text-pink-500"></i> ${fullLoc}</p>
                        <div class="flex justify-between items-center mt-2 pointer-events-auto">
                            <span class="text-[9px] text-gray-400 flex items-center gap-1"><i class="far fa-clock"></i> อัปเดต: ${updatedDate}</span>
                            <div class="flex items-center gap-1.5 text-white bg-black/40 px-2 py-0.5 rounded-full border border-white/10" data-action="like" data-id="${p.id}">
                                <i class="fas fa-heart text-pink-500"></i><span class="text-xs font-bold">${likeCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

        // ==========================================
        // 6. FINAL HTML RENDERING
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th" class="dark scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDesc}" />
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}, ตรงปก, ไม่มัดจำ, นัดเจอจ่ายหน้างาน" />
    <link rel="canonical" href="${provinceUrl}" />
    
    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="🔥 ${pageTitle}" />
    <meta property="og:description" content="${pageDesc}" />
    <meta property="og:image" content="${firstImg}" />
    <meta property="og:url" content="${provinceUrl}" />
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Schema Markup -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

    <!-- UI Core Assets -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { darkMode: 'class', theme: { extend: { colors: { primary: '#ec4899', gold: '#d4af37' } } } };
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;600;700&display=swap" rel="stylesheet">

    <style>
        body { font-family: 'Prompt', sans-serif; background: #050505; color: #fff; }
        .shimmer-gold { background: linear-gradient(135deg, #b38728 0%, #fbf5b7 45%, #d4af37 55%, #aa771c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .glass-ui { background: rgba(15, 15, 15, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); }
        .status-available { background: #22c55e !important; }
        .status-busy { background: #ef4444 !important; }
        .status-inquire { background: #6b7280 !important; }
        .profile-card-new { aspect-ratio: 3/4; }
        .tailwind-loading { opacity: 0; }
        .tailwind-loaded { opacity: 1; transition: opacity 0.5s ease-in; }
    </style>
</head>
<body class="tailwind-loading">
    
    <!-- Navbar -->
    <nav class="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div class="container mx-auto flex justify-between items-center max-w-7xl">
            <a href="/" class="text-2xl font-black shimmer-gold italic tracking-tighter">SIDELINE CM</a>
            <a href="${CONFIG.SOCIAL.line}" class="bg-[#06c755] text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                <i class="fab fa-line text-lg"></i> LINE OA
            </a>
        </div>
    </nav>

    <!-- Hero Header -->
    <header class="pt-16 pb-10 text-center px-4">
        <div class="inline-block px-4 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest mb-6">Verified Profiles ${CURRENT_YEAR}</div>
        <h1 class="text-3xl md:text-6xl font-black mb-4 leading-tight italic uppercase">ไซด์ไลน์<span class="text-primary">${provinceName}</span></h1>
        <p class="text-lg md:text-xl text-gold font-bold mb-2">รูปตรงปก • ไม่มัดจำ • นัดเจอจ่ายหน้างาน</p>
        <p class="text-gray-400 text-sm max-w-2xl mx-auto">${seoInfo.desc}</p>
    </header>

    <!-- SEO Content Block (The Missing Content) -->
    <section class="max-w-4xl mx-auto px-4 mb-16">
        <div class="glass-ui rounded-3xl p-8 border-l-4 border-primary">
            <h2 class="text-2xl font-bold text-white mb-4">ทำไมต้องนัดน้องๆ ไซด์ไลน์${provinceName} กับเรา?</h2>
            <div class="grid md:grid-cols-2 gap-6 text-gray-300 text-sm leading-relaxed">
                <div class="space-y-3">
                    <p>✅ <strong>ระบบรูปจริง 100%:</strong> เราคัดกรองโปรไฟล์อย่างเข้มงวด มั่นใจได้ว่าน้องที่นัดเจอจะตรงปกเหมือนในรูปแน่นอน</p>
                    <p>✅ <strong>ปลอดภัยสูงสุด:</strong> ไม่มีการโอนมัดจำจองคิวใดๆ ทั้งสิ้น ป้องกันมิจฉาชีพ 100% ลูกค้าชำระเงินเมื่อพบตัวน้องแล้วเท่านั้น</p>
                </div>
                <div class="space-y-3">
                    <p>✅ <strong>บริการระดับพรีเมียม:</strong> น้องๆ <strong>${seoInfo.tags.join(', ')}</strong> ของเราเน้นงานฟิวแฟน ดูแลดี สุภาพ และมีความเป็นส่วนตัวสูง</p>
                    <p>✅ <strong>นัดง่ายทุกที่:</strong> ครอบคลุมพิกัด ${seoInfo.zones.slice(0, 5).join(', ')} และพื้นที่ใกล้เคียงใน${provinceName}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Internal Linking (The Missing Links) -->
    <section class="max-w-7xl mx-auto px-4 mb-12">
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 italic">📍 พิกัดบริการยอดฮิตใน${provinceName}:</p>
        <div class="flex flex-wrap gap-2">
            ${seoInfo.zones.map(z => `<a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" class="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold hover:bg-primary transition-all shadow-sm">#รับงาน${z}</a>`).join('')}
        </div>
    </section>

    <!-- Profile Grid -->
    <main class="container mx-auto px-4 max-w-7xl pb-32">
        <div class="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h3 class="text-xl font-bold flex items-center gap-2"><i class="fas fa-users text-primary text-sm"></i> โปรไฟล์น้องๆ ${provinceName}</h3>
            <span class="text-xs font-bold bg-primary/20 text-primary px-3 py-1 rounded-lg border border-primary/30">พบ ${safeProfiles.length} คน</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            ${cardsHTML}
        </div>
    </main>

    <!-- Footer System (The Missing Footer) -->
    <footer class="bg-[#020202] border-t border-white/10 pt-24 pb-12">
        <div class="container mx-auto max-w-7xl px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                <div class="space-y-6">
                    <h3 class="text-2xl font-black shimmer-gold italic">SIDELINE CM</h3>
                    <p class="text-gray-500 text-sm leading-loose">แพลตฟอร์มรวบรวมโปรไฟล์อิสระ <strong>ไซด์ไลน์${provinceName}</strong> และเครือข่ายรับงานที่ใหญ่ที่สุดในไทย เรามุ่งเน้นความโปร่งใส ปลอดภัย และรักษาความเป็นส่วนตัวสูงสุดของลูกค้า</p>
                    <div class="flex gap-4">
                        <a href="${CONFIG.SOCIAL.line}" class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all border border-white/10"><i class="fab fa-line text-xl"></i></a>
                        <a href="${CONFIG.SOCIAL.twitter}" class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all border border-white/10"><i class="fab fa-x-twitter text-xl"></i></a>
                    </div>
                </div>
                <div>
                    <h4 class="text-white text-xs font-bold uppercase tracking-[0.3em] mb-8 border-b border-primary/30 pb-2 inline-block">บริการยอดนิยม</h4>
                    <ul class="space-y-4 text-gray-500 text-sm font-light">
                        <li><a href="#" class="hover:text-primary transition-colors italic">รับงานน้องนักศึกษา${provinceName}</a></li>
                        <li><a href="#" class="hover:text-primary transition-colors italic">พริตตี้เอนเตอร์เทน (En)</a></li>
                        <li><a href="#" class="hover:text-primary transition-colors italic">เพื่อนเที่ยวพรีเมียม</a></li>
                        <li><a href="#" class="hover:text-primary transition-colors italic">สาวสวยตรงปก ไม่มัดจำ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white text-xs font-bold uppercase tracking-[0.3em] mb-8 border-b border-primary/30 pb-2 inline-block">คำแนะนำและความปลอดภัย</h4>
                    <ul class="space-y-4 text-gray-500 text-sm font-light">
                        <li><a href="/policy" class="hover:text-primary transition-colors">นโยบายความเป็นส่วนตัว</a></li>
                        <li><a href="/faq" class="hover:text-primary transition-colors">คำถามที่พบบ่อย (FAQ)</a></li>
                        <li class="pt-4">
                            <span class="inline-block text-[10px] text-red-500 font-bold border border-red-500/30 px-4 py-2 rounded-xl leading-relaxed uppercase tracking-tighter">
                                🔞 สำหรับผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-10 gap-6">
                <p class="text-[10px] text-gray-600 uppercase tracking-widest font-bold">&copy; 2026 ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
                <div class="flex gap-8 text-[9px] text-gray-600 uppercase font-black tracking-widest">
                    <span class="flex items-center gap-2"><i class="fas fa-bolt text-gold"></i> SSR TECHNOLOGY</span>
                    <span class="flex items-center gap-2"><i class="fas fa-shield-alt text-gold"></i> SSL VERIFIED</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- Floating CTA Button (The Missing Action) -->
    <a href="${CONFIG.SOCIAL.line}" target="_blank" aria-label="ทักไลน์สอบถามคิวน้องๆ"
       class="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-[#06c755] to-[#04a045] rounded-full flex items-center justify-center text-white text-3xl shadow-[0_10px_30px_rgba(6,199,85,0.4)] hover:scale-110 transition-all z-[99] border-2 border-white/20">
        <i class="fab fa-line"></i>
        <span class="absolute -top-1 -right-1 w-6 h-6 bg-red-600 border-2 border-[#050505] rounded-full animate-bounce flex items-center justify-center text-[10px] font-bold shadow-lg">1</span>
    </a>

    <!-- Hydra Initialization Script -->
    <script>
        document.body.classList.remove('tailwind-loading');
        document.body.classList.add('tailwind-loaded');
        
        // Sync Likes with LocalStorage on load
        setTimeout(() => {
            const likedProfiles = JSON.parse(localStorage.getItem('liked_profiles') || '{}');
            document.querySelectorAll('.profile-card-new').forEach(card => {
                const id = card.getAttribute('data-profile-id');
                if (id && likedProfiles[id]) {
                    const btn = card.querySelector('[data-action="like"]');
                    if (btn) btn.classList.add('text-pink-500');
                }
            });
        }, 300);
    </script>
</body>
</html>`;

        return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
    } catch (e) {
        console.error('SSR Critical Error:', e);
        return new Response('<h1>System Maintenance...</h1>', { status: 500, headers: { "Content-Type": "text/html" } });
    }
};