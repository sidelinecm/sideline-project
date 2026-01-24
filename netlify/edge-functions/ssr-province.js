import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// Configuration - ควรใช้ Environment Variables ใน production
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';

// Cache สำหรับ reuse connection และข้อมูล
const cache = {
  supabaseClient: null,
  provinces: new Map(),
  profilesCache: new Map(),
  lastFetchTime: new Map()
};

// Constants
const CACHE_DURATION = 30 * 60 * 1000; // 30 นาที
const MAX_PROFILES = 100;
const BOT_PATTERNS = /bot|spider|crawl|facebook|twitter|whatsapp|telegram|slack|discord|skype|zoom|line/i;

// ✅ 1. เพิ่มตัวแปร DOMAIN ที่นี่
const DOMAIN = 'https://sidelinechiangmai.netlify.app';

// Helper Functions
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
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const formatThaiDate = () => {
  const now = new Date();
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    timeZone: 'Asia/Bangkok'
  };
  return now.toLocaleDateString('th-TH', options);
};

const validateProvinceKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  if (key.length > 100) return false;
  if (!/^[a-zA-Z0-9ก-๙\-_]+$/.test(key)) return false;
  return true;
};

// Data Fetching Functions
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
    console.error(`Error fetching province ${provinceKey}:`, error);
    return null;
  }
}

async function fetchProfiles(supabase, provinceKey) {
  const cacheKey = `profiles_${provinceKey}`;
  
  if (cache.profilesCache.has(cacheKey) && isCacheValid(cacheKey)) {
    return cache.profilesCache.get(cacheKey);
  }

  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('name, slug, age, rating, verified, created_at', { 
        count: 'exact',
        head: false 
      })
      .eq('provinceKey', provinceKey)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(MAX_PROFILES);

    if (error) throw error;

    const result = {
      profiles: data || [],
      totalCount: count || 0
    };

    cache.profilesCache.set(cacheKey, result);
    cache.lastFetchTime.set(cacheKey, Date.now());

    return result;
  } catch (error) {
    console.error(`Error fetching profiles for ${provinceKey}:`, error);
    return { profiles: [], totalCount: 0 };
  }
}

// HTML Generation Functions
function generateMetaTags(provinceData, thaiDate, profilesCount) {
  const title = `รวมสาวไซด์ไลน์${provinceData.nameThai} [อัปเดตล่าสุด ${thaiDate}] รับงานตรงปก`;
  const description = `อัปเดตล่าสุด ${thaiDate}: ศูนย์รวมน้องๆ ไซด์ไลน์จังหวัด${provinceData.nameThai} ${profilesCount}+ คน คัดเกรดพรีเมียม รูปจริง ตรงปก ทุกคน ปลอดภัย 100% ไม่มีมัดจำ`;
  
  return `
    <title>${sanitizeHTML(title)}</title>
    <meta name="description" content="${sanitizeHTML(description)}">
    <meta name="keywords" content="ไซด์ไลน์, ${provinceData.nameThai}, รับงาน, พาร์ทไทม์, ฟิวแฟน, นักศึกษา, งานพิเศษ, ตรงปก, ไม่มีมัดจำ">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta property="og:title" content="${sanitizeHTML(title)}">
    <meta property="og:description" content="${sanitizeHTML(description)}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="th_TH">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${sanitizeHTML(title)}">
    <meta name="twitter:description" content="${sanitizeHTML(description)}">
    {/* ✅ 2. แก้ไข Canonical URL ให้ถูกต้อง (สอดคล้องกับ main.js) */}
    <link rel="canonical" href="${DOMAIN}/location/${provinceData.key}">
  `;
}

