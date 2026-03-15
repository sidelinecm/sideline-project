import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai',
    BRAND_TH: 'ไซด์ไลน์เชียงใหม่',
    TWITTER: '@sidelinecm'
};

// ==========================================
// 2. HELPERS
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
        'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'หลังมอ'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ'],
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'พื้นที่ใกล้เคียง'];
};

const generateSpinContent = (province, zones) => {
    const intros = [
        `ยินดีต้อนรับสู่แหล่งรวมสาวสวย **รับงาน${province}** ที่ดีที่สุด คัดเกรดพรีเมียม`,
        `สัมผัสประสบการณ์ฟิวแฟนสุดประทับใจกับน้องๆ **ไซด์ไลน์${province}** รับงานเองไม่ผ่านคนกลาง`,
        `ศูนย์รวมโปรไฟล์คุณภาพ **เด็กเอ็น${province}** การันตีตรงปก 100% อัปเดตใหม่ล่าสุด`
    ];
    const features = [
        `เน้นความปลอดภัยสูงสุดด้วยนโยบาย **ไม่ต้องโอนมัดจำ** เจอตัวจริงแล้วค่อยจ่ายเงินหน้างานเท่านั้น`,
        `ครอบคลุมพื้นที่ยอดนิยมในโซน **${zones.slice(0, 5).join(', ')}** นัดหมายง่าย เดินทางสะดวก`,
        `รูปจริงทุกคน หากไม่ตรงปกสามารถยกเลิกงานได้ทันทีโดยไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น`
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

        const { data: provinceData } = await supabase
            .from('provinces')
            .select('id, nameThai, key')
            .eq('key', provinceKey)
            .maybeSingle();

        if (!provinceData) return context.next();

        const { data: profiles } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, galleryPaths, location, rate, isfeatured, age, height, weight, description, quote, lineId, lastUpdated')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('lastUpdated', { ascending: false })
            .limit(60);

        if (!profiles || profiles.length === 0) return context.next();

        const provinceName = provinceData.nameThai;
        const zones = getLocalZones(provinceKey);
        const CURRENT_YEAR = new Date().getFullYear();
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const firstImage = optimizeImg(profiles[0].imagePath, 1200, 630);

        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} (${CURRENT_YEAR}) | ฟิวแฟน ไม่มัดจำ ตรงปก 100%`;
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง อัปเดตล่าสุด ${profiles.length} คน โซน ${zones.slice(0, 4).join(', ')} ✓การันตีตรงปก ✓ไม่ต้องโอนมัดจำ ✓จ่ายหน้างาน ปลอดภัยที่สุด`;

        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": `${CONFIG.DOMAIN}#website`,
                    "url": CONFIG.DOMAIN,
                    "name": CONFIG.BRAND_NAME,
                    "inLanguage": "th-TH",
                    "publisher": { "@id": `${CONFIG.DOMAIN}#organization` },
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": `${CONFIG.DOMAIN}/search?q={search_term_string}`,
                        "query-input": "required name=search_term_string"
                    }
                },
                {
                    "@type": ["Organization","LocalBusiness"],
                    "@id": `${CONFIG.DOMAIN}#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "image": firstImage,
                    "sameAs": [
                        "https://linktr.ee/sidelinechiangmai",
                        "https://x.com/Sdl_chiangmai",
                        "https://line.me/ti/p/ksLUMz3p_o"
                    ],
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
                            "acceptedAnswer": { "@type": "Answer", "text": `ครอบคลุมโซนยอดนิยม เช่น ${zones.join(', ')} และพื้นที่ใกล้เคียง สามารถนัดหมายที่โรงแรมหรือห้องพักได้` }
                        },
                        {
                            "@type": "Question",
                            "name": "การันตีตรงปกไหม?",
                            "acceptedAnswer": { "@type": "Answer", "text": "รูปโปรไฟล์มีการอัปเดตสม่ำเสมอ หากไม่ตรงปกสามารถยกเลิกงานได้ทันทีโดยไม่มีค่าใช้จ่าย" }
                        }
                    ]
                }
            ]
        };

        const cardsHTML = profiles.map((p, i) => `
            <article class="profile-card group relative bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 hover:border-gold/5 transition-all duration-500" 
                     onclick='openLB(${JSON.stringify(p)})'>
                <div class="aspect-[3/4] relative overflow-hidden">
                    <img src="${optimizeImg(p.imagePath)}" alt="น้อง${p.name} รับงาน${provinceName} พิกัด ${p.location || provinceName}" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         ${i < 4 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    <div class="absolute bottom-4 left-4">
                        <span class="bg-black/60 backdrop-blur-md text-gold text-[9px] px-3 py-1 rounded-full border border-gold/20 font-bold uppercase italic tracking-widest">● Verified</span>
                    </div>
                    ${p.isfeatured ? '<div class="absolute top-4 right-4 bg-gold text-black text-[8px] font-black px-3 py-1 rounded-full uppercase shadow-xl">Recommended</div>' : ''}
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-1">
                        <h3 class="font-bold text-lg italic shimmer-gold">${p.name}</h3>
                        <span class="text-gold text-xs font-bold">★ ${p.rate || '4.9'}</span>
                    </div>
                    <p class="text-[9px] text-white/40 font-bold uppercase tracking-widest">${p.age || '22'} Yrs / ${p.location || provinceName}</p>
                </div>
            </article>`).join('');

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
        <div class="text-[10px] font-bold tracking-widest text-white/50 uppercase">Explore / ${provinceName}</div>
    </nav>
    <header class="relative h-[70vh] flex items-center justify-center text-center px-6">
        <div class="absolute inset-0 z-0"><div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-10"></div><img src="${firstImage}" class="w-full h-full object-cover opacity-30" alt="พรีเมียมไซด์ไลน์ ${provinceName}"></div>
        <div class="relative z-20 max-w-5xl space-y-6">
            <p class="reveal text-[10px] tracking-[0.6em] uppercase font-black text-gold opacity-0">Premium Selection</p>
            <h1 class="reveal text-4xl md:text-8xl font-serif font-bold leading-tight opacity-0"><span class="font-light italic text-white/80">The Finest</span> <br><span class="shimmer-gold">${provinceName}</span></h1>
        </div>
    </header>
    <main class="max-w-[1500px] mx-auto px-6 py-12">
        <section class="mb-20 glass-ui p-8 md:p-16 rounded-[3.5rem] text-center border-gold/10">
            <h2 class="text-2xl md:text-4xl font-serif shimmer-gold mb-8 italic">เว็บรวมข้อมูล ไซด์ไลน์ ${provinceName} อันดับ 1</h2>
            <div class="text-white/60 text-base md:text-lg leading-loose max-w-4xl mx-auto font-light">${generateSpinContent(provinceName, zones)}</div>
            <div class="flex flex-wrap justify-center gap-2 mt-10">${zones.map(z => `<span class="text-[9px] px-5 py-2 bg-white/5 rounded-full border border-white/5 uppercase font-bold text-white/40">#รับงาน${z}</span>`).join('')}</div>
        </section>
        <div id="gallery-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10 mb-24">${cardsHTML}</div>
        <section class="grid md:grid-cols-2 gap-16 mb-24 items-start">
            <div class="space-y-10">
                <h2 class="text-3xl md:text-5xl font-serif shimmer-gold leading-tight">Frequently Asked <br><span class="italic text-white">Questions</span></h2>
                <div class="space-y-6">
                    <details class="glass-ui p-8 rounded-3xl border-white/5 cursor-pointer group">
                        <summary class="flex justify-between font-bold text-sm tracking-widest uppercase items-center">ต้องโอนมัดจำก่อนจองคิวหรือไม่? <i data-lucide="plus" class="w-5 h-5 transition-transform group-open:rotate-45 text-gold"></i></summary>
                        <p class="mt-6 text-sm text-white/50 leading-loose">**ไม่ต้องโอนมัดจำเด็ดขาดครับ** ลูกค้าจ่ายเงินหน้างานเมื่อเจอตัวจริงเท่านั้น เพื่อความปลอดภัย 100%</p>
                    </details>
                    <details class="glass-ui p-8 rounded-3xl border-white/5 cursor-pointer group">
                        <summary class="flex justify-between font-bold text-sm tracking-widest uppercase items-center">รับประกันว่าน้องๆ จะตรงปกจริงไหม? <i data-lucide="plus" class="w-5 h-5 transition-transform group-open:rotate-45 text-gold"></i></summary>
                        <p class="mt-6 text-sm text-white/50 leading-loose">โปรไฟล์ทั้งหมดได้รับการคัดกรองเบื้องต้น เราการันตีรูปตรงปก หากนัดเจอแล้วไม่ตรงปก ลูกค้ามีสิทธิ์ยกเลิกงานได้ทันทีครับ</p>
                    </details>
                </div>
            </div>
            <div class="glass-ui p-12 rounded-[3.5rem] border-gold/10 flex flex-col justify-center">
                <h3 class="text-2xl md:text-3xl font-serif shimmer-gold mb-6 italic">Elite Service Area</h3>
                <p class="text-sm text-white/40 leading-loose uppercase tracking-widest mb-10">ครอบคลุมพื้นที่: ${zones.join(', ')} และพื้นที่ใกล้เคียง นัดหมายง่าย ปลอดภัย ไร้กังวล</p>
                <div class="grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
                    <div><div class="text-3xl font-bold text-gold mb-1">${profiles.length}+</div><div class="text-[10px] uppercase text-white/30 font-bold">Active Members</div></div>
                    <div><div class="text-3xl font-bold text-gold mb-1">100%</div><div class="text-[10px] uppercase text-white/30 font-bold">No Deposit</div></div>
                </div>
            </div>
        </section>
    </main>
    <div id="lb" class="fixed inset-0 z-[2000] hidden bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4">
        <div class="absolute inset-0" onclick="closeLB()"></div>
        <div class="relative w-full max-w-6xl bg-[#080808] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl scale-95 opacity-0 transition-all duration-500">
            <button onclick="closeLB()" class="absolute top-8 right-8 z-50 p-3 glass-ui rounded-full hover:bg-gold transition group"><i data-lucide="x" class="text-white w-6 h-6 group-hover:rotate-90 transition-transform"></i></button>
            <div class="lg:w-[55%] h-[45vh] lg:h-[80vh] bg-black relative">
                <img id="lb-img" class="w-full h-full object-contain" src="" alt="Profile Gallery">
                <div id="gallery-nav" class="absolute inset-y-0 inset-x-0 flex justify-between items-center px-6 pointer-events-none">
                    <button onclick="changeImg(-1)" class="p-4 glass-ui rounded-full pointer-events-auto hover:bg-gold/20 text-white transition"><i data-lucide="chevron-left" class="w-6 h-6"></i></button>
                    <button onclick="changeImg(1)" class="p-4 glass-ui rounded-full pointer-events-auto hover:bg-gold/20 text-white transition"><i data-lucide="chevron-right" class="w-6 h-6"></i></button>
                </div>
            </div>
            <div class="lg:w-[45%] p-10 md:p-16 flex flex-col justify-center bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
                <h2 id="lb-name" class="text-4xl md:text-7xl font-serif font-bold shimmer-gold mb-8 uppercase tracking-tighter"></h2>
                <div class="grid grid-cols-3 gap-5 mb-10">
                    <div class="glass-ui p-5 rounded-[2rem] text-center"><div id="lb-age" class="text-2xl font-bold">--</div><div class="text-[9px] uppercase text-white/40 mt-1 font-bold">Age</div></div>
                    <div class="glass-ui p-5 rounded-[2rem] text-center"><div id="lb-height" class="text-2xl font-bold">--</div><div class="text-[9px] uppercase text-white/40 mt-1 font-bold">Height</div></div>
                    <div class="glass-ui p-5 rounded-[2rem] text-center"><div id="lb-weight" class="text-2xl font-bold">--</div><div class="text-[9px] uppercase text-white/40 mt-1 font-bold">Weight</div></div>
                </div>
                <div class="glass-ui p-8 rounded-[2.5rem] mb-10 border-white/5"><p id="lb-desc" class="text-sm text-white/60 leading-relaxed italic whitespace-pre-line"></p></div>
                <button id="lb-line" class="w-full py-6 bg-gradient-to-r from-[#aa771c] to-[#fbf5b7] text-black font-black uppercase tracking-[0.3em] rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3"><i data-lucide="message-circle" class="w-5 h-5"></i> Add LINE จองคิว</button>
            </div>
        </div>
    </div>
    <footer class="py-20 text-center border-t border-white/5 bg-[#030303]">
        <div class="font-serif shimmer-gold text-3xl mb-6 tracking-[0.4em] uppercase">${CONFIG.BRAND_TH}</div>
        <p class="text-[10px] uppercase tracking-[0.6em] text-white/10 font-bold">© ${CURRENT_YEAR} Secure Elite Selection. All Rights Reserved.</p>
    </footer>
    <script>
        lucide.createIcons(); gsap.to('.reveal', { opacity: 1, y: 0, duration: 1.5, stagger: 0.3, ease: 'power4.out' });
        let currentGallery = []; let currentIdx = 0;
        function openLB(p) {
            const modal = document.querySelector('#lb > div');
            document.getElementById('lb-name').innerText = p.name;
            document.getElementById('lb-age').innerText = p.age || '--';
            document.getElementById('lb-height').innerText = p.height || '--';
            document.getElementById('lb-weight').innerText = p.weight || '--';
            document.getElementById('lb-desc').innerText = p.description || p.quote || 'น้องสาวสวย งานดี บริการระดับพรีเมียม ทักคุยได้เลยค่ะ';
            currentGallery = p.galleryPaths && p.galleryPaths.length > 0 ? p.galleryPaths : [p.imagePath];
            currentIdx = 0; updateModalImage();
            let line = p.lineId || 'ksLUWB89Y_';
            let lineUrl = line.startsWith('http') ? line : 'https://line.me/ti/p/~' + line;
            document.getElementById('lb-line').onclick = () => window.open(lineUrl, '_blank');
            document.getElementById('lb').classList.remove('hidden');
            setTimeout(() => { modal.classList.remove('scale-95', 'opacity-0'); modal.classList.add('scale-100', 'opacity-100'); }, 10);
            document.body.style.overflow = 'hidden';
            document.getElementById('gallery-nav').style.display = currentGallery.length > 1 ? 'flex' : 'none';
        }
        function updateModalImage() {
            let path = currentGallery[currentIdx];
            document.getElementById('lb-img').src = path.startsWith('http') ? path : "${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/" + path;
        }
        function changeImg(dir) { currentIdx = (currentIdx + dir + currentGallery.length) % currentGallery.length; updateModalImage(); }
        function closeLB() {
            const modal = document.querySelector('#lb > div');
            modal.classList.add('scale-95', 'opacity-0');
            setTimeout(() => { document.getElementById('lb').classList.add('hidden'); document.body.style.overflow = ''; }, 300);
        }
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('lb').classList.contains('hidden')) return;
            if (e.key === 'Escape') closeLB();
            if (e.key === 'ArrowRight' && currentGallery.length > 1) changeImg(1);
            if (e.key === 'ArrowLeft' && currentGallery.length > 1) changeImg(-1);
        });
    </script>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });

    } catch (e) {
        console.error('Master SSR Error:', e);
        return context.next();
    }
};