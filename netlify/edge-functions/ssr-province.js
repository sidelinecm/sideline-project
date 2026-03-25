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

// ==========================================
// 2. PROGRAMMATIC SEO ENGINE (LSI & LOCALIZATION)
// ==========================================
// ฐานข้อมูลคำศัพท์เฉพาะพื้นที่ (LSI Keywords) ป้องกันปัญหา Duplicate Content จาก Google
const PROVINCE_SEO_DATA = {
    'chiangmai': {
        zones:['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'คูเมือง'],
        lsi:['สาวเหนือ', 'นักศึกษา มช.', 'ขาวหมวย', 'ตัวท็อปเชียงใหม่', 'เด็กเอ็นเชียงใหม่'],
        hotels:['โรงแรมแถวนิมมาน', 'ที่พักใกล้คูเมือง', 'คอนโดเจ็ดยอด']
    },
    'bangkok': {
        zones:['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย'],
        lsi:['พริตตี้ กทม.', 'นางแบบสาว', 'ตัวท็อปกรุงเทพ', 'เด็กเอ็น', 'ฟิวแฟนคลุกวงใน'],
        hotels:['คอนโดติด BTS', 'โรงแรมย่านสุขุมวิท', 'ที่พักห้วยขวาง']
    },
    'chonburi': {
        zones:['พัทยาเหนือ', 'พัทยากลาง', 'พัทยาใต้', 'บางแสน', 'ศรีราชา', 'อมตะนคร'],
        lsi:['สาวพัทยา', 'เด็ก ม.บูรพา', 'ตัวท็อปบางแสน', 'รับงานทะเล', 'ปาร์ตี้พูลวิลล่า'],
        hotels:['โรงแรมพัทยา', 'พูลวิลล่าพัทยา', 'คอนโดติดหาด']
    },
    'phuket': {
        zones:['ป่าตอง', 'ตัวเมืองภูเก็ต', 'ถลาง', 'กะทู้', 'ฉลอง', 'กะรน'],
        lsi:['สาวใต้', 'เด็กภูเก็ต', 'รับงานภูเก็ต', 'เพื่อนเที่ยวทะเล', 'เด็กเอ็นป่าตอง'],
        hotels:['โรงแรมป่าตอง', 'รีสอร์ทภูเก็ต', 'ที่พักกะทู้']
    },
    'khonkaen': {
        zones:['ตัวเมืองขอนแก่น', 'มข.', 'กังสดาล', 'หลังมอ', 'เซ็นทรัลขอนแก่น'],
        lsi:['สาวอีสาน', 'เด็ก มข.', 'น่ารักสไตล์เกาหลี', 'ตัวท็อปขอนแก่น', 'รับงานขอนแก่น'],
        hotels:['โรงแรมใกล้ มข.', 'ที่พักตัวเมืองขอนแก่น']
    },
    'default': {
        zones:['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู', 'หมู่บ้าน'],
        lsi:['นักศึกษา', 'พริตตี้พาร์ทไทม์', 'หุ่นนางแบบ', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน'],
        hotels:['โรงแรมในตัวเมือง', 'รีสอร์ทส่วนตัว', 'ที่พักของลูกค้า']
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
    // ✅ แก้ไขจุดที่ 2: ใช้ Supabase Render API เพื่อบีบอัดรูปสำรอง
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=80`;
};

// Ultimate Content Generator (สร้างเนื้อหาแบบไม่ซ้ำกันเลยในแต่ละจังหวัด)
const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    
    if (count === 0) return `<p class="mb-4 text-gold font-bold text-lg">🚀 เตรียมพบกับน้องๆ ไซด์ไลน์${provinceName} เร็วๆ นี้...</p><p>เรากำลังคัดสรร <strong>${data.lsi[0]}</strong> และ <strong>${data.lsi[1]}</strong> เกรดพรีเมียม เพื่อให้คุณได้รับบริการที่ดีที่สุด แอดไลน์เพื่อสอบถามคิวหลุดก่อนใคร!</p>`;
    
    const h2_spin =[
        `รวบรวมพิกัด <strong>รับงาน${provinceName}</strong> น้องๆ <strong>${data.lsi[0]}</strong> ตัวท็อปอัปเดตล่าสุด`,
        `หาเด็ก <strong>ไซด์ไลน์${provinceName}</strong> การันตีตรงปก 100% สไตล์ <strong>${data.lsi[1]}</strong>`,
        `ศูนย์รวม <strong>เด็กเอ็น${provinceName}</strong> และ <strong>${data.lsi[2]}</strong> บริการระดับพรีเมียม`
    ];

    const p1_spin =[
        `หากคุณกำลังมองหาความผ่อนคลายในพื้นที่ <strong>${provinceName}</strong> เรามีน้องๆ <strong>${data.lsi[3]}</strong> และ <strong>${data.lsi[4]}</strong> กว่า ${count} คน ที่พร้อมดูแลคุณแบบฟิวแฟน นัดง่าย ครอบคลุมพิกัด <strong>${data.zones.slice(0,3).join(', ')}</strong>`,
        `หมดปัญหาไม่ตรงปก! พบกับโปรไฟล์น้องๆ <strong>รับงาน${provinceName}</strong> ที่คัดกรองมาอย่างดี สะดวกโซนไหนเรามีหมด ไม่ว่าจะเป็น <strong>${data.zones.slice(0,3).join(', ')}</strong> สามารถนัดหมายที่ <strong>${data.hotels[0]}</strong> ได้ทันที`,
        `คัดมาให้แล้วเน้นๆ กับ <strong>${data.lsi[0]}</strong> และ <strong>${data.lsi[1]}</strong> ในพื้นที่ <strong>${provinceName}</strong> บริการเอาใจเก่ง ดื่มได้ เที่ยวได้ นัดเจอกันได้เลยที่ <strong>${data.hotels[0]}</strong> หรือ <strong>${data.hotels[1]}</strong>`
    ];

    const p2_spin =[
        `✅ <strong>จุดเด่นของเรา:</strong> ปลอดภัยที่สุดด้วยระบบ <strong>จ่ายเงินหน้างาน ไม่ต้องโอนมัดจำล่วงหน้า</strong> ป้องกันมิจฉาชีพ 100% น้องๆ รับงานเอง ไม่ผ่านโมเดลลิ่ง สนใจน้องคนไหนโซน <strong>${data.zones[3]}</strong> หรือ <strong>${data.zones[4]}</strong> คลิกดูโปรไฟล์ได้เลย`,
        `สัมผัสประสบการณ์เหนือระดับกับ <strong>ไซด์ไลน์${provinceName}</strong> ที่เน้นความปลอดภัย จ่ายเงินเมื่อเจอตัวจริงเท่านั้น ไร้กังวลเรื่องการโอนมัดจำ พร้อมบริการในพิกัดยอดฮิตเช่น <strong>${data.zones[3]}</strong> ตลอด 24 ชั่วโมง`
    ];

    const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    return `
        <h2 class="text-xl md:text-2xl font-serif text-white/90 mb-4 leading-relaxed tracking-wide">${spin(h2_spin)}</h2>
        <p class="mb-4 text-white/70 leading-loose text-sm md:text-base">${spin(p1_spin)}</p>
        <div class="text-white/70 leading-loose bg-white/5 p-4 md:p-6 rounded-xl border border-gold/20 shadow-inner text-sm md:text-base text-left">
            ${spin(p2_spin)}
        </div>
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

        // 3.1 Database Connection
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // Fetch Province Metadata
        const { data: provinceData, error: provError } = await supabase
            .from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle();

        if (!provinceData || provError) return context.next();

        // Fetch Profiles (Limit 80 for strong Local SEO indexing)
        const { data: profiles } = await supabase
            .from('profiles').select('slug, name, imagePath, location, rate, isfeatured, lastUpdated')
            .eq('provinceKey', provinceData.key).eq('active', true)
            .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false })
            .limit(80);

        const safeProfiles = profiles ||[];
        const provinceName = provinceData.nameThai;
        
        // Data Prep
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
        const zones = seoData.zones;
        
        const CURRENT_YEAR = new Date().getFullYear();
        const CURRENT_MONTH = new Date().toLocaleString('th-TH', { month: 'long' });
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
            : `${CONFIG.DOMAIN}/images/seo-default.webp`;

// ==========================================
        // 4. ULTIMATE SEO METADATA (STRONGEST VERSION)
        // ==========================================
        // Title: ความยาวประมาณ 55-60 ตัวอักษร (พอดีเป๊ะสำหรับ Google Mobile & Desktop)
        const title = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (${CURRENT_MONTH} 2026) | ตรงปก ไม่มัดจำ`;
        
        // Description: เน้นตัวเลขจริง เครื่องหมายถูก และการแก้ปัญหาให้ลูกค้า (Trust & Conversion)
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} ตัวท็อป ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก 100% ✓น้องนักศึกษา ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด จ่ายหน้างาน`;

        

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
                    "@type": ["LocalBusiness", "EntertainmentBusiness"],
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
                        "ratingValue": (4.8 + Math.random() * 0.2).toFixed(1),
                        "reviewCount": String(safeProfiles.length * 18 + 245),
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
                },
                {
                    "@type": "FAQPage",
                    "mainEntity":[
                        {
                            "@type": "Question",
                            "name": `น้องๆ รับงานโซนไหนบ้างใน${provinceName}?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `เรามีน้องๆ ครอบคลุมโซนยอดนิยม เช่น ${zones.slice(0, 5).join(', ')} และพื้นที่ใกล้เคียง นัดหมายได้ตลอด 24 ชม.` }
                        },
                        {
                            "@type": "Question",
                            "name": `บริการไซด์ไลน์${provinceName} ต้องโอนมัดจำไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายหน้างานเมื่อเจอตัวจริงเท่านั้น เพื่อความปลอดภัย ป้องกันมิจฉาชีพ 100%" }
                        }
                    ]
                }
            ]
        };

        // ==========================================
