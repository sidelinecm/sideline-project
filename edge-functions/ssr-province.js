import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  if (!/bot|spider|crawl|facebook|twitter/i.test(userAgent)) return context.next(); 

  const url = new URL(request.url);
  const key = url.pathname.split('/').pop(); 

  try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data: prov } = await supabase.from('provinces').select('*').eq('key', key).maybeSingle();
      if (!prov) return context.next();

      const { data: profiles } = await supabase.from('profiles').select('name, slug').eq('provinceKey', key);

      const listHtml = profiles?.map(p => {
          const safeLink = `/sideline/${encodeURIComponent(p.slug)}`;
          return `<li><a href="${safeLink}">${p.name}</a></li>`;
      }).join('') || 'ไม่มีข้อมูล';

      const html = `<!DOCTYPE html><html lang="th"><head><title>ไซด์ไลน์${prov.nameThai}</title></head>
      <body><h1>รายชื่อน้องๆ จังหวัด${prov.nameThai}</h1><ul>${listHtml}</ul></body></html>`;

      return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
  } catch (e) { return context.next(); }
};