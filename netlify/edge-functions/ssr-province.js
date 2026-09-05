import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const PAGE_CACHE = new Map();
let GLOBAL_VERSION = `v_${Date.now()}`;
let TEMPLATE_HTML_CACHE = null;

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
  get PURGE_SECRET() {
    try {
      return Deno.env.get("PURGE_SECRET") || "fmh_secure_purge_2026";
    } catch {
      return "fmh_secure_purge_2026";
    }
  },
  PRIMARY_DOMAIN: "https://firstmodelhub.com",
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

const PROVINCE_SEO_DATA = {
  chiangmai: {
    name: "เชียงใหม่",
    geo: { lat: 18.7883, lng: 98.9853 },
    zones: ["นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก", "หลัง มช.", "สันทราย", "ห้วยแก้ว", "รวมโชค"],
    faqs: [
      { q: "นัดหมายสาวรับงานเชียงใหม่ บน First Model Hub โซนไหนสะดวกที่สุด?", a: "ถนนนิมมานเหมินท์, สันติธรรม, ช้างเผือก และรอบคอนโดมิเนียมย่านเจ็ดยอด เป็นพิกัดหลักที่มีน้องๆ สแตนด์บายพร้อมดูแลท่านอย่างสะดวกรวดเร็วครับ" },
      { q: "การเรียกใช้บริการรับงานเชียงใหม่ ต้องโอนมัดจำล่วงหน้าหรือไม่?", a: "ไม่มีนโยบายโอนมัดจำล่วงหน้าทุกกรณีครับ เราใช้นโยบาย 'เจอตัวจริงค่อยชำระเงินโดยตรงหน้างาน' ป้องกันความเสี่ยงทางการเงิน 100%" }
    ]
  },
  "chiang-mai": {
    name: "เชียงใหม่",
    geo: { lat: 18.7883, lng: 98.9853 },
    zones: ["นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก", "หลัง มช.", "สันทราย", "ห้วยแก้ว", "รวมโชค"],
    faqs: [
      { q: "นัดหมายสาวรับงานเชียงใหม่ บน First Model Hub โซนไหนสะดวกที่สุด?", a: "ถนนนิมมานเหมินท์, สันติธรรม, ช้างเผือก และรอบคอนโดมิเนียมย่านเจ็ดยอด เป็นพิกัดหลักที่มีน้องๆ สแตนด์บายพร้อมดูแลท่านอย่างสะดวกรวดเร็วครับ" },
      { q: "การเรียกใช้บริการรับงานเชียงใหม่ ต้องโอนมัดจำล่วงหน้าหรือไม่?", a: "ไม่มีนโยบายโอนมัดจำล่วงหน้าทุกกรณีครับ เราใช้นโยบาย 'เจอตัวจริงค่อยชำระเงินโดยตรงหน้างาน' ป้องกันความเสี่ยงทางการเงิน 100%" }
    ]
  },
  chiangrai: {
    name: "เชียงราย",
    geo: { lat: 19.9105, lng: 99.8406 },
    zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "มฟล.", "หอนาฬิกา", "แม่สาย", "รอบเวียง"],
    faqs: [
      { q: "นัดหมายสาวรับงานเชียงราย โซนบ้านดู่ และ มฟล. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำอยู่ในโซนบ้านดู่ หน้ามหาวิทยาลัยแม่ฟ้าหลวง และใจกลางเมืองเชียงราย พร้อมดูแลอย่างเป็นกันเองครับ" },
      { q: "ไซด์ไลน์เชียงราย การันตีตรงปกและปลอดภัยอย่างไร?", a: "โปรไฟล์ผ่านการยืนยันตัวตน 100% ปลอดภัยด้วยระบบนัดเจอตัวจริงหน้างานเรียบร้อยแล้วค่อยชำระค่าบริการ ไม่มีการโอนเงินก่อนครับ" }
    ]
  },
  lampang: {
    name: "ลำปาง",
    geo: { lat: 18.2888, lng: 99.4923 },
    zones: ["ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏลำปาง", "สบตุ๋ย", "เซ็นทรัลลำปาง"],
    faqs: [
      { q: "นัดพบสาวรับงานลำปาง ในตัวเมืองหรือแถวไหนสะดวกที่สุด?", a: "พิกัดยอดนิยมคือโรงแรมชั้นนำในตัวเมืองลำปาง, ย่านสวนดอก, ถนนรอบเวียง และละแวก ม.ราชภัฏลำปาง เดินทางสะดวกและเป็นส่วนตัวครับ" },
      { q: "การนัดหมายไซด์ไลน์ลำปาง ต้องมีเงินมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ เจอน้องตัวจริง ยืนยันความตรงปกหน้างานแล้วค่อยชำระค่าบริการโดยตรงกับน้องครับ" }
    ]
  },
  lamphun: {
    name: "ลำพูน",
    geo: { lat: 18.5772, lng: 99.0087 },
    zones: ["ตัวเมืองลำพูน", "นิคมลำพูน", "เวียงยอง", "ป่าซาง", "เหมืองง่า", "บ้านกลาง"],
    faqs: [
      { q: "สาวรับงานลำพูน โซนนิคมอุตสาหกรรมนัดหมายอย่างไร?", a: "น้องๆ สแตนด์บายพร้อมดูแลทั้งในโซนนิคมลำพูน ตัวเมืองลำพูน และเวียงยอง สามารถนัดเจอที่โรงแรมหรือที่พักส่วนตัวได้อย่างปลอดภัยครับ" }
    ]
  },
  phitsanulok: {
    name: "พิษณุโลก",
    geo: { lat: 16.8211, lng: 100.2659 },
    zones: ["ตัวเมืองพิษณุโลก", "รอบ มน.", "ท่าโพธิ์", "สมอแข", "ท็อปแลนด์", "เซ็นทรัลพิษณุโลก"],
    faqs: [
      { q: "สาวรับงานพิษณุโลก รอบ ม.นเรศวร (มน.) นัดหมายอย่างไร?", a: "มีน้องๆ ประจำอยู่ในโซนรอบ มน. ท่าโพธิ์ และใจกลางเมืองพิษณุโลก นัดหมายง่าย สะดวกและเป็นส่วนตัวครับ" }
    ]
  },
  bangkok: {
    name: "กรุงเทพฯ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย", "สาทร", "บางนา"],
    faqs: [
      { q: "สาวรับงานกรุงเทพฯ ครอบคลุมโซนไหนบ้าง?", a: "ครอบคลุมทุกโซนสำคัญ เช่น สุขุมวิท, รัชดา, ห้วยขวาง, ลาดพร้าว, ทองหล่อ, สาทร และบางนา สะดวกและเป็นส่วนตัวครับ" }
    ]
  },
  chonburi: {
    name: "ชลบุรี",
    geo: { lat: 13.3611, lng: 100.9847 },
    zones: ["พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี", "จอมเทียน", "อมตะนคร", "แหลมฉบัง"],
    faqs: [
      { q: "เรียกสาวรับงานพัทยา บางแสน จ่ายเงินอย่างไร?", a: "ชำระตรงหน้างานเมื่อเจอน้องตัวจริงเรียบร้อยแล้วเท่านั้น ไม่มีโอนมัดจำก่อนทุกกรณีครับ" }
    ]
  },
  khonkaen: {
    name: "ขอนแก่น",
    geo: { lat: 16.4322, lng: 102.8236 },
    zones: ["ในตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
    faqs: [
      { q: "นัดหมายสาวรับงานขอนแก่น โซนกังสดาล และหลัง มข. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำทั้งโซนกังสดาล หลัง มข. และโรงแรมชั้นนำใจกลางเมืองขอนแก่นครับ" }
    ]
  },
  "khon-kaen": {
    name: "ขอนแก่น",
    geo: { lat: 16.4322, lng: 102.8236 },
    zones: ["ในตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
    faqs: [
      { q: "นัดหมายสาวรับงานขอนแก่น โซนกังสดาล และหลัง มข. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำทั้งโซนกังสดาล หลัง มข. และโรงแรมชั้นนำใจกลางเมืองขอนแก่นครับ" }
    ]
  },
  phuket: {
    name: "ภูเก็ต",
    geo: { lat: 7.8804, lng: 98.3923 },
    zones: ["ตัวเมืองภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง", "กะรน", "กะตะ", "บางเทา", "ราไวย์"],
    faqs: [
      { q: "นัดหมายสาวรับงานภูเก็ต ป่าตอง จ่ายเงินอย่างไร?", a: "นัดเจอตัวจริงตรงปกหน้างานแล้วค่อยชำระเงินตรงกับน้อง ไม่มีโอนมัดจำล่วงหน้าทุกกรณีครับ" }
    ]
  },
  udonthani: {
    name: "อุดรธานี",
    geo: { lat: 17.4138, lng: 102.7872 },
    zones: ["ตัวเมืองอุดร", "UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร", "บ้านจาน", "โพศรี"],
    faqs: [
      { q: "สาวรับงานอุดรธานี นัดพบแถวไหนสะดวกที่สุด?", a: "ย่านใจกลางเมืองอุดรธานี, UD Town, เซ็นทรัลอุดร และรอบสวนสาธารณะหนองประจักษ์ เป็นจุดนัดพบยอดนิยมครับ" }
    ]
  },
  default: {
    name: "ทั่วไทย",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "พัทยา", "ภูเก็ต", "ขอนแก่น", "อุดรธานี", "หาดใหญ่"],
    faqs: [
      { q: "เรียกใช้บริการน้องๆ สาวรับงาน เด็กเอ็น First Model Hub ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่ต้องโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ ลูกค้าตกลงชำระค่าบริการหน้างานเมื่อเจอน้องตัวจริงตรงปกแล้วเท่านั้น" }
    ]
  }
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

const replaceGlobal = (str, target, replacement) => str.split(target).join(replacement);

function optimizeImg(path, width = 400, height = 560) {
  if (!path || typeof path !== "string" || !path.trim()) {
    return CONFIG.DEFAULT_OG_IMAGE;
  }
  const cleanPath = path.trim();
  const cropParam = height ? `f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face` : `f_auto,q_auto:best,w_${width},c_scale`;
  
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

function smartLinkify(text, total, zones, provinceSlug = "chiangmai") {
  if (!text) return "";
  let formatted = sanitizeThaiText(text);
  const locationUrl = provinceSlug && provinceSlug !== "national" ? `/location/${provinceSlug}` : "/";

  const replaceFirstSafe = (content, pattern, template) => {
    const regex = new RegExp(`(${pattern})(?![^<]*>|[^<>]*<\\/a>|[^<>]*<\\/strong>)`, "i");
    return content.replace(regex, template);
  };

  if (zones && Array.isArray(zones) && zones.length > 0) {
    zones.slice(0, 4).forEach(zone => {
      if (!zone || zone === "ทั้งหมด") return;
      const cleanZone = sanitizeThaiText(zone);
      formatted = replaceFirstSafe(
        formatted,
        cleanZone,
        `<a href="${locationUrl}" class="kw-zone">$1</a>`
      );
    });
  }

  formatted = replaceFirstSafe(
    formatted,
    "สาวรับงาน|ไซด์ไลน์|เด็กเอ็น|เพื่อนเที่ยว|ฟิวแฟน",
    '<strong class="kw-purple">$1</strong>'
  );

  formatted = replaceFirstSafe(
    formatted,
    "ไม่โอนมัดจำ|จ่ายหน้างาน 100%|ตรงปก 100%|นัดเจอตัวจริง",
    '<strong class="kw-green">$1</strong>'
  );

  formatted = replaceFirstSafe(
    formatted,
    "ไม่โอนเงินมัดจำล่วงหน้าทุกกรณี|ห้ามโอนเงินก่อน",
    '<strong class="kw-red">$1</strong>'
  );

  return formatted;
}

function getDynamicIntro(provinceName, zones, provinceSlug = "chiangmai") {
  let cleanZones = zones && Array.isArray(zones) ? zones.filter(z => z && z !== "ทั้งหมด") : [];
  const locationUrl = provinceSlug && provinceSlug !== "national" ? `/location/${provinceSlug}` : "/";
  const zoneLinks = cleanZones.slice(0, 5).map(z => `<a href="${locationUrl}" class="kw-zone">${escapeHTML(sanitizeThaiText(z))}</a>`);
  const zoneText = zoneLinks.length > 0 ? ` ครอบคลุมพิกัดสำคัญ เช่น โซน ${zoneLinks.join(", โซน ")}` : " ครอบคลุมเขตตัวเมืองและบริเวณใกล้เคียง";
  
  return `
    <p>ยินดีต้อนรับสู่ <strong>${CONFIG.BRAND_NAME}</strong> แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ สาวรับงาน${provinceName}, เด็กเอ็น${provinceName} และ เพื่อนเที่ยวไซด์ไลน์${provinceName} แหล่งรวบรวมโปรไฟล์ผู้ดูแลระดับพรีเมียมที่เน้นความโปร่งใส ปลอดภัย และเพียบพร้อมด้วยการดูแลเอาใจใส่สไตล์ ฟิวแฟน (Girlfriend Experience - GFE) อย่างสุภาพเรียบร้อยเป็นธรรมชาติ ปราศจากเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี</p>
    <p>เพื่อตอบสนองความสะดวกในการนัดหมายพิกัดบริการในพื้นที่ ${provinceName} น้องๆ ในระบบของเรากระจายตัวอยู่ในจุดที่เหมาะสม${zoneText} ไม่ว่าจะเป็นโรงแรมชั้นนำ คอนโดมิเนียมส่วนตัว หรือพิกัดยอดนิยม เดินทางสะดวกสบายและมีความปลอดภัยสูง พร้อมร่วมเดินทางท่องเที่ยว ทานอาหาร หรือพูดคุยเพื่อสร้างความผ่อนคลายและคลายเหงาให้แก่คุณในโอกาสพิเศษ</p>
    <p>รูปภาพและข้อมูลรายละเอียดสัดส่วนของน้องๆ ได้รับการคัดกรองและตรวจสอบยืนยันตัวตน (Verified System) อย่างรอบคอบ เพื่อให้สมาชิกมั่นใจได้ว่าข้อมูลถูกต้อง ตรงตามปก 100% ปลอดภัยนัดเจอ ชำระหน้างาน ไม่มีความเสี่ยงทางการเงินทุกกรณีครับ</p>
  `;
}

function getDynamicReviews(provinceName) {
  const isChiangMai = provinceName === "เชียงใหม่";
  return [
    {
      author: "คุณชลสิทธิ์",
      initial: "C",
      location: isChiangMai ? "ย่านนิมมาน เชียงใหม่" : `ตัวเมือง${provinceName}`,
      text: isChiangMai
        ? "นัดเจอน้องแถวย่านนิมมาน เชียงใหม่ เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบ First Model Hub ไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับ"
        : `นัดเจอน้องในจังหวัด${provinceName} เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบ First Model Hub ไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับ`,
      rating: 5,
      date: "เมื่อสัปดาห์ที่แล้ว"
    },
    {
      author: "คุณอภิชาติ",
      initial: "A",
      location: isChiangMai ? "โซนยอดนิยม นิมมาน" : `โซนยอดนิยมใน${provinceName}`,
      text: "น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยมเสมือนมีเพื่อนร่วมทางคนพิเศษคอยเคียงข้าง ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ",
      rating: 5,
      date: "เมื่อ 2 สัปดาห์ก่อน"
    }
  ];
}

async function getTemplateHtml(url, context) {
  if (TEMPLATE_HTML_CACHE) return TEMPLATE_HTML_CACHE;
  try {
    const templateUrl = new URL("/index.html", url.origin);
    const res = await fetch(templateUrl, { headers: { "x-ssr-bypass": "true" } });
    if (res.ok) {
      TEMPLATE_HTML_CACHE = await res.text();
      return TEMPLATE_HTML_CACHE;
    }
  } catch {}
  return "";
}

function generateCardSrcSet(rawImg) {
  if (!rawImg || typeof rawImg !== "string" || !rawImg.trim()) return "";
  return `${optimizeImg(rawImg, 320, 448)} 320w, ${optimizeImg(rawImg, 400, 560)} 400w, ${optimizeImg(rawImg, 600, 840)} 600w`;
}

function formatLuxuryRate(rate) {
  if (!rate) return "1.5k";
  const num = parseInt(String(rate).replace(/\D/g, ""), 10);
  if (isNaN(num) || num <= 0) return "1.5k";
  if (num >= 1000) {
    const kVal = num / 1000;
    return (kVal % 1 === 0 ? kVal : kVal.toFixed(1)) + "k";
  }
  return String(num);
}

const renderCardHtml = (p, isPriorityLCP = false, provinceName = "เชียงใหม่") => {
  const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/gi, ""));
  let rawLoc = sanitizeThaiText(p.location) || provinceName;
  let loc = escapeHTML(
    rawLoc
      .replace(/^(ในตัวเมือง|ตัวเมือง|โซน|ย่าน)\s*(\/|และ)?\s*/gi, "")
      .split(/[,/]/)[0]
      .trim() || rawLoc
  );

  const profileUrl = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
  const isAvail = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(s => (p.availability || "").toLowerCase().includes(s));
  const availStatus = p.availability || (isAvail ? "รับงาน" : "สอบถามคิว");
  const ageStr = p.age && p.age !== "-" ? `${escapeHTML(p.age)}` : "";
  const statusClass = isAvail ? "status-online" : "status-busy";
  
  const rawImg = p.imagePath || p.image_url || p.imageUrl || p.photo || p.avatar || "";
  const cardImg = optimizeImg(rawImg, 400, 560);
  const cardSrcSet = generateCardSrcSet(rawImg);
  const luxuryPrice = formatLuxuryRate(p.rate);

  let rawTags = p.style_tags || p.styleTags || p.tags || [];
  if (typeof rawTags === "string") rawTags = rawTags.split(",").map(s => s.trim());
  const vibeTagsHtml = Array.isArray(rawTags) && rawTags.length > 0
    ? rawTags.slice(0, 2).map(t => `<span class="card-vibe-pill">#${escapeHTML(t.replace(/^#/, ""))}</span>`).join("")
    : `<span class="card-vibe-pill">#ฟิวแฟน</span>`;

  let rightBadgeHtml = isPriorityLCP
    ? `<span class="badge-hot-tag">🔥 HOT</span>`
    : `<span class="badge-verified-top">✦ ตรงปก</span>`;

  return `
    <div class="profile-card-new-container">
      <article class="profile-card-new interactive-card" data-profile-id="${p.id}" data-profile-slug="${escapeHTML(p.slug || p.id)}">
          <img src="${cardImg}" 
               ${cardSrcSet ? `srcset="${cardSrcSet}" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"` : ""}
               alt="น้อง${cleanName} สาวรับงาน${provinceName} ย่าน${loc} สไตล์ฟิวแฟน ตรงปก 100% - FirstModelHub"
               width="400"
               height="560"
               class="profile-card-img"
               loading="${isPriorityLCP ? "eager" : "lazy"}"
               fetchpriority="${isPriorityLCP ? "high" : "auto"}"
               decoding="async"
               onerror="this.onerror=null; this.src='https://firstmodelhub.com/images/firstmodelhub.webp';" />
               
          <div class="profile-card-gradient-overlay"></div>

          <div class="profile-card-badges-top">
              <div class="badges-left">
                  <span class="badge-status ${statusClass}">
                      <span class="status-dot"></span>
                      <span>${availStatus}</span>
                  </span>
              </div>
              <div class="badges-right">
                  ${rightBadgeHtml}
              </div>
          </div>
          
          <a href="${profileUrl}" class="card-link" aria-label="ดูโปรไฟล์น้อง${cleanName}"></a>

          <div class="profile-card-info-content">
              <div class="profile-card-tags-row">
                  ${vibeTagsHtml}
              </div>
              <div class="profile-card-title-row">
                  <h3 class="profile-card-name">น้อง${cleanName}</h3>
                  ${ageStr ? `<span class="profile-card-age-tag">${ageStr} ปี</span>` : ""}
              </div>
              <div class="profile-card-bottom-row">
                  <span class="profile-card-location">
                      <i class="fas fa-map-marker-alt"></i> ${loc}
                  </span>
                  <span class="profile-card-price">${luxuryPrice}</span>
              </div>
          </div>
      </article>
    </div>
  `;
};

const generateDynamicFAQsHTML = faqs => {
  if (!faqs || !Array.isArray(faqs)) return "";
  return faqs.map(f => `
    <div class="faq-item-card" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 12px;">
        <div style="font-size: 13px; font-weight: 800; color: #C084FC; margin-bottom: 4px;">
            Q: ${escapeHTML(sanitizeThaiText(f.q))}
        </div>
        <div style="font-size: 12px; color: var(--text-gray); line-height: 1.5;">
            ${escapeHTML(sanitizeThaiText(f.a))}
        </div>
    </div>
  `).join("");
};

export default async (req, context) => {
  try {
    const url = new URL(req.url);
    const primaryDomain = CONFIG.PRIMARY_DOMAIN;

    // ⚡ 1. On-Demand Purge: ล้างแคชเมื่อหลังบ้านสั่งมาเท่านั้น
    if (url.pathname === "/api/clear-cache" || url.pathname === "/api/purge-cache") {
      const secret = url.searchParams.get("secret") || req.headers.get("x-purge-secret");
      if (secret === CONFIG.PURGE_SECRET) {
        PAGE_CACHE.clear();
        TEMPLATE_HTML_CACHE = null;
        GLOBAL_VERSION = `v_${Date.now()}`;
        return new Response(JSON.stringify({
          success: true,
          message: "⚡ All Caches Purged Successfully!",
          version: GLOBAL_VERSION
        }), {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      }
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Bypass Static Assets
    if (req.headers.get("x-ssr-bypass") === "true" || STATIC_EXT_REGEX.test(url.pathname)) {
      return await context.next();
    }

    const cleanPath = url.pathname.toLowerCase().replace(/\/+$/, "") || "/";
    if (["/about", "/faq", "/blog", "/contact", "/terms-of-service", "/privacy-policy", "/locations", "/nimman", "/offline", "/profile"].some(p => cleanPath === p || cleanPath.startsWith(p + "/"))) {
      return await context.next();
    }

    if (url.pathname === "/index.html") {
      return Response.redirect(`${primaryDomain}/`, 301);
    }

    // ⚡ 2. ตรวจสอบแคชใน Memory (ถ้ามีแคชส่งทันที 0 Database Query)
    const cacheKey = `${req.method}:${cleanPath}`;
    const cachedPage = PAGE_CACHE.get(cacheKey);
    if (cachedPage && cachedPage.version === GLOBAL_VERSION) {
      return new Response(cachedPage.html, { headers: cachedPage.headers });
    }
    
    // ⚡ 3. ถ้าไม่มีแคช -> ยิง Supabase ดึงข้อมูล
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

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

    const [provinceDataRes, profilesRes, allProvincesRes] = await Promise.all([
      isNational
        ? Promise.resolve({ data: { id: 0, nameThai: "ทั่วไทย", key: "national" } })
        : supabase.from("provinces").select("id, nameThai, key").in("key", provinceKeyVariants).limit(1).maybeSingle(),
      profilesQuery,
      supabase.from("provinces").select("key, nameThai").order("nameThai", { ascending: true })
    ]);

    const provinceData = provinceDataRes.data;
    if (!provinceData && !isNational) {
      return new Response("404 - ไม่พบข้อมูลพื้นที่จังหวัดที่ต้องการ", { status: 404 });
    }

    const profilesList = profilesRes.data || [];
    const totalCount = profilesRes.count !== null && profilesRes.count !== undefined ? profilesRes.count : profilesList.length;
    const provinceNameThai = isNational ? "ทั่วไทย" : provinceData?.nameThai || "เชียงใหม่";
    const seoData = isNational ? PROVINCE_SEO_DATA.default : PROVINCE_SEO_DATA[cleanProvinceSlug] || PROVINCE_SEO_DATA.default;
    const canonicalUrl = isNational ? `${primaryDomain}/` : `${primaryDomain}/location/${provinceSlug}`;
    const heroImage = CONFIG.DEFAULT_OG_IMAGE;
    const activeReviews = getDynamicReviews(provinceNameThai);

    const metaTitle = isNational 
      ? "สาวรับงาน ไซด์ไลน์ ฟิวแฟนตรงปก จ่ายหน้างาน | First Model Hub"
      : `สาวรับงาน${provinceNameThai} ไซด์ไลน์ ฟิวแฟนตรงปก จ่ายหน้างาน | First Model Hub`;

    const metaDescription = isNational
      ? "ศูนย์รวมสาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ"
      : `ศูนย์รวมสาวรับงาน${provinceNameThai} ไซด์ไลน์ เด็กเอ็น ฟิวแฟนตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ`;

    const cleanMetaDesc = stripHTML(metaDescription);
    const mapZoom = isNational ? 6 : 12;
    const mapQuery = isNational ? encodeURIComponent("ประเทศไทย") : encodeURIComponent(`จังหวัด${provinceNameThai}`);
    const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;
    const cleanZonesList = (seoData.zones || []).map(sanitizeThaiText).filter(z => z && z !== "ทั้งหมด" && z !== "all");

    // Schema.org
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
        "@id": `${canonicalUrl}#webpage`,
        "name": metaTitle,
        "description": cleanMetaDesc,
        "url": canonicalUrl,
        "isPartOf": { "@id": `${primaryDomain}/#website` },
        "about": { "@id": `${canonicalUrl}#business` },
        "mainEntity": { "@id": `${canonicalUrl}#itemlist` }
      },
      {
        "@type": ["EntertainmentBusiness", "ProfessionalService"],
        "@id": `${canonicalUrl}#business`,
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
        "areaServed": isNational ? { "@type": "Country", "name": "Thailand" } : [{ "@type": "AdministrativeArea", "name": provinceNameThai }, ...cleanZonesList.map(z => ({ "@type": "AdministrativeArea", "name": `โซน${z}` }))]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": primaryDomain },
          ...(isNational ? [] : [{ "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceNameThai}`, "item": canonicalUrl }])
        ]
      }
    ];

    if (profilesList.length > 0) {
      schemaGraph.push({
        "@type": "ItemList",
        "@id": `${canonicalUrl}#itemlist`,
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
        "@id": `${canonicalUrl}#faq`,
        "isPartOf": { "@id": `${canonicalUrl}#webpage` },
        "mainEntity": seoData.faqs.map(f => ({
          "@type": "Question",
          "name": stripHTML(sanitizeThaiText(f.q)),
          "acceptedAnswer": { "@type": "Answer", "text": stripHTML(sanitizeThaiText(f.a)) }
        }))
      });
    }

    const allCardsHtml = profilesList.map((p, i) => renderCardHtml(p, i === 0, provinceNameThai)).join("");
    const featuredCardsHtml = profilesList.filter(p => p.isfeatured).slice(0, 12).map((p, i) => renderCardHtml(p, i === 0, provinceNameThai)).join("");

    const reviewsHtml = (Array.isArray(activeReviews) ? activeReviews : []).map(r => {
      const avatarLetter = r.initial || (r.author ? r.author.replace(/^(คุณ|พี่|น้อง)/, "").trim().charAt(0) : "V");
      const cleanText = stripHTML(r.text || "").replace(/^["']|["']$/g, "");
      const authorName = escapeHTML(r.author || "ลูกค้าประจำ");
      const locationName = escapeHTML(r.location || provinceNameThai);
      const dateText = escapeHTML(r.date || "เมื่อไม่นานมานี้");

      return `
        <div class="review-card-item">
            <div class="review-card-header">
              <div class="review-user-info">
                <div class="review-avatar-circle">${escapeHTML(avatarLetter)}</div>
                <div>
                  <div class="review-username">${authorName}</div>
                  <div class="review-user-loc">นัดเจอใน${locationName}</div>
                </div>
              </div>
              <div class="review-stars-list">
                ${Array.from({ length: 5 }).map((_, i) => `<i class="fas fa-star" style="color: ${i < (r.rating || 5) ? "#FBBF24" : "#71717A"};"></i>`).join("")}
              </div>
            </div>
            <p class="review-comment-body">"${escapeHTML(cleanText)}"</p>
            <span class="review-verified-badge"><i class="fas fa-check-circle"></i> ยืนยันการใช้บริการจริง • ${dateText}</span>
        </div>
      `;
    }).join("");

    const faqsHtml = generateDynamicFAQsHTML(seoData.faqs);
    const zonesStr = (seoData.zones || []).filter(z => z !== "ทั้งหมด").slice(0, 4).map(sanitizeThaiText).join(", ");
    const introText = getDynamicIntro(provinceNameThai, seoData.zones, provinceSlug);
    const linkedIntro = smartLinkify(introText, 0, seoData.zones, provinceSlug);

    const popularLocationsFooter = allProvincesRes.data
      ? allProvincesRes.data.map(p => {
          const key = (p.key || p.slug || p.id || "").toString().toLowerCase();
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
    if (!finalHtml) return await context.next();

    const exactCount = String(totalCount);

    finalHtml = finalHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHTML(metaTitle)}</title>`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHTML(cleanMetaDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHTML(metaTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHTML(cleanMetaDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHTML(metaTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHTML(cleanMetaDesc)}" />`);

    finalHtml = finalHtml.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" id="canonical-link" href="${canonicalUrl}">`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:url["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}">`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:image["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta property="og:image" content="${heroImage}">`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:image:secure_url["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta property="og:image:secure_url" content="${heroImage}">`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:image["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta name="twitter:image" content="${heroImage}">`);

    const hreflangBlock = isNational
      ? `<!-- MULTILINGUAL SEO -->\n  <link rel="alternate" hreflang="th" href="${primaryDomain}/" />\n  <link rel="alternate" hreflang="en" href="${primaryDomain}/index-en" />\n  <link rel="alternate" hreflang="x-default" href="${primaryDomain}/" />\n\n  `
      : `<!-- MULTILINGUAL SEO -->\n  <link rel="alternate" hreflang="th" href="${canonicalUrl}" />\n  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />\n\n  `;

    finalHtml = finalHtml.replace(/<!-- (?:🌐 )?MULTILINGUAL SEO[\s\S]*?(?=<!-- (?:📱 )?OPEN GRAPH)/i, hreflangBlock);
    finalHtml = replaceGlobal(finalHtml, "{{SEO_CANONICAL}}", canonicalUrl);
    finalHtml = replaceGlobal(finalHtml, "{{SEO_IMAGE}}", heroImage);

    const ssrH1Html = isNational
      ? `<span class="h1-line-1">สาวรับงาน ไซด์ไลน์ทั่วไทย</span>\n          <span class="h1-line-2">& ฟิวแฟน ตรงปก 100%</span>`
      : `<span class="h1-line-1">สาวรับงาน${escapeHTML(provinceNameThai)} ไซด์ไลน์${escapeHTML(provinceNameThai)}</span>\n          <span class="h1-line-2">& ฟิวแฟน ตรงปก 100%</span>`;

    finalHtml = finalHtml.replace(/<h1[^>]*id=["']hero-h1["'][^>]*>[\s\S]*?<\/h1>|<h1\s+class=["']seo-h1-title["'][^>]*>[\s\S]*?<\/h1>/i, `<h1 class="seo-h1-title" id="hero-h1">${ssrH1Html}</h1>`);

    const ssrFeaturedH2 = `น้องๆ รับงาน <span class="province-name-highlight">ไซด์ไลน์${escapeHTML(provinceNameThai)}</span>`;
    finalHtml = finalHtml.replace(/<h2 id="featured-heading"[^>]*>[\s\S]*?<\/h2>/i, `<h2 id="featured-heading" class="clean-section-h2">${ssrFeaturedH2}</h2>`);

    const totalProvincesFromDb = allProvincesRes?.data ? allProvincesRes.data.length : 0;
    finalHtml = finalHtml.replace(/<strong\b[^>]*\bid=["']live-profile-count["'][^>]*>[\s\S]*?<\/strong>/i, `<strong class="stat-number" id="live-profile-count">${exactCount}</strong>`);
    finalHtml = finalHtml.replace(/<strong\b[^>]*\bid=["']live-province-count["'][^>]*>[\s\S]*?<\/strong>/i, `<strong class="stat-number" id="live-province-count">${isNational ? totalProvincesFromDb : 1}</strong>`);

    const schemaJsonStr = JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }).replace(/</g, "\\u003c");
    finalHtml = finalHtml.replace(/<script type="application\/ld\+json" id="dynamic-schema">[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="dynamic-schema">\n${schemaJsonStr}\n<\/script>`);

    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_NAME}}", provinceNameThai);
    finalHtml = replaceGlobal(finalHtml, "{{PROFILE_COUNT}}", exactCount);
    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_ZONES}}", zonesStr || "ทุกพื้นที่");
    finalHtml = replaceGlobal(finalHtml, "{{MAP_EMBED_URL}}", mapEmbedUrl);

    finalHtml = finalHtml.replace(/<div\s+class=["']seo-content-inner["'][^>]*>[\s\S]*?<\/div>/i, `<div class="seo-content-inner" style="font-size: 12.5px; color: var(--text-gray, #94a3b8); line-height: 1.7;">${linkedIntro}</div>`);

    if (faqsHtml) {
      finalHtml = finalHtml.replace(/<div id="faq-container-list"[^>]*>[\s\S]*?<\/div>/i, `<div id="faq-container-list" class="faq-list-wrapper">${faqsHtml}</div>`);
    }
    if (reviewsHtml) {
      finalHtml = finalHtml.replace(/<div id="reviews-container-grid"[^>]*>[\s\S]*?<\/div>/i, `<div id="reviews-container-grid" class="reviews-grid-wrapper">${reviewsHtml}</div>`);
    }

    const hotSwiperCardsHtml = profilesList.slice(0, 8).map((p, i) => {
      const cleanName = escapeHTML((p.name || "น้อง").trim().replace(/^(น้อง\s?)+/gi, ""));
      const loc = escapeHTML(sanitizeThaiText(p.location) || provinceNameThai);
      const slug = encodeURIComponent(p.slug || p.id);
      const img = optimizeImg(p.imagePath || p.image_url || "", 350, 490);
      const isAvail = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(s => (p.availability || "").toLowerCase().includes(s));
      
      return `
  <div class="vip-card-item ${i === 0 ? "active-glow" : ""}" data-profile-id="${p.id}" data-profile-slug="${slug}">
    <span class="vip-status-chip"><span aria-hidden="true">🟢</span> ${isAvail ? "รับงาน" : "สอบถาม"}</span>
    <span class="hot-rank-badge">#${i + 1} HOT</span>
    <img src="${img}" 
         alt="น้อง${cleanName} สาวรับงาน${provinceNameThai} ย่าน${loc} ฟิวแฟน ตรงปก 100% - FirstModelHub" 
         width="175" 
         height="245" 
         loading="${i === 0 ? "eager" : "lazy"}" 
         fetchpriority="${i === 0 ? "high" : "auto"}" 
         decoding="async"
         onerror="this.onerror=null; this.src='https://firstmodelhub.com/images/firstmodelhub.webp';">
    <div class="vip-card-overlay"></div>
    <a href="/sideline/${slug}" class="card-link" aria-label="ดูโปรไฟล์น้อง${cleanName}"></a>
    <div class="vip-card-info">
      <h3 class="vip-name" style="margin: 0; font-size: 14px; font-weight: 900;">น้อง${cleanName}</h3>
      <div class="vip-location">${loc}</div>
    </div>
  </div>
`;
    }).join("");

    if (hotSwiperCardsHtml) {
      finalHtml = finalHtml.replace(/<div id="vip-swiper-container"[^>]*>[\s\S]*?<\/div>/i, `<div id="vip-swiper-container" class="vip-swiper-wrapper" aria-label="สไลด์รายชื่อน้องๆ HOT แนะนำ">${hotSwiperCardsHtml}</div>`);
    }

    // แก้ไข: ถ้าไม่ใช่หน้าทั่วไทย ให้คงแท็ก Section ไว้แต่ใส่ style="display: none;" ป้องกัน JS หาไม่เจอ
    if (isNational) {
      finalHtml = finalHtml.replace(/<div id="featured-profiles-container"[^>]*>[\s\S]*?<\/div>/i, `<div id="featured-profiles-container" class="profile-grid profiles-grid-row" aria-labelledby="featured-heading">${featuredCardsHtml || ""}</div>`);
    } else {
      finalHtml = finalHtml.replace(/<section id="featured-profiles"[^>]*>/i, `<section id="featured-profiles" class="clean-section-wrapper" aria-labelledby="featured-heading" style="display: none;">`);
    }

    let displayAreaHtml = "";
    if (isNational) {
      const groupedByProvince = profilesList.reduce((acc, p) => {
        const key = (p.provinceKey || p.province_slug || "no_province").toString().toLowerCase();
        acc[key] = acc[key] || [];
        acc[key].push(p);
        return acc;
      }, {});

      const sortedProvinceKeys = Object.keys(groupedByProvince).sort((a, b) => {
        const nameA = String(PROVINCE_SEO_DATA[a]?.name || a || "");
        const nameB = String(PROVINCE_SEO_DATA[b]?.name || b || "");
        return nameA.localeCompare(nameB, "th");
      });

      for (const pKey of sortedProvinceKeys) {
        const pName = PROVINCE_SEO_DATA[pKey]?.name || pKey;
        const pCount = groupedByProvince[pKey].length;
        const pCards = groupedByProvince[pKey].map((p) => renderCardHtml(p, false, pName)).join("");
        displayAreaHtml += `
          <div class="section-content-wrapper province-section" id="province-${pKey}">
            <div class="province-header-row">
                <a href="/location/${pKey}" class="province-title-link">
                    <h2 class="province-clean-title">
                        <span class="province-pin-icon"><i class="fas fa-map-marker-alt"></i></span>
                        <span class="province-prefix">น้องๆ ในจังหวัด</span>
                        <span class="province-name-highlight">${escapeHTML(pName)}</span>
                    </h2>
                </a>
                <a href="/location/${pKey}" class="province-count-pill">
                    <span class="pulse-dot-el"></span>
                    <span>${pCount} โปรไฟล์</span>
                    <i class="fas fa-chevron-right arrow-mini"></i>
                </a>
            </div>
            <div class="profile-grid profiles-grid-row">
              ${pCards}
            </div>
          </div>
        `;
      }
    } else {
      displayAreaHtml = `
        <div class="section-content-wrapper">
          <div class="province-header-row">
              <h2 class="province-clean-title">
                  <span class="province-pin-icon"><i class="fas fa-map-marker-alt"></i></span>
                  <span class="province-prefix">น้องๆ ในจังหวัด</span>
                  <span class="province-name-highlight">${escapeHTML(provinceNameThai)}</span>
              </h2>
              <span class="province-count-pill">
                  <span class="pulse-dot-el"></span>
                  <span>${totalCount} โปรไฟล์</span>
              </span>
          </div>
          <div class="profile-grid profiles-grid-row">
            ${allCardsHtml}
          </div>
        </div>
      `;
    }

    finalHtml = finalHtml.replace(/<div id="profiles-display-area"[^>]*>[\s\S]*?<\/div>/i, `<div id="profiles-display-area" role="region" aria-label="โปรไฟล์ผู้ดูแลและเพื่อนเที่ยว${provinceNameThai}">${displayAreaHtml}</div>`);

    const provinceSelectOptions = '<option value="">🗺️ เลือกจังหวัด (ทั้งหมด)</option>' + (allProvincesRes?.data || []).map(p => {
      const isSelected = p.key === provinceSlug ? "selected" : "";
      return `<option value="${p.key}" ${isSelected}>${p.nameThai}</option>`;
    }).join("");
    finalHtml = finalHtml.replace(/<select id="search-province"[^>]*>[\s\S]*?<\/select>/i, `<select id="search-province" name="province" class="search-select-field" aria-label="เลือกจังหวัดที่ต้องการค้นหา">${provinceSelectOptions}</select>`);

    if (popularLocationsFooter) { 
      finalHtml = finalHtml.replace(/<ul id="popular-locations-footer"[^>]*>[\s\S]*?<\/ul>/i, `<ul id="popular-locations-footer" class="popular-locations-grid">${popularLocationsFooter}</ul>`); 
    }

    const serializedProfilesJson = JSON.stringify(profilesList.map(p => {
      const pKey = (p.provinceKey || p.province_slug || "chiangmai").toString().toLowerCase().trim();
      const cleanPKey = pKey.replace(/[-_]/g, "");
      const realProvinceThai = PROVINCE_SEO_DATA[cleanPKey]?.name || PROVINCE_SEO_DATA[pKey]?.name || p.provinceThai || "เชียงใหม่";

      let cleanLine = (p.lineId || p.line_id || p.line || "ksLUWB89Y_").toString().trim();
      const matchUrl = cleanLine.match(/(https?:\/\/[^\s]+)/i);
      if (matchUrl) {
        cleanLine = matchUrl[0];
      } else {
        const cleanHandle = cleanLine.replace(/^@/, "").replace(/[^a-zA-Z0-9_\-\.]/g, "").trim();
        cleanLine = cleanHandle ? `https://line.me/ti/p/${cleanHandle}` : "https://line.me/ti/p/ksLUWB89Y_";
      }

      const rawRateStr = (p.rate || p.price || "").toString().trim();
      const safeRate = rawRateStr !== "" ? rawRateStr : "1500";

      let rawTags = p.style_tags || p.styleTags || p.tags || [];
      if (typeof rawTags === "string") rawTags = rawTags.split(",").map(s => s.trim());
      const safeStyleTags = Array.isArray(rawTags) ? rawTags.filter(Boolean) : [];

      return {
        id: p.id,
        slug: p.slug || String(p.id),
        name: p.name || "น้อง",
        age: p.age && String(p.age).trim() !== "-" ? p.age : null,
        height: p.height || "",
        weight: p.weight || "",
        stats: p.stats || "",
        skinTone: p.skinTone || p.skin_tone || "",
        bust: p.bust || "",
        waist: p.waist || "",
        hips: p.hips || "",
        cup_size: p.cup_size || "",
        imagePath: p.imagePath || p.image_url || p.imageUrl || "",
        galleryPaths: p.galleryPaths || p.gallery_paths || [],
        provinceKey: pKey,
        provinceThai: realProvinceThai,
        location: sanitizeThaiText(p.location || realProvinceThai),
        rate: safeRate,
        availability: p.availability || "รับงาน",
        lastUpdated: p.lastUpdated || p.created_at || null,
        isfeatured: p.isfeatured === true || p.isFeatured === true,
        verified: p.verified === true || p.isVerified === true,
        hasVideo: p.hasVideo === true || p.has_video === true,
        description: sanitizeThaiText(p.description || ""),
        lineId: cleanLine,
        quote: sanitizeThaiText(p.quote || p.slogan || ""),
        styleTags: safeStyleTags
      };
    })).replace(/</g, "\\u003c");

    const serializedProvinces = (allProvincesRes?.data || []).map(p => ({
      key: (p.key || p.slug || p.id || "").toString().toLowerCase(),
      nameThai: p.nameThai || p.name
    }));

    const ssrDataScript = `
      <script id="ssr-profiles-data">
        window.profilesData = ${serializedProfilesJson};
        window.provincesData = ${JSON.stringify(serializedProvinces).replace(/</g, "\\u003c")};
        window.currentProvinceSlug = ${JSON.stringify(provinceSlug)};
        window.currentProvinceName = ${JSON.stringify(provinceNameThai)};
      </script>
    `;

    finalHtml = finalHtml.replace(/<script id="ssr-profiles-data">[\s\S]*?<\/script>/i, ssrDataScript);
    finalHtml = replaceGlobal(finalHtml, "{{PROFILES_CARDS_HTML}}", "");
    finalHtml = replaceGlobal(finalHtml, "{{PROFILES_DISPLAY_AREA_HTML}}", "");

    const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "ETag": `"${GLOBAL_VERSION}"`,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    PAGE_CACHE.set(cacheKey, { html: finalHtml, headers: responseHeaders, version: GLOBAL_VERSION });
    return new Response(finalHtml, { headers: responseHeaders });

  } catch (err) {
    console.error("SSR Edge Function Error:", err);
    return await context.next();
  }
};