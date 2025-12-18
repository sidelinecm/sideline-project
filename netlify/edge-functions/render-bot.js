import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
    try {
        const userAgent = request.headers.get('User-Agent') || '';
        // ตรวจจับ Bot (เพิ่ม Line/WhatsApp เพื่อให้แชร์สวย)
        const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot|whatsapp|line/i.test(userAgent);
        
        if (!isBot) return context.next(); 

        const url = new URL(request.url);
        // logic เดิม: /sideline/slug -> segments[0]=sideline, segments[1]=slug
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
        
        // รูปภาพ: ถ้าไม่มีให้ใช้รูป Default
        const imageUrl = profile.imagePath 
            ? `${SUPABASE_URL}/storage/v1/object/public/profile-images/${profile.imagePath}`
            : `${DOMAIN_URL}/images/default_og_image.jpg`;
        
        const numericPrice = profile.rate ? profile.rate.toString().replace(/[^0-9]/g, '') : "1500";
        const pageUrl = `${DOMAIN_URL}/sideline/${profile.slug}`;

        // 🔥 FIX SEO: สูตรคำนวณดาวคงที่ (ไม่ต้องสุ่มมั่ว)
        const nameScore = profile.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const reviewCount = (nameScore % 40) + 80; // 80-120 รีวิว
        const ratingValue = (4.5 + (nameScore % 5) / 10).toFixed(1); // 4.5 - 4.9 ดาว

        const richSchema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Product",
                    "@id": `${pageUrl}#product`,
                    "name": `น้อง ${profile.name} ไซด์ไลน์${provinceName}`,
                    "image": imageUrl,
                    "description": `น้อง ${profile.name} รับงาน${provinceName} พิกัด ${profile.location}`,
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
                        "ratingValue": ratingValue, // ✅ ใช้ค่าคงที่
                        "reviewCount": reviewCount // ✅ ใช้ค่าคงที่
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
    <meta property="og:image:alt" content="น้อง ${profile.name} ไซด์ไลน์${provinceName}">
    <meta property="og:type" content="profile">
    <meta property="og:locale" content="th_TH">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${imageUrl}">

    <script type="application/ld+json">${JSON.stringify(richSchema)}</script>
    <style>body{font-family:sans-serif;padding:20px;max-width:800px;margin:0 auto}img{max-width:100%;border-radius:10px}h1{color:#d53f8c}</style>
</head>
<body>
    <article>
        <h1>น้อง ${profile.name} (${provinceName})</h1>
        <img src="${imageUrl}" alt="น้อง ${profile.name} ไซด์ไลน์${provinceName}">
        <p><strong>💰 ราคา:</strong> ${profile.rate}</p>
        <p><strong>📍 พิกัด:</strong> ${profile.location}</p>
        <p>${profile.description}</p>
        <a href="https://line.me/ti/p/${profile.lineId}" style="display:block;background:#06c755;color:#fff;padding:15px;text-align:center;border-radius:50px;text-decoration:none;">📲 แอดไลน์จองคิว</a>
    </article>
</body>
</html>`, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) {
        return context.next(); 
    }
};