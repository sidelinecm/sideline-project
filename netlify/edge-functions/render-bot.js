import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

const validateSlug = (slug) => {
    if (!slug || slug.length < 3 || slug.length > 100) return false;
    return /^[a-zA-Z0-9\-_]+$/.test(slug);
};

// 🖼️ Ultimate Image Optimizer
const optimizeImg = (path, isOG = false) => {
    if (!path) return `${CONFIG.DOMAIN}/images/placeholder-profile.webp`;
    if (path.includes('res.cloudinary.com')) {
        // บังคับ OG Image ให้เป็นแนวนอน 1200x630 เพื่อให้แชร์ลง LINE แล้วสวยที่สุด
        const transform = isOG ? 'c_fill,w_1200,h_630,g_faces,q_auto:best,f_webp' : 'c_fill,w_600,h_800,g_faces,q_auto:best,f_webp';
        return path.replace('/upload/', `/upload/${transform}/`);
    }
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?format=webp`;
};

const formatLineUrl = (lineId) => {
    if (!lineId) return 'https://line.me/ti/p/ksLUWB89Y_';
    if (lineId.startsWith('http')) return lineId;
    return `https://line.me/ti/p/~${lineId.replace('@', '')}`;
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|crawler|spider|google|facebook|twitter|line|whatsapp|telegram|discord|bing|slurp|yandex/i.test(ua);
    
    if (!isBot) return context.next();

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
    const slug = decodeURIComponent(pathParts[pathParts.length - 1]);

    if (!validateSlug(slug)) return context.next();

    try {
        const supabaseUrl = typeof Netlify !== 'undefined' ? Netlify.env.get('SUPABASE_URL') || CONFIG.SUPABASE_URL : CONFIG.SUPABASE_URL;
        const supabaseKey = typeof Netlify !== 'undefined' ? Netlify.env.get('SUPABASE_KEY') || CONFIG.SUPABASE_KEY : CONFIG.SUPABASE_KEY;

        const supabase = createClient(supabaseUrl, supabaseKey);

        // ⚡ ดึงข้อมูลจากฐานข้อมูลจริงทุกฟิลด์ที่ส่งมา
        const { data: p, error } = await supabase.from('profiles')
            .select('*, provinces(nameThai, key)')
            .eq('slug', slug).eq('active', true).maybeSingle();

        if (error || !p) return context.next();

        // 🎨 Data Processing
        const displayName = (p.name || 'สาวสวย').replace(/^น้อง/, '').trim();
        const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;
        
        const ogImageUrl = optimizeImg(p.imagePath, true); // 1200x630
        const imageUrl = optimizeImg(p.imagePath, false);  // 600x800
        const finalLineUrl = formatLineUrl(p.lineId);
        
        const rawPrice = (p.rate || "1500").toString().replace(/\D/g, '');
        const numericPrice = Math.min(parseInt(rawPrice) || 1500, 30000);
        const isBusy = p.availability && (p.availability.includes('ไม่ว่าง') || p.availability.includes('พัก'));

        // สร้างประโยคอธิบายสเปคแบบ SEO Friendly
        const specDetails =[
            p.age ? `อายุ ${p.age} ปี` : '',
            p.stats ? `สัดส่วน ${p.stats}` : '',
            (p.height && p.weight) ? `สูง ${p.height} หนัก ${p.weight}` : '',
            p.skinTone ? `ผิว${p.skinTone}` : ''
        ].filter(Boolean).join(' | ');
        
        const pageTitle = `น้อง${displayName} รับงานไซด์ไลน์${provinceName} - ฟิวแฟน ตรงปก ไม่มีมัดจำ`;
        const metaDesc = `น้อง${displayName} ${provinceName} รับงานเอง ฟิวแฟน ${specDetails} พิกัดรับงาน: ${p.location || provinceName} การันตีตรงปก 100% ปลอดภัย ไม่มีมัดจำ จ่ายเงินหน้างานเท่านั้น ดูรูปโปรไฟล์เต็ม!`;

        // 🌟 Schema.org Ultimate 2026 (ดึงข้อมูลสเปคจริงมาใส่เป็น Entity)
        const schema = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "ProfilePage",
                    "@id": `${canonicalUrl}#webpage`,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc,
                    "mainEntity": { "@id": `${canonicalUrl}#person` }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement":[
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${provinceKey}` },
                        { "@type": "ListItem", "position": 3, "name": `น้อง${displayName}`, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": ["Person", "LocalBusiness"],
                    "@id": `${canonicalUrl}#person`,
                    "name": `น้อง${displayName} ไซด์ไลน์${provinceName}`,
                    "image": ogImageUrl,
                    "description": metaDesc,
                    "jobTitle": "Freelance Entertainer",
                    "telephone": finalLineUrl,
                    "priceRange": `฿${numericPrice}`,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": p.location || provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": numericPrice.toString(),
                        "priceCurrency": "THB",
                        "availability": isBusy ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                        "url": canonicalUrl,
                        "acceptedPaymentMethod": { "@type": "PaymentMethod", "name": "ชำระเงินหน้างานเท่านั้น (Cash on Delivery)" }
                    },
                    "additionalProperty":[
                        { "@type": "PropertyValue", "name": "อายุ", "value": p.age || "-" },
                        { "@type": "PropertyValue", "name": "สัดส่วน", "value": p.stats || "-" },
                        { "@type": "PropertyValue", "name": "ส่วนสูง", "value": p.height || "-" },
                        { "@type": "PropertyValue", "name": "น้ำหนัก", "value": p.weight || "-" },
                        { "@type": "PropertyValue", "name": "สีผิว", "value": p.skinTone || "-" },
                        { "@type": "PropertyValue", "name": "สไตล์บริการ", "value": p.styleTags ? p.styleTags.join(', ') : "ฟิวแฟน" }
                    ]
                }
            ]
        };

        // 📱 HTML for Bots & Social Crawlers (Premium Glassmorphism Style)
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#0f172a">
    
    <!-- Open Graph (LINE / FB Optimization) -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">
    <meta property="og:site_name" content="Sideline ${provinceName}">
    <meta property="og:locale" content="th_TH">

    <meta name="twitter:card" content="summary_large_image">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">

    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
    
    <style>
        :root { --p: #db2777; --bg: #0f172a; --card: #1e293b; --txt: #f8fafc; --muted: #94a3b8; }
        body { margin: 0; padding: 0; font-family: 'Prompt', sans-serif; background: var(--bg); color: var(--txt); line-height: 1.6; display: flex; justify-content: center; }
        .wrapper { width: 100%; max-width: 500px; background: var(--card); min-height: 100vh; display: flex; flex-direction: column; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
        
        .hero-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; background: #000; }
        
        main { padding: 24px; flex-grow: 1; }
        h1 { font-size: 28px; font-weight: 800; margin: 0 0 16px; background: linear-gradient(135deg, #fff, var(--p)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.3; }
        
        .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .tag { background: rgba(16,185,129,0.15); color: #34d399; font-size: 12px; padding: 4px 12px; border-radius: 50px; font-weight: 700; border: 1px solid rgba(16,185,129,0.3); }
        .tag-hot { background: rgba(219,39,119,0.15); color: #f472b6; border-color: rgba(219,39,119,0.3); }

        /* ข้อมูลสเปค (ดึงจาก Data จริง) */
        .glass-box { background: rgba(30, 30, 30, 0.6); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px; }
        .specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; text-align: center; }
        .spec-item { background: rgba(255,255,255,0.05); padding: 10px; border-radius: 12px; }
        .spec-label { font-size: 10px; color: #aaa; }
        .spec-val { font-size: 16px; font-weight: bold; color: #fff; }
        
        .info-row { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 12px; }
        
        .desc { background: rgba(0,0,0,0.3); padding: 20px; border-radius: 16px; font-size: 14px; color: var(--muted); border: 1px solid rgba(255,255,255,0.05); }
        
        .btn-line { display: flex; align-items: center; justify-content: center; gap: 10px; background: #06C755; color: white; padding: 16px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 18px; margin-top: 32px; box-shadow: 0 10px 20px rgba(6,199,85,0.3); }
        
        footer { text-align: center; padding: 30px; color: #64748b; font-size: 12px; border-top: 1px solid var(--border); }
    </style>
</head>
<body>
    <div class="wrapper">
        <img src="${imageUrl}" class="hero-img" alt="น้อง${displayName} รับงานไซด์ไลน์${provinceName} - ตรงปก ฟิวแฟน">
        
        <main>
            <h1>น้อง${displayName} ไซด์ไลน์${provinceName}<br>รับงานเอง ฟิวแฟน ตรงปก</h1>
            
            <div class="tags">
                <span class="tag">ไม่มีมัดจำ</span>
                <span class="tag">ชำระเงินหน้างาน</span>
                <span class="tag-hot">ตรงปก 100%</span>
                ${p.styleTags ? p.styleTags.slice(0, 3).map(t => `<span class="tag-hot">${t}</span>`).join('') : ''}
            </div>

            <!-- Glassmorphism Spec Box เหมือนหน้าเว็บจริง -->
            <div class="glass-box">
                <div class="specs-grid">
                    <div class="spec-item">
                        <div class="spec-label">อายุ</div>
                        <div class="spec-val">${p.age || '-'}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">สัดส่วน</div>
                        <div class="spec-val">${p.stats || '-'}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">สูง/หนัก</div>
                        <div class="spec-val">${p.height||'-'} / ${p.weight||'-'}</div>
                    </div>
                </div>

                <div class="info-row">
                    <span style="color: #ccc;"><i class="fas fa-map-marker-alt" style="color:#ec4899;"></i> พิกัด</span>
                    <span style="color: #fff; font-weight: 500;">${p.location || provinceName}</span>
                </div>
                <div class="info-row">
                    <span style="color: #ccc;"><i class="fas fa-tag" style="color:#4ade80;"></i> เรทราคา</span>
                    <span style="color: #4ade80; font-weight: bold; font-size: 16px;">฿${numericPrice.toLocaleString()}</span>
                </div>
                <div class="info-row" style="border:none; padding-bottom:0; margin-bottom:0;">
                    <span style="color: #ccc;"><i class="fas fa-circle" style="color:${isBusy ? '#ef4444' : '#10b981'}; font-size:10px;"></i> สถานะ</span>
                    <span style="color: ${isBusy ? '#ef4444' : '#10b981'}; font-weight:bold;">${isBusy ? 'ติดจอง' : 'ว่างพร้อมรับงาน'}</span>
                </div>
            </div>

            <article class="desc">
                <h2 style="font-size: 16px; color: #fff; margin: 0 0 10px 0;"><i class="fas fa-info-circle text-pink-500"></i> รายละเอียดการรับงาน</h2>
                ${(p.description || metaDesc).replace(/\n/g, '<br>')}
                <br><br>
                <strong style="color:#f472b6;">ทำไมต้องเรียกน้อง ${displayName}?</strong><br>
                น้องรับงานเอง ไม่ผ่านเอเย่นต์ ให้บริการระดับ <strong>ฟิวแฟน</strong> การันตี <strong>ตรงปก 100%</strong> ปลอดภัยที่สุดเพราะเรา <strong>ไม่มีมัดจำ ชำระเงินหน้างานเท่านั้น</strong>
            </article>

            <a href="${finalLineUrl}" target="_blank" class="btn-line">
                <i class="fab fa-line" style="font-size: 24px;"></i> ทัก LINE แอดหาน้อง${displayName}
            </a>
        </main>
        
        <footer>
            <p>© ${new Date().getFullYear()} Sideline ${provinceName} - ตรงปก ไม่มัดจำ จ่ายหน้างาน</p>
        </footer>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                'content-type': 'text/html; charset=utf-8',
                'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400' // Edge Cache
            }
        });

    } catch (error) {
        return context.next();
    }
};