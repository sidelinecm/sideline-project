/**
 * ==============================================================================
 * 💎 FIRST MODEL HUB - ADVANCED DYNAMIC XML SITEMAP ENGINE (sitemap.js)
 * Production-Ready (Synced with ssr-province.js & Zero Duplicate/301 URLs)
 * ==============================================================================
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

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
  PRIMARY_DOMAIN: "https://firstmodelhub.com"
};

/**
 * 🔒 ป้องกัน XML Syntax Error 100%
 */
const escapeXml = (str) => {
  if (!str) return "";
  return String(str).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
};

/**
 * 🧹 ล้างอิโมจิและอักขระเสียหายออกจากข้อความก่อนใส่ <image:title>
 */
const sanitizeTitleText = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/[\uD800-\uDFFF\uFFFD]/g, "")
    .replace(/[🚨🔥💥💦✦✧✨💎👑❤️💗📍]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * ⏰ แปลงวันที่ให้อยู่ในฟอร์แมต ISO 8601 ตามมาตรฐาน Sitemaps.org
 */
const safeGetIsoDate = (dateStr, fallbackIso) => {
  if (!dateStr) return fallbackIso;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return fallbackIso;
    return d.toISOString();
  } catch {
    return fallbackIso;
  }
};

/**
 * 🛡️ ฟังก์ชันสร้าง URL ที่ปลอดภัย 100%
 */
const buildSafeUrl = (baseDomain, path) => {
  const cleanPath = path
    .trim()
    .replace(/[\r\n\t]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/\/+/g, "/");
  return encodeURI(`${baseDomain}${cleanPath}`);
};

/**
 * 📸 ดึงรูปภาพหลักของโปรไฟล์
 */
const getProfileMainImage = (p) => {
  if (!p) return null;
  let img = p.imagePath || p.image_path || p.image_url || p.imageUrl || p.img;
  if (!img) {
    const gallery = p.galleryPaths || p.gallery_paths || p.gallery || p.photos || p.images;
    if (Array.isArray(gallery) && gallery.length > 0) img = gallery[0];
    else if (typeof gallery === "string" && gallery.trim()) img = gallery.split(",")[0].trim();
  }
  if (!img || typeof img !== "string" || img.includes("firstmodelhub.webp")) return null;
  return img.trim();
};

/**
 * 💎 ปรับแต่ง URL รูปภาพสำหรับ Google Image Sitemap
 */
const optimizeImgForXml = (path) => {
  if (!path || typeof path !== "string" || !path.trim()) return null;
  const cleanPath = path.trim();
  const WM_TRANSFORM = "f_auto,q_auto:good,w_600,h_800,c_fill";

  if (cleanPath.includes("res.cloudinary.com")) {
    const fileMatch = cleanPath.match(/(?:v\d+\/)?(images\/[^\s\?]+|[^\/]+\.(?:png|jpg|jpeg|webp|avif))$/i);
    if (fileMatch && fileMatch[1]) {
      return `https://res.cloudinary.com/adjucgga/image/upload/${WM_TRANSFORM}/${fileMatch[1]}`;
    }
    return cleanPath;
  }
  return cleanPath;
};

/**
 * 🧭 กฎแปลง Slug จังหวัดและตรวจจับจังหวัดให้ตรงกับ ssr-province.js 100%
 */
const normalizeProvinceSlug = (rawKey) => {
  const clean = String(rawKey || "").trim().toLowerCase();
  if (!clean) return "";
  if (clean === "chiang_mai" || clean === "chiang-mai") return "chiangmai";
  if (clean === "khonkaen" || clean === "khon_kaen") return "khon-kaen";
  if (clean === "phra-nakhon-si-ayutthaya") return "ayutthaya";
  if (clean === "nakhon-ratchasima" || clean === "nakhonratchasima") return "korat";
  if (clean === "hat-yai" || clean === "hatyai") return "songkhla";
  if (clean === "samui" || clean === "surat-thani") return "suratthani";
  return clean;
};

