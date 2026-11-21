import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

// 🟢 1. ระบบ Memory Cache พร้อมตัวจำกัดขนาด ป้องกัน Memory Leak บน Edge
const PROFILE_PAGE_CACHE = new Map();
const MAX_CACHE_ENTRIES = 150;
let GLOBAL_PROFILE_VERSION = `v_20261115_54`;

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
    return Deno.env.get("PURGE_SECRET") || "fmh_super_admin_2026";
  },
  DOMAIN: "https://firstmodelhub.com",
  BRAND_NAME: "FirstModelHub",
  CLOUDINARY_BASE_URL: "https://res.cloudinary.com/dduxw7k4/image/upload/",
  DEFAULT_FALLBACK_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp"
};

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
  "phra-nakhon-si-ayutthaya": "อยุธยา",
  korat: "นครราชสีมา",
  "nakhon-ratchasima": "นครราชสีมา",
  nakhonratchasima: "นครราชสีมา",
  songkhla: "สงขลา-หาดใหญ่",
  "hat-yai": "สงขลา-หาดใหญ่",
  hatyai: "สงขลา-หาดใหญ่",
  suratthani: "สุราษฎร์ธานี",
  "surat-thani": "สุราษฎร์ธานี",
  samui: "สุราษฎร์ธานี"
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

function detectAccurateProvinceKey(p) {
  if (!p) return "chiangmai";
  const rawKey = (p.provinceKey || p.province_slug || p.province_key || p.province || "").toString().trim().toLowerCase();
  const INVALID_KEYS = ["", "no_province", "other", "undefined", "null", "none"];

  if (rawKey && !INVALID_KEYS.includes(rawKey)) {
    if (rawKey === "chiang-mai" || rawKey === "chiang_mai") return "chiangmai";
    if (rawKey === "khonkaen" || rawKey === "khon_kaen") return "khon-kaen";
    if (rawKey === "phra-nakhon-si-ayutthaya") return "ayutthaya";
    if (rawKey === "surat-thani" || rawKey === "samui") return "suratthani";
    if (rawKey === "nakhon-ratchasima" || rawKey === "nakhonratchasima") return "korat";
    if (rawKey === "hat-yai" || rawKey === "hatyai") return "songkhla";
    return rawKey;
  }

  const fullText = [p.location || "", p.description || "", p.name || ""].join(" ").toLowerCase();
  for (const rule of PROVINCE_DETECTION_RULES) {
    if (rule.keywords.some((kw) => fullText.includes(kw))) return rule.key;
  }
  return "chiangmai";
}

