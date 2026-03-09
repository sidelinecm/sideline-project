import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    LOGO_URL: 'https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp',
    DEFAULT_IMAGE: 'https://sidelinechiangmai.netlify.app/images/sidelinechiangmai-social-preview.webp'
};

// 🔧 Utility Functions
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const validateProvinceKey = (key) => {
    if (!key || key.length < 3 || key.length > 20) return false;
    return /^[a-z0-9\-]+$/.test(key.toLowerCase());
};

const optimizeImg = (path, width = 600) => {
    if (!path) return CONFIG.DEFAULT_IMAGE;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/c_scale,w_${width},q_auto,f_auto/`);
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai':['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'ดอยสุเทพ'],
        'khon-kaen':['มข.', 'กังสดาล', 'ริมบึงแก่นนคร', 'หลังมอ', 'เซ็นทรัลขอนแก่น', 'ท่าพระ', 'บ้านฝาง'],
        'phuket':['ป่าตอง', 'กะตะ', 'กะรน', 'ตัวเมืองภูเก็ต', 'ฉลอง', 'ราไวย์', 'กมลา', 'สุรินทร์'],
        'udonthani':['ยูดีทาวน์', 'เซ็นทรัลอุดร', 'หนองประจักษ์', 'โพศรี', 'กุดจับ'],
        'chiangrai':['บ้านดู่', 'หอนาฬิกา', 'ริมกก', 'มฟล.', 'นาหมื่น']
    };
    return zones[provinceKey.toLowerCase()] ||['ย่านใจกลางเมือง', 'พื้นที่ใกล้เคียง', 'โซนพรีเมียม'];
};

const fetchWithTimeout = (promise, ms = 8000) => {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request Timeout')), ms);
    });
    return Promise.race([promise, timeout]);
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|crawler|spider|google|facebook|twitter|line|whatsapp|telegram|discord|bing|slurp|yandex/i.test(ua);
    
    if (!isBot) return context.next();

const url = new URL(request.url); // <--- ต้องเพิ่มบรรทัดนี้ครับ!
const pathParts = url.pathname.split('/').filter(Boolean);
const provinceKey = pathParts[0] === 'location' ? pathParts[1] : (pathParts[pathParts.length - 1] || 'chiangmai');

    if (!validateProvinceKey(provinceKey)) return context.next();

    try {
        // 📦 Cache Check
        const cache = await caches.open('province-v2');
        const cacheKey = `province:${provinceKey}`;
        let cached = await cache.match(cacheKey);
        
        if (cached) {
            return new Response(cached, {
                headers: {
                    'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400',
                    'x-cache': 'HIT',
                    'x-rendered-by': 'province-renderer-v2'
                }
            });
        }

        // 🚀 Initialize Supabase (ใช้ค่าจาก CONFIG ตรงๆ ตามแบบที่เคยผ่าน)
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // ⚡ Parallel Queries (พร้อม Timeout 8 วินาที เพื่อเช็คปัญหา Database)
        const [provinceRes, profilesRes] = await Promise.allSettled([
            fetchWithTimeout(
                supabase.from('provinces').select('nameThai, key').eq('key', provinceKey).maybeSingle()
            ).then(({ data, error }) => ({ data, error })),
            
            fetchWithTimeout(
                supabase.from('profiles')
                .select('slug, name, imagePath, location, rate, isfeatured, availability, provinceKey, lastUpdated')
                .eq('provinceKey', provinceKey)
                .eq('active', true)
                .order('isfeatured', { ascending: false })
                .order('lastUpdated', { ascending: false, nullsFirst: true })
                .limit(24)
            ).then(({ data, error }) => ({ data: data || [], error }))
        ]);

        // 🔍 ดึงค่า Error และ Data ออกมาตรวจสอบ
        const provinceError = provinceRes.status === 'fulfilled' ? provinceRes.value.error : (provinceRes.reason?.message || 'Timeout');
        const profilesError = profilesRes.status === 'fulfilled' ? profilesRes.value.error : (profilesRes.reason?.message || 'Timeout');

        const provinceData = provinceRes.status === 'fulfilled' ? provinceRes.value.data : null;
        const profiles = profilesRes.status === 'fulfilled' ? profilesRes.value.data :[];

        // 🚨 โหมด DEBUG: ถ้าดึงข้อมูลไม่ได้ ให้พ่นข้อความ Error โชว์ออกไปให้ Googlebot อ่าน
        if (!provinceData || profiles.length === 0) {
            const debugLog = `====== DEBUG INFO ======
Province Key  : ${provinceKey}
Has Province? : ${!!provinceData}
Province Error: ${JSON.stringify(provinceError)}
Profiles Count: ${profiles.length}
Profiles Error: ${JSON.stringify(profilesError)}
========================`;
            
            console.error('[DEBUG DATA MISSING]', debugLog);
            
            return new Response(debugLog, {
                status: 200, // ส่งสถานะ 200 เพื่อให้ Googlebot ยอมอ่านข้อความ Debug
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
        }

        // 🎨 Generate Metadata (ทำงานปกติถ้าข้อมูลมีครบ)
        const provinceName = provinceData.nameThai;
        const profileCount = profiles.length;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);
        const currentYearTH = new Date().getFullYear() + 543;
        const DYNAMIC_BRAND = `Sideline ${provinceName}`;
        const canonicalUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const ogImage = optimizeImg(profiles[0]?.imagePath, 1200);

        // 💰 Price Analysis
        const prices = profiles.map(p => {
            const raw = (p.rate || "1500").toString().replace(/\D/g, '');
            const val = parseInt(raw) || 1500;
            return (val > 25000 || val < 500) ? 1500 : val;
        });
        const minPrice = prices.length > 0 ? Math.min(...prices) : 1500;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 3500;
        const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

        const pageTitle = `ไซด์ไลน์${provinceName} ${profileCount} คน โซน${randomZone} งานดีตรงปก (${currentYearTH})`;
        const metaDesc = `รวมไซด์ไลน์${provinceName} ${profileCount} คน อัปเดต${currentYearTH} โซน ${localZones.slice(0, 5).join(', ')} ราคา ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}฿ รับงานเอง รูปตรงปก จ่ายหน้างาน`;

        // ❓ Dynamic FAQ
        const faqData =[
            { 
                q: `ไซด์ไลน์${provinceName} ต้องโอนมัดจำก่อนไหม?`, 
                a: `ไม่ต้องโอนมัดจำทุกโซนใน${provinceName} จ่ายเงินเมื่อเจอน้องๆ เท่านั้น ปลอดภัย 100%` 
            },
            { 
                q: `มีน้องๆ ไซด์ไลน์${provinceName} โซนไหนบ้าง?`, 
                a: `ครอบคลุมทุกโซนยอดนิยม ${localZones.slice(0, 6).join(', ')} และพื้นที่ใกล้เคียง อัปเดตทุกวัน` 
            },
            { 
                q: `ราคาไซด์ไลน์${provinceName} เท่าไหร่?`, 
                a: `ราคาเริ่มต้น ${minPrice.toLocaleString()}฿ สูงสุด ${maxPrice.toLocaleString()}฿ เฉลี่ย ${avgPrice.toLocaleString()}฿/เคส` 
            }
        ];

        // 🌟 Schema.org 2026 (ปลอดภัยจาก Google Penalty ปรับลบเรตติ้งปลอมออก)
        const schema = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "CollectionPage",
                    "@id": `${canonicalUrl}#page`,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc,
                    "inLanguage": "th-TH",
                    "mainEntity": { "@id": `${canonicalUrl}#collection` }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement":[
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": provinceName, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": faqData.map(f => ({
                        "@type": "Question",
                        "name": f.q,
                        "acceptedAnswer": { "@type": "Answer", "text": f.a }
                    }))
                },
                {
                    "@type": "LocalBusiness",
                    "@id": `${canonicalUrl}#business`,
                    "name": `Sideline ${provinceName}`,
                    "alternateName": `ไซด์ไลน์${provinceName}`,
                    "url": canonicalUrl,
                    "image": [ogImage],
                    "telephone": "LINE",
                    "priceRange": `฿${Math.floor(minPrice/1000)}K - ฿${Math.floor(maxPrice/1000)}K`,
                    "address": {
                        "@type": "PostalAddress",
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "geo": { "@type": "GeoCoordinates", "addressCountry": "TH" },
                    "offers": {
                        "@type": "AggregateOffer",
                        "lowPrice": minPrice,
                        "highPrice": maxPrice,
                        "priceCurrency": "THB",
                        "offerCount": profileCount.toString(),
                        "availability": "https://schema.org/InStock"
                    },
                    "provider": {
                        "@type": "Organization",
                        "name": DYNAMIC_BRAND,
                        "url": canonicalUrl
                    }
                },
                {
                    "@type": "ItemList",
                    "@id": `${canonicalUrl}#collection`,
                    "numberOfItems": profileCount,
                    "itemListElement": profiles.slice(0, 20).map((p, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "item": {
                            "@type": "LocalBusiness",
                            "name": p.name,
                            "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                            "image": optimizeImg(p.imagePath)
                        }
                    }))
                }
            ]
        };

        // 📱 Production HTML Template
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- SEO Enhanced -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="theme-color" content="#db2777">
    
    <!-- Open Graph (Complete) -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:alt" content="ไซด์ไลน์${provinceName} ${profileCount} คน">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${DYNAMIC_BRAND}">
    <meta property="og:locale" content="th_TH">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${ogImage}">

    <!-- Preload Critical Resources -->
    <link rel="preload" href="${ogImage}" as="image" fetchpriority="high">
    <link rel="preload" href="${CONFIG.LOGO_URL}" as="image">
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    
    <!-- Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">

    <!-- Schema -->
    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
    
    <style>
        /* 🎨 Production CSS */
        :root {
            --primary: #db2777; --primary-dark: #be185d;
            --success: #06c755; --bg: #0f172a; --card: #1e293b;
            --card-hover: #334155; --txt: #f8fafc; --txt-muted: #cbd5e1;
            --border: rgba(255,255,255,0.08); --gold: #fbbf24;
        }

        *, *::before, *::after { box-sizing: border-box; }
        * { margin: 0; padding: 0; }
        
        body {
            font-family: 'Prompt', -apple-system, sans-serif;
            background: var(--bg); color: var(--txt); line-height: 1.6;
            overflow-x: hidden; contain: layout style;
        }

        .container {
            max-width: 1200px; margin: 0 auto; padding: clamp(20px, 5vw, 40px);
        }

        .hero {
            text-align: center; padding: clamp(40px, 10vw, 80px) 0;
            background: linear-gradient(135deg, rgba(219,39,119,0.1), rgba(15,23,42,0.8));
            border-radius: 24px; margin-bottom: 48px; backdrop-filter: blur(20px);
        }
        
        h1 {
            font-size: clamp(28px, 8vw, 48px); font-weight: 900;
            background: linear-gradient(135deg, var(--txt), var(--primary), var(--gold));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text; line-height: 1.2; margin-bottom: 20px;
        }

        .stats {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 24px; margin: 32px 0; justify-items: center;
        }
        .stat {
            text-align: center; background: rgba(255,255,255,0.05);
            padding: 20px 16px; border-radius: 20px; border: 1px solid var(--border);
            backdrop-filter: blur(10px);
        }
        .stat-value { font-size: clamp(24px, 6vw, 36px); font-weight: 900; }
        .stat-label { font-size: 14px; color: var(--txt-muted); margin-top: 4px; }

        .grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: clamp(20px, 4vw, 28px); margin-top: 40px;
        }

        .card {
            background: var(--card); border-radius: 24px; padding: 24px;
            text-decoration: none; color: inherit; border: 1px solid var(--border);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative; overflow: hidden; contain: layout style;
        }
        .card::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0;
            height: 4px; background: linear-gradient(90deg, var(--primary), var(--gold));
        }
        .card:hover {
            border-color: var(--primary); transform: translateY(-8px);
            box-shadow: 0 32px 64px rgba(0,0,0,0.4); background: var(--card-hover);
        }

        .card-image {
            width: 100%; aspect-ratio: 3/4; object-fit: cover;
            border-radius: 16px; margin-bottom: 16px; loading: lazy;
        }

        .card-title { font-size: clamp(18px, 4vw, 22px); font-weight: 800; margin-bottom: 8px; }
        .price { 
            color: var(--gold); font-size: clamp(20px, 5vw, 28px); 
            font-weight: 900; margin: 12px 0; 
        }
        .location { color: var(--txt-muted); font-size: 14px; }

        .faq-section {
            margin-top: 80px; padding: 48px; background: rgba(255,255,255,0.02);
            border-radius: 24px; border: 1px solid var(--border);
            backdrop-filter: blur(20px);
        }
        .faq-item {
            margin-bottom: 32px; padding: 24px; background: rgba(255,255,255,0.03);
            border-radius: 16px; border-left: 4px solid var(--primary);
            transition: all 0.3s ease;
        }
        .faq-item:hover { background: rgba(255,255,255,0.05); transform: translateX(8px); }
        .faq-question {
            font-weight: 800; color: var(--primary); font-size: 18px; margin-bottom: 12px;
        }
        .faq-answer { color: var(--txt-muted); line-height: 1.7; }

        footer {
            text-align: center; padding: 60px 24px 40px; color: #64748b;
            font-size: 13px; border-top: 1px solid var(--border); margin-top: 80px;
        }

        @media (max-width: 768px) { .container { padding: 20px 16px; } }
        .sr-only { position: absolute; width: 1px; height: 1px; clip: rect(0,0,0,0); }
        
        @media (prefers-reduced-motion: reduce) {
            * { transition-duration: 0.01ms !important; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Hero -->
        <section class="hero" role="banner">
            <h1>🔥 ไซด์ไลน์${provinceName}<br>น้องสวยรับงานเอง</h1>
            <p style="font-size: clamp(16px, 4vw, 20px); max-width: 600px; margin: 0 auto; color: var(--txt-muted);">
                รวม ${profileCount} คน โซน ${localZones.slice(0, 6).join(', ')} 
                ราคา ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}฿ 
                รูปตรงปก จ่ายหน้างาน
            </p>
            
            <div class="stats" aria-label="สถิติ">
                <div class="stat">
                    <div class="stat-value">${profileCount}</div>
                    <div class="stat-label">น้องๆ ออนไลน์</div>
                </div>
                <div class="stat">
                    <div class="stat-value">฿${minPrice.toLocaleString()}</div>
                    <div class="stat-label">ราคาต่ำสุด</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${localZones.length}+</div>
                    <div class="stat-label">โซนครอบคลุม</div>
                </div>
            </div>
        </section>

        <!-- Profiles Grid -->
        <section aria-labelledby="profiles-title">
            <h2 id="profiles-title" style="font-size: clamp(24px, 6vw, 32px); font-weight: 900; color: var(--txt); margin-bottom: 32px;">
                👩‍❤️‍💋‍👨 น้องๆ แนะนำ ${provinceName}
            </h2>
            <div class="grid">
                ${profiles.slice(0, 18).map(p => {
                    const rawPrice = (p.rate || "1500").toString().replace(/\D/g, '');
                    const numericPrice = Math.min(parseInt(rawPrice) || 1500, 25000);
                    return `
                    <a href="/sideline/${p.slug}" class="card" aria-label="ดูโปรไฟล์น้อง ${p.name}">
                        <img src="${optimizeImg(p.imagePath, 400)}" 
                             alt="น้อง${p.name} ไซด์ไลน์${provinceName}" 
                             class="card-image" width="300" height="400">
                        <h3 class="card-title">${p.name}</h3>
                        <div class="price">฿${numericPrice.toLocaleString('th-TH')}</div>
                        <div class="location">${p.location || spin(localZones)}</div>
                    </a>`;
                }).join('')}
            </div>
        </section>

        <!-- FAQ -->
        <section class="faq-section" aria-labelledby="faq-title">
            <h2 id="faq-title" style="font-size: clamp(24px, 6vw, 32px); font-weight: 900; color: var(--txt); margin-bottom: 32px; text-align: center;">
                ❓ คำถามที่พบบ่อย
            </h2>
            ${faqData.map(f => `
                <article class="faq-item">
                    <h3 class="faq-question">Q: ${f.q}</h3>
                    <div class="faq-answer">A: ${f.a}</div>
                </article>
            `).join('')}
        </section>
    </div>

    <!-- Footer -->
    <footer role="contentinfo">
        <p>© ${currentYearTH} <strong>${DYNAMIC_BRAND}</strong> - แพลตฟอร์มคุณภาพ ตรงปก จ่ายหน้างาน</p>
        <p style="opacity:0.7; margin-top:8px;">
            Disclaimer: จัดทำเพื่อการโฆษณา ไม่เกี่ยวข้องกิจกรรมผิดกฎหมาย
        </p>
        <p style="opacity:0.5; margin-top:4px; font-size:12px;">
            อัปเดตล่าสุด: ${new Date().toLocaleDateString('th-TH', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            })}
        </p>
    </footer>
</body>
</html>`;

        // 💾 Cache & Return
        const response = new Response(html, {
            headers: {
                'content-type': 'text/html; charset=utf-8',
                'x-robots-tag': 'index, follow, max-image-preview:large, max-snippet:-1',
                'cache-control': 'public, s-maxage=7200, stale-while-revalidate=86400',
                'x-cache': 'MISS',
                'x-rendered-by': 'province-renderer-v2',
                'x-profiles': profileCount.toString(),
                'vary': 'User-Agent'
            }
        });

        await cache.put(cacheKey, response.clone());
        return response;


    } catch (error) {
        console.error('[Province Renderer] Error:', {
            provinceKey,
            error: error.message,
            timestamp: new Date().toISOString()
        });

        return new Response('Database Connection Timeout', {
            status: 503, // เปลี่ยนจาก 404 เป็น 503
            headers: {
                'cache-control': 'no-cache',
                'x-error': 'province-render-failed',
                'retry-after': '300' // บอก Google ให้กลับมาใหม่ใน 5 นาที
            }
        });
    }
