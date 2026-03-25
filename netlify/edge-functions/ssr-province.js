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
// ==========================================
// 2. PROGRAMMATIC SEO ENGINE (NORTHERN THAILAND FULL EDITION)
// ==========================================

// ==========================================
// NORTHERN THAILAND COMPLETE SEO DATA (15 PROVINCES)
// ==========================================

const NORTHERN_SEO_DATA = {
    // --- ภาคเหนือตอนบน (Upper North) ---
    'chiangmai': {
        zones: ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'คูเมือง', 'ศิริมังคลาจารย์', 'ท่าศาลา', 'อมก๋อย', 'สันทรายน้อย', 'หลัง มช.'],
        lsi: ['สาวเหนือ', 'นักศึกษา มช.', 'ขาวหมวยเชียงใหม่', 'ตัวท็อปเชียงใหม่', 'เด็กเอ็นเชียงใหม่', 'งานฟิวแฟนเชียงใหม่', 'น้องนิมมาน', 'ไซด์ไลน์เชียงใหม่'],
        hotels: ['โรงแรมแถวนิมมาน', 'ที่พักใกล้คูเมือง', 'คอนโดเจ็ดยอด', 'พูลวิลล่าหางดง', 'โรงแรมแถวช้างเผือก']
    },
    'chiangrai': {
        zones: ['ตัวเมืองเชียงราย', 'หน้า มฟล.', 'บ้านดู่', 'แม่สาย', 'หอนาฬิกา', 'เซ็นทรัลเชียงราย', 'ริมกก', 'แม่จัน', 'เทิง', 'เชียงของ'],
        lsi: ['สาวเชียงราย', 'เด็ก มฟล.', 'ขาวหมวยเหนือ', 'สาวดอยหลวง', 'ตัวท็อปเชียงราย', 'เพื่อนเที่ยวเชียงราย', 'ไซด์ไลน์เชียงราย'],
        hotels: ['ที่พักใกล้ มฟล.', 'โรงแรมตัวเมืองเชียงราย', 'รีสอร์ทแม่สาย', 'คอนโดแถวบ้านดู่']
    },
    'mae_hong_son': {
        zones: ['ตัวเมืองแม่ฮ่องสอน', 'ปาย', 'แม่สะเรียง', 'ขุนยวม'],
        lsi: ['สาวแม่ฮ่องสอน', 'สาวปาย', 'น้องน่ารักเมืองสามหมอก', 'สาวเหนือผิวขาว'],
        hotels: ['รีสอร์ทเมืองปาย', 'โรงแรมในเมืองแม่ฮ่องสอน']
    },
    'lampang': {
        zones: ['ตัวเมืองลำปาง', 'สวนดอก', 'สบตุ๋ย', 'หน้า ม.ราชภัฏ', 'เขลางค์นคร', 'ห้างฉัตร', 'แม่เมาะ', 'เกาะคา'],
        lsi: ['สาวลำปาง', 'เด็กเทคนิคลำปาง', 'ตัวท็อปลำปาง', 'สาวเหนือลำปาง', 'เพื่อนเที่ยวลำปาง'],
        hotels: ['โรงแรมในเมืองลำปาง', 'ที่พักใกล้ราชภัฏลำปาง', 'รีสอร์ทลำปาง']
    },
    'lamphun': {
        zones: ['ตัวเมืองลำพูน', 'นิคมอุตสาหกรรมลำพูน', 'ป่าซาง', 'บ้านกลาง'],
        lsi: ['สาวลำพูน', 'สาวโรงงานลำพูน', 'น้องลำพูนน่ารัก', 'ตัวท็อปลำพูน'],
        hotels: ['ที่พักใกล้บ้านกลาง', 'โรงแรมในเมืองลำพูน']
    },
    'phayao': {
        zones: ['หน้า ม.พะเยา', 'ริมกว๊านพะเยา', 'ตัวเมืองพะเยา', 'แม่กา', 'ดอกคำใต้'],
        lsi: ['สาวพะเยา', 'เด็ก มพ.', 'น้องพะเยาน่ารัก', 'ตัวท็อปพะเยา', 'เพื่อนเที่ยวพะเยา'],
        hotels: ['โรงแรมหน้า ม.พะเยา', 'ที่พักริมกว๊าน', 'รีสอร์ทพะเยา']
    },
    'nan': {
        zones: ['ตัวเมืองน่าน', 'ดู่ใต้', 'หน้าเทคนิคน่าน', 'ข่วงเมืองน่าน', 'ปัว'],
        lsi: ['สาวน่าน', 'สาวเหนือหน้าหวาน', 'ตัวท็อปน่าน', 'น้องน่านรับงาน'],
        hotels: ['โรงแรมในเมืองน่าน', 'บูทีคโฮเทลน่าน', 'ที่พักน่าน']
    },
    'phrae': {
        zones: ['ตัวเมืองแพร่', 'ทุ่งโฮ้ง', 'ประตูชัย', 'ยันตรกิจโกศล', 'เด่นชัย'],
        lsi: ['สาวแพร่', 'เด็กแพร่', 'ตัวท็อปแพร่', 'น้องแพร่ใจดี'],
        hotels: ['โรงแรมตัวเมืองแพร่', 'ที่พักใกล้ประตูชัย']
    },

    // --- ภาคเหนือตอนล่าง (Lower North) ---
    'phitsanulok': {
        zones: ['ม.นเรศวร', 'ท่าโพธิ์', 'ตัวเมืองพิษณุโลก', 'เซ็นทรัลพิษณุโลก', 'ริมน้ำน่าน', 'โคกมะตูม', 'สนามบินพิษณุโลก'],
        lsi: ['สาวสองแคว', 'เด็ก มน.', 'รับงานพิษณุโลก', 'พริตตี้พิษณุโลก', 'นักศึกษา มน.', 'ตัวท็อปพิษณุโลก'],
        hotels: ['โรงแรมใกล้ ม.นเรศวร', 'ที่พักในเมืองพิษณุโลก', 'คอนโดแถว มน.']
    },
    'nakhonsawan': {
        zones: ['ตัวเมืองนครสวรรค์', 'ปากน้ำโพ', 'หนองสมบุญ', 'ม.ราชภัฏนครสวรรค์', 'ริมน้ำเจ้าพระยา', 'พยุหะคีรี'],
        lsi: ['สาวปากน้ำโพ', 'เด็กนครสวรรค์', 'ตัวท็อปนครสวรรค์', 'พริตตี้นครสวรรค์', 'ไซด์ไลน์นครสวรรค์'],
        hotels: ['โรงแรมตัวเมืองนครสวรรค์', 'ที่พักใกล้หนองสมบุญ', 'คอนโดนครสวรรค์']
    },
    'uttaradit': {
        zones: ['ม.ราชภัฏอุตรดิตถ์', 'เกาะกลาง', 'ตัวเมืองอุตรดิตถ์', 'คลองโพ', 'ลับแล'],
        lsi: ['สาวอุตรดิตถ์', 'เด็กราชภัฏอุตรดิตถ์', 'น้องอุตรดิตถ์รับงาน', 'ตัวท็อปอุตรดิตถ์'],
        hotels: ['โรงแรมในอุตรดิตถ์', 'ที่พักใกล้ราชภัฏอุตรดิตถ์']
    },
    'tak': {
        zones: ['ตัวเมืองตาก', 'แม่สอด', 'ริมน้ำปิง', 'ย่านเศรษฐกิจแม่สอด', 'สามเงา'],
        lsi: ['สาวตาก', 'สาวแม่สอด', 'ตัวท็อปแม่สอด', 'รับงานแม่สอด', 'พริตตี้ตาก'],
        hotels: ['โรงแรมในเมืองตาก', 'ที่พักแม่สอด', 'โรงแรมใกล้ชายแดน']
    },
    'sukhothai': {
        zones: ['ตัวเมืองสุโขทัย', 'บ้านด่านลานหอย', 'สวรรคโลก', 'ศรีสัชนาลัย'],
        lsi: ['สาวสุโขทัย', 'น้องสุโขทัยน่ารัก', 'ตัวท็อปสุโขทัย', 'สาวเหนือตอนล่าง'],
        hotels: ['โรงแรมเมืองเก่าสุโขทัย', 'ที่พักตัวเมืองสุโขทัย']
    },
    'phetchabun': {
        zones: ['ตัวเมืองเพชรบูรณ์', 'เขาค้อ', 'หล่มสัก', 'วิเชียรบุรี', 'หนองไผ่'],
        lsi: ['สาวเพชรบูรณ์', 'สาวเขาค้อ', 'ตัวท็อปเพชรบูรณ์', 'น้องเพชรบูรณ์รับงาน'],
        hotels: ['รีสอร์ทเขาค้อ', 'โรงแรมในเมืองเพชรบูรณ์']
    },
    'phetchit': {
        zones: ['ตัวเมืองพิจิตร', 'ตะพานหิน', 'บางมูลนาก', 'โพทะเล'],
        lsi: ['สาวพิจิตร', 'น้องพิจิตรน่ารัก', 'ตัวท็อปพิจิตร'],
        hotels: ['โรงแรมในเมืองพิจิตร', 'ที่พักพิจิตร']
    },
    'kamphaengphet': {
        zones: ['ตัวเมืองกำแพงเพชร', 'คลองขลุง', 'ขาณุวรลักษบุรี', 'พรานกระต่าย'],
        lsi: ['สาวกำแพงเพชร', 'ตัวท็อปกำแพง', 'น้องกำแพงเพชรน่ารัก'],
        hotels: ['โรงแรมกำแพงเพชร', 'ที่พักริมแม่น้ำปิง']
    },
    'uhaithani': {
        zones: ['ตัวเมืองอุทัยธานี', 'หนองฉาง', 'หนองขาหย่าง'],
        lsi: ['สาวอุทัย', 'ตัวท็อปอุทัยธานี', 'น้องอุทัยน่ารัก'],
        hotels: ['โรงแรมในอุทัยธานี', 'ที่พักอุทัยธานี']
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

// ==========================================
// SEO GENERATOR (FIXED VERSION)
// ==========================================
const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    // ✅ FIX: แก้ syntax + ใช้ตัวแปรถูก
    const data = NORTHERN_SEO_DATA[provinceKey] || NORTHERN_SEO_DATA['default'];

    // ✅ FIX: กัน undefined ทุก field
    const safe = {
        lsi: data?.lsi || ['สาวสวย', 'น่ารัก', 'บริการดี', 'คุณภาพ', 'พรีเมียม'],
        zones: data?.zones || ['ตัวเมือง'],
        hotels: data?.hotels || ['โรงแรมในเมือง']
    };

    // ✅ FIX: SEO stable (ห้าม random)
    const spin = (arr) => {
        const index = Math.abs(hashCode(provinceKey)) % arr.length;
        return arr[index];
    };

    function hashCode(str) {
        return str.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    }
    
    // 1. กรณีไม่มีข้อมูล
    if (count === 0) {
        return `
            <div class="coming-soon-wrapper p-6 border-2 border-dashed border-gold/30 rounded-2xl text-center">
                <h2 class="text-2xl font-bold text-gold mb-3">🚀 กำลังเตรียมเปิดระบบใน ${provinceName}</h2>
                <p class="text-white/80 mb-4">เรากำลังคัดกรองน้องๆ <strong>${safe.lsi[0]}</strong> และ <strong>${safe.lsi[1]}</strong> ให้ได้คุณภาพระดับพรีเมียมที่สุด</p>
                <div class="flex flex-wrap justify-center gap-2 mb-4">
                    ${safe.zones.slice(0, 5).map(z => `<span class="text-xs bg-white/10 px-2 py-1 rounded">#${z}</span>`).join('')}
                </div>
                <p class="text-sm italic text-white/60">แอดไลน์เพื่อรับการแจ้งเตือนเมื่อมีน้องใหม่ในโซน ${safe.zones[0]} ทันที!</p>
            </div>
        `;
    }

    const h2_options = [
        `รวมพิกัด <strong>รับงาน${provinceName}</strong> น้องๆ <strong>${safe.lsi[0]}</strong> ตัวท็อป การันตีตรงปก`,
        `หาเด็ก <strong>ไซด์ไลน์${provinceName}</strong> พบกับ <strong>${safe.lsi[1]}</strong> เกรดพรีเมียม นัดง่าย 24 ชม.`,
        `ศูนย์รวม <strong>เด็กเอ็น${provinceName}</strong> และ <strong>${safe.lsi[2]}</strong> บริการดีที่สุดในพื้นที่`,
        `จ้างเที่ยว <strong>${provinceName}</strong> กับน้องๆ <strong>${safe.lsi[0]}</strong> ฟิวแฟน ดูแลดีระดับ VIP`
    ];

    const intro_options = [
        `สัมผัสประสบการณ์ความผ่อนคลายใน <strong>${provinceName}</strong> เรามีน้องๆ <strong>${safe.lsi[3]}</strong> และ <strong>${safe.lsi[4]}</strong> กว่า ${count} ท่าน พร้อมให้บริการคุณถึงที่ ไม่ว่าจะเป็นโซน <strong>${safe.zones.slice(0, 3).join(', ')}</strong> หรือนัดเจอกันที่ <strong>${safe.hotels[0]}</strong> ก็สะดวกสุดๆ`,
        `หากคุณกำลังมองหา <strong>รับงาน${provinceName}</strong> ที่ไว้ใจได้ เราคัดสรรน้องๆ <strong>${safe.lsi[1]}</strong> คุณภาพสูงมาให้เลือกเพียบ ครอบคลุมพิกัดยอดฮิต <strong>${safe.zones.slice(2, 5).join(', ')}</strong> นัดหมายง่ายๆ เพียงแจ้งพิกัด <strong>${safe.hotels[1] || safe.hotels[0]}</strong>`,
        `เบื่อไหมกับการหา <strong>ไซด์ไลน์${provinceName}</strong> แล้วไม่ตรงปก? เว็บเราเน้นงานคุณภาพ น้องๆ <strong>${safe.lsi[0]}</strong> ทุกคนผ่านการคัดโปรไฟล์ พร้อมสแตนบายโซน <strong>${safe.zones[0]}</strong> และ <strong>${safe.zones[1] || safe.zones[0]}</strong> ตลอดคืน`
    ];

    const safety_options = [
        `🛡️ <strong>มั่นใจได้ 100%:</strong> จ่ายเงินหน้างานเท่านั้น ไม่มีการโอนก่อน ปลอดภัยแน่นอน`,
        `⭐ <strong>บริการระดับมืออาชีพ:</strong> ฟิวแฟน ดูแลดี นัดง่ายทุกโซน`
    ];

    return `
        <article class="seo-container mb-8">
            <h2 class="text-xl md:text-3xl font-serif text-gold mb-6 leading-snug">${spin(h2_options)}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="text-white/70 leading-loose text-base">
                    ${spin(intro_options)}
                </div>
                <div class="bg-white/5 border border-gold/20 p-5 rounded-2xl shadow-inner shadow-black/40">
                    <p class="text-white/80 text-sm md:text-base italic leading-relaxed">
                        ${spin(safety_options)}
                    </p>
                    <div class="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gold/60">
                        <span>#รับงาน${provinceName}</span>
                        <span>#${safe.lsi[1]}</span>
                        <span>#VerifiedProfile</span>
                    </div>
                </div>
            </div>
        </article>
    `;
};

export default async (request, context) => {
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);

        const rawProvinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

        // ✅ FIX: validate input
        const allowedKeys = Object.keys(NORTHERN_SEO_DATA);
        const provinceKey = allowedKeys.includes(rawProvinceKey)
            ? rawProvinceKey
            : 'chiangmai';

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // ✅ FIX: handle error
        const { data: provinceData, error: provError } = await supabase
            .from('provinces')
            .select('id, nameThai, key')
            .eq('key', provinceKey)
            .maybeSingle();

        if (provError || !provinceData) return context.next();

        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate, isfeatured, lastUpdated, availability, created_at')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('lastUpdated', { ascending: false })
            .limit(80);

        if (profileError) {
            console.error(profileError);
        }

        const safeProfiles = profiles || [];
        const provinceName = provinceData.nameThai;

        // ✅ FIX: ใช้ตัวแปรถูก
        const seoData = NORTHERN_SEO_DATA[provinceKey] || NORTHERN_SEO_DATA['default'];
        const zones = seoData?.zones || ['ตัวเมือง'];

        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
            : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        // ✅ FIX: SEO stable
        const title = `${provinceName} น้องท็อป ${safeProfiles.length}+ รูปตรงปก`;
        const description = `${provinceName} ${safeProfiles.length}+ น้องนักศึกษา พริตตี้ รูปตรงปก ไม่ต้องโอนมัดจำ`;
        
        const keywords = [
            `${provinceName} น้องท็อป`,
            `ไซด์ไลน์${provinceName}`,
            `รับงานน้องนักศึกษา ${provinceName}`,
            `พริตตี้${provinceName}`,
            `${provinceName} รูปตรงปก`,
            `นางแบบ Event ${provinceName}`
        ].join(', ');

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
                const isAvailable = p.availability?.includes('รับงาน') ?? true;
                const statusText = isAvailable ? 'พร้อมรับงาน' : 'ว่าง';
                
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
                                <i class="fas fa-circle-check text-white"></i> ยืนยันตัวตน
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
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#d4af37">

    <!-- 🔥 ULTIMATE SEO -->
    <title>${provinceName} น้องท็อป ${safeProfiles.length}+ รูปตรงปก จ่ายหน้างาน | Sideline CM</title>
    <meta name="description" content="${provinceName} ${safeProfiles.length}+ น้องนักศึกษา พริตตี้ รูปตรงปก 100% ไม่ต้องโอนมัดจำ เริ่ม 1,500 บาท LINE ตอบ 5 นาที รับงาน 24 ชม.">
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, น้องนักศึกษา${provinceName}, พริตตี้${provinceName}, รูปตรงปก${provinceName}, ไม่มัดจำ${provinceName}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${provinceUrl}">

    <!-- Open Graph -->
    <meta property="og:title" content="${provinceName} - น้องท็อป ${safeProfiles.length}+ รูปตรงปก">
    <meta property="og:description" content="${provinceName} ${safeProfiles.length}+ น้องนักศึกษา พริตตี้ รูปตรงปก 100% ไม่ต้องโอนมัดจำ">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:locale" content="th_TH">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${provinceName} น้องท็อป ${safeProfiles.length}+">
    <meta name="twitter:site" content="@${CONFIG.TWITTER}">

    <!-- Fonts + Performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'">

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: { 
                extend: { 
                    colors: { gold: '#d4af37' }, 
                    fontFamily: { serif: ['Cinzel', 'serif'] }
                } 
            }
        }
    </script>

    <style>
        :root { --dark: #050505; --gold: #d4af37; --glass: rgba(15,15,15,0.95); }
        body { background: var(--dark); color: #f8f9fa; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
        .shimmer-gold { background: linear-gradient(135deg, #b38728 0%, #fbf5b7 45%, #d4af37 55%, #aa771c 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
        @keyframes shimmer { to { background-position: 200% center; } }
        .glass-ui { background: var(--glass); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }
        html { scroll-behavior: smooth; }
    </style>

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
</head>
<body>
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-[100] py-4 border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl transition-all duration-300">
        <div class="container mx-auto px-4 max-w-7xl flex justify-between items-center">
            <a href="/" class="text-2xl font-serif font-black tracking-widest shimmer-gold">Sideline CM</a>
            <div class="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-white/90">
                <a href="/" class="hover:text-gold">Home</a>
                <a href="/profiles" class="hover:text-gold">Directory</a>
                <span class="text-gold font-black">${provinceName}</span>
            </div>
            <a href="${CONFIG.SOCIAL_LINKS.line}" class="bg-[#06c755] hover:bg-[#05b34c] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2" aria-label="LINE สอบถามน้องๆ">
                <i class="fab fa-line"></i> LINE
            </a>
        </div>
    </nav>

    <!-- Hero -->
    <header class="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-black">
        <div class="absolute top-8 left-1/2 -translate-x-1/2 z-20">
            <div class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-xl px-6 py-3 rounded-3xl text-xs font-black uppercase tracking-widest text-white shadow-2xl border border-green-300/50">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                ✅ รูปตรงปก 100% | ไม่โอนมัดจำ | จ่ายหน้างาน
            </div>
        </div>

        <div class="relative z-20 max-w-6xl mx-auto space-y-8 px-4">
            <h1 class="font-serif font-black leading-none">
                <span class="block text-4xl md:text-6xl lg:text-7xl shimmer-gold drop-shadow-2xl mb-4">น้อง${provinceName}</span>
                <span class="block text-3xl md:text-5xl lg:text-6xl text-white/95 font-light italic mb-6">รูปตรงปก ${safeProfiles.length}+ คน</span>
                <span class="block text-xl md:text-2xl lg:text-3xl text-gold font-bold tracking-tight">เริ่มต้น • 1,500 บาท/ชั่วโมง • LINE ตอบ 5 นาที</span>
            </h1>

            <p class="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
                🔥 น้องนักศึกษา มช. • พริตตี้ Event • รับงาน 24 ชม.<br class="hidden md:block">
                <strong>โซนฮิต:</strong> ${seoData.zones.slice(0, 4).join(' • ')}
            </p>

            <div class="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
                <a href="#profiles" class="group bg-gradient-to-r from-gold to-orange-500 text-black px-12 py-6 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-4 w-full sm:w-auto">
                    <i class="fas fa-heart text-2xl group-hover:animate-bounce"></i>
                    ดูน้องๆ ${safeProfiles.length}+ คน
                </a>
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 hover:bg-green-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl hover:-translate-y-2 transition-all duration-300 ring-4 ring-green-400/30">
                    <i class="fab fa-line"></i>
                </a>
            </div>

            <p class="text-sm md:text-base text-white/80 uppercase tracking-wider font-bold flex flex-wrap justify-center items-center gap-4">
                <span>🔞 20+ เท่านั้น</span><span>•</span><span>⭐ 4.9/5 (${safeProfiles.length}+ รีวิว)</span><span>•</span><span>อัพเดท ${new Date().toLocaleDateString('th-TH')}</span>
            </p>
        </div>
    </header>

<main class="container mx-auto max-w-7xl py-8 px-4 relative z-10">
    
    <!-- 1️⃣ HERO BANNER (ดึงดูดทันที + SEO H1) -->
    <section class="mb-20 md:mb-32 relative overflow-hidden bg-gradient-to-br from-black via-purple-900/20 to-black py-20 md:py-32 rounded-[3rem]">
        <div class="container mx-auto max-w-7xl px-4 text-center relative z-10">
            <h1 class="text-4xl md:text-6xl font-serif font-black italic mb-6 bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent leading-tight">
                ไซด์ไลน์<span class="shimmer-gold">${provinceName}</span><br>เบอร์ 1 รับงานน้องท็อป
            </h1>
            <p class="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                รวบรวม ${provinceName} <strong>น้องนักศึกษา พริตตี้ นางแบบ</strong> คัดเฉพาะตัวท็อป รูปตรงปก ปลอดภัย 100% ไม่ต้องโอนมัดจำ เริ่มต้น <strong>1,500 บาท/ชั่วโมง</strong>
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <a href="#profiles" class="glass-ui px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gold/20 transition-all flex items-center gap-3 shadow-xl">
                    <i class="fas fa-search text-gold"></i> ดูน้องๆ ${safeProfiles.length}+ คน
                </a>
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="w-14 h-14 bg-green-500/90 hover:bg-green-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-2xl transition-all">
                    <i class="fab fa-line"></i>
                </a>
            </div>
            <p class="text-xs text-white/70 mt-8 uppercase tracking-wider font-bold">🔞 อายุ 20+ เท่านั้น | อัพเดทใหม่ทุกวัน ${new Date().toLocaleDateString('th-TH')}</p>
        </div>
    </section>

    <!-- 2️⃣ ข้อมูลสำคัญ + เวลารับงาน (Conversion สูง) -->
    <section class="mb-20 md:mb-32 bg-black/50 backdrop-blur-sm py-12 rounded-[3rem]">
        <div class="container mx-auto max-w-4xl px-4">
            <h2 class="text-3xl md:text-4xl font-serif text-center mb-12 shimmer-gold italic uppercase">รับงานเมื่อไหร่ได้บ้าง?</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div class="glass-ui p-8 md:p-10 rounded-[2.5rem] hover:scale-[1.02] transition-all">
                    <div class="text-4xl mb-6 mx-auto w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">🕒</div>
                    <h3 class="text-xl md:text-2xl font-bold mb-4 uppercase text-white">24 ชม. ทุกวัน</h3>
                    <p class="text-white/80 leading-relaxed">น้องพร้อมรับงานตลอด ยกเว้นดึกพิเศษ (01:00-06:00 ต้องแจ้งล่วงหน้า)</p>
                </div>
                <div class="glass-ui p-8 md:p-10 rounded-[2.5rem] hover:scale-[1.02] transition-all">
                    <div class="text-4xl mb-6 mx-auto w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">📱</div>
                    <h3 class="text-xl md:text-2xl font-bold mb-4 uppercase text-white">LINE ตอบไว</h3>
                    <p class="text-white/80 leading-relaxed"><strong>ตอบใน 5 นาที</strong> ทีมงานเช็คโปรไฟล์ก่อนนัด</p>
                </div>
                <div class="glass-ui p-8 md:p-10 rounded-[2.5rem] hover:scale-[1.02] transition-all">
                    <div class="text-4xl mb-6 mx-auto w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">💰</div>
                    <h3 class="text-xl md:text-2xl font-bold mb-4 uppercase text-white">ราคาเริ่มต้น</h3>
                    <p class="text-white/80 leading-relaxed">น้องนักศึกษา 1,500-2,500 | พริตตี้ 2,000-4,000 <strong>จ่ายหน้างาน</strong></p>
                </div>
            </div>
        </div>
    </section>

    <!-- 3️⃣ จุดเด่น (Trust Building) -->
    <section class="mb-20 md:mb-32" id="trust">
        <h2 class="text-2xl md:text-4xl font-serif text-center mb-12 md:mb-20 shimmer-gold italic uppercase">ทำไมลูกค้าเลือก Sideline ${provinceName}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="glass-ui p-10 rounded-[2.5rem] border-t border-white/20 group hover:border-gold/50 transition-all text-center hover:scale-[1.02]">
                <div class="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-all">
                    <i class="fas fa-shield-heart text-gold text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold mb-6 italic text-white uppercase">ปลอดภัย 100%</h3>
                <p class="text-white/80 text-sm leading-relaxed">ไม่โอนมัดจำ จ่ายเมื่อเจอน้องจริง ลูกค้า 5,000+ ใน${provinceName}</p>
            </div>
            <div class="glass-ui p-10 rounded-[2.5rem] border-t border-white/20 group hover:border-gold/50 transition-all text-center hover:scale-[1.02]">
                <div class="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-all">
                    <i class="fas fa-camera-retro text-gold text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold mb-6 italic text-white uppercase">รูปตรงปก</h3>
                <p class="text-white/80 text-sm leading-relaxed">วิดีโอ Live + รูปยืนยันตัวตน <strong>ไม่ตรงคืนเงินเต็ม</strong></p>
            </div>
            <div class="glass-ui p-10 rounded-[2.5rem] border-t border-white/20 group hover:border-gold/50 transition-all text-center hover:scale-[1.02]">
                <div class="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-all">
                    <i class="fas fa-star text-gold text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold mb-6 italic text-white uppercase">น้องท็อป</h3>
                <p class="text-white/80 text-sm leading-relaxed"><strong>นักศึกษา มช. พริตตี้ Event</strong> 200+ อัพเดทรายวัน</p>
            </div>
        </div>
    </section>

    <!-- 4️⃣ SEO Content Block + พิกัด (Above the fold) -->
    <section class="mb-16 md:mb-24 glass-ui rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 text-center relative overflow-hidden shadow-2xl">
        <div class="max-w-4xl mx-auto relative z-10 text-readable">
            ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
        </div>
        <div class="mt-12 border-t border-white/20 pt-10">
            <h3 class="text-sm font-bold text-white/90 uppercase tracking-[0.3em] mb-8 italic">📍 พิกัดบริการยอดฮิตใน${provinceName}</h3>
            <div class="flex flex-wrap justify-center gap-2 md:gap-4 max-w-4xl mx-auto">
                ${zones.map(z => `
                    <a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" 
                       aria-label="รับงานโซน ${z} ${provinceName}" 
                       class="text-xs md:text-sm px-4 md:px-5 py-2.5 md:py-3 rounded-full border border-white/30 font-bold uppercase tracking-widest bg-white/5 hover:bg-gold hover:text-black transition-all shadow-sm hover:shadow-gold/25 text-white">
                       #${z}
                    </a>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- 5️⃣ น้องๆ Grid (Core Content - ต้องชัดเด่น) -->
    <section id="profiles">
        <div class="flex items-center justify-between mb-12 md:mb-20">
            <h2 class="text-3xl md:text-5xl font-serif font-black italic shimmer-gold uppercase">
                น้องๆ ${safeProfiles.length}+ คน <span class="text-xl block text-white/70 font-normal">พร้อมรับงานวันนี้</span>
            </h2>
            <a href="${CONFIG.SOCIAL_LINKS.line}" class="glass-ui px-6 py-3 rounded-2xl font-bold hover:bg-gold/20 transition-all hidden md:flex items-center gap-2">
                <i class="fas fa-line text-green-400"></i> จองคิวเลย
            </a>
        </div>
        
        <!-- Listing Grid สวยงาม Responsive -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-20 md:mb-32">
            ${cardsHTML}
        </div>
    </section>

    <!-- 6️⃣ FAQ (SEO + UX สุดยอด) -->
    <section class="mb-20 md:mb-32">
        <h2 class="text-2xl md:text-4xl font-serif text-center mb-12 md:mb-20 shimmer-gold italic uppercase">คำถามที่พบบ่อย</h2>
        <div class="glass-ui p-10 md:p-16 rounded-[3rem] max-w-5xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <details class="faq-item group cursor-pointer">
                    <summary class="faq-question py-6 px-4 font-bold text-xl text-white hover:text-gold transition-all flex items-center gap-4 group-open:bg-white/5 group-open:rounded-t-[1.5rem]">
                        <i class="fas fa-plus-circle text-gold text-2xl group-open:hidden transition-all"></i>
                        <i class="fas fa-minus-circle text-gold text-2xl hidden group-open:block transition-all"></i>
                        ต้องโอนเงินมัดจำไหม?
                    </summary>
                    <div class="faq-answer mt-2 pt-6 pb-6 px-6 border-t border-white/20 text-white/90 text-base leading-relaxed bg-white/2 rounded-b-[1.5rem]">
                        ❌ <strong>ไม่ต้องโอน!</strong> จ่ายเงินเมื่อเจอน้องจริงเท่านั้น ป้องกันมิจฉาชีพ 100% ลูกค้าทุกคนปลอดภัย
                    </div>
                </details>
                <details class="faq-item group cursor-pointer">
                    <summary class="faq-question py-6 px-4 font-bold text-xl text-white hover:text-gold transition-all flex items-center gap-4 group-open:bg-white/5 group-open:rounded-t-[1.5rem]">
                        <i class="fas fa-plus-circle text-gold text-2xl group-open:hidden transition-all"></i>
                        <i class="fas fa-minus-circle text-gold text-2xl hidden group-open:block transition-all"></i>
                        รูปน้องตรงกับคนจริงไหม?
                    </summary>
                    <div class="faq-answer mt-2 pt-6 pb-6 px-6 border-t border-white/20 text-white/90 text-base leading-relaxed bg-white/2 rounded-b-[1.5rem]">
                        ✅ <strong>ตรงปก 100%!</strong> ตรวจสอบวิดีโอ Live + รูปยืนยันตัวตน ไม่ตรงปกยกเลิกได้ทันที คืนเงินเต็มจำนวน
                    </div>
                </details>
                <details class="faq-item group cursor-pointer">
                    <summary class="faq-question py-6 px-4 font-bold text-xl text-white hover:text-gold transition-all flex items-center gap-4 group-open:bg-white/5 group-open:rounded-t-[1.5rem]">
                        <i class="fas fa-plus-circle text-gold text-2xl group-open:hidden transition-all"></i>
                        <i class="fas fa-minus-circle text-gold text-2xl hidden group-open:block transition-all"></i>
                        รับงานกี่โมง?
                    </summary>
                    <div class="faq-answer mt-2 pt-6 pb-6 px-6 border-t border-white/20 text-white/90 text-base leading-relaxed bg-white/2 rounded-b-[1.5rem]">
                        ⏰ <strong>24 ชม. ทุกวัน</strong> แต่ออกดึก (01:00-06:00) ต้องแจ้งล่วงหน้า 2 ชม. เพื่อความปลอดภัยสูงสุด
                    </div>
                </details>
                <details class="faq-item group cursor-pointer">
                    <summary class="faq-question py-6 px-4 font-bold text-xl text-white hover:text-gold transition-all flex items-center gap-4 group-open:bg-white/5 group-open:rounded-t-[1.5rem]">
                        <i class="fas fa-plus-circle text-gold text-2xl group-open:hidden transition-all"></i>
                        <i class="fas fa-minus-circle text-gold text-2xl hidden group-open:block transition-all"></i>
                        ราคาเท่าไหร่?
                    </summary>
                    <div class="faq-answer mt-2 pt-6 pb-6 px-6 border-t border-white/20 text-white/90 text-base leading-relaxed bg-white/2 rounded-b-[1.5rem]">
                        💰 <strong>น้องนักศึกษา 1,500-2,500 | พริตตี้ 2,000-4,000</strong> บาท/ชั่วโมง จ่ายหน้างาน ไม่มีค่าบริการเพิ่ม
                    </div>
                </details>
            </div>
        </div>
    </section>

    <!-- 7️⃣ Testimonials (Social Proof สุดๆ) -->
    <section class="mb-20 md:mb-32">
        <h2 class="text-2xl md:text-4xl font-serif text-center mb-12 md:mb-20 shimmer-gold italic uppercase">ลูกค้าบอกว่ายังไง</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="glass-ui p-10 rounded-[2.5rem] text-center italic border-t-4 border-gold/50 hover:scale-[1.02] transition-all">
                <div class="text-4xl mb-6 flex justify-center">⭐⭐⭐⭐⭐</div>
                <p class="text-white/95 mb-6 text-lg leading-relaxed">"น้องตรงปกมาก! บริการดีสุดใน${provinceName} LINE ตอบไว จ่ายหน้างานสบายใจสุดๆ"</p>
                <span class="text-gold font-bold text-base uppercase block">- พี่เอก, สมาชิก VIP</span>
            </div>
            <div class="glass-ui p-10 rounded-[2.5rem] text-center italic border-t-4 border-gold/50 hover:scale-[1.02] transition-all">
                <div class="text-4xl mb-6 flex justify-center">⭐⭐⭐⭐⭐</div>
                <p class="text-white/95 mb-6 text-lg leading-relaxed">"พริตตี้คุณภาพ ฟิวแฟนดีเยี่ยม ทีมงานเช็คให้ละเอียด ไว้ใจได้ 10/10"</p>
                <span class="text-gold font-bold text-base uppercase block">- เจ้าของอีเวนต์</span>
            </div>
            <div class="glass-ui p-10 rounded-[2.5rem] text-center italic border-t-4 border-gold/50 hover:scale-[1.02] transition-all">
                <div class="text-4xl mb-6 flex justify-center">⭐⭐⭐⭐⭐</div>
                <p class="text-white/95 mb-6 text-lg leading-relaxed">"น้องนักศึกษาน่ารัก รูปจริง ราคาคุ้ม ใช้ประจำทุกสัปดาห์เลยครับ"</p>
                <span class="text-gold font-bold text-base uppercase block">- สมาชิกประจำ</span>
            </div>
        </div>
    </section>
</main>

<!-- FAB LINE สุดเด่น -->
<a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="จองคิวน้องๆ ${provinceName} ทันที"
   class="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-[#06c755] to-[#04a045] rounded-3xl flex items-center justify-center text-white text-2xl md:text-3xl shadow-[0_20px_40px_rgba(6,199,85,0.4)] hover:-translate-y-3 hover:scale-110 transition-all duration-300 z-[999] border-4 border-white/20 hover:border-gold/50">
    <i class="fab fa-line"></i>
    <span class="absolute -top-2 -right-2 w-6 h-6 md:w-7 md:h-7 bg-red-600 border-3 border-black rounded-full animate-pulse flex items-center justify-center text-xs md:text-sm font-black shadow-lg">HOT</span>
</a>






<script>
document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav?.classList.add('bg-[#050505]/95', 'py-2', 'backdrop-blur-md', 'border-b-white/10');
            nav?.classList.remove('py-4', 'border-transparent');
        } else {
            nav?.classList.remove('bg-[#050505]/95', 'py-2', 'backdrop-blur-md', 'border-b-white/10');
            nav?.classList.add('py-4', 'border-transparent');
        }
    }, { passive: true });

    // Smooth Scroll to Profiles
    document.querySelectorAll('a[href="#profiles"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('profiles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});
</script>

</body>
</html>`;



        return new Response(html, { 
            headers: { 
                "Content-Type": "text/html; charset=utf-8", 

                // ✅ FIX: cache ดีขึ้น
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",

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