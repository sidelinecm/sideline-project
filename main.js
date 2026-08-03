

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs";

gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

(function () {
  "use strict";

  const CONFIG = {
    SUPABASE_URL: "https://zxetzqwjaiumqhrpumln.supabase.co",
    SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
    STORAGE_BUCKET: "profile-images",
    ENABLE_REALTIME: false,
    KEYS: {
      LAST_PROVINCE: "firstmodelhub_last_province",
      CACHE_PROFILES: "cachedProfiles_v3_2026",
      CACHE_PROVINCES: "cachedProvinces_v3_2026",
      LAST_SYNC: "data_last_sync_timestamp_v3_2026",
      LAST_FETCH: "lastFetchTime",
      AGE_CONFIRMED: "ageConfirmedTimestamp",
      THEME: "theme",
      LIKED_PROFILES: "liked_profiles"
    },
    SITE_URL: "https://firstmodelhub.com",
    DEFAULT_OG_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp"
  };

  const LOCALIZED_SEO_MAP = {
    chiangmai: {
      zones: ["ทั้งหมด", "นิมมาน", "สันติธรรม", "เจ็ดยอด", "หลัง มช.", "ช้างเผือก", "สันทราย", "ห้วยแก้ว"],
      seoContent: `
        <p>ยินดีต้อนรับสู่ <strong>First Model Hub เชียงใหม่</strong> แหล่งรวมโปรไฟล์ <strong>สาวรับงานเชียงใหม่</strong>, <strong>เด็กเอ็นเชียงใหม่</strong> และ <strong>เพื่อนเที่ยวไซด์ไลน์เชียงใหม่</strong> ระดับพรีเมียม การันตีรูปตรงปก 100% ปลอดภัย จ่ายค่าขนมหน้างานเมื่อพบตัวจริง ปราศจากการโอนเงินจองมัดจำล่วงหน้าทุกกรณี</p>
        <p>เพื่อความสะดวกในการนัดหมาย น้องๆ ในระบบสแตนด์บายพร้อมดูแลครอบคลุมทุกทำเลยอดนิยมทั่วเมืองเชียงใหม่ ไม่ว่าจะเป็น <strong>ย่านนิมมานเหมินท์, สันติธรรม, คอนโดรอบเจ็ดยอด, โซนหลัง มช., ถนนช้างเผือก, สันทราย, ห้วยแก้ว</strong> และบริเวณใกล้สนามบินเชียงใหม่ เดินทางสะดวก ปลอดภัย และเป็นส่วนตัวสูง</p>
        <p>น้องๆ ทุกคนผ่านการตรวจสอบตัวตน (Verified 2026) พร้อมให้บริการเอนเตอร์เทนดูแลเอาใจใส่สไตล์ฟิวแฟน (Girlfriend Experience - GFE) อย่างสุภาพเรียบร้อย เป็นกันเอง ให้คุณผ่อนคลายและคลายเหงาได้อย่างสบายใจที่สุด</p>
      `,
      reviews: [
        { author: "คุณชลสิทธิ์ (C.)", location: "ย่านนิมมาน เชียงใหม่", rating: 5, text: "นัดเจอน้องแถวย่านนิมมาน เชียงใหม่ เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบ First Model Hub ไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับ", date: "เมื่อสัปดาห์ที่แล้ว" },
        { author: "คุณอภิชาติ (A.)", location: "โซนยอดนิยม นิมมาน เชียงใหม่", rating: 5, text: "น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยมเสมือนมีเพื่อนร่วมทางคนพิเศษคอยเคียงข้าง ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ", date: "เมื่อ 2 สัปดาห์ก่อน" },
        { author: "คุณภัทร (P.)", location: "โซนเจ็ดยอด-หลัง มช.", rating: 5, text: "นัดเจอน้องแถวเจ็ดยอด คุยง่าย ตรงปก ไม่ต้องโอนมัดจำก่อน เจอตัวจริงค่อยจ่ายเงิน สบายใจมากๆ ครับ", date: "เมื่อ 3 วันก่อน" }
      ],
      faqs: [
        { q: "นัดหมายสาวรับงานเชียงใหม่ ย่านนิมมาน หรือ สันติธรรม มีค่าเดินทางเพิ่มไหม?", a: "หากเป็นพิกัดในเขตตัวเมืองเชียงใหม่ เช่น นิมมานเหมินท์, สันติธรรม, เจ็ดยอด, ช้างเผือก หรือโซนหลัง มช. จะไม่มีค่าเดินทางเพิ่มเติมครับ ชำระเฉพาะค่าบริการตามตกลงตรงหน้างานได้เลย" },
        { q: "การเรียกใช้บริการรับงานเชียงใหม่ ต้องโอนมัดจำล่วงหน้าหรือไม่?", a: "ไม่มีนโยบายโอนมัดจำล่วงหน้าทุกกรณีครับ เราใช้นโยบาย 'เจอตัวจริงค่อยชำระเงินโดยตรงหน้างาน' ป้องกันความเสี่ยงทางการเงิน 100%" }
      ]
    },
    bangkok: {
      zones: ["ทั้งหมด", "สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานกรุงเทพ</strong> และ <strong>ไซด์ไลน์ กทม</strong> ระดับพรีเมียม การันตีตรงปก 100% ปลอดภัยนัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมพิกัด <strong>สุขุมวิท, รัชดา, ห้วยขวาง, ลาดพร้าว, ทองหล่อ และเอกมัย</strong></p>`,
      reviews: [
        { author: "คุณเอก (E.)", location: "ย่านสุขุมวิท กรุงเทพฯ", rating: 5, text: "นัดเจอน้องย่านสุขุมวิท ตรงปกมากครับ อัธยาศัยดี นัดเจอจ่ายหน้างานปลอดภัย 100% ประทับใจมากครับ", date: "เมื่อสัปดาห์ที่แล้ว" }
      ],
      faqs: [
        { q: "สาวรับงานกรุงเทพฯ ครอบคลุมโซนไหนบ้าง?", a: "ครอบคลุมทุกโซนหลักใน กทม. เช่น สุขุมวิท รัชดา ห้วยขวาง ลาดพร้าว ทองหล่อ และเอกมัย นัดเจอง่ายเดินทางสะดวกครับ" }
      ]
    },
    chonburi: {
      zones: ["ทั้งหมด", "พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี"],
      seoContent: `<p>ศูนย์รวมสาวรับงานชลบุรี รับงานพัทยา และเพื่อนเที่ยวบางแสน พรีเมียมดูแลใส่ใจสไตล์ฟิวแฟน ปลอดภัยสูงสุดชำระค่าบริการหน้างานเมื่อเจอตัวจริง ไม่มัดจำล่วงหน้า</p>`,
      reviews: [
        { author: "คุณเบนซ์ (B.)", location: "พัทยา ชลบุรี", rating: 5, text: "นัดเจอน้องโซนพัทยา ตรงปก บริการดีมาก นัดเจอชำระหน้างานไม่มีโอนมัดจำ ประทับใจครับ", date: "เมื่อ 4 วันก่อน" }
      ],
      faqs: [
        { q: "นัดน้องๆ รับงานพัทยา บางแสน จ่ายเงินอย่างไร?", a: "ชำระค่าขนมกับน้องโดยตรงหน้างานเมื่อนัดเจอตัวจริงเรียบร้อยแล้ว ไม่มีการโอนเงินมัดจำก่อนทุกกรณีครับ" }
      ]
    },
    udon: {
      zones: ["ทั้งหมด", "ตัวเมืองอุดร", "UD Town", "หนองประจักษ์"],
      seoContent: `<p>ศูนย์รวมสาวรับงานอุดรธานี และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัยจ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมตัวเมืองอุดร UD Town</p>`,
      reviews: [
        { author: "คุณกอล์ฟ (G.)", location: "ตัวเมืองอุดรธานี", rating: 5, text: "ตรงปกครับ บริการดี สุภาพ นัดเจอจ่ายหน้างาน ไม่มีโอนมัดจำก่อน ปลอดภัยแน่นอนครับ", date: "เมื่อ 3 วันที่แล้ว" }
      ],
      faqs: []
    },
    national: {
      zones: ["ทั้งหมด", "กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "อุดรธานี", "ขอนแก่น"],
      seoContent: `<p>ยินดีต้อนรับสู่ <strong>First Model Hub</strong> แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ <strong>สาวรับงานทั่วไทย</strong>, <strong>เด็กเอ็นทั่วไทย</strong> และ <strong>เพื่อนเที่ยวไซด์ไลน์ทั่วไทย</strong> แหล่งรวบรวมโปรไฟล์ผู้ดูแลระดับพรีเมียมที่เน้นความโปร่งใส ปลอดภัย ปราศจากเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี</p>`,
      reviews: [
        { author: "คุณเกริกพล (K.)", location: "ตัวเมือง", rating: 5, text: "บริการดีตรงปก เจอตัวจริงค่อยจ่ายเงิน สบายใจมากครับ", date: "เมื่อสัปดาห์ที่แล้ว" }
      ],
      faqs: [
        { q: "เรียกใช้บริการ First Model Hub ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่ต้องโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ ลูกค้าตกลงชำระค่าบริการหน้างานเมื่อเจอน้องตัวจริงตรงปกแล้วเท่านั้น" }
      ]
    }
  };

  let STATE = {
    allProfiles: [],
    provincesMap: new Map(),
    currentProfileSlug: null,
    lastFocusedElement: null,
    isFetching: false,
    lastFetchedAt: "1970-01-01T00:00:00Z",
    cleanupFunctions: [],
    currentFilters: null,
    filteredProfiles: [],
    renderId: 0
  };

  const DOM = {};
  let supabaseClient = null;
  let fuseInstance = null;
  let isLikeProcessing = false;
  let isFirstLoad = true;

  const DEFAULT_SEO = {
    title: "สาวรับงาน ไซด์ไลน์ เด็กเอ็น เพื่อนเที่ยวฟิวแฟน ตรงปกทั่วไทย 2026 | First Model Hub",
    description: "ศูนย์รวมสาวรับงาน ไซด์ไลน์ เด็กเอ็น ฟิวแฟน และเพื่อนเที่ยวพรีเมียมทั่วไทย คัดสรรโปรไฟล์ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ",
    keywords: "รับงาน, สาวรับงาน, เพื่อนเที่ยว, ไซด์ไลน์, เด็กเอ็น, ผู้ดูแลพรีเมียม, ไม่มัดจำ",
    canonical: "https://firstmodelhub.com/",
    ogImage: "https://firstmodelhub.com/images/firstmodelhub.webp"
  };

  function sanitizeName(rawName) {
    if (!rawName || typeof rawName !== "string") return "";
    let cleaned = rawName.trim().replace(/^(น้อง\s?)+/gi, "");
    cleaned = cleaned.toLowerCase();
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return `น้อง${cleaned}`;
  }

  function runIdle(fn, delay = 0) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => fn());
    } else {
      setTimeout(fn, delay);
    }
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
    const bust = raw.bust || raw.breast;
    const waist = raw.waist;
    const hips = raw.hip || raw.hips;
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

    const sloganText = raw.slogan || raw.quote || raw.tagline || "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน";
    const rawTags = raw.style_tags || raw.styleTags || raw.tags || [];
    const styleTags = Array.isArray(rawTags) ? rawTags : (typeof rawTags === "string" ? rawTags.split(",").map(t => t.trim()) : []);

    const availStatus = raw.availability || raw.status || "รับงาน";
    const isBusy = ["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "off", "busy"].some(keyword => availStatus.toLowerCase().includes(keyword));
    const isAvailable = !isBusy;

    const lineIdClean = (raw.line_id || raw.lineId || raw.line || "").toString().replace(/^@/, "").trim();

    const searchString = `
      ${formattedName} ${raw.id || ""} ${provinceThaiName} ${raw.location || ""} ${raw.district || ""}
      ${styleTags.join(" ")} ${raw.description || ""} ${sloganText} ${statsFormatted} ${safeSkin}
      ${cleanAge ? cleanAge + "ปี" : ""} ${displayPrice} ${availStatus}
    `.toLowerCase().replace(/\s+/g, " ").trim();

    return {
      ...raw,
      displayName: formattedName,
      images: images,
      provinceNameThai: provinceThaiName,
      provinceKey: provKey,
      displayPrice: displayPrice,
      _price: numericRate,
      searchString: searchString,
      
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
        console.log("⚡ [Hydration] โหลดสเปกรายชื่อโปรไฟล์สำเร็จจาก SSR!");
        
        const cachedProv = localStorage.getItem(CONFIG.KEYS.CACHE_PROVINCES);
        if (cachedProv) {
          try {
            const parsed = JSON.parse(cachedProv);
            STATE.provincesMap.clear();
            if (Array.isArray(parsed)) {
              parsed.forEach(p => p && p.key && p.name && STATE.provincesMap.set(p.key.toString(), p.name));
            }
          } catch (e) {
            console.warn("⚠️ Local cached provinces parsing failed", e);
          }
        }

        STATE.allProfiles = window.profilesData.map(p => processProfileObject(p)).filter(Boolean);
        populateProvinceDropdown();
        buildFuseIndex();
        applyUltimateFilters(false);
        updateHeroSwiperCards();
        STATE.isFetching = false;
        return true;
      }

      console.log("🔄 ตรวจสอบอัปเดตข้อมูล Supabase ผ่าน 'lastUpdated'...");
      const { data: latestRow, error: checkErr } = await supabaseClient
        .from("profiles")
        .select("lastUpdated")
        .order("lastUpdated", { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();

      if (checkErr) throw checkErr;

      const latestTimestamp = latestRow?.lastUpdated ? new Date(latestRow.lastUpdated).getTime().toString() : "0";
      const cachedSync = localStorage.getItem(CONFIG.KEYS.LAST_SYNC);
      const cachedProfilesRaw = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
      const cachedProvincesRaw = localStorage.getItem(CONFIG.KEYS.CACHE_PROVINCES);

      if (cachedSync === latestTimestamp && cachedProfilesRaw && cachedProvincesRaw) {
        console.log("✅ ข้อมูลเป็นปัจจุบัน ดึงจาก Local Storage Cache");
        STATE.allProfiles = JSON.parse(cachedProfilesRaw);
        const provincesArray = JSON.parse(cachedProvincesRaw);
        STATE.provincesMap.clear();
        provincesArray.forEach(p => STATE.provincesMap.set(p.key.toString(), p.name));
        populateProvinceDropdown();
        buildFuseIndex();
        applyUltimateFilters(false);
        updateHeroSwiperCards();
        STATE.isFetching = false;
        return true;
      }

      console.log("🚀 ข้อมูลสดถูกแก้ไข! กำลังดึงข้อมูลใหม่จากฐานข้อมูล...");
      const [provincesRes, profilesRes] = await Promise.all([
        supabaseClient.from("provinces").select("*"),
        supabaseClient.from("profiles").select("*").eq("active", true).order("isfeatured", { ascending: false }).order("created_at", { ascending: false })
      ]);

      if (provincesRes.error) throw provincesRes.error;
      if (profilesRes.error) throw profilesRes.error;

      STATE.provincesMap.clear();
      const provincesCacheArr = [];
      (provincesRes.data || []).forEach(p => {
        const name = p.nameThai || p.name_thai || p.name;
        let key = (p.key || p.slug || p.id).toString().toLowerCase();
        if (key === "chiang_mai") key = "chiangmai";
        if (key && name) {
          STATE.provincesMap.set(key, name);
          provincesCacheArr.push({ key: key, name: name });
        }
      });

      const rawProfiles = profilesRes.data || [];
      STATE.allProfiles = rawProfiles.map(p => processProfileObject(p)).filter(Boolean);

      try {
        saveCacheToLocalStorage(CONFIG.KEYS.CACHE_PROFILES, STATE.allProfiles);
        saveCacheToLocalStorage(CONFIG.KEYS.CACHE_PROVINCES, provincesCacheArr);
        localStorage.setItem(CONFIG.KEYS.LAST_SYNC, latestTimestamp);
        console.log("💾 บันทึกแคช Local Storage เรียบร้อยแล้ว");
      } catch (e) {
        console.warn("⚠️ บันทึกแคชขัดข้อง:", e);
      }

      populateProvinceDropdown();
      buildFuseIndex();
      applyUltimateFilters(false);
      updateHeroSwiperCards();
      return true;

    } catch (err) {
      console.error("❌ โหลดข้อมูลล้มเหลว:", err);
      const fallbackRaw = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
      if (fallbackRaw) {
        STATE.allProfiles = JSON.parse(fallbackRaw);
        populateProvinceDropdown();
        buildFuseIndex();
        applyUltimateFilters(false);
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
      const rankBadge = `<span class="hot-rank-badge"><i class="fas fa-crown"></i> ${rankText}</span>`;
      const realLocation = p.location || p.provinceNameThai || "เชียงใหม่";
      const pSlug = encodeURIComponent(p.slug || p.id);

      return `
        <div class="vip-card-item ${idx === 0 ? 'active-glow' : ''}" data-profile-id="${p.id}" data-profile-slug="${pSlug}">
          ${rankBadge}
          <img src="${p.images[0]?.src || CONFIG.DEFAULT_OG_IMAGE}" alt="${p.displayName}" loading="${idx < 2 ? 'eager' : 'lazy'}" onerror="this.src='${CONFIG.DEFAULT_OG_IMAGE}'">
          <div class="vip-card-overlay"></div>
          <span class="vip-status-chip">🟢 ${p.availability || 'พร้อมรับงาน'}</span>
          
          <!-- 🟢 เพิ่มแท็กลิงก์คลิกตรงนี้ -->
          <a href="/sideline/${pSlug}" class="card-link" style="position: absolute; inset: 0; z-index: 25;" aria-label="ดูโปรไฟล์${p.displayName}"></a>

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
    while (DOM.provinceSelect.options.length > 1) {
      DOM.provinceSelect.remove(1);
    }
    const sortedProvinces = Array.from(STATE.provincesMap.entries()).sort((a, b) => a[1].localeCompare(b[1], "th"));
    const fragment = document.createDocumentFragment();

    sortedProvinces.forEach(([key, name]) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = name;
      fragment.appendChild(opt);
    });
    DOM.provinceSelect.appendChild(fragment);
  }

  function createProfileCardElement(profile, index = 20) {
    const container = document.createElement("div");
    container.className = "profile-card-new-container";

    const card = document.createElement("div");
    card.className = "profile-card-new interactive-card";
    card.setAttribute("data-profile-id", profile.id);
    card.setAttribute("data-profile-slug", profile.slug || profile.id);

    const imageSrc = profile.images && profile.images.length > 0 ? profile.images[0].src : CONFIG.DEFAULT_OG_IMAGE;
    const currentProvName = profile.provinceNameThai || "เชียงใหม่";
    const nameClean = sanitizeName(profile.displayName || profile.name);
    const seoAltText = `${nameClean} สาวรับงาน${currentProvName} ไซด์ไลน์${currentProvName} ฟิวแฟนตรงปก 100%`;

    const isAvailable = profile.status === "รับงาน" || !(profile.availability || "").toLowerCase().includes("ไม่ว่าง");
    const statusDotColor = isAvailable ? "#00E676" : "#FF2E63";
    const statusText = profile.availability || (isAvailable ? "รับงาน" : "สอบถามคิว");
    const ageDisplay = profile.safeAge && profile.safeAge !== "-" ? ` ${profile.safeAge}` : "";

    const featuredBadge = profile.isfeatured
      ? `<span style="background: rgba(90, 44, 190, 0.88); border: 1px solid rgba(192, 132, 252, 0.5); color: #FFFFFF; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-star" style="font-size: 6.5px; color: #FBBF24;"></i>
          <span style="letter-spacing: 0.02em;">แนะนำ</span>
         </span>`
      : "";

    const statusBadge = `
      <span style="background: rgba(9, 9, 11, 0.82); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <span style="width: 5px; height: 5px; border-radius: 50%; background-color: ${statusDotColor}; box-shadow: 0 0 6px ${statusDotColor}; flex-shrink: 0;"></span>
          <span style="letter-spacing: 0.02em;">${statusText}</span>
      </span>
    `;

    const videoBadge = profile.hasVideo
      ? `<span style="background: rgba(255, 46, 99, 0.35); border: 1px solid rgba(255, 46, 99, 0.6); color: #FF2E63; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-video" style="font-size: 6.5px;"></i> คลิป
         </span>`
      : "";

    const verifiedBadge = (profile.isVerified || profile.verified)
      ? `<span style="background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(52, 211, 153, 0.55); color: #00E676; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-check-circle" style="font-size: 7.5px; color: #00E676;"></i> ยืนยันตัวตน
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

      <div style="position: absolute; top: 6px; right: 6px; z-index: 30; pointer-events: none; display: flex; align-items: center;">
          ${verifiedBadge}
      </div>
      
      <a href="/sideline/${encodedSlug}" class="card-link" style="position: absolute; inset: 0; z-index: 25;" aria-label="ดูโปรไฟล์${nameClean}"></a>

      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 6px 10px 8px 10px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 1px;">
          <h3 style="font-size: 13.5px; font-weight: 800; color: white; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 4px rgba(0,0,0,0.95);">
            ${nameClean}${ageDisplay}
          </h3>
          
          ${(profile.slogan || profile.quote) ? `<p style="font-size: 10px; color: #C084FC; font-weight: 600; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">${profile.slogan || profile.quote}</p>` : ''}
          
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px; color: #D4D4D8; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 3px; margin-top: 2px;">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">
                  <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 2px;"></i> ${profile.location || currentProvName}
              </span>
              <span style="color: #00E676; font-weight: 900; font-size: 12px; text-shadow: 0 1.5px 3px rgba(0,0,0,0.95);">
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
        if (profiles.length > 40) {
          await new Promise(res => setTimeout(res, 10));
        }
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

  function buildFuseIndex() {
    if (!DOM.searchForm) return;

    const fuseOptions = {
      includeScore: true,
      threshold: 0.3,
      ignoreLocation: true,
      useExtendedSearch: true,
      keys: [
        { name: "searchString", weight: 1.0 },
        { name: "name", weight: 0.8 },
        { name: "englishName", weight: 0.8 },
        { name: "id", weight: 0.9 },
        { name: "provinceNameThai", weight: 0.5 },
        { name: "styleTags", weight: 0.4 }
      ]
    };

    if (STATE.allProfiles && STATE.allProfiles.length > 0) {
      fuseInstance = new Fuse(STATE.allProfiles, fuseOptions);
    }
  }

  function applyUltimateFilters(updateUrlHistory = true) {
    try {
      const activeFilters = {
        text: (DOM.searchInput?.value || "").trim(),
        province: DOM.provinceSelect?.value || "all",
        avail: DOM.availabilitySelect?.value || "all",
        featured: DOM.featuredSelect?.value === "true",
        sort: DOM.sortSelect?.value || "featured"
      };

      if (activeFilters.text) saveRecentSearch(activeFilters.text);

      if (activeFilters.text && STATE.provincesMap) {
        for (const [key, name] of STATE.provincesMap.entries()) {
          const inputLower = activeFilters.text.toLowerCase().trim();
          const nameLower = name.toLowerCase().trim();
          if (inputLower === nameLower || nameLower.includes(inputLower) || inputLower.includes(nameLower)) {
            activeFilters.province = key;
            activeFilters.text = "";
            if (DOM.searchInput) DOM.searchInput.value = "";
            if (DOM.provinceSelect) DOM.provinceSelect.value = key;
            break;
          }
        }
      }

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
        const searchText = activeFilters.text.toLowerCase().trim();
        let idMatched = false;

        if (/^\d+$/.test(searchText)) {
          const idMatches = results.filter(p => String(p.id) === searchText || (p.slug && p.slug.endsWith(`-${searchText}`)));
          if (idMatches.length > 0) {
            results = idMatches;
            idMatched = true;
          }
        }

        if (!idMatched) {
          if (fuseInstance) {
            results = fuseInstance.search(activeFilters.text, { limit: 500 }).map(res => res.item);
            if (targetProvinceKey) {
              results = results.filter(p => {
                const k = (p.provinceKey || p.province_slug || p.province || "").toString().toLowerCase();
                return targetProvinceKey === "chiangmai" ? (k === "chiangmai" || k === "chiang_mai") : k === targetProvinceKey;
              });
            }
          } else {
            results = results.filter(p => p.searchString?.includes(searchText) || p.name?.toLowerCase().includes(searchText));
          }
        }
      }

      if (activeFilters.avail && activeFilters.avail !== "all") {
        results = results.filter(p => p.availability === activeFilters.avail);
      }

      if (activeFilters.featured) {
        results = results.filter(p => p.isfeatured === true);
      }

      results.sort((a, b) => {
        switch (activeFilters.sort) {
          case "featured":
            return (b.isfeatured ? 1 : 0) - (a.isfeatured ? 1 : 0) || (a.name || "").localeCompare(b.name || "");
          case "name_asc":
            return (a.name || "").localeCompare(b.name || "");
          case "name_desc":
            return (b.name || "").localeCompare(a.name || "");
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });

      renderProfilesGrid(results, activeFilters.text || (activeFilters.province && activeFilters.province !== "all" && activeFilters.province !== "") || activeFilters.avail !== "all" || activeFilters.featured);

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

    } catch (e) {
      console.error("❌ เกิดข้อผิดพลาดในระบบการกรอง:", e);
    }
  }

  function renderProfilesGrid(profiles, isFilteredView) {
    if (!DOM.profilesDisplayArea) return;

    STATE.renderId = (STATE.renderId || 0) + 1;
    const currentRenderId = STATE.renderId;

    DOM.noResultsMessage?.classList.add("hidden");
    DOM.fetchErrorMessage?.classList.add("hidden");

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
      DOM.noResultsMessage?.classList.remove("hidden");
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

      appendProfilesToContainer(sectionWrapper.querySelector(".profile-grid"), profiles, currentRenderId);
      DOM.profilesDisplayArea.appendChild(sectionWrapper);

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
            const section = createProvinceSectionElement(key, name, grouped[key]);

            DOM.profilesDisplayArea.appendChild(section);

            const grid = section.querySelector(".profile-grid");
            await appendProfilesToContainer(grid, grouped[key], currentRenderId);
            await new Promise(res => setTimeout(res, 0));
          }
        })();
      } else {
        DOM.noResultsMessage?.classList.remove("hidden");
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

    if (clearBtn) clearBtn.classList.toggle("hidden", !query);
    if (!suggestionsContainer) return;

    if (!query) {
      const recentSearches = JSON.parse(localStorage.getItem("recent_searches") || "[]");
      if (recentSearches.length === 0) {
        suggestionsContainer.classList.add("hidden");
        return;
      }
      let html = '<div style="background-color: #121214; border: 1px solid rgba(147, 51, 234, 0.25); border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">';
      html += `
        <div style="padding: 8px 14px; background-color: #09090B; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">ค้นหาล่าสุด</span>
            <button data-action="clear-recent" style="background:none; border:none; color:#EF4444; font-size:10px; font-weight:700; cursor:pointer;">ล้างประวัติ</button>
        </div>
      `;
      recentSearches.forEach(item => {
        const cleanText = item.replace(/[<>]/g, "");
        const escapedText = item.replace(/'/g, "\\'");
        html += `
          <div data-action="suggestion" data-slug="${escapedText}" data-is-profile="false"
               style="padding: 10px 14px; cursor: pointer; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.03);">
              <i class="fas fa-history" style="color: var(--text-muted); font-size: 11px;"></i>
              <span style="font-size: 12px; color: #FFFFFF; font-weight: 600;">${cleanText}</span>
          </div>
        `;
      });
      html += '</div>';
      suggestionsContainer.innerHTML = html;
      suggestionsContainer.classList.remove("hidden");
      return;
    }

    if (!fuseInstance) return;
    const matches = fuseInstance.search(query).slice(0, 5);
    if (matches.length === 0) {
      suggestionsContainer.classList.add("hidden");
      return;
    }

    let html = `
      <div style="background-color: #121214; border: 1px solid rgba(147, 51, 234, 0.25); border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="padding: 8px 14px; background-color: #09090B; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <span style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">ผลลัพธ์ที่แนะนำ (${matches.length})</span>
          </div>
          <div style="display: flex; flex-direction: column;">
    `;

    matches.forEach(({ item }) => {
      const provName = STATE.provincesMap.get(item.provinceKey) || item.provinceNameThai || "";
      const isAvail = item.availability?.includes("ว่าง") || item.availability?.includes("รับงาน");
      const thumbImg = item.images && item.images[0] ? item.images[0].src : CONFIG.DEFAULT_OG_IMAGE;

      html += `
        <div class="suggestion-item" 
             data-action="suggestion"
             data-slug="${encodeURIComponent(item.slug || item.id)}"
             data-is-profile="true"
             style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.03);">
            <div style="position: relative; width: 36px; height: 36px; shrink: 0;">
                <img src="${thumbImg}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);" alt="รูปแนะคีย์เสิร์ช">
                <span style="position: absolute; bottom: 0; right: 0; width: 8px; height: 8px; background-color: ${isAvail ? "#00E676" : "#9CA3AF"}; border: 2px solid #121214; border-radius: 50%;"></span>
            </div>
            <div style="flex: 1; min-width: 0; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px;">
                    <div style="font-size: 12px; font-weight: 800; color: #FFFFFF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${item.displayName || item.name}</div>
                    ${item.age ? `<span style="font-size: 9px; background-color: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; color: var(--text-gray); font-weight: 700;">${item.age} ปี</span>` : ""}
                </div>
                <div style="display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                    <span style="font-size: 10px; color: var(--text-gray); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        <i class="fas fa-map-marker-alt" style="font-size: 9px; color: var(--primary-purple); margin-right: 4px;"></i> ${provName}
                    </span>
                </div>
            </div>
            <i class="fas fa-chevron-right" style="color: rgba(255,255,255,0.15); font-size: 10px;"></i>
        </div>
      `;
    });

    html += "</div>";
    html += `
      <div data-action="search-all" data-query="${query.replace(/'/g, "\\'")}" 
           style="padding: 10px; background-color: #09090B; text-align: center; cursor: pointer; border-top: 1px solid rgba(255,255,255,0.05);">
          <span style="font-size: 11px; font-weight: 800; color: var(--primary-purple);"><i class="fas fa-search" style="margin-right: 6px;"></i> ดูผลลัพธ์ทั้งหมด</span>
      </div>
    </div>`;

    suggestionsContainer.innerHTML = html;
    suggestionsContainer.classList.remove("hidden");
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
        <span class="text-gradient-main" style="font-size: 20px; font-weight: 800;">${nameClean}</span>
        ${profile.isVerified ? '<i class="fas fa-check-circle" style="color: #00E676; margin-left: 6px; font-size: 15px;" title="ยืนยันตัวตนแล้ว"></i>' : ""}
      `;
    }

    const badgeEl = document.getElementById("lightbox-availability-badge-wrapper");
    if (badgeEl) {
      badgeEl.innerHTML = `
        <span style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 4px 12px; border-radius: 100px; display: inline-flex; align-items: center; gap: 6px;">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: ${statusColor}; box-shadow: 0 0 8px ${statusColor}; flex-shrink: 0;"></span>
            <span style="color: white; font-size: 10.5px; font-weight: 700; letter-spacing: 0.02em;">${statusText}</span>
        </span>
      `;
    }

    const heroImg = document.getElementById("lightboxHeroImage");
    if (heroImg) {
      const hdSrc = profile?.images?.[0]?.fullSrc || profile?.images?.[0]?.src || profile?.imagePath || CONFIG.DEFAULT_OG_IMAGE;
      heroImg.src = hdSrc;
      heroImg.alt = `${nameClean} สาวรับงาน${profile.provinceNameThai || "เชียงใหม่"} ตัวจริงตรงปก`;
    }

    const strip = document.getElementById("lightboxThumbnailStrip");
    if (strip) {
      strip.innerHTML = "";
      if (profile.images && profile.images.length > 1) {
        profile.images.forEach((imgObj, idx) => {
          const thumb = document.createElement("img");
          thumb.src = imgObj.src;
          thumb.alt = `ภาพที่ ${idx + 1} ของ ${nameClean}`;
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
        span.style.cssText = "background: rgba(124, 58, 237, 0.12); border: 1px solid rgba(192, 132, 252, 0.3); color: #E9D5FF; font-size: 10px; padding: 3px 10px; border-radius: 100px; font-weight: 700;";
        span.textContent = tag.startsWith("#") ? tag : `#${tag}`;
        tagsEl.appendChild(span);
      });
    }

    let ageDisplay = "ไม่ระบุ";
    if (profile.safeAgeDisplay && profile.safeAgeDisplay !== "undefined" && !profile.safeAgeDisplay.includes("undefined")) {
      ageDisplay = profile.safeAgeDisplay;
    } else if (profile.age && profile.age !== "undefined" && profile.age !== "-") {
      ageDisplay = `${profile.age} ปี`;
    } else if (profile.safeAge && profile.safeAge !== "-" && profile.safeAge !== "undefined") {
      ageDisplay = `${profile.safeAge} ปี`;
    }

    const statsText = (profile.safeStats && profile.safeStats !== "undefined") ? profile.safeStats : "ไม่ระบุ";
    const heightText = (profile.safeHeight && profile.safeHeight !== "undefined") ? profile.safeHeight : "ไม่ระบุ";
    const skinText = (profile.safeSkin && profile.safeSkin !== "undefined") ? profile.safeSkin : "ไม่ระบุ";

    const detailsEl = document.getElementById("lightboxDetailsCompact");
    if (detailsEl) {
      detailsEl.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 100px; text-align: center;">
                <div style="font-size: 9px; color: #A1A1AA; font-weight: 600;">อายุ</div>
                <div style="font-weight: 800; font-size: 12px; color: ${ageDisplay === 'ไม่ระบุ' ? '#71717A' : '#FFFFFF'}; margin-top: 2px;">${ageDisplay}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 100px; text-align: center;">
                <div style="font-size: 9px; color: #A1A1AA; font-weight: 600;">สัดส่วน</div>
                <div style="font-weight: 800; font-size: 12px; color: ${statsText === 'ไม่ระบุ' ? '#71717A' : '#FFFFFF'}; margin-top: 2px;">${statsText}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 4px; border-radius: 100px; text-align: center;">
                <div style="font-size: 9px; color: #A1A1AA; font-weight: 600;">ส่วนสูง</div>
                <div style="font-weight: 800; font-size: 12px; color: ${heightText === 'ไม่ระบุ' ? '#71717A' : '#FFFFFF'}; margin-top: 2px;">${heightText}</div>
            </div>
        </div>

        <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #A1A1AA; font-size: 11px; font-weight: 600;">ค่าขนม</span>
                <span style="color: #00E676; font-weight: 900; font-size: 14px;">${profile.displayPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #A1A1AA; font-size: 11px; font-weight: 600;">พิกัดงาน</span>
                <span style="color: white; font-weight: 700; font-size: 11.5px;">${profile.location || profile.provinceNameThai || "เชียงใหม่"}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #A1A1AA; font-size: 11px; font-weight: 600;">สีผิว</span>
                <span style="color: ${skinText === 'ไม่ระบุ' ? '#71717A' : 'white'}; font-weight: 700; font-size: 11.5px;">${skinText}</span>
            </div>
        </div>
      `;
    }

    const descContainer = document.getElementById("lightboxDescriptionContainer");
    const descContent = document.getElementById("lightboxDescriptionContent");
    if (descContent) {
      const defaultDesc = `${nameClean} ยืนยันตัวตนตรงปก 100% พร้อมให้บริการเพื่อนเที่ยวฟิวแฟนในพิกัดย่าน ${profile.location || profile.provinceNameThai} ดูแลสุภาพ เรียบร้อย เป็นกันเอง สนใจสอบถามคิวงานได้เลยค่ะ`;
      descContent.innerHTML = (profile.description || defaultDesc).replace(/\n/g, "<br>");
    }
    if (descContainer) descContainer.style.display = "block";

    const detailsContainer = document.querySelector(".lightbox-details");
    if (detailsContainer) {
      detailsContainer.scrollTop = 0;
      
      const oldLineBtn = document.getElementById("line-btn-sticky-wrapper");
      if (oldLineBtn) oldLineBtn.remove();

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
           style="display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #11783B 0%, #00E676 100%); color: white; padding: 12px 18px; border-radius: 100px; font-weight: 800; font-size: 12.5px; text-decoration: none; box-shadow: 0 6px 20px rgba(0, 230, 118, 0.3); transition: transform 0.2s;"
           onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
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
      updateMetaTag("keywords", `${nameClean}, รับงาน${provName}, สาวรับงาน${provName}, ไซด์ไลน์${provName}, เพื่อนเที่ยว${provName}`);
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
          "price": (profile.rate || "0").toString().replace(/\D/g, ""),
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
      updateMetaTag("keywords", `รับงาน${provName}, สาวรับงาน${provName}, ไซด์ไลน์${provName}, เพื่อนเที่ยว${provName}`);
      updateLinkRel("canonical", canonicalUrl);

      updateOpenGraphAndTwitter(null, title, description, "website");

      if (locationData.profiles && locationData.profiles.length > 0) {
        injectJsonLdSchema({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `รายชื่อสาวรับงานและไซด์ไลน์ในจังหวัด ${provName}`,
          "description": description,
          "numberOfItems": locationData.profiles.length,
          "itemListElement": locationData.profiles.map((p, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
              "@type": "Person",
              "name": p.name,
              "url": `${CONFIG.SITE_URL}/sideline/${encodeURIComponent(p.slug || p.id)}`,
              "image": p.images && p.images.length > 0 ? p.images[0].src : CONFIG.DEFAULT_OG_IMAGE
            }
          }))
        }, "schema-jsonld-list");
      }
    }
  }

  function updateOpenGraphAndTwitter(profile, title, description, type) {
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:url", profile ? `${CONFIG.SITE_URL}/sideline/${encodeURIComponent(profile.slug || profile.id)}` : CONFIG.SITE_URL);
    updateMetaTag("og:type", type);
    updateMetaTag("og:locale", "th_TH");
    updateMetaTag("og:site_name", "First Model Hub");

    const img = profile && profile.images && profile.images[0] ? profile.images[0].src : CONFIG.DEFAULT_OG_IMAGE;
    updateMetaTag("og:image", img);
    updateMetaTag("og:image:secure_url", img);

    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", img);
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
          applyUltimateFilters(true);
        }
      });
    });
  }

  function updateDynamicProvinceContent(provKey = "chiangmai", provName = "เชียงใหม่", count = 50) {
    const data = LOCALIZED_SEO_MAP[provKey] || LOCALIZED_SEO_MAP["national"];

    // แผนที่แปลงชื่อจังหวัดเป็นภาษาอังกฤษสำหรับ SEO ต่างชาติ
    const ENG_PROV_MAP = {
      chiangmai: "Chiang Mai",
      bangkok: "Bangkok",
      chonburi: "Chonburi",
      udon: "Udon Thani",
      national: "Thailand"
    };
    const engProvName = ENG_PROV_MAP[provKey] || "Thailand";

    // 1. อัปเดต SEO H1
    const heroH1 = document.getElementById("hero-h1");
    if (heroH1) {
      heroH1.innerHTML = `
        <span class="seo-sub-headline">รับงาน${provName} • ไซด์ไลน์${provName}</span><br>
        <span class="seo-main-headline">สาวรับงาน ฟิวแฟนตรงปก 100%</span>
      `;
    }

    // 2. อัปเดตข้อความโซนใน Hero
    const heroSub = document.querySelector(".hero-subtitle-p");
    if (heroSub) {
      const currentZones = (data && data.zones && data.zones.length > 1) 
        ? data.zones.slice(1, 6) 
        : ["ตัวเมือง", "บริเวณใกล้เคียง"];
      heroSub.innerHTML = `
        ศูนย์รวมข้อมูลสารบัญผู้ดูแลระดับ VIP <strong>รับงาน${provName}</strong>, <strong>สาวรับงาน${provName}</strong>, <strong>เพื่อนเที่ยว${provName}</strong> ยืนยันตัวตนจริง 100% ปราศจากความเสี่ยงด้วยนโยบาย<strong>ไม่โอนเงินมัดจำล่วงหน้าทุกกรณี</strong> ครอบคลุมพิกัด <strong style="color: #C084FC;">${currentZones.join(", ")}</strong> ทั้งหมด
      `;
    }

    // 3. แก้ไขย่อหน้าเกริ่นนำบน SEO Drawer (แก้โซนขัดแย้งกัน)
    const drawerTitle = document.querySelector("#service-deep-dive h2");
    if (drawerTitle) drawerTitle.textContent = `บริการเพื่อนเที่ยวและสาวรับงาน${provName} ดูแลเอนเตอร์เทนระดับพรีเมียม (มากกว่า ${count}+ รายการ)`;

    const drawerIntroP = document.querySelector("#service-deep-dive .interactive-card p");
    if (drawerIntroP) {
      const currentZones = (data && data.zones && data.zones.length > 1) 
        ? data.zones.slice(1, 6).join(", ") 
        : "ตัวเมือง และพื้นที่ใกล้เคียง";
      drawerIntroP.innerHTML = `
        ศูนย์รวมผู้ดูแลและเพื่อนเที่ยวสาวรับงาน${provName} คัดสรรโปรไฟล์ตรงปก 100% บริการเอนเตอร์เทนสไตล์ฟิวแฟน (GFE) ปลอดภัยสูงสุดด้วยนโยบาย <strong>"จ่ายหน้างานเมื่อพบตัวจริง ไม่โอนมัดจำล่วงหน้าทุกกรณี"</strong> ครอบคลุมโซน <strong style="color: #C084FC;">${currentZones}</strong>
      `;
    }

    // 4. อัปเดตข้อความ SEO ใน Drawer (แก้ภาษาอังกฤษปนไทย)
    const drawerWrapper = document.getElementById("seo-drawer-wrapper");
    if (drawerWrapper) {
      const contentInner = drawerWrapper.querySelector("div");
      if (contentInner) {
        const seoText = (data && data.seoContent) 
          ? data.seoContent 
          : `<p>ศูนย์รวม <strong>สาวรับงาน${provName}</strong> และ <strong>เพื่อนเที่ยว${provName}</strong> พรีเมียมตรงปก 100% ปลอดภัย นัดเจอชำระหน้างาน ไม่โอนมัดจำ</p>`;
        
        contentInner.innerHTML = seoText + `
          <div style="border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 12px; margin-top: 6px;">
            <h3 style="font-size: 13px; font-weight: 800; color: #C084FC; margin-bottom: 6px;">Premium Escorts & Companion Services in ${engProvName}</h3>
            <p style="font-size: 11px; color: #A1A1AA; line-height: 1.5;">
              Welcome to First Model Hub ${engProvName}, the premier platform connecting travelers with verified companions. We offer authentic Girlfriend Experience (GFE) services with absolute financial safety: <strong>No upfront deposits required. Pay cash directly to your companion upon meeting.</strong>
            </p>
          </div>
        `;
      }
    }

    // 5. อัปเดตรีวิว
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
                <span style="display: block; font-size: 10px; color: var(--text-muted); font-weight: 700;">นัดเจอใน${r.location}</span>
              </div>
            </div>
            <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 9.5px;">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
          </div>
          <p style="font-size: 11.5px; color: var(--text-gray); line-height: 1.5; margin: 0;">${r.text}</p>
          <span style="display: block; font-size: 9px; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">ยืนยันการใช้บริการจริง • ${r.date}</span>
        </div>
      `).join("");
    }

    // 6. อัปเดต FAQ
    const faqContainer = document.getElementById("faq-container-list");
    if (faqContainer) {
      const faqsList = (data && data.faqs && data.faqs.length > 0) 
        ? data.faqs 
        : LOCALIZED_SEO_MAP["national"].faqs;

      faqContainer.innerHTML = faqsList.map(item => `
        <div class="interactive-card" style="padding: 16px 20px; background: rgba(13,8,30,0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <h3 style="font-weight: 800; font-size: 13.5px; display: flex; align-items: start; gap: 10px; margin: 0;">
                  <span style="display: flex; height: 22px; width: 22px; align-items: center; justify-content: center; border-radius: 6px; background-color: rgba(90, 44, 190, 0.2); color: #C084FC; font-size: 11px; font-weight: 900; border: 1px solid rgba(147, 51, 234, 0.3); flex-shrink: 0;">Q</span>
                  <span class="text-gradient-sub" style="line-height: 1.4; color: #E9D5FF;">${item.q}</span>
                </h3>
                <div style="padding-left: 32px; color: var(--text-gray); font-size: 12px; line-height: 1.5; border-left: 2px solid rgba(147, 51, 234, 0.2); padding-top: 4px;">
                  ${item.a}
                </div>
            </div>
        </div>
      `).join("");
    }

    const rulesTitle = document.getElementById("rules-title");
    if (rulesTitle) rulesTitle.textContent = `ข้อตกลงและเงื่อนไขการใช้บริการเพื่อนเที่ยว ไซด์ไลน์${provName}`;

    const faqHeading = document.getElementById("faq-main-heading");
    if (faqHeading) faqHeading.textContent = `คำถามที่พบบ่อยเกี่ยวกับบริการเพื่อนเที่ยวไซด์ไลน์${provName}`;

    const reviewsHeading = document.getElementById("reviews-main-heading");
    if (reviewsHeading) reviewsHeading.textContent = `รีวิวและความคิดเห็นจริงจากผู้ใช้บริการใน${provName}`;

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
        const icon = btn.querySelector("i");
        if (icon) icon.className = "fas fa-chevron-up";
      } else {
        wrapper.classList.add("collapsed");
        if (overlay) overlay.style.display = "block";
        btn.querySelector("span").textContent = "ดูข้อมูลพื้นที่บริการทั้งหมด";
        const icon = btn.querySelector("i");
        if (icon) icon.className = "fas fa-chevron-down";
      }
    });
  }

  function initRegionTabs() {
    const tabs = document.querySelectorAll(".region-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        if (DOM.searchInput) DOM.searchInput.value = "";
        const clearBtn = document.getElementById("clear-search-btn");
        if (clearBtn) clearBtn.style.display = "none";

        const region = tab.getAttribute("data-region");
        if (region === "ทั้งหมด") {
          if (DOM.provinceSelect) DOM.provinceSelect.value = "";
        } else if (region === "ภาคเหนือ") {
          if (DOM.provinceSelect) DOM.provinceSelect.value = "chiangmai";
        } else if (region === "กรุงเทพฯ") {
          if (DOM.provinceSelect) DOM.provinceSelect.value = "bangkok";
        }
        applyUltimateFilters(true);
      });
    });
  }

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
            .replace(/\{\{PROFILES_CARDS_HTML\}\}/g, "")
            .replace(/\{\{PROFILES_DISPLAY_AREA_HTML\}\}/g, "")
            .replace(/\{\{PROVINCE_SEO_CONTENT\}\}/g, "")
            .replace(/\{\{PROVINCE_FAQS_HTML\}\}/g, "")
            .replace(/\{\{PROVINCE_REVIEWS_HTML\}\}/g, "");
        }
      }

      document.querySelectorAll('a[href*="{{"], img[alt*="{{"]').forEach(el => {
        if (el.href) el.href = el.href.replace(/\{\{PROVINCE_NAME\}\}/g, provinceName);
        if (el.alt) el.alt = el.alt.replace(/\{\{PROVINCE_NAME\}\}/g, provinceName);
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

    const cleanPath = path.replace(/\/+$/, "");

    const isIndexPage = 
      cleanPath === "" || 
      cleanPath === "/" || 
      cleanPath.endsWith("/index.html") || 
      cleanPath.endsWith("/index.htm") || 
      cleanPath.includes("index.html");

    const isProfilesPage = 
      cleanPath === "/profiles" || 
      cleanPath.endsWith("/profiles.html");

    const staticPages = [
      "/blog", "/about", "/faq", "/locations", 
      "/contact", "/terms-of-service", "/privacy-policy", "/policy"
    ];

    const isStaticPage = !isIndexPage && !isProfilesPage && (
      ((cleanPath.endsWith(".html") || cleanPath.endsWith(".htm")) && !cleanPath.includes("index.html") && !cleanPath.includes("profiles.html")) ||
      staticPages.some(p => cleanPath === p || cleanPath.startsWith(p + "/"))
    );

    if (isStaticPage) {
      console.log(`🛑 ตรวจพบหน้า Static (${path}) ข้ามการทำงาน Router SPA`);
      closeLightboxModal(false);
      DOM.profilesDisplayArea?.classList.add("hidden");
      DOM.featuredSection?.classList.add("hidden");
      return;
    }

    DOM.profilesDisplayArea?.classList.remove("hidden");
    DOM.featuredSection?.classList.remove("hidden");

    const profileMatch = path.match(/^\/(?:sideline|profile|app)\/([^/]+)/);
    if (profileMatch) {
      const slug = decodeURIComponent(profileMatch[1]);
      STATE.currentProfileSlug = slug;

      let foundProfile = STATE.allProfiles.find(p => (p.slug || "").toLowerCase() === slug.toLowerCase());
      if (!foundProfile && !isInitial) {
        foundProfile = await fetchSingleProfileBySlug(slug);
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

    if (isProfilesPage) {
      STATE.currentProfileSlug = null;
      closeLightboxModal(false);

      if (DOM.provinceSelect) DOM.provinceSelect.value = "";

      applyUltimateFilters(false);

      const activeCount = STATE.filteredProfiles.length || STATE.allProfiles.length || 50;
      replaceDomPlaceholders("ทั่วไทย", activeCount, "national");
      return;
    }

    const locationMatch = path.match(/^\/(?:location|province)\/([^/]+)/);
    if (locationMatch) {
      let provinceSlug = decodeURIComponent(locationMatch[1]).toLowerCase();
      if (provinceSlug === "chiang_mai") provinceSlug = "chiangmai";
      STATE.currentProfileSlug = null;
      closeLightboxModal(false);

      if (DOM.provinceSelect) DOM.provinceSelect.value = provinceSlug;

      applyUltimateFilters(false);
      const provName = STATE.provincesMap.get(provinceSlug) || provinceSlug;
      const matchedProfiles = STATE.allProfiles.filter(p => p.provinceKey === provinceSlug || (provinceSlug === "chiangmai" && p.provinceKey === "chiang_mai"));

      updateSEOMetadata(null, {
        provinceName: provName,
        canonicalUrl: `${CONFIG.SITE_URL}/location/${provinceSlug}`,
        profiles: matchedProfiles
      });

      replaceDomPlaceholders(provName, matchedProfiles.length || 50, provinceSlug);
      return;
    }

    STATE.currentProfileSlug = null;
    closeLightboxModal(false);

    applyUltimateFilters(false);
    updateSEOMetadata(null, null);

    const currentProvKey = (DOM.provinceSelect?.value && DOM.provinceSelect.value !== "all") ? DOM.provinceSelect.value : "national";
    const currentProvName = (currentProvKey === "national") ? "ทั่วไทย" : (STATE.provincesMap.get(currentProvKey) || "ทั่วไทย");
    const activeCount = STATE.filteredProfiles.length || STATE.allProfiles.length || 50;
    
    replaceDomPlaceholders(currentProvName, activeCount, currentProvKey);
  }

  async function fetchSingleProfileBySlug(slug) {
    if (!window.supabase) return null;
    try {
      const { data, error } = await window.supabase.from("profiles").select("*").eq("slug", slug).maybeSingle();
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
      a.style.color = isActive ? "var(--primary-purple)" : "#D4D4D8";
      a.style.fontWeight = isActive ? "800" : "600";
      if (isActive) a.setAttribute("aria-current", "page");
    });
  }

  function hideGlobalLoader() {
    const loader = document.getElementById("global-loader-overlay");
    if (loader) {
      loader.style.pointerEvents = "none";
      try {
        if (window.gsap) {
          gsap.killTweensOf(loader);
          gsap.to(loader, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
              loader.style.display = "none";
              if (window.ScrollTrigger) ScrollTrigger.refresh();
            }
          });
        } else {
          loader.style.display = "none";
        }
      } catch (e) {
        loader.style.display = "none";
      }
    }
    if (DOM.loadingPlaceholder) DOM.loadingPlaceholder.style.display = "none";
  }

  window.handleLikeClick = async function (btnElement, profileId) {
    if (isLikeProcessing) return;
    isLikeProcessing = true;

    const isLiked = btnElement.classList.toggle("liked");
    const icon = btnElement.querySelector("i");

    if (icon) {
      icon.style.transform = isLiked ? "scale(1.3)" : "scale(0.9)";
      setTimeout(() => { icon.style.transform = "scale(1)"; }, 200);
    }

    try {
      const likedMap = JSON.parse(localStorage.getItem(CONFIG.KEYS.LIKED_PROFILES) || "{}");
      if (isLiked) {
        likedMap[profileId] = true;
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
        const { error } = await window.supabase.rpc(rpcName, { profile_id_to_update: profileId });
        if (error) console.error(`❌ Supabase Like Update Failed (${rpcName}):`, error.message);
      } catch (e) {
        console.error("🔌 Connection error:", e);
      }
    }

    setTimeout(() => { isLikeProcessing = false; }, 300);
  };

  window.selectSuggestion = (slug, isProfile = false) => {
    const suggestionsEl = document.getElementById("search-suggestions");
    const inputEl = document.getElementById("search-keyword");

    if (isProfile) {
      suggestionsEl?.classList.add("hidden");
      if (inputEl) inputEl.value = "";
      document.getElementById("clear-search-btn")?.classList.add("hidden");
      history.pushState(null, "", `/sideline/${encodeURIComponent(slug)}`);
      handleRouteNavigation();
    } else if (inputEl) {
      inputEl.value = slug;
      saveRecentSearch(slug);
      applyUltimateFilters(true);
      suggestionsEl?.classList.add("hidden");
    }
  };

  window.handleSearchAll = function (query) {
    const inputEl = document.getElementById("search-keyword");
    if (inputEl) {
      inputEl.value = query;
      saveRecentSearch(query);
      applyUltimateFilters(true);
    }
    const suggestionsEl = document.getElementById("search-suggestions");
    if (suggestionsEl) suggestionsEl.classList.add("hidden");
  };

  window.clearRecentSearches = function () {
    if (confirm("ต้องการล้างประวัติการค้นหาทั้งหมดใช่ไหม?")) {
      localStorage.removeItem("recent_searches");
      const suggestionsEl = document.getElementById("search-suggestions");
      if (suggestionsEl) suggestionsEl.classList.add("hidden");
    }
  };

  const initPlaceholderWatcher = () => {
    let hasPlaceholders = document.body.innerHTML.includes('{{');
    if (!hasPlaceholders) return;

    let timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (document.body.innerHTML.includes('{{')) {
          const currentProvKey = DOM.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || "chiangmai";
          const currentProvName = STATE.provincesMap.get(currentProvKey) || "เชียงใหม่";
          const activeCount = STATE.filteredProfiles.length || STATE.allProfiles.length || 50;

          replaceDomPlaceholders(currentProvName, activeCount, currentProvKey);
        } else {
          observer.disconnect();
        }
      }, 150);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

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
          <img src="/images/apple-touch-icon.png" style="width: 38px; height: 38px; border-radius: 10px;" alt="First Model Hub App">
          <div>
            <div style="font-size: 12px; font-weight: 800; color: #FFF;">ติดตั้งแอป First Model Hub</div>
            <div style="font-size: 10px; color: #A1A1AA;">เข้าใช้งานรวดเร็ว ไม่ต้องค้นหาบน Google</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button id="pwa-install-btn" style="background: linear-gradient(135deg, #7C3AED, #5A2CBE); color: white; border: none; padding: 7px 14px; border-radius: 100px; font-size: 11px; font-weight: 800; cursor: pointer;">ติดตั้ง</button>
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

  function initThreeBg() {
    const canvas = document.getElementById("three-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.BufferGeometry();
    const count = window.innerWidth < 768 ? 180 : 350;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xc084fc,
      transparent: true,
      opacity: 0.55
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    camera.position.z = 5;

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    function animate() {
      if (isVisible) {
        points.rotation.y += 0.0012;
        points.rotation.x += 0.0006;
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 แอปพลิเคชัน First Model Hub กำลังเริ่มต้นทำงาน...");

    try {
      supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
      window.supabase = supabaseClient;
    } catch (e) {
      console.error("❌ เชื่อมต่อ Supabase DB ล้มเหลว:", e);
    }

    DOM.body = document.body;
    DOM.pageHeader = document.getElementById("page-header");
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

    (function initTheme() {
      const btns = document.querySelectorAll(".theme-toggle-btn");
      const icons = document.querySelectorAll(".theme-toggle-icon");
      const applyTheme = (theme) => {
        const isDark = theme === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem(CONFIG.KEYS.THEME, theme);
        icons.forEach(ic => {
          if (isDark) {
            ic.classList.remove("fa-sun");
            ic.classList.add("fa-moon");
          } else {
            ic.classList.remove("fa-moon");
            ic.classList.add("fa-sun");
          }
        });
      };
      const savedTheme = localStorage.getItem(CONFIG.KEYS.THEME) || "dark";
      applyTheme(savedTheme);
      btns.forEach(b => {
        b.onclick = () => {
          const current = document.documentElement.classList.contains("dark") ? "light" : "dark";
          applyTheme(current);
        };
      });
    })();

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

    document.body.addEventListener("click", e => {
      const target = e.target;

      const likeBtn = target.closest('[data-action="like"]');
      if (likeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = likeBtn.dataset.id;
        if (id && typeof window.handleLikeClick === "function") {
          window.handleLikeClick(likeBtn, id);
        }
        return;
      }

      const suggestionItem = target.closest('[data-action="suggestion"]');
      if (suggestionItem) {
        const slug = suggestionItem.dataset.slug;
        const isProfile = suggestionItem.dataset.isProfile === "true";
        if (slug) window.selectSuggestion(slug, isProfile);
        return;
      }

      const searchAllBtn = target.closest('[data-action="search-all"]');
      if (searchAllBtn) {
        const query = searchAllBtn.dataset.query;
        if (query) window.handleSearchAll(query);
        return;
      }

      const clearRecentBtn = target.closest('[data-action="clear-recent"]');
      if (clearRecentBtn) {
        window.clearRecentSearches();
        return;
      }

      const cardLink = target.closest("a.card-link");
      if (cardLink) {
        e.preventDefault();
        const card = cardLink.closest(".profile-card-new");
        const slug = card ? card.getAttribute("data-profile-slug") : null;
        if (slug) {
          STATE.lastFocusedElement = cardLink;
          history.pushState(null, "", `/sideline/${encodeURIComponent(slug)}`);
          handleRouteNavigation();
        }
        return;
      }

      const closeBtn = target.closest("#closeLightboxBtn");
      const lightboxModal = target.closest("#lightbox");
      if (closeBtn || (lightboxModal && e.target === lightboxModal)) {
        closeLightboxModal(true);
        if (STATE.lastFocusedElement?.focus) STATE.lastFocusedElement.focus();
        return;
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && STATE.currentProfileSlug) {
        closeLightboxModal(true);
        if (STATE.lastFocusedElement?.focus) STATE.lastFocusedElement.focus();
      }
    });

    (function initAccordions() {
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
    })();

    (function initReviewForm() {
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
        const provinceKey = DOM.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || "chiangmai";

        if (!author || !reviewText) {
          showToast("❌ กรุณากรอกข้อมูลชื่อผู้ใช้งานและรายละเอียดรีวิวน้องให้ครบถ้วนด้วยครับ", "error");
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
          showToast("❌ ระบบบันทึกขัดข้อง กรุณาลองใหม่อีกครั้งครับ", "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "ส่งคำติชมเพื่อยืนยันประวัติเข้าระบบ";
          }
        }
      });
    })();

    (function initReviewToggle() {
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
    })();

    DOM.searchInput?.addEventListener("input", e => {
      clearTimeout(window.searchTimeout);
      const val = e.target.value;
      window.searchTimeout = setTimeout(() => {
        applyUltimateFilters(true);
        renderSearchSuggestions(val);
      }, 300);
    });

    DOM.provinceSelect?.addEventListener("change", () => {
      if (DOM.searchInput) DOM.searchInput.value = "";
      applyUltimateFilters(true);
    });

    DOM.availabilitySelect?.addEventListener("change", () => applyUltimateFilters(true));
    DOM.featuredSelect?.addEventListener("change", () => applyUltimateFilters(true));
    DOM.sortSelect?.addEventListener("change", () => applyUltimateFilters(true));
    DOM.resetSearchBtn?.addEventListener("click", () => {
      if (DOM.searchInput) DOM.searchInput.value = "";
      if (DOM.provinceSelect) DOM.provinceSelect.value = "";
      if (DOM.availabilitySelect) DOM.availabilitySelect.value = "";
      if (DOM.featuredSelect) DOM.featuredSelect.value = "";
      if (DOM.sortSelect) DOM.sortSelect.value = "featured";
      applyUltimateFilters(true);
    });

    initThreeBg();
    await fetchProfilesData();
    await handleRouteNavigation(true);
    updateActiveNavLinks();
    hideGlobalLoader();
    
    initPlaceholderWatcher();
    initSeoDrawer();
    initRegionTabs();
    initPwaInstaller();

    window.addEventListener("popstate", async () => {
      await handleRouteNavigation(false);
      updateActiveNavLinks();
    });

    console.log("✅ [FirstModelHub] ระบบ main.js ทำงานสมบูรณ์ 100%");
  });

})();