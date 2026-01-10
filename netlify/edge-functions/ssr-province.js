import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Configuration
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

const cache = { data: new Map(), lastFetch: new Map() };
const CACHE_TTL = 15 * 60 * 1000;

const sanitizeHTML = (str) => String(str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);

const getImageUrl = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/sidelinechiangmai-social-preview.webp`;
    const cleanPath = path.replace(/^(\.\.?\/)+/, '');
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${cleanPath}`;
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const provinceKey = decodeURIComponent(url.pathname.split('/').pop());

        if (!/^[a-zA-Z0-9ก-๙\-_]+$/.test(provinceKey)) return context.next();

        const cacheKey = `prov_${provinceKey}`;
        if (cache.data.has(cacheKey) && (Date.now() - cache.lastFetch.get(cacheKey) < CACHE_TTL)) {
            return new Response(cache.data.get(cacheKey), { headers: { "content-type": "text/html; charset=utf-8", "x-cache": "HIT" } });
        }

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const [provinceRes, profilesRes] = await Promise.all([
            supabase.from('provinces').select('nameThai, key').eq('key', provinceKey).maybeSingle(),
            supabase.from('profiles')
                .select('name, slug, age, rate, stats, imagePath, verified, location, created_at')
                .eq('provinceKey', provinceKey)
                .eq('active', true)
                .order('verified', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(60)
        ]);

        const province = provinceRes.data;
        const profiles = profilesRes.data || [];

        if (!province) return context.next();

        const thaiDate = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        
        // 🔥 SEO UPDATE: ปรับ Title/Desc ให้ตรงกับกลยุทธ์ GSC
        const title = `ไซด์ไลน์${province.nameThai} รับงาน${province.nameThai} ฟิวแฟน ไม่มัดจำ [อัปเดต ${thaiDate}]`;
        const description = `รวมรูปสาวไซด์ไลน์ ${province.nameThai} รับงานเอง ${province.nameThai} คัดคนสวย ตรงปก 100% ปลอดภัย ไม่ผ่านเอเย่นต์ ไม่ต้องโอนจอง จ่ายเงินหน้างานเท่านั้น อัปเดตใหม่ล่าสุด`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/province/${provinceKey}`;

        const profilesHtml = profiles.map(p => {
            const imgUrl = getImageUrl(p.imagePath);
            const price = p.rate ? parseInt(p.rate.toString().replace(/[^0-9]/g, '')).toLocaleString() : 'สอบถาม';
            return `
            <a href="/sideline/${p.slug}" class="profile-card">
                <div class="img-wrapper">
                    <img src="${imgUrl}" alt="น้อง${p.name} ${province.nameThai}" loading="lazy">
                    ${p.verified ? '<span class="badge-ver">✓ ยืนยัน</span>' : ''}
                </div>
                <div class="info">
                    <div class="name">น้อง${sanitizeHTML(p.name)} <span class="age">${p.age ? p.age+'ปี' : ''}</span></div>
                    <div class="meta">${p.location || province.nameThai}</div>
                    <div class="price">${price} ฿</div>
                </div>
            </a>`;
        }).join('');

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${profiles[0] ? getImageUrl(profiles[0].imagePath) : ''}">
    <meta property="og:type" content="website">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "${title}",
      "description": "${description}",
      "url": "${canonicalUrl}",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          ${profiles.map((p, index) => `{ "@type": "ListItem", "position": ${index + 1}, "url": "${CONFIG.DOMAIN}/sideline/${p.slug}" }`).join(',')}
        ]
      }
    }
    </script>
    <style>
        body { font-family: 'Prompt', sans-serif; margin: 0; background: #f3f4f6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 15px; }
        header { text-align: center; margin-bottom: 25px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        h1 { color: #db2777; margin: 0 0 5px 0; font-size: 22px; }
        .subtitle { color: #666; font-size: 14px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        @media (min-width: 600px) { .grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px) { .grid { grid-template-columns: repeat(4, 1fr); } }
        .profile-card { background: white; border-radius: 10px; overflow: hidden; text-decoration: none; color: inherit; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: block; }
        .img-wrapper { position: relative; aspect-ratio: 3/4; background: #eee; }
        .img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .badge-ver { position: absolute; bottom: 5px; right: 5px; background: #06c755; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
        .info { padding: 10px; }
        .name { font-weight: bold; font-size: 14px; color: #1f2937; }
        .age { color: #6b7280; font-weight: normal; }
        .meta { font-size: 11px; color: #9ca3af; margin-bottom: 5px; }
        .price { color: #db2777; font-weight: bold; font-size: 15px; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #999; font-size: 12px; }
        .btn-home { display: inline-block; background: #db2777; color: white; padding: 8px 20px; border-radius: 20px; text-decoration: none; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>ไซด์ไลน์${province.nameThai} รับงานเอง ไม่มัดจำ</h1>
            <div class="subtitle">อัปเดตล่าสุด: ${thaiDate} • ทั้งหมด ${profiles.length} คน</div>
        </header>
        <div class="grid">${profilesHtml}</div>
        <div class="footer">
            <a href="/" class="btn-home">🏠 กลับหน้าหลัก</a>
            <div>© 2026 Sideline Chiangmai - ข้อมูลตรงปก 100%</div>
        </div>
    </div>
</body>
</html>`;

        cache.data.set(cacheKey, html);
        cache.lastFetch.set(cacheKey, Date.now());

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "x-cache": "MISS" } });

    } catch (e) { return context.next(); }
};