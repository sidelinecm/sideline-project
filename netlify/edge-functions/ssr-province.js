// Edge SSR จังหวัด: Landing Page SEO + Rich Content + Supabase Integration (สำหรับ Netlify Edge Functions)
// ใช้กับ path: /province/:provinceKey
// ปรับปรุง: ครบถ้วน meta/og/schema (FAQ, Breadcrumb, LocalBusiness, Review, Organization)/content/directory/CTA

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- Global Constants (ควรกำหนดใน Environment Variables ใน Production) ---
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const TABLE_PROFILES = 'profiles';
const TABLE_PROVINCES = 'provinces';
const STORAGE_BUCKET = 'profile-images';
const DOMAIN_URL = "https://sidelinechiangmai.netlify.app";

// --- Schema Generation Helpers ---

// 1. FAQPage Schema
function genProvinceFAQSchema(provinceName) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `ไซด์ไลน์${provinceName}ตรงปกจริงไหม?`,
        "acceptedAnswer": {"@type":"Answer","text":`ทุกโปรไฟล์ในพื้นที่${provinceName}ตรวจสอบตัวจริง ไม่มีโกง ภาพตรงโปรไฟล์ 100%`}
      },
      {
        "@type":"Question",
        "name":`จองผ่าน LINE ได้เลยหรือไม่?`,
        "acceptedAnswer":{"@type":"Answer","text":`จองคิว LINE ตรงไปยังโปรไฟล์น้องใน ${provinceName} ไม่ต้องโอนก่อน จ่ายหน้างานเท่านั้น`}
      },
      {
        "@type":"Question",
        "name":`ไซด์ไลน์${provinceName}รับงานพื้นที่ไหนบ้าง?`,
        "acceptedAnswer":{"@type":"Answer","text":`ครอบคลุมทั่วจังหวัด${provinceName} และอำเภอใกล้เคียง`}
      },
      {
        "@type":"Question",
        "name":`รีวิวของลูกค้าจริงมีหรือไม่?`,
        "acceptedAnswer":{"@type":"Answer","text":`ทุกโปรไฟล์มีรีวิวลูกค้าจริง ตรวจสอบได้ก่อนจอง`}
      }
    ]
  }
}

// 2. BreadcrumbList Schema
function genBreadcrumbSchema(provinceKey, provinceName) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": DOMAIN_URL + "/" },
      { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${DOMAIN_URL}/province/${provinceKey}` }
    ]
  };
}

// 3. LocalBusiness Schema
function genLocalBusinessSchema(provinceName) {
  return {
    "@context":"https://schema.org",
    "@type":"LocalBusiness",
    "name":`ไซด์ไลน์${provinceName}`,
    "areaServed":provinceName,
    "telephone":"+66994238888",
    "address":{
      "@type":"PostalAddress",
      "addressLocality":provinceName,
      "postalCode":"50000",
      "addressCountry":"TH"
    }
  }
}

// 4. Review Schema (for rich result)
function genReviewSchema(provinceName) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "author": { "@type": "Person", "name": `ลูกค้าจริงจังหวัด${provinceName}` },
    "reviewBody": `จองน้องผ่านเว็บนี้ ตรงปก โปรไฟล์${provinceName} เชื่อถือได้ ไม่มีโกง จ่ายหน้างาน`
  };
}

// 5. Organization Schema (for brand identity)
function genOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SidelineChiangmai",
    "url": DOMAIN_URL,
    "logo": `${DOMAIN_URL}/images/logo.png`, // แนะนำให้เพิ่มภาพโลโก้
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+66994238888",
      "contactType": "Customer Service"
    }
  };
}


// --- Rendering Helpers ---

// Directory links for every province
function renderProvinceDirectory(allProvinces, currentKey) {
  return `<nav class="province-directory">
    <ul>${allProvinces.map(p => 
      `<li><a href="/province/${p.key}"${p.key === currentKey?' class="current"':''}>ไซด์ไลน์${p.nameThai||p.name}</a></li>`
    ).join('')}</ul></nav>`;
}

// Render profiles grid
function renderProfileCards(profiles, provinceName) {
  return profiles.slice(0, 16).map(p=>{
    const imagePath = p.imagePath || 'placeholder/default.webp'; // Placeholder
    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${imagePath}`;
    
    return `<article class="profile-card">
      <img src="${imageUrl}" alt="น้อง${p.name || p.slug} ไซด์ไลน์${provinceName}" width="200" height="250" loading="lazy">
      <h3>${p.name || p.slug}</h3>
      <ul>
        <li>${p.stats||''} ${p.age?`อายุ ${p.age} ปี`:''}</li>
        <li>เรท : ${p.rate||'สอบถาม'}</li>
        <li>เขต: ${p.location || provinceName}</li>
        <li>สถานะ : ${p.availability || 'สอบถามคิว'}</li>
      </ul>
      <a href="https://line.me/ti/p/ksLUWB89Y_" class="btn-main">จองคิว LINE</a>
      ${p.reviewText?`<blockquote class="profile-review">${p.reviewText} <footer>${p.reviewAuthor||""}</footer></blockquote>`:""}
    </article>`;
  }).join('');
}

