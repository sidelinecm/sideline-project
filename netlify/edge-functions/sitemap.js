import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const CONFIG = {
  get SUPABASE_URL() {
    try { return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co"; }
    catch { return "https://zxetzqwjaiumqhrpumln.supabase.co"; }
  },
  get SUPABASE_KEY() {
    try { return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
    catch { return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
  },
  PRIMARY_DOMAIN: "https://firstmodelhub.com"
};

const escapeXml = (str) => !str ? "" : String(str).replace(/[<>&'"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

const safeGetIsoDate = (dateStr, fallbackIso) => {
  if (!dateStr) return fallbackIso;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return fallbackIso;
    return d.getTime() > Date.now() ? new Date().toISOString() : d.toISOString();
  } catch { return fallbackIso; }
};

const buildSafeUrl = (baseDomain, path) => encodeURI(`${baseDomain}${path.trim().replace(/[\r\n\t]+/g, "").replace(/\s+/g, "-").replace(/\/+/g, "/")}`);

const getProfileMainImage = (p) => {
  if (!p) return null;
  let img = p.imagePath || p.image_path || p.image_url || p.imageUrl || p.img;
  if (!img) {
    const gallery = p.galleryPaths || p.gallery_paths || p.gallery || p.photos || p.images;
    if (Array.isArray(gallery) && gallery.length > 0) img = gallery[0];
    else if (typeof gallery === "string" && gallery.trim()) img = gallery.split(",")[0].trim();
  }
  if (!img || typeof img !== "string" || img.includes("firstmodelhub.webp")) return null;
  return img.trim();
};

// ✅ ใช้บัญชี dduxw7k4 + f_webp ตรงกับหน้าเว็บจริง 100%
const optimizeImgForXml = (path) => {
  if (!path || typeof path !== "string" || !path.trim()) return null;
  const cleanPath = path.trim();
  const transform = "f_webp,q_auto:good,w_600,h_840,c_fill,g_auto";
  const match = cleanPath.match(/(?:images\/)?[^\/\s\?]+\.(?:png|jpg|jpeg|webp|avif)/i);
  if (match) {
    let fileName = match[0].replace(/\.(png|jpg|jpeg|avif)$/i, ".webp");
    if (!fileName.startsWith("images/")) fileName = "images/" + fileName;
    return `https://res.cloudinary.com/dduxw7k4/image/upload/${transform}/${fileName}`;
  }
  return cleanPath;
};

const normalizeProvKey = (raw) => {
  let k = String(raw || "").trim().toLowerCase();
  if (k === "chiang_mai" || k === "chiang-mai") return "chiangmai";
  if (k === "khonkaen" || k === "khon_kaen") return "khon-kaen";
  if (k === "phra-nakhon-si-ayutthaya") return "ayutthaya";
  if (k === "nakhon-ratchasima" || k === "nakhonratchasima") return "korat";
  if (k === "hat-yai" || k === "hatyai") return "songkhla";
  if (k === "samui" || k === "surat-thani") return "suratthani";
  return k;
};

// ✅ โซนตรงกับ ssr-province.js 100% (ไม่มี namor / namor-kku / m-phak ที่ขัดกันแล้ว)
const TARGET_SUB_ZONES = [
  // 1. เชียงใหม่
  { province: "chiangmai", zone: "nimman", matchWords: ["นิมมาน", "nimman", "นิมมานเหมินท์"] },
  { province: "chiangmai", zone: "jedyod", matchWords: ["เจ็ดยอด"] },
  { province: "chiangmai", zone: "santitham", matchWords: ["สันติธรรม"] },
  { province: "chiangmai", zone: "changphueak", matchWords: ["ช้างเผือก"] },
  { province: "chiangmai", zone: "maejo", matchWords: ["แม่โจ้"] },
  { province: "chiangmai", zone: "cmu", matchWords: ["หลัง มช", "หลังมอ", "หลัง มช."] },
  { province: "chiangmai", zone: "front-cmu", matchWords: ["หน้า มช", "หน้ามอ", "หน้า มช."] },
  { province: "chiangmai", zone: "sansai", matchWords: ["สันทราย"] },
  { province: "chiangmai", zone: "hangdong", matchWords: ["หางดง"] },
  { province: "chiangmai", zone: "maerim", matchWords: ["แม่ริม"] },
  { province: "chiangmai", zone: "kumueang", matchWords: ["คูเมือง", "ในเมืองเชียงใหม่", "ตัวเมืองเชียงใหม่"] },
  { province: "chiangmai", zone: "thapae", matchWords: ["ท่าแพ"] },
  { province: "chiangmai", zone: "huaykaew", matchWords: ["ห้วยแก้ว"] },
  { province: "chiangmai", zone: "ruamchok", matchWords: ["รวมโชค"] },
  { province: "chiangmai", zone: "payap", matchWords: ["พายัพ"] },
  { province: "chiangmai", zone: "centralfest", matchWords: ["เซ็นทรัลเฟส", "เซ็นทรัลเฟสติวัล"] },
  { province: "chiangmai", zone: "airport-cnx", matchWords: ["สนามบิน"] },

  // 2. ภูเก็ต
  { province: "phuket", zone: "patong", matchWords: ["ป่าตอง"] },
  { province: "phuket", zone: "mueang-phuket", matchWords: ["ตัวเมืองภูเก็ต", "เมืองภูเก็ต", "ในเมือง"] },
  { province: "phuket", zone: "kathu", matchWords: ["กะทู้"] },
  { province: "phuket", zone: "chalong", matchWords: ["ฉลอง"] },
  { province: "phuket", zone: "karon", matchWords: ["กะรน"] },
  { province: "phuket", zone: "kata", matchWords: ["กะตะ"] },
  { province: "phuket", zone: "bangtao", matchWords: ["บางเทา"] },
  { province: "phuket", zone: "rawai", matchWords: ["ราไวย์"] },
  { province: "phuket", zone: "cherngtalay", matchWords: ["เชิงทะเล"] },
  { province: "phuket", zone: "kamala", matchWords: ["กมลา"] },

  // 3. ขอนแก่น
  { province: "khon-kaen", zone: "kangsadan", matchWords: ["กังสดาล"] },
  { province: "khon-kaen", zone: "kku", matchWords: ["หลัง มข", "หลัง มข."] },
  { province: "khon-kaen", zone: "kku-front", matchWords: ["หน้า มข", "หน้า มข."] },
  { province: "khon-kaen", zone: "nonmuang", matchWords: ["โนนม่วง"] },
  { province: "khon-kaen", zone: "central-khonkaen", matchWords: ["เซ็นทรัลขอนแก่น"] },
  { province: "khon-kaen", zone: "buengkaennakhon", matchWords: ["บึงแก่นนคร"] },
  { province: "khon-kaen", zone: "mueang-khonkaen", matchWords: ["ในตัวเมือง", "ในเมือง"] },
  { province: "khon-kaen", zone: "m-phak-area", matchWords: ["ม.ภาค"] },

  // 4. เชียงราย
  { province: "chiangrai", zone: "baandu", matchWords: ["บ้านดู่"] },
  { province: "chiangrai", zone: "mfu", matchWords: ["หน้า มฟล", "มฟล", "แม่ฟ้าหลวง"] },
  { province: "chiangrai", zone: "mueang-chiangrai", matchWords: ["ตัวเมือง", "ในเมือง"] },
  { province: "chiangrai", zone: "clock-tower", matchWords: ["หอนาฬิกา"] },
  { province: "chiangrai", zone: "rim-kok", matchWords: ["ริมกก"] },
  { province: "chiangrai", zone: "maesai", matchWords: ["แม่สาย"] },

  // 5. อุดรธานี
  { province: "udonthani", zone: "udtown", matchWords: ["ud town", "ยูดีทาวน์", "udtown"] },
  { province: "udonthani", zone: "nongprajak", matchWords: ["หนองประจักษ์"] },
  { province: "udonthani", zone: "central-udon", matchWords: ["เซ็นทรัลอุดร"] },
  { province: "udonthani", zone: "mueang-udon", matchWords: ["ตัวเมือง", "ในเมือง"] },
  { province: "udonthani", zone: "ban-chan", matchWords: ["บ้านจาน", "บ้านจั่น"] },
  { province: "udonthani", zone: "rangsina", matchWords: ["รังษิณา"] },

  // 6. ลำปาง
  { province: "lampang", zone: "mueang-lampang", matchWords: ["ตัวเมือง", "ในเมือง"] },
  { province: "lampang", zone: "suan-dok", matchWords: ["สวนดอก"] },
  { province: "lampang", zone: "lpru", matchWords: ["ราชภัฏลำปาง"] },
  { province: "lampang", zone: "sob-tui", matchWords: ["สบตุ๋ย"] },
  { province: "lampang", zone: "atsavin", matchWords: ["อัศวิน"] },
  { province: "lampang", zone: "ko-kha", matchWords: ["เกาะคา"] }
];

export default async () => {
  const domain = CONFIG.PRIMARY_DOMAIN;
  const fallbackDate = "2026-11-22T00:00:00.000Z";

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    const [provincesRes, profilesRes] = await Promise.all([
      supabase.from("provinces").select("*"),
      supabase.from("profiles").select("*").eq("active", true).limit(3000)
    ]);

    const provinces = provincesRes.data || [];
    const profiles = (profilesRes.data || []).filter(p => {
      const n = (p.name || "").trim().toLowerCase().replace(/^(น้อง|สาว|พี่)\s*/gi, "");
      const img = (p.imagePath || p.image_url || "").trim().toLowerCase();
      return p && p.id && n && !["model", "สาวสวย", "-"].includes(n) && img.length >= 15 && !img.includes("firstmodelhub.webp");
    });

    const latestSiteDate = profiles.reduce((max, p) => {
      const d = safeGetIsoDate(p.updated_at || p.created_at, fallbackDate);
      return d > max ? d : max;
    }, fallbackDate);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    const staticPages = [
      { path: "/", priority: "1.0", changefreq: "daily", lastmod: latestSiteDate },
      { path: "/profiles", priority: "0.9", changefreq: "daily", lastmod: latestSiteDate },
      { path: "/locations", priority: "0.9", changefreq: "daily", lastmod: latestSiteDate },
      { path: "/blog", priority: "0.8", changefreq: "weekly", lastmod: "2026-11-20T00:00:00.000Z" },
      { path: "/blog/what-is-trong-pok", priority: "0.8", changefreq: "monthly", lastmod: "2026-11-15T00:00:00.000Z" },
      { path: "/blog/what-is-gfe-fiwfan-guide", priority: "0.8", changefreq: "monthly", lastmod: "2026-11-15T00:00:00.000Z" },
      { path: "/blog/safe-booking-anti-scam-guide", priority: "0.8", changefreq: "monthly", lastmod: "2026-11-15T00:00:00.000Z" },
      { path: "/blog/vip-etiquette-how-to-book-companion", priority: "0.8", changefreq: "monthly", lastmod: "2026-11-15T00:00:00.000Z" },
      { path: "/about", priority: "0.5", changefreq: "monthly", lastmod: "2026-11-01T00:00:00.000Z" },
      { path: "/faq", priority: "0.5", changefreq: "monthly", lastmod: "2026-11-01T00:00:00.000Z" },
      { path: "/privacy-policy", priority: "0.3", changefreq: "monthly", lastmod: "2026-11-01T00:00:00.000Z" }
    ];

    staticPages.forEach(p => {
      xml += `  <url>\n    <loc>${escapeXml(domain + p.path)}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    });

    // ✅ เฉพาะจังหวัดที่มีโปรไฟล์จริง >= 1 คนใน Supabase
    provinces.forEach(prov => {
      if (!prov?.key) return;
      const cleanKey = normalizeProvKey(prov.key);
      const provProfiles = profiles.filter(m => normalizeProvKey(m.provinceKey || m.province_slug || m.province_key || "chiangmai") === cleanKey);
      if (provProfiles.length === 0) return;

      const provDate = provProfiles.reduce((max, m) => {
        const d = safeGetIsoDate(m.updated_at || m.created_at, fallbackDate);
        return d > max ? d : max;
      }, "2026-11-01T00:00:00.000Z");

      xml += `  <url>\n    <loc>${escapeXml(buildSafeUrl(domain, `/location/${cleanKey}`))}</loc>\n    <lastmod>${provDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    // ✅ เฉพาะโซนที่มีโปรไฟล์จริง >= 1 คน
    TARGET_SUB_ZONES.forEach(sz => {
      const zoneProfiles = profiles.filter(p => {
        const pKey = normalizeProvKey(p.provinceKey || p.province_key || p.province_slug || "chiangmai");
        const pLoc = (p.location || "").toLowerCase();
        return pKey === sz.province && sz.matchWords.some(w => pLoc.includes(w.toLowerCase()));
      });
      if (zoneProfiles.length === 0) return;

      const zoneDate = zoneProfiles.reduce((max, m) => {
        const d = safeGetIsoDate(m.updated_at || m.created_at, fallbackDate);
        return d > max ? d : max;
      }, "2026-11-01T00:00:00.000Z");

      xml += `  <url>\n    <loc>${escapeXml(buildSafeUrl(domain, `/location/${sz.province}/${sz.zone}`))}</loc>\n    <lastmod>${zoneDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    // โปรไฟล์รายคน
    profiles.forEach(p => {
      let rawSlug = String(p.slug || p.id).trim();
      if (/[\u0E00-\u0E7F]/.test(rawSlug)) rawSlug = `model-${p.id}`;

      const safeProfileUrl = buildSafeUrl(domain, `/sideline/${rawSlug}`);
      const modDate = safeGetIsoDate(p.updated_at || p.created_at, fallbackDate);

      let imageXml = "";
      const imgPath = getProfileMainImage(p);
      if (imgPath) {
        const imgUrl = optimizeImgForXml(imgPath);
        if (imgUrl) {
          const cleanName = (p.name ? String(p.name) : "สาวสวย").replace(/^(น้อง\s?)+/gi, "").replace(/🚨/g, "").trim();
          imageXml = `\n    <image:image>\n      <image:loc>${escapeXml(imgUrl)}</image:loc>\n      <image:title>น้อง${escapeXml(cleanName)}</image:title>\n    </image:image>`;
        }
      }

      xml += `  <url>\n    <loc>${escapeXml(safeProfileUrl)}</loc>\n    <lastmod>${modDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>${imageXml}\n  </url>\n`;
    });

    xml += `</urlset>`;
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (err) {
    console.error("Sitemap error:", err);
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${domain}/</loc><lastmod>${fallbackDate}</lastmod></url></urlset>`, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" }
    });
  }
};
