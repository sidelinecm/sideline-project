import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";
import {
  MASTER_ZONES,
  normalizeProvKey,
  getCanonicalProfileSlug,
  safeOptimizeImg
} from "./shared-config.js";

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

export default async () => {
  const domain = CONFIG.PRIMARY_DOMAIN;
  const fallbackDate = "2026-11-25T00:00:00.000Z";

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

    // เฉพาะจังหวัดที่มีโปรไฟล์จริง >= 1 คน
    const seenProvKeys = new Set();
    provinces.forEach(prov => {
      if (!prov?.key) return;
      const cleanKey = normalizeProvKey(prov.key);
      if (seenProvKeys.has(cleanKey)) return;
      seenProvKeys.add(cleanKey);

      const provProfiles = profiles.filter(m => normalizeProvKey(m.provinceKey || m.province_slug || m.province_key || "chiangmai") === cleanKey);
      if (provProfiles.length === 0) return;

      const provDate = provProfiles.reduce((max, m) => {
        const d = safeGetIsoDate(m.updated_at || m.created_at, fallbackDate);
        return d > max ? d : max;
      }, "2026-11-01T00:00:00.000Z");

      xml += `  <url>\n    <loc>${escapeXml(buildSafeUrl(domain, `/location/${cleanKey}`))}</loc>\n    <lastmod>${provDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    // ดึงโซนจาก MASTER_ZONES เดียวกับ ssr-province.js และใส่เฉพาะโซนที่มี >= 2 โปรไฟล์ (ไม่เอาหน้า noindex เข้า Sitemap)
    Object.entries(MASTER_ZONES).forEach(([provSlug, zones]) => {
      zones.forEach(z => {
        const zoneProfiles = profiles.filter(p => {
          const pKey = normalizeProvKey(p.provinceKey || p.province_key || p.province_slug || "chiangmai");
          const rawTags = p.styleTags || p.style_tags; const tagsStr = Array.isArray(rawTags) ? rawTags.join(" ") : String(rawTags || "");
          const combined = `${p.location || ""} ${p.description || ""} ${tagsStr}`.toLowerCase();
          return pKey === provSlug && z.match.some(w => combined.includes(w.toLowerCase()));
        });
        if (zoneProfiles.length < 2) return;

        const zoneDate = zoneProfiles.reduce((max, m) => {
          const d = safeGetIsoDate(m.updated_at || m.created_at, fallbackDate);
          return d > max ? d : max;
        }, "2026-11-01T00:00:00.000Z");

        xml += `  <url>\n    <loc>${escapeXml(buildSafeUrl(domain, `/location/${provSlug}/${z.slug}`))}</loc>\n    <lastmod>${zoneDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      });
    });

    // โปรไฟล์รายคน (ใช้ Canonical Slug เดียวกับ render-bot.js และ ssr-province.js)
    profiles.forEach(p => {
      const canonicalSlug = getCanonicalProfileSlug(p);
      const safeProfileUrl = buildSafeUrl(domain, `/sideline/${canonicalSlug}`);
      const modDate = safeGetIsoDate(p.updated_at || p.created_at, fallbackDate);

      let imageXml = "";
      const imgPath = getProfileMainImage(p);
      if (imgPath) {
        const imgUrl = safeOptimizeImg(imgPath, 600);
        if (imgUrl && !imgUrl.includes("firstmodelhub.webp")) {
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
