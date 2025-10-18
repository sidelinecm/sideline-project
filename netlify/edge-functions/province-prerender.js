import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async (request, context) => {
  const url = new URL(request.url);

  // รองรับ /province/chiangmai.html และ /province/chiangmai (ไม่มี .html)
  const match = url.pathname.match(/^\/province\/([a-z0-9_-]+)(\.html)?$/i);
  if (!match) {
    console.log('[province-prerender] URL ไม่ตรง pattern:', url.pathname);
    return context.next();
  }

  const provinceKey = match[1];
  console.log('[province-prerender] เรียก prerender สำหรับจังหวัด:', provinceKey);

  try {
    // ดึงข้อมูลจังหวัดจาก Supabase
    const { data: province, error: provinceError } = await supabase
      .from('provinces')
      .select('*')
      .eq('key', provinceKey)
      .single();

    if (provinceError || !province) {
      console.error('[province-prerender] ไม่พบข้อมูลจังหวัด:', provinceKey, provinceError);
      return context.next();
    }

    // ดึงข้อมูลโปรไฟล์จังหวัด
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('provinceKey', provinceKey)
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('[province-prerender] ดึง profiles ผิดพลาด:', profilesError);
      return context.next();
    }

    // สร้าง HTML
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


