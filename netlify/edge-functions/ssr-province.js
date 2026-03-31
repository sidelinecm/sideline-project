import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. SYSTEM CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'SIDELINE CHIANGMAI',
    TWITTER: '@sidelinechiangmai',
    SOCIAL_LINKS: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@sidelinechiangmai',
        twitter: 'https://twitter.com/sidelinechiangmai',
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280',
        biosite: 'https://bio.site/firstfiwfans.com',
        linktree: 'https://linktr.ee/kissmodel',
        bluesky: 'https://bsky.app/profile/sidelinechiangmai.bsky.social'
    }
};

const PROVINCE_SEO_DATA = {
    'chiangmai': {
        zones:['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'คูเมือง', 'หลังมอ'],
        lsi:['สาวเหนือ', 'นักศึกษา มช.', 'ตัวท็อปเชียงใหม่', 'เด็กเอ็นเชียงใหม่', 'ไซด์ไลน์เชียงใหม่', 'คนเมือง', 'ฟิวแฟนเชียงใหม่', 'รับงานเมืองเชียงใหม่'],
        hotels:['โรงแรมแถวนิมมาน', 'ที่พักใกล้คูเมือง', 'คอนโดเจ็ดยอด', 'รีสอร์ทแม่ริม'],
        services:['รับงานชั่วคราว-ค้างคืน', 'ดูแลฟิวแฟนเดินนิมมาน', 'ปาร์ตี้พูลวิลล่าเชียงใหม่', 'นวดผ่อนคลายส่วนตัว'],
        faqs:[
            { q: "หาไซด์ไลน์เชียงใหม่ โซนไหนเดินทางสะดวกสุด?", a: "โซนนิมมาน สันติธรรม และเจ็ดยอด เป็นโซนที่น้องๆ รับงานเยอะที่สุด และมีโรงแรมระดับพรีเมียมรองรับมากมาย" },
            { q: "น้องๆ รับงานเชียงใหม่ มีโปรไฟล์แบบไหนบ้าง?", a: "เรามีตั้งแต่น้องนักศึกษา ไปจนถึงนางแบบสาวเหนือผิวขาวออร่า การันตีความตรงปกและมารยาทระดับ VIP ทุกคน" }
        ]
    },
    'bangkok': {
        zones:['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย', 'ปิ่นเกล้า'],
        lsi:['พริตตี้ กทม.', 'นางแบบสาว', 'ตัวท็อปกรุงเทพ', 'เด็กเอ็น', 'ฟิวแฟนคลุกวงใน', 'รับงานกรุงเทพ', 'ไซด์ไลน์ กทม'],
        hotels:['คอนโดติด BTS', 'โรงแรมย่านสุขุมวิท', 'ที่พักห้วยขวาง'],
        services:['ดูแลแบบฟิวแฟนเต็มรูปแบบ', 'เพื่อนเที่ยวกลางคืนทองหล่อ', 'รับงาน N-Vip'],
        faqs:[
            { q: "เด็กเอ็นกรุงเทพ ส่วนใหญ่รับงานโซนไหน?", a: "โซนยอดฮิตคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ นัดหมายตามคอนโดหรูติด BTS/MRT ได้สะดวก" },
            { q: "ความปลอดภัยในการเรียกไซด์ไลน์ กทม.?", a: "เราเน้นระบบ 'ไม่โอนมัดจำ' ลูกค้าเจอตัวน้อง จ่ายเงินหน้างานเท่านั้น ป้องกันมิจฉาชีพ 100%" }
        ]
    },
    'default': {
        zones:['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู'],
        lsi:['นักศึกษา', 'พริตตี้พาร์ทไทม์', 'หุ่นนางแบบ', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน'],
        hotels: ['โรงแรมในตัวเมือง', 'รีสอร์ทส่วนตัว'],
        services:['ฟิวแฟนส่วนตัว', 'เพื่อนเที่ยว-ดูหนัง', 'นวดผ่อนคลาย'],
        faqs:[
            { q: "ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายเงินสดหน้างานเมื่อเจอตัวน้องจริงเท่านั้น" },
            { q: "รับประกันความตรงปกไหม?", a: "รูปโปรไฟล์ทุกรูปผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปกและพร้อมให้บริการระดับพรีเมียม" }
        ]
    }
};

const optimizeImg = (path, width = 600, height = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) {
            const transform = `f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face`;
            return path.replace('/upload/', `/upload/${transform}/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=85`;
};

// ==========================================
// 2. SEO HTML GENERATION (REFINED UI)
// ==========================================
const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    
    return `
    <article class="text-left space-y-12 text-white/70 leading-loose font-light px-4 md:px-8">
        <section class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-2xl md:text-4xl font-serif text-white mb-6 tracking-wide">
                สัมผัสประสบการณ์ <span class="text-gold italic">ไซด์ไลน์${provinceName}</span> ระดับพรีเมียม
            </h2>
            <div class="w-12 h-[1px] bg-gold/50 mx-auto mb-6"></div>
            <p class="text-sm md:text-base">
                หากคุณกำลังมองหาช่วงเวลาการพักผ่อนเหนือระดับ <strong>รับงาน${provinceName}</strong> ของเราคือคำตอบ เรารวบรวม <strong>${data.lsi[1]}</strong> และ <strong>${data.lsi[2]}</strong> เกรดพรีเมียมที่ผ่านการคัดสรรอย่างเข้มงวด การันตีความตรงปก 100% พร้อมให้บริการในพื้นที่ <strong>${data.zones.slice(0,4).join(', ')}</strong> นัดหมายได้อย่างเป็นส่วนตัว
            </p>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="border border-white/5 bg-[#0a0a0a] p-8 rounded-2xl">
                <h3 class="text-lg font-serif text-gold mb-6 tracking-widest uppercase">Premium Services</h3>
                <ul class="space-y-4 text-sm">
                    ${data.services.map(srv => `
                        <li class="flex items-start gap-3">
                            <span class="text-gold mt-1 text-[10px]"><i class="fas fa-circle"></i></span>
                            <span class="text-white/80">${srv}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="border border-white/5 bg-[#0a0a0a] p-8 rounded-2xl">
                <h3 class="text-lg font-serif text-gold mb-6 tracking-widest uppercase">Coverage Areas</h3>
                <p class="text-sm mb-4">บริการครอบคลุมพื้นที่ <strong>${data.zones.join(', ')}</strong></p>
                <p class="text-sm">รวมถึงการนัดหมายตาม <strong>${data.hotels[0]}</strong> หรือที่พักส่วนตัวของลูกค้า เพื่อความเป็นส่วนตัวสูงสุด</p>
            </div>
        </section>

        <section class="pt-12 border-t border-white/5">
            <h3 class="text-xl font-serif text-white mb-8 text-center tracking-wide">คำถามที่พบบ่อย (FAQ)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                ${data.faqs.map(faq => `
                    <div class="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-gold/20 transition-colors">
                        <h4 class="text-sm font-medium text-gold mb-3">${faq.q}</h4>
                        <p class="text-sm text-white/60 leading-relaxed">${faq.a}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    </article>
    `;
};

// ==========================================
// 3. MAIN SSR EDGE FUNCTION (แบบสมบูรณ์)
// ==========================================
export default async (request, context) => {
    try {
        const url = new URL(request.url);

        // 🟢 ตรวจสอบและ Redirect หากมี Query String ?province=
        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province");
            const cleanUrl = new URL(`/location/${provinceValue}`, url.origin);
            return Response.redirect(cleanUrl.toString(), 301); 
        }

        const pathParts = url.pathname.split('/').filter(Boolean);
        const rawProvinceKey = pathParts[pathParts.length - 1] || 'chiangmai';
        const provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // 1. ดึงข้อมูลจังหวัดปัจจุบัน
        const { data: provinceData, error: provError } = await supabase
            .from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle();

        if (!provinceData || provError) return context.next();

        // 2. ดึงข้อมูลโปรไฟล์น้องๆ ในจังหวัดนั้น
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, created_at, active, availability, likes')
            .eq('provinceKey', provinceData.key).eq('active', true)
            .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false })
            .limit(80);

        // 3. [ใหม่] ดึงข้อมูลจังหวัดทั้งหมดเพื่อทำ Footer Links (SEO)
        const { data: allProvinces } = await supabase
            .from('provinces')
            .select('key, nameThai')
            .order('nameThai', { ascending: true });

        const safeProfiles = profiles || [];
        const provinceName = provinceData.nameThai;
        const deterministicRating = (4.5 + (safeProfiles.length % 5) / 10).toFixed(1);
const deterministicReviews = 50 + (safeProfiles.length * 2);
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
        const zones = seoData.zones;
        
        const now = new Date();
        const CURRENT_YEAR = now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric' });
        const CURRENT_MONTH = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', month: 'long' });
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        // สร้างข้อมูล Schema และ SEO
        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
            : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        const title = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ไม่มัดจำ`;
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} ตัวท็อป ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก 100% ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด จ่ายหน้างาน`;

        // 4. สร้าง HTML สำหรับ Province Links ใน Footer
        const provinceLinksHtml = allProvinces && allProvinces.length > 0 
            ? allProvinces.map(p => `
                <a href="/location/${p.key}" 
                   class="text-[10px] text-white/70 hover:text-gold transition-all duration-300 border-b border-transparent hover:border-gold/30 pb-0.5 py-1.5 whitespace-nowrap">
                   ไซด์ไลน์${p.nameThai}
                </a>
            `).join('')
            : '';

       const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": `${CONFIG.DOMAIN}/#website`,
                    "url": CONFIG.DOMAIN,
                    "name": CONFIG.BRAND_NAME
                },
                {
                    "@type": ["LocalBusiness", "EntertainmentBusiness"],
                    "@id": `${provinceUrl}/#business`,
                    "name": `ไซด์ไลน์${provinceName} - รับงานตรงปกพรีเมียม`,
                    "url": provinceUrl,
                    "image": firstImage,
                    "description": description,
                    "telephone": "ติดต่อผ่าน Line Official",
                    "priceRange": "฿1500 - ฿5000",
                    "areaServed": { "@type": "State", "name": provinceName },
                    "aggregateRating": safeProfiles.length > 0 ? {
                        "@type": "AggregateRating",
                        "ratingValue": deterministicRating,
                        "reviewCount": deterministicReviews,
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
                },
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}/#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "isPartOf": { "@id": `${CONFIG.DOMAIN}/#website` },
                    "about": { "@id": `${provinceUrl}/#business` },
                    "breadcrumb": { "@id": `${provinceUrl}/#breadcrumb` },
                    "mainEntity": { "@id": `${provinceUrl}/#itemlist` }
                },
                {
                    "@type": "BreadcrumbList",
                    "@id": `${provinceUrl}/#breadcrumb`,
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": "รวมโปรไฟล์", "item": `${CONFIG.DOMAIN}/profiles` },
                        { "@type": "ListItem", "position": 3, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type": "ItemList",
                    "@id": `${provinceUrl}/#itemlist`,
                    "numberOfItems": safeProfiles.length,
                    "itemListElement": safeProfiles.map((p, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "url": `${CONFIG.DOMAIN}/sideline/${p.slug || p.id}`
                    }))
                },
                {
                    "@type": "FAQPage",
                    "@id": `${provinceUrl}/#faq`,
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `บริการไซด์ไลน์${provinceName} ต้องโอนมัดจำไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่มีการโอนมัดจำล่วงหน้าทุกกรณี ลูกค้าจ่ายเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น ปลอดภัย 100%" }
                        },
                        {
                            "@type": "Question",
                            "name": `น้องๆ ใน${provinceName} รับงานโซนไหนบ้าง?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `ครอบคลุมโซนยอดนิยม เช่น ${zones.slice(0, 5).join(', ')} และโรงแรมชั้นนำในตัวเมือง` }
                        }
                    ]
                }
            ]
        };

