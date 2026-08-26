import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const PAGE_CACHE = new Map();
const MAX_CACHE_SIZE = 300;
let GLOBAL_LAST_TIMESTAMP = `init_${Date.now()}`;
let LAST_PROBE_TIME = 0;

// 🟢 ตั้งเวลาเช็คฐานข้อมูลอัตโนมัติ (30 วินาที = ปลอดภัยต่อ Free Tier ไม่เกินลิมิต 100%)
const AUTO_CHECK_INTERVAL_MS = 30000;

const PURGE_SECRET_KEY = "fmh_secure_purge_2026";
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
  // =========================================================================
  // 🏔️ ภาคเหนือ (NORTHERN CLUSTER)
  // =========================================================================
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
  "chiang-rai": {
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
  phrae: {
    name: "แพร่",
    geo: { lat: 18.1446, lng: 100.1410 },
    zones: ["ตัวเมืองแพร่", "ทุ่งโฮ้ง", "ในเวียง", "สูงเม่น", "เด่นชัย"],
    faqs: [
      { q: "สาวรับงานแพร่ นัดเจอโซนไหนสะดวกที่สุด?", a: "โรงแรมชั้นนำในเขตตัวเมืองแพร่ และย่านในเวียง เป็นจุดนัดพบที่สะดวกและปลอดภัยที่สุดครับ" }
    ]
  },
  nan: {
    name: "น่าน",
    geo: { lat: 18.7838, lng: 100.7782 },
    zones: ["ตัวเมืองน่าน", "ในเวียง", "ภูเพียง", "กาดน่าน"],
    faqs: [
      { q: "เพื่อนเที่ยวน่าน นำเที่ยวและดูแลอย่างไร?", a: "น้องๆ ดูแลสุภาพสไตล์ฟิวแฟน พาเที่ยวคาเฟ่ ร้านอาหาร และพักผ่อนในบรรยากาศเมืองน่านได้อย่างประทับใจครับ" }
    ]
  },

  // =========================================================================
  // 🌾 ภาคตะวันออกเฉียงเหนือ (NORTHEAST / ISAN CLUSTER)
  // =========================================================================
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
  udonthani: {
    name: "อุดรธานี",
    geo: { lat: 17.4138, lng: 102.7872 },
    zones: ["ตัวเมืองอุดร", "UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร", "บ้านจาน", "โพศรี"],
    faqs: [
      { q: "สาวรับงานอุดรธานี นัดพบแถวไหนสะดวกที่สุด?", a: "ย่านใจกลางเมืองอุดรธานี, UD Town, เซ็นทรัลอุดร และรอบสวนสาธารณะหนองประจักษ์ เป็นจุดนัดพบยอดนิยมครับ" }
    ]
  },
  "udon-thani": {
    name: "อุดรธานี",
    geo: { lat: 17.4138, lng: 102.7872 },
    zones: ["ตัวเมืองอุดร", "UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร", "บ้านจาน", "โพศรี"],
    faqs: [
      { q: "สาวรับงานอุดรธานี นัดพบแถวไหนสะดวกที่สุด?", a: "ย่านใจกลางเมืองอุดรธานี, UD Town, เซ็นทรัลอุดร และรอบสวนสาธารณะหนองประจักษ์ เป็นจุดนัดพบยอดนิยมครับ" }
    ]
  },
  udon: {
    name: "อุดรธานี",
    geo: { lat: 17.4138, lng: 102.7872 },
    zones: ["ตัวเมืองอุดร", "UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร", "บ้านจาน", "โพศรี"],
    faqs: [
      { q: "สาวรับงานอุดรธานี นัดพบแถวไหนสะดวกที่สุด?", a: "ย่านใจกลางเมืองอุดรธานี, UD Town, เซ็นทรัลอุดร และรอบสวนสาธารณะหนองประจักษ์ เป็นจุดนัดพบยอดนิยมครับ" }
    ]
  },
  ubonratchathani: {
    name: "อุบลราชธานี",
    geo: { lat: 15.2448, lng: 104.8473 },
    zones: ["ตัวเมืองอุบล", "วารินชำราบ", "ม.อุบล", "ดอนกลาง", "เซ็นทรัลอุบล", "ชยางกูร"],
    faqs: [
      { q: "สาวรับงานอุบลราชธานี นัดหมายแถวไหนสะดวกที่สุด?", a: "พิกัดยอดนิยมคือตัวเมืองอุบล, ย่านถนนชยางกูร, วารินชำราบ และรอบมหาวิทยาลัยอุบลราชธานีครับ" }
    ]
  },
  "ubon-ratchathani": {
    name: "อุบลราชธานี",
    geo: { lat: 15.2448, lng: 104.8473 },
    zones: ["ตัวเมืองอุบล", "วารินชำราบ", "ม.อุบล", "ดอนกลาง", "เซ็นทรัลอุบล", "ชยางกูร"],
    faqs: [
      { q: "สาวรับงานอุบลราชธานี นัดหมายแถวไหนสะดวกที่สุด?", a: "พิกัดยอดนิยมคือตัวเมืองอุบล, ย่านถนนชยางกูร, วารินชำราบ และรอบมหาวิทยาลัยอุบลราชธานีครับ" }
    ]
  },
  ubon: {
    name: "อุบลราชธานี",
    geo: { lat: 15.2448, lng: 104.8473 },
    zones: ["ตัวเมืองอุบล", "วารินชำราบ", "ม.อุบล", "ดอนกลาง", "เซ็นทรัลอุบล", "ชยางกูร"],
    faqs: [
      { q: "สาวรับงานอุบลราชธานี นัดหมายแถวไหนสะดวกที่สุด?", a: "พิกัดยอดนิยมคือตัวเมืองอุบล, ย่านถนนชยางกูร, วารินชำราบ และรอบมหาวิทยาลัยอุบลราชธานีครับ" }
    ]
  },
  nakhonratchasima: {
    name: "นครราชสีมา",
    geo: { lat: 14.9799, lng: 102.0978 },
    zones: ["ตัวเมืองโคราช", "ตลาดเซฟวัน", "จอหอ", "มทส.", "เดอะมอลล์โคราช", "เซ็นทรัลโคราช"],
    faqs: [
      { q: "สาวรับงานโคราช นครราชสีมา นัดหมายโซนไหนสะดวก?", a: "ย่านเซฟวัน, จอหอ, ตัวเมืองโคราช และละแวก มทส. มีน้องๆ สแตนด์บายพร้อมบริการอย่างสะดวกรวดเร็วครับ" }
    ]
  },
  "nakhon-ratchasima": {
    name: "นครราชสีมา",
    geo: { lat: 14.9799, lng: 102.0978 },
    zones: ["ตัวเมืองโคราช", "ตลาดเซฟวัน", "จอหอ", "มทส.", "เดอะมอลล์โคราช", "เซ็นทรัลโคราช"],
    faqs: [
      { q: "สาวรับงานโคราช นครราชสีมา นัดหมายโซนไหนสะดวก?", a: "ย่านเซฟวัน, จอหอ, ตัวเมืองโคราช และละแวก มทส. มีน้องๆ สแตนด์บายพร้อมบริการอย่างสะดวกรวดเร็วครับ" }
    ]
  },
  korat: {
    name: "นครราชสีมา",
    geo: { lat: 14.9799, lng: 102.0978 },
    zones: ["ตัวเมืองโคราช", "ตลาดเซฟวัน", "จอหอ", "มทส.", "เดอะมอลล์โคราช", "เซ็นทรัลโคราช"],
    faqs: [
      { q: "สาวรับงานโคราช นครราชสีมา นัดหมายโซนไหนสะดวก?", a: "ย่านเซฟวัน, จอหอ, ตัวเมืองโคราช และละแวก มทส. มีน้องๆ สแตนด์บายพร้อมบริการอย่างสะดวกรวดเร็วครับ" }
    ]
  },
  buriram: {
    name: "บุรีรัมย์",
    geo: { lat: 14.9951, lng: 103.1029 },
    zones: ["ตัวเมืองบุรีรัมย์", "ช้างอารีนา", "ม.ราชภัฏบุรีรัมย์", "ประโคนชัย"],
    faqs: [
      { q: "สาวรับงานบุรีรัมย์ นัดหมายแถวไหนสะดวกที่สุด?", a: "โรงแรมชั้นนำในตัวเมืองบุรีรัมย์ และรอบสนามช้างอารีนา เป็นจุดนัดพบยอดนิยมครับ" }
    ]
  },
  surin: {
    name: "สุรินทร์",
    geo: { lat: 14.8818, lng: 103.4936 },
    zones: ["ตัวเมืองสุรินทร์", "ม.ราชภัฏสุรินทร์", "โรบินสันสุรินทร์", "ปราสาท"],
    faqs: [
      { q: "ไซด์ไลน์สุรินทร์ ปลอดภัยจ่ายหน้างานไหม?", a: "ปลอดภัย 100% ครับ เจอน้องตัวจริงตรวจสอบความตรงปกหน้างานแล้วจึงชำระเงิน ไม่มีโอนมัดจำครับ" }
    ]
  },
  roiet: {
    name: "ร้อยเอ็ด",
    geo: { lat: 16.0538, lng: 103.6520 },
    zones: ["ตัวเมืองร้อยเอ็ด", "บึงพลาญชัย", "หอโหวด", "โรบินสันร้อยเอ็ด"],
    faqs: [
      { q: "สาวรับงานร้อยเอ็ด นัดหมายอย่างไร?", a: "นัดหมายผ่านไลน์ทางการเพื่อเช็กคิวน้องๆ สแตนด์บายในเขตตัวเมืองร้อยเอ็ดและรอบบึงพลาญชัยได้ตลอด 24 ชม. ครับ" }
    ]
  },

  // =========================================================================
  // 🏙️ ภาคกลาง & ตะวันออก (CENTRAL & EASTERN CLUSTER)
  // =========================================================================
  bangkok: {
    name: "กรุงเทพฯ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย", "สาทร", "บางนา"],
    faqs: [
      { q: "สาวรับงานกรุงเทพฯ ครอบคลุมโซนไหนบ้าง?", a: "ครอบคลุมทุกโซนสำคัญ เช่น สุขุมวิท, รัชดา, ห้วยขวาง, ลาดพร้าว, ทองหล่อ, สาทร และบางนา สะดวกและเป็นส่วนตัวครับ" }
    ]
  },
  bkk: {
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
  pattaya: {
    name: "พัทยา",
    geo: { lat: 12.9276, lng: 100.8771 },
    zones: ["พัทยากลาง", "พัทยาเหนือ", "พัทยาใต้", "หาดจอมเทียน", "นาเกลือ", "เขาพระตำหนัก", "วงศ์อมาตย์"],
    faqs: [
      { q: "สาวรับงานพัทยา สแตนด์บายโซนไหนบ้าง?", a: "มีน้องๆ พร้อมดูแลตลอดแนวชายหาดพัทยา, จอมเทียน, วงศ์อมาตย์ และโรงแรมชั้นนำในพัทยาทุกโซนครับ" }
    ]
  },
  rayong: {
    name: "ระยอง",
    geo: { lat: 12.6814, lng: 101.2816 },
    zones: ["ตัวเมืองระยอง", "มาบตาพุด", "ปลวกแดง", "หาดแม่รำพึง", "บ้านฉาง", "แหลมแม่พิมพ์"],
    faqs: [
      { q: "สาวรับงานระยอง โซนมาบตาพุดและปลวกแดงนัดอย่างไร?", a: "น้องๆ สแตนด์บายพร้อมบริการทั้งในเขตนิคมมาบตาพุด ปลวกแดง ตัวเมืองระยอง และบ้านฉางครับ" }
    ]
  },
  ayutthaya: {
    name: "พระนครศรีอยุธยา",
    geo: { lat: 14.3532, lng: 100.5684 },
    zones: ["ตัวเมืองอยุธยา", "นิคมโรจนะ", "วังน้อย", "บางปะอิน", "เซ็นทรัลอยุธยา", "อุทัย"],
    faqs: [
      { q: "สาวรับงานอยุธยา โซนนิคมโรจนะและวังน้อยนัดหมายอย่างไร?", a: "น้องๆ สแตนด์บายพร้อมดูแลทั้งโซนนิคมโรจนะ วังน้อย บางปะอิน และเขตตัวเมืองอยุธยาครับ" }
    ]
  },
  "phra-nakhon-si-ayutthaya": {
    name: "พระนครศรีอยุธยา",
    geo: { lat: 14.3532, lng: 100.5684 },
    zones: ["ตัวเมืองอยุธยา", "นิคมโรจนะ", "วังน้อย", "บางปะอิน", "เซ็นทรัลอยุธยา", "อุทัย"],
    faqs: [
      { q: "สาวรับงานอยุธยา โซนนิคมโรจนะและวังน้อยนัดหมายอย่างไร?", a: "น้องๆ สแตนด์บายพร้อมดูแลทั้งโซนนิคมโรจนะ วังน้อย บางปะอิน และเขตตัวเมืองอยุธยาครับ" }
    ]
  },
  nonthaburi: {
    name: "นนทบุรี",
    geo: { lat: 13.8621, lng: 100.5144 },
    zones: ["เมืองทองธานี", "งามวงศ์วาน", "แคราย", "แจ้งวัฒนะ", "รัตนาธิเบศร์", "บางใหญ่", "เซ็นทรัลเวสต์เกต"],
    faqs: [
      { q: "สาวรับงานนนทบุรี เมืองทองธานี แจ้งวัฒนะ นัดหมายอย่างไร?", a: "มีน้องๆ ประจำโซนเมืองทอง แจ้งวัฒนะ งามวงศ์วาน และบางใหญ่ พร้อมบริการสะดวกรวดเร็วครับ" }
    ]
  },
  pathumthani: {
    name: "ปทุมธานี",
    geo: { lat: 14.0208, lng: 100.5250 },
    zones: ["รังสิต", "ม.กรุงเทพ", "ม.ธรรมศาสตร์ รังสิต", "ฟิวเจอร์พาร์ค", "ลำลูกกา", "คลองหลวง", "นวนคร"],
    faqs: [
      { q: "สาวรับงานรังสิต ปทุมธานี นัดเจอแถวไหนสะดวก?", a: "โซนฟิวเจอร์พาร์ครังสิต, ละแวก ม.กรุงเทพ, ม.ธรรมศาสตร์ และนวนคร เป็นพิกัดยอดนิยมครับ" }
    ]
  },
  samutprakan: {
    name: "สมุทรปราการ",
    geo: { lat: 13.5991, lng: 100.5968 },
    zones: ["บางนา-ตราด", "สำโรง", "เทพารักษ์", "สมุทรปราการ", "กิ่งแก้ว", "เมกาบางนา", "แพรกษา"],
    faqs: [
      { q: "สาวรับงานสมุทรปราการ บางนา สำโรง นัดหมายอย่างไร?", a: "น้องๆ สแตนด์บายรอบแนวรถไฟฟ้า BTS สำโรง แบริ่ง เทพารักษ์ และกิ่งแก้ว นัดเจอง่ายปลอดภัยครับ" }
    ]
  },

  // =========================================================================
  // 🏖️ ภาคใต้ (SOUTHERN CLUSTER)
  // =========================================================================
  phuket: {
    name: "ภูเก็ต",
    geo: { lat: 7.8804, lng: 98.3923 },
    zones: ["ตัวเมืองภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง", "กะรน", "กะตะ", "บางเทา", "ราไวย์"],
    faqs: [
      { q: "นัดหมายสาวรับงานภูเก็ต ป่าตอง จ่ายเงินอย่างไร?", a: "นัดเจอตัวจริงตรงปกหน้างานแล้วค่อยชำระเงินตรงกับน้อง ไม่มีโอนมัดจำล่วงหน้าทุกกรณีครับ" }
    ]
  },
  suratthani: {
    name: "สุราษฎร์ธานี",
    geo: { lat: 9.1382, lng: 99.3215 },
    zones: ["ตัวเมืองสุราษฎร์", "เกาะสมุย", "เฉวง", "ละไม", "เกาะพะงัน", "พุนพิน", "เซ็นทรัลสุราษฎร์"],
    faqs: [
      { q: "สาวรับงานสุราษฎร์ธานี และเกาะสมุย นัดหมายอย่างไร?", a: "มีน้องๆ สแตนด์บายทั้งในตัวเมืองสุราษฎร์ธานี และโซนหาดเฉวง หาดละไม บนเกาะสมุยครับ" }
    ]
  },
  "surat-thani": {
    name: "สุราษฎร์ธานี",
    geo: { lat: 9.1382, lng: 99.3215 },
    zones: ["ตัวเมืองสุราษฎร์", "เกาะสมุย", "เฉวง", "ละไม", "เกาะพะงัน", "พุนพิน", "เซ็นทรัลสุราษฎร์"],
    faqs: [
      { q: "สาวรับงานสุราษฎร์ธานี และเกาะสมุย นัดหมายอย่างไร?", a: "มีน้องๆ สแตนด์บายทั้งในตัวเมืองสุราษฎร์ธานี และโซนหาดเฉวง หาดละไม บนเกาะสมุยครับ" }
    ]
  },
  samui: {
    name: "เกาะสมุย",
    geo: { lat: 9.5357, lng: 100.0601 },
    zones: ["หาดเฉวง", "หาดละไม", "บ่อผุด", "แม่น้ำ", "เชิงมน", "หน้าทอน"],
    faqs: [
      { q: "สาวรับงานเกาะสมุย สแตนด์บายหาดไหนบ้าง?", a: "มีน้องๆ ประจำแถวหาดเฉวง, หาดละไม, บ่อผุด และวิลล่าส่วนตัวทั่วเกาะสมุยครับ" }
    ]
  },
  songkhla: {
    name: "สงขลา",
    geo: { lat: 7.1898, lng: 100.5954 },
    zones: ["หาดใหญ่", "ตัวเมืองสงขลา", "รอบ ม.อ.", "ด่านนอก", "สะเดา", "เซ็นทรัลหาดใหญ่"],
    faqs: [
      { q: "สาวรับงานหาดใหญ่ สงขลา นัดหมายแถวไหนสะดวก?", a: "ย่านใจกลางเมืองหาดใหญ่, รอบมหาวิทยาลัยสงขลานครินทร์ (ม.อ.) และโซนด่านนอกสะเดา มีน้องๆ พร้อมบริการครับ" }
    ]
  },
  hatyai: {
    name: "หาดใหญ่",
    geo: { lat: 7.0084, lng: 100.4767 },
    zones: ["ตัวเมืองหาดใหญ่", "รอบ ม.อ.", "ลีการ์เดนส์", "เซ็นทรัลหาดใหญ่", "ด่านนอก", "คอหงส์"],
    faqs: [
      { q: "สาวรับงานหาดใหญ่ นัดหมายแถวไหนสะดวก?", a: "ย่านใจกลางเมืองหาดใหญ่, รอบ ม.อ. และเซ็นทรัลเฟสติวัลหาดใหญ่ เป็นจุดนัดพบยอดนิยมครับ" }
    ]
  },
  "hat-yai": {
    name: "หาดใหญ่",
    geo: { lat: 7.0084, lng: 100.4767 },
    zones: ["ตัวเมืองหาดใหญ่", "รอบ ม.อ.", "ลีการ์เดนส์", "เซ็นทรัลหาดใหญ่", "ด่านนอก", "คอหงส์"],
    faqs: [
      { q: "สาวรับงานหาดใหญ่ นัดหมายแถวไหนสะดวก?", a: "ย่านใจกลางเมืองหาดใหญ่, รอบ ม.อ. และเซ็นทรัลเฟสติวัลหาดใหญ่ เป็นจุดนัดพบยอดนิยมครับ" }
    ]
  },
  krabi: {
    name: "กระบี่",
    geo: { lat: 8.0863, lng: 98.9063 },
    zones: ["อ่าวนาง", "ตัวเมืองกระบี่", "คลองม่วง", "เกาะพีพี", "อ่าวน้ำเมา"],
    faqs: [
      { q: "สาวรับงานอ่าวนาง กระบี่ นัดหมายอย่างไร?", a: "น้องๆ สแตนด์บายพร้อมบริการทั้งในโซนหาดอ่าวนาง ตัวเมืองกระบี่ และหาดคลองม่วงครับ" }
    ]
  },
  huahin: {
    name: "หัวหิน",
    geo: { lat: 12.5684, lng: 99.9577 },
    zones: ["ตัวเมืองหัวหิน", "เขาตะเกียบ", "ชะอำ", "สวนสน", "บลูพอร์ต", "มาร์เก็ตวิลเลจ"],
    faqs: [
      { q: "สาวรับงานหัวหิน ชะอำ นัดหมายโซนไหนสะดวก?", a: "โรงแรมและรีสอร์ตชั้นนำตลอดแนวชายหาดหัวหิน เขาตะเกียบ และชะอำ มีน้องๆ สแตนด์บายพร้อมบริการครับ" }
    ]
  },
  "hua-hin": {
    name: "หัวหิน",
    geo: { lat: 12.5684, lng: 99.9577 },
    zones: ["ตัวเมืองหัวหิน", "เขาตะเกียบ", "ชะอำ", "สวนสน", "บลูพอร์ต", "มาร์เก็ตวิลเลจ"],
    faqs: [
      { q: "สาวรับงานหัวหิน ชะอำ นัดหมายโซนไหนสะดวก?", a: "โรงแรมและรีสอร์ตชั้นนำตลอดแนวชายหาดหัวหิน เขาตะเกียบ และชะอำ มีน้องๆ สแตนด์บายพร้อมบริการครับ" }
    ]
  },

  // =========================================================================
  // 🌐 ค่ามาตรฐานทั่วประเทศ (NATIONAL DEFAULT)
  // =========================================================================
  national: {
    name: "ทั่วไทย",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "พัทยา", "ภูเก็ต", "ขอนแก่น", "อุดรธานี", "หาดใหญ่"],
    faqs: [
      { q: "เรียกใช้บริการน้องๆ สาวรับงาน เด็กเอ็น First Model Hub ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่ต้องโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ ลูกค้าตกลงชำระค่าบริการหน้างานเมื่อเจอน้องตัวจริงตรงปกแล้วเท่านั้น" }
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

Object.keys(PROVINCE_SEO_DATA).forEach(key => {
  if (key !== "default") {
    PROVINCE_SEO_DATA[key] = { ...PROVINCE_SEO_DATA.default, ...PROVINCE_SEO_DATA[key] };
  }
});

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

function optimizeImg(path, width = 400, height = 500) {
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
    <p>ยินดีต้อนรับสู่ <strong>${CONFIG.BRAND_NAME}</strong> แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ สาวรับงาน${provinceName}, เด็กเอ็น${provinceName} และ เพื่อนเที่ยวไซด์ไลน์${provinceName} แหล่งรวบรวมโปรไฟล์ผู้ดูแลระดับพรีเมียมที่เน้นความโปร่งใส ปลอดภัย และเพียบพร้อมด้วยการดูแลเอาใจใส่สไตล์ ฟิวแฟน (Girlfriend Experience - GFE) อย่างสุภาพเรียบร้อยเป็นธรรมชาติ ปราศจากเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี</p>
    <p>เพื่อตอบสนองความสะดวกในการนัดหมายพิกัดบริการในพื้นที่ ${provinceName} น้องๆ ในระบบของเรากระจายตัวอยู่ในจุดที่เหมาะสม${zoneText} ไม่ว่าจะเป็นโรงแรมชั้นนำ คอนโดมิเนียมส่วนตัว หรือพิกัดยอดนิยม เดินทางสะดวกสบายและมีความปลอดภัยสูง พร้อมร่วมเดินทางท่องเที่ยว ทานอาหาร หรือพูดคุยเพื่อสร้างความผ่อนคลายและคลายเหงาให้แก่คุณในโอกาสพิเศษ</p>
    <p>รูปภาพและข้อมูลรายละเอียดสัดส่วนของน้องๆ ได้รับการคัดกรองและตรวจสอบยืนยันตัวตน (Verified System) อย่างรอบคอบ เพื่อให้สมาชิกมั่นใจได้ว่าข้อมูลถูกต้อง ตรงตามปก 100% ปลอดภัยนัดเจอ ชำระหน้างาน ไม่มีความเสี่ยงทางการเงินทุกกรณีครับ</p>
  `;
}

function getDynamicReviews(provinceName) {
  const now = new Date();
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
      date: "เมื่อสัปดาห์ที่แล้ว",
      datePublished: new Date(now.getTime() - 7 * 86400000).toISOString().split("T")[0]
    },
    {
      author: "คุณอภิชาติ",
      initial: "A",
      location: isChiangMai ? "โซนยอดนิยม นิมมาน" : `โซนยอดนิยมใน${provinceName}`,
      text: "น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยมเสมือนมีเพื่อนร่วมทางคนพิเศษคอยเคียงข้าง ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ",
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

const renderCardHtml = (p, index, total, provinceName) => {
  const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/gi, ""));
  const loc = escapeHTML(sanitizeThaiText(p.location) || provinceName);
  const profileUrl = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
  const isAvail = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(s => (p.availability || "").toLowerCase().includes(s));
  const availStatus = p.availability || (isAvail ? "รับงาน" : "สอบถามคิว");
  const ageStr = p.age && p.age !== "-" ? ` ${escapeHTML(p.age)}` : "";
  const statusClass = isAvail ? "status-online" : "status-busy";
  
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
  const cardImg = optimizeImg(rawImg, 400, 533);
  
  let priceStr = "1,500.-";
  if (p.rate) {
    priceStr = isNaN(p.rate) ? escapeHTML(p.rate).trim() : `${Number(p.rate).toLocaleString()}.-`;
  }

  let rightBadgeHtml = "";
  if (index < 2) {
    rightBadgeHtml = `<span class="badge-hot-tag">#${index + 1} HOT 🔥</span>`;
  } else if (p.isfeatured) {
    rightBadgeHtml = `<span class="badge-verified-top">✦ VERIFIED 100%</span>`;
  } else {
    rightBadgeHtml = `<span class="badge-verified-top">✓ ตรงปก</span>`;
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
          
          <a href="${profileUrl}" class="card-link" aria-label="ดูโปรไฟล์น้อง${cleanName} สาวรับงาน${provinceName}"></a>

          <div class="profile-card-info-content">
              <div class="profile-card-title-row">
                  <h3 class="profile-card-name">น้อง${cleanName}</h3>
                  ${ageStr ? `<span class="profile-card-age-tag">${ageStr.trim()} ปี</span>` : ""}
              </div>
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
  const url = new URL(req.url);
  const primaryDomain = CONFIG.PRIMARY_DOMAIN;
  const hostname = url.hostname.toLowerCase();

  // =========================================================================
  // ⚡ 1. คำสั่งล้างแคชด้วยตนเอง (Manual Purge URL ทางลัดสำหรับแอดมิน)
  // =========================================================================
  if (url.pathname === "/api/clear-cache" || url.pathname === "/api/purge-cache") {
    const secret = url.searchParams.get("secret") || req.headers.get("x-purge-secret");
    if (secret === PURGE_SECRET_KEY) {
      PAGE_CACHE.clear();
      TEMPLATE_HTML_CACHE = null;
      GLOBAL_LAST_TIMESTAMP = `manual_${Date.now()}`;
      return new Response(JSON.stringify({
        success: true,
        message: "⚡ All SSR & HTML In-Memory Caches Purged Successfully!",
        purged_at: new Date().toISOString(),
        version: GLOBAL_LAST_TIMESTAMP
      }), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }
    return new Response(JSON.stringify({ error: "Unauthorized: Invalid Secret Key" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }

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
  
  if (["/about", "/faq", "/blog", "/contact", "/terms-of-service", "/privacy-policy", "/locations", "/nimman", "/index-en", "/offline", "/llms.txt", "/sideline", "/profile"].some(p => cleanPath === p || cleanPath.startsWith(p + "/"))) {
    return await context.next();
  }

  if (url.pathname === "/index.html") {
    return Response.redirect(`${primaryDomain}/`, 301);
  }

  // =========================================================================
  // ⚡ 2. ระบบตรวจจับการเปลี่ยนแปลงฐานข้อมูลอัตโนมัติ (Self-Healing Auto Cache)
  // =========================================================================
  const now = Date.now();
  const isForcedPurge = url.searchParams.has("refresh") || url.searchParams.has("purge") || url.searchParams.has("clear_cache");
  
  if (isForcedPurge) {
    PAGE_CACHE.clear();
    GLOBAL_LAST_TIMESTAMP = `forced_${now}`;
  }

  const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

  // 🟢 ตรวจสอบฐานข้อมูลอัตโนมัติทุกๆ 30 วินาทีแบบประหยัดโควต้า (ไม่เกินขีดจำกัด Free Tier แน่นอน)
  if (!isForcedPurge && now - LAST_PROBE_TIME > AUTO_CHECK_INTERVAL_MS) {
    LAST_PROBE_TIME = now;
    try {
      const [{ count }, { data: latestProfile }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("profiles").select("lastUpdated, created_at").eq("active", true).order("lastUpdated", { ascending: false, nullsFirst: false }).limit(1).maybeSingle()
      ]);

      const latestTs = `${count || 0}_${latestProfile?.lastUpdated || latestProfile?.created_at || "v1"}`;
      if (latestTs !== GLOBAL_LAST_TIMESTAMP) {
        PAGE_CACHE.clear(); // ล้างแคชทันทีเมื่อพบว่ามีการ เพิ่ม/ลบ/แก้ไข ในหลังบ้าน
        GLOBAL_LAST_TIMESTAMP = latestTs;
      }
    } catch {
      // ป้องกัน Error หากการเชื่อมต่อขัดข้อง
    }
  }

  // 🟢 เสิร์ฟจาก RAM แคชทันทีหากไม่มีการเปลี่ยนแปลง (Supabase ไม่ถูกเรียก = 0 Request)
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
      ? optimizeImg(profilesList[0].imagePath || profilesList[0].image_url, 1200, 630)
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

    let metaTitle = "";
    let metaDescription = "";
    if (isNational) {
      metaTitle = "สาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานทั่วไทย) | First Model Hub";
      metaDescription = "ศูนย์รวมสาวรับงาน ไซด์ไลน์ เด็กเอ็น เพื่อนเที่ยวฟิวแฟนพรีเมียมทั่วไทย เชียงใหม่ ขอนแก่น เชียงราย ลำปาง การันตีตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มีโอนมัดจำ";
    } else {
     metaTitle = "สาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนตรงปก 100% | First Model Hub";
      metaDescription = customMetadata?.desc || `ศูนย์รวมสาวรับงาน${provinceNameThai} และเพื่อนเที่ยวไซด์ไลน์ฟิวแฟน คัดสรรเฉพาะตัวจริงตรงปก 100% ปลอดภัยนัดเจอจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมพิกัด ${provinceNameThai}`;
    }

    const cleanMetaDesc = stripHTML(metaDescription);
    const avgRatingScore = activeReviews.length > 0 ? (activeReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / activeReviews.length).toFixed(1) : "5.0";
    
    const mapZoom = isNational ? 6 : 12;
    
    // กำหนดคำค้นหาพิกัดให้ Google Map แม่นยำ 100%
    const mapQuery = isNational 
      ? encodeURIComponent("ประเทศไทย") 
      : encodeURIComponent(`จังหวัด${provinceNameThai}`);

    const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;
    
    

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
    
    const reviewsHtml = activeReviews.map(r => {
      const avatarLetter = r.initial || (r.author ? r.author.replace(/^คุณ/, "").trim().charAt(0) : "V");
      const cleanText = stripHTML(r.text).replace(/^["']|["']$/g, "");

      return `
        <div class="review-card-item">
            <div class="review-card-header">
              <div class="review-user-info">
                <div class="review-avatar-circle">${escapeHTML(avatarLetter)}</div>
                <div>
                  <div class="review-username">${escapeHTML(r.author)}</div>
                  <div class="review-user-loc">นัดเจอใน${escapeHTML(r.location)}</div>
                </div>
              </div>
              <div class="review-stars-list">
                ${Array.from({ length: 5 }).map((_, i) => `<i class="fas fa-star" style="color: ${i < r.rating ? "#FBBF24" : "#71717A"};"></i>`).join("")}
              </div>
            </div>
            <p class="review-comment-body">"${escapeHTML(cleanText)}"</p>
            <span class="review-verified-badge"><i class="fas fa-check-circle"></i> ยืนยันการใช้บริการจริง • ${escapeHTML(r.date)}</span>
        </div>
      `;
    }).join("");

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

    // =========================================================================
    // 🏗️ ประกอบและแทนที่เนื้อหา HTML แบบสมบูรณ์แบบ (FULL HYDRATION & SEO)
    // =========================================================================
    let finalHtml = await getTemplateHtml(url, context);
    if (!finalHtml) {
      return await context.next();
    }

    // 1. แทรก Meta Title & Description
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHTML(metaTitle)}</title>`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHTML(cleanMetaDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHTML(metaTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHTML(cleanMetaDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHTML(metaTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHTML(cleanMetaDesc)}" />`);
    
    // 🟢 2. แทนที่ Canonical URL และ Open Graph (แก้ปัญหา Canonical ซ้ำซ้อน 100%)
    finalHtml = finalHtml.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" id="canonical-link" href="${canonicalUrl}">`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:url["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}">`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:image["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta property="og:image" content="${heroImage}">`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:image:secure_url["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta property="og:image:secure_url" content="${heroImage}">`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:image["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta name="twitter:image" content="${heroImage}">`);

    // 🟢 3. ปรับแต่ง H1 & H2 ฝั่ง SSR ให้เป็นชื่อจังหวัดจริงทันที (สำคัญสูงสุดต่อ Google SEO)
    const ssrH1Html = `
      <span class="seo-sub-headline">รับงาน${escapeHTML(provinceNameThai)} • ไซด์ไลน์${escapeHTML(provinceNameThai)}</span><br>
      <span class="seo-main-headline">สาวรับงาน ฟิวแฟนตรงปก 100%</span>
    `;
    finalHtml = finalHtml.replace(/<h1 id="hero-h1"[^>]*>[\s\S]*?<\/h1>/i, `<h1 id="hero-h1" class="seo-h1-title">${ssrH1Html}</h1>`);
    
    const ssrFeaturedH2 = `แนะนำน้องๆ รับงาน <span class="kw-purple">ไซด์ไลน์${escapeHTML(provinceNameThai)}</span>`;
    finalHtml = finalHtml.replace(/<h2 id="featured-heading"[^>]*>[\s\S]*?<\/h2>/i, `<h2 id="featured-heading" class="clean-section-h2">${ssrFeaturedH2}</h2>`);
// 🟢 แทนที่ตัวเลขสถิติ Hero ให้ตรงกับจำนวนโปรไฟล์จริงในฐานข้อมูล 100%
    const countDisplay = isNational ? `${totalCount}+` : `${totalCount}`;
    finalHtml = finalHtml.replace(
      /<strong id="live-profile-count"[^>]*>[\s\S]*?<\/strong>/i,
      `<strong id="live-profile-count" class="kw-green">${countDisplay}</strong>`
    );
    // 4. ปรับแต่ง Hreflang Tags สำหรับระบบหลายภาษา
    if (isNational) {
      finalHtml = finalHtml.replace(
        /<link\s+rel=["']alternate["']\s+hreflang=["']en["'][^>]*>/i,
        `<link rel="alternate" hreflang="en" href="${primaryDomain}/index-en" />`
      );
    } else {
      finalHtml = finalHtml.replace(/<link\s+rel=["']alternate["']\s+hreflang=["']en["'][^>]*>\s*/gi, "");
    }

    // 5. แทรก Schema.org JSON-LD (Rich Snippets & Google Graph)
    const schemaJsonStr = JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }).replace(/</g, "\\u003c");
    const schemaTag = `<script type="application/ld+json" id="dynamic-schema">\n${schemaJsonStr}\n<\/script>`;
    finalHtml = finalHtml.replace(/<script type="application\/ld\+json" id="dynamic-schema">[\s\S]*?<\/script>/i, schemaTag);

    // 6. แทนที่ Placeholders ทั่วไป
    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_NAME}}", provinceNameThai);
    finalHtml = replaceGlobal(finalHtml, "{{PROFILE_COUNT}}", String(totalCount));
    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_ZONES}}", zonesStr || "ทุกพื้นที่");
   finalHtml = replaceGlobal(finalHtml, "{{MAP_EMBED_URL}}", mapEmbedUrl);

    // 7. แทนที่เนื้อหา SEO Intro
    finalHtml = finalHtml.replace(
      /<div\s+class=["']seo-content-inner["'][^>]*>[\s\S]*?<\/div>/i,
      `<div class="seo-content-inner" style="font-size: 12.5px; color: var(--text-gray, #94a3b8); line-height: 1.7;">${linkedIntro}</div>`
    );

    // 8. แทรก FAQs และ Reviews ประจำพื้นที่
    if (faqsHtml) {
      finalHtml = finalHtml.replace(/<div id="faq-container-list"[^>]*>[\s\S]*?<\/div>/i, `<div id="faq-container-list" class="faq-list-wrapper">${faqsHtml}</div>`);
    }
    if (reviewsHtml) {
      finalHtml = finalHtml.replace(/<div id="reviews-container-grid"[^>]*>[\s\S]*?<\/div>/i, `<div id="reviews-container-grid" class="reviews-grid-wrapper">${reviewsHtml}</div>`);
    }

    // 9. สไลด์ HOT Swiper
    const hotSwiperCardsHtml = profilesList.slice(0, 8).map((p, i) => {
      const cleanName = escapeHTML((p.name || "น้อง").trim().replace(/^(น้อง\s?)+/gi, ""));
      const loc = escapeHTML(sanitizeThaiText(p.location) || provinceNameThai);
      const slug = encodeURIComponent(p.slug || p.id);
      const img = optimizeImg(p.imagePath || p.image_url || "", 400, 500);
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

    // 10. จัดการส่วน Featured Profiles VIP (แสดงเฉพาะหน้าแรกทั่วไทย)
    if (isNational) {
      if (finalHtml.includes("{{PROFILES_CARDS_HTML}}")) {
        finalHtml = replaceGlobal(finalHtml, "{{PROFILES_CARDS_HTML}}", featuredCardsHtml || "");
      } else {
        finalHtml = finalHtml.replace(
          /<div id="featured-profiles-container"[^>]*>[\s\S]*?<\/div>/i,
          `<div id="featured-profiles-container" class="profile-grid profiles-grid-row" aria-labelledby="featured-heading">${featuredCardsHtml || ""}</div>`
        );
      }
    } else {
      finalHtml = finalHtml.replace(/<section id="featured-profiles"[\s\S]*?<\/section>/i, "");
    }

    // 11. แสดงผล Grid รายชื่อน้องๆ ใน Display Area
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

    if (finalHtml.includes("{{PROFILES_DISPLAY_AREA_HTML}}")) {
      finalHtml = replaceGlobal(finalHtml, "{{PROFILES_DISPLAY_AREA_HTML}}", displayAreaHtml);
    } else {
      finalHtml = finalHtml.replace(
        /<div id="profiles-display-area"[^>]*>[\s\S]*?<\/div>/i,
        `<div id="profiles-display-area" role="region" aria-label="โปรไฟล์ผู้ดูแลและเพื่อนเที่ยว${provinceNameThai}">${displayAreaHtml}</div>`
      );
    }

    // 12. Dropdown ค้นหาจังหวัด
    const provinceSelectOptions = '<option value="">🗺️ เลือกจังหวัด (ทั้งหมด)</option>' + (allProvincesRes?.data || []).map(p => {
      const isSelected = p.key === provinceSlug ? "selected" : "";
      return `<option value="${p.key}" ${isSelected}>${p.nameThai}</option>`;
    }).join("");
    
    finalHtml = finalHtml.replace(/<select id="search-province"[^>]*>[\s\S]*?<\/select>/i, `<select id="search-province" name="province" class="search-select-field" aria-label="เลือกจังหวัดที่ต้องการค้นหา">${provinceSelectOptions}</select>`);

    // 13. รายชื่อลิงก์จังหวัดยอดนิยมใน Footer
    if (popularLocationsFooter) {
      finalHtml = finalHtml.replace(/<ul id="popular-locations-footer"[^>]*>[\s\S]*?<\/ul>/i, `<ul id="popular-locations-footer" style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 12px; color: var(--text-gray);">${popularLocationsFooter}</ul>`);
    }

    // 14. แก้ไข Relative Path ให้โหลดไฟล์ Static ผ่าน Root เสมอ
    finalHtml = finalHtml.replace(/(href|src|data-src)=["'](?!https?:\/\/|\/\/|\/|data:|blob:|#|javascript:|mailto:|tel:|\{\{)([^"']+)["']/gi, '$1="/$2"');

    // 15. Serialization ข้อมูลสำหรับ Client-side Hydration
    const provinceMap = new Map();
    (allProvincesRes?.data || []).forEach(p => {
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

    const serializedProvinces = (allProvincesRes?.data || []).map(p => ({
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

    // 16. Safety Net: ล้าง Placeholder {{...}} ตกค้างทั้งหมด
    finalHtml = finalHtml.replace(/\{\{[A-Z0-9_]+\}\}/g, "");

    // 17. Response Headers (เซฟ Supabase Free Tier และอัปเดตข้อมูลไว)
    const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate, s-maxage=60, stale-while-revalidate=30",
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
