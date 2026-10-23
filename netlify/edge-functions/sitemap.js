/**
 * ==============================================================================
 * 💎 FIRST MODEL HUB - DYNAMIC XML SITEMAP ENGINE (sitemap.js)
 * Production-Ready Ultra-Defensive Version (FIXED 2026 - ZERO ERRORS)
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
 * 🛡️ ฟังก์ชันสร้าง URL ที่ปลอดภัย 100% (ตัดช่องว่าง %20 + เข้ารหัส Percent-encoded)
 */
const buildSafeUrl = (baseDomain, path) => {
  const cleanPath = path
    .trim()
    .replace(/\s+/g, "-") // แทนที่ช่องว่างด้วยขีดกลาง ป้องกัน %20
    .replace(/\/+/g, "/"); // ป้องกัน double slash
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
  const WM_TRANSFORM = "f_auto,q_auto:good,w_600,h_800,c_fill/a_hflip/l_text:Montserrat_26_bold_letter_spacing_4:FIRSTMODELHUB,co_rgb:ffffff,o_45/fl_layer_apply,g_south,y_40";

  if (cleanPath.includes("res.cloudinary.com")) {
    const fileMatch = cleanPath.match(/(?:v\d+\/)?(images\/[^\s\?]+|[^\/]+\.(?:png|jpg|jpeg|webp|avif))$/i);
    if (fileMatch && fileMatch[1]) {
      return `https://res.cloudinary.com/dyynjlbuj/image/upload/${WM_TRANSFORM}/${fileMatch[1]}`;
    }
    return cleanPath;
  }
  return cleanPath;
};

