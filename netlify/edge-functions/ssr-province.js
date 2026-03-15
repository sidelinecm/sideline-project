import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// --- 1. CONFIGURATION (เหมือนเดิม) ---
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)'
};

// --- 2. HELPER FUNCTIONS (ฟังก์ชันช่วยเหลือ) ---

// ปรับปรุงฟังก์ชัน optimizeImg ให้รองรับการปรับขนาดหลายแบบ
const optimizeImg = (path, width = 400, height = 533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill,g_face/`);
    }
    // สำหรับ Supabase Storage, การปรับขนาดต้องทำผ่าน URL transformation ถ้าตั้งค่าไว้
    // ในที่นี้จะคืนค่า URL ตรงไปก่อน
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai':['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง'],
        'bangkok':['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม'],
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'พื้นที่ใกล้เคียง'];
};

// --- 3. MAIN SERVERLESS FUNCTION ---
export default async (request, context) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase
            .from('provinces')
            .select('id, nameThai, key')
            .eq('key', provinceKey)
            .maybeSingle();

        if (!provinceData) return context.next(); // ไม่พบจังหวัด, ไปยังหน้าถัดไป (เช่น 404)

        // ดึงข้อมูลโปรไฟล์ทั้งหมดที่ต้องการสำหรับดีไซน์ใหม่
        const { data: profiles } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, images, location, rate, isfeatured, lastUpdated, age, height, weight, desc, lineId')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('lastUpdated', { ascending: false })
            .limit(60);

        if (!profiles || profiles.length === 0) return context.next();

        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const CURRENT_YEAR = new Date().getFullYear();

        // --- 4. SEO & DYNAMIC CONTENT (สร้างเนื้อหา SEO) ---
        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} (${CURRENT_YEAR}) | ฟิวแฟน ตรงปก ไม่มัดจำ`;
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง คัดเกรดพรีเมียม ${profiles.length}+ คนในโซน ${localZones.slice(0, 3).join(', ')} การันตีตรงปก 100% ปลอดภัย ไม่ต้องโอนมัดจำ`;
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const firstImage = optimizeImg(profiles[0].imagePath, 1200, 630);

        // สร้าง JSON-LD Schema (เหมือนเดิม)
        const schemaData = { /* ... โค้ด schemaData ทั้งหมดจากไฟล์เดิม ... */ };
        
        // --- 5. DYNAMIC HTML GENERATION (สร้าง HTML) ---

        // ฟังก์ชันสร้างการ์ดโปรไฟล์ตามดีไซน์ของ เทมเพล.html
        const createProfileCard = (p) => {
            const allImages = [p.imagePath, ...(p.images || [])]; // รวมรูปปกและรูปอื่นๆ
            const dots = allImages.map((_, i) => 
                `<div class="dot-${p.slug} h-[2px] w-full bg-white/20 rounded-full transition-all ${i === 0 ? 'bg-[#d4af37]' : ''}"></div>`
            ).join('');

            return `
            <div class="profile-card group relative bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl" 
                 onclick='openLB(${JSON.stringify(p)})' 
                 data-images='${JSON.stringify(allImages.map(img => optimizeImg(img)))}'
                 onmousemove="handleMouseMove(event, '${p.slug}')">
                <div class="aspect-[3/4] relative overflow-hidden">
                    <img id="img-${p.slug}" src="${optimizeImg(p.imagePath)}" class="profile-card-img w-full h-full object-cover" alt="โปรไฟล์น้อง${p.name} ไซด์ไลน์${provinceName}" loading="lazy">
                    <div class="absolute top-4 left-4 right-4 flex gap-1.5 z-20">${dots}</div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                    <div class="absolute bottom-4 left-4">
                        <span class="bg-black/70 backdrop-blur-md text-[8px] px-3 py-1 rounded-full border border-white/10 uppercase font-bold tracking-widest text-gold italic">● available</span>
                    </div>
                     ${p.isfeatured ? '<div class="absolute top-4 right-4 bg-gold text-black text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">⭐ Recommended</div>' : ''}
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-1">
                        <h3 class="font-bold text-base uppercase italic tracking-tight">${p.name}</h3>
                        <span class="text-gold text-[10px] font-bold">★ ${p.rate || '4.9'}</span>
                    </div>
                    <p class="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">${p.age || '22'} Yrs / ${p.location || provinceName}</p>
                </div>
            </div>`;
        };
        
        const galleryHTML = profiles.map(createProfileCard).join('');
        const locationOptionsHTML = [...new Set(profiles.map(p => p.location))].filter(Boolean).map(loc => `<option value="${loc}" class="bg-black">${loc}</option>`).join('');

        // สร้าง HTML ทั้งหน้าโดยใช้ Template Literals และแทรกส่วนไดนามิกเข้าไป
        const html = `
<!DOCTYPE html>
<html lang="th" class="scroll-smooth antialiased">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#d4af37" />

    <title>${title}</title>
    <meta name="description" content="${description}"/>
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}" />
    <link rel="canonical" href="${provinceUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${firstImage}" />
    <meta name="twitter:card" content="summary_large_image" />

    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Plus+Jakarta+Sans:wght@300;400;600;700&family=Prompt:wght@300;400;700&display=swap" rel="stylesheet" />
    
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

    <style>
        :root { --dark: #050505; --gold: #d4af37; }
        body { background-color: var(--dark); color: #fff; font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif; overflow-x: hidden; }
        .font-serif { font-family: 'Cinzel', serif; }
        .shimmer-gold { background: linear-gradient(135deg, #b38728 0%, #fbf5b7 50%, #aa771c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% auto; animation: shine 4s linear infinite; }
        @keyframes shine { to { background-position: 200% center; } }
        .glass-ui { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        #main-nav.nav-scrolled { padding: 0.8rem 2rem; background: rgba(0,0,0,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(212, 175, 55, 0.2); }
        .profile-card { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); border: 1px solid rgba(255, 255, 255, 0.03); }
        .profile-card:hover { transform: translateY(-8px); border-color: var(--gold); box-shadow: 0 20px 40px -20px rgba(212, 175, 55, 0.3); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .reveal { opacity: 0; transform: translateY(20px); }
    </style>
</head>
<body class="font-sans">
    <!-- Navigation Bar -->
    <nav id="main-nav" class="fixed top-0 w-full z-[100] px-6 md:px-10 py-4 flex justify-between items-center transition-all duration-500 backdrop-blur-sm">
        <a href="/" class="text-xl md:text-2xl font-serif font-bold tracking-[0.3em] shimmer-gold">SIDELINE <span class="font-light">${provinceKey.toUpperCase()}</span></a>
        <!-- Nav content -->
    </nav>

    <!-- Hero Section -->
    <header class="relative h-screen flex items-center justify-center text-center px-6 pt-16">
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10"></div>
            <img src="${optimizeImg(profiles[0].imagePath, 1920, 1080)}" class="w-full h-full object-cover opacity-40 scale-105" alt="Hero Background ${provinceName}" />
        </div>
        <div class="relative z-20 max-w-5xl space-y-8 text-white">
            <h1 class="reveal text-4xl md:text-[80px] font-serif font-bold leading-[1.1] opacity-0">
                <span class="font-light italic text-white/90">The finest</span> <span class="shimmer-gold">${provinceName}</span><br />
                <span class="text-2xl md:text-4xl font-light tracking-[0.1em] uppercase mt-4 block text-white/70">รับงาน${provinceName} ตรงปก 100%</span>
            </h1>
        </div>
    </header>

    <!-- Main Content Area -->
    <main id="directory" class="max-w-[1500px] mx-auto px-6 py-16 md:py-24">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8">
            <div class="space-y-4">
                <h2 class="text-4xl md:text-5xl font-serif italic">Private <span class="shimmer-gold">Directory</span></h2>
                <select id="provinceFilter" class="bg-transparent text-[10px] uppercase font-bold tracking-widest border border-gold/20 px-4 py-1.5 rounded-full outline-none">
                    <option value="all" class="bg-black">ทุกพิกัดใน${provinceName}</option>
                    ${locationOptionsHTML}
                </select>
            </div>
            <p id="resultCount" class="text-[9px] tracking-[0.3em] uppercase font-bold opacity-50 mt-4 md:mt-0">${profiles.length} Selection Available</p>
        </div>
        <div id="gallery-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 mb-16">
            ${galleryHTML}
        </div>
        
        <!-- FAQ Section -->
        <section class="mt-16 md:mt-20">
             <h2>คำถามที่พบบ่อย (FAQ) เกี่ยวกับไซด์ไลน์${provinceName}</h2>
             <!-- ... เนื้อหา FAQ สามารถสร้างแบบไดนามิกได้ ... -->
        </section>
    </main>

    <!-- Lightbox Modal (เหมือนเดิม) -->
    <div id="lb" class="fixed inset-0 z-[2000] hidden bg-black/80 backdrop-blur-3xl flex items-center justify-center p-4">
        <!-- ... โครงสร้าง HTML ของ Lightbox ทั้งหมด ... -->
    </div>
    
    <!-- Footer (เหมือนเดิม) -->
    <footer class="py-12 px-6 border-t border-white/5 text-center space-y-4 md:space-y-6">
      <p class="text-[9px] text-gray-600 tracking-[0.4em] uppercase">© ${CURRENT_YEAR} Sideline ${provinceName}. Secure Selection.</p>
    </footer>

    <script>
      let currentProfile = null;
      let activeIdx = 0;

      window.onload = () => {
        lucide.createIcons();
        gsap.to('.reveal', { opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: 'power4.out' });
      };
      
      function handleMouseMove(event, slug) {
        const card = event.currentTarget;
        const images = JSON.parse(card.dataset.images);
        if (images.length <= 1) return;
        
        const rect = card.getBoundingClientRect();
        const idx = Math.min(Math.floor(((event.clientX - rect.left) / rect.width) * images.length), images.length - 1);
        
        document.getElementById(\`img-\${slug}\`).src = images[idx];
        document.querySelectorAll(\`.dot-\${slug}\`).forEach((dot, i) => {
            dot.style.background = i === idx ? '#d4af37' : 'rgba(255,255,255,0.2)';
        });
      }

      function openLB(profileData) {
        // โค้ดสำหรับเปิดและอัปเดตข้อมูลใน Lightbox Modal
        // คุณสามารถใช้ profileData ที่ส่งมาเพื่อเติมข้อมูลใน lb-name, lb-age, etc.
        currentProfile = profileData;
        activeIdx = 0;
        document.getElementById('lb').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        updateLB();
      }

      function updateLB() {
        // ฟังก์ชัน updateLB() จากไฟล์เดิม สามารถนำมาวางที่นี่ได้เลย
        // โดยจะใช้ข้อมูลจากตัวแปร currentProfile
      }
      
      function closeLB() {
        document.getElementById('lb').classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
      // ...ฟังก์ชันอื่นๆ ที่จำเป็นสำหรับ Lightbox...
    </script>
</body>
</html>`;

        // คืนค่าเป็น Response ที่มี HTML ที่สร้างขึ้นใหม่
        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });

    } catch (e) {
        console.error('Error:', e);
        return context.next(); 
    }
};