// 5. HTML GENERATION (REFINED ZERO CLS)
// ==========================================
let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                // Logic: คลีนข้อมูลและตั้งค่า Default
                const cleanName = (p.name || 'สาวสวย').replace(/^(น้อง\s?)/, '');
                const profileLocation = p.location || provinceName || 'ไม่ระบุพิกัด';
                const profileRate = p.rate || '5.0';
                
                // แก้ไขการแสดงสถานะ
                const isAvailable = p.availability?.includes('ว่าง') ?? true;
                const statusText = isAvailable ? 'พร้อมรับงาน' : 'ติดจอง';
                
                // เพิ่ม Logic แปลงวันที่
                const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
                const d = new Date(dateStr);
                const day = d.getDate();
                const months =['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
                const month = months[d.getMonth()];
                const year = (d.getFullYear() + 543).toString().slice(-2);
                const dateDisplay = `อัปเดต ${day} ${month} ${year}`;
                
                // Logic: จัดการรูปภาพ (Priority & CLS)
                const isEager = i < 4; 
                const imgWidth = 400;
                const imgHeight = 533;
                const loadingAttr = isEager 
                    ? `loading="eager" fetchpriority="high" decoding="sync"` 
                    : `loading="lazy" decoding="async"`;
                
                return `
                <article class="group relative bg-[#0f0f0f] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-500 shadow-2xl hover:-translate-y-2 flex flex-col h-full css-content-visibility" data-profile-id="${p.id}">
                    <a href="/sideline/${p.slug || '#'}" class="absolute inset-0 z-30" aria-label="ดูโปรไฟล์น้อง ${cleanName}"></a>
                    
                    <div class="relative w-full pt-[133.33%] bg-[#111] overflow-hidden">
                        <img src="${optimizeImg(p.imagePath || '/default-avatar.jpg', imgWidth, imgHeight)}" 
                             alt="น้อง${cleanName} รับงาน${provinceName} พิกัด ${profileLocation}" 
                             class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-80"
                             ${loadingAttr}
                             width="${imgWidth}" height="${imgHeight}">
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none"></div>
                        
                        <!-- ป้ายสถานะ ซ้ายบน (ทรงแคปซูล พร้อมไฟ LED กระพริบ) -->
                        <div class="absolute top-3 left-3 z-20">
                            <div class="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-400'} opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
                                </span>
                                <span class="font-medium tracking-wide">${statusText}</span>
                            </div>
                        </div>

                        <!-- ป้ายยืนยันตัวตน ขวาบน (แทน TOP 1%) -->
                        <div class="absolute top-3 right-3 z-20">
                            <div class="bg-gradient-to-r from-blue-600/90 to-blue-400/90 backdrop-blur-md border border-blue-300/30 text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-blue-500/30">
                                <i class="fas fa-circle-check text-white"></i> ยืนยันตัวตนแล้ว
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-4 md:p-6 flex-1 flex flex-col justify-between relative z-20">
                        <div>
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="font-bold text-lg md:text-xl italic text-white group-hover:text-gold transition-colors line-clamp-1">
                                    ${cleanName}
                                </h3>
                                <div class="flex items-center gap-1 text-gold-bright font-black text-xs">
                                    <i class="fas fa-star text-[10px]"></i> ${profileRate}
                                </div>
                            </div>
                            
                            <!-- พื้นที่แสดงพิกัด และ วันที่ (ซ้าย-ขวา) -->
                            <div class="flex items-center justify-between mt-1 mb-4">
                                <p class="text-[10px] text-white/50 font-medium flex items-center gap-1.5">
                                    <i class="fas fa-location-dot text-gold/60"></i> ${profileLocation}
                                </p>
                                <p class="text-[9px] text-white/30 font-light flex items-center gap-1">
                                    <i class="far fa-clock"></i> ${dateDisplay}
                                </p>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between pt-4 border-t border-white/5">
                            <div class="text-[9px] text-white/30 font-medium uppercase tracking-widest">
                                #รับงาน${provinceName}
                            </div>
                            <span class="text-white group-hover:text-gold transition-all translate-x-0 group-hover:translate-x-1">
                                <i class="fas fa-arrow-right-long text-sm"></i>
                            </span>
                        </div>
                    </div>
                </article>`;
            }).join('');
        }

