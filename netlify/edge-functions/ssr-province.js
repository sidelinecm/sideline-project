/**
 * [ SYSTEM CORE - NEXUS ENTITY FRAMEWORK (S-TIER) ]
 * Mastermind: wawai | Nexus Mastermind
 * Authority: Search Engine Dominance, S-Tier Spacing, Typography & Complete Social Integration
 * Fixes Applied: Resolved Identifier Redeclaration SyntaxError, Dynamic Placeholders Replacement
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

const PROVINCE_CUSTOM_METADATA = {
    "bangkok": {
        title: "สาวรับงานกรุงเทพ ไซด์ไลน์ กทม เพื่อนเที่ยวฟิวแฟนตรงปก 2026 | จ่ายหน้างาน ไม่มัดจำ",
        desc: "รวมพิกัดสาวรับงานกรุงเทพ ไซด์ไลน์ กทม และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มีเก็บมัดจำล่วงหน้า ครอบคลุมพิกัดสุขุมวิท รัชดา ลาดพร้าว"
    },
    "chonburi": {
        title: "สาวรับงานชลบุรี ไซด์ไลน์พัทยา บางแสน เพื่อนเที่ยวฟิวแฟน 2026 | จ่ายหน้างาน ไม่มัดจำ",
        desc: "สารบัญสาวรับงานชลบุรี เพื่อนเที่ยวพัทยา และน้องๆ ไซด์ไลน์บางแสน พรีเมียมดูแลใส่ใจสไตล์ฟิวแฟน ปลอดภัยสูงสุดชำระค่าบริการหน้างานเมื่อเจอตัวจริง ปราศจากการโอนจองล่วงหน้า"
    }
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
            { q: "นัดหมายน้องๆ ขอนแก่น แถว มข. มีความปลอดภัยแค่ไหน?", a: "โซน มข. และกังสดาล เป็นแหล่งชุมชนเมืองที่มีความปลอดภัยสูง มีที่พักและคอนโดมิเนียมจำนวนมาก รองรับการนัดเจอที่สะดวกรวดเร็วและรักษาความลับสูงสุด" }
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
    chiangmai: {
        name: "เชียงใหม่",
        geo: { lat: 18.8140717, lng: 98.972096 },
        zones: ["นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก"],
        faqs: [
            { q: "จองคิวเพื่อนเที่ยวหรือน้องไซด์ไลน์ในตัวเมืองเชียงใหม่ โซนไหนสะดวกและเป็นส่วนตัวที่สุด?", a: "พื้นที่ถนนนิมมานเหมินท์, สันติธรรม ช้างเผือก และรอบหอพักหรือคอนโดมิเนียมย่านเจ็ดยอด เป็นพิกัดที่ผู้ดูแลส่วนใหญ่พำนักอยู่จริง สมาชิกจึงสามารถส่งขอนัดหมาย ลิสต์ร้านอาหาร หรือชวนน้องๆ นัดเจอเพื่อเริ่มต้นเดินทางร่วมกันได้อย่างรวดเร็วและเป็นส่วนตัวสูง" },
            { q: "ระบบรับประกันความปลอดภัยและการชำระค่าบริการมีความโปร่งใสอย่างไร?", a: "ทางแพลตฟอร์มใช้นโยบาย “เจอตัวจริงค่อยชำระเงินโดยตรงหน้างาน” ซึ่งเป็นมาตรการป้องกันความเสียหายทางการเงินและคุ้มครองผู้ใช้งานจากการแอบอ้างโดยมิจฉาชีพได้ 100% พร้อมทั้งมีนโยบายเก็บรักษาข้อมูลความประสงค์ส่วนตัวนัดหมายของท่านไว้ภายใต้โครงสร้างที่เป็นความลับสูงสุด" },
            { q: "กระบวนการยืนยันประวัติ (Live Verified) ป้องกันการนำรูปคนอื่นมาสวมรอยอย่างไร?", a: "ผู้ลงประกาศโปรไฟล์และผู้ให้บริการเอนเตอร์เทนทุกคน จะต้องส่งวิดีโอยืนยันตนแบบเรียลไทม์ พร้อมแสดงหลักฐานสัดส่วนพิกัดรับงานตรงต่อแอดมิน เพื่อตรวจสอบความสอดคล้องของรูปโปรไฟล์อย่างรอบคอบ เพื่อความสบายใจสูงสุดของลูกค้าสมาชิกทุกท่าน" }
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

const getDynamicIntro = (provinceName) => {
    return `
        <p>ยินดีต้อนรับสู่แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ <strong>สาวรับงาน${provinceName}</strong> และ <strong>เพื่อนเที่ยวไซด์ไลน์${provinceName}</strong> แหล่งรวบรวมโปรไฟล์ที่เน้นความโปร่งใส ปลอดภัย และเพียบพร้อมด้วยการดูแลเอาใจใส่สไตล์ฟิวแฟน (Girlfriend Experience - GFE) อย่างสุภาพเรียบร้อยเป็นธรรมชาติ โดยปราศจากเงื่อนไขการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้น</p>
        <p>เพื่อตอบสนองความสะดวกในการนัดหมายพิกัดบริการ in ${provinceName} ได้ถูกคัดเลือกและจัดสรรพิกัดที่เหมาะสม ไม่ว่าจะเป็นโซนใจกลางเมือง โรงแรมที่เดินทางสะดวกสบาย หรือคอนโดมิเนียมส่วนตัว พร้อมร่วมเดินทางท่องเที่ยว ทานอาหาร หรือพูดคุยเพื่อสร้างความผ่อนคลายและคลายเหงาให้แก่คุณในโอกาสพิเศษ</p>
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

const replaceGlobal = (str, find, replace) => {
    return str.split(find).join(replace);
};

function verifyHostname(request) {
    const host = request.headers.get("host") || "";
    const allowed = [
        "sidelinechiangmai.netlify.app",
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
        body { background: #000000; color: #fff; font-family: 'Prompt', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin:0; padding: 16px; overflow:hidden;}
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

// 🛡️ ปรับปรุงความถูกต้องโครงสร้างฟังก์ชัน: ประกาศฟังก์ชันไว้ส่วนบนสุดของสคริปต์เพียงรอบเดียวเท่านั้นเพื่อป้องกัน SyntaxError ตัวแปรชนกันตอนตรวจเช็กในเซิร์ฟเวอร์
function customMetaTitle(provinceName, customMeta) {
    if (customMeta && customMeta.title) return customMeta.title;
    return `ไซด์ไลน์${provinceName} เพื่อนเที่ยวตรงปก 2026 | สาวรับงาน${provinceName} ไม่มัดจำ`;
}

function customMetaDesc(provinceName, seoData, customMeta) {
    if (customMeta && customMeta.desc) return customMeta.desc;
    const zonesText = seoData.zones && seoData.zones.length > 0 ? ` ครอบคลุมพิกัด ${seoData.zones.slice(0, 4).join(', ')}` : "";
    return `รวมไซด์ไลน์${provinceName} สาวรับงาน${provinceName} เพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟนตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มีโอนมัดจำล่วงหน้า${zonesText}`;
}

const generateSSRCardHTML = (p, provinceName, domain) => {
    const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/, ""));
    const profileLocation = escapeHTML(p.location || provinceName);
    const profileLink = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
    const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
    const statusClass = isAvailable ? "status-available-neon" : "status-busy-neon";
    const statusText = isAvailable ? "รับงาน" : "ไม่ว่าง/พัก";
    const displayRate = p.rate ? `${parseInt(p.rate).toLocaleString()} ฿` : "สอบถาม";
    const imageSource = optimizeImg(domain, p.imagePath, 300, 400);

    return `
    <div class="profile-card-new-container">
      <div class="profile-card-new interactive-card" 
           data-profile-id="${p.id}"
           data-profile-slug="${p.slug}"
           style="aspect-ratio: 3/4; width: 100%; position: relative; border-radius: 20px; overflow: hidden; background-color: #09090B; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.4); cursor: pointer;">
          
          <img src="${imageSource}" 
               alt="น้อง${cleanName} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" 
               width="300"
               height="400"
               style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85); transition: opacity 0.7s; opacity: 1; z-index: 0; border-radius: 20px;" />
               
          <div style="position: absolute; top: 12px; left: 12px; z-index: 30; pointer-events: none;">
              <span class="neon-badge ${isAvailable ? 'status-available-neon' : 'status-busy-neon'}" style="background-color: rgba(0,0,0,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 100px; color: white; display: flex; align-items: center; gap: 6px;">
                  <span class="neon-dot" style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${isAvailable ? '#00E676' : '#FF2E63'}; box-shadow: 0 0 6px ${isAvailable ? '#00E676' : '#FF2E63'};"></span>
                  <span>${p.availability || 'สอบถาม'}</span>
              </span>
          </div>

          ${p.isfeatured ? `
          <div style="position: absolute; top: 40px; left: 12px; z-index: 30; pointer-events: none;">
              <span style="background-color: #5A2CBE; color: white; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 100px; box-shadow: 0 4px 10px rgba(90, 44, 190, 0.3); display: flex; align-items: center; gap: 4px;"><i class="fas fa-star" style="font-size: 8px;"></i>แนะนำ</span>
          </div>
          ` : ''}

          <div style="position: absolute; top: 12px; right: 12px; z-index: 30; pointer-events: auto;">
              <button type="button" class="profile-card-like-btn" data-action="like" data-id="${p.id}" aria-label="เพิ่มลงในรายการโปรด">
                  <i class="fa-solid fa-heart"></i>
              </button>
          </div>
          
          <a href="${profileLink}" class="card-link" style="position: absolute; inset: 0; z-index: 25;" aria-label="ดูโปรไฟล์น้อง${cleanName}"></a>

          <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.4) 45%, transparent 80%); z-index: 10; pointer-events: none; border-radius: 20px;"></div>

          <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 14px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%;">
                  <h3 id="profile-name-${p.id}" style="font-size: 14px; font-weight: 800; color: white; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 4px rgba(0,0,0,0.8); flex: 1; min-width: 0;">น้อง${cleanName}</h3>
                  <span style="color: #C084FC; font-weight: 900; font-size: 14px; text-shadow: 0 2px 4px rgba(0,0,0,0.9); flex-shrink: 0; white-space: nowrap;">${p.rate || 'สอบถาม'}</span>
              </div>
              
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #D4D4D8; gap: 8px; width: 100%;">
                  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.8); flex: 1; min-width: 0;">
                      <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 4px;"></i> ${profileLocation}
                  </span>
              </div>
          </div>
      </div>
    </div>`;
};

const generateDynamicFAQsHTML = (faqs) => {
    return faqs.map(faq => `
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
    `).join("");
};

const generateDynamicReviewsHTML = (provinceName, zones) => {
    const zone1 = zones && zones.length > 0 ? zones[0] : "ตัวเมือง";
    const zone2 = zones && zones.length > 1 ? zones[1] : "ย่านดัง";
    const zone3 = zones && zones.length > 2 ? zones[2] : "แหล่งท่องเที่ยว";

    return `
    <div class="interactive-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="height: 40px; width: 40px; border-radius: 50%; background-color: #27272A; display: flex; align-items: center; justify-content: center; color: #94A3B8; font-weight: 700; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);">K</div>
            <div>
              <span style="display: block; font-size: 12px; font-weight: 800; color: white;">คุณเกริกพล (K.)</span>
              <span style="display: block; font-size: 10px; color: #94A3B8; font-weight: 700;">นัดเจอย่าน ${zone1}</span>
            </div>
          </div>
          <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 10px;" aria-label="5 ดาว" role="img">
            <i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
          "น้องตรงปกมากครับ นัดเจอกันที่ร้านกาแฟย่าน${zone1} คุยเก่ง อัธยาศัยดี มีความเป็นสุภาพสตรี ไม่มีมัดจำล่วงหน้าทำให้รู้สึกปลอดภัยและสบายใจมาก แนะนำเลยครับสำหรับคนที่ต้องการเพื่อนร่วมเดินทาง"
        </p>
        <span style="display: block; font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">ยืนยันการใช้บริการจริง • 2 วันที่ผ่านมา</span>
    </div>

    <div class="interactive-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="height: 40px; width: 40px; border-radius: 50%; background-color: #27272A; display: flex; align-items: center; justify-content: center; color: #94A3B8; font-weight: 700; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);">T</div>
            <div>
              <span style="display: block; font-size: 12px; font-weight: 800; color: white;">คุณธนพัทธ์ (T.)</span>
              <span style="display: block; font-size: 10px; color: #94A3B8; font-weight: 700;">นัดเจอย่าน ${zone2}</span>
            </div>
          </div>
          <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 10px;" aria-label="5 ดาว" role="img">
            <i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
          "ชอบระบบความปลอดภัยของที่นี่มากครับ มีแอดมินคอยเช็กพิกัด คุมคิวให้ตลอด ไม่ต้องโอนจองก่อน เจอตัวแล้วค่อยจ่ายจริง น้องดูแลใส่ใจดีมากเหมือนแฟนเลยครับ คลายเหงาได้ดีเยี่ยม"
        </p>
        <span style="display: block; font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">ยืนยันการใช้บริการจริง • 1 สัปดาห์ที่ผ่านมา</span>
    </div>

    <div class="interactive-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="height: 40px; width: 40px; border-radius: 50%; background-color: #27272A; display: flex; align-items: center; justify-content: center; color: #94A3B8; font-weight: 700; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);">M</div>
            <div>
              <span style="display: block; font-size: 12px; font-weight: 800; color: white;">คุณมงคล (M.)</span>
              <span style="display: block; font-size: 10px; color: #94A3B8; font-weight: 700;">นัดเจอย่าน ${zone3}</span>
            </div>
          </div>
          <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 10px;" aria-label="5 ดาว" role="img">
            <i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
          "น้องพูดจาสุภาพ น่ารัก ตัวจริงเหมือนในรูปโปรไฟล์เลยครับ ร่วมรับประทานอาหารเย็นด้วยกันอย่างเป็นกันเอง ระบบ Verified ของเว็บนี้ช่วยสกรีนได้ดีจริงๆ ไม่มีเสียความรู้สึกแน่นอนครับ"
        </p>
        <span style="display: block; font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">ยืนยันการใช้บริการจริง • 2 วันที่ผ่านมา</span>
    </div>`;
};

const generatePersonSchema = (p, provinceName, profileUrl, domain) => {
    const priceNumeric = (p.rate || "0").toString().replace(/\D/g, '');
    const cleanName = (p.name || '').replace(/^น้อง/, '').trim();
    const imageUrl = optimizeImg(domain, p.imagePath, 1200, 630);

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": profileUrl,
        "name": `น้อง${cleanName}`,
        "url": profileUrl,
        "image": imageUrl,
        "description": p.description || `โปรไฟล์แนะนำน้อง${cleanName} สาวรับงานพิกัด ${p.location || provinceName} ตรงปก`,
        "jobTitle": "Freelance Model",
        "gender": "Female",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": provinceName,
            "addressRegion": provinceName,
            "addressCountry": "TH"
        },
        "offers": {
            "@type": "Offer",
            "url": profileUrl,
            "price": priceNumeric,
            "priceCurrency": "THB",
            "availability": p.availability?.includes('ไม่ว่าง') ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            "description": "ชำระเงินหน้างานเท่านั้น ไม่มีมัดจำ"
        }
    };
};

export default async (request, context) => {
    if (!verifyHostname(request)) {
        return new Response("403 Forbidden - Access Denied", { status: 403 });
    }

    const url = new URL(request.url);
    const dynamicDomain = `${url.protocol}//${url.host}`;

    // Static bypass interceptor
    const staticExtensions = [".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".json", ".webmanifest", ".map", ".woff", ".woff2"];
    if (staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
        try { return await context.next(); } catch { return; }
    }

    // [CRITICAL SEO SYSTEM PROTECT] ป้องกันพิกัดเชียงใหม่ซ้ำซ้อนหน้าหลัก
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

        // 🛡️ ปรับปรุงความถูกต้องฟิลด์: ดึง 'provinceKey' และ 'galleryPaths' มาพ่นข้อมูลประวัติแกลเลอรีรูปภาพและ Hydration ระบบจังหวัด
        const [provinceRes, profilesRes, allProvincesRes] = await Promise.all([
            supabase.from("provinces").select("id, nameThai, key").eq("key", provinceKey).maybeSingle(),
            supabase.from("profiles")
                .select("id, slug, name, age, imagePath, galleryPaths, provinceKey, location, rate, isfeatured, lastUpdated, active, availability, description, height, weight, stats, skin_tone, bust, waist, hips, cup_size, has_video, verified")
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
        
        const customMeta = PROVINCE_CUSTOM_METADATA[normalizedSeoKey] || null;
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
                "potentialAction": { "@type": "SearchAction", "target": `${dynamicDomain}/search?q={search_term_string}`,"query-input":"required name=search_term_string" }
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
                "review": safeProfiles.length > 0 ? matchedSchemaReviews : undefined,
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
        
        const cardsHTML = safeProfiles
            .map((p) => {
                const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/, ""));
                const profileLocation = escapeHTML(p.location || provinceName);
                const profileLink = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
                const isAvailable = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
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
                     style="aspect-ratio: 3/4; width: 100%; position: relative; border-radius: 24px; overflow: hidden; padding:0; cursor: pointer;"
                     role="listitem">
                    
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

        // ดึงไฟล์ index.html ที่เป็นดีไซน์และโครงสร้างหลักของระบบขึ้นมาสแกนค่า Placeholders
        let response;
        if (url.pathname === "/" || url.pathname === "/index.html") {
            response = await context.next();
        } else {
            response = await fetch(new URL("/index.html", url.origin));
        }
        let html = await response.text();

        const seoCanonical = provinceKey === "chiangmai" ? dynamicDomain + "/" : `${dynamicDomain}/location/${provinceKey}`;
        const seoImage = safeProfiles.length > 0 ? optimizeImg(dynamicDomain, safeProfiles[0].imagePath, 1200, 630) : CONFIG.DEFAULT_IMAGE;

        // ประกอบชุดข้อความ พิกัด โซน และรีวิวที่ดึงขึ้นมาแยกตามจังหวัด
        const provinceSEOContentHTML = smartLinkify(seoIntroContent, provinceKey, seoData.zones);
        const provinceReviewsHTML = dynamicReviewsData.map((review) => `
            <div class="interactive-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="height: 40px; width: 40px; border-radius: 50%; background-color: #27272A; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-weight: 700; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);">${review.author.charAt(3) || "K"}</div>
                    <div>
                      <span style="display: block; font-size: 12px; font-weight: 800; color: white;">${escapeHTML(review.author)}</span>
                      <span style="display: block; font-size: 10px; color: var(--text-muted); font-weight: 700;">นัดเจอใน${escapeHTML(review.location)}</span>
                    </div>
                  </div>
                  <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 10px;" aria-label="5 ดาว" role="img">
                    <i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i><i class="fas fa-star" aria-hidden="true"></i>
                  </div>
                </div>
                <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
                  ${escapeHTML(review.text)}
                </p>
                <span style="display: block; font-size: 9px; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">ยืนยันการใช้บริการจริง • ${escapeHTML(review.date)}</span>
            </div>
        `).join("");
        const provinceFAQsHTML = generateDynamicFAQsHTML(seoData.faqs);
        const formattedZonesText = seoData.zones.slice(0, 4).join(", ");

        // ตรรกะสวมรอยเขียนทับ Placeholders ลงบนแม่แบบ index.html ดั้งเดิม
        html = replaceGlobal(html, "{{SEO_TITLE}}", title);
        html = replaceGlobal(html, "{{SEO_DESCRIPTION}}", cleanDescription);
        html = replaceGlobal(html, "{{SEO_CANONICAL}}", seoCanonical);
        html = replaceGlobal(html, "{{SEO_IMAGE}}", seoImage);
        html = replaceGlobal(html, "{{SCHEMA_JSON}}", JSON.stringify(schemaData));
        html = replaceGlobal(html, "{{PROFILES_CARDS_HTML}}", cardsHTML);
        html = replaceGlobal(html, "{{PROVINCE_NAME}}", provinceName);
        html = replaceGlobal(html, "{{PROVINCE_ZONES}}", formattedZonesText);
        html = replaceGlobal(html, "{{PROVINCE_SEO_CONTENT}}", provinceSEOContentHTML);
        html = replaceGlobal(html, "{{PROVINCE_REVIEWS_HTML}}", provinceReviewsHTML);
        html = replaceGlobal(html, "{{PROVINCE_FAQS_HTML}}", provinceFAQsHTML);
        
        // 📊 [ฝังข้อมูลโปรไฟล์] ส่งข้อมูลโปรไฟล์จากฐานข้อมูล Supabase มายังระบบควบคุมฝั่งเบราว์เซอร์โดยตรง เพื่อทำ Client-Side Hydration แบบไม่มีบั๊ก
        html = replaceGlobal(html, "{{PROFILES_JSON}}", JSON.stringify(safeProfiles.map(p => ({
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
            galleryPaths: p.galleryPaths || p.gallery_paths || [],
            provinceKey: p.provinceKey,
            location: p.location,
            rate: p.rate,
            availability: p.availability,
            lastUpdated: p.lastUpdated,
            isfeatured: p.isfeatured,
            verified: p.verified || p.isVerified,
            hasVideo: p.has_video || p.hasVideo, 
            description: p.description || ""
        }))));

        return new Response(html, {
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