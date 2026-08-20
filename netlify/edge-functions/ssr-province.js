import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const PAGE_CACHE = new Map();
const MAX_CACHE_SIZE = 300;
let GLOBAL_LAST_TIMESTAMP = "initial_v1";
let LAST_PROBE_TIME = 0;

let TEMPLATE_HTML_CACHE = null;
let TEMPLATE_CACHE_TIMESTAMP = 0;
const TEMPLATE_CACHE_TTL_MS = 3600000; // แคชเทมเพลต 1 ชั่วโมง
const STATIC_EXT_REGEX = /\.(css|js|png|jpg|jpeg|webp|avif|svg|ico|json|webmanifest|map|woff|woff2|ttf|txt|xml)$/i;

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
  PRIMARY_DOMAIN: "https://firstmodelhub.com",
  CLOUDINARY_CLOUD_NAME: "drffioary",
  CLOUDINARY_BASE_URL: "https://res.cloudinary.com/drffioary/image/upload/",
  BRAND_NAME: "FirstModelHub",
  BRAND_LEGAL_NAME: "FirstModelHub Co., Ltd.",
  DEFAULT_OG_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp",
  DEFAULT_TELEPHONE: "+66926997044",
  SOCIAL_LINKS: [
    "https://line.me/ti/p/ksLUWB89Y_",
    "https://tiktok.com/@sidelinecm",
    "https://twitter.com/sidelinechiangmai",
    "https://www.linkedin.com/in/cuteti-sexythailand-398567280?trk=contact-info",
    "https://bio.site/firstfiwfans.com",
    "https://linktr.ee/kissmodel",
    "https://bsky.app/profile/sidelinechiangmai.bsky.social"
  ]
};

const PROVINCE_CUSTOM_METADATA = {
  chiangmai: {
    title: "สาวรับงานเชียงใหม่ ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานเชียงใหม่ และเพื่อนเที่ยวไซด์ไลน์พรีเมียมสไตล์ฟิวแฟน คัดสรรโปรไฟล์ตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมย่านนิมมาน เจ็ดยอด สันติธรรม ช้างเผือก"
  },
  chiangrai: {
    title: "สาวรับงานเชียงราย ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานเชียงราย และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน ยืนยันตัวตนตรงปก 100% ปลอดภัยชำระเงินหน้างาน ไม่โอนมัดจำล่วงหน้า ครอบคลุมตัวเมือง บ้านดู่ มฟล. แม่สาย"
  },
  lampang: {
    title: "สาวรับงานลำปาง ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานลำปาง และเพื่อนเที่ยวพรีเมียม ปลอดภัยชำระเงินหน้างานเมื่อเจอตัวจริง ปราศจากการโอนมัดจำล่วงหน้า ครอบคลุมตัวเมืองลำปาง สวนดอก รอบเวียง ม.ราชภัฏลำปาง"
  },
  lamphun: {
    title: "สาวรับงานลำพูน ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "สารบัญสาวรับงานลำพูน และเพื่อนเที่ยวไซด์ไลน์สไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัยชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมนิคมลำพูน เวียงยอง ตัวเมืองลำพูน ป่าซาง"
  },
  phitsanulok: {
    title: "สาวรับงานพิษณุโลก ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานพิษณุโลก รับงาน มน. และเพื่อนเที่ยวสไตล์ฟิวแฟน ปลอดภัย จ่ายหน้างาน 100% ไม่โอนมัดจำล่วงหน้า ครอบคลุมตัวเมืองพิษณุโลก ม.นเรศวร สมอแข"
  },
  bangkok: {
    title: "สาวรับงานกรุงเทพ ไซด์ไลน์ กทม ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานกรุงเทพ รับงาน กทม และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมสุขุมวิท รัชดา ลาดพร้าว เอกมัย ห้วยขวาง"
  },
  chonburi: {
    title: "สาวรับงานชลบุรี ไซด์ไลน์พัทยา บางแสน ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "สารบัญสาวรับงานชลบุรี รับงานพัทยา และเพื่อนเที่ยวบางแสน พรีเมียมดูแลใส่ใจสไตล์ฟิวแฟน ปลอดภัยสูงสุดชำระค่าบริการหน้างานเมื่อเจอตัวจริง ครอบคลุมศรีราชา ตัวเมืองชลบุรี"
  },
  "khon-kaen": {
    title: "สาวรับงานขอนแก่น ไซด์ไลน์ขอนแก่น ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานขอนแก่น และเพื่อนเที่ยวไซด์ไลน์พรีเมียม สไตล์ฟิวแฟน คัดสรรโปรไฟล์ตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมย่านในตัวเมืองขอนแก่น กังสดาล มข."
  },
  phuket: {
    title: "สาวรับงานภูเก็ต ไซด์ไลน์ภูเก็ต ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานภูเก็ต ป่าตอง และเพื่อนเที่ยวพรีเมียม สไตล์ฟิวแฟน คัดสรรโปรไฟล์ตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมตัวเมืองภูเก็ต กะทู้ ฉลอง"
  },
  udonthani: {
    title: "สาวรับงานอุดร ไซด์ไลน์อุดรธานี ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "สารบัญสาวรับงานอุดรธานี และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัยจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมตัวเมืองอุดร UD Town หนองประจักษ์"
  }
};

