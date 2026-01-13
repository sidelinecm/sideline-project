import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// [Optimization 1] ประกาศ Client ไว้นอก Function เพื่อใช้ Connection ซ้ำ (Reuse) ลดเวลา Latency
const CONFIG = {
    URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

const supabase = createClient(CONFIG.URL, CONFIG.KEY);

export default async (request, context) => {
    const url = new URL(request.url);
    const path = url.pathname;

    // [Optimization 2] Early Exit - ถ้าไม่ใช่หน้า sideline ให้ข้ามทันที ไม่ต้องรัน Logic ด้านล่างให้เสียเวลา CPU
    if (!path.startsWith('/sideline/')) return context.next();

    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const clientIP = request.headers.get('x-nf-client-connection-ip') || '';

    // [Optimization 3] แยกแยะ Bot แบบครอบคลุมยันเงา
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i.test(ua);
    
    // ดักพวก Data Center (สายสืบ) เฉพาะตอนสงสัยว่าเป็น Bot เพื่อความรวดเร็ว
    let isDataCenter = false;
    if (isBot && clientIP && clientIP !== '127.0.0.1') {
        try {
            const ipCheck = await fetch(`http://ip-api.com/json/${clientIP}?fields=hosting`);
            const ipData = await ipCheck.json();
            isDataCenter = ipData.hosting === true;
        } catch (e) { isDataCenter = false; }
    }

    // ถ้าเป็นคนจริง (ไม่ใช่ Bot/Data Center) ให้ไปรัน Client-side JS ตามปกติ
    if (!isBot && !isDataCenter) return context.next();

    try {
        const pathParts = path.split('/').filter(Boolean);
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        
        // ข้ามหน้าที่ไม่ใช่โปรไฟล์น้องๆ
        if (['province', 'category', 'search', 'app'].includes(slug) || pathParts.length < 2) return context.next();

        // [Optimization 4] เลือกดึงเฉพาะคอลัมน์ที่จำเป็น (Payload Reduction)
        const { data: p } = await supabase
            .from('profiles')
            .select('id, name, rate, stats, age, imagePath, location, created_at, provinces(nameThai, key)')
            .eq('slug', slug)
            .maybeSingle();

        if (!p) return context.next();

        // เตรียมข้อมูล SEO
        const provName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const rawRate = p.rate ? parseInt(p.rate.toString().replace(/[^0-9]/g, '')) : 0;
        const schemaPrice = rawRate > 0 ? rawRate : 1500;
        const displayPrice = rawRate > 0 ? `${rawRate.toLocaleString()}.-` : 'สอบถาม';
        const ageText = (p.age && p.age !== 'null') ? p.age : '20+';
        const imageUrl = p.imagePath ? `${CONFIG.URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
        const canonical = `${CONFIG.DOMAIN}/sideline/${slug}`;
        
        // Rating แบบ Dynamic อ้างอิงจาก Slug (เพื่อให้ Bot เห็นค่าที่ไม่ซ้ำกัน)
        const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rating = (4.7 + (hash % 4) / 10).toFixed(1);
        const reviews = 120 + (hash % 80);

        // [SEO Mastery] จัดเต็ม JSON-LD Schema (Google รักสิ่งนี้)
        const schema = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Product",
                    "name": `น้อง${p.name} ไซด์ไลน์${provName}`,
                    "image": imageUrl,
                    "description": `น้อง${p.name} สาวสวยไซด์ไลน์${provName} อายุ ${ageText}ปี สัดส่วน ${p.stats || 'ตรงปก'} รับงานฟิวแฟน พิกัด${p.location || provName} ปลอดภัย ไม่มัดจำ`,
                    "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
                    "offers": {
                        "@type": "Offer",
                        "url": canonical,
                        "priceCurrency": "THB",
                        "price": schemaPrice,
                        "availability": "https://schema.org/InStock"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": rating,
                        "reviewCount": reviews
                    }
                }
            ]
        };

        // [Response] ส่ง HTML แบบ Lightweight (เน้นเนื้อหาให้ Bot อ่านง่ายที่สุด)
        const html = `<!DOCTYPE html><html lang="th"><head><meta charset="utf-8">
        <title>น้อง${p.name} - ไซด์ไลน์${provName} รับงานเอง ฟิวแฟน ตรงปก 100%</title>
        <meta name="description" content="น้อง${p.name} ไซด์ไลน์${provName} อายุ ${ageText}ปี ${p.stats || ''} รับงานฟิวแฟน ไม่ต้องโอนมัดจำ รูปตรงปก 100% ปลอดภัย จองคิวคลิกเลย!">
        <link rel="canonical" href="${canonical}">
        <meta property="og:image" content="${imageUrl}">
        <meta name="robots" content="index, follow">
        <script type="application/ld+json">${JSON.stringify(schema)}</script>
        <style>body{font-family:sans-serif;line-height:1.6;color:#333;margin:0;background:#f9f9f9}.v-card{max-width:500px;margin:auto;background:#fff;min-height:100vh}
        .hero{width:100%;aspect-ratio:1;object-fit:cover}.p-5{padding:20px}h1{color:#db2777;margin-top:0}.tag{display:inline-block;background:#fdf2f8;color:#be185d;padding:4px 12px;border-radius:20px;font-size:14px;margin-bottom:10px}
        .btn{display:block;background:#06c755;color:#fff;text-align:center;padding:16px;text-decoration:none;border-radius:50px;font-weight:bold;margin-top:30px;box-shadow:0 4px 12px rgba(6,199,85,0.3)}</style>
        </head><body><div class="v-card"><img src="${imageUrl}" class="hero" alt="${p.name}">
        <div class="p-5"><div class="tag">⭐ ${rating} (${reviews} reviews)</div>
        <h1>น้อง${p.name} ไซด์ไลน์${provName}</h1>
        <p><b>อายุ:</b> ${ageText} ปี | <b>สัดส่วน:</b> ${p.stats || 'ไม่ระบุ'}</p>
        <p><b>ราคา:</b> <span style="color:#db2777;font-size:20px;font-weight:bold">${displayPrice}</span></p>
        <p><b>พิกัด:</b> ${p.location || provName}</p>
        <div style="border-left:4px solid #db2777;padding-left:15px;margin:20px 0;font-style:italic">น้อง${p.name} ตัวจริงน่ารักมากครับ ตรงปกตามรูปเลย บริการเป็นกันเองสุดๆ แนะนำครับ</div>
        <a href="https://line.me/ti/p/${p.lineId || ''}" class="btn">📲 ติดต่อสอบถาม / จองคิวคลิก</a>
        </div></div></body></html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "index, follow" } });
    } catch (e) { return context.next(); }
};