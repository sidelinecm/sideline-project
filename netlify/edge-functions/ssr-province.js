import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. SYSTEM CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'sideline chiangmai (Thailand)',
    TWITTER: '@sidelinechiangmai',
    SOCIAL_LINKS: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@sidelinechiangmai',
        twitter: 'https://twitter.com/sidelinechiangmai',
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280',
        biosite: 'https://bio.site/firstfiwfans.com',
        linktree: 'https://linktr.ee/kissmodel',
        bluesky: 'https://bsky.app/profile/sidelinechiangmai.bsky.social'
    }
};

const PROVINCE_SEO_DATA = {
    'chiangmai': {
        zones:['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'คูเมือง', 'หลังมอ'],
        lsi:['สาวเหนือ', 'นักศึกษา มช.', 'ตัวท็อปเชียงใหม่', 'เด็กเอ็นเชียงใหม่', 'ไซด์ไลน์เชียงใหม่', 'คนเมือง', 'ฟิวแฟนเชียงใหม่', 'รับงานเมืองเชียงใหม่'],
        hotels:['โรงแรมแถวนิมมาน', 'ที่พักใกล้คูเมือง', 'คอนโดเจ็ดยอด', 'รีสอร์ทแม่ริม'],
        services:['รับงานชั่วคราว-ค้างคืน', 'ดูแลฟิวแฟนเดินนิมมาน', 'ปาร์ตี้พูลวิลล่าเชียงใหม่', 'นวดผ่อนคลายส่วนตัว'],
        faqs:[
            { q: "หาไซด์ไลน์เชียงใหม่ โซนไหนเดินทางสะดวกสุด?", a: "โซนนิมมาน สันติธรรม และเจ็ดยอด เป็นโซนที่น้องๆ รับงานเยอะที่สุด และมีโรงแรมรองรับมากมาย" },
            { q: "น้องๆ รับงานเชียงใหม่ มีโปรไฟล์แบบไหนบ้าง?", a: "เรามีตั้งแต่น้องนักศึกษา มช., แม่โจ้, ราชภัฏ ไปจนถึงพริตตี้สาวเหนือผิวขาวออร่า การันตีตรงปกทุกคน" }
        ]
    },
    'bangkok': {
        zones:['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย', 'ปิ่นเกล้า'],
        lsi:['พริตตี้ กทม.', 'นางแบบสาว', 'ตัวท็อปกรุงเทพ', 'เด็กเอ็น', 'ฟิวแฟนคลุกวงใน', 'รับงานกรุงเทพ', 'ไซด์ไลน์ กทม'],
        hotels:['คอนโดติด BTS', 'โรงแรมย่านสุขุมวิท', 'ที่พักห้วยขวาง'],
        services:['ดูแลแบบฟิวแฟนเต็มรูปแบบ', 'เพื่อนเที่ยวกลางคืนทองหล่อ', 'รับงาน N-Vip'],
        faqs:[
            { q: "เด็กเอ็นกรุงเทพ ส่วนใหญ่รับงานโซนไหน?", a: "โซนยอดฮิตคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ นัดหมายตามคอนโดติด BTS/MRT ได้เลย" },
            { q: "ความปลอดภัยในการเรียกไซด์ไลน์ กทม.?", a: "เราเน้นระบบ 'ไม่โอนมัดจำ' ลูกค้าเจอตัวน้อง จ่ายเงินหน้างานเท่านั้น ป้องกันมิจฉาชีพ 100%" }
        ]
    },
    'default': {
        zones:['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู'],
        lsi:['นักศึกษา', 'พริตตี้พาร์ทไทม์', 'หุ่นนางแบบ', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน'],
        hotels: ['โรงแรมในตัวเมือง', 'รีสอร์ทส่วนตัว'],
        services:['ฟิวแฟนส่วนตัว', 'เพื่อนเที่ยว-ดูหนัง', 'นวดผ่อนคลาย'],
        faqs:[
            { q: "ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายเงินสดหน้างานเมื่อเจอตัวน้องจริงเท่านั้น" },
            { q: "รับประกันความตรงปกไหม?", a: "รูปโปรไฟล์ทุกรูปผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปก 100%" }
        ]
    }
};

const optimizeImg = (path, width = 400, height = 533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) {
            const transform = `f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face`;
            return path.replace('/upload/', `/upload/${transform}/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=80`;
};

const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    const hotel1 = data.hotels?.[0] || 'โรงแรมชั้นนำ';
    const hotel2 = data.hotels?.[1] || 'ที่พักใกล้เคียง';
    const zone3 = data.zones?.slice(0,3).join(', ') || 'ตัวเมือง';
    const allZones = data.zones?.join(', ') || 'ทุกพื้นที่';
    
    if (count === 0) {
        return `<div class="seo-content text-left bg-white/5 p-8 rounded-3xl border border-white/10">
            <h2 class="text-2xl font-bold text-gold mb-4 font-serif italic underline">เตรียมพบกับ ${data.lsi[0]} รับงาน${provinceName} เร็วๆ นี้</h2>
            <p>เรากำลังคัดสรร <strong>${data.lsi[1]}</strong> และน้องๆ <strong>${data.lsi[2]}</strong> ระดับพรีเมียม เพื่อให้บริการที่ดีที่สุด แอดไลน์สอบถามคิวหลุดได้เลยครับ</p>
        </div>`;
    }

    return `
    <article class="seo-content text-left space-y-8 text-white/80 leading-relaxed font-light">
        <section>
            <h2 class="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                แหล่งรวม <span class="shimmer-gold uppercase italic">ไซด์ไลน์${provinceName}</span> และ ${data.lsi[0]} ที่ดีที่สุด
            </h2>
            <p class="mb-4">
                หากคุณกำลังมองหาประสบการณ์การพักผ่อนระดับพรีเมียม <strong>รับงาน${provinceName}</strong> คือคำตอบที่คุณตามหา! เรารวบรวมน้องๆ <strong>${data.lsi[1]}</strong> และ <strong>${data.lsi[2]}</strong> เกรดพรีเมียมที่ผ่านการคัดกรองความตรงปก 100% ไม่ว่าคุณจะอยู่โซน <strong>${zone3}</strong> ก็สามารถเรียกใช้บริการได้อย่างรวดเร็ว
            </p>
            <p>
                เน้นย้ำนโยบาย <strong>"จ่ายหน้างาน ไม่ต้องโอนมัดจำ"</strong> ปลอดภัยไร้ความเสี่ยง นัดหมายได้ง่ายตาม <strong>${hotel1}</strong> หรือที่พักส่วนตัวของคุณ
            </p>
        </section>

        <section class="bg-[#0a0a0a] p-6 md:p-8 rounded-3xl border border-gold/10 shadow-inner">
            <h3 class="text-xl font-bold text-gold mb-4 font-serif italic uppercase tracking-wider"><i class="fas fa-gem mr-2"></i> รูปแบบบริการของเด็กเอ็น${provinceName}</h3>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                ${data.services.map(srv => `
                    <li class="flex items-start gap-2">
                        <i class="fas fa-check-circle text-emerald mt-1 shrink-0"></i>
                        <span><strong>${srv}:</strong> บริการมืออาชีพ เป็นกันเอง รักษาความลับลูกค้าสูงสุด</span>
                    </li>
                `).join('')}
            </ul>
        </section>

        <section>
            <h3 class="text-xl font-bold text-white mb-4 border-l-4 border-gold pl-4 font-serif">พิกัดและโซนให้บริการ (Coverage Areas)</h3>
            <p class="mb-4">
                น้องๆ <strong>ไซด์ไลน์${provinceName}</strong> เดินทางไปดูแลคุณได้ครอบคลุมพื้นที่ <strong>${allZones}</strong> ไม่ว่าคุณจะพักอยู่ที่ <strong>${hotel2}</strong> หรือคอนโดส่วนตัว
            </p>
        </section>

        <section class="mt-10 border-t border-white/10 pt-8">
            <h2 class="text-2xl font-bold text-white mb-6 font-serif">คำถามที่พบบ่อย (FAQ) รับงาน${provinceName}</h2>
            <div class="space-y-4">
                ${data.faqs.map(faq => `
                    <div class="bg-black/40 p-5 rounded-2xl border border-white/5 shadow-lg">
                        <h3 class="text-base md:text-lg font-bold text-gold mb-2">Q: ${faq.q}</h3>
                        <p class="text-white/70 text-sm md:text-base">A: ${faq.a}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    </article>
    `;
};

// ==========================================
// 3. MAIN SSR EDGE FUNCTION
// ==========================================
export default async (request, context) => {
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const rawProvinceKey = pathParts[pathParts.length - 1] || 'chiangmai';
        const provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        const { data: provinceData, error: provError } = await supabase
            .from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle();

        if (!provinceData || provError) return context.next();

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, created_at, active, availability, likes')
            .eq('provinceKey', provinceData.key).eq('active', true)
            .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false })
            .limit(80);

        const safeProfiles = profiles || [];
        const provinceName = provinceData.nameThai;
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
        const zones = seoData.zones;
        
        const now = new Date();
        const CURRENT_YEAR = now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric' });
        const CURRENT_MONTH = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', month: 'long' });
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
            : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        const title = `หาเด็ก${provinceName} ไซด์ไลน์${provinceName} (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ไม่มัดจำ`;
        const description = `รวมน้องๆ ไซด์ไลน์${provinceName} ตัวท็อป ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก 100% ✓ไม่ต้องโอนมัดจำ ปลอดภัยที่สุด จ่ายหน้างาน`;

        const deterministicRating = safeProfiles.length > 0 ? (4.6 + (safeProfiles.length % 4) / 10).toFixed(1) : "5.0";
        const deterministicReviews = safeProfiles.length > 0 ? String(safeProfiles.length * 12 + 154) : "154";

        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": `${CONFIG.DOMAIN}/#website`,
                    "url": CONFIG.DOMAIN,
                    "name": CONFIG.BRAND_NAME
                },
                {
                    "@type": ["LocalBusiness", "EntertainmentBusiness"],
                    "@id": `${provinceUrl}/#business`,
                    "name": `ไซด์ไลน์${provinceName} - รับงานตรงปกพรีเมียม`,
                    "url": provinceUrl,
                    "image": firstImage,
                    "description": description,
                    "telephone": "ติดต่อผ่าน Line Official",
                    "priceRange": "฿1500 - ฿5000",
                    "areaServed": { "@type": "State", "name": provinceName },
                    "aggregateRating": safeProfiles.length > 0 ? {
                        "@type": "AggregateRating",
                        "ratingValue": deterministicRating,
                        "reviewCount": deterministicReviews,
                        "bestRating": "5",
                        "worstRating": "1"
                    } : undefined,
                    "offers": safeProfiles.length > 0 ? {
                        "@type": "AggregateOffer",
                        "offerCount": String(safeProfiles.length),
                        "lowPrice": "1500",
                        "highPrice": "5000",
                        "priceCurrency": "THB"
                    } : undefined
                },
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}/#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "isPartOf": { "@id": `${CONFIG.DOMAIN}/#website` },
                    "about": { "@id": `${provinceUrl}/#business` },
                    "breadcrumb": { "@id": `${provinceUrl}/#breadcrumb` },
                    "mainEntity": { "@id": `${provinceUrl}/#itemlist` }
                },
                {
                    "@type": "BreadcrumbList",
                    "@id": `${provinceUrl}/#breadcrumb`,
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": "รวมโปรไฟล์", "item": `${CONFIG.DOMAIN}/profiles` },
                        { "@type": "ListItem", "position": 3, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type": "ItemList",
                    "@id": `${provinceUrl}/#itemlist`,
                    "numberOfItems": safeProfiles.length,
                    "itemListElement": safeProfiles.map((p, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "url": `${CONFIG.DOMAIN}/sideline/${p.slug || p.id}`
                    }))
                },
                {
                    "@type": "FAQPage",
                    "@id": `${provinceUrl}/#faq`,
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `บริการไซด์ไลน์${provinceName} ต้องโอนมัดจำไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่มีการโอนมัดจำล่วงหน้าทุกกรณี ลูกค้าจ่ายเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น ปลอดภัย 100%" }
                        },
                        {
                            "@type": "Question",
                            "name": `น้องๆ ใน${provinceName} รับงานโซนไหนบ้าง?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `ครอบคลุมโซนยอดนิยม เช่น ${zones.slice(0, 5).join(', ')} และโรงแรมชั้นนำในตัวเมือง` }
                        }
                    ]
                }
            ]
        };

        // ==========================================
        // 5. HTML GENERATION - PREMIUM CARDS
        // ==========================================
        let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                const cleanName = (p.name || 'สาวสวย').replace(/^(น้อง\s?)/, '');
                const profileLocation = p.location || provinceName || 'ไม่ระบุพิกัด';
                const cardRating = (4.5 + (i % 5) / 10).toFixed(1); 
                const busyKeywords = ['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'];
                let isAvailable = true;
                if (p.availability) {
                    const availText = p.availability.toLowerCase();
                    isAvailable = !busyKeywords.some(kw => availText.includes(kw));
                }
                const statusText = isAvailable ? 'พร้อมรับงาน' : 'ติดจอง';
                const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
                const d = new Date(dateStr);
                const months =['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
                const dateDisplay = `${d.getDate()} ${months[d.getMonth()]} ${(d.getFullYear() + 543).toString().slice(-2)}`;
                
                const seoKeywords = [`ไซด์ไลน์${provinceName}`, `รับงาน${provinceName}`, `เด็กเอ็น${provinceName}`, `ฟิวแฟน${provinceName}`, `พริตตี้${provinceName}`];
                const targetKeyword = seoKeywords[i % seoKeywords.length];
                const imgAlt = `น้อง${cleanName} ${targetKeyword} พิกัด ${profileLocation} - รูปตรงปก ไม่โอนมัดจำ`;
                const profileLink = `/sideline/${p.slug || p.id || '#'}`;
                
                return `
                <article itemscope itemtype="http://schema.org/Person" class="mag-card group relative bg-charcoal rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/5 flex flex-col h-full css-content-visibility" data-profile-id="${p.id}">
                    <a href="${profileLink}" itemprop="url" class="absolute inset-0 z-30" aria-label="ดูโปรไฟล์ ${cleanName}" title="ดูโปรไฟล์ ${cleanName}"></a>
                    <div class="relative w-full pt-[133.33%] bg-midnight overflow-hidden">
                        <img itemprop="image" src="${optimizeImg(p.imagePath, 400, 533)}" alt="${imgAlt}" class="mag-img absolute inset-0 w-full h-full object-cover" ${i < 4 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} width="400" height="533">
                        <div class="gradient-overlay absolute inset-0 z-10 pointer-events-none"></div>
                        <div class="absolute top-3 left-0 w-full px-2 md:px-3 flex justify-between items-start z-20 pointer-events-none">
                            <div class="glass-dark text-white text-[9px] md:text-[10px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl pointer-events-auto">
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-heartbeat absolute inline-flex h-full w-full rounded-full ${isAvailable ? 'bg-emerald' : 'bg-crimson'} opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 ${isAvailable ? 'bg-emerald' : 'bg-crimson'}"></span>
                                </span>
                                <span class="font-bold tracking-wider">${statusText}</span>
                            </div>
                            <div class="glass-dark border border-gold/30 text-white text-[9px] md:text-[10px] font-bold px-2 py-1.5 rounded-full flex items-center gap-1 shadow-xl pointer-events-auto">
                                <i class="fas fa-check-circle text-gold"></i> <span class="text-gold">Verified</span>
                            </div>
                        </div>
                    </div>
                    <div class="px-4 pb-4 md:px-5 md:pb-5 pt-0 flex-1 flex flex-col justify-between relative z-20 -mt-10">
                        <div>
                            <div class="flex justify-between items-end mb-3">
                                <h3 itemprop="name" class="font-serif font-black text-2xl md:text-3xl italic text-white drop-shadow-2xl group-hover:text-gold transition-colors line-clamp-1 pr-1">${cleanName}</h3>
                                <div class="glass-dark px-2 py-1 rounded-lg flex items-center gap-1 text-gold font-black text-[10px] md:text-xs border border-gold/20 mb-1">
                                    <i class="fas fa-star"></i> ${cardRating}
                                </div>
                            </div>
                            <div class="flex flex-col gap-2 mb-4 border-b border-white/10 pb-4">
                                <p itemprop="homeLocation" class="text-[11px] md:text-xs text-white/80 font-medium flex items-center gap-2">
                                    <i class="fas fa-location-dot text-gold/80 w-3 text-center"></i> <span class="truncate">${profileLocation}</span>
                                </p>
                                <p class="text-[9px] md:text-[10px] text-white/40 font-light flex items-center gap-2">
                                    <i class="far fa-clock w-3 text-center"></i> <span>อัปเดต ${dateDisplay}</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center justify-between pt-1">
                            <div class="text-[9px] text-white/30 font-medium uppercase tracking-widest truncate">#${targetKeyword}</div>
                            <span class="text-white/50 group-hover:text-gold transition-all translate-x-0 group-hover:translate-x-2"><i class="fas fa-chevron-right text-xs"></i></span>
                        </div>
                    </div>
                </article>`;
            }).join('');
        }

        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#050505">
    <title>${title} | เกรดพรีเมียม ไม่มีมัดจำ100%</title>
    <meta name="description" content="${description} หาเด็ก${provinceName} ตรงปกฟิวแฟน ไม่โอนมัดจำ ปลอดภัยแน่นอน" />
    <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}, ตรงปก, ไม่มีมัดจำ" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${provinceUrl}" />
    ${safeProfiles.length > 0 ? `<link rel="preload" as="image" href="${optimizeImg(safeProfiles[0].imagePath, 400, 533)}">` : ''}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;700&family=Prompt:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <meta property="og:locale" content="th_TH"><meta property="og:type" content="website">
    <meta property="og:title" content="🔥 ${title}"><meta property="og:url" content="${provinceUrl}"><meta property="og:image" content="${firstImage}"><meta name="twitter:card" content="summary_large_image">

   <!-- 1. Fail-Safe FOUC Prevention (ป้องกันหน้าจอกระพริบและจอดำ) -->
