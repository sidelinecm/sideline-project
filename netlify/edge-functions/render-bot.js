import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION & FULL DIGITAL FOOTPRINT
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIJWTJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8', // ใช้ Key ของคุณ
    DOMAIN: 'https://sidelinechiangmai.netlify.app', // แก้เป็น Domain ของคุณ
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://bsky.app/profile/sidelinechiangmai.bsky.social",
        "https://www.linkedin.com/in/cuteti-sexythailand-398567280",
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

// ฟังก์ชันสุ่มคำ (Spintax) เพื่อไม่ให้ Description ซ้ำกัน
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const clientIP = request.headers.get('x-nf-client-connection-ip') || '';
    
    // ==========================================
    // 2. LAYER 1-3 SECURITY (CLOAKING) & PERFORMANCE
    // ==========================================
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    const geo = context.geo || {};
    const isSuspicious = !geo.city || geo.country?.code !== 'TH';

    let isDataCenter = false;
    if (clientIP && clientIP !== '127.0.0.1' && (isBot || isSuspicious)) {
        try {
            // --- 🚀 PERFORMANCE UPGRADE: เพิ่ม Timeout 1 วินาทีให้ API ภายนอก ---
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000); // 1-second timeout

            const ipCheck = await fetch(`http://ip-api.com/json/${clientIP}?fields=hosting`, {
                signal: controller.signal 
            });
            clearTimeout(timeoutId);

            const ipData = await ipCheck.json();
            isDataCenter = ipData.hosting === true;
        } catch (e) { 
            console.error("IP API Check failed or timed out:", e.name);
            isDataCenter = false; // ถ้าล่มหรือช้า ให้ทำงานต่อโดยไม่บล็อก
        }
    }

    // [ACTION] คนไทยตัวจริง -> ไปหน้าเว็บหลัก (Client-side)
    if (!isBot && !isSuspicious && !isDataCenter) return context.next();

    // ==========================================
    // 3. FULL SERVER-SIDE RENDERING (SSR)
    // ==========================================
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // --- ดึงข้อมูลโปรไฟล์หลัก ---
        const { data: p } = await supabase.from('profiles').select('*, provinces(*)').eq('slug', slug).maybeSingle();
        if (!p) return context.next();

        // --- 🧠 SMART INTERNAL LINKING: ดึงโปรไฟล์แนะนำที่ฉลาดขึ้น ---
        // ลองหาจาก Tag ที่คล้ายกันก่อน, ถ้าไม่มี ให้หาจากจังหวัดเดียวกัน
        let relatedProfiles = [];
        const { data: relatedByTag } = await supabase
            .from('profiles')
            .select('slug, name, imagePath, location')
            .contains('tags', p.tags || ['_']) // ค้นหาโปรไฟล์ที่มี tag คล้ายกัน
            .eq('province_id', p.province_id)
            .neq('id', p.id)
            .eq('status', 'active')
            .limit(4);

        if (relatedByTag && relatedByTag.length > 0) {
            relatedProfiles = relatedByTag;
        } else {
            // Fallback: หากไม่มี Tag ที่ตรงกัน ให้หาจากจังหวัดเดียวกัน
            const { data: relatedByProvince } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('province_id', p.province_id)
                .neq('id', p.id)
                .eq('status', 'active')
                .limit(4);
            relatedProfiles = relatedByProvince || [];
        }


        // --- 🛠️ SMART FIX: จัดการข้อมูลให้ฉลาด ---
        const rawName = p.name || 'สาวสวย';
        const displayName = rawName.startsWith('น้อง') ? rawName : `น้อง${rawName}`;
        const rawPriceValue = (p.rate || "1500").toString().replace(/[^0-9]/g, '');
        const displayPrice = parseInt(rawPriceValue).toLocaleString() + ".-";
        let imageUrl = `${CONFIG.DOMAIN}/images/default.webp`;
        if (p.imagePath) {
             imageUrl = p.imagePath.startsWith('http') 
                ? p.imagePath 
                : `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}?width=800&quality=80&format=webp`;
        }
        let finalLineUrl = p.lineId || 'ksLUMz3p_o';
        if (!finalLineUrl.startsWith('http')) finalLineUrl = `https://line.me/ti/p/${finalLineUrl}`;
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        
        // คำนวณ Rating & Review
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        // --- 🔥 DEEPER CONTENT: สร้างเนื้อหาและ Description แบบไดนามิก ---
        const titleIntro = spin(["แนะนำ", "รีวิว", "พบกับ", "มาแรง", "ห้ามพลาด"]);
        const descIntro = spin(["โปรไฟล์", "รายละเอียด", "ข้อมูล"]);
        const serviceWord = spin(["บริการฟิวแฟน", "เอาใจเก่ง", "งานดีตรงปก", "เป็นกันเอง"]);
        const payWord = spin(["ไม่รับมัดจำ", "จ่ายหน้างานเท่านั้น", "เจอตัวค่อยจ่าย", "ปลอดภัย 100%"]);
        
        let dynamicDetails = `อายุ ${p.age || '20+'}ปี`;
        if (p.body_stats) dynamicDetails += `, สัดส่วน ${p.body_stats}`;
        if (p.style) dynamicDetails += `, สไตล์${p.style}`;

        const pageTitle = `${titleIntro} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน รูปตรงปก 100%`;
        const metaDesc = `${descIntro}${displayName} (${dynamicDetails}) สาวไซด์ไลน์${provinceName} ${serviceWord} รับงานเองไม่ผ่านเอเย่นต์ ${payWord} รูปตรงปก พิกัด${p.location || provinceName} จองคิวทักไลน์เลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // ==========================================
        // 4. ADVANCED STRUCTURED DATA (JSON-LD)
        // ==========================================
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}/logo.png` },
                    "sameAs": CONFIG.SOCIAL_PROFILES
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/sideline/province/${p.provinces?.key || 'chiangmai'}` },
                        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": ["Service", "Product"],
                    "@id": `${canonicalUrl}#maincontent`,
                    "name": pageTitle,
                    // --- 🌟 SEO UPGRADE: ImageObject Schema ---
                    "image": {
                        "@type": "ImageObject",
                        "url": imageUrl,
                        "width": "800",
                        "height": "1067", // อัตราส่วน 3:4
                        "caption": `${displayName} ไซด์ไลน์${provinceName} รับงานฟิวแฟน`
                    },
                    "description": metaDesc,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                    // --- 🌟 SEO UPGRADE: เพิ่มรายละเอียดบริการ ---
                    "category": `ไซด์ไลน์ ${provinceName}`,
                    "slogan": "ตรงปก ไม่ต้องโอนมัดจำ จ่ายเงินหน้างานเท่านั้น",
                    "provider": { "@id": `${CONFIG.DOMAIN}/#organization` },
                    "offers": {
                        "@type": "Offer",
                        "price": rawPriceValue,
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl,
                        "priceValidUntil": "2026-12-31",
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString(),
                        "bestRating": "5", "worstRating": "1"
                    },
                    "areaServed": {
                        "@type": "AdministrativeArea", "name": provinceName,
                        "sameAs": provinceName.includes("เชียงใหม่") ? "https://www.wikidata.org/wiki/Q42430" : undefined
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        // --- 🔥 DYNAMIC FAQ: สร้าง FAQ จากข้อมูลจริง ---
                        {
                            "@type": "Question", "name": `จอง${displayName} ต้องโอนมัดจำไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องโอนมัดจำครับ เว็บไซต์เราเน้นความปลอดภัย ชำระเงินหน้างานเมื่อเจอน้องเท่านั้น" }
                        },
                        {
                            "@type": "Question", "name": `${displayName} รับงานแถวไหน?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `${displayName} รับงานในพื้นที่ ${p.location || provinceName} ค่ะ สามารถนัดหมายพิกัดที่สะดวกได้ทางไลน์เลย` }
                        },
                        {
                            "@type": "Question", "name": `ค่าขนมเริ่มต้นของ${displayName} เท่าไหร่?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `ค่าขนมเริ่มต้นของ${displayName} อยู่ที่ ${displayPrice} ค่ะ รายละเอียดเพิ่มเติมสามารถสอบถามได้โดยตรง` }
                        }
                    ]
                }
            ]
        };

        // ==========================================
        // 5. FULL OPTIMIZED HTML
        // ==========================================
        
        // --- 🔥 DEEPER CONTENT: สร้าง HTML แสดงคุณสมบัติและโปรไฟล์แนะนำ ---
        const features = {
            "อายุ": p.age ? `${p.age} ปี` : "20+",
            "สัดส่วน": p.body_stats || "สอบถามเพิ่มเติม",
            "สไตล์": p.style || "เป็นกันเอง, ฟิวแฟน",
            "การบริการ": p.specialty || "เอาใจเก่ง, บริการดีเยี่ยม"
        };
        const featuresHtml = '<ul style="list-style:none;padding:0;margin-bottom:24px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            Object.entries(features).map(([key, value]) => `<li style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:12px;padding:12px;font-size:14px;"><b style="display:block;font-size:11px;color:#9ca3af;text-transform:uppercase;margin-bottom:4px;">${key}</b> <span style="font-weight:600;color:#111827;">${value}</span></li>`).join('') +
            '</ul>';
        
        const relatedProfilesHtml = relatedProfiles.length > 0 ? `
            <div style="margin-top:40px; padding-top:20px; border-top:2px solid #f3f4f6;">
                <h2 style="font-weight:800; color:#db2777; display:block; margin-bottom:15px; font-size:18px;">🔥 น้องๆ ที่คุณอาจจะชอบ:</h2>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    ${relatedProfiles.map(r => `
                        <a href="/sideline/${r.slug}" style="text-decoration:none; color:inherit; display:block;">
                            <img src="${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${r.imagePath}?width=250&quality=75&format=webp" style="width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:12px; background:#eee;" loading="lazy" decoding="async">
                            <div style="font-weight:700; margin-top:8px; font-size:14px; color:#1f2937;">น้อง${r.name}</div>
                            <div style="font-size:12px; color:#9ca3af; margin-top:2px;">📍 ${r.location || provinceName}</div>
                        </a>
                    `).join('')}
                </div>
            </div>` : '';


        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="language" content="Thai">
    <meta property="og:locale" content="th_TH"><meta property="og:title" content="${pageTitle}"><meta property="og:description" content="${metaDesc}"><meta property="og:image" content="${imageUrl}"><meta property="og:image:alt" content="${displayName} ไซด์ไลน์${provinceName}"><meta property="og:url" content="${canonicalUrl}"><meta property="og:type" content="website"><meta property="og:site_name" content="${CONFIG.BRAND_NAME}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${pageTitle}"><meta name="twitter:image" content="${imageUrl}">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>:root{--p:#db2777;--s:#06c755}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#fff;color:#1f2937;line-height:1.5}.c{max-width:480px;margin:0 auto;background:#fff;min-height:100vh}.h{width:100%;height:auto;display:block;aspect-ratio:3/4;object-fit:cover;background:#f3f4f6}.d{padding:24px}.r{display:flex;align-items:center;gap:4px;color:#fbbf24;font-weight:700;font-s:15px;margin-bottom:8px}h1{color:var(--p);font-s:24px;margin:0 0 16px 0;font-weight:800;line-height:1.2}.tx{font-s:15px;color:#4b5563;margin-bottom:24px}.btn{display:flex;align-items:center;justify-content:center;background:var(--s);color:#fff;padding:18px;border-radius:100px;text-decoration:none;font-weight:700;font-s:18px;box-shadow:0 10px 15px -3px rgba(6,199,85,.4);transition:transform .2s}.btn:active{transform:scale(.98)}.ft{text-align:center;font-s:12px;color:#9ca3af;margin-top:30px;padding:20px}</style>
</head>
<body>
    <div class="c">
        <img src="${imageUrl}" class="h" alt="${displayName} สาวไซด์ไลน์ ${provinceName}" loading="lazy" decoding="async">
        <div class="d">
            <div class="r">⭐ ${ratingValue} <span>(${reviewCount} รีวิว)</span></div>
            <h1>${pageTitle}</h1>
            
            <!-- Dynamic Features Section -->
            ${featuresHtml}

            <div class="tx">${metaDesc}</div>
            <a href="${finalLineUrl}" class="btn">📲 ทักไลน์จองคิว ${displayName}</a>
            
            <!-- Related Profiles Section -->
            ${relatedProfilesHtml}
        </div>
        <div class="ft">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - มั่นใจ ปลอดภัย ไม่มัดจำ</div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
                "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=600"
            } 
        });

    } catch (e) {
        console.error("Error during SSR:", e);
        return context.next();
    }
};