/**
 * [ SYSTEM SSR PROVINCE CORE - PROD-READY ULTRA-OPTIMIZED 2026 ]
 * Project: First Model Hub - Serverless SSR Handler
 * Features: Auto-Repair Thai Typos, Schema Rich-Snippets Fix, Full Hydration Injection, Loop-Safe
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const PAGE_CACHE = new Map();
const PAGE_CACHE_TTL_MS = 10 * 60 * 1000;

let TEMPLATE_HTML_CACHE = null;
let TEMPLATE_CACHE_TIMESTAMP = 0;
const TEMPLATE_CACHE_TTL_MS = 10 * 60 * 1000;

const STATIC_EXT_REGEX = /\.(css|js|png|jpg|jpeg|webp|avif|svg|ico|json|webmanifest|map|woff|woff2|ttf)$/i;

const CONFIG = {
  get SUPABASE_URL() {
    try { return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co"; } catch { return "https://zxetzqwjaiumqhrpumln.supabase.co"; }
  },
  get SUPABASE_KEY() {
    try { return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; } catch { return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
  },
  PRIMARY_DOMAIN: "https://firstmodelhub.com",
  BRAND_NAME: "First Model Hub",
  BRAND_LEGAL_NAME: "First Model Hub Co., Ltd.",
  DEFAULT_OG_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp",
  
  // 🟢 แก้ไข: ใช้รูปแบบเบอร์สากลเพื่อให้ผ่าน Schema.org Validation
  DEFAULT_TELEPHONE: "+6620000000",
  DISPLAY_LINE_ID: "LINE: @firstmodelhub",
  SOCIAL_LINKS: {
    line: "https://line.me/ti/p/ksLUWB89Y_",
    tiktok: "https://tiktok.com/@firstmodelhub",
    twitter: "https://twitter.com/firstmodelhub",
    linkedin: "https://www.linkedin.com/in/cuteti-sexythailand-398567280",
    biosite: "https://bio.site/firstmodelhub",
    linktr: "https://linktr.ee/firstmodelhub",
    bluesky: "https://bsky.app/profile/firstmodelhub.bsky.social"
  }
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
  udon: {
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
  },
  khonkaen: {
    title: "สาวรับงานขอนแก่น ไซด์ไลน์ขอนแก่น ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานขอนแก่น และเพื่อนเที่ยวไซด์ไลน์พรีเมียม สไตล์ฟิวแฟน คัดสรรโปรไฟล์ตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมย่านในตัวเมืองขอนแก่น"
  },
  phuket: {
    title: "สาวรับงานภูเก็ต ไซด์ไลน์ภูเก็ต ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานภูเก็ต ป่าตอง และเพื่อนเที่ยวพรีเมียม สไตล์ฟิวแฟน คัดสรรโปรไฟล์ตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ"
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

// 🟢 FIX: ปรับ Regex คำสะกดผิดให้เจาะจง ไม่ให้กระทบคำอื่น
function sanitizeThaiText(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/นิมาน/g, "นิมมาน")
    .replace(/นิทาน/g, "นิมมาน")
    .replace(/ฟื้นที่/g, "พื้นที่")
    .replace(/ไกล้เคียง/g, "ใกล้เคียง")
    .replace(/ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/พาพับ/g, "พายัพ")
    .replace(/รับงาน ของแก่น/g, "รับงาน ขอนแก่น")
    .replace(/ตัวเมือง ของแก่น/g, "ตัวเมือง ขอนแก่น");
}

function verifyHostname(req) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase();
  if (!host) return true;
  return true;
}

async function getTemplateHtml(url, context) {
  const now = Date.now();
  if (!TEMPLATE_HTML_CACHE || (now - TEMPLATE_CACHE_TIMESTAMP > TEMPLATE_CACHE_TTL_MS)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const templateUrl = new URL("/index.html", url.origin);
      const mainTemplate = await fetch(templateUrl, { 
        headers: { "x-ssr-bypass": "true" },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (mainTemplate.ok) {
        TEMPLATE_HTML_CACHE = await mainTemplate.text();
        TEMPLATE_CACHE_TIMESTAMP = now;
      }
    } catch (e) {
      console.warn("⚠️ Fetching index.html template timed out or failed, fallback to basic HTML shell");
      return `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>{{SEO_TITLE}}</title></head><body><div id="app"></div></body></html>`;
    }
  }
  return TEMPLATE_HTML_CACHE || `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>First Model Hub</title></head><body></body></html>`;
}

const escapeHTML = str => (str !== null && str !== undefined) ? String(str).replace(/[&<>'"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[m] || m)) : "";
const stripHTML = str => (str !== null && str !== undefined) ? String(str).replace(/<[^>]*>?/gm, "").trim() : "";
const replaceGlobal = (source, target, replacement) => source.split(target).join(replacement);

const optimizeImg = (hostUrl, path, width = 300, height = 375) => {
  if (!path) return `${CONFIG.PRIMARY_DOMAIN}/images/firstmodelhub.webp`;
  if (path.includes("res.cloudinary.com")) {
    if (path.includes("/upload/")) {
      return path.replace("/upload/", `/upload/f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face/`);
    }
    return path;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=70&format=avif`;
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
  let res = sanitizeThaiText(text);
  const targetUrl = (provinceSlug && provinceSlug !== "national") ? `/location/${provinceSlug}` : "/";
  if (zones && Array.isArray(zones) && zones.length > 0) {
    zones.slice(0, 3).forEach(zone => {
      if (!zone) return;
      const cleanZone = sanitizeThaiText(zone);
      const regex = new RegExp(`(${cleanZone})(?![^<]*>|[^<>]*<\\/a>)`, "g");
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
    `<a href="${targetUrl}" class="text-[#C084FC] hover:underline font-bold transition-colors">${escapeHTML(sanitizeThaiText(zone))}</a>`
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
  const zonesText = seo.zones && seo.zones.length > 0 ? seo.zones.slice(0, 3).map(sanitizeThaiText).join(", ") : province;
  if (topSnippetText) {
    return `สาวรับงาน${province} 🟢 พร้อมรับงานวันนี้: ${sanitizeThaiText(topSnippetText)} - คัดสรรเฉพาะตัวจริงตรงปก 100% นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมพิกัด ${zonesText}`;
  }
  return `ศูนย์รวมสาวรับงาน${province} และเพื่อนเที่ยวไซด์ไลน์ฟิวแฟน คัดสรรเฉพาะตัวจริงตรงปก 100% ปลอดภัยนัดเจอจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมพิกัด ${zonesText}`;
}

function buildErrorPage(code, title, message) {
  return new Response(`<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${code} - ${escapeHTML(title)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800&display=swap" rel="stylesheet" />
    <style>
        body { background: #07070a; color: #fff; font-family: 'Prompt', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin:0; padding: 16px; box-sizing:border-box;}
        .card { max-width: 420px; width:100%; border: 1px solid rgba(255,255,255,0.08); background: rgba(14,9,30,0.75); padding: 40px 24px; border-radius: 24px; text-align:center; backdrop-filter: blur(20px); box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
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

const generatePersonSchema = (profile, province, targetUrl, hostUrl) => {
  const priceVal = (profile.rate || "0").toString().replace(/\D/g, "");
  const cleanName = (profile.name || "").replace(/^น้อง/, "").trim();
  const cleanLoc = sanitizeThaiText(profile.location || province);
  return {
    "@type": "Person",
    "@id": `${targetUrl}/#person`,
    "name": `น้อง${cleanName}`,
    "url": targetUrl,
    "image": optimizeImg(hostUrl, profile.imagePath, 1200, 630),
    "description": sanitizeThaiText(profile.description) || `โปรไฟล์แนะนำน้อง${cleanName} สาวรับงานพิกัด ${cleanLoc} สไตล์เพื่อนเที่ยวดูแลดี ฟิวแฟน ตรงปก 100% ไม่มัดจำ บน First Model Hub`,
    "jobTitle": "Freelance Companion & Entertainer",
    "gender": "Female",
    "knowsAbout": ["Companion Services", "Tour Guide Services", "Entertainment Services"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cleanLoc,
      "addressRegion": province,
      "addressCountry": "TH"
    },
    "offers": {
      "@type": "Offer",
      "url": targetUrl,
      "price": priceVal || "1500",
      "priceCurrency": "THB",
      "priceValidUntil": "2027-12-31",
      "availability": !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (profile.availability || "").toLowerCase().includes(kw))
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
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
                  <span class="text-gradient-sub" style="line-height: 1.4;">${escapeHTML(sanitizeThaiText(item.q))}</span>
                </h3>
                <div style="padding-left: 32px; color: var(--text-gray); font-size: 12px; line-height: 1.5; border-left: 2px solid rgba(147, 51, 234, 0.2); padding-top: 4px;">
                  ${escapeHTML(sanitizeThaiText(item.a))}
                </div>
            </div>
        </div>
    `).join("");
};

export default async (req, context) => {
  if (!verifyHostname(req)) {
    return new Response("403 Forbidden - Access Denied", { status: 403 });
  }

  const url = new URL(req.url);
  const hostUrl = CONFIG.PRIMARY_DOMAIN;
  const hostName = url.hostname.toLowerCase();

  if (hostName.includes("sidelinechiangmai.netlify.app")) {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return Response.redirect(`${hostUrl}/location/chiangmai`, 301);
    }
    return Response.redirect(`${hostUrl}${url.pathname}${url.search}`, 301);
  }

  if (hostName.startsWith("www.firstmodelhub.com") || hostName.includes("firstmodelhub.netlify.app")) {
    return Response.redirect(`${hostUrl}${url.pathname}${url.search}`, 301);
  }

  if (req.headers.get("x-ssr-bypass") === "true") {
    try { return await context.next(); } catch { return new Response("Bypass fetch failed", { status: 500 }); }
  }

  if (STATIC_EXT_REGEX.test(url.pathname)) {
    try { return await context.next(); } catch { return await context.next(); }
  }

  const staticPages = ["/about", "/faq", "/blog", "/contact", "/terms-of-service", "/privacy-policy", "/policy", "/locations"];
  if (staticPages.some(page => url.pathname === page || url.pathname.startsWith(page + "/"))) {
    try { return await context.next(); } catch { return await context.next(); }
  }

  if (url.pathname === "/index.html") {
    return Response.redirect(`${hostUrl}/`, 301);
  }

  const cacheKey = `${req.method}:${url.pathname}:${url.search}`;
  const cachedItem = PAGE_CACHE.get(cacheKey);
  if (cachedItem && (Date.now() - cachedItem.timestamp < PAGE_CACHE_TTL_MS)) {
    return new Response(cachedItem.html, { headers: cachedItem.headers });
  }

  const paths = url.pathname.split("/").filter(Boolean);
  let provinceSlug = "", profileSlug = "", isNationalHome = false;

  if (paths.length === 0 || url.pathname === "/" || url.pathname === "/profiles" || url.pathname === "/profiles.html") {
    isNationalHome = true;
    provinceSlug = "national";
  } else if ("location" === paths[0] && paths[1]) {
    try { provinceSlug = decodeURIComponent(paths[1]).toLowerCase(); } catch { provinceSlug = paths[1].toLowerCase(); }
  } else if ("sideline" === paths[0] && paths[1]) {
    profileSlug = decodeURIComponent(paths[1]);
  } else {
    const lastSegment = paths[paths.length - 1] || "";
    try { provinceSlug = decodeURIComponent(lastSegment).toLowerCase(); } catch { provinceSlug = lastSegment.toLowerCase(); }
  }

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    let matchedProfile = null;
    if (profileSlug) {
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", profileSlug)
        .eq("active", true)
        .maybeSingle();

      if (profileData && !profileErr) {
        matchedProfile = profileData;
        provinceSlug = profileData.provinceKey || profileData.province_key || profileData.province_slug || "chiangmai";
      } else {
        return buildErrorPage(404, "404 - ไม่พบโปรไฟล์ที่ต้องการ", "โปรไฟล์น้องๆ รายนี้อาจถูกปิดการใช้งาน หรือระงับบริการชั่วคราวครับ");
      }
    }

    let searchKeys = [provinceSlug];
    if (provinceSlug === "chiangmai" || provinceSlug === "chiang_mai") {
      searchKeys = ["chiangmai", "chiang_mai"];
    }

    const provinceParam = provinceSlug.replace(/-/g, "").replace(/_/g, "");

    let profileQuery = supabase
      .from("profiles")
      .select("id, slug, name, age, imagePath, galleryPaths, provinceKey, location, rate, isfeatured, lastUpdated, active, availability, description, height, weight, stats, skin_tone, bust, waist, hips, cup_size, has_video, verified, line_id, quote, style_tags, slogan")
      .eq("active", true)
      .order("isfeatured", { ascending: false })
      .order("lastUpdated", { ascending: false })
      .limit(16);

    if (!isNationalHome && provinceSlug !== "national") {
      profileQuery = profileQuery.in("provinceKey", searchKeys);
    }

    let reviewQuery = supabase.from("reviews")
      .select("id, created_at, author_name, location_detail, rating_score, review_body, province_key")
      .eq("active_status", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (!isNationalHome) {
      reviewQuery = reviewQuery.in("province_key", searchKeys);
    }

    const [provSingleRes, profListRes, provListRes, reviewsRes] = await Promise.all([
      isNationalHome 
        ? Promise.resolve({ data: { id: 0, nameThai: "ทั่วไทย", key: "national" } })
        : supabase.from("provinces").select("id, nameThai, key").in("key", searchKeys).limit(1).maybeSingle(),
      profileQuery,
      supabase.from("provinces").select("key, nameThai").order("nameThai", { ascending: true }),
      Promise.resolve(reviewQuery).catch(() => ({ data: [] }))
    ]);

    const provinceData = provSingleRes.data;
    if (!provinceData && !isNationalHome) {
      return buildErrorPage(404, "404 - ไม่พบหน้าเว็บ", "ไม่พบพิกัดจังหวัดที่คุณต้องการหาในขณะนี้");
    }

    const profileList = profListRes.data || [];
    const provinceThaiName = isNationalHome ? "ทั่วไทย" : (provinceData?.nameThai || "เชียงใหม่");
    const customMeta = isNationalHome ? null : (PROVINCE_CUSTOM_METADATA[provinceParam] || null);
    const seoData = isNationalHome ? PROVINCE_SEO_DATA.default : (PROVINCE_SEO_DATA[provinceParam] || PROVINCE_SEO_DATA.default);

    const canonUrl = matchedProfile 
      ? `${hostUrl}/sideline/${encodeURIComponent(profileSlug)}`
      : (isNationalHome ? hostUrl : `${hostUrl}/location/${provinceSlug}`);
    
    const enUrl = `${canonUrl}/en`;

    const mainImgPath = matchedProfile?.imagePath || (profileList.length > 0 ? profileList[0].imagePath : null);
    const metaImgUrl = mainImgPath ? optimizeImg(hostUrl, mainImgPath, 1200, 630) : `${CONFIG.PRIMARY_DOMAIN}/images/firstmodelhub.webp`;

    const dbReviews = reviewsRes?.data || [];
    let finalReviews = [];
    if (dbReviews && dbReviews.length > 0) {
      finalReviews = dbReviews.map(r => ({
        author: r.author_name || "คุณผู้ใช้บริการ",
        location: sanitizeThaiText(r.location_detail) || `ตัวเมือง${provinceThaiName}`,
        text: sanitizeThaiText(r.review_body) || "ดูแลประทับใจดีสไตล์ฟิวแฟน ตรงปกปลอดภัย แนะนำครับ",
        rating: Number(r.rating_score) && !isNaN(Number(r.rating_score)) ? Math.min(5, Math.max(1, Number(r.rating_score))) : 5,
        date: formatDateSSR(r.created_at),
        datePublished: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
      }));
    } else {
      finalReviews = getDynamicReviews(provinceThaiName);
    }

    const topProfilesTextSnippet = profileList.slice(0, 5).map(p => {
      const pName = (p.name || "").replace(/^น้อง/, "").trim();
      const pAge = p.age ? ` (${p.age}ปี)` : "";
      const pLoc = p.location ? ` - ${sanitizeThaiText(p.location)}` : "";
      return `น้อง${pName}${pAge}${pLoc}`;
    }).join(" | ");

    let pageTitle = "", pageDesc = "";

    if (isNationalHome) {
      pageTitle = "สาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานทั่วไทย) | First Model Hub";
      pageDesc = topProfilesTextSnippet 
        ? `ทั่วไทย 🟢 พร้อมรับงานวันนี้: ${topProfilesTextSnippet} - ศูนย์รวมสาวรับงาน ไซด์ไลน์ ฟิวแฟนพรีเมียม คัดสรรตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ`
        : `ศูนย์รวมสาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนพรีเมียมทั่วไทย คัดสรรโปรไฟล์ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ`;
    } else {
      pageTitle = customMetaTitle(provinceThaiName, customMeta);
      pageDesc = customMetaDesc(provinceThaiName, seoData, customMeta, topProfilesTextSnippet);
    }

    if (matchedProfile) {
      const cleanProfileName = (matchedProfile.name || "").replace(/^น้อง/, "").trim();
      pageTitle = `น้อง${cleanProfileName}${matchedProfile.age ? ` ${matchedProfile.age}` : ""} ไซด์ไลน์${provinceThaiName} เพื่อนเที่ยวตรงปก | First Model Hub`;
      pageDesc = `รายละเอียดโปรไฟล์น้อง${cleanProfileName} สาวรับงานไซด์ไลน์พิกัดย่าน ${sanitizeThaiText(matchedProfile.location) || provinceThaiName} ตรงปก 100% ค่าขนม ${matchedProfile.rate || "สอบถาม"} ดูแลสไตล์ฟิวแฟน ไม่มีโอนมัดจำล่วงหน้า`;
    }

    const strippedDesc = stripHTML(pageDesc);
    const calculatedAvg = finalReviews.length > 0 
      ? (finalReviews.reduce((sum, rev) => sum + (Number(rev.rating) || 5), 0) / finalReviews.length) 
      : 5;
    const finalRatingValue = isNaN(calculatedAvg) ? "4.9" : calculatedAvg.toFixed(1);
    const finalReviewCount = finalReviews.length > 0 ? finalReviews.length : (profileList.length > 0 ? 30 + 3 * profileList.length : 45);
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent("สาวรับงาน " + (isNationalHome ? "กรุงเทพ" : provinceThaiName))}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

// 🟢 1. กรองคำว่า "ทั้งหมด" ออกจาก zones ก่อนทำ areaServed
    const validZones = (seoData.zones || [])
      .map(sanitizeThaiText)
      .filter(z => z && z !== "ทั้งหมด" && z !== "all");

    // 🟢 2. โครงสร้าง Business Entity ที่แก้ไข areaServed แล้ว
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
            ...validZones.map(z => ({ "@type": "AdministrativeArea", "name": "โซน" + z }))
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
        "logo": { "@type": "ImageObject", "url": `${CONFIG.PRIMARY_DOMAIN}/images/firstmodelhub.webp` },
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

    if (profileSlug && matchedProfile) {
      const profileUrl = `${hostUrl}/sideline/${encodeURIComponent(profileSlug)}`;
      const cleanName = (matchedProfile.name || "").replace(/^น้อง\s?/, "").trim();

      // 🟢 3. เพิ่ม WebPage Node ในหน้าโปรไฟล์เดี่ยวเพื่อเชื่อมโยง Graph ให้สมบูรณ์
      schemaGraph.push({
        "@type": "ItemPage",
        "@id": `${profileUrl}/#webpage`,
        "url": profileUrl,
        "name": `น้อง${cleanName} - โปรไฟล์สาวรับงาน${provinceThaiName}`,
        "isPartOf": { "@id": `${hostUrl}/#website` },
        "mainEntity": { "@id": `${profileUrl}/#person` }
      });

      schemaGraph.push(generatePersonSchema(matchedProfile, provinceThaiName, profileUrl, hostUrl));
      
      schemaGraph.push({
        "@type": "BreadcrumbList",
        "@id": `${profileUrl}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": hostUrl },
          { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceThaiName}`, "item": `${hostUrl}/location/${provinceSlug}` },
          { "@type": "ListItem", "position": 3, "name": `น้อง${cleanName}`, "item": profileUrl }
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

      // 🟢 4. แก้ไข ItemList ให้ถูกต้องตามข้อกำหนด Google Carousel (ใช้ URL references)
      if (profileList.length > 0) {
        schemaGraph.push({
          "@type": "ItemList",
          "@id": `${canonUrl}/#itemlist`,
          "name": `รายชื่อสาวรับงานและเพื่อนเที่ยว ${provinceThaiName}`,
          "numberOfItems": profileList.length,
          "itemListElement": profileList.map((p, index) => {
            const pCleanName = (p.name || "").replace(/^น้อง\s?/, "").trim();
            const itemUrl = `${hostUrl}/sideline/${encodeURIComponent(p.slug || p.id)}`;
            return {
              "@type": "ListItem",
              "position": index + 1,
              "name": `น้อง${pCleanName}`,
              "url": itemUrl
            };
          })
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

    // 🟢 5. เชื่อมโยง FAQPage เข้ากับ WebPage ผ่าน isPartOf
    if (seoData.faqs && !profileSlug) {
      schemaGraph.push({
        "@type": "FAQPage",
        "@id": `${canonUrl}/#faq`,
        "isPartOf": { "@id": `${canonUrl}/#webpage` },
        "mainEntity": seoData.faqs.map(faq => ({
          "@type": "Question",
          "name": stripHTML(sanitizeThaiText(faq.q)),
          "acceptedAnswer": { "@type": "Answer", "text": stripHTML(sanitizeThaiText(faq.a)) }
        }))
      });
    }

    const schemaJson = { "@context": "https://schema.org", "@graph": schemaGraph };

    const cardsHtml = profileList.map((p, index) => {
      const pName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/gi, ""));
      const pLoc = escapeHTML(sanitizeThaiText(p.location) || provinceThaiName);
      const pUrl = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
      
      const isAvailable = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
      const statusDotColor = isAvailable ? "#00E676" : "#FF2E63";
      const statusText = p.availability || (isAvailable ? "รับงาน" : "สอบถามคิว");
      const ageDisplay = p.age && p.age !== "-" ? ` ${escapeHTML(p.age)}` : "";
      
      const seoAltText = `${pName} สาวรับงาน${provinceThaiName} ไซด์ไลน์${provinceThaiName} ฟิวแฟนตรงปก 100%`;
      const imgUrl = optimizeImg(hostUrl, p.imagePath, 600, 750);

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

      const sloganText = escapeHTML(sanitizeThaiText(p.slogan || p.quote || ""));

      // 🟢 ปรับ loading: การ์ดรูปภาพใช้ lazy ทั้งหมด ยกเว้นรูปแรก เพื่อไม่ให้กระทบ LCP
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
                   loading="${index === 0 ? "eager" : "lazy"}"
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
    const matchedZones = seoData.zones.slice(0, 4).map(sanitizeThaiText).join(", ");
    
    const introTemplate = seoData.uniqueIntro || getDynamicIntro(provinceThaiName, seoData.zones, provinceSlug);
    const seoIntroContent = smartLinkify(introTemplate, 0, seoData.zones, provinceSlug);

    const popularLocationsHtml = provListRes.data ? provListRes.data.map(p => {
      const key = p.key || p.slug || p.id;
      const name = p.nameThai || p.name;
      const isActive = key === provinceSlug;
      
      let html = `<li><a href="/location/${key}" title="สาวรับงาน${name}" style="color: ${isActive ? 'var(--primary-purple)' : 'var(--text-gray)'}; text-decoration: none;" ${isActive ? 'class="active" aria-current="page"' : ''}>ไซด์ไลน์${name}</a></li>`;
      
      if (key === 'chiangmai') {
        html += `<li><a href="/location/chiangmai?q=นิมมาน" title="สาวรับงานนิมมาน เชียงใหม่" style="color: var(--text-muted); text-decoration: none;">ไซด์ไลน์นิมมาน</a></li>`;
        html += `<li><a href="/location/chiangmai?q=สันติธรรม" title="สาวรับงานสันติธรรม เชียงใหม่" style="color: var(--text-muted); text-decoration: none;">ไซด์ไลน์สันติธรรม</a></li>`;
      }
      return html;
    }).join("") : "";

    let rawHtml = await getTemplateHtml(url, context);

    if (!/<base\s+/i.test(rawHtml)) {
      rawHtml = rawHtml.replace(/<head[^>]*>/i, (match) => `${match}\n    <base href="/" />`);
    }

    rawHtml = rawHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHTML(pageTitle)}</title>`);
    rawHtml = rawHtml.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHTML(strippedDesc)}" />`);

    rawHtml = rawHtml.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHTML(pageTitle)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHTML(strippedDesc)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHTML(pageTitle)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHTML(strippedDesc)}" />`);

    rawHtml = replaceGlobal(rawHtml, "{{SEO_CANONICAL}}", canonUrl);
    rawHtml = replaceGlobal(rawHtml, "{{SEO_CANONICAL_EN}}", enUrl);
    rawHtml = replaceGlobal(rawHtml, "{{SEO_IMAGE}}", metaImgUrl);
    
    // 🟢 แทนที่แท็ก <script id="dynamic-schema"> สมบูรณ์ 100%
    const newSchemaScript = `<script type="application/ld+json" id="dynamic-schema">${JSON.stringify(schemaJson).replace(/</g, '\\u003c')}</script>`;
    if (/<script type="application\/ld\+json" id="dynamic-schema">[\s\S]*?<\/script>/i.test(rawHtml)) {
      rawHtml = rawHtml.replace(/<script type="application\/ld\+json" id="dynamic-schema">[\s\S]*?<\/script>/i, newSchemaScript);
    } else {
      rawHtml = replaceGlobal(rawHtml, "{{SCHEMA_JSON}}", JSON.stringify(schemaJson).replace(/</g, '\\u003c'));
    }
    
    rawHtml = replaceGlobal(rawHtml, "{{PROFILES_CARDS_HTML}}", cardsHtml);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_NAME}}", provinceThaiName);
    rawHtml = replaceGlobal(rawHtml, "{{PROFILE_COUNT}}", profileList.length || 50);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_ZONES}}", matchedZones);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_SEO_CONTENT}}", seoIntroContent);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_REVIEWS_HTML}}", reviewsHtml);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_FAQS_HTML}}", faqsHtml);
    rawHtml = replaceGlobal(rawHtml, "{{MAP_EMBED_URL}}", mapEmbedUrl);

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

    // 🟢 เติมข้อมูลให้ window.profilesData เพื่อฝังให้ Client-side Hydration ทำงานได้ 100%
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
      location: sanitizeThaiText(p.location),
      rate: p.rate,
      availability: p.availability,
      lastUpdated: p.lastUpdated,
      isfeatured: p.isfeatured,
      verified: p.verified || p.isVerified,
      hasVideo: p.has_video || p.hasVideo || false,
      description: sanitizeThaiText(p.description) || "",
      lineId: p.line_id || p.lineId || "",
      quote: sanitizeThaiText(p.quote || p.slogan) || "",
      styleTags: p.style_tags || p.styleTags || []
    }))).replace(/</g, '\\u003c');

    const hydratedScriptTag = `<script id="ssr-profiles-data">window.profilesData = ${hydratedProfilesData};</script>`;

    if (rawHtml.includes('<script id="ssr-profiles-data">')) {
      rawHtml = rawHtml.replace(/<script id="ssr-profiles-data">[\s\S]*?<\/script>/i, hydratedScriptTag);
    } else if (rawHtml.includes("{{SSR_PROFILES_JSON}}")) {
      rawHtml = replaceGlobal(rawHtml, "{{SSR_PROFILES_JSON}}", hydratedProfilesData);
    } else {
      rawHtml = rawHtml.replace(/<\/head>/i, `${hydratedScriptTag}\n</head>`);
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
    console.error("Critical rendering error, fallback to static html:", err);
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