// HTML Render for SSR province landing
function renderProvinceHTML({provinceKey, provinceName, profiles=[], allProvinces=[]}) {
  const pageTitle = `ไซด์ไลน์${provinceName} รับงานฟิวแฟน ตรงปก 100% | โปรไฟล์จริงอัปเดตล่าสุด`;
  const metaDescription = `รวมสาวไซด์ไลน์${provinceName} ฟิวแฟน รับงานตรงปก ไม่ต้องโอนก่อน โปรไฟล์ตรวจสอบจริง อัปเดตทุกวัน รีวิวลูกค้า เด่น เชื่อถือได้ ติดอันดับ Google ท้องถิ่น`;
  const ogImage = `${DOMAIN_URL}/images/og-${provinceKey}.jpg`;

  const faqSchema = genProvinceFAQSchema(provinceName);
  const breadcrumbSchema = genBreadcrumbSchema(provinceKey,provinceName);
  const businessSchema = genLocalBusinessSchema(provinceName);
  const reviewSchema = genReviewSchema(provinceName);
  const orgSchema = genOrganizationSchema();
  
  const allSchema = [faqSchema, breadcrumbSchema, businessSchema, reviewSchema, orgSchema];
  const schemaScripts = allSchema.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');

  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${['ไซด์ไลน์', 'รับงาน', provinceName, 'ฟิวแฟน', 'ตรงปก', 'รีวิว', 'เชียงใหม่', 'กรุงเทพ', 'ลำพูน', 'เชียงราย'].join(', ')}">
  <link rel="canonical" href="${DOMAIN_URL}/province/${provinceKey}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${DOMAIN_URL}/province/${provinceKey}">
  <meta property="og:type" content="website">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${metaDescription}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="robots" content="index, follow, max-image-preview:large">
  
  ${schemaScripts}

  <style>
    body { font-family: 'Prompt',sans-serif; background:#fff; color:#222; max-width:970px; margin:0 auto; padding:20px;}
    h1,h2,h3{font-weight:700; color:#d53f8c}
    .btn-main{display:inline-block;padding:0.7em 2em;border-radius:999em;background:linear-gradient(90deg,#ff69b4,#b832a9);color:#fff;font-weight:600;margin:1em 0;text-decoration:none;}
    .profiles-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2em;margin:1.5em 0;}
    .profile-card{background:#fff;border-radius:1em;box-shadow:0 4px 22px 0 rgba(213,63,140,0.08);padding:1.2em;min-height:330px;display:flex;flex-direction:column;}
    .profile-card img{border-radius:0.73em;margin-bottom:0.8em;width:100%;height:auto;object-fit:cover;}
    .profile-card ul{list-style:none;padding:0;margin:0.5em 0 1em 0;}
    .profile-review{background:#f9f7fa;border-radius:1em;padding:0.7em;margin:0.5em 0;font-size:0.95em;}
    .faq{margin:2em 0 2em 0;}
    dl dt{font-weight:bold;margin-top:1.1em;}
    dl dd{margin:0.23em 0 0.75em 0;}
    .province-directory{margin:1.3em 0;}
    .province-directory ul{display:flex;flex-wrap:wrap;gap:18px;padding:0;list-style:none;}
    .province-directory li{list-style:none;}
    .province-directory a{padding:0.5em 1.4em;border-radius:99em;background:#f6eafd;color:#b832a9;font-weight:600;text-decoration:none;}
    .province-directory a.current{background:#d53f8c;color:#fff;}
    footer{margin:2.3em 0 1.2em 0; color:#888;font-size:0.98em;text-align:center;}
    @media(max-width:700px){body{padding:8px;}.profiles-grid{gap:1em;}.province-directory ul{gap:7px;}}
  </style>
</head>
<body>
  ${renderProvinceDirectory(allProvinces, provinceKey)}
  <header>
    <h1>ไซด์ไลน์${provinceName} รับงานฟิวแฟน ตรงปก 100% รีวิวดีสุด</h1>
    <a href="https://line.me/ti/p/ksLUWB89Y_" class="btn-main">จองไซด์ไลน์${provinceName}ผ่าน LINE</a>
  </header>
  <section class="profiles-grid">
    ${renderProfileCards(profiles, provinceName)}
  </section>
  <section class="faq">
    <h2>คำถามที่พบบ่อยเกี่ยวกับไซด์ไลน์${provinceName}</h2>
    <dl>
      <dt>ไซด์ไลน์${provinceName}ตรงปกจริงหรือ?</dt>
      <dd>โปรไฟล์ทุกคนตรวจสอบตัวจริง ไม่มีภาพปลอม ไม่มีรีทัช ยืนยันก่อนขึ้นเว็บ</dd>
      <dt>ต้องโอนเงินก่อนหรือไม่?</dt>
      <dd>ไม่มีมัดจำ ไม่ต้องโอนก่อน จ่ายเงินเท่านั้นเมื่อเจอน้องจริง</dd>
      <dt>บริการพื้นที่ไหนบ้าง?</dt>
      <dd>ทุกเขตในจังหวัด${provinceName} และเขตใกล้เคียง</dd>
      <dt>รีวิวลูกค้าจริงมีหรือไม่?</dt>
      <dd>โปรไฟล์ทุกน้องมีรีวิวจริง ฐานลูกค้าหลายพันคน ทีมงานตรวจสอบ/อัปเดตทุกเดือน</dd>
    </dl>
  </section>
  <footer>
    © <span id="currentYear"></span> SidelineChiangmai | เว็บสายงานโดยทีมงานมืออาชีพ | โปรไฟล์จริงตรวจสอบได้ | เฉพาะ 20 ปีขึ้นไป
  </footer>
  <script>
    document.getElementById("currentYear").textContent = new Date().getFullYear();
  </script>
</body>
</html>
  `;
}

// --- Netlify Edge Function Handler ---
export default async (request, context) => {
  // 1. Bot Detection
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|baiduspider/i.test(userAgent);
  
  // ให้บอตเข้าถึงได้เท่านั้น (ถ้าต้องการให้ผู้ใช้ทั่วไปดูหน้า SSR/CSR แทน ให้เปลี่ยนเงื่อนไขเป็น if (!isBot) return context.next();)
  if (!isBot) return context.next(); 

  // 2. Path Parsing
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  if (pathSegments[0] !== "province" || !pathSegments[1]) return context.next();
  const provinceKey = pathSegments[1];

  // 3. Supabase Client Init
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 4. Get Province Data
  const { data: provinceData, error: provinceError } = await supabase
    .from(TABLE_PROVINCES)
    .select('*')
    .eq('key', provinceKey)
    .maybeSingle();

  if (provinceError || !provinceData) {
    // หากไม่พบจังหวัด ให้ปล่อยให้ context.next() ทำงาน
    return context.next(); 
  }
  const provinceName = provinceData.nameThai || provinceData.name || provinceKey;

  // 5. Get Directory and Profiles
  // ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกัน
  const [allProvincesRes, profilesRes] = await Promise.all([
    supabase.from(TABLE_PROVINCES).select('key,name,nameThai'),
    supabase.from(TABLE_PROFILES).select('*').eq('provinceKey', provinceKey)
  ]);
  
  const allProvinces = allProvincesRes.data || [];
  const profiles = profilesRes.data || [];

  // 6. Render HTML
  const html = renderProvinceHTML({
    provinceKey,
    provinceName,
    profiles: profiles,
    allProvinces: allProvinces
  });

  // 7. Return SSR Response
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "index, follow", 
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" 
    },
    status: 200
  });
};