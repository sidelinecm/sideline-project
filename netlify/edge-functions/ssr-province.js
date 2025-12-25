import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot|whatsapp|line|applebot/i.test(userAgent);

  if (!isBot) return context.next();

  try {
    const DOMAIN = 'https://sidelinechiangmai.netlify.app';
    const supabase = createClient('https://hgzbgpbmymoiwjpaypvl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8');
    const url = new URL(request.url);
    const path = url.pathname;

    // --- กรณีหน้าแรก (สำคัญที่สุดเพื่อให้ Google เจอหน้าอื่นๆ) ---
    if (path === '/' || path === '/index.html') {
      const { data: provinces } = await supabase.from('provinces').select('key, nameThai');
      const linksHtml = provinces.map(p => `<li><a href="/location/${p.key}">ไซด์ไลน์ ${p.nameThai}</a></li>`).join('');
      
      return new Response(`<!DOCTYPE html><html><head><title>ไซด์ไลน์เชียงใหม่ | รวมน้องๆ รับงานฟิวแฟน</title></head>
        <body><h1>สารบัญจังหวัด</h1><ul>${linksHtml}</ul></body></html>`, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // --- กรณีหน้าโปรไฟล์รายคน ---
    if (path.includes('/sideline/')) {
      const slug = decodeURIComponent(path.split('/').pop());
      const { data: p } = await supabase.from('profiles').select('*').eq('slug', slug).single();
      if (!p) return context.next();

      const img = `https://hgzbgpbmymoiwjpaypvl.supabase.co/storage/v1/object/public/profile-images/${p.imagePath}`;
      
      return new Response(`<!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <title>น้อง ${p.name} ไซด์ไลน์ ${p.location} | Sideline Chiangmai</title>
        <meta name="description" content="น้อง ${p.name} พิกัด ${p.location} เรท ${p.rate} ดูรูปงานจริงได้ที่นี่">
        <meta property="og:image" content="${img}">
        <script type="application/ld+json">
        {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": "${p.name}",
          "image": "${img}",
          "description": "${p.description}",
          "offers": { "@type": "Offer", "price": "${p.rate}", "priceCurrency": "THB" }
        }
        </script>
      </head>
      <body><h1>${p.name}</h1><img src="${img}"><p>${p.description}</p><a href="/">กลับหน้าหลัก</a></body></html>`, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return context.next();
  } catch (e) {
    return context.next();
  }
};