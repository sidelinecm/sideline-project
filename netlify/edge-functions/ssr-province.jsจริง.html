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
    
    // ดึงข้อมูลจังหวัด
    const { data: prov } = await supabase.from('provinces').select('*').eq('key', key).maybeSingle();
    if (!prov) return context.next();

    // ดึงข้อมูลน้องๆ ในจังหวัดนั้น
    const { data: profiles } = await supabase
        .from('profiles')
        .select('name, slug, location, rate, imagePath, age')
        .eq('provinceKey', key)
        .order('created_at', { ascending: false })
        .limit(50);

    // สร้างรายการ ItemList Schema (Structured Data สำหรับหน้ารวม)
    const itemListElement = profiles?.map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${DOMAIN}/sideline/${p.slug}`,
      "name": `น้อง ${p.name}`
    })) || [];

    const jsonLdList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": itemListElement
    };

    const listHtml = profiles?.map(p => {
        const imgUrl = p.imagePath 
            ? `${SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}`
            : `${DOMAIN}/images/default_og_image.jpg`;
        
        return `
      <li style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; display: flex; gap: 15px; align-items: start;">
          <div style="flex-shrink: 0;">
            <img src="${imgUrl}" alt="น้อง ${p.name} ไซด์ไลน์${prov.nameThai}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
          </div>
          <div>
            <h2 style="margin: 0; font-size: 1.2rem;">
                <a href="${DOMAIN}/sideline/${p.slug}" style="color: #d53f8c; text-decoration: none;">น้อง ${p.name}</a>
            </h2>
            <div style="color: #666; font-size: 0.9rem; margin: 5px 0;">
                <span style="background: #fdf2f8; padding: 2px 8px; border-radius: 4px; color: #db2777;">${prov.nameThai}</span>
                <span style="font-weight:bold;">฿${p.rate}</span>
            </div>
            <p style="font-size: 0.8rem; color: #888; margin: 0;">พิกัด: ${p.location || prov.nameThai}</p>
          </div>
      </li>`;
    }).join('') || '<li>ยังไม่มีข้อมูลในโซนนี้</li>';

    const html = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>รวมสาวไซด์ไลน์${prov.nameThai} งานดี ตัวจริงตรงปก ล่าสุด | Sideline Chiangmai</title>
      <meta name="description" content="ศูนย์รวมน้องๆ ไซด์ไลน์${prov.nameThai} รับงาน${prov.nameThai} พิกัด ${prov.nameThai} อัปเดตใหม่ล่าสุด คัดสรรเฉพาะคนสวย งานดี ไม่ผ่านเอเย่นต์ ดูรูปและราคาเลย">
      <link rel="canonical" href="${DOMAIN}/location/${key}">
      
      <meta property="og:title" content="ไซด์ไลน์${prov.nameThai} - รวมน้องๆ รับงาน${prov.nameThai}">
      <meta property="og:description" content="รวมน้องๆ รับงาน${prov.nameThai} คัดเกรดพรีเมียม มีรูปจริงให้ดู">
      <meta property="og:image" content="${DOMAIN}/images/default_og_image.jpg">
      <meta property="og:type" content="website">

      <script type="application/ld+json">${JSON.stringify(jsonLdList)}</script>

      <style>
        body{font-family:-apple-system, sans-serif; padding:20px; max-width:800px; margin:0 auto; color:#333;}
        h1{ color: #d53f8c; border-bottom: 2px solid #fce7f3; padding-bottom: 10px;}
        ul{padding:0;list-style:none}
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <nav style="margin-bottom: 20px; font-size: 0.9rem;">
        <a href="/" style="text-decoration:none; color:#666;">🏠 หน้าแรก</a> &gt; <span>${prov.nameThai}</span>
      </nav>
      <h1>ไซด์ไลน์${prov.nameThai}</h1>
      <p>รวมรายชื่อน้องๆ รับงาน ${prov.nameThai} อัปเดตล่าสุด คัดคนสวย นิสัยดี เป็นกันเอง</p>
      <ul>${listHtml}</ul>
    </body>
    </html>`;

    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
  } catch (e) { 
      console.error(e);
      return context.next(); 
  }
};