import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot|whatsapp|line|applebot/i.test(userAgent);

  if (!isBot) return context.next();

  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const rawSlug = pathSegments[pathSegments.length - 1];

    if (!rawSlug) return context.next();

    const profileSlug = decodeURIComponent(rawSlug);
    const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*, provinces(nameThai, key)')
      .eq('slug', profileSlug)
      .maybeSingle();

    if (!profile) return new Response("Not Found", { status: 404 });

    const provinceName = profile.provinces?.nameThai || 'เชียงใหม่';
    const provinceKey = profile.provinces?.key || 'chiang-mai';
    const imageUrl = profile.imagePath 
      ? `${SUPABASE_URL}/storage/v1/object/public/profile-images/${profile.imagePath}` 
      : `https://sidelinechiangmai.netlify.app/images/default_og_image.jpg`;
    
    const pageUrl = `https://sidelinechiangmai.netlify.app/sideline/${encodeURIComponent(profile.slug)}`;
    const numericPrice = profile.rate ? profile.rate.toString().replace(/[^0-9]/g, '') : "1500";
    
    const title = `น้อง ${profile.name} ไซด์ไลน์${provinceName} รับงาน${provinceName} ตัวจริงตรงปก`;
    const description = `น้อง ${profile.name} อายุ ${profile.age || '?'} สัดส่วน ${profile.stats || '-'} พิกัด ${profile.location || provinceName} เรท ${profile.rate} บาท ปลอดภัย ไม่ผ่านเอเย่นต์ ดูรูปจริงคลิกเลย`;

    const jsonLdProduct = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": title,
      "image": imageUrl,
      "description": description,
      "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
      "offers": {
        "@type": "Offer",
        "url": pageUrl,
        "priceCurrency": "THB",
        "price": numericPrice,
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2026-12-31"
      },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "89" }
    };

    const html = `<!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>${title} | Sideline Chiangmai</title>
      <meta name="description" content="${description}">
      <link rel="canonical" href="${pageUrl}">
      <meta property="og:type" content="profile">
      <meta property="og:title" content="${title}">
      <meta property="og:image" content="${imageUrl}">
      <script type="application/ld+json">${JSON.stringify(jsonLdProduct)}</script>
      <style>
        body{font-family:sans-serif; padding:20px; line-height:1.6; max-width:800px; margin:0 auto; background:#f9f9f9;}
        article{background:#fff; padding:20px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.1);}
        h1{color:#d53f8c;}
        img{width:100%; max-width:500px; border-radius:10px;}
        .btn{display:inline-block; background:#06c755; color:#fff; padding:12px 24px; border-radius:50px; text-decoration:none; font-weight:bold;}
      </style>
    </head>
    <body>
      <article>
        <nav><a href="/">หน้าแรก</a> > <a href="/location/${provinceKey}">${provinceName}</a></nav>
        <h1>น้อง ${profile.name} (${provinceName})</h1>
        <img src="${imageUrl}" alt="น้อง ${profile.name}">
        <p><strong>พิกัด:</strong> ${profile.location}</p>
        <p><strong>เรท:</strong> ${profile.rate}</p>
        <p>${profile.description || '-'}</p>
        <div style="text-align:center;"><a href="https://line.me/ti/p/${profile.lineId}" class="btn">📲 แอดไลน์จองคิว</a></div>
      </article>
    </body>
    </html>`;

    const headers = {
      "Content-Type": "text/html; charset=utf-8",
      "Netlify-CDN-Cache-Control": "public, max-age=3600, durable", 
      "Cache-Control": "public, max-age=600"
    };

    return new Response(html, { headers });

  } catch (e) {
    return context.next();
  }
};
