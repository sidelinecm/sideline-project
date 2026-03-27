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

const PROVINCE_SEO_DATA = {
    'chiangmai': {
        zones:['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'คูเมือง', 'หลังมอ'],
        lsi:['สาวเหนือ', 'นักศึกษา มช.', 'ตัวท็อปเชียงใหม่', 'เด็กเอ็นเชียงใหม่', 'ไซด์ไลน์เชียงใหม่', 'คนเมือง', 'ฟิวแฟนเชียงใหม่', 'รับงานเมืองเชียงใหม่'],
        hotels:['โรงแรมแถวนิมมาน', 'ที่พักใกล้คูเมือง', 'คอนโดเจ็ดยอด', 'รีสอร์ทแม่ริม'],
        services:['รับงานชั่วคราว-ค้างคืน', 'ดูแลฟิวแฟนเดินนิมมาน', 'ปาร์ตี้พูลวิลล่าเชียงใหม่', 'นวดผ่อนคลายส่วนตัว'],
        faqs:[
            { q: "หาไซด์ไลน์เชียงใหม่ โซนไหนเดินทางสะดวกสุด?", a: "โซนนิมมาน สันติธรรม และเจ็ดยอด เป็นโซนที่น้องๆ รับงานเยอะที่สุด และมีโรงแรมรองรับมากมาย เดินทางง่ายด้วยรถแดงหรือ Grab" },
            { q: "น้องๆ รับงานเชียงใหม่ มีโปรไฟล์แบบไหนบ้าง?", a: "เรามีตั้งแต่น้องนักศึกษา มช., แม่โจ้, ราชภัฏ ไปจนถึงพริตตี้สาวเหนือผิวขาวออร่า การันตีตรงปกทุกคน" }
        ]
    },
    'bangkok': {
        zones:['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย', 'ปิ่นเกล้า'],
        lsi:['พริตตี้ กทม.', 'นางแบบสาว', 'ตัวท็อปกรุงเทพ', 'เด็กเอ็น', 'ฟิวแฟนคลุกวงใน', 'รับงานกรุงเทพ', 'ไซด์ไลน์ กทม'],
        hotels:['คอนโดติด BTS', 'โรงแรมย่านสุขุมวิท', 'ที่พักห้วยขวาง', 'ม่านรูดพรีเมียม'],
        services:['ดูแลแบบฟิวแฟนเต็มรูปแบบ', 'เพื่อนเที่ยวกลางคืนทองหล่อ', 'รับงาน N-Vip', 'เพื่อนทานข้าว'],
        faqs:[
            { q: "เด็กเอ็นกรุงเทพ ส่วนใหญ่รับงานโซนไหน?", a: "โซนยอดฮิตคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ ซึ่งลูกค้าสามารถนัดหมายตามคอนโดติด BTS/MRT หรือโรงแรมที่สะดวกได้เลย" },
            { q: "ความปลอดภัยในการเรียกไซด์ไลน์ กทม.?", a: "เว็บของเราเน้นระบบ 'ไม่โอนมัดจำ' ลูกค้าเจอตัวน้อง จ่ายเงินหน้างานเท่านั้น ป้องกันมิจฉาชีพ 100%" }
        ]
    },
    'default': {
        zones:['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู', 'หมู่บ้าน'],
        lsi:['นักศึกษา', 'พริตตี้พาร์ทไทม์', 'หุ่นนางแบบ', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน', 'คนสวย'],
        hotels: ['โรงแรมในตัวเมือง', 'รีสอร์ทส่วนตัว', 'ที่พักของลูกค้า'],
        services:['ฟิวแฟนส่วนตัว', 'เพื่อนเที่ยว-ดูหนัง', 'นวดผ่อนคลาย', 'รับงาน N'],
        faqs:[
            { q: "ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าสามารถเลือกน้องที่ถูกใจ นัดสถานที่ และจ่ายเงินสดหน้างานได้เลย" },
            { q: "รับประกันความตรงปกไหม?", a: "รูปโปรไฟล์ทุกรูปผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปก 100%" }
        ]
    }
};

const optimizeImg = (path, width = 400, height = 533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) {
            const transform = `f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face`;
            return path.replace('/upload/', `/upload/${transform}/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=80`;
};

const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    
    const hotel1 = data.hotels?.[0] || 'โรงแรมชั้นนำ';
    const hotel2 = data.hotels?.[1] || 'ที่พักใกล้เคียง';
    const zone3 = data.zones?.slice(0,3).join(', ') || 'ตัวเมือง';
    const allZones = data.zones?.join(', ') || 'ทุกพื้นที่';
    
    if (count === 0) {
        return `<div class="seo-content text-left bg-white/5 p-8 rounded-3xl border border-white/10">
            <h2 class="text-2xl font-bold text-gold mb-4">เตรียมพบกับ ${data.lsi[0]} รับงาน${provinceName} เร็วๆ นี้</h2>
            <p>เรากำลังคัดสรร <strong>${data.lsi[1]}</strong> และ <strong>${data.lsi[2]}</strong> ระดับพรีเมียม เพื่อให้บริการที่ดีที่สุด แอดไลน์สอบถามคิวหลุดได้เลยครับ</p>
        </div>`;
    }

    return `
    <article class="seo-content text-left space-y-8 text-white/80 leading-relaxed font-light">
        <section>
            <h2 class="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                แหล่งรวม <span class="text-gold">ไซด์ไลน์${provinceName}</span> และ ${data.lsi[0]} ที่ดีที่สุด
            </h2>
            <p class="mb-4">
                หากคุณกำลังมองหาประสบการณ์การพักผ่อนระดับพรีเมียม <strong>รับงาน${provinceName}</strong> คือคำตอบที่คุณตามหา! เราได้รวบรวมน้องๆ <strong>${data.lsi[1]}</strong> และ <strong>${data.lsi[2]}</strong> มากกว่า ${count} โปรไฟล์ ที่ผ่านการคัดกรองมาอย่างดี การันตีความตรงปก 100% ไม่ว่าคุณจะอยู่โซน <strong>${zone3}</strong> ก็สามารถเรียกใช้บริการได้อย่างรวดเร็ว
            </p>
            <p>
                เน้นย้ำนโยบาย <strong>"จ่ายหน้างาน ไม่ต้องโอนมัดจำ"</strong> ปลอดภัยไร้ความเสี่ยง นัดหมายได้ง่ายตาม <strong>${hotel1}</strong> หรือที่พักส่วนตัวของคุณ
            </p>
        </section>

        <section class="bg-[#0a0a0a] p-6 md:p-8 rounded-3xl border border-white/5 shadow-inner">
            <h3 class="text-xl font-bold text-gold mb-4"><i class="fas fa-gem mr-2"></i> รูปแบบบริการของเด็กเอ็น${provinceName}</h3>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                ${data.services.map(srv => `
                    <li class="flex items-start gap-2">
                        <i class="fas fa-check-circle text-green-500 mt-1 shrink-0"></i>
                        <span><strong>${srv}:</strong> บริการมืออาชีพ เป็นกันเอง รักษาความลับลูกค้า</span>
                    </li>
                `).join('')}
            </ul>
        </section>

        <section>
            <h3 class="text-xl font-bold text-white mb-4 border-l-4 border-gold pl-4">พิกัดและโซนให้บริการ (Coverage Areas)</h3>
            <p class="mb-4">
                น้องๆ <strong>ไซด์ไลน์${provinceName}</strong> เดินทางไปดูแลคุณได้ครอบคลุมพื้นที่ <strong>${allZones}</strong> ไม่ว่าคุณจะพักอยู่ที่ <strong>${hotel2}</strong> หรือคอนโดส่วนตัว
            </p>
        </section>

        <section class="mt-10 border-t border-white/10 pt-8">
            <h2 class="text-2xl font-bold text-white mb-6">คำถามที่พบบ่อย (FAQ) รับงาน${provinceName}</h2>
            <div class="space-y-4">
                ${data.faqs.map(faq => `
                    <div class="bg-black/40 p-5 rounded-2xl border border-white/5">
                        <h3 class="text-base md:text-lg font-bold text-gold-bright mb-2">Q: ${faq.q}</h3>
                        <p class="text-white/70 text-sm md:text-base">A: ${faq.a}</p>
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
        const pathParts = url.pathname.split('/').filter(Boolean);
        const rawProvinceKey = pathParts[pathParts.length - 1] || 'chiangmai';
        const provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        const { data: provinceData, error: provError } = await supabase
            .from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle();

        if (!provinceData || provError) return context.next();

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, created_at, active, availability, likes')
            .eq('provinceKey', provinceData.key).eq('active', true)
            .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false })
            .limit(80);

        const safeProfiles = profiles ||[];
        const provinceName = provinceData.nameThai;
        
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
        const zones = seoData.zones;
        
        const now = new Date();
        const CURRENT_YEAR = now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric' });
        const CURRENT_MONTH = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', month: 'long' });
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
            : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        const title = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ไม่มัดจำ`;
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} ตัวท็อป ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก 100% ✓น้องนักศึกษา ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด จ่ายหน้างาน`;

        const deterministicRating = safeProfiles.length > 0 ? (4.6 + (safeProfiles.length % 4) / 10).toFixed(1) : "5.0";
        const deterministicReviews = safeProfiles.length > 0 ? String(safeProfiles.length * 12 + 154) : "154";

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
                    "@type":["LocalBusiness", "EntertainmentBusiness"],
                    "@id": `${provinceUrl}/#business`,
                    "name": `รับงาน${provinceName} - ไซด์ไลน์พรีเมียม`,
                    "url": provinceUrl,
                    "image": firstImage,
                    "description": description,
                    "telephone": "ติดต่อผ่าน Line Official",
                    "priceRange": "฿1500 - ฿5000",
                    "areaServed": {
                        "@type": "State",
                        "name": provinceName
                    },
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
                    "about": { "@id": `${provinceUrl}/#business` }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement":[
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `รวมโปรไฟล์ทั้งหมด`, "item": `${CONFIG.DOMAIN}/profiles` },
                        { "@type": "ListItem", "position": 3, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                }
            ]
        };

        // ==========================================
        // 5. HTML GENERATION - PREMIUM CARDS (UI/UX Fixed)
        // ==========================================
        let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                const cleanName = (p.name || 'สาวสวย').replace(/^(น้อง\s?)/, '');
                const profileLocation = p.location || provinceName || 'ไม่ระบุพิกัด';
                const cardRating = (4.5 + (i % 5) / 10).toFixed(1); 
                
                // FIX 1: แก้ไขตรรกะเช็คสถานะ "ติดจอง" ให้ทำงานถูกต้อง
                const busyKeywords = ['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'];
                let isAvailable = true;
                if (p.availability) {
                    const availText = p.availability.toLowerCase();
                    // ถ้าในข้อความมีคำว่า ติดจอง, ไม่ว่าง ฯลฯ ค่อยเปลี่ยนเป็น false
                    isAvailable = !busyKeywords.some(kw => availText.includes(kw));
                }
                const statusText = isAvailable ? 'พร้อมรับงาน' : 'ติดจอง';
                
                const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
                const d = new Date(dateStr);
                const day = d.getDate();
                const months =['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
                const month = months[d.getMonth()];
                const year = (d.getFullYear() + 543).toString().slice(-2);
                
                const seoKeywords =[
                    `ไซด์ไลน์${provinceName}`,
                    `รับงาน${provinceName}`,
                    `เด็กเอ็น${provinceName}`,
                    `ฟิวแฟน${provinceName}`,
                    `พริตตี้${provinceName}`
                ];
                const targetKeyword = seoKeywords[i % seoKeywords.length];
                
                const imgAlt = `น้อง${cleanName} ${targetKeyword} พิกัด ${profileLocation} - รูปตรงปก ไม่โอนมัดจำ`;
                const linkTitle = `ดูโปรไฟล์ น้อง${cleanName} ${targetKeyword} รับงานโซน ${profileLocation}`;

                const isEager = i < 4; 
                const imgWidth = 400;
                const imgHeight = 533;
                const loadingAttr = isEager 
                    ? `loading="eager" fetchpriority="high" decoding="sync"` 
                    : `loading="lazy" decoding="async"`;
                
                const profileLink = `/sideline/${p.slug || p.id || '#'}`;
                
                return `
                <article itemscope itemtype="http://schema.org/Person" class="group relative bg-[#0f0f0f] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-500 shadow-2xl hover:-translate-y-2 flex flex-col h-full css-content-visibility" data-profile-id="${p.id}">
                    
                    <a href="${profileLink}" itemprop="url" class="absolute inset-0 z-30" aria-label="${linkTitle}" title="${linkTitle}"></a>
                    
                    <div class="relative w-full pt-[133.33%] bg-[#111] overflow-hidden">
                        <img itemprop="image"
                             src="${optimizeImg(p.imagePath || '/default-avatar.jpg', imgWidth, imgHeight)}" 
                             alt="${imgAlt}" 
                             title="${imgAlt}"
                             class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-80"
                             ${loadingAttr}
                             width="${imgWidth}" height="${imgHeight}">
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none"></div>
                        
                        <!-- ปรับปรุงขนาดป้ายให้เล็กลงในมือถือ ป้องกันการทับซ้อน -->
                        <div class="absolute top-3 left-0 w-full px-2 md:px-3 flex justify-between items-start z-20 pointer-events-none">
                            <div class="bg-black/80 backdrop-blur-md border border-white/10 text-white text-[8px] md:text-[10px] px-2 py-1 md:px-2.5 md:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 shadow-lg pointer-events-auto">
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-400'} opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
                                </span>
                                <span class="font-bold tracking-wide">${statusText}</span>
                            </div>

                            <div class="bg-gradient-to-r from-[#1d4ed8]/95 to-[#3b82f6]/95 backdrop-blur-md border border-blue-400/30 text-white text-[8px] md:text-[9px] font-bold px-1.5 py-1 md:px-2 md:py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-blue-500/30 pointer-events-auto">
                                <i class="fas fa-check-circle text-white/90"></i> <span class="hidden sm:inline">ยืนยันแล้ว</span><span class="sm:hidden">ยืนยัน</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-3 md:p-5 flex-1 flex flex-col justify-between relative z-20">
                        <div>
                            <div class="flex justify-between items-start mb-2">
                                <h3 itemprop="name" class="font-bold text-base md:text-xl italic text-white group-hover:text-gold transition-colors line-clamp-1 pr-1">
                                    ${cleanName}
                                </h3>
                                <div class="flex items-center gap-1 text-gold-bright font-black text-[9px] md:text-xs pt-1 shrink-0" aria-label="คะแนน ${cardRating} ดาว">
                                    <i class="fas fa-star text-[8px] md:text-[10px]"></i> ${cardRating}
                                </div>
                            </div>
                            
                            <!-- FIX 2: เปลี่ยน Layout พิกัดและวันที่ เป็น "บน-ล่าง" (แนวตั้ง) ป้องกันการบีบอัด -->
                            <div class="flex flex-col gap-1.5 mb-3 border-b border-white/5 pb-3">
                                <p itemprop="homeLocation" class="text-[10px] text-white/70 font-medium flex items-center gap-1.5 w-full">
                                    <i class="fas fa-location-dot text-gold/60 w-3 text-center"></i> 
                                    <span class="truncate">${profileLocation}</span>
                                </p>
                                <p class="text-[9px] text-white/40 font-light flex items-center gap-1.5 w-full">
                                    <i class="far fa-clock w-3 text-center"></i> 
                                    <span class="truncate">อัปเดต ${day} ${month} ${year}</span>
                                </p>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between pt-1">
                            <div class="text-[8px] md:text-[9px] text-white/30 font-medium uppercase tracking-widest truncate max-w-[80%]">
                                #${targetKeyword}
                            </div>
                            <span class="text-white group-hover:text-gold transition-all translate-x-0 group-hover:translate-x-1 shrink-0">
                                <i class="fas fa-arrow-right-long text-xs md:text-sm"></i>
                            </span>
                        </div>
                    </div>
                </article>`;
            }).join('');
        }

        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#050505">

    <title>${title} | เกรดพรีเมียม ไม่มัดจำ 100%</title>
    <meta name="description" content="${description} หาเด็ก${provinceName} น้องนักศึกษา พริตตี้พาร์ทไทม์ ตรงปก ไม่โอนมัดจำ ปลอดภัยแน่นอน" />
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}, ตรงปก, ไม่มัดจำ" />
    
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${provinceUrl}" />

    ${safeProfiles.length > 0 ? `<link rel="preload" as="image" href="${optimizeImg(safeProfiles[0].imagePath, 400, 533)}">` : ''}

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;700&family=Prompt:wght@300;400;600;700&display=swap">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;700&family=Prompt:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <meta property="og:locale" content="th_TH">
    <meta property="og:type" content="website">
    <meta property="og:title" content="🔥 ${title}">
    <meta property="og:description" content="พิกัดน้องๆ ${provinceName} รับงานเอง ฟิวแฟน ไม่ต้องมัดจำ ปลอดภัย 100% ตรงปกแน่นอน">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">
    <meta name="twitter:card" content="summary_large_image">

    <style id="fouc-prevention">
        html { opacity: 0; visibility: hidden; }
        html.tailwind-ready { opacity: 1; visibility: visible; transition: opacity 0.3s ease-in; }
    </style>

    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <script>
        tailwind.config = { theme: { extend: { colors: { gold: '#d4af37' }, fontFamily: { serif:['Cinzel', 'serif'], sans:['Plus Jakarta Sans', 'Prompt', 'sans-serif'] } } } };
        
        const showPage = () => document.documentElement.classList.add('tailwind-ready');
        setTimeout(showPage, 50); 
        setTimeout(showPage, 1200); 
    </script>
    
    <style>
        :root { --dark: #050505; --gold: #d4af37; --gold-bright: #facc15; }
        body { background: var(--dark); color: #f8f9fa; overflow-x: hidden; }
        .css-content-visibility { content-visibility: auto; contain-intrinsic-size: 400px 533px; }
        .shimmer-gold { 
            background: linear-gradient(135deg, #b38728 0%, #fbf5b7 45%, #d4af37 55%, #aa771c 100%); 
            background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
            animation: shimmer 5s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }
        .glass-ui { background: rgba(15, 15, 15, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
        .hero-gradient { background: radial-gradient(circle at center, rgba(212,175,55,0.08) 0%, rgba(5,5,5,1) 70%); }
    </style>

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
</head>
<body class="antialiased">
    <nav class="fixed top-0 w-full z-[100] transition-all duration-300 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div class="container mx-auto px-4 flex justify-between items-center max-w-7xl">
            <a href="/" class="text-2xl font-serif font-black tracking-widest shimmer-gold">SIDELINE CM</a>
            <div class="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase">
                <a href="/" class="hover:text-gold transition-colors">Home</a>
                <a href="/profiles" class="hover:text-gold transition-colors">Directory</a>
                <span class="text-gold">${provinceName}</span>
            </div>
            <a href="${CONFIG.SOCIAL_LINKS.line}" aria-label="แอดไลน์" class="bg-[#06c755] text-white px-5 py-2.5 rounded-full font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2">
                <i class="fab fa-line text-lg"></i> LINE OA
            </a>
        </div>
    </nav>

    <header class="relative flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 overflow-hidden hero-gradient">
        <div class="relative z-20 max-w-5xl mx-auto space-y-6">
            <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl mt-4">
                <span class="w-2 h-2 bg-gold rounded-full animate-ping"></span>
                VERIFIED PROFILES • ${CURRENT_MONTH}
            </div>

            <h1 class="font-serif font-black text-[clamp(2rem,6vw,4.5rem)] leading-[1.2]">
                <span class="block text-white/90 shimmer-gold">ไซด์ไลน์${provinceName} รับงาน${provinceName}</span>
                <span class="block text-white text-[clamp(1.2rem,3vw,2.5rem)] mt-2 tracking-wide font-sans">คัดเกรดพรีเมียม ไม่โอนมัดจำ</span>
            </h1>

            <div class="flex flex-wrap justify-center gap-3 pt-4">
                ${zones.slice(0, 5).map(z => `
                    <a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" class="text-[10px] px-4 py-2 rounded-full border border-white/10 font-bold uppercase bg-white/5 text-white/70 hover:bg-gold hover:text-black transition-all">
                        #${z}
                    </a>`).join('')}
            </div>
        </div>
    </header>

    <main class="container mx-auto max-w-7xl px-4 relative z-10" id="profiles">
        
        <!-- FIX 3: เพิ่มหัวข้อ (Section Title) ก่อนแสดง Grid รูปภาพ -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 mt-8">
            <div>
                <h2 class="text-xl md:text-3xl font-serif font-bold text-white tracking-wide border-l-4 border-gold pl-3">
                    โปรไฟล์อัปเดตล่าสุด
                </h2>
                <p class="text-white/50 text-[10px] md:text-sm mt-2 pl-4">พบกับน้องๆ ไซด์ไลน์${provinceName} กว่า ${safeProfiles.length} คน พร้อมให้บริการ</p>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 mb-16">
            ${cardsHTML}
        </div>

        <section class="mb-24 glass-ui rounded-[3rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
            <div class="max-w-4xl mx-auto">
                ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
            </div>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            <div class="glass-ui p-8 rounded-3xl border-t border-white/10 text-center">
                <i class="fas fa-shield-halved text-gold text-4xl mb-4 block"></i>
                <h3 class="text-lg font-bold mb-2 italic text-white uppercase tracking-widest">No Deposit</h3>
                <p class="text-white/40 text-sm">ไม่โอนก่อนทุกกรณี ปลอดภัย จ่ายหน้างานเท่านั้น</p>
            </div>
            <div class="glass-ui p-8 rounded-3xl border-t border-white/10 text-center">
                <i class="fas fa-id-card-clip text-gold text-4xl mb-4 block"></i>
                <h3 class="text-lg font-bold mb-2 italic text-white uppercase tracking-widest">Verified</h3>
                <p class="text-white/40 text-sm">ผ่านการคัดโปรไฟล์ รูปตรงปก ไม่มีการหลอกลวง</p>
            </div>
            <div class="glass-ui p-8 rounded-3xl border-t border-white/10 text-center">
                <i class="fas fa-user-secret text-gold text-4xl mb-4 block"></i>
                <h3 class="text-lg font-bold mb-2 italic text-white uppercase tracking-widest">Privacy</h3>
                <p class="text-white/40 text-sm">รักษาความลับลูกค้าสูงสุด ข้อมูลปลอดภัย 100%</p>
            </div>
        </section>
    </main>

    <footer class="bg-[#020202] border-t border-white/5 pt-24 pb-12 text-center md:text-left">
        <div class="container mx-auto max-w-7xl px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div class="md:col-span-2 space-y-6">
                    <h3 class="text-3xl font-serif shimmer-gold font-black italic tracking-widest">SIDELINE CM</h3>
                    <p class="text-white/40 text-sm leading-loose max-w-md font-medium">
                        The Ultimate Directory for Premium Escort Services in ${provinceName}. 
                        Focusing on safety, transparency, and top-tier quality.
                    </p>
                </div>
                <div>
                    <h4 class="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-8">Navigation</h4>
                    <ul class="space-y-4 text-white/50 text-[11px] font-bold uppercase tracking-wider">
                        <li><a href="#" class="hover:text-gold transition-colors italic">Premium Girls</a></li>
                        <li><a href="#" class="hover:text-gold transition-colors italic">Student Life</a></li>
                        <li><a href="#" class="hover:text-gold transition-colors italic">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-8">Legal</h4>
                    <div class="border border-red-500/20 bg-red-500/5 p-4 rounded-xl">
                        <span class="text-[10px] text-red-500 font-black uppercase tracking-widest">
                            🔞 20+ ONLY. PLEASE CONSUME RESPONSIBLY.
                        </span>
                    </div>
                </div>
            </div>
            <div class="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-[9px] text-white/20 font-black tracking-[0.3em] uppercase">&copy; ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. LUXURY DIRECTORY.</p>
                <div class="flex gap-8 text-[9px] text-white/40 font-black tracking-widest uppercase">
                    <span><i class="fas fa-bolt text-gold mr-1"></i> FAST LOAD</span>
                    <span><i class="fas fa-lock text-gold mr-1"></i> SECURE SSL</span>
                </div>
            </div>
        </div>
    </footer>

    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="Line Contact"
       class="fixed bottom-6 right-6 w-16 h-16 bg-[#06c755] rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl hover:scale-110 transition-all z-[99] border-2 border-white/20">
        <i class="fab fa-line"></i>
        <span class="absolute -top-1 -right-1 w-6 h-6 bg-red-600 border-2 border-[#050505] rounded-full animate-bounce flex items-center justify-center text-[10px] font-black shadow-lg">1</span>
    </a>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const nav = document.querySelector('nav');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('bg-[#050505]/95', 'py-3', 'shadow-2xl');
                    nav.classList.remove('bg-[#050505]/80', 'py-4');
                } else {
                    nav.classList.remove('bg-[#050505]/95', 'py-3', 'shadow-2xl');
                    nav.classList.add('bg-[#050505]/80', 'py-4');
                }
            }, { passive: true });
        });
    </script>
</body>
</html>`;

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
        return new Response('<h1>ระบบกำลังอัปเดตชั่วคราว...</h1>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
};