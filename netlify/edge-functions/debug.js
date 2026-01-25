import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'
};

export default async (req) => {
    const supabase = createClient(CONFIG.URL, CONFIG.KEY);
    const url = new URL(req.url);
    const pSlug = url.searchParams.get('p') || 'lampang';
    const uSlug = url.searchParams.get('u') || '';

    let audit = [];

    // --- 1. เช็คโครงสร้าง DB (จุดตายที่พี่เจอ ERROR) ---
    const { error: dbErr } = await supabase.from('provinces').select('*').limit(1);
    const hasSlug = !dbErr && Object.keys((await supabase.from('provinces').select('*').limit(1)).data?.[0] || {}).includes('slug');
    audit.push({
        title: "1. โครงสร้าง Database (Table Check)",
        status: hasSlug ? "✅ PASS" : "❌ FAIL",
        msg: hasSlug ? "คอลัมน์ slug พร้อมใช้งาน" : "Error: คอลัมน์ slug ในตาราง provinces หายไป!",
        fix: hasSlug ? "-" : "เข้าไปที่ Supabase > Table Editor > provinces แล้วกด Rename คอลัมน์ที่ชื่อ 'key' หรือ 'name' ให้เป็น 'slug' ครับ"
    });

    // --- 2. เช็คหน้าแรก & ระบบคัดกรอง (Home Page) ---
    const { count: activeCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active');
    audit.push({
        title: "2. หน้าแรก (Home Page Connectivity)",
        status: activeCount > 0 ? "✅ PASS" : "⚠️ WARN",
        msg: `พบน้องออนไลน์ ${activeCount} คน`,
        fix: activeCount > 0 ? "-" : "หน้าแรกจะไม่มีรูปขึ้นถ้าพี่ไม่แก้ status น้องเป็น 'active' (ตัวเล็กทั้งหมด)"
    });

    // --- 3. เช็คหน้าจังหวัด (SSR-Province Check) ---
    const { data: prov } = await supabase.from('provinces').select('*').eq('slug', pSlug).maybeSingle();
    audit.push({
        title: `3. หน้าจังหวัด (Location: ${pSlug})`,
        status: prov ? "✅ PASS" : "❌ FAIL",
        msg: prov ? `เจอจังหวัด ${prov.nameThai}` : `ไม่เจอชื่อจังหวัด "${pSlug}" ในระบบ`,
        fix: prov ? "-" : `เช็คตัวสะกด '${pSlug}' ในตาราง provinces ว่าตรงเป๊ะไหม`
    });

    // --- 4. เช็คหน้าโปรไฟล์น้อง (Render-Bot Check) ---
    if (uSlug) {
        const { data: user } = await supabase.from('profiles').select('*, provinces(*)').eq('slug', uSlug).maybeSingle();
        if (!user) {
            audit.push({ title: "4. หน้าโปรไฟล์น้อง", status: "❌ FAIL", msg: `หาคนชื่อสลัก "${uSlug}" ไม่เจอ`, fix: "เช็ค slug ในตาราง profiles" });
        } else {
            const imgUrl = `${CONFIG.URL}/storage/v1/object/public/profile-images/${user.imagePath}`;
            const imgCheck = await fetch(imgUrl, { method: 'HEAD' });
            audit.push({
                title: `4. หน้าโปรไฟล์: น้อง${user.name}`,
                status: (imgCheck.ok && user.status === 'active') ? "✅ PASS" : "❌ FAIL",
                msg: `Status: ${user.status} | รูปภาพ: ${imgCheck.ok ? 'โหลดได้' : 'รูปพัง (404)'}`,
                fix: !imgCheck.ok ? `ชื่อไฟล์ ${user.imagePath} ใน DB ไม่ตรงกับใน Storage` : (user.status !== 'active' ? "ต้องแก้ status เป็น 'active'" : "-")
            });
        }
    }

    const html = `
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { background: #000; color: #33ff33; font-family: 'Courier New', monospace; padding: 20px; }
            .card { border: 2px solid #33ff33; padding: 20px; margin-bottom: 20px; background: #050505; }
            .FAIL { border-color: #ff3333; color: #ff3333; }
            .WARN { border-color: #ffff33; color: #ffff33; }
            .fix-box { background: #fff; color: #000; padding: 10px; margin-top: 15px; font-weight: bold; border-radius: 5px; }
            h1 { text-align: center; border-bottom: 3px double #33ff33; padding-bottom: 10px; }
        </style>
    </head>
    <body>
        <h1>🛰️ DEEP SYSTEM AUDIT REPORT</h1>
        ${audit.map(r => `
            <div class="card ${r.status.split(' ')[1]}">
                <div style="font-size: 20px; font-weight: bold;">[${r.status}] ${r.title}</div>
                <p>> ${r.msg}</p>
                ${r.fix !== '-' ? `<div class="fix-box">🛠️ วิธีแก้: ${r.fix}</div>` : ''}
            </div>
        `).join('')}
        <div style="text-align:center; color:#666;">พิมพ์ ?p=จังหวัด&u=สลักน้อง เพื่อตรวจเจาะจง</div>
    </body>
    </html>`;

    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
};