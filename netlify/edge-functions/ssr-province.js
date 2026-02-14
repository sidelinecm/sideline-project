import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2tneWlra2VpdWNuZHRuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzIyOTMsImV4cCI6MjA4NjEwODI5M30.-x6TN3XQS43QTKv4LpZv9AM4_Tm2q3R4Nd-KGo-KU1E',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai'
};

const optimizeImg = (path, width = 400) => {
    if (!path) return `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=80&format=webp`;
};

// ฟังก์ชันสุ่มโซน (Mockup zones เพื่อให้ Title ดูน่าสนใจ)
const getLocalZones = (provinceKey) => {
    const zones = {
        'chiang-mai': ['เมืองเชียงใหม่', 'นิมมาน', 'สันกำแพง', 'หางดง'],
        'bangkok': ['สุขุมวิท', 'ลาดพร้าว', 'สีลม', 'รัชดา'],
        'chonburi': ['พัทยา', 'บางแสน', 'ศรีราชา'],
        'phuket': ['ป่าตอง', 'เมืองภูเก็ต', 'กะรน'],
        'khon-kaen': ['ในเมือง', 'มข.', 'รอบบึง']
    };
    return zones[provinceKey] || ['ในเมือง', 'รอบนอก'];
};

export default async (request, context) => {
    const url = new URL(request.url);
    const path = url.pathname;

    if (!path.startsWith("/location/")) return context.next();

    // Check Bot
    const ua = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|lighthouse/i.test(ua);
    
    // Check Security (อนุญาต Bot เสมอ)
    const geo = context.geo || {};
    const isSuspicious = !geo.city || (geo.country?.code !== 'TH' && geo.country?.code !== 'US');

    if (!isBot && !isSuspicious) return context.next();

    const pathParts = path.split('/').filter(Boolean);
    if (pathParts[0] !== 'location' || pathParts.length < 2) return context.next();
    const provinceKey = pathParts[pathParts.length - 1];

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 1. ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase
            .from('provinces')
            .select('*')
            .or(`key.eq."${provinceKey}",slug.eq."${provinceKey}"`)
            .maybeSingle();

        if (!provinceData) return context.next(); // ส่งต่อให้ Client จัดการ 404

        // 2. ดึงโปรไฟล์น้องๆ
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate')
            .eq('provinceKey', provinceData.key || provinceData.slug)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(30);

        const provinceName = provinceData.nameThai;

        // 🛑 CRITICAL FIX: ถ้าไม่มีข้อมูล ให้ส่ง 404 และ NOINDEX ทันที
        // เพื่อป้องกันปัญหา Soft 404 และ Crawled - not indexed
        if (!profiles || profiles.length === 0) {
            const notFoundHtml = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex, nofollow">
    <title>ไม่พบข้อมูล - ${CONFIG.BRAND_NAME}</title>
</head>
<body>
    <h1>ยังไม่มีรายการใน${provinceName}</h1>
    <p>กำลังอัปเดตข้อมูล โปรดตรวจสอบพื้นที่อื่น</p>
    <a href="/">กลับหน้าหลัก</a>
</body>
</html>`;
            return new Response(notFoundHtml, { 
                status: 404, // ส่ง Status 404 ให้ Google รู้
                headers: { "content-type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" } 
            });
        }

        const localZones = getLocalZones(provinceKey);
        const randomZone = localZones[0];
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        // SEO Text Optimization
        const pageTitle = `ไซด์ไลน์${provinceName} รับงานเอง โซน${randomZone} ไม่ผ่านเอเย่นต์ ${new Date().getFullYear() + 543}`;
        const metaDesc = `รวมสาวไซด์ไลน์${provinceName} ${profiles.length} คน รับงานเอง พิกัด ${localZones.join(', ')} รูปตรงปก จ่ายหน้างาน 100%`;

        // Schema JSON-LD
        const schemaData = {
            "@context": "https://schema.org/",
            "@type": "CollectionPage",
            "name": pageTitle,
            "description": metaDesc,
            "url": provinceUrl,
            "mainEntity": {
                "@type": "ItemList",
                "itemListElement": profiles.map((p, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Person",
                        "name": `น้อง${p.name}`,
                        "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                        "image": optimizeImg(p.imagePath, 300)
                    }
                }))
            }
        };

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${provinceUrl}">
    <meta name="robots" content="index, follow">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        body { font-family: sans-serif; background: #0f172a; color: #fff; margin:0; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; }
        h1 { color: #db2777; text-align: center; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; margin-top: 20px; }
        .card { background: #1e293b; border-radius: 8px; overflow: hidden; text-decoration: none; color: white; display: block; border: 1px solid #334155; }
        .card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; }
        .info { padding: 10px; }
        .name { font-weight: bold; display: block; }
        .price { color: #db2777; font-size: 0.9em; }
        .loc { font-size: 0.8em; color: #94a3b8; }
        footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${pageTitle}</h1>
        <p style="text-align:center;color:#94a3b8">${metaDesc}</p>
        
        <div class="grid">
            ${profiles.map(p => `
                <a href="${CONFIG.DOMAIN}/sideline/${p.slug}" class="card">
                    <img src="${optimizeImg(p.imagePath, 300)}" alt="น้อง${p.name} ${provinceName}" loading="lazy">
                    <div class="info">
                        <span class="name">น้อง${p.name}</span>
                        <span class="price">${parseInt(p.rate || 1500).toLocaleString()}.-</span>
                        <div class="loc">📍 ${p.location || provinceName}</div>
                    </div>
                </a>
            `).join('')}
        </div>
        
        <footer>
            © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - อัปเดตล่าสุด: ${new Date().toLocaleDateString('th-TH')}
        </footer>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "cache-control": "public, max-age=3600, s-maxage=86400" 
            } 
        });

    } catch (error) {
        console.error("SSR Province Error:", error);
        return context.next();
    }
};