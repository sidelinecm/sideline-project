// 🟢 แก้ไขฟังก์ชันด้านบนสุดของ main.js (บรรทัด 1 - 15)
function parseRateToNumber(rate) {
  if (!rate) return 1500;
  const str = String(rate).trim().toLowerCase();
  if (str.includes("k")) {
    const floatVal = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(floatVal) ? 1500 : Math.round(floatVal * 1000);
  }
  // ✅ ตัดข้อความข้างหลัง เช่น /1ชม. หรือ (1 ชม.) ออกก่อนดึงตัวเลข ป้องกันกลายเป็น 15001
  const pricePart = str.split(/[\/\(\s]/)[0];
  const cleanDigits = pricePart.replace(/\D/g, "");
  const num = parseInt(cleanDigits, 10);
  if (isNaN(num) || num <= 0) return 1500;
  if (num < 10) return num * 1000;
  if (num < 500) return num * 10;
  return num;
}
window.parseRateToNumber = parseRateToNumber;

// 🟢 ดักจับรูปพังทั้งเว็บ (ตัดปัญหา syntax &#39; บน onerror ถาวร)
document.addEventListener("error", (e) => {
  if (e.target && e.target.tagName === "IMG") {
    const fallback = "https://firstmodelhub.com/images/firstmodelhub.webp";
    if (e.target.src !== fallback) {
      e.target.onerror = null;
      e.target.src = fallback;
    }
  }
}, true);

// 🟢 คำนวณเวลาสดฝั่ง Client (แก้ปัญหาเวลาค้างจาก CDN Cache)
function updateLiveRelativeTimestamps() {
  const elements = document.querySelectorAll("time.fmh-relative-time");
  if (!elements || elements.length === 0) return;
  const now = Date.now();
  elements.forEach((el) => {
    const dt = el.getAttribute("datetime");
    if (!dt) return;
    const time = new Date(dt).getTime();
    if (isNaN(time)) return;
    const diffMin = Math.floor((now - time) / (1000 * 60));
    let text = "วันนี้";
    if (diffMin < 5) text = "ออนไลน์เมื่อสักครู่";
    else if (diffMin < 60) text = `อัปเดตเมื่อ ${diffMin} นาทีที่แล้ว`;
    else {
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) text = `อัปเดตเมื่อ ${diffHours} ชั่วโมงที่แล้ว`;
      else {
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) text = "อัปเดตเมื่อวานนี้";
        else if (diffDays < 7) text = `อัปเดตเมื่อ ${diffDays} วันที่แล้ว`;
        else text = `อัปเดตเมื่อ ${new Date(time).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}`;
      }
    }
    el.textContent = text;
  });
}

// 🟢 โหลด Supabase แบบ Dynamic Singleton

// 🟢 โหลด Supabase แบบ Dynamic Singleton
let supabaseClient = null;
let supabasePromise = null;

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (supabasePromise) return supabasePromise;

  supabasePromise = (async () => {
    try {
      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.42.0");
      supabaseClient = createClient(
        "https://zxetzqwjaiumqhrpumln.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      );
      window.supabase = supabaseClient;
      return supabaseClient;
    } catch (e) {
      console.warn("Supabase dynamic import fallback:", e);
      return null;
    }
  })();

  return supabasePromise;
}

(function () {
  "use strict";

  const CACHE_STORAGE_KEY = "fmh_super_admin_2026";
  const DEFAULT_FALLBACK_IMG = "https://firstmodelhub.com/images/firstmodelhub.webp";

  const isEN = document.documentElement.lang === "en" || window.location.pathname.includes("-en");
  const PROVINCE_EN_MAP = {
    chiangmai: "Chiang Mai",
    chiangrai: "Chiang Rai",
    lampang: "Lampang",
    "khon-kaen": "Khon Kaen",
    khonkaen: "Khon Kaen",
    phuket: "Phuket",
    udonthani: "Udon Thani",
    national: "Nationwide (Thailand)"
  };

  // 🟢 ลดขนาดไฟล์ JS ลง 20KB: ใช้เฉพาะรายการโซนย่อสำหรับช่องค้นหา ส่วนเนื้อหา SEO ปล่อยให้ Server SSR แสดงผล
  const SEO_PROVINCES_DATA = {
    bangkok: { zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ"] },
    chonburi: { zones: ["พัทยา", "หาดจอมเทียน", "บางแสน", "ศรีราชา"] },
    chiangmai: { zones: ["นิมมาน", "สันติธรรม", "เจ็ดยอด", "หลัง มช.", "ช้างเผือก"] },
    chiangrai: { zones: ["บ้านดู่", "หน้า มฟล.", "หอนาฬิกา"] },
    lampang: { zones: ["สวนดอก", "ม.ราชภัฏลำปาง", "สบตุ๋ย"] },
    "khon-kaen": { zones: ["กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น"] },
    khonkaen: { zones: ["กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น"] },
    phuket: { zones: ["ป่าตอง", "ตัวเมืองภูเก็ต", "กะทู้", "บางเทา"] },
    udonthani: { zones: ["UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร"] },
    national: { zones: ["เชียงใหม่", "ขอนแก่น", "ภูเก็ต", "อุดรธานี"] }
  };

  const REVIEW_POOL = [
    { name: "คุณชลสิทธิ์", text: "ตรงเวลามากครับ น้องน่ารัก อัธยาศัยดี พูดจาสุภาพ ดูแลสไตล์ฟิวแฟนแท้ๆ ประทับใจมากครับ" },
    { name: "คุณเอก", text: "ตัวจริงสวยตรงปกเลยครับ คุยสนุก เป็นกันเองมาก ปลอดภัยนัดเจอจ่ายหน้างานสบายใจสุดๆ" },
    { name: "พี่โจ", text: "จองง่าย ไม่ต้องโอนมัดจำล่วงหน้า ไปเจอน้องตัวจริงแล้วค่อยจ่าย สบายใจและปลอดภัย 100% ครับ" },
    { name: "คุณกอล์ฟ", text: "น้องน่ารักสไตล์ผู้ดี มารยาทดีมาก เทคแคร์เอาใจใส่เป็นธรรมชาติ แนะนำคนนี้เลยครับ" },
    { name: "พี่ยอด", text: "ตรงปกไม่จกตาครับ น้องสุภาพ เรียบร้อย ไม่มีเร่งเวลาเลย นั่งทานข้าวด้วยกันเพลินมาก" },
    { name: "คุณต้น", text: "บริการประทับใจมากครับ ให้เกียรติลูกค้า น่ารัก ยิ้มเก่ง คลายเหงาได้ดีเยี่ยมเลยครับ" },
    { name: "พี่บอล", text: "ฟิวแฟนของแท้เลยครับ น้องเทคแคร์ดีมาก ขี้อ้อน น่ารัก ตรงตามรูปในโปรไฟล์ทุกอย่าง" },
    { name: "คุณอภิชาติ", text: "ระบบจองสะดวกมาก น้องตรงเวลา สะอาด มารยาทการดูแลดีเยี่ยม ไร้กังวลเรื่องมัดจำครับ" },
    { name: "พี่เมฆ", text: "น่ารักและเป็นกันเองมากครับ น้องคุยสนุก ไม่มีเกร็งเลย เหมือนได้ไปเดทกับแฟนจริงๆ" },
    { name: "คุณวิทย์", text: "ตัวจริงสวยกว่าในรูปอีกครับ ผิวพรรณดี สุภาพเรียบร้อย เอาใจใส่ทุกรายละเอียด แนะนำครับ" },
    { name: "พี่นัท", text: "จ่ายเงินหน้างานตรงกับน้อง มั่นใจในความปลอดภัยได้เต็มร้อย บริการด้วยความจริงใจมากครับ" },
    { name: "คุณบอย", text: "น้องตรงต่อเวลามาก น่ารัก สดใส พูดเพราะ ให้ความรู้สึกอบอุ่นและผ่อนคลายสุดๆ ครับ" },
    { name: "คุณป้อง", text: "เทคแคร์ดีมากครับ สุภาพ อารมณ์ดีตลอดเวลา คุ้มค่าและประทับใจมากครับ" },
    { name: "พี่ยุทธ", text: "โปรไฟล์ยืนยันตัวตนจริง ตัวจริงตรงปก 100% สบายใจเรื่องความปลอดภัย แนะนำต่อเลยครับ" },
    { name: "คุณอาร์ม", text: "น่ารัก ขี้อ้อน คุยเก่งมากครับ ชวนคุยเพลิน ไม่มีช่วงเงียบเลย ประทับใจมากครับ" },
    { name: "พี่ก้อง", text: "รักษาเวลาดีเยี่ยม สุภาพ สะอาด ให้เกียรติซึ่งกันและกัน มีโอกาสจะนัดหมายอีกแน่นอนครับ" },
    { name: "คุณเต้", text: "นัดหมายปลอดภัย ไม่มีความเสี่ยงทางการเงิน น้องน่ารัก มารยาทดี สมราคาครับ" },
    { name: "คุณเจ", text: "บริการด้วยความจริงใจ ฟีลแฟนอบอุ่น ดูแลเอาใจใส่เป็นธรรมชาติ ไม่ผิดหวังครับ" }
  ];
 

  const appState = {
    allProfiles: [],
    provincesMap: new Map(),
    currentProfileSlug: null,
    isFetching: false,
    currentFilters: null,
    filteredProfiles: [],
    activePillTag: "all",
    renderId: 0
  };

  const domCache = {};
  
  // 🟢 NATIVE HAPTIC FEEDBACK (เช็กความพร้อมก่อนสั่น ป้องกันแถบแดงใน Console)
  function triggerHaptic(type = "light") {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
        
        if (type === "light") {
          navigator.vibrate(12);
        } else if (type === "medium") {
          navigator.vibrate(20);
        } else if (type === "success") {
          navigator.vibrate([15, 40, 15]);
        }
      } catch (_) {}
    }
  }
  window.triggerHaptic = triggerHaptic;

  window.shareProfile = async function (name, profileUrl) {
  const shareTargetUrl = profileUrl || window.location.href;
  const shareData = {
    title: `${name} | FirstModelHub`,
    text: `ดูโปรไฟล์ ${name} สไตล์ฟิวแฟน ตัวจริงตรงปก 100% ปลอดภัยนัดเจอจ่ายหน้างาน ไร้มัดจำ`,
    url: shareTargetUrl
  };

  if (typeof triggerHaptic === "function") triggerHaptic("light");

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      // 🟢 ไม่แสดงผลเออเร่อถ้าผู้ใช้กดยกเลิกหน้าจอแชร์ด้วยตัวเอง
      if (err.name === "AbortError") return;
    }
  }

  // Fallback สำหรับคอมพิวเตอร์ หรือกรณีคัดลอกผ่าน Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(shareTargetUrl);
      alert(`คัดลอกลิงก์โปรไฟล์ ${name} เรียบร้อยแล้วค่ะ!`);
      return;
    } catch (_) {}
  }

  prompt("คัดลอกลิงก์โปรไฟล์นี้:", shareTargetUrl);
};

  window.trackLineClick = async function(profileId) {
    try {
      const idNum = parseInt(profileId, 10);
      if (isNaN(idNum)) return;

      // ใช้ localStorage เพื่อจำถาวรบนเบราว์เซอร์นั้นๆ (ป้องกัน 1 คนกดปั๊มยอดรัวๆ)
      const storageKey = `tracked_line_${idNum}`;
      if (localStorage.getItem(storageKey)) return; 
      localStorage.setItem(storageKey, "true");

      // เพิ่มตัวเลขชั่วคราวบนหน้าจอให้ผู้ใช้เห็นทันทีว่ากดแล้ว (ไม่ต้องรอรีเฟรชหน้า)
      const likeSpans = document.querySelectorAll(`[data-profile-id="${idNum}"] .social-badge-likes span`);
      likeSpans.forEach(span => {
        const currentCount = parseInt(span.textContent.replace(/\D/g, "")) || 0;
        span.innerHTML = `${currentCount + 1} 💗`;
      });

      // ส่งคำสั่งไปบวกเลขในฐานข้อมูล Supabase
      const client = await getSupabaseClient();
      if (client) {
        client.rpc("increment_likes", { profile_id_to_update: idNum }).catch(() => {});
      }
    } catch (_) {}
  };

  // 🟢 [ย้ายมาไว้ตรงนี้] ฟังก์ชันกดจองคิว LINE
  window.handleLineBooking = function(profileId, lineUrl) {
    triggerHaptic("success");
    window.trackLineClick(profileId);
  };

  function sanitizeThaiText(text) {
  if (!text || typeof text !== "string") return "";
  return text
   
    .replace(/[\uD800-\uDFFF\uFFFD]/g, "")
    .replace(/[જ⁀➴˚༘⋆🫦🌷͙֒🔥💥💦🐻‍❄️ྀི₊✮⸜⸝✧✦⁺]+/g, " ")
    .replace(/\.{2,}/g, " ")
    .replace(/ฟิลแฟน|ฟีลแฟน|ฟิวเเฟน|ฟิวแฟว/g, "ฟิวแฟน")
  
    .replace(/(ฟิวแฟน\s*){2,}/gi, "ฟิวแฟน ")
   
    .replace(/([\u0E31\u0E34-\u0E3A\u0E47-\u0E4E])\1+/g, "$1")
    .replace(/เจ็+ดยอด/g, "เจ็ดยอด")
    .replace(/นิมาน/g, "นิมมาน")
    .replace(/(โซน|ย่าน|แถว|พัก|อยู่)\s*นิทาน/g, "$1นิมมาน") // แก้เสียงเพี้ยนเฉพาะตอนพูดถึงสถานที่
    .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/ไม่มีมีดจำ/g, "ไม่มีมัดจำ")
    .replace(/ฟิวแฟว|ฟิวเเฟน/g, "ฟิวแฟน")
    .replace(/ได้ค่ะได้ค่ะ/g, "ได้ค่ะ")
    .replace(/ตรงปก\s*💯?\s*%/g, "ตรงปก 100%")
    
    // 3. กรองคำล่อแหลมแบบ SafeSearch Compliant
    .replace(/ฟรีถุงยาง!?/gi, "")
    .replace(/ฟรีแตกบนตัว!?/gi, "")
    .replace(/จู๋\s*ทำ\s*(\+\s*\d+)?(\.-)?/gi, "")
    .replace(/(69|➏➒|อมสด|ดูดสด|เอาร่องนม|จูบแลกลิ้น|แตกใน)/gi, "")
    .replace(/(พร้อม|มี)?(อาบน้ำด้วยกัน|อาบน้ำ)/gi, "")
    .replace(/(มีอารมร่วม|มีอารมณ์?ร่วม)/gi, "ดูแลเป็นกันเอง")
    
    // 🟢 ดักจับคำว่า "น้ำ" ทุกรูปแบบ (รองรับทั้งเลขอารบิกและเลขไทย + จัดระเบียบวงเล็บเวลา)
    .replace(/[\d๑-๙]+\s*น้ำ(\s*\/?\s*[\d๑-๙]+\s*ชม\.?)?/gi, "1 ชม.")
    .replace(/\/\s*1\s*ชม\.?/gi, " (1 ชม.)") // ✅ แก้ให้รองรับทั้ง "/1ชม." และ "/ 1 ชม."
    
    // 4. จัดระเบียบคำซ้ำ
    .replace(/(บริการดูแลสไตล์ฟิวแฟน\s*)+/gi, "")
    .replace(/(ฟิวแฟน\s*){2,}/gi, "ฟิวแฟน ")
    
    // 5. ล้างเศษเครื่องหมายวรรคตอนและช่องว่าง
    .replace(/([!*~_·\-\/])\s*\1+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

  function formatDisplayName(name) {
    if (!name || typeof name !== "string") return "";
    let clean = name.trim().replace(/^(น้อง\s?)+/gi, "");
    clean = clean.toLowerCase();
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    return isEN ? clean : `น้อง${clean}`;
  }

  function escapeHTML(str) {
    return str ? String(str).replace(/[&<>'"]/g, tag => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[tag] || tag)) : "";
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

// 🟢 เวอร์ชันสมบูรณ์ 100% ไร้ปัญหา 404, โหลดไวปานจรวด, บอทไม่ตีความว่ารูปเสีย
function optimizeImg(imagePath, mode = "card") {
  const DEFAULT_FALLBACK_IMG = "https://firstmodelhub.com/images/firstmodelhub.webp";
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) {
    return DEFAULT_FALLBACK_IMG;
  }

  const cleanPath = imagePath.trim();

  // ⚡ ตัด l_text ออกทั้งหมด เหลือแค่ f_auto,q_auto และขนาดพิกเซลที่เหมาะสม ป้องกันรูปพัง 100%
  let transform = "f_auto,q_auto:good,w_400,h_560,c_fill";

  if (mode === "thumb" || (typeof mode === "number" && mode <= 150)) {
    // รูปย่อยขนาดเล็ก (Thumbnail)
    transform = "f_auto,q_auto:good,w_120,h_120,c_thumb,g_face";
  } else if (mode === 400 || mode === "card") {
    // รูปการ์ดแสดงผลปกติ
    transform = "f_auto,q_auto:good,w_400,h_560,c_fill";
  } else if (mode === 600 || (typeof mode === "number" && mode > 400 && mode < 700)) {
    // รูปขนาดกลางสำหรับ Lightbox Modal
    transform = "f_auto,q_auto:good,w_600,h_800,c_fill";
  } else if (mode === "full" || (typeof mode === "number" && mode >= 700) || mode === "og") {
    // รูปใหญ่เต็มจอ / OG Image สำหรับแชร์โซเชียล
    transform = "f_auto,q_auto:good,w_1200,c_limit";
  }

  if (cleanPath.includes("res.cloudinary.com")) {
    const fileMatch = cleanPath.match(/(?:v\d+\/)?(images\/[^\s\?]+|[^\/]+\.(?:png|jpg|jpeg|webp|avif))$/i);
    if (fileMatch && fileMatch[1]) {
      // ประกอบ URL ใหม่ที่สะอาด ปราศจากพารามิเตอร์ขยะ โหลดไว และไม่เกิด Error 404 แน่นอน
      return `https://res.cloudinary.com/dyynjlbuj/image/upload/${transform}/${fileMatch[1]}`;
    }
    return cleanPath;
  }

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) return cleanPath;
  const formatted = cleanPath.replace(/^\/+/, "");
  return `https://res.cloudinary.com/dyynjlbuj/image/upload/${transform}/${formatted}`;
}

  function normalizeProfile(raw) {
    if (!raw || typeof raw !== "object") return null;

    const rawName = raw.n || raw.name || raw.displayName || raw.title || "Model";
    const displayName = formatDisplayName(rawName);
    const mainImg = raw.img || raw.imagePath || raw.image_url || raw.imageUrl || raw.image || raw.photo || raw.avatar;
    
   let gallery = raw.g || raw.galleryPaths || raw.gallery_paths || raw.gallery || raw.photos || raw.images || [];
    if (typeof gallery === "string") {
      const trimmed = gallery.trim();
      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        try { gallery = JSON.parse(trimmed); } catch (_) { gallery = trimmed.split(",").map(s => s.trim()); }
      } else if (trimmed) {
        gallery = trimmed.split(",").map(s => s.trim());
      } else {
        gallery = [];
      }
    }
    const galleryArr = Array.isArray(gallery) ? gallery : [];

    // รวมรูปหน้าปก + ทุกรูปในอัลบั้มเข้าด้วยกัน
    const combinedPhotos = [
      mainImg,
      ...galleryArr
    ].filter(Boolean);

    let images = [...new Set(combinedPhotos)].map(img => {
      let srcUrl = DEFAULT_FALLBACK_IMG;
      let fullSrcUrl = DEFAULT_FALLBACK_IMG;

      if (typeof img === "object" && img !== null) {
        srcUrl = img.src || img.url || img.imagePath || img.image_url || DEFAULT_FALLBACK_IMG;
        fullSrcUrl = img.fullSrc || img.fullUrl || srcUrl;
      } else if (typeof img === "string" && img.trim()) {
        srcUrl = img.trim();
        fullSrcUrl = img.trim();
      }

      return {
        src: optimizeImg(srcUrl, 400, 560),
        fullSrc: optimizeImg(fullSrcUrl, "full")
      };
    });

    if (images.length === 0) {
      images.push({ src: DEFAULT_FALLBACK_IMG, fullSrc: DEFAULT_FALLBACK_IMG });
    }

  let pKey = (raw.pk || raw.provinceKey || raw.province_slug || raw.province_key || raw.province || "").toString().toLowerCase().trim();
    if (pKey === "chiang_mai" || pKey === "chiang-mai") pKey = "chiangmai";
    if (pKey === "khonkaen" || pKey === "khon_kaen") pKey = "khon-kaen";

    const INVALID_KEYS = ["", "no_province", "other", "undefined", "null", "none"];
    // 🔒 ถ้าในฐานข้อมูลมี provinceKey อยู่แล้ว ให้ใช้ค่านั้น ห้ามสแกนข้อความมาเขียนทับ
    if (!pKey || INVALID_KEYS.includes(pKey)) {
      const fullText = `${raw.location || ''} ${raw.provinceThai || ''} ${raw.description || ''} ${raw.name || ''}`.toLowerCase();
      if (fullText.includes("ขอนแก่น") || fullText.includes("กังสดาล") || fullText.includes("มข") || fullText.includes("โนนม่วง") || fullText.includes("ม.ภาค") || fullText.includes("ศิลา")) pKey = "khon-kaen";
      else if (fullText.includes("กรุงเทพ") || fullText.includes("กทม") || fullText.includes("สุขุมวิท") || fullText.includes("รัชดา") || fullText.includes("ห้วยขวาง") || fullText.includes("ทองหล่อ") || fullText.includes("ลาดพร้าว")) pKey = "bangkok";
      else if (fullText.includes("ชลบุรี") || fullText.includes("พัทยา") || fullText.includes("บางแสน") || fullText.includes("ศรีราชา") || fullText.includes("จอมเทียน")) pKey = "chonburi";
      else if (fullText.includes("ภูเก็ต") || fullText.includes("ป่าตอง") || fullText.includes("กะทู้") || fullText.includes("บางเทา") || fullText.includes("เชิงทะเล") || fullText.includes("ฉลอง") || fullText.includes("ราไวย์")) pKey = "phuket";
      else if (fullText.includes("เชียงราย") || fullText.includes("บ้านดู่") || fullText.includes("มฟล") || fullText.includes("แม่ฟ้าหลวง") || fullText.includes("หอนาฬิกา") || fullText.includes("แม่สาย")) pKey = "chiangrai";
      else if (fullText.includes("ลำปาง") || fullText.includes("สวนดอก") || fullText.includes("สบตุ๋ย") || fullText.includes("ม.ราชภัฏลำปาง") || fullText.includes("เซ็นทรัลลำปาง")) pKey = "lampang";
      else if (fullText.includes("ลำพูน") || fullText.includes("นิคมลำพูน")) pKey = "lamphun";
      else if (fullText.includes("พิษณุโลก") || fullText.includes("มน.") || fullText.includes("ม.นเรศวร")) pKey = "phitsanulok";
      else if (fullText.includes("อุดร") || fullText.includes("ud town") || fullText.includes("หนองประจักษ์") || fullText.includes("โพศรี") || fullText.includes("เซ็นทรัลอุดร") || fullText.includes("บ้านจาน")) pKey = "udonthani";
      else if (fullText.includes("เชียงใหม่") || fullText.includes("นิมมาน") || fullText.includes("เจ็ดยอด") || fullText.includes("สันติธรรม") || fullText.includes("ช้างเผือก") || fullText.includes("หลัง มช") || fullText.includes("แม่โจ้") || fullText.includes("พายัพ") || fullText.includes("สันทราย") || fullText.includes("ท่าแพ") || fullText.includes("แม่ริม") || fullText.includes("หางดง")) pKey = "chiangmai";
      else pKey = "chiangmai";
    }

    if (pKey === "chiang_mai" || pKey === "chiang-mai") pKey = "chiangmai";
    if (pKey === "khonkaen") pKey = "khon-kaen";
    const provinceThai = appState.provincesMap.get(pKey) || raw.provinceThai || raw.province_thai || raw.provinceName || "เชียงใหม่";
    
    // 🟢 แก้ไข: ใช้ parseRateToNumber ป้องกันบั๊กราคา 15.-
    const rawRate = raw.r || raw.rate || raw.price || raw.fee || raw.cost || 0;
    const numPrice = parseRateToNumber(rawRate);
    const displayPrice = numPrice > 0 ? `${numPrice.toLocaleString()}.-` : (isEN ? "Inquire" : "สอบถาม");

    let statsStr = "-";
    const bust = raw.bust || raw.breast || "";
    const waist = raw.waist || "";
    const hips = raw.hip || raw.hips || "";
    const cup = (raw.cup_size || raw.cupSize || raw.cup || "").toString().toUpperCase().trim();

    if (bust && waist && hips) {
      statsStr = `${bust}${cup}-${waist}-${hips}`;
  } else if (raw.st || raw.stats || raw.proportion || raw.proportions) {
      statsStr = String(raw.st || raw.stats || raw.proportion || raw.proportions).trim();
    }

    const rawAge = raw.a || raw.age || raw.profile_age;
    const cleanAge = rawAge && String(rawAge).trim() !== "-" && String(rawAge).trim() !== "0" ? String(rawAge).replace(/\D/g, "") : null;
    const ageDisplay = cleanAge ? (isEN ? `${cleanAge} yrs` : `${cleanAge} ปี`) : (isEN ? "N/A" : "ไม่ระบุ");

    const rawHeight = raw.height || raw.profile_height;
    const cleanHeight = rawHeight && String(rawHeight).trim() !== "-" && String(rawHeight).trim() !== "0" ? String(rawHeight).replace(/\D/g, "") : null;
    const heightDisplay = cleanHeight ? `${cleanHeight} cm` : (isEN ? "N/A" : "ไม่ระบุ");

    const rawWeight = raw.weight || raw.profile_weight;
    const cleanWeight = rawWeight && String(rawWeight).trim() !== "-" && String(rawWeight).trim() !== "0" ? String(rawWeight).replace(/\D/g, "") : null;
    const weightDisplay = cleanWeight ? `${cleanWeight} kg` : (isEN ? "N/A" : "ไม่ระบุ");

    const rawSkin = raw.skin_tone || raw.skinTone || raw.skin_color || raw.skinColor || raw.skin;
    const skinDisplay = rawSkin && String(rawSkin).trim() !== "-" ? String(rawSkin).trim() : (isEN ? "Fair" : "ไม่ระบุ");
    const statsDisplay = statsStr && statsStr !== "-" ? statsStr : (isEN ? "N/A" : "ไม่ระบุ");

    const slogan = raw.slogan || raw.quote || raw.tagline || (isEN ? "Romantic Girlfriend Experience, verified photos" : "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน");
    const rawTags = raw.style_tags || raw.styleTags || raw.tags || [];
    const styleTags = Array.isArray(rawTags) ? rawTags : typeof rawTags === "string" ? rawTags.split(",").map(s => s.trim()) : [];

    const availabilityStatus = raw.availability || raw.status || (isEN ? "Available" : "รับงาน");
    const isAvail = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "off", "busy"].some(s => availabilityStatus.toLowerCase().includes(s));
    
   let rawLineVal = (raw.line_id || raw.lineId || raw.line || raw.line_url || raw.contact_line || "").toString().trim();
    // ถ้าเป็นลิงก์ของน้องข้าวฟ่างที่โดนแบน ให้สลับไปใช้ LINE กลาง
    if (/vos730x|318afxwt/i.test(rawLineVal)) {
      rawLineVal = "https://line.me/ti/p/u8Bz9HsaY8";
    }

    return {
      ...raw,
      id: raw.id,
      slug: raw.slug || String(raw.id),
      location: isEN ? (PROVINCE_EN_MAP[pKey] || pKey) : sanitizeThaiText(raw.location || provinceThai),
      description: sanitizeThaiText(raw.description || ""),
      quote: isEN ? slogan : sanitizeThaiText(slogan),
      slogan: isEN ? slogan : sanitizeThaiText(slogan),
      displayName,
      images,
      provinceNameThai: provinceThai,
      provinceKey: pKey,
      displayPrice,
      _price: numPrice,
      bust: String(bust),
      cup,
      safeAge: cleanAge || "-",
      safeAgeDisplay: ageDisplay,
      safeHeight: heightDisplay,
      safeWeight: weightDisplay,
      safeStats: statsDisplay,
      safeSkin: skinDisplay,
      isAvailable: isAvail,
      availability: availabilityStatus,
      isVerified: raw.verified === true || raw.isVerified === true || raw.is_verified === true,
      hasVideo: raw.has_video === true || raw.hasVideo === true || raw.hasVideoClip === true,
      isfeatured: raw.isfeatured === true || raw.is_featured === true || raw.isFeatured === true,
      lineId: rawLineVal,   // 🟢 ส่งค่าไลน์เดิมไป
      line_id: rawLineVal,  // 🟢 เผื่อไว้ทั้ง 2 ชื่อกันระบบดึงผิดคีย์
      styleTags
    };
  }

  function populateInitialComponents() {
    if (domCache.provinceSelect) {
      while (domCache.provinceSelect.options.length > 1) {
        domCache.provinceSelect.remove(1);
      }
      const sortedProvinces = Array.from(appState.provincesMap.entries()).sort((a, b) => a[1].localeCompare(b[1], "th"));
      const fragment = document.createDocumentFragment();
      sortedProvinces.forEach(([k, nameThai]) => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = isEN ? (PROVINCE_EN_MAP[k] || nameThai) : nameThai;
        fragment.appendChild(opt);
      });
      domCache.provinceSelect.appendChild(fragment);
    }
    
    initAgencyStories();
    

    const routeMatch = window.location.pathname.match(/^\/(?:location|province)\/([^/]+)/);
    const activeProvinceSlug = routeMatch ? decodeURIComponent(routeMatch[1]).toLowerCase() : window.currentProvinceSlug || "";
    if (domCache.provinceSelect && activeProvinceSlug && activeProvinceSlug !== "national") {
      domCache.provinceSelect.value = activeProvinceSlug;
    }

    const hasExistingSSRProfiles = domCache.profilesDisplayArea && domCache.profilesDisplayArea.children.length > 0;
    if (!hasExistingSSRProfiles) {
      executeFilterAndRender(false);
    }

    const vipSwiperEl = document.getElementById("vip-swiper-container");
