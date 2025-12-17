import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
    const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
    const DOMAIN_URL = "https://sidelinechiangmai.netlify.app";
    const STORAGE_BUCKET = 'profile-images';

    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot/i.test(userAgent);
    
    if (!isBot) return context.next(); 

    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const profileSlug = pathSegments[1];
    
    if (!profileSlug) return context.next();

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: profile } = await supabase.from('profiles').select('*').eq('slug', profileSlug).maybeSingle();
        if (!profile) return context.next();

        const { data: prov } = await supabase.from('provinces').select('nameThai').eq('key', profile.provinceKey).maybeSingle();
        const provinceName = prov?.nameThai || 'เชียงใหม่';
        const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profile.imagePath}`;
        
        // SEO Schema ระดับสูง
        const richSchema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `น้อง ${profile.name} รับงาน${provinceName} ไซด์ไลน์${provinceName}`,
            "image": imageUrl,
            "description": profile.description || `โปรไฟล์น้อง ${profile.name} รับงาน${provinceName} พิกัด ${profile.location} รูปจริงตรงปก การันตีคุณภาพ`,
            "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
            "offers": {
                "@type": "Offer",
                "price": profile.rate?.replace(/[^0-9]/g, '') || "1500",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "url": `${DOMAIN_URL}/sideline/${profile.slug}`
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": Math.floor(Math.random() * 60) + 20
            }
        };

        const html = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>น้อง ${profile.name} ไซด์ไลน์${provinceName} รับงาน${provinceName} รูปจริง 100% - Sideline Chiangmai</title>
    <meta name="description" content="ดูโปรไฟล์น้อง ${profile.name} อายุ ${profile.age} สัดส่วน ${profile.stats} รับงานในพื้นที่ ${provinceName} พิกัด ${profile.location} ${profile.description?.substring(0, 80)}">
    <link rel="canonical" href="${DOMAIN_URL}/sideline/${profile.slug}">
    <meta property="og:image" content="${imageUrl}">
    <script type="application/ld+json">${JSON.stringify(richSchema)}</script>
    <style>
        body { font-family: 'Prompt', sans-serif; background: #fff; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
        .profile-container { border: 1px solid #eee; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .image-box img { width: 100%; height: auto; }
        .details { padding: 30px; }
        h1 { color: #d53f8c; font-size: 1.8rem; margin-top: 0; }
        .price-tag { font-size: 1.6rem; color: #e53e3e; font-weight: bold; margin: 15px 0; }
        .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; background: #fdf2f8; padding: 20px; border-radius: 12px; }
        .footer-links { margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
        .btn-line { display: block; background: #06c755; color: white; text-align: center; padding: 18px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 1.2rem; margin-top: 25px; }
    </style>
</head>
<body>
    <div class="profile-container">
        <div class="image-box">
            <img src="${imageUrl}" alt="น้อง ${profile.name} ไซด์ไลน์${provinceName} รับงาน">
        </div>
        <div class="details">
            <h1>น้อง ${profile.name} (${provinceName})</h1>
            <p class="price-tag">เรทค่าขนม: ${profile.rate || 'สอบถาม'}</p>
            <div class="info-grid">
                <div><strong>📍 พิกัด:</strong> ${profile.location || provinceName}</div>
                <div><strong>📏 สัดส่วน:</strong> ${profile.stats || 'ทักสอบถาม'}</div>
                <div><strong>🎂 อายุ:</strong> ${profile.age || '20+'} ปี</div>
                <div><strong>✅ สถานะ:</strong> รูปจริง ตรงปก</div>
            </div>
            <p style="margin-top: 20px;"><strong>รายละเอียดเพิ่มเติม:</strong> ${profile.description || 'น้องน่ารัก นิสัยดี เป็นกันเอง ไม่เร่งงานค่ะ สนใจทักมาสอบถามพิกัดหรือจองคิวได้เลย'}</p>
            <a href="https://line.me/ti/p/ksLUWB89Y_" class="btn-line">📲 ติดต่อแอดไลน์จองคิว</a>
            
            <div class="footer-links">
                <p>ดูเพิ่มเติม: <a href="${DOMAIN_URL}/location/${profile.provinceKey}">น้องไซด์ไลน์ในจังหวัด${provinceName} ทั้งหมด</a></p>
                <a href="${DOMAIN_URL}/">🏠 กลับหน้าหลัก</a>
            </div>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
            }
        });
    } catch (e) {
        return context.next();
    }
};