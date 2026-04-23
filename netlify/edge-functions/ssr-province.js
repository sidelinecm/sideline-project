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
    if (path.includes('upload')) {
      const transform = `f_auto,q_auto_best,w${width},h${height},c_fill,g_face`;
      return path.replace('upload', `upload/${transform}`);
    }
    return path;
  }
  
  if (path.startsWith('http')) return path;
  
  return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=85`;
};

// CSS Variables + Custom Styles แบบสมบูรณ์
const generateFullStyles = () => `
  :root {
    --bg-primary: #0a0e1f;
    --bg-secondary: #1a1f3a;
    --glass-bg: rgba(255,255,255,0.08);
    --glass-border: rgba(255,255,255,0.12);
    --accent-blue: #3b82f6;
    --accent-glow: #60a5fa;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --success: #10b981;
    --glow-shadow: 0 0 20px rgba(59,130,246,0.4);
    --neon-glow: 0 0 15px rgba(16,185,129,0.6);
  }
  
  * { box-sizing: border-box; }
  body { 
    margin: 0; 
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%); 
    color: var(--text-primary); 
    font-family: 'Outfit', 'Prompt', sans-serif; 
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  
  .glass { 
    background: var(--glass-bg); 
    border: 1px solid var(--glass-border); 
    backdrop-filter: blur(20px); 
    -webkit-backdrop-filter: blur(20px); 
  }
  
  .hero-gradient::before {
    content: ''; 
    position: absolute; 
    top: 0; left: 0; right: 0; bottom: 0; 
    background: radial-gradient(circle at 20% 80%, var(--accent-blue)/20 0%, transparent 50%); 
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-10px) scale(1.02); }
  }
  
  .scrollbar-hide {
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  
  .profile-card-hover:hover {
    border-color: var(--accent-blue) !important;
    box-shadow: var(--glow-shadow) !important;
    transform: translateY(-4px) !important;
  }
  
  .badge-vip { background: linear-gradient(135deg, #8b5cf6, #ec4899); box-shadow: 0 0 10px rgba(168,85,247,0.4); }
  .badge-trending { background: linear-gradient(135deg, #f97316, #dc2626); box-shadow: 0 0 10px rgba(234,88,12,0.4); }
  .badge-verified { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(10px); }
  
  /* Responsive Grid */
  @media (min-width: 768px) { .profiles-grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  @media (min-width: 1024px) { .profiles-grid { grid-template-columns: repeat(4, minmax(0,1fr)); gap: 1.5rem; } }
  
  /* Selection */
  ::selection { background: var(--accent-blue); color: white; }
`;

export default async (request, context) => {
  try {
    const url = new URL(request.url);
    
    // Province redirect
    if (url.searchParams.has('province')) {
      const provinceValue = url.searchParams.get('province');
      const cleanUrl = new URL(`/location/${provinceValue}`, url.origin);
      return Response.redirect(cleanUrl.toString(), 301);
    }
    
    const pathParts = url.pathname.split('/').filter(Boolean);
    const rawProvinceKey = pathParts[pathParts.length - 1] || 'chiangmai';
    const provinceKey = decodeURIComponent(rawProvinceKey.toLowerCase());
    
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    
    const [provinceRes, profilesRes, allProvincesRes] = await Promise.all([
      supabase
        .from('provinces')
        .select('id, nameThai, key')
        .eq('key', provinceKey)
        .maybeSingle(),
      supabase
        .from('profiles')
        .select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, createdat, active, availability, likes')
        .eq('provinceKey', provinceKey)
        .eq('active', true)
        .order('isfeatured', { ascending: false })
        .order('lastUpdated', { ascending: false })
        .limit(80),
      supabase
        .from('provinces')
        .select('key, nameThai')
        .order('nameThai', { ascending: true })
    ]);
    
    const provinceData = provinceRes.data;
    const profiles = profilesRes.data;
    const allProvinces = allProvincesRes.data;
    
    if (!provinceData || provinceRes.error) {
      return context.next();
    }
    
    const safeProfiles = profiles || [];
    const provinceName = provinceData.nameThai;
    const seoData = PROVINCES_SEO_DATA[provinceKey] || PROVINCES_SEO_DATA.default;
    const zones = seoData.zones;
    
    const now = new Date();
    const CURRENT_YEAR = now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric' });
    const CURRENT_MONTH = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', month: 'long' });
    const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
    
    const firstImage = safeProfiles.length > 0 
      ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
      : `${CONFIG.DOMAIN}/images/seo-default.webp`;
    
    const title = `${provinceName} - ${provinceName} ${CURRENT_MONTH} ${CURRENT_YEAR}`;
    const description = `${provinceName} ${provinceName} Sideline ${safeProfiles.length}+ ${zones.slice(0,3).join(', ')} 100% Verified`;
    
    const provinceLinksHtml = allProvinces?.map(p => 
      `<a href="/location/${p.key}" class="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-all duration-300 border-b border-transparent hover:border-[var(--accent-blue)] pb-0.5 py-1.5 whitespace-nowrap">${p.nameThai}</a>`
    ).join(' | ') || '';
    
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
    

    let cardsHTML = '';
    if (safeProfiles.length > 0) {
      cardsHTML = safeProfiles.map((p, i) => {
        const cleanName = p.name.replace(/[?]/g, '');
        const profileLocation = `${p.location || provinceName}`;
        const busyKeywords = ['busy', 'เต็ม', 'จอง', 'ไม่ว่าง'];
        let isAvailable = true;
        
        if (p.availability) {
          const availText = p.availability.toLowerCase();
          isAvailable = !busyKeywords.some(kw => availText.includes(kw));
        }
        
        const statusText = isAvailable ? 'Available' : 'Busy';
        const dateStr = p.lastUpdated || p.createdat || new Date().toISOString();
        const d = new Date(dateStr);
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const dateDisplay = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
        
        // SEO Data
        const intents = seoData.intents || [];
        const traits = seoData.traits || [];
        const lsiKeywords = seoData.lsi || [];
        const targetIntent = intents[i % intents.length];
        const targetTrait = traits[i % traits.length];
        const targetKeyword = lsiKeywords[i % lsiKeywords.length];
        
        const imgAlt = `${cleanName} ${profileLocation} ${targetTrait} ${targetIntent}`;
        const profileLink = `/sideline/${p.slug}/${p.id}`;
        const loadingAttr = i < 4 ? 'fetchpriority="high" loading="lazy"' : 'loading="lazy"';
        
        // Badge
        let badgeHTML = '';
        const rateNum = p.rate ? parseInt(String(p.rate).replace(/,/g, ''), 10) : 0;
        if (rateNum >= 4000) {
          badgeHTML = `<span class="badge-vip text-white text-[10px] px-2 py-0.5 rounded-sm font-bold tracking-wider uppercase shadow-lg">VIP</span>`;
        } else if (i < 3 && p.isfeatured) {
          badgeHTML = `<span class="badge-trending text-white text-[10px] px-2 py-0.5 rounded-sm font-bold tracking-wider uppercase shadow-lg">Trending</span>`;
        } else {
          badgeHTML = `<span class="badge-verified text-[var(--text-secondary)] text-[10px] px-2 py-0.5 rounded-sm font-bold tracking-wider uppercase backdrop-blur-sm">Verified</span>`;
        }
        
        return `
          <article class="group relative h-80 overflow-hidden rounded-2xl glass shadow-xl profile-card-hover transition-all duration-500 cursor-pointer">
            <a href="${profileLink}" class="absolute inset-0 z-10" aria-label="${cleanName}"></a>
            <div class="relative h-4/5 overflow-hidden rounded-t-2xl">
              <img src="${optimizeImg(p.imagePath, 400, 500)}" alt="${imgAlt}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${loadingAttr} decoding="async">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
            </div>
            <div class="absolute bottom-3 left-3 right-3 z-20">
              <h3 class="font-bold text-lg truncate text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors leading-tight">${cleanName}</h3>
              <div class="flex justify-between items-center mt-1 text-xs">
                <span class="text-[var(--accent-glow)] font-bold tabular-nums">${p.rate}</span>
                <span class="text-[var(--text-secondary)] truncate">${profileLocation}</span>
              </div>
              <div class="flex items-center mt-2">
                <div class="w-2 h-2 rounded-full ${isAvailable ? 'bg-[var(--success)] shadow-[var(--neon-glow)] animate-pulse' : 'bg-red-500 shadow-lg animate-pulse'} mr-2"></div>
                <span class="text-xs uppercase tracking-wider ${isAvailable ? 'text-[var(--success)]' : 'text-red-400'} font-medium">${statusText}</span>
              </div>
            </div>
            <div class="absolute top-3 right-3 z-30 flex flex-col gap-1 items-end">
              ${badgeHTML}
            </div>
          </article>
        `;
      }).join('');
    }
    
    const html = String.raw`
<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0a0e1f">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="SidelineCM">
  
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- SEO Meta -->
  <meta name="keywords" content="${provinceName}, ${provinceName}, sideline ${provinceName}, escort ${provinceName}, คอล ${provinceName}, นวด ${provinceName}, ${provinceName}, sideline เชียงใหม่, เชียงใหม่ sideline">
  <link rel="canonical" href="${provinceUrl}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="google-site-verification" content="0NIQUDZv9Y2WtNhjqSPTV3TuPsildmmO-TPwdMlSfg">
  
  <meta name="geo.region" content="TH-50">
  <meta name="geo.placename" content="${provinceName}">
  
  <!-- Open Graph -->
  <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${provinceUrl}">
  <meta property="og:image" content="${firstImage}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${firstImage}">
  
  <!-- Fonts & Icons -->
  <link rel="shortcut icon" href="/images/favicon.ico">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
  <link rel="preload" href="${firstImage}" as="image" fetchpriority="high">
  
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Prompt:wght@300;400;500&display=swap" media="print" onload="this.media='all'">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'">
  
  <!-- Tailwind CSS v3.4.17 -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: { extend: { colors: { 'accent-blue': '#3b82f6' } } }
    }
  </script>
  
  <!-- Schema.org -->
  <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
  
  <style>${generateFullStyles()}</style>
</head>

<body class="selection:bg-[var(--accent-blue)] selection:text-white antialiased text-[var(--text-primary)] bg-[var(--bg-primary)] overflow-x-hidden">
  
  <!-- Age Gate (Bot Bypass) -->
  ${ageGateHTML || ''}
  
  <!-- Modern Glass Nav -->
  <nav class="fixed top-0 w-full z-[999] backdrop-blur-xl bg-[var(--glass-bg)] border-b border-[var(--glass-border)] transition-all duration-700 py-3 px-4">
    <div class="container mx-auto max-w-6xl flex justify-between items-center">
      <a href="/" class="text-2xl font-serif text-[var(--text-primary)] hover:text-[var(--accent-blue)] transition-all duration-300 font-semibold tracking-wide">
        SIDELINE<span class="text-[var(--accent-blue)] italic ml-1 font-normal">${provinceData.key.toUpperCase()}</span>
      </a>
      <div class="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider uppercase">
        <a href="/" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">Home</a>
        <a href="/profiles" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">Profiles</a>
        <span class="text-[var(--accent-blue)] border-b-2 border-[var(--accent-blue)] pb-1 font-semibold">${provinceName}</span>
      </div>
    </div>
  </nav>
  
  <!-- Compact Hero 50vh -->
  <header class="relative pt-20 pb-20 px-4 hero-gradient flex flex-col items-center justify-center text-center overflow-hidden min-h-[50vh] md:min-h-[60vh]">
    <div class="max-w-4xl mx-auto space-y-6 z-10">
      <div class="inline-flex px-4 py-1.5 glass rounded-full text-xs font-semibold tracking-wider text-[var(--accent-blue)] backdrop-blur-sm animate-pulse shadow-lg">
        ${CURRENT_MONTH} ${parseInt(CURRENT_YEAR) + 543}
      </div>
      <h1 class="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight">
        <span class="block font-light opacity-95">${provinceName}</span>
      </h1>
      <p class="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed opacity-90">
        Premium Directory • 100% Verified Profiles • Instant Booking 24/7
      </p>
      <!-- Zones Chips Horizontal Scroll -->
      <div class="flex overflow-x-auto gap-2 pb-4 scrollbar-hide max-w-full">
        ${zones.slice(0,12).map(zone => 
          `<a href="/search?zone=${encodeURIComponent(zone)}&province=${provinceKey}" 
             class="px-4 py-2 glass rounded-full text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] hover:shadow-[var(--glow-shadow)] transition-all duration-300 whitespace-nowrap flex-shrink-0 backdrop-blur-sm">
             ${zone.toUpperCase()}
           </a>`
        ).join('')}
      </div>
    </div>
  </header>
  
  <!-- Compact Stats Bar -->
  <div class="glass border border-[var(--glass-border)] backdrop-blur-xl shadow-2xl mx-4 md:mx-8 lg:mx-auto max-w-5xl rounded-3xl p-6 mb-12 md:mb-16">
    <div class="grid grid-cols-3 divide-x divide-[var(--glass-border)] text-center gap-4">
      <div>
        <div class="text-3xl md:text-4xl font-serif text-[var(--accent-blue)] mb-1 font-bold">${safeProfiles.length}</div>
        <div class="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Profiles</div>
      </div>
      <div>
        <div class="text-3xl md:text-4xl font-serif text-[var(--text-primary)] mb-1 font-bold">${latestUpdateDate}</div>
        <div class="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Updated</div>
      </div>
      <div>
        <div class="text-3xl md:text-4xl font-serif text-[var(--success)] mb-1 font-bold">100%</div>
        <div class="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Verified</div>
      </div>
    </div>
  </div>
  
  <!-- Profiles Grid Compact Responsive -->
  <main class="px-4 md:px-8 lg:px-12 pb-20">
    <div class="max-w-7xl mx-auto">
      <div class="profiles-grid grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 auto-rows-fr mb-16">
        ${cardsHTML}
      </div>
      
      <!-- Trust Signals Compact -->
      <section class="glass rounded-3xl p-8 mb-16">
        <h3 class="text-2xl md:text-3xl font-serif text-center mb-8 text-[var(--text-primary)] tracking-wide">Why Choose Us?</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div class="space-y-2">
            <i class="fas fa-shield-check text-4xl text-[var(--success)] mb-3 block mx-auto shadow-[var(--neon-glow)]"></i>
            <h4 class="font-semibold text-lg text-[var(--text-primary)]">100% Verified</h4>
            <p class="text-sm text-[var(--text-secondary)]">Every profile checked manually</p>
          </div>
          <div class="space-y-2">
            <i class="fas fa-bolt text-4xl text-[var(--accent-blue)] mb-3 block mx-auto shadow-[var(--glow-shadow)]"></i>
            <h4 class="font-semibold text-lg text-[var(--text-primary)]">Instant Booking</h4>
            <p class="text-sm text-[var(--text-secondary)]">24/7 Line response guaranteed</p>
          </div>
          <div class="space-y-2">
            <i class="fas fa-crown text-4xl text-yellow-400 mb-3 block mx-auto shadow-lg shadow-yellow-500/30"></i>
            <h4 class="font-semibold text-lg text-[var(--text-primary)]">Premium Only</h4>
            <p class="text-sm text-[var(--text-secondary)]">5-star quality selection</p>
          </div>
        </div>
      </section>
      
      <!-- FAQ Accordion Compact -->
      <section class="max-w-4xl mx-auto mb-20">
        <h3 class="text-2xl md:text-3xl font-serif text-center mb-12 text-[var(--text-primary)] tracking-wide">Frequently Asked Questions</h3>
        <div class="space-y-4">
          ${seoData.faqs.map(faq => `
            <div class="glass rounded-2xl p-6 hover:shadow-[var(--glow-shadow)] hover:scale-[1.02] transition-all duration-300 hover:border-[var(--accent-blue)]">
              <h4 class="text-lg font-semibold text-[var(--accent-blue)] mb-3 font-medium">${faq.q}</h4>
              <p class="text-sm leading-relaxed text-[var(--text-secondary)]">${faq.a}</p>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  </main>
  
  <!-- Modern Footer -->
  <footer class="glass border-t border-[var(--glass-border)] backdrop-blur-xl mt-20 pt-12 pb-8 px-6">
    <div class="max-w-6xl mx-auto text-center space-y-6">
      <div class="flex justify-center items-center gap-6 text-2xl mb-8">
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="text-[var(--accent-blue)] hover:text-[var(--accent-glow)] hover:scale-110 transition-all duration-300 shadow-[var(--glow-shadow)] p-2 rounded-full glass">
          <i class="fab fa-line"></i>
        </a>
        <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" class="text-[var(--text-secondary)] hover:text-white hover:scale-110 transition-all duration-300 p-2 rounded-full glass">
          <i class="fab fa-tiktok"></i>
        </a>
        <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" class="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:scale-110 transition-all duration-300 p-2 rounded-full glass">
          <i class="fab fa-twitter"></i>
        </a>
      </div>
      <div class="text-xs text-[var(--text-secondary)]">
        © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}. All rights reserved. | 
        <a href="/privacy" class="hover:text-[var(--accent-blue)] transition-colors">Privacy</a> | 
        <a href="/terms" class="hover:text-[var(--accent-blue)] transition-colors">Terms</a>
      </div>
      <div class="text-[11px] text-[var(--text-secondary)] opacity-75">
        ${provinceLinksHtml}
      </div>
    </div>
  </footer>

</body>
</html>
    `;
    
    return new Response(html, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=1800'
      }
    });
    
  } catch (error) {
    console.error('SSR Error:', error);
    return context.next();
  }
};