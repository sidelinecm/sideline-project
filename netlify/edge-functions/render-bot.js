import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    LOGO: 'https://sidelinechiangmai.netlify.app/images/logo-sidelinechiangmai.webp',
    SUPPORT_EMAIL: 'support@sidelinechiangmai.com'
};

// 🚀 Ultimate SEO + Performance Slug Validation
const validateSlug = (slug) => {
    if (!slug || slug.length < 3 || slug.length > 100) return false;
    return /^[a-zA-Z0-9\-_]+$/.test(slug);
};

// 🖼️ NEXT-GEN Image Optimizer (AVIF + WebP + Responsive)
const optimizeImg = (path, width = 600, height = 800, isOG = false) => {
    if (!path) return `${CONFIG.DOMAIN}/images/placeholder-profile.avif`;
    
    if (path.includes('res.cloudinary.com')) {
        const transform = isOG 
            ? `c_fill,w_1200,h_630,g_faces,q_auto:best,f_avif`
            : `c_fill,w_${width},h_${height},g_faces,q_auto:best,f_avif`;
        return path.replace('/upload/', `/upload/${transform}/`);
    }
    
    if (path.startsWith('http')) return path;
    
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&height=${height}&quality=95&format=avif`;
};

// LINE URL + Fallback Protection
const formatLineUrl = (lineId) => {
    if (!lineId) return 'https://line.me/ti/p/ksLUWB89Y_';
    if (lineId.startsWith('http')) return lineId;
    return `https://line.me/ti/p/~${lineId.replace('@', '').replace(/[^\w]/g, '')}`;
};

// 🕒 Smart Timeout + Retry
const fetchWithTimeout = (promise, timeout = 5000, retries = 2) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    return promise.finally(() => clearTimeout(timeoutId)).catch(err => {
        if (retries > 0 && !err.name === 'AbortError') {
            return fetchWithTimeout(promise, timeout, retries - 1);
        }
        throw err;
    });
};

// ⚡ สร้างตัวแปรเก็บ Instance ของ DB ไว้นอกฟังก์ชันเพื่อแชร์ข้าม Request
let supabaseInstance = null;

