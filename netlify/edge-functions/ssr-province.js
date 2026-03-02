import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path, width = 400) => {
    if (!path) return CONFIG.DEFAULT_IMAGE;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/c_scale,w_${width},q_auto,f_auto/`);
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

// 📍 Local Zones ขยาย
const getLocalZones = (provinceKey) => ({
    'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง'],
    'bangkok': ['สุขุมวิท', 'รัชดา', 'ทองหล่อ', 'สาทร', 'สีลม'],
    'chonburi': ['พัทยา', 'บางแสน', 'ศรีราชา'],
    'khonkaen': ['มข.', 'กังสดาล', 'เซ็นทรัลขอนแก่น'],
    'phuket': ['ป่าตอง', 'กะตะ', 'กะรน']
}[provinceKey.toLowerCase()] || ['ย่านใจกลางเมือง', 'โซนยอดนิยม']);

// 🛡️ 3. Circuit Breaker
const fetchWithTimeout = async (promise, ms = 4000) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout ${ms}ms`)), ms))
]);

// 🔐 4. Rate Limiting
const checkRateLimit = (context, request) => {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        const now = Date.now();
        const kvKey = `rate-loc:${ip.slice(0, 20)}`;
        const calls = context.kv?.get({ key: kvKey })?.value || [];
        const recent = calls.filter(t => now - t < 3600000);
        if (recent.length >= 200) return false;
        recent.unshift(now);
        context.kv?.put({ key: kvKey, value: recent.slice(0, 199), expirationTtl: 3600 });
        return true;
    } catch { return true; }
};

