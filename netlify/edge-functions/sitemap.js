import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';
  const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const [profilesRes, provincesRes] = await Promise.all([
      supabase.from('profiles').select('slug, name, imagePath, lastUpdated').order('created_at', { ascending: false }).limit(5000),
      supabase.from('provinces').select('key')
    ]);

    const esc = (unsafe) => unsafe ? unsafe.replace(/[<>&"']/g, (m) => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":"&apos;"}[m])) : '';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      <url><loc>${DOMAIN}/</loc><priority>1.0</priority></url>`;

    provincesRes.data?.forEach(p => {
      xml += `<url><loc>${DOMAIN}/location/${encodeURIComponent(p.key)}</loc><priority>0.8</priority></url>`;
    });

    profilesRes.data?.forEach(p => {
      const imgUrl = p.imagePath ? `${SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${DOMAIN}/images/default_og_image.jpg`;
      xml += `
      <url>
        <loc>${DOMAIN}/sideline/${encodeURIComponent(p.slug)}</loc>
        <lastmod>${(p.lastUpdated || new Date().toISOString()).split('T')[0]}</lastmod>
        <priority>0.9</priority>
        <image:image><image:loc>${esc(imgUrl)}</image:loc></image:image>
      </url>`;
    });

    xml += `</urlset>`;
    return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
  } catch (e) {
    return new Response("<urlset></urlset>", { status: 500 });
  }
};