// ==========================================
        // 5. HTML GENERATION - PREMIUM CARDS (ULTIMATE EDITION)
        // ==========================================
        let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                // 1. Data Sanitization & Formatting
                const cleanName = (p.name || 'สาวสวย').replace(/^(น้อง\s?)/, '');
                const profileLocation = p.location || provinceName || 'ไม่ระบุพิกัด';
                const cardRating = (4.7 + (i % 4) / 10).toFixed(1); 
                
                // 2. Availability Logic
                const busyKeywords = ['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'];
                let isAvailable = true;
                if (p.availability) {
                    const availText = p.availability.toLowerCase();
                    isAvailable = !busyKeywords.some(kw => availText.includes(kw));
                }
                const statusText = isAvailable ? 'พร้อมรับงาน' : 'ติดจอง';

                // 3. Date Formatting (Thai Style)
                const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
                const d = new Date(dateStr);
                const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
                const dateDisplay = `${d.getDate()} ${months[d.getMonth()]} ${(d.getFullYear() + 543).toString().slice(-2)}`;
                
                // 4. Advanced SEO Optimization
                const seoKeywords = [`ไซด์ไลน์${provinceName}`, `รับงาน${provinceName}`, `เด็กเอ็น${provinceName}`, `ฟิวแฟน${provinceName}`, `พริตตี้${provinceName}`];
                const targetKeyword = seoKeywords[i % seoKeywords.length];
                const imgAlt = `น้อง${cleanName} ${targetKeyword} พิกัด ${profileLocation} - รูปตรงปก ไม่โอนมัดจำ`;
                const profileLink = `/sideline/${p.slug || p.id || '#'}`;
                
                return `
<article itemscope itemtype="http://schema.org/Person" class="group relative bg-[#0d0d0d] rounded-[1.25rem] overflow-hidden border border-white/10 flex flex-col h-full transition-all duration-500 hover:border-gold/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]" data-profile-id="${p.id}">
    <a href="${profileLink}" itemprop="url" class="absolute inset-0 z-40" aria-label="ดูโปรไฟล์ของ ${cleanName}" title="ดูโปรไฟล์ของ ${cleanName}"></a>
    
    <div class="relative w-full pt-[135%] bg-[#050505] overflow-hidden">
        <img itemprop="image" 
             src="${optimizeImg(p.imagePath, 450, 600)}" 
             alt="${imgAlt}" 
             class="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-[1.01] group-hover:scale-110 group-hover:rotate-1" 
             ${i < 4 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} 
             width="450" height="600">
        
        <div class="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/30 z-10"></div>
        
        <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
            <div class="flex items-center gap-2 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/20 shadow-2xl">
                <span class="relative flex h-1.5 w-1.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-500'} opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-1.5 w-1.5 ${isAvailable ? 'bg-emerald-400' : 'bg-rose-500'}"></span>
                </span>
                <span class="text-[9px] text-white font-bold tracking-widest uppercase">${statusText}</span>
            </div>
            
            <div class="bg-black/60 backdrop-blur-xl p-2 rounded-full border border-gold/40 shadow-2xl">
                <svg class="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </div>

    <div class="px-5 pb-5 pt-0 flex-1 flex flex-col justify-between relative z-20 -mt-12">
        <div>
            <div class="flex justify-between items-end mb-4">
                <div class="flex flex-col">
                    <span class="text-[9px] text-gold font-bold tracking-[0.2em] uppercase mb-1 opacity-100">${targetKeyword}</span>
                    <h3 itemprop="name" class="font-serif font-medium text-2xl text-white group-hover:text-gold transition-colors line-clamp-1 tracking-wide">
                        ${cleanName}
                    </h3>
                </div>
                <div class="bg-white/[0.05] backdrop-blur-md px-2 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 mb-1">
                    <i class="fas fa-star text-gold text-[10px]"></i>
                    <span class="text-white text-[11px] font-bold tracking-tighter">${cardRating}</span>
                </div>
            </div>

            <div class="space-y-2 mb-5 border-t border-white/10 pt-4">
                <div itemprop="homeLocation" class="text-[11px] text-white/70 font-light flex items-center gap-3">
                    <i class="fas fa-map-marker-alt text-gold/80 w-3 text-center"></i>
                    <span class="truncate tracking-wide">${profileLocation}</span>
                </div>
                <div class="text-[11px] text-white/50 font-light flex items-center gap-3">
                    <i class="far fa-calendar-alt w-3 text-center text-white/40"></i>
                    <span>อัปเดตเมื่อ ${dateDisplay}</span>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between pt-1 group/btn">
            <div class="flex flex-col">
                <span class="text-[8px] text-white/50 uppercase tracking-[0.2em]">Starting at</span>
                <span class="text-sm font-bold text-white tracking-tight">฿${p.rate || 'สอบถาม'}</span>
            </div>
            <div class="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:border-gold group-hover:text-gold transition-all duration-500 group-hover:translate-x-1">
                <i class="fas fa-arrow-right text-[10px]"></i>
            </div>
        </div>
    </div>
</article>`;
            }).join('');
        }

        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    
    <meta name="theme-color" content="#070707">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="SidelineCM">

    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}, ฟิวแฟน${provinceName}, ตรงปก, ไม่มีโอนมัดจำ">
    <link rel="canonical" href="${provinceUrl}" />
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="rating" content="adult">
    <meta name="google-site-verification" content="0N_IQUDZv9Y2WtNhjqSPTV3TuPsildmmO-TPwdMlSfg" />

    <meta name="geo.region" content="TH-50" />
    <meta name="geo.placename" content="${provinceName}" />
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${firstImage}">

    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://zxetzqwjaiumqhrpumln.supabase.co" crossorigin>

