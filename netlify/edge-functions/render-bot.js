// ──────────────────────────────────────────────────────────────────────
//  Netlify Edge Function – Render Bot‑Friendly Profile Page
//  (SEO + Local‑SEO + JSON‑LD + Open Graph + GA4 + CSP + Cache)
// ──────────────────────────────────────────────────────────────────────

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/* ---------- 1️⃣  Environment Variables  ---------- */
const SUPABASE_URL      = process.env.SUPABASE_URL      || 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const TABLE_NAME        = 'profiles';
const STORAGE_BUCKET    = 'profile-images';
const SLUG_COLUMN       = 'slug';
const DOMAIN_URL        = process.env.DOMAIN_URL || 'https://sidelinechiangmai.netlify.app';
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || '';   // optional

/* ---------- 2️⃣  Schema helpers ---------- */
function genReviewSchema(profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: profile.reviewRating || '5',
      bestRating: '5',
    },
    author: {
      '@type': 'Person',
      name: profile.reviewAuthor || 'รีวิวลูกค้าจริง',
    },
    reviewBody: profile.reviewText || 'บริการดี ตรงปกจริง!',
  };
}

function genBreadcrumb(profile, slug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: `${DOMAIN_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'โปรไฟล์ไซด์ไลน์', item: `${DOMAIN_URL}/profiles` },
      { '@type': 'ListItem', position: 3, name: profile.name || slug, item: `${DOMAIN_URL}/app/${slug}` },
    ],
  };
}

function genLocalBusiness(profile) {
  const imageURL = profile.imagePath
    ? `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profile.imagePath}`
    : `${DOMAIN_URL}/images/og-default.webp`;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: profile.name || 'Sideline Chiang Mai',
    address: {
      '@type': 'PostalAddress',
      streetAddress: profile.street || '',
      addressLocality: profile.provinceKey || 'เชียงใหม่',
      addressRegion: 'TH',
      postalCode: profile.postalCode || '',
    },
    telephone: profile.phone || '+1 0994238888',
    url: `${DOMAIN_URL}/app/${profile.slug}`,
    image: imageURL,
  };
}

/* ---------- 3️⃣  Generate full HTML ---------- */
const generateProfileHTML = (profile, slug) => {
  const name         = profile.name || `น้อง ${slug}`;
  const province     = profile.provinceKey || 'เชียงใหม่';
  const age          = profile.age || 'ไม่ระบุ';
  const stats        = profile.stats || 'ไม่ระบุ';
  const rate         = profile.rate || 'สอบถาม';
  const location     = profile.location || province;
  const availability = profile.availability || 'สอบถามคิว';
  const altText      = profile.altText || `น้อง ${name} รับงาน${province}`;

  const rawDesc  = profile.description || '';
  const metaDesc = rawDesc.length > 140
    ? rawDesc.slice(0, 140) + '…'
    : (rawDesc || `ดูโปรไฟล์น้อง ${name} ไซด์ไลน์${province} รับงานเอง ปลอดภัย ตรงปก`);

  const imageUrl = profile.imagePath
    ? `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profile.imagePath}`
    : `${DOMAIN_URL}/images/og-default.webp`;

  const pageTitle = `${name} - สาวไซด์ไลน์${province} รับงานฟิวแฟน ตรงปก | Sideline Chiang Mai`;

  /* ---------- JSON‑LD ---------- */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้า ข้อมูลจะถูกเก็บเป็นความลับ',
        },
      },
      {
        '@type': 'Question',
        name: 'จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการหรือไม่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ไม่จำเป็นต้องโอนเงินมัดจำ สามารถชำระค่าบริการเต็มจำนวนที่หน้างานได้เลย',
        },
      },
      {
        '@type': 'Question',
        name: 'น้องๆ ตรงปกตามรูปโปรไฟล์จริงหรือ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพอย่างละเอียด การันตีตรงปก 100%',
        },
      },
    ],
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description: metaDesc,
    image: imageUrl,
    url: `${DOMAIN_URL}/app/${slug}`,
    address: { '@type': 'PostalAddress', addressLocality: province, addressCountry: 'TH' },
  };

  const reviewSchema   = genReviewSchema(profile);
  const breadcrumbSchema = genBreadcrumb(profile, slug);
  const localBusinessSchema = genLocalBusiness(profile);

  /* ---------- Main article ---------- */
  const articleHTML = `
