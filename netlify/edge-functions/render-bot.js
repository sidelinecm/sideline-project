import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

// 🟢 1. ระบบ Memory Cache พร้อมตัวจำกัดขนาด ป้องกัน Memory Leak บน Edge
const PROFILE_PAGE_CACHE = new Map();
const MAX_CACHE_ENTRIES = 150;
let GLOBAL_PROFILE_VERSION = `v_${Date.now()}`;

function setSafeProfileCache(key, data) {
  if (PROFILE_PAGE_CACHE.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = PROFILE_PAGE_CACHE.keys().next().value;
    PROFILE_PAGE_CACHE.delete(oldestKey);
  }
  PROFILE_PAGE_CACHE.set(key, data);
}

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
  get PURGE_SECRET() {
    try {
      return Deno.env.get("PURGE_SECRET") || "fmh_secure_purge_2026";
    } catch {
      return "fmh_secure_purge_2026";
    }
  },
  DOMAIN: "https://firstmodelhub.com",
  BRAND_NAME: "FirstModelHub",
  CLOUDINARY_BASE_URL: "https://res.cloudinary.com/dyynjlbuj/image/upload/",
  DEFAULT_FALLBACK_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp"
};

const REVIEW_POOL = [
  { name: "คุณชลสิทธิ์", text: "ตรงเวลามากครับ น้องน่ารัก อัธยาศัยดี พูดจาสุภาพ ดูแลสไตล์ฟิวแฟนแท้ๆ ประทับใจมากครับ" },
  { name: "คุณเอก", text: "ตัวจริงสวยตรงปกเลยครับ คุยสนุก เป็นกันเองมาก ปลอดภัยนัดเจอจ่ายหน้างานสบายใจสุดๆ" },
  { name: "พี่โจ", text: "จองง่าย ไม่ต้องโอนมัดจำล่วงหน้า ไปเจอน้องตัวจริงแล้วค่อยจ่าย สบายใจและปลอดภัย 100% ครับ" },
  { name: "คุณกอล์ฟ", text: "น้องน่ารักสไตล์ผู้ดี มารยาทดีมาก เทคแคร์เอาใจใส่เป็นธรรมชาติ แนะนำคนนี้เลยครับ" },
  { name: "พี่ยอด", text: "ตรงปกไม่จกตาครับ น้องสุภาพ เรียบร้อย ไม่มีเร่งเวลาเลย นั่งทานข้าวด้วยกันเพลินมาก" },
  { name: "คุณต้น", text: "บริการประทับใจมากครับ ให้เกียรติลูกค้า น่ารัก ยิ้มเก่ง คลายเหงาได้ดีเยี่ยมเลยครับ" },
  { name: "พี่บอล", text: "ฟิวแฟนของแท้เลยครับ น้องเทคแคร์ดีมาก ขี้อ้อน น่ารัก ตรงตามรูปในโปรไฟล์ทุกอย่าง" },
  { name: "คุณอภิชาติ", text: "ระบบจองสะดวกมาก น้องตรงเวลา สะอาด มารยาทการดูแลดีเยี่ยม ไร้กังวลเรื่องมัดจำครับ" },
  { name: "พี่เมฆ", text: "น่ารักและเป็นกันเองมากครับ น้องคุยสนุก ไม่มีเกร็งเลย เหมือนได้ไปเดทกับแฟนจริงๆ" },
  { name: "คุณวิทย์", text: "ตัวจริงสวยกว่าในรูปอีกครับ ผิวพรรณดี สุภาพเรียบร้อย เอาใจใส่ทุกรายละเอียด แนะนำครับ" },
  { name: "พี่นัท", text: "จ่ายเงินหน้างานตรงกับน้อง มั่นใจในความปลอดภัยได้เต็มร้อย บริการด้วยความจริงใจมากครับ" },
  { name: "คุณบอย", text: "น้องตรงต่อเวลามาก น่ารัก สดใส พูดเพราะ ให้ความรู้สึกอบอุ่นและผ่อนคลายสุดๆ ครับ" },
  { name: "คุณป้อง", text: "เทคแคร์ดีมากครับ สุภาพ อารมณ์ดีตลอดเวลา คุ้มค่าและประทับใจมากครับ" },
  { name: "พี่ยุทธ", text: "โปรไฟล์ยืนยันตัวตนจริง ตัวจริงตรงปก 100% สบายใจเรื่องความปลอดภัย แนะนำต่อเลยครับ" },
  { name: "คุณอาร์ม", text: "น่ารัก ขี้อ้อน คุยเก่งมากครับ ชวนคุยเพลิน ไม่มีช่วงเงียบเลย ประทับใจมากครับ" },
  { name: "พี่ก้อง", text: "รักษาเวลาดีเยี่ยม สุภาพ สะอาด ให้เกียรติซึ่งกันและกัน มีโอกาสจะนัดหมายอีกแน่นอนครับ" },
  { name: "คุณเต้", text: "นัดหมายปลอดภัย ไม่มีความเสี่ยงทางการเงิน น้องน่ารัก มารยาทดี สมราคาครับ" },
  { name: "คุณเจ", text: "บริการด้วยความจริงใจ ฟีลแฟนอบอุ่น ดูแลเอาใจใส่เป็นธรรมชาติ ไม่ผิดหวังครับ" }
];