if (!vipSwiperEl) return;

// ✅ ถ้าบนหน้าจอมีน้องในแถบ HOT อยู่แล้ว ให้อ่าน ID ของน้องเก็บไว้ทันที จะได้ไม่นำมาแสดงซ้ำด้านล่าง
const existingVipCards = vipSwiperEl.querySelectorAll(".vip-card-item");
if (existingVipCards.length > 0) {
  window.__hotProfileIds = new Set(Array.from(existingVipCards).map(el => String(el.dataset.profileId)));
  return;
}

// 1. ตรวจสอบครอบคลุมทั้ง tags, description, slogan
let hotCandidate = appState.allProfiles.filter(p => {
  const tagsStr = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : (p.styleTags || "")).toLowerCase();
  const descStr = (p.description || "").toLowerCase();
  const sloganStr = (p.slogan || p.quote || "").toLowerCase();
  const combined = `${tagsStr} ${descStr} ${sloganStr}`;
  return combined.includes("ฟิวแฟน") || combined.includes("ฟิลแฟน") || combined.includes("gfe");
});

// 2. ถ้าไม่ถึง 10 คน ให้เอาโปรไฟล์แนะนำอื่นมาเติม
if (hotCandidate.length < 10) {
  const others = appState.allProfiles.filter(p => !hotCandidate.some(h => String(h.id) === String(p.id)));
  hotCandidate = [...hotCandidate, ...others];
}

