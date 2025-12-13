import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
// ✅ FIX: เปลี่ยนชื่อ Key ให้ตรงกับที่ตั้งใน Netlify แล้ว
const SUPABASE_KEY_ENV_NAME = 'SUPABASE_ANON_KEY'; 
const DOMAIN = "https://sidelinechiangmai.netlify.app";

export default async (request, context) => {
  // ดึง Key จาก Environment Variable ที่ชื่อ SUPABASE_ANON_KEY
  const SUPABASE_ANON_KEY = context.env[SUPABASE_KEY_ENV_NAME]; 
  
  if (!SUPABASE_ANON_KEY) {
      console.error("CRITICAL: Supabase Key not found in Env Vars for SSR-Province.");
      return context.next(); 
  }

  const userAgent = request.headers.get('User-Agent') || '';
  if (!/bot|spider|crawl|facebook|twitter/i.test(userAgent)) return context.next(); 

  const url = new URL(request.url);
  const key = url.pathname.split('/').pop(); 

  try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data: prov } = await supabase.from('provinces').select('*').eq('key', key).maybeSingle();
      
      if (!prov) return context.next();

      // ดึง 30 คนล่าสุดเพื่อสร้างลิงก์ให้ Bot ไต่ (Internal Linking)
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
            "Cache-Control": "public, max-age=600", 
            "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
        }
      });
  } catch (e) { 
      console.error("SSR Province Error:", e);
      return context.next(); 
  }
};