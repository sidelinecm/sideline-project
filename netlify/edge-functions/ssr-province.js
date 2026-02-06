import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION & FULL DIGITAL FOOTPRINT
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai", 
        "https://x.com/Sdl_chiangmai",
        "https://bsky.app/profile/sidelinechiangmai.bsky.social",
        "https://www.linkedin.com/in/cuteti-sexythailand-398567280", 
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

// ==========================================
// 2. ADVANCED HELPERS (SEO & IMAGE)
// ==========================================
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path, width = 350) => {
    if (!path) return `${CONFIG.DOMAIN}/logo.png`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=75&format=webp`;
};

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมานเหมินท์', 'สันติธรรม', 'ช้างเผือก', 'แม่โจ้', 'หางดง', 'มช.', 'สันกำแพง', 'แม่ริม'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'เลียบด่วน', 'ฝั่งธน', 'บางนา', 'สีลม'],
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'จอมเทียน', 'ศรีราชา', 'อมตะนคร', 'บางแสน'],
        'phuket': ['ป่าตอง', 'กะตะ', 'กะรน', 'ตัวเมืองภูเก็ต', 'ราไวย์']
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'ย่านใจกลางเมือง', 'พื้นที่ใกล้เคียง', 'พิกัดลับ'];
};

// ==========================================
// 3. MAIN SSR FUNCTION
// ==========================================
export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // LAYER 1: BOT DETECTION (SSR เฉพาะบอท เพื่อความเร็วและประหยัด Resource)
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|lighthouse/i.test(ua);
    
    // ถ้าไม่ใช่ Bot ให้ Netlify ส่งหน้าเว็บปกติ (Client-side) ไปเลย
    if (!isBot) return context.next();

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const provinceKey = pathParts[pathParts.length - 1];

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 1. ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase
            .from('provinces')
            .select('id, nameThai, slug')
            .eq('slug', provinceKey)
            .single();

        if (!provinceData) return context.next();

        // 2. ดึงโปรไฟล์น้องๆ ในจังหวัดนั้น (Limit 30 คน เพื่อให้บอทเก็บข้อมูลได้เยอะ)
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, verified, location, rate')
            .eq('province_id', provinceData.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(30);

        // กรณีไม่มีน้องๆ ในจังหวัดนี้
        if (!profiles || profiles.length === 0) {
            return new Response(`<!DOCTYPE html><html lang="th"><head><title>ไซด์ไลน์${provinceData.nameThai} - รับงานเอง</title></head><body><h1>กำลังอัปเดตโปรไฟล์น้องๆ ใน${provinceData.nameThai}</h1></body></html>`, { headers: { "content-type": "text/html; charset=utf-8" } });
        }

        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        // --- SEO DATA ---
        const pageTitle = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง โซน${randomZone} ตรงปก ไม่มัดจำ`;
        const metaDesc = `ศูนย์รวมสาวไซด์ไลน์${provinceName} ยอดนิยมในโซน ${localZones.slice(0, 4).join(', ')} และพื้นที่ใกล้เคียง พบกับโปรไฟล์น้องๆ รับงานเอง ฟิวแฟน ไม่ผ่านเอเย่นต์ ปลอดภัย จ่ายหน้างาน 100% ในจังหวัด${provinceName}`;

        // ==========================================
        // 4. STRUCTURED DATA (JSON-LD) - MASTER LIST
        // ==========================================
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}/logo.png` },
                    "sameAs": CONFIG.SOCIAL_PROFILES
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}#maincontent`,
                    "name": pageTitle,
                    "description": metaDesc,
                    "url": provinceUrl,
                    "mainEntity": {
                        "@type": "ItemList",
                        "name": `รายชื่อน้องๆ ไซด์ไลน์${provinceName}`,
                        "itemListElement": profiles.map((p, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                                "@type": "Person",
                                "name": p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`,
                                "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                                "image": optimizeImg(p.imagePath, 400),
                                "description": `ไซด์ไลน์${provinceName} พิกัด ${p.location || randomZone}`
                            }
                        }))
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `หาไซด์ไลน์ใน${provinceName} โซนไหนเดินทางสะดวกที่สุด?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `โซนยอดนิยมใน${provinceName} ได้แก่ ${localZones.join(', ')} ซึ่งมีน้องๆ รับงานเองอยู่จำนวนมากครับ` }
                        },
                        {
                            "@type": "Question",
                            "name": `จองน้องๆ ผ่านเว็บ ${CONFIG.BRAND_NAME} ปลอดภัยไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `ปลอดภัย 100% ครับ เพราะเราเน้นให้นัดเจอน้องและจ่ายเงินหน้างานเท่านั้น ห้ามโอนมัดจำทุกกรณี` }
                        }
                    ]
                }
            ]
        };

        // ==========================================
        // 5. HTML TEMPLATE (FULLY OPTIMIZED)
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${provinceUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${optimizeImg(profiles[0].imagePath, 600)}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:type" content="website">

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root{--p:#db2777;--bg:#0f172a;--card:#1e293b}
        body{font-family:-apple-system,system-ui,sans-serif;background:var(--bg);color:#fff;margin:0;padding:20px;line-height:1.6}
        .container{max-width:900px;margin:auto}
        .h1-seo{color:var(--p);font-size:26px;text-align:center;font-weight:800;margin-bottom:10px}
        .zone-info{background:var(--card);padding:20px;border-radius:12px;font-size:15px;margin:20px 0;border-left:5px solid var(--p);color:#cbd5e1}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:20px;margin-top:30px}
        .card{background:var(--card);border-radius:15px;overflow:hidden;text-decoration:none;color:inherit;transition:0.3s;border:1px solid #334155;display:block}
        .img-w{position:relative;padding-top:130%;background:#000}
        .img-w img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
        .card-d{padding:12px}.name{font-weight:700;font-size:16px;color:#f1f5f9;display:block}
        .loc{font-size:13px;color:#94a3b8;margin-top:4px}
        .price{color:var(--p);font-weight:800;font-size:14px;margin-top:5px;display:block}
        .v-badge{position:absolute;top:10px;right:10px;background:#10b981;color:#fff;font-size:11px;padding:3px 8px;border-radius:20px;font-weight:700;box-shadow:0 2px 5px rgba(0,0,0,0.3)}
        .footer{text-align:center;padding:40px 0;color:#64748b;font-size:13px}
    </style>
</head>
<body>
    <div class="container">
        <h1 class="h1-seo">พิกัดน้องๆ ไซด์ไลน์${provinceName} รับงานเอง</h1>
        
        <div class="zone-info">
            <strong>📍 พื้นที่บริการยอดนิยม:</strong> ${localZones.join(' • ')}<br>
            พบกับน้องๆ งานดี เดินทางสะดวก ไม่ว่าคุณจะอยู่ในโซน ${randomZone} หรือพื้นที่ใกล้เคียง นัดง่าย จ่ายหน้างาน ไม่ต้องโอนมัดจำ
        </div>

        <div class="grid">
            ${profiles.map(p => {
                const pName = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
                return `
                <a href="/sideline/${p.slug}" class="card">
                    <div class="img-w">
                        <img src="${optimizeImg(p.imagePath, 400)}" alt="${pName} ไซด์ไลน์${provinceName}" loading="lazy" decoding="async">
                        ${p.verified ? '<span class="v-badge">✓ Verified</span>' : ''}
                    </div>
                    <div class="card-d">
                        <span class="name">${pName}</span>
                        <div class="loc">📍 ${p.location || randomZone}</div>
                        <span class="price">ค่าขนม: ${parseInt(p.rate || 1500).toLocaleString()}.-</span>
                        <div style="color:#fbbf24;font-size:12px;margin-top:5px">⭐ ${(4.7 + (p.id % 3) / 10).toFixed(1)}</div>
                    </div>
                </a>`;
            }).join('')}
        </div>

        <footer class="footer">
            © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - ศูนย์รวมไซด์ไลน์${provinceName} อันดับ 1
        </footer>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow",
                "cache-control": "public, max-age=3600, s-maxage=86400" 
            } 
        });

    } catch (e) {
        console.error("SSR Province Error:", e);
        return context.next();
    }
};