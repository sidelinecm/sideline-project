import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot|whatsapp|line|applebot/i.test(userAgent);

  if (!isBot) return context.next();

  try {
    const DOMAIN = 'https://sidelinechiangmai.netlify.app';
    const url = new URL(request.url);
    const path = url.pathname;

    const supabase = createClient('https://hgzbgpbmymoiwjpaypvl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8');

    // --- แก้ไขจุดที่ 1: ถ้าเป็นหน้าแรก ให้โชว์ลิงก์จังหวัด (เพื่อให้ Google ไม่เจอแค่หน้าเดียว) ---
    if (path === '/' || path === '/index.html') {
      const { data: provinces } = await supabase.from('provinces').select('key, nameThai');
      const linksHtml = provinces.map(p => `<li><a href="/location/${p.key}">ไซด์ไลน์ ${p.nameThai}</a></li>`).join('');
      return new Response(`<!DOCTYPE html><html><head><title>ไซด์ไลน์เชียงใหม่</title></head><body><ul>${linksHtml}</ul></body></html>`, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // --- แก้ไขจุดที่ 2: ใช้การตัด URL แบบเดิมที่คุณใช้ (Path Segments) ---
    const pathSegments = path.split('/').filter(Boolean);
    const rawSlug = pathSegments[pathSegments.length - 1];

    if (path.includes('/sideline/')) {
      const { data: p } = await supabase.from('profiles').select('*').eq('slug', decodeURIComponent(rawSlug)).single();
      if (!p) return context.next();

      const img = `https://hgzbgpbmymoiwjpaypvl.supabase.co/storage/v1/object/public/profile-images/${p.imagePath}`;
      return new Response(`<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>${p.name}</title><meta property="og:image" content="${img}"></head><body><h1>${p.name}</h1><p>${p.description}</p></body></html>`, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return context.next();
  } catch (e) {
    return context.next();
  }
};
