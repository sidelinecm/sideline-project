import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async (request, context) => {
  const url = new URL(request.url);
  // รองรับ / และ /index.html เท่านั้น
  if (!(url.pathname === '/' || url.pathname === '/index.html')) {
    console.log('[prerender] URL ไม่ตรงกับหน้า Home:', url.pathname);
    return context.next();
  }

  try {
    console.log('[prerender] เริ่ม prerender หน้า Home');

    // ดึงข้อมูลจังหวัดและโปรไฟล์ทั้งหมดจาก Supabase
    const { data: provinces, error: provincesError } = await supabase.from('provinces').select('*').order('nameThai');
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

    if (provincesError) {
      console.error('[prerender] ดึง provinces ผิดพลาด:', provincesError);
      return context.next();
    }
    if (profilesError) {
      console.error('[prerender] ดึง profiles ผิดพลาด:', profilesError);
      return context.next();
    }

    // สร้าง HTML หน้า Home
    let html = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
   <link rel=preload href=/images/hero-sidelinechiangmai-1200.webp as=image imagesrcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w" imagesizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px" fetchpriority=high>
  <meta charset=utf-8>
  <meta http-equiv=X-UA-Compatible content="IE=edge">
  
  
  <meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover">
  
  
  <title>Sideline Chiangmai | ไซด์ไลน์เชียงใหม่ สาวรับงาน เชียงใหม่ ฟิวแฟน</title>
  <meta name=description content="แหล่งรวมน้องๆสาวๆ รับงาน ไซด์ไลน์เชียงใหม่ ตรงปก100% ฟีลแฟน ปลอดภัยไม่มีมัดจำ ชำระเงินหน้างาน โปรไฟล์เด็ด ติดต่อไลน์ทันที!">
  <link rel=canonical href=https://sidelinechiangmai.netlify.app>
  <meta name=robots content="index, follow, max-image-preview:large">
  
  <style>
.hero-h1-revised{max-width:1200px;margin:0 auto;padding:2rem 1rem;text-align:center}.hero-h1-revised h1{font-size:clamp(1.75rem,4vw,2.5rem);font-weight:700;line-height:1.2;margin-bottom:1rem}.hero-h1-revised img{display:block;width:100%;height:auto;max-width:1200px;margin:0 auto;border-radius:.75rem;aspect-ratio:1200/904}#page-header{min-height:56px}#page-header .container{height:56px;display:flex;align-items:center}#page-header a img{display:block;width:auto;height:28px;aspect-ratio:245/30}nav[aria-label="เมนูหลัก"] a{white-space:nowrap;display:inline-block}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
</style>
  <meta property=og:locale content=th_TH>
  <meta property=og:site_name content="Sideline Chiangmai">
  <meta property=og:type content=website>
  <meta property=og:title content="Sideline Chiangmai | ไซด์ไลน์เชียงใหม่ สาวรับงานเชียงใหม่ ฟีลแฟน">
  <meta property=og:description content="รวมสาวรับงานเชียงใหม่ตรงปก ฟิวแฟน อัปเดตใหม่ทุกวัน">
  <meta property=og:image content=https://sidelinechiangmai.netlify.app/images/sideline-chiangmai-social-preview.webp>
  <meta property=og:url content=https://sidelinechiangmai.netlify.app/ >
  
  
  <meta name=twitter:card content=summary_large_image>
  
  
  <link rel=alternate hreflang=th href=https://sidelinechiangmai.netlify.app>
  
  
  <meta name=theme-color content=#ffffff media="(prefers-color-scheme: light)">
  <meta name=theme-color content=#111827 media="(prefers-color-scheme: dark)">
  
  
  <link rel=icon href=/images/favicon.ico sizes=any>
  <link rel=icon href=/images/favicon.svg type=image/svg+xml>
  <link rel=apple-touch-icon href=/images/apple-touch-icon.png>
  <link rel=manifest href=/manifest.webmanifest>
  
  
  <link rel=preconnect href=https://hgzbgpbmymoiwjpaypvl.supabase.co crossorigin>
  <link rel=preconnect href=https://cdnjs.cloudflare.com crossorigin>
  <link rel=dns-prefetch href=//cdnjs.cloudflare.com>
  <link rel=preconnect href=https://cdn.jsdelivr.net crossorigin>
  
  
  <link rel=preload href=/styles.css as=style onload='this.onload=null,this.rel="stylesheet"'>
  <noscript><link rel=stylesheet href=/styles.css></noscript>
  
  
  <link rel="preload" href="/fonts/prompt-v11-latin_thai-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/prompt-v11-latin_thai-regular.woff2" as="font" type="font/woff2" crossorigin>

  
  
  <link rel=preload href=https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css as=style onload='this.onload=null,this.rel="stylesheet"'>
  <noscript><link rel=stylesheet href=https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css></noscript>
  
  
  <link rel=modulepreload href=/main.js>
  
  
 
  
  <!-- ✅ Structured Data: Combined Schema for Sideline Chiangmai -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://sidelinechiangmai.netlify.app/#website",
      "name": "Sideline Chiangmai",
      "url": "https://sidelinechiangmai.netlify.app/",
      "description": "แหล่งรวมน้องๆสาวๆ รับงาน ไซด์ไลน์เชียงใหม่ ตรงปก100% ฟีลแฟน ปลอดภัยไม่มีมัดจำ ชำระเงินหน้างาน โปรไฟล์เด็ด ติดต่อไลน์ทันที!",
      "inLanguage": "th-TH",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sidelinechiangmai.netlify.app/profiles.html?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://sidelinechiangmai.netlify.app/#organization",
      "name": "Sideline Chiangmai",
      "url": "https://sidelinechiangmai.netlify.app/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp",
        "width": 245,
        "height": 30
      },
      "sameAs": [
        "https://www.facebook.com/sidelinechiangmai",
        "https://www.instagram.com/sidelinechiangmai",
        "https://www.tiktok.com/@sidelinecm",
        "https://sidelinechiangmai.bsky.social",
        "https://linktr.ee/kissmodel"
      ]
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://sidelinechiangmai.netlify.app/#localbusiness",
      "name": "Sideline Chiangmai",
      "image": [
        "https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp",
        "https://sidelinechiangmai.netlify.app/images/hero-sidelinechiangmai-1200.webp"
      ],
      "description": "บริการไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก 100% เด็กใหม่ โปรไฟล์จริง อัปเดตทุกวัน",
      "url": "https://sidelinechiangmai.netlify.app/",
      "priceRange": "฿฿฿",
      "telephone": "099-423-8888",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "ฟิวแฟน เจ็ดยอด, ตำบลช้างเผือก",
        "addressLocality": "เมืองเชียงใหม่",
        "addressRegion": "เชียงใหม่",
        "postalCode": "50300",
        "addressCountry": "TH"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 18.8140717,
        "longitude": 98.9720960
      },
      "areaServed": {
        "@type": "City",
        "name": "เชียงใหม่"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
        ],
        "opens": "10:00",
        "closes": "02:00"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "128"
      },
      "sameAs": [
        "https://www.facebook.com/sidelinechiangmai",
        "https://www.instagram.com/sidelinechiangmai",
        "https://www.tiktok.com/@sidelinecm"
      ]
    }
  ]
}
</script>

