import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

const optimizeImg = (path, w=400, h=533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp?w=${w}&h=${h}&q=80`;
    if (path.startsWith('http')) return `${path}?w=${w}&h=${h}&q=80&f=auto`;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?w=${w}&h=${h}&q=80&f=auto`;
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const TESTIMONIALS = [
    {name: 'พี่บอล', text: 'ตรงปกมาก! บริการดีเยี่ยม ฟิวแฟนแท้ๆ', rating: 5},
    {name: 'คุณเอก', text: 'น้องเอาใจเก่งมาก สวยสมราคา', rating: 4.9},
    {name: 'พี่โจ', text: 'จองง่าย ไม่ต้องโอนมัดจำ ปลอดภัย', rating: 5}
];

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const provinceKey = pathParts[pathParts.length - 1] || 'chiangmai';

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const { data: provinceData } = await supabase
            .from('provinces')
            .select('id, nameThai, key')
            .eq('key', provinceKey)
            .maybeSingle();

        if (!provinceData) return context.next();

        const { data: profiles } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, location, rate, isfeatured, lastUpdated')
            .eq('provinceKey', provinceData.key)
            .eq('active', true)
            .order('isfeatured', { ascending: false })
            .order('lastUpdated', { ascending: false })
            .limit(60);

        if (!profiles?.length) return context.next();

        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const CURRENT_YEAR = new Date().getFullYear();
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const firstImage = optimizeImg(profiles[0].imagePath);

        // SEO & Schema (เดิม + ปรับปรุง)
        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} (${CURRENT_YEAR}) หาเด็กสาวสวย ฟิวแฟน ไม่มัดจำ`;
        const description = `รวม ${profiles.length} โปรไฟล์ไซด์ไลน์${provinceName} ล่าสุด โซน ${localZones.slice(0,4).join(', ')} ✓ฟิวแฟน ✓ตรงปก 100% ✓จ่ายหน้างาน`;
        
        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "description": description,
                    "mainEntity": {
                        "@type": "ItemList",
                        "numberOfItems": profiles.length,
                        "itemListElement": profiles.map((p, i) => ({
                            "@type": "ListItem",
                            "position": i + 1,
                            "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`
                        }))
                    }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN},
                        {"@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl}
                    ]
                },
                {
                    "@type": "LocalBusiness",
                    "name": `ศูนย์รวมไซด์ไลน์${provinceName} รับงานเอง`,
                    "image": firstImage,
                    "address": {"@type": "PostalAddress", "addressLocality": provinceName, "addressCountry": "TH"},
                    "priceRange": "฿1200-฿5000"
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {"@type": "Question", "name": `ไซด์ไลน์${provinceName} ต้องโอนมัดจำไหม?`, "acceptedAnswer": {"@type": "Answer", "text": "ไม่ต้องโอน จ่ายเงินสดหน้างานเมื่อเจอน้องตัวจริง"}},
                        {"@type": "Question", "name": `น้องๆ รับงานโซนไหนใน${provinceName}?`, "acceptedAnswer": {"@type": "Answer", "text": `ครอบคลุม ${localZones.join(', ')}`}},
                        {"@type": "Question", "name": "การันตีตรงปกไหม?", "acceptedAnswer": {"@type": "Answer", "text": "การันตี 100% รูปอัปเดตจริง"}}
                    ]
                }
            ]
        };

        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${provinceUrl}">
    
    <!-- Core Web Vitals Optimization -->
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${firstImage}" imagesrcset="${firstImage}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    
    <!-- Schema Markup -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
