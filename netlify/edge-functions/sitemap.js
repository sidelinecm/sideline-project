/**
 * ==============================================================================
 * 💎 FIRST MODEL HUB - DYNAMIC XML SITEMAP ENGINE (sitemap.js)
 * Production-Ready Edge Function for Search Engines (FULL 2026)
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
  if (p.imagePath && typeof p.imagePath === "string" && p.imagePath.trim()) return p.imagePath.trim();
  const gallery = p.galleryPaths || p.gallery_paths || p.gallery;
  if (Array.isArray(gallery) && gallery.length > 0 && gallery[0]) return String(gallery[0]).trim();
  if (typeof gallery === "string" && gallery.trim()) return gallery.split(",")[0].trim();
  if (p.image_url && typeof p.image_url === "string" && p.image_url.trim()) return p.image_url.trim();
  if (p.imageUrl && typeof p.imageUrl === "string" && p.imageUrl.trim()) return p.imageUrl.trim();
  return null;
};

const optimizeImgForXml = (path) => {
  if (!path || typeof path !== "string" || !path.trim()) return null;
  const cleanPath = path.trim();
  if (cleanPath.includes("res.cloudinary.com")) {
    return cleanPath.replace(/\/upload\/(?:[^\/]+\/)*(v\d+\/)/, "/upload/$1");
  }
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }
  return `${CONFIG.SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/profile-images/${encodeURIComponent(cleanPath)}`;
};

export default async (request, _context) => {
  const url = new URL(request.url);
  const domain = CONFIG.PRIMARY_DOMAIN;
  const nowIso = new Date().toISOString();

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    const [provincesRes, profilesRes] = await Promise.all([
      supabase.from("provinces").select("id, key, nameThai, updated_at, updatedAt").order("nameThai", { ascending: true }),
      supabase.from("profiles").select("id, slug, name, imagePath, galleryPaths, gallery_paths, image_url, imageUrl, lastUpdated, last_updated, updated_at, created_at, active").eq("active", true).order("updated_at", { ascending: false })
    ]);

    const provinces = provincesRes.data || [];
    const profiles = profilesRes.data || [];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // 1. หน้าสถิติหลัก (Static Core Pages)
    const staticPages = [
      { path: "", priority: "1.0", changefreq: "daily" },
      { path: "/profiles", priority: "0.9", changefreq: "daily" },
      { path: "/locations", priority: "0.9", changefreq: "daily" },
      { path: "/about", priority: "0.5", changefreq: "monthly" },
      { path: "/faq", priority: "0.5", changefreq: "monthly" }
    ];

    staticPages.forEach(p => {
      xml += `  <url>\n`;
      xml += `    <loc>${domain}${p.path}</loc>\n`;
      xml += `    <lastmod>${nowIso}</lastmod>\n`;
      xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // 2. หมวดจังหวัด (Provinces Section)
    if (provinces && provinces.length > 0) {
      provinces.forEach(p => {
        if (p && p.key) {
          const cleanKey = String(p.key).trim().toLowerCase();
          const provDate = safeGetIsoDate(p.updated_at || p.updatedAt, nowIso);
          xml += `  <url>\n`;
          xml += `    <loc>${domain}/location/${encodeURIComponent(cleanKey)}</loc>\n`;
          xml += `    <lastmod>${provDate}</lastmod>\n`;
          xml += `    <changefreq>daily</changefreq>\n`;
          xml += `    <priority>0.9</priority>\n`;
          xml += `  </url>\n`;
        }
      });
    }

    // 3. หมวดโปรไฟล์ (Profiles Section with Image Metadata)
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