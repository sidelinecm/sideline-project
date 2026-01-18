import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Configuration
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const DOMAIN = 'https://sidelinechiangmai.netlify.app';

// Cache System
const cache = {
  supabaseClient: null,
  provinces: new Map(),
  profilesCache: new Map(),
  lastFetchTime: new Map()
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 นาที
const MAX_PROFILES = 100;
const BOT_PATTERNS = /bot|spider|crawl|facebook|twitter|whatsapp|telegram|slack|discord|skype|zoom|line/i;

// --- Helper Functions ---

const getSupabaseClient = () => {
  if (!cache.supabaseClient) {
    cache.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
      global: { headers: { 'x-application-name': 'province-bot-renderer' } }
    });
  }
  return cache.supabaseClient;
};

const isCacheValid = (cacheKey) => {
  const lastFetch = cache.lastFetchTime.get(cacheKey);
  if (!lastFetch) return false;
  return (Date.now() - lastFetch) < CACHE_DURATION;
};

const sanitizeHTML = (str) => {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};

const formatThaiDate = () => {
  const now = new Date();
  return now.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Bangkok' });
};

const validateProvinceKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  if (key.length > 100) return false;
  return /^[a-zA-Z0-9ก-๙\-_]+$/.test(key);
};

// --- Data Fetching (Smart Logic) ---

async function fetchProvinceData(supabase, provinceKey) {
  const cacheKey = `province_${provinceKey}`;
  if (cache.provinces.has(cacheKey) && isCacheValid(cacheKey)) {
    return cache.provinces.get(cacheKey);
  }

  try {
    const { data, error } = await supabase
      .from('provinces')
      .select('id, nameThai, nameEng, key, region, population, area')
      .eq('key', provinceKey)
      .maybeSingle();

    if (error) throw error;
    if (data) {
      cache.provinces.set(cacheKey, data);
      cache.lastFetchTime.set(cacheKey, Date.now());
    }
    return data;
  } catch (error) {
    console.error(`Fetch Province Error (${provinceKey}):`, error.message);
    return null;
  }
}

// 🔥 ไฮไลท์: ฟังก์ชันดึงโปรไฟล์แบบ "กันล้ม 3 ชั้น"
async function fetchProfiles(supabase, provinceData) {
  const provinceKey = provinceData.key;
  const provinceId = provinceData.id;
  const cacheKey = `profiles_${provinceKey}`;
  
  if (cache.profilesCache.has(cacheKey) && isCacheValid(cacheKey)) {
    return cache.profilesCache.get(cacheKey);
  }

  let data = null;
  let count = 0;
  let error = null;

  // 🛡️ แผน A: ดึงผ่าน Relation (Join Table) - แม่นยำที่สุด
  // ใช้ได้เมื่อมีการทำ Foreign Key ระหว่าง profiles กับ provinces
  try {
    const result = await supabase
      .from('profiles')
      .select('name, slug, age, rating, verified, created_at, provinces!inner(key)', { count: 'exact' })
      .eq('provinces.key', provinceKey) // กรองจากตาราง provinces โดยตรง
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(MAX_PROFILES);
    
    if (!result.error) {
      data = result.data;
      count = result.count;
    } else {
      throw result.error;
    }
  } catch (e1) {
    console.warn(`Plan A failed for ${provinceKey}, trying Plan B...`);

    // 🛡️ แผน B: ดึงผ่าน province_id (Standard DB) - ใช้ ID ที่เราได้มาแล้ว
    try {
        if (!provinceId) throw new Error("No Province ID");
        const result = await supabase
            .from('profiles')
            .select('name, slug, age, rating, verified, created_at', { count: 'exact' })
            .eq('province_id', provinceId) // ลองใช้ชื่อ column มาตรฐาน 'province_id'
            .eq('active', true)
            .order('created_at', { ascending: false })
            .limit(MAX_PROFILES);

        if (!result.error) {
            data = result.data;
            count = result.count;
        } else {
            throw result.error;
        }
    } catch (e2) {
        console.warn(`Plan B failed for ${provinceKey}, trying Plan C...`);

        // 🛡️ แผน C: ดึงผ่าน provinceKey column (Denormalized) - ตามโค้ดเก่า
        try {
            const result = await supabase
                .from('profiles')
                .select('name, slug, age, rating, verified, created_at', { count: 'exact' })
                .eq('provinceKey', provinceKey) // ลองหา column ชื่อ 'provinceKey'
                .eq('active', true)
                .order('created_at', { ascending: false })
                .limit(MAX_PROFILES);
            
            if (!result.error) {
                data = result.data;
                count = result.count;
            } else {
                // 🏳️ ยอมแพ้: คืนค่าว่าง เพื่อไม่ให้เว็บล่ม
                console.error(`All plans failed for ${provinceKey}. Return empty list.`);
                data = [];
                count = 0;
            }
        } catch (e3) {
            data = [];
            count = 0;
        }
    }
  }

  const result = { profiles: data || [], totalCount: count || 0 };
  
  // Cache ผลลัพธ์ไม่ว่าจะได้จากแผนไหน
  cache.profilesCache.set(cacheKey, result);
  cache.lastFetchTime.set(cacheKey, Date.now());

  return result;
}

// --- HTML Generation ---

function generateMetaTags(provinceData, thaiDate, profilesCount) {
  const title = `รวมสาวไซด์ไลน์${provinceData.nameThai} [อัปเดตล่าสุด ${thaiDate}] รับงานตรงปก`;
  const description = `อัปเดตล่าสุด ${thaiDate}: ศูนย์รวมน้องๆ ไซด์ไลน์จังหวัด${provinceData.nameThai} ${profilesCount}+ คน คัดเกรดพรีเมียม รูปจริง ตรงปก ทุกคน ปลอดภัย 100% ไม่มีมัดจำ`;
  const url = `${DOMAIN}/sideline/province/${provinceData.key}`;
  
  return `
    <title>${sanitizeHTML(title)}</title>
    <meta name="description" content="${sanitizeHTML(description)}">
    <meta property="og:title" content="${sanitizeHTML(title)}">
    <meta property="og:description" content="${sanitizeHTML(description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="th_TH">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="${url}">
  `;
}

