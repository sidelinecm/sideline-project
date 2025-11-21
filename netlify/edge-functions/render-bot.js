// netlify/edge-functions/render-bot.js

// นำเข้าไลบรารี Supabase ที่รองรับ Edge Function
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 1. HARDCODE CONFIGURATION (เนื่องจากเข้า Netlify Dashboard ไม่ได้)
// ⚠️ คำเตือน: ส่วนนี้จะถูกเปิดเผยต่อสาธารณะ ควรย้ายไปใช้ Netlify Environment Variables ทันทีที่ล็อกอินได้
// ------------------------------------------------------------------

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const TABLE_NAME = 'profiles'; 

// 🔴 หากคอลัมน์ที่ใช้เป็นตัวระบุโปรไฟล์ไม่ใช่ 'slug' ให้เปลี่ยนค่านี้ (เช่น 'profile_id')
const SLUG_COLUMN = 'slug'; 

// ------------------------------------------------------------------


// 2. ฟังก์ชันสำหรับสร้าง HTML และ Meta Data สำหรับ Google Bot
const generateProfileHTML = (profileData, profileSlug) => {
    
    // ดึงข้อมูลหลักสำหรับ SEO
    const title = profileData.profile_title || profileData.profile_name || `โปรไฟล์ ${profileSlug}`;
    const description = profileData.description || `บริการจาก ${title} ในพื้นที่ ${profileData.city_name_th || 'ไม่ระบุ'} - Sideline Chiang Mai`;
    const image_url = profileData.profile_image_url || '';
    const domain_url = "https://yourdomain.app"; // ⚠️ กรุณาแก้ไขเป็น Domain จริงของคุณ

    // 2.1 สร้าง JSON-LD FAQ Schema (ดึงมาจาก main.js เดิม)
    const faqSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "บริการไซด์ไลน์เชียงใหม่ของ Sideline Chiang Mai ปลอดภัยและถูกต้องตามกฎหมายหรือไม่?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "บริการของเราเน้นที่การนัดหมายส่วนตัวของลูกค้ารายบุคคล และไม่มีนโยบายเกี่ยวข้องกับการค้าประเวณี เราบริหารจัดการภายใต้กฎระเบียบและข้อกำหนดที่เข้มงวด"
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการไซด์ไลน์หรือไม่?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "เพื่อความสบายใจของลูกค้าทุกท่าน ท่านไม่จำเป็นต้องโอนเงินมัดจำใดๆ ทั้งสิ้น สามารถชำระค่าบริการเต็มจำนวนโดยตรงกับน้องๆ ที่หน้างานได้เลย"
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "น้องๆ ไซด์ไลน์เชียงใหม่ตรงปกตามรูปที่แสดงในโปรไฟล์จริงหรือ?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพของน้องๆ ทุกคนอย่างละเอียด Sideline Chiang Mai กล้าการันตีว่าน้องๆ ตรงปก 100% หากพบปัญหาใดๆ สามารถแจ้งทีมงานเพื่อดำเนินการแก้ไขได้ทันที"
                        }
                    }
                ]
            }
        ]
    };

    // 2.2 โครงสร้างเนื้อหา HTML (Content HTML)
    const profileContentHTML = `
        <div class="profile-card">
            <h1>${title}</h1>
            <img src="${image_url}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px;">
            <p><strong>ชื่อโปรไฟล์:</strong> ${profileData.profile_name || 'ไม่ระบุ'}</p>
            <p><strong>อายุ:</strong> ${profileData.age || 'ไม่ระบุ'}</p>
            <p><strong>สถานที่:</strong> ${profileData.city_name_th || 'ไม่ระบุ'}</p>
            
            <div class="service-details">
                <h2>รายละเอียดบริการเต็มรูปแบบ</h2>
                ${profileData.full_detail_html || '<p>ไม่พบรายละเอียดบริการเต็มรูปแบบ</p>'}
            </div>
            
            </div>
    `;


    // 2.3 โครงสร้าง HTML เต็มรูปแบบที่ส่งกลับให้ Bot
    return `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Sideline Chiang Mai</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${domain_url}/app/${profileSlug}">
    
    <link rel="stylesheet" href="/style.css"> 
    
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image_url}">
    <meta property="og:url" content="${domain_url}/app/${profileSlug}">

    <script type="application/ld+json">
        ${JSON.stringify(faqSchema)}
    </script>

    <script type="application/ld+json">
        ${JSON.stringify({ 
            "@context": "https://schema.org", 
            "@type": "Person", 
            "name": title,
            "description": description,
            "url": `${domain_url}/app/${profileSlug}`,
            "image": image_url
        })}
    </script>
</head>
<body>
    <main style="max-width: 900px; margin: 20px auto;">
        ${profileContentHTML}
    </main>
</body>
</html>
    `;
};


// 3. ฟังก์ชันหลักสำหรับ Edge Function (Logic การตรวจจับและตอบกลับ)
export default async (request, context) => {
    // โค้ดตรวจจับ Bot 
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|facebookexternalhit|twitterbot/i.test(userAgent);
    
    // ถ้าไม่ใช่ Bot ให้ปล่อยผ่านไปให้ SPA จัดการ (context.next())
    if (!isBot) {
        return context.next(); 
    }

    // ดึง Slug จาก URL (คาดว่า Path เป็น /app/slug)
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
    const profileSlug = pathSegments[1]; 
    
    if (!profileSlug) {
        // ถ้าไม่มี slug ให้ปล่อยผ่าน
        return context.next(); 
    }

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // คิวรี Supabase ด้วยคอลัมน์ที่กำหนดไว้
        const { data, error } = await supabase
            .from(TABLE_NAME) 
            .select('*')
            .eq(SLUG_COLUMN, profileSlug) 
            .maybeSingle();

        if (error || !data) {
            // ไม่พบข้อมูล ให้ปล่อยผ่านเพื่อให้ SPA แสดงหน้า 404
            return context.next(); 
        }

        // สร้าง HTML และส่งกลับสถานะ 200 (Success)
        const renderedHTML = generateProfileHTML(data, profileSlug);
        
        return new Response(renderedHTML, {
            headers: { "content-type": "text/html; charset=utf-8" },
            status: 200, 
        });

    } catch (e) {
        // หากเกิดข้อผิดพลาดในการเชื่อมต่อ ให้ปล่อยผ่าน
        console.error("Supabase/Edge Function Error:", e);
        return context.next();
    }
};
