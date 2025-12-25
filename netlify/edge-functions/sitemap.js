import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';
  const supabase = createClient('https://hgzbgpbmymoiwjpaypvl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8');

  try {
    const [profilesRes, provincesRes] = await Promise.all([
      supabase.from('profiles').select('slug, lastUpdated').limit(5000),
      supabase.from('provinces').select('key')
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    xml += `<url><loc>${DOMAIN}/</loc><priority>1.0</priority></url>`;

    provincesRes.data?.forEach(p => {
      xml += `<url><loc>${DOMAIN}/location/${p.key}</loc><priority>0.8</priority></url>`;
    });

    profilesRes.data?.forEach(p => {
      xml += `<url><loc>${DOMAIN}/sideline/${p.slug}</loc><lastmod>${(p.lastUpdated || new Date().toISOString()).split('T')[0]}</lastmod><priority>0.9</priority></url>`;
    });

    xml += `</urlset>`;

    return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
  } catch (e) {
    return new Response('Error', { status: 500 });
  }
};