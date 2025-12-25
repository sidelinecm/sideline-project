import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  if (!/googlebot|bingbot|yandexbot/i.test(userAgent)) return context.next();

  try {
    const supabase = createClient('https://hgzbgpbmymoiwjpaypvl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8');
    const url = new URL(request.url);
    const key = url.pathname.split('/').filter(Boolean).pop();

    // 1. หาชื่อภาษาไทยของจังหวัดจาก key
    const { data: prov } = await supabase.from('provinces').select('nameThai').eq('key', key).single();
    if (!prov) return context.next();

    // 2. ดึงโปรไฟล์ทั้งหมดในจังหวัดนั้น
    const { data: profiles } = await supabase.from('profiles').select('name, slug').eq('location', prov.nameThai);
    const listHtml = profiles?.map(p => `<li><a href="/sideline/${p.slug}">น้อง ${p.name}</a></li>`).join('') || 'ไม่มีข้อมูล';

    return new Response(`<!DOCTYPE html><html><head><title>ไซด์ไลน์ ${prov.nameThai}</title></head><body><h1>รายชื่อใน ${prov.nameThai}</h1><ul>${listHtml}</ul></body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (e) {
    return context.next();
  }
};