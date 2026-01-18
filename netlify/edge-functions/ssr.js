import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================
// CONFIGURATION - SINGLE SOURCE
// ============================================
const CONFIG = {
  SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
  DOMAIN: 'https://sidelinechiangmai.netlify.app',
  SITE_NAME: 'Sideline Chiangmai',
  
  // Performance Settings
  CACHE_DURATION: 15 * 60 * 1000, // 15 minutes
  MAX_PROFILES: 30,
  MAX_CACHE_ITEMS: 100,
  
  // Bot Detection Patterns
  BOT_PATTERNS: /(bot|spider|crawl|googlebot|bingbot|applebot|facebookexternalhit|facebot|twitterbot|whatsapp|telegram|slack|discord|skype|zoom|line|pinterest|linkedin|tiktok|slurp|duckduckbot|baidu|yandex|seo|ia_archiver|embedly|quora|outbrain|pocket|flipboard|buffer|iframely|vk|okhttp|sitechecker|validator|checker|monitor)/i,
  SOCIAL_REFERERS: /(facebook\.com|twitter\.com|t\.co|linkedin\.com|pinterest\.com|tiktok\.com|line\.me|telegram\.me|whatsapp\.com|instagram\.com)/i
};

// ============================================
// CACHE SYSTEM - UNIFIED & OPTIMIZED
// ============================================
class SmartCache {
  constructor() {
    this.provinces = new Map();
    this.profiles = new Map();
    this.ssrPages = new Map();
    this.timestamps = new Map();
    this.supabaseClient = null;
  }

  getSupabaseClient() {
    if (!this.supabaseClient) {
      this.supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY, {
        auth: { persistSession: false },
        global: { 
          headers: { 
            'x-application-name': 'unified-ssr-renderer',
            'x-request-id': `ssr-${Date.now()}`,
            'Accept': 'application/json'
          }
        },
        db: { schema: 'public' }
      });
    }
    return this.supabaseClient;
  }

  get(key, type = 'ssr') {
    const cacheMap = this[type];
    const item = cacheMap.get(key);
    if (!item) return null;
    
    const timestamp = this.timestamps.get(`${type}_${key}`);
    if (!timestamp || (Date.now() - timestamp) > CONFIG.CACHE_DURATION) {
      this.delete(key, type);
      return null;
    }
    
    return item;
  }

  set(key, value, type = 'ssr') {
    // Cleanup if cache is full
    if (this[type].size >= CONFIG.MAX_CACHE_ITEMS) {
      const oldestKey = Array.from(this.timestamps.entries())
        .filter(([k]) => k.startsWith(`${type}_`))
        .sort((a, b) => a[1] - b[1])[0];
      
      if (oldestKey) {
        const [cacheKey] = oldestKey;
        const itemKey = cacheKey.replace(`${type}_`, '');
        this.delete(itemKey, type);
      }
    }
    
    this[type].set(key, value);
    this.timestamps.set(`${type}_${key}`, Date.now());
  }

  delete(key, type = 'ssr') {
    this[type].delete(key);
    this.timestamps.delete(`${type}_${key}`);
  }

  clear() {
    this.provinces.clear();
    this.profiles.clear();
    this.ssrPages.clear();
    this.timestamps.clear();
  }
}

const cache = new SmartCache();

// ============================================
// HELPER FUNCTIONS - OPTIMIZED
// ============================================

function sanitizeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatThaiDate() {
  const now = new Date();
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  const day = now.getDate();
  const month = thaiMonths[now.getMonth()];
  const year = now.getFullYear() + 543;
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  
  return `${day} ${month} ${year} ${hour}:${minute} น.`;
}

function validateSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  if (slug.length > 100 || slug.length < 2) return false;
  
  const reservedWords = [
    'province', 'category', 'search', 'app', 'login', 'register', 
    'api', 'admin', 'dashboard', 'user', 'profile', 'edit',
    'location', 'locations', 'provinces', 'categories'
  ];
  
  if (reservedWords.includes(slug.toLowerCase())) return false;
  

  return slug.length > 0; 
}

