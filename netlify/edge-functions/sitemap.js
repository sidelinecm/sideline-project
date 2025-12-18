import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';

  const esc = (u) => u ? u.replace(/[<>&"']/g, (m) => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":"&apos;"}[m])) : '';

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: profiles } = await supabase.from('profiles').select('slug, name, imagePath, updated_at').order('updated_at', { ascending: false }).limit(2000);
    const { data: provinces } = await supabase.from('provinces').select('key');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;

    provinces?.forEach(p => {
        xml += `<url><loc>${DOMAIN}/location/${esc(p.key)}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`;
    });

    profiles?.forEach(p => {
        if (p.slug) {
            const lastMod = p.updated_at ? new Date(p.updated_at).toISOString() : new Date().toISOString();
            xml += `<url>
                <loc>${DOMAIN}/sideline/${esc(p.slug)}</loc>
                <lastmod>${lastMod}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.9</priority>
                <image:image>
                    <image:loc>${SUPABASE_URL}/storage/v1/object/public/profile-images/${esc(p.imagePath)}</image:loc>
                    <image:title>น้อง ${esc(p.name)} ไซด์ไลน์ งานดีตรงปก</image:title>
                </image:image>
            </url>`;
        }
    });

    xml += `</urlset>`;
    return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
  } catch (error) {
    return new Response('Error building sitemap', { status: 500 });
  }
};