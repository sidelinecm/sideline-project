import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app', // <--- เติมคอมม่าตรงนี้
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://line.me/ti/p/ksLUWB89Y_"
    ]
};

// ฟังก์ชันสุ่มคำ (Spintax) สำหรับสร้างความหลากหลายให้ SEO
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ฟังก์ชันดึงรูปภาพจาก Storage โดยตรง (ไม่ย่อขนาดตามความต้องการ)
const optimizeImg = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

// ข้อมูลโซนสำหรับแต่ละจังหวัด (Static Data)
const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'แม่โจ้', 'หางดง', 'มช.', 'รวมโชค', 'เซ็นเฟส'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'เลียบด่วน', 'ฝั่งธน', 'ทองหล่อ', 'เอกมัย'],
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'จอมเทียน', 'ศรีราชา', 'อมตะนคร', 'บางแสน']
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'ย่านใจกลางเมือง', 'ใกล้คุณ', 'แหล่งวัยรุ่น'];
};

export default async (request, context) => {
    const url = new URL(request.url);
    // ดึงค่า Province Key จาก URL (เช่น /location/chiangmai)
    const pathParts = url.pathname.split('/').filter(Boolean);
    const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // 2. ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase
            .from('provinces')
            .select('id, nameThai, slug')
            .or(`slug.eq.${provinceKey},key.eq.${provinceKey}`)
            .maybeSingle();

        if (!provinceData) return context.next();

        // 3. ดึงรายชื่อโปรไฟล์ในจังหวัดนั้นๆ
        const { data: profiles } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, verified, location, rate')
            .eq('province_id', provinceData.id)
            .eq('active', true)
            .order('verified', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(50);

        if (!profiles || profiles.length === 0) return context.next();

        // 4. เตรียมข้อมูลสำหรับ Meta Tags และ Schema
        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        
        // ลบคำว่า "น้องๆ" ออกจาก Title และ Description ตามโจทย์
        const title = `พิกัดไซด์ไลน์${provinceName} รับงานเอง โซน${randomZone} งานดีตรงปก ไม่มัดจำ`;
        const description = `รวมข้อมูลไซด์ไลน์${provinceName} โซน ${localZones.slice(0, 3).join(', ')} และพื้นที่ใกล้เคียง รับงานเอง ฟิวแฟน รูปตรงปก จ่ายหน้างานปลอดภัยที่สุดใน${provinceName}`;
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        // 5. SCHEMA MARKUP (JSON-LD)
        const itemListSchema = {
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
                    "description": description,
                    "url": provinceUrl,
                    "mainEntity": {
                        "@type": "ItemList",
                        "itemListElement": profiles.map((p, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`
                        }))
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        { 
                            "@type": "Question", 
                            "name": `หาไซด์ไลน์${provinceName} โซนไหนเดินทางสะดวก?`, 
                            "acceptedAnswer": { "@type": "Answer", "text": `โซนยอดนิยมใน${provinceName} ได้แก่ ${localZones.join(', ')} ซึ่งมีน้องๆ คอยให้บริการอยู่เป็นจำนวนมาก` } 
                        },
                        { 
                            "@type": "Question", 
                            "name": "การันตีรูปตรงปกและปลอดภัยอย่างไร?", 
                            "acceptedAnswer": { "@type": "Answer", "text": "เราคัดกรองเฉพาะผู้ที่รับงานเองและชำระเงินหน้างานเท่านั้น ไม่มีการโอนมัดจำก่อนทุกกรณี เพื่อความปลอดภัยสูงสุดของผู้ใช้บริการ" } 
                        }
                    ]
                }
            ]
        };

        // 6. HTML STRUCTURE
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${provinceUrl}">
    
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">

    <script type="application/ld+json">${JSON.stringify(itemListSchema)}</script>
    
    <style>
        :root{--p:#ec4899;--bg:#0f172a;--card:#1e293b;--txt:#f8fafc;--verified:#10b981}
        body{font-family:'Sarabun',-apple-system,sans-serif;background:var(--bg);color:var(--txt);margin:0;padding:20px;line-height:1.6}
        .container{max-width:850px;margin:0 auto}
        h1{color:var(--p);font-size:26px;text-align:center;margin-bottom:10px;font-weight:800}
        .zone-info{background:#334155;padding:15px;border-radius:12px;font-size:14px;margin-bottom:25px;border-left:5px solid var(--p);box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)}
        .zone-info strong{color:var(--p)}
        
        /* Grid Layout */
        .grid{display:grid;grid-template-columns:repeat(2, 1fr);gap:15px}
        @media (min-width: 640px) {
            .grid{grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:20px}
        }

        /* Card Style */
        .card{background:var(--card);border-radius:15px;overflow:hidden;text-decoration:none;color:inherit;transition:transform 0.2s ease, box-shadow 0.2s ease;border:1px solid #334155;display:flex;flex-direction:column}
        .card:hover{transform:translateY(-5px);box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);border-color:var(--p)}
        
        .img-w{position:relative;padding-top:133%;background:#000;overflow:hidden}
        .img-w img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease}
        .card:hover .img-w img{transform:scale(1.05)}
        
        .card-d{padding:15px;flex-grow:1;display:flex;flex-direction:column;justify-content:space-between}
        .name{font-weight:700;display:block;margin-bottom:6px;color:#fff;font-size:16px}
        .loc{font-size:13px;color:#94a3b8;display:flex;align-items:center;gap:4px}
        .price{color:#fbbf24;font-weight:800;font-size:16px;margin-top:8px;display:block}
        
        .badge{position:absolute;top:10px;right:10px;background:var(--verified);color:#fff;font-size:11px;padding:3px 8px;border-radius:99px;font-weight:700;box-shadow:0 2px 4px rgba(0,0,0,0.2);z-index:1}
        
        .footer{text-align:center;margin-top:40px;padding:20px;color:#64748b;font-size:12px;border-top:1px solid #334155}
    </style>
</head>
<body>
   <div class="container">
        <h1>พิกัดไซด์ไลน์${provinceName}</h1> 
        
        <div class="zone-info">
            <strong>📍 พื้นที่ให้บริการยอดนิยม:</strong> ${localZones.join(' • ')}<br>
            คัดกรองคุณภาพ พบข้อมูลทั้งหมด ${profiles.length} รายการในจังหวัด${provinceName}
        </div>

        <div class="grid">
            ${profiles.map(p => `
                <a href="/sideline/${p.slug}" class="card">
                    <div class="img-w">
                        <img src="${optimizeImg(p.imagePath)}" alt="${p.name}" loading="lazy">
                        ${p.verified ? '<span class="badge">Verified</span>' : ''}
                    </div>
                    <div class="card-d">
                        <div>
                            <span class="name">${p.name}</span>
                            <div class="loc">📍 ${p.location || randomZone}</div>
                        </div>
                        <span class="price">฿${parseInt(p.rate || 1500).toLocaleString()}</span>
                    </div>
                </a>
            `).join('')}
        </div>

        <div class="footer">
            © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - ศูนย์รวมข้อมูลไซด์ไลน์อันดับ 1 มั่นใจ ปลอดภัย ไม่มีการมัดจำ
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "Netlify-CDN-Cache-Control": "public, s-maxage=86400",
                "Cache-Control": "public, max-age=1800"
            } 
        });

    } catch (e) {
        console.error("SSR Province Error:", e);
        return context.next(); 
    }
};