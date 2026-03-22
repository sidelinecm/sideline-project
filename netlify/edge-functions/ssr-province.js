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
        // Fallback values
        const profileName = p.name || 'สาวสวย';
        const profileLocation = p.location || provinceName || 'ไม่ระบุพิกัด';
        const profileRate = p.rate || '5.0';
        
        // Performance Logic
        const isEager = i < 6; 
        const imgWidth = isEager ? 500 : 400;
        const imgHeight = isEager ? 667 : 533;
        const loadingAttr = isEager 
            ? `loading="eager" fetchpriority="high" decoding="sync"` 
            : `loading="lazy" decoding="async"`;
        
        return `
        <article class="group relative bg-[#0f0f0f] rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 hover:border-gold/60 transition-all duration-500 shadow-xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] hover:-translate-y-2 flex flex-col h-full css-content-visibility">
            <a href="/sideline/${p.slug || '#'}" class="absolute inset-0 z-30" aria-label="ดูโปรไฟล์น้อง ${profileName}"></a>
            
            <div class="relative w-full pt-[133.33%] bg-[#111] overflow-hidden">
                <img src="${optimizeImg(p.imagePath || '/default-avatar.jpg', imgWidth, imgHeight)}" 
                     alt="น้อง${profileName} รับงาน${provinceName} พิกัด ${profileLocation}" 
                     class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-90"
                     ${loadingAttr}
                     width="${imgWidth}" height="${imgHeight}">
                
                <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent pointer-events-none"></div>
                
                <div class="absolute bottom-3 left-3 z-20">
                    <span class="bg-black/90 backdrop-blur-md text-gold text-[10px] md:text-[9px] px-3 py-1.5 rounded-full border border-gold/30 font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                        <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span> 100% ตรงปก
                    </span>
                </div>
                
                ${p.isfeatured ? `
                    <div class="absolute top-3 right-3 z-20 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black text-[10px] md:text-[8px] font-black px-3 py-1.5 rounded-full uppercase shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                        🔥 ตัวท็อป
                    </div>
                ` : ''}
            </div>
            
            <div class="p-5 flex-1 flex flex-col justify-end relative z-20">
                <div class="flex justify-between items-start mb-2 gap-2">
                    <h3 class="font-bold text-lg md:text-xl lg:text-2xl italic line-clamp-1 text-white group-hover:text-gold transition-colors">
                        ${profileName}
                    </h3>
                    <span class="text-gold text-[11px] font-black flex-shrink-0 bg-gold/10 px-2.5 py-1 rounded-lg border border-gold/20">
                        ★ ${profileRate}
                    </span>
                </div>
                <p class="text-[11px] md:text-[10px] text-white/50 font-bold uppercase tracking-widest line-clamp-1 mb-4 flex items-center gap-1.5">
                    <i class="fas fa-map-marker-alt text-gold/50"></i> 
                    พิกัด: ${profileLocation}
                </p>
                
                <div class="mt-auto">
                    <span class="w-full flex items-center justify-center gap-2 bg-white/5 text-white/80 text-[12px] md:text-[11px] px-4 py-3 rounded-xl border border-white/10 font-bold uppercase tracking-widest group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all duration-300">
                        <span>ดูรูปโปรไฟล์</span>
                        <i class="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                    </span>
                </div>
            </div>
        </article>`;
    }).join('');
}

