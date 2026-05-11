import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'SIDELINE CHIANGMAI',
    TWITTER: '@sidelinechiangmai',
    SOCIAL_LINKS: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@sidelinecm',
        twitter: 'https://twitter.com/sidelinechiangmai',
        linkedin: 'https://www.linkedin.com/in/cuteti-sexythailand-398567280?trk=contact-info',
        biosite: 'https://bio.site/firstfiwfans.com',
        linktree: 'https://linktr.ee/kissmodel',
        bluesky: 'https://bsky.app/profile/sidelinechiangmai.bsky.social'
    }
};

const PROVINCE_SEO_DATA = {
    'chiangmai': {
        name: 'เชียงใหม่',
        geo: { lat: 18.7883, lng: 98.9853 },
        zones:['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'คูเมือง', 'หลังมอ'],
        lsi:['รับงานเชียงใหม่', 'สาวไซด์ไลน์เชียงใหม่', 'sideline เชียงใหม่', 'ไซต์ไลน์เชียงใหม่', 'ไซไลเชียงใหม่', 'นางแบบสาวเหนือ', 'เพื่อนเที่ยวเชียงใหม่', 'เด็กเอ็นเชียงใหม่'],
        intents:['รับงานเอนเตอร์เทน', 'ดูแลแบบเต็มวัน', 'เพื่อนเที่ยวคาเฟ่', 'N-VIP ชงเหล้า', 'ปาร์ตี้พูลวิลล่า'],
        traits:['ผิวออร่าสว่าง', 'หน้าหมวยน่ารัก', 'ตัวเล็กสเปคป๋า', 'หุ่นนางแบบ', 'พูดเหนืออ้อนๆ', 'สัดส่วนเป๊ะ'],
        hotels:['โรงแรมระดับพรีเมียมแถวนิมมาน', 'ที่พักใกล้คูเมือง', 'คอนโดหรูเจ็ดยอด', 'รีสอร์ทส่วนตัวแม่ริม'],
        services:['บริการเอนเตอร์เทนส่วนตัว', 'ดูแลฟิวแฟนเดินนิมมาน', 'ปาร์ตี้พูลวิลล่าระดับ VIP', 'เพื่อนเที่ยวผ่อนคลายส่วนตัว'],
        avgPrice: "1,500 - 4,000",
        uniqueIntro: "กำลังมองหาน้องๆ <strong>รับงานเชียงใหม่</strong> หรือ <strong>สาวไซด์ไลน์เชียงใหม่</strong> ระดับพรีเมียมอยู่ใช่ไหม? ที่นี่คือศูนย์รวมนางแบบและเพื่อนเที่ยวสาวเหนือผิวออร่า พร้อมดูแลคุณแบบฟิวแฟนในทุกโซนของเชียงใหม่ ไม่ว่าจะเป็นนิมมาน, สันติธรรม หรือรีสอร์ทส่วนตัว การันตีความตรงปก 100% ปลอดภัย ไร้กังวลเรื่องโอนมัดจำ",
        faqs:[
            { q: "หาน้องๆ รับงานเชียงใหม่ โซนไหนเดินทางสะดวกและเป็นส่วนตัวสุด?", a: "โซนนิมมาน สันติธรรม และเจ็ดยอด เป็นโซนที่น้องๆ พร้อมให้บริการมากที่สุด และมีโรงแรมระดับพรีเมียมรองรับการนัดหมายอย่างปลอดภัย" },
            { q: "ความปลอดภัยในการเรียกสาวไซด์ไลน์เชียงใหม่?", a: "เราเน้นระบบ 'ไม่โอนมัดจำ' ลูกค้าเจอตัวน้อง จ่ายเงินหน้างานเท่านั้น ป้องกันมิจฉาชีพ 100% พร้อมเก็บข้อมูลลูกค้าเป็นความลับสูงสุด" },
            { q: "สามารถนัดน้องๆ ให้มาบริการที่รีสอร์ทส่วนตัวได้ไหม?", a: "ได้แน่นอนครับ น้องๆ ยินดีเดินทางไปดูแลคุณถึงที่พัก เพื่อความเป็นส่วนตัวสูงสุด" }
        ]
    },
    'bangkok': {
        name: 'กรุงเทพ',
        geo: { lat: 13.7563, lng: 100.5018 },
        zones:['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย', 'ปิ่นเกล้า', 'บางนา', 'เลียบด่วน'],
        lsi:['รับงานกรุงเทพ', 'ไซด์ไลน์ กทม', 'สาวไซด์ไลน์กรุงเทพ', 'sideline bkk', 'พริตตี้ กทม.', 'เด็กเอ็นพรีเมียม', 'เพื่อนเที่ยวส่วนตัว', 'นางแบบรับงาน'],
        intents:['เอนเตอร์เทนรายชั่วโมง', 'ดูแลแบบเต็มวัน', 'Private VIP Entertain', 'เพื่อนเที่ยวทองหล่อ', 'ปาร์ตี้ไพรเวท'],
        traits:['ลูกคุณหนู', 'ลุคอินเตอร์สายฝอ', 'ใบหน้าเป๊ะ', 'หุ่นนางแบบ', 'ดูแลเอาใจเก่ง', 'ลุคพนักงานออฟฟิศ'],
        hotels:['คอนโดหรูติด BTS', 'โรงแรมย่านสุขุมวิท', 'ที่พักพรีเมียมห้วยขวาง', 'โรงแรมหรูย่านสาทร'],
        services:['ดูแลแบบฟิวแฟนเต็มรูปแบบ', 'เพื่อนเที่ยวกลางคืนทองหล่อ', 'บริการ N-Vipส่วนตัว'],
        avgPrice: "2,000 - 5,000+",
        uniqueIntro: "เมืองหลวงแห่งแสงสี ที่นี่คือศูนย์รวมตัวท็อปพรีเมียมที่สุดของประเทศ บริการ<strong>รับงานกรุงเทพ</strong>และ<strong>ไซด์ไลน์ กทม.</strong> ครอบคลุมตั้งแต่สุขุมวิท ทองหล่อ ยันรัชดา นัดง่าย เดินทางสะดวกด้วย BTS/MRT คัดเน้นๆ เฉพาะงานคุณภาพระดับ VIP ปลอดภัย จ่ายเงินหน้างาน ไร้กังวลเรื่องมิจฉาชีพ",
        faqs:[
            { q: "น้องๆ รับงานกรุงเทพ ส่วนใหญ่สะดวกโซนไหน?", a: "โซนยอดฮิตคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ นัดหมายตามคอนโดหรือโรงแรมหรูติดรถไฟฟ้าได้สะดวกและเป็นส่วนตัว" },
            { q: "เรียกเด็กเอ็น หรือ ไซด์ไลน์ กทม. ต้องมัดจำไหม?", a: "เพื่อความสบายใจสูงสุดของลูกค้า เราใช้ระบบเจอตัวจริงแล้วค่อยชำระเงิน ไม่มีการบังคับโอนมัดจำล่วงหน้าทุกกรณี" }
        ]
    },
    'lampang': {
        name: 'ลำปาง',
        geo: { lat: 18.2888, lng: 99.4920 },
        zones:['ตัวเมืองลำปาง', 'สวนดอก', 'พระบาท', 'ม.ราชภัฏลำปาง', 'เกาะคา', 'แม่ทะ', 'น้ำล้อม'],
        lsi:['รับงานลำปาง', 'ไซด์ไลน์ลำปาง', 'สาวไซด์ไลน์ลำปาง', 'sideline ลำปาง', 'ไซต์ไลน์ลำปาง', 'นักศึกษาลำปาง', 'เพื่อนเที่ยวลำปาง', 'เด็กเอ็นลำปาง'],
        intents:['เอนเตอร์เทนส่วนตัว', 'ดูแลฟิวแฟน', 'เพื่อนเที่ยวชิลๆ', 'ชงเหล้าปาร์ตี้'],
        traits:['สาวเหนือหน้าหวาน', 'น่ารักเป็นกันเอง', 'เอาใจเก่ง', 'ผิวขาวออร่า', 'สัดส่วนดี'],
        hotels:['โรงแรมในตัวเมืองลำปาง', 'รีสอร์ทส่วนตัวสวนดอก', 'ที่พักใกล้ราชภัฏ'],
        services:['บริการเอนเตอร์เทนผ่อนคลาย', 'ดูแลแบบฟิวแฟน', 'เพื่อนเที่ยวคาเฟ่ลำปาง'],
        avgPrice: "1,500 - 3,000",
        uniqueIntro: "พบกับน้องๆ <strong>รับงานลำปาง</strong> และ <strong>ไซด์ไลน์ลำปาง</strong> ระดับพรีเมียม ที่พร้อมดูแลคุณอย่างใกล้ชิดแบบฟิวแฟน สาวเหนือหน้าหวาน บริการประทับใจ นัดหมายง่ายในโซนตัวเมืองและพื้นที่ใกล้เคียง การันตีโปรไฟล์ตรงปก 100% ปลอดภัย จ่ายเงินหน้างาน ไม่ต้องโอนมัดจำ",
        faqs:[
            { q: "หาไซด์ไลน์ลำปาง นัดเจอโซนไหนได้บ้าง?", a: "น้องๆ ส่วนใหญ่สะดวกในโซนตัวเมืองลำปาง, สวนดอก, และใกล้เคียงสถานศึกษา นัดหมายตามโรงแรมหรือที่พักส่วนตัวได้สะดวก" },
            { q: "รับประกันความตรงปกและการบริการไหม?", a: "โปรไฟล์น้องๆ ทุกคนผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปก และเน้นมารยาทการบริการระดับพรีเมียม เพื่อให้คุณประทับใจที่สุด" }
        ]
    },
    'chiangrai': {
        name: 'เชียงราย',
        geo: { lat: 19.9105, lng: 99.8406 },
        zones:['ตัวเมืองเชียงราย', 'บ้านดู่', 'ม.แม่ฟ้าหลวง', 'ม.ราชภัฏเชียงราย', 'หอนาฬิกา', 'ริมกก'],
        lsi:['รับงานเชียงราย', 'ไซด์ไลน์เชียงราย', 'สาวไซด์ไลน์เชียงราย', 'sideline เชียงราย', 'น้องนักศึกษาเชียงราย', 'เด็กเอ็นเชียงราย'],
        intents:['เพื่อนเที่ยวคาเฟ่เชียงราย', 'เอนเตอร์เทนปาร์ตี้', 'ดูแลฟิวแฟนส่วนตัว'],
        traits:['ลุคคุณหนูเชียงราย', 'ขาวเนียนน่ารัก', 'คุยเก่งอารมณ์ดี', 'โปรไฟล์ดีตรงปก'],
        hotels:['โรงแรมหรูริมกก', 'ที่พักย่านบ้านดู่', 'รีสอร์ทส่วนตัวตัวเมือง'],
        services:['เอนเตอร์เทนพรีเมียมเชียงราย', 'เพื่อนเที่ยวดูหนัง', 'บริการดูแลฟิวแฟน'],
        avgPrice: "1,500 - 3,500",
        uniqueIntro: "ศูนย์รวมความน่ารักเหนือสุดยอดของประเทศ บริการ<strong>รับงานเชียงราย</strong> และ <strong>ไซด์ไลน์เชียงราย</strong> น้องๆ นักศึกษาและนางแบบพริตตี้พร้อมดูแลคุณให้ผ่อนคลาย ไม่ว่าจะเป็นย่านบ้านดู่หรือตัวเมืองเชียงราย การันตีงานพรีเมียม ปลอดภัย ไม่โอนมัดจำ",
        faqs:[
            { q: "หาไซด์ไลน์เชียงราย โซนบ้านดู่ นัดยากไหม?", a: "โซนบ้านดู่และใกล้ มฟล. เป็นย่านยอดฮิตที่มีน้องๆ พร้อมให้บริการมากที่สุด นัดหมายง่ายและรวดเร็ว" },
            { q: "ระบบการจ่ายเงินเป็นอย่างไร?", a: "เน้นความปลอดภัยสูงสุด จ่ายหน้างานหลังจากเจอตัวน้องแล้วเท่านั้น 100% ไม่มีมัดจำ" }
        ]
    },
    'khonkaen': {
        name: 'ขอนแก่น',
        geo: { lat: 16.4322, lng: 102.8236 },
        zones:['มข.', 'กังสดาล', 'หลังมอ', 'เซ็นทรัลขอนแก่น', 'บึงแก่นนคร', 'โนนม่วง'],
        lsi:['รับงานขอนแก่น', 'ไซด์ไลน์ขอนแก่น', 'สาวไซด์ไลน์ขอนแก่น', 'sideline ขอนแก่น', 'เด็กเอ็นขอนแก่น', 'นักศึกษาขอนแก่น'],
        intents:['N-Vip ขอนแก่น', 'เพื่อนเที่ยวกลางคืน', 'ดูแลแบบฟิวแฟน'],
        traits:['สาวอีสานผิวขาว', 'หน้าตาน่ารักหมวย', 'หุ่นเพรียวสัดส่วนดี', 'พูดจาเพราะ'],
        hotels:['โรงแรมหรูใกล้เซ็นทรัล', 'ที่พักย่านกังสดาล', 'คอนโดหรูหลังมอ'],
        services:['เอนเตอร์เทนครบวงจร', 'เพื่อนกินข้าว-ดูหนัง', 'ฟิวแฟนระดับ VIP'],
        avgPrice: "1,500 - 4,000",
        uniqueIntro: "สัมผัสความน่ารักสไตล์สาวอีสานกับบริการ<strong>รับงานขอนแก่น</strong> และ <strong>ไซด์ไลน์ขอนแก่น</strong> ตัวท็อปจากรั้วมหาวิทยาลัยและพริตตี้ชื่อดังในพื้นที่ พร้อมเนรมิตค่ำคืนของคุณให้พิเศษกว่าใคร ตรงปก ปลอดภัย ไม่ต้องลุ้นมัดจำ",
        faqs:[
            { q: "น้องๆ ไซด์ไลน์ขอนแก่น ส่วนใหญ่เป็นใคร?", a: "เรามีทั้งน้องๆ นักศึกษาพาร์ทไทม์ และนางแบบพริตตี้ที่รับงานส่วนตัว ซึ่งผ่านการคัดโปรไฟล์มาอย่างดี" },
            { q: "นัดหมายในขอนแก่นต้องทำอย่างไร?", a: "เลือกน้องที่ถูกใจ ทักสอบถามคิว และนัดเจอในจุดที่เป็นส่วนตัว จ่ายเงินหน้างานสะดวกที่สุด" }
        ]
    },
    'chonburi': {
        name: 'ชลบุรี',
        geo: { lat: 12.9236, lng: 100.8825 },
        zones:['พัทยา', 'บางแสน', 'ศรีราชา', 'อมตะนคร', 'ตัวเมืองชลบุรี', 'ม.บูรพา'],
        lsi:['รับงานชลบุรี', 'ไซด์ไลน์ชลบุรี', 'สาวไซด์ไลน์พัทยา', 'sideline ชลบุรี', 'เพื่อนเที่ยวบางแสน', 'เด็กเอ็นพัทยา'],
        intents:['ปาร์ตี้ริมหาด', 'พูลวิลล่าพัทยา', 'ดูแลฟิวแฟนท่องเที่ยว', 'N-Vip ชลบุรี'],
        traits:['ผิวแทนเซ็กซี่', 'หุ่นนางแบบ', 'อินเตอร์ลุค', 'เอาใจเก่งมาก', 'สายลุยไปไหนไปกัน'],
        hotels:['โรงแรมหรูริมหาดพัทยา', 'คอนโดหรูบางแสน', 'รีสอร์ทส่วนตัวศรีราชา'],
        services:['เพื่อนเที่ยวทะเล', 'เอนเตอร์เทนพูลวิลล่า', 'ดูแล VIP ส่วนตัว'],
        avgPrice: "1,500 - 4,500",
        uniqueIntro: "รวมความเซ็กซี่ระดับตัวแม่กับบริการ<strong>รับงานชลบุรี</strong> และ <strong>ไซด์ไลน์ชลบุรี</strong> ครอบคลุมทั้งพัทยา บางแสน และศรีราชา ไม่ว่าจะเป็นทริปเที่ยวทะเลหรือปาร์ตี้ส่วนตัว น้องๆ ของเราพร้อมดูแลให้คุณประทับใจ การันตีความแซ่บ ตรงปก ไม่โอนมัดจำ",
        faqs:[
            { q: "หาสาวไซด์ไลน์พัทยา-บางแสน ตรงปกไหม?", a: "เราเน้นการตรวจสอบรูปภาพให้ตรงกับตัวจริงที่สุด เพื่อให้ลูกค้าประทับใจและกลับมาใช้บริการซ้ำ" },
            { q: "น้องๆ รับงานพูลวิลล่าไหม?", a: "มีน้องๆ สายปาร์ตี้ที่เชี่ยวชาญการเอนเตอร์เทนในพูลวิลล่าโดยเฉพาะ พร้อมให้บริการในชลบุรีและพัทยา" }
        ]
    },
    'ubonratchathani': {
        name: 'อุบลราชธานี',
        geo: { lat: 15.2293, lng: 104.8570 },
        zones:['ตัวเมืองอุบล', 'วารินชำราบ', 'ม.อุบล', 'เซ็นทรัลอุบล', 'ทุ่งศรีเมือง'],
        lsi:['รับงานอุบล', 'ไซด์ไลน์อุบล', 'สาวไซด์ไลน์อุบล', 'sideline อุบล', 'เด็กเอ็นอุบล', 'เพื่อนเที่ยวอุบล'],
        intents:['เอนเตอร์เทนส่วนตัว', 'ดูแลฟิวแฟน', 'เพื่อนเที่ยวงานเทศกาล'],
        traits:['สาวอีสานหน้าหวาน', 'เรียบร้อยน่ารัก', 'พูดจาดีเอาใจเก่ง', 'ผิวเนียนสวย'],
        hotels:['โรงแรมในตัวเมืองอุบล', 'ที่พักย่านวาริน', 'โรงแรมหรูใกล้เซ็นทรัล'],
        services:['บริการเอนเตอร์เทนแบบเป็นกันเอง', 'ดูแลฟิวแฟนกินข้าวดูหนัง'],
        avgPrice: "1,500 - 3,000",
        uniqueIntro: "พบกับน้องๆ <strong>รับงานอุบล</strong> และ <strong>ไซด์ไลน์อุบล</strong> มนต์เสน่ห์สาวอีสานที่พร้อมจะดูแลคุณอย่างอบอุ่นแบบฟิวแฟน นัดหมายง่าย ปลอดภัยในพื้นที่ตัวเมืองอุบลและวารินชำราบ การันตีความประทับใจ งานดี ตรงปก ไม่โอนมัดจำ",
        faqs:[
            { q: "ไซด์ไลน์อุบล นัดเจอแถวไหนสะดวก?", a: "โซนตัวเมืองและใกล้ห้างเซ็นทรัลอุบล เป็นจุดนัดพบที่สะดวกและปลอดภัยที่สุด" },
            { q: "มีการคัดกรองน้องๆ อย่างไร?", a: "เราคัดเลือกเฉพาะน้องๆ ที่มีใจรักงานบริการและมีตัวตนจริงเท่านั้น เพื่อคุณภาพสูงสุด" }
        ]
    },
    'udonthani': {
        name: 'อุดรธานี',
        geo: { lat: 17.3980, lng: 102.7931 },
        zones:['ตัวเมืองอุดร', 'ยูดีทาวน์', 'เซ็นทรัลอุดร', 'หนองประจักษ์', 'ราชภัฏอุดร'],
        lsi:['รับงานอุดร', 'ไซด์ไลน์อุดร', 'สาวไซด์ไลน์อุดร', 'sideline อุดร', 'เด็กเอ็นอุดร', 'พริตตี้อุดร'],
        intents:['เพื่อนเที่ยว VIP อุดร', 'ดูแลฟิวแฟนเอนเตอร์เทน', 'N-Vip ปาร์ตี้'],
        traits:['ลุคอินเตอร์หน้าเป๊ะ', 'ขาวสวยออร่า', 'แต่งตัวเก่ง', 'บุคลิกดีระดับพริตตี้'],
        hotels:['โรงแรมหรูใกล้ยูดีทาวน์', 'ที่พักพรีเมียมตัวเมือง', 'โรงแรมใกล้เซ็นทรัล'],
        services:['บริการดูแลระดับ Exclusive', 'เพื่อนเที่ยวกลางคืนยูดีทาวน์', 'เอนเตอร์เทนส่วนตัว'],
        avgPrice: "1,500 - 4,000",
        uniqueIntro: "ที่สุดของความพรีเมียมในแดนอีสานเหนือ บริการ<strong>รับงานอุดร</strong> และ <strong>ไซด์ไลน์อุดร</strong> รวบรวมนางแบบและสาวสวยระดับ VIP ที่พร้อมจะทำให้ค่ำคืนของคุณที่อุดรธานีไม่มีวันลืม ตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่โอนมัดจำ",
        faqs:[
            { q: "หาเด็กเอ็นอุดร ย่านไหนตัวท็อปเยอะ?", a: "ย่านยูดีทาวน์และเซ็นทรัลอุดร เป็นแหล่งรวมน้องๆ งานดีระดับพรีเมียม" },
            { q: "จองน้องๆ อุดรธานี ต้องทำอย่างไร?", a: "ทักแชทสอบถามคิวงานน้องที่สนใจ นัดเวลาและสถานที่ จ่ายเงินเมื่อพบตัวน้องจริงเท่านั้น" }
        ]
    },
    'phitsanulok': {
        name: 'พิษณุโลก',
        geo: { lat: 16.8211, lng: 100.2659 },
        zones:['ตัวเมืองพิษณุโลก', 'ม.นเรศวร', 'ริมน้ำน่าน', 'เซ็นทรัลพิษณุโลก'],
        lsi:['รับงานพิษณุโลก', 'ไซด์ไลน์พิษณุโลก', 'สาวไซด์ไลน์พิษณุโลก', 'sideline พิษณุโลก', 'น้องนักศึกษามน', 'เด็กเอ็นพิษณุโลก'],
        intents:['เพื่อนเที่ยวคาเฟ่', 'ดูแลฟิวแฟนทานข้าว', 'เอนเตอร์เทนส่วนตัว'],
        traits:['สาวสองแควหน้าหวาน', 'น่ารักสไตล์นักศึกษา', 'พูดเพราะเป็นกันเอง', 'ดูแลเอาใจใส่เก่ง'],
        hotels:['โรงแรมหรูในเมือง', 'ที่พักใกล้ ม.นเรศวร', 'โรงแรมริมน้ำน่าน'],
        services:['บริการเอนเตอร์เทนแบบฟิวแฟน', 'เพื่อนเที่ยว-ดูหนัง'],
        avgPrice: "1,500 - 3,000",
        uniqueIntro: "สัมผัสความน่ารักแบบสาวเมืองสองแคว บริการ<strong>รับงานพิษณุโลก</strong> และ <strong>ไซด์ไลน์พิษณุโลก</strong> น้องๆ นักศึกษาและพริตตี้ท้องถิ่นพร้อมดูแลคุณอย่างอบอุ่น นัดหมายง่ายในโซนตัวเมืองและย่าน ม.นเรศวร การันตีความตรงปก ปลอดภัย ไร้มัดจำ",
        faqs:[
            { q: "หาไซด์ไลน์พิษณุโลก แถว มน. นัดยากไหม?", a: "โซน ม.นเรศวร (มน.) มีน้องๆ นักศึกษาพาร์ทไทม์รับงานเยอะ นัดหมายได้สะดวกและรวดเร็วมาก" },
            { q: "ต้องจ่ายเงินมัดจำก่อนไหม?", a: "เพื่อความมั่นใจของลูกค้า เราไม่มีนโยบายโอนเงินก่อน จ่ายเงินหน้างานเท่านั้นครับ" }
        ]
    },
    'default': {
        name: 'จังหวัดอื่นๆ',
        geo: { lat: 13.7563, lng: 100.5018 },
        zones:['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู'],
        lsi:['รับงานส่วนตัว', 'สาวไซด์ไลน์', 'sideline พรีเมียม', 'เพื่อนเที่ยว', 'เด็กเอ็น', 'นักศึกษาพาร์ทไทม์', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน'],
        intents:['รับงานเอนเตอร์เทน', 'ดูแลแบบเต็มวัน', 'เพื่อนเที่ยว', 'ฟิวแฟน'],
        traits:['หน้าตาน่ารัก', 'บุคลิกดี', 'เอาใจเก่ง', 'บริการประทับใจ'],
        hotels:['โรงแรมในตัวเมือง', 'รีสอร์ทส่วนตัว'],
        services:['ฟิวแฟนส่วนตัว', 'เพื่อนเที่ยว-ดูหนัง', 'เอนเตอร์เทนผ่อนคลาย'],
        avgPrice: "1,500 - 3,500",
        uniqueIntro: "หากคุณกำลังมองหาช่วงเวลาการพักผ่อนเหนือระดับในพื้นที่ของคุณ เรารวบรวมน้องๆ <strong>รับงานส่วนตัว</strong>และ<strong>ไซด์ไลน์เกรดพรีเมียม</strong> ที่ผ่านการคัดสรรอย่างเข้มงวด การันตีความตรงปก 100% พร้อมให้บริการ นัดหมายได้อย่างเป็นส่วนตัว ปลอดภัย ไม่มีการบังคับโอนมัดจำ จ่ายเงินเมื่อเจอตัวจริงเท่านั้น",
        faqs:[
            { q: "ใช้บริการน้องๆ รับงาน ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายเงินสดหน้างานเมื่อเจอตัวน้องจริงเท่านั้น เพื่อความปลอดภัยสูงสุดของคุณ" },
            { q: "รับประกันความตรงปกไหม?", a: "รูปโปรไฟล์ทุกรูปผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปกและพร้อมให้บริการระดับพรีเมียมอย่างแท้จริง" }
        ]
    }
};

const getFullUrl = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${CONFIG.DOMAIN}${cleanPath}`;
};

const optimizeImg = (path, width = 320, height = 400) => { 
    if (!path) return getFullUrl('/images/default.webp');
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) {
            return path.replace('/upload/', `/upload/f_auto,q_auto:good,w_${width},h_${height},c_fill,g_face/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=80`;
};

const escapeHTML = (str) => {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
};

const generateAppSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    
    const termsAndConditions = [
        {t: "การจองคิวงานส่วนตัว", d: "เพื่อความเป็นส่วนตัวสูงสุด สมาชิก 1 ท่าน สามารถจองคิวงานได้ครั้งละ 1 คิวเท่านั้น ป้องกันความสับสนและรักษาคุณภาพบริการ"},
        {t: "ความปลอดภัยทางการเงิน", d: "ชำระเงินหน้างานเมื่อพบตัวน้องจริงเท่านั้น! เราไม่มีนโยบายให้โอนมัดจำล่วงหน้าทุกกรณี ปลอดภัยจากมิจฉาชีพ 100%"},
        {t: "การตรวจสอบโปรไฟล์", d: "น้องๆ ทุกคนผ่านการตรวจสอบรูปภาพและยืนยันตัวตนแล้ว รับประกันโปรไฟล์ตรงปก เพื่อประสบการณ์ที่ดีที่สุดของคุณ"},
        {t: "การรักษาความเป็นส่วนตัว", d: "ข้อมูลการนัดหมายและข้อมูลส่วนตัวของคุณจะถูกเก็บเป็นความลับสูงสุด และจะถูกลบออกจากระบบทันทีหลังจากงานเสร็จสิ้น"}
    ];

    return `
    <section class="mt-8 px-4 space-y-8 pb-10">

        <!-- Social Links Header -->
        <div class="max-w-md mx-auto p-4 space-y-4">
            <div class="flex items-center justify-center">
                <div class="px-6 py-2 bg-gradient-to-r from-[#FF007F] to-[#7000FF] rounded-full shadow-[0_0_20px_rgba(255,0,127,0.5)]">
                    <span class="text-white font-bold text-lg tracking-widest font-orbitron">VIP PROMOTION</span>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="flex items-center justify-center gap-2 py-2 rounded-lg bg-[#06C755] text-white shadow-[0_0_15px_rgba(6,199,85,0.4)] active:scale-95 transition-all">
                    <i class="fab fa-line text-xl"></i>
                    <span class="text-sm font-bold">LINE</span>
                </a>
                <a href="${CONFIG.SOCIAL_LINKS.twitter}" class="flex items-center justify-center gap-2 py-2 rounded-lg bg-black text-white border border-zinc-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] active:scale-95 transition-all">
                    <i class="fab fa-x-twitter text-xl"></i>
                    <span class="text-sm font-bold">X</span>
                </a>
                <a href="${CONFIG.SOCIAL_LINKS.bluesky}" class="flex items-center justify-center gap-2 py-2 rounded-lg bg-[#0085ff] text-white shadow-[0_0_15px_rgba(0,133,255,0.4)] active:scale-95 transition-all">
                    <i class="fas fa-paper-plane text-xl"></i>
                    <span class="text-sm font-bold">Telegram</span>
                </a>
            </div>
        </div>

        <!-- Promotion Box -->
        <div class="p-[2px] bg-gradient-to-b from-[#FF007F] to-[#7000FF] rounded-3xl shadow-[0_0_30px_rgba(255,0,127,0.3)] max-w-md mx-auto">
            <div class="bg-[#1A0B2E] rounded-[1.4rem] p-5">
                <div class="text-center mb-4">
                    <h3 class="text-white text-xl font-bold">😘 ข้อเสนอพิเศษสำหรับโซน ${escapeHTML(provinceName)}</h3>
                    <p class="text-zinc-400 text-xs">แจ้งโค้ดนี้กับแอดมินเพื่อรับการดูแลระดับ VIP</p>
                    <p class="text-yellow-400 text-xs font-semibold mt-1">⚠️ สิทธิ์มีจำนวนจำกัด ⚠️</p>
                </div>
                
                <div class="bg-[#0A0014]/50 border border-[#3D1A5F] rounded-2xl p-4 space-y-2">
                    <p class="text-white text-center text-sm font-semibold">
                        <span class="text-[#00F3FF]">👍 รับประกันความพึงพอใจ</span> 
                        <span class="text-zinc-300">เมื่อยืนยันการจองด้วยรหัสนี้</span>
                    </p>
                    <div class="bg-black/50 rounded-lg flex items-center justify-center gap-3 py-2.5">
                        <i class="fas fa-gem text-lg text-[#FF007F]"></i>
                        <span class="text-white font-bold text-lg tracking-wider">Code : </span>
                        <span class="text-yellow-300 font-bold text-lg tracking-wider">VIP-${provinceKey.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Terms and Conditions Box -->
        <div class="p-[2px] bg-gradient-to-b from-[#7000FF] to-[#FF007F] rounded-3xl shadow-[0_0_30px_rgba(112,0,255,0.3)] max-w-md mx-auto">
            <div class="bg-[#1A0B2E] rounded-[1.4rem] p-5">
                <div class="text-center mb-6">
                    <div class="inline-block px-5 py-2 bg-black/30 border border-[#3D1A5F] rounded-full">
                        <h3 class="text-white text-xl font-bold tracking-wide">เงื่อนไขการใช้บริการ</h3>
                    </div>
                </div>
                
                <div class="space-y-4">
                    ${termsAndConditions.map((item, idx) => `
                        <div class="flex gap-4 items-start p-4 rounded-2xl bg-[#0A0014]/50 border border-[#3D1A5F]/70">
                            <div class="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-[#FF007F] to-[#7000FF] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(255,0,127,0.5)]">
                                ${idx + 1}
                            </div>
                            <div class="pt-1">
                                <h4 class="text-white text-base font-bold mb-1">${item.t}</h4>
                                <p class="text-zinc-400 text-xs leading-relaxed font-light">${item.d}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                 <div class="mt-6 text-center text-xs text-red-400 font-semibold p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    *** ${CONFIG.BRAND_NAME} เป็นเพียงสื่อกลางในการจัดหาโปรไฟล์เท่านั้น การตัดสินใจนัดหมายถือเป็นความรับผิดชอบของลูกค้าและผู้ให้บริการโดยตรง ***
                </div>
            </div>
        </div>

        <!-- Unique Intro Box -->
        <div class="text-center py-8 px-6 bg-[#1A0B2E]/30 rounded-[2rem] border border-[#3D1A5F]/40 max-w-2xl mx-auto">
             <h3 class="text-xl font-bold text-white mb-4 text-neon-cyan">ทำไมต้องเลือกไซด์ไลน์ ${escapeHTML(provinceName)} จากเรา?</h3>
            <p class="text-zinc-300 text-sm md:text-base font-light leading-loose">
                ${data.uniqueIntro}
            </p>
        </div>
    </section>`;
};


export default async (request, context) => {
    try {
        const url = new URL(request.url);

        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province");
            const cleanUrl = new URL(`/location/${provinceValue}`, url.origin);
            return Response.redirect(cleanUrl.toString(), 301); 
        }

        const pathParts = url.pathname.split('/').filter(Boolean);
        const rawProvinceKey = pathParts[pathParts.length - 1] || 'chiangmai';
        const provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        const[provinceRes, profilesRes, allProvincesRes] = await Promise.all([
            supabase.from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle(),
            supabase.from('profiles').select('id, slug, name, imagePath, location, rate, isfeatured, lastUpdated, active, availability')
                .eq('provinceKey', provinceKey).eq('active', true)
                .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false }).limit(80),
            supabase.from('provinces').select('key, nameThai').order('nameThai', { ascending: true })
        ]);

        const provinceData = provinceRes.data;
        const profiles = profilesRes.data ||[];
        const allProvinces = allProvincesRes.data ||[];

        if (!provinceData) return context.next();

        const safeProfiles = profiles;
        const provinceName = provinceData.nameThai;
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
        
        const now = new Date();
        const CURRENT_YEAR = now.getFullYear();
        const CURRENT_MONTH = now.toLocaleString('th-TH', { month: 'long' });
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        const title = `ไซด์ไลน์${provinceName} (${safeProfiles.length > 0 ? `${safeProfiles.length}+ คน` : 'เกรดพรีเมียม'}) รับงานเด็กเอ็น VIP ไม่ต้องมัดจำ`;
        const description = `รวมน้องๆ รับงาน${provinceName} และไซด์ไลน์${provinceName} ระดับ VIP ${safeProfiles.length} โปรไฟล์ โซน ${(seoData.zones||['ตัวเมือง']).slice(0,3).join(', ')} และอีกมากมาย ✓การันตีตรงปก 100% ✓ไม่บังคับโอนมัดจำ ✓จ่ายเงินสดหน้างานเท่านั้น`;

        const priceParts = (seoData.avgPrice || "1,500 - 3,500").split('-');
        const startPrice = priceParts[0] ? priceParts[0].trim() : "1,500";
        const endPrice = priceParts[1] ? priceParts[1].trim() : "5,000";
        const validUntil = new Date(now.setFullYear(now.getFullYear() + 1)).toISOString().split('T')[0];

        const schemaData = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "WebSite",
                    "@id": `${CONFIG.DOMAIN}/#website`,
                    "url": CONFIG.DOMAIN,
                    "name": CONFIG.BRAND_NAME,
                    "publisher": { "@id": `${CONFIG.DOMAIN}/#business` },
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": `${CONFIG.DOMAIN}/search?q={search_term_string}`,
                        "query-input": "required name=search_term_string"
                    }
                },
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}/#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "description": description,
                    "isPartOf": { "@id": `${CONFIG.DOMAIN}/#website` },
                    "breadcrumb": { "@id": `${provinceUrl}/#breadcrumb` },
                    "about": { "@id": `${provinceUrl}/#business` }
                },
                {
                    "@type": "BreadcrumbList",
                    "@id": `${provinceUrl}/#breadcrumb`,
                    "itemListElement":[
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": "รวมโปรไฟล์", "item": `${CONFIG.DOMAIN}/profiles.html` },
                        { "@type": "ListItem", "position": 3, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type":["LocalBusiness", "ModelingAgency"],
                    "@id": `${provinceUrl}/#business`,
                    "name": `ไซด์ไลน์${provinceName} VIP - ${CONFIG.BRAND_NAME}`,
                    "image": firstImage,
                    "description": description,
                    "priceRange": `฿${startPrice} - ฿${endPrice}`,
                    "url": provinceUrl,
                    "telephone": "", 
                    "address": {
                        "@type": "PostalAddress",
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": seoData.geo.lat,
                        "longitude": seoData.geo.lng
                    },
                    "aggregateRating": safeProfiles.length > 0 ? {
                        "@type": "AggregateRating",
                        "ratingValue": "4.8",
                        "reviewCount": String(safeProfiles.length * 3 + 12),
                        "bestRating": "5",
                        "worstRating": "1"
                    } : undefined,
                    "offers": safeProfiles.length > 0 ? {
                        "@type": "AggregateOffer",
                        "offerCount": String(safeProfiles.length),
                        "lowPrice": startPrice.replace(/,/g, ''),
                        "highPrice": endPrice.replace(/,/g, ''),
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "priceValidUntil": validUntil
                    } : undefined
                },
                {
                    "@type": "FAQPage",
                    "@id": `${provinceUrl}/#faq`,
                    "mainEntity":[
                        {
                            "@type": "Question",
                            "name": `หาไซด์ไลน์${provinceName} งานตรงปกได้ที่ไหน?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `คุณสามารถเลือกดูโปรไฟล์น้องๆ ไซด์ไลน์${provinceName} ที่คัดสรรมาอย่างดีได้ที่ ${CONFIG.BRAND_NAME} เราเน้นงานตรงปก อัปเดตใหม่ล่าสุด และไม่มีการเก็บมัดจำล่วงหน้า`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `เรทราคาไซด์ไลน์ใน${provinceName} อยู่ที่ประมาณเท่าไหร่?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `น้องๆ ไซด์ไลน์ในพื้นที่${provinceName} มีเรทราคาเริ่มต้นที่ประมาณ ${startPrice} ถึง ${endPrice} บาท ซึ่งเป็นราคารวมค่าห้องหรือตามตกลงกับน้องโดยตรงครับ`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "ขั้นตอนการจองงานต้องโอนมัดจำก่อนไหม?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "เพื่อความปลอดภัยของผู้ใช้บริการ เว็บไซต์เราไม่มีนโยบายให้โอนมัดจำก่อนทุกกรณี ท่านสามารถนัดเจอน้อง ตรวจสอบความถูกต้อง แล้วค่อยชำระเงินหน้างานได้เลยครับ"
                            }
                        }
                    ]
                }
            ]
        };

        let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            const intents = seoData.intents ||["หาเพื่อนเที่ยว", "น้องเอนเตอร์เทน", "รับงานนอกสถานที่", "ฟีลแฟน", "เพื่อนเที่ยวกลางคืน", "เด็กเอ็น VIP"];
            const traits = seoData.traits ||["ผิวขาวออร่า", "หุ่นนางแบบ", "ตรงปก 100%", "บริการเป็นกันเอง", "คุยสนุกเอาใจเก่ง", "สเปกพรีเมียม"];

            cardsHTML = safeProfiles.map((p, i) => {
                const rawName = (p.name || 'ไม่ระบุชื่อ').replace(/^(น้อง\s?)/, '');
                const cleanName = escapeHTML(rawName);
                const profileLocation = escapeHTML(p.location || provinceName || 'ไม่ระบุโซน');
                const profileLink = `/sideline/${escapeHTML(p.slug || p.id)}`;
                
                const isAvailable = !['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'].some(kw => 
                    (p.availability || '').toLowerCase().includes(kw)
                );

                let displayRate = 'สอบถาม';
                if (p.rate) {
                    const cleanRateValue = String(p.rate).replace(/,/g, '').trim();
                    const numRate = Number(cleanRateValue);
                    if (!isNaN(numRate) && cleanRateValue !== '') {
                        displayRate = numRate.toLocaleString();
                    } else {
                        displayRate = escapeHTML(p.rate);
                    }
                }

                const mockRating = (4.8 + Math.random() * 0.2).toFixed(1); 
                const animDelay = (i % 10) * 50; 
                const lsiKeyword = seoData.lsi && seoData.lsi.length > 0 ? seoData.lsi[i % seoData.lsi.length] : `รับงาน${provinceName}`;
                const myIntent = intents[i % intents.length];
                const myTrait = traits[i % traits.length];
                
                const smartAlt = `น้อง${cleanName} - ${lsiKeyword} โซน${profileLocation} | ${myTrait}, ${myIntent}`;

                const imageAttributes = i < 4 
                    ? 'fetchpriority="high" decoding="sync"' 
                    : 'loading="lazy" decoding="async"';

                const statusBgClass = isAvailable ? 'bg-[#00F3FF]' : 'bg-[#FF007F]';
                const statusTextClass = isAvailable ? 'text-[#00F3FF]' : 'text-[#FF007F]';
                const statusBorderClass = isAvailable ? 'border-[#00F3FF]/30' : 'border-[#FF007F]/30';
                const statusShadowClass = isAvailable ? 'shadow-[0_0_10px_rgba(0,243,255,0.2)]' : 'shadow-[0_0_10px_rgba(255,0,127,0.2)]';

                return `
                <article class="block group relative cyber-glass rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transform transition-all duration-300 hover:scale-[1.02] cyber-card-glow animate-fade-in-up active:scale-95" style="animation-delay: ${animDelay}ms; animation-fill-mode: both;">
                    <a href="${profileLink}" aria-label="ดูโปรไฟล์ ${smartAlt}" class="block absolute inset-0 z-30"></a>
                    <div class="relative aspect-[4/5] w-full overflow-hidden bg-[#0A0014]">
                        <img src="${optimizeImg(p.imagePath, 320, 400)}" 
                             width="320" height="400"
                             onerror="this.onerror=null;this.src='${CONFIG.DOMAIN}/images/default.webp';"
                             alt="${smartAlt}"
                             class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-1000 ease-out"
                             style="filter: contrast(1.02) saturate(1.05);" 
                             ${imageAttributes}>
                        <div class="absolute inset-0 bg-gradient-to-tr from-[#7000FF]/30 to-[#FF007F]/20 mix-blend-soft-light z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-700" style="transform: translateZ(0);"></div>
                        <div class="absolute inset-0 shadow-[inset_0_0_60px_rgba(10,0,20,0.9),inset_0_0_20px_rgba(10,0,20,0.6)] z-10 pointer-events-none" style="transform: translateZ(0);"></div>
                        <div class="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0A0014] via-[#0A0014]/70 to-transparent z-10 pointer-events-none"></div>
                        <div class="absolute top-3 left-3 md:top-4 md:left-4 z-20 flex items-center gap-1.5 cyber-glass px-2.5 py-1 md:px-3 md:py-1.5 rounded-full ${statusShadowClass} border ${statusBorderClass}">
                            <span class="relative flex h-2 w-2" aria-hidden="true">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${statusBgClass} opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 ${statusBgClass} shadow-[0_0_5px_currentColor]"></span>
                            </span>
                            <span class="text-[9px] md:text-[10px] font-bold ${statusTextClass} uppercase tracking-wider font-orbitron">
                                ${isAvailable ? 'ONLINE' : 'BUSY'}
                            </span>
                        </div>
                        ${(i < 3 || p.isfeatured) ? `
                        <div class="absolute top-3 right-3 md:top-4 md:right-4 z-20 bg-[#FF007F] px-2.5 py-1 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,0,127,0.8)] flex items-center gap-1">
                            <i class="fas fa-fire text-white text-[9px] md:text-[10px] animate-pulse" aria-hidden="true"></i>
                            <span class="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider font-orbitron">HOT</span>
                        </div>` : ''}
                        <div class="absolute bottom-0 inset-x-0 p-4 md:p-5 z-20">
                            <div class="flex items-end justify-between gap-2">
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-xl md:text-3xl font-bold text-white leading-none mb-1.5 truncate drop-shadow-lg text-neon">${cleanName}</h3>
                                    <div class="flex items-center gap-1.5 text-zinc-300 text-[10px] md:text-sm">
                                        <i class="fas fa-map-marker-alt text-[#7000FF] drop-shadow-[0_0_5px_rgba(112,0,255,0.8)]" aria-hidden="true"></i>
                                        <span class="truncate">${profileLocation}</span>
                                    </div>
                                </div>
                                <div class="text-right shrink-0">
                                    <span class="block text-[9px] md:text-[10px] text-zinc-300 font-medium uppercase tracking-wider mb-0.5 font-orbitron">RATE</span>
                                    <span class="font-black text-lg md:text-xl text-[#FF007F] tracking-tight text-neon">฿${displayRate}</span>
                                </div>
                            </div>
                            <div class="mt-3 md:mt-4 flex items-center justify-between md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
                                <div class="flex items-center gap-1 text-[#00F3FF] text-[10px] md:text-xs font-bold cyber-glass px-2 py-1 rounded-lg border border-[#00F3FF]/30 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                                    <i class="fas fa-star" aria-hidden="true"></i> ${mockRating}
                                </div>
                                <div class="btn-neon text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-1.5 font-orbitron" aria-hidden="true">
                                    VIEW <i class="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>`;
            }).join('');
        } else {
            cardsHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 md:py-32 text-center cyber-glass rounded-[2rem] border border-[#3D1A5F]/50">
                <div class="w-20 h-20 bg-[#1A0B2E] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(112,0,255,0.2)] border border-[#7000FF]/30">
                    <i class="fas fa-hourglass-half text-3xl text-[#00F3FF] animate-pulse" aria-hidden="true"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-3 text-neon-cyan tracking-wide">กำลังอัปเดตระบบ</h3>
                <p class="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                    ขณะนี้กำลังจัดเตรียมโปรไฟล์น้องๆ ระดับ VIP ในโซน <strong class="text-white">${escapeHTML(provinceName)}</strong><br/>กรุณากลับมาตรวจสอบใหม่อีกครั้งในภายหลัง
                </p>
                <a href="/" class="mt-8 btn-neon px-8 py-3 rounded-full text-sm font-bold font-orbitron tracking-widest uppercase">
                    กลับหน้าหลัก
                </a>
            </div>`;
        }

        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth bg-[#0A0014]">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0A0014">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${provinceUrl}" />
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${firstImage}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.tailwindcss.com">
    <link rel="dns-prefetch" href="https://zxetzqwjaiumqhrpumln.supabase.co">
    
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=Prompt:wght@300;400;500;600;700;800&display=swap" as="style">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=Prompt:wght@300;400;500;600;700;800&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=Prompt:wght@300;400;500;600;700;800&display=swap"></noscript>
    
    <link rel="preload" as="image" href="/images/hero-sidelinechiangmai-600.webp" media="(max-width: 640px)" fetchpriority="high">
    <link rel="preload" as="image" href="/images/hero-sidelinechiangmai-1200.webp" media="(min-width: 641px)" fetchpriority="high">
    
    ${safeProfiles.length > 0 ? `<link rel="preload" as="image" href="${optimizeImg(safeProfiles[0].imagePath, 400, 500)}" fetchpriority="high">` : ''}

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        window.tailwind = window.tailwind || {};
        tailwind.config = {
            theme: {
                extend: {
                    colors: { 
                        cyber: {
                            bg: '#0A0014',
                            card: '#1A0B2E',
                            border: '#3D1A5F',
                            pink: '#FF007F',
                            purple: '#7000FF',
                            cyan: '#00F3FF'
                        },
                        zinc: { 900: '#1A0B2E', 950: '#0A0014' }
                    },
                    fontFamily: { 
                        sans:['Prompt', 'Inter', 'sans-serif'],
                        orbitron:['Orbitron', 'sans-serif']
                    },
                    keyframes: {
                        'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                        'scale-in': { '0%': { transform: 'scale(0.9)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
                        'slide-in': { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
                        'pulse-glow': { '0%, 100%': { opacity: 1, textShadow: '0 0 10px rgba(255,0,127,0.8)' }, '50%': { opacity: .7, textShadow: '0 0 20px rgba(255,0,127,1)' } }
                    },
                    animation: {
                        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        'scale-in': 'scale-in 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        'slide-in': 'slide-in 0.3s ease-out forwards',
                        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }
                }
            }
        }
    </script>

    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

    <style>
        body { 
            margin: 0; font-family: 'Prompt', sans-serif; background-color: #0A0014; color: #fff; 
            background-image: radial-gradient(at 50% 0%, rgba(112, 0, 255, 0.15) 0px, transparent 60%);
            -webkit-tap-highlight-color: transparent; 
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(112, 0, 255, 0.5); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 0, 127, 0.8); }

        .btn-neon {
            background: #FF007F;
            color: #ffffff;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
            box-shadow: 0 0 15px rgba(255, 0, 127, 0.6), 0 0 30px rgba(255, 0, 127, 0.3);
            transition: all 0.3s ease;
        }
        .btn-neon:hover {
            box-shadow: 0 0 25px rgba(255, 0, 127, 0.9), 0 0 50px rgba(255, 0, 127, 0.5);
            transform: scale(1.05);
        }
        .text-neon { text-shadow: 0 0 10px rgba(255, 0, 127, 0.5); }
        .text-neon-cyan { text-shadow: 0 0 10px rgba(0, 243, 255, 0.5); }
        .text-neon-purple { text-shadow: 0 0 10px rgba(112, 0, 255, 0.5); }
        .cyber-glass {
            background: rgba(26, 11, 46, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid #3D1A5F;
        }
        .cyber-card-glow:hover { box-shadow: 0 0 25px rgba(112, 0, 255, 0.3); border-color: #7000FF; }
        
        .pb-safe { padding-bottom: calc(70px + env(safe-area-inset-bottom)); }
        .pt-safe { padding-top: env(safe-area-inset-top); }
        .faq-answer { grid-template-rows: 0fr; }
        .faq-item[aria-expanded="true"] .faq-answer { grid-template-rows: 1fr; }
        .faq-item[aria-expanded="true"] .faq-question i { transform: rotate(180deg); }
    </style>
</head>

<body class="antialiased flex flex-col min-h-screen pb-safe md:pb-0">

    <nav aria-label="เมนูหลัก" class="fixed top-0 w-full z-50 pt-safe transition-transform duration-300" id="navbar" style="background: rgba(10, 0, 20, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid #3D1A5F; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-20 flex items-center justify-between">
            <a href="/" class="flex items-center" aria-label="หน้าหลัก ${CONFIG.BRAND_NAME}">
                <img src="/images/logo-sidelinechiangmai.webp" alt="โลโก้ ${CONFIG.BRAND_NAME}" width="168" height="28" class="h-[24px] md:h-[30px] w-auto brightness-200" style="filter: drop-shadow(0 0 8px rgba(255,0,127,0.5));">
            </a>
            
            <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
                <a href="/" class="hover:text-white hover:text-neon transition-all">หน้าแรก</a>
                <a href="/profiles.html" class="text-white font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-[#FF007F] after:shadow-[0_0_10px_#FF007F]" aria-current="page">น้องๆ VIP</a>
                <a href="/locations.html" class="hover:text-white hover:text-neon transition-all">พิกัดบริการ</a>
                <a href="/about.html" class="hover:text-white hover:text-neon transition-all">เกี่ยวกับเรา</a>
                <a href="/blog.html" class="hover:text-white hover:text-neon transition-all">บทความ</a>
            </div>
            
            <div class="flex items-center gap-3">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="ติดต่อแอดมินผ่าน LINE" class="hidden md:flex items-center gap-2 btn-neon px-5 py-2.5 rounded-full text-sm font-bold">
                    <i class="fab fa-line text-lg" aria-hidden="true"></i> แอดไลน์จอง
                </a>
                
                <button id="menu-btn" aria-label="เปิดเมนูนำทางบนมือถือ" aria-expanded="false" aria-controls="sidebar-menu" class="md:hidden w-10 h-10 flex items-center justify-center text-[#FF007F] cyber-glass rounded-full hover:shadow-[0_0_15px_rgba(255,0,127,0.5)]">
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </nav>

    <div id="sidebar-overlay" class="fixed inset-0 bg-[#0A0014]/80 backdrop-blur-sm z-[60] hidden opacity-0 transition-opacity duration-300" aria-hidden="true"></div>
    <nav id="sidebar-menu" aria-label="เมนูมือถือ" class="fixed top-0 right-0 h-full w-72 bg-[#0A0014] border-l border-[#3D1A5F] shadow-[0_0_30px_rgba(112,0,255,0.2)] z-[70] transform translate-x-full transition-transform duration-300 flex flex-col pt-safe">
        <div class="flex items-center justify-between p-5 border-b border-[#3D1A5F]">
            <span class="text-lg font-black text-[#FF007F] uppercase tracking-widest font-orbitron text-neon">MENU</span>
            <button id="close-menu-btn" aria-label="ปิดเมนูนำทางบนมือถือ" class="w-8 h-8 flex items-center justify-center rounded-full cyber-glass text-zinc-300 hover:text-white hover:border-[#FF007F]">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
            <a href="/" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A0B2E] text-zinc-300 hover:text-white hover:shadow-[inset_0_0_10px_rgba(112,0,255,0.5)] transition-all"><i class="fas fa-home w-6 text-center text-[#FF007F]" aria-hidden="true"></i> หน้าแรก</a>
            <a href="/profiles.html" class="flex items-center gap-4 p-3 rounded-xl cyber-glass text-white font-bold border-[#FF007F] shadow-[0_0_15px_rgba(255,0,127,0.2)]"><i class="fas fa-gem w-6 text-center text-[#FF007F] animate-pulse" aria-hidden="true"></i> น้องๆ VIP</a>
            <a href="/locations.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A0B2E] text-zinc-300 hover:text-white hover:shadow-[inset_0_0_10px_rgba(112,0,255,0.5)] transition-all"><i class="fas fa-map-marker-alt w-6 text-center text-[#FF007F]" aria-hidden="true"></i> พิกัดบริการ</a>
            <a href="/about.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A0B2E] text-zinc-300 hover:text-white hover:shadow-[inset_0_0_10px_rgba(112,0,255,0.5)] transition-all"><i class="fas fa-info-circle w-6 text-center text-[#FF007F]" aria-hidden="true"></i> เกี่ยวกับเรา</a>
            <a href="/faq.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A0B2E] text-zinc-300 hover:text-white hover:shadow-[inset_0_0_10px_rgba(112,0,255,0.5)] transition-all"><i class="fas fa-question-circle w-6 text-center text-[#FF007F]" aria-hidden="true"></i> คำถามพบบ่อย</a>
            <a href="/blog.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A0B2E] text-zinc-300 hover:text-white hover:shadow-[inset_0_0_10px_rgba(112,0,255,0.5)] transition-all"><i class="fas fa-newspaper w-6 text-center text-[#FF007F]" aria-hidden="true"></i> บทความ</a>
        </div>
        <div class="p-5 border-t border-[#3D1A5F] pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="ติดต่อแอดมินผ่าน LINE" class="flex items-center justify-center gap-2 w-full btn-neon text-white py-3.5 rounded-xl font-bold uppercase tracking-wider font-orbitron">
                <i class="fab fa-line text-xl" aria-hidden="true"></i> ติดต่อแอดมิน
            </a>
        </div>
    </nav>

    <header class="pt-24 pb-8 md:pt-32 md:pb-16 px-4 relative">
        <div class="absolute inset-0 bg-[#0A0014] overflow-hidden pointer-events-none -z-10" aria-hidden="true">
            <div class="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#7000FF]/10 blur-[120px] rounded-full pointer-events-none" style="contain: strict; transform: translateZ(0);"></div>
            <div class="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[#FF007F]/10 blur-[100px] rounded-full pointer-events-none" style="contain: strict; transform: translateZ(0);"></div>
        </div>

        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
            <div class="flex-1 text-center lg:text-left z-10 animate-fade-in-up">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full cyber-glass text-[10px] md:text-xs font-semibold text-white uppercase tracking-widest mb-4 md:mb-6 font-orbitron shadow-[0_0_10px_rgba(255,0,127,0.2)]">
                    <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#FF007F] animate-pulse shadow-[0_0_8px_#FF007F]" aria-hidden="true"></span> ${CONFIG.BRAND_NAME}
                </div>
                
                <h1 class="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-4 md:mb-6 tracking-tight">
                    <span class="text-[#FF007F] text-neon" style="text-shadow: 0 0 20px rgba(255,0,127,0.8);">ไซด์ไลน์${escapeHTML(provinceName)}</span><br/>
                    <span class="text-white text-neon-cyan">คัดเกรด VIP (เด็กเอ็นพรีเมียม)</span>
                </h1>
                <p class="text-zinc-300 text-sm md:text-lg mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                    สัมผัสประสบการณ์พักผ่อนเหนือระดับใน **${escapeHTML(provinceName)}** กับน้องๆ **ไซด์ไลน์ VIP** ที่คัดมาเพื่อคุณ ไม่ว่าจะเป็น **เพื่อนเที่ยวน่ารักๆ** หรือ **เด็กเอ็น** ดูแลในปาร์ตี้ส่วนตัว ที่นี่คือศูนย์รวมบริการพรีเมียมที่รับประกันความตรงปก ปลอดภัย 100% **ไม่ต้องโอนมัดจำ**
                </p>

                <div class="flex flex-col sm:flex-row items-center gap-3 md:gap-4 justify-center lg:justify-start">
                    <a href="#profiles-grid" class="w-full sm:w-auto btn-neon px-8 py-3.5 md:py-4 rounded-full font-bold text-sm text-center font-orbitron">
                        ดูโปรไฟล์น้องๆ ทั้งหมด
                    </a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="ปรึกษาแอดมินผ่าน LINE" class="w-full sm:w-auto cyber-glass hover:bg-[#1A0B2E] text-white px-8 py-3.5 md:py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(112,0,255,0.4)]">
                        <i class="fab fa-line text-lg text-[#00c300]" aria-hidden="true"></i> ปรึกษาแอดมิน
                    </a>
                </div>
            </div>
            
            <div class="flex-1 w-full max-w-md lg:max-w-full animate-scale-in">
                <div class="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden aspect-[4/5] md:aspect-square border border-[#3D1A5F] shadow-[0_0_40px_rgba(255,0,127,0.2)] group">
                    <img src="/images/hero-sidelinechiangmai-1200.webp" 
                         srcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w"
                         sizes="(max-width: 640px) 100vw, 50vw"
                         alt="บริการรับงาน ไซด์ไลน์ ${escapeHTML(provinceName)} ระดับ VIP" 
                         width="1200" height="1200"
                         class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 group-hover:brightness-110 transition-all duration-1000"
                         fetchpriority="high">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0A0014]/90 via-[#0A0014]/20 to-transparent" aria-hidden="true"></div>
                    <div class="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 cyber-glass rounded-2xl p-4 flex items-center gap-4">
                        <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#00F3FF] flex items-center justify-center text-[#0A0014] shadow-[0_0_15px_rgba(0,243,255,0.8)]"><i class="fas fa-shield-check text-lg md:text-xl" aria-hidden="true"></i></div>
                        <div>
                            <span class="block text-white font-bold text-sm tracking-wide font-orbitron text-neon-cyan">Verified & Safe</span>
                            <span class="block text-zinc-300 text-[10px] md:text-xs font-light mt-0.5">คัดกรองประวัติและยืนยันตัวตนแล้ว</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section aria-label="ช่องทางติดต่อทางการ" class="max-w-6xl mx-auto mt-10 md:mt-16 px-4 animate-fade-in-up" style="animation-delay: 0.4s;">
            <div class="text-center mb-5">
                <span class="text-[10px] md:text-xs text-zinc-300 font-bold uppercase tracking-[0.2em] cyber-glass px-4 py-1.5 rounded-full font-orbitron shadow-[0_0_10px_rgba(112,0,255,0.2)]">
                    Connect With Our Official Channels
                </span>
            </div>

            <nav aria-label="โซเชียลมีเดีย" class="overflow-x-auto no-scrollbar pb-6">
                <div class="flex flex-nowrap justify-start lg:justify-center gap-3 w-max mx-auto px-4">
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 px-5 py-2.5 bg-[#00c300]/10 border border-[#00c300]/30 rounded-full text-xs font-bold text-[#00c300] hover:bg-[#00c300]/20 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,195,0,0.4)] transition-all duration-300 font-orbitron"><i class="fab fa-line text-base" aria-hidden="true"></i> LINE</a>
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/20 rounded-full text-xs font-bold text-white hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 font-orbitron"><i class="fab fa-x-twitter text-base" aria-hidden="true"></i> TWITTER</a>
                    <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 px-5 py-2.5 bg-[#ff0050]/10 border border-[#ff0050]/30 rounded-full text-xs font-bold text-[#ff0050] hover:bg-[#ff0050]/20 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,0,80,0.4)] transition-all duration-300 font-orbitron"><i class="fab fa-tiktok text-base" aria-hidden="true"></i> TIKTOK</a>
                    <a href="${CONFIG.SOCIAL_LINKS.bluesky}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 px-5 py-2.5 bg-[#0085ff]/10 border border-[#0085ff]/30 rounded-full text-xs font-bold text-[#0085ff] hover:bg-[#0085ff]/20 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,133,255,0.4)] transition-all duration-300 font-orbitron"><i class="fas fa-cloud text-base" aria-hidden="true"></i> BLUESKY</a>
                    <a href="${CONFIG.SOCIAL_LINKS.linktree}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 px-5 py-2.5 bg-[#39e09b]/10 border border-[#39e09b]/30 rounded-full text-xs font-bold text-[#39e09b] hover:bg-[#39e09b]/20 hover:scale-105 hover:shadow-[0_0_15px_rgba(57,224,155,0.4)] transition-all duration-300 font-orbitron"><i class="fas fa-link text-base" aria-hidden="true"></i> LINKTREE</a>
                </div>
            </nav>
            
            <div class="mt-4 flex justify-center">
                <div class="group relative" role="alert" aria-live="polite">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-[#FF007F]/40 to-[#7000FF]/40 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000" aria-hidden="true"></div>
                    <div class="relative flex items-center gap-3 px-6 py-3 rounded-xl bg-[#0A0014] border border-[#FF007F]/30 text-[#FF007F] shadow-[0_0_15px_rgba(255,0,127,0.2)]">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF007F]/20 flex items-center justify-center border border-[#FF007F]/40 shadow-[0_0_10px_#FF007F]">
                            <span class="text-[14px] font-black font-orbitron">20+</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[11px] md:text-xs font-bold tracking-wider uppercase font-orbitron text-neon">Age Verification Required</span>
                            <span class="text-[9px] md:text-[10px] text-zinc-300 font-medium">เว็บไซต์นี้สำหรับผู้ที่มีอายุ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </header>

    <main class="w-full relative z-20">
        <nav aria-label="ตัวกรองและหมวดหมู่" class="sticky top-14 md:top-20 z-40 bg-[#0A0014]/90 backdrop-blur-xl border-y border-[#3D1A5F] py-2.5 md:py-3 px-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div class="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar gap-2.5 items-center snap-x">
                <button aria-label="กรองข้อมูลล่าสุด" class="snap-start shrink-0 bg-white text-[#0A0014] px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-[0_0_10px_rgba(255,255,255,0.5)]">ล่าสุด</button>
                <button aria-label="กรองโปรไฟล์มาแรง" class="snap-start shrink-0 cyber-glass text-white px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap hover:shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:border-[#FF007F] transition-all flex items-center gap-1.5"><i class="fas fa-fire text-[#FF007F]" aria-hidden="true"></i> มาแรง</button>
                <button aria-label="เลือกโซนให้บริการ" class="snap-start shrink-0 cyber-glass text-white px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap hover:shadow-[0_0_15px_rgba(112,0,255,0.4)] hover:border-[#7000FF] transition-all flex items-center gap-1.5"><i class="fas fa-map-marker-alt text-[#7000FF]" aria-hidden="true"></i> เลือกโซน <i class="fas fa-chevron-down text-[10px] ml-1 opacity-50" aria-hidden="true"></i></button>
                <button aria-label="ราคาต่ำกว่า 2000 บาท" class="snap-start shrink-0 cyber-glass text-white px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap hover:border-white/30 transition-all">&lt; 2,000 ฿</button>
                <button aria-label="ราคา 2000 ถึง 3500 บาท" class="snap-start shrink-0 cyber-glass text-white px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap hover:border-white/30 transition-all">2,000 - 3,500 ฿</button>
            </div>
        </nav>

        <section id="profiles-grid" aria-label="รายการโปรไฟล์น้องๆ" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 scroll-mt-24">
            <div class="flex items-end justify-between mb-6 md:mb-8">
                <div>
                    <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight font-orbitron text-neon">น้องๆ ไซด์ไลน์${escapeHTML(provinceName)} พร้อมดูแลคุณ</h2>
                    <p class="text-zinc-300 text-[10px] md:text-sm font-light mt-1">อัปเดตล่าสุด: ${CURRENT_MONTH} ${CURRENT_YEAR}</p>
                </div>
                <div class="text-[10px] md:text-xs text-[#00F3FF] flex items-center gap-1.5 cyber-glass px-2.5 py-1 rounded-full border border-[#00F3FF]/30 shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#00F3FF] inline-block animate-pulse shadow-[0_0_5px_#00F3FF]" aria-hidden="true"></span> สดใหม่: ${new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}
                </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 lg:gap-6">
                ${cardsHTML}
            </div>
            
            ${safeProfiles.length >= 80 ? `
            <div class="mt-12 md:mt-16 text-center">
                <a href="/search?province=${provinceKey}" aria-label="โหลดโปรไฟล์เพิ่มเติม" class="inline-flex items-center gap-2 cyber-glass text-white px-8 py-3.5 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] hover:border-[#FF007F] transition-all uppercase tracking-widest font-orbitron group">
                    LOAD MORE <i class="fas fa-arrow-down text-[#FF007F] group-hover:translate-y-1 transition-transform" aria-hidden="true"></i>
                </a>
            </div>` : ''}
        </section>

        <div class="max-w-7xl mx-auto">
            ${generateAppSeoText(provinceName, provinceKey, safeProfiles.length)}
        </div>
    </main>

    <footer class="bg-[#0A0014] border-t border-[#3D1A5F] pt-12 pb-24 md:pb-12 text-left relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                <div class="md:col-span-5 space-y-5">
                    <img src="/images/logo-sidelinechiangmai.webp" alt="โลโก้ ${CONFIG.BRAND_NAME}" class="h-8 w-auto brightness-200" width="168" height="28" loading="lazy" style="filter: drop-shadow(0 0 5px rgba(255,0,127,0.3));">
                    <p class="text-sm text-zinc-300 leading-relaxed font-light max-w-sm">
                        คลับพักผ่อนระดับพรีเมียม ศูนย์รวมนางแบบและเพื่อนเที่ยวที่ปลอดภัย เราคัดกรองโปรไฟล์อย่างเข้มงวดและรักษาความลับลูกค้าเป็นอันดับหนึ่ง
                    </p>
                </div>

                <nav aria-label="ลิงก์ส่วนต่างๆ ภายในเว็บ" class="md:col-span-3">
                    <h3 class="text-[#FF007F] text-sm font-bold mb-6 tracking-widest uppercase font-orbitron text-neon">Explore</h3>
                    <ul class="space-y-4 text-sm font-medium text-zinc-300">
                        <li><a href="/profiles.html" class="hover:text-[#FF007F] hover:text-shadow-[0_0_10px_rgba(255,0,127,0.8)] transition-all">ค้นหาน้องๆ VIP</a></li>
                        <li><a href="/locations.html" class="hover:text-[#FF007F] hover:text-shadow-[0_0_10px_rgba(255,0,127,0.8)] transition-all">โซนให้บริการ</a></li>
                        <li><a href="/faq.html" class="hover:text-[#FF007F] hover:text-shadow-[0_0_10px_rgba(255,0,127,0.8)] transition-all">ขั้นตอนการจอง</a></li>
                        <li><a href="/about.html" class="hover:text-[#FF007F] hover:text-shadow-[0_0_10px_rgba(255,0,127,0.8)] transition-all">เกี่ยวกับเรา</a></li>
                        <li><a href="/blog.html" class="hover:text-[#FF007F] hover:text-shadow-[0_0_10px_rgba(255,0,127,0.8)] transition-all">บทความน่ารู้</a></li>
                    </ul>
                </nav>

                <nav aria-label="พื้นที่ให้บริการทั้งหมด" class="md:col-span-4">
                    <h3 class="text-[#A855F7] text-sm font-bold mb-6 tracking-widest uppercase font-orbitron">จังหวัดที่มีน้องๆรับงาน</h3>
                    <ul class="flex flex-col gap-3 text-sm font-medium text-zinc-100 h-[180px] overflow-y-auto pr-3 custom-scrollbar">
                        ${allProvinces.map(p => `
                            <li>
                                <a href="/location/${p.key}" class="hover:text-[#00F3FF] hover:text-shadow-[0_0_10px_rgba(0,243,255,0.8)] transition-all flex items-center justify-between group">
                                    <div class="flex items-center gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full bg-[#3D1A5F] group-hover:bg-[#00F3FF] group-hover:shadow-[0_0_8px_#00F3FF] transition-all" aria-hidden="true"></span>
                                        รับงาน${escapeHTML(p.nameThai)}
                                    </div>
                                    <i class="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#00F3FF]" aria-hidden="true"></i>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </nav>
            </div>

            <div class="border-t border-[#3D1A5F] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <p class="text-[10px] md:text-xs text-zinc-100 uppercase tracking-widest font-medium font-orbitron">&copy; ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. All rights reserved.</p>
                <div class="flex gap-6 text-[10px] md:text-xs text-zinc-100 font-medium uppercase tracking-widest justify-center font-orbitron">
                    <a href="/privacy-policy.html" class="hover:text-[#00F3FF] transition-colors">Privacy</a>
                    <a href="/terms.html" class="hover:text-[#00F3FF] transition-colors">Terms</a>
                </div>
            </div>
            
            <p class="mt-6 text-[10px] text-zinc-300 leading-relaxed font-light text-center">
                แพลตฟอร์มนี้เป็นเพียงสื่อกลางข้อมูล การติดต่อและชำระเงินเกิดขึ้นระหว่างลูกค้าและผู้ให้บริการโดยตรง จัดทำขึ้นสำหรับผู้มีอายุ 20 ปีขึ้นไปเท่านั้น
            </p>
        </div>
    </footer>

    <nav aria-label="เมนูนำทางหลักบนมือถือ" class="fixed bottom-0 left-0 w-full md:hidden z-50 pb-[env(safe-area-inset-bottom)]" style="background: rgba(10, 0, 20, 0.95); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid #3D1A5F; box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5);">
        <ul class="flex items-center justify-around h-[65px] px-2 m-0 list-none">
            <li class="w-full h-full">
                <a href="/" class="flex flex-col items-center justify-center w-full h-full text-zinc-400 hover:text-[#00F3FF] transition-all">
                    <i class="fas fa-home text-[20px] mb-1" aria-hidden="true"></i>
                    <span class="text-[9px] font-medium tracking-wide">หน้าแรก</span>
                </a>
            </li>
            <li class="w-full h-full">
                <a href="/profiles.html" class="flex flex-col items-center justify-center w-full h-full text-[#FF007F]">
                    <i class="fas fa-gem text-[20px] mb-1 drop-shadow-[0_0_10px_rgba(255,0,127,0.8)] animate-pulse" aria-hidden="true"></i>
                    <span class="text-[9px] font-bold tracking-wide font-orbitron text-neon">VIP</span>
                </a>
            </li>
            <li class="w-full h-full relative">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="ติดต่อแอดมินเพื่อจองคิว" class="flex flex-col items-center justify-center w-full h-full group absolute -top-8 left-0">
                    <div class="w-14 h-14 btn-neon rounded-full flex items-center justify-center text-white group-active:scale-95 transition-transform border-[4px] border-[#0A0014] shadow-[0_0_20px_rgba(255,0,127,0.6)]">
                        <i class="fab fa-line text-[26px]" aria-hidden="true"></i>
                    </div>
                    <span class="text-[10px] font-bold text-white mt-1 uppercase tracking-wider font-orbitron" style="text-shadow: 0 0 5px #FF007F;">จองคิว</span>
                </a>
            </li>
            <li class="w-full h-full">
                <a href="/locations.html" class="flex flex-col items-center justify-center w-full h-full text-zinc-400 hover:text-[#7000FF] transition-all">
                    <i class="fas fa-map-marker-alt text-[20px] mb-1" aria-hidden="true"></i>
                    <span class="text-[9px] font-medium tracking-wide">พื้นที่</span>
                </a>
            </li>
            <li class="w-full h-full">
                <a href="/search" class="flex flex-col items-center justify-center w-full h-full text-zinc-400 hover:text-white transition-all">
                    <i class="fas fa-search text-[20px] mb-1" aria-hidden="true"></i>
                    <span class="text-[9px] font-medium tracking-wide">ค้นหา</span>
                </a>
            </li>
        </ul>
    </nav>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        let lastScrollY = window.scrollY;
        const navbar = document.getElementById('navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                if (window.scrollY > lastScrollY) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        }, { passive: true });

        const menuBtn = document.getElementById('menu-btn');
        const closeBtn = document.getElementById('close-menu-btn');
        const sidebar = document.getElementById('sidebar-menu');
        const overlay = document.getElementById('sidebar-overlay');

        function toggleMenu(show) {
            if (!sidebar || !overlay || !menuBtn) return;
            if (show) {
                overlay.classList.remove('hidden');
                void overlay.offsetWidth; 
                overlay.classList.remove('opacity-0');
                sidebar.classList.remove('translate-x-full');
                document.body.style.overflow = 'hidden';
                menuBtn.setAttribute('aria-expanded', 'true');
            } else {
                overlay.classList.add('opacity-0');
                sidebar.classList.add('translate-x-full');
                document.body.style.overflow = '';
                menuBtn.setAttribute('aria-expanded', 'false');
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        }

        if(menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
        if(closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
        if(overlay) overlay.addEventListener('click', () => toggleMenu(false));
        
        const faqContainer = document.getElementById('faq-accordion');
        if (faqContainer) {
            const faqItems = faqContainer.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const questionButton = item.querySelector('.faq-question');
                const answerPanel = item.querySelector('.faq-answer');
                
                if (questionButton && answerPanel) {
                    questionButton.addEventListener('click', () => {
                        const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';
                        
                        faqItems.forEach(i => {
                            const qBtn = i.querySelector('.faq-question');
                            const aPan = i.querySelector('.faq-answer');
                            const icon = qBtn.querySelector('i');
                            
                            if(qBtn) qBtn.setAttribute('aria-expanded', 'false');
                            if(aPan) aPan.style.maxHeight = '0px';
                            if(icon) icon.style.transform = 'rotate(0deg)';
                        });
                        
                        if (!isExpanded) {
                            questionButton.setAttribute('aria-expanded', 'true');
                            answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
                            const currentIcon = questionButton.querySelector('i');
                            if(currentIcon) currentIcon.style.transform = 'rotate(180deg)';
                        }
                    });
                }
            });
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px', 
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        const profileCards = document.querySelectorAll('#profiles-grid article');
        profileCards.forEach(card => {
            card.style.animationPlayState = 'paused';
            card.style.opacity = '0'; 
            observer.observe(card);
        });
        
        const contentSections = document.querySelectorAll('.cyber-glass.p-6, [class*="rounded-[2.5rem]"]');
        
        contentSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            section.style.transitionDelay = ((index % 3) * 150) + 'ms';
            
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -100px 0px' });
            
            sectionObserver.observe(section);
        });
    });
</script>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "Content-Type": "text/html; charset=utf-8", 
                "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=3600" 
            } 
        });
    } catch (e) {
        return new Response('<div style="font-family:sans-serif;text-align:center;padding:50px;color:#fff;background:#0A0014;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="width:50px;height:50px;border:3px solid #3D1A5F;border-top-color:#FF007F;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:15px;box-shadow:0 0 15px rgba(255,0,127,0.5);"></div><style>@keyframes spin { 100% { transform: rotate(360deg); } }</style><h1 style="font-size:18px;font-weight:bold;color:#FF007F;text-shadow:0 0 10px rgba(255,0,127,0.5);letter-spacing:2px;font-family:\'Orbitron\', sans-serif;">SYSTEM INITIALIZING</h1></div>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
}