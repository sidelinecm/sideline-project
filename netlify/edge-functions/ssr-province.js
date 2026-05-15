import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const CONFIG = {
    SUPABASE_URL: "https://zxetzqwjaiumqhrpumln.supabase.co",
    SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
    DOMAIN: "https://sidelinechiangmai.netlify.app",
    BRAND_NAME: "SIDELINE CHIANGMAI",
    TWITTER: "@sidelinechiangmai",
    DESCRIPTION: "ศูนย์รวมน้องๆ ไซด์ไลน์และเด็กเอ็นคัดเกรด VIP ทั่วประเทศไทย รับประกันโปรไฟล์ตรงปก ปลอดภัย 100% ไม่ต้องโอนมัดจำก่อนเจอตัวจริง",
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
        intents: ["รับงานเอนเตอร์เทน", "ดูแลแบบเต็มวัน", "เพื่อนเที่ยวคาเฟ่", "N-VIP ชงเหล้า", "ปาร์ตี้พูลวิลล่า"],
        traits: ["ผิวออร่าสว่าง", "หน้าหมวยน่ารัก", "ตัวเล็กสเปคป๋า", "หุ่นนางแบบ", "พูดเหนืออ้อนๆ", "สัดส่วนเป๊ะ"],
        hotels: ["โรงแรมระดับพรีเมียมแถวนิมมาน", "ที่พักใกล้คูเมือง", "คอนโดหรูเจ็ดยอด", "รีสอร์ทส่วนตัวแม่ริม"],
        services: ["บริการเอนเตอร์เทนส่วนตัว", "ดูแลฟิวแฟนเดินนิมมาน", "ปาร์ตี้พูลวิลล่าระดับ VIP", "เพื่อนเที่ยวผ่อนคลายส่วนตัว"],
        avgPrice: "1,500 - 4,000",
        uniqueIntro: `
            <p class="mb-4">สัมผัสประสบการณ์การพักผ่อนเหนือระดับในบรรยากาศเมืองเหนือไปกับ <strong>SIDELINE CHIANGMAI</strong> ศูนย์รวมน้องๆ <strong>รับงานเชียงใหม่</strong> และ <strong>สาวไซด์ไลน์เชียงใหม่</strong> ระดับพรีเมียมที่คัดสรรมาเพื่อดูแลคุณโดยเฉพาะ ไม่ว่าคุณจะเดินทางมาท่องเที่ยว พักผ่อนส่วนตัว หรือต้องการคนรู้ใจเดินควงแขน น้องๆ สาวเหนือผิวออร่า หน้าหมวย น่ารัก พร้อมให้บริการแบบฟีลแฟน (Girlfriend Experience) อย่างใกล้ชิด</p>
            <p class="mb-4">ครอบคลุมทุกโซนยอดฮิตของเชียงใหม่ สะดวกนัดหมายทั้งการเดินเล่นชิลๆ ย่าน <strong>นิมมานเหมินท์</strong>, นัดพบแบบไพรเวทในคอนโดหรูย่าน <strong>เจ็ดยอด-สันติธรรม</strong>, หรือจัดปาร์ตี้พูลวิลล่าส่วนตัวในโซน <strong>แม่ริม และหางดง</strong> บริการของเราครอบคลุมตั้งแต่ <em>เด็กเอ็นชงเหล้า (N-VIP)</em> ไปจนถึงเพื่อนเที่ยวคาเฟ่แบบเต็มวัน</p>
            <p><strong>ความปลอดภัยต้องมาก่อน:</strong> เราเข้าใจถึงความกังวลของคุณ จึงใช้ระบบ <strong>"เจอตัวจริง จ่ายเงินหน้างาน 100%"</strong> ไม่มีการบังคับโอนเงินมัดจำล่วงหน้าใดๆ ทั้งสิ้น โปรไฟล์น้องๆ ทุกคนผ่านการตรวจสอบยืนยันตัวตนแล้วว่าตรงปก ให้คุณผ่อนคลายและมีความสุขกับค่ำคืนที่เชียงใหม่อย่างไร้กังวล</p>
        `,
        faqs: [
            { q: "หาน้องๆ รับงานเชียงใหม่ โซนไหนเดินทางสะดวกและเป็นส่วนตัวสุด?", a: "โซนนิมมาน สันติธรรม และเจ็ดยอด เป็นโซนที่น้องๆ พร้อมให้บริการมากที่สุด เนื่องจากเดินทางสะดวก มีโรงแรมและคอนโดระดับพรีเมียมรองรับการนัดหมายอย่างปลอดภัย" },
            { q: "ความปลอดภัยในการเรียกสาวไซด์ไลน์เชียงใหม่?", a: "เราเน้นระบบ 'ไม่โอนมัดจำ' ลูกค้าจองคิว นัดหมายสถานที่ และจ่ายเงินหน้างานเมื่อเจอตัวน้องเท่านั้น ป้องกันมิจฉาชีพ 100% พร้อมเก็บข้อมูลลูกค้าเป็นความลับสูงสุด" },
            { q: "น้องๆ สามารถเดินทางไปบริการที่รีสอร์ทส่วนตัวต่างอำเภอได้ไหม?", a: "ได้แน่นอนครับ น้องๆ ยินดีเดินทางไปดูแลคุณถึงรีสอร์ทหรือพูลวิลล่าส่วนตัว (เช่น แม่ริม, หางดง, สันทราย) เพื่อความเป็นส่วนตัวสูงสุด แต่อาจมีค่าเดินทางเพิ่มเติมเล็กน้อยตามตกลง" }
        ]
    },
    bangkok: {
        name: "กรุงเทพ",
        geo: { lat: 13.7563, lng: 100.5018 },
        zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "สาทร", "สีลม", "ทองหล่อ", "เอกมัย", "ปิ่นเกล้า", "บางนา", "เลียบด่วน"],
        lsi: ["รับงานกรุงเทพ", "ไซด์ไลน์ กทม", "สาวไซด์ไลน์กรุงเทพ", "sideline bkk", "พริตตี้ กทม.", "เด็กเอ็นพรีเมียม", "เพื่อนเที่ยวส่วนตัว", "นางแบบรับงาน"],
        intents: ["เอนเตอร์เทนรายชั่วโมง", "ดูแลแบบเต็มวัน", "Private VIP Entertain", "เพื่อนเที่ยวทองหล่อ", "ปาร์ตี้ไพรเวท"],
        traits: ["ลูกคุณหนู", "ลุคอินเตอร์สายฝอ", "ใบหน้าเป๊ะ", "หุ่นนางแบบ", "ดูแลเอาใจเก่ง", "ลุคพนักงานออฟฟิศ"],
        hotels: ["คอนโดหรูติด BTS", "โรงแรมย่านสุขุมวิท", "ที่พักพรีเมียมห้วยขวาง", "โรงแรมหรูย่านสาทร"],
        services: ["ดูแลแบบฟิวแฟนเต็มรูปแบบ", "เพื่อนเที่ยวกลางคืนทองหล่อ", "บริการ N-Vipส่วนตัว"],
        avgPrice: "2,000 - 5,000+",
        uniqueIntro: `
            <p class="mb-4">มหานครแห่งแสงสีที่ไม่เคยหลับใหล ที่นี่คือคลับรวบรวมตัวท็อปพรีเมียมที่สุดของประเทศ บริการ <strong>รับงานกรุงเทพ</strong> และ <strong>ไซด์ไลน์ กทม.</strong> ที่พร้อมเสิร์ฟความเอ็กซ์คลูซีฟให้คุณถึงที่ ไม่ว่าจะเป็นน้องๆ นางแบบ พริตตี้ระดับท็อป หรือน้องๆ นักศึกษาลุคคุณหนู เรามีให้เลือกสรรอย่างครบครัน การันตีงานคุณภาพระดับ VIP ทุกโปรไฟล์</p>
            <p class="mb-4">สะดวกสบายด้วยทำเลครอบคลุมตั้งแต่ใจกลางเมืองอย่าง <strong>สุขุมวิท, ทองหล่อ, เอกมัย</strong> ไปจนถึงย่านฮิตอย่าง <strong>รัชดา-ห้วยขวาง</strong> เดินทางง่ายด้วย BTS/MRT หรือนัดพบแบบเป็นส่วนตัวตามคอนโดหรูและโรงแรมชั้นนำ ไม่ว่าจะเป็นบริการเพื่อนเที่ยวกลางคืน หรือ Private VIP Entertain น้องๆ พร้อมดูแลดุจคนพิเศษ</p>
            <p>ลืมความเสี่ยงเรื่องมิจฉาชีพไปได้เลย เรายึดหลัก <strong>ปลอดภัย จ่ายเงินหน้างาน ไร้กังวลเรื่องมัดจำ</strong> พบตัวจริง ถูกใจแล้วค่อยชำระเงิน ให้ค่ำคืนในกรุงเทพของคุณเป็นความทรงจำที่สมบูรณ์แบบที่สุด</p>
        `,
        faqs: [
            { q: "น้องๆ รับงานกรุงเทพ ส่วนใหญ่สะดวกโซนไหน?", a: "โซนยอดฮิตที่มีน้องๆ สแตนด์บายเยอะที่สุดคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ ซึ่งสะดวกต่อการนัดหมายตามคอนโดหรูหรือโรงแรมที่ติดรถไฟฟ้า" },
            { q: "เรียกเด็กเอ็น หรือ ไซด์ไลน์ กทม. ต้องมัดจำไหม?", a: "เพื่อความสบายใจสูงสุดของลูกค้า เราใช้ระบบเจอตัวจริงแล้วค่อยชำระเงิน ไม่มีการบังคับโอนมัดจำล่วงหน้าทุกกรณี ปลอดภัย 100%" }
        ]
    },
    lampang: {
        name: "ลำปาง",
        geo: { lat: 18.2888, lng: 99.4920 },
        zones: ["ตัวเมืองลำปาง", "สวนดอก", "พระบาท", "ม.ราชภัฏลำปาง", "เกาะคา", "แม่ทะ", "น้ำล้อม"],
        lsi: ["รับงานลำปาง", "ไซด์ไลน์ลำปาง", "สาวไซด์ไลน์ลำปาง", "sideline ลำปาง", "นักศึกษาลำปาง", "เพื่อนเที่ยวลำปาง", "เด็กเอ็นลำปาง"],
        intents: ["เอนเตอร์เทนส่วนตัว", "ดูแลฟิวแฟน", "เพื่อนเที่ยวชิลๆ", "ชงเหล้าปาร์ตี้"],
        traits: ["สาวเหนือหน้าหวาน", "น่ารักเป็นกันเอง", "เอาใจเก่ง", "ผิวขาวออร่า", "สัดส่วนดี"],
        hotels: ["โรงแรมในตัวเมืองลำปาง", "รีสอร์ทส่วนตัวสวนดอก", "ที่พักใกล้ราชภัฏ"],
        services: ["บริการเอนเตอร์เทนผ่อนคลาย", "ดูแลแบบฟิวแฟน", "เพื่อนเที่ยวคาเฟ่ลำปาง"],
        avgPrice: "1,500 - 3,000",
        uniqueIntro: `
            <p class="mb-4">เมืองรถม้าที่มีเสน่ห์ไม่แพ้ใคร พบกับน้องๆ <strong>รับงานลำปาง</strong> และ <strong>ไซด์ไลน์ลำปาง</strong> ระดับคัดเกรด ที่พร้อมดูแลคุณอย่างใกล้ชิดแบบฟีลแฟน สัมผัสความน่ารักของสาวเหนือหน้าหวาน บริการประทับใจ เอาใจเก่ง ให้ความรู้สึกอบอุ่นเหมือนมีคนรักมาคอยดูแล</p>
            <p class="mb-4">นัดหมายง่ายและเป็นส่วนตัวในโซน <strong>ตัวเมืองลำปาง, ย่านสวนดอก</strong> รวมถึงบริเวณใกล้เคียงสถานศึกษาและ <strong>ม.ราชภัฏลำปาง</strong> ไม่ว่าจะเป็นการหาเพื่อนเที่ยวคาเฟ่ชิลๆ หรือน้องๆ เด็กเอ็นชงเหล้าปาร์ตี้ เราก็มีโปรไฟล์น้องนักศึกษาพาร์ทไทม์พร้อมให้บริการ</p>
            <p>มั่นใจได้ในมาตรฐานความปลอดภัย <strong>เจอตัวจริง จ่ายเงินหน้างาน</strong> การันตีโปรไฟล์ตรงปก 100% รูปไม่แต่งเกินจริง ไม่ต้องกลัวโดนหลอกให้โอนมัดจำ</p>
        `,
        faqs: [
            { q: "หาไซด์ไลน์ลำปาง นัดเจอโซนไหนได้บ้าง?", a: "น้องๆ ส่วนใหญ่สะดวกในโซนตัวเมืองลำปาง, สวนดอก, พระบาท และโซนใกล้มหาวิทยาลัย สามารถนัดหมายตามโรงแรมหรือที่พักส่วนตัวได้อย่างปลอดภัย" },
            { q: "รับประกันความตรงปกและการบริการไหม?", a: "โปรไฟล์น้องๆ ทุกคนผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปกแน่นอน เราเน้นมารยาทการบริการระดับพรีเมียม เพื่อให้ลูกค้าประทับใจและกลับมาใช้บริการซ้ำ" }
        ]
    },
    chiangrai: {
        name: "เชียงราย",
        geo: { lat: 19.9105, lng: 99.8406 },
        zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "ม.แม่ฟ้าหลวง", "ม.ราชภัฏเชียงราย", "หอนาฬิกา", "ริมกก"],
        lsi: ["รับงานเชียงราย", "ไซด์ไลน์เชียงราย", "สาวไซด์ไลน์เชียงราย", "sideline เชียงราย", "น้องนักศึกษาเชียงราย", "เด็กเอ็นเชียงราย"],
        intents: ["เพื่อนเที่ยวคาเฟ่เชียงราย", "เอนเตอร์เทนปาร์ตี้", "ดูแลฟิวแฟนส่วนตัว"],
        traits: ["ลุคคุณหนูเชียงราย", "ขาวเนียนน่ารัก", "คุยเก่งอารมณ์ดี", "โปรไฟล์ดีตรงปก"],
        hotels: ["โรงแรมหรูริมกก", "ที่พักย่านบ้านดู่", "รีสอร์ทส่วนตัวตัวเมือง"],
        services: ["เอนเตอร์เทนพรีเมียมเชียงราย", "เพื่อนเที่ยวดูหนัง", "บริการดูแลฟิวแฟน"],
        avgPrice: "1,500 - 3,500",
        uniqueIntro: `
            <p class="mb-4">เหนือสุดแดนสยาม ศูนย์รวมความน่ารักสไตล์สาวเหนือที่คุณต้องหลงใหล บริการ <strong>รับงานเชียงราย</strong> และ <strong>ไซด์ไลน์เชียงราย</strong> รวบรวมน้องๆ นักศึกษาลุคคุณหนู และนางแบบพริตตี้ท้องถิ่น ที่พร้อมดูแลคุณให้ผ่อนคลายจากความเหนื่อยล้า</p>
            <p class="mb-4">พื้นที่ให้บริการครอบคลุมจุดสำคัญ ไม่ว่าจะเป็นทำเลใกล้มหาวิทยาลัยยอดฮิตอย่าง <strong>โซนบ้านดู่, ม.แม่ฟ้าหลวง (มฟล.)</strong> หรือใจกลาง <strong>ตัวเมืองเชียงราย และย่านริมกก</strong> น้องๆ พร้อมเป็นเพื่อนเที่ยวคาเฟ่ ดูหนัง หรือดูแลแบบฟีลแฟนส่วนตัวในโรงแรมหรู</p>
            <p>เรามอบความมั่นใจสูงสุดด้วยนโยบาย <strong>ไม่มีการโอนมัดจำล่วงหน้า</strong> จ่ายเงินเมื่อพบตัวน้องเท่านั้น การันตีงานพรีเมียม ปลอดภัย คัดเน้นๆ เฉพาะงานคุณภาพตรงปก</p>
        `,
        faqs: [
            { q: "หาไซด์ไลน์เชียงราย โซนบ้านดู่ หรือ มฟล. นัดยากไหม?", a: "โซนบ้านดู่และใกล้ ม.แม่ฟ้าหลวง เป็นย่านยอดฮิตที่มีน้องๆ พาร์ทไทม์พร้อมให้บริการมากที่สุด นัดหมายได้ง่ายและรวดเร็วมากครับ" },
            { q: "ระบบการจ่ายเงินเป็นอย่างไร มีมัดจำไหม?", a: "เราเน้นความปลอดภัยของลูกค้าเป็นหลัก จ่ายเงินสดหน้างานหลังจากเจอตัวน้องแล้วเท่านั้น 100% ไม่มีมัดจำให้ปวดหัว" }
        ]
    },
    khonkaen: {
        name: "ขอนแก่น",
        geo: { lat: 16.4322, lng: 102.8236 },
        zones: ["มข.", "กังสดาล", "หลังมอ", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
        lsi: ["รับงานขอนแก่น", "ไซด์ไลน์ขอนแก่น", "สาวไซด์ไลน์ขอนแก่น", "sideline ขอนแก่น", "เด็กเอ็นขอนแก่น", "นักศึกษาขอนแก่น"],
        intents: ["N-Vip ขอนแก่น", "เพื่อนเที่ยวกลางคืน", "ดูแลแบบฟิวแฟน"],
        traits: ["สาวอีสานผิวขาว", "หน้าตาน่ารักหมวย", "หุ่นเพรียวสัดส่วนดี", "พูดจาเพราะ"],
        hotels: ["โรงแรมหรูใกล้เซ็นทรัล", "ที่พักย่านกังสดาล", "คอนโดหรูหลังมอ"],
        services: ["เอนเตอร์เทนครบวงจร", "เพื่อนกินข้าว-ดูหนัง", "ฟิวแฟนระดับ VIP"],
        avgPrice: "1,500 - 4,000",
        uniqueIntro: `
            <p class="mb-4">ศูนย์กลางความเจริญแห่งอีสาน พร้อมเสิร์ฟความน่ารักสดใสสไตล์สาวอีสานผิวขาวออร่า บริการ <strong>รับงานขอนแก่น</strong> และ <strong>ไซด์ไลน์ขอนแก่น</strong> คัดตัวท็อปจากรั้วมหาวิทยาลัยชื่อดัง และพริตตี้ระดับแนวหน้าในพื้นที่ พร้อมเนรมิตค่ำคืนของคุณให้พิเศษกว่าที่เคย</p>
            <p class="mb-4">นัดพบได้อย่างเป็นส่วนตัวในย่านวัยรุ่นอย่าง <strong>กังสดาล, หลัง มข., โนนม่วง</strong> หรือโซนใจกลางเมืองแถว <strong>เซ็นทรัลขอนแก่น และบึงแก่นนคร</strong> ไม่ว่าคุณจะมองหาเด็กเอ็น N-VIP ดูแลปาร์ตี้ส่วนตัว หรือน้องๆ ที่บริการดูแลดั่งแฟน (ฟีลแฟน) เราก็มีให้เลือกอย่างจุใจ</p>
            <p>ตัดปัญหาโอนก่อนแล้วโดนเททิ้ง! ที่นี่ใช้ระบบ <strong>จ่ายหน้างาน 100% ไม่ต้องลุ้นมัดจำ</strong> รูปภาพตรงปก ไม่จกตา มั่นใจได้ในความเป็นมืออาชีพและการรักษาความลับสูงสุด</p>
        `,
        faqs: [
            { q: "น้องๆ ไซด์ไลน์ขอนแก่น ส่วนใหญ่เป็นใคร?", a: "เรามีทั้งน้องๆ นักศึกษาพาร์ทไทม์ลุคน่ารักใสๆ และนางแบบพริตตี้สายแซ่บที่รับงานส่วนตัว ทุกคนผ่านการสัมภาษณ์และคัดโปรไฟล์มาอย่างดี" },
            { q: "นัดหมายในขอนแก่นต้องทำอย่างไร ยุ่งยากไหม?", a: "ง่ายมากครับ เพียงเลือกน้องที่ถูกใจ ทักสอบถามคิวกับแอดมิน และนัดเจอในโรงแรมหรือคอนโดที่เป็นส่วนตัว จ่ายเงินหน้างานสะดวกที่สุด" }
        ]
    },
    chonburi: {
        name: "ชลบุรี",
        geo: { lat: 12.9236, lng: 100.8825 },
        zones: ["พัทยา", "บางแสน", "ศรีราชา", "อมตะนคร", "ตัวเมืองชลบุรี", "ม.บูรพา"],
        lsi: ["รับงานชลบุรี", "ไซด์ไลน์ชลบุรี", "สาวไซด์ไลน์พัทยา", "sideline ชลบุรี", "เพื่อนเที่ยวบางแสน", "เด็กเอ็นพัทยา"],
        intents: ["ปาร์ตี้ริมหาด", "พูลวิลล่าพัทยา", "ดูแลฟิวแฟนท่องเที่ยว", "N-Vip ชลบุรี"],
        traits: ["ผิวแทนเซ็กซี่", "หุ่นนางแบบ", "อินเตอร์ลุค", "เอาใจเก่งมาก", "สายลุยไปไหนไปกัน"],
        hotels: ["โรงแรมหรูริมหาดพัทยา", "คอนโดหรูบางแสน", "รีสอร์ทส่วนตัวศรีราชา"],
        services: ["เพื่อนเที่ยวทะเล", "เอนเตอร์เทนพูลวิลล่า", "ดูแล VIP ส่วนตัว"],
        avgPrice: "1,500 - 4,500",
        uniqueIntro: `
            <p class="mb-4">เมืองท่องเที่ยวริมทะเลที่ไม่เคยหลับใหล รวมความเซ็กซี่ระดับตัวแม่ไว้ที่นี่ บริการ <strong>รับงานชลบุรี</strong> และ <strong>สาวไซด์ไลน์พัทยา</strong> ที่ครอบคลุมทุกโซนฮิตตั้งแต่เมืองพัทยา, หาดบางแสน, ศรีราชา ไปจนถึงใกล้นิคมอมตะนคร</p>
            <p class="mb-4">ไม่ว่าคุณกำลังมองหาเพื่อนเที่ยวทะเลสุดชิลแถว <strong>บางแสน (ม.บูรพา)</strong>, น้องๆ ลุคอินเตอร์สุดแซ่บเพื่อเป็นคู่ควงใน <strong>พัทยา</strong>, หรือเด็กเอ็นสายปาร์ตี้ที่เชี่ยวชาญการเอนเตอร์เทนใน <strong>พูลวิลล่าส่วนตัว</strong> น้องๆ ของเราพร้อมลุยไปกับคุณและดูแลให้ประทับใจที่สุด</p>
            <p>เที่ยวทะเลอย่างสบายใจ ปลอดภัยไร้กังวล ด้วยนโยบายเด็ดขาด <strong>ไม่รับโอนมัดจำ จ่ายเงินเมื่อถึงหน้างานเท่านั้น</strong> การันตีความแซ่บ รูปภาพโปรไฟล์ผ่านการตรวจสอบมาแล้วว่าตรงปก 100%</p>
        `,
        faqs: [
            { q: "หาสาวไซด์ไลน์พัทยา-บางแสน รูปตรงปกไหม?", a: "เราเน้นการตรวจสอบรูปภาพให้ตรงกับตัวจริงที่สุด (No filter ลวงโลก) เพื่อให้ลูกค้าประทับใจตั้งแต่แรกพบและกลับมาใช้บริการซ้ำ" },
            { q: "น้องๆ รับงานพูลวิลล่า หรือจัดปาร์ตี้ไหม?", a: "มีครับ เรามีกลุ่มน้องๆ เด็กเอ็นสายปาร์ตี้ที่ชำนาญการเอนเตอร์เทนในพูลวิลล่าโดยเฉพาะ พร้อมสร้างสีสันให้ทริปพัทยาหรือบางแสนของคุณสนุกสุดเหวี่ยง" }
        ]
    },
    ubonratchathani: {
        name: "อุบลราชธานี",
        geo: { lat: 15.2293, lng: 104.8570 },
        zones: ["ตัวเมืองอุบล", "วารินชำราบ", "ม.อุบล", "เซ็นทรัลอุบล", "ทุ่งศรีเมือง"],
        lsi: ["รับงานอุบล", "ไซด์ไลน์อุบล", "สาวไซด์ไลน์อุบล", "sideline อุบล", "เด็กเอ็นอุบล", "เพื่อนเที่ยวอุบล"],
        intents: ["เอนเตอร์เทนส่วนตัว", "ดูแลฟิวแฟน", "เพื่อนเที่ยวงานเทศกาล"],
        traits: ["สาวอีสานหน้าหวาน", "เรียบร้อยน่ารัก", "พูดจาดีเอาใจเก่ง", "ผิวเนียนสวย"],
        hotels: ["โรงแรมในตัวเมืองอุบล", "ที่พักย่านวาริน", "โรงแรมหรูใกล้เซ็นทรัล"],
        services: ["บริการเอนเตอร์เทนแบบเป็นกันเอง", "ดูแลฟิวแฟนกินข้าวดูหนัง"],
        avgPrice: "1,500 - 3,000",
        uniqueIntro: `
            <p class="mb-4">ค้นพบมนต์เสน่ห์ความน่ารักแบบฉบับสาวอีสานใต้ บริการ <strong>รับงานอุบล</strong> และ <strong>ไซด์ไลน์อุบล</strong> ที่รวบรวมน้องๆ หน้าหวาน เรียบร้อย ผิวเนียนสวย พร้อมจะดูแลเอาใจใส่คุณอย่างอบอุ่นในแบบฉบับฟีลแฟน (Girlfriend Experience)</p>
            <p class="mb-4">น้องๆ สะดวกรับงานในพื้นที่ศูนย์กลางอย่าง <strong>ตัวเมืองอุบลราชธานี, วารินชำราบ</strong> และโซนสถานศึกษาอย่าง <strong>ม.อุบล</strong> นัดเจอง่ายตามโรงแรมหรูใกล้เซ็นทรัล หรือหาเพื่อนเที่ยวดูหนัง ทานข้าว น้องๆ ก็พร้อมเอนเตอร์เทนแบบเป็นกันเอง</p>
            <p>เราให้ความสำคัญกับความปลอดภัยของลูกค้าเป็นอันดับหนึ่ง <strong>จ่ายเงินสดเมื่อพบตัวจริงเท่านั้น ไม่มีการบังคับโอนมัดจำ</strong> การันตีงานดี โปรไฟล์ตรงปก เพื่อค่ำคืนที่แสนพิเศษของคุณ</p>
        `,
        faqs: [
            { q: "ไซด์ไลน์อุบล นัดเจอแถวไหนสะดวกและปลอดภัย?", a: "โซนตัวเมืองและบริเวณใกล้ห้างเซ็นทรัลอุบล ถือเป็นจุดนัดพบที่สะดวก มีโรงแรมและที่พักรองรับเยอะ ปลอดภัยและเป็นส่วนตัวที่สุดครับ" },
            { q: "มีการคัดกรองน้องๆ ที่มารับงานอย่างไร?", a: "เราคัดเลือกเฉพาะน้องๆ ที่มีใจรักงานบริการ มีตัวตนจริง และสัมภาษณ์ทัศนคติก่อนลงงานเสมอ เพื่อคุณภาพและมารยาทที่ดีที่สุด" }
        ]
    },
    udonthani: {
        name: "อุดรธานี",
        geo: { lat: 17.3980, lng: 102.7931 },
        zones: ["ตัวเมืองอุดร", "ยูดีทาวน์", "เซ็นทรัลอุดร", "หนองประจักษ์", "ราชภัฏอุดร"],
        lsi: ["รับงานอุดร", "ไซด์ไลน์อุดร", "สาวไซด์ไลน์อุดร", "sideline อุดร", "เด็กเอ็นอุดร", "พริตตี้อุดร"],
        intents: ["เพื่อนเที่ยว VIP อุดร", "ดูแลฟิวแฟนเอนเตอร์เทน", "N-Vip ปาร์ตี้"],
        traits: ["ลุคอินเตอร์หน้าเป๊ะ", "ขาวสวยออร่า", "แต่งตัวเก่ง", "บุคลิกดีระดับพริตตี้"],
        hotels: ["โรงแรมหรูใกล้ยูดีทาวน์", "ที่พักพรีเมียมตัวเมือง", "โรงแรมใกล้เซ็นทรัล"],
        services: ["บริการดูแลระดับ Exclusive", "เพื่อนเที่ยวกลางคืนยูดีทาวน์", "เอนเตอร์เทนส่วนตัว"],
        avgPrice: "1,500 - 4,000",
        uniqueIntro: `
            <p class="mb-4">ที่สุดของความพรีเมียมในแดนอีสานเหนือ บริการ <strong>รับงานอุดร</strong> และ <strong>ไซด์ไลน์อุดร</strong> รวบรวมนางแบบ พริตตี้ และสาวสวยระดับ VIP หน้าเป๊ะ ผิวออร่า ที่พร้อมจะทำให้ค่ำคืนของคุณที่อุดรธานีเต็มไปด้วยสีสันและไม่มีวันลืม</p>
            <p class="mb-4">สัมผัสไลฟ์สไตล์หรูหราด้วยน้องๆ ที่พร้อมเป็นเพื่อนเที่ยวกลางคืนในย่าน <strong>ยูดีทาวน์ (UD Town)</strong> หรือดูแลเอนเตอร์เทนแบบ Private ภายในที่พักโซน <strong>ตัวเมืองอุดร และเซ็นทรัล</strong> น้องๆ ของเราแต่งตัวเก่ง วางตัวดี เหมาะสำหรับควงออกงานหรือดูแลส่วนตัว</p>
            <p>รับประกันคุณภาพด้วยบริการที่โปร่งใส <strong>ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำก่อน</strong> เพื่อให้ลูกค้าคนสำคัญเช่นคุณได้รับประสบการณ์ที่ดีที่สุดอย่างไร้กังวล</p>
        `,
        faqs: [
            { q: "หาเด็กเอ็นอุดร ย่านไหนตัวท็อปเยอะและสะดวกสุด?", a: "ย่านยูดีทาวน์ (UD Town) และบริเวณใกล้เซ็นทรัลอุดร เป็นแหล่งรวมที่พักชั้นนำและน้องๆ งานดีระดับพรีเมียมสะดวกรับงานมากที่สุดครับ" },
            { q: "จองน้องๆ อุดรธานี ต้องทำอย่างไรให้ปลอดภัย?", a: "ทักแชทสอบถามคิวงานน้องที่สนใจกับแอดมิน นัดเวลาและสถานที่ให้ชัดเจน แล้วค่อยชำระเงินเมื่อพบตัวน้องจริงเท่านั้น ปลอดภัย 100%" }
        ]
    },
    phitsanulok: {
        name: "พิษณุโลก",
        geo: { lat: 16.8211, lng: 100.2659 },
        zones: ["ตัวเมืองพิษณุโลก", "ม.นเรศวร", "ริมน้ำน่าน", "เซ็นทรัลพิษณุโลก"],
        lsi: ["รับงานพิษณุโลก", "ไซด์ไลน์พิษณุโลก", "สาวไซด์ไลน์พิษณุโลก", "sideline พิษณุโลก", "น้องนักศึกษามน", "เด็กเอ็นพิษณุโลก"],
        intents: ["เพื่อนเที่ยวคาเฟ่", "ดูแลฟิวแฟนทานข้าว", "เอนเตอร์เทนส่วนตัว"],
        traits: ["สาวสองแควหน้าหวาน", "น่ารักสไตล์นักศึกษา", "พูดเพราะเป็นกันเอง", "ดูแลเอาใจใส่เก่ง"],
        hotels: ["โรงแรมหรูในเมือง", "ที่พักใกล้ ม.นเรศวร", "โรงแรมริมน้ำน่าน"],
        services: ["บริการเอนเตอร์เทนแบบฟิวแฟน", "เพื่อนเที่ยว-ดูหนัง"],
        avgPrice: "1,500 - 3,000",
        uniqueIntro: `
            <p class="mb-4">สัมผัสความอบอุ่นและน่ารักแบบฉบับสาวเมืองสองแคว บริการ <strong>รับงานพิษณุโลก</strong> และ <strong>ไซด์ไลน์พิษณุโลก</strong> ศูนย์รวมน้องๆ นักศึกษาลุคน่ารักใสๆ และพริตตี้ท้องถิ่นที่พร้อมดูแลคุณอย่างเป็นกันเอง พูดจาไพเราะ และเอาใจใส่เก่งดั่งคนรัก</p>
            <p class="mb-4">นัดหมายได้สะดวกและรวดเร็วในโซนยอดฮิต ไม่ว่าจะเป็นย่านมหาวิทยาลัยอย่าง <strong>ม.นเรศวร (มน.)</strong>, ใจกลาง <strong>ตัวเมืองพิษณุโลก</strong> หรือพักผ่อนแบบชิลๆ ตามโรงแรม <strong>ริมแม่น้ำน่าน</strong> มีให้เลือกทั้งเพื่อนเที่ยวคาเฟ่ ดูหนัง ทานข้าว หรือบริการดูแลแบบฟีลแฟนส่วนตัว</p>
            <p>เรามอบความสบายใจสูงสุดแก่ลูกค้า <strong>การันตีความตรงปก ปลอดภัย ไร้มัดจำ</strong> จ่ายเงินสดกับน้องเมื่อพบตัวจริงเท่านั้น เพื่อสร้างความทรงจำที่น่าประทับใจในพิษณุโลกให้กับคุณ</p>
        `,
        faqs: [
            { q: "หาไซด์ไลน์พิษณุโลก แถว มน. นัดยากไหม?", a: "โซน ม.นเรศวร (มน.) เป็นโซนที่มีน้องๆ นักศึกษาพาร์ทไทม์รับงานเยอะที่สุด นัดหมายได้สะดวกและรวดเร็วมาก มีที่พักรองรับมากมาย" },
            { q: "ต้องจ่ายเงินมัดจำก่อนไหม กลัวโดนหลอก?", a: "เพื่อความมั่นใจของลูกค้า เราไม่มีนโยบายให้ลูกค้าโอนเงินก่อนทุกกรณีครับ นัดเจอหน้างานแล้วค่อยจ่ายเงินเท่านั้น" }
        ]
    },
    default: {
        name: "จังหวัดอื่นๆ",
        geo: { lat: 13.7563, lng: 100.5018 },
        zones: ["ตัวเมือง", "พื้นที่ใกล้เคียง"],
        lsi: ["รับงานส่วนตัว", "สาวไซด์ไลน์", "sideline พรีเมียม", "เพื่อนเที่ยว", "เด็กเอ็น", "นักศึกษาพาร์ทไทม์", "สาวสวยตรงปก", "ดูแลฟิวแฟน"],
        intents: ["รับงานเอนเตอร์เทน", "ดูแลแบบเต็มวัน", "เพื่อนเที่ยว", "ฟิวแฟน"],
        traits: ["หน้าตาน่ารัก", "บุคลิกดี", "เอาใจเก่ง", "บริการประทับใจ"],
        hotels: ["โรงแรมในตัวเมือง", "รีสอร์ทส่วนตัว"],
        services: ["ฟิวแฟนส่วนตัว", "เพื่อนเที่ยว-ดูหนัง", "เอนเตอร์เทนผ่อนคลาย"],
        avgPrice: "1,500 - 3,500",
        uniqueIntro: `
            <p class="mb-4">หากคุณกำลังมองหาช่วงเวลาการพักผ่อนเหนือระดับในพื้นที่ของคุณ เรารวบรวมน้องๆ <strong>รับงานส่วนตัว</strong> และ <strong>ไซด์ไลน์เกรดพรีเมียม</strong> ที่ผ่านการคัดสรรอย่างเข้มงวด ทั้งรูปร่าง หน้าตา และมารยาทในการบริการ</p>
            <p class="mb-4">ไม่ว่าคุณจะต้องการเพื่อนเที่ยวแก้เหงา เด็กเอ็นเตอร์เทนสำหรับงานปาร์ตี้ หรือการดูแลเอาใจใส่แบบฟีลแฟน (Girlfriend Experience) แบบเป็นส่วนตัว น้องๆ ของเราพร้อมเดินทางไปมอบความสุขให้คุณถึงที่พัก หรือโรงแรมชั้นนำในตัวเมือง</p>
            <p>เรายึดมั่นในความปลอดภัยและความพึงพอใจของลูกค้าเป็นหลัก <strong>การันตีความตรงปก 100%</strong> พร้อมให้บริการ นัดหมายได้อย่างเป็นส่วนตัว ปลอดภัย ไม่มีการบังคับโอนมัดจำ จ่ายเงินเมื่อเจอตัวจริงเท่านั้น</p>
        `,
        faqs: [
            { q: "ใช้บริการน้องๆ รับงาน ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายเงินสดหน้างานเมื่อเจอตัวน้องจริงเท่านั้น เพื่อความปลอดภัยสูงสุดของคุณและป้องกันมิจฉาชีพ" },
            { q: "รับประกันความตรงปกไหม ถ้าน้องไม่ตรงปกทำอย่างไร?", a: "รูปโปรไฟล์ทุกรูปผ่านการคัดกรองและยืนยันตัวตนแล้วว่าตรงปก หากพบตัวจริงแล้วไม่ตรงกับรูปภาพ ลูกค้ามีสิทธิ์ยกเลิกงานได้ทันทีโดยไม่มีค่าใช้จ่าย" }
        ]
    }
};

