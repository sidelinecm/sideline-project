import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const PAGE_CACHE = new Map();
const MAX_PAGE_CACHE_ENTRIES = 80;
let GLOBAL_VERSION = `v_20261022_03`;
let TEMPLATE_HTML_CACHE = null;

const ONE_DAY_MS = 86400 * 1000; // ✅ คงค่าเดิม 1 วัน

function setSafePageCache(key, data) {
  if (PAGE_CACHE.size >= MAX_PAGE_CACHE_ENTRIES) {
    const oldestKey = PAGE_CACHE.keys().next().value;
    PAGE_CACHE.delete(oldestKey);
  }
  PAGE_CACHE.set(key, { ...data, cachedAt: Date.now() });
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
    "https://line.me/ti/p/u8Bz9HsaY8",
    "https://twitter.com/sidelinechiangmai",
    "https://tiktok.com/@sidelinecm",
    "https://linktr.ee/kissmodel",
    "https://bsky.app/profile/sidelinechiangmai.bsky.social"
  ]
};

// 🟢 ข้อมูลครบทั้ง 15 จังหวัดดั้งเดิม
const PROVINCE_SEO_DATA = {
  chiangmai: {
    name: "เชียงใหม่",
    geo: { lat: 18.7883, lng: 98.9853 },
    zones: [
      "นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก", "หลัง มช.", "หน้า มช.",
      "คูเมือง", "ท่าแพ", "ห้วยแก้ว", "รวมโชค", "สันทราย", "แม่โจ้", "พายัพ", 
      "เซ็นทรัลเฟส", "สนามบินเชียงใหม่", "แม่ริม", "หางดง"
    ],
    faqs: [
      { q: "นัดหมายสาวรับงานและไซด์ไลน์เชียงใหม่ โซนไหนเดินทางสะดวกที่สุด?", a: "ย่านนิมมานเหมินท์ เจ็ดยอด สันติธรรม ช้างเผือก และรอบ มช. เป็นโซนหลักที่มีน้องๆ สแตนด์บายมากที่สุด เดินทางถึงโรงแรมหรือที่พักได้รวดเร็วภายใน 15-30 นาทีครับ" },
      { q: "เรทราคาค่าบริการรับงานเชียงใหม่ เริ่มต้นเท่าไหร่?", a: "เรทเริ่มต้นมาตรฐานอยู่ที่ 1,500 บาทสำหรับการดูแลสไตล์ฟิวแฟน 1 ชั่วโมง โดยมีทั้งบริการแบบชั่วคราว (Short Time) และค้างคืน (Overnight) แสดงราคาชัดเจนบนหน้าโปรไฟล์ครับ" },
      { q: "หากพักแถวแม่ริม สันทราย หรือหางดง น้องๆ สามารถเดินทางไปหาได้หรือไม่?", a: "สามารถเดินทางไปดูแลได้ครับ โดยอาจมีค่าเดินทางเพิ่มเติมตามระยะทางจริง สามารถตกลงรายละเอียดกับน้องก่อนเริ่มงานได้เลยครับ" },
      { q: "การนัดหมายในเชียงใหม่ มั่นใจได้อย่างไรว่าจะไม่โดนโกงมัดจำ?", a: "FirstModelHub ใช้ระบบ 'นัดเจอตัวจริง ตรวจสอบความตรงปกหน้างานแล้วค่อยจ่ายเงิน' ไม่มีการโอนมัดจำล่วงหน้าทุกกรณี ปลอดภัย 100% ครับ" }
    ]
  },
  bangkok: {
    name: "กรุงเทพฯ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: [
      "สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย", 
      "สาทร", "สีลม", "บางนา", "รามอินทรา", "พระราม 9", "อารีย์"
    ],
    faqs: [
      { q: "การเรียกบริการเพื่อนเที่ยวนอกสถานที่ (Outcall) ในกรุงเทพฯ มีขั้นตอนอย่างไร?", a: "ลูกค้าสามารถเลือกโปรไฟล์ แจ้งพิกัดโรงแรมหรือคอนโดส่วนตัวในเขตกรุงเทพฯ เพื่อนัดหมายเวลาที่สะดวก น้องๆ จะเดินทางไปพบตามนัดหมายอย่างตรงเวลาครับ" },
      { q: "มีน้องๆ ที่สามารถสื่อสารภาษาอังกฤษเพื่อดูแลลูกค้าต่างชาติ (Expat/Tourist) ไหม?", a: "มีครับ โดยเฉพาะในโซนสุขุมวิท สาทร และทองหล่อ มีน้องๆ ระดับพรีเมียมที่สื่อสารภาษาอังกฤษได้อย่างคล่องแคล่ว วางตัวดี พร้อมออกงานสังคมครับ" },
      { q: "นัดพบช่วงดึกหลังเลิกงาน มีน้องๆ สแตนด์บายพร้อมดูแลไหม?", a: "มีน้องๆ สแตนด์บายครอบคลุมตลอดช่วงค่ำจนถึงดึก สามารถเลือกนัดหมายแบบชั่วคราว (Short Time) หรือค้างคืน (Overnight) ได้ตามต้องการครับ" }
    ]
  },
  chonburi: {
    name: "ชลบุรี",
    geo: { lat: 13.3611, lng: 100.9847 },
    zones: [
      "พัทยา", "พัทยากลาง", "พัทยาใต้", "หาดจอมเทียน", "บางแสน", "ศรีราชา", 
      "ตัวเมืองชลบุรี", "อมตะนคร", "แหลมฉบัง", "บ่อวิน"
    ],
    faqs: [
      { q: "ต้องการน้องไปร่วมปาร์ตี้พูลวิลล่าในพัทยา หรือสังสรรค์ริมหาด รับงานไหม?", a: "รับครับ เรามีน้องๆ สายเอ็นเตอร์เทน (EN VIP) สำหรับชงเหล้า พูดคุย สร้างบรรยากาศสนุกสนาน เป็นกันเอง เหมาะกับทริปพูลวิลล่าและงานเลี้ยงส่วนตัวครับ" },
      { q: "น้องๆ โซนบางแสน ศรีราชา และพัทยา มีสไตล์แตกต่างกันอย่างไร?", a: "โซนบางแสนและศรีราชาส่วนใหญ่เป็นสไตล์วัยใส นักศึกษา น่ารัก เอาใจเก่ง ส่วนโซนพัทยาและจอมเทียนจะมีความหลากหลาย ทั้งสาวสวยหุ่นนางแบบและสายฝอครับ" },
      { q: "เรียกน้องไปโรงแรมในพัทยา ต้องโอนค่ารถหรือมัดจำก่อนหรือไม่?", a: "ไม่ต้องโอนมัดจำล่วงหน้าทุกกรณีครับ ตรวจสอบความถูกต้องและตรงปกเมื่อน้องเดินทางถึงที่พักแล้ว จึงชำระค่าบริการกับน้องโดยตรงครับ" }
    ]
  },
  phuket: {
    name: "ภูเก็ต",
    geo: { lat: 7.8804, lng: 98.3923 },
    zones: [
      "ตัวเมืองภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง", "กะรน", "กะตะ", 
      "บางเทา", "ราไวย์", "เชิงทะเล", "กมลา", "สนามบินภูเก็ต"
    ],
    faqs: [
      { q: "นัดหมายเพื่อนเที่ยวภูเก็ต ไปร่วมทริปล่องเรือยอร์ช หรือทานดินเนอร์หรู ได้ไหม?", a: "ได้แน่นอนครับ มีน้องๆ โปรไฟล์พรีเมียม บุคลิกภาพดีเยี่ยม พร้อมเป็นเพื่อนร่วมเดินทาง ดินเนอร์ ออกงาน หรือร่วมทริปทะเลอย่างเป็นส่วนตัวครับ" },
      { q: "พักอยู่วิลล่าส่วนตัวแถวบางเทา กะหลิม หรือเชิงทะเล น้องเดินทางไปได้ไหม?", a: "เดินทางไปดูแลได้ทั่วทั้งเกาะภูเก็ตครับ นัดหมายระบุพิกัดที่พักให้น้องเดินทางไปพบได้อย่างเป็นส่วนตัวและปลอดภัยครับ" }
    ]
  },
  "khon-kaen": {
    name: "ขอนแก่น",
    geo: { lat: 16.4322, lng: 102.8236 },
    zones: [
      "ในตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "หน้า มข.", "โนนม่วง", 
      "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "ม.ภาค", "ถนนมิตรภาพ", "ศิลา"
    ],
    faqs: [
      { q: "นัดหมายเพื่อนเที่ยวขอนแก่น โซนกังสดาล และรอบ มข. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำอยู่ในโซนมหาวิทยาลัยขอนแก่นและใจกลางเมือง เดินทางรวดเร็ว เป็นกันเอง ดูแลเอาใจใส่สไตล์ฟิวแฟนอย่างอบอุ่นครับ" },
      { q: "มีบริการเพื่อนเที่ยวทานข้าว หรือนั่งชิลร้านอาหารในขอนแก่นไหม?", a: "มีครับ น้องๆ พร้อมไปเป็นเพื่อนทานข้าว ดื่มชงเหล้า หรือนั่งคุยคลายเหงา สร้างความสบายใจ ไม่เร่งรีบ ให้เกียรติลูกค้าครับ" }
    ]
  },
  chiangrai: {
    name: "เชียงราย",
    geo: { lat: 19.9105, lng: 99.8406 },
    zones: [
      "ตัวเมืองเชียงราย", "บ้านดู่", "หน้า มฟล.", "ม.แม่ฟ้าหลวง", "หอนาฬิกา", 
      "ไนท์บาซาร์", "เด่นห้า", "รอบเวียง", "ริมกก", "สนามบินเชียงราย", "แม่สาย"
    ],
    faqs: [
      { q: "เพื่อนเที่ยวเชียงราย โซนบ้านดู่ และ ม.แม่ฟ้าหลวง นัดหมายอย่างไร?", a: "มีน้องๆ สแตนด์บายแถวหน้า มฟล. และตัวเมืองเชียงราย แจ้งพิกัดโรงแรมหรือที่พัก นัดหมายเวลาที่สะดวก น้องพร้อมเดินทางไปดูแลถึงที่ครับ" }
    ]
  },
  lampang: {
    name: "ลำปาง",
    geo: { lat: 18.2888, lng: 99.4923 },
    zones: [
      "ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏลำปาง", "สบตุ๋ย", 
      "เซ็นทรัลลำปาง", "อัศวิน", "กาดกองต้า", "เกาะคา"
    ],
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
    zones: [
      "ตัวเมืองอุดร", "UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร", "บ้านจาน", 
      "โพศรี", "ทุ่งศรีเมือง", "หนองสิม", "ตลาดรังษิณา", "สี่แยกไฮเทค"
    ],
    faqs: [
      { q: "เพื่อนเที่ยวอุดรธานี นัดพบแถวไหนเดินทางสะดวกที่สุด?", a: "ย่านใจกลางเมือง UD Town เซ็นทรัลอุดร และรอบสวนสาธารณะหนองประจักษ์ เป็นจุดนัดพบที่โรงแรมหาง่ายและเดินทางสะดวกที่สุดครับ" }
    ]
  },
  default: {
    name: "ทั่วไทย",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["เชียงใหม่", "ขอนแก่น", "เชียงราย", "อุดรธานี", "ภูเก็ต", "ลำปาง", "กรุงเทพฯ", "ชลบุรี"],
    faqs: [
      { q: "เรียกใช้บริการเพื่อนเที่ยวผ่าน FirstModelHub ต้องโอนเงินมัดจำล่วงหน้าไหม?", a: "ไม่ต้องโอนมัดจำล่วงหน้าทุกกรณีครับ ระบบของเราคือ 'นัดพบเจอตัวจริง ตรวจสอบความตรงปกหน้างานเรียบร้อยแล้ว จึงค่อยชำระเงินโดยตรงกับน้อง' ปลอดภัย 100% ครับ" },
      { q: "บริการสไตล์ฟิวแฟน (Girlfriend Experience - GFE) คืออะไร?", a: "คือบริการที่เน้นการเทคแคร์ เอาใจใส่ ดูแลดุจคนรัก มีความสุภาพ อ่อนโยน เป็นกันเอง ไม่เร่งเวลา และให้เกียรติลูกค้าครับ" },
      { q: "หากน้องเดินทางมาถึงแล้วรูปถ่ายไม่ตรงปก สามารถทำอย่างไรได้บ้าง?", a: "เราการันตีตรงปก 100% หากพบว่าตัวจริงไม่ตรงตามรูปโปรไฟล์ ลูกค้ามีสิทธิ์ปฏิเสธการรับบริการและยกเลิกหน้างานได้ทันทีโดยไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้นครับ" }
    ]
  },
  ayutthaya: {
    name: "อยุธยา",
    geo: { lat: 14.3532, lng: 100.5684 },
    zones: ["โรจนะ", "ตัวเมืองอยุธยา", "บางปะอิน", "ประตูชัย", "เสนา"],
    faqs: [
      { q: "เพื่อนเที่ยวอยุธยา โซนนิคมโรจนะและในเมืองนัดหมายอย่างไร?", a: "มีน้องๆ สแตนด์บายพร้อมดูแลตามโรงแรมและที่พักส่วนตัว แจ้งพิกัดเพื่อนัดหมายได้สะดวกรวดเร็ว จ่ายหน้างาน 100% ครับ" }
    ]
  },
  korat: {
    name: "นครราชสีมา",
    geo: { lat: 14.9799, lng: 102.0978 },
    zones: ["ในเมืองโคราช", "เซ็นทรัลโคราช", "เดอะมอลล์โคราช", "มทส.", "จอหอ", "ปากช่อง", "เขาใหญ่"],
    faqs: [
      { q: "เพื่อนเที่ยวโคราช หรือไปเที่ยวเขาใหญ่ มีบริการไหม?", a: "มีบริการน้องๆ เพื่อนเที่ยว (GFE) และเด็กเอ็นดูแลส่วนตัว ครอบคลุมทั้งตัวเมืองโคราชและทริปท่องเที่ยวเขาใหญ่ครับ" }
    ]
  },
  songkhla: {
    name: "สงขลา-หาดใหญ่",
    geo: { lat: 7.0084, lng: 100.4767 },
    zones: ["ตัวเมืองหาดใหญ่", "คอหงส์", "ม.อ.หาดใหญ่", "ลีการ์เดนส์", "ด่านนอก", "ตัวเมืองสงขลา"],
    faqs: [
      { q: "เพื่อนเที่ยวหาดใหญ่ นัดหมายอย่างไร?", a: "มีน้องๆ สแตนด์บายพร้อมบริการ Outcall ถึงโรงแรมในหาดใหญ่และสงขลา ปลอดภัย จ่ายหน้างาน ไม่มัดจำครับ" }
    ]
  },
  suratthani: {
    name: "สุราษฎร์ธานี",
    geo: { lat: 9.1382, lng: 99.3217 },
    zones: ["ตัวเมืองสุราษฎร์", "เกาะสมุย", "เฉวง", "ละไม", "บ่อผุด", "เกาะพะงัน"],
    faqs: [
      { q: "มีน้องๆ สแตนด์บายในเกาะสมุยไหม?", a: "มีบริการเพื่อนเที่ยวทั้งบนฝั่งตัวเมืองสุราษฎร์ฯ และบนเกาะสมุย ดูแลทริปพักผ่อนได้อย่างอบอุ่นเป็นส่วนตัวครับ" }
    ]
  }
};

