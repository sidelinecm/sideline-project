import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";
import {
  CONFIG,
  MASTER_ZONES,
  normalizeProvKey,
  getCanonicalProfileSlug,
  safeOptimizeImg
} from "./shared-config.js";

const PROVINCE_NAME_MAP = {
  chiangmai: "เชียงใหม่",
  chiangrai: "เชียงราย",
  lampang: "ลำปาง",
  "khon-kaen": "ขอนแก่น",
  phuket: "ภูเก็ต",
  udonthani: "อุดรธานี",
  bangkok: "กรุงเทพฯ",
  chonburi: "ชลบุรี",
  lamphun: "ลำพูน",
  phitsanulok: "พิษณุโลก",
  ayutthaya: "อยุธยา",
  korat: "นครราชสีมา",
  songkhla: "สงขลา-หาดใหญ่",
  suratthani: "สุราษฎร์ธานี"
};

const PROVINCE_DETECTION_RULES = [
  { key: "chiangmai", keywords: ["เชียงใหม่", "นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก", "หลัง มช", "หน้า มช", "มช.", "ห้วยแก้ว", "สันทราย", "รวมโชค", "พายัพ", "แม่โจ้", "แม่ริม", "หางดง", "ท่าแพ", "คูเมือง", "เซ็นทรัลเฟส"] },
  { key: "bangkok", keywords: ["กรุงเทพ", "กทม", "สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย", "สาทร", "บางนา", "สีลม", "พระราม", "อารีย์"] },
  { key: "chonburi", keywords: ["ชลบุรี", "พัทยา", "บางแสน", "ศรีราชา", "จอมเทียน", "อมตะนคร", "แหลมฉบัง", "บ่อวิน"] },
  { key: "phuket", keywords: ["ภูเก็ต", "ป่าตอง", "กะทู้", "ฉลอง", "กะรน", "กะตะ", "บางเทา", "ราไวย์", "เชิงทะเล", "กมลา"] },
  { key: "khon-kaen", keywords: ["ขอนแก่น", "กังสดาล", "หลัง มข", "หน้า มข", "ม.ขอนแก่น", "บึงแก่นนคร", "โนนม่วง", "ม.ภาค", "เซ็นทรัลขอนแก่น", "ศิลา"] },
  { key: "udonthani", keywords: ["อุดรธานี", "อุดร", "ud town", "ยูดี", "หนองประจักษ์", "บ้านจาน", "บ้านจั่น", "โพศรี", "ทุ่งศรีเมือง", "เซ็นทรัลอุดร", "รังษิณา", "ไฮเทค"] },
  { key: "chiangrai", keywords: ["เชียงราย", "บ้านดู่", "มฟล", "แม่ฟ้าหลวง", "แม่สาย", "รอบเวียง", "หอนาฬิกา", "ริมกก", "เด่นห้า"] },
  { key: "lampang", keywords: ["ลำปาง", "สวนดอก", "สบตุ๋ย", "ม.ราชภัฏลำปาง", "ราชภัฏลำปาง", "เกาะคา", "อัศวิน", "กาดกองต้า"] },
  { key: "lamphun", keywords: ["ลำพูน", "นิคมลำพูน", "เวียงยอง", "ป่าซาง", "เหมืองง่า", "บ้านกลาง"] },
  { key: "korat", keywords: ["โคราช", "นครราชสีมา", "มทส", "ปากช่อง", "เขาใหญ่", "จอหอ"] },
  { key: "songkhla", keywords: ["หาดใหญ่", "สงขลา", "ม.อ.", "ลีการ์เดนส์", "ด่านนอก", "คอหงส์"] },
  { key: "suratthani", keywords: ["สุราษฎร์", "สมุย", "เกาะสมุย", "เฉวง", "ละไม", "บ่อผุด", "พะงัน"] },
  { key: "ayutthaya", keywords: ["อยุธยา", "โรจนะ", "บางปะอิน", "ประตูชัย", "เสนา"] },
  { key: "phitsanulok", keywords: ["พิษณุโลก", "รอบ มน", "มน.", "ม.นเรศวร", "ท่าโพธิ์", "สมอแข", "ท็อปแลนด์"] }
];

