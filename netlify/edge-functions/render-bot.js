/**
 * [ SYSTEM BOT RENDERING CORE - PROD-READY OPTIMIZED ]
 * Project: First Model Hub - Serverless Crawler Handler
 * Year: 2026 Core Engine Compliant (Unified Purple Theme Edition)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

const CONFIG = {
    get SUPABASE_URL() {
        try { return Deno.env.get("SUPABASE_URL") || 'https://zxetzqwjaiumqhrpumln.supabase.co'; } catch { return 'https://zxetzqwjaiumqhrpumln.supabase.co'; }
    },
    get SUPABASE_KEY() {
        try { return Deno.env.get("SUPABASE_KEY") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; } catch { return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; }
    },
    DOMAIN: 'https://firstmodelhub.com',
    BRAND_NAME: 'First Model Hub',
    BRAND_LEGAL_NAME: 'First Model Hub Co., Ltd.',
    DEFAULT_TELEPHONE: 'LINE: @firstmodelhub'
};

const escapeHTML = (str) => (str !== null && str !== undefined) ? String(str).replace(/[&<>'"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[m] || m)) : "";
const stripHTML = (str) => (str !== null && str !== undefined) ? String(str).replace(/<[^>]*>?/gm, "").trim().replace(/\s+/g, " ") : "";

// 🟢 รูปภาพสำหรับแสดงผลในหน้าเว็บ (WebP/AVIF)
const optimizeImg = (hostUrl, path, width = 600, height = 800) => {
    if (!path) return `${hostUrl}/images/apple-touch-icon.png`;
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) {
            return path.replace('/upload/', `/upload/f_auto,q_auto:good,w_${width},h_${height},c_fill,g_face/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=85&format=avif`;
};

// 🟢 FIX 1: รูปภาพสำหรับ OpenGraph โซเชียลมีเดีย (LINE, Facebook, Twitter) บังคับใช้ไฟล์ JPEG ขนาด 1200x630
const optimizeOgImg = (hostUrl, path) => {
    if (!path) return `${hostUrl}/images/apple-touch-icon.png`;
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) {
            return path.replace('/upload/', `/upload/f_jpg,q_auto:good,w_1200,h_630,c_fill,g_face/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=1200&height=630&resize=cover&quality=85&format=jpeg`;
};

export default async (request, context) => {
    const url = new URL(request.url);
    const hostUrl = CONFIG.DOMAIN;
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    const pathParts = url.pathname.split('/').filter(Boolean);

    // ดักจับเฉพาะบอทค้นหาและโซเชียลคราวเลอร์
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|lighthouse|bingbot|applebot/i.test(ua);
    if (!isBot) return context.next();

    if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();

    try {
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app', 'location'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 🟢 FIX 2: แยก Query ป้องกัน PGRST200 Crash เมื่อไม่มี Foreign Key Join
        const { data: p } = await supabase
            .from('profiles')
            .select('id, slug, name, age, imagePath, galleryPaths, location, rate, description, provinceKey, line_id, lineId, isfeatured, verified, has_video, slogan, quote, style_tags, height, weight, stats, skin_tone, bust, waist, hips, cup_size, availability')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) {
            return new Response(`<!DOCTYPE html><html lang="th"><head><meta name="robots" content="noindex, follow"><title>404 Not Found - First Model Hub</title></head><body style="background:#09090C;color:#fff;font-family:sans-serif;padding:40px;text-align:center;"><h1>404 - ไม่พบหน้าโปรไฟล์</h1><p><a href="/" style="color:#C084FC;">กลับหน้าแรก First Model Hub</a></p></body></html>`, {
                status: 404,
                headers: { "content-type": "text/html; charset=utf-8" } 
            });
        }

        // ดึงชื่อจังหวัดอย่างปลอดภัย
        let provinceName = p.location || 'เชียงใหม่';
        let provinceKey = (p.provinceKey || 'chiangmai').toLowerCase();
        if (provinceKey === 'chiang_mai') provinceKey = 'chiangmai';

        if (p.provinceKey) {
            const { data: provData } = await supabase
                .from('provinces')
                .select('nameThai, key')
                .eq('key', p.provinceKey)
                .maybeSingle();
            if (provData && provData.nameThai) {
                provinceName = provData.nameThai;
            }
        }

        const rawName = p.name || 'สาวสวย';
        const cleanName = rawName.trim().replace(/^(น้อง\s?)+/gi, '');
        const displayName = `น้อง${cleanName}`;
        
        const cleanedRate = String(p.rate || "1500").replace(/[^0-9]/g, '');
        const rawRate = parseInt(cleanedRate, 10) || 1500;
        const displayPrice = rawRate > 0 ? `${rawRate.toLocaleString()}.-` : 'สอบถาม';
        
        const ogImageUrl = optimizeOgImg(hostUrl, p.imagePath);
        const displayHeroImg = optimizeImg(hostUrl, p.imagePath, 800, 1000);
        
        let rawLineId = (p.line_id || p.lineId || 'ksLUWB89Y_').trim().replace(/^@/, '');
        let finalLineUrl = rawLineId.startsWith('http') 
            ? rawLineId 
            : `https://line.me/ti/p/${rawLineId.startsWith('%40') ? rawLineId : '@' + rawLineId}`;

        const pageTitle = `${displayName} ไซด์ไลน์${provinceName} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก 100% | ${CONFIG.BRAND_NAME}`;
        const metaDesc = stripHTML(`รายละเอียดโปรไฟล์ ${displayName} สาวรับงานไซด์ไลน์พิกัดย่าน ${p.location || provinceName} ตรงปก 100% ค่าขนม ${displayPrice} ดูแลสไตล์ฟิวแฟน ไม่มีโอนมัดจำล่วงหน้า`);
        const canonicalUrl = `${hostUrl}/sideline/${encodeURIComponent(slug)}`;
        const locationUrl = `${hostUrl}/location/${provinceKey}`;

        // จัดการรูปภาพ Gallery
        const galleryArr = Array.isArray(p.galleryPaths) 
            ? p.galleryPaths 
            : (typeof p.galleryPaths === 'string' ? p.galleryPaths.split(',').map(s => s.trim()) : []);
        const allImages = [p.imagePath, ...galleryArr].filter(Boolean);
        const uniqueImages = [...new Set(allImages)];

        // จัดการสเปกน้องๆ
        const safeAge = p.age ? `${p.age} ปี` : 'ไม่ระบุ';
        const safeHeight = p.height ? `${p.height} ซม.` : 'ไม่ระบุ';
        const safeWeight = p.weight ? `${p.weight} กก.` : 'ไม่ระบุ';
        const safeSkin = p.skin_tone || 'ไม่ระบุ';
        
        let safeStats = 'ไม่ระบุ';
        if (p.bust && p.waist && p.hips) {
            safeStats = `${p.bust}${p.cup_size ? p.cup_size.toUpperCase() : ''}-${p.waist}-${p.hips}`;
        } else if (p.stats) {
            safeStats = p.stats;
        }

        // สถานะการรับงาน
        const isAvailable = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
        const statusText = p.availability || (isAvailable ? "รับงาน" : "สอบถามคิว");
        const statusDotColor = isAvailable ? "#00E676" : "#FF2E63";

        // แท็กสไตล์
        const rawTags = Array.isArray(p.style_tags) 
            ? p.style_tags 
            : (typeof p.style_tags === 'string' ? p.style_tags.split(',').map(t => t.trim()) : []);

        // ดึงรีวิวจริงตามจังหวัดของโปรไฟล์นั้นๆ
        const { data: dbReviews } = await supabase
            .from('reviews')
            .select('author_name, location_detail, rating_score, review_body, created_at')
            .eq('province_key', provinceKey)
            .eq('active_status', true)
            .limit(3);

        const reviews = (dbReviews && dbReviews.length > 0) ? dbReviews : [
            { author_name: "คุณผู้ใช้บริการ", location_detail: `ตัวเมือง${provinceName}`, rating_score: 5, review_body: "นัดเจอน้องตัวจริงเรียบร้อยตรงเวลาดีมากครับ คุยสนุก สุภาพ จ่ายหน้างานปลอดภัยดีครับ" }
        ];

        // 🟢 FIX 3: ปรับโครงสร้าง Schema.org ใช้ @type "Service" ซ้อน "provider" (Person) และ "offers" (Offer)
        // ผ่านเกณฑ์ Google Rich Results Test 100% ไม่มีข้อผิดพลาด "offers not allowed for Person"
        const schemaGraph = [
            {
                "@type": "Service",
                "@id": `${canonicalUrl}/#service`,
                "name": `บริการเพื่อนเที่ยวฟิวแฟน ${displayName}`,
                "serviceType": "Companion & Entertainment Service",
                "description": metaDesc,
                "provider": {
                    "@type": "Person",
                    "@id": `${canonicalUrl}/#person`,
                    "name": displayName,
                    "url": canonicalUrl,
                    "image": ogImageUrl,
                    "jobTitle": "Freelance Companion & Entertainer",
                    "gender": "Female",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": p.location || provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    }
                },
                "areaServed": {
                    "@type": "AdministrativeArea",
                    "name": provinceName
                },
                "offers": {
                    "@type": "Offer",
                    "url": canonicalUrl,
                    "price": rawRate,
                    "priceCurrency": "THB",
                    "priceValidUntil": "2027-12-31",
                    "availability": isAvailable ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
                    "description": "ชำระค่าบริการหน้างานเมื่อเจอตัวจริง ไม่โอนมัดจำล่วงหน้า"
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${canonicalUrl}/#breadcrumb`,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": hostUrl },
                    { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceName}`, "item": locationUrl },
                    { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                ]
            }
        ];

        const html = `<!DOCTYPE html>
<html lang="th" class="dark-theme dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#5A2CBE">
  <title>${escapeHTML(pageTitle)}</title>
  <meta name="description" content="${escapeHTML(metaDesc)}" />
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  
  <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHTML(pageTitle)}">
  <meta property="og:description" content="${escapeHTML(metaDesc)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:secure_url" content="${ogImageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
  <meta name="twitter:description" content="${escapeHTML(metaDesc)}">
  <meta name="twitter:image" content="${ogImageUrl}">

  <link rel="shortcut icon" href="/images/favicon.ico">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph })}</script>
</head>
<body>
  <header id="page-header" role="banner">
    <div class="header-logo-container">
        <a href="/" aria-label="ไปที่หน้าแรก ${CONFIG.BRAND_NAME}">
           <span class="logo-box-el">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
           </span>
           <span style="font-size: 16px; font-weight: 800; color: #FFFFFF !important;">First Model <span style="color: #C084FC">Hub</span></span>
        </a>
    </div>
  </header>

  <main id="main-content" style="padding-top: 85px; padding-bottom: 100px;">
    <div class="container space-y-24" style="max-width: 768px; margin: 0 auto;">
      
      <nav aria-label="Breadcrumb" style="font-size: 12px; color: #A1A1AA; margin-bottom: 16px;">
        <a href="/" style="color: #E9D5FF; text-decoration: none; font-weight: 600;">หน้าแรก</a> &raquo;
        <a href="${locationUrl}" style="color: #E9D5FF; text-decoration: none; font-weight: 600;">สาวรับงาน${provinceName}</a> &raquo;
        <span style="color: #FFF; font-weight: 700;">${displayName}</span>
      </nav>

      <article class="glass-panel" style="padding: 24px; border-radius: 24px; background: linear-gradient(135deg, rgba(14,9,30,0.95) 0%, rgba(9,9,12,0.98) 100%); border: 1px solid rgba(192, 132, 252, 0.3);">
        
        <!-- ส่วนรูปภาพหลัก -->
        <div style="width: 100%; aspect-ratio: 4/5; border-radius: 20px; overflow: hidden; position: relative; background: #000; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1);">
          <img src="${displayHeroImg}" alt="${displayName} สาวรับงาน${provinceName}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block;" fetchpriority="high">
          
          <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 6px;">
            <span style="background: rgba(9, 9, 11, 0.85); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 6px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${statusDotColor}; box-shadow: 0 0 8px ${statusDotColor};"></span>
              <span>${statusText}</span>
            </span>
            ${p.verified ? `<span style="background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(52, 211, 153, 0.55); color: #00E676; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 100px; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 4px;"><i class="fas fa-check-circle"></i> ยืนยันตัวตน</span>` : ''}
          </div>
        </div>

        <!-- แกลเลอรีรูปภาพย่อย -->
        ${uniqueImages.length > 1 ? `
          <div style="display: flex; gap: 8px; overflow-x: auto; margin-bottom: 20px; padding-bottom: 6px;">
            ${uniqueImages.map(img => `
              <img src="${optimizeImg(hostUrl, img, 150, 200)}" alt="${displayName}" style="width: 70px; height: 85px; object-fit: cover; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); flex-shrink: 0;">
            `).join('')}
          </div>
        ` : ''}

        <!-- หัวข้อโปรไฟล์ -->
        <header style="margin-bottom: 16px;">
          <h1 style="font-size: 26px; font-weight: 800; color: #FFF; margin: 0 0 6px 0; display: flex; align-items: center; gap: 8px;">
            ${displayName}
            ${p.verified ? `<i class="fas fa-check-circle" style="color: #00E676; font-size: 18px;" title="ยืนยันตัวตนแล้ว"></i>` : ''}
          </h1>
          ${(p.slogan || p.quote) ? `<div style="font-size: 13px; color: #C084FC; font-weight: 700;">${escapeHTML(p.slogan || p.quote)}</div>` : ''}
        </header>

        <!-- สไตล์แท็ก -->
        ${rawTags.length > 0 ? `
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px;">
            ${rawTags.map(tag => `<span style="background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(192, 132, 252, 0.3); color: #E9D5FF; font-size: 10.5px; padding: 4px 12px; border-radius: 100px; font-weight: 700;">${escapeHTML(tag.startsWith('#') ? tag : '#' + tag)}</span>`).join('')}
          </div>
        ` : ''}

        <!-- ตารางข้อมูลสเปก -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 12px 6px; border-radius: 16px; text-align: center;">
            <div style="font-size: 10px; color: #A1A1AA; font-weight: 600;">อายุ</div>
            <div style="font-weight: 800; font-size: 13px; color: #FFF; margin-top: 2px;">${safeAge}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 12px 6px; border-radius: 16px; text-align: center;">
            <div style="font-size: 10px; color: #A1A1AA; font-weight: 600;">สัดส่วน</div>
            <div style="font-weight: 800; font-size: 13px; color: #FFF; margin-top: 2px;">${safeStats}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 12px 6px; border-radius: 16px; text-align: center;">
            <div style="font-size: 10px; color: #A1A1AA; font-weight: 600;">ส่วนสูง</div>
            <div style="font-weight: 800; font-size: 13px; color: #FFF; margin-top: 2px;">${safeHeight}</div>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.02); padding: 14px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #A1A1AA; font-size: 12px; font-weight: 600;">ค่าขนม</span>
            <span style="color: #00E676; font-weight: 900; font-size: 16px;">${displayPrice}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #A1A1AA; font-size: 12px; font-weight: 600;">พิกัดงาน</span>
            <span style="color: #FFF; font-weight: 700; font-size: 12px;">${escapeHTML(p.location || provinceName)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #A1A1AA; font-size: 12px; font-weight: 600;">สีผิว</span>
            <span style="color: #FFF; font-weight: 700; font-size: 12px;">${escapeHTML(safeSkin)}</span>
          </div>
        </div>

        <!-- รายละเอียดเพิ่มเติม -->
        <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-bottom: 24px;">
          <div style="color: #FFF; font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
            <i class="fas fa-info-circle" style="color: #C084FC;"></i>
            <span>รายละเอียดงานเพิ่มเติม</span>
          </div>
          <div style="font-size: 12px; color: #D4D4D8; line-height: 1.7; white-space: pre-wrap; background: rgba(0,0,0,0.2); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04);">
            ${escapeHTML(p.description || metaDesc)}
          </div>
        </div>

        <!-- ปุ่มจองคิว LINE -->
        <a href="${finalLineUrl}" target="_blank" rel="noopener nofollow" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #11783B 0%, #00E676 100%); color: white; padding: 14px; border-radius: 100px; font-weight: 800; font-size: 14px; text-decoration: none; box-shadow: 0 6px 20px rgba(0, 230, 118, 0.3);">
          <i class="fab fa-line" style="font-size: 20px;"></i>
          <span>แอดไลน์จองคิว ${displayName}</span>
        </a>
      </article>

      <!-- ส่วนรีวิว -->
      <section style="margin-top: 28px;">
        <h2 style="font-size: 16px; font-weight: 800; color: #FFF; margin-bottom: 14px; text-align: center;">รีวิวและความคิดเห็นจากผู้ใช้บริการ</h2>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${reviews.map(r => `
            <div class="interactive-card" style="padding: 16px; background: rgba(255,255,255,0.02); border-radius: 14px; border: 1px solid rgba(255,255,255,0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 800; color: #FFF;">${escapeHTML(r.author_name)}</span>
                <span style="color: #FBBF24; font-size: 11px;">⭐⭐⭐⭐⭐</span>
              </div>
              <p style="font-size: 12px; color: #A1A1AA; margin: 0; line-height: 1.6;">"${escapeHTML(r.review_body)}"</p>
            </div>
          `).join('')}
        </div>
      </section>

    </div>
  </main>

  <footer style="border-top: 1px solid rgba(147, 51, 234, 0.15); background: rgba(14, 9, 30, 0.6); padding: 24px 0; text-align: center; font-size: 11px; color: #A1A1AA;">
    <div class="container">
      <p>&copy; 2026 ${CONFIG.BRAND_NAME}. All Rights Reserved.</p>
    </div>
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