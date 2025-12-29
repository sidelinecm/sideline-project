import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /bot|spider|crawl|facebook|twitter|whatsapp/i.test(userAgent);

  if (!isBot) return context.next(); 

  try {
    const url = new URL(request.url);
    const provinceKey = decodeURIComponent(url.pathname.split('/').pop()); 

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // ดึงข้อมูลจังหวัด
    const { data: provinceData } = await supabase
      .from('provinces')
      .select('*')
      .eq('key', provinceKey)
      .maybeSingle();

    if (!provinceData) return context.next();

    // ดึงรายชื่อน้องๆ 100 คนล่าสุดในจังหวัดนั้นๆ
    const { data: profiles } = await supabase
      .from('profiles')
      .select('name, slug')
      .eq('provinceKey', provinceKey)
      .limit(100);

    const listHtml = profiles?.map(p => {
      const safeSlug = encodeURIComponent(p.slug);
      return `<li><a href="/sideline/${safeSlug}">${p.name}</a></li>`;
    }).join('') || '<li>ไม่มีข้อมูล</li>';

    const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>รวมสาวไซด์ไลน์${provinceData.nameThai} รับงาน${provinceData.nameThai} ตัวจริง</title>
  <meta name="description" content="ศูนย์รวมน้องๆ ไซด์ไลน์จังหวัด${provinceData.nameThai} คัดเกรดพรีเมียม รูปจริง ตรงปก ทุกคน">
</head>
<body>
  <h1>รายชื่อไซด์ไลน์ ${provinceData.nameThai}</h1>
  <ul>
    ${listHtml}
  </ul>
  <hr>
  <a href="/">🏠 กลับหน้าหลัก</a>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });

  } catch (error) {
    return context.next();
  }
};