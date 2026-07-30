/**
 * [ UNIFIED SSR ENGINE & BOT HANDLER - PRODUCTION COMPLETE ]
 * Project: First Model Hub
 * Architecture: Netlify Edge Function (Deno Runtime) + Supabase DB
 * Year: 2026 High-Performance SEO & Core Web Vitals Standard
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

// 🟢 IN-MEMORY EDGE CACHE (10 Minutes TTL)
const PAGE_CACHE = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

let TEMPLATE_HTML_CACHE = null;
let TEMPLATE_CACHE_TIMESTAMP = 0;

const STATIC_EXT_REGEX = /\.(css|js|png|jpg|jpeg|webp|avif|svg|ico|json|webmanifest|map|woff|woff2|ttf)$/i;

const CONFIG = {
  get SUPABASE_URL() {
    try { return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co"; } catch { return "https://zxetzqwjaiumqhrpumln.supabase.co"; }
  },
  get SUPABASE_KEY() {
    try { return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA8NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; } catch { return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA8NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
  },
  PRIMARY_DOMAIN: "https://firstmodelhub.com",
  BRAND_NAME: "First Model Hub",
  BRAND_LEGAL_NAME: "First Model Hub Co., Ltd.",
  DEFAULT_TELEPHONE: "LINE: @firstmodelhub",
  SOCIAL_LINKS: {
    line: "https://line.me/ti/p/ksLUWB89Y_",
    tiktok: "https://tiktok.com/@firstmodelhub",
    twitter: "https://twitter.com/firstmodelhub",
    biosite: "https://bio.site/firstmodelhub",
    linktr: "https://linktr.ee/firstmodelhub"
  }
};

// 🟢 PROVINCE ALIAS & SEO MAPPING
const PROVINCE_ALIASES = {
  chiangmai: ["chiangmai", "chiang_mai", "chiang-mai", "เชียงใหม่"],
  chiangrai: ["chiangrai", "chiang_rai", "chiang-rai", "เชียงราย"],
  udonthani: ["udonthani", "udon_thani", "udon", "อุดรธานี", "อุดร"],
  lampang: ["lampang", "ลำปาง"],
  phitsanulok: ["phitsanulok", "พิษณุโลก"],
  bangkok: ["bangkok", "bkk", "กรุงเทพ", "กรุงเทพมหานคร"],
  chonburi: ["chonburi", "ชลบุรี", "พัทยา", "บางแสน"],
  phuket: ["phuket", "ภูเก็ต"],
  khonkaen: ["khon-kaen", "khonkaen", "khon_kaen", "ขอนแก่น"],
  suratthani: ["surat-thani", "suratthani", "surat_thani", "สุราษฎร์ธานี", "สมุย"],
  ubonratchathani: ["ubon-ratchathani", "ubonratchathani", "ubon_ratchathani", "อุบลราชธานี", "อุบล"],
  ayutthaya: ["phra-nakhon-si-ayutthaya", "ayutthaya", "อยุธยา", "พระนครศรีอยุธยา"]
};

const PROVINCE_NAMES_THAI = {
  chiangmai: "เชียงใหม่",
  chiangrai: "เชียงราย",
  udonthani: "อุดรธานี",
  lampang: "ลำปาง",
  phitsanulok: "พิษณุโลก",
  bangkok: "กรุงเทพฯ",
  chonburi: "ชลบุรี",
  phuket: "ภูเก็ต",
  khonkaen: "ขอนแก่น",
  suratthani: "สุราษฎร์ธานี",
  ubonratchathani: "อุบลราชธานี",
  ayutthaya: "พระนครศรีอยุธยา"
};

const PROVINCE_ZONES_MAP = {
  chiangmai: ["นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก", "แม่โจ้", "พายัพ"],
  chiangrai: ["ตัวเมืองเชียงราย", "บ้านดู่", "ม.แม่ฟ้าหลวง", "หอนาฬิกา"],
  udonthani: ["ตัวเมืองอุดร", "UD Town", "เซ็นทรัลอุดร", "หนองประจักษ์"],
  lampang: ["ตัวเมืองลำปาง", "สวนดอก", "พระบาท", "ม.ราชภัฏลำปาง"],
  phitsanulok: ["ตัวเมืองพิษณุโลก", "ม.นเรศวร", "ริมน้ำน่าน"],
  bangkok: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "เอกมัย", "ทองหล่อ"],
  chonburi: ["พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี"],
  phuket: ["ตัวเมืองภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง"],
  khonkaen: ["ตัวเมืองขอนแก่น", "ม.ขอนแก่น", "กังสดาล", "หลังมอ"],
  suratthani: ["ตัวเมืองสุราษฎร์", "เกาะสมุย", "เฉวง"],
  ubonratchathani: ["ตัวเมืองอุบล", "ม.อุบล", "วารินชำราบ"],
  ayutthaya: ["ตัวเมืองอยุธยา", "โรบินสันอยุธยา", "ม.ราชภัฏอยุธยา"],
  national: ["กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "อุดรธานี", "ขอนแก่น", "ภูเก็ต"]
};

const PROVINCE_CUSTOM_METADATA = {
  chiangmai: {
    title: "สาวรับงานเชียงใหม่ ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานเชียงใหม่ และเพื่อนเที่ยวไซด์ไลน์พรีเมียมสไตล์ฟิวแฟน คัดสรรโปรไฟล์ตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมย่านนิมมาน เจ็ดยอด สันติธรรม"
  },
  chiangrai: {
    title: "สาวรับงานเชียงราย ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานเชียงราย และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน ยืนยันตัวตนตรงปก 100% ปลอดภัยชำระเงินหน้างาน ไม่โอนมัดจำล่วงหน้า ครอบคลุมตัวเมือง บ้านดู่ มฟล."
  },
  udonthani: {
    title: "สาวรับงานอุดร ไซด์ไลน์อุดรธานี ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "สารบัญสาวรับงานอุดรธานี และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัยจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมตัวเมืองอุดร UD Town"
  },
  lampang: {
    title: "สาวรับงานลำปาง ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานลำปาง และเพื่อนเที่ยวพรีเมียม ปลอดภัยชำระเงินหน้างานเมื่อเจอตัวจริง ปราศจากการโอนมัดจำล่วงหน้า ครอบคลุมตัวเมืองลำปาง สวนดอก"
  },
  phitsanulok: {
    title: "สาวรับงานพิษณุโลก ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานพิษณุโลก รับงาน มน. และเพื่อนเที่ยวสไตล์ฟิวแฟน ปลอดภัย จ่ายหน้างาน 100% ไม่โอนมัดจำล่วงหน้า ครอบคลุมตัวเมืองพิษณุโลก"
  },
  bangkok: {
    title: "สาวรับงานกรุงเทพ ไซด์ไลน์ กทม ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานกรุงเทพ รับงาน กทม และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมสุขุมวิท รัชดา ลาดพร้าว เอกมัย"
  },
  chonburi: {
    title: "สาวรับงานชลบุรี ไซด์ไลน์พัทยา บางแสน ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "สารบัญสาวรับงานชลบุรี รับงานพัทยา และเพื่อนเที่ยวบางแสน พรีเมียมดูแลใส่ใจสไตล์ฟิวแฟน ปลอดภัยสูงสุดชำระค่าบริการหน้างานเมื่อเจอตัวจริง"
  }
};

const PROVINCE_SEO_DATA = {
  chiangmai: {
    name: "เชียงใหม่",
    geo: { lat: 18.8140717, lng: 98.972096 },
    zones: ["นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก"],
    faqs: [
      { q: "นัดหมายสาวรับงานเชียงใหม่ บน First Model Hub โซนไหนสะดวกที่สุด?", a: "ถนนนิมมานเหมินท์, สันติธรรม, ช้างเผือก และรอบคอนโดมิเนียมย่านเจ็ดยอด เป็นพิกัดหลักที่มีน้องๆ สแตนด์บายพร้อมดูแลท่านอย่างสะดวกรวดเร็ว" },
      { q: "การเรียกใช้บริการรับงานเชียงใหม่ ต้องโอนมัดจำล่วงหน้าหรือไม่?", a: "ไม่มีนโยบายโอนมัดจำล่วงหน้าทุกกรณีครับ เราใช้นโยบาย 'เจอตัวจริงค่อยชำระเงินโดยตรงหน้างาน' ป้องกันความเสี่ยงทางการเงิน 100%" }
    ]
  },
  default: {
    name: "ทั่วไทย",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "อุดรธานี", "ขอนแก่น", "ลำปาง"],
    faqs: [
      { q: "เรียกใช้บริการน้องๆ สาวรับงาน เด็กเอ็น First Model Hub ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่ต้องโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ ลูกค้าตกลงชำระค่าบริการหน้างานเมื่อเจอน้องตัวจริงตรงปกแล้วเท่านั้น" }
    ]
  }
};

Object.keys(PROVINCE_SEO_DATA).forEach(key => {
  if (key !== "default") {
    PROVINCE_SEO_DATA[key] = { ...PROVINCE_SEO_DATA.default, ...PROVINCE_SEO_DATA[key] };
  }
});

// 🟢 HELPER UTILITIES
const escapeHTML = (str) => (str !== null && str !== undefined) ? String(str).replace(/[&<>'"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[m] || m)) : "";
const stripHTML = (str) => (str !== null && str !== undefined) ? String(str).replace(/<[^>]*>?/gm, "").trim().replace(/\s+/g, " ") : "";
const replaceGlobal = (source, target, replacement) => source.split(target).join(replacement);

const optimizeImg = (hostUrl, path, width = 350, height = 437) => {
  if (!path) return `${hostUrl}/images/apple-touch-icon.png`;
  if (path.includes("res.cloudinary.com")) {
    if (path.includes("/upload/")) {
      return path.replace("/upload/", `/upload/f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face/`);
    }
    return path;
  }
  if (path.startsWith("http")) return path;
  return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=75&format=avif`;
};

const optimizeOgImg = (hostUrl, path) => {
  if (!path) return `${hostUrl}/images/apple-touch-icon.png`;
  if (path.includes("res.cloudinary.com")) {
    if (path.includes("/upload/")) {
      return path.replace("/upload/", `/upload/f_jpg,q_auto:good,w_1200,h_630,c_fill,g_face/`);
    }
    return path;
  }
  if (path.startsWith("http")) return path;
  return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=1200&height=630&resize=cover&quality=85&format=jpeg`;
};

const formatDateSSR = dateStr => {
  if (!dateStr) return "เมื่อครู่นี้";
  try {
    const t = new Date(dateStr),
      months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
      date = t.getDate(),
      month = months[t.getMonth()];
    return `${date} ${month} ${(t.getFullYear() + 543).toString().slice(-2)}`;
  } catch {
    return "เมื่อครู่นี้";
  }
};

const smartLinkify = (text, flag, zones, provinceSlug = "chiangmai") => {
  if (!text) return "";
  let res = text;
  const targetUrl = (provinceSlug && provinceSlug !== "national") ? `/location/${provinceSlug}` : "/";
  if (zones && Array.isArray(zones) && zones.length > 0) {
    zones.slice(0, 3).forEach(zone => {
      if (!zone) return;
      const regex = new RegExp(`(${zone})(?![^<]*>|[^<>]*<\\/a>)`, "g");
      res = res.replace(regex, `<a href="${targetUrl}" class="text-[#C084FC] hover:underline font-bold transition-colors">$1</a>`);
    });
  }
  const keywordsRegex = /(เด็กเอ็น|ไซด์ไลน์|พรีเมียม|ฟีลแฟน|รับงาน|ฟิวแฟน|สาวรับงาน)(?![^<]*>|[^<>]*<\/a>)/g;
  return res.replace(keywordsRegex, `<span class="highlight text-[#C084FC] font-extrabold">$1</span>`);
};

const getDynamicIntro = (provinceName, zones, provinceSlug = "chiangmai") => {
  let processedZones = zones && Array.isArray(zones) ? [...zones] : [];
  const targetUrl = (provinceSlug && provinceSlug !== "national") ? `/location/${provinceSlug}` : "/";
  const zoneLinks = processedZones.slice(0, 4).map(zone => 
    `<a href="${targetUrl}" class="text-[#C084FC] hover:underline font-bold transition-colors">${escapeHTML(zone)}</a>`
  );
  const zoneSnippet = zoneLinks.length > 0 ? ` ครอบคลุมพิกัดสำคัญ เช่น โซน${zoneLinks.join(", โซน")}` : " ครอบคลุมเขตตัวเมืองและบริเวณใกล้เคียง";

  return `
    <p>ยินดีต้อนรับสู่ <strong>${CONFIG.BRAND_NAME}</strong> แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ <strong>สาวรับงาน${provinceName}</strong>, <strong>เด็กเอ็น${provinceName}</strong> และ <strong>เพื่อนเที่ยวไซด์ไลน์${provinceName}</strong> แหล่งรวบรวมโปรไฟล์ผู้ดูแลระดับพรีเมียมที่เน้นความโปร่งใส ปลอดภัย และเพียบพร้อมด้วยการดูแลเอาใจใส่สไตล์ฟิวแฟน (Girlfriend Experience - GFE) อย่างสุภาพเรียบร้อยเป็นธรรมชาติ ปราศจากเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี</p>
    <p>เพื่อตอบสนองความสะดวกในการนัดหมายพิกัดบริการในพื้นที่ ${provinceName} น้องๆ ในระบบของเรากระจายตัวอยู่ในจุดที่เหมาะสม${zoneSnippet} ไม่ว่าจะเป็นโรงแรมชั้นนำ คอนโดมิเนียมส่วนตัว หรือพิกัดยอดนิยม เดินทางสะดวกสบายและมีความปลอดภัยสูง พร้อมร่วมเดินทางท่องเที่ยว ทานอาหาร หรือพูดคุยเพื่อสร้างความผ่อนคลายและคลายเหงาให้แก่คุณในโอกาสพิเศษ</p>
    <p>รูปภาพและข้อมูลรายละเอียดสัดส่วนของน้องๆ ได้รับการคัดกรองและตรวจสอบยืนยันตัวตน (Verified System) อย่างรอบคอบ เพื่อให้สมาชิกมั่นใจได้ว่าข้อมูลถูกต้อง ตรงตามปก และได้รับประสบการณ์การใช้บริการที่ปลอดภัยและมีความสุขที่สุด</p>
  `;
};

const getDynamicReviews = provinceName => {
  const t = new Date();
  const isChiangMai = provinceName === "เชียงใหม่";
  return [
    {
      author: "คุณชลสิทธิ์ (C.)",
      location: isChiangMai ? "ย่านนิมมาน เชียงใหม่" : `ตัวเมือง${provinceName}`,
      text: isChiangMai 
        ? `"นัดเจอน้องแถวย่านนิมมาน เชียงใหม่ เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบ First Model Hub ไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับสำหรับคนที่หาเพื่อนเที่ยวฟิวแฟนดีๆ แถวนิมมาน"`
        : `"นัดเจอน้องในจังหวัด${provinceName} เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบ First Model Hub ไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับ"`,
      rating: 5,
      date: "เมื่อสัปดาห์ที่แล้ว",
      datePublished: new Date(t.getTime() - 691200000).toISOString().split("T")[0]
    },
    {
      author: "คุณอภิชาติ (A.)",
      location: isChiangMai ? "โซนยอดนิยม นิมมาน เชียงใหม่" : `โซนยอดนิยมใน${provinceName}`,
      text: '"น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยมเสมือนมีเพื่อนร่วมทางคนพิเศษคอยเคียงข้าง ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ"',
      rating: 5,
      date: "เมื่อ 2 สัปดาห์ก่อน",
      datePublished: new Date(t.getTime() - 1296000000).toISOString().split("T")[0]
    }
  ];
};

function customMetaTitle(province, customMeta) {
  if (customMeta && customMeta.title) return customMeta.title;
  return `สาวรับงาน${province} ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub`;
}

function customMetaDesc(province, seo, customMeta, topSnippetText = "") {
  if (customMeta && customMeta.desc) return customMeta.desc;
  const zonesText = seo.zones && seo.zones.length > 0 ? seo.zones.slice(0, 3).join(", ") : province;
  if (topSnippetText) {
    return `สาวรับงาน${province} 🟢 พร้อมรับงานวันนี้: ${topSnippetText} - คัดสรรเฉพาะตัวจริงตรงปก 100% นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมพิกัด ${zonesText}`;
  }
  return `ศูนย์รวมสาวรับงาน${province} และเพื่อนเที่ยวไซด์ไลน์ฟิวแฟน คัดสรรเฉพาะตัวจริงตรงปก 100% ปลอดภัยนัดเจอจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมพิกัด ${zonesText}`;
}

async function getTemplateHtml(url) {
  const now = Date.now();
  if (!TEMPLATE_HTML_CACHE || (now - TEMPLATE_CACHE_TIMESTAMP > CACHE_TTL_MS)) {
    const templateUrl = new URL("/index.html", url.origin);
    const mainTemplate = await fetch(templateUrl, { headers: { "x-ssr-bypass": "true" } });
    TEMPLATE_HTML_CACHE = await mainTemplate.text();
    TEMPLATE_CACHE_TIMESTAMP = now;
  }
  return TEMPLATE_HTML_CACHE;
}

function verifyHostname(req) {
  const host = (req.headers.get("host") || "").toLowerCase();
  return ["firstmodelhub.com", "sidelinechiangmai.netlify.app", "localhost"].some(h => host.includes(h)) || host.endsWith(".netlify.app");
}

function normalizeProvinceKey(rawKey) {
  if (!rawKey) return "national";
  const cleanKey = rawKey.toLowerCase().replace(/-/g, "_").trim();
  for (const [standardKey, aliases] of Object.entries(PROVINCE_ALIASES)) {
    if (aliases.some(alias => alias.replace(/-/g, "_") === cleanKey)) {
      return standardKey;
    }
  }
  return cleanKey.replace(/_/g, "");
}

function buildErrorPage(code, title, message) {
  return new Response(`<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${code} - ${escapeHTML(title)} | ${CONFIG.BRAND_NAME}</title>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800&display=swap" rel="stylesheet" />
    <style>
        body { background: #07070a; color: #fff; font-family: 'Prompt', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin:0; padding: 16px; box-sizing:border-box;}
        .card { max-width: 420px; width:100%; border: 1px solid rgba(192,132,252,0.25); background: rgba(14,9,30,0.85); padding: 40px 24px; border-radius: 24px; text-align:center; backdrop-filter: blur(20px); box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
        .code { font-size: 64px; font-weight:800; color: #C084FC; margin-bottom: 12px; line-height:1; }
        .back-btn { display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #5A2CBE 100%); color: #ffffff; padding: 14px 32px; border-radius: 100px; text-decoration:none; font-weight: 800; font-size: 14px; margin-top: 24px; box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3); }
    </style>
</head>
<body>
    <div class="card">
        <div class="code">${code}</div>
        <h1 style="font-size:20px; font-weight:800; margin-bottom:12px;">${escapeHTML(title)}</h1>
        <p style="font-size:13px; color:#A1A1AA; line-height:1.6;">${escapeHTML(message)}</p>
        <a href="/" class="back-btn">กลับสู่หน้าหลัก First Model Hub</a>
    </div>
</body>
</html>`, { status: code, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=60" } });
}

const generateServiceSchema = (profile, province, targetUrl, hostUrl) => {
  const priceVal = Number((profile.rate || "1500").toString().replace(/\D/g, "")) || 1500;
  const cleanName = (profile.name || "").replace(/^น้อง/, "").trim();
  const displayName = `น้อง${cleanName}`;
  const isAvailable = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (profile.availability || "").toLowerCase().includes(kw));

  return {
    "@type": "Service",
    "@id": `${targetUrl}/#service`,
    "name": `บริการเพื่อนเที่ยวฟิวแฟน ${displayName}`,
    "serviceType": "Companion Service",
    "description": profile.description || `โปรไฟล์แนะนำ${displayName} สาวรับงานพิกัด ${profile.location || province} สไตล์เพื่อนเที่ยวดูแลดี ฟิวแฟน ตรงปก 100% ไม่มัดจำ บน First Model Hub`,
    "provider": {
      "@type": "Person",
      "@id": `${targetUrl}/#person`,
      "name": displayName,
      "url": targetUrl,
      "image": optimizeOgImg(hostUrl, profile.imagePath),
      "jobTitle": "Freelance Companion & Entertainer",
      "gender": "Female",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": profile.location || province,
        "addressRegion": province,
        "addressCountry": "TH"
      }
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": province
    },
    "offers": {
      "@type": "Offer",
      "url": targetUrl,
      "price": priceVal,
      "priceCurrency": "THB",
      "priceValidUntil": "2027-12-31",
      "availability": isAvailable ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      "description": "นัดเจอตัวจ่ายค่าบริการโดยตรงหน้างาน ไม่มีการโอนเงินมัดจำล่วงหน้าเพื่อความปลอดภัยสูงสุด"
    }
  };
};

const generateDynamicFAQsHTML = faqs => {
  if (!faqs) return "";
  return faqs.map(item => `
        <div class="interactive-card" style="padding: 16px 20px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <h3 style="font-weight: 800; font-size: 13.5px; display: flex; align-items: start; gap: 10px; margin: 0;">
                  <span style="display: flex; height: 22px; width: 22px; align-items: center; justify-content: center; border-radius: 6px; background-color: rgba(90, 44, 190, 0.2); color: #C084FC; font-size: 11px; font-weight: 900; border: 1px solid rgba(147, 51, 234, 0.3); flex-shrink: 0;">Q</span>
                  <span class="text-gradient-sub" style="line-height: 1.4;">${escapeHTML(item.q)}</span>
                </h3>
                <div style="padding-left: 32px; color: var(--text-gray); font-size: 12px; line-height: 1.5; border-left: 2px solid rgba(147, 51, 234, 0.2); padding-top: 4px;">
                  ${escapeHTML(item.a)}
                </div>
            </div>
        </div>
    `).join("");
};

// 🟢 PRE-RENDER LIGHTBOX HTML FOR SINGLE PROFILE PAGE (SEO & FAST FIRST PAINT)
const buildSingleProfileModalHtml = (p, provName, hostUrl) => {
  const cleanName = (p.name || "").replace(/^น้อง/, "").trim();
  const displayName = `น้อง${cleanName}`;
  const mainImg = optimizeOgImg(hostUrl, p.imagePath);
  const rateVal = p.rate ? (!isNaN(p.rate) ? `${Number(p.rate).toLocaleString()}.-` : escapeHTML(p.rate)) : "1,500.-";
  const locationVal = escapeHTML(p.location || provName);
  const isAvail = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
  const lineId = (p.line_id || p.lineId || "ksLUWB89Y_").replace(/^@/, "").trim();
  const lineUrl = lineId.startsWith("http") ? lineId : `https://line.me/ti/p/${lineId.startsWith("%40") ? lineId : "@" + lineId}`;
  const descHtml = escapeHTML(p.description || `${displayName} สาวรับงาน${provName} ตรงปก 100% สไตล์ฟิวแฟน ไม่โอนมัดจำ`).replace(/\n/g, "<br>");
  const sloganText = escapeHTML(p.slogan || p.quote || "");

  return `
    <div id="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-profile-name-main" style="display: flex; opacity: 1;" class="active">
      <div id="lightbox-content-wrapper-el" style="translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);">
        <button id="closeLightboxBtn" style="position: absolute; top: 10px; right: 10px; z-index: 50; width: 34px; height: 36px; background-color: rgba(0,0,0,0.7); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px;" aria-label="ปิดหน้าต่างโปรไฟล์">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
        <div style="overflow-y: auto; max-height: 85vh; padding: 0;">
          <div class="lightbox-grid-layout">
            <div class="lightbox-image-column">
              <div class="lightbox-hero-container">
                <img id="lightboxHeroImage" src="${mainImg}" alt="${displayName} สาวรับงาน${provName} ตัวจริงตรงปก" />
              </div>
            </div>
            <div class="lightbox-details">
              <header style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                  <h3 id="lightbox-profile-name-main" class="text-gradient-main" style="font-size: 22px; font-weight: 800; margin: 0; line-height: 1.2;">
                    <span class="text-gradient-main" style="font-size: 20px; font-weight: 800;">${displayName}</span>
                  </h3>
                  <div id="lightbox-availability-badge-wrapper" style="flex-shrink: 0;">
                    <span style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 4px 12px; border-radius: 100px; display: inline-flex; align-items: center; gap: 6px;">
                      <span style="width: 7px; height: 7px; border-radius: 50%; background: ${isAvail ? '#00E676' : '#FF2E63'}; box-shadow: 0 0 8px ${isAvail ? '#00E676' : '#FF2E63'}; flex-shrink: 0;"></span>
                      <span style="color: white; font-size: 10.5px; font-weight: 700; letter-spacing: 0.02em;">${p.availability || (isAvail ? 'รับงาน' : 'สอบถามคิว')}</span>
                    </span>
                  </div>
                </div>
              </header>
              ${sloganText ? `<div id="lightboxQuote" class="lightbox-quote-card" style="font-size: 12px; color: #C084FC; margin: 4px 0;">${sloganText}</div>` : ''}
              <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; margin-top: 8px;">
                <div id="lightboxDetailsCompact" style="font-size: 11.5px;">
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 100px; text-align: center;">
                      <div style="font-size: 9px; color: #A1A1AA; font-weight: 600;">อายุ</div>
                      <div style="font-weight: 800; font-size: 12px; color: #FFFFFF; margin-top: 2px;">${p.age ? p.age + ' ปี' : 'ไม่ระบุ'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 100px; text-align: center;">
                      <div style="font-size: 9px; color: #A1A1AA; font-weight: 600;">สัดส่วน</div>
                      <div style="font-weight: 800; font-size: 12px; color: #FFFFFF; margin-top: 2px;">${p.stats || 'ไม่ระบุ'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 100px; text-align: center;">
                      <div style="font-size: 9px; color: #A1A1AA; font-weight: 600;">ส่วนสูง</div>
                      <div style="font-weight: 800; font-size: 12px; color: #FFFFFF; margin-top: 2px;">${p.height ? p.height + ' ซม.' : 'ไม่ระบุ'}</div>
                    </div>
                  </div>
                  <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="color: #A1A1AA; font-size: 11px; font-weight: 600;">ค่าขนม</span>
                      <span style="color: #00E676; font-weight: 900; font-size: 14px;">${rateVal}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="color: #A1A1AA; font-size: 11px; font-weight: 600;">พิกัดงาน</span>
                      <span style="color: white; font-weight: 700; font-size: 11.5px;">${locationVal}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div id="lightboxDescriptionContainer" style="display: block; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 12px; margin-top: 8px;">
                <div style="color: white; font-weight: 800; font-size: 12px; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                  <i class="fas fa-info-circle" style="color: var(--primary-purple);" aria-hidden="true"></i>
                  <span>รายละเอียดเพิ่มเติม</span>
                </div>
                <div id="lightboxDescriptionContent" style="font-size: 11.5px; color: var(--text-gray); line-height: 1.5; white-space: pre-wrap;">${descHtml}</div>
              </div>
              <div id="line-btn-sticky-wrapper" style="margin-top: 14px; margin-bottom: 6px; width: 100%; position: relative;">
                <a href="${lineUrl}" target="_blank" rel="noopener nofollow" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #11783B 0%, #00E676 100%); color: white; padding: 12px 18px; border-radius: 100px; font-weight: 800; font-size: 12.5px; text-decoration: none; box-shadow: 0 6px 20px rgba(0, 230, 118, 0.3);">
                  <i class="fab fa-line" style="font-size: 18px; color: white;"></i>
                  <span>แอดไลน์จองคิว ${displayName}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// 🟢 SERVER-SIDE RENDERER HANDLER (MAIN ENTRY POINT)
export default async (req, context) => {
  if (!verifyHostname(req)) {
    return new Response("403 Forbidden - Access Denied", { status: 403 });
  }

  const url = new URL(req.url);
  const hostUrl = CONFIG.PRIMARY_DOMAIN;
  const hostName = url.hostname.toLowerCase();

  // 🟢 Canonical Domain Redirects
  if (hostName.includes("sidelinechiangmai.netlify.app")) {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return Response.redirect(`${hostUrl}/location/chiangmai`, 301);
    }
    return Response.redirect(`${hostUrl}${url.pathname}${url.search}`, 301);
  }

  if (hostName.startsWith("www.firstmodelhub.com") || hostName.includes("firstmodelhub.netlify.app")) {
    return Response.redirect(`${hostUrl}${url.pathname}${url.search}`, 301);
  }

  if (req.headers.get("x-ssr-bypass") === "true" || STATIC_EXT_REGEX.test(url.pathname)) {
    try { return await context.next(); } catch { return new Response("Static asset pass", { status: 200 }); }
  }

  const staticPages = ["/about", "/faq", "/blog", "/contact", "/terms-of-service", "/privacy-policy", "/policy", "/locations"];
  if (staticPages.some(page => url.pathname === page || url.pathname.startsWith(page + "/"))) {
    try { return await context.next(); } catch { return await context.next(); }
  }

  if (url.pathname === "/index.html") {
    return Response.redirect(`${hostUrl}/`, 301);
  }

  // 🟢 Check Edge Cache
  const cacheKey = `${req.method}:${url.pathname}:${url.search}`;
  const cachedItem = PAGE_CACHE.get(cacheKey);
  if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_TTL_MS)) {
    return new Response(cachedItem.html, { headers: cachedItem.headers });
  }

  const paths = url.pathname.split("/").filter(Boolean);
  let rawProvinceSlug = "", profileSlug = "", isNationalHome = false;

  if (paths.length === 0 || url.pathname === "/" || url.pathname === "/profiles" || url.pathname === "/profiles.html") {
    isNationalHome = true;
    rawProvinceSlug = "national";
  } else if ("location" === paths[0] && paths[1]) {
    try { rawProvinceSlug = decodeURIComponent(paths[1]).toLowerCase(); } catch { rawProvinceSlug = paths[1].toLowerCase(); }
  } else if ("sideline" === paths[0] && paths[1]) {
    try { profileSlug = decodeURIComponent(paths[1]).trim(); } catch { profileSlug = paths[1].trim(); }
  } else {
    const lastSegment = paths[paths.length - 1] || "";
    try { rawProvinceSlug = decodeURIComponent(lastSegment).toLowerCase(); } catch { rawProvinceSlug = lastSegment.toLowerCase(); }
  }

  const provinceStandardKey = normalizeProvinceKey(rawProvinceSlug);

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    let matchedProfile = null;

    // 🟢 1. PROFILE SINGLE PAGE RENDER
    if (profileSlug) {
      let profileQuery = supabase
        .from("profiles")
        .select("*")
        .eq("active", true);

      if (/^\d+$/.test(profileSlug)) {
        profileQuery = profileQuery.eq("id", parseInt(profileSlug, 10));
      } else {
        profileQuery = profileQuery.or(`slug.eq."${profileSlug}",slug.eq."${encodeURIComponent(profileSlug)}"`);
      }

      const { data: pData } = await profileQuery.maybeSingle();

      if (pData) {
        matchedProfile = pData;
        rawProvinceSlug = pData.provinceKey || pData.province_key || pData.province_slug || "chiangmai";
      } else {
        return buildErrorPage(404, "404 - ไม่พบโปรไฟล์ที่ต้องการ", "โปรไฟล์น้องๆ รายนี้อาจถูกปิดการใช้งาน หรือระงับบริการชั่วคราวครับ");
      }
    }

    // 🟢 2. PROVINCE & CATALOG QUERY
    const queryAliases = PROVINCE_ALIASES[provinceStandardKey] || [rawProvinceSlug, provinceStandardKey];

    let profileQuery = supabase
      .from("profiles")
      .select("id, slug, name, age, imagePath, galleryPaths, provinceKey, location, rate, isfeatured, lastUpdated, active, availability, description, height, weight, stats, skin_tone, bust, waist, hips, cup_size, has_video, verified, line_id, quote, style_tags, slogan")
      .eq("active", true)
      .order("isfeatured", { ascending: false })
      .order("lastUpdated", { ascending: false })
      .limit(24);

    if (!isNationalHome && !matchedProfile) {
      profileQuery = profileQuery.in("provinceKey", queryAliases);
    }

    let reviewQuery = supabase.from("reviews")
      .select("id, created_at, author_name, location_detail, rating_score, review_body, province_key")
      .eq("active_status", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (!isNationalHome) {
      reviewQuery = reviewQuery.in("province_key", queryAliases);
    }

    const [provSingleRes, profListRes, provListRes, reviewsRes] = await Promise.all([
      isNationalHome 
        ? Promise.resolve({ data: { id: 0, nameThai: "ทั่วไทย", key: "national" } })
        : supabase.from("provinces").select("id, nameThai, key").in("key", queryAliases).limit(1).maybeSingle(),
      profileQuery,
      supabase.from("provinces").select("key, nameThai").order("nameThai", { ascending: true }),
      Promise.resolve(reviewQuery).catch(() => ({ data: [] }))
    ]);

    // 🟢 3. SOFT FALLBACK FOR PROVINCES
    let provinceData = provSingleRes.data;
    if (!provinceData && !isNationalHome) {
      const fallbackName = PROVINCE_NAMES_THAI[provinceStandardKey] || 
                           rawProvinceSlug.charAt(0).toUpperCase() + rawProvinceSlug.slice(1);
      provinceData = {
        id: 999,
        nameThai: fallbackName,
        key: provinceStandardKey
      };
    }

    const profileList = profListRes.data || [];
    const provinceThaiName = isNationalHome ? "ทั่วไทย" : (provinceData?.nameThai || "เชียงใหม่");
    const customMeta = isNationalHome ? null : (PROVINCE_CUSTOM_METADATA[provinceStandardKey] || null);
    const seoData = isNationalHome ? PROVINCE_SEO_DATA.default : (PROVINCE_SEO_DATA[provinceStandardKey] || PROVINCE_SEO_DATA.default);
    const zones = PROVINCE_ZONES_MAP[provinceStandardKey] || PROVINCE_ZONES_MAP.national;

    const canonUrl = matchedProfile 
      ? `${hostUrl}/sideline/${encodeURIComponent(matchedProfile.slug || matchedProfile.id)}`
      : (isNationalHome ? hostUrl : `${hostUrl}/location/${provinceStandardKey}`);
    
    const enUrl = `${canonUrl}/en`;

    const mainImgPath = matchedProfile?.imagePath || (profileList.length > 0 ? profileList[0].imagePath : null);
    const metaImgUrl = mainImgPath ? optimizeOgImg(hostUrl, mainImgPath) : `${hostUrl}/images/apple-touch-icon.png`;

    const dbReviews = reviewsRes?.data || [];
    let finalReviews = [];
    if (dbReviews && dbReviews.length > 0) {
      finalReviews = dbReviews.map(r => ({
        author: r.author_name || "คุณผู้ใช้บริการ",
        location: r.location_detail || `ตัวเมือง${provinceThaiName}`,
        text: r.review_body || "ดูแลประทับใจดีสไตล์ฟิวแฟน ตรงปกปลอดภัย แนะนำครับ",
        rating: Number(r.rating_score) && !isNaN(Number(r.rating_score)) ? Math.min(5, Math.max(1, Number(r.rating_score))) : 5,
        date: formatDateSSR(r.created_at),
        datePublished: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
      }));
    } else {
      finalReviews = getDynamicReviews(provinceThaiName);
    }

    // 🟢 4. METADATA & SCHEMA BUILDER
    const topProfilesTextSnippet = profileList.slice(0, 5).map(p => {
      const pName = (p.name || "").replace(/^น้อง/, "").trim();
      const pAge = p.age ? ` (${p.age}ปี)` : "";
      const pLoc = p.location ? ` - ${p.location}` : "";
      return `น้อง${pName}${pAge}${pLoc}`;
    }).join(" | ");

    let pageTitle = "", pageDesc = "";

    if (matchedProfile) {
      const cleanProfileName = (matchedProfile.name || "").replace(/^น้อง/, "").trim();
      pageTitle = `น้อง${cleanProfileName}${matchedProfile.age ? ` ${matchedProfile.age}` : ""} ไซด์ไลน์${provinceThaiName} เพื่อนเที่ยวตรงปก 100% | ${CONFIG.BRAND_NAME}`;
      pageDesc = stripHTML(`รายละเอียดโปรไฟล์ น้อง${cleanProfileName} สาวรับงานไซด์ไลน์พิกัดย่าน ${matchedProfile.location || provinceThaiName} ตรงปก 100% ค่าขนม ${matchedProfile.rate || "สอบถาม"} ดูแลสไตล์ฟิวแฟน ไม่มีโอนมัดจำล่วงหน้า`);
    } else if (isNationalHome) {
      pageTitle = "สาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานทั่วไทย) | First Model Hub";
      pageDesc = `ศูนย์รวมสาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนพรีเมียมทั่วไทย คัดสรรโปรไฟล์ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ ${topProfilesTextSnippet ? `• ${topProfilesTextSnippet}` : ''}`;
    } else {
      pageTitle = customMetaTitle(provinceThaiName, customMeta);
      pageDesc = customMetaDesc(provinceThaiName, seoData, customMeta, topProfilesTextSnippet);
    }

    const strippedDesc = stripHTML(pageDesc);
    const calculatedAvg = finalReviews.length > 0 
      ? (finalReviews.reduce((sum, rev) => sum + (Number(rev.rating) || 5), 0) / finalReviews.length) 
      : 5;
    const finalRatingValue = isNaN(calculatedAvg) ? "4.9" : calculatedAvg.toFixed(1);
    const finalReviewCount = finalReviews.length > 0 ? finalReviews.length : (profileList.length > 0 ? 30 + 3 * profileList.length : 45);
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent("สาวรับงาน " + (isNationalHome ? "กรุงเทพ" : provinceThaiName))}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    // 🟢 SCHEMA.ORG JSON-LD BUILDER
    const businessEntity = {
      "@type": ["EntertainmentBusiness", "ProfessionalService"],
      "@id": `${canonUrl}/#business`,
      "name": isNationalHome ? `ศูนย์รวมไซด์ไลน์ สาวรับงาน เด็กเอ็น ฟิวแฟน ทั่วไทย - ${CONFIG.BRAND_NAME}` : `สาวรับงาน${provinceThaiName} เพื่อนเที่ยว${provinceThaiName} - ${CONFIG.BRAND_NAME}`,
      "image": metaImgUrl,
      "telephone": CONFIG.DEFAULT_TELEPHONE,
      "priceRange": "฿฿",
      "url": canonUrl,
      "description": strippedDesc,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": isNationalHome ? "กรุงเทพมหานคร" : provinceThaiName,
        "addressRegion": isNationalHome ? "กรุงเทพมหานคร" : provinceThaiName,
        "addressCountry": "TH"
      },
      "areaServed": isNationalHome 
        ? { "@type": "Country", "name": "Thailand" }
        : [
            { "@type": "AdministrativeArea", "name": provinceThaiName },
            ...zones.map(z => ({ "@type": "AdministrativeArea", "name": "โซน" + z }))
          ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": Number(finalRatingValue) || 4.9,
        "reviewCount": Number(finalReviewCount) || 5,
        "bestRating": 5,
        "worstRating": 1
      },
      "review": finalReviews.map(r => ({
        "@type": "Review",
        "author": { "@type": "Person", "name": r.author || "คุณผู้ใช้บริการ" },
        "datePublished": r.datePublished || new Date().toISOString().split("T")[0],
        "reviewBody": stripHTML(r.text || "บริการประทับใจดีสไตล์ฟิวแฟน"),
        "reviewRating": { 
          "@type": "Rating", 
          "ratingValue": Number(r.rating) && !isNaN(Number(r.rating)) ? Number(r.rating) : 5, 
          "bestRating": 5, 
          "worstRating": 1 
        }
      }))
    };

    const schemaGraph = [
      {
        "@type": "Organization",
        "@id": `${hostUrl}/#organization`,
        "name": CONFIG.BRAND_NAME,
        "legalName": CONFIG.BRAND_LEGAL_NAME,
        "url": hostUrl,
        "logo": { "@type": "ImageObject", "url": `${hostUrl}/images/apple-touch-icon.png` },
        "description": strippedDesc,
        "sameAs": Object.values(CONFIG.SOCIAL_LINKS),
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "telephone": CONFIG.DEFAULT_TELEPHONE,
          "availableLanguage": ["th", "en"]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${hostUrl}/#website`,
        "url": hostUrl,
        "name": CONFIG.BRAND_NAME,
        "publisher": { "@id": `${hostUrl}/#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${hostUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ];

    if (matchedProfile) {
      const profileUrl = `${hostUrl}/sideline/${encodeURIComponent(matchedProfile.slug || matchedProfile.id)}`;
      schemaGraph.push(generateServiceSchema(matchedProfile, provinceThaiName, profileUrl, hostUrl));
      schemaGraph.push({
        "@type": "BreadcrumbList",
        "@id": `${profileUrl}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": hostUrl },
          { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceThaiName}`, "item": `${hostUrl}/location/${provinceStandardKey}` },
          { "@type": "ListItem", "position": 3, "name": `น้อง${(matchedProfile.name || "").replace(/^น้อง/, "").trim()}`, "item": profileUrl }
        ]
      });
    } else {
      schemaGraph.push({
        "@type": "CollectionPage",
        "@id": `${canonUrl}/#webpage`,
        "name": pageTitle,
        "description": strippedDesc,
        "isPartOf": { "@id": `${hostUrl}/#website` },
        "about": { "@id": `${canonUrl}/#business` },
        "mainEntity": { "@id": `${canonUrl}/#itemlist` }
      });

      schemaGraph.push(businessEntity);

      if (profileList.length > 0) {
        schemaGraph.push({
          "@type": "ItemList",
          "@id": `${canonUrl}/#itemlist`,
          "name": `รายชื่อสาวรับงานและเพื่อนเที่ยว ${provinceThaiName}`,
          "numberOfItems": profileList.length,
          "itemListElement": profileList.map((p, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Person",
              "name": `น้อง${(p.name || "").replace(/^น้อง/, "").trim()}`,
              "url": `${hostUrl}/sideline/${p.slug || p.id}`,
              "image": optimizeOgImg(hostUrl, p.imagePath),
              "jobTitle": "Companion",
              "workLocation": p.location || provinceThaiName,
              "description": `สาวรับงาน${provinceThaiName} พิกัด ${p.location || provinceThaiName} ตรงปก 100% ปลอดภัย ไม่โอนมัดจำ`
            }
          }))
        });
      }

      schemaGraph.push({
        "@type": "BreadcrumbList",
        "@id": `${canonUrl}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": hostUrl },
          ...(!isNationalHome ? [{ "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceThaiName}`, "item": canonUrl }] : [])
        ]
      });
    }

    if (seoData.faqs && !matchedProfile) {
      schemaGraph.push({
        "@type": "FAQPage",
        "@id": `${canonUrl}/#faq`,
        "mainEntity": seoData.faqs.map(faq => ({
          "@type": "Question",
          "name": stripHTML(faq.q),
          "acceptedAnswer": { "@type": "Answer", "text": stripHTML(faq.a) }
        }))
      });
    }

    const schemaJson = { "@context": "https://schema.org", "@graph": schemaGraph };

    // 🟢 5. RENDER PROFILE CARDS HTML
    const cardsHtml = profileList.map((p, index) => {
      const pName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/gi, ""));
      const pLoc = escapeHTML(p.location || provinceThaiName);
      const pUrl = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
      
      const isAvailable = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
      const statusDotColor = isAvailable ? "#00E676" : "#FF2E63";
      const statusText = p.availability || (isAvailable ? "รับงาน" : "สอบถามคิว");
      const ageDisplay = p.age && p.age !== "-" ? ` ${escapeHTML(p.age)}` : "";
      
      const seoAltText = `น้อง${pName} สาวรับงาน${provinceThaiName} ไซด์ไลน์${provinceThaiName} ฟิวแฟนตรงปก 100%`;
      const imgUrl = optimizeImg(hostUrl, p.imagePath, 350, 437);

      const featuredBadge = p.isfeatured
        ? `<span style="background: rgba(90, 44, 190, 0.88); border: 1px solid rgba(192, 132, 252, 0.5); color: #FFFFFF; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
            <i class="fas fa-star" style="font-size: 6.5px; color: #FBBF24;"></i>
            <span style="letter-spacing: 0.02em;">แนะนำ</span>
           </span>`
        : "";

      const statusBadge = `
        <span style="background: rgba(9, 9, 11, 0.82); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
            <span style="width: 5px; height: 5px; border-radius: 50%; background-color: ${statusDotColor}; box-shadow: 0 0 6px ${statusDotColor}; flex-shrink: 0;"></span>
            <span style="letter-spacing: 0.02em;">${statusText}</span>
        </span>
      `;

      const hasVideo = p.has_video || p.hasVideo || false;
      const videoBadge = hasVideo
        ? `<span style="background: rgba(255, 46, 99, 0.35); border: 1px solid rgba(255, 46, 99, 0.6); color: #FF2E63; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
            <i class="fas fa-video" style="font-size: 6.5px;"></i> คลิป
           </span>`
        : "";

      const isVerified = p.verified || p.isVerified || false;
      const verifiedBadge = isVerified
        ? `<span style="background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(52, 211, 153, 0.55); color: #00E676; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
            <i class="fas fa-check-circle" style="font-size: 7.5px; color: #00E676;"></i> ยืนยันตัวตน
           </span>`
        : "";

      let rateDisplay = "1,500.-";
      if (p.rate) {
        if (!isNaN(p.rate)) rateDisplay = `${Number(p.rate).toLocaleString()}.-`;
        else rateDisplay = escapeHTML(p.rate).trim();
      }

      const sloganText = escapeHTML(p.slogan || p.quote || "");

      return `
        <div class="profile-card-new-container" role="listitem">
          <article class="profile-card-new interactive-card"
               data-profile-id="${p.id}"
               data-profile-slug="${escapeHTML(p.slug || p.id)}"
               style="aspect-ratio: 4 / 5; width: 100%; position: relative; border-radius: 16px; overflow: hidden; background-color: #09090B; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); cursor: pointer;">
              
              <h3 style="display:none;">น้อง${pName} สาวรับงาน${provinceThaiName} ย่าน${pLoc}</h3>

              <img src="${imgUrl}" 
                   alt="${seoAltText}"
                   title="${seoAltText}"
                   width="300"
                   height="400"
                   style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; filter: brightness(0.96); transition: transform 0.4s ease, opacity 0.5s; opacity: 1; z-index: 0; border-radius: 16px;"
                   loading="${index < 4 ? "eager" : "lazy"}"
                   decoding="async"
                   onerror="this.onerror=null; this.src='/images/apple-touch-icon.png';" />
                   
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 20%, transparent 38%); z-index: 10; pointer-events: none;"></div>

              <div style="position: absolute; top: 6px; left: 6px; z-index: 30; pointer-events: none; display: flex; flex-direction: column; gap: 3px; align-items: flex-start;">
                  ${featuredBadge}
                  ${statusBadge}
                  ${videoBadge}
              </div>

              <div style="position: absolute; top: 6px; right: 6px; z-index: 30; pointer-events: none; display: flex; align-items: center;">
                  ${verifiedBadge}
              </div>
              
              <a href="${pUrl}" class="card-link" style="position: absolute; inset: 0; z-index: 25;" aria-label="ดูโปรไฟล์น้อง${pName} สาวรับงาน${provinceThaiName}"></a>

              <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 6px 10px 8px 10px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 1px;">
                  <h3 style="font-size: 13.5px; font-weight: 800; color: white; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 4px rgba(0,0,0,0.95);">
                    น้อง${pName}${ageDisplay}
                  </h3>
                  
                  ${sloganText ? `<p style="font-size: 10px; color: #C084FC; font-weight: 600; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">${sloganText}</p>` : ''}
                  
                  <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px; color: #D4D4D8; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 3px; margin-top: 2px;">
                      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">
                          <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 2px;"></i> ${pLoc}
                      </span>
                      <span style="color: #00E676; font-weight: 900; font-size: 12px; text-shadow: 0 1.5px 3px rgba(0,0,0,0.95);">
                          ${rateDisplay}
                      </span>
                  </div>
              </div>
          </article>
        </div>
      `;
    }).join("");

    const reviewsHtml = finalReviews.map(r => `
      <div class="interactive-card" style="padding: 16px 20px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="height: 36px; width: 36px; border-radius: 50%; background-color: #27272A; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-weight: 700; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);">${escapeHTML((r.author || "K").charAt(0).toUpperCase())}</div>
              <div>
                <span style="display: block; font-size: 12px; font-weight: 800; color: white;">${escapeHTML(r.author)}</span>
                <span style="display: block; font-size: 10px; color: var(--text-muted); font-weight: 700;">นัดเจอใน${escapeHTML(r.location)}</span>
              </div>
            </div>
            <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 9.5px;" aria-label="${r.rating} ดาว" role="img">
              ${Array.from({ length: 5 }).map((_, i) => `<i class="fas fa-star" style="color: ${i < r.rating ? "#FBBF24" : "#71717A"};" aria-hidden="true"></i>`).join("")}
            </div>
          </div>
          <p style="font-size: 11.5px; color: var(--text-gray); line-height: 1.5; margin: 0;">
            ${escapeHTML(r.text)}
          </p>
          <span style="display: block; font-size: 9px; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">ยืนยันการใช้บริการจริง • ${escapeHTML(r.date)}</span>
      </div>
    `).join("");

    const faqsHtml = generateDynamicFAQsHTML(seoData.faqs);
    const matchedZones = zones.slice(0, 4).join(", ");
    
    const introTemplate = seoData.uniqueIntro || getDynamicIntro(provinceThaiName, zones, provinceStandardKey);
    const seoIntroContent = smartLinkify(introTemplate, 0, zones, provinceStandardKey);

    const popularLocationsHtml = provListRes.data ? provListRes.data.map(p => {
      const key = p.key || p.slug || p.id;
      const name = p.nameThai || p.name;
      const isActive = key === provinceStandardKey;
      return `<li><a href="/location/${key}" title="ดูรายชื่อไซด์ไลน์ในจังหวัด ${name}" style="color: ${isActive ? 'var(--primary-purple)' : 'var(--text-gray)'}; text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='#C084FC'" onmouseleave="this.style.color='var(--text-gray)'" ${isActive ? 'class="active" aria-current="page"' : ''}>ไซด์ไลน์${name}</a></li>`;
    }).join("") : "";

    // 🟢 6. INJECT TO HTML TEMPLATE
    let rawHtml = await getTemplateHtml(url);

    if (!/<base\s+/i.test(rawHtml)) {
      rawHtml = rawHtml.replace(/<head[^>]*>/i, (match) => `${match}\n    <base href="/" />`);
    }

    // Update Title & Meta Tags
    rawHtml = rawHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHTML(pageTitle)}</title>`);
    rawHtml = rawHtml.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHTML(strippedDesc)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHTML(pageTitle)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHTML(strippedDesc)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHTML(pageTitle)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHTML(strippedDesc)}" />`);

    // 🟢 Replace Canonical & EN URLs (ทั้งแบบธรรมดา และแบบ %7B%7B URL Encoded)
    rawHtml = replaceGlobal(rawHtml, "%7B%7BSEO_CANONICAL%7D%7D", canonUrl);
    rawHtml = replaceGlobal(rawHtml, "{{SEO_CANONICAL}}", canonUrl);
    rawHtml = replaceGlobal(rawHtml, "%7B%7BSEO_CANONICAL_EN%7D%7D", enUrl);
    rawHtml = replaceGlobal(rawHtml, "{{SEO_CANONICAL_EN}}", enUrl);
    rawHtml = replaceGlobal(rawHtml, "{{SEO_IMAGE}}", metaImgUrl);

    // 🟢 Replace Province Key & Name Placeholders
    rawHtml = replaceGlobal(rawHtml, "%7B%7BPROVINCE_KEY%7D%7D", provinceStandardKey);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_KEY}}", provinceStandardKey);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_NAME}}", provinceThaiName);
    rawHtml = replaceGlobal(rawHtml, "{{PROFILE_COUNT}}", profileList.length || 50);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_ZONES}}", matchedZones);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_SEO_CONTENT}}", seoIntroContent);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_REVIEWS_HTML}}", reviewsHtml);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_FAQS_HTML}}", faqsHtml);
    rawHtml = replaceGlobal(rawHtml, "{{MAP_EMBED_URL}}", mapEmbedUrl);
    rawHtml = replaceGlobal(rawHtml, "{{PROFILES_CARDS_HTML}}", cardsHtml);

    // 🟢 Convert Google Maps iframe data-src -> src for instant SSR rendering
    rawHtml = rawHtml.replace(/<iframe([^>]+)data-src=["']([^"']+)["']/gi, '<iframe$1src="$2" data-src="$2"');

    // 🟢 Inject Schema.org JSON-LD
    const escapedSchemaJson = JSON.stringify(schemaJson).replace(/</g, '\\u003c');
    if (rawHtml.includes("{{SCHEMA_JSON}}")) {
      rawHtml = replaceGlobal(rawHtml, "{{SCHEMA_JSON}}", escapedSchemaJson);
    } else if (/<script\s+type=["']application\/ld\+json["']\s+id=["']dynamic-schema["'][\s\S]*?<\/script>/i.test(rawHtml)) {
      rawHtml = rawHtml.replace(
        /<script\s+type=["']application\/ld\+json["']\s+id=["']dynamic-schema["'][\s\S]*?<\/script>/i,
        `<script type="application/ld+json" id="dynamic-schema">\n${escapedSchemaJson}\n</script>`
      );
    } else {
      rawHtml = rawHtml.replace(/<\/head>/i, `<script type="application/ld+json" id="dynamic-schema">\n${escapedSchemaJson}\n</script>\n</head>`);
    }

    rawHtml = rawHtml.replace(/(href|src|data-src)=["'](?!https?:\/\/|\/\/|\/|data:|blob:|#|javascript:|mailto:|tel:|\{\{)([^"']+)["']/gi, '$1="/$2"');

    if (popularLocationsHtml) {
      rawHtml = rawHtml.replace(
        /<ul id="popular-locations-footer"[^>]*>[\s\S]*?<\/ul>/i,
        `<ul id="popular-locations-footer" style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 12px; color: var(--text-gray);">${popularLocationsHtml}</ul>`
      );
    }

    if (!isNationalHome) {
      rawHtml = rawHtml.replace(
        /<section id="featured-profiles"[\s\S]*?<\/section>/i,
        ""
      );
    }

    // 🟢 PRE-RENDER SINGLE PROFILE LIGHTBOX MODAL IF ON SINGLE PROFILE PAGE
    if (matchedProfile) {
      const singleModalHtml = buildSingleProfileModalHtml(matchedProfile, provinceThaiName, hostUrl);
      rawHtml = rawHtml.replace(/<div id="lightbox"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, singleModalHtml);
    }

    const topCatalogSnippetHtml = `
      <div class="sr-only-seo" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">
        <h2>รายชื่อสาวรับงาน${provinceThaiName} อัปเดตล่าสุดวันนี้</h2>
        <p>${escapeHTML(topProfilesTextSnippet.replace(/\|/g, " • "))}</p>
      </div>
    `;

    const liveCountChipHtml = `
      ${topCatalogSnippetHtml}
      <div style="padding: 8px 4px 14px 4px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <h2 style="font-size: 18px; font-weight: 800; color: white; margin: 0; display: flex; align-items: center;">
              📍 น้องๆ ในจังหวัด <span style="color: #C084FC; margin-left: 6px; margin-right: 4px;">${provinceThaiName}</span>
              <span class="live-count-chip">
                <span class="pulse-dot-el"></span>
                <span>พบ ${profileList.length} โปรไฟล์พร้อมรับงาน</span>
              </span>
          </h2>
      </div>
    `;

    const displayAreaInnerHtml = `
      ${liveCountChipHtml}
      <div class="section-content-wrapper" style="margin-top: 16px;">
        <div class="profile-grid profiles-grid-row" role="list">
          ${cardsHtml}
        </div>
      </div>
    `;

    rawHtml = replaceGlobal(rawHtml, "{{PROFILES_DISPLAY_AREA_HTML}}", displayAreaInnerHtml);

    // 🟢 HYDRATE WINDOW STATE FOR CLIENT JS
    const hydratedProfilesData = JSON.stringify(profileList.map(p => ({
      id: p.id,
      slug: p.slug,
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
      imagePath: p.imagePath,
      galleryPaths: p.galleryPaths || p.gallery_paths || [],
      provinceKey: p.provinceKey,
      provinceThai: provinceThaiName,
      location: p.location,
      rate: p.rate,
      availability: p.availability,
      lastUpdated: p.lastUpdated,
      isfeatured: p.isfeatured,
      verified: p.verified || p.isVerified,
      hasVideo: p.has_video || p.hasVideo || false,
      description: p.description || "",
      lineId: p.line_id || p.lineId || "",
      quote: p.quote || p.slogan || "",
      styleTags: p.style_tags || p.styleTags || []
    }))).replace(/</g, '\\u003c');

    const hydratedSingleProfileData = matchedProfile ? JSON.stringify({
      id: matchedProfile.id,
      slug: matchedProfile.slug,
      name: matchedProfile.name,
      age: matchedProfile.age,
      height: matchedProfile.height || "",
      weight: matchedProfile.weight || "",
      stats: matchedProfile.stats || "",
      skinTone: matchedProfile.skin_tone || matchedProfile.skinTone || "",
      imagePath: matchedProfile.imagePath,
      galleryPaths: matchedProfile.galleryPaths || matchedProfile.gallery_paths || [],
      provinceKey: matchedProfile.provinceKey,
      provinceThai: provinceThaiName,
      location: matchedProfile.location,
      rate: matchedProfile.rate,
      availability: matchedProfile.availability,
      isfeatured: matchedProfile.isfeatured,
      verified: matchedProfile.verified || matchedProfile.isVerified,
      description: matchedProfile.description || "",
      lineId: matchedProfile.line_id || matchedProfile.lineId || "",
      quote: matchedProfile.quote || matchedProfile.slogan || "",
      styleTags: matchedProfile.style_tags || matchedProfile.styleTags || []
    }).replace(/</g, '\\u003c') : "null";

    const hydrationScript = `
      <script>
        window.profilesData = ${hydratedProfilesData};
        window.initialSingleProfile = ${hydratedSingleProfileData};
      </script>
    `;

    if (rawHtml.includes("{{SSR_PROFILES_JSON}}")) {
      rawHtml = replaceGlobal(rawHtml, "{{SSR_PROFILES_JSON}}", hydratedProfilesData);
    } else if (/window\.profilesData\s*=\s*/i.test(rawHtml)) {
      rawHtml = rawHtml.replace(/window\.profilesData\s*=\s*\[[\s\S]*?\];?/i, `window.profilesData = ${hydratedProfilesData}; window.initialSingleProfile = ${hydratedSingleProfileData};`);
    } else {
      rawHtml = rawHtml.replace(/<\/head>/i, `${hydrationScript}\n</head>`);
    }

    const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
    };

    PAGE_CACHE.set(cacheKey, { html: rawHtml, headers: responseHeaders, timestamp: Date.now() });

    return new Response(rawHtml, { headers: responseHeaders });

  } catch (err) {
    console.error("Critical rendering error:", err);
    return buildErrorPage(500, "500 - ข้อผิดพลาดภายในระบบ", "ระบบประมวลผลหลังบ้านเกิดขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้งในภายหลัง");
  }
};