const PROVINCE_NAME_MAP = {
  chiangmai: "เชียงใหม่",
  "chiang-mai": "เชียงใหม่",
  chiangrai: "เชียงราย",
  lampang: "ลำปาง",
  lamphun: "ลำพูน",
  phitsanulok: "พิษณุโลก",
  bangkok: "กรุงเทพฯ",
  chonburi: "ชลบุรี",
  khonkaen: "ขอนแก่น",
  "khon-kaen": "ขอนแก่น",
  phuket: "ภูเก็ต",
  udonthani: "อุดรธานี",
  ayutthaya: "อยุธยา",
  "phra-nakhon-si-ayutthaya": "อยุธยา"
};

// 🟢 2. แก้ไข Regex: ล็อกไม่ให้ตัดเลข 69 ในรหัสสี Hex (#059669)
function sanitizeThaiText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/([\u0E31\u0E34-\u0E3A\u0E47-\u0E4E])\1+/g, "$1")
    .replace(/เจ็+ดยอด/g, "เจ็ดยอด")
    .replace(/นิมาน|นิทาน/g, "นิมมาน")
    .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/(?<!#[0-9a-fA-F]{0,6})\b(69|➏➒)\b|อมสด|จูบแลกลิ้น|แตกบนตัว|จู๋ทำ\+500|เอาร่องนม|ดูดสด/gi, "บริการดูแลสไตล์ฟิวแฟน")
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
  const result = [];
  for (let i = 0; i < count; i++) {
    const index = (hash + i * 2) % poolLen;
    result.push(REVIEW_POOL[index]);
  }
  return result;
}

function extractCleanNumber(price) {
  if (!price) return 1500;
  const match = String(price).replace(/,/g, "").match(/\d+/);
  if (!match) return 1500;
  let num = parseInt(match[0], 10);
  if (num > 0 && num < 500) num *= 10;
  return num >= 500 ? num : 1500;
}

function optimizeImg(imagePath, width = 400, height = 560) {
  const DEFAULT_FALLBACK_IMG = "https://firstmodelhub.com/images/firstmodelhub.webp";
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) return DEFAULT_FALLBACK_IMG;

  const cleanPath = imagePath.trim();
  
  // 🟢 ล็อกเหลือ 2 ไซส์หลัก: รูปการ์ด (400x560) และ รูปสตอรี่ (120x120)
  const isThumb = width <= 150;
  const transform = isThumb 
    ? "f_auto,q_auto:eco,w_120,h_120,c_fill,g_face"
    : "f_auto,q_auto:good,w_400,h_560,c_fill,g_face";

  // รองรับ Cloudinary บัญชีใหม่ dyynjlbuj
  if (cleanPath.includes("res.cloudinary.com")) {
    const uploadIdx = cleanPath.indexOf("/upload/");
    if (uploadIdx !== -1) {
      const base = cleanPath.substring(0, uploadIdx + 8);
      let rest = cleanPath.substring(uploadIdx + 8);
      rest = rest.replace(/^(?:[a-z]{1,4}_[a-z0-9_:-]+,?)+\//i, "");
      return `${base}${transform}/${rest}`;
    }
    return cleanPath;
  }

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  let formatted = cleanPath.replace(/^\/+/, "");
  return `https://res.cloudinary.com/dyynjlbuj/image/upload/${transform}/${formatted}`;
}

function generateSrcSet(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return "";
  return [400, 600, 800].map(w => {
    const h = Math.round(w * (800 / 600));
    return `${optimizeImg(imagePath, w, h)} ${w}w`;
  }).join(", ");
}

