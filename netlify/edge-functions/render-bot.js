/**
 * ==============================================================================
 * 💎 FIRST MODEL HUB - STANDALONE BOT & PRE-RENDER ENGINE (render-bot.js)
 * Version: 2026.1 (Production-Ready / Standalone HTML Architecture)
 * Scope: Handles `/sideline/:slug` for Crawlers & Direct Botanical Rendering
 * ==============================================================================
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const CONFIG = {
  get SUPABASE_URL() {
    try { return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co"; } catch { return "https://zxetzqwjaiumqhrpumln.supabase.co"; }
  },
  get SUPABASE_KEY() {
    try { return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; } catch { return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
  },
  DOMAIN: "https://firstmodelhub.com",
  BRAND_NAME: "First Model Hub",
  DEFAULT_LINE_URL: "https://line.me/ti/p/ksLUWB89Y_",
  DEFAULT_OG_IMAGE: "https://firstmodelhub.com/images/firstmodelhub.webp"
};

/* ==============================================================================
   🛠️ HELPER FUNCTIONS (SANITIZATION & IMAGE OPTIMIZATION)
   ============================================================================== */

const escapeHTML = (str) => (str !== null && str !== undefined)
  ? String(str).replace(/[&<>'"]/g, tag => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[tag] || tag))
  : "";

const stripHTML = (str) => (str !== null && str !== undefined)
  ? String(str).replace(/<[^>]*>?/gm, "").trim()
  : "";

// 🟢 ป้องกันคำว่า "น้องน้อง" ซ้ำซ้อน
const sanitizeName = (rawName) => {
  if (!rawName || typeof rawName !== "string") return "สาวสวย";
  let cleaned = rawName.trim().replace(/^(น้อง\s?)+/gi, "").trim();
  return cleaned ? `น้อง${cleaned}` : "สาวสวย";
};

// 🟢 ลบเฉพาะเส้นกรอบและตัวการ์ตูน ASCII ที่ขัดต่อการอ่านของ Google
const cleanAsciiArt = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬]+/g, "")
    .replace(/[„•ㅅ•„]+/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
};

