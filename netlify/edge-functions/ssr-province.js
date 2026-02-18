import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2tneWlra2VpdWNuZHRuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzIyOTMsImV4cCI6MjA4NjEwODI5M30.-x6TN3XQS43QTKv4LpZv9AM4_Tm2q3R4Nd-KGo-KU1E',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ฟังก์ชันย่อรูป
const optimizeImg = (path, width = 400) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=75&format=webp`;
};

// ข้อมูลโซน (Static Data)
const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'แม่โจ้', 'หางดง', 'มช.'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'เลียบด่วน', 'ฝั่งธน'],
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'จอมเทียน', 'ศรีราชา', 'อมตะนคร']
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'ย่านใจกลางเมือง', 'ใกล้คุณ'];
};

export default async (request, context) => {
    const url = new URL(request.url);
    const provinceKey = url.pathname.split('/').pop();

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 1. ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase
            .from('provinces')
            .select('id, nameThai, slug') // ต้องมั่นใจว่ามี column slug หรือ key
            .or(`slug.eq."${provinceKey}", key.eq."${provinceKey}"`) 
            .maybeSingle();

        if (!provinceData) return context.next();

        // 2. ดึงโปรไฟล์น้องๆ
        const { data: profiles } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, verified, location, rate')
            .eq('province_id', provinceData.id) // ใช้ ID เชื่อม
            .eq('active', true)
            .order('verified', { ascending: false }) // Verified ขึ้นก่อน
            .order('created_at', { ascending: false })
            .limit(50); // จำกัด 50 คนป้องกันโหลดหนัก

        // ถ้าไม่มีข้อมูล ให้ปล่อยผ่านไปหน้า Client-side หรือหน้า 404
        if (!profiles || profiles.length === 0) return context.next();

        // 3. เตรียมข้อมูล
        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        const title = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง โซน${randomZone} งานดีตรงปก`;
        const description = `ค้นหาสาวไซด์ไลน์${provinceName} โซน ${localZones.slice(0, 3).join(', ')} พบกับน้องๆ รับงานเอง ฟิวแฟน ไม่ผ่านเอเย่นต์ จ่ายหน้างาน ปลอดภัยที่สุดใน${provinceName}`;
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        // 4. สร้าง Schema ItemList (รวมลิงก์)
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
                        { "@type": "Question", "name": `หาไซด์ไลน์${provinceName} โซนไหนดี?`, "acceptedAnswer": { "@type": "Answer", "text": `แนะนำโซนยอดฮิต เช่น ${localZones.join(', ')} ครับ` } },
                        { "@type": "Question", "name": "ต้องโอนมัดจำไหม?", "acceptedAnswer": { "@type": "Answer", "text": "เว็บไซต์เรารวบรวมเฉพาะน้องๆ ที่รับชำระเงินหน้างาน เพื่อความปลอดภัยครับ" } }
                    ]
                }
            ]
        };

        // 5. Render HTML
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${provinceUrl}">
    <script type="application/ld+json">${JSON.stringify(itemListSchema)}</script>
    <style>
        :root{--p:#ec4899;--bg:#0f172a;--card:#1e293b;--txt:#f8fafc}
        body{font-family:'Sarabun',sans-serif;background:var(--bg);color:var(--txt);margin:0;padding:20px}
        .container{max-width:800px;margin:0 auto}
        h1{color:var(--p);font-size:24px;text-align:center;margin-bottom:10px}
        .zone-info{background:#334155;padding:12px;border-radius:8px;font-size:13px;margin-bottom:25px;border-left:4px solid var(--p)}
        
        /* Grid แบบ Mobile-Friendly (2 คอลัมน์) */
        .grid{display:grid;grid-template-columns:repeat(2, 1fr);gap:12px}
        @media (min-width: 640px) {
            .grid{grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:20px}
        }

        .card{background:var(--card);border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;transition:.3s;border:1px solid #334155}
        .img-w{position:relative;padding-top:125%;background:#000}
        .img-w img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
        .card-d{padding:12px}
        .name{font-weight:700;display:block;margin-bottom:4px;color:#fff}
        .loc{font-size:12px;color:#94a3b8}
        .price{color:#fbbf24;font-weight:700;font-size:14px;float:right}
        .badge{position:absolute;top:8px;right:8px;background:#10b981;color:#fff;font-size:10px;padding:2px 6px;border-radius:99px;font-weight:700}
    </style>
</head>
<body>
    <div class="container">
        <h1>พิกัดน้องๆ ไซด์ไลน์${provinceName}</h1>
        <div class="zone-info">
            <strong>📍 โซนยอดนิยม:</strong> ${localZones.join(' • ')}<br>
            พบกับน้องๆ กว่า ${profiles.length} คนใน${provinceName}
        </div>
        <div class="grid">
            ${profiles.map(p => {
                const pName = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
                return `
                <a href="/sideline/${p.slug}" class="card">
                    <div class="img-w">
                        <img src="${optimizeImg(p.imagePath, 300)}" alt="${pName}" loading="lazy">
                        ${p.verified ? '<span class="badge">Verified</span>' : ''}
                    </div>
                    <div class="card-d">
                        <span class="price">฿${parseInt(p.rate||1500).toLocaleString()}</span>
                        <span class="name">${pName}</span>
                        <div class="loc">📍 ${p.location||randomZone}</div>
                    </div>
                </a>`;
            }).join('')}
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