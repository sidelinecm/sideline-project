/**
 * [ SYSTEM BOT RENDERING CORE - PROD-READY OPTIMIZED ]
 * Project: First Model Hub - Serverless Crawler Handler
 * Year: 2026 Core Engine Compliant (Unified Theme Edition)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

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

const optimizeImg = (path, width = 600, height = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/apple-touch-icon.png`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`);
    }
    return path.startsWith('http') 
        ? path 
        : `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover`;
};

const escapeHTML = (str) => str ? String(str).replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])) : '';
const stripHTML = (str) => str ? String(str).replace(/<[^>]*>?/gm, '').trim() : '';

export default async (request, context) => {
    const url = new URL(request.url);
    const dynamicDomain = url.host.includes('localhost') ? `${url.protocol}//${url.host}` : `https://${url.host}`;
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|lighthouse|bingbot|applebot/i.test(ua);
    if (!isBot) return context.next();

    try {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate, age, description, provinceKey, line_id, lineId, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) {
            return new Response(`<!DOCTYPE html><html lang="th"><head><meta name="robots" content="noindex, follow"><title>404 - ไม่พบหน้าเว็บ</title></head><body><h1>404 Not Found</h1></body></html>`, {
                status: 404,
                headers: { "content-type": "text/html; charset=utf-8" } 
            });
        }

        const rawName = p.name || 'สาวสวย';
        const cleanName = rawName.trim().replace(/^(น้อง\s?)+/gi, '');
        const displayName = `น้อง${cleanName}`;
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        
        const cleanedRate = String(p.rate || "1500").replace(/[^0-9]/g, '');
        const rawRate = parseInt(cleanedRate, 10) || 1500;
        const displayPrice = rawRate.toLocaleString() + ".-";
        const baseImageUrl = optimizeImg(p.imagePath, 600, 800);
        
        // 🟢 แก้ไขลิงก์ LINE ให้รองรับ LINE OA และ ID ทั่วไปอย่างถูกต้อง
        let rawLineId = (p.line_id || p.lineId || 'ksLUWB89Y_').trim().replace(/^@/, '');
        let finalLineUrl = rawLineId.startsWith('http') 
            ? rawLineId 
            : `https://line.me/ti/p/${rawLineId.startsWith('%40') ? rawLineId : '@' + rawLineId}`;

        const pageTitle = `${displayName} ไซด์ไลน์${provinceName} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก 100% | First Model Hub`;
        const metaDesc = `โปรไฟล์แนะนำของ ${displayName} สาวสวยไซด์ไลน์พิกัดบริการบริเวณ ${p.location || provinceName} ดูแลเอาใจใส่สไตล์ฟิวแฟนอย่างสุภาพ ตรวจสอบประวัติจริงตรงปก ปลอดภัยสูงสุด ชำระเงินหน้างาน ไม่โอนมัดจำ`;
        const canonicalUrl = `${dynamicDomain}/sideline/${encodeURIComponent(slug)}`;

        // 🟢 ปรับเปลี่ยนโทนสีเป็นสีม่วงนีออน (#7C3AED / #C084FC) ให้ตรงกับธีมหลักของเว็บไซต์
        const html = `<!DOCTYPE html>
<html lang="th" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#5A2CBE">
    <link rel="stylesheet" href="/styles.css">
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${baseImageUrl}">
</head>
<body style="background-color: #09090C; color: #F1F5F9; font-family: 'Prompt', sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 16px;">
        <header style="padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <a href="/" style="font-size: 18px; font-weight: 800; color: #FFF; text-decoration: none;">First Model <span style="color: #C084FC;">Hub</span></a>
        </header>
        <main style="margin-top: 20px;">
            <article>
                <img src="${baseImageUrl}" alt="${displayName} สาวรับงาน${provinceName}" style="width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                <h1 style="font-size: 22px; font-weight: 800; color: #FFF; margin-top: 16px;">${displayName} - ไซด์ไลน์${provinceName}</h1>
                <p style="color: #C084FC; font-weight: 700; margin-top: 4px;">พิกัด: ${escapeHTML(p.location || provinceName)} | ค่าขนม: ${displayPrice}</p>
                <div style="margin-top: 16px; background: rgba(13,8,30,0.6); padding: 16px; border-radius: 12px; border: 1px solid rgba(147,51,234,0.2); font-size: 13px; line-height: 1.6;">
                    ${escapeHTML(p.description || metaDesc)}
                </div>
                <div style="margin-top: 20px;">
                    <a href="${finalLineUrl}" target="_blank" rel="noopener nofollow" style="display: block; width: 100%; text-align: center; background: linear-gradient(135deg, #11783B 0%, #00E676 100%); color: white; padding: 14px; border-radius: 100px; font-weight: 800; text-decoration: none; box-shadow: 0 4px 15px rgba(0, 230, 118, 0.3);">
                        แอดไลน์จองคิว ${displayName}
                    </a>
                </div>
            </article>
        </main>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600"
            }
        });

    } catch (err) {
        console.error("Bot rendering crash:", err);
        return context.next();
    }
};