// 🟢 จัดการ URL รูปภาพ ให้ดึงจาก Cloudinary/Supabase CDN ป้องกันรูปหลุด
const optimizeImg = (path, width = 600, height = 800) => {
  if (!path || typeof path !== "string" || !path.trim() || path.includes("firstmodelhub.webp")) {
    return CONFIG.DEFAULT_OG_IMAGE;
  }
  const cleanPath = path.trim().replace(/^\/+/, "").replace(/^profile-images\//, "");
  if (cleanPath.includes("res.cloudinary.com")) {
    const cleanCloudinary = cleanPath.replace(/\/upload\/(?:[^\/]+\/)*(v\d+\/)/, "/upload/$1");
    return cleanCloudinary.replace("/upload/", `/upload/f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face/`);
  }
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }
  return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${cleanPath}?width=${width}&height=${height}&resize=cover`;
};

const getProfileMainImage = (p) => {
  if (!p) return null;
  if (p.imagePath && typeof p.imagePath === "string" && p.imagePath.trim()) return p.imagePath.trim();
  const gallery = p.galleryPaths || p.gallery_paths || p.gallery;
  if (Array.isArray(gallery) && gallery.length > 0 && gallery[0]) return String(gallery[0]).trim();
  if (typeof gallery === "string" && gallery.trim()) return gallery.split(",")[0].trim();
  return null;
};

/* ==============================================================================
   🚀 MAIN EDGE FUNCTION HANDLER
   ============================================================================== */

export default async (request, context) => {
  const url = new URL(request.url);
  const dynamicDomain = `${url.protocol}//${url.host}`;
  const ua = (request.headers.get("User-Agent") || "").toLowerCase();

  // ตรวจสอบว่าร้องขอมาจาก บอทค้นหา หรือไม่
  const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|lighthouse|bingbot|applebot|gptbot|chatgpt/i.test(ua);

  const pathParts = url.pathname.split("/").filter(Boolean);

  // หากไม่ใช่ บอท และไม่ใช่หน้าโปรไฟล์รายบุคคล (/sideline/...) ให้ปล่อยผ่านไปให้ไฟล์อื่นทำงาน
  if (!isBot && pathParts[0] !== "sideline") {
    return context.next();
  }

  if (pathParts[0] !== "sideline" || pathParts.length < 2) {
    return context.next();
  }

  const rawSlug = pathParts[pathParts.length - 1];
  let slug = rawSlug;
  try { slug = decodeURIComponent(rawSlug); } catch (e) { slug = rawSlug; }

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    let query = supabase
      .from("profiles")
      .select("id, slug, name, imagePath, galleryPaths, gallery_paths, location, rate, age, description, provinceKey, lineId, line_id, height, weight, stats, provinces(nameThai, key)")
      .eq("active", true);

    if (/^\d+$/.test(slug)) {
      query = query.eq("id", slug);
    } else {
      query = query.eq("slug", slug);
    }

    const { data: p } = await query.maybeSingle();

    // 🟢 Graceful Fallback: หากไม่พบโปรไฟล์ใน DB ให้ปล่อยผ่านไปยัง Client-side ล่าสุด ไม่ตัดเป็น 404 มั่วซั่ว
    if (!p) {
      return context.next();
    }

    // ดึงโปรไฟล์แนะนำเพิ่มเติมในจังหวัดเดียวกัน
    let related = [];
    if (p.provinceKey) {
      const { data: relatedData } = await supabase
        .from("profiles")
        .select("id, slug, name, imagePath, galleryPaths, gallery_paths, location")
        .eq("provinceKey", p.provinceKey)
        .eq("active", true)
        .neq("id", p.id)
        .limit(4);
      related = relatedData || [];
    }

    const displayName = sanitizeName(p.name);
    const provinceName = p.provinces?.nameThai || p.location || "เชียงใหม่";
    const provinceKey = p.provinces?.key || "chiangmai";
    const correctProvinceUrl = provinceKey === "chiangmai" ? dynamicDomain : `${dynamicDomain}/location/${provinceKey}`;

    const cleanedRate = String(p.rate || "1500").replace(/[^0-9]/g, "");
    const rawRate = parseInt(cleanedRate, 10) || 1500;
    const displayPrice = rawRate.toLocaleString() + ".-";

    const mainImgPath = getProfileMainImage(p);
    const baseImageUrl = optimizeImg(mainImgPath, 600, 800);
    const lcpImageUrl = optimizeImg(mainImgPath, 400, 533);

    const rawLine = p.lineId || p.line_id || "";
    const lineClean = String(rawLine).replace(/^@/, "").trim();
    const finalLineUrl = lineClean ? (lineClean.startsWith("http") ? lineClean : `https://line.me/ti/p/~${lineClean}`) : CONFIG.DEFAULT_LINE_URL;

    const pageTitle = `${displayName} ไซด์ไลน์${provinceName} สาวรับงานฟิวแฟนตรงปก จ่ายหน้างาน`;
    const canonicalUrl = `${dynamicDomain}/sideline/${encodeURIComponent(p.slug || p.id)}`;
    const metaDesc = `โปรไฟล์ ${displayName} สาวรับงานไซด์ไลน์พิกัดย่าน ${p.location || provinceName} ตรงปก 100% ค่าขนม ${displayPrice} ดูแลสไตล์ฟิวแฟน ปลอดภัยจ่ายหน้างาน ไม่โอนมัดจำล่วงหน้า`;

    // 🟢 2026 Google Rich Results Schema Graph
    const schemaData = {
      "@context": "https://schema.org/",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${dynamicDomain}/#organization`,
          "name": CONFIG.BRAND_NAME,
          "url": dynamicDomain,
          "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}/images/firstmodelhub.webp` }
        },
        {
          "@type": "Product",
          "@id": `${canonicalUrl}#product`,
          "name": pageTitle,
          "url": canonicalUrl,
          "image": [baseImageUrl],
          "description": stripHTML(metaDesc),
          "sku": `PROFILE-${p.id}`,
          "brand": { "@id": `${dynamicDomain}/#organization` },
          "offers": {
            "@type": "Offer",
            "url": canonicalUrl,
            "price": rawRate.toString(),
            "priceCurrency": "THB",
            "priceValidUntil": `${new Date().getFullYear() + 1}-12-31`,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "description": "ชำระค่าบริการโดยตรงหน้างานเมื่อเจอน้องตัวจริง ไม่มีการโอนเงินมัดจำล่วงหน้า"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "38",
            "bestRating": "5",
            "worstRating": "1"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": dynamicDomain },
            { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceName}`, "item": correctProvinceUrl },
            { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
          ]
        }
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${escapeHTML(pageTitle)} | ${CONFIG.BRAND_NAME}</title>
    <meta name="description" content="${escapeHTML(metaDesc)}">
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="alternate" hreflang="th" href="${canonicalUrl}">
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#5A2CBE">
    
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${lcpImageUrl}" fetchpriority="high">
    
    <meta property="og:site_name" content="${escapeHTML(CONFIG.BRAND_NAME)}">
    <meta property="og:title" content="${escapeHTML(pageTitle)}">
    <meta property="og:description" content="${escapeHTML(metaDesc)}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="${baseImageUrl}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
    <meta name="twitter:description" content="${escapeHTML(metaDesc)}">
    <meta name="twitter:image" content="${baseImageUrl}">
    
    <link rel="shortcut icon" href="/images/favicon.ico">
    <script type="application/ld+json">${JSON.stringify(schemaData).replace(/</g, '\\u003c')}</script>

    <style>
        :root { --primary:#C084FC; --bg:#060411; --card:#0D081F; --txt:#E4E4E7; --green:#00E676; --border:rgba(192, 132, 252, 0.25); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--txt); line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: var(--card); min-height: 100vh; border-left: 1px solid var(--border); border-right: 1px solid var(--border); padding: 16px; }
        .nav-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(20, 10, 42, 0.9); border-radius: 14px; border: 1px solid var(--border); margin-bottom: 16px; }
        .brand-logo { font-size: 16px; font-weight: 900; color: #FFF; text-decoration: none; }
        .breadcrumb { font-size: 12px; color: #A1A1AA; margin-bottom: 16px; }
        .breadcrumb a { color: var(--primary); text-decoration: none; }
        .hero-img-box { position: relative; border-radius: 20px; overflow: hidden; border: 1px solid var(--border); background: #000; margin-bottom: 16px; }
        .hero-img { width: 100%; aspect-ratio: 4/5; object-fit: cover; object-position: top center; display: block; }
        .status-chip { background: rgba(9, 9, 11, 0.85); border: 1px solid var(--green); color: var(--green); font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 100px; display: inline-flex; align-items: center; gap: 6px; }
        .info-card { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 16px; padding: 16px; margin-bottom: 16px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center; margin-bottom: 12px; }
        .grid-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 8px; border-radius: 100px; }
        .btn-line { display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #11783B, #00E676); color: #FFF; font-weight: 800; font-size: 15px; padding: 14px; border-radius: 100px; text-decoration: none; box-shadow: 0 6px 20px rgba(0,230,118,0.3); }
        .related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 12px; }
        .related-card { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; text-decoration: none; color: #FFF; display: block; }
        .related-card img { width: 100%; aspect-ratio: 4/5; object-fit: cover; }
        .related-card h3 { padding: 8px; text-align: center; font-size: 12px; font-weight: 800; margin: 0; }
        h2.section-title { font-size: 15px; font-weight: 800; color: var(--primary); margin: 0 0 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER NAV -->
        <header class="nav-header">
            <a href="/" class="brand-logo">FirstModel<span style="color:#C084FC;">Hub</span>🌟</a>
            <span style="font-size:12px; color:#00E676; font-weight:800;">🟢 พร้อมรับงาน</span>
        </header>

        <!-- BREADCRUMB (INTERNAL LINKING) -->
        <nav aria-label="breadcrumb" class="breadcrumb">
            <a href="/">หน้าแรก</a> &gt; 
            <a href="${correctProvinceUrl}">สาวรับงาน${escapeHTML(provinceName)}</a> &gt; 
            <span>${escapeHTML(displayName)}</span>
        </nav>

        <!-- MAIN ARTICLE CONTENT -->
        <main>
            <article>
                <!-- H1: PAGE MAIN TITLE -->
                <h1 style="font-size:20px; font-weight:900; margin-bottom:12px; text-align:center;">${escapeHTML(pageTitle)}</h1>

                <div class="hero-img-box">
                    <img src="${lcpImageUrl}" class="hero-img" alt="${escapeHTML(displayName)} สาวรับงาน${escapeHTML(provinceName)} ไซด์ไลน์${escapeHTML(provinceName)} ฟิวแฟนตรงปก" fetchpriority="high" decoding="async" width="400" height="500">
                </div>

                <div class="info-card">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <div>
                            <span class="status-chip">🟢 พร้อมรับงาน</span>
                            <div style="font-size:18px; font-weight:900; margin-top:6px; color:#FFF;">${escapeHTML(displayName)}</div>
                            <p style="color:#C084FC; font-size:12px; font-weight:700;">📍 ย่าน${escapeHTML(p.location || provinceName)}</p>
                        </div>
                        <div style="text-align:right;">
                            <small style="color:#A1A1AA; font-size:11px;">ค่าขนมบริการ</small>
                            <div style="color:#00E676; font-size:22px; font-weight:900;">${displayPrice}</div>
                        </div>
                    </div>

                    <!-- H2: SECTION 1 -->
                    <h2 class="section-title">📋 สัดส่วนและข้อมูลรายละเอียด</h2>

                    <div class="grid-3">
                        <div class="grid-box"><small style="color:#A1A1AA; font-size:10px;">ส่วนสูง</small><br><strong>${p.height || "-"} ซม.</strong></div>
                        <div class="grid-box"><small style="color:#A1A1AA; font-size:10px;">น้ำหนัก</small><br><strong>${p.weight || "-"} กก.</strong></div>
                        <div class="grid-box"><small style="color:#A1A1AA; font-size:10px;">สัดส่วน</small><br><strong>${p.stats || `${p.bust || 32}-${p.waist || 24}-${p.hips || 35}`}</strong></div>
                    </div>

                    <p style="font-size:12.5px; color:#E4E4E7; margin-bottom:16px; white-space:pre-line;">${escapeHTML(cleanAsciiArt(p.description || "ดูแลเอาใจใส่สุภาพเรียบร้อย เป็นกันเองสไตล์ฟิวแฟน ตรงปก 100% ไม่โอนมัดจำล่วงหน้า จ่ายหน้างานเมื่อเจอตัวจริง"))}</p>

                    <!-- OUTBOUND CONVERSION LINK -->
                    <a href="${finalLineUrl}" target="_blank" rel="nofollow noopener" class="btn-line">
                        💬 แอดไลน์จองคิว ${escapeHTML(displayName)}
                    </a>
                </div>

                <!-- H2: SECTION 2 (RELATED PROFILES INTERNAL LINKING) -->
                ${related.length > 0 ? `
                <section style="margin-top:24px;">
                    <h2 class="section-title">📍 น้องๆ แนะนำในโซน${escapeHTML(provinceName)}</h2>
                    <div class="related-grid">
                        ${related.map(r => {
                            const relName = sanitizeName(r.name);
                            const relLoc = escapeHTML(r.location || provinceName);
                            return `
                            <a href="/sideline/${encodeURIComponent(r.slug || r.id)}" class="related-card">
                                <img src="${optimizeImg(getProfileMainImage(r), 300, 375)}" alt="${escapeHTML(relName)} สาวรับงาน${escapeHTML(provinceName)} ย่าน${relLoc} ไซด์ไลน์ตรงปก" loading="lazy" width="300" height="375">
                                <h3>${escapeHTML(relName)}</h3>
                            </a>
                            `;
                        }).join("")}
                    </div>
                </section>
                ` : ""}

                <!-- H2: SECTION 3 (TERMS & SAFETY) -->
                <section style="margin-top:24px;">
                    <h2 class="section-title">🛡️ แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัย</h2>
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; font-size: 11.5px; color: #A1A1AA; line-height: 1.7;">
                        <p>✓ <strong>จ่ายหน้างาน 100%</strong>: นัดเจอตัวจริงตรงปกค่อยชำระเงิน ไม่มีโอนมัดจำล่วงหน้าทุกกรณี</p>
                        <p>✓ <strong>ผู้ใช้บริการต้องมีอายุ 20 ปีขึ้นไป</strong>: เป็นบริการเอนเตอร์เทนเพื่อนเที่ยวสไตล์ฟิวแฟนระดับสุภาพ</p>
                    </div>
                </section>
            </article>
        </main>

        <!-- FOOTER (INTERNAL LINKS BACK) -->
        <footer style="text-align:center; padding:24px 0 12px 0; font-size:11px; color:#A1A1AA; border-top:1px solid var(--border); margin-top:32px;">
            <p style="margin-bottom:8px;">
                <a href="/" style="color:#C084FC; text-decoration:none;">หน้าแรก First Model Hub</a> | 
                <a href="${correctProvinceUrl}" style="color:#C084FC; text-decoration:none;">สาวรับงาน${escapeHTML(provinceName)} ทั้งหมด</a>
            </p>
            © ${new Date().getFullYear()} ${escapeHTML(CONFIG.BRAND_NAME)} - บริการด้วยความจริงใจ ไม่โอนมัดจำ
        </footer>
    </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        "X-Content-Type-Options": "nosniff"
      }
    });

  } catch (err) {
    console.error("Render bot crash:", err);
    return context.next();
  }
};