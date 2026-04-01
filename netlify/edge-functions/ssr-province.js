import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. SYSTEM CONFIGURATION & DATA (ปรับปรุง SEO & Uniqueness)
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
        intents:['ชั่วคราว', 'ค้างคืน', 'เพื่อนเที่ยวคาเฟ่', 'N-VIP ชงเหล้า', 'ปาร์ตี้พูลวิลล่า'],
        traits:['ผิวขาวจั๊วะ', 'หน้าหมวย', 'ตัวเล็กสเปคป๋า', 'หุ่นนางแบบ', 'พูดเหนืออ้อนๆ', 'หน้าอกตู้ม'],
        hotels:['โรงแรมแถวนิมมาน', 'ที่พักใกล้คูเมือง', 'คอนโดเจ็ดยอด', 'รีสอร์ทแม่ริม'],
        services:['รับงานชั่วคราว-ค้างคืน', 'ดูแลฟิวแฟนเดินนิมมาน', 'ปาร์ตี้พูลวิลล่าเชียงใหม่', 'นวดผ่อนคลายส่วนตัว'],
        avgPrice: "1,500 - 4,000",
        uniqueIntro: "เชียงใหม่ไม่ได้มีดีแค่คาเฟ่และยอดดอย แต่ที่นี่ยังเป็นศูนย์รวมน้องๆ สาวเหนือผิวขาวออร่า พูดจาเจ้าคะเจ้าขา ที่พร้อมดูแลคุณแบบฟิวแฟนคลุกวงใน ไม่ว่าคุณจะพักอยู่โซนนิมมาน สันติธรรม หรือรีสอร์ทส่วนตัว เรามีทั้งน้องนักศึกษา มช. และพริตตี้ท้องถิ่นที่ผ่านการสกรีนความตรงปกมาแล้ว 100%",
        faqs:[
            { q: "หาไซด์ไลน์เชียงใหม่ โซนไหนเดินทางสะดวกสุด?", a: "โซนนิมมาน สันติธรรม และเจ็ดยอด เป็นโซนที่น้องๆ รับงานเยอะที่สุด และมีโรงแรมระดับพรีเมียมรองรับมากมาย" },
            { q: "น้องๆ รับงานเชียงใหม่ มีโปรไฟล์แบบไหนบ้าง?", a: "เรามีตั้งแต่น้องนักศึกษา ไปจนถึงนางแบบสาวเหนือผิวขาวออร่า การันตีความตรงปกและมารยาทระดับ VIP ทุกคน" }
        ]
    },
    'bangkok': {
        zones:['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย', 'ปิ่นเกล้า'],
        lsi:['พริตตี้ กทม.', 'นางแบบสาว', 'ตัวท็อปกรุงเทพ', 'เด็กเอ็น', 'ฟิวแฟนคลุกวงใน', 'รับงานกรุงเทพ', 'ไซด์ไลน์ กทม'],
        intents:['ชั่วคราว', 'ค้างคืน', 'N-Vip ขึ้นห้อง', 'เพื่อนเที่ยวทองหล่อ', 'ปาร์ตี้ไพรเวท'],
        traits:['ลูกคุณหนู', 'สายฝอ', 'ศัลยกรรมเป๊ะ', 'หุ่นสับ', 'เอาใจเก่ง', 'ลุคพนักงานออฟฟิศ'],
        hotels:['คอนโดติด BTS', 'โรงแรมย่านสุขุมวิท', 'ที่พักห้วยขวาง'],
        services:['ดูแลแบบฟิวแฟนเต็มรูปแบบ', 'เพื่อนเที่ยวกลางคืนทองหล่อ', 'รับงาน N-Vip'],
        avgPrice: "2,000 - 5,000+",
        uniqueIntro: "เมืองหลวงแห่งแสงสี ที่นี่คือศูนย์รวมตัวท็อปพรีเมียมที่สุดของประเทศ รับงานกรุงเทพครอบคลุมตั้งแต่สุขุมวิท ทองหล่อ ยันรัชดานัดง่าย เดินทางสะดวกด้วย BTS/MRT คัดเน้นๆ เฉพาะงานคุณภาพระดับ VIP ปลอดภัย ไร้กังวลเรื่องมิจฉาชีพ",
        faqs:[
            { q: "เด็กเอ็นกรุงเทพ ส่วนใหญ่รับงานโซนไหน?", a: "โซนยอดฮิตคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ นัดหมายตามคอนโดหรูติด BTS/MRT ได้สะดวก" },
            { q: "ความปลอดภัยในการเรียกไซด์ไลน์ กทม.?", a: "เราเน้นระบบ 'ไม่โอนมัดจำ' ลูกค้าเจอตัวน้อง จ่ายเงินหน้างานเท่านั้น ป้องกันมิจฉาชีพ 100%" }
        ]
    },
    'default': {
        zones:['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู'],
        lsi:['นักศึกษา', 'พริตตี้พาร์ทไทม์', 'หุ่นนางแบบ', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน'],
        intents:['ชั่วคราว', 'ค้างคืน', 'เพื่อนเที่ยว', 'ฟิวแฟน'],
        traits:['หน้าตาน่ารัก', 'หุ่นดี', 'เอาใจเก่ง', 'บริการประทับใจ'],
        hotels: ['โรงแรมในตัวเมือง', 'รีสอร์ทส่วนตัว'],
        services:['ฟิวแฟนส่วนตัว', 'เพื่อนเที่ยว-ดูหนัง', 'นวดผ่อนคลาย'],
        avgPrice: "1,500 - 3,500",
        uniqueIntro: "หากคุณกำลังมองหาช่วงเวลาการพักผ่อนเหนือระดับ เรารวบรวมน้องๆ เกรดพรีเมียมที่ผ่านการคัดสรรอย่างเข้มงวด การันตีความตรงปก 100% พร้อมให้บริการในพื้นที่ นัดหมายได้อย่างเป็นส่วนตัว ปลอดภัย ไม่มีการบังคับโอนมัดจำ",
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
// 2. SEO HTML GENERATION (Local Hub Content)
// ==========================================
const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    
    return `
    <article class="text-left space-y-16 text-white/70 leading-loose font-light px-4 md:px-8">
        
        <section class="text-center max-w-4xl mx-auto">
            <h2 class="text-2xl md:text-4xl font-serif text-white mb-6 tracking-wide">
                สัมผัสประสบการณ์ <span class="text-gold italic">ไซด์ไลน์${provinceName}</span> ระดับพรีเมียม
            </h2>
            <div class="w-12 h-[1px] bg-gold/50 mx-auto mb-8"></div>
            <p class="text-sm md:text-base md:leading-relaxed text-white/80">
                ${data.uniqueIntro}
            </p>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-white/5 py-12 my-12">
            <div>
                <h3 class="text-xl font-serif text-gold mb-6 tracking-wide">เรทราคาเฉลี่ยใน${provinceName}</h3>
                <p class="text-sm mb-6">จากข้อมูลน้องๆ <strong>${count} คน</strong> ที่พร้อมรับงานในระบบของเรา เรทราคามาตรฐานอยู่ที่ประมาณ:</p>
                <div class="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
                    <div class="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                        <span class="text-white/90">เรทเริ่มต้น (ชั่วคราว)</span>
                        <span class="text-gold font-medium">~ 1,500 ฿</span>
                    </div>
                    <!-- 💡 แก้ไขส่วนนี้เป็น "ติดต่อสอบถาม" -->
                    <div class="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                        <span class="text-white/90">เรทค้างคืน / ฟิวแฟน</span>
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="text-gold font-medium text-sm hover:text-white transition-colors underline decoration-gold/30 underline-offset-4">ติดต่อสอบถาม</a>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-white/90">เรท N-VIP / พูลวิลล่า</span>
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="text-gold font-medium text-sm hover:text-white transition-colors underline decoration-gold/30 underline-offset-4">ติดต่อสอบถาม</a>
                    </div>
                </div>
                <p class="text-[10px] text-white/40 mt-3">* ราคาอาจเปลี่ยนแปลงตามข้อตกลงและโปรไฟล์ของน้องแต่ละคน</p>
            </div>
            
            <div>
                <h3 class="text-xl font-serif text-gold mb-6 tracking-wide">คู่มือเจาะลึกโซน (Zone Guide)</h3>
                <p class="text-sm mb-6">พื้นที่ยอดฮิตสำหรับการนัดหมายที่ปลอดภัยและเดินทางสะดวกที่สุด:</p>
                <div class="space-y-4">
                    ${data.zones.slice(0, 3).map((zone, idx) => `
                        <div class="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl">
                            <div class="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 font-serif">${idx + 1}</div>
                            <div>
                                <h4 class="font-medium text-white text-sm">โซน${zone}</h4>
                                <p class="text-xs text-white/50 mt-1">แหล่งรวมโรงแรมและ ${data.hotels[0] || 'ที่พักส่วนตัว'} เหมาะสำหรับการนัดหมายน้องๆ สาย${data.lsi[idx % data.lsi.length]} อย่างเป็นส่วนตัว</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section class="max-w-4xl mx-auto bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl">
            <h3 class="text-lg font-serif text-gold mb-6 tracking-widest uppercase text-center">Premium Services</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${data.services.map(srv => `
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check text-gold/60 text-xs"></i>
                        <span class="text-sm text-white/80">${srv}</span>
                    </div>
                `).join('')}
            </div>
        </section>

        <section class="pt-8">
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

        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province");
            const cleanUrl = new URL(`/location/${provinceValue}`, url.origin);
            return Response.redirect(cleanUrl.toString(), 301); 
        }

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

        const { data: allProvinces } = await supabase
            .from('provinces')
            .select('key, nameThai')
            .order('nameThai', { ascending: true });

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
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} ตัวท็อป ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก 100% ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด จ่ายหน้างาน`;

        const provinceLinksHtml = allProvinces && allProvinces.length > 0 
            ? allProvinces.map(p => `
                <a href="/location/${p.key}" 
                   class="text-[10px] text-white/70 hover:text-gold transition-all duration-300 border-b border-transparent hover:border-gold/30 pb-0.5 py-1.5 whitespace-nowrap">
                   ไซด์ไลน์${p.nameThai}
                </a>
            `).join('')
            : '';

        // [เตรียมตัวแปร Authority] แสดงเวลาที่เว็บไซต์ถูกอัปเดตล่าสุดจริงๆ
        const latestUpdateDate = safeProfiles.length > 0 && safeProfiles[0].lastUpdated 
            ? new Date(safeProfiles[0].lastUpdated).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

        // Schema ปลอดภัย ลบ AggregateRating ปลอมออก
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
                    "name": `ไซด์ไลน์${provinceName} - รับงานตรงปกพรีเมียม`,
                    "url": provinceUrl,
                    "image": firstImage,
                    "description": description,
                    "telephone": "ติดต่อผ่าน Line Official",
                    "priceRange": "฿1500 - ฿5000+",
                    "areaServed": { "@type": "State", "name": provinceName },
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
                    "itemListElement":[
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
                    "mainEntity":[
                        {
                            "@type": "Question",
                            "name": `บริการไซด์ไลน์${provinceName} ต้องโอนมัดจำไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่มีการโอนมัดจำล่วงหน้าทุกกรณี ลูกค้าจ่ายเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น ปลอดภัย 100%" }
                        },
                        {
                            "@type": "Question",
                            "name": `น้องๆ ใน${provinceName} รับงานโซนไหนบ้าง?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `ครอบคลุมโซนยอดนิยม เช่น ${zones.slice(0, 5).join(', ')} และโรงแรมชั้นนำในตัวเมือง นัดง่ายเดินทางสะดวก` }
                        }
                    ]
                }
            ]
        };

        let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                const cleanName = (p.name || 'สาวสวย').replace(/^(น้อง\s?)/, '');
                const profileLocation = p.location || provinceName || 'ไม่ระบุพิกัด';
                
                const busyKeywords =['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'];
                let isAvailable = true;
                if (p.availability) {
                    const availText = p.availability.toLowerCase();
                    isAvailable = !busyKeywords.some(kw => availText.includes(kw));
                }
                const statusText = isAvailable ? 'พร้อมรับงาน' : 'ติดจอง';

                const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
                const d = new Date(dateStr);
                const months =['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
                const dateDisplay = `${d.getDate()} ${months[d.getMonth()]} ${(d.getFullYear() + 543).toString().slice(-2)}`;
                
                const intents = seoData.intents ||['รับงานชั่วคราว', 'รับงานค้างคืน', 'เพื่อนเที่ยว', 'ฟิวแฟน'];
                const traits = seoData.traits ||['น่ารัก', 'หุ่นดี', 'เอาใจเก่ง', 'บริการประทับใจ'];
                const lsiKeywords = seoData.lsi ||[`ไซด์ไลน์${provinceName}`, `รับงาน${provinceName}`, `เด็กเอ็น${provinceName}`];
                
                const targetIntent = intents[i % intents.length];
                const targetTrait = traits[i % traits.length];
                const targetKeyword = lsiKeywords[i % lsiKeywords.length];
                
                const imgAlt = `รับงาน${profileLocation} น้อง${cleanName} สไตล์${targetTrait} บริการ${targetIntent} ปลอดภัยไม่โอนมัดจำ`;
                const profileLink = `/sideline/${p.slug || p.id || '#'}`;

                let badgeHTML = '';
                const rateNum = p.rate ? parseInt(String(p.rate).replace(/\D/g, '')) : 0;
                
                if (rateNum >= 4000) {
                    badgeHTML = `<span class="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(168,85,247,0.4)]">VIP Class</span>`;
                } else if (i < 3 && p.isfeatured) {
                    badgeHTML = `<span class="bg-gradient-to-r from-orange-600 to-red-600 text-white text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(234,88,12,0.4)]">Trending</span>`;
                } else if (p.isfeatured || rateNum >= 2500) {
                    badgeHTML = `<span class="bg-gold/20 text-gold border border-gold/30 text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase backdrop-blur-sm">Recommend</span>`;
                } else {
                    badgeHTML = `<span class="bg-white/10 text-white/80 border border-white/10 text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase backdrop-blur-sm">Verified</span>`;
                }
                
                return `
<article itemscope itemtype="http://schema.org/Person" class="group relative bg-[#0d0d0d] rounded-[1.25rem] overflow-hidden border border-white/10 flex flex-col h-full transition-all duration-500 hover:border-gold/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]" data-profile-id="${p.id}">
    <a href="${profileLink}" itemprop="url" class="absolute inset-0 z-40" aria-label="ดูโปรไฟล์ของ ${cleanName}" title="ดูโปรไฟล์ของ ${cleanName}"></a>
    
    <div class="relative w-full pt-[135%] bg-[#050505] overflow-hidden">
        <img itemprop="image" 
             src="${optimizeImg(p.imagePath, 450, 600)}" 
             alt="${imgAlt}" 
             title="${imgAlt}"
             class="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-[1.01] group-hover:scale-110 group-hover:rotate-1" 
             ${i < 4 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} 
             width="450" height="600">
        
        <div class="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/40 z-10"></div>
        
        <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
            <div class="flex items-center gap-2 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/20 shadow-2xl">
                <span class="relative flex h-1.5 w-1.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-500'} opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-1.5 w-1.5 ${isAvailable ? 'bg-emerald-400' : 'bg-rose-500'}"></span>
                </span>
                <span class="text-[9px] text-white font-bold tracking-widest uppercase">${statusText}</span>
            </div>
            ${badgeHTML}
        </div>
    </div>

    <div class="px-5 pb-5 pt-0 flex-1 flex flex-col justify-between relative z-20 -mt-12">
        <div>
            <div class="flex justify-between items-end mb-4">
                <div class="flex flex-col pr-2">
                    <span class="text-[9px] text-gold font-bold tracking-[0.2em] uppercase mb-1 opacity-100 line-clamp-1">${targetKeyword}</span>
                    <h3 itemprop="name" class="font-serif font-medium text-2xl text-white group-hover:text-gold transition-colors line-clamp-1 tracking-wide drop-shadow-lg">
                        ${cleanName}
                    </h3>
                </div>
                <div class="bg-[#059641]/20 backdrop-blur-md px-2 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#059641]/30 mb-1" title="ยืนยันตัวตนแล้ว">
                    <i class="fas fa-shield-check text-[#059641] text-[10px]"></i>
                    <span class="text-[#059641] text-[10px] font-bold tracking-tighter uppercase">ตรงปก</span>
                </div>
            </div>

            <div class="space-y-2 mb-5 border-t border-white/10 pt-4">
                <div itemprop="homeLocation" class="text-[11px] text-white/70 font-light flex items-center gap-3">
                    <i class="fas fa-map-marker-alt text-gold/80 w-3 text-center"></i>
                    <span class="truncate tracking-wide">${profileLocation}</span>
                </div>
                <div class="text-[11px] text-white/50 font-light flex items-center gap-3">
                    <i class="far fa-clock w-3 text-center text-white/40"></i>
                    <span>อัปเดตเมื่อ ${dateDisplay}</span>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between pt-1 group/btn border-t border-white/5 pt-3">
            <div class="flex flex-col">
                <span class="text-[8px] text-white/50 uppercase tracking-[0.2em]">${targetIntent} เริ่มต้น</span>
                <span class="text-sm font-bold text-white tracking-tight text-gold">฿${p.rate || 'สอบถาม'}</span>
            </div>
            <div class="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:border-gold group-hover:bg-gold/10 group-hover:text-gold transition-all duration-500 group-hover:translate-x-1">
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
    :root { 
        --bg: #070707; 
        --gold: #C5A059; 
        --gold-light: #D4AF37;
        --text-main: #FFFFFF;
        --text-muted: #BCBCBC; 
        --line-green: #059641; 
    }

    body { 
        background-color: var(--bg); 
        color: var(--text-main); 
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        margin: 0;
        font-family: 'Outfit', 'Prompt', system-ui, -apple-system, sans-serif;
        line-height: 1.5;
        text-rendering: optimizeSpeed;
    }

    .nav-glass {
        background: rgba(7, 7, 7, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        will-change: transform, background; 
    }

    .nav-scrolled {
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
        background: rgba(7, 7, 7, 0.95) !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .hero-glow {
        background: radial-gradient(circle at 50% 0%, rgba(197, 160, 89, 0.15) 0%, rgba(7, 7, 7, 0) 75%);
        contain: paint; 
    }

    .profile-card-shadow {
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.6);
        transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        will-change: transform;
        backface-visibility: hidden; 
    }
    
    .profile-card-shadow:hover { 
        transform: translateY(-8px) scale(1.01); 
    }

    .line-float-btn {
        width: 155px; 
        height: 50px;
        contain: layout size;
    }
    .line-bg-optimized {
        background-color: var(--line-green);
        box-shadow: 0 15px 45px rgba(5, 150, 65, 0.3);
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { 
        background: #333; 
        border-radius: 10px;
        transition: background 0.3s;
    }
    ::-webkit-scrollbar-thumb:hover { background: var(--gold); }

    .text-low-contrast { color: var(--text-muted); } 
    .text-very-low-contrast { color: rgba(255, 255, 255, 0.5); }

    img {
        max-width: 100%;
        height: auto;
        font-style: italic; 
        vertical-align: middle;
        shape-margin: 0.75rem;
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
                แหล่งรวมน้องๆ รับงานไซด์ไลน์ <span class="text-white/80">งานพรีเมียม ตรงปก</span> 
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

<!-- REALTIME STATS BAR (Authority E-E-A-T) -->
<div class="border-y border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md relative z-20 mb-16">
    <div class="container mx-auto px-6 max-w-5xl">
        <div class="grid grid-cols-3 divide-x divide-white/10 py-6">
            <div class="text-center px-2">
                <div class="text-xl md:text-3xl font-serif text-gold">${safeProfiles.length}</div>
                <div class="text-[9px] md:text-[11px] text-white/50 uppercase tracking-widest mt-1">น้องๆ พร้อมรับงาน</div>
            </div>
            <div class="text-center px-2">
                <div class="text-xl md:text-3xl font-serif text-white">${latestUpdateDate}</div>
                <div class="text-[9px] md:text-[11px] text-white/50 uppercase tracking-widest mt-1">อัปเดตสถานะล่าสุด</div>
            </div>
            <div class="text-center px-2">
                <div class="text-xl md:text-3xl font-serif text-emerald-500">100%</div>
                <div class="text-[9px] md:text-[11px] text-white/50 uppercase tracking-widest mt-1">รับประกันไม่โอนมัดจำ</div>
            </div>
        </div>
    </div>
</div>

    <main class="container mx-auto px-6 lg:px-12 max-w-[1400px] pb-32">
        <div class="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
            <h2 class="text-2xl md:text-3xl font-serif text-white tracking-wide">
                โปรไฟล์น้องๆ <span class="text-gold italic">รับงาน</span>
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
                    ไซด์ไลน์<span class="text-gold italic ml-1">${provinceData.key.toUpperCase()}</span>
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
                    <li><a href="/location/chiangmai" class="underline decoration-white/30 underline-offset-4 hover:text-gold transition-colors">เชียงใหม่</a></li>
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
   class="fixed bottom-10 right-10 z-[90] group transition-all duration-500 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-green-500/50 rounded-full"
   aria-label="ติดต่อสอบถามข้อมูลเพิ่มเติมผ่าน LINE">
    
    <div class="bg-[#06b64d] border border-white/20 rounded-full px-5 py-3 flex items-center gap-3 shadow-[0_15px_30px_-5px_rgba(6,182,77,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(6,182,77,0.5)] transition-shadow duration-300">
        <div class="relative flex items-center justify-center">
            <i class="fab fa-line text-white text-3xl group-hover:scale-110 transition-transform duration-300"></i>
            <span class="absolute -top-1 -right-1 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
        </div>

        <div class="flex flex-col items-start leading-tight">
            <span class="text-[10px] text-white/80 uppercase tracking-widest font-medium">Contact</span>
            <span class="text-[15px] text-white font-bold tracking-tight">ติดต่อสอบถาม</span>
        </div>
    </div>
</a>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const nav = document.querySelector('nav');
        if (!nav) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNav = () => {
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNav);
                ticking = true;
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