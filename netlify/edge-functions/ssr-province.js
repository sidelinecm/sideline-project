
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const PAGE_CACHE = new Map();
const MAX_CACHE_SIZE = 300;

let GLOBAL_LAST_TIMESTAMP = "initial_v1";
let LAST_PROBE_TIME = 0;
const PROBE_THROTTLE_MS = 15 * 1000;

let TEMPLATE_HTML_CACHE = null;
let TEMPLATE_CACHE_TIMESTAMP = 0;
const TEMPLATE_CACHE_TTL_MS = 60 * 60 * 1000;

const STATIC_EXT_REGEX = /\.(css|js|png|jpg|jpeg|webp|avif|svg|ico|json|webmanifest|map|woff|woff2|ttf|txt|xml)$/i;

const CONFIG = {
  get SUPABASE_URL() {
    try { return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co"; } catch { return "https://zxetzqwjaiumqhrpumln.supabase.co"; }
  },
  get SUPABASE_KEY() {
    try { return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; } catch { return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
  },
  PRIMARY_DOMAIN: "https://firstmodelhub.com",
  CLOUDINARY_CLOUD_NAME: "drffioary",
  CLOUDINARY_BASE_URL: "https://res.cloudinary.com/drffioary/image/upload/",
  BRAND_NAME: "FirstModelHub",
  BRAND_LEGAL_NAME: "FirstModelHub Co., Ltd.",
  DEFAULT_OG_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp",
  DEFAULT_TELEPHONE: "+66926997044",
  DISPLAY_LINE_ID: "LINE: @firstmodelhub",
  SOCIAL_LINKS: {
    line: "https://line.me/ti/p/ksLUWB89Y_",
    tiktok: "https://tiktok.com/@sidelinecm",
    twitter: "https://twitter.com/sidelinechiangmai",
    linkedin: "https://www.linkedin.com/in/cuteti-sexythailand-398567280?trk=contact-info",
    biosite: "https://bio.site/firstfiwfans.com",
    linktree: "https://linktr.ee/kissmodel",
    bluesky: "https://bsky.app/profile/sidelinechiangmai.bsky.social"
  }
};

const REVIEW_POOL = [
  { author: "คุณชลสิทธิ์ (C.)", rating: 5, template: "นัดเจอน้องใน{PROVINCE} เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบ First Model Hub ไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับ" },
  { author: "คุณอภิชาติ (A.)", rating: 5, template: "น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยมเสมือนมีเพื่อนร่วมทางคนพิเศษคอยเคียงข้าง ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ" },
  { author: "คุณกอล์ฟ (G.)", rating: 5, template: "คุยง่ายเป็นกันเองมากครับ น้องน่ารักสไตล์ผู้ดี แนะนำเลยสำหรับพิกัดใน{PROVINCE} ไม่ผิดหวังแน่นอนครับ" },
  { author: "พี่แม็กซ์ (M.)", rating: 5, template: "น้องคุยสนุก ตลก น่ารักเป็นกันเอง ดูแลดีตั้งแต่เริ่มจนจบ จ่ายหน้างานตามจริงสบายใจสุดๆ ครับ" },
  { author: "คุณเจ (J.)", rating: 5, template: "ฟีลดีอบอุ่นมากครับ สุภาพเรียบร้อย ดูแลดีตลอดเวลาที่อยู่ด้วยกัน ปลอดภัยไร้มัดจำ 100%" },
  { author: "พี่บอล (B.)", rating: 5, template: "ตรงปกมากครับ น้องบริการดีเยี่ยม ฟิวแฟนแท้ๆ เลย แนะนำเพื่อนๆ ใน{PROVINCE} เลยครับ" },
  { author: "คุณเอก (E.)", rating: 5, template: "น้องเอาใจเก่งมาก สวยสมราคา จองง่ายผ่านไลน์แล้วเจอตัวจริงหน้างาน ประทับใจมากครับ" },
  { author: "พี่ยอด (Y.)", rating: 5, template: "ตรงเวลาดีครับ สุภาพเรียบร้อย นิสัยดีตรงตามรูปภาพในโปรไฟล์ทุกอย่างเลยครับ" }
];

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
  khonkaen: {
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
      { q: "นัดหมายสาวรับงานเชียงใหม่ บน First Model Hub โซนไหนสะดวกที่สุด?", a: "ถนนนิมมานเหมินท์, สันติธรรม, ช้างเผือก และรอบคอนโดมิเนียมย่านเจ็ดยอด เป็นพิกัดหลักที่มีน้องๆ สแตนด์บายพร้อมดูแลท่านอย่างสะดวกรวดเร็ว" },
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
      { q: "นัดหมายสาวรับงานเชียงราย โซนบ้านดู่ และ มฟล. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำอยู่ในโซนบ้านดู่ หน้ามหาวิทยาลัยแม่ฟ้าหลวง และใจกลางเมืองเชียงราย พร้อมดูแลอย่างเป็นกันเอง" }
    ]
  },
  khonkaen: {
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
    geo: { lat: 18.7883, lng: 98.9853 },
    zones: ["เชียงใหม่", "ขอนแก่น", "เชียงราย", "ลำปาง", "อุดรธานี", "ภูเก็ต"],
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
  
  const DEFAULT_FALLBACK_SHELL = `<!DOCTYPE html>
<html lang="th" class="dark-theme dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>First Model Hub - ศูนย์รวมเพื่อนเที่ยวและสาวรับงานพรีเมียม</title>
  <meta name="description" content="ศูนย์รวมสาวรับงาน และเพื่อนเที่ยวไซด์ไลน์พรีเมียมสไตล์ฟิวแฟน ยืนยันตัวตนตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ" />
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
      return DEFAULT_FALLBACK_SHELL;
    }
  }
  
  return TEMPLATE_HTML_CACHE || DEFAULT_FALLBACK_SHELL;
}

const escapeHTML = str => (str !== null && str !== undefined) ? String(str).replace(/[&<>'"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[m] || m)) : "";
const stripHTML = str => (str !== null && str !== undefined) ? String(str).replace(/<[^>]*>?/gm, "").trim() : "";
const replaceGlobal = (source, target, replacement) => source.split(target).join(replacement);

const optimizeImg = (hostUrl, path, width = 400, height = 500) => {
  if (!path || typeof path !== "string" || !path.trim()) {
    return `${CONFIG.PRIMARY_DOMAIN}/images/firstmodelhub.webp`;
  }
  const cleanPath = path.trim();
  const transform = height 
    ? `f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face` 
    : `f_auto,q_auto:eco,w_${width},c_scale`;

  if (cleanPath.includes("res.cloudinary.com")) {
    const uploadIdx = cleanPath.indexOf("/upload/");
    if (uploadIdx !== -1) {
      const prefix = cleanPath.substring(0, uploadIdx + 8);
      let afterUpload = cleanPath.substring(uploadIdx + 8);

      afterUpload = afterUpload.replace(/^(?:[a-z]{1,4}_[a-z0-9_:-]+,?)+\//i, "");

      if (!afterUpload.includes("images/") && !afterUpload.startsWith("images/")) {
        afterUpload = `images/${afterUpload.replace(/^v\d+\//i, "")}`;
      }

      return `${prefix}${transform}/${afterUpload}`;
    }
    return cleanPath;
  }

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  let relPath = cleanPath.replace(/^\/+/, "");
  if (!relPath.startsWith("images/")) {
    relPath = `images/${relPath}`;
  }

  return `${CONFIG.CLOUDINARY_BASE_URL}${transform}/${relPath}`;
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
    zones.slice(0, 5).forEach(zone => {
      if (!zone || zone === "ทั้งหมด") return;
      const cleanZone = sanitizeThaiText(zone);
      const regex = new RegExp(`(${cleanZone})(?![^<]*>|[^<>]*<\\/a>)`, "g");
      res = res.replace(regex, `<a href="${targetUrl}" class="kw-zone">$1</a>`);
    });
  }
  
  const serviceRegex = /(สาวรับงาน|ไซด์ไลน์|เด็กเอ็น|เพื่อนเที่ยว|รับงาน|ฟิวแฟน|ฟีลแฟน)(?![^<]*>|[^<>]*<\/a>)/g;
  res = res.replace(serviceRegex, `<strong class="kw-purple">$1</strong>`);

  const safetyRegex = /(ไม่โอนมัดจำ|จ่ายหน้างาน 100%|ตรงปก 100%|ความปลอดภัยสูงสุด|นัดเจอตัวจริง)(?![^<]*>|[^<>]*<\/a>)/g;
  res = res.replace(safetyRegex, `<strong class="kw-green">$1</strong>`);

  const warnRegex = /(ไม่โอนเงินมัดจำล่วงหน้าทุกกรณี|ห้ามโอนเงินก่อน|ปราศจากการเรียกเก็บเงิน)(?![^<]*>|[^<>]*<\/a>)/g;
  res = res.replace(warnRegex, `<strong class="kw-red">$1</strong>`);

  return res;
};

