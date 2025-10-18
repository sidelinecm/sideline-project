// ✅ netlify/edge-functions/prerender.js
// ใช้สำหรับ prerender หน้าเว็บหลัก (home / index.html)
// ดึงข้อมูลจาก Supabase เพื่อแสดง province และโปรไฟล์แบบ static HTML

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async (request, context) => {
  const url = new URL(request.url);
  if (!url.pathname.endsWith('/') && url.pathname !== '/index.html') {
    return context.next();
  }

  try {
    // 🧩 ดึงข้อมูล province และ profile ทั้งหมด
    const { data: provinces } = await supabase.from('provinces').select('*').order('nameThai');
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

    // 🧱 สร้าง HTML
    let html = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>น้องๆ พริตตี้ ไซด์ไลน์เชียงใหม่ – อัปเดตล่าสุด</title>
        <meta name="description" content="รวมโปรไฟล์น้องๆ สาวสวยจากจังหวัดเชียงใหม่ และพื้นที่ใกล้เคียง พร้อมรูปภาพและรายละเอียดครบ" />
        <link rel="stylesheet" href="/css/style.css" />
      </head>
      <body>
        <header><h1>รวมโปรไฟล์น้องๆ จากทุกจังหวัด</h1></header>
        <main>
    `;

    for (const province of provinces) {
      const provinceProfiles = profiles.filter(p => p.provinceKey === province.key);
      if (provinceProfiles.length === 0) continue;

      html += `
        <section id="province-${province.key}">
          <h2>จังหวัด ${province.nameThai}</h2>
          <div class="province-description">${province.description || ''}</div>
          <div class="profile-grid">
      `;

      for (const profile of provinceProfiles.slice(0, 8)) {
        const mainImg = profile.imagePath
          ? `${SUPABASE_URL}/storage/v1/object/public/profile-images/${profile.imagePath}`
          : '/images/placeholder-profile.webp';

        html += `
          <article class="profile-card">
            <img src="${mainImg}" alt="${profile.altText || `รูปของ ${profile.name}`}" loading="lazy" width="300" height="400" />
            <h3>${profile.name}</h3>
            <p>${profile.quote || ''}</p>
            <p><strong>เรท:</strong> ${profile.rate || '-'} | <strong>สถานะ:</strong> ${profile.availability || 'ไม่ระบุ'}</p>
          </article>
        `;
      }

      html += `
          </div>
          <p><a href="/province/${province.key}.html" class="btn">ดูทั้งหมดใน ${province.nameThai}</a></p>
        </section>
      `;
    }

    html += `
        </main>
        <footer><p>&copy; ${new Date().getFullYear()} sidelinechiangmai.netlify.app</p></footer>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch (err) {
    console.error('❌ prerender error:', err);
    return context.next();
  }
};
