import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";
import {
  normalizeProvKey,
  MASTER_ZONES,
  resolveZone,
  getCanonicalProfileSlug,
  safeOptimizeImg
} from "./shared-config.js";

const PROFILE_PAGE_CACHE = new Map();
const MAX_CACHE_ENTRIES = 150;
let GLOBAL_PROFILE_VERSION = `v_20261126_02`;
const ONE_DAY_MS = 86400 * 1000;

function setSafeProfileCache(key, data) {
  if (PROFILE_PAGE_CACHE.size >= MAX_CACHE_ENTRIES) {
    let oldestAccessTime = Infinity;
    let keyToRemove = null;
    for (const [k, v] of PROFILE_PAGE_CACHE.entries()) {
      if ((v.lastAccessed || 0) < oldestAccessTime) {
        oldestAccessTime = v.lastAccessed || 0;
        keyToRemove = k;
      }
    }
    if (keyToRemove) PROFILE_PAGE_CACHE.delete(keyToRemove);
  }
  PROFILE_PAGE_CACHE.set(key, { ...data, cachedAt: Date.now(), lastAccessed: Date.now() });
}

const CONFIG = {
  get SUPABASE_URL() {
    return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co";
  },
  get SUPABASE_KEY() {
    return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4";
  },
  get PURGE_SECRET() {
    return Deno.env.get("PURGE_SECRET") || "";
  },
  DOMAIN: "https://firstmodelhub.com",
  BRAND_NAME: "FirstModelHub",
  DEFAULT_FALLBACK_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp"
};

const LEGACY_PROFILE_REDIRECTS = {
  "ammie": "/sideline/ammie-127",
  "น้องammie": "/sideline/ammie-127",
  "น้องammie-เชียงใหม่": "/sideline/ammie-127",
  "น้องammie-ตัวเมือง": "/sideline/ammie-127",
  "แอมมี่-เชียงใหม่": "/sideline/ammie-127",
  "ammie-chiangmai": "/sideline/ammie-127",
  "น้องammie-ไซด์ไลน์เชียงใหม่": "/sideline/ammie-127",
  "ข้าวปุ้น-เชียงใหม่": "/sideline/khawpun-126",
  "พบกับ-ข้าวปุ้น": "/sideline/khawpun-126",
  "ข้าวปุ้น-รับงานเอง": "/sideline/khawpun-126",
  "ใบข้าว-ในลูก": "/sideline/model-48",
  "ใบข้าว-ในเมือง": "/sideline/model-48",
  "โอลีฟ-ตัวเมืองอุดร": "/sideline/model-43",
  "พะแพง-นิมมาน": "/sideline/model-36",
  "จ๊ะจ๋า-ในเมือง": "/sideline/model-29",
  "ข้าวปุ้น-นิมมาน": "/sideline/model-37",
  "ส้มโอ-ในเมือง": "/sideline/model-32",
  "แบมแบม-นิมมาน": "/sideline/model-55",
  "น้ำหวาน-ในเมือง": "/sideline/model-64",
  "ขนม-ในเมือง": "/sideline/model-21",
  "โกโก้-ในเมือง": "/sideline/model-42",
  "เบบี๋-ในเมือง": "/sideline/model-39",
  "ของขวัญ-นิมมาน": "/sideline/model-17",
  "เกล-ในเมือง": "/sideline/model-22",
  "โกโก้-เชียงใหม่": "/sideline/model-46",
  "อ้ะอาย-สันติธรรม": "/sideline/model-57",
  "กีตาร์-นิมมาน": "/sideline/model-18",
  "ไตเติ้ล": "/sideline/model-10",
  "ป๊อป-เจ็ดยอด": "/sideline/model-14",
  "ข้าวปุ้น-ในเมือง": "/sideline/model-25",
  "สมายด์-สันติธรรม": "/sideline/model-74",
  "การ์ตูน-ลุกณา": "/sideline/model-13",
  "การ์ตูน-ตัวเมืองเชียงใหม่ใกล้เคียง": "/sideline/model-13",
  "โรส-นิมมาน": "/sideline/model-15",
  "แตงกวา-ในเมืองลำปาง": "/sideline/model-44",
  "ไข่เจียว-ในเมือง": "/sideline/model-49",
  "แตงกวา-ในเมือง": "/sideline/model-66",
  "ลูกน้ำ-นิมมาน": "/sideline/model-16",
  "กุ้กไก่-ในเมือง": "/sideline/model-24",
  "ข้าวปุ้น-ในรุ่น": "/sideline/model-19",
  "ข้าวปุ้น-ในตัวเมืองใกล้เคียง": "/sideline/model-19",
  "ข้าวฟ่าง-นิมมาน": "/sideline/model-35",
  "น้องโมจิ": "/sideline/model-7",
  "ของขวัญ-เมืองภูเก็ต": "/sideline/model-33",
  "หญิง": "/sideline/model-9",
  "เบบี๋-ในตัวเมือง": "/sideline/model-12",
  "เบบี๋-ในตัวเมืองเชียงใหม่ใกล้เคียง": "/sideline/model-12",
  "ขนมจีน-ในเมือง": "/sideline/model-34",
  "น้ำอิง-ในเมืองลำปาง": "/sideline/model-45",
  "เดียร์-ในเมือง": "/sideline/model-50",
  "มะนาว-เทพ": "/sideline/model-69",
  "มะนาว-นิมมาน": "/sideline/model-69",
  "ออย": "/sideline/model-6",
  "ออมสิน-เซ็นทรัลขอนแก่น": "/sideline/model-31",
  "เปรี้ยว-เซ็นทรัลอุดร": "/sideline/model-27",
  "กิ๊ฟ-ในเมือง": "/sideline/model-30",
  "ฟิล์ม-ในเมือง": "/sideline/model-28",
  "การ์ตูน-ในเมือง": "/sideline/model-41",
  "เฟย์-ในเมือง": "/sideline/model-47",
  "โดนัท-นิมมาน": "/sideline/model-53",
  "โมอยล์-ในมือ": "/sideline/model-23",
  "โมอาร์-ในเมือง": "/sideline/model-23",
  "กุ้กไก่-สันติธรรม": "/sideline/model-38",
  "มะนาว-เมืองภูเก็ต": "/sideline/model-75",
  "ของขวัญ-มาฟล": "/sideline/model-26",
  "ของขวัญ-ในเมือง": "/sideline/model-26",
  "บีบี-ในมือ": "/sideline/model-54",
  "บีบี-ในเมือง": "/sideline/model-54",
  "หวาน-ตัวมือ": "/sideline/model-80",
  "หวาน-เมืองภูเก็ต": "/sideline/model-80",
  "พิกัดและพื้นที่บริการไซด์ไลน์เชียงใหม่": "/location/chiangmai"
};