function generateStructuredData(provinceData, profiles, thaiDate) {
  const profileList = profiles.map(profile => ({
    "@type": "Person",
    "name": profile.name,
    "url": `${DOMAIN}/sideline/${encodeURIComponent(profile.slug)}`
  }));

  return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "รายชื่อไซด์ไลน์จังหวัด${provinceData.nameThai}",
      "description": "รายชื่อน้องๆรับงาน ไซด์ไลน์ในจังหวัด${provinceData.nameThai}",
      "dateModified": "${new Date().toISOString()}",
      "datePublished": "${thaiDate}",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": ${profiles.length},
        "itemListElement": ${JSON.stringify(profileList.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": item
        })))}
      }
    }
    </script>
  `;
}

function generateProfilesList(profiles) {
  if (!profiles || profiles.length === 0) {
    return '<li class="no-data">ไม่มีข้อมูลน้องๆ ในขณะนี้ หรือกำลังอัปเดตระบบ</li>';
  }

  return profiles.map(profile => {
    const safeSlug = encodeURIComponent(profile.slug);
    const verifiedBadge = profile.verified ? ' <span class="verified">✓</span>' : '';
    const ageInfo = profile.age ? ` <span class="age">(${profile.age})</span>` : '';
    
    return `
      <li class="profile-item">
        <a href="/sideline/${safeSlug}" class="profile-link">
          <span class="profile-name">${sanitizeHTML(profile.name)}</span>
          ${ageInfo}
          ${verifiedBadge}
          ${profile.rating ? `<span class="rating">⭐ ${profile.rating.toFixed(1)}</span>` : ''}
        </a>
      </li>
    `;
  }).join('');
}

function generateHTML(provinceData, profilesData, thaiDate) {
  const { profiles, totalCount } = profilesData;
  
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${generateMetaTags(provinceData, thaiDate, totalCount)}
  ${generateStructuredData(provinceData, profiles, thaiDate)}
  <style>
    :root { --primary: #4a6fa5; --sec: #ff6b6b; --bg: #f8f9fa; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: #333; padding: 20px; max-width: 1200px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, var(--primary), var(--sec)); color: white; padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 2rem; }
    .header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .stats { margin-top: 10px; font-size: 0.9rem; opacity: 0.9; }
    .profiles-list { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .profiles-list h2 { color: var(--primary); border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; font-size: 1.4rem; }
    .profile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; list-style: none; }
    .profile-item { border: 1px solid #eee; padding: 15px; border-radius: 8px; transition: all 0.2s; }
    .profile-item:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-color: var(--primary); }
    .profile-link { text-decoration: none; color: inherit; display: block; }
    .profile-name { font-weight: bold; color: var(--primary); font-size: 1.1rem; }
    .verified { color: #28a745; font-weight: bold; margin-left: 5px; }
    .rating { color: #ffc107; font-size: 0.9rem; }
    .no-data { grid-column: 1/-1; text-align: center; padding: 40px; color: #777; font-style: italic; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 0.9rem; }
    .btn-home { display: inline-block; background: var(--primary); color: white; padding: 8px 20px; border-radius: 20px; text-decoration: none; margin-top: 10px; }
  </style>
</head>
<body>
  <header class="header">
    <h1>รายชื่อน้องๆรับงานไซด์ไลน์จังหวัด${sanitizeHTML(provinceData.nameThai)}</h1>
    <div class="stats">
      อัปเดตล่าสุด: ${thaiDate} | ทั้งหมด ${totalCount} คน
    </div>
  </header>
  
  <main class="profiles-list">
    <h2>📋 รายชื่อน้องๆรับงาน ล่าสุด</h2>
    <ul class="profile-grid">
      ${generateProfilesList(profiles)}
    </ul>
  </main>
  
  <footer class="footer">
    <p>ปลอดภัย 100% • ไม่ต้องมัดจำ • ชำระเงินหน้างานเท่านั้น</p>
    <a href="/" class="btn-home">🏠 กลับหน้าหลัก</a>
  </footer>
</body>
</html>`;
}

// --- Main Logic ---

export default async (request, context) => {
  const startTime = Date.now();
  
  try {
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = BOT_PATTERNS.test(userAgent.toLowerCase());
    
    if (!isBot) return context.next();

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const provinceKey = decodeURIComponent(pathParts[pathParts.length - 1]);
    
    if (!validateProvinceKey(provinceKey)) return context.next();

    const supabase = getSupabaseClient();
    
    // 1. ดึงข้อมูลจังหวัดก่อน (เพื่อเอา ID)
    const provinceData = await fetchProvinceData(supabase, provinceKey);
    if (!provinceData) return context.next();

    // 2. ดึง Profiles โดยส่ง provinceData เข้าไปเพื่อให้ระบบ Smart Logic ทำงาน
    const profilesData = await fetchProfiles(supabase, provinceData);

    const thaiDate = formatThaiDate();
    const html = generateHTML(provinceData, profilesData, thaiDate);
    
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Vary": "User-Agent",
        "X-Province-ID": provinceData.id.toString()
      }
    });

  } catch (error) {
    console.error('Fatal Error:', error);
    // กรณี Error ร้ายแรงจริงๆ ให้ส่งหน้าว่างๆ พร้อม 503 เพื่อให้ Bot กลับมาใหม่
    return new Response("System Update", { status: 503 });
  }
};