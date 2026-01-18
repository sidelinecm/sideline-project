// netlify/edge-functions/sitemap.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Configuration
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const DOMAIN = Deno.env.get('DOMAIN') || 'https://sidelinechiangmai.netlify.app';

// Cache Configuration
const CACHE = {
  sitemap: null,
  compressed: null,
  lastGenerated: 0,
  totalUrls: 0,
  generationTime: 0,
  CACHE_DURATION: 30 * 60 * 1000 // 30 นาที
};

// ============================================
// Helper Functions - Optimized for Thai SEO
// ============================================
const SitemapHelpers = {
  cleanSlug(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') 
      .replace(/[^a-z0-9\u0E00-\u0E7F\-]/g, '') 
      .replace(/-+/g, '-') 
      .replace(/^-|-$/g, '');
  },

  escapeXml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  },

  formatDate(date) {
    try {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    } catch (e) {
      return new Date().toISOString().split('T')[0];
    }
  },

  calculateChangeFreq(profile) {
    return profile.isfeatured ? 'daily' : 'weekly';
  },

  calculatePriority(profile) {
    if (profile.isfeatured) return '0.8';
    if (profile.imagePath) return '0.7';
    return '0.6';
  },

  async compress(data) {
    try {
      if (typeof CompressionStream === 'undefined') {
        // Not available in this runtime
        return null;
      }
      const encoder = new TextEncoder();
      const encoded = encoder.encode(data);
      const cs = new CompressionStream('gzip');
      const writer = cs.writable.getWriter();
      writer.write(encoded);
      writer.close();
      const compressed = await new Response(cs.readable).arrayBuffer();
      return new Uint8Array(compressed);
    } catch (error) {
      console.warn('[Sitemap] Compression failed:', error && error.message ? error.message : error);
      return null;
    }
  },

  isValidCache() {
    return CACHE.sitemap && (Date.now() - CACHE.lastGenerated) < CACHE.CACHE_DURATION;
  }
};

// Data Fetcher
const fetchData = async (supabase) => {
  console.log('[Sitemap] Fetching data from Supabase...');
  
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Database timeout')), 10000)
  );

  try {
    const results = await Promise.race([
      Promise.all([
        supabase
          .from('profiles')
          .select('slug, lastUpdated, created_at, active, isfeatured, imagePath')
          .eq('active', true)
          .order('lastUpdated', { ascending: false })
          .limit(10000),
        supabase
          .from('provinces')
          .select('key, nameThai, created_at')
          .order('nameThai', { ascending: true })
      ]),
      timeoutPromise
    ]);

    const [profilesResult, provincesResult] = results;
    const profiles = profilesResult?.data || [];
    const provinces = provincesResult?.data || [];

    return {
      profiles,
      provinces,
      stats: {
        profiles: profiles.length,
        provinces: provinces.length
      }
    };
  } catch (error) {
    console.error('[Sitemap] Fetch error:', error);
    throw error;
  }
};