:root{--p:#ec4899;--bg:#0f172a;--card:#1e293b;--txt:#f8fafc;--muted:#94a3b8;--gold:#fbbf24;--green:#10b981}*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--txt);line-height:1.6;overflow-x:hidden}.container{max-width:1200px;margin:0 auto;padding:1.5rem}@media(min-width:768px){.container{padding:2rem}}
h1{font-size:clamp(1.75rem,5vw,2.5rem);color:var(--p);text-align:center;margin-bottom:1rem;font-weight:900}
.hero-sub{color:var(--muted);text-align:center;font-size:1rem;margin-bottom:2rem}
.trust-badges{display:flex;justify-content:center;flex-wrap:wrap;gap:1rem;margin-bottom:2rem}
.badge{background:rgba(251,191,36,.15);color:var(--gold);padding:.5rem 1rem;border-radius:999px;font-size:.875rem;font-weight:700;border:1px solid rgba(251,191,36,.3)}
.badge-green{background:rgba(16,185,129,.15);color:var(--green);border-color:rgba(16,185,129,.3)}

/* Search & Filter */
.search-filter{position:sticky;top:0;background:var(--bg);backdrop-filter:blur(20px);padding:1rem;z-index:100;border-bottom:1px solid #334155;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
.search-input{padding:.75rem 1rem;border:1px solid #475569;border-radius:.75rem;background:#1e293b;color:var(--txt);flex:1;min-width:250px;font-size:1rem}
.filter-btn{padding:.5rem 1rem;background:var(--card);border:1px solid #475569;border-radius:.5rem;color:var(--txt);cursor:pointer;font-size:.875rem;transition:.2s}
.filter-btn:hover{background:#334155}.filter-btn.active{background:var(--p);border-color:var(--p)}

/* Carousel */
.carousel{display:flex;overflow-x:auto;gap:1rem;padding:1rem 0;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.carousel::-webkit-scrollbar{display:none}.carousel-item{flex:0 0 280px;background:var(--card);border-radius:1.5rem;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3);scroll-snap-align:start}
.carousel-img{width:100%;height:350px;object-fit:cover;display:block}

/* Grid Cards (ปรับปรุงจากเดิม) */
.profiles-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin:2rem 0}
.card{background:var(--card);border-radius:1.5rem;overflow:hidden;border:1px solid #334155;transition:all .3s ease;display:block;color:inherit;text-decoration:none}
.card:hover{transform:translateY(-8px);border-color:var(--p);box-shadow:0 25px 50px -12px rgba(236,72,153,.4)}
.img-box{position:relative;width:100%;aspect-ratio:3/4;overflow:hidden;background:#000}
.img-box img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.card:hover .img-box img{transform:scale(1.08)}
.featured-tag{position:absolute;top:1rem;right:1rem;background:var(--gold);color:#000;padding:.25rem .75rem;border-radius:999px;font-size:.75rem;font-weight:900;text-transform:uppercase;box-shadow:0 4px 12px rgba(0,0,0,.4);z-index:2}
.card-info{padding:1.5rem;flex-grow:1;display:flex;flex-direction:column}
.name{font-weight:800;font-size:1.2rem;margin-bottom:.5rem;color:var(--txt);line-height:1.2}
.loc{font-size:.875rem;color:var(--muted);margin-bottom:.75rem;display:flex;align-items:center;gap:.25rem}
.lsi-tags{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem}
.lsi-tag{font-size:.75rem;color:var(--p);background:rgba(236,72,153,.2);padding:.25rem .5rem;border-radius:.5rem}
.price{color:var(--gold);font-weight:900;font-size:1.5rem;margin-top:auto}

/* Pricing Table */
.pricing-section{margin:3rem 0;background:var(--card);border-radius:2rem;padding:2rem;border:1px solid #334155;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.2)}
.pricing-title{color:var(--p);text-align:center;font-size:1.5rem;font-weight:800;margin-bottom:1.5rem}
.table-wrapper{overflow-x:auto}
.pricing-table{width:100%;border-collapse:collapse;background:var(--bg);border-radius:1rem}
.pricing-table th{background:var(--p);color:#fff;padding:1rem .75rem;font-weight:700;text-align:left}
.pricing-table td{padding:1rem .75rem;border-bottom:1px solid #475569}
.pricing-table tr:hover{background:#1e293b}

/* Testimonials */
.testimonials{margin:3rem 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem}
.testimonial{background:var(--card);padding:1.75rem;border-radius:1.5rem;border:1px solid #334155}
.testimonial-header{display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem}
.stars{color:var(--gold);font-size:1.25rem}
.testimonial-name{font-weight:700;color:var(--txt)}
.testimonial-text{color:var(--muted);line-height:1.7}

/* SEO Section (เดิม) */
.seo-section{margin-top:4rem;padding:2.5rem;background:rgba(30,41,59,.7);border-radius:2rem;border:1px solid #475569}
.seo-section h2{color:var(--txt);font-size:1.5rem;margin:0 0 1.5rem;font-weight:800}
.seo-section h3{color:var(--p);font-size:1.25rem;margin:2rem 0 1rem;font-weight:700}
.seo-section p{color:var(--muted);font-size:.95rem;margin-bottom:1rem;line-height:1.7}
.faq-item{margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid rgba(255,255,255,.08)}
.faq-item:last-child{border-bottom:none}
.faq-q{font-weight:700;color:var(--txt);margin-bottom:.5rem;cursor:pointer}
.faq-a{color:var(--muted);font-size:.9rem}

/* Footer */
footer{text-align:center;margin-top:4rem;padding:2.5rem 1.5rem;background:var(--card);color:var(--muted);font-size:.875rem;border-top:1px solid #334155;border-radius:1.5rem 1.5rem 0 0}
.line-cta{color:var(--green);font-weight:700;text-decoration:none;font-size:1.1rem}
@media(max-width:768px){.container{padding:1rem}.search-filter{padding:.75rem}.profiles-grid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}}
    </style>
</head>
<body>
    <!-- Header (ปรับปรุง) -->
    <header>
        <div class="container">
            <h1>🔥 ไซด์ไลน์${provinceName} ตัวท็อป</h1>
            <p class="hero-sub">รวม ${profiles.length} โปรไฟล์รับงานเอง อัปเดต ${CURRENT_YEAR} • ${localZones.slice(0,4).join(' | ')}</p>
            <div class="trust-badges">
                <span class="badge">🚫 ไม่มีมัดจำ</span>
                <span class="badge badge-green">✅ ตรงปก 100%</span>
                <span class="badge">⚡ จ่ายหน้างาน</span>
            </div>
        </div>
    </header>

    <main class="container">
        <!-- Carousel ย่านต่างๆ -->
        <section class="carousel-section">
            <h2 style="text-align:center;margin-bottom:1.5rem;color:var(--p);font-weight:800">📍 พื้นที่ให้บริการยอดนิยม</h2>
            <div class="carousel">
                ${localZones.slice(0,6).map(zone => `
                    <div class="carousel-item">
                        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=350&q=80&fit=crop&auto=format" alt="${zone}" loading="lazy">
                        <div style="padding:1rem;text-align:center">
                            <strong style="color:var(--txt);font-size:1.1rem">${zone}</strong>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Search & Filter -->
        <section class="search-filter">
            <input type="text" class="search-input" id="searchInput" placeholder="🔍 ค้นหาชื่อหรือย่าน...">
            ${localZones.slice(0,8).map(zone => `<button class="filter-btn" data-zone="${zone}">${zone}</button>`).join('')}
            <button class="filter-btn active" data-zone="all">ทั้งหมด</button>
        </section>

        <!-- Pricing Table (ใหม่) -->
        <section class="pricing-section">
            <h3 class="pricing-title">💰 ตารางราคาเริ่มต้นแต่ละโซน</h3>
            <div class="table-wrapper">
                <table class="pricing-table">
                    <thead>
                        <tr><th>โซน</th><th>ราคาเริ่มต้น</th><th>บริการ</th><th>🔥</th></tr>
                    </thead>
                    <tbody>
                        ${PRICING.map(p => `
                            <tr>
                                <td><strong>${p.zone}</strong></td>
                                <td>฿${p.price}</td>
                                <td>${p.service}</td>
                                <td>${p.featured ? '⭐' : ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Profiles Grid (เดิม + ปรับปรุง) -->
        <section class="profiles-section">
            <div class="profiles-grid" id="profilesGrid" role="list">
                ${profiles.map((p, index) => {
                    const price = parseInt((p.rate || "1500").match(/\d+/)?.[0] || 1500);
                    const altText = `รูปโปรไฟล์ ${p.name} ไซด์ไลน์${provinceName} ${p.location || provinceName}`;
                    const lsi1 = spinKeyword();
                    return `
                    <article class="card" role="listitem" data-zone="${p.location || provinceName}" data-name="${p.name}">
                        <a href="${CONFIG.DOMAIN}/sideline/${p.slug}" aria-label="ดูโปรไฟล์ ${p.name} ${provinceName}">
                            <div class="img-box">
                                <img src="${optimizeImg(p.imagePath)}" alt="${altText}" 
                                    loading="${index < 3 ? 'eager' : 'lazy'}" width="400" height="533">
                                ${p.isfeatured ? '<span class="featured-tag">RECOMMENDED</span>' : ''}
                            </div>
                            <div class="card-info">
                                <h2 class="name">${p.name} ${p.isfeatured ? '⭐' : ''}</h2>
                                <div class="loc">📍 ${p.location || provinceName}</div>
                                <div class="lsi-tags">
                                    <span class="lsi-tag">${lsi1}</span>
                                    <span class="lsi-tag">รับงานเอง</span>
                                </div>
                                <span class="price">฿${price.toLocaleString()} ${index < 5 ? '+' : ''}</span>
                            </div>
                        </a>
                    </article>`;
                }).join('')}
            </div>
        </section>

        <!-- Testimonials (ใหม่) -->
        <section class="testimonials-section">
            <h2 style="text-align:center;margin-bottom:2rem;color:var(--p);font-weight:800">⭐ รีวิวจากลูกค้าจริง</h2>
            <div class="testimonials">
                ${TESTIMONIALS.map(t => `
                    <div class="testimonial">
                        <div class="testimonial-header">
                            <div class="stars">${'★'.repeat(Math.floor(t.rating))}${t.rating % 1 ? '☆' : ''}</div>
                            <span class="testimonial-name">${t.name}</span>
                        </div>
                        <p class="testimonial-text">${t.text}</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- SEO Content & FAQ (เดิม) -->
        <section class="seo-section">
            <h2>เว็บไซต์รวมไซด์ไลน์${provinceName} อันดับ 1</h2>
            <p><strong>ไซด์ไลน์${provinceName}</strong> รับงานเองไม่ผ่านเอเย่นต์ ปลอดภัย 100% จ่ายเงินหน้างาน รูปตรงปก การันตีคุณภาพ</p>
            
            <h3>❓ คำถามที่พบบ่อย</h3>
            <div class="faq-item">
                <div class="faq-q">ต้องโอนมัดจำไหม?</div>
                <div class="faq-a">ไม่ต้องโอนมัดจำ จ่ายเงินสดหน้างานเมื่อเจอน้องตัวจริงเท่านั้น</div>
            </div>
            <div class="faq-item">
                <div class="faq-q">น้องๆ รับงานโซนไหนบ้าง?</div>
                <div class="faq-a">ครอบคลุมทุกโซน ${localZones.slice(0,5).join(', ')} และพื้นที่ใกล้เคียง</div>
            </div>
            <div class="faq-item">
                <div class="faq-q">การันตีตรงปกไหม?</div>
                <div class="faq-a">การันตี 100% หากไม่ตรงปก ยกเลิกได้ทันที ไม่มีค่าใช้จ่าย</div>
            </div>
        </section>
    </main>

    <!-- Footer (ปรับปรุง) -->
    <footer>
        <div class="container">
            © ${CURRENT_YEAR} ${CONFIG.BRAND_NAME} | ปลอดภัย ตรงปก จ่ายหน้างาน
            <br><a href="${CONFIG.SOCIAL_PROFILES[0]}" class="line-cta">📲 ติดต่อ Line จองคิว</a>
        </div>
    </footer>

    <!-- Client-side Search/Filter -->
    <script>
        (function(){
            const searchInput = document.getElementById('searchInput');
            const filterBtns = document.querySelectorAll('.filter-btn');
            const cards = document.querySelectorAll('.card');
            let currentZone = 'all';

            function filterCards(query = '') {
                cards.forEach(card => {
                    const name = card.dataset.name?.toLowerCase() || '';
                    const zone = card.dataset.zone?.toLowerCase() || '';
                    const matchesQuery = !query || name.includes(query) || zone.includes(query);
                    const matchesZone = currentZone === 'all' || zone.includes(currentZone.toLowerCase());
                    card.style.display = matchesQuery && matchesZone ? 'block' : 'none';
                });
            }

            searchInput.addEventListener('input', e => filterCards(e.target.value.toLowerCase().trim()));
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentZone = btn.dataset.zone;
                    filterCards(searchInput.value.toLowerCase().trim());
                });
            });
        })();
    </script>
<!-- Language Toggle -->
<div style="position:fixed;bottom:20px;right:20px;z-index:999;background:rgba(0,0,0,0.8);padding:10px;border-radius:50px">
    <button onclick="setLang('th')" style="background:none;border:none;color:white;font-size:16px;margin:0 5px;cursor:pointer">🇹🇭</button>
    <button onclick="setLang('en')" style="background:none;border:none;color:white;font-size:16px;margin:0 5px;cursor:pointer">🇺🇸</button>
</div>
<script>
let currentLang = 'th';
function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        try {
            const translations = el.dataset.i18n ? JSON.parse(el.dataset.i18n) : {};
            el.textContent = translations[lang] || el.dataset.th || el.innerHTML;
        } catch(e) {
            // fallback
        }
    });
}
</script>


</body></html>`;

        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow",
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
                "Vary": "User-Agent"
            }
        });

    } catch (e) {
        console.error("Location SSR Error:", e);
        return context.next();
    }
};
