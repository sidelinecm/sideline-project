import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

// 🟢 B จุดที่ 1: ส่วนหัวไฟล์ (แทนที่บรรทัดที่ 3 เดิม)
const PAGE_CACHE = new Map();
const MAX_PAGE_CACHE_ENTRIES = 60; // 👈 จำกัดสูงสุด 60 หน้า ป้องกัน RAM เต็ม
let GLOBAL_VERSION = `v_${Date.now()}`;
let TEMPLATE_HTML_CACHE = null;

// 🟢 ฟังก์ชันบันทึกแคชแบบปลอดภัย ถ้ารายการเกินเพดาน จะลบของเก่าสุดทิ้งอัตโนมัติ
function setSafePageCache(key, data) {
  if (PAGE_CACHE.size >= MAX_PAGE_CACHE_ENTRIES) {
    const oldestKey = PAGE_CACHE.keys().next().value;
    PAGE_CACHE.delete(oldestKey);
  }
  PAGE_CACHE.set(key, data);
}
const STATIC_EXT_REGEX = /\.(css|js|png|jpg|jpeg|webp|avif|svg|ico|json|webmanifest|map|woff|woff2|ttf|txt|xml)$/i;

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
  PRIMARY_DOMAIN: "https://firstmodelhub.com",
  CLOUDINARY_BASE_URL: "https://res.cloudinary.com/dyynjlbuj/image/upload/",
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
      { q: "นัดพบเพื่อนเที่ยวเชียงใหม่ โซนไหนเดินทางสะดวกและรวดเร็วที่สุด?", a: "ย่านนิมมานเหมินท์ เจ็ดยอด และสันติธรรม เป็นพิกัดหลักที่มีน้องๆ สแตนด์บายเยอะที่สุด สามารถเดินทางไปดูแลที่โรงแรมได้รวดเร็วภายใน 15-25 นาทีครับ" },
      { q: "ต้องการน้องไปนั่งคาเฟ่ ทานข้าว หรือเดินเล่นในเมืองเชียงใหม่ มีบริการไหม?", a: "มีครับ น้องๆ สไตล์ฟิวแฟน (GFE) ยินดีเป็นเพื่อนร่วมทาง ทานอาหาร และท่องเที่ยว คุยสนุก สุภาพ และให้เกียรติลูกค้าครับ" },
      { q: "หากพักแถวแม่ริม หรือหางดง น้องๆ สามารถเดินทางไปหาได้หรือไม่?", a: "สามารถเดินทางไปได้ครับ โดยอาจมีค่าเดินทางเพิ่มเติมตามระยะทางจริง ซึ่งสามารถตกลงรายละเอียดกับน้องหรือแอดมินก่อนเริ่มงานได้เลยครับ" },
      { q: "การนัดหมายในเชียงใหม่ ปลอดภัยจากการโดนหลอกโอนเงินอย่างไร?", a: "FirstModelHub ยึดระบบ 'เจอตัวจริง ตรวจสอบความตรงปกหน้างานเรียบร้อยแล้ว จึงค่อยชำระเงิน' ไม่มีมัดจำล่วงหน้าทุกกรณี ปลอดภัย 100% ครับ" }
    ]
  },
  bangkok: {
    name: "กรุงเทพฯ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย", "สาทร", "บางนา"],
    faqs: [
      { q: "การเรียกบริการเพื่อนเที่ยวนอกสถานที่ (Outcall) ในกรุงเทพฯ มีขั้นตอนอย่างไร?", a: "ลูกค้าสามารถเลือกโปรไฟล์ แจ้งพิกัดโรงแรมหรือคอนโดส่วนตัวในเขตกรุงเทพฯ เพื่อนัดหมายเวลาที่สะดวก น้องๆ จะเดินทางไปพบตามนัดหมายอย่างตรงเวลาครับ" },
      { q: "มีน้องๆ ที่สามารถสื่อสารภาษาอังกฤษเพื่อดูแลลูกค้าต่างชาติ (Expat/Tourist) ไหม?", a: "มีครับ โดยเฉพาะในโซนสุขุมวิท สาทร และทองหล่อ มีน้องๆ ระดับพรีเมียมที่สื่อสารภาษาอังกฤษได้อย่างคล่องแคล่ว วางตัวดี พร้อมออกงานสังคมครับ" },
      { q: "นัดพบช่วงดึกหลังเลิกงาน มีน้องๆ สแตนด์บายพร้อมดูแลไหม?", a: "มีน้องๆ สแตนด์บายครอบคลุมตลอดช่วงค่ำจนถึงดึก สามารถเลือกนัดหมายแบบชั่วคราว (Short Time) หรือค้างคืน (Overnight) ได้ตามต้องการครับ" }
    ]
  },
  chonburi: {
    name: "ชลบุรี",
    geo: { lat: 13.3611, lng: 100.9847 },
    zones: ["พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี", "จอมเทียน", "อมตะนคร", "แหลมฉบัง"],
    faqs: [
      { q: "ต้องการน้องไปร่วมปาร์ตี้พูลวิลล่าในพัทยา หรือสังสรรค์ริมหาด รับงานไหม?", a: "รับครับ เรามีน้องๆ สายเอ็นเตอร์เทน (EN VIP) สำหรับชงเหล้า พูดคุย สร้างบรรยากาศสนุกสนาน เป็นกันเอง เหมาะกับทริปพูลวิลล่าและงานเลี้ยงส่วนตัวครับ" },
      { q: "น้องๆ โซนบางแสน ศรีราชา และพัทยา มีสไตล์แตกต่างกันอย่างไร?", a: "โซนบางแสนและศรีราชาส่วนใหญ่เป็นสไตล์วัยใส นักศึกษา น่ารัก เอาใจเก่ง ส่วนโซนพัทยาและจอมเทียนจะมีความหลากหลาย ทั้งสาวสวยหุ่นนางแบบและสายฝอครับ" },
      { q: "เรียกน้องไปโรงแรมในพัทยา ต้องโอนค่ารถหรือมัดจำก่อนหรือไม่?", a: "ไม่ต้องโอนมัดจำล่วงหน้าทุกกรณีครับ ตรวจสอบความถูกต้องและตรงปกเมื่อน้องเดินทางถึงที่พักแล้ว จึงชำระค่าบริการกับน้องโดยตรงครับ" }
    ]
  },
  phuket: {
    name: "ภูเก็ต",
    geo: { lat: 7.8804, lng: 98.3923 },
    zones: ["ตัวเมืองภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง", "กะรน", "กะตะ", "บางเทา", "ราไวย์"],
    faqs: [
      { q: "นัดหมายเพื่อนเที่ยวภูเก็ต ไปร่วมทริปล่องเรือยอร์ช หรือทานดินเนอร์หรู ได้ไหม?", a: "ได้แน่นอนครับ มีน้องๆ โปรไฟล์พรีเมียม บุคลิกภาพดีเยี่ยม พร้อมเป็นเพื่อนร่วมเดินทาง ดินเนอร์ ออกงาน หรือร่วมทริปทะเลอย่างเป็นส่วนตัวครับ" },
      { q: "พักอยู่วิลล่าส่วนตัวแถวบางเทา กะหลิม หรือเชิงทะเล น้องเดินทางไปได้ไหม?", a: "เดินทางไปดูแลได้ทั่วทั้งเกาะภูเก็ตครับ นัดหมายระบุพิกัดที่พักให้น้องเดินทางไปพบได้อย่างเป็นส่วนตัวและปลอดภัยครับ" }
    ]
  },
  khonkaen: {
    name: "ขอนแก่น",
    geo: { lat: 16.4322, lng: 102.8236 },
    zones: ["ในตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
    faqs: [
      { q: "นัดหมายเพื่อนเที่ยวขอนแก่น โซนกังสดาล และรอบ มข. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำอยู่ในโซนมหาวิทยาลัยขอนแก่นและใจกลางเมือง เดินทางรวดเร็ว เป็นกันเอง ดูแลเอาใจใส่สไตล์ฟิวแฟนอย่างอบอุ่นครับ" },
      { q: "มีบริการเพื่อนเที่ยวทานข้าว หรือนั่งชิลร้านอาหารในขอนแก่นไหม?", a: "มีครับ น้องๆ พร้อมไปเป็นเพื่อนทานข้าว ดื่มชงเหล้า หรือนั่งคุยคลายเหงา สร้างความสบายใจ ไม่เร่งรีบ ให้เกียรติลูกค้าครับ" }
    ]
  },
  chiangrai: {
    name: "เชียงราย",
    geo: { lat: 19.9105, lng: 99.8406 },
    zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "มฟล.", "หอนาฬิกา", "แม่สาย", "รอบเวียง"],
    faqs: [
      { q: "เพื่อนเที่ยวเชียงราย โซนบ้านดู่ และ ม.แม่ฟ้าหลวง นัดหมายอย่างไร?", a: "มีน้องๆ สแตนด์บายแถวหน้า มฟล. และตัวเมืองเชียงราย แจ้งพิกัดโรงแรมหรือที่พัก นัดหมายเวลาที่สะดวก น้องพร้อมเดินทางไปดูแลถึงที่ครับ" }
    ]
  },
  lampang: {
    name: "ลำปาง",
    geo: { lat: 18.2888, lng: 99.4923 },
    zones: ["ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏลำปาง", "สบตุ๋ย", "เซ็นทรัลลำปาง"],
    faqs: [
      { q: "นัดพบเพื่อนเที่ยวลำปาง ในตัวเมืองหรือโรงแรมแถวไหนสะดวกที่สุด?", a: "พิกัดยอดนิยมคือโรงแรมชั้นนำในตัวเมือง ย่านสวนดอก และถนนรอบเวียง เดินทางสะดวก ปลอดภัย และเป็นส่วนตัวครับ" }
    ]
  },
  lamphun: {
    name: "ลำพูน",
    geo: { lat: 18.5772, lng: 99.0087 },
    zones: ["ตัวเมืองลำพูน", "นิคมลำพูน", "เวียงยอง", "ป่าซาง", "เหมืองง่า", "บ้านกลาง"],
    faqs: [
      { q: "เพื่อนเที่ยวลำพูน โซนนิคมอุตสาหกรรมนัดหมายอย่างไร?", a: "น้องๆ สแตนด์บายพร้อมดูแลทั้งโซนนิคมลำพูนและตัวเมือง สามารถแจ้งโรงแรมที่พักให้น้องเดินทางไปดูแลได้อย่างรวดเร็วครับ" }
    ]
  },
  phitsanulok: {
    name: "พิษณุโลก",
    geo: { lat: 16.8211, lng: 100.2659 },
    zones: ["ตัวเมืองพิษณุโลก", "รอบ มน.", "ท่าโพธิ์", "สมอแข", "ท็อปแลนด์", "เซ็นทรัลพิษณุโลก"],
    faqs: [
      { q: "เพื่อนเที่ยวพิษณุโลก โซนรอบ ม.นเรศวร (มน.) นัดพบสะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำทั้งโซนรอบ มน. ท่าโพธิ์ และโรงแรมใจกลางเมือง นัดหมายล่วงหน้าสั้นๆ น้องเดินทางถึงที่พักทันทีครับ" }
    ]
  },
  udonthani: {
    name: "อุดรธานี",
    geo: { lat: 17.4138, lng: 102.7872 },
    zones: ["ตัวเมืองอุดร", "UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร", "บ้านจาน", "โพศรี"],
    faqs: [
      { q: "เพื่อนเที่ยวอุดรธานี นัดพบแถวไหนเดินทางสะดวกที่สุด?", a: "ย่านใจกลางเมือง UD Town เซ็นทรัลอุดร และรอบสวนสาธารณะหนองประจักษ์ เป็นจุดนัดพบที่โรงแรมหาง่ายและเดินทางสะดวกที่สุดครับ" }
    ]
  },
  default: {
    name: "ทั่วไทย",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "พัทยา", "ภูเก็ต", "ขอนแก่น", "อุดรธานี", "หาดใหญ่"],
    faqs: [
      { q: "เรียกใช้บริการเพื่อนเที่ยวผ่าน FirstModelHub ต้องโอนเงินมัดจำล่วงหน้าไหม?", a: "ไม่ต้องโอนมัดจำล่วงหน้าทุกกรณีครับ ระบบของเราคือ 'นัดพบเจอตัวจริง ตรวจสอบความตรงปกหน้างานเรียบร้อยแล้ว จึงค่อยชำระเงินโดยตรงกับน้อง' ปลอดภัย 100% ครับ" },
      { q: "บริการสไตล์ฟิวแฟน (Girlfriend Experience - GFE) คืออะไร?", a: "คือบริการที่เน้นการเทคแคร์ เอาใจใส่ ดูแลดุจคนรัก มีความสุภาพ อ่อนโยน เป็นกันเอง ไม่เร่งเวลา และให้เกียรติลูกค้าครับ" },
      { q: "หากน้องเดินทางมาถึงแล้วรูปถ่ายไม่ตรงปก สามารถทำอย่างไรได้บ้าง?", a: "เราการันตีตรงปก 100% หากพบว่าตัวจริงไม่ตรงตามรูปโปรไฟล์ ลูกค้ามีสิทธิ์ปฏิเสธการรับบริการและยกเลิกหน้างานได้ทันทีโดยไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้นครับ" }
    ]
  }
};