function detectAccurateProvince(p) {
  if (!p) return "chiangmai";
  const rawKey = (p.provinceKey || p.province_key || p.province_slug || "").toString().toLowerCase().trim();
  const INVALID_KEYS = ["", "no_province", "other", "undefined", "null", "none"];
  if (rawKey && !INVALID_KEYS.includes(rawKey)) {
    return normalizeProvKey(rawKey);
  }
  const fullText = [p.location || "", p.description || "", p.name || ""].join(" ").toLowerCase();
  for (const rule of PROVINCE_DETECTION_RULES) {
    if (rule.keywords.some((kw) => fullText.includes(kw))) return rule.key;
  }
  return "chiangmai";
}

function sanitizeMatchText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/ฟิลแฟน|ฟีลแฟน|ฟิวเเฟน|ฟิวแฟว/g, "ฟิวแฟน")
    .replace(/เจ็+ดยอด/g, "เจ็ดยอด")
    .replace(/นิมาน/g, "นิมมาน")
    .replace(/(โซน|ย่าน|แถว|พัก|อยู่)\s*นิทาน/g, "$1นิมมาน")
    .replace(/พาพับ/g, "พายัพ")
    .replace(/[\uD800-\uDFFF\uFFFD]/g, "")
    .replace(/🚨/g, "")
    .trim();
}

const escapeXml = (str) => !str ? "" : String(str).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

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
  if (!img || String(img).includes("firstmodelhub.webp")) {
    let gallery = p.galleryPaths || p.gallery_paths || p.gallery || p.photos || p.images;
    if (typeof gallery === "string") {
      const t = gallery.trim();
      if (t.startsWith("[")) {
        try { gallery = JSON.parse(t); } catch { gallery = []; }
      } else {
        gallery = t.split(/[\r\n]+|,\s*(?=https?:\/\/|\/)/).map((s) => s.trim()).filter(Boolean);
      }
    }
    if (Array.isArray(gallery)) {
      const validGal = gallery.find((g) => typeof g === "string" && g.trim().length >= 15 && !g.includes("firstmodelhub.webp"));
      if (validGal) img = validGal;
    }
  }
  if (!img || typeof img !== "string") return null;
  const trimmed = img.trim();
  if (trimmed.length < 15 || trimmed.includes("firstmodelhub.webp")) return null;
  return trimmed;
};

