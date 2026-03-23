import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline CM',
    STORAGE_BUCKET: 'profile-images',
    SOCIAL_LINKS: {
        line: 'https://line.me/ti/p/ksLUMz3p_o'
    }
};

// ==========================================
// 2. UTILITIES
// ==========================================
const escapeHTML = (str) => str ? String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[tag])) : '';

const optimizeImg = (path, width = 600) => {
    if (!path) return `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/c_scale,w_${width},q_auto,f_auto/`);
    }
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/${CONFIG.STORAGE_BUCKET}/${path}`;
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ==========================================
// 3. MAIN SSR FUNCTION
// ==========================================
export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|lighthouse|headless/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) return context.next();

        // Data Prep
        const displayName = escapeHTML(p.name).replace(/^(น้อง\s?)/i, '');
        const provinceName = p.provinces?.nameThai || 'เชียงใหม่';
        const displayPrice = p.rate ? `฿${parseInt(p.rate).toLocaleString()}` : 'สอบถาม';
        const imageUrl = optimizeImg(p.imagePath, 800);
        
        // SEO Spintax
        const YEAR_TH = new Date().getFullYear() + 543;
        const titleIntro = spin(["แนะนำ", "รีวิว", "พบกับ", "ตัวท็อป", "ห้ามพลาด"]);
        const serviceWord = spin(["บริการฟิวแฟน", "งานเนี๊ยบตรงปก", "เป็นกันเอง", "ดูแลดีมาก"]);
        
        const pageTitle = `${titleIntro} น้อง${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ${serviceWord} (${YEAR_TH})`;
        const metaDesc = `โปรไฟล์น้อง${displayName} ไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี ${serviceWord} รูปตรงปก 100% ไม่ต้องโอนมัดจำ จ่ายหน้างาน พิกัด${p.location || provinceName}`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // Schema JSON-LD (Person Type - Best for SEO)
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": `น้อง${displayName}`,
            "description": metaDesc,
            "image": imageUrl,
            "url": canonicalUrl,
            "address": { "@type": "PostalAddress", "addressLocality": provinceName, "addressCountry": "TH" },
            "offers": {
                "@type": "Offer",
                "price": (p.rate || "1500").toString().replace(/\D/g, ''),
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock"
            }
        };

        const html = `<!DOCTYPE html>
<html lang="th" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#111111">
    
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { darkMode: 'class', theme: { extend: { colors: { primary: '#ec4899' } } } };
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

    <style>
        body { background-color: #050505; color: #e5e7eb; font-family: system-ui, sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .status-available { background: #22c55e; }
    </style>
</head>
<body class="min-h-screen pb-10">
    <nav class="p-4 border-b border-white/10 flex justify-between items-center glass sticky top-0 z-50">
        <a href="/" class="text-xl font-black text-primary tracking-tighter">SIDELINE CM</a>
        <a href="${CONFIG.SOCIAL_LINKS.line}" class="bg-[#06C755] text-white px-4 py-2 rounded-full text-sm font-bold">LINE OA</a>
    </nav>

    <main class="max-w-2xl mx-auto p-4">
        <!-- Hero Image -->
        <div class="relative rounded-3xl overflow-hidden shadow-2xl mb-6 aspect-[3/4]">
            <img src="${imageUrl}" alt="น้อง${displayName}" class="w-full h-full object-cover">
            <div class="absolute top-4 left-4 flex flex-col gap-2">
                <span class="status-available text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">🟢 ว่างรับงาน</span>
                <span class="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">🛡️ Verified</span>
            </div>
        </div>

        <!-- Info Header -->
        <div class="text-center mb-8">
            <h1 class="text-3xl font-black text-white mb-2 uppercase tracking-tight">น้อง${displayName}</h1>
            <p class="text-primary font-bold flex items-center justify-center gap-2">
                <i class="fas fa-map-marker-alt"></i> ${provinceName} ${p.location || ''}
            </p>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-3 gap-3 mb-8">
            <div class="glass p-4 rounded-2xl text-center">
                <p class="text-[10px] text-gray-500 uppercase font-bold">อายุ</p>
                <p class="text-xl font-black text-white">${p.age || '-'}</p>
            </div>
            <div class="glass p-4 rounded-2xl text-center">
                <p class="text-[10px] text-gray-500 uppercase font-bold">สัดส่วน</p>
                <p class="text-xl font-black text-white">${p.stats || '-'}</p>
            </div>
            <div class="glass p-4 rounded-2xl text-center">
                <p class="text-[10px] text-gray-500 uppercase font-bold">ราคา</p>
                <p class="text-xl font-black text-green-400">${displayPrice}</p>
            </div>
        </div>

        <!-- Description -->
        <div class="glass p-6 rounded-3xl mb-8 leading-relaxed text-gray-300">
            <h2 class="text-white font-bold mb-3 italic">" รายละเอียดบริการ "</h2>
            <p>${escapeHTML(p.description || metaDesc).replace(/\n/g, '<br>')}</p>
        </div>

        <!-- CTA Button -->
        <div class="sticky bottom-6 left-0 right-0 px-4">
            <a href="https://line.me/ti/p/~${p.lineId || 'ksLUMz3p_o'}" 
               class="flex items-center justify-center gap-3 bg-[#06C755] hover:bg-[#05b34c] text-white py-4 rounded-2xl font-black text-lg shadow-[0_15px_30px_rgba(6,199,85,0.4)] transition-all active:scale-95">
                <i class="fab fa-line text-2xl"></i>
                ทักไลน์จองคิว น้อง${displayName}
            </a>
            <p class="text-center text-[10px] text-gray-500 mt-3 uppercase tracking-widest font-bold">ปลอดภัย • จ่ายหน้างาน • ไม่มัดจำ</p>
        </div>
    </main>

    <footer class="text-center py-10 opacity-30 text-xs">
        © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}
    </footer>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) {
        return context.next();
    }
};
