import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandexbot|baiduspider|facebookexternalhit/i.test(userAgent);

  if (!isBot) return context.next();

  try {
    const supabase = createClient('https://hgzbgpbmymoiwjpaypvl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8');
    const url = new URL(request.url);
    const path = url.pathname;

    // --- ส่วนที่ 1: หน้าแรก (แก้ปัญหาเจอหน้าเดียว) ---
    if (path === '/' || path === '/index.html') {
      const { data: provinces } = await supabase.from('provinces').select('key, nameThai');
      const links = provinces?.map(p => `<li><a href="/location/${p.key}">ไซด์ไลน์ ${p.nameThai}</a></li>`).join('') || '';
      return new Response(`<!DOCTYPE html><html><head><title>ไซด์ไลน์เชียงใหม่</title></head><body><h1>สารบัญจังหวัด</h1><ul>${links}</ul></body></html>`, 
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // --- ส่วนที่ 2: หน้าโปรไฟล์รายคน (ดักจับจาก /sideline/...) ---
    if (path.includes('/sideline/')) {
      const slug = path.split('/').filter(Boolean).pop();
      const { data: p } = await supabase.from('profiles').select('*').eq('slug', decodeURIComponent(slug)).single();
      if (!p) return context.next();

      const img = `https://hgzbgpbmymoiwjpaypvl.supabase.co/storage/v1/object/public/profile-images/${p.imagePath}`;
      return new Response(`<!DOCTYPE html><html><head><title>${p.name} | ไซด์ไลน์ ${p.location}</title><meta property="og:image" content="${img}"></head><body><h1>${p.name}</h1><p>${p.description}</p><img src="${img}"></body></html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    return context.next();
  } catch (e) {
    return context.next();
  }
};