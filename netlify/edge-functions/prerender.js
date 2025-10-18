import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async (request, context) => {
  const url = new URL(request.url);
  // รองรับ / และ /index.html เท่านั้น
  if (!(url.pathname === '/' || url.pathname === '/index.html')) {
    console.log('[prerender] URL ไม่ตรงกับหน้า Home:', url.pathname);
    return context.next();
  }

  try {
    console.log('[prerender] เริ่ม prerender หน้า Home');

    // ดึงข้อมูลจังหวัดและโปรไฟล์ทั้งหมดจาก Supabase
    const { data: provinces, error: provincesError } = await supabase.from('provinces').select('*').order('nameThai');
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

    if (provincesError) {
      console.error('[prerender] ดึง provinces ผิดพลาด:', provincesError);
      return context.next();
    }
    if (profilesError) {
      console.error('[prerender] ดึง profiles ผิดพลาด:', profilesError);
      return context.next();
    }

    // สร้าง HTML หน้า Home
    let html = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>น้องๆ พริตตี้ ไซด์ไลน์เชียงใหม่ – อัปเดตล่าสุด</title>
        <meta name="description" content="รวมโปรไฟล์น้องๆ สาวสวยจากจังหวัดเชียงใหม่ และพื้นที่ใกล้เคียง พร้อมรูปภาพและรายละเอียดครบ" />

        <!-- Open Graph / Social Sharing -->
        <meta property="og:title" content="น้องๆ พริตตี้ ไซด์ไลน์เชียงใหม่ – อัปเดตล่าสุด" />
        <meta property="og:description" content="รวมโปรไฟล์น้องๆ สาวสวยจากจังหวัดเชียงใหม่ และพื้นที่ใกล้เคียง พร้อมรูปภาพและรายละเอียดครบ" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${url.origin}/" />
        <meta property="og:image" content="${url.origin}/images/og-image.jpg" />

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

    // คืน response พร้อม cache-control เพื่อให้ CDN cache ได้นาน (ปรับตามความเหมาะสม)
    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300, stale-while-revalidate=600' // 5 นาที cache, 10 นาที stale-while-revalidate
      },
    });
  } catch (err) {
    console.error('❌ prerender error:', err);
    return context.next();
  }
};
