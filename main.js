/**
 * [ SYSTEM MAIN CORE - ADVANCED SMART ENGINE 2026 ]
 * Project: First Model Hub - Dynamic Client Controller & Search Engine
 * Features: 100% Pure Cloudinary Resolution, 100% Working Lightbox, Floating Bottom Sheet, Eye-Level Smooth Scroll, 50% Slim Sidebar
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";
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
    CLOUDINARY_CLOUD_NAME: "drffioary",
    CLOUDINARY_BASE_URL: "https://res.cloudinary.com/drffioary/image/upload/",
    KEYS: {
      LAST_PROVINCE: "firstmodelhub_last_province",
      CACHE_PROFILES: "cachedProfiles_v3_2026",
      CACHE_PROVINCES: "cachedProvinces_v3_2026",
      LAST_SYNC: "data_last_sync_timestamp_v3_2026",
      THEME: "theme",
      LIKED_PROFILES: "liked_profiles",
      RECENT_SEARCHES: "recent_searches"
    },
    SITE_URL: "https://firstmodelhub.com",
    DEFAULT_OG_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp"
  };

  const LOCALIZED_SEO_MAP = {
    chiangmai: {
      zones: ["ทั้งหมด", "นิมมาน", "สันติธรรม", "เจ็ดยอด", "หลัง มช.", "ช้างเผือก", "สันทราย", "ห้วยแก้ว"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานเชียงใหม่</strong> และ <strong>ไซด์ไลน์เชียงใหม่</strong> พรีเมียม คัดสรรตรงปก 100% นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมย่านนิมมาน สันติธรรม เจ็ดยอด</p>`,
      reviews: [], faqs: []
    },
    chiangrai: {
      zones: ["ทั้งหมด", "ตัวเมืองเชียงราย", "บ้านดู่", "มฟล.", "หอนาฬิกา", "แม่สาย"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานเชียงราย</strong> และ <strong>ไซด์ไลน์เชียงราย</strong> พรีเมียม คัดสรรโปรไฟล์ตรงปก 100% ปลอดภัย นัดเจอชำระหน้างาน ไม่โอนมัดจำ ครอบคลุมโซนตัวเมือง บ้านดู่ มฟล.</p>`,
      reviews: [], faqs: []
    },
    lampang: {
      zones: ["ทั้งหมด", "ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏลำปาง", "สบตุ๋ย"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานลำปาง</strong> และ <strong>ไซด์ไลน์ลำปาง</strong> พรีเมียม ตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมตัวเมืองลำปาง สวนดอก รอบเวียง</p>`,
      reviews: [], faqs: []
    },
    lamphun: {
      zones: ["ทั้งหมด", "ตัวเมืองลำพูน", "นิคมลำพูน", "เวียงยอง", "ป่าซาง", "เหมืองง่า"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานลำพูน</strong> และ <strong>ไซด์ไลน์ลำพูน</strong> พรีเมียม ตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ ครอบคลุมนิคมลำพูน เวียงยอง ตัวเมืองลำพูน</p>`,
      reviews: [], faqs: []
    },
    phitsanulok: {
      zones: ["ทั้งหมด", "ตัวเมืองพิษณุโลก", "รอบ มน.", "สมอแข"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานพิษณุโลก</strong> และ <strong>ไซด์ไลน์พิษณุโลก</strong> พรีเมียม ตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ</p>`,
      reviews: [], faqs: []
    },
    bangkok: {
      zones: ["ทั้งหมด", "สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานกรุงเทพ</strong> และ <strong>ไซด์ไลน์ กทม</strong> ระดับพรีเมียม การันตีตรงปก 100% ปลอดภัยนัดเจอชำระหน้างาน ไม่โอนมัดจำ</p>`,
      reviews: [], faqs: []
    },
    chonburi: {
      zones: ["ทั้งหมด", "พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานชลบุรี</strong> รับงานพัทยา และเพื่อนเที่ยวบางแสน พรีเมียม ปลอดภัยจ่ายหน้างาน ไม่โอนมัดจำ</p>`,
      reviews: [], faqs: []
    },
    khonkaen: {
      zones: ["ทั้งหมด", "ตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัล"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานขอนแก่น</strong> และเพื่อนเที่ยวไซด์ไลน์ขอนแก่น พรีเมียม คัดสรรโปรไฟล์ตรงปก 100% จ่ายหน้างาน</p>`,
      reviews: [], faqs: []
    },
    phuket: {
      zones: ["ทั้งหมด", "ตัวเมืองภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานภูเก็ต</strong> ป่าตอง และเพื่อนเที่ยวพรีเมียม คัดสรรโปรไฟล์ตรงปก 100% จ่ายหน้างาน</p>`,
      reviews: [], faqs: []
    },
    udonthani: {
      zones: ["ทั้งหมด", "ตัวเมืองอุดร", "UD Town", "หนองประจักษ์"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานอุดรธานี</strong> และเพื่อนเที่ยวพรีเมียม คัดสรรโปรไฟล์ตรงปก 100% จ่ายหน้างาน</p>`,
      reviews: [], faqs: []
    },
    national: {
      zones: ["ทั้งหมด", "กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "อุดรธานี", "ขอนแก่น", "ลำปาง", "ลำพูน"],
      seoContent: `<p>ศูนย์รวม <strong>สาวรับงานทั่วไทย</strong> พรีเมียม คัดสรรตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ</p>`,
      reviews: [], faqs: []
    }
  };

  let STATE = {
    allProfiles: [],
    provincesMap: new Map(),
    currentProfileSlug: null,
    isFetching: false,
    currentFilters: null,
    filteredProfiles: [],
    renderId: 0
  };

  const DOM = {};
  let supabaseClient = null;

  function sanitizeName(rawName) {
    if (!rawName || typeof rawName !== "string") return "";
    let cleaned = rawName.trim().replace(/^(น้อง\s?)+/gi, "");
    cleaned = cleaned.toLowerCase();
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return `น้อง${cleaned}`;
  }

// 🟢 ฟังก์ชันแปลง URL Cloudinary อัจฉริยะ 100% (บังคับใส่ images/ เสมอ ป้องกัน 404 จากชื่อไฟล์ v0...)
  function getImageUrl(path, width = 400, height = null) {
    if (!path) return CONFIG.DEFAULT_OG_IMAGE;
    if (Array.isArray(path)) path = path[0];
    if (typeof path === "object" && path !== null) path = path.src || path.url || path.imagePath || path.image_url || "";
    if (typeof path !== "string" || !path.trim()) return CONFIG.DEFAULT_OG_IMAGE;

    const cleanPath = path.trim();
    const transform = height 
      ? `f_auto,q_auto,w_${width},h_${height},c_fill,g_face` 
      : `c_scale,w_${width},q_auto,f_auto`;

    // 1. กรณีเป็น Full Cloudinary URL อยู่แล้ว
    if (cleanPath.includes("res.cloudinary.com")) {
      const uploadIdx = cleanPath.indexOf("/upload/");
      if (uploadIdx !== -1) {
        const prefix = cleanPath.substring(0, uploadIdx + 8);
        let rest = cleanPath.substring(uploadIdx + 8);

        // ตัด Transformations เก่าออก
        rest = rest.replace(/^(?:[a-z]{1,4}_[a-z0-9_:-]+,?)+\//i, "");

        // ✅ บังคับให้มีโฟลเดอร์ images/ เสมอ ป้องกันชื่อไฟล์ v0... ชนกับ Cloudinary Version
        if (!rest.includes("images/") && !rest.startsWith("images/")) {
          rest = `images/${rest.replace(/^v\d+\//i, "")}`;
        }

        return `${prefix}${transform}/${rest}`;
      }
      return cleanPath;
    }

    // 2. กรณีเป็น External URL อื่นๆ
    if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
      return cleanPath;
    }

    // 3. กรณีเป็น Relative Path จาก Supabase (บังคับเติม images/ ป้องกัน 404)
    let relativeClean = cleanPath.replace(/^\/+/, "");
    if (!relativeClean.startsWith("images/")) {
      relativeClean = `images/${relativeClean}`;
    }
    return `${CONFIG.CLOUDINARY_BASE_URL}${transform}/${relativeClean}`;
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
        src: getImageUrl(path, 400, 500),
        fullSrc: getImageUrl(path, 1000, null)
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

    const sloganText = raw.slogan || raw.quote || raw.tagline || "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน";
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
      cup: cup,
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
      isfeatured: raw.isfeatured === true || raw.is_featured === true || raw.isFeatured === true,
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
      // 1. โหลดข้อมูลจังหวัดจาก window.provincesData (ถ้ามี)
      if (window.provincesData && Array.isArray(window.provincesData)) {
        STATE.provincesMap.clear();
        window.provincesData.forEach(p => {
          const name = p.nameThai || p.name_thai || p.name;
          let key = (p.key || p.slug || p.id).toString().toLowerCase();
          if (key === "chiang_mai") key = "chiangmai";
          if (key && name) STATE.provincesMap.set(key, name);
        });
      }

      // 2. ถ้ามีข้อมูลโปรไฟล์จาก SSR Hydration ให้ใช้ทันที (เร็วที่สุด ไม่เปลืองเน็ต)
      if (window.profilesData && Array.isArray(window.profilesData) && window.profilesData.length > 0) {
        STATE.allProfiles = window.profilesData.map(p => processProfileObject(p)).filter(Boolean);
        
        // 🟢 บันทึกสำรองใส่ LocalStorage ไว้ใช้ยามฉุกเฉิน
        try {
          localStorage.setItem(CONFIG.KEYS.CACHE_PROFILES, JSON.stringify(window.profilesData));
        } catch(e) {}

        finishProfileLoading();
        return true;
      }

      // 3. ถ้าไม่มี SSR ให้ดึงตรงจาก Supabase
      if (!supabaseClient) throw new Error("Supabase client not initialized");

      const [provincesRes, profilesRes] = await Promise.all([
        supabaseClient.from("provinces").select("*"),
        supabaseClient.from("profiles").select("*").eq("active", true).order("isfeatured", { ascending: false }).order("created_at", { ascending: false })
      ]);

      if (provincesRes.data) {
        STATE.provincesMap.clear();
        provincesRes.data.forEach(p => {
          const name = p.nameThai || p.name;
          let key = (p.key || p.slug || p.id).toString().toLowerCase();
          if (key === "chiang_mai") key = "chiangmai";
          if (key && name) STATE.provincesMap.set(key, name);
        });
      }

      if (profilesRes.data && profilesRes.data.length > 0) {
        STATE.allProfiles = profilesRes.data.map(p => processProfileObject(p)).filter(Boolean);
        
        // 🟢 บันทึกสำรองใส่ LocalStorage
        try {
          localStorage.setItem(CONFIG.KEYS.CACHE_PROFILES, JSON.stringify(profilesRes.data));
        } catch(e) {}
      } else {
        throw new Error("No profiles data returned from Supabase");
      }

      finishProfileLoading();
      return true;

    } catch (err) {
      console.warn("⚠️ โหลดจาก Supabase ไม่สำเร็จ กำลังกู้คืนจากระบบสำรอง (Cache)...", err);
      
      // 🟢 4. ระบบกู้ชีพฉุกเฉิน (Fallback): ถ้าเน็ตพังหรือ Supabase ล่ม ดึงจาก LocalStorage แทนทันที
      try {
        const cachedRaw = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            STATE.allProfiles = parsed.map(p => processProfileObject(p)).filter(Boolean);
            finishProfileLoading();
            return true;
          }
        }
      } catch (cacheErr) {
        console.error("❌ โหลดจาก Cache สำรองก็ล้มเหลว:", cacheErr);
      }

      // ถ้าพังหมดจริงๆ ให้แสดงข้อความแจ้งเตือนเบาๆ ไม่ให้แอปค้าง
      if (DOM.fetchErrorMessage) DOM.fetchErrorMessage.classList.remove("hidden");
      return false;

    } finally {
      STATE.isFetching = false;
      hideGlobalLoader();
    }
  }

  // ฟังก์ชันย่อยสำหรับเซ็ตค่าหน้าจอหลังโหลดข้อมูลสำเร็จ (ลดโค้ดซ้ำซ้อน)
  function finishProfileLoading() {
    populateProvinceDropdown();
    const urlMatch = window.location.pathname.match(/^\/(?:location|province)\/([^/]+)/);
    const activeSlug = urlMatch ? decodeURIComponent(urlMatch[1]).toLowerCase() : (window.currentProvinceSlug || "");
    if (DOM.provinceSelect && activeSlug && activeSlug !== "national") {
      DOM.provinceSelect.value = activeSlug;
    }
    applyUltimateFilters(false);
    updateHeroSwiperCards();
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

  function applyUltimateFilters(updateUrlHistory = true) {
    try {
      const urlPath = window.location.pathname.toLowerCase();
      const locMatch = urlPath.match(/^\/(?:location|province)\/([^/]+)/);
      const urlProvinceKey = locMatch ? decodeURIComponent(locMatch[1]) : null;

      let targetProvinceKey = "all";
      if (urlProvinceKey && urlProvinceKey !== "profiles") {
        targetProvinceKey = urlProvinceKey;
      } else if (DOM.provinceSelect && DOM.provinceSelect.value && DOM.provinceSelect.value !== "") {
        targetProvinceKey = DOM.provinceSelect.value;
      }

      if (targetProvinceKey === "chiang_mai") targetProvinceKey = "chiangmai";

      const activeFilters = {
        text: (DOM.searchInput?.value || "").trim(),
        province: targetProvinceKey,
        avail: DOM.availabilitySelect?.value || "all",
        featured: DOM.featuredSelect?.value === "true",
        sort: DOM.sortSelect?.value || "featured"
      };

      let results = [...STATE.allProfiles];

      if (targetProvinceKey !== "all" && targetProvinceKey !== "national") {
        results = results.filter(p => {
          const k = (p.provinceKey || p.province_slug || p.province || "").toString().toLowerCase();
          if (targetProvinceKey === "chiangmai") return k === "chiangmai" || k === "chiang_mai";
          return k === targetProvinceKey;
        });
      }

      if (activeFilters.text) {
        const rawQuery = activeFilters.text.toLowerCase().trim();
        const cleanQuery = rawQuery.replace(/^(น้อง|สาว|พี่|รับงาน|ไซด์ไลน์|ย่าน|โซน)\s*/gi, "").trim();
        const tokens = cleanQuery.split(/\s+/).filter(Boolean);

        results = results.filter(p => {
          const pName = (p.displayName || p.name || "").toLowerCase();
          const pCleanName = pName.replace(/^(น้อง\s?)+/gi, "").trim();
          const pLoc = (p.location || "").toLowerCase();
          const pProv = (p.provinceNameThai || "").toLowerCase();
          const pDesc = (p.description || "").toLowerCase();
          const pSlogan = (p.slogan || p.quote || "").toLowerCase();
          const pTags = Array.isArray(p.styleTags) ? p.styleTags.join(" ").toLowerCase() : (p.styleTags || "").toLowerCase();
          const pId = String(p.id || "");
          const pAge = String(p.safeAge || p.age || "");
          const pPrice = String(p._price || p.rate || "");
          const pBust = String(p.bust || "");
          const pCup = String(p.cup || "").toLowerCase();
          const pStats = String(p.safeStats || "").toLowerCase();
          const pHeight = String(p.safeHeight || "").replace(/\D/g, "");
          const pWeight = String(p.safeWeight || "").replace(/\D/g, "");

          return tokens.every(token => {
            return (
              pId === token ||
              pName.includes(token) ||
              pCleanName.includes(token) ||
              pLoc.includes(token) ||
              pProv.includes(token) ||
              pDesc.includes(token) ||
              pSlogan.includes(token) ||
              pTags.includes(token) ||
              pAge === token ||
              pPrice.includes(token) ||
              pBust === token ||
              pStats.includes(token) ||
              (pCup && pCup === token) ||
              (pHeight && pHeight === token) ||
              (pWeight && pWeight === token)
            );
          });
        });

        results.sort((a, b) => {
          const aName = (a.displayName || a.name || "").toLowerCase().replace(/^(น้อง\s?)+/gi, "").trim();
          const bName = (b.displayName || b.name || "").toLowerCase().replace(/^(น้อง\s?)+/gi, "").trim();
          if (aName === cleanQuery || String(a.id) === rawQuery) return -1;
          if (bName === cleanQuery || String(b.id) === rawQuery) return 1;
          if (aName.startsWith(cleanQuery)) return -1;
          if (bName.startsWith(cleanQuery)) return 1;
          return 0;
        });
      }

      if (activeFilters.avail && activeFilters.avail !== "all") {
        results = results.filter(p => p.availability === activeFilters.avail);
      }

      if (activeFilters.featured) {
        results = results.filter(p => p.isfeatured === true);
      }

      if (!activeFilters.text) {
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
      }

      const isNational = targetProvinceKey === "all" || targetProvinceKey === "national";
      const currentProvKey = isNational ? "national" : targetProvinceKey;
      const currentProvName = isNational 
        ? "ทั่วไทย" 
        : (STATE.provincesMap.get(currentProvKey) || window.currentProvinceName || "ลำปาง");

      renderProfilesGrid(results, targetProvinceKey !== "all" || Boolean(activeFilters.text));

      STATE.currentFilters = activeFilters;
      STATE.filteredProfiles = results;

      replaceDomPlaceholders(currentProvName, results.length, currentProvKey);

    } catch (e) {
      console.error("❌ ข้อผิดพลาดในการกรอง:", e);
    }
  }

  function renderSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById("search-suggestions");
    const clearBtn = document.getElementById("clear-search-btn");

    if (clearBtn) clearBtn.style.display = query ? "block" : "none";
    if (!suggestionsContainer) return;

    const q = (query || "").toLowerCase().trim();
    
    if (!q) {
      const currentProv = DOM.provinceSelect?.value || window.currentProvinceSlug || "chiangmai";
      const data = LOCALIZED_SEO_MAP[currentProv] || LOCALIZED_SEO_MAP["national"];
      const zones = (data && data.zones) ? data.zones.filter(z => z !== "ทั้งหมด").slice(0, 4) : ["ตัวเมือง"];

      let html = `<div style="background-color: #121214; border: 1px solid rgba(147, 51, 234, 0.4); border-radius: 14px; padding: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.9); backdrop-filter: blur(15px);">`;
      html += `<div style="font-size: 11px; font-weight: 800; color: #C084FC; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;"><i class="fas fa-lightbulb" style="color: #FBBF24;"></i> คำค้นหายอดนิยม:</div>`;
      html += `<div style="display: flex; flex-wrap: wrap; gap: 6px;">`;
      html += `<span data-action="suggestion" data-slug="ฟิวแฟน" data-is-profile="false" style="background: rgba(255,20,147,0.15); border: 1px solid rgba(255,105,180,0.3); color: #FF85C0; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">❤️ #ฟิวแฟน</span>`;
      html += `<span data-action="suggestion" data-slug="1500" data-is-profile="false" style="background: rgba(16,185,129,0.15); border: 1px solid rgba(52,211,153,0.3); color: #00E676; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">💰 1,500.-</span>`;
      
      zones.forEach(z => {
        html += `<span data-action="suggestion" data-slug="${z}" data-is-profile="false" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #D4D4D8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">📍 ${z}</span>`;
      });

      html += `</div></div>`;
      suggestionsContainer.innerHTML = html;
      suggestionsContainer.style.display = "block";
      return;
    }

    const matchedProvinces = Array.from(STATE.provincesMap.entries()).filter(([key, name]) => 
      name.toLowerCase().includes(q) || key.toLowerCase().includes(q)
    ).slice(0, 2);

    const cleanQ = q.replace(/^(น้อง\s?)+/gi, "").trim();
    const profileMatches = STATE.allProfiles.filter(item => {
      const name = (item.displayName || item.name || "").toLowerCase().replace(/^(น้อง\s?)+/gi, "").trim();
      const loc = (item.location || "").toLowerCase();
      const id = String(item.id || "");
      return name.includes(cleanQ) || loc.includes(q) || id === q;
    }).slice(0, 4);

    if (matchedProvinces.length === 0 && profileMatches.length === 0) {
      suggestionsContainer.style.display = "none";
      return;
    }

    let html = `<div style="background-color: #121214; border: 1px solid rgba(147, 51, 234, 0.4); border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.9);">`;

    if (matchedProvinces.length > 0) {
      html += `<div style="padding: 6px 12px; background: rgba(147, 51, 234, 0.18); font-size: 11px; font-weight: 800; color: #C084FC;">🗺️ ไปที่หน้าจังหวัด</div>`;
      matchedProvinces.forEach(([key, name]) => {
        html += `
          <div onclick="window.location.href='/location/${key}'" style="padding: 10px 14px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); color: #FFF; font-size: 13px; font-weight: 700; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
            <span>📍 ไซด์ไลน์${name}</span>
            <i class="fas fa-arrow-right" style="color: #C084FC; font-size: 12px;"></i>
          </div>
        `;
      });
    }

    if (profileMatches.length > 0) {
      html += `<div style="padding: 6px 12px; background: #09090B; font-size: 11px; font-weight: 800; color: #E9D5FF;">✨ โปรไฟล์แนะนำ</div>`;
      profileMatches.forEach(item => {
        const thumbImg = item.images && item.images[0] ? item.images[0].src : CONFIG.DEFAULT_OG_IMAGE;
        html += `
          <div class="suggestion-item" data-action="suggestion" data-slug="${encodeURIComponent(item.slug || item.id)}" data-is-profile="true" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
              <img src="${thumbImg}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);">
              <div style="flex: 1; min-width: 0; text-align: left;">
                  <div style="font-size: 13px; font-weight: 800; color: #FFFFFF;">${item.displayName || item.name}</div>
                  <div style="font-size: 11px; color: #A1A1AA;">📍 ${item.location || item.provinceNameThai}</div>
              </div>
              <span style="color: #00E676; font-weight: 800; font-size: 12px;">${item.displayPrice}</span>
          </div>
        `;
      });
    }

    html += `</div>`;
    suggestionsContainer.innerHTML = html;
    suggestionsContainer.style.display = "block";
  }