</head>
      <body>
        <header>
<h1 id="hero-h1" class="sr-only">
        Sideline Chiangmai | ไซด์ไลน์เชียงใหม่ สาวรับงานเชียงใหม่ ฟิวแฟน ตรงปก100% ไม่มีมัดจำ เด็กn
      </h1>
        <main>
    `;

    for (const province of provinces) {
      const provinceProfiles = profiles.filter(p => p.provinceKey === province.key);
      if (provinceProfiles.length === 0) continue;

      html += `
        <section id="province-${province.key}">
          <h2>จังหวัด ${province.nameThai}</h2>
          <div class="province-description">${province.description || ''}</div>
          <div class="profile-grid">
      `;

      for (const profile of provinceProfiles.slice(0, 8)) {
        const mainImg = profile.imagePath
          ? `${SUPABASE_URL}/storage/v1/object/public/profile-images/${profile.imagePath}`
          : '/images/placeholder-profile.webp';

        html += `
          <article class="profile-card">
            <img src="${mainImg}" alt="${profile.altText || `รูปของ ${profile.name}`}" loading="lazy" width="300" height="400" />
            <h3>${profile.name}</h3>
            <p>${profile.quote || ''}</p>
            <p><strong>เรท:</strong> ${profile.rate || '-'} | <strong>สถานะ:</strong> ${profile.availability || 'ไม่ระบุ'}</p>
          </article>
        `;
      }

      html += `
          </div>
          <p><a href="/province/${province.key}.html" class="btn">ดูทั้งหมดใน ${province.nameThai}</a></p>
        </section>
      `;
    }

    html += `
        </main>
        <footer><p>&copy; ${new Date().getFullYear()} sidelinechiangmai.netlify.app</p></footer>
<script>
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

// ✅ ลงทะเบียน Service Worker แบบ idle time
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const registerSW = () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('✅ SW registered:', reg.scope))
        .catch(err => console.error('❌ SW registration failed:', err));
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(registerSW);
    } else {
      setTimeout(registerSW, 1500);
    }
  });
}
</script>
      </body>
      </html>
    `;

    // คืน response พร้อม cache-control เพื่อให้ CDN cache ได้นาน (ปรับตามความเหมาะสม)
    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300, stale-while-revalidate=600' // 5 นาที cache, 10 นาที stale-while-revalidate
      },
    });
  } catch (err) {
    console.error('❌ prerender error:', err);
    return context.next();
  }
};