const generateSitemap = (data) => {
  const startTime = Date.now();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

  let totalUrls = 0;

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/sideline', priority: '0.9', changefreq: 'weekly' },
    { loc: '/location', priority: '0.9', changefreq: 'weekly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.8', changefreq: 'monthly' }
  ];

  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${SitemapHelpers.escapeXml(DOMAIN + page.loc)}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
    totalUrls++;
  });

  if (data.provinces?.length > 0) {
    console.log(`[Sitemap] Adding ${data.provinces.length} provinces`);
    data.provinces.forEach(province => {
      const pIdentifier = province.key;
      if (!pIdentifier) return;
      
      xml += '  <url>\n';
      xml += `    <loc>${SitemapHelpers.escapeXml(DOMAIN + '/location/' + SitemapHelpers.cleanSlug(pIdentifier))}</loc>\n`;
      const lastMod = province.created_at || new Date().toISOString();
      xml += `    <lastmod>${SitemapHelpers.formatDate(lastMod)}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
      totalUrls++;
    });
  }

  if (data.profiles?.length > 0) {
    console.log(`[Sitemap] Adding ${data.profiles.length} profiles`);
    data.profiles.forEach(profile => {
      if (!profile.slug) return;
      
      const profileSlug = SitemapHelpers.cleanSlug(profile.slug);
      xml += '  <url>\n';
      xml += `    <loc>${SitemapHelpers.escapeXml(DOMAIN + '/sideline/' + profileSlug)}</loc>\n`;
      const lastModDate = profile.lastUpdated || profile.created_at || new Date().toISOString();
      xml += `    <lastmod>${SitemapHelpers.formatDate(lastModDate)}</lastmod>\n`;
      xml += `    <changefreq>${SitemapHelpers.calculateChangeFreq(profile)}</changefreq>\n`;
      xml += `    <priority>${SitemapHelpers.calculatePriority(profile)}</priority>\n`;
      xml += '  </url>\n';
      totalUrls++;
    });
  }

  xml += '</urlset>';
  const generationTime = Date.now() - startTime;
  
  return {
    xml,
    totalUrls,
    generationTime,
    stats: data.stats
  };
};
// Main Handler สำหรับ Edge Function
export default async (request, context) => {
  const startTime = Date.now();
  
  try {
    const acceptEncoding = request.headers.get('Accept-Encoding') || '';
    const supportsGzip = acceptEncoding.includes('gzip');
    
    if (SitemapHelpers.isValidCache()) {
      console.log('[Sitemap] Serving from cache', {
        age: Date.now() - CACHE.lastGenerated,
        urls: CACHE.totalUrls
      });
      
      const headers = {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        'Last-Modified': new Date(CACHE.lastGenerated).toUTCString(),
        'X-Cache': 'HIT',
        'X-Generated-At': new Date(CACHE.lastGenerated).toISOString(),
        'X-Total-URLs': CACHE.totalUrls.toString(),
        'X-Generation-Time': `${CACHE.generationTime}ms`
      };
      
      if (context?.geo?.country) {
        headers['X-Geo-Country'] = context.geo.country;
      }
      
      if (supportsGzip && CACHE.compressed) {
        headers['Content-Encoding'] = 'gzip';
        return new Response(CACHE.compressed, { headers });
      }
      
      return new Response(CACHE.sitemap, { headers });
    }
    
    console.log('[Sitemap] Generating fresh sitemap...');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
      global: { 
        headers: { 
          'X-Client': 'sitemap-edge-function',
          'X-Edge-Region': context?.geo?.city || 'unknown'
        } 
      }
    });
    
    const data = await fetchData(supabase);
    const result = generateSitemap(data);
    
    let compressed = null;
    if (supportsGzip) {
      compressed = await SitemapHelpers.compress(result.xml);
    }
    
    CACHE.sitemap = result.xml;
    CACHE.compressed = compressed;
    CACHE.lastGenerated = Date.now();
    CACHE.totalUrls = result.totalUrls;
    CACHE.generationTime = result.generationTime;
    
    console.log(`[Sitemap] Generated in ${result.generationTime}ms`, {
      totalUrls: result.totalUrls,
      profiles: data.stats.profiles,
      provinces: data.stats.provinces,
      edgeRegion: context?.geo?.city
    });
    
    const headers = {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      'Last-Modified': new Date().toUTCString(),
      'X-Cache': 'MISS',
      'X-Generated-At': new Date().toISOString(),
      'X-Total-URLs': result.totalUrls.toString(),
      'X-Generation-Time': `${result.generationTime}ms`,
      'X-Processing-Time': `${Date.now() - startTime}ms`
    };
    
    if (context?.geo) {
      headers['X-Geo-Country'] = context.geo.country;
      headers['X-Geo-City'] = context.geo.city || 'unknown';
    }
    
    if (supportsGzip && compressed) {
      headers['Content-Encoding'] = 'gzip';
      return new Response(compressed, { headers });
    }
    
    return new Response(result.xml, { headers });
    
  } catch (error) {
    console.error('[Sitemap] Error:', error);
    
    if (CACHE.sitemap) {
      console.log('[Sitemap] Using cached fallback');
      
      const headers = {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        'X-Cache': 'HIT-ERROR-FALLBACK',
        'X-Generated-At': new Date(CACHE.lastGenerated).toISOString(),
        'X-Total-URLs': CACHE.totalUrls.toString(),
        'X-Error': String(error && error.message ? error.message : error).substring(0, 100)
      };
      
      return new Response(CACHE.sitemap, { headers });
    }
    
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Sitemap temporarily unavailable</message>
  <timestamp>${new Date().toISOString()}</timestamp>
  <processingTime>${Date.now() - startTime}ms</processingTime>
</error>`;
    
    return new Response(errorXml, {
      status: 503,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Retry-After': '60'
      }
    });
  }
};

// Robots.txt handler
export const config = {
  path: '/robots.txt'
};

export async function onRequest() {
  const robotsTxt = `# Robots.txt for ${DOMAIN}
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: ${DOMAIN}/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Generated: ${new Date().toISOString()}`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}