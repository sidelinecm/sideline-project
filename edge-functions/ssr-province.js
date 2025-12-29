import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 

export default async (request, context) => {
    const userAgent = request.headers.get('User-Agent') || '';
    if (!/bot|google|spider|crawl|facebook|twitter/i.test(userAgent)) return context.next(); 

    try {
        const url = new URL(request.url);
        const key = url.pathname.split('/').pop(); 

        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // ดึงข้อมูลจังหวัด
        const { data: prov } = await supabase.from('provinces').select('*').eq('key', key).maybeSingle();
        if (!prov) return context.next();

        // ดึงรายชื่อน้องๆ ในจังหวัดนั้น
        const { data: profiles } = await supabase.from('profiles').select('name, slug, location').eq('provinceKey', key).limit(100);

        const title = `รวมสาวไซด์ไลน์${prov.nameThai} น้องๆ รับงาน${prov.nameThai} ตัวจริง ตรงปก`;
        const description = `ศูนย์รวมน้องๆ ไซด์ไลน์จังหวัด${prov.nameThai} คัดเกรดพรีเมียม พิกัด ${prov.nameThai} และพื้นที่ใกล้เคียง ดูโปรไฟล์ รูปจริง ไม่ต้องโอนมัดจำ`;

        const listHtml = profiles?.map(p => {
            const safeLink = `/sideline/${encodeURIComponent(p.slug)}`;
            return `<li><a href="${safeLink}">${p.name} (${p.location || prov.nameThai})</a></li>`;
        }).join('') || '<li>ขออภัย ยังไม่มีข้อมูลในจังหวัดนี้</li>';

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        ${profiles?.map((p, i) => `{
          "@type": "ListItem",
          "position": ${i + 1},
          "url": "https://sidelinechiangmai.netlify.app/sideline/${encodeURIComponent(p.slug)}"
        }`).join(',')}
      ]
    }
    </script>
</head>
<body>
    <h1>รายชื่อน้องๆ ไซด์ไลน์ ${prov.nameThai}</h1>
    <p>${description}</p>
    <ul>${listHtml}</ul>
    <hr>
    <a href="/">🏠 กลับหน้าหลัก</a>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) { 
        return context.next(); 
    }
};