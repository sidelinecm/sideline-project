
function parseRateToNumber(rate) {
  if (!rate) return 1500;
  const str = String(rate).trim().toLowerCase();
  if (str.includes("ฟรี") || str === "free") return 0;
  if (str.includes("ตกลง") || str.includes("สอบถาม")) return 1500;

  if (str.includes("k")) {
    const floatVal = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(floatVal) ? 1500 : Math.round(floatVal * 1000);
  }

  const pricePart = str.split(/[\/\(\s]/)[0];
  const cleanDigits = pricePart.replace(/\D/g, "");
  const num = parseInt(cleanDigits, 10);
  if (isNaN(num) || num <= 0) return 1500;

  if (num < 10) return num * 1000;              // กรอก 2 -> 2000
  if (num >= 10 && num < 100) return num * 100; // กรอก 15 -> 1500 (แก้บั๊ก 150.-)
  if (num < 500) return num * 10;               // กรอก 150 -> 1500
  return num;
}
window.parseRateToNumber = parseRateToNumber;


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
    if (el.textContent !== text) el.textContent = text;
  });
}


const SUPABASE_REST_URL = "https://zxetzqwjaiumqhrpumln.supabase.co/rest/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4";
const PROFILE_SELECT_COLS = "*";

async function fetchSupabaseRest(endpoint) {
  try {
    const res = await fetch(`${SUPABASE_REST_URL}/${endpoint}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn("Supabase REST fallback:", e);
    return null;
  }
}

(function () {
  "use strict";

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

  
 

  const appState = {
    rawList: [],
    rawProfileById: new Map(),
    rawProfileBySlug: new Map(),
    normalizedCount: 0,
    isNormalizedAll: false,
    allProfiles: [],
    profileById: new Map(),
    profileBySlug: new Map(),
    provincesMap: new Map(),
    currentProfileSlug: null,
    isFetching: false,
    currentFilters: null,
    filteredProfiles: [],
    activePillTag: "all",
    renderId: 0
  };

  const domCache = {};
  
  function triggerHaptic(type = "light") {
  // รันแบบ Asynchronous ไม่ให้ขวางจังหวะประมวลผลการคลิก
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    requestAnimationFrame(() => {
      try {
        if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
        if (type === "light") navigator.vibrate(10);
        else if (type === "medium") navigator.vibrate(15);
      } catch (_) {}
    });
  }
}

  window.triggerHaptic = triggerHaptic;

  window.shareProfile = async function (name, profileUrl) {
  const shareTargetUrl = profileUrl || window.location.href;
  const shareData = { title: `${name} | FirstModelHub`, url: shareTargetUrl };

  if (typeof triggerHaptic === "function") triggerHaptic("light");

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
  } catch (err) {
    if (err.name === "AbortError") return;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareTargetUrl);
      alert(`คัดลอกลิงก์โปรไฟล์ ${name} เรียบร้อยแล้วค่ะ!`);
      return;
    }
  } catch (_) {
    prompt("คัดลอกลิงก์โปรไฟล์นี้:", shareTargetUrl);
  }
};

 window.trackLineClick = function(profileId) {
  try {
    if (typeof window.__ensureGtmLoaded === "function") window.__ensureGtmLoaded();
    if (typeof window.gtag === "function") {
      window.gtag("event", "line_booking_click", {
        profile_id: String(profileId),
        page_path: window.location.pathname
      });
    }
  } catch (_) {}

  setTimeout(() => {
    try {
      const idNum = parseInt(profileId, 10);
      if (isNaN(idNum)) return;

      const storageKey = `tracked_line_${idNum}`;
      if (localStorage.getItem(storageKey)) return; 
      localStorage.setItem(storageKey, "true");

      // ✅ ยิงตรงผ่าน REST API ของ Supabase แบบ Native Fetch ขนาด 0 KB ไม่ต้องโหลดไลบรารี!
      fetch("https://zxetzqwjaiumqhrpumln.supabase.co/rest/v1/rpc/increment_likes", {
        method: "POST",
        headers: {
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ profile_id_to_update: idNum }),
        keepalive: true
      }).catch(() => {});
    } catch (_) {}
  }, 100);
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
    .replace(/พาพับ/g, "พายัพ")
    .replace(/🚨/g, "")
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
   .replace(/(พร้อม|มี)?อาบน้ำด้วยกัน/gi, "")
    .replace(/(มีอารมร่วม|มีอารมณ์?ร่วม)/gi, "ดูแลเป็นกันเอง")
    
    // 🟢 ดักจับคำว่า "น้ำ" ทุกรูปแบบ (เว้นคำว่า น้ำหนัก, น้ำมัน ฯลฯ)
    .replace(/[\d๑-๙]+\s*น้ำ(?!หนัก|มัน|หอม|ตก|ใส|ดื่ม|แข็ง|ตาล|พริก)(\s*\/?\s*[\d๑-๙]+\s*ชม\.?)?/gi, "1 ชม.")
    
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

  // 🟢 ฟังก์ชันล็อกไม่ให้คนชื่อเดียวกันโผล่ซ้ำในหัวข้อ/กริดเดียวกัน
  function deduplicateProfilesByName(list) {
    if (!list || !Array.isArray(list)) return [];
    const seen = new Set();
    return list.filter(p => {
      const cleanN = (p.displayName || p.name || "")
        .replace(/^(น้อง|สาว|พี่)\s*/gi, "")
        .trim()
        .toLowerCase();
      if (!cleanN || seen.has(cleanN)) return false;
      seen.add(cleanN);
      return true;
    });
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

function optimizeImg(imagePath, mode = "card") {
  const DEFAULT_FALLBACK_IMG = "https://firstmodelhub.com/images/firstmodelhub.webp";
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) return DEFAULT_FALLBACK_IMG;
  const cleanPath = imagePath.trim();

  if (cleanPath.includes("firstmodelhub.webp") || cleanPath.length < 10) return DEFAULT_FALLBACK_IMG;
  if (cleanPath.startsWith("data:")) return cleanPath;

  let transform = "f_auto,q_auto:eco,fl_lossy,w_320,h_448,c_fill,g_auto";
  if (mode === "thumb" || (typeof mode === "number" && mode <= 150)) {
    transform = "f_auto,q_auto:eco,fl_lossy,w_120,h_120,c_thumb,g_face";
  } else if (mode === 300 || mode === "swiper") {
    transform = "f_auto,q_auto:eco,fl_lossy,w_300,h_420,c_fill,g_auto";
  } else if (mode === "card") {
    transform = "f_auto,q_auto:eco,fl_lossy,w_320,h_448,c_fill,g_auto";
  } else if (mode === "og") {
    transform = "f_auto,q_auto:good,fl_lossy,w_1200,h_630,c_fill,g_face";
  } else if (mode === 600 || mode === "full" || typeof mode === "number") {
    transform = "f_auto,q_auto:good,fl_lossy,w_600,h_840,c_limit";
  }

  const cldMarker = "/image/upload/";
  if (cleanPath.includes("res.cloudinary.com") && cleanPath.includes(cldMarker)) {
    const markerIdx = cleanPath.indexOf(cldMarker);
    const rest = cleanPath.slice(markerIdx + cldMarker.length);
    if (rest) {
      const parts = rest.split("/");
      const verIdx = parts.findIndex((seg) => /^v\d+$/.test(seg));
      let tailParts = [];
      if (verIdx !== -1) {
        tailParts = parts.slice(verIdx + 1);
      } else {
        const isTransformSeg = (seg) =>
          seg.includes(",") ||
          seg.includes(":") ||
          /^(?:f|q|w|h|c|g|e|l|fl|ar|bo|dpr|t)_/i.test(seg);
        let startIdx = 0;
        while (startIdx < parts.length - 1 && isTransformSeg(parts[startIdx])) {
          startIdx++;
        }
        tailParts = parts.slice(startIdx);
      }
      if (tailParts.length > 0) {
        return `https://res.cloudinary.com/dduxw7k4/image/upload/${transform}/${tailParts.join("/")}`;
      }
    }
  }

  if (/^https?:\/\//i.test(cleanPath)) return cleanPath;
  const formatted = cleanPath.replace(/^\/+/, "");
  const finalPath = formatted.startsWith("images/") ? formatted : `images/${formatted}`;
  return `https://res.cloudinary.com/dduxw7k4/image/upload/${transform}/${finalPath}`;
}

  function normalizeProfile(raw) {
    if (!raw || typeof raw !== "object") return null;

    const rawName = raw.n || raw.name || raw.displayName || raw.title || "Model";
    const displayName = formatDisplayName(rawName);
    const mainImg = (raw.img || raw.imagePath || raw.image_url || raw.imageUrl || raw.image || raw.photo || raw.avatar || "").trim();
    
    let gallery = raw.g || raw.galleryPaths || raw.gallery_paths || raw.gallery || raw.photos || raw.images || [];
    if (typeof gallery === "string") {
      const trimmed = gallery.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try { 
          gallery = JSON.parse(trimmed); 
        } catch (_) { 
          gallery = []; 
        }
      } else if (trimmed.startsWith("http") || trimmed.startsWith("/")) {
        gallery = trimmed.split(/[\r\n]+|,\s*(?=https?:\/\/|\/)/).map(s => s.trim()).filter(Boolean);
      } else {
        gallery = [];
      }
    }

    const galleryArr = (Array.isArray(gallery) ? gallery : [])
      .map(item => (typeof item === "object" && item !== null) ? (item.src || item.url || item.imagePath || "") : String(item || ""))
      .map(s => s.trim())
      .filter(s => s.startsWith("http") || s.startsWith("/"));

    const combinedPhotos = [mainImg, ...galleryArr]
      .filter(s => s && (s.startsWith("http") || s.startsWith("/")) && !s.includes("firstmodelhub.webp"));

    const seenSignatures = new Set();
    const uniquePhotos = [];

    for (const urlStr of combinedPhotos) {
      const fileSig = urlStr.split("?")[0].split("/").pop();
      if (fileSig && !seenSignatures.has(fileSig)) {
        seenSignatures.add(fileSig);
        uniquePhotos.push(urlStr);
      }
    }

    let images = uniquePhotos.map(urlStr => ({
      src: optimizeImg(urlStr, 300),
      cardSrc: optimizeImg(urlStr, "card"),
      fullSrc: optimizeImg(urlStr, 600)
    }));

    if (images.length === 0) {
      images.push({ src: DEFAULT_FALLBACK_IMG, cardSrc: DEFAULT_FALLBACK_IMG, fullSrc: DEFAULT_FALLBACK_IMG });
    }

    let pKey = (raw.pk || raw.provinceKey || raw.province_slug || raw.province_key || raw.province || "").toString().toLowerCase().trim();
    if (pKey === "chiang_mai" || pKey === "chiang-mai") pKey = "chiangmai";
    if (pKey === "khonkaen" || pKey === "khon_kaen") pKey = "khon-kaen";

    const INVALID_KEYS = ["", "no_province", "other", "undefined", "null", "none"];
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

    const provinceThai = appState.provincesMap.get(pKey) || raw.provinceThai || raw.province_thai || raw.provinceName || "เชียงใหม่";
    const rawRate = raw.r || raw.rate || raw.price || raw.fee || raw.cost || 0;
    const numPrice = parseRateToNumber(rawRate);
    const displayPrice = numPrice > 0 ? `${numPrice.toLocaleString()}.-` : (isEN ? "Inquire" : "สอบถาม");

    const bust = raw.bust || raw.breast || "";
    const waist = raw.waist || "";
    const hips = raw.hip || raw.hips || "";
    const cup = (raw.cup_size || raw.cupSize || raw.cup || "").toString().toUpperCase().trim();

    const rawProp = String(raw.st || raw.stats || raw.proportion || raw.proportions || "").trim();
    const hasValidDbStats = rawProp && !["-", "0", "null", "ไม่ระบุ"].includes(rawProp);

    let statsStr = "";
    if (bust && waist && hips) {
      statsStr = `${bust}${cup}-${waist}-${hips}`;
    } else if (hasValidDbStats) {
      statsStr = rawProp;
    } else {
      const fullBio = `${raw.description || ""} ${raw.slogan || ""} ${raw.quote || ""}`;
      const foundMatch = fullBio.match(/(\d{2,3}[A-Za-z]?\s*[-–]\s*\d{2}\s*[-–]\s*\d{2})/);
      statsStr = (foundMatch && foundMatch[1]) ? foundMatch[1].replace(/\s+/g, "") : "";
    }

    const rawAge = raw.a || raw.age || raw.profile_age;
    const cleanAge = rawAge && !["-", "0", "ไม่ระบุ"].includes(String(rawAge).trim()) ? String(rawAge).replace(/\D/g, "") : "";
    const resolvedAge = cleanAge;
    const ageDisplay = cleanAge ? (isEN ? `${cleanAge} yrs` : `${cleanAge} ปี`) : "";

    const rawHeight = raw.height || raw.profile_height;
    const cleanHeight = rawHeight && !["-", "0", "ไม่ระบุ"].includes(String(rawHeight).trim()) ? String(rawHeight).replace(/\D/g, "") : "";
    const heightDisplay = cleanHeight ? (isEN ? `${cleanHeight} cm` : `${cleanHeight} ซม.`) : "";

    const rawWeight = raw.weight || raw.profile_weight;
    const cleanWeight = rawWeight && !["-", "0", "ไม่ระบุ"].includes(String(rawWeight).trim()) ? String(rawWeight).replace(/\D/g, "") : "";
    const weightDisplay = cleanWeight ? (isEN ? `${cleanWeight} kg` : `${cleanWeight} กก.`) : "";

    const rawSkin = raw.skin_tone || raw.skinTone || raw.skin_color || raw.skinColor || raw.skin;
    const skinDisplay = rawSkin && !["-", "ไม่ระบุ"].includes(String(rawSkin).trim()) ? String(rawSkin).trim() : "";
    const statsDisplay = statsStr;

    const slogan = raw.slogan || raw.quote || raw.tagline || (isEN ? "Romantic Girlfriend Experience, verified photos" : "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน");
    const cleanStr = (window.__ssrSanitized || raw._sanitized) ? (s => s || "") : sanitizeThaiText;

    // 🟢 รวมคำสะกดแท็กให้เป็น "ฟิวแฟน" คำเดียวมาตรฐานทั้งระบบ
    const rawTags = raw.style_tags || raw.styleTags || raw.tags || [];
    const styleTags = (Array.isArray(rawTags) ? rawTags : typeof rawTags === "string" ? rawTags.split(",") : [])
      .map(s => String(s).trim())
      .map(s => (s === "ฟิลแฟน" || s === "ฟีลแฟน" || s === "ฟิวเเฟน" || s === "gfe") ? "ฟิวแฟน" : s)
      .filter(Boolean);

    const availabilityStatus = raw.availability || raw.status || (isEN ? "Available" : "รับงาน");
    const isAvail = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "off", "busy"].some(s => availabilityStatus.toLowerCase().includes(s));

    let rawLineVal = (raw.line_id || raw.lineId || raw.line || raw.line_url || raw.contact_line || "").toString().trim();
    if (/vos730x|318afxwt/i.test(rawLineVal)) {
      rawLineVal = "https://line.me/ti/p/u8Bz9HsaY8";
    }

    return {
      ...raw,
      _sanitized: true,
      id: raw.id,
      slug: (() => {
        const s = String(raw.slug || "").trim().toLowerCase().replace(/\s+/g, "-");
        const bad = !s || /[\u0E00-\u0E7F]/.test(s) || /^(aekhth|ediyr|aikhejiyw|aetngom|aetngkwa|eoingeoy|emsa|hmiw)/.test(s);
        return bad ? `model-${raw.id}` : s;
      })(),
      location: isEN ? (PROVINCE_EN_MAP[pKey] || pKey) : cleanStr(raw.location || provinceThai),
      description: cleanStr(raw.description || ""),
      quote: isEN ? slogan : cleanStr(slogan),
      slogan: isEN ? slogan : cleanStr(slogan),
      displayName,
      images,
      provinceNameThai: provinceThai,
      provinceKey: pKey,
      displayPrice,
      _price: numPrice,
      bust: String(bust),
      cup,
      safeAge: resolvedAge,
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
      lineId: rawLineVal,
      line_id: rawLineVal,
      styleTags
    };
  }

  function getOrNormalizeProfile(idVal, slugVal) {
    const idKey = idVal != null ? String(idVal) : "";
    const slugKey = slugVal ? String(slugVal).toLowerCase() : "";

    const cached = (idKey && appState.profileById.get(idKey)) ||
                   (slugKey && appState.profileBySlug.get(slugKey));
    if (cached) return cached;

    const raw = (idKey && appState.rawProfileById.get(idKey)) ||
                (slugKey && appState.rawProfileBySlug.get(slugKey)) ||
                (Array.isArray(window.profilesData) && window.profilesData.find(p =>
                  (idKey && String(p.id) === idKey) ||
                  (slugKey && String(p.slug || "").toLowerCase() === slugKey)
                ));
    if (!raw) return null;

    const norm = normalizeProfile(raw);
    if (norm) {
      if (norm.id != null) appState.profileById.set(String(norm.id), norm);
      if (norm.slug) appState.profileBySlug.set(String(norm.slug).toLowerCase(), norm);
    }
    return norm;
  }

  function ensureAllProfilesNormalized() {
    if (appState.isNormalizedAll || appState.normalizedCount >= appState.rawList.length) {
      appState.isNormalizedAll = true;
      return appState.allProfiles;
    }
    for (let i = appState.normalizedCount; i < appState.rawList.length; i++) {
      const raw = appState.rawList[i];
      if (!raw) continue;
      const idKey = raw.id != null ? String(raw.id) : "";
      let p = idKey ? appState.profileById.get(idKey) : null;
      if (!p) {
        p = normalizeProfile(raw);
        if (p) {
          if (p.id != null) appState.profileById.set(String(p.id), p);
          if (p.slug) appState.profileBySlug.set(String(p.slug).toLowerCase(), p);
        }
      }
      if (p) appState.allProfiles.push(p);
    }
    appState.normalizedCount = appState.rawList.length;
    appState.isNormalizedAll = true;
    return appState.allProfiles;
  }

  function scheduleBackgroundNormalization() {
    if (appState.isNormalizedAll || appState.normalizedCount >= appState.rawList.length) {
      appState.isNormalizedAll = true;
      return;
    }
    const runChunk = () => {
      const end = Math.min(appState.normalizedCount + 12, appState.rawList.length);
      for (let i = appState.normalizedCount; i < end; i++) {
        const raw = appState.rawList[i];
        if (!raw) continue;
        const idKey = raw.id != null ? String(raw.id) : "";
        let p = idKey ? appState.profileById.get(idKey) : null;
        if (!p) {
          p = normalizeProfile(raw);
          if (p) {
            if (p.id != null) appState.profileById.set(String(p.id), p);
            if (p.slug) appState.profileBySlug.set(String(p.slug).toLowerCase(), p);
          }
        }
        if (p) appState.allProfiles.push(p);
      }
      appState.normalizedCount = end;
      if (end < appState.rawList.length) scheduleBackgroundNormalization();
      else appState.isNormalizedAll = true;
    };
    if ("requestIdleCallback" in window) requestIdleCallback(runChunk, { timeout: 1200 });
    else setTimeout(runChunk, 40);
  }

  function populateProvinceSelect() {
    if (!domCache.provinceSelect || domCache.provinceSelect.options.length > 1) return;
    const sortedProvinces = Array.from(appState.provincesMap.entries()).sort((a, b) => a[1].localeCompare(b[1], "th"));
    const fragment = document.createDocumentFragment();
    sortedProvinces.forEach(([k, nameThai]) => {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = isEN ? (PROVINCE_EN_MAP[k] || nameThai) : nameThai;
      fragment.appendChild(opt);
    });
    domCache.provinceSelect.appendChild(fragment);
    const routeMatch = window.location.pathname.match(/^\/(?:location|province)\/([^/]+)/);
    const activeProv = routeMatch ? decodeURIComponent(routeMatch[1]).toLowerCase() : window.currentProvinceSlug || "";
    if (activeProv && activeProv !== "national") {
      domCache.provinceSelect.value = activeProv;
    }
  }

  function populateInitialComponents() {
    populateProvinceSelect();
    
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

// ✅ เช็คก่อนว่าอยู่หน้าจังหวัดอะไร ถ้าอยู่หน้าจังหวัดให้กรองเฉพาะน้องจังหวัดนั้นมาทำเป็น HOT
const currentProv = window.currentProvinceSlug || "national";
let pool = appState.allProfiles;
if (currentProv && currentProv !== "national" && currentProv !== "all") {
  pool = pool.filter(p => (p.provinceKey || "").toLowerCase() === currentProv.toLowerCase());
}

// 🟢 จัดกลุ่มตามจังหวัด และสลับดึงคนที่มี #ฟิวแฟน จังหวัดละ 2 คน
let hotProfiles = [];
const isNation = !currentProv || currentProv === "national" || currentProv === "all";

if (isNation) {
  const fiwfanOnly = pool.filter(p => {
    const tagsStr = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : (p.styleTags || "")).toLowerCase();
    const descStr = (p.description || "").toLowerCase();
    const sloganStr = (p.slogan || p.quote || "").toLowerCase();
    return `${tagsStr} ${descStr} ${sloganStr}`.includes("ฟิวแฟน") || tagsStr.includes("gfe");
  });

  const provGroup = new Map();
  (fiwfanOnly.length >= 6 ? fiwfanOnly : pool).forEach(p => {
    const k = (p.provinceKey || "other").toLowerCase();
    if (!provGroup.has(k)) provGroup.set(k, []);
    provGroup.get(k).push(p);
  });

  const seenNames = new Set();
  const provKeys = Array.from(provGroup.keys());
  let round = 0;

  while (hotProfiles.length < 10 && round < 4) {
    let added = 0;
    for (const k of provKeys) {
      const list = provGroup.get(k) || [];
      if (list.length > round) {
        const item = list[round];
        const cleanN = (item.displayName || item.name || "").replace(/^(น้อง|สาว|พี่)\s*/gi, "").trim().toLowerCase();
        if (!seenNames.has(cleanN)) {
          seenNames.add(cleanN);
          hotProfiles.push(item);
          added++;
          if (hotProfiles.length >= 10) break;
        }
      }
    }
    if (added === 0) break;
    round++;
  }
} else {
  // หากอยู่หน้ารายจังหวัด ให้ดึงคนในจังหวัดนั้นที่ติดฟิวแฟน
  const provCandidates = pool.filter(p => {
    const tagsStr = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : (p.styleTags || "")).toLowerCase();
    return tagsStr.includes("ฟิวแฟน") || (p.description || "").includes("ฟิวแฟน");
  });
  hotProfiles = (provCandidates.length >= 5 ? provCandidates : pool).slice(0, 10);
}

    
    window.__hotProfileIds = new Set(hotProfiles.map(p => String(p.id)));

    // 2. ค้นหาช่วงบรรทัด ~415 ใน main.js (การสร้าง Hot Swiper) ให้รูปที่ 0 เท่านั้นที่เป็น high:
vipSwiperEl.innerHTML = hotProfiles.map((p, idx) => {
  const rankBadge = `#${idx + 1} HOT`;
  const pKey = (p.provinceKey || "national").toLowerCase();
  const locationText = isEN ? (PROVINCE_EN_MAP[pKey] || pKey) : (p.location || p.provinceNameThai || "ทั่วไทย");
  const slug = encodeURIComponent(p.slug || p.id);
  const imgSrc = p.images[0]?.src || DEFAULT_FALLBACK_IMG;
  const isOnline = p.isAvailable !== undefined ? p.isAvailable : !(p.availability || "").toLowerCase().includes("ไม่ว่าง");
  const statusLabel = isEN ? (isOnline ? "Available" : "Inquire") : (isOnline ? "รับงาน" : "สอบถาม");

  // ✅ ให้รูปแรกสุดรูปเดียวเท่านั้นที่เป็น high เพื่อไม่แย่งเน็ต
  const isPriorityLCP = idx === 0;

  return `
    <div class="vip-card-item ${idx === 0 ? "active-glow" : ""}" data-profile-id="${p.id}" data-profile-slug="${slug}">
      <span class="vip-status-chip"><span aria-hidden="true">🟢</span> ${statusLabel}</span>
      <span class="hot-rank-badge">${rankBadge}</span>
      <img src="${imgSrc}" 
           alt="${escapeHTML(p.displayName)} ฟิวแฟน${escapeHTML(locationText)}" 
           width="175" 
           height="245" 
           loading="${isPriorityLCP ? "eager" : "lazy"}"
           fetchpriority="${isPriorityLCP ? "high" : "low"}"
           decoding="async" 
           onerror="this.onerror=null; this.src='${DEFAULT_FALLBACK_IMG}';">
      <div class="vip-card-overlay"></div>
      <a href="/sideline/${slug}" class="card-link" aria-label="ดูโปรไฟล์ ${escapeHTML(p.displayName)}"></a>
      <div class="vip-card-info">
        <strong class="vip-name" style="margin:0; font-size:14px; font-weight:900; display:block;">${escapeHTML(p.displayName)}</strong>
        <div class="vip-location">${escapeHTML(locationText)}</div>
      </div>
    </div>
  `;
}).join("");
    }

  function executeFilterAndRender(isUserTriggered = true) {
  try {
    ensureAllProfilesNormalized();
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

    // 🟢 ถ้าผู้ใช้อยู่หน้าย่าน/จังหวัดเดิม แล้วค้นหาจังหวัดอื่น ให้พาย้ายหน้าไปจังหวัดนั้นทันที
    if (isUserTriggered && activeProvince !== "all" && activeProvince !== "national" && activeProvince !== window.currentProvinceSlug) {
      const searchKeyword = (domCache.searchInput?.value || "").trim();
      const queryParam = searchKeyword ? `?q=${encodeURIComponent(searchKeyword)}` : "";
      window.location.href = `/location/${activeProvince}${queryParam}`;
      return;
    }

    const ZONE_SLUG_MAP = {
      // --- 1. เชียงใหม่ ---
      "nimman": "นิมมาน", "nimmanhaemin": "นิมมาน",
      "jedyod": "เจ็ดยอด", "jed-yod": "เจ็ดยอด",
      "santitham": "สันติธรรม",
      "changphueak": "ช้างเผือก", "changphuak": "ช้างเผือก",
      "cmu": "หลัง มช.", "langmor": "หลัง มช.", "lang-mor": "หลัง มช.",
      "front-cmu": "หน้า มช.", "namor": "หน้า มช.", "na-mor": "หน้า มช.",
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
      "sankamphaeng": "สันกำแพง", "saraphi": "สารภี", "doisaket": "ดอยสะเก็ด",

      // --- 2. กรุงเทพมหานคร ---
      "sukhumvit": "สุขุมวิท", "ratchada": "รัชดา", "huaikhwang": "ห้วยขวาง", "huai-khwang": "ห้วยขวาง",
      "ladprao": "ลาดพร้าว", "thonglor": "ทองหล่อ", "thong-lor": "ทองหล่อ", 
      "ekkamai": "เอกมัย", "ekamai": "เอกมัย",
      "sathorn": "สาทร", "silom": "สีลม", "bangna": "บางนา", "bang-na": "บางนา",
      "ramintra": "รามอินทรา", "rama9": "พระราม 9", "rama-9": "พระราม 9", "ari": "อารีย์",

      // --- 3. ชลบุรี / พัทยา ---
      "pattaya": "พัทยา", "pattaya-klang": "พัทยากลาง", "pattaya-tai": "พัทยาใต้",
      "jomtien": "หาดจอมเทียน", "hat-jomtien": "หาดจอมเทียน", 
      "bangsaen": "บางแสน", "bang-saen": "บางแสน",
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
      "kku-front": "หน้า มข.", "namor-kku": "หน้า มข.", 
      "nonmuang": "โนนม่วง", "non-muang": "โนนม่วง",
      "central-khonkaen": "เซ็นทรัลขอนแก่น", "buengkaennakhon": "บึงแก่นนคร",
      "m-phak-area": "ม.ภาค", "m-phak": "ม.ภาค", "mittraphap": "ถนนมิตรภาพ", "sila": "ศิลา",

      // --- 6. เชียงราย ---
      "mueang-chiangrai": "ตัวเมืองเชียงราย", 
      "baandu": "บ้านดู่", "ban-du": "บ้านดู่",
      "mfu": "หน้า มฟล.", "na-mfu": "หน้า มฟล.", "mae-fah-luang": "หน้า มฟล.",
      "clock-tower": "หอนาฬิกา", "hor-nalika": "หอนาฬิกา", "night-bazaar": "ไนท์บาซาร์",
      "den-ha": "เด่นห้า", "rop-wiang": "รอบเวียง", "rim-kok": "ริมกก",
      "chiangrai-airport": "สนามบินเชียงราย", "maesai": "แม่สาย", "mae-sai": "แม่สาย",

      // --- 7. ลำปาง ---
      "mueang-lampang": "ตัวเมืองลำปาง", "suan-dok": "สวนดอก", "rop-wiang-lampang": "รอบเวียง",
      "lpru": "ม.ราชภัฏลำปาง", "rajabhat-lampang": "ม.ราชภัฏลำปาง", 
      "sob-tui": "สบตุ๋ย", "sobtui": "สบตุ๋ย",
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
      "hatyai": "ตัวเมืองหาดใหญ่", "mueang-hatyai": "ตัวเมืองหาดใหญ่", "hat-yai": "ตัวเมืองหาดใหญ่", "kho-hong": "คอหงส์",
      "psu": "ม.อ.หาดใหญ่", "lee-gardens": "ลีการ์เดนส์", "dannok": "ด่านนอก", "mueang-songkhla": "ตัวเมืองสงขลา",

      // --- 14. สุราษฎร์ธานี / เกาะสมุย ---
      "mueang-surat": "ตัวเมืองสุราษฎร์", "samui": "เกาะสมุย", "koh-samui": "เกาะสมุย",
      "chaweng": "เฉวง", "lamai": "ละไม", "bophut": "บ่อผุด", "phangan": "เกาะพะงัน"
    };

  let rawTargetZone = (urlZone || window.currentZoneSlug || "").trim();
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

    // 🟢 ถ้าผู้ใช้กดเลือกหมวดหมู่แท็บ (เช่น #ฟิวแฟน) ให้แสดงคนทั้งหมด ห้ามตัด Hot Profiles ทิ้ง
    const isPillFiltered = appState.activePillTag && appState.activePillTag !== "all";

    if (window.__hotProfileIds && window.__hotProfileIds.size > 0 && !currentCriteria.text && (!currentCriteria.zone || currentCriteria.zone === "ทั้งหมด") && !isPillFiltered) {
      results = results.filter(p => !window.__hotProfileIds.has(String(p.id)));
    }

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
        const loc = (p.location || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
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
        if (filterTag === "เอ็นเตอร์เทน") return combined.includes("เอ็น") || /\ben\b/i.test(combined) || combined.includes("ชงเหล้า") || combined.includes("ปาร์ตี้");
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

    // 5.1 กรองเฉพาะโปรไฟล์แนะนำ
    if (currentCriteria.featured) {
      results = results.filter(p => Boolean(p.isfeatured || p.is_featured));
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

window.executeFilterAndRender = executeFilterAndRender;

  
 if (!window.__logoClickRegistered) {
    window.__logoClickRegistered = true;
    document.addEventListener('click', (e) => {
      if (e.target.closest('.luxe-star-crest, .star, .dancing-neon-star')) return;

      const logoEl = e.target.closest('.brand-luxe-logo');
      if (!logoEl) return;

      if (typeof triggerHaptic === 'function') triggerHaptic('light');

      // ⚡ เช็คก่อนว่า Lightbox เปิดอยู่จริงไหม ถ้าไม่เปิดก็ไม่ต้องสั่งปิดให้เสียเวลาคำนวณ
      const lightboxModal = document.getElementById("lightbox");
      if (lightboxModal && lightboxModal.classList.contains("active") && typeof window.closeLightboxModal === 'function') {
        window.closeLightboxModal(false);
      }

      const isHome = (window.location.pathname === '/' || window.location.pathname === '') && !window.location.search;
      if (isHome) {
        e.preventDefault();
        // ⚡ แยกการเลื่อนจอไปทำในเฟรมถัดไป เพื่อให้ Next Paint ตอบสนองทันทีใน 0 ms
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      } else {
        e.preventDefault();
        window.location.href = '/';
      }
    }, { capture: true });
  }

// 🟢 โค้ดที่ต้องแก้ไข (ภายในฟังก์ชัน renderDisplayArea ใน main.js):
async function renderDisplayArea(profiles, isFilteredOrLocationView) {
  if (!domCache.profilesDisplayArea) return;
  
  const hasExistingSSR = domCache.profilesDisplayArea.querySelector(".profile-card-new");
  const hasSearchQuery = Boolean(domCache.searchInput?.value?.trim());
  const isPillFiltering = appState.activePillTag && appState.activePillTag !== "all";

  // หากเปิดหน้าแรกครั้งแรก มี SSR แล้ว และไม่ได้ค้นหาหรือกดแท็บฟิลเตอร์ ค่อยข้าม
  if (hasExistingSSR && (appState.renderId || 0) === 0 && !hasSearchQuery && !isPillFiltering && !isFilteredOrLocationView) {
    appState.renderId = 1;
    return;
  }

  appState.renderId = (appState.renderId || 0) + 1;
  const activeRenderId = appState.renderId;
 

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
    
  const isExplicitLocationPath = window.location.pathname.includes("/location/") || 
                                 window.location.pathname.includes("/province/") ||
                                 window.location.pathname.startsWith("/profiles");

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

    // 🟢 5. กรณีหน้าแรกทั่วไป: ตัดคนที่ชื่อซ้ำข้ามจังหวัดออก ให้เหลือแค่ 1 คนต่อ 1 รูป
    } else {
      const sortedProfiles = [...profiles].sort((a, b) => {
        if (a.isfeatured && !b.isfeatured) return -1;
        if (!a.isfeatured && b.isfeatured) return 1;
        return 0;
      });
      const feedProfiles = deduplicateProfilesByName(sortedProfiles);

      const cityHubsHtml = `
        <section class="national-city-hubs-section" style="margin-top: 10px; margin-bottom: 24px;">
          <div class="featured-header-clean-row" style="margin-bottom: 12px;">
            <div class="featured-title-flex">
              <span class="section-tag-mini"><i class="fas fa-map-marked-alt"></i> พื้นที่หลัก</span>
              <h2 class="clean-section-h2" style="font-size: 16px; margin: 0;">เลือกพื้นที่บริการ <span class="province-name-highlight">ครอบคลุมทั่วไทย</span></h2>
            </div>
            <a href="/locations" style="color: #7C3AED; font-size: 11.5px; font-weight: 800; text-decoration: none;">ดูทั้งหมด &rarr;</a>
          </div>
         <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
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
            <a href="/location/chiangrai" style="background:#FFF; border:1.5px solid rgba(124,58,237,0.15); border-radius:14px; padding:10px 12px; text-decoration:none; display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px;">📍</span><strong style="color:#140F22; font-size:12.5px;">เชียงราย</strong>
            </a>
           <a href="/location/lampang" style="background:#FFF; border:1.5px solid rgba(124,58,237,0.15); border-radius:14px; padding:10px 12px; text-decoration:none; display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px;">📍</span><strong style="color:#140F22; font-size:12.5px;">ลำปาง</strong>
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
                <span>#ฟิวแฟนแท้ (${feedProfiles.length} โปรไฟล์)</span>
            </span>
        </div>
        <div class="profile-grid profiles-grid-row"></div>
      `;

      domCache.profilesDisplayArea.innerHTML = "";
      domCache.profilesDisplayArea.appendChild(wrapper);
      const gridContainer = wrapper.querySelector(".profile-grid");
      const cleanProfilesList = deduplicateProfilesByName(profiles);
      await renderProfilesBatch(gridContainer, cleanProfilesList, activeRenderId);
    }
    }

function initLazyGoogleMap(provinceName = "", currentSlug = "") {
    const mapIframe = document.getElementById("google-map");
    if (!mapIframe || mapIframe.dataset.mapBound === "true") return;
    if (!mapIframe.src || mapIframe.src === "about:blank" || mapIframe.src.endsWith("about:blank")) {
      mapIframe.dataset.mapBound = "true";
      const isAllOrNational = !currentSlug || currentSlug === "national" || currentSlug === "all";
      const serverDataSrc = mapIframe.getAttribute("data-src");
      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      const isSubZone = Boolean(window.currentZoneSlug) || (pathSegments.length >= 3 && pathSegments[0] === "location");
      const currentZone = window.currentZoneSlug || (isSubZone && pathSegments[2] ? decodeURIComponent(pathSegments[2]) : "");
      const targetName = isAllOrNational ? "ทั่วไทย" : (provinceName || "ทั่วไทย");
      const zoom = isAllOrNational ? 6 : (currentZone ? 14 : 12);
      const queryText = isAllOrNational ? "ประเทศไทย" : `จังหวัด${targetName}${currentZone ? ` ${currentZone}` : ""}`;
      const targetMapSrc = serverDataSrc || `https://maps.google.com/maps?q=${encodeURIComponent(queryText)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              mapIframe.src = targetMapSrc;
              observer.disconnect();
            }
          });
        }, { rootMargin: "250px" });
        observer.observe(mapIframe);
      } else {
        mapIframe.src = targetMapSrc;
      }
    }
  }
  
  function replaceDomPlaceholders(provinceName, count, currentSlug) {
    const isAllOrNational = !currentSlug || currentSlug === "national" || currentSlug === "all";
    
    const totalCount = isAllOrNational 
      ? (window.totalProfilesCount || appState.allProfiles?.length || 0) 
      : (typeof count === "number" ? count : (appState.filteredProfiles?.length || 0));

    // อัปเดตตัวเลขจำนวนโปรไฟล์สด
    const liveCounterEl = document.getElementById("live-profile-count");
    if (liveCounterEl) {
      liveCounterEl.textContent = `${totalCount}`;
    }

    // 🟢 2. อัปเดต aria-label บน #hero-section ทันที
    const heroSectionEl = document.getElementById("hero-section");
    if (heroSectionEl) {
      const targetName = isAllOrNational ? "ทั่วไทย" : (provinceName || "ทั่วไทย");
      const zoneSlug = window.currentZoneSlug ? String(window.currentZoneSlug).trim() : "";

      const dynamicAria = isAllOrNational
        ? "ศูนย์รวมสาวรับงานและไซด์ไลน์ทั่วไทย"
        : (zoneSlug
            ? `สาวรับงานและไซด์ไลน์${targetName} โซน${zoneSlug}`
            : `ศูนย์รวมสาวรับงานและไซด์ไลน์${targetName}`);

      heroSectionEl.setAttribute("aria-label", dynamicAria);
    }

    // 🟢 3. จัดการ Google Map Iframe Lazy Load
    initLazyGoogleMap(provinceName, currentSlug);
    
    // 🟢 4. จัดการตัวนับจำนวนจังหวัด (Live Province Count)
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const isSubZone = Boolean(window.currentZoneSlug) || (pathSegments.length >= 3 && pathSegments[0] === "location");
    const liveProvinceEl = document.getElementById("live-province-count");
    const targetName = isAllOrNational ? "ทั่วไทย" : (provinceName || "ทั่วไทย");

    if (liveProvinceEl) {
      if (isSubZone) {
        liveProvinceEl.textContent = "1";
      } else {
        const totalProvincesCount = appState.provincesMap.size || (window.provincesData ? window.provincesData.length : 6);
        liveProvinceEl.textContent = isAllOrNational ? `${totalProvincesCount}` : "1";
      }
    }

    // 🟢 5. ซิงค์หัวข้อ H2 น้องแนะนำให้ตรงกับ SSR
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

    if (isEN) return;

    // 🟢 6. อัปเดตเนื้อหา SEO Drawer สำหรับหน้ารายจังหวัด
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
    ensureAllProfilesNormalized();
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
  rawPath = "https://res.cloudinary.com/dduxw7k4/image/upload/e_blur:1500,w_400,h_560,c_fill/v1790435086/images/tdzubsqfcfdfmfqvuog0.png";
}
    const imgSrc = (p.images && p.images[0] && (p.images[0].cardSrc || p.images[0].src) && !p.images[0].src.includes("firstmodelhub.webp")) 
      ? (p.images[0].cardSrc || p.images[0].src)
      : optimizeImg(rawPath, "card");
    
    const pKey = (p.provinceKey || p.province_slug || "national").toString().toLowerCase();
    let rawName = p.displayName || p.name || "Model";
    const modelName = isEN ? (p.name_en || rawName.replace(/^(น้อง|สาว|พี่)\s?/gi, "").trim()) : formatDisplayName(rawName);
    
    
    const ageDisplay = p.safeAgeDisplay || (p.age && !["-", "0", "ไม่ระบุ"].includes(String(p.age).trim()) ? `${p.age} ปี` : "");
    let rawLoc = String(isEN ? (PROVINCE_EN_MAP[pKey] || p.location || "Thailand") : (p.location || p.provinceNameThai || "ทั่วไทย"));
    let locName = "";
    const JUNK_LOCS = ["ใกล้เคียง", "พื้นที่ใกล้เคียง", "และใกล้เคียง", "ในพื้นที่ใกล้เคียง"];
    const activeZone = window.currentZoneSlug ? window.currentZoneSlug.trim() : "";
    if (activeZone) {
      locName = activeZone;
    } else {
      const tokens = rawLoc
        .split(/[,/]|และใกล้เคียง|และ/)
        .map(s => s.replace(/^(โซน|ย่าน)\s*/gi, "").replace(/\.+$/, "").trim())
        .filter(s => s && !JUNK_LOCS.includes(s));
      locName = tokens[0] || (p.provinceNameThai || "ทั่วไทย");
      if (/^(ในตัวเมือง|ตัวเมือง|ในเมือง)$/.test(locName)) {
        locName = `ในเมือง${p.provinceNameThai || ""}`;
      }
    }

    const isOnline = p.isAvailable !== undefined 
      ? Boolean(p.isAvailable) 
      : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "busy", "off"].some(s => String(p.availability || p.status || "").toLowerCase().includes(s));
      
    const statusClass = isOnline ? "status-online" : "status-busy";
    const availText = isEN ? (isOnline ? "Available" : "Inquire") : (isOnline ? "รับงาน" : "สอบถาม");
    const luxuryPrice = formatLuxuryRate(p.rate || p._price || p.price);
    const profileSlug = encodeURIComponent(p.slug || p.id);

    // 🟢 แปลงแท็ก #ฟิลแฟน ให้เป็น #ฟิวแฟน มาตรฐานเดียวทั้งระบบ
    const rawTags = Array.isArray(p.styleTags) ? p.styleTags : (Array.isArray(p.style_tags) ? p.style_tags : []);
    const cleanTags = rawTags
      .map(t => String(t).replace(/^#+/, "").trim())
      .map(t => (t === "ฟิลแฟน" || t === "ฟีลแฟน" || t === "ฟิวเเฟน" || t === "gfe") ? "ฟิวแฟน" : t)
      .filter(t => t && !t.includes("รับงาน") && !t.includes("ไซด์ไลน์") && t.length <= 8)
      .map(t => {
        if (!isEN) return t;
        const tagMap = {
          "ตรงปก": "Verified", "น่ารัก": "Cute", "ผิวขาว": "Fair", "ตัวเล็ก": "Petite",
          "ฟิวแฟน": "GFE", "เอาใจเก่ง": "Caring", "คุยสนุก": "Friendly",
          "สายฝอ": "Exotic", "อวบ": "Curvy", "ไม่เร่งรีบ": "Relaxed"
        };
        return tagMap[t] || t;
      });

    const defaultTag = isEN ? "#GFE" : "#ฟิวแฟน";
    const vibeTagsHtml = cleanTags.length > 0
      ? cleanTags.slice(0, 2).map(t => `<span class="card-vibe-pill">#${escapeHTML(t)}</span>`).join("")
      : `<span class="card-vibe-pill">${defaultTag}</span>`;

    const isFiwFan = rawTags.some(t => {
      const cleanTag = String(t).replace(/^#+/, "").trim().toLowerCase();
      return cleanTag === "ฟิวแฟน" || cleanTag === "ฟิลแฟน" || cleanTag === "gfe" || cleanTag.includes("ฟิวแฟน");
    });

    let rightBadgeHtml = "";
    if (isFiwFan) {
      rightBadgeHtml = `<span class="badge-hot-tag"><span aria-hidden="true">🔥</span> HOT</span>`;
    } else if (p.isVerified) {
      rightBadgeHtml = `<span class="badge-verified-top"><span aria-hidden="true">✦</span> ตรงปก</span>`;
    } else {
      rightBadgeHtml = `<span class="badge-verified-top" style="background: rgba(124, 58, 237, 0.08); color: #7C3AED;"><span aria-hidden="true">✨</span> แนะนำ</span>`;
    }

    const viewProfileAria = isEN ? `View profile of ${modelName}` : `ดูโปรไฟล์ ${modelName}`;
    const richAltText = `${modelName} โซน${locName} ${p.provinceNameThai || 'เชียงใหม่'} - FirstModelHub`;

    const rawLikes = p.likes_count || p.likes || 0;
    const likesText = rawLikes > 0 ? (rawLikes + " 💗") : "แนะนำ 💗";

    const article = document.createElement("div");
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
       sizes="(max-width: 600px) 48vw, (max-width: 1024px) 33vw, 300px"
           style="width: 100%; height: 100%; object-fit: cover; aspect-ratio: 400/560;" 
           loading="${index < 4 ? "eager" : "lazy"}" 
           fetchpriority="auto"
           decoding="async" 
          onerror="this.onerror=null; this.src='${DEFAULT_FALLBACK_IMG}';" />

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
          
          <div class="profile-card-social-strip">
            <span class="social-badge-likes">
              <i class="fas fa-heart" aria-hidden="true"></i>
              <span>${likesText}</span>
            </span>
          </div>

          <div class="profile-card-title-row"> 
            <strong class="profile-card-name">${escapeHTML(modelName)}</strong> 
            <span class="profile-card-age-tag">${ageDisplay}</span> 
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

  // 3. ค้นหาช่วงบรรทัด ~725 ใน main.js (ฟังก์ชัน renderProfilesBatch) แทนที่ด้วย:
async function renderProfilesBatch(containerEl, profilesList, renderId) {
  if (!containerEl || !profilesList) return;
  containerEl.dataset.activeRenderId = renderId;
  containerEl.innerHTML = "";

  const BATCH_SIZE = 4; // วาดเฉพาะ 4 คนแรก (2 แถวบนจอมือถือ) ให้เสร็จในพริบตา
  const firstBatch = profilesList.slice(0, BATCH_SIZE);
  const remainingBatch = profilesList.slice(BATCH_SIZE);

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < firstBatch.length; i++) {
    if (renderId !== undefined && Number(containerEl.dataset.activeRenderId) !== renderId) return;
    fragment.appendChild(createProfileCardDOM(firstBatch[i], i));
  }
  containerEl.appendChild(fragment);

  // ที่เหลือทยอยวาดทีละ 6 ใบต่อเฟรม ไม่ให้เกิดอาการค้างบนมือถือ
  if (remainingBatch.length > 0) {
    let offset = 0;
    const CHUNK = 6;
    const renderNextChunk = () => {
      if (renderId !== undefined && Number(containerEl.dataset.activeRenderId) !== renderId) return;
      const restFragment = document.createDocumentFragment();
      const limit = Math.min(offset + CHUNK, remainingBatch.length);
      for (let j = offset; j < limit; j++) {
        restFragment.appendChild(createProfileCardDOM(remainingBatch[j], BATCH_SIZE + j));
      }
      containerEl.appendChild(restFragment);
      offset = limit;
      if (offset < remainingBatch.length) {
        requestAnimationFrame(renderNextChunk);
      }
    };
    setTimeout(() => requestAnimationFrame(renderNextChunk), 16);
  }
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

  function syncLightboxGalleryUI() {
    const fallbackImg = (typeof DEFAULT_FALLBACK_IMG !== "undefined")
      ? DEFAULT_FALLBACK_IMG
      : "https://firstmodelhub.com/images/firstmodelhub.webp";
    const displayName = window.__lightboxModelName || "Model";

    const dotsContainer = document.getElementById("lightbox-dots-indicator");
    const counterBadge = document.getElementById("lightbox-photo-counter");
    const thumbStrip = document.getElementById("lightboxThumbnailStrip");

    if (currentActivePhotoList.length > 1) {
      if (dotsContainer) {
        dotsContainer.innerHTML = currentActivePhotoList.map((_, i) =>
          `<span class="gallery-dot ${i === currentActivePhotoIdx ? 'active' : ''}"></span>`
        ).join("");
        dotsContainer.style.display = "flex";
      }
      if (counterBadge) {
        counterBadge.innerHTML = `<i class="fas fa-camera" style="font-size: 10px;"></i> <span>${currentActivePhotoIdx + 1}/${currentActivePhotoList.length}</span>`;
        counterBadge.style.display = "flex";
      }
      if (thumbStrip) {
        thumbStrip.style.cssText = "display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding: 2px 2px 6px 2px; -webkit-overflow-scrolling: touch;";
        thumbStrip.innerHTML = currentActivePhotoList.map((img, i) => `
          <div class="lightbox-thumb-item ${i === currentActivePhotoIdx ? "active" : ""}" data-thumb-idx="${i}" style="width: 58px; height: 76px; border-radius: 10px; overflow: hidden; flex-shrink: 0; cursor: pointer; border: 2px solid ${i === currentActivePhotoIdx ? "#7C3AED" : "transparent"}; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <img src="${img.src || fallbackImg}" alt="${escapeHTML(displayName)} รูปที่ ${i + 1}" width="58" height="76" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
          </div>
        `).join("");

        thumbStrip.querySelectorAll(".lightbox-thumb-item").forEach(item => {
          item.onclick = function (e) {
            e.stopPropagation();
            const idx = parseInt(this.getAttribute("data-thumb-idx"), 10);
            updateLightboxPhoto(idx);
          };
        });
      }
    } else {
      if (dotsContainer) { dotsContainer.innerHTML = ""; dotsContainer.style.display = "none"; }
      if (counterBadge) { counterBadge.innerHTML = ""; counterBadge.style.display = "none"; }
      if (thumbStrip) { thumbStrip.innerHTML = ""; thumbStrip.style.display = "none"; }
    }
  }



  function updateLightboxPhoto(idx) {
    if (!currentActivePhotoList || currentActivePhotoList.length === 0) return;

    if (idx < 0) idx = currentActivePhotoList.length - 1;
    if (idx >= currentActivePhotoList.length) idx = 0;

    currentActivePhotoIdx = idx;
    const heroImg = document.getElementById("lightboxHeroImage");
    if (!heroImg) return;

    if (typeof triggerHaptic === "function") triggerHaptic("light");

    const photoObj = currentActivePhotoList[idx] || {};
    const nextSrc = photoObj.fullSrc || photoObj.src || "https://firstmodelhub.com/images/firstmodelhub.webp";

    heroImg.style.opacity = "0.3";
    heroImg.style.transform = "scale(0.98)";

    const preloader = new Image();
    preloader.onload = () => {
      heroImg.src = nextSrc;
      heroImg.style.opacity = "1";
      heroImg.style.transform = "scale(1)";
    };
    preloader.onerror = () => {
      // ถ้ารูปนี้ 404 และยังมีรูปอื่นเหลือ ให้ลบรูปนี้ออกแล้วข้ามไปรูปถัดไปแทน (ไม่แสดงโลโก้ FX!)
      if (currentActivePhotoList.length > 1) {
        const pos = currentActivePhotoList.indexOf(photoObj);
        if (pos !== -1) currentActivePhotoList.splice(pos, 1);
        const nextValidIdx = Math.min(idx, currentActivePhotoList.length - 1);
        syncLightboxGalleryUI();
        updateLightboxPhoto(nextValidIdx);
        return;
      }
      heroImg.src = "https://firstmodelhub.com/images/firstmodelhub.webp";
      heroImg.style.opacity = "1";
      heroImg.style.transform = "scale(1)";
    };
    preloader.src = nextSrc;

    const thumbStrip = document.getElementById("lightboxThumbnailStrip");
    if (thumbStrip) {
      thumbStrip.querySelectorAll(".lightbox-thumb-item").forEach((t, i) => {
        const isActive = (i === idx);
        t.classList.toggle("active", isActive);
        t.style.borderColor = isActive ? "#7C3AED" : "transparent";
        if (isActive) t.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    }

    const dotsContainer = document.getElementById("lightbox-dots-indicator");
    if (dotsContainer) {
      dotsContainer.querySelectorAll(".gallery-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === idx);
      });
    }

    const counterBadge = document.getElementById("lightbox-photo-counter");
    if (counterBadge && currentActivePhotoList.length > 1) {
      counterBadge.innerHTML = `<i class="fas fa-camera" style="font-size: 10px;"></i> <span>${idx + 1}/${currentActivePhotoList.length}</span>`;
    }
  }
    
    function initLightboxImageSwipe() {
    const heroContainer = document.querySelector(".lightbox-hero-container");
    if (!heroContainer || heroContainer.dataset.swipeBound === "true") return;
    heroContainer.dataset.swipeBound = "true";

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    // 🟢 [เพิ่ม] เก็บพิกัดเริ่มต้นตอนนิ้วแตะจอ
    heroContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchEndX = touchStartX;
      touchEndY = touchStartY;
      isSwiping = false;
    }, { passive: true });

    // 🟢 [เพิ่ม] อัปเดตพิกัดตามการลากนิ้ว เพื่อเช็คว่าเป็นการปัด (Swipe) หรือแค่แตะ (Tap)
    heroContainer.addEventListener("touchmove", (e) => {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
      if (Math.abs(touchEndX - touchStartX) > 10 || Math.abs(touchEndY - touchStartY) > 10) {
        isSwiping = true;
      }
    }, { passive: true });

    heroContainer.addEventListener("touchend", (e) => {
      // 🔒 ถ้ามีรูปเดียว ไม่ต้องคำนวณการปัดหรือแตะรูปใดๆ ทั้งสิ้น ป้องกันตัวเลขเด้ง
      if (!currentActivePhotoList || currentActivePhotoList.length <= 1) return;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // 1. ตรวจจับการปัดนิ้วซ้าย / ขวา (Swipe)
      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
        if (diffX < 0) {
          updateLightboxPhoto(currentActivePhotoIdx + 1);
        } else {
          updateLightboxPhoto(currentActivePhotoIdx - 1);
        }
      } 
      // 2. ตรวจจับการแตะรูปซ้าย/ขวา
      else if (!isSwiping && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
        if (e.target.closest(".lightbox-dots-wrapper, .lightbox-top-brand, .lightbox-close-circle-btn, .sheet-drag-pill-bar")) {
          return;
        }
        const rect = heroContainer.getBoundingClientRect();
        const tapX = touchEndX - rect.left;
        if (tapX < rect.width * 0.35) {
          updateLightboxPhoto(currentActivePhotoIdx - 1);
        } else {
          updateLightboxPhoto(currentActivePhotoIdx + 1);
        }
      }
    }, { passive: true });
    
    heroContainer.addEventListener("click", (e) => {
      if (e.pointerType === "touch") return; // ข้ามถ้ารับสัมผัสมาจากทัชสกรีนแล้ว
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
  
function generateModalPersonaBox(profile, displayName, provName, zoneName) {
  let rawPersonalDesc = (profile._sanitized ? (profile.description || "") : sanitizeThaiText(profile.description || ""))
    .replace(/เรทราคา|รายละเอียดค่ะ|1500\/1/gi, "")
    .replace(/[ฃ͡➴˚˳*•ㅅ•づ♡]+/g, "")
    .trim();

  const speechText = (rawPersonalDesc.length >= 8) 
    ? rawPersonalDesc 
    : "ยินดีที่ได้รู้จักค่ะ ทักมาพูดคุยสอบถามคิวหรือนัดเวลาล่วงหน้าได้เลยนะคะ เทคแคร์เป็นกันเอง ไม่ดุค่ะ";

  const profileIdStr = String(profile.id || "1");
  const isVariantB = profileIdStr.charCodeAt(profileIdStr.length - 1) % 2 === 0;

  const introText = isVariantB 
    ? "รายละเอียดสัดส่วนและพิกัดบริการอัปเดตล่าสุด น้องน่ารัก นิสัยเฟรนด์ลี่ พูดเพราะ เทคแคร์เป็นกันเอง สบายใจได้กับการนัดเจอตัวจริงตรงปกแล้วค่อยจ่ายค่าขนมหน้างาน ไม่มีมัดจำล่วงหน้าค่ะ"
    : "ข้อมูลโปรไฟล์และรูปถ่ายได้รับการตรวจสอบตัวตนเรียบร้อยแล้ว น้องเป็นคนอารมณ์ดี คุยสนุก สไตล์ฟิวแฟนแท้ มั่นใจในความปลอดภัยด้วยระบบนัดเจอเช็คความตรงปกหน้างานก่อนค่อยจ่ายเงินค่ะ";

  const styleText = isVariantB
    ? "เพื่อนเที่ยวฟิวแฟน: นิสัยขี้อ้อน อัธยาศัยดี ชวนคุยสนุก เทคแคร์ฟีลแฟนตัวจริง ผ่อนคลาย ไม่เร่งรอบตลอดเวลานัดหมาย"
    : "สไตล์ฟิวแฟน & เที่ยวคาเฟ่: สุภาพ น่ารัก เอาใจเก่ง เหมาะสำหรับเดินเที่ยว ทานข้าว คาเฟ่ หรือพักผ่อนส่วนตัว";

  const locationText = isVariantB
    ? `การเดินทาง: สแตนด์บายอยู่ในย่าน${zoneName} พร้อมเดินทางไปหาที่โรงแรมหรือคอนโดส่วนตัวของคุณได้ทันที ตกลงเวลานัดหมายล่วงหน้าได้เลยค่ะ`
    : `พิกัดให้บริการ: มีห้องพักส่วนตัวย่าน${zoneName} หรือพร้อมเดินทางไปหาถึงโรงแรมและที่พักในย่านใกล้เคียงอย่างรวดเร็วและเป็นส่วนตัวค่ะ`;

  const safetyText = isVariantB
    ? "การันตีความปลอดภัย: จ่ายเงินโดยตรงเมื่อเจอน้องตัวจริงหน้างานเรียบร้อยแล้วเท่านั้น ไม่มีโอนมัดจำล่วงหน้าทุกกรณี หากตัวจริงไม่ตรงปก ปฏิเสธยกเลิกได้ทันทีค่ะ"
    : "กฎเหล็กเพื่อความสบายใจ: พบตัวจริงก่อนแล้วค่อยชำระเงินตรงกับน้อง ห้ามโอนเงินล่วงหน้าทุกกรณี ปลอดภัย 100% ค่ะ";

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

  // ==============================================================================
  // 🟢 LIGHTBOX MODAL ENGINE (OPTIMIZED FOR ZERO-REFLOW & ULTRA-FAST INP < 40ms)
  // ==============================================================================
  let isLightboxCurrentlyOpen = false;

  window.openLightboxModal = function (profile) {
    if (!profile) return;
    const lightboxEl = document.getElementById("lightbox");
    const contentWrapperEl = document.getElementById("lightbox-content-wrapper-el");
    const scrollBodyEl = document.getElementById("lightboxScrollBody");
    const dockEl = document.querySelector(".floating-app-dock");
    if (!lightboxEl) return;

    clearTimeout(window.__lightboxCloseTimer);
    lightboxEl.dataset.isClosing = "false";

    const wasAlreadyOpen = isLightboxCurrentlyOpen;
    isLightboxCurrentlyOpen = true;

    lightboxEl.style.transition = "opacity 0.18s ease";
    lightboxEl.style.visibility = "visible";
    lightboxEl.style.pointerEvents = "auto";
    lightboxEl.setAttribute("aria-hidden", "false");
    lightboxEl.classList.add("active");
    lightboxEl.style.opacity = "1";

    if (contentWrapperEl) {
      contentWrapperEl.style.transition = "none";
      contentWrapperEl.style.transform = "translate3d(0, 0, 0) scale(1)";
      contentWrapperEl.style.opacity = "1";
    }

    if (dockEl) dockEl.classList.add("is-lightbox-hidden");
    if (wasAlreadyOpen && scrollBodyEl) {
      requestAnimationFrame(() => { scrollBodyEl.scrollTop = 0; });
    }

    // สั่นแบบเบาไม่ขวาง Thread
    if (typeof triggerHaptic === "function") triggerHaptic("light");

    // 🔒 3. เตรียมข้อมูลสำคัญ
    const fallbackImg = (typeof DEFAULT_FALLBACK_IMG !== "undefined") 
      ? DEFAULT_FALLBACK_IMG 
      : "https://firstmodelhub.com/images/firstmodelhub.webp";

    const isEn = document.documentElement.lang === "en" || window.location.pathname.includes("-en");
    const cleanName = (profile.name || profile.displayName || "สาวสวย").replace(/^(น้อง\s?)+/gi, "").trim();
    const displayName = isEn ? cleanName : `น้อง${cleanName}`;
    const pProvinceThai = profile.provinceThai || profile.provinceNameThai || "เชียงใหม่";
    const pProvText = pProvinceThai; 
    const pLocation = profile.location || pProvinceThai;
    const primaryZone = pLocation.replace(/^(ในตัวเมือง|ตัวเมือง|โซน|ย่าน)\s*(\/|และ)?\s*/gi, "").split(/[,/]|และใกล้/)[0].trim() || pProvText;
    const profileSlug = encodeURIComponent(profile.slug || profile.id);
    const canonicalProfileUrl = `https://firstmodelhub.com/sideline/${profileSlug}`;

    const isAvail = profile.isAvailable !== undefined
      ? Boolean(profile.isAvailable)
      : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "busy", "off"].some(s => String(profile.availability || "").toLowerCase().includes(s));
    
    const availStatus = isEn 
      ? (isAvail ? "Available Now" : "Inquire Schedule") 
      : (profile.availability || (isAvail ? "พร้อมรับงาน" : "สอบถามคิว"));
    const statusColor = isAvail ? "#059669" : "#E11D48";

    // ⚡ 4. หยอดข้อมูลส่วนหัวและสถานะ
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

    // ⚡ 5. จัดการรูปภาพหลักทันที (ไม่กระตุก ไม่ภาพวาบ)
    const rawImages = Array.isArray(profile.images) && profile.images.length > 0
      ? profile.images
      : [{ src: fallbackImg, fullSrc: fallbackImg }];

    const filteredImages = rawImages.filter(img => img && !(img.src || "").includes("firstmodelhub.webp"));
    currentActivePhotoList = filteredImages.length > 0 ? filteredImages : rawImages;
    currentActivePhotoIdx = 0;

    window.__lightboxModelName = displayName;
    window.__lightboxSessionId = Date.now();

    const heroImg = document.getElementById("lightboxHeroImage");
    if (heroImg) {
      heroImg.style.opacity = "1";
      heroImg.style.transform = "scale(1)";
     const firstPhoto = currentActivePhotoList[0] || {};
      const optimizedModalSrc = firstPhoto.fullSrc || firstPhoto.cardSrc || firstPhoto.src || fallbackImg;

      heroImg.onerror = function() {
        this.onerror = null;
        this.src = firstPhoto.src || fallbackImg;
      };
      heroImg.src = optimizedModalSrc;
      heroImg.alt = `${displayName} เพื่อนเที่ยวฟิวแฟน${pProvText} โซน${primaryZone} ตรงปก 100% - FirstModelHub`;
    }

    // ⚡ 6. แสดงข้อมูลสเปกเฉพาะที่มีจริง + อัตราค่าบริการ
    const safeAge = profile.safeAgeDisplay || (profile.age && !["-", "0", "ไม่ระบุ"].includes(String(profile.age).trim()) ? `${profile.age} ปี` : "");
    const safeStats = profile.safeStats || (profile.stats && !["-", "0", "ไม่ระบุ"].includes(String(profile.stats).trim()) ? profile.stats : "");
    const safeHeight = profile.safeHeight || (profile.height && !["-", "0", "ไม่ระบุ"].includes(String(profile.height).trim()) ? `${profile.height} ซม.` : "");
    const displayPrice = profile.displayPrice || (profile.rate ? `${parseInt(profile.rate, 10).toLocaleString()}.-` : "1,500.-");

    const statTiles = [
      safeAge ? `<div class="bento-stat-tile" style="background: #F0ECF8; border-radius: 14px; padding: 10px 4px; text-align: center;"><div style="font-size: 10.5px; color: #827894; font-weight: 700;">${isEn ? "Age" : "อายุ"}</div><div style="font-weight: 900; font-size: 14px; color: #140F22; margin-top: 2px;">${safeAge}</div></div>` : "",
      safeStats ? `<div class="bento-stat-tile" style="background: #F0ECF8; border-radius: 14px; padding: 10px 4px; text-align: center;"><div style="font-size: 10.5px; color: #827894; font-weight: 700;">${isEn ? "Stats" : "สัดส่วน"}</div><div style="font-weight: 900; font-size: 14px; color: #140F22; margin-top: 2px;">${safeStats}</div></div>` : "",
      safeHeight ? `<div class="bento-stat-tile" style="background: #F0ECF8; border-radius: 14px; padding: 10px 4px; text-align: center;"><div style="font-size: 10.5px; color: #827894; font-weight: 700;">${isEn ? "Height" : "ส่วนสูง"}</div><div style="font-weight: 900; font-size: 14px; color: #140F22; margin-top: 2px;">${safeHeight}</div></div>` : ""
    ].filter(Boolean);

    const detailsCompactEl = document.getElementById("lightboxDetailsCompact");
    if (detailsCompactEl) {
      detailsCompactEl.innerHTML = `
        ${statTiles.length > 0 ? `<div style="display: grid; grid-template-columns: repeat(${statTiles.length}, 1fr); gap: 8px; margin-bottom: 10px;">${statTiles.join("")}</div>` : ""}
        <div style="background: #F0ECF8; padding: 12px 14px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #4A4458; font-size: 12px; font-weight: 700;"><i class="fas fa-tag" style="color:#7C3AED; margin-right:4px;"></i> ${isEn ? "Rate" : "ค่าขนม"}</span>
                <span style="color: #059669; font-weight: 900; font-size: 15px;">${displayPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(0,0,0,0.08); padding-top: 6px;">
                <span style="color: #4A4458; font-size: 12px; font-weight: 700;"><i class="fas fa-map-marker-alt" style="color:#7C3AED; margin-right:4px;"></i> ${isEn ? "Location" : "พิกัดงาน"}</span>
                <span style="color: #140F22; font-weight: 800; font-size: 12.5px;">${pLocation}</span>
            </div>
        </div>
      `;
    }

    const parseFn = window.parseRateToNumber || ((r) => 1500);
    const rateNum = parseFn(profile._price || profile.rate || profile.price);
    const ratesGrid = document.getElementById("lightboxRatesGrid");
    if (ratesGrid) {
      const rate2Hrs = Math.round((rateNum * 1.8) / 100) * 100;
      const rateOvernight = Math.round((rateNum * 4.5) / 500) * 500;
      ratesGrid.innerHTML = `
        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 8px 4px; border-radius: 12px;">
          <div style="color: #64748B; font-size: 11px; font-weight: 800;">1 ชม.</div>
          <strong style="color: #059669; font-size: 14.5px; font-weight: 900;">${rateNum.toLocaleString()}.-</strong>
        </div>
        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 8px 4px; border-radius: 12px;">
          <div style="color: #64748B; font-size: 11px; font-weight: 800;">2 ชม. <span style="font-size: 9px; color:#8B5CF6;">(ประมาณการ)</span></div>
          <strong style="color: #059669; font-size: 14.5px; font-weight: 900;">${rate2Hrs.toLocaleString()}.-</strong>
        </div>
        <div style="background: #F8F6FC; border: 1px solid rgba(124, 58, 237, 0.1); padding: 8px 4px; border-radius: 12px;">
          <div style="color: #64748B; font-size: 11px; font-weight: 800;">ค้างคืน <span style="font-size: 9px; color:#8B5CF6;">(เริ่มต้น)</span></div>
          <strong style="color: #059669; font-size: 14.5px; font-weight: 900;">${rateOvernight.toLocaleString()}.-</strong>
        </div>
      `;
    }

    // ⚡ 7. ปุ่มติดต่อ LINE ติดขอบล่าง (พร้อมใช้ทันที)
    const rawLine = String(profile.line_id || profile.lineId || profile.line || "").trim();
    let lineUrl = "https://line.me/ti/p/u8Bz9HsaY8";
    if (rawLine) {
      if (rawLine.startsWith("http")) lineUrl = rawLine;
      else if (rawLine.startsWith("@")) lineUrl = `https://page.line.me/${rawLine.replace(/^@+/, "")}`;
      else lineUrl = `https://line.me/ti/p/~${rawLine.replace(/[^a-zA-Z0-9_\-\.]/g, "")}`;
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
          <button type="button" onclick="window.shareProfile('${escapeHTML(displayName)}', '${canonicalProfileUrl}')" aria-label="แชร์โปรไฟล์" style="width: 48px; height: 48px; border-radius: 14px; background: #F8F6FC; border: 1.5px solid rgba(124, 58, 237, 0.2); color: #7C3AED; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;">
              <i class="fas fa-share-alt" style="font-size: 16px;"></i>
          </button>
        </div>
      `;
    }

    // 🚀 STAGE 2: แบ่งการเรนเดอร์ส่วนล่างออกเป็น 2 เฟรมย่อย ไม่บล็อกเธรดหลัก
    const runDeferredStep2 = () => {
      const relatedTitle = document.getElementById("lightboxRelatedTitle");
      if (relatedTitle) {
        relatedTitle.textContent = isEn ? `Recommended Models in ${pProvText}` : `น้องๆ แนะนำเพิ่มเติมในโซน${pProvText}`;
      }

      const relatedGrid = document.getElementById("lightboxRelatedGrid");
      const relatedMore = document.getElementById("lightboxRelatedMoreLink");
      if (relatedGrid) {
        const pKey = (profile.provinceKey || profile.province_slug || "chiangmai").toLowerCase();
        const rawPool = appState.rawList.length > 0 ? appState.rawList : (window.profilesData || []);
        const sameRaw = [];
        const otherRaw = [];

        for (let i = 0; i < rawPool.length; i++) {
          const item = rawPool[i];
          if (!item || String(item.id) === String(profile.id)) continue;
          const itemProv = String(item.provinceKey || item.province_slug || "").toLowerCase();
          if (itemProv === pKey) {
            if (sameRaw.length < 3) sameRaw.push(item);
          } else {
            if (otherRaw.length < 3) otherRaw.push(item);
          }
          if (sameRaw.length >= 3 && otherRaw.length >= 3) break;
        }

        let candidatesRaw = [...sameRaw, ...otherRaw];
        if (candidatesRaw.length < 6) {
          for (let i = 0; i < rawPool.length && candidatesRaw.length < 6; i++) {
            const item = rawPool[i];
            if (item && String(item.id) !== String(profile.id) && !candidatesRaw.includes(item)) {
              candidatesRaw.push(item);
            }
          }
        }

        const candidates = candidatesRaw.map(r => getOrNormalizeProfile(r.id, r.slug) || r).filter(Boolean);
        if (candidates.length > 0) {
          relatedGrid.innerHTML = candidates.map(rm => {
            const rmName = rm.displayName || formatDisplayName(rm.name || "สาวสวย");
            const rmImg = rm.images && rm.images[0] ? (rm.images[0].src || rm.images[0]) : optimizeImg(rm.imagePath || "", "card");
            const rmSlug = encodeURIComponent(rm.slug || rm.id);
            return `
              <div class="lightbox-related-item" data-profile-id="${rm.id}" data-profile-slug="${rmSlug}" style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1.5px solid rgba(124, 58, 237, 0.12); text-align: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <img src="${rmImg}" alt="${escapeHTML(rmName)}" loading="lazy" decoding="async" width="100" height="125" style="width: 100%; aspect-ratio: 4/5; object-fit: cover; display: block;">
                <div style="padding: 6px 2px; font-size: 11px; font-weight: 800; color: #140F22;">${escapeHTML(rmName)}</div>
              </div>
            `;
          }).join("");

          relatedGrid.onclick = function (e) {
            const card = e.target.closest(".lightbox-related-item");
            if (!card) return;
            e.preventDefault();
            const tId = card.getAttribute("data-profile-id");
            const tSlug = decodeURIComponent(card.getAttribute("data-profile-slug") || "");
            const targetProfile = getOrNormalizeProfile(tId, tSlug);
            if (targetProfile) {
              history.pushState(null, "", `/sideline/${encodeURIComponent(targetProfile.slug || targetProfile.id)}`);
              window.openLightboxModal(targetProfile);
            } else {
              window.location.href = `/sideline/${encodeURIComponent(tSlug || tId)}`;
            }
          };
        }

        if (relatedMore) {
          const provSlug = profile.provinceKey || "chiangmai";
          const miniZoneMap = {
            "นิมมาน": "nimman", "เจ็ดยอด": "jedyod", "สันติธรรม": "santitham", "ช้างเผือก": "changphueak",
            "หลัง มช.": "cmu", "ป่าตอง": "patong", "กังสดาล": "kangsadan", "หลัง มข.": "kku",
            "บ้านดู่": "baandu", "UD Town": "udtown"
          };
          const zSlug = miniZoneMap[primaryZone] || "";
          const zoneLinkUrl = zSlug ? `/location/${provSlug}/${zSlug}` : `/location/${provSlug}`;
          relatedMore.innerHTML = `
            <a href="${zoneLinkUrl}" style="color: #7C3AED; font-size: 11.5px; font-weight: 800; text-decoration: none;">
              ${isEn ? `View all models in ${primaryZone} →` : `ดูน้องๆ รับงานโซน${primaryZone} (${pProvText}) ทั้งหมด →`}
            </a>
          `;
        }
      }

      const faqSection = document.getElementById("lightboxFaqSection");
      const faqList = document.getElementById("lightboxFaqList");
      if (faqSection && faqList) {
        faqSection.style.display = "block";
        const modelFaqs = [
          { q: `นัดพบ${displayName} มีขั้นตอนการชำระเงินอย่างไร?`, a: `สามารถชำระเงินสดหรือโอนตรงให้น้องตอนเจอตัวจริงหน้างานได้เลยค่ะ ทางระบบไม่มีนโยบายโอนมัดจำล่วงหน้า เพื่อความสบายใจ 100% ค่ะ` },
          { q: `หากน้องเดินทางมาถึงแล้วไม่ตรงปก ทำอย่างไรได้บ้าง?`, a: `หากตรวจสอบแล้วตัวจริงไม่ตรงตามรูปโปรไฟล์ สามารถปฏิเสธและยกเลิกงานหน้างานได้ทันทีโดยไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้นค่ะ` },
          { q: `พิกัดโซน${primaryZone} มีห้องส่วนตัวหรือเดินทางนอกสถานที่ได้ไหม?`, a: `${displayName} สแตนด์บายอยู่ในโซน${primaryZone} (${pProvText}) มีทั้งห้องส่วนตัวและพร้อมเดินทางไปหาที่โรงแรมหรือคอนโดอย่างรวดเร็วค่ะ` }
        ];
        faqList.innerHTML = modelFaqs.map(f => `
          <details style="background: #FFFFFF; border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 12px; overflow: hidden; margin-bottom: 6px;">
            <summary style="padding: 10px 12px; font-size: 12px; font-weight: 800; color: #140F22; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
              <span>Q: ${f.q}</span>
              <span style="color: #7C3AED; font-size: 10px; margin-left: 6px;">▼</span>
            </summary>
            <div style="padding: 0 12px 10px 12px; font-size: 11.5px; color: #475569; line-height: 1.55; border-top: 1px dashed rgba(124, 58, 237, 0.1); padding-top: 6px;">
              ${f.a}
            </div>
          </details>
        `).join("");
      }

      const dynamicTitle = isEn
        ? `${displayName} - VIP Companion in ${pProvText} | FirstModelHub`
        : `น้อง${cleanName} สาวรับงาน${pProvText} ไซด์ไลน์${primaryZone} รูปจริง 100% จ่ายหน้างาน ไม่มีมัดจำ`;
      document.title = dynamicTitle;

      const canonicalLink = document.getElementById("canonical-link") || document.querySelector('link[rel="canonical"]');
      if (canonicalLink) canonicalLink.href = canonicalProfileUrl;
      const ogUrlEl = document.querySelector('meta[property="og:url"]');
      if (ogUrlEl) ogUrlEl.setAttribute("content", canonicalProfileUrl);

      if (typeof gtag === "function") {
        gtag("event", "page_view", {
          page_title: dynamicTitle,
          page_location: canonicalProfileUrl,
          page_path: `/sideline/${profileSlug}`
        });
      }
    };

    const currentSessionId = window.__lightboxSessionId;
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!isLightboxCurrentlyOpen || window.__lightboxSessionId !== currentSessionId) return;
        syncLightboxGalleryUI();
        const descContainer = document.getElementById("lightboxDescriptionContainer");
        const descContent = document.getElementById("lightboxDescriptionContent");
        if (descContent && typeof generateModalPersonaBox === "function") {
          descContent.innerHTML = generateModalPersonaBox(profile, displayName, pProvText, primaryZone);
          descContent.style.cssText = "margin: 10px 0;";
          if (descContainer) descContainer.style.display = "block";
        }
        setTimeout(() => {
          if (!isLightboxCurrentlyOpen || window.__lightboxSessionId !== currentSessionId) return;
          runDeferredStep2();
        }, 16);
      }, 0);
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

    isLightboxCurrentlyOpen = false;
    const dockEl = document.querySelector(".floating-app-dock");
    if (dockEl) dockEl.classList.remove("is-lightbox-hidden");

    clearTimeout(window.__lightboxCloseTimer);
    window.__lightboxCloseTimer = setTimeout(() => {
      lightboxEl.style.visibility = "hidden";
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

      const savedReturnPath = window.__returnUrlBeforeModal || "";
      if (slug && slug !== "national" && slug !== "all") {
        const zoneSlugKey = window.currentZoneKey || (savedReturnPath.match(/^\/location\/[^/]+\/([^/?#]+)/i)?.[1] || "");
        targetUrl = zoneSlugKey ? `/location/${slug}/${zoneSlugKey}` : `/location/${slug}`;
        const provName = (appState.provincesMap && appState.provincesMap.get(slug)) || "เชียงใหม่";

        // ✅ เพิ่มตัวแปรชื่อโซนภาษาไทย (เช่น นิมมาน, เจ็ดยอด)
        const currentZoneName = window.currentZoneSlug || "";

        if (currentZoneName) {
  const zoneLoc = window.currentZoneLocationParen || `(${provName})`;
  targetTitle = isEN
    ? `${currentZoneName} (${provName}) Escorts | FirstModelHub`
    : `รับงาน${currentZoneName} สาวไซด์ไลน์ ${zoneLoc} รูปจริงตรงปก ไม่มีมัดจำ | FirstModelHub`;
        } else {
          // ถ้าปิด Modal ในหน้าจังหวัดปกติ ให้คืนค่า Title จังหวัดตามเดิม
          targetTitle = isEN 
            ? `${provName} Escorts & Companions | FirstModelHub` 
            : `ไซด์ไลน์${provName} รับงาน${provName} ฟิวแฟน ตรงปก จ่ายหน้างาน 100% | FirstModelHub`;
        }

        targetDesc = isEN
          ? `Verified escorts & companions in ${provName}. Romantic Girlfriend Experience, pay on arrival.`
          : `รวมสาวรับงาน${provName} ไซด์ไลน์${provName} รูปจริงตรงปก 100% นัดเจอจ่ายหน้างาน ไม่มีมัดจำ`;

        if (domCache.provinceSelect) domCache.provinceSelect.value = slug;
      } else {
        const isFromProfiles = window.__isFromProfiles || savedReturnPath.startsWith("/profiles") || window.location.pathname.startsWith("/profiles");
        targetUrl = isEN ? "/index-en" : (isFromProfiles ? "/profiles" : "/");

        targetTitle = isEN
  ? "Thailand Travel Companions & VIP Dinner Dates • 100% Real Photos (Pay on Arrival) | FirstModelHub"
  : "รับงาน ไซด์ไลน์ ทั่วไทย ฟิวแฟน รูปจริง ไม่มีมัดจำ";
        const liveCount = window.totalProfilesCount || appState.allProfiles?.length || 0;
        const liveProvinces = (appState.provincesMap && appState.provincesMap.size > 0)
          ? appState.provincesMap.size
          : ((window.provincesData && window.provincesData.length > 0) ? window.provincesData.length : 1);

        targetDesc = isEN
          ? "Premier verified travel companions and VIP dinner dates across Thailand. 100% real verified photos, pay on arrival."
          : `ศูนย์รวม สาวรับงาน ไซด์ไลน์ เด็กเอ็น ทั่วไทย (${liveCount} โปรไฟล์) ครอบคลุม ${liveProvinces} จังหวัด คัดรูปจริงตรงปก 100% จ่ายหน้างาน ไร้มัดจำ`;

        if (domCache.provinceSelect) domCache.provinceSelect.value = "";
      }

      history.replaceState(null, "", targetUrl);

      document.title = targetTitle;
      const fullCanonical = `https://firstmodelhub.com${targetUrl === "/" ? "" : targetUrl}`;
      if (canonicalLink) canonicalLink.href = fullCanonical;

      const hreflangTh = document.querySelector('link[rel="alternate"][hreflang="th"]');
      if (hreflangTh) hreflangTh.href = fullCanonical;

      const hreflangDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
      if (hreflangDefault) hreflangDefault.href = fullCanonical;

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

      // 🟢 ป้องกันบั๊ก iOS Rubber-band: ถ้านิ้วเริ่มแตะต่ำกว่าขอบบนลงมาเกิน 120px แปลว่าไม่ได้ตั้งใจปิด
      const isStartNearTop = e.touches[0].clientY < 120;

      if (isFromDragBar || (isAtTop && isHeaderArea && isStartNearTop)) {
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
  } // 👈 ปิดฟังก์ชัน initLightboxSwipeDown อย่างสมบูรณ์

  // ==============================================================================
  // ⚡ CORE UTILITY FUNCTIONS (ป้องกัน ReferenceError ทุกจุด 100%)
  // ==============================================================================

  // 1. ฟังก์ชันซ่อนตัวโหลดแบบ Safe & Failsafe
  function hideGlobalLoader() {
    try {
      const loader = document.getElementById("global-loader-overlay");
      if (loader) {
        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";
        setTimeout(() => { loader.style.display = "none"; }, 200);
      }
    } catch (_) {}
  }
  window.hideGlobalLoader = hideGlobalLoader;

function initDockAutoHide() {
    const floatingDock = document.querySelector(".floating-app-dock");
    if (!floatingDock || floatingDock.dataset.scrollBound === "true") return;
    floatingDock.dataset.scrollBound = "true";

    let lastScrollY = window.scrollY;
    let isHidden = false;
    let ticking = false;

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 80 && !isHidden) {
          floatingDock.classList.add("dock-hidden");
          isHidden = true;
        } else if (currentScrollY < lastScrollY && isHidden) {
          floatingDock.classList.remove("dock-hidden");
          isHidden = false;
        }
        lastScrollY = Math.max(0, currentScrollY);
        ticking = false;
      });
    }, { passive: true });
  }
  
  if (typeof initDockAutoHide === 'function') initDockAutoHide();

  // ==============================================================================
  // 🧭 URL ROUTING & NAVIGATION HANDLER
  // ==============================================================================
  async function handleUrlRouting(isInitial = false) {
    let rawPath = window.location.pathname.replace(/\/+$/, "") || "/";

    // ✅ ซิงค์สถานะปุ่ม Active บน Floating Bottom Dock อย่างแม่นยำ
    document.querySelectorAll(".floating-app-dock .dock-item").forEach(item => {
      item.classList.remove("active");
      const href = item.getAttribute("href");
      if ((rawPath === "/" && href === "/") || (href && href !== "/" && rawPath.startsWith(href))) {
        item.classList.add("active");
      }
    });

    // 🟢 ตรวจสอบหน้าโปรไฟล์เดี่ยว (Standalone Profile)
    const isStandaloneProfile = document.querySelector('article.interactive-card') && !document.getElementById('profiles-display-area');
    if (isStandaloneProfile) {
      hideGlobalLoader();
      if (typeof initDockAutoHide === 'function') initDockAutoHide();
      return; 
    }

    // 🟢 ตรวจสอบการเปิดโปรไฟล์แบบ Lightbox Modal (ผ่าน URL /sideline/...)
    const sidelineMatch = rawPath.match(/^\/(?:sideline|profile|app)\/([^/]+)/i);
    if (sidelineMatch) {
      let slugVal = decodeURIComponent(sidelineMatch[1]).trim();
      appState.currentProfileSlug = slugVal;

      const foundProfile = getOrNormalizeProfile(slugVal, slugVal);
      if (foundProfile) {
        window.openLightboxModal(foundProfile);
      }
      return;
    }

    const hasInitialQuery = Boolean(domCache.searchInput && domCache.searchInput.value.trim());
    const hasExistingSSR = domCache.profilesDisplayArea && domCache.profilesDisplayArea.children.length > 0;
    if (isInitial && hasExistingSSR) {
      const routeMatch = rawPath.match(/^\/(?:location|province)\/([^/]+)/i);
      const locSlug = routeMatch ? decodeURIComponent(routeMatch[1]).toLowerCase().trim() : "national";
      window.currentProvinceSlug = locSlug;
      if (domCache.provinceSelect && locSlug !== "national") {
        domCache.provinceSelect.value = locSlug;
      }
      if (hasInitialQuery) {
        if (typeof window.__hydrateRemainingProfiles === "function") await window.__hydrateRemainingProfiles();
        executeFilterAndRender(true);
      }
      return;
    }

    // 🟢 ตรวจสอบหน้ารายจังหวัด และ โซนย่อย (เช่น /location/chiangmai/เจ็ดยอด)
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
      if (locSlug === "chiang_mai" || locSlug === "chiang-mai") locSlug = "chiangmai";
      if (locSlug === "khonkaen" || locSlug === "khon_kaen") locSlug = "khon-kaen";

      appState.currentProfileSlug = null;
      window.closeLightboxModal(false);
      window.currentProvinceSlug = locSlug;
      window.currentZoneSlug = zoneSlug;
      if (domCache.provinceSelect) domCache.provinceSelect.value = locSlug;

      executeFilterAndRender(false);
      return;
    }

    // 🟢 ตรวจสอบหน้ารวมน้องๆ ทั้งหมด (/profiles)
    if (rawPath === "/profiles" || rawPath === "/profiles.html") {
      appState.currentProfileSlug = null;
      window.currentProvinceSlug = "national";
      window.currentZoneSlug = "";
      window.closeLightboxModal(false);
      if (domCache.provinceSelect) domCache.provinceSelect.value = "";

      executeFilterAndRender(false);
      return;
    }

    // 🟢 กรณีหน้าหลักทั่วไป (Default Home: /)
    appState.currentProfileSlug = null;
    window.currentProvinceSlug = "national";
    window.currentZoneSlug = "";
    window.closeLightboxModal(false);
    if (domCache.provinceSelect) domCache.provinceSelect.value = "";

    if (!isInitial) {
      executeFilterAndRender(false);
    }
  }
  
  async function initApplication() {
    // ⚡ 1. ตรวจสอบทันที: ถ้าเป็นหน้าโปรไฟล์เดี่ยว
    const isStandaloneProfile = document.querySelector('article.interactive-card') && !document.getElementById('profiles-display-area');
    if (isStandaloneProfile) {
      hideGlobalLoader();
      if (typeof initDockAutoHide === 'function') initDockAutoHide();
      
      // ⚡ ผูกระบบคลิกเปลี่ยนรูปภาพในอัลบั้ม: เปลี่ยนทันที 0ms ปลดล็อก INP ให้ผ่านเขียว
      const galleryStrip = document.getElementById('profile-gallery-strip');
      const mainProfileImg = document.getElementById('main-profile-img');
      if (galleryStrip && mainProfileImg) {
        galleryStrip.addEventListener('click', (e) => {
          const btn = e.target.closest('.thumb-slot');
          if (!btn) return;
          if (typeof triggerHaptic === 'function') triggerHaptic('light');
          const fullSrc = btn.getAttribute('data-full-src');
          if (fullSrc) {
            // ✅ ใช้ requestAnimationFrame แทน setTimeout 120ms (INP ลดฮวบเหลือ < 50ms)
            requestAnimationFrame(() => {
              mainProfileImg.src = fullSrc;
              mainProfileImg.removeAttribute('srcset');
            });

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

      return; // 🛑 จบการทำงานหน้านี้ทันที ไม่ดึง DB ทั้งเว็บ
    }

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
    const initialQueryQ = new URLSearchParams(window.location.search).get("q");
    if (domCache.searchInput && initialQueryQ) {
      domCache.searchInput.value = initialQueryQ;
    }

    const menuToggleBtn = document.getElementById("menu-toggle");
    const sidebarMenuEl = document.getElementById("sidebar-menu");
    const sidebarOverlayEl = document.getElementById("sidebar-overlay");
    const closeMenuBtn = document.getElementById("close-menu-btn");

    const toggleSidebar = (isOpen) => {
      if (sidebarMenuEl) {
        sidebarMenuEl.classList.toggle("active", isOpen);
        sidebarMenuEl.style.visibility = isOpen ? "visible" : "hidden";
      }
      if (sidebarOverlayEl) {
        sidebarOverlayEl.classList.toggle("active", isOpen);
        sidebarOverlayEl.style.visibility = isOpen ? "visible" : "hidden";
      }
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
      if (isOpen) {
        populateProvinceSelect();
        if (typeof window.__hydrateRemainingProfiles === "function") window.__hydrateRemainingProfiles();
        if (!appState.isNormalizedAll) setTimeout(ensureAllProfilesNormalized, 50);
      }
      
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
        const searchKeyword = (domCache.searchInput?.value || "").trim();
        const queryParam = searchKeyword ? ("?q=" + encodeURIComponent(searchKeyword)) : "";

        if (selectedProv && selectedProv !== "" && selectedProv !== "all" && selectedProv !== "national") {
          window.location.href = "/location/" + selectedProv + queryParam;
          return;
        } else if (selectedProv === "" || selectedProv === "all" || selectedProv === "national") {
          if (window.location.pathname !== "/") {
            window.location.href = "/" + queryParam;
            return;
          }
        }

        executeFilterAndRender(true);
        toggleSearchDrawer(false);

        setTimeout(() => {
          const displayArea = document.getElementById("profiles-display-area");
          if (displayArea) {
            displayArea.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      };
    }

    if (domCache.provinceSelect) {
      domCache.provinceSelect.addEventListener("change", () => {});
    }

    function scrollToProfilesArea() {
      const displayArea = document.getElementById("profiles-display-area");
      if (displayArea) {
        displayArea.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    if (domCache.searchInput) {
      domCache.searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          clearTimeout(window.searchTimeout);
          domCache.searchInput.blur();
          const popover = document.getElementById("search-suggestions");
          if (popover) popover.style.display = "none";
          toggleSearchDrawer(false);
          executeFilterAndRender(true);
          scrollToProfilesArea();
        }
      });

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

      domCache.searchInput.addEventListener("focus", () => {
        showSearchSuggestions(domCache.searchInput.value);
      });
    }

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

    // ✅ อัปเดต UI ปุ่มก่อน แล้ว Yield คิวให้เบราว์เซอร์ Paint ทันที (INP เขียวแน่นอน)
document.querySelectorAll(".filter-pill-tab").forEach(pill => {
  pill.addEventListener("click", async function (e) {
    const targetHref = this.getAttribute("href");
    if (this.tagName === "A" && targetHref) return; // ถ้าเป็นลิงก์ URL ปล่อยให้เบราว์เซอร์ทำงานตามปกติ

    e.preventDefault();
    if (this.classList.contains("active")) return;

    // 1. สลับคลาส active ทันที
    document.querySelectorAll(".filter-pill-tab").forEach(p => p.classList.remove("active"));
    this.classList.add("active");
    appState.activePillTag = this.getAttribute("data-tag") || "all";

    // 2. รอให้เบราว์เซอร์วาดสีปุ่มขึ้นหน้าจอจริงก่อน 100%
    await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));

    // 3. โหลดข้อมูลส่วนที่เหลือ (ถ้ายังโหลดไม่ครบ) แล้วค่อยกรองการ์ด
    if (typeof window.__hydrateRemainingProfiles === "function") {
      await window.__hydrateRemainingProfiles();
    }
    executeFilterAndRender(true);
  });
});
  
    // 🟢 Global Click Delegation (จัดลำดับเช็กปุ่มเฉพาะเจาะจงก่อนการ์ด + รองรับ .story-item-el)
    if (!window.__fmhBodyClickBound) {
      window.__fmhBodyClickBound = true;
      document.body.addEventListener("click", (e) => {
        const closeLightboxBtn = e.target.closest("#closeLightboxBtn");
        const lightboxModal = document.getElementById("lightbox");
        if (closeLightboxBtn || e.target === lightboxModal) {
          window.closeLightboxModal(true);
          return;
        }

        const homeDockBtn = e.target.closest('#dock-item-home, a[href="/"].dock-item');
        if (homeDockBtn) {
          if (window.location.pathname === "/" || window.location.pathname === "") {
            e.preventDefault();
            if (typeof triggerHaptic === "function") triggerHaptic("light");
            requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
            return;
          }
          if (typeof triggerHaptic === "function") triggerHaptic("light");
        }

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
        if (suggestionsEl && suggestionsEl.style.display !== "none" && searchInputEl && !searchInputEl.contains(e.target) && !suggestionsEl.contains(e.target)) {
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
          } else if (domCache.searchInput) {
            domCache.searchInput.value = slug;
            if (suggestionsEl) suggestionsEl.style.display = "none";
            executeFilterAndRender(true);
            return;
          }
        }

        const cardElement = e.target.closest(".profile-card-new, .vip-card-item, .story-item-el, .interactive-card");
        if (cardElement) {
          if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
          if (e.target.closest("button, a:not(.card-link):not(.story-item-el)")) return;

          const profileId = cardElement.getAttribute("data-profile-id");
          const profileSlug = cardElement.getAttribute("data-profile-slug");

          if (profileId || profileSlug) {
            e.preventDefault();
            const searchId = String(profileId || "");
            const searchSlug = String(profileSlug || "");

            let targetProfile = getOrNormalizeProfile(searchId, searchSlug);

            if (targetProfile) {
              window.__returnUrlBeforeModal = window.location.pathname + window.location.search;
              window.__isFromProfiles = window.location.pathname.startsWith("/profiles");
              const nextUrl = `/sideline/${encodeURIComponent(targetProfile.slug || targetProfile.id)}`;
              history.pushState(null, "", nextUrl);
              window.openLightboxModal(targetProfile);
            } else {
              window.location.href = `/sideline/${encodeURIComponent(profileSlug || profileId)}`;
            }
            return;
          }
        }
      });
    }

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

    
    initDockAutoHide();

    await (async function initializeData() {
      if (appState.isFetching) return false;
      appState.isFetching = true;

      function filterValidProfiles(list) {
        if (!list || !Array.isArray(list)) return [];
        const seenIds = new Set();
        const validProfiles = [];

        for (const raw of list) {
          if (!raw) continue;

          const rawName = (raw.n || raw.name || "").trim();
          const cleanName = rawName.toLowerCase().replace(/^(น้อง|สาว|พี่)\s*/gi, "");
          if (!cleanName || cleanName === "model" || cleanName === "สาวสวย" || cleanName === "-") {
            continue;
          }

          const rawImg = (raw.img || raw.imagePath || raw.image_url || raw.imageUrl || "").trim().toLowerCase();
          if (!rawImg || rawImg.includes("firstmodelhub.webp") || rawImg.length < 15) {
            continue;
          }

          if (!raw.id) continue;
          const uniqueId = String(raw.id);
          if (seenIds.has(uniqueId)) continue;
          seenIds.add(uniqueId);

          validProfiles.push(raw);
        }

        return validProfiles;
      }
      try {
        const provSource = (window.provincesData && Array.isArray(window.provincesData)) 
          ? window.provincesData 
          : await fetchSupabaseRest("provinces?select=*");

        if (provSource && Array.isArray(provSource)) {
          appState.provincesMap.clear();
          provSource.forEach(p => {
            const nameThai = p.nameThai || p.name_thai || p.name;
            let k = (p.key || p.slug || p.id || "").toString().toLowerCase();
            if (k === "chiang_mai" || k === "chiang-mai") k = "chiangmai";
            if (k && nameThai) appState.provincesMap.set(k, nameThai);
          });
        }

        let rawList = Array.isArray(window.profilesData) ? window.profilesData : null;

        if (!rawList || rawList.length === 0) {
          const data = await fetchSupabaseRest(
            `profiles?select=${PROFILE_SELECT_COLS}&active=eq.true&order=isfeatured.desc,created_at.desc`
          );
          if (Array.isArray(data)) rawList = data;
        }

        if (rawList && rawList.length > 0) {
          const cleanProfiles = window.__ssrSanitized ? rawList : filterValidProfiles(rawList);
          appState.rawList = cleanProfiles;
          appState.rawProfileById.clear();
          appState.rawProfileBySlug.clear();
          appState.profileById.clear();
          appState.profileBySlug.clear();
          appState.allProfiles = [];
          appState.normalizedCount = 0;
          appState.isNormalizedAll = false;

          for (let i = 0; i < cleanProfiles.length; i++) {
            const r = cleanProfiles[i];
            if (r.id != null) appState.rawProfileById.set(String(r.id), r);
            if (r.slug) appState.rawProfileBySlug.set(String(r.slug).toLowerCase(), r);
          }

          const hasSSRGrid = domCache.profilesDisplayArea && domCache.profilesDisplayArea.children.length > 0;
          if (hasSSRGrid) {
            const vipSwiperEl = document.getElementById("vip-swiper-container");
            if (vipSwiperEl) {
              const existingVipCards = vipSwiperEl.querySelectorAll(".vip-card-item");
              if (existingVipCards.length > 0) {
                window.__hotProfileIds = new Set(Array.from(existingVipCards).map(el => String(el.dataset.profileId)));
              }
            }
            const scheduleInitUI = window.requestIdleCallback || ((cb) => setTimeout(cb, 30));
            scheduleInitUI(() => {
              populateProvinceSelect();
              scheduleBackgroundNormalization();
            }, { timeout: 800 });
          } else {
            ensureAllProfilesNormalized();
            populateInitialComponents();
          }

          // โหลดโปรไฟล์ที่เหลือเฉพาะตอนคนกดเปิดตัวกรองหรือกดแท็บหมวดหมู่
          window.__hydrateRemainingProfiles = async () => {
            if (window.__hydrateDone || !window.totalProfilesCount || appState.rawList.length >= window.totalProfilesCount) return;
            if (window.__hydratePromise) return window.__hydratePromise;
            window.__hydratePromise = (async () => {
              const data = await fetchSupabaseRest(
                `profiles?select=${PROFILE_SELECT_COLS}&active=eq.true&order=isfeatured.desc,created_at.desc`
              );
              if (Array.isArray(data) && data.length > appState.rawList.length) {
                const moreValid = filterValidProfiles(data);
                appState.rawList = moreValid;
                appState.rawProfileById.clear();
                appState.rawProfileBySlug.clear();
                appState.allProfiles = [];
                appState.normalizedCount = 0;
                appState.isNormalizedAll = false;
                for (let i = 0; i < moreValid.length; i++) {
                  const r = moreValid[i];
                  if (r.id != null) appState.rawProfileById.set(String(r.id), r);
                  if (r.slug) appState.rawProfileBySlug.set(String(r.slug).toLowerCase(), r);
                }
                ensureAllProfilesNormalized();
              }
              window.__hydrateDone = true;
            })();
            return window.__hydratePromise;
          };

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

    await handleUrlRouting(true);
    hideGlobalLoader();

    window.appState = appState;
    window.__resetAllFilters = () => {
      appState.activePillTag = "all";
      window.currentZoneSlug = "";
      executeFilterAndRender(true);
    };

    window.addEventListener("popstate", async () => {
      await handleUrlRouting(false);
    });
  }
  
  
  function initAgencyStories() {
    const trackEl = document.getElementById("agency-stories-track");
    if (!trackEl) return;

    
    if (trackEl.children.length > 0) return;

    const profiles = appState.allProfiles;
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) return;

    
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

    starElements.forEach(star => {
      star.style.cursor = "pointer";
      star.style.userSelect = "none";
      star.style.webkitUserSelect = "none";
      star.style.touchAction = "manipulation";

      const handleTap = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();
        if (now - lastTapTime < 80) return;
        lastTapTime = now;

        tapCount++;
        if (typeof triggerHaptic === "function") triggerHaptic("light");

        star.style.transition = "transform 0.15s ease";
        star.style.transform = "scale(1.4) rotate(20deg)";
        setTimeout(() => { star.style.transform = ""; }, 150);

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => { tapCount = 0; }, 1800);

        if (tapCount >= 5) {
          tapCount = 0;
          clearTimeout(resetTimer);
          if (typeof triggerHaptic === "function") triggerHaptic("medium");
          openAdminPinDialog();
        }
      };

      star.addEventListener("pointerdown", handleTap, { passive: false });
      star.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); }, { capture: true });
    });
  }

  function openAdminPinDialog() {
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
      <div style="background: #140F22; border: 1.5px solid rgba(124, 58, 237, 0.4); border-radius: 26px; padding: 26px 20px; width: 100%; max-width: 320px; text-align: center; box-shadow: 0 25px 70px rgba(0,0,0,0.8); color: #FFFFFF; font-family: 'Prompt', sans-serif;">
        <div style="font-size: 34px; margin-bottom: 6px;">🔑</div>
        <h3 style="font-size: 16px; font-weight: 900; margin: 0 0 4px 0; color: #FFFFFF;">ADMIN CONTROL HUB</h3>
        <p style="font-size: 11.5px; color: #94A3B8; margin: 0 0 16px 0;">ใส่รหัสผ่านเพื่อสั่งล้างแคช CDN ทั่วโลก</p>
       <input type="password" id="admin-custom-pin-input" autocomplete="off" maxlength="32" placeholder="••••"style="width: 100%; height: 48px; background: rgba(255, 255, 255, 0.08); border: 1.5px solid rgba(124, 58, 237, 0.5); border-radius: 14px; color: #FFFFFF; font-size: 26px; text-align: center; letter-spacing: 10px; outline: none; margin-bottom: 16px; box-sizing: border-box;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button type="button" id="admin-pin-cancel-btn" style="height: 44px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #CBD5E1; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer;">ยกเลิก</button>
          <button type="button" id="admin-pin-submit-btn" style="height: 44px; background: linear-gradient(135deg, #7C3AED 0%, #E11D48 100%); border: none; color: #FFFFFF; border-radius: 12px; font-weight: 900; font-size: 13px; cursor: pointer; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);">ยืนยัน</button>
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
      if (!val) return;
      closeDialog();
      showAdminStatusModal("loading", "กำลังล้างแคชระบบ...", "กำลังตรวจสอบสิทธิ์และสั่งล้างแคช กรุณารอสักครู่...");

      try {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        if (!isLocal) {
          const res = await fetch("/api/clear-cache", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pin: val }),
            cache: "no-store"
          });
          if (!res.ok) {
            showAdminStatusModal("error", "รหัสผ่านไม่ถูกต้อง!", "กรุณาตรวจสอบ PIN แล้วลองใหม่อีกครั้ง");
            return;
          }
        }

        if (window.sessionStorage) sessionStorage.clear();
        if (window.localStorage) localStorage.clear();
        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map(k => caches.delete(k)));
        }

        showAdminStatusModal(
          "success",
          "ล้างแคชสำเร็จ 100%!",
          isLocal
            ? "⚡ [โหมดทดสอบ Localhost] ล้างแคชในเครื่องสำเร็จเรียบร้อย!"
            : "⚡ ล้าง Netlify CDN ทั่วโลกเรียบร้อย ทุกคนจะเห็นข้อมูลใหม่ทันที!"
        );

        setTimeout(() => { window.location.reload(); }, 1000);
      } catch (err) {
        showAdminStatusModal("error", "เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      }
    };

    submitBtn.onclick = executePurge;
    pinInput.onkeydown = (e) => {
      if (e.key === "Enter") executePurge();
    };
  }

  const boot = () => {
    initApplication();
    requestAnimationFrame(() => {
      setTimeout(() => {
        initLightboxSwipeDown();
        initStealthAdminPurge();
        updateLiveRelativeTimestamps();
        initLazyGoogleMap(window.currentProvinceName || "", window.currentProvinceSlug || "");
      }, 0);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

// ==========================================================================
// 🚀 SEARCH BOTTOM SHEET & RUNTIME INTEGRITY PATCH (วางต่อท้าย main.js ล่างสุด)
// ==========================================================================

(function initSearchBottomSheetUXEnhancements() {
  "use strict";

  if (typeof window.zoneSlug === "undefined") {
    Object.defineProperty(window, "zoneSlug", {
      get: function() { return window.currentZoneSlug || ""; },
      set: function(v) { window.currentZoneSlug = v; },
      configurable: true
    });
  }

  function setupSheetGestures() {
    const sheetEl = document.getElementById("search-bottom-sheet");
    const overlayEl = document.getElementById("search-drawer-overlay");
    const closeBtn = document.getElementById("close-search-drawer-btn");
    const resetBtn = document.getElementById("reset-search-btn");
    const searchInput = document.getElementById("search-keyword");
    const bodyContent = sheetEl ? sheetEl.querySelector(".sheet-body-content") : null;

    if (!sheetEl) return;

    let touchStartY = 0;
    let touchCurrentY = 0;
    let isDragging = false;

    sheetEl.addEventListener("touchstart", (e) => {
      if (!bodyContent || bodyContent.scrollTop <= 0) {
        touchStartY = e.touches[0].clientY;
        touchCurrentY = touchStartY;
        isDragging = true;
      } else {
        isDragging = false;
      }
    }, { passive: true });

    sheetEl.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      touchCurrentY = e.touches[0].clientY;
      const deltaY = touchCurrentY - touchStartY;

      if (deltaY > 0) {
        sheetEl.style.transition = "none";
        const dampenedY = Math.pow(deltaY, 0.88);
        sheetEl.style.transform = `translate(-50%, ${dampenedY}px)`;
      }
    }, { passive: true });

    sheetEl.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      const deltaY = touchCurrentY - touchStartY;
      sheetEl.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)";

      if (deltaY > 80) {
        if (typeof window.triggerHaptic === "function") window.triggerHaptic("light");
        sheetEl.classList.remove("active");
        sheetEl.style.pointerEvents = "none";
        sheetEl.style.visibility = "hidden";
        setTimeout(() => { sheetEl.style.transform = ""; }, 300);
        if (overlayEl) {
          overlayEl.classList.remove("active");
          overlayEl.style.pointerEvents = "none";
          overlayEl.style.visibility = "hidden";
        }
        document.body.style.overflow = "";
      } else {
        sheetEl.style.transform = "";
      }
    }, { passive: true });

    if (resetBtn && !resetBtn.dataset.patchBound) {
      resetBtn.dataset.patchBound = "true";
      resetBtn.addEventListener("click", () => {
        if (typeof window.triggerHaptic === "function") window.triggerHaptic("medium");

        if (searchInput) searchInput.value = "";
        const clearBtn = document.getElementById("clear-search-btn");
        if (clearBtn) clearBtn.style.display = "none";

        const popover = document.getElementById("search-suggestions");
        if (popover) popover.style.display = "none";

        const provSelect = document.getElementById("search-province");
        if (provSelect) provSelect.value = "";

        const availSelect = document.getElementById("search-availability");
        if (availSelect) availSelect.value = "";

        const featSelect = document.getElementById("search-featured");
        if (featSelect) featSelect.value = "";

        const sortSelect = document.getElementById("sort-select");
        if (sortSelect) sortSelect.value = "featured";

        document.querySelectorAll(".filter-pill-tab").forEach(p => p.classList.remove("active"));
        const allPill = document.querySelector('.filter-pill-tab[data-tag="all"]');
        if (allPill) allPill.classList.add("active");

        if (typeof window.__resetAllFilters === "function") {
          window.__resetAllFilters();
        } else if (typeof window.executeFilterAndRender === "function") {
          window.executeFilterAndRender(true);
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSheetGestures);
  } else {
    setupSheetGestures();
  }
})();



document.addEventListener("error", function (e) {
  const img = e.target;
  if (!img || !img.tagName || img.tagName.toLowerCase() !== "img") return;
  if (img.id === "lightboxHeroImage") return;
  if (img.dataset.fallbackApplied === "true") return;

  img.dataset.fallbackApplied = "true";
  if (img.hasAttribute("srcset")) img.removeAttribute("srcset");
  img.src = "https://firstmodelhub.com/images/firstmodelhub.webp";
}, true);