PROVINCE_SEO_DATA["chiang-mai"] = PROVINCE_SEO_DATA["chiangmai"];
PROVINCE_SEO_DATA["khonkaen"] = PROVINCE_SEO_DATA["khon-kaen"];
PROVINCE_SEO_DATA["phra-nakhon-si-ayutthaya"] = PROVINCE_SEO_DATA["ayutthaya"];
PROVINCE_SEO_DATA["nakhon-ratchasima"] = PROVINCE_SEO_DATA["korat"];
PROVINCE_SEO_DATA["nakhonratchasima"] = PROVINCE_SEO_DATA["korat"];
PROVINCE_SEO_DATA["hat-yai"] = PROVINCE_SEO_DATA["songkhla"];
PROVINCE_SEO_DATA["hatyai"] = PROVINCE_SEO_DATA["songkhla"];
PROVINCE_SEO_DATA["surat-thani"] = PROVINCE_SEO_DATA["suratthani"];
PROVINCE_SEO_DATA["samui"] = PROVINCE_SEO_DATA["suratthani"];

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
// 🟢 [โค้ดใหม่ที่เพิ่มเข้าไป] ฟังก์ชันคำนวณเดือน-ปีไทยแบบไดนามิก
function getCurrentFreshnessText() {
  const now = new Date();
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const month = thaiMonths[now.getMonth()];
  const year = now.getFullYear(); // ใช้ ค.ศ. (เช่น 2026) ตามพฤติกรรมการค้นหาจริงของผู้ใช้
  return `${month} ${year}`;
}

function sanitizeThaiText(text) {
  if (!text || typeof text !== "string") return "";
  return text
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
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[tag] || tag));
}

function stripHTML(str) {
  if (str == null) return "";
  return String(str).replace(/<[^>]*>?/gm, "").trim();
}

