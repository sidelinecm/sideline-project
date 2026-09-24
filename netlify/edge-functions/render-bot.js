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

function sanitizeThaiText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/[\uD800-\uDFFF]/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/[જ⁀➴˚༘⋆🫦🌷͙֒🔥💥💦🐻‍❄️ྀི₊✮⸜⸝✧✦⁺.]+/g, " ")
    .replace(/([\u0E31\u0E34-\u0E3A\u0E47-\u0E4E])\1+/g, "$1")
    .replace(/เจ็+ดยอด/g, "เจ็ดยอด")
    .replace(/นิมาน|นิทาน/g, "นิมมาน")
    .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/ไม่มีมีดจำ/g, "ไม่มีมัดจำ")
    .replace(/ฟิวแฟว/g, "ฟิวแฟน")
    .replace(/ตรงปก\s*%/g, "ตรงปก 100%")
    .replace(/ตรงปก\s*💯\s*%/g, "ตรงปก 100%")
    .replace(/ฟรีถุงยาง!?/gi, "")
    .replace(/ฟรีแตกบนตัว!?/gi, "")
    .replace(/จู๋\s*ทำ\s*(\+\s*\d+)?(\.-)?/gi, "")
    .replace(/(69|➏➒|อมสด|ดูดสด|เอาร่องนม|จูบแลกลิ้น)/gi, "")
    .replace(/\d+\s*น้ำ\s*\/?\s*\d+\s*ชม\.?/gi, "1 ชม.")
    .replace(/(บริการดูแลสไตล์ฟิวแฟน\s*)+/gi, "ฟิวแฟน ")
    .replace(/(ฟิวแฟน\s*)+/gi, "ฟิวแฟน ")
    .replace(/[\*\!\_]/g, "")
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

function extractCleanNumber(rate) {
  if (!rate) return 1500;
  const str = String(rate).trim().toLowerCase();
  if (str.includes("k")) {
    const floatVal = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(floatVal) ? 1500 : Math.round(floatVal * 1000);
  }
  const cleanDigits = str.replace(/\D/g, "");
  const num = parseInt(cleanDigits, 10);
  if (isNaN(num) || num <= 0) return 1500;
  if (num < 10) return num * 1000;
  if (num < 500) return num * 10;
  return num;
}

