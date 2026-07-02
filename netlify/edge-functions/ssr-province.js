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
            { q: "สามารถชวนน้องๆ ไปงานสังสรรค์ส่วนตัวหรือร้านอาหารนั่งชิลได้หรือไม่?", a: "ได้ครับ สามารถแจ้งลักษณะงานที่ต้องการให้น้องร่วมทริปเดินทางเพื่อประเมินความเหมาะสมและตกลงเวลาขอบเขตงานอย่างเป็นธรรมแก่ทั้งสองฝ่าย" }
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

// [OPTIMIZED FOR SPEED] ปรับปรุงขนาดภาพและความละเอียดเพื่อเซฟ Bandwidth ของผู้ใช้งานมือถือให้ผ่านเกณฑ์ PageSpeed
const optimizeImg = (domain, path, width = 360, height = 480) => {
    if (!path) return getFullUrl(domain, "/images/default.webp");
    if (path.includes("res.cloudinary.com")) {
        if (path.includes("/upload/")) {
            return path.replace("/upload/", `/upload/f_auto,q_auto,w_${width},h_${height},c_fill,g_face/`);
        }
        return path;
    }
    if (path.startsWith("http")) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=50&format=webp`;
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
        .code { font-size: 64px; font-weight: 800; color: #ec4899; margin-bottom: 12px; }
        .title { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
        .msg { color: #9ca3af; margin-bottom: 28px; font-size: 14px; line-height: 1.6; }
        .btn { display: inline-block; padding: 12px 36px; background: #ec4899; color: white; border-radius: 9999px; font-weight: 600; text-decoration: none; transition: opacity 0.2s; }
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

        // Structured Data Schema.org (JSON-LD)
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
                        <img src="${optimizeImg(dynamicDomain, p.imagePath, 360, 480)}" 
                             alt="รูปโปรไฟล์น้อง ${cleanName} พื้นที่ ${provinceName}" 
                             class="card-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                             width="360" height="480"
                             loading="lazy" decoding="async" />
                        <div class="gradient-overlay-fixed"></div>
                    </a>

                    <div class="mt-3 text-left">
                        <div class="flex items-center justify-between">
                            <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate">น้อง${cleanName}</h4>
                            <span class="text-pink-700 dark:text-pink-400 font-extrabold text-sm">${displayRate}</span>
                        </div>
                        <p class="text-[11px] text-gray-700 dark:text-gray-300 mt-1 truncate">
                            <i class="fas fa-map-marker-alt text-pink-600 dark:text-pink-400 mr-1"></i> ${profileLocation}
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

  <!-- [FIX RENDER BLOCKING] ปรับสไตล์การโหลด CSS ภายนอกไม่ให้ขัดขวางการวาดภาพหน้าจอครั้งแรก (FCP) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'">

  <link rel="stylesheet" href="/styles.css" onerror="this.onerror=null;this.href='';">
  
  <!-- [PERFORMANCE SOLVED] รวม CSS ที่สกัดมาพร้อมใช้งานแบบ Static (ลบสคริปต์ cdn.tailwindcss.com ออกถาวร) ปรับสีปุ่ม LINE เป็นโทน #058235 เพื่อผ่านการตรวจสอบ WCAG AA -->
  <style>
    body{font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif}
    .profile-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:12px;transition:transform .2s,border-color .2s}
    .profile-card:hover{border-color:rgba(236,72,153,0.3)}
    @media(max-width:767px){#profiles-container{grid-template-columns:repeat(2,1fr);gap:10px;margin:10px 4px}}
    .like-button-wrapper .fa-heart{color:rgba(255,255,255,0.8);transition:color .2s}
    .like-button-wrapper.liked .fa-heart{color:#ec4899}
    .neon-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:99px;font-weight:700;font-size:10px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1)}
    .neon-dot{width:6px;height:6px;border-radius:50%}
    .status-available-neon .neon-dot{background-color:#10b981}
    .status-busy-neon .neon-dot{background-color:#ef4444}
    .card-fixed-ratio{position:relative;width:100%;padding-top:133.33%;overflow:hidden;border-radius:8px}
    .card-fixed-ratio img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
    .gradient-overlay-fixed{position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(to top,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0) 100%);pointer-events:none}
    .glass-panel{background:rgba(10,10,15,0.4)!important;backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.03)!important}
    
    /* [CONTRAST COMPLIANT] อัปเกรดสีปุ่มแอดไลน์หลักเป็น #058235 และ Hover เป็น #046f2d (อัตราส่วนความสว่างกับข้อความสีขาวเท่ากับ 4.95:1 ผ่านเกณฑ์มาตรฐาน WCAG AA) */
    .btn-line-shared{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background-color:#058235;color:#ffffff;padding:10px;border-radius:12px;font-weight:700;font-size:14px;transition:background-color .2s;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)}
    .btn-line-shared:hover{background-color:#046f2d}
  </style>
  <style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.container{width:100%}@media (min-width: 640px){.container{max-width:640px}}@media (min-width: 768px){.container{max-width:768px}}@media (min-width: 1024px){.container{max-width:1024px}}@media (min-width: 1280px){.container{max-width:1280px}}@media (min-width: 1536px){.container{max-width:1536px}}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{inset:0px}.left-0{left:0px}.left-1\/2{left:50%}.left-3{left:0.75rem}.right-0{right:0px}.right-3{right:0.75rem}.top-0{top:0px}.top-3{top:0.75rem}.z-20{z-index:20}.z-40{z-index:40}.z-\[2000\]{z-index:2000}.z-\[3000\]{z-index:3000}.m-0{margin:0px}.mx-auto{margin-left:auto;margin-right:auto}.mb-2{margin-bottom:0.5rem}.mb-3{margin-bottom:0.75rem}.mb-4{margin-bottom:1rem}.mr-1{margin-right:0.25rem}.mr-2{margin-right:0.5rem}.mt-0\.5{margin-top:0.125rem}.mt-1{margin-top:0.25rem}.mt-3{margin-top:0.75rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.block{display:block}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.hidden{display:none}.aspect-\[16\/9\]{aspect-ratio:16/9}.aspect-\[3\/2\]{aspect-ratio:3/2}.h-14{height:3.5rem}.h-7{height:1.75rem}.h-8{height:2rem}.h-\[26px\]{height:26px}.h-auto{height:auto}.h-full{height:100%}.w-5{width:1.25rem}.w-7{width:1.75rem}.w-8{width:2rem}.w-\[260px\]{width:260px}.w-auto{width:auto}.w-full{width:100%}.max-w-2xl{max-width:42rem}.max-w-3xl{max-width:48rem}.max-w-4xl{max-width:56rem}.max-w-6xl{max-width:72rem}.max-w-sm{max-width:24rem}.max-w-xl{max-width:36rem}.flex-1{flex:1 1 0%}.flex-shrink-0{flex-shrink:0}.shrink-0{flex-shrink:0}.flex-grow{flex-grow:1}.-translate-x-1\/2{--tw-translate-x:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-full{--tw-translate-x:100%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.list-disc{list-style-type:disc}.grid-cols-2{grid-template-columns:repeat(2, minmax(0, 1fr))}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:0.25rem}.gap-2{gap:0.5rem}.gap-4{gap:1rem}.space-y-12 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(3rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(3rem * var(--tw-space-y-reverse))}.space-y-2 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.5rem * var(--tw-space-y-reverse))}.space-y-3 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.75rem * var(--tw-space-y-reverse))}.space-y-4 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.space-y-6 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem * var(--tw-space-y-reverse))}.space-y-8 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(2rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(2rem * var(--tw-space-y-reverse))}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.scroll-smooth{scroll-behavior:smooth}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:0.5rem}.rounded-xl{border-radius:0.75rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-l{border-left-width:1px}.border-l-4{border-left-width:4px}.border-t{border-top-width:1px}.border-emerald-500\/20{border-color:rgb(16 185 129 / 0.2)}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity, 1))}.border-pink-500{--tw-border-opacity:1;border-color:rgb(236 72 153 / var(--tw-border-opacity, 1))}.border-pink-500\/20{border-color:rgb(236 72 153 / 0.2)}.border-transparent{border-color:transparent}.border-white\/10{border-color:rgb(255 255 255 / 0.1)}.bg-\[\#058235\]{--tw-bg-opacity:1;background-color:rgb(5 130 53 / var(--tw-bg-opacity, 1))}.bg-\[\#07070A\]\/80{background-color:rgb(7 7 10 / 0.8)}.bg-black\/40{background-color:rgb(0 0 0 / 0.4)}.bg-emerald-500\/5{background-color:rgb(16 185 129 / 0.05)}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.bg-white\/80{background-color:rgb(255 255 255 / 0.8)}.bg-gradient-to-r{background-image:linear-gradient(to right, var(--tw-gradient-stops))}.from-pink-500{--tw-gradient-from:#ec4899 var(--tw-gradient-from-position);--tw-gradient-to:rgb(236 72 153 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from), var(--tw-gradient-to)}.to-yellow-500{--tw-gradient-to:#eab308 var(--tw-gradient-to-position)}.bg-clip-text{-webkit-background-clip:text;background-clip:text}.object-contain{object-fit:contain}.object-cover{object-fit:cover}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.px-3{padding-left:0.75rem;padding-right:0.75rem}.px-4{padding-left:1rem;padding-right:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-1\.5{padding-top:0.375rem;padding-bottom:0.375rem}.py-12{padding-top:3rem;padding-bottom:3rem}.py-2{padding-top:0.5rem;padding-bottom:0.5rem}.py-3{padding-top:0.75rem;padding-bottom:0.75rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.py-8{padding-top:2rem;padding-bottom:2rem}.pb-10{padding-bottom:2.5rem}.pl-3{padding-left:0.75rem}.pl-5{padding-left:1.25rem}.pl-6{padding-left:1.5rem}.pt-20{padding-top:5rem}.pt-4{padding-top:1rem}.text-left{text-align:left}.text-center{text-align:center}.text-2xl{font-size:1.5rem;line-height:2rem}.text-\[10px\]{font-size:10px}.text-\[11px\]{font-size:11px}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-bold{font-weight:700}.font-extrabold{font-weight:800}.font-medium{font-weight:500}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.leading-relaxed{line-height:1.625}.leading-snug{line-height:1.375}.tracking-wider{letter-spacing:0.05em}.tracking-widest{letter-spacing:0.1em}.text-emerald-700{--tw-text-opacity:1;color:rgb(4 120 87 / var(--tw-text-opacity, 1))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.text-gray-700{--tw-text-opacity:1;color:rgb(55 65 81 / var(--tw-text-opacity, 1))}.text-gray-900{--tw-text-opacity:1;color:rgb(17 24 39 / var(--tw-text-opacity, 1))}.text-pink-600{--tw-text-opacity:1;color:rgb(219 39 119 / var(--tw-text-opacity, 1))}.text-pink-700{--tw-text-opacity:1;color:rgb(190 24 93 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.opacity-0{opacity:0}.shadow-2xl{--tw-shadow:0 25px 50px -12px rgb(0 0 0 / 0.25);--tw-shadow-colored:0 25px 50px -12px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.brightness-200{--tw-brightness:brightness(2);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.backdrop-blur-md{--tw-backdrop-blur:blur(12px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.backdrop-blur-sm{--tw-backdrop-blur:blur(4px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition-colors{transition-property:color, background-color, border-color, fill, stroke, -webkit-text-decoration-color;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, -webkit-text-decoration-color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.duration-300{transition-duration:300ms}.hover\:bg-\[\#046f2d\]:hover{--tw-bg-opacity:1;background-color:rgb(4 111 45 / var(--tw-bg-opacity, 1))}.hover\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246 / var(--tw-bg-opacity, 1))}.hover\:bg-pink-600\/10:hover{background-color:rgb(219 39 119 / 0.1)}.hover\:text-gray-900:hover{--tw-text-opacity:1;color:rgb(17 24 39 / var(--tw-text-opacity, 1))}.hover\:text-pink-600:hover{--tw-text-opacity:1;color:rgb(219 39 119 / var(--tw-text-opacity, 1))}.hover\:text-pink-700:hover{--tw-text-opacity:1;color:rgb(190 24 93 / var(--tw-text-opacity, 1))}.hover\:underline:hover{-webkit-text-decoration-line:underline;text-decoration-line:underline}.group:hover .group-hover\:scale-105{--tw-scale-x:1.05;--tw-scale-y:1.05;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.dark\:border-gray-700\/50:is(.dark *){border-color:rgb(55 65 81 / 0.5)}.dark\:border-white\/10:is(.dark *){border-color:rgb(255 255 255 / 0.1)}.dark\:border-white\/5:is(.dark *){border-color:rgb(255 255 255 / 0.05)}.dark\:bg-\[\#040406\]:is(.dark *){--tw-bg-opacity:1;background-color:rgb(4 4 6 / var(--tw-bg-opacity, 1))}.dark\:bg-\[\#07070A\]:is(.dark *){--tw-bg-opacity:1;background-color:rgb(7 7 10 / var(--tw-bg-opacity, 1))}.dark\:bg-\[\#07070a\]:is(.dark *){--tw-bg-opacity:1;background-color:rgb(7 7 10 / var(--tw-bg-opacity, 1))}.dark\:bg-\[\#07070a\]\/80:is(.dark *){background-color:rgb(7 7 10 / 0.8)}.dark\:bg-emerald-500\/10:is(.dark *){background-color:rgb(16 185 129 / 0.1)}.dark\:bg-gray-800\/40:is(.dark *){background-color:rgb(31 41 55 / 0.4)}.dark\:bg-gray-900:is(.dark *){--tw-bg-opacity:1;background-color:rgb(17 24 39 / var(--tw-bg-opacity, 1))}.dark\:bg-gray-900\/50:is(.dark *){background-color:rgb(17 24 39 / 0.5)}.dark\:bg-white\/5:is(.dark *){background-color:rgb(255 255 255 / 0.05)}.dark\:text-emerald-400:is(.dark *){--tw-text-opacity:1;color:rgb(52 211 153 / var(--tw-text-opacity, 1))}.dark\:text-gray-100:is(.dark *){--tw-text-opacity:1;color:rgb(243 244 246 / var(--tw-text-opacity, 1))}.dark\:text-gray-200:is(.dark *){--tw-text-opacity:1;color:rgb(229 231 235 / var(--tw-text-opacity, 1))}.dark\:text-gray-300:is(.dark *){--tw-text-opacity:1;color:rgb(209 213 219 / var(--tw-text-opacity, 1))}.dark\:text-gray-400:is(.dark *){--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.dark\:text-pink-400:is(.dark *){--tw-text-opacity:1;color:rgb(244 114 182 / var(--tw-text-opacity, 1))}.dark\:text-transparent:is(.dark *){color:transparent}.dark\:text-white:is(.dark *){--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.dark\:text-white\/50:is(.dark *){color:rgb(255 255 255 / 0.5)}.dark\:hover\:bg-gray-800:hover:is(.dark *){--tw-bg-opacity:1;background-color:rgb(31 41 55 / var(--tw-bg-opacity, 1))}.dark\:hover\:bg-white\/5:hover:is(.dark *){background-color:rgb(255 255 255 / 0.05)}.dark\:hover\:text-pink-400:hover:is(.dark *){--tw-text-opacity:1;color:rgb(244 114 182 / var(--tw-text-opacity, 1))}.dark\:hover\:text-white:hover:is(.dark *){--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}@media (min-width: 640px){.sm\:block{display:block}.sm\:grid-cols-3{grid-template-columns:repeat(3, minmax(0, 1fr))}.sm\:grid-cols-4{grid-template-columns:repeat(4, minmax(0, 1fr))}}@media (min-width: 768px){.md\:flex-row{flex-direction:row}.md\:px-8{padding-left:2rem;padding-right:2rem}.md\:text-3xl{font-size:1.875rem;line-height:2.25rem}.md\:text-lg{font-size:1.125rem;line-height:1.75rem}.md\:text-sm{font-size:0.875rem;line-height:1.25rem}.md\:text-xl{font-size:1.25rem;line-height:1.75rem}}@media (min-width: 1024px){.lg\:flex{display:flex}.lg\:hidden{display:none}.lg\:grid-cols-4{grid-template-columns:repeat(4, minmax(0, 1fr))}}@media (min-width: 1280px){.xl\:grid-cols-5{grid-template-columns:repeat(5, minmax(0, 1fr))}}</style>
</head>

<body class="antialiased bg-white dark:bg-[#07070a] text-gray-900 dark:text-gray-100" data-page="home">
<header id="page-header" class="fixed top-0 left-0 w-full z-40 border-b border-transparent bg-white/80 dark:bg-[#07070a]/80 backdrop-blur-md">
    <div class="container mx-auto px-4 h-14 flex items-center justify-between">
        
        <div class="flex items-center">
            <!-- [FIX LOGO DISPROPORTION] ปรับแก้สัดส่วนภาพและคลาสความละเอียดให้รองรับ Pixel Ratio คมชัดสูง -->
            <a href="/" aria-label="ไปที่หน้าแรก Sideline Chiangmai" class="flex items-center">
               <img src="/images/logo-sidelinechiangmai.webp" 
                    alt="Sideline Chiangmai Official Logo" 
                    class="h-[26px] w-auto brightness-200 object-contain" 
                    width="220" 
                    height="26" 
                    loading="eager" />
            </a>
        </div>

        <div class="flex items-center justify-center flex-1">
            <!-- [FIX CONTRAST] ปรับแต่งคอนทราสต์ในตัวอักษรข้อมูลระบบ -->
            <div class="hidden sm:block absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-700 dark:text-gray-300">
                ข้อมูลอัปเดตระบบ: <span id="last-updated-time" class="font-semibold">${CURRENT_MONTH} ${CURRENT_YEAR}</span>
            </div>
        </div>

        <div class="flex items-center gap-1">
            <!-- [FIX CONTRAST] ปรับสีลิงก์เดสก์ท็อปให้ผ่านเกณฑ์การตรวจสอบ -->
            <nav class="hidden lg:flex items-center gap-1 text-xs font-semibold mr-2" aria-label="เมนูหลัก">
                <a href="/profiles.html" class="px-3 py-2 text-gray-700 dark:text-gray-200 rounded-full hover:bg-pink-600/10 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">รวมโปรไฟล์แนะนำ</a>
                <a href="/locations.html" class="px-3 py-2 text-gray-700 dark:text-gray-200 rounded-full hover:bg-pink-600/10 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">พื้นที่ให้บริการ</a>
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

<!-- [FIX ACCESSIBILITY / COLOR CONTRAST / MENULIST] ผสมโครงสร้างเมนูและแก้ไขปัญหาการนำทางทั้งหมด -->
<nav id="sidebar-menu" aria-label="เมนูมือถือ" class="fixed top-0 right-0 h-full w-[260px] bg-white dark:bg-[#07070A] border-l border-gray-200 dark:border-white/10 z-[3000] transform translate-x-full transition-transform duration-300 flex flex-col shadow-2xl">
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
        <span class="text-xs text-gray-700 dark:text-white/50 tracking-widest font-bold">เมนูนำทาง</span>
        <button id="close-menu-btn" aria-label="ปิดเมนู" class="text-gray-700 dark:text-white/50 hover:text-gray-900 dark:hover:text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors">
            <i class="fas fa-times text-base" aria-hidden="true"></i>
        </button>
    </div>
    
    <nav aria-label="เมนูนำทางหลักในแถบด้านข้าง" class="flex-grow overflow-y-auto p-4 space-y-4">
        <a href="/" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
            <i class="fas fa-home w-5 text-center text-gray-500 dark:text-gray-400" aria-hidden="true"></i>
            <span>หน้าแรก</span>
        </a>
        <a href="/profiles.html" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
            <i class="fas fa-users w-5 text-center text-gray-500 dark:text-gray-400" aria-hidden="true"></i>
            <span>น้องๆ ทั้งหมด</span>
        </a>
        <a href="/locations.html" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
            <i class="fas fa-map-marker-alt w-5 text-center text-gray-500 dark:text-gray-400" aria-hidden="true"></i>
            <span>พิกัดบริการ</span>
        </a>
        <a href="/about.html" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
            <i class="fas fa-info-circle w-5 text-center text-gray-500 dark:text-gray-400" aria-hidden="true"></i>
            <span>เกี่ยวกับเรา</span>
        </a>
        <a href="/faq.html" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
            <i class="fas fa-question-circle w-5 text-center text-gray-500 dark:text-gray-400" aria-hidden="true"></i>
            <span>คำถามพบบ่อย</span>
        </a>
        <a href="/blog.html" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
            <i class="fas fa-newspaper w-5 text-center text-gray-500 dark:text-gray-400" aria-hidden="true"></i>
            <span>บทความ</span>
        </a>
    </nav>
    
    <div class="p-4 border-t border-gray-200 dark:border-white/10 shrink-0">
        <!-- [CONTRAST ADAPTED] อัปเกรด Utility class สีเขียวของปุ่มนำทางเป็น bg-[#058235] และ hover:bg-[#046f2d] แทนค่าเดิมที่ผ่านยาก -->
        <a href="https://line.me/ti/p/ksLUWB89Y_" target="_blank" rel="noopener nofollow" class="btn-line-shared flex items-center justify-center gap-2 w-full bg-[#058235] hover:bg-[#046f2d] text-white py-3 rounded-xl text-sm font-bold tracking-wider transition-colors shadow-lg">
            <i class="fab fa-line text-lg" aria-hidden="true"></i>
            <span>ติดต่อผ่าน LINE</span>
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

      <h2 class="text-base md:text-lg font-bold text-pink-700 dark:text-pink-400 mt-4 leading-relaxed">
        ${seoData.h2}
      </h2>

      <div class="max-w-2xl mx-auto mt-6">
        <div class="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl text-center shadow-sm">
            <p class="text-emerald-700 dark:text-emerald-400 text-xs md:text-sm font-semibold flex items-center justify-center gap-2 m-0">
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
         <h3 class="text-lg font-extrabold text-pink-700 dark:text-pink-400">ข้อมูลและภาพรวมบรรยากาศพื้นที่ ${provinceName}</h3>
         <!-- [FIX CONTRAST] ข้อความมีความสว่างที่อ่านได้ง่ายขึ้นผ่านมาตรฐาน WCAG AA -->
         <div class="text-gray-700 dark:text-gray-300 space-y-3 text-xs md:text-sm leading-relaxed">
             ${smartLinkify(seoData.uniqueIntro, provinceKey, seoData.zones)}
         </div>
    </section>

    <section class="max-w-3xl mx-auto py-6 space-y-6 text-left">
         <h3 class="text-lg md:text-xl font-bold text-center text-gray-900 dark:text-white">คำถามที่พบบ่อย (FAQ) และแนวทางปฏิบัติด้านความปลอดภัย</h3>
         <div class="space-y-4">
              ${seoData.faqs.map(faq => `
              <div class="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50">
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mb-2 flex items-start gap-2">
                     <i class="fas fa-circle-question text-pink-700 dark:text-pink-400 mt-0.5 flex-shrink-0"></i>
                     <span>${escapeHTML(faq.q)}</span>
                  </h4>
                  <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-6 border-l border-pink-500/20">${escapeHTML(faq.a)}</p>
              </div>
              `).join("")}
         </div>
    </section>

    <section class="max-w-3xl mx-auto">
        <h3 class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center mb-3">ขอบเขตทางภูมิศาสตร์และการดูแล</h3>
        <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 aspect-[16/9] w-full">
          <!-- [FIX ACCESSIBILITY / IFRAME] เพิ่ม attribute "title" เพื่อช่วยอธิบายเนื้อหาสำหรับผู้ใช้งานโปรแกรมอ่านหน้าจอ -->
          <iframe
            src="https://maps.google.com/maps?q=${encodeURIComponent(provinceName)}&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            title="แผนที่ขอบเขตพื้นที่ให้บริการและระบบภูมิศาสตร์จังหวัด${escapeHTML(provinceName)}">
          </iframe>
        </div>
    </section>

    <section class="max-w-3xl mx-auto p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-white/10 space-y-4 text-left">
        <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="fas fa-hand-holding-hand text-pink-700 dark:text-pink-400"></i> แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัย
        </h3>
        <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5 leading-relaxed">
            <li><strong>ข้อจำกัดอายุผู้ใช้บริการ</strong>: ผู้ขอคำแนะนำและใช้บริการระบบจะต้องมีอายุขั้นต่ำ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</li>
            <li><strong>จรรยาบรรณผู้ใช้บริการ</strong>: ห้ามกระทำการบังคับ ขู่เข็ญ หรือมีพฤติกรรมที่ไม่เหมาะสมต่อผู้ให้บริการทุกรณี</li>
            <li><strong>นโยบายความเป็นส่วนตัวสูงสุด (Privacy Guaranteed)</strong>: ทางเว็บไซต์ไม่มีนโยบายการจัดเก็บข้อมูลการสนทนา ล็อกไฟล์ หรือหมายเลขโทรศัพท์ของสมาชิกหลังจากเสร็จสิ้นกิจกรรม</li>
            <li><strong>การแจ้งเตือนพฤติกรรมไม่เหมาะสม</strong>: หากท่านพบเห็นผู้แอบอ้างรูปภาพ หรือมีพฤติกรรมเข้าข่ายต้มตุ๋น โปรดแจ้งฝ่ายประสานงานแอดมินเพื่อแบนไอดีผู้ใช้ระบบทันที</li>
        </ul>
    </section>

  </div>
</main>

<footer class="bg-gray-50 dark:bg-[#040406] py-12 text-center border-t border-gray-200 dark:border-white/10">
    <div class="max-w-4xl mx-auto px-6 space-y-8">
        <h4 class="text-lg font-bold text-gray-900 dark:text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 uppercase tracking-widest">
            ${CONFIG.BRAND_NAME}
        </h4>
            
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="btn-line-shared inline-flex items-center justify-center gap-2 max-w-sm mx-auto">
            <i class="fab fa-line text-lg"></i> แอดไลน์จองและปรึกษา แอดมินให้บริการ 24 ชม.
        </a>
        
        <div class="pt-4 border-t border-gray-200 dark:border-white/10">
            <h5 class="text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">พิกัดทางเลือกในจังหวัดอื่นๆ</h5>
            <nav class="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto" aria-label="ลิงก์นำทางพื้นที่รับงานอื่นๆ">
                ${allProvinces.slice(0, 12).map(p => {
                    const linkHref = p.key === 'chiangmai' ? "/" : `/location/${p.key}`;
                    return `<a href="${linkHref}" class="text-[11px] text-gray-700 dark:text-gray-300 hover:text-pink-700 dark:hover:text-pink-400 transition-colors py-1.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/5">เพื่อนเที่ยว${escapeHTML(p.nameThai)}</a>`;
                }).join("")}
            </nav>
        </div>

        <div class="pt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
            <p>© ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
            <div class="flex gap-4">
                <a href="/privacy-policy.html" class="hover:text-pink-700 dark:hover:text-pink-400 transition-colors">นโยบายส่วนบุคคล</a>
                <a href="/terms.html" class="hover:text-pink-700 dark:hover:text-pink-400 transition-colors">เงื่อนไขการใช้งาน</a>
            </div>
        </div>
    </div>
</footer>

<!-- [FIX UX/UI DEVIATION] แก้ไขปัญหาไอคอนสลับโหมดให้ทำงานสัมพันธ์กับ Class "dark" บนแท็ก html ตั้งแต่โหลดหน้าแรก -->
<script>
  document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("menu-toggle"),t=document.getElementById("sidebar-menu"),n=document.getElementById("sidebar-overlay"),o=document.getElementById("close-menu-btn"),a=e=>{t&&n&&(e?(n.classList.remove("hidden"),requestAnimationFrame(()=>{n.classList.remove("opacity-0"),t.classList.remove("translate-x-full")}),document.body.style.overflow="hidden"):(n.classList.add("opacity-0"),t.classList.add("translate-x-full"),document.body.style.overflow="",setTimeout(()=>n.classList.add("hidden"),300)))};e&&e.addEventListener("click",()=>a(!0)),o&&o.addEventListener("click",()=>a(!1)),n&&n.addEventListener("click",()=>a(!1));const c=document.querySelector(".theme-toggle-btn");if(c){const t=c.querySelector(".theme-toggle-icon");if(t){if(document.documentElement.classList.contains("dark")){t.classList.replace("fa-sun","fa-moon")}else{t.classList.replace("fa-moon","fa-sun")}}c.addEventListener("click",()=>{const e=document.documentElement.classList;e.toggle("dark");if(t){if(e.contains("dark")){t.classList.replace("fa-sun","fa-moon")}else{t.classList.replace("fa-moon","fa-sun")}}})}});
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