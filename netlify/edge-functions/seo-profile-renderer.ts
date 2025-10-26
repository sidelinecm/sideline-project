// netlify/edge-functions/seo-profile-renderer.ts
// ... (Imports and Constants เดิม)

// ฟังก์ชันสำหรับตรวจจับ Google Bot
const isGoogleBot = (request: Request) => {
    const userAgent = request.headers.get("user-agent") || "";
    // User Agent ที่ Netlify Edge Function สามารถตรวจจับได้
    return userAgent.includes("Googlebot") || userAgent.includes("bingbot") || userAgent.includes("Slurp");
};

export default async (request: Request, context: Context) => {
    
    // ⬇️⬇️ ตรวจสอบว่าควรทำงานหรือไม่ ⬇️⬇️

    // 1. ถ้าไม่ใช่ Google Bot และไม่ใช่เส้นทาง SEO ที่แยกไว้
    const url = new URL(request.url);
    const isSeoPath = url.pathname.startsWith('/seo-profiles/');

    if (!isGoogleBot(request) && !isSeoPath) {
        // ถ้าเป็นผู้ใช้ทั่วไปและเข้า URL ปกติ ให้ข้ามไปใช้ HTML + main.js เดิม
        return context.next(); 
    }
    
    // 2. ถ้าเป็น Google Bot หรือเข้าสู่เส้นทาง /seo-profiles/ ให้ทำงานต่อ

    // ... (โค้ดดึง HTML ต้นฉบับ, เชื่อมต่อ Supabase, ดึงข้อมูล)

    // ... (ส่วนการสร้าง HTML/Meta Tags และแทนที่ #dynamic-content-placeholder)

    // 7. ส่ง Response ที่ถูกแก้ไขกลับไป
    return new Response(modifiedHtml, { 
        // ... (Headers เดิม)
    });
};
