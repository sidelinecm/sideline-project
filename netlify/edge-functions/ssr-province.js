/**
 * [ SYSTEM CORE ]
 * Project: Nexus Entity Framework (S-Tier) - ULTIMATE NEO-LUXURY NOIR
 * Mastermind: wawai | Nexus Mastermind
 * Authority: Search Engine Dominance, Conversion UI/UX & Entity Engineering
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

const smartLinkify = (text, provinceKey, zones) => {
    if (!text) return "";
    let linkedText = text;
    if (zones && zones.length > 0) {
        zones.forEach(zone => {
            const regex = new RegExp(`(${zone})`, 'g');
            linkedText = linkedText.replace(regex, `<a href="/search?q=${encodeURIComponent(zone)}" class="text-[#FF416C]/80 hover:text-white transition-colors font-[500] border-b border-[#FF416C]/30" aria-label="ค้นหาน้องๆ โซน ${zone}">$1</a>`);
        });
    }

    const keywords = ["เด็กเอ็น", "ไซด์ไลน์", "พรีเมียม", "ฟีลแฟน", "รับงาน"];
    keywords.forEach(kw => {
        const regex = new RegExp(`(${kw})`, 'g');
        linkedText = linkedText.replace(regex, `<a href="/search?q=${encodeURIComponent(kw)}" class="text-brand-gold hover:text-white transition-colors font-[500] border-b border-brand-gold/30" aria-label="บริการ ${kw}">$1</a>`);
    });

    return linkedText;
};

// [ Component: Dynamic SEO Content ]
const generateAppSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA.default;
    
    const termsAndConditions = [
        { t: "ระบบจอง VIP", d: `เพื่อความเอ็กซ์คลูซีฟสูงสุด โซน${escapeHTML(provinceName)} เรารับจัดคิวแบบ Private จำกัดจำนวนลูกค้าต่อวัน เพื่อรักษามาตรฐานน้องๆ` },
        { t: "ปลอดภัย 100% ไร้มัดจำ", d: "ชำระเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น! หมดปัญหาการโดนหลอกโอนมัดจำ" },
        { t: "ตรวจสอบโปรไฟล์เข้มงวด", d: "รับประกันความตรงปก ไม่ตรงปกยกเลิกหน้างานได้ทันทีโดยไม่มีค่าใช้จ่ายใดๆ" },
        { t: "ข้อมูลลับระดับสูงสุด", d: "ประวัติการนัดหมายและการสนทนาจะถูกลบและเก็บเป็นความลับสุดยอด (Zero-Log Policy)" }
    ];

    const isDefaultZones = data.zones && data.zones.some(z => z.includes("ตัวเมือง") || z.includes("พื้นที่ใกล้เคียง"));

    const zonesHTML = (data.zones && data.zones.length > 0 && !isDefaultZones) ? `
        <div class="reveal text-center relative z-10 pt-12 pb-8">
            <h2 class="text-2xl md:text-3xl font-[500] mb-8 flex items-center justify-center gap-3 text-white tracking-wide">
                <i class="fa-light fa-map-pin text-[#FF8E53]"></i> โซนยอดฮิตใน${escapeHTML(provinceName)}
            </h2>
            <div class="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
                ${data.zones.map(zone => `
                    <a href="/search?q=${encodeURIComponent(zone)}" class="px-6 py-2.5 rounded-full glass-panel text-[13px] font-[400] text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300" aria-label="ดูน้องๆ โซน${escapeHTML(zone)}">${escapeHTML(zone)}</a>
                `).join("")}
            </div>
        </div>` : "";

const faqsHTML = (data.faqs && data.faqs.length > 0) ? `
        <div class="reveal max-w-3xl mx-auto space-y-4 pb-20 relative z-10 pt-16">
            <h2 class="text-2xl md:text-3xl font-[500] text-center mb-10 text-white tracking-wide">คำถามที่พบบ่อย (FAQ)</h2>
            ${data.faqs.map((faq, idx) => `
                <details class="group glass-panel rounded-2xl overflow-hidden transition-all duration-300" ${idx === 0 ? 'open' : ''}>
                    <summary class="flex justify-between items-center p-6 cursor-pointer list-none font-[500] text-white text-[15px] hover:bg-white/[0.02] transition-colors">
                        <span class="flex items-center gap-4 pr-6">
                            <span class="text-brand-pink text-lg"><i class="fa-light fa-message-question"></i></span>
                            ${escapeHTML(faq.q)}
                        </span>
                        <div class="w-8 h-8 shrink-0 rounded-full glass-panel flex items-center justify-center group-open:bg-brand-pink/20 group-open:text-brand-pink group-open:border-brand-pink/30 group-open:rotate-45 transition-all">
                            <i class="fa-light fa-plus text-sm"></i>
                        </div>
                    </summary>
                    <div class="px-6 pb-6 pt-2 ml-[3.25rem] text-white/65 text-[14px] font-[300] leading-[1.6] border-l-2 border-[#FF2E63]/20">
                        <p>${escapeHTML(faq.a)}</p>
                    </div>
                </details>
            `).join("")}
        </div>` : "";

    return `
        <section class="py-24 relative overflow-hidden">
            <div class="max-w-7xl mx-auto px-6 space-y-24 md:space-y-32">
                
                <!-- VIP & Terms Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <!-- Premium VIP Card -->
                    <div class="reveal glass-panel p-6 md:p-12 rounded-[24px] relative group overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-[#FF2E63]/10 via-transparent to-[#FF8E53]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        
                        <div class="relative z-10">
                            <div class="inline-flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full mb-6">
                                <i class="fa-light fa-crown text-brand-gold text-[10px]"></i>
                                <span class="text-[10px] font-[500] tracking-widest text-brand-gold uppercase">สิทธิพิเศษระดับ VIP</span>
                            </div>
                            
                            <h3 class="text-white text-3xl font-[500] mb-4 tracking-wide">รหัสลับ VIP</h3>
                            <p class="text-white/65 text-[14px] mb-8 font-[300] leading-[1.6]">แจ้งรหัสลับนี้กับแอดมิน เพื่ออัปเกรดสถานะเป็น <strong class="text-white font-[500]">Super VIP</strong> รับสิทธิ์เลือกล็อกคิวตัวท็อปก่อนใคร</p>
                            
                            <div class="glass-panel bg-black/20 rounded-[20px] py-8 px-4 text-center relative flex flex-col items-center justify-center overflow-hidden">
                                <div class="w-full overflow-x-auto no-scrollbar flex justify-center pb-2">
                                    <div class="text-4xl md:text-5xl font-[700] tracking-wider text-gradient-luxury select-all font-mono whitespace-nowrap">
                                        VIP-${provinceKey.toUpperCase()}
                                    </div>
                                </div>
                                <span class="inline-block glass-panel text-white/80 px-4 py-1.5 rounded-full text-[9px] font-[500] uppercase tracking-widest mt-4 shrink-0">
                                    ใช้ได้วันนี้เท่านั้น
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Terms List -->
                    <div class="reveal space-y-8">
                        <h3 class="text-2xl md:text-3xl font-[500] tracking-wide flex items-center gap-4 text-white">
                            <i class="fa-light fa-shield-check text-gradient-luxury"></i> มาตรฐานบริการ
                        </h3>
                        <div class="space-y-4">
                            ${termsAndConditions.map((item, idx) => `
                                <div class="flex gap-5 items-start p-5 rounded-[20px] glass-panel hover:bg-white/[0.05] transition-all duration-300 group">
                                    <div class="w-12 h-12 shrink-0 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-lg font-[700] text-white/30 group-hover:text-brand-pink group-hover:border-brand-pink/30 transition-all">0${idx + 1}</div>
                                    <div class="pt-1">
                                        <h4 class="text-[16px] font-[500] mb-1.5 text-white group-hover:text-brand-gold transition-colors">${item.t}</h4>
                                        <p class="text-white/65 text-[13px] font-[300] leading-[1.6]">${item.d}</p>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>

                ${zonesHTML}

                <!-- SEO Content Block (Smart Linkified) -->
                <div class="reveal relative">
                    <div class="glass-panel rounded-[32px] p-8 md:p-20 text-center relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div class="max-w-4xl mx-auto space-y-10 relative z-10">
                            <div class="w-20 h-20 bg-black/40 border border-white/5 text-[#FF416C] rounded-full flex items-center justify-center text-3xl mx-auto shadow-[0_10px_30px_rgba(255,65,108,0.2)]">
                                <i class="fa-light fa-crown"></i>
                            </div>
                            <h2 class="text-3xl md:text-5xl font-[500] tracking-wide leading-tight text-white">
                                ที่สุดของบริการเพื่อนเที่ยว<br>
                                <span class="text-[#FF416C] font-[700]">ไซด์ไลน์${escapeHTML(provinceName)}</span>
                            </h2>
                            <div class="text-white/65 text-[14px] md:text-[16px] font-[300] leading-[1.8] space-y-6 text-left md:text-center px-2">
                                ${smartLinkify(data.uniqueIntro, provinceKey, data.zones)}
                            </div>
                        </div>
                    </div>
                </div>

                ${faqsHTML}

            </div>
            
            <div class="w-1/2 mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mt-24"></div>
        </section>`;
};

export default async (request, context) => {
    try {
        const url = new URL(request.url);
        
        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province");
            return Response.redirect(new URL(`/location/${provinceValue}`, url.origin).toString(), 301);
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
        if (!provinceData) return context.next();

        const safeProfiles = profilesRes.data ||[];
        const allProvinces = allProvincesRes.data ||[];
        const provinceName = provinceData.nameThai;
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA.default;
        
        const now = new Date();
        const CURRENT_MONTH = now.toLocaleString("th-TH", { month: "short" });
        const CURRENT_YEAR = now.getFullYear();
        const ISO_DATE = now.toISOString();

        const isChiangmai = (provinceKey === 'chiangmai');
        const provinceUrl = isChiangmai ? CONFIG.DOMAIN : `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) : `${CONFIG.DOMAIN}/images/hero-sidelinechiangmai-1200.webp`;

        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} พรีเมียม (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ปลอดภัย 100%`;
        const description = `ตัวท็อป! ไซด์ไลน์${provinceName} รับงานเอนเตอร์เทน เพื่อนเที่ยวระดับ VIP ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก ✓จ่ายเงินหน้างาน ไม่โอนมัดจำ ปลอดภัยที่สุด`;

const schemaGraph = [
    { 
        "@type": "Organization", 
        "@id": `${CONFIG.DOMAIN}/#organization`, 
        name: CONFIG.BRAND_NAME, 
        url: CONFIG.DOMAIN, 
        logo: { "@type": "ImageObject", url: `${CONFIG.DOMAIN}/logo.png` }, 
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
        "@type": "CollectionPage", 
        "@id": `${provinceUrl}/#webpage`, 
        url: provinceUrl, 
        name: title, 
        description: description, 
        dateModified: ISO_DATE,
        primaryImageOfPage: { "@type": "ImageObject", url: firstImage },
        isPartOf: { "@id": `${CONFIG.DOMAIN}/#website` }, 
        breadcrumb: { "@id": `${provinceUrl}/#breadcrumb` },
        about: { "@id": `${provinceUrl}/#service` },
        speakable: { "@type": "SpeakableSpecification", xpath: ["/html/head/title", "/html/head/meta[@name='description']/@content"] }
    },
    { 
        "@type": "BreadcrumbList", 
        "@id": `${provinceUrl}/#breadcrumb`, 
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "หน้าแรก", item: CONFIG.DOMAIN }, 
            { "@type": "ListItem", position: 2, name: `รับงาน${provinceName}`, item: provinceUrl }
        ] 
    },
    { 
        "@type": "Service", 
        "@id": `${provinceUrl}/#service`, 
        name: `บริการไซด์ไลน์และเด็กเอ็น VIP ในพื้นที่ ${provinceName}`, 
        serviceType: "Escort and Entertainment Service", // เพิ่มเพื่อให้บอทเข้าใจหมวดหมู่บริการที่ชัดเจนระดับสากล
        provider: { "@id": `${CONFIG.DOMAIN}/#organization` }, 
        areaServed: { "@type": "AdministrativeArea", name: provinceName }, 
        description: description,
        category: "Entertainment",
        hasOfferCatalog: { "@id": `${provinceUrl}/#catalog` }
    }
];

if (seoData.faqs) {
    schemaGraph.push({ 
        "@type": "FAQPage", 
        "@id": `${provinceUrl}/#faq`, 
        mainEntity: seoData.faqs.map(faq => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) 
    });
}

if (safeProfiles.length > 0) {
    schemaGraph.push({ 
        "@type": "OfferCatalog", 
        "@id": `${provinceUrl}/#catalog`,
        name: `แคตตาล็อกน้องๆ รับงานไซด์ไลน์ ${provinceName}`, 
        description: `รายชื่อโปรไฟล์ ${safeProfiles.length} คนล่าสุดในพื้นที่ ${provinceName} อัปเดต ${CURRENT_MONTH} ${CURRENT_YEAR}`, 
        itemListElement: safeProfiles.slice(0, 12).map((p, i) => {
            // ปรับปรุงการสกัดตัวเลขให้ปลอดภัยระดับ Production-grade
            let numericPrice = p.rate ? String(p.rate).replace(/\D/g, '') : "1500";
            if (!numericPrice || numericPrice.length === 0) numericPrice = "1500"; 
            
            return { 
                "@type": "ListItem", 
                position: i + 1, 
                item: { 
                    "@type": "Person", 
                    name: p.name || "ไม่ระบุชื่อ", 
                    url: `${CONFIG.DOMAIN}/sideline/${p.slug || p.id}`, 
                    image: optimizeImg(p.imagePath, 300, 400), 
                    description: `โปรไฟล์น้อง${p.name || ""} รับงานโซน ${p.location || provinceName}`,
                    offers: {
                        "@type": "Offer",
                        price: numericPrice,
                        priceCurrency: "THB",
                        availability: "https://schema.org/InStock",
                        validFrom: ISO_DATE // ประกาศความสดใหม่ของราคาให้บอทรู้ว่าอัปเดตตลอดเวลา
                    }
                } 
            };
        }) 
    });
}

const schemaData = { "@context": "https://schema.org", "@graph": schemaGraph };

        // [ CORE SELLING POINT ]: Supercharged Profile Cards
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

            const hotBadge = (p.isfeatured || index < 3) ? `
                <div class="absolute top-0 right-0 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#0A0A0A] text-[9px] font-[700] px-3 py-1.5 rounded-bl-[16px] rounded-tr-[20px] shadow-[0_5px_15px_rgba(191,149,63,0.4)] z-20 tracking-wider uppercase flex items-center gap-1.5">
                    <i class="fa-solid fa-crown text-[8px]"></i> HOT
                </div>` : '';

            return `
            <article class="reveal group relative rounded-[20px] overflow-hidden glass-panel hover:bg-white/[0.05] transition-colors duration-500" style="transition-delay: ${animDelay}ms; content-visibility: auto;" aria-label="ดูโปรไฟล์น้อง${cleanName}">
                
                <div class="relative h-full flex flex-col z-10">
                    <a href="${profileLink}" class="absolute inset-0 z-30 focus:outline-none rounded-[20px]" aria-label="จองน้อง${cleanName}">
                        <span class="sr-only">ดูรายละเอียดของน้อง${cleanName} ${lsiKeyword}</span>
                    </a>
                    
                    ${hotBadge}
                    
                    <!-- Profile Image Container -->
                    <div class="relative aspect-[3/4] overflow-hidden rounded-t-[20px] border-b border-white/[0.06]">
                        <img src="${optimizeImg(p.imagePath, 500, 667)}" 
                             srcset="${optimizeImg(p.imagePath, 300, 400)} 300w, ${optimizeImg(p.imagePath, 500, 667)} 500w"
                             sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                             onerror="this.onerror=null; this.src='/images/default.webp';"
                             alt="${smartAlt}" 
                             class="w-full h-full object-cover transform transition-transform duration-[1s] ease-out group-hover:scale-105" ${imageAttributes} />
                             
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 transition-opacity duration-500"></div>
                        
                        <!-- Info Block Bottom (Over Image) -->
                        <div class="absolute bottom-0 left-0 w-full px-4 pb-4 pt-8 text-white z-10 pointer-events-none flex flex-col justify-end">
                            <h3 class="text-[18px] font-[500] leading-tight tracking-wide flex items-center gap-2 mb-1">
                                ${cleanName} <span class="text-[11px] font-[300] text-white/70 bg-white/10 px-1.5 py-0.5 rounded">${p.age || '??'}</span>
                            </h3>
                            <p class="text-[11px] font-[300] text-white/80 flex items-center gap-1.5 truncate max-w-full">
                                <i class="fa-light fa-location-dot text-brand-gold"></i>
                                ${profileLocation}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Bottom Interaction Footer -->
                    <div class="p-4 flex justify-between items-center bg-transparent relative z-40 pointer-events-none">
                        <div>
                            <span class="block text-[9px] text-white/40 uppercase tracking-widest mb-0.5 font-[300]">เรทราคา</span>
                            <span class="text-[15px] font-[500] text-white tracking-wide">${displayRate} ${displayRate !== "สอบถาม" ? "<span class='text-brand-pink/80'>฿</span>" : ""}</span>
                        </div>
                        <div class="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-white group-hover:bg-brand-pink group-hover:border-brand-pink group-hover:shadow-[0_0_15px_rgba(255,46,99,0.4)] transition-all duration-300">
                            <i class="fa-light fa-arrow-right text-[13px] transform group-hover:translate-x-0.5 transition-transform"></i>
                        </div>
                    </div>
                </div>
            </article>`;
        }).join("");

        const htmlTemplate = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <script>
        (function() {
            var auth = ['sidelinechiangmai.netlify.app', 'localhost', '127.0.0.1'];
            if (!auth.includes(window.location.hostname)) {
                document.documentElement.innerHTML = '<div style="background:#07070A;color:#FF2E63;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;"><h1>403 FORBIDDEN</h1></div>';
                setTimeout(function() { window.location.replace("https://sidelinechiangmai.netlify.app/?ref=stolen_by_" + btoa(window.location.hostname)); }, 1500);
            }
        })();
    </script>
    <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /><meta name="theme-color" content="#07070A" /><meta name="apple-mobile-web-app-capable" content="yes" />
    <title>${title}</title><meta name="description" content="${description}" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link rel="dns-prefetch" href="https://zxetzqwjaiumqhrpumln.supabase.co" />
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700;800&display=swap" as="style" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700;800&display=swap" media="print" onload="this.media='all'" />
    <link rel="preload" as="image" href="/images/hero-sidelinechiangmai-1200.webp" imagesrcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w" sizes="(max-width: 640px) 100vw, 100vw" fetchpriority="high" />
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { 
            theme: { 
                extend: { 
                    colors: { 
                        brand: { 
                            pink: '#FF2E63', 
                            gold: '#FF8E53', 
                            crimson: '#FF416C',
                            dark: '#07070A',
                            darker: '#111116'
                        } 
                    },
                    fontFamily: { sans:['Prompt', 'sans-serif'] }
                } 
            } 
        }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    
    <style>
        body { 
            background: linear-gradient(135deg, #07070A 0%, #111116 100%); 
            background-attachment: fixed;
            color: #FFFFFF; 
            -webkit-font-smoothing: antialiased; 
            min-height: 100vh;
        }
        
        .glass-panel {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .text-gradient-luxury {
            background: linear-gradient(to right, #FF2E63, #FF8E53, #FF416C);
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
    </style>
</head>

<body class="flex flex-col pb-[100px] md:pb-0 selection:bg-brand-pink selection:text-white">

    <!-- Premium Header Dock -->
    <header id="navbar" class="fixed top-0 w-full z-[100] transition-all duration-500 py-3">
        <div class="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between">
            <a href="/" class="z-10 focus:outline-none focus:ring-2 focus:ring-brand-pink rounded-lg flex items-center gap-2" aria-label="กลับสู่หน้าแรก">
                <!-- Hyper-sharp text logo overriding blurry image -->
                <span class="text-[18px] md:text-[22px] font-[700] tracking-wide text-white uppercase" style="text-shadow: 0 4px 12px rgba(255, 46, 99, 0.2);">
                    SIDELINE <span class="text-[#FF416C]">CHIANGMAI</span>
                </span>
            </a>
            
            <nav class="hidden md:flex items-center gap-10 text-[12px] font-[500] tracking-widest text-white/50 uppercase" aria-label="เมนูนำทางหลัก">
                <a href="/" class="hover:text-white transition-all">หน้าแรก</a>
                <a href="/profiles.html" class="text-white border-b border-brand-pink pb-1" aria-current="page">โปรไฟล์น้องๆ</a>
                <a href="/locations.html" class="hover:text-white transition-all">พื้นที่รับงาน</a>
            </nav>

            <div class="flex items-center gap-3">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-2 glass-panel text-white px-6 py-2.5 rounded-full text-[11px] font-[500] tracking-widest hover:bg-white/10 transition-all" aria-label="ติดต่อแอดมินทางไลน์">
                    <i class="fa-brands fa-line text-[#00E676] text-sm" aria-hidden="true"></i> จองคิวตอนนี้
                </a>
                <button id="menu-btn" aria-label="เปิดเมนูบนมือถือ" class="md:hidden w-10 h-10 flex items-center justify-center glass-panel rounded-full active:scale-95 transition-transform text-white">
                    <i class="fa-light fa-bars-staggered text-[15px]" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Fullscreen Mobile Menu (Kept minimal and consistent) -->
    <div id="mobile-menu" class="fixed inset-0 bg-[#07070A]/95 backdrop-blur-[40px] z-[150] transform translate-y-[-100%] transition-transform duration-500 ease-in-out flex flex-col justify-center items-center gap-8" aria-hidden="true">
        <nav class="flex flex-col items-center gap-8" aria-label="เมนูบนมือถือ">
            <a href="/" class="text-2xl font-[500] text-white/50 hover:text-white tracking-widest transition-colors">หน้าแรก</a>
            <a href="/profiles.html" class="text-3xl font-[700] text-gradient-luxury tracking-widest">โปรไฟล์น้องๆ</a>
            <a href="/locations.html" class="text-2xl font-[500] text-white/50 hover:text-white tracking-widest transition-colors">พื้นที่รับงาน</a>
        </nav>
        <button id="close-menu" aria-label="ปิดเมนู" class="absolute top-8 right-6 w-12 h-12 flex items-center justify-center rounded-full glass-panel text-white transition-colors">
            <i class="fa-light fa-xmark text-xl" aria-hidden="true"></i>
        </button>
    </div>

    <main class="flex-1">
        
        <!-- High-Conversion Hero Section -->
        <section class="pt-32 md:pt-40 pb-16 px-6 relative">
            <div class="max-w-7xl mx-auto text-center relative z-10">
                
                <!-- Editorial Trust Badges -->
                <div class="reveal active flex flex-wrap justify-center gap-3 mb-10 relative z-20">
                    <div class="flex items-center gap-2 px-5 py-2 glass-panel border-[#00E676]/20 rounded-full text-[#00E676]/80 text-[11px] md:text-[12px] font-[500]">
                        <i class="fa-light fa-shield-check"></i> เจอตัวจริง จ่ายหน้างาน 100%
                    </div>
                    <div class="flex items-center gap-2 px-5 py-2 glass-panel border-[#FF416C]/30 rounded-full text-[#FF416C]/80 text-[11px] md:text-[12px] font-[500]">
                        <i class="fa-light fa-ban"></i> ไม่มีการโอนมัดจำก่อน
                    </div>
                </div>

                <!-- Premium Banner Display -->
                <div class="reveal relative w-full max-w-5xl mx-auto mb-16 group active">
                    <div class="aspect-[16/9] md:aspect-[21/9] rounded-[24px] overflow-hidden glass-panel relative shadow-[0_0_40px_rgba(255,46,99,0.15)]">
                        <img src="/images/hero-sidelinechiangmai-1200.webp" srcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w" sizes="(max-width: 640px) 100vw, 100vw" alt="รวมน้องๆ ไซด์ไลน์${escapeHTML(provinceName)} รับงาน${escapeHTML(provinceName)} ระดับ VIP" class="w-full h-full object-cover transform transition-transform duration-[4s] group-hover:scale-[1.03] opacity-80" fetchpriority="high">
                        <div class="absolute inset-0 bg-gradient-to-t from-[#07070A] via-transparent to-transparent pointer-events-none"></div>
                        <!-- Subtle reflection overlay -->
                        <div class="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none"></div>
                    </div>
                </div>

                <div class="max-w-4xl mx-auto text-center reveal active relative z-10">
                    
                    <!-- Title Hierarchy -->
                    <p class="text-white/65 text-[12px] md:text-[14px] font-[300] mb-3 tracking-widest uppercase">ค้นหาน้องๆ ในพื้นที่ของคุณ</p>
                    <h1 class="text-[3.2rem] md:text-[4.5rem] font-[800] text-gradient-luxury leading-[1.1] tracking-tight mb-8 drop-shadow-[0_10px_30px_rgba(255,46,99,0.2)]">
                        ${escapeHTML(provinceName)}
                    </h1>
                    
                    <!-- Advanced Search Console -->
                    <div class="max-w-xl mx-auto mt-4 mb-10 relative z-20 px-2">
                        <form action="/search" method="GET" class="relative group">
                            <label for="search-input" class="sr-only">ค้นหาน้องๆ โซน จังหวัด หรือชื่อ</label>
                            <div class="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <i class="fa-light fa-magnifying-glass text-white/40" aria-hidden="true"></i>
                            </div>
                            <!-- Glass Input -->
                            <input type="text" id="search-input" name="q" placeholder="พิมพ์ โซน, จังหวัด, หรือชื่อน้อง..." required
                                class="w-full glass-panel bg-transparent text-white rounded-full py-4 pl-14 pr-32 focus:outline-none focus:border-[#FF2E63]/50 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all font-[300] placeholder:text-white/40 text-[14px]">
                            <!-- Gradient Capsule Button -->
                            <button type="submit" class="absolute inset-y-1.5 right-1.5 bg-gradient-to-r from-[#FF2E63] to-[#FF416C] text-white px-6 rounded-full font-[500] text-[11px] uppercase tracking-widest hover:opacity-90 transition-all btn-shimmer" aria-label="ปุ่มค้นหา">
                                ค้นหา
                            </button>
                        </form>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
                        <!-- Liquid Pearl Capsule CTA -->
                        <a href="#profiles" class="w-full sm:w-auto px-10 py-4 bg-white/95 text-[#07070A] rounded-full font-[500] text-[13px] tracking-widest hover:bg-white transition-all shadow-[0_12px_30px_rgba(255,255,255,0.15)] uppercase text-center" aria-label="เลื่อนลงไปดูโปรไฟล์">
                            เลือกดูโปรไฟล์
                        </a>
                        <!-- Dark-Glass Capsule CTA -->
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-10 py-4 glass-panel text-white rounded-full font-[500] text-[13px] hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-center" aria-label="แอดไลน์ติดต่อแอดมิน">
                            <i class="fa-brands fa-line text-lg text-[#00E676]" aria-hidden="true"></i> ติดต่อแอดมิน
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Global Navigation Pills Dock -->
        <div class="sticky top-[56px] md:top-[64px] z-40 py-4 overflow-x-auto no-scrollbar glass-panel border-x-0 border-t-0 shadow-none">
            <nav class="max-w-7xl mx-auto px-6 flex items-center justify-center sm:justify-start md:justify-center gap-3 min-w-max" aria-label="หมวดหมู่โปรไฟล์">
                <button aria-pressed="true" class="shrink-0 px-6 py-2.5 rounded-full bg-white/10 text-white text-[12px] font-[500] tracking-wider shadow-[0_4px_20px_rgba(255,255,255,0.1)] transition-all">น้องๆ ทั้งหมด</button>
                <button aria-pressed="false" class="shrink-0 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 text-[12px] font-[400] tracking-wider hover:text-white transition-all">มาแรง & ยอดฮิต</button>
                <button aria-pressed="false" class="shrink-0 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 text-[12px] font-[400] tracking-wider flex items-center gap-2 hover:text-white transition-all"><i class="fa-light fa-location-crosshairs" aria-hidden="true"></i> ใกล้ฉัน</button>
            </nav>
        </div>

        <!-- The Ultimate User Profile Grid -->
        <section id="profiles" class="max-w-[1440px] mx-auto px-4 py-20 scroll-mt-32">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 px-2">
                <div class="reveal">
                    <h2 class="text-3xl md:text-4xl font-[500] tracking-wide text-white">รวมโปรไฟล์ <span class="text-gradient-luxury font-[700]">ระดับพรีเมียม</span></h2>
                    <p class="text-white/40 text-[12px] font-[300] uppercase tracking-widest mt-2 flex items-center gap-2">
                        <i class="fa-light fa-circle-check" aria-hidden="true"></i> ตรวจสอบแล้ว (${CURRENT_MONTH} ${CURRENT_YEAR})
                    </p>
                </div>
                
                <!-- Status Indicator -->
                <div class="flex items-center gap-2.5 px-5 py-2.5 bg-[#00E676]/[0.05] border border-[#00E676]/20 rounded-full text-[11px] font-[500] text-[#00E676]/90 uppercase tracking-widest reveal">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]"></span>
                    </span>
                    ${safeProfiles.length} โพสต์พร้อมให้บริการ
                </div>
            </div>
            
            <!-- Strict Grid with 16px gap -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                ${cardsHTML}
            </div>
        </section>
        
        ${generateAppSeoText(provinceName, provinceKey, safeProfiles.length)}

    </main>

    <!-- Clean Premium Footer Grid -->
    <footer class="bg-[#07070A] py-20 text-center border-t border-white/5 relative z-10">
        <div class="max-w-4xl mx-auto px-6 relative z-10">
            <div class="text-[20px] font-[700] tracking-widest text-white mb-8" style="text-shadow: 0 4px 12px rgba(255, 46, 99, 0.2);">SIDELINE <span class="text-[#FF416C]">CHIANGMAI</span></div>
            
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-3 glass-panel text-white px-10 py-4 rounded-full font-[500] text-[13px] tracking-widest hover:bg-white/[0.05] transition-all btn-shimmer" aria-label="จองคิวผ่านไลน์">
                <i class="fa-brands fa-line text-xl text-[#00E676]" aria-hidden="true"></i> จองน้องๆ ตอนนี้
            </a>
            
            <div class="mt-20 mb-8 reveal">
                <h3 class="text-[14px] font-[500] text-white/50 tracking-widest uppercase">พื้นที่รับงานจังหวัดอื่นๆ</h3>
            </div>
            
            <!-- Multi-column Grid Links -->
            <nav class="grid grid-cols-2 md:grid-cols-4 gap-4 reveal max-w-2xl mx-auto" aria-label="ลิงก์ไปยังพื้นที่รับงานอื่นๆ">
                ${allProvinces.slice(0, 8).map(p => `<a href="/location/${p.key}" class="text-[12px] font-[300] text-white/50 hover:text-white transition-all py-2 border border-transparent hover:border-white/10 rounded-lg glass-panel">รับงาน${escapeHTML(p.nameThai)}</a>`).join("")}
            </nav>

            <div class="mt-20 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
                <p class="text-[10px] font-[300] text-white/30 uppercase tracking-widest">© ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
                <div class="flex gap-6 text-[10px] font-[300] text-white/30 uppercase tracking-widest">
                    <a href="/privacy-policy.html" class="hover:text-white transition-colors">PRIVACY</a>
                    <a href="/terms.html" class="hover:text-white transition-colors">TERMS</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Floating Dock Navigator -->
    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] md:hidden w-[85%] max-w-[340px]" aria-label="เมนูลัดบนมือถือ">
        <div class="glass-panel px-8 py-3 rounded-[30px] flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <a href="/" aria-label="กลับสู่หน้าแรก" class="text-white opacity-35 hover:opacity-100 transition-opacity p-2 active:scale-95"><i class="fa-light fa-house text-lg" aria-hidden="true"></i></a>
            <a href="/profiles.html" aria-label="ดูโปรไฟล์ระดับ VIP" class="text-white opacity-35 hover:opacity-100 transition-opacity p-2 active:scale-95"><i class="fa-light fa-gem text-xl" aria-hidden="true"></i></a>
            
            <!-- Center Command Button -->
            <div class="relative flex flex-col items-center">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="ติดต่อแอดมินผ่านไลน์" class="relative w-14 h-14 bg-gradient-to-br from-[#FF2E63] to-[#FF416C] text-white rounded-full flex items-center justify-center -mt-8 shadow-[0_0_25px_rgba(255,46,99,0.5)] transform active:scale-95 transition-all btn-shimmer z-50">
                    <i class="fa-brands fa-line text-2xl" aria-hidden="true"></i>
                </a>
                <!-- Glowing Indicator Dot -->
                <div class="w-1 h-1 rounded-full bg-[#FF2E63] absolute -bottom-3 shadow-[0_0_8px_#FF2E63]"></div>
            </div>
            
            <a href="/locations.html" aria-label="ดูพื้นที่รับงาน" class="text-white opacity-35 hover:opacity-100 transition-opacity p-2 active:scale-95"><i class="fa-light fa-map-pin text-lg" aria-hidden="true"></i></a>
            <a href="/search" aria-label="ค้นหาน้องๆ" class="text-white opacity-35 hover:opacity-100 transition-opacity p-2 active:scale-95"><i class="fa-light fa-magnifying-glass text-lg" aria-hidden="true"></i></a>
        </div>
    </nav>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
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

            const menuBtn = document.getElementById('menu-btn');
            const closeMenuBtn = document.getElementById('close-menu');
            const mobileMenu = document.getElementById('mobile-menu');
            if(menuBtn && mobileMenu && closeMenuBtn) {
                menuBtn.addEventListener('click', () => {
                    mobileMenu.classList.remove('translate-y-[-100%]');
                    mobileMenu.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                });
                closeMenuBtn.addEventListener('click', () => {
                    mobileMenu.classList.add('translate-y-[-100%]');
                    mobileMenu.setAttribute('aria-hidden', 'true');
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
        return new Response('<div style="background:#07070A;color:#FF2E63;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;"><div><h1 style="font-size:3rem;margin-bottom:10px;">SYSTEM ERROR</h1><p style="color:#888;">Please contact system administrator.</p></div></div>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
};