function generateStructuredData(provinceData, profiles, thaiDate) {
  const profileList = profiles.map(profile => ({
    "@type": "Person",
    "name": profile.name,
    // ✅ 3. แก้ไข URL ของโปรไฟล์แต่ละคนให้ถูกต้อง
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
    return '<li class="no-data">ไม่มีข้อมูลน้องๆ ในขณะนี้</li>';
  }

  return profiles.map(profile => {
    const safeSlug = encodeURIComponent(profile.slug);
    const verifiedBadge = profile.verified ? ' <span class="verified">✓</span>' : '';
    const ageInfo = profile.age ? ` <span class="age">(${profile.age})</span>` : '';
    
    return `
      <li class="profile-item">
        {/* ลิงก์แบบ Relative Path ถูกต้องแล้ว ไม่ต้องแก้ไข */}
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

// ... ส่วนที่เหลือของโค้ด (generateHTML, Main Handler) ไม่ต้องแก้ไข ...
// ... (คัดลอกส่วนที่เหลือจากไฟล์เดิมมาต่อได้เลย) ...

function generateHTML(provinceData, profilesData, thaiDate) {
  const profiles = profilesData.profiles;
  const totalCount = profilesData.totalCount;
  
  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${generateMetaTags(provinceData, thaiDate, totalCount)}
  ${generateStructuredData(provinceData, profiles, thaiDate)}
  <style>
    :root {
      --primary-color: #4a6fa5;
      --secondary-color: #ff6b6b;
      --text-color: #333;
      --bg-color: #f8f9fa;
      --card-bg: #ffffff;
      --border-color: #e0e0e0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Sarabun', 'Kanit', sans-serif;
      line-height: 1.6;
      color: var(--text-color);
      background-color: var(--bg-color);
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      padding: 2rem;
      border-radius: 10px;
      margin-bottom: 2rem;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    .stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
    
    .stat-item {
      background: rgba(255,255,255,0.2);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: bold;
    }
    
    .profiles-list {
      background: var(--card-bg);
      border-radius: 10px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .profiles-list h2 {
      color: var(--primary-color);
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--border-color);
    }
    
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      list-style: none;
    }
    
    .profile-item {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .profile-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .profile-link {
      text-decoration: none;
      color: var(--text-color);
      display: block;
    }
    
    .profile-name {
      font-weight: bold;
      color: var(--primary-color);
      display: block;
      margin-bottom: 0.25rem;
    }
    
    .verified {
      color: #4CAF50;
      font-weight: bold;
    }
    
    .age {
      color: #666;
      font-size: 0.9em;
    }
    
    .rating {
      color: #FFC107;
      font-size: 0.9em;
      margin-left: 0.5rem;
    }
    
    .no-data {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 2rem;
      grid-column: 1 / -1;
    }
    
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color);
      color: #666;
    }
    
    .back-link {
      display: inline-block;
      background: var(--primary-color);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 5px;
      text-decoration: none;
      font-weight: bold;
      transition: background 0.3s;
    }
    
    .back-link:hover {
      background: #3a5a8c;
    }
    
    @media (max-width: 768px) {
      .header h1 {
        font-size: 1.8rem;
      }
      
      .profile-grid {
        grid-template-columns: 1fr;
      }
      
      .stats {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
    }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&family=Kanit:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
  <header class="header">
    <h1>รายชื่อน้องๆรับงานไซด์ไลน์จังหวัด${sanitizeHTML(provinceData.nameThai)}</h1>
    <p>อัปเดตล่าสุด: ${thaiDate}</p>
    <div class="stats">
      <div class="stat-item">ทั้งหมด ${totalCount} คน</div>
      <div class="stat-item">แสดงล่าสุด ${Math.min(MAX_PROFILES, totalCount)} คน</div>
      ${provinceData.region ? `<div class="stat-item">ภูมิภาค: ${provinceData.region}</div>` : ''}
    </div>
  </header>
  
  <main class="profiles-list">
    <h2>📋 รายชื่อน้องๆรับงาน ล่าสุด</h2>
    <ul class="profile-grid">
      ${generateProfilesList(profiles)}
    </ul>
  </main>
  
  <footer class="footer">
    <p>ข้อมูลถูกอัปเดตอัตโนมัติทุกวัน • ปลอดภัย 100% • ไม่ต้องมัดจำ ชำระเงินหน้างานเท่านั้นตรวจสอบแล้ว</p>
    <a href="/" class="back-link">🏠 กลับหน้าหลัก</a>
    <p style="margin-top: 1rem; font-size: 0.9em; color: #999;">
      © ${new Date().getFullYear()} All rights reserved.
    </p>
  </footer>
  
  <script>
    // Performance monitoring
    window.addEventListener('load', function() {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      console.log('Page loaded in', loadTime, 'ms');
      
      // Track user engagement
      document.querySelectorAll('.profile-link').forEach(link => {
        link.addEventListener('click', function(e) {
          console.log('Profile clicked:', this.href);
        });
      });
    });
  </script>
</body>
</html>`;

  return html;
}

// Main Handler
export default async (request, context) => {
  const startTime = Date.now();
  
  try {
    // Bot Detection
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = BOT_PATTERNS.test(userAgent.toLowerCase());
    
    if (!isBot) {
      console.log(`Non-bot request from: ${userAgent}`);
      return context.next();
    }

    // Parse URL and validate
    const url = new URL(request.url);
    const provinceKey = decodeURIComponent(url.pathname.split('/').pop());
    
    if (!validateProvinceKey(provinceKey)) {
      console.warn(`Invalid province key: ${provinceKey}`);
      return context.next();
    }

    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Fetch data in parallel for better performance
    const [provinceData, profilesData] = await Promise.all([
      fetchProvinceData(supabase, provinceKey),
      fetchProfiles(supabase, provinceKey)
    ]);

    // Validate data
    if (!provinceData) {
      console.log(`Province not found: ${provinceKey}`);
      return context.next();
    }

    // Generate response
    const thaiDate = formatThaiDate();
    const html = generateHTML(provinceData, profilesData, thaiDate);
    
    const processingTime = Date.now() - startTime;
    console.log(`Generated page for ${provinceKey} in ${processingTime}ms`);
    
    // Return response with caching headers
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=1800, s-maxage=3600", // Cache 30-60 minutes
        "Vary": "User-Agent",
        "X-Processing-Time": `${processingTime}ms`,
        "X-Province": provinceData.nameThai,
        "X-Total-Profiles": profilesData.totalCount.toString()
      }
    });

  } catch (error) {
    // Enhanced error handling
    console.error('Error in province page handler:', {
      url: request.url,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Return error page for bots, fallback for users
    if (BOT_PATTERNS.test(request.headers.get('User-Agent') || '')) {
      const errorHtml = `<!DOCTYPE html>
<html>
<head><title>เกิดข้อผิดพลาด</title></head>
<body>
  <h1>ขออภัย กำลังปรับปรุงระบบ</h1>
  <p>กรุณาลองใหม่อีกครั้งในภายหลัง</p>
</body>
</html>`;
      
      return new Response(errorHtml, {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }
    
    return context.next();
  }
};