const getDynamicIntro = (provinceName, zones, provinceSlug = "chiangmai") => {
  let processedZones = zones && Array.isArray(zones) ? zones.filter(z => z && z !== "ทั้งหมด") : [];
  const targetUrl = (provinceSlug && provinceSlug !== "national") ? `/location/${provinceSlug}` : "/";
  const zoneLinks = processedZones.slice(0, 5).map(zone => 
    `<a href="${targetUrl}" class="kw-zone">${escapeHTML(sanitizeThaiText(zone))}</a>`
  );
  const zoneSnippet = zoneLinks.length > 0 ? ` ครอบคลุมพิกัดสำคัญ เช่น โซน ${zoneLinks.join(", โซน ")}` : " ครอบคลุมเขตตัวเมืองและบริเวณใกล้เคียง";

  return `
    <p>ยินดีต้อนรับสู่ <strong>${CONFIG.BRAND_NAME}</strong> แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ <strong class="kw-purple">สาวรับงาน${provinceName}</strong>, <strong class="kw-purple">เด็กเอ็น${provinceName}</strong> และ <strong class="kw-purple">เพื่อนเที่ยวไซด์ไลน์${provinceName}</strong> แหล่งรวบรวมโปรไฟล์ผู้ดูแลระดับพรีเมียมที่เน้นความโปร่งใส ปลอดภัย และเพียบพร้อมด้วยการดูแลเอาใจใส่สไตล์ <strong class="kw-purple">ฟิวแฟน (Girlfriend Experience - GFE)</strong> อย่างสุภาพเรียบร้อยเป็นธรรมชาติ ปราศจากเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี</p>
    <p>เพื่อตอบสนองความสะดวกในการนัดหมายพิกัดบริการในพื้นที่ ${provinceName} น้องๆ ในระบบของเรากระจายตัวอยู่ในจุดที่เหมาะสม${zoneSnippet} ไม่ว่าจะเป็นโรงแรมชั้นนำ คอนโดมิเนียมส่วนตัว หรือพิกัดยอดนิยม เดินทางสะดวกสบายและมีความปลอดภัยสูง พร้อมร่วมเดินทางท่องเที่ยว ทานอาหาร หรือพูดคุยเพื่อสร้างความผ่อนคลายและคลายเหงาให้แก่คุณในโอกาสพิเศษ</p>
    <p>รูปภาพและข้อมูลรายละเอียดสัดส่วนของน้องๆ ได้รับการคัดกรองและตรวจสอบยืนยันตัวตน (Verified System) อย่างรอบคอบ เพื่อให้สมาชิกมั่นใจได้ว่าข้อมูลถูกต้อง <strong class="kw-green">ตรงตามปก 100%</strong> ปลอดภัยนัดเจอ <strong class="kw-green">ชำระหน้างาน</strong> ไม่มีความเสี่ยงทางการเงินทุกกรณีครับ</p>
  `;
};

