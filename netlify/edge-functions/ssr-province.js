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

        // 🎯 5. GENERATE HTML CARDS (NAVIGATE TO INDIVIDUAL PROFILE)
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

// 🎯 6. FULL HTML OUTPUT (Updated with Social & Premium Footer)
        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${provinceUrl}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:image" content="${firstImage}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="${CONFIG.TWITTER}">
    
   <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
<link rel="preload" as="image" href="${firstImage}">
<!-- ใช้ CDN ที่เชื่อถือได้สำหรับ Font Awesome -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css" />

<!-- Tailwind CSS จาก CDN ที่เชื่อถือได้ -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- GSAP จาก cdnjs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

<!-- Lucide จาก jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/lucide/dist/lucide.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Plus+Jakarta+Sans:wght@300;400;600;700&family=Prompt:wght@300;400;700&display=swap" rel="stylesheet" />
    
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root { --dark: #050505; --gold: #d4af37; --glass: rgba(255, 255, 255, 0.03); }
        body { background: var(--dark); color: #fff; font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif; overflow-x: hidden; margin: 0; }
        .font-serif { font-family: 'Cinzel', serif; }
        .shimmer-gold { background: linear-gradient(135deg, #b38728 0%, #fbf5b7 50%, #aa771c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% auto; animation: shine 4s linear infinite; }
        @keyframes shine { to { background-position: 200% center; } }
        .glass-ui { background: var(--glass); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .profile-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px -20px rgba(212, 175, 55, 0.3); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .social-item { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .social-item:hover { transform: scale(1.05); filter: brightness(1.2); }
    </style>
</head>
<body class="bg-[#050505]">
    <nav class="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center transition-all duration-500 backdrop-blur-md border-b border-gold/10 bg-black/20">
        <a href="/" class="text-xl md:text-2xl font-serif font-bold tracking-[0.2em] shimmer-gold">${CONFIG.BRAND_NAME}</a>
        <div class="text-[10px] font-bold tracking-widest text-white/50 uppercase">Directory / ${provinceName}</div>
    </nav>

    <header class="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center px-6">
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-[#050505] z-10"></div>
            <img src="${firstImage}" class="w-full h-full object-cover opacity-30" alt="ไซด์ไลน์${provinceName}">
        </div>
        <div class="relative z-20 max-w-5xl space-y-6">
            <p class="reveal text-[10px] tracking-[0.6em] uppercase font-black text-gold opacity-0">Premium Selection</p>
            <h1 class="reveal text-4xl md:text-8xl font-serif font-bold leading-tight opacity-0">
                <span class="font-light italic text-white/80">Premium</span> <br>
                <span class="shimmer-gold">ไซด์ไลน์${provinceName}</span>
            </h1>
        </div>
    </header>

    <main class="max-w-[1500px] mx-auto px-6 py-12">
        <section class="mb-20 glass-ui p-8 md:p-16 rounded-[3.5rem] text-center">
            <h2 class="text-2xl md:text-4xl font-serif shimmer-gold mb-8 italic">หาเด็ก${provinceName} น้องๆ รับงานเอง ตัวท็อป</h2>
            <div class="text-white/60 text-base md:text-lg leading-loose max-w-4xl mx-auto font-light">
                ${generateMasterSeoText(provinceName, zones, profiles.length)}
            </div>
            <div class="flex flex-wrap justify-center gap-2 mt-10">
                ${zones.slice(0,6).map(z => `<span class="text-[9px] px-5 py-2 bg-white/5 rounded-full border border-white/5 uppercase font-bold text-white/30">#รับงาน${z}</span>`).join('')}
            </div>
        </section>

        <div id="gallery-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10 mb-24">
            ${cardsHTML}
        </div>

        <section class="social-media-section text-center py-12 bg-white/5 rounded-[3rem] border border-white/5 mb-24">
            <div class="px-4 mb-8">
                <h2 class="text-xl md:text-2xl font-bold shimmer-gold mb-2">ติดตามเราบน Social Media <i class="fas fa-hand-point-down ml-1"></i></h2>
                <p class="text-sm text-gray-400">อัปเดตโปรไฟล์ใหม่ล่าสุดและโปรโมชั่นพิเศษก่อนใคร</p>
            </div>

            <div class="social-marquee-wrap overflow-x-auto hide-scrollbar px-4">
                <div class="flex flex-nowrap md:justify-center gap-4 py-2">
                    <a href="${CONFIG.SOCIAL_LINKS.linkedin}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-[#0077b5] px-4 py-2 rounded-xl text-sm"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-[#06c755] px-4 py-2 rounded-xl text-sm"><i class="fab fa-line"></i> LINE</a>
                    <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-black border border-white/20 px-4 py-2 rounded-xl text-sm"><i class="fab fa-tiktok"></i> TikTok</a>
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-[#1da1f2] px-4 py-2 rounded-xl text-sm"><i class="fab fa-twitter"></i> Twitter</a>
                    <a href="${CONFIG.SOCIAL_LINKS.biosite}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-rose-500 px-4 py-2 rounded-xl text-sm">Bio.site</a>
                    <a href="${CONFIG.SOCIAL_LINKS.bluesky}" target="_blank" rel="nofollow" class="social-item inline-flex items-center gap-2 font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl text-sm"><i class="fas fa-cloud"></i> Bluesky</a>
                </div>
            </div>
            
            <div class="mt-8 px-6">
                <p class="inline-block text-[10px] md:text-xs font-bold text-white bg-red-700/80 px-6 py-2 rounded-full uppercase tracking-widest">
                    เว็บไซต์นี้สำหรับผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น
                </p>
            </div>
        </section>

        <section class="grid md:grid-cols-2 gap-10 mb-24 items-start">
            <div class="space-y-6">
                <h2 class="text-3xl font-serif shimmer-gold uppercase tracking-tighter">Common <span class="text-white italic">Questions</span></h2>
                <div class="space-y-4">
                    <details class="glass-ui p-6 rounded-2xl cursor-pointer group">
                        <summary class="flex justify-between font-bold text-xs uppercase tracking-widest items-center">ต้องโอนมัดจำก่อนไหม? <i data-lucide="plus" class="w-4 h-4 transition-transform group-open:rotate-45 text-gold"></i></summary>
                        <p class="mt-4 text-sm text-white/50 leading-relaxed">ไม่ต้องโอนมัดจำครับ ระบบของเราเน้นนัดเจอ จ่ายเงินหน้างานเท่านั้น เพื่อความปลอดภัยสูงสุดของลูกค้า</p>
                    </details>
                    <details class="glass-ui p-6 rounded-2xl cursor-pointer group">
                        <summary class="flex justify-between font-bold text-xs uppercase tracking-widest items-center">รูปภาพตรงปกหรือไม่? <i data-lucide="plus" class="w-4 h-4 transition-transform group-open:rotate-45 text-gold"></i></summary>
                        <p class="mt-4 text-sm text-white/50 leading-relaxed">เราคัดกรองโปรไฟล์ที่มีคุณภาพ หากนัดแล้วไม่ตรงปก ลูกค้าสามารถปฏิเสธและยกเลิกงานได้ทันทีครับ</p>
                    </details>
                </div>
            </div>
            <div class="glass-ui p-10 rounded-[3rem] border-gold/10">
                <h3 class="text-xl font-serif shimmer-gold mb-4 italic">Exclusive Area Coverage</h3>
                <p class="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-8 leading-loose">บริการครอบคลุมพิกัด: <span class="text-white/80">${zones.slice(0, 5).join(' • ')}</span></p>
                <div class="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                    <div><div class="text-2xl font-bold text-gold">${profiles.length}+</div><div class="text-[9px] uppercase text-white/30 font-bold">Active Now</div></div>
                    <div><div class="text-2xl font-bold text-gold">100%</div><div class="text-[9px] uppercase text-white/30 font-bold">Safe Service</div></div>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-white/5 pt-20 pb-10 border-t border-white/5">
        <div class="max-w-[1500px] mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                <div class="md:col-span-4 space-y-6">
                    <div class="text-2xl font-serif shimmer-gold tracking-widest uppercase">${CONFIG.BRAND_NAME}</div>
                    <p class="text-xs leading-relaxed text-gray-400 max-w-sm">
                        แพลตฟอร์มไซด์ไลน์อันดับ 1 ใน${provinceName} มุ่งเน้นความโปร่งใส ปลอดภัย และบริการระดับพรีเมียม เพื่อประสบการณ์ที่ดีที่สุดของคุณ
                    </p>
                </div>
                <div class="md:col-span-2 md:col-start-6">
                    <h3 class="text-white text-xs font-bold mb-6 uppercase tracking-widest">เมนูหลัก</h3>
                    <ul class="space-y-3 text-[11px] text-gray-500">
                        <li><a href="/" class="hover:text-gold transition-colors">หน้าแรก</a></li>
                        <li><a href="/profiles.html" class="hover:text-gold transition-colors">ค้นหาน้องๆ</a></li>
                        <li><a href="/blog.html" class="hover:text-gold transition-colors">บทความน่ารู้</a></li>
                    </ul>
                </div>
                <div class="md:col-span-3">
                    <h3 class="text-white text-xs font-bold mb-6 uppercase tracking-widest">พิกัดยอดนิยม</h3>
                    <ul class="grid grid-cols-1 gap-3 text-[11px] text-gray-500">
                        ${zones.slice(0,4).map(z => `<li><a href="#" class="hover:text-gold transition-colors flex items-center gap-2"><span class="w-1 h-1 bg-gold/30 rounded-full"></span> รับงาน${z}</a></li>`).join('')}
                    </ul>
                </div>
                <div class="md:col-span-3">
                    <h3 class="text-white text-xs font-bold mb-6 uppercase tracking-widest">จองคิวน้องๆ</h3>
                    <p class="text-[10px] text-gray-500 mb-4 uppercase">Admin Service: 10.00 - 04.00 น.</p>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="inline-flex items-center justify-center gap-2 bg-[#06c755] text-white px-6 py-3 rounded-xl text-sm font-bold hover:scale-105 transition-transform w-full shadow-lg shadow-green-500/10">
                        <i class="fab fa-line text-lg"></i> แอดไลน์จองคิว
                    </a>
                </div>
            </div>
            <div class="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-[9px] text-gray-600 uppercase tracking-[0.3em]">© 2026 ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
                <div class="flex gap-8 text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                    <a href="/privacy-policy.html" class="hover:text-gold transition">Privacy</a>
                    <a href="/terms.html" class="hover:text-gold transition">Terms</a>
                </div>
            </div>
            <div class="mt-10 text-[9px] text-gray-700 text-center max-w-2xl mx-auto leading-loose uppercase tracking-tighter opacity-50">
                เว็บไซต์นี้เป็นเพียงสื่อกลางข้อมูลเท่านั้น ข้อมูลทั้งหมดถูกคัดกรองเพื่อความบันเทิงสำหรับผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น
            </div>
        </div>
    </footer>

    <script>
        lucide.createIcons();
        gsap.to('.reveal', { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out' });
        
        // Sticky Header Effect
        window.onscroll = function() {
            const nav = document.querySelector('nav');
            if (window.pageYOffset > 50) {
                nav.classList.add('bg-black/80', 'py-3');
            } else {
                nav.classList.remove('bg-black/80', 'py-3');
            }
        };
    </script>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });

    } catch (e) {
        console.error('Master SSR Error:', e);
        return context.next();
    }
};