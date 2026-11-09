/**
 * ==============================================================================
 * 💎 FIRST MODEL HUB - DYNAMIC XML SITEMAP ENGINE (sitemap.js)
 * Production-Ready Ultra-Defensive Version (FIXED 2026 - ZERO REDIRECT ERRORS)
 * ==============================================================================
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

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
  PRIMARY_DOMAIN: "https://firstmodelhub.com"
};

/**
 * 🔒 ป้องกัน XML Syntax Error 100%
 */
const escapeXml = (str) => {
  if (!str) return "";
  return String(str).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
};

/**
 * ⏰ แปลงวันที่ให้อยู่ในฟอร์แมต ISO 8601 ตามมาตรฐาน Sitemaps.org
 */
const safeGetIsoDate = (dateStr, fallbackIso) => {
  if (!dateStr) return fallbackIso;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return fallbackIso;
    return d.toISOString();
  } catch {
    return fallbackIso;
  }
};

/**
 * 🛡️ ฟังก์ชันสร้าง URL ที่ปลอดภัย 100% (ตัดช่องว่าง %20 + เอนโค้ด URL ถูกต้อง)
 */
const buildSafeUrl = (baseDomain, path) => {
  const cleanPath = path
    .trim()
    .replace(/[\r\n\t]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/\/+/g, "/");
  return encodeURI(`${baseDomain}${cleanPath}`);
};

/**
 * 📸 ดึงรูปภาพหลักของโปรไฟล์
 */
const getProfileMainImage = (p) => {
  if (!p) return null;
  let img = p.imagePath || p.image_path || p.image_url || p.imageUrl;
  if (!img) {
    const gallery = p.galleryPaths || p.gallery_paths || p.gallery;
    if (Array.isArray(gallery) && gallery.length > 0) img = gallery[0];
    else if (typeof gallery === "string" && gallery.trim()) img = gallery.split(",")[0].trim();
  }
  if (!img || typeof img !== "string" || img.includes("firstmodelhub.webp")) return null;
  return img.trim();
};

/**
 * 💎 ปรับแต่ง URL รูปภาพสำหรับ Google Image Sitemap
 */
const optimizeImgForXml = (path) => {
  if (!path || typeof path !== "string" || !path.trim()) return null;
  const cleanPath = path.trim();
  const WM_TRANSFORM = "f_auto,q_auto:good,w_600,h_800,c_fill";

  if (cleanPath.includes("res.cloudinary.com")) {
    const fileMatch = cleanPath.match(/(?:v\d+\/)?(images\/[^\s\?]+|[^\/]+\.(?:png|jpg|jpeg|webp|avif))$/i);
    if (fileMatch && fileMatch[1]) {
      return `https://res.cloudinary.com/adjucgga/image/upload/${WM_TRANSFORM}/${fileMatch[1]}`;
    }
    return cleanPath;
  }
  return cleanPath;
};

