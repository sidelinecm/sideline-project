import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2tneWlra2VpdWNuZHRuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzIyOTMsImV4cCI6MjA4NjEwODI5M30.-x6TN3XQS43QTKv4LpZv9AM4_Tm2q3R4Nd-KGo-KU1E',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    STORAGE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co/storage/v1/object/public/profile-images',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: ["https://linktr.ee/sidelinechiangmai", "https://x.com/Sdl_chiangmai"]
};

// Helper function to escape HTML
const escapeHtml = (str) => {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];
const optimizeImg = (path, width = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=80&format=webp`;
};

export default async (request, context) => {
    const url = new URL(request.url);
    const path = url.pathname;

    // 🛑 บล็อก: ถ้าเป็นหน้าแรก หรือไม่ใช่หน้าโปรไฟล์ ให้ไป Client Render
    if (path === "/" || path === "/index.html" || !path.startsWith("/sideline/")) {
        return context.next();
    }

    // ตรวจสอบ User-Agent
    const ua = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|lighthouse|headless/i.test(ua);
    
    // Security/Geo Cloaking
    const geo = context.geo || {};
    const isSuspicious = !geo.city || (geo.country?.code !== 'TH' && geo.country?.code !== 'US');

    // ถ้าไม่ใช่ Bot และไม่ใช่พฤติกรรมน่าสงสัย ให้ไป Client Render ปกติ
    if (!isBot && !isSuspicious) return context.next();

    try {
        const pathParts = path.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();

        let slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        const cleanSlug = slug.includes('-') ? slug.split('-').slice(0, -1).join('-') : slug;
        
        // ตรวจสอบว่าไม่ใช่หน้า system
        if (['province', 'search', 'location', 'admin', 'login'].includes(slug)) {
            return context.next();
        }

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // ดึงข้อมูลโปรไฟล์
        const { data: profile } = await supabase
            .from('profiles')
            .select('*, provinces:provinces!provinceKey(*)')
            .or(`slug.eq."${slug}",slug.eq."${cleanSlug}"`) 
            .eq('active', true) 
            .maybeSingle();

        if (!profile) return context.next();

        // ดึงข้อมูลโปรไฟล์ที่เกี่ยวข้อง
        let related = [];
        if (profile.provinceKey) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('provinceKey', profile.provinceKey)
                .eq('active', true)
                .neq('id', profile.id)
                .limit(4);
            related = relatedData || [];
        }

        // เตรียมข้อมูลสำหรับแสดงผล
        const displayName = profile.name.startsWith('น้อง') ? profile.name : `น้อง${profile.name}`;
        const rawPrice = (profile.rate || "1500").toString().replace(/[^0-9]/g, '');
        const displayPrice = (parseInt(rawPrice) || 1500).toLocaleString() + ".-";
        const imageUrl = optimizeImg(profile.imagePath, 800);
        const provinceName = profile.provinces?.nameThai || profile.location || 'เชียงใหม่';
        const ratingValue = (4.7 + (profile.id % 3) / 10).toFixed(1);
        const reviewCount = (120 + (profile.id % 80)).toString();
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${profile.slug}`;
        
        // จัดการ LINE URL
        let finalLineUrl = profile.lineId || 'ksLUMz3p_o';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;
        }

        // Escape HTML สำหรับข้อมูลที่มาจากผู้ใช้
        const safeDisplayName = escapeHtml(displayName);
        const safeProvinceName = escapeHtml(provinceName);
        const safeLocation = escapeHtml(profile.location || provinceName);
        const safeDescription = escapeHtml(profile.description || '');

        // SEO Metadata
        const pageTitle = `${spin(["โปรไฟล์", "รีวิว", "แนะนำ"])} ${safeDisplayName} - ไซด์ไลน์${safeProvinceName} รับงานเอง ตรงปก`;
        const metaDesc = `${safeDisplayName} รับงานไซด์ไลน์ ${safeProvinceName} อายุ ${profile.age || '20+'} ปี ฟิวแฟน รับงานเองไม่ผ่านเอเย่นต์ จ่ายหน้างานเท่านั้น พิกัด ${safeLocation}`;

        // Schema.org Structured Data
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Organization",
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": `${CONFIG.DOMAIN}/logo.png`,
                    "sameAs": CONFIG.SOCIAL_PROFILES
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "หน้าแรก",
                            "item": CONFIG.DOMAIN
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": `ไซด์ไลน์${safeProvinceName}`,
                            "item": `${CONFIG.DOMAIN}/location/${profile.provinceKey || 'chiang-mai'}`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": safeDisplayName,
                            "item": canonicalUrl
                        }
                    ]
                },
                {
                    "@type": "Person",
                    "name": safeDisplayName,
                    "image": imageUrl,
                    "description": metaDesc,
                    "url": canonicalUrl,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": safeProvinceName,
                        "addressRegion": "ประเทศไทย"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": rawPrice,
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock"
                    }
                },
                {
                    "@type": "AggregateRating",
                    "ratingValue": ratingValue,
                    "ratingCount": reviewCount,
                    "bestRating": "5",
                    "worstRating": "1",
                    "url": canonicalUrl
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `จอง${safeDisplayName} ต้องมัดจำไหม?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "ไม่ต้องมัดจำครับ จ่ายเงินหน้างานเท่านั้น ปลอดภัย 100%"
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `พิกัดของ ${safeDisplayName} อยู่แถวไหน?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `น้องอยู่ที่ ${safeLocation} ครับ สามารถนัดเจอได้ในพื้นที่${safeProvinceName}และใกล้เคียง`
                            }
                        }
                    ]
                }
            ]
        };

        // HTML Template
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="google-site-verification" content="0N_IQUDZv9Y2WtNhjqSPTV3TuPsildmmO-TPwdMlSfg" />
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    
    <!-- Open Graph -->
    <meta property="og:locale" content="th_TH">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="800">
    <meta property="og:image:height" content="1067">
    <meta property="og:image:alt" content="${safeDisplayName} ไซด์ไลน์${safeProvinceName}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:image:alt" content="${safeDisplayName} ไซด์ไลน์${safeProvinceName}">
    
    <!-- Additional Meta Tags -->
    <meta name="keywords" content="ไซด์ไลน์, ${safeProvinceName}, ${safeDisplayName}, รับงานเอง, ไม่มัดจำ">
    <meta name="author" content="${CONFIG.BRAND_NAME}">
    <meta name="language" content="thai">
    <meta name="geo.region" content="TH">
    <meta name="geo.placename" content="${safeProvinceName}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root {
            --primary: #db2777;
            --secondary: #06c755;
            --dark: #1f2937;
            --light: #f9fafb;
            --gray: #9ca3af;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #fff;
            color: var(--dark);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .container {
            max-width: 480px;
            margin: 0 auto;
            min-height: 100vh;
            background: #fff;
        }
        
        .header-image {
            width: 100%;
            height: auto;
            display: block;
            aspect-ratio: 3/4;
            object-fit: cover;
            background: #f3f4f6;
        }
        
        .content {
            padding: 24px;
        }
        
        .rating {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #fbbf24;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .rating span {
            color: var(--gray);
            font-size: 14px;
        }
        
        h1 {
            color: var(--primary);
            font-size: 24px;
            margin: 0 0 16px 0;
            font-weight: 800;
            line-height: 1.3;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .info-item {
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 16px;
            background: var(--light);
        }
        
        .info-item b {
            display: block;
            font-size: 11px;
            color: var(--gray);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .info-item span {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
        }
        
        .description {
            margin-bottom: 24px;
            color: #4b5563;
            font-size: 15px;
            line-height: 1.7;
        }
        
        .cta-button {
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--secondary);
            color: #fff;
            padding: 18px;
            border-radius: 100px;
            text-decoration: none;
            font-weight: 700;
            font-size: 18px;
            box-shadow: 0 10px 15px -3px rgba(6, 199, 85, 0.4);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            width: 100%;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(6, 199, 85, 0.4);
        }
        
        .cta-button:active {
            transform: translateY(0);
        }
        
        .related-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #f3f4f6;
        }
        
        .related-title {
            font-weight: 800;
            color: var(--primary);
            display: block;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .related-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .related-card {
            text-decoration: none;
            color: inherit;
            display: block;
        }
        
        .related-image {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
            border-radius: 12px;
            background: #eee;
        }
        
        .related-name {
            font-weight: 700;
            margin-top: 8px;
            font-size: 14px;
            color: var(--dark);
        }
        
        .related-location {
            font-size: 12px;
            color: var(--gray);
            margin-top: 2px;
        }
        
        .footer {
            text-align: center;
            font-size: 12px;
            color: var(--gray);
            margin-top: 30px;
            padding: 20px 0;
            border-top: 1px solid #e5e7eb;
        }
        
        @media (max-width: 360px) {
            .content {
                padding: 16px;
            }
            
            h1 {
                font-size: 20px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .related-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <img 
            src="${imageUrl}" 
            class="header-image" 
            alt="${safeDisplayName} ไซด์ไลน์${safeProvinceName}" 
            fetchpriority="high" 
            decoding="async"
            loading="eager"
            onerror="this.src='${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp'"
        >
        
        <div class="content">
            <div class="rating">
                ⭐ ${ratingValue} <span>(${reviewCount} รีวิว)</span>
            </div>
            
            <h1>${pageTitle}</h1>
            
            <div class="info-grid">
                <div class="info-item">
                    <b>ค่าขนมเริ่มต้น</b>
                    <span>${displayPrice}</span>
                </div>
                <div class="info-item">
                    <b>พิกัดพื้นที่</b>
                    <span>${safeLocation}</span>
                </div>
            </div>
            
            <div class="description">
                ${metaDesc}
                ${safeDescription ? `<br><br>${safeDescription}` : ''}
            </div>
            
            <a href="${finalLineUrl}" class="cta-button" aria-label="ทักไลน์จองคิวกับ ${safeDisplayName}">
                📲 ทักไลน์จองคิว ${safeDisplayName}
            </a>
            
            ${related && related.length > 0 ? `
            <div class="related-section">
                <span class="related-title">🔥 น้องๆ แนะนำใน${safeProvinceName}:</span>
                <div class="related-grid">
                    ${related.map(r => {
                        const safeName = escapeHtml(r.name);
                        const safeRelatedLocation = escapeHtml(r.location || safeProvinceName);
                        return `
                        <a href="${CONFIG.DOMAIN}/sideline/${r.slug}" class="related-card" aria-label="ดูโปรไฟล์ ${safeName}">
                            <img 
                                src="${optimizeImg(r.imagePath, 350)}" 
                                class="related-image" 
                                alt="โปรไฟล์แนะนำ น้อง${safeName} ไซด์ไลน์${safeProvinceName}"
                                loading="lazy"
                                onerror="this.src='${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp'"
                            >
                            <div class="related-name">น้อง${safeName}</div>
                            <div class="related-location">📍 ${safeRelatedLocation}</div>
                        </a>
                        `;
                    }).join('')}
                </div>
            </div>` : ''}
            
            <div class="footer">
                © ${new Date().getFullYear() + 543} ${CONFIG.BRAND_NAME} - มั่นใจ ปลอดภัย ไม่มัดจำ<br>
                <small style="opacity: 0.7; margin-top: 5px; display: block;">
                    อัปเดตล่าสุด: ${new Date().toLocaleDateString('th-TH', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </small>
            </div>
        </div>
    </div>
    
    <script>
        // Client-side hydration (ถ้ามี)
        if (typeof window !== 'undefined') {
            // เพิ่มการติดตาม Analytics หรือ Interactivity
            document.addEventListener('DOMContentLoaded', function() {
                // ตัวอย่าง: Log เมื่อผู้ใช้คลิกปุ่ม LINE
                const lineButton = document.querySelector('.cta-button');
                if (lineButton) {
                    lineButton.addEventListener('click', function() {
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'line_click', {
                                'event_category': 'engagement',
                                'event_label': '${safeDisplayName}'
                            });
                        }
                    });
                }
            });
        }
    </script>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
                "vary": "User-Agent, Accept-Encoding"
            } 
        });

    } catch (error) {
        console.error("SSR Profile Error:", error);
        // ในกรณีเกิดข้อผิดพลาด ให้ส่งไปยัง Client-side Rendering แทน
        return context.next();
    }
};
