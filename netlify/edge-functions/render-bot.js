import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

// 🟢 1. ระบบ Memory Cache พร้อมตัวจำกัดขนาด ป้องกัน Memory Leak บน Edge
const PROFILE_PAGE_CACHE = new Map();
const MAX_CACHE_ENTRIES = 150;
let GLOBAL_PROFILE_VERSION = `v_20261015_clean`;
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
    // 1. ล้างรหัส Unicode เสีย, อีโมจิขยะ (แยกจุด . ออก ไม่ให้กระทบทศนิยม 1.5k)
    .replace(/[\uD800-\uDFFF\uFFFD]/g, "")
    .replace(/[જ⁀➴˚༘⋆🫦🌷͙֒🔥💥💦🐻‍❄️ྀི₊✮⸜⸝✧✦⁺]+/g, " ")
    .replace(/\.{2,}/g, " ") // ล้างเฉพาะจุดไข่ปลา เช่น ... แต่ไม่แตะ 1.5k
    
    // 2. แก้คำสะกดผิดยอดฮิต + ปรับคำเพี้ยน
    .replace(/([\u0E31\u0E34-\u0E3A\u0E47-\u0E4E])\1+/g, "$1")
    .replace(/เจ็+ดยอด/g, "เจ็ดยอด")
    .replace(/นิมาน|นิทาน/g, "นิมมาน")
    .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/ไม่มีมีดจำ/g, "ไม่มีมัดจำ")
    .replace(/ฟิวแฟว|ฟิวเเฟน/g, "ฟิวแฟน")
    .replace(/ได้ค่ะได้ค่ะ/g, "ได้ค่ะ")
    .replace(/ตรงปก\s*💯?\s*%/g, "ตรงปก 100%")
    
    // 3. กรองคำล่อแหลมแบบไม่ทำให้ไวยากรณ์พัง
    .replace(/ฟรีถุงยาง!?/gi, "")
    .replace(/ฟรีแตกบนตัว!?/gi, "")
    .replace(/จู๋\s*ทำ\s*(\+\s*\d+)?(\.-)?/gi, "")
    .replace(/(69|➏➒|อมสด|ดูดสด|เอาร่องนม|จูบแลกลิ้น)/gi, "")
    .replace(/(พร้อม|มี)?(อาบน้ำด้วยกัน|อาบน้ำ)/gi, "")
    .replace(/(มีอารมร่วม|มีอารมณ์?ร่วม)/gi, "ดูแลเป็นกันเอง")
    .replace(/\d+\s*น้ำ\s*\/?\s*\d+\s*ชม\.?/gi, "1 ชม.")
    
    // 4. จัดระเบียบคำซ้ำ
    .replace(/(บริการดูแลสไตล์ฟิวแฟน\s*)+/gi, "")
    .replace(/(ฟิวแฟน\s*){2,}/gi, "ฟิวแฟน ")
    
    // 5. ล้างเศษเครื่องหมายวรรคตอน
    .replace(/([!*~_·\-\/])\s*\1+/g, "")
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

