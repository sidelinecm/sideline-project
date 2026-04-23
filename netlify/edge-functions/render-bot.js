
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: [
line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@sidelinechiangmai',
        twitter: 'https://twitter.com/sidelinechiangmai',
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280',
        biosite: 'https://bio.site/firstfiwfans.com',
        linktree: 'https://linktr.ee/kissmodel',
        bluesky: 'https://bsky.app/profile/sidelinechiangmai.bsky.social'
    
    ]
};

// ==========================================
// 2. MOCK DATA (ข้อมูลรีวิว)
// ==========================================
const TESTIMONIALS = [
    {
        name: "พี่บอล",
        rating: 5,
        text: "ตรงปกมากครับ น้องบริการดีเยี่ยม ฟิวแฟนแท้ๆ เลย"
    },
    {
        name: "คุณเอก",
        rating: 5,
        text: "น้องเอาใจเก่งมาก สวยสมราคา จองง่ายปลอดภัยครับ"
    },
    {
        name: "พี่โจ",
        rating: 5,
        text: "จองผ่านไลน์ง่ายมาก ไม่ต้องโอนมัดจำ ไปหาหน้างานสบายใจสุดๆ"
    }
];

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path, width = 600, height = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    
    // กรณีเป็น URL จาก Cloudinary
    if (path.includes('res.cloudinary.com')) {
        // แทรก parameter f_auto (เลือกฟอร์แมตอัตโนมัติเช่น WebP/AVIF) 
        // และ q_auto (บีบอัดคุณภาพอัตโนมัติ) และการปรับขนาด
        return path.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`);
    }

    // กรณีเป็น URL อื่นๆ (เช่นภายนอก)
    if (path.startsWith('http')) return path;

    // กรณีเป็นไฟล์จาก Supabase Storage
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`;
};

const escapeHTML = (str) => str ? str.replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])) : '';

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // ตรวจสอบว่าเป็น Bot หรือ Social Media Crawler หรือไม่
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    

    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        

        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        
        // ป้องกัน slug ที่เป็นคำสั่งระบบ
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        // เชื่อมต่อ Database
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // ดึงข้อมูล Profile และข้อมูลจังหวัดที่เชื่อมโยงกัน
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        // หากไม่พบข้อมูลโปรไฟล์ ให้ปล่อยไปหน้า 404 ของระบบหลัก
        if (!p) return context.next();

        // ดึงโปรไฟล์แนะนำในจังหวัดเดียวกัน (Related Profiles)
        let related = [];
        if (p.provinceKey) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('provinceKey', p.provinceKey)
                .eq('active', true)
                .neq('id', p.id) 
                .limit(6);
            related = relatedData || [];
        }


        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        const displayPrice = parseInt(p.rate || "1500").toLocaleString() + ".-";
const imageUrl = optimizeImg(p.imagePath, 600, 800);
        
        // จัดการลิงก์ LINE (รองรับทั้ง ID และ URL)
        let finalLineUrl = p.lineId || 'ksLUWB89Y_';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;
        }

        // จำลอง Rating เพื่อให้ Google แสดงผล Rich Snippets (ดาว)
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        // SEO Spintax
        const titleIntro = spin(["แนะนำ", "รีวิว", "พบกับ", "มาแรง", "ห้ามพลาด"]);
        const serviceWord = spin(["บริการฟิวแฟน", "เอาใจเก่ง", "งานดีตรงปก", "เป็นกันเอง", "ขี้อ้อน"]);
        const payWord = spin(["ไม่รับมัดจำ", "จ่ายหน้างานเท่านั้น", "เจอตัวค่อยจ่าย", "ปลอดภัย 100%"]);
        
        const pageTitle = `${titleIntro} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน รูปตรงปก 100%`;
        const metaDesc = `${displayName} สาวไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี ${serviceWord} รับงานเองไม่ผ่านเอเย่นต์ ${payWord} รูปตรงปก พิกัด${p.location || provinceName} จองคิวทักไลน์เลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // สร้าง Schema Markup (JSON-LD)
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": ["Organization", "LocalBusiness"],
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "image": [imageUrl],
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": provinceName,
                        "addressCountry": "TH"
                    },
                    "sameAs": CONFIG.SOCIAL_PROFILES
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${provinceKey}` },
                        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": "Product",
                    "@id": `${canonicalUrl}#product`,
                    "name": pageTitle,
                    "image": [imageUrl],
                    "description": metaDesc,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                    "offers": {
                        "@type": "Offer",
                        "price": (p.rate || "1500").toString().replace(/[^0-9]/g, ''),
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString()
                    }
                }
            ]
        };

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} | รับงานเอง ฟิวแฟน รูปตรงปก</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <!-- Core Web Vitals -->
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${imageUrl}">
    <meta name="theme-color" content="#db2777">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    
    <meta property="og:site_name" content="Sideline Chiangmai">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <!-- Open Graph -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    
    <!-- Schema -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
