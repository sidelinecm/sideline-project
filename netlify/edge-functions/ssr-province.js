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
        traits: ["ผิวออร่าสว่าง", "หน้าหมวยน่ารัก", "ตัวเล็กสเปคป๋า", "หุ่นนางแบบ", "พูดเหนืออ้อนๆ", "สัดส่วนเป๊ะ", "เอาใจเก่ง"],
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
        traits: ["ลุคคุณหนู", "อินเตอร์สายฝอ", "ใบหน้าเป๊ะ", "หุ่นนางแบบ", "ดูแลฟิวแฟน", "ลุคออฟฟิศ"],
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
        traits: ["สาวเหนือหน้าหวาน", "เป็นกันเอง", "เอาใจเก่งมาก", "ผิวขาวออร่า", "หุ่นสัดส่วนดี", "คุยสนุก"],
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
    chonburi: {
        name: "ชลบุรี",
        geo: { lat: 12.9236, lng: 100.8825 },
        zones: ["พัทยา", "บางแสน", "ศรีราชา", "อมตะนคร", "ตัวเมืองชลบุรี", "ม.บูรพา"],
        lsi: ["รับงานชลบุรี", "ไซด์ไลน์ชลบุรี", "สาวไซด์ไลน์พัทยา", "sideline ชลบุรี", "เพื่อนเที่ยวบางแสน", "เด็กเอ็นพัทยา"],
        intents: ["ปาร์ตี้ริมหาด", "พูลวิลล่าพัทยา", "ดูแลฟิวแฟนท่องเที่ยว", "N-Vip ชลบุรี"],
        traits: ["ผิวแทนเซ็กซี่", "หุ่นนางแบบ", "อินเตอร์ลุค", "สายปาร์ตี้", "ไปไหนไปกัน", "เอาใจเก่ง"],
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
    default: {
        name: "จังหวัดอื่นๆ",
        geo: { lat: 13.7563, lng: 100.5018 },
        zones: ["ตัวเมือง", "พื้นที่ใกล้เคียง"],
        lsi: ["รับงานส่วนตัว", "สาวไซด์ไลน์", "sideline พรีเมียม", "เพื่อนเที่ยว", "เด็กเอ็น", "นักศึกษาพาร์ทไทม์", "สาวสวยตรงปก", "ดูแลฟิวแฟน"],
        intents: ["รับงานเอนเตอร์เทน", "ดูแลแบบเต็มวัน", "เพื่อนเที่ยว", "ฟิวแฟน"],
        traits: ["หน้าตาน่ารัก", "หุ่นสัดส่วนดี", "เอาใจเก่งมาก", "บริการประทับใจ", "ฟีลแฟน", "ตรงปก"],
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
            linkedText = linkedText.replace(regex, `<a href="/search?q=${encodeURIComponent(zone)}" class="text-brand-gold hover:text-white transition-colors font-medium underline underline-offset-4 decoration-brand-gold/30" aria-label="ค้นหาน้องๆ โซน ${zone}">$1</a>`);
        });
    }

    const keywords = ["เด็กเอ็น", "ไซด์ไลน์", "พรีเมียม", "ฟีลแฟน", "รับงาน"];
    keywords.forEach(kw => {
        const regex = new RegExp(`(${kw})`, 'g');
        linkedText = linkedText.replace(regex, `<a href="/search?q=${encodeURIComponent(kw)}" class="text-brand-pink hover:text-white transition-colors font-bold underline underline-offset-4 decoration-brand-pink/30" aria-label="บริการ ${kw}">$1</a>`);
    });

    return linkedText;
};