const PROVINCE_DETECTION_RULES = [
  { key: "chiangmai", keywords: ["เชียงใหม่", "นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก", "หลัง มช", "หน้า มช", "มช.", "ห้วยแก้ว", "สันทราย", "รวมโชค", "พายัพ", "แม่โจ้", "แม่ริม", "หางดง", "ท่าแพ", "คูเมือง", "เซ็นทรัลเฟส"] },
  { key: "bangkok", keywords: ["กรุงเทพ", "กทม", "สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย", "สาทร", "บางนา", "สีลม", "พระราม", "อารีย์"] },
  { key: "chonburi", keywords: ["ชลบุรี", "พัทยา", "บางแสน", "ศรีราชา", "จอมเทียน", "อมตะนคร", "แหลมฉบัง", "บ่อวิน"] },
  { key: "phuket", keywords: ["ภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง", "กะรน", "กะตะ", "บางเทา", "ราไวย์", "เชิงทะเล", "กมลา"] },
  { key: "khon-kaen", keywords: ["ขอนแก่น", "กังสดาล", "หลัง มข", "หน้า มข", "ม.ขอนแก่น", "บึงแก่นนคร", "โนนม่วง", "ม.ภาค", "เซ็นทรัลขอนแก่น", "ศิลา"] },
  { key: "udonthani", keywords: ["อุดรธานี", "อุดร", "ud town", "ยูดี", "หนองประจักษ์", "บ้านจาน", "โพศรี", "ทุ่งศรีเมือง", "เซ็นทรัลอุดร", "รังษิณา", "ไฮเทค"] },
  { key: "chiangrai", keywords: ["เชียงราย", "บ้านดู่", "มฟล", "แม่ฟ้าหลวง", "แม่สาย", "รอบเวียง", "หอนาฬิกา", "ริมกก", "เด่นห้า"] },
  { key: "lampang", keywords: ["ลำปาง", "สวนดอก", "สบตุ๋ย", "ม.ราชภัฏลำปาง", "ราชภัฏลำปาง", "เกาะคา", "อัศวิน", "กาดกองต้า"] },
  { key: "lamphun", keywords: ["ลำพูน", "นิคมลำพูน", "เวียงยอง", "ป่าซาง", "เหมืองง่า", "บ้านกลาง"] },
  { key: "korat", keywords: ["โคราช", "นครราชสีมา", "มทส", "ปากช่อง", "เขาใหญ่", "จอหอ"] },
  { key: "songkhla", keywords: ["หาดใหญ่", "สงขลา", "ม.อ.", "ลีการ์เดนส์", "ด่านนอก", "คอหงส์"] },
  { key: "suratthani", keywords: ["สุราษฎร์", "สมุย", "เกาะสมุย", "เฉวง", "ละไม", "บ่อผุด", "พะงัน"] },
  { key: "ayutthaya", keywords: ["อยุธยา", "โรจนะ", "บางปะอิน", "ประตูชัย", "เสนา"] },
  { key: "phitsanulok", keywords: ["พิษณุโลก", "รอบ มน", "มน.", "ม.นเรศวร", "ท่าโพธิ์", "สมอแข", "ท็อปแลนด์"] }
];

const detectAccurateProvince = (p) => {
  if (!p) return "chiangmai";
  const rawKey = normalizeProvinceSlug(p.provinceKey || p.province_key || p.province_slug || p.province || "");
  const INVALID_KEYS = ["", "no_province", "other", "undefined", "null", "none"];

  if (rawKey && !INVALID_KEYS.includes(rawKey)) {
    return rawKey;
  }

  const fullText = [p.location || "", p.description || "", p.name || ""].join(" ").toLowerCase();
  for (const rule of PROVINCE_DETECTION_RULES) {
    if (rule.keywords.some((kw) => fullText.includes(kw))) return rule.key;
  }
  return "chiangmai";
};

