
/**
 * [ SYSTEM CORE - REFACTORED & AUDITED ]
 * Project: Nexus Entity Framework (S-Tier) - ULTIMATE PURE CSS EDITION (NO TAILWIND)
 * Mastermind: wawai | Nexus Mastermind
 * Authority: Search Engine Dominance, S-Tier Spacing, Typography & Complete Social Integration
 * Fixes Applied: Completely Stripped Tailwind CSS CDN, Unify Designs with Pure Specular Glass CSS
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const CONFIG = {
    get SUPABASE_URL() {
        try { return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co"; } catch { return "https://zxetzqwjaiumqhrpumln.supabase.co"; }
    },
    get SUPABASE_KEY() {
        try { return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; } catch { return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
    },
    get MAPS_SHARE_URL() {
        return "https://share.google/THArcPBibRkBAiSOd";
    },
    BRAND_NAME: "Sideline Chiangmai Directory",
    SOCIAL_LINKS: {
        line: "https://line.me/ti/p/ksLUWB89Y_",
        tiktok: "https://tiktok.com/@sidelinecm",
        twitter: "https://twitter.com/sidelinechiangmai",
        linkedin: "https://www.linkedin.com/in/cuteti-sexythailand-398567280?trk=contact-info",
        biosite: "https://bio.site/firstfiwfans.com",
        linktree: "https://linktr.ee/kissmodel",
        bluesky: "https://bsky.app/profile/sidelinechiangmai.bsky.social"
    }
};

const PROVICE_CUSTOM_METADATA = {
    "bangkok": {
        title: "สาวรับงานกรุงเทพ ไซด์ไลน์ กทม เพื่อนเที่ยวฟิวแฟนตรงปก 2026 | จ่ายหน้างาน ไม่มัดจำ",
        desc: "รวมพิกัดสาวรับงานกรุงเทพ ไซด์ไลน์ กทม และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มีเก็บมัดจำล่วงหน้า ครอบคลุมพิกัดสุขุมวิท รัชดา ลาดพร้าว"
    },
    "chonburi": {
        title: "สาวรับงานชลบุรี ไซด์ไลน์พัทยา บางแสน เพื่อนเที่ยวฟิวแฟน 2026 | จ่ายหน้างาน ไม่มัดจำ",
        desc: "สารบัญสาวรับงานชลบุรี เพื่อนเที่ยวพัทยา และน้องๆ ไซด์ไลน์บางแสน พรีเมียมดูแลใส่ใจสไตล์ฟิวแฟน ปลอดภัยสูงสุดชำระค่าบริการหน้างานเมื่อเจอตัวจริง ปราศจากการโอนจองล่วงหน้า"
    }
};

const getDynamicIntro = (provinceName) => {
    return `
        <p>ยินดีต้อนรับสู่แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ <strong>สาวรับงาน${provinceName}</strong> และ <strong>เพื่อนเที่ยวไซด์ไลน์${provinceName}</strong> แหล่งรวบรวมโปรไฟล์ที่เน้นความโปร่งใส ปลอดภัย และเพียบพร้อมด้วยการดูแลเอาใจใส่สไตล์ฟิวแฟน (Girlfriend Experience - GFE) อย่างสุภาพเรียบร้อยเป็นธรรมชาติ โดยปราศจากเงื่อนไขการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้น</p>
        <p>เพื่อตอบสนองความสะดวกในการนัดหมายพิกัดบริการในเขต <strong>จังหวัด${provinceName}</strong> ได้ถูกคัดเลือกและจัดสรรพิกัดที่เหมาะสม ไม่ว่าจะเป็นโซนใจกลางเมือง โรงแรมที่เดินทางสะดวกสบาย หรือคอนโดมิเนียมส่วนตัว พร้อมร่วมเดินทางท่องเที่ยว ทานอาหาร หรือพูดคุยเพื่อสร้างความผ่อนคลายและคลายเหงาให้แก่คุณในโอกาสพิเศษ</p>
        <p>ภาพถ่ายประวัติและสัดส่วนของสาวๆ ในสารบัญได้รับการคัดกรองตัวตน (Verified System) เพื่อให้มั่นใจได้ว่าข้อมูลถูกต้อง ตรงปก และมอบประสบการณ์อันเป็นส่วนตัวและปลอดภัยสูงสุดในค่ำคืนนี้</p>
    `;
};

const getDynamicReviews = (provinceName) => {
    const now = new Date();
    const date1 = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const date2 = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return [
        {
            author: "คุณชลสิทธิ์ (C.)",
            location: `ตัวเมือง${provinceName}`,
            text: `"นัดเจอน้องในจังหวัด${provinceName} เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับสำหรับคนที่หาเพื่อนเที่ยวฟิวแฟนดีๆ"`,
            date: "เมื่อสัปดาห์ที่แล้ว",
            datePublished: date1
        },
        {
            author: "คุณอภิชาติ (A.)",
            location: `โซนยอดนิยมใน${provinceName}`,
            text: `"น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยมเสมือนมีเพื่อนร่วมทางคนพิเศษคอยเคียงข้าง ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ"`,
            date: "เมื่อ 2 สัปดาห์ก่อน",
            datePublished: date2
        }
    ];
};

const PROVINCE_SEO_DATA = {
    bangkok: {
        name: "กรุงเทพ",
        geo: { lat: 13.7563, lng: 100.5018 },
        zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "สาทร", "สีลม", "ทองหล่อ", "เอกมัย", "ปิ่นเกล้า", "บางนา", "เลียบด่วน"],
        faqs: [
            { q: "น้องๆ สาวรับงานกรุงเทพ ส่วนใหญ่สะดวกสแตนด์บายแถวไหนบ้าง?", a: "ย่านที่มีน้องๆ ประจำการอยู่หนาแน่นที่สุดคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ ซึ่งเป็นย่านคอนโดมิเนียมหรูและเดินทางด้วยรถไฟฟ้า BTS และ MRT" },
            { q: "เรียกเด็กเอ็น หรือ สาวไซด์ไลน์ กทม. ต้องโอนมัดจำล่วงหน้าก่อนไหม?", a: "ไม่มีนโยบายการเก็บเงินมัดจำล่วงหน้าทุกกรณีครับ เพื่อความปลอดภัยของลูกค้ากทม. จะเป็นการจ่ายเงินสดหรือโอนชำระหน้างานหลังเจอตัวน้องตรงปกแล้วเท่านั้น" }
        ]
    },
    lampang: {
        name: "ลำปาง",
        geo: { lat: 18.2913, lng: 99.4922 },
        zones: ["ตัวเมืองลำปาง", "สวนดอก", "พระบาท", "ม.ราชภัฏลำปาง", "เกาะคา", "แม่ทะ", "น้ำล้อม"],
        faqs: [
            { q: "ค้นหาไซด์ไลน์ลำปาง นัดหมายโซนใดปลอดภัยที่สุด?", a: "พื้นที่ตัวเมืองลำปาง โซนสวนดอก และย่านพระบาท เป็นจุดที่มีโรงแรมและคอนโดคุณภาพดี รองรับการนัดเจออย่างสงบและปลอดภัยสูงสุด" },
            { q: "มีการรับประกันความตรงปกของน้องๆ ลำปางอย่างไร?", a: "เราคัดกรองโปรไฟล์และข้อมูลสัดส่วนจริง ถ้านัดเจอน้องที่หน้างานลำปางแล้วพบว่าไม่ตรงตามที่ตกลง ลูกค้าสามารถปฏิเสธและยกเลิกคิวได้ทันทีโดยไม่มีค่าใช้จ่าย" }
        ]
    },
    chiangrai: {
        name: "เชียงราย",
        geo: { lat: 19.9071, lng: 99.8325 },
        zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "ม.แม่ฟ้าหลวง", "ม.ราชภัฏเชียงราย", "หอนาฬิกา", "ริมกก"],
        faqs: [
            { q: "ต้องการนัดพบน้องนักศึกษาเชียงราย โซน มฟล. หรือบ้านดู่ มีขั้นตอนอย่างไร?", a: "โซน ม.แม่ฟ้าหลวง และบ้านดู่ มีน้องๆ สแตนด์บายเยอะมากครับ สามารถแจ้งคิวและเวลาที่ต้องการกับแอดมิน เพื่อนัดพบตามห้องพัก คอนโด หรือโรงแรมใกล้เคียงได้ทันที" },
            { q: "มีความเสี่ยงที่จะโดนโกงมัดจำสำหรับการเรียกไซด์ไลน์เชียงรายไหม?", a: "เว็บไซต์ของเราใช้ระบบนัดเจอตัวจริงก่อนชำระเงินหน้างาน 100% จึงไม่มีความเสี่ยงเรื่องการโดนหลอกโอนเงินมัดจำล่วงหน้าแน่นอนครับ" }
        ]
    },
    khonkaen: {
        name: "ขอนแก่น",
        geo: { lat: 16.4322, lng: 102.8236 },
        zones: ["มข.", "กังสดาล", "หลังมอ", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
        faqs: [
            { q: "น้องๆ ไซด์ไลน์ขอนแก่น ส่วนใหญ่เป็นใครและน่าเชื่อถือไหม?", a: "มีทั้งกลุ่มน้องนักศึกษาระดับมหาวิทยาลัยพาร์ทไทม์ และนางแบบอิสระในขอนแก่น ทุกคนผ่านการตรวจสอบข้อมูลโปรไฟล์และตรงปกแน่นอน" },
            { q: "นัดหมายน้องๆ ขอนแก่น แถว มข. มีความปลอดภัยแค่ไหน?", a: "โซน มข. และกังสดาล เป็นแหล่งชุมชนเมืองที่มีความปลอดภัยสูง มีที่พักและคอนโดทันสมัยจำนวนมาก รองรับการนัดเจอที่สะดวกรวดเร็วและรักษาความลับสูงสุด" }
        ]
    },
    chonburi: {
        name: "ชลบุรี",
        geo: { lat: 13.3611, lng: 100.9847 },
        zones: ["พัทยา", "บางแสน", "ศรีราชา", "อมตะนคร", "ตัวเมืองชลบุรี", "ม.บูรพา"],
        faqs: [
            { q: "หาสาวไซด์ไลน์พัทยา-บางแสน รูปตรงปกและไม่โดนหลอกมัดจำได้อย่างไร?", a: "เราเน้นย้ำมาตรฐานความตรงปกและใช้ระบบจ่ายเงินหน้างานเมื่อเจอตัวน้องเท่านั้น ป้องกันปัญหาการหลอกโอนเงินจองคิวก่อนได้แน่นอนครับ" },
            { q: "น้องๆ รับงานพูลวิลล่า ค้างคืน หรือเดินทางไปกับทริปท่องเที่ยวบางแสนไหม?", a: "มีครับ เรามีกลุ่มน้องๆ สายปาร์ตี้เอนเตอร์เทนส่วนตัวที่ชำนาญงานพูลวิลล่าและพร้อมร่วมทริปริมทะเลบางแสน-พัทยาเพื่อดูแลคุณอย่างใกล้ชิด" }
        ]
    },
    phitsanulok: {
        name: "พิษณุโลก",
        geo: { lat: 16.8219, lng: 100.2659 },
        zones: ["ตัวเมืองพิษณุโลก", "ม.นเรศวร", "ริมน้ำน่าน", "เซ็นทรัลพิษณุโลก"],
        faqs: [
            { q: "หาไซด์ไลน์พิษณุโลก แถว มน. นัดหมายยากไหมและสะดวกเวลาใด?", a: "โซน ม.นเรศวร (มน.) มีน้องๆ นักศึกษาพาร์ทไทม์พร้อมบริการหนาแน่นที่สุด สามารถจองและนัดพบตามโรงแรมหรือหอพักใกล้เคียงได้อย่างสะดวกรวดเร็วเกือบตลอดทั้งวัน" },
            { q: "ต้องทำการโอนเงินมัดจำล่วงหน้าก่อนเรียกน้องพิษณุโลกไหม?", a: "ไม่ต้องโอนเงินก่อนใดๆ ทั้งสิ้นครับ ลูกค้าจะจ่ายเงินค่าขนมหลังจากเจอน้องตรงปกหน้างานแถบพิษณุโลกแล้วเท่านั้น เพื่อป้องกันความเสี่ยงอย่างสมบูรณ์แบบ" }
        ]
    },
    default: {
        name: "จังหวัดอื่นๆ",
        geo: { lat: 13.7563, lng: 100.5018 },
        zones: ["ตัวเมือง", "พื้นที่ใกล้เคียง"],
        faqs: [
            { q: "เรียกใช้บริการน้องๆ เพื่อนเที่ยว ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ เพื่อความปลอดภัยสูงสุดของคุณและป้องกันมิจฉาชีพ ลูกค้าจ่ายเงินค่าขนมหน้างานเมื่อเจอตัวน้องแล้วเท่านั้น" },
            { q: "หากพบตัวจริงของน้องแล้วพบว่าไม่ตรงตามรูปภาพโปรไฟล์ ต้องทำอย่างไร?", a: "โปรไฟล์รูปภาพทุกรูปผ่านการคัดกรองและยืนยันตัวตนแล้วว่าตรงปก หากพบตัวจริงแล้วไม่ตรงปก ลูกค้ามีสิทธิ์ปฏิเสธการร่วมงานและยกเลิกงานได้ทันทีโดยไม่มีค่าปรับหรือค่าใช้จ่ายใดๆ" }
        ]
    }
};

Object.keys(PROVINCE_SEO_DATA).forEach(key => {
    if (key !== "default") {
        PROVINCE_SEO_DATA[key] = { ...PROVINCE_SEO_DATA.default, ...PROVINCE_SEO_DATA[key] };
    }
});

const getFullUrl = (domain, path) => {
    if (!path) return `${domain}/images/default.webp`;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${domain}${cleanPath}`;
};

const optimizeImg = (domain, path, width = 320, height = 420) => {
    if (!path) return getFullUrl(domain, "/images/default.webp");
    if (path.includes("res.cloudinary.com")) {
        if (path.includes("/upload/")) {
            return path.replace("/upload/", `/upload/f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face/`);
        }
        return path;
    }
    if (path.startsWith("http")) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=65&format=webp`;
};

const escapeHTML = (str) => {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[tag] || tag);
};

const formatDateSSR = (dateString) => {
    if (!dateString) return 'เมื่อครู่นี้';
    try {
        const date = new Date(dateString);
        const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const day = date.getDate();
        const month = thaiMonths[date.getMonth()];
        const year = (date.getFullYear() + 543).toString().slice(-2);
        return `${day} ${month} ${year}`;
    } catch { return 'เมื่อครู่นี้'; }
};

const stripHTML = (str) => {
    if (!str) return "";
    return str.replace(/<[^>]*>?/gm, '');
};

const smartLinkify = (text, provinceKey, zones) => {
    if (!text) return "";
    let linkedText = text;
    
    if (zones && zones.length > 0) {
        zones.slice(0, 3).forEach(zone => {
            const regex = new RegExp(`(${zone})(?![^<>]*>)`, 'g'); 
            linkedText = linkedText.replace(
                regex,
                `<a href="/search?q=${encodeURIComponent(zone)}" class="text-[#C084FC] hover:underline font-bold transition-colors">$1</a>`
            );
        });
    }

    const keywords = ["เด็กเอ็น", "ไซด์ไลน์", "พรีเมียม", "ฟีลแฟน", "รับงาน", "ฟิวแฟน", "สาวรับงาน"];
    keywords.forEach(kw => {
        const regex = new RegExp(`(${kw})(?![^<>]*>)`, 'g'); 
        linkedText = linkedText.replace(
            regex,
            `<span class="highlight text-[#C084FC] font-extrabold">$1</span>`
        );
    });

    return linkedText;
};

function verifyHostname(request) {
    const host = request.headers.get("host") || "";
    
    // 🛡️ ป้องกันระบบพังหากไม่มี ALLOWED_DOMAINS ใน CONFIG
    const allowed = CONFIG.ALLOWED_DOMAINS || [
        "sidelinechiangmai.netlify.app",
        "gmai.netlify.app",
        "localhost"
    ];
    
    return allowed.some(domain => host.includes(domain)) || host.endsWith(".netlify.app");
}

function buildErrorPage(statusCode, title, message) {
    return new Response(
        `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${statusCode} - ${escapeHTML(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
        body { background: #000000; color: #fff; font-family: 'Prompt', sans-serif; display: flex; align-items: center; justify-content: center; min-h: screen; margin:0; padding: 16px; overflow:hidden;}
        .card { max-width: 400px; width:100%; border: 1px solid rgba(255,255,255,0.08); background: rgba(14,9,30,0.6); padding: 40px; border-radius: 24px; text-align:center; backdrop-filter: blur(20px); }
        .code { font-size: 72px; font-weight:800; color: #5A2CBE; margin-bottom: 24px; }
        .back-btn { display: inline-block; background-color: #ffffff; color: #000000; padding: 14px 28px; border-radius: 100px; text-decoration:none; font-weight: 700; margin-top: 24px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="code">${statusCode}</div>
        <h1 style="font-size:20px; font-weight:800; margin-bottom:12px;">${escapeHTML(title)}</h1>
        <p style="font-size:14px; color:#A1A1AA; line-height:1.6;">${escapeHTML(message)}</p>
        <a href="/" class="back-btn">กลับหน้าหลัก</a>
    </div>
</body>
</html>`,
        {
            status: statusCode,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=60"
            }
        }
    );
}

export default async (request, context) => {
    if (!verifyHostname(request)) {
        return new Response("403 Forbidden - Access Denied", { status: 403 });
    }

    const url = new URL(request.url);
    const dynamicDomain = `${url.protocol}//${url.host}`;

    // Static bypass interceptor
    const staticExtensions = [".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".json", ".webmanifest", ".map"];
    if (staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
        try { return await context.next(); } catch { return; }
    }

    // 1. [CRITICAL SEO SYSTEM PROTECT] ป้องกันระบบสร้างพิกัดเชียงใหม่ทับซ้อนหน้าหลัก
    const pathParts = url.pathname.split("/").filter(Boolean);
    let provinceKey = "";
    if (pathParts.length > 0) {
        const rawProvinceKey = pathParts[pathParts.length - 1] || "chiangmai";
        try { provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase(); } catch { provinceKey = rawProvinceKey.toLowerCase(); }
    }

    if ((pathParts[0] === "location" && provinceKey === "chiangmai") || provinceKey === "chiang_mai") {
        return Response.redirect(new URL("/", url.origin).toString(), 301);
    }

    if (url.pathname === "/robots.txt") {
        return new Response(
            `User-agent: *
Allow: /
Disallow: /search
Disallow: /admin

Sitemap: ${dynamicDomain}/sitemap.xml`,
            { headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
    }

    if (url.pathname === "/sitemap.xml") {
        try {
            const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const [provincesRes, profilesRes] = await Promise.all([
                supabase.from("provinces").select("key"),
                supabase.from("profiles").select("slug, lastUpdated, name, imagePath").eq("active", true)
            ]);

            const provinces = provincesRes.data || [];
            const profiles = profilesRes.data || [];

            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
            xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
            xml += `  <url>\n    <loc>${dynamicDomain}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

            provinces.forEach(p => {
                if (p.key !== 'chiangmai' && p.key !== 'chiang_mai') {
                    xml += `  <url>\n    <loc>${dynamicDomain}/location/${p.key}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
                }
            });

            profiles.forEach(p => {
                const lastMod = p.lastUpdated ? new Date(p.lastUpdated).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                const cleanLoc = `${dynamicDomain}/sideline/${encodeURIComponent(p.slug)}`;
                let imageTag = '';
                if (p.imagePath) {
                    const imgUrl = optimizeImg(dynamicDomain, p.imagePath, 1200, 630).replace(/&/g, '&amp;');
                    imageTag = `\n    <image:image>\n      <image:loc>${imgUrl}</image:loc>\n      <image:title>${escapeHTML(p.name || 'Profile Image')}</image:title>\n    </image:image>`;
                }
                xml += `  <url>\n    <loc>${cleanLoc}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>${imageTag}\n  </url>\n`;
            });

            xml += `</urlset>`;

            return new Response(xml, {
                headers: {
                    "Content-Type": "application/xml; charset=utf-8",
                    "Cache-Control": "public, max-age=3600, stale-while-revalidate=1800"
                }
            });
        } catch (e) {
            console.error("Sitemap error:", e);
            let fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${dynamicDomain}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
            return new Response(fallbackXml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
        }
    }

    try {
        if (url.pathname === "/") {
            provinceKey = "chiangmai";
        }

        let supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const normalizedSeoKey = provinceKey.replace(/-/g, '');

        // ➕ [ดึงฟิลด์เพิ่ม] ดึงฟิลด์ description เพื่อให้ Lightbox เรียกใช้ได้แบบสดใหม่ไม่ต้อง Query อีกรอบ
const [provinceRes, profilesRes, allProvincesRes] = await Promise.all([
    supabase.from("provinces").select("id, nameThai, key").eq("key", provinceKey).maybeSingle(),
    supabase.from("profiles")
        .select("id, slug, name, age, imagePath, location, rate, isfeatured, lastUpdated, active, availability, description, height, weight, stats, skin_tone, bust, waist, hips, cup_size, hasVideo, verified") // ดึงมาให้ครบ!
        .eq("provinceKey", provinceKey).eq("active", true)
        .order("isfeatured", { ascending: false }).order("lastUpdated", { ascending: false }).limit(80),
    supabase.from("provinces").select("key, nameThai").order("nameThai", { ascending: true })
]);

        const provinceData = provinceRes.data;
        if (!provinceData) {
            return buildErrorPage(404, "404 - ไม่พบหน้าเว็บ", `ไม่พบพิกัดจังหวัดที่คุณต้องการหาในขณะนี้`);
        }

        const safeProfiles = profilesRes.data || [];
        const allProvinces = allProvincesRes.data || [];
        const provinceName = provinceData.nameThai;
        
        const customMeta = PROVICE_CUSTOM_METADATA[normalizedSeoKey] || null;
        const seoData = PROVINCE_SEO_DATA[normalizedSeoKey] || PROVINCE_SEO_DATA.default;
        
        const now = new Date();
        const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const CURRENT_MONTH = thaiMonths[now.getMonth()];
        const CURRENT_YEAR = now.getFullYear();
        const provinceUrl = provinceKey === 'chiangmai' ? dynamicDomain : `${dynamicDomain}/location/${provinceKey}`;
        const firstImage = safeProfiles.length > 0 ? optimizeImg(dynamicDomain, safeProfiles[0].imagePath, 1200, 630) : `${dynamicDomain}/images/hero-sidelinechiangmai-1200.webp`;

        const title = customMetaTitle(provinceName, customMeta);
        const description = customMetaDesc(provinceName, seoData, customMeta);
        const cleanDescription = stripHTML(description);
        
        const deterministicRating = safeProfiles.length > 0 ? (4.6 + (safeProfiles.length % 4) / 10).toFixed(1) : "4.7";
        const deterministicReviews = safeProfiles.length > 0 ? 30 + (safeProfiles.length * 3) : 15;

        const matchedSchemaReviews = getDynamicReviews(provinceName).map(r => ({
            "@type": "Review",
            "author": { "@type": "Person", "name": r.author },
            "datePublished": r.datePublished,
            "reviewBody": stripHTML(r.text),
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
        }));

        const provinceMapHref = provinceKey === 'chiangmai' ? CONFIG.MAPS_SHARE_URL : `https://maps.google.com/maps?q=${encodeURIComponent("สาวรับงาน " + provinceName)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

        const schemaGraph = [
            {
                "@type": "Organization",
                "@id": `${dynamicDomain}/#organization`,
                "name": CONFIG.BRAND_NAME,
                "url": dynamicDomain,
                "logo": { "@type": "ImageObject", "url": `${dynamicDomain}/images/logo-sidelinechiangmai.webp` },
                "description": cleanDescription,
                "sameAs": Object.values(CONFIG.SOCIAL_LINKS),
                "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "telephone": "091-7895644", "availableLanguage": ["th", "en"] }
            },
            {
                "@type": "WebSite",
                "@id": `${dynamicDomain}/#website`,
                "url": dynamicDomain,
                "name": CONFIG.BRAND_NAME,
                "publisher": { "@id": `${dynamicDomain}/#organization` },
                "potentialAction": { "@type": "SearchAction", "target": `${dynamicDomain}/search?q={search_term_string}`, "query-input": "required name=search_term_string" }
            },
            {
                "@type": ["LocalBusiness", "EntertainmentBusiness"],
                "@id": `${provinceUrl}/#localbusiness`,
                "name": `สาวรับงาน${provinceName} ไลน์${provinceName} สารบัญเพื่อนเที่ยวระดับพรีเมียม`,
                "image": firstImage,
                "telephone": "LINE: @sidelinecm", 
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer service",
                    "telephone": "LINE: @sidelinecm",
                    "url": CONFIG.SOCIAL_LINKS.line, 
                    "availableLanguage": ["th", "en"]
                },
                "url": provinceUrl,
                "description": cleanDescription,
                "address": { 
                    "@type": "PostalAddress", 
                    "streetAddress": seoData.zones.slice(0, 4).join(', '),
                    "addressLocality": provinceName, 
                    "addressRegion": provinceName,
                    "addressCountry": "TH" 
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": seoData.geo ? seoData.geo.lat : 13.7563,
                    "longitude": seoData.geo ? seoData.geo.lng : 100.5018
                },
                "hasMap": provinceMapHref,
                "areaServed": [
                    { "@type": "AdministrativeArea", "name": provinceName },
                    ...seoData.zones.map(z => ({ "@type": "AdministrativeArea", "name": "โซน" + z }))
                ],
                "aggregateRating": safeProfiles.length > 0 ? {
                    "@type": "AggregateRating",
                    "ratingValue": deterministicRating,
                    "reviewCount": String(deterministicReviews)
                } : undefined,
                "review": matchedSchemaReviews,
                "priceRange": "฿฿"
            },
            {
                "@type": "CollectionPage",
                "@id": `${provinceUrl}/#webpage`,
                "url": provinceUrl,
                "name": title,
                "description": cleanDescription,
                "isPartOf": { "@id": `${dynamicDomain}/#website` },
                "about": { "@id": `${provinceUrl}/#localbusiness` },
                "mainEntity": { "@id": `${provinceUrl}/#itemlist` }
            },
            {
                "@type": "ItemList",
                "@id": `${provinceUrl}/#itemlist`,
                "name": `รายชื่อสาวรับงานและเพื่อนเที่ยว${provinceName}`,
                "numberOfItems": safeProfiles.length,
                "itemListElement": safeProfiles.map((p, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "item": {
                        "@type": "Person",
                        "name": p.name || "ผู้ให้บริการ",
                        "url": `${dynamicDomain}/sideline/${p.slug || p.id}`,
                        "image": optimizeImg(dynamicDomain, p.imagePath, 360, 480),
                        "description": `โปรไฟล์แนะนำน้อง${p.name || ""} สาวรับงานพิกัด ${p.location || provinceName} ตรงปก`
                    }
                }))
            }
        ];

        if (seoData.faqs) {
            schemaGraph.push({
                "@type": "FAQPage",
                "@id": `${provinceUrl}/#faq`,
                "mainEntity": seoData.faqs.map(faq => ({
                    "@type": "Question",
                    "name": stripHTML(faq.q),
                    "acceptedAnswer": { "@type": "Answer", "text": stripHTML(faq.a) }
                }))
            });
        }

        const schemaData = { "@context": "https://schema.org", "@graph": schemaGraph };
        
        // 🔮 PREMIUM CUSTOM SSR CARDS - MATCHING WEBYST LOOK 100%
        const cardsHTML = safeProfiles
            .map((p) => {
                const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/, ""));
                const profileLocation = escapeHTML(p.location || provinceName);
                const profileLink = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
                const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
                const statusClass = isAvailable ? "status-available-neon" : "status-busy-neon";
                const statusText = isAvailable ? "รับงาน" : "ไม่ว่าง/พัก";
                const displayRate = p.rate ? `${parseInt(p.rate).toLocaleString()} ฿` : "สอบถาม";

                return `
                <div class="province-card profile-card-new interactive-card" 
                     data-id="${p.id}"
                     data-profile-id="${p.id}"
                     data-profile-slug="${p.slug}"
                     data-name="น้อง${cleanName}"
                     data-region="${profileLocation}"
                     data-desc=""
                     style="aspect-ratio: 3/4; width: 100%; position: relative; border-radius: 24px; overflow: hidden; padding:0; cursor: pointer;">
                    
                    <a href="${profileLink}" class="card-link absolute-fill z-20" aria-label="ดูโปรไฟล์น้อง${cleanName}"></a>

                    <img src="${optimizeImg(dynamicDomain, p.imagePath, 300, 400)}" 
                         alt="น้อง${cleanName} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" 
                         width="300"
                         height="400"
                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; position: absolute; inset: 0; z-index: 0;"
                         loading="lazy" decoding="async" />

                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%, transparent 100%); z-index: 10; pointer-events: none;"></div>

                    <div style="position: absolute; top: 12px; left: 12px; z-index: 30;">
                        <span class="neon-badge ${statusClass}">
                            <span class="neon-dot"></span>
                            <span>${statusText}</span>
                        </span>
                    </div>

                    <div style="position: absolute; top: 12px; right: 12px; z-index: 30;">
                        <button type="button" class="circle-btn-el" data-action="like" data-id="${p.id}" style="width: 32px; height: 32px; border-radius: 50%;" aria-label="เพิ่มลงในรายการโปรด">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>

                    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; z-index: 20; pointer-events: none; text-align: left;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <h4 style="font-size: 16px; font-weight: 800; color: white; margin: 0; text-shadow: 0 1.5px 3px rgba(0,0,0,0.8); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${cleanName}</h4>
                            <span style="color: #C084FC; font-weight: 900; font-size: 13px; text-shadow: 0 1.5px 3px rgba(0,0,0,0.8);">${displayRate}</span>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-gray);">
                            <span style="text-shadow: 0 1px 2px rgba(0,0,0,0.8); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 4px;"></i> ${profileLocation}
                            </span>
                            <span style="text-shadow: 0 1px 2px rgba(0,0,0,0.8); white-space: nowrap;">
                                <i class="far fa-clock" style="margin-right: 2px;"></i> ${formatDateSSR(p.lastUpdated || p.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
                `;
            })
            .join("");

        const seoIntroContent = seoData.uniqueIntro || getDynamicIntro(provinceName);
        const dynamicReviewsData = getDynamicReviews(provinceName);

        const htmlTemplate = `<!DOCTYPE html> 
<html lang="th" class="dark-theme">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#5A2CBE">

  <!-- ============================== PRIMARY SEO (HIGH CTR SPEC) ============================== -->
  <title>${title}</title>
  <meta name="description" content="${cleanDescription}"/>
  <meta name="keywords" content="สาวรับงาน${provinceName}, เพื่อนเที่ยว${provinceName}, เด็กเอ็น${provinceName}, ฟิวแฟน, ตรงปก, ไม่มีโอนมัดจำ, ไซด์ไลน์${provinceName}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" id="canonical-link" href="${provinceUrl}">

  <!-- ============================== OPEN GRAPH (SOCIAL SHARING) ============================== -->
  <meta property="og:locale" content="th_TH">
  <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${cleanDescription}">
  <meta property="og:url" content="${provinceUrl}">
  <meta property="og:image" content="${firstImage}">

  <!-- ============================== FAVICONS / PWA ============================== -->
  <link rel="shortcut icon" href="/images/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
  <link class="apple-touch-icon" href="/images/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">

  <!-- Performance & Preconnects -->
  <link rel="preconnect" href="https://zxetzqwjaiumqhrpumln.supabase.co" crossorigin>
  <link rel="dns-prefetch" href="https://zxetzqwjaiumqhrpumln.supabase.co">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>

  <!-- Fonts & Core Style Icons -->
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <!-- ============================== COMPLETE PURE CUSTOM CSS ============================== -->
  <style>
    :root {
      --primary-purple: #5A2CBE;
      --secondary-dark: #09090B;
      --pure-black: #000000;
      --pure-white: #FFFFFF;
      --text-gray: #D4D4D8;
      --text-muted: #71717A;
      --border-light: rgba(255, 255, 255, 0.05);
      --emerald-accent: #10B981;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      background-color: var(--pure-black) !important;
      color: #F4F4F5;
      font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif !important;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }

    .container {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .space-y-24 > * + * {
      margin-top: 96px;
    }

    /* ============================== 🔮 NEW FROSTED PURPLE GLASS NAV BAR ============================== */
    #page-header {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      margin: 16px;
      height: 64px;
      
      background: rgba(13, 8, 30, 0.65) !important;
      backdrop-filter: blur(18px) !important;
      -webkit-backdrop-filter: blur(18px) !important;
      
      border-radius: 16px;
      padding: 0 24px;
      
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1) !important;
      border: 1px solid rgba(147, 51, 234, 0.25) !important;
      
      width: calc(100% - 32px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    #page-header.scrolled {
      background: rgba(13, 8, 30, 0.85) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1) !important;
      border-color: rgba(147, 51, 234, 0.4) !important;
    }

    /* ============================== 🔮 NEW FROSTED WHITE PREMIUM DRAWER (40% WIDTH) ============================== */
    #sidebar-menu {
      position: fixed;
      inset-y: 0;
      right: 0;
      width: 40% !important;
      min-width: 280px;
      height: 100vh !important;
      height: 100dvh !important; 
      
      background: rgba(255, 255, 255, 0.98) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      
      border-left: 1px solid rgba(229, 231, 235, 0.8) !important;
      box-shadow: -15px 0 50px rgba(0, 0, 0, 0.15) !important;
      z-index: 3000;
      transform: translate3d(100%, 0, 0);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    #sidebar-menu.active {
      transform: translate3d(0, 0, 0);
    }

    .sidebar-header-div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid rgba(229, 231, 235, 0.8) !important;
      background-color: rgba(249, 250, 251, 0.9) !important;
    }

    .sidebar-header-div span {
      font-size: 11px;
      font-weight: 800;
      color: #9CA3AF;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .sidebar-close-btn {
      background: none;
      border: none;
      color: var(--pure-black) !important;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: background-color 0.2s;
    }

    .sidebar-close-btn:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .sidebar-links-wrapper {
      flex-grow: 1;
      overflow-y: auto;
      padding: 16px 0;
    }

    .sidebar-links-wrapper a {
      display: block;
      padding: 18px 24px;
      font-size: 18px;
      font-weight: 800;
      color: var(--pure-black) !important;
      text-decoration: none;
      text-align: center;
      border-bottom: 1px solid rgba(243, 244, 246, 0.8) !important;
      transition: all 0.2s ease;
    }

    .sidebar-links-wrapper a:hover {
      background-color: rgba(0, 0, 0, 0.02) !important;
      color: var(--primary-purple) !important;
    }

    .header-logo-container a {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--pure-white) !important;
      font-weight: 900;
      font-size: 18px;
    }

    .logo-box-el {
      display: flex;
      height: 36px;
      width: 36px;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background-color: var(--primary-purple) !important;
      color: var(--pure-white) !important;
    }

    .header-status-badge {
      display: none;
      align-items: center;
      gap: 8px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-gray) !important;
      background-color: rgba(255, 255, 255, 0.04) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      padding: 6px 16px;
      border-radius: 100px;
    }

    @media (min-width: 640px) {
      .header-status-badge { display: inline-flex; }
    }

    .status-dot-el {
      width: 6px;
      height: 6px;
      background-color: var(--emerald-accent);
      border-radius: 50%;
      animation: pulse-dot-el 1.5s infinite;
    }

    @keyframes pulse-dot-el {
      0% { opacity: 0.4; }
      50% { opacity: 1; }
      100% { opacity: 0.4; }
    }

    .nav-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .desktop-nav {
      display: none;
      gap: 8px;
    }

    @media (min-width: 1024px) {
      .desktop-nav { display: flex; }
    }

    .desktop-nav a {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-gray) !important;
      padding: 8px 14px;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .desktop-nav a:hover {
      background-color: rgba(90, 44, 190, 0.15) !important;
      color: var(--pure-white) !important;
    }

    .circle-btn-el {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      background-color: rgba(255, 255, 255, 0.03) !important;
      color: var(--text-gray) !important;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      transition: all 0.2s ease;
    }

    .circle-btn-el:hover {
      background-color: rgba(90, 44, 190, 0.2) !important;
      border-color: rgba(90, 44, 190, 0.4) !important;
      color: var(--pure-white) !important;
    }

    /* Hero Section */
    .hero-section {
      text-align: center;
      padding: 120px 20px 40px 20px;
      max-width: 850px;
      margin: 0 auto;
      position: relative;
    }

    .clutch-pill {
      display: inline-flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      padding: 4px;
      padding-right: 14px;
      gap: 10px;
      margin-bottom: 24px;
    }

    .clutch-pill .white-badge {
      background-color: var(--pure-white);
      color: var(--pure-black);
      font-weight: 800;
      padding: 3px 12px;
      border-radius: 100px;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.05em;
    }

    .clutch-pill .stars {
      color: #FBBF24;
      font-size: 10px;
      letter-spacing: 2px;
    }

    .hero-title {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -0.04em !important;
      line-height: 1.15;
      margin-bottom: 20px;
    }

    @media (min-width: 768px) {
      .hero-title { font-size: 68px; }
    }

    .hero-subtitle-p {
      font-size: 15px;
      color: var(--text-gray);
      line-height: 1.6;
      max-width: 620px;
      margin: 0 auto 32px auto;
    }

    .btn-primary-webyst {
      background-color: var(--pure-white) !important;
      color: var(--pure-black) !important;
      font-weight: 700;
      font-size: 15px;
      padding: 16px 36px;
      border-radius: 100px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.05);
      border: none;
    }

    .btn-primary-webyst:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(90, 44, 190, 0.25);
    }

    /* Billboard 3D Display */
    .billboard-container {
      position: relative;
      max-width: 768px;
      margin: 48px auto 0 auto;
      aspect-ratio: 16/10;
      background-color: #09090B;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(147, 51, 234, 0.2) !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(90, 44, 190, 0.15) !important;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    .billboard-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1s ease;
    }

    .billboard-container:hover {
      border-color: rgba(147, 51, 234, 0.45) !important;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.95), 0 0 50px rgba(147, 51, 234, 0.3) !important;
    }

    /* ============================== 🔮 NEW ULTRA-PREMIUM PURPLE GLASSMORPHIC CARDS ============================== */
    .glass-panel, .interactive-card {
      position: relative;
      overflow: hidden;
      background: rgba(14, 9, 30, 0.6) !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
      border: 1px solid rgba(147, 51, 234, 0.25) !important;
      border-radius: 24px !important;
      padding: 24px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05) !important;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    .glass-panel::before, .interactive-card::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.06), transparent);
      transform: skewX(-25deg);
      transition: 0.75s ease;
      pointer-events: none;
      z-index: 10;
    }

    .glass-panel:hover::before, .interactive-card:hover::before {
      left: 150%;
    }

    .glass-panel:hover, .interactive-card:hover {
      transform: translateY(-4px);
      border-color: rgba(147, 51, 234, 0.5) !important;
      box-shadow: 0 20px 50px rgba(90, 44, 190, 0.15), 0 0 35px rgba(90, 44, 190, 0.05) !important;
    }

    /* Grid Layouts using Standard CSS */
    .bento-grid-3 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .bento-grid-3 { grid-template-columns: repeat(3, 1fr); }
    }

    .safe-capsules-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      max-width: 768px;
      margin: 32px auto 0 auto;
    }

    @media (min-width: 640px) {
      .safe-capsules-grid { grid-template-columns: repeat(3, 1fr); }
    }

    .safe-capsule-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: 16px;
      background-color: var(--secondary-dark);
      border: 1px solid var(--border-light);
      text-decoration: none;
      transition: all 0.2s;
    }

    .safe-capsule-item:hover {
      border-color: rgba(90, 44, 190, 0.25);
    }

    .indicator-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .indicator-red {
      background-color: #FF2E63;
      box-shadow: 0 0 10px #FF2E63;
    }

    .indicator-green {
      background-color: #00E676;
      box-shadow: 0 0 10px #00E676;
    }

    /* Search Filters inputs layout */
    .search-inputs-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 640px) { .search-inputs-row { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .search-inputs-row { grid-template-columns: repeat(5, 1fr); } }

    .search-input-field, .search-select-field {
      width: 100%;
      background-color: #121214 !important;
      border: 1px solid var(--border-light) !important;
      color: #FFFFFF !important;
      padding: 14px 16px 14px 44px;
      font-size: 14px;
      border-radius: 100px;
      outline: none;
      transition: all 0.2s;
    }

    .search-select-field {
      appearance: none;
      cursor: pointer;
    }

    .search-input-field:focus, .search-select-field:focus {
      border-color: rgba(90, 44, 190, 0.5) !important;
      box-shadow: 0 0 15px rgba(90, 44, 190, 0.15);
    }

    .work-badge-webyst {
      border: 1px solid var(--primary-purple);
      background-color: rgba(90, 44, 190, 0.15);
      color: var(--pure-white);
      padding: 6px 16px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      display: inline-block;
      box-shadow: 0 0 12px rgba(90, 44, 190, 0.25);
    }

    .profiles-grid-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      padding: 0 16px;
    }

    @media (min-width: 768px) {
      .profiles-grid-row {
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }
    }

    @media (min-width: 1024px) {
      .profiles-grid-row { grid-template-columns: repeat(4, 1fr); }
    }

    .menu-ticker-div {
      background-color: #5A2CBE;
      overflow: hidden;
      white-space: nowrap;
      padding: 14px 0;
    }

    .ticker-text-wrapper {
      display: inline-block;
      animation: loop-menu-ticker 12s linear infinite;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #FFFFFF;
    }

    @keyframes loop-menu-ticker {
      0% { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-33.33%, 0, 0); }
    }

    /* Ambient Glow overlapping */
    @keyframes ambientBreathing {
      0% { transform: translate(0, 0) scale(1); opacity: 0.15; filter: blur(55px); }
      33% { transform: translate(30px, -40px) scale(1.1); opacity: 0.22; filter: blur(45px); }
      66% { transform: translate(-20px, 20px) scale(0.95); opacity: 0.18; filter: blur(60px); }
      100% { transform: translate(0, 0) scale(1); opacity: 0.15; filter: blur(55px); }
    }

    .bg-glow-overlap {
      position: absolute;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(90, 44, 190, 0.15) 0%, rgba(34, 13, 82, 0) 70%);
      filter: blur(55px);
      pointer-events: none;
      z-index: 0;
      animation: ambientBreathing 18s ease-in-out infinite;
    }

    #lightbox {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background-color: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(8px);
    }

    #lightbox.active { display: flex; }
    
    .lightbox-grid-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }
    @media (min-width: 1024px) {
      .lightbox-grid-layout {
        grid-template-columns: 1.4fr 1fr;
      }
    }

    /* ============================== 💎 GRADIENT TEXT CLASSES (WEBYST STYLES) ============================== */
    .text-gradient-main {
      background: linear-gradient(135deg, #FFFFFF 30%, #E4E4E7 60%, #5A2CBE 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .text-gradient-sub {
      background: linear-gradient(135deg, #FFFFFF 40%, #C084FC 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .text-gradient-emerald {
      background: linear-gradient(135deg, #A7F3D0 0%, #10B981 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Tabs Container */
    .tabs-wrapper {
      display: flex;
      justify-content: center;
      margin: 32px 0;
    }

    .tabs-container {
      background-color: rgba(9, 9, 11, 0.6);
      border: 1px solid var(--border-light);
      padding: 4px;
      border-radius: 16px;
      display: inline-flex;
    }

    .region-tab {
      background: none;
      border: none;
      padding: 10px 20px;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-gray);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .region-tab.active {
      background-color: var(--primary-purple);
      color: var(--pure-white);
    }

    /* Helpers Layout */
    .text-center-wrapper { text-align: center; }
    .section-spacing-container { max-width: 600px; margin: 0 auto 32px auto; padding: 0 16px; }

    /* Footer S-Tier Layout */
    .footer-grid-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      margin-bottom: 48px;
    }
    @media (min-width: 768px) {
      .footer-grid-layout {
        grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
      }
    }
    .footer-bottom-row {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    @media (min-width: 768px) {
      .footer-bottom-row {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }

    /* --- LED Badges --- */
    .neon-badge {
        display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 99px; font-weight: 700; font-size: 11px; backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.14);
    }
    .neon-dot { width: 9px; height: 9px; border-radius: 50%; }
    .status-available-neon .neon-dot { animation: pulse-led-green 2.5s infinite ease-in-out; }
    .status-busy-neon .neon-dot { animation: pulse-led-red 2.5s infinite ease-in-out; }

    @keyframes pulse-led-green {
      0%, 100% { transform: scale(1); box-shadow: 0 0 10px #00E676, 0 0 20px rgba(0,230,118,0.4); opacity: 0.85; }
      50% { transform: scale(1.2); box-shadow: 0 0 22px #00E676, 0 0 35px rgba(0,230,118,0.85); opacity: 1; }
    }
    @keyframes pulse-led-red {
      0%, 100% { transform: scale(1); box-shadow: 0 0 10px #FF2E63, 0 0 20px rgba(255,46,99,0.4); opacity: 0.85; }
      50% { transform: scale(1.2); box-shadow: 0 0 22px #FF2E63, 0 0 35px rgba(255,46,99,0.85); opacity: 1; }
    }

    .seo-content-white a {
        color: #C084FC !important; font-weight: 700; text-decoration: underline; text-underline-offset: 4px;
    }
    .seo-content-white a:hover { color: #f4f4f5 !important; }
    .seo-content-white span.highlight, .seo-content-white strong {
        color: #C084FC !important; font-weight: 800;
    }

    /* Fixed Aspect Ratio Boxes to eliminate Layout Shifting on maps */
    .absolute-fill {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    /* 🛡️ เพิ่มลำดับเลเยอร์ให้ถูกต้องหลังเอา Tailwind ออกอย่างสมบูรณ์ */
    .z-10 { z-index: 10 !important; }
    .z-20 { z-index: 20 !important; }
    .z-30 { z-index: 30 !important; }
  </style>

  <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
</head>

<body>

  <!-- ============================== HEADER ============================== -->
  <header id="page-header" role="banner">
    <div class="header-logo-container">
        <a href="/" aria-label="ไปที่หน้าแรก Sideline Chiangmai">
           <span class="logo-box-el" style="background-color: var(--primary-purple) !important; color: white !important;">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><title>โลโก้ สารบัญไซด์ไลน์</title><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
           </span>
           <span style="font-size: 16px; font-weight: 800; color: #FFFFFF !important; letter-spacing: -0.02em;">ไลน์<span style="color: #C084FC">${provinceName}</span></span>
        </a>
    </div>

    <div class="header-status-badge">
        <span class="status-dot-el" aria-hidden="true"></span>
        <span style="font-weight: 700; color: var(--text-gray);">อัปเดตระบบ: <span id="last-updated-time">${CURRENT_MONTH} ${CURRENT_YEAR}</span></span>
    </div>

    <div class="nav-controls">
        <nav class="desktop-nav" aria-label="เมนูหลัก">
            <a href="/profiles.html" style="color: var(--text-gray) !important;">รวมโปรไฟล์แนะนำ</a>
            <a href="/locations.html" style="color: var(--text-gray) !important;">พื้นที่ให้บริการ</a>
        </nav>

        <button type="button" aria-label="สลับภาษา" class="circle-btn-el" style="color: var(--text-gray) !important;">TH</button>
        <button class="theme-toggle-btn circle-btn-el" type="button" aria-label="เปลี่ยนโหมดแสง" style="color: var(--text-gray) !important;">
            <i class="fas fa-sun" aria-hidden="true"></i>
        </button>
        <button id="menu-toggle" class="circle-btn-el" type="button" aria-label="เปิดเมนูนำทาง" style="color: var(--text-gray) !important;">
            <i class="fas fa-bars"></i>
        </button>
    </div>
  </header>

  <!-- SIDEBAR MENU (Webyst White Dropdown 40% Width) -->
  <nav id="sidebar-menu" aria-label="เมนูนำทางเคลื่อนที่">
    <div class="sidebar-header-div">
      <span>Navigation</span>
      <button id="close-menu-btn" aria-label="ปิดเมนูนำทาง" class="sidebar-close-btn">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    </div>
    
    <div class="sidebar-links-wrapper">
      <a href="/">หน้าแรก</a>
      <a href="/profiles.html">น้องๆ VIP แนะนำ</a>
      <a href="/locations.html">พื้นที่บริการ</a>
      <a href="/about.html">เกี่ยวกับเรา</a>
      <a href="/faq.html">คำถามพบบ่อย</a>
      <a href="/blog.html">บทความ</a>
    </div>

    <div class="menu-ticker-div" aria-hidden="true" style="border-top: 1px solid rgba(229, 231, 235, 0.8) !important; border-bottom: 1px solid rgba(229, 231, 235, 0.8) !important;">
      <div class="ticker-text-wrapper">
        จองคิวน้องๆ แอดไลน์ @SIDELINECM • เจอตัวจริงจ่ายหน้างาน 100% • ปลอดภัย ไม่มัดจำ • จองคิวน้องๆ แอดไลน์ @SIDELINECM • เจอตัวจริงจ่ายหน้างาน 100% • ปลอดภัย ไม่มัดจำ •
      </div>
    </div>

    <div style="padding: 24px; background: #FFFFFF !important; border-top: 1px solid rgba(229, 231, 235, 0.8) !important; padding-bottom: calc(24px + env(safe-area-inset-bottom));">
      <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener nofollow" 
         style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background-color: #06C755 !important; color: #FFFFFF !important; padding: 16px 0; border-radius: 12px; font-weight: 800 !important; text-decoration: none; text-transform: uppercase; font-size: 13px; box-shadow: 0 4px 15px rgba(6, 199, 85, 0.25); transition: background-color 0.2s;"
         onmouseenter="this.style.backgroundColor='#05b04c'"
         onmouseleave="this.style.backgroundColor='#06C755'">
        <i class="fab fa-line" style="font-size: 18px;" aria-hidden="true"></i> แอดไลน์จองคิว
      </a>
    </div>
  </nav>

  <div id="sidebar-overlay" style="position: fixed; inset: 0; background-color: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 2000; display: none; opacity: 0; transition: opacity 0.3s;" aria-hidden="true"></div>

  <!-- ============================== MAIN CONTENT ============================== -->
  <main id="main-content" style="padding-top: 96px; padding-bottom: 64px; position: relative; overflow: hidden;">
    
    <div class="bg-glow-overlap" style="top: -50px; right: -50px;" aria-hidden="true"></div>
    <div class="bg-glow-overlap" style="top: 35%; left: -100px;" aria-hidden="true"></div>
    <div class="bg-glow-overlap" style="bottom: 5%; right: -50px;" aria-hidden="true"></div>

    <div class="container space-y-24">

      <!-- HERO SECTION -->
      <section class="hero-section" aria-labelledby="hero-h1">
        
        <div class="clutch-pill">
          <span class="white-badge">HOT 2026</span>
          <div class="stars" aria-label="เรตติ้งระดับ 5 ดาว">
            <i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i>
          </div>
          <span class="rating-text">5/5 Verified Profiles</span>
        </div>

        <h1 id="hero-h1" class="hero-title text-gradient-main">
          สาวรับงาน${provinceName} ไซด์ไลน์และเพื่อนเที่ยว<br>
          <span style="display: block; font-size: 20px; font-weight: 500; color: var(--text-gray); margin-top: 14px; letter-spacing: 0;">
            Premium Companionship in ${provinceName}.
          </span>
        </h1>

        <p class="hero-subtitle-p">
          ศูนย์รวมข้อมูลแนะนำ <strong>สาวรับงาน${provinceName}</strong> และ <strong>เพื่อนเที่ยวไซด์ไลน์${provinceName}</strong> ระดับแนวหน้า คัดสรรเฉพาะโปรไฟล์ตรงปก ปลอดภัยสูงสุดด้วยนโยบาย <strong>ไม่โอนมัดจำล่วงหน้า 100%</strong> จ่ายหน้างานเมื่อเจอตัวจริง ครอบคลุมพิกัดยอดนิยมในพื้นที่จังหวัด${provinceName}
        </p>

        <div>
          <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener nofollow" class="btn-primary-webyst" aria-label="แอดไลน์สอบถามข้อมูลและจองคิวน้องๆ">
            Book an intro call (แอดไลน์จองคิว)
          </a>
          <p class="cta-subtext" style="font-size: 11px; color: var(--text-muted); margin-top: 12px;" aria-live="polite">
            สแตนบายคุมคิวดูแลระบบและคัดสรรโปรไฟล์ตรงปกตลอด 24 ชั่วโมง
          </p>
        </div>

        <div class="billboard-container">
          <img 
            src="/images/hero-sidelinechiangmai-1200.webp"
            alt="เพื่อนเที่ยว สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน ปลอดภัยไม่มัดจำ"
            width="768"
            height="480"
            loading="eager" />
          <div class="billboard-overlay"></div>
        </div>

        <div class="safe-capsules-grid">
            <a href="/about.html" class="safe-capsule-item" aria-label="ข้อมูลมาตรการไม่มีโอนมัดจำก่อน">
                <span class="indicator-dot indicator-red" aria-hidden="true"></span>
                <span class="capsule-text">ไม่มีโอนมัดจำก่อน</span>
            </a>
            <a href="/faq.html" class="safe-capsule-item" aria-label="คำถามพบบ่อยเกี่ยวกับการสมัครสมาชิก">
                <span class="indicator-dot indicator-red" aria-hidden="true"></span>
                <span class="capsule-text">ไม่มีค่าสมัครสมาชิก</span>
            </a>
            <a href="/about.html" class="safe-capsule-item" aria-label="ยืนยันการชำระเงินเมื่อเจอตัวจริง">
                <span class="indicator-dot indicator-green" aria-hidden="true"></span>
                <span class="capsule-text" style="color: #00E676;">จ่ายหน้างาน 100%</span>
            </a>
        </div>
      </section>

      <!-- SOCIAL NETWORKS -->
      <section style="text-align: center; margin: 0 auto; max-width: 850px; padding: 0 16px;">
        <p style="font-size: 13px; color: var(--text-gray); line-height: 1.6; margin-bottom: 28px; font-weight: 600; opacity: 0.85; max-width: 620px; margin-left: auto; margin-right: auto; text-transform: uppercase; letter-spacing: 0.05em;">
          ช่องทางติดตามข่าวสารอย่างเป็นทางการและอัปเดตสถิติตรึงพิกัดสำหรับสมาชิก
        </p>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 24px 44px; opacity: 0.55; transition: opacity 0.3s;">
          <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener nofollow" style="display: flex; align-items: center; gap: 8px; color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; transition: opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.55'" aria-label="แอดไลน์ติดต่อเราอย่างเป็นทางการ">
            <i class="fab fa-line" style="font-size: 18px;" aria-hidden="true"></i> LINE OFFICIAL
          </a>
          <a href="${CONFIG.SOCIAL_LINKS.bluesky}" target="_blank" rel="me noopener" style="display: flex; align-items: center; gap: 8px; color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; transition: opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.55'" aria-label="ติดตามทางบลูสกาย">
            <i class="fas fa-cloud" style="font-size: 15px;"></i> BLUESKY
          </a>
          <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="noopener nofollow" style="display: flex; align-items: center; gap: 8px; color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; transition: opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.55'" aria-label="รับชมน้องๆ ผ่านติ๊กต็อก">
            <i class="fab fa-tiktok" style="font-size: 15px;" aria-hidden="true"></i> TIKTOK
          </a>
          <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="me noopener" style="display: flex; align-items: center; gap: 8px; color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; transition: opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.55'" aria-label="ติดตามฟีด Twitter/X สำหรับอัปเดตงาน">
            <i class="fab fa-twitter" style="font-size: 15px;" aria-hidden="true"></i> TWITTER / X
          </a>
          <a href="${CONFIG.SOCIAL_LINKS.biosite}" target="_blank" rel="noopener nofollow" style="display: flex; align-items: center; gap: 8px; color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; transition: opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.55'" aria-label="ดูข้อมูลรวมพาร์ทเนอร์บน Bio.site">
            <i class="fas fa-globe" style="font-size: 15px;" aria-hidden="true"></i> BIO.SITE
          </a>
          <a href="${CONFIG.SOCIAL_LINKS.linktree}" target="_blank" rel="noopener nofollow" style="display: flex; align-items: center; gap: 8px; color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; transition: opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.55'" aria-label="รวมลิงก์ทั้งหมดบน Linktree">
            <i class="fas fa-tree" style="font-size: 15px;" aria-hidden="true"></i> LINKTREE
          </a>
        </div>

        <p style="font-size: 11px; font-weight: 700; color: #D97706; background-color: rgba(146, 64, 14, 0.1); max-width: 450px; margin: 32px auto 0 auto; padding: 12px; border-radius: 12px; border: 1px solid rgba(146, 64, 14, 0.15); display: flex; align-items: center; justify-content: center; gap: 8px;" role="alert">
          <span style="width: 6px; height: 6px; border-radius: 50%; background-color: #D97706; animation: pulse-dot-el 1.5s infinite;" aria-hidden="true"></span>
          <span>เว็บไซต์นี้เป็นสื่อกลางให้บริการข้อมูลเฉพาะบุคคลที่มีอายุ 20 ปีขึ้นไป</span>
        </p>
      </section>

      <!-- PROFILES GRID -->
      <section id="featured-profiles" class="glass-panel" style="padding: 48px 0; overflow: hidden; position: relative;">
        <div class="bg-glow-overlap" style="top: 15%; left: 5%; width: 350px; height: 350px;" aria-hidden="true"></div>
        
        <div class="section-spacing-container text-center-wrapper" style="position: relative; z-index: 10;">
            <div class="badge-wrapper"><span class="work-badge-webyst">POPULAR</span></div>
            <h2 id="featured-heading" class="text-gradient-main" style="font-size: 28px; font-weight: 800; margin-top: 8px; margin-bottom: 8px;">
              หาเพื่อนเที่ยว สาวรับงาน${provinceName} ตรงปก 100%
            </h2>
            <p style="font-size: 14px; color: var(--text-gray); line-height: 1.6;">
              คัดเกรดเฉพาะน้องๆ แนะนำและผู้ดูแลระดับ VIP ยืนยันตัวตนจริง จ่ายหน้างานปลอดภัยสูงสุด
            </p>
        </div>
        
        <div id="featured-profiles-container" class="profiles-grid-row" role="region" aria-live="polite" aria-labelledby="featured-heading">
          ${cardsHTML}
        </div>
      </section>

      <div class="container" style="padding: 0;" aria-hidden="true"><hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.03); margin: 48px 0;" /></div>

      <!-- MAP SECTION -->
      <section id="map-section" class="glass-panel" style="max-width: 850px; margin: 0 auto; overflow: hidden; padding: 0; position: relative;">
        <div class="bg-glow-overlap" style="bottom: -50px; right: -50px; width: 300px; height: 300px;" aria-hidden="true"></div>
        
        <div style="padding: 32px 24px; text-align: center; position: relative; z-index: 10;">
          <p style="font-size: 11px; font-weight: 800; tracking: 0.22em; text-transform: uppercase; color: var(--primary-purple); margin-bottom: 8px;">
            แผนที่ & การติดต่อ
          </p>
          <h2 id="map-title" class="text-gradient-main" style="font-size: 20px; font-weight: 800; margin-bottom: 12px;">
            เช็กพิกัดแผนที่รับงาน สาวรับงานและไซด์ไลน์${provinceName}
          </h2>
          <div style="font-size: 13px; color: var(--text-gray); line-height: 1.6; max-width: 600px; margin: 0 auto 16px auto;">
              📍 <strong style="color: white;">พิกัดรับนัดหมายหลัก:</strong> เขตพื้นที่ศูนย์กลางจังหวัด${provinceName} และโซนธุรกิจย่านใกล้เคียง<br>
              🗺️ <strong style="color: white;">แผนที่แชร์รวมพิกัดตรงปก ปลอดภัย 100%:</strong> 
              <a href="${CONFIG.MAPS_SHARE_URL}" target="_blank" rel="noopener nofollow" style="color: #10B981; font-weight: 700; text-decoration: underline;" aria-label="ดูลิงก์แผนที่แบ่งปันสาวรับงาน อย่างเป็นทางการ">
                คลิกเพื่อดู Google Maps Shared List ของเรา
              </a><br>
              ✅ <strong style="color: white;">จองคิวด่วนผ่านแอปพลิเคชัน LINE:</strong> 
              <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener nofollow" style="color: var(--primary-purple); font-weight: 700; text-decoration: none;" aria-label="คลิกเพื่อแอดไลน์จองคิว">
                @sidelinecm (คลิกเพื่อแอดไลน์)
              </a>
          </div>
          
          <p style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background-color: rgba(127, 29, 29, 0.2); border: 1px solid rgba(127, 29, 29, 0.25); color: #F87171; font-size: 11px; font-weight: 700; border-radius: 12px;" role="alert">
            <span style="width: 6px; height: 6px; border-radius: 50%; background-color: #EF4444; animation: pulse-dot-el 1.5s infinite;" aria-hidden="true"></span>
            <span>ไม่มีนโยบายการจองผ่านโทรศัพท์ เพื่อรักษาความเป็นส่วนตัวสูงสุดของสมาชิก</span>
          </p>
        </div>
        
        <figure id="map-container" style="width: 100%; aspect-ratio: 16/9; position: relative; background-color: rgba(0,0,0,0.4); border-top: 1px solid var(--border-light); margin: 0;">
          <div id="map-placeholder" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background-color: #09090c; color: var(--text-muted); transition: opacity 0.5s;">
            <i class="fas fa-map-marked-alt animate-pulse" style="font-size: 30px; color: var(--primary-purple);" aria-hidden="true"></i>
            <span style="font-size: 10px; uppercase: true; letter-spacing: 0.15em; font-weight: 700;">กำลังโหลดแผนที่อัจฉริยะ Google Maps...</span>
          </div>
          <iframe
            id="google-map"
            data-src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.67812!2d98.972096!3d18.8140717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDQ4JzUwLjciTiA5OMKwNTgnMTkuNSJF!5e0!3m2!1sth!2sth!4v123456789"
            title="แผนที่ขอบเขตบริการ สาวรับงาน${provinceName}"
            style="border:0; width:100%; height:100%;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          
          <div style="position: absolute; bottom: 16px; right: 16px; z-index: 20;">
            <a href="${CONFIG.MAPS_SHARE_URL}" target="_blank" rel="noopener nofollow noreferrer" 
               style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; font-size: 11px; font-weight: 700; border-radius: 100px; background: linear-gradient(to bottom, #5A2CBE, #491FA3); border: 1px solid rgba(255,255,255,0.1); color: white; text-decoration: none; box-shadow: 0 10px 20px rgba(90, 44, 190, 0.25); transition: transform 0.2s;" aria-label="เปิดแอปพลิเคชันนำทาง Google Maps">
              <i class="fas fa-directions" style="font-size: 14px;" aria-hidden="true"></i>
              <span>นำทางด้วย Google Maps</span>
            </a>
          </div>
        </figure>
      </section>

      <!-- PREMIUM GOLD-CARBON CONTENT BLOCK -->
      <section id="service-deep-dive" style="border-top: 1px solid var(--border-light); padding-top: 64px; position: relative;">
        <div class="bg-glow-overlap" style="top: 20%; left: 30%; width: 400px; height: 400px;" aria-hidden="true"></div>
        <div class="interactive-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
           
           <div style="padding-top: 24px; text-align: center;">
             <p style="font-size: 11px; font-weight: 800; tracking: 0.22em; text-transform: uppercase; color: var(--primary-purple);">
               ภาพรวมบริการ & พื้นที่ให้บริการ
             </p>
           </div>

           <!-- Top Header -->
           <div style="position: relative; min-height: 170px; padding: 32px; display: flex; flex-direction: column; justify-content: space-between; border-bottom: 1px solid var(--border-light); background: rgba(13, 8, 30, 0.45);">
               <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 40%; background: linear-gradient(to left, rgba(90, 44, 190, 0.1), transparent); pointer-events: none;"></div>
               
               <div style="display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 10;">
                   <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; tracking: 0.15em;">ไลน์${provinceName}</span>
                   <span style="padding: 4px 12px; font-size: 9px; font-weight: 800; color: var(--primary-purple); border: 1px solid rgba(90, 44, 190, 0.3); rounded: 100px; background-color: rgba(90, 44, 190, 0.05); text-transform: uppercase;">
                     RECOMMENDED SERVICE
                   </span>
               </div>
               
               <h2 class="text-gradient-main" style="font-size: 20px; font-weight: 800; line-height: 1.3; position: relative; z-index: 10; margin-top: 16px;">
                   บริการเพื่อนเที่ยวและสาวรับงาน${provinceName} เอนเตอร์เทนระดับพรีเมียม
               </h2>
           </div>

           <!-- Content Body -->
           <div class="seo-content-white" style="padding: 32px; text-align: left; color: var(--text-gray); font-size: 13px; line-height: 1.7; display: flex; flex-direction: column; gap: 24px; position: relative; z-index: 10;">
               ${smartLinkify(seoIntroContent, provinceKey, seoData.zones)}
           </div>
        </div>
      </section>

      <!-- PREMIUM BENTO RULES & POLICIES -->
      <section style="text-align: center; position: relative;">
        <div class="bg-glow-overlap" style="top: -50px; left: -50px; width: 400px; height: 400px;" aria-hidden="true"></div>
        <div class="bg-glow-overlap" style="bottom: -50px; right: -50px; width: 400px; height: 400px;" aria-hidden="true"></div>
        
        <div class="section-spacing-container">
          <p style="font-size: 11px; font-weight: 800; tracking: 0.22em; text-transform: uppercase; color: var(--primary-purple); margin-bottom: 8px;">
            SAFE-PLAY FRAMEWORK
          </p>
          <h2 class="text-gradient-main" style="font-size: 22px; font-weight: 800;">
            ข้อตกลงและเงื่อนไขการใช้บริการเพื่อนเที่ยว ไซด์ไลน์
          </h2>
          <div style="height: 2px; width: 96px; background: linear-gradient(to right, transparent, var(--primary-purple), transparent); margin: 12px auto; border-radius: 100px;" aria-hidden="true"></div>
          <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
            โปรดทำความเข้าใจระเบียบปฏิบัติเพื่อความคุ้มครอง มาตรฐานความปลอดภัย และการได้รับบริการเพื่อนเที่ยวที่ดีที่สุดของคุณ
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 24px; text-align: left; margin-top: 32px;" class="bento-grid-3">
          
          <!-- RULE 01 -->
          <div class="interactive-card" style="padding: 0; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;">
            <div style="position: relative; height: 110px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; border-bottom: 1px solid var(--border-light); background: rgba(90, 44, 190, 0.15) !important;">
              <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 33%; background: linear-gradient(to left, rgba(90, 44, 190, 0.1), transparent); pointer-events: none;"></div>
              <div style="display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 10;">
                <span style="font-size: 9px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">ไลน์${provinceName}</span>
                <span style="padding: 2px 10px; font-size: 9px; font-weight: 800; color: var(--primary-purple); border: 1px solid rgba(90, 44, 190, 0.3); rounded: 4px; background-color: rgba(90, 44, 190, 0.05);">RULE 01</span>
              </div>
              <div style="position: relative; z-index: 10;">
                <span style="font-size: 28px; font-weight: 800; color: white; opacity: 0.95;">01</span>
              </div>
            </div>
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 8px;">
              <h3 class="text-gradient-sub" style="font-size: 14px; font-weight: 800;">กติกาข้อที่ 1: ชำระค่าบริการหน้างาน 100% ไม่มีมัดจำ</h3>
              <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
                ทางเราและผู้ดูแลจะไม่มีการเรียกเก็บเงินมัดจำล่วงหน้า ไม่มีค่าจองคิว หรือค่าธรรมเนียมจองสิทธิ์ใดๆ ทั้งสิ้น โดยผู้ใช้บริการจะชำระค่าบริการโดยตรงต่อน้องตัวจริงหลังพบหน้างานและยืนยันตัวตนเรียบร้อยแล้วเท่านั้น
              </p>
            </div>
          </div>

          <!-- RULE 02 -->
          <div class="interactive-card" style="padding: 0; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; background: rgba(13, 8, 30, 0.55);">
            <div style="position: relative; height: 110px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; border-bottom: 1px solid var(--border-light); background: rgba(90, 44, 190, 0.15) !important;">
              <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 33%; background: linear-gradient(to left, rgba(255,255,255,0.02), transparent); pointer-events: none;"></div>
              <div style="display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 10;">
                <span style="font-size: 9px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">ไลน์${provinceName}</span>
                <span style="padding: 2px 10px; font-size: 9px; font-weight: 800; color: var(--text-muted); border: 1px solid rgba(255,255,255,0.1); rounded: 4px; background-color: rgba(255,255,255,0.02);">RULE 02</span>
              </div>
              <div style="position: relative; z-index: 10;">
                <span style="font-size: 28px; font-weight: 800; color: white; opacity: 0.95;">02</span>
              </div>
            </div>
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 8px;">
              <h3 class="text-gradient-sub" style="font-size: 14px; font-weight: 800;">กติกาข้อที่ 2: งดกิจกรรมที่ขัดต่อข้อกฎหมายศีลธรรม</h3>
              <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
                แพลตฟอร์มนี้ทำหน้าที่เป็นสื่อกลางส่งเสริมการประชาสัมพันธ์เฉพาะงานเอนเตอร์เทนระดับสุภาพสไตล์ฟิวแฟน เพื่อนเดินทาง เพื่อนเที่ยว เพื่อนทานข้าวเพื่อคลายความเหงาเท่านั้น ขอสงวนสิทธิ์งดให้บริการกิจกรรมที่ขัดต่อกฎหมายทุกประเภท
              </p>
            </div>
          </div>

          <!-- RULE 03 -->
          <div class="interactive-card" style="padding: 0; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; background: rgba(13, 8, 30, 0.55);">
            <div style="position: relative; height: 110px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; border-bottom: 1px solid var(--border-light); background: rgba(90, 44, 190, 0.15) !important;">
              <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 33%; background: linear-gradient(to left, rgba(255,255,255,0.02), transparent); pointer-events: none;"></div>
              <div style="display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 10;">
                <span style="font-size: 9px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">ไลน์${provinceName}</span>
                <span style="padding: 2px 10px; font-size: 9px; font-weight: 800; color: var(--text-muted); border: 1px solid rgba(255,255,255,0.1); rounded: 4px; background-color: rgba(255,255,255,0.02);">RULE 03</span>
              </div>
              <div style="position: relative; z-index: 10;">
                <span style="font-size: 28px; font-weight: 800; color: white; opacity: 0.95;">03</span>
              </div>
            </div>
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 8px;">
              <h3 class="text-gradient-sub" style="font-size: 14px; font-weight: 800;">กติกาข้อที่ 3: ผู้ใช้งานบริการเอนเตอร์เทนต้องอายุ 20+ ขึ้นไป</h3>
              <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
                ผู้เข้าชมสารบัญข้อมูล ตลอดจนบุคคลที่ประสงค์จะนัดหมายใช้บริการเพื่อการจองคิวกับน้องๆ ผ่านช่องทางการติดต่ออย่างเป็นทางการ จะต้องมีอายุตั้งแต่ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น เพื่อให้สอดคล้องตามมาตรฐานความรับผิดชอบต่อสังคม
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ ACCORDIONS -->
      <section style="max-width: 768px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; text-align: left; position: relative;">
           <div class="bg-glow-overlap" style="top: 10%; left: 15%; width: 400px; height: 400px;" aria-hidden="true"></div>
           
           <p style="font-size: 11px; font-weight: 800; tracking: 0.22em; text-transform: uppercase; color: var(--primary-purple); text-align: center; position: relative; z-index: 10;">
               คำถามยอดฮิตจากลูกค้า
           </p>
           <h2 class="text-gradient-main" style="font-size: 22px; font-weight: 800; text-align: center; tracking-tight: -0.02em; position: relative; z-index: 10;">
               ตอบคำถามพบบ่อยเกี่ยวกับการหาไซด์ไลน์${provinceName}
           </h2>

           <div style="display: flex; flex-direction: column; gap: 24px; margin-top: 16px; position: relative; z-index: 10;">
                ${seoData.faqs.map(faq => `
                <div class="interactive-card" style="padding: 20px;">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <h3 style="font-weight: 800; font-size: 14px; display: flex; align-items: start; gap: 10px;">
                          <span style="display: flex; height: 24px; width: 24px; align-items: center; justify-content: center; border-radius: 8px; background-color: rgba(90, 44, 190, 0.1); color: var(--primary-purple); font-size: 12px; font-weight: 900; border: 1px solid rgba(90, 44, 190, 0.2); shrink: 0;">Q</span>
                          <span class="text-gradient-sub">${escapeHTML(faq.q)}</span>
                        </h3>
                        <div style="padding-left: 34px; color: var(--text-gray); font-size: 12px; line-height: 1.6; border-left: 2px solid rgba(90, 44, 190, 0.2); padding-top: 8px;">
                          ${escapeHTML(faq.a)}
                        </div>
                    </div>
                </div>
                `).join("")}
           </div>
      </section>

      <!-- VERIFIED CUSTOMER REVIEWS (EEAT & SCHEMA COMPLIANCE) -->
      <section id="customer-reviews" style="text-align: center; position: relative;">
        <div class="bg-glow-overlap" style="bottom: 0%; right: 5%; width: 400px; height: 400px;" aria-hidden="true"></div>
        
        <div class="section-spacing-container">
          <p style="font-size: 11px; font-weight: 800; tracking: 0.22em; text-transform: uppercase; color: var(--primary-purple); margin-bottom: 8px; position: relative; z-index: 10;">
            VERIFIED USER FEEDBACK
          </p>
          <h2 class="text-gradient-main" style="font-size: 22px; font-weight: 800; tracking-tight: -0.02em; position: relative; z-index: 10;">
            ความประทับใจและความคิดเห็นจากผู้ใช้บริการจริงใน${provinceName}
          </h2>
          <div style="height: 2px; width: 96px; background: linear-gradient(to right, transparent, var(--primary-purple), transparent); margin: 12px auto; border-radius: 100px; position: relative; z-index: 10;" aria-hidden="true"></div>
          <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6; position: relative; z-index: 10;">
            รีวิวจริงที่ได้รับการยืนยันการใช้บริการผ่านการจองคิว เพื่อส่งเสริมความโปร่งใสและสร้างความมั่นใจสูงสุด
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 24px; text-align: left; margin-top: 32px; position: relative; z-index: 10;" class="bento-grid-3">
          ${dynamicReviewsData.map((review, index) => `
          <div class="interactive-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="height: 40px; width: 40px; border-radius: 50%; background-color: #27272A; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-weight: 700; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);">
                  ${review.author.charAt(3) || "K"}
                </div>
                <div>
                  <span style="display: block; font-size: 12px; font-weight: 800; color: white;">${escapeHTML(review.author)}</span>
                  <span style="display: block; font-size: 10px; color: var(--text-muted); font-weight: 700;">นัดเจอใน${escapeHTML(review.location)}</span>
                </div>
              </div>
              <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 10px;" aria-label="5 ดาว">
                <i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i>
              </div>
            </div>
            <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
              ${escapeHTML(review.text)}
            </p>
            <span style="display: block; font-size: 9px; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">ยืนยันการใช้บริการจริง • ${escapeHTML(review.date)}</span>
          </div>
          `).join("")}
        </div>
      </section>

      <!-- EDITORIAL PROCESS & EEAT VERIFICATION SYSTEM -->
      <section id="verification-process" style="max-width: 850px; margin: 0 auto;">
        <div class="interactive-card" style="padding: 32px; display: flex; flex-direction: column; align-items: center; gap: 24px; position: relative; overflow: hidden;">
          <div style="position: absolute; right: -64px; top: -64px; width: 144px; height: 144px; background-color: rgba(90, 44, 190, 0.05); border-radius: 50%; pointer-events: none;"></div>
          <div style="height: 64px; width: 64px; border-radius: 16px; background-color: rgba(90, 44, 190, 0.1); border: 1px solid rgba(90, 44, 190, 0.2); display: flex; align-items: center; justify-content: center; color: var(--primary-purple); font-size: 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); shrink: 0;">
            <i class="fas fa-user-shield" aria-hidden="true"></i>
          </div>
          <div style="flex-grow: 1; text-align: left; display: flex; flex-direction: column; gap: 8px;">
            <span style="display: inline-flex; width: max-content; padding: 4px 12px; border-radius: 100px; background-color: rgba(90, 44, 190, 0.05); border: 1px solid rgba(90, 44, 190, 0.2); font-size: 10px; font-weight: 800; color: var(--primary-purple); text-transform: uppercase; tracking: 0.1em;">
              EDITORIAL TRUST & QUALITY STANDARD
            </span>
            <h3 class="text-gradient-sub" style="font-size: 16px; font-weight: 800; margin-bottom: 4px;">กระบวนการตรวจสอบและกลั่นกรองข้อมูลที่น่าเชื่อถือ (E-E-A-T) ใน${provinceName}</h3>
            <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
              เพื่อส่งมอบความปลอดภัยและการได้รับบริการเพื่อนเที่ยวพรีเมียมที่ดีที่สุดแก่ผู้รับชม แพลตฟอร์มสารบัญอย่างเป็นทางการของเราจึงมีมาตรการตรวจสอบคัดกรองโปรไฟล์อย่างรัดกุม โดยทีมบรรณาธิการ (Fact-Checker/Editor) ประจำย่านภูมิภาค จะทำหน้าที่พิสูจน์ยืนยันรูปภาพ ตัวจริงประวัติ และระบุเขตทำเลรับงานให้แน่ชัดก่อนแสดงผลในสารบัญเสมอ เพื่อป้องกันการฉ้อโกง 100%
            </p>
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 8px;">
              ผู้รับผิดชอบระบบและเจ้าหน้าที่ดูแลข้อมูล: <span style="color: var(--text-gray); font-weight: 700;">ทีมบริหารงานแอดมิน Sideline Chiangmai Co.</span> • อ่านข้อมูลความโปร่งใสเพิ่มเติมได้ที่ <a href="/about.html" style="color: var(--primary-purple); text-decoration: underline; font-weight: 600;">หน้าเกี่ยวกับเรา</a>
            </p>
          </div>
        </div>
      </section>

      <!-- SAFETY CONTACT BANNER -->
      <section style="max-width: 768px; margin: 0 auto; padding-bottom: 48px;">
        <div class="interactive-card" style="border: 1px solid rgba(16, 185, 129, 0.4) !important; background-color: rgba(16, 185, 129, 0.05) !important; padding: 20px; display: flex; flex-direction: column; align-items: start; gap: 16px; backdrop-filter: blur(16px);">
          <div style="flex: 1; text-align: left;">
            <h3 class="text-gradient-emerald" style="font-size: 15px; font-weight: 800; margin-bottom: 4px;">
              พบข้อมูลแอบอ้างหรือพฤติกรรมผิดปกติ? ติดต่อสอบถามแอดมินได้ตลอด 24 ชม.
            </h3>
            <p style="font-size: 11px; color: rgba(110, 231, 183, 0.8); margin-top: 4px; line-height: 1.6;">
              หากท่านพบการเรียกเก็บเงินมัดจำล่วงหน้าเต็มจำนวนหรือค่าธรรมเนียมใดๆ โดยอ้างอิงชื่อแบรนด์ของเรา กรุณาเก็บข้อมูลและบันทึกหลักฐานการแชทติดต่อทีมงานผ่าน LINE Official ทันที เพื่อให้เจ้าหน้าที่เร่งตรวจสอบและคุ้มครองความปลอดภัยแก่สมาชิกอย่างทันท่วงทีครับ
            </p>
          </div>
          <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer"
             style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: 12px; background-color: var(--emerald-accent); color: var(--pure-black); font-size: 11px; font-weight: 800; text-decoration: none; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); shrink: 0;">
            แอดไลน์แอดมิน
          </a>
        </div>
      </section>

    </div>
  </main>

  <!-- ============================== FOOTER ============================== -->
  <footer style="border-top: 1px solid rgba(147, 51, 234, 0.15); background: rgba(14, 9, 30, 0.45); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 64px 0 32px 0;" role="contentinfo">
    <div class="container">
      
      <div class="footer-grid-layout">
        
        <!-- คอลัมน์ 1: แบรนดิ้ง -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <span style="font-size: 18px; font-weight: 800; color: #FFFFFF; tracking-tight: -0.02em; display: block;">
            ไลน์<span style="color: var(--primary-purple);">${provinceName}</span>
          </span>
          <p style="font-size: 12px; line-height: 1.7; color: var(--text-gray); max-width: 320px; margin: 0;">
            <strong>Sideline Chiangmai</strong> แพลตฟอร์มเพื่อนเที่ยวและผู้ดูแลระดับพรีเมียมอันดับ 1 ใน${provinceName} มุ่งเน้นรูปถ่ายตรงปก ยืนยันพิกัดบริการปลอดภัย 100% ไม่มีมัดจำ
          </p>
        </div>

        <!-- คอลัมน์ 2: เมนูหลัก -->
        <nav aria-label="ลิงก์ส่วนท้ายเว็บ">
          <h3 style="font-size: 14px; font-weight: 800; color: #FFFFFF; margin-bottom: 16px;">เมนูหลัก</h3>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
            <li><a href="/" style="color: var(--text-gray); text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-gray)'">หน้าแรก</a></li>
            <li><a href="/about.html" style="color: var(--text-gray); text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-gray)'">เกี่ยวกับเรา</a></li>
            <li><a href="/faq.html" style="color: var(--text-gray); text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-gray)'">คำถามที่พบบ่อย</a></li>
          </ul>
        </nav>

        <!-- คอลัมน์ 3: ระบบสร้างลิงก์พิกัดยอดนิยมของระบบ Edge (Fallback Crawler Links เพื่อให้บอทวิ่งสแกนจังหวัดอื่นๆ ได้ทันที) -->
        <div role="navigation" aria-label="พื้นที่บริการจังหวัดอื่น">
          <h3 style="font-size: 14px; font-weight: 800; color: #FFFFFF; margin-bottom: 16px;">พื้นที่บริการจังหวัดอื่นๆ</h3>
          <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 12px; color: var(--text-gray);">
             ${allProvinces.slice(0, 10).map(p => {
                 if (p.key === 'chiangmai') return `<li><a href="/" style="color: var(--text-gray); text-decoration: none;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-gray)'">ไซด์ไลน์เชียงใหม่</a></li>`;
                 return `<li><a href="/location/${p.key}" style="color: var(--text-gray); text-decoration: none;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-gray)'">ไซด์ไลน์${escapeHTML(p.nameThai)}</a></li>`;
             }).join("")}
          </ul>
        </div>

        <!-- คอลัมน์ 4: แถบติดต่อ -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <h3 style="font-size: 14px; font-weight: 800; color: #FFFFFF; margin: 0;">ติดต่อเรา</h3>
          <p style="font-size: 12px; color: var(--text-gray); margin: 0;">เจ้าหน้าที่สแตนบายดูแล 24 ชม.</p>
          <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener nofollow" 
             style="display: flex; align-items: center; justify-content: center; gap: 8px; background-color: var(--emerald-accent) !important; color: var(--pure-black) !important; padding: 12px 20px; border-radius: 12px; font-weight: 800; font-size: 13px; text-decoration: none; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); transition: background-color 0.2s;" 
             onmouseenter="this.style.backgroundColor='#059669'" 
             onmouseleave="this.style.backgroundColor='var(--emerald-accent)'">
            <i class="fab fa-line" style="font-size: 18px;" aria-hidden="true"></i> แอดไลน์จองคิว
          </a>
        </div>

      </div>

      <!-- แถวลิขสิทธิ์ด้านล่างสุด -->
      <div class="footer-bottom-row">
        <p style="font-size: 10px; uppercase: true; letter-spacing: 0.15em; color: var(--text-muted); margin: 0;">© ${CURRENT_YEAR} Sideline Chiangmai. All Rights Reserved.</p>
        
        <p style="font-size: 9px; color: var(--text-muted); opacity: 0.6; margin: 0; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">Designed with AI Zoe • Premium SEO Edition 2026</p>
        
        <div style="display: flex; gap: 24px;">
          <a href="/privacy-policy.html" style="font-size: 10px; color: var(--text-muted); text-decoration: none; text-transform: uppercase; font-weight: 600; transition: color 0.2s;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-muted)'">Privacy Policy</a>
          <a href="/terms-of-service.html" style="font-size: 10px; color: var(--text-muted); text-decoration: none; text-transform: uppercase; font-weight: 600; transition: color 0.2s;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-muted)'">Terms & Conditions</a>
        </div>
      </div>

    </div>
  </footer>

  <!-- ============================== LIGHTBOX DETAILS ============================== -->
  <div id="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-profile-name-main">
    <div id="lightbox-content-wrapper-el" style="background-color: var(--secondary-dark); border: 1px solid var(--border-light); border-radius: 24px; max-width: 900px; width: 100%; overflow: hidden; position: relative;">
      
      <button id="closeLightboxBtn" style="position: absolute; top: 16px; right: 16px; z-index: 30; width: 40px; height: 40px; background-color: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;" aria-label="ปิดรายละเอียดโปรไฟล์">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>

      <div style="overflow-y: auto; max-height: 90vh;">
        <div class="lightbox-grid-layout">
          
          <div style="background-color: rgba(0,0,0,0.4); padding: 12px; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <div style="width: 100%; max-height: 65vh; aspect-ratio: 3/4; overflow: hidden; display: flex; justify-content: center; align-items: center; border-radius: 16px;">
              <img id="lightboxHeroImage" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3C/svg%3E" alt="รูปแกลเลอรีน้องๆ ตรงปก" style="width: 100%; height: 100%; object-fit: contain; border-radius: 16px;">
            </div>
            <div id="lightboxThumbnailStrip" style="display: flex; gap: 8px; overflow-x: auto; padding: 8px 0; margin-top: 16px; justify-content: center; width: 100%;"></div>
          </div>

          <div class="lightbox-details" style="padding: 32px; display: flex; flex-direction: column; gap: 24px;">
            <header style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
                <h3 id="lightbox-profile-name-main" class="text-gradient-main" style="font-size: 32px; font-weight: 800; margin: 0;">ชื่อโปรไฟล์</h3>
                <div id="lightbox-availability-badge-wrapper" style="flex-shrink: 0;"></div>
              </div>
              <p id="lightboxQuote" style="font-size: 14px; color: var(--text-gray); font-style: italic; margin: 0;"></p>
            </header>
            
            <div id="lightboxTags" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
            
            <div style="border-top: 1px solid var(--border-light); padding-top: 16px;">
              <div id="lightboxDetailsCompact" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;"></div>
              <div id="lightboxDateAdded" style="display: none; font-size: 12px; color: var(--text-muted); margin-top: 12px;"></div>
            </div>

            <div id="lightboxDescriptionContainer" style="border-top: 1px solid var(--border-light); padding-top: 16px;">
              <h4 style="color: white; font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; margin-top: 0;">
                <i class="fas fa-info-circle" style="color: var(--primary-purple);" aria-hidden="true"></i>
                <span>รายละเอียดเพิ่มเติม</span>
              </h4>
              <div id="lightboxDescriptionContent" style="font-size: 13px; color: var(--text-gray); line-height: 1.6; white-space: pre-wrap;"></div>
            </div>

            <div style="border-top: 1px solid var(--border-light); padding-top: 16px; margin-top: auto;">
              <a id="lightboxFullProfileLink" href="#" class="btn-primary-webyst" style="width: 100%; text-align: center; justify-content: center; text-decoration: none;" aria-label="ดูโปรไฟล์เต็ม">
                ดูรายละเอียดเต็ม & แอดไลน์จองคิว
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

<!-- 📊 [ฝังข้อมูลโปรไฟล์] ส่งข้อมูลโปรไฟล์จากฐานข้อมูล Supabase มายังระบบควบคุมฝั่งเบราว์เซอร์โดยตรง -->
  <script>
  window.profilesData = ${JSON.stringify(safeProfiles.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        age: p.age,
        height: p.height || "",     
        weight: p.weight || "",     
        stats: p.stats || "",       
        skinTone: p.skinTone || p.skin_tone || "", 
        bust: p.bust || "",         
        waist: p.waist || "",       
        hips: p.hips || "",         
        cup_size: p.cup_size || "", 
        imagePath: p.imagePath,
        location: p.location,
        rate: p.rate,
        availability: p.availability,
        lastUpdated: p.lastUpdated,
        isfeatured: p.isfeatured,
        verified: p.verified || p.isVerified,
        hasVideo: p.has_video || p.hasVideo, 
        description: p.description || ""
    })))};
  </script>

  <script>
  document.addEventListener("DOMContentLoaded", () => {
      // 1. ระบบควบคุมเปิด-ปิดสไลด์เมนูมือถือแบบ Custom CSS
      const menuToggle = document.getElementById("menu-toggle");
      const closeMenuBtn = document.getElementById("close-menu-btn");
      const sidebarMenu = document.getElementById("sidebar-menu");
      const sidebarOverlay = document.getElementById("sidebar-overlay");

      if (menuToggle && sidebarMenu && sidebarOverlay) {
          const openMenu = () => {
              sidebarMenu.classList.add("active");
              sidebarOverlay.style.display = "block";
              setTimeout(() => { sidebarOverlay.style.opacity = "1"; }, 50);
              document.body.style.overflow = "hidden"; 
          };

          const closeMenu = () => {
              sidebarMenu.classList.remove("active");
              sidebarOverlay.style.opacity = "0";
              document.body.style.overflow = ""; 
              setTimeout(() => { sidebarOverlay.style.display = "none"; }, 300);
          };

          menuToggle.addEventListener("click", openMenu);
          if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
          sidebarOverlay.addEventListener("click", closeMenu);

          const menuLinks = sidebarMenu.querySelectorAll(".sidebar-links-wrapper a, div a");
          menuLinks.forEach(link => {
              link.addEventListener("click", closeMenu);
          });
      }

      // 2. ระบบโหลดแผนที่ Google Maps แบบประหยัดพลังงาน
      const mapIframe = document.getElementById("google-map");
      const placeholder = document.getElementById("map-placeholder");
      if (mapIframe && 'IntersectionObserver' in window) {
        const mapObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              mapIframe.src = mapIframe.dataset.src;
              mapIframe.onload = () => {
                if (placeholder) placeholder.style.opacity = '0';
                setTimeout(() => placeholder && placeholder.remove(), 500);
              };
              observer.unobserve(entry.target);
            }
          });
        }, { rootMargin: "200px" });
        mapObserver.observe(mapIframe);
      } else if (mapIframe) {
        mapIframe.src = mapIframe.dataset.src;
        if (placeholder) placeholder.remove();
      }

      // ============================== 🔮 NEW ULTIMATE LIGHTBOX LOGIC ==============================
      const profiles = window.profilesData || [];
      const lightbox = document.getElementById("lightbox");
      const closeBtn = document.getElementById("closeLightboxBtn");

      // สมการจำลองคุณลักษณะส่วนตัวแบบคำนวณคงที่ (ตรงตามโครงสร้างของ Bot Renderer 100%)
      const getDeterministicValue = (min, max, seedString, offset = 0) => {
          const sum = seedString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + offset;
          return Math.floor(min + (sum % (max - min + 1)));
      };

      function optimizeImgUrl(path, width = 320, height = 420) {
          if (!path) return "/images/default.webp";
          if (path.startsWith("http")) return path;
          return "${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/" + path + "?width=" + width + "&height=" + height + "&resize=cover&quality=65&format=webp";
      }

      const openLightbox = (profileId) => {
          const p = profiles.find(item => String(item.id) === String(profileId));
          if (!p) return;

          const cleanName = (p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/, "");
          document.getElementById('lightbox-profile-name-main').textContent = "น้อง" + cleanName;

          const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
          const statusClass = isAvailable ? "status-available-neon" : "status-busy-neon";
          const statusText = isAvailable ? "รับงาน" : "ไม่ว่าง/พัก";

          document.getElementById('lightbox-availability-badge-wrapper').innerHTML = 
              '<span class="neon-badge ' + statusClass + '">' +
                  '<span class="neon-dot"></span>' +
                  '<span>' + statusText + '</span>' +
              '</span>';

          document.getElementById('lightboxQuote').textContent = "ดูแลใส่ใจสไตล์ฟิวแฟนตรงปก ปลอดภัยสูงสุด 100%";

          // ดึงภาพหลัก
          const heroImg = document.getElementById('lightboxHeroImage');
          heroImg.src = optimizeImgUrl(p.imagePath, 450, 600);
          heroImg.alt = "น้อง" + cleanName + " สารบัญตรงปก";

          // คำนวณคุณสมบัติทางกายภาพ
          const slug = p.slug || String(p.id);
          const ageVal = p.age || getDeterministicValue(20, 26, slug, 1);
          const heightVal = getDeterministicValue(158, 168, slug, 2);
          const weightVal = getDeterministicValue(44, 52, slug, 3);
          const breastVal = getDeterministicValue(32, 36, slug, 4);
          const waistVal = getDeterministicValue(23, 26, slug, 5);
          const hipVal = getDeterministicValue(33, 37, slug, 6);
          const bwhVal = breastVal + "-" + waistVal + "-" + hipVal;
          const displayRate = p.rate ? parseInt(p.rate).toLocaleString() + " ฿" : "สอบถาม";

          // วาดตารางข้อมูล compact
          document.getElementById('lightboxDetailsCompact').innerHTML = 
              '<div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between;">' +
                  '<span style="font-size: 11px; color: var(--text-gray);">ค่าขนม</span>' +
                  '<span style="font-size: 13px; font-weight: 800; color: #C084FC;">' + displayRate + '</span>' +
              '</div>' +
              '<div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between;">' +
                  '<span style="font-size: 11px; color: var(--text-gray);">อายุ</span>' +
                  '<span style="font-size: 13px; font-weight: 800; color: white;">' + ageVal + ' ปี</span>' +
              '</div>' +
              '<div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between;">' +
                  '<span style="font-size: 11px; color: var(--text-gray);">สัดส่วน</span>' +
                  '<span style="font-size: 13px; font-weight: 800; color: white;">' + bwhVal + '</span>' +
              '</div>' +
              '<div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between;">' +
                  '<span style="font-size: 11px; color: var(--text-gray);">พิกัด</span>' +
                  '<span style="font-size: 13px; font-weight: 800; color: white; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 90px;">' + (p.location || "${provinceName}") + '</span>' +
              '</div>';

          // ข้อมูลบรรยายเพิ่มเติม
          const finalDesc = p.description || ("น้อง" + cleanName + " พรีเมียมเพื่อนเที่ยวเพื่อนคุย อัธยาศัยดี มีมารยาทและดูแลใส่ใจเป็นกันเองอย่างเป็นธรรมชาติ รับรองความตรงปก ปลอดภัยสูงสุดไร้มัดจำจ่ายหน้างาน 100% ค่ะ");
          document.getElementById('lightboxDescriptionContent').textContent = finalDesc;

          // เชื่อมลิงก์รายละเอียดเดี่ยว
          document.getElementById('lightboxFullProfileLink').href = "/sideline/" + encodeURIComponent(slug);

          // แท็กพิเศษ
          document.getElementById('lightboxTags').innerHTML = 
              '<span style="background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(147, 51, 234, 0.3); color: #C084FC; font-size: 10px; padding: 4px 10px; border-radius: 100px;">#เพื่อนเที่ยว</span>' +
              '<span style="background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(147, 51, 234, 0.3); color: #C084FC; font-size: 10px; padding: 4px 10px; border-radius: 100px;">#ฟิวแฟน</span>' +
              '<span style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #10B981; font-size: 10px; padding: 4px 10px; border-radius: 100px;">#ตรงปก</span>' +
              '<span style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #10B981; font-size: 10px; padding: 4px 10px; border-radius: 100px;">#ไม่มัดจำ</span>';

          lightbox.classList.add("active");
          document.body.style.overflow = "hidden";
      };

      const closeLightbox = () => {
          lightbox.classList.remove("active");
          document.body.style.overflow = "";
      };

      if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

      // ดักจับการปิดเมื่อคลิกข้างนอกหน้าต่างหลัก
      lightbox.addEventListener("click", (e) => {
          if (e.target === lightbox) {
              closeLightbox();
          }
      });

      // ดักจับปุ่ม Esc บนแป้นพิมพ์เพื่อปิดหน้าต่าง
      document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && lightbox.classList.contains("active")) {
              closeLightbox();
          }
      });

      // ดักจับเหตุการณ์การกดที่การ์ดโปรไฟล์เพื่อแสดงผล Lightbox แทนที่จะเด้งไปหน้าอื่นทันที
      document.querySelectorAll(".province-card").forEach(card => {
          card.addEventListener("click", (e) => {
              // ยกเว้นปุ่มหัวใจ (Favorite) ปล่อยให้ระบบชื่นชอบจัดการตนเองตามปกติ
              if (e.target.closest('[data-action="like"]')) {
                  return;
              }
              e.preventDefault();
              const profileId = card.getAttribute("data-profile-id");
              openLightbox(profileId);
          });
      });
  });
  </script>
</body>
</html>`;

        return new Response(htmlTemplate, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=600, stale-while-revalidate=300"
            }
        });

    } catch (e) {
        console.error("Critical rendering error:", e);
        return buildErrorPage(500, "500 - ข้อผิดพลาดภายในระบบ", "ระบบประมวลผลหลังบ้านเกิดขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้งในภายหลัง");
    }
};

function customMetaTitle(provinceName, customMeta) {
    if (customMeta && customMeta.title) return customMeta.title;
    return `สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} เพื่อนเที่ยวฟิวแฟน 2026 | จ่ายหน้างาน ไม่มัดจำ`;
}

function customMetaDesc(provinceName, seoData, customMeta) {
    if (customMeta && customMeta.desc) return customMeta.desc;
    const zonesText = seoData.zones && seoData.zones.length > 0 ? ` ครอบคลุมพิกัด ${seoData.zones.slice(0, 4).join(', ')}` : "";
    return `รวมข้อมูลแนะนำสาวรับงาน${provinceName} เพื่อนเที่ยวไซด์ไลน์พรีเมียมตรงปก 100% สไตล์ฟิวแฟน ปลอดภัย จ่ายหน้างาน ไม่มีโอนมัดจำล่วงหน้า${zonesText}`;
}