// [ Component: Dynamic SEO Footer Content ]
const generateAppSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA.default;
    
    const termsAndConditions = [
        { t: "ระบบจอง VIP", d: `เพื่อความเอ็กซ์คลูซีฟสูงสุด โซน${escapeHTML(provinceName)} เรารับจัดคิวแบบ Private จำกัดจำนวนลูกค้าต่อวัน เพื่อรักษามาตรฐานน้องๆ` },
        { t: "ปลอดภัย 100% ไร้มัดจำ", d: "ชำระเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น! หมดปัญหาการโดนหลอกโอนมัดจำ" },
        { t: "ตรวจสอบโปรไฟล์เข้มงวด", d: "รับประกันความตรงปก ไม่ตรงปกยกเลิกหน้างานได้ทันทีโดยไม่มีค่าใช้จ่ายใดๆ" },
        { t: "ข้อมูลลับระดับสูงสุด", d: "ประวัติการนัดหมายและการสนทนาจะถูกลบและเก็บเป็นความลับสุดยอด (Zero-Log Policy)" }
    ];

    const zonesHTML = (data.zones && data.zones.length > 0) ? `
        <div class="reveal text-center relative z-10 pt-8">
            <h2 class="text-2xl md:text-3xl font-black mb-8 flex items-center justify-center gap-3 text-white drop-shadow-lg">
                <i class="fas fa-map-location-dot text-brand-pink drop-shadow-[0_0_10px_rgba(255,51,102,0.5)]"></i> โซนยอดฮิตใน${escapeHTML(provinceName)}
            </h2>
            <div class="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
                ${data.zones.map(zone => `
                    <a href="/search?q=${encodeURIComponent(zone)}" class="px-6 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-sm font-semibold text-gray-300 hover:bg-brand-pink hover:text-white hover:border-brand-pink hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">${escapeHTML(zone)}</a>
                `).join("")}
            </div>
        </div>` : "";

    const faqsHTML = (data.faqs && data.faqs.length > 0) ? `
        <div class="reveal max-w-3xl mx-auto space-y-6 pb-20 relative z-10 pt-10" itemscope itemtype="https://schema.org/FAQPage">
            <h2 class="text-3xl md:text-4xl font-black text-center mb-12 text-white drop-shadow-lg tracking-tighter">คำถามที่พบบ่อย (FAQ)</h2>
            ${data.faqs.map((faq, idx) => `
                <details class="group bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl" ${idx === 0 ? 'open' : ''} itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <summary class="flex justify-between items-center p-6 md:p-8 cursor-pointer list-none font-bold text-white text-lg hover:bg-white/5 transition-colors">
                        <span class="flex items-center gap-4 pr-6" itemprop="name">
                            <span class="text-brand-pink text-xl drop-shadow-[0_0_10px_rgba(255,51,102,0.4)]"><i class="fas fa-comment-dots"></i></span>
                            ${escapeHTML(faq.q)}
                        </span>
                        <div class="w-8 h-8 shrink-0 rounded-full bg-white/5 flex items-center justify-center group-open:bg-brand-pink group-open:text-white group-open:rotate-45 transition-all border border-white/10">
                            <i class="fas fa-plus text-xs"></i>
                        </div>
                    </summary>
                    <div class="px-6 md:px-8 pb-8 pt-2 ml-[3.25rem] text-gray-400 text-sm md:text-base font-light leading-relaxed border-l-2 border-brand-pink/30" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <span itemprop="text">${escapeHTML(faq.a)}</span>
                    </div>
                </details>
            `).join("")}
        </div>` : "";

    return `
        <section class="py-24 bg-[#050505] text-white relative overflow-hidden border-y border-white/5">
            <!-- Cinematic Background Gradients -->
            <div class="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#111] to-transparent pointer-events-none"></div>
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,51,102,0.06),transparent_50%)] pointer-events-none mix-blend-screen"></div>
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.04),transparent_50%)] pointer-events-none mix-blend-screen"></div>
            
            <div class="max-w-7xl mx-auto px-6 space-y-32">
                
                <!-- VIP & Terms Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <!-- Premium VIP Card -->
                    <div class="reveal bg-[#0A0A0A] p-1 md:p-1.5 rounded-[3rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] relative group">
                        <div class="absolute -inset-[1px] bg-gradient-to-br from-brand-pink via-purple-600 to-brand-gold rounded-[3rem] opacity-30 group-hover:opacity-100 transition-opacity duration-700 blur-[2px] -z-10"></div>
                        <div class="bg-[#050505] rounded-[2.8rem] p-10 md:p-14 h-full relative overflow-hidden">
                            <div class="absolute -top-20 -right-20 w-60 h-60 bg-brand-gold/10 blur-[80px] rounded-full transition-transform group-hover:scale-150 duration-700"></div>
                            
                            <div class="inline-flex items-center gap-3 px-4 py-1.5 bg-brand-gold/10 rounded-full border border-brand-gold/20 mb-8">
                                <span class="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse shadow-[0_0_10px_#D4AF37]"></span>
                                <span class="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-brand-gold">Exclusive Privilege</span>
                            </div>
                            
                            <h3 class="text-white text-3xl font-black mb-4 tracking-tighter drop-shadow-md">SECRET CODE</h3>
                            <p class="text-gray-400 text-sm md:text-base mb-10 font-light leading-relaxed">แจ้งรหัสลับนี้กับแอดมิน เพื่ออัปเกรดสถานะเป็น <strong>Super VIP</strong> รับสิทธิ์เลือกล็อกคิวตัวท็อปก่อนใคร</p>
                            
                            <div class="bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center relative shadow-inner group-hover:border-brand-gold/50 transition-colors">
                                <div class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF380] to-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] select-all font-mono">
                                    VIP-${provinceKey.toUpperCase()}
                                </div>
                                <span class="inline-block bg-gradient-to-r from-brand-pink to-purple-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,51,102,0.4)]">
                                    Valid Today
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Terms List -->
                    <div class="reveal space-y-10">
                        <h3 class="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-4 drop-shadow-lg text-white">
                            <i class="fas fa-shield-halved text-brand-pink drop-shadow-[0_0_15px_rgba(255,51,102,0.4)]"></i> มาตรฐานบริการ
                        </h3>
                        <div class="space-y-4">
                            ${termsAndConditions.map((item, idx) => `
                                <div class="flex gap-6 items-start p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20 group">
                                    <div class="w-14 h-14 shrink-0 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-xl font-black text-gray-500 group-hover:text-brand-pink group-hover:border-brand-pink/50 group-hover:shadow-[0_0_20px_rgba(255,51,102,0.3)] transition-all">0${idx + 1}</div>
                                    <div class="pt-1">
                                        <h4 class="text-lg font-bold mb-2 text-white group-hover:text-brand-pink transition-colors">${item.t}</h4>
                                        <p class="text-gray-400 text-sm font-light leading-relaxed">${item.d}</p>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>

                ${zonesHTML}

                <!-- SEO Content Block (Smart Linkified) -->
                <div class="reveal relative p-[1px] rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
                    <div class="bg-[#0A0A0A] rounded-[3rem] p-10 md:p-20 text-white text-center shadow-[0_30px_80px_rgba(0,0,0,0.9)] relative z-10">
                        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-50"></div>
                        
                        <div class="max-w-4xl mx-auto space-y-12 relative z-10">
                            <div class="w-24 h-24 bg-black text-brand-pink rounded-full flex items-center justify-center text-4xl mx-auto shadow-[0_10px_40px_rgba(255,51,102,0.3)] border border-white/10 transform hover:rotate-12 transition-transform duration-500">
                                <i class="fas fa-crown"></i>
                            </div>
                            <h2 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight drop-shadow-lg">
                                ที่สุดของบริการเพื่อนเที่ยว<br>
                                <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-purple-500 to-[#D4AF37] drop-shadow-[0_0_10px_rgba(255,51,102,0.3)]">ไซด์ไลน์${escapeHTML(provinceName)}</span>
                            </h2>
                            <div class="text-gray-300 text-sm md:text-lg font-light leading-loose space-y-8 text-left md:text-center px-4">
                                ${smartLinkify(data.uniqueIntro, provinceKey, data.zones)}
                            </div>
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

        // [ EXTREME SEO ] Deep Entity Architecture Schema (Flawless Version)
        const schemaGraph =[
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
                itemListElement:[
                    { "@type": "ListItem", position: 1, name: "หน้าแรก", item: CONFIG.DOMAIN }, 
                    { "@type": "ListItem", position: 2, name: `รับงาน${provinceName}`, item: provinceUrl }
                ] 
            },
            { 
                "@type": "Service", 
                "@id": `${provinceUrl}/#service`, 
                name: `บริการไซด์ไลน์และเด็กเอ็น VIPในพื้นที่ ${provinceName}`, 
                provider: { "@id": `${CONFIG.DOMAIN}/#organization` }, 
                areaServed: { "@type": "AdministrativeArea", name: provinceName }, 
                description: description,
                category: "Entertainment",
                hasOfferCatalog: { "@id": `${provinceUrl}/#catalog` }
            }
        ];

        if (seoData.faqs) {
            schemaGraph.push({ "@type": "FAQPage", "@id": `${provinceUrl}/#faq`, mainEntity: seoData.faqs.map(faq => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) });
        }
        
        // Deep ItemList Enrichment (OfferCatalog) - Price Validation Fixed
        if (safeProfiles.length > 0) {
            schemaGraph.push({ 
                "@type": "OfferCatalog", 
                "@id": `${provinceUrl}/#catalog`,
                name: `แคตตาล็อกน้องๆ รับงานไซด์ไลน์ ${provinceName}`, 
                description: `รายชื่อโปรไฟล์ ${safeProfiles.length} คนล่าสุดในพื้นที่ ${provinceName} อัปเดต ${CURRENT_MONTH} ${CURRENT_YEAR}`, 
                itemListElement: safeProfiles.slice(0, 12).map((p, i) => {
                    let numericPrice = p.rate ? String(p.rate).replace(/\D/g, '') : "";
                    if (!numericPrice || numericPrice.length === 0) numericPrice = "1500"; // SEO Fallback to prevent invalid price error
                    
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
                                availability: "https://schema.org/InStock"
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
            
            // Dynamic Traits (เพื่อสร้างจุดขายบนหน้าการ์ด)
            const availableTraits = seoData.traits || ["ผิวออร่า", "น่ารัก", "บริการดี", "หุ่นสัดส่วนดี"];
            const randomTrait1 = availableTraits[index % availableTraits.length];
            const randomTrait2 = availableTraits[(index + 3) % availableTraits.length];
            
            const lsiKeyword = seoData.lsi ? seoData.lsi[index % seoData.lsi.length] : `รับงาน${provinceName}`;
            const smartAlt = `รูปโปรไฟล์น้อง${cleanName} บริการ${lsiKeyword} พิกัดโซน${profileLocation}`;
            
            // Critical LCP priority for top 4 cards
            const imageAttributes = index < 4 ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"';

            const hotBadge = (p.isfeatured || index < 3) ? `
                <div class="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] via-[#FFF380] to-[#D4AF37] text-[#0A0A0A] text-[9px] font-black px-4 py-1.5 rounded-full shadow-[0_5px_20px_rgba(212,175,55,0.6)] z-20 tracking-widest uppercase flex items-center gap-1">
                    <i class="fas fa-crown text-[8px]"></i> HOT
                </div>` : '';
                
            const statusIndicator = isAvailable 
                ? `<div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]"></span> <span class="text-[9px] text-[#00E676] tracking-wider uppercase font-bold">ว่าง พร้อมรับงาน</span></div>` 
                : `<div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-500"></span> <span class="text-[9px] text-red-500 tracking-wider uppercase font-bold">ติดจอง</span></div>`;

            // Removed onclick from article to prevent double-click issues, relies entirely on the <a> tag
            return `
            <article class="reveal group relative rounded-[2.5rem] p-[2px] overflow-hidden bg-white/5 hover:bg-white/10 transition-colors duration-500" style="transition-delay: ${animDelay}ms; content-visibility: auto;" aria-label="ดูโปรไฟล์น้อง${cleanName}">
                <!-- Holographic Hover Border -->
                <div class="absolute inset-0 bg-gradient-to-br from-brand-pink via-transparent to-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px] z-0"></div>
                
                <div class="relative h-full bg-[#050505] rounded-[2.4rem] overflow-hidden flex flex-col z-10 border border-white/5 group-hover:border-transparent transition-colors">
                    <a href="${profileLink}" class="absolute inset-0 z-30 focus:outline-none focus:ring-2 focus:ring-brand-pink rounded-[2.4rem]">
                        <span class="sr-only">ดูรายละเอียดของน้อง${cleanName} ${lsiKeyword}</span>
                    </a>
                    
                    ${hotBadge}
                    
                    <!-- Profile Image Container -->
                    <div class="relative aspect-[3/4] overflow-hidden bg-[#111]">
                        <img src="${optimizeImg(p.imagePath, 500, 667)}" 
                             srcset="${optimizeImg(p.imagePath, 300, 400)} 300w, ${optimizeImg(p.imagePath, 500, 667)} 500w"
                             sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                             onerror="this.onerror=null; this.src='/images/default.webp';"
                             alt="${smartAlt}" 
                             class="w-full h-full object-cover transform transition-transform duration-[1s] ease-out group-hover:scale-110" ${imageAttributes} />
                             
                        <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                        
                        <!-- Traits Overlays (The Selling Point) -->
                        <div class="absolute top-4 left-4 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500 pointer-events-none">
                            <span class="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[9px] font-bold text-white shadow-lg"><i class="fas fa-star text-brand-gold text-[8px] mr-1"></i>${randomTrait1}</span>
                            <span class="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[9px] font-bold text-white shadow-lg"><i class="fas fa-heart text-brand-pink text-[8px] mr-1"></i>${randomTrait2}</span>
                        </div>
                        
                        <!-- Info Block Bottom -->
                        <div class="absolute bottom-0 left-0 w-full p-5 text-white z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                            <div class="flex items-end justify-between mb-2">
                                <h3 class="text-2xl font-black leading-none tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">${cleanName} <span class="text-xs font-light text-white/70 ml-1 bg-white/10 px-1.5 py-0.5 rounded">${p.age || '??'}</span></h3>
                            </div>
                            
                            <div class="flex items-center justify-between mt-3">
                                <p class="text-[10px] font-bold text-white mt-1 flex items-center gap-1.5 uppercase tracking-widest bg-black/50 backdrop-blur-md w-max px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
                                    <i class="fas fa-location-arrow text-brand-pink drop-shadow-[0_0_5px_rgba(255,51,102,0.8)]"></i>
                                    <span class="truncate max-w-[100px]">${profileLocation}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Bottom Rate Bar -->
                    <div class="p-5 flex justify-between items-center bg-gradient-to-b from-[#0A0A0A] to-[#050505] relative z-40 pointer-events-none">
                        <div>
                            <span class="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Rate / Course</span>
                            <span class="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tighter">${displayRate} ${displayRate !== "สอบถาม" ? "<span class='text-brand-pink'>฿</span>" : ""}</span>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                            ${statusIndicator}
                            <div class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5 group-hover:bg-brand-pink group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,51,102,0.5)] group-hover:border-brand-pink group-hover:scale-110">
                                <i class="fas fa-arrow-right text-sm transform group-hover:translate-x-1 transition-transform"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </article>`;
        }).join("");

        const htmlTemplate = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth bg-[#050505]">
<head>
    <script>
        (function() {
            var auth = ['sidelinechiangmai.netlify.app', 'localhost', '127.0.0.1'];
            if (!auth.includes(window.location.hostname)) {
                document.documentElement.innerHTML = '<div style="background:#000;color:#FF3366;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;"><h1>403 FORBIDDEN</h1></div>';
                setTimeout(function() { window.location.replace("https://sidelinechiangmai.netlify.app/?ref=stolen_by_" + btoa(window.location.hostname)); }, 1500);
            }
        })();
    </script>
    <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /><meta name="theme-color" content="#050505" /><meta name="apple-mobile-web-app-capable" content="yes" />
    <title>${title}</title><meta name="description" content="${description}" />
    
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <meta name="google-site-verification" content="0N_IQUDZv9Y2WtNhjqSPTV3TuPsildmmO-TPwdMlSfg" />
    <link rel="canonical" href="${provinceUrl}" /><link rel="alternate" hreflang="th-TH" href="${provinceUrl}" /><link rel="alternate" hreflang="x-default" href="${provinceUrl}" />
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}" /><meta property="og:type" content="website" /><meta property="og:title" content="${title}" /><meta property="og:description" content="${description}" /><meta property="og:url" content="${provinceUrl}" /><meta property="og:image" content="${firstImage}" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:site" content="${CONFIG.TWITTER}" /><meta name="twitter:title" content="${title}" /><meta name="twitter:description" content="${description}" /><meta name="twitter:image" content="${firstImage}" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link rel="dns-prefetch" href="https://zxetzqwjaiumqhrpumln.supabase.co" />
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;800;900&display=swap" as="style" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;800;900&display=swap" media="print" onload="this.media='all'" />
    <link rel="preload" as="image" href="/images/hero-sidelinechiangmai-1200.webp" imagesrcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w" sizes="(max-width: 640px) 100vw, 100vw" fetchpriority="high" />
    
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
        :root { --glass: rgba(5, 5, 5, 0.85); }
        body { background: #050505; color: #FFFFFF; -webkit-font-smoothing: antialiased; }
        
        /* Cinematic Noise Texture */
        .noise-overlay {
            position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: 0.03;
            background-image: url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');
        }

        .mesh-bg {
            background-color: #050505;
            background-image: radial-gradient(at 0% 0%, rgba(255, 51, 102, 0.08) 0px, transparent 40%),
                              radial-gradient(at 100% 100%, rgba(212, 175, 55, 0.05) 0px, transparent 40%);
        }

        .glass-effect { background: var(--glass); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        
        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }

        .btn-shine { position: relative; overflow: hidden; isolation: isolate; }
        .btn-shine::after {
            content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
            transform: rotate(45deg); animation: shine 3s infinite; z-index: 1; pointer-events: none;
        }
        @keyframes shine { 0% { left: -100%; } 100% { left: 100%; } }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
    </style>
</head>

<body class="mesh-bg flex flex-col min-h-screen pb-[90px] md:pb-0 text-white selection:bg-brand-pink selection:text-white">
    <div class="noise-overlay"></div>

    <!-- Premium Navbar -->
    <header id="navbar" class="fixed top-0 w-full z-[100] transition-all duration-500 py-4">
        <div class="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between">
            <a href="/" class="z-10 focus:outline-none focus:ring-2 focus:ring-brand-pink rounded-lg">
                <img src="/images/logo-sidelinechiangmai.webp" alt="${CONFIG.BRAND_NAME} Logo" class="h-6 md:h-8 brightness-0 invert opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            </a>
            
            <nav class="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400" aria-label="Main Navigation">
                <a href="/" class="hover:text-brand-pink hover:drop-shadow-[0_0_8px_rgba(255,51,102,0.5)] transition-all">Home</a>
                <a href="/profiles.html" class="text-white border-b-2 border-brand-pink pb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" aria-current="page">VIP Models</a>
                <a href="/locations.html" class="hover:text-brand-pink hover:drop-shadow-[0_0_8px_rgba(255,51,102,0.5)] transition-all">Locations</a>
            </nav>

            <div class="flex items-center gap-4">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-2 bg-white text-[#050505] px-8 py-3 rounded-full text-[10px] font-black tracking-widest btn-shine shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:bg-brand-pink hover:text-white hover:shadow-[0_10px_30px_rgba(255,51,102,0.4)] transition-all border border-transparent">
                    BOOK NOW <i class="fab fa-line text-sm"></i>
                </a>
                <button id="menu-btn" aria-label="Open Mobile Menu" class="md:hidden w-11 h-11 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-sm active:scale-95 transition-transform text-white hover:bg-white/20">
                    <i class="fas fa-bars-staggered text-sm"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Fullscreen Mobile Menu -->
    <div id="mobile-menu" class="fixed inset-0 bg-[#050505]/98 backdrop-blur-3xl z-[150] transform translate-y-[-100%] transition-transform duration-500 ease-in-out flex flex-col justify-center items-center gap-8 border-b-4 border-brand-pink" aria-hidden="true">
        <nav class="flex flex-col items-center gap-8" aria-label="Mobile Navigation">
            <a href="/" class="text-3xl font-black text-gray-500 hover:text-white tracking-tighter transition-colors">HOME</a>
            <a href="/profiles.html" class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-[#D4AF37] tracking-tighter drop-shadow-[0_0_15px_rgba(255,51,102,0.4)]">VIP MODELS</a>
            <a href="/locations.html" class="text-3xl font-black text-gray-500 hover:text-white tracking-tighter transition-colors">LOCATIONS</a>
        </nav>
        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="mt-8 px-10 py-4 bg-white text-[#050505] rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(255,255,255,0.2)] flex items-center gap-3 hover:bg-brand-pink hover:text-white transition-colors">
            Contact Admin <i class="fab fa-line text-xl"></i>
        </a>
        <button id="close-menu" aria-label="Close Mobile Menu" class="absolute top-8 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/30 transition-colors">
            <i class="fas fa-times text-lg"></i>
        </button>
    </div>

    <main class="flex-1">
        
        <!-- S-TIER HERO SECTION -->
        <section class="pt-32 md:pt-40 pb-16 px-6 relative">
            <div class="max-w-7xl mx-auto text-center relative z-10">
                
                <div class="reveal active flex flex-wrap justify-center gap-3 mb-10 relative z-20">
                    <div class="flex items-center gap-2 px-5 py-2 bg-black/60 backdrop-blur-xl border border-green-500/30 rounded-full shadow-lg text-green-400 text-[10px] md:text-xs font-bold">
                        <i class="fas fa-shield-check text-green-500 drop-shadow-[0_0_8px_#00E676]"></i> เจอตัวจริง จ่ายหน้างาน 100%
                    </div>
                    <div class="flex items-center gap-2 px-5 py-2 bg-black/60 backdrop-blur-xl border border-brand-pink/30 rounded-full shadow-lg text-brand-pink text-[10px] md:text-xs font-bold">
                        <i class="fas fa-ban drop-shadow-[0_0_8px_#FF3366]"></i> ไม่มีการโอนมัดจำก่อน
                    </div>
                </div>

                <div class="reveal relative w-full max-w-5xl mx-auto mb-16 group active">
                    <div class="aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(255,51,102,0.2)] bg-[#111] border border-white/10 relative">
                        <img src="/images/hero-sidelinechiangmai-1200.webp" srcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w" sizes="(max-width: 640px) 100vw, 100vw" alt="ไซด์ไลน์${escapeHTML(provinceName)} บริการพรีเมียม" class="w-full h-full object-cover transform transition-transform duration-[4s] group-hover:scale-[1.03] opacity-70" fetchpriority="high">
                        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#050505] pointer-events-none"></div>
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
                            <div class="text-white font-black text-7xl md:text-[10rem] tracking-tighter mix-blend-overlay uppercase select-none drop-shadow-2xl blur-[1px]">${escapeHTML(provinceKey)}</div>
                        </div>
                    </div>
                    <div class="absolute -top-10 -left-10 w-60 h-60 bg-brand-pink/20 blur-[80px] rounded-full pointer-events-none z-[-1]"></div>
                    <div class="absolute -bottom-10 -right-10 w-80 h-80 bg-brand-gold/15 blur-[80px] rounded-full pointer-events-none z-[-1]"></div>
                </div>

                <div class="max-w-4xl mx-auto text-center reveal active relative z-10">
                    <div class="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-green-500/20 shadow-[0_0_20px_rgba(0,230,118,0.1)] backdrop-blur-md">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]"></span>
                        ${safeProfiles.length} VIP Profiles Online
                    </div>
                    
                    <h1 class="text-5xl sm:text-7xl md:text-[5.5rem] font-black text-white leading-[1.05] tracking-tighter mb-8 drop-shadow-2xl">
                        ไซด์ไลน์<span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-[#D4AF37] drop-shadow-[0_0_15px_rgba(255,51,102,0.4)]">${escapeHTML(provinceName)}</span><br>
                        เพื่อนเที่ยวระดับ VIP
                    </h1>
                    
                    <p class="text-gray-300 text-sm md:text-lg mb-12 font-light leading-relaxed max-w-2xl mx-auto px-4">
                        สัมผัสประสบการณ์พักผ่อนระดับพรีเมียม หาเพื่อนเที่ยว ออกเดท ดูหนัง ทานข้าว แบบฟีลแฟน ที่${escapeHTML(provinceName)} กับน้องๆ คัดเกรดพิเศษ 
                        <span class="block mt-3 text-brand-gold font-bold tracking-wide">การันตีโปรไฟล์ตรงปก ยืนยันตัวตนแล้วทุกรหัส 100%</span>
                    </p>
                    <!-- Smart Search Bar -->
<div class="max-w-2xl mx-auto mt-4 mb-8 relative z-20 px-4">
    <form action="/search" method="GET" class="relative group">
        <div class="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none">
            <i class="fas fa-magnifying-glass text-gray-400 group-focus-within:text-brand-pink transition-colors"></i>
        </div>
        <input type="text" name="q" placeholder="พิมพ์ โซน, จังหวัด, หรือชื่อน้อง..." required
            class="w-full bg-[#050505]/80 backdrop-blur-xl border border-white/20 text-white rounded-full py-4 pl-12 md:pl-14 pr-24 md:pr-32 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all font-light placeholder-gray-500 text-sm md:text-base">
        <button type="submit" class="absolute inset-y-1.5 right-1.5 bg-brand-pink text-white px-4 md:px-6 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-white hover:text-brand-pink transition-all shadow-[0_0_15px_rgba(255,51,102,0.4)]">
            ค้นหา
        </button>
    </form>
</div>
                    
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-5 px-6">
                        <a href="#profiles" class="w-full sm:w-auto px-12 py-4 md:py-5 bg-white text-[#050505] rounded-full font-black text-xs md:text-sm tracking-widest hover:bg-brand-pink hover:text-white transition-all shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_40px_rgba(255,51,102,0.4)] uppercase">
                            Explore Collection
                        </a>
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-12 py-4 md:py-5 bg-white/5 text-white border border-white/20 rounded-full font-black text-xs md:text-sm hover:border-brand-pink hover:bg-brand-pink/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest backdrop-blur-md">
                            <i class="fab fa-line text-xl text-[#00C300]"></i> Booking Admin
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Dynamic Glass Filter -->
        <div class="sticky top-[56px] md:top-[64px] z-40 glass-effect py-3.5 overflow-x-auto no-scrollbar">
            <nav class="max-w-7xl mx-auto px-6 flex items-center justify-center sm:justify-start md:justify-center gap-3 min-w-max" aria-label="Profile Filters">
                <button aria-pressed="true" class="shrink-0 px-8 py-2.5 rounded-full bg-white text-[#050505] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(255,255,255,0.2)]">All VIP</button>
                <button aria-pressed="false" class="shrink-0 px-8 py-2.5 rounded-full bg-[#0A0A0A] border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-brand-gold hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all shadow-sm">Hot & Trending</button>
                <button aria-pressed="false" class="shrink-0 px-8 py-2.5 rounded-full bg-[#0A0A0A] border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-brand-pink hover:border-brand-pink/50 hover:bg-brand-pink/5 transition-all shadow-sm"><i class="fas fa-location-dot"></i> Near Me</button>
            </nav>
        </div>

        <!-- The Core Selling Point: Profiles Grid -->
        <section id="profiles" class="max-w-[1440px] mx-auto px-4 md:px-8 py-24 scroll-mt-32">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 px-2">
                <div class="reveal">
                    <h2 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white drop-shadow-xl">EXCLUSIVE<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-purple-500 to-[#D4AF37]">COLLECTION</span></h2>
                    <p class="text-brand-pink text-[10px] font-black uppercase tracking-[0.4em] mt-5 drop-shadow-[0_0_8px_rgba(255,51,102,0.6)] flex items-center gap-2">
                        <i class="fas fa-check-circle"></i> Verified (${CURRENT_MONTH} ${CURRENT_YEAR})
                    </p>
                </div>
                <div class="flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black text-gray-300 uppercase tracking-widest reveal shadow-lg">
                    <span class="w-2.5 h-2.5 rounded-full bg-brand-pink animate-pulse shadow-[0_0_10px_#FF3366]"></span> 
                    Showing ${safeProfiles.length} VIPs
                </div>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
                ${cardsHTML}
            </div>
        </section>
        
        ${generateAppSeoText(provinceName, provinceKey, safeProfiles.length)}

    </main>

    <!-- Clean Premium Footer -->
    <footer class="bg-[#050505] py-24 text-center border-t border-white/10 relative z-10 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,51,102,0.08),transparent_70%)] pointer-events-none z-0"></div>
        <div class="max-w-4xl mx-auto px-6 relative z-10">
            <img src="/images/logo-sidelinechiangmai.webp" alt="Logo" class="h-8 md:h-10 mx-auto brightness-0 invert mb-12 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <h2 class="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter uppercase drop-shadow-2xl">
                รับงานไซด์ไลน์ <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-[#D4AF37] drop-shadow-[0_0_15px_rgba(255,51,102,0.4)]">${escapeHTML(provinceName)}</span>
            </h2>
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-3 bg-white text-[#050505] px-12 py-5 rounded-full font-black text-sm md:text-lg tracking-widest shadow-[0_15px_40px_rgba(255,255,255,0.15)] hover:scale-105 hover:bg-brand-pink hover:text-white hover:shadow-[0_20px_50px_rgba(255,51,102,0.4)] transition-all duration-300 btn-shine">
                <i class="fab fa-line text-2xl text-[#00C300] bg-white rounded-full"></i> BOOKING NOW
            </a>
            
            <nav class="mt-24 flex flex-wrap justify-center gap-x-8 gap-y-6" aria-label="Province Links">
                ${allProvinces.slice(0, 10).map(p => `<a href="/location/${p.key}" class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-brand-pink hover:drop-shadow-[0_0_8px_rgba(255,51,102,0.5)] transition-all">รับงาน${escapeHTML(p.nameThai)}</a>`).join("")}
            </nav>

            <div class="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">© ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. ALL RIGHTS RESERVED.</p>
                <div class="flex gap-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    <a href="/privacy-policy.html" class="hover:text-white transition-colors">Privacy</a>
                    <a href="/terms.html" class="hover:text-white transition-colors">Terms</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Cinematic Mobile Navigation -->
    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] md:hidden w-[90%] max-w-[380px]" aria-label="Quick Mobile Navigation">
        <div class="bg-[#050505]/90 backdrop-blur-2xl border border-white/10 px-8 py-3.5 rounded-full flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
            <a href="/" aria-label="Home" class="text-gray-500 hover:text-white transition-colors p-2 active:scale-95"><i class="fas fa-house text-lg"></i></a>
            <a href="/profiles.html" aria-label="VIP Profiles" class="text-brand-gold drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] p-2 active:scale-95"><i class="fas fa-gem text-xl"></i></a>
            
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="Contact Admin" class="relative w-16 h-16 bg-gradient-to-br from-brand-pink to-purple-600 text-white rounded-full flex items-center justify-center -mt-10 shadow-[0_10px_30px_rgba(255,51,102,0.6)] border-[4px] border-[#050505] transform hover:scale-110 active:scale-95 transition-all btn-shine z-50">
                <i class="fab fa-line text-3xl drop-shadow-md"></i>
            </a>
            
            <a href="/locations.html" aria-label="Locations" class="text-gray-500 hover:text-white transition-colors p-2 active:scale-95"><i class="fas fa-map-marker-alt text-lg"></i></a>
            <a href="/search" aria-label="Search" class="text-gray-500 hover:text-white transition-colors p-2 active:scale-95"><i class="fas fa-magnifying-glass text-lg"></i></a>
        </div>
    </nav>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // High-Performance Intersection Observer for Animations
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

            // Glassmorphism Navbar Scroll Effect
            const nav = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    nav.classList.add('glass-effect');
                    nav.classList.remove('py-4');
                    nav.classList.add('py-3');
                } else {
                    nav.classList.remove('glass-effect');
                    nav.classList.add('py-4');
                    nav.classList.remove('py-3');
                }
            }, { passive: true });

            // Mobile Menu Controller
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
        return new Response('<div style="background:#050505;color:#FF3366;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;"><div><h1 style="font-size:3rem;margin-bottom:10px;">SYSTEM ERROR</h1><p style="color:#888;">Please contact system administrator.</p></div></div>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
};