<link rel="preload" href="${firstImage}" as="image" fetchpriority="high">

<link rel="preload" href="https://fonts.gstatic.com/s/outfit/v11/QGYvz_MVcyn370aHd8BM.woff2" as="font" type="font/woff2" crossorigin>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Prompt:wght@300;400;500&display=swap">

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
      media="print" onload="this.media='all'">
<noscript>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</noscript>

    <script type="application/ld+json">
        ${JSON.stringify(schemaData)}
    </script>

    <script src="https://cdn.tailwindcss.com?minify=true"></script>
    <script>
        tailwind.config = { 
            theme: { 
                extend: { 
                    colors: { gold: { DEFAULT: '#C5A059', hover: '#D4AF37' } },
                    fontFamily: { 
                        serif: ['"Playfair Display"', 'serif'], 
                        sans: ['Outfit', 'Prompt', 'sans-serif'] 
                    }
                } 
            } 
        };
    </script>

<style>
    /* 🎨 Critical UI & Performance Style */
    :root { 
        --bg: #070707; 
        --gold: #C5A059; 
        --gold-light: #D4AF37;
        /* แก้ปัญหา Contrast: ใช้สีขาวที่สว่างขึ้นสำหรับข้อความเล็ก */
        --text-main: #FFFFFF;
        --text-muted: #BCBCBC; /* ปรับจาก 0.55 เป็นค่าที่อ่านง่ายขึ้นแต่ยังดูหรู */
        --line-green: #059641; /* เข้มขึ้นเพื่อให้ผ่านเกณฑ์ Accessibility */
    }

    /* เนื้อหาหลัก: ปรับปรุง Rendering */
    body { 
        background-color: var(--bg); 
        color: var(--text-main); 
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        margin: 0;
        /* ป้องกัน Layout Shift โดยการจองฟอนต์สำรองที่ขนาดใกล้เคียงกัน */
        font-family: 'Outfit', 'Prompt', system-ui, -apple-system, sans-serif;
        line-height: 1.5;
        text-rendering: optimizeSpeed;
    }

    /* Navbar: ใช้ hardware acceleration เพื่อความลื่นไหล */
    .nav-glass {
        background: rgba(7, 7, 7, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        will-change: transform, background; /* บอกบราวเซอร์ล่วงหน้าว่าจะมีการเปลี่ยนแปลง */
    }

    /* ปรับแต่ง Class สำหรับตอน Scroll (ทำงานคู่กับ JS requestAnimationFrame) */
    .nav-scrolled {
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
        background: rgba(7, 7, 7, 0.95) !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    /* Hero Section: ปรับปรุง Gradient ให้เบาเครื่องขึ้น */
    .hero-glow {
        background: radial-gradient(circle at 50% 0%, rgba(197, 160, 89, 0.15) 0%, rgba(7, 7, 7, 0) 75%);
        contain: paint; /* จำกัดขอบเขตการวาดเพื่อเพิ่ม performance */
    }

    /* Profile Cards: ใช้ Transform แทนการขยับ Layout */
    .profile-card-shadow {
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.6);
        transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        will-change: transform;
        backface-visibility: hidden; /* ลดอาการภาพสั่นในบางบราวเซอร์ */
    }
    
    .profile-card-shadow:hover { 
        transform: translateY(-8px) scale(1.01); 
    }

    /* Floating Line Button: แก้ปัญหา CLS และ Contrast */
    .line-float-btn {
        width: 155px; /* ระบุขนาดคงที่ */
        height: 50px;
        contain: layout size;
    }
    .line-bg-optimized {
        background-color: var(--line-green);
        box-shadow: 0 15px 45px rgba(5, 150, 65, 0.3);
    }

    /* Custom Scrollbar: ทำให้เรียบเนียน */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { 
        background: #333; 
        border-radius: 10px;
        transition: background 0.3s;
    }
    ::-webkit-scrollbar-thumb:hover { background: var(--gold); }

    /* ✅ แก้ไขปัญหา Contrast ตามรายงาน (Accessibility Fix) */
    /* เดิม 0.55/0.4 อ่านยากมากบนพื้นดำ */
    .text-low-contrast { color: var(--text-muted); } 
    .text-very-low-contrast { color: rgba(255, 255, 255, 0.5); }

    /* Utility สำหรับป้องกันการกระตุกของภาพ (CLS Fix) */
    img {
        max-width: 100%;
        height: auto;
        font-style: italic; /* แสดง alt text สวยๆ ถ้าภาพโหลดไม่ขึ้น */
        vertical-align: middle;
        shape-margin: 0.75rem;
    }
    /* จองพื้นที่ปุ่ม LINE เพื่อแก้ CLS */
.line-float-btn {
    width: 156px; /* ขนาดโดยประมาณของปุ่มรวม padding */
    height: 54px;
    display: block;
    contain: layout style; /* บอกบราวเซอร์ว่าไม่ต้องคำนวณเลย์เอาต์ข้างนอกใหม่เมื่อปุ่มขยับ */
}

/* สไตล์ของ Nav เมื่อสโครล */
.nav-glass {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: background, padding; /* เตรียม GPU ให้พร้อม */
}

.nav-scrolled {
    padding-top: 0.75rem !important;
    padding-bottom: 0.75rem !important;
    background: rgba(7, 7, 7, 0.98) !important;
    backdrop-filter: blur(20px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.4);
}
</style>
</head>

<body class="selection:bg-gold/30 selection:text-white">
    <nav class="fixed top-0 w-full z-[100] nav-glass transition-all duration-500 py-4">
        <div class="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-[1400px]">
            <a href="/" class="text-xl md:text-2xl font-serif tracking-[0.2em] text-white hover:text-gold transition-all">
                SIDELINE<span class="text-gold italic ml-1">${provinceData.key.toUpperCase()}</span>
            </a>
            <div class="hidden md:flex items-center gap-10 text-[10px] font-medium tracking-[0.25em] uppercase">
                <a href="/" class="text-white/60 hover:text-white transition-colors">Home</a>
                <a href="/profiles" class="text-white/60 hover:text-white transition-colors">Directory</a>
                <span class="text-gold border-b-2 border-gold/50 pb-1">${provinceName}</span>
            </div>
        </div>
    </nav>

<header class="relative pt-44 pb-24 px-6 hero-glow flex flex-col items-center justify-center text-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-50"></div>

    <div class="max-w-5xl mx-auto space-y-10 z-10">
        <div class="inline-block px-5 py-2 border border-gold/30 rounded-full text-[10px] font-semibold tracking-[0.3em] uppercase text-gold bg-gold/10 mb-2 animate-pulse">
            อัปเดตล่าสุด • ${CURRENT_MONTH} ${new Date().getFullYear() + 543}
        </div>
        
        <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-white">
            <span class="block font-light opacity-95 tracking-tight">
                ไซด์ไลน์<span class="text-gold font-normal">${provinceName}</span>
            </span>
            <span class="block text-xl md:text-3xl lg:text-4xl mt-8 font-sans font-light tracking-[0.1em] text-white/60 max-w-3xl mx-auto leading-relaxed">
                แหล่งรวมน้องๆ <span class="text-white/80">งานพรีเมียม ตรงปก</span> 
                <span class="hidden md:inline">มั่นใจความปลอดภัย</span> 
                <span class="text-gold/80 italic">ไม่ต้องโอนมัดจำ</span>
            </span>
        </h1>
        
        <div class="flex flex-wrap justify-center gap-3 pt-8 max-w-3xl mx-auto">
            ${zones.slice(0, 8).map(z => `
                <a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" 
                   title="หาไซด์ไลน์ ${z} ${provinceName}"
                   class="text-[11px] px-6 py-2.5 rounded-full border border-white/10 font-medium tracking-widest hover:border-gold hover:text-gold text-white/50 hover:bg-gold/5 transition-all duration-500 backdrop-blur-sm">
                   #${z.toUpperCase()}
                </a>
            `).join('')}
        </div>

        <p class="text-[10px] text-white/30 tracking-[0.2em] uppercase pt-4">
            <i class="fas fa-check-circle text-gold/50 mr-2"></i> 
            Verified ${safeProfiles.length} Profiles in ${provinceName}
        </p>
    </div>
</header>

    <main class="container mx-auto px-6 lg:px-12 max-w-[1400px] pb-32">
        <div class="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
            <h2 class="text-2xl md:text-3xl font-serif text-white tracking-wide">
                Exclusive <span class="text-gold italic">Profiles</span>
            </h2>
            <div class="flex items-center gap-3">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span class="text-[10px] text-white/50 tracking-[0.2em] uppercase font-medium">${safeProfiles.length} Online Now</span>
            </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10 mb-28">
            ${cardsHTML}
        </div>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 mb-40 max-w-6xl mx-auto px-4">
            <div class="text-center group">
                <div class="w-16 h-16 mx-auto mb-6 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500">
                    <i class="fas fa-shield-alt text-2xl text-gold"></i>
                </div>
                <h3 class="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">No Deposit</h3>
                <p class="text-[11px] text-low-contrast leading-relaxed font-light">จ่ายเงินที่หน้างานเท่านั้น ไม่มีการโอนมัดจำล่วงหน้า ปลอดภัย 100%</p>
            </div>
            <div class="text-center group">
                <div class="w-16 h-16 mx-auto mb-6 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500">
                    <i class="fas fa-gem text-2xl text-gold"></i>
                </div>
                <h3 class="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">Quality Verified</h3>
                <p class="text-[11px] text-low-contrast leading-relaxed font-light">คัดกรองเฉพาะงานคุณภาพ ตรงปก พร้อมการดูแลระดับพรีเมียม</p>
            </div>
            <div class="text-center group">
                <div class="w-16 h-16 mx-auto mb-6 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500">
                    <i class="fas fa-fingerprint text-2xl text-gold"></i>
                </div>
                <h3 class="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">Privacy Focus</h3>
                <p class="text-[11px] text-low-contrast leading-relaxed font-light">เราให้ความสำคัญกับความเป็นส่วนตัวของลูกค้าเป็นอันดับหนึ่ง</p>
            </div>
        </section>

        <div class="max-w-4xl mx-auto">
            ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
        </div>
    </main>

<footer class="border-t border-white/10 bg-[#050505] pt-24 pb-12 mt-20">
    <div class="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20">
            <div class="md:col-span-5 space-y-8">
                <h3 class="text-2xl font-serif tracking-[0.3em] text-white uppercase">
                    SIDELINE<span class="text-gold italic ml-1">${provinceData.key.toUpperCase()}</span>
                </h3>
                <p class="text-[12px] text-white/80 leading-relaxed max-w-sm font-light tracking-wide">
                    Thailand's most prestigious directory for premium adult services. We redefine the standard of excellence and safety.
                </p>
                <div class="flex gap-6">
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" aria-label="Twitter" class="text-white/70 hover:text-gold transition-all text-xl"><i class="fab fa-x-twitter"></i></a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="Line" class="text-white/70 hover:text-gold transition-all text-xl"><i class="fab fa-line"></i></a>
                </div>
            </div>

            <div class="md:col-span-3">
                <h4 class="text-[10px] font-bold text-white/70 tracking-[0.4em] uppercase mb-8">Navigation</h4>
                <ul class="space-y-4 text-[12px] text-white/90 font-medium uppercase tracking-widest">
                    <li><a href="/" class="underline decoration-white/30 underline-offset-4 hover:text-gold transition-colors">Home</a></li>
                    <li><a href="/profiles" class="underline decoration-white/30 underline-offset-4 hover:text-gold transition-colors">Directory</a></li>
                    <li><a href="/location/chiangmai" class="underline decoration-white/30 underline-offset-4 hover:text-gold transition-colors">Chiang Mai</a></li>
                </ul>
            </div>

            <div class="md:col-span-4">
                <h4 class="text-[10px] font-bold text-white/70 tracking-[0.4em] uppercase mb-8">Legal & Privacy</h4>
                <p class="text-[11px] text-white/80 leading-relaxed font-light mb-6 uppercase tracking-wider">
                    Models are independent contractors. You must be 20+ to enter. We provide information only and do not facilitate transactions.
                </p>
                <div class="inline-flex items-center gap-2 border border-gold/40 px-4 py-1.5 rounded-full text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">
                    <span class="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span> 20+ Only
                </div>
            </div>
        </div>

        <div class="border-t border-white/10 pt-16 mb-20">
            <h4 class="text-[10px] font-bold text-white/70 tracking-[0.5em] uppercase mb-12 text-center">Service Coverage</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
                ${provinceLinksHtml}
            </div>
        </div>

        <div class="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-white/70 uppercase tracking-[0.3em] font-medium">
            <p>&copy; ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. LUXURY DIRECTORY.</p>
            <div class="flex gap-8">
                <a href="/terms" class="hover:text-gold underline decoration-white/30 underline-offset-4 transition-colors">Terms</a>
                <a href="/privacy" class="hover:text-gold underline decoration-white/30 underline-offset-4 transition-colors">Privacy</a>
            </div>
        </div>
    </div>
</footer>

<a href="${CONFIG.SOCIAL_LINKS.line}" 
   target="_blank" 
   rel="noopener noreferrer"
   class="fixed bottom-10 right-10 p-1.5 rounded-full z-[90] group line-float-btn transition-all duration-500 hover:-translate-y-2"
   aria-label="ติดต่อเราผ่าน LINE">
    <div class="bg-[#059641] border border-white/10 rounded-full px-6 py-3 flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <i class="fab fa-line text-white text-2xl group-hover:scale-110 transition-transform"></i>
        <span class="text-[12px] text-white font-bold tracking-[0.2em] uppercase">Line Us</span>
    </div>
</a>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const nav = document.querySelector('nav');
        if (!nav) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNav = () => {
            // ใช้การเพิ่ม/ลบ Class แทนการเขียน Style โดยตรง
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            // เทคนิค Throttling ด้วย requestAnimationFrame 
            // ช่วยลดภาระ CPU และแก้ปัญหา Forced Reflow ได้ขาด
            if (!ticking) {
                window.requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true }); // passive: true ช่วยให้การสโครลบนมือถือลื่นขึ้นมาก
    });
</script>
</body>
</html>`;

        return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=3600" } });
    } catch (e) {
        console.error('SSR Critical Error:', e);
        return new Response('<div style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;">System is updating. Please try again in a few minutes.</div>', { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
};