// ✅ สร้าง 2 ย่อหน้าคุณภาพสูง มีมิติภาพลักษณ์ + ความรู้สึกฟิวแฟนแท้ๆ
function generateDynamicPersonaDesc(p, displayName, provinceName, zone, priceDisplay, stats, age, height, weight) {
  const hash = String(p.slug || p.id || displayName).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hNum = parseInt(height, 10) || 160;
  const wNum = parseInt(weight, 10) || 48;
  const rawTags = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : String(p.styleTags || "")).toLowerCase();

  let persona = "gfe";
  if (rawTags.includes("ตัวเล็ก") || rawTags.includes("น่ารัก") || (hNum <= 158 && wNum <= 46)) persona = "petite";
  else if (rawTags.includes("นางแบบ") || rawTags.includes("vip") || hNum >= 166) persona = "model";
  else if (rawTags.includes("ชงเหล้า") || rawTags.includes("ปาร์ตี้") || rawTags.includes("en")) persona = "party";
  else if (rawTags.includes("อวบ") || wNum >= 54) persona = "curvy";

  const matrix = {
    petite: {
      p1: [
        `หากคุณกำลังมองหาความผ่อนคลายที่ไร้ความเกร็งใน${provinceName} ${displayName} คือสาวสวยไซส์มินิน่าทะนุถนอม รูปร่างกะทัดรัด สัดส่วนชวนมอง ${stats} (สูง ${height} ซม. / หนัก ${weight} กก.) พกพาผิวพรรณเนียนละเอียด กลิ่นกายหอมสะอาด และรอยยิ้มหวานเป็นธรรมชาติ การันตีตัวจริงสวยสดใสตรงปก 100% ไม่จืดชืดแน่นอนค่ะ`,
        `${displayName} สาวสวยวัยใสสไตล์น่ารัก โซน${zone} จ.${provinceName} โดดเด่นด้วยเสน่ห์ความสดใส รูปร่างตัวเล็กพิมพ์นิยม ${stats} ผิวขาวออร่า ให้ความรู้สึกอบอุ่น สบายตา และมีชีวิตชีวาตั้งแต่แรกพบ`
      ],
      p2: [
        `สไตล์การดูแลเน้นฟิวแฟน (Girlfriend Experience) แท้ๆ พูดจาไพเราะ อ่อนหวาน ขี้อ้อนเอาใจเก่งอย่างพอเหมาะ พร้อมเป็นเพื่อนเคียงข้างไม่ว่าจะนั่งทานข้าว คาเฟ่ หรือพักผ่อนส่วนตัว ดูแลดั่งคนพิเศษ ไม่มีการเร่งรีบดูเวลา ให้คุณได้คลายความเหนื่อยล้าอย่างเต็มที่`,
        `เสน่ห์มัดใจคือการเทคแคร์อย่างใกล้ชิดและจริงใจ ชวนคุยเก่ง สนทนาลื่นไหล ไร้ความอึดอัด ให้ความรู้สึกสบายใจเสมือนได้ออกเดตกับแฟนสาวคนโปรดในบรรยากาศส่วนตัวสูงสุด`
      ]
    },
    model: {
      p1: [
        `สำหรับผู้ที่มองหาเพื่อนเที่ยวระดับพรีเมียม ${displayName} คือนิยามของสาวสวยหุ่นเพรียว สูงโปร่ง ${height} ซม. สัดส่วนลงตัว ${stats} บุคลิกภาพสง่างาม วางตัวดี มีเสน่ห์สะกดสายตา พร้อมเป็นเพื่อนร่วมโต๊ะอาหาร ดินเนอร์ หรือออกงานสังคมได้อย่างมั่นใจ`,
        `โดดเด่นด้วยลุคคุณหนูพรีเมียม ${displayName} พกพาความมั่นใจและสัดส่วนที่เป๊ะทุกมุมมอง ผิวพรรณผุดผ่อง สะอาดสะอ้าน ทุกภาพโปรไฟล์ผ่านการยืนยันตัวตนจริง ไร้การแต่งรูปหลอกตา`
      ],
      p2: [
        `บริการด้วยมารยาทสุภาพ ให้เกียรติผู้ใช้บริการระดับสูงสุด สนทนาลื่นไหล สร้างบรรยากาศที่น่าประทับใจและผ่อนคลายในค่ำคืนพิเศษ ไม่เร่งเวลา พร้อมสร้างความทรงจำที่น่าจดจำในทุกการพบปะ`,
        `เทคแคร์ดุจคนพิเศษด้วยมาตรฐานการดูแลระดับ VIP เป็นเพื่อนคู่คิด เพื่อนร่วมเดินทาง หรือเพื่อนพักผ่อนคลายเหงาที่มอบทั้งความสบายใจและรอยยิ้มอย่างแท้จริง`
      ]
    },
    gfe: {
      p1: [
        `สัมผัสบรรยากาศความสุขและความสบายใจกับ ${displayName} สาวสวยอัธยาศัยดี โซน${zone} (${provinceName}) วัย ${age} ปี สัดส่วนสมส่วน ${stats} (สูง ${height} ซม. / หนัก ${weight} กก.) กลิ่นกายหอมละมุน รูปร่างทรงเสน่ห์ และมีรอยยิ้มพิมพ์ใจที่ทำให้บรรยากาศอบอุ่นขึ้นทันที`,
        `${displayName} มอบภาพลักษณ์เพื่อนเที่ยวฟิวแฟนที่ใครเห็นก็ต้องหลงรัก ด้วยความเรียบร้อย น่ารัก ผิวพรรณดี และความเป็นธรรมชาติที่จับต้องได้ นัดพบตัวจริงสวยตรงปก 100%`
      ],
      p2: [
        `เน้นการดูแลสไตล์คนรักตัวจริง (GFE) พูดหวาน เอาใจเก่ง พร้อมรับฟังและอยู่เคียงข้างให้คุณคลายจากความตึงเครียด ดูแลด้วยความอ่อนโยน จริงใจ และไม่เร่งงานแม้แต่นาทีเดียว`,
        `ไม่ว่าจะร่วมโต๊ะอาหาร เดินเล่น หรือพักผ่อนในที่พักส่วนตัว ${displayName} จะทำให้คุณรู้สึกเหมือนได้ไปเที่ยวกับคนรู้ใจ ให้เกียรติ อบอุ่น และปลอดภัยไร้กังวลตลอดการนัดหมาย`
      ]
    }
  };

  const selected = matrix[persona] || matrix.gfe;
  const part1 = selected.p1[hash % selected.p1.length];
  const part2 = selected.p2[(hash + 1) % selected.p2.length];

  let bioText = "";
  if (p.description && p.description.trim().length > 10 && !/เรทราคา|มัดจำ|1500\/1|•ㅅ•/i.test(p.description)) {
    bioText = `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(124, 58, 237, 0.15);"><strong style="color: #7C3AED;">ข้อความจากน้อง:</strong> "${sanitizeThaiText(p.description)}"</div>`;
  }

  return `<p style="margin: 0 0 8px 0; line-height: 1.65;">${part1}</p><p style="margin: 0; line-height: 1.65;">${part2}</p>${bioText}`;
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
    let provinceKey = (profile.provinceKey || profile.province_key || "chiangmai").toString().trim().toLowerCase(); if (provinceKey === "chiang-mai" || provinceKey === "chiang_mai") provinceKey = "chiangmai"; if (provinceKey === "khonkaen" || provinceKey === "khon_kaen") provinceKey = "khon-kaen"; const cleanProvinceKey = provinceKey.replace(/[-_]/g, "");
    
 