const seenHotNames = new Set();
const hotProfiles = [];
for (const p of hotCandidate) {
  const cleanName = (p.displayName || p.name || "").replace(/^(น้อง|สาว|พี่)\s*/gi, "").trim().toLowerCase();
  if (seenHotNames.has(cleanName)) continue;
  seenHotNames.add(cleanName);
  hotProfiles.push(p);
  if (hotProfiles.length >= 10) break;
}

    // 🟢 [เพิ่มบรรทัดนี้]: บันทึก ID ของน้องๆ ที่ติด Hot Swiper ไว้ เพื่อส่งไปตัดออกในฟีดหลักด้านล่าง
    window.__hotProfileIds = new Set(hotProfiles.map(p => String(p.id)));

    vipSwiperEl.innerHTML = hotProfiles.map((p, idx) => {
      const rankBadge = `#${idx + 1} HOT`;
      const pKey = (p.provinceKey || "national").toLowerCase();
      const locationText = isEN ? (PROVINCE_EN_MAP[pKey] || pKey) : (p.location || p.provinceNameThai || "ทั่วไทย");
      const slug = encodeURIComponent(p.slug || p.id);
      const imgSrc = p.images[0]?.src || DEFAULT_FALLBACK_IMG;
      const isOnline = p.isAvailable !== undefined ? p.isAvailable : !(p.availability || "").toLowerCase().includes("ไม่ว่าง");
      const statusLabel = isEN ? (isOnline ? "Available" : "Inquire") : (isOnline ? "รับงาน" : "สอบถาม");

      return `
        <div class="vip-card-item ${idx === 0 ? "active-glow" : ""}" data-profile-id="${p.id}" data-profile-slug="${slug}">
          <span class="vip-status-chip"><span aria-hidden="true">🟢</span> ${statusLabel}</span>
          <span class="hot-rank-badge">${rankBadge}</span>
          <img src="${imgSrc}" 
               alt="${escapeHTML(p.displayName)} ฟิวแฟน${escapeHTML(locationText)}" 
               width="175" 
               height="245" 
               loading="${idx === 0 ? "eager" : "lazy"}" 
               fetchpriority="${idx === 0 ? "high" : "auto"}" 
               decoding="async" 
               onerror="this.onerror=null; this.src='${DEFAULT_FALLBACK_IMG}';">
          <div class="vip-card-overlay"></div>
          <a href="/sideline/${slug}" class="card-link" aria-label="ดูโปรไฟล์ ${escapeHTML(p.displayName)}"></a>
          <div class="vip-card-info">
            <h3 class="vip-name" style="margin:0; font-size:14px; font-weight:900;">${escapeHTML(p.displayName)}</h3>
            <div class="vip-location">${escapeHTML(locationText)}</div>
          </div>
        </div>
      `;
    }).join("");
    }

  function executeFilterAndRender(isUserTriggered = true) {
  try {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    let urlProvince = null;
    let urlZone = null;

    if (pathSegments[0] === "location" || pathSegments[0] === "province") {
      urlProvince = pathSegments[1] ? decodeURIComponent(pathSegments[1]).toLowerCase() : null;
      urlZone = pathSegments[2] ? decodeURIComponent(pathSegments[2]).trim() : null;
    }

    let activeProvince = "all";
    if (urlProvince && urlProvince !== "profiles") {
      activeProvince = urlProvince;
    } else if (domCache.provinceSelect && domCache.provinceSelect.value && domCache.provinceSelect.value !== "") {
      activeProvince = domCache.provinceSelect.value;
    }
    if (activeProvince === "chiang_mai" || activeProvince === "chiang-mai") activeProvince = "chiangmai";

    const ZONE_SLUG_MAP = {
        // --- 1. เชียงใหม่ ---
        "nimman": "นิมมาน", "nimmanhaemin": "นิมมาน",
        "jedyod": "เจ็ดยอด", "jed-yod": "เจ็ดยอด",
        "santitham": "สันติธรรม",
        "changphueak": "ช้างเผือก", "changphuak": "ช้างเผือก",
        "cmu": "หลัง มช.", "langmor": "หลัง มช.", "lang-mor": "หลัง มช.",
        "namor": "หน้า มช.", "na-mor": "หน้า มช.",
        "kumueang": "คูเมือง", "ku-mueang": "คูเมือง",
        "thapae": "ท่าแพ", "tha-phae": "ท่าแพ",
        "huaykaew": "ห้วยแก้ว", "huay-kaew": "ห้วยแก้ว",
        "ruamchok": "รวมโชค", "ruam-chok": "รวมโชค",
        "sansai": "สันทราย", "san-sai": "สันทราย",
        "maejo": "แม่โจ้", "mae-jo": "แม่โจ้",
        "payap": "พายัพ",
        "centralfest": "เซ็นทรัลเฟส", "centralfestival": "เซ็นทรัลเฟส",
        "airport-cnx": "สนามบินเชียงใหม่", "cnx-airport": "สนามบินเชียงใหม่",
        "maerim": "แม่ริม", "mae-rim": "แม่ริม",
        "hangdong": "หางดง", "hang-dong": "หางดง",

        // --- 2. กรุงเทพฯ ---
        "sukhumvit": "สุขุมวิท", "ratchada": "รัชดา", "huaikhwang": "ห้วยขวาง", "huai-khwang": "ห้วยขวาง",
        "ladprao": "ลาดพร้าว", "thonglor": "ทองหล่อ", "thong-lor": "ทองหล่อ", "ekkamai": "เอกมัย", "ekamai": "เอกมัย",
        "sathorn": "สาทร", "silom": "สีลม", "bangna": "บางนา", "bang-na": "บางนา",
        "ramintra": "รามอินทรา", "rama9": "พระราม 9", "rama-9": "พระราม 9", "ari": "อารีย์",

        // --- 3. ชลบุรี / พัทยา ---
        "pattaya": "พัทยา", "pattaya-klang": "พัทยากลาง", "pattaya-tai": "พัทยาใต้",
        "jomtien": "หาดจอมเทียน", "hat-jomtien": "หาดจอมเทียน", "bangsaen": "บางแสน", "bang-saen": "บางแสน",
        "sriracha": "ศรีราชา", "sri-racha": "ศรีราชา", "mueang-chonburi": "ตัวเมืองชลบุรี",
        "amata": "อมตะนคร", "amatanakorn": "อมตะนคร", "laemchabang": "แหลมฉบัง", "bowin": "บ่อวิน",

        // --- 4. ภูเก็ต ---
        "mueang-phuket": "ตัวเมืองภูเก็ต", "patong": "ป่าตอง", "kathu": "กะทู้", "chalong": "ฉลอง",
        "karon": "กะรน", "kata": "กะตะ", "bangtao": "บางเทา", "bang-tao": "บางเทา",
        "rawai": "ราไวย์", "cherngtalay": "เชิงทะเล", "choeng-thale": "เชิงทะเล",
        "kamala": "กมลา", "phuket-airport": "สนามบินภูเก็ต",

        // --- 5. ขอนแก่น ---
        "mueang-khonkaen": "ในตัวเมืองขอนแก่น", "kangsadan": "กังสดาล",
        "kku": "หลัง มข.", "langmor-kku": "หลัง มข.", "lang-mor-kku": "หลัง มข.",
        "namor-kku": "หน้า มข.", "nonmuang": "โนนม่วง", "non-muang": "โนนม่วง",
        "central-khonkaen": "เซ็นทรัลขอนแก่น", "buengkaennakhon": "บึงแก่นนคร",
        "m-phak": "ม.ภาค", "mittraphap": "ถนนมิตรภาพ", "sila": "ศิลา",

        // --- 6. เชียงราย ---
        "mueang-chiangrai": "ตัวเมืองเชียงราย", "baandu": "บ้านดู่", "ban-du": "บ้านดู่",
        "mfu": "หน้า มฟล.", "na-mfu": "หน้า มฟล.", "mae-fah-luang": "ม.แม่ฟ้าหลวง",
        "clock-tower": "หอนาฬิกา", "hor-nalika": "หอนาฬิกา", "night-bazaar": "ไนท์บาซาร์",
        "den-ha": "เด่นห้า", "rop-wiang": "รอบเวียง", "rim-kok": "ริมกก",
        "chiangrai-airport": "สนามบินเชียงราย", "maesai": "แม่สาย", "mae-sai": "แม่สาย",

        // --- 7. ลำปาง ---
        "mueang-lampang": "ตัวเมืองลำปาง", "suan-dok": "สวนดอก", "rop-wiang-lampang": "รอบเวียง",
        "lpru": "ม.ราชภัฏลำปาง", "rajabhat-lampang": "ม.ราชภัฏลำปาง", "sob-tui": "สบตุ๋ย", "sobtui": "สบตุ๋ย",
        "central-lampang": "เซ็นทรัลลำปาง", "atsavin": "อัศวิน", "kad-kong-ta": "กาดกองต้า", "ko-kha": "เกาะคา",

        // --- 8. ลำพูน ---
        "mueang-lamphun": "ตัวเมืองลำพูน", "nikom-lamphun": "นิคมลำพูน", "wiang-yong": "เวียงยอง",
        "pa-sang": "ป่าซาง", "mueang-nga": "เหมืองง่า", "ban-klang": "บ้านกลาง",

        // --- 9. พิษณุโลก ---
        "mueang-phitsanulok": "ตัวเมืองพิษณุโลก", "nu": "รอบ มน.", "rop-nu": "รอบ มน.",
        "tha-pho": "ท่าโพธิ์", "samo-khae": "สมอแข", "topland": "ท็อปแลนด์", "central-phitsanulok": "เซ็นทรัลพิษณุโลก",

        // --- 10. อุดรธานี ---
        "mueang-udon": "ตัวเมืองอุดร", "udtown": "UD Town", "ud-town": "UD Town",
        "nongprajak": "หนองประจักษ์", "nong-prajak": "หนองประจักษ์", "central-udon": "เซ็นทรัลอุดร",
        "ban-chan": "บ้านจาน", "pho-si": "โพศรี", "thung-si-mueang": "ทุ่งศรีเมือง",
        "nong-sim": "หนองสิม", "rangsina": "ตลาดรังษิณา", "high-tech": "สี่แยกไฮเทค",

        // --- 11. อยุธยา ---
        "rojana": "โรจนะ", "mueang-ayutthaya": "ตัวเมืองอยุธยา", "bang-pa-in": "บางปะอิน",
        "pratu-chai": "ประตูชัย", "sena": "เสนา",

        // --- 12. โคราช (นครราชสีมา) ---
        "mueang-korat": "ในเมืองโคราช", "central-korat": "เซ็นทรัลโคราช", "themall-korat": "เดอะมอลล์โคราช",
        "sut": "มทส.", "suranaree": "มทส.", "joho": "จอหอ", "pakchong": "ปากช่อง", "khaoyai": "เขาใหญ่",

        // --- 13. สงขลา-หาดใหญ่ ---
        "mueang-hatyai": "ตัวเมืองหาดใหญ่", "hat-yai": "ตัวเมืองหาดใหญ่", "kho-hong": "คอหงส์",
        "psu": "ม.อ.หาดใหญ่", "lee-gardens": "ลีการ์เดนส์", "dannok": "ด่านนอก", "mueang-songkhla": "ตัวเมืองสงขลา",

        // --- 14. สุราษฎร์ธานี / เกาะสมุย ---
        "mueang-surat": "ตัวเมืองสุราษฎร์", "samui": "เกาะสมุย", "koh-samui": "เกาะสมุย",
        "chaweng": "เฉวง", "lamai": "ละไม", "bophut": "บ่อผุด", "phangan": "เกาะพะงัน"
      };

    let rawTargetZone = (urlZone || window.currentZoneSlug || domCache.zoneSelect?.value || "").trim();
    let matchedZoneThai = ZONE_SLUG_MAP[rawTargetZone.toLowerCase()] || rawTargetZone;
    matchedZoneThai = sanitizeThaiText(matchedZoneThai).replace(/^(โซน|ย่าน)/, "").trim().toLowerCase();

    const currentCriteria = {
      text: (domCache.searchInput?.value || "").trim(),
      province: activeProvince,
      zone: matchedZoneThai,
      avail: domCache.availabilitySelect?.value || "all",
      featured: domCache.featuredSelect?.value === "true",
      sort: domCache.sortSelect?.value || "featured"
    };

    let results = [...appState.allProfiles];

    // 1. กรองตามจังหวัด
    if (activeProvince !== "all" && activeProvince !== "national") {
      const cleanActive = activeProvince.toLowerCase().replace(/[-_]/g, "");
      results = results.filter(p => {
        const cleanK = String(p.provinceKey || p.province_slug || p.province || "").toLowerCase().replace(/[-_]/g, "");
        return cleanK === cleanActive || cleanK.includes(cleanActive);
      });
    }

    // 2. 🟢 กรองตามโซนย่อยอย่างแม่นยำ (เช็กทั้ง location, description และ tags)
    if (currentCriteria.zone && currentCriteria.zone !== "ทั้งหมด") {
      const targetZ = currentCriteria.zone;
      const zoneWithSpace = targetZ.replace(/-/g, " ");
      const zoneWithoutDash = targetZ.replace(/-/g, "");

      results = results.filter(p => {
        const loc = sanitizeThaiText(p.location || "").toLowerCase();
        const desc = sanitizeThaiText(p.description || "").toLowerCase();
        const rawTags = Array.isArray(p.styleTags) ? p.styleTags : (Array.isArray(p.style_tags) ? p.style_tags : []);
        const tags = rawTags.join(" ").toLowerCase();
        const combined = `${loc} ${desc} ${tags}`;

        return combined.includes(targetZ) || 
               combined.includes(zoneWithSpace) || 
               combined.includes(zoneWithoutDash);
      });
    }

    // 3. กรองตามแท็กหมวดหมู่ด่วน (ฟิวแฟน, เอ็นเตอร์เทน ฯลฯ)
    if (appState.activePillTag && appState.activePillTag !== "all") {
      const filterTag = appState.activePillTag.toLowerCase().trim();
      results = results.filter(p => {
        const tagStr = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : (p.styleTags || "")).toLowerCase();
        const descStr = (p.description || "").toLowerCase();
        const sloganStr = (p.slogan || p.quote || "").toLowerCase();
        const locStr = (p.location || "").toLowerCase();
        const combined = `${tagStr} ${descStr} ${sloganStr} ${locStr}`;

        if (filterTag === "ตรงปก") return p.isVerified || combined.includes("ตรงปก");
        if (filterTag === "เอ็นเตอร์เทน") return combined.includes("เอ็น") || combined.includes("en") || combined.includes("ชงเหล้า") || combined.includes("ปาร์ตี้");
        if (filterTag === "ค้างคืน") return combined.includes("ค้างคืน") || combined.includes("overnight") || combined.includes("เหมาคืน");
        if (filterTag === "ฟิวแฟน") return combined.includes("ฟิวแฟน") || combined.includes("gfe") || combined.includes("แฟน");
        
        return combined.includes(filterTag);
      });
    }

    // 4. กรองตามคำค้นหา (Keyword) ในช่องพิมพ์
    if (currentCriteria.text && currentCriteria.text !== currentCriteria.zone) {
      const cleanQuery = currentCriteria.text.toLowerCase().trim();
      let baseQuery = cleanQuery.replace(/^(น้อง|สาว|พี่|รับงาน|ไซด์ไลน์|ย่าน|โซน)\s*/gi, "").trim();
      if (!baseQuery) baseQuery = cleanQuery;
      const keywords = baseQuery.split(/\s+/).filter(Boolean);

      results = results.filter(p => {
        const name = (p.displayName || p.name || "").toLowerCase();
        const cleanName = name.replace(/^(น้อง\s?)+/gi, "").trim();
        const loc = (p.location || "").toLowerCase();
        const pName = (p.provinceNameThai || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const slogan = (p.slogan || p.quote || "").toLowerCase();
        const tags = Array.isArray(p.styleTags) ? p.styleTags.join(" ").toLowerCase() : (p.styleTags || "").toLowerCase();
        const idStr = String(p.id || "");
        const ageStr = String(p.safeAge || p.age || "");
        const priceStr = String(p._price || p.rate || "");
        const statsStr = String(p.safeStats || p.stats || "").toLowerCase();

        return keywords.every(k => (
          idStr === k ||
          name.includes(k) ||
          cleanName.includes(k) ||
          loc.includes(k) ||
          pName.includes(k) ||
          desc.includes(k) ||
          slogan.includes(k) ||
          tags.includes(k) ||
          ageStr === k ||
          priceStr.includes(k) ||
          statsStr.includes(k)
        ));
      });
    }

    // 5. กรองสถานะรับงาน
    if (currentCriteria.avail && currentCriteria.avail !== "all") {
      results = results.filter(p => {
        const status = (p.availability || "").toLowerCase();
        if (currentCriteria.avail === "รับงาน") {
          return status.includes("รับงาน") || status.includes("ว่าง") || status.includes("available") || status.includes("online");
        }
        return status.includes(currentCriteria.avail);
      });
    }

    // 6. เรียงลำดับ
    if (!currentCriteria.text && !currentCriteria.zone) {
      results.sort((a, b) => {
        switch (currentCriteria.sort) {
          case "featured":
            return (b.isfeatured ? 1 : 0) - (a.isfeatured ? 1 : 0) || (a.name || "").localeCompare(b.name || "");
          case "name_asc":
            return (a.name || "").localeCompare(b.name || "");
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
    }

    const isAllOrNational = activeProvince === "all" || activeProvince === "national";
    const resolvedSlug = isAllOrNational ? "national" : activeProvince;
    const provinceDisplayName = isEN 
      ? (PROVINCE_EN_MAP[resolvedSlug] || "Thailand") 
      : (isAllOrNational ? "ทั่วไทย" : appState.provincesMap.get(resolvedSlug) || "ทั่วไทย");

    renderDisplayArea(results, activeProvince !== "all" || Boolean(currentCriteria.text) || Boolean(currentCriteria.zone) || appState.activePillTag !== "all");
    appState.currentFilters = currentCriteria;
    appState.filteredProfiles = results;
    replaceDomPlaceholders(provinceDisplayName, results.length, activeProvince);
  } catch (err) {
    console.error("Filter error:", err);
  }
}

  // 🟢 ดักจับคลิกโลโก้: แต่ถ้าแตะโดน "ดวงดาว" ให้ปล่อยผ่าน ห้ามรีโหลดหน้าเว็บเด็ดขาด!
  if (!window.__logoClickRegistered) {
    window.__logoClickRegistered = true;
    document.addEventListener('click', (e) => {
      if (e.target.closest('.luxe-star-crest, .star, .dancing-neon-star')) return;

      const logoEl = e.target.closest('.brand-luxe-logo');
      if (!logoEl) return;

      if (typeof triggerHaptic === 'function') triggerHaptic('light');

      if (typeof window.closeLightboxModal === 'function') {
        window.closeLightboxModal(false);
      }

      const isHome = (window.location.pathname === '/' || window.location.pathname === '') && !window.location.search;
      if (isHome) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.location.reload();
      } else {
        e.preventDefault();
        window.location.href = '/';
      }
    }, { capture: true });
  }

  async function renderDisplayArea(profiles, isFilteredOrLocationView) {
    if (!domCache.profilesDisplayArea) return;

    appState.renderId = (appState.renderId || 0) + 1;
    const activeRenderId = appState.renderId;

    // 🟢 1. เคลียร์และซ่อนกล่อง Error & No Results เริ่มต้น
    if (domCache.noResultsMessage) {
      domCache.noResultsMessage.classList.add("hidden");
      domCache.noResultsMessage.style.display = "none";
      domCache.noResultsMessage.innerHTML = "";
    }
    if (domCache.fetchErrorMessage) {
      domCache.fetchErrorMessage.classList.add("hidden");
      domCache.fetchErrorMessage.style.display = "none";
    }

    // 🟢 2. จัดการส่วน Featured (แนะนำ) ด้านบน
    if (domCache.featuredSection) {
      const isHomeView = !isFilteredOrLocationView && 
                         !window.location.pathname.includes("/location/") && 
                         !window.location.pathname.includes("/province/") && 
                         (!appState.activePillTag || appState.activePillTag === "all") &&
                         (!domCache.searchInput?.value?.trim());

      const alreadyHasCards = domCache.featuredContainer && domCache.featuredContainer.children.length > 0;

      if (isHomeView && alreadyHasCards) {
        domCache.featuredSection.classList.remove("hidden");
      } else if (isHomeView) {
        const rawFeatured = appState.allProfiles.filter(p => p.isfeatured || p.is_featured);
        const featuredList = rawFeatured.length > 0 ? rawFeatured.slice(0, 8) : appState.allProfiles.slice(0, 6);
        const hasFeatured = featuredList.length > 0;

        domCache.featuredSection.classList.toggle("hidden", !hasFeatured);
        if (hasFeatured && domCache.featuredContainer) {
          await renderProfilesBatch(domCache.featuredContainer, featuredList, activeRenderId);
        }
      } else {
        // เมื่อค้นหา หรือดูหน้ารายจังหวัด ให้ซ่อนแถบ Featured แนะนำออก
        domCache.featuredSection.classList.add("hidden");
      }
    }

    // 🟢 3. กรณีค้นหาแล้ว "ไม่พบโปรไฟล์ตรงกับเงื่อนไข" (0 ผลลัพธ์)
    if (!profiles || profiles.length === 0) {
      domCache.profilesDisplayArea.innerHTML = "";
      if (domCache.noResultsMessage) {
        domCache.noResultsMessage.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
            <i class="fas fa-search" style="font-size: 32px; color: var(--violet-main); margin-bottom: 12px;"></i>
            <p style="font-size: 14px; font-weight: 700; color: #140F22; margin: 0 0 6px 0;">ไม่พบโปรไฟล์ตรงกับเงื่อนไขการค้นหา</p>
            <p style="font-size: 12px; color: #64748B; margin: 0;">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะคะ</p>
          </div>
        `;
        domCache.noResultsMessage.classList.remove("hidden");
        domCache.noResultsMessage.style.display = "block";
      }
      return;
    }

   

  const isExplicitLocationPath = window.location.pathname.includes("/location/") || window.location.pathname.includes("/province/");

    // 🟢 4. กรณีเป็นมุมมองการค้นหา, เลือกแท็ก หรือเปิดหน้ารายจังหวัด
    if (isFilteredOrLocationView || isExplicitLocationPath || (appState.activePillTag && appState.activePillTag !== "all")) {
      const routeMatch = window.location.pathname.match(/^\/(?:location|province)\/([^/]+)(?:\/([^/]+))?/);
      const currentLocSlug = routeMatch ? decodeURIComponent(routeMatch[1]).toLowerCase() : domCache.provinceSelect?.value || "chiangmai";
      const currentZoneParam = routeMatch && routeMatch[2] ? decodeURIComponent(routeMatch[2]).trim() : (window.currentZoneSlug || "");
      const provinceLabel = isEN ? (PROVINCE_EN_MAP[currentLocSlug] || currentLocSlug) : (appState.provincesMap.get(currentLocSlug) || "เชียงใหม่");
      const zoneLabelText = currentZoneParam ? ` โซน${escapeHTML(currentZoneParam)}` : "";
      const searchKeyword = domCache.searchInput?.value?.trim();

      let sectionTitle = isEN 
        ? `📍 Models in <span class="province-name-highlight">${escapeHTML(provinceLabel)}${zoneLabelText}</span>` 
        : `📍 น้องๆ ในจังหวัด <span class="province-name-highlight">${escapeHTML(provinceLabel)}${zoneLabelText}</span>`;
      if (searchKeyword) {
        sectionTitle = isEN ? `🔍 Results for "${escapeHTML(searchKeyword)}"` : `🔍 ผลการค้นหา "${escapeHTML(searchKeyword)}"`;
      } else if (appState.activePillTag && appState.activePillTag !== "all") {
        sectionTitle = `✨ หมวดหมู่: <span class="province-name-highlight">#${escapeHTML(appState.activePillTag)}</span>`;
      }

      const countBadgeText = `${profiles.length} โปรไฟล์`;
      const wrapper = document.createElement("div");
      wrapper.className = "section-content-wrapper";
      wrapper.style.cssText = "margin-top: 24px; margin-bottom: 14px; width: 100%; box-sizing: border-box;";
      wrapper.innerHTML = `
        <div class="province-header-row">
            <h2 class="province-clean-title">
                ${sectionTitle}
            </h2>
            <span class="province-count-pill">
                <span class="pulse-dot-el"></span>
                <span>${countBadgeText}</span>
            </span>
        </div>
        <div class="profile-grid profiles-grid-row"></div>
      `;

      domCache.profilesDisplayArea.innerHTML = "";
      domCache.profilesDisplayArea.appendChild(wrapper);
      const gridContainer = wrapper.querySelector(".profile-grid");
      await renderProfilesBatch(gridContainer, profiles, activeRenderId);

    // 🟢 5. กรณีเป็นหน้าแรกทั่วไป (คัดเฉพาะน้องๆ สาย #ฟิวแฟน 40 คน โดยตัดคนซ้ำที่ติด Hot Swiper ออก)
    } else {
      // 🛡️ ดึงรายชื่อ ID ที่ติดแถบ Hot Swiper ไปแล้ว เพื่อป้องกันการแสดงผลซ้ำซ้อน
      const hotIds = window.__hotProfileIds || new Set();

      let fiwfanProfiles = profiles.filter(p => {
        if (hotIds.has(String(p.id))) return false; // 👈 ตัดคนซ้ำที่อยู่บน Hot Swiper ออกเด็ดขาด

        const rawTags = Array.isArray(p.styleTags) ? p.styleTags : (Array.isArray(p.style_tags) ? p.style_tags : []);
        const hasTag = rawTags.some(t => {
          const clean = String(t).replace(/^#+/, "").trim().toLowerCase();
          return clean === "ฟิวแฟน" || clean === "ฟิลแฟน" || clean === "gfe" || clean.includes("ฟิวแฟน");
        });
        if (hasTag) return true;
        const text = `${p.description || ""} ${p.slogan || ""} ${p.quote || ""}`.toLowerCase();
        return text.includes("ฟิวแฟน") || text.includes("ฟิลแฟน") || text.includes("gfe");
      });

      if (fiwfanProfiles.length < 40) {
        const others = profiles.filter(p => !hotIds.has(String(p.id)) && !fiwfanProfiles.some(f => f.id === p.id));
        fiwfanProfiles = [...fiwfanProfiles, ...others];
      }

      // แสดงผล 40 คน พร้อมรักษากล่องเลือกจังหวัด (City Hubs) ให้เหมือน SSR 100%
      const feedProfiles = fiwfanProfiles.slice(0, 40);

      const cityHubsHtml = `
        <section class="national-city-hubs-section" style="margin-top: 10px; margin-bottom: 24px;">
          <div class="featured-header-clean-row" style="margin-bottom: 12px;">
            <div class="featured-title-flex">
              <span class="section-tag-mini"><i class="fas fa-map-marked-alt"></i> พื้นที่หลัก</span>
              <h2 class="clean-section-h2" style="font-size: 16px; margin: 0;">เลือกพื้นที่บริการ <span class="province-name-highlight">ครอบคลุมทั่วไทย</span></h2>
            </div>
            <a href="/locations" style="color: #7C3AED; font-size: 11.5px; font-weight: 800; text-decoration: none;">ดูทั้งหมด &rarr;</a>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
            <a href="/location/chiangmai" style="background:#FFF; border:1.5px solid rgba(124,58,237,0.15); border-radius:14px; padding:10px 12px; text-decoration:none; display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px;">📍</span><strong style="color:#140F22; font-size:12.5px;">เชียงใหม่</strong>
            </a>
            <a href="/location/khon-kaen" style="background:#FFF; border:1.5px solid rgba(124,58,237,0.15); border-radius:14px; padding:10px 12px; text-decoration:none; display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px;">📍</span><strong style="color:#140F22; font-size:12.5px;">ขอนแก่น</strong>
            </a>
            <a href="/location/phuket" style="background:#FFF; border:1.5px solid rgba(124,58,237,0.15); border-radius:14px; padding:10px 12px; text-decoration:none; display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px;">📍</span><strong style="color:#140F22; font-size:12.5px;">ภูเก็ต</strong>
            </a>
            <a href="/location/udonthani" style="background:#FFF; border:1.5px solid rgba(124,58,237,0.15); border-radius:14px; padding:10px 12px; text-decoration:none; display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px;">📍</span><strong style="color:#140F22; font-size:12.5px;">อุดรธานี</strong>
            </a>
          </div>
        </section>
      `;

      const wrapper = document.createElement("div");
      wrapper.className = "section-content-wrapper";
      wrapper.style.cssText = "margin-top: 10px; margin-bottom: 14px; width: 100%; box-sizing: border-box;";
      wrapper.innerHTML = `
        ${cityHubsHtml}
        <div class="province-header-row">
            <h2 class="province-clean-title">
                <span class="province-pin-icon"><i class="fas fa-heart" style="color: #E11D48;"></i></span>
                <span class="province-prefix">สาวรับงาน & ไซด์ไลน์</span>
                <span class="province-name-highlight">สไตล์ฟิวแฟน ยอดนิยมทั่วไทย</span>
            </h2>
            <span class="province-count-pill">
                <span class="pulse-dot-el"></span>
                <span>#ฟิวแฟนแท้ (${feedProfiles.length} คน)</span>
            </span>
        </div>
        <div class="profile-grid profiles-grid-row"></div>
      `;

      domCache.profilesDisplayArea.innerHTML = "";
      domCache.profilesDisplayArea.appendChild(wrapper);
      const gridContainer = wrapper.querySelector(".profile-grid");
      await renderProfilesBatch(gridContainer, feedProfiles, activeRenderId);
    }
    }

  function replaceDomPlaceholders(provinceName, count, currentSlug) {
    const totalCount = typeof count === "number" ? count : appState.filteredProfiles?.length ?? appState.allProfiles?.length ?? 0;

    // 🟢 1. อัปเดตตัวเลขจำนวนโปรไฟล์สด
    const liveCounterEl = document.getElementById("live-profile-count");
    if (liveCounterEl) {
      liveCounterEl.textContent = `${totalCount}`;
    }

    // 🛡️ 2. ป้องกันหน้าโซนย่อย: ถ้ากำลังเปิดหน้าโซนย่อยอยู่ ห้าม JavaScript เขียนทับ H1 และแผนที่ของ SSR เด็ดขาด
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const isSubZone = Boolean(window.currentZoneSlug) || (pathSegments.length >= 3 && pathSegments[0] === "location");

    if (isSubZone) {
      const liveProvinceEl = document.getElementById("live-province-count");
      if (liveProvinceEl) liveProvinceEl.textContent = "1";
      return; // 👈 จบการทำงานตรงนี้ เพื่อรักษา H1 และแผนที่โซนย่อยที่ SSR เรนเดอร์ไว้ให้คงเดิม
    }

    // 🟢 3. ถ้าเป็นหน้าทั่วไป (หน้าแรก หรือ หน้ารายจังหวัดปกติ) ให้ทำงานตามปกติ
    const isAllOrNational = !currentSlug || currentSlug === "national" || currentSlug === "all";
    const targetName = isAllOrNational ? "ทั่วไทย" : (provinceName || "ทั่วไทย");

    const liveProvinceEl = document.getElementById("live-province-count");
    if (liveProvinceEl) {
      const totalProvincesCount = appState.provincesMap.size || (window.provincesData ? window.provincesData.length : 0);
      liveProvinceEl.textContent = isAllOrNational ? `${totalProvincesCount}` : "1";
    }

    
  // ใน main.js (ฟังก์ชัน replaceDomPlaceholders)
    const heroH1 = document.getElementById("hero-h1");
    if (heroH1) {
      if (isEN) {
        // ภาษาอังกฤษคงเดิม...
      } else {
        const line1 = isAllOrNational 
          ? `สาวรับงาน ไซด์ไลน์ เด็กเอ็น <span class="t-chunk">ทั่วไทย</span>` 
          : (zoneSlug 
              ? `สาวรับงาน ไซด์ไลน์${escapeHTML(targetName)} <span class="t-chunk">โซน${escapeHTML(zoneSlug)}</span>`
              : `สาวรับงาน และ ไซด์ไลน์${escapeHTML(targetName)}`);
              
        const line2 = "ฟิวแฟนตรงปก จ่ายหน้างาน (ไม่มีมัดจำ)";

        heroH1.innerHTML = `
          <span class="h1-line-1">${line1}</span>
          <span class="h1-line-2">${line2}</span>
        `;
      }
    }

    // ✅ ซิงค์ H2 ให้ตรงกับ SSR
    const featuredH2 = document.getElementById("featured-heading");
    if (featuredH2) {
      if (isEN) {
        const enLocName = isAllOrNational ? "Thailand" : (PROVINCE_EN_MAP[currentSlug] || currentSlug);
        featuredH2.innerHTML = `Featured Companions in <span class="province-name-highlight">${escapeHTML(enLocName)}</span>`;
      } else {
        featuredH2.innerHTML = isAllOrNational
          ? `น้องๆ แนะนำ <span class="province-name-highlight">ไซด์ไลน์ทั่วไทย</span> (จ่ายหน้างาน)`
          : `น้องๆ แนะนำ <span class="province-name-highlight">ไซด์ไลน์${escapeHTML(targetName)}</span> (ตัวจริงตรงปก)`;
      }
    }

    // ✅ ปรับตำแหน่งแผนที่ Google Map
    const mapIframe = document.getElementById("google-map");
    if (mapIframe) {
      const zoom = isAllOrNational ? 6 : 12;
      let query = "";
      if (isEN) {
        const enLocName = isAllOrNational ? "Thailand" : (PROVINCE_EN_MAP[currentSlug] || "Thailand");
        query = encodeURIComponent(enLocName);
      } else {
        query = isAllOrNational ? encodeURIComponent("ประเทศไทย") : encodeURIComponent(`จังหวัด${targetName}`);
      }
      
      const newMapSrc = `https://maps.google.com/maps?q=${query}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
      if (mapIframe.src !== newMapSrc) {
        mapIframe.src = newMapSrc;
      }
    }

    if (isEN) return;

    try {
      const resolvedKey = isAllOrNational ? "national" : currentSlug;
      const seoData = SEO_PROVINCES_DATA[resolvedKey] || SEO_PROVINCES_DATA.national || {};

      const seoDrawerInner = document.querySelector("#seo-drawer-wrapper .seo-content-inner");
      if (seoDrawerInner && (!seoDrawerInner.innerHTML || seoDrawerInner.innerHTML.trim() === "")) {
        if (seoData.seoContent) seoDrawerInner.innerHTML = seoData.seoContent;
      }
    } catch (err) {
      console.error("replaceDomPlaceholders error:", err);
    }
  }

  function showSearchSuggestions(inputVal) {
    const popover = document.getElementById("search-suggestions");
    const clearBtn = document.getElementById("clear-search-btn");

    if (clearBtn) clearBtn.style.display = inputVal ? "block" : "none";
    if (!popover) return;

    const query = (inputVal || "").toLowerCase().trim();

    if (!query) {
      const activeProvince = domCache.provinceSelect?.value || window.currentProvinceSlug || "chiangmai";
      const configObj = SEO_PROVINCES_DATA[activeProvince] || SEO_PROVINCES_DATA.national;
      const topZones = configObj && configObj.zones ? configObj.zones.filter(z => z !== "ทั้งหมด").slice(0, 4) : ["ตัวเมือง"];

      const labelTopSearch = isEN ? "Popular Searches:" : "คำค้นหายอดนิยม:";
      const labelGFE = isEN ? "❤️ #GFE" : "❤️ #ฟิวแฟน";

      let html = '<div style="background-color: #FFFFFF; border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 14px; box-shadow: 0 10px 30px rgba(20, 10, 40, 0.08);">';
      html += `<div style="font-size: 11.5px; font-weight: 800; color: #7C3AED; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;"><i class="fas fa-lightbulb" style="color: #D97706;"></i> ${labelTopSearch}</div>`;
      html += '<div style="display: flex; flex-wrap: wrap; gap: 6px;">';
      html += `<span data-action="suggestion" data-slug="${isEN ? "GFE" : "ฟิวแฟน"}" data-is-profile="false" style="background: #FFE4E6; border: 1px solid rgba(225, 29, 72, 0.2); color: #E11D48; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">${labelGFE}</span>`;
      html += '<span data-action="suggestion" data-slug="1500" data-is-profile="false" style="background: rgba(5, 150, 105, 0.08); border: 1px solid rgba(5, 150, 105, 0.2); color: #059669; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">💰 1,500.-</span>';

      topZones.forEach(z => {
        html += `<span data-action="suggestion" data-slug="${z}" data-is-profile="false" style="background: #EFE9F8; border: 1px solid rgba(0,0,0,0.06); color: #362E47; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">📍 ${z}</span>`;
      });

      html += "</div></div>";
      popover.innerHTML = html;
      popover.style.display = "block";
      return;
    }

    const matchedProvinces = Array.from(appState.provincesMap.entries())
      .filter(([k, nameThai]) => nameThai.toLowerCase().includes(query) || k.toLowerCase().includes(query))
      .slice(0, 2);

    const cleanKeyword = query.replace(/^(น้อง\s?)+/gi, "").trim();
    const matchedProfiles = appState.allProfiles.filter(p => {
      const name = (p.displayName || p.name || "").toLowerCase().replace(/^(น้อง\s?)+/gi, "").trim();
      const loc = (p.location || "").toLowerCase();
      const idStr = String(p.id || "");
      return name.includes(cleanKeyword) || loc.includes(query) || idStr === query;
    }).slice(0, 4);

    if (matchedProvinces.length === 0 && matchedProfiles.length === 0) {
      popover.style.display = "none";
      return;
    }

    let popoverHtml = '<div style="background-color: #FFFFFF; border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(20, 10, 40, 0.08);">';

    if (matchedProvinces.length > 0) {
      popoverHtml += `<div style="padding: 7px 12px; background: #EDE9FE; font-size: 11px; font-weight: 800; color: #7C3AED;">${isEN ? "🗺️ Browse Province" : "🗺️ ไปที่หน้าจังหวัด"}</div>`;
      matchedProvinces.forEach(([k, nameThai]) => {
        const provTitle = isEN ? (PROVINCE_EN_MAP[k] || nameThai) : `ไซด์ไลน์${nameThai}`;
        popoverHtml += `
          <div onclick="window.location.href='/location/${k}'" style="padding: 10px 14px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); color: #0D081B; font-size: 13px; font-weight: 700; transition: background 0.2s;" onmouseover="this.style.background='#EFE9F8'" onmouseout="this.style.background='transparent'">
            <span>📍 ${provTitle}</span>
            <i class="fas fa-arrow-right" style="color: #7C3AED; font-size: 12px;"></i>
          </div>
        `;
      });
    }

    if (matchedProfiles.length > 0) {
      popoverHtml += `<div style="padding: 7px 12px; background: #EDE9FE; font-size: 11px; font-weight: 800; color: #7C3AED;">${isEN ? "✨ Featured Companions" : "✨ โปรไฟล์แนะนำ"}</div>`;
      matchedProfiles.forEach(p => {
        const avatar = p.images && p.images[0] ? p.images[0].src : DEFAULT_FALLBACK_IMG;
        popoverHtml += `
          <div class="suggestion-item" data-action="suggestion" data-slug="${encodeURIComponent(p.slug || p.id)}" data-is-profile="true" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0,0,0,0.04); transition: background 0.2s;" onmouseover="this.style.background='#EFE9F8'" onmouseout="this.style.background='transparent'">
              <img src="${avatar}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(124,58,237,0.15);">
              <div style="flex: 1; min-width: 0; text-align: left;">
                  <div style="font-size: 13px; font-weight: 800; color: #0D081B;">${p.displayName || p.name}</div>
                  <div style="font-size: 11px; color: #716486;">📍 ${p.location || p.provinceNameThai}</div>
              </div>
              <span style="color: #059669; font-weight: 800; font-size: 13px;">${p.displayPrice}</span>
          </div>
        `;
      });
    }

    popoverHtml += "</div>";
    popover.innerHTML = popoverHtml;
    popover.style.display = "block";
  }

 function createProfileCardDOM(p, index = 20) {
    const container = document.createElement("div");
    container.className = "profile-card-new-container";

    let rawPath = p.imagePath || p.image_url || p.imageUrl || "";
    if (!rawPath || rawPath.includes("firstmodelhub.webp")) {
        rawPath = "https://res.cloudinary.com/dyynjlbuj/image/upload/e_blur:1500,w_400,h_560,c_fill/v1790435086/images/tdzubsqfcfdfmfqvuog0.png";
    }
    const imgSrc = (p.images && p.images[0] && p.images[0].src && !p.images[0].src.includes("firstmodelhub.webp")) 
      ? p.images[0].src 
      : optimizeImg(rawPath, 400, 560);
    
    const pKey = (p.provinceKey || p.province_slug || "national").toString().toLowerCase();
    let rawName = p.displayName || p.name || "Model";
    const modelName = isEN ? (p.name_en || rawName.replace(/^(น้อง|สาว|พี่)\s?/gi, "").trim()) : formatDisplayName(rawName);
    
    const ageVal = p.safeAge || p.age;
    const ageDisplay = ageVal && String(ageVal).trim() !== "-" && String(ageVal).trim() !== "0" 
      ? (isEN ? `${String(ageVal).replace(/\D/g, "")} yrs` : `${String(ageVal).replace(/\D/g, "")} ปี`) 
      : "";
    
    let rawLoc = String(isEN ? (PROVINCE_EN_MAP[pKey] || p.location || "Thailand") : (p.location || p.provinceNameThai || "ทั่วไทย"));
    let locName = "";
    const activeZone = window.currentZoneSlug ? window.currentZoneSlug.trim() : "";
    if (activeZone && rawLoc.includes(activeZone)) {
      locName = activeZone;
    } else {
      locName = rawLoc
        .replace(/^(ในตัวเมือง|ตัวเมือง|โซน|ย่าน)\s*(\/|และ)?\s*/gi, "")
        .split(/[,/]|และใกล้/)[0]
        .trim();
      if (!locName) locName = rawLoc;
    }

    const isOnline = p.isAvailable !== undefined 
      ? Boolean(p.isAvailable) 
      : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "busy", "off"].some(s => String(p.availability || p.status || "").toLowerCase().includes(s));
      
    const statusClass = isOnline ? "status-online" : "status-busy";
    const availText = isEN ? (isOnline ? "Available" : "Inquire") : (isOnline ? "รับงาน" : "สอบถาม");
    const luxuryPrice = formatLuxuryRate(p.rate || p._price || p.price);
    const profileSlug = encodeURIComponent(p.slug || p.id);

    const rawTags = Array.isArray(p.styleTags) ? p.styleTags : (Array.isArray(p.style_tags) ? p.style_tags : []);
    const cleanTags = rawTags
      .map(t => String(t).replace(/^#/, "").trim())
      .filter(t => t && !t.includes("รับงาน") && !t.includes("ไซด์ไลน์") && t.length <= 8)
      .map(t => {
        if (!isEN) return t;
        const tagMap = {
          "ตรงปก": "Verified", "น่ารัก": "Cute", "ผิวขาว": "Fair", "ตัวเล็ก": "Petite",
          "ฟิวแฟน": "GFE", "ฟิลแฟน": "GFE", "เอาใจเก่ง": "Caring", "คุยสนุก": "Friendly",
          "สายฝอ": "Exotic", "อวบ": "Curvy", "ไม่เร่งรีบ": "Relaxed"
        };
        return tagMap[t] || t;
      });

    const defaultTag = isEN ? "#GFE" : "#ฟิวแฟน";
    const vibeTagsHtml = cleanTags.length > 0
      ? cleanTags.slice(0, 2).map(t => `<span class="card-vibe-pill">#${escapeHTML(t)}</span>`).join("")
      : `<span class="card-vibe-pill">${defaultTag}</span>`;

    const isFiwFan = rawTags.some(t => {
      const cleanTag = String(t).replace(/^#/, "").trim().toLowerCase();
      return cleanTag === "ฟิวแฟน" || cleanTag === "ฟิลแฟน" || cleanTag === "gfe" || cleanTag.includes("ฟิวแฟน");
    });

    let rightBadgeHtml = isFiwFan
      ? `<span class="badge-hot-tag"><span aria-hidden="true">🔥</span> HOT</span>` 
      : `<span class="badge-verified-top"><span aria-hidden="true">✦</span> ${isEN ? "Verified" : "ตรงปก"}</span>`;

    const viewProfileAria = isEN ? `View profile of ${modelName}` : `ดูโปรไฟล์ ${modelName}`;
    const richAltText = `${modelName} โซน${locName} ${p.provinceNameThai || 'เชียงใหม่'} - FirstModelHub`;

    const article = document.createElement("article");
    article.className = "profile-card-new interactive-card";
    article.setAttribute("data-profile-id", p.id);
    article.setAttribute("data-profile-slug", p.slug || p.id);
    article.style.cssText = "aspect-ratio: 3/4.2; display: flex; flex-direction: column;"; 

    article.innerHTML = `
      <img src="${imgSrc}" 
           alt="${escapeHTML(richAltText)}" 
           width="400" 
           height="560" 
           class="profile-card-img" 
           style="width: 100%; height: 100%; object-fit: cover; aspect-ratio: 400/560;" 
           loading="${index < 4 ? "eager" : "lazy"}" 
           fetchpriority="${index === 0 ? "high" : "auto"}" 
           decoding="async" 
           onerror="this.onerror=null; this.src='${DEFAULT_FALLBACK_IMG}';" />
           
      <div class="profile-card-gradient-overlay"></div>

      <div class="profile-card-badges-top">
          <div class="badges-left">
              <span class="badge-status ${statusClass}">
                  <span class="status-dot"></span>
                  <span>${availText}</span>
              </span>
          </div>
          <div class="badges-right">
              ${rightBadgeHtml}
          </div>
      </div>
      
      <a href="/sideline/${profileSlug}" class="card-link" aria-label="${escapeHTML(viewProfileAria)}"></a>

      <div class="profile-card-info-content">
          <div class="profile-card-tags-row">
              ${vibeTagsHtml}
          </div>
          
          <!-- Social Proof: ใช้ Class CSS แทน Inline Style เพื่อความสะอาดและโหลดไว -->
          <div class="profile-card-social-strip">
            
            <!-- ฝั่งซ้าย: ดาวทองคำเปลว -->
            <span class="social-badge-star">
              <span class="star-icon">★</span>
              <span>${(4.8 + ((parseInt(String(p.id).replace(/\D/g, "") || "1", 10) % 3) * 0.1)).toFixed(1)}</span>
              <span class="review-count">(${8 + (parseInt(String(p.id).replace(/\D/g, "") || "1", 10) % 17)})</span>
            </span>

            <!-- ฝั่งขวา: ยอดทักไลน์ -->
            <span class="social-badge-likes">
              <!-- สังเกตว่าผมเปลี่ยน stroke เป็น currentColor เพื่อให้มันดึงสีมาจาก CSS คลาสให้อัตโนมัติ -->
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>${(p.likes_count || p.likes || 0)} 💗</span>
            </span>

          </div>

          <div class="profile-card-title-row">
              <h3 class="profile-card-name">${escapeHTML(modelName)}</h3>
              ${ageDisplay ? `<span class="profile-card-age-tag">${ageDisplay}</span>` : ""}
          </div>
          <div class="profile-card-bottom-row">
              <span class="profile-card-location" title="${escapeHTML(rawLoc)}">
                  <i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${escapeHTML(locName)}
              </span>
              <span class="profile-card-price">${luxuryPrice}</span>
          </div>
      </div>
    `;
    container.appendChild(article);
    return container;
}

  async function renderProfilesBatch(containerEl, profilesList, renderId) {
    if (!containerEl || !profilesList) return;
    containerEl.dataset.activeRenderId = renderId;
    containerEl.innerHTML = "";

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < profilesList.length; i++) {
      if (renderId !== undefined && Number(containerEl.dataset.activeRenderId) !== renderId) return;
      const cardEl = createProfileCardDOM(profilesList[i], i);
      fragment.appendChild(cardEl);
    }
    containerEl.appendChild(fragment);
  }

  function createProvinceSectionDOM(provinceKey, provinceName, profilesList) {
    const wrapper = document.createElement("div");
    wrapper.className = "section-content-wrapper province-section";
    wrapper.id = `province-${provinceKey}`;
    wrapper.style.cssText = "margin-top: 36px; margin-bottom: 16px; width: 100%; box-sizing: border-box;";
    
    const displayTitle = isEN ? (PROVINCE_EN_MAP[provinceKey] || provinceName) : provinceName;
    const badgeText = `${profilesList.length} โปรไฟล์`;
    const headerPrefix = isEN ? `Models in` : `น้องๆ ในจังหวัด`;

    wrapper.innerHTML = `
      <div class="province-header-row">
          <a href="/location/${provinceKey}" class="province-title-link">
              <h2 class="province-clean-title">
                  <span class="province-pin-icon"><i class="fas fa-map-marker-alt" aria-hidden="true"></i></span>
                  <span class="province-prefix">${headerPrefix}</span>
                  <span class="province-name-highlight">${escapeHTML(displayTitle)}</span>
              </h2>
          </a>
          <a href="/location/${provinceKey}" class="province-count-pill">
              <span class="pulse-dot-el"></span>
              <span>${badgeText}</span>
              <i class="fas fa-chevron-right arrow-mini" aria-hidden="true"></i>
          </a>
      </div>
      <div class="profile-grid profiles-grid-row"></div>
    `;
    return wrapper;
  }

// ==============================================================================
  // 🟢 ระบบ LIGHTBOX MODAL & TOUCH GESTURES (สมบูรณ์แบบ 100% ไร้รอยต่อ)
  // ==============================================================================

  let currentActivePhotoIdx = 0;
  let currentActivePhotoList = [];
function updateLightboxPhoto(idx) {
    if (!currentActivePhotoList || currentActivePhotoList.length === 0) return;

    if (idx < 0) idx = currentActivePhotoList.length - 1;
    if (idx >= currentActivePhotoList.length) idx = 0;

    currentActivePhotoIdx = idx;
    const heroImg = document.getElementById("lightboxHeroImage");
    if (!heroImg) return;

    if (typeof triggerHaptic === "function") triggerHaptic("light");

    // ป้องกัน Error 100% ถ้า array ว่างหรือ object รูปไม่มีอยู่จริง
    const photoObj = currentActivePhotoList[idx] || {};
    const nextSrc = photoObj.fullSrc || photoObj.src || "https://firstmodelhub.com/images/firstmodelhub.webp";

    heroImg.style.opacity = "0.25";
    heroImg.style.transform = "scale(0.98)";
    
    // ตั้งค่า fallback เมื่อโหลดรูปผิดพลาด
    heroImg.onerror = function() {
      this.onerror = null;
      this.src = "https://firstmodelhub.com/images/firstmodelhub.webp";
    };

    setTimeout(() => {
      heroImg.src = nextSrc;
      heroImg.style.opacity = "1";
      heroImg.style.transform = "scale(1)";
    }, 110);

    const thumbStrip = document.getElementById("lightboxThumbnailStrip");
    if (thumbStrip) {
      thumbStrip.querySelectorAll(".lightbox-thumb-item").forEach((t, i) => {
        const isActive = (i === idx);
        t.classList.toggle("active", isActive);
        t.style.borderColor = isActive ? "#7C3AED" : "transparent";
        if (isActive) {
          t.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      });
    }

    const dotsContainer = document.getElementById("lightbox-dots-indicator");
    if (dotsContainer) {
      dotsContainer.querySelectorAll(".gallery-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === idx);
      });
    }
  }
  // ระบบตรวจจับการปัดรูปซ้าย-ขวา และแตะรูปสไตล์ Instagram
  function initLightboxImageSwipe() {
    const heroContainer = document.querySelector(".lightbox-hero-container");
    if (!heroContainer || heroContainer.dataset.swipeBound === "true") return;
    heroContainer.dataset.swipeBound = "true";

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    heroContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchEndX = touchStartX;
      touchEndY = touchStartY;
      isSwiping = false;
    }, { passive: true });

    heroContainer.addEventListener("touchmove", (e) => {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      if (Math.abs(diffX) > 15 && Math.abs(diffX) > Math.abs(diffY)) {
        isSwiping = true;
      }
    }, { passive: true });

    heroContainer.addEventListener("touchend", (e) => {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // 1. ตรวจจับการปัดนิ้วซ้าย / ขวา (Swipe)
      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
        if (diffX < 0) {
          updateLightboxPhoto(currentActivePhotoIdx + 1); // ปัดซ้าย -> รูปถัดไป
        } else {
          updateLightboxPhoto(currentActivePhotoIdx - 1); // ปัดขวา -> รูปก่อนหน้า
        }
      } 
      // 2. ตรวจจับการแตะที่รูปสไตล์ Instagram (Tap Left = Prev, Tap Right = Next)
      else if (!isSwiping && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
        if (e.target.closest(".lightbox-dots-wrapper, .lightbox-top-brand, .lightbox-close-circle-btn, .sheet-drag-pill-bar")) {
          return;
        }
        if (!currentActivePhotoList || currentActivePhotoList.length <= 1) return;
        const rect = heroContainer.getBoundingClientRect();
        const tapX = touchEndX - rect.left;
        if (tapX < rect.width * 0.35) {
          updateLightboxPhoto(currentActivePhotoIdx - 1);
        } else {
          updateLightboxPhoto(currentActivePhotoIdx + 1);
        }
      }
    }, { passive: true });

    // รองรับการคลิกเปลี่ยนรูปบนคอมพิวเตอร์
    heroContainer.addEventListener("click", (e) => {
      if (e.target.closest(".lightbox-dots-wrapper, .lightbox-top-brand, .lightbox-close-circle-btn, .sheet-drag-pill-bar")) {
        return;
      }
      if (!currentActivePhotoList || currentActivePhotoList.length <= 1) return;
      const rect = heroContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width * 0.35) {
        updateLightboxPhoto(currentActivePhotoIdx - 1);
      } else {
        updateLightboxPhoto(currentActivePhotoIdx + 1);
      }
    });
  }
  
