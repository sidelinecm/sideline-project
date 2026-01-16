import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    // ตรวจสอบบอทและเครื่องมือตรวจสอบอย่างละเอียด
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|lighthouse|inspectiontool|bingbot/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const currentFullUrl = url.origin + url.pathname;
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        let seo = {
            title: 'ไซด์ไลน์เชียงใหม่ - รวมน้องๆ รับงานเอง ฟิวแฟน ตรงปก 100%',
            desc: 'ศูนย์รวมสาวสวยไซด์ไลน์เชียงใหม่ รับงานเอง ไม่ผ่านเอเย่นต์ คัดน้องๆ งานดี ฟิวแฟน ปลอดภัย ไม่ต้องมัดจำ พิกัดทั่วเชียงใหม่',
            image: `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`,
            alt: 'ไซด์ไลน์เชียงใหม่ รับงานเอง ฟิวแฟน',
            content: '',
            jsonLd: {}
        };

        // --- 1. หน้าแรก (Homepage) ---
        if (pathParts.length === 0) {
            seo.jsonLd = { 
                "@context": "https://schema.org", 
                "@type": "WebSite", 
                "name": "Sideline Chiangmai", 
                "url": CONFIG.DOMAIN,
                "description": seo.desc
            };
            seo.content = `<h1>แหล่งรวมไซด์ไลน์เชียงใหม่ รับงานเอง</h1><p>${seo.desc}</p>`;
        } 
        
        // --- 2. หน้าน้องๆ (ดึงรายละเอียดจาก "ชื่อและรายละเอียด.js") ---
        else if (pathParts[0] === 'sideline' && pathParts.length >= 2) {
            const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
            if (['search', 'app', 'category'].includes(slug)) return context.next();

            const { data: p } = await supabase.from('profiles').select('*, provinces(nameThai)').eq('slug', slug).maybeSingle();
            
            if (p) {
                const prov = p.provinces?.nameThai || 'เชียงใหม่';
                // จัดการเรื่องราคาให้เป็นตัวเลขเพื่อ Schema
                const numericRate = p.rate ? p.rate.replace(/\D/g,'') : '1500';
                
                // ใช้ข้อมูลจากไฟล์ "ชื่อและรายละเอียด.js" มาใส่ใน Title และ Meta
                seo.title = `น้อง${p.name} (${p.stats}) - ไซด์ไลน์${prov} รับงานเอง ฟิวแฟน`;
                seo.desc = `น้อง${p.name} ไซด์ไลน์${prov} อายุ ${p.age} ปี สัดส่วน ${p.stats} พิกัด ${p.location} เรท ${p.rate} ${p.altText || ''}`;
                seo.image = p.imagePath ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` : seo.image;
                seo.alt = p.altText || `น้อง${p.name} ไซด์ไลน์${prov}`;
                
                // Schema Markup ขั้นสูงเพื่อให้ขึ้น "ดาว" และ "ราคา" ใน Google
                seo.jsonLd = {
                    "@context": "https://schema.org/",
                    "@type": "Product",
                    "name": `น้อง${p.name} ไซด์ไลน์${prov}`,
                    "image": seo.image,
                    "description": seo.desc,
                    "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
                    "offers": { 
                        "@type": "Offer", 
                        "price": numericRate, 
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock"
                    },
                    "aggregateRating": { 
                        "@type": "AggregateRating", 
                        "ratingValue": "4.9", 
                        "reviewCount": (100 + (p.name.length * 5)).toString() 
                    }
                };

                seo.content = `
                    <div class="profile-detail">
                        <h1>น้อง${p.name} ไซด์ไลน์${prov}</h1>
                        <div class="stats-box">
                            <p><strong>👙 สัดส่วน:</strong> ${p.stats}</p>
                            <p><strong>🎂 อายุ:</strong> ${p.age} ปี</p>
                            <p><strong>📍 พิกัด:</strong> ${p.location}</p>
                            <p><strong>💰 ค่าขนม:</strong> ${p.rate}</p>
                        </div>
                        <p class="alt-text">${p.altText || ''}</p>
                    </div>`;
            }
        }
        
        // --- 3. หน้าจังหวัด (/province/slug) ---
        else if (pathParts[0] === 'province' && pathParts.length >= 2) {
            const provSlug = decodeURIComponent(pathParts[1]);
            seo.title = `ไซด์ไลน์${provSlug} - รวมน้องๆ งานดี พิกัด${provSlug} รับงานเอง ฟิวแฟน`;
            seo.desc = `รวมสาวสวยไซด์ไลน์ในจังหวัด${provSlug} รับงานเอง ไม่ผ่านเอเย่นต์ ไม่ต้องมัดจำ พิกัดทั่ว${provSlug}`;
            seo.content = `<h1>รวมไซด์ไลน์${provSlug}</h1><p>${seo.desc}</p>`;
            seo.jsonLd = { "@context": "https://schema.org", "@type": "CollectionPage", "name": seo.title };
        }

        // --- สร้าง HTML (แก้จอดำ 100% ด้วย CSS !important) ---
        const html = `<!DOCTYPE html><html lang="th"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.desc}">
    <link rel="canonical" href="${currentFullUrl}">
    <meta property="og:title" content="${seo.title}"><meta property="og:description" content="${seo.desc}"><meta property="og:image" content="${seo.image}"><meta property="og:url" content="${currentFullUrl}"><meta property="og:type" content="website">
    <script type="application/ld+json">${JSON.stringify(seo.jsonLd)}</script>
    <style>
        html, body { background-color: #ffffff !important; color: #1a1a1a !important; margin: 0; padding: 0; font-family: sans-serif; display: block !important; visibility: visible !important; }
        .container { max-width: 500px; margin: 0 auto; background: #fff; min-height: 100vh; text-align: center; }
        .hero-img { width: 100%; height: auto; display: block; background: #f0f0f0; }
        h1 { color: #db2777; padding: 20px; font-size: 24px; }
        .stats-box { background: #fff5f8; padding: 20px; border-radius: 15px; margin: 20px; text-align: left; border: 1px solid #ffe4ee; }
        .stats-box p { margin: 10px 0; font-size: 17px; }
        .alt-text { padding: 0 20px; color: #666; font-style: italic; }
    </style></head><body><div class="container"><img src="${seo.image}" class="hero-img" alt="${seo.alt}"><div>${seo.content}</div></div></body></html>`;

    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "index, follow" } });

    } catch (e) { return context.next(); }
};