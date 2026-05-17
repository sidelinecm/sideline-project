/**
 * [ SYSTEM CORE ]
 * Project: Nexus Entity Framework (S-Tier)
 * Mastermind: wawai | Nexus Mastermind
 * Authority: Search Engine Dominance & Entity Engineering
 * Security: Anti-Clone & Domain-Lock [ACTIVE]
 * -----------------------------------------------------------
 * "I don't pray for the first page; I engineer it."
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const CONFIG = {
    SUPABASE_URL: "https://zxetzqwjaiumqhrpumln.supabase.co",
    SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
    DOMAIN: "https://sidelinechiangmai.netlify.app",
    BRAND_NAME: "SIDELINE CHIANGMAI",
    TWITTER: "@sidelinechiangmai",
    DESCRIPTION: "แหล่งรวมน้องๆสาวๆ รับงานไซด์ไลน์ ฟิวแฟนเด็กเอ็นที่บริการ ระดับVIP ที่ตรวจสอบแล้วว่าตรงปกทั่วประเทศไทย รับประกันปลอดภัย ตรงปกฟิวแฟน100% บริการประทับใจ ไม่มีโอนมัดจำก่อนเจอตัวจริง📌อตัวจริง",
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
        if (path.includes("/upload/")) return path.replace("/upload/", `/upload/f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face/`);
        return path;
    }
    if (path.startsWith("http")) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=70`;
};

const escapeHTML = (str) => {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[tag] || tag);
};

/**
 * shareContent: Web Share API สำหรับการแชร์ลง Line/Social (UX Improvement)
 */
const shareContent = async (title, text, url) => {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
        } catch (err) {
            console.log("Share failed:", err);
        }
    } else {

        navigator.clipboard.writeText(url);
        alert("sideline");
    }
};