// 🟢 ฟังก์ชันสร้างกล่องแนะนำตัว Persona แบบเดียวกับ render-bot.js
function generateModalPersonaBox(profile, displayName, provName, zoneName) {
  let rawPersonalDesc = sanitizeThaiText(profile.description || "")
    .replace(/เรทราคา|รายละเอียดค่ะ|1500\/1|มัดจำ/gi, "")
    .replace(/[ฃ͡➴˚˳*•ㅅ•づ♡]+/g, "")
    .trim();

  const speechText = (rawPersonalDesc.length >= 8) 
    ? rawPersonalDesc 
    : "ยินดีที่ได้รู้จักค่ะ ทักมาพูดคุยสอบถามคิวหรือนัดเวลาล่วงหน้าได้เลยนะคะ เทคแคร์เป็นกันเอง ไม่ดุค่ะ";

  const profileIdStr = String(profile.id || "1");
  const isVariantB = profileIdStr.charCodeAt(profileIdStr.length - 1) % 2 === 0;

  const introText = isVariantB 
    ? "รายละเอียดส่วนตัว สัดส่วน และพิกัดบริการอัปเดตล่าสุด น้องน่ารัก นิสัยเฟรนด์ลี่ พูดเพราะ และดูแลเอาใจใส่เป็นอย่างดี สบายใจได้กับการนัดพบตัวจริงแล้วค่อยชำระค่าบริการตรงหน้างาน ไม่มีมัดจำล่วงหน้า"
    : "ข้อมูลโปรไฟล์และสัดส่วนได้รับการตรวจสอบและยืนยันตัวตนเรียบร้อยแล้ว น้องเป็นคนอารมณ์ดี คุยสนุก และให้ความเป็นกันเอง มั่นใจได้เรื่องความปลอดภัยด้วยระบบนัดเจอตรวจสอบความถูกต้องหน้างานก่อนชำระเงิน";

  const styleText = isVariantB
    ? "สไตล์เพื่อนสนิท: นิสัยขี้อ้อน อัธยาศัยดี ชวนคุยเก่ง เน้นการดูแลเอาใจใส่ที่ทำให้คุณรู้สึกผ่อนคลายและเป็นกันเองตลอดการนัดหมาย"
    : "เน้นฟิวแฟน: สุภาพ อ่อนโยน เทคแคร์ดี และไม่เร่งรีบในระหว่างเวลางาน เหมาะสำหรับเดินเที่ยว ทานข้าว คาเฟ่ หรือเป็นเพื่อนร่วมเดินทาง";

  const locationText = isVariantB
    ? `การเดินทาง: ประจำการอยู่ในพื้นที่${zoneName} สามารถเดินทางไปหาที่โรงแรมหรือคอนโดส่วนตัวของคุณได้ทันที ตกลงเรื่องพิกัดและเวลาที่สะดวกก่อนเริ่มงานได้เลย`
    : `พื้นที่ให้บริการ: มีห้องพักส่วนตัวในทำเล${zoneName} หรือพร้อมเดินทางไปดูแลคุณถึงโรงแรม คอนโด และที่พักในย่านใกล้เคียงอย่างรวดเร็วและมิดชิด`;

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

  window.openLightboxModal = function (profile) {
    if (!profile) return;
    const lightboxEl = document.getElementById("lightbox");
    const contentWrapperEl = document.getElementById("lightbox-content-wrapper-el");
    if (!lightboxEl) return;

    // 🔒 1. ประกาศตัวแปรหลักและ Fallback ป้องกัน ReferenceError 100%
    const fallbackImg = (typeof DEFAULT_FALLBACK_IMG !== "undefined") 
      ? DEFAULT_FALLBACK_IMG 
      : "https://firstmodelhub.com/images/firstmodelhub.webp";

    const isEn = document.documentElement.lang === "en" || window.location.pathname.includes("-en");
    const cleanName = (profile.name || "สาวสวย").replace(/^(น้อง\s?)+/gi, "").trim();
    const displayName = isEn ? cleanName : `น้อง${cleanName}`;
    const pProvinceThai = profile.provinceThai || profile.provinceNameThai || "เชียงใหม่";
    const pProvText = pProvinceThai; 
    const pLocation = profile.location || pProvinceThai;
    const pLocText = pLocation;     
    const primaryZone = pLocation.replace(/^(ในตัวเมือง|ตัวเมือง|โซน|ย่าน)\s*(\/|และ)?\s*/gi, "").split(/[,/]|และใกล้/)[0].trim() || pProvText;
    const profileSlug = encodeURIComponent(profile.slug || profile.id);
    const canonicalProfileUrl = `https://firstmodelhub.com/sideline/${profileSlug}`;

   const dynamicTitle = isEn
  ? `${displayName} - VIP Companion in ${pProvText} | FirstModelHub`
  : `${displayName} รับงาน${pProvText} ไซด์ไลน์ (${primaryZone}) ตรงปก 100% | FirstModelHub`;

    const canonicalLink = document.getElementById("canonical-link") || document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.href = canonicalProfileUrl;
    }

    const dynamicDesc = isEn
      ? `${displayName} verified companion in ${pLocText}, ${pProvText}. Romantic Girlfriend Experience (GFE), 100% real photos, pay on arrival.`
      : `${displayName} เพื่อนเที่ยวสไตล์ฟิวแฟน (GFE) พิกัด ${pLocText} จ.${pProvText} สัดส่วน ${profile.safeStats || profile.stats || "ตรงปก"} การันตีตัวจริง 100% ปลอดภัยนัดพบจ่ายหน้างาน ไร้มัดจำ`;

    const metaDescEl = document.querySelector('meta[name="description"]');
    if (metaDescEl) metaDescEl.setAttribute("content", dynamicDesc);

    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute("content", dynamicTitle);

    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute("content", dynamicDesc);

    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (ogUrlEl) ogUrlEl.setAttribute("content", canonicalProfileUrl);

    const heroImgUrl = (profile.images && profile.images[0] && (profile.images[0].fullSrc || profile.images[0].src)) || profile.imagePath || fallbackImg;
    const ogImgEl = document.querySelector('meta[property="og:image"]');
    if (ogImgEl) ogImgEl.setAttribute("content", heroImgUrl);

    // 🟢 3. ตรวจสอบสถานะรับงาน
    const isAvail = profile.isAvailable !== undefined
      ? Boolean(profile.isAvailable)
      : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "busy", "off"].some(s => String(profile.availability || "").toLowerCase().includes(s));
    
    const availStatus = isEn 
      ? (isAvail ? "Available Now" : "Inquire Schedule") 
      : (profile.availability || (isAvail ? "พร้อมรับงาน" : "สอบถามคิว"));
      
    const statusColor = isAvail ? "#059669" : "#E11D48";

    // 🟢 4. ชื่อ และ ป้ายสถานะ
    const nameMainEl = document.getElementById("lightbox-profile-name-main");
    if (nameMainEl) {
      nameMainEl.innerHTML = `
        <span style="font-size: clamp(20px, 5vw, 24px) !important; font-weight: 900 !important; background: linear-gradient(135deg, #140F22 0%, #E11D48 100%) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;">${displayName}</span>
        ${profile.isVerified ? '<i class="fas fa-check-circle" style="color: #059669; margin-left: 6px; font-size: 16px;" title="Verified Profile"></i>' : ""}
      `;
    }

    const availBadgeWrapper = document.getElementById("lightbox-availability-badge-wrapper");
    if (availBadgeWrapper) {
      availBadgeWrapper.innerHTML = `
        <span style="background: #F0ECF8; border: 1px solid rgba(0,0,0,0.06); padding: 4px 12px; border-radius: 100px; display: inline-flex; align-items: center; gap: 6px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: ${statusColor};"></span>
            <span style="color: ${statusColor}; font-size: 11px; font-weight: 800;">${availStatus}</span>
        </span>
      `;
    }

    // 🟢 5. จัดการรูปภาพใหญ่, Thumbnails และจุดไข่ปลา (Dots Swipe สไตล์ IG)
    const images = Array.isArray(profile.images) && profile.images.length > 0
      ? profile.images
      : [{ src: fallbackImg, fullSrc: fallbackImg }];

    currentActivePhotoList = images;
    currentActivePhotoIdx = 0;

   // 🟢 ใหม่: บังคับใช้ขนาด 600x800 พอดีหน้าจอมือถือ + เพิ่ม onerror สลับใช้รูปสำรองทันทีถ้าเน็ตสะดุด