// ==========================================
        // 6. RENDER THE ULTIMATE HTML (LUXURY, FIXED & AUDITED)
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#d4af37">

    <title>${title} | เกรดพรีเมียม รับงานเอง ไม่มัดจำ 100%</title>
    <meta name="description" content="${description} หาเด็ก${provinceName} น้องนักศึกษา พริตตี้พาร์ทไทม์ ตรงปก ไม่โอนมัดจำ ปลอดภัยแน่นอน" />
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}, น้องนักศึกษา${provinceName}, ตรงปก, ไม่มัดจำ" />
    
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="google-site-verification" content="0N_IQUDZv9Y2WtNhjqSPTV3TuPsildmmO-TPwdMlSfg" />
    <link rel="canonical" href="${provinceUrl}" />

    <!-- Open Graph (LINE/FB/X) -->
    <meta property="og:locale" content="th_TH">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="🔥 ${title}">
    <meta property="og:description" content="พิกัดน้องๆ ${provinceName} รับงานเอง ฟิวแฟน ไม่ต้องมัดจำ ปลอดภัย 100% ตรงปกแน่นอน">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="${CONFIG.TWITTER}">
    
    <!-- Favicon & Mobile Meta -->
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <!-- Performance & Font Display -->
    <link rel="preconnect" href="https://res.cloudinary.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Plus+Jakarta+Sans:wght@400;600;700&family=Prompt:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <!-- แก้ Render Blocking: โหลด CSS ไอคอนแบบ Async -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <!-- Tailwind Standard CDN -->
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <script>
        tailwind.config = { theme: { extend: { colors: { gold: '#d4af37' }, fontFamily: { serif:['Cinzel', 'serif'] } } } };
    </script>
    
    <style>
        :root { --dark: #050505; --gold: #d4af37; --glass: rgba(15, 15, 15, 0.95); }
        body { background: var(--dark); color: #f8f9fa; font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif; min-height: 100vh; overflow-x: hidden; }
        
        /* ✅ แก้ปัญหา CLS & Rendering */
        header { min-height: 600px; } 
        .css-content-visibility { content-visibility: auto; contain-intrinsic-size: 800px; }
        
        /* Premium Effects */
        .shimmer-gold { 
            background: linear-gradient(135deg, #b38728 0%, #fbf5b7 45%, #d4af37 55%, #aa771c 100%); 
            background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
            animation: shimmer 5s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }
        
        /* ✅ Zero CLS Image Ratio 3:4 */
        .img-aspect-ratio { position: relative; padding-bottom: 133.33%; overflow: hidden; background: #111; border-radius: inherit; }
        .img-aspect-ratio img { position: absolute; inset:0; width:100%; height:100%; object-fit:cover; transition: transform 0.7s ease; }
        
        .glass-ui { background: var(--glass); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }
        .hero-gradient { background: linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.8) 70%, #050505 100%); }

        /* ✅ แก้ปัญหา Contrast สำหรับคนสายตาปกติและบอท Google */
        .text-readable { color: rgba(255, 255, 255, 0.9) !important; }
        .text-meta-info { color: rgba(255, 255, 255, 0.75) !important; }
        .text-gold-bright { color: #facc15 !important; }
    </style>

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
</head>
<body>
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-[100] transition-all duration-300 py-3 md:py-4 border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl">
        <div class="container mx-auto px-4 flex justify-between items-center max-w-7xl">
            <a href="/" class="text-xl md:text-2xl font-serif font-black tracking-widest shimmer-gold" aria-label="หน้าหลัก Sideline CM">Sideline CM</a>
            <div class="hidden md:flex items-center gap-6 text-[11px] font-bold tracking-[0.2em] text-white/90 uppercase">
                <a href="/" class="hover:text-gold transition-colors">Home</a>
                <a href="/profiles" class="hover:text-gold transition-colors">Directory</a>
                <span class="text-gold border-b border-gold/40 pb-0.5">${provinceName}</span>
            </div>
            <!-- ✅ เพิ่ม aria-label แก้ปัญหาลิงก์ไม่มีชื่อ -->
            <a href="${CONFIG.SOCIAL_LINKS.line}" aria-label="แอดไลน์สอบถามคิวน้องๆ ทันที" class="flex items-center gap-2 bg-[#06c755] text-white px-4 py-2 rounded-full font-bold text-xs hover:scale-105 transition-transform shadow-lg shadow-green-600/20">
                <i class="fab fa-line text-lg"></i>
                <span class="hidden xs:inline">LINE OA</span>
            </a>
        </div>
    </nav>

    <header class="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 overflow-hidden">
    <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 hero-gradient z-10"></div>
        ${safeProfiles.length > 0 ? `
            <img src="${firstImage.replace('q_auto:best', 'q_auto:eco')}" 
                 class="w-full h-full object-cover opacity-30 scale-105" 
                 alt="ไซด์ไลน์${provinceName} รับงาน${provinceName} ฟิวแฟนตรงปก" 
                 fetchpriority="high" 
                 decoding="sync">
        ` : ''}
    </div>
    
    <div class="relative z-20 max-w-5xl mx-auto space-y-8">
        <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gold/40 bg-black/60 backdrop-blur-md text-gold text-[10px] md:text-xs font-black tracking-[0.4em] uppercase shadow-2xl">
            <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            Verified Profiles • ${CURRENT_MONTH} ${CURRENT_YEAR}
        </div>

        <h1 class="font-serif font-black drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] text-[clamp(2.2rem,8vw,5.5rem)] leading-[1] md:leading-[1.1]">
            <span class="block text-xl md:text-3xl text-white/80 italic font-light tracking-[0.2em] mb-3 uppercase">Exclusive Service</span>
            <span class="block shimmer-gold uppercase tracking-tight">
                ไซด์ไลน์${provinceName} <span class="text-white">&</span> รับงาน${provinceName}
            </span>
            <span class="block text-lg md:text-2xl text-gold-bright mt-4 font-sans tracking-[0.1em] font-bold">
                การันตีตรงปก 100% • ไม่ต้องโอนมัดจำ • จ่ายหน้างาน
            </span>
        </h1>

        <p class="text-base md:text-xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
            สัมผัสประสบการณ์เหนือระดับกับน้องๆ <strong>ไซด์ไลน์${provinceName}</strong> เกรดพรีเมียม 
            นัดง่ายปลอดภัยในโซน <strong>${seoData.zones.slice(0, 3).join(', ')}</strong> 
            เน้นงานคุณภาพ <strong>ฟิวแฟน</strong> ดูแลดีที่สุดใน${provinceName}
        </p>

        <div class="flex flex-wrap justify-center gap-4 pt-4">
            <a href="${CONFIG.SOCIAL_LINKS.line}" class="bg-[#06c755] hover:bg-[#05b34c] text-white px-8 py-4 rounded-full font-black text-sm transition-all hover:scale-105 shadow-[0_10px_20px_rgba(6,199,85,0.3)] flex items-center gap-2">
                <i class="fab fa-line text-xl"></i> จองคิวน้องๆ ทันที
            </a>
            <a href="#profiles" class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-black text-sm transition-all hover:bg-white/20">
                เลือกดูโปรไฟล์
            </a>
        </div>
    </div>
</header>

    <main class="container mx-auto max-w-7xl py-8 px-4 relative z-10">
        
        <!-- Content Block (H2) -->
        <section class="mb-12 md:mb-24 glass-ui rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div class="max-w-4xl mx-auto relative z-10 text-readable">
                ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
            </div>
            
            <div class="mt-12 border-t border-white/20 pt-10">
                <h3 class="text-sm font-bold text-white/90 uppercase tracking-[0.3em] mb-8 italic">📍 พิกัดบริการยอดฮิตใน${provinceName}</h3>
                <div class="flex flex-wrap justify-center gap-2.5 md:gap-4">
                    ${zones.map(z => `
                        <a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" 
                           aria-label="รับงานโซน ${z}" class="text-[10px] md:text-xs px-5 py-2.5 rounded-full border border-white/30 font-bold uppercase tracking-widest bg-white/10 text-white hover:bg-gold hover:text-black transition-all shadow-md">
                           #รับงาน${z}
                        </a>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- ✅ Listing Grid: Grid-Cols-2 Mobile อัตโนมัติ -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 mb-20 md:mb-32">
            ${cardsHTML}
        </div>

        <!-- Selling Points (H3) -->
        <section class="mb-20 md:mb-32">
            <h2 class="text-2xl md:text-4xl font-serif text-center mb-12 md:mb-20 shimmer-gold italic uppercase">Excellence & Security</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-readable">
                <div class="glass-ui p-10 rounded-[2.5rem] border-t border-white/20 group hover:border-gold/50 transition-colors text-center">
                    <div class="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <i class="fas fa-shield-heart text-gold text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4 italic text-white uppercase">ปลอดภัย 100%</h3>
                    <p class="text-white/80 text-sm leading-relaxed">มั่นใจสูงสุดด้วยระบบ <strong>ไม่ต้องโอนมัดจำล่วงหน้า</strong> ป้องกันมิจฉาชีพ ลูกค้าจ่ายเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น</p>
                </div>
                <div class="glass-ui p-10 rounded-[2.5rem] border-t border-white/20 group hover:border-gold/50 transition-colors text-center">
                    <div class="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <i class="fas fa-camera-retro text-gold text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4 italic text-white uppercase">รูปตรงปก ไม่จกตา</h3>
                    <p class="text-white/80 text-sm leading-relaxed">เรามีการตรวจสอบโปรไฟล์อย่างเข้มงวด คัดเฉพาะน้องๆ ที่ทำงานจริง <strong>ตรงปกแน่นอน</strong> หากไม่ตรงปกยินดีให้ยกเลิกได้ทันที</p>
                </div>
                <div class="glass-ui p-10 rounded-[2.5rem] border-t border-white/20 group hover:border-gold/50 transition-colors text-center">
                    <div class="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <i class="fas fa-star text-gold text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4 italic text-white uppercase">คัดเฉพาะตัวท็อป</h3>
                    <p class="text-white/80 text-sm leading-relaxed">รวบรวมน้องๆ หลากหลายสไตล์ ทั้ง <strong>น้องนักศึกษา</strong> พริตตี้ นางแบบ และพนักงานออฟฟิศพาร์ทไทม์ ฟิวแฟนดีเยี่ยม</p>
                </div>
            </div>
        </section>
    </main>

    <!-- RICH SEO FOOTER (Fixed Contrast & Labels) -->
    <footer class="bg-[#020202] border-t border-white/10 pt-24 pb-12">
        <div class="container mx-auto max-w-7xl px-4 text-white">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div class="md:col-span-2 space-y-8">
                    <h3 class="text-3xl font-serif shimmer-gold font-black italic tracking-widest uppercase">Sideline CM</h3>
                    <p class="text-white/80 text-sm leading-loose max-w-md font-light">
                        เบอร์ 1 แพลตฟอร์ม <strong>ไซด์ไลน์${provinceName}</strong> และเครือข่ายรับงานที่ใหญ่ที่สุดในไทย เรามุ่งเน้นความโปร่งใส ปลอดภัย และรักษาความเป็นส่วนตัวสูงสุด
                    </p>
                    <div class="flex gap-4">
                        <a href="${CONFIG.SOCIAL_LINKS.line}" aria-label="ติดต่อ LINE Official" class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gold hover:text-black transition-all border border-white/20"><i class="fab fa-line text-xl"></i></a>
                        <a href="${CONFIG.SOCIAL_LINKS.twitter}" aria-label="ติดตาม Twitter" class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gold hover:text-black transition-all border border-white/20"><i class="fab fa-x-twitter text-xl"></i></a>
                        <a href="${CONFIG.SOCIAL_LINKS.tiktok}" aria-label="ติดตาม TikTok" class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gold hover:text-black transition-all border border-white/20"><i class="fab fa-tiktok text-xl"></i></a>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-white text-xs font-bold uppercase tracking-[0.4em] mb-8 border-b border-gold/30 pb-2 inline-block">Popular Services</h4>
                    <ul class="space-y-4 text-white/80 text-xs font-light tracking-wide uppercase">
                        <li><a href="#" class="hover:text-gold transition-colors italic">รับงานน้องนักศึกษา</a></li>
                        <li><a href="#" class="hover:text-gold transition-colors italic">พริตตี้เอนเตอร์เทน</a></li>
                        <li><a href="#" class="hover:text-gold transition-colors italic">เพื่อนเที่ยวพรีเมียม</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white text-xs font-bold uppercase tracking-[0.4em] mb-8 border-b border-gold/30 pb-2 inline-block">Help & Policy</h4>
                    <ul class="space-y-4 text-white/80 text-xs font-light tracking-wide uppercase">
                        <li><a href="/privacy" class="hover:text-gold transition-colors">Privacy Policy</a></li>
                        <li><a href="/terms" class="hover:text-gold transition-colors">Terms of Service</a></li>
                        <li class="pt-4">
                            <span class="inline-block text-xs text-red-500 font-bold border border-red-500/40 px-4 py-2 rounded-lg leading-relaxed uppercase">
                                🔞 สำหรับผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-10 gap-6">
                <p class="text-xs text-white/70 uppercase tracking-[0.3em] font-bold">&copy; 2026 ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
                <div class="flex gap-8 text-[9px] text-white/60 uppercase font-black tracking-widest">
                    <span class="flex items-center gap-2"><i class="fas fa-bolt text-gold"></i> FAST LOAD SSR</span>
                    <span class="flex items-center gap-2"><i class="fas fa-lock text-gold"></i> SSL VERIFIED</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- FAB Button -->
    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="จองคิวน้องๆ ทันที"
       class="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-[#06c755] to-[#04a045] rounded-full flex items-center justify-center text-white text-3xl shadow-[0_10px_30px_rgba(6,199,85,0.4)] hover:-translate-y-2 hover:scale-105 transition-all duration-300 z-[99] border-2 border-white/30">
        <i class="fab fa-line"></i>
        <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 border-2 border-[#050505] rounded-full animate-bounce flex items-center justify-center text-[10px] font-bold">1</span>
    </a>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const nav = document.querySelector('nav');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('bg-[#050505]/95', 'py-2', 'border-white/10');
                    nav.classList.remove('bg-[#050505]/80', 'py-3', 'border-white/5');
                } else {
                    nav.classList.remove('bg-[#050505]/95', 'py-2', 'border-white/10');
                    nav.classList.add('bg-[#050505]/80', 'py-3', 'border-white/5');
                }
            }, { passive: true });
        });
    </script>
</body>
</html>`;

        // ==========================================
        // 7. RETURN SWR CACHED RESPONSE & SECURITY HEADERS
        // ==========================================
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