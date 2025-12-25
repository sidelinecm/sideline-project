import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const DOMAIN = "https://sidelinechiangmai.netlify.app";

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  if (!/bot|spider|crawl|facebook|twitter/i.test(userAgent)) return context.next(); 

  const url = new URL(request.url);
  const key = url.pathname.split('/').pop(); 

  try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data: prov } = await supabase.from('provinces').select('*').eq('key', key).maybeSingle();
      
      if (!prov) return context.next();

      // ดึง 30 คนล่าสุดเพื่อสร้างลิงก์ให้ Bot ไต่
      const { data: profiles } = await supabase
        .from('profiles')
        .select('name, slug')
        .eq('provinceKey', key)
        .limit(30);

      const listHtml = profiles?.map(p => `<li><a href="/sideline/${p.slug}">${p.name}</a></li>`).join('') || '';

      const html = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <title>รวมสาวไซด์ไลน์${prov.nameThai} รับงาน${prov.nameThai}</title>
        <meta name="description" content="ศูนย์รวมน้องๆไซด์ไลน์${prov.nameThai} คัดเด็ดๆ รับงานเอง ไม่ผ่านเอเย่นต์">
        <link rel="canonical" href="${DOMAIN}/location/${key}">
      </head>
      <body>
        <h1>ไซด์ไลน์${prov.nameThai}</h1>
        <ul>${listHtml}</ul>
        <a href="/">กลับหน้าหลัก</a>
      </body>
      </html>`;

      return new Response(html, {
        headers: { 
            "content-type": "text/html; charset=utf-8",
            "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
        }
      });
  } catch (e) { return context.next(); }
};