const getDeterministicReviews = (provinceSlug, provinceName) => {
  const seed = String(provinceSlug || "national");
  const charCodeSum = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const poolLength = REVIEW_POOL.length;
  const t = new Date();

  const selectedReviews = [];
  const usedIndices = new Set();

  for (let i = 0; i < 2; i++) {
    let index = (charCodeSum + i * 3) % poolLength;
    while (usedIndices.has(index) && usedIndices.size < poolLength) {
      index = (index + 1) % poolLength;
    }
    usedIndices.add(index);

    const baseReview = REVIEW_POOL[index];
    const reviewText = baseReview.template.replace(/\{PROVINCE\}/g, provinceName);
    const publishedOffset = (i + 1) * 7 * 24 * 60 * 60 * 1000;

    selectedReviews.push({
      author: baseReview.author,
      location: `โซนยอดนิยมใน${provinceName}`,
      text: reviewText,
      rating: baseReview.rating,
      date: i === 0 ? "เมื่อสัปดาห์ที่แล้ว" : "เมื่อ 2 สัปดาห์ก่อน",
      datePublished: new Date(t.getTime() - publishedOffset).toISOString().split("T")[0]
    });
  }

  return selectedReviews;
};

function customMetaTitle(province, customMeta) {
  if (customMeta && customMeta.title) return customMeta.title;
  return `สาวรับงาน${province} ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub`;
}