// 📍 รายชื่อโซนย่อยเป้าหมายทั่วประเทศ (Slug ตรงกับ ssr-province.js 100%)
const TARGET_SUB_ZONES = [
  // 1. เชียงใหม่
  { province: "chiangmai", zone: "nimman", matchWords: ["นิมมาน", "nimman", "นิมมานเหมินท์"] },
  { province: "chiangmai", zone: "jedyod", matchWords: ["เจ็ดยอด"] },
  { province: "chiangmai", zone: "santitham", matchWords: ["สันติธรรม"] },
  { province: "chiangmai", zone: "changphueak", matchWords: ["ช้างเผือก"] },
  { province: "chiangmai", zone: "maejo", matchWords: ["แม่โจ้"] },
  { province: "chiangmai", zone: "cmu", matchWords: ["หลัง มช", "หลังมอ", "หลัง มช.", "สุเทพ", "วัดอุโมงค์"] },
  { province: "chiangmai", zone: "front-cmu", matchWords: ["หน้า มช", "หน้ามอ", "หน้า มช.", "กาดมาลิน", "มาลินพลาซ่า"] },
  { province: "chiangmai", zone: "sansai", matchWords: ["สันทราย"] },
  { province: "chiangmai", zone: "hangdong", matchWords: ["หางดง"] },
  { province: "chiangmai", zone: "maerim", matchWords: ["แม่ริม"] },
  { province: "chiangmai", zone: "kumueang", matchWords: ["คูเมือง"] },
  { province: "chiangmai", zone: "thapae", matchWords: ["ท่าแพ"] },
  { province: "chiangmai", zone: "huaykaew", matchWords: ["ห้วยแก้ว"] },
  { province: "chiangmai", zone: "ruamchok", matchWords: ["รวมโชค"] },
  { province: "chiangmai", zone: "payap", matchWords: ["พายัพ"] },
  { province: "chiangmai", zone: "centralfest", matchWords: ["เซ็นทรัลเฟส", "เซ็นทรัลเฟสติวัล"] },
  { province: "chiangmai", zone: "airport-cnx", matchWords: ["สนามบิน", "สนามบินเชียงใหม่"] },

  // 2. กรุงเทพมหานคร
  { province: "bangkok", zone: "sukhumvit", matchWords: ["สุขุมวิท"] },
  { province: "bangkok", zone: "ratchada", matchWords: ["รัชดา"] },
  { province: "bangkok", zone: "huaikhwang", matchWords: ["ห้วยขวาง"] },
  { province: "bangkok", zone: "ladprao", matchWords: ["ลาดพร้าว"] },
  { province: "bangkok", zone: "thonglor", matchWords: ["ทองหล่อ"] },
  { province: "bangkok", zone: "ekkamai", matchWords: ["เอกมัย"] },
  { province: "bangkok", zone: "sathorn", matchWords: ["สาทร"] },
  { province: "bangkok", zone: "silom", matchWords: ["สีลม"] },
  { province: "bangkok", zone: "bangna", matchWords: ["บางนา"] },
  { province: "bangkok", zone: "ramintra", matchWords: ["รามอินทรา"] },
  { province: "bangkok", zone: "rama9", matchWords: ["พระราม 9", "พระราม9"] },
  { province: "bangkok", zone: "ari", matchWords: ["อารีย์"] },

  // 3. ชลบุรี / พัทยา
  { province: "chonburi", zone: "pattaya", matchWords: ["พัทยา"] },
  { province: "chonburi", zone: "pattaya-klang", matchWords: ["พัทยากลาง"] },
  { province: "chonburi", zone: "pattaya-tai", matchWords: ["พัทยาใต้"] },
  { province: "chonburi", zone: "jomtien", matchWords: ["จอมเทียน"] },
  { province: "chonburi", zone: "bangsaen", matchWords: ["บางแสน"] },
  { province: "chonburi", zone: "sriracha", matchWords: ["ศรีราชา"] },
  { province: "chonburi", zone: "mueang-chonburi", matchWords: ["ตัวเมืองชลบุรี", "เมืองชล"] },
  { province: "chonburi", zone: "amata", matchWords: ["อมตะ"] },
  { province: "chonburi", zone: "laemchabang", matchWords: ["แหลมฉบัง"] },
  { province: "chonburi", zone: "bowin", matchWords: ["บ่อวิน"] },

  // 4. ภูเก็ต
  { province: "phuket", zone: "patong", matchWords: ["ป่าตอง"] },
  { province: "phuket", zone: "mueang-phuket", matchWords: ["ตัวเมืองภูเก็ต", "เมืองภูเก็ต", "ในเมือง"] },
  { province: "phuket", zone: "kathu", matchWords: ["กะทู้"] },
  { province: "phuket", zone: "chalong", matchWords: ["ฉลอง"] },
  { province: "phuket", zone: "karon", matchWords: ["กะรน"] },
  { province: "phuket", zone: "kata", matchWords: ["กะตะ"] },
  { province: "phuket", zone: "bangtao", matchWords: ["บางเทา"] },
  { province: "phuket", zone: "rawai", matchWords: ["ราไวย์"] },
  { province: "phuket", zone: "cherngtalay", matchWords: ["เชิงทะเล"] },
  { province: "phuket", zone: "kamala", matchWords: ["กมลา"] },

  // 5. ขอนแก่น
  { province: "khon-kaen", zone: "kangsadan", matchWords: ["กังสดาล", "บึงหนองแวง"] },
  { province: "khon-kaen", zone: "kku", matchWords: ["หลัง มข", "หลัง มข.", "หลัง-มข", "หลังมอ", "โนนม่วง"] },
  { province: "khon-kaen", zone: "kku-front", matchWords: ["หน้า มข", "หน้า มข.", "หน้ามอ"] },
  { province: "khon-kaen", zone: "nonmuang", matchWords: ["โนนม่วง"] },
  { province: "khon-kaen", zone: "central-khonkaen", matchWords: ["เซ็นทรัลขอนแก่น"] },
  { province: "khon-kaen", zone: "buengkaennakhon", matchWords: ["บึงแก่นนคร"] },
  { province: "khon-kaen", zone: "mueang-khonkaen", matchWords: ["ในตัวเมือง", "ในเมือง", "ตัวเมืองขอนแก่น"] },
  { province: "khon-kaen", zone: "m-phak-area", matchWords: ["ม.ภาค"] },

  // 6. เชียงราย
  { province: "chiangrai", zone: "baandu", matchWords: ["บ้านดู่"] },
  { province: "chiangrai", zone: "mfu", matchWords: ["หน้า มฟล", "หน้า มฟล.", "มฟล", "มฟล.", "แม่ฟ้าหลวง"] },
  { province: "chiangrai", zone: "mueang-chiangrai", matchWords: ["ตัวเมือง", "ในเมือง", "เมืองเชียงราย"] },
  { province: "chiangrai", zone: "clock-tower", matchWords: ["หอนาฬิกา"] },
  { province: "chiangrai", zone: "maesai", matchWords: ["แม่สาย"] },

  // 7. อุดรธานี
  { province: "udonthani", zone: "udtown", matchWords: ["ud town", "ยูดีทาวน์", "ยูดี", "udtown", "ud-town"] },
  { province: "udonthani", zone: "nongprajak", matchWords: ["หนองประจักษ์"] },
  { province: "udonthani", zone: "central-udon", matchWords: ["เซ็นทรัลอุดร"] },
  { province: "udonthani", zone: "mueang-udon", matchWords: ["ตัวเมือง", "ในเมือง"] },
  { province: "udonthani", zone: "rangsina", matchWords: ["รังษิณา"] },

  // 8. ลำปาง
  { province: "lampang", zone: "mueang-lampang", matchWords: ["ตัวเมือง", "ในเมือง", "ในเมืองลำปาง"] },
  { province: "lampang", zone: "suan-dok", matchWords: ["สวนดอก"] },
  { province: "lampang", zone: "lpru", matchWords: ["ราชภัฏลำปาง", "ม.ราชภัฏลำปาง"] },
  { province: "lampang", zone: "sob-tui", matchWords: ["สบตุ๋ย"] }
];

