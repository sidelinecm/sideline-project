import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 

export default async (request, context) => {
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /bot|spider|crawl|facebook|twitter/i.test(userAgent);
    if (!isBot) return context.next(); 

    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    // ✅ สำคัญ: ต้อง decode ภาษาไทยกลับมาเพื่อหาใน Database
    const profileSlug = decodeURIComponent(pathSegments[1]); 
    
    if (!profileSlug) return context.next();

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: p } = await supabase.from('profiles').select('*').eq('slug', profileSlug).maybeSingle();
        if (!p) return context.next();

        const title = `${p.name} ไซด์ไลน์ ${p.location} ${p.age} ปี - Sideline Chiangmai`;
        const desc = `${p.name} รับงานไซด์ไลน์ ${p.location} สัดส่วน ${p.stats} เรท ${p.rate} ${p.quote || ''} ดูรูปจริงและข้อมูลติดต่อได้ที่นี่`;
        const imgUrl = `https://hgzbgpbmymoiwjpaypvl.supabase.co/storage/v1/object/public/profile-images/${p.imagePath}`;

        const html = `
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <meta name="description" content="${desc}">
            <meta property="og:title" content="${title}">
            <meta property="og:description" content="${desc}">
            <meta property="og:image" content="${imgUrl}">
            <link rel="canonical" href="${url.href}">
            <script type="application/ld+json">
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "${p.name}",
              "image": "${imgUrl}",
              "description": "${desc}",
              "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "${Math.floor(Math.random() * 50) + 10}"
              }
            }
            </script>
        </head>
        <body>
            <h1>${p.name}</h1>
            <img src="${imgUrl}" alt="${p.altText || p.name}">
            <p>อายุ: ${p.age} สัดส่วน: ${p.stats} เรท: ${p.rate}</p>
            <p>พิกัด: ${p.location}</p>
            <article>${p.description || ''}</article>
            <footer>ติดต่อ: ${p.lineId}</footer>
        </body>
        </html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) { return context.next(); }
};
