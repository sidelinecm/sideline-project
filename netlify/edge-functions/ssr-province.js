import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// --- 1. CONFIGURATION ---
const CONFIG = {
    // ใน Production ควรใช้ Deno.env.get('SUPABASE_KEY') แทนการ Hardcode
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Thailand',
    DEFAULT_IMG: 'default-profile.webp' // ชื่อรูป Default ใน Storage
};

// --- 2. HELPER FUNCTIONS ---

// จัดการ URL รูปภาพ (รองรับทั้ง Path จาก Supabase, URL เต็ม และกรณีไม่มีรูป)
const optimizeImg = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/${CONFIG.DEFAULT_IMG}`;
    if (path.startsWith('http')) return path; // กรณีเป็น External URL
    // ปรับขนาดรูปเป็น 300px เพื่อความเร็ว (Lighthouse Score)
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=300&quality=75&format=webp`;
};

// สุ่มจังหวัดใกล้เคียงสำหรับ Internal Linking (ช่วยเรื่อง Crawl Budget)
const getNearbyProvinces = (currentSlug) => {
    const list = [
        {n:'เชียงใหม่', s:'chiangmai'}, {n:'กรุงเทพ', s:'bangkok'}, 
        {n:'ชลบุรี', s:'chonburi'}, {n:'ขอนแก่น', s:'khon-kaen'}, {n:'ภูเก็ต', s:'phuket'},
        {n:'หาดใหญ่', s:'hatyai'}, {n:'โคราช', s:'korat'}, {n:'อุดรธานี', s:'udonthani'},
        {n:'ระยอง', s:'rayong'}, {n:'พิษณุโลก', s:'phitsanulok'}
    ];
    return list.filter(p => p.s !== currentSlug).sort(() => 0.5 - Math.random()).slice(0, 6);
};

