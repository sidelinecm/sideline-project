import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2tneWlra2VpdWNuZHRuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzIyOTMsImV4cCI6MjA4NjEwODI5M30.-x6TN3XQS43QTKv4LpZv9AM4_Tm2q3R4Nd-KGo-KU1E',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'sidelinechiangmai ไซด์ไลน์เชียงใหม่',
    SOCIAL_PROFILES: ["https://linktr.ee/sidelinechiangmai", "https://x.com/Sdl_chiangmai"]
};

// --- CORE UTILITIES ---
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path, width = 400) => {
    if (!path) return `${CONFIG.DOMAIN}/default-preview.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=75&format=webp`;
};

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiang-mai': ['นิมมานเหมินท์', 'สันติธรรม', 'ช้างเผือก', 'แม่โจ้', 'หางดง', 'มช.', 'ท่าแพ'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'เลียบด่วน', 'ฝั่งธน', 'สีลม'],
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'จอมเทียน', 'ศรีราชา', 'อมตะนคร', 'บางแสน'],
        'phuket': ['ป่าตอง', 'กะรน', 'กะตา', 'ราไวย์', 'ตัวเมืองภูเก็ต']
    };
    const key = provinceKey.toLowerCase().replace('/', '');
    return zones[key] || ['ตัวเมือง', 'ย่านใจกลางเมือง', 'พื้นที่ใกล้เคียง', 'พิกัดยอดนิยม'];
};

