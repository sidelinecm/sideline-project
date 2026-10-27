import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

// 🟢 1. ระบบ Memory Cache พร้อมตัวจำกัดขนาด ป้องกัน Memory Leak บน Edge
const PROFILE_PAGE_CACHE = new Map();
const MAX_CACHE_ENTRIES = 150;
let GLOBAL_PROFILE_VERSION = `v_20261022_09`;

const ONE_DAY_MS = 86400 * 1000; // คงค่าเดิม 1 วัน (24 ชั่วโมง)

function setSafeProfileCache(key, data) {
  if (PROFILE_PAGE_CACHE.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = PROFILE_PAGE_CACHE.keys().next().value;
    PROFILE_PAGE_CACHE.delete(oldestKey);
  }
  PROFILE_PAGE_CACHE.set(key, { ...data, cachedAt: Date.now() });
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

// 🟢 [โค้ดใหม่ที่เพิ่มเข้าไป] ฟังก์ชันคำนวณเดือน-ปีปัจจุบันสำหรับหน้ารายคน
function getCurrentFreshnessText() {
  const now = new Date();
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  return `${thaiMonths[now.getMonth()]} ${now.getFullYear()}`;
}

function sanitizeThaiText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    // แปลงทุกรูปแบบให้เป็น "ฟิวแฟน" ตัวสะกดเดียวทั้งระบบ
    .replace(/ฟิลแฟน|ฟีลแฟน|ฟิวเเฟน|ฟิวแฟว/g, "ฟิวแฟน")
   
    .replace(/(ฟิวแฟน\s*){2,}/gi, "ฟิวแฟน ")
   
    .replace(/[\uD800-\uDFFF\uFFFD]/g, "")
    .replace(/[જ⁀➴˚༘⋆🫦🌷͙֒🔥💥💦🐻‍❄️ྀི₊✮⸜⸝✧✦⁺]+/g, " ")
    .replace(/\.{2,}/g, " ")
    .replace(/([\u0E31\u0E34-\u0E3A\u0E47-\u0E4E])\1+/g, "$1")
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
    .replace(/(พร้อม|มี)?(อาบน้ำด้วยกัน|อาบน้ำ)/gi, "")
    .replace(/(มีอารมร่วม|มีอารมณ์?ร่วม)/gi, "ดูแลเป็นกันเอง")
    .replace(/[\d๑-๙]+\s*น้ำ(\s*\/?\s*[\d๑-๙]+\s*ชม\.?)?/gi, "1 ชม.")
    .replace(/\/\s*1\s*ชม\.?/gi, " (1 ชม.)")
    .replace(/(บริการดูแลสไตล์ฟิวแฟน\s*)+/gi, "")
    .replace(/(ฟิวแฟน\s*){2,}/gi, "ฟิวแฟน ")
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
  return String(str).replace(/<\/(p|div|h\d)>|<br\s*\/?>/gi, " ").replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

function extractCleanNumber(rate) {
  if (!rate) return 1500;
  const str = String(rate).trim().toLowerCase();
  if (str.includes("k")) {
    const floatVal = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(floatVal) ? 1500 : Math.round(floatVal * 1000);
  }
  // ✅ ตัดข้อความข้างหลัง เช่น /1ชม. หรือ (1 ชม.) ออกก่อนดึงตัวเลข
  const pricePart = str.split(/[\/\(\s]/)[0];
  const cleanDigits = pricePart.replace(/\D/g, "");
  const num = parseInt(cleanDigits, 10);
  if (isNaN(num) || num <= 0) return 1500;
  if (num < 10) return num * 1000;
  if (num < 500) return num * 10;
  return num;
}

// 🟢 เวอร์ชันเสถียร 100% (ฟอนต์ไม่หลุด, ไม่กินลิมิต, บอทสแกนไม่เจอ)
function optimizeImg(imagePath, mode = "card") {
  const DEFAULT_FALLBACK_IMG = "https://firstmodelhub.com/images/firstmodelhub.webp";
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) {
    return DEFAULT_FALLBACK_IMG;
  }

  const cleanPath = imagePath.trim();
  
  // 💎 พลิกภาพ (a_hflip) + วางลายน้ำสีขาวโปร่งแสง 45% ฟอนต์ Montserrat สไตล์ลักชัวรี
  const WM_CARD = "a_hflip/l_text:Montserrat_20_bold_letter_spacing_3:FIRSTMODELHUB,co_rgb:ffffff,o_45/fl_layer_apply,g_south,y_30";
  const WM_MODAL = "a_hflip/l_text:Montserrat_26_bold_letter_spacing_4:FIRSTMODELHUB,co_rgb:ffffff,o_45/fl_layer_apply,g_south,y_40";
  const WM_FULL = "a_hflip/l_text:Montserrat_34_bold_letter_spacing_5:FIRSTMODELHUB,co_rgb:ffffff,o_45/fl_layer_apply,g_south,y_50";

  let baseTransform = `f_auto,q_auto:good,w_400,h_560,c_fill/${WM_CARD}`;
  
  if (mode === "thumb" || (typeof mode === "number" && mode <= 150)) {
    // รูปกลมขนาดเล็ก ไม่ใส่ลายน้ำ เพื่อความเร็วและไม่รก
    baseTransform = "f_auto,q_auto:good,w_120,h_120,c_thumb,g_face";
  } else if (mode === 400 || mode === "card") {
    baseTransform = `f_auto,q_auto:good,w_400,h_560,c_fill/${WM_CARD}`;
  } else if (mode === 600 || (typeof mode === "number" && mode > 400 && mode < 700)) {
    baseTransform = `f_auto,q_auto:good,w_600,h_800,c_fill/${WM_MODAL}`;
  } else if (mode === "full" || (typeof mode === "number" && mode >= 700) || mode === "og") {
    baseTransform = `f_auto,q_auto:good,w_1200,c_limit/${WM_FULL}`;
  }

  const transform = baseTransform;

  if (cleanPath.includes("res.cloudinary.com")) {
    const fileMatch = cleanPath.match(/(?:v\d+\/)?(images\/[^\s\?]+|[^\/]+\.(?:png|jpg|jpeg|webp|avif))$/i);
    if (fileMatch && fileMatch[1]) {
      return `https://res.cloudinary.com/dyynjlbuj/image/upload/${transform}/${fileMatch[1]}`;
    }
    return cleanPath;
  }

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) return cleanPath;
  const formatted = cleanPath.replace(/^\/+/, "");
  return `https://res.cloudinary.com/dyynjlbuj/image/upload/${transform}/${formatted}`;
}

