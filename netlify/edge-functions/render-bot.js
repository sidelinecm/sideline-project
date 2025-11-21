// netlify/edge-functions/render-bot.js

// นำเข้าไลบรารี Supabase ที่รองรับ Edge Function
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 1. HARDCODE CONFIGURATION
// ⚠️ คำเตือน: ส่วนนี้เปิดเผยต่อสาธารณะ ควรย้ายไปใช้ Environment Variables เมื่อทำได้
// ------------------------------------------------------------------

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const TABLE_NAME = 'profiles'; 
const STORAGE_BUCKET = 'profile-images'; // ชื่อ Bucket รูปภาพจาก main.js

// 🔴 คอลัมน์ที่ใช้ระบุโปรไฟล์ (Slug)
// จากภาพ DB มีคอลัมน์ 'slug' ถ้าไม่มีข้อมูลให้เปลี่ยนเป็น 'id' หรือ 'lineId' แทน
const SLUG_COLUMN = 'slug'; 

// Domain จริงของเว็บไซต์คุณ
const DOMAIN_URL = "https://sidelinechiangmai.netlify.app"; 

// ------------------------------------------------------------------


// 2. ฟังก์ชันสำหรับสร้าง HTML และ Meta Data สำหรับ Google Bot
const generateProfileHTML = (profileData, profileSlug) => {
    
    // --- 2.1 เตรียมข้อมูล (Data Preparation) ---
    
    // ดึงชื่อและรายละเอียด (ใช้ Fallback ถ้าไม่มีข้อมูล)
    const name = profileData.name || `น้อง ${profileSlug}`;
    const province = profileData.provinceKey || 'เชียงใหม่';
    const age = profileData.age || 'ไม่ระบุ';
    const stats = profileData.stats || 'ไม่ระบุ';
    
    // สร้างรายละเอียด Description สำหรับ SEO
    const rawDescription = profileData.description || '';
    // ตัด Description ให้สั้นลงสำหรับ Meta Tag (ประมาณ 150 ตัวอักษร)
    const metaDescription = rawDescription.length > 150 
        ? rawDescription.substring(0, 150) + '...' 
        : (rawDescription || `ดูโปรไฟล์น้อง ${name} ไซด์ไลน์${province} รับงานเอง ปลอดภัย ตรงปก`);

    // สร้าง Image URL ที่ถูกต้องจาก imagePath
    let imageUrl = '';
    if (profileData.imagePath) {
        // สร้าง URL เต็มรูปแบบของ Supabase Storage
        imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profileData.imagePath}`;
    } else {
        imageUrl = `${DOMAIN_URL}/images/og-default.webp`; // รูป Default
    }

    // ชื่อ Title ของหน้า
    const pageTitle = `${name} - สาวไซด์ไลน์${province} รับงานฟีลแฟน ตรงปก | Sideline Chiang Mai`;


    // --- 2.2 สร้าง Schema JSON-LD (SEO) ---
    
    // FAQ Schema (ดึงมาจาก main.js)
    const faqSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?",
                        "acceptedAnswer": { "@type": "Answer", "text": "Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้า ข้อมูลจะถูกเก็บเป็นความลับ" }
                    },
                    {
                        "@type": "Question",
                        "name": "จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการหรือไม่?",
                        "acceptedAnswer": { "@type": "Answer", "text": "ไม่จำเป็นต้องโอนเงินมัดจำ สามารถชำระค่าบริการเต็มจำนวนที่หน้างานได้เลย" }
                    },
                    {
                        "@type": "Question",
                        "name": "น้องๆ ตรงปกตามรูปโปรไฟล์จริงหรือ?",
                        "acceptedAnswer": { "@type": "Answer", "text": "เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพอย่างละเอียด การันตีตรงปก 100%" }
                    }
                ]
            }
        ]
    };

    // Person/Profile Schema
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        "description": metaDescription,
        "image": imageUrl,
        "url": `${DOMAIN_URL}/app/${profileSlug}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": province,
            "addressCountry": "TH"
        }
    };


    // --- 2.3 สร้าง HTML Content (Body) ---
    // สร้าง HTML ที่เรียบง่ายแต่มีเนื้อหาครบเพื่อให้ Google อ่าน
    const profileContentHTML = `
        <article class="profile-container">
            <header>
                <h1>${name} (${province})</h1>
                <div class="meta-info">
                    <span>อายุ: ${age} ปี</span> | 
                    <span>สัดส่วน: ${stats}</span> | 
                    <span>จังหวัด: ${province}</span>
                </div>
            </header>
            
            <figure>
                <img src="${imageUrl}" alt="รูปโปรไฟล์ของ ${name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
                <figcaption>${profileData.altText || `น้อง ${name} รับงาน${province}`}</figcaption>
            </figure>
            
            <section class="details">
                <h2>รายละเอียดบริการ</h2>
                <div class="description-content">
                    ${profileData.description ? profileData.description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม'}
                </div>
                
                <div class="additional-info">
                    <p><strong>เรทราคา:</strong> ${profileData.rate || 'สอบถาม'}</p>
                    <p><strong>สถานที่รับงาน:</strong> ${profileData.location || province}</p>
                    <p><strong>สถานะ:</strong> ${profileData.availability || 'สอบถามคิว'}</p>
                </div>
            </section>
        </article>
    `;


    // --- 2.4 Return Full HTML Document ---
    return `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDescription}">
    <link rel="canonical" href="${DOMAIN_URL}/app/${profileSlug}">
    
    <link rel="stylesheet" href="/style.css"> 
    
    <meta property="og:type" content="profile">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${DOMAIN_URL}/app/${profileSlug}">
    <meta property="og:site_name" content="Sideline Chiang Mai">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDescription}">
    <meta name="twitter:image" content="${imageUrl}">

    <script type="application/ld+json">
        ${JSON.stringify(faqSchema)}
    </script>

    <script type="application/ld+json">
        ${JSON.stringify(personSchema)}
    </script>
    
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #d53f8c; }
        img { display: block; margin: 0 auto; }
        .meta-info { font-weight: bold; color: #555; margin-bottom: 10px; }
        .details { margin-top: 20px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    ${profileContentHTML}
</body>
</html>
    `;
};