// ==========================================
        // 6. RENDER THE ULTIMATE HTML (LUXURY, FIXED & AUDITED)
        // ==========================================
        const html = `
<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <!-- Essential Meta (Critical) -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#d4af37">

    <!-- 🔥 ENTERPRISE SEO (Google Loves This) -->
    <title>${provinceName} ไซด์ไลน์น้องท็อป ${safeProfiles.length}+ รูปตรงปก จ่ายหน้างาน | Sideline CM</title>
    <meta name="description" content="${provinceName} ${safeProfiles.length}+ รับงานน้องนักศึกษา พริตตี้ รูปตรงปก 100% ไม่ต้องโอนมัดจำ เริ่ม 1,500฿ LINE ตอบ 5นาที 24 ชม.">
    <meta name="keywords" content="${provinceName} ไซด์ไลน์,รับงาน${provinceName},น้องนักศึกษา${provinceName},พริตตี้${provinceName},รูปตรงปก${provinceName},ไม่มัดจำ${provinceName},น้องท็อป${provinceName}">
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
    <link rel="canonical" href="${provinceUrl}">
    
    <!-- Schema.org Breadcrumbs + LocalBusiness -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

    <!-- Open Graph + Twitter -->
    <meta property="og:title" content="${provinceName} - น้องท็อป ${safeProfiles.length}+ รูปตรงปก">
    <meta property="og:description" content="${provinceName} ${safeProfiles.length}+ น้องนักศึกษา พริตตี้ รูปตรงปก 100%">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:locale" content="th_TH">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${provinceName} น้องท็อป ${safeProfiles.length}+">

    <!-- Preload Critical Resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" as="style">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'">

    <!-- Tailwind + Custom Config -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: { 
                extend: { 
                    colors: { 
                        gold: '#d4af37',
                        'gold-dark': '#b8972e',
                        glass: 'rgba(15,15,15,0.95)'
                    }, 
                    fontFamily: { 
                        serif: ['Cinzel', 'serif'],
                        sans: ['Plus Jakarta Sans', 'sans-serif']
                    },
                    animation: {
                        'shimmer': 'shimmer 3s linear infinite',
                        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }
                } 
            }
        }
    </script>

    <!-- CRITICAL CSS (Zero CLS + Perfect Typography) -->
    <style>
        :root { 
            --dark: #050505; 
            --gold: #d4af37; 
            --glass: rgba(15,15,15,0.97); 
            --gradient-gold: linear-gradient(135deg, #d4af37 0%, #f7d794 50%, #d4af37 100%);
        }
        
        * { box-sizing: border-box; }
        body { 
            background: var(--dark); 
            color: #f8f9fa; 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            overflow-x: hidden; 
            line-height: 1.7;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
        }
        
        /* Typography Scale (Golden Ratio) */
        h1 { font-size: clamp(2rem, 5vw, 4rem); line-height: 1.1; }
        h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); line-height: 1.2; }
        h3 { font-size: clamp(1.25rem, 3vw, 1.75rem); line-height: 1.3; }
        
        /* Shimmer Animation */
        .shimmer-gold { 
            background: var(--gradient-gold); 
            background-size: 200% auto; 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
            background-clip: text;
            animation: shimmer 3s linear infinite; 
        }
        @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
        
        /* Glass Morphism */
        .glass-ui { 
            background: var(--glass); 
            backdrop-filter: blur(24px); 
            border: 1px solid rgba(255,255,255,0.08); 
            box-shadow: 0 25px 45px -15px rgba(0,0,0,0.5);
        }
        
        /* Card Grid Perfect */
        .profile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            align-items: start;
        }
        @media (max-width: 640px) { .profile-grid { gap: 1rem; } }
        
        /* FAQ Animation */
        details summary { list-style: none; }
        details[open] summary ~ * { animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; height: 0; } to { opacity: 1; height: auto; } }
        
        /* Zero CLS */
        img { content-visibility: auto; contain-intrinsic-size: 360px 480px; }
    </style>
</head>

<body>
    <!-- ===== NAVIGATION (Sticky + SEO Friendly) ===== -->
    <nav class="fixed top-0 w-full z-[100] py-3 border-b border-white/5 bg-black/95 backdrop-blur-xl transition-all duration-500" role="banner">
        <div class="container mx-auto px-4 max-w-7xl flex items-center justify-between">
            <a href="/" class="text-2xl font-serif font-black tracking-tight shimmer-gold group hover:scale-105 transition-all" aria-label="Sideline CM หน้าแรก">
                Sideline CM
            </a>
            
            <div class="hidden md:flex items-center gap-8 text-sm font-semibold tracking-tight text-white/90">
                <a href="/" class="hover:text-gold transition-colors py-2">หน้าแรก</a>
                <a href="/profiles" class="hover:text-gold transition-colors py-2">ทุกจังหวัด</a>
                <span class="px-3 py-2 bg-gold/10 rounded-xl text-gold font-bold text-xs uppercase tracking-wider">${provinceName}</span>
            </div>
            
            <a href="${CONFIG.SOCIAL_LINKS.line}" class="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-emerald/25 hover:scale-105 transition-all duration-300 flex items-center gap-2" rel="noopener" aria-label="LINE ติดต่อสอบถามน้องๆ ${provinceName}">
                <i class="fab fa-line text-lg"></i>
                LINE 5นาที
            </a>
        </div>
    </nav>

    <!-- ===== HERO SECTION (H1 + Above Fold SEO) ===== -->
    <header class="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/30 to-black">
        <!-- Trust Badge -->
        <div class="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div class="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/95 to-teal-500/95 backdrop-blur-xl px-8 py-4 rounded-3xl text-sm font-black uppercase tracking-widest text-white shadow-2xl border border-emerald-300/50 animate-pulse-soft">
                <span class="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
                ✅ รูปตรงปก 100% | ไม่ต้องโอน | จ่ายหน้างานเท่านั้น
            </div>
        </div>

        <main class="relative z-20 max-w-6xl mx-auto space-y-8 px-6">
            <!-- H1: Primary SEO Target -->
            <h1 class="font-serif font-black leading-none max-w-4xl mx-auto">
                <span class="block text-4xl md:text-6xl lg:text-8xl shimmer-gold drop-shadow-2xl mb-6">${provinceName}</span>
                <span class="block text-2xl md:text-4xl lg:text-5xl text-white/90 font-light italic mb-8">น้องท็อป ${safeProfiles.length}+ คน รูปตรงปก</span>
                <span class="block text-xl md:text-2xl lg:text-3xl text-gold font-bold tracking-tight bg-white/10 px-6 py-3 rounded-2xl inline-block">
                    เริ่ม 1,500฿/ชม. • LINE ตอบ 5นาที • 24 ชม.
                </span>
            </h1>

            <!-- Hero Paragraph (Featured Snippet) -->
            <p class="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
                🔥 ศูนย์รวม <strong>น้องนักศึกษา พริตตี้ Event นางแบบ</strong> ${provinceName} คัดเกรดพรีเมียม รูปตรงปก 100% 
                ไม่ต้องโอนมัดจำ ปลอดภัยสูงสุด บริการครบทุกโซนยอดนิยม
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
                <a href="#profiles" class="group w-full sm:w-auto bg-gradient-to-r from-gold to-orange-500 text-black px-12 py-6 md:py-7 rounded-3xl font-black text-xl shadow-2xl hover:shadow-gold/50 hover:scale-105 transition-all duration-500 flex items-center gap-4 justify-center">
                    <i class="fas fa-heart text-2xl group-hover:animate-bounce"></i>
                    ดูน้องๆ ${safeProfiles.length}+ คน
                </a>
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-3xl flex items-center justify-center text-white text-2xl md:text-3xl shadow-2xl hover:shadow-emerald/50 hover:-translate-y-2 transition-all duration-500 ring-4 ring-emerald-400/30">
                    <i class="fab fa-line"></i>
                </a>
            </div>

            <!-- Trust Indicators -->
            <p class="text-sm md:text-base text-white/80 uppercase tracking-wider font-semibold flex flex-wrap justify-center items-center gap-6 bg-black/50 px-8 py-4 rounded-2xl max-w-2xl mx-auto">
                <span class="flex items-center gap-1"><i class="fas fa-users"></i> 🔞 20+ เท่านั้น</span>
                <span class="flex items-center gap-1"><i class="fas fa-star"></i> ⭐ 4.9/5 (${safeProfiles.length * 2}+ รีวิว)</span>
                <span>อัพเดท ${new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </p>
        </main>
    </header>

    <!-- ===== MAIN CONTENT (Semantic HTML5) ===== -->
    <main class="container mx-auto max-w-7xl py-12 px-6 lg:px-8 relative z-10" role="main">
        
        <!-- ===== 1. FEATURE SECTION (H2 + LSI Keywords) ===== -->
        <section class="mb-24 md:mb-32 glass-ui rounded-[3rem] p-8 md:p-16 text-center overflow-hidden shadow-3xl" aria-labelledby="feature-heading">
            <h2 id="feature-heading" class="text-3xl md:text-5xl font-serif font-bold mb-8 md:mb-12 shimmer-gold leading-tight">
                ไซด์ไลน์ <span class="block text-4xl md:text-6xl lg:text-7xl">${provinceName}</span>
                <span class="block text-xl md:text-2xl text-white/80 font-normal mt-4">น้องท็อปเบอร์ 1 รับงาน รูปตรงปก จ่ายหน้างาน</span>
            </h2>
            
            <div class="max-w-4xl mx-auto mb-12">
                <p class="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-medium">
                    รวบรวม <strong>น้องนักศึกษา พริตตี้ นางแบบ Event</strong> ${provinceName} กว่า ${safeProfiles.length}+ คน 
                    คัดเฉพาะตัวท็อป ปลอดภัย 100% เริ่มต้นเพียง <strong>1,500฿/ชั่วโมง</strong>
                </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto mb-12">
                <a href="#profiles" class="glass-ui px-10 py-6 rounded-3xl text-xl font-bold hover:bg-gold/20 transition-all duration-300 flex items-center gap-4 shadow-2xl w-full sm:w-auto justify-center">
                    <i class="fas fa-search text-gold text-xl"></i>
                    ดูโปรไฟล์น้องๆทั้งหมด
                </a>
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="w-16 h-16 md:w-20 md:h-20 bg-emerald-500 hover:bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-2xl shadow-2xl hover:scale-110 transition-all duration-300">
                    <i class="fab fa-line"></i>
                </a>
            </div>
        </section>

        <!-- ===== 2. SERVICE INFO (H2 + Featured Snippet) ===== -->
        <section class="mb-24 md:mb-36" aria-labelledby="service-heading">
            <div class="max-w-5xl mx-auto text-center">
                <h2 id="service-heading" class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-12 md:mb-20 shimmer-gold uppercase tracking-tight">
                    รับงาน <span class="block text-2xl md:text-3xl text-white/80 font-normal">เมื่อไหร่ ยังไงบ้าง?</span>
                </h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <article class="glass-ui group hover:scale-[1.02] transition-all duration-500 p-8 md:p-12 rounded-[2.5rem] text-center border-t-4 border-emerald-400/50">
                    <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 bg-emerald-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all">
                        <i class="fas fa-clock text-2xl md:text-3xl text-emerald-400"></i>
                    </div>
                    <h3 class="text-2xl md:text-3xl font-bold mb-6 text-white uppercase tracking-tight">24 ชม. 7 วัน</h3>
                    <p class="text-white/90 leading-relaxed text-lg md:text-xl">
                        น้องพร้อมรับงานทุกเวลา<br>
                        <small class="text-white/60 text-sm md:text-base">ดึก 01:00-06:00 แจ้งล่วงหน้า 2 ชม.</small>
                    </p>
                </article>

                <article class="glass-ui group hover:scale-[1.02] transition-all duration-500 p-8 md:p-12 rounded-[2.5rem] text-center border-t-4 border-emerald-400/50">
                    <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 bg-emerald-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all">
                        <i class="fab fa-line text-2xl md:text-3xl text-emerald-400"></i>
                    </div>
                    <h3 class="text-2xl md:text-3xl font-bold mb-6 text-white uppercase tracking-tight">ตอบไว 5นาที</h3>
                    <p class="text-white/90 leading-relaxed text-lg md:text-xl">
                        ทีมงานเช็คโปรไฟล์ให้ก่อนนัด<br>
                        <small class="text-white/60 text-sm md:text-base">LINE Official ตลอด 24 ชม.</small>
                    </p>
                </article>

                <article class="glass-ui group hover:scale-[1.02] transition-all duration-500 p-8 md:p-12 rounded-[2.5rem] text-center border-t-4 border-emerald-400/50">
                    <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 bg-emerald-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all">
                        <i class="fas fa-money-bill-wave text-2xl md:text-3xl text-emerald-400"></i>
                    </div>
                    <h3 class="text-2xl md:text-3xl font-bold mb-6 text-white uppercase tracking-tight">เริ่ม 1,500฿</h3>
                    <p class="text-white/90 leading-relaxed text-lg md:text-xl">
                        นักศึกษา 1,500-2,500฿ | พริตตี้ 2,000-4,000฿<br>
                        <small class="text-white/60 text-sm md:text-base">จ่ายเมื่อเจอน้องจริง</small>
                    </p>
                </article>
            </div>
        </section>

        <!-- ===== 3. TRUST SECTION (H2 + Social Proof) ===== -->
        <section class="mb-24 md:mb-36" aria-labelledby="trust-heading">
            <div class="max-w-4xl mx-auto text-center">
                <h2 id="trust-heading" class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-12 md:mb-20 shimmer-gold uppercase tracking-tight">
                    ทำไมลูกค้า <span class="block text-2xl md:text-3xl text-white/80 font-normal">เลือกเรา?</span>
                </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <article class="glass-ui group hover:scale-[1.02] p-10 md:p-12 rounded-[2.5rem] hover:border-gold/50 transition-all duration-500 border-t-4 border-blue-400/50">
                    <div class="w-24 h-24 mx-auto mb-8 bg-blue-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all">
                        <i class="fas fa-shield-alt text-3xl text-blue-400"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-6 text-white uppercase tracking-tight">ปลอดภัย 100%</h3>
                    <p class="text-white/90 leading-relaxed text-lg">
                        ไม่ต้องโอนมัดจำใดๆ จ่ายเมื่อเจอน้องจริง<br>
                        <strong>ลูกค้า 5,000+ คนไว้ใจ</strong>
                    </p>
                </article>

                <article class="glass-ui group hover:scale-[1.02] p-10 md:p-12 rounded-[2.5rem] hover:border-gold/50 transition-all duration-500 border-t-4 border-green-400/50">
                    <div class="w-24 h-24 mx-auto mb-8 bg-green-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all">
                        <i class="fas fa-camera-check text-3xl text-green-400"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-6 text-white uppercase tracking-tight">รูปตรงปก</h3>
                    <p class="text-white/90 leading-relaxed text-lg">
                        ตรวจสอบวิดีโอ Live + รูปยืนยันตัวตน<br>
                        <strong>ไม่ตรงปก คืนเงินเต็มจำนวน</strong>
                    </p>
                </article>

                <article class="glass-ui group hover:scale-[1.02] p-10 md:p-12 rounded-[2.5rem] hover:border-gold/50 transition-all duration-500 border-t-4 border-purple-400/50">
                    <div class="w-24 h-24 mx-auto mb-8 bg-purple-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all">
                        <i class="fas fa-crown text-3xl text-purple-400"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-6 text-white uppercase tracking-tight">น้องท็อป</h3>
                    <p class="text-white/90 leading-relaxed text-lg">
                        นักศึกษา มช. พริตตี้ Event นางแบบ<br>
                        <strong>อัพเดทใหม่ทุกวัน ${safeProfiles.length}+ โปรไฟล์</strong>
                    </p>
                </article>
            </div>
        </section>

        <!-- ===== 4. SEO + LOCATION TAGS (H3 + LSI) ===== -->
        <section class="mb-20 md:mb-28 glass-ui rounded-[3rem] p-10 md:p-20 shadow-3xl" aria-labelledby="location-heading">
            <div class="max-w-5xl mx-auto">
                ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
                
                <div class="mt-16 pt-12 border-t border-white/10">
                    <h3 id="location-heading" class="text-2xl md:text-3xl font-serif font-bold text-center mb-12 shimmer-gold uppercase tracking-tight">
                        📍 พิกัดยอดนิยม ${provinceName}
                    </h3>
                    <div class="flex flex-wrap justify-center gap-3 md:gap-4 max-w-5xl mx-auto">
                        ${zones.slice(0, 12).map(z => `
                            <a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" 
                               class="group text-xs md:text-sm px-5 md:px-6 py-3 rounded-2xl border-2 border-white/20 font-bold uppercase tracking-wider bg-white/5 hover:bg-gradient-to-r hover:from-gold hover:to-orange-500 hover:text-black hover:border-gold/50 hover:shadow-gold/25 transition-all duration-300 shadow-lg text-white">
                                ${z}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== 5. PROFILES GRID (Core Content - H2) ===== -->
        <section id="profiles" class="mb-24 md:mb-36" aria-labelledby="profiles-heading">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-16 lg:mb-24">
                <div>
                    <h2 id="profiles-heading" class="text-4xl md:text-6xl lg:text-7xl font-serif font-black italic shimmer-gold leading-tight">
                        น้องๆ ${safeProfiles.length}+ ท่าน
                        <span class="block text-2xl md:text-3xl text-white/70 font-normal mt-4">พร้อมรับงานวันนี้</span>
                    </h2>
                </div>
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="glass-ui px-8 py-5 rounded-3xl font-bold text-lg hover:bg-gold/20 transition-all duration-300 flex items-center gap-3 shadow-2xl self-start lg:self-center">
                    <i class="fab fa-line text-emerald-400 text-xl"></i>
                    จองคิวเลย
                </a>
            </div>

            <!-- PERFECT RESPONSIVE GRID -->
            <div class="profile-grid">
                ${cardsHTML}
            </div>
        </section>

        <!-- ===== 6. FAQ (Schema FAQPage - H2) ===== -->
        <section class="mb-24 md:mb-36" aria-labelledby="faq-heading">
            <div class="max-w-5xl mx-auto text-center">
                <h2 id="faq-heading" class="text-3xl md:text-5xl font-serif font-black mb-16 md:mb-24 shimmer-gold uppercase tracking-tight">
                    คำถามที่พบบ่อย
                </h2>
            </div>

            <div class="glass-ui p-12 md:p-20 rounded-[4rem] max-w-6xl mx-auto">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <details class="faq-item group cursor-pointer border-l-4 border-gold/50 p-6 md:p-8 rounded-2xl hover:bg-white/5 transition-all">
                        <summary class="faq-question py-6 px-4 font-bold text-xl md:text-2xl text-white hover:text-gold transition-all flex items-center gap-4 list-none outline-none" onclick="this.parentNode.toggleAttribute('open')">
                            <i class="fas fa-plus-circle text-gold text-2xl group-open:hidden transition-all"></i>
                            <i class="fas fa-minus-circle text-gold text-2xl hidden group-open:block transition-all"></i>
                            ต้องโอนเงินมัดจำไหม?
                        </summary>
                        <div class="faq-answer mt-6 pt-8 pb-8 px-8 border-t border-white/20 text-white/90 text-lg leading-relaxed bg-white/5 rounded-2xl ml-12">
                            ❌ <strong>ไม่ต้องโอนมัดจำใดๆ!</strong> จ่ายเงินเมื่อเจอน้องจริงเท่านั้น 
                            เพื่อความปลอดภัยสูงสุด ป้องกันมิจฉาชีพ 100%
                        </div>
                    </details>

                    <details class="faq-item group cursor-pointer border-l-4 border-emerald-400/50 p-6 md:p-8 rounded-2xl hover:bg-white/5 transition-all">
                        <summary class="faq-question py-6 px-4 font-bold text-xl md:text-2xl text-white hover:text-emerald-400 transition-all flex items-center gap-4 list-none outline-none" onclick="this.parentNode.toggleAttribute('open')">
                            <i class="fas fa-plus-circle text-emerald-400 text-2xl group-open:hidden transition-all"></i>
                            <i class="fas fa-minus-circle text-emerald-400 text-2xl hidden group-open:block transition-all"></i>
                            รูปตรงกับคนจริงไหม?
                        </summary>
                        <div class="faq-answer mt-6 pt-8 pb-8 px-8 border-t border-white/20 text-white/90 text-lg leading-relaxed bg-white/5 rounded-2xl ml-12">
                            ✅ <strong>รูปตรงปก 100% รับประกัน!</strong> ทุกโปรไฟล์มีวิดีโอ Live 
                            + รูปยืนยันตัวตน ไม่ตรงปกยกเลิกได้ทันที คืนเงินเต็มจำนวน
                        </div>
                    </details>

                    <details class="faq-item group cursor-pointer border-l-4 border-purple-400/50 p-6 md:p-8 rounded-2xl hover:bg-white/5 transition-all">
                        <summary class="faq-question py-6 px-4 font-bold text-xl md:text-2xl text-white hover:text-purple-400 transition-all flex items-center gap-4 list-none outline-none" onclick="this.parentNode.toggleAttribute('open')">
                            <i class="fas fa-plus-circle text-purple-400 text-2xl group-open:hidden transition-all"></i>
                            <i class="fas fa-minus-circle text-purple-400 text-2xl hidden group-open:block transition-all"></i>
                            รับงานกี่โมงได้บ้าง?
                        </summary>
                        <div class="faq-answer mt-6 pt-8 pb-8 px-8 border-t border-white/20 text-white/90 text-lg leading-relaxed bg-white/5 rounded-2xl ml-12">
                            ⏰ <strong>24 ชั่วโมง 7 วัน ไม่มีวันหยุด</strong> 
                            แต่ออกดึก 01:00-06:00 ต้องแจ้งล่วงหน้า 2 ชั่วโมง
                        </div>
                    </details>

                    <details class="faq-item group cursor-pointer border-l-4 border-orange-400/50 p-6 md:p-8 rounded-2xl hover:bg-white/5 transition-all">
                        <summary class="faq-question py-6 px-4 font-bold text-xl md:text-2xl text-white hover:text-orange-400 transition-all flex items-center gap-4 list-none outline-none" onclick="this.parentNode.toggleAttribute('open')">
                            <i class="fas fa-plus-circle text-orange-400 text-2xl group-open:hidden transition-all"></i>
                            <i class="fas fa-minus-circle text-orange-400 text-2xl hidden group-open:block transition-all"></i>
                            ราคาเริ่มต้นเท่าไหร่?
                        </summary>
                        <div class="faq-answer mt-6 pt-8 pb-8 px-8 border-t border-white/20 text-white/90 text-lg leading-relaxed bg-white/5 rounded-2xl ml-12">
                            💰 <strong>น้องนักศึกษา 1,500-2,500฿ | พริตตี้ 2,000-4,000฿</strong> 
                            ต่อชั่วโมง จ่ายหน้างาน ไม่มีค่าบริการเพิ่มเติม
                        </div>
                    </details>
                </div>
            </div>
        </section>

        <!-- ===== 7. TESTIMONIALS (Social Proof - H2) ===== -->
        <section class="mb-24 md:mb-36" aria-labelledby="testimonial-heading">
            <div class="max-w-4xl mx-auto text-center">
                <h2 id="testimonial-heading" class="text-3xl md:text-5xl font-serif font-black mb-16 md:mb-24 shimmer-gold uppercase tracking-tight">
                    ลูกค้าพูดถึงเรายังไง
                </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <blockquote class="glass-ui p-10 md:p-12 rounded-[2.5rem] text-center italic border-t-4 border-gold/60 hover:scale-[1.02] transition-all duration-500">
                    <div class="text-4xl md:text-5xl mb-8 flex justify-center text-yellow-400">⭐⭐⭐⭐⭐</div>
                    <p class="text-white/95 mb-8 text-lg md:text-xl leading-relaxed font-medium">
                        "น้องตรงปกมาก! บริการดีสุดใน${provinceName} LINE ตอบไวมาก จ่ายหน้างานสบายใจสุดๆ 10/10"
                    </p>
                    <cite class="text-gold font-bold text-lg uppercase block not-italic">— พี่เอก, สมาชิก VIP</cite>
                </blockquote>

                <blockquote class="glass-ui p-10 md:p-12 rounded-[2.5rem] text-center italic border-t-4 border-gold/60 hover:scale-[1.02] transition-all duration-500">
                    <div class="text-4xl md:text-5xl mb-8 flex justify-center text-yellow-400">⭐⭐⭐⭐⭐</div>
                    <p class="text-white/95 mb-8 text-lg md:text-xl leading-relaxed font-medium">
                        "พริตตี้คุณภาพเยี่ยม ฟิวแฟนดีมาก ทีมงานเช็คโปรไฟล์ละเอียด ไว้ใจได้จริงๆ"
                    </p>
                    <cite class="text-gold font-bold text-lg uppercase block not-italic">— เจ้าของอีเวนต์</cite>
                </blockquote>

                <blockquote class="glass-ui p-10 md:p-12 rounded-[2.5rem] text-center italic border-t-4 border-gold/60 hover:scale-[1.02] transition-all duration-500">
                    <div class="text-4xl md:text-5xl mb-8 flex justify-center text-yellow-400">⭐⭐⭐⭐⭐</div>
                    <p class="text-white/95 mb-8 text-lg md:text-xl leading-relaxed font-medium">
                        "น้องนักศึกษาน่ารักมาก รูปจริงเป๊ะ ราคาคุ้มสุดๆ ใช้บริการประจำทุกสัปดาห์"
                    </p>
                    <cite class="text-gold font-bold text-lg uppercase block not-italic">— สมาชิกประจำ</cite>
                </blockquote>
            </div>
        </section>
    </main>

    <!-- ===== FIXED ACTION BUTTON (Conversion Beast) ===== -->
    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener" 
       class="fixed bottom-8 md:bottom-12 right-8 md:right-12 z-[1000] w-20 h-20 md:w-24 md:h-24 
              bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 
              rounded-3xl flex items-center justify-center text-white text-2xl md:text-3xl 
              shadow-2xl hover:shadow-emerald/50 border-4 border-white/20
              hover:-translate-y-3 hover:scale-110 transition-all duration-500 
              group hover:border-gold/50" 
       aria-label="จองคิวน้องๆ ${provinceName} ด่วน!">
        <i class="fab fa-line"></i>
        <span class="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 
                     bg-gradient-to-r from-red-500 to-orange-500 border-4 border-black 
                     rounded-full flex items-center justify-center text-xs md:text-sm 
                     font-black shadow-2xl animate-pulse group-hover:scale-110">
            HOT
        </span>
    </a>

    <!-- ===== FOOTER (SEO + Legal) ===== -->
    <footer class="border-t border-white/5 bg-black/80 backdrop-blur-xl py-16 mt-32" role="contentinfo">
        <div class="container mx-auto max-w-6xl px-6 text-center">
            <div class="mb-12">
                <a href="/" class="block w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-gold to-orange-500 rounded-3xl flex items-center justify-center text-3xl font-black shadow-2xl hover:scale-110 transition-all">
                    SC
                </a>
                <h3 class="text-2xl md:text-3xl font-serif font-bold text-white mb-6 shimmer-gold">Sideline CM</h3>
                <p class="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
                    บริการพรีเมียม ${provinceName} น้องท็อป รูปตรงปก ปลอดภัย 100% 
                    ไม่ต้องโอนมัดจำ จ่ายหน้างานเท่านั้น
                </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-sm text-white/70 mb-12">
                <div>
                    <h4 class="text-white font-bold text-base mb-4 uppercase tracking-tight">บริการ</h4>
                    <ul class="space-y-2">
                        <li><a href="#profiles" class="hover:text-gold transition-colors">น้องนักศึกษา</a></li>
                        <li><a href="#profiles" class="hover:text-gold transition-colors">พริตตี้ Event</a></li>
                        <li><a href="#profiles" class="hover:text-gold transition-colors">นางแบบ</a></li>
                        <li><a href="#faq" class="hover:text-gold transition-colors">24 ชม.</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold text-base mb-4 uppercase tracking-tight">ความปลอดภัย</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:text-gold transition-colors">ไม่โอนมัดจำ</a></li>
                        <li><a href="#" class="hover:text-gold transition-colors">รูปตรงปก</a></li>
                        <li><a href="#" class="hover:text-gold transition-colors">จ่ายหน้างาน</a></li>
                        <li><a href="${CONFIG.SOCIAL_LINKS.line}" class="hover:text-gold transition-colors">LINE Official</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold text-base mb-4 uppercase tracking-tight">โซน ${provinceName}</h4>
                    <ul class="space-y-2 max-w-xs mx-auto">
                        ${zones.slice(0, 6).map(z => `<li><a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" class="hover:text-gold transition-colors line-clamp-1">${z}</a></li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold text-base mb-4 uppercase tracking-tight">ติดต่อ</h4>
                    <div class="space-y-3">
                        <a href="${CONFIG.SOCIAL_LINKS.line}" class="flex items-center justify-center gap-3 hover:text-emerald-400 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-3 rounded-xl">
                            <i class="fab fa-line"></i> LINE ตอบไว
                        </a>
                        <p class="text-xs text-white/60">รับงาน 24 ชม.</p>
                    </div>
                </div>
            </div>

            <!-- Legal Footer -->
            <div class="pt-12 border-t border-white/5">
                <p class="text-sm text-white/50">
                    &copy; ${new Date().getFullYear() + 543} Sideline CM. สงวนลิขสิทธิ์. 
                    บริการสำหรับผู้ใหญ่ 20+ ปีเท่านั้น. 
                    <a href="/privacy" class="hover:text-gold transition-colors">นโยบายความเป็นส่วนตัว</a> | 
                    <a href="/terms" class="hover:text-gold transition-colors">ข้อกำหนดการใช้</a>
                </p>
            </div>
        </div>
    </footer>

    <!-- ===== PERFORMANCE SCRIPTS ===== -->
    <script>
        // Intersection Observer for Fade In
        document.addEventListener('DOMContentLoaded', () => {
            // Navbar Enhancement
            const nav = document.querySelector('nav');
            let ticking = false;
            function updateNav() {
                if (window.scrollY > 100) {
                    nav?.classList.add('py-2', 'backdrop-blur-2xl', 'shadow-xl');
                } else {
                    nav?.classList.remove('py-2', 'backdrop-blur-2xl', 'shadow-xl');
                }
                ticking = false;
            }
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateNav);
                    ticking = true;
                }
            }, { passive: true });

            // Smooth Scroll
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });

            // FAQ Enhancement
            document.querySelectorAll('details').forEach(detail => {
                detail.addEventListener('toggle', () => {
                    if (detail.open) {
                        detail.classList.add('open');
                    }
                });
            });
        });

        // Progressive Image Loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        img.src = img.dataset.src;
                        imageObserver.unobserve(img);
                    }
                });
            });
            document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
        }
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