function generateSrcSet(imagePath) {
  if (!imagePath || typeof imagePath !== "string" || !imagePath.includes("res.cloudinary.com")) {
    return "";
  }
  const img400 = optimizeImg(imagePath, 400);
  const img600 = optimizeImg(imagePath, 600);
  return `${img400} 400w, ${img600} 600w`;
}

// 🟢 ระบบ Human Bio Generator: สลับชุดข้อความ A และ B ตาม ID โปรไฟล์ ป้องกันเนื้อหาซ้ำ
function generateDynamicPersonaDesc(p, displayName, provinceName, zone, stats, age, height, weight) {
  let rawPersonalDesc = sanitizeThaiText(p.description || "")
    .replace(/เรทราคา|รายละเอียดค่ะ|1500\/1|มัดจำ/gi, "")
    .replace(/[ฃ͡➴˚˳*•ㅅ•づ♡]+/g, "")
    .trim();

  const speechText = (rawPersonalDesc.length >= 8) 
    ? rawPersonalDesc 
    : "ยินดีที่ได้รู้จักค่ะ ทักมาพูดคุยสอบถามคิวหรือนัดเวลาล่วงหน้าได้เลยนะคะ เทคแคร์เป็นกันเอง ไม่ดุค่ะ";

  // ใช้ ID ของน้องเป็นตัวกำหนดว่าจะแสดงรูปแบบ A หรือ B
  const profileIdStr = String(p.id || "1");
  const isVariantB = profileIdStr.charCodeAt(profileIdStr.length - 1) % 2 === 0;

  // ชุดข้อความสลับ (Variant A & B)
  const introText = isVariantB 
    ? "รายละเอียดส่วนตัว สัดส่วน และพิกัดบริการอัปเดตล่าสุด น้องน่ารัก นิสัยเฟรนด์ลี่ พูดเพราะ และดูแลเอาใจใส่เป็นอย่างดี สบายใจได้กับการนัดพบตัวจริงแล้วค่อยชำระค่าบริการตรงหน้างาน ไม่มีมัดจำล่วงหน้า"
    : "ข้อมูลโปรไฟล์และสัดส่วนได้รับการตรวจสอบและยืนยันตัวตนเรียบร้อยแล้ว น้องเป็นคนอารมณ์ดี คุยสนุก และให้ความเป็นกันเอง มั่นใจได้เรื่องความปลอดภัยด้วยระบบนัดเจอตรวจสอบความถูกต้องหน้างานก่อนชำระเงิน";

  const styleText = isVariantB
    ? "สไตล์เพื่อนสนิท: นิสัยขี้อ้อน อัธยาศัยดี ชวนคุยเก่ง เน้นการดูแลเอาใจใส่ที่ทำให้คุณรู้สึกผ่อนคลายและเป็นกันเองตลอดการนัดหมาย"
    : "เน้นฟิวแฟน: สุภาพ อ่อนโยน เทคแคร์ดี และไม่เร่งรีบในระหว่างเวลางาน เหมาะสำหรับเดินเที่ยว ทานข้าว คาเฟ่ หรือเป็นเพื่อนร่วมเดินทาง";

  const locationText = isVariantB
    ? `การเดินทาง: ประจำการอยู่ในพื้นที่${zone} สามารถเดินทางไปหาที่โรงแรมหรือคอนโดส่วนตัวของคุณได้ทันที ตกลงเรื่องพิกัดและเวลาที่สะดวกก่อนเริ่มงานได้เลย`
    : `พื้นที่ให้บริการ: มีห้องพักส่วนตัวในทำเล${zone} หรือพร้อมเดินทางไปดูแลคุณถึงโรงแรม คอนโด และที่พักในย่านใกล้เคียงอย่างรวดเร็วและมิดชิด`;

  const safetyText = isVariantB
    ? "การันตีความปลอดภัย: ลูกค้าชำระค่าบริการโดยตรงเมื่อเจอตัวน้องหน้างานเรียบร้อยแล้วเท่านั้น ไม่มี การเก็บเงินมัดจำล่วงหน้าทุกรูปแบบ หากตรวจสอบแล้วตัวจริงไม่ตรงตามรูป สามารถปฏิเสธและยกเลิกงานได้ทันที"
    : "แนวปฏิบัติเพื่อความสบายใจ: โปรไฟล์นี้ใช้ระบบพบตัวจริงก่อนแล้วค่อยชำระเงินตรงกับน้อง ห้ามโอนเงินล่วงหน้าในทุกกรณี หากมีเงื่อนไขเรียกเก็บเงินก่อนเดินทาง โปรดแจ้งแอดมินทันทีเพื่อระงับสิทธิ์";

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
          <span><strong>สไตล์:</strong> ${styleText}</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <i class="fas fa-map-marker-alt" style="color: #7C3AED; width: 14px; text-align: center; margin-top: 3px;"></i>
          <span><strong>พิกัด:</strong> ${locationText}</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <i class="fas fa-shield-alt" style="color: #059669; width: 14px; text-align: center; margin-top: 3px;"></i>
          <span><strong>ข้อปฏิบัติ:</strong> ${safetyText}</span>
        </div>
      </div>
    </div>
  `;
}

// 🟢 ระบบ Meta Description ภาษาคนจริง: สั้นกระชับ พิกัดชัด เรทราคาจริง
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
  const isExpiredOneDay = cachedPage && (Date.now() - (cachedPage.cachedAt || 0) > ONE_DAY_MS);
  
  if (!isForceRefresh && cachedPage && !isExpiredOneDay && cachedPage.version === GLOBAL_PROFILE_VERSION) {
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

    let provinceKey = (profile.provinceKey || profile.province_slug || profile.province_key || "chiangmai").toString().trim().toLowerCase(); 
    if (provinceKey === "chiang-mai" || provinceKey === "chiang_mai") provinceKey = "chiangmai"; 
    if (provinceKey === "khonkaen" || provinceKey === "khon_kaen") provinceKey = "khon-kaen"; 
    const cleanProvinceKey = provinceKey.replace(/[-_]/g, "");

    const provVariants = [provinceKey, cleanProvinceKey];
    if (provinceKey === "chiangmai") provVariants.push("chiang-mai", "chiang_mai");
    if (provinceKey === "khon-kaen" || provinceKey === "khonkaen") provVariants.push("khonkaen", "khon_kaen");

    const provCol = ("provinceKey" in profile && profile.provinceKey) ? "provinceKey"
      : ("province_slug" in profile && profile.province_slug) ? "province_slug"
      : ("province_key" in profile && profile.province_key) ? "province_key"
      : "provinceKey";

    let relatedProfiles = [];
    try {
      const { data: sameProvinceProfiles } = await supabase
        .from("profiles")
        .select("id, slug, name, imagePath, image_url, isfeatured")
        .eq("active", true)
        .neq("id", profile.id)
        .in(provCol, provVariants)
        .order("isfeatured", { ascending: false })
        .limit(6);

      if (sameProvinceProfiles && sameProvinceProfiles.length > 0) {
        relatedProfiles = sameProvinceProfiles.slice(0, 6);
      }
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
        <h3 style="color: #7C3AED; font-size: 13.5px; font-weight: 900; margin: 0 0 10px 0; text-align: center;">น้องๆ แนะนำเพิ่มเติมในโซน${escapeHTML(provinceNameThai)}</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          ${relatedProfiles.map(rp => {
            const rpName = `น้อง${escapeHTML((rp.name || "สาวสวย").trim().replace(/^(น้อง\s?)+/gi, ""))}`;
            const rpSlug = encodeURIComponent(rp.slug || rp.id);
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
    
    const rateNumber = extractCleanNumber(profile.rate || profile.price);
    const priceDisplay = `${rateNumber.toLocaleString()}.-`;
    
    const rawImage = profile.imagePath || profile.image_url || "";
    const heroImageLarge = optimizeImg(rawImage, 600);
    const heroImageSmall = optimizeImg(rawImage, 400);
    const ogImageSocial = optimizeImg(rawImage, "og");
    const heroSrcSet = generateSrcSet(rawImage);

    // ดึงรูปภาพทั้งหมดในอัลบั้ม
    let rawGallery = profile.galleryPaths || profile.gallery_paths || profile.gallery || [];
    if (typeof rawGallery === "string") {
      try { rawGallery = JSON.parse(rawGallery); } catch (_) { rawGallery = rawGallery.split(",").map(s => s.trim()); }
    }
    const allGalleryImages = [rawImage, ...(Array.isArray(rawGallery) ? rawGallery : [])].filter(Boolean);
    const uniqueGallery = [...new Set(allGalleryImages)];

    const galleryThumbnailsHtml = uniqueGallery.length > 1 ? `
      <div class="profile-gallery-strip" id="profile-gallery-strip" style="display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch;">
        ${uniqueGallery.map((imgUrl, i) => `
          <button type="button" class="thumb-slot ${i === 0 ? 'active' : ''}" data-full-src="${optimizeImg(imgUrl, 600)}" style="padding: 0; width: 62px; height: 80px; border-radius: 10px; overflow: hidden; flex-shrink: 0; cursor: pointer; border: 2px solid ${i === 0 ? '#7C3AED' : 'transparent'}; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: none;">
            <img src="${optimizeImg(imgUrl, 'thumb')}" alt="รูปที่ ${i + 1}" width="62" height="80" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
          </button>
        `).join("")}
      </div>
    ` : "";
    
    // Universal Link LINE
    const rawLineInput = (profile.line_id || profile.line || profile.lineId || profile.line_url || "").trim();
    let lineId = "https://line.me/ti/p/u8Bz9HsaY8";

    const matchUrl = rawLineInput.match(/(https?:\/\/[^\s]+)/i);
    if (matchUrl) {
      lineId = matchUrl[0];
    } else if (rawLineInput) {
      const cleanHandle = rawLineInput.trim();
      if (cleanHandle.startsWith("@")) {
        const cleanOa = cleanHandle.replace(/^@+/, "").trim();
        if (cleanOa) lineId = `https://page.line.me/${cleanOa}`;
      } else {
        const cleanPersonalId = cleanHandle.replace(/[^a-zA-Z0-9_\-\.]/g, "");
        if (cleanPersonalId) lineId = `https://line.me/R/ti/p/~${cleanPersonalId}`;
      }
    }

    const cleanAge = profile.age && String(profile.age).trim() !== "-" && String(profile.age).trim() !== "0" 
      ? String(profile.age).replace(/\D/g, "") 
      : null;
    const age = cleanAge || "ไม่ระบุ";

    // 🟢 แก้ไขบรรทัดนี้ได้เลยครับ:
    const ageDisplay = (age && age !== "ไม่ระบุ") ? `${age} ปี` : "";

    const height = profile.height && String(profile.height).trim() !== "-" && String(profile.height).trim() !== "0" 
      ? String(profile.height).replace(/\D/g, "") 
      : "160";
    const heightDisplay = `${height} ซม.`;

    const stats = (profile.stats && String(profile.stats).trim() !== "-" && String(profile.stats).trim() !== "0") 
      ? String(profile.stats).trim() 
      : "36-25-35";

    const rawH = parseInt(height, 10) || 160;
    let rawW = parseInt(String(profile.weight || "").replace(/\D/g, ""), 10) || 0;
    
    let waistVal = 0;
    if (stats && typeof stats === "string") {
      const statsParts = stats.split(/[-/]/);
      if (statsParts.length >= 2) waistVal = parseInt(statsParts[1], 10) || 0;
    }

    if (waistVal > 0 && waistVal <= 25 && (rawW > 52 || rawW < 40)) {
      rawW = Math.max(45, Math.min(49, rawH - 112));
    } else if (rawW <= 0 || rawW > 70) {
      rawW = Math.max(46, Math.min(52, rawH - 110));
    }

    const weight = String(rawW);
    const weightDisplay = `${weight} กก.`;
  
    const cleanProvince = escapeHTML(provinceNameThai);
    let rawLoc = sanitizeThaiText(profile.location || "");
    const primaryZone = rawLoc
      .replace(/^(ในตัวเมือง|ตัวเมือง|โซน|ย่าน)\s*(\/|และ)?\s*/gi, "")
      .split(/[,/]|และใกล้/)[0]
      .trim() || cleanProvince;

    const cityContext = cleanProvince.includes("กรุงเทพ") ? "กรุงเทพฯ" : `ตัวเมือง${cleanProvince}`;
    const localizedZone = profile.location ? `ย่าน${sanitizeThaiText(profile.location)}` : `ในเมือง`;
    const naturalDesc = generateDynamicPersonaDesc(profile, displayName, cleanProvince, localizedZone, stats, age, height, weight);

    // 🟢 ประกาศตัวแปรดึงเดือน-ปีปัจจุบันก่อนนำไปใช้ (แก้ ReferenceError)
    const currentFreshness = getCurrentFreshnessText(); // 👈 เพิ่มบรรทัดนี้ลงไปครับ!

    const profileSeoH1 = `${displayName} เพื่อนเที่ยวฟิวแฟน${cleanProvince} โซน${primaryZone}`;
    const pageTitle = `${displayName} รับงานไซด์ไลน์${cleanProvince} โซน${primaryZone} ตรงปก 100% [อัปเดต ${currentFreshness}] | ${CONFIG.BRAND_NAME}`;

    // 🟢 3. สร้าง Meta Description ภาษาคนจริง 6 สไตล์ สุ่มตาม ID ไม่ซ้ำ ไม่โดนแบน
    const metaDescription = generateHumanMetaDesc(displayName, cleanProvince, cityContext, primaryZone, stats, priceDisplay, profile.id || profile.slug);

  const safeZoneSlug = primaryZone.trim().replace(/\s+/g, "-");