if (provinceKey) {
      // 🟢 ดึงข้อมูลทั้งหมดโดยไม่จำกัด limit และเลือกเฉพาะฟิลด์ที่ต้องใช้
      const { data: related } = await supabase
        .from("profiles")
        .select("id, slug, name, imagePath, image_url, provinceKey, province_key")
        .eq("active", true)
        .neq("id", profile.id);

      // กรองจังหวัดใน JavaScript
      relatedProfiles = (related || []).filter(p => {
        const k = (p.provinceKey || p.province_key || "").toLowerCase();
        return k.includes(cleanProvinceKey) || k.includes(provinceKey);
      }).slice(0, 3);
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

   // 🟢 ปรับปรุงใหม่: รองรับ Universal Link มาตรฐาน LINE สำหรับ iOS & Android 100%
    const rawLineInput = (profile.line_id || profile.line || profile.lineId || profile.line_url || "").trim();
    let lineId = "https://line.me/ti/p/u8Bz9HsaY8";

    const matchUrl = rawLineInput.match(/(https?:\/\/[^\s]+)/i);
    if (matchUrl) {
      lineId = matchUrl[0];
    } else if (rawLineInput) {
      const cleanHandle = rawLineInput.trim();
      if (cleanHandle.startsWith("@")) {
        // 1. ถ้ามี @ (LINE Official): ใช้ page.line.me (ตัด @ ออก) เปิดเข้าแอพได้ทันทีบน iOS/Android ไม่เออเร่อ
        const cleanOa = cleanHandle.replace(/^@+/, "").trim();
        if (cleanOa) lineId = `https://page.line.me/${cleanOa}`;
      } else {
        // 2. ถ้าเป็น ID ส่วนตัว: ต้องมีเครื่องหมาย ~ นำหน้า เพื่อสั่งให้ LINE ทำการค้นหา User ID
        const cleanPersonalId = cleanHandle.replace(/[^a-zA-Z0-9_\-\.]/g, "");
        if (cleanPersonalId) lineId = `https://line.me/R/ti/p/~${cleanPersonalId}`;
      }
    }

    const cleanAge = profile.age && String(profile.age).trim() !== "-" && String(profile.age).trim() !== "0" 
      ? String(profile.age).replace(/\D/g, "") 
      : null;
   const age = profile.age && String(profile.age).trim() !== "-" && String(profile.age).trim() !== "0" 
      ? String(profile.age).replace(/\D/g, "") 
      : "ไม่ระบุ";
    const ageDisplay = age !== "ไม่ระบุ" ? `${age} ปี` : "ไม่ระบุ";

    const height = profile.height && String(profile.height).trim() !== "-" && String(profile.height).trim() !== "0" 
      ? String(profile.height).replace(/\D/g, "") 
      : "ไม่ระบุ";
    const heightDisplay = height !== "ไม่ระบุ" ? `${height} ซม.` : "ไม่ระบุ";

    const weight = profile.weight && String(profile.weight).trim() !== "-" && String(profile.weight).trim() !== "0" 
      ? String(profile.weight).replace(/\D/g, "") 
      : "ไม่ระบุ";
    const weightDisplay = weight !== "ไม่ระบุ" ? `${weight} กก.` : "ไม่ระบุ";

    const stats = (profile.stats && String(profile.stats).trim() !== "-" && String(profile.stats).trim() !== "0") 
      ? String(profile.stats).trim() 
      : "ไม่ระบุ";
  
    const localizedZone = profile.location ? `ย่าน${sanitizeThaiText(profile.location)}` : `ในเมือง`;
    const naturalDesc = generateDynamicPersonaDesc(profile, displayName, provinceNameThai, localizedZone, priceDisplay, stats, age, height, weight);

    // 🟢 1. ตัวตัดเอาย่านหลัก (ห้ามลบเด็ดขาด ไม่งั้นข้างล่างจะ Error)
    const primaryZone = profile.location ? profile.location.split(/[,/]/)[0].trim() : provinceNameThai;

    const cleanHeading = `${displayName} (${primaryZone}) สไตล์ฟิวแฟน ตัวจริงตรงปก 100%`;
const pageTitle = `${displayName} (${primaryZone}) ไซด์ไลน์${provinceNameThai} รับงานฟิวแฟน ตัวจริงตรงปก จ่ายหน้างาน | ${CONFIG.BRAND_NAME}`;
   
    // 🟢 Meta คำบรรยายใต้ลิงก์ Google: โฟกัสฟิวแฟนและพิกัดย่าน ไม่ยัดคำซ้ำ
    const metaDescription = `🟢 ${displayName} เพื่อนเที่ยวสไตล์ฟิวแฟน โซน${escapeHTML(primaryZone)} จ.${provinceNameThai} สัดส่วน ${escapeHTML(stats)} อายุ ${age} ปี การันตีตัวจริงตรงปก ปลอดภัยนัดพบจ่ายหน้างาน ${priceDisplay} ไร้มัดจำ ทักไลน์เช็กคิวได้เลย`;

    // 🟢 4. URL ประจำหน้าโปรไฟล์ (ปิดวงเล็บให้สมบูรณ์)
    const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${encodeURIComponent(profile.slug || profile.id)}`;

    const reviewsList = getDeterministicReviews(rawSlug, 3);

    const cleanHeightNum = parseInt(String(height).replace(/\D/g, ""), 10) || 160;
    const cleanWeightNum = parseInt(String(weight).replace(/\D/g, ""), 10) || 48;

   
const activeBreadcrumbText = `ไซด์ไลน์${provinceNameThai}`;

// 🟢 2. สร้าง Schema Graph โดยมีเครื่องหมายจุลภาคคั่นถูกต้อง 100%
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
      "dateModified": new Date().toISOString(),
      "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` },
      "mainEntity": { "@id": `${canonicalUrl}#person` }
    },
    {
      "@type": "Person",
      "@id": `${canonicalUrl}#person`,
      "name": stripHTML(displayName),
      "alternateName": `${stripHTML(displayName)} ${CONFIG.BRAND_NAME}`,
      "gender": "https://schema.org/Female",
      "jobTitle": "เพื่อนเที่ยวและคนดูแลสไตล์ฟิวแฟน",
      "description": stripHTML(naturalDesc),
      "image": {
        "@type": "ImageObject",
        "@id": `${canonicalUrl}#image`,
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
      "homeLocation": {
  "@type": "Place",
  "name": `${primaryZone} ${provinceNameThai}`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": primaryZone,
    "addressLocality": primaryZone,
    "addressRegion": provinceNameThai,
    "addressCountry": "TH"
  }
}
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      "itemListElement": [
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
          "item": provinceHubUrl 
        }, // 👈 ใส่เครื่องหมายจุลภาคตรงนี้แล้ว
        { 
          "@type": "ListItem", 
          "position": 3, 
          "name": stripHTML(displayName), 
          "item": canonicalUrl 
        }
      ]
    }
  ]
};

