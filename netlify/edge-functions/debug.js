import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'
};

export default async (req) => {
    const supabase = createClient(CONFIG.URL, CONFIG.KEY);
    const url = new URL(req.url);
    const pSlug = url.searchParams.get('p') || 'chiangmai'; // slug จังหวัด (หน้าแรก)
    const uSlug = url.searchParams.get('u') || ''; // slug น้อง (หน้าโปรไฟล์)

    let report = { province: {}, profile: {} };

    // --- 1. ตรวจสอบ "หน้าแรก / หน้าจังหวัด" ---
    const { data: prov } = await supabase.from('provinces').select('*').eq('slug', pSlug).maybeSingle();
    if (!prov) {
        report.province = { status: '❌ FAIL', msg: `หาจังหวัด "${pSlug}" ไม่เจอ`, advice: 'เช็คตัวสะกด slug ในตาราง provinces' };
    } else {
        const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('province_id', prov.id).eq('status', 'active');
        report.province = { status: '✅ PASS', msg: `จังหวัด: ${prov.nameThai}`, detail: `มีน้องออนไลน์ (active) อยู่ ${count} คน`, advice: count === 0 ? 'ไปแก้ status น้องเป็น active ใน DB' : '-' };
    }

    // --- 2. ตรวจสอบ "หน้าโปรไฟล์น้อง" ---
    if (uSlug) {
        const { data: user } = await supabase.from('profiles').select('*').eq('slug', uSlug).maybeSingle();
        if (!user) {
            report.profile = { status: '❌ FAIL', msg: `ไม่เจอน้อง slug: "${uSlug}"`, advice: 'เช็คตัวสะกด slug ในตาราง profiles' };
        } else {
            const imgUrl = `${CONFIG.URL}/storage/v1/object/public/profile-images/${user.imagePath}`;
            const imgRes = await fetch(imgUrl, { method: 'HEAD' });
            report.profile = { 
                status: (imgRes.ok && user.status === 'active') ? '✅ PASS' : '❌ FAIL', 
                msg: `ชื่อน้อง: ${user.name}`, 
                detail: `Status: ${user.status} | รูปภาพ: ${imgRes.ok ? 'ปกติ' : 'พัง (404)'}`,
                advice: user.status !== 'active' ? 'ต้องแก้ status เป็น active' : (!imgRes.ok ? 'ชื่อไฟล์รูปใน DB ไม่ตรงกับใน Storage' : '-')
            };
        }
    }

    const html = `
    <html>
    <head>
        <title>Dashboard Monitor</title>
        <style>
            body { background: #0b0f19; color: #fff; font-family: sans-serif; padding: 20px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 1000px; margin: auto; }
            .card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 20px; }
            .PASS { border-top: 4px solid #238636; }
            .FAIL { border-top: 4px solid #da3633; }
            h2 { color: #58a6ff; margin-top: 0; }
            .status { font-weight: bold; margin-bottom: 10px; }
            .advice { font-size: 13px; color: #f2cc60; background: rgba(242,204,96,0.1); padding: 10px; border-radius: 5px; margin-top: 10px; }
        </style>
    </head>
    <body>
        <h1 style="text-align:center;">🔍 ตรวจสอบพิกัด หน้าแรก & หน้าโปรไฟล์</h1>
        <div class="grid">
            <div class="card ${report.province.status?.includes('PASS') ? 'PASS' : 'FAIL'}">
                <h2>🏠 ตรวจสอบหน้าแรก/จังหวัด</h2>
                <div class="status">${report.province.status || 'รอดำเนินการ'}</div>
                <div>${report.province.msg || ''}</div>
                <div style="font-size:14px; color:#8b949e;">${report.province.detail || ''}</div>
                ${report.province.advice !== '-' ? `<div class="advice">💡 ${report.province.advice}</div>` : ''}
            </div>

            <div class="card ${report.profile.status?.includes('PASS') ? 'PASS' : 'FAIL'}">
                <h2>👤 ตรวจสอบหน้าโปรไฟล์</h2>
                ${uSlug ? `
                    <div class="status">${report.profile.status}</div>
                    <div>${report.profile.msg}</div>
                    <div style="font-size:14px; color:#8b949e;">${report.profile.detail}</div>
                    ${report.profile.advice !== '-' ? `<div class="advice">💡 ${report.profile.advice}</div>` : ''}
                ` : `<div style="color:#666;">ใส่ ?u=slug-น้อง บน URL เพื่อเริ่มตรวจ</div>`}
            </div>
        </div>
        <p style="text-align:center; color:#444; margin-top:30px;">
            ตัวอย่าง: /inspector?p=lampang&u=oopoo-65-65-65
        </p>
    </body>
    </html>`;

    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
};