const getFullUrl = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${CONFIG.DOMAIN}${cleanPath}`;
};

const optimizeImg = (path, width = 182, height = 228) => {
    if (!path) return getFullUrl("/images/default.webp");
    if (path.includes("res.cloudinary.com")) {
        // แก้จาก q_auto:good เป็น q_auto:eco เพื่อบีบอัดภาพขั้นสุด
        if (path.includes("/upload/")) return path.replace("/upload/", `/upload/f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face/`);
        return path;
    }
    if (path.startsWith("http")) return path;
    // ปรับลด quality สำหรับ Supabase จาก 80 เหลือ 70
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=70`;
};

const escapeHTML = (str) => {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[tag] || tag);
};

// SEO & Semantic HTML Generator for details section
const generateAppSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA.default;
    
    const termsAndConditions = [
        { t: "การจองคิวน้องๆ ส่วนตัว", d: `เพื่อความเป็นส่วนตัวสูงสุดในการเรียกน้องๆ โซน${escapeHTML(provinceName)} สมาชิก 1 ท่าน จองได้ครั้งละ 1 คิว เพื่อรักษาคุณภาพบริการแบบ VIP` },
        { t: "ความปลอดภัยทางการเงิน", d: "ชำระเงินหน้างานเมื่อพบตัวน้องจริงเท่านั้น! เราไม่มีนโยบายให้โอนมัดจำล่วงหน้าทุกกรณี ปลอดภัยจากมิจฉาชีพ 100%" },
        { t: "การตรวจสอบโปรไฟล์", d: "รูปโปรไฟล์น้องๆ ทุกคนผ่านการตรวจสอบและยืนยันตัวตนแล้ว รับประกันความตรงปก" },
        { t: "การรักษาความเป็นส่วนตัว", d: "ข้อมูลการนัดหมายและข้อมูลส่วนตัวของคุณจะถูกเก็บเป็นความลับระดับสูงสุด และถูกลบทันทีหลังจากงานเสร็จสิ้น" }
    ];

    // Internal Linking Cluster (Zones)
    const zonesHTML = (data.zones && data.zones.length > 0) ? `
        <section class="mt-12 text-center" aria-labelledby="zones-heading">
            <h2 id="zones-heading" class="text-white text-xl font-bold mb-5 font-orbitron text-neon-cyan">📍 โซนรับงานยอดฮิตใน${escapeHTML(provinceName)}</h2>
            <div class="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
                ${data.zones.map(zone => `
                    <a href="/search?q=${encodeURIComponent(zone)}" class="px-5 py-2 rounded-full border border-[#3D1A5F] bg-[#1A0B2E]/60 text-zinc-300 text-sm font-medium hover:bg-[#7000FF]/30 hover:text-white hover:border-[#7000FF] hover:shadow-[0_0_10px_rgba(112,0,255,0.4)] transition-all">
                        โซน${escapeHTML(zone)}
                    </a>
                `).join("")}
            </div>
        </section>
    ` : "";

    // ✅ FIX: นำ Microdata (itemscope, itemtype, itemprop) ออกจาก HTML ให้เหลือแค่ JSON-LD บน <head> เท่านั้น
    const faqsHTML = (data.faqs && data.faqs.length > 0) ? `
        <section class="p-[2px] bg-gradient-to-b from-[#00F3FF] to-[#7000FF] rounded-3xl shadow-[0_0_30px_rgba(0,243,255,0.15)] max-w-3xl mx-auto mt-12" aria-labelledby="faq-heading">
            <div class="bg-[#1A0B2E] rounded-[1.4rem] p-6 md:p-8">
                <div class="text-center mb-8">
                    <div class="inline-block px-6 py-2 bg-black/40 border border-[#3D1A5F] rounded-full shadow-[inset_0_0_10px_rgba(0,243,255,0.1)]">
                        <h2 id="faq-heading" class="text-white text-xl font-bold tracking-wide">คำถามที่พบบ่อย (FAQ)</h2>
                    </div>
                </div>
                <div class="space-y-4">
                    ${data.faqs.map(faq => `
                        <details class="group cyber-glass p-5 rounded-2xl border border-[#3D1A5F]/50 hover:border-[#7000FF] transition-colors duration-300 bg-[#0f0f0f]/50">
                            <summary class="flex justify-between items-center cursor-pointer text-white font-bold text-sm md:text-base list-none group-open:text-[#00F3FF]">
                                ${escapeHTML(faq.q)}
                                <i class="fas fa-chevron-down transition-transform duration-300 group-open:rotate-180 text-[#7000FF] group-open:text-[#00F3FF]"></i>
                            </summary>
                            <div class="mt-4 pt-4 border-t border-[#3D1A5F]/50">
                                <p class="text-zinc-300 text-sm leading-relaxed font-light">
                                    ${escapeHTML(faq.a)}
                                </p>
                            </div>
                        </details>
                    `).join("")}
                </div>
            </div>
        </section>` : "";

