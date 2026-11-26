// netlify/edge-functions/shared-config.js

export const CONFIG = {
  get SUPABASE_URL() {
    try { return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co"; }
    catch { return "https://zxetzqwjaiumqhrpumln.supabase.co"; }
  },
  get SUPABASE_KEY() {
    try { return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
    catch { return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
  },
  get PURGE_SECRET() {
    try { return Deno.env.get("PURGE_SECRET") || ""; }
    catch { return ""; }
  },
  PRIMARY_DOMAIN: "https://firstmodelhub.com",
  CLOUDINARY_BASE_URL: "https://res.cloudinary.com/dduxw7k4/image/upload/",
  BRAND_NAME: "FirstModelHub",
  BRAND_LEGAL_NAME: "FirstModelHub Co., Ltd.",
  DEFAULT_OG_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp",
  DEFAULT_TELEPHONE: "+66926997044",
  SOCIAL_LINKS: [
    "https://line.me/ti/p/u8Bz9HsaY8",
    "https://x.com/Timedamdam",
    "https://bsky.app/profile/sidelinechiangmai.bsky.social",
    "https://linktr.ee/kissmodel"
  ]
};

// คง BRAND_CONFIG ไว้เพื่อให้โค้ดเดิมที่ import อยู่ยังทำงานได้ 100%
export const BRAND_CONFIG = {
  PRIMARY_DOMAIN: CONFIG.PRIMARY_DOMAIN,
  BRAND_NAME: CONFIG.BRAND_NAME,
  BRAND_LEGAL_NAME: CONFIG.BRAND_LEGAL_NAME,
  DEFAULT_OG_IMAGE: CONFIG.DEFAULT_OG_IMAGE,
  DEFAULT_LINE_URL: CONFIG.SOCIAL_LINKS[0],
  DEFAULT_TELEPHONE: CONFIG.DEFAULT_TELEPHONE,
  CLOUDINARY_BASE_URL: CONFIG.CLOUDINARY_BASE_URL,
  SOCIAL_LINKS: CONFIG.SOCIAL_LINKS
};

export function normalizeProvKey(raw) {
  const k = String(raw || "").trim().toLowerCase();
  const alias = {
    "chiang_mai": "chiangmai", "chiang-mai": "chiangmai",
    "khonkaen": "khon-kaen", "khon_kaen": "khon-kaen",
    "phra-nakhon-si-ayutthaya": "ayutthaya",
    "nakhon-ratchasima": "korat", "nakhonratchasima": "korat",
    "hat-yai": "songkhla", "hatyai": "songkhla",
    "samui": "suratthani", "surat-thani": "suratthani"
  };
  return alias[k] || k;
}

export const MASTER_ZONES = {
  chiangmai: [
    { slug: "nimman", thai: "นิมมาน", match: ["นิมมาน", "nimman", "นิมมานเหมินท์", "ศิริมังคลาจารย์"] },
    { slug: "jedyod", thai: "เจ็ดยอด", match: ["เจ็ดยอด", "โพธาราม"] },
    { slug: "santitham", thai: "สันติธรรม", match: ["สันติธรรม"] },
    { slug: "changphueak", thai: "ช้างเผือก", match: ["ช้างเผือก", "โชตนา"] },
    { slug: "cmu", thai: "หลัง มช.", match: ["หลัง มช", "หลังมอ", "หลัง มช.", "สุเทพ", "วัดอุโมงค์"] },
    { slug: "front-cmu", thai: "หน้า มช.", match: ["หน้า มช", "หน้ามอ", "หน้า มช.", "กาดมาลิน"], legacySlugs: ["namor"] },
    { slug: "kumueang", thai: "คูเมือง", match: ["คูเมือง", "ในเมืองเชียงใหม่", "ตัวเมืองเชียงใหม่", "ในตัวเมืองเชียงใหม่"] },
    { slug: "thapae", thai: "ท่าแพ", match: ["ท่าแพ", "ช้างคลาน", "ไนท์บาซาร์"] },
    { slug: "huaykaew", thai: "ห้วยแก้ว", match: ["ห้วยแก้ว", "เมญ่า", "แยกรินคำ"] },
    { slug: "ruamchok", thai: "รวมโชค", match: ["รวมโชค", "มีโชค"] },
    { slug: "sansai", thai: "สันทราย", match: ["สันทราย"] },
    { slug: "maejo", thai: "แม่โจ้", match: ["แม่โจ้"] },
    { slug: "payap", thai: "พายัพ", match: ["พายัพ"] },
    { slug: "centralfest", thai: "เซ็นทรัลเฟส", match: ["เซ็นทรัลเฟส", "เซ็นทรัลเฟสติวัล", "ศาลเด็ก"] },
    { slug: "airport-cnx", thai: "สนามบินเชียงใหม่", match: ["สนามบิน", "แอร์พอร์ต", "มหิดล"] },
    { slug: "maerim", thai: "แม่ริม", match: ["แม่ริม"] },
    { slug: "hangdong", thai: "หางดง", match: ["หางดง", "กาดฝรั่ง"] }
  ],
  "khon-kaen": [
    { slug: "kangsadan", thai: "กังสดาล", match: ["กังสดาล", "บึงหนองแวง"] },
    { slug: "kku", thai: "หลัง มข.", match: ["หลัง มข", "หลัง มข.", "หลังมอ"] },
    { slug: "kku-front", thai: "หน้า มข.", match: ["หน้า มข", "หน้า มข.", "หน้ามอ"], legacySlugs: ["namor-kku"] },
    { slug: "nonmuang", thai: "โนนม่วง", match: ["โนนม่วง"] },
    { slug: "central-khonkaen", thai: "เซ็นทรัลขอนแก่น", match: ["เซ็นทรัลขอนแก่น", "เซ็นทรัล"] },
    { slug: "buengkaennakhon", thai: "บึงแก่นนคร", match: ["บึงแก่นนคร"] },
    { slug: "mueang-khonkaen", thai: "ในตัวเมืองขอนแก่น", match: ["ในตัวเมือง", "ในเมือง", "ตัวเมืองขอนแก่น"] },
    { slug: "m-phak", thai: "ม.ภาค", match: ["ม.ภาค", "บ้านกอก"], legacySlugs: ["m-phak-area"] }
  ],
  phuket: [
    { slug: "patong", thai: "ป่าตอง", match: ["ป่าตอง", "บางลา"] },
    { slug: "mueang-phuket", thai: "ตัวเมืองภูเก็ต", match: ["ตัวเมืองภูเก็ต", "เมืองภูเก็ต", "ในเมือง", "ในตัวเมืองภูเก็ต"] },
    { slug: "kathu", thai: "กะทู้", match: ["กะทู้"] },
    { slug: "chalong", thai: "ฉลอง", match: ["ฉลอง"] },
    { slug: "karon", thai: "กะรน", match: ["กะรน"] },
    { slug: "kata", thai: "กะตะ", match: ["กะตะ"] },
    { slug: "bangtao", thai: "บางเทา", match: ["บางเทา", "ลากูน่า"] },
    { slug: "rawai", thai: "ราไวย์", match: ["ราไวย์"] },
    { slug: "cherngtalay", thai: "เชิงทะเล", match: ["เชิงทะเล"] },
    { slug: "kamala", thai: "กมลา", match: ["กมลา"] }
  ],
  chiangrai: [
    { slug: "baandu", thai: "บ้านดู่", match: ["บ้านดู่"] },
    { slug: "mfu", thai: "หน้า มฟล.", match: ["หน้า มฟล", "มฟล", "แม่ฟ้าหลวง"], legacySlugs: ["mae-fah-luang"] },
    { slug: "mueang-chiangrai", thai: "ตัวเมืองเชียงราย", match: ["ตัวเมือง", "ในเมือง", "ในตัวเมือง"] },
    { slug: "clock-tower", thai: "หอนาฬิกา", match: ["หอนาฬิกา", "ไนท์บาซาร์"] },
    { slug: "rim-kok", thai: "ริมกก", match: ["ริมกก"] },
    { slug: "maesai", thai: "แม่สาย", match: ["แม่สาย"] }
  ],
  udonthani: [
    { slug: "udtown", thai: "UD Town", match: ["ud town", "ยูดีทาวน์", "udtown", "ud-town"] },
    { slug: "nongprajak", thai: "หนองประจักษ์", match: ["หนองประจักษ์"] },
    { slug: "central-udon", thai: "เซ็นทรัลอุดร", match: ["เซ็นทรัลอุดร", "เซ็นทรัล"] },
    { slug: "mueang-udon", thai: "ตัวเมืองอุดร", match: ["ตัวเมือง", "ในเมือง", "ในตัวเมือง"] },
    { slug: "ban-chan", thai: "บ้านจั่น", match: ["บ้านจาน", "บ้านจั่น"] },
    { slug: "pho-si", thai: "โพศรี", match: ["โพศรี"] },
    { slug: "rangsina", thai: "ตลาดรังษิณา", match: ["รังษิณา"] }
  ],
  lampang: [
    { slug: "mueang-lampang", thai: "ตัวเมืองลำปาง", match: ["ตัวเมือง", "ในเมือง", "ในตัวเมือง"] },
    { slug: "suan-dok", thai: "สวนดอก", match: ["สวนดอก"] },
    { slug: "lpru", thai: "ม.ราชภัฏลำปาง", match: ["ราชภัฏลำปาง", "ม.ราชภัฏ"] },
    { slug: "sob-tui", thai: "สบตุ๋ย", match: ["สบตุ๋ย"] },
    { slug: "atsavin", thai: "อัศวิน", match: ["อัศวิน"] },
    { slug: "ko-kha", thai: "เกาะคา", match: ["เกาะคา"] }
  ]
};

export function resolveZone(provinceKey, rawZoneSlug) {
  const normProv = normalizeProvKey(provinceKey);
  const zones = MASTER_ZONES[normProv] || [];
  const clean = String(rawZoneSlug || "").trim().toLowerCase();

  for (const z of zones) {
    if (z.slug === clean) return { zone: z, isLegacy: false };
    if (z.legacySlugs && z.legacySlugs.includes(clean)) return { zone: z, isLegacy: true };
    if (z.thai.toLowerCase() === clean) return { zone: z, isLegacy: true };
  }
  return { zone: null, isLegacy: false };
}

export function getCanonicalProfileSlug(p) {
  if (!p) return "";
  const id = p.id;
  const raw = String(p.slug || "").trim().toLowerCase().replace(/\s+/g, "-");
  const isGarbageOrThai = !raw || /[\u0E00-\u0E7F]/.test(raw) ||
    /^(aekhth|ediyr|aikhejiyw|aetngom|aetngkwa|eoingeoy|emsa|hmiw)/.test(raw);
  return isGarbageOrThai ? `model-${id}` : raw;
}

export function safeOptimizeImg(imagePath, mode = "card") {
  const DEFAULT_FALLBACK_IMG = CONFIG.DEFAULT_OG_IMAGE;
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) return DEFAULT_FALLBACK_IMG;
  const cleanPath = imagePath.trim();
  if (cleanPath.includes("firstmodelhub.webp") || cleanPath.length < 10) return DEFAULT_FALLBACK_IMG;
  if (cleanPath.startsWith("data:")) return cleanPath;

  let transform = "f_auto,q_auto:eco,fl_lossy,w_320,h_448,c_fill,g_auto";
  if (mode === "thumb" || (typeof mode === "number" && mode <= 150)) {
    transform = "f_auto,q_auto:eco,fl_lossy,w_120,h_120,c_thumb,g_face";
  } else if (mode === 300 || mode === "swiper") {
    transform = "f_auto,q_auto:eco,fl_lossy,w_300,h_420,c_fill,g_auto";
  } else if (mode === "og") {
    transform = "f_auto,q_auto:good,fl_lossy,w_1200,h_630,c_fill,g_face";
  } else if (typeof mode === "number") {
    transform = `f_auto,q_auto:good,fl_lossy,w_${mode},h_${Math.round(mode * 1.4)},c_fill,g_auto`;
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
        return `${CONFIG.CLOUDINARY_BASE_URL}${transform}/${tailParts.join("/")}`;
      }
    }
  }

  if (/^https?:\/\//i.test(cleanPath)) return cleanPath;
  const formatted = cleanPath.replace(/^\/+/, "");
  const finalPath = formatted.startsWith("images/") ? formatted : `images/${formatted}`;
  return `${CONFIG.CLOUDINARY_BASE_URL}${transform}/${finalPath}`;
}

export default async (req, context) => context.next();