function escapeHTML(str) {
  if (!str) return "";
  return String(str).replace(/[&<>'"]/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[tag] || tag));
}



async function renderProfilesGrid(profiles, isFilteredView) {
  if (!DOM.profilesDisplayArea) return;

  // 1. ควบคุม Render ID ป้องกัน Race Condition จากการค้นหาพิมพ์เร็ว
  STATE.renderId = (STATE.renderId || 0) + 1;
  const currentRenderId = STATE.renderId;

  // 2. เคลียร์สถานะข้อความแจ้งเตือน
  DOM.noResultsMessage?.classList.add("hidden");
  DOM.fetchErrorMessage?.classList.add("hidden");

  // 3. จัดการหมวด Featured Profiles (แสดงเฉพาะหน้าแรก และต้องไม่ติดตัวกรอง)
  if (DOM.featuredSection) {
    const isHomePage = !isFilteredView && !window.location.pathname.includes("/location/");
    const featuredProfiles = STATE.allProfiles.filter(p => p.isfeatured);
    const hasFeatured = featuredProfiles.length > 0;

    DOM.featuredSection.classList.toggle("hidden", !isHomePage || !hasFeatured);

    if (isHomePage && hasFeatured && DOM.featuredContainer) {
      // เรนเดอร์เมื่อคอนเทนเนอร์ยังว่างเปล่า
      if (DOM.featuredContainer.children.length === 0) {
        await appendProfilesToContainer(DOM.featuredContainer, featuredProfiles, currentRenderId);
      }
    }
  }

  // 4. กรณีไม่พบข้อมูลโปรไฟล์
  if (!profiles || profiles.length === 0) {
    DOM.profilesDisplayArea.innerHTML = "";
    DOM.profilesDisplayArea.style.minHeight = "";
    DOM.noResultsMessage?.classList.remove("hidden");
    return;
  }

  // 5. ตรวจสอบประเภทหน้า (หน้ารายจังหวัด / ผลการค้นหา หรือ หน้าหลักรวมจังหวัด)
  const isLocationPage = window.location.pathname.includes("/location/") || window.location.pathname.includes("/province/");

  if (isFilteredView || isLocationPage) {
    // -------------------------------------------------------------
    // แบบที่ 1: หน้ารายจังหวัด หรือ หน้าผลการค้นหา/ตัวกรอง
    // -------------------------------------------------------------
    const urlMatch = window.location.pathname.match(/^\/(?:location|province)\/([^/]+)/);
    const activeSlug = urlMatch ? decodeURIComponent(urlMatch[1]).toLowerCase() : (DOM.provinceSelect?.value || "chiangmai");
    const provName = STATE.provincesMap.get(activeSlug) || window.currentProvinceName || "เชียงใหม่";
    const count = profiles.length;

    // ✅ ป้องกัน XSS Injection 100% ด้วยการ Escape คำค้นหา
    const searchVal = DOM.searchInput?.value?.trim();
    const headingTitle = searchVal
      ? `🔍 ผลการค้นหา "${escapeHTML(searchVal)}"`
      : `📍 น้องๆ ในจังหวัด <span style="color: #C084FC;">${escapeHTML(provName)}</span>`;

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

    DOM.profilesDisplayArea.innerHTML = "";
    DOM.profilesDisplayArea.appendChild(sectionWrapper);

    const grid = sectionWrapper.querySelector(".profile-grid");
    await appendProfilesToContainer(grid, profiles, currentRenderId);
    DOM.profilesDisplayArea.style.minHeight = "";

  } else {
    // -------------------------------------------------------------
    // แบบที่ 2: หน้าแรกแยกหมวดหมู่ตามจังหวัด (National / Grouped View)
    // -------------------------------------------------------------
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

    if (sortedProvinceKeys.length > 0) {
      DOM.profilesDisplayArea.innerHTML = "";

      // ✅ ประมวลผลแบบเรียงลำดับ ป้องกัน Race Condition และโหลดครบจริง
      for (const key of sortedProvinceKeys) {
        if (STATE.renderId !== currentRenderId) return; // ยกเลิกการเรนเดอร์เก่าถ้ามีคำสั่งใหม่แทรกเข้ามา

        const name = STATE.provincesMap.get(key) || (key === "no_province" ? "ไม่ระบุจังหวัด" : key);
        const section = createProvinceSectionElement(key, name, grouped[key]);

        DOM.profilesDisplayArea.appendChild(section);

        const grid = section.querySelector(".profile-grid");
        await appendProfilesToContainer(grid, grouped[key], currentRenderId);
      }
      DOM.profilesDisplayArea.style.minHeight = "";

    } else {
      DOM.profilesDisplayArea.innerHTML = "";
      DOM.profilesDisplayArea.style.minHeight = "";
      DOM.noResultsMessage?.classList.remove("hidden");
    }
  }

  // 6. ผูก Event ป้องกันรูปภาพและรีเฟรชความสูงจอ (ทำงานหลังการ์ดทุกใบเรนเดอร์ลง DOM เสร็จสมบูรณ์แล้ว)
  if (STATE.renderId === currentRenderId) {
    bindMediaProtection();
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
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
    const ageDisplay = profile.safeAge && profile.safeAge !== "-" ? ` ${profile.safeAge}` : "";

    const featuredBadge = profile.isfeatured
      ? `<span style="background: rgba(90, 44, 190, 0.88); border: 1px solid rgba(192, 132, 252, 0.5); color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-star" style="font-size: 8px; color: #FBBF24;"></i>
          <span>แนะนำ</span>
         </span>`
      : "";

    const statusBadge = `
      <span style="background: rgba(9, 9, 11, 0.82); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <span style="width: 5px; height: 5px; border-radius: 50%; background-color: ${statusDotColor}; box-shadow: 0 0 6px ${statusDotColor}; flex-shrink: 0;"></span>
          <span>${statusText}</span>
      </span>
    `;

    const videoBadge = profile.hasVideo
      ? `<span style="background: rgba(255, 46, 99, 0.35); border: 1px solid rgba(255, 46, 99, 0.6); color: #FF2E63; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-video" style="font-size: 8px;"></i> คลิป
         </span>`
      : "";

    const verifiedBadge = (profile.isVerified || profile.verified)
      ? `<span style="background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(52, 211, 153, 0.55); color: #00E676; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <i class="fas fa-check-circle" style="font-size: 8px; color: #00E676;"></i> ยืนยัน
         </span>`
      : "";

    const encodedSlug = encodeURIComponent(profile.slug || profile.id);

    card.innerHTML = `
      <img src="${imageSrc}" 
           alt="${seoAltText}"
           title="${seoAltText}"
           width="300"
           height="400"
           style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; filter: brightness(0.96) saturate(0.92); transition: transform 0.4s ease, opacity 0.5s; opacity: 1; z-index: 0; border-radius: 18px;"
           loading="${index < 2 ? "eager" : "lazy"}"
           fetchpriority="${index === 0 ? "high" : "auto"}"
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

      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 11px 12px 11px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 1px;">
          <h3 style="font-size: 14px; font-weight: 800; color: white; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 4px rgba(0,0,0,0.95);">
            ${nameClean}${ageDisplay}
          </h3>
          
          ${(profile.slogan || profile.quote) ? `<p style="font-size: 11px; color: #f0a0cd; font-weight: 600; margin: 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">${profile.slogan || profile.quote}</p>` : ''}
          
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #eee7f2; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 3px; margin-top: 2px;">
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
        <div class="vip-card-item ${idx === 0 ? 'active-glow' : ''}" data-profile-id="${p.id}" data-profile-slug="${pSlug}">
          <span class="vip-status-chip">🟢 ${availText}</span>
          <span class="hot-rank-badge">${rankText}</span>
          <img src="${imgUrl}" alt="${p.displayName}" width="150" height="210" loading="${idx < 2 ? 'eager' : 'lazy'}" onerror="this.src='${CONFIG.DEFAULT_OG_IMAGE}'">
          <div class="vip-card-overlay"></div>
          <a href="/sideline/${pSlug}" class="card-link" aria-label="ดูโปรไฟล์${p.displayName}"></a>
          <div class="vip-card-info">
            <div class="vip-name">${p.displayName}</div>
            <div class="vip-location">${realLocation}</div>
          </div>
        </div>
      `;
    }).join("");
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
        <span class="brand-neon-text" style="font-size: clamp(20px, 5vw, 24px) !important; font-weight: 900 !important; background: linear-gradient(135deg, #FFFFFF 0%, #FF85C0 35%, #FF1493 70%, #E02475 100%) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; filter: drop-shadow(0 0 10px rgba(255, 20, 147, 0.7)) !important;">${nameClean}</span>
        ${profile.isVerified ? '<i class="fas fa-check-circle" style="color: #00E676; margin-left: 6px; font-size: 16px; filter: drop-shadow(0 0 6px #00E676);" title="ยืนยันตัวตนแล้ว"></i>' : ""}
      `;
    }

    const badgeEl = document.getElementById("lightbox-availability-badge-wrapper");
    if (badgeEl) {
      badgeEl.innerHTML = `
        <span style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 100px; display: inline-flex; align-items: center; gap: 6px; backdrop-filter: blur(8px);">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: ${statusColor}; box-shadow: 0 0 8px ${statusColor};"></span>
            <span style="color: white; font-size: 11px; font-weight: 800;">${statusText}</span>
        </span>
      `;
    }

    const heroImg = document.getElementById("lightboxHeroImage");
    if (heroImg) {
      const hdSrc = profile?.images?.[0]?.fullSrc || profile?.images?.[0]?.src || CONFIG.DEFAULT_OG_IMAGE;
      heroImg.src = hdSrc;
      heroImg.alt = `${nameClean} สาวรับงานตัวจริงตรงปก`;
    }

    const strip = document.getElementById("lightboxThumbnailStrip");
    if (strip) {
      strip.innerHTML = "";
      if (profile.images && profile.images.length > 1) {
        profile.images.forEach((imgObj, idx) => {
          const thumb = document.createElement("img");
          thumb.src = imgObj.src;
          thumb.alt = `ภาพที่ ${idx + 1}`;
          thumb.style.cssText = "width: 48px; height: 56px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; opacity: 0.5; transition: all 0.2s;";
          
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
        span.className = "lightbox-tag-pill";
        span.textContent = tag.startsWith("#") ? tag : `#${tag}`;
        tagsEl.appendChild(span);
      });
    }

    let ageDisplay = profile.safeAgeDisplay || (profile.age ? `${profile.age} ปี` : "ไม่ระบุ");
    const statsText = profile.safeStats || "ไม่ระบุ";
    const heightText = profile.safeHeight || "ไม่ระบุ";

    const detailsEl = document.getElementById("lightboxDetailsCompact");
    if (detailsEl) {
      detailsEl.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px;">
            <div class="bento-stat-tile">
                <div style="font-size: 10.5px; color: #A1A1AA; font-weight: 700;">อายุ</div>
                <div style="font-weight: 900; font-size: 13px; color: #FFFFFF; margin-top: 2px;">${ageDisplay}</div>
            </div>
            <div class="bento-stat-tile">
                <div style="font-size: 10.5px; color: #A1A1AA; font-weight: 700;">สัดส่วน</div>
                <div style="font-weight: 900; font-size: 13px; color: #FFFFFF; margin-top: 2px;">${statsText}</div>
            </div>
            <div class="bento-stat-tile">
                <div style="font-size: 10.5px; color: #A1A1AA; font-weight: 700;">ส่วนสูง</div>
                <div style="font-weight: 900; font-size: 13px; color: #FFFFFF; margin-top: 2px;">${heightText}</div>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%); padding: 12px 14px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.06); display: flex; flex-direction: column; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #A1A1AA; font-size: 12px; font-weight: 700;"><i class="fas fa-tag" style="color:#C084FC; margin-right:4px;"></i> ค่าขนม</span>
                <span style="color: #00E676; font-weight: 900; font-size: 14px; text-shadow: 0 0 10px rgba(0, 230, 118, 0.4);">${profile.displayPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.06); padding-top: 6px;">
                <span style="color: #A1A1AA; font-size: 12px; font-weight: 700;"><i class="fas fa-map-marker-alt" style="color:#C084FC; margin-right:4px;"></i> พิกัดงาน</span>
                <span style="color: white; font-weight: 800; font-size: 12px;">${profile.location || profile.provinceNameThai || "เชียงใหม่"}</span>
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
      stickyBtnWrapper.style.cssText = "margin-top: 10px; width: 100%;";
      stickyBtnWrapper.innerHTML = `
        <a href="${lineUrl}" target="_blank" rel="noopener nofollow" class="lightbox-line-cta">
            <i class="fab fa-line" style="font-size: 18px;"></i>
            <span>แอดไลน์จองคิว ${nameClean}</span>
        </a>
      `;
      detailsContainer.appendChild(stickyBtnWrapper);
    }

    lightbox.classList.add("active");
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";

    if (window.gsap) {
      gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(wrapper, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" });
    }
  }

  function closeLightboxModal(updateUrl = true) {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      lightbox.style.display = "none";
      lightbox.classList.remove("active");
      document.body.style.overflow = "";

      if (updateUrl && (window.location.pathname.includes("/profile/") || window.location.pathname.includes("/sideline/"))) {
        // 🟢 ตรวจสอบว่าก่อนหน้านี้อยู่จังหวัดอะไร (จากตัวแปร SSR หรือจาก Dropdown)
        const provKey = window.currentProvinceSlug || (DOM.provinceSelect && DOM.provinceSelect.value) || "";
        
        if (provKey && provKey !== "national" && provKey !== "all") {
          // ถ้าอยู่หน้าจังหวัด (เช่น เชียงใหม่) ให้ย้อนกลับไปหน้าจังหวัดเดิม
          history.pushState(null, "", `/location/${provKey}`);
          if (DOM.provinceSelect) DOM.provinceSelect.value = provKey;
          applyUltimateFilters(false);
        } else {
          // ถ้าอยู่หน้าแรกสุด ค่อยกลับไปหน้าแรก
          history.pushState(null, "", "/");
          if (DOM.provinceSelect) DOM.provinceSelect.value = "";
          applyUltimateFilters(false);
        }
      }

      STATE.currentProfileSlug = null;
    }
  }

  function bindMediaProtection() {
    document.querySelectorAll("img").forEach(img => {
      img.addEventListener("contextmenu", e => e.preventDefault());
      img.addEventListener("dragstart", e => e.preventDefault());
    });
  }

  function hideGlobalLoader() {
    const loader = document.getElementById("global-loader-overlay");
    if (loader) loader.style.display = "none";
  }

  // 🟢 1. ฟังก์ชันจัดการข้อความ, จำนวนโปรไฟล์, แผนที่ และ SEO ประจำหน้า (ตัดค่า Hardcode ทิ้ง 100%)
  function replaceDomPlaceholders(provinceName, profileCount, provinceSlug) {
    try {
      // ตรวจสอบว่าเป็นหน้าประเทศ (ทั่วไทย) หรือหน้าจังหวัด
      const isNational = (!provinceSlug || provinceSlug === "national" || provinceSlug === "all" || provinceSlug === "");
      const activeKey = isNational ? "national" : provinceSlug;

      // ดึงชื่อจังหวัดและจำนวนโปรไฟล์จริง (ถ้าไม่มีส่งมา ให้ดึงจากข้อมูลจริงที่มีในระบบ ห้ามใช้เลข 50)
      const realProvName = isNational ? "ทั่วไทย" : (provinceName || STATE.provincesMap.get(activeKey) || "ทั่วไทย");
      const realCount = (typeof profileCount === "number") 
        ? profileCount 
        : (STATE.filteredProfiles?.length ?? STATE.allProfiles?.length ?? 0);

      // ดึงข้อมูล SEO ประจำจังหวัด (ถ้าหน้าทั่วไทย ให้ fallback ไปที่ 'national' ก่อนเสมอ ห้ามไปเชียงใหม่)
      const data = LOCALIZED_SEO_MAP[activeKey] || LOCALIZED_SEO_MAP["national"] || {};
      
      const currentZones = (data.zones && data.zones.length > 0)
        ? data.zones.filter(z => z !== "ทั้งหมด").slice(0, 6).join(", ")
        : (isNational ? "กรุงเทพฯ, เชียงใหม่, พัทยา, ภูเก็ต, ขอนแก่น" : "ตัวเมือง และพื้นที่ใกล้เคียง");

      // 1. อัปเดตตัวเลขสถิติจริงบนหน้าเว็บ
      const liveCountEl = document.getElementById("live-profile-count");
      if (liveCountEl) liveCountEl.textContent = realCount;

      // 2. อัปเดต Template Tag {{...}} ใน DOM Text Nodes
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.includes("{{")) {
          node.nodeValue = node.nodeValue
            .replace(/\{\{PROVINCE_NAME\}\}/g, realProvName)
            .replace(/\{\{PROFILE_COUNT\}\}/g, realCount)
            .replace(/\{\{PROVINCE_ZONES\}\}/g, currentZones);
        }
      }

      // 3. อัปเดตเนื้อหาใน SEO Drawer ให้ตรงกับหน้า (ไม่ดึงข้อความเชียงใหม่มาแสดงในหน้าทั่วไทย)
      const seoContentInner = document.querySelector("#seo-drawer-wrapper .seo-content-inner");
      if (seoContentInner && data.seoContent) {
        seoContentInner.innerHTML = data.seoContent;
      }

      // 4. อัปเดตคำถามที่พบบ่อย (FAQs) ประจำหน้า
      const faqContainer = document.getElementById("faq-container-list");
      if (faqContainer && data.faqs && data.faqs.length > 0) {
        faqContainer.innerHTML = data.faqs.map(item => `
          <div class="faq-item-card">
            <div class="faq-q-row">
               <span class="faq-q-badge">Q</span>
               <div class="faq-question-text">${item.q}</div>
            </div>
            <div class="faq-answer-text">${item.a}</div>
          </div>
        `).join("");
      }

      // 5. อัปเดตรีวิว (Reviews) ประจำหน้า
      const reviewsContainer = document.getElementById("reviews-container-grid");
      if (reviewsContainer && data.reviews && data.reviews.length > 0) {
        reviewsContainer.innerHTML = data.reviews.map(r => `
          <div class="review-card-item">
             <div class="review-card-header">
                <div class="review-user-info">
                   <div class="review-avatar-circle">${r.initial || 'V'}</div>
                   <div>
                      <div class="review-username">${r.name}</div>
                      <div class="review-user-loc">${r.loc}</div>
                   </div>
                </div>
                <div class="review-stars-list">
                   ${Array(r.stars || 5).fill('<i class="fas fa-star"></i>').join('')}
                </div>
             </div>
             <p class="review-comment-body">"${r.text}"</p>
             <span class="review-verified-badge"><i class="fas fa-check-circle"></i> ยืนยันการใช้บริการจริง</span>
          </div>
        `).join("");
      }

