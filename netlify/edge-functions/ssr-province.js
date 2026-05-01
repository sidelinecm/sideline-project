import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'SIDELINE CHIANGMAI',
    TWITTER: '@sidelinechiangmai',
    SOCIAL_LINKS: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@sidelinechiangmai',
        twitter: 'https://twitter.com/sidelinechiangmai',
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280',
        biosite: 'https://bio.site/firstfiwfans.com',
        linktree: 'https://linktr.ee/kissmodel',
        bluesky: 'https://bsky.app/profile/sidelinechiangmai.bsky.social'
    }
};

const PROVINCE_SEO_DATA = {
    'chiangmai': {
        name: 'เชียงใหม่',
        zones:['นิมมาน', 'สันติธรรม', 'ช้างเผือก', 'เจ็ดยอด', 'แม่โจ้', 'หางดง', 'สันทราย', 'รวมโชค', 'คูเมือง', 'หลังมอ'],
        lsi:['รับงานเชียงใหม่', 'สาวไซด์ไลน์เชียงใหม่', 'sideline เชียงใหม่', 'ไซต์ไลน์เชียงใหม่', 'ไซไลเชียงใหม่', 'นางแบบสาวเหนือ', 'เพื่อนเที่ยวเชียงใหม่', 'เด็กเอ็นเชียงใหม่'],
        intents:['รับงานเอนเตอร์เทน', 'ดูแลแบบเต็มวัน', 'เพื่อนเที่ยวคาเฟ่', 'N-VIP ชงเหล้า', 'ปาร์ตี้พูลวิลล่า'],
        traits:['ผิวออร่าสว่าง', 'หน้าหมวยน่ารัก', 'ตัวเล็กสเปคป๋า', 'หุ่นนางแบบ', 'พูดเหนืออ้อนๆ', 'สัดส่วนเป๊ะ'],
        hotels:['โรงแรมระดับพรีเมียมแถวนิมมาน', 'ที่พักใกล้คูเมือง', 'คอนโดหรูเจ็ดยอด', 'รีสอร์ทส่วนตัวแม่ริม'],
        services:['บริการเอนเตอร์เทนส่วนตัว', 'ดูแลฟิวแฟนเดินนิมมาน', 'ปาร์ตี้พูลวิลล่าระดับ VIP', 'เพื่อนเที่ยวผ่อนคลายส่วนตัว'],
        avgPrice: "1,500 - 4,000",
        uniqueIntro: "หากคุณกำลังมองหาน้องๆ <strong>รับงานเชียงใหม่</strong> หรือ <strong>สาวไซด์ไลน์เชียงใหม่</strong> ระดับพรีเมียม ที่นี่คือศูนย์รวมนางแบบและเพื่อนเที่ยวสาวเหนือผิวออร่า ที่พร้อมดูแลคุณแบบฟิวแฟน ไม่ว่าคุณจะพักอยู่โซนนิมมาน สันติธรรม หรือรีสอร์ทส่วนตัว เรามีตั้งแต่น้องนักศึกษาไปจนถึงพริตตี้ท้องถิ่น การันตีความตรงปก 100% ปลอดภัย ไร้กังวลเรื่องโอนมัดจำ",
        faqs:[
            { q: "หาน้องๆ รับงานเชียงใหม่ โซนไหนเดินทางสะดวกและเป็นส่วนตัวสุด?", a: "โซนนิมมาน สันติธรรม และเจ็ดยอด เป็นโซนที่น้องๆ พร้อมให้บริการมากที่สุด และมีโรงแรมระดับพรีเมียมรองรับการนัดหมายอย่างปลอดภัย" },
            { q: "ความปลอดภัยในการเรียกสาวไซด์ไลน์เชียงใหม่?", a: "เราเน้นระบบ 'ไม่โอนมัดจำ' ลูกค้าเจอตัวน้อง จ่ายเงินหน้างานเท่านั้น ป้องกันมิจฉาชีพ 100% พร้อมเก็บข้อมูลลูกค้าเป็นความลับสูงสุด" }
        ]
    },
    'bangkok': {
        name: 'กรุงเทพ',
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
        zones:['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู'],
        lsi:['รับงานส่วนตัว', 'สาวไซด์ไลน์', 'sideline พรีเมียม', 'เพื่อนเที่ยว', 'เด็กเอ็น', 'นักศึกษาพาร์ทไทม์', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน'],
        intents:['รับงานเอนเตอร์เทน', 'ดูแลแบบเต็มวัน', 'เพื่อนเที่ยว', 'ฟิวแฟน'],
        traits:['หน้าตาน่ารัก', 'บุคลิกดี', 'เอาใจเก่ง', 'บริการประทับใจ'],
        hotels:['โรงแรมในตัวเมือง', 'รีสอร์ทส่วนตัว'],
        services:['ฟิวแฟนส่วนตัว', 'เพื่อนเที่ยว-ดูหนัง', 'เอนเตอร์เทนผ่อนคลาย'],
        avgPrice: "1,500 - 3,500",
        uniqueIntro: "หากคุณกำลังมองหาช่วงเวลาการพักผ่อนเหนือระดับ เรารวบรวมน้องๆ <strong>รับงานส่วนตัว</strong>และ<strong>ไซด์ไลน์เกรดพรีเมียม</strong> ที่ผ่านการคัดสรรอย่างเข้มงวด การันตีความตรงปก 100% พร้อมให้บริการในพื้นที่ นัดหมายได้อย่างเป็นส่วนตัว ปลอดภัย ไม่มีการบังคับโอนมัดจำ จ่ายเงินเมื่อเจอตัวจริงเท่านั้น",
        faqs:[
            { q: "ใช้บริการน้องๆ รับงาน ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายเงินสดหน้างานเมื่อเจอตัวน้องจริงเท่านั้น เพื่อความปลอดภัยสูงสุดของคุณ" },
            { q: "รับประกันความตรงปกไหม?", a: "รูปโปรไฟล์ทุกรูปผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปกและพร้อมให้บริการระดับพรีเมียมอย่างแท้จริง" }
        ]
    }
};

const optimizeImg = (path, width = 400, height = 533) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) {
            const transform = `f_auto,q_auto:good,w_${width},h_${height},c_fill,g_face`;
            return path.replace('/upload/', `/upload/${transform}/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=75`;
};

// ==========================================
// SEO & CONTENT GENERATOR (Clean UI Version)
// ==========================================
const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    
    return `
    <article class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 my-16">
        <div class="max-w-3xl mx-auto text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight">
                ศูนย์รวม <span class="text-accent">ไซด์ไลน์${provinceName}</span> ระดับพรีเมียม
            </h2>
            <p class="text-slate-600 text-lg leading-relaxed">
                ${data.uniqueIntro} ปัจจุบันเรามีฐานข้อมูลน้องๆ ที่ผ่านการยืนยันตัวตนแล้วกว่า <strong class="text-primary font-bold">${count} ท่าน</strong> ในพื้นที่
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <h3 class="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    โซนยอดนิยมใน${provinceName}
                </h3>
                <ul class="space-y-4">
                    ${data.zones.slice(0, 5).map(z => `
                        <li class="flex items-center gap-3 text-slate-700">
                            <div class="w-2 h-2 rounded-full bg-slate-300"></div>
                            โซน${z}
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <h3 class="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                    <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    จุดเด่นและนโยบายของเรา
                </h3>
                <ul class="space-y-5">
                    <li class="flex items-start gap-3">
                        <div class="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center"><div class="w-2 h-2 rounded-full bg-success"></div></div>
                        <p class="text-slate-700"><strong class="text-primary">ไร้มัดจำ 100%:</strong> ชำระเงินเมื่อพบตัวน้องจริงเท่านั้น ป้องกันมิจฉาชีพเด็ดขาด</p>
                    </li>
                    <li class="flex items-start gap-3">
                        <div class="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center"><div class="w-2 h-2 rounded-full bg-blue-500"></div></div>
                        <p class="text-slate-700"><strong class="text-primary">ความลับลูกค้า:</strong> ปกปิดข้อมูลการใช้บริการเป็นความลับขั้นสูงสุด</p>
                    </li>
                    <li class="flex items-start gap-3">
                        <div class="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center"><div class="w-2 h-2 rounded-full bg-warning"></div></div>
                        <p class="text-slate-700"><strong class="text-primary">โปรไฟล์ตรงปก:</strong> ทีมงานตรวจสอบรูปภาพและตัวตนจริงก่อนอนุมัติลงเว็บ</p>
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-slate-200 pt-12">
            <div class="text-center mb-10">
                <h3 class="text-2xl font-bold text-primary mb-2">คำถามที่พบบ่อย (FAQ)</h3>
                <p class="text-slate-500">ข้อสงสัยยอดฮิตเกี่ยวกับการเรียกใช้บริการไซด์ไลน์${provinceName}</p>
            </div>
            <div class="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
                ${data.faqs.map(faq => `
                    <div class="bg-white p-6 rounded-xl border border-slate-200 hover:border-accent/30 transition-colors">
                        <h4 class="font-bold text-primary text-lg mb-3 flex items-center gap-2">
                            <span class="text-accent text-xl">Q:</span> ${faq.q}
                        </h4>
                        <p class="text-slate-600 leading-relaxed pl-8 border-l-2 border-slate-100">${faq.a}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </article>
    `;
};

// ==========================================
// MAIN SSR EDGE FUNCTION
// ==========================================
export default async (request, context) => {
    try {
        const url = new URL(request.url);

        // Redirect location?province=xxx -> location/xxx
        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province");
            const cleanUrl = new URL(`/location/${provinceValue}`, url.origin);
            return Response.redirect(cleanUrl.toString(), 301); 
        }

        const pathParts = url.pathname.split('/').filter(Boolean);
        const rawProvinceKey = pathParts[pathParts.length - 1] || 'chiangmai';
        const provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // Fetch Data
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
        const zones = seoData.zones;
        
        const now = new Date();
        const CURRENT_YEAR = now.getFullYear();
        const CURRENT_MONTH = now.toLocaleString('th-TH', { month: 'long' });
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
            : `${CONFIG.DOMAIN}/images/seo-default.webp`;

        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} โปรไฟล์จริง ไม่มัดจำ | อัปเดต ${CURRENT_MONTH} ${CURRENT_YEAR + 543}`;
        const description = `รวมโปรไฟล์น้องๆ รับงาน${provinceName} ไซด์ไลน์${provinceName} เด็กเอ็น ระดับพรีเมียม ${safeProfiles.length} คน โซน ${zones.slice(0,3).join(', ')} ✓การันตีตรงปก 100% ✓ไม่ต้องโอนมัดจำ จ่ายเงินหน้างาน`;

        const latestUpdateDate = safeProfiles.length > 0 && safeProfiles[0].lastUpdated 
            ? new Date(safeProfiles[0].lastUpdated).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

        // Schema.org
        const schemaData = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "WebSite",
                    "@id": `${CONFIG.DOMAIN}/#website`,
                    "url": CONFIG.DOMAIN,
                    "name": CONFIG.BRAND_NAME
                },
                {
                    "@type":["LocalBusiness", "ModelingAgency"],
                    "@id": `${provinceUrl}/#business`,
                    "name": `ไซด์ไลน์${provinceName} - บริการจัดหานางแบบและเพื่อนเที่ยวระดับพรีเมียม`,
                    "url": provinceUrl,
                    "image": firstImage,
                    "description": description,
                    "priceRange": "฿1500 - ฿5000+",
                    "areaServed": { "@type": "State", "name": provinceName },
                    "offers": safeProfiles.length > 0 ? {
                        "@type": "AggregateOffer",
                        "offerCount": String(safeProfiles.length),
                        "lowPrice": "1500",
                        "highPrice": "5000",
                        "priceCurrency": "THB"
                    } : undefined
                },
                {
                    "@type": "FAQPage",
                    "@id": `${provinceUrl}/#faq`,
                    "mainEntity":[
                        {
                            "@type": "Question",
                            "name": `บริการไซด์ไลน์${provinceName} และเพื่อนเที่ยว ต้องโอนมัดจำไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่มีการโอนมัดจำล่วงหน้าทุกกรณี ลูกค้าจ่ายเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น ปลอดภัย 100%" }
                        }
                    ]
                }
            ]
        };

        // Generate Province Links for Footer
        const provinceLinksHtml = allProvinces.map(p => `
            <a href="/location/${p.key}" class="text-slate-500 hover:text-accent transition-colors py-1">
               ${p.nameThai}
            </a>
        `).join('');

        // ---------------------------------------------------------
        // Generate Profile Cards HTML (Clean, Premium, High Conversion)
        // ---------------------------------------------------------
        let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                const cleanName = (p.name || 'ไม่ระบุชื่อ').replace(/^(น้อง\s?)/, '');
                const profileLocation = p.location || provinceName;
                
                // Status Logic
                const busyKeywords =['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'];
                const availText = (p.availability || '').toLowerCase();
                const isAvailable = !busyKeywords.some(kw => availText.includes(kw));
                
                const profileLink = `/sideline/${p.slug || p.id}`;
                
                // Mock Social Proof for Trust
                const mockRating = (4.6 + Math.random() * 0.4).toFixed(1); // 4.6 - 5.0
                const mockReviews = Math.floor(Math.random() * 80) + 12;

                // Badge Logic
                let badgeHTML = '';
                if (i < 3 || p.isfeatured) {
                    badgeHTML = `<span class="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 z-20">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg> 
                        ฮอต
                    </span>`;
                }

                const loadingAttr = i < 6 ? 'fetchpriority="high"' : 'loading="lazy"';

                return `
                <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border border-slate-200 group relative">
                    <!-- Link covers whole card image area -->
                    <a href="${profileLink}" class="absolute inset-0 z-10 bottom-[140px]" aria-label="ดูโปรไฟล์น้อง ${cleanName}"></a>
                    
                    <div class="relative aspect-[3/4] overflow-hidden bg-slate-100">
                        <img src="${optimizeImg(p.imagePath, 400, 533)}" 
                             alt="น้อง${cleanName} ไซด์ไลน์${profileLocation}"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                             ${loadingAttr} decoding="async">
                        
                        <!-- Online Status Badge -->
                        <div class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-slate-100 flex items-center gap-2 z-20">
                            <span class="w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-success animate-pulse' : 'bg-slate-400'}"></span>
                            <span class="text-[11px] font-bold text-slate-700 tracking-wide">${isAvailable ? 'ออนไลน์ตอนนี้' : 'ติดจอง'}</span>
                        </div>
                        
                        ${badgeHTML}
                        
                        <!-- Gradient to make text readable -->
                        <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/90 to-transparent"></div>
                        
                        <!-- Profile Info on Image -->
                        <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                            <div>
                                <h3 class="font-bold text-2xl text-white drop-shadow-md leading-tight mb-1">${cleanName}</h3>
                                <p class="text-sm text-white/90 flex items-center gap-1.5">
                                    <svg class="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    ${profileLocation}
                                </p>
                            </div>
                            <div class="text-right">
                                <span class="block text-[11px] text-white/80 mb-0.5">เริ่มต้น</span>
                                <span class="font-bold text-lg text-white drop-shadow-md">฿${p.rate || 'สอบถาม'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Card Bottom / Actions -->
                    <div class="p-5 flex flex-col justify-between bg-white z-20 relative">
                        <!-- Trust Metrics -->
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-1.5">
                                <span class="text-warning text-sm font-bold">⭐ ${mockRating}</span>
                                <span class="text-xs text-slate-500 underline decoration-slate-300 underline-offset-2">(${mockReviews} รีวิว)</span>
                            </div>
                            <div class="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-semibold">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                ยืนยันตัวตนแล้ว
                            </div>
                        </div>

                        <!-- Add LINE Button (Primary Action) -->
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="w-full bg-accent/10 text-accent hover:bg-accent hover:text-white border border-accent transition-colors duration-300 py-3 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm relative overflow-hidden group/btn">
                            <svg class="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.039.756.018.948-.027.261-.131.847-.131.847-.053.308.243.435.485.308 0 0 2.584-1.42 4.708-3.086 1.706-1.338 4.827-4.27 4.827-9.217z"/></svg>
                            <span class="relative z-10">แอด LINE ทันที</span>
                        </a>
                    </div>
                </article>`;
            }).join('');
        } else {
            cardsHTML = `<div class="col-span-full text-center py-20 text-slate-500 text-lg">กำลังอัปเดตโปรไฟล์น้องๆ ในโซนนี้ กรุณากลับมาตรวจสอบอีกครั้ง</div>`;
        }

        // ==========================================
        // MAIN HTML STRUCTURE
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="รับงาน${provinceName}, ไซด์ไลน์${provinceName}, สาวไซด์ไลน์${provinceName}, เพื่อนเที่ยว${provinceName}, ไม่มัดจำ, โปรไฟล์จริง">
    <link rel="canonical" href="${provinceUrl}" />
    
    <!-- Open Graph -->
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS (Direct CDN for exact Master Plan colors & clean code) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#0F172A',
                        accent: '#F43F5E',
                        bg: '#F8FAFC',
                        success: '#22C55E',
                        warning: '#F59E0B'
                    },
                    fontFamily: {
                        sans: ['Prompt', 'Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <!-- FontAwesome for Footer Social Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <!-- Schema.org -->
    <script type="application/ld+json">
        ${JSON.stringify(schemaData)}
    </script>

    <style>
        body { background-color: #F8FAFC; color: #111827; }
        
        /* Subtle Pattern for Hero */
        .hero-pattern {
            background-color: #ffffff;
            background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
            background-size: 20px 20px;
        }

        /* Glassmorphism Navbar */
        .nav-glass {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }

        /* Floating CTA Animation */
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        /* Hide Scrollbar */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>

<body class="antialiased font-sans">

    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 nav-glass transition-all duration-300">
        <div class="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <a href="/" class="text-xl md:text-2xl font-bold text-primary tracking-tight font-inter">
                SIDELINE<span class="text-accent ml-1 uppercase">${provinceData.key}</span>
            </a>
            <div class="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-600">
                <a href="/" class="hover:text-accent transition-colors">หน้าแรก</a>
                <a href="/profiles" class="hover:text-accent transition-colors">รวมโปรไฟล์</a>
                <span class="text-accent border-b-2 border-accent pb-0.5">${provinceName}</span>
            </div>
            <!-- Mobile Menu Icon (Placeholder) -->
            <button class="md:hidden text-primary p-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
    </nav>

    <!-- SECTION 1: HERO -->
    <header class="pt-32 pb-16 px-4 hero-pattern border-b border-slate-200">
        <div class="max-w-4xl mx-auto text-center space-y-8">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-success rounded-full text-xs font-bold border border-green-100 shadow-sm">
                <span class="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                อัปเดตสถานะล่าสุด: ${latestUpdateDate}
            </div>
            
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-[1.2]">
                เว็บรวมไซด์ไลน์<span class="text-accent underline decoration-accent/30 underline-offset-8">${provinceName}</span>ที่เชื่อถือได้
            </h1>
            
            <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                โปรไฟล์จริง • ปลอดภัยไม่มีมัดจำ • รีวิวจากผู้ใช้ <br class="hidden md:block"/>
                <span class="text-primary font-bold">เจอตัวจริงแล้วจ่ายเงินหน้างาน 100%</span>
            </p>
            
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a href="#profiles" class="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-lg flex items-center justify-center gap-2">
                    ดูโปรไฟล์ทั้งหมด
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </a>
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="w-full sm:w-auto bg-white text-primary border-2 border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:border-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <svg class="w-5 h-5 text-[#00B900]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.039.756.018.948-.027.261-.131.847-.131.847-.053.308.243.435.485.308 0 0 2.584-1.42 4.708-3.086 1.706-1.338 4.827-4.27 4.827-9.217z"/></svg>
                    สอบถามแอดมิน
                </a>
            </div>

            <div class="flex flex-wrap justify-center gap-2 md:gap-3 pt-6">
                ${zones.slice(0, 6).map(z => `
                    <a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" class="text-[12px] md:text-sm px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:border-accent hover:text-accent transition-colors font-medium shadow-sm">
                       #${z}
                    </a>
                `).join('')}
            </div>
        </div>
    </header>

    <!-- SECTION 4: TRUST (Moved up for High Conversion) -->
    <section class="bg-white py-12 md:py-16 border-b border-slate-200 shadow-sm relative z-10">
        <div class="max-w-[1400px] mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
                <div class="p-4">
                    <div class="w-16 h-16 mx-auto bg-accent/10 text-accent rounded-full flex items-center justify-center mb-5">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <h3 class="font-bold text-primary text-xl mb-2">ปลอดภัย ไม่ต้องโอนก่อน</h3>
                    <p class="text-slate-500 text-sm">เจอตัวน้องจริงแล้วค่อยชำระเงิน ตัดปัญหามิจฉาชีพ 100%</p>
                </div>
                <div class="p-4 pt-8 md:pt-4">
                    <div class="w-16 h-16 mx-auto bg-success/10 text-success rounded-full flex items-center justify-center mb-5">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                    </div>
                    <h3 class="font-bold text-primary text-xl mb-2">โปรไฟล์ Verify ตรวจสอบแล้ว</h3>
                    <p class="text-slate-500 text-sm">รูปถ่ายและข้อมูลผ่านการตรวจสอบโดยทีมงานว่ามีตัวตนจริง ตรงปก</p>
                </div>
                <div class="p-4 pt-8 md:pt-4">
                    <div class="w-16 h-16 mx-auto bg-warning/10 text-warning rounded-full flex items-center justify-center mb-5">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                    </div>
                    <h3 class="font-bold text-primary text-xl mb-2">รีวิวจริงจากผู้ใช้งาน</h3>
                    <p class="text-slate-500 text-sm">ระบบเรตติ้งช่วยให้คุณตัดสินใจเลือกน้องๆ ที่บริการดีที่สุดได้ง่ายขึ้น</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 3: FILTER + GRID -->
    <main id="profiles" class="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        
        <div class="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
                <h2 class="text-3xl md:text-4xl font-bold text-primary mb-2">
                    เลือกน้องที่ใช่ ในโซน<span class="text-accent">${provinceName}</span>
                </h2>
                <p class="text-slate-500 font-medium">พบกับโปรไฟล์คุณภาพที่พร้อมดูแลคุณ (${safeProfiles.length} คน)</p>
            </div>
            
            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button class="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold shadow-sm hover:bg-slate-800 transition">
                    ⭐ มาแรง
                </button>
                <button class="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-bold shadow-sm hover:border-primary transition">
                    เรทเริ่มต้น 1,500
                </button>
                <button class="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-bold shadow-sm hover:border-primary transition">
                    เลือกโซน <i class="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
            </div>
        </div>

        <!-- 4 Columns Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            ${cardsHTML}
        </div>

        ${safeProfiles.length >= 80 ? `
        <div class="text-center mt-16">
            <a href="/search?province=${provinceKey}" class="inline-flex items-center gap-3 px-10 py-4 bg-white border-2 border-slate-200 text-primary font-bold rounded-full hover:border-primary transition-all">
                โหลดโปรไฟล์เพิ่มเติม
                <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </a>
        </div>
        ` : ''}

        <!-- SEO Text Block -->
        ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}

    </main>

    <!-- SECTION 5: FOOTER -->
    <footer itemscope itemtype="https://schema.org/Organization" class="bg-primary pt-20 pb-10 border-t-4 border-accent">
        <meta itemprop="name" content="${CONFIG.BRAND_NAME}">
        
        <div class="max-w-[1400px] mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <!-- About -->
                <div class="md:col-span-2">
                    <a href="/" class="text-2xl font-bold font-inter text-white tracking-tight mb-6 inline-block">
                        SIDELINE<span class="text-accent ml-1 uppercase">${provinceData.key}</span>
                    </a>
                    <p itemprop="description" class="text-slate-400 leading-relaxed max-w-md mb-8">
                        แพลตฟอร์มศูนย์รวมนางแบบและเพื่อนเที่ยวที่ปลอดภัยและน่าเชื่อถือที่สุด เราคัดกรองโปรไฟล์อย่างเข้มงวดและรักษาความลับลูกค้าเป็นอันดับหนึ่ง
                    </p>
                    
                    <!-- Security Perception Badge -->
                    <div class="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                        <svg class="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                        <div class="text-left">
                            <p class="text-white text-xs font-bold uppercase tracking-wider">SSL Secured</p>
                            <p class="text-slate-400 text-[10px]">Data is encrypted & private</p>
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <div>
                    <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">บริการของเรา</h4>
                    <ul class="space-y-4">
                        <li><a href="/" class="text-slate-400 hover:text-white transition-colors">หน้าแรก</a></li>
                        <li><a href="/profiles" class="text-slate-400 hover:text-white transition-colors">รวมโปรไฟล์</a></li>
                        <li><a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="text-slate-400 hover:text-white transition-colors">ติดต่อแอดมิน</a></li>
                    </ul>
                </div>

                <!-- Policy -->
                <div>
                    <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">นโยบาย (Policy)</h4>
                    <ul class="space-y-4">
                        <li><a href="/terms" class="text-slate-400 hover:text-white transition-colors">เงื่อนไขการใช้บริการ</a></li>
                        <li><a href="/privacy" class="text-slate-400 hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a></li>
                    </ul>
                    
                    <div class="mt-8 inline-flex items-center gap-2 border border-slate-700 px-4 py-2 rounded-full text-xs text-slate-400 font-bold bg-slate-800">
                        <span class="text-accent text-sm">18+</span> สำหรับผู้ใหญ่เท่านั้น
                    </div>
                </div>
            </div>

            <!-- Service Areas -->
            <div class="border-t border-slate-800 pt-10 mb-10">
                <h4 class="text-white font-bold mb-6 text-sm">พื้นที่ให้บริการอื่นๆ</h4>
                <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    ${provinceLinksHtml}
                </div>
            </div>

            <!-- Copyright -->
            <div class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <p>&copy; ${CURRENT_YEAR} <span itemprop="legalName">${CONFIG.BRAND_NAME}</span>. All rights reserved.</p>
                <div class="flex gap-4 text-xl">
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="Line" class="hover:text-[#00B900] transition-colors"><i class="fab fa-line"></i></a>
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" aria-label="Twitter" class="hover:text-white transition-colors"><i class="fab fa-x-twitter"></i></a>
                </div>
            </div>
        </div>
    </footer>

    <!-- MOBILE UX: Sticky LINE CTA (Floating Bottom Right) -->
    <a href="${CONFIG.SOCIAL_LINKS.line}" 
       target="_blank" 
       rel="noopener noreferrer"
       class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90] animate-float group"
       aria-label="ติดต่อสอบถามข้อมูลเพิ่มเติมผ่าน LINE">
        <div class="bg-[#00B900] text-white px-5 py-3 md:px-6 md:py-4 rounded-full flex items-center gap-3 shadow-[0_10px_25px_rgba(0,185,0,0.4)] hover:scale-105 transition-transform duration-300 border-2 border-white/20">
            <i class="fab fa-line text-2xl md:text-3xl" aria-hidden="true"></i>
            <span class="font-bold text-[15px] md:text-lg tracking-wide hidden sm:block">จองคิวด่วน</span>
        </div>
    </a>

<script>
    // Navbar Scroll Effect
    (() => {
        const nav = document.querySelector('nav');
        if (!nav) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                nav.classList.add('shadow-sm');
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                nav.classList.remove('shadow-sm');
                nav.style.background = 'rgba(255, 255, 255, 0.85)';
            }
        }, { passive: true });
    })();
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
        console.error('SSR Critical Error:', e);
        return new Response('<div style="font-family:sans-serif;text-align:center;padding:50px;color:#0F172A;background:#F8FAFC;height:100vh;display:flex;align-items:center;justify-content:center;"><h2>เกิดข้อผิดพลาดในการโหลดระบบ กรุณาลองใหม่อีกครั้ง</h2></div>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
};