import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 

export default async (request, context) => {
    const userAgent = request.headers.get('User-Agent') || '';
    // ตรวจสอบว่าเป็น Bot หรือไม่
    if (!/bot|google|spider|facebook|bing|yandex|applebot/i.test(userAgent)) return context.next(); 

    try {
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        // ถอดรหัสภาษาไทยจาก URL
        const profileSlug = decodeURIComponent(pathSegments[pathSegments.length - 1]); 

        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // ดึงข้อมูลโปรไฟล์พร้อม Join ตารางจังหวัดเพื่อให้ข้อมูลแม่นยำ
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai)')
            .eq('slug', profileSlug)
            .maybeSingle();
        
        if (!p) return context.next();

        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const title = `${p.name} ไซด์ไลน์${provinceName} เรท ${p.rate || 'สอบถาม'} สัดส่วน ${p.stats} - Sideline Chiangmai`;
        const description = `${p.name} รับงานไซด์ไลน์ ${provinceName} พิกัด ${p.location} สัดส่วน ${p.stats} อายุ ${p.age} ปี ${p.description || 'รูปจริง ตรงปก 100% บริการฟีลแฟน'}`;
        const img = `${SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}`;

        // สร้าง HTML พร้อม JSON-LD สำหรับแสดงดาว (Rich Snippets)
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${img}">
    <meta property="og:type" content="profile">
    <link rel="canonical" href="${request.url}">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${p.name} - ไซด์ไลน์ ${provinceName}",
      "image": "${img}",
      "description": "${description}",
      "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
      "sku": "SL-${p.id}",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "${Math.floor(Math.random() * (160 - 95 + 1)) + 95}"
      }
    }
    </script>
</head>
<body>
    <h1>${p.name}</h1>
    <img src="${img}" alt="${p.name}">
    <p>${description}</p>
    <p>เรทราคา: ${p.rate}</p>
    <p>ติดต่อ: <a href="https://line.me/ti/p/ksLUWB89Y_">แอดไลน์ที่นี่</a></p>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) { 
        return context.next(); 
    }
};