import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'
};

export default async (req) => {
    const supabase = createClient(CONFIG.URL, CONFIG.KEY);
    const url = new URL(req.url);
    const pSlug = url.searchParams.get('p') || 'chiangmai'; // ชื่อจังหวัดที่ต้องการตรวจ
    const uSlug = url.searchParams.get('u') || '';          // ชื่อสลักน้องที่ต้องการตรวจ

    let html = `<html><head><style>
        body { background: #0d1117; color: #c9d1d9; font-family: 'monospace'; padding: 20px; font-size: 14px; }
        .box { border: 1px solid #30363d; border-radius: 8px; padding: 15px; margin-bottom: 20px; background: #161b22; }
        .header { color: #58a6ff; font-size: 18px; border-bottom: 1px solid #30363d; padding-bottom: 10px; margin-bottom: 15px; font-weight: bold; }
        .row { display: flex; border-bottom: 1px solid #21262d; padding: 8px 0; }
        .label { width: 180px; color: #8b949e; font-weight: bold; }
        .value { flex: 1; word-break: break-all; }
        .pass { color: #3fb950; font-weight: bold; }
        .fail { color: #f85149; font-weight: bold; background: rgba(248,81,73,0.1); padding: 2px 5px; }
        .warning { color: #d29922; }
        code { background: #2d333b; padding: 2px 4px; border-radius: 4px; color: #e6edf3; }
    </style></head><body>`;

    html += `<h1>🛰️ ระบบตรวจสอบข้อมูลระดับ X-Ray</h1>`;

    // --- ส่วนที่ 1: ตรวจสอบจังหวัด (Province Check) ---
    const { data: prov, error: pErr } = await supabase.from('provinces').select('*').eq('slug', pSlug).maybeSingle();
    html += `<div class="box"><div class="header">1. การค้นหาจังหวัด (Path: /location/${pSlug})</div>`;
    if (pErr) {
        html += `<div class="row fail">ERROR: ${pErr.message}</div>`;
    } else if (!prov) {
        html += `<div class="row fail">ไม่พบจังหวัด "${pSlug}" ในตาราง provinces!</div>`;
        html += `<div class="row warning">💡 คำแนะนำ: เช็คคอลัมน์ "slug" ใน DB ว่าสะกดตัวเล็กหมดไหม หรือมีเว้นวรรคปนมาหรือเปล่า</div>`;
    } else {
        html += `<div class="row"><div class="label">ID ในระบบ:</div><div class="value">${prov.id}</div></div>`;
        html += `<div class="row"><div class="label">ชื่อไทย:</div><div class="value">${prov.nameThai}</div></div>`;
        html += `<div class="row"><div class="label">Slug ที่ใช้:</div><div class="value"><code>${prov.slug}</code></div></div>`;
        html += `<div class="row pass">✅ เชื่อมต่อหน้าจังหวัดสำเร็จ</div>`;
    }
    html += `</div>`;

    // --- ส่วนที่ 2: ตรวจสอบน้องๆ ในจังหวัดนี้ (Profiles Check) ---
    if (prov) {
        const { data: allProfiles } = await supabase.from('profiles').select('*').eq('province_id', prov.id);
        const activeProfiles = allProfiles?.filter(i => i.status === 'active') || [];
        
        html += `<div class="box"><div class="header">2. น้องๆ ในจังหวัด ${prov.nameThai}</div>`;
        html += `<div class="row"><div class="label">พบในฐานข้อมูล:</div><div class="value">${allProfiles?.length || 0} คน</div></div>`;
        html += `<div class="row"><div class="label">สถานะ active:</div><div class="value ${activeProfiles.length > 0 ? 'pass' : 'fail'}">${activeProfiles.length} คน</div></div>`;
        
        if (allProfiles?.length > 0 && activeProfiles.length === 0) {
            html += `<div class="row fail">⚠️ พบข้อมูลแต่ไม่โชว์: เพราะใน DB ตั้ง status เป็น "${allProfiles[0].status}" (ต้องแก้เป็น "active" ตัวเล็กเท่านั้น!)</div>`;
        }
        html += `</div>`;
    }

    // --- ส่วนที่ 3: เจาะลึกรายบุคคล (Profile Detail X-Ray) ---
    if (uSlug) {
        const { data: user } = await supabase.from('profiles').select('*').eq('slug', uSlug).maybeSingle();
        html += `<div class="box"><div class="header">3. เจาะลึกน้อง: ${uSlug}</div>`;
        if (!user) {
            html += `<div class="row fail">ไม่เจอน้อง slug "${uSlug}" ในตาราง profiles</div>`;
        } else {
            const fields = ['name', 'slug', 'status', 'province_id', 'imagePath', 'lineId'];
            fields.forEach(f => {
                const val = user[f];
                const isCorrect = f === 'status' ? val === 'active' : !!val;
                html += `<div class="row">
                    <div class="label">${f}:</div>
                    <div class="value ${isCorrect ? '' : 'fail'}">${val || 'ว่างเปล่า (NULL)'} ${isCorrect ? '✅' : '❌'}</div>
                </div>`;
            });
            
            // ตรวจสอบรูปภาพ
            const imgUrl = `${CONFIG.URL}/storage/v1/object/public/profile-images/${user.imagePath}`;
            const imgCheck = await fetch(imgUrl, { method: 'HEAD' });
            html += `<div class="row">
                <div class="label">ลิ้งก์รูปภาพ:</div>
                <div class="value">${imgCheck.ok ? `<span class="pass">ใช้งานได้</span>` : `<span class="fail">รูปพัง (404)</span>`}</div>
            </div>`;
            if (!imgCheck.ok) html += `<div class="row warning">💡 เช็คชื่อไฟล์ <code>${user.imagePath}</code> ว่าตรงกับใน Storage เป๊ะไหม (รวมถึง .jpg / .JPG)</div>`;
        }
        html += `</div>`;
    }

    html += `<p style="color:#444">วิธีใช้: /inspector?p=ชื่อจังหวัด&u=สลักน้อง</p></body></html>`;

    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
};