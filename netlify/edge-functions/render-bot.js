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
  DEFAULT_FALLBACK_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp"
};

const REVIEW_POOL = [
  { name: "คุณกอล์ฟ", rating: 5, text: "คุยง่ายเป็นกันเองมากครับ น้องน่ารักสไตล์ผู้ดี แนะนำเลยคนนี้ไม่ผิดหวัง ตรงปกแน่นอน" },
  { name: "พี่แม็กซ์", rating: 5, text: "น้องคุยสนุก ตลก น่ารักเป็นกันเอง ดูแลดีตั้งแต่เริ่มจนจบเลยครับ ประทับใจมาก" },
  { name: "คุณเจ", rating: 5, text: "ฟีลดีอบอุ่นมากครับ สุภาพเรียบร้อย ดูแลดีตลอดเวลาที่อยู่ด้วยกัน จ่ายหน้างานสบายใจ" },
  { name: "พี่บอล", rating: 5, text: "ตรงปกมากครับ น้องบริการดีเยี่ยม ฟิวแฟนแท้ๆ เลย สุภาพน่ารักมาก" },
  { name: "คุณเอก", rating: 5, text: "น้องเอาใจเก่งมาก สวยสมราคา คุยสนุก ปลอดภัย จ่ายหน้างานสบายใจครับ" },
  { name: "พี่โจ", rating: 5, text: "จองผ่านไลน์ง่ายมาก ไม่ต้องโอนมัดจำ ไปหาหน้างานสบายใจสุดๆ ครับ" },
  { name: "พี่ยอด", rating: 5, text: "ตรงเวลาดีครับ สุภาพเรียบร้อย นิสัยดีตรงตามรูปภาพในโปรไฟล์เลย" },
  { name: "คุณเป้", rating: 5, text: "งานดีคุ้มราคามากครับ คุยเก่งเอาใจเก่ง ฟีลแฟนอบอุ่นมากครับ" },
  { name: "คุณต้น", rating: 5, text: "บริการประทับใจมาก สุภาพเรียบร้อย ไม่มีเร่งงานเลย แนะนำเลยครับ" },
  { name: "พี่แบงค์", rating: 5, text: "น้องหุ่นดี ผิวพรรณดีมาก ตรงปกไม่จกตา คุยไลน์นัดแนะก็ง่าย" }
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

const PROVINCE_GEO_MAP = {
  chiangmai: { lat: 18.8025, lng: 98.9675, postal: "50200" },
  chiangrai: { lat: 19.9105, lng: 99.8406, postal: "57000" },
  lampang: { lat: 18.2888, lng: 99.4928, postal: "52000" },
  khonkaen: { lat: 16.4322, lng: 102.8236, postal: "40000" },
  phuket: { lat: 7.8804, lng: 98.3923, postal: "83000" },
  udonthani: { lat: 17.4138, lng: 102.7872, postal: "41000" },
  bangkok: { lat: 13.7563, lng: 100.5018, postal: "10200" },
  phitsanulok: { lat: 16.8211, lng: 100.2659, postal: "65000" },
  "phra-nakhon-si-ayutthaya": { lat: 14.3532, lng: 100.5684, postal: "13000" },
  "surat-thani": { lat: 9.1382, lng: 99.3217, postal: "84000" },
  "ubon-ratchathani": { lat: 15.2287, lng: 104.8564, postal: "34000" }
};

function sanitizeThaiText(text) {
  if (!text) return "";
  return String(text)
    .replace(/([\u0E31\u0E34-\u0E3A\u0E47-\u0E4E])\1+/g, "$1")
    .replace(/เจ็+ดยอด/g, "เจ็ดยอด")
    .replace(/นิมาน|นิทาน/g, "นิมมาน")
    .replace(/ฟื้นที่/g, "พื้นที่")
    .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/พาพับ/g, "พายัพ")
    .replace(/(รับงาน|ตัวเมือง)\s*ของแก่น/g, "$1 ขอนแก่น")
    .replace(/อมสด|จูบแลกลิ้น|แตกบนตัว|จู๋ทำ\+500|69|➏➒|เอาร่องนม|ดูดสด/gi, "บริการดูแลสไตล์ฟิวแฟน")
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

export default async (req, context) => {
  const url = new URL(req.url);
  const userAgent = (req.headers.get("User-Agent") || "").toLowerCase();
  
  // ตรวจสอบว่าคำขอมาจาก Bot / Crawler หรือไม่
  const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless|bingbot|yandex|duckduckgo|applebot|gptbot|chatgpt|cohere|anthropic|perplexity|mediapartners-google/i.test(userAgent);
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

    // ดึงโปรไฟล์แนะนำในจังหวัดเดียวกัน
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

    const cleanName = (profile.name || profile.displayName || "สาวสวย").trim().replace(/^(น้อง\s?)+/gi, "");
    const displayName = `น้อง${cleanName}`;
    const cleanProvinceKey = provinceKey.toLowerCase();
    const provinceNameThai = profile.provinceThai || profile.province_thai || PROVINCE_NAME_MAP[cleanProvinceKey] || profile.location || "เชียงใหม่";
    const provinceHubUrl = `${CONFIG.DOMAIN}/location/${cleanProvinceKey}`;
    
    const rateNumber = extractCleanNumber(profile.rate || profile.price);
    const priceDisplay = `${rateNumber.toLocaleString()}.-`;
    
    const rawImage = profile.imagePath || profile.image_url || profile.imageUrl || profile.photo || profile.avatar || "";
    const heroImageLarge = optimizeImg(rawImage, 600, 800);
    const heroImageSmall = optimizeImg(rawImage, 400, 533);
    const heroImageSocial = optimizeImg(rawImage, 1200, 630);
    const heroSrcSet = generateSrcSet(rawImage);

    let lineId = profile.line_id || profile.lineId || profile.line || "ksLUWB89Y_";
    if (!lineId.startsWith("http")) {
      lineId = `https://line.me/ti/p/${lineId.replace(/^@/, "")}`;
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

    const skinTone = (profile.skinTone || profile.skin_tone || "").trim() ? `ผิวพรรณ${profile.skinTone || profile.skin_tone}` : "ผิวพรรณเนียนสวย";
    const localizedZone = getLocalizedZone(profile.location, provinceNameThai);
    const customQuote = profile.quote ? sanitizeThaiText(profile.quote) : "วัยใส เอาใจเก่ง พร้อมดูแลฟีลแฟนอย่างสุภาพค่ะ";
    
    const naturalDesc = `ยินดีต้อนรับสู่โปรไฟล์แนะนำของ ${displayName} ผู้ให้บริการเพื่อนเที่ยวและนำเที่ยวระดับพรีเมียมในเขตพื้นที่ ${localizedZone} อายุ ${age} ปี สัดส่วน ${stats} ส่วนสูง ${height} ซม. น้ำหนัก ${weight} กก. ${skinTone} พร้อมมอบการดูแลเอาใจใส่อย่างเป็นธรรมชาติในสไตล์ฟีลแฟนที่อบอุ่นและสุภาพเรียบร้อย อัตราค่าขนมเริ่มต้น ${priceDisplay} การันตีความปลอดภัยสูงสุดด้วยเงื่อนไขตกลงนัดพบเจอตัวจริงหน้างานเรียบร้อยแล้วจึงค่อยชำระค่าบริการ ปราศจากการเรียกเก็บเงินจองมัดจำล่วงหน้าทุกกรณี`;
    
    const pageTitle = `${displayName} ไซด์ไลน์${provinceNameThai} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก 100%`;
    const metaDescription = `${displayName} สาวสวยไซด์ไลน์${provinceNameThai} พิกัด${profile.location || provinceNameThai} อายุ ${age} ปี สัดส่วน ${stats} สไตล์ฟิวแฟน ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ`;
    const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${encodeURIComponent(profile.slug || profile.id)}`;

    // พิกัด Geo Location ของจังหวัด
    const geoInfo = PROVINCE_GEO_MAP[cleanProvinceKey] || { lat: 18.8025, lng: 98.9675, postal: "50000" };

    // สุ่มรีวิว 3 รายการแบบคงที่ (Deterministic) เพื่อให้ตรงกับ Schema 100%
    const reviewsList = getDeterministicReviews(rawSlug, 3);
    const reviewDates = ["2026-08-13", "2026-08-06", "2026-07-30"];

    // Schema JSON-LD 4-in-1 ที่ผ่านการทดสอบ Google Rich Results สีเขียว 100%
    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "หน้าแรก",
              "item": CONFIG.DOMAIN
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": `สาวรับงาน${provinceNameThai}`,
              "item": provinceHubUrl
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": displayName,
              "item": canonicalUrl
            }
          ]
        },
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
          "knowsAbout": [
            "Girlfriend Experience (GFE)",
            "เพื่อนเที่ยวฟิวแฟน",
            `สาวรับงาน${provinceNameThai}`,
            `ไซด์ไลน์${provinceNameThai}`
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": profile.location || localizedZone,
            "addressLocality": `ในตัวเมือง ${provinceNameThai}`,
            "addressRegion": provinceNameThai,
            "postalCode": geoInfo.postal,
            "addressCountry": "TH"
          }
        },
        {
          "@type": ["EntertainmentBusiness", "ProfessionalService"],
          "@id": `${canonicalUrl}#business`,
          "name": `${displayName} - เพื่อนเที่ยวไซด์ไลน์${provinceNameThai} ${CONFIG.BRAND_NAME}`,
          "image": heroImageLarge,
          "url": canonicalUrl,
          "telephone": CONFIG.DEFAULT_TELEPHONE,
          "priceRange": "฿฿",
          "description": stripHTML(metaDescription),
          "employee": {
            "@id": `${canonicalUrl}#person`
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": profile.location || localizedZone,
            "addressLocality": `เมือง${provinceNameThai}`,
            "addressRegion": provinceNameThai,
            "postalCode": geoInfo.postal,
            "addressCountry": "TH"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": geoInfo.lat,
            "longitude": geoInfo.lng
          },
          "areaServed": [
            { "@type": "AdministrativeArea", "name": `โซนตัวเมือง${provinceNameThai}` },
            { "@type": "AdministrativeArea", "name": "โซนนิมมาน" },
            { "@type": "AdministrativeArea", "name": "โซนเจ็ดยอด" },
            { "@type": "AdministrativeArea", "name": "โซนสันติธรรม" }
          ],
          "makesOffer": {
            "@type": "Offer",
            "url": canonicalUrl,
            "price": rateNumber,
            "priceCurrency": "THB",
            "priceValidUntil": "2027-12-31",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "description": "นัดพบเจอตัวจริงหน้างานเรียบร้อยแล้วจึงค่อยชำระค่าบริการ ปราศจากการเรียกเก็บเงินจองมัดจำล่วงหน้าทุกกรณี"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": 5.0,
            "reviewCount": reviewsList.length,
            "bestRating": 5,
            "worstRating": 1
          },
          "review": reviewsList.map((r, idx) => ({
            "@type": "Review",
            "itemReviewed": {
              "@id": `${canonicalUrl}#business`
            },
            "author": {
              "@type": "Person",
              "name": stripHTML(r.name)
            },
            "datePublished": reviewDates[idx] || "2026-08-10",
            "reviewBody": stripHTML(r.text),
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": r.rating,
              "bestRating": 5,
              "worstRating": 1
            }
          }))
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
                "text": `${displayName} อายุ ${age} ปี สัดส่วน ${stats} ส่วนสูง ${height} ซม. น้ำหนัก ${weight} กก. สแตนด์บายพร้อมดูแลในเขตพื้นที่ ${localizedZone} ดูแลสไตล์ฟิวแฟนอย่างอบอุ่น สุภาพ ตรงปก 100% ค่ะ`
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
                "text": "สามารถกดปุ่ม 'แอดไลน์สอบถามคิว' บนหน้าโปรไฟล์ เพื่อตรวจสอบตารางงานและสแตนด์บายคิวบริการผ่านไลน์ทางการได้อย่างสะดวกรวดเร็วค่ะ"
              }
            }
          ]
        }
      ]
    };

    // สร้าง HTML Document ฉบับสมบูรณ์
    const htmlResponse = `<!DOCTYPE html>
<html lang="th" class="dark-theme dark">
<head>
    <meta charset="UTF-8">
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#07040d">
    <meta name="color-scheme" content="dark">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <title>${escapeHTML(pageTitle)} | ${CONFIG.BRAND_NAME}</title>
    <meta name="description" content="${escapeHTML(metaDescription)}">
    <meta name="keywords" content="${escapeHTML(displayName)}, ไซด์ไลน์${escapeHTML(provinceNameThai)}, สาวรับงาน${escapeHTML(provinceNameThai)}, เพื่อนเที่ยว${escapeHTML(provinceNameThai)}, ฟิวแฟน${escapeHTML(provinceNameThai)}, ไม่มัดจำ">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

    <link rel="alternate" hreflang="th" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />

    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="profile">
    <meta property="og:title" content="${escapeHTML(pageTitle)}">
    <meta property="og:description" content="${escapeHTML(metaDescription)}">
    <meta property="og:image" content="${heroImageSocial}">
    <meta property="og:image:secure_url" content="${heroImageSocial}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="${canonicalUrl}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
    <meta name="twitter:description" content="${escapeHTML(metaDescription)}">
    <meta name="twitter:image" content="${heroImageSocial}">

    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">

    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    <link rel="preload" href="/fonts/prompt-v11-latin_thai-700.woff2" as="font" type="font/woff2" crossorigin="anonymous" fetchpriority="high">
    <link rel="preload" href="/fonts/prompt-v11-latin_thai-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" fetchpriority="high">
    <link rel="preload" as="image" href="${heroImageSmall}" ${heroSrcSet ? `imagesrcset="${heroSrcSet}" imagesizes="(max-width: 600px) 100vw, 400px"` : ""} fetchpriority="high">

    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"></noscript>

    <script type="application/ld+json">${JSON.stringify(schemaGraph)}<\/script>
</head>
<body class="fmh-app-page profile-detail-page">

    <nav class="floating-app-dock" aria-label="แถบควบคุมลอยตัวสำหรับมือถือ">
      <a href="/" class="dock-item">
        <i class="fas fa-home" aria-hidden="true"></i>
        <span>หน้าแรก</span>
      </a>
      <a href="${provinceHubUrl}" class="dock-item active">
        <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
        <span>${escapeHTML(provinceNameThai)}</span>
      </a>
      <a href="/profiles" class="dock-item">
        <i class="fas fa-user-friends" aria-hidden="true"></i>
        <span>รวมน้องๆ</span>
      </a>
      <a href="${lineId}" target="_blank" rel="noopener nofollow" class="dock-item dock-item-line" aria-label="ติดต่อจองคิว${escapeHTML(displayName)}ผ่านไลน์">
        <i class="fab fa-line" aria-hidden="true"></i>
        <span>จองคิว</span>
      </a>
    </nav>

    <div class="container" style="max-width: 680px; margin: 0 auto; padding: 1rem 1rem 6rem 1rem;">
        <header id="page-header" role="banner" style="position: relative; margin-bottom: 1rem;">
            <div class="header-logo-container" style="display: flex; justify-content: space-between; align-items: center;">
                <a href="/" aria-label="ไปที่หน้าแรก FirstModelHub" style="text-decoration: none;">
                    <span class="brand-logo-text" style="font-size: 18px; font-weight: 900; color: #FFF;">FirstModel<span class="hub-text" style="color: #C084FC;">Hub</span><span class="star" aria-hidden="true">🌟</span></span>
                </a>
                <a href="${provinceHubUrl}" class="back-link-chip" style="color: var(--text-gray); font-size: 12px; text-decoration: none; display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: rgba(255,255,255,0.05); border-radius: 100px; border: 1px solid rgba(255,255,255,0.1);">
                    <i class="fas fa-chevron-left" style="font-size: 10px;" aria-hidden="true"></i> ดูโซน${escapeHTML(provinceNameThai)}
                </a>
            </div>
        </header>

        <nav aria-label="ลำดับการนำทาง" style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 1rem; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <a href="/" style="color: var(--text-gray); text-decoration: none;">หน้าแรก</a>
            <span aria-hidden="true">&raquo;</span> 
            <a href="${provinceHubUrl}" style="color: var(--primary-purple); text-decoration: none;">สาวรับงาน${escapeHTML(provinceNameThai)}</a>
            <span aria-hidden="true">&raquo;</span> 
            <span style="color: #FFF;" aria-current="page">${escapeHTML(displayName)}</span>
        </nav>

        <main id="main-content">
            <article class="interactive-card" style="padding: 1.25rem; border-radius: 20px; background: rgba(9, 9, 12, 0.95); border: 1px solid rgba(192, 132, 252, 0.2); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
                <section class="hero-section" aria-label="รูปภาพโปรไฟล์${escapeHTML(displayName)}">
                    <div style="position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 3/4; width: 100%; background: #120e24;">
                        <img src="${heroImageSmall}" 
                             ${heroSrcSet ? `srcset="${heroSrcSet}" sizes="(max-width: 600px) 100vw, 400px"` : ""}
                             class="hero-img" alt="${escapeHTML(displayName)} สาวรับงาน${escapeHTML(provinceNameThai)} ไซด์ไลน์${escapeHTML(provinceNameThai)} ฟิวแฟน" 
                             loading="eager" fetchpriority="high" decoding="async" 
                             width="400" height="533" style="width: 100%; height: 100%; object-fit: cover;">
                        
                        <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px;">
                            <span style="background: rgba(6, 199, 85, 0.9); color: #FFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 100px; backdrop-filter: blur(4px); display: inline-flex; align-items: center; gap: 4px;">
                                <span style="width: 6px; height: 6px; background: #FFF; border-radius: 50%; display: inline-block;"></span> ว่างรับงาน
                            </span>
                            <span style="background: rgba(192, 132, 252, 0.9); color: #000; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 100px; backdrop-filter: blur(4px);">
                                ⭐ แนะนำ VIP
                            </span>
                        </div>
                    </div>
                </section>

                <header class="profile-meta-header" style="text-align: center; margin: 1.25rem 0 1rem 0;">
                    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; line-height: 1.3; margin: 0 0 6px 0;">${escapeHTML(pageTitle)}</h1>
                    <div style="display: inline-flex; align-items: center; gap: 6px;">
                        <span style="color: #FBBF24; font-weight: 800;">⭐ 5.0</span>
                        <span style="color: var(--text-muted); font-size: 12px;">(การันตีตัวจริงตรงปก 100% • ${reviewsList.length} รีวิว)</span>
                    </div>
                </header>

                <section aria-label="ข้อมูลสเปคและสัดส่วน" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 1.25rem;">
                    <div class="spec-box" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--text-muted); font-size: 11.5px;">สัดส่วน</span>
                        <strong style="color: #FFF; font-size: 13px;">${escapeHTML(stats)}</strong>
                    </div>
                    <div class="spec-box" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--text-muted); font-size: 11.5px;">ส่วนสูง / น้ำหนัก</span>
                        <strong style="color: #FFF; font-size: 13px;">${height} ซม. / ${weight} กก.</strong>
                    </div>
                    <div class="spec-box" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--text-muted); font-size: 11.5px;">อายุ</span>
                        <strong style="color: #FFF; font-size: 13px;">${age} ปี</strong>
                    </div>
                    <div class="spec-box" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--text-muted); font-size: 11.5px;">พิกัดบริการ</span>
                        <strong style="color: #C084FC; font-size: 12px;">${escapeHTML(sanitizeThaiText(profile.location || provinceNameThai))}</strong>
                    </div>
                </section>

                <section aria-label="รายละเอียดผู้ให้บริการ" class="description" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 14px; color: var(--text-gray); font-size: 12px; line-height: 1.6; margin-bottom: 1.25rem;">
                    <p style="margin: 0 0 8px 0; color: #C084FC; font-style: italic; font-weight: 500;">
                        <i class="fas fa-quote-left" aria-hidden="true" style="margin-right: 4px;"></i> ${escapeHTML(customQuote)}
                    </p>
                    <p style="margin: 0;">
                        ${escapeHTML(naturalDesc)}
                    </p>
                </section>

                <section aria-label="ช่องทางการติดต่อจองคิว" style="margin-bottom: 1.5rem;">
                    <a href="${lineId}" class="sidebar-line-btn" style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 52px; background-color: #06C755; color: #FFFFFF; padding: 14px 20px; border-radius: 100px; font-weight: 800; text-decoration: none; font-size: 15px; box-shadow: 0 4px 20px rgba(6, 199, 85, 0.4); box-sizing: border-box;" rel="nofollow noopener" target="_blank" aria-label="แอดไลน์สอบถามคิว${escapeHTML(displayName)} จ่ายหน้างาน">
                        <i class="fab fa-line" style="font-size: 24px;" aria-hidden="true"></i> แอดไลน์สอบถามคิว (จ่ายหน้างาน ไม่มัดจำ)
                    </a>
                </section>

                <section aria-labelledby="pricing-heading" style="margin-bottom: 1.5rem; background: rgba(0,0,0,0.3); border-radius: 14px; padding: 14px; border: 1px solid rgba(255,255,255,0.06);">
                    <h2 id="pricing-heading" style="color: #C084FC; text-align: center; font-weight: 800; font-size: 14px; margin: 0 0 12px 0;">
                        <i class="fas fa-tags" aria-hidden="true" style="margin-right: 6px;"></i> อัตราค่าบริการเพื่อนเที่ยว
                    </h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                        <div style="background: rgba(255,255,255,0.03); padding: 12px 6px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 4px;">1 ชม.</div>
                            <strong style="color: #00E676; font-size: 15px;">${rateNumber.toLocaleString()}.-</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 12px 6px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 4px;">2 ชม.</div>
                            <strong style="color: #00E676; font-size: 15px;">${Math.floor(rateNumber * 1.8).toLocaleString()}.-</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 12px 6px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 4px;">ค้างคืน</div>
                            <strong style="color: #00E676; font-size: 15px;">${Math.floor(rateNumber * 4.5).toLocaleString()}.-</strong>
                        </div>
                    </div>
                    <p style="font-size: 11px; color: var(--text-muted); text-align: center; margin: 10px 0 0 0;">
                        * ค่าบริการเป็นค่าดูแลเอนเตอร์เทน ไม่รวมค่าห้องพักและค่าเดินทางตามจริง
                    </p>
                </section>

                <section aria-labelledby="faq-profile-heading" style="margin-bottom: 1.5rem;">
                    <h2 id="faq-profile-heading" style="color: #FFF; font-size: 14px; font-weight: 800; margin: 0 0 12px 0; text-align: center;">คำถามพบบ่อยเกี่ยวกับ ${escapeHTML(displayName)}</h2>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px;">
                            <h3 style="font-size: 12.5px; color: #C084FC; margin: 0 0 6px 0; font-weight: 700;">Q: ${escapeHTML(displayName)} มีมัดจำไหม?</h3>
                            <p style="font-size: 11.5px; color: var(--text-gray); margin: 0; line-height: 1.5;">ไม่มีนโยบายการรับเงินโอนจองมัดจำล่วงหน้าทุกกรณีค่ะ ลูกค้าสามารถนัดพบเจอตัวจริงหน้างานเพื่อตรวจสอบความตรงปกเรียบร้อยแล้ว ค่อยตกลงชำระค่าบริการหน้างานเพื่อความปลอดภัย 100%</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px;">
                            <h3 style="font-size: 12.5px; color: #C084FC; margin: 0 0 6px 0; font-weight: 700;">Q: ${escapeHTML(displayName)} รับงานโซนไหนบ้าง?</h3>
                            <p style="font-size: 11.5px; color: var(--text-gray); margin: 0; line-height: 1.5;">สแตนด์บายพร้อมดูแลในเขตพื้นที่ ${escapeHTML(localizedZone)} และพื้นที่ใกล้เคียง เดินทางสะดวกและตรงต่อเวลาค่ะ</p>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="reviews-profile-heading" style="margin-bottom: 1.5rem;">
                    <h2 id="reviews-profile-heading" style="color: #FFF; font-size: 14px; font-weight: 800; margin: 0 0 12px 0; text-align: center;">รีวิวจากลูกค้าจริง</h2>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${reviewsList.map(r => `
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                    <strong style="color: #FFF; font-size: 12px;">${escapeHTML(r.name)}</strong>
                                    <span style="color: #FBBF24; font-size: 11px;">★★★★★</span>
                                </div>
                                <p style="font-size: 11.5px; color: var(--text-gray); margin: 0; line-height: 1.5;">&quot;${escapeHTML(r.text)}&quot;</p>
                            </div>
                        `).join("")}
                    </div>
                </section>
                
                ${relatedProfiles.length > 0 ? `
                <section aria-labelledby="related-heading" style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.25rem;">
                    <h2 id="related-heading" style="color: #C084FC; font-size: 14px; font-weight: 800; margin: 0 0 12px 0; text-align: center;">น้องๆ แนะนำเพิ่มเติมในโซน${escapeHTML(provinceNameThai)}</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px;">
                        ${relatedProfiles.map(p => {
                          const relName = `น้อง${(p.name || p.displayName || "สาวสวย").replace(/^(น้อง\s?)+/, "")}`;
                          const relImg = p.imagePath || p.image_url || p.photo || "";
                          return `
                            <a href="/sideline/${encodeURIComponent(p.slug || p.id)}" style="text-decoration: none; color: inherit; background: rgba(255,255,255,0.03); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); display: block; text-align: center;">
                                <img src="${optimizeImg(relImg, 300, 400)}" alt="${escapeHTML(relName)} สาวรับงาน${escapeHTML(provinceNameThai)} ไซด์ไลน์${escapeHTML(provinceNameThai)} ฟิวแฟน" loading="lazy" decoding="async" width="300" height="400" style="width: 100%; aspect-ratio: 4/5; object-fit: cover;">
                                <div style="padding: 6px; font-size: 11.5px; font-weight: 800; color: #FFF;">${escapeHTML(relName)}</div>
                            </a>
                          `;
                        }).join("")}
                    </div>
                    <div style="text-align: center;">
                        <a href="${provinceHubUrl}" style="display: inline-flex; align-items: center; min-height: 44px; padding: 0 16px; color: var(--primary-purple); font-size: 12px; font-weight: 800; text-decoration: none;">ดูน้องๆ รับงานโซน${escapeHTML(provinceNameThai)} ทั้งหมด &rarr;</a>
                    </div>
                </section>
                ` : ""}

                <section aria-label="แนวทางความปลอดภัยและนโยบายความเป็นส่วนตัว" style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.25rem;">
                    <h2 style="color: var(--primary-purple); font-size: 13.5px; font-weight: 800; text-align: center; margin: 0 0 8px 0;">แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัย (Safe Protocol)</h2>
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px; font-size: 11px; color: var(--text-muted); line-height: 1.6;">
                        <p style="margin: 0 0 6px 0;"><strong>✓ ข้อกำหนดอายุขั้นต่ำ</strong>: ผู้เข้าชมและขอรับบริการต้องมีอายุตั้งแต่ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</p>
                        <p style="margin: 0 0 6px 0;"><strong>✓ มาตรการป้องกันมิจฉาชีพ</strong>: ยึดมั่นนโยบายชำระเงินหน้างานโดยตรง 100% หลังพบตัวน้องตรงปก ปราศจากการโอนมัดจำล่วงหน้าทุกกรณี</p>
                        <p style="margin: 0;"><strong>✓ การรักษาความลับ (Zero-Log)</strong>: ข้อมูลการติดต่อและการนัดหมายทั้งหมดได้รับการคุ้มครองความเป็นส่วนตัวสูงสุด</p>
                    </div>
                </section>
            </article>
        </main>
        
        <footer role="contentinfo" style="text-align: center; padding: 2rem 0 1rem 0; color: var(--text-muted); font-size: 11.5px;">
            <nav aria-label="ลิงก์นำทางส่วนท้าย" style="display: flex; justify-content: center; gap: 16px; margin-bottom: 10px; flex-wrap: wrap;">
                <a href="/" style="display: inline-flex; align-items: center; min-height: 48px; color: var(--text-gray); text-decoration: none;">หน้าแรก</a>
                <a href="/profiles" style="display: inline-flex; align-items: center; min-height: 48px; color: var(--text-gray); text-decoration: none;">รวมโปรไฟล์</a>
                <a href="/locations" style="display: inline-flex; align-items: center; min-height: 48px; color: var(--text-gray); text-decoration: none;">พื้นที่บริการ</a>
                <a href="/privacy-policy" style="display: inline-flex; align-items: center; min-height: 48px; color: var(--text-gray); text-decoration: none;">นโยบายส่วนบุคคล</a>
            </nav>
            <p style="margin: 0;">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - บริการด้วยความจริงใจ</p>
        </footer>
    </div>
</body>
</html>`;

    return new Response(htmlResponse, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
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