// 📍 รายชื่อโซนย่อยเป้าหมายทั่วประเทศ (แก้คำเว้นวรรคเป็นขีดกลางเพื่อความปลอดภัย)
const TARGET_SUB_ZONES = [
  // 1. เชียงใหม่
  { province: "chiangmai", zone: "เจ็ดยอด", matchWords: ["เจ็ดยอด"] },
  { province: "chiangmai", zone: "สันติธรรม", matchWords: ["สันติธรรม"] },
  { province: "chiangmai", zone: "ช้างเผือก", matchWords: ["ช้างเผือก"] },
  { province: "chiangmai", zone: "แม่โจ้", matchWords: ["แม่โจ้"] },
  { province: "chiangmai", zone: "หลัง-มช.", matchWords: ["หลัง มช", "หลังมอ", "หลัง มช."] },
  { province: "chiangmai", zone: "หน้า-มช.", matchWords: ["หน้า มช", "หน้ามอ", "หน้า มช."] },
  { province: "chiangmai", zone: "สันทราย", matchWords: ["สันทราย"] },
  { province: "chiangmai", zone: "หางดง", matchWords: ["หางดง"] },
  { province: "chiangmai", zone: "แม่ริม", matchWords: ["แม่ริม"] },
  { province: "chiangmai", zone: "คูเมือง", matchWords: ["คูเมือง"] },
  { province: "chiangmai", zone: "ท่าแพ", matchWords: ["ท่าแพ"] },
  { province: "chiangmai", zone: "ห้วยแก้ว", matchWords: ["ห้วยแก้ว"] },
  { province: "chiangmai", zone: "รวมโชค", matchWords: ["รวมโชค"] },
  { province: "chiangmai", zone: "พายัพ", matchWords: ["พายัพ"] },
  { province: "chiangmai", zone: "เซ็นทรัลเฟส", matchWords: ["เซ็นทรัลเฟส", "เซ็นทรัลเฟสติวัล"] },
  { province: "chiangmai", zone: "สนามบินเชียงใหม่", matchWords: ["สนามบิน"] },

  // 2. กรุงเทพมหานคร
  { province: "bangkok", zone: "สุขุมวิท", matchWords: ["สุขุมวิท"] },
  { province: "bangkok", zone: "รัชดา", matchWords: ["รัชดา"] },
  { province: "bangkok", zone: "ห้วยขวาง", matchWords: ["ห้วยขวาง"] },
  { province: "bangkok", zone: "ลาดพร้าว", matchWords: ["ลาดพร้าว"] },
  { province: "bangkok", zone: "ทองหล่อ", matchWords: ["ทองหล่อ"] },
  { province: "bangkok", zone: "เอกมัย", matchWords: ["เอกมัย"] },
  { province: "bangkok", zone: "สาทร", matchWords: ["สาทร"] },
  { province: "bangkok", zone: "สีลม", matchWords: ["สีลม"] },
  { province: "bangkok", zone: "บางนา", matchWords: ["บางนา"] },
  { province: "bangkok", zone: "รามอินทรา", matchWords: ["รามอินทรา"] },
  { province: "bangkok", zone: "พระราม-9", matchWords: ["พระราม 9", "พระราม9"] },
  { province: "bangkok", zone: "อารีย์", matchWords: ["อารีย์"] },

  // 3. ชลบุรี / พัทยา
  { province: "chonburi", zone: "พัทยา", matchWords: ["พัทยา"] },
  { province: "chonburi", zone: "พัทยากลาง", matchWords: ["พัทยากลาง"] },
  { province: "chonburi", zone: "พัทยาใต้", matchWords: ["พัทยาใต้"] },
  { province: "chonburi", zone: "หาดจอมเทียน", matchWords: ["จอมเทียน"] },
  { province: "chonburi", zone: "บางแสน", matchWords: ["บางแสน"] },
  { province: "chonburi", zone: "ศรีราชา", matchWords: ["ศรีราชา"] },
  { province: "chonburi", zone: "ตัวเมืองชลบุรี", matchWords: ["ตัวเมืองชลบุรี", "เมืองชล"] },
  { province: "chonburi", zone: "อมตะนคร", matchWords: ["อมตะ"] },
  { province: "chonburi", zone: "แหลมฉบัง", matchWords: ["แหลมฉบัง"] },
  { province: "chonburi", zone: "บ่อวิน", matchWords: ["บ่อวิน"] },

  // 4. ภูเก็ต
  { province: "phuket", zone: "ป่าตอง", matchWords: ["ป่าตอง"] },
  { province: "phuket", zone: "ตัวเมืองภูเก็ต", matchWords: ["ตัวเมืองภูเก็ต", "เมืองภูเก็ต"] },
  { province: "phuket", zone: "กะทู้", matchWords: ["กะทู้"] },
  { province: "phuket", zone: "ฉลอง", matchWords: ["ฉลอง"] },
  { province: "phuket", zone: "กะรน", matchWords: ["กะรน"] },
  { province: "phuket", zone: "กะตะ", matchWords: ["กะตะ"] },
  { province: "phuket", zone: "บางเทา", matchWords: ["บางเทา"] },
  { province: "phuket", zone: "ราไวย์", matchWords: ["ราไวย์"] },
  { province: "phuket", zone: "เชิงทะเล", matchWords: ["เชิงทะเล"] },
  { province: "phuket", zone: "กมลา", matchWords: ["กมลา"] },

  // 5. ขอนแก่น
  { province: "khon-kaen", zone: "กังสดาล", matchWords: ["กังสดาล"] },
  { province: "khon-kaen", zone: "หลัง-มข.", matchWords: ["หลัง มข", "หลัง มข."] },
  { province: "khon-kaen", zone: "หน้า-มข.", matchWords: ["หน้า มข", "หน้า มข."] },
  { province: "khon-kaen", zone: "โนนม่วง", matchWords: ["โนนม่วง"] },
  { province: "khon-kaen", zone: "เซ็นทรัลขอนแก่น", matchWords: ["เซ็นทรัลขอนแก่น"] },
  { province: "khon-kaen", zone: "บึงแก่นนคร", matchWords: ["บึงแก่นนคร"] },
  { province: "khon-kaen", zone: "ในตัวเมืองขอนแก่น", matchWords: ["ในตัวเมือง", "ในเมือง"] },
  { province: "khon-kaen", zone: "ม.ภาค", matchWords: ["ม.ภาค"] },

  // 6. เชียงราย
  { province: "chiangrai", zone: "บ้านดู่", matchWords: ["บ้านดู่"] },
  { province: "chiangrai", zone: "หน้า-มฟล.", matchWords: ["หน้า มฟล", "มฟล", "แม่ฟ้าหลวง"] },
  { province: "chiangrai", zone: "ตัวเมืองเชียงราย", matchWords: ["ตัวเมือง", "ในเมือง"] },
  { province: "chiangrai", zone: "หอนาฬิกา", matchWords: ["หอนาฬิกา"] },
  { province: "chiangrai", zone: "แม่สาย", matchWords: ["แม่สาย"] },

  // 7. อุดรธานี
  { province: "udonthani", zone: "UD-Town", matchWords: ["ud town", "ยูดีทาวน์", "udtown"] },
  { province: "udonthani", zone: "หนองประจักษ์", matchWords: ["หนองประจักษ์"] },
  { province: "udonthani", zone: "เซ็นทรัลอุดร", matchWords: ["เซ็นทรัลอุดร"] },
  { province: "udonthani", zone: "ตัวเมืองอุดร", matchWords: ["ตัวเมือง", "ในเมือง"] },
  { province: "udonthani", zone: "ตลาดรังษิณา", matchWords: ["รังษิณา"] },

  // 8. ลำปาง
  { province: "lampang", zone: "ตัวเมืองลำปาง", matchWords: ["ตัวเมือง", "ในเมือง"] },
  { province: "lampang", zone: "สวนดอก", matchWords: ["สวนดอก"] },
  { province: "lampang", zone: "ม.ราชภัฏลำปาง", matchWords: ["ราชภัฏลำปาง"] },
  { province: "lampang", zone: "สบตุ๋ย", matchWords: ["สบตุ๋ย"] }
];