// 3. ฟังก์ชันหลักสำหรับ Edge Function (Logic การตรวจจับและตอบกลับ)
export default async (request, context) => {
    // โค้ดตรวจจับ Bot (User-Agent Detection)
    const userAgent = request.headers.get('User-Agent') || '';
    // เพิ่มรายการ Bot ให้ครอบคลุมมากขึ้น (Facebook, Twitter, Discord, etc.)
    const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|baiduspider/i.test(userAgent);
    
    // ถ้าไม่ใช่ Bot ให้ปล่อยผ่านไปให้ SPA (index.html) จัดการ
    if (!isBot) {
        return context.next(); 
    }

    // ดึง Slug จาก URL
    // URL Pattern: https://domain.com/app/SLUG
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
    
    // pathSegments[0] คือ 'app', pathSegments[1] คือ 'slug'
    const profileSlug = pathSegments[1]; 
    
    if (!profileSlug) {
        return context.next(); 
    }

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // คิวรี Supabase
        const { data, error } = await supabase
            .from(TABLE_NAME) 
            .select('*')
            .eq(SLUG_COLUMN, profileSlug) 
            .maybeSingle();

        if (error || !data) {
            // ถ้าไม่เจอข้อมูล หรือ Error ให้ปล่อยผ่าน (ไปหน้า 404 ของ SPA)
            console.log(`Bot request for /app/${profileSlug} - Profile not found or Error.`);
            return context.next(); 
        }

        // ถ้าเจอข้อมูล สร้าง HTML ส่งกลับ
        const renderedHTML = generateProfileHTML(data, profileSlug);
        
        return new Response(renderedHTML, {
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow" // บอก Bot ให้เก็บ Index หน้านี้แน่นอน
            },
            status: 200, 
        });

    } catch (e) {
        console.error("Edge Function Critical Error:", e);
        return context.next();
    }
};
