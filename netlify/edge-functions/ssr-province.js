import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';

  try {
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot|whatsapp|line|applebot/i.test(userAgent);
    
    if (!isBot) return context.next(); 

    const url = new URL(request.url);
    const key = url.pathname.split('/').filter(Boolean).pop(); 
    if (!key) return context.next();

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: prov } = await supabase.from('provinces').select('*').eq('key', key).single();

    if (!prov) return context.next();

    const html = `<!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>ไซด์ไลน์${prov.nameThai} | รวมน้องๆ รับงาน${prov.nameThai} ตรงปกไม่โอนก่อน</title>
      <meta name="description" content="รวมน้องๆ ไซด์ไลน์${prov.nameThai} รับงาน${prov.nameThai} พิกัด ${prov.nameThai} อัปเดตใหม่ล่าสุด คัดสรรเฉพาะคนสวย งานดี ไม่ผ่านเอเย่นต์">
      <link rel="canonical" href="${DOMAIN}/location/${key}">
      <meta property="og:title" content="ไซด์ไลน์${prov.nameThai} - Sideline Chiangmai">
      <meta property="og:type" content="website">
      <meta property="og:url" content="${DOMAIN}/location/${key}">
      <style>
        body{font-family:sans-serif; padding:20px; max-width:800px; margin:0 auto;}
        h1{color:#db2777;}
      </style>
    </head>
    <body>
      <nav><a href="/">หน้าแรก</a> > <span>${prov.nameThai}</span></nav>
      <h1>น้องๆ ไซด์ไลน์ ในพื้นที่ ${prov.nameThai}</h1>
      <p>รายการน้องๆ รับงานอิสระ เด็กเอ็น พิกัด${prov.nameThai} ทั้งหมด</p>
    </body>
    </html>`;

    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (e) {
    return context.next();
  }
};