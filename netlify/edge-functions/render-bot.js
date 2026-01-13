import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONFIG = {
    URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

const supabase = createClient(CONFIG.URL, CONFIG.KEY);

export default async (request, context) => {
    const url = new URL(request.url);
    const path = url.pathname;
    const pathParts = path.split('/').filter(Boolean);

    // [Optimization] ปล่อยผ่านเฉพาะไฟล์รูปภาพ หรือ API เพื่อความเร็ว
    if (path.includes('.') || path.startsWith('/api/')) return context.next();

    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const clientIP = request.headers.get('x-nf-client-connection-ip') || '';

    // ระบบดักจับ Bot และ Data Center (สายสืบ)
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i.test(ua);
    let isDataCenter = false;
    if (isBot && clientIP && clientIP !== '127.0.0.1') {
        try {
            const ipCheck = await fetch(`http://ip-api.com/json/${clientIP}?fields=hosting`);
            const ipData = await ipCheck.json();
            isDataCenter = ipData.hosting === true;
        } catch (e) { isDataCenter = false; }
    }

    // ถ้าไม่ใช่ Bot หรือ Googlebot ให้เข้าหน้าเว็บปกติ (index.html)
    if (!isBot && !isDataCenter) return context.next();

    try {
        let type = pathParts.length === 0 ? "home" : pathParts[0];
        let slug = pathParts.length === 0 ? "index" : decodeURIComponent(pathParts[pathParts.length - 1]);

        // ข้ามหน้า Filter ที่ไม่ใช่โปรไฟล์หรือสถานที่
        if (['province', 'category', 'search', 'app', 'profiles.html', 'locations.html'].includes(slug)) return context.next();

        // ดึงข้อมูลจาก Supabase
        let query = supabase.from('profiles').select('id, name, rate, stats, age, imagePath, location, lineId, provinces(nameThai, key)');
        
        if (type === "home") {
            query = query.limit(1).order('created_at', { ascending: false });
        } else if (type === "location") {
            query = query.eq('location', slug).limit(1);
        } else {
            query = query.eq('slug', slug);
        }

        const { data: result } = await query.maybeSingle();
        const p = result || { name: 'น้องๆ สาวสวย', location: 'เชียงใหม่' };

        // จัดการข้อมูล SEO ให้ตรงกับ index.html ของบอส
        const provName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        let pageTitle = "";
        let pageDesc = "";
        let canonical = CONFIG.DOMAIN;

        if (type === "home") {
            pageTitle = "ไซด์ไลน์เชียงใหม่ รับงานเชียงใหม่ ฟิวแฟน |ตรงปก ไม่มัดจำ🚨 ชำระเงินหน้างาน✅";
            pageDesc = "✅ (ยืนยันตัวตน) ศูนย์รวมไซด์ไลน์เชียงใหม่ รับงานฟิวแฟน ตรงปก100% ไม่ต้องโอนมัดจำ✅ จ่ายเงินหน้างานเท่านั้น✅ ปลอดภัย... ⭐⭐⭐⭐⭐⭐ 5.0";
            canonical = CONFIG.DOMAIN;
        } else if (type === "location") {
            pageTitle = `ไซด์ไลน์${slug} - สาวสวยงานฟิวแฟน พิกัด${slug} รับงานเอง ไม่มัดจำ`;
            pageDesc = `รวมน้องๆ ไซด์ไลน์${slug} สาวสวยงานฟิวแฟน รับงานเองในพื้นที่${slug} รูปตรงปก 100% ปลอดภัย ไม่โอนมัดจำ จองคิวสะดวกผ่านไลน์`;
            canonical = `${CONFIG.DOMAIN}/location/${slug}`;
        } else {
            pageTitle = `น้อง${p.name} - ไซด์ไลน์${provName} รับงานเอง ฟิวแฟน ตรงปก 100%`;
            pageDesc = `น้อง${p.name} ไซด์ไลน์${provName} อายุ ${p.age || '20+'}ปี พิกัด${p.location || provName} งานฟิวแฟน รูปตรงปก ไม่มัดจำ จองคิวคลิกเลย!`;
            canonical = `${CONFIG.DOMAIN}/sideline/${slug}`;
        }

        const rawRate = p.rate ? parseInt(p.rate.toString().replace(/[^0-9]/g, '')) : 0;
        const displayPrice = rawRate > 0 ? `${rawRate.toLocaleString()}.-` : 'สอบถาม';
        const imageUrl = p.imagePath ? `${CONFIG.URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
        
        // สร้าง Rating แบบ Dynamic
        const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rating = (4.7 + (hash % 4) / 10).toFixed(1);
        const reviews = 120 + (hash % 80);

        const schema = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Product",
                    "name": pageTitle,
                    "image": imageUrl,
                    "description": pageDesc,
                    "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
                    "offers": { "@type": "Offer", "url": canonical, "priceCurrency": "THB", "price": rawRate || 1500, "availability": "https://schema.org/InStock" },
                    "aggregateRating": { "@type": "AggregateRating", "ratingValue": rating, "reviewCount": reviews }
                }
            ]
        };

        const html = `<!DOCTYPE html><html lang="th"><head><meta charset="utf-8">
        <title>${pageTitle}</title>
        <meta name="description" content="${pageDesc}">
        <link rel="canonical" href="${canonical}">
        <meta property="og:image" content="${imageUrl}">
        <meta name="robots" content="index, follow">
        <script type="application/ld+json">${JSON.stringify(schema)}</script>
        <style>body{font-family:sans-serif;line-height:1.6;color:#333;margin:0;background:#f9f9f9}.v-card{max-width:500px;margin:auto;background:#fff;min-height:100vh}
        .hero{width:100%;aspect-ratio:1;object-fit:cover}.p-5{padding:20px}h1{color:#db2777;margin-top:0;font-size:24px}.tag{display:inline-block;background:#fdf2f8;color:#be185d;padding:4px 12px;border-radius:20px;font-size:14px;margin-bottom:10px}
        .btn{display:block;background:#06c755;color:#fff;text-align:center;padding:16px;text-decoration:none;border-radius:50px;font-weight:bold;margin-top:30px;box-shadow:0 4px 12px rgba(6,199,85,0.3)}</style>
        </head><body><div class="v-card"><img src="${imageUrl}" class="hero">
        <div class="p-5"><div class="tag">⭐ ${rating} (${reviews} reviews)</div>
        <h1>${type === "home" ? "ไซด์ไลน์เชียงใหม่ ฟิวแฟน" : (type === "location" ? `ไซด์ไลน์${slug} งานดีตรงปก` : `น้อง${p.name} ไซด์ไลน์${provName}`)}</h1>
        <p><b>พิกัด:</b> ${p.location || provName}</p>
        <p><b>ราคา:</b> <span style="color:#db2777;font-size:20px;font-weight:bold">${displayPrice}</span></p>
        <a href="https://line.me/ti/p/${p.lineId || ''}" class="btn">📲 ติดต่อสอบถาม / จองคิวคลิก</a>
        </div></div></body></html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "index, follow" } });
    } catch (e) { return context.next(); }
};