const PROVINCE_NAME_MAP = {
  chiangmai: "เชียงใหม่",
  chiangrai: "เชียงราย",
  lampang: "ลำปาง",
  lamphun: "ลำพูน",
  phitsanulok: "พิษณุโลก",
  bangkok: "กรุงเทพฯ",
  chonburi: "ชลบุรี",
  "khon-kaen": "ขอนแก่น",
  phuket: "ภูเก็ต",
  udonthani: "อุดรธานี",
  ayutthaya: "อยุธยา",
  korat: "นครราชสีมา",
  songkhla: "สงขลา-หาดใหญ่",
  suratthani: "สุราษฎร์ธานี"
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

const MUEANG_ZONE_BY_PROVINCE = {
  chiangmai: "kumueang",
  chiangrai: "mueang-chiangrai",
  lampang: "mueang-lampang",
  udonthani: "mueang-udon",
  "khon-kaen": "mueang-khonkaen",
  phuket: "mueang-phuket"
};

function detectAccurateProvinceKey(p) {
  if (!p) return "chiangmai";
  const rawKey = (p.provinceKey || p.province_slug || p.province_key || p.province || "").toString().trim().toLowerCase();
  const INVALID_KEYS = ["", "no_province", "other", "undefined", "null", "none"];

  if (rawKey && !INVALID_KEYS.includes(rawKey)) {
    return normalizeProvKey(rawKey);
  }

  const fullText = [p.location || "", p.description || "", p.name || ""].join(" ").toLowerCase();
  for (const rule of PROVINCE_DETECTION_RULES) {
    if (rule.keywords.some((kw) => fullText.includes(kw))) return rule.key;
  }
  return "chiangmai";
}

function getRealTimeAgo(dateInput) {
  if (!dateInput) return "วันนี้";
  const updatedTime = typeof dateInput === "number" ? dateInput : new Date(dateInput).getTime();
  if (isNaN(updatedTime) || updatedTime <= 0) return "วันนี้";

  const now = Date.now();
  const diffMinutes = Math.floor((now - updatedTime) / (1000 * 60));

  if (diffMinutes < 5) return "ออนไลน์เมื่อสักครู่";
  if (diffMinutes < 60) return `อัปเดตเมื่อ ${Math.max(1, diffMinutes)} นาทีที่แล้ว`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `อัปเดตเมื่อ ${diffHours} ชั่วโมงที่แล้ว`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "อัปเดตเมื่อวานนี้";
  if (diffDays < 7) return `อัปเดตเมื่อ ${diffDays} วันที่แล้ว`;

  return `อัปเดตเมื่อ ${new Date(updatedTime).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}`;
}

function getProfileActualDate(dateInput) {
  let d = (dateInput && !isNaN(new Date(dateInput).getTime())) ? new Date(dateInput) : new Date();
  const now = new Date();
  if (d.getTime() > now.getTime()) d = now;
  const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `${d.getDate()} ${thaiMonthsShort[d.getMonth()]} ${d.getFullYear()}`;
}

function sanitizeThaiText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/ฟิลแฟน|ฟีลแฟน|ฟิวเเฟน|ฟิวแฟว/g, "ฟิวแฟน")
    .replace(/(ฟิวแฟน\s*){2,}/gi, "ฟิวแฟน ")
    .replace(/[\uD800-\uDFFF\uFFFD]/g, "")
    .replace(/[જ⁀➴˚༘⋆🫦🌷͙֒🔥💥💦🐻‍❄️ྀི₊✮⸜⸝✧✦⁺]+/g, " ")
    .replace(/\.{2,}/g, " ")
    .replace(/([\u0E31\u0E34-\u0E3A\u0E47-\u0E4E])\1+/g, "$1")
    .replace(/พาพับ/g, "พายัพ")
    .replace(/🚨/g, "")
    .replace(/เจ็+ดยอด/g, "เจ็ดยอด")
    .replace(/นิมาน/g, "นิมมาน")
    .replace(/(โซน|ย่าน|แถว|พัก|อยู่)\s*นิทาน/g, "$1นิมมาน")
    .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/ไม่มีมีดจำ/g, "ไม่มีมัดจำ")
    .replace(/ได้ค่ะได้ค่ะ/g, "ได้ค่ะ")
    .replace(/ตรงปก\s*💯?\s*%/g, "ตรงปก 100%")
    .replace(/ฟรีถุงยาง!?/gi, "")
    .replace(/ฟรีแตกบนตัว!?/gi, "")
    .replace(/จู๋\s*ทำ\s*(\+\s*\d+)?(\.-)?/gi, "")
    .replace(/(69|➏➒|อมสด|ดูดสด|เอาร่องนม|จูบแลกลิ้น|แตกใน)/gi, "")
    .replace(/(พร้อม|มี)?อาบน้ำด้วยกัน/gi, "")
    .replace(/(มีอารมร่วม|มีอารมณ์?ร่วม)/gi, "ดูแลเป็นกันเอง")
    .replace(/[\d๑-๙]+\s*น้ำ(?!หนัก|มัน|หอม|ตก|ใส|ดื่ม|แข็ง|ตาล|พริก)(\s*\/?\s*[\d๑-๙]+\s*ชม\.?)?/gi, "1 ชม.")
    .replace(/\/\s*1\s*ชม\.?/gi, " (1 ชม.)")
    .replace(/(บริการดูแลสไตล์ฟิวแฟน\s*)+/gi, "")
    .replace(/(ฟิวแฟน\s*){2,}/gi, "ฟิวแฟน ")
    .replace(/([!*~_·\-\/])\s*\1+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHTML(str) {
  if (str == null) return "";
  return String(str).replace(/[&<>'"]/g, (tag) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[tag] || tag));
}

function stripHTML(str) {
  if (str == null) return "";
  return String(str)
    .replace(/<\/(p|div|h\d)>|<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>?/gm, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCleanNumber(rate) {
  if (!rate) return 1500;
  const str = String(rate).trim().toLowerCase();

  if (str.includes("ฟรี") || str === "free") return 0;
  if (str.includes("ตกลง") || str.includes("สอบถาม")) return 1500;

  if (str.includes("k")) {
    const floatVal = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(floatVal) ? 1500 : Math.round(floatVal * 1000);
  }

  const pricePart = str.split(/[\/\(\s]/)[0];
  const cleanDigits = pricePart.replace(/\D/g, "");
  const num = parseInt(cleanDigits, 10);

  if (isNaN(num) || num <= 0) return 1500;
  if (num < 10) return num * 1000;
  if (num < 100 && num >= 10) return num * 100;
  if (num < 500) return num * 10;
  return num;
}

function generateSrcSet(imagePath) {
  if (!imagePath || typeof imagePath !== "string" || imagePath.includes("firstmodelhub.webp") || imagePath.startsWith("data:")) {
    return "";
  }
  const img400 = safeOptimizeImg(imagePath, 400);
  const img600 = safeOptimizeImg(imagePath, 600);
  if (!img400.includes("res.cloudinary.com")) return "";
  return `${img400} 400w, ${img600} 600w`;
}

function formatLineUrl(rawInput, fallbackAdminLine = "https://line.me/ti/p/u8Bz9HsaY8") {
  if (!rawInput || typeof rawInput !== "string") {
    return fallbackAdminLine;
  }
  const trimmed = rawInput.trim();
  if (/ZRDtq11|vos730x|318afxwt|6Lj8m9G|store\.line\.me/i.test(trimmed)) {
    return fallbackAdminLine;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("@")) {
    const handle = trimmed.replace(/^@+/, "").trim();
    return handle ? `https://page.line.me/${handle}` : fallbackAdminLine;
  }
  const cleanId = trimmed.replace(/[^a-zA-Z0-9_\-\.]/g, "");
  if (cleanId.length > 0) {
    return `https://line.me/ti/p/~${cleanId}`;
  }
  return fallbackAdminLine;
}

function generateDynamicPersonaDesc(p, displayName, provinceName, zone) {
  let rawPersonalDesc = sanitizeThaiText(p.description || "")
    .replace(/เรทราคา|รายละเอียดค่ะ|1500\/1/gi, "")
    .replace(/[ฃ͡➴˚˳*•ㅅ•づ♡]+/g, "")
    .trim();

  const speechText = (rawPersonalDesc.length >= 8)
    ? rawPersonalDesc
    : `สวัสดีค่ะ ${displayName} สแตนด์บายในโซน${zone} (${provinceName}) ทักมาสอบถามคิวนัดหมายได้เลยค่ะ`;

  const pId = Number(p.id) || 1;
  const rawTagsList = Array.isArray(p.styleTags)
    ? p.styleTags
    : (Array.isArray(p.style_tags)
        ? p.style_tags
        : (typeof p.style_tags === "string" ? p.style_tags.split(",") : []));
  const cleanTags = rawTagsList.map((t) => sanitizeThaiText(String(t).replace(/^#+/, ""))).filter(Boolean);
  const rawTags = cleanTags.join(" ").toLowerCase();

  let styleText = "ดูแลเอาใจใส่สไตล์เพื่อนสนิท สุภาพ อ่อนโยน และไม่เร่งเวลางาน";
  if (rawTags.includes("ฟิวแฟน") || rawTags.includes("gfe")) {
    styleText = "เน้นฟิวแฟน (GFE) ใกล้ชิด น่ารัก เทคแคร์เป็นกันเอง เหมาะสำหรับนัดทานข้าว นั่งคาเฟ่ หรือพักผ่อนส่วนตัว";
  } else if (rawTags.includes("เอ็น") || rawTags.includes("ปาร์ตี้")) {
    styleText = "สายเอ็นเตอร์เทน (EN VIP) สนุกสนาน ชงเหล้าเก่ง คุยสนุก สร้างบรรยากาศเป็นกันเอง";
  } else if (rawTags.includes("ตัวเล็ก") || rawTags.includes("น่ารัก")) {
    styleText = "สเปกสาวไซส์มินิ สดใส น่ารัก คุยเก่ง อัธยาศัยดี";
  }

  const locList = [
    `สแตนด์บายประจำพื้นที่${zone} (${provinceName}) พร้อมเดินทางไปดูแลตามโรงแรมหรือที่พักส่วนตัวในละแวกใกล้เคียง`,
    `ให้บริการครอบคลุมย่าน${zone} จ.${provinceName} นัดหมายเวลาล่วงหน้าเพื่อความตรงเวลาและความเป็นส่วนตัวสูงสุด`
  ];
  const locationText = locList[pId % locList.length];

  const tagsPillsHtml = cleanTags.length > 0
    ? `<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">
        ${cleanTags.slice(0, 5).map((t) => `<span style="background: rgba(124, 58, 237, 0.08); color: #6D28D9; border: 1px solid rgba(124, 58, 237, 0.16); padding: 2px 10px; border-radius: 100px; font-size: 11px; font-weight: 700;">#${escapeHTML(t)}</span>`).join("")}
      </div>`
    : "";

  return `
    <div style="background: #FFFFFF; border: 1.5px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 14px 16px; margin-bottom: 8px; box-shadow: 0 2px 8px rgba(124, 58, 237, 0.04);">
      <div style="display: flex; align-items: flex-start; gap: 8px; background: #F8F6FC; padding: 10px 12px; border-radius: 12px; margin-bottom: 12px;">
        <span style="font-size: 16px; line-height: 1;">💬</span>
        <p style="font-size: 12.5px; color: #334155; line-height: 1.6; margin: 0; font-style: italic;">"${escapeHTML(speechText)}"</p>
      </div>
      ${tagsPillsHtml}
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: #475569; border-top: 1px dashed rgba(124, 58, 237, 0.15); padding-top: 10px;">
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <i class="fas fa-heart" style="color: #E11D48; width: 14px; text-align: center; margin-top: 3px;"></i>
          <span><strong>สไตล์การดูแล:</strong> ${styleText}</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <i class="fas fa-map-marker-alt" style="color: #7C3AED; width: 14px; text-align: center; margin-top: 3px;"></i>
          <span><strong>พื้นที่บริการ:</strong> ${escapeHTML(locationText)}</span>
        </div>
      </div>
    </div>
  `;
}

export default async (req, context) => {
  const url = new URL(req.url);

  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const proto = req.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");

  if (!isLocal) {
    if (proto !== "https" || url.hostname !== "firstmodelhub.com") {
      return Response.redirect(`https://firstmodelhub.com${url.pathname}${url.search}`, 301);
    }
  }

  if (url.pathname === "/api/clear-profile-cache") {
    let secret = url.searchParams.get("secret") || req.headers.get("x-purge-secret") || "";
    if (!secret && req.method === "POST") {
      try {
        const body = await req.json();
        secret = String(body?.pin || body?.secret || "").trim();
      } catch (_) {}
    }

    if (CONFIG.PURGE_SECRET && secret === CONFIG.PURGE_SECRET) {
      PROFILE_PAGE_CACHE.clear();
      GLOBAL_PROFILE_VERSION = `v_${Date.now()}`;

      let cdnPurged = false;
      const netlifyToken = Deno.env.get("NETLIFY_AUTH_TOKEN");
      const netlifySiteId = Deno.env.get("NETLIFY_SITE_ID");

      if (netlifyToken && netlifySiteId) {
        try {
          const purgeRes = await fetch(`https://api.netlify.com/api/v1/purge_cache`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${netlifyToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ site_id: netlifySiteId })
          });
          cdnPurged = purgeRes.ok;
        } catch (e) {
          console.warn("Netlify CDN Purge failed:", e);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        cdnPurged: cdnPurged,
        message: cdnPurged
          ? "⚡ ล้างแคชโปรไฟล์ระดับ Edge และ CDN ทั่วโลกสำเร็จ 100%!"
          : "⚡ ล้างแคชโปรไฟล์ Edge สำเร็จ",
        version: GLOBAL_PROFILE_VERSION
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Netlify-CDN-Cache-Control": "no-store"
        }
      });
    }
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[0] !== "sideline" || segments.length < 2) {
    return context.next();
  }

  let rawSlug = "";
  try {
    rawSlug = decodeURIComponent(segments[segments.length - 1]).trim();
  } catch {
    rawSlug = String(segments[segments.length - 1] || "").trim();
  }

  if (["province", "category", "search", "app", "profiles"].includes(rawSlug.toLowerCase())) {
    return context.next();
  }

  if (!rawSlug || rawSlug === "*" || rawSlug.length > 120) {
    return new Response("404 Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" }
    });
  }

  const legacyTarget = LEGACY_PROFILE_REDIRECTS[rawSlug.toLowerCase()];
  if (legacyTarget) {
    return Response.redirect(`${CONFIG.DOMAIN}${legacyTarget}`, 301);
  }

  const isForceRefresh = Boolean(
    CONFIG.PURGE_SECRET && (
      url.searchParams.get("refresh") === CONFIG.PURGE_SECRET ||
      url.searchParams.get("secret") === CONFIG.PURGE_SECRET
    )
  );
  const cacheKey = url.pathname;
  const cachedPage = PROFILE_PAGE_CACHE.get(cacheKey);
  const isExpiredOneDay = cachedPage && (Date.now() - (cachedPage.cachedAt || 0) > ONE_DAY_MS);

  if (!isForceRefresh && cachedPage && !isExpiredOneDay && cachedPage.version === GLOBAL_PROFILE_VERSION) {
    cachedPage.lastAccessed = Date.now();
    PROFILE_PAGE_CACHE.delete(cacheKey);
    PROFILE_PAGE_CACHE.set(cacheKey, cachedPage);
    return new Response(cachedPage.html, { headers: cachedPage.headers });
  }

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    const [slugRes, settingsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("active", true).eq("slug", rawSlug).maybeSingle(),
      supabase.from("site_settings").select("key, value")
    ]);

    const settingsMap = new Map((settingsRes?.data || []).map((s) => [s.key, s.value]));
    const liveAdminLine = settingsMap.get("admin_line_url") || "https://line.me/ti/p/u8Bz9HsaY8";

    let profile = slugRes?.data || null;

    if (!profile) {
      const numericIdMatch = rawSlug.match(/-(\d+)$/) || (/^\d+$/.test(rawSlug) && [null, rawSlug]);
      if (numericIdMatch && numericIdMatch[1]) {
        const idRes = await supabase
          .from("profiles")
          .select("*")
          .eq("active", true)
          .eq("id", numericIdMatch[1])
          .maybeSingle();
        profile = idRes?.data || null;
      }
    }

    if (!profile) {
      return context.next();
    }

    const trueCanonicalSlug = getCanonicalProfileSlug(profile);
    const canonicalPath = `/sideline/${encodeURIComponent(trueCanonicalSlug)}`;
    if (segments.length !== 2 || rawSlug !== trueCanonicalSlug || url.pathname.endsWith("/")) {
      return Response.redirect(`${CONFIG.DOMAIN}${canonicalPath}`, 301);
    }

    const provinceKey = detectAccurateProvinceKey(profile);
    const cleanProvinceKey = provinceKey.replace(/[-_]/g, "");

    const provVariants = [provinceKey, cleanProvinceKey];
    if (provinceKey === "chiangmai") provVariants.push("chiang-mai", "chiang_mai");
    if (provinceKey === "khon-kaen") provVariants.push("khonkaen", "khon_kaen");
    if (provinceKey === "ayutthaya") provVariants.push("phra-nakhon-si-ayutthaya");
    if (provinceKey === "suratthani") provVariants.push("surat-thani", "samui");
    if (provinceKey === "korat") provVariants.push("nakhon-ratchasima", "nakhonratchasima");
    if (provinceKey === "songkhla") provVariants.push("hat-yai", "hatyai");

    const provCol = ("provinceKey" in profile && profile.provinceKey) ? "provinceKey"
      : ("province_slug" in profile && profile.province_slug) ? "province_slug"
      : ("province_key" in profile && profile.province_key) ? "province_key"
      : "provinceKey";

    let relatedProfiles = [];
    try {
      const hasValidImg = (rp) => {
        const img = String(rp.imagePath || rp.image_url || "").trim();
        return img.length >= 15 && !img.includes("firstmodelhub.webp");
      };

      const { data: sameProvinceProfiles } = await supabase
        .from("profiles")
        .select("id, slug, name, imagePath, image_url, isfeatured, provinceKey")
        .eq("active", true)
        .neq("id", profile.id)
        .in(provCol, provVariants)
        .limit(8);

      const { data: otherProfiles } = await supabase
        .from("profiles")
        .select("id, slug, name, imagePath, image_url, isfeatured, provinceKey")
        .eq("active", true)
        .neq("id", profile.id)
        .not(provCol, "in", `(${provVariants.map((v) => `"${v}"`).join(",")})`)
        .limit(8);

      const validSame = (sameProvinceProfiles || []).filter(hasValidImg).slice(0, 3);
      const validOther = (otherProfiles || []).filter(hasValidImg).slice(0, 3);
      relatedProfiles = [...validSame, ...validOther].slice(0, 6);
    } catch (err) {
      console.warn("Related profiles fetch error:", err);
    }

    if (relatedProfiles.length === 0) {
      try {
        const { data: fallbackProfiles } = await supabase
          .from("profiles")
          .select("id, slug, name, imagePath, image_url, isfeatured")
          .eq("active", true)
          .neq("id", profile.id)
          .limit(3);
        relatedProfiles = fallbackProfiles || [];
      } catch (_) {}
    }

    const displayName = `น้อง${(profile.name || "สาวสวย").trim().replace(/^(น้อง\s?)+/gi, "")}`;
    const provinceNameThai = profile.provinceThai || PROVINCE_NAME_MAP[provinceKey] || PROVINCE_NAME_MAP[cleanProvinceKey] || "เชียงใหม่";
    const provinceHubUrl = `/location/${provinceKey}`;

    const relatedCardsHtml = relatedProfiles.length > 0 ? `
      <section style="margin-top: 1.5rem; border-top: 1px solid rgba(124, 58, 237, 0.12); padding-top: 1.25rem;">
        <h2 style="color: #7C3AED; font-size: 13.5px; font-weight: 900; margin: 0 0 10px 0; text-align: center;">น้องๆ แนะนำเพิ่มเติมในโซน${escapeHTML(provinceNameThai)}</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          ${relatedProfiles.map((rp) => {
            const rpName = `น้อง${escapeHTML((rp.name || "สาวสวย").trim().replace(/^(น้อง\s?)+/gi, ""))}`;
            const rpSlug = encodeURIComponent(getCanonicalProfileSlug(rp));
            const rpImg = safeOptimizeImg(rp.imagePath || rp.image_url || "", 400);
            return `
              <a href="/sideline/${rpSlug}" style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1.5px solid rgba(124, 58, 237, 0.12); display: block; text-align: center; text-decoration: none; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
                <img src="${rpImg}" alt="${rpName} รับงาน${escapeHTML(provinceNameThai)}" loading="lazy" decoding="async" width="120" height="150" style="width: 100%; aspect-ratio: 4/5; object-fit: cover; display: block;">
                <div style="padding: 6px 2px; font-size: 11px; font-weight: 800; color: #140F22;">${rpName}</div>
              </a>
            `;
          }).join("")}
        </div>
      </section>
    ` : "";

    let rawGallery = profile.images || profile.photos || profile.galleryPaths || profile.gallery_paths || profile.gallery || [];
    if (typeof rawGallery === "string") {
      const trimmedGal = rawGallery.trim();
      if (trimmedGal.startsWith("[")) {
        try { rawGallery = JSON.parse(trimmedGal); } catch (_) { rawGallery = []; }
      } else if (trimmedGal.startsWith("http") || trimmedGal.startsWith("/")) {
        rawGallery = trimmedGal.split(/[\r\n]+|,\s*(?=https?:\/\/|\/)/).map((s) => s.trim()).filter(Boolean);
      } else {
        rawGallery = [];
      }
    }

    const validGalleryUrls = (Array.isArray(rawGallery) ? rawGallery : [])
      .map((img) => (typeof img === "object" && img !== null ? (img.url || img.src || img.imagePath || "") : String(img || "")))
      .map((s) => s.trim())
      .filter((s) => s && (s.startsWith("http") || s.startsWith("/")) && !s.includes("firstmodelhub.webp"));

    let rawImage = (profile.imagePath || profile.image_path || profile.image_url || profile.imageUrl || profile.img || "").trim();
    if ((!rawImage || rawImage.includes("firstmodelhub.webp")) && validGalleryUrls.length > 0) {
      rawImage = validGalleryUrls[0];
    }

    const rateNumber = extractCleanNumber(profile.rate || profile.price);
    const heroImageLarge = safeOptimizeImg(rawImage, 600);
    const heroImageSmall = safeOptimizeImg(rawImage, 400);
    const ogImageSocial = safeOptimizeImg(rawImage, "og");
    const heroSrcSet = generateSrcSet(rawImage);

    const uniqueGallery = [...new Set([rawImage, ...validGalleryUrls].filter((s) => s && (s.startsWith("http") || s.startsWith("/")) && !s.includes("firstmodelhub.webp")))];

    const galleryThumbnailsHtml = uniqueGallery.length > 1 ? `
      <div class="profile-gallery-strip" id="profile-gallery-strip" style="display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch;">
        ${uniqueGallery.map((imgUrl, i) => `
          <button type="button" class="thumb-slot ${i === 0 ? "active" : ""}" data-full-src="${safeOptimizeImg(imgUrl, 600)}" style="padding: 0; width: 62px; height: 80px; border-radius: 10px; overflow: hidden; flex-shrink: 0; cursor: pointer; border: 2px solid ${i === 0 ? "#7C3AED" : "transparent"}; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: none;">
            <img src="${safeOptimizeImg(imgUrl, "thumb")}" alt="รูปที่ ${i + 1}" width="62" height="80" decoding="async" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
          </button>
        `).join("")}
      </div>
    ` : "";

    const rawLineInput = (profile.line_id || profile.line || profile.lineId || profile.line_url || "").trim();
    const lineId = formatLineUrl(rawLineInput, liveAdminLine);

    const cleanAge = profile.age && !["-", "0", "ไม่ระบุ"].includes(String(profile.age).trim())
      ? String(profile.age).replace(/\D/g, "")
      : "";
    const ageDisplay = cleanAge ? `${cleanAge} ปี` : "";

    const cleanHeight = profile.height && !["-", "0", "ไม่ระบุ"].includes(String(profile.height).trim())
      ? String(profile.height).replace(/\D/g, "")
      : "";
    const heightDisplay = cleanHeight ? `${cleanHeight} ซม.` : "";

    const parsedDbWeight = parseInt(String(profile.weight || "").replace(/\D/g, ""), 10);
    const hasValidWeight = Boolean(parsedDbWeight && parsedDbWeight >= 35 && parsedDbWeight <= 90);
    const weightDisplay = hasValidWeight ? `${parsedDbWeight} กก.` : "";

    const stats = (function () {
      const dbStats = (profile.stats && !["-", "0", "ไม่ระบุ"].includes(String(profile.stats).trim()))
        ? String(profile.stats).trim()
        : "";
      if (dbStats) return dbStats;
      const fullText = `${profile.description || ""} ${profile.slogan || ""} ${profile.quote || ""}`;
      const match = fullText.match(/(\d{2,3}[A-Za-z]?\s*[-–]\s*\d{2}\s*[-–]\s*\d{2})/);
      return (match && match[1]) ? match[1].replace(/\s+/g, "") : "";
    })();

    const cleanProvince = escapeHTML(provinceNameThai);
    const rawLoc = sanitizeThaiText(profile.location || "");

    const firstLocSegment = rawLoc
      .replace(/[\r\n\t]+/g, " ")
      .replace(/^(โซน|ย่าน)\s*/gi, "")
      .split(/[,/]|และใกล้|ใกล้เคียง/)[0]
      .replace(/(?<!มช|มข|มฟล|มน|ม\.อ)\.+$/, "")
      .trim();

    let extractedZone = firstLocSegment;
    if (/^(ในตัวเมือง|ตัวเมือง)\s+/.test(extractedZone)) {
      const afterCityPrefix = extractedZone.replace(/^(ในตัวเมือง|ตัวเมือง)\s+/, "").trim();
      if (afterCityPrefix && afterCityPrefix !== cleanProvince) {
        extractedZone = afterCityPrefix;
      }
    }

    const hasDistinctZone = Boolean(
      extractedZone &&
      extractedZone !== cleanProvince &&
      extractedZone !== `ตัวเมือง${cleanProvince}` &&
      extractedZone !== `ในตัวเมือง${cleanProvince}`
    ) || /^(ในเมือง|ตัวเมือง|ในตัวเมือง)/.test(firstLocSegment);

    const primaryZone = extractedZone || cleanProvince;

    const cleanZoneKey = primaryZone.trim().replace(/[\r\n\t]+/g, "").replace(/(?<!มช|มข|มฟล|มน|ม\.อ)\.+$/, "");
    const zoneKeyLower = cleanZoneKey.toLowerCase();
    let matchedSlugPart = "";

    const resolvedDirect = resolveZone(provinceKey, cleanZoneKey);
    if (resolvedDirect.zone) {
      matchedSlugPart = resolvedDirect.zone.slug;
    } else {
      const provZones = MASTER_ZONES[provinceKey] || [];
      const searchNoDot = zoneKeyLower.replace(/\./g, "");
      const foundZone = provZones.find((z) =>
        z.thai.replace(/\.+$/, "").toLowerCase() === zoneKeyLower ||
        z.match.some((m) => m.replace(/\.+$/, "").toLowerCase() === zoneKeyLower || m.replace(/\.+$/, "").toLowerCase() === searchNoDot)
      );
      if (foundZone) matchedSlugPart = foundZone.slug;
    }

    if (!matchedSlugPart && ["ในเมือง", "ตัวเมือง", "ในตัวเมือง"].includes(zoneKeyLower)) {
      const mueangSlug = MUEANG_ZONE_BY_PROVINCE[provinceKey];
      if (mueangSlug && resolveZone(provinceKey, mueangSlug).zone) {
        matchedSlugPart = mueangSlug;
      }
    }

    const hasValidZoneSlug = Boolean(matchedSlugPart);
    const zoneHubUrl = hasValidZoneSlug ? `/location/${provinceKey}/${matchedSlugPart}` : provinceHubUrl;

    const localizedZone = profile.location ? sanitizeThaiText(profile.location) : "ในเมือง";
    const naturalDesc = generateDynamicPersonaDesc(profile, displayName, cleanProvince, localizedZone);

    const actualDateText = getProfileActualDate(profile.updated_at || profile.created_at);
    const zoneParen = hasDistinctZone ? ` (${primaryZone})` : "";
    const zoneLabel = hasDistinctZone ? ` โซน${primaryZone}` : "";
    const statsSnippet = stats ? ` สัดส่วน ${stats}` : "";
    const profileSeoH1 = `${displayName} รับงาน${cleanProvince}${zoneParen}`;
    const pageTitle = `${displayName}${zoneParen} เพื่อนเที่ยวฟิวแฟน${cleanProvince} จ่ายหน้างาน | ${CONFIG.BRAND_NAME}`;
    const metaDescription = `โปรไฟล์ ${displayName} พิกัด${cleanProvince}${zoneLabel}${statsSnippet} เพื่อนเที่ยวฟิวแฟน ตัวจริงตรงปก 100% นัดพบจ่ายหน้างาน ไม่มีมัดจำ [อัปเดต ${actualDateText}]`;

    const canonicalUrl = `${CONFIG.DOMAIN}${canonicalPath}`;
    const realTimeText = getRealTimeAgo(profile.updated_at || profile.created_at);
    const currentAvail = (profile.availability || "").trim();

    const isBusy = ["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด", "สอบถามคิว"].some((s) => currentAvail.toLowerCase().includes(s));
    const isOnlineNow = (currentAvail === "รับงาน" || currentAvail === "พร้อมรับงาน") || (!isBusy && Boolean(currentAvail));
    const realStatusText = currentAvail || (isOnlineNow ? "พร้อมรับงาน" : "สอบถามคิว");
    const statusDotColor = (currentAvail === "สอบถามคิว" || !isOnlineNow) ? "#F59E0B" : "#059669";

    const cleanHeightNum = cleanHeight ? parseInt(cleanHeight, 10) : 0;
    const cleanWeightNum = hasValidWeight ? parsedDbWeight : 0;
    const activeBreadcrumbText = `ไซด์ไลน์${cleanProvince}`;

    const heightWeightText = [heightDisplay, weightDisplay].filter(Boolean).join(" / ");
    const specTilesHtml = `
      ${stats ? `
      <div class="fmh-spec-tile">
          <span class="fmh-spec-tile-label">สัดส่วน</span>
          <strong class="fmh-spec-tile-val">${escapeHTML(stats)}</strong>
      </div>` : ""}
      ${heightWeightText ? `
      <div class="fmh-spec-tile">
          <span class="fmh-spec-tile-label">${heightDisplay && weightDisplay ? "ส่วนสูง / น้ำหนัก" : (heightDisplay ? "ส่วนสูง" : "น้ำหนัก")}</span>
          <strong class="fmh-spec-tile-val">${escapeHTML(heightWeightText)}</strong>
      </div>` : ""}
      ${ageDisplay ? `
      <div class="fmh-spec-tile">
          <span class="fmh-spec-tile-label">อายุ</span>
          <strong class="fmh-spec-tile-val">${escapeHTML(ageDisplay)}</strong>
      </div>` : ""}
      <div class="fmh-spec-tile">
          <span class="fmh-spec-tile-label">พิกัดบริการ</span>
          <a href="${zoneHubUrl}" style="color: #7C3AED; font-weight: 800; font-size: 11.5px; text-decoration: none;">
            ${escapeHTML(cleanProvince)} (${escapeHTML(primaryZone)}) &rarr;
          </a>
      </div>
    `;

    const profileFaqs = [
      {
        q: `ค่าบริการและวิธีจ่ายเงินเมื่อนัดพบ${displayName} (${primaryZone}) เป็นอย่างไร?`,
        a: `เรทเริ่มต้นของ${displayName} อยู่ที่ ${rateNumber.toLocaleString()} บาท/ชม. ชำระเงินสดหรือโอนให้น้องโดยตรงเมื่อพบตัวจริงหน้างานเท่านั้น ไม่มีมัดจำล่วงหน้าทุกกรณีค่ะ`
      },
      {
        q: `หากตัวจริงไม่ตรงตามรูปโปรไฟล์ของ${displayName} สามารถยกเลิกได้ไหม?`,
        a: `ได้ทันทีโดยไม่มีค่าใช้จ่ายใดๆ ค่ะ หากตรวจสอบหน้างานแล้วไม่ตรงปก สามารถปฏิเสธและยกเลิกการนัดหมายได้ 100% ค่ะ`
      }
    ];

    const faqAccordionHtml = `
      <section class="profile-faq-section" style="margin-top: 1.5rem; border-top: 1px solid rgba(124, 58, 237, 0.12); padding-top: 1.25rem;">
        <h2 style="color: #7C3AED; font-size: 13.5px; font-weight: 900; margin: 0 0 10px 0; text-align: center;">❓ ข้อมูลการนัดพบ${escapeHTML(displayName)}</h2>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${profileFaqs.map((f) => `
            <details style="background: #FFFFFF; border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 12px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
              <summary style="padding: 10px 14px; font-size: 12.5px; font-weight: 800; color: #140F22; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                <span>Q: ${escapeHTML(f.q)}</span>
                <span style="color: #7C3AED; font-size: 10px; margin-left: 8px;">▼</span>
              </summary>
              <div style="padding: 0 14px 12px 14px; font-size: 12px; color: #475569; line-height: 1.6; border-top: 1px dashed rgba(124, 58, 237, 0.1); margin-top: 4px; padding-top: 8px;">
                ${escapeHTML(f.a)}
              </div>
            </details>
          `).join("")}
        </div>
      </section>
    `;

    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "หน้าแรก",
        "item": `${CONFIG.DOMAIN}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": stripHTML(activeBreadcrumbText),
        "item": `${CONFIG.DOMAIN}${provinceHubUrl}`
      }
    ];

    if (hasValidZoneSlug) {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": `โซน${stripHTML(primaryZone)}`,
        "item": `${CONFIG.DOMAIN}${zoneHubUrl}`
      });
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 4,
        "name": stripHTML(displayName),
        "item": canonicalUrl
      });
    } else {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": stripHTML(displayName),
        "item": canonicalUrl
      });
    }

    const schemaPlaceText = hasDistinctZone
      ? `โซน${stripHTML(primaryZone)} ${stripHTML(cleanProvince)}`
      : `${stripHTML(cleanProvince)}`;

    const personSchema = {
      "@type": "Person",
      "@id": `${canonicalUrl}#person`,
      "name": stripHTML(displayName),
      "alternateName": `${stripHTML(displayName)} ${CONFIG.BRAND_NAME}`,
      "gender": "https://schema.org/Female",
      "jobTitle": "เพื่อนเที่ยวฟิวแฟน",
      "description": `${stripHTML(displayName)} เพื่อนเที่ยวฟิวแฟน สแตนด์บาย${schemaPlaceText}${stats ? ` สัดส่วน ${stripHTML(stats)}` : ""} นัดพบตัวจริงจ่ายหน้างาน`,
      "image": {
        "@type": "ImageObject",
        "@id": `${canonicalUrl}#image`,
        "url": heroImageLarge
      },
      "url": canonicalUrl,
      "makesOffer": {
        "@type": "Offer",
        "name": `บริการเพื่อนเที่ยวฟิวแฟน ${stripHTML(displayName)}`,
        "price": rateNumber,
        "priceCurrency": "THB",
        "availability": isOnlineNow ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        "url": canonicalUrl
      },
      "homeLocation": {
        "@type": "Place",
        "name": schemaPlaceText,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": stripHTML(primaryZone),
          "addressLocality": stripHTML(primaryZone),
          "addressRegion": stripHTML(cleanProvince),
          "addressCountry": "TH"
        }
      }
    };

    if (cleanHeightNum > 0) {
      personSchema.height = {
        "@type": "QuantitativeValue",
        "value": cleanHeightNum,
        "unitCode": "CMT",
        "unitText": "cm"
      };
    }
    if (cleanWeightNum > 0) {
      personSchema.weight = {
        "@type": "QuantitativeValue",
        "value": cleanWeightNum,
        "unitCode": "KGM",
        "unitText": "kg"
      };
    }

    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfilePage",
          "@id": `${canonicalUrl}#webpage`,
          "url": canonicalUrl,
          "name": stripHTML(pageTitle),
          "description": stripHTML(metaDescription),
          "inLanguage": "th-TH",
          "dateModified": (profile.updated_at && !isNaN(new Date(profile.updated_at).getTime()))
            ? new Date(profile.updated_at).toISOString()
            : ((profile.created_at && !isNaN(new Date(profile.created_at).getTime()))
                ? new Date(profile.created_at).toISOString()
                : new Date().toISOString()),
          "isPartOf": { "@id": `${CONFIG.DOMAIN}/#website` },
          "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` },
          "mainEntity": { "@id": `${canonicalUrl}#person` }
        },
        personSchema,
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": breadcrumbItems
        },
        {
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          "isPartOf": { "@id": `${canonicalUrl}#webpage` },
          "mainEntity": profileFaqs.map((f) => ({
            "@type": "Question",
            "name": stripHTML(f.q),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": stripHTML(f.a)
            }
          }))
        }
      ]
    };

    const robotsTag = '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">';
    const isoUpdatedTime = new Date(profile.updated_at || profile.created_at || Date.now()).toISOString();

    const htmlResponse = `<!DOCTYPE html>
<html lang="th" class="light-theme">
<head>
    <meta charset="utf-8">
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#F6F3FA">
    <meta name="color-scheme" content="light">
    <meta name="format-detection" content="telephone=no">

    <title>${escapeHTML(pageTitle)}</title>
    <meta name="description" content="${escapeHTML(metaDescription)}">
    ${robotsTag}
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="alternate" hreflang="th" href="${canonicalUrl}">
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">

    <link rel="preconnect" href="https://res.cloudinary.com">
    <link rel="dns-prefetch" href="https://res.cloudinary.com">

    <link rel="preload" href="/fonts/prompt-v11-latin_thai-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    <link rel="preload" href="/fonts/prompt-v11-latin_thai-700.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    ${heroSrcSet
      ? `<link rel="preload" as="image" href="${heroImageSmall}" imagesrcset="${heroSrcSet}" imagesizes="(max-width: 480px) 100vw, 400px" fetchpriority="high">`
      : `<link rel="preload" as="image" href="${heroImageSmall}" fetchpriority="high">`
    }

    <style>
      @font-face {
        font-family: 'Prompt';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/prompt-v11-latin_thai-regular.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Prompt';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/prompt-v11-latin_thai-700.woff2') format('woff2');
      }
    </style>

    <link rel="stylesheet" href="/styles.css?v=${GLOBAL_PROFILE_VERSION}">
    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">

    <meta property="og:locale" content="th_TH">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHTML(pageTitle)}">
    <meta property="og:description" content="${escapeHTML(metaDescription)}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="${ogImageSocial}">
    <meta property="og:image:secure_url" content="${ogImageSocial}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${escapeHTML(displayName)} ตัวจริงตรงปก 100%">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@Timedamdam">
    <meta name="twitter:creator" content="@Timedamdam">
    <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
    <meta name="twitter:description" content="${escapeHTML(metaDescription)}">
    <meta name="twitter:image" content="${ogImageSocial}">

    <script type="application/ld+json">${JSON.stringify(schemaGraph).replace(/</g, "\\u003c")}</script>

    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){ window.dataLayer.push(arguments); }
      window.gtag = gtag;

      (function() {
        let gtmLoaded = false;
        const loadGTM = function() {
          if (gtmLoaded) return;
          gtmLoaded = true;
          var s = document.createElement('script');
          s.src = "https://www.googletagmanager.com/gtag/js?id=G-PG0QFDWTTG";
          s.async = true;
          document.head.appendChild(s);
          gtag('js', new Date());
          gtag('config', 'G-PG0QFDWTTG', {
            'send_page_view': true,
            'cookie_flags': 'SameSite=None;Secure'
          });
        };

        window.addEventListener('keydown', loadGTM, { once: true, passive: true });
        window.addEventListener('load', function() {
          setTimeout(function() {
            if ('requestIdleCallback' in window) {
              requestIdleCallback(loadGTM, { timeout: 2000 });
            } else {
              loadGTM();
            }
          }, 4200);
        }, { once: true });
      })();
    </script>
</head>
<body class="fmh-app-page is-profile-page" style="background-color: #F8F6FC; color: #140F22;">
<div class="container" style="max-width: 680px; margin: 0 auto; padding: 1rem 1rem 8.5rem 1rem;">
        <header id="page-header" style="position: relative; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.97); border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
          <div class="header-logo-container">
            <a href="/" class="brand-luxe-logo" aria-label="FirstModelHub หน้าแรก">
                <span class="luxe-star-crest" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" fill="url(#fmh-gold-grad)"></path>
                    <defs>
                      <linearGradient id="fmh-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFF0B3"></stop>
                        <stop offset="50%" stop-color="#F59E0B"></stop>
                        <stop offset="100%" stop-color="#D97706"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span class="luxe-brand-text">
                    <span class="txt-first">First</span><span class="txt-model">Model</span>
                </span>
                <span class="luxe-hub-badge">HUB</span>
            </a>
          </div>
          <a href="${hasValidZoneSlug ? zoneHubUrl : provinceHubUrl}" style="color: #7C3AED; font-size: 12px; font-weight: 800; text-decoration: none;">
            <i class="fas fa-arrow-left"></i> ย้อนกลับไป${hasValidZoneSlug ? `โซน${escapeHTML(primaryZone)}` : `ไซด์ไลน์${escapeHTML(cleanProvince)}`}
          </a>
        </header>

        <nav aria-label="breadcrumb">
          <ol style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; list-style: none; padding: 0; margin: 0 0 1rem 0; font-size: 12px;">
            <li><a href="/" style="color: #475569; text-decoration: none;">หน้าแรก</a></li>
            <li style="color: #64748B;" aria-hidden="true">&raquo;</li>
            <li><a href="${provinceHubUrl}" style="color: #7C3AED; text-decoration: none; font-weight: 600;">${escapeHTML(activeBreadcrumbText)}</a></li>
            ${hasValidZoneSlug ? `
            <li style="color: #64748B;" aria-hidden="true">&raquo;</li>
            <li><a href="${zoneHubUrl}" style="color: #7C3AED; text-decoration: none; font-weight: 600;">โซน${escapeHTML(primaryZone)}</a></li>
            ` : ""}
            <li style="color: #64748B;" aria-hidden="true">&raquo;</li>
            <li aria-current="page"><span style="color: #140F22; font-weight: 700;">${escapeHTML(displayName)}</span></li>
          </ol>
        </nav>

        <main class="main-content">
            <article class="interactive-card fmh-bento-card">
               <section class="hero-section" style="padding: 0; margin-bottom: 1rem;">
                    <div style="position: relative; border-radius: 18px; overflow: hidden; aspect-ratio: 3/4.2; width: 100%; border: 1px solid rgba(124, 58, 237, 0.15);">
                     <img id="main-profile-img" src="${heroImageSmall}" ${heroSrcSet ? `srcset="${heroSrcSet}" sizes="(max-width: 480px) 100vw, 400px"` : ""} class="hero-img" alt="${escapeHTML(displayName)} เพื่อนเที่ยวฟิวแฟน${cleanProvince} โซน${escapeHTML(primaryZone)} ตรงปก 100% - FirstModelHub" loading="eager" fetchpriority="high" decoding="async" width="400" height="560" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    ${galleryThumbnailsHtml}
                </section>

                <header class="profile-meta-header" style="text-align: center; margin: 1.25rem 0 1rem 0;">
                  <h1 style="font-size: 19px; font-weight: 900; color: #140F22; line-height: 1.4; margin: 0;">
                    ${escapeHTML(profileSeoH1)}
                  </h1>

                  <div style="display: inline-flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px; margin-top: 6px;">
                      <div style="display: inline-flex; align-items: center; gap: 5px; background: rgba(5, 150, 105, 0.08); border: 1px solid rgba(5, 150, 105, 0.2); padding: 4px 10px; border-radius: 100px;">
                          <i class="fas fa-check-circle" style="color: #059669; font-size: 12px;"></i>
                          <span style="color: #065F46; font-size: 11px; font-weight: 700;">ยืนยันรูปถ่ายจริงแล้ว</span>
                      </div>
                      <div style="display: inline-flex; align-items: center; gap: 5px; background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.15); padding: 4px 12px; border-radius: 100px;">
                          <span style="width: 7px; height: 7px; border-radius: 50%; background: ${statusDotColor};"></span>
                          <span style="color: #140F22; font-size: 11.5px; font-weight: 800;">${escapeHTML(realStatusText)}</span>
                          <span style="color: #64748B; font-size: 10px;">•</span>
                          <time class="fmh-relative-time" datetime="${isoUpdatedTime}" style="color: #475569; font-size: 11.5px; font-weight: 600;">${realTimeText}</time>
                      </div>
                  </div>
                </header>

                <div class="fmh-spec-grid">
                    ${specTilesHtml}
                </div>

                <section class="fmh-rates-box">
                    <h2 style="color: #7C3AED; text-align: center; font-weight: 900; font-size: 13.5px; margin: 0 0 10px 0;">💰 อัตราค่าบริการเพื่อนเที่ยว ${escapeHTML(displayName)} (${escapeHTML(cleanProvince)})</h2>
                    <div class="fmh-rates-grid">
                      <div class="fmh-rate-col">
                        <div class="time-label">1 ชม.</div>
                        <strong class="price-val">${rateNumber.toLocaleString()}.-</strong>
                      </div>
                      <div class="fmh-rate-col">
                        <div class="time-label">2 ชม. <span style="font-size:9.5px; font-weight:700; color:#8B5CF6;">(ประมาณการ)</span></div>
                        <strong class="price-val">${(Math.round((rateNumber * 1.8) / 100) * 100).toLocaleString()}.-</strong>
                      </div>
                      <div class="fmh-rate-col">
                        <div class="time-label">ค้างคืน <span style="font-size:9.5px; font-weight:700; color:#8B5CF6;">(เริ่มต้น)</span></div>
                        <strong class="price-val">${(Math.round((rateNumber * 4.5) / 500) * 500).toLocaleString()}.-</strong>
                      </div>
                    </div>
                    <p style="font-size: 11px; color: #64748B; text-align: center; margin: 8px 0 0 0; line-height: 1.4;">
                      * หมายเหตุ: เรท 2 ชม. และค้างคืนเป็นราคาประมาณการเริ่มต้น กรุณาตกลงเวลากับน้องก่อนเริ่มงานค่ะ
                    </p>
                </section>

                <section class="fmh-verification-box" style="margin-top: 1.25rem; background: #FFFFFF; border: 1.5px solid rgba(5, 150, 105, 0.22); border-radius: 16px; padding: 14px 16px; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.04);">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <strong style="color: #065F46; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 6px;">
                      <span>🛡️ มาตรฐานการนัดพบ</span>
                    </strong>
                    <span style="background: rgba(5,150,105,0.1); color: #059669; font-size: 10.5px; font-weight: 800; padding: 2px 9px; border-radius: 100px;">20+ ปีเท่านั้น</span>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 11.5px; color: #334155;">
                    <div style="background: #F8FAFC; border-radius: 10px; padding: 8px 10px;">
                      <span style="color: #64748B; display: block; font-size: 10px;">รูปแบบการชำระเงิน</span>
                      <strong style="color: #059669;">จ่ายหน้างาน 100% (ไม่มีมัดจำ)</strong>
                    </div>
                    <div style="background: #F8FAFC; border-radius: 10px; padding: 8px 10px;">
                      <span style="color: #64748B; display: block; font-size: 10px;">นโยบายความตรงปก</span>
                      <strong style="color: #140F22;">ไม่ตรงปก ยกเลิกได้ฟรีทันที</strong>
                    </div>
                  </div>
                </section>

                <section class="profile-bio-wrapper" style="margin-top: 1.25rem; margin-bottom: 1.25rem;">
                  <h2 style="font-size: 13.5px; font-weight: 900; color: #140F22; margin: 0 0 8px 0;">
                    ข้อมูลส่วนตัวและสไตล์การดูแลของ${escapeHTML(displayName)}
                  </h2>
                  ${naturalDesc}
                </section>

                ${relatedCardsHtml}

                ${faqAccordionHtml}
            </article>
        </main>

        <footer style="text-align: center; padding: 2rem 1rem; color: #64748B; font-size: 11.5px; line-height: 1.6;">
          <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - ศูนย์รวมเพื่อนเที่ยวฟิวแฟน ปลอดภัย จ่ายหน้างาน 100%</p>
          <div style="font-size: 10px; color: #64748B; max-width: 580px; margin: 8px auto 0 auto; border-top: 1px solid rgba(124, 58, 237, 0.1); padding-top: 8px;">
            <strong>Content &amp; Copyright Notice:</strong> FirstModelHub operates purely as an online directory and information service. All promotional listings, profiles, and associated images are provided and updated independently by individual third-party advertisers. We do not claim ownership, control, or responsibility for any user-generated content. For immediate copyright verification or removal requests, please officially reach out to us at: <a href="/about" style="color: #7C3AED; text-decoration: underline;">abuse [at] firstmodelhub.com</a>.
          </div>
        </footer>
    </div>

    <script type="module" src="/main.js?v=${GLOBAL_PROFILE_VERSION}"></script>

    <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #FFFFFF; padding: 8px 14px calc(10px + env(safe-area-inset-bottom)) 14px; border-top: 1px solid rgba(124, 58, 237, 0.15); display: flex; flex-direction: column; gap: 6px; z-index: 999; box-sizing: border-box; box-shadow: 0 -4px 20px rgba(0,0,0,0.06);">
      <div style="display: flex; align-items: center; gap: 8px;">
        <a href="${lineId}" target="_blank" rel="noopener nofollow" class="fmh-btn-line-cta" style="flex: 1; padding: 10px 0; display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #FFFFFF; font-size: 13px; font-weight: 800; border-radius: 100px; text-decoration: none; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.28);" onclick="if(window.trackLineClick)window.trackLineClick('${profile.id}')">
          <i class="fab fa-line" style="font-size: 18px;"></i>
          <span>ทักแชตสอบถามคิว${escapeHTML(displayName)}</span>
          <span style="font-size: 10.5px; background: rgba(0,0,0,0.2); padding: 2px 7px; border-radius: 100px; font-weight: 600;">จ่ายหน้างาน</span>
        </a>
        <button type="button" class="fmh-btn-share-icon" data-action="share-profile" data-profile-name="${escapeHTML(displayName)}" data-profile-url="${canonicalUrl}" aria-label="แชร์โปรไฟล์" style="width: 42px; height: 42px; border-radius: 50%; background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.2); color: #7C3AED; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;">
          <i class="fas fa-share-alt" style="font-size: 15px;"></i>
        </button>
      </div>

      <a href="${liveAdminLine}" target="_blank" rel="noopener nofollow" style="text-align: center; color: #64748B; font-size: 11px; font-weight: 700; text-decoration: none; padding: 2px 0;">
        <i class="fas fa-headset" style="color: #7C3AED; margin-right: 4px;"></i> ทักน้องไม่ตอบ? <span style="color: #7C3AED; text-decoration: underline;">ติดต่อแอดมินช่วยเช็กคิวทันที (ฟรี)</span>
      </a>
    </div>

    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          const CURRENT_SW_VER = '${GLOBAL_PROFILE_VERSION}';
          navigator.serviceWorker.register('/sw.js?v=' + CURRENT_SW_VER).catch(function() {});
        });
      }
    </script>
</body>
</html>`;

    const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": isForceRefresh ? "no-store" : "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
      "Netlify-CDN-Cache-Control": isForceRefresh ? "no-store" : "public, s-maxage=86400, stale-while-revalidate=86400",
      "Netlify-Vary": "query=refresh",
      "ETag": `"${GLOBAL_PROFILE_VERSION}"`,
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    if (!isForceRefresh) {
      setSafeProfileCache(cacheKey, { html: htmlResponse, headers: responseHeaders, version: GLOBAL_PROFILE_VERSION });
    }
    return new Response(htmlResponse, { headers: responseHeaders });
  } catch (err) {
    console.error("Profile rendering error:", err);
    return context.next();
  }
};

export const config = {
  cache: "manual"
};
