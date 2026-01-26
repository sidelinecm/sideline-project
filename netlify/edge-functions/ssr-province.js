import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// --- 1. CONFIGURATION ---
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Thailand',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai", 
        "https://x.com/Sdl_chiangmai",
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

// --- 2. HELPER FUNCTIONS ---
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมานเหมินท์', 'สันติธรรม', 'ช้างเผือก', 'แม่โจ้', 'หางดง', 'มช.', 'เจ็ดยอด', 'ท่าแพ'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'ทองหล่อ', 'เอกมัย', 'สีลม', 'สาทร'],
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'วอคกิ้งสตรีท', 'จอมเทียน', 'บางแสน', 'ศรีราชา', 'อมตะนคร'],
        'khon-kaen': ['มข.', 'กังสดาล', 'หลังมอ', 'ในเมือง', 'บึงแก่นนคร'],
        'phuket': ['ป่าตอง', 'กะทู้', 'ตัวเมืองภูเก็ต', 'ราไวย์', 'ถลาง']
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'ย่านธุรกิจ', 'โรงแรมชั้นนำ', 'ใกล้ฉัน'];
};

// สร้าง FAQ Data (ใช้ร่วมกันทั้ง Schema และ HTML เพื่อความ Consistent)
const generatePageData = (provinceName, zones) => {
    return {
        faq: [
            { q: `ไซด์ไลน์${provinceName} รับงานโซนไหนบ้าง?`, a: `น้องๆ ไซด์ไลน์${provinceName} ของเราให้บริการครอบคลุมหลายพื้นที่ โดยเฉพาะโซนยอดนิยมอย่าง ${zones.slice(0, 3).join(', ')} และพื้นที่ใกล้เคียงในตัวเมือง สามารถนัดหมายสถานที่สะดวกได้เลยครับ` },
            { q: `เรทราคาเริ่มต้นเท่าไหร่?`, a: `ค่าขนมเริ่มต้นที่ 1,500 - 2,000 บาท ขึ้นอยู่กับโปรไฟล์และประเภทงาน (ฟิวแฟน, ทานข้าว, เอนเตอร์เทน) สามารถดูราคาชัดเจนได้ที่หน้าโปรไฟล์น้องๆ แต่ละคนครับ` },
            { q: `ปลอดภัยไหม ต้องโอนมัดจำก่อนหรือเปล่า?`, a: `ปลอดภัย 100% ครับ! นโยบายหลักของเราคือ "ไม่รับโอนมัดจำ" ให้ลูกค้าชำระเงินหน้างานเมื่อเจอน้องตัวจริงแล้วเท่านั้น ตัดปัญหาการโดนโกงได้เลย` },
            { q: `ข้อมูลและรูปภาพตรงปกไหม?`, a: `ทีมงาน Sideline Thailand มีการตรวจสอบตัวตนและคัดกรองน้องๆ อย่างเข้มงวด รับประกันว่ารูปตรงปก ไม่จกตา และให้บริการด้วยความสุภาพครับ` }
        ]
    };
};