const heroImg = document.getElementById("lightboxHeroImage");
if (heroImg) {
  // สลับมาใช้ไซส์ 600x800 แทน 1200px เพื่อให้โหลดเร็วขึ้น 70%
  const optimizedModalSrc = images[0]?.src 
    ? images[0].src.replace("w_400,h_560", "w_600,h_800") 
    : (images[0]?.fullSrc || fallbackImg);

  // ดักจับรูปพัง: ถ้าภาพหลักมีปัญหา ให้ดีดกลับไปใช้รูปสำรองทันที ป้องกันจอดำ 100%
  heroImg.onerror = function() {
    this.onerror = null;
    this.src = images[0]?.src || fallbackImg;
  };

  heroImg.src = optimizedModalSrc;
 heroImg.alt = `${displayName} เพื่อนเที่ยวฟิวแฟน${pProvText} โซน${primaryZone} ตรงปก 100% - FirstModelHub`;
  heroImg.style.transition = "opacity 0.2s ease, transform 0.2s ease";
  heroImg.style.transform = "scale(1)";
  heroImg.style.opacity = "1";
}

    // 5.2 🟢 เรนเดอร์แถบ Thumbnails ใต้รูปใหญ่ (มีระบบปัดเลื่อนแนวนอน + แตะสลับรูป)
    const thumbStrip = document.getElementById("lightboxThumbnailStrip");
    if (thumbStrip) {
      if (images.length > 1) {
        thumbStrip.style.cssText = "display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding: 2px 2px 6px 2px; -webkit-overflow-scrolling: touch; scrollbar-width: none;";
        thumbStrip.innerHTML = images.map((img, i) => `
          <div class="lightbox-thumb-item ${i === 0 ? "active" : ""}" data-thumb-idx="${i}" style="width: 58px; height: 76px; border-radius: 10px; overflow: hidden; flex-shrink: 0; cursor: pointer; border: 2px solid ${i === 0 ? "#7C3AED" : "transparent"}; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: border-color 0.2s ease, transform 0.15s ease;">
            <img src="${img.src || fallbackImg}" alt="${displayName} รูปที่ ${i + 1}" width="58" height="76" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
          </div>
        `).join("");

        // ผูก Event แตะที่รูปย่อยเพื่อเปลี่ยนรูปใหญ่
        thumbStrip.querySelectorAll(".lightbox-thumb-item").forEach(item => {
          item.addEventListener("click", function(e) {
            e.stopPropagation();
            const idx = parseInt(this.getAttribute("data-thumb-idx"), 10);
            if (typeof updateLightboxPhoto === "function") {
              updateLightboxPhoto(idx);
            }
          });
        });
      } else {
        // หากมีเพียงรูปเดียว ไม่ต้องแสดงแถบรูปย่อย
        thumbStrip.innerHTML = "";
        thumbStrip.style.display = "none";
      }
    }

    // 5.3 สร้างจุดไข่ปลา (Dots Indicator) ซ้อนเหนือรูปภาพสไตล์ Instagram
    const heroContainer = document.querySelector(".lightbox-hero-container");
    let dotsContainer = document.getElementById("lightbox-dots-indicator");
    if (heroContainer) {
      if (!dotsContainer) {
        dotsContainer = document.createElement("div");
        dotsContainer.id = "lightbox-dots-indicator";
        dotsContainer.className = "lightbox-dots-wrapper";
        heroContainer.appendChild(dotsContainer);
      }

      if (images.length > 1) {
        dotsContainer.style.setProperty("display", "flex", "important");
        dotsContainer.innerHTML = images.map((_, i) => `
          <span class="gallery-dot ${i === 0 ? "active" : ""}" data-idx="${i}" aria-label="ดูรูปที่ ${i + 1}"></span>
        `).join("");

        // กดแตะที่จุดไข่ปลาเพื่อเปลี่ยนรูปได้ทันที
        dotsContainer.querySelectorAll(".gallery-dot").forEach((dot) => {
          dot.addEventListener("click", (e) => {
            e.stopPropagation();
            const idx = parseInt(dot.getAttribute("data-idx"), 10);
            if (typeof updateLightboxPhoto === "function") {
              updateLightboxPhoto(idx);
            }
          });
        });
      } else {
        dotsContainer.style.setProperty("display", "none", "important");
      }
    }


    // 🟢 ใหม่: ถ้าเป็นคำสั้นกุด (น้อยกว่า 15 ตัวอักษร) ให้ซ่อนกล่องนี้ไปเลย เพื่อให้หน้าเว็บคลีนตา