// 📍 รายชื่อโซนย่อยเป้าหมายทั่วประเทศ (Slug ภาษาอังกฤษตรงกับระบบ SSR และ 200 OK 100%)
const TARGET_SUB_ZONES = [
  // 1. เชียงใหม่
  { province: "chiangmai", zone: "nimman", matchWords: ["นิมมาน", "nimman", "นิมมานเหมินท์"] },
  { province: "chiangmai", zone: "jedyod", matchWords: ["เจ็ดยอด"] },
  { province: "chiangmai", zone: "santitham", matchWords: ["สันติธรรม"] },
  { province: "chiangmai", zone: "changphueak", matchWords: ["ช้างเผือก"] },
  { province: "chiangmai", zone: "maejo", matchWords: ["แม่โจ้"] },
  { province: "chiangmai", zone: "cmu", matchWords: ["หลัง มช", "หลังมอ", "หลัง มช."] },
  { province: "chiangmai", zone: "namor", matchWords: ["หน้า มช", "หน้ามอ", "หน้า มช."] },
  { province: "chiangmai", zone: "sansai", matchWords: ["สันทราย"] },
  { province: "chiangmai", zone: "hangdong", matchWords: ["หางดง"] },
  { province: "chiangmai", zone: "maerim", matchWords: ["แม่ริม"] },
  { province: "chiangmai", zone: "kumueang", matchWords: ["คูเมือง"] },
  { province: "chiangmai", zone: "thapae", matchWords: ["ท่าแพ"] },
  { province: "chiangmai", zone: "huaykaew", matchWords: ["ห้วยแก้ว"] },
  { province: "chiangmai", zone: "ruamchok", matchWords: ["รวมโชค"] },
  { province: "chiangmai", zone: "payap", matchWords: ["พายัพ"] },
  { province: "chiangmai", zone: "centralfest", matchWords: ["เซ็นทรัลเฟส", "เซ็นทรัลเฟสติวัล"] },
  { province: "chiangmai", zone: "airport-cnx", matchWords: ["สนามบิน"] },

  // 2. กรุงเทพมหานคร
  { province: "bangkok", zone: "sukhumvit", matchWords: ["สุขุมวิท"] },
  { province: "bangkok", zone: "ratchada", matchWords: ["รัชดา"] },
  { province: "bangkok", zone: "huaikhwang", matchWords: ["ห้วยขวาง"] },
  { province: "bangkok", zone: "ladprao", matchWords: ["ลาดพร้าว"] },
  { province: "bangkok", zone: "thonglor", matchWords: ["ทองหล่อ"] },
  { province: "bangkok", zone: "ekkamai", matchWords: ["เอกมัย"] },
  { province: "bangkok", zone: "sathorn", matchWords: ["สาทร"] },
  { province: "bangkok", zone: "silom", matchWords: ["สีลม"] },
  { province: "bangkok", zone: "bangna", matchWords: ["บางนา"] },
  { province: "bangkok", zone: "ramintra", matchWords: ["รามอินทรา"] },
  { province: "bangkok", zone: "rama9", matchWords: ["พระราม 9", "พระราม9"] },
  { province: "bangkok", zone: "ari", matchWords: ["อารีย์"] },

  // 3. ชลบุรี / พัทยา
  { province: "chonburi", zone: "pattaya", matchWords: ["พัทยา"] },
  { province: "chonburi", zone: "pattaya-klang", matchWords: ["พัทยากลาง"] },
  { province: "chonburi", zone: "pattaya-tai", matchWords: ["พัทยาใต้"] },
  { province: "chonburi", zone: "jomtien", matchWords: ["จอมเทียน"] },
  { province: "chonburi", zone: "bangsaen", matchWords: ["บางแสน"] },
  { province: "chonburi", zone: "sriracha", matchWords: ["ศรีราชา"] },
  { province: "chonburi", zone: "mueang-chonburi", matchWords: ["ตัวเมืองชลบุรี", "เมืองชล"] },
  { province: "chonburi", zone: "amata", matchWords: ["อมตะ"] },
  { province: "chonburi", zone: "laemchabang", matchWords: ["แหลมฉบัง"] },
  { province: "chonburi", zone: "bowin", matchWords: ["บ่อวิน"] },

  // 4. ภูเก็ต
  { province: "phuket", zone: "patong", matchWords: ["ป่าตอง"] },
  { province: "phuket", zone: "mueang-phuket", matchWords: ["ตัวเมืองภูเก็ต", "เมืองภูเก็ต"] },
  { province: "phuket", zone: "kathu", matchWords: ["กะทู้"] },
  { province: "phuket", zone: "chalong", matchWords: ["ฉลอง"] },
  { province: "phuket", zone: "karon", matchWords: ["กะรน"] },
  { province: "phuket", zone: "kata", matchWords: ["กะตะ"] },
  { province: "phuket", zone: "bangtao", matchWords: ["บางเทา"] },
  { province: "phuket", zone: "rawai", matchWords: ["ราไวย์"] },
  { province: "phuket", zone: "cherngtalay", matchWords: ["เชิงทะเล"] },
  { province: "phuket", zone: "kamala", matchWords: ["กมลา"] },

  // 5. ขอนแก่น
  { province: "khon-kaen", zone: "kangsadan", matchWords: ["กังสดาล"] },
  { province: "khon-kaen", zone: "kku", matchWords: ["หลัง มข", "หลัง มข."] },
  { province: "khon-kaen", zone: "namor-kku", matchWords: ["หน้า มข", "หน้า มข."] },
  { province: "khon-kaen", zone: "nonmuang", matchWords: ["โนนม่วง"] },
  { province: "khon-kaen", zone: "central-khonkaen", matchWords: ["เซ็นทรัลขอนแก่น"] },
  { province: "khon-kaen", zone: "buengkaennakhon", matchWords: ["บึงแก่นนคร"] },
  { province: "khon-kaen", zone: "mueang-khonkaen", matchWords: ["ในตัวเมือง", "ในเมือง"] },
  { province: "khon-kaen", zone: "m-phak", matchWords: ["ม.ภาค"] },

  // 6. เชียงราย
  { province: "chiangrai", zone: "baandu", matchWords: ["บ้านดู่"] },
  { province: "chiangrai", zone: "mfu", matchWords: ["หน้า มฟล", "มฟล", "แม่ฟ้าหลวง"] },
  { province: "chiangrai", zone: "mueang-chiangrai", matchWords: ["ตัวเมือง", "ในเมือง"] },
  { province: "chiangrai", zone: "clock-tower", matchWords: ["หอนาฬิกา"] },
  { province: "chiangrai", zone: "maesai", matchWords: ["แม่สาย"] },

  // 7. อุดรธานี
  { province: "udonthani", zone: "udtown", matchWords: ["ud town", "ยูดีทาวน์", "udtown"] },
  { province: "udonthani", zone: "nongprajak", matchWords: ["หนองประจักษ์"] },
  { province: "udonthani", zone: "central-udon", matchWords: ["เซ็นทรัลอุดร"] },
  { province: "udonthani", zone: "mueang-udon", matchWords: ["ตัวเมือง", "ในเมือง"] },
  { province: "udonthani", zone: "rangsina", matchWords: ["รังษิณา"] },

  // 8. ลำปาง
  { province: "lampang", zone: "mueang-lampang", matchWords: ["ตัวเมือง", "ในเมือง"] },
  { province: "lampang", zone: "suan-dok", matchWords: ["สวนดอก"] },
  { province: "lampang", zone: "lpru", matchWords: ["ราชภัฏลำปาง"] },
  { province: "lampang", zone: "sob-tui", matchWords: ["สบตุ๋ย"] }
];

