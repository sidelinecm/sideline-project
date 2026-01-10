import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

const cache = { data: new Map(), lastFetch: new Map() };

export default async (request, context) => {
    try {
        const ua = (request.headers.get('User-Agent') || '').toLowerCase();
        const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i.test(ua);
        if (!isBot) return context.next();

        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (!['province', 'location'].includes(pathParts[0])) return context.next();
        
        const provinceKey = pathParts[pathParts.length - 1];
        const cacheKey = `prov_${provinceKey}`;
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        let provinceData, profilesList = [];

        if (cache.data.has(cacheKey) && (Date.now() - cache.lastFetch.get(cacheKey) < 300000)) {
            ({ province: provinceData, profiles: profilesList } = cache.data.get(cacheKey));
        } else {
            const { data: pData } = await supabase.from('provinces').select('*').eq('key', provinceKey).maybeSingle();
            provinceData = pData;
            const { data: pList } = await supabase.from('profiles').select('name, slug, age, rate, location, imagePath').eq('provinceKey', provinceKey).eq('active', true).order('isfeatured', { ascending: false }).limit(20);
            profilesList = pList || [];
            if (provinceData) { cache.data.set(cacheKey, { province: provinceData, profiles: profilesList }); cache.lastFetch.set(cacheKey, Date.now()); }
        }

        const pName = provinceData?.nameThai || 'เชียงใหม่';
        const pNameEng = provinceData?.nameEng || 'Chiang Mai';
        const dateStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        const pageTitle = `ไซด์ไลน์${pName} รับงาน${pName} ฟิวแฟน ตรงปก 100% ไม่มัดจำ จ่ายหน้างาน (${dateStr})`;
        const metaDesc = `รวมน้องๆ ไซด์ไลน์${pName} ${profilesList.length}+ คน รับงานดูแล ฟิวแฟน รูปตรงปก ตัวจริงสวยกว่ารูป ไม่ต้องโอนมัดจำ ชำระเงินหน้างานเท่านั้น ปลอดภัย มีแอดมินดูแล พิกัด${pName}และพื้นที่ใกล้เคียง`;
        const canonicalUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        const schemaData = {
            "@context": "https://schema.org", "@type": "CollectionPage", "name": pageTitle, "description": metaDesc, "url": canonicalUrl,
            "mainEntity": { "@type": "ItemList", "itemListElement": profilesList.map((p, index) => ({ "@type": "ListItem", "position": index + 1, "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`, "name": `น้อง${p.name} ไซด์ไลน์${pName}` })) },
            "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN }, { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${pName}`, "item": canonicalUrl }] }
        };

        const profileCards = profilesList.map(p => {
            const imgUrl = p.imagePath ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
            const price = p.rate ? parseInt(p.rate.toString().replace(/\D/g,'')).toLocaleString() : 'สอบถาม';
            return `<a href="/sideline/${p.slug}" class="profile-card"><div class="card-img"><img src="${imgUrl}" alt="น้อง${p.name} ไซด์ไลน์${pName}" loading="lazy"></div><div class="card-info"><h3>น้อง${p.name}</h3><p class="loc">📍 ${p.location || pName}</p><div class="tags"><span>อายุ ${p.age || '20+'}</span><span class="price">${price}.-</span></div></div></a>`;
        }).join('');

        const html = `<!DOCTYPE html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title><meta name="description" content="${metaDesc}"><link rel="canonical" href="${canonicalUrl}"><meta name="robots" content="index, follow"><meta property="og:type" content="website"><meta property="og:url" content="${canonicalUrl}"><meta property="og:title" content="${pageTitle}"><meta property="og:description" content="${metaDesc}"><meta property="og:image" content="${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp"><script type="application/ld+json">${JSON.stringify(schemaData)}</script><style>body { margin: 0; font-family: 'Sarabun', sans-serif; background: #f3f4f6; color: #333; } .header { background: #db2777; color: white; padding: 20px; text-align: center; } h1 { margin: 0; font-size: 24px; } .subtitle { font-size: 14px; opacity: 0.9; margin-top: 5px; } .container { max-width: 800px; margin: 0 auto; padding: 20px; } .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; } @media(min-width: 600px) { .grid { grid-template-columns: repeat(3, 1fr); } } .profile-card { background: white; border-radius: 10px; overflow: hidden; text-decoration: none; color: inherit; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: block; transition: transform 0.2s; } .profile-card:hover { transform: translateY(-3px); } .card-img { width: 100%; aspect-ratio: 1/1; background: #eee; } .card-img img { width: 100%; height: 100%; object-fit: cover; } .card-info { padding: 10px; } .card-info h3 { margin: 0 0 5px 0; font-size: 16px; color: #db2777; } .loc { font-size: 12px; color: #666; margin: 0 0 8px 0; } .tags { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; } .price { color: #059669; } .seo-text { background: white; padding: 20px; border-radius: 10px; margin-top: 30px; font-size: 14px; line-height: 1.6; color: #555; } .seo-text h2 { color: #333; font-size: 18px; margin-bottom: 10px; }</style></head><body><div class="header"><h1>ไซด์ไลน์${pName}</h1><div class="subtitle">รับงานเอง ฟิวแฟน ไม่ผ่านเอเย่นต์</div></div><div class="container"><div class="grid">${profileCards || '<div style="grid-column: 1/-1; text-align: center; padding: 20px;">กำลังอัปเดตรายชื่อน้องๆ...</div>'}</div><div class="seo-text"><h2>บริการไซด์ไลน์${pName} รับงานฟิวแฟน อันดับ 1</h2><p>หากคุณกำลังมองหา <strong>ไซด์ไลน์${pName}</strong> ที่ไว้ใจได้ รูปตรงปก 100% ที่นี่เรารวบรวมน้องๆ นักศึกษา สาวสวย พริตตี้ รับงานเองในโซน${pName}และพื้นที่ใกล้เคียง (${pNameEng}) ไว้มากที่สุด</p><p>✅ <strong>จุดเด่นของเรา:</strong> ไม่ต้องโอนมัดจำก่อน จ่ายเงินหน้างานเท่านั้น ปลอดภัย สบายใจหายห่วง น้องๆ ทุกคนผ่านการตรวจสอบตัวตนแล้ว รับงานฟิวแฟน เอาใจเก่ง ไม่เร่งรีบ</p></div></div></body></html>`;
        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) { return context.next(); }
};