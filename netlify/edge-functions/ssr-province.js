import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export default async (request, context) => {
  const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';

  try {
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot/i.test(userAgent);
    
    // ถ้าไม่ใช่ Bot ให้ข้ามไป
    if (!isBot) return context.next(); 

    const url = new URL(request.url);
    const key = url.pathname.split('/').filter(Boolean).pop(); 
    if (!key) return context.next();

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // ดึงข้อมูลจังหวัด
    const { data: prov } = await supabase.from('provinces').select('*').eq('key', key).maybeSingle();
    if (!prov) return context.next();

    // ดึง 100 คนล่าสุด (เพิ่มจากเดิม 30 เพื่อให้ Bot เก็บข้อมูลได้เยอะขึ้นในครั้งเดียว)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('name, slug, location, rate')
      .eq('provinceKey', key)
      .order('created_at', { ascending: false })
      .limit(100);

    const profileListHtml = profiles?.map(p => `
      <li style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; list-style: none;">
          <a href="${DOMAIN}/sideline/${p.slug}" style="font-size: 1.25rem; font-weight: bold; color: #d53f8c; text-decoration: none;">
              น้อง ${p.name} - ไซด์ไลน์${prov.nameThai} พิกัด ${p.location || prov.nameThai}
          </a>
          <p style="color: #666; margin: 5px 0;">เรทราคาเริ่มต้น: ${p.rate || 'สอบถาม'} | การันตีรูปจริงตรงปก</p>
      </li>`).join('') || '<li>ขณะนี้ยังไม่มีข้อมูลโปรไฟล์ในพื้นที่นี้</li>';

    const html = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>รวมสาวไซด์ไลน์${prov.nameThai} รับงาน${prov.nameThai} ตัวจริงตรงปก - Sideline Chiangmai</title>
      <meta name="description" content="ศูนย์รวมน้องๆ ไซด์ไลน์${prov.nameThai} คัดคนสวย รับงานเอง ไม่ผ่านเอเย่นต์ พิกัด${prov.nameThai} อัปเดตใหม่ล่าสุด">
      <link rel="canonical" href="${DOMAIN}/location/${key}">
      <meta name="robots" content="index, follow">
    </head>
    <body style="font-family: sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; color: #333;">
      <header>
          <h1 style="color: #d53f8c;">ไซด์ไลน์${prov.nameThai} (Sideline ${prov.nameThai})</h1>
          <p>พบกับรายการน้องๆ รับงานในพื้นที่ <strong>${prov.nameThai}</strong> ที่ดีที่สุด คัดสรรคุณภาพเพื่อคุณ</p>
      </header>
      <hr style="border: 0; border-top: 2px solid #fdf2f8; margin: 20px 0;">
      <main>
          <ul style="padding: 0;">${profileListHtml}</ul>
      </main>
      <footer style="margin-top: 40px; text-align: center; color: #888;">
          <p>© ${new Date().getFullYear()} Sideline Chiangmai - <a href="${DOMAIN}/">กลับหน้าแรก</a></p>
      </footer>
    </body>
    </html>`;

    return new Response(html, {
      headers: { 
          "content-type": "text/html; charset=utf-8",
          "Netlify-CDN-Cache-Control": "public, max-age=3600, durable"
      }
    });
  } catch (error) {
    return context.next(); 
  }
};