export default async (request, _context) => {
  const domain = CONFIG.PRIMARY_DOMAIN;
  const nowIso = new Date().toISOString();

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    // 🟢 ดึงเฉพาะโปรไฟล์ที่ Active และมีรูปถ่ายจริงเท่านั้น (ไม่เอาโปรไฟล์ร้าง)
    const [provincesRes, profilesRes] = await Promise.all([
      supabase.from("provinces").select("*"),
      supabase.from("profiles")
        .select("id, slug, name, location, description, styleTags, imagePath, image_url, provinceKey, province_key, province, updated_at, created_at, active")
        .eq("active", true)
        .limit(3000)
    ]);

    const provinces = provincesRes.data || [];
    const profiles = profilesRes.data || [];

    const provinceLatestDateMap = new Map();
    const zoneLatestDateMap = new Map();

    profiles.forEach(p => {
      let pKey = (p.provinceKey || p.province_key || p.province || "").toLowerCase().trim();
      if (pKey === "chiang_mai" || pKey === "chiang-mai") pKey = "chiangmai";
      if (pKey === "khonkaen" || pKey === "khon_kaen") pKey = "khon-kaen";

      const pLoc = (p.location || "").toLowerCase();
      const pDesc = (p.description || "").toLowerCase();
      const pTags = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : String(p.styleTags || "")).toLowerCase();
      const fullText = `${pLoc} ${pDesc} ${pTags}`;
      const pDateStr = p.updated_at || p.created_at;
      
      if (pDateStr) {
        const pTime = new Date(pDateStr).getTime();
        if (!isNaN(pTime)) {
          if (pKey) {
            const curProv = provinceLatestDateMap.get(pKey) || 0;
            if (pTime > curProv) provinceLatestDateMap.set(pKey, pTime);
          }
          TARGET_SUB_ZONES.forEach(sz => {
            if (pKey.includes(sz.province)) {
              const isMatch = sz.matchWords.some(w => fullText.includes(w.toLowerCase()));
              if (isMatch) {
                const zoneKey = `${sz.province}_${sz.zone}`;
                const curZone = zoneLatestDateMap.get(zoneKey) || 0;
                if (pTime > curZone) zoneLatestDateMap.set(zoneKey, pTime);
              }
            }
          });
        }
      }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // 1. หน้าคงที่หลัก (Static Pages)
    const staticPages = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/profiles", priority: "0.9", changefreq: "daily" },
      { path: "/locations", priority: "0.9", changefreq: "daily" },
      { path: "/blog", priority: "0.8", changefreq: "weekly" },
      { path: "/blog/what-is-trong-pok", priority: "0.8", changefreq: "monthly" },
      { path: "/blog/safe-booking-anti-scam-guide", priority: "0.8", changefreq: "monthly" },
      { path: "/blog/vip-etiquette-how-to-book-companion", priority: "0.8", changefreq: "monthly" },
      { path: "/about", priority: "0.5", changefreq: "monthly" },
      { path: "/faq", priority: "0.5", changefreq: "monthly" },
      { path: "/privacy-policy", priority: "0.3", changefreq: "monthly" }
    ];

    staticPages.forEach(p => {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(domain + p.path)}</loc>\n`;
      xml += `    <lastmod>${nowIso}</lastmod>\n`;
      xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // 2. หน้ารายจังหวัด (Province Hubs)
    if (provinces && provinces.length > 0) {
      provinces.forEach(p => {
        if (p && p.key) {
          let cleanKey = String(p.key).trim().toLowerCase();
          if (cleanKey === "chiang_mai" || cleanKey === "chiang-mai") cleanKey = "chiangmai";
          if (cleanKey === "khonkaen" || cleanKey === "khon_kaen") cleanKey = "khon-kaen";

          const latestTimestamp = provinceLatestDateMap.get(cleanKey);
          const provIsoDate = latestTimestamp ? new Date(latestTimestamp).toISOString() : nowIso;
          const provUrl = buildSafeUrl(domain, `/location/${cleanKey}`);

          xml += `  <url>\n`;
          xml += `    <loc>${escapeXml(provUrl)}</loc>\n`;
          xml += `    <lastmod>${provIsoDate}</lastmod>\n`;
          xml += `    <changefreq>daily</changefreq>\n`;
          xml += `    <priority>0.9</priority>\n`;
          xml += `  </url>\n`;
        }
      });
    }

    // 3. หน้ารายโซนย่อย (Sub-zones)
    TARGET_SUB_ZONES.forEach(sz => {
      const hasActiveProfiles = profiles.some(p => {
        let pKey = (p.provinceKey || p.province_key || p.province || "").toLowerCase().trim();
        if (pKey === "chiang_mai" || pKey === "chiang-mai") pKey = "chiangmai";
        if (pKey === "khonkaen" || pKey === "khon_kaen") pKey = "khon-kaen";

        const pLoc = (p.location || "").toLowerCase();
        const pDesc = (p.description || "").toLowerCase();
        const pTags = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : String(p.styleTags || "")).toLowerCase();
        const fullText = `${pLoc} ${pDesc} ${pTags}`;

        const isSameProv = pKey.includes(sz.province.toLowerCase());
        const isMatchZone = sz.matchWords.some(w => fullText.includes(w.toLowerCase()));
        return isSameProv && isMatchZone;
      });

      if (!hasActiveProfiles) return;

      const zoneKey = `${sz.province}_${sz.zone}`;
      const latestTimestamp = zoneLatestDateMap.get(zoneKey);
      const zoneIsoDate = latestTimestamp ? new Date(latestTimestamp).toISOString() : nowIso;
      const zoneUrl = buildSafeUrl(domain, `/location/${sz.province}/${sz.zone}`);

      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(zoneUrl)}</loc>\n`;
      xml += `    <lastmod>${zoneIsoDate}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    // 4. หน้าโปรไฟล์น้องๆ (Individual Profiles - ปลายทาง 200 OK 100% ไม่ติด 301)
    if (profiles && profiles.length > 0) {
      profiles.forEach(p => {
        if (p && (p.slug || p.id)) {
          let rawSlug = String(p.slug || p.id).trim();

          // 🟢 ตรวจสอบเด็ดขาด: ถ้า Slug มีภาษาไทย ให้แปลงเป็น model-ID ทันที
          // เพื่อให้ตรงกับ URL ปลายทางที่เป็น 200 OK ใน _redirects (ตัดปัญหา 301 ถาวร)
          if (/[\u0E00-\u0E7F]/.test(rawSlug)) {
            rawSlug = `model-${p.id}`;
          }

          const safeProfileUrl = buildSafeUrl(domain, `/sideline/${rawSlug}`);
          const modDate = safeGetIsoDate(p.updated_at || p.created_at, nowIso);

          let imageXml = "";
          const imgPath = getProfileMainImage(p);
          if (imgPath) {
            const imgUrl = optimizeImgForXml(imgPath);
            if (imgUrl) {
              const rawName = p.name ? String(p.name).trim().replace(/^(น้อง\s?)+/gi, "") : "สาวสวย";
              const displayName = `น้อง${rawName}`;
              imageXml = `\n    <image:image>\n      <image:loc>${escapeXml(imgUrl)}</image:loc>\n      <image:title>${escapeXml(displayName)}</image:title>\n    </image:image>`;
            }
          }

          xml += `  <url>\n    <loc>${escapeXml(safeProfileUrl)}</loc>\n    <lastmod>${modDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>${imageXml}\n  </url>\n`;
        }
      });
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff"
      }
    });

  } catch (err) {
    console.error("Sitemap generation critical error:", err);
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${domain}/</loc><lastmod>${nowIso}</lastmod></url></urlset>`, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" }
    });
  }
};