// ✅ แก้ไขให้ถูกต้อง:
const mapQueryStr = isNational ? "Thailand" : (data.name || realProvName);
const mapZoomLevel = isNational ? 6 : 12;
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQueryStr)}&t=&z=${mapZoomLevel}&ie=UTF8&iwloc=&output=embed`;
const mapIframe = document.getElementById("google-map");
if (mapIframe) mapIframe.src = mapEmbedUrl;

      // 7. อัปเดต attribute a[href] และ img[alt]
      document.querySelectorAll('a[href*="{{"], img[alt*="{{"]').forEach(el => {
        if (el.href) el.href = el.href.replace(/\{\{PROVINCE_NAME\}\}/g, realProvName);
        if (el.alt) el.alt = el.alt.replace(/\{\{PROVINCE_NAME\}\}/g, realProvName);
      });

    } catch (e) {
      console.error("❌ ข้อผิดพลาดใน replaceDomPlaceholders:", e);
    }
  }

  // 🟢 2. ฟังก์ชันตรวจสอบ URL Routing และสลับหน้าอัตโนมัติ
  async function handleRouteNavigation(isInitial = false) {
    let path = window.location.pathname.toLowerCase().replace(/\/+$/, "");
    if (!path) path = "/";

    // 1. เคสเปิดหน้าโปรไฟล์เดี่ยว (/sideline/:slug หรือ /profile/:slug)
    const profileMatch = path.match(/^\/(?:sideline|profile|app)\/([^/]+)/);
    if (profileMatch) {
      let slug = decodeURIComponent(profileMatch[1]);
      STATE.currentProfileSlug = slug;

      let foundProfile = STATE.allProfiles.find(p => {
        const pSlug = String(p.slug || "").toLowerCase();
        const pId = String(p.id);
        const searchSlug = slug.toLowerCase();
        return pSlug === searchSlug || pId === searchSlug;
      });

      if (!foundProfile && supabaseClient) {
        try {
          const isNumeric = /^\d+$/.test(slug);
          const filterQuery = isNumeric ? `slug.eq.${slug},id.eq.${slug}` : `slug.eq.${slug}`;
          const { data } = await supabaseClient.from("profiles").select("*").or(filterQuery).maybeSingle();
          if (data) foundProfile = processProfileObject(data);
        } catch (e) {}
      }

      if (foundProfile) {
        const provKey = foundProfile.provinceKey || "";
        if (provKey && provKey !== "national" && provKey !== "all") {
          window.currentProvinceSlug = provKey;
          if (DOM.provinceSelect) DOM.provinceSelect.value = provKey;
        }
        openLightboxForProfile(foundProfile);
      }
      return;
    }

    // 2. เคสเปิดหน้ารายจังหวัด (/location/:slug หรือ /province/:slug)
    const locationMatch = path.match(/^\/(?:location|province)\/([^/]+)/);
    if (locationMatch) {
      let provinceSlug = decodeURIComponent(locationMatch[1]).toLowerCase();
      if (provinceSlug === "chiang_mai") provinceSlug = "chiangmai";
      
      STATE.currentProfileSlug = null;
      closeLightboxModal(false);

      window.currentProvinceSlug = provinceSlug;
      if (DOM.provinceSelect) DOM.provinceSelect.value = provinceSlug;
      
      applyUltimateFilters(false);
      return;
    }

    // 3. เคสหน้าแรกสุดระดับประเทศ (/)
    STATE.currentProfileSlug = null;
    window.currentProvinceSlug = "national";
    closeLightboxModal(false);

    // เคลียร์ค่า Dropdown ให้กลับมาที่ "ทั้งหมด / ทั่วไทย"
    if (DOM.provinceSelect) DOM.provinceSelect.value = "";
    
    applyUltimateFilters(false);
  }

  document.addEventListener("DOMContentLoaded", async function () {
    try {
      supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
      window.supabase = supabaseClient;
    } catch (e) {}

    DOM.body = document.body;
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

    const menuToggleBtn = document.getElementById("menu-toggle");
    const sidebarMenu = document.getElementById("sidebar-menu");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const closeMenuBtn = document.getElementById("close-menu-btn");

    const toggleSidebar = (open) => {
      if (!sidebarMenu) return;
      sidebarMenu.classList.toggle("active", open);
      if (sidebarOverlay) {
        sidebarOverlay.classList.toggle("active", open);
      }
      document.body.style.overflow = open ? "hidden" : "";
    };

    if (menuToggleBtn) menuToggleBtn.onclick = () => toggleSidebar(true);
    if (closeMenuBtn) closeMenuBtn.onclick = () => toggleSidebar(false);
    if (sidebarOverlay) sidebarOverlay.onclick = () => toggleSidebar(false);
    sidebarMenu?.querySelectorAll("a").forEach(a => a.onclick = () => toggleSidebar(false));

    const openFilterBtn = document.getElementById("open-filter-dock-btn");
    const closeFilterBtn = document.getElementById("close-search-drawer-btn");
    const applyFilterBtn = document.getElementById("apply-filter-btn");
    const searchSheet = document.getElementById("search-bottom-sheet");
    const searchOverlay = document.getElementById("search-drawer-overlay");

    const toggleSearchSheet = (open) => {
      if (!searchSheet) return;
      searchSheet.classList.toggle("active", open);
      if (searchOverlay) {
        searchOverlay.classList.toggle("active", open);
      }
      document.body.style.overflow = open ? "hidden" : "";
    };

    if (openFilterBtn) openFilterBtn.onclick = () => toggleSearchSheet(true);
    if (closeFilterBtn) closeFilterBtn.onclick = () => toggleSearchSheet(false);
    if (searchOverlay) searchOverlay.onclick = () => toggleSearchSheet(false);

    if (applyFilterBtn) {
      applyFilterBtn.onclick = () => {
        applyUltimateFilters(true);
        toggleSearchSheet(false);
      };
    }

    DOM.provinceSelect?.addEventListener("change", (e) => {
      const selectedKey = e.target.value;
      if (!selectedKey || selectedKey === "all" || selectedKey === "national") {
        window.location.href = "/";
      } else {
        window.location.href = `/location/${selectedKey}`;
      }
    });

    if (DOM.searchInput) {
      DOM.searchInput.addEventListener("input", e => {
        clearTimeout(window.searchTimeout);
        const val = e.target.value;
        const clearBtn = document.getElementById("clear-search-btn");
        if (clearBtn) clearBtn.style.display = val ? "block" : "none";

        window.searchTimeout = setTimeout(() => {
          applyUltimateFilters(true);
          renderSearchSuggestions(val);
        }, 200);
      });

      DOM.searchInput.addEventListener("focus", () => {
        renderSearchSuggestions(DOM.searchInput.value);
      });
    }

    const clearSearchBtn = document.getElementById("clear-search-btn");
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        if (DOM.searchInput) DOM.searchInput.value = "";
        clearSearchBtn.style.display = "none";
        const suggestionsEl = document.getElementById("search-suggestions");
        if (suggestionsEl) suggestionsEl.style.display = "none";
        applyUltimateFilters(true);
      });
    }

    document.body.addEventListener("click", e => {
      const searchInput = document.getElementById("search-keyword");
      const suggestionsEl = document.getElementById("search-suggestions");
      if (suggestionsEl && searchInput && !searchInput.contains(e.target) && !suggestionsEl.contains(e.target)) {
        suggestionsEl.style.display = "none";
      }

      const suggestionItem = e.target.closest('[data-action="suggestion"]');
      if (suggestionItem) {
        const slug = suggestionItem.dataset.slug;
        const isProfile = suggestionItem.dataset.isProfile === "true";
        if (isProfile) {
          if (suggestionsEl) suggestionsEl.style.display = "none";
          toggleSearchSheet(false);
          history.pushState(null, "", `/sideline/${encodeURIComponent(slug)}`);
          handleRouteNavigation();
        } else if (DOM.searchInput) {
          DOM.searchInput.value = slug;
          if (suggestionsEl) suggestionsEl.style.display = "none";
          applyUltimateFilters(true);
        }
        return;
      }

      const cardContainer = e.target.closest(".profile-card-new, .vip-card-item, .interactive-card");
      const cardLink = e.target.closest("a.card-link");
      
      if (cardLink || cardContainer) {
        const targetCard = cardContainer || cardLink?.closest(".profile-card-new, .vip-card-item");
        const profileId = targetCard?.getAttribute("data-profile-id");
        const profileSlug = targetCard?.getAttribute("data-profile-slug");

        if (profileId || profileSlug) {
          e.preventDefault();
          e.stopPropagation();

          let found = STATE.allProfiles.find(p => String(p.id) === String(profileId) || String(p.slug) === String(profileSlug));
          if (found) {
            history.pushState(null, "", `/sideline/${encodeURIComponent(found.slug || found.id)}`);
            openLightboxForProfile(found);
          } else {
            const rawSlug = profileSlug || profileId;
            history.pushState(null, "", `/sideline/${encodeURIComponent(rawSlug)}`);
            handleRouteNavigation();
          }
          return;
        }
      }

      const closeBtn = e.target.closest("#closeLightboxBtn");
      const lightboxModal = e.target.closest("#lightbox");
      if (closeBtn || (lightboxModal && e.target === lightboxModal)) {
        closeLightboxModal(true);
      }
    });

    DOM.availabilitySelect?.addEventListener("change", () => applyUltimateFilters(true));
    DOM.featuredSelect?.addEventListener("change", () => applyUltimateFilters(true));
    DOM.sortSelect?.addEventListener("change", () => applyUltimateFilters(true));

    DOM.resetSearchBtn?.addEventListener("click", () => {
      if (DOM.searchInput) DOM.searchInput.value = "";
      if (DOM.availabilitySelect) DOM.availabilitySelect.value = "";
      if (DOM.featuredSelect) DOM.featuredSelect.value = "";
      if (DOM.sortSelect) DOM.sortSelect.value = "featured";
      const clearBtn = document.getElementById("clear-search-btn");
      if (clearBtn) clearBtn.style.display = "none";
      const suggestionsEl = document.getElementById("search-suggestions");
      if (suggestionsEl) suggestionsEl.style.display = "none";
      applyUltimateFilters(true);
    });

    document.querySelectorAll(".rule-item").forEach(item => {
      const trigger = item.querySelector(".rule-trigger");
      trigger?.addEventListener("click", () => {
        const isCollapsed = item.classList.contains("collapsed");
        document.querySelectorAll(".rule-item").forEach(i => i.classList.add("collapsed"));
        if (isCollapsed) item.classList.remove("collapsed");
      });
    });

    document.querySelectorAll(".region-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".region-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const region = tab.getAttribute("data-region");
        if (region === "ทั้งหมด") window.location.href = "/";
        else if (region === "ภาคเหนือ") window.location.href = "/location/chiangmai";
        else if (region === "กรุงเทพฯ") window.location.href = "/location/bangkok";
      });
    });

    const seoToggleBtn = document.getElementById("toggle-seo-drawer-btn");
    const seoDrawerWrapper = document.getElementById("seo-drawer-wrapper");
    if (seoToggleBtn && seoDrawerWrapper) {
      seoToggleBtn.onclick = () => {
        const isCollapsed = seoDrawerWrapper.classList.toggle("collapsed");
        seoToggleBtn.querySelector("span").textContent = isCollapsed ? "ดูข้อมูลพื้นที่บริการทั้งหมด" : "ย่อข้อความ";
        seoToggleBtn.querySelector("i").className = isCollapsed ? "fas fa-chevron-down" : "fas fa-chevron-up";
      };
    }

    await fetchProfilesData();
    await handleRouteNavigation(true);
    hideGlobalLoader();

    window.addEventListener("popstate", async () => {
      await handleRouteNavigation(false);
    });
  });

})();