const quoteEl = document.getElementById("lightboxQuote");
if (quoteEl) {
  const quoteText = (profile.quote || profile.slogan || "").trim();
  if (quoteText.length > 15 && !quoteText.includes("รับงาน")) {
    quoteEl.textContent = quoteText;
    quoteEl.style.display = "block";
  } else {
    quoteEl.style.display = "none"; // สั่งซ่อนทันที ไม่แสดงกล่องหลุด
  }
}

    const tagsEl = document.getElementById("lightboxTags");
    if (tagsEl) {
      tagsEl.innerHTML = "";
      (Array.isArray(profile.styleTags) ? profile.styleTags : []).forEach(tag => {
        const pill = document.createElement("span");
        pill.className = "lightbox-tag-pill";
        pill.textContent = tag.startsWith("#") ? tag : `#${tag}`;
        tagsEl.appendChild(pill);
      });
    }

    // 🟢 7. สเปก 3 ช่อง + กล่องค่าขนม/พิกัดงาน
    const safeAge = profile.safeAgeDisplay || (profile.age ? `${profile.age} ปี` : "ไม่ระบุ");
    const safeStats = profile.safeStats || profile.stats || "ไม่ระบุ";
    const safeHeight = profile.safeHeight || (profile.height ? `${profile.height} cm` : "ไม่ระบุ");
    const displayPrice = profile.displayPrice || (profile.rate ? `${parseInt(profile.rate, 10).toLocaleString()}.-` : "1,500.-");

    const labelAge = isEn ? "Age" : "อายุ";
    const labelStats = isEn ? "Stats" : "สัดส่วน";
    const labelHeight = isEn ? "Height" : "ส่วนสูง";
    const labelPrice = isEn ? "Rate" : "ค่าขนม";
    const labelLocation = isEn ? "Location" : "พิกัดงาน";

    const detailsCompactEl = document.getElementById("lightboxDetailsCompact");
    if (detailsCompactEl) {
      detailsCompactEl.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px;">
            <div class="bento-stat-tile" style="background: #F0ECF8; border-radius: 14px; padding: 10px 4px; text-align: center;">
                <div style="font-size: 10.5px; color: #827894; font-weight: 700;">${labelAge}</div>
                <div style="font-weight: 900; font-size: 14px; color: #140F22; margin-top: 2px;">${safeAge}</div>
            </div>
            <div class="bento-stat-tile" style="background: #F0ECF8; border-radius: 14px; padding: 10px 4px; text-align: center;">
                <div style="font-size: 10.5px; color: #827894; font-weight: 700;">${labelStats}</div>
                <div style="font-weight: 900; font-size: 14px; color: #140F22; margin-top: 2px;">${safeStats}</div>
            </div>
            <div class="bento-stat-tile" style="background: #F0ECF8; border-radius: 14px; padding: 10px 4px; text-align: center;">
                <div style="font-size: 10.5px; color: #827894; font-weight: 700;">${labelHeight}</div>
                <div style="font-weight: 900; font-size: 14px; color: #140F22; margin-top: 2px;">${safeHeight}</div>
            </div>
        </div>

        <div style="background: #F0ECF8; padding: 12px 14px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #4A4458; font-size: 12px; font-weight: 700;"><i class="fas fa-tag" style="color:#7C3AED; margin-right:4px;"></i> ${labelPrice}</span>
                <span style="color: #059669; font-weight: 900; font-size: 15px;">${displayPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(0,0,0,0.08); padding-top: 6px;">
                <span style="color: #4A4458; font-size: 12px; font-weight: 700;"><i class="fas fa-map-marker-alt" style="color:#7C3AED; margin-right:4px;"></i> ${labelLocation}</span>
                <span style="color: #140F22; font-weight: 800; font-size: 12.5px;">${pLocation}</span>
            </div>
        </div>
      `;
    }

    
    const descContainer = document.getElementById("lightboxDescriptionContainer");
const descContent = document.getElementById("lightboxDescriptionContent");

if (descContent) {
  descContent.innerHTML = generateModalPersonaBox(profile, displayName, pProvText, primaryZone);
  descContent.style.cssText = "margin: 10px 0;";
  if (descContainer) descContainer.style.display = "block";
}
  
  
    
    // 🟢 9. ปุ่มแอดไลน์จองคิวหลัก (Universal Link สำหรับ iOS/Android ทุกเวอร์ชัน)
    const rawLine = String(profile.line_id || profile.lineId || profile.line || "").trim();
    let lineUrl = "https://line.me/ti/p/u8Bz9HsaY8"; // Fallback ปลอดภัย

    if (rawLine) {
      if (rawLine.startsWith("http://") || rawLine.startsWith("https://")) {
        // ถ้าเป็นลิงก์เต็มมาแล้ว (เช่น https://lin.ee/... หรือ https://line.me/...) ใช้ได้ทันที
        lineUrl = rawLine;
      } else {
        const cleanHandle = rawLine.trim();
        if (cleanHandle.startsWith("@")) {
          // 1. กรณีเป็น LINE Official (มี @): ใช้ page.line.me แบบไม่เอา @
          const cleanOa = cleanHandle.replace(/^@+/, "").trim();
          if (cleanOa) lineUrl = `https://page.line.me/${cleanOa}`;
        } else {
          // 2. กรณีเป็น ID ส่วนบุคคล: ใช้ format https://line.me/R/ti/p/~ID (มี ~ คั่น)
          const cleanPersonalId = cleanHandle.replace(/[^a-zA-Z0-9_\-\.]/g, "");
          if (cleanPersonalId) lineUrl = `https://line.me/R/ti/p/~${cleanPersonalId}`;
        }
      }
    }

    const lineWrapper = document.getElementById("line-btn-sticky-wrapper");
    if (lineWrapper) {
      const lineBtnText = isEn ? `Book ${displayName}` : `ทัก LINE จองคิวน้อง${cleanName}`;

      lineWrapper.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
            

<a href="${lineUrl}" target="_blank" rel="noopener nofollow" onclick="window.trackLineClick('${profile.id}')" class="lightbox-line-cta" style="flex: 1; margin: 0; display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; overflow: hidden; padding: 12px 14px;">
    <i class="fab fa-line" style="font-size: 18px; flex-shrink: 0;"></i>
    <span style="font-size: 13.5px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lineBtnText}</span>
    <span style="font-size: 10.5px; background: rgba(0,0,0,0.25); padding: 2px 7px; border-radius: 100px; font-weight: 700; flex-shrink: 0;">จ่ายหน้างาน</span>
</a>

          
          <button type="button" onclick="window.shareProfile('${escapeHTML(displayName)}', '${canonicalProfileUrl}')" aria-label="แชร์โปรไฟล์" style="width: 48px; height: 48px; border-radius: 14px; background: #F8F6FC; border: 1.5px solid rgba(124, 58, 237, 0.2); color: #7C3AED; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.05); transition: transform 0.15s ease;" onmousedown="this.style.transform='scale(0.92)'" onmouseup="this.style.transform='scale(1)'">
              <i class="fas fa-share-alt" style="font-size: 16px;"></i>
          </button>
        </div>
      `;
    }

    const parseFn = window.parseRateToNumber || (typeof parseRateToNumber === "function" ? parseRateToNumber : ((r) => 1500));
    const rateNum = parseFn(profile._price || profile.rate || profile.price);

    // 💰 10. ตารางเรทราคา 3 ช่อง (ปัดเศษให้เป็นเลขกลมสวยงาม)
    const ratesGrid = document.getElementById("lightboxRatesGrid");
    if (ratesGrid) {
      // คำนวณราคาให้ลงท้ายด้วยหลักร้อย และหลักห้าร้อยที่ลงตัว
      const rate2Hrs = Math.round((rateNum * 1.8) / 100) * 100;
      const rateOvernight = Math.round((rateNum * 4.5) / 500) * 500;

      ratesGrid.innerHTML = `
        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 10px 4px; border-radius: 12px;">
          <div style="color: #64748B; font-size: 11px; font-weight: 800; margin-bottom: 2px;">1 ชม.</div>
          <strong style="color: #059669; font-size: 14.5px; font-weight: 900;">${rateNum.toLocaleString()}.-</strong>
        </div>
        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 10px 4px; border-radius: 12px;">
          <div style="color: #64748B; font-size: 11px; font-weight: 800; margin-bottom: 2px;">2 ชม.</div>
          <strong style="color: #059669; font-size: 14.5px; font-weight: 900;">${rate2Hrs.toLocaleString()}.-</strong>
        </div>
        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 10px 4px; border-radius: 12px;">
          <div style="color: #64748B; font-size: 11px; font-weight: 800; margin-bottom: 2px;">ค้างคืน</div>
          <strong style="color: #059669; font-size: 14.5px; font-weight: 900;">${rateOvernight.toLocaleString()}.-</strong>
        </div>
      `;
    }

    // 🟢 ซ่อนกล่อง FAQ ใน Lightbox ทันที (หน้าต่างจะกระชับ คลีนตา ปิดการขายไวขึ้น)
    const faqSection = document.getElementById("lightboxFaqSection");
    if (faqSection) faqSection.style.display = "none";
    

    // 🎀 13. น้องๆ แนะนำเพิ่มเติมในโซนเดียวกัน
    const relatedTitle = document.getElementById("lightboxRelatedTitle");
    if (relatedTitle) relatedTitle.textContent = isEn ? `Recommended Models in ${pProvText}` : `น้องๆ แนะนำเพิ่มเติมในโซน${pProvText}`;
    
    const relatedGrid = document.getElementById("lightboxRelatedGrid");
    const relatedMore = document.getElementById("lightboxRelatedMoreLink");
    if (relatedGrid) {
      const allList = (typeof appState !== "undefined" && appState.allProfiles && appState.allProfiles.length > 0) 
        ? appState.allProfiles 
        : (window.profilesData || []);
      const pKey = (profile.provinceKey || "chiangmai").toLowerCase();

      let candidates = allList.filter(m => String(m.id) !== String(profile.id) && (m.provinceKey || "").toLowerCase() === pKey);

      if (candidates.length < 6) {
        const otherProvinces = allList.filter(m => String(m.id) !== String(profile.id) && !candidates.some(c => String(c.id) === String(m.id)));
        candidates = [...candidates, ...otherProvinces];
      }

      const shuffledList = [...candidates].sort(() => Math.random() - 0.5);
      const relatedList = shuffledList.slice(0, 6);

      if (relatedList.length > 0) {
        relatedGrid.innerHTML = relatedList.map(rm => {
          const rmName = rm.displayName || ((typeof formatDisplayName === "function") ? formatDisplayName(rm.name) : rm.name);
          const rmImg = rm.images && rm.images[0] ? (rm.images[0].src || rm.images[0]) : (rm.imagePath || fallbackImg);
          return `
            <div class="lightbox-related-item" data-profile-slug="${rm.slug || rm.id}" style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1.5px solid rgba(124, 58, 237, 0.12); display: block; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.03); cursor: pointer; transition: transform 0.2s;">
              <img src="${rmImg}" alt="${rmName} สาวรับงาน${pProvText}" loading="lazy" style="width: 100%; aspect-ratio: 4/5; object-fit: cover;">
              <div style="padding: 6px 2px; font-size: 11px; font-weight: 800; color: #140F22;">${rmName}</div>
            </div>
          `;
        }).join("");

        relatedGrid.querySelectorAll(".lightbox-related-item").forEach(card => {
          card.addEventListener("click", function(e) {
            e.preventDefault();
            const targetSlug = this.getAttribute("data-profile-slug");
            const targetProfile = allList.find(m => String(m.slug) === String(targetSlug) || String(m.id) === String(targetSlug));
            if (targetProfile) {
              history.pushState(null, "", `/sideline/${encodeURIComponent(targetProfile.slug || targetProfile.id)}`);
              const scrollBody = document.getElementById("lightboxScrollBody") || document.querySelector(".lightbox-scroll-body");
              if (scrollBody) scrollBody.scrollTop = 0;
              window.openLightboxModal(targetProfile);
            }
          });
        });
      } else {
        relatedGrid.innerHTML = '<div style="grid-column: span 3; font-size: 11px; color: #827894; text-align: center;">ไม่มีโปรไฟล์แนะนำเพิ่มเติมในขณะนี้</div>';
      }
    }

    if (relatedMore) {
 const zoneLinkUrl = primaryZone.includes("นิมมาน") ? "/nimman" : `/location/${profile.provinceKey || "chiangmai"}/${primaryZone}`;

  relatedMore.innerHTML = `
    <a href="${zoneLinkUrl}" style="color: #7C3AED; font-size: 11.5px; font-weight: 800; text-decoration: none;">
      ${isEn ? `View all models in ${primaryZone} →` : `ดูน้องๆ รับงานโซน${primaryZone} (${pProvText}) ทั้งหมด →`}
    </a>
  `;
}


 
    if (typeof gtag === "function") {
      gtag("event", "page_view", {
        page_title: dynamicTitle,
        page_location: canonicalProfileUrl,
        page_path: `/sideline/${profileSlug}`
      });
    }

    // 🟢 14. สั่น Haptic + เด้งสปริง 60 FPS + ล็อกพื้นหลังไม่ให้เลื่อนตาม
    if (typeof triggerHaptic === "function") triggerHaptic("medium");
    lightboxEl.style.display = "flex";
    lightboxEl.style.pointerEvents = "auto";
    lightboxEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    const scrollBodyEl = document.getElementById("lightboxScrollBody");
    if (scrollBodyEl) scrollBodyEl.scrollTop = 0;

    requestAnimationFrame(() => {
      lightboxEl.classList.add("active");
      lightboxEl.style.opacity = "1";
      if (contentWrapperEl) {
        contentWrapperEl.style.transform = "translateY(0) scale(1)";
        contentWrapperEl.style.opacity = "1";
      }
    });
  };

  
 window.closeLightboxModal = function (updateHistory = true) {
    const lightboxEl = document.getElementById("lightbox");
    const contentWrapperEl = document.getElementById("lightbox-content-wrapper-el");
    if (!lightboxEl) return;

    if (lightboxEl.dataset.isClosing === "true") return;
    lightboxEl.dataset.isClosing = "true";

    if (contentWrapperEl) {
      contentWrapperEl.style.transition = "transform 0.24s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease";
      contentWrapperEl.style.transform = "translateY(40px) scale(0.97)";
      contentWrapperEl.style.opacity = "0";
    }
    lightboxEl.style.transition = "opacity 0.24s ease";
    lightboxEl.style.opacity = "0";

    document.body.classList.remove("lightbox-open");
    document.body.style.overflow = "";

    setTimeout(() => {
      lightboxEl.style.display = "none";
      lightboxEl.classList.remove("active");
      lightboxEl.style.pointerEvents = "none";
      lightboxEl.setAttribute("aria-hidden", "true");
      lightboxEl.dataset.isClosing = "false";

      const scrollBody = document.getElementById("lightboxScrollBody");
      if (scrollBody) scrollBody.scrollTop = 0;
    }, 240);

    if (updateHistory && (window.location.pathname.includes("/profile/") || window.location.pathname.includes("/sideline/"))) {
      const slug = window.currentProvinceSlug || (domCache.provinceSelect && domCache.provinceSelect.value) || "";
      const canonicalLink = document.getElementById("canonical-link") || document.querySelector('link[rel="canonical"]');
      const defaultHeroImg = (typeof DEFAULT_FALLBACK_IMG !== "undefined") ? DEFAULT_FALLBACK_IMG : "https://firstmodelhub.com/images/firstmodelhub.webp";

      let targetUrl = "";
      let targetTitle = "";
      let targetDesc = "";

     if (slug && slug !== "national" && slug !== "all") {
        // 🟢 ถ้าเปิดดูหน้ารายย่านอยู่ ให้รักษา URL ย่านเดิมไว้ ไม่ดีดกลับไปหน้าจังหวัดหลัก
        if (window.currentZoneSlug) {
          targetUrl = `/location/${slug}/${window.currentZoneSlug}`;
        } else {
          targetUrl = `/location/${slug}`;
        }
        const provName = (appState.provincesMap && appState.provincesMap.get(slug)) || "เชียงใหม่";

        targetTitle = isEN ? `${provName} Escorts & Companions | FirstModelHub` : `ไซด์ไลน์${provName} สาวรับงาน${provName} ฟิวแฟนตรงปก ไม่มัดจำ | First Model Hub`;

        targetDesc = isEN
          ? `Verified escorts & companions in ${provName}. Romantic Girlfriend Experience, pay on arrival.`
          : `🟢 นัดเจอจ่ายหน้างาน ไม่มีมัดจำ! รวมโปรไฟล์ไซด์ไลน์${provName} สาวรับงานฟิวแฟน ตัวจริงตรงปก 100% สแตนด์บายพร้อมดูแล ทักไลน์สอบถามคิวได้ตลอด 24 ชม.`;

        if (domCache.provinceSelect) domCache.provinceSelect.value = slug;
      } else {
        targetUrl = isEN ? "/index-en" : "/";
        
        targetTitle = isEN 
          ? "Thailand Escorts & VIP Companions | FirstModelHub" 
          : "ไซด์ไลน์ทั่วไทย รับงานทั่วไทย เด็กเอ็น ฟิวแฟนตรงปก จ่ายหน้างาน | FirstModelHub";

        const liveCount = appState.allProfiles?.length || window.profilesData?.length || 0;
        
    const liveProvinces = (appState.provincesMap && appState.provincesMap.size > 0)
      ? appState.provincesMap.size
      : ((window.provincesData && window.provincesData.length > 0) ? window.provincesData.length : 1);

        targetDesc = isEN
          ? "Premium VIP companions and escorts across Thailand. 100% real photos, pay on arrival."
          : `🛡️ ปลอดภัยจ่ายหน้างาน ไม่โอนมัดจำ 100% รวม ${liveCount}+ โปรไฟล์ไซด์ไลน์ทั่วไทย สาวรับงาน เด็กเอ็น สไตล์ฟิวแฟน ตรงปก นัดเจอง่ายใน ${liveProvinces} จังหวัด พร้อมสแตนด์บาย ทักไลน์ได้ 24 ชม.`;
     
        if (domCache.provinceSelect) domCache.provinceSelect.value = "";
      }

      history.replaceState(null, "", targetUrl);

      document.title = targetTitle;
      const fullCanonical = `https://firstmodelhub.com${targetUrl === "/" ? "" : targetUrl}`;
      if (canonicalLink) canonicalLink.href = fullCanonical;

      const metaDescEl = document.querySelector('meta[name="description"]');
      if (metaDescEl) metaDescEl.setAttribute("content", targetDesc);

      const ogTitleEl = document.querySelector('meta[property="og:title"]');
      if (ogTitleEl) ogTitleEl.setAttribute("content", targetTitle);

      const ogDescEl = document.querySelector('meta[property="og:description"]');
      if (ogDescEl) ogDescEl.setAttribute("content", targetDesc);

      const ogUrlEl = document.querySelector('meta[property="og:url"]');
      if (ogUrlEl) ogUrlEl.setAttribute("content", fullCanonical);

      const ogImgEl = document.querySelector('meta[property="og:image"]');
      if (ogImgEl) ogImgEl.setAttribute("content", defaultHeroImg);

      // 🟢 จุดที่เติมเพิ่ม: ยิง Pageview คืนค่าหน้าหลัก/หน้าจังหวัดให้ Google Analytics (GA4)
      if (typeof gtag === "function") {
        gtag("event", "page_view", {
          page_title: targetTitle,
          page_location: fullCanonical,
          page_path: targetUrl
        });
      }
    }

    appState.currentProfileSlug = null;
  };

  
  function initLightboxSwipeDown() {
    const lightboxEl = document.getElementById("lightbox");
    const contentEl = document.getElementById("lightbox-content-wrapper-el");
    const dragBar = document.getElementById("lightbox-drag-bar");
    const scrollBody = document.getElementById("lightboxScrollBody");
    if (!lightboxEl || !contentEl) return;

    initLightboxImageSwipe();

    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let isEligible = false;

    contentEl.addEventListener("touchstart", (e) => {
      // 🔒 ยอมให้ลากปิดได้เฉพาะแตะที่ Drag Bar หัวภาพ หรือตอนที่สกอร์อยู่บนสุดเท่านั้น
      const isFromDragBar = dragBar && (dragBar.contains(e.target) || e.target === dragBar);
      const isAtTop = !scrollBody || scrollBody.scrollTop <= 0;
      const isHeaderArea = e.target.closest(".lightbox-top-brand") || e.target.closest(".sheet-drag-pill-bar");

      if (isFromDragBar || (isAtTop && isHeaderArea)) {
        isEligible = true;
        startY = e.touches[0].clientY;
        currentY = startY;
      } else {
        isEligible = false;
      }
    }, { passive: true });

    contentEl.addEventListener("touchmove", (e) => {
      if (!isEligible) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0) {
        if (e.cancelable) e.preventDefault();
        isDragging = true;
        contentEl.style.transition = "none";
        const resistanceY = Math.pow(deltaY, 0.88);
        contentEl.style.transform = `translateY(${resistanceY}px)`;
      }
    }, { passive: false });

    contentEl.addEventListener("touchend", () => {
      if (!isEligible || !isDragging) return;
      const deltaY = currentY - startY;
      isDragging = false;
      isEligible = false;
      contentEl.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)";

      // ต้องตั้งใจรูดลงเกิน 110px ถึงจะปิดหน้าต่าง
      if (deltaY > 110) {
        if (typeof triggerHaptic === "function") triggerHaptic("light");
        window.closeLightboxModal(true);
      } else {
        contentEl.style.transform = "translateY(0)";
      }
    }, { passive: true });
  }

  // เก็บฟังก์ชันเปล่าที่ปลอดภัยไว้ ป้องกันโค้ดจุดอื่นฟ้อง Error
