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
// 3. MAIN SSR EDGE FUNCTION
// ==========================================
export default async (request, context) => {
    try {
        const url = new URL(request.url);

        // 🟢 ส่วนที่แก้ไข: ตรวจสอบและ Redirect หากมี Query String ?province=
        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province");
            // สร้าง URL ใหม่ให้เป็นแบบ /location/lampang
            const cleanUrl = new URL(`/location/${provinceValue}`, url.origin);
            return Response.redirect(cleanUrl.toString(), 301); 
        }

        const pathParts = url.pathname.split('/').filter(Boolean);
        const rawProvinceKey = pathParts[pathParts.length - 1] || 'chiangmai';
        const provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // ดึงข้อมูลจังหวัด
        const { data: provinceData, error: provError } = await supabase
            .from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle();

        // ถ้าไม่พบข้อมูลจังหวัด ให้ไปที่ขั้นตอนถัดไป (เช่นแสดงหน้า 404 หรือหน้า Default)
        if (!provinceData || provError) return context.next();

        // ดึงข้อมูลโปรไฟล์น้องๆ
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, created_at, active, availability, likes')
            .eq('provinceKey', provinceData.key).eq('active', true)
            .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false })
            .limit(80);

        const safeProfiles = profiles || [];
        const provinceName = provinceData.nameThai;
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
        const zones = seoData.zones;
        
        const now = new Date();
        const CURRENT_YEAR = now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric' });
        const CURRENT_MONTH = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', month: 'long' });
        
        // กำหนด URL หลักที่เป็น Clean URL เสมอ
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
            : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        const title = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ไม่มัดจำ`;
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} ตัวท็อป ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก 100% ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด จ่ายหน้างาน`;

        const deterministicRating = safeProfiles.length > 0 ? (4.6 + (safeProfiles.length % 4) / 10).toFixed(1) : "5.0";
        const deterministicReviews = safeProfiles.length > 0 ? String(safeProfiles.length * 12 + 154) : "154";

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
                <article itemscope itemtype="http://schema.org/Person" class="group relative bg-[#0d0d0d] rounded-[1.25rem] overflow-hidden border border-white/5 flex flex-col h-full transition-all duration-500 hover:border-gold/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]" data-profile-id="${p.id}">
                    <a href="${profileLink}" itemprop="url" class="absolute inset-0 z-40" aria-label="ดูโปรไฟล์ ${cleanName}" title="ดูโปรไฟล์ ${cleanName}"></a>
                    
                    <div class="relative w-full pt-[135%] bg-[#050505] overflow-hidden">
                        <img itemprop="image" 
                             src="${optimizeImg(p.imagePath, 450, 600)}" 
                             alt="${imgAlt}" 
                             class="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-[1.01] group-hover:scale-110 group-hover:rotate-1" 
                             ${i < 4 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} 
                             width="450" height="600">
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/30 z-10"></div>
                        
                        <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
                            <div class="flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 shadow-2xl">
                                <span class="relative flex h-1.5 w-1.5">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-500'} opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-1.5 w-1.5 ${isAvailable ? 'bg-emerald-400' : 'bg-rose-500'}"></span>
                                </span>
                                <span class="text-[9px] text-white font-bold tracking-widest uppercase">${statusText}</span>
                            </div>
                            
                            <div class="bg-black/40 backdrop-blur-xl p-2 rounded-full border border-gold/30 shadow-2xl">
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
                                    <span class="text-[9px] text-gold font-bold tracking-[0.2em] uppercase mb-1 opacity-80">${targetKeyword}</span>
                                    <h3 itemprop="name" class="font-serif font-medium text-2xl text-white group-hover:text-gold transition-colors line-clamp-1 tracking-wide">
                                        ${cleanName}
                                    </h3>
                                </div>
                                <div class="bg-white/[0.03] backdrop-blur-md px-2 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5 mb-1">
                                    <i class="fas fa-star text-gold text-[10px]"></i>
                                    <span class="text-white text-[11px] font-bold tracking-tighter">${cardRating}</span>
                                </div>
                            </div>

                            <div class="space-y-2 mb-5 border-t border-white/5 pt-4">
                                <div itemprop="homeLocation" class="text-[11px] text-white/50 font-light flex items-center gap-3">
                                    <i class="fas fa-map-marker-alt text-gold/60 w-3 text-center"></i>
                                    <span class="truncate tracking-wide">${profileLocation}</span>
                                </div>
                                <div class="text-[11px] text-white/30 font-light flex items-center gap-3">
                                    <i class="far fa-calendar-alt w-3 text-center"></i>
                                    <span>อัปเดตข้อมูลล่าสุดเมื่อ ${dateDisplay}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between pt-1 group/btn">
                            <div class="flex flex-col">
                                <span class="text-[8px] text-white/30 uppercase tracking-[0.2em]">Starting at</span>
                                <span class="text-sm font-bold text-white tracking-tight">฿${p.rate || 'สอบถาม'}</span>
                            </div>
                            <div class="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:border-gold group-hover:text-gold transition-all duration-500 group-hover:translate-x-1">
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
    <meta name="geo.position" content="18.7883;98.9853" />
    <meta name="ICBM" content="18.7883, 98.9853" />

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
    <meta name="twitter:site" content="${CONFIG.TWITTER}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${firstImage}">

    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://zxetzqwjaiumqhrpumln.supabase.co" crossorigin>
    <link rel="dns-prefetch" href="https://zxetzqwjaiumqhrpumln.supabase.co">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Prompt:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

    <link rel="modulepreload" href="/main.js">
    <link rel="preload" href="${firstImage}" as="image" fetchpriority="high">

    <script type="application/ld+json">
        ${JSON.stringify(schemaData)}
    </script>

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { 
            theme: { 
                extend: { 
                    colors: { 
                        gold: { DEFAULT: '#C5A059', hover: '#D4AF37' }
                    }, 
                    fontFamily: { 
                        serif: ['"Playfair Display"', 'serif'], 
                        sans: ['Outfit', 'Prompt', 'sans-serif'] 
                    }
                } 
            } 
        };
    </script>

    <style>
        body { 
            background-color: #070707; 
            color: #e5e5e5; 
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
        }
        .nav-glass {
            background: rgba(7, 7, 7, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }
        .hero-glow {
            background: radial-gradient(circle at 50% 0%, rgba(197, 160, 89, 0.08) 0%, rgba(7, 7, 7, 0) 60%);
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #070707; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #C5A059; }
    </style>
</head>

<body class="selection:bg-gold/30 selection:text-white">
    <nav class="fixed top-0 w-full z-[100] nav-glass transition-all duration-300 py-4">
        <div class="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-[1400px]">
            <a href="/" class="text-xl md:text-2xl font-serif tracking-[0.2em] text-white hover:text-gold transition-colors">
                SIDELINE<span class="text-gold italic ml-1">CM</span>
            </a>
            <div class="hidden md:flex items-center gap-10 text-[10px] font-medium tracking-[0.25em] uppercase text-white/60">
                <a href="/" class="hover:text-white transition-colors">Home</a>
                <a href="/profiles" class="hover:text-white transition-colors">Directory</a>
                <span class="text-gold border-b border-gold pb-1">${provinceName}</span>
            </div>
        </div>
    </nav>

    <header class="relative pt-40 pb-20 px-6 hero-glow flex flex-col items-center justify-center text-center">
        <div class="max-w-4xl mx-auto space-y-8">
            <div class="inline-block px-4 py-1.5 border border-gold/20 rounded-full text-[9px] font-medium tracking-[0.3em] uppercase text-gold mb-4">
                Exclusive Directory • ${CURRENT_MONTH}
            </div>
            
            <h1 class="font-serif text-4xl md:text-5xl lg:text-7xl leading-tight text-white/95">
                <span class="block font-light">รับงานไซด์ไลน์${provinceName}</span>
                <span class="block text-2xl md:text-4xl mt-4 font-sans font-light tracking-wider text-white/60">คัดเกรดพรีเมียม ไม่โอนมัดจำ</span>
            </h1>
            
            <div class="flex flex-wrap justify-center gap-3 pt-8">
                ${zones.slice(0, 5).map(z => `<a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" class="text-[10px] px-5 py-2 rounded-full border border-white/10 font-medium tracking-wide hover:border-gold hover:text-gold text-white/50 transition-all duration-300">#${z}</a>`).join('')}
            </div>
        </div>
    </header>

    <main class="container mx-auto px-6 lg:px-12 max-w-[1400px] pb-32">
        <div class="flex items-end justify-between mb-10 border-b border-white/5 pb-4">
            <h2 class="text-xl md:text-2xl font-serif text-white tracking-wide">
                Selected <span class="text-gold italic">Profiles</span>
            </h2>
            <span class="text-[10px] text-white/40 tracking-widest uppercase">${safeProfiles.length} Models</span>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-24">
            ${cardsHTML}
        </div>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-32 max-w-5xl mx-auto px-4">
            <div class="text-center space-y-4">
                <i class="fas fa-shield-alt text-2xl text-gold/80"></i>
                <h3 class="text-sm font-medium tracking-widest uppercase text-white/90">No Deposit</h3>
                <p class="text-xs text-white/40 leading-relaxed font-light">ไม่มีการโอนมัดจำล่วงหน้า จ่ายเงินสดหน้างานเพื่อความสบายใจสูงสุด</p>
            </div>
            <div class="text-center space-y-4">
                <i class="fas fa-gem text-2xl text-gold/80"></i>
                <h3 class="text-sm font-medium tracking-widest uppercase text-white/90">Verified Quality</h3>
                <p class="text-xs text-white/40 leading-relaxed font-light">โปรไฟล์ผ่านการคัดสรร ยืนยันตัวตนว่าตรงปกและพร้อมดูแลระดับ VIP</p>
            </div>
            <div class="text-center space-y-4">
                <i class="fas fa-lock text-2xl text-gold/80"></i>
                <h3 class="text-sm font-medium tracking-widest uppercase text-white/90">Absolute Privacy</h3>
                <p class="text-xs text-white/40 leading-relaxed font-light">ข้อมูลของลูกค้าจะถูกเก็บเป็นความลับสูงสุด ปลอดภัย 100%</p>
            </div>
        </section>

        <div class="max-w-4xl mx-auto">
            ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
        </div>
    </main>

    <footer class="border-t border-white/5 bg-[#050505] pt-20 pb-10">
        <div class="container mx-auto px-6 lg:px-12 max-w-[1400px]">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                
                <div class="md:col-span-5 space-y-6">
                    <h3 class="text-2xl font-serif tracking-[0.2em] text-white">
                        SIDELINE<span class="text-gold italic ml-1">CM</span>
                    </h3>
                    <p class="text-xs text-white/40 leading-relaxed max-w-sm font-light">
                        The ultimate directory for premium escort services in ${provinceName}. 
                        Curated selections for exclusive experiences.
                    </p>
                    <div class="flex gap-4 pt-4">
                        <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" class="text-white/30 hover:text-gold transition-colors text-lg"><i class="fab fa-x-twitter"></i></a>
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="text-white/30 hover:text-gold transition-colors text-lg"><i class="fab fa-line"></i></a>
                    </div>
                </div>

                <div class="md:col-span-3">
                    <h4 class="text-[9px] font-semibold text-white/30 tracking-[0.3em] uppercase mb-6">Explore</h4>
                    <ul class="space-y-4 text-xs text-white/60 font-light">
                        <li><a href="/" class="hover:text-gold transition-colors">Home</a></li>
                        <li><a href="/profiles" class="hover:text-gold transition-colors">Directory</a></li>
                        <li><a href="/location/chiangmai" class="hover:text-gold transition-colors">Chiang Mai</a></li>
                    </ul>
                </div>

                <div class="md:col-span-4">
                    <h4 class="text-[9px] font-semibold text-white/30 tracking-[0.3em] uppercase mb-6">Disclaimer</h4>
                    <p class="text-[10px] text-white/30 leading-relaxed font-light mb-4">
                        This site contains adult material. All models depicted are 20 years of age or older. 
                        We do not act as an agency; we simply provide a high-end directory platform.
                    </p>
                    <span class="inline-block border border-white/10 px-3 py-1 rounded text-[9px] text-white/50 uppercase tracking-widest">
                        20+ Only
                    </span>
                </div>
            </div>

            <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-white/30 uppercase tracking-widest">
                <p>&copy; ${CURRENT_YEAR} SIDELINE CHIANGMAI. ALL RIGHTS RESERVED.</p>
                <div class="flex gap-6">
                    <span>Premium Directory</span>
                    <span>Secure Platform</span>
                </div>
            </div>
        </div>
    </footer>

    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="fixed bottom-8 right-8 bg-[#0a0a0a] border border-white/10 hover:border-[#06c755] px-6 py-3.5 rounded-full flex items-center gap-3 text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 z-[90] group">
        <i class="fab fa-line text-[#06c755] text-xl group-hover:scale-110 transition-transform"></i>
        <span class="text-xs font-medium tracking-wider uppercase">Contact Us</span>
    </a>

    <script>
        // Scroll effect for navbar (Minimalist transition)
        document.addEventListener('DOMContentLoaded', () => {
            const nav = document.querySelector('nav');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) { 
                    nav.style.background = 'rgba(7, 7, 7, 0.95)';
                    nav.style.padding = '0.75rem 0';
                } else { 
                    nav.style.background = 'rgba(7, 7, 7, 0.7)';
                    nav.style.padding = '1rem 0';
                }
            }, { passive: true });
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