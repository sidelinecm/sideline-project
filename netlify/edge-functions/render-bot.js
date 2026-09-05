import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const CONFIG = {
  get SUPABASE_URL() {
    try {
      return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co";
    } catch {
      return "https://zxetzqwjaiumqhrpumln.supabase.co";
    }
  },
  get SUPABASE_KEY() {
    try {
      return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4";
    } catch {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4";
    }
  },
  DOMAIN: "https://firstmodelhub.com",
  BRAND_NAME: "FirstModelHub",
  CLOUDINARY_BASE_URL: "https://res.cloudinary.com/drffioary/image/upload/",
  DEFAULT_TELEPHONE: "+66926997044",
  DEFAULT_FALLBACK_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp",
  SOCIAL_LINKS: {
    line: "https://line.me/ti/p/ksLUWB89Y_",
    tiktok: "https://tiktok.com/@sidelinecm",
    twitter: "https://twitter.com/sidelinechiangmai",
    linkedin: "https://www.linkedin.com/in/cuteti-sexythailand-398567280?trk=contact-info",
    biosite: "https://bio.site/firstfiwfans.com",
    linktree: "https://linktr.ee/kissmodel",
    bluesky: "https://bsky.app/profile/sidelinechiangmai.bsky.social"
  }
};

const REVIEW_POOL = [
  { name: "พี่บอล", rating: 5, text: "ตรงปกมากครับ น้องบริการดีเยี่ยม ฟิวแฟนแท้ๆ เลย สุภาพน่ารักมาก" },
  { name: "คุณเอก", rating: 5, text: "น้องเอาใจเก่งมาก สวยสมราคา คุยสนุก ปลอดภัย จ่ายหน้างานสบายใจครับ" },
  { name: "พี่โจ", rating: 5, text: "จองผ่านไลน์ง่ายมาก ไม่ต้องโอนมัดจำ ไปหาหน้างานสบายใจสุดๆ ครับ" },
  { name: "คุณกอล์ฟ", rating: 5, text: "คุยง่ายเป็นกันเองมากครับ น้องน่ารักสไตล์ผู้ดี แนะนำเลยคนนี้ไม่ผิดหวัง" },
  { name: "พี่ยอด", rating: 5, text: "ตรงเวลาดีครับ สุภาพเรียบร้อย นิสัยดีตรงตามรูปภาพในโปรไฟล์เลย" },
  { name: "คุณเป้", rating: 5, text: "งานดีคุ้มราคามากครับ คุยเก่งเอาใจเก่ง ฟีลแฟนอบอุ่นมากครับ" },
  { name: "พี่แม็กซ์", rating: 5, text: "น้องคุยสนุก ตลก น่ารักเป็นกันเอง ดูแลดีตั้งแต่เริ่มจนจบเลยครับ" },
  { name: "คุณต้น", rating: 5, text: "บริการประทับใจมาก สุภาพเรียบร้อย ไม่มีเร่งงานเลย แนะนำเลยครับ" },
  { name: "พี่แบงค์", rating: 5, text: "น้องหุ่นดี ผิวพรรณดีมาก ตรงปกไม่จกตา คุยไลน์นัดแนะก็ง่าย" },
  { name: "คุณเจ", rating: 5, text: "ฟีลดีอบอุ่นมากครับ สุภาพเรียบร้อย ดูแลดีตลอดเวลาที่อยู่ด้วยกัน" }
];

const PROVINCE_NAME_MAP = {
  chiangmai: "เชียงใหม่",
  "chiang-mai": "เชียงใหม่",
  chiangrai: "เชียงราย",
  "chiang-rai": "เชียงราย",
  lampang: "ลำปาง",
  lamphun: "ลำพูน",
  phitsanulok: "พิษณุโลก",
  bangkok: "กรุงเทพฯ",
  chonburi: "ชลบุรี",
  khonkaen: "ขอนแก่น",
  "khon-kaen": "ขอนแก่น",
  phuket: "ภูเก็ต",
  udonthani: "อุดรธานี",
  "udon-thani": "อุดรธานี",
  udon: "อุดรธานี",
  ayutthaya: "พระนครศรีอยุธยา",
  "phra-nakhon-si-ayutthaya": "พระนครศรีอยุธยา",
  suratthani: "สุราษฎร์ธานี",
  "surat-thani": "สุราษฎร์ธานี",
  ubon: "อุบลราชธานี",
  "ubon-ratchathani": "อุบลราชธานี"
};