// 🟢 เชื่อมโยง Alias อัตโนมัติในโค้ด (ไม่ต้องก๊อปปี้ข้อมูลซ้ำ)
PROVINCE_SEO_DATA["chiang-mai"] = PROVINCE_SEO_DATA.chiangmai;
PROVINCE_SEO_DATA["khon-kaen"] = PROVINCE_SEO_DATA.khonkaen;

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
    .replace(/ไม่มีมีดจำ/g, "ไม่มีมัดจำ")
    .replace(/เอาวจเก่ง/g, "เอาใจเก่ง")
    .replace(/ฟิวแฟว/g, "ฟิวแฟน")
    .replace(/มีอารมร่วม/g, "มีอารมณ์ร่วม")
    .replace(/ได้ค่ะได้ค่ะ/g, "ได้ค่ะ")
    .replace(/(?<!#[0-9a-fA-F]{0,6})\b(69|➏➒)\b|อมสด|จูบแลกลิ้น|แตกบนตัว|จู๋ทำ\+500|เอาร่องนม|ดูดสด/gi, "บริการดูแลสไตล์ฟิวแฟน")
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

function optimizeImg(imagePath, width = 400, height = 560) {
  const DEFAULT_FALLBACK_IMG = "https://firstmodelhub.com/images/firstmodelhub.webp";
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) return DEFAULT_FALLBACK_IMG;

  const cleanPath = imagePath.trim();
  const isThumb = width <= 150;
  const transform = isThumb 
    ? "f_auto,q_auto:eco,w_120,h_120,c_fill,g_face"
    : "f_auto,q_auto:good,w_400,h_560,c_fill,g_face";

  if (cleanPath.includes("res.cloudinary.com")) {
    const uploadIdx = cleanPath.indexOf("/upload/");
    if (uploadIdx !== -1) {
      const base = cleanPath.substring(0, uploadIdx + 8);
      let rest = cleanPath.substring(uploadIdx + 8);
      rest = rest.replace(/^(?:[a-z]{1,4}_[a-z0-9_:-]+,?)+\//i, "");
      return `${base}${transform}/${rest}`;
    }
    return cleanPath;
  }

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  let formatted = cleanPath.replace(/^\/+/, "");
  return `https://res.cloudinary.com/dyynjlbuj/image/upload/${transform}/${formatted}`;
}

function getDynamicIntro(provinceName, zones, provinceSlug = "chiangmai") {
  const cleanSlug = (provinceSlug || "chiangmai").toLowerCase().replace(/[-_]/g, "");
  let cleanZones = zones && Array.isArray(zones) ? zones.filter(z => z && z !== "ทั้งหมด") : [];
  const locationUrl = provinceSlug && provinceSlug !== "national" ? `/location/${provinceSlug}` : "/";
  const zoneLinks = cleanZones.slice(0, 5).map(z => `<a href="${locationUrl}" class="kw-zone">${escapeHTML(sanitizeThaiText(z))}</a>`);
  const zoneText = zoneLinks.length > 0 ? ` เช่น ย่าน ${zoneLinks.join(", ")}` : " บริเวณใจกลางเมืองและแหล่งที่พักชั้นนำ";

  // ข้อมูลบริบทเฉพาะของแต่ละหัวเมืองใหญ่ (Local Context)
  const LOCAL_CONTEXT = {
    chiangmai: {
      headline: `คู่มือนัดหมายเพื่อนเที่ยวและคนดูแลสไตล์ฟิวแฟน จ.เชียงใหม่`,
      intro: `สำหรับผู้ที่เดินทางมาพักผ่อน ท่องเที่ยว หรือทำงานในเชียงใหม่ FirstModelHub คัดสรรเพื่อนเที่ยวระดับพรีเมียม สไตล์ฟิวแฟน (Girlfriend Experience) ที่เน้นความสุภาพ อัธยาศัยดี และไม่เร่งเวลา พร้อมเป็นเพื่อนทานข้าวดินเนอร์ นั่งคาเฟ่ชิลๆ หรือดูแลผ่อนคลายอย่างเป็นส่วนตัว`,
      convenience: `โรงแรมและรีสอร์ตในตัวเมือง โดยเฉพาะ${zoneText} น้องๆ สแตนด์บายพร้อมเดินทางถึงที่พักภายใน 15-30 นาที สะดวกสบายและเป็นส่วนตัวสูงสุด`
    },
    bangkok: {
      headline: `บริการเพื่อนเที่ยวระดับ VIP และผู้ดูแลไลฟ์สไตล์ส่วนบุคคล กรุงเทพฯ`,
      intro: `ศูนย์รวมเพื่อนเที่ยวมืออาชีพและน้องๆ สไตล์ฟิวแฟนในกรุงเทพฯ ครอบคลุมทั้งสายเรียบร้อยน่ารัก พริตตี้ และสาวสวยบุคลิกดี เหมาะสำหรับนักธุรกิจและผู้ที่ต้องการเพื่อนร่วมโต๊ะอาหาร ออกงานสังคม หรือการพักผ่อนอย่างเป็นส่วนตัวหลังเลิกงาน`,
      convenience: `ครอบคลุมทั้งแนวรถไฟฟ้า คอนโดมิเนียมหรู และโรงแรมชั้นนำ${zoneText} สามารถระบุพิกัดที่ต้องการให้น้องเดินทางไปดูแล (Outcall) ได้อย่างรวดเร็ว`
    },
    chonburi: {
      headline: `เพื่อนเที่ยวพัทยา-ชลบุรี เติมเต็มทริปพักผ่อนริมทะเลอย่างมั่นใจ`,
      intro: `มาเที่ยวพัทยา บางแสน ให้การพักผ่อนสมบูรณ์แบบยิ่งขึ้นด้วยเพื่อนเที่ยวสายสดใส เป็นกันเอง พร้อมร่วมกิจกรรมริมหาด ปาร์ตี้พูลวิลล่าส่วนตัว หรือดูแลสไตล์ฟิวแฟนแบบใกล้ชิด`,
      convenience: `รองรับพิกัดที่พักทั่วพัทยา จอมเทียน และบางแสน${zoneText} เดินทางเข้าดูแลถึงที่พักได้อย่างสะดวกรวดเร็ว ปลอดภัย ไร้กังวลเรื่องเวลา`
    },
    phuket: {
      headline: `สัมผัสการพักผ่อนระดับไฮเอนด์กับเพื่อนเที่ยว VIP ภูเก็ต`,
      intro: `ยกระดับวันหยุดบนเกาะภูเก็ตด้วยเพื่อนเที่ยวระดับพรีเมียม สื่อสารคล่องแคล่ว บุคลิกสง่างาม พร้อมเป็นเพื่อนร่วมทริป ดินเนอร์ชมพระอาทิตย์ตก นั่งเรือยอร์ช หรือดูแลอย่างอบอุ่นในพูลวิลล่าส่วนตัว`,
      convenience: `บริการทั่วทั้งเกาะภูเก็ต${zoneText} เข้าพบที่รีสอร์ตหรือวิลล่าส่วนตัวตามเวลานัดหมายอย่างตรงเวลา`
    },
    khonkaen: {
      headline: `เพื่อนเที่ยวฟิวแฟน ขอนแก่น คัดสรรโปรไฟล์ตรงปก 100%`,
      intro: `ผ่อนคลายในเมืองศูนย์กลางภาคอีสานกับน้องๆ วัยใส นักศึกษา และสาวสวยสไตล์ฟิวแฟน ขี้อ้อน เทคแคร์ดี เอาใจใส่ดุจคนรู้ใจ ตอบโจทย์ทั้งการนัดทานข้าว นั่งร้านชิล หรือนัดพบส่วนตัว`,
      convenience: `สแตนด์บายครอบคลุมโซนมหาวิทยาลัยและโรงแรมใจกลางขอนแก่น${zoneText} เดินทางสะดวก รวดเร็วทันใจ`
    }
  };

  const current = LOCAL_CONTEXT[cleanSlug] || {
    headline: `ศูนย์รวมเพื่อนเที่ยวและผู้ดูแลสไตล์ฟิวแฟน ${provinceName}`,
    intro: `FirstModelHub คัดสรรเพื่อนเที่ยวคุณภาพที่เน้นความตรงปก 100% ดูแลด้วยความจริงใจ สุภาพ และให้เกียรติผู้ใช้บริการ เพื่อให้ทุกช่วงเวลาการพักผ่อนใน ${provinceName} เป็นไปอย่างผ่อนคลายและประทับใจ`,
    convenience: `ครอบคลุมโรงแรมและที่พักสำคัญในพื้นที่ ${provinceName}${zoneText} เดินทางนัดพบได้อย่างสะดวกและเป็นส่วนตัว`
  };

  return `
    <div style="margin-bottom: 16px;">
      <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">${current.headline}</h3>
      <p style="margin-bottom: 8px; line-height: 1.65;">${current.intro}</p>
      <p style="margin-bottom: 8px; line-height: 1.65;">มั่นใจในความปลอดภัยสูงสุดด้วยนโยบาย <strong>"นัดพบเจอตัวจริง ตรวจสอบความตรงปกหน้างานเรียบร้อยแล้ว จึงค่อยชำระค่าบริการ"</strong> ปราศจากความเสี่ยงจากการโอนเงินมัดจำล่วงหน้า 100%</p>
    </div>
    <div style="margin-bottom: 16px;">
      <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดบริการและการนัดหมายใน ${provinceName}</h3>
      <p style="margin-bottom: 8px; line-height: 1.65;">${current.convenience}</p>
      <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
         <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span>เพื่อนทานข้าว ดินเนอร์ คลายเหงาในวันพักผ่อน</span></li>
         <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span>เพื่อนเที่ยวสไตล์ฟิวแฟน (GFE) เทคแคร์อบอุ่น สุภาพ ไม่เร่งรีบ</span></li>
         <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span>เอ็นเตอร์เทนเนอร์ (EN VIP) สำหรับงานเลี้ยงสังสรรค์ส่วนตัว</span></li>
      </ul>
    </div>
    <div>
      <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">🛡️ มาตรฐานความปลอดภัยและการรักษาความลับ</h3>
      <p style="line-height: 1.65;">ทุกโปรไฟล์ผ่านการยืนยันรูปถ่ายตัวจริง ข้อมูลการนัดหมายถูกเก็บเป็นความลับสูงสุด (Zero-Log Policy) เลือกระยะเวลาการดูแลได้ทั้งแบบชั่วคราวและค้างคืน ชำระเงินตรงกับน้องหน้างาน ไร้เงื่อนไขมัดจำทุกกรณี</p>
    </div>
  `;
}

// 🟢 แปลงชื่อโซนในข้อความเป็น Internal Link อัตโนมัติ (SEO Friendly)
function smartLinkify(htmlText, maxLinks = 3, zones = [], provinceSlug = "chiangmai") {
  if (!htmlText || typeof htmlText !== "string") return "";
  if (!zones || zones.length === 0 || maxLinks <= 0) return htmlText;

  const targetUrl = provinceSlug && provinceSlug !== "national" ? `/location/${provinceSlug}` : "/";
  let linkedCount = 0;
  let result = htmlText;

  const cleanZones = zones.filter(z => z && z !== "ทั้งหมด").sort((a, b) => b.length - a.length);

  for (const zone of cleanZones) {
    if (linkedCount >= maxLinks) break;
    const regex = new RegExp(`(?<!<[^>]*)${zone}(?![^<]*<\/a>)`, "g");
    if (regex.test(result)) {
      result = result.replace(regex, `<a href="${targetUrl}" class="kw-zone">${zone}</a>`);
      linkedCount++;
    }
  }
  return result;
}

function getDynamicReviews(provinceName) {
  const isNational = provinceName === "ทั่วไทย";
  const isChiangMai = provinceName === "เชียงใหม่";
  
  let loc1 = "โซนยอดนิยมในกรุงเทพฯ และปริมณฑล";
  let loc2 = "พิกัดใจกลางเมือง";
  let text1 = "นัดเจอน้องเรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ระบบ First Model Hub ไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับ";

  if (isChiangMai) {
    loc1 = "ย่านนิมมาน เชียงใหม่";
    loc2 = "โซนยอดนิยม นิมมาน";
    text1 = "นัดเจอน้องแถวย่านนิมมาน เชียงใหม่ เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย แนะนำเลยครับ";
  } else if (!isNational) {
    loc1 = `ตัวเมือง${provinceName}`;
    loc2 = `โซนยอดนิยมใน${provinceName}`;
    text1 = `นัดเจอน้องในจังหวัด${provinceName} เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย แนะนำเลยครับ`;
  }

  return [
    {
      author: "คุณชลสิทธิ์",
      initial: "C",
      location: loc1,
      text: text1,
      rating: 5,
      date: "เมื่อสัปดาห์ที่แล้ว"
    },
    {
      author: "คุณอภิชาติ",
      initial: "A",
      location: loc2,
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
  } catch (_err) {
    // ignore
  }
  return "";
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

// 🟢 แก้ไข Syntax Error: ลบฟังก์ชันที่เขียนค้างทิ้งไป และเก็บอันที่ถูกต้องไว้
function generateNaturalAlt(cleanName, provinceName, loc, index) {
  const patterns = [
    `น้อง${cleanName} สาวสวยเพื่อนเที่ยว${provinceName} โซน${loc}`,
    `น้อง${cleanName} ไซด์ไลน์${provinceName} ย่าน${loc} ตัวจริงตรงปก`,
    `โปรไฟล์น้อง${cleanName} ฟิวแฟน${provinceName} นัดพบแถว${loc}`,
    `น้อง${cleanName} รับงาน${provinceName} ดูแลเอาใจใส่${loc}`
  ];
  return patterns[index % patterns.length];
}

const renderCardHtml = (p, isPriorityLCP = false, provinceName = "เชียงใหม่", index = 0) => {
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
       <!-- 🟢 เพิ่ม height="560" แล้วเพื่อแก้ปัญหา CLS -->
       <img src="${cardImg}" 
              alt="${generateNaturalAlt(cleanName, provinceName, loc, index)}"
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
        <div style="font-size: 13px; font-weight: 800; color: #7C3AED; margin-bottom: 4px;">
            Q: ${escapeHTML(sanitizeThaiText(f.q))}
        </div>
        <div style="font-size: 12px; color: var(--text-gray, #4A4458); line-height: 1.5;">
            ${escapeHTML(sanitizeThaiText(f.a))}
        </div>
    </div>
  `).join("");
};

export default async (req, context) => {
  try {
    const url = new URL(req.url);
    const primaryDomain = CONFIG.PRIMARY_DOMAIN;

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

    if (req.headers.get("x-ssr-bypass") === "true" || STATIC_EXT_REGEX.test(url.pathname)) {
      return await context.next();
    }

   const cleanPath = url.pathname.toLowerCase().replace(/\/+$/, "") || "/";
    
    // 🟢 เติม "/sideline" เข้าไปตรงนี้ เพื่อให้ข้ามไปทำงานที่ไฟล์ render-bot.js
    if (["/about", "/faq", "/blog", "/contact", "/terms-of-service", "/privacy-policy", "/locations", "/nimman", "/offline", "/profile", "/sideline"].some(p => cleanPath === p || cleanPath.startsWith(p + "/"))) {
      return await context.next();
    }

    if (url.pathname === "/index.html") {
      return Response.redirect(`${primaryDomain}/`, 301);
    }

    const isForceRefresh = url.searchParams.get("refresh") === CONFIG.PURGE_SECRET || url.searchParams.has("purge");

    const cacheKey = `${req.method}:${cleanPath}`;
    const cachedPage = PAGE_CACHE.get(cacheKey);
    if (!isForceRefresh && cachedPage && cachedPage.version === GLOBAL_VERSION) {
      PAGE_CACHE.delete(cacheKey);
      PAGE_CACHE.set(cacheKey, cachedPage);
      return new Response(cachedPage.html, { headers: cachedPage.headers });
    }
    
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
      } catch (_err) {
        provinceSlug = segments[1].toLowerCase();
      }
    } else {
      const lastSeg = segments[segments.length - 1] || "";
      try {
        provinceSlug = decodeURIComponent(lastSeg).toLowerCase();
      } catch (_err) {
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

    // 🟢 B: ปรับ Meta Title และ Description ให้พรีเมียม ปลอดภัย CTR สูง
const metaTitle = isNational 
  ? "เพื่อนเที่ยว & ไซด์ไลน์ทั่วไทย สาวสวยฟิวแฟนตรงปก จ่ายหน้างาน | FirstModelHub"
  : `เพื่อนเที่ยว${provinceNameThai} ไซด์ไลน์ สาวสวยฟิวแฟนตรงปก จ่ายหน้างาน | FirstModelHub`;

const metaDescription = isNational
  ? "ศูนย์รวมเพื่อนเที่ยวและไซด์ไลน์ทั่วไทย สไตล์ฟิวแฟน (GFE) ครอบคลุมทุกจังหวัด การันตีตัวจริงตรงปก 100% ปลอดภัยนัดเจอจ่ายหน้างาน ไร้กังวลเรื่องโอนมัดจำล่วงหน้า"
  : `ศูนย์รวมเพื่อนเที่ยวและไซด์ไลน์${provinceNameThai} สไตล์ฟิวแฟน (GFE) คัดสรรสาวสวยตรงปก 100% ปลอดภัยนัดพบจ่ายหน้างาน ปราศจากการโอนเงินมัดจำล่วงหน้าทุกกรณี`;


    const cleanMetaDesc = stripHTML(metaDescription);
    const mapZoom = isNational ? 6 : 12;
    const mapQuery = isNational ? encodeURIComponent("ประเทศไทย") : encodeURIComponent(`จังหวัด${provinceNameThai}`);
    const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;
    const cleanZonesList = (seoData.zones || []).map(sanitizeThaiText).filter(z => z && z !== "ทั้งหมด" && z !== "all");

    // 🟢 B: ปรับแต่ง Schema Graph ระดับพรีเมียม (จัดการชื่อวิกิพีเดียให้เป๊ะ)
    const wikiTarget = provinceNameThai === "กรุงเทพฯ" ? "กรุงเทพมหานคร" : `จังหวัด${provinceNameThai}`;
    const provinceWikiUrl = isNational 
      ? "https://th.wikipedia.org/wiki/ประเทศไทย" 
      : `https://th.wikipedia.org/wiki/${encodeURIComponent(wikiTarget)}`;

const schemaGraph = [
  {
    "@type": "Organization",
    "@id": `${primaryDomain}/#organization`,
    "name": CONFIG.BRAND_NAME,
    "legalName": CONFIG.BRAND_LEGAL_NAME,
    "url": primaryDomain,
    "logo": {
      "@type": "ImageObject",
      "@id": `${primaryDomain}/#logo`,
      "url": `${primaryDomain}/images/firstmodelhub.webp`,
      "caption": CONFIG.BRAND_NAME
    },
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
    "inLanguage": "th-TH"
  },
  {
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#webpage`,
    "name": escapeHTML(metaTitle),
    "description": cleanMetaDesc,
    "url": canonicalUrl,
    "inLanguage": "th-TH",
    "isPartOf": { "@id": `${primaryDomain}/#website` },
    "about": { "@id": `${canonicalUrl}#business` },
    ...(isNational ? {} : { "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` } }),
    ...(profilesList.length > 0 ? { "mainEntity": { "@id": `${canonicalUrl}#itemlist` } } : {})
  },
  {
    "@type": ["EntertainmentBusiness", "ProfessionalService"],
    "@id": `${canonicalUrl}#business`,
    "name": isNational 
      ? `ศูนย์รวมเพื่อนเที่ยวและไซด์ไลน์ฟิวแฟน ทั่วไทย - ${CONFIG.BRAND_NAME}` 
      : `บริการเพื่อนเที่ยวและไซด์ไลน์ฟิวแฟน ${provinceNameThai} - ${CONFIG.BRAND_NAME}`,
    "image": heroImage,
    "telephone": CONFIG.DEFAULT_TELEPHONE,
    "priceRange": "฿฿",
    "url": canonicalUrl,
    "description": cleanMetaDesc,
    "knowsAbout": [
      "Personal Lifestyle Companion",
      "Girlfriend Experience (GFE)",
      `เพื่อนเที่ยวฟิวแฟน ${provinceNameThai}`,
      "บริการเพื่อนทานข้าวและออกงานสังคม",
      "นัดพบจ่ายหน้างานปลอดภัยไร้มัดจำ"
    ],
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
    "areaServed": isNational 
      ? { 
          "@type": "Country", 
          "name": "Thailand",
          "sameAs": provinceWikiUrl
        } 
      : [
          { 
            "@type": "AdministrativeArea", 
            "name": provinceNameThai,
            "sameAs": provinceWikiUrl
          },
          // 🟢 ตัดคำว่า "โซน" ออก ให้เหลือชื่อย่านจริงตามมาตรฐาน Geographical Entity
          ...cleanZonesList.map(z => ({ "@type": "AdministrativeArea", "name": z }))
        ]
  }
];

// 🟢 ปรับชื่อ Breadcrumb ให้ตรงกันกับ Meta Title และหน้า Profile ย่อย
if (!isNational) {
  schemaGraph.push({
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "หน้าแรก",
        "item": primaryDomain
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `เพื่อนเที่ยวฟิวแฟน${provinceNameThai}`,
        "item": canonicalUrl
      }
    ]
  });
}

    const allCardsHtml = profilesList.map((p, i) => renderCardHtml(p, i === 0, provinceNameThai, i)).join("");
    const featuredCardsHtml = profilesList.filter(p => p.isfeatured).slice(0, 12).map((p, i) => renderCardHtml(p, i === 0, provinceNameThai, i)).join("");

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
    const linkedIntro = smartLinkify(introText, 4, seoData.zones, provinceSlug);

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

   const ssrH1Html = isNational ? `<span class="h1-line-1">เพื่อนเที่ยว & ไซด์ไลน์ทั่วไทย</span>\n <span class="h1-line-2">สาวสวยสไตล์ฟิวแฟน ตรงปก 100%</span>` : `<span class="h1-line-1">เพื่อนเที่ยว & ไซด์ไลน์${escapeHTML(provinceNameThai)}</span>\n <span class="h1-line-2">สาวสวยสไตล์ฟิวแฟน ตรงปก 100%</span>`;

    finalHtml = finalHtml.replace(/<h1[^>]*id=["']hero-h1["'][^>]*>[\s\S]*?<\/h1>|<h1\s+class=["']seo-h1-title["'][^>]*>[\s\S]*?<\/h1>/i, `<h1 class="seo-h1-title" id="hero-h1">${ssrH1Html}</h1>`);

    const ssrFeaturedH2 = `น้องๆ รับงาน <span class="province-name-highlight">ไซด์ไลน์${escapeHTML(provinceNameThai)}</span>`;
    finalHtml = finalHtml.replace(/<h2 id="featured-heading"[^>]*>[\s\S]*?<\/h2>/i, `<h2 id="featured-heading" class="clean-section-h2">${ssrFeaturedH2}</h2>`);

    const totalProvincesFromDb = allProvincesRes?.data ? allProvincesRes.data.length : 0;
    finalHtml = finalHtml.replace(/<strong\b[^>]*\bid=["']live-profile-count["'][^>]*>[\s\S]*?<\/strong>/i, `<strong class="stat-number" id="live-profile-count">${exactCount}</strong>`);
    finalHtml = finalHtml.replace(/<strong\b[^>]*\bid=["']live-province-count["'][^>]*>[\s\S]*?<\/strong>/i, `<strong class="stat-number" id="live-province-count">${isNational ? totalProvincesFromDb : 1}</strong>`);

    const topStoryProfiles = profilesList.slice(0, 10);
    const renderStoryItem = (p, idx, isClone = false) => {
      const sName = escapeHTML((p.name || "น้อง").trim().replace(/^(น้อง\s?)+/gi, ""));
      const sSlug = encodeURIComponent(p.slug || p.id);
      const sImg = optimizeImg(p.imagePath || p.image_url || "", 120, 120);
      const hiddenAttr = isClone ? 'aria-hidden="true" tabindex="-1"' : '';
      return `
        <a href="/sideline/${sSlug}" class="story-item-el interactive-card" data-profile-id="${p.id}" data-profile-slug="${sSlug}" aria-label="${isClone ? '' : `ดูโปรไฟล์ น้อง${sName}`}" ${hiddenAttr}>
          <div class="story-ring-wrap">
            <div class="story-ring-glow">
              <img src="${sImg}" alt="${sName}" loading="${idx < 4 && !isClone ? "eager" : "lazy"}" decoding="async" width="52" height="52" onerror="this.onerror=null; this.src='https://firstmodelhub.com/images/firstmodelhub.webp';">
            </div>
            <span class="story-status-dot online" aria-hidden="true"></span>
          </div>
          <span class="story-label">${sName}</span>
        </a>
      `;
    };

    const primaryStoriesHtml = topStoryProfiles.map((p, idx) => renderStoryItem(p, idx, false)).join("");
    const cloneStoriesHtml = topStoryProfiles.map((p, idx) => renderStoryItem(p, idx, true)).join("");
    const ssrStoriesHtml = primaryStoriesHtml + cloneStoriesHtml;

    if (ssrStoriesHtml) {
      finalHtml = finalHtml.replace(/<div class="stories-track-inner" id="agency-stories-track">[\s\S]*?<\/div>/i, `<div class="stories-track-inner" id="agency-stories-track">${ssrStoriesHtml}</div>`);
    }

    const schemaJsonStr = JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }).replace(/</g, "\\u003c");
    finalHtml = finalHtml.replace(/<script type="application\/ld\+json" id="dynamic-schema">[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="dynamic-schema">\n${schemaJsonStr}\n<\/script>`);

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
        const allCardsInProv = groupedByProvince[pKey];
        const pCount = allCardsInProv.length;
        const topCards = allCardsInProv.slice(0, 4);
        const pCards = topCards.map((p) => renderCardHtml(p, false, pName)).join("");

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
            ${pCount > 4 ? `
              <div style="text-align: center; margin-top: 12px;">
                <a href="/location/${pKey}" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.2); color: #7C3AED; padding: 7px 18px; border-radius: 100px; font-size: 11.5px; font-weight: 800; text-decoration: none;">
                  ดูน้องๆ รับงานโซน${escapeHTML(pName)} ทั้งหมด (${pCount} คน) <i class="fas fa-arrow-right"></i>
                </a>
              </div>
            ` : ""}
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

    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_NAME}}", provinceNameThai);
    finalHtml = replaceGlobal(finalHtml, "{{PROFILE_COUNT}}", exactCount);
    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_ZONES}}", zonesStr || "ทุกพื้นที่");
    finalHtml = replaceGlobal(finalHtml, "{{SEO_CANONICAL}}", canonicalUrl);
    finalHtml = replaceGlobal(finalHtml, "{{SEO_IMAGE}}", heroImage);
    finalHtml = replaceGlobal(finalHtml, "{{MAP_EMBED_URL}}", mapEmbedUrl);
    finalHtml = replaceGlobal(finalHtml, "{{PROFILES_CARDS_HTML}}", "");
    finalHtml = replaceGlobal(finalHtml, "{{PROFILES_DISPLAY_AREA_HTML}}", "");

    finalHtml = finalHtml.replace(/\{\{[A-Z0-9_]+\}\}/g, "");
    finalHtml = finalHtml.replace(/\/main\.js\?v=\d+/g, `/main.js?v=${GLOBAL_VERSION}`);

   const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400",
      "Netlify-CDN-Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400",
      "ETag": `"${GLOBAL_VERSION}"`,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };

setSafePageCache(cacheKey, { html: finalHtml, headers: responseHeaders, version: GLOBAL_VERSION });
return new Response(finalHtml, { headers: responseHeaders });

  } catch (err) {
    console.error("SSR Edge Function Error:", err);
    return await context.next();
  }
};
