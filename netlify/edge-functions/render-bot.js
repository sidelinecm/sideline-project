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
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|line|inspectiontool|lighthouse/i.test(ua);

    if (!isBot) return context.next();

    try {
        const res = await fetch(`${CONFIG.DOMAIN}/index.html`);
        let html = await res.text();

        let title = "ไซด์ไลน์เชียงใหม่ ฟิวแฟน | ตรงปก ไม่มัดจำ จ่ายหน้างาน✅";
        let desc = "✅ ยืนยันตัวตน! รวมไซด์ไลน์เชียงใหม่ งานฟิวแฟน ตรงปก 100% ไม่โอนมัดจำ จ่ายเงินหน้างานเท่านั้น ⭐⭐⭐⭐⭐ 5.0";
        let imageUrl = `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
        let price = "1500";
        let botContent = ""; 

        // 🟢 ตรวจสอบหน้าโปรไฟล์ (sideline)
        if (pathParts[0] === "sideline") {
            const slug = decodeURIComponent(pathParts[1] || "");
            const { data: p } = await supabase.from('profiles').select('*').eq('slug', slug).maybeSingle();
            if (p) {
                title = `น้อง${p.name} - ไซด์ไลน์${p.location} รับงานเอง ฟิวแฟน ตรงปก 100%`;
                desc = `น้อง${p.name} พิกัด ${p.location} อายุ ${p.age} ปี งานฟิวแฟน ไม่มัดจำ จ่ายหน้างาน จองคิวคลิกเลย!`;
                price = String(p.rate || 1500).replace(/[^0-9]/g, '');
                imageUrl = `${CONFIG.URL}/storage/v1/object/public/profile-images/${p.imagePath}`;
                botContent = `<h1>${title}</h1><img src="${imageUrl}"><p>${desc}</p>`;
            }
        } 
        // 🔵 ตรวจสอบหน้าจังหวัด (location)
        else if (pathParts[0] === "location") {
            const loc = decodeURIComponent(pathParts[1] || "");
            const { data: list } = await supabase.from('profiles').select('name, location').eq('location', loc).limit(15);
            title = `ไซด์ไลน์${loc} - รวมน้องๆ รับงาน${loc} ฟิวแฟน ตรงปก ไม่มัดจำ`;
            desc = `รวมไซด์ไลน์${loc} งานดี ฟิวแฟนทุกคนยืนยันตัวตนแล้ว ไม่โอนมัดจำ จ่ายเงินหน้างาน ปลอดภัย 100%`;
            if (list && list.length > 0) {
                botContent = `<h1>น้องๆ ใน ${loc}</h1><ul>${list.map(n => `<li>ไซด์ไลน์${n.location} น้อง${n.name}</li>`).join('')}</ul>`;
            }
        }

        const safeCanonical = `${CONFIG.DOMAIN}${encodeURI(path)}`;
        const schema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": title,
            "image": imageUrl,
            "description": desc,
            "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
            "offers": { "@type": "Offer", "price": price, "priceCurrency": "THB", "url": safeCanonical, "availability": "https://schema.org/InStock" },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "215" }
        };

        // ฉีด Metadata เข้า Head
        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${desc}">`);
        const seoTags = `<link rel="canonical" href="${safeCanonical}"><meta property="og:url" content="${safeCanonical}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:image" content="${imageUrl}"><script type="application/ld+json">${JSON.stringify(schema)}</script>`;
        
        html = html.replace('<head>', `<head>${seoTags}`);
        html = html.replace('<body>', `<body><div style="display:none">${botContent}</div>`);

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) {
        return context.next();
    }
};