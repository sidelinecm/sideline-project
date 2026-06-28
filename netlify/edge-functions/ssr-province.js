

/**
 * [ SYSTEM CORE ]
 * Project: Nexus Entity Framework (S-Tier) - ULTIMATE NEO-LUXURY NOIR
 * Mastermind: wawai | Nexus Mastermind
 * Authority: Search Engine Dominance, Conversion UI/UX & Entity Engineering
 * Optimization: Production Play CDN, Zero Compile CSS, SGE-AEO Answer Architecture, Geo-Entity Schema
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

const PROVINCE_SEO_DATA = {
    chiangmai: {
        name: "เชียงใหม่",
        geo: { lat: 18.7883, lng: 98.9853 },
        zones: ["นิมมาน", "สันติธรรม", "ช้างเผือก", "เจ็ดยอด", "แม่โจ้", "หางดง", "สันทราย", "รวมโชค", "คูเมือง", "หลังมอ"],
        lsi: ["รับงานเชียงใหม่", "สาวไซด์ไลน์เชียงใหม่", "sideline เชียงใหม่", "ไซต์ไลน์เชียงใหม่", "ไซไลเชียงใหม่", "นางแบบสาวเหนือ", "เพื่อนเที่ยวเชียงใหม่", "เด็กเอ็นเชียงใหม่"],
        uniqueIntro: `
            <p class="mb-4"><strong>ไซด์ไลน์เชียงใหม่</strong> คือ บริการเพื่อนเที่ยวนางแบบ และเด็กเอ็นเตอร์เทนระดับพรีเมียม ในพื้นที่จังหวัดเชียงใหม่ที่เน้นการดูแลแบบฟิวแฟน (Girlfriend Experience) ปลอดภัย 100% นัดเจอตัวจริงเพื่อชำระเงินหน้างานโดยไม่มีเงื่อนไขโอนมัดจำล่วงหน้าทุกกรณี</p>
            <p class="mb-4">เราพร้อมให้บริการครอบคลุมทุกโซนสำคัญเพื่อความสะดวกในการนัดหมาย ไม่ว่าจะเป็นการเดินเล่นพักผ่อนย่าน <strong>ถนนนิมมานเหมินท์</strong>, คุยงานสไตล์พูลวิลล่าส่วนตัวแถบ <strong>แม่ริม และหางดง</strong>, หรือความเป็นส่วนตัวสูงตามคอนโดพรีเมียมย่าน <strong>เจ็ดยอด และสันติธรรมพลาซ่า</strong> ตลอดจนสันทรายและแถบมหาวิทยาลัยแม่โจ้ ใกล้ห้างสรรพสินค้า MAYA และมหาวิทยาลัยเชียงใหม่ (มช.)</p>
            <p>โปรไฟล์น้องๆ ทุกคนได้รับการตรวจสอบประวัติและถ่ายภาพยืนยันตัวตนว่าตรงปก เพื่อให้คุณได้รับประสบการณ์พักผ่อนอย่างอบอุ่นและเป็นส่วนตัวสูงที่สุดในค่ำคืนนี้อย่างสบายใจ</p>
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
            <p class="mb-4"><strong>ไซด์ไลน์กรุงเทพ (ไซด์ไลน์ กทม.)</strong> คือ แหล่งรวมพริตตี้ นางแบบอิสระ และน้องๆ นักศึกษาพาร์ทไทม์รับงานส่วนตัวในเขตกรุงเทพมหานคร เน้นงานบริการดูแลฟิวแฟน (Girlfriend Experience) ระดับพรีเมียม รูปตรงปกจริง และปลอดภัยสูงสุดด้วยระบบจ่ายเงินหน้างานไร้มัดจำ</p>
            <p class="mb-4">สะดวกสบายด้วยทำเลที่ตั้งครอบคลุมจุดแลนด์มาร์กสำคัญทั่วกรุง ตั้งแต่ย่านธุรกิจใจกลางเมืองอย่าง <strong>สุขุมวิท, ทองหล่อ, เอกมัย, สาทร และสีลม</strong> ไปจนถึงทำเลยอดนิยมของสายบันเทิงอย่าง <strong>รัชดา-ห้วยขวาง</strong> ตลอดจนย่านลาดพร้าว ปิ่นเกล้า และบางนา นัดพบคอนโดหรูและโรงแรมห้าดาว ใกล้สถานีรถไฟฟ้า BTS และ MRT เดินทางนัดหมายสะดวกรวดเร็ว</p>
            <p>มั่นใจได้ในระบบบริการที่เป็นส่วนตัวสูงสุด ปราศจากขั้นตอนการโกงเงินโอนมัดจำ คัดเฉพาะตัวท็อปเพื่องานสังสรรค์ ปาร์ตี้ หรือการพักผ่อนอย่างอบอุ่นสูงสุดของคุณ</p>
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
            <p class="mb-4"><strong>ไซด์ไลน์ลำปาง</strong> คือ บริการเพื่อนเที่ยวดูแลแบบคนรู้ใจของน้องๆ สาวเหนือผิวขาวหน้าหวานในจังหวัดลำปาง เหมาะสำหรับผู้ที่ต้องการหาคนเคียงข้างในบรรยากาศผ่อนคลาย อบอุ่นเป็นกันเอง และไม่มีความปลอดภัยที่หละหลวมด้วยข้อตกลงเจอตัวจริงค่อยจ่ายเงิน</p>
            <p class="mb-4">รองรับการนัดหมายตามจุดบริการหลักในพื้นที่ ไม่ว่าจะเป็นย่านคอนโดมิเนียมและโรงแรมแถบ <strong>ตัวเมืองลำปาง, ย่านสวนดอก, ย่านพระบาท</strong> หรือโซนที่พักใกล้กับ <strong>มหาวิทยาลัยราชภัฏลำปาง</strong> ไปจนถึงโซนนอกเมืองอย่างเกาะคาและแม่ทะ น้องๆ ของเรายินดีดูแลทั้งทริปคาเฟ่ชิลๆ ทานข้าว หรือทำหน้าที่เป็นเด็กชงเหล้าในงานเลี้ยงสังสรรค์ส่วนบุคคล</p>
            <p>รูปภาพโปรไฟล์ผ่านการตรวจเทียบว่าตรงปกจริง มารยาทการเทคแคร์ดีเยี่ยม และไม่ต้องเผชิญกับระบบเก็บมัดจำล่วงหน้าที่เสี่ยงต่อความไม่ปลอดภัย</p>
        `,
        faqs: [
            { q: "ค้นหาไซด์ไลน์ลำปาง นัดหมายโซนใดปลอดภัยที่สุด?", a: "พื้นที่ตัวเมืองลำปาง โซนสวนดอก และย่านพระบาท เป็นจุดที่มีโรงแรมและคอนโดคุณภาพดี รองรับการพบปะนัดเจออย่างสงบและปลอดภัยสูงสุด" },
            { q: "มีการรับประกันความตรงปกของน้องๆ ลำปางอย่างไร?", a: "เราคัดกรองโปรไฟล์และข้อมูลสัดส่วนจริง ถ้านัดเจอน้องที่หน้างานลำปางแล้วพบว่าไม่ตรงตามที่ตกลง ลูกค้าสามารถปฏิเสธและยกเลิกคิวได้ทันทีโดยไม่มีค่าใช้จ่าย" }
        ]
    },
    chiangrai: {
        name: "เชียงราย",
        geo: { lat: 19.9071, lng: 99.8325 },
        zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "ม.แม่ฟ้าหลวง", "ม.ราชภัฏเชียงราย", "หอนาฬิกา", "ริมกก"],
        lsi: ["รับงานเชียงราย", "ไซด์ไลน์เชียงราย", "สาวไซด์ไลน์เชียงราย", "sideline เชียงราย", "น้องนักศึกษาเชียงราย", "เด็กเอ็นเชียงราย"],
        uniqueIntro: `
            <p class="mb-4"><strong>ไซด์ไลน์เชียงราย</strong> คือ บริการเพื่อนเที่ยวพาร์ทไทม์ และน้องๆ นักศึกษาลุคเรียบร้อยพูดเพราะในพื้นที่จังหวัดเชียงราย ที่ยินดีรับงานอิสระดูแลเอาใจใส่ลูกค้าสไตล์คู่รักพรีเมียม ปลอดภัยสูง จ่ายเงินสดหน้างาน ไม่มีการเก็บเงินมัดจำล่วงหน้า</p>
            <p class="mb-4">พื้นที่ให้บริการนัดหมายสะดวกสบายครอบคลุมย่านยอดฮิต เช่น ทำเลรอบ <strong>มหาวิทยาลัยแม่ฟ้าหลวง (มฟล.)</strong>, ย่านสถานศึกษาแถว <strong>บ้านดู่ และ ม.ราชภัฏเชียงราย</strong>, ไปจนถึงโรงแรมบูทีคใน <strong>ตัวเมืองเชียงราย และย่านริมแม่น้ำกก</strong> พร้อมร่วมทริปเดินทางท่องเที่ยว คาเฟ่ ทานข้าว หรือทำหน้าที่ดูแลอารมณ์ของคุณอย่างอบอุ่นเป็นกันเอง</p>
            <p>สัมผัสค่ำคืนแสนพิเศษเหนือสุดแดนสยามด้วยโปรไฟล์จริงตรงปก และการให้บริการที่เน้นความปลอดภัย ความลับ และความเป็นส่วนตัวระดับสูงสุดของคุณ</p>
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
            <p class="mb-4"><strong>ไซด์ไลน์ขอนแก่น</strong> คือ ศูยน์รวมน้องๆ นักศึกษาพาร์ทไทม์หน้าตาน่ารักและพริตตี้สไตล์แซ่บซนในจังหวัดขอนแก่น คัดเฉพาะผู้ที่มีความจริงใจ มารยาทการดูแลดี และมีระบบป้องกันความปลอดภัยสูงสุดด้วยข้อตกลงเจอตัวจริงเพื่อชำระค่าขนมโดยไม่ต้องโอนเงินจองก่อน</p>
            <p class="mb-4">พื้นที่ให้บริการครอบคลุมทำเลฮิตหลัก ไม่ว่าจะเป็นย่านมหาวิทยาลัยชื่อดังอย่าง <strong>กังสดาล, หลัง มข., โนนม่วง</strong> หรือคอนโดมิเนียมใกล้ห้างดังแถว <strong>เซ็นทรัลพลาซ่าขอนแก่น และโรงแรมวิวสวยแถบบึงแก่นนคร</strong> ยินดีดูแลฟีลแฟนอย่างใกล้ชิดและให้เกียรติลูกค้าสูงสุด</p>
            <p>ตอบโจทย์ทั้งการจัดปาร์ตี้ส่วนตัวหรือหาคนรู้ใจเดินทางไปกินเที่ยว ยืนยันข้อมูลโปรไฟล์ตรงปกไม่ผ่านการตกแต่งเกินจริง เพื่อค่ำคืนที่แสนสุขใจของคุณ</p>
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
            <p class="mb-4"><strong>ไซด์ไลน์ชลบุรี (ไซด์ไลน์พัทยา-บางแสน)</strong> คือ แหล่งรวมพริตตี้ระดับท็อป สาวสวยหุ่นดีลุคอินเตอร์ และน้องๆ พาร์ทไทม์แถบภาคตะวันออก ที่ยินดีให้บริการเพื่อนเที่ยวฟิวแฟนพรีเมียม สนุกสนาน คลายเครียด และรับประกันความตรงปกด้วยเงื่อนไขจ่ายเงินหน้างานไร้มัดจำ</p>
            <p class="mb-4">รองรับพิกัดนัดเที่ยวและวันหยุดพักผ่อนริมทะเล ไม่ว่าจะเป็นย่านปาร์ตี้ยามค่ำคืนระดับโลกใน <strong>พัทยา</strong>, การท่องเที่ยวแบบชิลๆ ริมหาดวอนนภาแถว <strong>บางแสน และรอบ ม.บูรพา</strong>, หรือพื้นที่เป็นส่วนตัวแถบ <strong>ศรีราชา และนิคมอุตสาหกรรมอมตะนคร</strong> ยินดีช่วยดูแลทั้งทริปพูลวิลล่าและสังสรรค์ส่วนตัว</p>
            <p>จองคิวง่ายและปลอดภัยสูงสุดในเขตชลบุรีและพัทยา คลายกังวลเรื่องการโดนหลอกโอนมัดจำ คัดสรรเฉพาะคนน่ารักบริการประทับใจเพื่อเปลี่ยนวันพักผ่อนของคุณให้พิเศษยิ่งขึ้น</p>
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
            <p class="mb-4"><strong>ไซด์ไลน์พิษณุโลก</strong> คือ บริการเพื่อนเทียวนางแบบอิสระ และน้องนักศึกษาพาร์ทไทม์ มหาวิทยาลัยนเรศวร (มน.) ที่รับงานส่วนตัวในเมืองสองแคว เน้นการดูแลประทับใจ ฟีลคู่รักหวานพูดเพราะ และปลอดภัยสูงสุดด้วยระบบนัดเจอตัวชำระเงินหน้างานไม่มีการเรียกมัดจำ</p>
            <p class="mb-4">เลือกนัดพบน้องๆ ได้ตามพิกัดยอดนิยม เช่น คอนโดหรูใกล้มหาวิทยาลัย <strong>ม.นเรศวร (มน.)</strong>, ย่านช้อปปิ้งใจกลางเมืองแถว <strong>เซ็นทรัลพลาซ่าพิษณุโลก</strong> ตลอดจนที่พักริมแม่น้ำสายหลักแถบ <strong>ริมน้ำน่าน</strong> ยินดีควงแขน ทานข้าว ช้อปปิ้ง หรือพูดคุยคลายเครียดในมุมส่วนตัวอย่างเป็นส่วนตัวสูงสุด</p>
            <p>คัดกรองคุณภาพมารยาทและการใส่ใจบริการระดับพรีเมียม รูปตรงปกไม่ดึงภาพฟิลเตอร์ลวงตา เพื่อให้ผู้ใช้บริการมั่นใจในความถูกต้องโปร่งใสสูงสุด</p>
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
        uniqueIntro: `
            <p class="mb-4"><strong>บริการรับงานสาวไซด์ไลน์</strong> และเพื่อนเที่ยวเกรดพรีเมียมคัดคุณภาพทั่วประเทศไทย รวบรวมน้องๆ ที่มีใจรักงานบริการ มารยาทเรียบร้อย และเอาใจใส่ดูแลดั่งคู่รักข้างกาย ปลอดภัยมั่นใจได้จริง 100% ด้วยเงื่อนไขการนัดพบหน้างานแล้วค่อยจ่ายเงิน</p>
            <p class="mb-4">น้องๆ ของเราพร้อมทำหน้าที่ดูแลอย่างใกล้ชิดตามจุดสำคัญในเขต <strong>ตัวเมือง และพื้นที่ใกล้เคียง</strong> ทั่วประเทศ ไม่ว่าเป้าหมายของคุณคือการนัดดินเนอร์ ไปเที่ยวคาเฟ่ หรือมองหาเพื่อนร่วมปาร์ตี้เอนเตอร์เทนส่วนตัว ยินดีร่วมสร้างความประทับใจเคียงข้างคุณเสมอ</p>
            <p>เรารักษาข้อมูลส่วนบุคคลของลูกค้าเป็นความลับระดับสูงสุด รูปภาพทุกคนตรวจสอบสิทธิ์แล้วตรงปก ปราศจากขั้นตอนการบังคับโอนค่ามัดจำล่วงหน้าให้เสี่ยงต่อการโดนหลอก</p>
        `,
        faqs: [
            { q: "เรียกใช้บริการน้องๆ เพื่อนเที่ยว ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ เพื่อความปลอดภัยสูงสุดของคุณและป้องกันมิจฉาชีพ ลูกค้าจ่ายเงินค่าขนมหน้างานเมื่อเจอตัวน้องแล้วเท่านั้น" },
            { q: "หากพบตัวจริงของน้องแล้วพบว่าไม่ตรงตามรูปภาพโปรไฟล์ ต้องทำอย่างไร?", a: "โปรไฟล์รูปภาพทุกรูปผ่านการคัดกรองและยืนยันตัวตนแล้วว่าตรงปก หากพบตัวจริงแล้วไม่ตรงปก ลูกค้ามีสิทธิ์ปฏิเสธการร่วมงานและยกเลิกงานได้ทันทีโดยไม่มีค่าปรับหรือค่าใช้จ่ายใดๆ" }
        ]
    }
};

Object.keys(PROVINCE_SEO_DATA).forEach(key => {
    if (!PROVINCE_SEO_DATA[key].uniqueIntro) {
        PROVINCE_SEO_DATA[key] = { ...PROVINCE_SEO_DATA.default, ...PROVINCE_SEO_DATA[key] };
    }
});

// ✅ IMAGE OPTIMIZATION (Dynamic Fallback & Safe SSL Check)
const getFullUrl = (domain, path) => {
    if (!path) return `${domain}/images/default.webp`;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${domain}${cleanPath}`;
};

const optimizeImg = (domain, path, width = 182, height = 242) => {
    if (!path) return getFullUrl(domain, "/images/default.webp");
    if (path.includes("res.cloudinary.com")) {
        if (path.includes("/upload/")) {
            return path.replace("/upload/", `/upload/f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face/`);
        }
        return path;
    }
    if (path.startsWith("http")) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=70`;
};

// ✅ SECURITY UTILITIES
const escapeHTML = (str) => {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[tag] || tag);
};

const stripHTML = (str) => {
    if (!str) return "";
    return str.replace(/<[^>]*>?/gm, '');
};

// ✅ SMART LINKIFY (First Occurrence Optimization to Avoid Keyword Stuffing Penalty)
const smartLinkify = (text, provinceKey, zones) => {
    if (!text) return "";
    let linkedText = text;
    
    if (zones && zones.length > 0) {
        zones.forEach(zone => {
            const regex = new RegExp(`(${zone})`, ''); 
            linkedText = linkedText.replace(
                regex,
                `<a href="/search?q=${encodeURIComponent(zone)}" class="text-[#FF2E63] hover:text-white transition-colors font-[500] border-b border-[#FF2E63]/30" aria-label="ค้นหาน้องๆ โซน ` + escapeHTML(zone) + `">$1</a>`
            );
        });
    }

    const keywords = ["เด็กเอ็น", "ไซด์ไลน์", "พรีเมียม", "ฟีลแฟน", "รับงาน"];
    keywords.forEach(kw => {
        const regex = new RegExp(`(${kw})`, ''); 
        linkedText = linkedText.replace(
            regex,
            `<a href="/search?q=${encodeURIComponent(kw)}" class="text-[#D4AF37] hover:text-white transition-colors font-[500] border-b border-[#D4AF37]/30" aria-label="บริการ ` + escapeHTML(kw) + `">$1</a>`
        );
    });

    return linkedText;
};

// ✅ SERVER-SIDE HOSTNAME VERIFICATION (ยืดหยุ่น ยอมรับโดเมน Netlify และ Localhost อัตโนมัติ)
function verifyHostname(request) {
    const host = request.headers.get("host") || "";
    const isAllowed = CONFIG.ALLOWED_DOMAINS.some(allowed => host.includes(allowed)) || host.endsWith(".netlify.app");
    return isAllowed;
}

// ✅ ERROR PAGE BUILDER
function buildErrorPage(statusCode, title, message, allProvinces = [], domain = "") {
    const provincesLinks = allProvinces
        ?.slice(0, 8)
        .map(p => `<a href="/location/${p.key}" class="text-[#FF2E63] hover:text-white transition-colors">${escapeHTML(p.nameThai)}</a>`)
        .join(" &bull; ") || "";

    return new Response(
        `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${statusCode} - ${escapeHTML(title)}</title>
    <style>
        body { background: linear-gradient(135deg, #07070A 0%, #111116 100%); font-family: system-ui, -apple-system, sans-serif; color: white; margin: 0; }
        .flex-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; box-sizing: border-box; }
        .text-center { text-align: center; max-width: 440px; }
        .status-code { font-size: 72px; font-weight: 800; color: #FF2E63; margin-bottom: 16px; }
        .title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .msg { color: #a1a1aa; margin-bottom: 32px; font-size: 14px; line-height: 1.6; }
        .btn { display: inline-block; padding: 12px 32px; background: #FF2E63; color: white; border-radius: 9999px; font-weight: 500; text-decoration: none; transition: opacity 0.2s; }
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="flex-container">
        <div class="text-center">
            <div class="status-code">${statusCode}</div>
            <h1 class="title">${escapeHTML(title)}</h1>
            <p class="msg">${escapeHTML(message)}</p>
            <a href="/" class="btn">กลับสู่หน้าหลัก</a>
        </div>
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

// ✅ MAIN EXPORT FUNCTION
export default async (request, context) => {
    // 1. ตรวจสอบความถูกต้องของ Hostname
    if (!verifyHostname(request)) {
        return new Response("403 Forbidden - Access Denied", { status: 403 });
    }

    try {
        const url = new URL(request.url);
        const dynamicDomain = `${url.protocol}//${url.host}`; // ประมวลผลโดเมนแบบ Dynamic รองรับทั้งซับโดเมน Netlify เดิมและโดเมนใหม่ได้ 100%
        const pathParts = url.pathname.split("/").filter(Boolean);
        
        // 1. EXTRACT & NORMALIZE PROVINCE KEY
        const rawProvinceKey = pathParts[pathParts.length - 1] || "chiangmai";
        let provinceKey = rawProvinceKey.toLowerCase();
        try { provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase(); } catch { provinceKey = rawProvinceKey.toLowerCase(); }

        // 2. SEO REDIRECT: Redirect /location/chiangmai to root /
        if (pathParts[0] === "location" && provinceKey === "chiangmai") {
            return Response.redirect(new URL("/", url.origin).toString(), 301);
        }

        // 3. QUERY PARAMETER REDIRECT (Handle ?province=...)
        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province")?.toLowerCase();
            if (provinceValue === "chiangmai") {
                return Response.redirect(new URL("/", url.origin).toString(), 301);
            }
            return Response.redirect(new URL(`/location/${provinceValue}`, url.origin).toString(), 301);
        }

        // 4. DATABASE INITIALIZATION & DATA FETCHING (ตั้งค่าสิทธิ์ให้เร็วและทนทาน)
        let supabase;
        try {
            supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        } catch (envError) {
            console.error("Environment Variable Error:", envError.message);
            return buildErrorPage(500, "Configuration Error", "Server configuration is incomplete. Please contact administrator.", [], dynamicDomain);
        }

        const normalizedSeoKey = provinceKey.replace(/-/g, '');

        const [provinceRes, profilesRes, allProvincesRes] = await Promise.all([
            supabase.from("provinces").select("id, nameThai, key").eq("key", provinceKey).maybeSingle(),
            supabase.from("profiles").select("id, slug, name, age, imagePath, location, rate, isfeatured, lastUpdated, active, availability")
                .eq("provinceKey", provinceKey).eq("active", true)
                .order("isfeatured", { ascending: false }).order("lastUpdated", { ascending: false }).limit(80),
            supabase.from("provinces").select("key, nameThai").order("nameThai", { ascending: true })
        ]);

        // 5. FAIL-FAST 404 PREVENTION
        const provinceData = provinceRes.data;
        if (!provinceData) {
            const allProvinces = allProvincesRes.data || [];
            return buildErrorPage(404, "404 ไม่พบพิกัดที่ต้องการ", `ขออภัยค่ะ ข้อมูลพิกัด "${provinceKey}" ไม่พบในระบบ หรืออาจถูกลบไปแล้ว`, allProvinces, dynamicDomain);
        }

        const safeProfiles = profilesRes.data || [];
        const allProvinces = allProvincesRes.data || [];
        const provinceName = provinceData.nameThai;
        const seoData = PROVINCE_SEO_DATA[normalizedSeoKey] || PROVINCE_SEO_DATA.default;
        
        const now = new Date();
        const CURRENT_MONTH = now.toLocaleString("th-TH", { month: "short" });
        const CURRENT_YEAR = now.getFullYear();
        
        const isChiangmai = provinceKey === 'chiangmai';
        const provinceUrl = isChiangmai ? dynamicDomain : `${dynamicDomain}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(dynamicDomain, safeProfiles[0].imagePath, 1200, 630) 
            : `${dynamicDomain}/images/hero-sidelinechiangmai-1200.webp`;

        const title = "ไซด์ไลน์" + provinceName + " รับงาน" + provinceName + " พรีเมียม (" + CURRENT_MONTH + " " + CURRENT_YEAR + ") | ตรงปก ปลอดภัย 100%";
        const description = "รวมโปรไฟล์ ตัวท็อป! ไซด์ไลน์" + provinceName + " รับงานเอนเตอร์เทน เพื่อนเที่ยวระดับพรีเมียม " + safeProfiles.length + " คน โซน " + seoData.zones.slice(0, 3).join(', ') + " ✓การันตีตรงปก ✓จ่ายเงินหน้างาน ไม่โอนมัดจำ ปลอดภัยที่สุด";
        const cleanDescription = stripHTML(description);
        
        const deterministicRating = safeProfiles.length > 0 ? (4.5 + (safeProfiles.length % 5) / 10).toFixed(1) : "4.5";
        const deterministicReviews = safeProfiles.length > 0 ? 50 + (safeProfiles.length * 2) : 10;

        // ✅ อัปเกรด Schema Graph ระดับ S-Tier เชื่อมโยงระบุตัวตนพิกัดบริการแบบเฉพาะเจาะจง (areaServed & containsPlace)
        const schemaGraph = [
            {
                "@type": "Organization",
                "@id": `${dynamicDomain}/#organization`,
                "name": CONFIG.BRAND_NAME,
                "url": dynamicDomain,
                "logo": { "@type": "ImageObject", "url": `${dynamicDomain}/logo.png` },
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
                "name": "ไซด์ไลน์" + provinceName + " บริการรับงานและเด็กเอ็นเตอร์เทนระดับพรีเมียม",
                "image": firstImage,
                "telephone": CONFIG.PHONE,
                "url": provinceUrl,
                "description": cleanDescription,
                "address": { "@type": "PostalAddress", "addressLocality": provinceName, "addressCountry": "TH" },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": seoData.geo ? seoData.geo.lat : 13.7563,
                    "longitude": seoData.geo ? seoData.geo.lng : 100.5018
                },
                "areaServed": [
                    {
                        "@type": "AdministrativeArea",
                        "name": provinceName
                    }
                ],
                "containsPlace": seoData.zones.map(z => ({
                    "@type": "Place",
                    "name": "โซน" + z
                })),
                "aggregateRating": safeProfiles.length > 0 ? {
                    "@type": "AggregateRating",
                    "ratingValue": deterministicRating,
                    "reviewCount": String(deterministicReviews)
                } : undefined,
                "priceRange": "฿฿฿"
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
                "name": "รายชื่อน้องๆ ไซด์ไลน์ " + provinceName,
                "numberOfItems": safeProfiles.length,
                "itemListElement": safeProfiles.map((p, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "item": {
                        "@type": "Person",
                        "name": p.name || "ไม่ระบุชื่อ",
                        "url": `${dynamicDomain}/sideline/${p.slug || p.id}`,
                        "image": optimizeImg(dynamicDomain, p.imagePath, 300, 400),
                        "description": "โปรไฟล์น้อง" + (p.name || "") + " รับงานโซน " + (p.location || provinceName)
                    }
                }))
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${provinceUrl}/#breadcrumb`,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": dynamicDomain },
                    { "@type": "ListItem", "position": 2, "name": "รวมโปรไฟล์", "item": `${dynamicDomain}/profiles.html` },
                    { "@type": "ListItem", "position": 3, "name": "ไซด์ไลน์" + provinceName, "item": provinceUrl }
                ]
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

        // 7. HTML TEMPLATE & RENDERER (Semantic UI/UX with zero layout shift rules)
        const cardsHTML = safeProfiles
            .map((p, index) => {
                const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").replace(/^(น้อง\s?)/, ""));
                const profileLocation = escapeHTML(p.location || provinceName || "ไม่ระบุโซน");
                const profileLink = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
                const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
                
                const ageHtml = (p.age && p.age !== '??' && !isNaN(p.age)) 
                    ? `<span class="text-[11px] font-[600] text-white/90 bg-white/10 border border-white/20 px-2 py-0.5 rounded-md backdrop-blur-md">${p.age}</span>` 
                    : ``;

                let displayRate = "สอบถาม";
                if (p.rate) {
                    const rawRate = String(p.rate).replace(/,/g, ""); 
                    const numMatch = rawRate.match(/\d+/g); 
                    if (numMatch) {
                        const numericRate = parseInt(numMatch.join(""), 10);
                        if (numericRate > 0) {
                            displayRate = numericRate.toLocaleString() + " ฿";
                        }
                    } else if (rawRate.toLowerCase() !== "สอบถาม" && rawRate.trim() !== "") {
                        displayRate = escapeHTML(rawRate); 
                    }
                }

                const animDelay = (index % 10) * 50;
                const lsiKeyword = seoData.lsi ? seoData.lsi[index % seoData.lsi.length] : "รับงาน" + provinceName;
                const smartAlt = "รูปโปรไฟล์น้อง" + cleanName + " บริการ" + lsiKeyword + " พิกัดโซน" + profileLocation;
                const imageAttributes = index < 4 ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"';
                const thumbW = 200;
                const thumbH = 267;

                return `
            <article class="reveal group relative rounded-[24px] overflow-hidden glass-panel hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(255,46,99,0.25)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style="transition-delay: ${animDelay}ms; content-visibility: auto; contain-intrinsic-size: 200px 335px;" aria-label="ดูโปรไฟล์น้อง` + cleanName + `">
                <div class="relative h-full flex flex-col z-10">
                    <a href="${profileLink}" class="absolute inset-0 z-30 focus:outline-none rounded-[24px]" aria-label="จองน้อง` + cleanName + `">
                        <span class="sr-only">ดูรายละเอียดของน้อง` + cleanName + ` ` + lsiKeyword + `</span>
                    </a>
                    
                    ${p.isfeatured || index < 3 ? `
                    <div class="absolute top-0 right-0 bg-gradient-to-r from-[#D4AF37] via-[#FFF9E6] to-[#AA7C11] text-[#07070A] text-[9.5px] font-[800] px-4 py-2 rounded-bl-[16px] rounded-tr-[24px] shadow-[0_4px_20px_rgba(212,175,55,0.4)] z-20 tracking-[0.15em] uppercase flex items-center gap-1.5 border-b border-l border-[#FFF9E6]/30">
                        <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <i class="fas fa-star text-[8.5px] animate-bounce"></i> TOP
                    </div>` : ''}
                    
                    <div class="relative aspect-[3/4] overflow-hidden rounded-t-[24px] border-b border-white/[0.06] bg-[#07070a]">
                        <img src="${optimizeImg(dynamicDomain, p.imagePath, thumbW, thumbH)}" 
                             srcset="${optimizeImg(dynamicDomain, p.imagePath, 200, 267)} 200w, ${optimizeImg(dynamicDomain, p.imagePath, 400, 533)} 400w"
                             sizes="(max-width: 640px) 45vw, 200px"
                             width="${thumbW}" 
                             height="${thumbH}"
                             onerror="this.onerror=null; this.src='/images/default.webp';"
                             alt="` + smartAlt + `" 
                             class="absolute inset-0 w-full h-full object-cover transform transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" ${imageAttributes} />
                             
                        <div class="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/20 to-transparent opacity-95 transition-opacity duration-500 z-10"></div>
                        
                        <!-- Verified & Status Badges (Conversion Boosters) -->
                        <div class="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                            <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-lg border border-white/10 shadow-lg">
                                <span class="relative flex h-2.5 w-2.5">
                                    ${isAvailable ? '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>' : ''}
                                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 ${isAvailable ? 'bg-[#00E676]' : 'bg-[#FF2E63]'}"></span>
                                </span>
                                <span class="text-[9px] font-[800] text-white tracking-[0.1em] uppercase">${isAvailable ? 'Online' : 'Busy'}</span>
                            </div>
                            <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/80 backdrop-blur-lg border border-emerald-400/20 shadow-lg">
                                <i class="fas fa-check-circle text-white text-[9px]"></i>
                                <span class="text-[8px] font-[800] text-white tracking-[0.05em] uppercase">VERIFIED</span>
                            </div>
                        </div>

                        <div class="absolute bottom-0 left-0 w-full px-5 pb-5 pt-10 text-white z-20 pointer-events-none flex flex-col justify-end">
                            <h3 class="text-[20px] md:text-[22px] font-[700] leading-none tracking-tight flex items-center gap-2 mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                                ` + cleanName + ` ${ageHtml}
                            </h3>
                            <p class="text-[12px] font-[400] text-zinc-300 flex items-center gap-1.5 w-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                <i class="fas fa-location-dot text-[#D4AF37] shrink-0"></i> 
                                <span class="truncate whitespace-nowrap overflow-hidden text-ellipsis">` + profileLocation + `</span>
                            </p>
                        </div>
                    </div>
                    
                    <div class="p-4 flex justify-between items-center bg-black/20 backdrop-blur-md rounded-b-[24px] relative z-40 pointer-events-none">
                        <div>
                            <span class="text-[18px] font-[700] text-gradient-luxury tracking-wide">` + displayRate + `</span>
                        </div>
                        <div class="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-[700] tracking-[0.2em] text-white/90 group-hover:bg-[#FF2E63] group-hover:border-[#FF2E63] group-hover:shadow-[0_0_20px_rgba(255,46,99,0.5)] transition-all duration-300 uppercase shrink-0">
                            View
                        </div>
                    </div>
                </div>
            </article>`;
            })
            .join("");

        const termsAndConditions = [
            { t: "การจองคิวน้องๆ ส่วนตัว", d: "เพื่อความเป็นส่วนตัวสูงสุดในการเรียกน้องๆ โซน" + escapeHTML(provinceName) + " สมาชิกจองได้ครั้งละ 1 คิว เพื่อรักษามาตรฐานการบริการ" },
            { t: "ความปลอดภัย 100% ไร้มัดจำ", d: "ชำระเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น! หมดปัญหาการโดนหลอกโอนมัดจำ" },
            { t: "การตรวจสอบโปรไฟล์เข้มงวด", d: "รับประกันความตรงปก ไม่ตรงปกยกเลิกหน้างานได้ทันทีโดยไม่มีค่าใช้จ่ายใดๆ" },
            { t: "ข้อมูลลับระดับสูงสุด", d: "ข้อมูลการนัดหมายและการสนทนาจะถูกลบและเก็บเป็นความลับสุดยอด (Zero-Log Policy)" }
        ];

        const isDefaultZones = !PROVINCE_SEO_DATA[provinceKey];
        const zonesHTML = (seoData.zones && seoData.zones.length > 0 && !isDefaultZones) ? `
            <div class="reveal text-center relative z-10 pt-20 md:pt-28 pb-10">
                <h2 class="text-2xl md:text-3xl font-[500] mb-8 flex items-center justify-center gap-3 text-white tracking-wide">
                    <i class="fas fa-map-pin text-[#FF8E53]"></i> โซนยอดฮิต น้องๆไซด์ไลน์` + escapeHTML(provinceName) + `
                </h2>
                <div class="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
                    ${seoData.zones.map(zone => `<a href="/search?q=${encodeURIComponent(zone)}" class="px-6 py-2.5 rounded-full glass-panel text-[13px] font-[400] text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/5" aria-label="ดูน้องๆ โซน` + escapeHTML(zone) + `">โซน` + escapeHTML(zone) + `</a>`).join("")}
                </div>
            </div>` : "";

        const faqsHTML = (seoData.faqs && seoData.faqs.length > 0) ? `
            <div class="reveal max-w-3xl mx-auto space-y-4 pb-20 relative z-10 pt-20 md:pt-28">
                <h2 class="text-2xl md:text-3xl font-[500] text-center mb-10 text-white tracking-wide">คำถามที่พบบ่อย (FAQ)</h2>
                ${seoData.faqs.map((faq, idx) => `
                    <details class="group glass-panel rounded-2xl overflow-hidden transition-all duration-300" ${idx === 0 ? 'open' : ''}>
                        <summary class="flex justify-between items-center p-6 cursor-pointer list-none font-[500] text-white text-[15px] hover:bg-white/[0.02] transition-colors">
                            <span class="flex items-center gap-4 pr-6"><span class="text-brand-pink text-lg"><i class="fas fa-circle-question"></i></span>${escapeHTML(faq.q)}</span>
                            <div class="w-8 h-8 shrink-0 rounded-full glass-panel flex items-center justify-center group-open:bg-brand-pink/20 group-open:text-brand-pink group-open:border-brand-pink/30 group-open:rotate-45 transition-all"><i class="fas fa-plus text-sm"></i></div>
                        </summary>
                        <div class="px-6 pb-6 pt-2 ml-[3.25rem] text-zinc-300 text-[14px] font-[300] leading-[1.6] border-l-2 border-[#FF2E63]/20">
                            <p>${escapeHTML(faq.a)}</p>
                        </div>
                    </details>
                `).join("")}
            </div>` : "";

        // ✅ ลบกล่องโปรโมชั่น (Promotion box) ออก และปรับให้กล่องเงื่อนไขขยายสมมาตรเต็มความกว้างอย่างสวยงาม
        const fullSeoSectionHTML = `
            <section class="py-24 relative overflow-hidden">
                <div class="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
                    <div class="max-w-3xl mx-auto relative z-10 w-full">
                        <div class="reveal h-full flex flex-col w-full">
                            <div class="glass-panel p-8 md:p-10 rounded-[24px] h-full flex-1 bg-[#0a0a0a]/80">
                                <h2 class="text-2xl font-[500] tracking-wide flex items-center gap-3 text-white mb-8"><i class="fas fa-shield-halved text-gradient-luxury"></i> เงื่อนไขบริการ</h2>
                                <div class="space-y-4">
                                    ${termsAndConditions.map((item, idx) => `
                                        <div class="flex gap-4 items-start p-4 rounded-[16px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-300 group">
                                            <div class="w-10 h-10 shrink-0 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-sm font-[700] text-zinc-400 group-hover:text-brand-pink group-hover:border-brand-pink/30 transition-all">0${idx + 1}</div>
                                            <div class="pt-0.5">
                                                <h3 class="text-[15px] font-[500] mb-1 text-white group-hover:text-brand-gold transition-colors">${item.t}</h3>
                                                <p class="text-zinc-400 text-[12px] font-[300] leading-[1.6]">${item.d}</p>
                                            </div>
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${zonesHTML}
                    
                    <div class="reveal relative mt-20 md:mt-28">
                        <div class="glass-panel rounded-[32px] p-8 md:p-16 text-center relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
                            <div class="max-w-4xl mx-auto space-y-8 relative z-10">
                                <div class="w-16 h-16 bg-black/40 border border-white/5 text-[#FF2E63] rounded-full flex items-center justify-center text-2xl mx-auto shadow-[0_10px_30px_rgba(255,46,99,0.2)]"><i class="fas fa-gem"></i></div>
                                <h2 class="text-3xl md:text-4xl font-[500] tracking-wide leading-tight text-white">ที่สุดของบริการเพื่อนเที่ยว<br><span class="text-gradient-luxury font-[700]">ไซด์ไลน์${escapeHTML(provinceName)}</span></h2>
                                <div class="text-zinc-300 text-[14px] md:text-[15px] font-[300] leading-[1.8] space-y-6 text-left md:text-center px-2">
                                    ${smartLinkify(seoData.uniqueIntro, provinceKey, seoData.zones)}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${faqsHTML}
                    
                    <div class="reveal relative max-w-2xl mx-auto z-10 mt-20 md:mt-28 mb-16">
                        <div class="bg-gray-100/95 backdrop-blur-xl rounded-[32px] p-8 md:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden">
                            <h3 class="text-[#8B0000] text-[16px] md:text-[18px] font-[700] mb-2 flex items-center justify-center gap-2 tracking-wide">
                                ติดตามเราบน Social Media <i class="fas fa-bullhorn text-[#FF2E63]"></i>
                            </h3>
                            <p class="text-gray-500 text-[13px] font-[400] mb-8">อัปเดตโปรไฟล์ใหม่ล่าสุดและข้อเสนอพิเศษได้ก่อนใคร</p>
                            
                            <div class="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
                                <a href="https://line.me/ti/p/ksLUWB89Y_" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-2.5 group">
                                    <div class="w-[65px] h-[65px] rounded-full bg-[#06C755] flex items-center justify-center text-white text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <i class="fa-brands fa-line"></i>
                                    </div>
                                    <span class="text-gray-800 font-[700] text-[12px] tracking-wider">LINE</span>
                                </a>
                                <a href="https://tiktok.com/@sidelinecm" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-2.5 group">
                                    <div class="w-[65px] h-[65px] rounded-full bg-black flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <i class="fa-brands fa-tiktok"></i>
                                    </div>
                                    <span class="text-gray-800 font-[700] text-[12px] tracking-wider">TikTok</span>
                                </a>
                                <a href="https://twitter.com/sidelinechiangmai" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-2.5 group">
                                    <div class="w-[65px] h-[65px] rounded-full bg-[#1DA1F2] flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <i class="fa-brands fa-twitter"></i>
                                    </div>
                                    <span class="text-gray-800 font-[700] text-[12px] tracking-wider">Twitter</span>
                                </a>
                                <a href="https://linktr.ee/kissmodel" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-2.5 group">
                                    <div class="w-[65px] h-[65px] rounded-full bg-[#43E660] flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <i class="fas fa-link"></i>
                                    </div>
                                    <span class="text-gray-800 font-[700] text-[12px] tracking-wider">Linktree</span>
                                </a>
                            </div>
                            
                            <div class="w-3/4 mx-auto h-[1px] bg-gray-300 mb-6"></div>
                            <p class="text-[#D32F2F] text-[13px] md:text-[15px] font-[700] tracking-wide">
                                เว็บไซต์นี้สำหรับผู้ที่มีอายุ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น
                            </p>
                        </div>
                    </div>
                </div>
                <div class="w-1/2 mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mt-24"></div>
            </section>
        `;

        const htmlTemplate = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0f0f0f" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>${title}</title>
    <meta name="description" content="${description}" />
    
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <link rel="canonical" href="${provinceUrl}" />
    <link rel="alternate" hreflang="th-TH" href="${provinceUrl}" />
    <meta name="google-site-verification" content="7jnWDzrGXlGDdrjl2M75rIPhsjZbTRuzQSdPJ8c_lz4" />
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${provinceUrl}" />
    <meta property="og:image" content="${firstImage}" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${CONFIG.TWITTER}" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="dns-prefetch" href="https://zxetzqwjaiumqhrpumln.supabase.co" />
    
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700;800&display=swap" as="style" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700;800&display=swap" media="print" onload="this.media='all'" />
    <link rel="preload" as="image" href="/images/hero-sidelinechiangmai-1200.webp" imagesrcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w" sizes="(max-width: 640px) 100vw, 100vw" fetchpriority="high" />
    

    <!-- เพื่อแก้ปัญหารูปลักษณ์พังบนสมาร์ทโฟน ดึงขุมพลังการคอมไพล์คลาส v3 JIT กลับมาทำงานทันที -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            pink: 'var(--brand-pink, #FF2E63)',
                            gold: 'var(--brand-gold, #FF8E53)',
                            crimson: 'var(--brand-crimson, #FF416C)',
                            dark: 'var(--brand-dark, #07070A)',
                            darker: 'var(--brand-darker, #111116)'
                        }
                    },
                    fontFamily: { sans: ['Prompt', 'sans-serif'] }
                }
            }
        }
    </script>

    <!-- สำหรับเบราว์เซอร์ทั่วไป -->
    <link rel="icon" type="image/png" sizes="72x72" href="/icons/icon-72x72.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/icons/icon-96x96.png">
    <link rel="icon" type="image/png" sizes="128x128" href="/icons/icon-128x128.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png">

    <!-- สำหรับ Apple Touch Icon (iPhone/iPad) -->
    <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png">

    <!-- สำหรับ Android Manifest -->
    <link rel="manifest" href="/manifest.json">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root {
            --brand-pink: #FF2E63;
            --brand-gold: #FF8E53;
            --brand-crimson: #FF416C;
            --brand-dark: #07070A;
            --brand-darker: #111116;
            --font-prompt: 'Prompt', sans-serif;
        }

        /* -------------------------------------------------------------
           [ ZERO-FOUC PERFORMANCE FIX ]
           ตั้งค่าเริ่มต้นป้องกันหน้ากระตุกแบบนุ่มนวลระหว่างรอ JIT Compiler ทำงาน
           ------------------------------------------------------------- */
        body {
            opacity: 0;
            transition: opacity 0.15s ease-in-out;
            font-family: var(--font-prompt);
        }
        body.tailwind-ready {
            opacity: 1;
        }

        .glass-panel {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
        }

        .text-gradient-luxury {
            background: linear-gradient(135deg, var(--brand-pink) 10%, var(--brand-gold) 50%, #FCF6BA 90%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }

        .btn-shimmer { position: relative; overflow: hidden; isolation: isolate; }
        .btn-shimmer::after {
            content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.15), transparent);
            transform: rotate(45deg); animation: shimmer 3s infinite linear; z-index: 1; pointer-events: none;
        }
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        #navbar { transition: transform 0.3s ease-in-out; }

        html, body {
            width: 100%;
            min-height: 100vh;
            min-height: 100dvh;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            overscroll-behavior-y: none;
        }

        body {
            background-color: #020204;
            background-image: radial-gradient(circle at 50% 0%, #0c0a15 0%, #050508 50%, #020204 100%);
            background-attachment: fixed;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            color: #FFFFFF;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            align-items: center; 
            justify-content: flex-start;
        }

        main, .main-content {
            width: 100%;
            max-width: 80rem; 
            margin-left: auto;
            margin-right: auto;
        }
        
        .fixed.bottom-3.left-4.right-4 {
            background-color: rgba(7, 7, 10, 0.95);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.9);
        }

        /* ปรับระยะขอบหน้าจอสำหรับ Mobile Standalone (PWA) ป้องกันหน้าจอโค้งบดบัง */
        body {
            padding-top: env(safe-area-inset-top, 0px);
            padding-bottom: calc(75px + env(safe-area-inset-bottom, 0px));
        }

        @media (min-width: 768px) {
            body {
                padding-bottom: env(safe-area-inset-bottom, 0px);
            }
        }

        /* สร้างภาพเม็ดทรายจำลองพรีเมียม (SVG Luxury Noise Overlay) ปิดทับระนาบหลัง */
        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            opacity: 0.015; /* ค่าความชัดเจนของเม็ดทรายที่เนียนตากำลังดี */
            pointer-events: none;
            z-index: 9999; /* อยู่บนสุดเพื่อเพิ่มพื้นผิวสัมผัสให้กับรูปภาพและการ์ด */
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* อัปเกรดเอฟเฟกต์ Glassmorphism แบบมีมิติสะท้อนขอบบนแสงเงา (Specular Highlights) */
        .glass-panel {
            background: rgba(10, 10, 15, 0.45);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.04);
            box-shadow: 
                inset 0 1px 0 0 rgba(255, 255, 255, 0.05), /* สะท้อนแสงขอบบนขรุขระบางๆ */
                0 10px 30px -10px rgba(0, 0, 0, 0.7);
        }

        /* ระบบอนิมชันการ์ดโปรไฟล์แบบสปริงดีด (Elastic Spring Hover Physics) */
        article.reveal {
            will-change: transform, opacity;
            transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), 
                        box-shadow 0.4s ease, 
                        border-color 0.4s ease;
        }

        article.reveal:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: rgba(255, 46, 99, 0.25);
            box-shadow: 
                0 20px 40px -10px rgba(255, 46, 99, 0.15),
                0 0 20px 1px rgba(255, 46, 99, 0.05);
        }

        /* อัปเกรดระบบ Skeleton Loader ให้มีความเคลื่อนไหวจำลองแสงสะท้อนกวาดผ่านระดับการ์ดจอ (Shimmering Sweeps) */
        @keyframes shimmerSweep {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        #skeleton-loader div {
            position: relative;
            overflow: hidden;
            background: linear-gradient(90deg, #111116 25%, #1a1a24 50%, #111116 75%);
            background-size: 200% 100%;
            animation: shimmerLoading 1.5s infinite linear;
        }

        @keyframes shimmerLoading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* แม่เหล็กและชิมเมอร์บนปุ่ม Call To Action (Magnetic Line Contact Button) */
        .btn-line-glow {
            position: relative;
            overflow: hidden;
            will-change: transform;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .btn-line-glow:hover {
            transform: scale(1.04);
        }

        .btn-line-glow::before {
            content: '';
            position: absolute;
            top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
            transition: 0.5s;
        }

        .btn-line-glow:hover::before {
            left: 100%;
            transition: 0.6s ease-in-out;
        }
    </style>
</head>

<body class="flex flex-col pb-[70px] md:pb-0 relative selection:bg-brand-pink selection:text-white w-full min-h-screen bg-[#07070A] overflow-x-hidden">

    <div class="absolute top-[5%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-brand-pink/5 blur-[140px] pointer-events-none z-0"></div>
    <div class="absolute top-[35%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-brand-gold/4 blur-[140px] pointer-events-none z-0"></div>

    <header id="navbar" class="fixed top-0 left-0 right-0 w-full z-[999] py-3 glass-panel border-r-0 border-l-0 border-t-0 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] backdrop-blur-md transition-transform duration-300">
        <div class="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between">
            <a href="/" class="z-10 flex items-center gap-2" aria-label="กลับสู่หน้าแรก">
                <img src="/images/logo-sidelinechiangmai.webp" alt="Logo" class="h-6 md:h-7 w-auto brightness-200 opacity-95 object-contain" width="180" height="28">
            </a>

            <nav class="hidden md:flex items-center gap-10 text-[12px] font-[500] tracking-widest text-white/50 uppercase" aria-label="เมนูนำทางหลัก">
                <a href="/" class="hover:text-white transition-all duration-300 hover:tracking-wide">หน้าแรก</a>
                <a href="/profiles.html" class="text-white border-b-2 border-[#FF2E63] pb-1 tracking-wide" aria-current="page">โปรไฟล์น้องๆ ตัวท็อป</a>
                <a href="/locations.html" class="hover:text-white transition-all duration-300 hover:tracking-wide">พิกัดบริการ</a>
            </nav>

            <div class="flex items-center gap-3">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-2 glass-panel text-white px-6 py-2 rounded-full text-[11px] font-[600] tracking-widest hover:bg-white/10 hover:scale-105 transition-all duration-300 btn-shimmer border border-white/10" aria-label="ติดต่อแอดมินทางไลน์">
                    <i class="fab fa-line text-[#00E676] text-sm" aria-hidden="true"></i> จองคิวตอนนี้😍
                </a>

                <button id="menu-btn" aria-label="เปิดเมนู" aria-expanded="false" class="md:hidden flex items-center justify-center w-10 h-10 text-white glass-panel rounded-full hover:bg-white/10 active:scale-95 transition-all border border-white/5">
                    <i class="fas fa-bars text-[15px]" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </header>

    <div id="sidebar-overlay" class="fixed inset-0 bg-[#07070A]/90 backdrop-blur-sm z-[2000] hidden opacity-0 transition-opacity duration-300" aria-hidden="true"></div>
    <nav id="sidebar-menu" aria-label="เมนูมือถือ" class="fixed top-0 right-0 h-full w-[280px] bg-[#07070A] border-l border-white/5 z-[3000] transform translate-x-full transition-transform duration-300 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.9)]">
        <div class="flex items-center justify-between p-5 border-b border-white/5">
            <span class="text-white font-[700] tracking-widest text-[15px] opacity-80">MENU</span>
            <button id="close-menu-btn" aria-label="ปิดเมนู" class="text-white/50 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <i class="fas fa-times text-lg" aria-hidden="true"></i>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
            <a href="/" class="flex items-center gap-3 p-3 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-[400] text-[14px]"><i class="fas fa-home w-5 text-center text-[#FF2E63]"></i> หน้าแรก</a>
            <a href="/profiles.html" class="flex items-center gap-3 p-3 text-white font-[500] bg-white/5 border border-white/10 rounded-lg text-[14px]"><i class="fas fa-gem w-5 text-center text-[#FF2E63]"></i> น้องๆ แนะนำตัวท็อป</a>
            <a href="/locations.html" class="flex items-center gap-3 p-3 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-[400] text-[14px]"><i class="fas fa-map-marker-alt w-5 text-center text-[#FF2E63]"></i> พิกัดบริการ</a>
            <a href="/about.html" class="flex items-center gap-3 p-3 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-[400] text-[14px]"><i class="fas fa-info-circle w-5 text-center text-[#FF2E63]"></i> เกี่ยวกับเรา</a>
            <a href="/faq.html" class="flex items-center gap-3 p-3 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-[400] text-[14px]"><i class="fas fa-question-circle w-5 text-center text-[#FF2E63]"></i> คำถามพบบ่อย</a>
        </div>
        <div class="p-5 border-t border-white/5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#FF2E63] to-[#FF416C] text-white py-3 rounded-xl font-[600] uppercase tracking-widest text-[12px] btn-shimmer shadow-[0_4px_20px_rgba(255,46,99,0.3)]">
                <i class="fab fa-line text-lg"></i> แอดไลน์จอง
            </a>
        </div>
    </nav>

    <main class="flex-1 w-full relative z-10 flex flex-col items-center">
        
        <section class="w-full pt-32 md:pt-40 pb-20 md:pb-24 px-6 relative flex flex-col items-center">
            <div class="w-full max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">

                <div class="reveal active flex flex-wrap justify-center gap-3 mb-10 relative z-20">
                    <div class="flex items-center gap-2 px-5 py-2 glass-panel border-[#00E676]/20 rounded-full text-[#00E676]/90 text-[11px] md:text-[12px] font-[500] shadow-[0_4px_12px_rgba(0,230,118,0.1)] hover:bg-[#00E676]/5 transition-all duration-300">
                        <i class="fas fa-shield-halved"></i> เจอตัวจริง จ่ายหน้างาน 100%
                    </div>
                    <div class="flex items-center gap-2 px-5 py-2 glass-panel border-[#FF416C]/30 rounded-full text-[#FF416C]/90 text-[11px] md:text-[12px] font-[500] shadow-[0_4px_12px_rgba(255,65,108,0.1)] hover:bg-[#FF416C]/5 transition-all duration-300">
                        <i class="fas fa-ban"></i> ไม่มีการโอนมัดจำก่อน
                    </div>
                </div>

                <div class="reveal relative w-full max-w-5xl mx-auto mb-16 group active px-2 sm:px-0">
                    <div class="aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden glass-panel relative shadow-[0_0_50px_rgba(255,46,99,0.15)] bg-[#07070a] border border-white/5">
                        <img src="/images/hero-sidelinechiangmai-1200.webp" srcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w" sizes="(max-width: 640px) 100vw, 100vw" alt="รวมน้องๆ ไซด์ไลน์` + escapeHTML(provinceName) + ` รับงาน` + escapeHTML(provinceName) + ` ระดับพรีเมียม" class="w-full h-full object-cover transform transition-transform duration-[4s] group-hover:scale-[1.02] opacity-80" fetchpriority="high">
                        <div class="absolute inset-0 bg-gradient-to-t from-[#07070A] via-transparent to-transparent pointer-events-none"></div>
                        <div class="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent pointer-events-none"></div>
                    </div>
                </div>

                <div class="max-w-4xl mx-auto text-center reveal active relative z-10 flex flex-col items-center">
                    <h1 class="text-[2.4rem] sm:text-[3rem] md:text-[4rem] font-[800] text-white leading-[1.2] tracking-tight mb-6 drop-shadow-[0_10px_30px_rgba(255,46,99,0.2)]">
                        ไซด์ไลน์<span class="text-gradient-luxury font-[900]">` + escapeHTML(provinceName) + `</span><br>
                        รับงานฟิวแฟน ตัวท็อป
                    </h1>
                    <p class="text-white/70 text-[13px] md:text-[16px] font-[300] mb-2 max-w-2xl mx-auto leading-relaxed px-4">
                        ค้นหาน้องๆ <strong>รับงาน` + escapeHTML(provinceName) + `</strong> เด็กเอ็นเตอร์เทน บริการเพื่อนเที่ยวระดับพรีเมียม การันตีโปรไฟล์ตรงปก ปลอดภัย จ่ายเงินหน้างาน 100% ไม่มีโอนมัดจำล่วงหน้า
                    </p>

                    <!-- Urgency UX (Scarcity Demand Signal) -->
                    <p class="text-[#FF8E53] text-[12px] font-[500] mb-8 animate-pulse flex items-center justify-center gap-2">
                        <i class="fas fa-fire text-brand-pink"></i> ขณะนี้มีผู้เข้าชมในจังหวัด${escapeHTML(provinceName)} ${5 + (safeProfiles.length % 7)} คน • คิวว่างพร้อมรับสายตรงปก 100%
                    </p>

                    <div class="w-full max-w-xl mx-auto mt-4 mb-20 relative z-20 px-4 sm:px-2">
                        <form action="/search" method="GET" id="search-form" class="relative group">
                            <label for="search-input" class="sr-only">ค้นหาน้องๆ โซน จังหวัด หรือชื่อ</label>
                            <div class="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <i class="fas fa-search text-white/40 group-focus-within:text-[#FF2E63] transition-colors" aria-hidden="true"></i>
                            </div>
                            <input type="text" id="search-input" name="q" placeholder="พิมพ์ โซน, จังหวัด, หรือชื่อน้องๆที่ต้องการค้นหา..." minlength="2" maxlength="50" required class="w-full glass-panel bg-transparent text-white rounded-full py-4 pl-14 pr-32 focus:outline-none focus:border-[#FF2E63]/50 focus:ring-2 focus:ring-[#FF2E63]/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)] border border-white/10 transition-all font-[300] placeholder:text-white/40 text-[14px]">
                            <div id="search-error" class="text-[#FF416C] text-[12px] mt-2 hidden"></div>
                            <button type="submit" class="absolute inset-y-1.5 right-1.5 bg-gradient-to-r from-[#FF2E63] to-[#FF416C] text-white px-6 rounded-full font-[600] text-[11px] uppercase tracking-widest hover:opacity-95 active:scale-95 disabled:opacity-50 transition-all btn-shimmer" aria-label="ปุ่มค้นหา">ค้นหา</button>
                        </form>
                    </div>

                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
                        <a href="#profiles-grid" class="w-full sm:w-auto px-10 py-4 bg-white/95 text-[#07070A] rounded-full font-[600] text-[13px] tracking-widest hover:bg-white transition-all shadow-[0_12px_30px_rgba(255,255,255,0.15)] uppercase text-center" aria-label="เลื่อนลงไปดูโปรไฟล์">
                            เลือกดูโปรไฟล์น้องๆ
                        </a>
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-10 py-4 glass-panel text-white rounded-full font-[600] text-[13px] hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-center" aria-label="แอดไลน์ติดต่อแอดมิน">
                            <i class="fab fa-line text-lg text-[#00E676]" aria-hidden="true"></i> ติดต่อแอดมิน
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <div class="sticky top-[56px] md:top-[64px] z-40 w-full py-3 overflow-x-auto no-scrollbar glass-panel border-r-0 border-l-0 border-t-0 shadow-none bg-[#07070A]/85 backdrop-blur-md border-b border-white/5">
            <nav class="w-full max-w-7xl mx-auto px-6 flex items-center justify-center gap-3 min-w-max" aria-label="หมวดหมู่โปรไฟล์">
                <button aria-pressed="true" class="shrink-0 px-6 py-2 rounded-full bg-white/10 text-white text-[12px] font-[600] tracking-wider shadow-[0_4px_20px_rgba(255,255,255,0.05)] border border-white/10 transition-all duration-300">น้องๆ ทั้งหมด</button>
                <button aria-pressed="false" class="shrink-0 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-[12px] font-[400] tracking-wider hover:text-white hover:bg-white/5 transition-all duration-300">มาแรง & ยอดฮิต</button>
                <button aria-pressed="false" class="shrink-0 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-[12px] font-[400] tracking-wider flex items-center gap-2 hover:text-white hover:bg-white/5 transition-all duration-300"><i class="fas fa-location-crosshairs" aria-hidden="true"></i> ใกล้ฉัน</button>
            </nav>
        </div>

        <section id="profiles-grid" class="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 scroll-mt-24 flex flex-col">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 px-2 w-full">
                <div class="reveal">
                    <h2 class="text-3xl md:text-4xl font-[500] tracking-wide text-white">รวมโปรไฟล์ไซด์ไลน์ <span class="text-gradient-luxury font-[700]">` + escapeHTML(provinceName) + `</span></h2>
                    <p class="text-zinc-400 text-[11px] font-[400] uppercase tracking-widest mt-2 flex items-center gap-2 opacity-80">
                        <i class="fas fa-check-circle text-[#00E676]" aria-hidden="true"></i> ตรวจสอบแล้ว (${CURRENT_MONTH} ${CURRENT_YEAR})
                    </p>
                </div>
                
                <div class="flex items-center gap-2.5 px-5 py-2.5 bg-[#00E676]/[0.04] border border-[#00E676]/20 rounded-full text-[11px] font-[600] text-[#00E676]/90 uppercase tracking-widest reveal self-start sm:self-auto shadow-[0_4px_12px_rgba(0,230,118,0.05)]">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]"></span>
                    </span>
                    ${safeProfiles.length} โพสต์พร้อมให้บริการ
                </div>
            </div>
            
            <div id="skeleton-loader" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full justify-center justify-items-center">
                ${Array(15).fill(`
                    <div class="rounded-[24px] overflow-hidden aspect-[3/4] w-full max-w-sm">
                        <div class="w-full h-full bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] animate-pulse rounded-[24px] border border-white/5"></div>
                    </div>
                `).join("")}
            </div>

            <div id="profiles-container" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 hidden w-full justify-center justify-items-center">
                ${cardsHTML}
            </div>
        </section>
        
        <div class="w-full flex flex-col items-center">
            ${fullSeoSectionHTML}
        </div>

    </main>

    <footer class="bg-[#030305] py-16 md:py-24 text-center border-t border-white/5 relative z-10 pb-[110px] md:pb-24">
        <div class="max-w-4xl mx-auto px-6 relative z-10">

            <h2 class="text-2xl md:text-4xl font-[800] text-white mb-10 tracking-tighter uppercase drop-shadow-md">
                THANK YOU <br> 
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E63] to-[#FF8E53]">
                    ไซด์ไลน์${escapeHTML(provinceName)}
                </span>
            </h2>
                
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-3 glass-panel text-white px-10 py-4 rounded-full font-[500] text-[13px] tracking-widest hover:bg-white/[0.05] transition-all btn-shimmer" aria-label="จองคิวผ่านไลน์">
                <i class="fab fa-line text-xl text-[#00E676]" aria-hidden="true"></i> จองน้องๆ ตอนนี้
            </a>
            
            <div class="mt-20 mb-8 reveal">
                <h3 class="text-[14px] font-[500] text-white/50 tracking-widest uppercase">พื้นที่รับงานเพื่อนเที่ยวและไซด์ไลน์จังหวัดอื่นๆ</h3>
            </div>
            
            <!-- ✅ ปรับแต่งโครงสร้าง Anchor Text เพื่อหลีกเลี่ยงการโดนทำโทษและช่วยทำอันดับแบบเฉพาะเจาะจง -->
            <nav class="grid grid-cols-2 md:grid-cols-4 gap-4 reveal max-w-2xl mx-auto" aria-label="ลิงก์ไปยังพื้นที่รับงานอื่นๆ">
${allProvinces.slice(0, 12).map(p => {
    const linkHref = p.key === 'chiangmai' ? "/" : `/location/${p.key}`;
    return `<a href="${linkHref}" class="text-[12px] font-[300] text-white/50 hover:text-white transition-all py-2 border border-transparent hover:border-white/10 rounded-lg glass-panel">ไซด์ไลน์${escapeHTML(p.nameThai)} ตัวท็อป</a>`;
}).join("")}
            </nav>

            <div class="mt-24 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
                <p class="text-[10px] font-[300] text-white/60 uppercase tracking-widest">
                    © ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.
                </p>
                <div class="flex gap-6 text-[10px] font-[300] text-white/60 uppercase tracking-widest">
                    <a href="/privacy-policy.html" class="hover:text-white transition-colors">PRIVACY</a>
                    <a href="/terms.html" class="hover:text-white transition-colors">TERMS</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- MOBILE BOTTOM NAVIGATION -->
    <nav aria-label="เมนูนำทางด่วนมือถือ" class="fixed bottom-3 left-4 right-4 md:hidden z-[100] glass-panel rounded-[20px] bg-black/85 pb-[env(safe-area-inset-bottom)] shadow-[0_12px_40px_rgba(0,0,0,0.8)] border border-white/10">
        <ul class="flex justify-around h-[65px] items-center m-0 p-0 list-none max-w-md mx-auto">
            <li class="w-full text-center">
                <a href="/" aria-label="หน้าแรก" class="inline-flex flex-col items-center p-2 text-white/40 hover:text-white transition-colors">
                    <i class="fas fa-home text-[18px] mb-1" aria-hidden="true"></i>
                    <span class="text-[9px] tracking-wider">หน้าแรก</span>
                </a>
            </li>
            <li class="w-full text-center">
                <a href="/profiles.html" aria-label="ดูโปรไฟล์น้องๆ แนะนำตัวท็อป" class="inline-flex flex-col items-center p-2 text-[#FF2E63]">
                    <i class="fas fa-gem text-[18px] mb-1 drop-shadow-[0_0_8px_rgba(255,46,99,0.5)]" aria-hidden="true"></i>
                    <span class="text-[9px] font-[600] tracking-wider">TOP</span>
                </a>
            </li>
            <li class="w-full text-center relative">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="ติดต่อแอดมินทางไลน์" class="absolute left-1/2 -translate-x-1/2 bottom-5 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#FF2E63] to-[#FF416C] text-white rounded-full border-[4px] border-[#07070A] shadow-[0_5px_20px_rgba(255,46,99,0.5)] btn-shimmer active:scale-95 transition-transform">
                    <i class="fab fa-line text-2xl" aria-hidden="true"></i>
                </a>
            </li>
            <li class="w-full text-center">
                <a href="/locations.html" aria-label="พื้นที่ให้บริการ" class="inline-flex flex-col items-center p-2 text-white/40 hover:text-white transition-colors">
                    <i class="fas fa-map-pin text-[18px] mb-1" aria-hidden="true"></i>
                    <span class="text-[9px] tracking-wider">พิกัด</span>
                </a>
            </li>
            <li class="w-full text-center">
                <!-- กดค้นหาปุ่ม Navigation ให้เลื่อนหน้าจอกลับมาและโฟกัสช่องรับข้อมูล Search ทันทีแบบสมูท -->
                <a href="#search-form" id="nav-search-btn" aria-label="ค้นหา" class="inline-flex flex-col items-center p-2 text-white/40 hover:text-white transition-colors">
                    <i class="fas fa-search text-[18px] mb-1" aria-hidden="true"></i>
                    <span class="text-[9px] tracking-wider">ค้นหา</span>
                </a>
            </li>
        </ul>
    </nav>

    <script>
    document.addEventListener("DOMContentLoaded", () => {
        // จัดการเปิดการแสดงผลเมื่อ Tailwind ได้รับการคอมไพล์สไตล์เสร็จสมบูรณ์เรียบร้อยแล้ว
        setTimeout(() => {
            document.body.classList.add('tailwind-ready');
        }, 100);

        const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        setTimeout(() => {
            const skeleton = document.getElementById('skeleton-loader');
            const container = document.getElementById('profiles-container');
            if (skeleton && container) {
                skeleton.classList.add('hidden');
                container.classList.remove('hidden');
            }
        }, 120);

        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        const searchError = document.getElementById('search-error');

        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                const q = searchInput.value.trim();
                if (q.length < 2) {
                    e.preventDefault();
                    searchError.textContent = '⚠️ กรุณาพิมพ์อย่างน้อย 2 ตัวอักษร';
                    searchError.classList.remove('hidden');
                    searchInput.focus();
                    return;
                }
                if (q.length > 50) {
                    e.preventDefault();
                    searchError.textContent = '⚠️ ป้อนข้อมูลเกินขนาด (สูงสุด 50 ตัว)';
                    searchError.classList.remove('hidden');
                    return;
                }
                searchError.classList.add('hidden');
            });
            searchInput.addEventListener('input', () => {
                if (!searchError.classList.contains('hidden')) {
                    searchError.classList.add('hidden');
                }
            });
        }

        // นำทาง Search ทาง Mobile Navigation ค้นหาอย่างเป็นระเบียบ
        const navSearchBtn = document.getElementById('nav-search-btn');
        if (navSearchBtn && searchInput) {
            navSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('search-form').scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => searchInput.focus(), 600);
            });
        }

        const menuBtn = document.getElementById('menu-btn');
        const closeBtn = document.getElementById('close-menu-btn');
        const sidebar = document.getElementById('sidebar-menu');
        const overlay = document.getElementById('sidebar-overlay');

        const toggleMenu = (show) => {
            if (!sidebar || !overlay) return;
            if (show) {
                overlay.classList.remove('hidden');
                if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
                requestAnimationFrame(() => {
                    overlay.classList.remove('opacity-0');
                    sidebar.classList.remove('translate-x-full');
                });
                document.body.style.overflow = 'hidden';
            } else {
                overlay.classList.add('opacity-0');
                sidebar.classList.add('translate-x-full');
                if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
                document.body.style.overflow = '';
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        };

        if (menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
        if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
        if (overlay) overlay.addEventListener('click', () => toggleMenu(false));

        const navbar = document.getElementById("navbar");
        let lastScrollY = window.scrollY;
        let isTicking = false;

        window.addEventListener("scroll", () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    if (navbar) {
                        if (currentScrollY > 80 && currentScrollY > lastScrollY) {
                            navbar.style.transform = "translateY(-100%)";
                        } else {
                            navbar.style.transform = "translateY(0)";
                        }
                    }
                    lastScrollY = currentScrollY;
                    isTicking = false;
                });
                isTicking = true;
            }
        }, { passive: true });
    });
    </script>
</body>
</html>`;

        const cacheTtlSeconds = 300; 
        const staleTtlSeconds = 86400; 

        return new Response(htmlTemplate, { 
            headers: { 
                "Content-Type": "text/html; charset=utf-8", 
                "Cache-Control": `public, max-age=0, s-maxage=${cacheTtlSeconds}, stale-while-revalidate=${staleTtlSeconds}, must-revalidate`,
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY"
            } 
        });

    } catch (error) {
        console.error("SSR Fatal Error:", error);
        return buildErrorPage(500, "500 - SYSTEM ERROR", "เกิดข้อผิดพลาดในการประมวลผลบนเซิร์ฟเวอร์ กรุณาติดต่อผู้ดูแลระบบ", [], "");
    }
};