import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. SYSTEM CONFIGURATION & DATA (ปรับปรุง SEO & Sanitization หลบ SafeSearch)
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

        lsi:['รับงานเชียงใหม่', 'สาวไซด์ไลน์เชียงใหม่', 'sideline เชียงใหม่', 'ไซต์ไลน์เชียงใหม่', 'ไซไลเชียงใหม่', 'นางแบบสาวเหนือ', 'เพื่อนเที่ยวเชียงใหม่', 'เด็กเอ็นเชียงใหม่'],
        intents:['รับงานเอนเตอร์เทน', 'ดูแลแบบเต็มวัน', 'เพื่อนเที่ยวคาเฟ่', 'N-VIP ชงเหล้า', 'ปาร์ตี้พูลวิลล่า'],
        traits:['ผิวออร่าสว่าง', 'หน้าหมวยน่ารัก', 'ตัวเล็กสเปคป๋า', 'หุ่นนางแบบ', 'พูดเหนืออ้อนๆ', 'สัดส่วนเป๊ะ'],
        hotels:['โรงแรมระดับพรีเมียมแถวนิมมาน', 'ที่พักใกล้คูเมือง', 'คอนโดหรูเจ็ดยอด', 'รีสอร์ทส่วนตัวแม่ริม'],
        services:['บริการเอนเตอร์เทนส่วนตัว', 'ดูแลฟิวแฟนเดินนิมมาน', 'ปาร์ตี้พูลวิลล่าระดับ VIP', 'เพื่อนเที่ยวผ่อนคลายส่วนตัว'],
        avgPrice: "1,500 - 4,000",

        uniqueIntro: "หากคุณกำลังมองหาน้องๆ <strong>รับงานเชียงใหม่</strong> หรือ <strong>สาวไซด์ไลน์เชียงใหม่</strong> ระดับพรีเมียม ที่นี่คือศูนย์รวมนางแบบและเพื่อนเที่ยวสาวเหนือผิวออร่า ที่พร้อมดูแลคุณแบบฟิวแฟน ไม่ว่าคุณจะพักอยู่โซนนิมมาน สันติธรรม หรือรีสอร์ทส่วนตัว เรามีตั้งแต่น้องนักศึกษาไปจนถึงพริตตี้ท้องถิ่น การันตีความตรงปก 100% ปลอดภัย ไร้กังวลเรื่องโอนมัดจำ",
        faqs:[
            { q: "หาน้องๆ รับงานเชียงใหม่ โซนไหนเดินทางสะดวกและเป็นส่วนตัวสุด?", a: "โซนนิมมาน สันติธรรม และเจ็ดยอด เป็นโซนที่น้องๆ พร้อมให้บริการมากที่สุด และมีโรงแรมระดับพรีเมียมรองรับการนัดหมายอย่างปลอดภัย" },
            { q: "ความปลอดภัยในการเรียกสาวไซด์ไลน์เชียงใหม่?", a: "เราเน้นระบบ 'ไม่โอนมัดจำ' ลูกค้าเจอตัวน้อง จ่ายเงินหน้างานเท่านั้น ป้องกันมิจฉาชีพ 100% พร้อมเก็บข้อมูลลูกค้าเป็นความลับสูงสุด" }
        ]
    },
    'bangkok': {
        zones:['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย', 'ปิ่นเกล้า'],
        lsi:['รับงานกรุงเทพ', 'ไซด์ไลน์ กทม', 'สาวไซด์ไลน์กรุงเทพ', 'sideline bkk', 'พริตตี้ กทม.', 'เด็กเอ็นพรีเมียม', 'เพื่อนเที่ยวส่วนตัว', 'นางแบบรับงาน'],
        intents:['เอนเตอร์เทนรายชั่วโมง', 'ดูแลแบบเต็มวัน', 'Private VIP Entertain', 'เพื่อนเที่ยวทองหล่อ', 'ปาร์ตี้ไพรเวท'],
        traits:['ลูกคุณหนู', 'ลุคอินเตอร์สายฝอ', 'ใบหน้าเป๊ะ', 'หุ่นนางแบบ', 'ดูแลเอาใจเก่ง', 'ลุคพนักงานออฟฟิศ'],
        hotels:['คอนโดหรูติด BTS', 'โรงแรมย่านสุขุมวิท', 'ที่พักพรีเมียมห้วยขวาง'],
        services:['ดูแลแบบฟิวแฟนเต็มรูปแบบ', 'เพื่อนเที่ยวกลางคืนทองหล่อ', 'บริการ N-Vip ส่วนตัว'],
        avgPrice: "2,000 - 5,000+",
        uniqueIntro: "เมืองหลวงแห่งแสงสี ที่นี่คือศูนย์รวมตัวท็อปพรีเมียมที่สุดของประเทศ บริการ<strong>รับงานกรุงเทพ</strong>และ<strong>ไซด์ไลน์ กทม.</strong> ครอบคลุมตั้งแต่สุขุมวิท ทองหล่อ ยันรัชดา นัดง่าย เดินทางสะดวกด้วย BTS/MRT คัดเน้นๆ เฉพาะงานคุณภาพระดับ VIP ปลอดภัย จ่ายเงินหน้างาน ไร้กังวลเรื่องมิจฉาชีพ",
        faqs:[
            { q: "น้องๆ รับงานกรุงเทพ ส่วนใหญ่สะดวกโซนไหน?", a: "โซนยอดฮิตคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ นัดหมายตามคอนโดหรือโรงแรมหรูติดรถไฟฟ้าได้สะดวกและเป็นส่วนตัว" },
            { q: "เรียกเด็กเอ็น หรือ ไซด์ไลน์ กทม. ต้องมัดจำไหม?", a: "เพื่อความสบายใจสูงสุดของลูกค้า เราใช้ระบบเจอตัวจริงแล้วค่อยชำระเงิน ไม่มีการบังคับโอนมัดจำล่วงหน้าทุกกรณี" }
        ]
    },
    // 🚀 เพิ่ม "ลำปาง" เข้ามาตามข้อมูลใน GSC ที่มีคนค้นหาถึง 300+ คลิก
    'lampang': {
        zones:['ตัวเมืองลำปาง', 'สวนดอก', 'พระบาท', 'ม.ราชภัฏลำปาง', 'เกาะคา', 'แม่ทะ'],
        lsi:['รับงานลำปาง', 'ไซด์ไลน์ลำปาง', 'สาวไซด์ไลน์ลำปาง', 'sideline ลำปาง', 'ไซต์ไลน์ลำปาง', 'นักศึกษาลำปาง', 'เพื่อนเที่ยวลำปาง', 'เด็กเอ็นลำปาง'],
        intents:['เอนเตอร์เทนส่วนตัว', 'ดูแลฟิวแฟน', 'เพื่อนเที่ยวชิลๆ', 'ชงเหล้าปาร์ตี้'],
        traits:['สาวเหนือหน้าหวาน', 'น่ารักเป็นกันเอง', 'เอาใจเก่ง', 'ผิวขาวออร่า', 'สัดส่วนดี'],
        hotels:['โรงแรมในตัวเมืองลำปาง', 'รีสอร์ทส่วนตัว', 'ที่พักใกล้ราชภัฏ'],
        services:['บริการเอนเตอร์เทนผ่อนคลาย', 'ดูแลแบบฟิวแฟน', 'เพื่อนเที่ยวคาเฟ่ลำปาง'],
        avgPrice: "1,500 - 3,000",
        uniqueIntro: "พบกับน้องๆ <strong>รับงานลำปาง</strong> และ <strong>ไซด์ไลน์ลำปาง</strong> ระดับพรีเมียม ที่พร้อมดูแลคุณอย่างใกล้ชิดแบบฟิวแฟน สาวเหนือหน้าหวาน บริการประทับใจ นัดหมายง่ายในโซนตัวเมืองและพื้นที่ใกล้เคียง การันตีโปรไฟล์ตรงปก 100% ปลอดภัย จ่ายเงินหน้างาน ไม่ต้องโอนมัดจำ",
        faqs:[
            { q: "หาไซด์ไลน์ลำปาง นัดเจอโซนไหนได้บ้าง?", a: "น้องๆ ส่วนใหญ่สะดวกในโซนตัวเมืองลำปาง, สวนดอก, และใกล้เคียงสถานศึกษา นัดหมายตามโรงแรมหรือที่พักส่วนตัวได้สะดวก" },
            { q: "รับประกันความตรงปกและการบริการไหม?", a: "โปรไฟล์น้องๆ ทุกคนผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปก และเน้นมารยาทการบริการระดับพรีเมียม เพื่อให้คุณประทับใจที่สุด" }
        ]
    },
    'default': {
        zones:['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู'],
        lsi:['รับงานส่วนตัว', 'สาวไซด์ไลน์', 'sideline พรีเมียม', 'เพื่อนเที่ยว', 'เด็กเอ็น', 'นักศึกษาพาร์ทไทม์', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน'],
        intents:['รับงานเอนเตอร์เทน', 'ดูแลแบบเต็มวัน', 'เพื่อนเที่ยว', 'ฟิวแฟน'],
        traits:['หน้าตาน่ารัก', 'บุคลิกดี', 'เอาใจเก่ง', 'บริการประทับใจ'],
        hotels: ['โรงแรมในตัวเมือง', 'รีสอร์ทส่วนตัว'],
        services:['ฟิวแฟนส่วนตัว', 'เพื่อนเที่ยว-ดูหนัง', 'เอนเตอร์เทนผ่อนคลาย'],
        avgPrice: "1,500 - 3,500",
        uniqueIntro: "หากคุณกำลังมองหาช่วงเวลาการพักผ่อนเหนือระดับ เรารวบรวมน้องๆ <strong>รับงานส่วนตัว</strong>และ<strong>ไซด์ไลน์เกรดพรีเมียม</strong> ที่ผ่านการคัดสรรอย่างเข้มงวด การันตีความตรงปก 100% พร้อมให้บริการในพื้นที่ นัดหมายได้อย่างเป็นส่วนตัว ปลอดภัย ไม่มีการบังคับโอนมัดจำ จ่ายเงินเมื่อเจอตัวจริงเท่านั้น",
        faqs:[
            { q: "ใช้บริการน้องๆ รับงาน ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายเงินสดหน้างานเมื่อเจอตัวน้องจริงเท่านั้น เพื่อความปลอดภัยสูงสุดของคุณ" },
            { q: "รับประกันความตรงปกไหม?", a: "รูปโปรไฟล์ทุกรูปผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปกและพร้อมให้บริการระดับพรีเมียมอย่างแท้จริง" }
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
                        <span class="text-white/90">เรทเริ่มต้น (เอนเตอร์เทนส่วนตัว)</span>
                        <span class="text-gold font-medium">~ 1,500 ฿</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                        <span class="text-white/90">เรทดูแลเต็มวัน / ฟิวแฟน</span>
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


        const [provinceRes, profilesRes, allProvincesRes] = await Promise.all([
            supabase.from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle(),
            supabase.from('profiles').select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, created_at, active, availability, likes')
                .eq('provinceKey', provinceKey).eq('active', true)
                .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false }).limit(80),
            supabase.from('provinces').select('key, nameThai').order('nameThai', { ascending: true })
        ]);

        const provinceData = provinceRes.data;
        const profiles = profilesRes.data;
        const allProvinces = allProvincesRes.data;

        if (!provinceData || provinceRes.error) return context.next();

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


const title = `รับงาน${provinceName} ไซด์ไลน์${provinceName} สาวไซด์ไลน์ เพื่อนเที่ยว (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ปลอดภัย ไม่มัดจำ`;

const description = `รวมโปรไฟล์น้องๆ รับงาน${provinceName} ไซด์ไลน์${provinceName} (Sideline) เพื่อนเที่ยวระดับพรีเมียม ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก 100% ✓ไม่ต้องโอนมัดจำ จ่ายเงินหน้างาน`;

        const provinceLinksHtml = allProvinces && allProvinces.length > 0 
            ? allProvinces.map(p => `
                <a href="/location/${p.key}" 
                   class="text-[10px] text-white/70 hover:text-gold transition-all duration-300 border-b border-transparent hover:border-gold/30 pb-0.5 py-1.5 whitespace-nowrap">
                   ไซด์ไลน์${p.nameThai}
                </a>
            `).join('')
            : '';

        const latestUpdateDate = safeProfiles.length > 0 && safeProfiles[0].lastUpdated 
            ? new Date(safeProfiles[0].lastUpdated).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

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
                    "@type":["LocalBusiness", "ModelingAgency"],
                    "@id": `${provinceUrl}/#business`,
                    "name": `ไซด์ไลน์${provinceName} - บริการจัดหานางแบบและเพื่อนเที่ยวระดับพรีเมียม`,
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
                            "name": `บริการไซด์ไลน์${provinceName} และเพื่อนเที่ยว ต้องโอนมัดจำไหม?`,
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

// 🤖 1. ปรับปรุงการเช็คบอทให้ครอบคลุมและแม่นยำที่สุด
const userAgent = request.headers.get('user-agent') || '';
// เพิ่มบอทที่สำคัญและเปลี่ยนการตรวจเช็คให้รัดกุมขึ้น
const isBot = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|lighthouse|chrome-lighthouse|google-structured-data-testing-tool/i.test(userAgent);

// 🛡️ 2. ปิดการใช้งาน Age Gate ถาวร (เพื่อให้ Google เก็บข้อมูลได้ 100% และ User เข้าถึงง่าย)
// ผมตั้งค่าเป็นค่าว่างตามที่คุณต้องการเอาออกครับ
const ageGateHTML = ''; 

let cardsHTML = '';
if (safeProfiles && safeProfiles.length > 0) {
    cardsHTML = safeProfiles.map((p, i) => {
        const cleanName = (p.name || 'สาวสวย').replace(/^(น้อง\s?)/, '');
        const profileLocation = p.location || provinceName || 'ไม่ระบุพิกัด';
        
        // ระบบเช็คสถานะการรับงาน
        const busyKeywords = ['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'];
        let isAvailable = true;
        if (p.availability) {
            const availText = p.availability.toLowerCase();
            isAvailable = !busyKeywords.some(kw => availText.includes(kw));
        }
        const statusText = isAvailable ? 'พร้อมรับงาน' : 'ติดจอง';

        // จัดการวันที่ (พ.ศ.)
        const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
        const d = new Date(dateStr);
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const dateDisplay = `${d.getDate()} ${months[d.getMonth()]} ${(d.getFullYear() + 543).toString().slice(-2)}`;
        
        // SEO Data & LSI
        const intents = seoData.intents || ['เพื่อนเที่ยว', 'ฟิวแฟน', 'รับงานเอนเตอร์เทน'];
        const traits = seoData.traits || ['น่ารัก', 'บุคลิกดี', 'บริการประทับใจ'];
        const lsiKeywords = seoData.lsi || [`ไซด์ไลน์${provinceName}`, `รับงาน${provinceName}`];
        
        const targetIntent = intents[i % intents.length];
        const targetTrait = traits[i % traits.length];
        const targetKeyword = lsiKeywords[i % lsiKeywords.length];
        
        // 🚀 ปรับปรุง Alt Text ให้เป็นธรรมชาติ (ลดการโดนมองว่าเป็น Spam)
        const imgAlt = `น้อง${cleanName} ${profileLocation} สไตล์${targetTrait} ${targetIntent}`;
        const profileLink = `/sideline/${p.slug || p.id || '#'}`;

        // ระบบ Badge แบ่งระดับสมาชิก
        let badgeHTML = '';
        const rateNum = p.rate ? parseInt(String(p.rate).replace(/\D/g, '')) : 0;
        
        if (rateNum >= 4000) {
            badgeHTML = `<span class="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(168,85,247,0.4)]">VIP Class</span>`;
        } else if (i < 3 && p.isfeatured) {
            badgeHTML = `<span class="bg-gradient-to-r from-orange-600 to-red-600 text-white text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(234,88,12,0.4)]">Trending</span>`;
        } else {
            badgeHTML = `<span class="bg-white/10 text-white/80 border border-white/10 text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase backdrop-blur-sm">Verified</span>`;
        }
        
        // ⚡ เพิ่มประสิทธิภาพการโหลด: 4 รูปแรกโหลดทันที (Priority High) รูปที่เหลือ Load Lazy
        const loadingAttr = i < 4 ? 'fetchpriority="high"' : 'loading="lazy"';
        
        return `
<article class="profile-card group relative overflow-hidden flex flex-col h-full bg-[#121212] rounded-[24px] border border-white/5 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
    <a href="${profileLink}" class="absolute inset-0 z-40" aria-label="ดูโปรไฟล์น้อง ${cleanName}"></a>
    
    <div class="relative aspect-[3/4] overflow-hidden">
        <img src="${optimizeImg(p.imagePath, 500, 660)}" 
             alt="${imgAlt}"
             class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
             ${loadingAttr}
             decoding="async">
        
        <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/20 z-10"></div>
        
        <div class="absolute top-3 left-3 z-20">
            <div class="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-2 shadow-lg">
                <span class="h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-rose-500'} ${isAvailable ? 'animate-pulse' : ''}"></span>
                <span class="text-[8px] md:text-[9px] text-white font-bold tracking-[0.1em] uppercase">${statusText}</span>
            </div>
        </div>

        <div class="absolute top-3 right-3 z-20 flex flex-col gap-1.5 items-end">
            ${badgeHTML}
        </div>
    </div>

    <div class="p-5 flex-1 flex flex-col justify-between relative z-20">
        <div>
            <div class="flex justify-between items-center mb-3">
                <span class="text-[10px] text-gold font-bold tracking-[0.15em] uppercase px-2 py-0.5 bg-gold/5 rounded border border-gold/10">
                    ${targetKeyword}
                </span>
                <span class="text-[9px] text-white/30 font-light italic">${dateDisplay}</span>
            </div>

            <h3 class="font-serif text-2xl text-white group-hover:text-gold transition-colors duration-300 truncate leading-tight">
                ${cleanName}
            </h3>
            
            <div class="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/5">
                <div class="space-y-1">
                    <p class="text-[9px] text-white/40 uppercase tracking-[0.1em]">พิกัด</p>
                    <p class="text-xs text-white/80 font-light truncate">
                        <i class="fas fa-map-marker-alt text-gold/60 mr-1.5"></i>${profileLocation}
                    </p>
                </div>
                <div class="space-y-1 text-right">
                    <p class="text-[9px] text-white/40 uppercase tracking-[0.1em]">ค่าขนม</p>
                    <p class="text-[15px] text-gold font-bold tabular-nums">
                        ฿${p.rate || 'สอบถาม'}
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-6 flex items-center justify-between text-[10px] border-t border-white/5 pt-4">
            <span class="text-white/40 uppercase tracking-widest italic font-light">
                <i class="far fa-star text-gold/40 mr-1"></i> ${targetIntent}
            </span>
            <span class="text-white/60 group-hover:text-gold transition-all duration-300 uppercase font-medium tracking-tighter flex items-center">
                ดูรายละเอียด <i class="fas fa-chevron-right ml-1.5 text-[8px] transition-transform group-hover:translate-x-1"></i>
            </span>
        </div>
    </div>
</article>`;
    }).join('');
}
        const html = String.raw`<!DOCTYPE html>
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
<!-- 💡 ใส่คำสะกดผิดที่ได้จาก Google Search Console ลงไปให้ครบ -->
<meta name="keywords" content="รับงาน${provinceName}, ไซด์ไลน์${provinceName}, sideline ${provinceName}, ไซต์ไลน์${provinceName}, ไซไล${provinceName}, ไซไลน์${provinceName}, ไซส์ไลน์${provinceName}, สาวไซด์ไลน์${provinceName}, เพื่อนเที่ยว${provinceName}, เด็กเอ็น${provinceName}, ไม่มัดจำ">
    <link rel="canonical" href="${provinceUrl}" />
    
    <meta name="robots" content="index, follow, max-image-preview:large">
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



<style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:Outfit, Prompt, sans-serif;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.container{width:100%}@media (min-width: 640px){.container{max-width:640px}}@media (min-width: 768px){.container{max-width:768px}}@media (min-width: 1024px){.container{max-width:1024px}}@media (min-width: 1280px){.container{max-width:1280px}}@media (min-width: 1536px){.container{max-width:1536px}}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{inset:0px}.-right-1{right:-0.25rem}.-top-1{top:-0.25rem}.bottom-10{bottom:2.5rem}.left-0{left:0px}.left-3{left:0.75rem}.right-10{right:2.5rem}.right-3{right:0.75rem}.top-0{top:0px}.top-3{top:0.75rem}.z-10{z-index:10}.z-20{z-index:20}.z-40{z-index:40}.z-\[100\]{z-index:100}.z-\[90\]{z-index:90}.z-\[9999\]{z-index:9999}.mx-1{margin-left:0.25rem;margin-right:0.25rem}.mx-auto{margin-left:auto;margin-right:auto}.my-12{margin-top:3rem;margin-bottom:3rem}.mb-10{margin-bottom:2.5rem}.mb-12{margin-bottom:3rem}.mb-16{margin-bottom:4rem}.mb-2{margin-bottom:0.5rem}.mb-20{margin-bottom:5rem}.mb-28{margin-bottom:7rem}.mb-3{margin-bottom:0.75rem}.mb-4{margin-bottom:1rem}.mb-40{margin-bottom:10rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.ml-1{margin-left:0.25rem}.ml-1\.5{margin-left:0.375rem}.mr-1{margin-right:0.25rem}.mr-1\.5{margin-right:0.375rem}.mr-2{margin-right:0.5rem}.mt-1{margin-top:0.25rem}.mt-20{margin-top:5rem}.mt-3{margin-top:0.75rem}.mt-5{margin-top:1.25rem}.mt-6{margin-top:1.5rem}.mt-8{margin-top:2rem}.block{display:block}.inline-block{display:inline-block}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.hidden{display:none}.aspect-\[3\/4\]{aspect-ratio:3/4}.h-1{height:0.25rem}.h-1\.5{height:0.375rem}.h-16{height:4rem}.h-2{height:0.5rem}.h-3\.5{height:0.875rem}.h-8{height:2rem}.h-\[1px\]{height:1px}.h-full{height:100%}.w-1\.5{width:0.375rem}.w-12{width:3rem}.w-16{width:4rem}.w-2{width:0.5rem}.w-3\.5{width:0.875rem}.w-8{width:2rem}.w-full{width:100%}.max-w-3xl{max-width:48rem}.max-w-4xl{max-width:56rem}.max-w-5xl{max-width:64rem}.max-w-6xl{max-width:72rem}.max-w-\[1400px\]{max-width:1400px}.max-w-md{max-width:28rem}.max-w-sm{max-width:24rem}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}@keyframes ping{75%, 100%{transform:scale(2);opacity:0}}.animate-ping{animation:ping 1s cubic-bezier(0, 0, 0.2, 1) infinite}@keyframes pulse{50%{opacity:.5}}.animate-pulse{animation:pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite}.grid-cols-1{grid-template-columns:repeat(1, minmax(0, 1fr))}.grid-cols-2{grid-template-columns:repeat(2, minmax(0, 1fr))}.grid-cols-3{grid-template-columns:repeat(3, minmax(0, 1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1\.5{gap:0.375rem}.gap-10{gap:2.5rem}.gap-12{gap:3rem}.gap-16{gap:4rem}.gap-2{gap:0.5rem}.gap-3{gap:0.75rem}.gap-4{gap:1rem}.gap-5{gap:1.25rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.space-x-2 > :not([hidden]) ~ :not([hidden]){--tw-space-x-reverse:0;margin-right:calc(0.5rem * var(--tw-space-x-reverse));margin-left:calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))}.space-y-1 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.25rem * var(--tw-space-y-reverse))}.space-y-10 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(2.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(2.5rem * var(--tw-space-y-reverse))}.space-y-16 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(4rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(4rem * var(--tw-space-y-reverse))}.space-y-4 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.space-y-8 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(2rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(2rem * var(--tw-space-y-reverse))}.divide-x > :not([hidden]) ~ :not([hidden]){--tw-divide-x-reverse:0;border-right-width:calc(1px * var(--tw-divide-x-reverse));border-left-width:calc(1px * calc(1 - var(--tw-divide-x-reverse)))}.divide-white\/10 > :not([hidden]) ~ :not([hidden]){border-color:rgb(255 255 255 / 0.1)}.overflow-hidden{overflow:hidden}.overflow-x-hidden{overflow-x:hidden}.scroll-smooth{scroll-behavior:smooth}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.whitespace-nowrap{white-space:nowrap}.rounded{border-radius:0.25rem}.rounded-2xl{border-radius:1rem}.rounded-3xl{border-radius:1.5rem}.rounded-\[24px\]{border-radius:24px}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:0.5rem}.rounded-sm{border-radius:0.125rem}.rounded-xl{border-radius:0.75rem}.border{border-width:1px}.border-y{border-top-width:1px;border-bottom-width:1px}.border-b{border-bottom-width:1px}.border-b-2{border-bottom-width:2px}.border-t{border-top-width:1px}.border-gold\/10{border-color:rgb(197 160 89 / 0.1)}.border-gold\/20{border-color:rgb(197 160 89 / 0.2)}.border-gold\/30{border-color:rgb(197 160 89 / 0.3)}.border-gold\/40{border-color:rgb(197 160 89 / 0.4)}.border-gold\/50{border-color:rgb(197 160 89 / 0.5)}.border-transparent{border-color:transparent}.border-white\/10{border-color:rgb(255 255 255 / 0.1)}.border-white\/30{border-color:rgb(255 255 255 / 0.3)}.border-white\/5{border-color:rgb(255 255 255 / 0.05)}.bg-\[\#050505\]{--tw-bg-opacity:1;background-color:rgb(5 5 5 / var(--tw-bg-opacity, 1))}.bg-\[\#059645\]{--tw-bg-opacity:1;background-color:rgb(5 150 69 / var(--tw-bg-opacity, 1))}.bg-\[\#0a0a0a\]{--tw-bg-opacity:1;background-color:rgb(10 10 10 / var(--tw-bg-opacity, 1))}.bg-\[\#0a0a0a\]\/80{background-color:rgb(10 10 10 / 0.8)}.bg-\[\#121212\]{--tw-bg-opacity:1;background-color:rgb(18 18 18 / var(--tw-bg-opacity, 1))}.bg-black\/60{background-color:rgb(0 0 0 / 0.6)}.bg-black\/95{background-color:rgb(0 0 0 / 0.95)}.bg-emerald-400{--tw-bg-opacity:1;background-color:rgb(52 211 153 / var(--tw-bg-opacity, 1))}.bg-gold{--tw-bg-opacity:1;background-color:rgb(197 160 89 / var(--tw-bg-opacity, 1))}.bg-gold\/10{background-color:rgb(197 160 89 / 0.1)}.bg-gold\/20{background-color:rgb(197 160 89 / 0.2)}.bg-gold\/5{background-color:rgb(197 160 89 / 0.05)}.bg-gold\/50{background-color:rgb(197 160 89 / 0.5)}.bg-green-500{--tw-bg-opacity:1;background-color:rgb(34 197 94 / var(--tw-bg-opacity, 1))}.bg-red-600{--tw-bg-opacity:1;background-color:rgb(220 38 38 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.bg-white\/\[0\.02\]{background-color:rgb(255 255 255 / 0.02)}.bg-white\/\[0\.03\]{background-color:rgb(255 255 255 / 0.03)}.bg-gradient-to-b{background-image:linear-gradient(to bottom, var(--tw-gradient-stops))}.bg-gradient-to-r{background-image:linear-gradient(to right, var(--tw-gradient-stops))}.bg-gradient-to-t{background-image:linear-gradient(to top, var(--tw-gradient-stops))}.from-\[\#121212\]{--tw-gradient-from:#121212 var(--tw-gradient-from-position);--tw-gradient-to:rgb(18 18 18 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from), var(--tw-gradient-to)}.from-gold\/5{--tw-gradient-from:rgb(197 160 89 / 0.05) var(--tw-gradient-from-position);--tw-gradient-to:rgb(197 160 89 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from), var(--tw-gradient-to)}.from-orange-600{--tw-gradient-from:#ea580c var(--tw-gradient-from-position);--tw-gradient-to:rgb(234 88 12 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from), var(--tw-gradient-to)}.from-transparent{--tw-gradient-from:transparent var(--tw-gradient-from-position);--tw-gradient-to:rgb(0 0 0 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from), var(--tw-gradient-to)}.via-gold{--tw-gradient-to:rgb(197 160 89 / 0)  var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from), #C5A059 var(--tw-gradient-via-position), var(--tw-gradient-to)}.via-transparent{--tw-gradient-to:rgb(0 0 0 / 0)  var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from), transparent var(--tw-gradient-via-position), var(--tw-gradient-to)}.to-black\/20{--tw-gradient-to:rgb(0 0 0 / 0.2) var(--tw-gradient-to-position)}.to-red-600{--tw-gradient-to:#dc2626 var(--tw-gradient-to-position)}.to-transparent{--tw-gradient-to:transparent var(--tw-gradient-to-position)}.object-cover{object-fit:cover}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.p-8{padding:2rem}.px-2{padding-left:0.5rem;padding-right:0.5rem}.px-2\.5{padding-left:0.625rem;padding-right:0.625rem}.px-4{padding-left:1rem;padding-right:1rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-0\.5{padding-top:0.125rem;padding-bottom:0.125rem}.py-1{padding-top:0.25rem;padding-bottom:0.25rem}.py-1\.5{padding-top:0.375rem;padding-bottom:0.375rem}.py-12{padding-top:3rem;padding-bottom:3rem}.py-2{padding-top:0.5rem;padding-bottom:0.5rem}.py-2\.5{padding-top:0.625rem;padding-bottom:0.625rem}.py-3{padding-top:0.75rem;padding-bottom:0.75rem}.py-3\.5{padding-top:0.875rem;padding-bottom:0.875rem}.py-4{padding-top:1rem;padding-bottom:1rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.pb-0\.5{padding-bottom:0.125rem}.pb-1{padding-bottom:0.25rem}.pb-12{padding-bottom:3rem}.pb-24{padding-bottom:6rem}.pb-32{padding-bottom:8rem}.pb-4{padding-bottom:1rem}.pb-6{padding-bottom:1.5rem}.pt-10{padding-top:2.5rem}.pt-16{padding-top:4rem}.pt-24{padding-top:6rem}.pt-4{padding-top:1rem}.pt-44{padding-top:11rem}.pt-8{padding-top:2rem}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}.font-sans{font-family:Outfit, Prompt, sans-serif}.font-serif{font-family:"Playfair Display", serif}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-5xl{font-size:3rem;line-height:1}.text-\[10px\]{font-size:10px}.text-\[11px\]{font-size:11px}.text-\[12px\]{font-size:12px}.text-\[15px\]{font-size:15px}.text-\[16px\]{font-size:16px}.text-\[8px\]{font-size:8px}.text-\[9px\]{font-size:9px}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.font-light{font-weight:300}.font-medium{font-weight:500}.font-normal{font-weight:400}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.italic{font-style:italic}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)}.leading-\[1\.1\]{line-height:1.1}.leading-loose{line-height:2}.leading-relaxed{line-height:1.625}.leading-tight{line-height:1.25}.tracking-\[0\.15em\]{letter-spacing:0.15em}.tracking-\[0\.1em\]{letter-spacing:0.1em}.tracking-\[0\.25em\]{letter-spacing:0.25em}.tracking-\[0\.2em\]{letter-spacing:0.2em}.tracking-\[0\.3em\]{letter-spacing:0.3em}.tracking-\[0\.4em\]{letter-spacing:0.4em}.tracking-\[0\.5em\]{letter-spacing:0.5em}.tracking-normal{letter-spacing:0em}.tracking-tight{letter-spacing:-0.025em}.tracking-tighter{letter-spacing:-0.05em}.tracking-wide{letter-spacing:0.025em}.tracking-wider{letter-spacing:0.05em}.tracking-widest{letter-spacing:0.1em}.text-black{--tw-text-opacity:1;color:rgb(0 0 0 / var(--tw-text-opacity, 1))}.text-emerald-500{--tw-text-opacity:1;color:rgb(16 185 129 / var(--tw-text-opacity, 1))}.text-gold{--tw-text-opacity:1;color:rgb(197 160 89 / var(--tw-text-opacity, 1))}.text-gold\/40{color:rgb(197 160 89 / 0.4)}.text-gold\/50{color:rgb(197 160 89 / 0.5)}.text-gold\/60{color:rgb(197 160 89 / 0.6)}.text-gold\/80{color:rgb(197 160 89 / 0.8)}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.text-white\/30{color:rgb(255 255 255 / 0.3)}.text-white\/40{color:rgb(255 255 255 / 0.4)}.text-white\/50{color:rgb(255 255 255 / 0.5)}.text-white\/60{color:rgb(255 255 255 / 0.6)}.text-white\/70{color:rgb(255 255 255 / 0.7)}.text-white\/80{color:rgb(255 255 255 / 0.8)}.text-white\/90{color:rgb(255 255 255 / 0.9)}.underline{-webkit-text-decoration-line:underline;text-decoration-line:underline}.decoration-gold\/30{-webkit-text-decoration-color:rgb(197 160 89 / 0.3);text-decoration-color:rgb(197 160 89 / 0.3)}.decoration-white\/30{-webkit-text-decoration-color:rgb(255 255 255 / 0.3);text-decoration-color:rgb(255 255 255 / 0.3)}.underline-offset-4{text-underline-offset:4px}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.opacity-50{opacity:0.5}.opacity-75{opacity:0.75}.opacity-95{opacity:0.95}.shadow-2xl{--tw-shadow:0 25px 50px -12px rgb(0 0 0 / 0.25);--tw-shadow-colored:0 25px 50px -12px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-\[0_0_10px_rgba\(234\2c 88\2c 12\2c 0\.4\)\]{--tw-shadow:0 0 10px rgba(234,88,12,0.4);--tw-shadow-colored:0 0 10px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-\[0_0_50px_rgba\(212\2c 175\2c 55\2c 0\.1\)\]{--tw-shadow:0 0 50px rgba(212,175,55,0.1);--tw-shadow-colored:0 0 50px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-\[0_0_8px_rgba\(52\2c 211\2c 153\2c 0\.6\)\]{--tw-shadow:0 0 8px rgba(52,211,153,0.6);--tw-shadow-colored:0 0 8px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-\[0_15px_30px_-5px_rgba\(5\2c 150\2c 69\2c 0\.4\)\]{--tw-shadow:0 15px 30px -5px rgba(5,150,69,0.4);--tw-shadow-colored:0 15px 30px -5px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.backdrop-blur-md{--tw-backdrop-blur:blur(12px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.backdrop-blur-sm{--tw-backdrop-blur:blur(4px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.transition-colors{transition-property:color, background-color, border-color, fill, stroke, -webkit-text-decoration-color;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, -webkit-text-decoration-color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.transition-shadow{transition-property:box-shadow;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.duration-1000{transition-duration:1000ms}.duration-300{transition-duration:300ms}.duration-500{transition-duration:500ms}.selection\:bg-gold *::selection{--tw-bg-opacity:1;background-color:rgb(197 160 89 / var(--tw-bg-opacity, 1))}.selection\:text-black *::selection{--tw-text-opacity:1;color:rgb(0 0 0 / var(--tw-text-opacity, 1))}.selection\:bg-gold::selection{--tw-bg-opacity:1;background-color:rgb(197 160 89 / var(--tw-bg-opacity, 1))}.selection\:text-black::selection{--tw-text-opacity:1;color:rgb(0 0 0 / var(--tw-text-opacity, 1))}.hover\:-translate-y-2:hover{--tw-translate-y:-0.5rem;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\:border-gold:hover{--tw-border-opacity:1;border-color:rgb(197 160 89 / var(--tw-border-opacity, 1))}.hover\:border-gold\/20:hover{border-color:rgb(197 160 89 / 0.2)}.hover\:border-gold\/30:hover{border-color:rgb(197 160 89 / 0.3)}.hover\:bg-gold:hover{--tw-bg-opacity:1;background-color:rgb(197 160 89 / var(--tw-bg-opacity, 1))}.hover\:bg-gold\/5:hover{background-color:rgb(197 160 89 / 0.05)}.hover\:bg-white:hover{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.hover\:text-black:hover{--tw-text-opacity:1;color:rgb(0 0 0 / var(--tw-text-opacity, 1))}.hover\:text-gold:hover{--tw-text-opacity:1;color:rgb(197 160 89 / var(--tw-text-opacity, 1))}.hover\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.hover\:shadow-\[0_20px_40px_-5px_rgba\(5\2c 150\2c 69\2c 0\.5\)\]:hover{--tw-shadow:0 20px 40px -5px rgba(5,150,69,0.5);--tw-shadow-colored:0 20px 40px -5px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.focus\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\:ring-4:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.focus\:ring-green-500\/50:focus{--tw-ring-color:rgb(34 197 94 / 0.5)}.group:hover .group-hover\:translate-x-1{--tw-translate-x:0.25rem;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.group:hover .group-hover\:scale-110{--tw-scale-x:1.1;--tw-scale-y:1.1;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.group:hover .group-hover\:bg-gold\/10{background-color:rgb(197 160 89 / 0.1)}.group:hover .group-hover\:text-gold{--tw-text-opacity:1;color:rgb(197 160 89 / var(--tw-text-opacity, 1))}@media (min-width: 640px){.sm\:grid-cols-2{grid-template-columns:repeat(2, minmax(0, 1fr))}.sm\:grid-cols-3{grid-template-columns:repeat(3, minmax(0, 1fr))}}@media (min-width: 768px){.md\:col-span-3{grid-column:span 3 / span 3}.md\:col-span-4{grid-column:span 4 / span 4}.md\:col-span-5{grid-column:span 5 / span 5}.md\:inline-block{display:inline-block}.md\:inline{display:inline}.md\:flex{display:flex}.md\:grid-cols-12{grid-template-columns:repeat(12, minmax(0, 1fr))}.md\:grid-cols-2{grid-template-columns:repeat(2, minmax(0, 1fr))}.md\:grid-cols-3{grid-template-columns:repeat(3, minmax(0, 1fr))}.md\:grid-cols-4{grid-template-columns:repeat(4, minmax(0, 1fr))}.md\:flex-row{flex-direction:row}.md\:gap-10{gap:2.5rem}.md\:gap-20{gap:5rem}.md\:gap-8{gap:2rem}.md\:p-12{padding:3rem}.md\:px-8{padding-left:2rem;padding-right:2rem}.md\:text-2xl{font-size:1.5rem;line-height:2rem}.md\:text-3xl{font-size:1.875rem;line-height:2.25rem}.md\:text-4xl{font-size:2.25rem;line-height:2.5rem}.md\:text-7xl{font-size:4.5rem;line-height:1}.md\:text-\[11px\]{font-size:11px}.md\:text-\[9px\]{font-size:9px}.md\:text-base{font-size:1rem;line-height:1.5rem}.md\:text-xs{font-size:0.75rem;line-height:1rem}.md\:leading-relaxed{line-height:1.625}}@media (min-width: 1024px){.lg\:grid-cols-4{grid-template-columns:repeat(4, minmax(0, 1fr))}.lg\:grid-cols-6{grid-template-columns:repeat(6, minmax(0, 1fr))}.lg\:px-12{padding-left:3rem;padding-right:3rem}.lg\:text-4xl{font-size:2.25rem;line-height:2.5rem}.lg\:text-8xl{font-size:6rem;line-height:1}}</style>
    <style>
        :root { 
            --bg: #070707; 
            --card-bg: #121212;
            --gold: #D4AF37; 
            --gold-light: #F3E5AB;
            --text-main: rgba(255, 255, 255, 0.95);
            --text-sub: rgba(255, 255, 255, 0.5);
        }

        body { 
            background-color: var(--bg); 
            color: var(--text-main);
            -webkit-font-smoothing: antialiased;
            font-family: 'Outfit', 'Prompt', sans-serif;
        }

        .nav-glass {
            background: transparent;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-scrolled {
            background: rgba(7, 7, 7, 0.85) !important;
            backdrop-filter: blur(15px) !important;
            -webkit-backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(212, 175, 55, 0.15) !important;
            padding-top: 0.8rem !important;
            padding-bottom: 0.8rem !important;
        }

        .profile-card {
            background: var(--card-bg);
            border: 1px solid rgba(255, 255, 255, 0.03);
            border-radius: 24px;
            transition: all 0.4s ease;
        }

        .profile-card:hover {
            border-color: rgba(212, 175, 55, 0.3);
            transform: translateY(-8px);
            box-shadow: 0 20px 40px -20px rgba(212, 175, 55, 0.2);
        }

        .img-gradient {
            background: linear-gradient(to top, var(--card-bg) 0%, rgba(18, 18, 18, 0) 40%);
        }

        #age-gate {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            transition: opacity 0.5s ease;
        }
    </style>
</head>

<!-- 🎨 6. แก้ปัญหา Contrast ของเวลาลากคลุมข้อความ (Selection) -->
<body class="selection:bg-gold selection:text-black antialiased text-white/90 bg-[#050505] overflow-x-hidden scroll-smooth">

    <!-- 🤖 นำตัวแปร Age Gate (ที่ผ่านการตรวจสอบ GoogleBot แล้ว) มาแสดงตรงนี้ -->
    ${ageGateHTML}

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
                ศูนย์รวมโปรไฟล์ <span class="text-white/80">นางแบบและเพื่อนเที่ยวพรีเมียม</span> 
                <span class="hidden md:inline">มั่นใจความปลอดภัย</span> 
                <span class="text-gold/80 italic">ไม่มีโอนมัดจำ🚨</span>
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

<!-- 🚀 1. ปรับปรุง Stats Bar เพื่อแก้ CLS (ใช้ min-h และล็อคบรรทัดตัวเลข) -->
<div class="border-y border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md relative z-20 mb-16 min-h-[105px] md:min-h-[135px] flex items-center shadow-2xl">
    <div class="container mx-auto px-6 max-w-5xl">
        <div class="grid grid-cols-3 divide-x divide-white/10 py-6">
            <div class="text-center px-2">
                <div class="text-2xl md:text-4xl font-serif text-gold leading-none mb-1.5 h-6 md:h-9">${safeProfiles.length}</div>
                <div class="text-[9px] md:text-[11px] text-white/70 uppercase tracking-widest font-medium mt-1">น้องๆ พร้อมรับงาน</div>
            </div>
            <div class="text-center px-2">
                <div class="text-2xl md:text-4xl font-serif text-white leading-none mb-1.5 h-6 md:h-9">${latestUpdateDate}</div>
                <div class="text-[9px] md:text-[11px] text-white/70 uppercase tracking-widest font-medium mt-1">อัปเดตสถานะล่าสุด</div>
            </div>
            <div class="text-center px-2">
                <div class="text-2xl md:text-4xl font-serif text-emerald-500 leading-none mb-1.5 h-6 md:h-9">100%</div>
                <div class="text-[9px] md:text-[11px] text-white/70 uppercase tracking-widest font-medium mt-1">รับประกันไม่โอนมัดจำ</div>
            </div>
        </div>
    </div>
</div>

<main class="container mx-auto px-6 lg:px-12 max-w-[1400px] pb-32" id="profiles">
        
        <!-- 🎨 2. ปรับ Contrast Breadcrumb (จาก white/40 เป็น white/60) เพื่อให้อ่านง่าย -->
        <nav aria-label="Breadcrumb" class="mb-6">
            <ol class="flex items-center space-x-2 text-[10px] md:text-xs text-white/60 font-medium tracking-widest uppercase">
                <li><a href="/" class="hover:text-gold transition-colors">Home</a></li>
                <li><span class="mx-1 opacity-70">/</span></li>
                <li><a href="/profiles" class="hover:text-gold transition-colors">Directory</a></li>
                <li><span class="mx-1 opacity-70">/</span></li>
                <li class="text-gold" aria-current="page">${provinceName}</li>
            </ol>
        </nav>

        <div class="flex items-end justify-between mb-8 border-b border-white/10 pb-6">
            <h2 class="text-2xl md:text-4xl font-serif text-white tracking-wide">
                โปรไฟล์น้องๆ <span class="text-gold italic font-light">พรีเมียม</span>
            </h2>
            <div class="flex items-center gap-3">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span class="text-[10px] text-white/70 tracking-[0.2em] uppercase font-semibold">${safeProfiles.length} Online Now</span>
            </div>
        </div>
        
        <!-- 🎨 3. ปรับ Contrast Filter Bar -->
        <div class="flex flex-wrap items-center gap-3 mb-12">
            <span class="text-[10px] text-white/60 uppercase tracking-[0.2em] mr-2 hidden md:inline-block font-bold">Filter:</span>
            <button class="text-[10px] md:text-[11px] px-5 py-2.5 rounded-full bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-black font-bold tracking-wider uppercase transition-all duration-300">
                ⭐ มาแรง (Trending)
            </button>
            <button class="text-[10px] md:text-[11px] px-5 py-2.5 rounded-full bg-white/[0.05] text-white/90 border border-white/10 hover:border-gold hover:text-gold font-semibold tracking-wider uppercase transition-all duration-300">
                💰 เรทเริ่มต้น 1,500
            </button>
            <button class="text-[10px] md:text-[11px] px-5 py-2.5 rounded-full bg-white/[0.05] text-white/90 border border-white/10 hover:border-gold hover:text-gold font-semibold tracking-wider uppercase transition-all duration-300">
                💎 VIP Class
            </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10 mb-20">
            ${cardsHTML}
        </div>

        ${safeProfiles.length >= 80 ? `
        <div class="flex justify-center mb-28">
            <a href="/search?province=${provinceKey}" class="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#121212] border border-white/20 text-white text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase rounded-full hover:border-gold hover:text-gold transition-all duration-300 overflow-hidden shadow-2xl hover:-translate-y-1">
                <span class="relative z-10">ดูโปรไฟล์ทั้งหมด</span>
                <i class="fas fa-arrow-right relative z-10 text-[10px] group-hover:translate-x-1 transition-transform"></i>
                <div class="absolute inset-0 h-full w-0 bg-gold/10 group-hover:w-full transition-all duration-500 ease-out z-0"></div>
            </a>
        </div>
        ` : '<div class="mb-28"></div>'}

        <!-- 🎨 4. ปรับ Contrast ส่วน Trust Signals (ข้อความสว่างขึ้น) -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 mb-40 max-w-6xl mx-auto px-4 border-t border-white/5 pt-20">
            <div class="text-center group">
                <div class="w-20 h-20 mx-auto mb-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500 bg-[#0a0a0a]">
                    <i class="fas fa-shield-alt text-3xl text-gold"></i>
                </div>
                <h3 class="text-sm font-bold tracking-[0.2em] uppercase text-white mb-4">No Deposit</h3>
                <p class="text-xs text-white/70 leading-relaxed font-light">ชำระเงินกับผู้ให้บริการโดยตรงเมื่อพบตัวจริง ไม่มีการโอนมัดจำล่วงหน้า ปลอดภัย 100%</p>
            </div>
            <div class="text-center group">
                <div class="w-20 h-20 mx-auto mb-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500 bg-[#0a0a0a]">
                    <i class="fas fa-gem text-3xl text-gold"></i>
                </div>
                <h3 class="text-sm font-bold tracking-[0.2em] uppercase text-white mb-4">Quality Verified</h3>
                <p class="text-xs text-white/70 leading-relaxed font-light">คัดกรองเฉพาะงานคุณภาพ ตรงปก พร้อมการดูแลระดับพรีเมียม</p>
            </div>
            <div class="text-center group">
                <div class="w-20 h-20 mx-auto mb-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500 bg-[#0a0a0a]">
                    <i class="fas fa-user-secret text-3xl text-gold"></i>
                </div>
                <h3 class="text-sm font-bold tracking-[0.2em] uppercase text-white mb-4">Privacy Focus</h3>
                <p class="text-xs text-white/70 leading-relaxed font-light">เราให้ความสำคัญกับความเป็นส่วนตัวของลูกค้าเป็นอันดับหนึ่ง ข้อมูลถูกเก็บเป็นความลับ</p>
            </div>
        </section>

        <div class="max-w-4xl mx-auto">
            ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
        </div>
    </main>

<!-- 🎨 5. ปรับ Contrast Footer (ตัวหนังสือสว่างขึ้น) -->
<footer class="border-t border-white/10 bg-[#050505] pt-24 pb-12 mt-20">
    <div class="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20">
            <div class="md:col-span-5 space-y-8">
                <h3 class="text-2xl font-serif tracking-[0.3em] text-white uppercase">
                    ไซด์ไลน์<span class="text-gold italic ml-1">${provinceData.key.toUpperCase()}</span>
                </h3>
                <p class="text-[13px] text-white/90 leading-relaxed max-w-sm font-light tracking-wide">
                    Thailand's most prestigious directory for premium personal companion and modeling services. We redefine the standard of excellence, privacy, and safety.
                </p>
                <div class="flex gap-6">
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" aria-label="Twitter" class="text-white/80 hover:text-gold transition-all text-2xl"><i class="fab fa-x-twitter"></i></a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="Line" class="text-white/80 hover:text-gold transition-all text-2xl"><i class="fab fa-line"></i></a>
                </div>
            </div>

            <div class="md:col-span-3">
                <h4 class="text-[10px] font-black text-white/60 tracking-[0.4em] uppercase mb-8">Navigation</h4>
                <ul class="space-y-4 text-[13px] text-white font-medium uppercase tracking-widest">
                    <li><a href="/" class="underline decoration-white/30 underline-offset-8 hover:text-gold transition-colors">Home</a></li>
                    <li><a href="/profiles" class="underline decoration-white/30 underline-offset-8 hover:text-gold transition-colors">Directory</a></li>
                    <li><a href="/location/chiangmai" class="underline decoration-white/30 underline-offset-8 hover:text-gold transition-colors">เชียงใหม่</a></li>
                </ul>
            </div>

            <div class="md:col-span-4">
                <h4 class="text-[10px] font-black text-white/60 tracking-[0.4em] uppercase mb-8">Legal & Privacy</h4>
                <p class="text-[12px] text-white/90 leading-relaxed font-light mb-6 uppercase tracking-wider">
                    Models are independent contractors. You must be 20+ to enter. We provide information only and do not facilitate transactions.
                </p>
                <div class="inline-flex items-center gap-2 border border-gold/50 px-5 py-2 rounded-full text-[10px] text-gold uppercase tracking-[0.25em] font-bold bg-gold/5">
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
    
    <div class="bg-[#059645] border border-white/30 rounded-full px-6 py-3 flex items-center gap-3 shadow-[0_15px_30px_-5px_rgba(5,150,69,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(5,150,69,0.5)] transition-shadow duration-300">
        
        <div class="relative flex items-center justify-center">
            <i class="fab fa-line text-white text-3xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true"></i>
            
            <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
            </span>
        </div>

        <!-- 🎨 7. แก้ Contrast ปุ่ม Contact: จาก text-white/90 เป็น text-white เพื่อให้สว่างขึ้น -->
        <div class="flex flex-col items-start leading-tight">
            <span class="text-[12px] text-white uppercase tracking-wider font-semibold">Contact</span>
            <span class="text-[16px] text-white font-black tracking-normal">ติดต่อสอบถาม</span>
        </div>
    </div>
</a>

<script>
    (() => {
        const nav = document.querySelector('nav');
        if (!nav) return;

        let ticking = false;
        const updateNav = () => {
            const scrollPos = window.scrollY || window.pageYOffset;
            nav.classList.toggle('nav-scrolled', scrollPos > 50);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });
        updateNav();
    })();

    document.addEventListener("DOMContentLoaded", () => {
        const ageGate = document.getElementById('age-gate');
        if(!ageGate) return; // ข้ามไปถ้าโดนซ่อนเพราะเป็น GoogleBot
        
        if (localStorage.getItem('ageVerified') === 'true') {
            ageGate.style.display = 'none';
        } else {
            document.body.style.overflow = 'hidden';
        }
    });

    window.acceptAgeGate = function() {
        const ageGate = document.getElementById('age-gate');
        if(!ageGate) return;
        
        localStorage.setItem('ageVerified', 'true');
        ageGate.style.opacity = '0';
        document.body.style.overflow = 'auto'; 
        setTimeout(() => {
            ageGate.style.display = 'none';
        }, 500); 
    };
</script>
</body>
</html>`;

        return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=3600" } });
    } catch (e) {
        console.error('SSR Critical Error:', e);
        return new Response('<div style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;">System is updating. Please try again in a few minutes.</div>', { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
};