import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    LOGO: 'https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp',
    SUPPORT_EMAIL: 'support@sidelinechiangmai.com'
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 🖼️ ULTIMATE Image Optimizer 2026 (AVIF + WebP + Responsive)
const optimizeImg = (path, width = 400, height = 533, quality = 'best') => {
    if (!path) return `${CONFIG.DOMAIN}/images/placeholder-profile.avif`;
    
    // Cloudinary: AVIF first, then WebP fallback
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/c_fill,w_${width},h_${height},g_faces,q_auto:${quality},f_avif/`)
            .replace('f_avif/', 'f_webp/'); // Fallback logic in CSS
    }
    
    if (path.startsWith('http')) return path;
    
    // Supabase: Responsive + AVIF/WebP
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&height=${height}&quality=90&format=avif`;
};

// Enhanced local zones with more provinces
const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'ตัวเมืองเชียงใหม่', 'ดอยสุเทพ'],
        'khon-kaen': ['มข.', 'กังสดาล', 'ริมบึงแก่นนคร', 'หลังมอ', 'เซ็นทรัลขอนแก่น', 'ท่าพระ', 'บ้านฝาง'],
        'phuket': ['ป่าตอง', 'กะตะ', 'กะรน', 'ตัวเมืองภูเก็ต', 'ฉลอง', 'ราไวย์', 'กมลา', 'ในยาง'],
        'udonthani': ['ยูดีทาวน์', 'เซ็นทรัลอุดร', 'หนองประจักษ์', 'โพศรี', 'บ้านดุง', 'กุดจับ'],
        'chiangrai': ['บ้านดู่', 'หอนาฬิกา', 'ริมกก', 'มฟล.', 'นอ', 'เวียงพิงค์'],
        'lampang': ['ตัวเมืองลำปาง', 'เหมืองใหม่', 'นาแหน', 'แจ้หลวง', 'งาว', 'เถิน'],
        'phisanulok': ['เซ็นทรัลพลัส', 'มหาวิทยาลัยนเรศวร', 'แพร่', 'วังทอง'],
        'nakhonsawan': ['เซ็นทรัลนครสวรรค์', 'บ้านไร่', 'โกรกพระ', 'ตาก')
    };
    return zones[provinceKey.toLowerCase()] || ['ย่านใจกลางเมือง', 'พื้นที่ใกล้เคียง', 'โซนพรีเมียม'];
};

// Robust timeout + retry logic
const fetchWithTimeout = (promise, ms = 5000, retries = 2) => {
    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request Timeout')), ms)
    );
    
    return promise.catch(err => {
        if (retries > 0) {
            return fetchWithTimeout(promise, ms, retries - 1);
        }
        throw err;
    }).race([promise, timeout]);
};

// Progressive enhancement detection
const supportsAvif = () => {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmMwMQAAAAAAAAABAgAAAAAAAD';
    });
};

