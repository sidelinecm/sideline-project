import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'
};

export default async (req) => {
    const supabase = createClient(CONFIG.URL, CONFIG.KEY);
    const url = new URL(req.url);
    const targetSlug = url.searchParams.get('slug') || 'chiangmai'; // ใส่ slug น้อง หรือ slug จังหวัด

    let trace = [];

    // --- ส่วนที่ 1: ตรวจสอบเส้นทางรูปภาพ (Image Path Trace) ---
    const checkImage = async () => {
        const { data: p } = await supabase.from('profiles').select('name, imagePath').eq('status', 'active').limit(1).single();
        if (!p) return { status: '❌', msg: 'ไม่มีข้อมูลน้องในสถานะ active เลย' };
        
        const fullPath = `${CONFIG.URL}/storage/v1/object/public/profile-images/${p.imagePath}`;
        const res = await fetch(fullPath, { method: 'HEAD' });
        
        return {
            status: res.ok ? '✅' : '❌',
            msg: `เส้นทางรูป: ${p.imagePath}`,
            detail: res.ok ? `รูปโหลดได้ปกติ (${res.status})` : `รูปพังหรือไม่มีไฟล์จริงใน Storage (404)`
        };
    };

    // --- ส่วนที่ 2: ตรวจสอบรายละเอียดตัวอักษร SEO (Meta & Spintax Trace) ---
    const checkSEO = async () => {
        const { data: p } = await supabase.from('profiles').select('name, details').limit(1).single();
        if (!p) return { status: '❌', msg: 'ไม่พบรายละเอียด' };
        
        const hasThai = /[\u0E00-\u0E7F]/.test(p.details);
        return {
            status: hasThai ? '✅' : '⚠️',
            msg: `รายละเอียดของ ${p.name}`,
            detail: hasThai ? `มีภาษาไทยครบถ้วน (${p.details.length} ตัวอักษร)` : `รายละเอียดสั้นไปหรือไม่มีภาษาไทย (Bot อาจไม่ชอบ)`
        };
    };

    // --- ส่วนที่ 3: ตรวจสอบการเชื่อมต่อตาราง (Table Relation Trace) ---
    const checkRelation = async () => {
        const { data: prof } = await supabase.from('profiles').select('province_id').limit(1).single();
        const { data: prov } = await supabase.from('provinces').select('id').eq('id', prof?.province_id).single();
        
        return {
            status: prov ? '✅' : '❌',
            msg: 'การเชื่อมความสัมพันธ์ (Relation)',
            detail: prov ? `ID จังหวัดในตาราง Profiles ตรงกับตาราง Provinces` : `ID ไม่ตรงกัน (ทำให้น้องไม่โชว์ในหน้ารายจังหวัด)`
        };
    };

    // รันการตรวจสอบ
    const imgRes = await checkImage();
    const seoRes = await checkSEO();
    const relRes = await checkRelation();

    const html = `
    <html>
    <head><style>
        body { background: #0a0a0a; color: #33ff33; font-family: monospace; padding: 30px; }
        .box { border: 1px solid #33ff33; padding: 15px; margin-bottom: 15px; border-left: 10px solid #33ff33; }
        .error { border-color: #ff3333; color: #ff3333; border-left-color: #ff3333; }
        h2 { border-bottom: 2px solid; padding-bottom: 10px; }
    </style></head>
    <body>
        <h1>🛰️ DEEP SYSTEM TRACE REPORT</h1>
        <div class="box ${imgRes.status === '❌' ? 'error' : ''}">
            <h2>1. เส้นทางรูปภาพ (Storage Path)</h2>
            <p>สถานะ: ${imgRes.status} ${imgRes.msg}</p>
            <small>> ${imgRes.detail}</small>
        </div>
        <div class="box ${seoRes.status === '⚠️' ? 'error' : ''}">
            <h2>2. รายละเอียดเนื้อหา (SEO Metadata)</h2>
            <p>สถานะ: ${seoRes.status} ${seoRes.msg}</p>
            <small>> ${seoRes.detail}</small>
        </div>
        <div class="box ${relRes.status === '❌' ? 'error' : ''}">
            <h2>3. เส้นทางฐานข้อมูล (Database Mapping)</h2>
            <p>สถานะ: ${relRes.status} ${relRes.msg}</p>
            <small>> ${relRes.detail}</small>
        </div>
        <p style="color: #666;">* ตรวจสอบทุกตัวอักษรจากคำสั่ง Select และ Fetch จริง</p>
    </body></html>`;

    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
};