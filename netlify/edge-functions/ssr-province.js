import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const TABLE_PROFILES = 'profiles';
const TABLE_PROVINCES = 'provinces';
const DOMAIN_URL = "https://sidelinechiangmai.netlify.app";

function genCollectionSchema(provinceName, count) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `รวมไซด์ไลน์${provinceName}`,
        "description": `ศูนย์รวมน้องๆไซด์ไลน์${provinceName} รับงานฟิวแฟน คัดเด็ดๆ`,
        "numberOfItems": count
    };
}

function renderProvinceHTML({provinceKey, provinceData, profiles}) {
  const provinceName = provinceData.nameThai || provinceData.name || provinceKey;
  const pageTitle = `ไซด์ไลน์${provinceName} รับงาน${provinceName} ฟิวแฟน | อัปเดตล่าสุด`;
  const metaDescription = `รวมน้องๆ ไซด์ไลน์ ${provinceName} รับงานเอง ไม่ผ่านเอเย่นต์ ${profiles.length} คน พร้อมให้บริการ รูปตัวจริง ปลอดภัย`;

  const profileLinks = profiles.map(p => `
    <li>
        <a href="/sideline/${p.slug}">
            <strong>${p.name}</strong> - ${p.rate || 'สอบถาม'}
        </a>
    </li>
  `).join('');

  const collectionSchema = genCollectionSchema(provinceName, profiles.length);
  
  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDescription}">
  <link rel="canonical" href="${DOMAIN_URL}/location/${provinceKey}">
  <meta property="og:title" content="${pageTitle}">
  <script type="application/ld+json">${JSON.stringify(collectionSchema)}</script>
  <style>
    body{font-family:sans-serif;padding:20px;line-height:1.6}
    h1{color:#d53f8c}
    ul{list-style:none;padding:0}
    li{margin:10px 0;border-bottom:1px solid #eee;padding-bottom:5px}
    a{text-decoration:none;color:#333;font-size:1.1em}
    a:hover{color:#d53f8c}
  </style>
</head>
<body>
  <header>
    <h1>${provinceName} (${profiles.length} คน)</h1>
    <p>${metaDescription}</p>
  </header>
  <main>
    <ul>${profileLinks}</ul>
  </main>
  <footer>
    <a href="/">⬅️ กลับหน้าหลัก</a>
  </footer>
</body>
</html>`;
}

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|baiduspider/i.test(userAgent);
  
  if (!isBot) return context.next(); 

  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const provinceKey = pathSegments[1];

  try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      const { data: provinceData } = await supabase
        .from(TABLE_PROVINCES)
        .select('*')
        .eq('key', provinceKey)
        .maybeSingle();

      if (!provinceData) return context.next();

      // ดึงแค่ 20 คนล่าสุดเพื่อทำ Listing ให้ Bot
      const { data: profiles } = await supabase
        .from(TABLE_PROFILES)
        .select('name, slug, rate')
        .eq('provinceKey', provinceKey)
        .order('isfeatured', {ascending: false})
        .limit(20);

      const html = renderProvinceHTML({
        provinceKey,
        provinceData,
        profiles: profiles || []
      });

      return new Response(html, {
        headers: { 
            "content-type": "text/html; charset=utf-8", 
            "x-robots-tag": "index, follow",
            "Cache-Control": "public, max-age=600",
            "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
        },
        status: 200
      });
  } catch (e) {
      return context.next();
  }
};