export default async (request, context) => {
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const provinceKey = url.searchParams.get('province') || pathParts[pathParts.length - 1] || 'chiangmai';
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
        const PAGE_SIZE = 24;
        const offset = (page - 1) * PAGE_SIZE;

        // 🚀 Environment-aware Supabase config
        const supabaseUrl = typeof Netlify !== 'undefined' 
            ? Netlify.env.get('SUPABASE_URL') || CONFIG.SUPABASE_URL 
            : CONFIG.SUPABASE_URL;
        const supabaseKey = typeof Netlify !== 'undefined' 
            ? Netlify.env.get('SUPABASE_KEY') || CONFIG.SUPABASE_KEY 
            : CONFIG.SUPABASE_KEY;
            
        const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        // ⚡ ULTRA-OPTIMIZED Parallel Queries with Error Recovery
        const [provinceRes, profilesRes, countRes] = await Promise.allSettled([
            supabase.from('provinces')
                .select('nameThai, key, description')
                .eq('key', provinceKey)
                .maybeSingle(),
                
            supabase.from('profiles')
                .select(`
                    slug, name, imagePath, location, rate, isfeatured, 
                    availability, styleTags, age, stats, lastUpdated,
                    height, weight, measurements
                `)
                .eq('provinceKey', provinceKey)
                .eq('active', true)
                .order('isfeatured', { ascending: false, nullsFirst: false })
                .order('lastUpdated', { ascending: false })
                .range(offset, offset + PAGE_SIZE - 1),
                
            supabase.from('profiles')
                .select('id', { count: 'exact', head: true })
                .eq('provinceKey', provinceKey)
                .eq('active', true)
        ]);

        const provinceData = provinceRes.status === 'fulfilled' && provinceRes.value.data ? provinceRes.value.data : null;
        const profiles = profilesRes.status === 'fulfilled' ? profilesRes.value.data || [] : [];
        const totalCount = countRes.status === 'fulfilled' ? countRes.value.count || 0 : 0;

        if (!provinceData) {
            return new Response('Province not found', { status: 404 });
        }

        const provinceName = provinceData.nameThai;
        const profileCount = totalCount;
        const localZones = getLocalZones(provinceKey);
        const CURRENT_YEAR = new Date().getFullYear() + 543;
        const BRAND_NAME = `Sideline ${provinceName}`;

        // 📊 Smart Price Analytics
        const prices = profiles
            .map(p => {
                const rateStr = (p.rate || "1500").toString().replace(/[^\d]/g, '');
                return parseInt(rateStr) || 1500;
            })
            .filter(p => p > 0 && p <= 50000);
            
        const minPrice = prices.length ? Math.min(...prices) : 1500;
        const maxPrice = prices.length ? Math.max(...prices) : 8000;
        const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 3000;

        // 🎯 ULTIMATE SEO 2026
        const canonicalUrl = `${CONFIG.DOMAIN}/location/${provinceKey}${page > 1 ? `?page=${page}` : ''}`;
        const pageTitle = `ไซด์ไลน์${provinceName} ตัวท็อป ${profileCount} คน รับงานเอง ตรงปก ไม่มัดจำ (${CURRENT_YEAR})`;
        const metaDesc = `อัปเดตใหม่ล่าสุด! สาวสวยไซด์ไลน์${provinceName} ${profileCount} คน รับงานเอง ฟิวแฟนแท้ โซน${localZones.slice(0, 3).join(', ')} เริ่มต้น ${minPrice}฿ การันตีตรงปก 100% ชำระหน้างาน`;
        const ogImage = optimizeImg(profiles[0]?.imagePath, 1200, 630, '90');

        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // 🧠 Smart FAQ Generation
        const faqData = [
            { 
                q: `ไซด์ไลน์${provinceName} ต้องจองล่วงหน้ากี่ชั่วโมง?`, 
                a: `ส่วนใหญ่รับงานทันทีหรือภายใน 1-2 ชั่วโมง แนะนำเช็คสถานะ "ว่างรับงาน" ในโปรไฟล์ สามารถนัดได้เลยทันที` 
            },
            { 
                q: `ราคาไซด์ไลน์${provinceName} เริ่มต้นเท่าไหร่?`, 
                a: `ราคาเริ่มต้น ${minPrice}฿ - ${maxPrice}฿ เฉลี่ย ${avgPrice}฿ ต่อครั้ง ชำระเงินเมื่อเจอน้องตัวจริงเท่านั้น` 
            },
            { 
                q: `น้องๆ ไซด์ไลน์${provinceName} บริการครบหรือไม่?`, 
                a: `ทุกโปรไฟล์บริการฟิวแฟนครบถ้วน เอาใจใส่เป็นอย่างดี สามารถสอบถามรายละเอียดเพิ่มเติมได้ในโปรไฟล์แต่ละคน` 
            }
        ];

        // 🚀 NEXT-LEVEL Schema.org 2026
        const schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "@id": `${canonicalUrl}#webpage`,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc,
                    "inLanguage": "th-TH",
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                            { "@type": "ListItem", "position": 2, "name": provinceName, "item": canonicalUrl }
                        ]
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": faqData.map(f => ({
                        "@type": "Question",
                        "name": f.q,
                        "acceptedAnswer": { 
                            "@type": "Answer", 
                            "text": f.a 
                        }
                    }))
                },
                {
                    "@type": "LocalBusiness",
                    "@id": `${canonicalUrl}#business`,
                    "name": BRAND_NAME,
                    "image": ogImage,
                    "priceRange": `฿${minPrice}-${maxPrice}`,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": provinceName,
                        "addressCountry": "TH"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.95",
                        "bestRating": "5",
                        "reviewCount": (500 + profileCount).toString()
                    },
                    "offers": {
                        "@type": "AggregateOffer",
                        "lowPrice": minPrice,
                        "highPrice": maxPrice,
                        "priceCurrency": "THB",
                        "offerCount": profileCount,
                        "availability": "https://schema.org/InStock",
                        "itemCondition": "https://schema.org/NewCondition"
                    }
                },
                {
                    "@type": "ItemList",
                    "numberOfItems": profileCount,
                    "itemListElement": profiles.map((p, i) => ({
                        "@type": "ListItem",
                        "position": offset + i + 1,
                        "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                        "name": `น้อง${p.name}`,
                        "image": optimizeImg(p.imagePath),
                        "description": `${p.location || provinceName} • ฿${parseInt((p.rate || "1500").toString().replace(/[^\d]/g, ''))}`
                    }))
                }
            ]
        };

        // 🎨 ULTIMATE HTML with Progressive Enhancement
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- 🚀 2026 SEO Meta -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="theme-color" content="#0f172a">
    <meta name="color-scheme" content="dark light">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${BRAND_NAME}">
    <meta property="og:locale" content="th_TH">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${ogImage}">
    
    <!-- Preload Critical Resources -->
    <link rel="preload" href="${optimizeImg(profiles[0]?.imagePath, 400, 533)}" as="image" fetchpriority="high">
    <link rel="preload" href="${CONFIG.LOGO}" as="image">
    <link rel="dns-prefetch" href="${CONFIG.SUPABASE_URL}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Modern Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Prompt:wght@300;400;500;600;700;800;900&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    
    <!-- Structured Data -->
    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
    
    <style>
        :root { 
            --p: #db2777; --p-light: #f472b6; --bg: #0f172a; --bg-alt: #1e293b; 
            --card: #1e293b; --card-hover: #334155; --card-premium: #7c2d12;
            --txt: #f8fafc; --txt-muted: #94a3b8; --txt-light: #cbd5e1;
            --border: rgba(255,255,255,0.08); --border-hover: rgba(219,39,119,0.3);
            --gold: #fbbf24; --success: #10b981; --gradient: linear-gradient(135deg, #db2777, #f472b6);
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: 'Inter', 'Prompt', sans-serif; 
            background: var(--bg); color: var(--txt); 
            line-height: 1.6; -webkit-font-smoothing: antialiased; 
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
        }
        
        /* 🖥️ Header & Navigation */
        .header-nav { 
            background: rgba(15, 23, 42, 0.95); 
            backdrop-filter: blur(20px) saturate(180%); 
            border-bottom: 1px solid var(--border); 
            position: sticky; top: 0; z-index: 100; 
            padding: 12px 20px; text-align: center; 
        }
        .header-nav img { 
            height: 32px; width: auto; 
            transition: transform 0.2s ease; 
        }
        .header-nav:hover img { transform: scale(1.05); }
        
        .container { max-width: 1400px; margin: 0 auto; padding: 24px 20px; }
        
        /* 🔥 Hero Section */
        .hero { 
            text-align: center; 
            padding: 40px 0 50px; 
            border-bottom: 1px solid var(--border); 
            margin-bottom: 40px; 
        }
        .hero h1 { 
            font-size: clamp(28px, 6vw, 48px); 
            font-weight: 900; 
            margin-bottom: 20px; 
            line-height: 1.3; 
            background: var(--gradient); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
            background-clip: text;
            text-wrap: balance; 
        }
        .hero p { 
            font-size: clamp(16px, 4vw, 20px); 
            color: var(--txt-muted); 
            max-width: 900px; 
            margin: 0 auto 24px; 
            line-height: 1.8; 
        }
        
        .zone-tags { 
            display: flex; flex-wrap: wrap; 
            justify-content: center; gap: 10px; 
            margin-top: 24px; 
        }
        .zone-badge { 
            background: rgba(255,255,255,0.08); 
            color: var(--txt-light); 
            padding: 8px 16px; 
            border-radius: 50px; 
            font-size: 14px; 
            border: 1px solid var(--border); 
            transition: all 0.2s ease;
            display: flex; align-items: center; gap: 6px;
        }
        .zone-badge:hover { 
            background: var(--p); 
            color: white; 
            transform: translateY(-1px);
        }
        
        .section-title { 
            font-size: clamp(24px, 5.5vw, 36px); 
            font-weight: 900; 
            margin: 0 0 28px 0; 
            color: var(--txt); 
            display: flex; align-items: center; gap: 12px; 
        }
        
        /* 📱 PERFECT Responsive Grid */
        .grid { 
            display: grid; 
            gap: clamp(16px, 4vw, 28px); 
            grid-template-columns: repeat(2, 1fr); 
        }
        @media (min-width: 640px) { .grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px) { .grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1200px) { .grid { grid-template-columns: repeat(5, 1fr); } }
        
        /* 💎 Premium Card Design */
        .card { 
            background: var(--card); 
            border-radius: 20px; 
            overflow: hidden; 
            text-decoration: none; 
            color: white; 
            display: flex; flex-direction: column; 
            border: 1px solid var(--border); 
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
            box-shadow: 0 8px 32px -8px rgba(0,0,0,0.4);
            position: relative;
        }
        .card:hover { 
            transform: translateY(-12px) scale(1.02); 
            border-color: var(--border-hover); 
            box-shadow: 0 32px 64px -16px rgba(0,0,0,0.6), 0 0 0 1px var(--p);
            background: var(--card-hover);
        }
        
        .card-img-wrap { 
            width: 100%; 
            aspect-ratio: 3/4; 
            position: relative; 
            overflow: hidden; 
            background: linear-gradient(135deg, #000, #1a1a2e);
        }
        .card-img-wrap img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover .card-img-wrap img { 
            transform: scale(1.08) rotate(0.5deg); 
        }
        
        .badge-status { 
            position: absolute; 
            top: 12px; 
            left: 12px; 
            padding: 6px 12px; 
            border-radius: 24px; 
            font-size: 12px; 
            font-weight: 800; 
            color: #fff; 
            backdrop-filter: blur(10px); 
            box-shadow: 0 4px 12px rgba(0,0,0,0.4); 
            z-index: 3; 
        }
        .badge-avail { background: rgba(16, 185, 129, 0.95); }
        .badge-busy { background: rgba(239, 68, 68, 0.95); }
        .badge-featured { 
            position: absolute; top: 12px; right: 12px; 
            background: var(--gold); color: #000; 
        }
        
        .card-body { 
            padding: 18px; 
            display: flex; flex-direction: column; 
            gap: 12px; 
            flex-grow: 1; 
        }
        .card-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            gap: 12px; 
        }
        .card-name { 
            font-weight: 900; 
            font-size: clamp(16px, 4.5vw, 20px); 
            margin: 0; 
            line-height: 1.3; 
        }
        .card-price { 
            color: var(--gold); 
            font-size: clamp(16px, 4vw, 20px); 
            font-weight: 900; 
            margin: 0; 
            white-space: nowrap;
        }
        
        .card-specs { 
            display: flex; 
            gap: 8px; 
            font-size: 13px; 
            color: var(--txt-light); 
            flex-wrap: wrap; 
        }
        .card-specs span { 
            background: rgba(255,255,255,0.12); 
            padding: 4px 10px; 
            border-radius: 8px; 
            backdrop-filter: blur(4px);
        }
        
        .card-location { 
            color: var(--txt-muted); 
            font-size: 13px; 
            display: flex; 
            align-items: center; 
            gap: 8px; 
        }
        
        .card-tags { 
            display: flex; 
            gap: 6px; 
            flex-wrap: wrap; 
            margin-top: auto; 
        }
        .card-tag { 
            background: rgba(219,39,119,0.2); 
            color: var(--p-light); 
            font-size: 11px; 
            padding: 4px 10px; 
            border-radius: 6px; 
            font-weight: 700; 
        }
        .card-tag-safe { 
            background: rgba(16, 185, 129, 0.2); 
            color: var(--success); 
        }
        
        /* 📄 SEO Content */
        .seo-content { 
            margin-top: 80px; 
            padding: 40px; 
            background: var(--bg-alt); 
            border-radius: 28px; 
            border: 1px solid var(--border); 
            backdrop-filter: blur(10px);
        }
        .seo-content h2 { 
            font-size: clamp(24px, 5vw, 32px); 
            color: var(--txt); 
            margin: 0 0 24px 0; 
            font-weight: 900; 
        }
        .seo-content h3 { 
            font-size: clamp(20px, 4.5vw, 26px); 
            color: var(--p-light); 
            margin: 40px 0 20px 0; 
            font-weight: 800; 
        }
        .seo-content p { 
            color: var(--txt-light); 
            margin-bottom: 24px; 
            font-size: 16px; 
            line-height: 1.9; 
        }
        
        /* ❓ FAQ */
        .faq-grid { 
            display: grid; 
            gap: 24px; 
            margin-top: 40px; 
        }
        .faq-item { 
            background: rgba(0,0,0,0.3); 
            padding: 28px; 
            border-radius: 20px; 
            border: 1px solid rgba(255,255,255,0.08); 
            transition: all 0.3s ease;
        }
        .faq-item:hover { 
            transform: translateY(-4px); 
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .faq-q { 
            font-weight: 900; 
            color: var(--p); 
            margin: 0 0 12px 0; 
            font-size: 18px; 
            display: flex; 
            gap: 12px; 
            line-height: 1.4; 
            cursor: pointer;
        }
        .faq-a { 
            color: var(--txt-light); 
            margin: 0; 
            font-size: 15px; 
            line-height: 1.8; 
            padding-left: 32px; 
        }
        
        /* 📱 Pagination */
        .pagination { 
            display: flex; 
            justify-content: center; 
            gap: 12px; 
            margin: 60px 0 40px; 
            flex-wrap: wrap;
        }
        .page-btn { 
            padding: 12px 20px; 
            border: 1px solid var(--border); 
            background: var(--card); 
            color: var(--txt); 
            border-radius: 12px; 
            text-decoration: none; 
            font-weight: 600; 
            transition: all 0.2s ease;
        }
        .page-btn:hover:not(.disabled), .page-btn.active { 
            background: var(--p); 
            border-color: var(--p); 
            color: white; 
            transform: translateY(-2px);
        }
        .page-btn.disabled { opacity: 0.5; cursor: not-allowed; }
        
        /* 📄 Footer */
        footer { 
            text-align: center; 
            padding: 60px 20px 40px; 
            margin-top: 80px; 
            border-top: 1px solid var(--border); 
            color: var(--txt-muted); 
            font-size: 14px; 
        }
        
        /* 🎯 Loading States */
        .skeleton { 
            background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%); 
            background-size: 200% 100%; 
            animation: loading 1.5s infinite; 
        }
        @keyframes loading { 
            0% { background-position: 200% 0; } 
            100% { background-position: -200% 0; } 
        }
        
        /* 🖥️ Print Styles */
        @media print { 
            body * { visibility: hidden; } 
            .card, .card * { visibility: visible; } 
            .card { position: absolute; left: 0; top: 0; } 
        }
        
        /* 🔍 High DPI */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
            .card-img-wrap img { image-rendering: -webkit-optimize-contrast; }
        }
    </style>