export default async (request, context) => {
    try {
        const url = new URL(request.url);
        
        // 1. Redirects สำหรับ legacy params
        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province");
            return Response.redirect(new URL(`/location/${provinceValue}`, url.origin).toString(), 301);
        }

        // 2. Resolve Province Key
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
        if (!provinceData) return context.next();

        const safeProfiles = profilesRes.data ||[];
        const allProvinces = allProvincesRes.data ||[];
        const provinceName = provinceData.nameThai;
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA.default;
        
        const now = new Date();
        const CURRENT_MONTH = now.toLocaleString("th-TH", { month: "short" });
        const CURRENT_YEAR = now.getFullYear();
        const ISO_DATE = now.toISOString();

        // 3. Logic Canonical URL ให้สอดคล้องกับ Rewrite Rule
        const isChiangmai = (provinceKey === 'chiangmai');
        const provinceUrl = isChiangmai ? CONFIG.DOMAIN : `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} พรีเมียม (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ปลอดภัย 100%`;
        const description = `รวมโปรไฟล์น้องๆ ไซด์ไลน์${provinceName} เพื่อนเที่ยวระดับพรีเมียม ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก ✓จ่ายเงินหน้างาน ไม่โอนมัดจำ ปลอดภัยที่สุด`;

        // 4. Schema Data (ปรับปรุงให้ใช้ Canonical URL ที่ถูกต้อง)
        const schemaGraph =[
            { "@type": "Organization", "@id": `${CONFIG.DOMAIN}/#organization`, name: CONFIG.BRAND_NAME, url: CONFIG.DOMAIN, logo: `${CONFIG.DOMAIN}/logo.png`, description: CONFIG.DESCRIPTION, sameAs: CONFIG.SOCIALS, contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: CONFIG.PHONE, availableLanguage: ["th", "en"] } },
            { "@type": "WebSite", "@id": `${CONFIG.DOMAIN}/#website`, url: CONFIG.DOMAIN, name: CONFIG.BRAND_NAME, publisher: { "@id": `${CONFIG.DOMAIN}/#organization` }, potentialAction: { "@type": "SearchAction", target: `${CONFIG.DOMAIN}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } },
            { "@type": "WebPage", "@id": `${provinceUrl}/#webpage`, url: provinceUrl, name: title, description: description, dateModified: ISO_DATE, isPartOf: { "@id": `${CONFIG.DOMAIN}/#website` }, breadcrumb: { "@id": `${provinceUrl}/#breadcrumb` }, mainEntity: { "@id": `${provinceUrl}/#service` } },
            { "@type": "BreadcrumbList", "@id": `${provinceUrl}/#breadcrumb`, itemListElement:[{ "@type": "ListItem", position: 1, name: "หน้าแรก", item: CONFIG.DOMAIN }, { "@type": "ListItem", position: 2, name: `ไซด์ไลน์${provinceName}`, item: provinceUrl }] },
            { "@type": "Service", "@id": `${provinceUrl}/#service`, name: `บริการไซด์ไลน์และเด็กเอ็น VIP ในพื้นที่ ${provinceName}`, provider: { "@id": `${CONFIG.DOMAIN}/#organization` }, areaServed: { "@type": "AdministrativeArea", name: provinceName }, description: description },
            { "@type": "LocalBusiness", "@id": `${CONFIG.DOMAIN}/#business`, name: CONFIG.BRAND_NAME, url: CONFIG.DOMAIN, image: firstImage, priceRange: "฿฿", telephone: CONFIG.PHONE, address: { "@type": "PostalAddress", addressCountry: "TH" }, geo: { "@type": "GeoCoordinates", latitude: seoData?.geo?.lat, longitude: seoData?.geo?.lng }, openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "10:00", closes: "22:00" } }
        ];

        if (seoData.faqs) schemaGraph.push({ "@type": "FAQPage", "@id": `${provinceUrl}/#faq`, mainEntity: seoData.faqs.map(faq => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) });
        if (safeProfiles.length > 0) schemaGraph.push({ "@type": "ItemList", name: `รายชื่อรับงานไซด์ไลน์ บริการระดับ VIP ใน ${provinceName}`, description: `รายชื่อโปรไฟล์ ${safeProfiles.length} คนล่าสุดในพื้นที่ ${provinceName}`, itemListElement: safeProfiles.slice(0, 10).map((p, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "Person", name: p.name || "ไม่ระบุชื่อ", url: `${CONFIG.DOMAIN}/sideline/${p.slug || p.id}`, image: optimizeImg(p.imagePath, 300, 400), description: `โปรไฟล์น้อง${p.name || ""} รับงานโซน ${p.location || provinceName}` } })) });

        

        const schemaData = { "@context": "https://schema.org", "@graph": schemaGraph };

        const cardsHTML = safeProfiles.map((p, index) => {
            const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").replace(/^(น้อง\s?)/, ""));
            const profileLocation = escapeHTML(p.location || provinceName || "ไม่ระบุโซน");
            const profileLink = `/sideline/${escapeHTML(p.slug || p.id)}`;
            const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
            let displayRate = p.rate ? (Number(String(p.rate).replace(/,/g, "")) ? Number(String(p.rate).replace(/,/g, "")).toLocaleString() : escapeHTML(p.rate)) : "สอบถาม";
            const animDelay = (index % 10) * 50;
            const lsiKeyword = seoData.lsi ? seoData.lsi[index % seoData.lsi.length] : `รับงาน${provinceName}`;
            const smartAlt = `รูปโปรไฟล์น้อง${cleanName} บริการ${lsiKeyword} พิกัดโซน${profileLocation}`;
            const imageAttributes = index < 4 ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"';

            return `
            <article class="profile-card group relative bg-[#1A0B2E] rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden border border-[#3D1A5F]/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(255,127,0,0.2)] animate-fade-in-up" style="animation-delay: ${animDelay}ms; content-visibility: auto;" onclick="window.location.href='${profileLink}'">
                <a href="${profileLink}" class="absolute inset-0 z-30 pointer-events-auto"><span class="sr-only">ดูโปรไฟล์น้อง${cleanName}</span></a>
                ${(p.isfeatured || index < 3) ? '<div class="absolute top-3 right-3 z-20 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg border border-white/20"><span class="text-[8px] sm:text-[10px] font-black text-black uppercase tracking-tighter">HOT VIP</span></div>' : ''}
                <div class="relative aspect-[3/4] w-full overflow-hidden bg-[#0A0014]">
<img src="${optimizeImg(p.imagePath, 300, 400)}" 
     srcset="${optimizeImg(p.imagePath, 200, 267)} 200w, ${optimizeImg(p.imagePath, 300, 400)} 300w, ${optimizeImg(p.imagePath, 500, 667)} 500w"
     sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
     onerror="this.onerror=null; this.src='/images/default.webp';"
     alt="${smartAlt}" class="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110" ${imageAttributes} />
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0A0014] via-[#0A0014]/30 to-transparent z-10"></div>
                    <div class="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-md bg-black/50 border border-white/10">
                        <span class="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                            ${isAvailable ? '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F3FF] opacity-75"></span>' : ''}
                            <span class="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 ${isAvailable ? 'bg-[#00F3FF]' : 'bg-[#FF007F]'}"></span>
                        </span>
                        <span class="text-[8px] sm:text-[9px] font-bold text-white tracking-widest uppercase font-orbitron">${isAvailable ? 'ONLINE' : 'BUSY'}</span>
                    </div>
                    <div class="absolute bottom-0 inset-x-0 p-3 sm:p-5 z-20 flex flex-col justify-end">
                        <h3 class="text-lg sm:text-2xl font-bold text-white leading-tight truncate drop-shadow-md">${cleanName} <span class="text-sm font-normal text-zinc-300">| ${p.age || '??'}</span></h3>
                        <div class="flex items-center gap-1.5 text-zinc-300 text-[10px] sm:text-xs mb-3"><i class="fas fa-map-marker-alt text-[#7000FF]"></i><span class="truncate">${profileLocation}</span></div>
                        <div class="flex justify-between items-center pt-2 sm:pt-3 border-t border-white/10">
                            <div class="font-bold text-sm sm:text-lg text-[#FF007F] font-orbitron tracking-tight">${displayRate} ${displayRate === "สอบถาม" ? "" : "฿"}</div>
                            <span class="bg-white/10 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold">VIEW</span>
                        </div>
                    </div>
                </div>
            </article>`;
        }).join("");

        const htmlTemplate = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth bg-[#0f0f0f]">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ไซด์ไลน์${provinceName} รับงาน${provinceName} พรีเมียม (${updateText}) | ${CONFIG.BRAND_NAME}</title>
    <meta name="description" content="รวมโปรไฟล์น้องๆ รับงาน${provinceName} ไซด์ไลน์${provinceName} เกรดพรีเมียม ฟิวแฟน ตรงปก 100% ไม่โอนมัดจำ ปลอดภัยที่สุด อัปเดตล่าสุด ${updateText}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { primary: '#E6821E', dark: '#0A0A0A', surface: '#161616', muted: 'rgba(255, 255, 255, 0.6)' },
                    fontFamily: { sans: ['Inter', 'sans-serif'], heading: ['Plus Jakarta Sans', 'sans-serif'] }
                }
            }
        }
    </script>

    <style>
        body { background-color: #0A0A0A; color: white; }
        .glow-effect { background: radial-gradient(circle at 50% 50%, rgba(230, 130, 30, 0.15) 0%, transparent 50%); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E6821E; }
    </style>
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="antialiased font-sans">

    <!-- NAVIGATION -->
    <nav class="fixed top-0 w-full z-50 mix-blend-difference px-6 py-8 lg:px-12">
        <div class="max-w-[1600px] mx-auto flex justify-between items-center">
            <a href="/" class="text-xl font-heading font-bold tracking-tighter text-white uppercase">
                ${CONFIG.BRAND_NAME}<span class="text-primary">.</span>
            </a>
            <div class="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-white/70">
                <a href="#profiles" class="hover:text-primary transition-colors">Profiles</a>
                <a href="#about" class="hover:text-primary transition-colors">Experience</a>
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="text-primary">Booking</a>
            </div>
            <a href="${CONFIG.SOCIAL_LINKS.line}" class="md:hidden text-primary text-2xl">
                 <i class="fab fa-line"></i>
            </a>
        </div>
    </nav>

    <!-- HERO SECTION -->
    <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] glow-effect rounded-full blur-[120px]"></div>
        <div class="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
            <h1 class="font-heading text-[clamp(2.5rem,7.5vw,6.5rem)] leading-[0.9] font-extrabold tracking-tighter mb-8 uppercase">
                PREMIUM GIRLS.<br>
                <span class="text-primary">${provinceName.toUpperCase()} SELECTION.</span>
            </h1>
            <p class="text-lg md:text-xl text-muted max-w-xl leading-relaxed mb-10">
                ยกระดับประสบการณ์พักผ่อนระดับ VIP ใน${provinceName} น้องๆ ตรงปก 100% ดูแลแบบฟีลแฟน ปลอดภัยที่สุดด้วยระบบจ่ายเงินหน้างาน
            </p>
            <div class="flex flex-wrap gap-4">
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="bg-white text-black px-10 py-5 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300">Start Your Booking</a>
                <a href="#profiles" class="border border-white/20 px-10 py-5 rounded-full font-bold text-sm hover:bg-white/10 transition-all">View Our Profiles</a>
            </div>
        </div>
    </section>

    <!-- CAPABILITIES SECTION (Studio Style) -->
    <section id="about" class="py-24 bg-surface/30">
        <div class="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div class="mb-16">
                <span class="text-primary text-xs uppercase tracking-[0.3em] font-bold">The Standard</span>
                <h2 class="text-4xl md:text-5xl font-heading font-bold mt-4">Safe & Verified.</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
                <div class="bg-dark p-10 hover:bg-white/[0.02] transition-colors group">
                    <h3 class="text-2xl font-heading font-bold mb-4">No Pre-payment</h3>
                    <p class="text-muted leading-relaxed">ป้องกันมิจฉาชีพ 100% จ่ายเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น ไม่มีการขอโอนมัดจำก่อนทุกกรณี</p>
                </div>
                <div class="bg-dark p-10 hover:bg-white/[0.02] transition-colors group">
                    <h3 class="text-2xl font-heading font-bold mb-4">Real Profiles</h3>
                    <p class="text-muted leading-relaxed">น้องๆ ทุกคนผ่านการตรวจสอบใบหน้าและยืนยันตัวตนแล้ว มั่นใจได้ว่ารูปตรงปก ไม่ใช้รูปปลอม</p>
                </div>
                <div class="bg-dark p-10 hover:bg-white/[0.02] transition-colors group">
                    <h3 class="text-2xl font-heading font-bold mb-4">VIP Manners</h3>
                    <p class="text-muted leading-relaxed">เน้นการบริการที่สุภาพ เรียบร้อย และมีความเป็นมืออาชีพ น้องๆ มีทัศนคติที่ดี พร้อมดูแลคุณดั่งคนสำคัญ</p>
                </div>
            </div>
        </div>
    </section>

    <!-- PROFILES GRID -->
    <section id="profiles" class="py-24">
        <div class="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                    <span class="text-primary text-xs uppercase tracking-[0.3em] font-bold">Selected Profiles</span>
                    <h2 class="text-4xl md:text-6xl font-heading font-bold mt-4">Latest Profiles.</h2>
                </div>
                <span class="text-muted text-sm font-bold uppercase tracking-widest">Available: ${profiles.length}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                ${profiles.map(p => `
                <div class="group cursor-pointer" onclick="window.location.href='/sideline/${p.slug || p.id}'">
                    <div class="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface mb-6 border border-white/5">
                        <img src="${optimizeImg(p.imagePath)}" alt="${p.name}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" loading="lazy">
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span class="bg-white text-black px-6 py-3 rounded-full font-bold text-sm">View Profile</span>
                        </div>
                        ${p.isfeatured ? '<div class="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Top VIP</div>' : ''}
                    </div>
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-xl font-bold font-heading text-white">${escapeHTML(p.name)} <span class="text-muted font-normal">| ${p.age}</span></h3>
                            <p class="text-primary font-bold text-lg mt-1">${p.rate ? Number(p.rate).toLocaleString() : 'สอบถาม'} ฿</p>
                            <p class="text-muted text-xs uppercase tracking-widest mt-2">${p.location || provinceName}</p>
                        </div>
                    </div>
                </div>`).join("")}
            </div>
        </div>
    </section>

    <!-- SEO CONTENT -->
    <section class="py-24 border-t border-white/5">
        <div class="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div class="lg:col-span-8">
                    <h2 class="text-3xl font-heading font-bold mb-8">บริการรับงาน ไซด์ไลน์${provinceName}</h2>
                    <div class="prose prose-invert max-w-none text-muted leading-loose text-base">
                        ${smartLinkify(seo.uniqueIntro, seo.zones)}
                    </div>
                    
                    <h3 class="text-2xl font-heading font-bold mt-16 mb-8 uppercase tracking-tighter">Common Questions</h3>
                    <div class="space-y-4">
                        ${seo.faqs.map(f => `
                        <details class="group bg-surface/30 border border-white/5 rounded-3xl p-6 md:p-8">
                            <summary class="flex justify-between items-center cursor-pointer list-none font-bold text-lg">
                                ${f.q} <span class="text-primary transition-transform group-open:rotate-180"><i class="fas fa-chevron-down"></i></span>
                            </summary>
                            <p class="mt-6 text-muted leading-relaxed">${f.a}</p>
                        </details>`).join("")}
                    </div>
                </div>
                <div class="lg:col-span-4">
                    <div class="bg-primary/10 rounded-[2rem] p-8 border border-primary/20 sticky top-32">
                        <h4 class="font-bold text-primary mb-4 uppercase tracking-widest text-sm">Zone Locations</h4>
                        <div class="flex flex-wrap gap-2">
                            ${seo.zones.map(z => `<span class="px-3 py-1 bg-dark rounded-full text-xs text-white/70 border border-white/10">${z}</span>`).join("")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA SECTION -->
    <section class="py-24 px-6">
        <div class="max-w-[1600px] mx-auto bg-primary rounded-[3rem] p-12 md:p-24 text-center">
            <h2 class="text-4xl md:text-7xl font-heading font-extrabold text-white mb-10 tracking-tighter">READY TO EXPERIENCE?<br>SHIP IT NOW.</h2>
            <a href="${CONFIG.SOCIAL_LINKS.line}" class="inline-block bg-black text-white px-12 py-6 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl">
                <i class="fab fa-line mr-2"></i> LINE CONTACT
            </a>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="py-20 border-t border-white/10">
        <div class="max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-16">
            <div>
                <div class="text-2xl font-heading font-bold mb-6">${CONFIG.BRAND_NAME}<span class="text-primary">.</span></div>
                <p class="text-muted text-sm leading-relaxed max-w-xs">คลับพรีเมียมสำหรับการพักผ่อนระดับสูง รักษาความลับและดูแลความปลอดภัยลูกค้าเป็นอันดับหนึ่ง</p>
            </div>
            <div>
                <h4 class="font-bold text-primary uppercase tracking-[0.3em] text-xs mb-8">LOCATIONS</h4>
                <div class="grid grid-cols-2 gap-4 text-[11px] font-bold text-white/50 h-[180px] overflow-y-auto pr-4 custom-scrollbar">
                    ${allProvinces.map(p => `<a href="/location/${p.key}" class="hover:text-white transition-colors">รับงาน${p.nameThai}</a>`).join("")}
                </div>
            </div>
            <div class="flex flex-col items-start md:items-end">
                <h4 class="font-bold text-primary uppercase tracking-[0.3em] text-xs mb-8">CONNECT</h4>
                <div class="flex gap-6 text-2xl mb-8">
                    <a href="${CONFIG.SOCIAL_LINKS.line}" class="hover:text-primary"><i class="fab fa-line"></i></a>
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" class="hover:text-primary"><i class="fab fa-x-twitter"></i></a>
                </div>
                <div class="text-[10px] text-muted font-bold tracking-widest uppercase">© ${now.getFullYear()} ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</div>
            </div>
        </div>
    </footer>

    <!-- MOBILE NAV -->
    <nav class="fixed bottom-0 left-0 w-full md:hidden z-50 bg-dark/95 backdrop-blur-xl border-t border-white/10 py-3">
        <div class="flex justify-around items-center px-4">
            <a href="/" class="flex flex-col items-center gap-1 text-muted hover:text-primary"><i class="fas fa-home"></i><span class="text-[9px]">Home</span></a>
            <a href="${CONFIG.SOCIAL_LINKS.line}" class="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center -mt-8 border-4 border-dark"><i class="fab fa-line text-2xl"></i></a>
            <a href="#profiles" class="flex flex-col items-center gap-1 text-muted hover:text-primary"><i class="fas fa-users"></i><span class="text-[9px]">Profiles</span></a>
        </div>
    </nav>

    <!-- 6. JAVASCRIPT LOGIC -->
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // -- Menu Control Logic --
            const menuBtn = document.getElementById('menu-btn');
            const closeBtn = document.getElementById('close-menu-btn');
            const sidebar = document.getElementById('sidebar-menu');
            const overlay = document.getElementById('sidebar-overlay');

            const toggleMenu = (show) => {
                if (!sidebar || !overlay) return;
                
                if(show) {
                    overlay.classList.remove('hidden');
                    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
                    
                    requestAnimationFrame(() => {
                        overlay.classList.remove('opacity-0');
                        sidebar.classList.remove('translate-x-full');
                    });
                    document.body.style.overflow = 'hidden'; // ป้องกันการเลื่อนฉากหลัง
                } else {
                    overlay.classList.add('opacity-0');
                    sidebar.classList.add('translate-x-full');
                    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
                    document.body.style.overflow = '';
                    
                    setTimeout(() => overlay.classList.add('hidden'), 300);
                }
            };

            if(menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
            if(closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
            if(overlay) overlay.addEventListener('click', () => toggleMenu(false));

            // ปิดเมนูเมื่อกดปุ่ม ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !sidebar.classList.contains('translate-x-full')) {
                    toggleMenu(false);
                }
            });

            // -- Navbar Scroll Effect --
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

            // -- Intersection Observer for Animations --
            const animElements = document.querySelectorAll(".animate-fade-in-up");
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });
            
            animElements.forEach(el => observer.observe(el));
        });
    </script>
</body>
</html>`;

        return new Response(html, {
            headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=60, stale-while-revalidate=3600" }
        });

    } catch (e) {
        console.error("SSR Error:", e);
        return new Response('<div style="background:#000;color:#fff;padding:20px;">System Maintenance. Contact Mastermind.</div>', { status: 500, headers: { "Content-Type": "text/html" } });
    }
};