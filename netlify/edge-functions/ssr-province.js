import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ฟังก์ชันรูปภาพแบบ Hybrid
const optimizeImg = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

// โซนพื้นที่ยอดนิยมสำหรับ SEO
const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ'],
        'chonburi': ['พัทยา', 'บางแสน', 'ศรีราชา', 'อมตะนคร', 'สัตหีบ']
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'ย่านใจกลางเมือง', 'พื้นที่ใกล้เคียง'];
};

export default async (request, context) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // ดึงค่า Province Key จาก URL
    const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase
            .from('provinces')
            .select('id, nameThai, key')
            .eq('key', provinceKey)
            .maybeSingle();

        if (!provinceData) return context.next();

        // ดึงโปรไฟล์ในจังหวัดนั้นๆ (เรียง Featured ขึ้นก่อน และตามด้วยวันอัปเดต)
        const { data: profiles } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, location, rate, isfeatured, lastUpdated')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('lastUpdated', { ascending: false })
            .limit(100);

        if (!profiles || profiles.length === 0) return context.next();

        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        
        // SEO Meta
        const title = `พิกัดไซด์ไลน์${provinceName} รับงานเอง โซน${randomZone} งานดีตรงปก ไม่มัดจำ`;
        const description = `รวมข้อมูลไซด์ไลน์${provinceName} ทุกโซน ${localZones.slice(0, 5).join(', ')} คัดงานคุณภาพ รับงานเอง ฟิวแฟน รูปตรงปก จ่ายหน้างานปลอดภัยที่สุดใน${provinceName}`;
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        // สร้าง Schema สำหรับหน้ารวมสินค้า/บริการ
        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": title,
            "description": description,
            "url": provinceUrl,
            "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": profiles.length,
                "itemListElement": profiles.map((p, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`
                }))
            }
        };

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${provinceUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${optimizeImg(profiles[0].imagePath)}">
    <meta property="og:type" content="website">
    <script type="application/ld+json">${JSON.stringify(itemListSchema)}</script>
    <style>
        :root { --p: #ec4899; --bg: #0f172a; --card: #1e293b; --txt: #f8fafc; }
        body { font-family: -apple-system, sans-serif; background: var(--bg); color: var(--txt); margin: 0; padding: 20px; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; }
        h1 { color: var(--p); font-size: 28px; text-align: center; margin-bottom: 30px; font-weight: 800; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        @media (min-width: 768px) { .grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }
        .card { background: var(--card); border-radius: 16px; overflow: hidden; text-decoration: none; color: inherit; border: 1px solid #334155; transition: transform 0.2s; }
        .card:hover { transform: translateY(-5px); border-color: var(--p); }
        .img-box { position: relative; padding-top: 133%; background: #000; }
        .img-box img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .featured-tag { position: absolute; top: 10px; right: 10px; background: #fbbf24; color: #000; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; }
        .card-info { padding: 15px; }
        .name { font-weight: 800; display: block; margin-bottom: 5px; font-size: 17px; color: #fff; }
        .loc { font-size: 13px; color: #94a3b8; }
        .price { color: #fbbf24; font-weight: 800; font-size: 17px; margin-top: 8px; display: block; }
        .footer { text-align: center; margin-top: 50px; padding: 30px; color: #64748b; font-size: 13px; border-top: 1px solid #334155; }
    </style>
</head>
<body>
   <div class="container">
        <h1>พิกัดไซด์ไลน์${provinceName}</h1> 
        <div class="grid">
            ${profiles.map(p => `
                <a href="/sideline/${p.slug}" class="card">
                    <div class="img-box">
                        <img src="${optimizeImg(p.imagePath)}" alt="${p.name}">
                        ${p.isfeatured ? '<span class="featured-tag">RECOMMENDED</span>' : ''}
                    </div>
                    <div class="card-info">
                        <span class="name">${p.name}</span>
                        <div class="loc">📍 ${p.location || provinceName}</div>
                        <span class="price">฿${parseInt(p.rate || 1500).toLocaleString()}</span>
                    </div>
                </a>
            `).join('')}
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - ศูนย์รวมข้อมูลไซด์ไลน์อันดับ 1
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });

    } catch (e) {
        console.error("SSR Province Error:", e);
        return context.next(); 
    }
};