import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Thailand',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai", "https://x.com/Sdl_chiangmai",
        "https://bsky.app/profile/sidelinechiangmai.bsky.social",
        "https://www.linkedin.com/in/cuteti-sexythailand-398567280", "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getLocalZones = (provinceKey) => {
    const zones = {
        'chiangmai': ['นิมมานเหมินท์', 'สันติธรรม', 'ช้างเผือก', 'แม่โจ้', 'หางดง', 'มช.'],
        'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'ห้วยขวาง', 'เลียบด่วน', 'ฝั่งธน'],
        'chonburi': ['พัทยาเหนือ', 'พัทยากลาง', 'จอมเทียน', 'ศรีราชา', 'อมตะนคร']
    };
    return zones[provinceKey.toLowerCase()] || ['ตัวเมือง', 'ย่านใจกลางเมือง', 'ใกล้คุณ'];
};

// --- 🌟 CONTENT ENHANCEMENT: สร้าง FAQ แบบไดนามิก ---
const generateFaqs = (provinceName, randomZone) => ({
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": `ไซด์ไลน์${provinceName} มีโซนไหนบ้าง?`, "acceptedAnswer": { "@type": "Answer", "text": `น้องๆ ไซด์ไลน์ใน${provinceName} รับงานหลายพื้นที่ โดยมีโซนยอดนิยมเช่น ${getLocalZones(provinceName.toLowerCase()).slice(0, 3).join(', ')} และพื้นที่ใกล้เคียง สามารถนัดหมายในโซน ${randomZone} ได้สะดวก` } },
        { "@type": "Question", "name": `ต้องโอนมัดจำก่อนไหม?`, "acceptedAnswer": { "@type": "Answer", "text": `ไม่ต้องครับ! เพื่อความปลอดภัยสูงสุด เว็บไซต์เรารวบรวมเฉพาะน้องๆ ที่รับชำระเงินหน้างานเมื่อเจอกันแล้วเท่านั้น` } }
    ]
});