&lt;article class="profile-container" itemscope itemtype="https://schema.org/Person"&gt;
  &lt;header&gt;
    &lt;h1 itemprop="name"&gt;${name} (${province})&lt;/h1&gt;
    &lt;div class="meta-info"&gt;
      &lt;span itemprop="age"&gt;อายุ: ${age} ปี&lt;/span&gt; |
      &lt;span&gt;สัดส่วน: ${stats}&lt;/span&gt; |
      &lt;span itemprop="address"&gt;${province}&lt;/span&gt;
    &lt;/div&gt;
  &lt;/header&gt;

  &lt;figure&gt;
    &lt;img src="${imageUrl}" alt="รูปโปรไฟล์ของ ${name}" itemprop="image"&gt;
    &lt;figcaption&gt;${altText}&lt;/figcaption&gt;
  &lt;/figure&gt;

  &lt;section class="details"&gt;
    &lt;h2&gt;รายละเอียดบริการ&lt;/h2&gt;
    &lt;div class="description-content" itemprop="description"&gt;
      ${rawDesc ? rawDesc.replace(/\n/g, '&lt;br&gt;') : 'ไม่มีรายละเอียดเพิ่มเติม'}
    &lt;/div&gt;
    &lt;div class="additional-info"&gt;
      &lt;p&gt;&lt;strong&gt;เรทราคา:&lt;/strong&gt; &lt;span itemprop="price"&gt;${rate}&lt;/span&gt;&lt;/p&gt;
      &lt;p&gt;&lt;strong&gt;สถานที่รับงาน:&lt;/strong&gt; ${location}&lt;/p&gt;
      &lt;p&gt;&lt;strong&gt;สถานะ:&lt;/strong&gt; ${availability}&lt;/p&gt;
    &lt;/div&gt;
  &lt;/section&gt;

  ${profile.reviewText
    ? `&lt;section class="review-section"&gt;&lt;h3&gt;รีวิวจริง&lt;/h3&gt;&lt;blockquote&gt;${profile.reviewText}&lt;footer&gt;${profile.reviewAuthor || ''}&lt;/footer&gt;&lt;/blockquote&gt;&lt;/section&gt;`
    : ''}

  &lt;section class="cta"&gt;&lt;a href="https://line.me/ti/p/ksLUWB89Y_" class="btn-main"&gt;จองคิวผ่าน LINE&lt;/a&gt;&lt;/section&gt;
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
  &lt;meta name="description" content="${metaDesc}"&gt;
  &lt;link rel="canonical" href="${DOMAIN_URL}/app/${slug}"&gt;
  &lt;link rel="stylesheet" href="/styles/profile.css"&gt;

  &lt;!-- Open Graph --&gt;
  &lt;meta property="og:type" content="profile"&gt;
  &lt;meta property="og:title" content="${pageTitle}"&gt;
  &lt;meta property="og:description" content="${metaDesc}"&gt;
  &lt;meta property="og:image" content="${imageUrl}"&gt;
  &lt;meta property="og:url" content="${DOMAIN_URL}/app/${slug}"&gt;
  &lt;meta property="og:site_name" content="Sideline Chiang Mai"&gt;

  &lt;!-- Twitter Card --&gt;
  &lt;meta name="twitter:card" content="summary_large_image"&gt;
  &lt;meta name="twitter:title" content="${pageTitle}"&gt;
  &lt;meta name="twitter:description" content="${metaDesc}"&gt;
  &lt;meta name="twitter:image" content="${imageUrl}"&gt;

  &lt;!-- JSON‑LD --&gt;
  &lt;script type="application/ld+json"&gt;${JSON.stringify(faqSchema)}&lt;/script&gt;
  &lt;script type="application/ld+json"&gt;${JSON.stringify(personSchema)}&lt;/script&gt;
  &lt;script type="application/ld+json"&gt;${JSON.stringify(reviewSchema)}&lt;/script&gt;
  &lt;script type="application/ld+json"&gt;${JSON.stringify(breadcrumbSchema)}&lt;/script&gt;
  &lt;script type="application/ld+json"&gt;${JSON.stringify(localBusinessSchema)}&lt;/script&gt;

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
      ${profile.street || '123 ถนนบางขุนเทียน'}&lt;br&gt;
      ${province}, Thailand&lt;br&gt;
      &lt;a href="tel:${profile.phone || '+10994238888'}" class="tel-link"&gt;+${profile.phone || '0994238888'}&lt;/a&gt;
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
  const path = url.pathname.split('/').filter(Boolean); // ['app', 'slug']

  if (path[0] !== 'app' || !path[1]) return context.next();

  const slug = path[1];

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: profile, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq(SLUG_COLUMN, slug)
      .maybeSingle();

    if (error || !profile) {
      console.warn(`Profile not found for slug: ${slug}`);
      return context.next();
    }

    const html = generateProfileHTML(profile, slug);

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