<style id="fouc-prevention">
    html { opacity: 0; visibility: hidden; background: #050505; }
    html.tailwind-ready { opacity: 1; visibility: visible; transition: opacity 0.5s ease-in; }
</style>

<!-- 2. Tailwind Engine & Consolidated Config -->
<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
<script>
    tailwind.config = { 
        theme: { 
            extend: { 
                colors: { 
                    midnight: '#050505', 
                    charcoal: '#121212', // ปรับให้สว่างกว่าพื้นหลังเล็กน้อยเพื่อให้เห็นมิติ
                    gold: {
                        light: '#fde047',
                        DEFAULT: '#e5c05b', // สว่างขึ้นเพื่อให้ Contrast ผ่านเกณฑ์ AA
                        dark: '#b38728'
                    },
                    crimson: '#f43f5e', // สว่างขึ้นเล็กน้อย
                    emerald: '#10b981',
                }, 
                fontFamily: { 
                    serif: ['Cinzel', 'serif'], 
                    sans: ['Plus Jakarta Sans', 'Prompt', 'sans-serif'] 
                },
                animation: { 'heartbeat': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }
            } 
        } 
    };

    // ฟังก์ชันเปิดหน้าเว็บ (Safety Net)
    const showPage = () => document.documentElement.classList.add('tailwind-ready');
    window.addEventListener('DOMContentLoaded', () => setTimeout(showPage, 100));
    setTimeout(showPage, 1500); // กรณีเน็ตช้ามาก หรือ CDN ไม่โหลด
</script>

<!-- 3. Custom Luxury Styles & Accessibility Fixes -->
<style>
    /* พื้นหลังแบบหรูหรา */
    body { 
        background-color: #050505; 
        background-image: radial-gradient(circle at 50% 0%, #1a1500 0%, #050505 70%); 
        color: #f8f9fa; 
        overflow-x: hidden; 
    }

    /* แก้ปัญหา Contrast สำหรับข้อความจาง (Muted Text) */
    .text-contrast-muted { color: #a1a1aa !important; } /* สว่างกว่าสีเทาทั่วไป เพื่อให้อ่านออก */
    .text-contrast-dim { color: #d4d4d8 !important; }

    /* กระจกฝ้า (Glassmorphism) แบบ High-Contrast */
    .glass-dark { 
        background: rgba(15, 15, 15, 0.85); 
        backdrop-filter: blur(12px); 
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(229, 192, 91, 0.3); /* ขอบทองสว่างขึ้น */
    }

    /* อนิเมชันตัวหนังสือสีทองวิ่ง (Luxury Shimmer) */
    .shimmer-gold { 
        background: linear-gradient(135deg, #b38728 0%, #fff6c5 45%, #ffffff 50%, #fff6c5 55%, #b38728 100%); 
        background-size: 200% auto; 
        -webkit-background-clip: text; 
        background-clip: text; 
        -webkit-text-fill-color: transparent; 
        animation: shimmer 5s linear infinite; 
    }
    @keyframes shimmer { to { background-position: 200% center; } }

    /* การ์ดสไตล์นิตยสาร (Premium Magazine Card) */
    .mag-card { 
        transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); 
        border: 1px solid rgba(255,255,255,0.05);
    }
    .mag-card:hover { 
        transform: translateY(-10px); 
        box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.9), 0 10px 30px -10px rgba(229, 192, 91, 0.2); 
        border-color: rgba(229, 192, 91, 0.4); 
    }
    
    /* เอฟเฟกต์รูปภาพ */
    .mag-img { 
        transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.5s ease; 
        filter: brightness(0.85) contrast(1.1); 
    }
    .mag-card:hover .mag-img { 
        transform: scale(1.1); 
        filter: brightness(1.05) contrast(1.1); 
    }

    /* เงาไล่ระดับด้านล่างรูป (Gradient Overlay) ปรับให้อ่านตัวหนังสือชัดขึ้น 100% */
    .gradient-overlay { 
        background: linear-gradient(to top, 
            rgba(5,5,5,1) 0%, 
            rgba(5,5,5,0.9) 20%, 
            rgba(5,5,5,0.4) 50%, 
            transparent 100%); 
        z-index: 10;
    }

    /* ประสิทธิภาพด้านการเรนเดอร์ */
    .css-content-visibility { 
        content-visibility: auto; 
        contain-intrinsic-size: 400px 533px; 
    }
</style>
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
</head>
<body class="antialiased">
    <nav class="fixed top-0 w-full z-[100] transition-all duration-300 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div class="container mx-auto px-4 flex justify-between items-center max-w-7xl">
            <a href="/" class="text-2xl font-serif font-black tracking-widest shimmer-gold">SIDELINE CM</a>
            <div class="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase">
                <a href="/" class="hover:text-gold transition-colors">Home</a>
                <a href="/profiles" class="hover:text-gold transition-colors">Directory</a>
                <span class="text-gold">${provinceName}</span>
            </div>
            <a href="${CONFIG.SOCIAL_LINKS.line}" class="bg-[#06c755] text-white px-5 py-2.5 rounded-full font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2">
                <i class="fab fa-line text-lg"></i> LINE OA
            </a>
        </div>
    </nav>

    <header class="relative flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 overflow-hidden hero-gradient">
        <div class="relative z-20 max-w-5xl mx-auto space-y-6">
            <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl mt-4">
                <span class="w-2 h-2 bg-gold rounded-full animate-ping"></span>
                VERIFIED PROFILES • ${CURRENT_MONTH}
            </div>
            <h1 class="font-serif font-black text-[clamp(2rem,6vw,4.5rem)] leading-[1.2]">
                <span class="block text-white/90 shimmer-gold">ไซด์ไลน์${provinceName} รับงาน${provinceName}</span>
                <span class="block text-white text-[clamp(1.2rem,3vw,2.5rem)] mt-2 tracking-wide font-sans">คัดเกรดพรีเมียม ไม่โอนมัดจำ</span>
            </h1>
            <div class="flex flex-wrap justify-center gap-3 pt-4">
                ${zones.slice(0, 5).map(z => `<a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" class="text-[10px] px-4 py-2 rounded-full border border-white/10 font-bold uppercase bg-white/5 text-white/70 hover:bg-gold hover:text-black transition-all">#${z}</a>`).join('')}
            </div>
        </div>
    </header>

    <main class="container mx-auto max-w-7xl px-4 relative z-10" id="profiles">
        <div class="mb-6 flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 mt-8">
            <div>
                <h2 class="text-xl md:text-3xl font-serif font-bold text-white tracking-wide border-l-4 border-gold pl-3 uppercase">
                    <span class="shimmer-gold italic">Verified</span> โปรไฟล์น้องๆรับงานล่าสุด
                </h2>
                <p class="text-white/50 text-[10px] md:text-sm mt-2 pl-4">พบกับน้องๆ ไซด์ไลน์${provinceName} กว่า ${safeProfiles.length} คน พร้อมให้บริการ</p>
            </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 mb-16">${cardsHTML}</div>
        <section class="mb-24 glass-ui rounded-[3rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
            <div class="max-w-4xl mx-auto">${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}</div>
        </section>
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            <div class="glass-dark p-8 rounded-3xl text-center"><i class="fas fa-shield-halved text-gold text-4xl mb-4 block"></i><h3 class="text-lg font-bold mb-2 italic text-white uppercase tracking-widest">No Deposit</h3><p class="text-white/40 text-sm">ไม่โอนก่อนทุกกรณี ปลอดภัย จ่ายหน้างานเท่านั้น</p></div>
            <div class="glass-dark p-8 rounded-3xl text-center"><i class="fas fa-id-card-clip text-gold text-4xl mb-4 block"></i><h3 class="text-lg font-bold mb-2 italic text-white uppercase tracking-widest">Verified</h3><p class="text-white/40 text-sm">ผ่านการคัดโปรไฟล์ รูปตรงปก ไม่มีการหลอกลวง</p></div>
            <div class="glass-dark p-8 rounded-3xl text-center"><i class="fas fa-user-secret text-gold text-4xl mb-4 block"></i><h3 class="text-lg font-bold mb-2 italic text-white uppercase tracking-widest">Privacy</h3><p class="text-white/40 text-sm">รักษาความลับลูกค้าสูงสุด ข้อมูลปลอดภัย 100%</p></div>
        </section>
    </main>

   <footer class="bg-[#020202] border-t border-white/10 pt-24 pb-12 text-center md:text-left">
    <div class="container mx-auto max-w-7xl px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            
            <!-- Column 1: Brand & Intro -->
            <div class="md:col-span-2 space-y-6">
                <h3 class="text-3xl font-serif shimmer-gold font-black italic tracking-widest underline underline-offset-8 decoration-gold/20">
                    sideline chiangmai
                </h3>
                <!-- ปรับจาก white/40 เป็น white/70 เพื่อ Contrast ที่ดีขึ้น -->
                <p class="text-white/70 text-sm leading-loose max-w-md font-medium">
                    The Ultimate Directory for Premium Escort Services in ${provinceName}. 
                    Focusing on safety, transparency, and top-tier quality for a truly high-end experience.
                </p>
                
                <!-- เพิ่ม Social Icons เพื่อให้ Google รู้จักตัวตนเว็บมากขึ้น -->
                <div class="flex justify-center md:justify-start gap-4 pt-2">
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold transition-all" aria-label="Follow us on Twitter">
                        <i class="fab fa-x-twitter"></i>
                    </a>
                    <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold transition-all" aria-label="Follow us on TikTok">
                        <i class="fab fa-tiktok"></i>
                    </a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold transition-all" aria-label="Contact us on Line">
                        <i class="fab fa-line"></i>
                    </a>
                </div>
            </div>

            <!-- Column 2: Links (SEO Benefit) -->
            <div>
                <h4 class="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-8">Navigation</h4>
                <ul class="space-y-4 text-white/70 text-[11px] font-bold uppercase tracking-wider">
                    <li><a href="/" class="hover:text-gold transition-colors italic">Home</a></li>
                    <li><a href="/profiles" class="hover:text-gold transition-colors italic">All Profiles</a></li>
                    <li><a href="/location/chiangmai" class="hover:text-gold transition-colors italic">Chiang Mai Escorts</a></li>
                    <li><a href="/location/bangkok" class="hover:text-gold transition-colors italic">Bangkok Escorts</a></li>
                </ul>
            </div>

            <!-- Column 3: Legal & Safety -->
            <div>
                <h4 class="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-8">Legal</h4>
                <div class="border border-red-500/30 bg-red-500/5 p-5 rounded-2xl shadow-lg shadow-red-500/5">
                    <span class="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] leading-relaxed block mb-2">
                        🔞 20+ ONLY
                    </span>
                    <p class="text-[9px] text-white/60 leading-relaxed font-medium">
                        All models are independent adults. Please consume content responsibly.
                    </p>
                </div>
            </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <!-- ปรับจาก white/20 เป็น white/60 เพื่อให้อ่านออก -->
            <p class="text-[10px] text-white/60 font-black tracking-[0.3em] uppercase">
                &copy; ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. LUXURY DIRECTORY. ALL RIGHTS RESERVED.
            </p>
            
            <div class="flex gap-8 text-[9px] text-white/40 font-black tracking-widest uppercase">
                <span><i class="fas fa-shield-alt text-gold mr-1"></i> SECURE SSL</span>
                <span><i class="fas fa-bolt text-gold mr-1"></i> FAST LOADING</span>
            </div>
        </div>
    </div>
</footer>

    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="fixed bottom-6 right-6 w-16 h-16 bg-[#06c755] rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl hover:scale-110 transition-all z-[99] border-2 border-white/20">
        <i class="fab fa-line"></i><span class="absolute -top-1 -right-1 w-6 h-6 bg-red-600 border-2 border-[#050505] rounded-full animate-bounce flex items-center justify-center text-[10px] font-black shadow-lg">1</span>
    </a>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const nav = document.querySelector('nav');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) { nav.classList.add('bg-[#050505]/95', 'py-3', 'shadow-2xl'); nav.classList.remove('bg-[#050505]/80', 'py-4'); }
                else { nav.classList.remove('bg-[#050505]/95', 'py-3', 'shadow-2xl'); nav.classList.add('bg-[#050505]/80', 'py-4'); }
            }, { passive: true });
        });
    </script>
</body>
</html>`;

        return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=3600" } });
    } catch (e) {
        console.error('SSR Critical Error:', e);
        return new Response('<h1>ระบบกำลังอัปเดตชั่วคราว...</h1>', { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
};