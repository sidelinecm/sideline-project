// =================================================================
// FILE: render-bot.js (ฉบับสมบูรณ์ - FINAL VERSION)
// =================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const STORAGE_BUCKET = 'profile-images';

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandex|facebookexternalhit|twitterbot|discordbot|whatsapp|linkedinbot/i.test(userAgent);

  if (!isBot) return context.next();

  try {
    const url = new URL(request.url);
    const slug = decodeURIComponent(url.pathname.split('/').pop());

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // ดึงข้อมูลโปรไฟล์พร้อมข้อมูลจังหวัด
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, provinces(nameThai)')
      .eq('slug', slug)
      .maybeSingle();

    if (!profile) return context.next();
    
    const BRAND_NAME = "Sideline Chiangmai";
    const provinceName = profile.provinces?.nameThai || 'จังหวัด';
    const location = profile.location || provinceName;

    // TITLE ใหม่
    const title = `น้อง${profile.name} ไซด์ไลน์${provinceName} รับงาน${location} | ${BRAND_NAME}`;

    // ✅ REVISED: เพิ่ม styleTagsText เข้ามาใน Description เพื่อให้สมบูรณ์
    const styleTagsText = (profile.styleTags && profile.styleTags.length > 0) ? ` สไตล์: ${profile.styleTags.join(', ')}` : '';
    const description = `ติดต่อ น้อง${profile.name} (${profile.age || 'ไม่ระบุ'} ปี) ไซด์ไลน์${provinceName}. สัดส่วน ${profile.stats || 'สอบถาม'}.${styleTagsText} ${profile.quote || 'บริการดี เป็นกันเอง.'} คลิกดูรูปและข้อมูลติดต่อที่นี่!`;
    
    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profile.imagePath}`;

    // สร้าง HTML
    const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:type" content="profile">
  <style> body { font-family: sans-serif; } img { max-width: 100%; } </style>
</head>
<body>
  <h1>${profile.name}</h1>
  <img src="${imageUrl}" alt="${title}">
  <p><b>ราคา:</b> ${profile.rate || 'สอบถาม'}</p>
  <p><b>พิกัด:</b> ${location}</p>
  <p><b>สัดส่วน:</b> ${profile.stats} (อายุ ${profile.age})</p>
  <p>${profile.description || 'ทักมาคุยรายละเอียดได้เลยค่ะ'}</p>
  <a href="/">กลับสู่หน้าหลัก</a>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });

  } catch (error) {
    console.error("Render-Bot Error:", error);
    return context.next();
  }
};