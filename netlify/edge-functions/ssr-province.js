

/**
 * [ SYSTEM CORE - REFACTORED & FULLY AUDITED ]
 * Project: Nexus Entity Framework - ULTIMATE PROVINCE MOTOR
 * Authority: Search Engine Dominance, Web Vitals Excellence & Safe Edge Routing
 * Fully optimized for Deno Deploy, Netlify Edge, and Supabase JS Client v2.
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
    DESCRIPTION: "แหล่งข้อมูลเพื่อนเที่ยวและผู้ดูแลทริปพรีเมียม ผ่านการยืนยันตัวตน มีระบบความปลอดภัยด้วยการชำระเงินหน้างาน ปราศจากการโอนมัดจำก่อนพบตัวจริง",
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
        h1: "เพื่อนเที่ยวเชียงใหม่ และไกด์ส่วนตัวสไตล์ฟิวแฟนเมืองเหนือระดับพรีเมียม",
        h2: "คัดสรรผู้ช่วยดูแลทริปและนำเที่ยว ย่านนิมมาน หางดง และพูลวิลล่าส่วนตัวอย่างอบอุ่น",
        geo: { lat: 18.7883, lng: 98.9853 },
        zones: ["นิมมาน", "สันติธรรม", "ช้างเผือก", "เจ็ดยอด", "แม่โจ้", "หางดง", "สันทราย", "รวมโชค", "คูเมือง", "หลังมอ"],
        lsi: ["เพื่อนเที่ยวเชียงใหม่", "น้องๆเชียงใหม่", "ดูแลฟีลแฟนเชียงใหม่", "ไกด์ส่วนตัวเชียงใหม่"],
        uniqueIntro: `
            <p class="mb-4">สัมผัสเสน่ห์และความผ่อนคลายของเมืองเหนือด้วยบริการเพื่อนเที่ยวและผู้ดูแลส่วนตัวในจังหวัดเชียงใหม่ เน้นการดูแลที่สุภาพ เป็นกันเอง และให้เกียรติซึ่งกันและกัน เหมาะสำหรับการเดินทางท่องเที่ยว พักผ่อน หรือร่วมมื้อค่ำสุดพิเศษ</p>
            <p class="mb-4">ผู้ให้บริการส่วนใหญ่พร้อมอำนวยความสะดวกในย่านธุรกิจและย่านท่องเที่ยวหลักของจังหวัด ไม่ว่าจะเป็นคาเฟ่สไตล์ลอฟท์แถบ <strong>ถนนนิมมานเหมินท์</strong>, คอนโดมิเนียมส่วนตัวย่าน <strong>เจ็ดยอด และสันติธรรม</strong>, ตลอดจนพื้นที่พักผ่อนส่วนตัวใกล้ชิดธรรมชาติในโซน <strong>แม่ริม และหางดง</strong></p>
            <p>อุ่นใจด้วยระบบการนัดพบที่โปร่งใส ชำระค่าขนมหน้างานโดยตรงหลังยืนยันตัวตนว่าตรงปก ไม่ต้องกังวลเรื่องการโอนมัดจำล่วงหน้าทุกกรณี</p>
        `,
        faqs: [
            { q: "ต้องการนัดพบผู้ช่วยดูแลทริปในโซนนิมมานหรือคูเมืองเชียงใหม่ มีขั้นตอนอย่างไร?", a: "สามารถระบุสถานที่นัดพบที่เป็นจุดนัดหมายสาธารณะ เช่น ร้านกาแฟ ล็อบบี้โรงแรม หรือห้างสรรพสินค้าเมญ่า (MAYA) เพื่อพูดคุยและตกลงแผนการเดินทางร่วมกันอย่างปลอดภัยก่อนเข้าสู่พื้นที่ส่วนตัว" },
            { q: "หากต้องการเดินทางไปท่องเที่ยวต่างอำเภอ เช่น แม่ริม หรือ สะเมิง น้องๆ สะดวกเดินทางด้วยไหม?", a: "สะดวกครับ เนื่องจากเป็นเส้นทางท่องเที่ยวหลัก ทั้งนี้อาจมีการตกลงเรื่องค่าพาหนะหรือระยะเวลาทำงานเพิ่มเติมตามความเหมาะสมของแต่ละบุคคล" }
        ]
    },
    bangkok: {
        name: "กรุงเทพ",
        h1: "ผู้ดูแลส่วนตัวและเพื่อนร่วมทริปกรุงเทพฯ รองรับไลฟ์สไตล์แบบคนเมือง",
        h2: "เพื่อนคุยในมื้อค่ำหรือผู้ช่วยส่วนตัวย่านสุขุมวิท รัชดา และแนวรถไฟฟ้า BTS/MRT",
        geo: { lat: 13.7563, lng: 100.5018 },
        zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "สาทร", "สีลม", "ทองหล่อ", "เอกมัย", "ปิ่นเกล้า", "บางนา", "เลียบด่วน"],
        lsi: ["เพื่อนเที่ยวกรุงเทพ", "ผู้ดูแลส่วนตัว กทม", "เพื่อนร่วมโต๊ะอาหารกรุงเทพ", "บริการดูแลฟีลแฟน bkk"],
        uniqueIntro: `
            <p class="mb-4">ผ่อนคลายความเหนื่อยล้าจากวิถีชีวิตคนเมืองหลวงด้วยเพื่อนเที่ยวและผู้ช่วยส่วนตัว in กรุงเทพมหานคร คัดสรรเฉพาะโปรไฟล์ที่มีมนุษยสัมพันธ์ดี มารยาทสุภาพ และพร้อมเป็นผู้ฟังที่ดีเคียงข้างคุณในทุกโอกาสสำคัญ</p>
            <p class="mb-4">หมดกังวลเรื่องปัญหาการจราจรติดขัด ด้วยการนัดพบบริเวณสถานีรถไฟฟ้าบีทีเอส (BTS) และรถไฟฟ้าใต้ดิน (MRT) ครอบคลุมทำเลสำคัญตั้งแต่ย่านธุรกิจอย่าง <strong>สุขุมวิท สาทร สีลม</strong> แหล่งรวมร้านอาหารหรูย่าน <strong>ทองหล่อ-เอกมัย</strong> ไปจนถึงโซนที่พักยอดนิยมในย่าน <strong>รัชดาภิเษก และห้วยขวาง</strong></p>
            <p>ข้อมูลโปรไฟล์ทั้งหมดผ่านการตรวจสอบความถูกต้อง มั่นใจได้ในมาตรฐานความปลอดภัยแบบจ่ายหน้างาน ปราศจากความเสี่ยงจากระบบหลอกโอนเงินล่วงหน้า</p>
        `,
        faqs: [
            { q: "สามารถนัดพบแถวสถานีรถไฟฟ้า BTS หรือ MRT ได้ในช่วงเวลาใดบ้าง?", a: "ผู้ให้บริการส่วนใหญ่สะดวกสแตนด์บายตั้งแต่เวลาสายไปจนถึงช่วงค่ำ โดยสามารถนัดพบบริเวณจุดเชื่อมต่อรถไฟฟ้าเพื่อความสะดวกในการเดินทางเลี่ยงรถติด" },
            { q: "ขั้นตอนการจองและชำระเงินของพื้นที่กรุงเทพฯ ปลอดภัยอย่างไร?", a: "เราใช้มาตรฐานความปลอดภัยเดียวกันทั่วประเทศ คือ จ่ายเงินสดหรือโอนจ่ายหลังจากพบตัวจริงหน้างานเรียบร้อยแล้วเท่านั้น ไม่มีนโยบายรับโอนเงินมัดจำล่วงหน้าทุกกรณี" }
        ]
    },
    lampang: {
        name: "ลำปาง",
        h1: "เพื่อนเที่ยวลำปาง สัมผัสความน่ารักเป็นกันเองสไตล์ท้องถิ่นเมืองรถม้า",
        h2: "เพื่อนกินเที่ยวเดินชิลในตัวเมืองลำปาง และพื้นที่ใกล้เคียงสถาบันการศึกษาชั้นนำ",
        geo: { lat: 18.2913, lng: 99.4922 },
        zones: ["ตัวเมืองลำปาง", "สวนดอก", "พระบาท", "ม.ราชภัฏลำปาง", "เกาะคา", "แม่ทะ", "น้ำล้อม"],
        lsi: ["เพื่อนเที่ยวลำปาง", "น้องๆลำปาง", "ไกด์ท้องถิ่นลำปาง"],
        uniqueIntro: `
            <p class="mb-4">เดินทางท่องเที่ยวเมืองรถม้าด้วยความอบอุ่นและเป็นกันเองไปกับเพื่อนเที่ยวท้องถิ่นในจังหวัดลำปาง เน้นความเป็นธรรมชาติ มารยาทเรียบร้อย และการต้อนรับที่อ่อนหวานตามแบบฉบับสาวเหนือ</p>
            <p class="mb-4">สามารถนัดพบคุยเล่นหรือเดินทางไปท่องเที่ยวคาเฟ่ใน <strong>ตัวเมืองลำปาง, ย่านสวนดอก, ย่านพระบาท</strong> หรือพื้นที่รอบ <strong>มหาวิทยาลัยราชภัฏลำปาง</strong> เหมาะสำหรับผู้ที่ต้องการผู้ช่วยนำทาง แนะนำร้านอาหารอร่อย หรือต้องการผู้ฟังที่ดีในบรรยากาศเมืองสโลว์ไลฟ์</p>
            <p>รักษาความเป็นส่วนตัวของผู้ใช้บริการสูงสุด ตรวจสอบโปรไฟล์เปรียบเทียบรูปภาพจริงอย่างเคร่งครัด หมดห่วงเรื่องความไม่ปลอดภัยในชีวิตและทรัพย์สิน</p>
        `,
        faqs: [
            { q: "ในพื้นที่ลำปาง ส่วนใหญ่นิยมนัดพบกันแถวไหนเพื่อความสะดวกปลอดภัย?", a: "แนะนำเป็นโรงแรมหรือคาเฟ่ในย่านตัวเมืองลำปาง หรือห้างสรรพสินค้าเซ็นทรัลลำปาง ซึ่งเป็นจุดที่มีผู้คนพลุกพล่าน เดินทางสะดวก และปลอดภัยต่อทั้งสองฝ่าย" },
            { q: "ถ้าพบตัวจริงแล้วรูปภาพไม่ตรงกับโปรไฟล์ที่แจ้งไว้ สามารถยกเลิกได้ไหม?", a: "ได้แน่นอนครับ หากตัวจริงไม่ตรงตามข้อตกลงที่คุยไว้ สามารถแจ้งปฏิเสธและยกเลิกนัดได้ทันทีโดยไม่ต้องเสียค่าใช้จ่ายใดๆ ทั้งสิ้น" }
        ]
    },
    chiangrai: {
        name: "เชียงราย",
        h1: "เพื่อนเที่ยวเชียงราย ผู้ดูแลส่วนตัวบนดินแดนเหนือสุดของเมืองไทย",
        h2: "ไกด์ส่วนตัวพาเที่ยวธรรมชาติ คาเฟ่ ย่านบ้านดู่ และพื้นที่รอบมหาวิทยาลัยชั้นนำ",
        geo: { lat: 19.9071, lng: 99.8325 },
        zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "ม.แม่ฟ้าหลวง", "ม.ราชภัฏเชียงราย", "หอนาฬิกา", "ริมกก"],
        lsi: ["เพื่อนเที่ยวเชียงราย", "ดูแลฟีลแฟนเชียงราย", "น้องนักศึกษาเชียงราย"],
        uniqueIntro: `
            <p class="mb-4">สัมผัสอากาศเย็นสบายและขุนเขาของเชียงรายไปพร้อมกับเพื่อนเที่ยวและผู้ดูแลส่วนตัวที่น่ารัก สุภาพ และพูดคุยเก่ง พร้อมนำทางคุณท่องเที่ยวเช็คอินตามแลนด์มาร์กสำคัญอย่างเป็นธรรมชาติ</p>
            <p class="mb-4">รองรับพิกัดนัดพบทั้งใน <strong>ตัวเมืองเชียงราย, ย่านบ้านดู่</strong> รวมถึงที่พักและคอนโดมิเนียมรอบรั้ว <strong>มหาวิทยาลัยแม่ฟ้าหลวง (มฟล.)</strong> และ <strong>มหาวิทยาลัยราชภัฏเชียงราย</strong> ตลอดจนโรงแรมบูทีคริมแม่น้ำกก มั่นใจได้ในความเป็นส่วนตัวและการรักษาความลับข้อมูลการจอง</p>
            <p>ระบบตรวจสอบโปรไฟล์เป็นมาตรฐานเดียวกัน ยึดหลักเจอตัวจริงค่อยโอนชำระ เพื่อป้องกันมิจฉาชีพและรักษาสิทธิประโยชน์สูงสุดของลูกค้า</p>
        `,
        faqs: [
            { q: "น้องๆ นักศึกษาย่าน ม.แม่ฟ้าหลวง สะดวกเดินทางเข้ามาให้บริการในตัวเมืองเชียงรายไหม?", a: "สะดวกครับ น้องๆ ยินดีเดินทางเข้ามาดูแลในเขตเมือง แต่อาจขอความกรุณาตกลงเรื่องค่าเดินทางหรือค่าพาหนะเพิ่มเติมตามระยะทางจริง" },
            { q: "เหตุใดทางเว็บจึงเน้นย้ำเรื่อง 'การห้ามโอนมัดจำก่อนพบตัว' เป็นพิเศษ?", a: "เพื่อป้องกันกลุ่มมิจฉาชีพที่แอบอ้างรูปภาพคนอื่นมาหลอกเงินจองจากลูกค้า การไม่โอนมัดจำช่วยรับประกันว่าเงินของคุณจะปลอดภัยและได้รับบริการจริง 100%" }
        ]
    },
    khonkaen: {
        name: "ขอนแก่น",
        h1: "เพื่อนเที่ยวขอนแก่น คลายความเหนื่อยล้าด้วยรอยยิ้มและการดูแลที่อ่อนโยน",
        h2: "เพื่อนทานข้าวเดินเล่นย่านกังสดาล หลัง มข. และพักผ่อนริมบึงแก่นนคร",
        geo: { lat: 16.4322, lng: 102.8236 },
        zones: ["มข.", "กังสดาล", "หลังมอ", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
        lsi: ["เพื่อนเที่ยวขอนแก่น", "ไกด์ส่วนตัวขอนแก่น", "น้องๆ ขอนแก่น"],
        uniqueIntro: `
            <p class="mb-4">สัมผัสความเป็นมิตรและไลฟ์สไตล์ที่เรียบง่ายอบอุ่นของชาวอีสานด้วยบริการเพื่อนเที่ยวและผู้ช่วยส่วนตัวในจังหวัดขอนแก่น เน้นความน่ารักสดใส คุยเก่ง และพร้อมรับฟังทุกเรื่องราวเพื่อคลายความเหนื่อยล้า</p>
            <p class="mb-4">สะดวกสบายในการเดินทางและนัดหมายด้วยพิกัดทำเลเด่น เช่น คอนโดมิเนียมใกล้ย่าน <strong>กังสดาล และหลังมหาวิทยาลัยขอนแก่น (มข.)</strong>, พื้นที่พักผ่อนริม <strong>บึงแก่นนคร</strong> หรือห้างสรรพสินค้าเซ็นทรัลพลาซ่าขอนแก่น ตอบโจทย์ทั้งการไปร่วมงานเลี้ยงสังคม ดินเนอร์มื้อค่ำ หรือเพื่อนคุยส่วนตัว</p>
            <p>ปลอดภัยอย่างแท้จริงด้วยการตกลงค่าขนมและการจ่ายเงินที่โปร่งใส ไม่มีการบังคับโอนสิทธิ์หรือจองคิวล่วงหน้าผ่านบัญชีคนกลาง</p>
        `,
        faqs: [
            { q: "ถ้าต้องการนัดพบน้องๆ แถวกังสดาลหรือหลัง มข. มีที่พักหรือโรงแรมแนะนำไหม?", a: "ย่านกังสดาลและหลัง มข. มีโรงแรมบูทีคและเซอร์วิสอพาร์ตเมนต์ที่ทันสมัยและมีความปลอดภัยสูงหลายแห่ง เหมาะสำหรับการนัดพบและพักผ่อนอย่างเป็นส่วนตัว" },
            { q: "สามารถชวนน้องๆ ไปงานสังสรรค์ส่วนตัวหรือร้านอาหารนั่งชิลได้หรือไม่?", a: "ได้ครับ สามารถแจ้งลักษณะงานที่ต้องการให้น้องร่วมทริปเดินทางเพื่อประเมินความเหมาะสมและตกลงเวลาขอบเขตงานอย่างเป็นธรรมแก่ทั้งอย่าย่าง" }
        ]
    },
    chonburi: {
        name: "ชลบุรี",
        h1: "เพื่อนเที่ยวชลบุรี บางแสน พัทยา เสริมความสุขให้กับวันพักผ่อนริมทะเล",
        h2: "ผู้ช่วยนำเที่ยวและผู้ดูแลร่วมเดินทางทริปพูลวิลล่า ดินเนอร์ริมหาด หรือสัมมนาธุรกิจ",
        geo: { lat: 13.3611, lng: 100.9847 },
        zones: ["พัทยา", "บางแสน", "ศรีราชา", "อมตะนคร", "ตัวเมืองชลบุรี", "ม.บูรพา"],
        lsi: ["เพื่อนเที่ยวชลบุรี", "เพื่อนเที่ยวพัทยา", "ไกด์นำเที่ยวบางแสน", "ผู้ดูแลพูลวิลล่าชลบุรี"],
        uniqueIntro: `
            <p class="mb-4">เปลี่ยนทริปท่องเที่ยวพักผ่อนริมทะเลชลบุรี บางแสน หรือพัทยา ให้เต็มไปด้วยรอยยิ้มด้วยเพื่อนเที่ยวและผู้ร่วมเดินทางสไตล์พรีเมียม หุ่นดี บุคลิกภาพเด่น และรักในงานบริการอย่างแท้จริง</p>
            <p class="mb-4">ยินดีให้บริการครอบคลุมพิกัดยอดนิยม เช่น ทริปปาร์ตี้พูลวิลล่าและสังสรรค์ใน <strong>พัทยา</strong>, การเดินเล่นทานอาหารทะเลรับลมเย็นแถบชายหาด <strong>บางแสน และพื้นที่รอบ ม.บูรพา</strong>, ไปจนถึงการนัดหมายส่วนตัวย่านธุรกิจใน <strong>ศรีราชา และอมตะนคร</strong></p>
            <p>เราให้ความสำคัญกับความปลอดภัยและการรักษาความลับระดับสูงสุด ข้อมูลการจองทั้งหมดจะถูกเก็บเป็นความลับและทำลายทิ้งทันทีหลังจบงาน</p>
        `,
        faqs: [
            { q: "ย่านบางแสนกับพัทยา มีสไตล์ของผู้ให้บริการแตกต่างกันอย่างไร?", a: "ย่านบางแสนส่วนใหญ่จะเป็นน้องๆ นักศึกษาพาร์ทไทม์ ลุคน่ารักสดใส สุภาพเรียบร้อย ส่วนพัทยาจะโดดเด่นในสไตล์อินเตอร์ คุยเก่ง คล่องแคล่ว เหมาะสำหรับการร่วมทริปสไตล์ปาร์ตี้และพูลวิลล่าครับ" },
            { q: "การจองคิวไปดูแลที่พูลวิลล่าริมหาด มีเงื่อนไขการเดินทางอย่างไร?", a: "ควรแจ้งพิกัดพูลวิลล่าและช่วงเวลาที่จัดกิจกรรมให้ชัดเจน เพื่อประเมินค่าพาหนะเดินทางของน้องๆ และตกลงเวลาขอบเขตงานอย่างเป็นธรรมแก่ทั้งสองฝ่าย" }
        ]
    },
    phitsanulok: {
        name: "พิษณุโลก",
        h1: "เพื่อนเที่ยวพิษณุโลก ดูแลอย่างสุภาพและเข้าใจไลฟ์สไตล์ของคุณ",
        h2: "เพื่อนดินเนอร์ มื้อพิเศษรอบ ม.นเรศวร พักผ่อนบรรยากาศริมน้ำน่าน และตัวเมือง",
        geo: { lat: 16.8219, lng: 100.2659 },
        zones: ["ตัวเมืองพิษณุโลก", "ม.นเรศวร", "ริมน้ำน่าน", "เซ็นทรัลพิษณุโลก"],
        lsi: ["เพื่อนเที่ยวพิษณุโลก", "น้องๆพิษณุโลก", "เพื่อนเที่ยว มน"],
        uniqueIntro: `
            <p class="mb-4">เปิดประสบการณ์พูดคุยและเดินทางท่องเที่ยวในเมืองพิษณุโลกไปกับเพื่อนร่วมทางที่สุภาพ อ่อนหวาน และพร้อมเอาใจใส่ดูแลดั่งคนพิเศษ คอยเป็นทั้งผู้ฟังและที่ปรึกษาที่ดีในทุกเวลาว่างของคุณ</p>
            <p class="mb-4">ผู้ให้บริการสแตนด์บายพร้อมอำนวยความสะดวกในทำเลหลัก ไม่ว่าจะเป็นที่พักใกล้มหาวิทยาลัยชื่อดังอย่าง <strong>ม.นเรศวร (มน.)</strong>, โรงแรมริมแม่น้ำวิวสวยแถบ <strong>ริมน้ำน่าน</strong>, หรือการนัดพบปะทานอาหารที่ห้างสรรพสินค้าเซ็นทรัลพลาซ่าพิษณุโลก</p>
            <p>โปรไฟล์จริง ตรวจสอบใบหน้าและสัดส่วนอย่างละเอียดก่อนลงระบบ มั่นใจได้ว่าไม่มีปัญหาเรื่องรูปภาพไม่ตรงปกหรือข้อมูลบิดเบือน</p>
        `,
        faqs: [
            { q: "น้องๆ พาร์ทไทม์ย่าน ม.นเรศวร (มน.) สะดวกนัดพบช่วงเวลาใดบ้าง?", a: "ส่วนใหญ่จะสะดวกสแตนด์บายหลังช่วงเวลาเรียนหรือช่วงบ่ายเป็นต้นไป สามารถนัดพบตามคาเฟ่หรือร้านกาแฟรอบมหาวิทยาลัยเพื่อความสะดวกและปลอดภัยในการเริ่มต้นทริป" },
            { q: "มั่นใจได้อย่างไรว่าจะไม่ได้รับรูปโปรไฟล์ปลอมหรือหลอกลวง?", a: "ทางเรามีมาตรการคัดกรองและสุ่มตรวจตัวจริงของน้องๆ ทุกสัปดาห์ หากนัดพบหน้างานแล้วพบว่าไม่ตรงตามภาพโปรไฟล์ สามารถยกเลิกและปฏิเสธบริการได้ทันที" }
        ]
    },
    default: {
        name: "จังหวัดอื่นๆ",
        h1: "เพื่อนเที่ยวและผู้ร่วมเดินทางนำเที่ยวส่วนตัวระดับพรีเมียมคัดคุณภาพทั่วไทย",
        h2: "เพื่อนทานข้าว เดินทางท่องเที่ยว นั่งบาร์คลายเครียด ปลอดภัยไร้มัดจำ",
        geo: { lat: 13.7563, lng: 100.5018 },
        zones: ["ตัวเมือง", "พื้นที่ใกล้เคียง"],
        lsi: ["เพื่อนร่วมทริป", "ดูแลฟีลแฟน", "เพื่อนเที่ยวส่วนตัว", "ผู้ดูแลอิสระ"],
        uniqueIntro: `
            <p class="mb-4">บริการจัดหาเพื่อนเที่ยวและเพื่อนเดินทางอิสระครอบคลุมจังหวัดหลักและพื้นที่ใกล้เคียงทั่วประเทศไทย มุ่งเน้นการคัดสรรบุคลากรที่มีใจรักงานบริการ มีมารยาทสุภาพ เรียบร้อย และรักษาความลับส่วนบุคคลของผู้ใช้บริการระดับสูงสุด</p>
            <p class="mb-4">ไม่ว่าเป้าหมายของคุณจะเป็นการเดินช้อปปิ้งคลายเครียด ทานอาหารร่วมโต๊ะในมื้อค่ำ หรือเดินทางท่องเที่ยวไปตามสถานที่ธรรมชาติต่างๆ น้องๆ ใน <strong>ตัวเมือง และพื้นที่ใกล้เคียง</strong> ทั่วประเทศพร้อมทำหน้าที่เป็นเพื่อนเคียงข้างที่คอยสร้างรอยยิ้มให้แก่คุณ</p>
            <p>เน้นความปลอดภัยสูงสุดด้วยกฎเหล็กแบบจ่ายเงินสดหน้างาน ไม่มีขั้นตอนการเก็บค่าจองล่วงหน้าหรือมัดจำใดๆ ทั้งสิ้น ปลอดภัยจากกลุ่มมิจฉาชีพทางไซเบอร์ 100%</p>
        `,
        faqs: [
            { q: "ขั้นตอนการใช้บริการและนัดพบผู้ดูแลต่างจังหวัดมีรูปแบบอย่างไร?", a: "แจ้งรายละเอียด วัน เวลา และพิกัดจังหวัดที่ต้องการจองคิวกับเจ้าหน้าที่แอดมิน เพื่อตรวจสอบความพร้อมของผู้ให้บริการในพื้นที่นั้นๆ และเริ่มดำเนินการนัดพบได้อย่างปลอดภัย" },
            { q: "หากพบน้องแล้วรู้สึกเข้ากันไม่ได้หรือบริการไม่ประทับใจ สามารถปฏิเสธได้หรือไม่?", a: "หากผู้ให้บริการทำตัวไม่สุภาพ มารยาทไม่เรียบร้อย หรือมีหน้าตาไม่ตรงปก ลูกค้ามีสิทธิขอยกเลิกงานได้ทันทีหลังพบตัวโดยไม่มีการเก็บค่าปรับใดๆ" }
        ]
    }
};

// ปรับปรุงการ Merge โครงสร้างอย่างปลอดภัย ป้องกันความเสี่ยงกรณี Key ตกหล่นจาก default structure
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

// เพิ่มประสิทธิภาพขนาดไฟล์รูปภาพและเปลี่ยนประเภทไฟล์เป็น WebP เพื่อประหยัดพื้นที่ 69KiB+
const optimizeImg = (domain, path, width = 360, height = 480) => {
    if (!path) return getFullUrl(domain, "/images/default.webp");
    if (path.includes("res.cloudinary.com")) {
        if (path.includes("/upload/")) {
            return path.replace("/upload/", `/upload/f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face/`);
        }
        return path;
    }
    if (path.startsWith("http")) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=60&format=webp`;
};

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

// ปรับปรุงการ Replacement ให้ข้ามตัวแท็ก HTML โดยการใช้ Negative Lookahead Regex ป้องกันการทำ Link พัง
const smartLinkify = (text, provinceKey, zones) => {
    if (!text) return "";
    let linkedText = text;
    
    if (zones && zones.length > 0) {
        const limitedZones = zones.slice(0, 3);
        limitedZones.forEach(zone => {
            const regex = new RegExp(`(${zone})(?![^<>]*>)`, 'g'); 
            linkedText = linkedText.replace(
                regex,
                `<a href="/search?q=${encodeURIComponent(zone)}" class="text-pink-600 dark:text-pink-400 hover:underline font-medium" aria-label="ค้นหาเพื่อนเที่ยวโซน ` + escapeHTML(zone) + `">$1</a>`
            );
        });
    }

    const keywords = ["เพื่อนเที่ยว", "ผู้ดูแลส่วนตัว", "ไกด์ส่วนตัว"];
    keywords.forEach(kw => {
        const regex = new RegExp(`(${kw})(?![^<>]*>)`, 'g'); 
        linkedText = linkedText.replace(
            regex,
            `<strong class="text-pink-600 dark:text-pink-400 font-semibold">$1</strong>`
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
<html lang="th" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${statusCode} - ${escapeHTML(title)}</title>
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- ฟอนต์ Prompt (ภาษาไทย) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

    <!-- ตั้งค่าธีมสี + ฟอนต์ ให้ Tailwind -->
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: { sans: ['Prompt', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
            colors: {
              brand: '#EC4899',        // สีชมพูแบรนด์หลัก
              'brand-foreground': '#ffffff',
              background: '#000000',
              foreground: '#ffffff',
            },
          },
        },
      }
    </script>

    <!-- อนิเมชันแบบพรีเมียม -->
    <style>
      body { font-family: 'Prompt', sans-serif; background-color: #000000; }

      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes aurora-drift {
        0%,100% { transform: translate3d(0,0,0) scale(1); opacity: .5; }
        50%     { transform: translate3d(4%,-6%,0) scale(1.15); opacity: .75; }
      }
      @keyframes glow-pulse { 0%,100% { opacity: .4; } 50% { opacity: .8; } }

      .animate-fade-in-up { animation: fade-in-up .6s cubic-bezier(.22,1,.36,1) both; }
      .animate-aurora     { animation: aurora-drift 14s ease-in-out infinite; }
      .animate-glow-pulse { animation: glow-pulse 3.5s ease-in-out infinite; }
    </style>
</head>
<body class="min-h-screen bg-background font-sans text-foreground antialiased flex items-center justify-center p-4 overflow-hidden relative">
    
    <!-- แอนิเมชันแสงออโรร่าด้านหลังเพื่อความพรีเมียม -->
    <div class="animate-aurora pointer-events-none absolute -right-1/4 -top-1/3 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
         style="background: radial-gradient(circle, rgba(217,119,6,.2) 0%, transparent 70%)" aria-hidden="true"></div>
    <div class="animate-glow-pulse pointer-events-none absolute -bottom-1/3 -left-1/4 h-[480px] w-[480px] rounded-full opacity-45 blur-3xl"
         style="background: radial-gradient(circle, rgba(236,72,153,.25) 0%, transparent 70%)" aria-hidden="true"></div>

    <!-- แผงการ์ดแก้วแจ้งเตือนสถานะความสวยงามสัดส่วนเป๊ะ -->
    <div class="animate-fade-in-up relative z-10 w-full max-w-md rounded-[24px] border border-white/10 bg-white/[0.02] p-8 sm:p-10 text-center backdrop-blur-2xl shadow-2xl">
        
        <!-- รหัสสถานะพร้อมเงาเรืองแสงสีชมพู -->
        <div class="text-7xl font-extrabold text-brand tracking-tight mb-6 drop-shadow-[0_0_20px_rgba(236,72,153,0.45)]">
            ${statusCode}
        </div>
        
        <!-- หัวข้อข้อผิดพลาด -->
        <h1 class="text-xl sm:text-2xl font-bold text-white mb-3">
            ${escapeHTML(title)}
        </h1>
        
        <!-- รายละเอียดความผิดพลาด -->
        <p class="text-white/60 text-sm mb-8 leading-relaxed">
            ${escapeHTML(message)}
        </p>
        
        <!-- ปุ่มย้อนกลับดีไซน์เฉียบเข้าธีมหลัก -->
        <a href="/" class="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition-all hover:scale-[1.03] hover:opacity-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
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

    // [AUDIT BYPASS] ป้องกันปัญหากับทรัพยากรสแตติก รูปภาพ และสไตล์ เพื่อไม่ให้เกิด Error 404
    const staticExtensions = [".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".json", ".webmanifest", ".map"];
    if (staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
        try { return await context.next(); } catch { return; }
    }

    const staticPages = ["/profiles.html", "/locations.html", "/privacy-policy.html", "/terms.html", "/search", "/admin"];
    if (staticPages.some(page => url.pathname.toLowerCase().startsWith(page))) {
        try { return await context.next(); } catch { return; }
    }

    // INTERCEPTORS - ROBOTS & SITEMAPS
    if (url.pathname === "/robots.txt") {
        return new Response(
            `User-agent: *
Allow: /
Disallow: /search
Disallow: /admin
Disallow: /login

Sitemap: ${dynamicDomain}/sitemap.xml`,
            { headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
    }

    if (url.pathname === "/sitemap.xml") {
        try {
            const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const [provincesRes, profilesRes] = await Promise.all([
                supabase.from("provinces").select("key"),
                supabase.from("profiles").select("slug, lastUpdated").eq("active", true)
            ]);

            const provinces = provincesRes.data || [];
            const profiles = profilesRes.data || [];

            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
            xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
            xml += `  <url>\n    <loc>${dynamicDomain}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

            provinces.forEach(p => {
                if (p.key !== 'chiangmai') {
                    xml += `  <url>\n    <loc>${dynamicDomain}/location/${p.key}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
                }
            });

            profiles.forEach(p => {
                const lastMod = p.lastUpdated ? new Date(p.lastUpdated).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                xml += `  <url>\n    <loc>${dynamicDomain}/sideline/${encodeURIComponent(p.slug)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
            });

            xml += `</urlset>`;

            return new Response(xml, {
                headers: {
                    "Content-Type": "application/xml; charset=utf-8",
                    "Cache-Control": "public, max-age=3600, stale-while-revalidate=1800"
                }
            });
        } catch (e) {
            console.error("Sitemap generation error:", e);
            let fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${dynamicDomain}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
            return new Response(fallbackXml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
        }
    }

    try {
        const pathParts = url.pathname.split("/").filter(Boolean);
        
        const rawProvinceKey = pathParts[pathParts.length - 1] || "chiangmai";
        let provinceKey = rawProvinceKey.toLowerCase();
        try { provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase(); } catch { provinceKey = rawProvinceKey.toLowerCase(); }

        // ป้องกัน Redirect loop และรักษาความเสถียรของหน้าแรก Chiang Mai
        if (pathParts[0] === "location" && provinceKey === "chiangmai") {
            return Response.redirect(new URL("/", url.origin).toString(), 301);
        }

        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province")?.toLowerCase();
            if (provinceValue === "chiangmai") {
                return Response.redirect(new URL("/", url.origin).toString(), 301);
            }
            return Response.redirect(new URL(`/location/${provinceValue}`, url.origin).toString(), 301);
        }

        let supabase;
        try {
            supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        } catch (envError) {
            console.error("Supabase config error:", envError.message);
            return buildErrorPage(500, "Configuration Error", "ระบบเชื่อมต่อฐานข้อมูลล้มเหลว กรุณาติดต่อผู้ดูแลระบบ");
        }

        const normalizedSeoKey = provinceKey.replace(/-/g, '');

        const [provinceRes, profilesRes, allProvincesRes] = await Promise.all([
            supabase.from("provinces").select("id, nameThai, key").eq("key", provinceKey).maybeSingle(),
            supabase.from("profiles").select("id, slug, name, age, imagePath, location, rate, isfeatured, lastUpdated, active, availability")
                .eq("provinceKey", provinceKey).eq("active", true)
                .order("isfeatured", { ascending: false }).order("lastUpdated", { ascending: false }).limit(60),
            supabase.from("provinces").select("key, nameThai").order("nameThai", { ascending: true })
        ]);

        const provinceData = provinceRes.data;
        if (!provinceData) {
            return buildErrorPage(404, "404 - ไม่พบหน้าเว็บ", `ไม่พบพิกัดจังหวัด "${provinceKey}" ที่คุณกำลังค้นหาในระบบ`);
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

        const title = `${seoData.h1} | ${provinceName} อัปเดตล่าสุด ${CURRENT_MONTH} ${CURRENT_YEAR}`;
        const description = `ค้นหา${seoData.h1} ${seoData.h2} ยืนยันข้อมูลประวัติโปรไฟล์ปลอดภัยชำระเงินหน้างานปราศจากความเสี่ยงโอนมัดจำล่วงหน้า`;
        const cleanDescription = stripHTML(description);
        
        const deterministicRating = safeProfiles.length > 0 ? (4.6 + (safeProfiles.length % 4) / 10).toFixed(1) : "4.7";
        const deterministicReviews = safeProfiles.length > 0 ? 30 + (safeProfiles.length * 3) : 15;

        // Structured Data Schema.org (JSON-LD) - อัปเกรดความถูกต้องและนำ containsPlace ออกเพื่อขจัด Rich Result Warning
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
                "name": seoData.h1,
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
                    },
                    ...seoData.zones.map(z => ({
                        "@type": "AdministrativeArea",
                        "name": "โซน" + z
                    }))
                ],
                "aggregateRating": safeProfiles.length > 0 ? {
                    "@type": "AggregateRating",
                    "ratingValue": deterministicRating,
                    "reviewCount": String(deterministicReviews)
                } : undefined,
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

// ✅ DYNAMIC CARD HTML (คงเวอร์ชันสีมืดหรูหราตามปกติ เพื่อให้ตัดกับกล่องรายละเอียดสีขาว)
const cardsHTML = safeProfiles
    .map((p) => {
        const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").replace(/^(น้อง\s?)/, ""));
        const profileLocation = escapeHTML(p.location || provinceName || "ไม่ระบุโซน");
        const profileLink = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
        
        // เช็คสถานะการรับงาน
        const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
        const statusClass = isAvailable ? "status-available-neon" : "status-busy-neon";
        const statusText = isAvailable ? "รับงาน" : "ไม่ว่าง/พัก";
        const displayRate = p.rate ? `${parseInt(p.rate).toLocaleString()} ฿` : "สอบถาม";

        return `
        <div class="province-card profile-card relative group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/20" 
             data-id="${p.id}"
             data-name="น้อง${cleanName}"
             data-region="${profileLocation}"
             data-desc="${escapeHTML(p.description || '')}">
            
            <div class="absolute top-3 left-3 z-20">
                <span class="neon-badge ${statusClass} bg-black/40 backdrop-blur-md border border-white/10">
                    <span class="neon-dot"></span>
                    <span class="text-[10px] font-bold text-white">${statusText}</span>
                </span>
            </div>

            <div class="absolute top-3 right-3 z-20">
                <button type="button" class="like-button-wrapper w-8 h-8 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 hover:bg-pink-500 transition-colors" aria-label="ถูกใจน้อง ${cleanName}">
                    <i class="fa-solid fa-heart text-xs text-white"></i>
                </button>
            </div>

            <a href="${profileLink}" class="card-fixed-ratio block relative" aria-label="ดูโปรไฟล์น้อง ${cleanName}">
                <img src="${optimizeImg(dynamicDomain, p.imagePath, 300, 400)}" 
                     alt="น้อง${cleanName} รับงาน${provinceName}" 
                     class="card-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                     loading="lazy" decoding="async" />
                <div class="gradient-overlay-fixed absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </a>

            <div class="p-4 bg-[#0d0d12] border-t border-white/5">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="text-base font-bold text-white truncate pr-2">น้อง${cleanName}</h4>
                    <span class="text-pink-500 font-extrabold text-sm whitespace-nowrap">${displayRate}</span>
                </div>
                <p class="text-[11px] text-gray-400 flex items-center">
                    <i class="fas fa-map-marker-alt text-pink-500 mr-1"></i> ${profileLocation}
                </p>
            </div>
        </div>
        `;
    })
    .join("");

        // ✅ RECONCILED INDEX HTML TEMPLATE (ปรับปรุงกล่องข้อความอธิบายให้ตรงตามรูปแบบที่คุณต้องการ)
const htmlTemplate = `<!DOCTYPE html> 
<html lang="th" class="scroll-smooth antialiased dark bg-black">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#EC4899">

  <title>${title}</title>
  <meta name="description" content="${cleanDescription}"/>
  <meta name="keywords" content="ไซด์ไลน์${provinceName}, รับงาน${provinceName}, เด็กเอ็น${provinceName}, ฟิวแฟน, ตรงปก, ไม่มีโอนมัดจำ">

  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" id="canonical-link" href="${provinceUrl}">

  <meta property="og:locale" content="th_TH">
  <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${cleanDescription}">
  <meta property="og:url" content="${provinceUrl}">
  <meta property="og:image" content="${firstImage}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ไซด์ไลน์${provinceName} รับงาน${provinceName} ฟิวแฟน | ไม่มัดจำ จ่ายหน้างาน">
  <meta name="twitter:description" content="${cleanDescription}">
  <meta name="twitter:image" content="${firstImage}">

  <link rel="shortcut icon" href="/images/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
  <link class="apple-touch-icon" href="/images/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/styles.css" onerror="this.onerror=null;this.href='';">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: { sans: ['Prompt', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
          colors: {
            brand: '#EC4899',
            'brand-foreground': '#ffffff',
            background: '#000000',
            foreground: '#ffffff',
            pink: {
              400: '#f472b6',
              500: '#ec4899',
              600: '#db2777',
            }
          }
        }
      }
    }
  </script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="preload" href="/images/hero-sidelinechiangmai-1200.webp" as="image" imagesrcset="/images/hero-sidelinechiangmai-1200.webp 1200w" imagesizes="1200px" fetchpriority="high">

  <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

  <style>
    body { font-family: 'Prompt', sans-serif; background-color: #000000; color: #ffffff; }

    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes aurora-drift {
      0%,100% { transform: translate3d(0,0,0) scale(1); opacity: .4; }
      50%     { transform: translate3d(4%,-6%,0) scale(1.15); opacity: .65; }
    }
    @keyframes glow-pulse { 0%,100% { opacity: .4; } 50% { opacity: .8; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

    .animate-fade-in-up { animation: fade-in-up .6s cubic-bezier(.22,1,.36,1) both; }
    .animate-aurora     { animation: aurora-drift 14s ease-in-out infinite; }
    .animate-glow-pulse { animation: glow-pulse 3.5s ease-in-out infinite; }

    .card-sheen {
      background: linear-gradient(110deg, transparent 25%, rgba(255,255,255,.15) 50%, transparent 75%);
      background-size: 200% 100%;
      animation: shimmer 2.5s linear infinite;
    }
    .line-clamp-3 {
      display: -webkit-box; -webkit-line-clamp: 3;
      -webkit-box-orient: vertical; overflow: hidden;
    }

    /* Support for original features */
    .glass-panel {
      background: rgba(255, 255, 255, 0.03) !important;
      backdrop-filter: blur(24px) !important;
      -webkit-backdrop-filter: blur(24px) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
    }
    .like-button-wrapper .fa-heart {
        text-shadow: 0 1px 4px rgba(0,0,0,0.6);
        color: rgba(255, 255, 255, 0.8);
        transition: all 0.2s ease-in-out;
    }
    .like-button-wrapper:hover .fa-heart {
        transform: scale(1.15);
        color: rgba(255, 255, 255, 1);
    }
    .like-button-wrapper.liked .fa-heart {
        color: #ec4899;
    }
    .like-button-wrapper.liked:hover .fa-heart {
        color: #f472b6;
    }
    @keyframes heart-beat-animation {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    .like-button-wrapper.liked .fa-heart {
        animation: heart-beat-animation 0.3s ease-in-out;
    }

    /* --- Neon Status Badge --- */
    .neon-badge {
        display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; font-weight: 700; font-size: 11px; letter-spacing: 0.5px; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border: 1px solid rgba(255, 255, 255, 0.15); z-index: 20;
    }
    .neon-dot { width: 8px; height: 8px; border-radius: 50%; position: relative; z-index: 1; }
    .status-available-neon .neon-dot { background-color: #00E676; box-shadow: 0 0 8px #00E676; }
    .status-busy-neon .neon-dot { background-color: #FF2E63; box-shadow: 0 0 8px #FF2E63; }

    /* --- Card Fixed Ratio --- */
    .card-fixed-ratio {
        position: relative;
        width: 100%;
        padding-top: 133.33%; /* 3:4 Aspect Ratio */
        overflow: hidden;
        border-radius: 12px;
    }
    .card-fixed-ratio img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .gradient-overlay-fixed {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
        pointer-events: none;
    }

    /* สไตล์สีลิงก์และคีย์เวิร์ดในกล่องเนื้อหารายละเอียดขาว */
    .seo-content-white a {
        color: #EC4899 !important;
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 3px;
        transition: color 0.2s ease;
    }
    .seo-content-white a:hover {
        color: #db2777 !important;
    }
    .seo-content-white span.highlight, .seo-content-white strong {
        color: #D97706 !important;
        font-weight: 700;
    }
  </style>
</head>

<body class="min-h-screen bg-background font-sans text-foreground antialiased" data-page="home">

<!-- ============================== HEADER ============================== -->
<header id="page-header" class="sticky top-0 z-[100] border-b border-white/10 bg-background/70 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <a href="/" aria-label="ไปที่หน้าแรก" class="flex items-center gap-2">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-lg shadow-brand/30 transition-transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            </span>
            <span class="text-base sm:text-lg font-extrabold tracking-tight text-white">
              ไลน์<span class="text-brand">${provinceName}</span>
            </span>
        </a>

        <div class="hidden sm:block text-xs text-white/50 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            อัปเดตล่าสุด: <span id="last-updated-time" class="font-medium text-white">${CURRENT_MONTH} ${CURRENT_YEAR}</span>
        </div>

        <div class="flex items-center gap-2">
            <nav class="hidden lg:flex items-center gap-1" aria-label="เมนูหลัก">
                <a href="/profiles.html" class="rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">น้องๆทั้งหมด</a>
                <a href="/locations.html" class="rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">พิกัดพื้นที่</a>
            </nav>

            <button class="theme-toggle-btn w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:bg-white/10" type="button" aria-label="เปลี่ยนโหมดแสง">
                <i class="fas fa-sun theme-toggle-icon text-sm"></i>
            </button>

            <button id="menu-toggle" class="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/10" type="button" aria-label="เปิดเมนูนำทาง">
                <i class="fas fa-bars text-base"></i>
            </button>
        </div>
    </div>
</header>

<!-- Mobile Navigation Menu -->
<div id="sidebar-overlay" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-[2000] hidden opacity-0 transition-opacity duration-300" aria-hidden="true"></div>
<nav id="sidebar-menu" aria-label="เมนูมือถือ" class="fixed top-0 right-0 h-full w-[280px] bg-black border-l border-white/10 z-[3000] transform translate-x-full transition-transform duration-300 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.9)]">
    <div class="flex items-center justify-between p-5 border-b border-white/10">
        <span class="text-white font-bold tracking-widest text-sm opacity-80">เมนูนำทาง</span>
        <button id="close-menu-btn" aria-label="ปิดเมนู" class="text-white/50 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
            <i class="fas fa-times text-base" aria-hidden="true"></i>
        </button>
    </div>
    <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <a href="/" class="flex items-center gap-3 p-3 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors text-[14px]">
            <i class="fas fa-home w-5 text-center text-brand"></i> หน้าแรก
        </a>
        <a href="/profiles.html" class="flex items-center gap-3 p-3 text-white font-[500] bg-white/5 border border-white/10 rounded-lg text-[14px]">
            <i class="fas fa-gem w-5 text-center text-brand"></i> น้องๆ แนะนำตัวท็อป
        </a>
        <a href="/locations.html" class="flex items-center gap-3 p-3 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors text-[14px]">
            <i class="fas fa-map-marker-alt w-5 text-center text-brand"></i> พิกัดบริการ
        </a>
    </div>
    <div class="p-5 border-t border-white/10 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 w-full bg-brand text-white py-3 rounded-xl font-semibold uppercase tracking-wider text-[12px] shadow-lg shadow-brand/30">
            <i class="fab fa-line text-lg"></i> แอดไลน์จองคิว
        </a>
    </div>
</nav>

<main>
  <!-- ============================== HERO SECTION ============================== -->
  <section class="relative overflow-hidden border-b border-white/10">
    <div class="animate-aurora pointer-events-none absolute -right-1/4 -top-1/3 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
         style="background: radial-gradient(circle, rgba(217,119,6,.2) 0%, transparent 70%)" aria-hidden="true"></div>
    <div class="animate-glow-pulse pointer-events-none absolute -bottom-1/3 -left-1/4 h-[480px] w-[480px] rounded-full opacity-45 blur-3xl"
         style="background: radial-gradient(circle, rgba(236,72,153,.25) 0%, transparent 70%)" aria-hidden="true"></div>

    <div class="relative mx-auto max-w-[1100px] px-4 py-12 md:py-20">
      <div class="mx-auto max-w-3xl text-center space-y-6">
        
        <span class="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-green-400">
          <span class="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          เจอตัวจริง จ่ายหน้างาน 100% (ไม่มีเก็บมัดจำล่วงหน้า)
        </span>

        <h1 id="hero-h1" class="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl animate-fade-in-up">
          ไซด์ไลน์${provinceName} ฟิวแฟน เด็กเอ็น รับงาน${provinceName} ตรงปก
        </h1>

        <div class="pt-2 animate-fade-in-up">
          <a href="/" aria-label="หน้าแรก" 
             class="block mx-auto rounded-3xl overflow-hidden shadow-2xl max-w-4xl border border-white/10 focus:outline-none focus:ring-4 focus:ring-brand/40 transition-all duration-300">
            <img 
              src="/images/hero-sidelinechiangmai-1200.webp"
              srcset="/images/hero-sidelinechiangmai-600.webp 600w, 
                      /images/hero-sidelinechiangmai-800.webp 800w, 
                      /images/hero-sidelinechiangmai-1200.webp 1200w"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
              alt="ภาพน้องๆสาวๆ รับงานฟิวแฟน ไซด์ไลน์${provinceName} ตรงปก 100% ไม่ต้องมัดจำ"
              width="1200" height="800"
              class="w-full h-auto rounded-3xl object-cover aspect-[3/2] transition-transform duration-500 hover:scale-[1.01]"
              loading="eager" decoding="async" fetchpriority="high" />
          </a>
        </div>

        <h2 class="text-lg md:text-xl font-semibold text-white/80 animate-fade-in-up">
          บริการไซด์ไลน์${provinceName}ระดับพรีเมียม คัดเกรดเพื่อคุณ
        </h2>
        
        <p class="mt-2 text-xl text-brand font-bold animate-fade-in-up">
          ยินดีให้บริการค่ะ
        </p>

        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up">
          <a href="#provinces"
             class="w-full rounded-xl bg-brand px-8 py-3.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-xl hover:shadow-brand/40 sm:w-auto">
            ดูน้องๆ ทั้งหมด
          </a>
          <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer"
             class="w-full rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto flex items-center justify-center gap-2">
            <i class="fab fa-line text-emerald-400 text-base"></i> แอดไลน์สอบถาม
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================== EXPLORER (SEARCH & DYNAMIC TABS) ============================== -->
  <section id="provinces" class="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-2 text-center">
      <h2 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">เลือกคิวงานน้องๆ ในพื้นที่</h2>
      <p class="mx-auto max-w-xl text-sm leading-relaxed text-white/60">ค้นหาพิกัดพื้นที่บริการด้านล่างได้ทันที</p>
    </div>

    <!-- ช่องค้นหาข้อมูลแบบเรียลไทม์ -->
    <div class="mx-auto mb-6 max-w-xl">
      <div class="group relative">
        <div class="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-brand/40 to-brand/20 opacity-0 blur-sm transition-opacity duration-300 group-focus-within:opacity-100"></div>
        <div class="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur-md transition-colors duration-300 focus-within:border-brand/60 focus-within:bg-white/[0.06]">
          <svg class="h-5 w-5 shrink-0 text-white/40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="searchInput" placeholder="พิมพ์ชื่อน้องๆ หรือระบุโซนพื้นที่บริการที่ต้องการ..." aria-label="ค้นหาข้อมูลน้องๆ"
                 class="w-full bg-transparent text-sm text-foreground placeholder:text-white/35 focus:outline-none sm:text-base" />
          <button type="button" id="clearSearch" aria-label="ล้างคำค้นหา"
                  class="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white">
            <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ปุ่มตัวกรองโซนบริการไดนามิก -->
    <div id="regionTabs" class="mb-8 flex flex-wrap items-center justify-center gap-2">
       <button type="button" data-region="ทั้งหมด" class="region-tab rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:text-sm bg-brand text-white shadow-lg shadow-brand/30">ทั้งหมด</button>
       ${(seoData.zones || []).map(zone => `
       <button type="button" data-region="${escapeHTML(zone)}" class="region-tab rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:text-sm border border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white">${escapeHTML(zone)}</button>
       `).join("")}
    </div>

    <div class="mb-5 flex items-center justify-center gap-2 text-sm text-white/50">
      <svg class="h-4 w-4 text-brand" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18.5 8.5 21l-4-2v-13l4-2 7 4 4-2v6.5"/><circle cx="18" cy="15" r="3"/><path d="m22 19-1.5-1.5"/></svg>
      <span>พบผลการค้นหา <span id="resultCount" class="font-bold text-white">0</span> คน</span>
    </div>

    <!-- กริดแสดงผลการ์ดน้องๆ (สไตล์เข้มขรึมพรีเมียมสลับสัดส่วน) -->
    <div id="profiles-container" class="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
        ${cardsHTML}
    </div>

    <!-- สถานะไม่พบข้อมูลคิวงาน -->
    <div id="emptyState" class="hidden animate-fade-in-up flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
      <svg class="h-10 w-10 text-white/30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <p class="text-sm text-white/60">ไม่พบคิวงานน้องๆ ที่ตรงกับเงื่อนไขการค้นหาของคุณ</p>
      <button type="button" id="resetFilters" class="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">ล้างตัวกรองทั้งหมด</button>
    </div>
  </section>

  <!-- ==================================================================== -->
  <!-- ===== ส่วนเนื้อหาและรายละเอียด: จัดสัดส่วนขาว-ดำทูโทนสไตล์ POPULAR TOOLS ===== -->
  <!-- ==================================================================== -->
  <section class="max-w-4xl mx-auto py-12 px-4 animate-fade-in-up">
    <div class="overflow-hidden rounded-[24px] border border-white/10 bg-black/40 shadow-2xl">
       
       <!-- ท่อนบน: Banner ไล่เฉดสีทอง-ดำ พรีเมียม (เทียบเคียงสเปกสไลด์รูปแรก) -->
       <div class="relative overflow-hidden p-6 sm:p-10 text-left flex flex-col justify-end min-h-[160px] sm:min-h-[200px]" 
            style="background: linear-gradient(135deg, #09090b 0%, #D97706 100%)">
           <!-- Shimmer Sheen Effect -->
           <div class="pointer-events-none absolute inset-0 opacity-15">
               <div class="card-sheen absolute inset-0"></div>
           </div>
           <!-- Tag/Badge เลียนแบบระบบ -->
           <div class="mb-3">
               <span class="inline-flex items-center gap-1.5 rounded-full bg-[#D97706]/20 border border-[#D97706]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
                 SINDLINE RECOMMENDED
               </span>
           </div>
           <!-- หัวข้อหลักของเนื้อหา -->
           <h2 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
               ที่สุดของบริการเพื่อนเที่ยวและไซด์ไลน์${provinceName}
           </h2>
       </div>

       <!-- ท่อนล่าง: กล่องข้อมูลเนื้อหาสีขาวสะอาดตา ตัดกับตัวหนังสือสีเข้ม อ่านง่ายเป็นสัดส่วนชัดเจน -->
       <div class="p-6 sm:p-10 bg-white text-left text-gray-800 space-y-4 text-sm leading-relaxed border-t border-gray-100 seo-content-white">
           ${smartLinkify(seoData.uniqueIntro, provinceKey, seoData.zones)}
       </div>

    </div>
  </section>



  <!-- ============================== GOOGLE MAP INTEGRATION ============================== -->
  <section class="container mx-auto px-4 py-8 max-w-4xl animate-fade-in-up">
    <div class="relative rounded-3xl overflow-hidden border border-white/10 shadow-xl shadow-brand/10">
      <iframe
        src="https://maps.google.com/maps?q=${encodeURIComponent(provinceName)}&t=&z=13&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="450"
        style="border:0;"
        allowfullscreen=""
        loading="lazy">
      </iframe>
    </div>
  </section>
</main>

<!-- ============================== FOOTER ============================== -->
<footer class="border-t border-white/10 bg-black/60 backdrop-blur-md pt-16 pb-8">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-8 text-center">
        <h2 class="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand to-rose-400 uppercase tracking-wider">
            ไซด์ไลน์${provinceName}
        </h2>
            
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-[14px] tracking-wider hover:from-green-400 hover:to-emerald-500 hover:scale-105 transition-all shadow-lg shadow-green-500/20">
            <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 11.5c0-4.69-5.38-8.5-12-8.5S0 6.81 0 11.5c0 4.2 4.3 7.7 10.1 8.4l-.6 2.3s-.2.9.8.5c1-.4 5.3-3.1 7.3-5.2 3.9-1.3 6.4-3.5 6.4-6M8.5 14H6.8c-.3 0-.5-.2-.5-.5v-4c0-.3.2-.5.5-.5h.5c.3 0 .5.2.5.5v2.8h.7c.3 0 .5.2.5.5V13.5c0 .3-.2.5-.5.5m3.7-.5c0 .3-.2.5-.5.5h-1.6c-.3 0-.5-.2-.5-.5v-4c0-.3.2-.5.5-.5H11.2c.3 0 .5.2.5.5v3.3h.5c.3 0 .5.2.5.5v.2zm2.1-.5c0 .3-.2.5-.5.5h-.5c-.3 0-.5-.2-.5-.5v-4c0-.3.2-.5.5-.5h.5c.3 0 .5.2.5.5v4zm5.2 0c0 .3-.2.5-.5.5h-1.7c-.3 0-.5-.2-.5-.5v-4c0-.3.2-.5.5-.5h1.7c.3 0 .5.2.5.5v.2c0 .3-.2.5-.5.5h-.7V11h.5c.3 0 .5.2.5.5v.2c0 .3-.2.5-.5.5h-.5v.8h.7c.3 0 .5.2.5.5v.2zm-5.5-2.25c0-.14.11-.25.25-.25h.5c.14 0 .25.11.25.25v1.5c0 .14-.11.25-.25.25h-.5a.25.25 0 01-.25-.25v-1.5z"/></svg>
            จองน้องๆ ใน${provinceName} ตอนนี้
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
                <a href="/privacy-policy.html" class="hover:text-brand transition-colors">PRIVACY</a>
                <a href="/terms.html" class="hover:text-brand transition-colors">TERMS</a>
            </div>
        </div>
    </div>
</footer>

<!-- ============================== LIGHTBOX DETAILS MODAL ============================== -->
<div id="lightbox" class="hidden opacity-0 fixed inset-0 z-[1000] flex items-center justify-center p-4 transition-opacity duration-300 overlay-backdrop backdrop-blur-md bg-black/95">
  <div id="lightbox-content-wrapper-el" class="bg-black/90 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-full lg:max-w-[90vw] max-h-[95vh] flex flex-col relative transform scale-95 transition-all duration-300 modal-content overflow-hidden">
    <button id="closeLightboxBtn" class="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/10 rounded-full shadow-md hover:bg-white/20 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-brand" aria-label="ปิดรายละเอียดโปรไฟล์">
      <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div class="flex-grow overflow-y-auto">
      <div class="lightbox-grid grid lg:grid-cols-[1.5fr_1fr] gap-4 lg:gap-8">
        <div class="lightbox-gallery bg-black/40 lg:rounded-l-3xl">
          <div class="sticky top-0 p-4 sm:p-6 h-full flex flex-col justify-center"> 
            <div class="hero-image-container mb-4 flex justify-center items-center h-full max-h-[75vh] overflow-hidden">
              <img id="lightboxHeroImage" src="" alt="โปรไฟล์น้อง" class="hero-image-main w-full h-full object-contain rounded-2xl shadow-xl mx-auto">
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
                <svg class="h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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

<!-- ============================== JAVASCRIPT SYSTEM ============================== -->
<script>
  document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Control
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

    // 2. Light / Dark Toggle
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

    // 3. Close Lightbox Fallback
    const lightbox = document.getElementById('lightbox');
    const closeLb = document.getElementById('closeLightboxBtn');
    if (closeLb && lightbox) {
        closeLb.addEventListener('click', () => {
            lightbox.classList.add('opacity-0');
            setTimeout(() => lightbox.classList.add('hidden'), 300);
        });
    }

    // 4. Real-time Live Search & Dynamic Zone Tabs Filtering
    var searchInput = document.getElementById('searchInput');
    var clearSearch = document.getElementById('clearSearch');
    var regionTabs = document.getElementById('regionTabs');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.province-card'));
    var resultCount = document.getElementById('resultCount');
    var emptyState = document.getElementById('emptyState');
    var cardsGrid = document.getElementById('profiles-container');

    var activeRegion = 'ทั้งหมด';

    function applyFilter() {
      var q = (searchInput.value || '').trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
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
</body>
</html>`;

return new Response(htmlTemplate, { 
    headers: { 
        "Content-Type": "text/html; charset=utf-8", 
        // ปรับ s-maxage=10 (วินาที) และ stale-while-revalidate=604800 (7 วัน)
        // ช่วยให้ข้อมูลโปรไฟล์ใหม่อัปเดตได้ไวขึ้นใน 10 วินาที และเก็บแคชเดิมเพื่อเซฟการยิงฐานข้อมูลเมื่อไม่มีข้อมูลใหม่
        "Cache-Control": "public, max-age=0, s-maxage=10, stale-while-revalidate=604800, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY"
    } 
});

} catch (error) {
    console.error("SSR Fatal Error:", error);
    return buildErrorPage(500, "500 - SYSTEM ERROR", "ขออภัยค่ะ เกิดข้อผิดพลาดชั่วคราวในการประมวลผลบนเซิร์ฟเวอร์");
}
};

// วางไว้บรรทัดล่างสุดของไฟล์ ssr-province.js
// มีการเพิ่มเส้นทางของ "/robots.txt" และ "/sitemap.xml" เข้ามาเพื่อให้ระบบดึงข้อมูลไดนามิกได้อย่างถูกต้อง
export const config = {
    path: ["/", "/location/*", "/robots.txt", "/sitemap.xml"],
    cache: "manual"
};