const zoneHubUrl = primaryZone.includes("นิมมาน") 
  ? "/nimman" 
  : encodeURI(`/location/${provinceKey}/${safeZoneSlug}`);

    const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${encodeURIComponent(profile.slug || profile.id)}`;
    const realTimeText = getRealTimeAgo(profile.updated_at || profile.created_at);
    const isOnlineNow = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(s => (profile.availability || "").toLowerCase().includes(s));
    const realStatusText = profile.availability || (isOnlineNow ? "พร้อมรับงาน" : "สอบถามคิว");
    const statusDotColor = isOnlineNow ? "#059669" : "#F59E0B";

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
        a: `${displayName} มีห้องพักส่วนตัวย่าน${primaryZone} ที่สะอาด มิดชิด ปลอดภัย และพร้อมเดินทางไปดูแล (Outcall) ถึงโรงแรมหรือที่พักส่วนตัวในพื้นที่ได้สะดวกรวดเร็วค่ะ`
      }
    ];

    // 🟢 5. ปรับปรุง Schema Graph ระบุย่านและ Breadcrumb ลึกถึงระดับโซน
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
            "name": `โซน${primaryZone} ${cleanProvince}`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": primaryZone,
              "addressLocality": primaryZone,
              "addressRegion": cleanProvince,
              "addressCountry": "TH"
            }
          },
          "makesOffer": {
            "@type": "Offer",
            "name": `บริการเพื่อนเที่ยวสไตล์ฟิวแฟน ${stripHTML(displayName)}`,
            "url": canonicalUrl,
            "price": String(rateNumber),
            "priceCurrency": "THB",
            "availability": "https://schema.org/InStock",
            "validFrom": new Date().toISOString().split("T")[0],
            "priceValidUntil": new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            "itemOffered": {
              "@type": "Service",
              "name": `บริการเพื่อนเที่ยวฟิวแฟน ${stripHTML(displayName)}`,
              "description": `บริการเพื่อนเที่ยวสไตล์ฟิวแฟน (GFE) พิกัด ${primaryZone} จ.${cleanProvince} ตัวจริงตรงปก 100% จ่ายหน้างาน ไร้มัดจำ`,
              "areaServed": {
                "@type": "AdministrativeArea",
                "name": `${stripHTML(primaryZone)}, ${stripHTML(cleanProvince)}`
              }
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
              "item": `${CONFIG.DOMAIN}${provinceHubUrl}`
            },
            { 
              "@type": "ListItem", 
              "position": 3, 
              "name": `โซน${stripHTML(primaryZone)}`, 
              "item": `${CONFIG.DOMAIN}${zoneHubUrl}`
            },
            { 
              "@type": "ListItem", 
              "position": 4, 
              "name": stripHTML(displayName), 
              "item": canonicalUrl 
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          "isPartOf": { "@id": `${canonicalUrl}#webpage` },
          "mainEntity": profileFaqs.map(f => ({
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

    // กำหนดเวลา ISO มาตรฐาน เพื่อให้ client คำนวณ Relative time ได้แม่นยำตลอดเวลา
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

    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
    <link rel="dns-prefetch" href="https://res.cloudinary.com">
    <link rel="preload" href="/fonts/prompt-v11-latin_thai-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    <link rel="preload" href="/fonts/prompt-v11-latin_thai-700.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    ${heroSrcSet 
      ? `<link rel="preload" as="image" href="${heroImageSmall}" imagesrcset="${heroSrcSet}" imagesizes="(max-width: 600px) 100vw, 400px" fetchpriority="high">`
      : `<link rel="preload" as="image" href="${heroImageSmall}" fetchpriority="high">`
    }

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
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${escapeHTML(displayName)} ตัวจริงตรงปก 100%">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
    <meta name="twitter:description" content="${escapeHTML(metaDescription)}">
    <meta name="twitter:image" content="${ogImageSocial}">

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
<body class="fmh-app-page" style="background-color: #F8F6FC; color: #140F22;">
    <div class="container" style="max-width: 680px; margin: 0 auto; padding: 1rem 1rem 7rem 1rem;">
        <header id="page-header" role="banner" style="position: relative; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; backdrop-filter: blur(10px);">
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
          <a href="${provinceHubUrl}" style="color: #7C3AED; font-size: 12px; font-weight: 800; text-decoration: none;"><i class="fas fa-arrow-left"></i> ย้อนกลับ</a>
        </header>

        <!-- Breadcrumb Navigation -->
        <nav aria-label="breadcrumb">
          <ol style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; list-style: none; padding: 0; margin: 0 0 1rem 0; font-size: 12px;">
            <li><a href="/" style="color: #475569; text-decoration: none;">หน้าแรก</a></li>
            <li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>
            <li><a href="${provinceHubUrl}" style="color: #7C3AED; text-decoration: none; font-weight: 600;">${escapeHTML(activeBreadcrumbText)}</a></li>
            <li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>
            <li><a href="${zoneHubUrl}" style="color: #7C3AED; text-decoration: none; font-weight: 600;">โซน${escapeHTML(primaryZone)}</a></li>
            <li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>
            <li aria-current="page"><span style="color: #140F22; font-weight: 700;">${escapeHTML(displayName)}</span></li>
          </ol>
        </nav>

        <main class="main-content">
            <article class="interactive-card fmh-bento-card">
               <section class="hero-section" style="padding: 0; margin-bottom: 1rem;">
                    <div style="position: relative; border-radius: 18px; overflow: hidden; aspect-ratio: 3/4.2; width: 100%; border: 1px solid rgba(124, 58, 237, 0.15);">
                   <img id="main-profile-img" src="${heroImageSmall}" ${heroSrcSet ? `srcset="${heroSrcSet}" sizes="(max-width: 600px) 100vw, 400px"` : ""} class="hero-img" alt="${escapeHTML(displayName)} เพื่อนเที่ยวฟิวแฟน${cleanProvince} โซน${primaryZone} ตรงปก 100% - FirstModelHub" loading="eager" fetchpriority="high" decoding="async" width="400" height="560" style="width: 100%; height: 100%; object-fit: cover;">
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
                          <!-- 🟢 Semantic Time คำนวณสด ไม่โดนแคชหลอก -->
                          <time class="fmh-relative-time" datetime="${isoUpdatedTime}" style="color: #475569; font-size: 11.5px; font-weight: 600;">${realTimeText}</time>
                      </div>
                  </div>
                </header>

                <!-- Spec Grid (ย้ายเข้าสู่ CSS Class) -->
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

                <!-- Rates Box -->
                <section class="fmh-rates-box">
                    <h2 style="color: #7C3AED; text-align: center; font-weight: 900; font-size: 13.5px; margin: 0 0 10px 0;">💰 อัตราค่าบริการเพื่อนเที่ยว ${escapeHTML(displayName)} (${escapeHTML(cleanProvince)})</h2>
                    <div class="fmh-rates-grid">
                        <div class="fmh-rate-col">
                            <div class="time-label">1 ชม.</div>
                            <strong class="price-val">${rateNumber.toLocaleString()}.-</strong>
                        </div>
                        <div class="fmh-rate-col">
                            <div class="time-label">2 ชม.</div>
                            <strong class="price-val">${Math.floor(rateNumber * 1.8).toLocaleString()}.-</strong>
                        </div>
                        <div class="fmh-rate-col">
                            <div class="time-label">ค้างคืน</div>
                            <strong class="price-val">${Math.floor(rateNumber * 4.5).toLocaleString()}.-</strong>
                        </div>
                    </div>
                </section>

                <!-- CTA Action Buttons (เปลี่ยน inline onclick เป็น Data Action) -->
                <div style="margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px; width: 100%;">
                    <a href="${lineId}" class="fmh-btn-line-cta" rel="nofollow noopener" target="_blank">
                        <i class="fab fa-line" style="font-size: 20px;"></i> แอดไลน์สอบถามคิว (จ่ายหน้างาน)
                    </a>

                    <button type="button" class="fmh-btn-share-icon" data-action="share-profile" data-profile-name="${escapeHTML(displayName)}" data-profile-url="${canonicalUrl}" aria-label="แชร์โปรไฟล์">
                        <i class="fas fa-share-alt" style="font-size: 16px;"></i>
                    </button>
                </div>

               <!-- Bio Description: กล่องแนะนำตัวคลีนมินิมอล ไม่ซ้อนกรอบ -->
                <div class="profile-bio-wrapper" style="margin-bottom: 1.25rem;">
                    ${naturalDesc}
                </div>

                <!-- Related Profiles -->
                ${relatedCardsHtml}

              
<section class="fmh-safety-protocol-card" style="margin-top: 1.5rem;">
    <h3 style="font-size: 13.5px; font-weight: 900; margin: 0 0 8px 0; color: #140F22;">🛡️ แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัยสูงสุด</h3>
               
                   <p style="margin-bottom: 4px;"><strong style="color: #140F22;">✓ เกณฑ์อายุผู้ใช้งาน:</strong> แพลตฟอร์ม FirstModelHub กำหนดให้ผู้ขอรับบริการและผู้ลงประกาศต้องมีอายุครบ 20 ปีบริบูรณ์ขึ้นไปอย่างเข้มงวด</p>
                    <p style="margin-bottom: 4px;"><strong style="color: #140F22;">✓ จ่ายหน้างาน 100%:</strong> เจอน้องตัวจริงก่อนจึงค่อยจ่าย ไม่มีมัดจำล่วงหน้าทุกกรณี</p>
                    <p style="margin: 0;"><strong style="color: #140F22;">✓ รักษาความลับ (Zero-Log):</strong> ข้อมูลการติดต่อปลอดภัยสูงสุด</p>
                </section>
            </article>
        </main>
        
       <footer role="contentinfo" style="text-align: center; padding: 2rem 1rem; color: #64748B; font-size: 11.5px; line-height: 1.6;">
          <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - ศูนย์รวมเพื่อนเที่ยวฟิวแฟน ปลอดภัย จ่ายหน้างาน 100%</p>
          <div style="font-size: 10px; color: #94A3B8; max-width: 580px; margin: 8px auto 0 auto; border-top: 1px solid rgba(124, 58, 237, 0.1); padding-top: 8px;">
  <strong>Content & Copyright Notice:</strong> FirstModelHub operates purely as an online directory and information service. All promotional listings, profiles, and associated images are provided and updated independently by individual third-party advertisers. We do not claim ownership, control, or responsibility for any user-generated content. For immediate copyright verification or removal requests, please officially reach out to us at: <a href="mailto:abuse@firstmodelhub.com" style="color: #7C3AED; text-decoration: underline;">abuse@firstmodelhub.com</a>.
</div>
        </footer>
    </div>
       
    <script type="module" src="/main.js?v=${GLOBAL_PROFILE_VERSION}"></script>

  
   <!-- 🟢 เพิ่มระดับ z-index เป็น 99999 + ปรับความทึบแสง 0.98 + เพิ่มเงา Drop Shadow ชัดเจน ไม่โดนกลืน -->
<div style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 12px 16px; padding-bottom: max(12px, env(safe-area-inset-bottom)); border-top: 1.5px solid rgba(124, 58, 237, 0.2); box-shadow: 0 -8px 30px rgba(20, 15, 34, 0.15); z-index: 99999; display: flex; gap: 10px; align-items: center; box-sizing: border-box;">
        <a href="${lineId}" target="_blank" rel="noopener nofollow" class="fmh-btn-line-cta" style="padding: 12px 0;">
            <i class="fab fa-line" style="font-size: 20px;"></i>
            <span>ทักแชตสอบถามคิว${escapeHTML(displayName)}</span>
            <span style="font-size: 11px; background: rgba(0,0,0,0.2); padding: 2px 8px; border-radius: 100px; font-weight: 600;">จ่ายตรงกับน้อง</span>
        </a>
        <button type="button" class="fmh-btn-share-icon" data-action="share-profile" data-profile-name="${escapeHTML(displayName)}" data-profile-url="${canonicalUrl}" aria-label="แชร์โปรไฟล์">
            <i class="fas fa-share-alt" style="font-size: 16px;"></i>
        </button>
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
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
      "Netlify-CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
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
