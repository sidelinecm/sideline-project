import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

export default async (request, context) => {
    // 1. ตรวจสอบ User Agent ว่าเป็น Bot หรือไม่
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    // Regex นี้ครอบคลุม Bot หลักๆ และ Social Media Preview ทั้งหมด
    const ADVANCED_BOT_LIST = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse|chrome-lighthouse|gtmetrix/i;
    const isBot = ADVANCED_BOT_LIST.test(ua);

    // 2. ถ้า "ไม่ใช่ Bot" ให้ปล่อยผ่านไปหน้าเว็บปกติ (SPA) ทันที
    if (!isBot) {
        return context.next();
    }

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);

        // ตรวจสอบโครงสร้าง URL: ต้องเป็น /sideline/[slug] เท่านั้น
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        // กรองคำสงวนที่ไม่ใช่ชื่อน้อง
        if (['province', 'category', 'search', 'app', 'login', 'register'].includes(slug)) return context.next();

        // 3. เริ่มดึงข้อมูลจาก Supabase
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai, key)')
            .eq('slug', slug)
            .maybeSingle();

        // ถ้าไม่เจอข้อมูล ให้ปล่อยไปหน้า 404 ของระบบปกติ
        if (!p) return context.next();

        // --- ส่วนการจัดการข้อมูล (Data Cleaning Logic) ---

        // [FIX 1] แก้ปัญหาชื่อซ้ำ "น้องน้อง"
        // ลบคำว่า "น้อง" ออกจากข้างหน้า (ถ้ามี) แล้วค่อยเติมเข้าไปใหม่
        const cleanName = p.name ? p.name.replace(/^น้อง/, '').trim() : 'ไม่ระบุชื่อ';
        const displayName = `น้อง${cleanName}`;

        // [FIX 2] แก้ปัญหา Link Line พัง/ซ้อน
        const rawLine = p.lineId || 'ksLUWB89Y_'; // Fallback Line ID
        // เช็คว่ามี http หรือ https นำหน้าหรือไม่
        const lineHref = (rawLine.startsWith('http://') || rawLine.startsWith('https://')) 
            ? rawLine 
            : `https://line.me/ti/p/${rawLine}`;

        // [FIX 3] จัดการข้อมูลอื่นๆ
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        
        // แปลงราคา และใส่ลูกน้ำ
        const rawRate = p.rate ? parseInt(p.rate.toString().replace(/[^0-9]/g, '')) : 0;
        const schemaPrice = rawRate > 0 ? rawRate : 1500;
        const displayPrice = rawRate > 0 ? `${rawRate.toLocaleString()}.-` : 'สอบถาม';
        
        const ageText = (p.age && p.age !== 'null') ? p.age : '20+';
        
        // รูปภาพ (Fallback ถ้าไม่มีรูป)
        const imageUrl = p.imagePath 
            ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` 
            : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;

        // สร้าง Fake Rating จากชื่อ (เพื่อให้ค่าคงที่สำหรับแต่ละคน)
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1); 
        const reviewCount = 150 + (charCodeSum % 100);

        // [FIX 4] SEO & Meta Tags
        const pageTitle = `${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน ตรงปก 100%`;
        const metaDesc = `${displayName} สาวไซด์ไลน์${provinceName} อายุ ${ageText}ปี ${p.stats || ''} รับงานฟิวแฟน ไม่ต้องโอนมัดจำ ชำระเงินหน้างานเท่านั้น รูปตรงปก 100% ปลอดภัย พิกัด${p.location || provinceName} จองคิวคลิกเลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // Schema JSON-LD (Product)
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                { 
                    "@type": "BreadcrumbList", 
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN }, 
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/sideline/province/${provinceKey}` }, 
                        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                    ] 
                },
                {
                    "@type": "Product",
                    "name": `${displayName} ไซด์ไลน์${provinceName}`,
                    "image": imageUrl,
                    "description": metaDesc,
                    "sku": `SL-${p.id}`,
                    "mpn": `${p.slug}`,
                    "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
                    "offers": { 
                        "@type": "Offer", 
                        "url": canonicalUrl, 
                        "priceCurrency": "THB", 
                        "price": schemaPrice, 
                        "priceValidUntil": "2026-12-31", 
                        "availability": "https://schema.org/InStock", 
                        "itemCondition": "https://schema.org/NewCondition" 
                    },
                    "aggregateRating": { 
                        "@type": "AggregateRating", 
                        "ratingValue": ratingValue, 
                        "reviewCount": reviewCount, 
                        "bestRating": "5", 
                        "worstRating": "1" 
                    },
                    "review": { 
                        "@type": "Review", 
                        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, 
                        "author": { "@type": "Person", "name": "ลูกค้าสมาชิก (Verified User)" }, 
                        "datePublished": p.created_at ? p.created_at.split('T')[0] : "2024-01-01", 
                        "reviewBody": `${displayName} ตัวจริงน่ารักมากครับ ตรงปกตามรูปเลย ไม่ผิดหวัง บริการเป็นกันเองสุดๆ แนะนำครับ` 
                    }
                }
            ]
        };

        // 4. สร้าง HTML Response (Server Side Rendering)
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <!-- Open Graph for Social Media Sharing -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">
    <meta property="og:locale" content="th_TH">
    <meta name="twitter:card" content="summary_large_image">

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #333; line-height: 1.5; }
        .container { max-width: 480px; margin: 0 auto; padding-bottom: 40px; }
        .hero-img { width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 3/4; }
        .content { padding: 20px; }
        h1 { color: #db2777; font-size: 22px; margin-bottom: 10px; font-weight: 700; }
        .rating-box { color: #f59e0b; font-weight: bold; margin-bottom: 8px; font-size: 14px; display: flex; align-items: center; gap: 4px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .info-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #f9fafb; font-size: 14px; font-weight: 500; }
        .btn-contact { display: block; text-align: center; background-color: #06c755; color: white; padding: 14px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: background-color 0.2s; }
        .btn-contact:hover { background-color: #05a546; }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" class="hero-img" alt="${pageTitle}">
        <div class="content">
            <div class="rating-box">
                <span>⭐</span> ${ratingValue} (${reviewCount} รีวิว)
            </div>
            <h1>${pageTitle}</h1>
            <div class="info-grid">
                <div class="info-card">💰 เริ่มต้น: ${displayPrice}</div>
                <div class="info-card">📍 พิกัด: ${p.location || provinceName}</div>
            </div>
            <a href="${lineHref}" class="btn-contact">📲 ติดต่อสอบถาม / จองคิวคลิก</a>
        </div>
    </div>
</body>
</html>`;
        
        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8", 
                "x-robots-tag": "index, follow" 
            } 
        });

    } catch (e) {
        console.error("SSR Error:", e);
        // กรณีเกิด Error จริงๆ ให้ส่งกลับไปให้หน้าเว็บปกติจัดการ (Fail-safe)
        return context.next();
    }
};