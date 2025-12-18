import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';

  try {
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot/i.test(userAgent);
    
    if (!isBot) return context.next(); 

    const url = new URL(request.url);
    const key = url.pathname.split('/').filter(Boolean).pop(); 
    if (!key) return context.next();

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: prov } = await supabase.from('provinces').select('*').eq('key', key).maybeSingle();
    if (!prov) return context.next();

    const { data: profiles } = await supabase.from('profiles').select('name, slug, location, rate').eq('provinceKey', key).order('created_at', { ascending: false }).limit(100);

    const listHtml = profiles?.map(p => `
      <li style="margin-bottom: 25px; list-style: none; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px;">
          <h2 style="margin: 0; font-size: 1.3rem;">
            <a href="${DOMAIN}/sideline/${p.slug}" style="color: #d53f8c; text-decoration: none;">น้อง ${p.name} ไซด์ไลน์${prov.nameThai} พิกัด ${p.location || prov.nameThai}</a>
          </h2>
          <p style="color: #555; margin: 8px 0;">เรทราคาเริ่มต้น: ${p.rate || 'สอบถาม'} บาท | การันตีรูปจริง 100% ดูโปรไฟล์คลิกเลย</p>
      </li>`).join('') || '<li>ขออภัย ขณะนี้ยังไม่มีข้อมูลในพื้นที่นี้</li>';

    const html = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>รวมสาวไซด์ไลน์${prov.nameThai} งานดี ตัวจริงตรงปก - Sideline Chiangmai</title>
      <meta name="description" content="ศูนย์รวมน้องๆ ไซด์ไลน์${prov.nameThai} รับงาน${prov.nameThai} พิกัด ${prov.nameThai} คัดสรรเฉพาะคนสวย งานดี ไม่ผ่านเอเย่นต์ อัปเดตล่าสุด">
      <link rel="canonical" href="${DOMAIN}/location/${key}">
      <meta name="robots" content="index, follow">
    </head>
    <body style="font-family: sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; color: #333; background: #fff;">
      <header style="border-bottom: 3px solid #fdf2f8; padding-bottom: 10px;">
          <h1 style="color: #d53f8c;">ไซด์ไลน์${prov.nameThai} (Sideline ${prov.nameThai})</h1>
          <p>พบกับน้องๆ รับงานใน <strong>${prov.nameThai}</strong> ที่ดีที่สุด การันตีคุณภาพและความพึงพอใจ</p>
      </header>
      <main style="margin-top: 30px;">
          <ul style="padding: 0;">${listHtml}</ul>
      </main>
      <footer style="margin-top: 50px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; color: #999;">
          <p>© ${new Date().getFullYear()} <a href="${DOMAIN}/" style="color: #999;">Sideline Chiangmai</a> - แหล่งรวมสาวไซด์ไลน์คุณภาพ</p>
      </footer>
    </body>
    </html>`;

    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
  } catch (e) { return context.next(); }
};