export default async (request, _context) => {
  const domain = CONFIG.PRIMARY_DOMAIN;
  const nowIso = new Date().toISOString();

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    // ดึงข้อมูลจังหวัดและโปรไฟล์ที่ Active พร้อมกัน
    const [provincesRes, profilesRes] = await Promise.all([
      supabase.from("provinces").select("*"),
      supabase.from("profiles").select("*").eq("active", true).limit(3000)
    ]);

    const provinces = provincesRes.data || [];
    const profiles = profilesRes.data || [];

    // แผนที่เก็บเวลาอัปเดตล่าสุดของแต่ละจังหวัดและโซน
    const provinceLatestDateMap = new Map();
    const zoneLatestDateMap = new Map();

    profiles.forEach(p => {
      const pKey = (p.provinceKey || p.province_key || p.province || "").toLowerCase().trim();
      const pLoc = (p.location || "").toLowerCase();
      const pDesc = (p.description || "").toLowerCase();
      const pTags = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : String(p.styleTags || "")).toLowerCase();
      const fullText = `${pLoc} ${pDesc} ${pTags}`;
      const pDateStr = p.lastUpdated || p.last_updated || p.updated_at || p.created_at;
      
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

    // 1. หน้าหลักและหน้าคงที่ (Static Core Pages)
    const staticPages = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/profiles", priority: "0.9", changefreq: "daily" },
      { path: "/locations", priority: "0.9", changefreq: "daily" },
      { path: "/nimman", priority: "0.9", changefreq: "daily" },
      { path: "/blog", priority: "0.8", changefreq: "weekly" },
      { path: "/blog/what-is-gfe-fiwfan-guide", priority: "0.8", changefreq: "monthly" },
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
          const cleanKey = String(p.key).trim().toLowerCase();
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

    // 3. หน้าโซนย่อย (Sub-zones) - คัดกรองเฉพาะโซนที่มีน้องรับงานจริงเท่านั้น
    TARGET_SUB_ZONES.forEach(sz => {
      const hasActiveProfiles = profiles.some(p => {
        const pKey = (p.provinceKey || p.province_key || p.province || "").toLowerCase().trim();
        const pLoc = (p.location || "").toLowerCase();
        const pDesc = (p.description || "").toLowerCase();
        const pTags = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : String(p.styleTags || "")).toLowerCase();
        const fullText = `${pLoc} ${pDesc} ${pTags}`;

        const isSameProv = pKey.includes(sz.province.toLowerCase());
        const isMatchZone = sz.matchWords.some(w => fullText.includes(w.toLowerCase()));
        return isSameProv && isMatchZone;
      });

      // 🛑 ถ้าไม่มีน้องสแตนด์บายในโซนนั้น ไม่ต้องใส่ลง Sitemap ป้องกันปัญหา Thin Content
      if (!hasActiveProfiles) return;

      const zoneKey = `${sz.province}_${sz.zone}`;
      const latestTimestamp = zoneLatestDateMap.get(zoneKey);
      const zoneIsoDate = latestTimestamp ? new Date(latestTimestamp).toISOString() : nowIso;
      
      // ✅ สร้าง URL ที่แปลงขีดกลางเรียบร้อย และ Encoded สมบูรณ์ 100%
      const zoneUrl = buildSafeUrl(domain, `/location/${sz.province}/${sz.zone}`);

      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(zoneUrl)}</loc>\n`;
      xml += `    <lastmod>${zoneIsoDate}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    // 4. หน้าโปรไฟล์เดี่ยว (Profile Detail Pages + Image Sitemap)
    if (profiles && profiles.length > 0) {
      profiles.forEach(p => {
        if (p && (p.slug || p.id)) {
          const rawSlug = String(p.slug || p.id).trim();
          const safeProfileUrl = buildSafeUrl(domain, `/sideline/${rawSlug}`);
          const modDate = safeGetIsoDate(p.lastUpdated || p.last_updated || p.updated_at || p.created_at, nowIso);

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
    // Fallback ปลอดภัยหากฐานข้อมูลขัดข้อง (ยังส่ง XML ที่ถูกต้อง ไม่ตอบ Error 500)
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${domain}/</loc><lastmod>${nowIso}</lastmod></url></urlset>`, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" }
    });
  }
};