function hideGlobalLoader() {
  const loader = document.getElementById("global-loader-overlay");
  if (loader) loader.style.display = "none";
}

  
async function handleUrlRouting(isInitial = false) {
  let rawPath = window.location.pathname.replace(/\/+$/, "") || "/";

  // 🟢 ตรวจสอบหน้าโปรไฟล์เดี่ยว (เปิดแกลเลอรีรูปภาพ + Dock แล้วจบการทำงาน)
    const isStandaloneProfile = document.querySelector('article.interactive-card') && !document.getElementById('profiles-display-area');
    if (isStandaloneProfile) {
        hideGlobalLoader();
        initDockAutoHide();
        
        // ⚡ ผูกระบบคลิกเปลี่ยนรูปภาพในอัลบั้มสำหรับหน้าโปรไฟล์เดี่ยว (60 FPS)
        const galleryStrip = document.getElementById('profile-gallery-strip');
        const mainProfileImg = document.getElementById('main-profile-img');
        if (galleryStrip && mainProfileImg) {
            galleryStrip.addEventListener('click', (e) => {
                const btn = e.target.closest('.thumb-slot');
                if (!btn) return;
                
                if (typeof triggerHaptic === 'function') triggerHaptic('light');
                const fullSrc = btn.getAttribute('data-full-src');
                if (fullSrc) {
                    mainProfileImg.style.opacity = '0.3';
                    mainProfileImg.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        mainProfileImg.src = fullSrc;
                        mainProfileImg.removeAttribute('srcset'); // ลบ srcset เพื่อให้เบราว์เซอร์แสดงรูปที่เลือกแน่นอน
                        mainProfileImg.style.opacity = '1';
                        mainProfileImg.style.transform = 'scale(1)';
                    }, 120);

                    galleryStrip.querySelectorAll('.thumb-slot').forEach(b => {
                        b.classList.remove('active');
                        b.style.borderColor = 'transparent';
                    });
                    btn.classList.add('active');
                    btn.style.borderColor = '#7C3AED';
                }
            });
        }
        return; // ออกจากการทำงาน ไม่ต้องโหลด Database รายชื่อคนอื่น
    }

  
  const sidelineMatch = rawPath.match(/^\/(?:sideline|profile|app)\/([^/]+)/i);
  if (sidelineMatch) {
    let slugVal = decodeURIComponent(sidelineMatch[1]).trim();
    appState.currentProfileSlug = slugVal;

    let foundProfile = appState.allProfiles.find(p => 
      String(p.slug || "").toLowerCase() === slugVal.toLowerCase() || 
      String(p.id) === slugVal
    );

    if (foundProfile) {
      window.openLightboxModal(foundProfile);
    }
    return;
  }

    // 2. ข้ามการ Re-render ซ้ำซ้อน หากหน้าเว็บมี SSR Render มาแล้ว
    const hasExistingSSR = domCache.profilesDisplayArea && domCache.profilesDisplayArea.children.length > 0;
    if (isInitial && hasExistingSSR) {
      const routeMatch = rawPath.match(/^\/(?:location|province)\/([^/]+)/i);
      const locSlug = routeMatch ? decodeURIComponent(routeMatch[1]).toLowerCase().trim() : "national";
      window.currentProvinceSlug = locSlug;
      if (domCache.provinceSelect && locSlug !== "national") {
        domCache.provinceSelect.value = locSlug;
      }
      return;
    }

   // 3. ตรวจสอบหน้ารายจังหวัด และ โซนย่อย (เช่น /location/chiangmai/เจ็ดยอด)
    const locationMatch = rawPath.match(/^\/(?:location|province)\/([^/]+)(?:\/([^/]+))?/i);
    if (locationMatch) {
      let locSlug = "";
      let zoneSlug = "";
      try {
        locSlug = decodeURIComponent(locationMatch[1]).toLowerCase().trim();
        zoneSlug = locationMatch[2] ? decodeURIComponent(locationMatch[2]).trim() : "";
      } catch {
        locSlug = locationMatch[1].toLowerCase().trim();
        zoneSlug = locationMatch[2] ? locationMatch[2].trim() : "";
      }
      if (locSlug === "chiang_mai") locSlug = "chiangmai";

      appState.currentProfileSlug = null;
      window.closeLightboxModal(false);
      window.currentProvinceSlug = locSlug;
      window.currentZoneSlug = zoneSlug;
      if (domCache.provinceSelect) domCache.provinceSelect.value = locSlug;

      executeFilterAndRender(false);
      return;
    }

    // 4. กรณีหน้าหลักทั่วไป (Default)
    appState.currentProfileSlug = null;
    window.currentProvinceSlug = "national";
    window.closeLightboxModal(false);
    if (domCache.provinceSelect) domCache.provinceSelect.value = "";

    executeFilterAndRender(false);
  }

 async function initApplication() {
    // ⚡ 1. ตรวจสอบทันทีก่อนทำอย่างอื่น: ถ้าเป็นหน้าโปรไฟล์เดี่ยว (ที่เปิดตรงมาจาก render-bot.js)
    const isStandaloneProfile = document.querySelector('article.interactive-card') && !document.getElementById('profiles-display-area');
    if (isStandaloneProfile) {
      hideGlobalLoader();
      initDockAutoHide();
      
      // ผูกระบบคลิกเปลี่ยนรูปภาพในอัลบั้มสำหรับหน้าโปรไฟล์เดี่ยว (60 FPS)
      const galleryStrip = document.getElementById('profile-gallery-strip');
      const mainProfileImg = document.getElementById('main-profile-img');
      if (galleryStrip && mainProfileImg) {
        galleryStrip.addEventListener('click', (e) => {
          const btn = e.target.closest('.thumb-slot');
          if (!btn) return;
          if (typeof triggerHaptic === 'function') triggerHaptic('light');
          const fullSrc = btn.getAttribute('data-full-src');
          if (fullSrc) {
            mainProfileImg.style.opacity = '0.3';
            mainProfileImg.style.transform = 'scale(0.98)';
            setTimeout(() => {
              mainProfileImg.src = fullSrc;
              mainProfileImg.removeAttribute('srcset');
              mainProfileImg.style.opacity = '1';
              mainProfileImg.style.transform = 'scale(1)';
            }, 120);

            galleryStrip.querySelectorAll('.thumb-slot').forEach(b => {
              b.classList.remove('active');
              b.style.borderColor = 'transparent';
            });
            btn.classList.add('active');
            btn.style.borderColor = '#7C3AED';
          }
        });
      }

      // ดักจับปุ่มแชร์โปรไฟล์ในหน้าเดี่ยว
      document.body.addEventListener('click', (e) => {
        const shareBtn = e.target.closest('[data-action="share-profile"]');
        if (shareBtn) {
          e.preventDefault();
          const name = shareBtn.getAttribute('data-profile-name') || 'FirstModelHub';
          const url = shareBtn.getAttribute('data-profile-url') || window.location.href;
          window.shareProfile(name, url);
        }
      });

      return; // 🛑 จบการทำงานตรงนี้ทันที! ประหยัดเน็ต ไม่ต้องโหลดฐานข้อมูลทั้งเว็บ
    }

    // 🟢 2. ถ้าเป็นหน้าแรก / หน้ารายจังหวัด ให้ดึงไลน์แอดมินและทำงานต่อตามปกติ (โค้ดเดิมของคุณ):
    getSupabaseClient().then(client => {
      if (!client) return;
      client.from('site_settings').select('value').eq('key', 'admin_line_url').maybeSingle().then(({ data }) => {
        if (data && data.value) {
          const liveLine = data.value;
          // 1. ตรงด้านล่าง (แถบ Bottom Dock ปุ่มจองคิว)
          document.querySelectorAll('.dock-item-line').forEach(el => el.href = liveLine);
          // 2. ตรงล่างสุดในเมนู (ปุ่ม Sidebar & ไอคอน Line ท้ายเว็บ)
          document.querySelectorAll('.sidebar-line-btn, .social-btn.line').forEach(el => el.href = liveLine);
          // 3. ตรงติดต่อแจ้งปัญหา (ศูนย์รับเรื่องร้องเรียน)
          document.querySelectorAll('.btn-concierge-line').forEach(el => el.href = liveLine);
        }
      });
    });

    

    domCache.body = document.body;
    domCache.profilesDisplayArea = document.getElementById("profiles-display-area");
    domCache.noResultsMessage = document.getElementById("no-results-message");
    domCache.fetchErrorMessage = document.getElementById("fetch-error-message");
    domCache.searchForm = document.getElementById("search-form");
    domCache.searchInput = document.getElementById("search-keyword");
    domCache.provinceSelect = document.getElementById("search-province");
    domCache.availabilitySelect = document.getElementById("search-availability");
    domCache.featuredSelect = document.getElementById("search-featured");
    domCache.sortSelect = document.getElementById("sort-select");
    domCache.resetSearchBtn = document.getElementById("reset-search-btn");
    domCache.featuredSection = document.getElementById("featured-profiles");
    domCache.featuredContainer = document.getElementById("featured-profiles-container");

    const menuToggleBtn = document.getElementById("menu-toggle");
    const sidebarMenuEl = document.getElementById("sidebar-menu");
    const sidebarOverlayEl = document.getElementById("sidebar-overlay");
    const closeMenuBtn = document.getElementById("close-menu-btn");

    const toggleSidebar = (isOpen) => {
      if (sidebarMenuEl) {
        sidebarMenuEl.classList.toggle("active", isOpen);
        sidebarMenuEl.style.pointerEvents = isOpen ? "auto" : "none";
        sidebarMenuEl.style.visibility = isOpen ? "visible" : "hidden";
      }
      if (sidebarOverlayEl) {
        sidebarOverlayEl.classList.toggle("active", isOpen);
        sidebarOverlayEl.style.pointerEvents = isOpen ? "auto" : "none";
        sidebarOverlayEl.style.visibility = isOpen ? "visible" : "hidden";
      }
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    if (menuToggleBtn) menuToggleBtn.onclick = () => toggleSidebar(true);
    if (closeMenuBtn) closeMenuBtn.onclick = () => toggleSidebar(false);
    if (sidebarOverlayEl) sidebarOverlayEl.onclick = () => toggleSidebar(false);
    if (sidebarMenuEl) {
      sidebarMenuEl.querySelectorAll("a").forEach(link => {
        link.onclick = () => toggleSidebar(false);
      });
    }

    const openFilterDockBtn = document.getElementById("open-filter-dock-btn");
    const closeSearchDrawerBtn = document.getElementById("close-search-drawer-btn");
    const applyFilterBtn = document.getElementById("apply-filter-btn");
    const searchBottomSheetEl = document.getElementById("search-bottom-sheet");
    const searchDrawerOverlayEl = document.getElementById("search-drawer-overlay");

    const toggleSearchDrawer = (isOpen) => {
      if (searchBottomSheetEl) {
        searchBottomSheetEl.classList.toggle("active", isOpen);
        searchBottomSheetEl.style.pointerEvents = isOpen ? "auto" : "none";
        searchBottomSheetEl.style.visibility = isOpen ? "visible" : "hidden";
      }
      if (searchDrawerOverlayEl) {
        searchDrawerOverlayEl.classList.toggle("active", isOpen);
        searchDrawerOverlayEl.style.pointerEvents = isOpen ? "auto" : "none";
        searchDrawerOverlayEl.style.visibility = isOpen ? "visible" : "hidden";
      }
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    if (openFilterDockBtn) {
      openFilterDockBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSearchDrawer(true);
      };
    }
    if (closeSearchDrawerBtn) closeSearchDrawerBtn.onclick = () => toggleSearchDrawer(false);
    if (searchDrawerOverlayEl) searchDrawerOverlayEl.onclick = () => toggleSearchDrawer(false);
   if (applyFilterBtn) {
      applyFilterBtn.onclick = () => {
        const selectedProv = domCache.provinceSelect?.value;
        // ถ้าผู้ใช้เลือกจังหวัดจากฟอร์มค้นหา ให้พาเปลี่ยนหน้าไปยัง URL จังหวัดนั้นทันที (เพื่อให้ SSR โหลดโซนและเนื้อหาครบ 100%)
        if (selectedProv && selectedProv !== "" && selectedProv !== "all" && selectedProv !== "national") {
          window.location.href = `/location/${selectedProv}`;
          return;
        } else if (selectedProv === "" || selectedProv === "all" || selectedProv === "national") {
          if (window.location.pathname !== "/") {
            window.location.href = "/";
            return;
          }
        }

        executeFilterAndRender(true);
        toggleSearchDrawer(false);

        setTimeout(() => {
          const displayArea = document.getElementById("profiles-display-area");
          if (displayArea) {
            const headerOffset = 70;
            const elementPosition = displayArea.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: Math.max(0, offsetPosition), behavior: "smooth" });
          }
        }, 150);
      };
    }

    // ✅ ให้เปลี่ยนหน้านำทางเฉพาะเมื่อผู้ใช้กดปุ่ม "แสดงผลลัพธ์" (applyFilterBtn) เท่านั้น
if (domCache.provinceSelect) {
  domCache.provinceSelect.addEventListener("change", (e) => {
    // ปล่อยให้ผู้ใช้เลือกเงื่อนไขอื่นให้เสร็จก่อน ไม่ต้องบังคับ reload หน้านี้
  });
}
        

  // 🟢 1. ฟังก์ชันตัวช่วยสั่งเลื่อนหน้าจอวิ่งไปหาโซนรายชื่อน้องๆ
    function scrollToProfilesArea() {
      setTimeout(() => {
        const displayArea = document.getElementById("profiles-display-area");
        if (displayArea) {
          const headerOffset = 70; // เผื่อความสูงของแถบ Header ด้านบน ไม่ให้บังหัวข้อ
          const elementPosition = displayArea.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth"
          });
        }
      }, 150); // รอให้หน้าต่างตัวกรองพับปิดเรียบร้อยก่อน แล้วเลื่อนจอทันที
    }

    if (domCache.searchInput) {
      // 🟢 2. เพิ่มตัวดักปุ่ม Enter / ปุ่มแว่นขยายบนแป้นพิมพ์มือถือ
      domCache.searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          clearTimeout(window.searchTimeout);

          // ซ่อนแป้นพิมพ์มือถือทันที (แก้ปัญหาแป้นพิมพ์บังจอ)
          domCache.searchInput.blur();

          // ปิดป๊อปอัปคำค้นหาแนะนำ
          const popover = document.getElementById("search-suggestions");
          if (popover) popover.style.display = "none";

          // สั่งปิดหน้าต่างตัวกรอง (Drawer) ลงมา
          if (typeof toggleSearchDrawer === "function") {
            toggleSearchDrawer(false);
          }

          // ค้นหาข้อมูล และเลื่อนจอขึ้นไปหาน้องๆ ทันที
          executeFilterAndRender(true);
          scrollToProfilesArea();
        }
      });

      // 3. ขณะพิมพ์ข้อความ (Realtime Search พร้อมปุ่มกากบาท)
      domCache.searchInput.addEventListener("input", (e) => {
        clearTimeout(window.searchTimeout);
        const queryText = e.target.value;
        const clearBtn = document.getElementById("clear-search-btn");
        if (clearBtn) clearBtn.style.display = queryText ? "block" : "none";
        window.searchTimeout = setTimeout(() => {
          executeFilterAndRender(true);
          showSearchSuggestions(queryText);
        }, 200);
      });

      // 4. เมื่อแตะที่ช่องค้นหา
      domCache.searchInput.addEventListener("focus", () => {
        showSearchSuggestions(domCache.searchInput.value);
      });
    }

    // 5. ปุ่มกากบาท (X) ล้างคำค้นหา
    const clearSearchBtn = document.getElementById("clear-search-btn");
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        if (domCache.searchInput) {
          domCache.searchInput.value = "";
          domCache.searchInput.focus();
        }
        clearSearchBtn.style.display = "none";
        const popover = document.getElementById("search-suggestions");
        if (popover) popover.style.display = "none";
        executeFilterAndRender(true);
      });
    }

   // 🟢 ตัวดักคลิก Quick Filter Pills (ใน main.js)
