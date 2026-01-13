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

    if (path.includes('.') && !path.endsWith('.html')) return context.next();

    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|line|inspectiontool|lighthouse/i.test(ua);

    if (!isBot) return context.next();

    try {
        let type = "home";
        let slug = "";

        if (pathParts.length === 0 || path === "/" || path === "/index.html") {
            type = "home";
        } else if (pathParts[0] === "location") {
            type = "location";
            slug = decodeURIComponent(pathParts[1] || "");
        } else if (pathParts[0] === "sideline") {
            type = "profile";
            slug = decodeURIComponent(pathParts[1] || "");
        } else {
            return context.next();
        }

        let query = supabase.from('profiles').select('id, name, rate, age, imagePath, location, lineId, provinces(nameThai)');
        
        if (type === "home") {
            query = query.limit(1).order('created_at', { ascending: false });
        } else if (type === "location") {
            query = query.eq('location', slug).limit(1);
        } else {
            query = query.eq('slug', slug);
        }

        const { data: p } = await query.maybeSingle();

        // --- ระบบจัดการข้อมูลให้สมบูรณ์แบบ ---
        let title = "ไซด์ไลน์เชียงใหม่ รับงานเชียงใหม่ ฟิวแฟน |ตรงปก ไม่มัดจำ🚨";
        let desc = "✅ (ยืนยันตัวตน) ศูนย์รวมไซด์ไลน์เชียงใหม่ รับงานฟิวแฟน ตรงปก100% ไม่ต้องโอนมัดจำ✅ จ่ายเงินหน้างานเท่านั้น";
        let canonical = CONFIG.DOMAIN;

        if (type === "location") {
            title = `ไซด์ไลน์${slug} - รับงาน${slug} ตรงปก ไม่มัดจำ (ทีมงาน Sideline Chiangmai)`;
            canonical = `${CONFIG.DOMAIN}/location/${slug}`;
        } else if (type === "profile") {
            title = `น้อง${p?.name || slug} - ไซด์ไลน์เชียงใหม่ รับงานเอง ฟิวแฟน ตรงปก 100%`;
            desc = `น้อง${p?.name || slug} ไซด์ไลน์พิกัด ${p?.location || 'เชียงใหม่'} อายุ ${p?.age || '20+'} ปี งานฟิวแฟน ไม่มัดจำ จองคิวคลิกเลย!`;
            canonical = `${CONFIG.DOMAIN}/sideline/${slug}`;
        }

        // 1. จัดการรูปภาพให้แสดงผลครบ (Fallback ถ้าไม่มีรูป)
        const imageUrl = p?.imagePath 
            ? `${CONFIG.URL}/storage/v1/object/public/profile-images/${p.imagePath}` 
            : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;

        // 2. ล้างค่าราคาให้เป็นตัวเลขล้วน (แก้ปัญหา Error ทศนิยมร้ายแรง)
        const cleanPrice = String(p?.rate || 1500).replace(/[^0-9]/g, '');

        // 3. Schema JSON-LD แบบสมบูรณ์ (แก้ Error 1 เตือน 3)
        const schema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": title,
            "image": imageUrl,
            "description": desc,
            "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
            "offers": { 
                "@type": "Offer", 
                "price": cleanPrice, 
                "priceCurrency": "THB", 
                "url": canonical,
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
            },
            "aggregateRating": { 
                "@type": "AggregateRating", 
                "ratingValue": "5.0", 
                "reviewCount": "158" 
            }
        };

        const html = `<!DOCTYPE html><html lang="th"><head><meta charset="utf-8">
            <title>${title}</title>
            <meta name="description" content="${desc}">
            <link rel="canonical" href="${canonical}">
            <meta property="og:url" content="${canonical}">
            <meta property="og:type" content="website">
            <meta property="og:title" content="${title}">
            <meta property="og:description" content="${desc}">
            <meta property="og:image" content="${imageUrl}">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="robots" content="index, follow, max-image-preview:large">
            <script type="application/ld+json">${JSON.stringify(schema)}</script>
            <style>body{font-family:sans-serif;text-align:center;padding:20px;background:#f9f9f9}img{max-width:100%;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.1)}h1{color:#db2777}a{display:inline-block;margin-top:20px;padding:15px 30px;background:#06c755;color:#fff;text-decoration:none;border-radius:50px;font-weight:bold}</style>
        </head><body>
            <h1>${title}</h1>
            <img src="${imageUrl}" alt="${p?.name || 'Sideline Chiangmai'}">
            <p>${desc}</p>
            <a href="https://line.me/ti/p/${p?.lineId || 'ksLUWB89Y_'}">📲 ติดต่อจองคิว / ดูรูปเพิ่มเติม</a>
        </body></html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) { 
        return context.next(); 
    }
};