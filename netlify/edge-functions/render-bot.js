import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot|whatsapp|line|applebot/i.test(userAgent);

  if (!isBot) return context.next();

  try {
    const DOMAIN = 'https://sidelinechiangmai.netlify.app';
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const rawSlug = pathSegments[pathSegments.length - 1];

    const supabase = createClient('https://hgzbgpbmymoiwjpaypvl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8');

    const { data: profile } = await supabase.from('profiles').select('*').eq('slug', decodeURIComponent(rawSlug)).single();
    if (!profile) return context.next();

    const imageUrl = profile.imagePath ? `https://hgzbgpbmymoiwjpaypvl.supabase.co/storage/v1/object/public/profile-images/${profile.imagePath}` : `${DOMAIN}/images/default_og_image.jpg`;

    const html = `<!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>น้อง ${profile.name} ไซด์ไลน์ ${profile.location} | Sideline Chiangmai</title>
      <meta name="description" content="น้อง ${profile.name} พิกัด ${profile.location} เรท ${profile.rate} ดูรูปและรายละเอียดงานเพิ่มเติมได้ที่นี่">
      <link rel="canonical" href="${DOMAIN}/sideline/${encodeURIComponent(profile.slug)}">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:type" content="product">
    </head>
    <body>
      <article>
        <h1>น้อง ${profile.name} (${profile.location})</h1>
        <img src="${imageUrl}" alt="${profile.name}" style="max-width:100%">
        <p>${profile.description}</p>
        <p>เรท: ${profile.rate}</p>
      </article>
    </body>
    </html>`;

    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (e) {
    return context.next();
  }
};
