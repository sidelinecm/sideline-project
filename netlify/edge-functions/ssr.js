import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- CONFIGURATION (ที่เดียวจบ) ---
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzINiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiangmai',
    CACHE_DURATION_SECONDS: 1800, // 30 นาที
    BOT_PATTERNS: /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i
};

// --- ADVANCED CACHING ---
const cache = new Map();

function getFromCache(key) {
    const entry = cache.get(key);
    if (entry && (Date.now() - entry.timestamp) < (CONFIG.CACHE_DURATION_SECONDS * 1000)) {
        return entry.data;
    }
    cache.delete(key); // Expired
    return null;
}

function setInCache(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
}

// --- SUPABASE CLIENT ---
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY, {
    auth: { persistSession: false }
});

// --- DATA FETCHING FUNCTIONS (with Caching) ---
async function fetchProfile(slug) {
    const cacheKey = `profile_${slug}`;
    let data = getFromCache(cacheKey);
    if (data) return data;

    const { data: profile } = await supabase.from('profiles').select('*, provinces(nameThai, key)').eq('slug', slug).maybeSingle();
    if (profile) setInCache(cacheKey, profile);
    return profile;
}

async function fetchProvince(provinceKey) {
    const cacheKey = `province_${provinceKey}`;
    let data = getFromCache(cacheKey);
    if (data) return data;

    const { data: province } = await supabase.from('provinces').select('nameThai, key').eq('key', provinceKey).maybeSingle();
    if (province) setInCache(cacheKey, province);
    return province;
}

async function fetchProfilesForProvince(provinceKey) {
    const cacheKey = `profiles_for_${provinceKey}`;
    let data = getFromCache(cacheKey);
    if (data) return data;

    const { data: profiles, count } = await supabase.from('profiles').select('name, slug', { count: 'exact' }).eq('provinceKey', provinceKey).limit(100);
    const result = { profiles: profiles || [], totalCount: count || 0 };
    setInCache(cacheKey, result);
    return result;
}


// --- HTML & SEO GENERATION ---

// ** สำหรับหน้าโปรไฟล์รายบุคคล (/sideline/...) **
function generateProfileHTML(profile) {
    const p = profile;
    const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
    const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${p.slug}`;
    const imageUrl = p.imagePath ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
    const priceText = p.rate ? ` ราคา ${p.rate}` : '';
    const title = `น้อง${p.name} - ไซด์ไลน์${provinceName} รับงานเอง${priceText} จ่ายหน้างาน | ${CONFIG.BRAND_NAME}`;
    const description = `น้อง${p.name} สาวไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี ${p.stats || ''} รับงานฟิวแฟน ไม่ต้องโอนมัดจำ ชำระเงินหน้างานเท่านั้น รูปตรงปก 100% ปลอดภัย พิกัด${p.location || provinceName} จองคิวเลย!`;
    
    const charCodeSum = p.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const ratingValue = (4.8 + (charCodeSum % 3) / 10).toFixed(1);
    const reviewCount = 80 + (charCodeSum % 120);

    const schema = {
        "@context": "https://schema.org",
        "@graph": [{
            "@type": "Product",
            "name": `น้อง${p.name} ไซด์ไลน์${provinceName}`,
            "image": imageUrl,
            "description": description,
            "sku": `SL-${p.id}`,
            "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
            "offers": { "@type": "Offer", "url": canonicalUrl, "priceCurrency": "THB", "price": (p.rate || '1500').replace(/[^0-9]/g, ''), "availability": "https://schema.org/InStock" },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingValue, "reviewCount": reviewCount }
        }, {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${p.provinces?.key || 'chiangmai'}` },
                { "@type": "ListItem", "position": 3, "name": p.name, "item": canonicalUrl }
            ]
        }]
    };

    return `<!DOCTYPE html><html lang="th"><head><meta charset="utf-8"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonicalUrl}"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><h1>${title}</h1><p>${description}</p><a href="https://line.me/ti/p/${p.lineId || 'ksLUWB89Y_'}">แอดไลน์น้อง${p.name}</a></body></html>`;
}

// ** สำหรับหน้าจังหวัด (/location/...) **
function generateProvinceHTML(province, profilesData) {
    const provinceName = province.nameThai;
    const provinceKey = province.key;
    const { profiles, totalCount } = profilesData;
    const canonicalUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
    const title = `ไซด์ไลน์${provinceName} - อัปเดตล่าสุด ${totalCount}+ คน | ${CONFIG.BRAND_NAME}`;
    const description = `รวมน้องๆ ไซด์ไลน์${provinceName} คัดเกรดพรีเมียม ${totalCount}+ คน รูปตรงปก ปลอดภัย 100% ไม่ต้องโอนมัดจำ จ่ายเงินหน้างานเท่านั้น`;
    
    const schema = {
        "@context": "https://schema.org",
        "@graph": [{
            "@type": "Product",
            "name": `บริการไซด์ไลน์ ${provinceName}`,
            "description": description,
            "image": `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`,
            "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": (totalCount * 15) + 88 },
            "offers": { "@type": "Offer", "url": canonicalUrl, "priceCurrency": "THB", "price": "1500", "availability": "https://schema.org/InStock" }
        }, {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": canonicalUrl }
            ]
        }]
    };

    const profileLinks = profiles.map(p => `<li><a href="${CONFIG.DOMAIN}/sideline/${p.slug}">${p.name}</a></li>`).join('');

    return `<!DOCTYPE html><html lang="th"><head><meta charset="utf-8"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonicalUrl}"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><h1>${title}</h1><p>พบ ${totalCount} คน:</p><ul>${profileLinks}</ul></body></html>`;
}


// --- MAIN EDGE FUNCTION HANDLER ---
export default async (request, context) => {
    // 1. ADVANCED BOT DETECTION
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBotUserAgent = CONFIG.BOT_PATTERNS.test(ua);
    
    let isDataCenter = false;
    const clientIP = request.headers.get('x-nf-client-connection-ip');
    if (clientIP) {
        try {
            const ipCheck = await fetch(`http://ip-api.com/json/${clientIP}?fields=hosting`);
            if (ipCheck.ok) {
                const ipData = await ipCheck.json();
                isDataCenter = ipData.hosting === true;
            }
        } catch (e) { /* ignore */ }
    }

    if (!isBotUserAgent && !isDataCenter) {
        return context.next(); // Not a bot, show the real website
    }

    // --- BOT LOGIC ---
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);

        // ROUTE 1: Province Page (/location/...)
        if ((pathParts[0] === 'location' || pathParts[0] === 'province') && pathParts.length > 1) {
            const provinceKey = decodeURIComponent(pathParts[1]);
            const [province, profilesData] = await Promise.all([
                fetchProvince(provinceKey),
                fetchProfilesForProvince(provinceKey)
            ]);

            if (!province) return context.next();
            
            const html = generateProvinceHTML(province, profilesData);
            return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": `public, max-age=${CONFIG.CACHE_DURATION_SECONDS}` } });
        }
        
        // ROUTE 2: Profile Page (/sideline/...)
        if (pathParts[0] === 'sideline' && pathParts.length > 1) {
            const slug = decodeURIComponent(pathParts[1]);
            const profile = await fetchProfile(slug);
            
            if (!profile) return context.next();

            const html = generateProfileHTML(profile);
            return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": `public, max-age=${CONFIG.CACHE_DURATION_SECONDS}` } });
        }

        // If no route matches, pass to the normal website
        return context.next();

    } catch (e) {
        console.error("SSR Error:", e);
        return context.next(); // Fallback on error
    }
};