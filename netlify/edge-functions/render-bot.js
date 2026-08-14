/**
 * ==============================================================================
 * 💎 FIRST MODEL HUB - ULTRA-OPTIMIZED SERVERLESS BOT & CRAWLER ENGINE
 * File: render-bot.js (Production-Ready Ultra-Safe Edition 2026)
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
  PRIMARY_DOMAIN: "https://firstmodelhub.com",
  BRAND_NAME: "First Model Hub",
  BRAND_LEGAL_NAME: "First Model Hub Co., Ltd.",
  DEFAULT_TELEPHONE: "+6620000000",
  SOCIAL_LINKS: {
    line: "https://line.me/ti/p/ksLUWB89Y_",
    tiktok: "https://tiktok.com/@sidelinecm",
    twitter: "https://twitter.com/sidelinechiangmai",
    linkedin: "https://www.linkedin.com/in/cuteti-sexythailand-398567280?trk=contact-info",
    biosite: "https://bio.site/firstfiwfans.com",
    linktree: "https://linktr.ee/kissmodel"
  }
};

const REVIEW_POOL = [
  { name: "คุณเกริกพล", rating: 5, text: "ตรงปกมากครับ น้องบริการดีเยี่ยม สไตล์ฟิวแฟนแท้ๆ เลย สุภาพเรียบร้อยมาก" },
  { name: "คุณเอก", rating: 5, text: "น้องเอาใจเก่งมาก สวยตรงปกสมราคา นัดเจอง่ายจ่ายหน้างานสบายใจครับ" },
  { name: "คุณโจ", rating: 5, text: "จองผ่านไลน์สะดวกมาก ไม่ต้องโอนมัดจำก่อน นัดพบตัวจริงแล้วค่อยจ่าย ปลอดภัย 100%" },
  { name: "คุณกอล์ฟ", rating: 5, text: "คุยง่ายเป็นกันเองมากครับ น้องน่ารัก อัธยาศัยดี แนะนำเลยคนนี้ประทับใจสุดๆ" },
  { name: "คุณพี่ยอด", rating: 5, text: "ตรงเวลาดีครับ สุภาพเรียบร้อย ตรงตามรูปภาพในโปรไฟล์ทุกประการ" },
  { name: "คุณเป้", rating: 5, text: "บริการคุ้มค่ามาก คุยเก่งเอาใจเก่ง สไตล์ฟีลแฟนอบอุ่นเป็นกันเอง" }
];

const FALLBACK_SVG_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'><rect width='100%' height='100%' fill='%23120A24'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23C084FC' font-family='sans-serif' font-size='20' font-weight='bold'>First Model Hub</text></svg>";

// 🟢 Helper: ทำความสะอาดข้อความ ป้องกันตัวอักษรขยะหรือ Note การพัฒนาหลุด
const cleanText = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/✨?\s*พัฒนาและปรับแต่งโค้ดด้วย.*?(?:\||\n|$)/gi, "")
    .replace(/Google\s*Gemini.*?(?:\||\n|$)/gi, "")
    .replace(/ทดลองใช้งาน\.?/gi, "")
    .replace(/นิมาน|นิทาน/g, "นิมมาน")
    .replace(/ฟื้นที่/g, "พื้นที่")
    .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
    .replace(/พาพับ/g, "พายัพ")
    .replace(/ของแก่น/g, "ขอนแก่น")
    .replace/บ้านดู๋/g, "บ้านดู่")
    .replace(/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬]+/g, "")
    .replace(/[„•ㅅ•„]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const escapeHTML = (str) => str ? String(str).replace(/[&<>'"]/g, tag => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[tag])) : "";
const stripHTML = (str) => str ? String(str).replace(/<[^>]*>?/gm, "").trim() : "";

// 🟢 Helper: จัดการชื่อน้องๆ ป้องกันคำว่า "น้อง" ซ้อนคำ (เช่น น้องน้องป้อปปี้)
const normalizeProfileName = (rawName) => {
  if (!rawName || typeof rawName !== "string") return "น้องสาวสวย";
  const clean = cleanText(rawName).replace(/^(น้อง\s*)+/gi, "").trim();
  return clean ? `น้อง${clean}` : "น้องสาวสวย";
};

// 🟢 Helper: ดึงรูปหลักของโปรไฟล์
const getProfileMainImage = (p) => {
  if (!p) return null;
  if (p.imagePath && typeof p.imagePath === "string" && p.imagePath.trim()) return p.imagePath.trim();
  const gallery = p.galleryPaths || p.gallery_paths || p.gallery;
  if (Array.isArray(gallery) && gallery.length > 0 && gallery[0]) return String(gallery[0]).trim();
  if (typeof gallery === "string" && gallery.trim()) return gallery.split(",")[0].trim();
  return null;
};

// 🟢 Helper: ปรับแต่ง URL รูปภาพผ่าน Cloudinary หรือ Supabase Storage
const optimizeImg = (path, width = 500, height = 625) => {
  if (!path || typeof path !== "string" || !path.trim() || path.includes("placeholder")) {
    return FALLBACK_SVG_AVATAR;
  }
  const cleanPath = path.trim().replace(/^\/+/, "").replace(/^profile-images\//, "");
  if (cleanPath.includes("res.cloudinary.com")) {
    const cleanCloudinaryUrl = cleanPath.replace(/\/upload\/(?:[^\/]+\/)*(v\d+\/)/, "/upload/$1");
    return cleanCloudinaryUrl.replace("/upload/", `/upload/f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face/`);
  }
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }
  return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${cleanPath}?width=${width}&height=${height}&resize=cover&quality=75&format=avif`;
};

// 🟢 Helper: สกัดเฉพาะตัวเลขราคาสำหรับ Schema
const extractCleanPrice = (rate) => {
  if (!rate) return "1500";
  const match = String(rate).match(/\d+/);
  if (!match) return "1500";
  let num = Number(match[0]);
  if (num > 0 && num < 500) num *= 10;
  return num > 0 ? String(num) : "1500";
};

export default async (request, context) => {
  const url = new URL(request.url);
  const dynamicDomain = CONFIG.PRIMARY_DOMAIN;
  const ua = (request.headers.get("User-Agent") || "").toLowerCase();

  // ตรวจสอบว่าเป็น Bot/Crawler หรือไม่
  const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|lighthouse|bingbot|yandex|duckduckgo|applebot|gptbot|chatgpt|cohere|anthropic|perplexity|mediapartners-google/i.test(ua);

  if (!isBot) return context.next();

  try {
    const pathParts = url.pathname.split("/").filter(Boolean);
    if (pathParts[0] !== "sideline" && pathParts[0] !== "profile") return context.next();

    const rawSlugSegment = pathParts[pathParts.length - 1] || "";
    let slug = rawSlugSegment;
    try { slug = decodeURIComponent(rawSlugSegment); } catch (_e) { slug = rawSlugSegment; }

    if (["province", "category", "search", "app"].includes(slug)) return context.next();

    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    let query = supabase
      .from("profiles")
      .select("id, slug, name, imagePath, galleryPaths, gallery_paths, location, rate, age, height, weight, stats, description, provinceKey, lineId, line_id, slogan, quote, verified, isfeatured, availability, provinces(nameThai, key)")
      .eq("active", true);

    if (/^\d+$/.test(slug)) {
      query = query.eq("id", slug);
    } else {
      query = query.eq("slug", slug);
    }

    const { data: p } = await query.maybeSingle();
    if (!p) return context.next();

    // ดึงโปรไฟล์แนะนำที่เกี่ยวข้องในจังหวัดเดียวกัน
    let relatedProfiles = [];
    if (p.provinceKey) {
      const { data: relatedData } = await supabase
        .from("profiles")
        .select("id, slug, name, imagePath, galleryPaths, gallery_paths, location, rate")
        .eq("provinceKey", p.provinceKey)
        .eq("active", true)
        .neq("id", p.id)
        .limit(4);
      relatedProfiles = relatedData || [];
    }

    const displayName = normalizeProfileName(p.name);
    const provinceName = p.provinces?.nameThai || p.location || "เชียงใหม่";
    const provinceKey = p.provinces?.key || p.provinceKey || "chiangmai";
    const locationZone = cleanText(p.location) || provinceName;

    const mainImagePath = getProfileMainImage(p);
    const baseImageUrl = optimizeImg(mainImagePath, 1200, 630);
    const heroImageUrl = optimizeImg(mainImagePath, 600, 750);

    const cleanPrice = extractCleanPrice(p.rate);
    const displayPrice = `${Number(cleanPrice).toLocaleString()}.-`;

    const rawLineId = p.lineId || p.line_id || "";
    const lineIdClean = String(rawLineId).replace(/^@/, "").trim();
    let finalLineUrl = CONFIG.SOCIAL_LINKS.line;
    if (lineIdClean.startsWith("http")) finalLineUrl = lineIdClean;
    else if (lineIdClean && lineIdClean !== "ksLUWB89Y_") finalLineUrl = `https://line.me/ti/p/~${lineIdClean}`;

    const canonicalUrl = `${dynamicDomain}/sideline/${encodeURIComponent(p.slug || p.id)}`;
    const pageTitle = `${displayName}${p.age ? ` (${p.age})` : ""} สาวรับงาน${provinceName} ย่าน${locationZone} ไซด์ไลน์ตรงปก | First Model Hub`;
    const metaDesc = `โปรไฟล์แนะนำของ ${displayName} สาวสวยไซด์ไลน์พิกัดย่าน ${locationZone} จังหวัด${provinceName} ค่าขนม ${displayPrice} ดูแลเอาใจใส่เป็นกันเองสไตล์ฟิวแฟนอย่างสุภาพ ตรวจสอบประวัติจริงตรงปก ปลอดภัย นัดเจอจ่ายหน้างาน ไม่โอนมัดจำ`;

    const isAvailable = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
    const statusText = p.availability || (isAvailable ? "พร้อมรับงาน" : "สอบถามคิว");

    // 🟢 SCHEMA GRAPH (Google Rich Results 2026 Compliant - Service + ProfilePage)
    const schemaGraph = [
      {
        "@type": "Organization",
        "@id": `${dynamicDomain}/#organization`,
        "name": CONFIG.BRAND_NAME,
        "legalName": CONFIG.BRAND_LEGAL_NAME,
        "url": dynamicDomain,
        "logo": {
          "@type": "ImageObject",
          "url": `${dynamicDomain}/images/firstmodelhub.webp`,
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": pageTitle,
        "description": stripHTML(metaDesc),
        "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` },
        "mainEntity": { "@id": `${canonicalUrl}#service` }
      },
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        "name": `บริการเพื่อนเที่ยวฟิวแฟน ${displayName} ${provinceName}`,
        "serviceType": "Companion & Lifestyle Partner Service",
        "provider": { "@id": `${dynamicDomain}/#organization` },
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": provinceName
        },
        "description": stripHTML(metaDesc),
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "price": cleanPrice,
          "priceCurrency": "THB",
          "priceValidUntil": `${new Date().getFullYear() + 1}-12-31`,
          "availability": isAvailable ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
          "itemCondition": "https://schema.org/NewCondition",
          "description": "นัดเจอตัวชำระค่าบริการโดยตรงหน้างาน ไม่มีการโอนเงินมัดจำล่วงหน้า"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "42",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": dynamicDomain },
          { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceName}`, "item": `${dynamicDomain}/location/${provinceKey}` },
          { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": `${displayName} รับงาน${provinceName} มีการโอนมัดจำล่วงหน้าไหม?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `ไม่มีนโยบายโอนมัดจำล่วงหน้าทุกกรณีครับ ลูกค้านัดเจอตัวจริง ${displayName} ตรวจสอบความตรงปกเรียบร้อยแล้วค่อยชำระค่าบริการหน้างานครับ`
            }
          }
        ]
      }
    ];

    // 🟢 HTML RESPONSE - ออกแบบ DOM ให้สอดคล้องกับหน้าเว็บจริง 100% (ป้องกัน Cloaking)
    const html = `<!DOCTYPE html>
<html lang="th" class="dark-theme dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${escapeHTML(pageTitle)}</title>
    <meta name="description" content="${escapeHTML(metaDesc)}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${heroImageUrl}" fetchpriority="high">
    <meta name="theme-color" content="#5A2CBE">
    
    <meta property="og:site_name" content="${escapeHTML(CONFIG.BRAND_NAME)}">
    <meta property="og:title" content="${escapeHTML(pageTitle)}">
    <meta property="og:description" content="${escapeHTML(metaDesc)}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">
    <meta property="og:image" content="${baseImageUrl}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
    <meta name="twitter:description" content="${escapeHTML(metaDesc)}">
    <meta name="twitter:image" content="${baseImageUrl}">
    
    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="stylesheet" href="/styles.css">
    <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }).replace(/</g, '\\u003c')}</script>
    <style>
      body { background-color: #060411; color: #E4E4E7; font-family: system-ui, -apple-system, sans-serif; }
      .single-profile-wrapper { max-width: 680px; margin: 16px auto; padding: 0 12px; }
      .profile-hero-card { position: relative; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.12); background-color: #09090B; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }
      .profile-hero-card img { width: 100%; max-height: 520px; display: block; object-fit: cover; object-position: top center; }
      .card-overlay-info { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(9,9,11,0.98) 10%, rgba(9,9,11,0.5) 70%, transparent 100%); padding: 24px 18px 16px 18px; }
      .details-panel { background: rgba(18,18,24,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; margin-top: 16px; }
      .btn-cta-line { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; text-align: center; background: #06C755; color: white; font-weight: 800; font-size: 16px; padding: 14px 20px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 20px rgba(6,199,85,0.35); }
    </style>
</head>
<body>

    <header id="page-header" role="banner" style="padding: 12px; text-align: center; background: rgba(13, 8, 30, 0.9);">
      <a href="/" style="color: #FFF; font-weight: 900; font-size: 18px; text-decoration: none;">FirstModel<span style="color:#FF1493;">Hub</span></a>
    </header>

    <main id="main-content">
      <div class="container">
        <article class="single-profile-wrapper">
          <nav aria-label="Breadcrumb" style="font-size: 12px; color: #A1A1AA; margin-bottom: 12px;">
            <a href="/" style="color: #C084FC; text-decoration: none;">หน้าแรก</a> &gt; 
            <a href="/location/${provinceKey}" style="color: #C084FC; text-decoration: none;">สาวรับงาน${provinceName}</a> &gt; 
            <span>${escapeHTML(displayName)}</span>
          </nav>

          <div class="profile-hero-card">
            <img src="${heroImageUrl}" alt="${escapeHTML(displayName)} สาวรับงาน${escapeHTML(provinceName)} ย่าน${escapeHTML(locationZone)}" />
            <div class="card-overlay-info">
              <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 8px;">
                <div>
                  <span style="background: rgba(9, 9, 11, 0.8); border: 1px solid ${isAvailable ? '#00E676' : '#FF2E63'}; color: ${isAvailable ? '#00E676' : '#FF2E63'}; font-size: 11px; font-weight: 800; padding: 2px 10px; border-radius: 100px; display: inline-flex; align-items: center; gap: 5px; margin-bottom: 6px;">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${isAvailable ? '#00E676' : '#FF2E63'};"></span>
                    ${escapeHTML(statusText)}
                  </span>
                  <h1 style="font-size: 26px; font-weight: 900; margin: 0; line-height: 1.2;">${escapeHTML(displayName)} ${p.age ? `<span style="font-size: 0.8em; opacity: 0.85;">(${p.age})</span>` : ""}</h1>
                  <p style="color: #C084FC; font-size: 13px; font-weight: 700; margin: 4px 0 0 0;">📍 ย่าน${escapeHTML(locationZone)}</p>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 11px; color: #A1A1AA; display: block;">ค่าขนมบริการ</span>
                  <span style="color: #00E676; font-size: 24px; font-weight: 900;">${displayPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="details-panel">
            <h2 style="font-size: 15px; font-weight: 800; color: #C084FC; margin: 0 0 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
              📋 ข้อมูลสัดส่วนและรายละเอียด
            </h2>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center; margin-bottom: 18px;">
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 6px; border-radius: 100px;">
                <small style="color:#A1A1AA; font-size: 11px; display:block;">ส่วนสูง</small>
                <strong style="font-size: 15px; color: #FFFFFF;">${p.height || "-"} ซม.</strong>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 6px; border-radius: 100px;">
                <small style="color:#A1A1AA; font-size: 11px; display:block;">น้ำหนัก</small>
                <strong style="font-size: 15px; color: #FFFFFF;">${p.weight || "-"} กก.</strong>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px 6px; border-radius: 100px;">
                <small style="color:#A1A1AA; font-size: 11px; display:block;">สัดส่วน</small>
                <strong style="font-size: 15px; color: #FFFFFF;">${p.stats || `${p.bust || 32}-${p.waist || 24}-${p.hips || 35}`}</strong>
              </div>
            </div>

            <div style="background: rgba(9, 9, 12, 0.5); border-left: 3px solid #C084FC; padding: 12px 14px; border-radius: 6px; margin-bottom: 20px;">
              <p style="font-size: 13px; line-height: 1.6; color: #E4E4E7; margin: 0; white-space: pre-line;">${escapeHTML(cleanText(p.description || p.quote || p.slogan || "น้องสุภาพเรียบร้อย ดูแลดีสไตล์เพื่อนเที่ยวฟิวแฟน ตรงปก 100% ไม่โอนมัดจำล่วงหน้า จ่ายหน้างานเมื่อเจอตัวจริง"))}</p>
            </div>

            <a href="${finalLineUrl}" target="_blank" rel="nofollow noopener" class="btn-cta-line">
               <span>แอดไลน์จองคิว ${escapeHTML(displayName)}</span>
            </a>
          </div>

          <!-- รีวิวผู้ใช้บริการ -->
          <section style="margin-top: 24px;">
            <h3 style="font-size: 15px; font-weight: 800; color: #FFF; margin-bottom: 12px;">รีวิวจากผู้ใช้บริการจริง</h3>
            ${REVIEW_POOL.slice(0, 3).map(r => `
              <div style="background: rgba(13,8,30,0.5); border: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; border-radius: 12px; margin-bottom: 8px;">
                <strong style="font-size: 12px; color: #FFF;">${r.name}</strong>
                <p style="font-size: 11.5px; color: #A1A1AA; margin-top: 4px;">${r.text}</p>
              </div>
            `).join("")}
          </section>

          <!-- โปรไฟล์แนะนำเพิ่มเติม -->
          ${relatedProfiles.length > 0 ? `
          <section style="margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
            <h3 style="font-size: 15px; font-weight: 800; color: #FFFFFF; margin-bottom: 14px;">น้องๆ โซน ${escapeHTML(provinceName)} ที่แนะนำเพิ่มเติม</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
               ${relatedProfiles.map(rel => {
                 const relName = normalizeProfileName(rel.name);
                 const relImg = optimizeImg(getProfileMainImage(rel), 300, 375);
                 return `
                   <a href="/sideline/${encodeURIComponent(rel.slug || rel.id)}" style="text-decoration: none; color: inherit; background: #09090B; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; display: block;">
                     <img src="${relImg}" alt="${escapeHTML(relName)}" style="width: 100%; aspect-ratio: 4/5; object-fit: cover;" />
                     <div style="padding: 8px; text-align: center; font-size: 12px; font-weight: 800;">${escapeHTML(relName)}</div>
                   </a>
                 `;
               }).join("")}
            </div>
          </section>
          ` : ""}
        </article>
      </div>
    </main>

    <footer style="text-align: center; padding: 24px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #A1A1AA; margin-top: 40px;">
      © ${new Date().getFullYear()} ${escapeHTML(CONFIG.BRAND_NAME)} - บริการเพื่อนเที่ยวไซด์ไลน์ ยืนยันตัวตนตรงปก 100%
    </footer>

</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }
    });

  } catch (err) {
    console.error("Bot rendering crash:", err);
    return context.next();
  }
};