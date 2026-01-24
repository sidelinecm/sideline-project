/* global URL, Response, fetch */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION (รวมศูนย์การตั้งค่า)
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://bsky.app/profile/sidelinechiangmai.bsky.social"
    ]
};

// SEO Spintax Engine: สุ่มประโยคเพื่อให้ Google มองว่าเป็นเนื้อหาใหม่เสมอ
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const clientIP = request.headers.get('x-nf-client-connection-ip') || '';
    
    // ==========================================
    // 2. ULTIMATE SECURITY (CLOAKING)
    // ==========================================
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    const geo = context.geo || {};
    
    // กรองขั้นที่ 1: ต้องเป็นบอท หรือ คนที่พิกัดไม่ใช่ไทย (Suspicious)
    // กรองขั้นที่ 2: ถ้าไม่ใช่ไทย ให้เช็ค IP ว่ามาจาก Data Center หรือไม่
    const isSuspicious = !geo.city || geo.country?.code !== 'TH';

    let isDataCenter = false;
    if (clientIP && clientIP !== '127.0.0.1' && (isBot || isSuspicious)) {
        try {
            const ipCheck = await fetch(`http://ip-api.com/json/${clientIP}?fields=hosting`);
            const ipData = await ipCheck.json();
            isDataCenter = ipData.hosting === true;
        } catch (e) { isDataCenter = false; }
    }

    // [ACTION] ถ้าไม่ใช่บอท และเป็นคนไทยตัวจริง -> ให้ข้ามไปหน้าเว็บแอปหลัก (Client-side)
    if (!isBot && !isSuspicious && !isDataCenter) return context.next();

    // ==========================================
    // 3. SSR & DATA DISCOVERY (ระบบวิเคราะห์ย่านอัตโนมัติ)
    // ==========================================
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const provinceKey = decodeURIComponent(pathParts[pathParts.length - 1]);
        const zoneQuery = url.searchParams.get('zone') || '';

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // ดึงข้อมูล 3 อย่างพร้อมกันเพื่อความเร็วสูงสุด
        const [provRes, profRes, allLocationsRes] = await Promise.all([
            // 1. ข้อมูลจังหวัด
            supabase.from('provinces').select('*').eq('key', provinceKey).maybeSingle(),
            // 2. รายชื่อน้องๆ (กรองตาม Zone ถ้ามีการเลือก)
            (async () => {
                let q = supabase.from('profiles').select('*').eq('provinceKey', provinceKey).eq('active', true);
                if (zoneQuery) q = q.ilike('location', `%${zoneQuery}%`);
                return q.order('created_at', { ascending: false }).limit(100);
            })(),
            // 3. สแกนพิกัดทั้งหมดที่มีในฐานข้อมูล (เพื่อสร้างปุ่มอัตโนมัติ)
            supabase.from('profiles').select('location').eq('provinceKey', provinceKey).eq('active', true).not('location', 'is', null)
        ]);

        if (!provRes.data) return context.next();

        const province = provRes.data;
        const profiles = profRes.data || [];
        const provinceName = province.nameThai;

        // --- 🛠️ AUTOMATIC ZONE DISCOVERY LOGIC ---
        // สแกนหาพิกัดยอดนิยมที่แอดมินพิมพ์ไว้ แล้วสร้างเป็น List ปุ่มกด
        const locationStrings = allLocationsRes.data?.map(d => d.location) || [];
        const zoneCounts = {};
        locationStrings.forEach(loc => {
            const parts = loc.split(/[\s,/-]+/).filter(p => p.length >= 2 && p.length <= 20);
            parts.forEach(p => zoneCounts[p] = (zoneCounts[p] || 0) + 1);
        });
        const dynamicZones = Object.entries(zoneCounts)
            .sort((a, b) => b[1] - a[1]) // ย่านไหนคนเยอะสุดขึ้นก่อน
            .slice(0, 12) // เอามา 12 ย่านที่เด่นที่สุด
            .map(z => z[0]);

        // --- 🛠️ SEO CONTENT GENERATION ---
        const thaiDate = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        const zoneText = zoneQuery ? ` โซน${zoneQuery}` : '';
        
        const titleIntro = spin(["รวมสาวสวย", "อัปเดตใหม่", "คัดพิเศษ", "น้องใหม่มาแรง", "ที่สุดของ"]);
        const serviceFeature = spin(["ฟิวแฟน ตรงปก", "งานดี ไม่มัดจำ", "สวยพรีเมียม จ่ายหน้างาน", "รับงานเอง ไม่ผ่านเอเย่นต์"]);
        
        const pageTitle = `${titleIntro} ไซด์ไลน์${provinceName}${zoneText} - ${serviceFeature} [${thaiDate}]`;
        const metaDesc = `ศูนย์รวมโปรไฟล์สาวสวยไซด์ไลน์${provinceName}${zoneText} พบกับน้องๆ ${profiles.length}+ คน ${serviceFeature} พิกัดพื้นที่${zoneQuery || provinceName} และย่านใกล้เคียง การันตีรูปจริงตรงปก 100% ปลอดภัย ไม่มีการโอนมัดจำก่อนทุกกรณี`;

        // ==========================================
        // 4. ADVANCED STRUCTURED DATA (GRAPH SCHEMA)
        // ==========================================
        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "@id": `${url.href}#webpage`,
                    "url": url.href,
                    "name": pageTitle,
                    "description": metaDesc,
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
                    "numberOfItems": profiles.length,
                    "itemListElement": profiles.map((p, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "item": {
                            "@type": "Person",
                            "name": p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`,
                            "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                            "image": `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}?width=400&quality=75&format=webp`
                        }
                    }))
                }
            ]
        };

        // ==========================================
        // 5. FULL OPTIMIZED HTML & CSS
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${url.href}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        :root{--p:#db2777;--s:#9333ea;--bg:#f8f9fa;--t:#1f2937;--g:#6b7280}
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;background:var(--bg);color:var(--t);line-height:1.6}
        .container{max-width:1000px;margin:0 auto;padding:20px}
        header{background:linear-gradient(135deg,var(--p),var(--s));color:#fff;padding:50px 20px;border-radius:28px;text-align:center;margin-bottom:30px;box-shadow:0 10px 30px -10px rgba(219,39,119,0.5)}
        h1{margin:0;font-size:32px;font-weight:900;letter-spacing:-1px}
        .header-desc{opacity:0.9;margin-top:12px;font-size:17px;max-width:600px;margin-left:auto;margin-right:auto}
        
        /* Zone Navigation Styling */
        .z-nav{background:#fff;padding:24px;border-radius:24px;margin-bottom:30px;border:1px solid #e5e7eb;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05)}
        .z-nav b{display:block;margin-bottom:15px;font-size:14px;color:var(--g);text-transform:uppercase;letter-spacing:1px;font-weight:700}
        .z-box{display:flex;gap:10px;flex-wrap:wrap}
        .z-item{padding:10px 20px;background:#f3f4f6;border-radius:100px;text-decoration:none;color:#4b5563;font-size:14px;font-weight:700;transition:all 0.2s ease;border:1px solid transparent}
        .z-item:hover{background:#e5e7eb;transform:translateY(-1px)}
        .z-item.active{background:var(--p);color:#fff;border-color:var(--p);box-shadow:0 4px 12px rgba(219,39,119,0.3)}
        
        /* Grid & Cards */
        .grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:25px}
        .card{background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);text-decoration:none;color:inherit;transition:all 0.3s ease;border:1px solid #f3f4f6}
        .card:hover{transform:translateY(-5px);box-shadow:0 20px 25px -5px rgba(0,0,0,0.1)}
        .img-wrapper{position:relative;width:100%;aspect-ratio:3/4;background:#e5e7eb}
        .card img{width:100%;height:100%;object-fit:cover}
        .v-badge{position:absolute;top:15px;right:15px;background:#06c755;color:#fff;padding:5px 12px;border-radius:100px;font-size:11px;font-weight:900;box-shadow:0 4px 6px rgba(0,0,0,0.1)}
        .card-content{padding:20px}
        .profile-name{font-size:20px;font-weight:800;color:var(--p);margin-bottom:6px;display:block}
        .profile-loc{font-size:14px;color:var(--g);display:flex;align-items:center;gap:5px}
        .profile-price{margin-top:15px;font-weight:800;color:var(--t);font-size:16px;display:flex;justify-content:space-between;align-items:center}
        .rating{color:#fbbf24;font-size:14px}

        footer{text-align:center;margin-top:80px;padding:50px;color:var(--g);font-size:13px;border-top:1px solid #e5e7eb}
        @media(max-width:640px){.grid{grid-template-columns:repeat(2, 1fr);gap:12px}.container{padding:10px}.card-content{padding:12px}.profile-name{font-size:16px}h1{font-size:24px}}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>ไซด์ไลน์${provinceName}${zoneText}</h1>
            <div class="header-desc">${metaDesc}</div>
        </header>

        <!-- 📍 AUTO-GENERATED ZONE NAVIGATION -->
        ${dynamicZones.length > 0 ? `
        <div class="z-nav">
            <b>📍 ค้นหาเจาะจงย่านยอดนิยมใน${provinceName}</b>
            <div class="z-box">
                <a href="${CONFIG.DOMAIN}/location/${provinceKey}" class="z-item ${!zoneQuery ? 'active' : ''}">ทั้งหมด</a>
                ${dynamicZones.map(z => `
                    <a href="${CONFIG.DOMAIN}/location/${provinceKey}?zone=${encodeURIComponent(z)}" class="z-item ${zoneQuery === z ? 'active' : ''}">${z}</a>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <div class="grid">
            ${profiles.map(p => {
                const nameWithPrefix = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
                const formattedPrice = parseInt((p.rate || "1500").toString().replace(/[^0-9]/g, '')).toLocaleString();
                return `
                <a href="${CONFIG.DOMAIN}/sideline/${p.slug}" class="card">
                    <div class="img-wrapper">
                        <img src="${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}?width=450&quality=75&format=webp" alt="${nameWithPrefix}" loading="lazy">
                        ${p.verified ? '<span class="v-badge">✓ ตัวจริง</span>' : ''}
                    </div>
                    <div class="card-content">
                        <span class="profile-name">${nameWithPrefix}</span>
                        <div class="profile-loc">📍 ${p.location || provinceName}</div>
                        <div class="profile-price">
                            <span>ค่าขนม: ${formattedPrice}.-</span>
                            <span class="rating">⭐ ${(4.7 + (p.id % 4) / 10).toFixed(1)}</span>
                        </div>
                    </div>
                </a>
                `;
            }).join('')}
        </div>

        <footer>
            © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} • อัปเดตข้อมูลล่าสุด: ${thaiDate}<br>
            มั่นใจ ปลอดภัย ตรงปก 100% จ่ายเงินหน้างานเท่านั้น ไม่มีการโอนมัดจำทุกกรณี
        </footer>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow",
                "cache-control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=600"
            } 
        });

    } catch (e) {
        // หากเกิดข้อผิดพลาดรุนแรง ให้ส่งไปหน้าเว็บปกติเพื่อความปลอดภัย
        return context.next();
    }
};