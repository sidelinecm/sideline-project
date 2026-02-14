import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2tneWlra2VpdWNuZHRuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzIyOTMsImV4cCI6MjA4NjEwODI5M30.-x6TN3XQS43QTKv4LpZv9AM4_Tm2q3R4Nd-KGo-KU1E',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    STORAGE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co/storage/v1/object/public/profile-images',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];
const optimizeImg = (path, width = 400) => {
    if (!path) return `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=80&format=webp`;
};

// 📌 หมายเหตุ: คุณสามารถปรับแก้ข้อมูลโซนต่างๆ ในแต่ละจังหวัดให้ตรงกับความเป็นจริงได้ที่นี่
const getLocalZones = (provinceKey) => {
    const zones = {
        'chiang-mai': ['เมืองเชียงใหม่', 'นิมมาน', 'สันกำแพง', 'หางดง', 'แม่ริม'],
        'bangkok': ['สุขุมวิท', 'ทองหล่อ', 'สีลม', 'รัชดา', 'ลาดพร้าว'],
        'chonburi': ['พัทยา', 'บางแสน', 'ศรีราชา', 'เมืองชลบุรี'],
        'phuket': ['ป่าตอง', 'เมืองภูเก็ต', 'กะรน', 'ถลาง'],
        // เพิ่มจังหวัดอื่นๆ ตามต้องการ
    };
    return zones[provinceKey] || ['ในเมือง', 'รอบนอก', 'ใกล้ฉัน'];
};

