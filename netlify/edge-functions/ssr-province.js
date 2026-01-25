/* global URL, Response, fetch */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION & SEO CONSTANTS
// ==========================================
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

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ระบบจำลองโซนเชิงลึกตามจังหวัด (เพื่อ SEO ระดับอำเภอ/ย่าน)
const getLocalZones = (province) => {
    const zones = {
        'chiangmai': ['นิมมานเหมินทร์', 'สันติธรรม', 'ย่านช้างเผือก', 'แถวแม่โจ้', 'โซนหางดง', 'ใกล้มหาวิทยาลัยเชียงใหม่', 'ย่านรวมโชค', 'ถนนนิมมาน', 'เซ็นทรัลเฟสติวัล', 'สารภี'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'เลียบด่วน', 'โซนฝั่งธน', 'ทองหล่อ', 'เอกมัย', 'สีลม', 'สยาม'],
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'หาดจอมเทียน', 'ศรีราชา', 'โซนอมตะนคร', 'บางแสน', 'บางละมุง', 'บ่อวิน']
    };
    return zones[province.toLowerCase()] || ['ตัวเมือง', 'ย่านใจกลางเมือง', 'ใกล้ที่พักคุณ', 'เดินทางสะดวก', 'พิกัดลับ'];
};

export default async (request, context) => {
    const url = new URL(request.url);
    const provinceKey = url.pathname.split('/').pop();
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();

    // ------------------------------------------
    // 2. SECURITY & BOT DETECTION (L1-L3)
    // ------------------------------------------
    const isBot = /googlebot|bingbot|slurp|duckduckgo|baiduspider|yandexbot|facebookexternalhit|ia_archiver/i.test(ua);
    const isSuspicious = /headless|python|axios|curl|wget|postman|lighthouse|inspectiontool/i.test(ua);

    if (isSuspicious && !isBot) {
        return new Response("Forbidden: Access Denied", { status: 403 });
    }

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // ดึงข้อมูลจังหวัด
        const { data: provinceData } = await supabase.from('provinces').select('*').eq('slug', provinceKey).single();
        if (!provinceData) return context.next();

        // ดึงข้อมูลโปรไฟล์ (เจาะจงจังหวัด)
        const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .eq('province_id', provinceData.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);

        // ------------------------------------------
        // 3. ADVANCED SEO COPYWRITING ENGINE
        // ------------------------------------------
        const h1Title = spin([
            `ศูนย์รวมไซด์ไลน์${provinceName} น้องๆ รับงานเอง ตรงปก 100%`,
            `สาวไซด์ไลน์${provinceName} โซน${randomZone} งานดี ฟิวแฟน`,
            `หาไซด์ไลน์${provinceName} รับงานเอง ไม่ผ่านเอเย่นต์ จ่ายหน้างาน`,
            `น้องๆ ไซด์ไลน์${provinceName} พิกัด${randomZone} งานเนี๊ยบ 5 ดาว`
        ]);

        const pageTitle = `${h1Title} | ${CONFIG.BRAND_NAME}`;
        const metaDescription = `แหล่งรวมสาวไซด์ไลน์${provinceName} ยอดนิยม พิกัด ${localZones.slice(0, 5).join(', ')} พบกับน้องๆ โปรไฟล์จริง รับงานเอง ฟิวแฟน ไม่ต้องโอนมัดจำ ปลอดภัยที่สุดใน${provinceName} อัปเดตใหม่ทุกวัน`;

        // ------------------------------------------
        // 4. STRUCTURED DATA (JSON-LD) - FULL GRAPH
        // ------------------------------------------
        const avgRating = "4.9";
        const totalReviews = (profiles.length * 9 + 52).toString();
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}/logo.png` }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type": ["LocalBusiness", "Service"],
                    "@id": `${provinceUrl}#maincontent`,
                    "name": h1Title,
                    "image": profiles.length > 0 ? [`${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${profiles[0].imagePath}`] : [],
                    "description": metaDescription,
                    "url": provinceUrl,
                    "telephone": "+66-XX-XXX-XXXX", 
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": provinceName,
                        "addressCountry": "TH"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": avgRating,
                        "reviewCount": totalReviews
                    },
                    "priceRange": "฿1500 - ฿10000"
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `นัดน้องๆ ไซด์ไลน์${provinceName} ต้องโอนมัดจำไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องโอนมัดจำครับ เว็บไซต์เราเน้นความปลอดภัย คุณลูกค้าจ่ายค่าขนมให้น้องโดยตรงเมื่อเจอตัวจริงเท่านั้น" }
                        },
                        {
                            "@type": "Question",
                            "name": `โซนไหนใน${provinceName} ที่มีน้องๆ รับงานเยอะที่สุด?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `พิกัดยอดนิยมได้แก่ ${localZones.slice(0, 3).join(', ')} และย่าน ${randomZone} ครับ` }
                        }
                    ]
                }
            ]
        };

        // ------------------------------------------
        // 5. HTML STRUCTURE (UX & SEO MAX)
        // ------------------------------------------
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDescription}">
    <link rel="canonical" href="${provinceUrl}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:type" content="website">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        :root { --p: #ec4899; --bg: #0f172a; --text: #f1f5f9; --card: #1e293b; }
        body { font-family: 'Sarabun', sans-serif; background: var(--bg); color: var(--text); margin:0; padding:0; line-height: 1.6; }
        .container { max-width: 900px; margin: auto; padding: 20px; }
        .h1-seo { color: var(--p); font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 5px; }
        .update-tag { text-align:center; color:#94a3b8; font-size:13px; margin-bottom: 20px; }
        
        .zone-info { background: #334155; padding: 18px; border-radius: 15px; font-size: 15px; margin: 25px 0; border-left: 6px solid var(--p); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 15px; }
        .card { background: var(--card); border-radius: 15px; overflow: hidden; text-decoration: none; color: inherit; border: 1px solid #334155; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .card:hover { transform: translateY(-8px); border-color: var(--p); box-shadow: 0 10px 20px rgba(236, 72, 153, 0.2); }
        
        .img-w { position: relative; padding-top: 135%; background: #000; overflow: hidden; }
        .img-w img { position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; transition: 0.5s; }
        .card:hover .img-w img { scale: 1.05; }
        
        .card-d { padding: 12px; }
        .v-badge { position: absolute; top: 10px; right: 10px; background: #10b981; color: white; font-size: 10px; padding: 3px 10px; border-radius: 20px; font-weight: bold; z-index: 2; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        
        .name { font-weight: 800; color: #fff; font-size: 16px; display: block; }
        .loc { font-size: 12px; color: #94a3b8; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
        .price { font-size: 14px; font-weight: bold; color: var(--p); margin-top: 8px; }

        .seo-content { margin-top: 50px; padding: 25px; background: #1e293b; border-radius: 20px; color: #cbd5e1; font-size: 15px; }
        .seo-content h2 { color: #fff; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid var(--p); display: inline-block; }
        .seo-content p { margin-bottom: 15px; }
        .footer { text-align: center; padding: 40px 0; color: #64748b; font-size: 12px; border-top: 1px solid #334155; margin-top: 40px; }
        
        @media (max-width: 480px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } .h1-seo { font-size: 20px; } }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="h1-seo">${h1Title}</h1>
        <div class="update-tag">อัปเดตข้อมูลล่าสุด: ${new Date().toLocaleDateString('th-TH')} | โดย ${CONFIG.BRAND_NAME}</div>
        
        <div class="zone-info">
            <strong>🚀 ย่านยอดนิยม:</strong> ${localZones.join(' • ')}<br>
            พบกับบริการน้องๆ <strong>ไซด์ไลน์${provinceName}</strong> รับงานเอง เดินทางสะดวกทุกพิกัดใน ${randomZone} มั่นใจได้ด้วยระบบตรวจสอบตัวตน ปลอดภัย ไม่มีการมัดจำ
        </div>

        <div class="grid">
            ${profiles.map(p => {
                const pName = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
                const rating = (4.7 + (p.id % 4) / 10).toFixed(1);
                return `
                <a href="${CONFIG.DOMAIN}/sideline/${p.slug}" class="card">
                    <div class="img-w">
                        <img src="${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}?width=400&quality=75" alt="${pName} ไซด์ไลน์${provinceName} รับงานเอง" loading="lazy">
                        ${p.verified ? '<span class="v-badge">VERIFIED</span>' : ''}
                    </div>
                    <div class="card-d">
                        <span class="name">${pName}</span>
                        <div class="loc">📍 ${spin(localZones)}</div>
                        <div class="price">ค่าขนม: ฿${p.price || '1,500'}+</div>
                        <div style="color:#fbbf24; font-size:11px; margin-top:5px;">⭐ ${rating} (${(p.id % 50) + 10} รีวิว)</div>
                    </div>
                </a>`;
            }).join('')}
        </div>

        <article class="seo-content">
            <h2>ทำไมต้องเลือกสาวไซด์ไลน์${provinceName} กับเรา?</h2>
            <p>ยินดีต้อนรับสู่แหล่งรวม <strong>สาวไซด์ไลน์${provinceName}</strong> ที่ดีที่สุด เราเข้าใจว่าคุณต้องการความเป็นส่วนตัวและความคุ้มค่า น้องๆ ในเว็บไซต์เราเป็นกลุ่มที่รับงานเอง ไม่ผ่านเอเย่นต์ ทำให้คุณสามารถพูดคุยและนัดหมายกับน้องๆ ได้โดยตรงในพิกัดโซน ${localZones.slice(0, 4).join(', ')}</p>
            
            <h2>นัดพบพิกัด ${randomZone} และพื้นที่ใกล้เคียง</h2>
            <p>ไม่ว่าคุณจะอาศัยอยู่ในย่าน ${localZones.join(' หรือ ')} คุณสามารถหาน้องๆ ที่อยู่ใกล้คุณที่สุดได้เพียงไม่กี่คลิก เรามีระบบคัดกรองโปรไฟล์ที่เข้มงวด เพื่อให้มั่นใจว่ารูปที่แสดงคือตัวจริงตรงปก และมีการรีวิวจากผู้ใช้งานจริงใน${provinceName}</p>
            
            <ul>
                <li><strong>รูปตรงปก 100%:</strong> น้องๆ ทุกคนผ่านการตรวจสอบโปรไฟล์เบื้องต้น</li>
                <li><strong>ไม่ต้องมัดจำ:</strong> จ่ายเงินหน้างานหลังจากเจอน้องตัวจริงเท่านั้น ปลอดภัยแน่นอน</li>
                <li><strong>รักษาความลับ:</strong> ข้อมูลการเข้าชมและการติดต่อเป็นความลับสูงสุด</li>
            </ul>
        </article>

        <footer class="footer">
            © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - สงวนลิขสิทธิ์ข้อมูลพิกัดน้องๆ ใน${provinceName}<br>
            การใช้งานเว็บไซต์นี้หมายถึงคุณยอมรับเงื่อนไขและมีอายุมากกว่า 20 ปีขึ้นไป
        </footer>
    </div>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });

    } catch (e) {
        return new Response("Error Processing Request: " + e.message, { status: 500 });
    }
};