const PROVINCE_SEO_DATA = {
  chiangmai: {
    name: "เชียงใหม่",
    geo: { lat: 18.8140717, lng: 98.972096 },
    zones: ["นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก", "หลัง มช.", "สันทราย", "ห้วยแก้ว"],
    faqs: [
      { q: "นัดหมายสาวรับงานเชียงใหม่ บน First Model Hub โซนไหนสะดวกที่สุด?", a: "ถนนนิมมานเหมินท์, สันติธรรม, ช้างเผือก และรอบคอนโดมิเนียมย่านเจ็ดยอด เป็นพิกัดหลักที่มีน้องๆ สแตนด์บายพร้อมดูแลท่านอย่างสะดวกรวดเร็วครับ" },
      { q: "การเรียกใช้บริการรับงานเชียงใหม่ ต้องโอนมัดจำล่วงหน้าหรือไม่?", a: "ไม่มีนโยบายโอนมัดจำล่วงหน้าทุกกรณีครับ เราใช้นโยบาย 'เจอตัวจริงค่อยชำระเงินโดยตรงหน้างาน' ป้องกันความเสี่ยงทางการเงิน 100%" }
    ]
  },
  lampang: {
    name: "ลำปาง",
    geo: { lat: 18.2888, lng: 99.4923 },
    zones: ["ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏลำปาง", "สบตุ๋ย"],
    faqs: [
      { q: "นัดพบสาวรับงานลำปาง ในตัวเมืองหรือแถวไหนสะดวกที่สุด?", a: "พิกัดยอดนิยมคือโรงแรมชั้นนำในตัวเมืองลำปาง, ย่านสวนดอก, ถนนรอบเวียง และละแวก ม.ราชภัฏลำปาง เดินทางสะดวกและเป็นส่วนตัวครับ" },
      { q: "การนัดหมายไซด์ไลน์ลำปาง ต้องมีเงินมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ เจอน้องตัวจริง ยืนยันความตรงปกหน้างานแล้วค่อยชำระค่าบริการโดยตรงกับน้องครับ" }
    ]
  },
  lamphun: {
    name: "ลำพูน",
    geo: { lat: 18.5772, lng: 99.0087 },
    zones: ["ตัวเมืองลำพูน", "นิคมลำพูน", "เวียงยอง", "ป่าซาง", "เหมืองง่า"],
    faqs: [
      { q: "สาวรับงานลำพูน โซนนิคมอุตสาหกรรมนัดหมายอย่างไร?", a: "น้องๆ สแตนด์บายพร้อมดูแลทั้งในโซนนิคมลำพูน ตัวเมืองลำพูน และเวียงยอง สามารถนัดเจอที่โรงแรมหรือที่พักส่วนตัวได้อย่างปลอดภัยครับ" },
      { q: "มีค่าใช้จ่ายจองคิวก่อนพบตัวน้องลำพูนไหม?", a: "ไม่มีค่าจองคิวล่วงหน้า 100% ชำระหน้างานเมื่อพบตัวน้องเรียบร้อยแล้วเท่านั้นครับ" }
    ]
  },
  chiangrai: {
    name: "เชียงราย",
    geo: { lat: 19.9105, lng: 99.8406 },
    zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "มฟล.", "หอนาฬิกา", "แม่สาย"],
    faqs: [
      { q: "นัดหมายสาวรับงานเชียงราย โซนบ้านดู่ และ มฟล. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำอยู่ในโซนบ้านดู่ หน้ามหาวิทยาลัยแม่ฟ้าหลวง และใจกลางเมืองเชียงราย พร้อมดูแลอย่างเป็นกันเองครับ" }
    ]
  },
  "khon-kaen": {
    name: "ขอนแก่น",
    geo: { lat: 16.4322, lng: 102.8236 },
    zones: ["ในตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น"],
    faqs: [
      { q: "นัดหมายสาวรับงานขอนแก่น ต้องโอนมัดจำไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าครับ พบน้องและตรวจสอบความตรงปกหน้างานแล้วค่อยชำระค่าบริการครับ" }
    ]
  },
  chonburi: {
    name: "ชลบุรี",
    geo: { lat: 12.9276, lng: 100.8771 },
    zones: ["พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี"],
    faqs: [
      { q: "เรียกสาวรับงานพัทยา บางแสน จ่ายเงินอย่างไร?", a: "ชำระตรงหน้างานเมื่อเจอน้องตัวจริงเรียบร้อยแล้วเท่านั้น ไม่มีโอนมัดจำก่อนทุกกรณีครับ" }
    ]
  },
  bangkok: {
    name: "กรุงเทพฯ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย"],
    faqs: [
      { q: "สาวรับงานกรุงเทพฯ ครอบคลุมโซนไหนบ้าง?", a: "ครอบคลุมสุขุมวิท รัชดา ห้วยขวาง ลาดพร้าว ทองหล่อ และเอกมัย สะดวกและเป็นส่วนตัวครับ" }
    ]
  },
  phuket: {
    name: "ภูเก็ต",
    geo: { lat: 7.8804, lng: 98.3923 },
    zones: ["ตัวเมืองภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง"],
    faqs: [
      { q: "นัดหมายสาวรับงานภูเก็ต จ่ายเงินอย่างไร?", a: "นัดเจอตัวจริงตรงปกหน้างานแล้วค่อยชำระเงินตรงกับน้อง ไม่มีโอนมัดจำล่วงหน้าครับ" }
    ]
  },
  udonthani: {
    name: "อุดรธานี",
    geo: { lat: 17.4138, lng: 102.7872 },
    zones: ["ตัวเมืองอุดร", "UD Town", "หนองประจักษ์"],
    faqs: [
      { q: "สาวรับงานอุดรธานี นัดพบแถวไหนสะดวกที่สุด?", a: "ย่านใจกลางเมืองอุดรธานี, UD Town และรอบสวนสาธารณะหนองประจักษ์ เป็นจุดนัดพบยอดนิยมครับ" }
    ]
  },
  default: {
    name: "ทั่วไทย",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["เชียงใหม่", "ขอนแก่น", "เชียงราย", "ลำปาง", "อุดรธานี", "ภูเก็ต"],
    faqs: [
      { q: "เรียกใช้บริการน้องๆ สาวรับงาน เด็กเอ็น First Model Hub ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่ต้องโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ ลูกค้าตกลงชำระค่าบริการหน้างานเมื่อเจอน้องตัวจริงตรงปกแล้วเท่านั้น" }
    ]
  }
};

// เติมค่า Default ให้กับทุกจังหวัด
Object.keys(PROVINCE_SEO_DATA).forEach(key => {
  if (key !== "default") {
    PROVINCE_SEO_DATA[key] = { ...PROVINCE_SEO_DATA.default, ...PROVINCE_SEO_DATA[key] };
  }
});

// ฟังก์ชันทำความสะอาดข้อความ ป้องกันคำสะกดผิดและคำล่อแหลมทางเพศ (SafeSearch Compliant)
function sanitizeThaiText(text) {
  if (text == null) return "";
  return String(text)
    .replace(/([\u0E31\u0E34-\u0E3A\u0E47-\u0E4E])\1+/g, "$1")
    .replace(/เจ็+ดยอด/g, "เจ็ดยอด")
    .replace(/นิมาน|นิทาน/g, "นิมมาน")
    .replace(/ฟื้นที่/g, "พื้นที่")
    .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/พาพับ/g, "พายัพ")
    .replace(/(รับงาน|ตัวเมือง)\s*ของแก่น/g, "$1 ขอนแก่น")
    // กรองคำ 18+ ที่ส่งผลต่อ SafeSearch NLP Penalty
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

const replaceGlobal = (str, target, replacement) => str.split(target).join(replacement);

