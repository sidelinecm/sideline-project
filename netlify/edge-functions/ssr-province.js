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
    HOT_PROVINCES: [
        { name: 'เชียงใหม่', key: 'chiangmai' },
        { name: 'กรุงเทพ', key: 'bangkok' },
        { name: 'พัทยา', key: 'chonburi' }
    ]
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

        // 🎯 6. FULL HTML OUTPUT
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
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin><link rel="preload" as="image" href="${firstImage}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Plus+Jakarta+Sans:wght@300;400;600;700&family=Prompt:wght@300;400;700&display=swap" rel="stylesheet" />
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        :root { --dark: #050505; --gold: #d4af37; }
        body { background: var(--dark); color: #fff; font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif; overflow-x: hidden; }
        .font-serif { font-family: 'Cinzel', serif; }
        .shimmer-gold { background: linear-gradient(135deg, #b38728 0%, #fbf5b7 50%, #aa771c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% auto; animation: shine 4s linear infinite; }
        @keyframes shine { to { background-position: 200% center; } }
        .glass-ui { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .profile-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px -20px rgba(212, 175, 55, 0.3); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
    </style>
</head>
<body>
    <nav class="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center transition-all duration-500 backdrop-blur-md border-b border-gold/10">
        <a href="/" class="text-xl md:text-2xl font-serif font-bold tracking-[0.2em] shimmer-gold">${CONFIG.BRAND_NAME}</a>
        <div class="text-[10px] font-bold tracking-widest text-white/50 uppercase">Directory / ${provinceName}</div>
    </nav>

    <!-- 🎯 Hero Section Optimized with Thai H1 -->
    <header class="relative h-[70vh] flex items-center justify-center text-center px-6">
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-10"></div>
            <img src="${firstImage}" class="w-full h-full object-cover opacity-30" alt="หาเด็ก${provinceName} รับงาน${provinceName}">
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
        <!-- 🎯 Rich SEO Content Section -->
        <section class="mb-20 glass-ui p-8 md:p-16 rounded-[3.5rem] text-center border-gold/10">
            <h2 class="text-2xl md:text-4xl font-serif shimmer-gold mb-8 italic">หาเด็ก${provinceName} น้องๆ รับงานเอง ตัวท็อป</h2>
            <div class="text-white/60 text-base md:text-lg leading-loose max-w-4xl mx-auto font-light">
                ${generateMasterSeoText(provinceName, zones, profiles.length)}
            </div>
            <div class="flex flex-wrap justify-center gap-2 mt-10">
                ${zones.map(z => `<span class="text-[9px] px-5 py-2 bg-white/5 rounded-full border border-white/5 uppercase font-bold text-white/30">#รับงาน${z}</span>`).join('')}
            </div>
        </section>

        <!-- 🖼️ Gallery Grid (Navigate directly on click) -->
        <div id="gallery-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10 mb-24">
            ${cardsHTML}
        </div>

        <section class="grid md:grid-cols-2 gap-16 mb-24 items-start">
            <div class="space-y-10">
                <h2 class="text-3xl md:text-5xl font-serif shimmer-gold leading-tight">Frequently Asked <br><span class="italic text-white">Questions</span></h2>
                <div class="space-y-6">
                    <details class="glass-ui p-8 rounded-3xl border-white/5 cursor-pointer group">
                        <summary class="flex justify-between font-bold text-sm tracking-widest uppercase items-center">ต้องโอนมัดจำก่อนจองคิวหรือไม่? <i data-lucide="plus" class="w-5 h-5 transition-transform group-open:rotate-45 text-gold"></i></summary>
                        <p class="mt-6 text-sm text-white/50 leading-loose">**ไม่ต้องโอนมัดจำเด็ดขาดครับ** แพลตฟอร์มของเราเน้นความปลอดภัยสูงสุด ลูกค้าจ่ายเงินหน้างานเมื่อเจอตัวจริงเท่านั้น เพื่อป้องกันมิจฉาชีพ 100%</p>
                    </details>
                    <details class="glass-ui p-8 rounded-3xl border-white/5 cursor-pointer group">
                        <summary class="flex justify-between font-bold text-sm tracking-widest uppercase items-center">รับประกันว่าน้องๆ จะตรงปกจริงไหม? <i data-lucide="plus" class="w-5 h-5 transition-transform group-open:rotate-45 text-gold"></i></summary>
                        <p class="mt-6 text-sm text-white/50 leading-loose">โปรไฟล์ทั้งหมดได้รับการคัดกรองเบื้องต้น หากนัดเจอแล้วไม่ตรงปก ลูกค้ามีสิทธิ์ยกเลิกงานได้ทันทีโดยไม่เสียค่าใช้จ่ายครับ</p>
                    </details>
                </div>
            </div>
            <div class="glass-ui p-12 rounded-[3.5rem] border-gold/10 flex flex-col justify-center">
                <h3 class="text-2xl md:text-3xl font-serif shimmer-gold mb-6 italic">Elite Service Area</h3>
                <p class="text-sm text-white/40 leading-loose uppercase tracking-widest mb-10">ครอบคลุมพื้นที่ยอดนิยมใน ${provinceName}: <br><span class="text-white/80">${zones.join(', ')}</span></p>
                <div class="grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
                    <div><div class="text-3xl font-bold text-gold mb-1">${profiles.length}+</div><div class="text-[10px] uppercase text-white/30 font-bold">Active Members</div></div>
                    <div><div class="text-3xl font-bold text-gold mb-1">100%</div><div class="text-[10px] uppercase text-white/30 font-bold">No Deposit</div></div>
                </div>
            </div>
        </section>
    </main>

    <footer class="py-20 text-center border-t border-white/5 bg-[#030303]">
        <div class="font-serif shimmer-gold text-3xl mb-8 tracking-[0.4em] uppercase">${CONFIG.BRAND_TH}</div>
        <div class="flex flex-wrap justify-center gap-6 text-[10px] font-black tracking-widest text-white/20 uppercase mb-12">
            ${CONFIG.HOT_PROVINCES.map(p => `<a href="/location/${p.key}" class="hover:text-gold transition">ไซด์ไลน์${p.name}</a>`).join('')}
        </div>
        <p class="text-[10px] uppercase tracking-[0.6em] text-white/10 font-bold">© ${CURRENT_YEAR} Secure Elite Selection. All Rights Reserved.</p>
    </footer>

    <script>
        lucide.createIcons();
        gsap.to('.reveal', { opacity: 1, y: 0, duration: 1.5, stagger: 0.3, ease: 'power4.out' });
    </script>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });

    } catch (e) {
        console.error('Master SSR Error:', e);
        return context.next();
    }
};