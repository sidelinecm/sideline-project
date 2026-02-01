import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// =================================================================
// 1. CONFIGURATION (ศูนย์กลางข้อมูลเว็บ)
// =================================================================
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiangmai',
    LOGO_URL: '/images/logo-sidelinechiangmai.webp',
    OG_PREVIEW: 'https://sidelinechiangmai.netlify.app/images/sidelinechiangmai-social-preview.webp'
};

// =================================================================
// 2. HELPER FUNCTIONS (เครื่องมือช่วย)
// =================================================================
const formatDate = () => new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
const optimizeImg = (path, width = 400) => {
    if (!path) return `${CONFIG.DOMAIN}/images/placeholder-profile.webp`; // รูปสำรอง
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=75&format=webp`;
};
const getLocalZones = (key) => {
    const zones = { 'chiangmai': ['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด'], 'bangkok': ['สุขุมวิท', 'รัชดา', 'ลาดพร้าว', 'เอกมัย'] };
    return zones[key?.toLowerCase()] || ['ตัวเมือง', 'ย่านธุรกิจ', 'พิกัดยอดนิยม'];
};

// =================================================================
// 3. MAIN ROUTER (ตัวจัดการเส้นทางหลัก)
// =================================================================
export default async (request, context) => {
    const url = new URL(request.url);
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|inspectiontool|lighthouse/i.test(ua);
    const isDebug = url.searchParams.get('debug') === 'true';

    // ถ้าไม่ใช่ Bot หรือไม่ได้กำลัง Debug ให้ไปที่หน้าเว็บปกติ (Client-side)
    if (!isBot && !isDebug) return context.next();

    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    const path = url.pathname.toLowerCase();
    const pathParts = path.split('/').filter(Boolean);

    try {
        // --- จัดการเส้นทางตามลำดับความสำคัญ ---

        // A. หน้าแรก (/) -> ปลอดภัย 100%
        if (path === '/' || path === '/index.html') {
            return await handleHomePage(supabase);
        }

        // B. หน้าโปรไฟล์ทั้งหมด (/profiles) -> ที่รวมรูปภาพ
        if (path === '/profiles') {
            return await handleAllProfilesPage(supabase);
        }

        // C. หน้าจังหวัด (/location/xxx) -> SEO Landing Page
        if ((pathParts[0] === 'location' || pathParts[0] === 'province') && pathParts[1]) {
            return await handleLocationPage(supabase, pathParts[1]);
        }

        // D. หน้าโปรไฟล์บุคคล (/sideline/xxx) -> หน้าสุดท้าย
        if (pathParts[0] === 'sideline' && pathParts[1]) {
            return await handleProfilePage(supabase, pathParts[1]);
        }

        // ถ้าไม่ตรงกับเงื่อนไขไหนเลย ให้ไปหน้า Client-side
        return context.next();

    } catch (e) {
        console.error("Critical SSR Error:", e);
        // หากเกิด Error ให้ปล่อยไปหน้า Client-side เพื่อป้องกันเว็บล่ม
        return context.next();
    }
};

// =================================================================
// 4. PAGE HANDLERS (ตัวสร้างเนื้อหาแต่ละหน้า)
// =================================================================

/**
 * [A] สร้างหน้าแรก (Homepage) - เน้นความสะอาด ปลอดภัยสำหรับ Google
 */
async function handleHomePage(supabase) {
    const { data: provinces } = await supabase.from('provinces').select('key, nameThai').order('nameThai');
    
    const title = `${CONFIG.BRAND_NAME} - ศูนย์รวมเพื่อนเที่ยวและงานเอนเตอร์เทนอันดับ 1 ในไทย`;
    const desc = `ยินดีต้อนรับสู่ ${CONFIG.BRAND_NAME} แพลตฟอร์มรวบรวมโปรไฟล์เพื่อนเที่ยวและงานเอนเตอร์เทนคุณภาพทั่วไทย ปลอดภัย 100% ไม่ต้องโอนมัดจำก่อน (อัปเดตล่าสุด ${formatDate()})`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": CONFIG.DOMAIN,
        "name": CONFIG.BRAND_NAME,
        "description": desc,
        "potentialAction": { "@type": "SearchAction", "target": `${CONFIG.DOMAIN}/?q={search_term_string}`, "query-input": "required name=search_term_string" }
    };

    const html = `
    <!DOCTYPE html><html lang="th"><head>
        <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <meta name="description" content="${desc}">
        <meta name="rating" content="general"> <!-- ⭐️ สำคัญ: ยืนยันว่าหน้านี้ปลอดภัย -->
        <link rel="canonical" href="${CONFIG.DOMAIN}/">
        <meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${CONFIG.DOMAIN}/"><meta property="og:image" content="${CONFIG.OG_PREVIEW}">
        <script type="application/ld+json">${JSON.stringify(schema)}</script>
        <style>
            body{font-family:'Prompt',sans-serif;background:#f8fafc;color:#1e293b;margin:0;text-align:center}
            .hero{padding:50px 20px;background:#fff;border-bottom:1px solid #e2e8f0}
            .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:15px;max-width:960px;margin:40px auto;padding:0 20px}
            .loc-btn{display:block;padding:15px;background:#fff;border:1px solid #cbd5e1;border-radius:12px;text-decoration:none;color:#334155;font-weight:bold;transition:0.2s}
            .loc-btn:hover{border-color:#ec4899;color:#ec4899;transform:translateY(-2px)}
            .btn-all{display:inline-block;margin-top:20px;padding:15px 40px;background:#ec4899;color:#fff;border-radius:50px;font-weight:bold;text-decoration:none;box-shadow:0 4px 15px rgba(236,72,153,0.3)}
        </style>
    </head><body>
        <div class="hero">
            <img src="${CONFIG.LOGO_URL}" alt="${CONFIG.BRAND_NAME} Logo" width="280">
            <h1 style="color:#1e293b;font-size:24px;margin-top:20px;">ค้นหาเพื่อนเที่ยวและงานเอนเตอร์เทน</h1>
            <p style="color:#475569;max-width:600px;margin:10px auto;">${desc}</p>
            <a href="/profiles" class="btn-all">ดูโปรไฟล์น้องๆ ทั้งหมด &raquo;</a>
        </div>
        <h2 style="margin-top:40px;font-size:20px;">เลือกจังหวัดที่ต้องการค้นหา</h2>
        <div class="grid">${provinces.map(p => `<a href="/location/${p.key}" class="loc-btn">ไซด์ไลน์${p.nameThai}</a>`).join('')}</div>
        <footer style="padding:40px 20px;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} All rights reserved.</footer>
    </body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

/**
 * [B] สร้างหน้าโปรไฟล์ทั้งหมด (/profiles) - ที่รวมแกลเลอรี่
 */
async function handleAllProfilesPage(supabase) {
    const { data: profiles } = await supabase.from('profiles').select('name, slug, imagePath, provinces(nameThai)').eq('active', true).order('isfeatured', { ascending: false }).limit(150);
    
    const title = `รวมโปรไฟล์น้องๆ ทั้งหมด (${profiles.length} คน) - ${CONFIG.BRAND_NAME}`;
    const desc = `รวมรายการโปรไฟล์เพื่อนเที่ยวและงานเอนเตอร์เทนทุกจังหวัด คัดพิเศษ สวยตรงปก ปลอดภัย 100% คลิกดูรูปภาพและรายละเอียดเพิ่มเติมได้เลย`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": title,
        "numberOfItems": profiles.length,
        "itemListElement": profiles.map((p, i) => ({
            "@type": "ListItem", "position": i + 1,
            "item": { "@type": "Person", "name": p.name, "url": `${CONFIG.DOMAIN}/sideline/${p.slug}` }
        }))
    };

    const html = `
    <!DOCTYPE html><html lang="th"><head>
        <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title><meta name="description" content="${desc}">
        <meta name="rating" content="adult"> <!-- ⭐️ สำคัญ: บอก Google ว่าหน้านี้มีเนื้อหาสำหรับผู้ใหญ่ -->
        <link rel="canonical" href="${CONFIG.DOMAIN}/profiles">
        <meta property="og:title" content="${title}"><meta property="og:url" content="${CONFIG.DOMAIN}/profiles">
        <script type="application/ld+json">${JSON.stringify(schema)}</script>
        <style>
            :root{--p:#ec4899;--bg:#0f172a}
            body{font-family:'Prompt',sans-serif;background:var(--bg);color:#f1f5f9;margin:0}
            .container{max-width:1200px;margin:0 auto;padding:20px}
            .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px}
            .card{background:#1e293b;border-radius:15px;overflow:hidden;text-decoration:none;color:inherit;border:1px solid #334155;transition:0.2s}
            .card:hover{border-color:var(--p);transform:translateY(-4px)}
            .card img{width:100%;aspect-ratio:3/4;object-fit:cover;background:#334155}
            h1{color:var(--p);text-align:center;margin:20px 0 30px}
        </style>
    </head><body>
        <div class="container">
            <h1>โปรไฟล์น้องๆ ทั้งหมด</h1>
            <div class="grid">${profiles.map(p => `
                <a href="/sideline/${p.slug}" class="card">
                    <img src="${optimizeImg(p.imagePath, 300)}" alt="${p.name} ไซด์ไลน์${p.provinces?.nameThai || ''}" loading="lazy">
                    <div style="padding:12px">
                        <div style="font-weight:bold">${p.name}</div>
                        <div style="font-size:12px;color:#94a3b8">📍 ${p.provinces?.nameThai || 'ไม่ระบุ'}</div>
                    </div>
                </a>`).join('')}
            </div>
        </div>
    </body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}


/**
 * [C] สร้างหน้าจังหวัด (Location) - จัดเต็ม SEO
 */
async function handleLocationPage(supabase, slug) {
    const { data: province } = await supabase.from('provinces').select('*').ilike('key', slug).maybeSingle();
    if (!province) return new Response("Province Not Found", { status: 404 });

    const { data: profiles } = await supabase.from('profiles').select('name, slug, imagePath, location, rate, isfeatured').eq('provinceKey', province.key).eq('active', true).order('isfeatured', { ascending: false }).limit(60);
    
    const provinceName = province.nameThai;
    const localZones = getLocalZones(slug);
    const count = profiles?.length || 0;

    const title = `ไซด์ไลน์${provinceName} (${count}+ คน) รับงานเอง ตรงปก ไม่มัดจำ`;
    const desc = `รวมน้องๆ ไซด์ไลน์${provinceName} กว่า ${count} คน พิกัด ${localZones.join(', ')} และทั่วจังหวัด รับประกันรูปตรงปก 100% ปลอดภัย ไม่ต้องโอนเงินก่อน (อัปเดต ${formatDate()})`;
    const canonicalUrl = `${CONFIG.DOMAIN}/location/${slug}`;

    const schema = { /* ... โค้ด Schema เดิมของคุณสมบูรณ์ดีแล้ว ... */ }; // (ย่อเพื่อความกระชับ แต่ในโค้ดจริงต้องใส่เต็ม)

    return new Response(`<!-- โค้ด HTML ของหน้าจังหวัดเดิมของคุณทั้งหมด -->
    <!-- แต่เพิ่ม Meta Tag นี้เข้าไปใน <head> -->
    <meta name="rating" content="adult">`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}


/**
 * [D] สร้างหน้าโปรไฟล์บุคคล - จัดเต็ม SEO
 */
async function handleProfilePage(supabase, slug) {
     const { data: p } = await supabase.from('profiles').select('*, provinces(nameThai, key)').eq('slug', slug).eq('active', true).maybeSingle();
    if (!p) return new Response("Profile Not Found", { status: 404 });
    
    // ... (ส่วนการประมวลผลข้อมูลและสร้าง Schema เดิมของคุณสมบูรณ์ดีแล้ว) ...

    return new Response(`<!-- โค้ด HTML ของหน้าโปรไฟล์เดิมของคุณทั้งหมด -->
    <!-- แต่เพิ่ม Meta Tag นี้เข้าไปใน <head> -->
    <meta name="rating" content="adult">`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}