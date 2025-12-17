import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
  const DOMAIN = "https://sidelinechiangmai.netlify.app";

  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|ia_archiver|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|quora\ link\ preview|outbrain|pinterest\/0\.|vkShare|W3C_Validator/i.test(userAgent);
  
  if (!isBot) return context.next(); 

  const url = new URL(request.url);
  const key = url.pathname.split('/').pop(); 

  try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data: prov } = await supabase.from('provinces').select('*').eq('key', key).maybeSingle();
      
      if (!prov) return context.next();

      const { data: profiles } = await supabase
        .from('profiles')
        .select('name, slug, location, rate, description')
        .eq('provinceKey', key)
        .order('created_at', { ascending: false })
        .limit(100);

      const listHtml = profiles?.map(p => `
        <li style="margin-bottom: 25px; list-style: none; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px;">
            <a href="${DOMAIN}/sideline/${p.slug}" style="text-decoration: none; color: #d53f8c; font-size: 1.3rem; font-weight: 800;">
                ไซด์ไลน์${prov.nameThai} น้อง ${p.name} พิกัด ${p.location || prov.nameThai}
            </a>
            <p style="color: #4a5568; margin: 8px 0; font-size: 1rem;">
                <strong>ราคา:</strong> ${p.rate || 'สอบถาม'} | <strong>ข้อมูล:</strong> ${p.description?.substring(0, 120) || 'น้องน่ารัก ตัวจริงตรงปก ทักมาสอบถามพิกัดได้เลยค่ะ'}...
            </p>
        </li>`).join('') || '<li>ขณะนี้ยังไม่มีข้อมูลน้องๆ ในพื้นที่นี้ โปรดกลับมาตรวจสอบใหม่ภายหลัง</li>';

      const html = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>รวมสาวไซด์ไลน์${prov.nameThai} รับงาน${prov.nameThai} พิกัดเด็ดรูปตรงปก - Sideline Chiangmai</title>
        <meta name="description" content="ศูนย์รวมน้องๆ ไซด์ไลน์${prov.nameThai} งานเอ็นเตอร์เทน พิกัดยอดฮิตใน${prov.nameThai} คัดคนสวย บริการประทับใจ ปลอดภัย 100% ดูโปรไฟล์รูปจริงได้ที่นี่">
        <link rel="canonical" href="${DOMAIN}/location/${key}">
        <meta name="robots" content="index, follow">
        <style>
            body { font-family: 'Tahoma', 'Arial', sans-serif; line-height: 1.8; color: #2d3748; max-width: 900px; margin: 0 auto; padding: 30px; background: #fff; }
            h1 { color: #d53f8c; font-size: 2rem; border-bottom: 3px solid #fbb6ce; padding-bottom: 15px; margin-bottom: 30px; }
            .intro-text { background: #fff5f7; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 5px solid #d53f8c; }
            footer { margin-top: 50px; text-align: center; font-size: 0.85rem; color: #a0aec0; border-top: 1px solid #edf2f7; padding-top: 20px; }
            a { color: #d53f8c; }
        </style>
      </head>
      <body>
        <main>
            <h1>ไซด์ไลน์${prov.nameThai} (Sideline ${prov.nameThai} Listings)</h1>
            <div class="intro-text">
                <p>ยินดีต้อนรับสู่แหล่งรวมโปรไฟล์ <strong>ไซด์ไลน์${prov.nameThai}</strong> ที่ดีที่สุด เราคัดสรรเฉพาะน้องๆ ที่มีตัวตนจริง รูปตรงปก 100% ไม่ว่าจะเป็นงานเอ็นเตอร์เทน เพื่อนเที่ยว หรือฟีลแฟน ในพื้นที่ ${prov.nameThai} พร้อมให้บริการคุณอย่างมืออาชีพ</p>
            </div>
            
            <section>
                <h2 style="font-size: 1.5rem; color: #4a5568;">น้องๆ ที่พร้อมให้บริการในพื้นที่ ${prov.nameThai}</h2>
                <ul style="padding: 0;">${listHtml}</ul>
            </section>

            <section style="margin-top: 40px; padding: 20px; background: #f7fafc; border-radius: 15px;">
                <h3>คำแนะนำการเลือกน้องๆ ไซด์ไลน์${prov.nameThai}</h3>
                <p>ในการนัดหมายน้องๆ ในพื้นที่ ${prov.nameThai} ควรตรวจสอบพิกัดที่แน่นอนและตกลงเรทราคาให้ชัดเจน เว็บไซต์ Sideline Chiangmai ของเราเน้นความปลอดภัยและรักษาความลับของลูกค้าเป็นอันดับหนึ่ง</p>
            </section>
        </main>
        <footer>
            <p>© ${new Date().getFullYear()} Sideline Chiangmai - <a href="${DOMAIN}/">หน้าแรก</a> | <a href="${DOMAIN}/locations.html">พิกัดทั้งหมด</a> | <a href="${DOMAIN}/blog.html">บทความน่าสนใจ</a></p>
        </footer>
      </body>
      </html>`;

      return new Response(html, {
        headers: { 
            "content-type": "text/html; charset=utf-8",
            "Netlify-CDN-Cache-Control": "public, max-age=3600, durable" 
        }
      });
  } catch (e) { 
      return context.next(); 
  }
};