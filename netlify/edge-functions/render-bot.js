import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
    try {
        const userAgent = request.headers.get('User-Agent') || '';
        const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot/i.test(userAgent);
        
        if (!isBot) return context.next(); 

        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const profileSlug = pathSegments[1]; 
        
        if (!profileSlug) return context.next();

        const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
        const DOMAIN_URL = "https://sidelinechiangmai.netlify.app";

        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: profile } = await supabase.from('profiles').select('*').eq('slug', profileSlug).maybeSingle();
        if (!profile) return context.next();

        const { data: prov } = await supabase.from('provinces').select('nameThai').eq('key', profile.provinceKey).maybeSingle();
        const provinceName = prov?.nameThai || 'เชียงใหม่';
        const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/profile-images/${profile.imagePath}`;
        
        const numericPrice = profile.rate ? profile.rate.toString().replace(/[^0-9]/g, '') : "1500";
        const pageUrl = `${DOMAIN_URL}/sideline/${profile.slug}`;

        const richSchema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Product",
                    "@id": `${pageUrl}#product`,
                    "name": `น้อง ${profile.name} ไซด์ไลน์${provinceName}`,
                    "image": imageUrl,
                    "description": profile.description || `น้อง ${profile.name} รับงาน${provinceName} พิกัด ${profile.location} รูปจริงตรงปก`,
                    "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
                    "offers": {
                        "@type": "Offer",
                        "url": pageUrl,
                        "price": numericPrice,
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "priceValidUntil": "2026-12-31"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": Math.floor(Math.random() * (120 - 80 + 1)) + 80 // สุ่มเลขรีวิวให้ดูธรรมชาติ
                    }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": DOMAIN_URL + "/" },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": DOMAIN_URL + `/location/${profile.provinceKey}` },
                        { "@type": "ListItem", "position": 3, "name": profile.name, "item": pageUrl }
                    ]
                }
            ]
        };

        return new Response(`
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>น้อง ${profile.name} ไซด์ไลน์${provinceName} รูปจริงตรงปก | Sideline Chiangmai</title>
    <meta name="description" content="ดูโปรไฟล์น้อง ${profile.name} รับงานใน${provinceName} อายุ ${profile.age} สัดส่วน ${profile.stats} พิกัด ${profile.location} รูปจริง 100% คัดเกรดพรีเมียม">
    <link rel="canonical" href="${pageUrl}">
    <meta property="og:title" content="น้อง ${profile.name} ไซด์ไลน์${provinceName} - Sideline Chiangmai">
    <meta property="og:description" content="พิกัด ${profile.location} เรทราคา ${profile.rate} บาท การันตีงานดี ตรงปก">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:type" content="website">
    <script type="application/ld+json">${JSON.stringify(richSchema)}</script>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; max-width: 700px; margin: 0 auto; background-color: #f9f9f9;">
    <article style="background: white; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #eee;">
        <header style="padding: 20px; text-align: center;">
            <h1 style="color: #d53f8c; margin: 0; font-size: 1.8rem;">น้อง ${profile.name} (${provinceName})</h1>
            <p style="color: #666; font-size: 0.9rem;">อัปเดตล่าสุด: ${new Date().toLocaleDateString('th-TH')}</p>
        </header>
        <img src="${imageUrl}" alt="น้อง ${profile.name} ไซด์ไลน์${provinceName}" style="width: 100%; display: block;">
        <div style="padding: 25px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <div style="background: #fff5f7; padding: 10px; border-radius: 10px;"><strong>💰 ราคา:</strong> ${profile.rate || '1,500'}</div>
                <div style="background: #fff5f7; padding: 10px; border-radius: 10px;"><strong>📏 สัดส่วน:</strong> ${profile.stats || '-'}</div>
                <div style="background: #fff5f7; padding: 10px; border-radius: 10px;"><strong>📍 พิกัด:</strong> ${profile.location || provinceName}</div>
                <div style="background: #fff5f7; padding: 10px; border-radius: 10px;"><strong>🎂 อายุ:</strong> ${profile.age || '20+'}</div>
            </div>
            <p style="white-space: pre-line; color: #444;">${profile.description || 'สนใจทักสอบถามข้อมูลเพิ่มเติมได้ตลอด 24 ชม. ค่ะ'}</p>
            <a href="https://line.me/ti/p/ksLUWB89Y_" style="display: block; background: #06c755; color: white; text-align: center; padding: 18px; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 25px; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(6,199,85,0.3);">📲 ติดต่อแอดไลน์จองคิว</a>
        </div>
    </article>
</body>
</html>`, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) {
        return context.next(); 
    }
};