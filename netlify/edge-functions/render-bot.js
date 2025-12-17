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
        
        // กรองราคาให้เป็นตัวเลขล้วน ป้องกัน Schema พัง
        const numericPrice = profile.rate ? profile.rate.toString().replace(/[^0-9]/g, '') : "1500";

        const richSchema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Product",
                    "name": `น้อง ${profile.name} ไซด์ไลน์${provinceName}`,
                    "image": imageUrl,
                    "description": profile.description || `น้อง ${profile.name} รับงาน${provinceName} พิกัด ${profile.location}`,
                    "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
                    "offers": {
                        "@type": "Offer",
                        "price": numericPrice,
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "5",
                        "reviewCount": "88"
                    }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": DOMAIN_URL + "/" },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": DOMAIN_URL + `/location/${profile.provinceKey}` },
                        { "@type": "ListItem", "position": 3, "name": profile.name }
                    ]
                }
            ]
        };

        return new Response(`
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>น้อง ${profile.name} ไซด์ไลน์${provinceName} รูปจริงตรงปก - Sideline Chiangmai</title>
    <meta name="description" content="ดูโปรไฟล์น้อง ${profile.name} รับงานใน${provinceName} อายุ ${profile.age} สัดส่วน ${profile.stats} พิกัด ${profile.location} รูปจริง 100% ไม่จกตา">
    <script type="application/ld+json">${JSON.stringify(richSchema)}</script>
</head>
<body style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; line-height: 1.6;">
    <article style="border: 1px solid #eee; border-radius: 15px; overflow: hidden; padding-bottom: 20px;">
        <h1 style="color: #d53f8c; text-align: center;">น้อง ${profile.name} (${provinceName})</h1>
        <img src="${imageUrl}" alt="น้อง ${profile.name} ไซด์ไลน์${provinceName}" style="width: 100%; border-radius: 10px;">
        <div style="padding: 20px; background: #fdf2f8; margin-top: 15px; border-radius: 10px;">
            <p><strong>💰 ราคา:</strong> ${profile.rate || 'สอบถาม'}</p>
            <p><strong>📍 พิกัด:</strong> ${profile.location || provinceName}</p>
            <p><strong>📏 สัดส่วน:</strong> ${profile.stats || '-'} (อายุ ${profile.age || '20+'})</p>
            <p style="margin-top: 15px;">${profile.description || 'ทักมาสอบถามข้อมูลเพิ่มเติมได้เลยค่ะ'}</p>
        </div>
        <a href="https://line.me/ti/p/ksLUWB89Y_" style="display: block; background: #06c755; color: white; text-align: center; padding: 15px; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px;">📲 ติดต่อแอดไลน์จองคิว</a>
        <div style="margin-top: 30px; text-align: center; font-size: 0.9em;">
            <a href="${DOMAIN_URL}/location/${profile.provinceKey}" style="color: #666;">➡️ ดูสาวไซด์ไลน์ในจังหวัด${provinceName} ทั้งหมด</a>
        </div>
    </article>
</body>
</html>`, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) {
        return context.next(); 
    }
};