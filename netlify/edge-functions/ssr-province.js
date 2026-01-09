import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const STORAGE_BUCKET = 'profile-images';

export default async (request, context) => {
  // ตรวจจับบอท
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /bot|spider|crawl|facebook|twitter|whatsapp|line/i.test(userAgent);
  if (!isBot) return context.next();

  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    
    // ตรวจสอบว่าเป็นหน้ารวมจังหวัดหรือไม่ (เช่น /province/chiangmai)
    if (pathParts[0] !== 'province' || !pathParts[1]) return context.next();
    
    const provinceKey = pathParts[1];
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 1. ดึงข้อมูลจังหวัด
    const { data: provinceData } = await supabase
      .from('provinces')
      .select('*')
      .eq('key', provinceKey)
      .single();

    if (!provinceData) return context.next();

    // 2. ดึงข้อมูลสาวๆ ในจังหวัดนั้น (แก้ชื่อคอลัมน์ provinceKey และ imagePath ตาม JSON)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('name, slug, age, stats, rate, imagePath, location, lineId')
      .eq('provinceKey', provinceKey) // แก้ตรงนี้ให้ตรงกับฐานข้อมูล
      .order('created_at', { ascending: false });

    const thaiDate = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    const title = `รวมสาวไซด์ไลน์ ${provinceData.nameThai} งานดีตรงปก อัปเดต ${thaiDate}`;
    
    // 3. สร้างรายการ Card ของแต่ละคน
    const profileCards = (profiles || []).map(p => {
      const displayPrice = p.rate ? p.rate.toString().replace(/[^0-9]/g, '') : '1,500';
      const imageUrl = p.imagePath?.startsWith('http') 
        ? p.imagePath 
        : `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${p.imagePath}`;

      return `
        <div class="card">
          <img src="${imageUrl}" alt="${p.name}">
          <div class="card-info">
            <h3>น้อง${p.name} (${p.age} ปี)</h3>
            <p>สัดส่วน: ${p.stats || '34-25-36'}</p>
            <p>พื้นที่: ${p.location || provinceData.nameThai}</p>
            <p class="price">ราคา: ${displayPrice}.-</p>
            <a href="/sideline/${p.slug}" class="view-btn">ดูโปรไฟล์เพิ่มเติม</a>
          </div>
        </div>
      `;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="แหล่งรวมน้องๆ ไซด์ไลน์ ${provinceData.nameThai} ตัวจริงตรงปก ไม่ต้องมัดจำ ปลอดภัย 100% ดูรีวิวและจองคิวได้ที่นี่">
    <style>
        body { font-family: 'Prompt', sans-serif; background: #fdf2f8; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        h1 { color: #ec4899; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .card img { width: 100%; aspect-ratio: 3/4; object-fit: cover; }
        .card-info { padding: 15px; }
        .price { color: #db2777; font-weight: bold; font-size: 1.2em; }
        .view-btn { display: block; background: #ec4899; color: white; text-align: center; padding: 10px; border-radius: 8px; text-decoration: none; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>พิกัด: ${provinceData.nameThai} และพื้นที่ใกล้เคียง</p>
    </div>
    <div class="grid">
        ${profileCards || '<p style="text-align:center; grid-column: 1/-1;">ยังไม่มีข้อมูลในพื้นที่นี้</p>'}
    </div>
</body>
</html>`;

    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });

  } catch (e) {
    return context.next();
  }
};