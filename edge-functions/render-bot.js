import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 

export default async (request, context) => {
    const userAgent = request.headers.get('User-Agent') || '';
    if (!/bot|google|spider|facebook/i.test(userAgent)) return context.next(); 

    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    // ✅ แก้จุดตาย: decode กลับเป็นภาษาไทยเพื่อหาใน DB
    const profileSlug = decodeURIComponent(pathSegments[1]); 

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: p } = await supabase.from('profiles').select('*').eq('slug', profileSlug).maybeSingle();
    
    if (!p) return context.next();

    const title = `${p.name} ไซด์ไลน์ ${p.location} เรท ${p.rate} - Sideline Chiangmai`;
    const img = `https://hgzbgpbmymoiwjpaypvl.supabase.co/storage/v1/object/public/profile-images/${p.imagePath}`;

    const html = `<!DOCTYPE html><html lang="th"><head>
        <meta charset="utf-8"><title>${title}</title>
        <meta name="description" content="${p.name} รับงานไซด์ไลน์ สัดส่วน ${p.stats} ${p.quote || ''}">
        <meta property="og:image" content="${img}">
        <script type="application/ld+json">
        {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": "${p.name}",
          "image": "${img}",
          "description": "สาวไซด์ไลน์ ${p.location} ตรงปก",
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "88" }
        }
        </script>
    </head><body><h1>${p.name}</h1><img src="${img}"><p>${p.description}</p></body></html>`;

    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
};
