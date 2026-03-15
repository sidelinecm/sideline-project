import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// 1. CONFIGURATION
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai',
    BRAND_TH: 'ไซด์ไลน์เชียงใหม่'
};

// 2. HELPERS (SEO & IMAGES)
const optimizeImg = (path, width = 400, height = 533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) return path.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill,g_face/`);
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ'],
        'chonburi': ['พัทยา', 'บางแสน', 'ศรีราชา', 'อมตะนคร', 'สัตหีบ']
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'พื้นที่ใกล้เคียง'];
};

const spinContent = (province, zones) => {
    const intros = [
        `ยินดีต้อนรับสู่แหล่งรวมสาวสวย **รับงาน${province}** ที่ดีที่สุดในขณะนี้`,
        `สัมผัสประสบการณ์สุดพรีเมียมกับน้องๆ **ไซด์ไลน์${province}** ตัวท็อปเกรดพรีเมียม`,
        `ศูนย์รวมโปรไฟล์คุณภาพ **เด็กเอ็น${province}** ฟิวแฟน การันตีตรงปก 100%`
    ];
    const features = [
        `เราคัดสรรน้องๆ รับงานเองในโซน **${zones.slice(0, 4).join(', ')}** มาให้เลือกอย่างจุใจ`,
        `บริการเหนือระดับ เน้นความปลอดภัยสูงสุด **ไม่ต้องโอนมัดจำ** เจอตัวจริงแล้วค่อยจ่ายเงิน`,
        `อัปเดตข้อมูลใหม่ล่าสุดประจำปี ${new Date().getFullYear()} ครอบคลุมพื้นที่ ${zones.slice(4, 7).join(', ')}`
    ];
    const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `<p class="leading-loose">${spin(intros)} ${spin(features)} พร้อมการันตีความพึงพอใจและบริการที่เอาใจเก่งที่สุด</p>`;
};

// 3. MAIN FUNCTION
export default async (request, context) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase.from('provinces').select('*').eq('key', provinceKey).maybeSingle();
        if (!provinceData) return context.next();

        // ดึงโปรไฟล์ (จำกัด 60 คนเพื่อความเร็ว)
        const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
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

        // 🎯 4. SEO & SCHEMA GRAPH
        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} (${CURRENT_YEAR}) | ฟิวแฟน ไม่มัดจำ ตรงปก 100%`;
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง อัปเดตล่าสุด ${profiles.length} คน โซน ${zones.slice(0, 4).join(', ')} ✓การันตีตรงปก ✓ไม่ต้องโอนมัดจำ ✓จ่ายหน้างาน ปลอดภัยที่สุด`;

        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": `${CONFIG.DOMAIN}#website`,
                    "url": CONFIG.DOMAIN,
                    "name": CONFIG.BRAND_NAME
                },
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "description": description,
                    "image": firstImage
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        { "@type": "Question", "name": `บริการไซด์ไลน์ ${provinceName} ต้องโอนมัดจำไหม?`, "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องโอนมัดจำ 100% ครับ แพลตฟอร์มของเราเน้นความปลอดภัย จ่ายเงินสดหน้างานเมื่อเจอตัวจริงเท่านั้น" } },
                        { "@type": "Question", "name": "รับประกันตรงปกจริงไหม?", "acceptedAnswer": { "@type": "Answer", "text": "การันตีรูปตรงปก 100% ครับ หากนัดเจอแล้วไม่ตรงปก สามารถยกเลิกงานได้ทันทีโดยไม่มีค่าใช้จ่าย" } }
                    ]
                }
            ]
        };

        // 🎯 5. GENERATE HTML
        const cardsHTML = profiles.map((p, i) => `
            <article class="profile-card group relative bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 hover:border-gold/50 transition-all duration-500" 
                     onclick='openLB(${JSON.stringify(p)})'>
                <div class="aspect-[3/4] relative overflow-hidden">
                    <img src="${optimizeImg(p.imagePath)}" alt="น้อง${p.name} รับงาน${provinceName} โซน ${p.location || provinceName}" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         ${i < 4 ? 'loading="eager"' : 'loading="lazy"'} decoding="async">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    <div class="absolute bottom-4 left-4">
                        <span class="bg-black/60 backdrop-blur-md text-gold text-[9px] px-3 py-1 rounded-full border border-gold/20 font-bold uppercase italic tracking-widest">● Verified</span>
                    </div>
                </div>
                <div class="p-5">
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
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${firstImage}">
    
    <!-- Meta Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">

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
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-10"></div>
            <img src="${firstImage}" class="w-full h-full object-cover opacity-30" alt="Hero ${provinceName}">
        </div>
        <div class="relative z-20 max-w-4xl space-y-6">
            <p class="reveal text-[9px] tracking-[0.6em] uppercase font-bold text-gold opacity-0">Premium Service Reach</p>
            <h1 class="reveal text-4xl md:text-7xl font-serif font-bold leading-tight opacity-0">
                <span class="font-light italic text-white/80">The Finest</span> <br>
                <span class="shimmer-gold">${provinceName}</span>
            </h1>
        </div>
    </header>

    <main class="max-w-[1500px] mx-auto px-6 py-12">
        <!-- 🎯 SEO Content Section -->
        <section class="mb-16 glass-ui p-8 md:p-12 rounded-[3rem] text-center border-gold/10">
            <h2 class="text-2xl md:text-4xl font-serif shimmer-gold mb-6 italic">ข้อมูลไซด์ไลน์ ${provinceName} อัปเดตล่าสุด</h2>
            <div class="text-white/60 text-sm md:text-base leading-relaxed max-w-4xl mx-auto">
                ${spinContent(provinceName, zones)}
            </div>
            <div class="flex flex-wrap justify-center gap-3 mt-8">
                ${zones.map(z => `<span class="text-[10px] px-4 py-2 bg-white/5 rounded-full border border-white/5 uppercase font-bold tracking-tighter">#รับงาน${z}</span>`).join('')}
            </div>
        </section>

        <!-- 🎯 Grid Gallery -->
        <div id="gallery-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 mb-24">
            ${cardsHTML}
        </div>

        <!-- 🎯 FAQ Section -->
        <section class="grid md:grid-cols-2 gap-12 mb-24">
            <div class="space-y-8">
                <h2 class="text-3xl font-serif shimmer-gold">Frequently Asked <span class="italic text-white">Questions</span></h2>
                <div class="space-y-4">
                    <details class="glass-ui p-6 rounded-3xl border-white/5 cursor-pointer group">
                        <summary class="flex justify-between font-bold text-xs tracking-widest uppercase">ต้องโอนมัดจำก่อนจองไหม? <i data-lucide="plus" class="w-4 h-4 transition-transform group-open:rotate-45"></i></summary>
                        <p class="mt-4 text-sm text-white/50 leading-loose">ไม่ต้องโอนมัดจำ 100% ครับ แพลตฟอร์มของเราเน้นความปลอดภัยสูงสุด ลูกค้าไม่ต้องโอนเงินก่อนนัดเจอเด็ดขาด เจอตัวจริงแล้วค่อยจ่ายเงินหน้างานเท่านั้น</p>
                    </details>
                    <details class="glass-ui p-6 rounded-3xl border-white/5 cursor-pointer group">
                        <summary class="flex justify-between font-bold text-xs tracking-widest uppercase">โปรไฟล์ตรงปกจริงไหม? <i data-lucide="plus" class="w-4 h-4 transition-transform group-open:rotate-45"></i></summary>
                        <p class="mt-4 text-sm text-white/50 leading-loose">เราคัดกรองน้องๆ ที่รับงานเองเป็นหลัก รูปภาพส่วนใหญ่เป็นรูปจริง หากไม่ตรงปกสามารถยกเลิกงานได้ทันทีครับ</p>
                    </details>
                </div>
            </div>
            <div class="glass-ui p-10 rounded-[3rem] flex flex-col justify-center border-gold/10">
                <h3 class="text-2xl font-serif shimmer-gold mb-4 italic">Exclusive Service Area</h3>
                <p class="text-xs text-white/40 leading-loose uppercase tracking-widest mb-6">
                    ครอบคลุมพื้นที่ยอดนิยม: ${zones.join(', ')} และจังหวัดใกล้เคียง นัดหมายง่าย ปลอดภัย ไร้กังวล
                </p>
                <div class="flex gap-4">
                    <div class="text-center"><div class="text-2xl font-bold text-gold">${profiles.length}+</div><div class="text-[8px] uppercase tracking-widest opacity-50">Active Girls</div></div>
                    <div class="w-[1px] h-10 bg-white/10"></div>
                    <div class="text-center"><div class="text-2xl font-bold text-gold">24/7</div><div class="text-[8px] uppercase tracking-widest opacity-50">Support</div></div>
                </div>
            </div>
        </section>
    </main>

    <!-- 🎯 Lightbox Modal -->
    <div id="lb" class="fixed inset-0 z-[2000] hidden bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
        <div class="absolute inset-0" onclick="closeLB()"></div>
        <div class="relative w-full max-w-5xl bg-[#080808] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl scale-95 opacity-0 transition-all duration-500">
            <button onclick="closeLB()" class="absolute top-6 right-6 z-50 p-2 glass-ui rounded-full hover:bg-gold transition"><i data-lucide="x" class="text-white w-5 h-5"></i></button>
            <div class="lg:w-1/2 h-[45vh] lg:h-[75vh] bg-black">
                <img id="lb-img" class="w-full h-full object-contain" src="">
            </div>
            <div class="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <p class="text-[9px] font-bold tracking-[0.4em] uppercase text-gold mb-2 italic">Identity Verified Companion</p>
                <h2 id="lb-name" class="text-4xl md:text-6xl font-serif font-bold shimmer-gold mb-6 uppercase"></h2>
                <div class="grid grid-cols-3 gap-4 mb-8">
                    <div class="glass-ui p-4 rounded-3xl text-center"><div id="lb-age" class="text-xl font-bold"></div><div class="text-[8px] uppercase text-white/40 mt-1">Age</div></div>
                    <div class="glass-ui p-4 rounded-3xl text-center"><div id="lb-height" class="text-xl font-bold"></div><div class="text-[8px] uppercase text-white/40 mt-1">Height</div></div>
                    <div class="glass-ui p-4 rounded-3xl text-center"><div id="lb-weight" class="text-xl font-bold"></div><div class="text-[8px] uppercase text-white/40 mt-1">Weight</div></div>
                </div>
                <div class="glass-ui p-6 rounded-3xl mb-8 border-white/5">
                    <p id="lb-desc" class="text-sm text-white/50 leading-loose italic"></p>
                </div>
                <button id="lb-line" class="w-full py-5 bg-gradient-to-r from-[#aa771c] to-[#fbf5b7] text-black font-extrabold uppercase tracking-[0.2em] rounded-full shadow-2xl hover:scale-105 transition-transform">📲 Add LINE จองคิวตอนนี้</button>
            </div>
        </div>
    </div>

    <footer class="py-16 text-center border-t border-white/5 bg-[#030303]">
        <div class="font-serif shimmer-gold text-2xl mb-4 tracking-[0.3em] uppercase">${CONFIG.BRAND_TH}</div>
        <div class="flex justify-center gap-8 text-[9px] font-bold tracking-widest text-white/30 uppercase mb-8">
            <a href="/faq">FAQ</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a>
        </div>
        <p class="text-[9px] uppercase tracking-[0.5em] text-white/20">© ${CURRENT_YEAR} Secure Elite Selection. No Deposit Required.</p>
    </footer>

   <script>
    lucide.createIcons();
    gsap.to('.reveal', { opacity: 1, y: 0, duration: 1.5, stagger: 0.3, ease: 'power4.out' });

    let currentGallery = [];
    let currentImgIdx = 0;

    function openLB(p) {
        const modal = document.querySelector('#lb > div');
        
        // 1. ใส่ข้อมูลพื้นฐาน
        document.getElementById('lb-name').innerText = p.name;
        document.getElementById('lb-age').innerText = p.age || '22';
        document.getElementById('lb-height').innerText = p.height || '165';
        document.getElementById('lb-weight').innerText = p.weight || '48';
        document.getElementById('lb-desc').innerText = p.description || p.quote || 'น้องสาวสวย งานพรีเมียม ฟิวแฟน เอาใจเก่ง พิกัด เชียงใหม่ ทักคุยได้เลยค่ะ';

        // 2. ระบบรูปภาพและ Gallery
        currentGallery = p.galleryPaths || [p.imagePath];
        currentImgIdx = 0;
        updateModalImage();

        // 3. ระบบลิงก์ LINE (ตรวจสอบความถูกต้อง)
        let lineLink = p.lineId || 'ksLUWB89Y_';
        if (!lineLink.startsWith('http')) {
            lineLink = 'https://line.me/ti/p/~' + lineLink;
        }
        document.getElementById('lb-line').onclick = () => window.open(lineLink);
        
        // 4. แสดง Modal
        document.getElementById('lb').classList.remove('hidden');
        setTimeout(() => { 
            modal.classList.remove('scale-95', 'opacity-0'); 
            modal.classList.add('scale-100', 'opacity-100'); 
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    // ฟังก์ชันเปลี่ยนรูปใน Gallery
    function updateModalImage() {
        let imgUrl = currentGallery[currentImgIdx];
        if (!imgUrl.startsWith('http')) {
            imgUrl = "https://zxetzqwjaiumqhrpumln.supabase.co/storage/v1/object/public/profile-images/" + imgUrl;
        }
        document.getElementById('lb-img').src = imgUrl;
    }

    // ฟังก์ชันปิด Modal
    function closeLB() {
        const modal = document.querySelector('#lb > div');
        modal.classList.add('scale-95', 'opacity-0');
        setTimeout(() => { 
            document.getElementById('lb').classList.add('hidden'); 
            document.body.style.overflow = ''; 
        }, 300);
    }

    // เพิ่มระบบปิดด้วยปุ่ม Esc และการกดลูกศรเปลี่ยนรูป
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('lb').classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowRight') { currentImgIdx = (currentImgIdx + 1) % currentGallery.length; updateModalImage(); }
        if (e.key === 'ArrowLeft') { currentImgIdx = (currentImgIdx - 1 + currentGallery.length) % currentGallery.length; updateModalImage(); }
    });
</script>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8", 
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60" 
            } 
        });
    } catch (e) {
        return context.next();
    }
};