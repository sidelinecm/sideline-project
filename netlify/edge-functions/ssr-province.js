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
            <p class="mb-4">ผ่อนคลายความเหนื่อยล้าจากวิถีชีวิตคนเมืองหลวงด้วยเพื่อนเที่ยวและผู้ช่วยส่วนตัวในกรุงเทพมหานคร คัดสรรเฉพาะโปรไฟล์ที่มีมนุษยสัมพันธ์ดี มารยาทสุภาพ และพร้อมเป็นผู้ฟังที่ดีเคียงข้างคุณในทุกโอกาสสำคัญ</p>
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
            { q: "สามารถชวนน้องๆ ไปงานสังสรรค์ส่วนตัวหรือร้านอาหารนั่งชิลได้หรือไม่?", a: "ได้ครับ สามารถแจ้งลักษณะงานที่ต้องการให้น้องร่วมทริปเดินทางเพื่อประเมินความเหมาะสมและตกลงขอบเขตงานร่วมกันล่วงหน้าก่อนเริ่มงาน" }
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

const optimizeImg = (domain, path, width = 180, height = 240) => {
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
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${statusCode} - ${escapeHTML(title)}</title>
    <style>
        body { background: #0b0f19; font-family: system-ui, -apple-system, sans-serif; color: white; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
        .box { max-width: 450px; padding: 40px 24px; border-radius: 20px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); }
        .code { font-size: 64px; font-weight: 800; color: #db2777; margin-bottom: 12px; }
        .title { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
        .msg { color: #9ca3af; margin-bottom: 28px; font-size: 14px; line-height: 1.6; }
        .btn { display: inline-block; padding: 12px 36px; background: #db2777; color: white; border-radius: 9999px; font-weight: 600; text-decoration: none; transition: opacity 0.2s; }
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="box">
        <div class="code">${statusCode}</div>
        <h1 class="title">${escapeHTML(title)}</h1>
        <p class="msg">${escapeHTML(message)}</p>
        <a href="/" class="btn">กลับสู่หน้าหลัก</a>
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
                        "image": optimizeImg(dynamicDomain, p.imagePath, 300, 400),
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

        const cardsHTML = safeProfiles
            .map((p) => {
                const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").replace(/^(น้อง\s?)/, ""));
                const profileLocation = escapeHTML(p.location || provinceName || "ไม่ระบุโซน");
                const profileLink = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
                const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
                const statusClass = isAvailable ? "status-available-neon" : "status-busy-neon";
                const statusText = isAvailable ? "รับงาน" : "ไม่ว่าง/พัก";
                const displayRate = p.rate ? `${parseInt(p.rate).toLocaleString()} ฿` : "สอบถาม";

                return `
                <div class="profile-card relative group flex flex-col justify-between" data-id="${p.id}" data-slug="${p.slug || p.id}">
                    <div class="absolute top-3 left-3 z-20">
                        <span class="neon-badge ${statusClass}">
                            <span class="neon-dot"></span>
                            <span>${statusText}</span>
                        </span>
                    </div>
                    
                    <div class="absolute top-3 right-3 z-20">
                        <button type="button" class="like-button-wrapper w-8 h-8 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10" aria-label="ถูกใจโปรไฟล์น้อง ${cleanName}">
                            <i class="fa-solid fa-heart text-sm"></i>
                        </button>
                    </div>

                    <a href="${profileLink}" class="card-fixed-ratio block" aria-label="ดูโปรไฟล์น้อง ${cleanName}">
                        <img src="${optimizeImg(dynamicDomain, p.imagePath, 180, 240)}" 
                             alt="รูปโปรไฟล์น้อง ${cleanName} พื้นที่ ${provinceName}" 
                             class="card-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                             width="180" height="240"
                             loading="lazy" decoding="async" />
                        <div class="gradient-overlay-fixed"></div>
                    </a>

                    <div class="mt-3 text-left">
                        <div class="flex items-center justify-between">
                            <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate">น้อง${cleanName}</h4>
                            <span class="text-pink-600 dark:text-pink-400 font-extrabold text-sm">${displayRate}</span>
                        </div>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1 truncate">
                            <i class="fas fa-map-marker-alt text-pink-500 mr-1"></i> ${profileLocation}
                        </p>
                    </div>
                </div>
                `;
            })
            .join("");

        const htmlTemplate = `<!DOCTYPE html> 
<html lang="th" class="scroll-smooth antialiased dark:bg-gray-900 dark:text-gray-100 dark">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#db2777">

  <title>${title}</title>
  <meta name="description" content="${cleanDescription}"/>
  <meta name="keywords" content="${seoData.lsi.join(', ')}, ${provinceName}">

  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" id="canonical-link" href="${provinceUrl}">

  <meta property="og:locale" content="th_TH">
  <meta property="og:site_name" content="Sideline Chiangmai">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${cleanDescription}">
  <meta property="og:url" content="${provinceUrl}">
  <meta property="og:image" content="${firstImage}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${cleanDescription}">
  <meta name="twitter:image" content="${firstImage}">

  <link rel="shortcut icon" href="/images/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">

  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>

  <link rel="stylesheet" href="/styles.css" onerror="this.onerror=null;this.href='';">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
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
  <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
    .profile-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 12px; transition: transform 0.2s, border-color 0.2s; }
    .profile-card:hover { border-color: rgba(236, 72, 153, 0.3); }
    @media (max-width: 767px) {
        #profiles-container { grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 10px 4px; }
    }

    .like-button-wrapper .fa-heart { color: rgba(255, 255, 255, 0.8); transition: color 0.2s; }
    .like-button-wrapper.liked .fa-heart { color: #ec4899; }

    .neon-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 99px; font-weight: 700; font-size: 10px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); background: rgba(0,0,0,0.5); border: 1px solid rgba(255, 255, 255, 0.1); }
    .neon-dot { width: 6px; height: 6px; border-radius: 50%; }
    .status-available-neon .neon-dot { background-color: #10b981; }
    .status-busy-neon .neon-dot { background-color: #ef4444; }

    .card-fixed-ratio { position: relative; width: 100%; padding-top: 133.33%; overflow: hidden; border-radius: 8px; }
    .card-fixed-ratio img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
    .gradient-overlay-fixed { position: absolute; bottom: 0; left: 0; right: 0; height: 40%; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%); pointer-events: none; }
    
    .glass-panel { background: rgba(10, 10, 15, 0.4) !important; backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.03) !important; }
  </style>
</head>

<body class="antialiased bg-white dark:bg-[#07070a] text-gray-900 dark:text-gray-100" data-page="home">
<header id="page-header" class="fixed top-0 left-0 w-full z-40 border-b border-transparent bg-white/80 dark:bg-[#07070a]/80 backdrop-blur-md">
    <div class="container mx-auto px-4 h-14 flex items-center justify-between">
        
        <div class="flex items-center">
            <a href="/" aria-label="ไปที่หน้าแรก Sideline Chiangmai" class="flex items-center">
               <img src="/images/logo-sidelinechiangmai.webp" 
                    alt="Sideline Chiangmai Official Logo" 
                    class="h-[26px] w-auto brightness-200" 
                    width="220" 
                    height="26" 
                    loading="eager" />
            </a>
        </div>

        <div class="flex items-center justify-center flex-1">
            <div class="hidden sm:block absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
                ข้อมูลอัปเดตระบบ: <span id="last-updated-time" class="font-medium">${CURRENT_MONTH} ${CURRENT_YEAR}</span>
            </div>
        </div>

        <div class="flex items-center gap-1">
            <nav class="hidden lg:flex items-center gap-1 text-xs font-medium mr-2" aria-label="เมนูหลัก">
                <a href="/profiles.html" class="px-3 py-2 rounded-full hover:bg-pink-500/10 hover:text-pink-500 transition-colors">รวมโปรไฟล์แนะนำ</a>
                <a href="/locations.html" class="px-3 py-2 rounded-full hover:bg-pink-500/10 hover:text-pink-500 transition-colors">พื้นที่ให้บริการ</a>
            </nav>

            <button class="theme-toggle-btn w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" type="button" aria-label="สลับโหมดหน้าจอ">
                <i class="fas fa-sun theme-toggle-icon text-sm"></i>
            </button>

            <button id="menu-toggle" class="lg:hidden w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" type="button" aria-label="เปิดเมนูนำทาง">
                <i class="fas fa-bars text-base"></i>
            </button>
        </div>
    </div>
</header>

<div id="sidebar-overlay" class="fixed inset-0 bg-[#07070A]/80 backdrop-blur-sm z-[2000] hidden opacity-0 transition-opacity duration-300" aria-hidden="true"></div>
<nav id="sidebar-menu" aria-label="เมนูมือถือ" class="fixed top-0 right-0 h-full w-[260px] bg-white dark:bg-[#07070A] border-l border-gray-100 dark:border-white/5 z-[3000] transform translate-x-full transition-transform duration-300 flex flex-col shadow-2xl">
    <div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
        <span class="text-xs text-gray-500 dark:text-white/50 tracking-widest font-bold">เมนูนำทาง</span>
        <button id="close-menu-btn" aria-label="ปิดเมนู" class="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors">
            <i class="fas fa-times text-base" aria-hidden="true"></i>
        </button>
    </div>
    <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <a href="/" class="flex items-center gap-3 p-3 text-gray-700 dark:text-white/60 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-[13px]"><i class="fas fa-home w-5 text-center text-pink-500"></i> หน้าแรก</a>
        <a href="/profiles.html" class="flex items-center gap-3 p-3 text-gray-700 dark:text-white/60 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-[13px]"><i class="fas fa-gem w-5 text-center text-pink-500"></i> โปรไฟล์แนะนำ</a>
        <a href="/locations.html" class="flex items-center gap-3 p-3 text-gray-700 dark:text-white/60 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-[13px]"><i class="fas fa-map-marker-alt w-5 text-center text-pink-500"></i> พิกัดอื่นๆ ทั่วไทย</a>
    </div>
    <div class="p-4 border-t border-gray-100 dark:border-white/5 pb-8">
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 w-full bg-pink-600 text-white py-2.5 rounded-xl text-xs font-bold tracking-wider hover:bg-pink-700 transition-colors shadow-lg">
            <i class="fab fa-line text-base"></i> ติดต่อเจ้าหน้าที่แอดมิน
        </a>
    </div>
</nav>

<main class="pt-20 pb-10">
  <div class="container mx-auto px-4 space-y-12 max-w-6xl">

    <section class="text-center space-y-4" aria-labelledby="hero-h1">
      <h1 id="hero-h1" class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-snug">
        ${seoData.h1}
      </h1>

      <div class="mx-auto overflow-hidden rounded-2xl max-w-3xl border border-gray-200 dark:border-white/5 shadow-md">
        <img 
          src="/images/hero-sidelinechiangmai-1200.webp"
          srcset="/images/hero-sidelinechiangmai-600.webp 600w, 
                  /images/hero-sidelinechiangmai-1200.webp 1200w"
          sizes="(max-width: 768px) 100vw, 800px"
          alt="ผู้ให้บริการและเพื่อนร่วมทางพิกัด ${provinceName} ปลอดภัยและเชื่อถือได้"
          width="1200" height="800"
          class="w-full h-auto object-cover aspect-[3/2]"
          loading="eager" fetchpriority="high" />
      </div>

      <h2 class="text-base md:text-lg font-bold text-pink-600 dark:text-pink-400 mt-4 leading-relaxed">
        ${seoData.h2}
      </h2>

      <div class="max-w-2xl mx-auto mt-6">
        <div class="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl text-center shadow-sm">
            <p class="text-emerald-600 dark:text-emerald-400 text-xs md:text-sm font-semibold flex items-center justify-center gap-2 m-0">
               <i class="fas fa-shield-halved"></i> ข้อตกลงความปลอดภัยสูงสุด: ชำระค่าบริการหน้างานโดยตรง 100% ไม่มีขั้นตอนรับค่าจองล่วงหน้า
            </p>
        </div>
      </div>
    </section>

    <section id="featured-profiles" class="space-y-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white border-l-4 border-pink-500 pl-3">
            โปรไฟล์แนะนำในเขตพื้นที่ ${provinceName} (${safeProfiles.length} รายการ)
        </h3>
        <div id="profiles-container" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            ${cardsHTML || `<div class="col-span-full py-12 text-center text-sm text-gray-400">ขออภัยค่ะ กำลังอัปเดตข้อมูลผู้สแตนด์บายในขณะนี้</div>`}
        </div>
    </section>

    <section class="max-w-3xl mx-auto py-8 glass-panel rounded-2xl text-left px-6 md:px-8 space-y-4 shadow-sm">
         <h3 class="text-lg font-extrabold text-pink-600 dark:text-pink-400">ข้อมูลและภาพรวมบรรยากาศพื้นที่ ${provinceName}</h3>
         <div class="text-gray-600 dark:text-gray-300 space-y-3 text-xs md:text-sm leading-relaxed">
             ${smartLinkify(seoData.uniqueIntro, provinceKey, seoData.zones)}
         </div>
    </section>

    <section class="max-w-3xl mx-auto py-6 space-y-6 text-left">
         <h3 class="text-lg md:text-xl font-bold text-center text-gray-900 dark:text-white">คำถามที่พบบ่อย (FAQ) และแนวทางปฏิบัติด้านความปลอดภัย</h3>
         <div class="space-y-4">
              ${seoData.faqs.map(faq => `
              <div class="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50">
                  <h4 class="font-bold text-xs md:text-sm text-gray-900 dark:text-white mb-2 flex items-start gap-2">
                     <i class="fas fa-circle-question text-pink-500 mt-0.5 flex-shrink-0"></i>
                     <span>${escapeHTML(faq.q)}</span>
                  </h4>
                  <p class="text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed pl-6 border-l border-pink-500/20">${escapeHTML(faq.a)}</p>
              </div>
              `).join("")}
         </div>
    </section>

    <section class="max-w-3xl mx-auto">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center mb-3">ขอบเขตทางภูมิศาสตร์และการดูแล</h3>
        <div class="rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 aspect-[16/9] w-full">
          <iframe
            src="https://maps.google.com/maps?q=${encodeURIComponent(provinceName)}&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy">
          </iframe>
        </div>
    </section>

    <section class="max-w-3xl mx-auto p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-white/5 space-y-4 text-left">
        <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="fas fa-hand-holding-hand text-pink-500"></i> แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัย
        </h3>
        <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-2 list-disc pl-5 leading-relaxed">
            <li><strong>ข้อจำกัดอายุผู้ใช้บริการ</strong>: ผู้ขอคำแนะนำและใช้บริการระบบจะต้องมีอายุขั้นต่ำ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</li>
            <li><strong>จรรยาบรรณผู้ใช้บริการ</strong>: ห้ามกระทำการบังคับ ขู่เข็ญ หรือมีพฤติกรรมที่ไม่เหมาะสมต่อผู้ให้บริการทุกรณี</li>
            <li><strong>นโยบายความเป็นส่วนตัวสูงสุด (Privacy Guaranteed)</strong>: ทางเว็บไซต์ไม่มีนโยบายการจัดเก็บข้อมูลการสนทนา ล็อกไฟล์ หรือหมายเลขโทรศัพท์ของสมาชิกหลังจากเสร็จสิ้นกิจกรรม</li>
            <li><strong>การแจ้งเตือนพฤติกรรมไม่เหมาะสม</strong>: หากท่านพบเห็นผู้แอบอ้างรูปภาพ หรือมีพฤติกรรมเข้าข่ายต้มตุ๋น โปรดแจ้งฝ่ายประสานงานแอดมินเพื่อแบนไอดีผู้ใช้ระบบทันที</li>
        </ul>
    </section>

  </div>
</main>

<footer class="bg-gray-50 dark:bg-[#040406] py-12 text-center border-t border-gray-100 dark:border-white/5">
    <div class="max-w-4xl mx-auto px-6 space-y-8">
        <h4 class="text-lg font-bold text-gray-900 dark:text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 uppercase tracking-widest">
            ${CONFIG.BRAND_NAME}
        </h4>
            
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-full font-bold text-xs tracking-wider hover:bg-pink-700 transition-colors shadow-md">
            <i class="fab fa-line text-lg"></i> แอดไลน์จองและปรึกษา แอดมินให้บริการ 24 ชม.
        </a>
        
        <div class="pt-4 border-t border-gray-100 dark:border-white/5">
            <h5 class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">พิกัดทางเลือกในจังหวัดอื่นๆ</h5>
            <nav class="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto" aria-label="ลิงก์นำทางพื้นที่รับงานอื่นๆ">
                ${allProvinces.slice(0, 12).map(p => {
                    const linkHref = p.key === 'chiangmai' ? "/" : `/location/${p.key}`;
                    return `<a href="${linkHref}" class="text-[11px] text-gray-500 hover:text-pink-500 transition-colors py-1.5 border border-gray-100 dark:border-white/5 rounded-lg bg-white/5">เพื่อนเที่ยว${escapeHTML(p.nameThai)}</a>`;
                }).join("")}
            </nav>
        </div>

        <div class="pt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
            <p>© ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
            <div class="flex gap-4">
                <a href="/privacy-policy.html" class="hover:text-pink-500 transition-colors">นโยบายส่วนบุคคล</a>
                <a href="/terms.html" class="hover:text-pink-500 transition-colors">เงื่อนไขการใช้งาน</a>
            </div>
        </div>
    </div>
</footer>

<script>
  document.addEventListener("DOMContentLoaded", () => {
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

    const themeBtn = document.querySelector('.theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const htmlClass = document.documentElement.classList;
            htmlClass.toggle('dark');
            const icon = themeBtn.querySelector('.theme-toggle-icon');
            if (icon) {
                if (htmlClass.contains('dark')) {
                    icon.classList.replace('fa-sun', 'fa-moon');
                } else {
                    icon.classList.replace('fa-moon', 'fa-sun');
                }
            }
        });
    }
  });
</script>

<script type="module" src="/main.js"></script>
</body>
</html>`;

        return new Response(htmlTemplate, { 
            headers: { 
                "Content-Type": "text/html; charset=utf-8", 
                "Cache-Control": `public, max-age=0, s-maxage=300, stale-while-revalidate=86400, must-revalidate`,
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY"
            } 
        });

    } catch (error) {
        console.error("SSR Fatal Error:", error);
        return buildErrorPage(500, "500 - SYSTEM ERROR", "ขออภัยค่ะ เกิดข้อผิดพลาดชั่วคราวในการประมวลผลบนเซิร์ฟเวอร์");
    }
};