function optimizeImg(imagePath, mode = "card") {
  const DEFAULT_FALLBACK_IMG = "https://firstmodelhub.com/images/firstmodelhub.webp";
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) {
    return DEFAULT_FALLBACK_IMG;
  }

  const cleanPath = imagePath.trim();
  let transform = "f_auto,q_auto:eco,w_400,h_560,c_fill"; // 1. ค่าเริ่มต้น: การ์ดโปรไฟล์ 400x560

  if (mode === "thumb" || mode <= 150) {
    transform = "f_auto,q_auto:eco,w_120,h_120,c_thumb,g_face"; // 2. สตอรี่/ไอคอน 120x120
  } else if (mode === "og") {
    transform = "f_auto,q_auto:eco,w_1200,h_630,c_fill,g_auto"; // 3. รูปแชร์ LINE/Facebook 1200x630 เป๊ะ
  } else if (mode === 600 || (typeof mode === "number" && mode > 400 && mode < 700)) {
    transform = "f_auto,q_auto:eco,w_600,h_800,c_fill"; // 4. รูปใหญ่หน้าโปรไฟล์ 600x800 (แก้บั๊กจุดนี้ให้แล้ว)
  } else if (mode === "full" || mode >= 700) {
    transform = "f_auto,q_auto:eco,w_800,c_limit"; // 5. รูปขยายเต็มจอ
  }

  if (cleanPath.includes("res.cloudinary.com")) {
    const match = cleanPath.match(/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:[a-z]{1,4}_[^/]+(?:\/|$))*(.*)$/i);
    if (match) {
      const cloudName = match[1];
      const imageFile = match[2];
      return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${imageFile}`;
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
  if (!imagePath || typeof imagePath !== "string" || !imagePath.includes("res.cloudinary.com")) {
    return "";
  }
  const img400 = optimizeImg(imagePath, 400, 560);
  const img600 = optimizeImg(imagePath, 600, 800);
  return `${img400} 400w, ${img600} 600w`;
}

function generateDynamicPersonaDesc(p, displayName, provinceName, zone, priceDisplay, stats, age, height, weight) {
  const customBio = p.description && p.description.trim().length > 10 
    ? ` พร้อมข้อความส่วนตัว: "${sanitizeThaiText(p.description)}"` 
    : "";

  const rawTags = (Array.isArray(p.styleTags || p.style_tags) 
    ? (p.styleTags || p.style_tags).join(" ") 
    : String(p.styleTags || p.style_tags || "")).toLowerCase();
  
  const hNum = parseInt(height, 10) || 160;
  const wNum = parseInt(weight, 10) || 48;

  let persona = "gfe";
  if (rawTags.includes("ตัวเล็ก") || rawTags.includes("น่ารัก") || rawTags.includes("นักศึกษา") || (hNum <= 158 && wNum <= 46)) {
    persona = "petite";
  } else if (rawTags.includes("นางแบบ") || rawTags.includes("vip") || rawTags.includes("หรู") || hNum >= 166) {
    persona = "model";
  } else if (rawTags.includes("ชงเหล้า") || rawTags.includes("ปาร์ตี้") || rawTags.includes("en") || rawTags.includes("คุยสนุก")) {
    persona = "party";
  } else if (rawTags.includes("อวบ") || rawTags.includes("เนื้อนมไข่") || wNum >= 54) {
    persona = "curvy";
  }

  const seedStr = String(p.slug || p.id || displayName);
  const hash = seedStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const v = hash % 3;

  const safetyNote = "นัดพบเจอตัวจริงตรงปกอย่างปลอดภัย ชำระค่าบริการหน้างานโดยตรง ไร้กังวลเรื่องการโอนมัดจำล่วงหน้า 100%";

  switch (persona) {
    case "petite":
      return v === 0
        ? `พบกับ ${displayName} เพื่อนเที่ยวสายหวานตัวเล็กน่ารัก สดใส สไตล์คุณหนู พิกัดดูแล${zone} จ.${provinceName} อายุ ${age} ปี สัดส่วนกะทัดรัด ${stats} (สูง ${height} ซม. / หนัก ${weight} กก.) บุคลิกยิ้มแย้ม อัธยาศัยดี เอาใจเก่ง${customBio} ค่าดูแลเริ่มต้น ${priceDisplay} ${safetyNote}`
        : v === 1
        ? `สำหรับท่านที่ชื่นชอบสาวไซส์มินิ น่าทะนุถนอม ขอแนะนำ ${displayName} พิกัด${zone} (${provinceName}) วัยใส ${age} ปี รูปร่าง ${stats} ส่วนสูง ${height} ซม. น้ำหนัก ${weight} กก. ชวนคุยสนุก คลายเหงา ทานข้าว ดูหนัง เป็นกันเองอย่างสุภาพ${customBio} อัตราค่าบริการ ${priceDisplay} ${safetyNote}`
        : `${displayName} สาวสวยตัวเล็ก บุคลิกสดใส เป็นกันเอง พร้อมสแตนด์บายให้บริการเพื่อนเที่ยวฟิวแฟนใน${zone} จ.${provinceName} อายุ ${age} ปี สัดส่วน ${stats} (สูง ${height} ซม. หนัก ${weight} กก.) มารยาทเรียบร้อย เทคแคร์ดีเสมือนแฟนคนพิเศษ${customBio} เรทเริ่มต้น ${priceDisplay} ${safetyNote}`;

    case "model":
      return v === 0
        ? `ยกระดับการพักผ่อนระดับพรีเมียมกับ ${displayName} เพื่อนเที่ยวระดับ VIP บุคลิกสง่างาม หุ่นนางแบบ พิกัด${zone} จ.${provinceName} อายุ ${age} ปี สัดส่วนสุดเฟิร์ม ${stats} สูงโปร่ง ${height} ซม. น้ำหนัก ${weight} กก. วางตัวสุภาพ เหมาะสำหรับดินเนอร์หรู ออกงานสังคม หรือนัดพบส่วนตัว${customBio} อัตราค่าบริการ ${priceDisplay} ${safetyNote}`
        : v === 1
        ? `สัมผัสประสบการณ์เหนือระดับกับ ${displayName} สาวสวยโปรไฟล์พรีเมียม โซน${zone} (${provinceName}) วัย ${age} ปี สัดส่วน ${stats} ส่วนสูง ${height} ซม. น้ำหนัก ${weight} กก. ผิวพรรณสะอาดสะอ้าน มารยาทดีเยี่ยม ไม่เร่งเวลา พร้อมดูแลท่านอย่างเอ็กซ์คลูซีฟ${customBio} เรทเริ่มต้น ${priceDisplay} ${safetyNote}`
        : `แนะนำ ${displayName} สวยหรู สไตล์พริตตี้-นางแบบ พิกัดดูแลย่าน${zone} จ.${provinceName} อายุ ${age} ปี สัดส่วนเป๊ะ ${stats} สูง ${height} ซม. บุคลิกโดดเด่น น่าประทับใจ ให้เกียรติและสร้างความสบายใจในทุกช่วงเวลา${customBio} อัตราเริ่มต้น ${priceDisplay} ${safetyNote}`;

    case "party":
      return v === 0
        ? `สายสังสรรค์ นั่งชิล ต้องไม่พลาด ${displayName} เพื่อนเที่ยวและเอ็นเตอร์เทนเนอร์ (EN VIP) พิกัด${zone} จ.${provinceName} อายุ ${age} ปี สัดส่วน ${stats} สูง ${height} ซม. หนัก ${weight} กก. ชงเหล้าเก่ง คุยสนุก อารมณ์ดี ละลายพฤติกรรมเยี่ยม เหมาะกับงานเลี้ยง ปาร์ตี้ หรือดินเนอร์ยามค่ำคืน${customBio} ค่าดูแลเริ่มต้น ${priceDisplay} ${safetyNote}`
        : v === 1
        ? `เพิ่มความมีชีวิตชีวาให้มื้อค่ำกับ ${displayName} เด็กเอ็นและเพื่อนเที่ยวสายปาร์ตี้ โซน${zone} (${provinceName}) วัย ${age} ปี สัดส่วน ${stats} ยิ้มหวาน เป็นมิตร เข้ากับทุกคนง่าย สร้างรอยยิ้มและบรรยากาศสนุกสนานได้อย่างลงตัว${customBio} อัตราค่าบริการ ${priceDisplay} ${safetyNote}`
        : `มองหาคนรู้ใจไปนั่งดื่ม ฟังเพลง หรือสังสรรค์ ขอแนะนำ ${displayName} ประจำพิกัด${zone} จ.${provinceName} อายุ ${age} ปี รูปร่าง ${stats} สูง ${height} ซม. เทคแคร์เพื่อนดื่มอย่างมืออาชีพ อารมณ์ดีตลอดเวลา ไร้กังวลเรื่องเร่งเวลา${customBio} เรทเริ่มต้น ${priceDisplay} ${safetyNote}`;

    case "curvy":
      return v === 0
        ? `สัมผัสความอบอุ่น นุ่มนวลกับ ${displayName} สาวสวยเจ้าเสน่ห์ หุ่นอวบอิ่มมีน้ำมีนวล สเปคสายกอดอุ่น พิกัด${zone} จ.${provinceName} อายุ ${age} ปี สัดส่วนเต็มสรีระ ${stats} สูง ${height} ซม. หนัก ${weight} กก. นิสัยน่ารัก ขี้อ้อน เอาใจใส่ทุกรายละเอียด${customBio} ค่าดูแลเริ่มต้น ${priceDisplay} ${safetyNote}`
        : v === 1
        ? `สำหรับผู้ที่หลงใหลในความนุ่มนวลและสรีระที่ชัดเจน ขอแนะนำ ${displayName} โซน${zone} (${provinceName}) วัย ${age} ปี รูปร่างเซ็กซี่อวบอิ่ม ${stats} สัมผัสฟิวแฟนอย่างใกล้ชิด เทคแคร์สุภาพ อ่อนโยน ให้ความรู้สึกผ่อนคลายอย่างแท้จริง${customBio} เรทเริ่มต้น ${priceDisplay} ${safetyNote}`
        : `${displayName} เพื่อนเที่ยวสไตล์ฟิวแฟน สรีระเย้ายวนมีน้ำมีนวล ประจำเขต${zone} จ.${provinceName} อายุ ${age} ปี สัดส่วน ${stats} (สูง ${height} ซม. หนัก ${weight} กก.) น่ารัก คุยเก่ง ดูแลเป็นธรรมชาติ ไม่เกร็ง${customBio} อัตราค่าบริการเริ่มต้น ${priceDisplay} ${safetyNote}`;

    default:
      return v === 0
        ? `สัมผัสการดูแลอย่างอบอุ่นสไตล์ Girlfriend Experience (GFE) แท้ๆ กับ ${displayName} พิกัดบริการ${zone} จ.${provinceName} อายุ ${age} ปี สัดส่วน ${stats} ส่วนสูง ${height} ซม. น้ำหนัก ${weight} กก. เทคแคร์เอาใจใส่ดุจแฟนคนพิเศษ สุภาพ อ่อนโยน ไม่เร่งรีบ ให้เกียรติและสร้างความผ่อนคลายสูงสุด${customBio} เรทเริ่มต้น ${priceDisplay} ${safetyNote}`
        : v === 1
        ? `แนะนำ ${displayName} เพื่อนเที่ยวฟิวแฟนที่จะทำให้ช่วงเวลาพักผ่อนของคุณมีความหมาย ในพื้นที่${zone} (${provinceName}) วัย ${age} ปี สัดส่วน ${stats} สูง ${height} ซม. บุคลิกน่ารัก พูดจาไพเราะ พร้อมเป็นเพื่อนทานข้าว เดินเล่น ดูหนัง และดูแลอย่างใกล้ชิด${customBio} อัตราค่าบริการ ${priceDisplay} ${safetyNote}`
        : `หากคุณกำลังมองหาเพื่อนเที่ยวรู้ใจที่ดูแลด้วยความจริงใจ ขอแนะนำ ${displayName} ประจำพิกัด${zone} จ.${provinceName} อายุ ${age} ปี สัดส่วน ${stats} สูง ${height} ซม. หนัก ${weight} กก. สไตล์ฟิวแฟนหวานละมุน อัธยาศัยดี มีความเป็นกันเอง${customBio} อัตราค่าบริการเริ่มต้น ${priceDisplay} ${safetyNote}`;
  }
}

export default async (req, context) => {
  const url = new URL(req.url);

  if (url.pathname === "/api/purge-cache" || url.pathname === "/api/clear-cache") {
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
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
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

  const isForceRefresh = url.searchParams.get("refresh") === CONFIG.PURGE_SECRET || url.searchParams.has("purge");
  const cacheKey = url.pathname.toLowerCase();
  const cachedPage = PROFILE_PAGE_CACHE.get(cacheKey);
  
  if (!isForceRefresh && cachedPage && cachedPage.version === GLOBAL_PROFILE_VERSION) {
    PROFILE_PAGE_CACHE.delete(cacheKey);
    PROFILE_PAGE_CACHE.set(cacheKey, cachedPage);
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
    const provinceKey = (profile.provinceKey || profile.province_key || "chiangmai").toString().trim().toLowerCase();
    const cleanProvinceKey = provinceKey.replace(/[-_]/g, "");

   // 🟢 แก้เป็นแบบนี้: ถ้าในจังหวัดมีน้องน้อยกว่า 3 คน ให้ดึงเท่าที่มี ไม่ดึงข้ามจังหวัดมาเปลี่ยนชื่อ Alt มั่ว
if (provinceKey) {
  const { data: allActive } = await supabase
    .from("profiles")
    .select("*")
    .eq("active", true)
    .neq("id", profile.id)
    .limit(30);

  if (allActive && Array.isArray(allActive)) {
    relatedProfiles = allActive.filter(p => {
      const pKey = (p.provinceKey || p.province_key || p.province_slug || "").toLowerCase().replace(/[-_]/g, "");
      return pKey === cleanProvinceKey;
    }).slice(0, 6);
  }
}
    const displayName = `น้อง${(profile.name || "สาวสวย").trim().replace(/^(น้อง\s?)+/gi, "")}`;
    const provinceNameThai = profile.provinceThai || PROVINCE_NAME_MAP[provinceKey] || PROVINCE_NAME_MAP[cleanProvinceKey] || "เชียงใหม่";
    const provinceHubUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
    
    const rateNumber = extractCleanNumber(profile.rate || profile.price);
    const priceDisplay = `${rateNumber.toLocaleString()}.-`;
    
    const rawImage = profile.imagePath || profile.image_url || "";
    const heroImageLarge = optimizeImg(rawImage, 600, 800);
    const heroImageSmall = optimizeImg(rawImage, 400, 560);
    const ogImageSocial = optimizeImg(rawImage, "og");
    const heroSrcSet = generateSrcSet(rawImage);

    // 🟢 ปรับใหม่: ดักจับคอลัมน์ line และ line_url เพิ่ม + รองรับทั้งลิงก์ lin.ee, line.me และ ID ที่มี @
const rawLineInput = (profile.line_id || profile.line || profile.lineId || profile.line_url || "").trim();
let lineId = "https://line.me/ti/p/u8Bz9HsaY8";

const matchUrl = rawLineInput.match(/(https?:\/\/[^\s]+)/i);
if (matchUrl) {
 
  lineId = matchUrl[0];
} else if (rawLineInput) {
  // ถ้าน้องใส่มาเป็น ID
  const cleanHandle = rawLineInput.trim();
  if (cleanHandle.startsWith("@")) {
    // ถ้ามี @ นำหน้า (LINE Official) ให้สร้างลิงก์แบบ OA
    lineId = `https://line.me/R/ti/p/${encodeURIComponent(cleanHandle)}`;
  } else {
    // ถ้าเป็น ID บุคคลทั่วไป
    const cleanId = cleanHandle.replace(/[^a-zA-Z0-9_\-\.]/g, "");
    if (cleanId) lineId = `https://line.me/ti/p/${cleanId}`;
  }
}

    const age = profile.age || "22";
    const height = profile.height || "162";
    const weight = profile.weight || "48";
    const stats = profile.stats || "35-24-35";

    const localizedZone = profile.location ? `ย่าน${sanitizeThaiText(profile.location)}` : `ในเมือง`;
    const naturalDesc = generateDynamicPersonaDesc(profile, displayName, provinceNameThai, localizedZone, priceDisplay, stats, age, height, weight);

    const primaryZone = profile.location ? profile.location.split(/[,/]/)[0].trim() : provinceNameThai;
   const pageTitle = `${displayName} สาวรับงาน${provinceNameThai} ไซด์ไลน์${provinceNameThai} ฟิวแฟนตรงปก 100%`;
    const metaDescription = `${displayName} เพื่อนเที่ยวฟิวแฟน (GFE) พิกัด ${profile.location || provinceNameThai} อายุ ${age} ปี สัดส่วน ${stats} ดูแลสุภาพ อบอุ่น ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไร้มัดจำ`;
    const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${encodeURIComponent(profile.slug || profile.id)}`;

    const reviewsList = getDeterministicReviews(rawSlug, 3);

    const cleanHeightNum = parseInt(String(height).replace(/\D/g, ""), 10) || 160;
    const cleanWeightNum = parseInt(String(weight).replace(/\D/g, ""), 10) || 48;

    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${canonicalUrl}#webpage`,
          "url": canonicalUrl,
          "name": stripHTML(pageTitle),
          "description": stripHTML(metaDescription),
          "inLanguage": "th-TH",
          "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` }
        },
        {
          "@type": "Person",
          "@id": `${canonicalUrl}#person`,
          "name": stripHTML(displayName),
          "alternateName": `${stripHTML(displayName)} ${CONFIG.BRAND_NAME}`,
          "gender": "https://schema.org/Female",
          "jobTitle": "ผู้ให้บริการเพื่อนเที่ยวและดูแลสไตล์ฟิวแฟน",
          "description": stripHTML(naturalDesc),
          "image": {
            "@type": "ImageObject",
            "url": heroImageLarge
          },
          "url": canonicalUrl,
          "height": {
            "@type": "QuantitativeValue",
            "value": cleanHeightNum,
            "unitCode": "CMT"
          },
          "weight": {
            "@type": "QuantitativeValue",
            "value": cleanWeightNum,
            "unitCode": "KGM"
          },
          "knowsAbout": [
            `สาวรับงาน${provinceNameThai}`,
            `ไซด์ไลน์${provinceNameThai}`,
            `เด็กเอ็น${provinceNameThai}`,
            "เพื่อนเที่ยวฟิวแฟน"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": profile.location || provinceNameThai,
            "addressRegion": provinceNameThai,
            "addressCountry": "TH"
          }
        },
        {
          "@type": "Service",
          "@id": `${canonicalUrl}#service`,
          "name": `บริการเพื่อนเที่ยวและดูแลสไตล์ฟิวแฟน - ${stripHTML(displayName)}`,
          "provider": { "@id": `${canonicalUrl}#person` },
          "areaServed": {
            "@type": "City",
            "name": profile.location || provinceNameThai
          },
          "offers": {
            "@type": "Offer",
            "url": canonicalUrl,
            "price": rateNumber,
            "priceCurrency": "THB",
            "description": "นัดพบเจอตัวจริงตรวจสอบความตรงปกหน้างาน ไม่มีมัดจำล่วงหน้า"
          }
        },
        {
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          "isPartOf": { "@id": `${canonicalUrl}#webpage` },
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
                "text": `สามารถกดปุ่ม 'ทักไลน์จองคิว' บนหน้าโปรไฟล์ เพื่อตรวจสอบตารางงานและสแตนด์บายคิวบริการผ่านไลน์ทางการได้อย่างสะดวกรวดเร็วค่ะ`
              }
            }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
            { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceNameThai}`, "item": provinceHubUrl },
            { "@type": "ListItem", "position": 3, "name": stripHTML(displayName), "item": canonicalUrl }
          ]
        }
      ]
    };

    const htmlResponse = `<!DOCTYPE html>
