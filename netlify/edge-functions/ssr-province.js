// netlify/edge-functions/ssr-province.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const TABLE_PROFILES = 'profiles';
const TABLE_PROVINCES = 'provinces';
const STORAGE_BUCKET = 'profile-images';
const DOMAIN_URL = "https://sidelinechiangmai.netlify.app";

function genCollectionSchema(provinceName, count) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `รวมไซด์ไลน์${provinceName}`,
        "description": `ศูนย์รวมน้องๆไซด์ไลน์${provinceName} รับงานฟิวแฟน คัดเด็ดๆ`,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": count > 0 ? count * 15 : 150,
            "bestRating": "5"
        }
    };
}

function renderProvinceHTML({provinceKey, provinceData, profiles=[], allProvinces=[]}) {
  const provinceName = provinceData.nameThai || provinceData.name || provinceKey;
  const dbDescription = provinceData.description; 
  const pageTitle = `ไซด์ไลน์${provinceName} รับงาน${provinceName} ฟิวแฟน ตรงปก 100% | อัปเดตล่าสุด`;
  const metaDescription = dbDescription || `รวมสาวไซด์ไลน์${provinceName} พิกัดยอดฮิต รับงานเอง ไม่ผ่านเอเย่นต์ รูปตัวจริง ${profiles.length} คน พร้อมให้บริการ ปลอดภัย เชื่อถือได้`;
  const h1Text = `ไซด์ไลน์${provinceName} รับงานฟิวแฟน`;

  const ogImage = profiles.length > 0 && profiles[0].imagePath 
    ? `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profiles[0].imagePath}`
    : `${DOMAIN_URL}/images/og-${provinceKey}.jpg`;

  const collectionSchema = genCollectionSchema(provinceName, profiles.length);
  
  const profileCards = profiles.slice(0, 20).map(p => {
      const img = p.imagePath ? `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${p.imagePath}` : '/images/placeholder.webp';
      const alt = p.altText || `น้อง${p.name} ไซด์ไลน์${provinceName}`;
      return `
        <div class="card">
            <a href="/sideline/${p.slug}">
                <img src="${img}" alt="${alt}" loading="lazy">
                <div class="card-info">
                    <h3>${p.name}</h3>
                    <p>⭐ ${p.rate || 'สอบถาม'}</p>
                    <span class="btn">ดูโปรไฟล์</span>
                </div>
            </a>
        </div>
      `;
  }).join('');

  const navLinks = allProvinces.map(p => `<a href="/location/${p.key}" class="${p.key===provinceKey?'active':''}">ไซด์ไลน์${p.nameThai}</a>`).join(' ');

  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDescription}">
  <link rel="canonical" href="${DOMAIN_URL}/location/${provinceKey}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:image" content="${ogImage}">
  <script type="application/ld+json">${JSON.stringify(collectionSchema)}</script>
  <style>
    body{font-family:'Prompt',sans-serif;margin:0;padding:0;background:#f8f9fa;color:#333}
    header{background:#fff;padding:20px;text-align:center;box-shadow:0 2px 5px rgba(0,0,0,0.05)}
    h1{color:#d53f8c;margin:0;font-size:1.8rem}
    .container{max-width:1000px;margin:20px auto;padding:0 15px}
    .nav-scroller{overflow-x:auto;white-space:nowrap;padding-bottom:15px;margin-bottom:20px}
    .nav-scroller a{display:inline-block;padding:8px 15px;margin-right:8px;background:#fff;border-radius:20px;text-decoration:none;color:#555;border:1px solid #eee}
    .nav-scroller a.active{background:#d53f8c;color:#fff;border-color:#d53f8c}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:15px}
    .card{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)}
    .card img{width:100%;aspect-ratio:3/4;object-fit:cover}
    .card-info{padding:10px;text-align:center}
    .card-info h3{margin:0 0 5px 0;font-size:1rem}
    .card-info p{margin:0 0 10px 0;color:#06c755;font-weight:bold}
    .btn{background:#d53f8c;color:#fff;padding:5px 15px;border-radius:15px;font-size:0.8rem;text-decoration:none;display:inline-block;margin-top:5px;}
    .seo-text{background:#fff;padding:20px;margin-top:30px;border-radius:10px;font-size:0.9rem;color:#666}
  </style>
</head>
<body>
  <header>
    <h1>${h1Text}</h1>
    <p style="font-size:0.9rem;color:#666;margin-top:5px;">${profiles.length} โปรไฟล์ว่างพร้อมรับงาน</p>
  </header>
  <div class="container">
    <div class="nav-scroller">${navLinks}</div>
    <div class="grid">${profileCards}</div>
    <div class="seo-text">
        <h2>บริการไซด์ไลน์${provinceName} ครบวงจร</h2>
        <p>${metaDescription}</p>
        <p>หากคุณกำลังมองหา <strong>ไซด์ไลน์${provinceName}</strong> ที่นี่คือแหล่งรวมที่เยอะที่สุด</p>
    </div>
  </div>
</body>
</html>`;
}

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|baiduspider/i.test(userAgent);
  if (!isBot) return context.next(); 

  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  if (pathSegments[0] !== "location" && pathSegments[0] !== "province") return context.next();
  const provinceKey = pathSegments[1];

  try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      const { data: provinceData } = await supabase
        .from(TABLE_PROVINCES)
        .select('*')
        .eq('key', provinceKey)
        .maybeSingle();

      if (!provinceData) return context.next();

      // 🚀 OPTIMIZATION: ดึงเฉพาะคอลัมน์ที่จำเป็น
      const [allProvincesRes, profilesRes] = await Promise.all([
        supabase.from(TABLE_PROVINCES).select('key,name,nameThai'),
        supabase.from(TABLE_PROFILES)
          .select('name, slug, imagePath, altText, rate, provinceKey, isfeatured') // ลดขนาด Payload
          .eq('provinceKey', provinceKey)
          .order('isfeatured', {ascending: false})
      ]);

      const html = renderProvinceHTML({
        provinceKey,
        provinceData,
        profiles: profilesRes.data || [],
        allProvinces: allProvincesRes.data || []
      });

      return new Response(html, {
        headers: { 
            "content-type": "text/html; charset=utf-8", 
            "x-robots-tag": "index, follow",
            "Cache-Control": "public, max-age=600, s-maxage=600"
        },
        status: 200
      });
  } catch (e) {
      return context.next();
  }
};