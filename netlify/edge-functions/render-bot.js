// netlify/edge-functions/render-bot.js

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 1. ดึงค่าจาก Netlify Environment Variables 
// ⚠️ แก้ไขตรงนี้: แทนที่จะดึงจาก Deno.env.get() ให้ใส่ค่าโดยตรง
// ------------------------------------------------------------------

// 🔴 นำค่า VITE_SUPABASE_URL จาก main.js มาใส่ตรงนี้
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co'; 

// 🔴 นำค่า SUPABASE_KEY (Anon Key) จาก main.js มาใส่ตรงนี้
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...'; 

// 🔴 ใส่ชื่อตาราง
const TABLE_NAME = 'profiles'; 

// 🔴 ใส่ชื่อคอลัมน์ที่ใช้ระบุโปรไฟล์ (เช่น 'slug' หรือ 'profile_id')
const SLUG_COLUMN = 'slug'; 

// ------------------------------------------------------------------


// 2. ฟังก์ชันสำหรับสร้าง HTML สำหรับ Google Bot
const generateProfileHTML = (profileData, profileSlug) => {
    
    // (*** โค้ดส่วนนี้ยังต้องมีการปรับโครงสร้าง HTML ให้ตรงกับหน้าโปรไฟล์จริงของคุณ ***)
    const title = profileData.profile_title || profileData.profile_name || `โปรไฟล์ ${profileSlug}`;
    const description = profileData.description || `บริการจาก ${title} ในพื้นที่ ${profileData.city_name_th || 'ไม่ระบุ'}`;
    const image_url = profileData.profile_image_url || '';
    
    const profileContentHTML = `
        <div class="profile-card">
            <h1>${title}</h1>
            <img src="${image_url}" alt="${title}" style="max-width: 100%; height: auto;">
            <p><strong>ชื่อ:</strong> ${profileData.profile_name || 'ไม่ระบุ'}</p>
            <p><strong>จังหวัด:</strong> ${profileData.city_name_th || 'ไม่ระบุ'}</p>
            <div class="service-details">
                ${profileData.full_detail_html || '...ไม่พบรายละเอียดบริการ...'}
            </div>
        </div>
    `;

    return `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Sideline Chiang Mai</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="https://yourdomain.app/app/${profileSlug}">
    
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image_url}">

    <script type="application/ld+json">
        ${JSON.stringify({ 
            "@context": "https://schema.org", 
            "@type": "Person", 
            "name": title,
            "description": description
        })}
    </script>
</head>
<body>
    <main>${profileContentHTML}</main>
</body>
</html>
    `;
};

// 3. ฟังก์ชันหลักสำหรับ Edge Function (ส่วนนี้ไม่ต้องแก้ไข)
export default async (request, context) => {
    // โค้ดตรวจจับ Bot และดึงข้อมูลจาก Supabase โดยใช้ค่าที่ Hardcode ไว้
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|facebookexternalhit|twitterbot/i.test(userAgent);
    
    if (!isBot) {
        return context.next(); 
    }

    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
    const profileSlug = pathSegments[1]; 
    
    if (!profileSlug) {
        return context.next(); 
    }

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const { data, error } = await supabase
            .from(TABLE_NAME) 
            .select('*')
            .eq(SLUG_COLUMN, profileSlug) 
            .maybeSingle();

        if (error || !data) {
            return context.next(); 
        }

        const renderedHTML = generateProfileHTML(data, profileSlug);
        
        return new Response(renderedHTML, {
            headers: { "content-type": "text/html; charset=utf-8" },
            status: 200, 
        });

    } catch (e) {
        console.error("Supabase/Edge Function Error:", e);
        return context.next();
    }
};
