
/* ==============================================================================
   💎 FIRST MODEL HUB - MAIN CLIENT-SIDE ENGINE (PROD-READY PERFECT 2026)
   ============================================================================== */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";

gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

(function () {
  "use strict";

  const CONFIG = {
    SUPABASE_URL: "https://zxetzqwjaiumqhrpumln.supabase.co",
    SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
    STORAGE_BUCKET: "profile-images",
    KEYS: {
      LAST_PROVINCE: "firstmodelhub_last_province",
      CACHE_PROFILES: "cachedProfiles_v5_2026",
      CACHE_PROVINCES: "cachedProvinces_v5_2026",
      THEME: "theme",
      LIKED_PROFILES: "liked_profiles",
      LAST_REVIEW_TIME: "last_review_submit_time"
    },
    CACHE_TTL_MS: 12 * 60 * 60 * 1000, // แคชมีอายุ 12 ชั่วโมง
    SITE_URL: "https://firstmodelhub.com",
    DEFAULT_OG_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp"
  };

  const DEFAULT_SEO = {
    title: "สาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนตรงปก 100% ปลอดภัย จ่ายหน้างาน | First Model Hub",
    description: "ศูนย์รวมสาวรับงาน และเพื่อนเที่ยวไซด์ไลน์พรีเมียมสไตล์ฟิวแฟน ยืนยันตัวตนตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ",
    keywords: "แฟนเช่า, รับงาน, สาวรับงาน, ไซด์ไลน์, เพื่อนเที่ยว, ฟิวแฟน, เด็กเอ็น, รับงานไม่มัดจำ, รับงานจ่ายหน้างาน",
    canonical: "https://firstmodelhub.com/",
    ogImage: "https://firstmodelhub.com/images/firstmodelhub.webp"
  };

  let STATE = {
    allProfiles: [],
    provincesMap: new Map(),
    currentProfileSlug: null,
    lastFocusedElement: null,
    isFetching: false,
    currentFilters: null,
    filteredProfiles: [],
    renderId: 0
  };

  const DOM = {};
  let supabaseClient = null;
  let isLikeProcessing = false;
  let isFirstLoad = true;
  let searchDebounceTimer = null;

  // 🟢 IndexedDB Engine (ปรับปรุงระบบ Smart Cache มีวันหมดอายุและลบเองได้)
  const idb = {
    init() {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open("FirstModelHubDB", 2);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains("cacheStore")) {
            db.createObjectStore("cacheStore");
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    },
    async get(key) {
      try {
        const db = await this.init();
        return new Promise((resolve, reject) => {
          const tx = db.transaction("cacheStore", "readonly");
          const store = tx.objectStore("cacheStore");
          const req = store.get(key);
          req.onsuccess = () => {
            const data = req.result;
            if (!data) return resolve(null);
            
            // รองรับข้อมูลเก่าที่ไม่มี timestamp
            if (!data.timestamp) {
              return resolve(data);
            }
            
            // ตรวจสอบวันหมดอายุของ Cache
            if (Date.now() - data.timestamp < CONFIG.CACHE_TTL_MS) {
              resolve(data.value);
            } else {
              this.delete(key);
              resolve(null);
            }
          };
          req.onerror = () => reject(req.error);
        });
      } catch (e) {
        console.warn("IndexedDB Get Error:", e);
        return null;
      }
    },
    async set(key, value) {
      try {
        const db = await this.init();
        return new Promise((resolve, reject) => {
          const tx = db.transaction("cacheStore", "readwrite");
          const store = tx.objectStore("cacheStore");
          const req = store.put({ value, timestamp: Date.now() }, key);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      } catch (e) {
        console.warn("IndexedDB Set Error:", e);
      }
    },
    async delete(key) {
      try {
        const db = await this.init();
        return new Promise((resolve) => {
          const tx = db.transaction("cacheStore", "readwrite");
          tx.objectStore("cacheStore").delete(key);
          tx.oncomplete = () => resolve();
        });
      } catch (e) {
        console.warn("IndexedDB Delete Error:", e);
      }
    }
  };

  function normalizeProvinceKey(key) {
    if (!key) return "national";
    let k = String(key).toLowerCase().trim().replace(/_/g, "-");
    if (k === "chiang-mai" || k === "chiangmai") return "chiangmai";
    if (k === "khon-kaen" || k === "khonkaen") return "khonkaen";
    if (k === "udon-thani" || k === "udonthani" || k === "udon") return "udonthani";
    if (k === "chiang-rai" || k === "chiangrai") return "chiangrai";
    if (k === "phra-nakhon-si-ayutthaya" || k === "ayutthaya") return "phra-nakhon-si-ayutthaya";
    if (k === "surat-thani" || k === "suratthani") return "surat-thani";
    if (k === "ubon-ratchathani" || k === "ubonratchathani" || k === "ubon") return "ubonratchathani";
    if (k === "nakhon-ratchasima" || k === "korat") return "nakhon-ratchasima";
    return k;
  }

  const FALLBACK_SLOGANS = [
    "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน",
    "ตรงปก 100% เอาใจเก่ง พูดคุยเป็นกันเอง",
    "สดใสน่ารัก ยิ้มเก่ง สไตล์เพื่อนเที่ยวฟิวแฟน",
    "ดูแลเอาใจใส่สุภาพเรียบร้อย เป็นกันเองมากๆ ค่ะ",
    "น่ารักคุยสนุก เทคแคร์ประทับใจ ไม่เร่งงาน",
    "หุ่นดี รูปร่างสมส่วน สไตล์ฟิวแฟนอบอุ่น",
    "ตรงปกแน่นอน น่ารัก นิสัยดี คุยง่ายสบายใจ",
    "ดูแลใส่ใจทุกรายละเอียด น่ารักเป็นธรรมชาติ"
  ];

  function getDeterministicSlogan(idOrSlug, rawSlogan) {
    if (rawSlogan && String(rawSlogan).trim().length > 3) {
      return sanitizeThaiText(rawSlogan);
    }
    const str = String(idOrSlug || "0");
    const sum = str.split("").reduce((acc, char, idx) => acc + (char.charCodeAt(0) * (idx + 1)), 0); // เพิ่ม Salt ด้วย Index ให้กระจายมากขึ้น
    const index = sum % FALLBACK_SLOGANS.length;
    return FALLBACK_SLOGANS[index];
  }

  // ✅ ฟังก์ชัน Sanitize ภาษาไทยที่ถูกต้องและปลอดภัย 100%
  function sanitizeThaiText(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      // 1. ลบข้อความ Debug Gemini / System Prompts
      .replace(/✨?\s*พัฒนาและปรับแต่งโค้ดด้วย.*?(?:\||\n|$)/gi, "")
      .replace(/Google\s*Gemini.*?(?:\||\n|$)/gi, "")
      .replace(/ทดลองใช้งาน\.?/gi, "")
      // 2. แก้ไขคำสะกดผิดที่พบบ่อย
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
      // 3. ลบสัญลักษณ์ตกแต่ง Text Art โดยไม่กระทบสระไทย (เอา 'อิ' และตัวอักษรไทยออก)
      .replace(/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬„•ㅅ•„₊˚╭╮╰╯┊જ⁀⸝༘⋆ෆ◟ヾ֒𐐪づ⁺.]+/g, " ")
      // 4. ลบ Emojis
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}🚨💦🐻🫦]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function sanitizeName(rawName) {
    if (!rawName || typeof rawName !== "string") return "สาวสวย";
    let cleaned = sanitizeThaiText(rawName).replace(/^(น้อง\s?)+/gi, "").trim();
    if (!cleaned) return "สาวสวย";
    return `น้อง${cleaned}`;
  }

  function deduplicateProfiles(profileList) {
    if (!Array.isArray(profileList)) return [];
    const seen = new Set();
    return profileList.filter(p => {
      if (!p) return false;
      const uniqueKey = String(p.id || p.slug || p.imagePath).toLowerCase().trim();
      if (seen.has(uniqueKey)) return false;
      seen.add(uniqueKey);
      return true;
    });
  }

  const LOCALIZED_SEO_MAP = {
    chiangmai: {
      zones: ["ทั้งหมด", "นิมมาน", "สันติธรรม", "เจ็ดยอด", "หลัง มช.", "ช้างเผือก", "สันทราย", "ห้วยแก้ว"],
      reviews: [
        { author: "คุณเกริกพล", location: "นิมมาน เชียงใหม่", text: "นัดเจอน้องตรงปก 100% บริการน่ารักมาก มารยาทดี ไม่มีโอนมัดจำล่วงหน้าสบายใจสุดๆ ครับ", rating: 5, date: "เมื่อวานนี้" },
        { author: "คุณอนุรักษ์", location: "สันติธรรม เชียงใหม่", text: "ดูแลเอนเตอร์เทนประทับใจ สไตล์ฟิวแฟน คุยสนุกเป็นกันเอง ให้ 5 ดาวครับ", rating: 5, date: "3 วันที่แล้ว" }
      ],
      faqs: [
        { q: "นัดหมายสาวรับงานเชียงใหม่ บน First Model Hub โซนไหนสะดวกที่สุด?", a: "ถนนนิมมานเหมินท์, สันติธรรม, ช้างเผือก และรอบคอนโดมิเนียมย่านเจ็ดยอด เป็นพิกัดหลักที่มีน้องๆ สแตนด์บายพร้อมดูแลท่านอย่างสะดวกรวดเร็ว" },
        { q: "การเรียกใช้บริการรับงานเชียงใหม่ ต้องโอนมัดจำล่วงหน้าหรือไม่?", a: "ไม่มีนโยบายโอนมัดจำล่วงหน้าทุกกรณีครับ เราใช้นโยบาย 'เจอตัวจริงค่อยชำระเงินโดยตรงหน้างาน' ป้องกันความเสี่ยงทางการเงิน 100%" }
      ]
    },
    chiangrai: {
      zones: ["ทั้งหมด", "ตัวเมืองเชียงราย", "บ้านดู่", "มฟล.", "หอนาฬิกา", "แม่สาย"],
      reviews: [{ author: "คุณปิยะ", location: "ตัวเมืองเชียงราย", text: "น้องน่ารัก ตรงปก เทคแคร์ดีมาก ชำระเงินหน้างานปลอดภัยครับ", rating: 5, date: "2 วันที่แล้ว" }],
      faqs: [{ q: "สาวรับงานเชียงราย จ่ายเงินอย่างไร?", a: "ชำระหน้างานเมื่อเจอน้องตัวจริงเท่านั้น ไม่มีโอนมัดจำล่วงหน้าทุกกรณี" }]
    },
    lampang: {
      zones: ["ทั้งหมด", "ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏ"],
      reviews: [{ author: "คุณเมธี", location: "ตัวเมืองลำปาง", text: "น้องตรงปก สุภาพ อัธยาศัยดี นัดเจอจ่ายเงินหน้างานประทับใจครับ", rating: 5, date: "4 วันที่แล้ว" }],
      faqs: []
    },
    phitsanulok: {
      zones: ["ทั้งหมด", "ตัวเมืองพิษณุโลก", "รอบ มน.", "สมอแข"],
      reviews: [{ author: "คุณกิตติ", location: "รอบ มน. พิษณุโลก", text: "ตรงปก อัธยาศัยดี ฟิวแฟนอบอุ่นมากครับ", rating: 5, date: "เมื่อวานนี้" }],
      faqs: []
    },
    bangkok: {
      zones: ["ทั้งหมด", "สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย"],
      reviews: [
        { author: "คุณวีรยุทธ", location: "รัชดา กรุงเทพฯ", text: "บริการพรีเมียมมาก ตรงปกตามรูป จ่ายหน้างาน 100% แนะนำเลยครับ", rating: 5, date: "เมื่อวานนี้" },
        { author: "คุณปณิธาน", location: "สุขุมวิท กรุงเทพฯ", text: "ตรงปก บริการฟิวแฟนประทับใจ นัดเจอง่ายไม่มีมัดจำครับ", rating: 5, date: "3 วันที่แล้ว" }
      ],
      faqs: [
        { q: "สาวรับงานกรุงเทพฯ ปลอดภัยแค่ไหน?", a: "ปลอดภัย 100% จ่ายเงินเมื่อเจอตัวน้องหน้างาน ไม่มีการโอนเงินก่อนล่วงหน้า" }
      ]
    },
    chonburi: {
      zones: ["ทั้งหมด", "พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี"],
      reviews: [{ author: "คุณสมชาย", location: "พัทยา ชลบุรี", text: "น้องตรงปก น่ารัก เทคแคร์ดีมาก ชำระหน้างานปลอดภัยสุดๆ ครับ", rating: 5, date: "2 วันที่แล้ว" }],
      faqs: [{ q: "เรียกสาวรับงานพัทยา บางแสน จ่ายเงินอย่างไร?", a: "ชำระตรงหน้างานเมื่อเจอน้องตัวจริงเรียบร้อยแล้วเท่านั้น ไม่มีโอนมัดจำก่อนทุกกรณีครับ" }]
    },
    khonkaen: {
      zones: ["ทั้งหมด", "ตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัล"],
      reviews: [{ author: "คุณธนกฤต", location: "กังสดาล ขอนแก่น", text: "น้องน่ารัก เป็นกันเองมากๆ สไตล์ฟิวแฟน ไม่ต้องโอนมัดจำล่วงหน้าครับ", rating: 5, date: "4 วันที่แล้ว" }],
      faqs: [{ q: "นัดหมายสาวรับงานขอนแก่น ต้องโอนมัดจำไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าครับ พบน้องและตรวจสอบความตรงปกหน้างานแล้วค่อยชำระค่าบริการครับ" }]
    },
    phuket: {
      zones: ["ทั้งหมด", "ตัวเมืองภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง"],
      reviews: [{ author: "คุณอเล็กซ์", location: "ป่าตอง ภูเก็ต", text: "โปรไฟล์ตรงปก 100% บริการดี นัดเจอจ่ายหน้างาน สะดวกสบายมากครับ", rating: 5, date: "3 วันที่แล้ว" }],
      faqs: [{ q: "นัดหมายสาวรับงานภูเก็ต จ่ายเงินอย่างไร?", a: "นัดเจอตัวจริงตรงปกหน้างานแล้วค่อยชำระเงินตรงกับน้อง ไม่มีโอนมัดจำล่วงหน้าครับ" }]
    },
    udonthani: {
      zones: ["ทั้งหมด", "ตัวเมืองอุดร", "UD Town", "หนองประจักษ์"],
      reviews: [{ author: "คุณชัชวาล", location: "UD Town อุดรธานี", text: "น้องตรงปก บริการสุภาพ สไตล์ฟิวแฟน จ่ายหน้างานปลอดภัยครับ", rating: 5, date: "เมื่อวานนี้" }],
      faqs: []
    },
    national: {
      zones: ["ทั้งหมด", "กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "อุดรธานี", "ขอนแก่น"],
      reviews: [
        { author: "คุณเกริกพล", location: "นิมมาน เชียงใหม่", text: "นัดเจอน้องตรงปก 100% บริการน่ารักมาก มารยาทดี ไม่มีโอนมัดจำล่วงหน้าสบายใจสุดๆ ครับ", rating: 5, date: "เมื่อวานนี้" },
        { author: "คุณวีรยุทธ", location: "รัชดา กรุงเทพฯ", text: "บริการพรีเมียมมาก ตรงปกตามรูป จ่ายหน้างาน 100% แนะนำเลยครับ", rating: 5, date: "3 วันที่แล้ว" }
      ],
      faqs: [
        { q: "เรียกใช้บริการน้องๆ สาวรับงาน เด็กเอ็น First Model Hub ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่ต้องโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ ลูกค้าตกลงชำระค่าบริการหน้างานเมื่อเจอน้องตัวจริงตรงปกแล้วเท่านั้น" }
      ]
    }
  };

  function runIdle(fn, delay = 0) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => fn());
    } else {
      setTimeout(fn, delay);
    }
  }

  function destroyLoadingPlaceholder() {
    const el = document.getElementById("loading-profiles-placeholder");
    if (el) el.style.display = "none";
  }

  function saveRecentSearch(keyword) {
    if (!keyword || keyword.trim() === "") return;
    try {
      const searches = JSON.parse(localStorage.getItem("recent_searches") || "[]");
      const filtered = searches.filter(item => item.toLowerCase() !== keyword.toLowerCase());
      filtered.unshift(keyword.trim());
      localStorage.setItem("recent_searches", JSON.stringify(filtered.slice(0, 10)));
    } catch (e) {
      console.warn("Error saving recent search:", e);
    }
  }

  function getImageUrl(path, width = 400) {
    if (!path) return CONFIG.DEFAULT_OG_IMAGE;
    if (Array.isArray(path)) path = path[0];
    if (typeof path === "object" && path !== null) path = path.src || path.url || path.imagePath || "";
    if (typeof path !== "string" || !path.trim()) return CONFIG.DEFAULT_OG_IMAGE;

    if (path.includes("res.cloudinary.com")) {
      return path.replace("/upload/", `/upload/c_scale,w_${width},q_auto,f_auto/`);
    }
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/${CONFIG.STORAGE_BUCKET}/${path}`;
  }

  function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.cssText = "position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%); z-index: var(--z-toast, 9000); display: flex; flex-direction: column; gap: 8px; width: 90%; max-width: 400px; pointer-events: none;";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const isSuccess = type === "success";
    toast.style.cssText = `
      background-color: ${isSuccess ? "rgba(16, 185, 129, 0.95)" : "rgba(239, 68, 68, 0.95)"};
      color: white; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 700;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);
      border: 1px solid ${isSuccess ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"};
      pointer-events: auto; display: flex; align-items: center; justify-content: space-between; gap: 12px;
      transform: translateY(20px); opacity: 0; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    toast.innerHTML = `
      <span>${message}</span>
      <button style="background: none; border: none; color: white; cursor: pointer; font-size: 14px; padding: 0 4px;"><i class="fas fa-times"></i></button>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = "translateY(0)";
      toast.style.opacity = "1";
    });

    const closeBtn = toast.querySelector("button");
    const dismiss = () => {
      toast.style.transform = "translateY(20px)";
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) container.remove();
      }, 300);
    };

    closeBtn.onclick = dismiss;
    setTimeout(dismiss, 5000);
  }

  function handleFatalError(err) {
    console.error("❌ เกิดข้อผิดพลาดร้ายแรง:", err);
    destroyLoadingPlaceholder();
    hideGlobalLoader();

    if (DOM.profilesDisplayArea) {
      DOM.profilesDisplayArea.classList.remove("hidden-state");
      DOM.profilesDisplayArea.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: #EF4444; max-width: 500px; margin: 48px auto; background-color: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 24px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 16px; color: var(--primary-purple);"></i>
            <h3 style="font-size: 18px; font-weight: 800; color: white; margin: 0;">ระบบเชื่อมต่อขัดข้องชั่วคราว</h3>
            <p style="margin-top: 12px; color: var(--text-gray); font-size: 13px; line-height: 1.6;">ไม่สามารถดึงข้อมูลโปรไฟล์ได้ในขณะนี้ กรุณาตรวจสอบสัญญาณอินเทอร์เน็ตของคุณใหม่อีกครั้งครับ</p>
            <button onclick="window.location.reload()" 
                    style="margin-top: 24px; padding: 12px 28px; background-color: var(--primary-purple); color: black; border-radius: 100px; border: none; cursor: pointer; font-weight: 800; font-size: 13px; box-shadow: 0 4px 15px rgba(90, 44, 190, 0.3); transition: transform 0.2s;">
                <i class="fas fa-sync-alt" style="margin-right: 8px;"></i> รีโหลดหน้าเว็บ
            </button>
        </div>
      `;
    }
  }

  function processProfileObject(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

    const formattedName = sanitizeName(raw.name || raw.displayName || raw.title || "น้อง");

    const rawGallery = raw.galleryPaths || raw.gallery_paths || raw.gallery || raw.photos || raw.images || [];
    const galleryPaths = Array.isArray(rawGallery) 
      ? rawGallery 
      : (typeof rawGallery === "string" ? rawGallery.split(",").map(s => s.trim()) : []);
      
    const mainImg = raw.imagePath || raw.image_url || raw.imageUrl || raw.image || raw.photo || raw.avatar || galleryPaths[0] || null;

    const rawImageList = [mainImg, ...galleryPaths].filter(Boolean);
    const pathSet = new Set();
    const normalizedImages = [];

    rawImageList.forEach(path => {
      let srcStr = "";
      let fullSrcStr = "";

      if (typeof path === "object" && path !== null) {
        srcStr = path.src || path.url || "";
        fullSrcStr = path.fullSrc || path.fullUrl || srcStr;
      } else if (typeof path === "string") {
        srcStr = path.trim();
        fullSrcStr = path.trim();
      }

      if (srcStr && !pathSet.has(srcStr)) {
        pathSet.add(srcStr);
        normalizedImages.push({
          src: srcStr.startsWith("http") ? srcStr : getImageUrl(srcStr, 400),
          fullSrc: fullSrcStr.startsWith("http") ? fullSrcStr : getImageUrl(fullSrcStr, 1000)
        });
      }
    });

    if (normalizedImages.length === 0) {
      normalizedImages.push({ src: CONFIG.DEFAULT_OG_IMAGE, fullSrc: CONFIG.DEFAULT_OG_IMAGE });
    }

    const rawProvKey = document.getElementById("review-province-key")?.value || DOM.provinceSelect?.value || "national";
    const provKey = normalizeProvinceKey(rawProvKey);
    const provinceThaiName = STATE.provincesMap.get(provKey) || raw.provinceThai || raw.province_thai || raw.provinceName || "ทั่วไทย";

const rawPrice = raw.rate || raw.price || raw.fee || raw.cost || 0;
    const priceMatch = String(rawPrice).match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+/);
    let numericRate = priceMatch ? Number(priceMatch[0].replace(/,/g, "")) : 0;

    // ดักถ้าราคาต่ำกว่า 500 (เช่น พิมพ์มา 150) ให้คูณ 10 เป็น 1500 ทันที
    if (numericRate > 0 && numericRate < 500) {
      numericRate = numericRate * 10;
    }

    const displayPrice = numericRate > 0 
      ? `${numericRate.toLocaleString()}.-` 
      : (typeof rawPrice === "string" && rawPrice.trim() !== "" ? sanitizeThaiText(rawPrice) : "สอบถาม");

    let bust = String(raw.bust || raw.breast || "").replace(/\D/g, "");
    let waist = String(raw.waist || "").replace(/\D/g, "");
    let hips = String(raw.hip || raw.hips || "").replace(/\D/g, "");
    let cup = String(raw.cup_size || raw.cupSize || raw.cup || "").toUpperCase().replace(/[^A-Z]/g, "").trim();

    let safeStats = "ไม่ระบุ";
    if (bust && waist && hips) {
      safeStats = `${bust}${cup ? `(${cup})` : ""}-${waist}-${hips}`;
    } else if (raw.stats || raw.proportion || raw.proportions) {
      safeStats = String(raw.stats || raw.proportion || raw.proportions).trim().replace(/[\s\/]+/g, "-");
    }

    const rawAge = raw.age || raw.profile_age;
    const cleanAge = (rawAge && String(rawAge).trim() !== "-" && String(rawAge).trim() !== "0") ? String(rawAge).replace(/\D/g, "") : null;
    const safeAgeDisplay = cleanAge ? `${cleanAge} ปี` : "ไม่ระบุ";

    const rawHeight = raw.height || raw.profile_height;
    const cleanHeight = (rawHeight && String(rawHeight).trim() !== "-" && String(rawHeight).trim() !== "0") ? String(rawHeight).replace(/\D/g, "") : null;
    const safeHeight = cleanHeight ? `${cleanHeight} ซม.` : "ไม่ระบุ";

    const rawWeight = raw.weight || raw.profile_weight;
    const cleanWeight = (rawWeight && String(rawWeight).trim() !== "-" && String(rawWeight).trim() !== "0") ? String(rawWeight).replace(/\D/g, "") : null;
    const safeWeight = cleanWeight ? `${cleanWeight} กก.` : "ไม่ระบุ";

    const rawSkin = raw.skin_tone || raw.skinTone || raw.skin_color || raw.skinColor || raw.skin;
    const safeSkin = (rawSkin && String(rawSkin).trim() !== "-") ? sanitizeThaiText(rawSkin) : "ไม่ระบุ";

    const sloganText = getDeterministicSlogan(raw.id || raw.slug, raw.slogan || raw.quote || raw.tagline);
    
    const rawTags = raw.style_tags || raw.styleTags || raw.tags || [];
    const styleTags = (Array.isArray(rawTags) ? rawTags : (typeof rawTags === "string" ? rawTags.split(",") : []))
      .map(t => sanitizeThaiText(t).replace(/^#/, "").trim())
      .filter(Boolean);

    const availStatus = sanitizeThaiText(raw.availability || raw.status || "รับงาน");
    const isBusy = ["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "off", "busy"].some(kw => availStatus.toLowerCase().includes(kw));
    const isAvailable = !isBusy;

    const lineIdClean = String(raw.line_id || raw.lineId || raw.line || "").replace(/^@/, "").trim();
    const cleanLocation = sanitizeThaiText(raw.location || raw.zone || raw.area || provinceThaiName);
    const cleanDescription = sanitizeThaiText(raw.description || raw.detail || "ดูแลใส่ใจทุกรายละเอียด น่ารักเป็นธรรมชาติ");

    return {
      ...raw,
      id: raw.id,
      slug: String(raw.slug || raw.id).trim(),
      displayName: formattedName,
      images: normalizedImages,
      provinceNameThai: provinceThaiName,
      provinceKey: provKey,
      location: cleanLocation,
      description: cleanDescription,
      displayPrice: displayPrice,
      _price: numericRate,
      bust: bust,
      waist: waist,
      hips: hips,
      cupSize: cup,
      safeAge: cleanAge || "-",
      safeAgeDisplay: safeAgeDisplay,
      safeHeight: safeHeight,
      safeWeight: safeWeight,
      safeStats: safeStats,
      safeSkin: safeSkin,
      isAvailable: isAvailable,
      availability: availStatus,
      isVerified: Boolean(raw.verified || raw.isVerified || raw.is_verified),
      hasVideo: Boolean(raw.has_video || raw.hasVideo || raw.hasVideoClip),
      isNew: Boolean(raw.is_new || raw.isNew),
      isfeatured: Boolean(raw.isfeatured || raw.is_featured || raw.isFeatured),
      lineId: lineIdClean,
      styleTags: styleTags,
      quote: sloganText,
      slogan: sloganText
    };
  }

  async function fetchProfilesData() {
    if (STATE.isFetching) return false;
    STATE.isFetching = true;

    try {
      if (window.profilesData && Array.isArray(window.profilesData) && window.profilesData.length > 0) {
        console.log("⚡ [Hydration] โหลดข้อมูล SSR สำเร็จ!");
        STATE.provincesMap.clear();
        
        try {
          const cachedProvinces = await idb.get(CONFIG.KEYS.CACHE_PROVINCES) || JSON.parse(localStorage.getItem(CONFIG.KEYS.CACHE_PROVINCES) || "[]");
          if (Array.isArray(cachedProvinces)) {
            cachedProvinces.forEach(p => {
              if (p.key && p.name) STATE.provincesMap.set(normalizeProvinceKey(p.key), p.name);
            });
          }
        } catch (e) {}

        window.profilesData.forEach(p => {
          if (p.provinceKey && p.provinceThai) {
            STATE.provincesMap.set(normalizeProvinceKey(p.provinceKey), p.provinceThai);
          }
        });

        if (STATE.provincesMap.size === 0) {
          STATE.provincesMap.set("chiangmai", "เชียงใหม่");
          STATE.provincesMap.set("bangkok", "กรุงเทพฯ");
          STATE.provincesMap.set("chonburi", "ชลบุรี");
        }

        STATE.allProfiles = deduplicateProfiles(window.profilesData.map(p => processProfileObject(p)).filter(Boolean));
        
        populateProvinceDropdown();
        renderSmartFilterChips();
        applyUltimateFilters(false, false);
        updateHeroSwiperCards();
        
        runIdle(async () => {
  if (supabaseClient) {
    let query = supabaseClient.from("profiles").select("*").eq("active", true).order("isfeatured", { ascending: false }).order("created_at", { ascending: false }).limit(600);
    
    // เช็คว่าอยู่หน้าจังหวัดไหม ถ้าใช่ ให้ดึงมาแค่จังหวัดนั้น ไม่ต้องดึงมาทั้งหมด
    const currentPath = window.location.pathname;
    if (currentPath.includes("/location/")) {
        const provSlug = currentPath.split("/").filter(Boolean).pop();
        query = query.eq("provinceKey", normalizeProvinceKey(provSlug));
    }
    
    const { data } = await query;
    
    if (data) {
      const fullData = deduplicateProfiles(data.map(p => processProfileObject(p)).filter(Boolean));
      STATE.allProfiles = fullData;
      idb.set(CONFIG.KEYS.CACHE_PROFILES, fullData);
    }
  }
}, 3000);

        STATE.isFetching = false;
        return true;
      }

      console.log("🚀 กำลังดึงข้อมูลโปรไฟล์จาก Supabase...");
const provincesPromise = supabaseClient ? supabaseClient.from("provinces").select("*") : Promise.resolve({ data: [] });

// เตรียม Query พื้นฐาน
let activeProfileQuery = supabaseClient ? supabaseClient.from("profiles").select("*").eq("active", true).order("isfeatured", { ascending: false }).order("created_at", { ascending: false }).limit(600) : null;

// กรองเฉพาะจังหวัดที่กำลังเปิดอยู่
if (activeProfileQuery) {
    const currentPath = window.location.pathname;
    if (currentPath.includes("/location/")) {
        const provSlug = currentPath.split("/").filter(Boolean).pop();
        activeProfileQuery = activeProfileQuery.eq("provinceKey", normalizeProvinceKey(provSlug));
    }
}

const profilesPromise = activeProfileQuery ? activeProfileQuery : Promise.resolve({ data: [] });
      const [provincesRes, profilesRes] = await Promise.all([provincesPromise, profilesPromise]);

      if (provincesRes.data) {
        STATE.provincesMap.clear();
        const provincesCacheArr = [];
        provincesRes.data.forEach(p => {
          const name = p.nameThai || p.name_thai || p.name;
          let key = normalizeProvinceKey(p.key || p.slug || p.id);
          if (key && name) {
            STATE.provincesMap.set(key, name);
            provincesCacheArr.push({ key: key, name: name });
          }
        });
        idb.set(CONFIG.KEYS.CACHE_PROVINCES, provincesCacheArr);
      }

      if (profilesRes.error) throw profilesRes.error;

      const rawProfiles = profilesRes.data || [];
      STATE.allProfiles = deduplicateProfiles(rawProfiles.map(p => processProfileObject(p)).filter(Boolean));
      idb.set(CONFIG.KEYS.CACHE_PROFILES, STATE.allProfiles);

      populateProvinceDropdown();
      renderSmartFilterChips();
      applyUltimateFilters(false, false);
      updateHeroSwiperCards();
      return true;

    } catch (err) {
      console.error("❌ โหลดข้อมูลล้มเหลว นำข้อมูลเก่ามาแสดงแทน:", err);
      const fallbackRaw = await idb.get(CONFIG.KEYS.CACHE_PROFILES) || JSON.parse(localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES) || "[]");
      if (fallbackRaw && Array.isArray(fallbackRaw) && fallbackRaw.length > 0) {
        STATE.allProfiles = deduplicateProfiles(fallbackRaw.map(p => processProfileObject(p)).filter(Boolean));
        populateProvinceDropdown();
        renderSmartFilterChips();
        applyUltimateFilters(false, false);
        updateHeroSwiperCards();
      } else {
        handleFatalError(err);
      }
      return false;
    } finally {
      STATE.isFetching = false;
    }
  }

  function updateHeroSwiperCards(targetProvinceKey = null) {
    const swiperContainer = document.getElementById("vip-swiper-container");
    if (!swiperContainer || !STATE.allProfiles || STATE.allProfiles.length === 0) return;

    let currentProvKey = "national";
const isHomePage = window.location.pathname === "/" || window.location.pathname === "/index.html";

if (!isHomePage) {
  currentProvKey = normalizeProvinceKey(targetProvinceKey || DOM.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || "national");
} else if (targetProvinceKey || (DOM.provinceSelect?.value && DOM.provinceSelect.value !== "all")) {
  currentProvKey = normalizeProvinceKey(targetProvinceKey || DOM.provinceSelect.value);
}

    let scopedProfiles = STATE.allProfiles;
    if (currentProvKey && currentProvKey !== "national" && currentProvKey !== "all") {
      scopedProfiles = STATE.allProfiles.filter(p => normalizeProvinceKey(p.provinceKey) === currentProvKey);
    }

    if (scopedProfiles.length === 0) scopedProfiles = STATE.allProfiles;

    let hotProfiles = scopedProfiles.filter(p => {
      const tags = Array.isArray(p.styleTags) ? p.styleTags : (typeof p.styleTags === 'string' ? p.styleTags.split(',') : []);
      const tagText = `${tags.join(" ")} ${p.slogan || ''} ${p.quote || ''}`.toLowerCase();
      return tagText.includes("ฟิวแฟน") || tagText.includes("ฟิลแฟน");
    });

    if (hotProfiles.length === 0) hotProfiles = scopedProfiles.slice(0, 8);
    else hotProfiles = hotProfiles.slice(0, 8);

    swiperContainer.innerHTML = hotProfiles.map((p, idx) => {
      const rankText = `#${idx + 1} HOT`;
      const realLocation = p.location || p.provinceNameThai || STATE.provincesMap.get(p.provinceKey) || "ทั่วไทย";
      const pSlug = encodeURIComponent(p.slug || p.id);
      const imgUrl = p.images[0]?.src || CONFIG.DEFAULT_OG_IMAGE;
      const isAvail = p.status === "รับงาน" || !(p.availability || "").toLowerCase().includes("ไม่ว่าง");
      const availText = isAvail ? "รับงาน" : "สอบถาม";

      return `
        <div class="vip-card-item ${idx === 0 ? 'active-glow' : ''}" data-profile-id="${p.id}" data-profile-slug="${pSlug}">
          <span class="vip-status-chip">🟢 ${availText}</span>
          <span class="hot-rank-badge"><i class="fas fa-crown"></i> ${rankText}</span>
          <img src="${imgUrl}" alt="${p.displayName}" loading="${idx < 2 ? 'eager' : 'lazy'}" onerror="this.src='${CONFIG.DEFAULT_OG_IMAGE}'">
          <div class="vip-card-overlay"></div>
          <a href="/sideline/${pSlug}" class="card-link" aria-label="ดูโปรไฟล์${p.displayName}"></a>
          <div class="vip-card-info">
            <div class="vip-name">${p.displayName}</div>
            <div class="vip-location"><i class="fas fa-map-marker-alt"></i> ${realLocation}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  function populateProvinceDropdown() {
    if (!DOM.provinceSelect) return;

    const activeProvinceCounts = new Map();
    STATE.allProfiles.forEach(p => {
      if (p.provinceKey) {
        const k = normalizeProvinceKey(p.provinceKey);
        activeProvinceCounts.set(k, (activeProvinceCounts.get(k) || 0) + 1);
      }
    });

    while (DOM.provinceSelect.options.length > 1) {
      DOM.provinceSelect.remove(1);
    }

    const sortedProvinces = Array.from(STATE.provincesMap.entries())
      .filter(([key]) => (activeProvinceCounts.get(normalizeProvinceKey(key)) || 0) > 0)
      .sort((a, b) => a[1].localeCompare(b[1], "th"));

    const fragment = document.createDocumentFragment();
    const modalChipsContainer = document.getElementById("modal-province-chips");
    let modalChipsHTML = `<button type="button" class="luxury-chip province-chip active" data-value="">ทั้งหมด</button>`;

    sortedProvinces.forEach(([key, name]) => {
      const normKey = normalizeProvinceKey(key);
      const count = activeProvinceCounts.get(normKey) || 0;
      const opt = document.createElement("option");
      opt.value = normKey;
      opt.textContent = `${name} (${count})`;
      fragment.appendChild(opt);

      modalChipsHTML += `<button type="button" class="luxury-chip province-chip" data-value="${normKey}">${name} (${count})</button>`;
    });

    DOM.provinceSelect.appendChild(fragment);

    if (modalChipsContainer) {
      modalChipsContainer.innerHTML = modalChipsHTML;
    }
  }

  function createProfileCardElement(profile, index = 20) {
    const container = document.createElement("div");
    container.className = "profile-card-new-container";

    const card = document.createElement("div");
    card.className = "profile-card-new interactive-card";
    card.setAttribute("data-profile-id", profile.id);
    card.setAttribute("data-profile-slug", profile.slug || profile.id);

    const imageSrc = profile.images && profile.images.length > 0 ? profile.images[0].src : CONFIG.DEFAULT_OG_IMAGE;
    const currentProvName = profile.provinceNameThai || STATE.provincesMap.get(profile.provinceKey) || "ทั่วไทย";
    const nameClean = sanitizeName(profile.displayName || profile.name);
    
    const pLoc = profile.location || currentProvName;
    const seoAltText = `${nameClean} สาวรับงาน${currentProvName} ย่าน${pLoc} ไซด์ไลน์ตรงปก 100%`;

    const isAvailable = profile.status === "รับงาน" || !(profile.availability || "").toLowerCase().includes("ไม่ว่าง");
    const statusDotColor = isAvailable ? "#00E676" : "#FF2E63";
    const statusText = profile.availability || (isAvailable ? "รับงาน" : "สอบถามคิว");
    
    const ageDisplay = (profile.safeAge && profile.safeAge !== "-" && profile.safeAge !== "ไม่ระบุ") ? ` <span style="font-size: 0.85em; opacity: 0.9;">(${profile.safeAge})</span>` : "";

    const featuredBadge = profile.isfeatured
      ? `<span style="background: rgba(90, 44, 190, 0.88); border: 1px solid rgba(192, 132, 252, 0.5); color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-star" style="font-size: 9px; color: #FBBF24;"></i>
          <span style="letter-spacing: 0.02em;">แนะนำ</span>
         </span>`
      : "";

    const statusBadge = `
      <span style="background: rgba(9, 9, 11, 0.82); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${statusDotColor}; box-shadow: 0 0 6px ${statusDotColor}; flex-shrink: 0;"></span>
          <span style="letter-spacing: 0.02em;">${statusText}</span>
      </span>
    `;

    const videoBadge = profile.hasVideo
      ? `<span style="background: rgba(255, 46, 99, 0.35); border: 1px solid rgba(255, 46, 99, 0.6); color: #FF2E63; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-video" style="font-size: 9px;"></i> คลิป
         </span>`
      : "";

    const verifiedBadge = (profile.isVerified || profile.verified)
      ? `<span style="background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(52, 211, 153, 0.55); color: #00E676; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-check-circle" style="font-size: 9px; color: #00E676;"></i> ยืนยันตัวตน
         </span>`
      : "";

    const encodedSlug = encodeURIComponent(profile.slug || profile.id);

card.innerHTML = `
<img src="${imageSrc}" 
   alt="${seoAltText}"
   title="${seoAltText}"
     width="300" height="400"
     class="profile-card-img-cover" 
     loading="${index === 0 ? "eager" : "lazy"}"
     decoding="async"
     onerror="this.onerror=null; this.src='/images/firstmodelhub.webp';" />
               
<div class="profile-card-gradient"></div>

<div class="profile-card-badge-top-left">
    ${featuredBadge}
    ${statusBadge}
    ${videoBadge}
</div>

      <div style="position: absolute; top: 6px; right: 6px; z-index: 30; pointer-events: none; display: flex; align-items: center; gap: 4px;">
          ${verifiedBadge}
          <button type="button" data-action="like" data-id="${profile.id}" class="like-heart-btn" aria-label="กดถูกใจโปรไฟล์">
            <i class="fas fa-heart" style="font-size: 12px;"></i>
          </button>
      </div>
      
      <a href="/sideline/${encodedSlug}" class="card-link" style="position: absolute; inset: 0; z-index: 25;" aria-label="ดูโปรไฟล์${nameClean}"></a>

      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 6px 10px 8px 10px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 1px;">
          <h3 style="font-size: 14px; font-weight: 800; color: white; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 4px rgba(0,0,0,0.95);">
            ${nameClean}${ageDisplay}
          </h3>
          
          ${(profile.slogan || profile.quote) ? `<p style="font-size: 11px; color: #C084FC; font-weight: 600; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">${profile.slogan || profile.quote}</p>` : ''}
          
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #D4D4D8; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 3px; margin-top: 2px;">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">
                  <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 2px;"></i> ${pLoc}
              </span>
              <span style="color: #00E676; font-weight: 900; font-size: 13px; text-shadow: 0 1.5px 3px rgba(0,0,0,0.95);">
                  ${profile.displayPrice}
              </span>
          </div>
      </div>
    `;

    container.appendChild(card);
    return container;
  }

  async function appendProfilesToContainer(gridElement, profiles, activeRenderId) {
    if (!gridElement || !profiles) return;
    gridElement.dataset.activeRenderId = activeRenderId;
    gridElement.innerHTML = "";

    const fragment = document.createDocumentFragment();
    const batchSize = profiles.length > 20 ? 4 : 8;

    for (let i = 0; i < profiles.length; i++) {
      if (activeRenderId !== undefined && Number(gridElement.dataset.activeRenderId) !== activeRenderId) {
        return;
      }

      const card = createProfileCardElement(profiles[i], i);
      fragment.appendChild(card);

      if ((i + 1) % batchSize === 0 || i === profiles.length - 1) {
        gridElement.appendChild(fragment);
        await new Promise(res => requestAnimationFrame(res));
      }
    }
  }

  function createProvinceSectionElement(provinceKey, provinceName, profiles) {
    const wrapper = document.createElement("div");
    wrapper.className = "section-content-wrapper province-section mt-6";
    wrapper.id = `province-${provinceKey}`;
    
    wrapper.innerHTML = `
      <div class="flex justify-between items-center flex-wrap gap-2 p-2">
          <a href="/location/${provinceKey}" class="group" style="text-decoration: none; display: inline-block;">
              <h2 class="province-section-header" style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 18px; font-weight: 800; color: white; margin: 0;">
                  📍 น้องๆ ในจังหวัด <span style="color: #C084FC;">${provinceName}</span>
                  <span class="live-count-chip">
                    <span class="pulse-dot-el"></span>
                    <span>พบ ${profiles.length} โปรไฟล์พร้อมรับงาน</span>
                  </span>
                  <i class="fas fa-chevron-right" style="font-size: 12px; margin-left: 4px; color: var(--primary-purple);"></i>
              </h2>
          </a>
      </div>
      <div class="profiles-grid-row mt-2"></div>
    `;
    return wrapper;
  }

  function renderActiveFilterChips() {
    let container = document.getElementById("active-filter-chips");
    if (!container) {
      container = document.createElement("div");
      container.id = "active-filter-chips";
      container.style.cssText = "display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; justify-content: center;";
      const searchForm = document.getElementById("search-form");
      if (searchForm && searchForm.parentNode) {
        searchForm.parentNode.insertBefore(container, searchForm.nextSibling);
      }
    }

    const text = (DOM.searchInput?.value || "").trim();
    const prov = DOM.provinceSelect?.value;
    const avail = DOM.availabilitySelect?.value;
    const featured = DOM.featuredSelect?.value === "true";

    const activeItems = [];

    if (text) {
      activeItems.push({
        label: `🔍 "${text}"`,
        clear: () => {
          if (DOM.searchInput) DOM.searchInput.value = "";
          const modalInput = document.getElementById("modal-search-keyword");
          if (modalInput) modalInput.value = "";
          const clearBtn = document.getElementById("clear-modal-text-btn");
          if (clearBtn) clearBtn.style.display = "none";
          applyUltimateFilters(true, true);
        }
      });
    }

    if (prov && prov !== "all" && prov !== "") {
      const provName = STATE.provincesMap.get(normalizeProvinceKey(prov)) || prov;
      activeItems.push({
        label: `📍 ${provName}`,
        clear: () => {
          if (DOM.provinceSelect) DOM.provinceSelect.value = "";
          document.querySelectorAll("#modal-province-chips .province-chip").forEach(b => b.classList.remove("active"));
          document.querySelector("#modal-province-chips .province-chip[data-value='']")?.classList.add("active");
          applyUltimateFilters(true, true);
        }
      });
    }

    if (avail && avail !== "all" && avail !== "") {
      activeItems.push({
        label: `🟢 ${avail}`,
        clear: () => {
          if (DOM.availabilitySelect) DOM.availabilitySelect.value = "";
          document.querySelectorAll("#modal-availability-chips .avail-chip").forEach(b => b.classList.remove("active"));
          document.querySelector("#modal-availability-chips .avail-chip[data-value='']")?.classList.add("active");
          applyUltimateFilters(true, true);
        }
      });
    }

    if (featured) {
      activeItems.push({
        label: `⭐ VIP แนะนำ`,
        clear: () => {
          if (DOM.featuredSelect) DOM.featuredSelect.value = "";
          applyUltimateFilters(true, true);
        }
      });
    }

    if (activeItems.length === 0) {
      container.innerHTML = "";
      container.style.display = "none";
      return;
    }

    container.style.display = "flex";
    container.innerHTML = activeItems.map((item, idx) => `
      <span class="active-chip-item" data-idx="${idx}" style="background: rgba(192, 132, 252, 0.18); border: 1px solid rgba(192, 132, 252, 0.4); color: #E9D5FF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 100px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
        ${item.label}
        <i class="fas fa-times-circle" style="color: #FF85C0; font-size: 11px;"></i>
      </span>
    `).join("");

    container.querySelectorAll(".active-chip-item").forEach(btn => {
      btn.onclick = () => {
        const idx = Number(btn.dataset.idx);
        if (activeItems[idx] && activeItems[idx].clear) {
          activeItems[idx].clear();
        }
      };
    });
  }

  function renderSmartFilterChips() {
    let chipsWrapper = document.getElementById("smart-quick-chips");
    if (!chipsWrapper) {
      chipsWrapper = document.createElement("div");
      chipsWrapper.id = "smart-quick-chips";
      chipsWrapper.className = "horizontal-scroll-chips";
      chipsWrapper.style.cssText = "padding: 8px 2px; margin-top: 8px;";
      
      const searchForm = document.getElementById("search-form");
      if (searchForm && searchForm.parentNode) {
        searchForm.parentNode.insertBefore(chipsWrapper, searchForm.nextSibling);
      }
    }

    const currentProv = normalizeProvinceKey(DOM.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || "national");
    const data = LOCALIZED_SEO_MAP[currentProv] || LOCALIZED_SEO_MAP["national"];
    const zones = (data && data.zones) ? data.zones.slice(1, 5) : ["ตัวเมือง"];

    let chipsHtml = `
      <button type="button" class="quick-chip-btn luxury-chip" data-type="featured" style="background: rgba(124, 58, 237, 0.18); border-color: rgba(192, 132, 252, 0.35); color: #E9D5FF; display: inline-flex; align-items: center; gap: 4px;">
        <i class="fas fa-star" style="color: #FBBF24;"></i> VIP แนะนำ
      </button>
      <button type="button" class="quick-chip-btn luxury-chip" data-type="avail" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(52, 211, 153, 0.35); color: #00E676; display: inline-flex; align-items: center; gap: 4px;">
        <span class="pulse-green-dot"></span> พร้อมรับงาน
      </button>
      <button type="button" class="quick-chip-btn luxury-chip" data-type="tag" data-val="ฟิวแฟน" style="background: rgba(255, 20, 147, 0.15); border-color: rgba(255, 105, 180, 0.35); color: #FF85C0; display: inline-flex; align-items: center; gap: 4px;">
        <i class="fas fa-heart" style="color: #FF1493;"></i> #ฟิวแฟน
      </button>
    `;

    zones.forEach(z => {
      chipsHtml += `
        <button type="button" class="quick-chip-btn luxury-chip" data-type="keyword" data-val="${z}" style="display: inline-flex; align-items: center; gap: 4px;">
          <i class="fas fa-map-marker-alt" style="color: #C084FC;"></i> ${z}
        </button>
      `;
    });

    chipsWrapper.innerHTML = chipsHtml;

    chipsWrapper.querySelectorAll(".quick-chip-btn").forEach(btn => {
      btn.onclick = () => {
        const type = btn.dataset.type;
        const val = btn.dataset.val;

        if (type === "featured" && DOM.featuredSelect) {
          DOM.featuredSelect.value = DOM.featuredSelect.value === "true" ? "" : "true";
        } else if (type === "avail" && DOM.availabilitySelect) {
          DOM.availabilitySelect.value = DOM.availabilitySelect.value === "รับงาน" ? "" : "รับงาน";
        } else if ((type === "tag" || type === "keyword") && DOM.searchInput) {
          DOM.searchInput.value = val;
          const modalInput = document.getElementById("modal-search-keyword");
          if (modalInput) modalInput.value = val;
        }
        applyUltimateFilters(true, true);
      };
    });
  }

  function applyUltimateFilters(updateUrlHistory = true, isUserAction = false) {
    try {
      const modalSearchInput = document.getElementById("modal-search-keyword");
      const searchKeywordVal = (DOM.searchInput?.value || modalSearchInput?.value || "").trim();

      const activeFilters = {
        text: searchKeywordVal,
        province: normalizeProvinceKey(DOM.provinceSelect?.value || "all"),
        avail: DOM.availabilitySelect?.value || "all",
        featured: DOM.featuredSelect?.value === "true",
        sort: DOM.sortSelect?.value || "featured",
        price: document.getElementById("search-price")?.value || "" 
      };

      if (activeFilters.text) saveRecentSearch(activeFilters.text);

      if (activeFilters.province && activeFilters.province !== "all" && activeFilters.province !== "") {
        localStorage.setItem(CONFIG.KEYS.LAST_PROVINCE, activeFilters.province);
      }

      let results = [...STATE.allProfiles];

      const urlPath = window.location.pathname.toLowerCase();
      const locMatch = urlPath.match(/^\/(?:location|province)\/([^/]+)/);
      
      let urlProvinceKey = "national";
      if (locMatch) {
        try { urlProvinceKey = normalizeProvinceKey(decodeURIComponent(locMatch[1])); } catch (e) { urlProvinceKey = normalizeProvinceKey(locMatch[1]); }
      }

      let targetProvinceKey = (activeFilters.province && activeFilters.province !== "all" && activeFilters.province !== "") 
        ? activeFilters.province 
        : urlProvinceKey;

      targetProvinceKey = normalizeProvinceKey(targetProvinceKey);

      if (targetProvinceKey && targetProvinceKey !== "national" && targetProvinceKey !== "all") {
        results = results.filter(p => normalizeProvinceKey(p.provinceKey) === targetProvinceKey);
      }

      if (activeFilters.text) {
        const queryRaw = activeFilters.text.toLowerCase().trim();
        const queryClean = queryRaw.replace(/^(น้อง\s?)+/gi, "").trim();

        results = results.filter(p => {
          const pName = (p.displayName || p.name || "").toLowerCase();
          const pCleanName = pName.replace(/^(น้อง\s?)+/gi, "").trim();
          const pLoc = (p.location || "").toLowerCase();
          const pProv = (p.provinceNameThai || "").toLowerCase();
          const pSlogan = (p.slogan || p.quote || "").toLowerCase();
          const pDesc = (p.description || "").toLowerCase();
          const pTags = Array.isArray(p.styleTags) ? p.styleTags.join(" ").toLowerCase() : (p.styleTags || "").toLowerCase();
          const pId = String(p.id || "");
          const pSlug = (p.slug || "").toLowerCase();

          return (
            pId === queryRaw ||
            pSlug.includes(queryRaw) ||
            pName.includes(queryRaw) ||
            pCleanName.includes(queryClean) ||
            pLoc.includes(queryRaw) ||
            pProv.includes(queryRaw) ||
            pSlogan.includes(queryRaw) ||
            pDesc.includes(queryRaw) ||
            pTags.includes(queryRaw)
          );
        });
      }

      if (activeFilters.avail && activeFilters.avail !== "all") {
        results = results.filter(p => p.availability === activeFilters.avail);
      }

      if (activeFilters.featured) {
        results = results.filter(p => p.isfeatured === true);
      }

      if (activeFilters.price) {
        results = results.filter(p => {
          const price = p._price || 0;
          if (activeFilters.price === "under1500") return price > 0 && price <= 1500;
          if (activeFilters.price === "1500-2500") return price > 1500 && price <= 2500;
          if (activeFilters.price === "above2500") return price > 2500;
          return true;
        });
      }

      results = deduplicateProfiles(results);

      results.sort((a, b) => {
        if (activeFilters.text) return 0;
        switch (activeFilters.sort) {
          case "featured":
            return (b.isfeatured ? 1 : 0) - (a.isfeatured ? 1 : 0) || (a.name || "").localeCompare(b.name || "");
          case "name_asc":
            return (a.name || "").localeCompare(b.name || "");
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "price_asc":
            return (a._price || 0) - (b._price || 0); 
          case "price_desc":
            return (b._price || 0) - (a._price || 0);
          default:
            return 0;
        }
      });

      renderActiveFilterChips();
      
      const isSingleProfilePage = Boolean(document.querySelector(".single-profile-wrapper"));
      if (!isSingleProfilePage) {
        renderProfilesGrid(results, activeFilters.text || (activeFilters.province && activeFilters.province !== "all" && activeFilters.province !== "") || activeFilters.avail !== "all" || activeFilters.featured || activeFilters.price, isUserAction);
      }

      updateHeroSwiperCards(targetProvinceKey);

      if (updateUrlHistory && !isSingleProfilePage) {
        let newPath = "/";
        if (activeFilters.province && activeFilters.province !== "all" && activeFilters.province !== "" && activeFilters.province !== "national") {
          newPath = `/location/${activeFilters.province}`;
        }
        if (window.location.pathname !== newPath) {
          history.pushState(null, "", newPath);
        }
      }

      STATE.currentFilters = activeFilters;
      STATE.filteredProfiles = results;

      const currentProvKey = activeFilters.province && activeFilters.province !== "all" && activeFilters.province !== "" ? activeFilters.province : "national";
      const currentProvName = (currentProvKey === "national") ? "ทั่วไทย" : (STATE.provincesMap.get(currentProvKey) || "ทั่วไทย");
      replaceDomPlaceholders(currentProvName, results.length, currentProvKey);

      if (isUserAction && !isSingleProfilePage) {
        scrollToSearchResults();
      }

    } catch (e) {
      console.error("❌ เกิดข้อผิดพลาดในระบบการกรอง:", e);
    }
  }

  function scrollToSearchResults() {
    const targetElement = document.getElementById("profiles-display-area");
    if (!targetElement) return;

    const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }

  async function renderProfilesGrid(profiles, isFilteredView, isUserAction = false) {
    if (!DOM.profilesDisplayArea) return;

    STATE.renderId = (STATE.renderId || 0) + 1;
    const currentRenderId = STATE.renderId;

    // 🟢 ตรวจสอบว่านี่คือการรัน JavaScript สร้างหน้าจอครั้งแรก (Hydration) หรือไม่
    const isFirstHydration = STATE.renderId === 1;

    destroyLoadingPlaceholder();
    
    if (DOM.noResultsMessage) DOM.noResultsMessage.classList.add("hidden");
    if (DOM.fetchErrorMessage) DOM.fetchErrorMessage.classList.add("hidden");

    const allProfiles = STATE.allProfiles || [];

    if (DOM.featuredSection) {
      const isHomePage = !isFilteredView && !window.location.pathname.includes("/location/");
      const featuredProfiles = allProfiles.filter(p => p.isfeatured);
      DOM.featuredSection.classList.toggle("hidden", !isHomePage || featuredProfiles.length === 0);

      // ถ้าเป็นหน้าแรก มีน้องๆ แนะนำ และ กล่อง HTML ยังว่างเปล่า ให้เติมเข้าไป
      if (isHomePage && featuredProfiles.length > 0 && DOM.featuredContainer && DOM.featuredContainer.children.length === 0) {
        await appendProfilesToContainer(DOM.featuredContainer, featuredProfiles, currentRenderId);
      }
    }

    if (!profiles || profiles.length === 0) {
      DOM.profilesDisplayArea.innerHTML = "";

      const recommendations = allProfiles.filter(p => p.isfeatured || p.isAvailable).slice(0, 6);

      let fallbackHtml = `
        <div class="empty-state-box text-center mt-4">
          <div class="empty-icon" style="font-size: 36px; margin-bottom: 8px;">🔍</div>
          <h3 class="text-md font-extrabold text-white m-0" style="font-size: 15px;">ไม่พบโปรไฟล์ที่ตรงกับเงื่อนไขที่คุณค้นหา</h3>
          <p class="text-xs text-gray-muted mt-2" style="font-size: 12px; color: #A1A1AA;">ลองลดตัวกรอง พิมพ์คำค้นหาใหม่ หรือกดล้างตัวกรองด้านล่าง</p>
          <button id="fallback-reset-btn" class="btn-outline-purple mt-3" style="background: rgba(124, 58, 237, 0.2); border: 1px solid #C084FC; color: #E9D5FF; padding: 8px 18px; border-radius: 100px; font-weight: 800; font-size: 12px; cursor: pointer; margin-top: 12px;">🔄 ล้างตัวกรองค้นหาทั้งหมด</button>
        </div>
      `;

      if (recommendations.length > 0) {
        fallbackHtml += `
          <div style="margin-top: 24px;">
            <h3 style="font-size: 14px; font-weight: 800; color: #C084FC; margin-bottom: 12px;">💡 โปรไฟล์ยอดนิยมแนะนำที่คุณอาจสนใจ:</h3>
            <div class="profiles-grid-row" id="fallback-grid-area"></div>
          </div>
        `;
      }

      DOM.profilesDisplayArea.innerHTML = fallbackHtml;

      if (recommendations.length > 0) {
        const fallbackGrid = document.getElementById("fallback-grid-area");
        if (fallbackGrid) {
          await appendProfilesToContainer(fallbackGrid, recommendations, currentRenderId);
        }
      } else {
        if (DOM.noResultsMessage) DOM.noResultsMessage.classList.remove("hidden");
      }

      document.getElementById("fallback-reset-btn")?.addEventListener("click", () => {
        DOM.resetSearchBtn?.click();
      });

      bindMediaProtection();
      if (isUserAction) scrollToSearchResults();
      return;
    }

    // 🟢 [หัวใจสำคัญที่แก้ปัญหาจอกระตุก]
    // ถ้าเป็นการโหลดครั้งแรกสุด (isFirstHydration) และมี HTML การ์ดน้องๆ ถูกสร้างมาจากฝั่ง Server รออยู่แล้ว
    // และไม่ใช่การกดปุ่ม Filter ด้วยตัวผู้ใช้เอง (!isUserAction) 
    // -> ให้หยุดการทำงาน (return) เพื่อไม่ให้มันลบ HTML ทิ้งแล้ววาดใหม่ ทำให้จอไม่กระพริบ
    if (isFirstHydration && DOM.profilesDisplayArea.children.length > 0 && !isUserAction) {
        bindMediaProtection();
        if (window.ScrollTrigger) {
          setTimeout(() => ScrollTrigger.refresh(), 200);
        }
        return; 
    }

    // หากผ่านด่านเช็คด้านบนมาได้ (แปลว่าผู้ใช้กด Filter หรือเปลี่ยนจังหวัด) ก็เคลียร์ HTML เก่าทิ้ง
    DOM.profilesDisplayArea.innerHTML = "";
    const isLocationPage = window.location.pathname.includes("/location/") || window.location.pathname.includes("/province/");

    if (isFilteredView || isLocationPage) {
      const currentProvKey = normalizeProvinceKey(DOM.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || "national");
      const provName = STATE.provincesMap?.get(currentProvKey) || "ทั่วไทย";
      const count = profiles.length;

      let headingTitle = `📍 น้องๆ ในจังหวัด <span class="text-purple mx-1" style="color: #C084FC;">${provName}</span>`;
      const modalKeyword = document.getElementById("modal-search-keyword")?.value;
      if (DOM.searchInput?.value || modalKeyword) {
        headingTitle = `🔍 ผลการค้นหา "${DOM.searchInput?.value || modalKeyword}"`;
      }

      const sectionWrapper = document.createElement("div");
      sectionWrapper.className = "mt-4 relative";
      
      sectionWrapper.innerHTML = `
        <div class="flex justify-between items-center flex-wrap gap-2 p-2" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; padding: 8px 4px;">
            <h2 class="text-lg font-extrabold text-white m-0 flex items-center flex-wrap gap-2" style="font-size: 18px; font-weight: 800; color: white; margin: 0; display: flex; align-items: center; gap: 8px;">
                ${headingTitle}
                <span class="live-count-chip">
                  <span class="pulse-dot-el"></span>
                  <span>พบ ${count} โปรไฟล์พร้อมรับงาน</span>
                </span>
            </h2>
        </div>
        <div class="profiles-grid-row mt-2"></div>
      `;

      DOM.profilesDisplayArea.appendChild(sectionWrapper);

      await appendProfilesToContainer(sectionWrapper.querySelector(".profiles-grid-row"), profiles, currentRenderId);
      if (isUserAction) scrollToSearchResults();

    } else {
      const grouped = profiles.reduce((acc, p) => {
        const key = p.provinceKey || "no_province";
        acc[key] = acc[key] || [];
        acc[key].push(p);
        return acc;
      }, {});

      const sortedProvinceKeys = Object.keys(grouped).sort((a, b) => {
        const nameA = STATE.provincesMap?.get(a) || a;
        const nameB = STATE.provincesMap?.get(b) || b;
        return nameA.localeCompare(nameB, "th");
      });

      if (sortedProvinceKeys.length !== 0) {
        for (const key of sortedProvinceKeys) {
          if (STATE.renderId !== currentRenderId) return;

          const name = STATE.provincesMap?.get(key) || (key === "no_province" ? "ไม่ระบุจังหวัด" : key);
          const cleanGroupProfiles = deduplicateProfiles(grouped[key]);
          const section = createProvinceSectionElement(key, name, cleanGroupProfiles);

          DOM.profilesDisplayArea.appendChild(section);

          const grid = section.querySelector(".profiles-grid-row");
          await appendProfilesToContainer(grid, cleanGroupProfiles, currentRenderId);
        }
        if (isUserAction) scrollToSearchResults();
      } else {
        if (DOM.noResultsMessage) DOM.noResultsMessage.classList.remove("hidden");
      }
    }

    bindMediaProtection();
    if (window.ScrollTrigger) {
      setTimeout(() => ScrollTrigger.refresh(), 200);
    }
  }

    

  function bindMediaProtection() {
    if (!DOM.profilesDisplayArea) return;
    DOM.profilesDisplayArea.querySelectorAll("img").forEach(img => {
      img.oncontextmenu = e => e.preventDefault();
      img.ondragstart = e => e.preventDefault();
    });
  }

  // ✅ FIX: ระบบเลื่อนดูโปรไฟล์ถัดไป (Next/Prev) ในหน้าต่าง Lightbox
  function setupLightboxNavigation(currentIndex) {
    let navContainer = document.getElementById("lightbox-nav-buttons");
    if (!navContainer) {
      const wrapper = document.getElementById("lightbox-content-wrapper-el");
      if (!wrapper) return;
      navContainer = document.createElement("div");
      navContainer.id = "lightbox-nav-buttons";
      navContainer.style.cssText = "position: absolute; top: 50%; width: 100%; left: 0; transform: translateY(-50%); display: flex; justify-content: space-between; pointer-events: none; z-index: 50; padding: 0 10px;";
      
      navContainer.innerHTML = `
        <button id="lightbox-prev-btn" style="pointer-events: auto; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(8px); transform: translateX(-20px); transition: transform 0.2s;"><i class="fas fa-chevron-left"></i></button>
        <button id="lightbox-next-btn" style="pointer-events: auto; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(8px); transform: translateX(20px); transition: transform 0.2s;"><i class="fas fa-chevron-right"></i></button>
      `;
      wrapper.appendChild(navContainer);
    }

    const prevBtn = document.getElementById("lightbox-prev-btn");
    const nextBtn = document.getElementById("lightbox-next-btn");
    const total = STATE.filteredProfiles.length;

    if (total <= 1 || currentIndex === -1) {
      navContainer.style.display = "none"; 
      return;
    } else {
      navContainer.style.display = "flex";
    }

    prevBtn.style.display = currentIndex > 0 ? "flex" : "none";
    nextBtn.style.display = currentIndex < total - 1 ? "flex" : "none";

    prevBtn.onclick = (e) => { 
      e.stopPropagation(); 
      if (currentIndex > 0) {
        openLightboxForProfile(STATE.filteredProfiles[currentIndex - 1]); 
      }
    };
    nextBtn.onclick = (e) => { 
      e.stopPropagation(); 
      if (currentIndex < total - 1) {
        openLightboxForProfile(STATE.filteredProfiles[currentIndex + 1]); 
      }
    };
  }

  function openLightboxForProfile(profile) {
    if (!profile) return;

    const lightbox = document.getElementById("lightbox");
    const wrapper = document.getElementById("lightbox-content-wrapper-el");
    if (!lightbox) return;

    const nameClean = profile.displayName || sanitizeName(profile.name);
    
    const isAvailable = profile.isAvailable !== undefined ? profile.isAvailable : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(t => (profile.availability || "").toLowerCase().includes(t));
    const statusText = profile.availability || (isAvailable ? "รับงาน" : "สอบถามคิว");
    const statusColor = isAvailable ? "#00E676" : "#FF2E63";

    const titleEl = document.getElementById("lightbox-profile-name-main");
    if (titleEl) {
      titleEl.innerHTML = `
        <span style="font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #FFF 0%, #FF85C0 35%, #FF1493 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${nameClean}</span>
        ${profile.isVerified ? '<i class="fas fa-check-circle" style="color: #00E676; margin-left: 6px; font-size: 16px;" title="ยืนยันตัวตนแล้ว"></i>' : ""}
      `;
    }

    const badgeEl = document.getElementById("lightbox-availability-badge-wrapper");
    if (badgeEl) {
      badgeEl.innerHTML = `
        <span style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 4px 12px; border-radius: 100px; display: inline-flex; align-items: center; gap: 6px;">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: ${statusColor}; box-shadow: 0 0 8px ${statusColor}; flex-shrink: 0;"></span>
            <span style="color: white; font-size: 12px; font-weight: 700; letter-spacing: 0.02em;">${statusText}</span>
        </span>
      `;
    }

    const heroImg = document.getElementById("lightboxHeroImage");
    if (heroImg) {
      const hdSrc = profile?.images?.[0]?.fullSrc || profile?.images?.[0]?.src || profile?.imagePath || CONFIG.DEFAULT_OG_IMAGE;
      heroImg.src = hdSrc;
      heroImg.alt = `${nameClean} สาวรับงาน${profile.provinceNameThai || "ทั่วไทย"}`;
    }

    const strip = document.getElementById("lightboxThumbnailStrip");
    if (strip) {
      strip.innerHTML = "";
      if (profile.images && profile.images.length > 1) {
        profile.images.forEach((imgObj, idx) => {
          const thumb = document.createElement("img");
          thumb.src = imgObj.src;
          thumb.alt = `ภาพที่ ${idx + 1}`;
          if (idx === 0) {
            thumb.style.borderColor = "#C084FC";
            thumb.style.opacity = "1";
          }
          thumb.onclick = () => {
            if (heroImg) heroImg.src = imgObj.fullSrc || imgObj.src;
            Array.from(strip.children).forEach(child => { child.style.borderColor = "transparent"; child.style.opacity = "0.5"; });
            thumb.style.borderColor = "#C084FC";
            thumb.style.opacity = "1";
          };
          strip.appendChild(thumb);
        });
        strip.style.display = "flex";
      } else {
        strip.style.display = "none";
      }
    }

    const quoteEl = document.getElementById("lightboxQuote");
    if (quoteEl) {
      quoteEl.textContent = profile.quote || profile.slogan || "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน ยินดีที่ได้รู้จักค่ะ";
    }

    const tagsEl = document.getElementById("lightboxTags");
    if (tagsEl) {
      tagsEl.innerHTML = "";
      const tagsList = Array.isArray(profile.styleTags) ? profile.styleTags : [];
      tagsList.forEach(tag => {
        const span = document.createElement("span");
        span.className = "luxury-chip";
        span.style.padding = "4px 10px";
        span.style.fontSize = "11px";
        span.textContent = tag.startsWith("#") ? tag : `#${tag}`;
        tagsEl.appendChild(span);
      });
    }

    let ageDisplay = "ไม่ระบุ";
    if (profile.safeAgeDisplay && profile.safeAgeDisplay !== "undefined") {
      ageDisplay = profile.safeAgeDisplay;
    }

    const statsText = (profile.safeStats && profile.safeStats !== "undefined") ? profile.safeStats : "ไม่ระบุ";
    const heightText = (profile.safeHeight && profile.safeHeight !== "undefined") ? profile.safeHeight : "ไม่ระบุ";

    const detailsEl = document.getElementById("lightboxDetailsCompact");
    if (detailsEl) {
      detailsEl.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 12px; text-align: center;">
                <div style="font-size: 11px; color: #A1A1AA; font-weight: 600;">อายุ</div>
                <div style="font-weight: 800; font-size: 13px; color: white; margin-top: 2px;">${ageDisplay}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 12px; text-align: center;">
                <div style="font-size: 11px; color: #A1A1AA; font-weight: 600;">สัดส่วน</div>
                <div style="font-weight: 800; font-size: 13px; color: white; margin-top: 2px;">${statsText}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 12px; text-align: center;">
                <div style="font-size: 11px; color: #A1A1AA; font-weight: 600;">ส่วนสูง</div>
                <div style="font-weight: 800; font-size: 13px; color: white; margin-top: 2px;">${heightText}</div>
            </div>
        </div>

        <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #A1A1AA; font-size: 12px; font-weight: 600;">ค่าขนม</span>
                <span style="color: #00E676; font-weight: 900; font-size: 14px;">${profile.displayPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #A1A1AA; font-size: 12px; font-weight: 600;">พิกัดงาน</span>
                <span style="color: white; font-weight: 700; font-size: 12px;">${profile.location || profile.provinceNameThai || "ทั่วไทย"}</span>
            </div>
        </div>
      `;
    }

    const descContainer = document.getElementById("lightboxDescriptionContainer");
    const descContent = document.getElementById("lightboxDescriptionContent");
    if (descContent) {
      const defaultDesc = `${nameClean} ยืนยันตัวตนตรงปก 100% พร้อมให้บริการเพื่อนเที่ยวฟิวแฟนในพิกัดย่าน ${profile.location || profile.provinceNameThai || "ทั่วไทย"}`;
      descContent.innerHTML = (profile.description || defaultDesc).replace(/\n/g, "<br>");
    }
    if (descContainer) descContainer.style.display = "block";

    const detailsContainer = document.querySelector(".lightbox-details");
    if (detailsContainer) {
      detailsContainer.scrollTop = 0;
      
      const oldLineBtn = document.getElementById("line-btn-sticky-wrapper");
      if (oldLineBtn) oldLineBtn.remove();

      const PROVINCE_LINE_FALLBACKS = {
        chiangmai: "https://line.me/ti/p/ksLUWB89Y_",
        bangkok: "https://line.me/ti/p/ksLUWB89Y_",
        chonburi: "https://line.me/ti/p/ksLUWB89Y_",
        khonkaen: "https://line.me/ti/p/ksLUWB89Y_",
        phuket: "https://line.me/ti/p/ksLUWB89Y_",
        udonthani: "https://line.me/ti/p/ksLUWB89Y_",
        lampang: "https://line.me/ti/p/ksLUWB89Y_",
        chiangrai: "https://line.me/ti/p/ksLUWB89Y_",
        phitsanulok: "https://line.me/ti/p/ksLUWB89Y_",
        national: "https://line.me/ti/p/ksLUWB89Y_",
        default: "https://line.me/ti/p/ksLUWB89Y_"
      };

      const provKey = normalizeProvinceKey(profile.provinceKey);
      const defaultLineUrl = PROVINCE_LINE_FALLBACKS[provKey] || PROVINCE_LINE_FALLBACKS.default;

      const lineIdToUse = (profile.lineId || "").replace(/^@/, "").trim();
      let lineUrl = defaultLineUrl;
      
      if (lineIdToUse.startsWith("http")) {
        lineUrl = lineIdToUse;
      } else if (lineIdToUse && lineIdToUse !== "ksLUWB89Y_") {
        lineUrl = `https://line.me/ti/p/~${lineIdToUse}`;
      }

      const stickyBtnWrapper = document.createElement("div");
      stickyBtnWrapper.id = "line-btn-sticky-wrapper";
      stickyBtnWrapper.style.cssText = "margin-top: 14px; margin-bottom: 6px; width: 100%; position: relative;";
      
      stickyBtnWrapper.innerHTML = `
        <a href="${lineUrl}" target="_blank" rel="noopener nofollow" 
           style="display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #11783B 0%, #00E676 100%); color: white; padding: 12px 18px; border-radius: 100px; font-weight: 800; font-size: 13px; text-decoration: none; box-shadow: 0 6px 20px rgba(0, 230, 118, 0.3);">
            <i class="fab fa-line" style="font-size: 18px; color: white;"></i>
            <span>แอดไลน์จองคิว ${nameClean}</span>
        </a>
      `;
      detailsContainer.appendChild(stickyBtnWrapper);
    }

    // ✅ เรียกใช้ปุ่มเลื่อนโปรไฟล์ Lightbox ถัดไป
    const currentIndex = STATE.filteredProfiles.findIndex(p => p.slug === profile.slug || p.id === profile.id);
    setupLightboxNavigation(currentIndex);

    lightbox.classList.remove("hidden");
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";

    if (window.gsap) {
      gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(wrapper, { scale: 0.92, opacity: 0, y: 15 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.2)" });
    }

    updateSEOMetadata(profile, null);
  }
  
  function closeLightboxModal(updateUrl = true) {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      lightbox.style.display = "none";
      lightbox.classList.add("hidden");
      document.body.style.overflow = "";

      STATE.currentProfileSlug = null;
      if (updateUrl && (window.location.pathname.includes("/profile/") || window.location.pathname.includes("/sideline/"))) {
        history.pushState(null, "", "/");
        updateSEOMetadata(null, null);
      }
    }
  }

  function removeJsonLdSchemas() {
    const schemaIds = [
      "dynamic-schema",
      "schema-jsonld-person",
      "schema-jsonld-list",
      "schema-jsonld-faq",
      "schema-jsonld-breadcrumb",
      "schema-jsonld-itemlist"
    ];
    schemaIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  function injectJsonLdSchema(schemaObj, elementId = "schema-jsonld") {
    if (!schemaObj) return;
    const existing = document.getElementById(elementId);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = elementId;
    script.textContent = JSON.stringify(schemaObj);
    document.head.appendChild(script);
  }

  function updateSEOMetadata(profile = null, locationData = null) {
    const currentPath = window.location.pathname.toLowerCase();
    const isHomePage = currentPath === "/" || currentPath === "" || currentPath === "/index.html";

    if (isFirstLoad && isHomePage) {
      isFirstLoad = false;
      return;
    }
    isFirstLoad = false;

    if (isHomePage && !profile) {
      document.title = DEFAULT_SEO.title;
      updateMetaTag("description", DEFAULT_SEO.description);
      updateMetaTag("keywords", DEFAULT_SEO.keywords);
      updateLinkRel("canonical", DEFAULT_SEO.canonical);
      updateOpenGraphAndTwitter(null, DEFAULT_SEO.title, DEFAULT_SEO.description, "website");
      removeJsonLdSchemas();
      return;
    }

    removeJsonLdSchemas();

    if (profile) {
      const nameClean = sanitizeName(profile.name || profile.displayName);
      const provKey = normalizeProvinceKey(profile.provinceKey);
      const provName = profile.provinceNameThai || STATE.provincesMap.get(provKey) || "ทั่วไทย";
      const fullLoc = profile.location ? `${profile.location}, ${provName}` : provName;
      const profileUrl = `${CONFIG.SITE_URL}/sideline/${encodeURIComponent(profile.slug || profile.id)}`;
      const locationUrl = `${CONFIG.SITE_URL}/location/${provKey || "national"}`;

      const title = `${nameClean} รับงาน${provName} สาวรับงาน${provName} ไซด์ไลน์${provName} ฟิวแฟนตรงปก | จ่ายหน้างาน`;
      const description = `รายละเอียดโปรไฟล์ ${nameClean} สาวรับงานไซด์ไลน์พิกัดย่าน ${fullLoc} ตรงปก 100% ค่าขนม ${profile.displayPrice || "1,500.-"} ดูแลสไตล์ฟิวแฟน ไม่มีโอนมัดจำล่วงหน้า (อัปเดต 2026)`;

      document.title = title;
      updateMetaTag("description", description);
      updateMetaTag("keywords", `${nameClean}, รับงาน${provName}, สาวรับงาน${provName}, ไซด์ไลน์${provName}`);
      updateLinkRel("canonical", profileUrl);

      updateOpenGraphAndTwitter(profile, title, description, "profile");

      injectJsonLdSchema({
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${profileUrl}/#service`,
        "name": `บริการเพื่อนเที่ยว ฟิวแฟน - ${nameClean}`,
        "url": profileUrl,
        "image": profile.images && profile.images[0] ? (profile.images[0].fullSrc || profile.images[0].src) : CONFIG.DEFAULT_OG_IMAGE,
        "description": description,
        "provider": {
            "@type": "Person",
            "name": nameClean,
            "gender": "Female",
            "jobTitle": "Freelance Companion & Entertainer",
            "image": profile.images && profile.images[0] ? (profile.images[0].fullSrc || profile.images[0].src) : CONFIG.DEFAULT_OG_IMAGE
        },
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": provName
        },
        "offers": {
          "@type": "Offer",
          "url": profileUrl,
          "price": String(profile.rate || profile._price || "1500").replace(/\D/g, "") || "1500",
          "priceCurrency": "THB",
          "priceValidUntil": "2027-12-31",
          "availability": ["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(e => (profile.availability || "").toLowerCase().includes(e)) ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          "description": "นัดเจอตัวจ่ายค่าบริการโดยตรงหน้างาน ไม่มีโอนเงินมัดจำล่วงหน้าเพื่อความปลอดภัยสูงสุด"
        }
      }, "schema-jsonld-person");

      injectJsonLdSchema({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${profileUrl}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.SITE_URL },
          { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provName}`, "item": locationUrl },
          { "@type": "ListItem", "position": 3, "name": nameClean, "item": profileUrl }
        ]
      }, "schema-jsonld-breadcrumb");

      injectJsonLdSchema({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${profileUrl}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": `${nameClean} ไซด์ไลน์${provName} ย่าน${profile.location || provName} มีมัดจำหรือไม่?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `ไม่มีนโยบายโอนเงินมัดจำล่วงหน้าทุกกรณีครับ ลูกค้าสามารถเดินทางพพบ${nameClean} ยืนยันตัวตนตรงปกหน้างานแล้วค่อยชำระค่าบริการแก่ตัวน้องโดยตรง 100%`
            }
          },
          {
            "@type": "Question",
            "name": `ต้องการตรวจสอบตารางเวลาหรือขอจองคิว ${nameClean} ได้ที่ไหน?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `สามารถกดปุ่มจองคิวบนหน้าโปรไฟล์ เพื่อสอบถามตารางเวลาและจองคิวรับบริการผ่านไลน์แอดมินเจ้าหน้าที่ได้อย่างสะดวกรวดเร็ว`
            }
          }
        ]
      }, "schema-jsonld-faq");

    } else if (locationData) {
      const provKey = normalizeProvinceKey(locationData.provinceKey || locationData.provinceSlug || "national");
      const provName = locationData.provinceName || STATE.provincesMap.get(provKey) || "ทั่วไทย";
      const canonicalUrl = locationData.canonicalUrl || `${CONFIG.SITE_URL}/location/${provKey}`;
      const count = locationData.profiles ? locationData.profiles.length : 50;

      const title = `รับงาน${provName} ไซด์ไลน์${provName} สาวรับงานฟิวแฟนตรงปก (อัปเดต ${count}+ โปรไฟล์ 2026) | First Model Hub`;
      const description = `รวมน้องๆ สาวรับงาน${provName} กว่า ${count}+ โปรไฟล์ คัดคนสวย ตรงปก 100% ปลอดภัย จ่ายเงินหน้างาน ไม่ต้องโอนมัดจำ`;

      document.title = title;
      updateMetaTag("description", description);
      updateMetaTag("keywords", `รับงาน${provName}, สาวรับงาน${provName}, ไซด์ไลน์${provName}`);
      updateLinkRel("canonical", canonicalUrl);

      updateOpenGraphAndTwitter(null, title, description, "website");

      injectJsonLdSchema({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.SITE_URL },
          { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provName}`, "item": canonicalUrl }
        ]
      }, "schema-jsonld-breadcrumb");

      const seoData = LOCALIZED_SEO_MAP[provKey] || LOCALIZED_SEO_MAP["national"];
      const faqs = (seoData && seoData.faqs) ? seoData.faqs : LOCALIZED_SEO_MAP["national"].faqs;

      if (faqs && faqs.length > 0) {
        injectJsonLdSchema({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${canonicalUrl}/#faq`,
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a }
          }))
        }, "schema-jsonld-faq");
      }

      if (locationData.profiles && locationData.profiles.length > 0) {
        injectJsonLdSchema({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${canonicalUrl}/#itemlist`,
          "name": `รายชื่อสาวรับงานและเพื่อนเที่ยว ${provName}`,
          "numberOfItems": locationData.profiles.length,
          "itemListElement": locationData.profiles.slice(0, 30).map((p, index) => {
            const pCleanName = sanitizeName(p.name || p.displayName);
            const itemUrl = `${CONFIG.SITE_URL}/sideline/${encodeURIComponent(p.slug || p.id)}`;
            return {
              "@type": "ListItem",
              "position": index + 1,
              "name": pCleanName,
              "url": itemUrl
            };
          })
        }, "schema-jsonld-itemlist");
      }
    }
  }

  function updateOpenGraphAndTwitter(profile, title, description, type = "website") {
    const imageUrl = profile && profile.images && profile.images[0] ? profile.images[0].fullSrc || profile.images[0].src : CONFIG.DEFAULT_OG_IMAGE;
    
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:type", type);
    updateMetaTag("og:image", imageUrl);
    updateMetaTag("og:image:secure_url", imageUrl);
    
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", imageUrl);
  }

  function updateMetaTag(nameOrProperty, content) {
    let tag = document.querySelector(`meta[name="${nameOrProperty}"], meta[property="${nameOrProperty}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      if (nameOrProperty.startsWith("og:") || nameOrProperty.startsWith("twitter:")) {
        tag.setAttribute("property", nameOrProperty);
      } else {
        tag.setAttribute("name", nameOrProperty);
      }
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  }

  function updateLinkRel(rel, href) {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", rel);
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }
  
  function updateGoogleMap(provKey = "national", provName = "ทั่วไทย") {
    const mapIframe = document.getElementById("google-map");
    const mapSection = document.getElementById("map-section");
    if (!mapIframe || !mapSection) return;

    let mapUrl = mapIframe.getAttribute("data-src") || "";
    if (!mapUrl || mapUrl.includes("{{") || mapUrl.includes("%7B")) {
      mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent("สาวรับงาน " + (provKey === "national" ? "กรุงเทพ" : provName))}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    }

    const observer = new IntersectionObserver((entriesList) => {
      entriesList.forEach(entry => {
        if (entry.isIntersecting) {
          mapIframe.src = mapUrl;
          observer.unobserve(mapSection);
        }
      });
    }, { rootMargin: "200px 0px" });

    observer.observe(mapSection);
  }

  function renderZoneChips(provKey = "national") {
    let chipsContainer = document.getElementById("zone-chips-container");
    
    if (!chipsContainer) {
      chipsContainer = document.createElement("div");
      chipsContainer.id = "zone-chips-container";
      chipsContainer.className = "horizontal-scroll-chips";
      chipsContainer.style.cssText = "padding: 10px 4px; margin-bottom: 12px;";
      
      const targetSection = document.getElementById("profiles-display-area");
      if (targetSection && targetSection.parentNode) {
        targetSection.parentNode.insertBefore(chipsContainer, targetSection);
      }
    }

    const normKey = normalizeProvinceKey(provKey);
    const data = LOCALIZED_SEO_MAP[normKey] || LOCALIZED_SEO_MAP["national"];
    const zones = data.zones || ["ทั้งหมด"];

    chipsContainer.innerHTML = zones.map(zone => {
      const isAll = zone === "ทั้งหมด";
      return `
        <button type="button" data-zone-keyword="${isAll ? '' : zone}" 
                class="luxury-chip zone-chip-btn ${isAll ? 'active' : ''}">
          📍 ${zone}
        </button>
      `;
    }).join("");

    chipsContainer.querySelectorAll(".zone-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const keyword = btn.getAttribute("data-zone-keyword");
        
        chipsContainer.querySelectorAll(".zone-chip-btn").forEach(b => {
          b.classList.remove("active");
        });
        btn.classList.add("active");

        if (DOM.searchInput) DOM.searchInput.value = keyword;
        const modalInput = document.getElementById("modal-search-keyword");
        if (modalInput) modalInput.value = keyword;
        applyUltimateFilters(true, true);
      });
    });
  }

  function updateDynamicProvinceContent(provKey = "national", provName = "ทั่วไทย", count = 50) {
    const normKey = normalizeProvinceKey(provKey);
    const data = LOCALIZED_SEO_MAP[normKey] || LOCALIZED_SEO_MAP["national"];

    const reviewsGrid = document.getElementById("reviews-container-grid");
    if (reviewsGrid) {
      const reviewsList = (data && data.reviews && data.reviews.length > 0) 
        ? data.reviews 
        : LOCALIZED_SEO_MAP["national"].reviews;
        
      reviewsGrid.innerHTML = reviewsList.map(r => `
        <div class="interactive-card p-4 flex flex-col gap-2 text-left" style="padding: 16px; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; background: rgba(13,8,30,0.4);">
          <div class="flex justify-between items-center" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="flex items-center gap-2" style="display: flex; align-items: center; gap: 8px;">
<div style="height: 36px; width: 36px; border-radius: 50%; background-color: #27272A; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-weight: 700; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);">${(r.author || "K").charAt(0)}</div>
                <div>
                  <span style="display: block; font-size: 12px; font-weight: 800; color: white;">${r.author}</span>
                  <span style="display: block; font-size: 10px; color: var(--text-muted); font-weight: 700;">นัดเจอใน${r.location}</span>
                </div>
              </div>
              <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 10px;">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
              </div>
            </div>
            <p style="font-size: 12px; color: var(--text-gray); line-height: 1.5; margin: 8px 0 0 0;">${r.text}</p>
            <span style="display: block; font-size: 10px; color: var(--text-muted); font-weight: 800; text-transform: uppercase; margin-top: 8px;">ยืนยันการใช้บริการจริง • ${r.date}</span>
          </div>
        `).join("");
      }

      const faqContainer = document.getElementById("faq-container-list");
      if (faqContainer) {
        const faqsList = (data && data.faqs && data.faqs.length > 0) 
          ? data.faqs 
          : LOCALIZED_SEO_MAP["national"].faqs;

        faqContainer.innerHTML = faqsList.map(item => `
          <div class="interactive-card p-4" style="padding: 16px; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; background: rgba(13,8,30,0.4);">
              <div class="flex flex-col gap-2" style="display: flex; flex-direction: column; gap: 8px;">
                  <h3 class="font-extrabold text-sm flex items-start gap-2 m-0" style="font-size: 14px; font-weight: 800; margin: 0; display: flex; align-items: flex-start; gap: 8px;">
                    <span style="display: flex; height: 22px; width: 22px; align-items: center; justify-content: center; border-radius: 6px; background-color: rgba(90, 44, 190, 0.2); color: #C084FC; font-size: 12px; font-weight: 900; border: 1px solid rgba(147, 51, 234, 0.3); flex-shrink: 0;">Q</span>
                    <span class="text-gradient-sub" style="line-height: 1.5; color: white;">${item.q}</span>
                  </h3>
                  <div style="padding-left: 30px; color: var(--text-gray); font-size: 12px; line-height: 1.6; border-left: 2px solid rgba(147, 51, 234, 0.2); padding-top: 4px;">
                    ${item.a}
                  </div>
              </div>
          </div>
        `).join("");
      }

      renderZoneChips(normKey);
      updateGoogleMap(normKey, provName);
    }

    function initSeoDrawer() {
      const btn = document.getElementById("toggle-seo-drawer-btn");
      const wrapper = document.getElementById("seo-drawer-wrapper");
      if (!btn || !wrapper) return;

      btn.addEventListener("click", () => {
        const isCollapsed = wrapper.classList.contains("collapsed");
        const overlay = wrapper.querySelector(".seo-fade-overlay");

        if (isCollapsed) {
          wrapper.classList.remove("collapsed");
          if (overlay) overlay.style.display = "none";
          btn.querySelector("span").textContent = "ย่อข้อความกลับ";
        } else {
          wrapper.classList.add("collapsed");
          if (overlay) overlay.style.display = "block";
          btn.querySelector("span").textContent = "ดูข้อมูลพื้นที่บริการทั้งหมด";
        }
      });
    }

    function initRegionTabs() {
      const tabs = document.querySelectorAll(".region-tab");
      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          tabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");

          const region = tab.getAttribute("data-region");
          const currentPath = window.location.pathname.toLowerCase();
          const isLocationPage = currentPath.includes("/location/") || currentPath.includes("/province/");

          // ถ้าอยู่ในหน้าเฉพาะจังหวัด ห้ามให้ปุ่มแท็บมาล้างค่าจังหวัดเด็ดขาด
          if (!isLocationPage) {
             if (DOM.provinceSelect) DOM.provinceSelect.value = "";
          }

          if (region === "ทั้งหมด") {
            if (DOM.searchInput) DOM.searchInput.value = "";
          } else if (region === "ภาคเหนือ") {
            if (DOM.searchInput) DOM.searchInput.value = "เชียงใหม่";
          } else if (region === "กรุงเทพฯ") {
            // ไปหน้ากรุงเทพ
            window.location.href = "/location/bangkok";
            return;
          }
          applyUltimateFilters(true, true);
        });
      });
    }

    function replaceDomPlaceholders(provinceName = "ทั่วไทย", profileCount = 50, provinceSlug = "national") {
      try {
        const liveCountEl = document.getElementById("live-profile-count");
        if (liveCountEl) liveCountEl.textContent = profileCount;

        const normKey = normalizeProvinceKey(provinceSlug);
        const currentProvData = LOCALIZED_SEO_MAP[normKey] || LOCALIZED_SEO_MAP["national"];
        const currentZones = (currentProvData && currentProvData.zones) ? currentProvData.zones.slice(1, 5) : ["ตัวเมือง", "บริเวณใกล้เคียง"];
        const zoneText = currentZones.join(", ");

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
          if (node.nodeValue && (node.nodeValue.includes("{{") || node.nodeValue.includes("%7B%7B"))) {
            node.nodeValue = node.nodeValue
              .replace(/\{\{PROVINCE_NAME\}\}/g, provinceName)
              .replace(/\{\{PROFILE_COUNT\}\}/g, profileCount)
              .replace(/\{\{PROVINCE_ZONES\}\}/g, zoneText)
              .replace(/\{\{PROVINCE_KEY\}\}/g, normKey)
              .replace(/(%7B%7B|\{\{)[a-zA-Z0-9_-]+(%7D%7D|\}\})/gi, "");
          }
        }

        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          ['title', 'alt', 'content', 'placeholder', 'value', 'data-src', 'href'].forEach(attr => {
            if (el.hasAttribute(attr)) {
              let val = el.getAttribute(attr);
              if (val && (val.includes('{{') || val.includes('%7B%7B'))) {
                val = val
                  .replace(/\{\{PROVINCE_NAME\}\}/g, provinceName)
                  .replace(/\{\{PROFILE_COUNT\}\}/g, profileCount)
                  .replace(/\{\{PROVINCE_ZONES\}\}/g, zoneText)
                  .replace(/\{\{PROVINCE_KEY\}\}/g, normKey)
                  .replace(/(%7B%7B|\{\{)[a-zA-Z0-9_-]+(%7D%7D|\}\})/gi, '');
                el.setAttribute(attr, val);
              }
            }
          });
        });

        updateDynamicProvinceContent(normKey, provinceName, profileCount);
      } catch (e) {
        console.warn("⚠️ Replace placeholders error:", e);
      }
    }

    function updateActiveNavLinks() {
      const path = window.location.pathname;
      document.querySelectorAll("nav a").forEach(a => {
        const isActive = a.getAttribute("href") === path;
        a.classList.toggle("active", isActive);
      });
    }

    async function handleRouteNavigation(isInitial = false) {
      let path = window.location.pathname.toLowerCase();
      if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

      const isSsrSingleProfile = Boolean(document.querySelector(".single-profile-wrapper"));

      const profileMatch = path.match(/^\/(?:sideline|profile|app)\/([^/]+)/);
      if (profileMatch) {
        let slug = profileMatch[1];
        try { slug = decodeURIComponent(slug); } catch (e) {}
        
        STATE.currentProfileSlug = slug;

        let foundProfile = STATE.allProfiles.find(p => {
          const pSlug = String(p.slug || "").toLowerCase();
          const pId = String(p.id);
          const searchSlug = slug.toLowerCase();
          return pSlug === searchSlug || pId === searchSlug;
        });

        if (!foundProfile && !isInitial) {
          foundProfile = await fetchSingleProfileBySlug(slug);
        }

        if (isSsrSingleProfile && isInitial) {
          closeLightboxModal(false);
          return;
        }

        if (foundProfile) {
          openLightboxForProfile(foundProfile);
        } else if (isInitial) {
          history.replaceState(null, "", "/");
          closeLightboxModal(false);
          STATE.currentProfileSlug = null;
        }
        return;
      }

      const locationMatch = path.match(/^\/(?:location|province)\/([^/]+)/);
      if (locationMatch) {
        let provinceSlug = locationMatch[1];
        try { provinceSlug = normalizeProvinceKey(decodeURIComponent(locationMatch[1])); } catch (e) { provinceSlug = normalizeProvinceKey(locationMatch[1]); }
        STATE.currentProfileSlug = null;
        closeLightboxModal(false);

        if (DOM.provinceSelect) DOM.provinceSelect.value = provinceSlug;
        
        const provName = STATE.provincesMap.get(provinceSlug) || "ทั่วไทย";
        updateSEOMetadata(null, {
          provinceName: provName,
          profiles: STATE.allProfiles.filter(p => normalizeProvinceKey(p.provinceKey) === provinceSlug),
          canonicalUrl: window.location.href
        });

        applyUltimateFilters(false, false);
        return;
      }

      STATE.currentProfileSlug = null;
      closeLightboxModal(false);
      updateSEOMetadata(null, null);
      applyUltimateFilters(false, false);
    }

    async function fetchSingleProfileBySlug(slug) {
      if (!supabaseClient) return null;
      try {
        let query = supabaseClient.from("profiles").select("*");
        if (/^\d+$/.test(slug)) query = query.eq("id", slug);
        else query = query.eq("slug", slug);
        
        const { data, error } = await query.maybeSingle();
        if (error) throw error;
        return data ? processProfileObject(data) : null;
      } catch (e) {
        console.error("❌ ดึงข้อมูลโปรไฟล์ล้มเหลว:", e);
        return null;
      }
    }

    function initStarRating() {
      const stars = document.querySelectorAll(".star-rating-input-item");
      const ratingInput = document.getElementById("review-rating-value");
      if (!stars.length || !ratingInput) return;

      stars.forEach(star => {
        star.addEventListener("click", () => {
          const val = parseInt(star.getAttribute("data-value") || "5", 10);
          ratingInput.value = val;
          stars.forEach(s => {
            const sVal = parseInt(s.getAttribute("data-value") || "5", 10);
            if (sVal <= val) {
              s.classList.add("active");
              s.style.color = "#FBBF24";
            } else {
              s.classList.remove("active");
              s.style.color = "#71717A";
            }
          });
        });
      });
    }

    // ✅ FIX: ป้องกันระบบถูก Spam ยิง Review พร้อม Rate Limit 5 นาที
    function initReviewForm() {
      const form = document.getElementById("review-form");
      if (!form) return;

      form.addEventListener("submit", async e => {
        e.preventDefault();
        
        // เช็คการส่งล่าสุดจาก localStorage 
        const lastSubmit = localStorage.getItem(CONFIG.KEYS.LAST_REVIEW_TIME);
        if (lastSubmit && (Date.now() - parseInt(lastSubmit, 10) < 5 * 60 * 1000)) {
          showToast("⏳ กรุณารออย่างน้อย 5 นาทีก่อนส่งรีวิวครั้งถัดไปครับ", "error");
          return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "กำลังส่งข้อมูล...";
        }

        const author = document.getElementById("review-author")?.value.trim();
        const location = document.getElementById("review-location")?.value.trim();
        const rating = parseInt(document.getElementById("review-rating-value")?.value || "5", 10);
        const reviewText = document.getElementById("review-text")?.value.trim();
        const rawProvKey = DOM.provinceSelect?.value || "national";

        if (!author || !reviewText) {
          showToast("❌ กรุณากรอกชื่อและรายละเอียดให้ครบถ้วน", "error");
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "ส่งคำติชมเพื่อยืนยันประวัติเข้าระบบ"; }
          return;
        }

        try {
          if (!supabaseClient) throw new Error("Database offline");
          const { error } = await supabaseClient.from("reviews").insert([{
            author_name: author,
            location_detail: location || "ไม่ระบุโซน",
            rating_score: rating,
            review_body: reviewText,
            province_key: rawProvKey,
            active_status: false
          }]);

          if (error) throw error;

          showToast("✅ ส่งรีวิวสำเร็จ! ข้อมูลของคุณกำลังรอตรวจสอบ", "success");
          localStorage.setItem(CONFIG.KEYS.LAST_REVIEW_TIME, Date.now().toString());
          form.reset();
          
        } catch (err) {
          console.error("Submission failed:", err);
          showToast("❌ เกิดข้อผิดพลาดในการส่งรีวิว กรุณาลองใหม่", "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "ส่งคำติชมเพื่อยืนยันประวัติเข้าระบบ";
          }
        }
      });
    }

    function initReviewToggle() {
      const btn = document.getElementById("toggle-review-form-btn");
      const form = document.getElementById("review-form");
      if (!btn || !form) return;

      btn.addEventListener("click", () => {
        const isHidden = form.style.display === "none" || form.style.display === "";
        if (isHidden) {
          form.style.display = "flex";
          btn.textContent = "❌ ปิดหน้าต่างเขียนรีวิว";
        } else {
          form.style.display = "none";
          btn.textContent = "✍️ ร่วมเขียนรีวิวแบ่งปันประสบการณ์";
        }
      });
    }

    function initAccordions() {
      const items = document.querySelectorAll(".rule-item");
      items.forEach(item => {
        const trigger = item.querySelector(".rule-trigger");
        if (trigger) {
          trigger.addEventListener("click", () => {
            const isCollapsed = item.classList.contains("collapsed");
            items.forEach(i => i.classList.add("collapsed"));
            if (isCollapsed) item.classList.remove("collapsed");
          });
        }
      });
    }

    function initPwaInstaller() {
      if (window.matchMedia('(display-mode: standalone)').matches) return;
      
      let deferredPrompt = null;
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showPwaInstallBanner();
      });

      function showPwaInstallBanner() {
        if (document.getElementById('pwa-install-banner') || localStorage.getItem('pwa_banner_dismissed')) return;

        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.style.cssText = `
          position: fixed; bottom: 95px; left: 50%; transform: translateX(-50%);
          width: calc(100% - 24px); max-width: 420px; background: rgba(18, 12, 38, 0.95);
          border: 1px solid rgba(192, 132, 252, 0.4); border-radius: 16px; padding: 12px 16px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8); backdrop-filter: blur(15px); z-index: var(--z-toast, 9000);
        `;

        banner.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="/images/apple-touch-icon.png" style="width: 38px; height: 38px; border-radius: 10px;" alt="App">
            <div>
              <div style="font-size: 12px; font-weight: 800; color: #FFF;">ติดตั้งแอป First Model Hub</div>
              <div style="font-size: 11px; color: #A1A1AA;">เข้าใช้งานรวดเร็ว ไม่ต้องค้นหาบน Google</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button id="pwa-install-btn" style="background: linear-gradient(135deg, #7C3AED, #5A2CBE); color: white; border: none; padding: 7px 14px; border-radius: 100px; font-size: 12px; font-weight: 800; cursor: pointer;">ติดตั้ง</button>
            <button id="pwa-dismiss-btn" style="background: none; border: none; color: #A1A1AA; font-size: 14px; cursor: pointer;"><i class="fas fa-times"></i></button>
          </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('pwa-install-btn').onclick = async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
          }
          banner.remove();
        };

        document.getElementById('pwa-dismiss-btn').onclick = () => {
          banner.remove();
          localStorage.setItem('pwa_banner_dismissed', Date.now());
        };
      }
    }

    function initDynamicSearchPlaceholder() {
      const placeholders = [
        "🔍 ค้นชื่อน้อง เช่น น้องชะเอม, น้องโมจิ...",
        "📍 ค้นย่านรับงาน เช่น นิมมาน, เจ็ดยอด, รัชดา...",
        "❤️ ค้นสไตล์ เช่น ฟิวแฟน, เอาใจเก่ง, ผิวขาว...",
        "💰 ค้นเรตราคา เช่น 1500, 2000..."
      ];

      let idx = 0;

      setInterval(() => {
        const searchInput = document.getElementById("modal-search-keyword") || document.getElementById("search-keyword");
        if (!searchInput) return;

        if (document.activeElement !== searchInput && (!searchInput.value || searchInput.value.trim() === "")) {
          idx = (idx + 1) % placeholders.length;
          searchInput.setAttribute("placeholder", placeholders[idx]);
        }
      }, 2500);
    }

    window.handleLikeClick = async function (btnElement, profileId) {
      if (isLikeProcessing) return;
      isLikeProcessing = true;

      const isLiked = btnElement.classList.toggle("liked");
      const icon = btnElement.querySelector("i");

      if (icon) {
        icon.style.transform = isLiked ? "scale(1.4)" : "scale(0.9)";
        icon.style.color = isLiked ? "#FF2E63" : "#FFFFFF";
        setTimeout(() => { icon.style.transform = "scale(1)"; }, 200);
      }

      try {
        const likedMap = JSON.parse(localStorage.getItem(CONFIG.KEYS.LIKED_PROFILES) || "{}");
        if (isLiked) {
          likedMap[profileId] = true;
          showToast("❤️ เพิ่มลงในรายการโปรดแล้ว", "success");
        } else {
          delete likedMap[profileId];
        }
        localStorage.setItem(CONFIG.KEYS.LIKED_PROFILES, JSON.stringify(likedMap));
      } catch (e) {}

      if (supabaseClient) {
        try {
          const rpcName = isLiked ? "increment_likes" : "decrement_likes";
          await supabaseClient.rpc(rpcName, { profile_id_to_update: profileId });
        } catch (e) {}
      }

      setTimeout(() => { isLikeProcessing = false; }, 300);
    };

    window.openFilterModal = function() {
      const modal = document.getElementById('filter-modal-overlay');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    };

    window.closeFilterModal = function() {
      const modal = document.getElementById('filter-modal-overlay');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    };

    function hideGlobalLoader() {
      const loader = document.getElementById("global-loader-overlay");
      if (loader) loader.style.opacity = "0";
      setTimeout(() => {
        if (loader) loader.style.display = "none";
      }, 500);
    }

    document.addEventListener("DOMContentLoaded", async function () {
      try {
        supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        window.supabase = supabaseClient;
      } catch (e) {
        console.error("❌ เชื่อมต่อ Supabase ล้มเหลว:", e);
      }

      DOM.searchForm = document.getElementById("search-form");
      DOM.searchInput = document.getElementById("search-keyword");
      DOM.provinceSelect = document.getElementById("search-province");
      DOM.availabilitySelect = document.getElementById("search-availability");
      DOM.featuredSelect = document.getElementById("search-featured");
      DOM.sortSelect = document.getElementById("sort-select");
      DOM.resetSearchBtn = document.getElementById("reset-search-btn");
      DOM.profilesDisplayArea = document.getElementById("profiles-display-area");
      DOM.featuredSection = document.getElementById("featured-profiles");
      DOM.featuredContainer = document.getElementById("featured-profiles-container");
      DOM.noResultsMessage = document.getElementById("no-results-message");
      
      // ✅ FIX: ประกาศตัวแปรเพื่อป้องกันข้อผิดพลาด Undefined ใน renderProfilesGrid
      DOM.fetchErrorMessage = document.getElementById("fetch-error-message");

      const toggleBtn = document.getElementById("menu-toggle");
      const sidebar = document.getElementById("sidebar-menu");
      const overlay = document.getElementById("sidebar-overlay");
      const closeBtn = document.getElementById("close-menu-btn");
      if (toggleBtn && sidebar) {
        const toggleMenu = (open) => {
          sidebar.classList.toggle("active", open);
          if (overlay) {
            overlay.style.display = open ? "block" : "none";
            setTimeout(() => { overlay.style.opacity = open ? "1" : "0"; }, 10);
          }
          document.body.style.overflow = open ? "hidden" : "";
        };
        toggleBtn.onclick = () => toggleMenu(true);
        if (closeBtn) closeBtn.onclick = () => toggleMenu(false);
        if (overlay) overlay.onclick = () => toggleMenu(false);
        sidebar.querySelectorAll("a").forEach(a => a.onclick = () => toggleMenu(false));
      }

      // ✅ FIX: ผูก Event ให้กับช่องค้นหาหลักเพื่อรองรับการใช้งานบน Desktop ที่ไม่ได้เปิด Modal 
      if (DOM.searchInput) {
        DOM.searchInput.addEventListener("input", (e) => {
          const modalInput = document.getElementById("modal-search-keyword");
          if (modalInput) modalInput.value = e.target.value;
          
          clearTimeout(searchDebounceTimer);
          searchDebounceTimer = setTimeout(() => {
            applyUltimateFilters(true, false);
          }, 300);
        });
      }
      
      // ✅ FIX: ผูก Event กดปุ่ม Enter บน Desktop Search Form ป้องกันหน้าเว็บ Refresh
      if (DOM.searchForm) {
        DOM.searchForm.addEventListener("submit", (e) => {
          e.preventDefault();
          applyUltimateFilters(true, true);
        });
      }

      document.body.addEventListener("click", e => {
        const target = e.target;

        const likeBtn = target.closest('[data-action="like"]');
        if (likeBtn) {
          e.preventDefault(); e.stopPropagation();
          const id = likeBtn.dataset.id;
          if (id) window.handleLikeClick(likeBtn, id);
          return;
        }

        const cardLink = target.closest("a.card-link");
        if (cardLink) {
          e.preventDefault();
          const card = cardLink.closest(".profile-card-new, .vip-card-item");
          let rawSlug = card ? card.getAttribute("data-profile-slug") : null;
          if (rawSlug) {
            try { rawSlug = decodeURIComponent(rawSlug); } catch (err) {}
            history.pushState(null, "", `/sideline/${encodeURIComponent(rawSlug)}`);
            handleRouteNavigation();
          }
          return;
        }

        const closeLightbox = target.closest("#closeLightboxBtn");
        const lightboxModal = target.closest("#lightbox");
        if (closeLightbox || (lightboxModal && e.target === lightboxModal)) {
          closeLightboxModal(true);
          return;
        }

        if (target.closest('.province-chip')) {
          document.querySelectorAll('.province-chip').forEach(b => b.classList.remove('active'));
          target.closest('.province-chip').classList.add('active');
          if (DOM.provinceSelect) {
            DOM.provinceSelect.value = normalizeProvinceKey(target.closest('.province-chip').getAttribute('data-value') || '');
          }
        }

        if (target.closest('.avail-chip')) {
          document.querySelectorAll('.avail-chip').forEach(b => b.classList.remove('active'));
          target.closest('.avail-chip').classList.add('active');
          if (DOM.availabilitySelect) DOM.availabilitySelect.value = target.closest('.avail-chip').getAttribute('data-value') || '';
        }

        if (target.closest('.price-chip')) {
          document.querySelectorAll('.price-chip').forEach(b => b.classList.remove('active'));
          target.closest('.price-chip').classList.add('active');
          const hiddenPrice = document.getElementById("search-price");
          if (hiddenPrice) hiddenPrice.value = target.closest('.price-chip').getAttribute('data-price') || '';
        }

        if (target.closest('.tag-chip')) {
          document.querySelectorAll('.tag-chip').forEach(b => b.classList.remove('active'));
          target.closest('.tag-chip').classList.add('active');
          const modalInput = document.getElementById('modal-search-keyword');
          if (modalInput) modalInput.value = target.closest('.tag-chip').getAttribute('data-tag') || '';
        }

        if (target.closest('.sort-chip')) {
          document.querySelectorAll('.sort-chip').forEach(b => b.classList.remove('active'));
          target.closest('.sort-chip').classList.add('active');
          if (DOM.sortSelect) DOM.sortSelect.value = target.closest('.sort-chip').getAttribute('data-sort') || 'featured';
        }
      });

      const modalApplyBtn = document.getElementById('modal-apply-btn');
      if (modalApplyBtn) {
        modalApplyBtn.onclick = () => {
          applyUltimateFilters(true, true);
          closeFilterModal();
        };
      }

      const modalResetBtn = document.getElementById('modal-reset-btn');
      if (modalResetBtn) {
        modalResetBtn.onclick = () => {
          document.querySelector('#modal-province-chips .province-chip[data-value=""]')?.click();
          document.querySelector('#modal-availability-chips .avail-chip[data-value=""]')?.click();
          document.querySelector('#modal-sort-chips .sort-chip[data-sort="featured"]')?.click();
          document.querySelector('#modal-price-chips .price-chip[data-price=""]')?.click();
          document.querySelectorAll('#modal-tag-chips .tag-chip').forEach(b => b.classList.remove('active'));
          if (document.getElementById('modal-search-keyword')) document.getElementById('modal-search-keyword').value = '';
          if (DOM.searchInput) DOM.searchInput.value = '';
          
          applyUltimateFilters(true, true);
        };
      }

      const modalSearchInput = document.getElementById("modal-search-keyword");
      if (modalSearchInput) {
        modalSearchInput.addEventListener("input", (e) => {
          if (DOM.searchInput) DOM.searchInput.value = e.target.value;
          clearTimeout(searchDebounceTimer);
          searchDebounceTimer = setTimeout(() => {
            applyUltimateFilters(true, false);
          }, 300);
        });
      }

      initStarRating();
      initReviewForm();
      initReviewToggle();
      initAccordions();
      initPwaInstaller();
      initDynamicSearchPlaceholder();
      initSeoDrawer();
      initRegionTabs();

      let lastScrollY = window.scrollY;
      let scrollTimeout = null;
      const dockMenu = document.querySelector('.floating-app-dock');
      
      window.addEventListener('scroll', () => {
        if (!dockMenu) return;
        const currentScrollY = window.scrollY;
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          dockMenu.classList.add('dock-hidden');
        } else {
          dockMenu.classList.remove('dock-hidden');
        }
        lastScrollY = currentScrollY;
        scrollTimeout = setTimeout(() => { dockMenu.classList.remove('dock-hidden'); }, 400);
      }, { passive: true });

      await fetchProfilesData();
      await handleRouteNavigation(true);
      updateActiveNavLinks();
      hideGlobalLoader();

      window.addEventListener("popstate", async () => {
        await handleRouteNavigation(false);
        updateActiveNavLinks();
      });

      window.openFilterModal = openFilterModal;
      window.closeFilterModal = closeFilterModal;
      window.renderProfilesGrid = renderProfilesGrid;
      window.bindMediaProtection = bindMediaProtection;
    });

})();