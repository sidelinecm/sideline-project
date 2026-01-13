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

    // 1. ถ้าไม่ใช่ Bot ให้ปล่อยผ่านไปหน้าเว็บจริง
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|line|inspectiontool|lighthouse/i.test(ua);
    if (!isBot) return context.next();

    // 2. ดึงเนื้อหาจาก index.html จริงมาเป็นฐาน
    const response = await context.next();
    let html = await response.text();

    try {
        let title = "ไซด์ไลน์เชียงใหม่ ฟิวแฟน | ตรงปก ไม่มัดจำ จ่ายหน้างาน✅";
        let desc = "✅ ยืนยันตัวตน! รวมไซด์ไลน์เชียงใหม่ งานฟิวแฟน ตรงปก 100% ไม่โอนมัดจำ จ่ายเงินหน้างานเท่านั้น ปลอดภัย มั่นใจได้ ⭐⭐⭐⭐⭐ 5.0";
        let imageUrl = `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
        let price = "1500";
        let type = "home";
        let slug = "";

        // 3. วิเคราะห์เส้นทาง (Path)
        if (pathParts[0] === "location") {
            type = "location";
            slug = decodeURIComponent(pathParts[1] || "");
        } else if (pathParts[0] === "sideline") {
            type = "profile";
            slug = decodeURIComponent(pathParts[1] || "");
        }

        // 4. ดึงข้อมูลจากฐานข้อมูล
        let query = supabase.from('profiles').select('name, rate, age, imagePath, location, slug');
        if (type === "location") {
            query = query.eq('location', slug).limit(1);
        } else if (type === "profile") {
            query = query.eq('slug', slug);
        }

        const { data: p } = await query.maybeSingle();

        // 5. ปรับปรุงข้อมูลตามข้อมูลน้องๆ
        if (p) {
            price = String(p.rate || 1500).replace(/[^0-9]/g, ''); // ล้างค่าราคาให้เหลือตัวเลขล้วน
            if (type === "profile") {
                title = `น้อง${p.name} - ไซด์ไลน์เชียงใหม่ รับงานเอง ฟิวแฟน ตรงปก 100%`;
                desc = `น้อง${p.name} พิกัด ${p.location} อายุ ${p.age} ปี งานฟิวแฟน ไม่มัดจำ จ่ายหน้างาน จองคิวคลิกเลย!`;
            } else if (type === "location") {
                title = `ไซด์ไลน์${slug} - รับงาน${slug} ฟิวแฟน ตรงปก (ทีมงาน Sideline Chiangmai)`;
            }
            if (p.imagePath) {
                imageUrl = `${CONFIG.URL}/storage/v1/object/public/profile-images/${p.imagePath}`;
            }
        }

        // 6. เข้ารหัส URL ภาษาไทยให้ถูกต้อง (ป้องกันปัญหา URL ไม่แสดง)
        const safeCanonical = `${CONFIG.DOMAIN}${encodeURI(path)}`;

        // 7. สร้าง Schema JSON-LD
        const schema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": title,
            "image": imageUrl,
            "description": desc,
            "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
            "offers": { 
                "@type": "Offer", 
                "price": price, 
                "priceCurrency": "THB", 
                "url": safeCanonical,
                "availability": "https://schema.org/InStock" 
            },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "158" }
        };

        // 8. ทำการ Replace (ฉีดข้อมูล) ลงในโครงสร้าง index.html เดิม
        // ลบ Title/Description เดิมออกแล้วใส่ใหม่
        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${desc}">`);
        
        // แทรก Tags สำคัญก่อนปิด </head>
        const seoTags = `
<link rel="canonical" href="${safeCanonical}">
<meta property="og:url" content="${safeCanonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${imageUrl}">
<meta name="robots" content="index, follow, max-image-preview:large">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
        `;
        html = html.replace('</head>', `${seoTags}</head>`);

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });

    } catch (e) {
        return context.next();
    }
};