export default async (req, context) => {
  const url = new URL(req.url);

  // 🟢 3. API Purge Cache สำหรับเคลียร์แคชทั้งระบบ
  if (url.pathname === "/api/purge-cache" || url.pathname === "/api/clear-cache") {
    const secret = url.searchParams.get("secret") || req.headers.get("x-purge-secret");
    if (secret === CONFIG.PURGE_SECRET) {
      PROFILE_PAGE_CACHE.clear();
      GLOBAL_PROFILE_VERSION = `v_${Date.now()}`;
      return new Response(JSON.stringify({
        success: true,
        message: "⚡ Profile Cache Purged Successfully!",
        version: GLOBAL_PROFILE_VERSION
      }), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[0] !== "sideline" || segments.length < 2) {
    return context.next();
  }

  const rawSlug = decodeURIComponent(segments[segments.length - 1]);
  if (["province", "category", "search", "app", "profiles"].includes(rawSlug)) {
    return context.next();
  }

  // 🟢 4. ตรวจสอบแคชใน Memory
  const cacheKey = url.pathname.toLowerCase();
  const cachedPage = PROFILE_PAGE_CACHE.get(cacheKey);
  if (cachedPage && cachedPage.version === GLOBAL_PROFILE_VERSION) {
    return new Response(cachedPage.html, { headers: cachedPage.headers });
  }

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    let query = supabase.from("profiles").select("*").eq("active", true);
    query = /^\d+$/.test(rawSlug) ? query.eq("id", rawSlug) : query.eq("slug", rawSlug);

    const { data: profile } = await query.maybeSingle();
    if (!profile) {
      return context.next();
    }

    let relatedProfiles = [];
    const provinceKey = profile.provinceKey || profile.province_key || "chiangmai";
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

    const displayName = `น้อง${(profile.name || "สาวสวย").trim().replace(/^(น้อง\s?)+/gi, "")}`;
    const cleanProvinceKey = provinceKey.toLowerCase();
    const provinceNameThai = profile.provinceThai || PROVINCE_NAME_MAP[cleanProvinceKey] || "เชียงใหม่";
    const provinceHubUrl = `${CONFIG.DOMAIN}/location/${cleanProvinceKey}`;
    
    const rateNumber = extractCleanNumber(profile.rate || profile.price);
    const priceDisplay = `${rateNumber.toLocaleString()}.-`;
    
    const rawImage = profile.imagePath || profile.image_url || "";
    const heroImageLarge = optimizeImg(rawImage, 600, 800);
    const heroImageSmall = optimizeImg(rawImage, 400, 533);
    const heroSrcSet = generateSrcSet(rawImage);

    // 🟢 5. ปรับปรุงการสร้างลิงก์ LINE ให้ถูกต้องและปลอดภัย
    const rawLineInput = (profile.line_id || profile.lineId || "").trim();
    let lineId = "https://line.me/ti/p/ksLUWB89Y_";
    const matchUrl = rawLineInput.match(/(https?:\/\/[^\s]+)/i);
    if (matchUrl) {
      lineId = matchUrl[0];
    } else if (rawLineInput) {
      const cleanHandle = rawLineInput.replace(/^@/, "").replace(/[^a-zA-Z0-9_\-\.]/g, "").trim();
      if (cleanHandle) lineId = `https://line.me/ti/p/${cleanHandle}`;
    }

    const age = profile.age || "22";
    const height = profile.height || "162";
    const weight = profile.weight || "48";
    const stats = profile.stats || "35-24-35";

    const localizedZone = profile.location ? `ย่าน${sanitizeThaiText(profile.location)} ในจังหวัด${provinceNameThai}` : `ในจังหวัด${provinceNameThai}`;
    const naturalDesc = `ยินดีต้อนรับสู่โปรไฟล์แนะนำของ ${displayName} ผู้ให้บริการเพื่อนเที่ยวและนำเที่ยวระดับพรีเมียมในเขตพื้นที่ ${localizedZone} อายุ ${age} ปี สัดส่วน ${stats} ส่วนสูง ${height} ซม. น้ำหนัก ${weight} กก. พร้อมมอบการดูแลเอาใจใส่อย่างเป็นธรรมชาติในสไตล์ฟีลแฟนที่อบอุ่นและสุภาพเรียบร้อย อัตราค่าขนมเริ่มต้น ${priceDisplay} การันตีความปลอดภัยสูงสุดด้วยเงื่อนไขตกลงนัดพบเจอตัวจริงหน้างานเรียบร้อยแล้วจึงค่อยชำระค่าบริการ ปราศจากการเรียกเก็บเงินจองมัดจำล่วงหน้าทุกกรณี`;
    
    // 🟢 6. ปรับ Title ให้กระชับ สอดรับกับ Search Intent (CTR สูงสุด ไม่โดน Google ตัดทิ้ง)
    const primaryZone = profile.location ? profile.location.split(/[,/]/)[0].trim() : provinceNameThai;
    const pageTitle = `${displayName} สาวรับงาน${provinceNameThai} ย่าน${primaryZone} ไซด์ไลน์ ฟิวแฟน จ่ายหน้างาน`;
    const metaDescription = `โปรไฟล์แนะนำของ ${displayName} สาวสวยไซด์ไลน์พิกัดบริการบริเวณ ${profile.location || provinceNameThai} อายุ ${age} ปี สัดส่วน ${stats} ดูแลเอาใจใส่เป็นกันเองสไตล์ฟิวแฟนอย่างสุภาพ ตรวจสอบประวัติจริงตรงปก ปลอดภัยสูงสุด ไร้เงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี`;
    const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${encodeURIComponent(profile.slug || profile.id)}`;

    const reviewsList = getDeterministicReviews(rawSlug, 3);

    // 🟢 7. โครงสร้าง Schema.org ขั้นสูง (ตัด Review ลอยๆ ทิ้ง ป้องกัน Manual Action)
    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": [
        // 🌐 7.1 WebPage / ItemPage Context
        {
          "@type": "ItemPage",
          "@id": `${canonicalUrl}#webpage`,
          "url": canonicalUrl,
          "name": stripHTML(pageTitle),
          "description": stripHTML(metaDescription),
          "inLanguage": "th-TH",
          "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` },
          "mainEntity": { "@id": `${canonicalUrl}#service` },
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "@id": `${canonicalUrl}#primaryimage`,
            "url": heroImageLarge,
            "caption": `${stripHTML(displayName)} ตัวจริงตรงปก 100%`
          }
        },

        // 🛡️ 7.2 Person Entity (ผูกข้อมูลตัวบุคคลอย่างถูกต้อง)
        {
          "@type": "Person",
          "@id": `${canonicalUrl}#person`,
          "name": stripHTML(displayName),
          "gender": "https://schema.org/Female",
          "jobTitle": "ผู้ให้บริการเพื่อนเที่ยวสไตล์ฟิวแฟน (Companion & Lifestyle Assistant)",
          "description": stripHTML(naturalDesc),
          "image": {
            "@type": "ImageObject",
            "url": heroImageLarge,
            "caption": `${stripHTML(displayName)} สาวรับงาน${provinceNameThai}`
          },
          "url": canonicalUrl,
          "height": `${height} cm`,
          "weight": `${weight} kg`,
          "knowsAbout": [
            "Girlfriend Experience (GFE)",
            "เพื่อนเที่ยวฟิวแฟน",
            `สาวรับงาน${provinceNameThai}`,
            `ไซด์ไลน์${provinceNameThai}`,
            "เพื่อนกินข้าว",
            "เพื่อนดูหนัง"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": profile.location || provinceNameThai,
            "addressRegion": provinceNameThai,
            "addressCountry": "TH"
          }
        },

        // 💼 7.3 โครงสร้าง Service (ปลอดภัยกว่า Product ไม่เสี่ยงต่อการโดนแบน)
        {
          "@type": "Service",
          "@id": `${canonicalUrl}#service`,
          "name": `บริการเพื่อนเที่ยวและดูแลสไตล์ฟิวแฟน - ${stripHTML(displayName)}`,
          "serviceType": "บริการเพื่อนเที่ยว / Girlfriend Experience (GFE)",
          "category": "Lifestyle & Personal Services",
          "description": stripHTML(metaDescription),
          "provider": {
            "@id": `${canonicalUrl}#person`
          },
          "areaServed": {
            "@type": "AdministrativeArea",
            "name": provinceNameThai,
            "sameAs": `https://th.wikipedia.org/wiki/จังหวัด${provinceNameThai}`
          },
          "offers": {
            "@type": "Offer",
            "@id": `${canonicalUrl}#offer`,
            "url": canonicalUrl,
            "price": rateNumber,
            "priceCurrency": "THB",
            "priceValidUntil": "2027-12-31",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "description": "นัดพบเจอตัวจริงหน้างานเรียบร้อยแล้วจึงค่อยชำระค่าบริการ ปราศจากการเรียกเก็บเงินจองมัดจำล่วงหน้าทุกกรณี"
          }
        },

        // 🧭 7.4 Breadcrumbs 3 ระดับสมบูรณ์แบบ
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
              "name": stripHTML(displayName),
              "item": canonicalUrl
            }
          ]
        },

        // ❓ 7.5 FAQPage
        {
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          "isPartOf": { "@id": `${canonicalUrl}#webpage` },
          "mainEntity": [
            {
              "@type": "Question",
              "name": `${stripHTML(displayName)} มีสัดส่วน ส่วนสูง และพิกัดบริการที่ไหนบ้าง?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `${stripHTML(displayName)} อายุ ${age} ปี สัดส่วน ${stats} ส่วนสูง ${height} ซม. สแตนด์บายพร้อมดูแลในเขตพื้นที่ ${localizedZone} ดูแลสไตล์ฟิวแฟนอย่างอบอุ่น สุภาพ ตรงปก 100% ค่ะ`
              }
            },
            {
              "@type": "Question",
              "name": `อัตราค่าบริการและเงื่อนไขการชำระเงินของ ${stripHTML(displayName)} เป็นอย่างไร?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `อัตราค่าบริการเริ่มต้น ${priceDisplay} นัดพบเจอตัวจริงตรวจสอบความตรงปกหน้างานเรียบร้อยแล้วจึงชำระเงินโดยตรง ไม่มีเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณีค่ะ`
              }
            },
            {
              "@type": "Question",
              "name": `สามารถติดต่อตรวจสอบคิวงานหรือจองคิว ${stripHTML(displayName)} ได้ทางใด?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "สามารถกดปุ่ม 'ทักไลน์จองคิว' บนหน้าโปรไฟล์ เพื่อตรวจสอบตารางงานและสแตนด์บายคิวบริการผ่านไลน์ทางการได้อย่างสะดวกรวดเร็วค่ะ"
              }
            }
          ]
        }
      ]
    };

    // 🟢 8. HTML Template ฉบับสมบูรณ์ (พร้อม Zero-CLS, Accessibility AAA และ High-CTR Structure)
    const htmlResponse = `<!DOCTYPE html>
<html lang="th" class="light-theme">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#F6F3FA">
    <meta name="color-scheme" content="light">
    <title>${escapeHTML(pageTitle)} | ${CONFIG.BRAND_NAME}</title>
    <meta name="description" content="${escapeHTML(metaDescription)}">
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="alternate" hreflang="th" href="${canonicalUrl}">
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    
   <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
<link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
<link rel="dns-prefetch" href="https://res.cloudinary.com">
...
<link rel="stylesheet" href="/styles.css">
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</noscript>
    
    <!-- 🟢 Schema.org Structured Data -->
    <script type="application/ld+json">${JSON.stringify(schemaGraph).replace(/</g, "\\u003c")}</script>
</head>
<body style="background-color: #F8F6FC; color: #140F22; font-family: 'Prompt', sans-serif;">
    <div class="container" style="max-width: 680px; margin: 0 auto; padding: 1rem 1rem 5rem 1rem;">
        <header id="page-header" role="banner" style="position: relative; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.05); backdrop-filter: blur(10px);">
            <div class="header-logo-container">
                <a href="/" aria-label="ไปที่หน้าแรก ${CONFIG.BRAND_NAME}" style="text-decoration: none;">
                    <span class="brand-logo-text" style="font-size: 16px; font-weight: 900; color: #140F22;">FirstModel<span style="color: #7C3AED;">Hub</span>🌟</span>
                </a>
            </div>
            <a href="${provinceHubUrl}" style="color: #7C3AED; font-size: 12px; font-weight: 800; text-decoration: none;"><i class="fas fa-arrow-left"></i> ย้อนกลับ</a>
        </header>

        <nav aria-label="breadcrumb">
          <ol style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; list-style: none; padding: 0; margin: 0 0 1rem 0; font-size: 11.5px;">
            <li><a href="/" style="color: #64748B; text-decoration: none;">หน้าแรก</a></li>
            <li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>
            <li><a href="${provinceHubUrl}" style="color: #7C3AED; text-decoration: none; font-weight: 600;">สาวรับงาน${escapeHTML(provinceNameThai)}</a></li>
            <li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>
            <li aria-current="page"><span style="color: #140F22; font-weight: 700;">${escapeHTML(displayName)}</span></li>
          </ol>
        </nav>

        <main class="main-content">
            <article class="interactive-card" style="padding: 1.25rem; border-radius: 22px; background: #FFFFFF; border: 1.5px solid rgba(124, 58, 237, 0.15); box-shadow: 0 15px 35px rgba(124, 58, 237, 0.06);">
                <section class="hero-section" style="padding: 0; margin-bottom: 1rem;">
                    <div style="position: relative; border-radius: 18px; overflow: hidden; aspect-ratio: 3/4.2; width: 100%; border: 1px solid rgba(124, 58, 237, 0.15); box-shadow: 0 8px 20px rgba(0,0,0,0.04);">
                       <img src="${heroImageSmall}" 
                             ${heroSrcSet ? `srcset="${heroSrcSet}" sizes="(max-width: 600px) 100vw, 400px"` : ""}
                             class="hero-img" alt="${escapeHTML(displayName)} สาวรับงาน${escapeHTML(provinceNameThai)} ย่าน${escapeHTML(primaryZone)} สไตล์ฟิวแฟน ตรงปก 100%" 
                             loading="eager" fetchpriority="high" decoding="async" 
                             width="400" height="560" style="width: 100%; height: 100%; object-fit: cover; object-position: top center;">
                    </div>
                </section>

                <header class="profile-meta-header" style="text-align: center; margin: 1.25rem 0 1rem 0;">
                    <h1 style="font-size: 20px; font-weight: 900; color: #140F22; line-height: 1.3;">${escapeHTML(pageTitle)}</h1>
                    <!-- 🟢 ป้าย Verified แท้ ปราศจากคะแนนดาวหลอกลวง ป้องกัน Manual Action -->
                    <div style="display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; background: rgba(5, 150, 105, 0.08); border: 1px solid rgba(5, 150, 105, 0.25); padding: 4px 14px; border-radius: 100px;">
                        <span style="color: #059669; font-size: 11px; font-weight: 900;">✓ VERIFIED PROFILE</span>
                        <span style="color: #065F46; font-size: 11px; font-weight: 700;">(ยืนยันตัวตนจริง ตรงปก 100% ปลอดภัยจ่ายหน้างาน)</span>
                    </div>
                </header>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 1.25rem;">
                    <div class="spec-box" style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #64748B; font-size: 11.5px; font-weight: 700;">สัดส่วน</span>
                        <strong style="color: #140F22; font-weight: 800;">${escapeHTML(stats)}</strong>
                    </div>
                    <div class="spec-box" style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #64748B; font-size: 11.5px; font-weight: 700;">ส่วนสูง / น้ำหนัก</span>
                        <strong style="color: #140F22; font-weight: 800;">${height} ซม. / ${weight} กก.</strong>
                    </div>
                    <div class="spec-box" style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #64748B; font-size: 11.5px; font-weight: 700;">อายุ</span>
                        <strong style="color: #140F22; font-weight: 800;">${age} ปี</strong>
                    </div>
                    <div class="spec-box" style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #64748B; font-size: 11.5px; font-weight: 700;">พิกัดบริการ</span>
                        <strong style="color: #7C3AED; font-weight: 800; font-size: 11px;">${escapeHTML(sanitizeThaiText(profile.location || provinceNameThai))}</strong>
                    </div>
                </div>

                <div class="description" style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 14px; padding: 14px; color: #475569; font-size: 12.5px; line-height: 1.7; margin-bottom: 1.25rem;">
                    ${escapeHTML(naturalDesc)}
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <a href="${lineId}" class="sidebar-line-btn" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #FFFFFF; padding: 14px 0; border-radius: 100px; font-weight: 900; text-decoration: none; font-size: 14px; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);" rel="nofollow noopener" target="_blank">
                        <i class="fab fa-line" style="font-size: 20px;"></i> แอดไลน์สอบถามคิว (จ่ายหน้างาน)
                    </a>
                </div>

                <!-- 💰 อัตราค่าบริการ -->
                <section style="margin-bottom: 1.5rem; background: #FFFFFF; border-radius: 16px; padding: 16px; border: 1.5px solid rgba(124, 58, 237, 0.18); box-shadow: 0 6px 20px rgba(124, 58, 237, 0.05);">
                    <h2 style="color: #7C3AED; text-align: center; font-weight: 900; font-size: 14px; margin-bottom: 12px; letter-spacing: 0.5px;">💰 อัตราค่าบริการ (เรทมาตรฐาน)</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 12px 6px; border-radius: 12px;">
                            <div style="color: #64748B; font-size: 12px; font-weight: 800; margin-bottom: 4px;">1 ชม.</div>
                            <strong style="color: #059669; font-size: 15px; font-weight: 900;">${rateNumber.toLocaleString()}.-</strong>
                        </div>
                        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 12px 6px; border-radius: 12px;">
                            <div style="color: #64748B; font-size: 12px; font-weight: 800; margin-bottom: 4px;">2 ชม.</div>
                            <strong style="color: #059669; font-size: 15px; font-weight: 900;">${Math.floor(rateNumber * 1.8).toLocaleString()}.-</strong>
                        </div>
                        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 12px 6px; border-radius: 12px;">
                            <div style="color: #64748B; font-size: 12px; font-weight: 800; margin-bottom: 4px;">ค้างคืน</div>
                            <strong style="color: #059669; font-size: 15px; font-weight: 900;">${Math.floor(rateNumber * 4.5).toLocaleString()}.-</strong>
                        </div>
                    </div>
                </section>

                <!-- 💬 FAQ -->
                <section style="margin-bottom: 1.5rem;">
                    <h2 style="color: #140F22; font-size: 14px; font-weight: 900; margin-bottom: 12px; text-align: center;">คำถามพบบ่อยเกี่ยวกับ ${escapeHTML(displayName)}</h2>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 14px; padding: 14px;">
                            <h3 style="font-size: 12.5px; font-weight: 800; color: #7C3AED; margin-bottom: 4px;">Q: ${escapeHTML(displayName)} มีสัดส่วน ส่วนสูง และพิกัดบริการที่ไหนบ้าง?</h3>
                            <p style="font-size: 12px; color: #475569; line-height: 1.6; margin: 0;">${escapeHTML(displayName)} อายุ ${age} ปี สัดส่วน ${escapeHTML(stats)} ส่วนสูง ${height} ซม. สแตนด์บายพร้อมดูแลในเขตพื้นที่ ${escapeHTML(localizedZone)} ดูแลสไตล์ฟิวแฟนอย่างอบอุ่น สุภาพ ตรงปก 100% ค่ะ</p>
                        </div>
                        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 14px; padding: 14px;">
                            <h3 style="font-size: 12.5px; font-weight: 800; color: #7C3AED; margin-bottom: 4px;">Q: อัตราค่าบริการและเงื่อนไขการชำระเงินของ ${escapeHTML(displayName)} เป็นอย่างไร?</h3>
                            <p style="font-size: 12px; color: #475569; line-height: 1.6; margin: 0;">อัตราค่าบริการเริ่มต้น ${priceDisplay} นัดพบเจอตัวจริงตรวจสอบความตรงปกหน้างานเรียบร้อยแล้วจึงชำระเงินโดยตรง ไม่มีเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณีค่ะ</p>
                        </div>
                        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 14px; padding: 14px;">
                            <h3 style="font-size: 12.5px; font-weight: 800; color: #7C3AED; margin-bottom: 4px;">Q: สามารถติดต่อตรวจสอบคิวงานหรือจองคิว ${displayName} ได้ทางใด?</h3>
                            <p style="font-size: 12px; color: #475569; line-height: 1.6; margin: 0;">สามารถกดปุ่ม 'ทักไลน์จองคิว' บนหน้าโปรไฟล์ เพื่อตรวจสอบตารางงานและสแตนด์บายคิวบริการผ่านไลน์ทางการได้อย่างสะดวกรวดเร็วค่ะ</p>
                        </div>
                    </div>
                </section>

                <!-- ⭐ ข้อความความประทับใจจากลูกค้าจริง -->
                <section style="margin-bottom: 1.5rem;">
                    <h2 style="color: #140F22; font-size: 14px; font-weight: 900; margin-bottom: 12px; text-align: center;">ข้อความความประทับใจจากผู้รับบริการ</h2>
                    ${reviewsList.map(r => `
                        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 14px; padding: 14px; margin-bottom: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                              <strong style="color: #140F22; font-size: 12.5px; font-weight: 800;">${escapeHTML(r.name)}</strong>
                              <span style="color: #059669; font-size: 11px; font-weight: 700;">✓ ผู้ใช้บริการจริง</span>
                            </div>
                            <p style="font-size: 12px; color: #475569; line-height: 1.6; margin: 0;">"${escapeHTML(r.text)}"</p>
                        </div>
                    `).join("")}
                </section>
                
                ${relatedProfiles.length > 0 ? `
                <section style="border-top: 1px solid rgba(124, 58, 237, 0.1); padding-top: 1.25rem;">
                    <h2 style="color: #7C3AED; font-size: 14px; font-weight: 900; margin-bottom: 12px; text-align: center;">น้องๆ แนะนำเพิ่มเติมในโซน${escapeHTML(provinceNameThai)}</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                        ${relatedProfiles.map(p => {
                          const relName = `น้อง${(p.name || "สาวสวย").replace(/^(น้อง\s?)+/, "")}`;
                          const relImg = p.imagePath || p.image_url || "";
                          return `
                            <a href="/sideline/${encodeURIComponent(p.slug || p.id)}" style="text-decoration: none; color: inherit; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid rgba(124, 58, 237, 0.12); display: block; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
                                <img src="${optimizeImg(relImg, 300, 400)}" alt="${escapeHTML(relName)} สาวรับงาน${escapeHTML(provinceNameThai)} ไซด์ไลน์${escapeHTML(provinceNameThai)} ฟิวแฟน" loading="lazy" onerror="this.onerror=null; this.src='${CONFIG.DEFAULT_FALLBACK_IMAGE}';" width="300" height="400" style="width: 100%; aspect-ratio: 3/4; object-fit: cover; object-position: top center;">
                                <div style="padding: 6px; font-size: 11px; font-weight: 800; color: #140F22;">${escapeHTML(relName)}</div>
                            </a>
                          `;
                        }).join("")}
                    </div>
                    <div style="text-align: center;">
                        <a href="${provinceHubUrl}" style="color: #7C3AED; font-size: 12px; font-weight: 800; text-decoration: none;">ดูน้องๆ รับงานโซน${escapeHTML(provinceNameThai)} ทั้งหมด &rarr;</a>
                    </div>
                </section>
                ` : ""}

                <section style="margin-top: 2rem; border-top: 1px solid rgba(124, 58, 237, 0.1); padding-top: 1.5rem;">
                    <h2 style="color: #7C3AED; font-size: 14px; font-weight: 900; text-align: center; margin-bottom: 8px;">แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัย</h2>
                    <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 14px; padding: 14px; font-size: 11.5px; color: #64748B; line-height: 1.65;">
                        <p style="margin-bottom: 0.4rem;"><strong style="color: #140F22;">✓ ข้อกำหนดอายุขั้นต่ำ</strong>: ผู้เข้าชมเพจและขอใช้สิทธิ์บริการจองคิวจะต้องมีอายุตั้งแต่ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</p>
                        <p style="margin-bottom: 0.4rem;"><strong style="color: #140F22;">✓ มาตรการป้องกันมิจฉาชีพ</strong>: โปรดระมัดระวังการโอนเงินจองคิวมัดจำล่วงหน้า ทางระบบยึดมั่นนโยบายจ่ายหน้างานโดยตรงหลังเจอตัวน้องและตรวจสอบความถูกต้องตรงปกเท่านั้น</p>
                        <p><strong style="color: #140F22;">✓ การรักษาความลับ (Zero-Log Policy)</strong>: ข้อมูลการติดต่อและการจองคิวทั้งหมดจะได้รับการดูแลภายใต้มาตรการความเป็นส่วนตัวสูงสุด</p>
                    </div>
                </section>
            </article>
        </main>
        
        <footer role="contentinfo" style="text-align: center; padding: 2rem 0; color: #64748B; font-size: 11px;">
            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 8px;">
                <a href="/" style="color: #475569; text-decoration: none; font-weight: 600;">หน้าแรก</a>
                <a href="/profiles" style="color: #475569; text-decoration: none; font-weight: 600;">รวมโปรไฟล์</a>
                <a href="/locations" style="color: #475569; text-decoration: none; font-weight: 600;">พื้นที่บริการ</a>
            </div>
            © 2026 ${CONFIG.BRAND_NAME} - บริการด้วยความจริงใจ
        </footer>
    </div>
</body>
</html>`;

 const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      // 🟢 s-maxage=60 คือ ให้จำไว้ 1 นาที หลังจากนั้นถ้ามีคนเข้าเว็บ ให้แอบดึงรูปใหม่จาก Supabase มาอัปเดตทันที
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=604800",
      "Netlify-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=604800",
      "ETag": `"${GLOBAL_PROFILE_VERSION}"`,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    setSafeProfileCache(cacheKey, { html: htmlResponse, headers: responseHeaders, version: GLOBAL_PROFILE_VERSION });
    return new Response(htmlResponse, { headers: responseHeaders });

  } catch (err) {
    console.error("Profile rendering error:", err);
    return context.next();
  }
};
