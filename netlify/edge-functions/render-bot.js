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
    DEFAULT_TELEPHONE: 'LINE: @firstmodelhub'
};

const escapeHTML = (str) => (str !== null && str !== undefined) ? String(str).replace(/[&<>'"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[m] || m)) : "";
const stripHTML = (str) => (str !== null && str !== undefined) ? String(str).replace(/<[^>]*>?/gm, "").trim() : "";

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

export default async (request, context) => {
    const url = new URL(request.url);
    const hostUrl = CONFIG.DOMAIN;
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // 🟢 ประกาศ pathParts ป้องกัน ReferenceError
    const pathParts = url.pathname.split('/').filter(Boolean);

    // ดักจับเฉพาะบอทค้นหาและโซเชียลคราวเลอร์
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|lighthouse|bingbot|applebot/i.test(ua);
    if (!isBot) return context.next();

    if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();

    try {
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app', 'location'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p } = await supabase
            .from('profiles')
            .select('id, slug, name, age, imagePath, galleryPaths, location, rate, description, provinceKey, line_id, lineId, isfeatured, verified, has_video, slogan, quote, style_tags, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) {
            return new Response(`<!DOCTYPE html><html lang="th"><head><meta name="robots" content="noindex, follow"><title>404 Not Found</title></head><body style="background:#09090C;color:#fff;font-family:sans-serif;padding:40px;text-align:center;"><h1>404 - ไม่พบหน้าโปรไฟล์</h1><p><a href="/" style="color:#C084FC;">กลับหน้าแรก First Model Hub</a></p></body></html>`, {
                status: 404,
                headers: { "content-type": "text/html; charset=utf-8" } 
            });
        }

        const rawName = p.name || 'สาวสวย';
        const cleanName = rawName.trim().replace(/^(น้อง\s?)+/gi, '');
        const displayName = `น้อง${cleanName}`;
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinceKey || p.provinces?.key || 'chiangmai';
        
        const cleanedRate = String(p.rate || "1500").replace(/[^0-9]/g, '');
        const rawRate = parseInt(cleanedRate, 10) || 1500;
        const displayPrice = rawRate > 0 ? `${rawRate.toLocaleString()}.-` : 'สอบถาม';
        const baseImageUrl = optimizeImg(hostUrl, p.imagePath, 1200, 630);
        
        let rawLineId = (p.line_id || p.lineId || 'ksLUWB89Y_').trim().replace(/^@/, '');
        let finalLineUrl = rawLineId.startsWith('http') 
            ? rawLineId 
            : `https://line.me/ti/p/${rawLineId.startsWith('%40') ? rawLineId : '@' + rawLineId}`;

        const pageTitle = `${displayName} ไซด์ไลน์${provinceName} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก 100% | ${CONFIG.BRAND_NAME}`;
        const metaDesc = `รายละเอียดโปรไฟล์ ${displayName} สาวรับงานไซด์ไลน์พิกัดย่าน ${p.location || provinceName} ตรงปก 100% ค่าขนม ${displayPrice} ดูแลสไตล์ฟิวแฟน ไม่มีโอนมัดจำล่วงหน้า`;
        const canonicalUrl = `${hostUrl}/sideline/${encodeURIComponent(slug)}`;
        const locationUrl = `${hostUrl}/location/${provinceKey}`;

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

        const schemaGraph = [
            {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": `${canonicalUrl}/#person`,
                "name": displayName,
                "url": canonicalUrl,
                "image": baseImageUrl,
                "description": metaDesc,
                "jobTitle": "Freelance Companion & Entertainer",
                "gender": "Female",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": p.location || provinceName,
                    "addressRegion": provinceName,
                    "addressCountry": "TH"
                },
                "offers": {
                    "@type": "Offer",
                    "url": canonicalUrl,
                    "price": rawRate,
                    "priceCurrency": "THB",
                    "priceValidUntil": "2027-12-31",
                    "availability": "https://schema.org/InStock",
                    "description": "ชำระค่าบริการหน้างานเมื่อเจอตัวจริง ไม่โอนมัดจำล่วงหน้า"
                }
            },
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
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
  <meta property="og:image" content="${baseImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
  <meta name="twitter:description" content="${escapeHTML(metaDesc)}">
  <meta name="twitter:image" content="${baseImageUrl}">

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
    <div class="container space-y-24" style="max-width: 600px; margin: 0 auto;">
      
      <nav aria-label="Breadcrumb" style="font-size: 12px; color: #A1A1AA; margin-bottom: 12px;">
        <a href="/" style="color: #E9D5FF; text-decoration: none;">หน้าแรก</a> &raquo;
        <a href="${locationUrl}" style="color: #E9D5FF; text-decoration: none;">สาวรับงาน${provinceName}</a> &raquo;
        <span style="color: #FFF;">${displayName}</span>
      </nav>

      <article class="glass-panel" style="padding: 20px; border-radius: 20px; background: rgba(13,8,30,0.6);">
        <div style="width: 100%; aspect-ratio: 4/5; border-radius: 16px; overflow: hidden; position: relative; background: #000; margin-bottom: 16px;">
          <img src="${baseImageUrl}" alt="${displayName} สาวรับงาน${provinceName}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block;" fetchpriority="high">
        </div>

        <h1 style="font-size: 24px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${displayName}</h1>
        <p style="font-size: 13px; color: #C084FC; font-weight: 700; margin-bottom: 16px;">
          <i class="fas fa-map-marker-alt" style="margin-right: 4px;"></i> พิกัด: ${escapeHTML(p.location || provinceName)} | ค่าขนม: <span style="color: #00E676; font-size: 16px;">${displayPrice}</span>
        </p>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px; font-size: 12.5px; color: #E4E4E7; line-height: 1.6; margin-bottom: 20px; white-space: pre-wrap;">
          ${escapeHTML(p.description || metaDesc)}
        </div>

        <a href="${finalLineUrl}" target="_blank" rel="noopener nofollow" class="btn-primary-webyst" style="width: 100%; max-width: 100%; text-decoration: none; display: flex; justify-content: center; align-items: center; padding: 14px; border-radius: 100px; background: #00E676; color: #000; font-weight: 800;">
          <i class="fab fa-line" style="font-size: 20px; margin-right: 8px;"></i> แอดไลน์จองคิว ${displayName}
        </a>
      </article>

      <section style="margin-top: 24px;">
        <h2 style="font-size: 16px; font-weight: 800; color: #FFF; margin-bottom: 12px; text-align: center;">รีวิวจากผู้ใช้บริการ</h2>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${reviews.map(r => `
            <div class="interactive-card" style="padding: 14px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 12px; font-weight: 800; color: #FFF;">${escapeHTML(r.author_name)}</span>
                <span style="color: #FBBF24; font-size: 10px;">⭐⭐⭐⭐⭐</span>
              </div>
              <p style="font-size: 11.5px; color: #A1A1AA; margin: 0; line-height: 1.5;">"${escapeHTML(r.review_body)}"</p>
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