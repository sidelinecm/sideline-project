import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    // ตรวจสอบบอทแบบครอบคลุม
    if (!/bot|google|spider|facebook|twitter|line|whatsapp|applebot/i.test(ua)) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline') return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // ใช้ Query แบบชุด (2) ที่ดึงข้อมูลได้แม่นยำที่สุด
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai)')
            .eq('slug', slug)
            .maybeSingle();
        
        if (!p) return context.next();

        // การเตรียมข้อมูล
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const price = p.rate ? parseInt(p.rate).toLocaleString() : 'สอบถาม';
        const ageText = (p.age && p.age !== 'null') ? `${p.age} ปี` : '20+ ปี';
        
        // แก้ไขปัญหาการแสดงรูปภาพให้เหมือนชุด (2)
        const imageUrl = `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}`;

        // ระบบ SEO และ Rating
        const seed = slug.length;
        const rating = (4.5 + (seed % 5) / 10).toFixed(1);
        const reviews = 85 + (seed % 60);

        const pageTitle = `${p.name} ไซด์ไลน์${provinceName} เรท ${price} สัดส่วน ${p.stats} - Sideline Chiangmai`;
        const metaDesc = `${p.name} รับงานไซด์ไลน์ ${provinceName} พิกัด ${p.location} สัดส่วน ${p.stats} อายุ ${ageText} ${p.description || 'รูปจริง ตรงปก 100% บริการฟีลแฟน'}`;

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:type" content="profile">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${p.name}",
      "image": "${imageUrl}",
      "description": "${metaDesc}",
      "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${rating}",
        "reviewCount": "${reviews}"
      }
    }
    </script>
    <style>
        body { font-family: 'Prompt', sans-serif; margin: 0; background: #f3f4f6; color: #1f2937; }
        .container { max-width: 480px; margin: 0 auto; background: #fff; min-height: 100vh; }
        .hero-img { width: 100%; aspect-ratio: 1/1; object-fit: cover; background: #eee; }
        .content { padding: 20px; }
        h1 { color: #db2777; font-size: 20px; margin: 0 0 15px 0; }
        .rating { color: #b45309; font-size: 14px; font-weight: bold; margin-bottom: 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .info-box { background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .label { font-size: 11px; color: #6b7280; display: block; }
        .val { font-weight: bold; font-size: 14px; }
        .description { background: #fff1f2; padding: 15px; border-radius: 10px; font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
        .btn-line { display: block; background: #06c755; color: white; text-align: center; padding: 15px; border-radius: 50px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 10px rgba(6,199,85,0.3); }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" alt="${p.name}" class="hero-img" onerror="this.src='${CONFIG.DOMAIN}/sidelinechiangmai-social-preview.webp'">
        <div class="content">
            <div class="rating">⭐ ${rating} (${reviews} รีวิว)</div>
            <h1>น้อง${p.name} - ไซด์ไลน์${provinceName}</h1>
            
            <div class="info-grid">
                <div class="info-box"><span class="label">ราคาเริ่มต้น</span><span class="val">${price} ฿</span></div>
                <div class="info-box"><span class="label">สัดส่วน</span><span class="val">${p.stats || '-'}</span></div>
                <div class="info-box"><span class="label">อายุ</span><span class="val">${ageText}</span></div>
                <div class="info-box"><span class="label">พิกัด</span><span class="val">${p.location || provinceName}</span></div>
            </div>

            <div class="description">${p.description || 'งานดีตรงปก ไม่เร่งรีบ บริการเป็นกันเอง รับรองความประทับใจค่ะ'}</div>

            <a href="https://line.me/ti/p/ksLUWB89Y_" class="btn-line">📲 ติดต่อสอบถาม/จองคิว</a>
            <a href="/" style="display:block; text-align:center; margin-top:20px; color:#db2777; text-decoration:none; font-size:14px;">🏠 กลับหน้าหลัก</a>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) { 
        return context.next(); 
    }
};