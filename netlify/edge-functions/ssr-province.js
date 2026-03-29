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
            .from('provinces')
            .select('id, nameThai, key')
            .eq('key', provinceKey)
            .maybeSingle();

        // 2. ถ้าไม่เจอจังหวัด ให้ส่ง 404 แบบมีหน้าเอง แทน context.next()
        if (!provinceData || provError) {
            const notFoundHtml = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ไม่พบหน้าจังหวัด • ${CONFIG.BRAND_NAME}</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        :root { --bg: #070707; --text: #f8f9fa; --gold: #a88e5f; }
        body { background: var(--bg); color: var(--text); font-family: sans-serif; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .container { text-align: center; }
        h1 { font-size: 2rem; color: var(--gold); margin-bottom: 0.5rem; }
        p { color: #b3b3b3; font-size: 0.9rem; }
        a { color: var(--gold); text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>ไม่พบจังหวัดนี้</h1>
        <p>ไม่พบโปรไฟล์ไซด์ไลน์สำหรับจังหวัด <span style="color:#a88e5f;">${provinceKey}</span> กรุณาตรวจสอบ URL หรือดู <a href="/profiles">หน้ารวมโปรไฟล์ทั้งหมด</a>.</p>
    </div>
</body>
</html>
`;

            return new Response(notFoundHtml, {
                status: 404,
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                },
            });
        }

        // 2. ดึงข้อมูลโปรไฟล์น้องๆ ในจังหวัดนั้น
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, created_at, active, availability, likes')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('lastUpdated', { ascending: false })
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

        // ด้านล่างนี้คือ schema + cardsHTML คุณมีอยู่แล้ว ไม่ต้องดัดแปลงโครงสร้าง
        // .. ต่อ_schemaData + cardsHTML + html Template ด้านล่างสุด ของเรา ..

        // ========================================
        // ด้านล่างนี้คือส่วนที่คุณต้องทับทั้งหมดในไฟล์ (ต่อจากตรงที่คุณตัดไว้)
        // ========================================

        // ตรงนี้คุณมีอยู่แล้ว (schema + cardsHTML + ตัวแปร)
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

        const cardsHTML = safeProfiles.map((p, i) => {
            const cleanName = (p.name || 'สาวสวย').replace(/^(น้อง)/, '');
            const profileLocation = p.location || provinceName || 'ไม่ระบุพิกัด';
            const cardRating = (4.7 + (i % 4) / 10).toFixed(1);

            const busyKeywords = ['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'];
            let isAvailable = true;
            if (p.availability) {
                const availText = p.availability.toLowerCase();
                isAvailable = !busyKeywords.some(kw => availText.includes(kw));
            }
            const statusText = isAvailable ? 'พร้อมรับงาน' : 'ติดจอง';

            const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
            const d = new Date(dateStr);
            const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
            const dateDisplay = `${d.getDate()} ${months[d.getMonth()]} ${(d.getFullYear() + 543).toString().slice(-2)}`;

            const seoKeywords = [`ไซด์ไลน์${provinceName}`, `รับงาน${provinceName}`, `เด็กเอ็น${provinceName}`, `ฟิวแฟน${provinceName}`, `พริตตี้${provinceName}`];
            const targetKeyword = seoKeywords[i % seoKeywords.length];
            const imgAlt = `น้อง${cleanName} ${targetKeyword} พิกัด ${profileLocation} - รูปตรงปก ไม่โอนมัดจำ`;
            const profileLink = `/sideline/${p.slug || p.id || '#'}`;

            return `
<article
    itemscope
    itemtype="http://schema.org/Person"
    class="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 flex flex-col transition-all duration-300 hover:border-primary hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
>
    <a href="${profileLink}" itemprop="url" class="block w-full h-full" aria-label="ดูโปรไฟล์ของ ${cleanName}"></a>
    
    <div class="relative w-full h-0 pt-[130%] overflow-hidden">
        <img
            itemprop="image"
            src="${optimizeImg(p.imagePath, 400, 530)}"
            alt="${imgAlt}"
            loading="${i < 4 ? 'eager' : 'lazy'}"
            class="absolute inset-0 w-full h-full object-cover"
            width="400"
            height="530"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
    </div>

    <div class="p-4">
        <div class="flex justify-between items-center mb-2">
            <h3
                itemprop="name"
                class="text-white font-medium text-base line-clamp-1 tracking-wide"
            >
                ${cleanName}
            </h3>
            <div class="flex items-center gap-2">
                <span class="text-primary text-[10px] font-bold">${cardRating}</span>
                <span class="text-[10px] text-white/60">★</span>
            </div>
        </div>
        <p class="text-[10px] text-white/60 mb-2">
            <i class="fas fa-map-marker-alt text-primary/80 mr-1"></i>
            ${profileLocation}
        </p>
        <p class="text-[9px] text-white/50 mb-3">
            อัปเดตเมื่อ ${dateDisplay}
        </p>
        <div class="flex justify-between items-center">
            <span class="text-[10px] text-white/60 uppercase tracking-[0.1em]">เริ่มต้น</span>
            <span class="font-bold text-white">฿${p.rate || 'สอบถาม'}</span>
        </div>
    </div>
</article>
`;
        }).join('');

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

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Prompt:wght@300;400;500&display=swap" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <script type="application/ld+json">
        ${JSON.stringify(schemaData)}
    </script>

    <script src="https://cdn.tailwindcss.com?minify=true"></script>
    <script>
        tailwind.config = { 
  theme: { 
    extend: { 
      colors: { 
        primary: { DEFAULT: '#A88E5F', hover: '#C4B6A1', deep: '#6B4E31' } 
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
/* กำหนดตัวแปรสีใหม่ โทนมืด–เรียบหรู ดูดี */
:root {
  /* พื้นหลังหลัก */
  --bg: #070707;
  --bg-card: #0a0a0a;
  --bg-hero: #090909;

  /* ตัวอักษร */
  --text: #f8f9fa;
  --text-subtle: #b3b3b3;
  --text-muted: #888888;

  /* ตัวเน้นหลักแทนสีทองเดิม */
  --primary: #a88e5f;          /* ทองอ่อน ดูคลาสสิก ไม่เวอร์ */
  --primary-hover: #c4b6a1;    /* เบจอ่อน */
  --primary-dark: #6b4e31;     /* น้ำตาลเข้ม ดูดี */
  
  /* ขอบและเส้น */
  --border: rgba(255, 255, 255, 0.08);
  --border-highlight: rgba(255, 255, 255, 0.16);
  
  /* สถานะ */
  --online: #00cc66;
  --offline: #e74c3c;
}

/* ลดความสดของสี hover ให้ดูนุ่มขึ้น */
a:hover {
  color: var(--primary-hover);
}

/* ลดความหนาของ shadow ให้ดูดี ไม่โป๊ */
.card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

    </style>
</head>

<body class="selection:bg-gold/30 selection:text-white">
<nav class="fixed top-0 w-full z-[100] nav-glass border-b-0 py-4 transition-all duration-500">
    <div class="container max-w-[1400px] px-6 lg:px-12 flex justify-between items-center">
        <a href="/" class="text-xl md:text-2xl font-serif tracking-[0.15em] text-white hover:text-primary transition-all">
            SIDELINE<span class="text-primary italic ml-1">${provinceData.key.toUpperCase()}</span>
        </a>
        <div class="hidden md:flex items-center gap-8 text-[10px] font-medium tracking-[0.15em] uppercase">
            <a href="/" class="text-white/60 hover:text-white transition-colors">Home</a>
            <a href="/profiles" class="text-white/60 hover:text-white transition-colors">Directory</a>
            <span class="text-primary border-b-2 border-primary/50 pb-1">${provinceName}</span>
        </div>
    </div>
</nav>


<header class="relative pt-44 pb-24 px-6 hero-glow flex flex-col items-center justify-center text-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#a88e5f]/8 to-transparent opacity-50"></div>

    <div class="max-w-5xl mx-auto space-y-8 z-10">
        <div class="inline-block px-4 py-2 border border-primary/30 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase text-primary bg-primary/10 mb-2">
            อัปเดตล่าสุด • ${CURRENT_MONTH} ${new Date().getFullYear() + 543}
        </div>
        
        <h1 class="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.15] text-white">
            <span class="block font-light tracking-tight">
                ไซด์ไลน์<span class="text-primary font-normal">${provinceName}</span>
            </span>
            <span class="block text-lg md:text-2xl mt-6 font-sans font-light tracking-[0.05em] text-white/70 max-w-3xl mx-auto leading-relaxed">
                แหล่งรวมน้องๆ <span class="text-white/80">งานพรีเมียม ตรงปก</span> 
                <span class="text-primary/80 italic">ไม่โอนมัดจำ</span>
            </span>
        </h1>
        
        <div class="flex flex-wrap justify-center gap-2 pt-8 max-w-3xl mx-auto">
            ${zones.slice(0, 8).map(z => `
                <a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" 
                   title="หาไซด์ไลน์ ${z} ${provinceName}"
                   class="text-[10px] px-5 py-2 rounded-full border border-white/10 font-medium tracking-widest hover:border-primary hover:text-primary text-white/50 hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm">
                   #${z.toUpperCase()}
                </a>
            `).join('')}
        </div>

        <p class="text-[10px] text-white/30 tracking-[0.15em] uppercase pt-4">
            <i class="fas fa-check-circle text-primary/50 mr-2"></i> 
            Verified ${safeProfiles.length} Profiles in ${provinceName}
        </p>
    </div>
</header>


<main class="container max-w-[1400px] mx-auto px-6 lg:px-12 pb-32">
    <div class="flex items-end justify-between mb-10 border-b border-white/10 pb-5">
        <h2 class="text-2xl md:text-3xl font-serif text-white tracking-wide">
            Exclusive <span class="text-primary italic">Profiles</span>
        </h2>
        <div class="flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-[#00cc66] animate-pulse"></span>
            <span class="text-[10px] text-white/50 tracking-[0.15em] uppercase font-medium">${safeProfiles.length} Online</span>
        </div>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-24">
        ${cardsHTML}
    </div>
</main>


<section class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-32 max-w-6xl mx-auto px-4">
    <div class="text-center group">
        <div class="w-14 h-14 mx-auto mb-5 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
            <i class="fas fa-shield-alt text-xl text-primary"></i>
        </div>
        <h3 class="text-[11px] font-bold tracking-[0.15em] uppercase text-white mb-3">No Deposit</h3>
        <p class="text-[10px] text-white/60 leading-relaxed font-light">จ่ายเงินที่หน้างานเท่านั้น ไม่มีการโอนมัดจำล่วงหน้า ปลอดภัย 100%</p>
    </div>
    <div class="text-center group">
        <div class="w-14 h-14 mx-auto mb-5 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
            <i class="fas fa-gem text-xl text-primary"></i>
        </div>
        <h3 class="text-[11px] font-bold tracking-[0.15em] uppercase text-white mb-3">Quality Verified</h3>
        <p class="text-[10px] text-white/60 leading-relaxed font-light">คัดกรองเฉพาะงานคุณภาพ ตรงปก พร้อมการดูแลระดับพรีเมียม</p>
    </div>
    <div class="text-center group">
        <div class="w-14 h-14 mx-auto mb-5 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
            <i class="fas fa-fingerprint text-xl text-primary"></i>
        </div>
        <h3 class="text-[11px] font-bold tracking-[0.15em] uppercase text-white mb-3">Privacy Focus</h3>
        <p class="text-[10px] text-white/60 leading-relaxed font-light">เราให้ความสำคัญกับความเป็นส่วนตัวของลูกค้าเป็นอันดับหนึ่ง</p>
    </div>
</section>


<div class="max-w-4xl mx-auto">
    ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
</div>


<footer class="border-t border-white/10 bg-[#050505] pt-20 pb-12 mt-20">
    <div class="container max-w-[1400px] mx-auto px-6 lg:px-12">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
            <div class="md:col-span-5 space-y-6">
                <h3 class="text-xl font-serif tracking-[0.2em] text-white uppercase">
                    SIDELINE<span class="text-primary italic ml-1">${provinceData.key.toUpperCase()}</span>
                </h3>
                <p class="text-[11px] text-white/70 leading-relaxed max-w-sm font-light tracking-wide">
                    Thailand's premium directory for elite adult entertainment. Curated profiles, secure experience.
                </p>
                <div class="flex gap-5">
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" aria-label="Twitter" class="text-white/70 hover:text-primary transition-all text-lg"><i class="fab fa-x-twitter"></i></a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="Line" class="text-white/70 hover:text-primary transition-all text-lg"><i class="fab fa-line"></i></a>
                </div>
            </div>

            <div class="md:col-span-3">
                <h4 class="text-[10px] font-bold text-white/70 tracking-[0.3em] uppercase mb-6">Navigation</h4>
                <ul class="space-y-3 text-[11px] text-white/80 font-medium uppercase tracking-widest">
                    <li><a href="/" class="hover:text-primary transition-colors">Home</a></li>
                    <li><a href="/profiles" class="hover:text-primary transition-colors">Directory</a></li>
                    <li><a href="/location/chiangmai" class="hover:text-primary transition-colors">Chiang Mai</a></li>
                </ul>
            </div>

            <div class="md:col-span-4">
                <h4 class="text-[10px] font-bold text-white/70 tracking-[0.3em] uppercase mb-6">Legal & Privacy</h4>
                <p class="text-[10px] text-white/70 leading-relaxed font-light mb-5 uppercase tracking-wider">
                    Models are independent contractors. You must be 20+ to enter.
                </p>
                <div class="inline-flex items-center gap-2 border border-primary/40 px-3 py-1.5 rounded-full text-[10px] text-primary uppercase tracking-[0.15em] font-semibold">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> 20+ Only
                </div>
            </div>
        </div>

        <div class="border-t border-white/10 pt-14 mb-16">
            <h4 class="text-[10px] font-bold text-white/70 tracking-[0.4em] uppercase mb-10 text-center">Service Coverage</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
                ${provinceLinksHtml}
            </div>
        </div>

        <div class="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-5 text-[10px] text-white/70 uppercase tracking-[0.25em] font-medium">
            <p>&copy; ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. LUXURY DIRECTORY.</p>
            <div class="flex gap-7">
                <a href="/terms" class="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">Terms</a>
                <a href="/privacy" class="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">Privacy</a>
            </div>
        </div>
    </div>
</footer>


<a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="fixed bottom-10 right-10 bg-[#070707] border border-white/20 hover:border-gold/50 p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:-translate-y-2 transition-all duration-500 z-[90] group">
    <div class="bg-[#06c755] rounded-full px-6 py-3 flex items-center gap-3">
        <i class="fab fa-line text-white text-2xl group-hover:scale-110 transition-transform"></i>
        <span class="text-[11px] text-white font-bold tracking-[0.2em] uppercase">Line Us</span>
    </div>
</a>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const nav = document.querySelector('nav');
        if (!nav) return;
        const handleScroll = () => {
            if (window.scrollY > 50) { 
                nav.classList.add('py-3', 'shadow-2xl');
                nav.style.background = 'rgba(7, 7, 7, 0.98)';
            } else { 
                nav.classList.remove('py-3', 'shadow-2xl');
                nav.style.background = 'rgba(7, 7, 7, 0.75)';
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    });
</script>
</body>
</html>`;  // <- ✅ backtick ก่อน semicolon

const cacheTtlSeconds = 60 * 5;
const staleTtlSeconds = 60 * 60;

const response = new Response(html, {
    headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": `public, max-age=0, s-maxage=${cacheTtlSeconds}, stale-while-revalidate=${staleTtlSeconds}, must-revalidate`,
        "Vary": "Cookie, Accept-Encoding",
    },
});

return response;