export default async () => {
  const domain = CONFIG.PRIMARY_DOMAIN;
  const fallbackDate = "2026-11-26T00:00:00.000Z";

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    const [provincesRes, profilesRes] = await Promise.all([
      supabase.from("provinces").select("*"),
      supabase.from("profiles").select("*").eq("active", true).limit(3000)
    ]);

    if (profilesRes.error || !Array.isArray(profilesRes.data)) {
      throw new Error(profilesRes.error?.message || "Failed to fetch profiles");
    }

    const provinces = Array.isArray(provincesRes.data) ? provincesRes.data : [];
    const profiles = profilesRes.data
      .map((p) => ({ ...p, _provKey: detectAccurateProvince(p) }))
      .filter((p) => {
        const n = (p.name || "").trim().toLowerCase().replace(/^(น้อง|สาว|พี่)\s*/gi, "");
        return Boolean(p && p.id && n && !["model", "สาวสวย", "-"].includes(n) && getProfileMainImage(p));
      });

    const latestSiteDate = profiles.reduce((max, p) => {
      const d = safeGetIsoDate(p.updated_at || p.created_at, fallbackDate);
      return d > max ? d : max;
    }, fallbackDate);

    const seenUrls = new Set();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    const appendUrl = (loc, lastmod, changefreq, priority, imageXml = "") => {
      if (!loc || seenUrls.has(loc)) return;
      seenUrls.add(loc);
      xml += `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${imageXml}\n  </url>\n`;
    };

    const staticPages = [
      { path: "/", priority: "1.0", changefreq: "daily", lastmod: latestSiteDate },
      { path: "/index-en", priority: "0.8", changefreq: "daily", lastmod: latestSiteDate },
      { path: "/profiles", priority: "0.9", changefreq: "daily", lastmod: latestSiteDate },
      { path: "/locations", priority: "0.9", changefreq: "daily", lastmod: latestSiteDate },
      { path: "/blog", priority: "0.8", changefreq: "weekly", lastmod: "2026-11-26T00:00:00.000Z" },
      { path: "/blog/what-is-trong-pok", priority: "0.8", changefreq: "monthly", lastmod: "2026-11-26T00:00:00.000Z" },
      { path: "/blog/safe-booking-anti-scam-guide", priority: "0.8", changefreq: "monthly", lastmod: "2026-11-26T00:00:00.000Z" },
      { path: "/blog/vip-etiquette-how-to-book-companion", priority: "0.8", changefreq: "monthly", lastmod: "2026-11-26T00:00:00.000Z" },
      { path: "/about", priority: "0.5", changefreq: "monthly", lastmod: "2026-11-01T00:00:00.000Z" },
      { path: "/faq", priority: "0.5", changefreq: "monthly", lastmod: "2026-11-01T00:00:00.000Z" },
      { path: "/privacy-policy", priority: "0.3", changefreq: "monthly", lastmod: "2026-11-01T00:00:00.000Z" }
    ];

    staticPages.forEach((p) => {
      appendUrl(domain + p.path, p.lastmod, p.changefreq, p.priority);
    });

    const seenProvKeys = new Set();
    provinces.forEach((prov) => {
      if (!prov?.key) return;
      const cleanKey = normalizeProvKey(prov.key);
      if (!cleanKey || seenProvKeys.has(cleanKey)) return;
      seenProvKeys.add(cleanKey);

      const provProfiles = profiles.filter((m) => m._provKey === cleanKey);
      if (provProfiles.length === 0) return;

      const provDate = provProfiles.reduce((max, m) => {
        const d = safeGetIsoDate(m.updated_at || m.created_at, fallbackDate);
        return d > max ? d : max;
      }, "2026-11-01T00:00:00.000Z");

      appendUrl(buildSafeUrl(domain, `/location/${cleanKey}`), provDate, "daily", "0.9");
    });

    Object.entries(MASTER_ZONES).forEach(([provSlug, zones]) => {
      zones.forEach((z) => {
        const zoneProfiles = profiles.filter((p) => {
          const rawTags = p.styleTags || p.style_tags;
          const tagsStr = Array.isArray(rawTags) ? rawTags.join(" ") : String(rawTags || "");
          const combined = `${sanitizeMatchText(p.location || "")} ${sanitizeMatchText(p.description || "")} ${tagsStr}`.toLowerCase();
          return p._provKey === provSlug && z.match.some((w) => combined.includes(w.toLowerCase()));
        });
        if (zoneProfiles.length < 2) return;

        const zoneDate = zoneProfiles.reduce((max, m) => {
          const d = safeGetIsoDate(m.updated_at || m.created_at, fallbackDate);
          return d > max ? d : max;
        }, "2026-11-01T00:00:00.000Z");

        appendUrl(buildSafeUrl(domain, `/location/${provSlug}/${z.slug}`), zoneDate, "daily", "0.9");
      });
    });

    profiles.forEach((p) => {
      const canonicalSlug = getCanonicalProfileSlug(p);
      const safeProfileUrl = buildSafeUrl(domain, `/sideline/${canonicalSlug}`);
      const modDate = safeGetIsoDate(p.updated_at || p.created_at, fallbackDate);

      let imageXml = "";
      const imgPath = getProfileMainImage(p);
      if (imgPath) {
        const imgUrl = safeOptimizeImg(imgPath, 600);
        if (imgUrl && imgUrl !== CONFIG.DEFAULT_OG_IMAGE && !imgUrl.includes("firstmodelhub.webp")) {
          const cleanName = sanitizeMatchText(p.name ? String(p.name) : "สาวสวย").replace(/^(น้อง\s?)+/gi, "").trim();
          const provName = (p.provinceThai || PROVINCE_NAME_MAP[p._provKey] || "").trim();
          const imgTitle = provName ? `น้อง${cleanName} ${provName}` : `น้อง${cleanName}`;
          imageXml = `\n    <image:image>\n      <image:loc>${escapeXml(imgUrl)}</image:loc>\n      <image:title>${escapeXml(imgTitle)}</image:title>\n    </image:image>`;
        }
      }

      appendUrl(safeProfileUrl, modDate, "weekly", "0.8", imageXml);
    });

    xml += `</urlset>`;
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=3600",
        "Netlify-CDN-Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (err) {
    console.error("Sitemap error:", err);
    return new Response("Service Temporarily Unavailable", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "Netlify-CDN-Cache-Control": "no-store",
        "Retry-After": "300"
      }
    });
  }
};