import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const PAGE_CACHE = new Map();
const MAX_CACHE_SIZE = 300;
let GLOBAL_LAST_TIMESTAMP = `init_${Date.now()}`;
let LAST_PROBE_TIME = 0;
const AUTO_CHECK_INTERVAL_MS = 30000;
const PURGE_SECRET_KEY = "fmh_secure_purge_2026";
let TEMPLATE_HTML_CACHE = null;
let TEMPLATE_CACHE_TIMESTAMP = 0;
const TEMPLATE_CACHE_TTL_MS = 3600000;
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

// 🌟 คลังข้อมูลเจาะลึกเฉพาะจังหวัดแบบ Unique Content & Maximum SEO Benefit 100%
const PROVINCE_SEO_DATA = {
  // --------------------------------------------------------------------------
  // 1. หน้าแรก ทั่วไทย (National Homepage)
  // --------------------------------------------------------------------------
  default: {
    name: "ทั่วไทย",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "พัทยา", "ภูเก็ต", "ขอนแก่น", "อุดรธานี", "เชียงราย"],
    h1Sub: "ศูนย์รวมเด็กเอ็น • เพื่อนเที่ยวฟิวแฟนทั่วประเทศ",
    h1Main: "สาวรับงาน ไซด์ไลน์ทั่วไทย ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงาน ไซด์ไลน์ทั่วไทย • ตรงปก 100% จ่ายหน้างาน ไม่มัดจำ | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงาน ไซด์ไลน์ทั่วไทย เด็กเอ็นฟิวแฟนพรีเมียม ครอบคลุม 77 จังหวัดทั่วประเทศ ตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำล่วงหน้า",
    introArticle: `<p>ยินดีต้อนรับสู่ <strong>${CONFIG.BRAND_NAME}</strong> แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ <strong class="kw-purple">สาวรับงาน</strong>ทั่วไทย, เด็กเอ็นทั่วไทย และเพื่อนเที่ยวไซด์ไลน์ระดับพรีเมียม แหล่งรวบรวมโปรไฟล์ผู้ดูแลที่เน้นความโปร่งใส ปลอดภัย เพียบพร้อมด้วยการดูแลเอาใจใส่สไตล์ <strong class="kw-purple">ฟิวแฟน (Girlfriend Experience - GFE)</strong> อย่างสุภาพเรียบร้อยเป็นธรรมชาติ ปราศจากเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี</p>
    <p>ครอบคลุมพิกัดให้บริการสำคัญทั่วประเทศ อาทิ โซน <a href="/location/bangkok" class="kw-zone">กรุงเทพฯ</a>, โซน <a href="/location/chiangmai" class="kw-zone">เชียงใหม่</a>, โซน <a href="/location/chonburi" class="kw-zone">ชลบุรี</a>, โซน <a href="/location/chonburi" class="kw-zone">พัทยา</a>, โซน <a href="/location/phuket" class="kw-zone">ภูเก็ต</a>, โซน <a href="/location/khon-kaen" class="kw-zone">ขอนแก่น</a>, โซน <a href="/location/udonthani" class="kw-zone">อุดรธานี</a> และ <a href="/location/chiangrai" class="kw-zone">เชียงราย</a> ไม่ว่าจะเป็นโรงแรมชั้นนำ คอนโดมิเนียมส่วนตัว หรือพิกัดยอดนิยม เดินทางสะดวกและปลอดภัยสูง พร้อมร่วมทริปท่องเที่ยว ทานอาหาร หรือพูดคุยคลายเหงาในโอกาสพิเศษ</p>
    <p>รูปภาพและข้อมูลรายละเอียดของน้องๆ ผ่านการตรวจสอบยืนยันตัวตนจริง 100% (Verified System) มั่นใจได้ในความตรงปก นัดพบปลอดภัย จ่ายหน้างาน ไร้ความเสี่ยงทางการเงินทุกกรณีครับ</p>`,
    faqs: [
      { q: "เรียกใช้บริการน้องๆ บน First Model Hub ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่ต้องโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ ลูกค้าตกลงชำระค่าบริการหน้างานเมื่อเจอน้องตัวจริงตรงปกแล้วเท่านั้นครับ" },
      { q: "หากเจอน้องตัวจริงแล้วไม่ตรงปก สามารถยกเลิกได้หรือไม่?", a: "สามารถปฏิเสธและยกเลิกได้ทันทีโดยไม่มีค่าธรรมเนียมใดๆ ครับ ทางระบบการันตีรูปถ่ายตัวจริงตรงปก 100%" },
      { q: "ขั้นตอนการติดต่อและจองคิวน้องๆ มีความปลอดภัยและเป็นส่วนตัวแค่ไหน?", a: "ปลอดภัยสูงสุดด้วยมาตรการรักษาความลับ (Zero-Log Policy) สามารถทักไลน์แจ้งเวลาและสถานที่นัดพบส่วนตัวได้โดยตรงตลอด 24 ชั่วโมงครับ" }
    ],
    reviews: [
      { author: "คุณชลสิทธิ์", initial: "C", location: "ตัวเมืองทั่วไทย", text: "จองง่าย ตรงเวลา สุภาพเรียบร้อย ที่สำคัญระบบไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับ", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" },
      { author: "คุณอภิชาติ", initial: "A", location: "โซนยอดนิยมทั่วประเทศ", text: "น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยม ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจมากครับ", rating: 5, date: "เมื่อ 2 สัปดาห์ก่อน" }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. เชียงใหม่ (Chiang Mai)
  // --------------------------------------------------------------------------
  chiangmai: {
    name: "เชียงใหม่",
    geo: { lat: 18.7883, lng: 98.9853 },
    zones: ["นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก", "หลัง มช.", "สันทราย", "ห้วยแก้ว", "รวมโชค"],
    h1Sub: "เพื่อนเที่ยวฟิวแฟน • สแตนด์บาย นิมมาน เจ็ดยอด สันติธรรม",
    h1Main: "สาวรับงานเชียงใหม่ ไซด์ไลน์เชียงใหม่ ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงานเชียงใหม่ ไซด์ไลน์เชียงใหม่ • ฟิวแฟนตรงปก จ่ายหน้างาน | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานเชียงใหม่ ไซด์ไลน์เชียงใหม่ เด็กเอ็นพรีเมียม สแตนด์บายย่านนิมมาน เจ็ดยอด สันติธรรม ตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ",
    introArticle: `<p>ยินดีต้อนรับสู่ศูนย์กลางข้อมูล <strong>สาวรับงานเชียงใหม่</strong> และเพื่อนเที่ยวสไตล์ <strong class="kw-purple">ฟิวแฟน (Girlfriend Experience)</strong> ระดับพรีเมียมอันดับ 1 ของภาคเหนือ ครอบคลุมพิกัดยอดนิยมทั้งย่านคาเฟ่ <a href="/location/chiangmai" class="kw-zone">นิมมาน</a>, แหล่งคอนโดมิเนียม <a href="/location/chiangmai" class="kw-zone">เจ็ดยอด</a>, ย่านที่พัก <a href="/location/chiangmai" class="kw-zone">สันติธรรม</a> และ <a href="/location/chiangmai" class="kw-zone">หลัง มช.</a> น้องๆ ผ่านการตรวจสอบรูปถ่ายและตัวตนจริง 100% สแตนด์บายพร้อมเดินทางถึงโรงแรมและที่พักส่วนตัวอย่างรวดเร็ว ปลอดภัยด้วยระบบนัดเจอตัวจริงเรียบร้อยแล้วค่อยชำระค่าบริการ ไร้ความเสี่ยงจากการโอนมัดจำล่วงหน้าทุกกรณีครับ</p>`,
    faqs: [
      { q: "นัดหมายสาวรับงานเชียงใหม่ ย่านนิมมานและเจ็ดยอด สะดวกแค่ไหน?", a: "สะดวกมากครับ น้องๆ สแตนด์บายในโซนนิมมาน สันติธรรม และเจ็ดยอด พร้อมเดินทางถึงโรงแรมหรือที่พักส่วนตัวภายใน 30-45 นาทีครับ" },
      { q: "สามารถนัดน้องไปร่วมทริปทานอาหาร คาเฟ่ หรือเที่ยวในเชียงใหม่ได้ไหม?", a: "ได้ครับ น้องๆ ดูแลสุภาพ เรียบร้อย สไตล์ฟิวแฟน ให้เกียรติลูกค้า สามารถพูดคุยแจ้งสถานที่นัดหมายผ่านไลน์ได้เลยครับ" },
      { q: "การเรียกใช้บริการไซด์ไลน์เชียงใหม่ ต้องโอนมัดจำก่อนหรือไม่?", a: "ไม่มีนโยบายโอนมัดจำล่วงหน้าทุกกรณีครับ เจอน้องตัวจริง ตรวจสอบความตรงปกหน้างานเรียบร้อยแล้วค่อยชำระเงินโดยตรงครับ" }
    ],
    reviews: [
      { author: "คุณชลสิทธิ์", initial: "C", location: "ย่านนิมมาน ซอย 9 เชียงใหม่", text: "นัดเจอน้องแถวนิมมาน เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพ ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" },
      { author: "คุณอภิชาติ", initial: "A", location: "คอนโดมิเนียมย่านเจ็ดยอด", text: "น้องน่ารักมาก การเทคแคร์ดีเยี่ยมเสมือนมีแฟนมาเที่ยวด้วย พิกัดเจ็ดยอดเดินทางมาไวมาก แนะนำเลยครับ", rating: 5, date: "เมื่อ 2 สัปดาห์ก่อน" }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. กรุงเทพมหานคร (Bangkok)
  // --------------------------------------------------------------------------
  bangkok: {
    name: "กรุงเทพฯ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย", "สาทร", "บางนา"],
    h1Sub: "เพื่อนเที่ยวระดับพรีเมียม • สแตนด์บาย สุขุมวิท รัชดา ทองหล่อ",
    h1Main: "สาวรับงานกรุงเทพ ไซด์ไลน์ กทม ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงานกรุงเทพ ไซด์ไลน์ กทม • สุขุมวิท รัชดา จ่ายหน้างาน ไม่มัดจำ | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานกรุงเทพ ไซด์ไลน์ กทม เพื่อนเที่ยวดินเนอร์และเอาท์คอลโรงแรมหรู สุขุมวิท รัชดา ห้วยขวาง ทองหล่อ สาทร ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มัดจำ",
    introArticle: `<p>ศูนย์กลางข้อมูล <strong>สาวรับงานกรุงเทพ</strong> และ <strong class="kw-purple">ไซด์ไลน์ กทม</strong> ระดับไฮเอนด์ ครอบคลุมพิกัดสำคัญตามแนวรถไฟฟ้า BTS/MRT เช่น โซน <a href="/location/bangkok" class="kw-zone">สุขุมวิท</a>, <a href="/location/bangkok" class="kw-zone">รัชดา</a>, <a href="/location/bangkok" class="kw-zone">ห้วยขวาง</a>, <a href="/location/bangkok" class="kw-zone">ทองหล่อ</a> และ <a href="/location/bangkok" class="kw-zone">สาทร</a> คัดสรรโปรไฟล์ตัวจริงตรงปก 100% พร้อมดูแลสไตล์ฟิวแฟนอย่างอบอุ่นและสุภาพ ปลอดภัยสูงสุดด้วยระบบชำระเงินหน้างาน ปราศจากการโอนมัดจำล่วงหน้า</p>`,
    faqs: [
      { q: "การนัดหมายสาวรับงานในกรุงเทพฯ ครอบคลุมพื้นที่ใดบ้าง?", a: "ครอบคลุมโรงแรมชั้นนำและคอนโดมิเนียมส่วนตัวทั่วกรุงเทพฯ โดยเฉพาะย่านสุขุมวิท รัชดา ห้วยขวาง ทองหล่อ และสาทรครับ" },
      { q: "มีค่าบริการหรือค่าใช้จ่ายแอบแฝงก่อนเจอตัวหรือไม่?", a: "ไม่มีค่าใช้จ่ายแอบแฝงและไม่มีการเก็บมัดจำล่วงหน้าทุกกรณีครับ จ่ายตรงกับน้องหน้างานเท่านั้นครับ" },
      { q: "น้องๆ เดินทางถึงสถานที่นัดหมายในกรุงเทพฯ ใช้เวลานานไหม?", a: "โดยเฉลี่ยประมาณ 30-45 นาที ขึ้นอยู่กับช่วงเวลาและสภาพการจราจรในแต่ละพื้นที่ครับ" }
    ],
    reviews: [
      { author: "คุณวีรภัทร", initial: "W", location: "โรงแรมย่านสุขุมวิท", text: "นัดง่าย สะดวกมากครับ น้องตรงปก บุคลิกดี มารยาทสุภาพ ไม่มีขอโอนมัดจำก่อนเลย มั่นใจในความปลอดภัยครับ", rating: 5, date: "เมื่อวานนี้" },
      { author: "คุณธนัตถ์", initial: "T", location: "คอนโดย่านรัชดา-ห้วยขวาง", text: "ตรงเวลา คุยเก่ง น่ารักสไตล์ฟิวแฟนตัวจริง ไม่เร่งงานเลย ประทับใจมากครับ", rating: 5, date: "เมื่อ 4 วันก่อน" }
    ]
  },

  // --------------------------------------------------------------------------
  // 4. ภูเก็ต (Phuket)
  // --------------------------------------------------------------------------
  phuket: {
    name: "ภูเก็ต",
    geo: { lat: 7.8804, lng: 98.3923 },
    zones: ["ป่าตอง", "กะทู้", "ฉลอง", "กะรน", "กะตะ", "บางเทา", "ราไวย์", "เชิงทะเล"],
    h1Sub: "VIP Travel Companion • สแตนด์บาย ป่าตอง บางเทา กะทู้",
    h1Main: "สาวรับงานภูเก็ต ไซด์ไลน์ภูเก็ต พูลวิลล่าตรงปก จ่ายหน้างาน",
    metaTitle: "สาวรับงานภูเก็ต ไซด์ไลน์ภูเก็ต • ป่าตอง พูลวิลล่า จ่ายหน้างาน 100% | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานภูเก็ต ไซด์ไลน์ภูเก็ต เพื่อนเที่ยวพูลวิลล่าและรีสอร์ตหรู ป่าตอง กะทู้ บางเทา การันตีรูปจริงตรงปก 100% สื่อสารภาษาอังกฤษได้ จ่ายหน้างาน ไม่มัดจำ",
    introArticle: `<p>สัมผัสประสบการณ์การพักผ่อนระดับ Luxury บนเกาะภูเก็ตกับ <strong>สาวรับงานภูเก็ต</strong> และ <strong class="kw-purple">VIP Travel Companions</strong> แหล่งรวมโปรไฟล์น้องๆ ระดับพรีเมียมที่พร้อมดูแลทั้งการท่องเที่ยว พักผ่อนในโรงแรม 5 ดาวริมหาด <a href="/location/phuket" class="kw-zone">ป่าตอง</a> หรือพูลวิลล่าส่วนตัวย่าน <a href="/location/phuket" class="kw-zone">บางเทา</a> และ <a href="/location/phuket" class="kw-zone">ราไวย์</a> น้องๆ อัธยาศัยดี มีมารยาท สื่อสารภาษาอังกฤษได้คล่องแคล่ว ปลอดภัยสูงสุดด้วยนโยบาย <strong class="kw-green">เจอตัวจริงค่อยชำระเงินหน้างาน</strong> ไม่มีความเสี่ยงทางการเงินทุกกรณีครับ</p>`,
    faqs: [
      { q: "เรียกหาน้องๆ ไซด์ไลน์ภูเก็ต ไปที่พูลวิลล่าหรือโรงแรมริมหาดได้ไหม?", a: "รับนัดหมายเฉพาะโรงแรม รีสอร์ตชั้นนำ และพูลวิลล่าส่วนตัวที่มีความปลอดภัย โดยคิดค่าเดินทางตามแอป Grab จริงอย่างโปร่งใสครับ" },
      { q: "น้องๆ ในโซนภูเก็ตสามารถสื่อสารภาษาอังกฤษได้หรือไม่?", a: "น้องๆ ในโซนภูเก็ตหลายท่านสามารถสื่อสารภาษาอังกฤษได้ดี พร้อมดูแลทั้งลูกค้าชาวไทยและนักท่องเที่ยวต่างชาติครับ" },
      { q: "การนัดหมายสาวรับงานภูเก็ต มีเงื่อนไขการโอนเงินก่อนหรือไม่?", a: "ไม่มีการโอนมัดจำล่วงหน้าทุกกรณีครับ เจอน้องตัวจริง ยืนยันความตรงปกแล้วจึงชำระค่าบริการกับน้องโดยตรงครับ" }
    ],
    reviews: [
      { author: "คุณธนกร", initial: "T", location: "พูลวิลล่า ย่านบางเทา ภูเก็ต", text: "นัดน้องมาทานข้าวที่วิลล่า น้องน่ารัก มารยาทดีมาก พูดภาษาอังกฤษคล่อง เทคแคร์ดีเสมือนแฟน ไม่ต้องโอนมัดจำก่อน ปลอดภัยหายห่วงครับ", rating: 5, date: "เมื่อ 3 วันที่แล้ว" },
      { author: "คุณอิทธิพล", initial: "I", location: "รีสอร์ตริมหาดป่าตอง", text: "ตรงปก 100% ครับ น้องบริการดีมาก ตรงเวลา คุยง่ายเป็นกันเอง แนะนำใครมาเที่ยวภูเก็ตต้องลองครับ", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" }
    ]
  },

  // --------------------------------------------------------------------------
  // 5. ชลบุรี / พัทยา (Chonburi & Pattaya)
  // --------------------------------------------------------------------------
  chonburi: {
    name: "ชลบุรี",
    geo: { lat: 13.3611, lng: 100.9847 },
    zones: ["พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี", "จอมเทียน", "อมตะนคร", "แหลมฉบัง"],
    h1Sub: "เพื่อนเที่ยวริมทะเล • สแตนด์บาย พัทยา บางแสน ศรีราชา",
    h1Main: "สาวรับงานพัทยา สาวรับงานชลบุรี ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงานพัทยา สาวรับงานชลบุรี • ไซด์ไลน์บางแสน จ่ายหน้างาน ไม่มัดจำ | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานพัทยา สาวรับงานชลบุรี ไซด์ไลน์บางแสน ศรีราชา เพื่อนเที่ยวฟิวแฟนริมทะเล ตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ",
    introArticle: `<p>ศูนย์รวม <strong>สาวรับงานชลบุรี</strong>, <strong class="kw-purple">สาวรับงานพัทยา</strong> และเพื่อนเที่ยวไซด์ไลน์ <a href="/location/chonburi" class="kw-zone">บางแสน</a>, <a href="/location/chonburi" class="kw-zone">ศรีราชา</a> และ <a href="/location/chonburi" class="kw-zone">จอมเทียน</a> เหมาะสำหรับผู้ที่ต้องการเพื่อนร่วมทริปพักผ่อนริมชายหาด ดินเนอร์อาหารทะเล หรือดูแลสไตล์ฟิวแฟนอย่างใกล้ชิด การันตีความตรงปก 100% จ่ายเงินหน้างาน ปลอดภัย ไร้มัดจำ</p>`,
    faqs: [
      { q: "เรียกหาน้องๆ ในโซนพัทยาหรือบางแสน มีขั้นตอนอย่างไร?", a: "เลือกโปรไฟล์ที่ถูกใจ ทักไลน์แจ้งพิกัดโรงแรมหรือที่พักส่วนตัว เมื่อน้องเดินทางไปถึงค่อยชำระค่าบริการหน้างานครับ" },
      { q: "สามารถพาน้องไปร่วมทริปเกาะล้านหรือล่องเรือยอชต์ได้ไหม?", a: "สามารถพูดคุยตกลงรายละเอียดและเวลาล่วงหน้าผ่านไลน์ได้เลยครับ น้องๆ มีความสุภาพและพร้อมดูแลตลอดทริปครับ" },
      { q: "ในโซนศรีราชาและอมตะนคร มีน้องๆ สแตนด์บายไหม?", a: "มีน้องๆ ประจำอยู่ในโซนศรีราชา บางแสน และตัวเมืองชลบุรี พร้อมเดินทางดูแลอย่างรวดเร็วครับ" }
    ],
    reviews: [
      { author: "คุณพงศกร", initial: "P", location: "พัทยากลาง", text: "มาเที่ยวพัทยาคนเดียว นัดน้องมาทานข้าวเป็นเพื่อน น้องน่ารัก คุยสนุก ตัวจริงสวยตรงปก ประทับใจมากครับ", rating: 5, date: "เมื่อ 4 วันก่อน" },
      { author: "คุณวรวิทย์", initial: "W", location: "โรงแรมริมหาดบางแสน", text: "นัดง่ายมาก ไม่ต้องโอนมัดจำ น้องมาตรงเวลา น่ารัก ฟิวแฟนสมคำร่ำลือครับ", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" }
    ]
  },

  // --------------------------------------------------------------------------
  // 6. ขอนแก่น (Khon Kaen)
  // --------------------------------------------------------------------------
  "khon-kaen": {
    name: "ขอนแก่น",
    geo: { lat: 16.4322, lng: 102.8236 },
    zones: ["ในตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
    h1Sub: "เพื่อนเที่ยวฟิวแฟนวัยใส • สแตนด์บาย กังสดาล หลัง มข.",
    h1Main: "สาวรับงานขอนแก่น ไซด์ไลน์ขอนแก่น ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงานขอนแก่น ไซด์ไลน์ขอนแก่น • กังสดาล มข. จ่ายหน้างาน ไม่มัดจำ | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานขอนแก่น ไซด์ไลน์ขอนแก่น เด็กเอ็นฟิวแฟน สแตนด์บายโซนกังสดาล หลัง มข. เซ็นทรัลขอนแก่น ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ",
    introArticle: `<p>แพลตฟอร์มศูนย์กลาง <strong>สาวรับงานขอนแก่น</strong> และ <strong class="kw-purple">ไซด์ไลน์ขอนแก่น</strong> ยอดนิยมในภาคอีสาน ครอบคลุมพิกัดสำคัญ เช่น โซน <a href="/location/khon-kaen" class="kw-zone">กังสดาล</a>, <a href="/location/khon-kaen" class="kw-zone">หลัง มข.</a>, <a href="/location/khon-kaen" class="kw-zone">เซ็นทรัลขอนแก่น</a> และรอบบึงแก่นนคร น้องๆ วัยใสน่ารัก อัธยาศัยดี ดูแลเอาใจใส่สไตล์ฟิวแฟน นัดพบสะดวกปลอดภัย จ่ายหน้างาน ไม่ต้องโอนมัดจำล่วงหน้า</p>`,
    faqs: [
      { q: "นัดหมายสาวรับงานขอนแก่น โซนกังสดาล และ หลัง มข. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำอยู่ในโซนรอบมหาวิทยาลัยขอนแก่นและใจกลางเมือง พร้อมดูแลสะดวกรวดเร็วครับ" },
      { q: "การนัดพบในจังหวัดขอนแก่น มีความปลอดภัยอย่างไร?", a: "ปลอดภัย 100% ด้วยระบบนัดเจอตัวจริงที่โรงแรมหรือที่พักส่วนตัว ตรวจสอบตรงปกแล้วค่อยจ่ายเงินกับน้องครับ" },
      { q: "สามารถนัดไปทานอาหารหรือนั่งคาเฟ่ในขอนแก่นได้ไหม?", a: "ได้ครับ น้องๆ อัธยาศัยดี สุภาพ สามารถแจ้งรายละเอียดการนัดหมายผ่านแอดมินทางไลน์ได้เลยครับ" }
    ],
    reviews: [
      { author: "คุณกิตติศักดิ์", initial: "K", location: "โซนกังสดาล ขอนแก่น", text: "น้องน่ารักมากครับ ตรงปกตามรูปเป๊ะ คุยเก่ง นิสัยดี ไม่มีขอโอนเงินก่อน มั่นใจได้เลยครับ", rating: 5, date: "เมื่อ 5 วันที่แล้ว" },
      { author: "คุณภานุเดช", initial: "P", location: "โรงแรมใกล้เซ็นทรัลขอนแก่น", text: "บริการสุภาพ เป็นกันเอง ฟิลแฟนแท้ๆ เลยครับ นัดง่ายจ่ายหน้างานสบายใจครับ", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" }
    ]
  },

  // --------------------------------------------------------------------------
  // 7. เชียงราย (Chiang Rai)
  // --------------------------------------------------------------------------
  chiangrai: {
    name: "เชียงราย",
    geo: { lat: 19.9105, lng: 99.8406 },
    zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "มฟล.", "หอนาฬิกา", "แม่สาย", "รอบเวียง"],
    h1Sub: "เพื่อนเที่ยวฟิวแฟน • สแตนด์บาย บ้านดู่ มฟล. ตัวเมือง",
    h1Main: "สาวรับงานเชียงราย ไซด์ไลน์เชียงราย ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงานเชียงราย ไซด์ไลน์เชียงราย • บ้านดู่ มฟล. จ่ายหน้างาน ไม่มัดจำ | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานเชียงราย ไซด์ไลน์เชียงราย เพื่อนเที่ยวเด็กเอ็น โซนตัวเมือง บ้านดู่ หน้า มฟล. ตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ",
    introArticle: `<p>ศูนย์รวม <strong>สาวรับงานเชียงราย</strong> และเพื่อนเที่ยวสไตล์ฟิวแฟน ครอบคลุมพิกัดสำคัญทั้งโซน <a href="/location/chiangrai" class="kw-zone">ตัวเมืองเชียงราย</a>, ย่าน <a href="/location/chiangrai" class="kw-zone">บ้านดู่</a>, หน้ามหาวิทยาลัยแม่ฟ้าหลวง (<a href="/location/chiangrai" class="kw-zone">มฟล.</a>) และ <a href="/location/chiangrai" class="kw-zone">หอนาฬิกา</a> คัดสรรโปรไฟล์ตัวจริงตรงปก ปลอดภัย นัดพบจ่ายหน้างาน ไร้มัดจำ</p>`,
    faqs: [
      { q: "นัดหมายสาวรับงานเชียงราย โซนบ้านดู่ และ มฟล. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำอยู่ในโซนบ้านดู่ หน้า มฟล. และตัวเมืองเชียงราย พร้อมดูแลสะดวกรวดเร็วครับ" },
      { q: "ไซด์ไลน์เชียงราย การันตีตรงปกและปลอดภัยอย่างไร?", a: "โปรไฟล์ผ่านการยืนยันตัวตน 100% ปลอดภัยด้วยระบบนัดเจอตัวจริงหน้างานเรียบร้อยแล้วค่อยชำระค่าบริการ ไม่มีการโอนเงินก่อนครับ" },
      { q: "พื้นที่อำเภอแม่สายหรือเชียงแสน สามารถนัดหมายได้หรือไม่?", a: "สามารถสอบถามคิวงานและค่าเดินทางตามระยะทางจริงผ่านไลน์ทางการได้เลยครับ" }
    ],
    reviews: [
      { author: "คุณชานนท์", initial: "C", location: "โซนบ้านดู่ เชียงราย", text: "นัดน้องแถวบ้านดู่ สุภาพ น่ารัก ตรงปกมากครับ จ่ายเงินหน้างานปลอดภัยดีมากครับ", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" },
      { author: "คุณศิรภพ", initial: "S", location: "ตัวเมืองเชียงราย", text: "น้องคุยสนุก อัธยาศัยดี ดูแลเอาใจใส่ดีมาก ตรงปกไม่ผิดหวังครับ", rating: 5, date: "เมื่อ 2 สัปดาห์ก่อน" }
    ]
  },

  // --------------------------------------------------------------------------
  // 8. ลำปาง (Lampang)
  // --------------------------------------------------------------------------
  lampang: {
    name: "ลำปาง",
    geo: { lat: 18.2888, lng: 99.4923 },
    zones: ["ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏลำปาง", "สบตุ๋ย", "เซ็นทรัลลำปาง"],
    h1Sub: "เพื่อนเที่ยวฟิวแฟน • สแตนด์บาย ตัวเมือง สวนดอก มรภ.ลำปาง",
    h1Main: "สาวรับงานลำปาง ไซด์ไลน์ลำปาง ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงานลำปาง ไซด์ไลน์ลำปาง • ตรงปก 100% จ่ายหน้างาน ไม่มัดจำ | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานลำปาง ไซด์ไลน์ลำปาง เพื่อนเที่ยวฟิวแฟน โซนตัวเมืองลำปาง สวนดอก ม.ราชภัฏลำปาง การันตีตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ",
    introArticle: `<p>ศูนย์รวม <strong>สาวรับงานลำปาง</strong> และ <strong class="kw-purple">ไซด์ไลน์ลำปาง</strong> ครอบคลุมพิกัด <a href="/location/lampang" class="kw-zone">ตัวเมืองลำปาง</a>, ย่าน <a href="/location/lampang" class="kw-zone">สวนดอก</a>, ถนน <a href="/location/lampang" class="kw-zone">รอบเวียง</a> และละแวก <a href="/location/lampang" class="kw-zone">ม.ราชภัฏลำปาง</a> คัดสรรโปรไฟล์ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ</p>`,
    faqs: [
      { q: "การนัดหมายไซด์ไลน์ลำปาง ต้องมีเงินมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าทุกกรณีครับ เจอน้องตัวจริง ยืนยันความตรงปกแล้วค่อยชำระค่าบริการครับ" },
      { q: "น้องๆ ในตัวเมืองลำปางพร้อมเดินทางถึงที่พักไวไหม?", a: "ในเขตตัวเมืองลำปางและโซนมหาวิทยาลัย น้องๆ พร้อมเดินทางถึงที่พักภายใน 30-40 นาทีครับ" },
      { q: "มีบริการดูแลสไตล์ฟิวแฟนแบบใดบ้างในลำปาง?", a: "เน้นการดูแลอย่างสุภาพ อบอุ่น เป็นกันเอง ทั้งการทานข้าว เดินเที่ยว และพักผ่อนส่วนตัวครับ" }
    ],
    reviews: [
      { author: "คุณเมธัส", initial: "M", location: "ตัวเมืองลำปาง", text: "น้องบริการดีมากครับ สุภาพ ตรงเวลา ตัวจริงน่ารักตรงปก แนะนำเลยครับ", rating: 5, date: "เมื่อ 6 วันก่อน" },
      { author: "คุณก้องภพ", initial: "K", location: "โซนสวนดอก ลำปาง", text: "นัดง่าย คุยไลน์สุภาพ ไม่เรื่องมาก ตัวจริงน่ารักตรงตามรูป จ่ายหน้างานมั่นใจได้ครับ", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" }
    ]
  },

  // --------------------------------------------------------------------------
  // 9. อุดรธานี (Udon Thani)
  // --------------------------------------------------------------------------
  udonthani: {
    name: "อุดรธานี",
    geo: { lat: 17.4138, lng: 102.7872 },
    zones: ["ตัวเมืองอุดร", "UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร", "บ้านจาน", "โพศรี"],
    h1Sub: "เพื่อนเที่ยวฟิวแฟน • สแตนด์บาย UD Town หนองประจักษ์",
    h1Main: "สาวรับงานอุดรธานี ไซด์ไลน์อุดร ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงานอุดรธานี ไซด์ไลน์อุดร • UD Town จ่ายหน้างาน ไม่มัดจำ | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานอุดรธานี ไซด์ไลน์อุดรธานี เพื่อนเที่ยวเด็กเอ็น โซนตัวเมือง UD Town เซ็นทรัลอุดร สวนสาธารณะหนองประจักษ์ ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ",
    introArticle: `<p>ศูนย์รวม <strong>สาวรับงานอุดรธานี</strong> และ <strong class="kw-purple">ไซด์ไลน์อุดรธานี</strong> ครอบคลุมพิกัดใจกลางเมือง เช่น ย่าน <a href="/location/udonthani" class="kw-zone">UD Town</a>, <a href="/location/udonthani" class="kw-zone">เซ็นทรัลอุดร</a> และรอบสวนสาธารณะ <a href="/location/udonthani" class="kw-zone">หนองประจักษ์</a> การันตีตรงปก 100% นัดเจอปลอดภัย จ่ายหน้างาน ไร้มัดจำ</p>`,
    faqs: [
      { q: "สาวรับงานอุดรธานี นัดพบแถวไหนสะดวกที่สุด?", a: "ย่านใจกลางเมืองอุดรธานี, UD Town, เซ็นทรัลอุดร และโรงแรมชั้นนำในตัวเมืองเป็นจุดนัดพบยอดนิยมครับ" },
      { q: "การจองคิวสาวรับงานอุดรธานี ปลอดภัยจากมิจฉาชีพอย่างไร?", a: "เรายึดมั่นนโยบายจ่ายเงินหน้างานโดยตรง ไม่มีการขอโอนมัดจำก่อนทุกกรณี ปลอดภัย 100% ครับ" },
      { q: "น้องๆ สามารถสื่อสารภาษาอังกฤษหรือดูแลลูกค้าต่างชาติได้ไหม?", a: "ได้ครับ น้องๆ หลายท่านมีทักษะการสื่อสารที่ดี พร้อมดูแลทั้งคนไทยและชาวต่างชาติครับ" }
    ],
    reviews: [
      { author: "คุณธีรเดช", initial: "T", location: "UD Town อุดรธานี", text: "เจอน้องแถว UD Town ตรงปก น่ารัก คุยสนุกมากครับ จ่ายหน้างานสบายใจ 100%", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" },
      { author: "คุณประเสริฐ", initial: "P", location: "โรงแรมใกล้หนองประจักษ์", text: "น้องตรงเวลา มารยาทเรียบร้อย ดูแลดีสไตล์ฟิวแฟน ประทับใจมากครับ", rating: 5, date: "เมื่อ 2 สัปดาห์ก่อน" }
    ]
  },

  // --------------------------------------------------------------------------
  // 10. พิษณุโลก (Phitsanulok)
  // --------------------------------------------------------------------------
  phitsanulok: {
    name: "พิษณุโลก",
    geo: { lat: 16.8211, lng: 100.2659 },
    zones: ["ตัวเมืองพิษณุโลก", "รอบ มน.", "ท่าโพธิ์", "สมอแข", "ท็อปแลนด์", "เซ็นทรัลพิษณุโลก"],
    h1Sub: "เพื่อนเที่ยวฟิวแฟน • สแตนด์บาย รอบ มน. ท่าโพธิ์ ตัวเมือง",
    h1Main: "สาวรับงานพิษณุโลก ไซด์ไลน์พิษณุโลก ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงานพิษณุโลก ไซด์ไลน์พิษณุโลก • รอบ มน. จ่ายหน้างาน ไม่มัดจำ | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานพิษณุโลก ไซด์ไลน์พิษณุโลก เพื่อนเที่ยวฟิวแฟน โซนรอบ มน. ท่าโพธิ์ เซ็นทรัลพิษณุโลก ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ",
    introArticle: `<p>ศูนย์รวม <strong>สาวรับงานพิษณุโลก</strong> และ <strong class="kw-purple">ไซด์ไลน์พิษณุโลก</strong> วัยใสน่ารัก สแตนด์บายโซน <a href="/location/phitsanulok" class="kw-zone">รอบ มน.</a>, ย่าน <a href="/location/phitsanulok" class="kw-zone">ท่าโพธิ์</a>, <a href="/location/phitsanulok" class="kw-zone">เซ็นทรัลพิษณุโลก</a> และในตัวเมือง ตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน</p>`,
    faqs: [
      { q: "นัดหมายน้องๆ โซนมหาวิทยาลัยนเรศวร (มน.) สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำอยู่ย่าน มน. และท่าโพธิ์ พร้อมเดินทางดูแลอย่างรวดเร็วครับ" },
      { q: "การชำระเงินในโซนพิษณุโลกมีเงื่อนไขอย่างไร?", a: "ชำระเงินโดยตรงกับน้องหน้างานเมื่อเจอตัวจริงและยืนยันความตรงปกแล้วเท่านั้นครับ" }
    ],
    reviews: [
      { author: "คุณเอกภพ", initial: "E", location: "โซนรอบ มน. พิษณุโลก", text: "น้องน่ารักมาก ตรงปก นิสัยดี คุยง่าย จ่ายหน้างานสบายใจครับ", rating: 5, date: "เมื่อ 4 วันก่อน" },
      { author: "คุณวีระ", initial: "W", location: "ตัวเมืองพิษณุโลก", text: "บริการสุภาพ ตรงเวลา ดูแลดีเป็นกันเอง แนะนำเลยครับ", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" }
    ]
  },

  // --------------------------------------------------------------------------
  // 11. ลำพูน (Lamphun)
  // --------------------------------------------------------------------------
  lamphun: {
    name: "ลำพูน",
    geo: { lat: 18.5772, lng: 99.0087 },
    zones: ["ตัวเมืองลำพูน", "นิคมลำพูน", "เวียงยอง", "ป่าซาง", "เหมืองง่า", "บ้านกลาง"],
    h1Sub: "เพื่อนเที่ยวฟิวแฟน • สแตนด์บาย นิคมลำพูน ตัวเมือง",
    h1Main: "สาวรับงานลำพูน ไซด์ไลน์ลำพูน ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงานลำพูน ไซด์ไลน์ลำพูน • นิคมลำพูน จ่ายหน้างาน ไม่มัดจำ | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานลำพูน ไซด์ไลน์ลำพูน พรีเมียม ตรงปก 100% สแตนด์บายโซนนิคมลำพูนและตัวเมือง ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ",
    introArticle: `<p>ศูนย์รวม <strong>สาวรับงานลำพูน</strong> และ <strong class="kw-purple">ไซด์ไลน์ลำพูน</strong> สแตนด์บายโซน <a href="/location/lamphun" class="kw-zone">นิคมลำพูน</a>, ย่าน <a href="/location/lamphun" class="kw-zone">บ้านกลาง</a> และตัวเมืองลำพูน ดูแลสไตล์ฟิวแฟนอย่างอบอุ่น ตรงปก 100% จ่ายหน้างาน ไม่มัดจำ</p>`,
    faqs: [
      { q: "นัดหมายสาวรับงานแถวนิคมอุตสาหกรรมลำพูนสะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ สแตนด์บายพร้อมเดินทางถึงโรงแรมและที่พักส่วนตัวในโซนนิคมอย่างรวดเร็วครับ" },
      { q: "ต้องโอนมัดจำล่วงหน้าก่อนเจอน้องไหม?", a: "ไม่ต้องโอนเงินก่อนทุกกรณีครับ เจอน้องตัวจริงตรวจสอบความตรงปกแล้วจึงชำระเงินครับ" }
    ],
    reviews: [
      { author: "คุณนิพนธ์", initial: "N", location: "โซนนิคมอุตสาหกรรมลำพูน", text: "นัดง่าย มาตรงเวลา น้องน่ารัก สุภาพ ตรงปก 100% ครับ", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" },
      { author: "คุณสมชาย", initial: "S", location: "ตัวเมืองลำพูน", text: "เทคแคร์ดีมาก อัธยาศัยดี จ่ายหน้างานปลอดภัย มั่นใจได้เลยครับ", rating: 5, date: "เมื่อ 2 สัปดาห์ก่อน" }
    ]
  },

  // --------------------------------------------------------------------------
  // 12. สุราษฎร์ธานี / เกาะสมุย (Surat Thani & Koh Samui)
  // --------------------------------------------------------------------------
  suratthani: {
    name: "สุราษฎร์ธานี",
    geo: { lat: 9.1382, lng: 99.3217 },
    zones: ["ตัวเมืองสุราษฎร์", "เกาะสมุย", "เฉวง", "ละไม", "บ่อผุด", "เกาะพะงัน"],
    h1Sub: "VIP Companion • สแตนด์บาย เกาะสมุย เฉวง ตัวเมือง",
    h1Main: "สาวรับงานสมุย สาวรับงานสุราษฎร์ธานี ตรงปก 100% จ่ายหน้างาน",
    metaTitle: "สาวรับงานสมุย สาวรับงานสุราษฎร์ธานี • ไซด์ไลน์เกาะสมุย จ่ายหน้างาน | First Model Hub",
    metaDesc: "ศูนย์รวมสาวรับงานสุราษฎร์ธานี ไซด์ไลน์เกาะสมุย เฉวง ละไม เพื่อนเที่ยวพูลวิลล่าและรีสอร์ตหรู การันตีตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ",
    introArticle: `<p>ศูนย์รวม <strong>สาวรับงานสุราษฎร์ธานี</strong> และเพื่อนเที่ยวไซด์ไลน์ <a href="/location/suratthani" class="kw-zone">เกาะสมุย</a> ครอบคลุมพิกัด <a href="/location/suratthani" class="kw-zone">หาดเฉวง</a>, <a href="/location/suratthani" class="kw-zone">หาดละไม</a> และพูลวิลล่าส่วนตัว น้องๆ น่ารัก มารยาทดี การันตีตรงปก 100% จ่ายหน้างาน ไร้มัดจำ</p>`,
    faqs: [
      { q: "นัดหมายน้องๆ บนเกาะสมุย มีขั้นตอนอย่างไร?", a: "ทักไลน์แจ้งพิกัดโรงแรม รีสอร์ต หรือพูลวิลล่าบนเกาะสมุย เพื่อนัดหมายเวลาที่สะดวกได้โดยตรงครับ" },
      { q: "มีเงื่อนไขการโอนเงินก่อนหรือไม่?", a: "ไม่มีนโยบายโอนมัดจำล่วงหน้าทุกกรณีครับ ตรวจสอบความตรงปกหน้างานแล้วค่อยชำระค่าบริการครับ" }
    ],
    reviews: [
      { author: "คุณเกรียงไกร", initial: "K", location: "พูลวิลล่า หาดเฉวง เกาะสมุย", text: "น้องน่ารักมาก พูดจาเพราะ ดูแลดีตลอดทริป ตรงปกไม่จกตาครับ", rating: 5, date: "เมื่อ 5 วันก่อน" },
      { author: "คุณอภิสิทธิ์", initial: "A", location: "ตัวเมืองสุราษฎร์ธานี", text: "ตรงเวลา สุภาพ บริการประทับใจ จ่ายหน้างานสบายใจมากครับ", rating: 5, date: "เมื่อสัปดาห์ที่แล้ว" }
    ]
  }
};

// 🟢 เชื่อมโยง Alias Keys ป้องกัน URL พิมพ์ไม่เหมือนกัน (เช่น chiang-mai -> chiangmai)
PROVINCE_SEO_DATA["chiang-mai"] = PROVINCE_SEO_DATA.chiangmai;
PROVINCE_SEO_DATA["khonkaen"] = PROVINCE_SEO_DATA["khon-kaen"];
PROVINCE_SEO_DATA["udon-thani"] = PROVINCE_SEO_DATA.udonthani;
PROVINCE_SEO_DATA["udon"] = PROVINCE_SEO_DATA.udonthani;
PROVINCE_SEO_DATA["surat-thani"] = PROVINCE_SEO_DATA.suratthani;
PROVINCE_SEO_DATA["samui"] = PROVINCE_SEO_DATA.suratthani;

// 🟢 สั่ง Inherit ค่า Default ให้ครอบคลุมทุกคีย์อย่างปลอดภัย
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

function optimizeImg(path, width = 400, height = 533) {
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

const ZONE_URL_MAP = {
  "กรุงเทพฯ": "/location/bangkok",
  "เชียงใหม่": "/location/chiangmai",
  "ชลบุรี": "/location/chonburi",
  "พัทยา": "/location/chonburi",
  "ภูเก็ต": "/location/phuket",
  "ขอนแก่น": "/location/khon-kaen",
  "อุดรธานี": "/location/udonthani",
  "เชียงราย": "/location/chiangrai",
  "ลำปาง": "/location/lampang",
  "พิษณุโลก": "/location/phitsanulok",
  "ลำพูน": "/location/lamphun",
  "สุราษฎร์ธานี": "/location/suratthani",
  "เกาะสมุย": "/location/suratthani"
};

function smartLinkify(text, total, zones, provinceSlug = "chiangmai") {
  if (!text) return "";
  let formatted = sanitizeThaiText(text);

  const replaceFirstSafe = (content, pattern, template) => {
    const regex = new RegExp(`(${pattern})(?![^<]*>|[^<>]*<\\/a>|[^<>]*<\\/strong>)`, "i");
    return content.replace(regex, template);
  };

  if (zones && Array.isArray(zones) && zones.length > 0) {
    zones.slice(0, 8).forEach(zone => {
      if (!zone || zone === "ทั้งหมด") return;
      const cleanZone = sanitizeThaiText(zone);
      const targetUrl = ZONE_URL_MAP[cleanZone] || (provinceSlug && provinceSlug !== "national" ? `/location/${provinceSlug}` : "/");
      
      formatted = replaceFirstSafe(
        formatted,
        cleanZone,
        `<a href="${targetUrl}" class="kw-zone">$1</a>`
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

async function getTemplateHtml(url, context) {
  const now = Date.now();
  const fallbackHtml = `<!DOCTYPE html>
<html lang="th" class="dark-theme dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>First Model Hub</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <main id="main-content">
    <div class="container" style="padding: 40px 16px; text-align: center;">
      <h1 id="hero-h1">First Model Hub</h1>
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

function generateCardSrcSet(rawImg) {
  if (!rawImg || typeof rawImg !== "string" || !rawImg.trim()) return "";
  return `${optimizeImg(rawImg, 320, 427)} 320w, ${optimizeImg(rawImg, 400, 533)} 400w, ${optimizeImg(rawImg, 600, 800)} 600w`;
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
  const cardImg = optimizeImg(rawImg, 400, 533);
  const cardSrcSet = generateCardSrcSet(rawImg);
  const luxuryPrice = formatLuxuryRate(p.rate);

  let rawTags = p.style_tags || p.styleTags || p.tags || [];
  if (typeof rawTags === "string") rawTags = rawTags.split(",").map(s => s.trim());
  const vibeTagsHtml = Array.isArray(rawTags) && rawTags.length > 0
    ? rawTags.slice(0, 2).map(t => `<span class="card-vibe-pill">#${escapeHTML(t.replace(/^#/, ""))}</span>`).join("")
    : `<span class="card-vibe-pill">#ฟิวแฟน</span>`;

  const tagsToCheck = Array.isArray(rawTags) ? rawTags : [];
  const isFiwFan = tagsToCheck.some(t => {
    const cleanTag = String(t).replace(/^#/, "").trim().toLowerCase();
    return cleanTag === "ฟิวแฟน" || cleanTag === "ฟิลแฟน" || cleanTag.includes("ฟิวแฟน") || cleanTag.includes("ฟิลแฟน");
  });

  let rightBadgeHtml = isFiwFan
    ? `<span class="badge-hot-tag">🔥 HOT</span>`
    : `<span class="badge-verified-top">✦ ตรงปก</span>`;

  return `
    <div class="profile-card-new-container">
      <article class="profile-card-new interactive-card" data-profile-id="${p.id}" data-profile-slug="${escapeHTML(p.slug || p.id)}">
          <img src="${cardImg}" 
               ${cardSrcSet ? `srcset="${cardSrcSet}" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"` : ""}
               alt="น้อง${cleanName} สาวรับงาน${provinceName}"
               width="400"
               height="533"
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
                  ${ageStr ? `<span class="profile-card-age-tag">${ageStr} ปี</span>` : `<span class="profile-card-age-tag" style="display:none;"></span>`}
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
  const url = new URL(req.url);
  const primaryDomain = CONFIG.PRIMARY_DOMAIN;

  // ⚡ 1. Manual Purge Endpoint
  if (url.pathname === "/api/clear-cache" || url.pathname === "/api/purge-cache") {
    const secret = url.searchParams.get("secret") || req.headers.get("x-purge-secret");
    if (secret === PURGE_SECRET_KEY) {
      PAGE_CACHE.clear();
      TEMPLATE_HTML_CACHE = null;
      GLOBAL_LAST_TIMESTAMP = `manual_${Date.now()}`;
      return new Response(JSON.stringify({
        success: true,
        message: "⚡ All Caches Purged Successfully!",
        version: GLOBAL_LAST_TIMESTAMP
      }), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // ⚡ 2. Bypass Static Assets
  if (req.headers.get("x-ssr-bypass") === "true" || STATIC_EXT_REGEX.test(url.pathname)) {
    return await context.next();
  }

  const cleanPath = url.pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (["/about", "/faq", "/blog", "/contact", "/terms-of-service", "/privacy-policy", "/locations", "/nimman", "/index-en", "/offline", "/sideline", "/profile"].some(p => cleanPath === p || cleanPath.startsWith(p + "/"))) {
    return await context.next();
  }

  if (url.pathname === "/index.html") {
    return Response.redirect(`${primaryDomain}/`, 301);
  }

  const now = Date.now();
  const isForcedPurge = url.searchParams.has("refresh") || url.searchParams.has("purge");
  if (isForcedPurge) {
    PAGE_CACHE.clear();
    GLOBAL_LAST_TIMESTAMP = `forced_${now}`;
  }

  const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

  // ⚡ 3. Auto-Probe database update
  if (!isForcedPurge && now - LAST_PROBE_TIME > AUTO_CHECK_INTERVAL_MS) {
    LAST_PROBE_TIME = now;
    try {
      const [{ count }, { data: latestProfile }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("profiles").select("lastUpdated, created_at").eq("active", true).order("lastUpdated", { ascending: false, nullsFirst: false }).limit(1).maybeSingle()
      ]);
      const latestTs = `${count || 0}_${latestProfile?.lastUpdated || latestProfile?.created_at || "v1"}`;
      if (latestTs !== GLOBAL_LAST_TIMESTAMP) {
        PAGE_CACHE.clear();
        GLOBAL_LAST_TIMESTAMP = latestTs;
      }
    } catch {}
  }

  const cacheKey = `${req.method}:${url.pathname}`;
  const cachedPage = PAGE_CACHE.get(cacheKey);
  if (!isForcedPurge && cachedPage && cachedPage.version === GLOBAL_LAST_TIMESTAMP) {
    return new Response(cachedPage.html, { headers: cachedPage.headers });
  }

  // ⚡ 4. วิเคราะห์ URL และจังหวัด
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
    const activeReviews = seoData.reviews || PROVINCE_SEO_DATA.default.reviews;

    // 🌟 ดึงข้อมูล Metadata & Copywriting สูตร Tier S จากคลังข้อมูล
    const metaTitle = seoData.metaTitle || (isNational 
      ? "สาวรับงาน ไซด์ไลน์ทั่วไทย • ตรงปก 100% จ่ายหน้างาน ไม่มัดจำ | First Model Hub"
      : `สาวรับงาน${provinceNameThai} ไซด์ไลน์${provinceNameThai} • ฟิวแฟนตรงปก จ่ายหน้างาน | First Model Hub`);

    const metaDescription = seoData.metaDesc || (isNational
      ? "ศูนย์รวมสาวรับงาน ไซด์ไลน์ทั่วไทย เด็กเอ็นฟิวแฟนพรีเมียม ครอบคลุม 77 จังหวัดทั่วประเทศ ตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำล่วงหน้า"
      : `ศูนย์รวมสาวรับงาน${provinceNameThai} ไซด์ไลน์${provinceNameThai} เด็กเอ็นพรีเมียม ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ`);

    const cleanMetaDesc = stripHTML(metaDescription);
    const mapZoom = isNational ? 6 : 12;
    const mapQuery = isNational ? encodeURIComponent("ประเทศไทย") : encodeURIComponent(`จังหวัด${provinceNameThai}`);
    const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;
    const cleanZonesList = (seoData.zones || []).map(sanitizeThaiText).filter(z => z && z !== "ทั้งหมด" && z !== "all");

    // 🌟 โครงสร้าง Schema.org Graph
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

    // 🟢 1. Render การ์ดทั้งหมด (ให้ใบแรกสุดใบเดียว i === 0 เป็น Priority High นอกนั้น Lazy Load)
    const allCardsHtml = profilesList
      .map((p, i) => renderCardHtml(p, i === 0, provinceNameThai))
      .join("");

    // 🟢 2. Render การ์ด VIP แนะนำ
    const featuredCardsHtml = profilesList
      .filter(p => p.isfeatured)
      .slice(0, 12)
      .map((p, i) => renderCardHtml(p, i === 0, provinceNameThai))
      .join("");
    
    // 🟢 3. Render รีวิวลูกค้าจริงเฉพาะพื้นที่ พร้อม Avatar
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

    // 🟢 4. FAQs และ เนื้อหาบทความ SEO เฉพาะพื้นที่ พร้อม Smart Linkify
    const faqsHtml = generateDynamicFAQsHTML(seoData.faqs);
    const zonesStr = (seoData.zones || []).filter(z => z !== "ทั้งหมด").slice(0, 4).map(sanitizeThaiText).join(", ");
    const introText = seoData.introArticle || PROVINCE_SEO_DATA.default.introArticle;
    const linkedIntro = smartLinkify(introText, 0, seoData.zones, provinceSlug);

    // 🟢 5. ลิงก์พื้นที่ให้บริการยอดนิยมใน Footer
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

    // 1. Meta Titles & Description
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHTML(metaTitle)}</title>`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHTML(cleanMetaDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHTML(metaTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHTML(cleanMetaDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHTML(metaTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHTML(cleanMetaDesc)}" />`);

    // 2. Canonical & Open Graph
    finalHtml = finalHtml.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" id="canonical-link" href="${canonicalUrl}">`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:url["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}">`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:image["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta property="og:image" content="${heroImage}">`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:image:secure_url["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta property="og:image:secure_url" content="${heroImage}">`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:image["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta name="twitter:image" content="${heroImage}">`);

    // 3. Hreflang Tag ครอบคลุมทั้งหน้าแรกและหน้ารายจังหวัด
    const hreflangBlock = isNational
      ? `<!-- MULTILINGUAL SEO -->\n  <link rel="alternate" hreflang="th" href="${primaryDomain}/" />\n  <link rel="alternate" hreflang="en" href="${primaryDomain}/index-en" />\n  <link rel="alternate" hreflang="x-default" href="${primaryDomain}/" />\n\n  `
      : `<!-- MULTILINGUAL SEO -->\n  <link rel="alternate" hreflang="th" href="${canonicalUrl}" />\n  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />\n\n  `;

    finalHtml = finalHtml.replace(
      /<!-- (?:🌐 )?MULTILINGUAL SEO -->[\s\S]*?(?=<!-- (?:📱 )?OPEN GRAPH)/i,
      hreflangBlock
    );

    // 4. แยก H1 และ H2 ตามสูตร Tier S
    const ssrH1Sub = seoData.h1Sub || (isNational ? "ศูนย์รวมเด็กเอ็น • เพื่อนเที่ยวฟิวแฟนทั่วประเทศ" : `เพื่อนเที่ยวฟิวแฟน • สแตนด์บายใน${provinceNameThai}`);
    const ssrH1Main = seoData.h1Main || (isNational ? "สาวรับงาน ไซด์ไลน์ทั่วไทย ตรงปก 100% จ่ายหน้างาน" : `สาวรับงาน${provinceNameThai} ไซด์ไลน์${provinceNameThai} ตรงปก 100% จ่ายหน้างาน`);
    
    const ssrH1Html = `
      <span class="seo-sub-headline">${escapeHTML(ssrH1Sub)}</span>
      <span class="seo-main-headline">${escapeHTML(ssrH1Main)}</span>
    `;

    finalHtml = finalHtml.replace(/<h1 id="hero-h1"[^>]*>[\s\S]*?<\/h1>/i, `<h1 id="hero-h1" class="seo-h1-title">${ssrH1Html}</h1>`);

    const ssrFeaturedH2 = `แนะนำน้องๆ รับงาน <span class="kw-purple">ไซด์ไลน์${escapeHTML(provinceNameThai)}</span>`;
    finalHtml = finalHtml.replace(/<h2 id="featured-heading"[^>]*>[\s\S]*?<\/h2>/i, `<h2 id="featured-heading" class="clean-section-h2">${ssrFeaturedH2}</h2>`);

    // 5. ตัวเลขสถิติ
    finalHtml = finalHtml.replace(/<strong id="live-profile-count"[^>]*>[\s\S]*?<\/strong>/i, `<strong id="live-profile-count" class="kw-green">${exactCount}</strong>`);

    // 6. Schema.org JSON-LD
    const schemaJsonStr = JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }).replace(/</g, "\\u003c");
    const schemaTag = `<script type="application/ld+json" id="dynamic-schema">\n${schemaJsonStr}\n<\/script>`;
    finalHtml = finalHtml.replace(/<script type="application\/ld\+json" id="dynamic-schema">[\s\S]*?<\/script>/i, schemaTag);

    // 7. Placeholders ทั่วไปและ Map
    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_NAME}}", provinceNameThai);
    finalHtml = replaceGlobal(finalHtml, "{{PROFILE_COUNT}}", exactCount);
    finalHtml = replaceGlobal(finalHtml, "{{PROVINCE_ZONES}}", zonesStr || "ทุกพื้นที่");
    finalHtml = replaceGlobal(finalHtml, "{{MAP_EMBED_URL}}", mapEmbedUrl);

    // 8. SEO Intro Content
    finalHtml = finalHtml.replace(
      /<div\s+class=["']seo-content-inner["'][^>]*>[\s\S]*?<\/div>/i,
      `<div class="seo-content-inner" style="font-size: 12.5px; color: var(--text-gray, #94a3b8); line-height: 1.7;">${linkedIntro}</div>`
    );

    // 9. FAQs & Reviews
    if (faqsHtml) {
      finalHtml = finalHtml.replace(/<div id="faq-container-list"[^>]*>[\s\S]*?<\/div>/i, `<div id="faq-container-list" class="faq-list-wrapper">${faqsHtml}</div>`);
    }
    if (reviewsHtml) {
      finalHtml = finalHtml.replace(/<div id="reviews-container-grid"[^>]*>[\s\S]*?<\/div>/i, `<div id="reviews-container-grid" class="reviews-grid-wrapper">${reviewsHtml}</div>`);
    }

    // 10. Hot Profiles Swiper
    const hotSwiperCardsHtml = profilesList.slice(0, 8).map((p, i) => {
      const cleanName = escapeHTML((p.name || "น้อง").trim().replace(/^(น้อง\s?)+/gi, ""));
      const loc = escapeHTML(sanitizeThaiText(p.location) || provinceNameThai);
      const slug = encodeURIComponent(p.slug || p.id);
      const img = optimizeImg(p.imagePath || p.image_url || "", 300, 420);
      const isAvail = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(s => (p.availability || "").toLowerCase().includes(s));
      
      return `
        <div class="vip-card-item ${i === 0 ? "active-glow" : ""}" data-profile-id="${p.id}" data-profile-slug="${slug}">
          <span class="vip-status-chip">🟢 ${isAvail ? "รับงาน" : "สอบถาม"}</span>
          <span class="hot-rank-badge">#${i + 1} HOT</span>
          <img src="${img}" 
               alt="น้อง${cleanName} รับงาน${provinceNameThai}" 
               width="150" 
               height="210" 
               loading="${i === 0 ? "eager" : "lazy"}" 
               fetchpriority="${i === 0 ? "high" : "auto"}" 
               decoding="async"
               onerror="this.src='https://firstmodelhub.com/images/firstmodelhub.webp'">
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

    if (isNational) {
      finalHtml = finalHtml.replace(/<div id="featured-profiles-container"[^>]*>[\s\S]*?<\/div>/i, `<div id="featured-profiles-container" class="profile-grid profiles-grid-row" aria-labelledby="featured-heading">${featuredCardsHtml || ""}</div>`);
    } else {
      finalHtml = finalHtml.replace(/<section id="featured-profiles"[\s\S]*?<\/section>/i, "");
    }

    // 11. Profile Cards Display Area
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
        const pList = groupedByProvince[pKey];
        const pCount = pList.length;
        
        const previewLimit = 6;
        const previewList = pList.slice(0, previewLimit);
        const pCards = previewList.map((p) => renderCardHtml(p, false, pName)).join("");
        
        const hasMore = pCount > previewLimit;
        const viewAllBtn = hasMore ? `
          <div style="text-align: center; margin-top: 14px; width: 100%;">
            <a href="/location/${pKey}" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(192, 132, 252, 0.12); border: 1px solid rgba(192, 132, 252, 0.35); color: #E9D5FF; font-weight: 800; font-size: 12.5px; padding: 9px 20px; border-radius: 100px; text-decoration: none; transition: background 0.2s;">
              ดูน้องๆ ในจังหวัด${pName} ทั้งหมด (${pCount} คน) <i class="fas fa-arrow-right" style="font-size: 11px; color: #C084FC;"></i>
            </a>
          </div>
        ` : '';

        displayAreaHtml += `
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
            ${viewAllBtn}
          </div>
        `;
      }
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

    finalHtml = finalHtml.replace(
      /<div id="profiles-display-area"[^>]*>[\s\S]*?<\/div>/i,
      `<div id="profiles-display-area" role="region" aria-label="โปรไฟล์ผู้ดูแลและเพื่อนเที่ยว${provinceNameThai}">${displayAreaHtml}</div>`
    );

    // 12. Dropdown ค้นหาจังหวัด
    const provinceSelectOptions = '<option value="">🗺️ เลือกจังหวัด (ทั้งหมด)</option>' + (allProvincesRes?.data || []).map(p => {
      const isSelected = p.key === provinceSlug ? "selected" : "";
      return `<option value="${p.key}" ${isSelected}>${p.nameThai}</option>`;
    }).join("");
    finalHtml = finalHtml.replace(/<select id="search-province"[^>]*>[\s\S]*?<\/select>/i, `<select id="search-province" name="province" class="search-select-field" aria-label="เลือกจังหวัดที่ต้องการค้นหา">${provinceSelectOptions}</select>`);

    if (popularLocationsFooter) {
      finalHtml = finalHtml.replace(/<ul id="popular-locations-footer"[^>]*>[\s\S]*?<\/ul>/i, `<ul id="popular-locations-footer" class="popular-locations-grid">${popularLocationsFooter}</ul>`);
    }

    // 🟢 14. Serialization SSR Data ส่งให้ Client Hydration 100%
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
      "Cache-Control": "public, max-age=0, must-revalidate, s-maxage=60, stale-while-revalidate=30",
      "ETag": `"${GLOBAL_LAST_TIMESTAMP}"`,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    PAGE_CACHE.set(cacheKey, { html: finalHtml, headers: responseHeaders, version: GLOBAL_LAST_TIMESTAMP });
    return new Response(finalHtml, { headers: responseHeaders });

  } catch (err) {
    console.error("SSR error:", err);
    return await context.next();
  }
};