// 🟢 Map โซนมาตรฐานชุดเดียวกับ ssr-province.js และ sitemap.js (เทียบแบบตัวพิมพ์เล็กทั้งหมด)
const UNIFIED_ZONE_SLUG_MAP = {

  // 1. เชียงใหม่
  "ตัวเมืองเชียงใหม่": "kumueang",
  "ในเมืองเชียงใหม่": "kumueang",
  "ในตัวเมืองเชียงใหม่": "kumueang",
  "ในเมืองภูเก็ต": "mueang-phuket",
  "ในตัวเมืองภูเก็ต": "mueang-phuket",
  "ในเมืองขอนแก่น": "mueang-khonkaen",
  "ในเมืองเชียงราย": "mueang-chiangrai",
  "ในตัวเมืองเชียงราย": "mueang-chiangrai",
  "ในเมืองอุดร": "mueang-udon",
  "ในเมืองชลบุรี": "mueang-chonburi",
  "ตัวเมืองโคราช": "mueang-korat",
  
  "นิมมาน": "nimman",
  "นิมมานเหมินท์": "nimman",
  "nimman": "nimman",
  "เจ็ดยอด": "jedyod",
  "jedyod": "jedyod",
  "สันติธรรม": "santitham",
  "santitham": "santitham",
  "ช้างเผือก": "changphueak",
  "changphueak": "changphueak",
  "หลัง มช.": "cmu",
  "หลัง มช": "cmu",
  "หลังมช": "cmu",
  "หลัง-มช": "cmu",
  "หลังมอ": "cmu",
  "cmu": "cmu",
  "หน้า มช.": "front-cmu",
  "หน้า มช": "front-cmu",
  "หน้ามช": "front-cmu",
  "หน้ามอ": "front-cmu",
  "namor": "front-cmu",
  "front-cmu": "front-cmu",
  "คูเมือง": "kumueang",
  "kumueang": "kumueang",
  "ท่าแพ": "thapae",
  "thapae": "thapae",
  "สันทราย": "sansai",
  "sansai": "sansai",
  "แม่โจ้": "maejo",
  "maejo": "maejo",
  "พายัพ": "payap",
  "payap": "payap",
  "ห้วยแก้ว": "huaykaew",
  "huaykaew": "huaykaew",
  "รวมโชค": "ruamchok",
  "ruamchok": "ruamchok",
  "แม่ริม": "maerim",
  "maerim": "maerim",
  "หางดง": "hangdong",
  "hangdong": "hangdong",
  "สันกำแพง": "sankamphaeng",
  "สารภี": "saraphi",
  "ดอยสะเก็ด": "doisaket",
  "เซ็นทรัลเฟส": "centralfest",
  "เซ็นทรัลเฟสติวัล": "centralfest",
  "สนามบินเชียงใหม่": "airport-cnx",
  "สนามบิน": "airport-cnx",

  // 2. กรุงเทพมหานคร
  "สุขุมวิท": "sukhumvit",
  "รัชดา": "ratchada",
  "รัชดาภิเษก": "ratchada",
  "ห้วยขวาง": "huaikhwang",
  "ลาดพร้าว": "ladprao",
  "ทองหล่อ": "thonglor",
  "เอกมัย": "ekkamai",
  "สาทร": "sathorn",
  "สีลม": "silom",
  "บางนา": "bangna",
  "พระราม 9": "rama9",
  "พระราม9": "rama9",
  "อารีย์": "ari",
  "รามอินทรา": "ramintra",

  // 3. ชลบุรี / พัทยา
  "พัทยา": "pattaya",
  "พัทยากลาง": "pattaya-klang",
  "พัทยาใต้": "pattaya-tai",
  "หาดจอมเทียน": "jomtien",
  "จอมเทียน": "jomtien",
  "บางแสน": "bangsaen",
  "ศรีราชา": "sriracha",
  "ตัวเมืองชลบุรี": "mueang-chonburi",
  "อมตะนคร": "amata",
  "อมตะ": "amata",
  "แหลมฉบัง": "laemchabang",
  "บ่อวิน": "bowin",

  // 4. ภูเก็ต
  "ตัวเมืองภูเก็ต": "mueang-phuket",
  "เมืองภูเก็ต": "mueang-phuket",
  "ป่าตอง": "patong",
  "กะทู้": "kathu",
  "ฉลอง": "chalong",
  "กะรน": "karon",
  "กะตะ": "kata",
  "บางเทา": "bangtao",
  "ราไวย์": "rawai",
  "เชิงทะเล": "cherngtalay",
  "กมลา": "kamala",
  "สนามบินภูเก็ต": "phuket-airport",

  // 5. ขอนแก่น
  "ในตัวเมืองขอนแก่น": "mueang-khonkaen",
  "ตัวเมืองขอนแก่น": "mueang-khonkaen",
  "กังสดาล": "kangsadan",
  "หลัง มข.": "kku",
  "หลัง มข": "kku",
  "หลังมข": "kku",
  "หลัง-มข": "kku",
  "หลังมอ": "kku",
  "หน้า มข.": "kku-front",
  "หน้า มข": "kku-front",
  "หน้ามข": "kku-front",
  "namor-kku": "kku-front",
  "โนนม่วง": "nonmuang",
  "เซ็นทรัลขอนแก่น": "central-khonkaen",
  "บึงแก่นนคร": "buengkaennakhon",
  "ม.ภาค": "m-phak-area",
  "m-phak": "m-phak-area",
  "m-phak-area": "m-phak-area",
  "ศิลา": "sila",
  "ถนนมิตรภาพ": "mittraphap",

  // 6. เชียงราย
  "ตัวเมืองเชียงราย": "mueang-chiangrai",
  "เมืองเชียงราย": "mueang-chiangrai",
  "บ้านดู่": "baandu",
  "หน้า มฟล.": "mfu",
  "หน้า มฟล": "mfu",
  "หน้ามฟล": "mfu",
  "มฟล": "mfu",
  "มฟล.": "mfu",
  "ม.แม่ฟ้าหลวง": "mfu",
  "mae-fah-luang": "mfu",
  "หอนาฬิกา": "clock-tower",
  "ไนท์บาซาร์": "night-bazaar",
  "เด่นห้า": "den-ha",
  "รอบเวียง": "rop-wiang",
  "ริมกก": "rim-kok",
  "สนามบินเชียงราย": "chiangrai-airport",
  "แม่สาย": "maesai",

  // 7. อุดรธานี
  "ตัวเมืองอุดร": "mueang-udon",
  "ในตัวเมืองอุดร": "mueang-udon",
  "ud town": "udtown",
  "ud-town": "udtown",
  "udtown": "udtown",
  "ยูดีทาวน์": "udtown",
  "หนองประจักษ์": "nongprajak",
  "เซ็นทรัลอุดร": "central-udon",
  "บ้านจาน": "ban-chan",
  "โพศรี": "pho-si",
  "ทุ่งศรีเมือง": "thung-si-mueang",
  "หนองสิม": "nong-sim",
  "ตลาดรังษิณา": "rangsina",
  "รังษิณา": "rangsina",
  "สี่แยกไฮเทค": "high-tech",

  // 8. ลำปาง
  "ตัวเมืองลำปาง": "mueang-lampang",
  "ในเมืองลำปาง": "mueang-lampang",
  "สวนดอก": "suan-dok",
  "สบตุ๋ย": "sob-tui",
  "ม.ราชภัฏลำปาง": "lpru",
  "ม.ราชภัฏ": "lpru",
  "ราชภัฏลำปาง": "lpru",
  "เซ็นทรัลลำปาง": "central-lampang",
  "กาดกองต้า": "kad-kong-ta",
  "อัศวิน": "atsavin",
  "เกาะคา": "ko-kha",

  // 9. ลำพูน & พิษณุโลก
  "ตัวเมืองลำพูน": "mueang-lamphun",
  "นิคมลำพูน": "nikom-lamphun",
  "เวียงยอง": "wiang-yong",
  "ป่าซาง": "pa-sang",
  "เหมืองง่า": "mueang-nga",
  "บ้านกลาง": "ban-klang",
  "ตัวเมืองพิษณุโลก": "mueang-phitsanulok",
  "รอบ มน.": "nu",
  "รอบ มน": "nu",
  "รอบมน": "nu",
  "ม.นเรศวร": "nu",
  "มน.": "nu",
  "ท่าโพธิ์": "tha-pho",
  "สมอแข": "samo-khae",
  "ท็อปแลนด์": "topland",
  "เซ็นทรัลพิษณุโลก": "central-phitsanulok",

  // 10. อยุธยา, โคราช, หาดใหญ่, สุราษฎร์-สมุย
  "โรจนะ": "rojana",
  "ตัวเมืองอยุธยา": "mueang-ayutthaya",
  "บางปะอิน": "bang-pa-in",
  "ประตูชัย": "pratu-chai",
  "เสนา": "sena",
  "ในเมืองโคราช": "mueang-korat",
  "ตัวเมืองโคราช": "mueang-korat",
  "เซ็นทรัลโคราช": "central-korat",
  "เดอะมอลล์โคราช": "themall-korat",
  "มทส.": "sut",
  "มทส": "sut",
  "จอหอ": "joho",
  "ปากช่อง": "pakchong",
  "เขาใหญ่": "khaoyai",
  "ตัวเมืองหาดใหญ่": "hatyai",
  "ม.อ.หาดใหญ่": "psu",
  "ม.อ.": "psu",
  "คอหงส์": "kho-hong",
  "ลีการ์เดนส์": "lee-gardens",
  "ด่านนอก": "dannok",
  "ตัวเมืองสงขลา": "mueang-songkhla",
  "ตัวเมืองสุราษฎร์": "mueang-surat",
  "เกาะสมุย": "samui",
  "เฉวง": "chaweng",
  "ละไม": "lamai",
  "บ่อผุด": "bophut",
  "เกาะพะงัน": "phangan"
};