function extractCleanNumber(rate) {
  if (!rate) return 1500;
  const str = String(rate).trim().toLowerCase();
  if (str.includes("k")) {
    const floatVal = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(floatVal) ? 1500 : Math.round(floatVal * 1000);
  }
  const pricePart = str.split(/[\/\(\s]/)[0];
  const cleanDigits = pricePart.replace(/\D/g, "");
  const num = parseInt(cleanDigits, 10);
  if (isNaN(num) || num <= 0) return 1500;
  if (num < 10) return num * 1000;
  if (num < 500) return num * 10;
  return num;
}
const replaceGlobal = (str, target, replacement) => str.split(target).join(replacement);

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

// 🟢 ฟังก์ชัน getDynamicIntro เชื่อมโยงลิงก์ภาษาไทย
function getDynamicIntro(provinceName, zones, provinceSlug = "chiangmai", zoneSlug = null) {
  const cleanSlug = (provinceSlug || "chiangmai").toLowerCase().replace(/[-_]/g, "");
  let cleanZones = zones && Array.isArray(zones) ? zones.filter(z => z && z !== "ทั้งหมด") : [];

  const PROV_SLUG_MAP = {
    "กรุงเทพฯ": "bangkok", "เชียงใหม่": "chiangmai", "ชลบุรี": "chonburi", "พัทยา": "chonburi",
    "ภูเก็ต": "phuket", "ขอนแก่น": "khon-kaen", "เชียงราย": "chiangrai", "ลำปาง": "lampang",
    "ลำพูน": "lamphun", "พิษณุโลก": "phitsanulok", "อุดรธานี": "udonthani"
  };

  const isNation = provinceSlug === "national" || provinceName === "ทั่วไทย";
  const ACTIVE_PROVINCE_SLUGS = ["chiangmai", "khon-kaen", "chiangrai", "udonthani", "lampang", "phuket"];

  // ⚡ ลิงก์ย่าน: ใช้ชื่อภาษาไทยตรงๆ ไม่แปลงเป็น %xx
  const zoneLinks = cleanZones.slice(0, 6).map(z => {
    const cleanZ = sanitizeThaiText(z);
    if (!cleanZ) return "";

    if (cleanZ.includes("นิมมาน")) {
      return `<a href="/nimman" class="kw-zone" title="สาวรับงานนิมมาน">${escapeHTML(cleanZ)}</a>`;
    }

    if (isNation) {
      const targetSlug = PROV_SLUG_MAP[cleanZ];
      if (targetSlug && ACTIVE_PROVINCE_SLUGS.includes(targetSlug)) {
        return `<a href="/location/${targetSlug}" class="kw-zone" style="color: #6D28D9; font-weight: 800; text-decoration: underline;" title="สาวรับงาน${escapeHTML(cleanZ)}">${escapeHTML(cleanZ)}</a>`;
      }
      return `<span class="kw-zone">${escapeHTML(cleanZ)}</span>`;
    }

    return `<a href="/location/${provinceSlug}/${cleanZ}" class="kw-zone" title="สาวรับงานโซน${escapeHTML(cleanZ)}">${escapeHTML(cleanZ)}</a>`;
  }).filter(Boolean);

  const zoneText = zoneLinks.length > 0 ? ` เช่น ย่าน ${zoneLinks.join(", ")}` : " บริเวณใจกลางเมืองและแหล่งที่พักชั้นนำ";

  const LOCAL_CONTEXT = {
    national: {
      headline: `สาวรับงาน • ไซด์ไลน์ทั่วไทย เพื่อนเที่ยวฟิวแฟน ตรงปก 100% จ่ายหน้างาน`,
      intro: `FirstModelHub ศูนย์รวมสาวรับงานและน้องๆ ไซด์ไลน์ทั่วประเทศ คัดสรรโปรไฟล์ตัวจริงตรงปก 100% สไตล์ฟิวแฟน (GFE) น่ารัก อัธยาศัยดี พูดเพราะ เอาใจเก่ง ไม่เร่งรีบ ให้ความรู้สึกอบอุ่นผ่อนคลายเหมือนไปเดตกับแฟนตัวจริง ปลอดภัยสูงสุดด้วยระบบนัดพบเจอตัวจริงก่อน แล้วค่อยชำระค่าบริการหน้างาน ไร้ความเสี่ยง ไม่ต้องโอนมัดจำล่วงหน้าทุกกรณีค่ะ`,
      convenience: `ครอบคลุมโรงแรม คอนโด และที่พักชั้นนำทุกภูมิภาคทั่วประเทศ${zoneText} น้องๆ สแตนด์บายพร้อมเดินทางดูแลถึงที่พักอย่างรวดเร็ว มิดชิด และรักษาความเป็นส่วนตัวสูงสุด`
    },
    chiangmai: {
      headline: zoneSlug ? `รับงานเชียงใหม่ โซน${zoneSlug} • ไซด์ไลน์${zoneSlug} ตัวจริงตรงปก 100%` : `รับงานเชียงใหม่ • ไซด์ไลน์เชียงใหม่ ตัวจริงตรงปก นัดเจอง่าย จ่ายหน้างาน`,
      intro: zoneSlug ? `รวมน้องๆ สาวรับงานเชียงใหม่ และสาวไซด์ไลน์โซน${zoneSlug} วัยใสน่ารัก นักศึกษาและสาวสวยหุ่นดี พักและสแตนด์บายอยู่ในพื้นที่${zoneSlug} ดูแลใกล้ชิดสไตล์ฟิวแฟน (GFE) นัดเจอตัวจริงเช็คความตรงปกหน้างานก่อนค่อยจ่ายเงิน ไร้มัดจำค่ะ` : `ศูนย์รวมสาวรับงานเชียงใหม่ และน้องๆ ไซด์ไลน์เชียงใหม่ สเปกน่ารัก วัยใส นักศึกษา มช. และสาวสวยหุ่นดี คัดสรรเฉพาะโปรไฟล์ตัวจริงตรงปก 100% สไตล์ฟิวแฟน (GFE) ดูแลเอาใจใส่ อ่อนโยน สุภาพ ไม่เร่งงาน มั่นใจปลอดภัยด้วยมาตรฐานจ่ายหน้างาน นัดเจอน้องตัวจริงเช็คความถูกต้องเรียบร้อยก่อนค่อยชำระเงิน หมดกังวลเรื่องการโดนหลอกโอนมัดจำล่วงหน้า 100% ค่ะ`,
      convenience: `พร้อมเดินทางดูแล (Outcall) ถึงโรงแรม คอนโด และที่พักส่วนตัวทั่วเชียงใหม่ เช่น โซนโรงแรมเลิฟโบ๊ต, มูฟเม้นท์, 3Q, ไซน่าชิก ตลอดจนที่พักย่าน${zoneText} น้องๆ พักในพื้นที่ เดินทางรวดเร็วภายใน 15-30 นาที นัดหมายสะดวก เป็นส่วนตัวสูงสุด`
    },
    bangkok: {
      headline: `สาวรับงานกรุงเทพฯ • ไซด์ไลน์ กทม. เพื่อนเที่ยวฟิวแฟน VIP ตัวท็อป`,
      intro: `รวมสาวรับงานกรุงเทพฯ และน้องๆ ไซด์ไลน์ระดับพรีเมียม ครอบคลุมทั้งสาววัยใส นักศึกษา พริตตี้ และสาวสวยหุ่นนางแบบ วางตัวดี สุภาพ อัธยาศัยดี ชวนคุยสนุก ปลอดภัยนัดพบตัวจริงตรงปก ชำระเงินหน้างาน ไม่มีความเสี่ยงเรื่องโอนเงินก่อนค่ะ`,
      convenience: `ครอบคลุมตามแนวรถไฟฟ้า BTS/MRT คอนโดหรู และโรงแรมชั้นนำทั่วกรุงเทพฯ${zoneText} นัดหมายง่าย ระบุพิกัดให้น้องเดินทางไปดูแล (Outcall) ได้อย่างรวดเร็วและเป็นส่วนตัว`
    },
    chonburi: {
      headline: `สาวรับงานพัทยา-ชลบุรี • ไซด์ไลน์บางแสน เด็กเอ็นปาร์ตี้ & ฟิวแฟนริมหาด`,
      intro: `เติมเต็มทริปเที่ยวทะเลพัทยา บางแสน และศรีราชา ให้สนุกและน่าจดจำยิ่งขึ้นกับน้องๆ เพื่อนเที่ยวฟิวแฟนและเด็กเอ็น (EN VIP) สายสดใส น่ารัก เฟรนด์ลี่ ชงเหล้าเก่ง นัดเจอง่าย จ่ายหน้างาน มั่นใจตรงปก ไม่ต้องโอนมัดจำล่วงหน้าค่ะ`,
      convenience: `รองรับโรงแรม รีสอร์ต และพูลวิลล่าทั่วพัทยา จอมเทียน บางแสน และศรีราชา${zoneText} น้องๆ เดินทางถึงที่พักตรงเวลา ปลอดภัย ไร้กังวลเรื่องเวลา`
    },
    phuket: {
      headline: `สาวรับงานภูเก็ต • ไซด์ไลน์ภูเก็ต พูลวิลล่า & เพื่อนเที่ยว VIP ทริปส่วนตัว`,
      intro: `สัมผัสการพักผ่อนสุดพิเศษบนเกาะภูเก็ตกับน้องๆ เพื่อนเที่ยวฟิวแฟนและเด็กเอ็น VIP คัดสาวสวยหุ่นดี ผิวพรรณดี บุคลิกภาพเด่น สื่อสารภาษาอังกฤษได้ (สายฝอ) ปลอดภัยด้วยระบบเจอตัวจริงตรงปกหน้างานค่อยชำระเงิน ไร้มัดจำค่ะ`,
      convenience: `สแตนด์บายครอบคลุมโรงแรม รีสอร์ตหรู และพูลวิลล่าทั่วเกาะภูเก็ต${zoneText} เดินทางเข้าดูแลถึงที่พักตามเวลานัดหมายอย่างรวดเร็วและปลอดภัย`
    },
    khonkaen: {
      headline: zoneSlug ? `รับงานขอนแก่น โซน${zoneSlug} • ไซด์ไลน์${zoneSlug} ฟิวแฟนตรงปก จ่ายหน้างาน` : `รับงานขอนแก่น • ไซด์ไลน์ขอนแก่น วัยใสนักศึกษา โซนหลัง มข. กังสดาล ฟิวแฟนตรงปก`,
      intro: `รวมสาวรับงานขอนแก่นและน้องๆ ไซด์ไลน์ตัวท็อปแดนอีสาน เน้นสเปกวัยใส นักศึกษา น่ารัก ขี้อ้อน ผิวขาว ตัวเล็ก ให้บริการสไตล์ฟิวแฟน (GFE) แท้ๆ นัดเจอน้องตัวจริง เช็คความตรงปกก่อนค่อยจ่ายเงินหน้างาน สบายใจ 100% ค่ะ`,
      convenience: `สแตนด์บายครอบคลุมรอบรั้วมหาวิทยาลัยขอนแก่นและโรงแรมใจกลางเมือง${zoneText} น้องๆ พักอยู่ในพื้นที่ เดินทางรวดเร็วทันใจ พร้อมดูแลถึงที่พัก`
    },
    chiangrai: {
      headline: `รับงานเชียงราย • ไซด์ไลน์เชียงราย วัยใสน่ารัก โซน มฟล. บ้านดู่ ฟิวแฟนตรงปก ไม่มัดจำ`,
      intro: `พักผ่อนแอ่วเมืองเหนือกับน้องๆ สาวรับงานเชียงรายและไซด์ไลน์น่ารักๆ สเปกวัยใส นักศึกษา หน้า มฟล. และสาวสวยในเมือง บุคลิกสดใส อัธยาศัยดี นัดเจอน้องตัวจริงตรงปกก่อนค่อยจ่ายเงิน ไร้เงื่อนไขโอนมัดจำล่วงหน้าค่ะ`,
      convenience: `ครอบคลุมทั้งโซนมหาวิทยาลัยแม่ฟ้าหลวง บ้านดู่ และโรงแรมใจกลางเมืองเชียงราย${zoneText} นัดหมายสะดวก น้องๆ เดินทางถึงที่พักรวดเร็ว ตรงเวลา`
    },
    udonthani: {
      headline: `รับงานอุดร • ไซด์ไลน์อุดรธานี เพื่อนเที่ยวฟิวแฟนตัวจริง ตรงปก จ่ายหน้างาน`,
      intro: `เปิดประสบการณ์พักผ่อนอย่างอบอุ่นในอุดรธานีกับน้องๆ สาวรับงานและไซด์ไลน์ฟิวแฟน คัดโปรไฟล์สาวสวย วัยใส ตัวเล็ก ผิวขาว น่ารัก เอาใจเก่ง นัดเจอง่าย สบายใจ จ่ายเงินหน้างานตรงกับน้อง ไม่มีความเสี่ยงเรื่องมัดจำค่ะ`,
      convenience: `สแตนด์บายครอบคลุมย่านเศรษฐกิจ โรงแรม และที่พักชั้นนำใจกลางเมืองอุดร${zoneText} นัดหมายสะดวกรวดเร็ว น้องๆ เดินทางเข้าดูแลถึงที่พักอย่างมิดชิด`
    },
    lampang: {
      headline: `รับงานลำปาง • ไซด์ไลน์ลำปาง เพื่อนเที่ยวฟิวแฟน เรียบร้อย น่ารัก เอาใจเก่ง`,
      intro: `คลายเหงาในเมืองรถม้ากับน้องๆ สาวรับงานลำปางและไซด์ไลน์คุณภาพ สเปกสาวสวยวัยใส มารยาทเรียบร้อย อัธยาศัยดี ปลอดภัยด้วยนโยบายเจอตัวจริงตรงปกหน้างานค่อยชำระเงิน ไร้กังวลเรื่องการโอนเงินก่อนค่ะ`,
      convenience: `รองรับโรงแรมและที่พักส่วนตัวชั้นนำทั่วเมืองลำปาง${zoneText} นัดหมายง่าย เป็นส่วนตัว และปลอดภัยสูงสุด`
    },
    lamphun: {
      headline: `สาวรับงานลำพูน • ไซด์ไลน์ลำพูน โซนนิคมและตัวเมือง ฟิวแฟนอบอุ่น เดินทางไว`,
      intro: `คลายความเหนื่อยล้าหลังเลิกงานในลำพูนกับน้องๆ เพื่อนเที่ยวสไตล์ฟิวแฟน สาวสวยบุคลิกดี อัธยาศัยดี พร้อมดูแลเอาใจใส่ด้วยความจริงใจ สุภาพ และให้เกียรติลูกค้า การันตีรูปจริงตรงปก ชำระเงินหน้างาน ปลอดภัย ไร้มัดจำค่ะ`,
      convenience: `ครอบคลุมทั้งโซนนิคมอุตสาหกรรมลำพูนและตัวเมือง${zoneText} น้องๆ สแตนด์บายพร้อมเดินทางเข้าดูแลถึงโรงแรมที่พักได้อย่างรวดเร็ว`
    },
    phitsanulok: {
      headline: `รับงานพิษณุโลก • ไซด์ไลน์พิษณุโลก วัยใสนักศึกษา โซน มน. และตัวเมือง ฟิวแฟนตรงปก`,
      intro: `หาเพื่อนเที่ยวคลายเหงาในเมืองสองแควกับน้องๆ สาวรับงานพิษณุโลกและไซด์ไลน์วัยใส โซนรอบ ม.นเรศวร (มน.) และในเมือง สเปกน่ารัก ชวนคุยเก่ง เฟรนด์ลี่ นัดพบตัวจริงตรงปกก่อนค่อยจ่ายเงินหน้างาน ไม่ต้องโอนมัดจำล่วงหน้าค่ะ`,
      convenience: `ครอบคลุมโซนรอบมหาวิทยาลัยนเรศวร ท่าโพธิ์ และโรงแรมใจกลางเมืองพิษณุโลก${zoneText} นัดหมายง่าย เดินทางถึงที่พักอย่างรวดเร็ว ปลอดภัย เป็นส่วนตัว`
    },
    ayutthaya: {
      headline: `สาวรับงานอยุธยา • ไซด์ไลน์อยุธยา โซนโรจนะและตัวเมือง ฟิวแฟนน่ารัก จ่ายหน้างาน`,
      intro: `พักผ่อนสบายๆ ในอยุธยากับน้องๆ เพื่อนเที่ยวฟิวแฟน สาวสวยวัยใส น่ารัก เอาใจเก่ง ชวนคุยสนุก พร้อมเป็นเพื่อนทานข้าว นั่งคาเฟ่ การันตีตัวจริงตรงปก 100% เจอตัวจริงก่อนค่อยจ่ายเงินหน้างาน ไร้ความเสี่ยงเรื่องมัดจำค่ะ`,
      convenience: `ครอบคลุมโรงแรมและที่พักชั้นนำทั่วโซนนิคมโรจนะ บางปะอิน และตัวเมืองอยุธยา${zoneText} นัดหมายสะดวกรวดเร็ว ปลอดภัย เป็นส่วนตัวสูงสุด`
    },
    korat: {
      headline: `สาวรับงานโคราช • ไซด์ไลน์นครราชสีมา ฟิวแฟนน่ารัก & เพื่อนเที่ยวทริปเขาใหญ่`,
      intro: `ผ่อนคลายในเมืองย่าโมกับน้องๆ สาวรับงานโคราชและไซด์ไลน์นครราชสีมา รวมโปรไฟล์สาวสวย วัยใส นักศึกษา และสาวสวยหุ่นดี บุคลิกน่ารัก ชวนคุยเก่ง การันตีตรงปก จ่ายเงินหน้างาน ไม่มีโอนก่อนค่ะ`,
      convenience: `สแตนด์บายครอบคลุมโรงแรมใจกลางเมืองโคราช เซ็นทรัล มทส. ตลอดจนรีสอร์ตแถวปากช่องและเขาใหญ่${zoneText} เดินทางเข้าดูแลถึงที่พักได้อย่างสะดวกสบาย`
    },
    songkhla: {
      headline: `สาวรับงานหาดใหญ่ • ไซด์ไลน์หาดใหญ่-สงขลา เพื่อนเที่ยวฟิวแฟนตรงปก จ่ายหน้างาน`,
      intro: `รวมสาวรับงานหาดใหญ่และน้องๆ ไซด์ไลน์สงขลา คัดเฉพาะโปรไฟล์พรีเมียม สไตล์ฟิวแฟน น่ารัก สุภาพ ชวนคุยสนุก เอาใจเก่ง มั่นใจ ปลอดภัย นัดเจอตัวจริงตรงปกแล้วค่อยจ่ายเงิน ไร้กังวลเรื่องมัดจำค่ะ`,
      convenience: `ครอบคลุมโรงแรมชั้นนำทั่วตัวเมืองหาดใหญ่ ย่านลีการ์เดนส์ ม.อ. และตัวเมืองสงขลา${zoneText} น้องๆ พร้อมเดินทางไปดูแล (Outcall) ถึงที่พักอย่างรวดเร็วและปลอดภัย`
    },
    suratthani: {
      headline: `สาวรับงานสุราษฎร์-เกาะสมุย • ไซด์ไลน์สมุย เพื่อนเที่ยวฟิวแฟน ทริปทะเลส่วนตัว`,
      intro: `เติมเต็มการพักผ่อนริมทะเลกับน้องๆ สาวรับงานสุราษฎร์ธานีและไซด์ไลน์เกาะสมุย คัดสาวสวยหุ่นดี ผิวพรรณดี อัธยาศัยดี นัดเจอง่าย สบายใจ ตรวจสอบความตรงปกหน้างานแล้วค่อยชำระเงิน ปลอดภัย 100% ค่ะ`,
      convenience: `บริการครอบคลุมทั้งตัวเมืองสุราษฎร์ธานี และรีสอร์ต/พูลวิลล่าทั่วเกาะสมุย (หาดเฉวง, ละไม, บ่อผุด)${zoneText} เดินทางเข้าดูแลถึงที่พักได้อย่างสะดวกและเป็นส่วนตัว`
    }
  };

  LOCAL_CONTEXT["khon-kaen"] = LOCAL_CONTEXT.khonkaen;
  LOCAL_CONTEXT["chiang-mai"] = LOCAL_CONTEXT.chiangmai;

  const current = LOCAL_CONTEXT[cleanSlug] || LOCAL_CONTEXT[provinceSlug] || (isNation ? LOCAL_CONTEXT.national : {
    headline: zoneSlug ? `สาวรับงาน${provinceName} โซน${zoneSlug} ตรงปก 100%` : `ศูนย์รวมเพื่อนเที่ยวและผู้ดูแลสไตล์ฟิวแฟน ${provinceName}`,
    intro: `FirstModelHub คัดสรรเพื่อนเที่ยวคุณภาพที่เน้นความตรงปก 100% ดูแลด้วยความจริงใจ สุภาพ และให้เกียรติผู้ใช้บริการ นัดพบจ่ายหน้างาน ปลอดภัย ไร้มัดจำค่ะ`,
    convenience: `ครอบคลุมโรงแรมและที่พักสำคัญในพื้นที่ ${provinceName}${zoneText} เดินทางนัดพบได้อย่างสะดวกและเป็นส่วนตัว`
  });

  return `
    <div style="margin-bottom: 16px;">
      <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">${current.headline}</h3>
      <p style="margin-bottom: 8px; line-height: 1.65;">${current.intro}</p>
      <p style="margin-bottom: 8px; line-height: 1.65;">มั่นใจในความปลอดภัยสูงสุดด้วยนโยบาย <strong>"นัดพบเจอตัวจริง ตรวจสอบความตรงปกหน้างานเรียบร้อยแล้ว จึงค่อยชำระค่าบริการ"</strong> ปราศจากความเสี่ยงจากการโอนเงินมัดจำล่วงหน้า 100%</p>
    </div>
    <div style="margin-bottom: 16px;">
      <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดบริการและการนัดหมายใน ${provinceName}${zoneSlug ? ` โซน${zoneSlug}` : ""}</h3>
      <p style="margin-bottom: 8px; line-height: 1.65;">${current.convenience}</p>
      <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
         <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span>เพื่อนทานข้าว ดินเนอร์ คลายเหงาในวันพักผ่อน</span></li>
         <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span>เพื่อนเที่ยวสไตล์ฟิวแฟน (GFE) เทคแคร์อบอุ่น สุภาพ ไม่เร่งรีบ</span></li>
         <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span>เอ็นเตอร์เทนเนอร์ (EN VIP) สำหรับงานเลี้ยงสังสรรค์ส่วนตัว</span></li>
      </ul>
    </div>
    <div>
      <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">🛡️ มาตรฐานความปลอดภัยและข้อกำหนดการใช้งาน</h3>
      <p style="line-height: 1.65; margin-bottom: 6px;">ทุกโปรไฟล์ผ่านการยืนยันตัวตนด้วยรูปถ่ายจริง ข้อมูลการนัดหมายถูกเก็บเป็นความลับสูงสุด ชำระเงินตรงกับน้องหน้างาน ไร้เงื่อนไขโอนมัดจำล่วงหน้าทุกกรณี</p>
      <p style="line-height: 1.65; color: #64748B; font-size: 11.5px; background: rgba(124, 58, 237, 0.05); padding: 8px 12px; border-radius: 8px; border-left: 3px solid #7C3AED;">
        <strong>ข้อกำหนดการใช้งาน:</strong> FirstModelHub เป็นพื้นที่สื่อกลางลงประกาศข้อมูล ผู้ใช้งานและผู้ลงประกาศต้องมีอายุ 20 ปีบริบูรณ์ขึ้นไป และปฏิบัติตามเงื่อนไขข้อตกลงการใช้งานอย่างเคร่งครัด
      </p>
    </div>
  `;
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
  } catch (_err) {}
  return "";
}

