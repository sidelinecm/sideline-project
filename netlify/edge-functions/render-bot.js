import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const STORAGE_BUCKET = 'profile-images';

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandex|facebookexternalhit|twitterbot|discordbot|whatsapp|linkedinbot/i.test(userAgent);

  // ถ้าไม่ใช่บอท ให้ข้ามไปใช้แอปปกติ (React/Vue/JS)
  if (!isBot) return context.next();

  try {
    const url = new URL(request.url);
    // ถอดรหัสภาษาไทยจาก URL เช่น %E0%B8... -> น้องโอเปิ้ล
    const slug = decodeURIComponent(url.pathname.split('/').pop());

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // ดึงข้อมูลโปรไฟล์พร้อมข้อมูลจังหวัด
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, provinces(nameThai)')
      .eq('slug', slug)
      .maybeSingle();

    if (!profile) return context.next();

    const title = `น้อง ${profile.name} รับงาน${profile.provinces?.nameThai || ''} รูปจริง ตรงปก 100%`;
    const description = `${profile.name} อายุ ${profile.age || ''} สัดส่วน ${profile.stats || ''} พิกัด ${profile.location || ''}. ${profile.description || 'บริการดี เป็นกันเอง ฟีลแฟน'}`;
    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profile.imagePath}`;

    // สร้าง HTML แบบเต็มบรรทัดให้บอทอ่าน
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
  <style>
    body { font-family: 'Prompt', sans-serif; padding: 20px; line-height: 1.6; background: #fdf2f8; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    img { width: 100%; border-radius: 15px; margin-bottom: 20px; }
    h1 { color: #d53f8c; text-align: center; }
    .details { background: #fff5f7; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
    .btn { display: block; background: #06c755; color: #fff; text-align: center; padding: 15px; text-decoration: none; border-radius: 50px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <header><h1>${profile.name}</h1></header>
    <img src="${imageUrl}" alt="${profile.name}">
    <div class="details">
      <p><b>💰 ราคา:</b> ${profile.rate || 'สอบถาม'}</p>
      <p><b>📍 พิกัด:</b> ${profile.location || profile.provinces?.nameThai}</p>
      <p><b>📏 สัดส่วน:</b> ${profile.stats} (อายุ ${profile.age})</p>
      <hr>
      <p>${profile.description || 'ทักมาคุยรายละเอียดได้เลยค่ะ'}</p>
    </div>
    <a href="https://line.me/ti/p/ksLUWB89Y_" class="btn">📲 แอดไลน์จองคิว</a>
    <p style="text-align:center; margin-top:20px;"><a href="/">🏠 กลับสู่หน้าหลัก</a></p>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });

  } catch (error) {
    return context.next();
  }
};