const robotsTag = '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">';

    const htmlResponse = `<!DOCTYPE html>
<html lang="th" class="light-theme">
<head>
    <!-- 1. Technical & Rendering Directives (ต้องอยู่อันดับแรกสุด) -->
    <meta charset="utf-8">
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#F6F3FA">
    <meta name="color-scheme" content="light">
    <meta name="format-detection" content="telephone=no">

    <!-- 2. Primary Meta & SEO Discovery -->
    <title>${escapeHTML(pageTitle)}</title>
    <meta name="description" content="${escapeHTML(metaDescription)}">
    ${robotsTag}
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="alternate" hreflang="th" href="${canonicalUrl}">
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">

    <!-- 3. Network Handshakes (เปิดท่อเชื่อมต่อ CDN ล่วงหน้าทันที) -->
    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
    <link rel="dns-prefetch" href="https://res.cloudinary.com">

    <!-- 4. Critical Asset Preloads (ดึงฟอนต์และรูป LCP เข้ามาก่อน เพื่อคะแนน Core Web Vitals) -->
    <link rel="preload" href="/fonts/prompt-v11-latin_thai-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    <link rel="preload" href="/fonts/prompt-v11-latin_thai-700.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    ${heroSrcSet 
      ? `<link rel="preload" as="image" href="${heroImageSmall}" imagesrcset="${heroSrcSet}" imagesizes="(max-width: 600px) 100vw, 400px" fetchpriority="high">`
      : `<link rel="preload" as="image" href="${heroImageSmall}" fetchpriority="high">`
    }

    <!-- 5. Render-Blocking Stylesheet -->
    <link rel="stylesheet" href="/styles.css?v=${GLOBAL_PROFILE_VERSION}">

    <!-- 6. Icons & Manifest -->
    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">

    <!-- 7. OpenGraph / LINE / Facebook Sharing -->
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

    <!-- 8. Twitter (X) Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
    <meta name="twitter:description" content="${escapeHTML(metaDescription)}">
    <meta name="twitter:image" content="${ogImageSocial}">
    <meta name="twitter:image:alt" content="${escapeHTML(displayName)} ตัวจริงตรงปก 100%">

    <!-- 9. Structured Data (JSON-LD) สำหรับ Rich Results & AI Overview -->
    <script type="application/ld+json">${JSON.stringify(schemaGraph).replace(/</g, "\\u003c")}</script>
<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-PG0QFDWTTG"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PG0QFDWTTG');
    </script>
</head>
<body class="fmh-app-page" style="background-color: #F8F6FC; color: #140F22; font-family: 'Prompt', sans-serif;">
    <div class="container" style="max-width: 680px; margin: 0 auto; padding: 1rem 1rem 7rem 1rem;">
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
    <li>
      <a href="${provinceHubUrl}" style="color: #7C3AED; text-decoration: none; font-weight: 600;" title="${escapeHTML(activeBreadcrumbText)}">
        ${escapeHTML(activeBreadcrumbText)}
      </a>
    </li>
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
                             class="hero-img" alt="${escapeHTML(displayName)} สาวรับงาน${escapeHTML(provinceNameThai)} ไซด์ไลน์${escapeHTML(provinceNameThai)} ย่าน${escapeHTML(primaryZone)} ตัวจริงตรงปก 100%"
                             loading="eager" fetchpriority="high" decoding="async" 
                             width="400" height="560" style="width: 100%; height: 100%; object-fit: cover; object-position: top center;">
                    </div>
                </section>

                <header class="profile-meta-header" style="text-align: center; margin: 1.25rem 0 1rem 0;">
                   <h1 style="font-size: 20px; font-weight: 900; color: #140F22; line-height: 1.3;">${escapeHTML(cleanHeading)}</h1>
                   
                    <div style="display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; background: rgba(5, 150, 105, 0.08); border: 1px solid rgba(5, 150, 105, 0.25); padding: 4px 14px; border-radius: 100px;">
                        <span style="color: #059669; font-size: 11px; font-weight: 900;">✓ VERIFIED PROFILE</span>
                        <span style="color: #065F46; font-size: 11px; font-weight: 700;">(ยืนยันตัวตนจริง ตรงปก 100% ปลอดภัยจ่ายหน้างาน)</span>
                    </div>
                </header>

               <!-- 🟢 1. สเปกพื้นฐาน 4 ช่อง (สัดส่วน / ส่วนสูง / อายุ / พิกัด) -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 1.25rem;">
                    <div class="spec-box" style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #64748B; font-size: 11.5px; font-weight: 700;">สัดส่วน</span>
                        <strong style="color: #140F22; font-weight: 800;">${escapeHTML(stats)}</strong>
                    </div>
                    <div class="spec-box" style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #64748B; font-size: 11.5px; font-weight: 700;">ส่วนสูง / น้ำหนัก</span>
                        <strong style="color: #140F22; font-weight: 800;">${heightDisplay} / ${weightDisplay}</strong>
                    </div>
                    <div class="spec-box" style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #64748B; font-size: 11.5px; font-weight: 700;">อายุ</span>
                        <strong style="color: #140F22; font-weight: 800;">${ageDisplay}</strong>
                    </div>
                    <div class="spec-box" style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #64748B; font-size: 11.5px; font-weight: 700;">พิกัดบริการ</span>
                        <a href="${provinceHubUrl}" title="ดูน้องๆ รับงาน${escapeHTML(provinceNameThai)} ทั้งหมด" style="color: #7C3AED; font-weight: 800; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                          <span>รับงาน${escapeHTML(provinceNameThai)} (${escapeHTML(primaryZone)})</span>
                          <i class="fas fa-chevron-right" style="font-size: 9px; opacity: 0.7;"></i>
                        </a>
                    </div>
                </div>

                <!-- 🟢 2. [ย้ายขึ้นมาตรงนี้] ตารางอัตราค่าบริการ (เห็นสเปกปุ๊บ เห็นราคาทันที ชนะ NavBoost 100%) -->
                <section style="margin-bottom: 1.25rem; background: #FFFFFF; border-radius: 16px; padding: 14px 16px; border: 1.5px solid rgba(124, 58, 237, 0.18); box-shadow: 0 6px 20px rgba(124, 58, 237, 0.05);">
                    <h2 style="color: #7C3AED; text-align: center; font-weight: 900; font-size: 13.5px; margin: 0 0 10px 0; letter-spacing: 0.5px;">💰 อัตราค่าบริการเพื่อนเที่ยว ${escapeHTML(displayName)} (${escapeHTML(provinceNameThai)})</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 10px 4px; border-radius: 12px;">
                            <div style="color: #64748B; font-size: 11px; font-weight: 800; margin-bottom: 2px;">1 ชม.</div>
                            <strong style="color: #059669; font-size: 15px; font-weight: 900;">${rateNumber.toLocaleString()}.-</strong>
                        </div>
                        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 10px 4px; border-radius: 12px;">
                            <div style="color: #64748B; font-size: 11px; font-weight: 800; margin-bottom: 2px;">2 ชม.</div>
                            <strong style="color: #059669; font-size: 15px; font-weight: 900;">${Math.floor(rateNumber * 1.8).toLocaleString()}.-</strong>
                        </div>
                        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 10px 4px; border-radius: 12px;">
                            <div style="color: #64748B; font-size: 11px; font-weight: 800; margin-bottom: 2px;">ค้างคืน</div>
                            <strong style="color: #059669; font-size: 15px; font-weight: 900;">${Math.floor(rateNumber * 4.5).toLocaleString()}.-</strong>
                        </div>
                    </div>
                </section>

                <!-- 🟢 3. [ย้ายมาต่อจากราคา] ปุ่มติดต่อ LINE CTA + ปุ่มแชร์ (เห็นราคาแล้วกดแอดไลน์ได้ทันที) -->
                <div style="margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px; width: 100%;">
                    <a href="${lineId}" class="sidebar-line-btn" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #FFFFFF; padding: 14px 0; border-radius: 100px; font-weight: 900; text-decoration: none; font-size: 14px; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);" rel="nofollow noopener" target="_blank">
                        <i class="fab fa-line" style="font-size: 20px;"></i> แอดไลน์สอบถามคิว (จ่ายหน้างาน)
                    </a>

                    <button type="button" onclick="if(navigator.share){navigator.share({title:document.title,url:window.location.href})}else{navigator.clipboard.writeText(window.location.href).then(()=>{alert('คัดลอกลิงก์โปรไฟล์เรียบร้อยค่ะ!')})}" aria-label="แชร์โปรไฟล์" style="width: 48px; height: 48px; border-radius: 100px; background: #FFFFFF; border: 1.5px solid rgba(124, 58, 237, 0.25); color: #7C3AED; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);">
                        <i class="fas fa-share-alt" style="font-size: 16px;"></i>
                    </button>
                </div>

             <!-- 🟢 4. กล่องเนื้อหาบรรยายเฉพาะตัว (แก้ปัญหา Thin Content ผ่าน Spintax) -->
<div class="description" style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 14px; padding: 14px; color: #475569; font-size: 12.5px; line-height: 1.7; margin-bottom: 1.25rem;">
    ${naturalDesc}
</div>

                <!-- 🟢 5. ข้อมูลและลักษณะเด่นเฉพาะตัว -->
                <section style="margin-bottom: 1.5rem; background: #FFFFFF; border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 16px; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.04);">
                    <h2 style="color: #140F22; font-size: 14px; font-weight: 900; margin-bottom: 12px;">✨ ข้อมูลและลักษณะเด่นเฉพาะตัวของ ${escapeHTML(displayName)}</h2>
                    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: #475569; line-height: 1.65;">
                        <div><strong style="color: #7C3AED;">สไตล์การดูแล:</strong> ${Array.isArray(profile.styleTags) && profile.styleTags.length > 0 ? profile.styleTags.map(t => `#${escapeHTML(t)}`).join(" ") : "#ฟิวแฟน #เทคแคร์ดี #ตรงปก"}</div>
                        <div><strong style="color: #7C3AED;">ความพร้อมในการเดินทาง:</strong> สแตนด์บายพร้อมดูแลในพื้นที่ ${escapeHTML(localizedZone)} และโรงแรม/ที่พักในจังหวัด${escapeHTML(provinceNameThai)} (เดินทางถึงที่พักใน 15-30 นาที)</div>
                        <div><strong style="color: #7C3AED;">ความประทับใจส่วนตัว:</strong> "${escapeHTML(profile.description || profile.slogan || profile.quote || "ฟิวแฟน อบอุ่น สุภาพ ไม่เร่งงาน ตัวจริงตรงปก 100%")}"</div>
                    </div>
                </section>

                ${relatedProfiles.length > 0 ? `
                <section style="border-top: 1px solid rgba(124, 58, 237, 0.1); padding-top: 1.25rem;">
                    <h2 style="color: #7C3AED; font-size: 14px; font-weight: 900; margin-bottom: 12px; text-align: center;">เพื่อนเที่ยวฟิวแฟนแนะนำเพิ่มเติม โซน${escapeHTML(provinceNameThai)}</h2>
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
                   <p style="margin-top: 0.4rem; margin-bottom: 0;"><strong style="color: #140F22;">✓ นโยบายการนัดหมาย</strong>: นัดพบเจอตัวจริง ตรวจสอบความถูกต้องตรงปกเรียบร้อยแล้วจึงชำระเงินกับน้องหน้างานโดยตรง ไม่มีการโอนมัดจำล่วงหน้าทุกกรณี</p>
                </section>
            </article>
        </main>
        
       <footer role="contentinfo" style="text-align: center; padding: 2rem 0 3rem 0; color: #64748B; font-size: 11px;">
            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 8px;">
                <a href="/" style="color: #475569; text-decoration: none; font-weight: 600;">หน้าแรก</a>
                <a href="/profiles" style="color: #475569; text-decoration: none; font-weight: 600;">รวมโปรไฟล์</a>
                <a href="/locations" style="color: #475569; text-decoration: none; font-weight: 600;">พื้นที่บริการ</a>
            </div>
            © 2026 ${CONFIG.BRAND_NAME} - บริการด้วยความจริงใจ
        </footer>
    </div>
       
    <script type="module" src="/main.js?v=${GLOBAL_PROFILE_VERSION}"></script>

    <!-- Sticky Bottom CTA (รองรับ iPhone Safe Area + แชร์มี Fallback) -->
    <div style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 10px 16px; padding-bottom: max(12px, env(safe-area-inset-bottom, 12px)); border-top: 1px solid rgba(124, 58, 237, 0.15); box-shadow: 0 -4px 25px rgba(0,0,0,0.06); z-index: 9999; display: flex; gap: 10px; align-items: center;">
       <!-- ✅ เติม Micro-Trust Badge จ่ายหน้างาน 100% ไร้มัดจำ -->
<a href="${lineId}" target="_blank" rel="noopener nofollow" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #FFFFFF; padding: 12px 0; border-radius: 100px; font-weight: 900; text-decoration: none; font-size: 14.5px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);">
    <i class="fab fa-line" style="font-size: 20px;"></i>
    <span>จองคิว${escapeHTML(displayName)}</span>
    <span style="font-size: 11px; background: rgba(0,0,0,0.22); padding: 2px 8px; border-radius: 100px; font-weight: 700;">จ่ายหน้างาน ไร้มัดจำ</span>
</a>
        <button type="button" onclick="if(navigator.share){navigator.share({title:document.title,url:window.location.href})}else{navigator.clipboard.writeText(window.location.href).then(()=>{alert('คัดลอกลิงก์โปรไฟล์เรียบร้อยค่ะ!')})}" aria-label="แชร์โปรไฟล์" style="width: 48px; height: 48px; border-radius: 100px; background: #FFFFFF; border: 1.5px solid rgba(124, 58, 237, 0.25); color: #7C3AED; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);">
            <i class="fas fa-share-alt" style="font-size: 17px;"></i>
        </button>
    </div>

    <!-- ลงทะเบียน Service Worker ให้เหมือน index.html -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').catch(function(err) {
            console.warn('SW Registration failed: ', err);
          });
        });
      }
    </script>
</body>
</html>`;

    const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600",
      "Netlify-CDN-Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
      "ETag": `"${GLOBAL_PROFILE_VERSION}"`,
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
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
  