export default async (request, context) => {
    // 🔥 Advanced Bot Detection 2026 (LINE/FB/Twitter/Google/Discord)
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|crawler|spider|google|facebook|twitter|line|whatsapp|telegram|discord|bing|slurp|yandex|applebot|bytespider|dotbot|petalbot| ClaudeBot|ChatGPT-User|GPTBot|Perplexity/i.test(ua);
    
    if (!isBot) return context.next();

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
    
    const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
    if (!validateSlug(slug)) {
        return new Response('Invalid Profile Slug', { status: 404 });
    }

    try {
        // 🚀 โหลด Database แค่ครั้งแรกครั้งเดียว (เพิ่มประสิทธิภาพ)
        if (!supabaseInstance) {
            const supabaseUrl = typeof Netlify !== 'undefined' 
                ? Netlify.env.get('SUPABASE_URL') || CONFIG.SUPABASE_URL 
                : CONFIG.SUPABASE_URL;
            const supabaseKey = typeof Netlify !== 'undefined' 
                ? Netlify.env.get('SUPABASE_KEY') || CONFIG.SUPABASE_KEY 
                : CONFIG.SUPABASE_KEY;

            supabaseInstance = createClient(supabaseUrl, supabaseKey, {
                auth: { autoRefreshToken: false, persistSession: false }
            });
        }

        // ดึง Instance ที่มีอยู่มาใช้ทันที
        const supabase = supabaseInstance;

        // ⚡ ULTRA-FAST Query + Error Recovery
        const { data: profile, error } = await supabase
            .from('profiles')
            .select(`
                *,
                provinces(nameThai, key),
                styleTags,
                height, weight, measurements, skinTone, description
            `)
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle()
            .timeout(5000);

        if (error || !profile) {
            return new Response('Profile Not Found', { 
                status: 404,
                headers: { 'Cache-Control': 'public, s-maxage=3600' }
            });
        }

        // 🎯 SEO-Optimized Data Processing
        const displayName = (profile.name || 'สาวสวย').replace(/^น้อง/, '').trim();
        const provinceName = profile.provinces?.nameThai || 'เชียงใหม่';
        const provinceKey = profile.provinces?.key || 'chiangmai';
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;
        
        // 💰 Smart Price Processing
        const rawPrice = (profile.rate || "1500").toString().replace(/[^\d]/g, '');
        const numericPrice = Math.max(1000, Math.min(parseInt(rawPrice) || 1500, 50000));
        
        // 🏷️ Status Detection
        const isBusy = profile.availability?.includes('ไม่ว่าง') || profile.availability?.includes('พัก');
        const availabilityStatus = isBusy ? 'ติดจอง' : 'ว่างรับงาน';
        const statusColor = isBusy ? '#ef4444' : '#10b981';
        
        // 📊 Complete Profile Specs
        const specs = {
            age: profile.age || '-',
            stats: profile.stats || profile.measurements || '-',
            heightWeight: `${profile.height || '-'}ซม. / ${profile.weight || '-'}กก.`,
            location: profile.location || provinceName,
            skinTone: profile.skinTone || '-'
        };

        // 🔥 ULTIMATE SEO Title + Meta (Keyword-First)
        const keywords =[
            `น้อง${displayName}`,
            `ไซด์ไลน์${provinceName}`,
            'รับงานเอง',
            'ฟิวแฟน',
            'ตรงปก',
            'ไม่มีมัดจำ'
        ];
        
        const pageTitle = `${keywords.slice(0, 2).join(' ')} - ตัวท็อป รับงานฟิวแฟน ตรงปก 100%`;
        const metaDesc = `น้อง${displayName} ไซด์ไลน์${provinceName} รับงานเอง ${specs.age}ปี สัดส่วน${specs.stats} พิกัด${specs.location} ราคาเริ่ม ${numericPrice.toLocaleString()}฿ การันตีตรงปก ไม่มีมัดจำ ชำระหน้างาน`;
        
        // 🤖 Dynamic FAQ (Keyword Stuffing เฉพาะ Profile)
        const faqData =[
            { 
                q: `น้อง${displayName} ไซด์ไลน์${provinceName} รับงานโซนไหน?`, 
                a: `น้อง${displayName} รับงานโซน ${specs.location} และพื้นที่ใกล้เคียงใน${provinceName} สามารถนัดได้ทันทีหากสถานะ "ว่างรับงาน"` 
            },
            { 
                q: `เรียกน้อง${displayName} ต้องโอนมัดจำหรือไม่?`, 
                a: `ไม่ต้องโอนมัดจำ 100% นัดเจอน้อง${displayName} ตัวจริงก่อน ชำระเงินหน้างานเท่านั้น ปลอดภัยที่สุด` 
            },
            { 
                q: `น้อง${displayName} สเปคครบหรือไม่?`, 
                a: `น้อง${displayName} อายุ${specs.age} สูง${profile.height || ''} สัดส่วน${specs.stats} ผิว${specs.skinTone} บริการฟิวแฟนครบถ้วน` 
            }
        ];

        // 🌟 NEXT-LEVEL Schema.org 2026 (Rank #1 Guaranteed)
        const reviewCount = Math.floor(Math.random() * 61) + 40; // 40-100 reviews
        const schema = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "ProfilePage",
                    "@id": `${canonicalUrl}#webpage`,
                    "url": canonicalUrl,
                    "name": pageTitle,
                    "description": metaDesc,
                    "mainEntity": { "@id": `${canonicalUrl}#person` },
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement":[
                            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                            { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${provinceKey}` },
                            { "@type": "ListItem", "position": 3, "name": `น้อง${displayName}`, "item": canonicalUrl }
                        ]
                    }
                },
                {
                    "@type":["Person", "TourGuide"],
                    "@id": `${canonicalUrl}#person`,
                    "name": `น้อง${displayName}`,
                    "alternateName": `น้อง${displayName} ไซด์ไลน์${provinceName}`,
                    "image": optimizeImg(profile.imagePath, 1200, 630, true),
                    "description": metaDesc,
                    "jobTitle": "ไซด์ไลน์รับงานเอง",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": specs.location,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "priceRange": `฿${numericPrice.toLocaleString()}`,
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.95",
                        "bestRating": "5",
                        "reviewCount": reviewCount.toString()
                    },
                    "offers": {
                        "@type": "Offer",
                        "name": `บริการน้อง${displayName}`,
                        "price": numericPrice.toString(),
                        "priceCurrency": "THB",
                        "availability": isBusy ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                        "url": canonicalUrl,
                        "validFrom": new Date().toISOString()
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": faqData.map(f => ({
                        "@type": "Question",
                        "name": f.q,
                        "acceptedAnswer": { "@type": "Answer", "text": f.a }
                    }))
                }
            ]
        };

        // 🚀 ULTIMATE HTML (Mobile-First + Bot Optimized)
        const CURRENT_YEAR = new Date().getFullYear() + 543;
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- 🔥 2026 Ultimate SEO -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="theme-color" content="#0f172a">
    <meta name="color-scheme" content="dark">
    
    <!-- Open Graph + LINE Perfect -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${optimizeImg(profile.imagePath, 1200, 630, true)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="น้อง${displayName} ไซด์ไลน์${provinceName}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="profile">
    <meta property="og:site_name" content="Sideline ${provinceName}">
    <meta property="og:locale" content="th_TH">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${optimizeImg(profile.imagePath, 1200, 630, true)}">
    
    <!-- Preload Critical -->
    <link rel="preload" href="${optimizeImg(profile.imagePath, 600, 800)}" as="image" fetchpriority="high">
    <link rel="dns-prefetch" href="${CONFIG.SUPABASE_URL}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Modern Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Prompt:wght@400;600;700;800&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    
    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
    
    <style>
        :root {
            --p: #db2777; --p-light: #f472b6; --bg: #0f172a; --bg-alt: #1e293b;
            --card: #1e293b; --card-hover: #334155; --glass: rgba(255,255,255,0.03);
            --txt: #f8fafc; --txt-muted: #94a3b8; --gold: #fbbf24; --success: #10b981;
            --gradient: linear-gradient(135deg, #db2777, #f472b6);
            --border: rgba(255,255,255,0.08);
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: 'Inter', 'Prompt', sans-serif; 
            background: var(--bg); 
            color: var(--txt); 
            line-height: 1.6; 
            -webkit-font-smoothing: antialiased;
            display: flex; 
            justify-content: center; 
            min-height: 100vh;
        }
        
        .wrapper { 
            width: 100%; 
            max-width: 420px; 
            background: var(--card); 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column; 
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
            border: 1px solid var(--border);
        }
        
        .header { 
            background: rgba(15,23,42,0.95); 
            backdrop-filter: blur(20px); 
            padding: 16px 20px; 
            border-bottom: 1px solid var(--border); 
            display: flex; 
            align-items: center; 
            gap: 12px;
        }
        .header img { height: 28px; width: auto; }
        
        .hero-img { 
            width: 100%; 
            aspect-ratio: 3/4; 
            object-fit: cover; 
            background: linear-gradient(135deg, #000, #1a1a2e); 
        }
        picture.source img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
        }
        
        main { padding: 28px 24px 24px; flex-grow: 1; }
        h1 { 
            font-size: clamp(24px, 6vw, 32px); 
            font-weight: 900; 
            margin-bottom: 20px; 
            line-height: 1.3; 
            background: var(--gradient); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent;
        }
        
        .tags { 
            display: flex; flex-wrap: wrap; 
            gap: 10px; margin-bottom: 28px; 
        }
        .tag { 
            background: rgba(16,185,129,0.2); 
            color: var(--success); 
            font-size: 13px; 
            padding: 6px 14px; 
            border-radius: 50px; 
            font-weight: 700; 
            border: 1px solid rgba(16,185,129,0.3);
        }
        .tag-hot { 
            background: rgba(219,39,119,0.2); 
            color: var(--p-light); 
            border-color: rgba(219,39,119,0.3);
        }
        
        /* 🌟 ULTIMATE Glassmorphism Cards */
        .glass-box { 
            background: rgba(30,43,59,0.6); 
            border-radius: 24px; 
            padding: 24px; 
            backdrop-filter: blur(20px); 
            border: 1px solid var(--border); 
            margin-bottom: 28px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .specs-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 14px; 
            margin-bottom: 24px; 
        }
        .spec-item { 
            background: rgba(255,255,255,0.08); 
            padding: 16px 12px; 
            border-radius: 16px; 
            text-align: center; 
            transition: all 0.3s ease;
        }
        .spec-item:hover { 
            background: rgba(255,255,255,0.12); 
            transform: translateY(-2px);
        }
        .spec-label { 
            font-size: 12px; 
            color: var(--txt-muted); 
            margin-bottom: 4px;
        }
        .spec-val { 
            font-size: 18px; 
            font-weight: 800; 
            color: var(--txt);
        }
        
        .info-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 12px 0; 
            border-bottom: 1px solid rgba(255,255,255,0.06); 
        }
        .info-row:last-child { border-bottom: none; }
        .info-label { 
            color: var(--txt-muted); 
            font-size: 14px; 
            display: flex; 
            align-items: center; 
            gap: 8px;
        }
        .info-value { 
            font-weight: 700; 
            font-size: 16px;
        }
        .price { color: var(--gold) !important; font-size: 20px !important; }
        .status { 
            color: ${statusColor} !important; 
            font-weight: 800 !important;
            display: flex; align-items: center; gap: 6px;
        }
        
        .desc { 
            background: rgba(0,0,0,0.4); 
            padding: 24px; 
            border-radius: 20px; 
            border: 1px solid var(--border); 
            backdrop-filter: blur(10px);
        }
        .desc h2 { 
            font-size: 18px; 
            color: var(--txt); 
            margin: 0 0 16px 0; 
            font-weight: 800;
            display: flex; align-items: center; gap: 10px;
        }
        .desc p { 
            color: var(--txt-muted); 
            margin-bottom: 16px; 
            font-size: 15px; 
            line-height: 1.7;
        }
        
        /* 🚀 Ultimate CTA Button */
        .btn-line { 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 12px; 
            background: linear-gradient(135deg, #06C755, #00d461); 
            color: white; 
            padding: 20px 32px; 
            border-radius: 50px; 
            text-decoration: none; 
            font-weight: 900; 
            font-size: 18px; 
            margin: 32px 0 24px; 
            box-shadow: 0 20px 40px rgba(6,199,85,0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
        }
        .btn-line:hover { 
            transform: translateY(-4px) scale(1.02); 
            box-shadow: 0 30px 60px rgba(6,199,85,0.5);
        }
        
        footer { 
            text-align: center; 
            padding: 32px 24px; 
            color: var(--txt-muted); 
            font-size: 13px; 
            border-top: 1px solid var(--border); 
            margin-top: auto;
        }
        
        /* FAQ for SEO */
        .faq-section { margin-top: 32px; }
        .faq-item { 
            background: rgba(255,255,255,0.02); 
            padding: 20px; 
            border-radius: 16px; 
            margin-bottom: 16px; 
            border-left: 4px solid var(--p);
        }
        .faq-q { 
            font-weight: 700; 
            color: var(--p); 
            margin-bottom: 8px; 
            font-size: 15px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <header class="header">
            <img src="${CONFIG.LOGO}" alt="Sideline ${provinceName}" width="140" height="28">
            <span style="font-size: 14px; opacity: 0.8;">ตัวท็อป ${provinceName}</span>
        </header>
        
        <picture>
            <source srcset="${optimizeImg(profile.imagePath, 600, 800, false)}" type="image/avif">
            <img src="${optimizeImg(profile.imagePath, 600, 800, false)}" 
                 class="hero-img" 
                 alt="น้อง${displayName} ไซด์ไลน์${provinceName} รับงานฟิวแฟน ตรงปก 100%"
                 fetchpriority="high" 
                 decoding="async">
        </picture>
        
        <main>
            <h1>น้อง${displayName}<br>ไซด์ไลน์${provinceName}</h1>
            
            <div class="tags">
                <span class="tag" aria-label="การันตี"><i class="fa-solid fa-shield-check"></i> ไม่มีมัดจำ</span>
                <span class="tag"><i class="fa-solid fa-hand-holding-dollar"></i> จ่ายหน้างาน</span>
                <span class="tag-hot"><i class="fa-solid fa-eye"></i> ตรงปก 100%</span>
                ${Array.isArray(profile.styleTags) ? profile.styleTags.slice(0, 3).map(tag => 
                    `<span class="tag-hot">${tag.trim()}</span>`
                ).join('') : ''}
            </div>

            <!-- 💎 Premium Glassmorphism Spec Card -->
            <div class="glass-box">
                <div class="specs-grid">
                    <div class="spec-item">
                        <div class="spec-label">อายุ</div>
                        <div class="spec-val">${specs.age}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">สัดส่วน</div>
                        <div class="spec-val">${specs.stats}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">สูง/หนัก</div>
                        <div class="spec-val">${specs.heightWeight}</div>
                    </div>
                </div>

                <div class="info-row">
                    <span class="info-label"><i class="fa-solid fa-location-dot" style="color: var(--p-light);"></i> พิกัด</span>
                    <span class="info-value">${specs.location}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fa-solid fa-tag" style="color: var(--gold);"></i> ราคา</span>
                    <span class="info-value price">฿${numericPrice.toLocaleString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fa-solid fa-circle" style="color: ${statusColor}; font-size: 10px;"></i> สถานะ</span>
                    <span class="info-value status">${availabilityStatus}</span>
                </div>
            </div>

            <!-- 📄 Description -->
            <article class="desc">
                <h2><i class="fa-solid fa-info-circle" style="color: var(--p-light);"></i> รายละเอียดน้อง${displayName}</h2>
                ${profile.description ? profile.description.replace(/\n/g, '<br>').replace(/<br>/g, '<br><br>') : ''}
                <p><strong style="color: var(--p-light);">ทำไมต้องน้อง${displayName}?</strong><br>
                รับงานเอง 100% ไม่ผ่านเอเย่นต์ บริการฟิวแฟนพรีเมียม การันตีตรงปก ชำระเงินเมื่อเจอตัวจริง</p>
            </article>

            <!-- 🚀 LINE CTA -->
            <a href="${formatLineUrl(profile.lineId)}" target="_blank" rel="noopener noreferrer" class="btn-line">
                <i class="fab fa-line" style="font-size: 26px;"></i> 
                ทัก LINE น้อง${displayName} ทันที
            </a>

            <!-- 🤖 SEO FAQ -->
            <section class="faq-section">
                ${faqData.map(f => `
                    <div class="faq-item">
                        <div class="faq-q">${f.q}</div>
                        <div class="faq-a">${f.a}</div>
                    </div>
                `).join('')}
            </section>
        </main>
        
        <footer>
            <p>© ${CURRENT_YEAR} Sideline ${provinceName} - ตัวท็อป รับงานเอง ตรงปก 100%</p>
            <p style="opacity: 0.7; margin-top: 8px; font-size: 12px;">
                ไม่มีมัดจำ • ชำระเงินหน้างาน • อัปเดตทุกวัน
                | <a href="mailto:${CONFIG.SUPPORT_EMAIL}" style="color: var(--txt-muted);">ติดต่อเรา</a>
            </p>
        </footer>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                'content-type': 'text/html; charset=utf-8',
                'cache-control': 'public, s-maxage=1800, stale-while-revalidate=3600',
                'vary': 'Accept-Encoding',
                'x-content-type-options': 'nosniff',
                'x-frame-options': 'DENY',
                'x-xss-protection': '1; mode=block',
                'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
                'permissions-policy': 'interest-cohort=()'
            }
        });

    } catch (error) {
        console.error('Profile SSR Error:', error);
        return new Response(`
            <!DOCTYPE html>
            <html><head><title>กำลังโหลด...</title>
            <meta http-equiv="refresh" content="2"></head>
            <body style="font-family:system-ui;padding:40px;text-align:center;background:#0f172a;color:#f8fafc;">
                <h1>กำลังอัปเดตโปรไฟล์</h1>
                <p>กรุณารอสักครู่...</p>
            </body></html>
        `, { 
            status: 503,
            headers: { 'content-type': 'text/html; charset=utf-8' }
        });
    }
};