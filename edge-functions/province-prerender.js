// ✅ netlify/edge-functions/province-prerender.js
// ใช้สำหรับ prerender หน้า province เฉพาะจังหวัด เช่น /province/chiangmai.html

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async (request, context) => {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/province\/([a-z0-9_-]+)\.html$/i);
  if (!match) return context.next();

  const provinceKey = match[1];

  try {
    // 🧩 ดึงข้อมูลจังหวัด
    const { data: province } = await supabase.from('provinces').select('*').eq('key', provinceKey).single();
    if (!province) return context.next();

    // 🧩 ดึงข้อมูลโปรไฟล์ในจังหวัดนั้น
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('provinceKey', provinceKey)
      .order('created_at', { ascending: false });

    // 🧱 สร้าง HTML สำหรับจังหวัดนี้
    let html = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${province.nameThai} – โปรไฟล์น้องๆ ทั้งหมด</title>
        <meta name="description" content="รวมโปรไฟล์น้องๆ จากจังหวัด ${province.nameThai} ทั้งหมด พร้อมรายละเอียด รูปภาพ และเรทล่าสุด" />
        <link rel="stylesheet" href="/css/style.css" />
      </head>
      <body>
        <header><h1>จังหวัด ${province.nameThai}</h1></header>
        <main>
          <div class="province-description">${province.description || ''}</div>
          <div class="profile-grid">
    `;

    for (const profile of profiles) {
      const mainImg = profile.imagePath
        ? `${SUPABASE_URL}/storage/v1/object/public/profile-images/${profile.imagePath}`
        : '/images/placeholder-profile.webp';

      html += `
        <article class="profile-card">
          <img src="${mainImg}" alt="${profile.altText || `รูปของ ${profile.name}`}" loading="lazy" width="300" height="400" />
          <h2>${profile.name}</h2>
          <p>${profile.quote || ''}</p>
          <p><strong>เรท:</strong> ${profile.rate || '-'} | <strong>สถานะ:</strong> ${profile.availability || 'ไม่ระบุ'}</p>
          <p>${profile.description || ''}</p>
        </article>
      `;
    }

    html += `
          </div>
        </main>
        <footer>
          <p>&copy; ${new Date().getFullYear()} sidelinechiangmai.netlify.app</p>
        </footer>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch (err) {
    console.error('❌ province prerender error:', err);
    return context.next();
  }
};