function isBotRequest(request) {
  const ua = (request.headers.get('User-Agent') || '').toLowerCase();
  const referer = request.headers.get('Referer') || '';
  const accept = request.headers.get('Accept') || '';
  
  // Check User-Agent
  if (CONFIG.BOT_PATTERNS.test(ua)) return true;
  
  // Check Referer (Social Media)
  if (CONFIG.SOCIAL_REFERERS.test(referer)) return true;
  
  // Check Accept header
  if (accept.includes('text/html') && !accept.includes('text/html,application/xhtml+xml')) {
    return true;
  }
  
  // Check other headers
  const via = request.headers.get('Via');
  const xPurpose = request.headers.get('X-Purpose');
  const xMoz = request.headers.get('X-Moz');
  const xForwardedFor = request.headers.get('X-Forwarded-For');
  
  if (via && via.includes('preview')) return true;
  if (xPurpose === 'preview') return true;
  if (xMoz === 'prefetch') return true;
  if (xForwardedFor && xForwardedFor.includes('crawler')) return true;
  
  return false;
}

function createFallbackProvince(provinceKey) {
  const thaiNames = {
    'chiangmai': 'เชียงใหม่',
    'bangkok': 'กรุงเทพ',
    'phuket': 'ภูเก็ต',
    'pattaya': 'พัทยา',
    'chonburi': 'ชลบุรี',
    'samui': 'สมุย',
    'krabi': 'กระบี่',
    'hua hin': 'หัวหิน',
    'ayutthaya': 'อยุธยา',
    'kanchanaburi': 'กาญจนบุรี'
  };
  
  const nameThai = thaiNames[provinceKey] || 
    provinceKey.charAt(0).toUpperCase() + provinceKey.slice(1);
  
  return {
    id: 0,
    nameThai,
    nameEng: provinceKey,
    key: provinceKey,
    region: 'ภาคเหนือ',
    description: `ศูนย์รวมน้องๆไซด์ไลน์จังหวัด${nameThai} รูปจริง ปลอดภัย 100%`
  };
}

// ============================================
// DATA FETCHING - UNIFIED
// ============================================

async function fetchProvinceData(provinceKey) {
  const cacheKey = `province_${provinceKey}`;
  
  const cached = cache.get(cacheKey, 'provinces');
  if (cached) return cached;
  
  const supabase = cache.getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('provinces')
      .select('id, nameThai, nameEng, key, region, description, slug')
      .eq('key', provinceKey)
      .maybeSingle();

    if (error) {
      console.warn(`Province fetch error for ${provinceKey}:`, error.message);
      return null;
    }
    
    if (data) {
      cache.set(cacheKey, data, 'provinces');
      return data;
    }
    
    // Fallback province
    const fallbackData = createFallbackProvince(provinceKey);
    cache.set(cacheKey, fallbackData, 'provinces');
    return fallbackData;
    
  } catch (error) {
    console.error(`Fetch Province Error (${provinceKey}):`, error);
    return null;
  }
}

