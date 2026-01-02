import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- 1. CONFIGURATION (มัดรวมค่าจาก Env และค่าสำรองไว้ที่เดียว) ---
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const STORAGE_BUCKET = 'profile-images';
const SITE_DOMAIN = 'https://sidelinechiangmai.netlify.app';

// --- 2. PROFESSIONAL BOT DETECTOR (ระบบตรวจจับบอทขั้นสูง 3 ชั้น) ---
class BotDetector {
    static patterns = [
        'googlebot', 'bingbot', 'yandex', 'duckduckbot', 'slurp', 'baiduspider',
        'facebookexternalhit', 'twitterbot', 'discordbot', 'whatsapp', 'linkedinbot',
        'embedly', 'quora link preview', 'outbrain', 'pinterest', 'skypeuripreview',
        'telegrambot', 'discord', 'slackbot', 'line-poker', 'iframely', 'applebot',
        'petalbot', 'ahrefsbot', 'semrushbot', 'moz.com', 'seokicks', 'seoscanners', 'line'
    ];
    
    static regex = new RegExp(this.patterns.join('|'), 'i');
    
    static isBot(request) {
        try {
            const userAgent = request.headers.get('User-Agent') || '';
            const accept = request.headers.get('Accept') || '';
            // เช็ค User Agent, Headers พิเศษ และ Accept Header
            if (this.regex.test(userAgent)) return true;
            const botHeaders = ['facebookexternalhit/', 'Twitterbot/', 'LinkedInBot/', 'WhatsApp/'];
            if (botHeaders.some(h => userAgent.includes(h))) return true;
            if (accept.includes('text/html') && !accept.includes('application/json') && userAgent === '') return true;
            return false;
        } catch { return false; }
    }
}

// --- 3. HELPER FUNCTIONS (สุ่มรีวิวให้คงที่ เพื่อความน่าเชื่อถือใน Google) ---
function getStableRandom(seedString) {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

// --- 4. MAIN HANDLER ---
export default async (request, context) => {
    // 1. กรองบอท: ถ้าไม่ใช่บอท ให้ข้ามไปใช้หน้าเว็บปกติทันที
    if (!BotDetector.isBot(request)) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(p => p);
        
        // ตรวจสอบ URL /sideline/slug
        if (pathParts.length < 2 || pathParts[0] !== 'sideline') return context.next();

        const slug = decodeURIComponent(pathParts[1]);
        const now = new Date();
        const thaiDate = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

        // 2. ดึงข้อมูลจากฐานข้อมูล
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai)')
            .eq('slug', slug)
            .maybeSingle();

        if (error || !profile) return context.next();

        // 3. จัดการข้อมูลสำหรับแสดงผล
        const pName = (profile.name || 'สาวสวย').trim();
        const pProv = profile.provinces?.nameThai || 'เชียงใหม่';
        const pLoc = (profile.location || pProv).trim();
        const displayPrice = profile.rate ? parseInt(profile.rate.toString().replace(/\D/g,'')).toLocaleString('th-TH') : '1,500';

        // SEO Logic: สร้างคะแนนรีวิวแบบสุ่มแต่คงที่ตาม Slug
        const seed = getStableRandom(slug);
        const reviewCount = (seed % 205) + 45;
        const ratingValue = ((seed % 4) / 10 + 4.6).toFixed(1);

        const title = `น้อง${pName} ไซด์ไลน์${pProv} (${pLoc}) งานดีตรงปก เริ่ม ${displayPrice} | Sideline Chiangmai`;
        const description = `อัปเดตล่าสุด ${thaiDate}: ไซด์ไลน์${pProv} น้อง${pName} โซน${pLoc} งานดีไม่เร่ง ฟีลแฟน ปลอดภัย จ่ายหน้างาน 100% รีวิวแน่น ${reviewCount} คน ⭐ ${ratingValue}`;

        // จัดการรูปภาพ (ล้าง Path ป้องกัน Error)
        const imageUrl = profile.imagePath?.startsWith('http') 
            ? profile.imagePath 
            : `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profile.imagePath?.replace(/\.\.\//g, '')}`;

        const pageUrl = `${SITE_DOMAIN}/sideline/${encodeURIComponent(slug)}`;

        // 4. สร้าง HTML (โครงสร้างเน้น SEO และ Mobile Friendly)
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:type" content="profile">
    <link rel="canonical" href="${pageUrl}">
    <style>
        body { font-family: 'Prompt', sans-serif; margin: 0; background: #fdf2f8; color: #1f2937; line-height: 1.6; }
        .container { max-width: 480px; margin: 0 auto; background: #fff; min-height: 100vh; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
        .hero-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
        .content { padding: 24px; }
        .rating { color: #b45309; font-weight: bold; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; }
        .update-date { font-size: 12px; color: #9ca3af; margin-bottom: 12px; }
        h1 { color: #ec4899; font-size: 24px; margin: 0 0 16px 0; line-height: 1.3; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .meta-item { background: #f9fafb; padding: 12px; border-radius: 12px; border: 1px solid #f3f4f6; }
        .meta-label { display: block; font-size: 11px; color: #6b7280; text-transform: uppercase; }
        .meta-val { display: block; font-weight: bold; color: #111827; }
        .desc { font-size: 15px; color: #4b5563; margin-bottom: 24px; white-space: pre-wrap; }
        .cta-btn { display: block; background: #06c755; color: #fff; text-align: center; padding: 16px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(6,199,85,0.3); }
        .back-home { display: block; text-align: center; margin-top: 30px; color: #ec4899; text-decoration: none; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" alt="${pName} ไซด์ไลน์${pProv}" class="hero-img">
        <div class="content">
            <div class="rating">⭐ ${ratingValue} (${reviewCount} รีวิวจากลูกค้าจริง)</div>
            <div class="update-date">อัปเดตล่าสุด: ${thaiDate}</div>
            <h1>${title}</h1>
            <div class="meta-grid">
                <div class="meta-item"><span class="meta-label">ราคาเริ่มต้น</span><span class="meta-val">${displayPrice} บาท</span></div>
                <div class="meta-item"><span class="meta-label">พื้นที่</span><span class="meta-val">${pLoc}</span></div>
                <div class="meta-item"><span class="meta-label">สัดส่วน</span><span class="meta-val">${profile.stats || '-'}</span></div>
                <div class="meta-item"><span class="meta-label">อายุ</span><span class="meta-val">${profile.age || '20+'} ปี</span></div>
            </div>
            <div class="desc">${profile.description || 'สนใจสอบถามข้อมูลเพิ่มเติม แอดไลน์คุยกับน้องได้โดยตรงเลยค่ะ'}</div>
            <a href="https://line.me/ti/p/${profile.lineId || ''}" class="cta-btn">📲 แอดไลน์จองคิว</a>
            <a href="/" class="back-home">🏠 กลับหน้าหลัก</a>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Netlify-CDN-Cache-Control": "public, s-maxage=1800",
                "X-Content-Type-Options": "nosniff"
            }
        });

    } catch (err) {
        console.error("SSR Error:", err);
        return new Response("System updating...", { status: 500 });
    }
};