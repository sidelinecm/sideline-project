import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';

  try {
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot|whatsapp|line/i.test(userAgent);
    
    if (!isBot) return context.next(); 

    const url = new URL(request.url);
    const key = url.pathname.split('/').filter(Boolean).pop(); 
    if (!key) return context.next();

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: prov } = await supabase.from('provinces').select('*').eq('key', key).maybeSingle();
    if (!prov) return context.next();

    const { data: profiles } = await supabase.from('profiles').select('name, slug, location, rate').eq('provinceKey', key).order('created_at', { ascending: false }).limit(100);

    const listHtml = profiles?.map(p => `
      <li>
          <h2><a href="${DOMAIN}/sideline/${p.slug}">น้อง ${p.name} ไซด์ไลน์${prov.nameThai}</a></h2>
          <p>พิกัด ${p.location || prov.nameThai} | เรท ${p.rate}</p>
      </li>`).join('') || '<li>ยังไม่มีข้อมูล</li>';

    // เพิ่มรูป Default สำหรับแชร์หน้าจังหวัด
    const ogImage = `${DOMAIN}/images/default_og_image.jpg`;

    const html = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>รวมสาวไซด์ไลน์${prov.nameThai} งานดี ตัวจริงตรงปก - Sideline Chiangmai</title>
      <meta name="description" content="ศูนย์รวมน้องๆ ไซด์ไลน์${prov.nameThai} รับงาน${prov.nameThai} พิกัด ${prov.nameThai} คัดสรรเฉพาะคนสวย งานดี ไม่ผ่านเอเย่นต์">
      <link rel="canonical" href="${DOMAIN}/location/${key}">
      
      <meta property="og:title" content="ไซด์ไลน์${prov.nameThai} - Sideline Chiangmai">
      <meta property="og:description" content="รวมน้องๆ รับงาน${prov.nameThai} คัดเกรดพรีเมียม">
      <meta property="og:image" content="${ogImage}">
      <meta property="og:type" content="website">

      <style>body{font-family:sans-serif;padding:20px;max-width:800px;margin:0 auto}a{color:#d53f8c;text-decoration:none}li{margin-bottom:15px;border-bottom:1px solid #eee;padding-bottom:10px}</style>
    </head>
    <body>
      <h1>ไซด์ไลน์${prov.nameThai}</h1>
      <ul>${listHtml}</ul>
    </body>
    </html>`;

    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
  } catch (e) { return context.next(); }
};