async function fetchProfiles(provinceData) {
  const provinceKey = provinceData.key;
  const provinceId = provinceData.id;
  const cacheKey = `profiles_${provinceKey}`;
  
  const cached = cache.get(cacheKey, 'profiles');
  if (cached) return cached;
  
  // ถ้าเป็น fallback province
  if (provinceId === 0) {
    const result = { 
      profiles: [], 
      totalCount: 0,
      fetchedAt: new Date().toISOString(),
      isFallback: true
    };
    
    cache.set(cacheKey, result, 'profiles');
    return result;
  }
  
  const supabase = cache.getSupabaseClient();
  let profiles = [];
  let totalCount = 0;
  
  const selectColumns = 'id, name, slug, age, rate, imagePath, verified, created_at, description';
  
  try {
    // Strategy 1: province_id
    const { data, error, count } = await supabase
      .from('profiles')
      .select(selectColumns, { count: 'exact' })
      .eq('province_id', provinceId)
      .eq('active', true)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(CONFIG.MAX_PROFILES);

    if (!error && data) {
      profiles = data;
      totalCount = count || 0;
    } else {
      // Strategy 2: provinceKey column
      const { data: data2, error: error2, count: count2 } = await supabase
        .from('profiles')
        .select(selectColumns, { count: 'exact' })
        .eq('provinceKey', provinceKey)
        .eq('active', true)
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(CONFIG.MAX_PROFILES);

      if (!error2 && data2) {
        profiles = data2;
        totalCount = count2 || 0;
      } else {
        // Strategy 3: location fuzzy match
        const { data: data3 } = await supabase
          .from('profiles')
          .select(selectColumns, { count: 'exact' })
          .ilike('location', `%${provinceData.nameThai}%`)
          .eq('active', true)
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(CONFIG.MAX_PROFILES);

        if (data3) {
          profiles = data3;
          totalCount = data3.length;
        }
      }
    }
  } catch (error) {
    console.warn(`Profile fetch error for ${provinceKey}:`, error.message);
  }
  
  // Process profiles
  const processedProfiles = profiles.map(profile => ({
    ...profile,
    displayName: profile.name ? 
      (profile.name.startsWith('น้อง') ? profile.name : `น้อง${profile.name}`) : 
      'น้องไซด์ไลน์',
    imageUrl: profile.imagePath 
      ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${profile.imagePath}`
      : `${CONFIG.DOMAIN}/images/default-avatar.webp`,
    displayRate: profile.rate 
      ? `${parseInt(profile.rate).toLocaleString('th-TH')} บาท`
      : 'สอบถามราคา',
    shortDescription: profile.description 
      ? (profile.description.length > 100 
          ? profile.description.substring(0, 100) + '...' 
          : profile.description)
      : 'น้องๆไซด์ไลน์บริการดี ปลอดภัย 100%'
  }));

  const result = { 
    profiles: processedProfiles, 
    totalCount,
    fetchedAt: new Date().toISOString(),
    isFallback: false
  };
  
  cache.set(cacheKey, result, 'profiles');
  return result;
}

async function fetchProfileData(slug) {
  const cacheKey = `profile_${slug}`;
  
  const cached = cache.get(cacheKey, 'profiles');
  if (cached) return cached;
  
  const supabase = cache.getSupabaseClient();
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, provinces(nameThai, key)')
      .eq('slug', slug)
      .eq('active', true)
      .eq('approved', true)
      .maybeSingle();

    if (error || !profile) {
      return null;
    }
    
    cache.set(cacheKey, profile, 'profiles');
    return profile;
    
  } catch (error) {
    console.error(`Fetch Profile Error (${slug}):`, error);
    return null;
  }
}

// ============================================
// HTML GENERATION - UNIFIED TEMPLATES
// ============================================

function generateMetaTags(data, type, thaiDate) {
  let title, description, canonicalUrl, imageUrl;
  
  if (type === 'province') {
    const { province, profiles } = data;
    const profileCount = profiles.totalCount;
    const provinceName = province.nameThai;
    
    if (profileCount > 0) {
      title = `รวมสาวไซด์ไลน์${provinceName} ${profileCount}+ คน [อัปเดต ${thaiDate}] รับงานฟรีแลนซ์`;
      description = `อัปเดตล่าสุด ${thaiDate}: ค้นหารายชื่อน้องๆไซด์ไลน์จังหวัด${provinceName} ${profileCount}+ คน รูปจริง ตรงปก 100% ปลอดภัย ไม่มัดจำ จ่ายเงินหน้างานเท่านั้น`;
    } else {
      title = `ไซด์ไลน์${provinceName} - ศูนย์รวมน้องๆรับงานจังหวัด${provinceName}`;
      description = `ศูนย์รวมน้องๆไซด์ไลน์จังหวัด${provinceName} บริการดี ปลอดภัย 100% ไม่มีมัดจำ รูปจริงทุกคน ตรวจสอบแล้ว`;
    }
    
    canonicalUrl = `${CONFIG.DOMAIN}/location/${province.key}`;
    imageUrl = `${CONFIG.DOMAIN}/images/og-province-${province.key}.webp`;
    
  } else if (type === 'profile') {
    const { profile } = data;
    const provinceName = profile.provinces?.nameThai || profile.location || 'เชียงใหม่';
    const provinceKey = profile.provinces?.key || 'chiangmai';
    
    const rawName = profile.name || 'ไม่มีชื่อ';
    const cleanName = rawName.replace(/^(น้องน้อง|น้องๆ|น้อง|สาวสาว|สาวๆ|สาว)/, '').trim();
    const displayName = cleanName ? `น้อง${cleanName}` : 'น้องสาวไซด์ไลน์';
    
    const ageText = (profile.age && profile.age !== 'null' && profile.age !== '0') ? `${profile.age}+` : '20+';
    
    title = `${displayName} ${provinceName} ไซด์ไลน์${provinceName} รับงานฟิวแฟน ตรงปก 100%`;
    description = `${displayName} สาวไซด์ไลน์${provinceName} รับงานฟิวแฟน อายุ ${ageText} ปี พิกัด${profile.location || provinceName} ไม่ต้องมัดจำ จ่ายเงินหน้างาน รูปตรงปก 100% บริการระดับพรีเมียม จองคิวคลิกเลย!`;
    
    canonicalUrl = `${CONFIG.DOMAIN}/sideline/${encodeURIComponent(profile.slug)}`;
    imageUrl = profile.imagePath 
      ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${profile.imagePath}`
      : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
  }
  
  return `
    <!-- Primary Meta Tags -->
    <title>${sanitizeHTML(title)}</title>
    <meta name="description" content="${sanitizeHTML(description)}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${type === 'profile' ? 'profile' : 'website'}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${sanitizeHTML(title)}">
    <meta property="og:description" content="${sanitizeHTML(description)}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="th_TH">
    <meta property="og:site_name" content="${CONFIG.SITE_NAME}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${canonicalUrl}">
    <meta property="twitter:title" content="${sanitizeHTML(title)}">
    <meta property="twitter:description" content="${sanitizeHTML(description)}">
    <meta property="twitter:image" content="${imageUrl}">
    
    <!-- Canonical -->
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Robots -->
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="googlebot" content="index, follow">
  `;
}

function generateStructuredData(data, type) {
  if (type === 'province') {
    const { province, profiles } = data;
    const provinceName = province.nameThai;
    const profileCount = profiles.totalCount;
    
    const profileListItems = profiles.profiles.slice(0, 10).map((profile, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${CONFIG.DOMAIN}/sideline/${encodeURIComponent(profile.slug)}`,
      "name": profile.displayName
    }));

    return `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "${CONFIG.DOMAIN}/location/${province.key}",
            "url": "${CONFIG.DOMAIN}/location/${province.key}",
            "name": "ไซด์ไลน์จังหวัด${provinceName}",
            "description": "รายชื่อน้องๆรับงานฟรีแลนซ์จังหวัด${provinceName}",
            "datePublished": "${new Date().toISOString()}",
            "dateModified": "${new Date().toISOString()}",
            "inLanguage": "th-TH",
            "isPartOf": {
              "@id": "${CONFIG.DOMAIN}/#website"
            },
            "primaryImageOfPage": {
              "@id": "${CONFIG.DOMAIN}/images/og-province-${province.key}.webp"
            }
          },
          {
            "@type": "ItemList",
            "itemListElement": ${JSON.stringify(profileListItems)},
            "numberOfItems": ${profileCount},
            "name": "รายชื่อไซด์ไลน์จังหวัด${provinceName}"
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "หน้าแรก",
                "item": "${CONFIG.DOMAIN}"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "จังหวัด",
                "item": "${CONFIG.DOMAIN}/location"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "${provinceName}",
                "item": "${CONFIG.DOMAIN}/location/${province.key}"
              }
            ]
          }
        ]
      }
      </script>
    `;
    
  } else if (type === 'profile') {
    const { profile } = data;
    const provinceName = profile.provinces?.nameThai || profile.location || 'เชียงใหม่';
    const provinceKey = profile.provinces?.key || 'chiangmai';
    
    const rawName = profile.name || 'ไม่มีชื่อ';
    const cleanName = rawName.replace(/^(น้องน้อง|น้องๆ|น้อง|สาวสาว|สาวๆ|สาว)/, '').trim();
    const displayName = cleanName ? `น้อง${cleanName}` : 'น้องสาวไซด์ไลน์';
    
    const imageUrl = profile.imagePath 
      ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${profile.imagePath}`
      : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
    
    const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${encodeURIComponent(profile.slug)}`;
    
    return `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "name": "${displayName}",
            "description": "สาวไซด์ไลน์${provinceName} รับงานฟิวแฟน",
            "image": "${imageUrl}",
            "url": "${canonicalUrl}",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "${provinceName}",
              "addressRegion": "ประเทศไทย"
            },
            "worksFor": {
              "@type": "Organization",
              "name": "${CONFIG.SITE_NAME}"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "หน้าแรก",
                "item": "${CONFIG.DOMAIN}"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "${provinceName}",
                "item": "${CONFIG.DOMAIN}/location/${provinceKey}"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "${displayName}",
                "item": "${canonicalUrl}"
              }
            ]
          }
        ]
      }
      </script>
    `;
  }
  
  return '';
}

function generateProvinceHTML(provinceData, profilesData, thaiDate) {
  const provinceName = provinceData.nameThai;
  const profileCount = profilesData.totalCount;
  const isFallback = profilesData.isFallback;
  
  // Generate profiles grid
  let profilesGridHTML;
  if (isFallback) {
    profilesGridHTML = `
      <div class="no-profiles">
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>กำลังรวบรวมข้อมูลจังหวัดนี้</h3>
          <p>เรากำลังอัปเดตรายชื่อน้องๆในจังหวัดนี้ กรุณาติดต่อทีมงานหรือลองค้นหาจังหวัดอื่น</p>
          <div class="empty-actions">
            <a href="/location" class="btn-primary">
              🔍 ดูจังหวัดอื่นๆ
            </a>
            <a href="/contact" class="btn-secondary">
              📞 ติดต่อทีมงาน
            </a>
          </div>
        </div>
      </div>
    `;
  } else if (!profilesData.profiles || profilesData.profiles.length === 0) {
    profilesGridHTML = `
      <div class="no-profiles">
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>ยังไม่มีน้องๆในจังหวัดนี้</h3>
          <p>ขณะนี้ยังไม่มีน้องๆลงทะเบียนในจังหวัดนี้ กรุณาติดต่อทีมงานหรือลองค้นหาจังหวัดอื่น</p>
          <a href="/location" class="btn-primary">
            🔍 ดูจังหวัดอื่นๆ
          </a>
        </div>
      </div>
    `;
  } else {
    profilesGridHTML = profilesData.profiles.map(profile => `
      <article class="profile-card" itemscope itemtype="https://schema.org/Person">
        <div class="profile-image">
          <img src="${profile.imageUrl}" 
               alt="${profile.displayName}" 
               loading="lazy" 
               itemprop="image"
               onerror="this.src='${CONFIG.DOMAIN}/images/default-avatar.webp'">
          ${profile.verified ? '<span class="verified-badge" title="ตรวจสอบแล้ว">✓</span>' : ''}
        </div>
        <div class="profile-info">
          <h3 class="profile-name" itemprop="name">
            <a href="/sideline/${encodeURIComponent(profile.slug)}" itemprop="url">
              ${sanitizeHTML(profile.displayName)}
            </a>
          </h3>
          <div class="profile-meta">
            <span class="age" itemprop="age">${profile.age || '20+'} ปี</span>
            <span class="rate" itemprop="price">${profile.displayRate}</span>
          </div>
          <p class="profile-desc" itemprop="description">${sanitizeHTML(profile.shortDescription)}</p>
          <a href="/sideline/${encodeURIComponent(profile.slug)}" class="btn-view" itemprop="url">
            👀 ดูโปรไฟล์
          </a>
        </div>
      </article>
    `).join('');
  }
  
  return `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  ${generateMetaTags({ province: provinceData, profiles: profilesData }, 'province', thaiDate)}
  ${generateStructuredData({ province: provinceData, profiles: profilesData }, 'province')}
  <style>
    /* Unified CSS - Province Page */
    :root {
      --primary: #db2777;
      --primary-dark: #be185d;
      --secondary: #7c3aed;
      --accent: #f59e0b;
      --light: #f8fafc;
      --dark: #1e293b;
      --gray: #64748b;
      --success: #10b981;
      --border: #e2e8f0;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --radius: 12px;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      color: var(--dark);
      line-height: 1.6;
      min-height: 100vh;
      padding: 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      background: white;
      border-radius: var(--radius);
      padding: 40px 30px;
      margin-bottom: 30px;
      box-shadow: var(--shadow);
      text-align: center;
      border-bottom: 4px solid var(--primary);
    }
    
    .header h1 {
      font-size: 2.5rem;
      color: var(--dark);
      margin-bottom: 10px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .stats {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 25px 0;
      flex-wrap: wrap;
    }
    
    .stat-item {
      background: var(--light);
      padding: 12px 24px;
      border-radius: 50px;
      border: 2px solid var(--border);
      font-weight: 600;
      color: var(--secondary);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .profiles-section {
      background: white;
      border-radius: var(--radius);
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: var(--shadow);
    }
    
    .profiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
    }
    
    .profile-card {
      border: 2px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      transition: all 0.3s ease;
      background: white;
    }
    
    .profile-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }
    
    .profile-image {
      position: relative;
      height: 220px;
      overflow: hidden;
    }
    
    .profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .profile-card:hover .profile-image img {
      transform: scale(1.05);
    }
    
    .verified-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      background: var(--success);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      border: 3px solid white;
      box-shadow: var(--shadow);
    }
    
    .profile-info {
      padding: 20px;
    }
    
    .profile-name {
      font-size: 1.3rem;
      color: var(--dark);
      margin-bottom: 10px;
    }
    
    .profile-name a {
      color: inherit;
      text-decoration: none;
    }
    
    .profile-name a:hover {
      color: var(--primary);
    }
    
    .profile-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 0.95rem;
    }
    
    .age { color: var(--secondary); font-weight: 600; }
    .rate { color: var(--accent); font-weight: bold; }
    
    .btn-view {
      display: block;
      text-align: center;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      width: 100%;
    }
    
    .btn-view:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      grid-column: 1 / -1;
    }
    
    .empty-icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.5; }
    
    .empty-state h3 {
      color: var(--dark);
      margin-bottom: 10px;
      font-size: 1.5rem;
    }
    
    .empty-state p {
      color: var(--gray);
      margin-bottom: 30px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .empty-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-primary, .btn-secondary {
      display: inline-block;
      padding: 12px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .btn-primary {
      background: var(--primary);
      color: white;
    }
    
    .btn-secondary {
      background: var(--light);
      color: var(--dark);
      border: 2px solid var(--border);
    }
    
    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }
    
    .disclaimer {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
      color: #856404;
      font-size: 0.85rem;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid var(--border);
      color: var(--gray);
      font-size: 0.9rem;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    
    .footer-links a {
      color: var(--primary);
      text-decoration: none;
    }
    
    .footer-links a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .container { padding: 15px; }
      .header { padding: 30px 20px; }
      .header h1 { font-size: 1.8rem; }
      .profiles-section { padding: 20px; }
      .profiles-grid { grid-template-columns: 1fr; }
      .stats { flex-direction: column; align-items: center; }
    }
    
    @media (max-width: 480px) {
      .header h1 { font-size: 1.5rem; }
      .profile-image { height: 180px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header" role="banner">
      <h1>📍 ไซด์ไลน์จังหวัด${provinceName}</h1>
      <p class="subtitle">ศูนย์รวมน้องๆรับงานฟรีแลนซ์จังหวัด${provinceName}</p>
      
      <div class="stats">
        <div class="stat-item">👥 ${profileCount} คน</div>
        <div class="stat-item">📅 อัปเดต ${thaiDate}</div>
        <div class="stat-item">✅ ตรวจสอบแล้ว</div>
      </div>
    </header>
    
    <main class="profiles-section" role="main">
      <h2 class="section-title">
        <span>✨</span> รายชื่อน้องๆล่าสุด
      </h2>
      <div class="profiles-grid">
        ${profilesGridHTML}
      </div>
    </main>
    
    <div class="disclaimer" role="note">
      <strong>⚠️ ข้อควรทราบ:</strong> ข้อมูลทั้งหมดเป็นไปตามที่ผู้ใช้ระบุ กรุณาตรวจสอบข้อมูลกับน้องๆโดยตรงก่อนการติดต่อ ทางเว็บไซต์ไม่รับผิดชอบต่อการติดต่อหรือธุรกรรมใดๆ
    </div>
    
    <footer class="footer" role="contentinfo">
      <p>© ${new Date().getFullYear()} ${CONFIG.SITE_NAME} - ปลอดภัย 100% ไม่มีมัดจำ</p>
      <div class="footer-links">
        <a href="/">หน้าแรก</a>
        <a href="/location">จังหวัดทั้งหมด</a>
        <a href="/about">เกี่ยวกับเรา</a>
        <a href="/contact">ติดต่อเรา</a>
        <a href="/privacy">นโยบายความเป็นส่วนตัว</a>
      </div>
      <p><a href="/" style="color: var(--primary); text-decoration: none;">🏠 กลับหน้าหลัก</a></p>
    </footer>
  </div>
</body>
</html>`;
}

function generateProfileHTML(profileData, thaiDate) {
  const provinceName = profileData.provinces?.nameThai || profileData.location || 'เชียงใหม่';
  const provinceKey = profileData.provinces?.key || 'chiangmai';
  
  const rawName = profileData.name || 'ไม่มีชื่อ';
  const cleanName = rawName.replace(/^(น้องน้อง|น้องๆ|น้อง|สาวสาว|สาวๆ|สาว)/, '').trim();
  const displayName = cleanName ? `น้อง${cleanName}` : 'น้องสาวไซด์ไลน์';
  
  const rawRate = profileData.rate ? parseInt(profileData.rate.toString().replace(/[^0-9]/g, '')) : 0;
  const displayPrice = rawRate > 0 ? `${rawRate.toLocaleString('th-TH')}.-` : 'สอบถาม';
  const ageText = (profileData.age && profileData.age !== 'null' && profileData.age !== '0') ? `${profileData.age}+` : '20+';
  
  const imageUrl = profileData.imagePath 
    ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${profileData.imagePath}`
    : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
  
  const rawLine = profileData.lineId || 'ksLUWB89Y_';
  let lineHref;
  if (rawLine.includes('line.me') || rawLine.startsWith('http')) {
    lineHref = rawLine;
  } else {
    const cleanLineId = rawLine.replace(/[@\s]/g, '');
    lineHref = `https://line.me/ti/p/${cleanLineId}`;
  }
  
  return `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${generateMetaTags({ profile: profileData }, 'profile', thaiDate)}
  ${generateStructuredData({ profile: profileData }, 'profile')}
  <style>
    /* Unified CSS - Profile Page */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      color: #333;
    }
    
    .container {
      max-width: 480px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .hero-img {
      width: 100%;
      height: 320px;
      object-fit: cover;
      display: block;
    }
    
    .content {
      padding: 25px;
    }
    
    h1 {
      color: #db2777;
      font-size: 24px;
      margin-bottom: 12px;
      line-height: 1.3;
      font-weight: 800;
    }
    
    .rating {
      background: #fffbeb;
      border: 2px solid #f59e0b;
      color: #d97706;
      padding: 8px 16px;
      border-radius: 50px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      transition: transform 0.2s;
    }
    
    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .info-card .label {
      color: #64748b;
      font-size: 12px;
      margin-bottom: 4px;
    }
    
    .info-card .value {
      color: #1e293b;
      font-size: 16px;
      font-weight: 700;
    }
    
    .btn-contact {
      display: block;
      background: linear-gradient(135deg, #06c755 0%, #05a546 100%);
      color: white;
      text-align: center;
      padding: 18px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 800;
      font-size: 18px;
      box-shadow: 0 10px 20px rgba(6, 199, 85, 0.3);
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    
    .btn-contact:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(6, 199, 85, 0.4);
    }
    
    .btn-contact:active {
      transform: translateY(0);
    }
    
    .disclaimer {
      margin-top: 25px;
      padding: 15px;
      background: #f1f5f9;
      border-radius: 12px;
      font-size: 12px;
      color: #64748b;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    
    .update-time {
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
      margin-top: 15px;
    }
    
    @media (max-width: 480px) {
      .container {
        border-radius: 15px;
      }
      
      .hero-img {
        height: 280px;
      }
      
      .content {
        padding: 20px;
      }
      
      h1 {
        font-size: 20px;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      
      .btn-contact {
        padding: 15px;
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${imageUrl}" class="hero-img" alt="${sanitizeHTML(displayName)}" loading="lazy">
    <div class="content">
      <div class="rating">
        ⭐ 4.8 • 120+ รีวิว
      </div>
      <h1>${sanitizeHTML(displayName)} ${provinceName} ไซด์ไลน์${provinceName} รับงานฟิวแฟน ตรงปก 100%</h1>
      
      <div class="info-grid">
        <div class="info-card">
          <div class="label">💰 ราคาเริ่มต้น</div>
          <div class="value">${sanitizeHTML(displayPrice)}</div>
        </div>
        <div class="info-card">
          <div class="label">📍 พิกัดงาน</div>
          <div class="value">${sanitizeHTML(profileData.location || provinceName)}</div>
        </div>
        <div class="info-card">
          <div class="label">🎂 อายุ</div>
          <div class="value">${sanitizeHTML(ageText)}</div>
        </div>
        <div class="info-card">
          <div class="label">🏙️ จังหวัด</div>
          <div class="value">${sanitizeHTML(provinceName)}</div>
        </div>
      </div>
      
      <a href="${lineHref}" class="btn-contact" target="_blank" rel="noopener noreferrer">
        📲 ติดต่อสอบถาม / จองคิวคลิกที่นี่
      </a>
      
      <div class="update-time">
        อัปเดตล่าสุด: ${thaiDate}
      </div>
      
      <div class="disclaimer">
        ℹ️ ข้อมูลนี้เป็นไปตามที่ผู้ใช้ระบุ โปรดตรวจสอบข้อมูลเพิ่มเติมก่อนการติดต่อ
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ============================================
// MAIN HANDLER - UNIFIED ROUTING
// ============================================

export default async (request, context) => {
  const startTime = Date.now();
  
  try {
    // 1. ตรวจสอบว่าเป็น GET request
    if (request.method !== 'GET') {
      return context.next();
    }
    
    // 2. ตรวจสอบ Bot
    if (!isBotRequest(request)) {
      return context.next();
    }
    
    // 3. Parse URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // 4. Determine route type
    let routeType = null;
    let identifier = null;
    
    if (pathParts[0] === 'sideline' && pathParts.length === 2) {
      routeType = 'profile';
      identifier = decodeURIComponent(pathParts[1]).toLowerCase();
    } else if ((pathParts[0] === 'location' || pathParts[0] === 'province') && pathParts.length === 2) {
      routeType = 'province';
      identifier = decodeURIComponent(pathParts[1]).toLowerCase();
    } else {
      return context.next();
    }
    
    // 5. Validate identifier
    if (!validateSlug(identifier)) {
      console.log(`[SSR] Invalid slug: ${identifier}`);
      return context.next();
    }
    
    console.log(`[SSR] Processing ${routeType}: ${identifier}`);
    
    // 6. Check SSR cache first
    const cacheKey = `${routeType}_${identifier}`;
    const cachedHTML = cache.get(cacheKey, 'ssrPages');
    
    if (cachedHTML) {
      console.log(`[SSR] Serving from cache: ${cacheKey}`);
      return new Response(cachedHTML.html, cachedHTML.headers);
    }
    
    // 7. Fetch data and generate HTML based on route type
    let html, headers;
    const thaiDate = formatThaiDate();
    
    if (routeType === 'province') {
      const provinceData = await fetchProvinceData(identifier);
      if (!provinceData) {
        console.log(`[SSR] No province data found for: ${identifier}`);
        return context.next();
      }
      
      const profilesData = await fetchProfiles(provinceData);
      html = generateProvinceHTML(provinceData, profilesData, thaiDate);
      
      headers = {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400, stale-if-error=43200",
        "Vary": "User-Agent, Accept-Encoding",
        "X-Province-Key": provinceData.key,
        "X-Profile-Count": profilesData.totalCount.toString(),
        "X-Frame-Options": "SAMEORIGIN",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      };
      
    } else if (routeType === 'profile') {
      const profileData = await fetchProfileData(identifier);
      if (!profileData) {
        console.log(`[SSR] No profile data found for: ${identifier}`);
        return context.next();
      }
      
      html = generateProfileHTML(profileData, thaiDate);
      
      headers = {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
        "Vary": "User-Agent",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      };
    }
    
    // 8. Cache the generated HTML
    if (html && headers) {
      cache.set(cacheKey, { html, headers }, 'ssrPages');
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`[SSR] Generated ${routeType} page for ${identifier} in ${processingTime}ms`);
    
    headers["X-Processing-Time"] = `${processingTime}ms`;
    
    return new Response(html, { headers, status: 200 });
    
  } catch (error) {
    console.error('[SSR] Fatal Error:', error);
    
    // Graceful degradation
    const errorHtml = `<!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ระบบกำลังอัปเดต - ${CONFIG.SITE_NAME}</title>
      <meta http-equiv="refresh" content="5;url=/">
      <style>
        body { font-family: sans-serif; text-align: center; padding: 50px; background: #f3f4f6; }
        h1 { color: #db2777; margin-bottom: 20px; }
        p { color: #64748b; margin-bottom: 30px; }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #db2777; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    </head>
    <body>
      <div class="spinner"></div>
      <h1>🔄 ระบบกำลังอัปเดต</h1>
      <p>ขออภัยในความไม่สะดวก ระบบกำลังอัปเดตข้อมูล</p>
      <p>จะนำคุณกลับสู่หน้าหลักใน 5 วินาที...</p>
      <p><a href="/" style="color: #db2777;">คลิกที่นี่หากไม่มีการเปลี่ยนหน้า</a></p>
    </body>
    </html>`;
    
    return new Response(errorHtml, {
      status: 503,
      headers: { 
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": "30",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  }
};