export default async (request, context) => {
    const url = new URL(request.url);
    const provinceKey = url.pathname.split('/').pop();

    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
const { data: provinceData } = await supabase.from('provinces').select('id, nameThai').eq('slug', provinceKey).single();
        if (!provinceData) return context.next();

        const { data: profiles } = await supabase.from('profiles').select('id, slug, name, imagePath, verified, location')
            .eq('province_id', provinceData.id).eq('status', 'active').order('created_at', { ascending: false });

        // --- 🚀 ROBUSTNESS UPGRADE: จัดการกรณีไม่มีโปรไฟล์ ---
        if (!profiles || profiles.length === 0) {
            const emptyHtml = `<!DOCTYPE html><html lang="th"><head><title>ไซด์ไลน์${provinceData.nameThai} - เร็วๆ นี้</title><meta name="robots" content="noindex, follow"></head><body style="font-family:sans-serif; text-align:center; padding-top:50px;"><h1>ไซด์ไลน์${provinceData.nameThai}</h1><p>กำลังอัปเดตโปรไฟล์น้องๆ ในพื้นที่นี้... โปรดติดตามเร็วๆ นี้!</p></body></html>`;
            return new Response(emptyHtml, { headers: { "content-type": "text/html; charset=utf-8" } });
        }

        const provinceName = provinceData.nameThai;
        const localZones = getLocalZones(provinceKey);
        const randomZone = spin(localZones);

        const title = `รวมน้องๆ ไซด์ไลน์${provinceName} รับงานเอง โซน${randomZone} งานดีตรงปก 100%`;
        const description = `ค้นหาสาวไซด์ไลน์${provinceName} ยอดนิยมในโซน ${localZones.slice(0, 3).join(', ')} และอีกมากมาย พบกับโปรไฟล์น้องๆ รับงานเอง ฟิวแฟน ไม่ผ่านเอเย่นต์ จ่ายหน้างาน ปลอดภัยที่สุดใน${provinceName}`;
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;

        // --- 🌟 SEO ENHANCEMENT: สร้าง ItemList Schema ---
        const itemListSchema = {
            "@type": "ItemList",
            "name": `รายชื่อไซด์ไลน์ใน ${provinceName}`,
            "itemListElement": profiles.map((p, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Service",
                    "name": p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`,
                    "url": `${CONFIG.DOMAIN}/sideline/${p.slug}`,
                    "image": `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}`
                }
            }))
        };
        
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                { "@type": "Organization", "@id": `${CONFIG.DOMAIN}/#organization`, "name": CONFIG.BRAND_NAME, "url": CONFIG.DOMAIN, "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}/logo.png` }, "sameAs": CONFIG.SOCIAL_PROFILES },
                { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN }, { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }] },
                {
                    "@type": "CollectionPage", // CollectionPage เหมาะกับหน้ารวม List มากกว่า
                    "@id": `${provinceUrl}#maincontent`,
                    "name": `ศูนย์รวมไซด์ไลน์${provinceName} รับงานเอง ตรงปก`,
                    "image": `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${profiles[0].imagePath}`,
                    "description": description,
                    "url": provinceUrl,
                    "mainEntity": itemListSchema, // เชื่อม ItemList เข้ากับหน้าหลัก
                    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": (profiles.length * 12 + 45).toString() },
                    "areaServed": { "@type": "AdministrativeArea", "name": provinceName, "sameAs": provinceName.includes("เชียงใหม่") ? "https://www.wikidata.org/wiki/Q42430" : undefined }
                },
                generateFaqs(provinceName, randomZone) // เพิ่ม FAQ Schema
            ]
        };

        const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${provinceUrl}"><script type="application/ld+json">${JSON.stringify(schemaData)}</script><style>:root{--p:#ec4899;--bg:#0f172a}body{font-family:'Sarabun',sans-serif;background:var(--bg);color:#fff;margin:0;padding:20px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:15px;margin-top:20px}.card{background:#1e293b;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;transition:.3s;border:1px solid #334155}.card:hover{transform:translateY(-5px);border-color:var(--p)}.img-w{position:relative;padding-top:125%}.img-w img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}.card-d{padding:10px}.name{font-weight:700;color:#fff;display:block;margin-bottom:4px}.loc{font-size:12px;color:#94a3b8}.v-badge{position:absolute;top:8px;right:8px;background:#10b981;color:#000;font-size:10px;padding:2px 6px;border-radius:99px;font-weight:700}.h1-seo{color:var(--p);font-size:22px;text-align:center}.zone-info{background:#334155;padding:10px;border-radius:8px;font-size:13px;margin:15px 0;border-left:4px solid var(--p)}</style></head><body><div style="max-width:800px;margin:auto"><h1 class="h1-seo">พิกัดน้องๆ ไซด์ไลน์${provinceName}</h1><div class="zone-info"><strong>📍 พื้นที่บริการยอดนิยม:</strong> ${localZones.join(' • ')}<br>พบกับน้องๆ งานดี เดินทางสะดวก ไม่ว่าคุณจะอยู่ในโซน ${randomZone} หรือพื้นที่ใกล้เคียง</div><div class="grid">${profiles.map(p=>{const pName=p.name.startsWith('น้อง')?p.name:`น้อง${p.name}`;return`<a href="/sideline/${p.slug}" class="card"><div class="img-w"><img src="${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}?width=300&quality=70" alt="${pName}" loading="lazy" decoding="async">${p.verified?'<span class="v-badge">✓ ยืนยัน</span>':''}</div><div class="card-d"><span class="name">${pName}</span><div class="loc">📍 ${p.location||randomZone}</div><div style="color:#fbbf24;font-size:12px;margin-top:5px">⭐ ${(4.7+(p.id%3)/10).toFixed(1)}</div></div></a>`}).join('')}</div></div></body></html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });

    } catch (e) {
        console.error("SSR Province Error:", e);
        // หากเกิด Error ให้ไปหน้า Client-side ปกติแทน
        return context.next(); 
    }
};