document.querySelectorAll(".filter-pill-tab").forEach(pill => {
  pill.addEventListener("click", function (e) {
    // 1. (SEO & SSR) ถ้าเป็นแท็ก <a> ที่มี href (ปุ่มโซน/จังหวัด) ให้เบราว์เซอร์เปลี่ยนหน้าตามปกติ
    // Google Bot จะไต่ตามลิงก์นี้ไปเจอหน้าที่มี H1, Title, Description เฉพาะเจาะจง
    if (this.tagName === "A" && this.getAttribute("href")) return;

    // 2. (UX & SPA) ถ้าเป็นปุ่ม <button> (แท็กความชอบ เช่น #ฟิวแฟน, #ตัวเล็ก) 
    // ให้ใช้ JavaScript กรองข้อมูลที่อยู่ใน Browser ทันที ไม่ต้องโหลดหน้าใหม่ ลื่นไหล 60FPS
    e.preventDefault();
    triggerHaptic("light");
    document.querySelectorAll(".filter-pill-tab").forEach(p => p.classList.remove("active"));
    this.classList.add("active");

    const selectedTag = this.getAttribute("data-tag") || "all";
    appState.activePillTag = selectedTag;
    executeFilterAndRender(true);
  });
});

    // 🟢 Global Click Delegation
    document.body.addEventListener("click", (e) => {
      // 🟢 ดักจับปุ่มแชร์ data-action="share-profile" แก้ปัญหาปุ่มกดไม่ติด
      const shareBtn = e.target.closest('[data-action="share-profile"]');
      if (shareBtn) {
        e.preventDefault();
        e.stopPropagation();
        const name = shareBtn.getAttribute("data-profile-name") || "FirstModelHub";
        const url = shareBtn.getAttribute("data-profile-url") || window.location.href;
        window.shareProfile(name, url);
        return;
      }

      const searchInputEl = document.getElementById("search-keyword");
      const suggestionsEl = document.getElementById("search-suggestions");
      if (suggestionsEl && searchInputEl && !searchInputEl.contains(e.target) && !suggestionsEl.contains(e.target)) {
        suggestionsEl.style.display = "none";
      }

      const suggestionTarget = e.target.closest('[data-action="suggestion"]');
      if (suggestionTarget) {
        const slug = suggestionTarget.dataset.slug;
        const isProfile = suggestionTarget.dataset.isProfile === "true";
        if (isProfile) {
          if (suggestionsEl) suggestionsEl.style.display = "none";
          toggleSearchDrawer(false);
          history.pushState(null, "", `/sideline/${encodeURIComponent(slug)}`);
          handleUrlRouting();
          return;
        } else {
          if (domCache.searchInput) {
            domCache.searchInput.value = slug;
            if (suggestionsEl) suggestionsEl.style.display = "none";
            executeFilterAndRender(true);
          }
          return;
        }
      }

      const cardElement = e.target.closest(".profile-card-new, .vip-card-item, .interactive-card");
      if (cardElement) {
        const profileId = cardElement.getAttribute("data-profile-id");
        const profileSlug = cardElement.getAttribute("data-profile-slug");

        if (profileId || profileSlug) {
          e.preventDefault();

          const searchId = String(profileId || "");
          const searchSlug = String(profileSlug || "");

          let targetProfile = appState.allProfiles.find(p => 
            String(p.id) === searchId || 
            (p.slug && String(p.slug) === searchSlug) ||
            (searchSlug && String(p.id) === searchSlug)
          );

          if (!targetProfile && window.profilesData && Array.isArray(window.profilesData)) {
            const rawP = window.profilesData.find(p => String(p.id) === searchId || String(p.slug) === searchSlug);
            if (rawP) targetProfile = normalizeProfile(rawP);
          }

          if (targetProfile) {
            history.pushState(null, "", `/sideline/${encodeURIComponent(targetProfile.slug || targetProfile.id)}`);
            window.openLightboxModal(targetProfile);
          } else {
            window.location.href = `/sideline/${encodeURIComponent(profileSlug || profileId)}`;
          }
          return;
        }
      }

      const closeLightboxBtn = e.target.closest("#closeLightboxBtn");
      const lightboxModal = document.getElementById("lightbox");
      if (closeLightboxBtn || e.target === lightboxModal) {
        window.closeLightboxModal(true);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        window.closeLightboxModal(true);
        toggleSidebar(false);
        toggleSearchDrawer(false);
      }
    });

    if (domCache.availabilitySelect) domCache.availabilitySelect.addEventListener("change", () => executeFilterAndRender(true));
    if (domCache.featuredSelect) domCache.featuredSelect.addEventListener("change", () => executeFilterAndRender(true));
    if (domCache.sortSelect) domCache.sortSelect.addEventListener("change", () => executeFilterAndRender(true));

    if (domCache.resetSearchBtn) {
      domCache.resetSearchBtn.addEventListener("click", () => {
        if (domCache.searchInput) domCache.searchInput.value = "";
        if (domCache.availabilitySelect) domCache.availabilitySelect.value = "";
        if (domCache.featuredSelect) domCache.featuredSelect.value = "";
        if (domCache.sortSelect) domCache.sortSelect.value = "featured";

        const clearBtn = document.getElementById("clear-search-btn");
        if (clearBtn) clearBtn.style.display = "none";
        const suggestionsEl = document.getElementById("search-suggestions");
        if (suggestionsEl) suggestionsEl.style.display = "none";

        executeFilterAndRender(true);
      });
    }

    document.querySelectorAll(".region-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".region-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const region = tab.getAttribute("data-region");
        if (region === "ทั้งหมด") window.location.href = isEN ? "/index-en" : "/";
        else if (region === "ภาคเหนือ") window.location.href = "/location/chiangmai";
        else if (region === "ภาคอีสาน") window.location.href = "/location/khon-kaen";
      });
    });

   

    function initDockAutoHide() {
      const floatingDock = document.querySelector('.floating-app-dock');
      if (!floatingDock) return;

      let lastScrollY = window.scrollY;

      window.addEventListener('scroll', function () {
        const currentScrollY = window.scrollY;

        // ใช้การสลับคลาส CSS แทนการกำหนด style.transform ตรงๆ เพื่อไม่ให้ทับค่า translateX(-50%)
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          floatingDock.classList.add('dock-hidden');
        } else if (currentScrollY < lastScrollY) {
          floatingDock.classList.remove('dock-hidden');
        }

        lastScrollY = Math.max(0, currentScrollY);
      }, { passive: true });
    }
    
    initDockAutoHide();

  
    await (async function initializeData() {
      if (appState.isFetching) return false;
      appState.isFetching = true;

      function filterValidProfiles(list) {
        if (!list || !Array.isArray(list)) return [];
        const seenIds = new Set();
        const seenNames = new Set();
        const seenImgs = new Set();
        const validProfiles = [];

        for (const raw of list) {
          if (!raw) continue;

          // 🟢 แก้ไข: ให้อ่านได้ทั้ง raw.n (คีย์ย่อ) และ raw.name (คีย์เต็ม) ไม่ให้ตัดข้อมูลทิ้ง
          const rawName = (raw.n || raw.name || "").trim();
          const cleanName = rawName.toLowerCase().replace(/^(น้อง|สาว|พี่)\s*/gi, "");
          if (!cleanName || cleanName === "model" || cleanName === "สาวสวย" || cleanName === "-") {
            continue;
          }

          // 🟢 แก้ไข: ให้อ่านได้ทั้ง raw.img และ raw.imagePath
          const rawImg = (raw.img || raw.imagePath || raw.image_url || raw.imageUrl || "").trim().toLowerCase();
          if (!rawImg || rawImg.includes("firstmodelhub.webp")) {
            continue;
          }

          if (raw.id && seenIds.has(String(raw.id))) continue;

          // 🟢 แก้ไข: ให้อ่านได้ทั้ง raw.pk และ raw.provinceKey
          const pKey = (raw.pk || raw.provinceKey || raw.province_slug || "").toLowerCase();
          const nameSig = `${cleanName}_${pKey}`;
          if (seenNames.has(nameSig)) continue;

          let imgSig = "";
          const parts = rawImg.split("?")[0].split("/");
          imgSig = parts[parts.length - 1].replace(/\.(webp|jpg|jpeg|png|avif)$/i, "");
          if (imgSig && seenImgs.has(imgSig)) continue;

          if (raw.id) seenIds.add(String(raw.id));
          seenNames.add(nameSig);
          if (imgSig) seenImgs.add(imgSig);

          validProfiles.push(raw);
        }

        return validProfiles;
      }

      try {
        // 1. ดึงรายชื่อจังหวัด
        const provSource = (window.provincesData && Array.isArray(window.provincesData)) 
          ? window.provincesData 
          : (await (await getSupabaseClient())?.from("provinces").select("*"))?.data;

        if (provSource && Array.isArray(provSource)) {
          appState.provincesMap.clear();
          provSource.forEach(p => {
            const nameThai = p.nameThai || p.name_thai || p.name;
            let k = (p.key || p.slug || p.id || "").toString().toLowerCase();
            if (k === "chiang_mai" || k === "chiang-mai") k = "chiangmai";
            if (k && nameThai) appState.provincesMap.set(k, nameThai);
          });
        }

        // 2. กรณีมีข้อมูลจาก SSR (window.profilesData)
        if (window.profilesData && Array.isArray(window.profilesData) && window.profilesData.length > 0) {
          const cleanProfiles = filterValidProfiles(window.profilesData);
          appState.allProfiles = cleanProfiles.map(normalizeProfile).filter(Boolean);
          populateInitialComponents();
          return true;
        }

        // 3. Fallback: ดึงสดจาก Supabase (ถ้าไม่มี SSR)
        const client = await getSupabaseClient();
        if (!client) throw new Error("Supabase client not initialized");

        const { data: rawDbProfiles } = await client
          .from("profiles")
          .select("*")
          .eq("active", true)
          .order("isfeatured", { ascending: false })
          .order("created_at", { ascending: false });

        if (rawDbProfiles && rawDbProfiles.length > 0) {
          const cleanProfiles = filterValidProfiles(rawDbProfiles);
          appState.allProfiles = cleanProfiles.map(normalizeProfile).filter(Boolean);
          populateInitialComponents();
          return true;
        }

        return false;
      } catch (fetchErr) {
        console.error("Data Fetch Error:", fetchErr);
        domCache.fetchErrorMessage?.classList.remove("hidden");
        return false;
      } finally {
        appState.isFetching = false;
        hideGlobalLoader();
      }
    })();

    // จัดการ Routing ของ URL และซ่อนตัวโหลด
    await handleUrlRouting(true);
    hideGlobalLoader();

    // ดักจับการกดย้อนกลับ/ไปข้างหน้าของเบราว์เซอร์
    window.addEventListener("popstate", async () => {
      await handleUrlRouting(false);
    });
  } 
  
  
  function initAgencyStories() {
    const trackEl = document.getElementById("agency-stories-track");
    if (!trackEl) return;

    // 1. ถ้าใน HTML มีการเรนเดอร์มาแล้ว ให้หยุดทำงานทันที ป้องกันเรนเดอร์ซ้ำ
    if (trackEl.children.length > 0) return;

    const profiles = appState.allProfiles;
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) return;

    // 2. คัดกรองเฉพาะโปรไฟล์ที่มีรูปภาพ และเลือกมา 10 คนแรกเพื่อประหยัดแบนด์วิดท์
    const validProfiles = profiles
      .filter(p => p && (p.imagePath || p.image_url || (p.images && p.images.length > 0)))
      .slice(0, 10);

    if (validProfiles.length === 0) return;

    const fallbackImg = "https://firstmodelhub.com/images/firstmodelhub.webp";

    // ฟังก์ชันสร้าง Story Item HTML แต่ละใบ
    const createStoryItemHtml = (p, idx, isAriaHidden = false) => {
      const rawName = p.displayName || p.name || "โมเดล";
      const cleanName = rawName.replace(/^(น้อง\s?)+/gi, "").trim();
      const fullName = isEN ? cleanName : `น้อง${cleanName}`;
      
      const rawImg = p.imagePath || p.image_url || (p.images && p.images[0] ? p.images[0].src : "") || fallbackImg;
      // 🟢 บีบอัดรูปวงกลม Story ให้เหลือ 120x120px โฟกัสใบหน้า (ขนาดไฟล์เหลือเพียง 3-5KB คมชัดระดับ Retina)
      const storyImg = typeof optimizeImg === "function" ? optimizeImg(rawImg, 120, 120) : rawImg;
      
      const slug = encodeURIComponent(p.slug || p.id || cleanName);
      const profileId = p.id || "";
      
      const isOnline = p.isAvailable !== undefined 
        ? Boolean(p.isAvailable) 
        : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "busy", "off"].some(s => String(p.availability || "").toLowerCase().includes(s));
      
      const statusClass = isOnline ? "online" : "busy";
      const hiddenAttr = isAriaHidden ? 'aria-hidden="true" tabindex="-1" rel="nofollow"' : '';

      return `
        <a href="/sideline/${slug}" 
           class="story-item-el interactive-card" 
           data-profile-id="${escapeHTML(String(profileId))}" 
           data-profile-slug="${slug}" 
           aria-label="${isAriaHidden ? '' : `ดูโปรไฟล์ ${escapeHTML(fullName)}`}" 
           ${hiddenAttr}>
          <div class="story-ring-wrap">
            <div class="story-ring-glow">
            <img src="${storyImg}" 
                   alt="${escapeHTML(cleanName)}" 
                   loading="lazy" 
                   decoding="async" 
                   width="52" 
                   height="52" 
                   onerror="this.onerror=null; this.src='${fallbackImg}';">
            </div>
            <span class="story-status-dot ${statusClass}" aria-hidden="true"></span>
          </div>
          <span class="story-label">${escapeHTML(cleanName)}</span>
        </a>
      `;
    };

  // 🟢 แก้ปัญหาข้อ 3: ลดการเรนเดอร์ DOM ซ้ำซ้อน ประหยัด RAM ให้มือถือ
    const primaryHtml = validProfiles.map((p, idx) => createStoryItemHtml(p, idx, false)).join("");
    trackEl.innerHTML = primaryHtml;
    }
    
  // ==========================================================================
  // 🕵️‍♂️ STEALTH ADMIN CACHE PURGE (พร้อมกล่องแจ้งเตือนสถานะ สำเร็จ/ล้มเหลว)
  // ==========================================================================
  function showAdminStatusModal(status, title, message) {
    let modal = document.getElementById("admin-status-hud");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "admin-status-hud";
      modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        background: rgba(15, 23, 42, 0.96);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        border-radius: 24px;
        padding: 24px 28px;
        z-index: 999999;
        color: #FFFFFF;
        text-align: center;
        width: 90%;
        max-width: 380px;
        box-shadow: 0 25px 60px rgba(0,0,0,0.6);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        opacity: 0;
        pointer-events: none;
        box-sizing: border-box;
      `;
      document.body.appendChild(modal);
    }

    let iconHtml = "";
    let borderStyle = "";

    if (status === "loading") {
      iconHtml = `<div style="font-size: 38px; margin-bottom: 12px; animation: spin 1s linear infinite; display: inline-block;">⚡</div>`;
      borderStyle = "1.5px solid rgba(124, 58, 237, 0.6)";
    } else if (status === "success") {
      iconHtml = `<div style="font-size: 42px; margin-bottom: 12px; color: #00E676; text-shadow: 0 0 20px #00E676;">✓</div>`;
      borderStyle = "2px solid #00E676";
      if (typeof triggerHaptic === "function") triggerHaptic("success");
    } else if (status === "error") {
      iconHtml = `<div style="font-size: 42px; margin-bottom: 12px; color: #FF1493; text-shadow: 0 0 20px #FF1493;">✕</div>`;
      borderStyle = "2px solid #FF1493";
      if (typeof triggerHaptic === "function") triggerHaptic("medium");
    }

    modal.style.border = borderStyle;
    modal.innerHTML = `
      ${iconHtml}
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 900;">${title}</h3>
      <p style="margin: 0; font-size: 12.5px; color: #CBD5E1; line-height: 1.6;">${message}</p>
      ${status === "error" ? `
        <button type="button" onclick="document.getElementById('admin-status-hud').style.opacity='0'; document.getElementById('admin-status-hud').style.pointerEvents='none';" 
          style="margin-top: 16px; background: rgba(255,255,255,0.15); border: none; color: #FFFFFF; padding: 8px 24px; border-radius: 100px; font-weight: 800; font-size: 12px; cursor: pointer;">
          ปิดหน้าต่าง
        </button>` : ""}
    `;

    modal.style.opacity = "1";
    modal.style.pointerEvents = "auto";
    modal.style.transform = "translate(-50%, -50%) scale(1)";
  }

  // ==========================================================================
  // 🕵️‍♂️ STEALTH ADMIN CACHE PURGE (ระบบตัดขาดจากลิงก์ + ป๊อปอัป PIN แบบสมบูรณ์)
  // ==========================================================================
  function initStealthAdminPurge() {
    const starElements = document.querySelectorAll(".luxe-star-crest, .brand-logo-text .star, .dancing-neon-star, .star");
    if (!starElements || starElements.length === 0) return;

    let tapCount = 0;
    let resetTimer = null;
    let lastTapTime = 0;
    const ADMIN_SECRET = "fmh_super_admin_2026";
    const ADMIN_PIN = "8888";

    starElements.forEach(star => {
      star.style.cursor = "pointer";
      star.style.userSelect = "none";
      star.style.webkitUserSelect = "none";
      star.style.touchAction = "manipulation";

      const handleTap = (e) => {
        // 🔒 สกัดกั้นทุกทาง ไม่ให้ลิงก์ <a> นำทางหรือรีโหลดหน้าเว็บเด็ดขาด!
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();
        if (now - lastTapTime < 80) return;
        lastTapTime = now;

        tapCount++;
        if (typeof triggerHaptic === "function") triggerHaptic("light");

        // แอนิเมชันดาวดิ้นตอบสนองนิ้วมือ
        star.style.transition = "transform 0.15s ease";
        star.style.transform = "scale(1.4) rotate(20deg)";
        setTimeout(() => { star.style.transform = ""; }, 150);

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => { tapCount = 0; }, 1800);

        // เมื่อแตะครบ 5 ครั้ง
        if (tapCount >= 5) {
          tapCount = 0;
          clearTimeout(resetTimer);
          if (typeof triggerHaptic === "function") triggerHaptic("medium");

          // ⚡ เปิดหน้าต่างใส่รหัส PIN สุดหรู (ไม่พึ่ง prompt ของเบราว์เซอร์ ปลอดภัย 100%)
          openAdminPinDialog(ADMIN_PIN, ADMIN_SECRET);
        }
      };

      // ผูกดักทุกอีเวนต์เพื่อความชัวร์
      star.addEventListener("pointerdown", handleTap, { passive: false });
      star.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); }, { capture: true });
      star.addEventListener("touchend", (e) => { e.preventDefault(); e.stopPropagation(); }, { passive: false });
    });
  }

  // 🟢 หน้าต่าง Modal ใส่รหัส PIN สไตล์ Luxury Glassmorphic
  function openAdminPinDialog(correctPin, secretKey) {
    let modal = document.getElementById("admin-pin-dialog-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "admin-pin-dialog-modal";
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(10, 6, 20, 0.85);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        z-index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        opacity: 0;
        transition: opacity 0.2s ease;
      `;
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="
        background: #140F22;
        border: 1.5px solid rgba(124, 58, 237, 0.4);
        border-radius: 26px;
        padding: 26px 20px;
        width: 100%;
        max-width: 320px;
        text-align: center;
        box-shadow: 0 25px 70px rgba(0,0,0,0.8);
        color: #FFFFFF;
        font-family: 'Prompt', sans-serif;
      ">
        <div style="font-size: 34px; margin-bottom: 6px;">🔑</div>
        <h3 style="font-size: 16px; font-weight: 900; margin: 0 0 4px 0; color: #FFFFFF;">ADMIN CONTROL HUB</h3>
        <p style="font-size: 11.5px; color: #94A3B8; margin: 0 0 16px 0;">ใส่รหัสผ่านเพื่อสั่งล้างแคช CDN ทั่วโลก</p>
        
        <input type="password" id="admin-custom-pin-input" inputmode="numeric" maxlength="6" placeholder="••••" style="
          width: 100%;
          height: 48px;
          background: rgba(255, 255, 255, 0.08);
          border: 1.5px solid rgba(124, 58, 237, 0.5);
          border-radius: 14px;
          color: #FFFFFF;
          font-size: 26px;
          text-align: center;
          letter-spacing: 10px;
          outline: none;
          margin-bottom: 16px;
          box-sizing: border-box;
        ">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button type="button" id="admin-pin-cancel-btn" style="
            height: 44px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #CBD5E1;
            border-radius: 12px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
          ">ยกเลิก</button>
          
          <button type="button" id="admin-pin-submit-btn" style="
            height: 44px;
            background: linear-gradient(135deg, #7C3AED 0%, #E11D48 100%);
            border: none;
            color: #FFFFFF;
            border-radius: 12px;
            font-weight: 900;
            font-size: 13px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);
          ">ยืนยัน</button>
        </div>
      </div>
    `;

    modal.style.display = "flex";
    requestAnimationFrame(() => { modal.style.opacity = "1"; });

    const pinInput = document.getElementById("admin-custom-pin-input");
    const cancelBtn = document.getElementById("admin-pin-cancel-btn");
    const submitBtn = document.getElementById("admin-pin-submit-btn");

    setTimeout(() => { pinInput?.focus(); }, 120);

    const closeDialog = () => {
      modal.style.opacity = "0";
      setTimeout(() => { modal.style.display = "none"; }, 200);
    };

    cancelBtn.onclick = closeDialog;

   const executePurge = async () => {
      const val = pinInput.value.trim();
      if (val === correctPin) {
        closeDialog();
        showAdminStatusModal(
          "loading", 
          "กำลังล้างแคชระบบ...", 
          "กำลังสั่งล้างแคชหน่วยความจำ กรุณารอสักครู่..."
        );

        try {
          if (window.sessionStorage) sessionStorage.clear();
          if (window.localStorage) localStorage.clear();
          if ("caches" in window) {
            const cacheKeys = await caches.keys();
            await Promise.all(cacheKeys.map(k => caches.delete(k)));
          }

          // ⚡ ตรวจจับว่าถ้ากำลังรันบน Localhost ไม่ต้องยิง Netlify ให้เออเร่อ
          const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
          
          if (!isLocal) {
            await fetch(`/api/clear-cache?secret=${secretKey}`, {
              method: "GET",
              headers: { "x-purge-secret": secretKey },
              cache: "no-store"
            });
          }

          showAdminStatusModal(
            "success", 
            "ล้างแคชสำเร็จ 100%!", 
            isLocal 
              ? "⚡ [โหมดทดสอบ Localhost] ล้างแคชในเครื่องสำเร็จเรียบร้อย!" 
              : "⚡ ล้าง Netlify CDN ทั่วโลกเรียบร้อย ทุกคนจะเห็นข้อมูลใหม่ทันที!"
          );

          setTimeout(() => {
            window.location.reload();
          }, 1000);

        } catch (err) {
          window.location.reload();
         } 
          } else {
            pinInput.value = "";
            pinInput.style.borderColor = "#FF1493";
            if (typeof triggerHaptic === "function") triggerHaptic("medium");
            pinInput.placeholder = "รหัสผิด!";
          }
        };

        // 🟢 1. ผูกปุ่มกดยืนยัน และผูกปุ่ม Enter บนแป้นพิมพ์
        submitBtn.onclick = executePurge;
        pinInput.onkeydown = (e) => {
          if (e.key === "Enter") executePurge();
        };
      }
      
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          initApplication();
          initLightboxSwipeDown();
          initStealthAdminPurge();
          updateLiveRelativeTimestamps(); // 👈 คำนวณเวลาสดทันที
        });
      } else {
        initApplication();
        initLightboxSwipeDown();
        initStealthAdminPurge();
        updateLiveRelativeTimestamps();
      }
    })();