const matchProfileToZoneForSitemap = (p, matchWords) => {
  if (!p || !Array.isArray(matchWords) || matchWords.length === 0) return false;
  const rawLoc = String(p.location || "").toLowerCase();
  const safeDesc = String(p.description || "")
    .toLowerCase()
    .replace(/(ไม่รับ|งดรับ|ไม่ไป|ไม่สะดวกไป|ยกเว้น|ไม่พร้อมไป|งดเดินทางไป)[^,.\n]*(โซน|ย่าน)?\s*[\u0E00-\u0E7F0-9]+/gi, " ");
  const rawTags = p.style_tags || p.styleTags || p.tags || [];
  const pTags = (Array.isArray(rawTags) ? rawTags.join(" ") : String(rawTags || "")).toLowerCase();
  const combined = `${rawLoc} ${safeDesc} ${pTags}`;

  return matchWords.some((w) => {
    const wordLower = w.toLowerCase();
    const negPattern = new RegExp(`(ไม่รับ|งดรับ|ไม่ไป|ยกเว้น)[^,.\\n]*${wordLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
    if (negPattern.test(`${rawLoc} ${p.description || ""}`)) return false;
    return combined.includes(wordLower) || combined.includes(wordLower.replace(/\./g, ""));
  });
};

export default async (request, _context) => {
  const domain = CONFIG.PRIMARY_DOMAIN;
  const nowIso = new Date().toISOString();
  const staticLastMod = "2026-11-15T00:00:00.000Z";

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    const [provincesRes, profilesRes] = await Promise.all([
      supabase.from("provinces").select("*"),
      supabase.from("profiles").select("*").eq("active", true).limit(3000)
    ]);

    const provinces = provincesRes.data || [];
    const rawProfiles = profilesRes.data || [];

    // คัดกรองเฉพาะโปรไฟล์ที่ใช้งานได้จริงและระบุจังหวัดแม่นยำ (ตรงกับ ssr-province.js)
    const seenProfileIds = new Set();
    const profiles = [];
    for (const p of rawProfiles) {
      if (!p || !p.id) continue;
      const cleanName = String(p.name || "").trim().toLowerCase().replace(/^(น้อง|สาว|พี่)\s?/gi, "");
      if (!cleanName || cleanName === "model" || cleanName === "สาวสวย" || cleanName === "-") continue;

      const rawImg = String(p.imagePath || p.image_path || p.image_url || p.imageUrl || p.img || "").trim().toLowerCase();
      if (!rawImg || rawImg.includes("firstmodelhub.webp") || rawImg.length < 15) continue;

      const uid = String(p.id);
      if (seenProfileIds.has(uid)) continue;
      seenProfileIds.add(uid);

      p._resolvedProvince = detectAccurateProvince(p);
      profiles.push(p);
    }

    // คำนวณวันอัปเดตล่าสุดจริงต่อจังหวัดและทั้งเว็บ
    let globalLatestDate = staticLastMod;
    const provinceLatestMap = new Map();
    const provinceCountMap = new Map();

    for (const p of profiles) {
      const pk = p._resolvedProvince;
      provinceCountMap.set(pk, (provinceCountMap.get(pk) || 0) + 1);
      const pDate = safeGetIsoDate(p.updated_at || p.created_at, staticLastMod);
      if (pDate > globalLatestDate) globalLatestDate = pDate;
      if (!provinceLatestMap.has(pk) || pDate > provinceLatestMap.get(pk)) {
        provinceLatestMap.set(pk, pDate);
      }
    }

    const seenUrls = new Set();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // 1. Static Pages (เอาบทความพังออก + ใส่บทความจริง + ใช้ lastmod ตามจริง)
    const staticPages = [
      { path: "/", priority: "1.0", changefreq: "daily", lastmod: globalLatestDate },
      { path: "/profiles", priority: "0.9", changefreq: "daily", lastmod: globalLatestDate },
      { path: "/locations", priority: "0.9", changefreq: "weekly", lastmod: staticLastMod },
      { path: "/blog", priority: "0.8", changefreq: "weekly", lastmod: staticLastMod },
      { path: "/blog/what-is-trong-pok", priority: "0.8", changefreq: "monthly", lastmod: staticLastMod },
      { path: "/blog/safe-booking-anti-scam-guide", priority: "0.8", changefreq: "monthly", lastmod: staticLastMod },
      { path: "/blog/vip-etiquette-how-to-book-companion", priority: "0.8", changefreq: "monthly", lastmod: staticLastMod },
      { path: "/about", priority: "0.5", changefreq: "monthly", lastmod: staticLastMod },
      { path: "/faq", priority: "0.5", changefreq: "monthly", lastmod: staticLastMod },
      { path: "/privacy-policy", priority: "0.3", changefreq: "monthly", lastmod: staticLastMod }
    ];

    staticPages.forEach((p) => {
      const fullUrl = domain + p.path;
      if (seenUrls.has(fullUrl)) return;
      seenUrls.add(fullUrl);
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
      xml += `    <lastmod>${p.lastmod || nowIso}</lastmod>\n`;
      xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // 2. Provinces Hubs (ใส่เฉพาะจังหวัดที่มีโปรไฟล์จริง >= 1 คน เพื่อไม่ให้ส่งหน้า noindex เข้า Google)
    const provinceKeysToEmit = new Set();
    provinces.forEach((p) => {
      if (p && p.key) {
        const normKey = normalizeProvinceSlug(p.key);
        if (normKey && (provinceCountMap.get(normKey) || 0) > 0) {
          provinceKeysToEmit.add(normKey);
        }
      }
    });
    for (const [pk, cnt] of provinceCountMap.entries()) {
      if (cnt > 0) provinceKeysToEmit.add(pk);
    }

    for (const cleanKey of provinceKeysToEmit) {
      const provUrl = buildSafeUrl(domain, `/location/${cleanKey}`);
      if (seenUrls.has(provUrl)) continue;
      seenUrls.add(provUrl);
      const provLastMod = provinceLatestMap.get(cleanKey) || globalLatestDate;
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(provUrl)}</loc>\n`;
      xml += `    <lastmod>${provLastMod}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    // 3. Sub-zones Hubs (จับคู่ตรงกับ ssr-province.js + กันซ้ำ 100%)
    TARGET_SUB_ZONES.forEach((sz) => {
      const zoneProfiles = profiles.filter((p) =>
        p._resolvedProvince === sz.province.toLowerCase() &&
        matchProfileToZoneForSitemap(p, sz.matchWords)
      );

      if (zoneProfiles.length === 0) return;

      const zoneUrl = buildSafeUrl(domain, `/location/${sz.province}/${sz.zone}`);
      if (seenUrls.has(zoneUrl)) return;
      seenUrls.add(zoneUrl);

      let zoneLastMod = staticLastMod;
      zoneProfiles.forEach((zp) => {
        const d = safeGetIsoDate(zp.updated_at || zp.created_at, staticLastMod);
        if (d > zoneLastMod) zoneLastMod = d;
      });

      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(zoneUrl)}</loc>\n`;
      xml += `    <lastmod>${zoneLastMod}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    // 4. Profiles (Individual Pages - ปลายทาง 200 OK 100% + กัน URL ซ้ำ + ล้างอีโมจิใน Title)
    profiles.forEach((p) => {
      if (p && (p.slug || p.id)) {
        let rawSlug = String(p.slug || p.id).trim();

        // ถ้า Slug ใน DB เป็นภาษาไทย ให้แปลงเป็น model-ID ทันที (ตรงกับ render-bot.js)
        if (/[\u0E00-\u0E7F]/.test(rawSlug)) {
          rawSlug = `model-${p.id}`;
        }

        const safeProfileUrl = buildSafeUrl(domain, `/sideline/${rawSlug}`);
        if (seenUrls.has(safeProfileUrl)) return;
        seenUrls.add(safeProfileUrl);

        const modDate = safeGetIsoDate(p.updated_at || p.created_at, staticLastMod);

        let imageXml = "";
        const imgPath = getProfileMainImage(p);
        if (imgPath && !imgPath.includes("firstmodelhub.webp")) {
          const imgUrl = optimizeImgForXml(imgPath);
          if (imgUrl) {
            const rawName = sanitizeTitleText(
              p.name ? String(p.name).trim().replace(/^(น้อง\s?)+/gi, "") : "สาวสวย"
            ) || "สาวสวย";
            imageXml = `\n    <image:image>\n      <image:loc>${escapeXml(imgUrl)}</image:loc>\n      <image:title>น้อง${escapeXml(rawName)}</image:title>\n    </image:image>`;
          }
        }

        xml += `  <url>\n    <loc>${escapeXml(safeProfileUrl)}</loc>\n    <lastmod>${modDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>${imageXml}\n  </url>\n`;
      }
    });

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (err) {
    console.error("Sitemap critical error:", err);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${domain}/</loc><lastmod>${nowIso}</lastmod></url></urlset>`,
      {
        status: 200,
        headers: { "Content-Type": "application/xml; charset=utf-8" }
      }
    );
  }
};