<html lang="th" class="light-theme">
<head>
    <meta charset="utf-8">
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#F6F3FA">
    <meta name="color-scheme" content="light">

    <title>${escapeHTML(pageTitle)} | ${CONFIG.BRAND_NAME}</title>
    <meta name="description" content="${escapeHTML(metaDescription)}">

    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

    <link rel="canonical" href="${canonicalUrl}">
    <link rel="alternate" hreflang="th" href="${canonicalUrl}">
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">

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
    <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
    <meta name="twitter:description" content="${escapeHTML(metaDescription)}">
    <meta name="twitter:image" content="${ogImageSocial}">
    <meta name="twitter:image:alt" content="${escapeHTML(displayName)} ตัวจริงตรงปก 100%">

    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">

    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
    <link rel="dns-prefetch" href="https://res.cloudinary.com">

    <link rel="preload" href="/fonts/prompt-v11-latin_thai-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" fetchpriority="high">
    <link rel="preload" href="/fonts/prompt-v11-latin_thai-700.woff2" as="font" type="font/woff2" crossorigin="anonymous" fetchpriority="high">

    <link rel="stylesheet" href="/styles.css?v=${GLOBAL_PROFILE_VERSION}">
  
    <link rel="preload" as="image" href="${heroImageSmall}" fetchpriority="high">

    <script type="application/ld+json">${JSON.stringify(schemaGraph).replace(/</g, "\\u003c")}</script>
