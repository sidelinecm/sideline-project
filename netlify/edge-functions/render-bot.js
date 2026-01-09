import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- 1. CONFIGURATION ---
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const STORAGE_BUCKET = 'profile-images';
const SITE_DOMAIN = 'https://sidelinechiangmai.netlify.app';

// --- 2. BOT DETECTOR ---
class BotDetector {
    static patterns = [
        'googlebot', 'bingbot', 'yandex', 'duckduckbot', 'slurp', 'baiduspider',
        'facebookexternalhit', 'twitterbot', 'discordbot', 'whatsapp', 'linkedinbot',
        'telegrambot', 'line', 'lighthouse', 'google-inspectiontool', 'gptbot'
    ];
    static regex = new RegExp(this.patterns.join('|'), 'i');
    static isBot(request) {
        const userAgent = request.headers.get('User-Agent') || '';
        return this.regex.test(userAgent.toLowerCase());
    }
}

function getStableRandom(seedString) {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

// --- 3. MAIN HANDLER ---
export default async (request, context) => {
    if (!BotDetector.isBot(request)) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(p => p);
        if (pathParts.length < 2 || pathParts[0] !== 'sideline') return context.next();

        const slug = decodeURIComponent(pathParts[1]);
        const thaiDate = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // ดึงข้อมูลโดยเชื่อมตาราง provinces ผ่านคอลัมน์ provinceKey (ตาม JSON จริง)
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*, provinces:provinceKey(nameThai)')
            .eq('slug', slug)
            .maybeSingle();

        if (error || !profile) return context.next();

        // จัดการข้อมูลให้ตรงตามโครงสร้าง JSON
        const pName = (profile.name || 'สาวสวย').trim();
        const pProv = profile.provinces?.nameThai || 'เชียงใหม่';
        const pLoc = (profile.location || pProv).trim();
        
        // ล้างค่าราคา (เช่น "1500.-" ให้เหลือ "1,500")
        const displayPrice = profile.rate 
            ? profile.rate.toString().replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
            : '1,500';

        const seed = getStableRandom(slug);
        const reviewCount = (seed % 205) + 45;
        const ratingValue = ((seed % 4) / 10 + 4.6).toFixed(1);

        const title = `น้อง${pName} ไซด์ไลน์${pProv} (${pLoc}) งานดีตรงปก เริ่ม ${displayPrice} | sideline chiangmai`;
        const description = `อัปเดตล่าสุด ${thaiDate}: ไซด์ไลน์${pProv} น้อง${pName} โซน${pLoc} งานดีไม่เร่ง ฟีลแฟน ไม่มีมัดจำ ปลอดภัย จ่ายหน้างาน 100% รีวิวแน่น ${reviewCount} คน ⭐ ${ratingValue}`;

        // ใช้ imagePath ตาม JSON จริง
        const imageFileName = profile.imagePath || '';
        const imageUrl = imageFileName.startsWith('http') 
            ? imageFileName 
            : `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${imageFileName.replace(/\.\.\//g, '')}`;

        const pageUrl = `${SITE_DOMAIN}/sideline/${encodeURIComponent(slug)}`;

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
        h1 { color: #ec4899; font-size: 22px; margin: 0 0 16px 0; line-height: 1.3; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .meta-item { background: #f9fafb; padding: 12px; border-radius: 12px; border: 1px solid #f3f4f6; }
        .meta-label { display: block; font-size: 11px; color: #6b7280; }
        .meta-val { display: block; font-weight: bold; color: #111827; }
        .desc { font-size: 15px; color: #4b5563; margin-bottom: 24px; white-space: pre-wrap; }
        .cta-btn { display: block; background: #06c755; color: #fff; text-align: center; padding: 16px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 18px; }
        .back-home { display: block; text-align: center; margin-top: 30px; color: #ec4899; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" alt="${pName}" class="hero-img">
        <div class="content">
            <div class="rating">⭐ ${ratingValue} (${reviewCount} รีวิว)</div>
            <h1>${title}</h1>
            <div class="meta-grid">
                <div class="meta-item"><span class="meta-label">ราคา</span><span class="meta-val">${displayPrice} บาท</span></div>
                <div class="meta-item"><span class="meta-label">พื้นที่</span><span class="meta-val">${pLoc}</span></div>
                <div class="meta-item"><span class="meta-label">สัดส่วน</span><span class="meta-val">${profile.stats || '34-25-36'}</span></div>
                <div class="meta-item"><span class="meta-label">อายุ</span><span class="meta-val">${profile.age || '22'} ปี</span></div>
            </div>
            <div class="desc">${profile.description || profile.quote || 'งานดี ตรงปก ฟีลแฟน ปลอดภัย 100%'}</div>
            <a href="${profile.lineId || '#'}" class="cta-btn">📲 แอดไลน์จองคิว</a>
            <a href="/" class="back-home">🏠 กลับหน้าหลัก</a>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: { 
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, s-maxage=3600" 
            }
        });

    } catch (e) {
        return context.next();
    }
};