export default async (request, context) => {
    // 🔐 Rate Limit
    if (!checkRateLimit(context, request)) {
        return new Response('Too Many Requests', { status: 429, headers: { 'Retry-After': '3600' } });
    }

    // 🕷️ Bot Detection
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|lighthouse|headless/i.test(ua);
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        // 🔐 Sanitize provinceKey
        const rawProvinceKey = pathParts[pathParts.length - 1] || 'chiangmai';
        const provinceKey = rawProvinceKey.replace(/[^\w\-]/g, '').toLowerCase();
        if (provinceKey !== rawProvinceKey.toLowerCase()) return context.next();

        const supabase = getSupabase();

        // ⚡ 5. Parallel Query + Limit + Timeout
        const [provinceRes, profilesRes] = await Promise.allSettled([
            fetchWithTimeout(supabase.from('provinces').select('nameThai, key').eq('key', provinceKey).maybeSingle(), 3000),
            fetchWithTimeout(supabase
                .from('profiles')
                .select('slug, name, imagePath, location, rate, isfeatured, availability, provinceKey, lastUpdated')
                .eq('provinceKey', provinceKey)
                .eq('active', true)
                .order('isfeatured', { ascending: false })
                .order('lastUpdated', { ascending: false })
                .limit(48), // 🎯 จำกัด 48 profiles
                5000
            )
        ]);

        const provinceData = provinceRes.status === 'fulfilled' ? provinceRes.value.data : null;
        const profiles = profilesRes.status === 'fulfilled' ? profilesRes.value.data || [] : [];
        
        if (!provinceData || profiles.length === 0) return context.next();

        // 6. Data Processing
        const provinceName = provinceData.nameThai || provinceKey;
        const profileCount = profiles.length;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        const YEAR_TH = new Date().getFullYear() + 543;
        const DYNAMIC_BRAND = `Sideline ${provinceName}`;

        // 💰 ราคา calculation (แก้ regex)
        const prices = profiles.map(p => parseInt((p.rate || "1500").toString().replace(/\D/g, ''))).filter(p => p > 0);
        const minPrice = prices.length ? Math.min(...prices) : 1500;
        const maxPrice = prices.length ? Math.max(...prices) : 3000;
        const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 2000;

        const title = `ไซด์ไลน์${provinceName} ${profileCount} โปรไฟล์ โซน${randomZone} (${YEAR_TH})`;
        const description = `รวมไซด์ไลน์${provinceName} ${profileCount} คน ราคา ฿${minPrice.toLocaleString()}-${maxPrice.toLocaleString()} ครอบคลุม ${localZones.slice(0, 3).join(', ')}`;

        // 👑 7. Schema สมบูรณ์
        const schema = {
            "@context": "https://schema.org",
            "@graph": [{
                "@type": "CollectionPage",
                "url": `${CONFIG.DOMAIN}/location/${provinceKey}`,
                "name": title,
                "description": description,
                "isPartOf": { "@type": "WebSite", "@id": `${CONFIG.DOMAIN}/#website` }
            }, {
                "@type": "Service",
                "name": `ไซด์ไลน์${provinceName}`,
                "areaServed": { "@type": "State", "name": provinceName },
                "offers": {
                    "@type": "AggregateOffer",
                    "lowPrice": minPrice,
                    "highPrice": maxPrice,
                    "priceCurrency": "THB",
                    "offerCount": profileCount.toString()
                }
            }]
        };

        // 8. HTML Cards
        const profileCards = profiles.map(p => {
            const isBusy = p.availability?.includes('ไม่ว่าง') || p.availability?.includes('ติดจอง');
            const price = parseInt((p.rate || "1500").toString().replace(/\D/g, '')) || 1500;
            return `
            <a href="/sideline/${p.slug}" class="card">
                <div class="img-box">
                    <img src="${optimizeImg(p.imagePath, 300)}" alt="${p.name}" loading="lazy">
                    ${p.isfeatured ? '<span class="feat-tag">★ HOT</span>' : ''}
                    <span class="status" style="color:${isBusy ? '#ff4d4d' : '#00ff88'}">● ${p.availability || 'ว่าง'}</span>
                </div>
                <div class="card-info">
                    <span class="name">${p.name}</span>
                    <div class="loc"><i class="fas fa-map-marker-alt"></i>${p.location || provinceName}</div>
                    <span class="price">฿${price.toLocaleString()}</span>
                </div>
            </a>`;
        }).join('');

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${CONFIG.DOMAIN}/location/${provinceKey}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${optimizeImg(profiles[0]?.imagePath, 800)}">
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    <style>
        :root{--p:#db2777;--bg:#0f172a;--card:#1e293b;--txt:#f8fafc;}
        *{box-sizing:border-box;}
        body{font-family:'Prompt',sans-serif;background:var(--bg);color:var(--txt);margin:0;padding:0;line-height:1.6;}
        header{background:rgba(15,23,42,.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(255,255,255,.1);}
        .nav-wrap{max-width:1200px;margin:0 auto;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;}
        .logo img{height:30px;}
        .nav-links a{color:#fff;text-decoration:none;font-weight:600;font-size:14px;margin-left:20px;}
        .nav-links a:hover{color:var(--p);}
        .container{max-width:1200px;margin:0 auto;padding:30px 20px;}
        .hero{text-align:center;margin-bottom:40px;}
        h1{font-size:clamp(24px,6vw,36px);font-weight:900;margin:0 0 15px;background:linear-gradient(135deg,#fff,var(--p));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .breadcrumb{font-size:13px;color:#64748b;margin-bottom:20px;}
        .badge-count{background:linear-gradient(135deg,var(--p),#ec4899);color:#fff;padding:8px 16px;border-radius:100px;font-weight:900;font-size:14px;display:inline-block;}
        .price-range{background:rgba(255,255,255,.05);border:1px solid rgba(219,39,119,.2);border-radius:12px;padding:20px;margin:30px auto;max-width:500px;text-align:center;}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:20px;margin-top:50px;}
        @media(min-width:768px){.grid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:25px;}}
        .card{background:var(--card);border-radius:20px;overflow:hidden;text-decoration:none;color:inherit;border:1px solid rgba(255,255,255,.08);transition:all .4s cubic-bezier(.4,0,.2,1);}
        .card:hover{transform:translateY(-8px);border-color:var(--p);box-shadow:0 20px 40px -15px rgba(219,39,119,.4);}
        .img-box{position:relative;aspect-ratio:3/4;background:linear-gradient(135deg,#000,#1a1a2e);overflow:hidden;}
        .img-box img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;}
        .feat-tag{position:absolute;top:12px;left:12px;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#000;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:900;z-index:5;}
        .status{position:absolute;top:12px;right:12px;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);padding:6px 12px;border-radius:20px;font-size:11px;font-weight:800;border:1px solid rgba(255,255,255,.2);z-index:5;}
        .card-info{padding:20px;display:flex;flex-direction:column;justify-content:space-between;flex-grow:1;}
        .name{font-weight:900;font-size:18px;color:#fff;margin-bottom:6px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .loc{font-size:13px;color:#94a3b8;display:flex;align-items:center;gap:6px;margin-bottom:4px;}
        .price{color:#fbbf24;font-weight:900;font-size:22px;margin-top:auto;text-shadow:0 2px 4px rgba(0,0,0,.3);}
        .sticky-line{position:fixed;bottom:30px;right:25px;left:25px;max-width:400px;margin:0 auto;background:linear-gradient(135deg,#06c755,#10b981);color:#fff;padding:16px 24px;border-radius:50px;text-decoration:none;font-weight:900;font-size:16px;display:flex;align-items:center;justify-content:center;gap:12px;box-shadow:0 12px 40px rgba(6,199,85,.4);z-index:1000;}
        @media(min-width:768px){.sticky-line{left:auto;right:30px;max-width:none;}}
        .sticky-line:hover{transform:translateY(-3px) scale(1.02);background:linear-gradient(135deg,#059669,#047857);}
        footer{text-align:center;padding:60px 20px 40px;color:#64748b;font-size:13px;border-top:1px solid rgba(255,255,255,.05);max-width:800px;margin:0 auto;}
    </style>
</head>
<body>
    <header>
        <div class="nav-wrap">
            <a href="/"><img src="${CONFIG.LOGO}" alt="Logo"></a>
            <nav class="nav-links"><a href="/profiles.html">น้องๆ ทั้งหมด</a><a href="/locations.html">ทุกจังหวัด</a></nav>
        </div>
    </header>
    <div class="container">
        <div class="breadcrumb"><a href="/" style="color:#94a3b8">หน้าแรก</a> / <span style="color:#fff;font-weight:600">${provinceName}</span></div>
        <div class="hero">
            <h1>ไซด์ไลน์${provinceName}<br><span style="font-weight:600;font-size:.85em">${profileCount} โปรไฟล์</span></h1>
            <span class="badge-count">อัปเดต ${new Date().toLocaleDateString('th-TH')}</span>
            <div class="price-range">
                <div style="font-size:14px;color:#94a3b8;margin-bottom:8px">ช่วงราคาค่าขนม</div>
                <span style="color:#fbbf24;font-weight:900;font-size:24px;">฿${minPrice.toLocaleString()}-${maxPrice.toLocaleString()}</span>
                <div style="font-size:12px;color:#64748b;margin-top:4px">เฉลี่ย ฿${avgPrice.toLocaleString()}</div>
            </div>
        </div>
        <div class="grid">${profileCards}</div>
        ${profileCount >= 48 ? `<div style="text-align:center;margin:60px 0 40px"><p style="color:#94a3b8;font-size:14px">+${profileCount-48} โปรไฟล์</p></div>` : ''}
    </div>
    <a href="https://line.me/ti/p/ksLUWB89Y_" target="_blank" rel="noopener noreferrer" class="sticky-line">
        <i class="fab fa-line" style="font-size:24px"></i>📱 จองคิวทาง LINE
    </a>
    <footer>© ${new Date().getFullYear()} ${DYNAMIC_BRAND}</footer>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow, max-image-preview:large",
                "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
                "x-rendered-by": "location-v3.0"
            }
        });

    } catch (e) {
        console.error("Location Error:", e);
        return context.next();
    }
};
