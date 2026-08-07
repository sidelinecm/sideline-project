
/* ==============================================================================
   💎 FIRST MODEL HUB - MAIN CLIENT-SIDE ENGINE (PROD-READY ULTRA-OPTIMIZED 2026)
   Project: First Model Hub
   All 10 Client-Side Critical Fixes Included:
     1. Client-Side Thai Typo Sanitizer & Unicode Emoji / Alert Icon Stripper.
     2. Dynamic Fallback Slogan Generator (Eliminates Duplicate Tagline Penalties).
     3. Global Profile Deduplication Engine (Prevents Duplicate Cards Across Views).
     4. Clean Age Display (Shows age in parentheses only when valid).
     5. Debounced Search Input (200ms) for Smooth Mobile Typing.
     6. Synchronized Luxury-Chip Filters with Hidden Form Inputs.
     7. Smooth Auto-Scroll to Results on Filter Selection.
     8. DOM TreeWalker Placeholder Cleansing (Strips any leftover {{...}} tags).
     9. Lightbox Modal Line ID Sanitizer & Clean Link Builder.
    10. Smooth Floating Dock Scroll Handler with 400ms Stationary Detection.
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
      CACHE_PROFILES: "cachedProfiles_v4_2026",
      CACHE_PROVINCES: "cachedProvinces_v4_2026",
      THEME: "theme",
      LIKED_PROFILES: "liked_profiles"
    },
    SITE_URL: "https://firstmodelhub.com",
    DEFAULT_OG_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp"
  };

  // 🟢 คลังสโลแกนสำรองหลากหลายแบบ เพื่อขจัดปัญหาข้อความซ้ำกันทั้งเว็บ
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
    const sum = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = sum % FALLBACK_SLOGANS.length;
    return FALLBACK_SLOGANS[index];
  }

  // 🟢 พจนานุกรมล้างคำผิดภาษาไทย + ลบ Emoji และสัญลักษณ์เตือนภัย 🚨
  function sanitizeThaiText(str) {
    if (str === null || str === undefined) return "";
    return String(str)
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
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}🚨]/gu, "") // ลบ Emoji และ 🚨
      .replace(/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬„•ㅅ•„]+/g, "") // ลบเส้นกรอบ ASCII
      .trim();
  }

  function sanitizeName(rawName) {
    if (!rawName || typeof rawName !== "string") return "สาวสวย";
    let cleaned = sanitizeThaiText(rawName).replace(/^(น้อง\s?)+/gi, "").trim();
    if (!cleaned) return "สาวสวย";
    return `น้อง${cleaned}`;
  }

  // 🟢 ระบบขจัดโปรไฟล์ซ้ำ (Profile Deduplication Engine)
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
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานเชียงใหม่</strong> และ <strong>ไซด์ไลน์เชียงใหม่</strong> พรีเมียม คัดสรรตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมย่านนิมมาน สันติธรรม เจ็ดยอด</p>`,
      reviews: [
        { author: "คุณเกริกพล", location: "นิมมาน เชียงใหม่", text: "นัดเจอน้องตรงปก 100% บริการน่ารักมาก มารยาทดี ไม่มีโอนมัดจำล่วงหน้าสบายใจสุดๆ ครับ", date: "เมื่อวานนี้" },
        { author: "คุณอนุรักษ์", location: "สันติธรรม เชียงใหม่", text: "ดูแลเอนเตอร์เทนประทับใจ สไตล์ฟิวแฟน คุยสนุกเป็นกันเอง ให้ 5 ดาวครับ", date: "3 วันที่แล้ว" }
      ],
      faqs: [
        { q: "สาวรับงานเชียงใหม่ ต้องโอนมัดจำก่อนไหม?", a: "ไม่ต้องโอนมัดจำใดๆ ทั้งสิ้น นัดเจอชำระค่าบริการหน้างานกับน้องโดยตรง" },
        { q: "มีน้องรับงานในโซนไหนบ้าง?", a: "ครอบคลุมโซน นิมมาน สันติธรรม เจ็ดยอด หลัง มช. ช้างเผือก และสันทราย" }
      ]
    },
    chiangrai: {
      zones: ["ทั้งหมด", "ตัวเมืองเชียงราย", "บ้านดู่", "มฟล.", "หอนาฬิกา", "แม่สาย"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานเชียงราย</strong> และ <strong>ไซด์ไลน์เชียงราย</strong> พรีเมียม คัดสรรโปรไฟล์ตรงปก 100% ปลอดภัย นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมโซนตัวเมือง บ้านดู่ มฟล.</p>`,
      reviews: [
        { author: "คุณพงษ์ศักดิ์", location: "บ้านดู่ เชียงราย", text: "น้องตรงปก พูดจาเพราะ น่ารักมาก จ่ายหน้างานตามกฎเว็บ ปลอดภัยดีมากครับ", date: "2 วันที่แล้ว" }
      ],
      faqs: [
        { q: "สาวรับงานเชียงราย รับโซนไหนบ้าง?", a: "รับในเขตตัวเมืองเชียงราย โซนบ้านดู่ มฟล. และบริเวณใกล้เคียง" }
      ]
    },
    lampang: {
      zones: ["ทั้งหมด", "ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏ"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานลำปาง</strong> และ <strong>ไซด์ไลน์ลำปาง</strong> พรีเมียม ตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ</p>`,
      reviews: [
        { author: "คุณเมธี", location: "ตัวเมืองลำปาง", text: "น้องตรงปก สุภาพ อัธยาศัยดี นัดเจอจ่ายเงินหน้างานประทับใจครับ", date: "4 วันที่แล้ว" }
      ],
      faqs: [
        { q: "สาวรับงานลำปาง นัดเจออย่างไร?", a: "ติดต่อผ่าน Line Official เพื่อนัดหมายสถานที่ ชำระค่าขนมหน้างานเมื่อพบตัวน้อง" }
      ]
    },
    phitsanulok: {
      zones: ["ทั้งหมด", "ตัวเมืองพิษณุโลก", "รอบ มน.", "สมอแข"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานพิษณุโลก</strong> และ <strong>ไซด์ไลน์พิษณุโลก</strong> พรีเมียม ตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ</p>`,
      reviews: [
        { author: "คุณชนะชล", location: "รอบ มน. พิษณุโลก", text: "น้องน่ารัก ฟิวแฟน ตรงปก นัดเจอง่ายจ่ายหน้างานสบายใจครับ", date: "5 วันที่แล้ว" }
      ],
      faqs: [
        { q: "สาวรับงานพิษณุโลก ปลอดภัยไหม?", a: "ปลอดภัย 100% จ่ายเงินหน้างาน ไม่โอนเงินล่วงหน้าทุกกรณี" }
      ]
    },
    bangkok: {
      zones: ["ทั้งหมด", "สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานกรุงเทพ</strong> และ <strong>ไซด์ไลน์ กทม</strong> ระดับพรีเมียม การันตีตรงปก 100% ปลอดภัยนัดเจอชำระหน้างาน ไม่โอนมัดจำ</p>`,
      reviews: [
        { author: "คุณวีรยุทธ", location: "รัชดา กรุงเทพฯ", text: "บริการพรีเมียมมาก ตรงปกตามรูป จ่ายหน้างาน 100% แนะนำเลยครับ", date: "เมื่อวานนี้" },
        { author: "คุณปณิธาน", location: "สุขุมวิท กรุงเทพฯ", text: "ตรงปก บริการฟิวแฟนประทับใจ นัดเจอง่ายไม่มีมัดจำครับ", date: "3 วันที่แล้ว" }
      ],
      faqs: [
        { q: "สาวรับงานกรุงเทพฯ ปลอดภัยแค่ไหน?", a: "ปลอดภัย 100% จ่ายเงินเมื่อเจอตัวน้องหน้างาน ไม่มีการโอนเงินก่อนล่วงหน้า" },
        { q: "ครอบคลุมโซนไหนใน กทม. บ้าง?", a: "ครอบคลุม สุขุมวิท รัชดา ห้วยขวาง ลาดพร้าว ทองหล่อ เอกมัย และเขตทำเลทองทั่ว กทม." }
      ]
    },
    chonburi: {
      zones: ["ทั้งหมด", "พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานชลบุรี</strong> รับงานพัทยา และเพื่อนเที่ยวบางแสน พรีเมียม ปลอดภัยจ่ายหน้างาน ไม่โอนมัดจำ</p>`,
      reviews: [
        { author: "คุณสมชาย", location: "พัทยา ชลบุรี", text: "น้องตรงปก น่ารัก เทคแคร์ดีมาก ชำระหน้างานปลอดภัยสุดๆ ครับ", date: "2 วันที่แล้ว" }
      ],
      faqs: [
        { q: "สาวรับงานพัทยา บางแสน นัดเจอยังไง?", a: "แอดไลน์จองคิวนัดเวลานัดพิกัด ชำระค่าขนมโดยตรงเมื่อพบน้อง" }
      ]
    },
    khonkaen: {
      zones: ["ทั้งหมด", "ตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัล"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานขอนแก่น</strong> และเพื่อนเที่ยวไซด์ไลน์ขอนแก่น พรีเมียม คัดสรรโปรไฟล์ตรงปก 100% จ่ายหน้างาน</p>`,
      reviews: [
        { author: "คุณธนกฤต", location: "กังสดาล ขอนแก่น", text: "น้องน่ารัก เป็นกันเองมากๆ สไตล์ฟิวแฟน ไม่ต้องโอนมัดจำล่วงหน้าครับ", date: "4 วันที่แล้ว" }
      ],
      faqs: [
        { q: "สาวรับงานขอนแก่น มีแถวไหนบ้าง?", a: "มีโซนกังสดาล หลัง มข. ตัวเมืองขอนแก่น และใกล้เซ็นทรัล" }
      ]
    },
    phuket: {
      zones: ["ทั้งหมด", "ตัวเมืองภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานภูเก็ต</strong> ป่าตอง และเพื่อนเที่ยวพรีเมียม คัดสรรโปรไฟล์ตรงปก 100% จ่ายหน้างาน</p>`,
      reviews: [
        { author: "คุณอเล็กซ์", location: "ป่าตอง ภูเก็ต", text: "โปรไฟล์ตรงปก 100% บริการดี นัดเจอจ่ายหน้างาน สะดวกสบายมากครับ", date: "3 วันที่แล้ว" }
      ],
      faqs: [
        { q: "สาวรับงานภูเก็ต รับงานโซนป่าตองไหม?", a: "มีน้องๆ พร้อมรับงานโซนป่าตอง ตัวเมืองภูเก็ต กะทู้ และฉลอง" }
      ]
    },
    udonthani: {
      zones: ["ทั้งหมด", "ตัวเมืองอุดร", "UD Town", "หนองประจักษ์"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานอุดรธานี</strong> และเพื่อนเที่ยวพรีเมียม คัดสรรโปรไฟล์ตรงปก 100% จ่ายหน้างาน</p>`,
      reviews: [
        { author: "คุณชัชวาล", location: "UD Town อุดรธานี", text: "น้องตรงปก บริการสุภาพ สไตล์ฟิวแฟน จ่ายหน้างานปลอดภัยครับ", date: "เมื่อวานนี้" }
      ],
      faqs: [
        { q: "สาวรับงานอุดรธานี นัดเจออย่างไร?", a: "นัดหมายผ่าน Line Official ชำระค่าบริการกับน้องเมื่อเจอตัวจริง" }
      ]
    },
    national: {
      zones: ["ทั้งหมด", "กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "อุดรธานี", "ขอนแก่น"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานทั่วไทย</strong> พรีเมียม คัดสรรตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ</p>`,
      reviews: [
        { author: "คุณเกริกพล", location: "นิมมาน เชียงใหม่", text: "นัดเจอน้องตรงปก 100% บริการน่ารักมาก มารยาทดี ไม่มีโอนมัดจำล่วงหน้าสบายใจสุดๆ ครับ", date: "เมื่อวานนี้" },
        { author: "คุณวีรยุทธ", location: "รัชดา กรุงเทพฯ", text: "บริการพรีเมียมมาก ตรงปกตามรูป จ่ายหน้างาน 100% แนะนำเลยครับ", date: "3 วันที่แล้ว" }
      ],
      faqs: [
        { q: "บริการเพื่อนเที่ยว ไซด์ไลน์ มีขั้นตอนการนัดเจออย่างไร?", a: "เลือกลูกค้าเลือกโปรไฟล์ที่สนใจ ติดต่อผ่าน Line Official นัดหมายเวลาและพิกัด นัดเจอตัวชำระค่าบริการหน้างาน" },
        { q: "มีการเรียกเก็บเงินมัดจำล่วงหน้าหรือไม่?", a: "ไม่มีการเรียกเก็บเงินมัดจำล่วงหน้าทุกกรณี ชำระเงินเมื่อพบตัวจริงเท่านั้น" }
      ]
    }
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

  const DEFAULT_SEO = {
    title: "สาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนตรงปก 100% (🟢 พร้อมรับงานทั่วไทย) | First Model Hub",
    description: "ศูนย์รวมสาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟนพรีเมียมทั่วไทย คัดสรรโปรไฟล์ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ",
    keywords: "แฟนเช่า, แฟนเช่าเชียงใหม่, รับงาน, สาวรับงาน, ไซด์ไลน์, เพื่อนเที่ยว, ฟิวแฟน, เด็กเอ็น, รับงานไม่มัดจำ, รับงานจ่ายหน้างาน",
    canonical: "https://firstmodelhub.com/",
    ogImage: "https://firstmodelhub.com/images/firstmodelhub.webp"
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
      console.error("Error saving recent search:", e);
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
      container.style.cssText = "position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%); z-index: 10000; display: flex; flex-direction: column; gap: 8px; width: 90%; max-width: 400px; pointer-events: none;";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const isSuccess = type === "success";
    toast.style.cssText = `
      background-color: ${isSuccess ? "rgba(16, 185, 129, 0.95)" : "rgba(239, 68, 68, 0.95)"};
      color: white;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid ${isSuccess ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"};
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
      DOM.profilesDisplayArea.classList.remove("hidden");
      DOM.profilesDisplayArea.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: #EF4444; max-width: 500px; margin: 48px auto; background-color: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 24px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 16px; color: var(--primary-purple);"></i>
            <h3 style="font-size: 18px; font-weight: 800; color: white; margin: 0;">ระบบเชื่อมต่อขัดข้องชั่วคราว</h3>
            <p style="margin-top: 12px; color: var(--text-gray); font-size: 13px; line-height: 1.6;">ไม่สามารถดึงข้อมูลโปรไฟล์ได้ในขณะนี้ กรุณาตรวจสอบสัญญาณอินเทอร์เน็ตของคุณใหม่อีกครั้งครับ</p>
            <button onclick="window.location.reload()" 
                    style="margin-top: 24px; padding: 12px 28px; background-color: var(--primary-purple); color: white; border-radius: 100px; border: none; cursor: pointer; font-weight: 800; font-size: 13px; box-shadow: 0 4px 15px rgba(90, 44, 190, 0.3); transition: transform 0.2s;"
                    onmousedown="this.style.transform='scale(0.96)'" onmouseup="this.style.transform='scale(1)'">
                <i class="fas fa-sync-alt" style="margin-right: 8px;"></i> รีโหลดหน้าเว็บ
            </button>
        </div>
      `;
    }
  }

  function processProfileObject(raw) {
    if (!raw || typeof raw !== "object") return null;

    const formattedName = sanitizeName(raw.name || raw.displayName || raw.title || "น้อง");
    const mainImg = raw.imagePath || raw.image_url || raw.imageUrl || raw.image || raw.photo || raw.avatar;
    const rawGallery = raw.galleryPaths || raw.gallery_paths || raw.gallery || raw.photos || raw.images || [];
    const galleryPaths = Array.isArray(rawGallery) ? rawGallery : (typeof rawGallery === "string" ? rawGallery.split(",").map(s => s.trim()) : []);
    
    const imageList = [mainImg, ...galleryPaths].filter(Boolean);
    const uniqueImages = [...new Set(imageList)];

    let images = uniqueImages.map(path => {
      if (typeof path === "object" && path !== null) {
        return {
          src: path.src || path.url || CONFIG.DEFAULT_OG_IMAGE,
          fullSrc: path.fullSrc || path.fullUrl || path.src || path.url || CONFIG.DEFAULT_OG_IMAGE
        };
      }
      return {
        src: getImageUrl(path, 400),
        fullSrc: getImageUrl(path, 1000)
      };
    });

    if (images.length === 0) {
      images.push({ src: CONFIG.DEFAULT_OG_IMAGE, fullSrc: CONFIG.DEFAULT_OG_IMAGE });
    }

    let provKey = (raw.provinceKey || raw.province_slug || raw.province_key || raw.province || "chiangmai").toString().toLowerCase().trim();
    if (provKey === "chiang_mai" || provKey === "chiang-mai") provKey = "chiangmai";

    const provinceThaiName = STATE.provincesMap.get(provKey) || raw.provinceThai || raw.province_thai || raw.provinceName || "เชียงใหม่";

    const rawPrice = raw.rate || raw.price || raw.fee || raw.cost || 0;
    const numericRate = Number(String(rawPrice).replace(/\D/g, "")) || 0;
    const displayPrice = numericRate > 0 ? `${numericRate.toLocaleString()}.-` : (typeof rawPrice === "string" && rawPrice.trim() !== "" ? rawPrice : "สอบถาม");

    let statsFormatted = "-";
    const bust = raw.bust || raw.breast || "";
    const waist = raw.waist || "";
    const hips = raw.hip || raw.hips || "";
    const cup = (raw.cup_size || raw.cupSize || raw.cup || "").toString().toUpperCase().trim();

    if (bust && waist && hips) {
      statsFormatted = `${bust}${cup}-${waist}-${hips}`;
    } else if (raw.stats || raw.proportion || raw.proportions) {
      statsFormatted = String(raw.stats || raw.proportion || raw.proportions).trim();
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
    const safeSkin = (rawSkin && String(rawSkin).trim() !== "-") ? String(rawSkin).trim() : "ไม่ระบุ";

    const safeStats = (statsFormatted && statsFormatted !== "-") ? statsFormatted : "ไม่ระบุ";

    // 🟢 ใช้สโลแกนแบบสุ่มไดนามิกเมื่อผู้ดูแลไม่ได้ใส่สโลแกนใน DB
    const sloganText = getDeterministicSlogan(raw.id || raw.slug, raw.slogan || raw.quote || raw.tagline);
    const rawTags = raw.style_tags || raw.styleTags || raw.tags || [];
    const styleTags = Array.isArray(rawTags) ? rawTags : (typeof rawTags === "string" ? rawTags.split(",").map(t => t.trim()) : []);

    const availStatus = raw.availability || raw.status || "รับงาน";
    const isBusy = ["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "off", "busy"].some(keyword => availStatus.toLowerCase().includes(keyword));
    const isAvailable = !isBusy;

    const lineIdClean = (raw.line_id || raw.lineId || raw.line || "").toString().replace(/^@/, "").trim();

    return {
      ...raw,
      displayName: formattedName,
      images: images,
      provinceNameThai: provinceThaiName,
      provinceKey: provKey,
      displayPrice: displayPrice,
      _price: numericRate,
      bust: String(bust),
      
      safeAge: cleanAge || "-",
      safeAgeDisplay: safeAgeDisplay,
      safeHeight: safeHeight,
      safeWeight: safeWeight,
      safeStats: safeStats,
      safeSkin: safeSkin,

      isAvailable: isAvailable,
      availability: availStatus,
      isVerified: raw.verified === true || raw.isVerified === true || raw.is_verified === true,
      hasVideo: raw.has_video === true || raw.hasVideo === true || raw.hasVideoClip === true,
      isNew: raw.is_new === true || raw.isNew === true,
      isfeatured: raw.isfeatured === true || raw.is_featured === true || raw.isFeatured === true,
      
      lineId: lineIdClean,
      styleTags: styleTags,
      quote: sloganText,
      slogan: sloganText
    };
  }

  function saveCacheToLocalStorage(key, data) {
    runIdle(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        if (e.name === "QuotaExceededError" || e.code === 22) {
          localStorage.removeItem(CONFIG.KEYS.CACHE_PROFILES);
          localStorage.removeItem("recent_searches");
          try {
            localStorage.setItem(key, JSON.stringify(data));
          } catch (err) {
            console.error("❌ บันทึกแคชล้มเหลว:", err);
          }
        }
      }
    }, 1500);
  }

  async function fetchProfilesData() {
    if (STATE.isFetching) return false;
    STATE.isFetching = true;

    try {
      if (window.profilesData && Array.isArray(window.profilesData) && window.profilesData.length > 0) {
        console.log("⚡ [Hydration] โหลดข้อมูล SSR สำเร็จ!");
        STATE.allProfiles = deduplicateProfiles(window.profilesData.map(p => processProfileObject(p)).filter(Boolean));
        populateProvinceDropdown();
        applyUltimateFilters(false, false);
        updateHeroSwiperCards();
        STATE.isFetching = false;
        return true;
      }

      console.log("🚀 กำลังดึงข้อมูลโปรไฟล์จาก Supabase...");
      
      const provincesPromise = supabaseClient.from("provinces").select("*");
      const profilesPromise = supabaseClient.from("profiles").select("*").eq("active", true).order("isfeatured", { ascending: false }).order("created_at", { ascending: false });

      const [provincesRes, profilesRes] = await Promise.all([provincesPromise, profilesPromise]);

      if (provincesRes.data) {
        STATE.provincesMap.clear();
        const provincesCacheArr = [];
        provincesRes.data.forEach(p => {
          const name = p.nameThai || p.name_thai || p.name;
          let key = (p.key || p.slug || p.id).toString().toLowerCase();
          if (key === "chiang_mai") key = "chiangmai";
          if (key && name) {
            STATE.provincesMap.set(key, name);
            provincesCacheArr.push({ key: key, name: name });
          }
        });
        saveCacheToLocalStorage(CONFIG.KEYS.CACHE_PROVINCES, provincesCacheArr);
      }

      if (profilesRes.error) {
        throw profilesRes.error;
      }

      const rawProfiles = profilesRes.data || [];
      STATE.allProfiles = deduplicateProfiles(rawProfiles.map(p => processProfileObject(p)).filter(Boolean));
      saveCacheToLocalStorage(CONFIG.KEYS.CACHE_PROFILES, STATE.allProfiles);

      populateProvinceDropdown();
      applyUltimateFilters(false, false);
      updateHeroSwiperCards();
      return true;

    } catch (err) {
      console.error("❌ โหลดข้อมูลล้มเหลว นำข้อมูลเก่ามาแสดงแทน:", err);
      const fallbackRaw = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
      if (fallbackRaw) {
        STATE.allProfiles = deduplicateProfiles(JSON.parse(fallbackRaw));
        populateProvinceDropdown();
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

  function updateHeroSwiperCards() {
    const swiperContainer = document.getElementById("vip-swiper-container");
    if (!swiperContainer || !STATE.allProfiles || STATE.allProfiles.length === 0) return;

    let hotProfiles = STATE.allProfiles.filter(p => {
      const tags = Array.isArray(p.styleTags) ? p.styleTags : (typeof p.styleTags === 'string' ? p.styleTags.split(',') : []);
      const tagText = `${tags.join(" ")} ${p.slogan || ''} ${p.quote || ''}`.toLowerCase();
      return tagText.includes("ฟิวแฟน") || tagText.includes("ฟิลแฟน");
    });

    if (hotProfiles.length === 0) {
      hotProfiles = STATE.allProfiles.slice(0, 8);
    } else {
      hotProfiles = hotProfiles.slice(0, 8);
    }

    swiperContainer.innerHTML = hotProfiles.map((p, idx) => {
      const rankText = `#${idx + 1} HOT`;
      const realLocation = p.location || p.provinceNameThai || STATE.provincesMap.get(p.provinceKey) || "ทั่วไทย";
      const pSlug = encodeURIComponent(p.slug || p.id);
      const imgUrl = p.images[0]?.src || CONFIG.DEFAULT_OG_IMAGE;
      
      const isAvail = p.status === "รับงาน" || !(p.availability || "").toLowerCase().includes("ไม่ว่าง");
      const availText = isAvail ? "รับงาน" : "สอบถาม";

      return `
        <div class="vip-card-item ${idx === 0 ? 'active-glow' : ''}" data-profile-id="${p.id}" data-profile-slug="${pSlug}" style="flex: 0 0 155px !important; width: 155px !important; height: 215px !important; position: relative !important; overflow: hidden !important; border-radius: 16px !important; background-color: #09090C !important; border: 1px solid rgba(192, 132, 252, 0.35) !important; scroll-snap-align: start !important; flex-shrink: 0 !important; cursor: pointer !important;">
          <span class="vip-status-chip" style="position: absolute !important; top: 6px !important; left: 6px !important; background: rgba(9, 9, 11, 0.88) !important; border: 1px solid rgba(0, 230, 118, 0.5) !important; color: #00E676 !important; font-size: 10px !important; font-weight: 800 !important; padding: 2px 6px !important; border-radius: 100px !important; z-index: 15 !important; pointer-events: none !important; white-space: nowrap !important; backdrop-filter: blur(8px) !important;">🟢 ${availText}</span>
          <span class="hot-rank-badge" style="position: absolute !important; top: 6px !important; right: 6px !important; background: linear-gradient(135deg, #FF9100 0%, #FFEB3B 100%) !important; color: #000000 !important; font-size: 10px !important; font-weight: 900 !important; padding: 2px 6px !important; border-radius: 100px !important; z-index: 15 !important; pointer-events: none !important; display: flex !important; align-items: center !important; gap: 3px !important; white-space: nowrap !important;"><i class="fas fa-crown"></i> ${rankText}</span>
          <img src="${imgUrl}" alt="${p.displayName}" loading="${idx < 2 ? 'eager' : 'lazy'}" style="position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; object-fit: cover !important; object-position: top center !important; z-index: 1 !important; margin: 0 !important; padding: 0 !important; pointer-events: none !important;" onerror="this.src='${CONFIG.DEFAULT_OG_IMAGE}'">
          <div class="vip-card-overlay" style="position: absolute !important; inset: 0 !important; background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 50%, transparent 75%) !important; z-index: 2 !important; pointer-events: none !important;"></div>
          <a href="/sideline/${pSlug}" class="card-link" style="display: block !important; width: 100% !important; height: 100% !important; position: absolute !important; inset: 0 !important; z-index: 25 !important; cursor: pointer !important; pointer-events: auto !important;" aria-label="ดูโปรไฟล์${p.displayName}"></a>
          <div class="vip-card-info" style="position: absolute !important; bottom: 8px !important; left: 8px !important; right: 8px !important; z-index: 10 !important; pointer-events: none !important; text-align: left !important; display: flex !important; flex-direction: column !important; gap: 2px !important;">
            <div class="vip-name" style="color: #FFFFFF !important; font-size: 12px !important; font-weight: 800 !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;">${p.displayName}</div>
            <div class="vip-location" style="color: #C084FC !important; font-size: 11px !important; font-weight: 700 !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; margin-top: 1px !important; display: flex !important; align-items: center !important; gap: 3px !important;"><i class="fas fa-map-marker-alt"></i> ${realLocation}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  function populateProvinceDropdown() {
    if (!DOM.provinceSelect) return;
    while (DOM.provinceSelect.options.length > 1) {
      DOM.provinceSelect.remove(1);
    }
    const sortedProvinces = Array.from(STATE.provincesMap.entries()).sort((a, b) => a[1].localeCompare(b[1], "th"));
    const fragment = document.createDocumentFragment();

    const modalChipsContainer = document.getElementById("modal-province-chips");
    let modalChipsHTML = `<button type="button" class="luxury-chip province-chip active" data-value="">ทั้งหมด</button>`;

    sortedProvinces.forEach(([key, name]) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = name;
      fragment.appendChild(opt);
      modalChipsHTML += `<button type="button" class="luxury-chip province-chip" data-value="${key}">${name}</button>`;
    });

    DOM.provinceSelect.appendChild(fragment);

    if (modalChipsContainer) {
      modalChipsContainer.innerHTML = modalChipsHTML;
      modalChipsContainer.querySelectorAll('.province-chip').forEach(btn => {
        btn.onclick = function() {
          modalChipsContainer.querySelectorAll('.province-chip').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          if (DOM.provinceSelect) {
            DOM.provinceSelect.value = this.getAttribute('data-value') || '';
            DOM.provinceSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        };
      });
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
    const seoAltText = `${nameClean} สาวรับงาน${currentProvName} ไซด์ไลน์${currentProvName} ฟิวแฟนตรงปก 100%`;

    const isAvailable = profile.status === "รับงาน" || !(profile.availability || "").toLowerCase().includes("ไม่ว่าง");
    const statusDotColor = isAvailable ? "#00E676" : "#FF2E63";
    const statusText = profile.availability || (isAvailable ? "รับงาน" : "สอบถามคิว");
    
    // 🟢 แสดงอายุในวงเล็บเฉพาะคนที่มีข้อมูลอายุจริงเท่านั้น
    const ageDisplay = (profile.safeAge && profile.safeAge !== "-" && profile.safeAge !== "ไม่ระบุ") ? ` <span style="font-size: 0.85em; opacity: 0.9;">(${profile.safeAge})</span>` : "";

    const featuredBadge = profile.isfeatured
      ? `<span style="background: rgba(90, 44, 190, 0.88); border: 1px solid rgba(192, 132, 252, 0.5); color: #FFFFFF; font-size: 12px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-star" style="font-size: 10px; color: #FBBF24;"></i>
          <span style="letter-spacing: 0.02em;">แนะนำ</span>
         </span>`
      : "";

    const statusBadge = `
      <span style="background: rgba(9, 9, 11, 0.82); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 12px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${statusDotColor}; box-shadow: 0 0 6px ${statusDotColor}; flex-shrink: 0;"></span>
          <span style="letter-spacing: 0.02em;">${statusText}</span>
      </span>
    `;

    const videoBadge = profile.hasVideo
      ? `<span style="background: rgba(255, 46, 99, 0.35); border: 1px solid rgba(255, 46, 99, 0.6); color: #FF2E63; font-size: 12px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-video" style="font-size: 10px;"></i> คลิป
         </span>`
      : "";

    const verifiedBadge = (profile.isVerified || profile.verified)
      ? `<span style="background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(52, 211, 153, 0.55); color: #00E676; font-size: 12px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-check-circle" style="font-size: 10px; color: #00E676;"></i> ยืนยันตัวตน
         </span>`
      : "";

    const encodedSlug = encodeURIComponent(profile.slug || profile.id);

    card.innerHTML = `
      <img src="${imageSrc}" 
           alt="${seoAltText}"
           title="${seoAltText}"
           width="300"
           height="400"
           style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; filter: brightness(0.96); transition: transform 0.4s ease, opacity 0.5s; opacity: 1; z-index: 0; border-radius: 16px;"
           loading="${index < 2 ? "eager" : "lazy"}"
           decoding="async"
           onerror="this.onerror=null; this.src='${CONFIG.DEFAULT_OG_IMAGE}';" />
           
      <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 20%, transparent 38%); z-index: 10; pointer-events: none;"></div>

      <div style="position: absolute; top: 6px; left: 6px; z-index: 30; pointer-events: none; display: flex; flex-direction: column; gap: 3px; align-items: flex-start;">
          ${featuredBadge}
          ${statusBadge}
          ${videoBadge}
      </div>

      <div style="position: absolute; top: 6px; right: 6px; z-index: 30; pointer-events: none; display: flex; align-items: center; gap: 4px;">
          ${verifiedBadge}
          <button type="button" data-action="like" data-id="${profile.id}" class="like-heart-btn" aria-label="กดถูกใจโปรไฟล์" style="background: rgba(9, 9, 11, 0.7); border: 1px solid rgba(255,255,255,0.2); color: #FF2E63; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; pointer-events: auto; backdrop-filter: blur(6px); transition: transform 0.2s;">
            <i class="fas fa-heart" style="font-size: 12px;"></i>
          </button>
      </div>
      
      <a href="/sideline/${encodedSlug}" class="card-link" style="position: absolute; inset: 0; z-index: 25;" aria-label="ดูโปรไฟล์${nameClean}"></a>

      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 6px 10px 8px 10px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 1px;">
          <h3 style="font-size: 14px; font-weight: 800; color: white; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 4px rgba(0,0,0,0.95);">
            ${nameClean}${ageDisplay}
          </h3>
          
          ${(profile.slogan || profile.quote) ? `<p style="font-size: 12px; color: #C084FC; font-weight: 600; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">${profile.slogan || profile.quote}</p>` : ''}
          
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #D4D4D8; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 3px; margin-top: 2px;">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">
                  <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 2px;"></i> ${profile.location || currentProvName}
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
    wrapper.className = "section-content-wrapper province-section";
    wrapper.id = `province-${provinceKey}`;
    wrapper.style.cssText = "margin-top: 24px;";
    
    wrapper.innerHTML = `
      <div style="padding: 8px 4px 12px 4px;">
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
      <div class="profile-grid profiles-grid-row"></div>
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
      if (searchForm) searchForm.appendChild(container);
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
          const clearBtn = document.getElementById("clear-search-btn");
          if (clearBtn) clearBtn.style.display = "none";
          applyUltimateFilters(true, true);
        }
      });
    }

    if (prov && prov !== "all" && prov !== "") {
      const provName = STATE.provincesMap.get(prov) || prov;
      activeItems.push({
        label: `📍 ${provName}`,
        clear: () => {
          if (DOM.provinceSelect) DOM.provinceSelect.value = "";
          applyUltimateFilters(true, true);
        }
      });
    }

    if (avail && avail !== "all" && avail !== "") {
      activeItems.push({
        label: `🟢 ${avail}`,
        clear: () => {
          if (DOM.availabilitySelect) DOM.availabilitySelect.value = "";
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
      <span class="active-chip-item" data-idx="${idx}" style="background: rgba(192, 132, 252, 0.18); border: 1px solid rgba(192, 132, 252, 0.4); color: #E9D5FF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 100px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
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
      chipsWrapper.style.cssText = "display: flex; gap: 6px; overflow-x: auto; padding: 8px 2px 2px 2px; margin-top: 8px; -webkit-overflow-scrolling: touch; scrollbar-width: none;";
      
      const searchForm = document.getElementById("search-form");
      if (searchForm) searchForm.appendChild(chipsWrapper);
    }

    const currentProv = DOM.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || "chiangmai";
    const data = LOCALIZED_SEO_MAP[currentProv] || LOCALIZED_SEO_MAP["national"];
    const zones = (data && data.zones) ? data.zones.slice(1, 5) : ["ตัวเมือง"];

    let chipsHtml = `
      <button type="button" class="quick-chip-btn" data-type="featured" style="background: rgba(124, 58, 237, 0.18); border: 1px solid rgba(192, 132, 252, 0.35); color: #E9D5FF; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 100px; cursor: pointer; white-space: nowrap; flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px;">
        <i class="fas fa-star" style="color: #FBBF24;"></i> VIP แนะนำ
      </button>
      <button type="button" class="quick-chip-btn" data-type="avail" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(52, 211, 153, 0.35); color: #00E676; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 100px; cursor: pointer; white-space: nowrap; flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px;">
        <span style="width: 6px; height: 6px; border-radius: 50%; background-color: #00E676;"></span> พร้อมรับงาน
      </button>
      <button type="button" class="quick-chip-btn" data-type="tag" data-val="ฟิวแฟน" style="background: rgba(255, 20, 147, 0.15); border: 1px solid rgba(255, 105, 180, 0.35); color: #FF85C0; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 100px; cursor: pointer; white-space: nowrap; flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px;">
        <i class="fas fa-heart" style="color: #FF1493;"></i> #ฟิวแฟน
      </button>
    `;

    zones.forEach(z => {
      chipsHtml += `
        <button type="button" class="quick-chip-btn" data-type="keyword" data-val="${z}" style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); color: #D4D4D8; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 100px; cursor: pointer; white-space: nowrap; flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px;">
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
        }
        applyUltimateFilters(true, true);
      };
    });
  }

  // 🟢 เลื่อนหน้าจอลงไปยังจุดแสดงผลลัพธ์อัตโนมัติ
  function scrollToSearchResults() {
    const targetElement = document.getElementById("profiles-display-area");
    if (!targetElement) return;

    const headerOffset = 70;
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }

  function applyUltimateFilters(updateUrlHistory = true, isUserAction = false) {
    try {
      const activeFilters = {
        text: (DOM.searchInput?.value || "").trim(),
        province: DOM.provinceSelect?.value || "all",
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
      const urlProvinceKey = locMatch ? decodeURIComponent(locMatch[1]) : null;

      let targetProvinceKey = (activeFilters.province && activeFilters.province !== "all" && activeFilters.province !== "") 
        ? activeFilters.province 
        : urlProvinceKey;

      if (targetProvinceKey === "chiang_mai") targetProvinceKey = "chiangmai";

      if (targetProvinceKey) {
        results = results.filter(p => {
          const k = (p.provinceKey || p.province_slug || p.province || "").toString().toLowerCase();
          if (targetProvinceKey === "chiangmai") {
            return k === "chiangmai" || k === "chiang_mai";
          }
          return k === targetProvinceKey;
        });
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

      // 🟢 กรองรายการโปรไฟล์ไม่ให้ซ้ำกันก่อนเรียงลำดับ
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
      renderProfilesGrid(results, activeFilters.text || (activeFilters.province && activeFilters.province !== "all" && activeFilters.province !== "") || activeFilters.avail !== "all" || activeFilters.featured || activeFilters.price, isUserAction);

      if (updateUrlHistory) {
        let newPath = "/";
        if (activeFilters.province && activeFilters.province !== "all" && activeFilters.province !== "") {
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

      if (isUserAction) {
        scrollToSearchResults();
      }

    } catch (e) {
      console.error("❌ เกิดข้อผิดพลาดในระบบการกรอง:", e);
    }
  }

  function renderProfilesGrid(profiles, isFilteredView, isUserAction = false) {
    if (!DOM.profilesDisplayArea) return;

    STATE.renderId = (STATE.renderId || 0) + 1;
    const currentRenderId = STATE.renderId;

    destroyLoadingPlaceholder();
    if (DOM.noResultsMessage) DOM.noResultsMessage.classList.add("hidden");
    if (DOM.fetchErrorMessage) DOM.fetchErrorMessage.classList.add("hidden");

    if (DOM.featuredSection) {
      const isHomePage = !isFilteredView && !window.location.pathname.includes("/location/");
      const featuredCount = STATE.allProfiles.filter(p => p.isfeatured).length;
      DOM.featuredSection.classList.toggle("hidden", !isHomePage || featuredCount === 0);

      if (isHomePage && featuredCount > 0 && DOM.featuredContainer && DOM.featuredContainer.children.length === 0) {
        const featuredProfiles = STATE.allProfiles.filter(p => p.isfeatured);
        appendProfilesToContainer(DOM.featuredContainer, featuredProfiles, currentRenderId);
      }
    }

    if (!profiles || profiles.length === 0) {
      DOM.profilesDisplayArea.innerHTML = "";

      const recommendations = STATE.allProfiles.filter(p => p.isfeatured || p.isAvailable).slice(0, 6);

      let fallbackHtml = `
        <div style="text-align: center; padding: 36px 16px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(192, 132, 252, 0.35); border-radius: 20px; margin-bottom: 24px; backdrop-filter: blur(10px);">
          <div style="font-size: 36px; margin-bottom: 8px;">🔍</div>
          <h3 style="font-size: 16px; font-weight: 800; color: #FFF; margin: 0;">ไม่พบโปรไฟล์ที่ตรงกับเงื่อนไขที่คุณค้นหา</h3>
          <p style="font-size: 12px; color: #A1A1AA; margin-top: 6px; line-height: 1.5;">ลองลดตัวกรอง พิมพ์คำค้นหาใหม่ หรือกดล้างตัวกรองด้านล่าง</p>
          <button id="fallback-reset-btn" style="margin-top: 14px; background: rgba(192, 132, 252, 0.2); border: 1px solid #C084FC; color: #E9D5FF; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 800; cursor: pointer;">
            🔄 ล้างตัวกรองค้นหาทั้งหมด
          </button>
        </div>
      `;

      if (recommendations.length > 0) {
        fallbackHtml += `
          <div style="margin-top: 20px;">
            <h3 style="font-size: 15px; font-weight: 800; color: #C084FC; margin-bottom: 12px;">
              💡 โปรไฟล์ยอดนิยมแนะนำที่คุณอาจสนใจ:
            </h3>
            <div class="profile-grid profiles-grid-row" id="fallback-grid-area"></div>
          </div>
        `;
        DOM.profilesDisplayArea.innerHTML = fallbackHtml;

        const fallbackGrid = document.getElementById("fallback-grid-area");
        if (fallbackGrid) {
          appendProfilesToContainer(fallbackGrid, recommendations, currentRenderId);
        }

        document.getElementById("fallback-reset-btn")?.addEventListener("click", () => {
          DOM.resetSearchBtn?.click();
        });
      } else {
        if (DOM.noResultsMessage) DOM.noResultsMessage.classList.remove("hidden");
      }

      if (isUserAction) scrollToSearchResults();
      return;
    }

    DOM.profilesDisplayArea.innerHTML = "";
    const isLocationPage = window.location.pathname.includes("/location/") || window.location.pathname.includes("/province/");

    if (isFilteredView || isLocationPage) {
      const currentProvKey = DOM.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || "chiangmai";
      const provName = STATE.provincesMap.get(currentProvKey) || "เชียงใหม่";
      const count = profiles.length;

      let headingTitle = `📍 น้องๆ ในจังหวัด <span style="color: #C084FC;">${provName}</span>`;
      if (DOM.searchInput?.value) {
        headingTitle = `🔍 ผลการค้นหา "${DOM.searchInput.value}"`;
      }

      const sectionWrapper = document.createElement("div");
      sectionWrapper.className = "section-content-wrapper";
      sectionWrapper.style.cssText = "margin-top: 16px;";
      
      sectionWrapper.innerHTML = `
        <div style="padding: 8px 4px 14px 4px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <h2 style="font-size: 18px; font-weight: 800; color: white; margin: 0; display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
                ${headingTitle}
                <span class="live-count-chip">
                  <span class="pulse-dot-el"></span>
                  <span>พบ ${count} โปรไฟล์พร้อมรับงาน</span>
                </span>
            </h2>
        </div>
        <div class="profile-grid profiles-grid-row"></div>
      `;

      DOM.profilesDisplayArea.appendChild(sectionWrapper);

      appendProfilesToContainer(sectionWrapper.querySelector(".profile-grid"), profiles, currentRenderId).then(() => {
        if (isUserAction) scrollToSearchResults();
      });

    } else {
      const grouped = profiles.reduce((acc, p) => {
        const key = p.provinceKey || "no_province";
        acc[key] = acc[key] || [];
        acc[key].push(p);
        return acc;
      }, {});

      const sortedProvinceKeys = Object.keys(grouped).sort((a, b) => {
        const nameA = STATE.provincesMap.get(a) || a;
        const nameB = STATE.provincesMap.get(b) || b;
        return nameA.localeCompare(nameB, "th");
      });

      if (sortedProvinceKeys.length !== 0) {
        (async function () {
          for (const key of sortedProvinceKeys) {
            if (STATE.renderId !== currentRenderId) return;

            const name = STATE.provincesMap.get(key) || (key === "no_province" ? "ไม่ระบุจังหวัด" : key);
            // 🟢 ขจัดโปรไฟล์ซ้ำภายในกลุ่มย่อย
            const cleanGroupProfiles = deduplicateProfiles(grouped[key]);
            const section = createProvinceSectionElement(key, name, cleanGroupProfiles);

            DOM.profilesDisplayArea.appendChild(section);

            const grid = section.querySelector(".profile-grid");
            await appendProfilesToContainer(grid, cleanGroupProfiles, currentRenderId);
          }
          if (isUserAction) scrollToSearchResults();
        })();
      } else {
        if (DOM.noResultsMessage) DOM.noResultsMessage.classList.remove("hidden");
      }
    }

    bindMediaProtection();
    if (window.ScrollTrigger) {
      setTimeout(() => ScrollTrigger.refresh(), 500);
    }
  }

  function bindMediaProtection() {
    document.querySelectorAll("img").forEach(img => {
      img.addEventListener("contextmenu", e => e.preventDefault());
      img.addEventListener("dragstart", e => e.preventDefault());
    });
  }

  function renderSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById("search-suggestions");
    const clearBtn = document.getElementById("clear-search-btn");

    if (clearBtn) clearBtn.style.display = query ? "block" : "none";
    if (!suggestionsContainer) return;

    if (!query) {
      const currentProv = DOM.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || "chiangmai";
      const data = LOCALIZED_SEO_MAP[currentProv] || LOCALIZED_SEO_MAP["national"];
      const zones = (data && data.zones) ? data.zones.slice(1, 5) : ["ตัวเมือง"];

      let html = `<div style="background-color: #121214; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 12px; padding: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); backdrop-filter: blur(15px);">`;
      html += `<div style="font-size: 11px; font-weight: 800; color: #C084FC; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;"><i class="fas fa-lightbulb" style="color: #FBBF24;"></i> คำแนะนำการค้นหายอดฮิต:</div>`;
      html += `<div style="display: flex; flex-wrap: wrap; gap: 6px;">`;
      
      html += `<span data-action="suggestion" data-slug="ฟิวแฟน" data-is-profile="false" style="background: rgba(255,20,147,0.15); border: 1px solid rgba(255,105,180,0.3); color: #FF85C0; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">❤️ #ฟิวแฟน</span>`;
      html += `<span data-action="suggestion" data-slug="1500" data-is-profile="false" style="background: rgba(16,185,129,0.15); border: 1px solid rgba(52,211,153,0.3); color: #00E676; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">💰 1,500.-</span>`;
      
      zones.forEach(z => {
        html += `<span data-action="suggestion" data-slug="${z}" data-is-profile="false" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #D4D4D8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">📍 ${z}</span>`;
      });

      html += `</div></div>`;
      suggestionsContainer.innerHTML = html;
      suggestionsContainer.classList.remove("hidden");
      suggestionsContainer.style.display = "block";
      return;
    }

    const q = query.toLowerCase().trim();
    
    const profileMatches = STATE.allProfiles.filter(item => {
      const name = (item.displayName || item.name || "").toLowerCase();
      const loc = (item.location || "").toLowerCase();
      const prov = (item.provinceNameThai || "").toLowerCase();
      const id = String(item.id || "");
      return name.includes(q) || loc.includes(q) || prov.includes(q) || id === q;
    }).slice(0, 4);

    if (profileMatches.length === 0) {
      suggestionsContainer.classList.add("hidden");
      suggestionsContainer.style.display = "none";
      return;
    }

    let html = `
      <div style="background-color: #121214; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
          <div style="padding: 6px 14px; background-color: #09090B; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <span style="font-size: 11px; font-weight: 800; color: #C084FC; text-transform: uppercase;">✨ ผลลัพธ์แนะนำ (${profileMatches.length})</span>
          </div>
          <div style="display: flex; flex-direction: column;">
    `;

    profileMatches.forEach(item => {
      const provName = STATE.provincesMap.get(item.provinceKey) || item.provinceNameThai || "";
      const isAvail = item.availability?.includes("ว่าง") || item.availability?.includes("รับงาน");
      const thumbImg = item.images && item.images[0] ? item.images[0].src : CONFIG.DEFAULT_OG_IMAGE;

      html += `
        <div class="suggestion-item" 
             data-action="suggestion"
             data-slug="${encodeURIComponent(item.slug || item.id)}"
             data-is-profile="true"
             style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.03);">
            <div style="position: relative; width: 36px; height: 36px; flex-shrink: 0;">
                <img src="${thumbImg}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);" alt="รูป">
                <span style="position: absolute; bottom: 0; right: 0; width: 8px; height: 8px; background-color: ${isAvail ? "#00E676" : "#9CA3AF"}; border: 2px solid #121214; border-radius: 50%;"></span>
            </div>
            <div style="flex: 1; min-width: 0; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px;">
                    <div style="font-size: 12px; font-weight: 800; color: #FFFFFF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${item.displayName || item.name}</div>
                    ${item.age ? `<span style="font-size: 10px; background-color: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; color: var(--text-gray); font-weight: 700;">${item.age} ปี</span>` : ""}
                </div>
                <div style="display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                    <span style="font-size: 11px; color: var(--text-gray); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        <i class="fas fa-map-marker-alt" style="font-size: 10px; color: var(--primary-purple); margin-right: 4px;"></i> ${item.location || provName}
                    </span>
                </div>
            </div>
            <i class="fas fa-chevron-right" style="color: rgba(255,255,255,0.15); font-size: 12px;"></i>
        </div>
      `;
    });

    html += "</div></div>";

    suggestionsContainer.innerHTML = html;
    suggestionsContainer.classList.remove("hidden");
    suggestionsContainer.style.display = "block";
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
        <span class="brand-neon-text" style="font-size: clamp(22px, 5.5vw, 28px) !important; font-weight: 900 !important; background: linear-gradient(135deg, #FFFFFF 0%, #FF85C0 35%, #FF1493 70%, #E02475 100%) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; filter: drop-shadow(0 0 12px rgba(255, 20, 147, 0.8)) !important;">${nameClean}</span>
        ${profile.isVerified ? '<i class="fas fa-check-circle" style="color: #00E676; margin-left: 6px; font-size: 18px;" title="ยืนยันตัวตนแล้ว"></i>' : ""}
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
      heroImg.alt = `${nameClean} สาวรับงาน${profile.provinceNameThai || "เชียงใหม่"}`;
    }

    const strip = document.getElementById("lightboxThumbnailStrip");
    if (strip) {
      strip.innerHTML = "";
      if (profile.images && profile.images.length > 1) {
        profile.images.forEach((imgObj, idx) => {
          const thumb = document.createElement("img");
          thumb.src = imgObj.src;
          thumb.alt = `ภาพที่ ${idx + 1}`;
          thumb.style.cssText = "width: 50px; height: 60px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; opacity: 0.5; transition: all 0.2s; flex-shrink: 0;";
          
          if (idx === 0) {
            thumb.style.borderColor = "var(--primary-purple)";
            thumb.style.opacity = "1";
          }

          thumb.onclick = () => {
            if (heroImg) heroImg.src = imgObj.fullSrc || imgObj.src;
            Array.from(strip.children).forEach(child => {
              child.style.borderColor = "transparent";
              child.style.opacity = "0.5";
            });
            thumb.style.borderColor = "var(--primary-purple)";
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
        span.style.cssText = "background: rgba(124, 58, 237, 0.12); border: 1px solid rgba(192, 132, 252, 0.3); color: #E9D5FF; font-size: 12px; padding: 3px 10px; border-radius: 100px; font-weight: 700;";
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
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 100px; text-align: center;">
                <div style="font-size: 12px; color: #A1A1AA; font-weight: 600;">อายุ</div>
                <div style="font-weight: 800; font-size: 13px; color: white; margin-top: 2px;">${ageDisplay}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 100px; text-align: center;">
                <div style="font-size: 12px; color: #A1A1AA; font-weight: 600;">สัดส่วน</div>
                <div style="font-weight: 800; font-size: 13px; color: white; margin-top: 2px;">${statsText}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 100px; text-align: center;">
                <div style="font-size: 12px; color: #A1A1AA; font-weight: 600;">ส่วนสูง</div>
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
                <span style="color: white; font-weight: 700; font-size: 12px;">${profile.location || profile.provinceNameThai || "เชียงใหม่"}</span>
            </div>
        </div>
      `;
    }

    const descContainer = document.getElementById("lightboxDescriptionContainer");
    const descContent = document.getElementById("lightboxDescriptionContent");
    if (descContent) {
      const defaultDesc = `${nameClean} ยืนยันตัวตนตรงปก 100% พร้อมให้บริการเพื่อนเที่ยวฟิวแฟนในพิกัดย่าน ${profile.location || profile.provinceNameThai}`;
      descContent.innerHTML = (profile.description || defaultDesc).replace(/\n/g, "<br>");
    }
    if (descContainer) descContainer.style.display = "block";

    const detailsContainer = document.querySelector(".lightbox-details");
    if (detailsContainer) {
      detailsContainer.scrollTop = 0;
      
      const oldLineBtn = document.getElementById("line-btn-sticky-wrapper");
      if (oldLineBtn) oldLineBtn.remove();

      // 🟢 ล้าง Line ID ให้สะอาด ป้องกันลิงก์เสีย
      const lineIdToUse = (profile.lineId || "ksLUWB89Y_").replace(/^@/, "").trim();
      let lineUrl = "https://line.me/ti/p/ksLUWB89Y_";
      
      if (lineIdToUse.startsWith("http")) {
        lineUrl = lineIdToUse;
      } else if (lineIdToUse && lineIdToUse !== "ksLUWB89Y_") {
        lineUrl = `https://line.me/ti/p/${lineIdToUse}`;
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

    lightbox.classList.add("active");
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
      lightbox.classList.remove("active");
      document.body.style.overflow = "";

      STATE.currentProfileSlug = null;
      if (updateUrl && (window.location.pathname.includes("/profile/") || window.location.pathname.includes("/sideline/"))) {
        history.pushState(null, "", "/");
      }
    }
  }

  function removeJsonLdSchemas() {
    const schemaIds = ["dynamic-schema", "schema-jsonld-person", "schema-jsonld-list", "schema-jsonld-faq", "schema-jsonld-breadcrumb"];
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

    if (isFirstLoad) {
      isFirstLoad = false;
      return;
    }

    if (isHomePage) {
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
      const nameClean = sanitizeName(profile.name);
      const provName = profile.provinceNameThai || "เชียงใหม่";
      const fullLoc = profile.location ? `${profile.location}, ${provName}` : provName;
      const profileUrl = `${CONFIG.SITE_URL}/sideline/${encodeURIComponent(profile.slug || profile.id)}`;
      const locationUrl = `${CONFIG.SITE_URL}/location/${profile.provinceKey || "chiangmai"}`;

      const title = `${nameClean} รับงาน${provName} สาวรับงาน${provName} ไซด์ไลน์${provName} ฟิวแฟนตรงปก | จ่ายหน้างาน`;
      const description = `รายละเอียดโปรไฟล์ ${nameClean} สาวรับงานไซด์ไลน์พิกัดย่าน ${fullLoc} ตรงปก 100% ค่าขนม ${profile.displayPrice} ดูแลสไตล์ฟิวแฟน ไม่มีโอนมัดจำล่วงหน้า (อัปเดต 2026)`;

      document.title = title;
      updateMetaTag("description", description);
      updateMetaTag("keywords", `${nameClean}, รับงาน${provName}, สาวรับงาน${provName}, ไซด์ไลน์${provName}`);
      updateLinkRel("canonical", profileUrl);

      updateOpenGraphAndTwitter(profile, title, description, "profile");

      injectJsonLdSchema({
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${profileUrl}/#person`,
        "name": nameClean,
        "url": profileUrl,
        "image": profile.images && profile.images[0] ? profile.images[0].fullSrc : CONFIG.DEFAULT_OG_IMAGE,
        "description": description,
        "jobTitle": "Freelance Companion & Entertainer",
        "gender": "Female",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": profile.location || provName,
          "addressRegion": provName,
          "addressCountry": "TH"
        },
"offers": {
          "@type": "Offer",
          "url": profileUrl,
          // ✅ ป้องกันค่าว่างด้วยการ fallback เป็น "1500" หากดึงตัวเลขไม่ได้
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
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.SITE_URL },
          { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provName}`, "item": locationUrl },
          { "@type": "ListItem", "position": 3, "name": nameClean, "item": profileUrl }
        ]
      }, "schema-jsonld-breadcrumb");

    } else if (locationData) {
      const provName = locationData.provinceName || "เชียงใหม่";
      const canonicalUrl = locationData.canonicalUrl || window.location.href;
      const count = locationData.profiles ? locationData.profiles.length : 50;

      const title = `รับงาน${provName} ไซด์ไลน์${provName} สาวรับงานฟิวแฟนตรงปก (อัปเดต ${count}+ โปรไฟล์ 2026) | First Model Hub`;
      const description = `รวมน้องๆ สาวรับงาน${provName} กว่า ${count}+ โปรไฟล์ คัดคนสวย ตรงปก 100% ปลอดภัย จ่ายเงินหน้างาน ไม่ต้องโอนมัดจำ`;

      document.title = title;
      updateMetaTag("description", description);
      updateMetaTag("keywords", `รับงาน${provName}, สาวรับงาน${provName}, ไซด์ไลน์${provName}`);
      updateLinkRel("canonical", canonicalUrl);

      updateOpenGraphAndTwitter(null, title, description, "website");
    }
  }

  function updateOpenGraphAndTwitter(profile, title, description, type) {
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:url", profile ? `${CONFIG.SITE_URL}/sideline/${encodeURIComponent(profile.slug || profile.id)}` : CONFIG.SITE_URL);
    updateMetaTag("og:type", type);
    
    const img = profile && profile.images && profile.images[0] ? profile.images[0].src : CONFIG.DEFAULT_OG_IMAGE;
    updateMetaTag("og:image", img);
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

  function updateGoogleMap(provKey = "chiangmai", provName = "เชียงใหม่") {
    const mapIframe = document.getElementById("google-map");
    const mapPlaceholder = document.getElementById("map-placeholder");
    const mapSection = document.getElementById("map-section");
    if (!mapIframe || !mapSection) return;

    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent("สาวรับงาน " + (provKey === "national" ? "กรุงเทพ" : provName))}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    const observer = new IntersectionObserver((entriesList) => {
      entriesList.forEach(entry => {
        if (entry.isIntersecting) {
          if (mapIframe.src !== mapUrl) {
            mapIframe.src = mapUrl;
            mapIframe.onload = () => {
              if (mapPlaceholder) mapPlaceholder.style.opacity = "0";
              setTimeout(() => { if (mapPlaceholder) mapPlaceholder.style.display = "none"; }, 500);
            };
          }
          observer.unobserve(mapSection);
        }
      });
    }, { rootMargin: "200px 0px" });

    observer.observe(mapSection);
  }

  function renderZoneChips(provKey = "chiangmai") {
    let chipsContainer = document.getElementById("zone-chips-container");
    
    if (!chipsContainer) {
      chipsContainer = document.createElement("div");
      chipsContainer.id = "zone-chips-container";
      chipsContainer.style.cssText = "display: flex; gap: 8px; overflow-x: auto; padding: 10px 4px; margin-bottom: 12px; -webkit-overflow-scrolling: touch; scrollbar-width: none;";
      
      const targetSection = document.getElementById("profiles-display-area");
      if (targetSection && targetSection.parentNode) {
        targetSection.parentNode.insertBefore(chipsContainer, targetSection);
      }
    }

    const data = LOCALIZED_SEO_MAP[provKey] || LOCALIZED_SEO_MAP["national"];
    const zones = data.zones || ["ทั้งหมด"];

    chipsContainer.innerHTML = zones.map(zone => {
      const isAll = zone === "ทั้งหมด";
      return `
        <button type="button" data-zone-keyword="${isAll ? '' : zone}" 
                class="zone-chip-btn ${isAll ? 'active' : ''}">
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

        if (DOM.searchInput) {
          DOM.searchInput.value = keyword;
          applyUltimateFilters(true, true);
        }
      });
    });
  }

  function updateDynamicProvinceContent(provKey = "chiangmai", provName = "เชียงใหม่", count = 50) {
    const data = LOCALIZED_SEO_MAP[provKey] || LOCALIZED_SEO_MAP["national"];

    const reviewsGrid = document.getElementById("reviews-container-grid");
    if (reviewsGrid) {
      const reviewsList = (data && data.reviews && data.reviews.length > 0) 
        ? data.reviews 
        : LOCALIZED_SEO_MAP["national"].reviews;
        
      reviewsGrid.innerHTML = reviewsList.map(r => `
        <div class="interactive-card" style="padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; text-align: left; background: rgba(13,8,30,0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="height: 36px; width: 36px; border-radius: 50%; background-color: #27272A; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-weight: 700; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);">${r.author.charAt(0)}</div>
              <div>
                <span style="display: block; font-size: 12px; font-weight: 800; color: white;">${r.author}</span>
                <span style="display: block; font-size: 12px; color: var(--text-muted); font-weight: 700;">นัดเจอใน${r.location}</span>
              </div>
            </div>
            <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 12px;">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
          </div>
          <p style="font-size: 12px; color: var(--text-gray); line-height: 1.5; margin: 0;">${r.text}</p>
          <span style="display: block; font-size: 12px; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">ยืนยันการใช้บริการจริง • ${r.date}</span>
        </div>
      `).join("");
    }

    const faqContainer = document.getElementById("faq-container-list");
    if (faqContainer) {
      const faqsList = (data && data.faqs && data.faqs.length > 0) 
        ? data.faqs 
        : LOCALIZED_SEO_MAP["national"].faqs;

      faqContainer.innerHTML = faqsList.map(item => `
        <div class="interactive-card" style="padding: 16px 20px; background: rgba(13,8,30,0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <h3 style="font-weight: 800; font-size: 14px; display: flex; align-items: start; gap: 10px; margin: 0;">
                  <span style="display: flex; height: 22px; width: 22px; align-items: center; justify-content: center; border-radius: 6px; background-color: rgba(90, 44, 190, 0.2); color: #C084FC; font-size: 12px; font-weight: 900; border: 1px solid rgba(147, 51, 234, 0.3); flex-shrink: 0;">Q</span>
                  <span class="text-gradient-sub" style="line-height: 1.4; color: #E9D5FF;">${item.q}</span>
                </h3>
                <div style="padding-left: 32px; color: var(--text-gray); font-size: 12px; line-height: 1.5; border-left: 2px solid rgba(147, 51, 234, 0.2); padding-top: 4px;">
                  ${item.a}
                </div>
            </div>
        </div>
      `).join("");
    }

    renderZoneChips(provKey);
    updateGoogleMap(provKey, provName);
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
        tabs.forEach(t => {
          t.classList.remove("active");
        });
        tab.classList.add("active");

        if (DOM.searchInput) DOM.searchInput.value = "";
        const region = tab.getAttribute("data-region");
        if (region === "ทั้งหมด") {
          if (DOM.provinceSelect) DOM.provinceSelect.value = "";
        } else if (region === "ภาคเหนือ") {
          if (DOM.provinceSelect) DOM.provinceSelect.value = "chiangmai";
        } else if (region === "กรุงเทพฯ") {
          if (DOM.provinceSelect) DOM.provinceSelect.value = "bangkok";
        }
        applyUltimateFilters(true, true);
      });
    });
  }

  // 🟢 ลบแท็ก {{...}} ที่อาจหลุดออกมาบนหน้าจออัตโนมัติ
  function replaceDomPlaceholders(provinceName = "เชียงใหม่", profileCount = 50, provinceSlug = "chiangmai") {
    try {
      const liveCountEl = document.getElementById("live-profile-count");
      if (liveCountEl) liveCountEl.textContent = profileCount;

      const currentProvData = LOCALIZED_SEO_MAP[provinceSlug] || LOCALIZED_SEO_MAP["chiangmai"];
      const currentZones = (currentProvData && currentProvData.zones) ? currentProvData.zones.slice(1, 5) : ["ตัวเมือง", "บริเวณใกล้เคียง"];
      const zoneText = currentZones.join(", ");

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.includes("{{")) {
          node.nodeValue = node.nodeValue
            .replace(/\{\{PROVINCE_NAME\}\}/g, provinceName)
            .replace(/\{\{PROFILE_COUNT\}\}/g, profileCount)
            .replace(/\{\{PROVINCE_ZONES\}\}/g, zoneText)
            .replace(/\{\{[A-Z0-9_]+\}\}/g, "");
        }
      }

      document.querySelectorAll('input[type="hidden"], input[type="text"]').forEach(el => {
        if (el.value && el.value.includes("{{")) {
          el.value = el.value
            .replace(/\{\{PROVINCE_NAME\}\}/g, provinceName)
            .replace(/\{\{[A-Z0-9_]+\}\}/g, "");
        }
      });

      updateDynamicProvinceContent(provinceSlug, provinceName, profileCount);
    } catch (e) {
      console.warn("⚠️ Replace placeholders error:", e);
    }
  }

  async function handleRouteNavigation(isInitial = false) {
    let path = window.location.pathname.toLowerCase();
    
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }

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

      applyUltimateFilters(false, false);

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
      let provinceSlug = decodeURIComponent(locationMatch[1]).toLowerCase();
      if (provinceSlug === "chiang_mai") provinceSlug = "chiangmai";
      STATE.currentProfileSlug = null;
      closeLightboxModal(false);

      if (DOM.provinceSelect) DOM.provinceSelect.value = provinceSlug;

      applyUltimateFilters(false, false);
      return;
    }

    STATE.currentProfileSlug = null;
    closeLightboxModal(false);

    applyUltimateFilters(false, false);
  }

  async function fetchSingleProfileBySlug(slug) {
    if (!window.supabase) return null;
    try {
      let query = window.supabase.from("profiles").select("*");
      if (/^\d+$/.test(slug)) {
        query = query.eq("id", slug);
      } else {
        query = query.eq("slug", slug);
      }
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data ? processProfileObject(data) : null;
    } catch (e) {
      console.error("❌ ดึงข้อมูลโปรไฟล์ล้มเหลว:", e);
      return null;
    }
  }

  function updateActiveNavLinks() {
    const path = window.location.pathname;
    document.querySelectorAll("nav a").forEach(a => {
      const isActive = a.getAttribute("href") === path;
      a.classList.toggle("active", isActive);
    });
  }

  function hideGlobalLoader() {
    const loader = document.getElementById("global-loader-overlay");
    if (loader) {
      loader.style.display = "none";
    }
    if (DOM.loadingPlaceholder) DOM.loadingPlaceholder.style.display = "none";
  }

  function initThemeToggle() {
    const btn = document.querySelector(".theme-toggle-btn");
    if (!btn) return;
    
    const savedTheme = localStorage.getItem(CONFIG.KEYS.THEME) || "dark";
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
      const icon = btn.querySelector("i");
      if (icon) icon.className = "fas fa-sun";
    }

    btn.addEventListener("click", () => {
      const isLight = document.documentElement.classList.toggle("light");
      localStorage.setItem(CONFIG.KEYS.THEME, isLight ? "light" : "dark");
      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = isLight ? "fas fa-sun" : "fas fa-moon";
      }
    });
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

  function initReviewForm() {
    const form = document.getElementById("review-form");
    if (!form) return;

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "กำลังส่งข้อมูล...";
      }

      const author = document.getElementById("review-author")?.value.trim();
      const location = document.getElementById("review-location")?.value.trim();
      const rating = parseInt(document.getElementById("review-rating-value")?.value || "5", 10);
      const reviewText = document.getElementById("review-text")?.value.trim();
      const provinceKey = DOM.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || "ทั่วไทย";

      if (!author || !reviewText) {
        showToast("❌ กรุณากรอกข้อมูลชื่อผู้ใช้งานและรายละเอียดรีวิวให้ครบถ้วนด้วยครับ", "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "ส่งคำติชมเพื่อยืนยันประวัติเข้าระบบ";
        }
        return;
      }

      try {
        if (!supabaseClient) throw new Error("Supabase client is not connected");
        const { error } = await supabaseClient.from("reviews").insert([{
          author_name: author,
          location_detail: location || "ไม่ระบุโซน",
          rating_score: rating,
          review_body: reviewText,
          province_key: provinceKey,
          active_status: false
        }]);

        if (error) throw error;

        showToast("✅ ส่งรีวิวเสร็จสิ้นแล้ว! ข้อมูลของคุณกำลังรอผู้ดูแลอนุมัติตรวจสอบครับ", "success");
        form.reset();
      } catch (err) {
        console.error("Submission failed:", err);
        showToast("✅ ส่งรีวิวสำเร็จเรียบร้อยแล้ว ขอบคุณที่ร่วมแบ่งปันประสบการณ์ครับ!", "success");
        form.reset();
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
          items.forEach(i => {
            i.classList.add("collapsed");
            const btn = i.querySelector(".rule-trigger");
            if (btn) btn.setAttribute("aria-expanded", "false");
          });
          if (isCollapsed) {
            item.classList.remove("collapsed");
            trigger.setAttribute("aria-expanded", "true");
          }
        });
      }
    });
  }

  function initPwaInstaller() {
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
        box-shadow: 0 10px 30px rgba(0,0,0,0.8); backdrop-filter: blur(15px); z-index: 2900;
      `;

      banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="/images/apple-touch-icon.png" style="width: 38px; height: 38px; border-radius: 10px;" alt="First Model Hub App" onerror="this.src='${CONFIG.DEFAULT_OG_IMAGE}'">
          <div>
            <div style="font-size: 12px; font-weight: 800; color: #FFF;">ติดตั้งแอป First Model Hub</div>
            <div style="font-size: 12px; color: #A1A1AA;">เข้าใช้งานรวดเร็ว ไม่ต้องค้นหาบน Google</div>
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
      "🔢 ค้นรหัส ID เช่น 127, 143, 154...",
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
    } catch (e) {
      console.warn("⚠️ Local storage update failed:", e);
    }

    if (window.supabase) {
      try {
        const rpcName = isLiked ? "increment_likes" : "decrement_likes";
        await window.supabase.rpc(rpcName, { profile_id_to_update: profileId });
      } catch (e) {
        console.warn("🔌 Like RPC notice:", e);
      }
    }

    setTimeout(() => { isLikeProcessing = false; }, 300);
  };

  window.selectSuggestion = (slug, isProfile = false) => {
    const suggestionsEl = document.getElementById("search-suggestions");
    const inputEl = document.getElementById("modal-search-keyword") || document.getElementById("search-keyword");

    if (isProfile) {
      suggestionsEl?.classList.add("hidden");
      if (inputEl) inputEl.value = "";
      history.pushState(null, "", `/sideline/${encodeURIComponent(slug)}`);
      handleRouteNavigation();
    } else if (inputEl) {
      inputEl.value = slug;
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      saveRecentSearch(slug);
      applyUltimateFilters(true, true);
      suggestionsEl?.classList.add("hidden");
    }
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
    
    setTimeout(() => {
      scrollToSearchResults();
    }, 100);
  };

  /* ==============================================================================
     🚀 MAIN DOM INITIALIZATION
     ============================================================================== */
  document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 แอปพลิเคชัน First Model Hub กำลังเริ่มต้นทำงาน...");

    try {
      supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
      window.supabase = supabaseClient;
    } catch (e) {
      console.error("❌ เชื่อมต่อ Supabase DB ล้มเหลว:", e);
    }

    DOM.body = document.body;
    DOM.loadingPlaceholder = document.getElementById("loading-profiles-placeholder");
    DOM.profilesDisplayArea = document.getElementById("profiles-display-area");
    DOM.noResultsMessage = document.getElementById("no-results-message");
    DOM.fetchErrorMessage = document.getElementById("fetch-error-message");
    DOM.searchForm = document.getElementById("search-form");
    DOM.searchInput = document.getElementById("search-keyword");
    DOM.provinceSelect = document.getElementById("search-province");
    DOM.availabilitySelect = document.getElementById("search-availability");
    DOM.featuredSelect = document.getElementById("search-featured");
    DOM.sortSelect = document.getElementById("sort-select");
    DOM.resetSearchBtn = document.getElementById("reset-search-btn");
    DOM.featuredSection = document.getElementById("featured-profiles");
    DOM.featuredContainer = document.getElementById("featured-profiles-container");

    // Sidebar Mobile
    (function initMobileSidebar() {
      const toggleBtn = document.getElementById("menu-toggle");
      const sidebar = document.getElementById("sidebar-menu");
      const overlay = document.getElementById("sidebar-overlay");
      const closeBtn = document.getElementById("close-menu-btn");
      if (!toggleBtn || !sidebar) return;

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
    })();

    // Delegation Clicks
    document.body.addEventListener("click", e => {
      const target = e.target;

      // 1. ระบบกด Like
      const likeBtn = target.closest('[data-action="like"]');
      if (likeBtn) {
        e.preventDefault(); e.stopPropagation();
        const id = likeBtn.dataset.id;
        if (id && typeof window.handleLikeClick === "function") window.handleLikeClick(likeBtn, id);
        return;
      }

      // 2. ระบบกด Search Suggestion
      const suggestionItem = target.closest('[data-action="suggestion"]');
      if (suggestionItem) {
        const slug = suggestionItem.dataset.slug;
        const isProfile = suggestionItem.dataset.isProfile === "true";
        if (slug) window.selectSuggestion(slug, isProfile);
        return;
      }

      // 3. ระบบกดเข้าดูโปรไฟล์
      const cardLink = target.closest("a.card-link");
      if (cardLink) {
        e.preventDefault();
        const card = cardLink.closest(".profile-card-new, .vip-card-item");
        let rawSlug = card ? card.getAttribute("data-profile-slug") : null;
        if (rawSlug) {
          try { rawSlug = decodeURIComponent(rawSlug); } catch (err) {}
          STATE.lastFocusedElement = cardLink;
          history.pushState(null, "", `/sideline/${encodeURIComponent(rawSlug)}`);
          handleRouteNavigation();
        }
        return;
      }

      // 4. ปุ่มปิด Lightbox
      const closeBtn = target.closest("#closeLightboxBtn");
      const lightboxModal = target.closest("#lightbox");
      if (closeBtn || (lightboxModal && e.target === lightboxModal)) {
        closeLightboxModal(true);
        return;
      }

      // 5.1 คลิกเลือกจังหวัดใน Modal
      if (target.closest('.province-chip')) {
        const btn = target.closest('.province-chip');
        document.querySelectorAll('.province-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (DOM.provinceSelect) {
          DOM.provinceSelect.value = btn.getAttribute('data-value') || '';
          DOM.provinceSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      // 5.2 คลิกเลือกสถานะ (Avail) ใน Modal
      if (target.closest('.avail-chip')) {
        const btn = target.closest('.avail-chip');
        document.querySelectorAll('.avail-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (DOM.availabilitySelect) {
          DOM.availabilitySelect.value = btn.getAttribute('data-value') || '';
          DOM.availabilitySelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      // 5.3 คลิกเลือกราคา ใน Modal
      if (target.closest('.price-chip')) {
        const btn = target.closest('.price-chip');
        document.querySelectorAll('.price-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const hiddenPrice = document.getElementById("search-price");
        if (hiddenPrice) {
          hiddenPrice.value = btn.getAttribute('data-price') || '';
          applyUltimateFilters(true, true);
        }
      }

      // 5.4 คลิกเลือกแท็ก ใน Modal
      if (target.closest('.tag-chip')) {
        const btn = target.closest('.tag-chip');
        document.querySelectorAll('.tag-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tagText = btn.getAttribute('data-tag') || '';
        
        const modalInput = document.getElementById('modal-search-keyword');
        if (modalInput) modalInput.value = tagText;
        
        const inlineInput = document.getElementById("inline-search-input");
        if (inlineInput) inlineInput.value = tagText;

        if (DOM.searchInput) {
          DOM.searchInput.value = tagText;
          DOM.searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      // 5.5 คลิกเรียงลำดับ (Sort) ใน Modal
      if (target.closest('.sort-chip')) {
        const btn = target.closest('.sort-chip');
        document.querySelectorAll('.sort-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (DOM.sortSelect) DOM.sortSelect.value = btn.getAttribute('data-sort') || 'featured';
        if (DOM.featuredSelect) {
          DOM.featuredSelect.value = btn.getAttribute('data-featured') || '';
          DOM.featuredSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });

    // Reset Buttons
    const modalResetBtn = document.getElementById('modal-reset-btn');
    if (modalResetBtn) {
      modalResetBtn.onclick = () => {
        document.querySelector('#modal-province-chips .province-chip[data-value=""]')?.click();
        document.querySelector('#modal-availability-chips .avail-chip[data-value=""]')?.click();
        document.querySelector('#modal-sort-chips .sort-chip[data-sort="featured"]')?.click();
        document.querySelector('#modal-price-chips .price-chip[data-price=""]')?.click();

        document.querySelectorAll('#modal-tag-chips .tag-chip').forEach(b => b.classList.remove('active'));

        const modalSearchInput = document.getElementById('modal-search-keyword');
        const inlineSearchInput = document.getElementById('inline-search-input');
        
        if (modalSearchInput) modalSearchInput.value = '';
        if (inlineSearchInput) inlineSearchInput.value = '';
        
        const clearTextBtn = document.getElementById('clear-modal-text-btn');
        if (clearTextBtn) clearTextBtn.style.display = 'none';
        
        DOM.resetSearchBtn?.click();
      };
    }

    DOM.provinceSelect?.addEventListener("change", () => {
      applyUltimateFilters(true, true);
      renderSmartFilterChips();
    });

    DOM.availabilitySelect?.addEventListener("change", () => applyUltimateFilters(true, true));
    DOM.featuredSelect?.addEventListener("change", () => applyUltimateFilters(true, true));
    DOM.sortSelect?.addEventListener("change", () => applyUltimateFilters(true, true));

    DOM.resetSearchBtn?.addEventListener("click", () => {
      if (DOM.searchInput) DOM.searchInput.value = "";
      if (DOM.provinceSelect) DOM.provinceSelect.value = "";
      if (DOM.availabilitySelect) DOM.availabilitySelect.value = "";
      if (DOM.featuredSelect) DOM.featuredSelect.value = "";
      if (DOM.sortSelect) DOM.sortSelect.value = "featured";
      
      const hiddenPriceSelect = document.getElementById("search-price");
      if (hiddenPriceSelect) hiddenPriceSelect.value = "";

      const clearBtn = document.getElementById("clear-search-btn");
      if (clearBtn) clearBtn.style.display = "none";

      applyUltimateFilters(true, true);
      renderSmartFilterChips();
    });

    // 🟢 6. ซิงค์ช่องค้นหาและเพิ่ม Debounce (200ms) เพื่อความลื่นไหลสูงสุด
    const modalSearchInput = document.getElementById("modal-search-keyword");
    const inlineSearchInput = document.getElementById("inline-search-input");
    const clearTextBtn = document.getElementById("clear-modal-text-btn");

    const triggerDebouncedSearch = (val) => {
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        if (DOM.searchInput) DOM.searchInput.value = val;
        applyUltimateFilters(true, true);
      }, 200);
    };

    if (modalSearchInput) {
      modalSearchInput.addEventListener("input", (e) => {
        const val = e.target.value;
        if (inlineSearchInput) inlineSearchInput.value = val;
        if (clearTextBtn) clearTextBtn.style.display = val.length > 0 ? "block" : "none";
        triggerDebouncedSearch(val);
      });
      
      modalSearchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          applyUltimateFilters(true, true);
          closeFilterModal();
        }
      });

      if (clearTextBtn) {
        clearTextBtn.addEventListener("click", () => {
          modalSearchInput.value = "";
          if (DOM.searchInput) DOM.searchInput.value = "";
          if (inlineSearchInput) inlineSearchInput.value = "";
          clearTextBtn.style.display = "none";
          applyUltimateFilters(true, true);
        });
      }
    }

    if (inlineSearchInput) {
      inlineSearchInput.addEventListener("input", (e) => {
        const val = e.target.value;
        if (modalSearchInput) modalSearchInput.value = val;
        triggerDebouncedSearch(val);
      });
      
      inlineSearchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          applyUltimateFilters(true, true);
          scrollToSearchResults();
        }
      });
    }

    const modalApplyBtn = document.getElementById('modal-apply-btn');
    if (modalApplyBtn) {
      modalApplyBtn.onclick = () => {
        applyUltimateFilters(true, true);
        closeFilterModal();
      };
    }

    // Init Page Features
    initThemeToggle();
    initStarRating();
    initReviewForm();
    initReviewToggle();
    initAccordions();
    renderSmartFilterChips();
    initSeoDrawer();
    initRegionTabs();
    initPwaInstaller();
    initDynamicSearchPlaceholder();

    // 🟢 10. ระบบซ่อนเมนูลอยเมื่อไถลง และโชว์อัตโนมัติเมื่อจอนิ่ง (400ms)
    let lastScrollY = window.scrollY;
    let scrollTimeout = null;
    const dockMenu = document.querySelector('.floating-app-dock');
    
    window.addEventListener('scroll', () => {
      if (!dockMenu) return;
      const currentScrollY = window.scrollY;
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        dockMenu.classList.add('dock-hidden');
      } else {
        dockMenu.classList.remove('dock-hidden');
      }
      
      lastScrollY = currentScrollY;

      scrollTimeout = setTimeout(() => {
        dockMenu.classList.remove('dock-hidden');
      }, 400);
      
    }, { passive: true });

    await fetchProfilesData();
    await handleRouteNavigation(true);
    updateActiveNavLinks();
    hideGlobalLoader();

    window.addEventListener("popstate", async () => {
      await handleRouteNavigation(false);
      updateActiveNavLinks();
    });

  });

})();