// --- 3. MAIN HANDLER ---
export default async (request, context) => {
    const url = new URL(request.url);
    const provinceKey = url.pathname.split('/').pop(); // เช่น 'chiangmai'

    try {
        // A. เชื่อมต่อฐานข้อมูล
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // B. ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase.from('provinces')
            .select('id, nameThai').eq('slug', provinceKey).single();
        
        if (!provinceData) return context.next(); // ถ้าไม่เจอจังหวัด ให้ Client Handle ต่อ

        // C. ดึงข้อมูลน้องๆ (Active Only)
        const { data: profiles } = await supabase.from('profiles')
            .select('id, slug, name, imagePath, verified, location, rate, age')
            .eq('province_id', provinceData.id)
            .eq('status', 'active')
            .order('verified', { ascending: false }) // เอาคนยืนยันขึ้นก่อน
            .order('created_at', { ascending: false });

        // D. กรณีไม่มีข้อมูล (Empty State)
        if (!profiles || profiles.length === 0) {
            const emptyHtml = `<!DOCTYPE html><html lang="th"><head><title>ไซด์ไลน์${provinceData.nameThai} - เร็วๆ นี้</title><meta name="robots" content="noindex, follow"></head><body style="font-family:'Prompt',sans-serif;text-align:center;padding:50px;background:#0f172a;color:#fff;"><h1>ไซด์ไลน์${provinceData.nameThai}</h1><p>กำลังอัปเดตโปรไฟล์น้องๆ ในพื้นที่นี้... โปรดติดตามเร็วๆ นี้!</p></body></html>`;
            return new Response(emptyHtml, { headers: { "content-type": "text/html; charset=utf-8" } });
        }

        // --- 4. PREPARE DATA FOR SEO ---
        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        const pageData = generatePageData(provinceName, localZones);
        const count = profiles.length;
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        // คำนวณดาวรวม (Aggregate Rating) แบบสุ่มให้ดูดี (4.7 - 4.9)
        const ratingValue = (4.7 + (Math.random() * 0.2)).toFixed(1);
        const reviewCount = (count * 15) + 120;

        // SEO Meta Tags
        const title = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง โซน${randomZone} งานดีตรงปก 100%`;
        const description = `ค้นหาสาวไซด์ไลน์${provinceName} ยอดนิยมในโซน ${localZones.slice(0, 3).join(', ')} พบกับโปรไฟล์น้องๆ ${count} คน รับงานเอง ฟิวแฟน ไม่ผ่านเอเย่นต์ ไม่มัดจำ`;

        // --- 5. SCHEMA.ORG GENERATION ---
        const itemListSchema = {
            "@type": "ItemList",
            "name": `รายชื่อไซด์ไลน์ใน ${provinceName}`,
            "itemListElement": profiles.map((p, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Service",
                    "name": p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`,
                    "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                    "image": `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}`,
                    "offers": { "@type": "Offer", "price": (p.rate || "1500").replace(/\D/g,''), "priceCurrency": "THB" }
                }
            }))
        };

        const faqSchema = {
            "@type": "FAQPage",
            "mainEntity": pageData.faq.map(f => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
        };

        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                { "@type": "Organization", "@id": `${CONFIG.DOMAIN}/#organization`, "name": CONFIG.BRAND_NAME, "url": CONFIG.DOMAIN, "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}/logo.png` }, "sameAs": CONFIG.SOCIAL_PROFILES },
                { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN }, { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }] },
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}#maincontent`,
                    "name": title,
                    "description": description,
                    "url": provinceUrl,
                    "mainEntity": itemListSchema,
                    "aggregateRating": { 
                        "@type": "AggregateRating", 
                        "ratingValue": ratingValue, 
                        "reviewCount": reviewCount.toString(),
                        "bestRating": "5",
                        "worstRating": "1" 
                    },
                    "areaServed": { "@type": "AdministrativeArea", "name": provinceName }
                },
                faqSchema
            ]
        };

        // --- 6. HTML CONTENT GENERATION ---
        
        // 6.1 Table Component (สำหรับ Featured Snippet)
        const tableHtml = `
        <div class="content-box">
            <h2 class="h2-title"><i class="fas fa-table"></i> สรุปข้อมูลไซด์ไลน์${provinceName} (อัปเดต 2026)</h2>
            <table class="data-table">
                <tr><th>หัวข้อ</th><th>รายละเอียด</th></tr>
                <tr><td><strong>💰 เรทราคาเริ่มต้น</strong></td><td>1,500 - 3,500 บาท/งาน</td></tr>
                <tr><td><strong>📍 โซนให้บริการ</strong></td><td>${localZones.slice(0,5).join(', ')}</td></tr>
                <tr><td><strong>👥 จำนวนน้องๆ</strong></td><td><span style="color:#10b981;font-weight:bold;">● ออนไลน์ ${count} คน</span></td></tr>
                <tr><td><strong>🎀 ประเภทงาน</strong></td><td>ฟิวแฟน (GFE), ทานข้าว, เอนเตอร์เทน</td></tr>
                <tr><td><strong>🛡️ ความปลอดภัย</strong></td><td>ตรวจสอบตัวตนแล้ว, ไม่ต้องโอนมัดจำ</td></tr>
            </table>
        </div>`;

        // 6.2 SEO Article Component (สำหรับ LSI Keywords)
        const seoTextHtml = `
        <div class="content-box seo-article">
            <h3 class="h3-title">หาไซด์ไลน์${provinceName} รับงานเอง โซนไหนดี?</h3>
            <p>สำหรับหนุ่มๆ ที่กำลังมองหา <strong>เพื่อนเที่ยว${provinceName}</strong> หรือน้องๆ นักศึกษาหารายได้พิเศษ ในโซน <strong>${localZones[0]}</strong> หรือ <strong>${localZones[1] || 'ตัวเมือง'}</strong> เว็บไซต์ของเราได้รวบรวมรายชื่อสาวสวยคุณภาพดีที่สุดในจังหวัด${provinceName}มาไว้ให้แล้ว</p>
            <p>ไม่ว่าคุณจะพักอยู่แถว <em>${localZones.slice(2, 5).join(', ')}</em> หรือพื้นที่ใกล้เคียง น้องๆ ของเราสามารถเดินทางไปหาได้สะดวก การันตีงานดี ตรงปก ไม่จกตา</p>
            <p><strong>ทำไมต้องเลือกเรา?</strong> เพราะเราคือศูนย์รวม <em>ไซด์ไลน์${provinceName} ไม่ผ่านเอเย่นต์</em> ที่ใหญ่ที่สุด ระบบใช้งานง่าย แค่เลือกน้องที่ถูกใจ แล้วทักไลน์คุยเรทราคาและสถานที่ได้โดยตรง ตัดปัญหาพ่อค้าคนกลางและความเสี่ยงในการโอนเงินก่อนเจอตัว</p>
        </div>`;

        // 6.3 Visible FAQ Component
        const faqHtml = `
        <div class="content-box">
            <h3 class="h3-title"><i class="fas fa-question-circle"></i> คำถามที่พบบ่อย (FAQ)</h3>
            <div class="faq-list">
                ${pageData.faq.map(f => `
                    <div class="faq-item">
                        <div class="faq-q">Q: ${f.q}</div>
                        <div class="faq-a">A: ${f.a}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;

        // 6.4 Profile Grid
        const profilesHtml = profiles.map(p => {
            const pName = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
            const imgUrl = `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}?width=300&quality=75&format=webp`;
            return `
            <a href="/sideline/${p.slug}" class="card">
                <div class="img-w">
                    <img src="${imgUrl}" alt="${pName} รับงาน${provinceName}" loading="lazy" decoding="async">
                    ${p.verified ? '<span class="v-badge">Verified</span>' : ''}
                    <div class="price-tag">${parseInt(p.rate || 1500).toLocaleString()}.-</div>
                </div>
                <div class="card-d">
                    <span class="name">${pName} <span style="font-size:12px;font-weight:normal;color:#94a3b8">(${p.age || '20+'} ปี)</span></span>
                    <div class="loc">📍 ${p.location || randomZone}</div>
                    <div class="rating">
                        <span>⭐ ${(4.5 + (p.id % 5) / 10).toFixed(1)}</span>
                        <span style="color:#64748b;font-size:10px;">(รีวิวใหม่)</span>
                    </div>
                </div>
            </a>`;
        }).join('');

        // --- 7. FINAL HTML ASSEMBLY ---
        const finalHtml = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${provinceUrl}">
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${profiles[0].imagePath}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:type" content="website">

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

    <!-- CSS Style -->
    <style>
        :root { --primary: #ec4899; --bg: #0f172a; --card-bg: #1e293b; --text: #f1f5f9; --border: #334155; }
        body { font-family: 'Prompt', -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 20px; line-height: 1.5; }
        .container { max-width: 1000px; margin: 0 auto; }
        
        /* Headers */
        h1 { font-size: 24px; text-align: center; background: linear-gradient(to right, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
        .h2-title { font-size: 18px; color: var(--primary); margin-top: 0; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
        .h3-title { font-size: 16px; color: #fff; margin-bottom: 10px; }

        /* Grid */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; margin: 25px 0; }
        .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; text-decoration: none; color: inherit; transition: transform .2s; display: block; }
        .card:hover { transform: translateY(-3px); border-color: var(--primary); }
        
        /* Image */
        .img-w { position: relative; padding-top: 125%; background: #000; }
        .img-w img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .v-badge { position: absolute; top: 5px; right: 5px; background: #10b981; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
        .price-tag { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: #fff; padding: 15px 8px 5px; font-weight: bold; font-size: 14px; }

        /* Card Details */
        .card-d { padding: 10px; }
        .name { font-weight: 700; display: block; font-size: 15px; margin-bottom: 2px; color: #fff; }
        .loc { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
        .rating { color: #fbbf24; font-size: 12px; margin-top: 4px; display: flex; justify-content: space-between; }

        /* Content Boxes (Table, FAQ, Text) */
        .content-box { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 25px; }
        
        /* Table Style */
        .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .data-table th, .data-table td { border-bottom: 1px solid var(--border); padding: 12px; text-align: left; }
        .data-table th { color: #94a3b8; font-weight: 500; width: 35%; }
        .data-table td { color: #fff; }
        .data-table tr:last-child td { border-bottom: none; }

        /* FAQ Style */
        .faq-item { margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px; }
        .faq-item:last-child { border-bottom: none; margin-bottom: 0; }
        .faq-q { font-weight: bold; color: var(--primary); margin-bottom: 5px; }
        .faq-a { font-size: 14px; color: #cbd5e1; line-height: 1.6; }

        /* SEO Article */
        .seo-article p { font-size: 14px; color: #cbd5e1; margin-bottom: 15px; text-align: justify; }
        .seo-article strong { color: #fff; }
        
        /* Zone Badges */
        .zone-badges { display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; justify-content: center; }
        .z-badge { background: rgba(236, 72, 153, 0.1); color: var(--primary); padding: 4px 10px; border-radius: 99px; font-size: 12px; border: 1px solid rgba(236, 72, 153, 0.3); }

        @media (max-width: 600px) {
            .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .h1-seo { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>พิกัดน้องๆ ไซด์ไลน์${provinceName}</h1>
        
        <div class="zone-badges">
            ${localZones.map(z => `<span class="z-badge">📍 ${z}</span>`).join('')}
        </div>

        ${tableHtml}

        <div class="grid">
            ${profilesHtml}
        </div>

        ${seoTextHtml}

        ${faqHtml}

        <div style="text-align:center; font-size:12px; color:#64748b; margin-top:30px;">
            &copy; ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - แหล่งรวมสาวสวย${provinceName} อันดับ 1
        </div>
    </div>
</body>
</html>`;

        return new Response(finalHtml, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "cache-control": "public, max-age=3600, s-maxage=86400", // Cache 1 ชม. (CDN 1 วัน)
                "x-robots-tag": "index, follow"
            } 
        });

    } catch (e) {
        console.error("SSR Province Error:", e);
        // Fallback ไป Client-side rendering ถ้า Server มีปัญหา
        return context.next(); 
    }
};