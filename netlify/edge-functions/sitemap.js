/**
 * ==============================================================================
 * 💎 FIRST MODEL HUB - DYNAMIC XML SITEMAP ENGINE (sitemap.js)
 * Production-Ready Ultra-Defensive Version (FIXED 2026)
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


const TARGET_SUB_ZONES = [
  
  { province: "chiangmai", zone: "เจ็ดยอด" },
  { province: "chiangmai", zone: "สันติธรรม" },
  { province: "chiangmai", zone: "ช้างเผือก" },
  { province: "chiangmai", zone: "แม่โจ้" },
  { province: "chiangmai", zone: "หลัง มช." },
  { province: "chiangmai", zone: "หน้า มช." },
  { province: "chiangmai", zone: "สันทราย" },
  { province: "chiangmai", zone: "หางดง" },
  { province: "chiangmai", zone: "แม่ริม" },
  { province: "chiangmai", zone: "คูเมือง" },
  { province: "chiangmai", zone: "ท่าแพ" },
  { province: "chiangmai", zone: "ห้วยแก้ว" },
  { province: "chiangmai", zone: "รวมโชค" },
  { province: "chiangmai", zone: "พายัพ" },
  { province: "chiangmai", zone: "เซ็นทรัลเฟส" },
  { province: "chiangmai", zone: "สนามบินเชียงใหม่" },

  
  { province: "bangkok", zone: "สุขุมวิท" },
  { province: "bangkok", zone: "รัชดา" },
  { province: "bangkok", zone: "ห้วยขวาง" },
  { province: "bangkok", zone: "ลาดพร้าว" },
  { province: "bangkok", zone: "ทองหล่อ" },
  { province: "bangkok", zone: "เอกมัย" },
  { province: "bangkok", zone: "สาทร" },
  { province: "bangkok", zone: "สีลม" },
  { province: "bangkok", zone: "บางนา" },
  { province: "bangkok", zone: "รามอินทรา" },
  { province: "bangkok", zone: "พระราม 9" },
  { province: "bangkok", zone: "อารีย์" },

  
  { province: "chonburi", zone: "พัทยา" },
  { province: "chonburi", zone: "พัทยากลาง" },
  { province: "chonburi", zone: "พัทยาใต้" },
  { province: "chonburi", zone: "หาดจอมเทียน" },
  { province: "chonburi", zone: "บางแสน" },
  { province: "chonburi", zone: "ศรีราชา" },
  { province: "chonburi", zone: "ตัวเมืองชลบุรี" },
  { province: "chonburi", zone: "อมตะนคร" },
  { province: "chonburi", zone: "แหลมฉบัง" },
  { province: "chonburi", zone: "บ่อวิน" },

  
  { province: "phuket", zone: "ป่าตอง" },
  { province: "phuket", zone: "ตัวเมืองภูเก็ต" },
  { province: "phuket", zone: "กะทู้" },
  { province: "phuket", zone: "ฉลอง" },
  { province: "phuket", zone: "กะรน" },
  { province: "phuket", zone: "กะตะ" },
  { province: "phuket", zone: "บางเทา" },
  { province: "phuket", zone: "ราไวย์" },
  { province: "phuket", zone: "เชิงทะเล" },
  { province: "phuket", zone: "กมลา" },
  { province: "phuket", zone: "สนามบินภูเก็ต" },

  
  { province: "khon-kaen", zone: "กังสดาล" },
  { province: "khon-kaen", zone: "หลัง มข." },
  { province: "khon-kaen", zone: "หน้า มข." },
  { province: "khon-kaen", zone: "โนนม่วง" },
  { province: "khon-kaen", zone: "เซ็นทรัลขอนแก่น" },
  { province: "khon-kaen", zone: "บึงแก่นนคร" },
  { province: "khon-kaen", zone: "ในตัวเมืองขอนแก่น" },
  { province: "khon-kaen", zone: "ม.ภาค" },
  { province: "khon-kaen", zone: "ถนนมิตรภาพ" },
  { province: "khon-kaen", zone: "ศิลา" },

  
  { province: "chiangrai", zone: "บ้านดู่" },
  { province: "chiangrai", zone: "หน้า มฟล." },
  { province: "chiangrai", zone: "ตัวเมืองเชียงราย" },
  { province: "chiangrai", zone: "หอนาฬิกา" },
  { province: "chiangrai", zone: "ไนท์บาซาร์" },
  { province: "chiangrai", zone: "เด่นห้า" },
  { province: "chiangrai", zone: "รอบเวียง" },
  { province: "chiangrai", zone: "ริมกก" },
  { province: "chiangrai", zone: "แม่สาย" },

  
  { province: "udonthani", zone: "UD Town" },
  { province: "udonthani", zone: "หนองประจักษ์" },
  { province: "udonthani", zone: "เซ็นทรัลอุดร" },
  { province: "udonthani", zone: "ตัวเมืองอุดร" },
  { province: "udonthani", zone: "บ้านจาน" },
  { province: "udonthani", zone: "โพศรี" },
  { province: "udonthani", zone: "ทุ่งศรีเมือง" },
  { province: "udonthani", zone: "ตลาดรังษิณา" },
  { province: "udonthani", zone: "สี่แยกไฮเทค" },

  
  { province: "lampang", zone: "ตัวเมืองลำปาง" },
  { province: "lampang", zone: "สวนดอก" },
  { province: "lampang", zone: "ม.ราชภัฏลำปาง" },
  { province: "lampang", zone: "สบตุ๋ย" },
  { province: "lampang", zone: "เซ็นทรัลลำปาง" },
  { province: "lampang", zone: "รอบเวียง" },
  { province: "lampang", zone: "กาดกองต้า" },
  { province: "lampang", zone: "เกาะคา" },

  
  { province: "lamphun", zone: "ตัวเมืองลำพูน" },
  { province: "lamphun", zone: "นิคมลำพูน" },
  { province: "lamphun", zone: "เวียงยอง" },
  { province: "lamphun", zone: "ป่าซาง" },
  { province: "lamphun", zone: "เหมืองง่า" },

  
  { province: "phitsanulok", zone: "ตัวเมืองพิษณุโลก" },
  { province: "phitsanulok", zone: "รอบ มน." },
  { province: "phitsanulok", zone: "ท่าโพธิ์" },
  { province: "phitsanulok", zone: "สมอแข" },
  { province: "phitsanulok", zone: "เซ็นทรัลพิษณุโลก" },

  
  { province: "ayutthaya", zone: "โรจนะ" },
  { province: "ayutthaya", zone: "ตัวเมืองอยุธยา" },
  { province: "ayutthaya", zone: "บางปะอิน" },
  { province: "ayutthaya", zone: "ประตูชัย" },
  { province: "ayutthaya", zone: "เสนา" },

  
  { province: "korat", zone: "ในเมืองโคราช" },
  { province: "korat", zone: "เซ็นทรัลโคราช" },
  { province: "korat", zone: "เดอะมอลล์โคราช" },
  { province: "korat", zone: "มทส." },
  { province: "korat", zone: "จอหอ" },
  { province: "korat", zone: "ปากช่อง" },
  { province: "korat", zone: "เขาใหญ่" },

  
  { province: "songkhla", zone: "ตัวเมืองหาดใหญ่" },
  { province: "songkhla", zone: "คอหงส์" },
  { province: "songkhla", zone: "ม.อ.หาดใหญ่" },
  { province: "songkhla", zone: "ลีการ์เดนส์" },
  { province: "songkhla", zone: "ด่านนอก" },
  { province: "songkhla", zone: "ตัวเมืองสงขลา" },

  
  { province: "suratthani", zone: "ตัวเมืองสุราษฎร์" },
  { province: "suratthani", zone: "เกาะสมุย" },
  { province: "suratthani", zone: "เฉวง" },
  { province: "suratthani", zone: "ละไม" },
  { province: "suratthani", zone: "บ่อผุด" },
  { province: "suratthani", zone: "เกาะพะงัน" }
];

export default async (request, _context) => {
  const domain = CONFIG.PRIMARY_DOMAIN;
  const nowIso = new Date().toISOString();

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    const [provincesRes, profilesRes] = await Promise.all([
      supabase.from("provinces").select("*"),
      supabase.from("profiles").select("*").eq("active", true).limit(2000)
    ]);

    const provinces = provincesRes.data || [];
    const profiles = profilesRes.data || [];

    
    const provinceLatestDateMap = new Map();
    const zoneLatestDateMap = new Map();

    profiles.forEach(p => {
      const pKey = (p.provinceKey || p.province_key || p.province || "").toLowerCase().trim();
      const pLoc = (p.location || "").toLowerCase();
      const pDateStr = p.lastUpdated || p.last_updated || p.updated_at || p.created_at;
      
      if (pDateStr) {
        const pTime = new Date(pDateStr).getTime();
        if (!isNaN(pTime)) {
          if (pKey) {
            const curProv = provinceLatestDateMap.get(pKey) || 0;
            if (pTime > curProv) provinceLatestDateMap.set(pKey, pTime);
          }
          TARGET_SUB_ZONES.forEach(sz => {
            if (pKey.includes(sz.province) && pLoc.includes(sz.zone.toLowerCase())) {
              const zoneKey = `${sz.province}_${sz.zone}`;
              const curZone = zoneLatestDateMap.get(zoneKey) || 0;
              if (pTime > curZone) zoneLatestDateMap.set(zoneKey, pTime);
            }
          });
        }
      }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    
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
      xml += `    <loc>${domain}${p.path}</loc>\n`;
      xml += `    <lastmod>${nowIso}</lastmod>\n`;
      xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    
    if (provinces && provinces.length > 0) {
      provinces.forEach(p => {
        if (p && p.key) {
          const cleanKey = String(p.key).trim().toLowerCase();
          let provIsoDate = nowIso;
          const latestTimestamp = provinceLatestDateMap.get(cleanKey);
          if (latestTimestamp && latestTimestamp > 0) {
            provIsoDate = new Date(latestTimestamp).toISOString();
          }

          xml += `  <url>\n`;
          xml += `    <loc>${domain}/location/${encodeURIComponent(cleanKey)}</loc>\n`;
          xml += `    <lastmod>${provIsoDate}</lastmod>\n`;
          xml += `    <changefreq>daily</changefreq>\n`;
          xml += `    <priority>0.9</priority>\n`;
          xml += `  </url>\n`;
        }
      });
    }

   
    TARGET_SUB_ZONES.forEach(sz => {
      
      const hasActiveProfiles = profiles.some(p => {
        const pKey = (p.provinceKey || p.province_key || p.province || "").toLowerCase().trim();
        const pLoc = (p.location || "").toLowerCase();
        const pDesc = (p.description || "").toLowerCase();
        const pTags = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : String(p.styleTags || "")).toLowerCase();
        const cleanZ = sz.zone.toLowerCase();

        const isSameProv = pKey.includes(sz.province.toLowerCase());
        const isMatchZone = pLoc.includes(cleanZ) || pTags.includes(cleanZ) || pDesc.includes(cleanZ);
        return isSameProv && isMatchZone;
      });

      
      if (!hasActiveProfiles) return;

      const zoneKey = `${sz.province}_${sz.zone}`;
      const latestTimestamp = zoneLatestDateMap.get(zoneKey);
      const zoneIsoDate = latestTimestamp ? new Date(latestTimestamp).toISOString() : nowIso;
      const zoneUrl = encodeURI(`${domain}/location/${sz.province}/${sz.zone}`);

      xml += `  <url>\n`;
      xml += `    <loc>${zoneUrl}</loc>\n`;
      xml += `    <lastmod>${zoneIsoDate}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    
    if (profiles && profiles.length > 0) {
      profiles.forEach(p => {
        if (p && (p.slug || p.id)) {
          const rawSlug = String(p.slug || p.id).trim();
          const safeSlugUrl = `${domain}/sideline/${encodeURIComponent(rawSlug)}`;
          const modDate = safeGetIsoDate(p.lastUpdated || p.last_updated || p.updated_at || p.created_at, nowIso);

          let imageXml = "";
          const imgPath = getProfileMainImage(p);
          if (imgPath) {
            const imgUrl = optimizeImgForXml(imgPath);
            if (imgUrl) {
              const rawName = p.name ? String(p.name).trim().replace(/^(น้อง\s?)+/gi, "") : "สาวสวย";
              const displayName = `น้อง${rawName}`;
              imageXml = `\n    <image:image>\n      <image:loc>${escapeXml(imgUrl)}</image:loc>\n      <image:title>รูปโปรไฟล์${escapeXml(displayName)}</image:title>\n    </image:image>`;
            }
          }

          xml += `  <url>\n    <loc>${safeSlugUrl}</loc>\n    <lastmod>${modDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>${imageXml}\n  </url>\n`;
        }
      });
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff"
      }
    });

  } catch (err) {
    console.error("Sitemap generation error:", err);
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${domain}/</loc><lastmod>${nowIso}</lastmod></url></urlset>`, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" }
    });
  }
};
