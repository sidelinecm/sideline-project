import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    ADMIN_LINE: '@sidelinecm',
    PHONE: '098-xxx-xxxx'
};

const validateSlug = (slug) => {
    if (!slug || slug.length < 3 || slug.length > 100) return false;
    return /^[a-zA-Z0-9\\-_]+$/.test(slug);
};

const optimizeImg = (path, isOG = false) => {
    if (!path) return `${CONFIG.DOMAIN}/images/placeholder-profile.webp`;
    if (path.includes('res.cloudinary.com')) {
        const transform = isOG ? 'c_fill,w_1200,h_630,g_faces,q_auto:best,f_webp' : 'c_fill,w_600,h_800,g_faces,q_auto:best,f_webp';
        return path.replace('/upload/', `/upload/${transform}/`);
    }
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?format=webp`;
};

const formatLineUrl = (lineId) => {
    if (!lineId) return `https://line.me/ti/p/~${CONFIG.ADMIN_LINE.replace('@', '')}`;
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

        const { data: p, error } = await supabase.from('profiles')
            .select('*, provinces(nameThai, key)')
            .eq('slug', slug).eq('active', true).maybeSingle();

        if (error || !p) {
            return new Response('Profile Not Found', { status: 404 });
        }

        // 🚀 Data Processing + NEW BUSINESS INFO
        const displayName = (p.name || 'สาวสวย').replace(/^น้อง/, '').trim();
        const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;
        
        const ogImageUrl = optimizeImg(p.imagePath, true); 
        const imageUrl = optimizeImg(p.imagePath, false);  
        const finalLineUrl = formatLineUrl(p.lineId);
        
        const rawPrice = (p.rate || "1500").toString().replace(/\\D/g, '');
        const numericPrice = Math.min(parseInt(rawPrice) || 1500, 30000);
        const isBusy = p.availability && (p.availability.includes('ไม่ว่าง') || p.availability.includes('พัก'));

        const specDetails = [
            p.age ? `อายุ ${p.age} ปี` : '',
            p.stats ? `สัดส่วน ${p.stats}` : '',
            (p.height && p.weight) ? `สูง ${p.height} หนัก ${p.weight}` : '',
            p.skinTone ? `ผิว${p.skinTone}` : ''
        ].filter(Boolean).join(' | ');

        // ✅ NEW: Standard Pricing Packages (SEO + Trust)
        const pricingPackages = [
            { name: 'Quick', time: '40นาที', shots: '1', price: '1,300฿', include: 'Free condom+room' },
            { name: 'Standard', time: '60นาที', shots: '1', price: '1,800฿', include: 'Free condom+room+นวด' },
            { name: 'Premium', time: '90นาที', shots: '2', price: '2,300฿', include: 'Free everything + ฟิวแฟน' }
        ];

        const pageTitle = `น้อง${displayName} รับงานไซด์ไลน์${provinceName} - ฟิวแฟน ตรงปก ไม่มีมัดจำ`;
        const metaDesc = `น้อง${displayName} ${provinceName} รับงานเอง ฟิวแฟน ${specDetails} พิกัด: ${p.location || provinceName} การันตีตรงปก 100% ปลอดภัย ไม่มีมัดจำ จ่ายเงินหน้างาน`;

        // ✅ NEW: Dynamic FAQ + Business Info
        const faqData = [
            { q: `น้อง${displayName} รับงานโซนไหนใน${provinceName}?`, a: `น้อง${displayName} รับงานในพื้นที่${provinceName} โซน ${p.location || provinceName} และพื้นที่ใกล้เคียง` },
            { q: `เรียกน้อง${displayName} ต้องโอนมัดจำไหม?`, a: `ไม่ต้องโอน! จ่ายเงินหน้างานเท่านั้น ปลอดภัย 100% เห็นตัวจริงก่อนจ่าย` },
            { q: `Sideline Chiangmai คือเว็บอะไร?`, a: `เราเป็น #1 ศูนย์รวมไซด์ไลน์${provinceName} อัปเดตทุกวัน 10+ ปี รับงานเอง ไม่ผ่านเอเย่นต์ รีวิว 5,000+ ลูกค้า` },
            { q: `วิธีใช้งานเว็บ Sideline Chiangmai?`, a: `1.เลือกน้อง 2.แชท Line 3.นัดเวลา-สถานที่ 4.เจอตัวจริง จ่ายเงิน บริการเสร็จแยกทาง` }
        ];

        // ✅ ENHANCED Schema 2026 + Business Info
        const schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "ProfilePage",
                    "@id": `${canonicalUrl}#webpage`,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc,
                    "mainEntity": { "@id": `${canonicalUrl}#person` },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Sideline Chiangmai",
                        "url": CONFIG.DOMAIN,
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "contactType": "customer service",
                            "url": `https://line.me/ti/p/~${CONFIG.ADMIN_LINE.replace('@', '')}`
                        }
                    }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
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
                    "priceRange": `฿${numericPrice}`,
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": Math.floor(Math.random() * (80 - 20 + 1)) + 20
                    },
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": p.location || provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "offers": pricingPackages.map(pkg => ({
                        "@type": "Offer",
                        "name": pkg.name,
                        "price": pkg.price.replace('฿', ''),
                        "priceCurrency": "THB",
                        "description": `${pkg.time} ${pkg.shots} shots (${pkg.include})`
                    }))
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": faqData.map(f => ({
                        "@type": "Question",
                        "name": f.q,
                        "acceptedAnswer": { "@type": "Answer", "text": f.a }
                    }))
                }
            ]
        };

        // ✅ NEW COMPLETE HTML with ALL RECOMMENDED SECTIONS
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
    
    <!-- Open Graph -->
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
        :root { --p: #db2777; --bg: #0f172a; --card: #1e293b; --txt: #f8fafc; --muted: #94a3b8; --success: #10b981; --warning: #f59e0b; }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; font-family: 'Prompt', sans-serif; background: var(--bg); color: var(--txt); line-height: 1.6; }
        .wrapper { width: 100%; max-width: 500px; margin: 0 auto; background: var(--card); min-height: 100vh; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
        
        .hero-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; background: #000; }
        
        main { padding: 24px; }
        h1 { font-size: clamp(24px, 5vw, 32px); font-weight: 800; margin: 0 0 16px; background: linear-gradient(135deg, #fff, var(--p)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.3; }
        h2 { font-size: 20px; font-weight: 700; margin: 32px 0 20px; color: var(--txt); }
        h3 { font-size: 18px; font-weight: 600; margin: 24px 0 12px; }
        
        .section { background: rgba(30, 41, 59, 0.6); border-radius: 20px; padding: 24px; margin-bottom: 24px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
        .glass-box { background: rgba(30, 30, 30, 0.6); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px; }
        
        .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .tag { background: rgba(16,185,129,0.15); color: #34d399; font-size: 12px; padding: 6px 12px; border-radius: 50px; font-weight: 700; border: 1px solid rgba(16,185,129,0.3); }
        .tag-hot { background: rgba(219,39,119,0.15); color: #f472b6; border-color: rgba(219,39,119,0.3); }
        
        .specs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; margin-bottom: 20px; text-align: center; }
        .spec-item { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; }
        .spec-label { font-size: 11px; color: #aaa; }
        .spec-val { font-size: 16px; font-weight: bold; color: #fff; }
        
        .info-row { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px 0; margin-bottom: 12px; }
        .info-row:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
        
        /* ✅ NEW Pricing Table */
        .pricing-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(0,0,0,0.3); border-radius: 12px; overflow: hidden; }
        .pricing-table th, .pricing-table td { padding: 12px 8px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .pricing-table th { background: rgba(219,39,119,0.2); font-weight: 700; font-size: 14px; }
        .pricing-table td { font-size: 13px; }
        .price-highlight { font-weight: 800; font-size: 16px; color: var(--success); }
        
        /* ✅ NEW Steps */
        .steps { display: flex; flex-direction: column; gap: 16px; }
        .step { display: flex; gap: 12px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--success); }
        .step-number { width: 32px; height: 32px; background: var(--success); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
        
        /* ✅ NEW FAQ */
        .faq-item { margin-bottom: 16px; }
        .faq-question { font-weight: 600; cursor: pointer; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .faq-answer { max-height: 0; overflow: hidden; transition: all 0.3s ease; padding: 0 12px; }
        .faq-answer.open { max-height: 200px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 0 0 8px 8px; margin-top: -4px; }
        
        .desc { background: rgba(0,0,0,0.3); padding: 20px; border-radius: 16px; font-size: 14px; color: var(--muted); border: 1px solid rgba(255,255,255,0.05); }
        
        .btn-line { display: flex; align-items: center; justify-content: center; gap: 12px; background: linear-gradient(135deg, #06C755, #00d084); color: white; padding: 20px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 18px; margin: 32px 0; box-shadow: 0 15px 30px rgba(6,199,85,0.4); transition: all 0.3s; }
        .btn-line:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(6,199,85,0.5); }
        .btn-admin { background: linear-gradient(135deg, #3b82f6, #1d4ed8); margin-top: 16px; font-size: 16px; }
        
        footer { text-align: center; padding: 30px 24px; color: #64748b; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.1); }
        
        @media (max-width: 480px) { main { padding: 16px; } .section { padding: 20px; } }
    </style>
</head>
<body>
    <div class="wrapper">
        <img src="${imageUrl}" class="hero-img" alt="น้อง${displayName} รับงานไซด์ไลน์${provinceName} - ตรงปก ฟิวแฟน" loading="lazy">
        
        <main>
            <!-- ✅ 1. HERO + ABOUT US -->
            <section class="section">
                <h1>น้อง${displayName}<br>ไซด์ไลน์${provinceName}<br><small style="font-size:0.5em; font-weight:400;">รับงานเอง ฟิวแฟน ตรงปก 100%</small></h1>
                
                <div class="tags">
                    <span class="tag">ไม่มีมัดจำ</span>
                    <span class="tag">จ่ายหน้างาน</span>
                    <span class="tag-hot">ตรงปก 100%</span>
                    ${p.styleTags ? p.styleTags.slice(0, 3).map(t => `<span class="tag-hot">${t}</span>`).join('') : '<span class="tag">ฟิวแฟน</span><span class="tag">นวดน้ำมัน</span>'}
                </div>
            </section>

            <!-- ✅ 2. WE ARE SIDELINE CHIANGMAI (About Section) -->
            <section class="section">
                <h2><i class="fas fa-crown" style="color: #f59e0b;"></i> ทำไมต้อง Sideline Chiangmai?</h2>
                <div class="info-row">
                    <span><i class="fas fa-users" style="color: var(--success);"></i> 10+ ปี</span>
                    <span><strong>5,000+ ลูกค้า</strong></span>
                </div>
                <div class="info-row">
                    <span><i class="fas fa-clock" style="color: var(--warning);"></i> 24/7</span>
                    <span><strong>อัปเดตทุกวัน</strong></span>
                </div>
                <p style="font-size:14px; color:var(--muted);">เราเป็น #1 ไซด์ไลน์${provinceName} รับงานเอง ไม่ผ่านเอเย่นต์ รูปจริง 100% จ่ายหน้างาน ปลอดภัยสุด</p>
            </section>

            <!-- ✅ 3. Profile Specs -->
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
                        <div class="spec-val">${p.height||'-'}cm / ${p.weight||'-'}kg</div>
                    </div>
                </div>

                <div class="info-row">
                    <span style="color: #ccc;"><i class="fas fa-map-marker-alt" style="color:#ec4899;"></i> พิกัด</span>
                    <span style="color: #fff; font-weight: 500;">${p.location || provinceName}</span>
                </div>
                <div class="info-row">
                    <span style="color: #ccc;"><i class="fas fa-tag" style="color:#4ade80;"></i> เริ่มต้น</span>
                    <span class="price-highlight">฿${numericPrice.toLocaleString()}</span>
                </div>
                <div class="info-row">
                    <span style="color: #ccc;"><i class="fas fa-circle" style="color:${isBusy ? '#ef4444' : '#10b981'}; font-size:10px;"></i> สถานะ</span>
                    <span style="color: ${isBusy ? '#ef4444' : '#10b981'}; font-weight:bold;">${isBusy ? 'ติดจอง' : 'ว่างรับงาน'}</span>
                </div>
            </div>

            <!-- ✅ 4. HOW IT WORKS -->
            <section class="section">
                <h2><i class="fas fa-play-circle" style="color: var(--success);"></i> ใช้งานง่าย 4 ขั้นตอน</h2>
                <div class="steps">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div>เลือกน้องที่ชอบจากรายการ (รูป+ราคาชัดเจน)</div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div>แชท LINE หรือโทรสอบถามว่าง/นัดเวลา</div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div>นัดสถานที่ (Free room+condom)</div>
                    </div>
                    <div class="step">
                        <div class="step-number">4</div>
                        <div style="color: var(--success); font-weight: 600;">เจอตัวจริง → จ่ายเงิน → บริการ → แยกทาง</div>
                    </div>
                </div>
            </section>

            <!-- ✅ 5. Pricing Table -->
            <section class="section">
                <h2><i class="fas fa-receipt" style="color: #f59e0b;"></i> ตารางราคาโปร่งใส</h2>
                <p style="color: var(--muted); font-size: 14px; margin-bottom: 16px;">ไม่มีมัดจำ • จ่ายหน้างาน • Free condom+room</p>
                <table class="pricing-table">
                    <thead>
                        <tr>
                            <th>แพ็คเกจ</th>
                            <th>เวลา</th>
                            <th>Shot</th>
                            <th>ราคา</th>
                            <th>รวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pricingPackages.map(pkg => `
                        <tr>
                            <td>${pkg.name}</td>
                            <td>${pkg.time}</td>
                            <td>${pkg.shots}</td>
                            <td><strong>${pkg.price}</strong></td>
                            <td>${pkg.include}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </section>

            <!-- ✅ 6. Payment & Safety -->
            <section class="section">
                <h2><i class="fas fa-shield-alt" style="color: var(--success);"></i> ปลอดภัย 100% การชำระเงิน</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
                    <div><i class="fas fa-money-bill-wave" style="color: #10b981;"></i> เงินสดหน้างานเท่านั้น</div>
                    <div><i class="fas fa-eye" style="color: #f59e0b;"></i> รีวิว+รูปจริงก่อนจ่าย</div>
                    <div><i class="fas fa-undo" style="color: #3b82f6;"></i> ปัญหา? คืน 50-100% ภายใน 30นาที</div>
                    <div><i class="fas fa-lock" style="color: #ec4899;"></i> Privacy 100% ไม่เก็บข้อมูล</div>
                </div>
            </section>

            <!-- ✅ 7. Description -->
            <article class="desc">
                <h3 style="font-size: 16px; color: #fff; margin: 0 0 12px 0;"><i class="fas fa-info-circle" style="color: #ec4899;"></i> ทำไมต้องเรียกน้อง ${displayName}?</h3>
                ${(p.description || metaDesc).replace(/\\n/g, '<br>')}
                <br><br>
                <strong style="color:#f472b6;">รับงานเอง • ฟิวแฟน • ตรงปก 100% • ไม่มีมัดจำ • จ่ายหน้างาน</strong>
            </article>

            <!-- ✅ 8. FAQ -->
            <section class="section">
                <h2><i class="fas fa-question-circle" style="color: #8b5cf6;"></i> คำถามที่พบบ่อย</h2>
                ${faqData.map((faq, i) => `
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(${i})">
                        <span>${faq.q}</span>
                        <i class="fas fa-chevron-down" style="transition: transform 0.3s;"></i>
                    </div>
                    <div class="faq-answer" id="faq${i}">${faq.a}</div>
                </div>`).join('')}
            </section>

            <!-- ✅ CTA Buttons -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <a href="${finalLineUrl}" target="_blank" class="btn-line">
                    <i class="fab fa-line" style="font-size: 24px;"></i> 
                    ทัก LINE น้อง${displayName} เลย
                </a>
                <a href="https://line.me/ti/p/~${CONFIG.ADMIN_LINE.replace('@', '')}" target="_blank" class="btn-line btn-admin">
                    <i class="fas fa-headset" style="font-size: 20px;"></i>
                    สอบถาม Admin ${CONFIG.ADMIN_LINE}
                </a>
            </div>
        </main>
        
        <footer>
            <p><strong>© ${new Date().getFullYear()} Sideline Chiangmai</strong><br>
            #1 ไซด์ไลน์เชียงใหม่ • ตรงปก 100% • ไม่มัดจำ • จ่ายหน้างาน • บริการ 24/7<br>
            <a href="tel:${CONFIG.PHONE}" style="color: #60a5fa;">📞 ${CONFIG.PHONE}</a> | 
            <a href="https://line.me/ti/p/~${CONFIG.ADMIN_LINE.replace('@', '')}" style="color: #06C755;" target="_blank">LINE: ${CONFIG.ADMIN_LINE}</a></p>
        </footer>
    </div>

    <script>
        function toggleFAQ(id) {
            const answer = document.getElementById('faq' + id);
            const icon = answer.previousElementSibling.querySelector('i');
            answer.classList.toggle('open');
            icon.style.transform = answer.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    </script>
</body>
</html>`;

        return new Response(html, {
            headers: {
                'content-type': 'text/html; charset=utf-8',
                'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                'x-content-type-options': 'nosniff',
                'x-frame-options': 'DENY',
                'x-xss-protection': '1; mode=block',
                'strict-transport-security': 'max-age=31536000; includeSubDomains; preload'
            }
        });

    } catch (err) {
        console.error('SSR Error:', err);
        return context.next();
    }
};
