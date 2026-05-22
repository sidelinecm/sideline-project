/**
 * [ SYSTEM CORE ]
 * Project: Nexus Entity Framework (S-Tier) - ULTIMATE NEO-LUXURY NOIR
 * Mastermind: wawai | Nexus Mastermind
 * Authority: Search Engine Dominance & Entity Engineering
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const CONFIG = {
    SUPABASE_URL: "https://zxetzqwjaiumqhrpumln.supabase.co",
    SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
    DOMAIN: "https://sidelinechiangmai.netlify.app",
    BRAND_NAME: "SIDELINE CHIANGMAI",
    TWITTER: "@sidelinechiangmai",
    DESCRIPTION: "แหล่งรวมน้องๆสาวๆ รับงานไซด์ไลน์ ฟิวแฟนเด็กเอ็นที่บริการ ระดับVIP ที่ตรวจสอบแล้วว่าตรงปกทั่วประเทศไทย รับประกันปลอดภัย ตรงปกฟิวแฟน100% บริการประทับใจ ไม่มีโอนมัดจำก่อนเจอตัวจริง📌",
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

Object.keys(PROVINCE_SEO_DATA).forEach(key => {
    if(!PROVINCE_SEO_DATA[key].uniqueIntro) PROVINCE_SEO_DATA[key] = {...PROVINCE_SEO_DATA.default, ...PROVINCE_SEO_DATA[key]};
});

// [ฟังก์ชันแกนหลักเดิมของคุณ นำกลับมาใช้ทั้งหมด]
const getFullUrl = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${CONFIG.DOMAIN}${cleanPath}`;
};

const optimizeImg = (path, width = 500, height = 667) => {
    if (!path) return getFullUrl("/images/default.webp");
    if (path.includes("res.cloudinary.com")) {
        if (path.includes("/upload/")) return path.replace("/upload/", `/upload/f_auto,q_auto:eco,w_${width},h_${height},c_fill,g_face/`);
        return path;
    }
    if (path.startsWith("http")) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=85`;
};

const escapeHTML = (str) => {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[tag] || tag);
};

const shareContent = async (title, text, url) => {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
        } catch (err) {
            console.log("Share failed:", err);
        }
    } else {
        navigator.clipboard.writeText(url);
        alert("คัดลอกลิงก์แล้ว");
    }
};

const smartLinkify = (text, provinceKey, zones) => {
    if (!text) return "";
    let linkedText = text;
    if (zones && zones.length > 0) {
        zones.forEach(zone => {
            const regex = new RegExp(`(${zone})`, 'g');
            // ปรับสีลิงก์ให้เข้ากับ ธีม Noir
            linkedText = linkedText.replace(regex, `<a href="/search?q=${encodeURIComponent(zone)}" class="text-brand-gold hover:underline transition-colors font-medium">$1</a>`);
        });
    }

    const keywords = ["เด็กเอ็น", "ไซด์ไลน์", "พรีเมียม", "ฟีลแฟน", "รับงาน"];
    keywords.forEach(kw => {
        const regex = new RegExp(`(${kw})`, 'g');
        // ปรับสีลิงก์ให้เข้ากับ ธีม Noir
        linkedText = linkedText.replace(regex, `<a href="/search?q=${encodeURIComponent(kw)}" class="text-brand-pink/90 hover:text-brand-pink transition-colors font-bold">$1</a>`);
    });

    return linkedText;
};

const generateAppSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA.default;
    
    const termsAndConditions = [
        { t: "การจองคิวน้องๆ ส่วนตัว", d: `เพื่อความเป็นส่วนตัวสูงสุดในการเรียกน้องๆ โซน${escapeHTML(provinceName)} สมาชิก 1 ท่าน จองได้ครั้งละ 1 คิว เพื่อรักษาคุณภาพบริการแบบ VIP` },
        { t: "ความปลอดภัยทางการเงิน", d: "ชำระเงินหน้างานเมื่อพบตัวน้องจริงเท่านั้น! เราไม่มีนโยบายให้โอนมัดจำล่วงหน้าทุกกรณี ปลอดภัยจากมิจฉาชีพ 100%" },
        { t: "การตรวจสอบโปรไฟล์", d: "รูปโปรไฟล์น้องๆ ทุกคนผ่านการตรวจสอบและยืนยันตัวตนแล้ว รับประกันความตรงปก" },
        { t: "การรักษาความเป็นส่วนตัว", d: "ข้อมูลการนัดหมายและข้อมูลส่วนตัวของคุณจะถูกเก็บเป็นความลับระดับสูงสุด และถูกลบทันทีหลังจากงานเสร็จสิ้น" }
    ];

    const zonesHTML = (data.zones && data.zones.length > 0) ? `
        <div class="reveal text-center relative z-10 pt-8">
            <h2 class="text-2xl font-bold mb-10 flex items-center justify-center gap-3 text-white">
                <i class="fas fa-map-location-dot text-brand-pink"></i> โซนรับงานยอดฮิตใน${escapeHTML(provinceName)}
            </h2>
            <div class="flex flex-wrap justify-center gap-3">
                ${data.zones.map(zone => `
                    <a href="/search?q=${encodeURIComponent(zone)}" class="px-8 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-gray-300 hover:bg-white hover:text-black hover:scale-105 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.2)]">${escapeHTML(zone)}</a>
                `).join("")}
            </div>
        </div>` : "";

    const faqsHTML = (data.faqs && data.faqs.length > 0) ? `
        <div class="reveal max-w-3xl mx-auto space-y-6 pb-20 relative z-10 pt-10">
            <h2 class="text-3xl font-black text-center mb-12 text-white">คำถามที่พบบ่อย (FAQ)</h2>
            ${data.faqs.map((faq, idx) => `
                <details class="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden transition-all duration-300" ${idx === 0 ? 'open' : ''}>
                    <summary class="flex justify-between items-center p-8 cursor-pointer list-none font-bold text-white text-lg">
                        <span class="flex items-center gap-4">
                            <span class="text-brand-pink text-xl"><i class="fas fa-comment-dots"></i></span>
                            ${escapeHTML(faq.q)}
                        </span>
                        <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-open:bg-brand-pink group-open:rotate-45 transition-all">
                            <i class="fas fa-plus text-xs text-white"></i>
                        </div>
                    </summary>
                    <div class="px-8 pb-8 pt-2 ml-10 text-gray-400 text-sm font-light leading-relaxed border-l-2 border-brand-pink/30 ml-12">
                        ${escapeHTML(faq.a)}
                    </div>
                </details>
            `).join("")}
        </div>` : "";


    return `
        <section class="py-24 bg-brand-dark text-white relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,51,102,0.08),transparent_50%)] pointer-events-none"></div>
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.05),transparent_50%)] pointer-events-none"></div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-pink/50 to-transparent"></div>
            
            <div class="max-w-7xl mx-auto px-6 space-y-32">
                
                <!-- VIP & Terms Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <!-- VIP Promotion Card -->
                    <div class="reveal bg-gradient-to-br from-[#0F0F13] to-[#050505] p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                        <div class="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/10 blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700"></div>
                        <div class="absolute top-8 right-10 text-white/5 text-8xl font-black select-none">VIP</div>
                        
                        <div class="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 rounded-full border border-brand-gold/20 mb-6">
                            <span class="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
                            <span class="text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold">Exclusive Code</span>
                        </div>
                        
                        <h3 class="text-gray-300 text-sm md:text-base mb-8 font-light">แจ้งรหัสลับนี้กับแอดมิน เพื่อรับการดูแลจัดคิวระดับ <strong>Super VIP</strong> ทันที</h3>
                        
                        <div class="bg-[#1A1A20]/80 backdrop-blur-md rounded-3xl p-10 border border-white/5 text-center relative shadow-inner">
                            <div class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-5 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF380] to-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] select-all">
                                VIP-${provinceKey.toUpperCase()}
                            </div>
                            <span class="inline-block bg-gradient-to-r from-brand-pink to-purple-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,51,102,0.4)]">
                                Valid Today Only
                            </span>
                        </div>
                    </div>

                    <!-- Terms & Conditions Card -->
                    <div class="reveal space-y-10">
                        <h3 class="text-3xl font-black tracking-tight flex items-center gap-4">
                            <i class="fas fa-shield-check text-brand-pink"></i> เงื่อนไขการใช้บริการ
                        </h3>
                        <div class="space-y-6">
                            ${termsAndConditions.map((item, idx) => `
                                <div class="flex gap-6 items-start p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                                    <div class="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-bold group-hover:bg-brand-pink transition-all shadow-lg text-white">${idx + 1}</div>
                                    <div>
                                        <h4 class="text-lg font-bold mb-1 text-white">${item.t}</h4>
                                        <p class="text-gray-400 text-sm font-light leading-relaxed">${item.d}</p>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>

                ${zonesHTML}

                <!-- SEO Content Section (Smart Linkified) -->
                <div class="reveal bg-white rounded-[4rem] p-10 md:p-20 text-brand-dark text-center shadow-[0_30px_60px_rgba(255,255,255,0.1)] relative z-10">
                    <div class="max-w-3xl mx-auto space-y-10">
                        <div class="w-20 h-20 bg-brand-dark text-brand-pink rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-xl shadow-black/20 transform -rotate-6">
                            <i class="fas fa-heart"></i>
                        </div>
                        <h2 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight">ทำไมต้องเลือกไซด์ไลน์<br><span class="text-brand-pink">${escapeHTML(provinceName)}</span> จากเรา?</h2>
                        <div class="text-gray-600 text-sm md:text-lg font-light leading-loose space-y-8 text-left md:text-center">
                            ${smartLinkify(data.uniqueIntro, provinceKey, data.zones)}
                        </div>
                    </div>
                </div>

                ${faqsHTML}

            </div>
        </section>`;
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
        
        const firstImage = safeProfiles.length > 0 ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) : `${CONFIG.DOMAIN}/images/hero-sidelinechiangmai-1200.webp`;

        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} พรีเมียม (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ปลอดภัย 100%`;
        const description = `รวมโปรไฟล์น้องๆ ไซด์ไลน์${provinceName} เพื่อนเที่ยวระดับพรีเมียม ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก ✓จ่ายเงินหน้างาน ไม่โอนมัดจำ ปลอดภัยที่สุด`;

        // 4. Schema Data (นำ Schema ฉบับสมบูรณ์ของคุณกลับมา + เพิ่ม AggregateRating)
        const schemaGraph =[
            { 
                "@type": "Organization", 
                "@id": `${CONFIG.DOMAIN}/#organization`, 
                name: CONFIG.BRAND_NAME, 
                url: CONFIG.DOMAIN, 
                logo: `${CONFIG.DOMAIN}/logo.png`, 
                description: CONFIG.DESCRIPTION, 
                sameAs: CONFIG.SOCIALS, 
                contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: CONFIG.PHONE, availableLanguage: ["th", "en"] } 
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
                itemListElement:[
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
                telephone: CONFIG.PHONE, 
                address: { "@type": "PostalAddress", addressCountry: "TH" }, 
                geo: { "@type": "GeoCoordinates", latitude: seoData?.geo?.lat, longitude: seoData?.geo?.lng }, 
                openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "10:00", closes: "22:00" },
                aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "256" }
            }
        ];

        if (seoData.faqs) schemaGraph.push({ "@type": "FAQPage", "@id": `${provinceUrl}/#faq`, mainEntity: seoData.faqs.map(faq => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) });
        if (safeProfiles.length > 0) schemaGraph.push({ "@type": "ItemList", name: `รายชื่อรับงานไซด์ไลน์ บริการระดับ VIP ใน ${provinceName}`, description: `รายชื่อโปรไฟล์ ${safeProfiles.length} คนล่าสุดในพื้นที่ ${provinceName}`, itemListElement: safeProfiles.slice(0, 10).map((p, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "Person", name: p.name || "ไม่ระบุชื่อ", url: `${CONFIG.DOMAIN}/sideline/${p.slug || p.id}`, image: optimizeImg(p.imagePath, 300, 400), description: `โปรไฟล์น้อง${p.name || ""} รับงานโซน ${p.location || provinceName}` } })) });

        const schemaData = { "@context": "https://schema.org", "@graph": schemaGraph };

        // 5. โครงสร้าง Cards (นำคุณสมบัติ SEO เชิงลึกเดิมกลับมา เช่น srcset, article, content-visibility)
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

            const hotBadge = (p.isfeatured || index < 3) ? `<div class="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#FFF380] text-brand-dark text-[9px] font-black px-4 py-1.5 rounded-full shadow-[0_5px_15px_rgba(212,175,55,0.4)] z-20 tracking-widest uppercase">HOT VIP</div>` : '';
            const statusPulse = isAvailable ? `<span class="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]"></span>` : `<span class="w-2 h-2 rounded-full bg-gray-500"></span>`;

            return `
            <article class="reveal profile-card group relative bg-white rounded-[2rem] overflow-hidden cursor-pointer" style="transition-delay: ${animDelay}ms; content-visibility: auto;" onclick="window.location.href='${profileLink}'">
                <a href="${profileLink}" class="absolute inset-0 z-30 pointer-events-auto"><span class="sr-only">ดูโปรไฟล์น้อง${cleanName} ${lsiKeyword}</span></a>
                ${hotBadge}
                
                <div class="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img src="${optimizeImg(p.imagePath, 500, 667)}" 
                         srcset="${optimizeImg(p.imagePath, 300, 400)} 300w, ${optimizeImg(p.imagePath, 500, 667)} 500w"
                         sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                         onerror="this.onerror=null; this.src='/images/default.webp';"
                         alt="${smartAlt}" class="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110" ${imageAttributes} />
                         
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                    
                    <div class="absolute bottom-5 left-5 right-5 text-white z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 class="text-2xl font-black leading-none tracking-tight drop-shadow-md">${cleanName} <span class="text-xs font-light text-white/60 ml-1">${p.age || '??'}</span></h3>
                        <p class="text-[10px] font-bold text-white/80 mt-2 flex items-center gap-2 uppercase tracking-widest bg-black/30 backdrop-blur-sm w-max px-2.5 py-1 rounded-lg border border-white/10">
                            ${statusPulse}
                            <span class="truncate"><i class="fas fa-location-arrow text-brand-pink ml-0.5"></i> ${profileLocation}</span>
                        </p>
                    </div>
                </div>
                
                <div class="p-5 flex justify-between items-center border-t border-gray-50 bg-white relative z-40">
                    <span class="text-base font-black text-brand-dark tracking-tighter">${displayRate} ${displayRate !== "สอบถาม" ? "฿" : ""}</span>
                    <div class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,51,102,0.4)] group-hover:border-transparent">
                        <i class="fas fa-arrow-right text-xs"></i>
                    </div>
                </div>
            </article>`;
        }).join("");

        const htmlTemplate = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth bg-white">
<head>
    <script>
        (function() {
            var auth = ['sidelinechiangmai.netlify.app', 'localhost', '127.0.0.1'];
            if (!auth.includes(window.location.hostname)) {
                document.documentElement.innerHTML = '<div style="background:#000;color:#f00;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;"><h1>403 FORBIDDEN</h1><p>Unauthorized domain. Redirecting...</p></div>';
                setTimeout(function() { window.location.replace("https://sidelinechiangmai.netlify.app/?ref=stolen_by_" + btoa(window.location.hostname)); }, 1500);
            }
        })();
    </script>
    <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /><meta name="theme-color" content="#0f0f0f" /><meta name="apple-mobile-web-app-capable" content="yes" />
    <title>${title}</title><meta name="description" content="${description}" />
    
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <meta name="google-site-verification" content="0N_IQUDZv9Y2WtNhjqSPTV3TuPsildmmO-TPwdMlSfg" />
    <link rel="canonical" href="${provinceUrl}" /><link rel="alternate" hreflang="th-TH" href="${provinceUrl}" /><link rel="alternate" hreflang="x-default" href="${provinceUrl}" />
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}" /><meta property="og:type" content="website" /><meta property="og:title" content="${title}" /><meta property="og:description" content="${description}" /><meta property="og:url" content="${provinceUrl}" /><meta property="og:image" content="${firstImage}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:site" content="${CONFIG.TWITTER}" /><meta name="twitter:image" content="${firstImage}" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link rel="dns-prefetch" href="https://zxetzqwjaiumqhrpumln.supabase.co" />
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&family=Orbitron:wght@400;700;900&family=Prompt:wght@300;400;500;600&display=swap" as="style" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&family=Orbitron:wght@400;700;900&family=Prompt:wght@300;400;500;600&display=swap" media="print" onload="this.media='all'" />
    <link rel="preload" as="image" href="/images/hero-sidelinechiangmai-1200.webp" imagesrcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w" sizes="(max-width: 640px) 100vw, 50vw" fetchpriority="high" />
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { 
            theme: { 
                extend: { 
                    colors: { brand: { pink: '#FF3366', dark: '#050505', gold: '#D4AF37' } },
                    fontFamily: { sans:['Kanit', 'sans-serif'] },
                    animation: { 'heartbeat': 'heartbeat 1.5s ease-in-out infinite both' },
                    keyframes: { heartbeat: { '0%': { transform: 'scale(1)' }, '14%': { transform: 'scale(1.3)' }, '28%': { transform: 'scale(1)' }, '42%': { transform: 'scale(1.3)' }, '70%': { transform: 'scale(1)' } } }
                } 
            } 
        }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root { --glass: rgba(255, 255, 255, 0.85); }
        body { background: #FFFFFF; color: #0A0A0A; -webkit-font-smoothing: antialiased; }
        
        .mesh-bg {
            background-color: #ffffff;
            background-image: radial-gradient(at 0% 0%, rgba(255, 51, 102, 0.05) 0px, transparent 50%),
                              radial-gradient(at 100% 100%, rgba(212, 175, 55, 0.05) 0px, transparent 50%);
        }

        .glass-effect { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,0,0,0.03); }
        
        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }
        
        .profile-card { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid rgba(0,0,0,0.03); }
        .profile-card:hover { transform: translateY(-12px) scale(1.02); box-shadow: 0 40px 80px -15px rgba(255,51,102,0.15); border-color: rgba(255,51,102,0.1); }

        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
            content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
            transform: rotate(45deg); animation: shine 3s infinite;
        }
        @keyframes shine { 0% { left: -100%; } 100% { left: 100%; } }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
    </style>
</head>

<body class="mesh-bg flex flex-col min-h-screen pb-[90px] md:pb-0">

    <!-- Premium Navbar -->
    <header id="navbar" class="fixed top-0 w-full z-[100] transition-all duration-500 py-3">
        <div class="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
            <a href="/" class="z-10">
                <img src="/images/logo-sidelinechiangmai.webp" alt="Logo" class="h-6 md:h-8 brightness-0 opacity-90">
            </a>
            
            <div class="hidden md:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                <a href="/" class="hover:text-brand-pink transition-colors">Home</a>
                <a href="/profiles.html" class="text-brand-dark border-b-2 border-brand-pink pb-1">VIP Models</a>
                <a href="/locations.html" class="hover:text-brand-pink transition-colors">Locations</a>
            </div>

            <div class="flex items-center gap-4">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="hidden sm:inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-3.5 rounded-full text-[10px] font-black tracking-widest btn-shine shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-brand-pink hover:shadow-[0_10px_20px_rgba(255,51,102,0.3)] transition-all">
                    BOOK NOW <i class="fab fa-line text-sm"></i>
                </a>
                <button id="menu-btn" class="md:hidden w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full border border-gray-100 shadow-sm active:scale-95 transition-transform">
                    <i class="fas fa-bars-staggered text-sm text-brand-dark"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Fullscreen Mobile Menu -->
    <div id="mobile-menu" class="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[150] transform translate-y-[-100%] transition-transform duration-500 ease-in-out flex flex-col justify-center items-center gap-8 border-b-4 border-brand-pink">
        <a href="/" class="text-3xl font-black text-brand-dark hover:text-brand-pink tracking-tighter">HOME</a>
        <a href="/profiles.html" class="text-3xl font-black text-brand-pink tracking-tighter">VIP MODELS</a>
        <a href="/locations.html" class="text-3xl font-black text-brand-dark hover:text-brand-pink tracking-tighter">LOCATIONS</a>
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="mt-8 px-10 py-4 bg-brand-dark text-white rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-xl flex items-center gap-2">
            Contact Admin <i class="fab fa-line text-lg"></i>
        </a>
        <button id="close-menu" class="absolute top-8 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-brand-dark border border-gray-200">
            <i class="fas fa-times text-lg"></i>
        </button>
    </div>

    <main class="flex-1">
        
        <!-- S-TIER HERO SECTION -->
        <section class="pt-32 md:pt-40 pb-16 px-6">
            <div class="max-w-7xl mx-auto text-center">
                
                <div class="reveal active flex flex-wrap justify-center gap-3 mb-10">
                    <div class="flex items-center gap-2 px-4 py-1.5 bg-white border border-green-500/30 rounded-full shadow-sm text-green-600 text-[10px] md:text-xs font-bold">
                        <i class="fas fa-shield-check text-green-500"></i> เจอตัวจริง จ่ายหน้างาน 100%
                    </div>
                    <div class="flex items-center gap-2 px-4 py-1.5 bg-white border border-brand-pink/20 rounded-full shadow-sm text-brand-pink text-[10px] md:text-xs font-bold">
                        <i class="fas fa-ban"></i> ไม่มีการโอนมัดจำก่อน
                    </div>
                </div>

                <div class="reveal relative w-full max-w-5xl mx-auto mb-16 group active">
                    <div class="aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(255,51,102,0.15)] bg-gray-100 border-4 border-white">
                        <img src="${firstImage}" alt="ไซด์ไลน์${escapeHTML(provinceName)} บริการพรีเมียม" class="w-full h-full object-cover transform transition-transform duration-[3s] group-hover:scale-105" fetchpriority="high">
                        <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none"></div>
                    </div>
                    <div class="absolute -top-10 -left-10 w-40 h-40 bg-brand-pink/15 blur-[60px] rounded-full pointer-events-none"></div>
                    <div class="absolute -bottom-10 -right-10 w-60 h-60 bg-brand-gold/15 blur-[60px] rounded-full pointer-events-none"></div>
                </div>

                <div class="max-w-4xl mx-auto text-center reveal active">
                    <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest mb-8 border border-green-200 shadow-sm">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-heartbeat"></span>
                        ${safeProfiles.length} Profiles Online Now
                    </div>
                    
                    <h1 class="text-5xl sm:text-7xl md:text-[5.5rem] font-black text-brand-dark leading-[1.05] tracking-tighter mb-8">
                        ไซด์ไลน์<span class="text-brand-pink">${escapeHTML(provinceName)}</span><br>
                        เพื่อนเที่ยวระดับ VIP
                    </h1>
                    
                    <p class="text-gray-500 text-sm md:text-lg mb-12 font-light leading-relaxed max-w-2xl mx-auto px-4">
                        สัมผัสประสบการณ์พักผ่อนหา เพื่อนกินเที่ยวออกเดทดูหนังฟังเพลงแบบฟิวแฟน ที่จังหวัด${escapeHTML(provinceName)} กับน้องๆ บริการระดับ VIP คัดพิเศษ 
                        <span class="block mt-2 text-brand-dark font-medium underline underline-offset-4 decoration-brand-gold/50">การันตีโปรไฟล์ตรงปก ยืนยันตัวตนแล้วทุกรหัส</span>
                    </p>
                    
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
                        <a href="#profiles" class="w-full sm:w-auto px-12 py-4 md:py-5 bg-brand-dark text-white rounded-full font-black text-xs md:text-sm tracking-widest hover:bg-brand-pink transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] uppercase">
                            Explore Profiles
                        </a>
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="w-full sm:w-auto px-12 py-4 md:py-5 bg-white text-brand-dark border border-gray-200 rounded-full font-black text-xs md:text-sm hover:border-brand-pink hover:text-brand-pink transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-sm">
                            <i class="fab fa-line text-xl"></i> Line Admin
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Dynamic Filter -->
        <div class="sticky top-[64px] md:top-20 z-40 glass-effect py-4 overflow-x-auto no-scrollbar">
            <div class="max-w-7xl mx-auto px-6 flex items-center justify-center sm:justify-start md:justify-center gap-3 min-w-max">
                <button class="shrink-0 px-8 py-2.5 rounded-full bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest shadow-md">Recent</button>
                <button class="shrink-0 px-8 py-2.5 rounded-full bg-white border border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-brand-gold hover:border-brand-gold/30 transition-all shadow-sm">Hot VIP</button>
                <button class="shrink-0 px-8 py-2.5 rounded-full bg-white border border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-brand-pink hover:border-brand-pink/30 transition-all shadow-sm"><i class="fas fa-location-dot"></i> Near Me</button>
            </div>
        </div>

        <!-- Profiles Grid -->
        <section id="profiles" class="max-w-7xl mx-auto px-6 py-20 scroll-mt-32">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div class="reveal">
                    <h2 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-brand-dark">น้องๆรับงาน<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-purple-600">ไซด์ไลน์${escapeHTML(provinceName)}</span></h2>
                    <p class="text-brand-pink text-[10px] font-black uppercase tracking-[0.3em] mt-4">Verified Profiles (${CURRENT_MONTH} ${CURRENT_YEAR})</p>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest reveal">
                    <span class="w-2 h-2 rounded-full bg-brand-pink"></span> Showing ${safeProfiles.length} Results
                </div>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                ${cardsHTML}
            </div>
        </section>
        
        ${generateAppSeoText(provinceName, provinceKey, safeProfiles.length)}

    </main>

    <!-- Clean Premium Footer -->
    <footer class="bg-white py-24 text-center border-t border-gray-100 relative z-10">
        <div class="max-w-4xl mx-auto px-6">
            <img src="/images/logo-sidelinechiangmai.webp" alt="Logo" class="h-6 md:h-8 mx-auto brightness-0 mb-12 opacity-90">
            <h2 class="text-4xl md:text-6xl font-black text-brand-dark mb-10 tracking-tighter uppercase">
                THANK YOU <br> <span class="text-brand-pink">FOR CHOOSING US</span>
            </h2>
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="inline-flex items-center justify-center gap-3 bg-brand-dark text-white px-12 py-5 rounded-full font-black text-sm md:text-lg tracking-widest shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:scale-105 hover:bg-brand-pink transition-all btn-shine">
                <i class="fab fa-line text-2xl text-[#00C300]"></i> LINE ADMIN
            </a>
            
            <div class="mt-20 flex flex-wrap justify-center gap-x-6 gap-y-4">
                ${allProvinces.slice(0, 10).map(p => `<a href="/location/${p.key}" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-pink transition-colors">รับงาน${escapeHTML(p.nameThai)}</a>`).join("")}
            </div>

            <div class="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">© ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
                <div class="flex gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <a href="/privacy-policy.html" class="hover:text-brand-dark transition-colors">Privacy</a>
                    <a href="/terms.html" class="hover:text-brand-dark transition-colors">Terms</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Cinematic Mobile Navigation -->
    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] md:hidden w-[90%] max-w-[360px]">
        <div class="bg-black/90 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
            <a href="/" class="text-gray-400 hover:text-white transition-colors p-2"><i class="fas fa-house text-lg"></i></a>
            <a href="/profiles.html" class="text-brand-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.6)] p-2"><i class="fas fa-gem text-xl"></i></a>
            
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="w-16 h-16 bg-brand-pink text-white rounded-full flex items-center justify-center -mt-10 shadow-[0_0_30px_rgba(255,51,102,0.5)] border-[4px] border-[#0A0A0A] transform hover:scale-110 transition-transform btn-shine">
                <i class="fab fa-line text-3xl"></i>
            </a>
            
            <a href="/locations.html" class="text-gray-400 hover:text-white transition-colors p-2"><i class="fas fa-map-marker-alt text-lg"></i></a>
            <a href="/search" class="text-gray-400 hover:text-white transition-colors p-2"><i class="fas fa-magnifying-glass text-lg"></i></a>
        </div>
    </nav>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -30px 0px" };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target); 
                    }
                });
            }, observerOptions);
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

            const nav = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 10) {
                    nav.classList.add('glass-effect');
                    nav.classList.remove('py-3');
                } else {
                    nav.classList.remove('glass-effect');
                    nav.classList.add('py-3');
                }
            }, { passive: true });

            const menuBtn = document.getElementById('menu-btn');
            const closeMenuBtn = document.getElementById('close-menu');
            const mobileMenu = document.getElementById('mobile-menu');
            if(menuBtn && mobileMenu && closeMenuBtn) {
                menuBtn.addEventListener('click', () => {
                    mobileMenu.classList.remove('translate-y-[-100%]');
                    document.body.style.overflow = 'hidden';
                });
                closeMenuBtn.addEventListener('click', () => {
                    mobileMenu.classList.add('translate-y-[-100%]');
                    document.body.style.overflow = '';
                });
            }
        });
    </script>
</body>
</html>`;

        return new Response(htmlTemplate, { 
            headers: { 
                "Content-Type": "text/html; charset=utf-8", 
                "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=3600" 
            } 
        });

    } catch (error) {
        console.error("SSR Error:", error);
        return new Response('<div style="background:#000;color:#FF3366;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;"><div><h1>SYSTEM ERROR</h1><p>Contact Admin.</p></div></div>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
};