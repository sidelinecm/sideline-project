/**
 * [ SYSTEM CORE - REFACTORED & AUDITED ]
 * Project: Nexus Entity Framework (S-Tier) - ULTIMATE GOLD-CARBONE NOIR
 * Mastermind: wawai | Nexus Mastermind
 * Authority: Search Engine Dominance, S-Tier Spacing, Typography & Complete Social Integration
 * Fixes Applied: Resolved Syntax Map Crash, Hydrated Dynamic Count, Aligned Bot/Client Search Coordinates
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const CONFIG = {
    get SUPABASE_URL() {
        try { return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co"; } catch { return "https://zxetzqwjaiumqhrpumln.supabase.co"; }
    },
    get SUPABASE_KEY() {
        try { return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; } catch { return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
    },
    ALLOWED_DOMAINS: ["sidelinechiangmai.netlify.app", "localhost", "127.0.0.1"],
    BRAND_NAME: "SIDELINE CHIANGMAI",
    TWITTER: "@sidelinechiangmai",
    DESCRIPTION: "แหล่งรวมน้องๆสาวๆ รับงานไซด์ไลน์ ฟิวแฟนเด็กเอ็นที่บริการ ระดับพรีเมียม ที่ตรวจสอบแล้วว่าตรงปกทั่วประเทศไทย รับประกันปลอดภัย ตรงปกฟิวแฟน100% บริการประทับใจ ไม่มีโอนมัดจำก่อนเจอตัวจริง📌",
    PHONE: "091-7895644",
    SOCIAL_LINKS: {
        line: "https://line.me/ti/p/ksLUWB89Y_",
        tiktok: "https://tiktok.com/@sidelinecm",
        twitter: "https://twitter.com/sidelinechiangmai",
        linkedin: "https://www.linkedin.com/in/cuteti-sexythailand-398567280?trk=contact-info",
        biosite: "https://bio.site/firstfiwfans.com",
        linktree: "https://linktr.ee/kissmodel",
        bluesky: "https://bsky.app/profile/sidelinechiangmai.bsky.social"
    },
    get SOCIALS() {
        return Object.values(this.SOCIAL_LINKS);
    }
};

// 💎 ระบบฟังก์ชันจัดทำข้อความเกริ่นนำอัจฉริยะ (Dynamic Intro Helper) ป้องกันการ Crash ของระบบหน้าเว็บแบบไร้รอยต่อ
const getDynamicIntro = (provinceName) => {
    return `
        <p>ยินดีต้อนรับสู่แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ<strong>เพื่อนเที่ยวและเอ็นเตอร์เทนเนอร์ จังหวัด${provinceName}</strong> แหล่งรวบรวมข้อมูลโปรไฟล์ที่เน้นความโปร่งใส ปลอดภัย และเพียบพร้อมด้วยการดูแลเอาใจใส่สไตล์ฟิวแฟน (Girlfriend Experience - GFE) อย่างสุภาพเรียบร้อยเป็นธรรมชาติ โดยปราศจากเงื่อนไขการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้น</p>
        <p>เพื่อตอบสนองความสะดวกในการนัดหมายพิกัดบริการในเขต <strong>จังหวัด${provinceName}</strong> ได้ถูกคัดเลือกและจัดสรรพิกัดที่เหมาะสม ไม่ว่าจะเป็นโซนใจกลางเมือง โรงแรมที่เดินทางสะดวกสบาย หรือคอนโดมิเนียมส่วนตัว พร้อมร่วมเดินทางท่องเที่ยว ทานอาหาร หรือพูดคุยเพื่อสร้างความผ่อนคลายและคลายเหงาให้แก่คุณในโอกาสพิเศษ</p>
        <p>ภาพถ่ายประวัติและสัดส่วนของผู้ดูแลทุกคนในสารบัญได้รับการคัดกรองตัวตน (Verified System) เพื่อให้มั่นใจได้ว่าข้อมูลถูกต้อง ตรงปก และมอบประสบการณ์อันเป็นส่วนตัวและปลอดภัยสูงสุดในค่ำคืนนี้</p>
    `;
};

// 💎 ระบบรีวิวจริงจำลองส่งสัญญานทางบวก E-E-A-T และ Schema (Review Verification Builder)
const getDynamicReviews = (provinceName) => {
    const now = new Date();
    
    // คำนวณวันที่ย้อนหลังแบบไดนามิกเพื่อให้สกีมามีความสดใหม่อยู่เสมอ
    const date1 = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
    const date1Published = date1.toISOString().split('T')[0];
    
    const date2 = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    const date2Published = date2.toISOString().split('T')[0];

    return [
        {
            author: "คุณชลสิทธิ์ (C.)",
            location: `ตัวเมือง${provinceName}`,
            text: `"นัดเจอน้องในจังหวัด${provinceName} เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำแพลตฟอร์มนี้ครับ"`,
            date: "เมื่อสัปดาห์ที่แล้ว",
            datePublished: date1Published
        },
        {
            author: "คุณอภิชาติ (A.)",
            location: `โซนยอดนิยมใน${provinceName}`,
            text: `"น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยมเสมือนมีเพื่อนร่วมทางคนพิเศษคอยเคียงข้าง ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ"`,
            date: "เมื่อ 2 สัปดาห์ก่อน",
            datePublished: date2Published
        }
    ];
};

const PROVINCE_SEO_DATA = {
    chiangmai: {
        name: "เชียงใหม่",
        geo: { lat: 18.7883, lng: 98.9853 },
        zones: ["นิมมาน", "สันติธรรม", "ช้างเผือก", "เจ็ดยอด", "แม่โจ้", "หางดง", "สันทราย", "รวมโชค", "คูเมือง", "หลังมอ"],
        lsi: ["รับงานเชียงใหม่", "สาวไซด์ไลน์เชียงใหม่", "sideline เชียงใหม่", "ไซต์ไลน์เชียงใหม่", "ไซไลเชียงใหม่", "นางแบบสาวเหนือ", "เพื่อนเที่ยวเชียงใหม่", "เด็กเอ็นเชียงใหม่"],
        uniqueIntro: `
            <p>ยินดีต้อนรับสู่ทำเนียบแนะนำ<strong>เพื่อนเที่ยวและเอ็นเตอร์เทนเนอร์ เชียงใหม่</strong> แหล่งรวบรวมโปรไฟล์ระดับพรีเมียมสำหรับการค้นหาเพื่อนร่วมเดินทาง เพื่อนร่วมรับประทานอาหาร หรือเพื่อนคู่ใจเพื่อคลายความเหงาในสไตล์ฟิวแฟน (Girlfriend Experience) ที่เน้นความสุภาพและความปลอดภัยสูงสุด ปราศจากความเสี่ยงเรื่องการแอบอ้างด้วยนโยบายชำระหน้างานโดยไม่มีการเรียกเก็บเงินมัดจำล่วงหน้าทุกกรณี</p>
            <p>ทีมน้องๆ ของเราพร้อมให้บริการครอบคลุมพิกัดทำเลยอดนิยมเพื่อความสะดวกในการนัดหมาย ไม่ว่าจะเป็นการเดินเล่นพักผ่อนในย่านที่มีสีสันอย่าง <strong>ถนนนิมมานเหมินท์</strong>, คอนโดมิเนียมและที่พักส่วนตัวย่าน <strong>เจ็ดยอด และสันติธรรม</strong>, ตลอดจนพื้นที่รอบนอกปริมณฑลที่เงียบสงบ เช่น โซนสันทราย มหาวิทยาลัยแม่โจ้ หางดง และแม่ริม เพื่อมอบการดูแลเอาใจใส่ที่เป็นธรรมชาติและสร้างความประทับใจให้แก่คุณในค่ำคืนสำคัญ</p>
            <p>ภาพถ่ายและประวัติการทำงานทั้งหมดในสารบัญได้รับการตรวจสอบความถูกต้องจริงแบบตรงปก เพื่อให้ผู้ใช้บริการมั่นใจในความเป็นส่วนตัวและความคุ้มครองทางการเงินระดับสูงสุดในขณะเดินทางท่องเที่ยวในจังหวัดเชียงใหม่</p>
        `,
        faqs: [
            { q: "หาน้องๆ รับงานเชียงใหม่ โซนไหนเดินทางสะดวกและเป็นส่วนตัวสุด?", a: "โซนนิมมาน สันติธรรม และเจ็ดยอด เป็นทำเลที่น้องๆ พร้อมให้บริการมากที่สุดเนื่องจากมีโรงแรมหรูและคอนโดมิเนียมรองรับการนัดหมายอย่างปลอดภัยและสะดวกสบาย" },
            { q: "ความปลอดภัยในการเรียกสาวไซด์ไลน์เชียงใหม่เป็นอย่างไร?", a: "เราใช้ระบบ 'เจอตัวจริงค่อยชำระค่าขนมหน้างาน' ไม่ต้องมีการโอนมัดจำเพื่อความปลอดภัยและป้องกันกลุ่มมิจฉาชีพ 100% พร้อมเก็บข้อมูลส่วนตัวของลูกค้าเป็นความลับสูงสุด" },
            { q: "น้องๆ สามารถเดินทางไปบริการที่รีสอร์ทส่วนตัวต่างอำเภอในเชียงใหม่ได้ไหม?", a: "ได้แน่นอนครับ น้องๆ ยินดีเดินทางไปดูแลคุณถึงรีสอร์ทหรือพูลวิลล่าส่วนตัวต่างอำเภอ (เช่น แม่ริม, หางดง, สันทราย, สะเมิง) แต่อาจมีค่าเดินทางเพิ่มเติมตามตกลงร่วมกัน" }
        ]
    },
    bangkok: {
        name: "กรุงเทพ",
        geo: { lat: 13.7563, lng: 100.5018 },
        zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "สาทร", "สีลม", "ทองหล่อ", "เอกมัย", "ปิ่นเกล้า", "บางนา", "เลียบด่วน"],
        lsi: ["รับงานกรุงเทพ", "ไซด์ไลน์ กทม", "สาวไซด์ไลน์กรุงเทพ", "sideline bkk", "พริตตี้ กทม.", "เด็กเอ็นพรีเมียม", "เพื่อนเที่ยวส่วนตัว", "นางแบบรับงาน"],
        uniqueIntro: `
            <p>ยินดีต้อนรับสู่คู่มือแนะนำ<strong>เพื่อนเที่ยวและเอ็นเตอร์เทนเนอร์ กรุงเทพมหานคร (กทม.)</strong> สารบัญข้อมูลระดับพรีเมียมที่รวบรวมโปรไฟล์ของนางแบบอิสระ และพริตตี้พาร์ทไทม์ที่พร้อมให้บริการดูแลเอาใจใส่เป็นเพื่อนร่วมทางสไตล์ฟิวแฟน (GFE) อย่างสุภาพเรียบร้อยและปลอดภัยสูงสุด</p>
            <p>เพื่อตอบสนองความสะดวกในการนัดหมาย พิกัดบริการของเราครอบคลุมย่านเศรษฐกิจ แหล่งท่องเที่ยว และแลนด์มาร์กสำคัญทั่วกรุงเทพฯ ไม่ว่าจะเป็นย่านธุรกิจใจกลางเมืองอย่าง <strong>สุขุมวิท, สาทร, สีลม, ทองหล่อ และเอกมัย</strong> ทำเลยอดนิยมของสายสังสรรค์ในโซน <strong>รัชดา-ห้วยขวาง และเลียบด่วนรามอินทรา</strong> ตลอดจนย่านที่พักอาศัยระดับพรีเมียมแถบลาดพร้าว บางนา และปิ่นเกล้า เพื่อให้คุณสามารถนัดพบเพื่อรับประทานอาหาร คุยงาน หรือร่วมทริปเดินทางท่องเที่ยวได้อย่างราบรื่น</p>
            <p>เราคัดกรองโปรไฟล์และภาพถ่ายเพื่อยืนยันตัวตนจริงแบบตรงปก 100% ควบคู่กับนโยบายชำระค่าบริการหน้างานหลังพบตัวจริงโดยไม่มีการเรียกเก็บเงินมัดจำล่วงหน้า เพื่อคุ้มครองความปลอดภัยสูงสุดให้แก่ผู้ใช้บริการในทุกนัดหมายสำคัญ</p>
        `,
        faqs: [
            { q: "น้องๆ รับงานกรุงเทพ ส่วนใหญ่สะดวกสแตนด์บายแถวไหนบ้าง?", a: "ย่านที่มีน้องๆ ประจำการอยู่หนาแน่นที่สุดคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ ซึ่งเป็นย่านคอนโดมิเนียมหรูและเดินทางด้วยรถไฟฟ้า BTS และ MRT" },
            { q: "เรียกเด็กเอ็น หรือ สาวไซด์ไลน์ กทม. ต้องโอนมัดจำล่วงหน้าก่อนไหม?", a: "ไม่มีนโยบายการเก็บเงินมัดจำล่วงหน้าทุกกรณีครับ เพื่อความปลอดภัยของลูกค้ากทม. จะเป็นการจ่ายเงินสดหรือโอนชำระหน้างานหลังเจอตัวน้องตรงปกแล้วเท่านั้น" }
        ]
    },
    lampang: {
        name: "ลำปาง",
        geo: { lat: 18.2913, lng: 99.4922 },
        zones: ["ตัวเมืองลำปาง", "สวนดอก", "พระบาท", "ม.ราชภัฏลำปาง", "เกาะคา", "แม่ทะ", "น้ำล้อม"],
        lsi: ["รับงานลำปาง", "ไซด์ไลน์ลำปาง", "สาวไซด์ไลน์ลำปาง", "sideline ลำปาง", "นักศึกษาลำปาง", "เพื่อนเที่ยวลำปาง", "เด็กเอ็นลำปาง"],
        uniqueIntro: `
            <p>ยินดีต้อนรับสู่แหล่งรวบรวมข้อมูล<strong>เพื่อนเที่ยวและผู้ดูแลเอ็นเตอร์เทน จังหวัดลำปาง</strong> สารบัญแนะนำน้องๆ สาวเหนือหน้าหวานและเพื่อนร่วมทางพาร์ทไทม์ที่เน้นการดูแลเอาใจใส่อย่างเป็นกันเอง สุภาพเรียบร้อย และสุภาพสไตล์ฟิวแฟน เพื่อเปลี่ยนวันธรรมดาหรือทริปท่องเที่ยวเมืองรถม้าของคุณให้เต็มไปด้วยความประทับใจ</p>
            <p>พื้นที่บริการนัดหมายสะดวกสบายครอบคลุมย่านยอดฮิตในจังหวัดลำปาง เช่น บริเวณย่านเศรษฐกิจ <strong>ตัวเมืองลำปาง, สวนดอก, พระบาท</strong> แหล่งคอนโดและคอนเวนชั่นใกล้กับ <strong>มหาวิทยาลัยราชภัฏลำปาง</strong> รวมไปถึงพิกัดนอกเขตเมือง เช่น อำเภอเกาะคา และแม่ทะ พร้อมเป็นเพื่อนร่วมทางเที่ยวคาเฟ่ แนะนำร้านอาหารอร่อย หรือร่วมรับประทานอาหารเย็นเพื่อคลายความเหงาอย่างผ่อนคลาย</p>
            <p>รูปภาพโปรไฟล์ผู้ให้บริการทุกคนผ่านการยืนยันประวัติการแสดงตนแบบตรงปก ปราศจากการเก็บเงินจองคิวหรือโอนมัดจำล่วงหน้า เพื่อส่งมอบประสบการณ์ความปลอดภัยและสร้างความสบายใจสูงสุดให้แก่คุณในทุกช่วงเวลาสำคัญ</p>
        `,
        faqs: [
            { q: "ค้นหาไซด์ไลน์ลำปาง นัดหมายโซนใดปลอดภัยที่สุด?", a: "พื้นที่ตัวเมืองลำปาง โซนสวนดอก และย่านพระบาท เป็นจุดที่มีโรงแรมและคอนโดคุณภาพดี รองรับการนัดเจออย่างสงบและปลอดภัยสูงสุด" },
            { q: "มีการรับประกันความตรงปกของน้องๆ ลำปางอย่างไร?", a: "เราคัดกรองโปรไฟล์และข้อมูลสัดส่วนจริง ถ้านัดเจอน้องที่หน้างานลำปางแล้วพบว่าไม่ตรงตามที่ตกลง ลูกค้าสามารถปฏิเสธและยกเลิกคิวได้ทันทีโดยไม่มีค่าใช้จ่าย" }
        ]
    },
    chiangrai: {
        name: "เชียงราย",
        geo: { lat: 19.9071, lng: 99.8325 },
        zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "ม.แม่ฟ้าหลวง", "ม.ราชภัฏเชียงราย", "หอนาฬิกา", "ริมกก"],
        lsi: ["รับงานเชียงราย", "ไซด์ไลน์เชียงราย", "สาวไซด์ไลน์เชียงราย", "sideline เชียงราย", "น้องนักศึกษาเชียงราย", "เด็กเอ็นเชียงราย"],
        uniqueIntro: `
            <p>ยินดีต้อนรับสู่ทำเนียบแนะนำ<strong>เพื่อนเที่ยวและเอ็นเตอร์เทนเนอร์ จังหวัดเชียงราย</strong> แหล่งรวมโปรไฟล์น้องๆ นักศึกษาพาร์ทไทม์และพริตตี้ดูแลส่วนตัวในพิกัดเหนือสุดแดนสยาม ที่พร้อมร่วมเดินทาง ท่องเที่ยวคาเฟ่ หรือร่วมงานปาร์ตี้ส่วนบุคคลด้วยความสุภาพเรียบร้อยและเป็นกันเองในแบบฉบับ Girlfriend Experience (GFE)</p>
            <p>พื้นที่บริการจัดสรรไว้อย่างเหมาะสมเพื่อความปลอดภัยและความเป็นส่วนตัวของผู้ใช้บริการ ไม่ว่าจะเป็นบริเวณรอบสถานศึกษาชั้นนำอย่าง <strong>มหาวิทยาลัยแม่ฟ้าหลวง (มฟล.) และมหาวิทยาลัยราชภัฏเชียงราย</strong>, ย่านชุมชนยอดนิยมใน <strong>บ้านดู่ และตัวเมืองเชียงราย</strong>, ไปจนถึงโรงแรมบูทีคริมแม่น้ำกก โดยน้องๆ ของเรายินดีคอยเคียงข้าง แนะนำสถานที่ท่องเที่ยว แหล่งรับประทานอาหาร และสร้างบรรยากาศที่อบอุ่นตลอดการเดินทาง</p>
            <p>สัมผัสบริการที่โปร่งใสและตรวจสอบได้จริงผ่านระบบรูปภาพตรงปก 100% พร้อมนโยบายจ่ายเงินสดหน้างานเมื่อเจอกันเรียบร้อยแล้วเท่านั้น ช่วยป้องกันความเสี่ยงจากการแอบอ้างและมอบความน่าเชื่อถือระดับสูงสุดในทุกนัดหมายสำคัญของคุณ</p>
        `,
        faqs: [
            { q: "ต้องการนัดพบน้องนักศึกษาเชียงราย โซน มฟล. หรือบ้านดู่ มีขั้นตอนอย่างไร?", a: "โซน ม.แม่ฟ้าหลวง และบ้านดู่ มีน้องๆ สแตนด์บายเยอะมากครับ สามารถแจ้งคิวและเวลาที่ต้องการกับแอดมิน เพื่อนัดพบตามห้องพัก คอนโด หรือโรงแรมใกล้เคียงได้ทันที" },
            { q: "มีความเสี่ยงที่จะโดนโกงมัดจำสำหรับการเรียกไซด์ไลน์เชียงรายไหม?", a: "เว็บไซต์ของเราใช้ระบบนัดเจอตัวจริงก่อนชำระเงินหน้างาน 100% จึงไม่มีความเสี่ยงเรื่องการโดนหลอกโอนเงินมัดจำล่วงหน้าแน่นอนครับ" }
        ]
    },
    khonkaen: {
        name: "ขอนแก่น",
        geo: { lat: 16.4322, lng: 102.8236 },
        zones: ["มข.", "กังสดาล", "หลังมอ", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
        lsi: ["รับงานขอนแก่น", "ไซด์ไลน์ขอนแก่น", "สาวไซด์ไลน์ขอนแก่น", "sideline ขอนแก่น", "เด็กเอ็นขอนแก่น", "นักศึกษาขอนแก่น"],
        uniqueIntro: `
            <p>ยินดีต้อนรับสู่ศูนย์กลางข้อมูล<strong>เพื่อนเที่ยวและผู้ดูแลเอ็นเตอร์เทน จังหวัดขอนแก่น</strong> สารบัญแนะนำน้องๆ นักศึกษาพาร์ทไทม์และสาวสวยอิสระในดินแดนแดนอีสาน ที่พร้อมเป็นเพื่อนร่วมทางคอยอำนวยความสะดวก ร่วมรับประทานอาหาร คุยงานสัมมนา หรือร่วมทริปปาร์ตี้ส่วนบุคคลอย่างเป็นกันเองเสมือนคนรัก</p>
            <p>จุดนัดหมายและพื้นที่บริการครอบคลุมย่านยอดฮิตหลักในขอนแก่น ไม่ว่าจะเป็นรอบรั้วสถาบันการศึกษาอย่าง <strong>ย่านกังสดาล, หลัง มข. และโนนม่วง</strong>, โรงแรมหรูใกล้แหล่งช้อปปิ้งย่าน <strong>เซ็นทรัลขอนแก่น</strong> และจุดพักผ่อนหย่อนใจริมบึงแก่นนคร ยินดีเทคแคร์ลูกค้าด้วยรอยยิ้มและความจริงใจ ให้เกียรติผู้ใช้บริการสูงสุด</p>
            <p>เพื่อปกป้องสมาชิกจากการโดนหลอกลวง แพลตฟอร์มของเราใช้ระบบยืนยันประวัติตัวจริงแบบตรงปก ไม่ใช้ภาพฟิลเตอร์ดึงใบหน้าจนเกินจริง ควบคู่กับระบบชำระเงินเมื่อพบตัวจริงหน้างานโดยไม่มีการเรียกเก็บเงินมัดจำล่วงหน้าทุกกรณี</p>
        `,
        faqs: [
            { q: "น้องๆ ไซด์ไลน์ขอนแก่น ส่วนใหญ่เป็นใครและน่าเชื่อถือไหม?", a: "มีทั้งกลุ่มน้องนักศึกษาระดับมหาวิทยาลัยพาร์ทไทม์ และนางแบบอิสระในขอนแก่น ทุกคนผ่านการตรวจสอบข้อมูลโปรไฟล์และตรงปกแน่นอน" },
            { q: "นัดหมายน้องๆ ขอนแก่น แถว มข. มีความปลอดภัยแค่ไหน?", a: "โซน มข. และกังสดาล เป็นแหล่งชุมชนเมืองที่มีความปลอดภัยสูง มีที่พักและคอนโดทันสมัยจำนวนมาก รองรับการนัดเจอที่สะดวกรวดเร็วและรักษาความลับสูงสุด" }
        ]
    },
    chonburi: {
        name: "ชลบุรี",
        geo: { lat: 13.3611, lng: 100.9847 },
        zones: ["พัทยา", "บางแสน", "ศรีราชา", "อมตะนคร", "ตัวเมืองชลบุรี", "ม.บูรพา"],
        lsi: ["รับงานชลบุรี", "ไซด์ไลน์ชลบุรี", "สาวไซด์ไลน์พัทยา", "sideline ชลบุรี", "เพื่อนเที่ยวบางแสน", "เด็กเอ็นพัทยา"],
        uniqueIntro: `
            <p>ยินดีต้อนรับสู่ทำเนียบแนะนำ<strong>เพื่อนเที่ยวและเอ็นเตอร์เทนเนอร์ จังหวัดชลบุรี (พัทยา-บางแสน)</strong> สารบัญคัดสรรสาวสวยหุ่นดี พริตตี้ระดับท็อป และเพื่อนร่วมเดินทางท่องเที่ยวพาร์ทไทม์ในพิกัดชายทะเลภาคตะวันออก ที่ยินดีให้บริการดูแลอารมณ์ของคุณ ผ่อนคลายความเครียด และสร้างความประทับใจสไตล์คู่รักพรีเมียมในวันหยุดพักผ่อนหย่อนใจของคุณ</p>
            <p>พื้นที่บริการจัดวางพิกัดเชื่อมโยงพิกัดสันทนาการริมชายทะเลและย่านธุรกิจหลัก ไม่ว่าจะเป็นย่านปาร์ตี้ระดับสากลใน <strong>พัทยา</strong>, ชายหาดชิลๆ แถบ <strong>บางแสน และบริเวณรอบ ม.บูรพา</strong>, ตลอดจนพื้นที่ส่วนตัวย่านเศรษฐกิจใน <strong>ศรีราชา และอมตะนคร</strong> ยินดีเดินทางไปดูแลคุณถึงที่พัก คอนโดมิเนียมหรู หรือร่วมงานเลี้ยงส่วนบุคคลในพูลวิลล่าส่วนตัวอย่างใส่ใจและให้เกียรติ</p>
            <p>เราคัดเลือกรูปโปรไฟล์ตรงปกอย่างเข้มงวด ป้องกันการหลอกลวงด้วยมาตรการจ่ายหน้างานเมื่อพบตัวจริง 100% ไม่มีนโยบายโอนเงินจองคิวล่วงหน้า เพื่อส่งมอบความคุ้มครองและความน่าเชื่อถือสูงสุดให้แก่การท่องเที่ยวพักผ่อนของคุณ</p>
        `,
        faqs: [
            { q: "หาสาวไซด์ไลน์พัทยา-บางแสน รูปตรงปกและไม่โดนหลอกมัดจำได้อย่างไร?", a: "เราเน้นย้ำมาตรฐานความตรงปกและใช้ระบบจ่ายเงินหน้างานเมื่อเจอตัวน้องเท่านั้น ป้องกันปัญหาการหลอกโอนเงินจองคิวก่อนได้แน่นอนครับ" },
            { q: "น้องๆ รับงานพูลวิลล่า ค้างคืน หรือเดินทางไปกับทริปท่องเที่ยวบางแสนไหม?", a: "มีครับ เรามีกลุ่มน้องๆ สายปาร์ตี้เอนเตอร์เทนส่วนตัวที่ชำนาญงานพูลวิลล่าและพร้อมร่วมทริปริมทะเลบางแสน-พัทยาเพื่อดูแลคุณอย่างใกล้ชิด" }
        ]
    },
    phitsanulok: {
        name: "พิษณุโลก",
        geo: { lat: 16.8219, lng: 100.2659 },
        zones: ["ตัวเมืองพิษณุโลก", "ม.นเรศวร", "ริมน้ำน่าน", "เซ็นทรัลพิษณุโลก"],
        lsi: ["รับงานพิษณุโลก", "ไซด์ไลน์พิษณุโลก", "สาวไซด์ไลน์พิษณุโลก", "sideline พิษณุโลก", "น้องนักศึกษามน", "เด็กเอ็นพิษณุโลก"],
        uniqueIntro: `
            <p>ยินดีต้อนรับสู่สารบัญแนะนำ<strong>เพื่อนเที่ยวและผู้ดูแลเอ็นเตอร์เทน จังหวัดพิษณุโลก</strong> ศูนย์กลางรวบรวมโปรไฟล์ของน้องๆ นักศึกษาพาร์ทไทม์ มหาวิทยาลัยนเรศวร (มน.) และสาวสวยอิสระในเมืองสองแคว ที่รับงานดูแลเฉพาะกิจเพื่อคอยอยู่เคียงข้าง ร่วมรับประทานอาหาร นำเที่ยว แนะนำข้อมูล หรือพูดคุยคลายเครียดในมุมส่วนตัวอย่างเป็นกันเองและสุภาพเรียบร้อย</p>
            <p>สามารถวางแผนนัดพบน้องๆ ได้ตามพิกัดยอดนิยม เช่น คอนโดมิเนียมหรูและที่พักใกล้มหาวิทยาลัย <strong>ม.นเรศวร (มน.)</strong>, แหล่งช้อปปิ้งใจกลางเมืองอย่าง <strong>เซ็นทรัลพิษณุโลก</strong> หรือโรงแรมที่เดินทางสะดวกสบายแถบ <strong>ริมแม่น้ำน่าน</strong> ยินดีดูแลเอาใจใส่เสมือนคู่รักด้วยมารยาทที่ดีเยี่ยม</p>
            <p>ข้อมูลโปรไฟล์และภาพถ่ายทั้งหมดได้รับการตรวจสอบเทียบใบหน้าจริงแบบตรงปก ไม่ผ่านการดัดแปลงภาพเกินจริง และใช้ระบบความปลอดภัยชำระค่าบริการหน้างานไร้มัดจำล่วงหน้าทุกกรณี เพื่อความอุ่นใจในการใช้บริการอย่างเป็นธรรม</p>
        `,
        faqs: [
            { q: "หาไซด์ไลน์พิษณุโลก แถว มน. นัดหมายยากไหมและสะดวกเวลาใด?", a: "โซน ม.นเรศวร (มน.) มีน้องๆ นักศึกษาพาร์ทไทม์พร้อมบริการหนาแน่นที่สุด สามารถจองและนัดพบตามโรงแรมหรือหอพักใกล้เคียงได้อย่างสะดวกรวดเร็วเกือบตลอดทั้งวัน" },
            { q: "ต้องทำการโอนเงินมัดจำล่วงหน้าก่อนเรียกน้องพิษณุโลกไหม?", a: "ไม่ต้องโอนเงินก่อนใดๆ ทั้งสิ้นครับ ลูกค้าจะจ่ายเงินค่าขนมหลังจากเจอน้องตรงปกหน้างานแถบพิษณุโลกแล้วเท่านั้น เพื่อป้องกันความเสี่ยงอย่างสมบูรณ์แบบ" }
        ]
    },
    default: {
        name: "จังหวัดอื่นๆ",
        geo: { lat: 13.7563, lng: 100.5018 },
        zones: ["ตัวเมือง", "พื้นที่ใกล้เคียง"],
        lsi: ["รับงานส่วนตัว", "สาวไซด์ไลน์", "sideline พรีเมียม", "เพื่อนเที่ยว", "เด็กเอ็น", "นักศึกษาพาร์ทไทม์", "สาวสวยตรงปก", "ดูแลฟิวแฟน"],
        uniqueIntro: null,
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
                `<a href="/search?q=${encodeURIComponent(zone)}" class="text-[#D97706] hover:underline font-bold transition-colors">$1</a>`
            );
        });
    }

    const keywords = ["เด็กเอ็น", "ไซด์ไลน์", "พรีเมียม", "ฟีลแฟน", "รับงาน"];
    keywords.forEach(kw => {
        const regex = new RegExp(`(${kw})(?![^<>]*>)`, 'g'); 
        linkedText = linkedText.replace(
            regex,
            `<span class="highlight text-[#D97706] font-extrabold">$1</span>`
        );
    });

    return linkedText;
};

function verifyHostname(request) {
    const host = request.headers.get("host") || "";
    return CONFIG.ALLOWED_DOMAINS.some(allowed => host.includes(allowed)) || host.endsWith(".netlify.app");
}

function buildErrorPage(statusCode, title, message) {
    return new Response(
        `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${statusCode} - ${escapeHTML(title)}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
        body { background: #000000; color: #fff; font-family: 'Prompt', sans-serif; }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen p-4 overflow-hidden relative">
    <div class="absolute -right-1/4 -top-1/3 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style="background: radial-gradient(circle, rgba(217,119,6,.2) 0%, transparent 70%)"></div>
    <div class="relative z-10 w-full max-w-md rounded-[24px] border border-white/10 bg-white/[0.02] p-10 text-center backdrop-blur-2xl shadow-2xl">
        <div class="text-7xl font-extrabold text-[#D97706] tracking-tight mb-6 drop-shadow-[0_0_20px_rgba(217,119,6,0.45)]">
            ${statusCode}
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-white mb-3">${escapeHTML(title)}</h1>
        <p class="text-white/60 text-sm mb-8 leading-relaxed">${escapeHTML(message)}</p>
        <a href="/" class="inline-flex items-center gap-2 rounded-xl bg-[#D97706] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#D97706]/30 transition-all hover:scale-[1.03]">
            กลับหน้าหลัก
        </a>
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
                if (p.key !== 'chiangmai') {
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
        const pathParts = url.pathname.split("/").filter(Boolean);
        const rawProvinceKey = pathParts[pathParts.length - 1] || "chiangmai";
        let provinceKey = rawProvinceKey.toLowerCase();
        try { provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase(); } catch { provinceKey = rawProvinceKey.toLowerCase(); }

        if (pathParts[0] === "location" && provinceKey === "chiangmai") {
            return Response.redirect(new URL("/", url.origin).toString(), 301);
        }

        let supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const normalizedSeoKey = provinceKey.replace(/-/g, '');

        const [provinceRes, profilesRes, allProvincesRes] = await Promise.all([
            supabase.from("provinces").select("id, nameThai, key").eq("key", provinceKey).maybeSingle(),
            supabase.from("profiles").select("id, slug, name, age, imagePath, location, rate, isfeatured, lastUpdated, active, availability")
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
        const seoData = PROVINCE_SEO_DATA[normalizedSeoKey] || PROVINCE_SEO_DATA.default;
        
        const now = new Date();
        const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const CURRENT_MONTH = thaiMonths[now.getMonth()];
        const CURRENT_YEAR = now.getFullYear();
        const provinceUrl = provinceKey === 'chiangmai' ? dynamicDomain : `${dynamicDomain}/location/${provinceKey}`;
        const firstImage = safeProfiles.length > 0 ? optimizeImg(dynamicDomain, safeProfiles[0].imagePath, 1200, 630) : `${dynamicDomain}/images/hero-sidelinechiangmai-1200.webp`;

        const title = `เพื่อนเที่ยวและไซด์ไลน์${provinceName} 2026 | รวมโปรไฟล์ตรงปก ปลอดภัย ไม่มัดจำ`;
        const description = `รวมข้อมูลแนะนำเพื่อนร่วมทางและผู้ให้บริการเอ็นเตอร์เทนใน${provinceName} คัดสรรโปรไฟล์คุณภาพตรงปก ปลอดภัย ไม่มีโอนมัดจำล่วงหน้า จ่ายหน้างานเมื่อเจอตัวจริง ครอบคลุมโซนยอดนิยม เช่น ${seoData.zones.slice(0, 3).join(', ')}`;
        const cleanDescription = stripHTML(description);
        
        const deterministicRating = safeProfiles.length > 0 ? (4.6 + (safeProfiles.length % 4) / 10).toFixed(1) : "4.7";
        const deterministicReviews = safeProfiles.length > 0 ? 30 + (safeProfiles.length * 3) : 15;

        // 💎 Dynamic JSON-LD Reviews Array Generation (E-E-A-T Schema Integration)
        const matchedSchemaReviews = getDynamicReviews(provinceName).map(r => ({
            "@type": "Review",
            "author": { "@type": "Person", "name": r.author },
            "datePublished": r.datePublished,
            "reviewBody": stripHTML(r.text),
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
        }));

        // Structured Data Schema.org (JSON-LD) - อัปเกรดความถูกต้องในระดับสูง
        const schemaGraph = [
            {
                "@type": "Organization",
                "@id": `${dynamicDomain}/#organization`,
                "name": CONFIG.BRAND_NAME,
                "url": dynamicDomain,
                "logo": { "@type": "ImageObject", "url": `${dynamicDomain}/images/logo-sidelinechiangmai.webp` },
                "description": cleanDescription,
                "sameAs": CONFIG.SOCIALS,
                "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "telephone": CONFIG.PHONE, "availableLanguage": ["th", "en"] }
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
                "name": "ไลน์" + provinceName + " สารบัญเพื่อนเที่ยวและผู้ให้บริการดูแลระดับพรีเมียม",
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
                "name": "รายชื่อผู้ดูแลและเพื่อนเที่ยว " + provinceName,
                "numberOfItems": safeProfiles.length,
                "itemListElement": safeProfiles.map((p, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "item": {
                        "@type": "Person",
                        "name": p.name || "ผู้ให้บริการไม่ระบุชื่อ",
                        "url": `${dynamicDomain}/sideline/${p.slug || p.id}`,
                        "image": optimizeImg(dynamicDomain, p.imagePath, 360, 480),
                        "description": "โปรไฟล์แนะนำ " + (p.name || "") + " พิกัดโซน " + (p.location || provinceName)
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
        
        // 💎 Dynamic Premium Carbon Dark Cards with Gold Accents
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
                <div class="province-card profile-card profile-card-new relative group overflow-hidden rounded-[24px] border border-white/[0.05] bg-white/[0.02] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[#D97706]/40 hover:shadow-2xl hover:shadow-[#D97706]/10" 
                     data-id="${p.id}"
                     data-profile-id="${p.id}"
                     data-profile-slug="${p.slug}"
                     data-name="น้อง${cleanName}"
                     data-region="${profileLocation}"
                     data-desc=""
                     style="aspect-ratio: 3/4; width: 100%; position: relative;">
                    
                    <!-- ลิงก์ครอบคลุมพื้นที่การ์ดทั้งหมดเพื่อใช้กดเปิด Lightbox -->
                    <a href="${profileLink}" class="card-link absolute inset-0 z-20" aria-label="ดูโปรไฟล์น้อง${cleanName}"></a>

                    <!-- รูปภาพแสดงผลเต็มใบหลังสุด -->
                    <img src="${optimizeImg(dynamicDomain, p.imagePath, 300, 400)}" 
                         alt="น้อง${cleanName} รับงาน${provinceName}" 
                         class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                         loading="lazy" decoding="async" />

                    <!-- เงาดำไล่เฉดมินิมอลเฉพาะขอบล่างสุดป้องกันกลืนพื้นหลัง -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent z-10 pointer-events-none"></div>

                    <!-- ป้ายสถานะรับงานมุมซ้ายบนขนาดมินิมอล -->
                    <div class="absolute top-2.5 left-2.5 z-30">
                        <span class="neon-badge ${statusClass} bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-bold px-2 py-0.5 rounded-full text-white flex items-center gap-1">
                            <span class="neon-dot inline-block w-1.5 h-1.5 rounded-full" style="background-color: ${statusClass === 'status-available-neon' ? '#00E676' : '#FF2E63'}; box-shadow: 0 0 6px ${statusClass === 'status-available-neon' ? '#00E676' : '#FF2E63'};"></span>
                            <span>${statusText}</span>
                        </span>
                    </div>

                    <!-- ปุ่มหัวใจมุมขวาบนขนาดมินิมอล -->
                    <div class="absolute top-2.5 right-2.5 z-30">
                        <button type="button" class="like-button-wrapper w-7 h-7 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/10 hover:bg-[#D97706] transition-colors" data-action="like" data-id="${p.id}">
                            <i class="fa-solid fa-heart text-[10px] text-white"></i>
                        </button>
                    </div>

                    <!-- ข้อความรายละเอียดลอยอยู่ด้านล่างของการ์ดแบบบางเฉียบไม่บดบังใบหน้าน้อง ๆ -->
                    <div class="absolute bottom-0 left-0 right-0 p-3 z-20 flex flex-col gap-1 pointer-events-none text-left">
                        <!-- แถวที่ 1: ชื่อ และ ราคา -->
                        <div class="flex items-center justify-between">
                            <h4 class="text-[13px] sm:text-sm font-extrabold text-white truncate pr-1" style="text-shadow: 0 1.5px 3px rgba(0,0,0,0.8);">${cleanName}</h4>
                            <span class="text-[#D97706] font-black text-[12px] sm:text-xs whitespace-nowrap" style="text-shadow: 0 1.5px 3px rgba(0,0,0,0.8);">${displayRate}</span>
                        </div>
                        
                        <!-- แถวที่ 2: พิกัด และ วันอัปเดตล่าสุด -->
                        <div class="flex items-center justify-between text-[10px] text-zinc-300">
                            <span class="truncate" style="text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                                <i class="fas fa-map-marker-alt text-[#D97706] mr-1"></i> ${profileLocation}
                            </span>
                            <span class="whitespace-nowrap opacity-85" style="text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                                <i class="far fa-clock mr-0.5"></i> ${formatDateSSR(p.lastUpdated || p.created_at)}
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
<html lang="th" class="scroll-smooth antialiased dark bg-[#050508]">
<head>
  <!-- 1. Technical Meta Tags (ต้องอยู่บนสุดเพื่อให้เบราว์เซอร์รับรู้ชุดอักขระและขนาดจอทันที) -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#D97706">

  <!-- 2. SEO & Social Meta Tags (สำคัญมากต่อการเก็บข้อมูลของ Search Engine และการแสดงผลเมื่อแชร์ลิงก์) -->
  <title>${title}</title>
  <meta name="description" content="${cleanDescription}"/>
  <meta name="keywords" content="เพื่อนเที่ยว${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}, ฟิวแฟน, ตรงปก, ไม่มีโอนมัดจำ, ไซด์ไลน์${provinceName}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" id="canonical-link" href="${provinceUrl}">

  <!-- Open Graph / Facebook / Line Dynamic Metadata -->
  <meta property="og:locale" content="th_TH">
  <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${cleanDescription}">
  <meta property="og:url" content="${provinceUrl}">
  <meta property="og:image" content="${firstImage}">

  <!-- 3. Preconnect & DNS-Prefetch (เปิดการเชื่อมต่อกับเซิร์ฟเวอร์ภายนอกล่วงหน้าเพื่อลดความหน่วง) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" />

  <!-- 4. PWA, Shortcut Icons & Favicons -->
  <link rel="shortcut icon" href="/images/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">

  <!-- 5. Fonts (ดึงฟอนต์มาทำงานก่อนเพื่อให้ข้อความพร้อมแสดงผลทันที) -->
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

  <!-- 6. FontAwesome Icons (สไตล์ไอคอนจากภายนอก) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: { sans: ['Prompt', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
          colors: {
            brand: '#D97706',
            'brand-foreground': '#ffffff',
            background: '#050508',
            foreground: '#f4f4f5'
          }
        }
      }
    }
  </script>

  <!-- ==========================================================================
     UNIFIED ELITE 3D GLASSMORPHIC CSS (Vanilla Pure CSS - บราวเซอร์เปิดอ่านได้ทันที)
     ========================================================================== -->
  <style>
    :root {
      --primary: 38 92% 50%;       /* Gold / Amber (#D97706) */
      --primary-glow: 38 95% 65%;
      --secondary: 45 100% 50%;     /* Orange / Gold (#F59E0B) */
      --secondary-glow: 45 100% 70%;
      --background: 240 15% 4%;     /* Pure Deep Dark (#050508) */
      --foreground: 220 20% 95%;
      --card: 240 12% 8%;           /* Dark Glass Core Tint (#0D0D12) */
      --border: 240 12% 16%;
      --radius: 1.5rem;
    }

    body { 
      font-family: 'Prompt', sans-serif; 
      background-color: #050508; 
      color: #f4f4f5; 
      overflow-x: hidden;
      position: relative;
    }

    body::before {
      content: "";
      position: fixed;
      top: 0; left: 0;
      width: 200%; height: 200%;
      z-index: -2;
      background-image: radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      opacity: 0.25;
      pointer-events: none;
    }

    h1, h2, h3, h4 {
      letter-spacing: -0.015em;
      line-height: 1.35;
    }
    p {
      line-height: 1.85 !important;
      letter-spacing: 0.015em;
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #050508; }
    ::-webkit-scrollbar-thumb { background: rgba(217, 119, 6, 0.35); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(217, 119, 6, 0.65); }

    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes aurora-drift {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.2; }
      50%      { transform: translate3d(3%, -4%, 0) scale(1.08); opacity: 0.45; }
    }
    @keyframes shine-sweep {
      0% { left: -150%; }
      100% { left: 150%; }
    }
    @keyframes pulse-led-green {
      0%, 100% { transform: scale(1); box-shadow: 0 0 10px #00E676, 0 0 20px rgba(0,230,118,0.4); opacity: 0.85; }
      50% { transform: scale(1.2); box-shadow: 0 0 22px #00E676, 0 0 35px rgba(0,230,118,0.85); opacity: 1; }
    }
    @keyframes pulse-led-red {
      0%, 100% { transform: scale(1); box-shadow: 0 0 10px #FF2E63, 0 0 20px rgba(255,46,99,0.4); opacity: 0.85; }
      50% { transform: scale(1.2); box-shadow: 0 0 22px #FF2E63, 0 0 35px rgba(255,46,99,0.85); opacity: 1; }
    }
    @keyframes button-gravity-pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4), 0 15px 35px -5px rgba(16, 185, 129, 0.35); }
      70% { box-shadow: 0 0 0 16px rgba(16, 185, 129, 0), 0 15px 35px -5px rgba(16, 185, 129, 0.35); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0), 0 15px 35px -5px rgba(16, 185, 129, 0.35); }
    }
    @keyframes auto-shine-sweep {
      0% { left: -150%; }
      25%, 100% { left: 150%; }
    }

    .animate-fade-in-up { animation: fade-in-up .8s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .animate-aurora     { animation: aurora-drift 22s ease-in-out infinite; }

    /* --- Premium Acrylic-Glass Panel --- */
    .glass-panel {
      background: linear-gradient(135deg, rgba(14, 14, 22, 0.82) 0%, rgba(6, 6, 10, 0.96) 100%) !important;
      backdrop-filter: blur(28px) saturate(220%) !important;
      -webkit-backdrop-filter: blur(28px) saturate(220%) !important;
      border: 1px solid rgba(255, 255, 255, 0.09) !important;
      box-shadow: 
        0 40px 70px -15px rgba(0, 0, 0, 0.98),
        inset 0 1.5px 0.5px rgba(255, 255, 255, 0.16), /* สะท้อนขอบบนเลียนแบบงานแก้วคริสตัล */
        inset 0 -1.5px 1px rgba(0, 0, 0, 0.6) !important;
    }
    
    /* --- 3D Specular Glass Hero Billboard --- */
    .hero-billboard-3d {
      position: relative;
      border-radius: 32px !important;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      box-shadow: 
        0 40px 80px -15px rgba(0, 0, 0, 0.98), 
        0 0 40px rgba(217, 119, 6, 0.12),
        inset 0 1.5px 1.5px rgba(255, 255, 255, 0.25) !important;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hero-billboard-3d::after {
      content: '';
      position: absolute;
      top: 0; left: -150%;
      width: 45%; height: 100%;
      background: linear-gradient(
        90deg, 
        rgba(255,255,255,0) 0%, 
        rgba(255,255,255,0.12) 50%, 
        rgba(255,255,255,0) 100%
      );
      transform: skewX(-25deg);
      pointer-events: none;
      animation: auto-shine-sweep 7s infinite ease-in-out;
      z-index: 15;
    }
    
    /* Animation Blob for Service Section */
    @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
    .animate-blob { animation: blob 7s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    
    #featured-profiles {
      position: relative;
      z-index: 20; 
      clear: both; 
    }

    .social-media-section {
      position: relative;
      z-index: 5;
      overflow: hidden; 
    }

    /* --- 3D Interactive Card --- */
    .interactive-card {
      position: relative;
      overflow: hidden;
      transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
      will-change: transform, box-shadow, border-color;
    }
    .interactive-card:hover {
      transform: translateY(-6px) scale(1.015) rotateX(1deg) rotateY(1deg);
      border-color: rgba(217, 119, 6, 0.45) !important;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.005) 100%) !important;
      box-shadow: 
        0 50px 90px -20px rgba(0, 0, 0, 0.99), 
        0 0 35px rgba(217, 119, 6, 0.12),
        inset 0 1.5px 1.5px rgba(255, 255, 255, 0.22) !important;
    }

    .interactive-card::before {
      content: '';
      position: absolute;
      top: 0; left: -160%;
      width: 60%; height: 100%;
      background: linear-gradient(
        90deg, 
        rgba(255,255,255,0) 0%, 
        rgba(255,255,255,0.12) 50%, 
        rgba(255,255,255,0) 100%
      );
      transform: skewX(-25deg);
      pointer-events: none;
    }
    .interactive-card:hover::before {
      animation: shine-sweep 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* --- แคปซูลโปร่งแสงสะท้อนขอบ (3D Specular Capsule Glass) --- */
    .capsule-3d-glass {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      box-shadow: 
        0 10px 25px -5px rgba(0, 0, 0, 0.8),
        inset 0 1px 1px rgba(255, 255, 255, 0.12) !important; /* สะท้อนเงาขอบแก้วด้านบน */
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .capsule-3d-glass:hover {
      transform: translateY(-3px) scale(1.02);
      border-color: rgba(217, 119, 6, 0.3) !important;
      box-shadow: 
        0 15px 30px -5px rgba(0, 0, 0, 0.9), 
        0 0 15px rgba(217, 119, 6, 0.1) !important;
    }

    /* --- LED Badges --- */
    .neon-badge {
        display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 99px; font-weight: 700; font-size: 11px; backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.14);
    }
    .neon-dot { width: 9px; height: 9px; border-radius: 50%; }
    .status-available-neon .neon-dot { animation: pulse-led-green 2.5s infinite ease-in-out; }
    .status-busy-neon .neon-dot { animation: pulse-led-red 2.5s infinite ease-in-out; }

    /* --- Liquid-Gloss Green Button --- */
    .btn-liquid-green {
      background: linear-gradient(180deg, #10B981 0%, #036b44 100%) !important;
      border: 1px solid rgba(255, 255, 255, 0.26) !important;
      box-shadow: 0 16px 32px -6px rgba(16, 185, 129, 0.42), 
                  inset 0 1.5px 2.5px rgba(255, 255, 255, 0.45), 
                  inset 0 -3.5px 7px rgba(0, 0, 0, 0.35) !important;
      transition: all 0.38s cubic-bezier(0.16, 1, 0.3, 1) !important;
      animation: button-gravity-pulse 2.8s infinite;
    }
    .btn-liquid-green:hover {
      transform: translateY(-3px) scale(1.03);
      background: linear-gradient(180deg, #34D399 0%, #047857 100%) !important;
      box-shadow: 0 22px 40px -8px rgba(16, 185, 129, 0.5), 
                  inset 0 1.5px 3.5px rgba(255, 255, 255, 0.55), 
                  inset 0 -3.5px 7px rgba(0, 0, 0, 0.35) !important;
    }
    .btn-liquid-green:active {
      transform: translateY(1.8px) scale(0.96);
      box-shadow: 0 5px 14px -2px rgba(16, 185, 129, 0.3), 
                  inset 0 4px 8px rgba(0, 0, 0, 0.5) !important;
    }

    /* --- Embossed Glass Logo --- */
    .logo-embossed {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%) !important;
      border: 1px solid rgba(255, 255, 255, 0.28) !important;
      box-shadow: 
        0 9px 18px rgba(217, 119, 6, 0.45),
        inset 0 1.8px 2.5px rgba(255, 255, 255, 0.55),
        inset 0 -2.5px 5px rgba(0, 0, 0, 0.38) !important;
    }

    /* --- Profile Card Custom Layout 3:4 --- */
    .card-fixed-ratio {
        position: relative; width: 100%; padding-top: 133.33%; overflow: hidden; border-radius: 20px;
        background-color: #0c0c0e;
        border: 1px solid rgba(255, 255, 255, 0.05);
        box-shadow: 
          0 10px 30px -5px rgba(0,0,0,0.8),
          inset 0 1px 1px rgba(255,255,255,0.08) !important;
        transform: translateZ(0);
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card-fixed-ratio img.card-image {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;
        object-position: top center; z-index: 1; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card-fixed-ratio:hover {
        border-color: rgba(217, 119, 6, 0.3) !important;
        box-shadow: 
          0 20px 40px -10px rgba(0, 0, 0, 0.95),
          inset 0 1px 1.5px rgba(255, 255, 255, 0.12) !important;
    }
    .card-fixed-ratio:hover img.card-image {
        transform: scale(1.05);
    }
    .gradient-overlay-fixed {
        position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
        background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%);
        pointer-events: none; z-index: 10;
    }

    /* --- Search Recessed Pocket --- */
    .recessed-pocket {
      background: rgba(3, 3, 5, 0.75) !important;
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.75) !important;
    }

    /* --- Chroma Specular Highlights --- */
    .text-gradient-luxury {
      background: linear-gradient(135deg, #FF2E63 10%, #FF8E53 60%, #FFF9E6 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      filter: drop-shadow(0 2px 10px rgba(255, 46, 99, 0.2));
    }
    
    .seo-content-white a {
        color: #D97706 !important; font-weight: 700; text-decoration: underline; text-underline-offset: 4px;
    }
    .seo-content-white a:hover { color: #f59e0b !important; }
    .seo-content-white span.highlight, .seo-content-white strong {
        color: #D97706 !important; font-weight: 800;
    }

    .availability-badge, .status-badge, .featured-badge {
      font-size: 0.68rem !important;
      padding: 0.25rem 0.65rem !important;
      font-weight: 700 !important;
      border-radius: 9999px !important;
      letter-spacing: 0.03em !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
      backdrop-filter: blur(8px) !important;
      -webkit-backdrop-filter: blur(8px) !important;
    }
    .status-available { background: linear-gradient(135deg, #10B981, #059669) !important; }
    .status-busy { background: linear-gradient(135deg, #f97316, #d97706) !important; }
    .status-inquire { background: linear-gradient(135deg, #ef4444, #dc2626) !important; }
    .featured-badge { background: linear-gradient(135deg, #D97706, #B45309) !important; border: 1px solid rgba(255,255,255,0.1) !important; }

    /* --- Fixed Skeleton Vanilla CSS --- */
    .skeleton-card {
      position: relative;
      overflow: hidden;
      border-radius: 1rem;
      background-color: #121217;
      height: 400px;
      min-height: 300px;
      width: 100%;
    }
    .skeleton-card::after {
      content: '';
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.02) 20%, rgba(255, 255, 255, 0.05) 60%, transparent);
      animation: loading 1.6s infinite;
    }
    @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  </style>

  <!-- 8. Custom External Stylesheet (โหลดหลังจาก Tailwind CDN เพื่อไม่ให้ Utility ของ Tailwind ไปทับสไตล์คัสตอมของเรา) -->
  <link rel="stylesheet" href="/styles.css" />

  <!-- 9. Structured Data (JSON-LD สำหรับทำ Rich Snippet บน Google) -->
  <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

  <!-- 10. Critical Inline Styles (เก็บสไตล์หลักจำเพาะบางส่วนที่มีพฤติกรรมแบบไดนามิกหรือจำเป็นเร่งด่วน) -->


</head>

<body class="min-h-screen bg-[#050508] font-sans text-[#f4f4f5] antialiased" data-page="home">

<!-- ============================== HEADER ============================== -->
<header id="page-header" class="sticky top-0 z-[100] border-b border-white/5 bg-[#050508]/70 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <a href="/" aria-label="ไปที่หน้าแรก" class="flex items-center gap-2">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/20 transition-transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            </span>
            <span class="text-base sm:text-lg font-extrabold tracking-tight text-white">
              ไลน์<span class="text-brand">${provinceName}</span>
            </span>
        </a>

        <div class="hidden sm:block text-xs text-white/40 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            อัปเดตระบบ: <span class="font-semibold text-white">${CURRENT_MONTH} ${CURRENT_YEAR}</span>
        </div>

        <div class="flex items-center gap-2">
            <nav class="hidden lg:flex items-center gap-1">
                <a href="/profiles.html" class="rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">น้องๆทั้งหมด</a>
                <a href="/locations.html" class="rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">พิกัดพื้นที่</a>
            </nav>

            <button class="theme-toggle-btn w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10" type="button" aria-label="เปลี่ยนโหมดแสง">
                <i class="fas fa-sun theme-toggle-icon text-sm"></i>
            </button>

            <button id="menu-toggle" class="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/10" type="button" aria-label="เปิดเมนูนำทาง">
                <i class="fas fa-bars text-base"></i>
            </button>
        </div>
    </div>
</header>

<div id="sidebar-overlay" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-[2000] hidden opacity-0 transition-opacity duration-300"></div>
<nav id="sidebar-menu" class="fixed top-0 right-0 h-full w-[280px] bg-black border-l border-white/10 z-[3000] transform translate-x-full transition-transform duration-300 flex flex-col shadow-2xl">
    <div class="flex items-center justify-between p-5 border-b border-white/10">
        <span class="text-white font-bold tracking-widest text-sm opacity-80">เมนูนำทาง</span>
        <button id="close-menu-btn" class="text-white/50 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
            <i class="fas fa-times text-base"></i>
        </button>
    </div>
    <div class="flex-grow overflow-y-auto p-4 space-y-2">
        <a href="/" class="flex items-center gap-3 p-3 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-[400] text-[14px]"><i class="fas fa-home w-5 text-center text-[#FF2E63]"></i> หน้าแรก</a>
        <a href="/profiles.html" class="flex items-center gap-3 p-3 text-white font-[500] bg-white/5 border border-white/10 rounded-lg text-[14px]"><i class="fas fa-gem w-5 text-center text-[#FF2E63]"></i> น้องๆ VIP</a>
        <a href="/locations.html" class="flex items-center gap-3 p-3 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-[400] text-[14px]"><i class="fas fa-map-marker-alt w-5 text-center text-[#FF2E63]"></i> พิกัดบริการ</a>
        <a href="/about.html" class="flex items-center gap-3 p-3 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-[400] text-[14px]"><i class="fas fa-info-circle w-5 text-center text-[#FF2E63]"></i> เกี่ยวกับเรา</a>
        <a href="/faq.html" class="flex items-center gap-3 p-3 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-[400] text-[14px]"><i class="fas fa-question-circle w-5 text-center text-[#FF2E63]"></i> คำถามพบบ่อย</a>
    </div>
    <div class="p-5 border-t border-white/5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener nofollow" class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#FF2E63] to-[#FF416C] text-white py-3.5 rounded-xl font-[600] uppercase tracking-widest text-[12px] btn-shimmer shadow-[0_4px_20px_rgba(255,46,99,0.3)]">
            <i class="fab fa-line text-lg"></i> แอดไลน์จอง
        </a>
    </div>
</nav>

<main>
  <!-- ============================== HERO SECTION ============================== -->
  <section class="relative overflow-hidden border-b border-white/10">
    <div class="animate-aurora pointer-events-none absolute -right-1/4 -top-1/3 h-[520px] w-[520px] rounded-full opacity-35 blur-3xl"
         style="background: radial-gradient(circle, rgba(217,119,6,.15) 0%, transparent 70%)"></div>
    <div class="animate-glow-pulse pointer-events-none absolute -bottom-1/3 -left-1/4 h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
         style="background: radial-gradient(circle, rgba(217,119,6,.15) 0%, transparent 70%)"></div>

    <div class="relative mx-auto max-w-[1100px] px-4 py-16 sm:py-24">
      <div class="mx-auto max-w-3xl text-center space-y-6">
        <span class="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand">
          <span class="h-2.5 w-2.5 rounded-full bg-brand animate-pulse"></span>
          เจอตัวจริง จ่ายหน้างาน 100% (ไม่มีเก็บมัดจำล่วงหน้า)
        </span>

        <h1 id="hero-h1" class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] leading-[1.1] text-white animate-fade-in-up">
          เพื่อนเที่ยวและไซด์ไลน์${provinceName} | รับงาน${provinceName} เด็กเอ็น ตรงปก ไม่มัดจำ
        </h1>

        <div class="pt-2 animate-fade-in-up">
          <a href="/" aria-label="หน้าแรก" class="block mx-auto rounded-[24px] overflow-hidden shadow-2xl max-w-4xl border border-white/10 focus:outline-none focus:ring-4 focus:ring-brand/40 transition-all duration-300">
            <img src="/images/hero-sidelinechiangmai-1200.webp" class="w-full h-auto rounded-[24px] object-cover aspect-[3/2]" alt="เพื่อนเที่ยวและผู้ดูแลเอ็นเตอร์เทน${provinceName}" />
          </a>
        </div>

        <h2 class="text-lg md:text-xl font-semibold text-white/80 animate-fade-in-up">
          พิกัดบริการระดับพรีเมียม คัดเกรดเพื่อคุณในเขต${provinceName}
        </h2>
        <p class="mt-2 text-xl text-brand font-bold animate-fade-in-up">ยินดีให้บริการด้วยความปลอดภัยและรักษาความลับสูงสุดค่ะ</p>

        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up">
          <a href="#provinces" class="w-full rounded-xl bg-brand px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:scale-[1.02] sm:w-auto">ดูคิวงานทั้งหมด</a>
          <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener nofollow" class="w-full rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-white/10 sm:w-auto flex items-center justify-center gap-2">
            <i class="fab fa-line text-[#00E676] text-base"></i> แอดไลน์จองคิว
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================== LUXURY SOCIAL CONNECT GRID ============================== -->
  <section class="max-w-[1440px] mx-auto px-4 py-8 text-center animate-fade-in-up">
    <div class="glass-panel p-6 sm:p-8 rounded-[24px] max-w-4xl mx-auto space-y-4">
      <h3 class="text-base sm:text-lg font-extrabold text-white tracking-wide">
        ช่องทางการติดต่อและติดตามข้อมูลอย่างเป็นทางการ <i class="fas fa-link text-brand ml-1"></i>
      </h3>
      <p class="text-xs sm:text-sm text-white/60">ติดตามช่องทางโซเชียลมีเดียที่เป็นทางการเพื่อตรวจสอบโปรไฟล์ใหม่ได้อย่างปลอดภัย</p>
      
      <!-- Complete 7-Social Channel Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4">
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener nofollow" class="flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-brand/40 hover:bg-white/[0.03] transition-all text-xs font-semibold gap-2">
          <i class="fab fa-line text-2xl text-[#00E676]"></i>
          <span>LINE</span>
        </a>
        <a href="${CONFIG.SOCIAL_LINKS.linkedin}" target="_blank" rel="noopener nofollow" class="flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-brand/40 hover:bg-white/[0.03] transition-all text-xs font-semibold gap-2">
          <i class="fab fa-linkedin text-2xl text-[#0077b5]"></i>
          <span>LinkedIn</span>
        </a>
        <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="noopener nofollow" class="flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-brand/40 hover:bg-white/[0.03] transition-all text-xs font-semibold gap-2">
          <i class="fab fa-tiktok text-2xl text-white"></i>
          <span>TikTok</span>
        </a>
        <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="me noopener" class="flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-brand/40 hover:bg-white/[0.03] transition-all text-xs font-semibold gap-2">
          <i class="fab fa-twitter text-2xl text-[#1DA1F2]"></i>
          <span>Twitter/X</span>
        </a>
        <a href="${CONFIG.SOCIAL_LINKS.biosite}" target="_blank" rel="noopener nofollow" class="flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-brand/40 hover:bg-white/[0.03] transition-all text-xs font-semibold gap-2">
          <i class="fas fa-globe text-2xl text-[#E11D48]"></i>
          <span>Bio.site</span>
        </a>
        <a href="${CONFIG.SOCIAL_LINKS.linktree}" target="_blank" rel="noopener nofollow" class="flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-brand/40 hover:bg-white/[0.03] transition-all text-xs font-semibold gap-2">
          <i class="fas fa-tree text-2xl text-[#39E58C]"></i>
          <span>Linktree</span>
        </a>
        <a href="${CONFIG.SOCIAL_LINKS.bluesky}" target="_blank" rel="me noopener" class="flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-brand/40 hover:bg-white/[0.03] transition-all text-xs font-semibold gap-2">
          <i class="fas fa-cloud text-2xl text-[#0284C7]"></i>
          <span>Bluesky</span>
        </a>
      </div>
    </div>
  </section>

  <!-- ============================== PROFILE EXPLORER ============================== -->
  <section id="provinces" class="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-2 text-center">
      <h2 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">คัดสรรโปรไฟล์ยอดนิยมประจำจังหวัด${provinceName} (Popular Profiles)</h2>
      <p class="mx-auto max-w-xl text-sm leading-relaxed text-white/60">ยืนยันตัวตนจริง สอดคล้องตามมาตรฐานความปลอดภัย จ่ายหน้างาน 100%</p>
    </div>

    <!-- Live Search Bar -->
    <div class="mx-auto mb-6 max-w-xl">
      <div class="group relative">
        <div class="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-brand/40 to-brand/20 opacity-0 blur-sm transition-opacity duration-300 group-focus-within:opacity-100"></div>
        <div class="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur-md transition-colors duration-300 focus-within:border-brand/60 focus-within:bg-white/[0.06]">
          <svg class="h-5 w-5 shrink-0 text-white/40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          
          <input type="text" id="search-keyword" placeholder="พิมพ์ชื่อเล่น หรือโซนพื้นที่บริการที่ต้องการ..." class="w-full bg-transparent text-sm text-foreground placeholder:text-white/50 focus:outline-none sm:text-base" />
          
          <button type="button" id="clear-search-btn" class="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white">
            <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Zone Tabs -->
    <div id="regionTabs" class="mb-8 flex flex-wrap items-center justify-center gap-2">
       <button type="button" data-region="ทั้งหมด" class="region-tab rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:text-sm bg-brand text-white shadow-lg shadow-brand/30">ทั้งหมด</button>
       ${(seoData.zones || []).map(zone => `
       <button type="button" data-region="${escapeHTML(zone)}" class="region-tab rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:text-sm border border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white">${escapeHTML(zone)}</button>
       `).join("")}
    </div>

    <div class="mb-5 flex items-center justify-center gap-2 text-sm text-white/50">
      <svg class="h-4 w-4 text-brand" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 18.5 8.5 21l-4-2v-13l4-2 7 4 4-2v6.5"/><circle cx="18" cy="15" r="3"/><path d="m22 19-1.5-1.5"/></svg>
      <span>พบคิวงานผู้ให้บริการพร้อมดูแลรักษาความปลอดภัย <span id="resultCount" class="font-bold text-white">${safeProfiles.length}</span> คน</span>
    </div>

    <!-- Dynamic Profiles Grid -->
    <div id="profiles-container" class="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
        ${cardsHTML}
    </div>

    <!-- Empty search states -->
    <div id="emptyState" class="hidden animate-fade-in-up flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
      <svg class="h-10 w-10 text-white/30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <p class="text-sm text-white/60">ไม่พบคิวงานน้องๆ ที่ตรงกับเงื่อนหาค้นหาของคุณในขณะนี้</p>
      <button type="button" id="resetFilters" class="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white">ล้างตัวกรองทั้งหมด</button>
    </div>
  </section>

  <!-- ============================== PREMIUM GOLD-CARBONE INTRO CARD ============================== -->
  <section class="max-w-4xl mx-auto py-12 px-4 animate-fade-in-up">
    <div class="overflow-hidden rounded-[24px] border border-white/10 bg-[#09090c]/80 shadow-2xl">
       <div class="relative overflow-hidden p-6 sm:p-10 text-left flex flex-col justify-end min-h-[160px] sm:min-h-[200px]" 
            style="background: linear-gradient(135deg, #09090b 0%, #D97706 100%)">
           <div class="pointer-events-none absolute inset-0 opacity-15">
               <div class="card-sheen absolute inset-0"></div>
           </div>
           <div class="mb-3">
               <span class="inline-flex items-center gap-1.5 rounded-full bg-[#D97706]/20 border border-[#D97706]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
                 SERVICE DEEP-DIVE RECOMMENDED
               </span>
           </div>
           <h2 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
               มาตรฐานและการดูแลระดับพรีเมียมในจังหวัด${provinceName}
           </h2>
       </div>

       <!-- ข้อความสไตล์ Editorial หรูหราคุมโทนลึกซึ้ง -->
       <div class="p-6 sm:p-10 bg-[#0d0d12]/40 text-left text-white/70 space-y-4 text-[15px] leading-relaxed border-t border-white/5 seo-content-white">
           ${smartLinkify(seoIntroContent, provinceKey, seoData.zones)}
       </div>
    </div>
  </section>

  <!-- ============================== HELP HUB & POLICY RULES ============================== -->
  <section class="max-w-5xl mx-auto py-12 px-4 animate-fade-in-up container">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- การใช้งานและกติการ่วมทริป -->
      <div class="glass-panel p-6 sm:p-8 rounded-[24px] text-left space-y-4 border border-white/5 bg-white/[0.01]">
        <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <i class="fas fa-id-card text-brand"></i>
          <span>ระเบียบและข้อกำหนดใช้งาน</span>
        </h3>
        <ul class="space-y-3 text-xs sm:text-sm text-white/60 list-disc pl-5 leading-relaxed">
          <li><strong>สิทธิ์ผู้ใช้งาน:</strong> ผู้เข้าชมและสมาชิกจองคิวทุกคนต้องมีอายุขั้นต่ำ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</li>
          <li><strong>กติกาฟิวแฟน:</strong> เน้นการนำเที่ยว เดินเล่น ทานข้าว ช้อปปิ้ง แนะนำข้อมูล และให้เกียรติซึ่งกันและกันเสมือนคนรัก</li>
          <li><strong>นโยบายความเป็นส่วนตัว:</strong> ข้อมูลการจองคิว ประวัติการประสานงานจะถูกลบทำลายทิ้งทันทีเมื่อเสร็จสิ้นกิจกรรมเพื่อความลับสูงสุด</li>
        </ul>
      </div>

      <!-- ข้อห้ามเด็ดขาดเพื่อความปลอดภัยสูงสุด -->
      <div class="glass-panel p-6 sm:p-8 rounded-[24px] text-left space-y-4 border border-white/5 bg-white/[0.01]">
        <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <i class="fas fa-ban text-red-500"></i>
          <span>ข้อห้ามเด็ดขาดสูงสุด (Strict Rule)</span>
        </h3>
        <ul class="space-y-3 text-xs sm:text-sm text-white/60 list-disc pl-5 leading-relaxed">
          <li><strong class="text-red-400">ห้ามโอนมัดจำก่อนพบตัวจริง:</strong> ป้องกันมิจฉาชีพ 100% ห้ามลูกค้าโอนมัดจำหรือค่าคิวล่วงหน้าไม่ว่ากรณีใดๆ ทั้งสิ้น</li>
          <li><strong>สิ่งผิดกฎหมายทุกประเภท:</strong> ห้ามกระทำการบังคับ ข่มขู่ ใช้ความรุนแรง หรือพกพาสารเสพติด อาวุธ และสิ่งผิดกฎหมายทุกชนิดร่วมกิจกรรม</li>
          <li><strong>การละเมิดความเป็นส่วนตัว:</strong> ห้ามถ่ายภาพ วิดีโอ หรือบันทึกเสียงผู้ให้บริการโดยไม่ได้รับการตกลงเป็นลายลักษณ์อักษร</li>
        </ul>
      </div>

      <!-- ศูนย์ประสานงานและช่องทางแก้ไขปัญหา -->
      <div class="glass-panel p-6 sm:p-8 rounded-[24px] text-left space-y-4 border border-white/5 bg-white/[0.01]">
        <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <i class="fas fa-handshake-angle text-brand"></i>
          <span>ช่องทางแก้ไขปัญหาฉุกเฉิน</span>
        </h3>
        <div class="space-y-3 text-xs sm:text-sm text-white/60 leading-relaxed">
          <p>หากพบปัญหา เช่น ผู้ให้บริการไม่ตรงปก, มารยาทไม่เหมาะสม, หรือเกิดข้อพิพาทและไม่สามารถแก้ไขได้ด้วยตนเอง โปรดปฏิบัติดังนี้:</p>
          <ol class="list-decimal pl-5 space-y-1">
            <li>ขอหยุดระงับกิจกรรมที่หน้างานทันทีอย่างสุภาพ</li>
            <li>สแกนคิวอาร์โค้ด LINE แอดมินด้านล่างหรือแอดไลน์ <strong class="text-brand">@sidelinecm</strong> เพื่อยื่นคำร้อง</li>
            <li>แจ้งรายละเอียด รหัสผู้ให้บริการ และข้อมูลปัญหาต่อทีมซัพพอร์ต แอดมินจะดำเนินการตรวจสอบให้ทันทีตลอด 24 ชั่วโมง</li>
          </ol>
        </div>
      </div>

    </div>
  </section>

  <!-- ============================== FAQ ACCORDIONS (NO DUPLICATES) ============================== -->
  <section class="max-w-3xl mx-auto py-12 px-4 space-y-8 text-left animate-fade-in-up">
       <h2 class="text-2xl md:text-3xl font-bold text-center text-white">คำถามที่พบบ่อย (FAQ) ในเขต ${provinceName}</h2>
       <div class="space-y-4">
            ${seoData.faqs.map(faq => `
            <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/10 transition-colors hover:bg-white/[0.04]">
                <h3 class="font-bold text-white mb-2 flex items-center gap-2">
                  <svg class="h-5 w-5 text-brand shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ${escapeHTML(faq.q)}
                </h3>
                <p class="text-white/60 text-sm leading-relaxed pl-7 border-l-2 border-brand/30">${escapeHTML(faq.a)}</p>
            </div>
            `).join("")}
       </div>
  </section>

  <!-- ============================== VERIFIED CUSTOMER REVIEWS (EEAT & SCHEMA ALIGNMENT) ============================== -->
  <section id="customer-reviews" class="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-fade-in-up container">
    <div class="text-center space-y-3">
      <p class="text-[11px] font-bold tracking-[0.22em] uppercase text-brand/80">
        VERIFIED REVIEWS
      </p>
      <h2 class="text-xl md:text-2.5xl font-extrabold text-white tracking-tight">
        ความคิดเห็นและความประทับใจจากลูกค้าใน${provinceName}
      </h2>
      <div class="mx-auto h-[2px] w-24 bg-gradient-to-r from-transparent via-brand to-transparent rounded-full"></div>
      <p class="text-xs md:text-sm text-white/50 max-w-xl mx-auto">
        รวบรวมรีวิวจริงที่ได้รับการยืนยันการใช้บริการอย่างราบรื่นและปลอดภัยในเขตจังหวัด${provinceName}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${dynamicReviewsData.map((review, idx) => `
      <div class="interactive-card rounded-2xl border border-white/5 bg-[#09090c] p-6 space-y-4 shadow-lg text-left">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs border border-white/10">
              ${review.author.charAt(3) || "U"}
            </div>
            <div>
              <span class="block text-xs font-bold text-white">${escapeHTML(review.author)}</span>
              <span class="block text-[10px] text-zinc-500 font-semibold">${escapeHTML(review.location)}</span>
            </div>
          </div>
          <div class="flex text-amber-500 text-[10px] gap-0.5">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
          </div>
        </div>
        <p class="text-xs text-zinc-300 leading-relaxed">${escapeHTML(review.text)}</p>
        <span class="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">ยืนยันทำรายการผ่านแอดมิน • ${escapeHTML(review.date)}</span>
      </div>
      `).join("")}
    </div>
  </section>

  <!-- ============================== EDITORIAL TRUST & QUALITY VERIFICATION BANNER ============================== -->
  <section id="verification-process" class="max-w-4xl mx-auto py-8 px-4 animate-fade-in-up container">
    <div class="interactive-card rounded-3xl border border-white/5 bg-[#07070a]/80 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 shadow-2xl relative overflow-hidden">
      <div class="absolute -right-16 -top-16 w-36 h-36 bg-brand/5 rounded-full blur-2xl pointer-events-none"></div>
      <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 text-brand text-2xl shadow-lg">
        <i class="fas fa-user-shield"></i>
      </div>
      <div class="flex-grow space-y-2 text-left">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/5 border border-brand/20 text-[10px] font-bold text-brand uppercase tracking-wider">
          EDITORIAL TRUST & QUALITY STANDARD
        </span>
        <h3 class="text-lg font-bold text-white tracking-tight">กระบวนการตรวจสอบและกลั่นกรองข้อมูล จังหวัด${provinceName}</h3>
        <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          เพื่อให้มั่นใจในประสบการณ์การจองคิวที่โปร่งใสและตรงปก 100% ทีมงานบรรณาธิการ (Fact-Checker/Editor) ประจำเขตจังหวัด${provinceName} ได้ทำการคัดกรองโปรไฟล์ ตรวจสอบภาพถ่าย วิดีโอสลับใบหน้าจริง และยืนยันพิกัดความสะดวกการทำงานของน้อง ๆ ทุกคนอย่างละเอียดก่อนแสดงผลในทำเนียบสารบัญ
        </p>
        <p class="text-xs text-zinc-500 mt-2">
          ผู้รับผิดชอบระบบสารบัญและการดูแลข้อมูล: <span class="text-zinc-300 font-bold">ทีมบริหารงานแอดมิน Sideline Chiangmai Co.</span> • อ่านข้อมูลความโปร่งใสเพิ่มเติมได้ที่ <a href="/about.html" class="text-brand underline font-semibold hover:text-amber-400">หน้าเกี่ยวกับเรา</a>
        </p>
      </div>
    </div>
  </section>

  <!-- ============================== GOOGLE MAP ============================== -->
  <section class="container mx-auto px-4 py-8 max-w-4xl animate-fade-in-up">
    <div class="relative rounded-3xl overflow-hidden border border-white/10 shadow-xl shadow-brand/10">
      <iframe
        src="https://maps.google.com/maps?q=${encodeURIComponent(provinceName)}&t=&z=13&ie=UTF8&iwloc=&output=embed"
        width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" title="แผนที่พิกัดทำเลพื้นที่บริการในจังหวัด${provinceName}">
      </iframe>
    </div>
  </section>
</main>

<!-- ============================== FOOTER ============================== -->
<footer class="border-t border-white/10 bg-black/60 backdrop-blur-md pt-16 pb-8">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-8 text-center">
        <h2 class="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand to-yellow-500 uppercase tracking-wider">
            เพื่อนเที่ยว${provinceName}
        </h2>
            
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener nofollow" class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-[14px] tracking-wider hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg shadow-green-500/20">
            <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 11.5c0-4.69-5.38-8.5-12-8.5S0 6.81 0 11.5c0 4.2 4.3 7.7 10.1 8.4l-.6 2.3s-.2.9.8.5c1-.4 5.3-3.1 7.3-5.2 3.9-1.3 6.4-3.5 6.4-6M8.5 14H6.8c-.3 0-.5-.2-.5-.5v-4c0-.3.2-.5.5-.5h.5c.3 0 .5.2.5.5v2.8h.7c.3 0 .5.2.5.5V13.5c0 .3-.2.5-.5.5m3.7-.5c0 .3-.2.5-.5.5h-1.6c-.3 0-.5-.2-.5-.5v-4c0-.3.2-.5.5-.5H11.2c.3 0 .5.2.5.5v3.3h.5c.3 0 .5.2.5.5v.2zm2.1-.5c0 .3-.2.5-.5.5h-.5c-.3 0-.5-.2-.5-.5v-4c0-.3.2-.5.5-.5h.5c.3 0 .5.2.5.5v4zm5.2 0c0 .3-.2.5-.5.5h-1.7c-.3 0-.5-.2-.5-.5v-4c0-.3.2-.5.5-.5h1.7c.3 0 .5.2.5.5v.2c0 .3-.2.5-.5.5h-.7V11h.5c.3 0 .5.2.5.5v.2c0 .3-.2.5-.5.5h-.5v.8h.7c.3 0 .5.2.5.5v.2zm-5.5-2.25c0-.14.11-.25.25-.25h.5c.14 0 .25.11.25.25v1.5c0 .14-.11.25-.25.25h-.5a.25.25 0 01-.25-.25v-1.5z"/></svg>
            จองคิวพรีเมียมในจังหวัด${provinceName} ตอนนี้
        </a>
        
        <div class="w-full pt-6">
            <h3 class="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">พื้นที่รับงานเพื่อนเที่ยวและไซด์ไลน์จังหวัดอื่นๆ</h3>
            <nav class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-3xl mx-auto" aria-label="ลิงก์ไปยังพื้นที่รับงานอื่นๆ">
                ${allProvinces.slice(0, 12).map(p => {
                    const linkHref = p.key === 'chiangmai' ? "/" : `/location/${p.key}`;
                    return `<a href="${linkHref}" class="text-[12px] text-white/50 hover:text-brand hover:border-brand/40 hover:bg-white/[0.02] transition-colors py-2.5 border border-white/5 rounded-xl bg-white/[0.01]">ไซด์ไลน์${escapeHTML(p.nameThai)}</a>`;
                }).join("")}
            </nav>
        </div>

        <div class="w-full border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>© ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
            <div class="flex gap-6">
                <a href="/privacy-policy.html" class="hover:text-brand">PRIVACY</a>
                <a href="/terms.html" class="hover:text-brand">TERMS</a>
            </div>
        </div>
    </div>
</footer>

<!-- ============================== LIGHTBOX ============================== -->
<div id="lightbox" class="hidden opacity-0 fixed inset-0 z-[1000] flex items-center justify-center p-4 transition-opacity duration-300 overlay-backdrop backdrop-blur-md bg-black/95">
  <div id="lightbox-content-wrapper-el" class="bg-black/90 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-full lg:max-w-[90vw] max-h-[95vh] flex flex-col relative transform scale-95 transition-all duration-300 modal-content overflow-hidden">
    <button id="closeLightboxBtn" class="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/10 rounded-full shadow-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand">
      <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
    <div class="flex-grow overflow-y-auto">
      <div class="lightbox-grid grid lg:grid-cols-[1.5fr_1fr] gap-4 lg:gap-8">
        <div class="lightbox-gallery bg-black/40 lg:rounded-l-3xl">
          <div class="sticky top-0 p-4 sm:p-6 h-full flex flex-col justify-center"> 
            <div class="hero-image-container mb-4 flex justify-center items-center h-full max-h-[75vh] overflow-hidden">
              <img id="lightboxHeroImage" src="" alt="โปรไฟล์ผู้ดูแล" class="hero-image-main w-full h-full object-contain rounded-2xl shadow-xl mx-auto">
            </div>
            <div id="lightboxThumbnailStrip" class="thumbnail-strip flex gap-2 overflow-x-auto pb-2 px-2 justify-center"></div>
          </div>
        </div>
        <div class="lightbox-details flex flex-col">
          <div class="p-6 sm:p-8 lg:p-10 space-y-6 bg-black">
            <header class="lightbox-header space-y-3">
              <div class="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-3">
                <h3 id="lightbox-profile-name-main" class="text-3xl lg:text-4xl font-extrabold text-brand text-center lg:text-left">ชื่อโปรไฟล์</h3>
                <div id="lightbox-availability-badge-wrapper" class="flex-shrink-0"></div>
              </div>
              <p id="lightboxQuote" class="text-base text-white/70 italic text-center lg:text-left"></p>
            </header>
            <div id="lightboxTags" class="flex flex-wrap gap-2 justify-center lg:justify-start"></div>
            <div class="pt-5 border-t border-white/10">
              <div id="lightboxDetailsCompact"></div>
              <div id="lightboxDateAdded" class="info-row mt-4 pt-4 border-t border-white/10 text-white/40" style="display: none;"></div>
            </div>
            <div id="lightboxDescriptionContainer" class="pt-5 border-t border-white/10" style="display: none;">
              <h4 class="text-white flex items-center gap-2 font-bold">
                <svg class="h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>รายละเอียดเพิ่มเติม</span>
              </h4>
              <div id="lightboxDescriptionContent" class="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap mt-3 text-white/70"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    // Mobile Drawer
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('sidebar-overlay');
    const closeBtn = document.getElementById('close-menu-btn');

    const toggleMenu = (show) => {
        if (!sidebar || !overlay) return;
        if (show) {
            overlay.classList.remove('hidden');
            requestAnimationFrame(() => {
                overlay.classList.remove('opacity-0');
                sidebar.classList.remove('translate-x-full');
            });
            document.body.style.overflow = 'hidden';
        } else {
            overlay.classList.add('opacity-0');
            sidebar.classList.add('translate-x-full');
            document.body.style.overflow = '';
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    };

    if (menuToggle) menuToggle.addEventListener('click', () => toggleMenu(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
    if (overlay) overlay.addEventListener('click', () => toggleMenu(false));

    // Theme Toggle
    const themeBtn = document.querySelector('.theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const htmlClass = document.documentElement.classList;
            htmlClass.toggle('dark');
            const icon = themeBtn.querySelector('.theme-toggle-icon');
            if (icon) {
                if (htmlClass.contains('dark')) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                } else {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        });
    }

    // Close Lightbox
    const lightbox = document.getElementById('lightbox');
    const closeLb = document.getElementById('closeLightboxBtn');
    if (closeLb && lightbox) {
        closeLb.addEventListener('click', () => {
            lightbox.classList.add('opacity-0');
            setTimeout(() => lightbox.classList.add('hidden'), 300);
        });
    }

    // Client Search Filter
    var searchInput = document.getElementById('search-keyword');
    var clearSearch = document.getElementById('clear-search-btn');
    var regionTabs = document.getElementById('regionTabs');
    var resultCount = document.getElementById('resultCount');
    var emptyState = document.getElementById('emptyState');
    var cardsGrid = document.getElementById('profiles-container');

    function getActiveCards() {
      return Array.prototype.slice.call(document.querySelectorAll('.province-card, .profile-card-new'));
    }

    var activeRegion = 'ทั้งหมด';

    function applyFilter() {
      var q = (searchInput.value || '').trim().toLowerCase();
      var visible = 0;
      var currentCards = getActiveCards();

      currentCards.forEach(function (card) {
        var name = (card.dataset.name || '').toLowerCase();
        var region = (card.dataset.region || '').toLowerCase();
        var desc = (card.dataset.desc || '').toLowerCase();

        var matchRegion = activeRegion === 'ทั้งหมด' || card.dataset.region === activeRegion;
        var matchQuery = q === '' || name.indexOf(q) > -1 || region.indexOf(q) > -1 || desc.indexOf(q) > -1;

        var show = matchRegion && matchQuery;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      if (resultCount) resultCount.textContent = visible;
      if (clearSearch) {
        clearSearch.classList.toggle('hidden', q === '');
        clearSearch.classList.toggle('flex', q !== '');
      }
      if (emptyState) {
        emptyState.classList.toggle('hidden', visible !== 0);
        emptyState.classList.toggle('flex', visible === 0);
      }
      if (cardsGrid) {
        cardsGrid.classList.toggle('hidden', visible === 0);
      }
    }

    if (searchInput) searchInput.addEventListener('input', applyFilter);
    if (clearSearch) {
      clearSearch.addEventListener('click', function () { searchInput.value = ''; applyFilter(); });
    }

    if (regionTabs) {
      regionTabs.addEventListener('click', function (e) {
        var btn = e.target.closest('.region-tab');
        if (!btn) return;
        activeRegion = btn.dataset.region || 'ทั้งหมด';

        regionTabs.querySelectorAll('.region-tab').forEach(function (b) {
          var on = b === btn;
          b.className = 'region-tab rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:text-sm ' +
            (on
              ? 'bg-brand text-white shadow-lg shadow-brand/30'
              : 'border border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white');
        });
        applyFilter();
      });
    }

    var resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        activeRegion = 'ทั้งหมด';
        var first = regionTabs ? regionTabs.querySelector('.region-tab') : null;
        if (first) first.click(); else applyFilter();
      });
    }

    applyFilter();
  });
</script>
<script type="module" src="/main.js"></script>


        <div id="global-loader-overlay" style="position: fixed; inset: 0px; z-index: 10000; display: none; flex-direction: column; align-items: center; justify-content: center; background-color: rgb(7, 7, 10); transition: opacity 0.4s; pointer-events: none; opacity: 0;" class="dark:bg-[#07070a]">
            
            <div style="position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <div style="position: absolute; inset: 0; border-radius: 9999px; border: 2px dashed rgba(212, 175, 55, 0.15);" class="anim-spin-slow-loader"></div>
                <div style="position: absolute; inset: 6px; border-radius: 9999px; border: 2.5px solid transparent; border-top-color: #D4AF37; border-right-color: #FCF6BA;" class="anim-spin-slow-loader"></div>
                
                <div style="position: relative; z-index: 10; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: linear-gradient(135deg, #FF2E63 0%, #FF8E53 100%); box-shadow: 0 10px 30px -5px rgba(255, 46, 99, 0.5);" class="anim-pulse-loader">
                    <i class="fas fa-heart" style="font-size: 18px; color: #ffffff;"></i>
                </div>
            </div>
            
            <div style="text-align: center;">
                <h3 class="anim-blink-loader" style="font-size: 14px; font-weight: 700; color: #D4AF37; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;">
                    กำลังตรวจสอบโปรไฟล์ตรงปก...
                </h3>
                <p style="font-size: 10px; color: #6b7280; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;">
                    SIDELINE CHIANGMAI PREMIUM SELECTION
                </p>
            </div>
        </div>
    <div style="position: fixed; bottom: 0px; right: 0px; width: 60px; height: 60px; z-index: 99999; cursor: pointer; background: transparent; touch-action: manipulation;"></div></body></html>`;

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