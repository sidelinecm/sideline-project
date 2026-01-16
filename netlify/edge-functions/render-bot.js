import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const clientIP = request.headers.get('x-nf-client-connection-ip') || ''; 
    
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i.test(ua);
    
    let isDataCenter = false;
    if (clientIP && clientIP !== '127.0.0.1') {
        try {
            const ipCheck = await fetch(`http://ip-api.com/json/${clientIP}?fields=hosting`);
            const ipData = await ipCheck.json();
            isDataCenter = ipData.hosting === true;
        } catch (e) { isDataCenter = false; }
    }

    if (!isBot && !isDataCenter) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const currentFullUrl = url.origin + url.pathname;
        
        let pageTitle = '';
        let metaDesc = '';
        let imageUrl = '';
        let pageContent = '';
        let jsonLd = {};

        // --- CASE: หน้าแรก (Homepage) ---
        if (pathParts.length === 0) {
            pageTitle = 'ไซด์ไลน์เชียงใหม่ - รวมน้องๆ ไซด์ไลน์ รับงานเอง ฟิวแฟน ตรงปก 100%';
            metaDesc = 'ศูนย์รวมสาวสวยไซด์ไลน์เชียงใหม่ รับงานเอง ไม่ผ่านเอเย่นต์ พิกัดตัวเมืองเชียงใหม่และใกล้เคียง คัดน้องๆ งานดี ฟิวแฟน ปลอดภัย ไม่ต้องมัดจำ';
            imageUrl = `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
            
            jsonLd = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Sideline Chiangmai",
                "url": CONFIG.DOMAIN,
                "description": metaDesc,
                "publisher": { "@type": "Organization", "name": "Sideline Chiangmai" }
            };

            pageContent = `
                <div class="content-wrapper">
                    <img src="${imageUrl}" class="hero-img" alt="ไซด์ไลน์เชียงใหม่">
                    <h1>แหล่งรวมไซด์ไลน์เชียงใหม่ รับงานเอง</h1>
                    <p>${metaDesc}</p>
                    <a href="${CONFIG.DOMAIN}/sideline/search" class="btn">🔍 ดูน้องๆ ทั้งหมด</a>
                </div>`;
        } 
        // --- CASE: หน้าโปรไฟล์น้องๆ ---
        else if (pathParts[0] === 'sideline' && pathParts.length >= 2) {
            const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
            if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

            const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const { data: p } = await supabase.from('profiles').select('*, provinces(nameThai, key)').eq('slug', slug).maybeSingle();
            
            if (!p) return context.next();

            const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
            const price = p.rate ? parseInt(p.rate.toString().replace(/[^0-9]/g, '')) : 1500;
            
            pageTitle = `น้อง${p.name} - ไซด์ไลน์${provinceName} รับงานเอง ตรงปก 100%`;
            metaDesc = `น้อง${p.name} สาวสวยไซด์ไลน์${provinceName} อายุ ${p.age || '20+'} ปี รับงานฟิวแฟน พิกัด${p.location || provinceName} ไม่ต้องโอนมัดจำ ปลอดภัยแน่นอน`;
            imageUrl = p.imagePath ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;

            // ข้อมูลดาวและรีวิวแบบสุ่มตามชื่อ (เพื่อให้ Google แสดงดาวในหน้าค้นหา)
            const seed = slug.length;
            const ratingValue = (4.5 + (seed % 5) / 10).toFixed(1);
            const reviewCount = 100 + (seed * 3);

            jsonLd = {
                "@context": "https://schema.org/",
                "@graph": [
                    {
                        "@type": "Product",
                        "name": `น้อง${p.name} ไซด์ไลน์${provinceName}`,
                        "image": imageUrl,
                        "description": metaDesc,
                        "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
                        "offers": {
                            "@type": "Offer",
                            "url": currentFullUrl,
                            "priceCurrency": "THB",
                            "price": price,
                            "availability": "https://schema.org/InStock"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": ratingValue,
                            "reviewCount": reviewCount
                        }
                    }
                ]
            };

            pageContent = `
                <div class="content-wrapper">
                    <img src="${imageUrl}" class="hero-img" alt="น้อง${p.name}">
                    <div class="rating">⭐ ${ratingValue} (${reviewCount} รีวิว)</div>
                    <h1>น้อง${p.name} ไซด์ไลน์${provinceName}</h1>
                    <div class="info-box">
                        <p><strong>💰 ราคา:</strong> ${price.toLocaleString()}.-</p>
                        <p><strong>📍 พิกัด:</strong> ${p.location || provinceName}</p>
                    </div>
                    <a href="https://line.me/ti/p/${p.lineId || ''}" class="btn line-btn">📲 จองคิวน้อง${p.name}</a>
                </div>`;
        } 
        else { return context.next(); }

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${currentFullUrl}">
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${currentFullUrl}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">

    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

    <style>
        html, body { background-color: #ffffff !important; color: #1a1a1a; margin: 0; font-family: 'Sarabun', sans-serif; -webkit-font-smoothing: antialiased; }
        .container { max-width: 500px; margin: 0 auto; background: #ffffff; min-height: 100vh; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
        .hero-img { width: 100%; height: auto; display: block; background: #f0f0f0; }
        .content-wrapper { padding: 24px; text-align: center; }
        h1 { color: #db2777; font-size: 24px; margin: 16px 0; }
        .rating { color: #f59e0b; font-weight: bold; margin-bottom: 10px; }
        .info-box { background: #fff5f8; padding: 16px; border-radius: 12px; margin: 20px 0; text-align: left; border: 1px solid #ffe4ee; }
        .info-box p { margin: 8px 0; font-size: 16px; }
        .btn { display: inline-block; width: 100%; padding: 14px 0; background: #db2777; color: #fff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; transition: 0.3s; }
        .line-btn { background: #06c755; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">${pageContent}</div>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "index, follow" } });

    } catch (e) { return context.next(); }
};