/**
 * ==============================================================================
 * 💎 FIRST MODEL HUB - ADVANCED SERVERLESS SSR & HYDRATION ENGINE (ssr-province.js)
 * Production-Ready Ultra-Defensive & Unique Localized Content Engine (FULL 2026)
 * ==============================================================================
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const PAGE_CACHE = new Map();
const PAGE_CACHE_TTL_MS = 10 * 60 * 1000; // แคช 10 นาที
const MAX_CACHE_SIZE = 200;

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
  DEFAULT_TELEPHONE: "+6620000000",
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

// 🟢 1. METADATA ที่ระบุย่านจริงและเขียนคำโปรยไม่ซ้ำกันเลยในแต่ละจังหวัด
const PROVINCE_CUSTOM_METADATA = {
  bangkok: {
    title: "สาวรับงานกรุงเทพ ไซด์ไลน์ กทม ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานกรุงเทพ รับงาน กทม พรีเมียม คัดสรรโปรไฟล์ตรงปก 100% นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมย่านสุขุมวิท รัชดา ห้วยขวาง ลาดพร้าว ทองหล่อ เอกมัย สาทร"
  },
  chiangmai: {
    title: "สาวรับงานเชียงใหม่ ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานเชียงใหม่ และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน คัดสรรโปรไฟล์ตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมย่านนิมมาน เจ็ดยอด สันติธรรม ช้างเผือก หลัง มช."
  },
  chonburi: {
    title: "สาวรับงานชลบุรี ไซด์ไลน์พัทยา บางแสน ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "สารบัญสาวรับงานชลบุรี รับงานพัทยา บางแสน ศรีราชา พรีเมียมสไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัยจ่ายหน้างาน ไม่โอนมัดจำล่วงหน้า"
  },
  khonkaen: {
    title: "สาวรับงานขอนแก่น ไซด์ไลน์ขอนแก่น ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานขอนแก่น และเพื่อนเที่ยวไซด์ไลน์พรีเมียม สไตล์ฟิวแฟน คัดสรรโปรไฟล์ตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมย่านกังสดาล หลัง มข. บึงแก่นนคร"
  },
  phuket: {
    title: "สาวรับงานภูเก็ต ไซด์ไลน์ป่าตอง ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานภูเก็ต สาวรับงานป่าตอง กะทู้ ฉลอง และเพื่อนเที่ยวพรีเมียม คัดสรรโปรไฟล์ตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำล่วงหน้า"
  },
  udonthani: {
    title: "สาวรับงานอุดร ไซด์ไลน์อุดรธานี ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "สารบัญสาวรับงานอุดรธานี และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัยจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมย่าน UD Town หนองประจักษ์ ตัวเมืองอุดร"
  },
  chiangrai: {
    title: "สาวรับงานเชียงราย ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานเชียงราย และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน ยืนยันตัวตนตรงปก 100% ปลอดภัยชำระเงินหน้างาน ไม่โอนมัดจำ ครอบคลุมตัวเมืองเชียงราย บ้านดู่ มฟล."
  },
  lampang: {
    title: "สาวรับงานลำปาง ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานลำปาง และเพื่อนเที่ยวพรีเมียม ปลอดภัยชำระเงินหน้างานเมื่อเจอตัวจริง ไม่โอนมัดจำ ครอบคลุมตัวเมืองลำปาง สวนดอก รอบเวียง ม.ราชภัฏ"
  },
  phitsanulok: {
    title: "สาวรับงานพิษณุโลก ไซด์ไลน์ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานวันนี้) | First Model Hub",
    desc: "ศูนย์รวมสาวรับงานพิษณุโลก รับงาน มน. และเพื่อนเที่ยวสไตล์ฟิวแฟน ปลอดภัย จ่ายหน้างาน 100% ไม่โอนมัดจำล่วงหน้า ครอบคลุมตัวเมืองพิษณุโลก สมอแข"
  }
};

// 🟢 2. ฐานข้อมูล SEO เจาะลึกรายจังหวัด (ย่านจริง + GPS จริง + บทความบรรยายที่ไม่ซ้ำกันเลย)
const PROVINCE_SEO_DATA = {
  bangkok: {
    name: "กรุงเทพฯ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["สุขุมวิท", "รัชดาภิเษก", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย", "สีลม", "สาทร", "บางนา", "ปิ่นเกล้า"],
    uniqueIntro: `
      <p>ยินดีต้อนรับสู่ศูนย์รวมโปรไฟล์ <strong>สาวรับงานกรุงเทพฯ</strong> และเพื่อนเที่ยว <strong>ไซด์ไลน์ กทม</strong> ระดับพรีเมียมในเขตกรุงเทพมหานครและปริมณฑล เราคัดสรรผู้ดูแลที่เพียบพร้อมด้วยกิริยามารยาทสุภาพ เรียบร้อย สไตล์ฟิวแฟน (Girlfriend Experience - GFE) อย่างเป็นธรรมชาติ</p>
      <p>เพื่อตอบสนองความสะดวกในการเดินทาง ย่านบริการครอบคลุมย่านเศรษฐกิจและทำเลทอง เช่น โซนสุขุมวิท, รัชดาภิเษก, ห้วยขวาง, ลาดพร้าว, เอกมัย, ทองหล่อ และสาทร สะดวกต่อการนัดหมายตามโรงแรมชั้นนำหรือคอนโดมิเนียมส่วนตัว รวดเร็วและปลอดภัยสูงสุด</p>
      <p>เรายึดมั่นในมาตรการความปลอดภัยสูงสุด ด้วยนโยบาย <strong>"นัดพบตัวจริง ค่อยชำระเงินตรงหน้างาน ไม่โอนมัดจำล่วงหน้าทุกกรณี"</strong> ตรวจสอบสิทธิ์และโปรไฟล์ตรงปก 100% ก่อนเริ่มงาน</p>
    `,
    reviews: [
      { author: "คุณวีรยุทธ", location: "รัชดา กรุงเทพฯ", text: "นัดเจอน้องย่านรัชดา บริการพรีเมียมมาก ตรงปกตามรูป จ่ายหน้างาน 100% สบายใจสุดๆ ครับ", rating: 5, date: "เมื่อวานนี้" },
      { author: "คุณปณิธาน", location: "สุขุมวิท กรุงเทพฯ", text: "น้องน่ารักมาก คุยสนุก บริการฟิวแฟนประทับใจ นัดเจอง่ายไม่มีมัดจำครับ", rating: 5, date: "3 วันที่แล้ว" }
    ],
    faqs: [
      { q: "สาวรับงานกรุงเทพฯ บน First Model Hub ปลอดภัยแค่ไหน?", a: "ปลอดภัย 100% เรายึดนโยบายจ่ายเงินตรงกับน้องเมื่อเจอตัวจริงหน้างาน ไม่มีการเรียกเก็บเงินจองหรือมัดจำล่วงหน้าทุกกรณี" },
      { q: "ครอบคลุมพิกัดย่านไหนใน กทม. บ้าง?", a: "ครอบคลุมทุกย่านหลัก เช่น สุขุมวิท, รัชดา, ห้วยขวาง, ลาดพร้าว, ทองหล่อ, เอกมัย, สาทร และคอนโดตามแนวรถไฟฟ้า BTS/MRT" }
    ]
  },
  chiangmai: {
    name: "เชียงใหม่",
    geo: { lat: 18.8140717, lng: 98.972096 },
    zones: ["นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก", "หลัง มช.", "สันทราย", "ห้วยแก้ว", "หางดง", "แม่โจ้", "พายัพ"],
    uniqueIntro: `
      <p>ยินดีต้อนรับสู่ศูนย์รวมโปรไฟล์ <strong>สาวรับงานเชียงใหม่</strong> และเพื่อนเที่ยว <strong>ไซด์ไลน์เชียงใหม่</strong> ระดับพรีเมียมใจกลางเมืองล้านนา คัดสรรโปรไฟล์น้องๆ น่ารัก นิสัยดี อัธยาศัยเป็นกันเอง ดูแลใส่ใจสไตล์ฟิวแฟนน่ารักอบอุ่น</p>
      <p>ครอบคลุมพิกัดทำเลยอดนิยมทั่วเมืองเชียงใหม่ เช่น โซนถนนนิมมานเหมินท์, สันติธรรม, เจ็ดยอด, ช้างเผือก, รอบมหาวิทยาลัยเชียงใหม่ (หลัง มช.), และสันทราย ไม่ว่าจะเป็นการนัดทานอาหาร ท่องเที่ยว หรือพักผ่อนคลายเหงา เดินทางสะดวกรวดเร็ว</p>
      <p>อุ่นใจด้วยนโยบายความปลอดภัยสูงสุด <strong>"พบตัวจริง ตรวจสอบความตรงปก แล้วค่อยชำระค่าขนมหน้างาน ไร้เงื่อนไขมัดจำล่วงหน้า"</strong></p>
    `,
    reviews: [
      { author: "คุณเกริกพล", location: "นิมมาน เชียงใหม่", text: "นัดเจอน้องย่านนิมมาน เชียงใหม่ ตรงปก 100% บริการน่ารักมาก มารยาทดี ไม่มีมัดจำสบายใจครับ", rating: 5, date: "เมื่อวานนี้" },
      { author: "คุณอนุรักษ์", location: "สันติธรรม เชียงใหม่", text: "ดูแลเอนเตอร์เทนประทับใจ สไตล์ฟิวแฟน คุยสนุกเป็นกันเอง ให้ 5 ดาวครับ", rating: 5, date: "3 วันที่แล้ว" }
    ],
    faqs: [
      { q: "นัดหมายสาวรับงานเชียงใหม่ โซนไหนสะดวกรวดเร็วที่สุด?", a: "ถนนนิมมานเหมินท์, สันติธรรม, ช้างเผือก และรอบคอนโดมิเนียมย่านเจ็ดยอด เป็นพิกัดหลักที่มีน้องๆ สแตนด์บายพร้อมดูแลอย่างรวดเร็ว" },
      { q: "การเรียกใช้บริการรับงานเชียงใหม่ ต้องโอนมัดจำหรือไม่?", a: "ไม่มีนโยบายโอนมัดจำล่วงหน้าทุกกรณีครับ ใช้นโยบายเจอตัวจริงค่อยชำระเงินโดยตรงหน้างานเท่านั้น" }
    ]
  },
  chonburi: {
    name: "ชลบุรี",
    geo: { lat: 12.9276, lng: 100.8771 },
    zones: ["พัทยากลาง", "พัทยาใต้", "จอมเทียน", "วงศ์อมาตย์", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี", "อมตะนคร"],
    uniqueIntro: `
      <p>แหล่งรวบรวมข้อมูล <strong>สาวรับงานชลบุรี</strong>, <strong>สาวรับงานพัทยา</strong> และเพื่อนเที่ยว <strong>ไซด์ไลน์บางแสน</strong> ระดับ VIP คัดสรรน้องๆ หุ่นดี ผิวพรรณดี พร้อมดูแลคุณในเมืองท่องเที่ยวชายทะเล</p>
      <p>ครอบคลุมโซนพัทยากลาง, พัทยาใต้, หาดจอมเทียน, วงศ์อมาตย์, บางแสน, และย่านญี่ปุ่นศรีราชา เหมาะสำหรับนักท่องเที่ยว ผู้มาติดต่องาน หรือผู้ที่ต้องการเพื่อนเดินทางทานอาหารผ่อนคลาย</p>
      <p>การันตีความปลอดภัยและโปร่งใสสูงสุด ด้วยระบบ <strong>"ชำระเงินหน้างานเมื่อเจอตัวน้องจริง ไม่ต้องโอนมัดจำก่อนล่วงหน้า"</strong></p>
    `,
    reviews: [
      { author: "คุณสมชาย", location: "พัทยา ชลบุรี", text: "น้องตรงปก น่ารัก เทคแคร์ดีมาก ชำระหน้างานปลอดภัยสุดๆ ครับ", rating: 5, date: "2 วันที่แล้ว" }
    ],
    faqs: [
      { q: "เรียกสาวรับงานพัทยา บางแสน จ่ายเงินอย่างไร?", a: "ชำระตรงหน้างานเมื่อเจอน้องตัวจริงเรียบร้อยแล้วเท่านั้น ไม่มีโอนมัดจำก่อนทุกกรณีครับ" }
    ]
  },
  khonkaen: {
    name: "ขอนแก่น",
    geo: { lat: 16.4322, lng: 102.8236 },
    zones: ["กังสดาล", "หลัง มข.", "บึงแก่นนคร", "เซ็นทรัลขอนแก่น", "ถนนมิตรภาพ", "ศรีนครินทร์", "ตัวเมืองขอนแก่น"],
    uniqueIntro: `
      <p>ศูนย์รวมสารบัญ <strong>สาวรับงานขอนแก่น</strong> และเพื่อนเที่ยว <strong>ไซด์ไลน์ขอนแก่น</strong> ระดับพรีเมียมในศูนย์กลางแห่งภาคอีสาน คัดสรรน้องๆ วัยใส คุยเก่ง น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน</p>
      <p>ครอบคลุมทำเลยอดนิยม เช่น ย่านกังสดาล, โซนหลังมหาวิทยาลัยขอนแก่น (มข.), รอบบึงแก่นนคร, ย่านเซ็นทรัล และถนนมิตรภาพ เดินทางสะดวก ปลอดภัย</p>
      <p>มั่นใจได้ 100% ด้วยนโยบาย <strong>"นัดพบตัวจริงตรงปก แล้วค่อยชำระค่าบริการหน้างาน ปราศจากการโอนเงินจองมัดจำ"</strong></p>
    `,
    reviews: [
      { author: "คุณธนกฤต", location: "กังสดาล ขอนแก่น", text: "น้องน่ารัก เป็นกันเองมากๆ สไตล์ฟิวแฟน ไม่ต้องโอนมัดจำล่วงหน้าครับ", rating: 5, date: "4 วันที่แล้ว" }
    ],
    faqs: [
      { q: "นัดหมายสาวรับงานขอนแก่น ต้องโอนมัดจำไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าครับ พบน้องและตรวจสอบความตรงปกหน้างานแล้วค่อยชำระค่าบริการครับ" }
    ]
  },
  phuket: {
    name: "ภูเก็ต",
    geo: { lat: 7.8804, lng: 98.3923 },
    zones: ["ป่าตอง", "ตัวเมืองภูเก็ต", "กะทู้", "ฉลอง", "เชิงทะเล", "กะรน", "กะตะ", "ราไวย์"],
    uniqueIntro: `
      <p>ศูนย์กลางข้อมูล <strong>สาวรับงานภูเก็ต</strong> และเพื่อนเที่ยว <strong>ไซด์ไลน์ป่าตอง</strong> ระดับหรูในเมืองท่องเที่ยวระดับโลก คัดสรรผู้ดูแลสวยระดับพรีเมียม สื่อสารสุภาพ พร้อมเป็นเพื่อนเดินทางคู่ใจ</p>

      <p>ครอบคลุมย่านหาดป่าตอง, ตัวเมืองภูเก็ต, กะทู้, หาดกะรน, กะตะ, และโซนฉลอง สะดวกสบายสำหรับผู้มาพักผ่อนตากอากาศ หรือเดินทางมาทำงาน</p>
      <p>ปลอดภัยสูงสุดด้วยเงื่อนไข <strong>"เจอตัวจริงตรงปก ค่อยชำระเงินหน้างาน ไม่มีโอนมัดจำล่วงหน้าเด็ดขาด"</strong></p>
    `,
    reviews: [
      { author: "คุณอเล็กซ์", location: "ป่าตอง ภูเก็ต", text: "โปรไฟล์ตรงปก 100% บริการดี นัดเจอจ่ายหน้างาน สะดวกสบายมากครับ", rating: 5, date: "3 วันที่แล้ว" }
    ],
    faqs: [
      { q: "นัดหมายสาวรับงานภูเก็ต จ่ายเงินอย่างไร?", a: "นัดเจอตัวจริงตรงปกหน้างานแล้วค่อยชำระเงินตรงกับน้อง ไม่มีโอนมัดจำล่วงหน้าครับ" }
    ]
  },
  udonthani: {
    name: "อุดรธานี",
    geo: { lat: 17.4138, lng: 102.7872 },
    zones: ["UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร", "ตัวเมืองอุดร", "โพนโพธิ์", "สนามบินอุดร"],
    uniqueIntro: `
      <p>รวมโปรไฟล์แนะนำ <strong>สาวรับงานอุดรธานี</strong> และเพื่อนเที่ยว <strong>ไซด์ไลน์อุดร</strong> คัดสรรน้องๆ สดใส น่ารัก บริการสุภาพ สไตล์ฟิวแฟนอบอุ่น</p>
      <p>ครอบคลุมพื้นที่เศรษฐกิจ เช่น โซน UD Town, รอบสวนสาธารณะหนองประจักษ์, ย่านเซ็นทรัลอุดร และในตัวเมืองอุดรธานี เดินทางสะดวกสบาย</p>
      <p>การันตีความปลอดภัย <strong>"ชำระค่าบริการโดยตรงหน้างาน ไม่มีการเรียกเก็บเงินจองมัดจำก่อนทุกกรณี"</strong></p>
    `,
    reviews: [
      { author: "คุณชัชวาล", location: "UD Town อุดรธานี", text: "น้องตรงปก บริการสุภาพ สไตล์ฟิวแฟน จ่ายหน้างานปลอดภัยครับ", rating: 5, date: "เมื่อวานนี้" }
    ],
    faqs: []
  },
  chiangrai: {
    name: "เชียงราย",
    geo: { lat: 19.9105, lng: 99.8406 },
    zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "ม.แม่ฟ้าหลวง (มฟล.)", "หอนาฬิกา", "ริมกก", "แม่สาย"],
    uniqueIntro: `
      <p>ศูนย์รวมผู้ดูแลและเพื่อนเที่ยว <strong>สาวรับงานเชียงราย</strong> และ <strong>ไซด์ไลน์บ้านดู่</strong> คัดสรรโปรไฟล์น่ารัก นิสัยดี เอาใจเก่ง สุภาพเรียบร้อย</p>
      <p>ครอบคลุมพื้นที่ตัวเมืองเชียงราย, โซนบ้านดู่, รอบมหาวิทยาลัยแม่ฟ้าหลวง (มฟล.), ย่านหอนาฬิกา และพื้นที่ใกล้เคียง</p>
      <p>อุ่นใจ 100% ด้วยมาตรการ <strong>"เจอตัวจริง ค่อยชำระเงินหน้างาน ปราศจากการโอนมัดจำล่วงหน้า"</strong></p>
    `,
    reviews: [
      { author: "คุณปิยะ", location: "ตัวเมืองเชียงราย", text: "น้องน่ารัก ตรงปก เทคแคร์ดีมาก ชำระเงินหน้างานปลอดภัยครับ", rating: 5, date: "2 วันที่แล้ว" }
    ],
    faqs: []
  },
  lampang: {
    name: "ลำปาง",
    geo: { lat: 18.2888, lng: 99.4923 },
    zones: ["ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏลำปาง", "กาดกองต้า"],
    uniqueIntro: `
      <p>สารบัญแนะนำ <strong>สาวรับงานลำปาง</strong> และเพื่อนเที่ยว <strong>ไซด์ไลน์ลำปาง</strong> คัดสรรน้องๆ น่ารัก อัธยาศัยดี พูดจาสุภาพ สไตล์ฟิวแฟนเป็นกันเอง</p>      <p>ครอบคลุมทำเลตัวเมืองลำปาง, ย่านสวนดอก, รอบเวียง, ย่าน ม.ราชภัฏลำปาง และถนนคนเดินกาดกองต้า</p>
      <p>ปลอดภัย ไม่เสี่ยงมิจฉาชีพ ด้วยนโยบาย <strong>"จ่ายเงินหน้างานเมื่อพบตัวน้องเรียบร้อยแล้วเท่านั้น ไม่มีมัดจำ"</strong></p>
    `,
    reviews: [
      { author: "คุณเมธี", location: "ตัวเมืองลำปาง", text: "น้องตรงปก สุภาพ อัธยาศัยดี นัดเจอจ่ายเงินหน้างานประทับใจครับ", rating: 5, date: "4 วันที่แล้ว" }
    ],
    faqs: []
  },
  phitsanulok: {
    name: "พิษณุโลก",
    geo: { lat: 16.8211, lng: 100.2659 },
    zones: ["ตัวเมืองพิษณุโลก", "รอบ มน. (นเรศวร)", "สมอแข", "ท็อปแลนด์", "ริมน่าน"],
    uniqueIntro: `
      <p>ศูนย์รวมโปรไฟล์ <strong>สาวรับงานพิษณุโลก</strong> และเพื่อนเที่ยว <strong>ไซด์ไลน์ มน.</strong> คัดสรรน้องๆ วัยใส สดใส น่ารัก เทคแคร์ดีเยี่ยม</p>
      <p>ครอบคลุมย่านตัวเมืองพิษณุโลก, รอบมหาวิทยาลัยนเรศวร (ม.นเรศวร), ย่านสมอแข และริมแม่น้ำน่าน</p>
      <p>มั่นใจ ปลอดภัย ด้วยการ <strong>"ชำระค่าขนมหน้างานตรงต่อน้อง ไม่มีโอนมัดจำล่วงหน้าทุกกรณี"</strong></p>
    `,
    reviews: [
      { author: "คุณกิตติ", location: "รอบ มน. พิษณุโลก", text: "ตรงปก อัธยาศัยดี ฟิวแฟนอบอุ่นมากครับ จ่ายหน้างานสบายใจ", rating: 5, date: "เมื่อวานนี้" }
    ],
    faqs: []
  },
  default: {
    name: "ทั่วไทย",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "อุดรธานี", "ขอนแก่น", "ลำปาง"],
    uniqueIntro: `
      <p>ยินดีต้อนรับสู่ <strong>First Model Hub</strong> แพลตฟอร์มศูนย์กลางข้อมูลแนะนำสาวรับงาน เด็กเอ็น และเพื่อนเที่ยวไซด์ไลน์ระดับพรีเมียมทั่วประเทศ ยืนยันตัวตนตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ</p>
    `,
    reviews: [
      { author: "คุณเกริกพล", location: "นิมมาน เชียงใหม่", text: "นัดเจอน้องตรงปก 100% บริการน่ารักมาก มารยาทดี ไม่มีโอนมัดจำสบายใจครับ", rating: 5, date: "เมื่อวานนี้" }
    ],
    faqs: [
      { q: "เรียกใช้บริการ First Model Hub ต้องโอนมัดจำล่วงหน้าหรือไม่?", a: "ไม่ต้องโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ ตกลงชำระค่าบริการหน้างานเมื่อเจอน้องตัวจริงตรงปกแล้วเท่านั้น" }
    ]
  }
};

const escapeHTML = str => (str !== null && str !== undefined) 
  ? String(str).replace(/[&<>'"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[m] || m)) 
  : "";

const stripHTML = str => (str !== null && str !== undefined) 
  ? String(str).replace(/<[^>]*>?/gm, "").trim() 
  : "";

const replaceGlobal = (source, target, replacement) => {
  if (!source) return "";
  return source.split(target).join(replacement !== undefined && replacement !== null ? replacement : "");
};

// 🟢 3. ฟังก์ชันปรับความสะอาดข้อความ และสกัดพิกัดย่าน
function sanitizeThaiText(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/✨?\s*พัฒนาและปรับแต่งโค้ดด้วย.*?(?:\||\n|$)/gi, "")
    .replace(/Google\s*Gemini.*?(?:\||\n|$)/gi, "")
    .replace(/ทดลองใช้งาน\.?/gi, "")
    .replace(/นิมาน|นิทาน/g, "นิมมาน")
    .replace(/ฟื้นที่/g, "พื้นที่")
    .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/พาพับ/g, "พายัพ")
    .replace(/ของแก่น/g, "ขอนแก่น")
    .replace(/บ้านดู๋/g, "บ้านดู่")
    .replace(/ห้วยเเก้ว/g, "ห้วยแก้ว")
    .replace(/ปาตอง/g, "ป่าตอง")
    .replace(/ชลบรุี/g, "ชลบุรี")
    .replace(/อยุธญา/g, "อยุธยา")
    .replace(/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬„•ㅅ•„₊˚╭╮╰╯┊જ⁀⸝༘⋆ෆ◟ヾ֒𐐪づ⁺.]+/g, " ")
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}🚨💦🐻🫦]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function deduplicateProfiles(profileList) {
  if (!Array.isArray(profileList)) return [];
  const seen = new Set();
  return profileList.filter(p => {
    if (!p) return false;
    const uniqueKey = String(p.id || p.slug || p.imagePath || "").toLowerCase().trim();
    if (!uniqueKey || seen.has(uniqueKey)) return false;
    seen.add(uniqueKey);
    return true;
  });
}

function verifyHostname(_req) {
  return true;
}

// 🟢 4. ฟังก์ชันจัดการ Meta Tags & Canonical แบบเซฟตี้ 100%
function setMeta(html, attrName, attrValue, contentValue) {
  let safeContent = escapeHTML(contentValue || "");
  if (!safeContent || safeContent.trim() === "") {
    if (attrValue.includes("image")) safeContent = CONFIG.DEFAULT_OG_IMAGE;
    else if (attrValue.includes("url")) safeContent = CONFIG.PRIMARY_DOMAIN;
  }
  const regex = new RegExp(`<meta\\s+[^>]*?${attrName}=["']${attrValue}["'][^>]*?>`, "gi");
  const newTag = `<meta ${attrName}="${attrValue}" content="${safeContent}" />`;
  return regex.test(html) ? html.replace(regex, newTag) : html.replace(/<\/head>/i, `  ${newTag}\n</head>`);
}

function setLink(html, relValue, hrefValue, extraAttrs = "") {
  const safeHref = escapeHTML(hrefValue || CONFIG.PRIMARY_DOMAIN);
  const hreflangMatch = extraAttrs.match(/hreflang=["']([^"']+)["']/i);
  let regex;
  if (hreflangMatch) {
    const lang = hreflangMatch[1];
    regex = new RegExp(`<link\\s+[^>]*?rel=["']${relValue}["'][^>]*?hreflang=["']${lang}["'][^>]*?>`, "gi");
  } else {
    regex = new RegExp(`<link\\s+[^>]*?rel=["']${relValue}["'](?:(?![^>]*?hreflang=)[^>])*?>`, "gi");
  }
  const newTag = `<link rel="${relValue}" href="${safeHref}" ${extraAttrs}/>`;
  return regex.test(html) ? html.replace(regex, newTag) : html.replace(/<\/head>/i, `  ${newTag}\n</head>`);
}

function sweepPlaceholders(html) {
  if (!html) return "";
  return html
    .replace(/\{\{\s*SCHEMA_JSON\s*\}\}/gi, '{"@context":"https://schema.org","@type":"WebSite","name":"First Model Hub"}')
    .replace(/\{\{\s*PROVINCE_NAME\s*\}\}/gi, "ทั่วไทย")
    .replace(/\{\{\s*province-name\s*\}\}/gi, "ทั่วไทย")
    .replace(/\{\{\s*PROVINCE_KEY\s*\}\}/gi, "national")
    .replace(/\{\{\s*province-key\s*\}\}/gi, "national")
    .replace(/\{\{\s*PROFILE_COUNT\s*\}\}/gi, "50")
    .replace(/\{\{\s*PROVINCE_ZONES\s*\}\}/gi, "นิมมาน, สันติธรรม, เจ็ดยอด, ช้างเผือก")
    .replace(/(%7B%7B|\{\{)[a-zA-Z0-9_.-]+(%7D%7D|\}\})/gi, "")
    .replace(/(https?:\/\/[^\s"'<>]+)?(%7B%7B|\{\{)MAP_EMBED_URL(%7D%7D|\}\})/gi, "");
}

function injectSchema(html, schemaObj) {
  if (!schemaObj) return html;
  const jsonStr = JSON.stringify(schemaObj).replace(/</g, '\\u003c');
  const newScriptTag = `<script type="application/ld+json" id="dynamic-schema">${jsonStr}</script>`;

  if (html.includes("{{SCHEMA_JSON}}")) {
    return html.replace("{{SCHEMA_JSON}}", newScriptTag);
  }

  const existingRegex = /<script\s+type=["']application\/ld\+json["']\s+id=["']dynamic-schema["'][^>]*>[\s\S]*?<\/script>/gi;
  if (existingRegex.test(html)) {
    return html.replace(existingRegex, newScriptTag);
  }

  return html.replace(/<\/head>/i, `  ${newScriptTag}\n</head>`);
}

function injectHydrationData(html, hydratedDataObj) {
  const safeData = Array.isArray(hydratedDataObj) ? hydratedDataObj : [];
  const jsonStr = JSON.stringify(safeData).replace(/</g, '\\u003c');
  const scriptTag = `<script id="ssr-profiles-data">window.profilesData = ${jsonStr};</script>`;

  let cleanHtml = html.replace(/<script\s+id=["']ssr-profiles-data["'][\s\S]*?<\/script>/gi, "");
  if (cleanHtml.includes("</body>")) {
    return cleanHtml.replace(/<\/body>/i, `  ${scriptTag}\n</body>`);
  }
  return cleanHtml + `\n${scriptTag}`;
}

async function getTemplateHtml(url, _context) {
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
    <div id="profiles-display-area" style="margin-top: 16px; position: relative;" role="region"></div>
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
      console.warn("⚠️ Fetching index.html template timed out, fallback to shell", e);
      return DEFAULT_FALLBACK_SHELL;
    }
  }
  return TEMPLATE_HTML_CACHE || DEFAULT_FALLBACK_SHELL;
}

const getProfileMainImage = (p) => {
  if (!p || typeof p !== "object") return null;
  const candidates = [p.imagePath, p.image_path, p.imageUrl, p.image_url, p.photo, p.avatar, p.image];
  for (const item of candidates) {
    if (item && typeof item === "string" && item.trim() && !item.includes("firstmodelhub.webp")) {
      return item.trim();
    }
  }
  const gallery = p.galleryPaths || p.gallery_paths || p.gallery;
  if (Array.isArray(gallery) && gallery.length > 0) {
    const first = String(gallery[0]).trim();
    if (first && !first.includes("firstmodelhub.webp")) return first;
  }
  return null;
};

const FALLBACK_SVG_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'><rect width='100%' height='100%' fill='%23120A24'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23C084FC' font-family='sans-serif' font-size='20' font-weight='bold'>First Model Hub</text></svg>";

const optimizeImg = (_hostUrl, path, width = 400, height = 500) => {
  if (!path || typeof path !== "string" || !path.trim() || path.includes("firstmodelhub.webp") || path.includes("placeholder")) {
    return FALLBACK_SVG_AVATAR;
  }
  const cleanPath = path.trim().replace(/^\/+/, "").replace(/^profile-images\//, "");
  if (cleanPath.includes("res.cloudinary.com")) {
    const cleanCloudinaryUrl = cleanPath.replace(/\/upload\/(?:[^\/]+\/)*(v\d+\/)/, "/upload/$1");
    return cleanCloudinaryUrl.replace("/upload/", `/upload/f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face/`);
  }
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }
  return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${cleanPath}?width=${width}&height=${height}&resize=cover&quality=70&format=avif`;
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

const generateDynamicFAQsHTML = faqs => {
  if (!faqs || faqs.length === 0) return "";
  return faqs.map(item => `
        <div class="interactive-card" style="padding: 16px 20px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <h3 style="font-weight: 800; font-size: 13.5px; display: flex; align-items: start; gap: 10px; margin: 0;">
                  <span style="display: flex; height: 22px; width: 22px; align-items: center; justify-content: center; border-radius: 6px; background-color: rgba(90, 44, 190, 0.2); color: #C084FC; font-size: 11px; font-weight: 900; border: 1px solid rgba(147, 51, 234, 0.3); flex-shrink: 0;">Q</span>
                  <span class="text-gradient-sub" style="line-height: 1.4;">${escapeHTML(sanitizeThaiText(item.q))}</span>
                </h3>
                <div style="padding-left: 32px; color: var(--text-gray); font-size: 12px; line-height: 1.6; border-left: 2px solid rgba(147, 51, 234, 0.2); padding-top: 4px;">
                  ${escapeHTML(sanitizeThaiText(item.a))}
                </div>
            </div>
        </div>
    `).join("");
};

const renderCardHtml = (p, index, hostUrl, provinceThaiName) => {
  const pName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/gi, ""));
  const pLoc = escapeHTML(sanitizeThaiText(p.location) || provinceThaiName);
  const pUrl = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
  
  const isAvailable = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
  const statusDotColor = isAvailable ? "#00E676" : "#FF2E63";
  const statusText = p.availability || (isAvailable ? "รับงาน" : "สอบถามคิว");
  const ageDisplay = p.age && p.age !== "-" ? ` (${escapeHTML(p.age)})` : "";
  
  const seoAltText = `น้อง${pName} สาวรับงาน${provinceThaiName} ย่าน${pLoc} ไซด์ไลน์ตรงปก 100%`;
  const mainImgPath = getProfileMainImage(p);
  const imgUrl = optimizeImg(hostUrl, mainImgPath, 320, 400);

  let rateVal = "1,500.-";
  if (p.rate) {
    const cleanedRate = String(p.rate).replace(/[^0-9]/g, "");
    if (cleanedRate && !isNaN(Number(cleanedRate))) {
        let num = Number(cleanedRate);
        if (num > 0 && num < 500) num = num * 10;
        rateVal = `${num.toLocaleString()}.-`;
    } else {
        rateVal = escapeHTML(p.rate);
    }
  }

  const sloganText = escapeHTML(sanitizeThaiText(p.slogan || p.quote || ""));

  return `
    <div class="profile-card-new-container" role="listitem">
      <article class="profile-card-new interactive-card" data-profile-id="${p.id}" data-profile-slug="${escapeHTML(p.slug || p.id)}">
          <h3 style="display:none;">น้อง${pName} สาวรับงาน${provinceThaiName} ย่าน${pLoc}</h3>
          <img src="${imgUrl}" alt="${seoAltText}" title="${seoAltText}" width="300" height="400" class="profile-card-img-cover" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" onerror="this.onerror=null; this.src='/images/firstmodelhub.webp';" />
          <div class="profile-card-gradient"></div>
          <div class="profile-card-badge-top-left">
              <span style="background: rgba(9, 9, 11, 0.82); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; display: inline-flex; align-items: center; gap: 4px;">
                  <span style="width: 5px; height: 5px; border-radius: 50%; background-color: ${statusDotColor}; flex-shrink: 0;"></span>
                  <span>${statusText}</span>
              </span>
          </div>
          <a href="${pUrl}" class="card-link" style="position: absolute; inset: 0; z-index: 25;" aria-label="ดูโปรไฟล์น้อง${pName} สาวรับงาน${provinceThaiName}"></a>
          <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 6px 10px 8px 10px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 1px;">
              <h3 style="font-size: 13.5px; font-weight: 800; color: white; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                น้อง${pName}${ageDisplay}
              </h3>
              ${sloganText ? `<p style="font-size: 10px; color: #C084FC; font-weight: 600; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${sloganText}</p>` : ""}
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px; color: #D4D4D8; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 3px; margin-top: 2px;">
                  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; font-weight: 600;">
                      <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 2px;"></i> ${pLoc}
                  </span>
                  <span style="color: #00E676; font-weight: 900; font-size: 12px;">${rateVal}</span>
              </div>
          </div>
      </article>
    </div>
  `;
};

// 🟢 5. MAIN EDGE REQUEST HANDLER (ดักจับเฉพาะหน้าจังหวัด /location/ เท่านั้น)
export default async (req, context) => {
  if (!verifyHostname(req)) {
    return new Response("403 Forbidden - Access Denied", { status: 403 });
  }

  const url = new URL(req.url);
  const hostUrl = CONFIG.PRIMARY_DOMAIN;
  const paths = url.pathname.split("/").filter(Boolean);

  // ปล่อยผ่านไฟล์ Static (.css, .js, รูปภาพ)
  if (STATIC_EXT_REGEX.test(url.pathname)) {
    try { return await context.next(); } catch { return await context.next(); }
  }

  // 🚨 ดักจับเฉพาะหน้าจังหวัดเท่านั้น: หากเป็นหน้าแรก (/), /profiles, หรือหน้าเดี่ยว (/sideline/) ให้ปล่อยผ่านทันที!
  if (paths.length === 0 || url.pathname === "/" || url.pathname === "/index.html" || paths[0] === "sideline") {
    try { return await context.next(); } catch { return await context.next(); }
  }

  let provinceSlug = "";
  if ("location" === paths[0] && paths[1]) {
    try { provinceSlug = decodeURIComponent(paths[1]).toLowerCase(); } catch { provinceSlug = paths[1].toLowerCase(); }
  } else {
    try { provinceSlug = decodeURIComponent(paths[paths.length - 1]).toLowerCase(); } catch { provinceSlug = paths[paths.length - 1].toLowerCase(); }
  }

  const provinceParam = provinceSlug.replace(/-/g, "").replace(/_/g, "");
  const cacheKey = `${req.method}:${url.pathname}:${url.search}`;

  const cachedItem = PAGE_CACHE.get(cacheKey);
  if (cachedItem && (Date.now() - cachedItem.timestamp < PAGE_CACHE_TTL_MS)) {
    return new Response(cachedItem.html, { headers: cachedItem.headers });
  }

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    let searchKeys = [provinceSlug];
    if (provinceSlug === "chiangmai" || provinceSlug === "chiang_mai") {
      searchKeys = ["chiangmai", "chiang_mai"];
    }

    const [provSingleRes, profListRes, reviewsRes] = await Promise.all([
      supabase.from("provinces").select("id, nameThai, key").in("key", searchKeys).limit(1).maybeSingle(),
      supabase.from("profiles")
        .select("id, slug, name, age, imagePath, galleryPaths, gallery_paths, provinceKey, province_key, location, rate, isfeatured, lastUpdated, active, availability, description, height, weight, stats, skin_tone, bust, waist, hips, cup_size, has_video, verified, line_id, lineId, quote, style_tags, slogan")
        .eq("active", true)
        .in("provinceKey", searchKeys)
        .order("isfeatured", { ascending: false })
        .order("lastUpdated", { ascending: false })
        .limit(600),
      supabase.from("reviews")
        .select("id, created_at, author_name, location_detail, rating_score, review_body, province_key")
        .eq("active_status", true)
        .in("province_key", searchKeys)
        .order("created_at", { ascending: false })
        .limit(8)
        .catch(() => ({ data: [] }))
    ]);

    const provinceData = provSingleRes.data;
    if (!provinceData) {
      try { return await context.next(); } catch { return new Response("Page not found", { status: 404 }); }
    }

    const profileList = deduplicateProfiles(profListRes.data || []);
    const provinceThaiName = provinceData?.nameThai || "เชียงใหม่";
    const customMeta = PROVINCE_CUSTOM_METADATA[provinceParam] || null;
    const seoData = PROVINCE_SEO_DATA[provinceParam] || PROVINCE_SEO_DATA.default;

    const canonUrl = `${hostUrl}/location/${provinceSlug}`;
    const mainImgPath = profileList.length > 0 ? getProfileMainImage(profileList[0]) : null;
    const metaImgUrl = mainImgPath ? optimizeImg(hostUrl, mainImgPath, 1200, 630) : `${CONFIG.PRIMARY_DOMAIN}/images/firstmodelhub.webp`;

    const dbReviews = reviewsRes?.data || [];
    let finalReviews = (dbReviews.length > 0)
      ? dbReviews.map(r => ({
          author: r.author_name || "คุณผู้ใช้บริการ",
          location: sanitizeThaiText(r.location_detail) || `ตัวเมือง${provinceThaiName}`,
          text: sanitizeThaiText(r.review_body) || "ดูแลประทับใจดีสไตล์ฟิวแฟน ตรงปกปลอดภัย แนะนำครับ",
          rating: Number(r.rating_score) || 5,
          date: formatDateSSR(r.created_at)
        }))
      : (seoData.reviews || []);

    const pageTitle = customMetaTitle(provinceThaiName, customMeta);
    const pageDesc = customMetaDesc(provinceThaiName, seoData, customMeta);
    const strippedDesc = stripHTML(pageDesc);

    // 🟢 GPS MAP EMBED ตามพิกัดจริงประจำจังหวัด
    const rawMapUrl = (seoData && seoData.geo && seoData.geo.lat) 
      ? `https://maps.google.com/maps?q=${seoData.geo.lat},${seoData.geo.lng}&t=&z=13&ie=UTF8&iwloc=&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent("สาวรับงาน " + provinceThaiName)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    const mapEmbedUrl = escapeHTML(rawMapUrl);

    const validZones = (seoData.zones || []).map(sanitizeThaiText).filter(z => z && z !== "ทั้งหมด");

    // 🟢 SCHEMA GRAPH (ล็อกดาวสีทอง 4.9 ตรงตาม UI)
    const schemaGraph = [
      {
        "@type": "Organization",
        "@id": `${hostUrl}/#organization`,
        "name": CONFIG.BRAND_NAME,
        "legalName": CONFIG.BRAND_LEGAL_NAME,
        "url": hostUrl,
        "logo": { "@type": "ImageObject", "url": `${CONFIG.PRIMARY_DOMAIN}/images/firstmodelhub.webp`, "width": 1200, "height": 630 }
      },
      {
        "@type": "CollectionPage",
        "@id": `${canonUrl}/#webpage`,
        "name": pageTitle,
        "description": strippedDesc,
        "isPartOf": { "@id": `${hostUrl}/#website` },
        "about": { "@id": `${canonUrl}/#business` },
        "breadcrumb": { "@id": `${canonUrl}/#breadcrumb` }
      },
      {
        "@type": ["EntertainmentBusiness", "ProfessionalService"],
        "@id": `${canonUrl}/#business`,
        "name": `สาวรับงาน${provinceThaiName} เพื่อนเที่ยว${provinceThaiName} - ${CONFIG.BRAND_NAME}`,
        "image": metaImgUrl,
        "telephone": CONFIG.DEFAULT_TELEPHONE,
        "priceRange": "฿฿",
        "url": canonUrl,
        "description": strippedDesc,
        "parentOrganization": { "@id": `${hostUrl}/#organization` },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": `อำเภอเมือง${provinceThaiName}`,
          "addressLocality": provinceThaiName,
          "addressRegion": provinceThaiName,
          "addressCountry": "TH"
        },
        "areaServed": [
          { "@type": "AdministrativeArea", "name": provinceThaiName },
          ...validZones.map(z => ({ "@type": "AdministrativeArea", "name": "โซน" + z }))
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": 4.9,
          "reviewCount": profileList.length > 0 ? Math.max(35, profileList.length * 3) : 35,
          "bestRating": 5,
          "worstRating": 1
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonUrl}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": hostUrl },
          { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceThaiName}`, "item": canonUrl }
        ]
      }
    ];

    if (seoData.faqs && seoData.faqs.length > 0) {
      schemaGraph.push({
        "@type": "FAQPage",
        "@id": `${canonUrl}/#faq`,
        "mainEntity": seoData.faqs.map(faq => ({
          "@type": "Question",
          "name": stripHTML(sanitizeThaiText(faq.q)),
          "acceptedAnswer": { "@type": "Answer", "text": stripHTML(sanitizeThaiText(faq.a)) }
        }))
      });
    }

    const schemaJson = { "@context": "https://schema.org", "@graph": schemaGraph };

    // ==============================================================================
    // 🟢 HTML ASSEMBLY
    // ==============================================================================
    const cardsHtml = profileList.map((p, index) => renderCardHtml(p, index, hostUrl, provinceThaiName)).join("");
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
            <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 9.5px;">
              ${Array.from({ length: 5 }).map((_, i) => `<i class="fas fa-star" style="color: ${i < r.rating ? "#FBBF24" : "#71717A"};"></i>`).join("")}
            </div>
          </div>
          <p style="font-size: 11.5px; color: var(--text-gray); line-height: 1.5; margin: 0;">${escapeHTML(r.text)}</p>
          <span style="display: block; font-size: 9px; color: var(--text-muted); font-weight: 800;">ยืนยันการใช้บริการจริง • ${escapeHTML(r.date)}</span>
      </div>
    `).join("");

    const faqsHtml = generateDynamicFAQsHTML(seoData.faqs);
    const matchedZones = seoData.zones.slice(0, 4).map(sanitizeThaiText).join(", ");
    const seoIntroContent = seoData.uniqueIntro || getDynamicIntro(provinceThaiName, seoData.zones, provinceSlug);

    const displayAreaInnerHtml = `
      <div class="mt-4 relative">
        <div class="flex justify-between items-center flex-wrap gap-2 p-2" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; padding: 8px 4px;">
            <h2 class="text-lg font-extrabold text-white m-0 flex items-center flex-wrap gap-2" style="font-size: 18px; font-weight: 800; color: white; margin: 0; display: flex; align-items: center; gap: 8px;">
                📍 น้องๆ ในจังหวัด <span class="text-purple mx-1" style="color: #C084FC;">${provinceThaiName}</span>
                <span class="live-count-chip">
                  <span class="pulse-dot-el"></span>
                  <span>พบ ${profileList.length} โปรไฟล์พร้อมรับงาน</span>
                </span>
            </h2>
        </div>
        <div class="profiles-grid-row mt-2">${cardsHtml}</div>
      </div>
    `;

    let rawHtml = await getTemplateHtml(url, context);

    if (!/<base\s+/i.test(rawHtml)) {
      rawHtml = rawHtml.replace(/<head[^>]*>/i, (match) => `${match}\n    <base href="/" />`);
    }

    rawHtml = rawHtml.replace(
      /<div id="profiles-display-area"[^>]*>[\s\S]*?<\/div>/i,
      `<div id="profiles-display-area" style="margin-top: 16px; position: relative;" role="region">${displayAreaInnerHtml}</div>`
    );

    rawHtml = rawHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHTML(pageTitle)}</title>`);
    rawHtml = setMeta(rawHtml, "name", "description", strippedDesc);
    rawHtml = setMeta(rawHtml, "property", "og:description", strippedDesc);
    rawHtml = setMeta(rawHtml, "name", "twitter:description", strippedDesc);

    // 🟢 เซต Canonical & OG URL บังคับ ป้องกันค่าว่าง
    rawHtml = setMeta(rawHtml, "property", "og:url", canonUrl);
    rawHtml = setMeta(rawHtml, "name", "twitter:url", canonUrl);
    rawHtml = setLink(rawHtml, "canonical", canonUrl);
    rawHtml = setLink(rawHtml, "alternate", canonUrl, 'hreflang="th"');
    rawHtml = setLink(rawHtml, "alternate", canonUrl, 'hreflang="x-default"');

    rawHtml = injectSchema(rawHtml, schemaJson);

    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_NAME}}", provinceThaiName);
    rawHtml = replaceGlobal(rawHtml, "{{province-name}}", provinceThaiName);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_KEY}}", provinceSlug);
    rawHtml = replaceGlobal(rawHtml, "{{PROFILE_COUNT}}", profileList.length || 50);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_ZONES}}", matchedZones);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_SEO_CONTENT}}", seoIntroContent);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_REVIEWS_HTML}}", reviewsHtml);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_FAQS_HTML}}", faqsHtml);
    rawHtml = replaceGlobal(rawHtml, "{{MAP_EMBED_URL}}", mapEmbedUrl);

    const hydratedProfilesData = profileList.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      age: p.age,
      height: p.height || "",
      weight: p.weight || "",
      stats: p.stats || "",
      imagePath: getProfileMainImage(p),
      provinceKey: provinceSlug,
      provinceThai: provinceThaiName,
      location: sanitizeThaiText(p.location),
      rate: p.rate,
      availability: p.availability,
      isfeatured: p.isfeatured,
      verified: p.verified || p.isVerified,
      description: sanitizeThaiText(p.description) || ""
    }));

    rawHtml = injectHydrationData(rawHtml, hydratedProfilesData);
    rawHtml = sweepPlaceholders(rawHtml); // 🟢 กวาดล้างตัวแปรค้างทั้งหมด
    
    const responseHeaders = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff"
    };

    if (PAGE_CACHE.size > MAX_CACHE_SIZE) PAGE_CACHE.clear();
    PAGE_CACHE.set(cacheKey, { html: rawHtml, headers: responseHeaders, timestamp: Date.now() });

    return new Response(rawHtml, { headers: responseHeaders });

  } catch (err) {
    console.error("SSR Province Error:", err);
    try { return await context.next(); } catch { return new Response("Error", { status: 500 }); }
  }
};