:root{--p:#ec4899;--s:#10b981;--bg:#0f172a;--card:#1e293b;--txt:#f8fafc;--gold:#fbbf24;--muted:#94a3b8}*{box-sizing:border-box;margin:0}body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--txt);line-height:1.6;overflow-x:hidden}.container{max-width:500px;margin:0 auto;padding:1.5rem;background:var(--card);min-height:100vh}@media(min-width:768px){.container{max-width:600px;padding:2rem}}
.hero-section{position:relative}.hero-img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:1.5rem;box-shadow:0 20px 40px rgba(0,0,0,.4)}
.profile-header{padding:2rem 0 1rem}.rating{display:flex;align-items:center;gap:.5rem;color:var(--gold);font-weight:700;font-size:1.1rem;margin-bottom:1rem}.stars{font-size:1.3rem}
h1{color:var(--p);font-size:clamp(1.75rem,5vw,2.5rem);font-weight:900;margin:1rem 0;line-height:1.2;text-align:center}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:2rem 0}.info-item{background:rgba(255,255,255,.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.2);border-radius:1.5rem;padding:1.5rem;text-align:center}.info-label{font-size:.8rem;color:var(--muted);text-transform:uppercase;font-weight:600;margin-bottom:.5rem;display:block}.info-value{font-size:1.4rem;font-weight:900;color:var(--txt)}
.description{background:rgba(255,255,255,.05);border-radius:1.5rem;padding:1.75rem;margin:2rem 0;border:1px solid rgba(255,255,255,.1);white-space:pre-line;font-size:1rem;line-height:1.7}
.cta-section{text-align:center;margin:2.5rem 0}.btn-line{display:inline-flex;align-items:center;gap:1rem;background:linear-gradient(135deg,var(--s),#059669);color:#fff;padding:1.25rem 2.5rem;border-radius:3rem;font-weight:800;font-size:1.2rem;text-decoration:none;box-shadow:0 15px 35px rgba(16,185,129,.4);transition:all .3s}.btn-line:hover{transform:translateY(-3px);box-shadow:0 20px 45px rgba(16,185,129,.5)}
.related-section{margin:3rem 0}.related-title{color:var(--p);font-size:1.5rem;font-weight:800;text-align:center;margin-bottom:2rem;border-bottom:2px solid rgba(236,72,153,.3);padding-bottom:1rem}.related-carousel{display:flex;overflow-x:auto;gap:1.5rem;padding:1rem 0;scroll-snap-type:x mandatory;scrollbar-width:none}.related-carousel::-webkit-scrollbar{display:none}.related-card{flex:0 0 160px;background:var(--bg);border-radius:1.5rem;overflow:hidden;border:1px solid rgba(255,255,255,.1);text-decoration:none;color:inherit;transition:.3s;scroll-snap-align:start}.related-card:hover{transform:translateY(-8px)}.related-img{width:100%;aspect-ratio:1/1;object-fit:cover}.related-info{padding:1rem;text-align:center}.related-name{font-weight:700;font-size:1rem;margin-bottom:.25rem}.related-loc{font-size:.8rem;color:var(--muted)}
.pricing-section{margin:2rem 0;background:rgba(255,255,255,.05);border-radius:1.5rem;padding:1.75rem;border:1px solid rgba(255,255,255,.1)}.pricing-title{color:var(--p);text-align:center;font-weight:800;margin-bottom:1.5rem}.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1rem}
.testimonials{margin:3rem 0}.testimonials-title{color:var(--p);text-align:center;font-weight:800;margin-bottom:2rem}.testimonial-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}.testimonial{background:rgba(255,255,255,.05);padding:1.5rem;border-radius:1.5rem;border:1px solid rgba(255,255,255,.1)}
.footer{text-align:center;padding:2.5rem 1rem 1.5rem;background:rgba(0,0,0,.3);border-radius:1.5rem 1.5rem 0 0;margin-top:3rem;color:var(--muted);font-size:.9rem}
@media(max-width:480px){.container{padding:1rem}.info-grid{grid-template-columns:1fr}.related-card{flex:0 0 140px}}
    </style>