function optimizeImg(idx, path, width = 400, height = 500) {
  if (!path || typeof path !== "string" || !path.trim()) {
    return CONFIG.DEFAULT_OG_IMAGE;
  }
  const cleanPath = path.trim();
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

function formatDateSSR(dateStr) {
  if (!dateStr) return "เมื่อครู่นี้";
  try {
    const d = new Date(dateStr);
    const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return `${d.getDate()} ${months[d.getMonth()]} ${(d.getFullYear() + 543).toString().slice(-2)}`;
  } catch {
    return "เมื่อครู่นี้";
  }
}

function smartLinkify(text, total, zones, provinceSlug = "chiangmai") {
  if (!text) return "";
  let formatted = sanitizeThaiText(text);
  const locationUrl = provinceSlug && provinceSlug !== "national" ? `/location/${provinceSlug}` : "/";
  
  if (zones && Array.isArray(zones) && zones.length > 0) {
    zones.slice(0, 5).forEach(zone => {
      if (!zone || zone === "ทั้งหมด") return;
      const cleanZone = sanitizeThaiText(zone);
      const regex = new RegExp(`(${cleanZone})(?![^<]*>|[^<>]*<\\/a>)`, "g");
      formatted = formatted.replace(regex, `<a href="${locationUrl}" class="kw-zone">$1</a>`);
    });
  }
  
  formatted = formatted.replace(/(สาวรับงาน|ไซด์ไลน์|เด็กเอ็น|เพื่อนเที่ยว|รับงาน|ฟิวแฟน|ฟีลแฟน)(?![^<]*>|[^<>]*<\/a>)/g, '<strong class="kw-purple">$1</strong>');
  formatted = formatted.replace(/(ไม่โอนมัดจำ|จ่ายหน้างาน 100%|ตรงปก 100%|ความปลอดภัยสูงสุด|นัดเจอตัวจริง)(?![^<]*>|[^<>]*<\/a>)/g, '<strong class="kw-green">$1</strong>');
  formatted = formatted.replace(/(ไม่โอนเงินมัดจำล่วงหน้าทุกกรณี|ห้ามโอนเงินก่อน|ปราศจากการเรียกเก็บเงิน)(?![^<]*>|[^<>]*<\/a>)/g, '<strong class="kw-red">$1</strong>');
  
  return formatted;
}

function getDynamicIntro(provinceName, zones, provinceSlug = "chiangmai") {
  let cleanZones = zones && Array.isArray(zones) ? zones.filter(z => z && z !== "ทั้งหมด") : [];
  const locationUrl = provinceSlug && provinceSlug !== "national" ? `/location/${provinceSlug}` : "/";
  const zoneLinks = cleanZones.slice(0, 5).map(z => `<a href="${locationUrl}" class="kw-zone">${escapeHTML(sanitizeThaiText(z))}</a>`);
  const zoneText = zoneLinks.length > 0 ? ` ครอบคลุมพิกัดสำคัญ เช่น โซน ${zoneLinks.join(", โซน ")}` : " ครอบคลุมเขตตัวเมืองและบริเวณใกล้เคียง";
  
  return `
    <p>ยินดีต้อนรับสู่ <strong>${CONFIG.BRAND_NAME}</strong> แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ <strong class="kw-purple">สาวรับงาน${provinceName}</strong>, <strong class="kw-purple">เด็กเอ็น${provinceName}</strong> และ <strong class="kw-purple">เพื่อนเที่ยวไซด์ไลน์${provinceName}</strong> แหล่งรวบรวมโปรไฟล์ผู้ดูแลระดับพรีเมียมที่เน้นความโปร่งใส ปลอดภัย และเพียบพร้อมด้วยการดูแลเอาใจใส่สไตล์ <strong class="kw-purple">ฟิวแฟน (Girlfriend Experience - GFE)</strong> อย่างสุภาพเรียบร้อยเป็นธรรมชาติ ปราศจากเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี</p>
    <p>เพื่อตอบสนองความสะดวกในการนัดหมายพิกัดบริการในพื้นที่ ${provinceName} น้องๆ ในระบบของเรากระจายตัวอยู่ในจุดที่เหมาะสม${zoneText} ไม่ว่าจะเป็นโรงแรมชั้นนำ คอนโดมิเนียมส่วนตัว หรือพิกัดยอดนิยม เดินทางสะดวกสบายและมีความปลอดภัยสูง พร้อมร่วมเดินทางท่องเที่ยว ทานอาหาร หรือพูดคุยเพื่อสร้างความผ่อนคลายและคลายเหงาให้แก่คุณในโอกาสพิเศษ</p>
    <p>รูปภาพและข้อมูลรายละเอียดสัดส่วนของน้องๆ ได้รับการคัดกรองและตรวจสอบยืนยันตัวตน (Verified System) อย่างรอบคอบ เพื่อให้สมาชิกมั่นใจได้ว่าข้อมูลถูกต้อง <strong class="kw-green">ตรงตามปก 100%</strong> ปลอดภัยนัดเจอ <strong class="kw-green">ชำระหน้างาน</strong> ไม่มีความเสี่ยงทางการเงินทุกกรณีครับ</p>
  `;
}

function getDynamicReviews(provinceName) {
  const now = new Date();
  const isChiangMai = provinceName === "เชียงใหม่";
  return [
    {
      author: "คุณชลสิทธิ์ (C.)",
      location: isChiangMai ? "ย่านนิมมาน เชียงใหม่" : `ตัวเมือง${provinceName}`,
      text: isChiangMai
        ? '"นัดเจอน้องแถวย่านนิมมาน เชียงใหม่ เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบ First Model Hub ไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับสำหรับคนที่หาเพื่อนเที่ยวฟิวแฟนดีๆ แถวนิมมาน"'
        : `"นัดเจอน้องในจังหวัด${provinceName} เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบ First Model Hub ไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับ"`,
      rating: 5,
      date: "เมื่อสัปดาห์ที่แล้ว",
      datePublished: new Date(now.getTime() - 7 * 86400000).toISOString().split("T")[0]
    },
    {
      author: "คุณอภิชาติ (A.)",
      location: isChiangMai ? "โซนยอดนิยม นิมมาน เชียงใหม่" : `โซนยอดนิยมใน${provinceName}`,
      text: '"น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยมเสมือนมีเพื่อนร่วมทางคนพิเศษคอยเคียงข้าง ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ"',
      rating: 5,
      date: "เมื่อ 2 สัปดาห์ก่อน",
      datePublished: new Date(now.getTime() - 14 * 86400000).toISOString().split("T")[0]
    }
  ];
}

async function getTemplateHtml(url, context) {
  const now = Date.now();
  const fallbackHtml = `<!DOCTYPE html>
<html lang="th" class="dark-theme dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>First Model Hub - ศูนย์รวมเพื่อนเที่ยวและสาวรับงานพรีเมียม</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <main id="main-content">
    <div class="container" style="padding: 40px 16px; text-align: center;">
      <h1 style="color: #FFFFFF; font-size: 20px;">First Model Hub</h1>
      <p style="color: #A1A1AA; font-size: 13px; margin-top: 8px;">กำลังโหลดข้อมูลโปรไฟล์...</p>
    </div>
  </main>
  <script type="module" src="/main.js"></script>
</body>
</html>`;

  if (!TEMPLATE_HTML_CACHE || now - TEMPLATE_CACHE_TIMESTAMP > TEMPLATE_CACHE_TTL_MS) {
    try {
      const abortCtrl = new AbortController();
      const timeoutId = setTimeout(() => abortCtrl.abort(), 3000);
      const templateUrl = new URL("/index.html", url.origin);
      const res = await fetch(templateUrl, {
        headers: { "x-ssr-bypass": "true" },
        signal: abortCtrl.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        TEMPLATE_HTML_CACHE = await res.text();
        TEMPLATE_CACHE_TIMESTAMP = now;
      }
    } catch {
      return fallbackHtml;
    }
  }
  return TEMPLATE_HTML_CACHE || fallbackHtml;
}

// ✅ เรนเดอร์การ์ดโปรไฟล์ HTML สะอาด 100% ปราศจาก Inline Styles บวม
const renderCardHtml = (p, index, total, provinceName) => {
  const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/gi, ""));
  const loc = escapeHTML(sanitizeThaiText(p.location) || provinceName);
  const profileUrl = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
  const isAvail = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(s => (p.availability || "").toLowerCase().includes(s));
  const availStatus = p.availability || (isAvail ? "รับงาน" : "สอบถามคิว");
  const ageStr = p.age && p.age !== "-" ? ` ${escapeHTML(p.age)}` : "";
  
  let statsStr = p.stats || p.proportion || "";
  const bust = p.bust || "";
  const waist = p.waist || "";
  const hips = p.hips || "";
  const cup = (p.cup_size || p.cupSize || "").toString().toUpperCase().trim();
  if (bust && waist && hips) {
    statsStr = `${bust}${cup || ""}-${waist}-${hips}`;
  }
  
  const imgAlt = `น้อง${cleanName}${ageStr ? ` อายุ${ageStr}ปี` : ""} สาวรับงาน${provinceName} ${statsStr ? `สัดส่วน ${statsStr}` : "รูปร่างสมส่วน"} ${p.height ? `สูง ${p.height}ซม.` : ""} ย่าน${loc} ฟิวแฟนตรงปก 100% ไม่มัดจำ`;
  const rawImg = p.imagePath || p.image_url || p.imageUrl || p.photo || p.avatar || "";
  const cardImg = optimizeImg(0, rawImg, 400, 500);
  const slogan = escapeHTML(sanitizeThaiText(p.slogan || p.quote || ""));
  
  let priceStr = "1,500.-";
  if (p.rate) {
    priceStr = isNaN(p.rate) ? escapeHTML(p.rate).trim() : `${Number(p.rate).toLocaleString()}.-`;
  }

  return `
    <div class="profile-card-new-container">
      <article class="profile-card-new interactive-card" data-profile-id="${p.id}" data-profile-slug="${escapeHTML(p.slug || p.id)}">
          <img src="${cardImg}" 
               alt="${imgAlt}"
               title="${imgAlt}"
               width="300"
               height="400"
               class="profile-card-img"
               loading="${index < 2 ? "eager" : "lazy"}"
               fetchpriority="${index === 0 ? "high" : "auto"}"
               decoding="async"
               onerror="this.onerror=null; this.src='https://firstmodelhub.com/images/firstmodelhub.webp';" />
               
          <div class="profile-card-gradient-overlay"></div>

          <div class="profile-card-badges-left">
              ${p.isfeatured ? '<span class="badge-featured"><i class="fas fa-star"></i> แนะนำ</span>' : ""}
              <span class="badge-status ${isAvail ? 'online' : 'busy'}">
                  <span class="status-dot"></span>
                  <span>${availStatus}</span>
              </span>
              ${p.has_video || p.hasVideo ? '<span class="badge-status busy"><i class="fas fa-video"></i> คลิป</span>' : ""}
          </div>

          <div class="profile-card-badges-right">
              ${p.verified || p.isVerified ? '<span class="badge-verified"><i class="fas fa-check-circle"></i> ยืนยัน</span>' : ""}
          </div>
          
          <a href="${profileUrl}" class="card-link" aria-label="ดูโปรไฟล์น้อง${cleanName} สาวรับงาน${provinceName}"></a>

          <div class="profile-card-info-content">
              <h3 class="profile-card-name">น้อง${cleanName}${ageStr}</h3>
              ${slogan ? `<p class="profile-card-quote">${slogan}</p>` : ""}
              <div class="profile-card-bottom-row">
                  <span class="profile-card-location">
                      <i class="fas fa-map-marker-alt"></i> ${loc}
                  </span>
                  <span class="profile-card-price">
                      ${priceStr}
                  </span>
              </div>
          </div>
      </article>
    </div>
  `;
};

