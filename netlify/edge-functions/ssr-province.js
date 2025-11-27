// ──────────────────────────────────────────────────────────────────────
//  Netlify Edge Function – SSR for Province Pages
//  (SEO + Local‑SEO + JSON‑LD + OG + Twitter Card + GA4 + CSP + Cache)
// ──────────────────────────────────────────────────────────────────────

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/* ---------- 1️⃣  Environment Variables ---------- */
const SUPABASE_URL      = process.env.SUPABASE_URL      || 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const TABLE_NAME        = 'provinces';      // ชื่อตาราง province
const SLUG_COLUMN       = 'slug';           // คอลัมน์ที่เป็น slug
const DOMAIN_URL        = process.env.DOMAIN_URL || 'https://sidelinechiangmai.netlify.app';
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || '';  // optional

/* ---------- 2️⃣  Helper – JSON‑LD generators ---------- */
function generateBreadcrumb(province, slug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: `${DOMAIN_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'จังหวัด', item: `${DOMAIN_URL}/province` },
      { '@type': 'ListItem', position: 3, name: province.name || slug, item: `${DOMAIN_URL}/province/${slug}` },
    ],
  };
}

function generateLocalBusiness(province) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: province.name || 'Sideline Chiang Mai',
    address: {
      '@type': 'PostalAddress',
      addressLocality: province.name || 'เชียงใหม่',
      addressRegion: 'TH',
      postalCode: province.postalCode || '',
    },
    telephone: province.phone || '+1 0994238888',
    url: `${DOMAIN_URL}/province/${province.slug}`,
    image: province.imagePath
      ? `${SUPABASE_URL}/storage/v1/object/public/${province.imagePath}`
      : `${DOMAIN_URL}/images/og-default.webp`,
  };
}

/* ---------- 3️⃣  Generate full HTML ---------- */
const generateProvinceHTML = (province, slug) => {
  const name        = province.name || `จังหวัด ${slug}`;
  const description = province.description || `ดูข้อมูลและบริการของจังหวัด ${name} ที่ Sideline Chiang Mai`;
  const imageUrl    = province.imagePath
    ? `${SUPABASE_URL}/storage/v1/object/public/${province.imagePath}`
    : `${DOMAIN_URL}/images/og-default.webp`;
  const pageTitle   = `${name} – บริการไซด์ไลน์ใน ${name} | Sideline Chiang Mai`;

  /* ---------- JSON‑LD ---------- */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Sideline Chiang Mai มีบริการในจังหวัดนี้หรือไม่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ใช่! เรามีทีมงานมืออาชีพที่พร้อมให้บริการในจังหวัดนี้',
        },
      },
      {
        '@type': 'Question',
        name: 'ต้องจองล่วงหน้ากี่วัน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'แนะนำให้จองล่วงหน้าอย่างน้อย 3 วัน เพื่อความสะดวก',
        },
      },
    ],
  };

  const localBusinessSchema = generateLocalBusiness(province);
  const breadcrumbSchema = generateBreadcrumb(province, slug);

  /* ---------- Main article ---------- */
  const articleHTML = `
&lt;article class="province-container" itemscope itemtype="https://schema.org/Place"&gt;
  &lt;header&gt;
    &lt;h1 itemprop="name"&gt;${name}&lt;/h1&gt;
    &lt;p itemprop="description"&gt;${description}&lt;/p&gt;
  &lt;/header&gt;

  &lt;figure&gt;
    &lt;img src="${imageUrl}" alt="${name} – ภาพรวม" itemprop="image"&gt;
  &lt;/figure&gt;

  &lt;section class="details"&gt;
    &lt;h2&gt;ข้อมูลเพิ่มเติม&lt;/h2&gt;
    &lt;ul&gt;
      &lt;li&gt;รหัสไปรษณีย์: ${province.postalCode || 'ไม่ระบุ'}&lt;/li&gt;
      &lt;li&gt;โทรศัพท์: <a href="tel:${province.phone || '+10994238888'}" itemprop="telephone">${province.phone || '+1 0994238888'}</a>&lt;/li&gt;
      &lt;li&gt;เว็บไซต์: <a href="${province.website || '#'}" target="_blank" rel="noopener" itemprop="url">${province.website || '—'}</a>&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/section&gt;

  &lt;section class="cta"&gt;
    <a href="https://line.me/ti/p/ksLUWB89Y_" class="btn-main">จองผ่าน LINE</a>
  &lt;/section&gt;
&lt;/article&gt;
`;

  /* ---------- Return full page ---------- */
  return `
&lt;!DOCTYPE html&gt;
&lt;html lang="th"&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;meta name="viewport" content="width=device-width,initial-scale=1"&gt;
  &lt;title&gt;${pageTitle}&lt;/title&gt;
  &lt;meta name="description" content="${description}"&gt;
  &lt;link rel="canonical" href="${DOMAIN_URL}/province/${slug}"&gt;
  &lt;link rel="stylesheet" href="/styles/profile.css"&gt;

  &lt;!-- Open Graph --&gt;
  &lt;meta property="og:type" content="website"&gt;
  &lt;meta property="og:title" content="${pageTitle}"&gt;
  &lt;meta property="og:description" content="${description}"&gt;
  &lt;meta property="og:image" content="${imageUrl}"&gt;
  &lt;meta property="og:url" content="${DOMAIN_URL}/province/${slug}"&gt;
  &lt;meta property="og:site_name" content="Sideline Chiang Mai"&gt;

  &lt;!-- Twitter Card --&gt;
  &lt;meta name="twitter:card" content="summary_large_image"&gt;
  &lt;meta name="twitter:title" content="${pageTitle}"&gt;
  &lt;meta name="twitter:description" content="${description}"&gt;
  &lt;meta name="twitter:image" content="${imageUrl}"&gt;

  &lt;!-- JSON‑LD --&gt;
  &lt;script type="application/ld+json"&gt;${JSON.stringify(faqSchema)}&lt;/script&gt;
  &lt;script type="application/ld+json"&gt;${JSON.stringify(localBusinessSchema)}&lt;/script&gt;
  &lt;script type="application/ld+json"&gt;${JSON.stringify(breadcrumbSchema)}&lt;/script&gt;

  &lt;!-- GA4 (ถ้ามี) --&gt;
  ${GA_MEASUREMENT_ID ? `&lt;script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"&gt;&lt;/script&gt;
&lt;script&gt;
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_MEASUREMENT_ID}');
&lt;/script&gt;` : ''}

  &lt;!-- CSP (minimal) --&gt;
  &lt;script&gt;
    document.addEventListener('DOMContentLoaded', () =&gt; {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = "default-src 'self'; img-src 'self' data:; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';";
      document.head.appendChild(meta);
    });
  &lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  ${articleHTML}
  &lt;footer class="site-footer"&gt;
    &lt;address&gt;
      &lt;strong&gt;Sideline Chiang Mai&lt;/strong&gt;&lt;br&gt;
      ${province.street || '123 ถนนบางขุนเทียน'}&lt;br&gt;
      ${province.name || 'เชียงใหม่'}, Thailand&lt;br&gt;
      <a href="tel:${province.phone || '+10994238888'}" class="tel-link">+${province.phone || '0994238888'}</a>
    &lt;/address&gt;
  &lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;
  `;
};

/* ---------- 4️⃣  Edge Function handler ---------- */
export default async (request, context) => {
  const ua = request.headers.get('User-Agent') ?? '';
  const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|baiduspider/i.test(ua);

  if (!isBot) return context.next();   // SPA for normal users

  const url  = new URL(request.url);
  const path = url.pathname.split('/').filter(Boolean); // ['province', 'slug']

  if (path[0] !== 'province' || !path[1]) return context.next();

  const slug = path[1];

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: province, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq(SLUG_COLUMN, slug)
      .maybeSingle();

    if (error || !province) {
      console.warn(`Province not found for slug: ${slug}`);
      return context.next();
    }

    const html = generateProvinceHTML(province, slug);

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=86400',
        'x-robots-tag': 'index, follow',
        'x-frame-options': 'SAMEORIGIN',
      },
    });
  } catch (err) {
    console.error('Edge function error:', err);
    return context.next();
  }
};