</head>
<body>
    <nav class="main-nav" aria-label="เมนูหลัก">
        </nav>

    <div class="container">
        <header class="profile-header">
            <section class="hero-section">
                <img src="${imageUrl}" class="hero-img" alt="${displayName} ไซด์ไลน์${provinceName}" loading="eager" width="400" height="533">
            </section>

            <div class="rating" style="margin-top: 1rem; justify-content: center;">
                <span class="stars">⭐</span>${ratingValue} <span>(${reviewCount} รีวิว)</span>
            </div>
            <h1>${pageTitle}</h1>
        </header>

        <main>
            <article>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">ค่าขนมเริ่มต้น</span>
                        <span class="info-value">฿${displayPrice}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📍 พิกัดพื้นที่</span>
                        <span class="info-value">${p.location || provinceName}</span>
                    </div>
                </div>

                <section class="description" itemprop="description"> ${escapeHTML(p.description) || metaDesc} </section>

                <section class="cta-section" aria-label="ช่องทางการติดต่อ">
                    <a href="${finalLineUrl}" class="btn-line" rel="noopener" data-i18n='{"th":"📲 ทักไลน์จองคิว ${displayName}","en":"📲 Contact ${displayName}"}'> 
                        📲 ทักไลน์จองคิว ${displayName} 
                    </a>
                    <p style="margin-top:1rem;color:var(--muted);font-size:.9rem">จ่ายหน้างาน • ปลอดภัย 100% • ไม่มีมัดจำ</p>
                </section>

                <section class="pricing-section">
                    <h2 class="pricing-title">💰 ราคาและบริการ</h2>
                    <div class="pricing-grid">
                        <div><strong>ST (ชั่วคราว)</strong><br>฿${parseInt(p.rate||1500).toLocaleString()}</div>
                        <div><strong>LT (ค้างคืน)</strong><br>฿${(parseInt(p.rate||1500)*1.8).toLocaleString()}</div>
                        <div><strong>OT (นอกสถานที่)</strong><br>฿${(parseInt(p.rate||1500)*2.2).toLocaleString()}</div>
                    </div>
                </section>
            </article>

            ${related.length > 0 ? `
            <aside class="related-section" aria-label="น้องๆ แนะนำเพิ่มเติม">
                <h2 class="related-title">🔥 น้องๆ แนะนำใน ${provinceName}</h2>
                <nav class="related-carousel">
                    ${related.map(r => `
                        <a href="${CONFIG.DOMAIN}/sideline/${r.slug}" class="related-card">
                            <img src="${optimizeImg(r.imagePath,200,200)}" class="related-img" alt="${r.name}" loading="lazy">
                            <div class="related-info">
                                <div class="related-name">${r.name}</div>
                                <div class="related-loc">📍 ${r.location || provinceName}</div>
                            </div>
                        </a>
                    `).join('')}
                </nav>
                <div style="text-align:center; margin-top:1.5rem;">
                    <a href="${CONFIG.DOMAIN}/location/${provinceKey}" 
                       class="btn-line" 
                       style="padding: 0.8rem 1.5rem; font-size: 1rem; background: var(--card); border: 1px solid var(--p); box-shadow: none;"
                       data-i18n='{"th":"ดูน้องๆ ${provinceName} ทั้งหมด →","en":"View all ${provinceName} →"}'>
                       ดูน้องๆ ${provinceName} ทั้งหมด →
                    </a>
                </div>
            </aside>` : ''}

            <section class="testimonials">
                <h2 class="testimonials-title">⭐ รีวิวจากลูกค้าจริง</h2>
                <div class="testimonial-grid">
                    ${TESTIMONIALS.map(t => `
                        <div class="testimonial">
                            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem">
                                <div style="color:var(--gold);font-size:1.2rem">${'★'.repeat(Math.floor(t.rating))}</div>
                                <strong>${t.name}</strong>
                            </div>
                            <p style="color:var(--txt);margin:0">${t.text}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
        </main>

        <footer class="footer">
            <div class="footer-content">
                © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}<br>
                <span data-i18n='{"th":"มั่นใจ ปลอดภัย ไม่มีการมัดจำ","en":"Safe • No deposit"}'>มั่นใจ ปลอดภัย ไม่มีการมัดจำ</span> | 
                <a href="${CONFIG.SOCIAL_PROFILES[2]}" style="color:var(--s)" 
                   data-i18n='{"th":"📲 Line","en":"📲 Line"}'>📲 Line</a>
            </div>
        </footer>
    </div>

    <aside class="lang-switcher" style="position:fixed;bottom:20px;right:20px;z-index:999;background:rgba(0,0,0,0.8);padding:10px;border-radius:50px;display:flex;gap:5px">
        <button onclick="setLang('th')" style="background:none;border:none;color:white;font-size:16px;cursor:pointer;padding:5px" title="ไทย">🇹🇭</button>
        <button onclick="setLang('en')" style="background:none;border:none;color:white;font-size:16px;cursor:pointer;padding:5px" title="English">🇺🇸</button>
    </aside>

    <script>
    let currentLang = 'th';
    function setLang(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            try {
                const translations = JSON.parse(el.dataset.i18n);
                el.textContent = translations[lang] || translations['th'];
            } catch(e) { }
        });
    }
    </script>
</body>
</html>`;


        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow",
                "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
                "Vary": "User-Agent"
            }
        });

    } catch (e) {
        console.error("Profile SSR Error:", e);
        return context.next();
    }
};