// --- MAIN SSR ENGINE ---
export default async (request, context) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // ตรวจสอบว่าต้องเป็น Path: /location/[province-slug]
    if (pathParts[0] !== 'location' || pathParts.length < 2) return context.next();
    
    const provinceKey = pathParts[pathParts.length - 1];

    // 1. ADVANCED SECURITY & BOT FILTERING (ป้องกันคนดึงข้อมูล/ประหยัดทรัพยากร)
    const ua = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|lighthouse|bing|yandex/i.test(ua);
    const geo = context.geo || {};
    // ยอมรับเฉพาะคนเข้าจากไทย, อเมริกา (Bot ส่วนใหญ่อยู่ US), และ Bot ทั่วไป
    const isSuspicious = !isBot && geo.country?.code !== 'TH' && geo.country?.code !== 'US';
    
    if (!isBot && isSuspicious) return context.next();

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 2. DATA FETCHING (ยืดหยุ่นสูง: เช็คทั้ง Slug และชื่อไทย)
        const { data: provinceData } = await supabase
            .from('provinces')
            .select('*')
            .or(`slug.eq."${provinceKey}",nameThai.eq."${provinceKey}"`)
            .maybeSingle();

        if (!provinceData) return context.next();

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, verified, location, rate, description')
            .eq('province_id', provinceData.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(50); // ดึงเยอะขึ้นเพื่อความครอบคลุม

        const provinceName = provinceData.nameThai;

        // 3. HARD 404 / NOINDEX (กรณีไม่มีข้อมูล เพื่อไม่ให้ Google ทำดัชนีหน้าว่าง)
        if (!profiles || profiles.length === 0) {
            const errorHtml = `<!DOCTYPE html><html><head><meta name="robots" content="noindex"><title>ไม่พบข้อมูล</title></head><body><script>window.location.href="/";</script></body></html>`;
            return new Response(errorHtml, { 
                status: 404, 
                headers: { "content-type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" } 
            });
        }

        // 4. SEO CONTENT ENGINE
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        const currentYear = new Date().getFullYear() + 543;
        const pageTitle = `ไซด์ไลน์${provinceName} รับงานเอง โซน${randomZone} งานดีตรงปก ไม่ผ่านเอเย่นต์ ${currentYear}`;
        const metaDesc = `รวมสาวสวยไซด์ไลน์${provinceName} กว่า ${profiles.length} โปรไฟล์ พิกัด ${localZones.slice(0, 5).join(', ')} อัปเดตล่าสุดวันนี้ รับงานฟิวแฟน จ่ายหน้างาน 100% ปลอดภัยแน่นอน`;
        const pageUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const featuredImg = optimizeImg(profiles[0].imagePath, 800);

        // 5. FULL SCHEMA.ORG GRAPH (ครบเครื่อง Breadcrumb, FAQ, CollectionPage)
        const schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": CONFIG.LOGO_URL,
                    "sameAs": CONFIG.SOCIAL_PROFILES
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าหลัก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": pageUrl }
                    ]
                },
                {
                    "@type": "CollectionPage",
                    "name": pageTitle,
                    "description": metaDesc,
                    "url": pageUrl,
                    "mainEntity": {
                        "@type": "ItemList",
                        "itemListElement": profiles.map((p, i) => ({
                            "@type": "ListItem",
                            "position": i + 1,
                            "item": {
                                "@type": "Person",
                                "name": p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`,
                                "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                                "image": optimizeImg(p.imagePath, 300)
                            }
                        }))
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `หาสาวไซด์ไลน์${provinceName} โซนไหนได้บ้าง?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `สามารถนัดเจอน้องๆ ได้ในโซน ${localZones.join(', ')} และพื้นที่ใกล้เคียงครับ` }
                        },
                        {
                            "@type": "Question",
                            "name": "ต้องโอนมัดจำก่อนไหม?",
                            "acceptedAnswer": { "@type": "Answer", "text": "ทางเว็บไซต์สนับสนุนให้น้องๆ รับเงินหน้างานเท่านั้น เพื่อความปลอดภัยของผู้ใช้บริการ" }
                        }
                    ]
                }
            ]
        };

        // 6. ULTIMATE HTML TEMPLATE (Performance + Mobile First)
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${pageUrl}">
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${featuredImg}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${featuredImg}">

    <script type="application/ld+json">${JSON.stringify(schema)}</script>

    <style>
        :root { --primary: #f472b6; --accent: #db2777; --bg: #0f172a; --card: #1e293b; }
        body { font-family: 'Sarabun', -apple-system, sans-serif; background: var(--bg); color: #e2e8f0; margin: 0; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; padding: 16px; }
        .header-section { text-align: center; padding: 20px 0; }
        h1 { color: var(--primary); font-size: 1.6rem; margin: 0 0 10px; }
        .zone-bar { background: #334155; padding: 12px; border-radius: 12px; font-size: 14px; margin-bottom: 25px; border-left: 5px solid var(--accent); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); gap: 16px; }
        .card { background: var(--card); border-radius: 16px; overflow: hidden; text-decoration: none; color: inherit; border: 1px solid #334155; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 10px 20px -10px rgba(244, 114, 182, 0.3); }
        .img-box { position: relative; padding-top: 135%; background: #000; }
        .img-box img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .v-tag { position: absolute; top: 10px; right: 10px; background: #10b981; color: #fff; font-size: 10px; padding: 3px 8px; border-radius: 20px; font-weight: bold; z-index: 2; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
        .info { padding: 12px; }
        .name { font-weight: bold; font-size: 1rem; display: block; margin-bottom: 5px; color: #fff; }
        .price { color: var(--primary); font-weight: 800; font-size: 1.1rem; }
        .location { font-size: 12px; color: #94a3b8; margin-top: 6px; display: flex; align-items: center; }
        footer { margin-top: 50px; text-align: center; padding: 30px; border-top: 1px solid #334155; color: #64748b; font-size: 12px; }
        @media (max-width: 480px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } h1 { font-size: 1.3rem; } }
    </style>
</head>
<body>
    <div class="container">
        <header class="header-section">
            <h1>${pageTitle}</h1>
        </header>

        <div class="zone-bar">
            <strong>📍 พิกัดยอดนิยมใน${provinceName}:</strong> ${localZones.join(' • ')} <br>
            พบโปรไฟล์ว่างวันนี้ ${profiles.length} รายการ - รูปตรงปก จ่ายเงินหน้างาน
        </div>

        <div class="grid">
            ${profiles.map(p => `
                <a href="${CONFIG.DOMAIN}/sideline/${p.slug}" class="card">
                    <div class="img-box">
                        <img src="${optimizeImg(p.imagePath, 350)}" 
                             alt="น้อง${p.name} ไซด์ไลน์${provinceName} โซน ${p.location || randomZone}" 
                             loading="lazy" 
                             decoding="async">
                        ${p.verified ? '<span class="v-tag">✓ ยืนยันตัวตน</span>' : ''}
                    </div>
                    <div class="info">
                        <span class="name">น้อง${p.name}</span>
                        <span class="price">${p.rate ? parseInt(p.rate).toLocaleString() : '1,500'}.-</span>
                        <div class="location">📍 ${p.location || randomZone}</div>
                    </div>
                </a>
            `).join('')}
        </div>

        <footer>
            <p>© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} | ศูนย์รวมสาวไซด์ไลน์คุณภาพสูง</p>
            <p>ไม่อนุญาตให้คัดลอกข้อมูลหรือรูปภาพไม่ว่ากรณีใดๆ</p>
        </footer>
    </div>
</body>
</html>`;

        // 7. PERFORMANCE HEADERS (SWR Strategy)
        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "cache-control": "public, s-maxage=900, stale-while-revalidate=3600",
                "X-Robots-Tag": "index, follow, max-image-preview:large"
            } 
        });

    } catch (err) {
        console.error("Critical SSR Error:", err);
        return context.next();
    }
};