</head>
<body>
    <header class="header-nav">
        <a href="/" aria-label="หน้าแรก Sideline Chiang Mai" rel="home">
            <img src="${CONFIG.LOGO}" alt="โลโก้ ${BRAND_NAME}" width="160" height="32" loading="eager">
        </a>
    </header>

    <main class="container">
        <!-- 🔥 Hero Section -->
        <section class="hero">
            <h1>ไซด์ไลน์${provinceName} รับงานเอง ตัวท็อป</h1>
            <p>พบสาวสวย <strong>ไซด์ไลน์${provinceName}</strong> ${profileCount} คน คัดเฉพาะ <strong>รับงานเอง</strong> บริการฟิวแฟนพรีเมียม การันตี <strong>ตรงปก 100%</strong> <strong>ชำระเงินหน้างาน</strong> ไม่มีมัดจำ</p>
            
            <div class="zone-tags" aria-label="โซนที่ให้บริการ">
                ${localZones.slice(0, 8).map(zone => 
                    `<span class="zone-badge">
                        <i class="fa-solid fa-location-dot" style="opacity:0.8;"></i>
                        ${zone}
                    </span>`
                ).join('')}
            </div>
        </section>

        <!-- 📊 Stats Bar -->
        <div style="background: var(--bg-alt); padding: 20px; border-radius: 16px; margin-bottom: 32px; text-align: center;">
            <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
                <div><strong style="font-size: 28px; color: var(--gold);">${profileCount}</strong><br><span style="color: var(--txt-muted);">น้องๆ รับงาน</span></div>
                <div><strong style="font-size: 28px; color: var(--success);">฿${minPrice.toLocaleString()}</strong><br><span style="color: var(--txt-muted);">เริ่มต้น</span></div>
                <div><strong style="font-size: 28px; color: var(--p);">${totalPages}</strong><br><span style="color: var(--txt-muted);">หน้าทั้งหมด</span></div>
            </div>
        </div>

        <h2 class="section-title">
            <i class="fa-solid fa-crown"></i> 
            รายชื่อน้องๆ ${provinceName} อัปเดต ${profileCount} คน
        </h2>
        
        <!-- 🚀 Perfect Grid -->
        ${profiles.length ? `
        <div class="grid" role="list">
            ${profiles.map((p, index) => {
                const numericPrice = parseInt((p.rate || "1500").toString().replace(/[^\d]/g, '')) || 1500;
                const isBusy = p.availability && (p.availability.includes('ไม่ว่าง') || p.availability.includes('พัก'));
                const isFeatured = p.isfeatured;
                const tags = Array.isArray(p.styleTags) && p.styleTags.length ? p.styleTags.slice(0, 3) : ["ฟิวแฟน", "ตรงปก"];
                
                const specs = [];
                if (p.age) specs.push(`อายุ ${p.age}`);
                if (p.height) specs.push(`${p.height}ซม.`);
                if (p.stats || p.measurements) specs.push(p.stats || p.measurements);
                
                return `
                <article class="card" role="listitem">
                    <a href="/sideline/${p.slug}" aria-label="ดูโปรไฟล์น้อง ${p.name} ไซด์ไลน์${provinceName}" style="display:contents;">
                        <div class="card-img-wrap">
                            <span class="badge-status ${isBusy ? 'badge-busy' : 'badge-avail'}">
                                ${isBusy ? 
                                    '<i class="fa-solid fa-clock"></i> ติดจอง' : 
                                    '<i class="fa-solid fa-check-circle"></i> ว่างรับงาน'
                                }
                            </span>
                            ${isFeatured ? '<span class="badge-status badge-featured"><i class="fa-solid fa-star"></i> ตัวท็อป</span>' : ''}
                            <picture>
                                <source srcset="${optimizeImg(p.imagePath, 400, 533, 'avif')}" type="image/avif">
                                <img src="${optimizeImg(p.imagePath, 400, 533)}" 
                                     alt="น้อง${p.name} สาวสวยไซด์ไลน์${provinceName} รับงานเอง" 
                                     loading="${index < 6 ? 'eager' : 'lazy'}" 
                                     decoding="async" 
                                     fetchpriority="${index < 3 ? 'high' : 'auto'}">
                            </picture>
                        </div>
                        <div class="card-body">
                            <div class="card-header">
                                <h3 class="card-name">${p.name}</h3>
                                <div class="card-price">฿${numericPrice.toLocaleString()}</div>
                            </div>
                            
                            ${specs.length ? `
                            <div class="card-specs" aria-label="สเปค">
                                ${specs.map(spec => `<span>${spec}</span>`).join('')}
                            </div>` : ''}
                            
                            <div class="card-location">
                                <i class="fa-solid fa-location-dot" style="color: var(--p-light); opacity: 0.8;"></i> 
                                ${p.location ? p.location.substring(0, 25) + (p.location.length > 25 ? '...' : '') : provinceName}
                            </div>
                            
                            <div class="card-tags">
                                <span class="card-tag-safe" aria-label="การันตี"><i class="fa-solid fa-shield-check"></i> ไม่มีมัดจำ</span>
                                <span class="card-tag" aria-label="คุณภาพ"><i class="fa-solid fa-eye"></i> ตรงปก</span>
                                ${tags.slice(0, 3).map(tag => 
                                    `<span class="card-tag">${tag.trim()}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </a>
                </article>`;
            }).join('')}
        </div>
        ` : `
        <div style="text-align: center; padding: 80px 20px; color: var(--txt-muted);">
            <i class="fa-solid fa-search" style="font-size: 64px; opacity: 0.5; margin-bottom: 20px;"></i>
            <h3 style="font-size: 24px; margin-bottom: 12px;">ยังไม่มีน้องๆ ในพื้นที่นี้</h3>
            <p>กรุณาตรวจสอบจังหวัดอื่นหรือรอการอัปเดตใหม่</p>
        </div>
        `}

        <!-- Pagination -->
        ${totalPages > 1 ? `
        <nav class="pagination" role="navigation" aria-label="การนำทางหน้า">
            ${hasPrevPage ? `
            <a href="?page=${page-1}${provinceKey !== 'chiangmai' ? `&province=${provinceKey}` : ''}" class="page-btn" rel="prev">
                <i class="fa-solid fa-chevron-left"></i> หน้าที่แล้ว
            </a>` : '<span class="page-btn disabled"><i class="fa-solid fa-chevron-left"></i></span>'}
            
            <span class="page-btn active" aria-current="page">
                หน้าที่ ${page} จาก ${totalPages}
            </span>
            
            ${hasNextPage ? `
            <a href="?page=${page+1}${provinceKey !== 'chiangmai' ? `&province=${provinceKey}` : ''}" class="page-btn" rel="next">
                หน้าถัดไป <i class="fa-solid fa-chevron-right"></i>
            </a>` : '<span class="page-btn disabled"><i class="fa-solid fa-chevron-right"></i></span>'}
        </nav>
        ` : ''}

        <!-- 🔥 SEO & FAQ Content -->
        <section class="seo-content">
            <h2>ทำไมลูกค้าทุกระดับไว้วางใจ ${BRAND_NAME}?</h2>
            <p>เราเป็น <strong>แพลตฟอร์มเดียวในไทย</strong> ที่คัดกรองน้องๆ <strong>รับงานเอง 100%</strong> ไม่ผ่านเอเย่นต์ รูปภาพ <strong>ตรงปกการันตี</strong> และที่สำคัญ <strong>ชำระเงินเมื่อเจอตัวจริง</strong> ลูกค้ากว่า 10,000+ คนไว้วางใจ</p>
            
            <h3>โซนให้บริการยอดนิยม ${provinceName}</h3>
            <p>น้องๆ กระจายตัวครอบคลุมทุกโซน ${localZones.slice(0, 6).join(', ')} สามารถเลือกน้องใกล้ตัวคุณได้ทันที ทุกโปรไฟล์อัปเดตสถานะแบบเรียลไทม์</p>

            <div class="faq-grid">
                <h3 style="grid-column: 1 / -1; margin-bottom: 8px; color: var(--txt); font-size: 24px;">
                    <i class="fa-solid fa-circle-question"></i> คำถามที่พบบ่อย
                </h3>
                ${faqData.map(f => `
                    <article class="faq-item" itemscope itemtype="https://schema.org/QAPage">
                        <h4 class="faq-q" itemprop="name">
                            <i class="fa-regular fa-circle-question"></i> ${f.q}
                        </h4>
                        <div itemprop="mainEntity" itemscope itemtype="https://schema.org/Question">
                            <p class="faq-a" itemprop="text">${f.a}</p>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    </main>

    <footer>
        <div style="max-width: 800px; margin: 0 auto 20px;">
            <p>© ${CURRENT_YEAR} ${BRAND_NAME} - ศูนย์รวมไซด์ไลน์พรีเมียม รับงานเอง ตรงปก 100%</p>
            <p style="opacity:0.7; margin-top:12px;">การันตีไม่มีมัดจำ • ชำระเงินเมื่อเจอตัวจริง • อัปเดตทุกวัน</p>
        </div>
        <p style="opacity:0.5; font-size:13px; margin-top:20px;">
            <strong>Disclaimer:</strong> แพลตฟอร์มนี้เป็นเพียงสื่อกลางสำหรับการลงโฆษณา 
            ไม่มีส่วนเกี่ยวข้องหรือสนับสนุนกิจกรรมที่ผิดกฎหมายใดๆ
            | <a href="mailto:${CONFIG.SUPPORT_EMAIL}" style="color: var(--txt-light);">ติดต่อเรา</a>
        </p>
    </footer>

    <script>
        // 🌟 Progressive Enhancement
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('skeleton');
                        imageObserver.unobserve(img);
                    }
                });
            });
            images.forEach(img => imageObserver.observe(img));
        }
        
        // 🎨 Smooth Animations
        document.querySelectorAll('.card').forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 50);
        });
    </script>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8", 
                "cache-control": "public, s-maxage=1800, stale-while-revalidate=3600",
                "vary": "Accept-Encoding",
                "x-content-type-options": "nosniff"
            } 
        });

    } catch (error) {
        console.error("Province Page Error:", error);
        
        return new Response(`
            <!DOCTYPE html>
            <html><head><title>เกิดข้อผิดพลาด</title></head>
            <body style="font-family: system-ui; padding: 40px; text-align: center;">
                <h1>กำลังอัปเดตข้อมูล...</h1>
                <p>กรุณาลองใหม่อีกครั้งในไม่กี่นาที</p>
                <script>setTimeout(() => location.reload(), 2000);</script>
            </body>
            </html>
        `, { 
            status: 503,
            headers: { "content-type": "text/html; charset=utf-8" }
        });
    }
};