const MUEANG_ZONE_BY_PROVINCE = {
  chiangmai: "kumueang",
  chiangrai: "mueang-chiangrai",
  lampang: "mueang-lampang",
  lamphun: "mueang-lamphun",
  phitsanulok: "mueang-phitsanulok",
  udonthani: "mueang-udon",
  "khon-kaen": "mueang-khonkaen",
  phuket: "mueang-phuket",
  chonburi: "mueang-chonburi",
  ayutthaya: "mueang-ayutthaya",
  korat: "mueang-korat",
  songkhla: "hatyai",
  suratthani: "mueang-surat"
};

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
  // 🟢 ถ้าวันที่ใน Database บันทึกเวลาล่วงหน้าเกินปัจจุบัน ให้ใช้วันเวลาปัจจุบันแทนทันที
  if (d.getTime() > now.getTime()) {
    d = now;
  }
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
    .replace(/ฟิวแฟว|ฟิวเเฟน/g, "ฟิวแฟน")
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

function optimizeImg(imagePath, mode = "card") {
  const DEFAULT_FALLBACK_IMG = "https://firstmodelhub.com/images/firstmodelhub.webp";
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) return DEFAULT_FALLBACK_IMG;
  const cleanPath = imagePath.trim();

  if (cleanPath.includes("firstmodelhub.webp") || cleanPath.length < 10) {
    return DEFAULT_FALLBACK_IMG;
  }

  if (cleanPath.startsWith("data:")) return cleanPath;
  let transform = "f_auto,q_auto:good,w_320,h_448,c_fill,g_auto,e_sharpen:35";

  if (mode === "thumb" || (typeof mode === "number" && mode <= 150)) {
    transform = "f_auto,q_auto:good,w_120,h_120,c_thumb,g_face";
  } else if (mode === 300 || mode === "swiper") {
    transform = "f_auto,q_auto:good,w_300,h_420,c_fill,g_auto";
  } else if (mode === "og") {
    transform = "f_auto,q_auto:good,w_1200,h_630,c_fill,g_face";
  } else if (typeof mode === "number") {
    const w = mode;
    const h = Math.round(mode * 1.4);
    transform = `f_auto,q_auto:good,w_${w},h_${h},c_fill,g_auto`;
  }

  if (cleanPath.includes("res.cloudinary.com")) {
    const cloudMatch = cleanPath.match(/res\.cloudinary\.com\/([a-zA-Z0-9_-]+)\/image\/upload/);
    const cloudName = cloudMatch ? cloudMatch[1] : "dduxw7k4";
    const fileMatch = cleanPath.match(/(?:v\d+\/)?(images\/[^\s\?]+|[^\/]+\.(?:png|jpg|jpeg|webp|avif))$/i);
    if (fileMatch && fileMatch[1]) {
      return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${fileMatch[1]}`;
    }
    return cleanPath;
  }

  const formatted = cleanPath.replace(/^\/+/, "");
  return `https://res.cloudinary.com/dduxw7k4/image/upload/${transform}/${formatted}`;
}

function generateSrcSet(imagePath) {
  if (!imagePath || typeof imagePath !== "string" || !imagePath.includes("res.cloudinary.com")) {
    return "";
  }
  const img400 = optimizeImg(imagePath, 400);
  const img600 = optimizeImg(imagePath, 600);
  return `${img400} 400w, ${img600} 600w`;
}

function formatLineUrl(rawInput, fallbackAdminLine = "https://line.me/ti/p/u8Bz9HsaY8") {
  if (!rawInput || typeof rawInput !== "string") {
    return fallbackAdminLine;
  }
  const trimmed = rawInput.trim();
  // 🟢 ดักจับลิงก์ที่เคยขึ้น 400 Bad Request หรือเป็นบัญชีที่ถูกระงับ
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

function generateDynamicPersonaDesc(p, displayName, provinceName, zone, stats, age, height, weight) {
  let rawPersonalDesc = sanitizeThaiText(p.description || "")
    .replace(/เรทราคา|รายละเอียดค่ะ|1500\/1/gi, "")
    .replace(/[ฃ͡➴˚˳*•ㅅ•づ♡]+/g, "")
    .trim();

  const speechText = (rawPersonalDesc.length >= 8)
    ? rawPersonalDesc
    : "ยินดีที่ได้รู้จักค่ะ ทักมาพูดคุยสอบถามคิวหรือนัดเวลาล่วงหน้าได้เลยนะคะ เทคแคร์เป็นกันเอง ไม่ดุค่ะ";

  const pId = Number(p.id) || 1;
  const rawTagsList = Array.isArray(p.styleTags)
    ? p.styleTags
    : (Array.isArray(p.style_tags)
        ? p.style_tags
        : (typeof p.style_tags === "string" ? p.style_tags.split(",") : []));
  const rawTags = rawTagsList.join(" ").toLowerCase();

  const openings = [
    `ข้อมูลประวัติและรูปภาพของ${displayName} ผ่านการตรวจสอบตัวตนจริงเรียบร้อยแล้ว น้องเป็นคนอารมณ์ดี ยิ้มแย้มสดใส และให้ความเป็นกันเอง`,
    `${displayName} สาวสวยประจำทำเล${zone} มาพร้อมบุคลิกน่ารัก มารยาทเรียบร้อย อัธยาศัยดี และเทคแคร์อย่างอบอุ่น`,
    `ยินดีต้อนรับสู่โปรไฟล์ของ${displayName} อัปเดตพิกัดและสัดส่วนจริง น้องพูดเพราะ สุภาพ วางตัวดี พร้อมดูแลให้ช่วงเวลาของคุณมีความสุข`,
    `แนะนำ${displayName} เพื่อนเที่ยวคนโปรดในโซน${zone} (${provinceName}) ดูแลเอาใจใส่เป็นธรรมชาติ ไม่เร่งรีบ สบายใจทุกการนัดพบ`,
    `โปรไฟล์ยืนยันตัวตนจริงของ${displayName} น่ารัก นิสัยขี้อ้อน ชวนคุยสนุก ช่วยคลายความเหนื่อยล้าได้อย่างเป็นกันเอง`,
    `${displayName} สาวสวยหุ่นดี สเปกยอดนิยมประจำย่าน${zone} ให้เกียรติผู้รับบริการ อ่อนโยน และตรงปกตามรูปประกาศ 100%`,
    `รายละเอียดส่วนตัวของ${displayName} อัปเดตพร้อมรับงานในพื้นที่${zone} ดูแลใกล้ชิด ให้ความรู้สึกผ่อนคลายเหมือนมีคนรู้ใจเคียงข้าง`,
    `หากคุณกำลังมองหาเพื่อนเที่ยวดูแลดีสไตล์ฟิวแฟนใน${provinceName} ${displayName} พร้อมให้บริการด้วยความจริงใจและสุภาพค่ะ`
  ];
  const introText = openings[pId % openings.length];

  let styleText = "เน้นการดูแลเอาใจใส่สไตล์เพื่อนสนิท สุภาพ อ่อนโยน และไม่เร่งรอบเวลางาน";
  if (rawTags.includes("ฟิวแฟน") || rawTags.includes("gfe")) {
    styleText = "เน้นฟิวแฟน (GFE) ใกล้ชิด น่ารัก ขี้อ้อน เทคแคร์ดั่งแฟนตัวจริง เหมาะสำหรับนัดทานข้าว นั่งคาเฟ่ หรือพักผ่อนส่วนตัว";
  } else if (rawTags.includes("เอ็น") || rawTags.includes("ปาร์ตี้")) {
    styleText = "สายเอ็นเตอร์เทน (EN VIP) สนุกสนาน ชงเหล้าเก่ง คุยสนุก สร้างบรรยากาศที่ผ่อนคลายและเป็นกันเองในงานเลี้ยงส่วนตัว";
  } else if (rawTags.includes("ตัวเล็ก") || rawTags.includes("น่ารัก")) {
    styleText = "สเปกสาวไซส์มินิ สดใส น่ารัก คุยเก่ง อัธยาศัยดี เป็นเพื่อนร่วมทางที่ทำให้คุณยิ้มได้ตลอดเวลา";
  }

  const locList = [
    `ประจำการอยู่ในโซน${zone} มีห้องพักส่วนตัวที่สะอาด มิดชิด หรือพร้อมเดินทางไปหา (Outcall) ถึงโรงแรมและคอนโดในพื้นที่`,
    `สแตนด์บายในย่าน${zone} พร้อมเดินทางไปดูแลถึงที่พัก คอนโดมิเนียม หรือโรงแรมชั้นนำในละแวกใกล้เคียงอย่างรวดเร็ว`,
    `มีห้องพักส่วนตัวในทำเล${zone} บรรยากาศเงียบสงบ และพร้อมออกเดินทางไปบริการนอกสถานที่ตามเวลานัดหมายที่คุณสะดวก`,
    `พักและสแตนด์บายในละแวก${zone} สามารถนัดหมายเดินทางไปพบที่โรงแรมหรือที่พักส่วนตัวได้อย่างตรงเวลาและปลอดภัย`
  ];
  const locationText = locList[(pId + 2) % locList.length];
  const safetyText = "ลูกค้าชำระค่าบริการโดยตรงเมื่อเจอตัวน้องหน้างานเรียบร้อยแล้วเท่านั้น ไม่มีนโยบายโอนเงินมัดจำล่วงหน้าทุกกรณี หากตรวจสอบแล้วตัวจริงไม่ตรงปก สามารถปฏิเสธและยกเลิกได้ทันที";

  return `
    <div style="background: #FFFFFF; border: 1.5px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 14px 16px; margin-bottom: 8px; box-shadow: 0 2px 8px rgba(124, 58, 237, 0.04);">
      <div style="display: flex; align-items: flex-start; gap: 8px; background: #F8F6FC; padding: 10px 12px; border-radius: 12px; margin-bottom: 12px;">
        <span style="font-size: 16px; line-height: 1;">💬</span>
        <p style="font-size: 12.5px; color: #334155; line-height: 1.6; margin: 0; font-style: italic;">"${escapeHTML(speechText)}"</p>
      </div>
      <div style="font-size: 12.5px; color: #475569; line-height: 1.65; margin-bottom: 10px;">
        <p style="margin: 0 0 6px 0;">${introText}</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: #475569; border-top: 1px dashed rgba(124, 58, 237, 0.15); padding-top: 10px;">
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <i class="fas fa-heart" style="color: #E11D48; width: 14px; text-align: center; margin-top: 3px;"></i>
          <span><strong>สไตล์การดูแล:</strong> ${styleText}</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <i class="fas fa-map-marker-alt" style="color: #7C3AED; width: 14px; text-align: center; margin-top: 3px;"></i>
          <span><strong>พื้นที่บริการ:</strong> ${locationText}</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <i class="fas fa-shield-alt" style="color: #059669; width: 14px; text-align: center; margin-top: 3px;"></i>
          <span><strong>ข้อตกลงความปลอดภัย:</strong> ${safetyText}</span>
        </div>
      </div>
    </div>
  `;
}

function generateHumanMetaDesc(name, prov, city, zone, stats, price, id) {
  const seed = (typeof id === "number" ? id : String(id || "1").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0));

  const humanTemplates = [
    `ดูโปรไฟล์ ${name} สแตนด์บายโซน${zone} (${prov}) สัดส่วน ${stats} เพื่อนเที่ยวสไตล์ฟิวแฟน น่ารัก เป็นกันเอง นัดทานข้าว คาเฟ่ หรือพักผ่อนส่วนตัว เรทเริ่มต้น ${price} ตรวจสอบตัวจริงหน้างานค่อยชำระเงินค่ะ`,
    `${name} เพื่อนเที่ยวฟิวแฟน${prov} พิกัดย่าน${zone} สเปกน่ารัก อัธยาศัยดี ไม่เร่งงาน เรท ${price} มีห้องส่วนตัวและเดินทางได้ ปลอดภัยไม่โอนมัดจำ ทักไลน์สอบถามคิวได้ตลอดเวลาค่ะ`,
    `โปรไฟล์ ${name} รับงานไซด์ไลน์${city} พิกัด${zone} สัดส่วน ${stats} เทคแคร์อบอุ่นเหมือนแฟนตัวจริง สุภาพ ให้เกียรติลูกค้า เรท ${price} เจอน้องตัวจริงก่อนค่อยจ่ายเงิน สบายใจ ปลอดภัยค่ะ`,
    `นัดเจอน้อง${name.replace(/^(น้อง)+/, "")} ไซด์ไลน์${prov} ย่าน${zone} สัดส่วน ${stats} ตัวจริงรูปตรงปก ดูแลเป็นกันเอง ไม่เร่งรอบ เรทเริ่มต้น ${price} ตรวจสอบความถูกต้องหน้างานก่อนค่อยจ่ายเงินค่ะ`
  ];

  return humanTemplates[Math.abs(seed) % humanTemplates.length];
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
    const secret = url.searchParams.get("secret") || req.headers.get("x-purge-secret");
    if (secret === CONFIG.PURGE_SECRET) {
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
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
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

  // 🟢 ปิด /sideline/* หรือ URL ยาวผิดปกติทันที ไม่ปล่อยไหลไป Soft 404
  if (!rawSlug || rawSlug === "*" || rawSlug.length > 120) {
    return new Response("404 Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" }
    });
  }

  const isForceRefresh = url.searchParams.get("refresh") === CONFIG.PURGE_SECRET || url.searchParams.has("purge");
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

    // 🟢 1. ค้นหาจาก slug ตรงตัวก่อนเสมอ + ดึง site_settings พร้อมกัน
    const [slugRes, settingsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("active", true).eq("slug", rawSlug).maybeSingle(),
      supabase.from("site_settings").select("key, value")
    ]);

    const settingsMap = new Map((settingsRes?.data || []).map((s) => [s.key, s.value]));
    const liveAdminLine = settingsMap.get("admin_line_url") || "https://line.me/ti/p/u8Bz9HsaY8";

    let profile = slugRes?.data || null;

    // 🟢 2. ถ้าไม่เจอด้วย slug ค่อย Fallback ไปค้นด้วยตัวเลข ID ท้าย URL
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

    const dbSlug = String(profile.slug || "").trim().replace(/\s+/g, "-");
    const trueCanonicalSlug = (!dbSlug || /[\u0E00-\u0E7F]/.test(dbSlug)) ? `model-${profile.id}` : dbSlug;
    const canonicalPath = `/sideline/${encodeURIComponent(trueCanonicalSlug)}`;
    if (segments.length !== 2 || rawSlug !== trueCanonicalSlug || url.pathname.endsWith("/")) {
      return Response.redirect(`${CONFIG.DOMAIN}${canonicalPath}`, 301);
    }

    // 🟢 4. ตรวจจับและแปลง Slug จังหวัดให้ตรงกับ ssr-province.js และ sitemap.js 100%
    const provinceKey = detectAccurateProvinceKey(profile);
    const cleanProvinceKey = provinceKey.replace(/[-_]/g, "");

    const provVariants = [provinceKey, cleanProvinceKey];
    if (provinceKey === "chiangmai") provVariants.push("chiang-mai", "chiang_mai");
    if (provinceKey === "khon-kaen" || provinceKey === "khonkaen") provVariants.push("khonkaen", "khon_kaen");
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

    // 🟢 แก้ลิงก์การ์ดแนะนำ: แปลง Slug ภาษาไทยเป็น model-ID เหมือน Canonical 100%
    const relatedCardsHtml = relatedProfiles.length > 0 ? `
      <section style="margin-top: 1.5rem; border-top: 1px solid rgba(124, 58, 237, 0.12); padding-top: 1.25rem;">
        <h2 style="color: #7C3AED; font-size: 13.5px; font-weight: 900; margin: 0 0 10px 0; text-align: center;">น้องๆ แนะนำเพิ่มเติมในโซน${escapeHTML(provinceNameThai)}</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          ${relatedProfiles.map((rp) => {
            const rpName = `น้อง${escapeHTML((rp.name || "สาวสวย").trim().replace(/^(น้อง\s?)+/gi, ""))}`;
            const rpRawSlug = String(rp.slug || "").trim();
            const rpSafeSlug = (!rpRawSlug || /[\u0E00-\u0E7F]/.test(rpRawSlug)) ? `model-${rp.id}` : rpRawSlug;
            const rpSlug = encodeURIComponent(rpSafeSlug);
            const rpImg = optimizeImg(rp.imagePath || rp.image_url || "", 400);
            return `
              <a href="/sideline/${rpSlug}" style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1.5px solid rgba(124, 58, 237, 0.12); display: block; text-align: center; text-decoration: none; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
                <img src="${rpImg}" alt="${rpName} รับงาน${escapeHTML(provinceNameThai)}" loading="lazy" width="120" height="150" style="width: 100%; aspect-ratio: 4/5; object-fit: cover; display: block;">
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
    const heroImageLarge = optimizeImg(rawImage, 600);
    const heroImageSmall = optimizeImg(rawImage, 400);
    const ogImageSocial = optimizeImg(rawImage, "og");
    const heroSrcSet = generateSrcSet(rawImage);

    const uniqueGallery = [...new Set([rawImage, ...validGalleryUrls].filter((s) => s && (s.startsWith("http") || s.startsWith("/")) && !s.includes("firstmodelhub.webp")))];

    const galleryThumbnailsHtml = uniqueGallery.length > 1 ? `
      <div class="profile-gallery-strip" id="profile-gallery-strip" style="display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch;">
        ${uniqueGallery.map((imgUrl, i) => `
          <button type="button" class="thumb-slot ${i === 0 ? "active" : ""}" data-full-src="${optimizeImg(imgUrl, 600)}" style="padding: 0; width: 62px; height: 80px; border-radius: 10px; overflow: hidden; flex-shrink: 0; cursor: pointer; border: 2px solid ${i === 0 ? "#7C3AED" : "transparent"}; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: none;">
            <img src="${optimizeImg(imgUrl, "thumb")}" alt="รูปที่ ${i + 1}" width="62" height="80" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
          </button>
        `).join("")}
      </div>
    ` : "";

    const rawLineInput = (profile.line_id || profile.line || profile.lineId || profile.line_url || "").trim();
    const lineId = formatLineUrl(rawLineInput, liveAdminLine);

    const pSeedNum = Number(profile.id) || 1;

    const cleanAge = profile.age && String(profile.age).trim() !== "-" && String(profile.age).trim() !== "0"
      ? String(profile.age).replace(/\D/g, "")
      : null;
    const resolvedAge = cleanAge || String(21 + (pSeedNum % 4));
    const age = resolvedAge;
    const ageDisplay = `${resolvedAge} ปี`;

    const cleanHeight = profile.height && String(profile.height).trim() !== "-" && String(profile.height).trim() !== "0"
      ? String(profile.height).replace(/\D/g, "")
      : null;
    const resolvedHeight = cleanHeight || String(158 + (pSeedNum % 6));
    const height = resolvedHeight;
    const heightDisplay = `${resolvedHeight} ซม.`;

    const fallbackBustList = ["32C", "34B", "34C", "36C"];
    const stats = (function () {
      const dbStats = (profile.stats && String(profile.stats).trim() !== "-" && String(profile.stats).trim() !== "0" && String(profile.stats).trim() !== "ไม่ระบุ")
        ? String(profile.stats).trim()
        : "";
      if (dbStats) return dbStats;

      const fullText = `${profile.description || ""} ${profile.slogan || ""} ${profile.quote || ""}`;
      const match = fullText.match(/(\d{2,3}[A-Za-z]?\s*[-–]\s*\d{2}\s*[-–]\s*\d{2})/);
      if (match && match[1]) {
        return match[1].replace(/\s+/g, "");
      }
      return `${fallbackBustList[pSeedNum % fallbackBustList.length]}-24-35`;
    })();

    const rawH = parseInt(height, 10) || 160;
    const parsedDbWeight = parseInt(String(profile.weight || "").replace(/\D/g, ""), 10);
    const hasValidWeight = Boolean(parsedDbWeight && parsedDbWeight >= 38 && parsedDbWeight <= 65);
    const resolvedWeight = hasValidWeight ? parsedDbWeight : (rawH - 112);
    const weight = String(resolvedWeight);
    const weightDisplay = `${weight} กก.`;

    const cleanProvince = escapeHTML(provinceNameThai);
    const rawLoc = sanitizeThaiText(profile.location || "");

    // 🟢 แก้บั๊ก Regex: ไม่ตัดคำว่า "ในตัวเมือง"/"ตัวเมือง" ทิ้งจนเหลือ "ใกล้เคียง"
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

    // 🟢 แก้ปัญหาสร้างลิงก์โซนภาษาไทยซ้ำ: เทียบ Map ตัวพิมพ์เล็ก ถ้าไม่เจอใน Map ให้ใช้หน้าจังหวัดแทน
    const cleanZoneKey = primaryZone.trim().replace(/[\r\n\t]+/g, "").replace(/(?<!มช|มข|มฟล|มน|ม\.อ)\.+$/, "");
    const zoneKeyLower = cleanZoneKey.toLowerCase();
    let matchedSlugPart =
      UNIFIED_ZONE_SLUG_MAP[zoneKeyLower] ||
      UNIFIED_ZONE_SLUG_MAP[zoneKeyLower.replace(/\./g, "")] ||
      "";

    if (!matchedSlugPart && (zoneKeyLower === "ในเมือง" || zoneKeyLower === "ตัวเมือง" || zoneKeyLower === "ในตัวเมือง")) {
      matchedSlugPart = MUEANG_ZONE_BY_PROVINCE[provinceKey] || "";
    }

    const hasValidZoneSlug = Boolean(matchedSlugPart);
    const zoneHubUrl = hasValidZoneSlug ? `/location/${provinceKey}/${matchedSlugPart}` : provinceHubUrl;

    const localizedZone = profile.location ? sanitizeThaiText(profile.location) : "ในเมือง";
    const naturalDesc = generateDynamicPersonaDesc(profile, displayName, cleanProvince, localizedZone, stats, age, height, weight);

    const actualDateText = getProfileActualDate(profile.updated_at || profile.created_at);
    const zoneParen = hasDistinctZone ? ` (${primaryZone})` : "";
    const zoneLabel = hasDistinctZone ? ` โซน${primaryZone}` : "";
    const profileSeoH1 = `${displayName} รับงาน${cleanProvince}${zoneParen}`;
    const pageTitle = `${displayName} รับงาน${cleanProvince}${zoneParen} ไซด์ไลน์ฟิวแฟน ตัวจริงตรงปก จ่ายหน้างาน`;
    const metaDescription = `โปรไฟล์ ${displayName} รับงาน${cleanProvince}${zoneLabel} สัดส่วน ${stats} สไตล์ฟิวแฟน ตัวจริงตรงปก 100% นัดพบจ่ายหน้างาน ไร้มัดจำค่ะ [อัปเดตข้อมูลจริง ${actualDateText}]`;

    const canonicalUrl = `${CONFIG.DOMAIN}${canonicalPath}`;
    const realTimeText = getRealTimeAgo(profile.updated_at || profile.created_at);
    const currentAvail = (profile.availability || "").trim();

    const isBusy = ["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด", "สอบถามคิว"].some((s) => currentAvail.toLowerCase().includes(s));
    const isOnlineNow = (currentAvail === "รับงาน" || currentAvail === "พร้อมรับงาน") || (!isBusy && Boolean(currentAvail));
    const realStatusText = currentAvail || (isOnlineNow ? "พร้อมรับงาน" : "สอบถามคิว");
    const statusDotColor = (currentAvail === "สอบถามคิว" || !isOnlineNow) ? "#F59E0B" : "#059669";

    const cleanHeightNum = parseInt(String(height).replace(/\D/g, ""), 10) || 160;
    const cleanWeightNum = parseInt(String(weight).replace(/\D/g, ""), 10) || 48;
    const activeBreadcrumbText = `ไซด์ไลน์${cleanProvince}`;

    const profileFaqs = [
      {
        q: `การนัดพบ${displayName} มีขั้นตอนการชำระเงินอย่างไร?`,
        a: `สามารถชำระเงินสดหรือโอนตรงให้น้องตอนที่เดินทางไปถึงที่นัดหมายได้เลยค่ะ ทางระบบไม่มีนโยบายให้โอนเงินมัดจำล่วงหน้า เพื่อความสบายใจและโปร่งใสของทั้งสองฝ่ายค่ะ`
      },
      {
        q: `หากน้องเดินทางไปถึงแล้วไม่เหมือนในรูปภาพ สามารถทำอย่างไรได้บ้าง?`,
        a: `หากพบว่าตัวจริงไม่ตรงตามรูปโปรไฟล์ หรือไม่เป็นไปตามที่ตกลงกันไว้ สามารถปฏิเสธการเริ่มงานและยกเลิกการนัดหมายได้ทันทีโดยไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้นค่ะ`
      },
      {
        q: `นัดพบ${displayName} ในโซน${primaryZone} มีห้องส่วนตัวหรือเดินทางนอกสถานที่ได้ไหม?`,
        a: `${displayName} มีห้องพักส่วนตัวย่าน${primaryZone} ที่สะอาด มิดชิด ปลอดภัย พร้อมออกเดินทางไปดูแล (Outcall) ถึงโรงแรมหรือที่พักส่วนตัวในพื้นที่ได้สะดวกรวดเร็วค่ะ`
      }
    ];

    const faqAccordionHtml = `
      <section class="profile-faq-section" style="margin-top: 1.5rem; border-top: 1px solid rgba(124, 58, 237, 0.12); padding-top: 1.25rem;">
        <h2 style="color: #7C3AED; font-size: 13.5px; font-weight: 900; margin: 0 0 10px 0; text-align: center;">❓ คำถามพบบ่อยเกี่ยวกับ${escapeHTML(displayName)}</h2>
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
        {
          "@type": "Person",
          "@id": `${canonicalUrl}#person`,
          "name": stripHTML(displayName),
          "alternateName": `${stripHTML(displayName)} ${CONFIG.BRAND_NAME}`,
          "gender": "https://schema.org/Female",
          "jobTitle": "เพื่อนเที่ยวฟิวแฟน",
          "description": `${stripHTML(displayName)} เพื่อนเที่ยวฟิวแฟน สแตนด์บาย${schemaPlaceText} สัดส่วน ${stripHTML(stats)} นัดพบตัวจริงจ่ายหน้างาน`,
          "image": {
            "@type": "ImageObject",
            "@id": `${canonicalUrl}#image`,
            "url": heroImageLarge
          },
          "url": canonicalUrl,
          "priceRange": `${rateNumber} THB`,
          "offers": {
            "@type": "Offer",
            "price": rateNumber,
            "priceCurrency": "THB",
            "availability": isOnlineNow ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
            "url": canonicalUrl
          },
          "height": {
            "@type": "QuantitativeValue",
            "value": cleanHeightNum,
            "unitCode": "CMT",
            "unitText": "cm"
          },
          "weight": {
            "@type": "QuantitativeValue",
            "value": cleanWeightNum,
            "unitCode": "KGM",
            "unitText": "kg"
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
        },
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

    <link rel="stylesheet" href="/styles.css?v=${GLOBAL_PROFILE_VERSION}">
    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">

    <!-- Open Graph (ครบสูตร Facebook & LINE) -->
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

        ['scroll', 'keydown'].forEach(function(evt){
          window.addEventListener(evt, loadGTM, { once: true, passive: true });
        });
        window.addEventListener('load', function() {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(function() { setTimeout(loadGTM, 1500); }, { timeout: 4000 });
          } else {
            setTimeout(loadGTM, 3500);
          }
        }, { once: true });
      })();
    </script>