// ข้อมูลโซนสำหรับ SEO (Static Mapping)
const getLocalZones = (key) => {
    const map = {
        'chiangmai': ['นิมมาน', 'สันติธรรม', 'ท่าแพ', 'เจ็ดยอด', 'แม่โจ้', 'ไนท์บาซาร์'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ทองหล่อ', 'สีลม', 'พระราม9'],
        'chonburi': ['พัทยา', 'บางแสน', 'ศรีราชา', 'บ่อวิน', 'อมตะ', 'นาเกลือ'],
        'khon-kaen': ['มข.', 'ในเมือง', 'กังสดาล', 'หลังมอ', 'บึงแก่นนคร', 'ศิลา'],
        'phuket': ['ป่าตอง', 'กะทู้', 'ถลาง', 'ราไวย์', 'เมืองภูเก็ต', 'กะรน']
    };
    return map[key] || ['ตัวเมือง', 'โซนยอดนิยม', 'ใกล้ฉัน', 'ย่านธุรกิจ', 'โรงแรมดัง'];
};

// --- 3. MAIN LOGIC ---
export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // ตรวจสอบ Bot (Optional: ถ้าต้องการให้ไฟล์นี้ทำงานเฉพาะ Bot ให้เปิด Comment ด้านล่าง)
    // const isBot = /bot|google|spider|crawler|facebook|twitter|line/i.test(ua);
    // if (!isBot && !request.url.includes('?debug=true')) return context.next();

    try {
        const url = new URL(request.url);
        const provinceKey = url.pathname.split('/').pop(); // /location/chiangmai -> chiangmai

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // A. ดึงข้อมูลจังหวัด (ใช้ maybeSingle เพื่อไม่ให้ Error หากไม่พบ)
        const { data: provinceData, error: provError } = await supabase
            .from('provinces')
            .select('id, nameThai, slug')
            .eq('slug', provinceKey)
            .maybeSingle();

        // หากไม่พบจังหวัด หรือ Database Error ให้ส่งต่อให้ Client จัดการ (404)
        if (provError || !provinceData) {
            return context.next();
        }

        // B. ดึงข้อมูลน้องๆ (Optimized Query)
        const { data: profiles, error: profError } = await supabase.from('profiles')
            .select('id, slug, name, imagePath, verified, location, rate, age, created_at')
            .eq('province_id', provinceData.id)
            .eq('status', 'active') // เอาเฉพาะคนที่สถานะ Active
            .order('verified', { ascending: false }) // Verified ขึ้นก่อน
            .order('created_at', { ascending: false }) // ตามด้วยคนมาใหม่
            .limit(60); // Limit ป้องกัน Payload ใหญ่เกิน

        // กรณีไม่มีข้อมูลน้องเลย ให้ Client จัดการหน้า Empty
        if (profError || !profiles || profiles.length === 0) {
            return context.next();
        }

        // C. Data Segmentation (จัดกลุ่มเพื่อการแสดงผล)
        const verifiedProfiles = profiles.filter(p => p.verified).slice(0, 6);
        const newProfiles = profiles.filter(p => !verifiedProfiles.includes(p)).slice(0, 12);
        const otherProfiles = profiles.filter(p => !verifiedProfiles.includes(p) && !newProfiles.includes(p));

        // D. SEO & Content Generation
        const provinceName = provinceData.nameThai;
        const zones = getLocalZones(provinceKey);
        const count = profiles.length;
        const minPrice = profiles.length > 0 ? Math.min(...profiles.map(p => parseInt((p.rate||"0").replace(/\D/g, '')) || 1500)) : 1500;
        
        const title = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง โซน${zones[0]} | งานดีตรงปก ${new Date().getFullYear()}`;
        const desc = `ค้นหาสาวไซด์ไลน์${provinceName} ยอดนิยมในโซน ${zones.slice(0,3).join(', ')} พบกับโปรไฟล์น้องๆ ${count} คน รับงานเอง ฟิวแฟน ไม่ผ่านเอเย่นต์ ไม่มัดจำ ราคาเริ่ม ${minPrice} บาท`;
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        // E. ADVANCED SCHEMA.ORG (Breadcrumb + Collection + FAQ)
        const schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type": "CollectionPage",
                    "name": title,
                    "description": desc,
                    "url": provinceUrl,
                    "mainEntity": {
                        "@type": "ItemList",
                        "itemListElement": profiles.slice(0, 20).map((p, i) => ({
                            "@type": "ListItem",
                            "position": i + 1,
                            "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                            "name": `น้อง${p.name}`
                        }))
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        { 
                            "@type": "Question", 
                            "name": `ไซด์ไลน์${provinceName} ราคาเริ่มต้นเท่าไหร่?`, 
                            "acceptedAnswer": { "@type": "Answer", "text": `เรทค่าขนมสำหรับน้องๆ ไซด์ไลน์${provinceName} เริ่มต้นประมาณ ${minPrice.toLocaleString()} - 2,500 บาท ขึ้นอยู่กับรูปรูปร่างหน้าตาและประเภทงาน (ฟิวแฟน, ทานข้าว, งานเอน) ครับ` } 
                        },
                        { 
                            "@type": "Question", 
                            "name": `รับงานโซนไหนบ้างใน${provinceName}?`, 
                            "acceptedAnswer": { "@type": "Answer", "text": `น้องๆ ของเรากระจายอยู่ทั่วพื้นที่ โดยเฉพาะโซนยอดนิยมอย่าง ${zones.join(', ')} และพื้นที่ใกล้เคียง สามารถนัดเจอที่โรงแรมหรือคอนโดได้ตามตกลงครับ` } 
                        },
                        {
                             "@type": "Question", 
                             "name": "ปลอดภัยไหม ต้องโอนมัดจำไหม?",
                             "acceptedAnswer": { "@type": "Answer", "text": "เว็บไซต์ Sideline Thailand เน้นความปลอดภัยเป็นหลัก **ไม่มีนโยบายให้โอนมัดจำก่อน** ให้ลูกค้าชำระเงินหน้างานเมื่อพบน้องตัวจริงแล้วเท่านั้นครับ" }
                        }
                    ]
                }
            ]
        };

        // Helper: สร้าง HTML Card (แยกออกมาเพื่อให้ code clean)
        const createCard = (p) => {
            const imgUrl = optimizeImg(p.imagePath);
            const name = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
            const price = parseInt((p.rate || "1500").toString().replace(/\D/g, '')).toLocaleString();
            
            return `
            <a href="/sideline/${p.slug}" class="card">
                <div class="img-box">
                    <img src="${imgUrl}" alt="${name} ${provinceName}" loading="lazy" width="300" height="375">
                    <div class="price-tag">฿${price}</div>
                    ${p.verified ? '<div class="ver-badge">Verified</div>' : ''}
                </div>
                <div class="card-info">
                    <div class="c-name">${name} <span class="c-age">${p.age ? p.age+'ปี' : ''}</span></div>
                    <div class="c-loc">📍 ${p.location || provinceName}</div>
                </div>
            </a>`;
        };

        const nearbyLinks = getNearbyProvinces(provinceKey).map(n => 
            `<a href="/location/${n.s}" class="zone-tag">ไซด์ไลน์${n.n}</a>`
        ).join('');

        // --- F. HTML CONSTRUCTION ---
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="${provinceUrl}">
    
    <!-- Social Meta Tags -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="${optimizeImg(profiles[0].imagePath)}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="th_TH">
    <meta name="twitter:card" content="summary_large_image">

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">${JSON.stringify(schema)}</script>

    <style>
        /* CSS Reset & Variables */
        :root { --primary: #ec4899; --bg: #0f172a; --card-bg: #1e293b; --text: #f8fafc; --subtext: #94a3b8; --border: #334155; }
        * { box-sizing: border-box; }
        body { font-family: -apple-system, 'Prompt', sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 20px; line-height: 1.6; }
        a { text-decoration: none; color: inherit; transition: 0.2s; }
        
        .container { max-width: 1024px; margin: 0 auto; }
        
        /* Headers */
        h1 { font-size: 1.8rem; text-align: center; margin-bottom: 2rem; background: linear-gradient(90deg, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; }
        h2 { font-size: 1.4rem; color: var(--primary); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-top: 3rem; display: flex; align-items: center; gap: 8px; }
        
        /* Stats Bar (Featured Snippet Optimization) */
        .stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 15px; margin-bottom: 30px; }
        .stat-box { text-align: center; }
        .stat-val { font-size: 1.1rem; font-weight: bold; color: #fff; display: block; }
        .stat-lbl { font-size: 0.8rem; color: var(--subtext); }

        /* Grid System */
        .profile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
        
        /* Card Design */
        .card { background: var(--card-bg); border-radius: 12px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: 0 10px 15px rgba(236, 72, 153, 0.2); }
        
        .img-box { position: relative; aspect-ratio: 4/5; background: #000; overflow: hidden; }
        .img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .card:hover img { transform: scale(1.05); }
        
        .price-tag { position: absolute; bottom: 0; right: 0; background: rgba(0,0,0,0.8); color: #fff; padding: 4px 8px; font-size: 0.9rem; font-weight: bold; border-top-left-radius: 8px; }
        .ver-badge { position: absolute; top: 8px; right: 8px; background: #10b981; color: #fff; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        
        .card-info { padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .c-name { font-weight: 700; font-size: 1rem; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .c-age { font-size: 0.8rem; font-weight: normal; color: var(--subtext); margin-left: 4px; }
        .c-loc { font-size: 0.8rem; color: var(--subtext); margin-top: 4px; display: flex; align-items: center; gap: 4px; }

        /* SEO Text Content */
        .seo-article { background: var(--card-bg); padding: 25px; border-radius: 12px; margin-top: 40px; color: #cbd5e1; font-size: 0.95rem; border: 1px solid var(--border); }
        .seo-article h3 { color: #fff; margin-top: 0; }
        .seo-article p { margin-bottom: 1rem; }
        .seo-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }
        .zone-tag { background: #334155; color: #e2e8f0; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; border: 1px solid transparent; }
        .zone-tag:hover { background: var(--primary); color: #fff; border-color: var(--primary); }

        /* Footer */
        .footer { text-align: center; font-size: 0.8rem; color: #64748b; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); }

        /* Responsive */
        @media (max-width: 640px) {
            .stats-bar { grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .profile-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
            h1 { font-size: 1.5rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Breadcrumb (Visible) -->
        <div style="font-size:0.8rem; color:#94a3b8; margin-bottom:15px;">
            <a href="${CONFIG.DOMAIN}">หน้าแรก</a> <span>/</span> 
            <span>ไซด์ไลน์${provinceName}</span>
        </div>

        <h1>แหล่งรวมไซด์ไลน์${provinceName} อันดับ 1</h1>
        
        <!-- Stats Summary for Google Snippet -->
        <div class="stats-bar">
            <div class="stat-box">
                <span class="stat-val">${minPrice.toLocaleString()}+</span>
                <span class="stat-lbl">ราคาเริ่มต้น (บาท)</span>
            </div>
            <div class="stat-box">
                <span class="stat-val">${count}</span>
                <span class="stat-lbl">คนรับงาน</span>
            </div>
            <div class="stat-box">
                <span class="stat-val">100%</span>
                <span class="stat-lbl">Verified</span>
            </div>
            <div class="stat-box">
                <span class="stat-val">24ชม.</span>
                <span class="stat-lbl">ออนไลน์</span>
            </div>
        </div>

        ${verifiedProfiles.length > 0 ? `
            <h2>💎 ดาวเด่น ${provinceName} (Verified)</h2>
            <div class="profile-grid">
                ${verifiedProfiles.map(createCard).join('')}
            </div>
        ` : ''}

        <h2>🔥 น้องๆ มาใหม่ล่าสุด</h2>
        <div class="profile-grid">
            ${newProfiles.map(createCard).join('')}
        </div>

        ${otherProfiles.length > 0 ? `
            <h2>💖 น้องๆ ทั้งหมดในพื้นที่</h2>
            <div class="profile-grid">
                ${otherProfiles.map(createCard).join('')}
            </div>
        ` : ''}

        <!-- SEO Article & Internal Links -->
        <div class="seo-article">
            <h3>ทำไมต้องหาไซด์ไลน์${provinceName}กับ ${CONFIG.BRAND_NAME}?</h3>
            <p>
                หากคุณกำลังมองหา <strong>ไซด์ไลน์${provinceName}</strong> หรือเพื่อนเที่ยวในโซน <em>${zones.join(', ')}</em> 
                ที่นี่คือศูนย์รวมน้องๆ ที่ผ่านการตรวจสอบตัวตน (Verified) รูปตรงปก ไม่จกตา มากที่สุดในจังหวัด
            </p>
            <p>
                เรามีน้องๆ หลากหลายสไตล์ ทั้งนักศึกษา วัยทำงาน สาวอวบ หรือตัวเล็กสเปคยอดนิยม พร้อมให้บริการแบบเป็นกันเอง 
                <strong>ปลอดภัย 100% ไม่มีการโอนมัดจำล่วงหน้า</strong> จ่ายเงินหน้างานเท่านั้น
            </p>
            
            <h4 style="color:#fff; margin-bottom:10px;">โซนยอดนิยมอื่นๆ</h4>
            <div class="seo-tags">
                ${nearbyLinks}
                <a href="/location/${provinceKey}" class="zone-tag">รับงาน${provinceName}</a>
                <a href="/location/${provinceKey}" class="zone-tag">หาเพื่อนเที่ยว${provinceName}</a>
            </div>
        </div>
        
        <div class="footer">
            &copy; ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}. All rights reserved.<br>
            แหล่งรวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง ปลอดภัย ไม่ผ่านเอเย่นต์
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8", 
                "cache-control": "public, max-age=3600, s-maxage=86400", // Cache CDN 1 วัน, Browser 1 ชม.
                "x-robots-tag": "index, follow"
            } 
        });

    } catch (e) {
        // Critical Error Handler: Log แล้วปล่อยผ่านไปหน้าปกติ
        console.error("SSR Province Error:", e);
        return context.next();
    }
};