</head>

<body style="background-color: #F8F6FC; color: #140F22; font-family: 'Prompt', sans-serif;">
<nav class="floating-app-dock" aria-label="แถบควบคุมลอยตัวสำหรับมือถือ">
  <a href="/" class="dock-item">
    <i class="fas fa-home"></i>
    <span>หน้าแรก</span>
  </a>
  <a href="/profiles" class="dock-item">
    <i class="fas fa-user-friends"></i>
    <span>รวมน้องๆ</span>
  </a>
  <a href="${lineId}" target="_blank" rel="noopener nofollow" class="dock-item dock-item-line" aria-label="ติดต่อจองคิวผ่านไลน์">
    <i class="fab fa-line"></i>
    <span>จองคิว</span>
  </a>
</nav>
    <div class="container" style="max-width: 680px; margin: 0 auto; padding: 1rem 1rem 5rem 1rem;">
        <header id="page-header" role="banner" style="position: relative; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.05); backdrop-filter: blur(10px);">
          <div class="header-logo-container">
            <a href="/" class="brand-luxe-logo" aria-label="FirstModelHub หน้าแรก" style="text-decoration: none;">
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
                             class="hero-img" alt="${escapeHTML(displayName)} เพื่อนเที่ยวฟิวแฟน${escapeHTML(provinceNameThai)} ย่าน${escapeHTML(primaryZone)} ตัวจริงตรงปก 100%"
                             loading="eager" fetchpriority="high" decoding="async" 
                             width="400" height="560" style="width: 100%; height: 100%; object-fit: cover; object-position: top center;">
                    </div>
                </section>

                <header class="profile-meta-header" style="text-align: center; margin: 1.25rem 0 1rem 0;">
                    <h1 style="font-size: 20px; font-weight: 900; color: #140F22; line-height: 1.3;">${escapeHTML(pageTitle)}</h1>
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

                <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px; width: 100%;">
                    <!-- 1. ปุ่มแอดไลน์หลัก -->
                    <a href="${lineId}" class="sidebar-line-btn" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #FFFFFF; padding: 14px 0; border-radius: 100px; font-weight: 900; text-decoration: none; font-size: 14px; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);" rel="nofollow noopener" target="_blank">
                        <i class="fab fa-line" style="font-size: 20px;"></i> แอดไลน์สอบถามคิว (จ่ายหน้างาน)
                    </a>

                    <!-- 🟢 2. ปุ่มไอคอนแชร์กลมมินิมอล -->
                    <button type="button" onclick="if(navigator.share){navigator.share({title:document.title,url:window.location.href})}else{navigator.clipboard.writeText(window.location.href).then(()=>{alert('คัดลอกลิงก์โปรไฟล์เรียบร้อยค่ะ!')})}" aria-label="แชร์โปรไฟล์" style="width: 48px; height: 48px; border-radius: 100px; background: #FFFFFF; border: 1.5px solid rgba(124, 58, 237, 0.25); color: #7C3AED; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);">
                        <i class="fas fa-share-alt" style="font-size: 16px;"></i>
                    </button>
                </div>

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
   
<script type="module" src="/main.js?v=${GLOBAL_PROFILE_VERSION}"></script>
</body>
</html>`;

   const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      "Netlify-CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
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
