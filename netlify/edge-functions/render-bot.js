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

    // 1. ดักจับไฟล์ที่ไม่ใช่หน้าเว็บเพื่อความเร็ว
    if (path.includes('.') && !path.endsWith('.html')) return context.next();

    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    // เพิ่มการตรวจจับที่เข้มข้นขึ้นเพื่อให้ Googlebot ไม่หลุด
    const isBot = /bot|google|spider|crawler|facebook|line|inspectiontool|lighthouse/i.test(ua);

    if (!isBot) return context.next();

    try {
        let type = "home";
        let slug = "";

        // 2. แม่นยำเรื่อง Routing
        if (pathParts.length === 0 || path === "/" || path === "/index.html") {
            type = "home";
        } else if (pathParts[0] === "location") {
            type = "location";
            slug = decodeURIComponent(pathParts[1] || "");
        } else if (pathParts[0] === "sideline") {
            type = "profile";
            slug = decodeURIComponent(pathParts[1] || "");
        } else {
            return context.next(); // หน้าอื่นๆ ให้ข้ามไป
        }

        // 3. ดึงข้อมูลให้ตรงจุด
        let query = supabase.from('profiles').select('id, name, rate, age, imagePath, location, lineId, provinces(nameThai)');
        
        if (type === "home") {
            query = query.limit(1).order('created_at', { ascending: false });
        } else if (type === "location") {
            query = query.eq('location', slug).limit(1);
        } else {
            query = query.eq('slug', slug);
        }

        const { data: p } = await query.maybeSingle();

        // 4. สร้าง Metadata (อ้างอิงจาก index.html ของบอส)
        let title = "ไซด์ไลน์เชียงใหม่ รับงานเชียงใหม่ ฟิวแฟน |ตรงปก ไม่มัดจำ🚨";
        let desc = "✅ (ยืนยันตัวตน) ศูนย์รวมไซด์ไลน์เชียงใหม่ รับงานฟิวแฟน ตรงปก100% ไม่ต้องโอนมัดจำ✅";
        let canonical = CONFIG.DOMAIN;

        if (type === "location") {
            title = `ไซด์ไลน์${slug} - รับงาน${slug} (ทีมงาน Sideline Chiangmai)`;
            canonical = `${CONFIG.DOMAIN}/location/${slug}`;
        } else if (type === "profile") {
            title = `น้อง${p?.name || slug} - ไซด์ไลน์เชียงใหม่ รับงานเอง ฟิวแฟน ตรงปก 100%`;
            desc = `น้อง${p?.name || slug} ไซด์ไลน์พิกัด ${p?.location || 'เชียงใหม่'} อายุ ${p?.age || '20+'} ปี งานฟิวแฟน ไม่มัดจำ จองคิวคลิกเลย!`;
            canonical = `${CONFIG.DOMAIN}/sideline/${slug}`;
        }

        const imageUrl = p?.imagePath ? `${CONFIG.URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;

        // 5. พ่น HTML ที่ Googlebot ชอบ (สะอาดและชัดเจน)
        const html = `<!DOCTYPE html><html lang="th"><head><meta charset="utf-8">
            <title>${title}</title>
            <meta name="description" content="${desc}">
            <link rel="canonical" href="${canonical}">
            <meta property="og:url" content="${canonical}">
            <meta property="og:title" content="${title}">
            <meta property="og:description" content="${desc}">
            <meta property="og:image" content="${imageUrl}">
            <meta name="robots" content="index, follow">
            <script type="application/ld+json">{
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": "${title}",
                "image": "${imageUrl}",
                "description": "${desc}",
                "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
                "offers": { "@type": "Offer", "price": "${p?.rate || 1500}", "priceCurrency": "THB", "url": "${canonical}" },
                "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "128" }
            }</script>
        </head><body>
            <h1>${title}</h1>
            <img src="${imageUrl}" alt="${title}">
            <p>${desc}</p>
            <a href="https://line.me/ti/p/${p?.lineId || 'ksLUWB89Y_'}">จองคิวน้องคลิกที่นี่</a>
        </body></html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) { 
        return context.next(); 
    }
};