function customMetaDesc(province, seo, customMeta, topSnippetText = "") {
  if (customMeta && customMeta.desc) return customMeta.desc;
  const zonesText = seo.zones && seo.zones.length > 0 ? seo.zones.filter(z => z !== "ทั้งหมด").slice(0, 3).map(sanitizeThaiText).join(", ") : province;
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
  const rawImg = profile.imagePath || profile.image_url || profile.photo || "";

  return {
    "@type": "Person",
    "@id": `${targetUrl}/#person`,
    "name": `น้อง${cleanName}`,
    "url": targetUrl,
    "image": optimizeImg(hostUrl, rawImg, 800, 1067),
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

const renderCardHtml = (p, index, hostUrl, provinceThaiName) => {
  const pName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/gi, ""));
  const pLoc = escapeHTML(sanitizeThaiText(p.location) || provinceThaiName);
  const pSlug = p.slug ? encodeURIComponent(p.slug) : p.id;
  const pUrl = `/sideline/${pSlug}`;
  
  const availRaw = (p.availability || p.status || "").trim();
  let statusDotColor = "#00E676";
  let statusText = "รับงาน";

  if (availRaw.includes("สอบถาม") || availRaw.includes("จอง") || availRaw.includes("คิว")) {
    statusDotColor = "#FBBF24";
    statusText = "สอบถามคิว";
  } else if (["ไม่ว่าง", "ติดจอง", "พัก", "หยุด", "off", "busy", "not_available"].some(k => availRaw.toLowerCase().includes(k))) {
    statusDotColor = "#FF2E63";
    statusText = "ไม่ว่าง";
  } else {
    statusDotColor = "#00E676";
    statusText = "รับงาน";
  }

  const ageDisplay = p.age && p.age !== "-" ? ` ${escapeHTML(p.age)}` : "";
  
  let statsDisplay = p.stats || p.proportion || "";
  const bustVal = p.bust || "";
  const waistVal = p.waist || "";
  const hipsVal = p.hips || "";
  const cupVal = (p.cup_size || p.cupSize || "").toString().toUpperCase().trim();
  if (bustVal && waistVal && hipsVal) {
    statsDisplay = `${bustVal}${cupVal ? cupVal : ''}-${waistVal}-${hipsVal}`;
  }
  const statsSnippet = statsDisplay ? `สัดส่วน ${statsDisplay}` : "รูปร่างสมส่วน";
  const heightSnippet = p.height ? `สูง ${p.height}ซม.` : "";
  const seoAltText = `น้อง${pName}${ageDisplay ? ` อายุ${ageDisplay}ปี` : ""} สาวรับงาน${provinceThaiName} ${statsSnippet} ${heightSnippet} ย่าน${pLoc} ฟิวแฟนตรงปก 100% ไม่มัดจำ`;

  const rawImg = p.imagePath || p.image_url || p.imageUrl || p.photo || p.avatar || "";
  const imgUrl = optimizeImg(hostUrl, rawImg, 400, 500);

  const featuredBadge = p.isfeatured
    ? `<span style="background: rgba(90, 44, 190, 0.88); border: 1px solid rgba(192, 132, 252, 0.5); color: #FFFFFF; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
        <i class="fas fa-star" style="font-size: 6.5px; color: #FBBF24;"></i>
        <span style="letter-spacing: 0.02em;">แนะนำ</span>
       </span>`
    : "";

  const statusBadge = `
    <span style="background: rgba(9, 9, 11, 0.82); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
        <span style="width: 5px; height: 5px; border-radius: 50%; background-color: ${statusDotColor}; box-shadow: 0 0 6px ${statusDotColor}; flex-shrink: 0;"></span>
        <span style="letter-spacing: 0.02em;">${statusText}</span>
    </span>
  `;

  const hasVideo = p.has_video || p.hasVideo || false;
  const videoBadge = hasVideo
    ? `<span style="background: rgba(255, 46, 99, 0.35); border: 1px solid rgba(255, 46, 99, 0.6); color: #FF2E63; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
        <i class="fas fa-video" style="font-size: 6.5px;"></i> คลิป
       </span>`
    : "";

  const isVerified = p.verified || p.isVerified || false;
  const verifiedBadge = isVerified
    ? `<span style="background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(52, 211, 153, 0.55); color: #00E676; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
        <i class="fas fa-check-circle" style="font-size: 7.5px; color: #00E676;"></i> ยืนยันตัวตน
       </span>`
    : "";

  let rateDisplay = "1,500.-";
  if (p.rate) {
    if (!isNaN(p.rate)) rateDisplay = `${Number(p.rate).toLocaleString()}.-`;
    else rateDisplay = escapeHTML(p.rate).trim();
  }

  const sloganText = escapeHTML(sanitizeThaiText(p.slogan || p.quote || ""));

  return `
    <div class="profile-card-new-container" >
      <article class="profile-card-new interactive-card"
           data-profile-id="${p.id}"
           data-profile-slug="${escapeHTML(p.slug || p.id)}"
           style="aspect-ratio: 4 / 5; width: 100%; position: relative; border-radius: 16px; overflow: hidden; background-color: #09090B; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); cursor: pointer;">
          
          <img src="${imgUrl}" 
               alt="${seoAltText}"
               title="${seoAltText}"
               width="300"
               height="400"
               style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; filter: brightness(0.96); transition: transform 0.4s ease, opacity 0.5s; opacity: 1; z-index: 0; border-radius: 16px;"
               loading="${index === 0 ? "eager" : "lazy"}"
               fetchpriority="${index === 0 ? "high" : "auto"}"
               decoding="async"
               onerror="this.onerror=null; this.src='https://firstmodelhub.com/images/firstmodelhub.webp';" />
               
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

  const staticPages = [
    "/about", "/about.html",
    "/faq", "/faq.html",
    "/blog", "/blog.html",
    "/contact", "/contact.html",
    "/terms-of-service", "/terms-of-service.html",
    "/privacy-policy", "/privacy-policy.html",
    "/policy", "/policy.html",
    "/locations", "/locations.html",
    "/nimman", "/nimman.html",
    "/index-en", "/index-en.html",
    "/offline", "/offline.html",
    "/llms.txt"
  ];
  
  const currentPath = url.pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (staticPages.some(page => currentPath === page || currentPath.startsWith(page + "/"))) {
    try { return await context.next(); } catch { return await context.next(); }
  }

  if (url.pathname === "/index.html") {
    return Response.redirect(`${hostUrl}/`, 301);
  }

  const now = Date.now();
  const forceRefresh = url.searchParams.has("refresh") || url.searchParams.has("purge") || url.searchParams.has("clear_cache");
  if (forceRefresh) {
    PAGE_CACHE.clear();
    GLOBAL_LAST_TIMESTAMP = `forced_${now}`;
  }

  const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

  if (!forceRefresh && (now - LAST_PROBE_TIME > PROBE_THROTTLE_MS)) {
    LAST_PROBE_TIME = now;
    try {
      const { data: latestRow } = await supabase
        .from("profiles")
        .select("lastUpdated, created_at")
        .order("lastUpdated", { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();

      const currentDbTime = latestRow?.lastUpdated || latestRow?.created_at || "v1";

      if (currentDbTime !== GLOBAL_LAST_TIMESTAMP) {
        PAGE_CACHE.clear();
        GLOBAL_LAST_TIMESTAMP = currentDbTime;
      }
    } catch (e) {}
  }

  const cacheKey = `${req.method}:${url.pathname}`;
  const cachedItem = PAGE_CACHE.get(cacheKey);

  if (!forceRefresh && cachedItem && cachedItem.version === GLOBAL_LAST_TIMESTAMP) {
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
    let matchedProfile = null;
    if (profileSlug) {
      const isNumeric = /^\d+$/.test(profileSlug);
      const filterQuery = isNumeric ? `slug.eq.${profileSlug},id.eq.${profileSlug}` : `slug.eq.${profileSlug}`;
      
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .or(filterQuery)
        .eq("active", true)
        .maybeSingle();

      if (profileData && !profileErr) {
        matchedProfile = profileData;
        provinceSlug = profileData.provinceKey || profileData.province_key || profileData.province_slug || "chiangmai";
      } else {
        return buildErrorPage(404, "404 - ไม่พบโปรไฟล์ที่ต้องการ", "โปรไฟล์น้องๆ รายนี้อาจถูกปิดการใช้งาน หรือระงับบริการชั่วคราวครับ");
      }
    }

    const cleanCompactSlug = provinceSlug.replace(/[-_]/g, "");
    let searchKeys = [
      provinceSlug,
      cleanCompactSlug,
      provinceSlug.replace(/-/g, "_"),
      provinceSlug.replace(/_/g, "-")
    ];
    searchKeys = [...new Set(searchKeys.filter(Boolean))];

    const provinceParam = provinceSlug.replace(/-/g, "").replace(/_/g, "");

    let profileQuery = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("active", true)
      .order("isfeatured", { ascending: false })
      .order("created_at", { ascending: false });

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
    const totalRealCount = (profListRes.count !== null && profListRes.count !== undefined) 
      ? profListRes.count 
      : profileList.length;

    const provinceThaiName = isNationalHome ? "ทั่วไทย" : (provinceData?.nameThai || "เชียงใหม่");
    const customMeta = isNationalHome ? null : (PROVINCE_CUSTOM_METADATA[provinceParam] || null);
    const seoData = isNationalHome ? PROVINCE_SEO_DATA.default : (PROVINCE_SEO_DATA[provinceParam] || PROVINCE_SEO_DATA.default);

    const canonUrl = matchedProfile 
      ? `${hostUrl}/sideline/${encodeURIComponent(profileSlug)}`
      : (isNationalHome ? hostUrl : `${hostUrl}/location/${provinceSlug}`);
    
    const rawMainImg = matchedProfile?.imagePath || matchedProfile?.image_url || (profileList.length > 0 ? (profileList[0].imagePath || profileList[0].image_url) : null);
    const metaImgUrl = rawMainImg ? optimizeImg(hostUrl, rawMainImg, 1200, 630) : `${CONFIG.PRIMARY_DOMAIN}/images/firstmodelhub.webp`;

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
      finalReviews = getDeterministicReviews(provinceSlug, provinceThaiName);
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
    const standardPlatformDesc = "ศูนย์รวมสารบัญผู้ดูแลและเพื่อนเที่ยวไซด์ไลน์พรีเมียมสไตล์ฟิวแฟน ยืนยันตัวตนตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมพิกัดทั่วไทย";
    const calculatedAvg = finalReviews.length > 0 
      ? (finalReviews.reduce((sum, rev) => sum + (Number(rev.rating) || 5), 0) / finalReviews.length) 
      : 5;
    const finalRatingValue = isNaN(calculatedAvg) ? "4.9" : calculatedAvg.toFixed(1);
    const finalReviewCount = finalReviews.length > 0 ? finalReviews.length : totalRealCount;

    const mapQueryStr = isNationalHome ? "ประเทศไทย" : provinceThaiName;
    const mapZoomLevel = isNationalHome ? 6 : 12;
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent("สาวรับงาน " + mapQueryStr)}&t=&z=${mapZoomLevel}&ie=UTF8&iwloc=&output=embed`;

    const validZones = (seoData.zones || [])
      .map(sanitizeThaiText)
      .filter(z => z && z !== "ทั้งหมด" && z !== "all");

    const businessEntity = {
      "@type": ["EntertainmentBusiness", "ProfessionalService"],
      "@id": `${canonUrl}/#business`,
      "name": isNationalHome ? `ศูนย์รวมไซด์ไลน์ สาวรับงาน เด็กเอ็น ฟิวแฟน ทั่วไทย - ${CONFIG.BRAND_NAME}` : `สาวรับงาน${provinceThaiName} เพื่อนเที่ยว${provinceThaiName} - ${CONFIG.BRAND_NAME}`,
      "image": metaImgUrl,
      "telephone": CONFIG.DEFAULT_TELEPHONE,
      "priceRange": "฿฿",
      "url": canonUrl,
      "description": standardPlatformDesc,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": isNationalHome ? "ประเทศไทย" : provinceThaiName,
        "addressRegion": isNationalHome ? "ประเทศไทย" : provinceThaiName,
        "addressCountry": "TH"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": seoData.geo?.lat || 13.7563,
        "longitude": seoData.geo?.lng || 100.5018
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
        "reviewCount": Number(finalReviewCount) || 1,
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
        "description": standardPlatformDesc,
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
      const cleanSlug = matchedProfile.slug ? encodeURIComponent(matchedProfile.slug) : matchedProfile.id;
      const profileUrl = `${hostUrl}/sideline/${cleanSlug}`;
      const cleanName = (matchedProfile.name || "").replace(/^น้อง\s?/, "").trim();

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

      if (profileList.length > 0) {
        schemaGraph.push({
          "@type": "ItemList",
          "@id": `${canonUrl}/#itemlist`,
          "name": `รายชื่อสาวรับงานและเพื่อนเที่ยว ${provinceThaiName}`,
          "numberOfItems": totalRealCount,
          "itemListElement": profileList.map((p, index) => {
            const pCleanName = (p.name || "").replace(/^น้อง\s?/, "").trim();
            const cleanSlug = p.slug ? encodeURIComponent(p.slug) : p.id;
            const itemUrl = `${hostUrl}/sideline/${cleanSlug}`;
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

    const cardsHtml = profileList.map((p, index) => renderCardHtml(p, index, hostUrl, provinceThaiName)).join("");
    const featuredProfilesList = profileList.filter(p => p.isfeatured === true).slice(0, 12);
    const featuredCardsHtml = featuredProfilesList.map((p, index) => renderCardHtml(p, index, hostUrl, provinceThaiName)).join("");

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
    const matchedZones = (seoData.zones || []).filter(z => z !== "ทั้งหมด").slice(0, 4).map(sanitizeThaiText).join(", ");
    
    const introTemplate = seoData.uniqueIntro || getDynamicIntro(provinceThaiName, seoData.zones, provinceSlug);
    const seoIntroContent = smartLinkify(introTemplate, 0, seoData.zones, provinceSlug);

    const popularLocationsHtml = provListRes.data ? provListRes.data.map(p => {
      const key = p.key || p.slug || p.id;
      const name = p.nameThai || p.name;
      const isActive = key === provinceSlug;
      
      let html = `<li><a href="/location/${key}" title="สาวรับงาน${name}" style="color: ${isActive ? 'var(--primary-purple)' : 'var(--text-gray)'}; text-decoration: none;" ${isActive ? 'class="active" aria-current="page"' : ''}>ไซด์ไลน์${name}</a></li>`;
      
      if (key === 'chiangmai') {
        html += `<li><a href="/nimman" title="สาวรับงานนิมมาน เชียงใหม่" style="color: #C084FC; text-decoration: none;">ไซด์ไลน์นิมมาน</a></li>`;
        html += `<li><a href="/location/chiangmai?q=สันติธรรม" title="สาวรับงานสันติธรรม เชียงใหม่" style="color: var(--text-muted); text-decoration: none;">ไซด์ไลน์สันติธรรม</a></li>`;
      }
      return html;
    }).join("") : "";

    let rawHtml = await getTemplateHtml(url, context);

    if (!/<base\s+/i.test(rawHtml)) {
      rawHtml = rawHtml.replace(/<head[^>]*>/i, (match) => `${match}\n  <base href="/" />`);
    }

    rawHtml = rawHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHTML(pageTitle)}</title>`);
    rawHtml = rawHtml.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHTML(strippedDesc)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHTML(pageTitle)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHTML(strippedDesc)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHTML(pageTitle)}" />`);
    rawHtml = rawHtml.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHTML(strippedDesc)}" />`);

    rawHtml = replaceGlobal(rawHtml, "{{SEO_CANONICAL}}", canonUrl);
    rawHtml = replaceGlobal(rawHtml, "{{SEO_IMAGE}}", metaImgUrl);
    
    if (rawHtml.includes('id="canonical-link"')) {
      rawHtml = rawHtml.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" id="canonical-link" href="${canonUrl}">`);
    }

    const schemaJsonString = JSON.stringify(schemaJson).replace(/</g, '\\u003c');
    const newSchemaScript = `<script type="application/ld+json" id="dynamic-schema">\n${schemaJsonString}\n</script>`;
    
    if (/<script type="application\/ld\+json" id="dynamic-schema">[\s\S]*?<\/script>/i.test(rawHtml)) {
      rawHtml = rawHtml.replace(/<script type="application\/ld\+json" id="dynamic-schema">[\s\S]*?<\/script>/i, newSchemaScript);
    } else if (rawHtml.includes("{{SCHEMA_JSON}}")) {
      rawHtml = replaceGlobal(rawHtml, "{{SCHEMA_JSON}}", schemaJsonString);
    } else {
      rawHtml = rawHtml.replace(/<\/head>/i, `${newSchemaScript}\n</head>`);
    }
    
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_NAME}}", provinceThaiName);
    rawHtml = replaceGlobal(rawHtml, "{{PROFILE_COUNT}}", totalRealCount);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_ZONES}}", matchedZones);
    rawHtml = replaceGlobal(rawHtml, "{{MAP_EMBED_URL}}", mapEmbedUrl);

    if (rawHtml.includes("{{PROVINCE_SEO_CONTENT}}")) {
      rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_SEO_CONTENT}}", seoIntroContent);
    } else {
      rawHtml = rawHtml.replace(
        /<div class="seo-content-inner">[\s\S]*?<\/div>/i,
        `<div class="seo-content-inner">${seoIntroContent}</div>`
      );
    }

    if (rawHtml.includes("{{PROVINCE_FAQS_HTML}}")) {
      rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_FAQS_HTML}}", faqsHtml);
    } else if (faqsHtml) {
      rawHtml = rawHtml.replace(
        /<div id="faq-container-list"[^>]*>[\s\S]*?<\/div>/i,
        `<div id="faq-container-list" class="faq-list-wrapper">${faqsHtml}</div>`
      );
    }

    if (rawHtml.includes("{{PROVINCE_REVIEWS_HTML}}")) {
      rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_REVIEWS_HTML}}", reviewsHtml);
    } else if (reviewsHtml) {
      rawHtml = rawHtml.replace(
        /<div id="reviews-container-grid"[^>]*>[\s\S]*?<\/div>/i,
        `<div id="reviews-container-grid" class="reviews-grid-wrapper">${reviewsHtml}</div>`
      );
    }

    const hotProfilesList = profileList.slice(0, 8);
    const hotSwiperHtml = hotProfilesList.map((p, idx) => {
      const pName = escapeHTML((p.name || "น้อง").trim().replace(/^(น้อง\s?)+/gi, ""));
      const pLoc = escapeHTML(sanitizeThaiText(p.location) || provinceThaiName);
      const cleanSlug = p.slug ? encodeURIComponent(p.slug) : p.id;
      const rawImg = p.imagePath || p.image_url || p.imageUrl || p.photo || "";
      const imgUrl = optimizeImg(hostUrl, rawImg, 400, 500);
      
      const availRawHot = (p.availability || p.status || "").trim();
      let isAvailHot = true;
      let availHotText = "รับงาน";

      if (availRawHot.includes("สอบถาม") || availRawHot.includes("จอง") || availRawHot.includes("คิว")) {
        isAvailHot = false;
        availHotText = "สอบถาม";
      } else if (["ไม่ว่าง", "ติดจอง", "พัก", "หยุด", "off", "busy", "not_available"].some(kw => availRawHot.toLowerCase().includes(kw))) {
        isAvailHot = false;
        availHotText = "ไม่ว่าง";
      }

      return `
        <div class="vip-card-item ${idx === 0 ? 'active-glow' : ''}" data-profile-id="${p.id}" data-profile-slug="${cleanSlug}">
          <span class="vip-status-chip">${isAvailHot ? '🟢 รับงาน' : '🟡 สอบถาม'}</span>
          <span class="hot-rank-badge">#${idx + 1} HOT</span>
          <img src="${imgUrl}" alt="น้อง${pName}" width="150" height="210" loading="${idx < 2 ? 'eager' : 'lazy'}" onerror="this.src='https://firstmodelhub.com/images/firstmodelhub.webp'">
          <div class="vip-card-overlay"></div>
          <a href="/sideline/${cleanSlug}" class="card-link" aria-label="ดูโปรไฟล์น้อง${pName}"></a>
          <div class="vip-card-info">
            <div class="vip-name">น้อง${pName}</div>
            <div class="vip-location">${pLoc}</div>
          </div>
        </div>
      `;
    }).join("");

    if (hotSwiperHtml) {
      rawHtml = rawHtml.replace(
        /<div id="vip-swiper-container"[^>]*>[\s\S]*?<\/div>/i,
        `<div id="vip-swiper-container" class="vip-swiper-wrapper" aria-label="สไลด์รายชื่อน้องๆ HOT แนะนำ">${hotSwiperHtml}</div>`
      );
    }

    if (!isNationalHome) {
      rawHtml = rawHtml.replace(/<section id="featured-profiles"[\s\S]*?<\/section>/i, "");
    } else {
      rawHtml = replaceGlobal(rawHtml, "{{PROFILES_CARDS_HTML}}", featuredCardsHtml);
    }

    let displayAreaInnerHtml = "";

    if (isNationalHome) {
      const grouped = profileList.reduce((acc, p) => {
        const key = (p.provinceKey || p.province_slug || "no_province").toString().toLowerCase();
        acc[key] = acc[key] || [];
        acc[key].push(p);
        return acc;
      }, {});

      const sortedProvinceKeys = Object.keys(grouped).sort((a, b) => {
        const nameA = PROVINCE_SEO_DATA[a]?.name || a;
        const nameB = PROVINCE_SEO_DATA[b]?.name || b;
        return nameA.localeCompare(nameB, "th");
      });

      let sectionsHtml = "";
      for (const key of sortedProvinceKeys) {
        const pName = PROVINCE_SEO_DATA[key]?.name || key;
        const countInProvince = grouped[key].length;
        const provinceCardsHtml = grouped[key].map((p, index) => renderCardHtml(p, index, hostUrl, pName)).join("");

        sectionsHtml += `
          <div class="section-content-wrapper province-section" id="province-${key}" style="margin-top: 24px;">
            <div style="padding: 8px 4px 12px 4px;">
                <a href="/location/${key}" class="group" style="text-decoration: none; display: inline-block;">
                    <h2 class="province-section-header" style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 18px; font-weight: 800; color: white; margin: 0;">
                        📍 น้องๆ ในจังหวัด <span style="color: #C084FC;">${pName}</span>
                        <span class="live-count-chip">
                          <span class="pulse-dot-el"></span>
                          <span>พบ ${countInProvince} โปรไฟล์พร้อมรับงาน</span>
                        </span>
                        <i class="fas fa-chevron-right" style="font-size: 12px; margin-left: 4px; color: var(--primary-purple);"></i>
                    </h2>
                </a>
            </div>
            <div class="profile-grid profiles-grid-row" >
              ${provinceCardsHtml}
            </div>
          </div>
        `;
      }
      displayAreaInnerHtml = sectionsHtml;

    } else {
      displayAreaInnerHtml = `
        <div class="section-content-wrapper" style="margin-top: 16px;">
          <div style="padding: 8px 4px 14px 4px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <h2 style="font-size: 18px; font-weight: 800; color: white; margin: 0; display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
                  📍 น้องๆ ในจังหวัด <span style="color: #C084FC;">${provinceThaiName}</span>
                  <span class="live-count-chip">
                    <span class="pulse-dot-el"></span>
                    <span>พบ ${totalRealCount} โปรไฟล์พร้อมรับงาน</span>
                  </span>
              </h2>
          </div>
          <div class="profile-grid profiles-grid-row" >
            ${cardsHtml}
          </div>
        </div>
      `;
    }

    if (rawHtml.includes("{{PROFILES_DISPLAY_AREA_HTML}}")) {
      rawHtml = replaceGlobal(rawHtml, "{{PROFILES_DISPLAY_AREA_HTML}}", displayAreaInnerHtml);
    } else {
      rawHtml = rawHtml.replace(
        /<div id="profiles-display-area"[^>]*>[\s\S]*?<\/div>\s*<\/div>/i,
        `<div id="profiles-display-area" role="region" aria-label="โปรไฟล์ผู้ดูแลและเพื่อนเที่ยว${provinceThaiName}">${displayAreaInnerHtml}</div>`
      );
    }

    const provinceOptionsHtml = `<option value="">🗺️ เลือกจังหวัด (ทั้งหมด)</option>` + 
      (provListRes.data || []).map(p => {
        const isSelected = p.key === provinceSlug ? 'selected' : '';
        return `<option value="${p.key}" ${isSelected}>${p.nameThai}</option>`;
      }).join("");

    rawHtml = rawHtml.replace(
      /<select id="search-province"[^>]*>[\s\S]*?<\/select>/i,
      `<select id="search-province" name="province" class="search-select-field" aria-label="เลือกจังหวัดที่ต้องการค้นหา">${provinceOptionsHtml}</select>`
    );

    if (popularLocationsHtml) {
      rawHtml = rawHtml.replace(
        /<ul id="popular-locations-footer"[^>]*>[\s\S]*?<\/ul>/i,
        `<ul id="popular-locations-footer" style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 12px; color: var(--text-gray);">${popularLocationsHtml}</ul>`
      );
    }

    rawHtml = rawHtml.replace(/(href|src|data-src)=["'](?!https?:\/\/|\/\/|\/|data:|blob:|#|javascript:|mailto:|tel:|\{\{)([^"']+)["']/gi, '$1="/$2"');

    const provThaiLookup = new Map();
    (provListRes.data || []).forEach(item => {
      const k = (item.key || item.slug || item.id || "").toString().toLowerCase();
      const n = item.nameThai || item.name_thai || item.name;
      if (k && n) provThaiLookup.set(k, n);
    });

    const hydratedProfilesData = JSON.stringify(profileList.map(p => {
      const pKey = (p.provinceKey || p.province_key || p.province_slug || "chiangmai").toString().toLowerCase();
      const realProvinceThai = p.provinceThai || p.province_thai || provThaiLookup.get(pKey) || provinceThaiName;

      let galleries = p.galleryPaths || p.gallery_paths || p.gallery || [];
      if (typeof galleries === "string") {
        galleries = galleries.split(",").map(s => s.trim()).filter(Boolean);
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
        galleryPaths: Array.isArray(galleries) ? galleries : [],
        provinceKey: pKey,
        provinceThai: realProvinceThai,
        location: sanitizeThaiText(p.location || realProvinceThai),
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
    })).replace(/</g, '\\u003c');

    const allProvincesList = (provListRes.data || []).map(p => ({
      key: (p.key || p.slug || p.id || "").toString().toLowerCase(),
      nameThai: p.nameThai || p.name_thai || p.name
    }));
    const hydratedProvincesData = JSON.stringify(allProvincesList).replace(/</g, '\\u003c');

    const hydratedScriptTag = `
      <script id="ssr-profiles-data">
        window.profilesData = ${hydratedProfilesData};
        window.provincesData = ${hydratedProvincesData};
        window.currentProvinceSlug = ${JSON.stringify(provinceSlug)};
        window.currentProvinceName = ${JSON.stringify(provinceThaiName)};
      </script>
    `;

    if (rawHtml.includes('<script id="ssr-profiles-data">')) {
      rawHtml = rawHtml.replace(/<script id="ssr-profiles-data">[\s\S]*?<\/script>/i, hydratedScriptTag);
    } else if (rawHtml.includes("{{SSR_PROFILES_JSON}}")) {
      rawHtml = replaceGlobal(rawHtml, "{{SSR_PROFILES_JSON}}", hydratedProfilesData);
    } else {
      rawHtml = rawHtml.replace(/<\/head>/i, `${hydratedScriptTag}\n</head>`);
    }

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
    PAGE_CACHE.set(cacheKey, { html: rawHtml, headers: responseHeaders, version: GLOBAL_LAST_TIMESTAMP });

    return new Response(rawHtml, { headers: responseHeaders });

  } catch (err) {
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