const generateDynamicFAQsHTML = faqs => {
  if (!faqs || !Array.isArray(faqs)) return "";
  return faqs.map(f => `
    <div class="faq-item-card">
        <div class="faq-q-row">
            <span class="faq-q-badge">Q</span>
            <div class="faq-question-text">${escapeHTML(sanitizeThaiText(f.q))}</div>
        </div>
        <div class="faq-answer-text">${escapeHTML(sanitizeThaiText(f.a))}</div>
    </div>
  `).join("");
};

export default async (req, context) => {
  const url = new URL(req.url);
  const primaryDomain = CONFIG.PRIMARY_DOMAIN;
  const hostname = url.hostname.toLowerCase();

  // จัดการ 301 Redirect สำหรับโดเมนสำรอง
  if (hostname.includes("sidelinechiangmai.netlify.app")) {
    return url.pathname === "/" || url.pathname === "/index.html"
      ? Response.redirect(`${primaryDomain}/location/chiangmai`, 301)
      : Response.redirect(`${primaryDomain}${url.pathname}${url.search}`, 301);
  }
  if (hostname.startsWith("www.firstmodelhub.com") || hostname.includes("firstmodelhub.netlify.app")) {
    return Response.redirect(`${primaryDomain}${url.pathname}${url.search}`, 301);
  }

  // Bypass สำหรับ Static Assets
  if (req.headers.get("x-ssr-bypass") === "true" || STATIC_EXT_REGEX.test(url.pathname)) {
    return await context.next();
  }

  const cleanPath = url.pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (["/about", "/faq", "/blog", "/contact", "/terms-of-service", "/privacy-policy", "/locations", "/nimman", "/index-en", "/offline", "/llms.txt"].some(p => cleanPath === p || cleanPath.startsWith(p + "/"))) {
    return await context.next();
  }
  if (url.pathname === "/index.html") {
    return Response.redirect(`${primaryDomain}/`, 301);
  }

  // ระบบตรวจจับ Cache อัจฉริยะ
  const now = Date.now();
  const isForcedPurge = url.searchParams.has("refresh") || url.searchParams.has("purge") || url.searchParams.has("clear_cache");
  if (isForcedPurge) {
    PAGE_CACHE.clear();
    GLOBAL_LAST_TIMESTAMP = `forced_${now}`;
  }

  const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
  if (!isForcedPurge && now - LAST_PROBE_TIME > 15000) {
    LAST_PROBE_TIME = now;
    try {
      const { data: latestProfile } = await supabase
        .from("profiles")
        .select("lastUpdated, created_at")
        .order("lastUpdated", { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();
      const latestTs = latestProfile?.lastUpdated || latestProfile?.created_at || "v1";
      if (latestTs !== GLOBAL_LAST_TIMESTAMP) {
        PAGE_CACHE.clear();
        GLOBAL_LAST_TIMESTAMP = latestTs;
      }
    } catch {
      // Ignored probe error
    }
  }

  const cacheKey = `${req.method}:${url.pathname}`;
  const cachedPage = PAGE_CACHE.get(cacheKey);
  if (!isForcedPurge && cachedPage && cachedPage.version === GLOBAL_LAST_TIMESTAMP) {
    return new Response(cachedPage.html, { headers: cachedPage.headers });
  }

  // วิเคราะห์ Route
  const segments = url.pathname.split("/").filter(Boolean);
  let provinceSlug = "";
  let isNational = false;

  if (segments.length === 0 || url.pathname === "/" || url.pathname === "/profiles") {
    isNational = true;
    provinceSlug = "national";
  } else if (segments[0] === "location" && segments[1]) {
    try {
      provinceSlug = decodeURIComponent(segments[1]).toLowerCase();
    } catch {
      provinceSlug = segments[1].toLowerCase();
    }
  } else {
    const lastSeg = segments[segments.length - 1] || "";
    try {
      provinceSlug = decodeURIComponent(lastSeg).toLowerCase();
    } catch {
      provinceSlug = lastSeg.toLowerCase();
    }
  }

  try {
    const cleanProvinceSlug = provinceSlug.replace(/[-_]/g, "");
    let provinceKeyVariants = [provinceSlug, cleanProvinceSlug, provinceSlug.replace(/-/g, "_"), provinceSlug.replace(/_/g, "-")];
    provinceKeyVariants = [...new Set(provinceKeyVariants.filter(Boolean))];

    let profilesQuery = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("active", true)
      .order("isfeatured", { ascending: false })
      .order("created_at", { ascending: false });

    if (!isNational && provinceSlug !== "national") {
      profilesQuery = profilesQuery.in("provinceKey", provinceKeyVariants);
    }

    let reviewsQuery = supabase
      .from("reviews")
      .select("id, created_at, author_name, location_detail, rating_score, review_body, province_key")
      .eq("active_status", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (!isNational) {
      reviewsQuery = reviewsQuery.in("province_key", provinceKeyVariants);
    }

    const [provinceDataRes, profilesRes, allProvincesRes, reviewsRes] = await Promise.all([
      isNational
        ? Promise.resolve({ data: { id: 0, nameThai: "ทั่วไทย", key: "national" } })
        : supabase.from("provinces").select("id, nameThai, key").in("key", provinceKeyVariants).limit(1).maybeSingle(),
      profilesQuery,
      supabase.from("provinces").select("key, nameThai").order("nameThai", { ascending: true }),
      Promise.resolve(reviewsQuery).catch(() => ({ data: [] }))
    ]);

    const provinceData = provinceDataRes.data;
    if (!provinceData && !isNational) {
      return new Response("404 - ไม่พบข้อมูลพื้นที่จังหวัดที่ต้องการ", { status: 404 });
    }

    const profilesList = profilesRes.data || [];
    const totalCount = profilesRes.count !== null && profilesRes.count !== undefined ? profilesRes.count : profilesList.length;
    const provinceNameThai = isNational ? "ทั่วไทย" : provinceData?.nameThai || "เชียงใหม่";
    const customMetadata = isNational ? null : PROVINCE_CUSTOM_METADATA[cleanProvinceSlug] || null;
    const seoData = isNational ? PROVINCE_SEO_DATA.default : PROVINCE_SEO_DATA[cleanProvinceSlug] || PROVINCE_SEO_DATA.default;
    
    const canonicalUrl = isNational ? primaryDomain : `${primaryDomain}/location/${provinceSlug}`;
    const heroImage = profilesList.length > 0 && (profilesList[0].imagePath || profilesList[0].image_url)
      ? optimizeImg(0, profilesList[0].imagePath || profilesList[0].image_url, 1200, 630)
      : CONFIG.DEFAULT_OG_IMAGE;

    // ประมวลผลรีวิว
    const dbReviews = reviewsRes?.data || [];
    let activeReviews = dbReviews.length > 0
      ? dbReviews.map(r => ({
          author: r.author_name || "คุณผู้ใช้บริการ",
          location: sanitizeThaiText(r.location_detail) || `ตัวเมือง${provinceNameThai}`,
          text: sanitizeThaiText(r.review_body) || "ดูแลประทับใจดีสไตล์ฟิวแฟน ตรงปกปลอดภัย แนะนำครับ",
          rating: Number(r.rating_score) && !isNaN(Number(r.rating_score)) ? Math.min(5, Math.max(1, Number(r.rating_score))) : 5,
          date: formatDateSSR(r.created_at),
          datePublished: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
        }))
      : getDynamicReviews(provinceNameThai);

    const topModelsList = profilesList.slice(0, 5).map(p => `น้อง${(p.name || "").replace(/^น้อง/, "").trim()}${p.age ? ` (${p.age}ปี)` : ""}${p.location ? ` - ${sanitizeThaiText(p.location)}` : ""}`).join(" | ");

    let metaTitle = "";
    let metaDescription = "";
    if (isNational) {
      metaTitle = "สาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานทั่วไทย) | First Model Hub";
      metaDescription = topModelsList
        ? `ทั่วไทย 🟢 พร้อมรับงานวันนี้: ${topModelsList} - ศูนย์รวมสาวรับงาน ไซด์ไลน์ ฟิวแฟนพรีเมียม คัดสรรตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ`
        : "ศูนย์รวมสาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนพรีเมียมทั่วไทย คัดสรรโปรไฟล์ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ";
    } else {
      metaTitle = customMetadata?.title || `สาวรับงาน${provinceNameThai} ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub`;
      metaDescription = customMetadata?.desc || `ศูนย์รวมสาวรับงาน${provinceNameThai} และเพื่อนเที่ยวไซด์ไลน์ฟิวแฟน คัดสรรเฉพาะตัวจริงตรงปก 100% ปลอดภัยนัดเจอจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมพิกัด ${provinceNameThai}`;
    }

    const cleanMetaDesc = stripHTML(metaDescription);
    const avgRatingScore = activeReviews.length > 0 ? (activeReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / activeReviews.length).toFixed(1) : "5.0";
    const mapZoom = isNational ? 6 : 12;
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent("สาวรับงาน " + (isNational ? "ประเทศไทย" : provinceNameThai))}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;
    const cleanZonesList = (seoData.zones || []).map(sanitizeThaiText).filter(z => z && z !== "ทั้งหมด" && z !== "all");

    // โครงสร้าง Schema.org แบบรวมศูนย์ ถูกต้องตามกฎ Google Search 100%
    const schemaGraph = [
      {
        "@type": "Organization",
        "@id": `${primaryDomain}/#organization`,
        "name": CONFIG.BRAND_NAME,
        "legalName": CONFIG.BRAND_LEGAL_NAME,
        "url": primaryDomain,
        "logo": { "@type": "ImageObject", "url": `${primaryDomain}/images/firstmodelhub.webp` },
        "description": cleanMetaDesc,
        "sameAs": CONFIG.SOCIAL_LINKS,
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "telephone": CONFIG.DEFAULT_TELEPHONE,
          "availableLanguage": ["th", "en"]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${primaryDomain}/#website`,
        "url": primaryDomain,
        "name": CONFIG.BRAND_NAME,
        "publisher": { "@id": `${primaryDomain}/#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${primaryDomain}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}/#webpage`,
        "name": metaTitle,
        "description": cleanMetaDesc,
        "isPartOf": { "@id": `${primaryDomain}/#website` },
        "about": { "@id": `${canonicalUrl}/#business` },
        "mainEntity": { "@id": `${canonicalUrl}/#itemlist` }
      },
      {
        "@type": ["EntertainmentBusiness", "ProfessionalService"],
        "@id": `${canonicalUrl}/#business`,
        "name": isNational ? `ศูนย์รวมไซด์ไลน์ สาวรับงาน เด็กเอ็น ฟิวแฟน ทั่วไทย - ${CONFIG.BRAND_NAME}` : `สาวรับงาน${provinceNameThai} เพื่อนเที่ยว${provinceNameThai} - ${CONFIG.BRAND_NAME}`,
        "image": heroImage,
        "telephone": CONFIG.DEFAULT_TELEPHONE,
        "priceRange": "฿฿",
        "url": canonicalUrl,
        "description": cleanMetaDesc,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": isNational ? "ประเทศไทย" : provinceNameThai,
          "addressRegion": isNational ? "ประเทศไทย" : provinceNameThai,
          "addressCountry": "TH"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": seoData.geo?.lat || 13.7563,
          "longitude": seoData.geo?.lng || 100.5018
        },
        "areaServed": isNational ? { "@type": "Country", "name": "Thailand" } : [{ "@type": "AdministrativeArea", "name": provinceNameThai }, ...cleanZonesList.map(z => ({ "@type": "AdministrativeArea", "name": `โซน${z}` }))],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": Number(avgRatingScore) || 5.0,
          "reviewCount": activeReviews.length,
          "bestRating": 5,
          "worstRating": 1
        },
        "review": activeReviews.map(r => ({
          "@type": "Review",
          "author": { "@type": "Person", "name": r.author },
          "datePublished": r.datePublished,
          "reviewBody": stripHTML(r.text),
          "reviewRating": { "@type": "Rating", "ratingValue": r.rating, "bestRating": 5, "worstRating": 1 }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": primaryDomain },
          ...(isNational ? [] : [{ "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceNameThai}`, "item": canonicalUrl }])
        ]
      }
    ];

    if (profilesList.length > 0) {
      schemaGraph.push({
        "@type": "ItemList",
        "@id": `${canonicalUrl}/#itemlist`,
        "name": `รายชื่อสาวรับงานและเพื่อนเที่ยว ${provinceNameThai}`,
        "numberOfItems": totalCount,
        "itemListElement": profilesList.map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": `น้อง${(p.name || "").replace(/^น้อง\s?/, "").trim()}`,
          "url": `${primaryDomain}/sideline/${encodeURIComponent(p.slug || p.id)}`
        }))
      });
    }

    if (seoData.faqs && !isNational) {
      schemaGraph.push({
        "@type": "FAQPage",
        "@id": `${canonicalUrl}/#faq`,
        "isPartOf": { "@id": `${canonicalUrl}/#webpage` },
        "mainEntity": seoData.faqs.map(f => ({
          "@type": "Question",
          "name": stripHTML(sanitizeThaiText(f.q)),
          "acceptedAnswer": { "@type": "Answer", "text": stripHTML(sanitizeThaiText(f.a)) }
        }))
      });
    }

    // ประกอบ HTML การ์ดทั้งหมด
    const allCardsHtml = profilesList.map((p, i) => renderCardHtml(p, i, 0, provinceNameThai)).join("");
    const featuredCardsHtml = profilesList.filter(p => p.isfeatured).slice(0, 12).map((p, i) => renderCardHtml(p, i, 0, provinceNameThai)).join("");
    
    const reviewsHtml = activeReviews.map(r => `
      <div class="review-card-item">
          <div class="review-card-header">
            <div class="review-user-info">
              <div class="review-avatar-circle">${escapeHTML((r.author || "K").charAt(0).toUpperCase())}</div>
              <div>
                <div class="review-username">${escapeHTML(r.author)}</div>
                <div class="review-user-loc">นัดเจอใน${escapeHTML(r.location)}</div>
              </div>
            </div>
            <div class="review-stars-list">
              ${Array.from({ length: 5 }).map((_, i) => `<i class="fas fa-star" style="color: ${i < r.rating ? "#FBBF24" : "#71717A"};"></i>`).join("")}
            </div>
          </div>
          <p class="review-comment-body">${escapeHTML(r.text)}</p>
          <span class="review-verified-badge"><i class="fas fa-check-circle"></i> ยืนยันการใช้บริการจริง • ${escapeHTML(r.date)}</span>
      </div>
    `).join("");

    const faqsHtml = generateDynamicFAQsHTML(seoData.faqs);
    const zonesStr = (seoData.zones || []).filter(z => z !== "ทั้งหมด").slice(0, 4).map(sanitizeThaiText).join(", ");
    const introText = seoData.uniqueIntro || getDynamicIntro(provinceNameThai, seoData.zones, provinceSlug);
    const linkedIntro = smartLinkify(introText, 0, seoData.zones, provinceSlug);

    const popularLocationsFooter = allProvincesRes.data
      ? allProvincesRes.data.map(p => {
          const key = p.key || p.slug || p.id;
          const name = p.nameThai || p.name;
          const isActive = key === provinceSlug;
          let item = `<li><a href="/location/${key}" title="สาวรับงาน${name}" style="color: ${isActive ? "var(--primary-purple)" : "var(--text-gray)"}; text-decoration: none;" ${isActive ? 'class="active" aria-current="page"' : ""}>ไซด์ไลน์${name}</a></li>`;
          if (key === "chiangmai") {
            item += '<li><a href="/nimman" title="สาวรับงานนิมมาน เชียงใหม่" style="color: #C084FC; text-decoration: none;">ไซด์ไลน์นิมมาน</a></li>';
          }
          return item;
        }).join("")
      : "";

    let finalHtml = await getTemplateHtml(url, context);

    // แทรก Meta Tags
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHTML(metaTitle)}</title>`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHTML(cleanMetaDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHTML(metaTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHTML(cleanMetaDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHTML(metaTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHTML(cleanMetaDesc)}" />`);
    
    finalHtml = replaceGlobal(finalHtml, "{{SEO_CANONICAL}}", canonicalUrl);
    finalHtml = replaceGlobal(finalHtml, "{{SEO_IMAGE}}", heroImage);

    // ✅ แก้ไข Hreflang ไม่ให้ Error ชี้ข้ามหน้าผิดคู่
    if (isNational) {
      finalHtml = finalHtml.replace(
        /<link\s+rel=["']alternate["']\s+hreflang=["']en["'][^>]*>/i,
        `<link rel="alternate" hreflang="en" href="${primaryDomain}/index-en" />`
      );
    } else {
      // หน้าจังหวัดย่อย ตัด hreflang="en" ออกเพื่อป้องกัน Search Console แจ้ง Error
      finalHtml = finalHtml.replace(/<link\s+rel=["']alternate["']\s+hreflang=["']en["'][^>]*>\s*/gi, "");
    }

    // แทรก Schema JSON-LD
    const schemaJsonStr = JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }).replace(/</g, "\\u003c");
    const schemaTag = `<script type="application/ld+json" id="dynamic-schema">\n${schemaJsonStr}\n<\/script>`;
    finalHtml = finalHtml.replace(/<script type="application\/ld\+json" id="dynamic-schema">[\s\S]*?<\/script>/i, schemaTag);

    // แทนที่ Placeholders
    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_NAME}}", provinceNameThai);
    finalHtml = replaceGlobal(finalHtml, "{{PROFILE_COUNT}}", totalCount);
    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_ZONES}}", zonesStr);
    finalHtml = replaceGlobal(finalHtml, "{{MAP_EMBED_URL}}", mapEmbedUrl);
    finalHtml = finalHtml.replace(/<div class="seo-content-inner">[\s\S]*?<\/div>/i, `<div class="seo-content-inner">${linkedIntro}</div>`);

    if (faqsHtml) {
      finalHtml = finalHtml.replace(/<div id="faq-container-list"[^>]*>[\s\S]*?<\/div>/i, `<div id="faq-container-list" class="faq-list-wrapper">${faqsHtml}</div>`);
    }
    if (reviewsHtml) {
      finalHtml = finalHtml.replace(/<div id="reviews-container-grid"[^>]*>[\s\S]*?<\/div>/i, `<div id="reviews-container-grid" class="reviews-grid-wrapper">${reviewsHtml}</div>`);
    }

    // Swiper HOT Cards
    const hotSwiperCardsHtml = profilesList.slice(0, 8).map((p, i) => {
      const cleanName = escapeHTML((p.name || "น้อง").trim().replace(/^(น้อง\s?)+/gi, ""));
      const loc = escapeHTML(sanitizeThaiText(p.location) || provinceNameThai);
      const slug = encodeURIComponent(p.slug || p.id);
      const img = optimizeImg(0, p.imagePath || p.image_url || "", 400, 500);
      const isAvail = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(s => (p.availability || "").toLowerCase().includes(s));
      
      return `
        <div class="vip-card-item ${i === 0 ? "active-glow" : ""}" data-profile-id="${p.id}" data-profile-slug="${slug}">
          <span class="vip-status-chip">🟢 ${isAvail ? "รับงาน" : "สอบถาม"}</span>
          <span class="hot-rank-badge">#${i + 1} HOT</span>
          <img src="${img}" alt="น้อง${cleanName}" width="150" height="210" loading="${i < 2 ? "eager" : "lazy"}" onerror="this.src='https://firstmodelhub.com/images/firstmodelhub.webp'">
          <div class="vip-card-overlay"></div>
          <a href="/sideline/${slug}" class="card-link" aria-label="ดูโปรไฟล์น้อง${cleanName}"></a>
          <div class="vip-card-info">
            <div class="vip-name">น้อง${cleanName}</div>
            <div class="vip-location">${loc}</div>
          </div>
        </div>
      `;
    }).join("");

    if (hotSwiperCardsHtml) {
      finalHtml = finalHtml.replace(/<div id="vip-swiper-container"[^>]*>[\s\S]*?<\/div>/i, `<div id="vip-swiper-container" class="vip-swiper-wrapper" aria-label="สไลด์รายชื่อน้องๆ HOT แนะนำ">${hotSwiperCardsHtml}</div>`);
    }

    finalHtml = isNational
      ? replaceGlobal(finalHtml, "{{PROFILES_CARDS_HTML}}", featuredCardsHtml)
      : finalHtml.replace(/<section id="featured-profiles"[\s\S]*?<\/section>/i, "");

    // แสดงผล Grid ตามโครงสร้าง
    let displayAreaHtml = "";
    if (isNational) {
      const groupedByProvince = profilesList.reduce((acc, p) => {
        const key = (p.provinceKey || p.province_slug || "no_province").toString().toLowerCase();
        acc[key] = acc[key] || [];
        acc[key].push(p);
        return acc;
      }, {});

      const sortedProvinceKeys = Object.keys(groupedByProvince).sort((a, b) => {
        const nameA = PROVINCE_SEO_DATA[a]?.name || a;
        const nameB = PROVINCE_SEO_DATA[b]?.name || b;
        return nameA.localeCompare(nameB, "th");
      });

      let sectionsHtml = "";
      for (const pKey of sortedProvinceKeys) {
        const pName = PROVINCE_SEO_DATA[pKey]?.name || pKey;
        const pCount = groupedByProvince[pKey].length;
        const pCards = groupedByProvince[pKey].map((p, i) => renderCardHtml(p, i, 0, pName)).join("");
        sectionsHtml += `
          <div class="section-content-wrapper province-section" id="province-${pKey}" style="margin-top: 24px;">
            <div style="padding: 8px 4px 12px 4px;">
                <a href="/location/${pKey}" class="group" style="text-decoration: none; display: inline-block;">
                    <h2 class="province-section-header" style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 18px; font-weight: 800; color: white; margin: 0;">
                        📍 น้องๆ ในจังหวัด <span style="color: #C084FC;">${pName}</span>
                        <span class="live-count-chip">
                          <span class="pulse-dot-el"></span>
                          <span>พบ ${pCount} โปรไฟล์พร้อมรับงาน</span>
                        </span>
                        <i class="fas fa-chevron-right" style="font-size: 12px; margin-left: 4px; color: var(--primary-purple);"></i>
                    </h2>
                </a>
            </div>
            <div class="profile-grid profiles-grid-row">
              ${pCards}
            </div>
          </div>
        `;
      }
      displayAreaHtml = sectionsHtml;
    } else {
      displayAreaHtml = `
        <div class="section-content-wrapper" style="margin-top: 16px;">
          <div style="padding: 8px 4px 14px 4px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <h2 style="font-size: 18px; font-weight: 800; color: white; margin: 0; display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
                  📍 น้องๆ ในจังหวัด <span style="color: #C084FC;">${provinceNameThai}</span>
                  <span class="live-count-chip">
                    <span class="pulse-dot-el"></span>
                    <span>พบ ${totalCount} โปรไฟล์พร้อมรับงาน</span>
                  </span>
              </h2>
          </div>
          <div class="profile-grid profiles-grid-row">
            ${allCardsHtml}
          </div>
        </div>
      `;
    }

    finalHtml = finalHtml.includes("{{PROFILES_DISPLAY_AREA_HTML}}")
      ? replaceGlobal(finalHtml, "{{PROFILES_DISPLAY_AREA_HTML}}", displayAreaHtml)
      : finalHtml.replace(/<div id="profiles-display-area"[^>]*>[\s\S]*?<\/div>\s*<\/div>/i, `<div id="profiles-display-area" role="region" aria-label="โปรไฟล์ผู้ดูแลและเพื่อนเที่ยว${provinceNameThai}">${displayAreaHtml}</div>`);

    // Dropdown ค้นหาจังหวัด
    const provinceSelectOptions = '<option value="">🗺️ เลือกจังหวัด (ทั้งหมด)</option>' + (allProvincesRes.data || []).map(p => {
      const isSelected = p.key === provinceSlug ? "selected" : "";
      return `<option value="${p.key}" ${isSelected}>${p.nameThai}</option>`;
    }).join("");
    
    finalHtml = finalHtml.replace(/<select id="search-province"[^>]*>[\s\S]*?<\/select>/i, `<select id="search-province" name="province" class="search-select-field" aria-label="เลือกจังหวัดที่ต้องการค้นหา">${provinceSelectOptions}</select>`);

    if (popularLocationsFooter) {
      finalHtml = finalHtml.replace(/<ul id="popular-locations-footer"[^>]*>[\s\S]*?<\/ul>/i, `<ul id="popular-locations-footer" style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 12px; color: var(--text-gray);">${popularLocationsFooter}</ul>`);
    }

    finalHtml = finalHtml.replace(/(href|src|data-src)=["'](?!https?:\/\/|\/\/|\/|data:|blob:|#|javascript:|mailto:|tel:|\{\{)([^"']+)["']/gi, '$1="/$2"');

    // Serialization โปรไฟล์เข้า Window Object
    const provinceMap = new Map();
    (allProvincesRes.data || []).forEach(p => {
      const k = (p.key || p.slug || p.id || "").toString().toLowerCase();
      const n = p.nameThai || p.name_thai || p.name;
      if (k && n) provinceMap.set(k, n);
    });

    const serializedProfilesJson = JSON.stringify(profilesList.map(p => {
      const pKey = (p.provinceKey || p.province_key || p.province_slug || "chiangmai").toString().toLowerCase();
      const pThai = p.provinceThai || p.province_thai || provinceMap.get(pKey) || provinceNameThai;
      let gallery = p.galleryPaths || p.gallery_paths || p.gallery || [];
      if (typeof gallery === "string") {
        gallery = gallery.split(",").map(s => s.trim()).filter(Boolean);
      }
      let tags = p.style_tags || p.styleTags || p.tags || [];
      if (typeof tags === "string") {
        tags = tags.split(",").map(s => s.trim()).filter(Boolean);
      }

      return {
        id: p.id,
        slug: p.slug || p.id,
        name: p.name,
        age: p.age,
        height: p.height || "",
        weight: p.weight || "",
        stats: p.stats || "",
        skinTone: p.skin_tone || p.skinTone || "",
        bust: p.bust || "",
        waist: p.waist || "",
        hips: p.hips || "",
        cup_size: p.cup_size || "",
        imagePath: p.imagePath || p.image_url || p.imageUrl || p.photo || "",
        galleryPaths: Array.isArray(gallery) ? gallery : [],
        provinceKey: pKey,
        provinceThai: pThai,
        location: sanitizeThaiText(p.location || pThai),
        rate: p.rate,
        availability: p.availability,
        lastUpdated: p.lastUpdated,
        isfeatured: p.isfeatured,
        verified: p.verified || p.isVerified,
        hasVideo: p.has_video || p.hasVideo || false,
        description: sanitizeThaiText(p.description) || "",
        lineId: (p.line_id || p.lineId || "").toString().replace(/^@/, "").trim(),
        quote: sanitizeThaiText(p.quote || p.slogan) || "",
        styleTags: Array.isArray(tags) ? tags : []
      };
    })).replace(/</g, "\\u003c");

    const serializedProvinces = (allProvincesRes.data || []).map(p => ({
      key: (p.key || p.slug || p.id || "").toString().toLowerCase(),
      nameThai: p.nameThai || p.name_thai || p.name
    }));

    const ssrDataScript = `
      <script id="ssr-profiles-data">
        window.profilesData = ${serializedProfilesJson};
        window.provincesData = ${JSON.stringify(serializedProvinces).replace(/</g, "\\u003c")};
        window.currentProvinceSlug = ${JSON.stringify(provinceSlug)};
        window.currentProvinceName = ${JSON.stringify(provinceNameThai)};
      </script>
    `;

    finalHtml = finalHtml.includes('<script id="ssr-profiles-data">')
      ? finalHtml.replace(/<script id="ssr-profiles-data">[\s\S]*?<\/script>/i, ssrDataScript)
      : finalHtml.replace(/<\/head>/i, `${ssrDataScript}\n</head>`);

    const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate, s-maxage=31536000, stale-while-revalidate=86400",
      "ETag": `"${GLOBAL_LAST_TIMESTAMP}"`,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
    };

    if (PAGE_CACHE.size > MAX_CACHE_SIZE) {
      PAGE_CACHE.clear();
    }
    PAGE_CACHE.set(cacheKey, { html: finalHtml, headers: responseHeaders, version: GLOBAL_LAST_TIMESTAMP });

    return new Response(finalHtml, { headers: responseHeaders });

  } catch (err) {
    console.error("SSR critical error fallback:", err);
    try {
      return await context.next();
    } catch {
      return new Response("<!DOCTYPE html><html><head><meta charset='utf-8'><title>First Model Hub</title></head><body><script src='/main.js'></script></body></html>", {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }
  }
};