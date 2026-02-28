import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    LOGO: 'https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ'],
        'chonburi': ['พัทยา', 'บางแสน', 'ศรีราชา', 'อมตะนคร', 'สัตหีบ'],
        'khon-kaen': ['มข.', 'กังสดาล', 'ริมบึงแก่นนคร', 'หลังมอ', 'เซ็นทรัลขอนแก่น'],
        'phitsanulok': ['ย่านในเมือง', 'แถวมน.', 'ริมน้ำน่าน', 'โคกมะตูม', 'บ้านคลอง'],
        'phuket': ['ป่าตอง', 'กะตะ', 'กะรน', 'ตัวเมืองภูเก็ต', 'ฉลอง', 'ราไวย์'],
        'udonthani': ['ยูดีทาวน์', 'เซ็นทรัลอุดร', 'หนองประจักษ์', 'โพศรี'],
        'chiangrai': ['บ้านดู่', 'หอนาฬิกา', 'ริมกก', 'มฟล.']
    };
    return zones[provinceKey.toLowerCase()] || ['ย่านใจกลางเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดนิยม'];
};

export default async (request, context) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const { data: provinceData } = await supabase.from('provinces').select('*').eq('key', provinceKey).maybeSingle();
        if (!provinceData) return context.next();

        const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('lastUpdated', { ascending: false });

        if (!profiles || profiles.length === 0) return context.next();

        const provinceName = provinceData.nameThai;
        const profileCount = profiles.length;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        const YEAR_TH = new Date().getFullYear() + 543;
        const DYNAMIC_BRAND = `Sideline ${provinceName}`;

        const title = `พิกัดไซด์ไลน์${provinceName} รับงานเอง พบกับน้องๆ ${profileCount} คน โซน${randomZone} งานดีตรงปก ไม่มัดจำ (${YEAR_TH})`;
        const description = `แหล่งรวมน้องๆ ไซด์ไลน์${provinceName} จำนวน ${profileCount} รายการ อัปเดตล่าสุดปี ${YEAR_TH} ครอบคลุมพื้นที่ ${localZones.slice(0, 5).join(', ')} คัดคนสวย รับงานเอง ฟิวแฟน รูปตรงปก 100% จ่ายหน้างานปลอดภัยที่สุดใน${provinceName}`;

        const schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "name": title,
                    "description": description,
                    "url": `${CONFIG.DOMAIN}/location/${provinceKey}`,
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                            { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${provinceKey}` }
                        ]
                    }
                },
                {
                    "@type": "ItemList",
                    "numberOfItems": profileCount,
                    "itemListElement": profiles.map((p, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                        "name": p.name,
                        "image": optimizeImg(p.imagePath)
                    }))
                }
            ]
        };

        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${CONFIG.DOMAIN}/location/${provinceKey}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${optimizeImg(profiles[0].imagePath)}">
    <meta property="og:url" content="${CONFIG.DOMAIN}/location/${provinceKey}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${DYNAMIC_BRAND}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    <style>
        :root { --p: #db2777; --bg: #0f172a; --card: #1e293b; --txt: #f8fafc; }
        body { font-family: 'Prompt', sans-serif; background: var(--bg); color: var(--txt); margin: 0; padding: 0; line-height: 1.6; }
        header { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .nav-wrap { max-width: 1200px; margin: 0 auto; height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
        .logo img { height: 30px; }
        .nav-links a { color: #fff; text-decoration: none; font-weight: 600; font-size: 14px; margin-left: 20px; transition: 0.3s; }
        .nav-links a:hover { color: var(--p); }
        .container { max-width: 1100px; margin: 0 auto; padding: 30px 20px; }
        .hero { text-align: center; margin-bottom: 40px; }
        h1 { font-size: clamp(22px, 5vw, 32px); font-weight: 900; margin-bottom: 10px; color: #fff; }
        .breadcrumb { font-size: 12px; color: #64748b; margin-bottom: 15px; }
        .badge-count { background: rgba(219, 39, 119, 0.1); color: var(--p); padding: 4px 12px; border-radius: 100px; font-weight: 800; font-size: 13px; }
        .seo-intro { color: #94a3b8; font-size: 14px; max-width: 700px; margin: 20px auto 0; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 40px; }
        @media (min-width: 768px) { .grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }
        .card { background: var(--card); border-radius: 20px; overflow: hidden; text-decoration: none; color: inherit; border: 1px solid rgba(255,255,255,0.05); transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .card:hover { transform: translateY(-8px); border-color: var(--p); box-shadow: 0 20px 40px -10px rgba(219, 39, 119, 0.4); }
        .img-box { position: relative; padding-top: 133%; background: #000; }
        .img-box img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .feat-tag { position: absolute; top: 12px; left: 12px; background: #fbbf24; color: #000; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 900; z-index: 5; }
        .status { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); padding: 3px 8px; border-radius: 100px; font-size: 10px; font-weight: 800; border: 1px solid rgba(255,255,255,0.2); }
        .card-info { padding: 15px; }
        .name { font-weight: 800; font-size: 17px; color: #fff; display: block; margin-bottom: 4px; }
        .loc { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
        .price { color: #fbbf24; font-weight: 900; font-size: 18px; margin-top: 8px; display: block; }
        .sticky-line { position: fixed; bottom: 25px; right: 20px; background: #06c755; color: #fff; padding: 12px 24px; border-radius: 100px; text-decoration: none; font-weight: 800; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 30px rgba(6,199,85,0.4); z-index: 100; transition: 0.3s; }
        .sticky-line:hover { scale: 1.05; background: #05a546; }
        footer { text-align: center; padding: 60px 20px; color: #475569; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
    </style>
</head>
<body>
    <header>
        <div class="nav-wrap">
            <a href="/"><img src="${CONFIG.LOGO}" alt="Sideline Chiangmai Logo"></a>
            <div class="nav-links"><a href="/profiles.html">น้องๆ ทั้งหมด</a><a href="/locations.html">พิกัดพื่นที่</a></div>
        </div>
    </header>
    <div class="container">
        <div class="breadcrumb">หน้าแรก / พิกัดจังหวัด / ${provinceName}</div>
        <div class="hero">
            <h1>ไซด์ไลน์${provinceName} รับงานเอง</h1>
            <span class="badge-count">น้องๆ ทั้งหมด ${profileCount} โปรไฟล์</span>
            <p class="seo-intro">ศูนย์รวมสาวสวย <strong>รับงาน${provinceName}</strong> เพื่อนเที่ยว ฟิวแฟน และน้องๆ เอนเตอร์เทนในย่าน ${localZones.slice(0, 5).join(', ')} การันตีตรงปก 100% ปลอดภัย ไม่ต้องโอนมัดจำ จ่ายเงินหน้างานเท่านั้น</p>
        </div>
        <div class="grid">
            ${profiles.map(p => `
                <a href="/sideline/${p.slug}" class="card">
                    <div class="img-box">
                        <img src="${optimizeImg(p.imagePath)}" alt="${p.name} ไซด์ไลน์${provinceName}" loading="lazy">
                        ${p.isfeatured ? '<span class="feat-tag">RECOMMENDED</span>' : ''}
                        <span class="status" style="color:${p.availability?.includes('ไม่ว่าง') ? '#ff4d4d' : '#00ff88'}">● ${p.availability || 'สอบถาม'}</span>
                    </div>
                    <div class="card-info">
                        <span class="name">${p.name}</span>
                        <div class="loc"><i class="fas fa-map-marker-alt" style="color:var(--p)"></i> ${p.location || provinceName}</div>
                        <span class="price">฿${parseInt(p.rate || 1500).toLocaleString()}</span>
                    </div>
                </a>
            `).join('')}
        </div>
        <footer>
            © ${new Date().getFullYear()} ${DYNAMIC_BRAND} - แพลตฟอร์มไซด์ไลน์ที่น่าเชื่อถือที่สุดในไทย<br>
            ข้อมูลจัดทำเพื่อการโฆษณาเท่านั้น ห้ามคัดลอกก่อนได้รับอนุญาต
        </footer>
    </div>
    <a href="https://line.me/ti/p/ksLUWB89Y_" target="_blank" class="sticky-line"><i class="fab fa-line" style="font-size:24px"></i> จองคิวทาง LINE</a>
</body>
</html>`;
        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });
    } catch (e) { return context.next(); }
};