function formatLuxuryRate(rate) {
  if (!rate) return "1.5k";
  const str = String(rate).trim().toLowerCase();
  if (str.includes("k")) {
    const floatVal = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(floatVal) ? "1.5k" : `${floatVal}k`;
  }
  const cleanIntStr = str.split(".")[0].replace(/\D/g, "");
  let num = parseInt(cleanIntStr, 10);
  if (isNaN(num) || num <= 0) return "1.5k";
  if (num < 10) num = num * 1000;
  if (num < 500) num = num * 10;
  if (num >= 1000) {
    const kVal = num / 1000;
    return (kVal % 1 === 0 ? kVal : kVal.toFixed(1)) + "k";
  }
  return String(num);
}

function generateNaturalAlt(cleanName, provinceName, loc) {
  const zoneText = loc && loc !== provinceName ? ` ย่าน${loc}` : "";
  return `น้อง${cleanName} สาวรับงาน${provinceName}${zoneText} ไซด์ไลน์ตรงปก`;
}

// ==============================================================================
// 1. ฟังก์ชัน Render Card
// ==============================================================================
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
  const luxuryPrice = formatLuxuryRate(p.rate);

  let rawImg = (p.imagePath || p.image_url || p.imageUrl || "").trim();
  if (!rawImg || rawImg.includes("firstmodelhub.webp")) {
    let gallery = p.galleryPaths || p.gallery_paths || p.gallery || [];
    if (typeof gallery === "string") {
      try { gallery = JSON.parse(gallery); } catch (_) { gallery = gallery.split(",").map(s => s.trim()); }
    }
    const validFromGallery = Array.isArray(gallery) ? gallery.find(g => g && !g.includes("firstmodelhub.webp")) : null;
    rawImg = validFromGallery || "https://res.cloudinary.com/dyynjlbuj/image/upload/e_blur:1500,w_400,h_560,c_fill/v1790435086/images/tdzubsqfcfdfmfqvuog0.png";
  }

  const cardImgSmall = optimizeImg(rawImg, 400);
  const cardImgLarge = optimizeImg(rawImg, 600);
  const cardSrcSet = `${cardImgSmall} 400w, ${cardImgLarge} 600w`;

  let rawTags = p.style_tags || p.styleTags || p.tags || [];
  if (typeof rawTags === "string") rawTags = rawTags.split(",").map(s => s.trim());

  const cleanTags = (Array.isArray(rawTags) ? rawTags : [])
    .map(t => String(t).replace(/^#+/, "").trim())
    .filter(t => t && !t.includes("รับงาน") && !t.includes("ไซด์ไลน์") && t.length <= 8);

  const vibeTagsHtml = cleanTags.length > 0
    ? cleanTags.slice(0, 2).map(t => `<span class="card-vibe-pill">#${escapeHTML(t)}</span>`).join("")
    : `<span class="card-vibe-pill">#ฟิวแฟน</span>`;

  const isFiwFan = Array.isArray(rawTags) && rawTags.some(t => {
    const cleanTag = String(t).replace(/^#/, "").trim().toLowerCase();
    return cleanTag === "ฟิวแฟน" || cleanTag === "ฟิลแฟน" || cleanTag === "gfe" || cleanTag.includes("ฟิวแฟน");
  });

  const rightBadgeHtml = isFiwFan
    ? `<span class="badge-hot-tag"><span aria-hidden="true">🔥</span> HOT</span>`
    : `<span class="badge-verified-top"><span aria-hidden="true">✦</span> ตรงปก</span>`;

  return `
    <div class="profile-card-new-container">
      <article class="profile-card-new interactive-card" data-profile-id="${p.id}" data-profile-slug="${escapeHTML(p.slug || p.id)}">
        <img src="${cardImgSmall}" 
             srcset="${cardSrcSet}" 
             sizes="(max-width: 600px) 100vw, 400px"
             alt="${generateNaturalAlt(cleanName, provinceName, loc)}"
             width="400"
             height="560"
             class="profile-card-img"
             loading="${isPriorityLCP ? "eager" : "lazy"}"
             fetchpriority="${isPriorityLCP ? "high" : "auto"}"
             decoding="async" />
                 
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

    if (url.pathname.endsWith("ai-catalog.json") || url.pathname.includes(".well-known/ai-catalog")) {
      return new Response(JSON.stringify({ "specVersion": "1.0", "entries": [] }), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=86400", "Access-Control-Allow-Origin": "*" }
      });
    }

    if (url.pathname === "/api/clear-cache" || url.pathname === "/api/purge-cache") {
      const secret = url.searchParams.get("secret") || req.headers.get("x-purge-secret");
      if (secret === CONFIG.PURGE_SECRET) {
        PAGE_CACHE.clear();
        TEMPLATE_HTML_CACHE = null;
        GLOBAL_VERSION = `v_${Date.now()}`;

        return new Response(JSON.stringify({ success: true, version: GLOBAL_VERSION }), {
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
    if (["/about", "/faq", "/blog", "/contact", "/terms-of-service", "/privacy-policy", "/locations", "/nimman", "/offline", "/profile", "/sideline"].some(p => cleanPath === p || cleanPath.startsWith(p + "/"))) {
      return await context.next();
    }

    if (url.pathname === "/index.html") {
      return Response.redirect(`${primaryDomain}/`, 301);
    }

    // 🟢 แก้ไขจุดที่ 2: ทำ 301 Redirect ให้เป็น URL ภาษาไทยตรงๆ ไม่แปลงเป็น %xx
    const rawZoneQuery = url.searchParams.get("zone")?.trim();
    const segments = url.pathname.split("/").filter(Boolean);

    
    if (rawZoneQuery && rawZoneQuery !== "ทั้งหมด" && !cleanPath.includes("/sideline/")) {
      const currentProv = segments[1] || "chiangmai";
      let cleanZoneName = rawZoneQuery;
      try {
        cleanZoneName = decodeURIComponent(cleanZoneName).trim();
      } catch (_) {}
      return Response.redirect(`${CONFIG.PRIMARY_DOMAIN}/location/${currentProv}/${cleanZoneName}`, 301);
    }

    const isForceRefresh = url.searchParams.get("refresh") === CONFIG.PURGE_SECRET || url.searchParams.has("purge");

    const cacheKey = `${req.method}:${url.pathname.toLowerCase()}${url.search ? url.search.toLowerCase() : ""}`;
    const cachedPage = PAGE_CACHE.get(cacheKey);
    const isExpiredOneDay = cachedPage && (Date.now() - (cachedPage.cachedAt || 0) > ONE_DAY_MS);
    if (!isForceRefresh && cachedPage && !isExpiredOneDay && cachedPage.version === GLOBAL_VERSION) {
      PAGE_CACHE.delete(cacheKey);
      PAGE_CACHE.set(cacheKey, cachedPage);
      return new Response(cachedPage.html, { headers: cachedPage.headers });
    }

    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    
    // 🟢 1. ระบบตรวจจับ Routing สำหรับหน้าแรก, หน้ารายจังหวัด และโซนย่อย
    let isNational = cleanPath === "/" || cleanPath === "" || cleanPath === "/index-en";
    let provinceSlug = isNational ? "national" : (segments[1] || "chiangmai").toLowerCase().trim();
    if (provinceSlug === "chiang_mai" || provinceSlug === "chiang-mai") provinceSlug = "chiangmai";
    if (provinceSlug === "khonkaen" || provinceSlug === "khon_kaen") provinceSlug = "khon-kaen";

    // 🟢 แก้ไขจุดที่ 4: ถอดรหัสโซนย่อยอย่างปลอดภัย (ป้องกัน Double Encoding)
    let rawZoneParam = "";
    if (!isNational && segments.length >= 3) {
      try {
        rawZoneParam = decodeURIComponent(segments[2]).trim();
        if (rawZoneParam.includes("%")) rawZoneParam = decodeURIComponent(rawZoneParam).trim();
      } catch (_) {
        rawZoneParam = String(segments[2]).trim();
      }
    } else if (url.searchParams.has("zone")) {
      try {
        rawZoneParam = decodeURIComponent(url.searchParams.get("zone") || "").trim();
        if (rawZoneParam.includes("%")) rawZoneParam = decodeURIComponent(rawZoneParam).trim();
      } catch (_) {
        rawZoneParam = String(url.searchParams.get("zone") || "").trim();
      }
    }
    rawZoneParam = sanitizeThaiText(rawZoneParam).replace(/^โซน/g, "").trim();

    // 🟢 ตารางจับคู่ Slug อังกฤษ -> ชื่อย่านภาษาไทย (ครอบคลุมครบทุกโซนทั่วไทย 100%)
    const ZONE_MAP = {
      // 1. เชียงใหม่
      "nimman": "นิมมาน", "santitham": "สันติธรรม", "jedyod": "เจ็ดยอด", "jed-yod": "เจ็ดยอด",
      "maejo": "แม่โจ้", "hangdong": "หางดง", "cmu": "หลัง มช.", "langmor": "หลัง มช.",
      "changphueak": "ช้างเผือก", "maerim": "แม่ริม", "sansai": "สันทราย",
      "ruamchok": "รวมโชค", "thapae": "ท่าแพ", "huaykaew": "ห้วยแก้ว", "payap": "พายัพ",
      // 2. กรุงเทพฯ
      "sukhumvit": "สุขุมวิท", "ratchada": "รัชดา", "huaikhwang": "ห้วยขวาง",
      "ladprao": "ลาดพร้าว", "thonglor": "ทองหล่อ", "ekkamai": "เอกมัย",
      "sathorn": "สาทร", "silom": "สีลม", "bangna": "บางนา", "rama9": "พระราม 9", "ari": "อารีย์",
      // 3. ชลบุรี / พัทยา
      "pattaya": "พัทยา", "jomtien": "หาดจอมเทียน", "bangsaen": "บางแสน",
      "sriracha": "ศรีราชา", "amata": "อมตะนคร", "bowin": "บ่อวิน",
      // 4. ภูเก็ต
      "patong": "ป่าตอง", "kathu": "กะทู้", "chalong": "ฉลอง", "karon": "กะรน", "kata": "กะตะ",
      "bangtao": "บางเทา", "rawai": "ราไวย์", "cherngtalay": "เชิงทะเล", "kamala": "กมลา",
      // 5. ขอนแก่น
      "kku": "หลัง มข.", "kangsadan": "กังสดาล", "nonmuang": "โนนม่วง",
      "central-khonkaen": "เซ็นทรัลขอนแก่น", "buengkaennakhon": "บึงแก่นนคร",
      // 6. เชียงราย
      "baandu": "บ้านดู่", "mfu": "หน้า มฟล.", "maesai": "แม่สาย", "clock-tower": "หอนาฬิกา",
      // 7. ลำปาง
      "suan-dok": "สวนดอก", "sob-tui": "สบตุ๋ย", "lpru": "ม.ราชภัฏลำปาง",
      // 8. ลำพูน
      "nikom-lamphun": "นิคมลำพูน", "wiang-yong": "เวียงยอง",
      // 9. พิษณุโลก
      "nu": "รอบ มน.", "tha-pho": "ท่าโพธิ์", "samo-khae": "สมอแข",
      // 10. อุดรธานี
      "udtown": "UD Town", "nongprajak": "หนองประจักษ์", "central-udon": "เซ็นทรัลอุดร",
      // 11. โคราช (นครราชสีมา)
      "sut": "มทส.", "khaoyai": "เขาใหญ่", "pakchong": "ปากช่อง", "joho": "จอหอ",
      // 12. สงขลา-หาดใหญ่
      "hatyai": "ตัวเมืองหาดใหญ่", "psu": "ม.อ.หาดใหญ่", "dannok": "ด่านนอก",
      // 13. อยุธยา
      "rojana": "โรจนะ", "bang-pa-in": "บางปะอิน",
      // 14. สุราษฎร์ธานี / เกาะสมุย
      "samui": "เกาะสมุย", "chaweng": "เฉวง", "lamai": "ละไม", "bophut": "บ่อผุด"
    };

    const activeZoneName = ZONE_MAP[rawZoneParam.toLowerCase()] || rawZoneParam;

    const cleanProvinceSlug = provinceSlug.replace(/[-_]/g, "");
    const provinceKeyVariants = [provinceSlug, cleanProvinceSlug];
    if (provinceSlug === "chiangmai") provinceKeyVariants.push("chiang-mai", "chiang_mai");
    if (provinceSlug === "khon-kaen" || provinceSlug === "khonkaen") provinceKeyVariants.push("khonkaen", "khon_kaen");

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

    function detectAccurateProvince(p) {
      if (!p) return "chiangmai";
      const rawKey = (p.provinceKey || p.province_key || p.province_slug || "").toString().toLowerCase().trim();
      const INVALID_KEYS = ["", "no_province", "other", "undefined", "null", "none"];

      if (rawKey && !INVALID_KEYS.includes(rawKey)) {
        if (rawKey === "chiang_mai" || rawKey === "chiang-mai") return "chiangmai";
        if (rawKey === "khonkaen" || rawKey === "khon_kaen") return "khon-kaen";
        if (rawKey === "phra-nakhon-si-ayutthaya") return "ayutthaya";
        if (rawKey === "nakhon-ratchasima" || rawKey === "nakhonratchasima") return "korat";
        if (rawKey === "hat-yai" || rawKey === "hatyai") return "songkhla";
        if (rawKey === "samui" || rawKey === "surat-thani") return "suratthani";
        return rawKey;
      }

      const locText = (p.location || "").toLowerCase();
      const fullText = [locText, p.description || "", p.name || ""].join(" ").toLowerCase();
      for (const rule of PROVINCE_DETECTION_RULES) {
        if (rule.keywords.some(kw => fullText.includes(kw))) return rule.key;
      }
      return "chiangmai";
    }

    const profilesQuery = supabase
      .from("profiles")
      .select("*")
      .eq("active", true)
      .order("isfeatured", { ascending: false })
      .order("created_at", { ascending: false });

    const [provinceDataRes, profilesRes, allProvincesRes, settingsRes] = await Promise.all([
      isNational
        ? Promise.resolve({ data: { id: 0, nameThai: "ทั่วไทย", key: "national" } })
        : supabase.from("provinces").select("id, nameThai, key").in("key", provinceKeyVariants).limit(1).maybeSingle(),
      profilesQuery,
      supabase.from("provinces").select("key, nameThai").order("nameThai", { ascending: true }),
      supabase.from("site_settings").select("key, value")
    ]);

    const settingsMap = new Map((settingsRes?.data || []).map(s => [s.key, s.value]));
    const liveAdminLine = settingsMap.get("admin_line_url") || "https://line.me/ti/p/u8Bz9HsaY8";

    let provinceData = provinceDataRes?.data;
    if (!provinceData && !isNational) {
      const fallbackSeo = PROVINCE_SEO_DATA[cleanProvinceSlug] || PROVINCE_SEO_DATA[provinceSlug];
      if (fallbackSeo) {
        provinceData = { id: 999, nameThai: fallbackSeo.name, key: provinceSlug };
      } else {
        return new Response("404 Not Found - ไม่พบพื้นที่บริการที่ระบุ", { 
          status: 404,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    }

    const rawProfiles = profilesRes.data || [];
    const seenImageKeys = new Set();
    const seenNameKeys = new Set();
    const deduplicatedProfiles = [];

    for (const p of rawProfiles) {
      if (!p) continue;
      const cleanName = (p.name || "").trim().toLowerCase().replace(/^(น้อง|สาว|พี่)\s?/gi, "");
      if (!cleanName || cleanName === "model" || cleanName === "สาวสวย" || cleanName === "-") continue;

      const rawImg = (p.imagePath || p.image_url || p.imageUrl || "").trim().toLowerCase();
      if (!rawImg || rawImg.includes("firstmodelhub.webp")) continue;

      let imgSig = "";
      const parts = rawImg.split("?")[0].split("/");
      imgSig = parts[parts.length - 1].replace(/\.(webp|jpg|jpeg|png|avif)$/i, "");

      const realProvince = detectAccurateProvince(p);
      p.provinceKey = realProvince;
      p.province_slug = realProvince;

      const uniqueProfileId = String(p.id || "");
      if (uniqueProfileId && seenNameKeys.has(uniqueProfileId)) continue;
      if (imgSig && seenImageKeys.has(imgSig)) continue;

      if (imgSig) seenImageKeys.add(imgSig);
      if (uniqueProfileId) seenNameKeys.add(uniqueProfileId);
      deduplicatedProfiles.push(p);
    }

    // 🟢 2. แยกโปรไฟล์ตามจังหวัดที่เปิดดู และกรองตามโซนย่อย
    let profilesList = deduplicatedProfiles;
    const zoneSlug = activeZoneName || null;

    if (!isNational && provinceSlug !== "national") {
      profilesList = deduplicatedProfiles.filter(p => {
        const pKey = (p.provinceKey || "").toLowerCase();
        return provinceKeyVariants.includes(pKey);
      });

     if (zoneSlug) {
        const cleanZoneLower = zoneSlug.toLowerCase().replace(/^(โซน|ย่าน)/, "").trim();
        const matchedZoneProfiles = profilesList.filter(p => matchProfileToZone(p, cleanZoneLower));

        if (matchedZoneProfiles.length === 0) {
          return Response.redirect(`${primaryDomain}/location/${provinceSlug}`, 301);
        }

        profilesList = matchedZoneProfiles;
      }
    }

    const totalCount = profilesList.length; 
    const liveTotalProfiles = deduplicatedProfiles.length;
    const activeProvincesCount = new Set(deduplicatedProfiles.map(p => p.provinceKey).filter(Boolean)).size || 1;
    const provinceNameThai = isNational ? "ทั่วไทย" : provinceData?.nameThai || "เชียงใหม่";
    const seoData = isNational ? PROVINCE_SEO_DATA.default : PROVINCE_SEO_DATA[cleanProvinceSlug] || PROVINCE_SEO_DATA.default;
    const heroImage = CONFIG.DEFAULT_OG_IMAGE;

   
    const rawCanonicalUrl = isNational 
      ? `${primaryDomain}/` 
      : (zoneSlug 
          ? `${primaryDomain}/location/${provinceSlug}/${zoneSlug}` 
          : `${primaryDomain}/location/${provinceSlug}`);

    const canonicalUrl = rawCanonicalUrl;

    // 🟢 ดึงเดือน-ปีปัจจุบันเข้ามาใส่ใน Title & Description อัตโนมัติ
    const currentFreshness = getCurrentFreshnessText();

    const metaTitle = zoneSlug
  ? `รับงาน${zoneSlug} ไซด์ไลน์${zoneSlug} ${provinceNameThai} ฟิวแฟนตรงปก [อัปเดต ${currentFreshness}] | ${CONFIG.BRAND_NAME}`
  : (isNational 
      ? `สาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนตรงปก จ่ายหน้างาน [อัปเดต ${currentFreshness}] | ${CONFIG.BRAND_NAME}` 
      : `รับงาน${provinceNameThai} ไซด์ไลน์${provinceNameThai} ฟิวแฟนตรงปก มีห้อง-นอกสถานที่ [อัปเดต ${currentFreshness}] | ${CONFIG.BRAND_NAME}`);

    const metaDescription = zoneSlug
      ? `รวมน้องๆ สาวรับงานและไซด์ไลน์โซน${zoneSlug} ในจังหวัด${provinceNameThai} คัดตัวจริงตรงปก 100% สไตล์ฟิวแฟน อัปเดตล่าสุด ${currentFreshness} มีห้องส่วนตัวและนอกสถานที่ นัดเจอจ่ายหน้างาน ไม่มีมัดจำ`
      : (isNational
          ? `แหล่งรวมสาวรับงาน สาวไซด์ไลน์ และเด็กเอ็นฟิวแฟน คัดตัวจริงตรงปก 100% อัปเดตประจำเดือน ${currentFreshness} นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ เจอจ่ายจบ ปลอดภัย`
          : `รวมสาวรับงานและสาวไซด์ไลน์${provinceNameThai} สไตล์ฟิวแฟน ตัวจริงตรงปก 100% อัปเดตล่าสุด ${currentFreshness} มีห้องส่วนตัวและนอกสถานที่ นัดเจอจ่ายหน้างาน ไม่มีมัดจำ`);

    

    const cleanMetaDesc = stripHTML(metaDescription);
    const mapZoom = isNational ? 6 : (zoneSlug ? 14 : 12);
    const mapQuery = isNational 
      ? encodeURIComponent("ประเทศไทย") 
      : (zoneSlug ? encodeURIComponent(`${zoneSlug} ${provinceNameThai}`) : encodeURIComponent(`จังหวัด${provinceNameThai}`));
    const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;
    const cleanZonesList = (seoData.zones || []).map(sanitizeThaiText).filter(z => z && z !== "ทั้งหมด" && z !== "all");

    // 🟢 1. คำนวณวันเวลาอัปเดตล่าสุดเพียงรอบเดียว (ลดความซ้ำซ้อน)
    const latestUpdateMillis = profilesList.reduce((latest, p) => {
      const t = new Date(p.updated_at || p.created_at || 0).getTime();
      return (t > 0 && t > latest) ? t : latest;
    }, 0);
    const latestActualIso = latestUpdateMillis > 0 
      ? new Date(latestUpdateMillis).toISOString() 
      : new Date().toISOString();
    const realProvinceTimeText = latestUpdateMillis > 0 ? getRealTimeAgo(latestUpdateMillis) : "วันนี้";

    // 🟢 2. Breadcrumbs รองรับ 3 ชั้น (ภาษาไทยตรงปก URL ถูกต้องตามมาตรฐาน)
    const breadcrumbItems = [
      { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": `${primaryDomain}/` }
    ];
    if (!isNational) {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": `ไซด์ไลน์${provinceNameThai}`,
        "item": `${primaryDomain}/location/${provinceSlug}`
      });
      if (zoneSlug) {
        breadcrumbItems.push({
          "@type": "ListItem",
          "position": 3,
          "name": `โซน${zoneSlug}`,
          "item": canonicalUrl
        });
      }
    }

    // 🟢 3. WebPage Schema (CollectionPage)
    const webpageSchema = {
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#webpage`,
      "name": stripHTML(metaTitle),
      "description": cleanMetaDesc,
      "url": canonicalUrl,
      "inLanguage": "th-TH",
      "dateModified": latestActualIso,
      "isPartOf": { "@id": `${primaryDomain}/#website` },
      "about": isNational
        ? { "@type": "Country", "name": "ประเทศไทย", "identifier": "TH" }
        : {
            "@type": "Place",
            "name": zoneSlug ? `โซน${zoneSlug} จังหวัด${provinceNameThai}` : `จังหวัด${provinceNameThai}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": zoneSlug || provinceNameThai,
              "addressRegion": provinceNameThai,
              "addressCountry": "TH"
            }
          }
    };

    if (profilesList.length > 0) {
      webpageSchema.mainEntity = { "@id": `${canonicalUrl}#itemlist` };
    }

    // 🟢 4. โครงสร้าง Schema Graph หลัก
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
          "width": 512,
          "height": 512
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
      webpageSchema
    ];

    if (!isNational) {
      webpageSchema.breadcrumb = { "@id": `${canonicalUrl}#breadcrumb` };
      schemaGraph.push({
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": breadcrumbItems
      });
    }

    // ❌ เดิม: carouselProfiles = profilesList.slice(0, 12);
    // 🟢 ปรับใหม่: แสดงผลตามจำนวนจริงทั้งหมดแบบไดนามิก
    if (profilesList.length > 0) {
      schemaGraph.push({
        "@type": "ItemList",
        "@id": `${canonicalUrl}#itemlist`,
        "name": isNational ? "รายชื่อเพื่อนเที่ยวและไซด์ไลน์ทั่วไทย" : `รายชื่อเพื่อนเที่ยวและไซด์ไลน์ ${provinceNameThai}${zoneSlug ? ` โซน${zoneSlug}` : ""}`,
        "numberOfItems": profilesList.length, // ✅ ใช้จำนวนจริง (เช่น 63 หรือ 11)
        "itemListElement": profilesList.map((p, idx) => ({ // ✅ วนลูปแสดงครบทุกคน
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "Person",
            "name": `น้อง${(p.name || "สาวสวย").replace(/^(น้อง\s?)+/gi, "")}`,
            "image": optimizeImg(p.imagePath || p.image_url || "", 400),
            "url": `${primaryDomain}/sideline/${encodeURIComponent(p.slug || p.id)}`
          }
        }))
      });
    }

    // 🟢 6. ระบบ Adaptive FAQ (แยกคำถามระหว่าง "หน้าจังหวัด" กับ "หน้าโซนย่อย" ป้องกันเนื้อหาซ้ำ 100%)
    const activeFaqs = zoneSlug
      ? [
          {
            q: `นัดพบน้องๆ รับงานและไซด์ไลน์โซน${zoneSlug} (${provinceNameThai}) เดินทางสะดวกไหม?`,
            a: `สะดวกมากครับ น้องๆ พักอาศัยและสแตนด์บายอยู่ในย่าน${zoneSlug} สามารถเดินทางไปดูแลถึงโรงแรม คอนโด หรือที่พักส่วนตัวในพื้นที่ได้อย่างรวดเร็วภายใน 15-30 นาทีครับ`
          },
          {
            q: `การนัดหมายน้องๆ ในย่าน${zoneSlug} จ่ายเงินอย่างไร ปลอดภัยไหม?`,
            a: `ปลอดภัย 100% ครับ ระบบ FirstModelHub ใช้ระบบนัดเจอตัวจริง ตรวจสอบความตรงปกหน้างานเรียบร้อยแล้วจึงค่อยชำระเงินตรงกับน้อง ไม่มีการโอนเงินมัดจำล่วงหน้าทุกกรณีครับ`
          }
        ]
      : (seoData.faqs || []);

    // 🟢 7. ผูก FAQ เข้าสู่ Schema JSON-LD อย่างสมบูรณ์
    if (activeFaqs && activeFaqs.length > 0) {
      schemaGraph.push({
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "isPartOf": { "@id": `${canonicalUrl}#webpage` },
        "mainEntity": activeFaqs.map(f => ({
          "@type": "Question",
          "name": sanitizeThaiText(f.q),
          "acceptedAnswer": { "@type": "Answer", "text": sanitizeThaiText(f.a) }
        }))
      });
    }

    const allCardsHtml = profilesList.map((p, i) => renderCardHtml(p, i === 0, provinceNameThai)).join("");
    const rawFeatured = profilesList.filter(p => p.isfeatured || p.is_featured);
    const featuredProfilesList = rawFeatured.length > 0 ? rawFeatured.slice(0, 8) : profilesList.slice(0, 6);
    const featuredCardsHtml = featuredProfilesList.map((p, i) => renderCardHtml(p, i === 0, provinceNameThai)).join("");

    // ✅ ต้องส่ง activeFaqs เข้าไป ไม่ใช่ seoData.faqs
const faqsHtml = generateDynamicFAQsHTML(activeFaqs);
    const zonesStr = (seoData.zones || []).filter(z => z !== "ทั้งหมด").slice(0, 4).map(sanitizeThaiText).join(", ");
    
    const linkedIntro = getDynamicIntro(provinceNameThai, seoData.zones, provinceSlug, zoneSlug);

    const provinceCounts = deduplicatedProfiles.reduce((acc, p) => {
      const k = String(p.provinceKey || "").toLowerCase();
      if (k) acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    const REGION_CONFIG = [
    {
  name: "ภาคเหนือ",
  icon: "📍",
  provinces: [
    { 
      key: "chiangmai", 
      name: "ไซด์ไลน์เชียงใหม่", 
      zones: [
        "โซนนิมมานเหมินท์", 
        "โซนเจ็ดยอด", 
        "โซนสันติธรรม", 
        "โซนช้างเผือก", 
        "โซนหลัง มช.", 
        "โซนแม่โจ้", 
        "โซนสันทราย"
      ] 
    },
    { key: "chiangrai", name: "ไซด์ไลน์เชียงราย", zones: ["โซนบ้านดู่", "โซนหน้า มฟล.", "โซนหอนาฬิกา"] },
    { key: "lampang", name: "ไซด์ไลน์ลำปาง", zones: ["โซนในเมือง", "โซนสวนดอก", "โซน ม.ราชภัฏ"] },
    { key: "lamphun", name: "ไซด์ไลน์ลำพูน", zones: ["โซนนิคมลำพูน", "โซนตัวเมือง"] },
    { key: "phitsanulok", name: "ไซด์ไลน์พิษณุโลก", zones: ["โซนรอบ มน.", "โซนตัวเมือง"] }
  ]
},
      {
        name: "ภาคอีสาน",
        icon: "📍",
        provinces: [
          { key: "khon-kaen", name: "ไซด์ไลน์ขอนแก่น", zones: ["โซนกังสดาล - หลัง มข. - โนนม่วง", "โซนเซ็นทรัล - บึงแก่นนคร"] },
          { key: "udonthani", name: "ไซด์ไลน์อุดรธานี", zones: ["โซน UD Town - เซ็นทรัลอุดร", "โซนหนองประจักษ์ - ตลาดรังษิณา"] },
          { key: "korat", name: "ไซด์ไลน์โคราช", zones: ["โซนในเมือง - เซ็นทรัล - มทส."] }
        ]
      },
      {
        name: "ภาคกลาง / ตะวันออก",
        icon: "📍",
        provinces: [
          { key: "bangkok", name: "ไซด์ไลน์กรุงเทพฯ", zones: ["โซนสุขุมวิท - รัชดา - ห้วยขวาง", "โซนสาทร - ทองหล่อ - พระราม 9"] },
          { key: "chonburi", name: "ไซด์ไลน์ชลบุรี-พัทยา", zones: ["โซนพัทยา - จอมเทียน - บางแสน"] },
          { key: "ayutthaya", name: "ไซด์ไลน์อยุธยา", zones: ["โซนโรจนะ - ตัวเมือง"] }
        ]
      },
      {
        name: "ภาคใต้",
        icon: "📍",
        provinces: [
          { key: "phuket", name: "ไซด์ไลน์ภูเก็ต", zones: ["โซนตัวเมืองภูเก็ต - ป่าตอง - กะทู้", "โซนบางเทา - เชิงทะเล - ราไวย์"] },
          { key: "songkhla", name: "ไซด์ไลน์หาดใหญ่", zones: ["โซนตัวเมืองหาดใหญ่ - ม.อ."] },
          { key: "suratthani", name: "ไซด์ไลน์สุราษฎร์-สมุย", zones: ["โซนตัวเมือง - หาดเฉวง เกาะสมุย"] }
        ]
      }
    ];

    const dynamicRegionColsHtml = REGION_CONFIG.map(region => {
      const activeProvsInRegion = region.provinces.filter(p => (provinceCounts[p.key] || 0) > 0);
      if (activeProvsInRegion.length === 0) return ""; 

      const totalRegionProfiles = activeProvsInRegion.reduce((sum, p) => sum + (provinceCounts[p.key] || 0), 0);

      const provListHtml = activeProvsInRegion.map(p => {
        const count = provinceCounts[p.key] || 0;
        if (isNational) {
          return `
            <li style="margin-bottom: 6px;">
              <a href="/location/${p.key}" style="color: var(--text-gray); text-decoration: none; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; justify-content: space-between; width: 100%; padding: 2px 0;">
                <span>• ${escapeHTML(p.name)}</span>
                <span style="color: #7C3AED; font-size: 11px; font-weight: 800; background: rgba(124, 58, 237, 0.08); padding: 1px 8px; border-radius: 100px;">${count} คน</span>
              </a>
            </li>
          `;
        }

        const zonesHtml = p.zones.map(z => {
          const cleanZ = sanitizeThaiText(z).replace(/^โซน/g, "").trim().split(/[-–,]/)[0].trim();
          const zoneHref = z.includes("นิมมาน") 
            ? "/nimman" 
            : `/location/${p.key}/${cleanZ}`;

          return `
            <li style="padding-left: 10px;">
              <a href="${zoneHref}" style="color: var(--text-muted); text-decoration: none; font-size: 11px;">• ${escapeHTML(z)}</a>
            </li>
          `;
        }).join("");

        return `
          <li style="margin-bottom: 6px;">
            <a href="/location/${p.key}" style="color: var(--text-gray); text-decoration: none; font-weight: 800;">
              ${escapeHTML(p.name)} (${count} คน)
            </a>
            <ul style="list-style: none; padding: 0; margin: 0;">${zonesHtml}</ul>
          </li>
        `;
      }).join("");
      
      return `
        <div class="directory-region-col">
          <strong style="color: #7C3AED; font-size: 13px; display: block; margin-bottom: 8px;">
            ${region.icon} ${region.name} (${totalRegionProfiles} โปรไฟล์)
          </strong>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 12px; line-height: 1.8;">${provListHtml}</ul>
        </div>
      `;
    }).filter(Boolean).join("");

    const popularLocationsFooter = `
      <div class="footer-directory-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; width: 100%;">
        ${dynamicRegionColsHtml}
      </div>
    `;

    let finalHtml = await getTemplateHtml(url, context);
    if (!finalHtml) return await context.next();

  // 🟢 แก้ไข: มีน้องตั้งแต่ 1 คนขึ้นไป ให้ Google เก็บเข้า Index ได้ทันที (ไม่บล็อก)
const robotsDirectives = (typeof zoneSlug !== "undefined" && zoneSlug && totalCount < 1)
  ? "noindex, follow"
  : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    // 🟢 2. เขียนทับ Title, Description และล้าง Keywords เก่า
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHTML(metaTitle)}</title>`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHTML(cleanMetaDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']keywords["'][^>]*\/?>/gi, "");

    // 🟢 3. เขียนทับ Meta Robots Tag ให้เปลี่ยนเป็น noindex อัตโนมัติเมื่อเจอย่านที่ไม่มีน้อง
    finalHtml = finalHtml.replace(/<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${robotsDirectives}">`);

    // 🟢 4. เขียนทับ Social Meta (Open Graph & Twitter Cards)
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHTML(metaTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHTML(cleanMetaDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHTML(metaTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHTML(cleanMetaDesc)}" />`);

    // 🟢 5. จัดการ Canonical URL และ Open Graph URL
    finalHtml = finalHtml.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "");
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:url["'][^>]*>/gi, "");
    finalHtml = finalHtml.replace(/<\/head>/i, `  <link rel="canonical" id="canonical-link" href="${canonicalUrl}">\n  <meta property="og:url" content="${canonicalUrl}">\n</head>`);
    
    // 🟢 6. จัดการรูปภาพพรีวิว Social (OG Image & Twitter Image)
    const cleanOgImageBlock = `<meta property="og:image" content="${heroImage}">\n  <meta property="og:image:secure_url" content="${heroImage}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="${escapeHTML(CONFIG.BRAND_NAME)} ศูนย์รวมสาวรับงานและไซด์ไลน์ฟิวแฟน${escapeHTML(provinceNameThai)}">`;
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:image["'][^>]*>[\s\S]*?<meta\s+property=["']og:image:alt["'][^>]*>/i, cleanOgImageBlock);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:image["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta name="twitter:image" content="${heroImage}">`);

    // 🟢 7. จัดการแท็กภาษา Hreflang
    const hreflangBlock = isNational
      ? `<link rel="alternate" hreflang="th" href="${primaryDomain}/" />\n  <link rel="alternate" hreflang="en" href="${primaryDomain}/index-en" />\n  <link rel="alternate" hreflang="x-default" href="${primaryDomain}/" />`
      : `<link rel="alternate" hreflang="th" href="${canonicalUrl}" />\n  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`;
    finalHtml = finalHtml.replace(/<link\s+rel=["']alternate["']\s+hreflang=["'][^"']*["'][^>]*>\s*/gi, "");
    finalHtml = finalHtml.replace(/<\/head>/i, `  ${hreflangBlock}\n</head>`);

    let ssrH1Html = "";
    let dynamicSubheadline = "";

    if (isNational) {
      ssrH1Html = `<span class="h1-line-1" style="display: block; font-size: clamp(20px, 5.5vw, 24px); font-weight: 900; color: #140F22; line-height: 1.25; margin-bottom: 4px;">สาวรับงาน ไซด์ไลน์ เด็กเอ็น</span>
                   <span class="h1-line-2" style="display: block; font-size: clamp(14px, 4vw, 16px); font-weight: 800; background: linear-gradient(135deg, #7C3AED 0%, #D946EF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ฟิวแฟนตรงปก มีห้องพร้อม-นอกสถานที่</span>`;
      dynamicSubheadline = `รวมสาวสวยรับงาน & ไซด์ไลน์ คัดตัวจริงตรงปก`;
    } else if (zoneSlug) {
      ssrH1Html = `<span class="h1-line-1" style="display: block; font-size: clamp(18px, 5vw, 22px); font-weight: 900; color: #140F22; line-height: 1.25; margin-bottom: 4px;">รับงาน${escapeHTML(provinceNameThai)} โซน${escapeHTML(zoneSlug)}</span>
                   <span class="h1-line-2" style="display: block; font-size: clamp(14px, 4vw, 16px); font-weight: 800; background: linear-gradient(135deg, #7C3AED 0%, #D946EF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ไซด์ไลน์${escapeHTML(zoneSlug)} ฟิวแฟนตรงปก มีห้องพร้อม-นอกสถานที่</span>`;
      dynamicSubheadline = `สาวรับงาน${escapeHTML(provinceNameThai)} โซน${escapeHTML(zoneSlug)} คัดตัวจริงตรงปก 100%`;
    } else {
      ssrH1Html = `<span class="h1-line-1" style="display: block; font-size: clamp(20px, 5.5vw, 24px); font-weight: 900; color: #140F22; line-height: 1.25; margin-bottom: 4px;">รับงาน${escapeHTML(provinceNameThai)} ไซด์ไลน์${escapeHTML(provinceNameThai)}</span>
                   <span class="h1-line-2" style="display: block; font-size: clamp(14px, 4vw, 16px); font-weight: 800; background: linear-gradient(135deg, #7C3AED 0%, #D946EF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ฟิวแฟนตรงปก มีห้องพร้อม-นอกสถานที่ จ่ายหน้างาน</span>`;
      dynamicSubheadline = `สาวรับงาน${escapeHTML(provinceNameThai)} ไซด์ไลน์ตัวจริงตรงปก 100%`;
    }

    finalHtml = finalHtml.replace(/<h1[^>]*id=["']hero-h1["'][^>]*>[\s\S]*?<\/h1>|<h1\s+class=["']seo-h1-title["'][^>]*>[\s\S]*?<\/h1>/i, `<h1 class="seo-h1-title" id="hero-h1" style="text-align: center; margin: 10px 0;">${ssrH1Html}</h1>`);
    finalHtml = finalHtml.replace(/<span class=["']hero-subheadline["']>[\s\S]*?<\/span>/i, `<span class="hero-subheadline">${dynamicSubheadline}</span>`);

    
   // 🟢 แก้ไข: ค้นหาจากทั้งประโยค ไม่หั่นคำทิ้ง นับจำนวนคนได้ครบ 100%
function matchProfileToZone(p, cleanZ) {
  if (!p || !cleanZ) return false;
  const rawLoc = sanitizeThaiText(p.location || "").toLowerCase();
  const desc = sanitizeThaiText(p.description || "").toLowerCase();
  const tags = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : String(p.styleTags || "")).toLowerCase();
  return rawLoc.includes(cleanZ) || tags.includes(cleanZ) || desc.includes(cleanZ);
}

    // 🟢 1. คำนวณจำนวนน้องที่มีตัวตนจริงในแต่ละโซน (ใช้ matchProfileToZone สูตรเดียวกันเป๊ะ)
    const zoneCountMap = {};
    const baseProvProfiles = deduplicatedProfiles.filter(p => {
      const pKey = (p.provinceKey || "").toLowerCase();
      return provinceKeyVariants.includes(pKey);
    });

    (cleanZonesList || []).forEach(rawZ => {
      const cleanZ = sanitizeThaiText(rawZ).replace(/^(โซน|ย่าน)/, "").trim().toLowerCase();
      if (!cleanZ || cleanZ === "ทั้งหมด") return;
      
      // ✅ คำนวณด้วยสูตรใหม่: ตัวเลขบนปุ่มจะกลายเป็น (11) และ (8) ตรงกับหน้าเว็บ 100%
      const count = baseProvProfiles.filter(p => matchProfileToZone(p, cleanZ)).length;
      if (count > 0) {
        zoneCountMap[rawZ] = count;
      }
    });

    // 🟢 สร้างปุ่มลิงก์โซนภาษาไทย พร้อมปุ่ม "ทั้งหมดในจังหวัด" ให้นำทางย้อนกลับได้ง่าย
    const activeZoneKeys = Object.keys(zoneCountMap);
    
    // 1. ปุ่ม "ทั้งหมดในจังหวัด"
    const isAllActive = !zoneSlug;
    const allBtnStyle = isAllActive
      ? "background: #7C3AED; color: #FFFFFF; border: 1.5px solid #7C3AED;"
      : "background: #F3E8FF; border: 1.5px solid #C084FC; color: #581C87;";
    
    let pills = `<a href="/location/${provinceSlug}" style="${allBtnStyle} padding: 5px 14px; border-radius: 100px; font-size: 11.5px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; line-height: 1.4; margin: 2px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      ✨ ทั้งหมดใน${escapeHTML(provinceNameThai)} <span style="font-size: 10px; opacity: 0.85;">(${baseProvProfiles.length})</span>
    </a> `;

    
    pills += activeZoneKeys.map(z => {
      const cleanZ = escapeHTML(String(z).trim());
      const count = zoneCountMap[z];

      const href = cleanZ.includes("นิมมาน") 
        ? "/nimman" 
        : `/location/${provinceSlug}/${cleanZ}`;

      const isActiveZone = zoneSlug && (zoneSlug === cleanZ || zoneSlug.includes(cleanZ));
      const activeStyle = isActiveZone 
        ? "background: #7C3AED; color: #FFFFFF; border: 1.5px solid #7C3AED;" 
        : "background: #F3E8FF; border: 1.5px solid #C084FC; color: #581C87;";

      return `<a href="${href}" style="${activeStyle} padding: 5px 14px; border-radius: 100px; font-size: 11.5px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; line-height: 1.4; margin: 2px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" title="สาวรับงานโซน${cleanZ}">
        📍 โซน${cleanZ} <span style="font-size: 10px; opacity: 0.85;">(${count})</span>
      </a>`;
    }).join(" ");

    if (!isNational && pills) {
      finalHtml = finalHtml.replace(
        /<div class="filter-pills-scroll-row" id="quick-filter-pills">[\s\S]*?<\/div>/i,
        `<div class="filter-pills-scroll-row" id="quick-filter-pills" style="display: flex; gap: 8px; overflow-x: auto; padding: 6px 0; scrollbar-width: none;">${pills}</div>`
      );
    }
    
    const trustBoxHtml = `
      <div style="background: rgba(255,255,255,0.9); border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 12px; padding: 8px 12px; margin-top: 10px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-sizing: border-box;">
        <span style="color: #059669; font-size: 12px; font-weight: 800;">🛡️ ปลอดภัย 100%:</span>
        <span style="color: #140F22; font-size: 12px; font-weight: 700;">นัดเจอตัวจริงก่อนค่อยจ่าย • ไร้มัดจำ</span>
      </div>
    `;

    const dynamicHeroDesc = isNational
      ? `<p class="hero-subtitle-p" style="margin: 0; font-size: 12.5px; color: #475569; line-height: 1.65;"><strong>FirstModelHub</strong> ศูนย์รวมสาวรับงานและไซด์ไลน์ฟิวแฟน คัดตัวจริงตรงปก มีห้องพร้อมและนอกสถานที่ นัดเจอน้องตัวจริงก่อนค่อยชำระค่าบริการหน้างาน สบายใจ ไร้กังวลเรื่องมัดจำค่ะ</p>${trustBoxHtml}`
      : `<p class="hero-subtitle-p" style="margin: 0; font-size: 12.5px; color: #475569; line-height: 1.65;">รวมโปรไฟล์สาวรับงานและไซด์ไลน์${escapeHTML(provinceNameThai)}${zoneSlug ? ` โซน${escapeHTML(zoneSlug)}` : ""} คัดตัวจริงตรงปก 100% สไตล์ฟิวแฟนดูแลดี มีห้องส่วนตัวและพร้อมเดินทางไปหาที่พัก นัดเจอตัวจริงก่อนค่อยจ่ายหน้างาน ไม่ต้องโอนมัดจำค่ะ</p>${trustBoxHtml}`;

    finalHtml = finalHtml.replace(/<div class="hero-description-inset">[\s\S]*?<\/div>/i, `<div class="hero-description-inset" style="padding: 12px 14px; background: #FFFFFF; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 16px; margin: 10px 0;">${dynamicHeroDesc}</div>`);

    const ssrFeaturedH2 = isNational 
      ? `น้องๆ แนะนำ <span class="province-name-highlight">ไซด์ไลน์ทั่วไทย</span> (จ่ายหน้างาน)`
      : `น้องๆ แนะนำ <span class="province-name-highlight">ไซด์ไลน์${escapeHTML(provinceNameThai)}</span> (ตัวจริงตรงปก)`;
    finalHtml = finalHtml.replace(/<h2 id="featured-heading"[^>]*>[\s\S]*?<\/h2>/i, `<h2 id="featured-heading" class="clean-section-h2">${ssrFeaturedH2}</h2>`);

    if (!isNational) {
      finalHtml = finalHtml.replace('id="breadcrumb-wrapper" style="display: none;', 'id="breadcrumb-wrapper" style="display: block;');
      let bcHtml = `<li><a href="/location/${provinceSlug}" style="color: #64748B; text-decoration: none;">ไซด์ไลน์${escapeHTML(provinceNameThai)}</a></li>`;
      if (zoneSlug) {
        bcHtml += `<li style="color: #94A3B8;" aria-hidden="true">&raquo;</li><li aria-current="page"><span style="color: #140F22; font-weight: 700;">โซน${escapeHTML(zoneSlug)}</span></li>`;
      }
      finalHtml = finalHtml.replace(/<ol[^>]*>[\s\S]*?<\/ol>/i, `<ol style="display: flex; align-items: center; gap: 6px; list-style: none; padding: 0; margin: 0; font-size: 11.5px;"><li><a href="/" style="color: #64748B; text-decoration: none;">หน้าแรก</a></li><li style="color: #94A3B8;" aria-hidden="true">&raquo;</li>${bcHtml}</ol>`);

      finalHtml = finalHtml.replace(/<div class="bento-header-center">[\s\S]*?HOW IT WORKS[\s\S]*?<div class="steps-compact-grid">[\s\S]*?<\/div>\s*(?=<div class="trust-protocol-bento")/i, "");
      finalHtml = finalHtml.replace(/<!--\s*Lifestyle & Vibes Bento\s*-->[\s\S]*?<div class="vibes-bento-wrapper"[\s\S]*?(?=<!--\s*SEO Information Section)/i, "");
      finalHtml = finalHtml.replace(/<!--\s*Editorial Digest\s*-->\s*<section class="editorial-digest-section"[\s\S]*?<\/section>/i, "");
      finalHtml = finalHtml.replace(/<!--\s*Trust & Safety Reporting Center\s*-->[\s\S]*?<div class="live-concierge-bar"[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i, "</div></section>");
      finalHtml = finalHtml.replace(/<!--\s*Safety Protocol & Maps\s*-->\s*<section id="verification-process"[\s\S]*?<\/section>/i, "");
    }

    finalHtml = finalHtml.replace(/<strong\b[^>]*\bid=["']live-profile-count["'][^>]*>[\s\S]*?<\/strong>/i, `<strong class="stat-number" id="live-profile-count">${totalCount}</strong>`);
    finalHtml = finalHtml.replace(/<strong\b[^>]*\bid=["']live-province-count["'][^>]*>[\s\S]*?<\/strong>/i, `<strong class="stat-number" id="live-province-count">${isNational ? activeProvincesCount : 1}</strong>`);

    const topStoryProfiles = profilesList.slice(0, 10);
    const renderStoryItem = (p) => {
      const sName = escapeHTML((p.name || "น้อง").trim().replace(/^(น้อง\s?)+/gi, ""));
      const sSlug = encodeURIComponent(p.slug || p.id);
      let rawImg = p.imagePath || p.image_url || "";
      if (!rawImg || rawImg.includes("firstmodelhub.webp")) {
        rawImg = "https://res.cloudinary.com/dyynjlbuj/image/upload/e_blur:1500,w_400,h_560,c_fill/v1790435086/images/tdzubsqfcfdfmfqvuog0.png";
      }
      const sImg = optimizeImg(rawImg, "thumb");

      return `
        <a href="/sideline/${sSlug}" class="story-item-el interactive-card" data-profile-id="${p.id}" data-profile-slug="${sSlug}" aria-label="ดูโปรไฟล์ น้อง${sName}">
          <div class="story-ring-wrap">
            <div class="story-ring-glow">
             <img src="${sImg}" alt="น้อง${sName} (${escapeHTML(provinceNameThai)})" loading="lazy" fetchpriority="low" decoding="async" width="52" height="52" onerror="this.onerror=null; this.src='https://firstmodelhub.com/images/firstmodelhub.webp';">
            </div>
            <span class="story-status-dot online" aria-hidden="true"></span>
          </div>
          <span class="story-label">${sName}</span>
        </a>
      `;
    };
    const primaryStories = topStoryProfiles.map(p => renderStoryItem(p)).join("");
    finalHtml = finalHtml.replace(/<div class="stories-track-inner" id="agency-stories-track">[\s\S]*?<\/div>/i, `<div class="stories-track-inner" id="agency-stories-track">${primaryStories}</div>`);

    const hotSwiperCardsHtml = profilesList.slice(0, 8).map((p, i) => {
      const cleanName = escapeHTML((p.name || "น้อง").trim().replace(/^(น้อง\s?)+/gi, ""));
      const loc = escapeHTML(sanitizeThaiText(p.location) || provinceNameThai);
      const slug = encodeURIComponent(p.slug || p.id);
      const img = optimizeImg(p.imagePath || p.image_url || "", 400);
      const isAvail = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(s => (p.availability || "").toLowerCase().includes(s));
      return `
        <div class="vip-card-item ${i === 0 ? "active-glow" : ""}" data-profile-id="${p.id}" data-profile-slug="${slug}">
          <span class="vip-status-chip"><span aria-hidden="true">🟢</span> ${isAvail ? "รับงาน" : "สอบถาม"}</span>
          <span class="hot-rank-badge">#${i + 1} HOT</span>
          <img src="${img}" alt="น้อง${cleanName} (${provinceNameThai})" width="175" height="245" loading="${i === 0 ? "eager" : "lazy"}" fetchpriority="${i === 0 ? "high" : "auto"}" decoding="async" onerror="this.onerror=null; this.src='https://firstmodelhub.com/images/firstmodelhub.webp';">
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
      const hotTitle = isNational ? "น้องๆ ไซด์ไลน์ HOT 🔥 ฟิวแฟนยอดนิยมทั่วไทย" : `น้องๆ ไซด์ไลน์ HOT 🔥 ฟิวแฟนยอดนิยม ${escapeHTML(provinceNameThai)}`;
      const hotPill = isNational ? "ประจำเดือน #ฟิวแฟน" : `โซนยอดนิยม ${escapeHTML(provinceNameThai)} #ฟิวแฟน`;
      finalHtml = finalHtml.replace(/<h2 id="hot-profiles-heading"[^>]*>[\s\S]*?<\/h2>/i, `<h2 id="hot-profiles-heading" class="hot-main-title">${hotTitle}</h2>`);
      finalHtml = finalHtml.replace(/<span class="hot-monthly-pill">[\s\S]*?<\/span>/i, `<span class="hot-monthly-pill">${hotPill}</span>`);
    }

    if (isNational && featuredCardsHtml && featuredCardsHtml.trim() !== "") {
      finalHtml = finalHtml.replace(/<div id="featured-profiles-container"[^>]*>[\s\S]*?<\/div>/i, `<div id="featured-profiles-container" class="profile-grid profiles-grid-row" aria-labelledby="featured-heading">${featuredCardsHtml}</div>`);
    } else {
      finalHtml = finalHtml.replace(/<section id="featured-profiles"[\s\S]*?<\/section>\s*/i, "");
    }

    let displayAreaHtml = "";
    if (isNational) {
      const groupedByProvince = profilesList.reduce((acc, p) => {
        const key = String(p.provinceKey || p.province_slug || "no_province").toLowerCase();
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
        const pCards = topCards.map(p => renderCardHtml(p, false, pName)).join("");

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
            <div class="profile-grid profiles-grid-row">${pCards}</div>
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
                  <span class="province-name-highlight">${escapeHTML(provinceNameThai)}${zoneSlug ? ` โซน${escapeHTML(zoneSlug)}` : ""}</span>
              </h2>
              <span class="province-count-pill"><span class="pulse-dot-el"></span><span>${totalCount} โปรไฟล์</span></span>
          </div>
          <div class="profile-grid profiles-grid-row">${allCardsHtml}</div>
        </div>
      `;
    }

    finalHtml = finalHtml.replace(
      /<div id="profiles-display-area"[^>]*>[\s\S]*?<\/div>/i, 
      `<div id="profiles-display-area" role="region" aria-label="โปรไฟล์น้องๆ รับงานและไซด์ไลน์${provinceNameThai}">${displayAreaHtml}</div>`
    );

    const schemaJsonStr = JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }).replace(/</g, "\\u003c");
    finalHtml = finalHtml.replace(/<script type="application\/ld\+json" id="dynamic-schema">[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="dynamic-schema">\n${schemaJsonStr}\n<\/script>`);

    const freshnessBox = ` <div style="background: rgba(124, 58, 237, 0.05); border-left: 3px solid #7C3AED; padding: 10px 14px; margin-bottom: 16px; border-radius: 8px; font-size: 12px; color: #475569; line-height: 1.6;"> ⚡ <strong>สถานะความพร้อมให้บริการ (<time class="fmh-relative-time" datetime="${latestActualIso}">${realProvinceTimeText}</time>):</strong> มีน้องๆ สแตนด์บายใน${escapeHTML(provinceNameThai)}${zoneSlug ? ` โซน${zoneSlug}` : ""} ทั้งหมด ${totalCount} โปรไฟล์ ตรวจสอบตัวตนตรงปกแล้ว นัดเจอจ่ายหน้างาน ปลอดภัย 100% </div> `;
    finalHtml = finalHtml.replace(/<div\s+class=["']seo-content-inner["'][^>]*>[\s\S]*?<\/div>/i, `<div class="seo-content-inner" style="font-size: 13px; color: #1E293B; line-height: 1.75; font-weight: 500;">${freshnessBox}${linkedIntro}</div>`);

    if (faqsHtml) finalHtml = finalHtml.replace(/<div id="faq-container-list"[^>]*>[\s\S]*?<\/div>/i, `<div id="faq-container-list" class="faq-list-wrapper">${faqsHtml}</div>`);

    if (popularLocationsFooter) {
      finalHtml = finalHtml.replace(/<div class="footer-locations-block">[\s\S]*?<\/div>\s*(?=<div class="footer-bottom-bar">)/i, `<div class="footer-locations-block">${popularLocationsFooter}</div>`);
    }

    const clientProfilesData = profilesList.map(p => {
      let rawGal = p.galleryPaths || p.gallery_paths || p.gallery || [];
      if (typeof rawGal === "string") {
        try { rawGal = JSON.parse(rawGal); } catch (_) { rawGal = rawGal.split(",").map(s => s.trim()); }
      }
      return {
        id: p.id,
        slug: p.slug || String(p.id),
        name: (p.name || "น้อง").replace(/^(น้อง\s?)+/gi, "").trim(),
        imagePath: p.imagePath || p.image_url || "",
        galleryPaths: Array.isArray(rawGal) ? rawGal.filter(Boolean) : [],
        provinceKey: p.provinceKey || "chiangmai",
        location: sanitizeThaiText(p.location || ""),
        rate: extractCleanNumber(p.rate || p.price),
        age: p.age || "",
        stats: p.stats || "",
        availability: p.availability || "รับงาน",
        isfeatured: Boolean(p.isfeatured),
        verified: Boolean(p.verified),
        styleTags: Array.isArray(p.styleTags) ? p.styleTags.slice(0, 3) : [],
        description: sanitizeThaiText(p.description || "")
      };
    });

    const serializedProfilesJson = JSON.stringify(clientProfilesData).replace(/</g, "\\u003c");

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
        window.currentZoneSlug = ${JSON.stringify(zoneSlug || "")};
      </script>
    `;
    finalHtml = finalHtml.replace(/<script id="ssr-profiles-data">[\s\S]*?<\/script>/i, ssrDataScript);

    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_NAME}}", provinceNameThai);
    finalHtml = replaceGlobal(finalHtml, "{{PROFILE_COUNT}}", String(totalCount));
    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_ZONES}}", zonesStr || "ทุกพื้นที่");
    finalHtml = replaceGlobal(finalHtml, "{{SEO_CANONICAL}}", canonicalUrl);
    finalHtml = replaceGlobal(finalHtml, "{{SEO_IMAGE}}", heroImage);
    finalHtml = finalHtml.replace(/<iframe\s+id=["']google-map["'][^>]*src=["'][^"']*["']/i, `<iframe id="google-map" src="${mapEmbedUrl}"`);

    finalHtml = finalHtml.replace(/<link\s+rel=["']preload["']\s+as=["']image["'][^>]*>/gi, "");

    const validLcpProfile = profilesList.find(p => {
      const img = (p.imagePath || p.image_url || p.imageUrl || "").trim().toLowerCase();
      return img && !img.includes("firstmodelhub.webp");
    });

    if (validLcpProfile) {
      const rawLcpImg = validLcpProfile.imagePath || validLcpProfile.image_url || validLcpProfile.imageUrl;
      const lcpImgSmall = optimizeImg(rawLcpImg, 400);
      const lcpImgLarge = optimizeImg(rawLcpImg, 600);
      const preloadTag = `  <link rel="preload" as="image" href="${lcpImgSmall}" imagesrcset="${lcpImgSmall} 400w, ${lcpImgLarge} 600w" imagesizes="(max-width: 600px) 100vw, 400px" fetchpriority="high">\n</head>`;
      finalHtml = finalHtml.replace(/<\/head>/i, preloadTag);
    }

    finalHtml = replaceGlobal(finalHtml, "https://line.me/ti/p/u8Bz9HsaY8", liveAdminLine);
    finalHtml = finalHtml.replace(/\/styles\.css\?v=[^"'\s>]+/g, `/styles.css?v=${GLOBAL_VERSION}`);
    finalHtml = finalHtml.replace(/\/main\.js\?v=[^"'\s>]+/g, `/main.js?v=${GLOBAL_VERSION}`);

    const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
      "Netlify-CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      "ETag": `"${GLOBAL_VERSION}"`,
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
    };

    setSafePageCache(cacheKey, { html: finalHtml, headers: responseHeaders, version: GLOBAL_VERSION });
    return new Response(finalHtml, { headers: responseHeaders });

  } catch (err) {
    console.error("SSR Edge Function Error:", err);
    return await context.next();
  }
};