return `
    <div class="mt-12 px-4 space-y-12 pb-16">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <!-- Promotion Box -->
            <section aria-labelledby="promo-heading" class="p-[2px] bg-gradient-to-b from-[#FF007F] to-[#7000FF] rounded-3xl shadow-[0_10px_30px_rgba(255,0,127,0.15)] relative overflow-hidden h-full flex flex-col">
                <div class="bg-[#1A0B2E] rounded-[1.4rem] p-6 md:p-8 relative z-10 flex-1 flex flex-col justify-between">
                    <div class="text-center mb-6">
                        <h2 id="promo-heading" class="text-white text-lg md:text-xl font-bold tracking-tight">
                            <span class="text-[#FF007F]">VIP</span> PROMOTION
                        </h2>
                        <p class="text-zinc-400 text-xs mt-1.5 font-light">แจ้งรหัสกับแอดมินเพื่อรับสิทธิ์ดูแลระดับพิเศษ</p>
                    </div>

                    <!-- Voucher Design -->
                    <div class="relative group">
                        <!-- แสง Glow รอบรหัส -->
                        <div class="absolute -inset-1 bg-gradient-to-r from-[#FF007F] to-[#7000FF] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        
                        <div class="relative bg-[#0f0f0f] border border-dashed border-[#FF007F]/40 rounded-2xl p-4 md:p-6 overflow-hidden">
                            <!-- วงกลมเจาะรูตั๋ว (ซ้าย-ขวา) -->
                            <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1A0B2E] border-r border-[#FF007F]/40 rounded-full"></div>
                            <div class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1A0B2E] border-l border-[#FF007F]/40 rounded-full"></div>
                            
                            <div class="flex flex-col items-center gap-2">
                                <!-- [แก้ไข] จุดเสี่ยงที่ 1: เปลี่ยนเป็นสีขาวโปร่งแสง 60% เพื่อผ่านเกณฑ์คอนทราสต์ ตัวอักษรเรียวเล็กเท่าเดิม -->
                                <span class="text-[10px] text-white/60 font-bold uppercase tracking-[0.3em] font-orbitron">Exclusive Code</span>
                                <div class="flex items-center gap-3">
                                    <i class="fas fa-crown text-xs text-yellow-500/80"></i>
                                    <span class="text-white font-black text-xl md:text-2xl tracking-[0.15em] font-orbitron drop-shadow-[0_0_8px_rgba(255,0,127,0.4)]">
                                        VIP-\${provinceKey.toUpperCase()}
                                    </span>
                                    <i class="fas fa-crown text-xs text-yellow-500/80"></i>
                                </div>
                                <div class="mt-2 px-3 py-0.5 rounded-full bg-[#FF007F]/10 border border-[#FF007F]/20">
                                    <span class="text-[9px] text-[#FF007F] font-bold uppercase tracking-widest">Valid Today Only</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- [แก้ไข] จุดเสี่ยงที่ 2: ใช้ข้อความจิ๋ว [10px] และเอียงเหมือนเดิม แต่ปรับเป็นสีขาวโปร่งแสง 50% พร้อมช่องไฟเพื่อให้อ่านง่าย -->
                    <p class="text-center text-[10px] text-white/50 mt-5 font-light italic tracking-wide">
                        * สิทธิ์ VIP มีจำนวนจำกัดต่อวัน
                    </p>
                </div>
            </section>

            <!-- Terms and Conditions Box -->
            <section aria-labelledby="terms-heading" class="p-[2px] bg-gradient-to-b from-[#7000FF] to-[#FF007F] rounded-3xl shadow-[0_0_30px_rgba(112,0,255,0.2)] h-full flex flex-col">
                <div class="bg-[#1A0B2E] rounded-[1.4rem] p-6 md:p-8 flex-1">
                    <div class="text-center mb-6">
                        <h3 id="terms-heading" class="text-white text-xl font-bold tracking-wide font-orbitron">เงื่อนไขการใช้บริการ</h3>
                    </div>
                    <div class="space-y-4">
                        \${termsAndConditions.map((item, idx) => `
                            <div class="flex gap-4 items-start p-3.5 rounded-xl bg-[#0f0f0f]/60 border border-[#3D1A5F]/70">
                                <div class="w-8 h-8 shrink-0 rounded-full bg-[#7000FF]/20 text-[#00F3FF] flex items-center justify-center font-bold text-sm border border-[#7000FF]/50 font-orbitron">
                                    \${idx + 1}
                                </div>
                                <div class="pt-1">
                                    <h4 class="text-white text-sm font-bold mb-1">\${item.t}</h4>
                                    <p class="text-zinc-400 text-xs leading-relaxed font-light">\${item.d}</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </section>
        </div>

        \${zonesHTML}

        <!-- Unique Intro Box (SEO Content) -->
        <section aria-labelledby="intro-heading" class="py-12 px-6 md:px-10 bg-[#1A0B2E]/40 rounded-[2.5rem] border border-[#3D1A5F]/40 max-w-4xl mx-auto backdrop-blur-sm shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
             <h2 id="intro-heading" class="text-2xl md:text-3xl font-bold text-white mb-6 text-neon-cyan drop-shadow-md text-center">ทำไมต้องเลือกไซด์ไลน์\${escapeHTML(provinceName)} จากเรา?</h2>
            <div class="text-zinc-200 text-sm md:text-base font-light leading-loose prose prose-invert max-w-none text-justify md:text-left">
                \${data.uniqueIntro}
            </div>
        </section>

        \${faqsHTML}
        
    </div>\`;
};

// Main Server-Side Rendering Function
export default async (request, context) => {
    try {
        const url = new URL(request.url);

        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province");
            const cleanUrl = new URL(`/location/${provinceValue}`, url.origin);
            return Response.redirect(cleanUrl.toString(), 301);
        }

        const pathParts = url.pathname.split("/").filter(Boolean);
        const rawProvinceKey = pathParts[pathParts.length - 1] || "chiangmai";
        
        let provinceKey = rawProvinceKey.toLowerCase();
        try { provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase(); } catch { provinceKey = rawProvinceKey.toLowerCase(); }

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        const [provinceRes, profilesRes, allProvincesRes] = await Promise.all([
            supabase.from("provinces").select("id, nameThai, key").eq("key", provinceKey).maybeSingle(),
            supabase.from("profiles").select("id, slug, name, age, imagePath, location, rate, isfeatured, lastUpdated, active, availability")
                .eq("provinceKey", provinceKey).eq("active", true)
                .order("isfeatured", { ascending: false }).order("lastUpdated", { ascending: false }).limit(80),
            supabase.from("provinces").select("key, nameThai").order("nameThai", { ascending: true })
        ]);

        const provinceData = provinceRes.data;
        const profiles = profilesRes.data || [];
        const allProvinces = allProvincesRes.data || [];

        if (!provinceData) return context.next();

        const safeProfiles = profiles;
        const provinceName = provinceData.nameThai;
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA.default;
        
        const now = new Date();
        const CURRENT_YEAR = now.getFullYear();
        const CURRENT_MONTH = now.toLocaleString("th-TH", { month: "short" });
        const ISO_DATE = now.toISOString();

        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        const firstImage = safeProfiles.length > 0 ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        // Optimized SEO Metadata
        const profileCountStr = safeProfiles.length > 0 ? `${safeProfiles.length}+ คน` : "คัดเกรด";
        const title = `ไซด์ไลน์${provinceName} (อัปเดต ${CURRENT_MONTH} ${CURRENT_YEAR}) ${profileCountStr} VIP เด็กเอ็น ไม่มัดจำ | ${CONFIG.BRAND_NAME}`;
        
        const topZones = (seoData.zones || ["ตัวเมือง"]).slice(0, 3).join(" ");
        const description = `ศูนย์รวมสาวไซด์ไลน์${provinceName}และเด็กเอ็น VIP กว่า ${safeProfiles.length} โปรไฟล์ โซน${topZones} การันตีตรงปก 100% ดูแลฟีลแฟน เจอตัวจ่ายเงินหน้างาน ปลอดภัย ไร้มัดจำ ดูโปรไฟล์ล่าสุดที่นี่`;

        // Build Structured Data (JSON-LD Graph)
        const schemaGraph = [
            {
                "@type": "Organization",
                "@id": `${CONFIG.DOMAIN}/#organization`,
                name: CONFIG.BRAND_NAME,
                url: CONFIG.DOMAIN,
                logo: `${CONFIG.DOMAIN}/logo.png`,
                description: CONFIG.DESCRIPTION,
                sameAs: CONFIG.SOCIALS || [],
                contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: CONFIG.PHONE || "", availableLanguage: ["th", "en"] }
            },
            {
                "@type": "WebSite",
                "@id": `${CONFIG.DOMAIN}/#website`,
                url: CONFIG.DOMAIN,
                name: CONFIG.BRAND_NAME,
                publisher: { "@id": `${CONFIG.DOMAIN}/#organization` },
                potentialAction: { "@type": "SearchAction", target: `${CONFIG.DOMAIN}/search?q={search_term_string}`, "query-input": "required name=search_term_string" }
            },
            {
                "@type": "WebPage",
                "@id": `${provinceUrl}/#webpage`,
                url: provinceUrl,
                name: title,
                description: description,
                dateModified: ISO_DATE,
                isPartOf: { "@id": `${CONFIG.DOMAIN}/#website` },
                breadcrumb: { "@id": `${provinceUrl}/#breadcrumb` },
                mainEntity: { "@id": `${provinceUrl}/#service` }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${provinceUrl}/#breadcrumb`,
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "หน้าแรก", item: CONFIG.DOMAIN },
                    { "@type": "ListItem", position: 2, name: `ไซด์ไลน์${provinceName}`, item: provinceUrl }
                ]
            },
            {
                "@type": "Service",
                "@id": `${provinceUrl}/#service`,
                name: `บริการไซด์ไลน์และเด็กเอ็น VIP ในพื้นที่ ${provinceName}`,
                provider: { "@id": `${CONFIG.DOMAIN}/#organization` },
                areaServed: { "@type": "AdministrativeArea", name: provinceName },
                description: description
            },
            {
                "@type": "LocalBusiness",
                "@id": `${CONFIG.DOMAIN}/#business`,
                name: CONFIG.BRAND_NAME,
                url: CONFIG.DOMAIN,
                image: firstImage,
                priceRange: "฿฿",
                telephone: CONFIG.PHONE || "",
                address: { "@type": "PostalAddress", addressCountry: "TH" },
                geo: { "@type": "GeoCoordinates", latitude: seoData?.geo?.lat, longitude: seoData?.geo?.lng },
                openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "10:00", closes: "22:00" }
            }
        ];

        // ✅ JSON-LD FAQPage (ถูกต้องที่สุดตามหลัก Google)
        if (seoData.faqs && seoData.faqs.length > 0) {
            schemaGraph.push({
                "@type": "FAQPage",
                "@id": `${provinceUrl}/#faq`,
                mainEntity: seoData.faqs.map(faq => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } }))
            });
        }

        if (safeProfiles && safeProfiles.length > 0) {
            schemaGraph.push({
                "@type": "ItemList",
                name: `รายชื่อไซด์ไลน์ VIP ใน ${provinceName}`,
                description: `รายชื่อโปรไฟล์ ${safeProfiles.length} คนล่าสุดในพื้นที่ ${provinceName}`,
                itemListElement: safeProfiles.slice(0, 10).map((profile, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                        "@type": "Person",
                        name: profile.name || "ไม่ระบุชื่อ",
                        url: `${CONFIG.DOMAIN}/sideline/${profile.slug || profile.id}`,
                        image: optimizeImg(profile.imagePath, 300, 400),
                        description: `โปรไฟล์น้อง${profile.name || ""} รับงานโซน ${profile.location || provinceName}`
                    }
                }))
            });
        }

        const schemaData = { "@context": "https://schema.org", "@graph": schemaGraph };

        // Generate Profile Cards HTML
        let cardsHTML = "";
        if (safeProfiles && safeProfiles.length > 0) {
            const intents = seoData.intents || ["หาเพื่อนเที่ยว", "น้องเอนเตอร์เทน", "รับงานนอกสถานที่", "ฟีลแฟน", "เพื่อนเที่ยวกลางคืน", "เด็กเอ็น VIP"];
            const traits = seoData.traits || ["ผิวขาวออร่า", "หุ่นนางแบบ", "ตรงปก 100%", "บริการเป็นกันเอง", "คุยสนุกเอาใจเก่ง", "สเปกพรีเมียม"];

            cardsHTML = safeProfiles.map((profile, index) => {
                const cleanName = escapeHTML((profile.name || "ไม่ระบุชื่อ").replace(/^(น้อง\s?)/, ""));
                const profileLocation = escapeHTML(profile.location || provinceName || "ไม่ระบุโซน");
                const profileLink = `/sideline/${escapeHTML(profile.slug || profile.id)}`;
                const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (profile.availability || "").toLowerCase().includes(kw));
                
                let displayRate = "สอบถาม";
                if (profile.rate) {
                    const numRate = Number(String(profile.rate).replace(/,/g, "").trim());
                    displayRate = !isNaN(numRate) ? numRate.toLocaleString() : escapeHTML(profile.rate);
                }

                const animDelay = (index % 10) * 50;
                const lsiKeyword = seoData.lsi && seoData.lsi.length > 0 ? seoData.lsi[index % seoData.lsi.length] : `รับงาน${provinceName}`;
                
                // Smart Alt Text for SEO
                const smartAlt = `รูปโปรไฟล์น้อง${cleanName} บริการ${lsiKeyword} พิกัดโซน${profileLocation}`;
                
                // LCP Optimization: fetch priority for top 4 images
                const imageAttributes = index < 4 ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"';

                return `
                <article class="profile-card group relative bg-[#1A0B2E] rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden border border-[#3D1A5F]/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(255,0,127,0.2)] animate-fade-in-up" style="animation-delay: ${animDelay}ms; content-visibility: auto;" onclick="window.location.href='${profileLink}'">
                    
                    <a href="${profileLink}" title="ดูข้อมูลรับงานน้อง${cleanName}" class="absolute inset-0 z-30 pointer-events-auto">
                        <span class="sr-only">ดูโปรไฟล์และเรทราคาของน้อง${cleanName} โซน${profileLocation}</span>
                    </a>

                    ${(profile.isfeatured || index < 3) ? '<div class="absolute top-3 right-3 z-20 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg border border-white/20"><span class="text-[8px] sm:text-[10px] font-black text-black uppercase tracking-tighter">HOT VIP</span></div>' : ''}
                    
                   <div class="relative aspect-[3/4] w-full overflow-hidden bg-[#0A0014]">
                        <!-- เพิ่ม srcset สร้างรูป 3 ขนาด (200px สำหรับมือถือ, 300px สำหรับแท็บเล็ต, 500px สำหรับคอม) -->
                        <img src="${optimizeImg(profile.imagePath, 300, 400)}" 
                             srcset="${optimizeImg(profile.imagePath, 200, 267)} 200w,
                                     ${optimizeImg(profile.imagePath, 300, 400)} 300w,
                                     ${optimizeImg(profile.imagePath, 500, 667)} 500w"
                             sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                             alt="${smartAlt}" 
                             class="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110" 
                             ${imageAttributes} />
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0A0014] via-[#0A0014]/30 to-transparent z-10"></div>
                        
                        <!-- Status Indicator -->
                        <div class="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-md bg-black/50 border border-white/10">
                            <span class="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                ${isAvailable ? `<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F3FF] opacity-75"></span>` : ''}
                                <span class="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 ${isAvailable ? 'bg-[#00F3FF]' : 'bg-[#FF007F]'}"></span>
                            </span>
                            <span class="text-[8px] sm:text-[9px] font-bold text-white tracking-widest uppercase font-orbitron">${isAvailable ? 'ONLINE' : 'BUSY'}</span>
                        </div>

                        <!-- Info Overlay -->
                        <div class="absolute bottom-0 inset-x-0 p-3 sm:p-5 z-20 flex flex-col justify-end">
                            <div class="flex justify-between items-end mb-1">
                                <div class="flex-1 min-w-0 pr-2">
                                    <h3 class="text-lg sm:text-2xl font-bold text-white leading-tight truncate drop-shadow-md">${cleanName} <span class="text-sm font-normal text-zinc-300">| ${profile.age || '??'}</span></h3>
                                </div>
                            </div>
                            <div class="flex items-center gap-1.5 text-zinc-300 text-[10px] sm:text-xs mb-3">
                                <i class="fas fa-map-marker-alt text-[#7000FF]" aria-hidden="true"></i>
                                <span class="truncate">${profileLocation}</span>
                            </div>
                            <div class="flex justify-between items-center pt-2 sm:pt-3 border-t border-white/10">
                                <div class="font-bold text-sm sm:text-lg text-[#FF007F] font-orbitron tracking-tight">
                                    ${displayRate} ${displayRate === "สอบถาม" ? "" : "฿"}
                                </div>
                                <span class="bg-white/10 text-white hover:bg-[#FF007F] hover:text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-colors">VIEW</span>
                            </div>
                        </div>
                    </div>
                </article>`;
            }).join("");
        } else {
            cardsHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 md:py-32 text-center cyber-glass rounded-[2rem] border border-[#3D1A5F]/50">
                <div class="w-20 h-20 bg-[#1A0B2E] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(112,0,255,0.2)] border border-[#7000FF]/30">
                    <i class="fas fa-hourglass-half text-3xl text-[#00F3FF] animate-pulse" aria-hidden="true"></i>
                </div>
                <h2 class="text-2xl font-bold text-white mb-3 text-neon-cyan tracking-wide">กำลังอัปเดตโปรไฟล์</h2>
                <p class="text-zinc-300 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                    ขณะนี้กำลังจัดเตรียมโปรไฟล์น้องๆ ระดับ VIP ในโซน <strong class="text-white">${escapeHTML(provinceName)}</strong><br/>กรุณากลับมาตรวจสอบใหม่อีกครั้งในภายหลัง
                </p>
                <a href="/" class="mt-8 btn-neon px-8 py-3 rounded-full text-sm font-bold font-orbitron tracking-widest uppercase">
                    กลับหน้าหลัก
                </a>
            </div>`;
        }

        const htmlTemplate = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth bg-[#0f0f0f]">
<head>
    <script>
        (function() {
            const allowedDomains = ['sidelinechiangmai.netlify.app', 'localhost', '127.0.0.1'];
            if (!allowedDomains.includes(window.location.hostname)) {
                window.location.replace("https://sidelinechiangmai.netlify.app/?ref=stolen");
            }
        })();
    </script>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0f0f0f" />
    <meta name="apple-mobile-web-app-capable" content="yes" />

    <!-- ==================== CORE SEO ==================== -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${provinceUrl}" />
    <link rel="alternate" hreflang="th-TH" href="${provinceUrl}" />
    <link rel="alternate" hreflang="x-default" href="${provinceUrl}" />

    <!-- ==================== OPEN GRAPH & TWITTER ==================== -->
    <meta property="og:locale" content="th_TH" />
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${provinceUrl}" />
    <meta property="og:image" content="${firstImage}" />
    <meta property="og:image:secure_url" content="${firstImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${title}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${CONFIG.TWITTER}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${firstImage}" />

    <!-- ==================== PERFORMANCE ==================== -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="dns-prefetch" href="https://zxetzqwjaiumqhrpumln.supabase.co" />

    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kanit:wght@300;400;500;600&family=Orbitron:wght@400;700;900&family=Prompt:wght@300;400;500;600;700;800&display=swap" as="style" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kanit:wght@300;400;500;600&family=Orbitron:wght@400;700;900&family=Prompt:wght@300;400;500;600;700;800&display=swap" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kanit:wght@300;400;500;600&family=Orbitron:wght@400;700;900&family=Prompt:wght@300;400;500;600;700;800&display=swap"></noscript>

    <link rel="preload" as="image" href="/images/hero-sidelinechiangmai-1200.webp" imagesrcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w" sizes="(max-width: 640px) 100vw, 50vw" fetchpriority="high" />

    <!-- ==================== TAILWIND & JS ==================== -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        window.tailwind = window.tailwind || {};
        tailwind.config = {
            theme: {
                extend: {
                    colors: { cyber: { bg: '#0f0f0f', card: '#1A0B2E', border: '#3D1A5F', pink: '#FF007F', purple: '#7000FF', cyan: '#00F3FF' }, zinc: { 900: '#1A0B2E', 950: '#0f0f0f' } },
                    fontFamily: { sans:['Kanit', 'Prompt', 'sans-serif'], orbitron:['Orbitron', 'sans-serif'] },
                    keyframes: { 'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }, 'scale-in': { '0%': { transform: 'scale(0.9)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } } },
                    animation: { 'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards', 'scale-in': 'scale-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }
                }
            }
        }
    </script>

    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <!-- ==================== STRUCTURED DATA ==================== -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

    <style>
        body { margin: 0; font-family: 'Kanit', 'Prompt', sans-serif; background-color: #0f0f0f; color: #fff; background-image: radial-gradient(at 50% 0%, rgba(112, 0, 255, 0.1) 0px, transparent 70%); -webkit-tap-highlight-color: transparent; overflow-x: hidden; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(112, 0, 255, 0.5); border-radius: 4px; }
        .btn-neon { background: #FF007F; color: #fff; text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8); box-shadow: 0 0 15px rgba(255, 0, 127, 0.6); transition: all 0.3s ease; }
        .btn-neon:hover { box-shadow: 0 0 25px rgba(255, 0, 127, 0.9); transform: scale(1.05); }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        
        /* ✅ FIX: นำ [itemprop="name"] ออกจาก CSS เพื่อรองรับการนำ Microdata ออกจาก HTML */
        .breadcrumb-nav { font-size: 0.75rem; color: #a1a1aa; display: flex; }
        .breadcrumb-nav ol { list-style: none; padding: 0; margin: 0; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .breadcrumb-nav li:not(:last-child)::after { content: '/'; margin-left: 0.5rem; color: #71717a; }
        .breadcrumb-nav a { color: #d4d4d8; text-decoration: none; transition: color 0.2s; display: inline-block; }
        .breadcrumb-nav a:hover { color: #FF007F; }
        
        /* Glassmorphism helpers */
        .cyber-glass { background: rgba(26, 11, 46, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(61, 26, 95, 0.5); }
    </style>
</head>

<body class="antialiased flex flex-col min-h-screen pb-[70px] md:pb-0">

    <header role="banner">
        <nav aria-label="เมนูหลัก" class="fixed top-0 w-full z-50 pt-safe transition-transform duration-300" id="navbar" style="background: rgba(15, 15, 15, 0.85); backdrop-filter: blur(20px); border-bottom: 1px solid #3D1A5F; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-20 flex items-center justify-between">
                <a href="/" class="flex items-center" aria-label="หน้าหลัก ${CONFIG.BRAND_NAME}">
                    <img src="/images/logo-sidelinechiangmai.webp" alt="โลโก้ ${CONFIG.BRAND_NAME}" width="168" height="28" class="h-[24px] md:h-[30px] w-auto brightness-200" style="filter: drop-shadow(0 0 8px rgba(255,0,127,0.5));">
                </a>
                
                <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
                    <a href="/" class="hover:text-white transition-all">หน้าแรก</a>
                    <a href="/profiles.html" class="text-white font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-[#FF007F]" aria-current="page">น้องๆ VIP</a>
                    <a href="/locations.html" class="hover:text-white transition-all">พิกัดบริการ</a>
                    <a href="/about.html" class="hover:text-white transition-all">เกี่ยวกับเรา</a>
                    <a href="/blog.html" class="hover:text-white transition-all">บทความ</a>
                </div>
                
                <div class="flex items-center gap-3">
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="ติดต่อแอดมินผ่าน LINE" class="hidden md:flex items-center gap-2 btn-neon px-5 py-2.5 rounded-full text-sm font-bold">
                        <i class="fab fa-line text-lg" aria-hidden="true"></i> แอดไลน์จอง
                    </a>
                    <button id="menu-btn" aria-label="เปิดเมนูนำทางบนมือถือ" aria-expanded="false" class="md:hidden w-10 h-10 flex items-center justify-center text-[#FF007F] cyber-glass rounded-full hover:shadow-[0_0_15px_rgba(255,0,127,0.5)]">
                        <i class="fas fa-bars" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </nav>
    </header>

    <!-- Mobile Sidebar -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-[#0f0f0f]/80 backdrop-blur-sm z-[60] hidden opacity-0 transition-opacity duration-300" aria-hidden="true"></div>
    <nav id="sidebar-menu" aria-label="เมนูมือถือ" class="fixed top-0 right-0 h-full w-72 bg-[#0f0f0f] border-l border-[#3D1A5F] shadow-[0_0_30px_rgba(112,0,255,0.2)] z-[70] transform translate-x-full transition-transform duration-300 flex flex-col pt-safe">
        <div class="flex items-center justify-between p-5 border-b border-[#3D1A5F]">
            <span class="text-lg font-black text-[#FF007F] uppercase tracking-widest font-orbitron">MENU</span>
            <button id="close-menu-btn" aria-label="ปิดเมนู" class="w-8 h-8 flex items-center justify-center rounded-full cyber-glass text-zinc-300 hover:text-white hover:border-[#FF007F]"><i class="fas fa-times" aria-hidden="true"></i></button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
            <a href="/" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A0B2E] text-zinc-300 hover:text-white transition-all"><i class="fas fa-home w-6 text-center text-[#FF007F]"></i> หน้าแรก</a>
            <a href="/profiles.html" class="flex items-center gap-4 p-3 rounded-xl cyber-glass text-white font-bold border-[#FF007F]"><i class="fas fa-gem w-6 text-center text-[#FF007F] animate-pulse"></i> น้องๆ VIP</a>
            <a href="/locations.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A0B2E] text-zinc-300 hover:text-white transition-all"><i class="fas fa-map-marker-alt w-6 text-center text-[#FF007F]"></i> พิกัดบริการ</a>
        </div>
        <div class="p-5 border-t border-[#3D1A5F] pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 w-full btn-neon text-white py-3.5 rounded-xl font-bold uppercase font-orbitron"><i class="fab fa-line text-xl"></i> ติดต่อแอดมิน</a>
        </div>
    </nav>

    <main class="w-full relative z-20 flex-1">
        <!-- Hero Section -->
        <section aria-label="บทนำ" class="pt-24 pb-8 md:pt-32 md:pb-16 px-4 relative">
            <div class="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#7000FF]/10 blur-[120px] rounded-full pointer-events-none transform-gpu -z-10"></div>
            
            <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
                <div class="flex-1 text-center lg:text-left z-10 animate-fade-in-up">
                    
                    <!-- ✅ FIX: นำ Microdata (itemscope) ออกจาก Breadcrumb เพื่อป้องกันการทำงานซ้อนทับกับ JSON-LD -->
                    <nav aria-label="เส้นทางการนำทาง" class="breadcrumb-nav mb-4 justify-center lg:justify-start">
                      <ol>
                        <li>
                          <a href="${CONFIG.DOMAIN}">หน้าแรก</a>
                        </li>
                        <li>
                          <span aria-current="page">ไซด์ไลน์${escapeHTML(provinceName)}</span>
                        </li>
                      </ol>
                    </nav>

                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full cyber-glass text-[10px] md:text-xs font-semibold text-white uppercase tracking-widest mb-4 font-orbitron shadow-[0_0_10px_rgba(255,0,127,0.2)]">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#FF007F] animate-pulse shadow-[0_0_8px_#FF007F]"></span> ${CONFIG.BRAND_NAME}
                    </div>
                    
                    <h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight">
                        <span class="text-[#FF007F] drop-shadow-[0_0_15px_rgba(255,0,127,0.6)]">ไซด์ไลน์${escapeHTML(provinceName)}</span><br/>
                        <span class="text-white text-neon-cyan">คัดเกรด VIP (เด็กเอ็นพรีเมียม)</span>
                    </h1>
                    <p class="text-zinc-300 text-sm md:text-base mb-6 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                        สัมผัสประสบการณ์พักผ่อนเหนือระดับใน <strong>${escapeHTML(provinceName)}</strong> กับน้องๆ <strong>ไซด์ไลน์ VIP</strong> คัดพิเศษ ไม่ว่าจะเป็นเพื่อนเที่ยวหรือเด็กเอ็นดูแลปาร์ตี้ส่วนตัว การันตีความตรงปก ปลอดภัย 100% <strong>เจอตัวจ่ายเงินหน้างาน ไม่ต้องโอนมัดจำ</strong>
                    </p>

                    <div class="flex flex-col sm:flex-row items-center gap-3 md:gap-4 justify-center lg:justify-start">
                        <a href="#profiles-grid" class="w-full sm:w-auto btn-neon px-8 py-3.5 md:py-4 rounded-full font-bold text-sm text-center font-orbitron">ดูโปรไฟล์น้องๆ ทั้งหมด</a>
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto cyber-glass hover:bg-[#1A0B2E] text-white px-8 py-3.5 md:py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:border-[#00c300] transition-colors"><i class="fab fa-line text-lg text-[#00c300]"></i> ปรึกษาแอดมิน</a>
                    </div>
                </div>
                
                <div class="flex-1 w-full max-w-md lg:max-w-full animate-scale-in">
                    <div class="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden aspect-[4/5] md:aspect-square border border-[#3D1A5F] shadow-[0_0_40px_rgba(255,0,127,0.2)] group">
                        <img src="/images/hero-sidelinechiangmai-1200.webp" 
                             srcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w"
                             sizes="(max-width: 640px) 100vw, 50vw"
                             alt="บริการรับงาน ไซด์ไลน์ ${escapeHTML(provinceName)} ระดับ VIP" 
                             width="800" height="800"
                             class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-1000"
                             fetchpriority="high" decoding="sync">
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/90 via-[#0f0f0f]/20 to-transparent"></div>
                        <div class="absolute bottom-5 left-5 right-5 cyber-glass rounded-2xl p-4 flex items-center gap-4">
                            <div class="w-10 h-10 rounded-full bg-[#00F3FF] flex items-center justify-center text-black"><i class="fas fa-shield-check text-lg"></i></div>
                            <div>
                                <span class="block text-white font-bold text-sm tracking-wide font-orbitron text-neon-cyan">Verified & Safe</span>
                                <span class="block text-zinc-300 text-[10px] font-light mt-0.5">คัดกรองประวัติและยืนยันตัวตนแล้ว</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Social Links Section -->
            <div class="max-w-6xl mx-auto mt-12 md:mt-16 text-center animate-fade-in-up" style="animation-delay: 0.2s;">
                <span class="text-[10px] md:text-xs text-white font-bold uppercase tracking-[0.2em] bg-zinc-800/80 px-4 py-1.5 rounded-full font-orbitron border border-white/20 mb-5 inline-block">Official Channels</span>
                <nav aria-label="โซเชียลมีเดีย" class="overflow-x-auto no-scrollbar pb-2">
                    <div class="flex flex-nowrap justify-start lg:justify-center gap-3 w-max mx-auto px-4">
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-5 py-2.5 bg-[#00c300]/20 border border-[#00c300]/50 rounded-full text-xs font-bold text-[#00ff00] hover:scale-105 transition-transform"><i class="fab fa-line"></i> LINE</a>
                        <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/40 rounded-full text-xs font-bold text-white hover:scale-105 transition-transform"><i class="fab fa-x-twitter"></i> TWITTER</a>
                        <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-5 py-2.5 bg-[#ff0050]/20 border border-[#ff0050]/50 rounded-full text-xs font-bold text-[#ff3d7f] hover:scale-105 transition-transform"><i class="fab fa-tiktok"></i> TIKTOK</a>
                    </div>
                </nav>
            </div>
        </section>

        <!-- Filters Strip -->
        <nav aria-label="ตัวกรอง" class="sticky top-14 md:top-20 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-y border-[#3D1A5F] py-3 px-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div class="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar gap-3 items-center snap-x">
                <button aria-label="ล่าสุด" class="snap-start shrink-0 bg-white text-[#0f0f0f] px-5 py-2 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(255,255,255,0.5)]">ล่าสุด</button>
                <button aria-label="มาแรง" class="snap-start shrink-0 cyber-glass text-white px-5 py-2 rounded-full text-xs font-medium hover:border-[#FF007F] transition-all flex items-center gap-1.5"><i class="fas fa-fire text-[#FF007F]"></i> มาแรง</button>
                <button aria-label="เลือกโซน" class="snap-start shrink-0 cyber-glass text-white px-5 py-2 rounded-full text-xs font-medium hover:border-[#7000FF] transition-all flex items-center gap-1.5"><i class="fas fa-map-marker-alt text-[#7000FF]"></i> โซนให้บริการ</button>
            </div>
        </nav>

        <!-- Profiles Grid Section -->
        <section id="profiles-grid" aria-labelledby="profiles-heading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 scroll-mt-24">
            <div class="flex items-end justify-between mb-6 md:mb-8">
                <div>
                    <h2 id="profiles-heading" class="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight font-orbitron">น้องๆ ไซด์ไลน์${escapeHTML(provinceName)} พร้อมดูแลคุณ</h2>
                    <p class="text-zinc-400 text-[10px] md:text-sm font-light mt-1">อัปเดตล่าสุด: ${CURRENT_MONTH} ${CURRENT_YEAR} | ${safeProfiles.length} โปรไฟล์</p>
                </div>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
                ${cardsHTML}
            </div>
            
            ${safeProfiles.length >= 80 ? `
            <div class="mt-12 text-center">
                <a href="/search?province=${provinceKey}" aria-label="โหลดเพิ่มเติม" class="inline-flex items-center gap-2 cyber-glass text-white px-8 py-3.5 rounded-full text-sm font-bold hover:border-[#FF007F] transition-all uppercase font-orbitron group">
                    LOAD MORE <i class="fas fa-arrow-down text-[#FF007F] group-hover:translate-y-1 transition-transform"></i>
                </a>
            </div>` : ""}
        </section>

        <!-- Dynamic SEO Content -->
        ${generateAppSeoText(provinceName, provinceKey, safeProfiles.length)}

    </main>

<footer role="contentinfo" class="bg-[#0f0f0f] border-t border-[#3D1A5F] pt-12 pb-24 md:pb-12 text-left relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                <div class="md:col-span-5 space-y-4">
                    <img src="/images/logo-sidelinechiangmai.webp" alt="โลโก้ ${CONFIG.BRAND_NAME}" class="h-8 w-auto brightness-200" width="168" height="28" loading="lazy">
                    <!-- แก้ zinc-400 เป็น zinc-300 ให้สว่างขึ้น -->
                    <p class="text-sm text-zinc-300 leading-relaxed font-light max-w-sm">
                        คลับพักผ่อนระดับพรีเมียม ศูนย์รวมนางแบบและเพื่อนเที่ยวที่ปลอดภัย เราคัดกรองโปรไฟล์อย่างเข้มงวดและรักษาความลับลูกค้าเป็นอันดับหนึ่ง
                    </p>
                </div>

                <nav aria-label="เมนูส่วนล่าง" class="md:col-span-3">
                    <h3 class="text-[#FF007F] text-sm font-bold mb-5 font-orbitron">EXPLORE</h3>
                    <!-- แก้ zinc-400 เป็น zinc-300 ให้สว่างขึ้น -->
                    <ul class="space-y-3 text-sm text-zinc-300">
                        <li><a href="/profiles.html" class="hover:text-[#FF007F]">ค้นหาน้องๆ VIP</a></li>
                        <li><a href="/locations.html" class="hover:text-[#FF007F]">โซนให้บริการ</a></li>
                        <li><a href="/faq.html" class="hover:text-[#FF007F]">ขั้นตอนการจอง</a></li>
                    </ul>
                </nav>

                <nav aria-label="จังหวัดอื่นๆ" class="md:col-span-4">
                    <!-- แก้สีม่วง #7000FF เป็น #A855F7 ให้ผ่านเกณฑ์ Contrast -->
                    <h3 class="text-[#A855F7] text-sm font-bold mb-5 font-orbitron">LOCATIONS</h3>
                    <ul class="flex flex-col gap-2.5 text-sm text-zinc-300 h-[150px] overflow-y-auto pr-3 custom-scrollbar">
                        ${allProvinces.map(p => `
                            <li>
                                <a href="/location/${p.key}" class="hover:text-[#00F3FF] flex items-center justify-between group">
                                    <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-[#3D1A5F] group-hover:bg-[#00F3FF]"></span>รับงาน${escapeHTML(p.nameThai)}</div>
                                    <i class="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 text-[#00F3FF]"></i>
                                </a>
                            </li>
                        `).join("")}
                    </ul>
                </nav>
            </div>

            <div class="border-t border-[#3D1A5F] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <!-- แก้ zinc-500 เป็น zinc-400 ให้สว่างขึ้น -->
                <p class="text-[10px] md:text-xs text-zinc-400 font-orbitron">&copy; ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. All rights reserved.</p>
                <div class="flex gap-6 text-[10px] md:text-xs text-zinc-400 font-orbitron">
                    <a href="/privacy-policy.html" class="hover:text-white transition-colors">Privacy</a>
                    <a href="/terms.html" class="hover:text-white transition-colors">Terms</a>
                </div>
            </div>
            <!-- แก้ zinc-500 เป็น zinc-400 ให้สว่างขึ้น -->
            <p class="mt-4 text-[10px] text-zinc-400 text-center font-light">แพลตฟอร์มนี้เป็นเพียงสื่อกลาง ข้อมูลจัดทำขึ้นสำหรับผู้มีอายุ 20 ปีขึ้นไปเท่านั้น</p>
        </div>
    </footer>

    <!-- Mobile Bottom Nav -->
    <nav aria-label="เมนูนำทางหลักบนมือถือ" class="fixed bottom-0 left-0 w-full md:hidden z-50 pb-[env(safe-area-inset-bottom)]" style="background: rgba(15, 15, 15, 0.95); backdrop-filter: blur(24px); border-top: 1px solid #3D1A5F;">
        <ul class="flex items-center justify-around h-[65px] px-2 m-0 list-none">
            <li class="w-full h-full"><a href="/" class="flex flex-col items-center justify-center w-full h-full text-zinc-400 hover:text-[#00F3FF]"><i class="fas fa-home text-[20px] mb-1"></i><span class="text-[9px]">หน้าแรก</span></a></li>
            <li class="w-full h-full"><a href="/profiles.html" class="flex flex-col items-center justify-center w-full h-full text-[#FF007F]"><i class="fas fa-gem text-[20px] mb-1 animate-pulse drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]"></i><span class="text-[9px] font-bold">VIP</span></a></li>
<li class="w-full h-full relative">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="ติดต่อแอดมินเพื่อจองคิวผ่าน LINE" class="flex flex-col items-center justify-center w-full h-full absolute -top-7 left-0">
                    <div class="w-14 h-14 btn-neon rounded-full flex items-center justify-center text-white border-4 border-[#0f0f0f]"><i class="fab fa-line text-[26px]" aria-hidden="true"></i></div>
                </a>
            </li>
            <li class="w-full h-full"><a href="/locations.html" class="flex flex-col items-center justify-center w-full h-full text-zinc-400 hover:text-[#7000FF]"><i class="fas fa-map-marker-alt text-[20px] mb-1"></i><span class="text-[9px]">พื้นที่</span></a></li>
            <li class="w-full h-full"><a href="/search" class="flex flex-col items-center justify-center w-full h-full text-zinc-400 hover:text-white"><i class="fas fa-search text-[20px] mb-1"></i><span class="text-[9px]">ค้นหา</span></a></li>
        </ul>
    </nav>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        // Sticky Navbar hiding on scroll down
        let lastScrollY = window.scrollY;
        const navbar = document.getElementById("navbar");
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) navbar.style.transform = window.scrollY > lastScrollY ? "translateY(-100%)" : "translateY(0)";
            else navbar.style.transform = "translateY(0)";
            lastScrollY = window.scrollY;
        }, { passive: true });

        // Mobile Menu Toggle
        const menuBtn = document.getElementById("menu-btn");
        const closeBtn = document.getElementById("close-menu-btn");
        const sidebar = document.getElementById("sidebar-menu");
        const overlay = document.getElementById("sidebar-overlay");
        const toggleMenu = (show) => {
            if (show) {
                overlay.classList.remove("hidden");
                requestAnimationFrame(() => {
                    overlay.classList.remove("opacity-0");
                    sidebar.classList.remove("translate-x-full");
                });
                document.body.style.overflow = "hidden";
            } else {
                overlay.classList.add("opacity-0");
                sidebar.classList.add("translate-x-full");
                document.body.style.overflow = "";
                setTimeout(() => overlay.classList.add("hidden"), 300);
            }
        };
        if(menuBtn) menuBtn.addEventListener("click", () => toggleMenu(true));
        if(closeBtn) closeBtn.addEventListener("click", () => toggleMenu(false));
        if(overlay) overlay.addEventListener("click", () => toggleMenu(false));

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = "running";
                    entry.target.style.opacity = "1";
                    obs.unobserve(entry.target); 
                }
            });
        }, { rootMargin: "0px 0px 50px 0px", threshold: 0.05 });

        document.querySelectorAll(".animate-fade-in-up").forEach(el => {
            el.style.animationPlayState = "paused";
            observer.observe(el);
        });
    });
</script>
</body>
</html>`;

        return new Response(htmlTemplate, { 
            headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=3600" } 
        });

    } catch (error) {
        console.error("SSR Error:", error);
        return new Response('<div style="background:#0f0f0f;color:#FF007F;text-align:center;padding:50px;font-family:sans-serif;"><h1>System Error</h1><p>Please check server logs.</p></div>', { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
};