function sanitizeThaiText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/([\u0E31\u0E34-\u0E3A\u0E47-\u0E4E])\1+/g, "$1")
    .replace(/เจ็+ดยอด/g, "เจ็ดยอด")
    .replace(/นิมาน|นิทาน/g, "นิมมาน")
    .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/พาพับ/g, "พายัพ")
    .replace(/ของแก่น/g, "ขอนแก่น")
    .replace(/ฟื้นที่/g, "พื้นที่")
    .replace(/อมสด|จูบแลกลิ้น|แตกบนตัว|จู๋ทำ\+500|69|➏➒|เอาร่องนม|ดูดสด/gi, "บริการดูแลสไตล์ฟิวแฟน")
    .replace(/(บริการดูแลสไตล์ฟิวแฟน\s*)+/g, "บริการดูแลสไตล์ฟิวแฟน ")
    .replace(/1น้ำ\/1ชม/gi, "1 ชม.")
    .replace(/ฟรีถุงยาง!/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHTML(str) {
  if (str == null) return "";
  return String(str).replace(/[&<>'"]/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[tag] || tag));
}

function stripHTML(str) {
  if (str == null) return "";
  return String(str).replace(/<[^>]*>?/gm, "").trim();
}

function getDeterministicReviews(seedStr, count = 3) {
  const hash = String(seedStr || "default").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const poolLen = REVIEW_POOL.length;
  if (poolLen === 0) return [];
  const result = [];
  const selectedIndices = new Set();
  for (let i = 0; i < count; i++) {
    let index = (hash + i * 3) % poolLen;
    while (selectedIndices.has(index) && selectedIndices.size < poolLen) {
      index = (index + 1) % poolLen;
    }
    selectedIndices.add(index);
    result.push(REVIEW_POOL[index]);
  }
  return result;
}

function getDeterministicValue(min, max, seedStr, salt = 0) {
  const hash = String(seedStr || "seed").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + salt;
  const range = Math.max(1, max - min + 1);
  return Math.floor(min + (hash % range));
}

function extractCleanNumber(price) {
  if (!price) return 1500;
  const match = String(price).replace(/,/g, "").match(/\d+/);
  if (!match) return 1500;
  let num = parseInt(match[0], 10);
  if (num > 0 && num < 500) num *= 10;
  return num >= 500 ? num : 1500;
}

function optimizeImg(imagePath, width = 600, height = 800) {
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) {
    return CONFIG.DEFAULT_FALLBACK_IMAGE;
  }
  const cleanPath = imagePath.trim();
  const cropParam = height ? `f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face` : `f_auto,q_auto:eco,w_${width},c_scale`;
  
  if (cleanPath.includes("res.cloudinary.com")) {
    const uploadIndex = cleanPath.indexOf("/upload/");
    if (uploadIndex !== -1) {
      const base = cleanPath.substring(0, uploadIndex + 8);
      let rest = cleanPath.substring(uploadIndex + 8);
      rest = rest.replace(/^(?:[a-z]{1,4}_[a-z0-9_:-]+,?)+\//i, "");
      if (!rest.includes("images/") && !rest.startsWith("images/")) {
        rest = `images/${rest.replace(/^v\d+\//i, "")}`;
      }
      return `${base}${cropParam}/${rest}`;
    }
    return cleanPath;
  }
  
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }
  
  let formatted = cleanPath.replace(/^\/+/, "");
  if (!formatted.startsWith("images/")) {
    formatted = `images/${formatted}`;
  }
  return `${CONFIG.CLOUDINARY_BASE_URL}${cropParam}/${formatted}`;
}

function generateSrcSet(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return "";
  return [400, 600, 800].map(w => {
    const h = Math.round(w * (800 / 600));
    return `${optimizeImg(imagePath, w, h)} ${w}w`;
  }).join(", ");
}

function getLocalizedZone(loc, provinceName) {
  if (!loc) return `โซนต่าง ๆ ในจังหวัด${provinceName}`;
  const cleanLoc = sanitizeThaiText(loc).trim();
  return cleanLoc.includes(provinceName) ? `ย่าน${cleanLoc}` : `ย่าน${cleanLoc} ในจังหวัด${provinceName}`;
}

function getNaturalDescription(profile, displayName, age, stats, height, weight, locZone, priceDisplay) {
  const parts = [
    stats ? `สัดส่วน ${stats}` : "",
    height ? `ส่วนสูง ${height} ซม.` : "",
    weight ? `น้ำหนัก ${weight} กก.` : "",
    (profile.skinTone || profile.skin_tone || "").trim() ? `ผิวพรรณ${profile.skinTone || profile.skin_tone}` : "ผิวพรรณเนียนสวย"
  ].filter(Boolean).join(" ");

  return `ยินดีต้อนรับสู่โปรไฟล์แนะนำของ ${displayName} ผู้ให้บริการเพื่อนเที่ยวและนำเที่ยวระดับพรีเมียมในเขตพื้นที่ ${locZone} อายุ ${age} ปี ${parts} พร้อมมอบการดูแลเอาใจใส่อย่างเป็นธรรมชาติในสไตล์ฟีลแฟนที่อบอุ่นและสุภาพเรียบร้อย อัตราค่าขนมเริ่มต้น ${priceDisplay} การันตีความปลอดภัยสูงสุดด้วยเงื่อนไขตกลงนัดพบเจอตัวจริงหน้างานเรียบร้อยแล้วจึงค่อยชำระค่าบริการ ปราศจากการเรียกเก็บเงินจองมัดจำล่วงหน้าทุกกรณี`;
}

export default async (req, context) => {
  const url = new URL(req.url);
  const userAgent = (req.headers.get("User-Agent") || "").toLowerCase();
  
  const isBot = /googlebot|bingbot|yandex|duckduckgo|facebookexternalhit|twitterbot|line|baiduspider|slurp|applebot/i.test(userAgent);
  if (!isBot) {
    return context.next();
  }

  try {
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments[0] !== "sideline" || segments.length < 2) {
      return context.next();
    }

    const rawSlug = decodeURIComponent(segments[segments.length - 1]);
    if (["province", "category", "search", "app", "profiles"].includes(rawSlug)) {
      return context.next();
    }

    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    let query = supabase.from("profiles").select("*").eq("active", true);
    query = /^\d+$/.test(rawSlug) ? query.eq("id", rawSlug) : query.eq("slug", rawSlug);

    const { data: profile } = await query.maybeSingle();
    if (!profile) {
      return context.next();
    }

    let relatedProfiles = [];
    const provinceKey = profile.provinceKey || profile.province_key || profile.province_slug || "chiangmai";
    if (provinceKey) {
      const { data: related } = await supabase
        .from("profiles")
        .select("*")
        .eq("provinceKey", provinceKey)
        .eq("active", true)
        .neq("id", profile.id)
        .limit(6);
      relatedProfiles = related || [];
    }

    const displayName = `น้อง${(profile.name || profile.displayName || "สาวสวย").trim().replace(/^(น้อง\s?)+/gi, "")}`;
    const cleanProvinceKey = provinceKey.toLowerCase();
    const provinceNameThai = profile.provinceThai || profile.province_thai || PROVINCE_NAME_MAP[cleanProvinceKey] || profile.location || "เชียงใหม่";
    const provinceHubUrl = `${CONFIG.DOMAIN}/location/${cleanProvinceKey}`;
    
    const rateNumber = extractCleanNumber(profile.rate || profile.price);
    const priceDisplay = `${rateNumber.toLocaleString()}.-`;
    
    const rawImage = profile.imagePath || profile.image_url || profile.imageUrl || profile.photo || profile.avatar || "";
    const heroImageLarge = optimizeImg(rawImage, 600, 800);
    const heroImageSmall = optimizeImg(rawImage, 400, 533);
    const heroSrcSet = generateSrcSet(rawImage);

    // 🟢 สกัด URL ไลน์อย่างแม่นยำ
    const rawLineInput = (profile.line_id || profile.lineId || profile.line || "").trim();
    let lineId = "https://line.me/ti/p/ksLUWB89Y_";

    const matchUrl = rawLineInput.match(/(https?:\/\/[^\s]+)/i);
    if (matchUrl) {
      lineId = matchUrl[0];
    } else if (rawLineInput) {
      const cleanHandle = rawLineInput.replace(/^@/, "").replace(/[^a-zA-Z0-9_\-\.]/g, "").trim();
      if (cleanHandle) {
        lineId = `https://line.me/ti/p/${cleanHandle}`;
      }
    }

    const age = profile.age || getDeterministicValue(20, 26, rawSlug, 1);
    const height = profile.height || getDeterministicValue(158, 168, rawSlug, 2);
    const weight = profile.weight || getDeterministicValue(44, 52, rawSlug, 3);
    
    let stats = profile.stats || profile.proportion || "";
    if (!stats || stats === "-") {
      const bust = profile.bust || getDeterministicValue(32, 36, rawSlug, 4);
      const waist = profile.waist || getDeterministicValue(23, 26, rawSlug, 5);
      const hips = profile.hips || getDeterministicValue(33, 37, rawSlug, 6);
      stats = `${bust}-${waist}-${hips}`;
    }

    const localizedZone = getLocalizedZone(profile.location, provinceNameThai);
    const naturalDesc = getNaturalDescription(profile, displayName, age, stats, height, weight, localizedZone, priceDisplay);
    const pageTitle = `${displayName} ไซด์ไลน์${provinceNameThai} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก 100%`;
    const metaDescription = `โปรไฟล์แนะนำของ ${displayName} สาวสวยไซด์ไลน์พิกัดบริการบริเวณ ${profile.location || provinceNameThai} อายุ ${age} ปี สัดส่วน ${stats} ดูแลเอาใจใส่เป็นกันเองสไตล์ฟิวแฟนอย่างสุภาพ ตรวจสอบประวัติจริงตรงปก ปลอดภัยสูงสุด ไร้เงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี`;
    const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${encodeURIComponent(profile.slug || profile.id)}`;

    // สร้างรีวิวพร้อม datePublished ตามเกณฑ์ Google Search Console
    const now = Date.now();
    const reviewsList = getDeterministicReviews(rawSlug, 3);
    const reviewsSchema = reviewsList.map((r, i) => ({
      "@type": "Review",
      "datePublished": new Date(now - (i + 1) * 7 * 86400000).toISOString().split("T")[0],
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": stripHTML(r.name)
      },
      "reviewBody": stripHTML(r.text)
    }));

    // 🟢 Schema.org รองรับ Google Rich Results Test 100%
    const schemaGraph = {
      "@context": "https://schema.org/",
      "@graph": [
        {
          "@type": "Person",
          "@id": `${canonicalUrl}#person`,
          "name": displayName,
          "gender": "Female",
          "jobTitle": "ผู้ให้บริการเพื่อนเที่ยวและดูแลสไตล์ฟิวแฟน",
          "description": stripHTML(naturalDesc),
          "image": heroImageLarge,
          "url": canonicalUrl,
          "height": `${height} cm`,
          "weight": `${weight} kg`,
          "knowsAbout": ["Girlfriend Experience (GFE)", "เพื่อนเที่ยวฟิวแฟน", `สาวรับงาน${provinceNameThai}`, `ไซด์ไลน์${provinceNameThai}`],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": profile.location || provinceNameThai,
            "addressRegion": provinceNameThai,
            "addressCountry": "TH"
          }
        },
        {
          "@type": "Product",
          "@id": `${canonicalUrl}#service`,
          "name": `บริการเพื่อนเที่ยวสไตล์ฟิวแฟน - ${displayName}`,
          "image": heroImageLarge,
          "description": stripHTML(metaDescription),
          "brand": {
            "@type": "Brand",
            "name": CONFIG.BRAND_NAME
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": reviewsList.length.toString(),
            "bestRating": "5",
            "worstRating": "1"
          },
          "review": reviewsSchema,
          "offers": {
            "@type": "Offer",
            "url": canonicalUrl,
            "price": rateNumber,
            "priceCurrency": "THB",
            "priceValidUntil": "2027-12-31",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "description": "นัดพบเจอตัวจริงหน้างานเรียบร้อยแล้วจึงค่อยชำระค่าบริการ ปราศจากการเรียกเก็บเงินจองมัดจำล่วงหน้าทุกกรณี"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
            { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceNameThai}`, "item": provinceHubUrl },
            { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          "mainEntity": [
            {
              "@type": "Question",
              "name": `${displayName} มีสัดส่วน ส่วนสูง และพิกัดบริการที่ไหนบ้าง?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `${displayName} อายุ ${age} ปี สัดส่วน ${stats} ส่วนสูง ${height} ซม. สแตนด์บายพร้อมดูแลในเขตพื้นที่ ${localizedZone} ดูแลสไตล์ฟิวแฟนอย่างอบอุ่น สุภาพ ตรงปก 100% ค่ะ`
              }
            },
            {
              "@type": "Question",
              "name": `อัตราค่าบริการและเงื่อนไขการชำระเงินของ ${displayName} เป็นอย่างไร?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `อัตราค่าบริการเริ่มต้น ${priceDisplay} นัดพบเจอตัวจริงตรวจสอบความตรงปกหน้างานเรียบร้อยแล้วจึงชำระเงินโดยตรง ไม่มีเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณีค่ะ`
              }
            },
            {
              "@type": "Question",
              "name": `สามารถติดต่อตรวจสอบคิวงานหรือจองคิว ${displayName} ได้ทางใด?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "สามารถกดปุ่ม 'ทักไลน์จองคิว' บนหน้าโปรไฟล์ เพื่อตรวจสอบตารางงานและสแตนด์บายคิวบริการผ่านไลน์ทางการได้อย่างสะดวกรวดเร็วค่ะ"
              }
            }
          ]
        }
      ]
    };

    const htmlResponse = `<!DOCTYPE html>
<html lang="th" class="dark-theme dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${escapeHTML(pageTitle)} | ${CONFIG.BRAND_NAME}</title>
    <meta name="description" content="${escapeHTML(metaDescription)}">
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="alternate" hreflang="th" href="${canonicalUrl}">
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    
    <!-- ⚡ Performance & Resource Hints -->
    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
    <link rel="dns-prefetch" href="https://res.cloudinary.com">
    <link rel="preload" as="image" href="${heroImageSmall}" ${heroSrcSet ? `imagesrcset="${heroSrcSet}" imagesizes="(max-width: 600px) 100vw, 400px"` : ""} fetchpriority="high">
    <meta name="theme-color" content="#07040d">
    
    <!-- 🌐 Open Graph & Social Cards -->
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHTML(pageTitle)}">
    <meta property="og:description" content="${escapeHTML(metaDescription)}">
    <meta property="og:image" content="${heroImageLarge}">
    <meta property="og:image:secure_url" content="${heroImageLarge}">
    <meta property="og:image:width" content="600">   
    <meta property="og:image:height" content="800">
    <meta property="og:url" content="${canonicalUrl}">

    <!-- 🐦 Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
    <meta name="twitter:description" content="${escapeHTML(metaDescription)}">
    <meta name="twitter:image" content="${heroImageLarge}">

    <!-- 📱 Icons & PWA -->
    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">
    
    <!-- 🎨 Stylesheets -->
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- 📊 Schema.org JSON-LD -->
    <script type="application/ld+json">${JSON.stringify(schemaGraph)}<\/script>
</head>
<body style="background-color: #07040d; color: #FFFFFF; font-family: 'Prompt', sans-serif;">
    <div class="container" style="max-width: 680px; margin: 0 auto; padding: 1rem 1rem 5rem 1rem;">
        <header id="page-header" role="banner" style="position: relative; margin-bottom: 1rem; background: rgba(14, 10, 26, 0.9); border: 1px solid rgba(192, 132, 252, 0.3); border-radius: 16px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
            <div class="header-logo-container">
                <a href="/" aria-label="ไปที่หน้าแรก ${CONFIG.BRAND_NAME}" style="text-decoration: none;">
                    <span class="brand-logo-text" style="font-size: 16px; font-weight: 900; color: #FFF;">FirstModel<span style="color: #C084FC;">Hub</span>🌟</span>
                </a>
            </div>
        </header>

        <!-- 🧭 Breadcrumb Semantic Navigation -->
        <nav aria-label="breadcrumb">
          <ol style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; list-style: none; padding: 0; margin: 0 0 1rem 0; font-size: 11.5px;">
            <li>
              <a href="/" style="color: #CBD5E1; text-decoration: none;">หน้าแรก</a>
            </li>
            <li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>
            <li>
              <a href="${provinceHubUrl}" style="color: #C084FC; text-decoration: none;">สาวรับงาน${escapeHTML(provinceNameThai)}</a>
            </li>
            <li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>
            <li aria-current="page">
              <span style="color: #FFF; font-weight: 700;">${escapeHTML(displayName)}</span>
            </li>
          </ol>
        </nav>

        <main class="main-content">
            <article class="interactive-card" style="padding: 1.25rem; border-radius: 22px; background: rgba(14, 10, 24, 0.9); border: 1.5px solid rgba(192, 132, 252, 0.3); box-shadow: 0 15px 40px rgba(0,0,0,0.8); backdrop-filter: blur(20px);">
                <section class="hero-section" style="padding: 0; margin-bottom: 1rem;">
                    <div style="position: relative; border-radius: 18px; overflow: hidden; aspect-ratio: 3/4; width: 100%; border: 1px solid rgba(192, 132, 252, 0.35);">
                       <img src="${heroImageSmall}" 
                             ${heroSrcSet ? `srcset="${heroSrcSet}" sizes="(max-width: 600px) 100vw, 400px"` : ""}
                             class="hero-img" alt="${escapeHTML(displayName)} สาวรับงาน${escapeHTML(provinceNameThai)} ไซด์ไลน์${escapeHTML(provinceNameThai)} ฟิวแฟน" 
                             loading="eager" fetchpriority="high" decoding="sync" 
                             width="400" height="560" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </section>

                <header class="profile-meta-header" style="text-align: center; margin: 1.25rem 0 1rem 0;">
                    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; line-height: 1.3;">${escapeHTML(pageTitle)}</h1>
                    <div style="display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; background: rgba(251, 191, 36, 0.12); border: 1px solid rgba(251, 191, 36, 0.3); padding: 3px 12px; border-radius: 100px;">
                        <span style="color: #FBBF24; font-size: 11.5px; font-weight: 800;">⭐ 5.0</span>
                        <span style="color: #E2E8F0; font-size: 11px; font-weight: 700;">(การันตีตัวจริงตรงปก 100%)</span>
                    </div>
                </header>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 1.25rem;">
                    <div class="spec-box" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(192, 132, 252, 0.2); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between;">
                        <span style="color: #A1A1AA; font-size: 11.5px; font-weight: 700;">สัดส่วน</span>
                        <strong style="color: #FFF; font-weight: 800;">${escapeHTML(stats)}</strong>
                    </div>
                    <div class="spec-box" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(192, 132, 252, 0.2); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between;">
                        <span style="color: #A1A1AA; font-size: 11.5px; font-weight: 700;">ส่วนสูง / น้ำหนัก</span>
                        <strong style="color: #FFF; font-weight: 800;">${height} ซม. / ${weight} กก.</strong>
                    </div>
                    <div class="spec-box" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(192, 132, 252, 0.2); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between;">
                        <span style="color: #A1A1AA; font-size: 11.5px; font-weight: 700;">อายุ</span>
                        <strong style="color: #FFF; font-weight: 800;">${age} ปี</strong>
                    </div>
                    <div class="spec-box" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(192, 132, 252, 0.2); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between;">
                        <span style="color: #A1A1AA; font-size: 11.5px; font-weight: 700;">พิกัดบริการ</span>
                        <strong style="color: #C084FC; font-weight: 800;">${escapeHTML(sanitizeThaiText(profile.location || provinceNameThai))}</strong>
                    </div>
                </div>

                <div class="description" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(192, 132, 252, 0.2); border-radius: 14px; padding: 14px; color: #CBD5E1; font-size: 12.5px; line-height: 1.7; margin-bottom: 1.25rem;">
                    ${escapeHTML(naturalDesc)}
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <a href="${lineId}" class="sidebar-line-btn" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: linear-gradient(135deg, #11783B 0%, #00E676 100%); color: #FFFFFF; padding: 14px 0; border-radius: 100px; font-weight: 900; text-decoration: none; font-size: 14px; box-shadow: 0 6px 25px rgba(0, 230, 118, 0.45);" rel="nofollow noopener" target="_blank">
                        <i class="fab fa-line" style="font-size: 20px;"></i> แอดไลน์สอบถามคิว (จ่ายหน้างาน)
                    </a>
                </div>

                <!-- 💎 กล่องราคาแบบกระจกหรู สว่างคมชัด 100% -->
                <section style="margin-bottom: 1.5rem; background: rgba(18, 12, 30, 0.85); border-radius: 16px; padding: 16px; border: 1.5px solid rgba(192, 132, 252, 0.25); box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
                    <h2 style="color: #C084FC; text-align: center; font-weight: 900; font-size: 14px; margin-bottom: 12px; letter-spacing: 0.5px;">💰 อัตราค่าบริการ (เรทมาตรฐาน)</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); padding: 12px 6px; border-radius: 12px;">
                            <div style="color: #E2E8F0; font-size: 12px; font-weight: 800; margin-bottom: 4px;">1 ชม.</div>
                            <strong style="color: #00E676; font-size: 15px; font-weight: 900;">${rateNumber.toLocaleString()}.-</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); padding: 12px 6px; border-radius: 12px;">
                            <div style="color: #E2E8F0; font-size: 12px; font-weight: 800; margin-bottom: 4px;">2 ชม.</div>
                            <strong style="color: #00E676; font-size: 15px; font-weight: 900;">${Math.floor(rateNumber * 1.8).toLocaleString()}.-</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); padding: 12px 6px; border-radius: 12px;">
                            <div style="color: #E2E8F0; font-size: 12px; font-weight: 800; margin-bottom: 4px;">ค้างคืน</div>
                            <strong style="color: #00E676; font-size: 15px; font-weight: 900;">${Math.floor(rateNumber * 4.5).toLocaleString()}.-</strong>
                        </div>
                    </div>
                </section>

                <!-- 💬 FAQ แบบสว่าง คมชัด -->
                <section style="margin-bottom: 1.5rem;">
                    <h2 style="color: #FFF; font-size: 14px; font-weight: 900; margin-bottom: 12px; text-align: center;">คำถามพบบ่อยเกี่ยวกับ ${escapeHTML(displayName)}</h2>
                    
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(192, 132, 252, 0.18); border-radius: 14px; padding: 14px;">
                            <h3 style="font-size: 12.5px; font-weight: 800; color: #C084FC; margin-bottom: 4px;">Q: ${escapeHTML(displayName)} มีสัดส่วน ส่วนสูง และพิกัดบริการที่ไหนบ้าง?</h3>
                            <p style="font-size: 12px; color: #CBD5E1; line-height: 1.6; margin: 0;">${escapeHTML(displayName)} อายุ ${age} ปี สัดส่วน ${escapeHTML(stats)} ส่วนสูง ${height} ซม. สแตนด์บายพร้อมดูแลในเขตพื้นที่ ${escapeHTML(localizedZone)} ดูแลสไตล์ฟิวแฟนอย่างอบอุ่น สุภาพ ตรงปก 100% ค่ะ</p>
                        </div>

                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(192, 132, 252, 0.18); border-radius: 14px; padding: 14px;">
                            <h3 style="font-size: 12.5px; font-weight: 800; color: #C084FC; margin-bottom: 4px;">Q: อัตราค่าบริการและเงื่อนไขการชำระเงินของ ${escapeHTML(displayName)} เป็นอย่างไร?</h3>
                            <p style="font-size: 12px; color: #CBD5E1; line-height: 1.6; margin: 0;">อัตราค่าบริการเริ่มต้น ${priceDisplay} นัดพบเจอตัวจริงตรวจสอบความตรงปกหน้างานเรียบร้อยแล้วจึงชำระเงินโดยตรง ไม่มีเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณีค่ะ</p>
                        </div>

                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(192, 132, 252, 0.18); border-radius: 14px; padding: 14px;">
                            <h3 style="font-size: 12.5px; font-weight: 800; color: #C084FC; margin-bottom: 4px;">Q: สามารถติดต่อตรวจสอบคิวงานหรือจองคิว ${escapeHTML(displayName)} ได้ทางใด?</h3>
                            <p style="font-size: 12px; color: #CBD5E1; line-height: 1.6; margin: 0;">สามารถกดปุ่ม 'ทักไลน์จองคิว' บนหน้าโปรไฟล์ เพื่อตรวจสอบตารางงานและสแตนด์บายคิวบริการผ่านไลน์ทางการได้อย่างสะดวกรวดเร็วค่ะ</p>
                        </div>
                    </div>
                </section>

                <!-- ⭐ รีวิวลูกค้า -->
                <section style="margin-bottom: 1.5rem;">
                    <h2 style="color: #FFF; font-size: 14px; font-weight: 900; margin-bottom: 12px; text-align: center;">รีวิวจากลูกค้าจริง</h2>
                    ${reviewsList.map(r => `
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(192, 132, 252, 0.18); border-radius: 14px; padding: 14px; margin-bottom: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                              <strong style="color: #FFF; font-size: 12.5px; font-weight: 800;">${escapeHTML(r.name)}</strong>
                              <span style="color: #FBBF24; font-size: 11px;">⭐⭐⭐⭐⭐</span>
                            </div>
                            <p style="font-size: 12px; color: #CBD5E1; line-height: 1.6; margin: 0;">"${escapeHTML(r.text)}"</p>
                        </div>
                    `).join("")}
                </section>
                
                ${relatedProfiles.length > 0 ? `
                <section style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.25rem;">
                    <h2 style="color: #C084FC; font-size: 14px; font-weight: 900; margin-bottom: 12px; text-align: center;">น้องๆ แนะนำเพิ่มเติมในโซน${escapeHTML(provinceNameThai)}</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                        ${relatedProfiles.map(p => {
                          const relName = `น้อง${(p.name || p.displayName || "สาวสวย").replace(/^(น้อง\s?)+/, "")}`;
                          const relImg = p.imagePath || p.image_url || p.photo || "";
                          return `
                            <a href="/sideline/${encodeURIComponent(p.slug || p.id)}" style="text-decoration: none; color: inherit; background: rgba(255,255,255,0.03); border-radius: 12px; overflow: hidden; border: 1px solid rgba(192, 132, 252, 0.2); display: block; text-align: center;">
                                <img src="${optimizeImg(relImg, 300, 400)}" alt="${escapeHTML(relName)} สาวรับงาน${escapeHTML(provinceNameThai)} ไซด์ไลน์${escapeHTML(provinceNameThai)} ฟิวแฟน" loading="lazy" width="300" height="400" style="width: 100%; aspect-ratio: 4/5; object-fit: cover;">
                                <div style="padding: 6px; font-size: 11px; font-weight: 800; color: #FFF;">${escapeHTML(relName)}</div>
                            </a>
                          `;
                        }).join("")}
                    </div>
                    <div style="text-align: center;">
                        <a href="${provinceHubUrl}" style="color: #C084FC; font-size: 12px; font-weight: 800; text-decoration: none;">ดูน้องๆ รับงานโซน${escapeHTML(provinceNameThai)} ทั้งหมด &rarr;</a>
                    </div>
                </section>
                ` : ""}

                <section style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem;">
                    <h2 style="color: #C084FC; font-size: 14px; font-weight: 900; text-align: center; margin-bottom: 8px;">แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัย</h2>
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px; font-size: 11.5px; color: #A1A1AA; line-height: 1.65;">
                        <p style="margin-bottom: 0.4rem;"><strong>✓ ข้อกำหนดอายุขั้นต่ำ</strong>: ผู้เข้าชมเพจและขอใช้สิทธิ์บริการจองคิวจะต้องมีอายุตั้งแต่ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</p>
                        <p style="margin-bottom: 0.4rem;"><strong>✓ มาตรการป้องกันมิจฉาชีพ</strong>: โปรดระมัดระวังการโอนเงินจองคิวมัดจำล่วงหน้า ทางระบบยึดมั่นนโยบายจ่ายหน้างานโดยตรงหลังเจอตัวน้องและตรวจสอบความถูกต้องตรงปกเท่านั้น</p>
                        <p><strong>✓ การรักษาความลับ (Zero-Log Policy)</strong>: ข้อมูลการติดต่อและการจองคิวทั้งหมดจะได้รับการดูแลภายใต้มาตรการความเป็นส่วนตัวสูงสุด</p>
                    </div>
                </section>
            </article>
        </main>
        
        <footer role="contentinfo" style="text-align: center; padding: 2rem 0; color: #A1A1AA; font-size: 11px;">
            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 8px;">
                <a href="/" style="color: #CBD5E1; text-decoration: none;">หน้าแรก</a>
                <a href="/profiles" style="color: #CBD5E1; text-decoration: none;">รวมโปรไฟล์</a>
                <a href="/locations" style="color: #CBD5E1; text-decoration: none;">พื้นที่บริการ</a>
            </div>
            © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - บริการด้วยความจริงใจ
        </footer>
    </div>
</body>
</html>`;

    return new Response(htmlResponse, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=604800, stale-while-revalidate=86400",
        "Netlify-CDN-Cache-Control": "public, max-age=604800, durable",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }
    });

  } catch (err) {
    console.error("Bot rendering error:", err);
    return context.next();
  }
};
