/**
 * FirstModelHub - Core Client Application
 * Production Ready - Fully Synchronized with SSR & Bot Engine
 */

const CONFIG = {
  SUPABASE_URL: "https://zxetzqwjaiumqhrpumln.supabase.co",
  SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
  DEFAULT_FALLBACK_IMG: "https://firstmodelhub.com/images/firstmodelhub.webp"
};

let supabaseClient = null;
let supabasePromise = null;

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (supabasePromise) return supabasePromise;

  supabasePromise = (async () => {
    try {
      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.42.0");
      supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
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

  let searchDebounceTimer = null;
  const isEN = document.documentElement.lang === "en" || window.location.pathname.includes("-en");

  const PROVINCE_EN_MAP = {
    chiangmai: "Chiang Mai",
    "chiang-mai": "Chiang Mai",
    chiangrai: "Chiang Rai",
    lampang: "Lampang",
    lamphun: "Lamphun",
    phitsanulok: "Phitsanulok",
    bangkok: "Bangkok",
    chonburi: "Chonburi",
    "khon-kaen": "Khon Kaen",
    khonkaen: "Khon Kaen",
    phuket: "Phuket",
    udonthani: "Udon Thani",
    "phra-nakhon-si-ayutthaya": "Ayutthaya",
    ayutthaya: "Ayutthaya",
    "surat-thani": "Surat Thani",
    suratthani: "Surat Thani",
    "ubon-ratchathani": "Ubon Ratchathani",
    ubon: "Ubon Ratchathani",
    national: "Nationwide (Thailand)"
  };

  const SEO_PROVINCES_DATA = {
    chiangmai: {
      zones: ["ทั้งหมด", "นิมมาน", "สันติธรรม", "เจ็ดยอด", "หลัง มช.", "ช้างเผือก", "สันทราย", "ห้วยแก้ว", "รวมโชค"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานเชียงใหม่</strong> และ <strong>ไซด์ไลน์เชียงใหม่</strong> สไตล์ฟิวแฟนพรีเมียม สแตนด์บายย่านนิมมาน เจ็ดยอด สันติธรรม และหลัง มช. การันตีตัวจริงตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ</p>"
    },
    chiangrai: {
      zones: ["ทั้งหมด", "ตัวเมืองเชียงราย", "บ้านดู่", "มฟล.", "หอนาฬิกา", "แม่สาย", "รอบเวียง"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานเชียงราย</strong> และ <strong>ไซด์ไลน์เชียงราย</strong> เพื่อนเที่ยวเด็กเอ็น โซนตัวเมือง บ้านดู่ และหน้า มฟล. การันตีตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ</p>"
    },
    lampang: {
      zones: ["ทั้งหมด", "ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏลำปาง", "สบตุ๋ย", "เซ็นทรัลลำปาง"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานลำปาง</strong> และ <strong>ไซด์ไลน์ลำปาง</strong> เพื่อนเที่ยวฟิวแฟน โซนตัวเมืองลำปาง สวนดอก และ ม.ราชภัฏลำปาง ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ</p>"
    },
    lamphun: {
      zones: ["ทั้งหมด", "ตัวเมืองลำพูน", "นิคมลำพูน", "เวียงยอง", "ป่าซาง", "เหมืองง่า", "บ้านกลาง"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานลำพูน</strong> และ <strong>ไซด์ไลน์ลำพูน</strong> พรีเมียม ตรงปก 100% สแตนด์บายโซนนิคมลำพูนและตัวเมือง ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ</p>"
    },
    phitsanulok: {
      zones: ["ทั้งหมด", "ตัวเมืองพิษณุโลก", "รอบ มน.", "ท่าโพธิ์", "สมอแข", "ท็อปแลนด์", "เซ็นทรัลพิษณุโลก"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานพิษณุโลก</strong> และ <strong>ไซด์ไลน์พิษณุโลก</strong> เพื่อนเที่ยวฟิวแฟน โซนรอบ มน. และตัวเมืองพิษณุโลก ตรงปก 100% จ่ายหน้างาน ไม่โอนมัดจำ</p>"
    },
    bangkok: {
      zones: ["ทั้งหมด", "สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย", "สาทร", "บางนา"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานกรุงเทพ</strong> และ <strong>ไซด์ไลน์ กทม</strong> ระดับไฮเอนด์ เพื่อนเที่ยวดินเนอร์และเอาท์คอลโรงแรมหรู สุขุมวิท รัชดา ทองหล่อ สาทร ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มัดจำ</p>"
    },
    chonburi: {
      zones: ["ทั้งหมด", "พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี", "จอมเทียน", "อมตะนคร", "แหลมฉบัง"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานพัทยา</strong> สาวรับงานชลบุรี และไซด์ไลน์บางแสน เพื่อนเที่ยวฟิวแฟนริมทะเล ตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ</p>"
    },
    "khon-kaen": {
      zones: ["ทั้งหมด", "ในตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานขอนแก่น</strong> และ <strong>ไซด์ไลน์ขอนแก่น</strong> เด็กเอ็นฟิวแฟน สแตนด์บายโซนกังสดาล หลัง มข. เซ็นทรัลขอนแก่น ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ</p>"
    },
    khonkaen: {
      zones: ["ทั้งหมด", "ในตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานขอนแก่น</strong> และ <strong>ไซด์ไลน์ขอนแก่น</strong> เด็กเอ็นฟิวแฟน สแตนด์บายโซนกังสดาล หลัง มข. เซ็นทรัลขอนแก่น ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ</p>"
    },
    phuket: {
      zones: ["ทั้งหมด", "ป่าตอง", "กะทู้", "ฉลอง", "กะรน", "กะตะ", "บางเทา", "ราไวย์", "เชิงทะเล"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานภูเก็ต</strong> และ VIP Travel Companions พูลวิลล่าและโรงแรมหรูย่านป่าตอง กะทู้ บางเทา ราไวย์ การันตีตรงปก 100% สื่อสารภาษาอังกฤษได้ จ่ายหน้างาน ไม่มัดจำ</p>"
    },
    udonthani: {
      zones: ["ทั้งหมด", "ตัวเมืองอุดร", "UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร", "บ้านจาน", "โพศรี"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานอุดรธานี</strong> และ <strong>ไซด์ไลน์อุดรธานี</strong> เพื่อนเที่ยวเด็กเอ็น โซนตัวเมือง UD Town เซ็นทรัลอุดร สวนสาธารณะหนองประจักษ์ ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มัดจำ</p>"
    },
    national: {
      zones: ["ทั้งหมด", "กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "พัทยา", "ภูเก็ต", "ขอนแก่น", "อุดรธานี", "เชียงราย"],
      seoContent: "<p>ศูนย์รวม <strong>สาวรับงานทั่วไทย</strong> ไซด์ไลน์ทั่วไทย เด็กเอ็นฟิวแฟนพรีเมียม ครอบคลุม 77 จังหวัดทั่วประเทศ ตรงปก 100% ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำล่วงหน้า</p>"
    }
  };

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
    const num = parseInt(String(rate).replace(/\D/g, ""), 10);
    if (isNaN(num) || num <= 0) return "1.5k";
    if (num >= 1000) {
      const kVal = num / 1000;
      return (kVal % 1 === 0 ? kVal : kVal.toFixed(1)) + "k";
    }
    return String(num);
  }

  function optimizeImg(imagePath, width = 400, height = null) {
    if (!imagePath) return CONFIG.DEFAULT_FALLBACK_IMG;
    if (Array.isArray(imagePath)) imagePath = imagePath[0];
    if (typeof imagePath === "object" && imagePath !== null) {
      imagePath = imagePath.src || imagePath.url || imagePath.imagePath || imagePath.image_url || "";
    }
    if (typeof imagePath !== "string" || !imagePath.trim()) return CONFIG.DEFAULT_FALLBACK_IMG;

    const cleanPath = imagePath.trim();
    const cropParam = height
      ? `f_auto,q_auto,w_${width},h_${height},c_fill,g_face`
      : `c_scale,w_${width},q_auto,f_auto`;

    if (cleanPath.includes("res.cloudinary.com")) {
      const uploadIdx = cleanPath.indexOf("/upload/");
      if (uploadIdx !== -1) {
        const base = cleanPath.substring(0, uploadIdx + 8);
        let rest = cleanPath.substring(uploadIdx + 8);
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
    return `https://res.cloudinary.com/drffioary/image/upload/${cropParam}/${formatted}`;
  }

  function normalizeProfile(raw) {
    if (!raw || typeof raw !== "object") return null;

    const displayName = formatDisplayName(raw.name || raw.displayName || raw.title || "Model");
    const mainImg = raw.imagePath || raw.image_url || raw.imageUrl || raw.image || raw.photo || raw.avatar;
    const gallery = raw.galleryPaths || raw.gallery_paths || raw.gallery || raw.photos || raw.images || [];
    const combinedPhotos = [
      mainImg,
      ...(Array.isArray(gallery) ? gallery : typeof gallery === "string" ? gallery.split(",").map(s => s.trim()) : [])
    ].filter(Boolean);

    let images = [...new Set(combinedPhotos)].map(img => {
      if (typeof img === "object" && img !== null) {
        return {
          src: img.src || img.url || CONFIG.DEFAULT_FALLBACK_IMG,
          fullSrc: img.fullSrc || img.fullUrl || img.src || img.url || CONFIG.DEFAULT_FALLBACK_IMG
        };
      }
      return {
        src: optimizeImg(img, 400, 560),
        fullSrc: optimizeImg(img, 1000, null)
      };
    });

    if (images.length === 0) {
      images.push({ src: CONFIG.DEFAULT_FALLBACK_IMG, fullSrc: CONFIG.DEFAULT_FALLBACK_IMG });
    }

    let pKey = (raw.provinceKey || raw.province_slug || raw.province_key || raw.province || "chiangmai").toString().toLowerCase().trim();
    if (pKey === "chiang_mai" || pKey === "chiang-mai") pKey = "chiangmai";

    const provinceThai = appState.provincesMap.get(pKey) || raw.provinceThai || raw.province_thai || raw.provinceName || "เชียงใหม่";
    const rawRate = raw.rate || raw.price || raw.fee || raw.cost || 0;
    const numPrice = Number(String(rawRate).replace(/\D/g, "")) || 0;
    const displayPrice = numPrice > 0 ? `${numPrice.toLocaleString()}.-` : typeof rawRate === "string" && rawRate.trim() !== "" ? rawRate : (isEN ? "Inquire" : "สอบถาม");

    let statsStr = "-";
    const bust = raw.bust || raw.breast || "";
    const waist = raw.waist || "";
    const hips = raw.hip || raw.hips || "";
    const cup = (raw.cup_size || raw.cupSize || raw.cup || "").toString().toUpperCase().trim();

    if (bust && waist && hips) {
      statsStr = `${bust}${cup}-${waist}-${hips}`;
    } else if (raw.stats || raw.proportion || raw.proportions) {
      statsStr = String(raw.stats || raw.proportion || raw.proportions).trim();
    }

    const rawAge = raw.age || raw.profile_age;
    const cleanAge = rawAge && String(rawAge).trim() !== "-" && String(rawAge).trim() !== "0" ? String(rawAge).replace(/\D/g, "") : null;
    const ageDisplay = cleanAge ? (isEN ? `${cleanAge} yrs` : `${cleanAge} ปี`) : (isEN ? "N/A" : "ไม่ระบุ");

    const rawHeight = raw.height || raw.profile_height;
    const cleanHeight = rawHeight && String(rawHeight).trim() !== "-" && String(rawHeight).trim() !== "0" ? String(rawHeight).replace(/\D/g, "") : null;
    const heightDisplay = cleanHeight ? `${cleanHeight} cm` : (isEN ? "N/A" : "ไม่ระบุ");

    const rawWeight = raw.weight || raw.profile_weight;
    const cleanWeight = rawWeight && String(rawWeight).trim() !== "-" && String(rawWeight).trim() !== "0" ? String(rawWeight).replace(/\D/g, "") : null;
    const weightDisplay = cleanWeight ? `${cleanWeight} kg` : (isEN ? "N/A" : "ไม่ระบุ");

    const slogan = raw.slogan || raw.quote || raw.tagline || (isEN ? "Romantic Girlfriend Experience, verified photos" : "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน");
    const rawTags = raw.style_tags || raw.styleTags || raw.tags || [];
    const styleTags = Array.isArray(rawTags) ? rawTags : typeof rawTags === "string" ? rawTags.split(",").map(s => s.trim()) : [];

    const availabilityStatus = raw.availability || raw.status || (isEN ? "Available" : "รับงาน");
    const isAvail = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "off", "busy"].some(s => availabilityStatus.toLowerCase().includes(s));
    const lineId = (raw.line_id || raw.lineId || raw.line || "").toString().replace(/^@/, "").trim();

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
      safeStats: statsStr && statsStr !== "-" ? statsStr : (isEN ? "N/A" : "ไม่ระบุ"),
      isAvailable: isAvail,
      availability: availabilityStatus,
      isVerified: raw.verified === true || raw.isVerified === true || raw.is_verified === true,
      hasVideo: raw.has_video === true || raw.hasVideo === true,
      isfeatured: raw.isfeatured === true || raw.is_featured === true || raw.isFeatured === true,
      lineId,
      styleTags
    };
  }

  function createVipCardHtml(p, idx) {
    const rankBadge = `#${idx + 1} HOT`;
    const pKey = (p.provinceKey || "national").toLowerCase();
    const locationText = isEN ? (PROVINCE_EN_MAP[pKey] || pKey) : (p.location || p.provinceNameThai || "ทั่วไทย");
    const slug = encodeURIComponent(p.slug || p.id);
    const imgSrc = p.images[0]?.src || CONFIG.DEFAULT_FALLBACK_IMG;
    const isOnline = p.isAvailable !== undefined ? p.isAvailable : !(p.availability || "").toLowerCase().includes("ไม่ว่าง");
    const statusLabel = isEN ? (isOnline ? "Available" : "Inquire") : (isOnline ? "รับงาน" : "สอบถาม");

    return `
      <div class="vip-card-item ${idx === 0 ? "active-glow" : ""}" data-profile-id="${p.id}" data-profile-slug="${slug}">
        <span class="vip-status-chip"><span aria-hidden="true">🟢</span> ${statusLabel}</span>
        <span class="hot-rank-badge">${rankBadge}</span>
        <img src="${imgSrc}" 
             alt="${escapeHTML(p.displayName)} สาวรับงาน${escapeHTML(p.provinceNameThai || '')} ฟิวแฟน ตรงปก 100%" 
             width="175" 
             height="245" 
             loading="${idx === 0 ? "eager" : "lazy"}" 
             fetchpriority="${idx === 0 ? "high" : "auto"}" 
             decoding="async" 
             onerror="this.onerror=null; this.src='${CONFIG.DEFAULT_FALLBACK_IMG}'">
        <div class="vip-card-overlay"></div>
        <a href="/sideline/${slug}" class="card-link" aria-label="ดูโปรไฟล์ ${escapeHTML(p.displayName)}"></a>
        <div class="vip-card-info">
          <h3 class="vip-name" style="margin:0; font-size:14px; font-weight:900;">${escapeHTML(p.displayName)}</h3>
          <div class="vip-location">${escapeHTML(locationText)}</div>
        </div>
      </div>
    `;
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
    if (!vipSwiperEl || vipSwiperEl.children.length > 0) return;
    
    let hotProfiles = appState.allProfiles.filter(p => {
      const combinedKeywords = `${(Array.isArray(p.styleTags) ? p.styleTags : []).join(" ")} ${p.slogan || ""} ${p.quote || ""}`.toLowerCase();
      return combinedKeywords.includes("ฟิวแฟน") || combinedKeywords.includes("ฟิลแฟน") || combinedKeywords.includes("gfe");
    });

    hotProfiles = hotProfiles.length === 0 ? appState.allProfiles.slice(0, 8) : hotProfiles.slice(0, 8);
    vipSwiperEl.innerHTML = hotProfiles.map((p, idx) => createVipCardHtml(p, idx)).join("");
  }

  function executeFilterAndRender(isUserTriggered = true) {
    try {
      const pathMatch = window.location.pathname.toLowerCase().match(/^\/(?:location|province)\/([^/]+)/);
      const urlProvince = pathMatch ? decodeURIComponent(pathMatch[1]) : null;

      let activeProvince = "all";
      if (urlProvince && urlProvince !== "profiles") {
        activeProvince = urlProvince;
      } else if (domCache.provinceSelect && domCache.provinceSelect.value && domCache.provinceSelect.value !== "") {
        activeProvince = domCache.provinceSelect.value;
      }
      if (activeProvince === "chiang_mai") activeProvince = "chiangmai";

      const currentCriteria = {
        text: (domCache.searchInput?.value || "").trim(),
        province: activeProvince,
        avail: domCache.availabilitySelect?.value || "all",
        featured: domCache.featuredSelect?.value === "true",
        sort: domCache.sortSelect?.value || "featured"
      };

      let results = [...appState.allProfiles];

      if (activeProvince !== "all" && activeProvince !== "national") {
        const cleanActive = activeProvince.toLowerCase().replace(/[-_]/g, "");
        results = results.filter(p => {
          const cleanK = (p.provinceKey || p.province_slug || p.province || "").toString().toLowerCase().replace(/[-_]/g, "");
          return cleanK === cleanActive;
        });
      }

      if (appState.activePillTag && appState.activePillTag !== "all") {
        const filterTag = appState.activePillTag.toLowerCase().trim();
        results = results.filter(p => {
          const tagStr = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : (p.styleTags || "")).toLowerCase();
          const descStr = (p.description || "").toLowerCase();
          const sloganStr = (p.slogan || p.quote || "").toLowerCase();
          const locStr = (p.location || "").toLowerCase();
          const combined = `${tagStr} ${descStr} ${sloganStr} ${locStr}`;

          if (filterTag === "ตรงปก") return p.isVerified || combined.includes("ตรงปก");
          return combined.includes(filterTag);
        });
      }

      if (currentCriteria.text) {
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
            priceStr.includes(k)
          ));
        });
      }

      if (currentCriteria.avail && currentCriteria.avail !== "all") {
        results = results.filter(p => p.availability === currentCriteria.avail);
      }

      if (currentCriteria.featured) {
        results = results.filter(p => p.isfeatured === true);
      }

      if (!currentCriteria.text) {
        results.sort((a, b) => {
          switch (currentCriteria.sort) {
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

      const isAllOrNational = activeProvince === "all" || activeProvince === "national";
      const resolvedSlug = isAllOrNational ? "national" : activeProvince;
      const provinceDisplayName = isEN 
        ? (PROVINCE_EN_MAP[resolvedSlug] || "Thailand") 
        : (isAllOrNational ? "ทั่วไทย" : appState.provincesMap.get(resolvedSlug) || "ทั่วไทย");

      renderDisplayArea(results, activeProvince !== "all" || Boolean(currentCriteria.text) || appState.activePillTag !== "all");
      appState.currentFilters = currentCriteria;
      appState.filteredProfiles = results;
      replaceDomPlaceholders(provinceDisplayName, results.length, activeProvince);
    } catch (err) {
      console.error("Filter error:", err);
    }
  }

  async function renderDisplayArea(profiles, isFilteredOrLocationView) {
    if (!domCache.profilesDisplayArea) return;

    appState.renderId = (appState.renderId || 0) + 1;
    const activeRenderId = appState.renderId;

    domCache.noResultsMessage?.classList.add("hidden");
    domCache.fetchErrorMessage?.classList.add("hidden");

    if (domCache.featuredSection) {
      const isHomeView = !isFilteredOrLocationView && !window.location.pathname.includes("/location/") && !window.location.pathname.includes("/province/") && (!appState.activePillTag || appState.activePillTag === "all");
      const featuredList = appState.allProfiles.filter(p => p.isfeatured).slice(0, 8);
      const hasFeatured = featuredList.length > 0;
      
      domCache.featuredSection.classList.toggle("hidden", !isHomeView || !hasFeatured);
      if (isHomeView && hasFeatured && domCache.featuredContainer) {
        await renderProfilesBatch(domCache.featuredContainer, featuredList, activeRenderId);
      }
    }

    if (!profiles || profiles.length === 0) {
      domCache.profilesDisplayArea.innerHTML = "";
      domCache.noResultsMessage?.classList.remove("hidden");
      return;
    }

    const isExplicitLocationPath = window.location.pathname.includes("/location/") || window.location.pathname.includes("/province/");

    if (isFilteredOrLocationView || isExplicitLocationPath || (appState.activePillTag && appState.activePillTag !== "all")) {
      const routeMatch = window.location.pathname.match(/^\/(?:location|province)\/([^/]+)/);
      const currentLocSlug = routeMatch ? decodeURIComponent(routeMatch[1]).toLowerCase() : domCache.provinceSelect?.value || "chiangmai";
      const provinceLabel = isEN ? (PROVINCE_EN_MAP[currentLocSlug] || currentLocSlug) : (appState.provincesMap.get(currentLocSlug) || "เชียงใหม่");
      const searchKeyword = domCache.searchInput?.value?.trim();
      
      let sectionTitle = isEN ? `📍 Models in <span class="province-name-highlight">${escapeHTML(provinceLabel)}</span>` : `📍 น้องๆ ในจังหวัด <span class="province-name-highlight">${escapeHTML(provinceLabel)}</span>`;
      
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
    } else {
      const groupedByProvince = profiles.reduce((acc, p) => {
        const k = p.provinceKey || "no_province";
        acc[k] = acc[k] || [];
        acc[k].push(p);
        return acc;
      }, {});

      const sortedProvinceKeys = Object.keys(groupedByProvince).sort((a, b) => {
        const nameA = String(appState.provincesMap.get(a) || a || "");
        const nameB = String(appState.provincesMap.get(b) || b || "");
        return nameA.localeCompare(nameB, "th");
      });

      if (sortedProvinceKeys.length > 0) {
        domCache.profilesDisplayArea.innerHTML = "";
        for (const pKey of sortedProvinceKeys) {
          if (appState.renderId !== activeRenderId) return;
          const provName = isEN ? (PROVINCE_EN_MAP[pKey] || pKey) : (appState.provincesMap.get(pKey) || pKey);
          const sectionEl = createProvinceSectionDOM(pKey, provName, groupedByProvince[pKey]);
          domCache.profilesDisplayArea.appendChild(sectionEl);
          const gridEl = sectionEl.querySelector(".profile-grid");
          await renderProfilesBatch(gridEl, groupedByProvince[pKey], activeRenderId);
        }
      } else {
        domCache.profilesDisplayArea.innerHTML = "";
        domCache.noResultsMessage?.classList.remove("hidden");
      }
    }
  }

  function replaceDomPlaceholders(provinceName, count, currentSlug) {
    const totalCount = typeof count === "number" ? count : appState.filteredProfiles?.length ?? appState.allProfiles?.length ?? 0;
    const isAllOrNational = !currentSlug || currentSlug === "national" || currentSlug === "all";
    const targetName = isAllOrNational ? "ทั่วไทย" : (provinceName || "ทั่วไทย");

    const liveCounterEl = document.getElementById("live-profile-count");
    if (liveCounterEl) liveCounterEl.textContent = `${totalCount}`;

    const liveProvinceEl = document.getElementById("live-province-count");
    if (liveProvinceEl) {
      const totalProvincesCount = appState.provincesMap.size || (window.provincesData ? window.provincesData.length : 0);
      liveProvinceEl.textContent = isAllOrNational ? `${totalProvincesCount}` : "1";
    }

    const heroH1 = document.getElementById("hero-h1");
    if (heroH1) {
      if (isEN) {
        const enLocName = isAllOrNational ? "Thailand" : (PROVINCE_EN_MAP[currentSlug] || currentSlug);
        heroH1.innerHTML = `
          <span class="h1-line-1">${escapeHTML(enLocName)} Escorts & VIP Companions</span>
          <span class="h1-line-2">100% Real Photos • Pay on Arrival</span>
        `;
      } else {
        const line1 = isAllOrNational ? "สาวรับงาน ไซด์ไลน์ทั่วไทย" : `สาวรับงาน${escapeHTML(targetName)} ไซด์ไลน์${escapeHTML(targetName)}`;
        heroH1.innerHTML = `
          <span class="h1-line-1">${line1}</span>
          <span class="h1-line-2">& ฟิวแฟน ตรงปก 100%</span>
        `;
      }
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
      const labelTopSearch = isEN ? "Popular Searches:" : "คำค้นหายอดนิยม:";
      const labelGFE = isEN ? "❤️ #GFE" : "❤️ #ฟิวแฟน";

      let html = '<div style="background-color: #FFFFFF; border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 14px; box-shadow: 0 10px 30px rgba(20, 10, 40, 0.08);">';
      html += `<div style="font-size: 11.5px; font-weight: 800; color: #7C3AED; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;"><i class="fas fa-lightbulb" style="color: #D97706;"></i> ${labelTopSearch}</div>`;
      html += '<div style="display: flex; flex-wrap: wrap; gap: 6px;">';
      html += `<span data-action="suggestion" data-slug="${isEN ? "GFE" : "ฟิวแฟน"}" data-is-profile="false" style="background: #FFE4E6; border: 1px solid rgba(225, 29, 72, 0.2); color: #E11D48; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">${labelGFE}</span>`;
      html += '<span data-action="suggestion" data-slug="1500" data-is-profile="false" style="background: rgba(5, 150, 105, 0.08); border: 1px solid rgba(5, 150, 105, 0.2); color: #059669; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">💰 1,500.-</span>';
      html += "</div></div>";
      popover.innerHTML = html;
      popover.style.display = "block";
      return;
    }

    const cleanKeyword = query.replace(/^(น้อง\s?)+/gi, "").trim();
    const matchedProfiles = appState.allProfiles.filter(p => {
      const name = (p.displayName || p.name || "").toLowerCase().replace(/^(น้อง\s?)+/gi, "").trim();
      const loc = (p.location || "").toLowerCase();
      const idStr = String(p.id || "");
      return name.includes(cleanKeyword) || loc.includes(query) || idStr === query;
    }).slice(0, 4);

    if (matchedProfiles.length === 0) {
      popover.style.display = "none";
      return;
    }

    let popoverHtml = '<div style="background-color: #FFFFFF; border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(20, 10, 40, 0.08);">';
    popoverHtml += `<div style="padding: 7px 12px; background: #EDE9FE; font-size: 11px; font-weight: 800; color: #7C3AED;">${isEN ? "✨ Featured Companions" : "✨ โปรไฟล์แนะนำ"}</div>`;
    matchedProfiles.forEach(p => {
      const avatar = p.images && p.images[0] ? p.images[0].src : CONFIG.DEFAULT_FALLBACK_IMG;
      popoverHtml += `
        <div class="suggestion-item" data-action="suggestion" data-slug="${encodeURIComponent(p.slug || p.id)}" data-is-profile="true" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0,0,0,0.04);">
            <img src="${avatar}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;">
            <div style="flex: 1; min-width: 0; text-align: left;">
                <div style="font-size: 13px; font-weight: 800; color: #0D081B;">${p.displayName || p.name}</div>
                <div style="font-size: 11px; color: #716486;">📍 ${p.location || p.provinceNameThai}</div>
            </div>
            <span style="color: #059669; font-weight: 800; font-size: 13px;">${p.displayPrice}</span>
        </div>
      `;
    });
    popoverHtml += "</div>";
    popover.innerHTML = popoverHtml;
    popover.style.display = "block";
  }

  function createProfileCardDOM(p, index = 20) {
    const container = document.createElement("div");
    container.className = "profile-card-new-container";

    const article = document.createElement("article");
    article.className = "profile-card-new interactive-card";
    article.setAttribute("data-profile-id", p.id);
    article.setAttribute("data-profile-slug", p.slug || p.id);

    const rawImg = p.imagePath || p.image_url || p.imageUrl || (p.images && p.images[0] ? p.images[0].src : "") || CONFIG.DEFAULT_FALLBACK_IMG;
    const imgSrc = optimizeImg(rawImg, 400, 560);
    const cardSrcSet = `${optimizeImg(rawImg, 320, 448)} 320w, ${optimizeImg(rawImg, 400, 560)} 400w, ${optimizeImg(rawImg, 600, 840)} 600w`;
    
    let rawName = p.displayName || p.name || "Model";
    const modelName = isEN ? (p.name_en || rawName.replace(/^(น้อง|สาว|พี่)\s?/gi, "").trim()) : formatDisplayName(rawName);
    
    const ageVal = p.safeAge || p.age;
    const ageDisplay = ageVal && String(ageVal).trim() !== "-" && String(ageVal).trim() !== "0" 
      ? (isEN ? `${String(ageVal).replace(/\D/g, "")} yrs` : `${String(ageVal).replace(/\D/g, "")} ปี`) 
      : "";
    
    let rawLoc = String(isEN ? (PROVINCE_EN_MAP[p.provinceKey] || p.location || "Thailand") : (p.location || p.provinceNameThai || "ทั่วไทย"));
    let locName = rawLoc.replace(/^(ในตัวเมือง|ตัวเมือง|โซน|ย่าน)\s*(\/|และ)?\s*/gi, "").split(/[,/]|และใกล้/)[0].trim() || rawLoc;

    const isOnline = p.isAvailable !== undefined 
      ? Boolean(p.isAvailable) 
      : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "busy", "off"].some(s => String(p.availability || p.status || "").toLowerCase().includes(s));
      
    const statusClass = isOnline ? "status-online" : "status-busy";
    const availText = isEN ? (isOnline ? "Available" : "Inquire") : (isOnline ? "รับงาน" : "สอบถาม");
    const luxuryPrice = formatLuxuryRate(p.rate || p._price || p.price);
    const profileSlug = encodeURIComponent(p.slug || p.id);

    article.innerHTML = `
      <img src="${imgSrc}" 
           srcset="${cardSrcSet}"
           sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
           alt="${escapeHTML(modelName)} สาวรับงาน${p.provinceNameThai || ''} ฟิวแฟน ตรงปก 100%"
           width="400"
           height="560"
           class="profile-card-img"
           loading="${index < 4 ? "eager" : "lazy"}"
           fetchpriority="${index === 0 ? "high" : "auto"}"
           decoding="async"
           onerror="this.onerror=null; this.src='${CONFIG.DEFAULT_FALLBACK_IMG}';" />
           
      <div class="profile-card-gradient-overlay"></div>

      <div class="profile-card-badges-top">
          <div class="badges-left">
              <span class="badge-status ${statusClass}">
                  <span class="status-dot"></span>
                  <span>${availText}</span>
              </span>
          </div>
          <div class="badges-right">
              <span class="badge-verified-top">✦ ${isEN ? "Verified" : "ตรงปก"}</span>
          </div>
      </div>
      
      <a href="/sideline/${profileSlug}" class="card-link" aria-label="ดูโปรไฟล์ ${escapeHTML(modelName)}"></a>

      <div class="profile-card-info-content">
          <div class="profile-card-title-row">
              <h3 class="profile-card-name">${escapeHTML(modelName)}</h3>
              ${ageDisplay ? `<span class="profile-card-age-tag">${ageDisplay}</span>` : ""}
          </div>
          <div class="profile-card-bottom-row">
              <span class="profile-card-location">
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

  window.openLightboxModal = function (profile) {
    if (!profile) return;
    const lightboxEl = document.getElementById("lightbox");
    if (!lightboxEl) return;

    const nameStr = profile.displayName || formatDisplayName(profile.name);
    const isAvail = profile.isAvailable !== undefined
      ? profile.isAvailable
      : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(s => (profile.availability || "").toLowerCase().includes(s));
    
    const availStatus = isEN ? (isAvail ? "Available" : "Book Ahead") : (profile.availability || (isAvail ? "รับงาน" : "สอบถามคิว"));
    const statusColor = isAvail ? "#059669" : "#E11D48";

    const nameMainEl = document.getElementById("lightbox-profile-name-main");
    if (nameMainEl) {
      nameMainEl.innerHTML = `
        <span style="font-size: clamp(20px, 5vw, 24px) !important; font-weight: 900 !important;">${nameStr}</span>
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

    const images = Array.isArray(profile.images) && profile.images.length > 0
      ? profile.images
      : [{ src: CONFIG.DEFAULT_FALLBACK_IMG, fullSrc: CONFIG.DEFAULT_FALLBACK_IMG }];

    const heroImg = document.getElementById("lightboxHeroImage");
    if (heroImg) {
      heroImg.src = images[0]?.fullSrc || images[0]?.src || CONFIG.DEFAULT_FALLBACK_IMG;
      heroImg.alt = `${nameStr} รูปถ่ายตัวจริงตรงปก 100%`;
    }

    const quoteEl = document.getElementById("lightboxQuote");
    if (quoteEl) {
      quoteEl.textContent = profile.quote || profile.slogan || (isEN ? "Romantic Girlfriend Experience." : "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน");
      quoteEl.style.display = "block";
    }

    const detailsCompactEl = document.getElementById("lightboxDetailsCompact");
    if (detailsCompactEl) {
      detailsCompactEl.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px;">
            <div class="bento-stat-tile">
                <div style="font-size: 10.5px; color: #827894; font-weight: 700;">อายุ</div>
                <div style="font-weight: 900; font-size: 14px; color: #140F22; margin-top: 2px;">${profile.safeAgeDisplay}</div>
            </div>
            <div class="bento-stat-tile">
                <div style="font-size: 10.5px; color: #827894; font-weight: 700;">สัดส่วน</div>
                <div style="font-weight: 900; font-size: 14px; color: #140F22; margin-top: 2px;">${profile.safeStats}</div>
            </div>
            <div class="bento-stat-tile">
                <div style="font-size: 10.5px; color: #827894; font-weight: 700;">ส่วนสูง</div>
                <div style="font-weight: 900; font-size: 14px; color: #140F22; margin-top: 2px;">${profile.safeHeight}</div>
            </div>
        </div>

        <div style="background: #F0ECF8; padding: 12px 14px; border-radius: 16px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #4A4458; font-size: 12px; font-weight: 700;">ค่าขนม</span>
                <span style="color: #059669; font-weight: 900; font-size: 15px;">${profile.displayPrice}</span>
            </div>
        </div>
      `;
    }

    const detailsParent = document.querySelector(".lightbox-details");
    if (detailsParent) {
      const oldLineBtn = document.getElementById("line-btn-sticky-wrapper");
      if (oldLineBtn) oldLineBtn.remove();

      const cleanLine = (profile.lineId || "ksLUWB89Y_").replace(/^@/, "").trim();
      let lineUrl = cleanLine.startsWith("http") ? cleanLine : `https://line.me/ti/p/${cleanLine || "ksLUWB89Y_"}`;

      const lineWrapper = document.createElement("div");
      lineWrapper.id = "line-btn-sticky-wrapper";
      lineWrapper.style.cssText = "margin-top: 10px; width: 100%;";
      
      const lineBtnText = isEN ? `Book ${nameStr} via LINE` : `แอดไลน์จองคิว ${nameStr}`;
      lineWrapper.innerHTML = `
        <a href="${lineUrl}" target="_blank" rel="noopener nofollow" class="lightbox-line-cta" onclick="window.trackLineClick('${profile.id}')">
            <i class="fab fa-line" style="font-size: 18px;"></i>
            <span>${lineBtnText}</span>
        </a>
      `;
      detailsParent.appendChild(lineWrapper);
    }

    lightboxEl.classList.add("active");
    lightboxEl.style.display = "flex";
    lightboxEl.style.pointerEvents = "auto";
    document.body.style.overflow = "hidden";
  };

  window.closeLightboxModal = function (updateHistory = true) {
    const lightboxEl = document.getElementById("lightbox");
    if (lightboxEl) {
      lightboxEl.style.display = "none";
      lightboxEl.classList.remove("active");
      lightboxEl.style.pointerEvents = "none";
      document.body.style.overflow = "";

      if (updateHistory && (window.location.pathname.includes("/profile/") || window.location.pathname.includes("/sideline/"))) {
        const slug = window.currentProvinceSlug || (domCache.provinceSelect && domCache.provinceSelect.value) || "";
        if (slug && slug !== "national" && slug !== "all") {
          history.pushState(null, "", `/location/${slug}`);
        } else {
          history.pushState(null, "", isEN ? "/index-en" : "/");
        }
      }
      appState.currentProfileSlug = null;
    }
  };

  async function handleUrlRouting(isInitial = false) {
    let rawPath = window.location.pathname.replace(/\/+$/, "") || "/";

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

    const locationMatch = rawPath.match(/^\/(?:location|province)\/([^/]+)/i);
    if (locationMatch) {
      let locSlug = decodeURIComponent(locationMatch[1]).toLowerCase().trim();
      if (locSlug === "chiang_mai") locSlug = "chiangmai";

      appState.currentProfileSlug = null;
      window.closeLightboxModal(false);
      window.currentProvinceSlug = locSlug;
      if (domCache.provinceSelect) domCache.provinceSelect.value = locSlug;

      executeFilterAndRender(false);
      return;
    }

    appState.currentProfileSlug = null;
    window.currentProvinceSlug = "national";
    window.closeLightboxModal(false);
    if (domCache.provinceSelect) domCache.provinceSelect.value = "";

    executeFilterAndRender(false);
  }

  function initAgencyStories() {
    const trackEl = document.getElementById("agency-stories-track");
    if (!trackEl) return;

    const profiles = appState.allProfiles;
    if (!profiles || profiles.length === 0) return;

    const topModels = profiles.slice(0, 15);
    let singleHtml = "";

    topModels.forEach(p => {
      const rawName = p.displayName || p.name || "โมเดล";
      const name = rawName.replace(/^(น้อง\s?)+/gi, "").trim();
      const rawImg = p.imagePath || p.image_url || (p.images && p.images[0] ? p.images[0].src : "") || CONFIG.DEFAULT_FALLBACK_IMG;
      const slug = encodeURIComponent(p.slug || p.id || name);
      
      const isOnline = p.isAvailable !== undefined 
        ? Boolean(p.isAvailable) 
        : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "busy", "off"].some(s => String(p.availability || "").toLowerCase().includes(s));
      
      const statusClass = isOnline ? "online" : "busy";

      singleHtml += `
        <div class="story-item-el interactive-card" data-profile-slug="${slug}">
          <div class="story-ring-wrap">
            <div class="story-ring-glow">
              <img src="${rawImg}" alt="${escapeHTML(name)}" loading="lazy" onerror="this.onerror=null; this.src='${CONFIG.DEFAULT_FALLBACK_IMG}';">
            </div>
            <span class="story-status-dot ${statusClass}"></span>
          </div>
          <span class="story-label">${escapeHTML(name)}</span>
        </div>
      `;
    });

    trackEl.innerHTML = singleHtml + singleHtml;
  }

  window.trackLineClick = function(profileId) {
    try {
      const idNum = parseInt(profileId, 10);
      if (isNaN(idNum)) return;

      fetch(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/increment_likes`, {
        method: "POST",
        headers: {
          "apikey": CONFIG.SUPABASE_KEY,
          "Authorization": `Bearer ${CONFIG.SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ profile_id_to_update: idNum }),
        keepalive: true
      }).catch(() => {});
    } catch (_) {}
  };

  async function initApplication() {
    domCache.profilesDisplayArea = document.getElementById("profiles-display-area");
    domCache.noResultsMessage = document.getElementById("no-results-message");
    domCache.fetchErrorMessage = document.getElementById("fetch-error-message");
    domCache.searchInput = document.getElementById("search-keyword");
    domCache.provinceSelect = document.getElementById("search-province");
    domCache.availabilitySelect = document.getElementById("search-availability");
    domCache.featuredSelect = document.getElementById("search-featured");
    domCache.sortSelect = document.getElementById("sort-select");
    domCache.resetSearchBtn = document.getElementById("reset-search-btn");
    domCache.featuredSection = document.getElementById("featured-profiles");
    domCache.featuredContainer = document.getElementById("featured-profiles-container");

    document.body.addEventListener("click", (e) => {
      const suggestionTarget = e.target.closest('[data-action="suggestion"]');
      if (suggestionTarget) {
        const slug = suggestionTarget.dataset.slug;
        const isProfile = suggestionTarget.dataset.isProfile === "true";
        const popover = document.getElementById("search-suggestions");
        if (popover) popover.style.display = "none";
        
        if (isProfile) {
          history.pushState(null, "", `/sideline/${encodeURIComponent(slug)}`);
          handleUrlRouting();
        } else if (domCache.searchInput) {
          domCache.searchInput.value = slug;
          executeFilterAndRender(true);
        }
        return;
      }

      const cardElement = e.target.closest(".profile-card-new, .vip-card-item, .interactive-card, .story-item-el");
      if (cardElement) {
        const profileId = cardElement.getAttribute("data-profile-id");
        const profileSlug = cardElement.getAttribute("data-profile-slug");

        if (profileId || profileSlug) {
          e.preventDefault();
          const targetProfile = appState.allProfiles.find(p => String(p.id) === String(profileId) || (p.slug && String(p.slug) === String(profileSlug)));
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

    document.querySelectorAll(".filter-pill-tab").forEach(pill => {
      pill.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelectorAll(".filter-pill-tab").forEach(p => p.classList.remove("active"));
        this.classList.add("active");
        appState.activePillTag = this.getAttribute("data-tag") || "all";
        executeFilterAndRender(true);
      });
    });

    if (domCache.searchInput) {
      domCache.searchInput.addEventListener("input", (e) => {
        clearTimeout(searchDebounceTimer);
        const q = e.target.value;
        const clearBtn = document.getElementById("clear-search-btn");
        if (clearBtn) clearBtn.style.display = q ? "block" : "none";
        searchDebounceTimer = setTimeout(() => {
          executeFilterAndRender(true);
          showSearchSuggestions(q);
        }, 180);
      });
      domCache.searchInput.addEventListener("focus", () => showSearchSuggestions(domCache.searchInput.value));
    }

    if (domCache.resetSearchBtn) {
      domCache.resetSearchBtn.addEventListener("click", () => {
        if (domCache.searchInput) domCache.searchInput.value = "";
        if (domCache.provinceSelect) domCache.provinceSelect.value = "";
        if (domCache.availabilitySelect) domCache.availabilitySelect.value = "";
        if (domCache.featuredSelect) domCache.featuredSelect.value = "";
        if (domCache.sortSelect) domCache.sortSelect.value = "featured";

        appState.activePillTag = "all";
        document.querySelectorAll(".filter-pill-tab").forEach(pill => {
          pill.classList.toggle("active", (pill.getAttribute("data-tag") || "all") === "all");
        });

        const clearBtn = document.getElementById("clear-search-btn");
        if (clearBtn) clearBtn.style.display = "none";
        const popover = document.getElementById("search-suggestions");
        if (popover) popover.style.display = "none";

        executeFilterAndRender(true);
      });
    }

    if (domCache.provinceSelect) domCache.provinceSelect.addEventListener("change", () => executeFilterAndRender(true));
    if (domCache.availabilitySelect) domCache.availabilitySelect.addEventListener("change", () => executeFilterAndRender(true));
    if (domCache.featuredSelect) domCache.featuredSelect.addEventListener("change", () => executeFilterAndRender(true));
    if (domCache.sortSelect) domCache.sortSelect.addEventListener("change", () => executeFilterAndRender(true));

    try {
      if (window.provincesData && Array.isArray(window.provincesData)) {
        appState.provincesMap.clear();
        window.provincesData.forEach(p => {
          let k = (p.key || p.slug || p.id).toString().toLowerCase();
          if (k === "chiang_mai") k = "chiangmai";
          if (k && p.nameThai) appState.provincesMap.set(k, p.nameThai);
        });
      }

      if (window.profilesData && Array.isArray(window.profilesData) && window.profilesData.length > 0) {
        appState.allProfiles = window.profilesData.map(normalizeProfile).filter(Boolean);
        populateInitialComponents();
      } else {
        const client = await getSupabaseClient();
        if (client) {
          const [provincesRes, profilesRes] = await Promise.all([
            client.from("provinces").select("*"),
            client.from("profiles").select("*").eq("active", true).order("isfeatured", { ascending: false }).order("created_at", { ascending: false })
          ]);
          if (provincesRes.data) {
            provincesRes.data.forEach(p => {
              let k = (p.key || p.slug || p.id).toString().toLowerCase();
              if (k === "chiang_mai") k = "chiangmai";
              if (k && p.nameThai) appState.provincesMap.set(k, p.nameThai);
            });
          }
          if (profilesRes.data) {
            appState.allProfiles = profilesRes.data.map(normalizeProfile).filter(Boolean);
            populateInitialComponents();
          }
        }
      }
    } catch (e) {
      console.error("Init Data Error:", e);
    }

    await handleUrlRouting(true);
    window.addEventListener("popstate", async () => await handleUrlRouting(false));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApplication);
  } else {
    initApplication();
  }
})();