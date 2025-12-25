import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const DOMAIN = 'https://sidelinechiangmai.netlify.app';

export default async (request, context) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: profiles } = await supabase.from('profiles').select('slug, lastUpdated');
  const { data: provinces } = await supabase.from('provinces').select('key');

  let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  xml += `<url><loc>${DOMAIN}/</loc><priority>1.0</priority></url>`;

  if (provinces) {
    provinces.forEach(p => {
      xml += `<url><loc>${DOMAIN}/location/${p.key}</loc><priority>0.9</priority></url>`;
    });
  }

  if (profiles) {
    profiles.forEach(p => {
      const lastMod = p.lastUpdated ? new Date(p.lastUpdated).toISOString() : new Date().toISOString();
      // ✅ แก้จุดตาย: encode ภาษาไทย
      const safeSlug = encodeURIComponent(p.slug); 
      xml += `<url><loc>${DOMAIN}/sideline/${safeSlug}</loc><lastmod>${lastMod}</lastmod><priority>0.8</priority></url>`;
    });
  }
  xml += `</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