</head>
<body class="fmh-app-page is-profile-page" style="background-color: #F8F6FC; color: #140F22;">
<div class="container" style="max-width: 680px; margin: 0 auto; padding: 1rem 1rem 8.5rem 1rem;">
        <header id="page-header" style="position: relative; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; backdrop-filter: blur(10px);">
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
            <li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>
            <li><a href="${provinceHubUrl}" style="color: #7C3AED; text-decoration: none; font-weight: 600;">${escapeHTML(activeBreadcrumbText)}</a></li>
            ${hasValidZoneSlug ? `
            <li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>
            <li><a href="${zoneHubUrl}" style="color: #7C3AED; text-decoration: none; font-weight: 600;">โซน${escapeHTML(primaryZone)}</a></li>
            ` : ""}
            <li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>
            <li aria-current="page"><span style="color: #140F22; font-weight: 700;">${escapeHTML(displayName)}</span></li>
          </ol>
        </nav>

        <main class="main-content">
            <article class="interactive-card fmh-bento-card">
               <section class="hero-section" style="padding: 0; margin-bottom: 1rem;">
                    <div style="position: relative; border-radius: 18px; overflow: hidden; aspect-ratio: 3/4.2; width: 100%; border: 1px solid rgba(124, 58, 237, 0.15);">
                     <img id="main-profile-img" src="${heroImageSmall}" ${heroSrcSet ? `srcset="${heroSrcSet}" sizes="(max-width: 480px) 100vw, 400px"` : ""} class="hero-img" alt="${escapeHTML(displayName)} เพื่อนเที่ยวฟิวแฟน${cleanProvince} โซน${primaryZone} ตรงปก 100% - FirstModelHub" loading="eager" fetchpriority="high" decoding="async" width="400" height="560" style="width: 100%; height: 100%; object-fit: cover;">
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
                          <span style="color: #94A3B8; font-size: 10px;">•</span>
                          <time class="fmh-relative-time" datetime="${isoUpdatedTime}" style="color: #475569; font-size: 11.5px; font-weight: 600;">${realTimeText}</time>
                      </div>
                  </div>
                </header>

                <div class="fmh-spec-grid">
                    <div class="fmh-spec-tile">
                        <span class="fmh-spec-tile-label">สัดส่วน</span>
                        <strong class="fmh-spec-tile-val">${escapeHTML(stats)}</strong>
                    </div>
                    <div class="fmh-spec-tile">
                        <span class="fmh-spec-tile-label">ส่วนสูง / น้ำหนัก</span>
                        <strong class="fmh-spec-tile-val">${heightDisplay} / ${weightDisplay}</strong>
                    </div>
                    <div class="fmh-spec-tile">
                        <span class="fmh-spec-tile-label">อายุ</span>
                        <strong class="fmh-spec-tile-val">${ageDisplay}</strong>
                    </div>
                    <div class="fmh-spec-tile">
                        <span class="fmh-spec-tile-label">พิกัดบริการ</span>
                        <a href="${zoneHubUrl}" style="color: #7C3AED; font-weight: 800; font-size: 11.5px; text-decoration: none;">
                          รับงาน${escapeHTML(cleanProvince)} (${escapeHTML(primaryZone)}) &rarr;
                        </a>
                    </div>
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
                      <span>🛡️ สถานะการตรวจสอบโปรไฟล์</span>
                    </strong>
                    <span style="background: rgba(5,150,105,0.1); color: #059669; font-size: 10.5px; font-weight: 800; padding: 2px 9px; border-radius: 100px;">ยืนยันตัวตนแล้ว</span>
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

                <section class="fmh-safety-protocol-card" style="margin-top: 1.5rem;">
                    <h2 style="font-size: 13.5px; font-weight: 900; margin: 0 0 8px 0; color: #140F22;">🛡️ แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัยสูงสุด</h2>
                    <p style="margin-bottom: 4px;"><strong style="color: #140F22;">✓ เกณฑ์อายุผู้ใช้งาน:</strong> แพลตฟอร์ม FirstModelHub กำหนดให้ผู้ขอรับบริการและผู้ลงประกาศต้องมีอายุครบ 20 ปีบริบูรณ์ขึ้นไปอย่างเข้มงวด</p>
                    <p style="margin-bottom: 4px;"><strong style="color: #140F22;">✓ จ่ายหน้างาน 100%:</strong> เจอน้องตัวจริงก่อนจึงค่อยจ่าย ไม่มีมัดจำล่วงหน้าทุกกรณี</p>
                    <p style="margin: 0;"><strong style="color: #140F22;">✓ รักษาความลับ (Zero-Log):</strong> ข้อมูลการติดต่อปลอดภัยสูงสุด</p>
                </section>
            </article>
        </main>

        <footer style="text-align: center; padding: 2rem 1rem; color: #64748B; font-size: 11.5px; line-height: 1.6;">
          <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - ศูนย์รวมเพื่อนเที่ยวฟิวแฟน ปลอดภัย จ่ายหน้างาน 100%</p>
          <div style="font-size: 10px; color: #94A3B8; max-width: 580px; margin: 8px auto 0 auto; border-top: 1px solid rgba(124, 58, 237, 0.1); padding-top: 8px;">
            <strong>Content &amp; Copyright Notice:</strong> FirstModelHub operates purely as an online directory and information service. All promotional listings, profiles, and associated images are provided and updated independently by individual third-party advertisers. We do not claim ownership, control, or responsibility for any user-generated content. For immediate copyright verification or removal requests, please officially reach out to us at: <a href="mailto:abuse@firstmodelhub.com" style="color: #7C3AED; text-decoration: underline;">abuse@firstmodelhub.com</a>.
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
          navigator.serviceWorker.register('/sw.js?v=' + CURRENT_SW_VER)
            .then(function(reg) {
              reg.onupdatefound = function() {
                const installingWorker = reg.installing;
                if (installingWorker) {
                  installingWorker.onstatechange = function() {
                    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      console.log('Profile page SW updated quietly.');
                    }
                  };
                }
              };
            })
            .catch(function(err) {
              console.warn('SW Error bypassed:', err);
            });
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