// ==========================================
// 3. MAIN SSR FUNCTION - [PROVINCE MASTER]
// ==========================================
export default async (request, context) => {
    const url = new URL(request.url);
    const path = url.pathname;

    // 🛑 บล็อก: ถ้าไม่ใช่หน้าจังหวัด ห้ามทำ SSR
    if (!path.startsWith("/location/")) {
        return context.next();
    }

    // ตรวจสอบ User-Agent
    const ua = request.headers.get('user-agent') || '';
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|lighthouse/i.test(ua);
    
    // LAYER 2: SECURITY & CLOAKING (ป้องกันการดูดข้อมูลจากต่างประเทศที่ไม่ใช่บอท)
    const geo = context.geo || {};
    const isSuspicious = !geo.city || (geo.country?.code !== 'TH' && geo.country?.code !== 'US');

    // ถ้าไม่ใช่ Bot และไม่ใช่พฤติกรรมน่าสงสัย ให้ไป Client Render ปกติ
    if (!isBot && !isSuspicious) return context.next();

    const pathParts = path.split('/').filter(Boolean);
    
    // ตรวจสอบว่าเป็นหน้าจังหวัดหรือไม่ (เช่น /location/chiangmai)
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

        if (!provinceData) return context.next();

        // 2. ดึงโปรไฟล์น้องๆ ในจังหวัดนั้น (Limit 30 คน)
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate, active, provinceKey, isfeatured, created_at')
            .eq('provinceKey', provinceData.key || provinceData.slug)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(30);

        const provinceName = provinceData.nameThai;

        // กรณีไม่มีน้องๆ ในจังหวัดนี้ ให้ส่งหน้าพื้นฐานไป
        if (!profiles || profiles.length === 0) {
            const fallbackHtml = `<!DOCTYPE html>
<html lang="th">
<head>
    <title>ไซด์ไลน์${provinceName} - รับงานเองไม่มัดจำ</title>
    <meta name="description" content="กำลังอัปเดตข้อมูลน้องๆ ในจังหวัด${provinceName}">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { background: #000; color: #fff; text-align: center; padding: 50px; font-family: sans-serif; }
        h1 { color: #db2777; }
        p { color: #94a3b8; }
    </style>
</head>
<body>
    <h1>กำลังอัปเดตข้อมูลน้องๆ ใน${provinceName}</h1>
    <p>กรุณากลับมาตรวจสอบอีกครั้งเร็วๆ นี้</p>
</body>
</html>`;
            return new Response(fallbackHtml, { 
                headers: { 
                    "content-type": "text/html; charset=utf-8",
                    "cache-control": "public, max-age=3600"
                } 
            });
        }

        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        // --- SEO DATA ---
        const pageTitle = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง โซน${randomZone} ตรงปก ไม่มัดจำ (${new Date().getFullYear() + 543})`;
        const metaDesc = `ศูนย์รวมสาวไซด์ไลน์${provinceName} ยอดนิยมในโซน ${localZones.slice(0, 4).join(', ')} พบกับโปรไฟล์น้องๆ รับงานเอง ฟิวแฟน ไม่ผ่านเอเย่นต์ ปลอดภัย จ่ายหน้างาน 100% ในจังหวัด${provinceName}`;

        // ==========================================
        // 4. STRUCTURED DATA (JSON-LD)
        // ==========================================
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Organization",
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": `${CONFIG.DOMAIN}/logo.png`
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type": "ItemList",
                    "name": `รายชื่อน้องๆ ไซด์ไลน์${provinceName}`,
                    "numberOfItems": profiles.length,
                    "itemListElement": profiles.map((p, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Person",
                            "name": p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`,
                            "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                            "image": optimizeImg(p.imagePath, 400),
                            "description": `สาวสวยรับงานไซด์ไลน์${provinceName} พิกัด ${p.location || randomZone}`
                        }
                    }))
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `หาไซด์ไลน์ใน${provinceName} ต้องมัดจำไหม?`,
                            "acceptedAnswer": { 
                                "@type": "Answer", 
                                "text": `ไม่ต้องมัดจำครับ เว็บไซต์เราเน้นนัดเจอน้องในจังหวัด${provinceName}แล้วค่อยชำระเงินหน้างานเท่านั้น` 
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `ไซด์ไลน์${provinceName} มีบริการในพื้นที่ไหนบ้าง?`,
                            "acceptedAnswer": { 
                                "@type": "Answer", 
                                "text": `บริการครอบคลุมพื้นที่หลักใน${provinceName} เช่น ${localZones.slice(0, 3).join(', ')} และพื้นที่ใกล้เคียง` 
                            }
                        }
                    ]
                }
            ]
        };

        // ==========================================
        // 5. HTML TEMPLATE (SEO OPTIMIZED)
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${provinceUrl}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${optimizeImg(profiles[0].imagePath, 800)}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${optimizeImg(profiles[0].imagePath, 800)}">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #0f172a; 
            color: #f8fafc; 
            line-height: 1.6;
            padding: 0;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
        }
        .header { 
            text-align: center; 
            padding: 30px 0; 
            border-bottom: 1px solid #334155;
            margin-bottom: 30px;
        }
        h1 { 
            color: #db2777; 
            font-size: 2.2rem;
            margin-bottom: 15px;
        }
        .subtitle { 
            color: #94a3b8; 
            font-size: 1.1rem;
            max-width: 800px;
            margin: 0 auto;
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
            gap: 20px; 
            margin: 30px 0;
        }
        .card { 
            background: #1e293b; 
            border-radius: 12px; 
            overflow: hidden; 
            text-decoration: none; 
            color: inherit; 
            border: 1px solid #334155;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        .card img { 
            width: 100%; 
            aspect-ratio: 1/1; 
            object-fit: cover;
            background: #374151;
        }
        .card-content { 
            padding: 15px; 
        }
        .name { 
            font-weight: 700; 
            display: block; 
            font-size: 1rem;
            margin-bottom: 5px;
            color: #f1f5f9;
        }
        .price { 
            color: #db2777; 
            font-size: 0.9rem; 
            font-weight: 600;
        }
        .location { 
            font-size: 0.8rem; 
            color: #94a3b8;
            margin-top: 5px;
        }
        .stats {
            background: #1e293b;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            border: 1px solid #334155;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .stat-item {
            text-align: center;
        }
        .stat-number {
            font-size: 1.5rem;
            font-weight: 700;
            color: #db2777;
        }
        .stat-label {
            font-size: 0.85rem;
            color: #94a3b8;
        }
        footer { 
            text-align: center; 
            margin-top: 50px; 
            padding-top: 30px;
            border-top: 1px solid #334155;
            font-size: 0.85rem; 
            color: #64748b;
        }
        @media (max-width: 768px) {
            .container { padding: 15px; }
            h1 { font-size: 1.8rem; }
            .grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
            gap: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📍 ไซด์ไลน์${provinceName} รับงานเอง</h1>
            <p class="subtitle">${metaDesc}</p>
        </div>

        <div class="stats">
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${profiles.length}+</div>
                    <div class="stat-label">โปรไฟล์น้องๆ</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">100%</div>
                    <div class="stat-label">จ่ายหน้างาน</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">0฿</div>
                    <div class="stat-label">ไม่มัดจำ</div>
                </div>
            </div>
        </div>

        <div class="grid">
            ${profiles.map(p => `
                <a href="${CONFIG.DOMAIN}/sideline/${p.slug}" class="card">
                    <img 
                        src="${optimizeImg(p.imagePath, 300)}" 
                        alt="น้อง${p.name} ไซด์ไลน์${provinceName}"
                        loading="lazy"
                        onerror="this.src='${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp'"
                    >
                    <div class="card-content">
                        <span class="name">${p.name.startsWith('น้อง') ? p.name : 'น้อง' + p.name}</span>
                        <span class="price">${parseInt(p.rate || 1500).toLocaleString()}.-</span>
                        <div class="location">📍 ${p.location || randomZone}</div>
                    </div>
                </a>
            `).join('')}
        </div>

        <footer>
            <p>© ${new Date().getFullYear() + 543} ${CONFIG.BRAND_NAME} - บริการไซด์ไลน์คุณภาพใน${provinceName}</p>
            <p style="margin-top: 10px; font-size: 0.75rem;">
                อัปเดตล่าสุด: ${new Date().toLocaleDateString('th-TH', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </p>
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
        // ในกรณีเกิดข้อผิดพลาด ให้ส่งไปยัง Client-side Rendering แทน
        return context.next();
    }
};
