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
        zones:['สุขุมวิท', 'รัชดา', 'ห้วยขวาง', 'ลาดพร้าว', 'สาทร', 'สีลม', 'ทองหล่อ', 'เอกมัย', 'ปิ่นเกล้า', 'บางนา', 'เลียบด่วน'],
        lsi:['รับงานกรุงเทพ', 'ไซด์ไลน์ กทม', 'สาวไซด์ไลน์กรุงเทพ', 'sideline bkk', 'พริตตี้ กทม.', 'เด็กเอ็นพรีเมียม', 'เพื่อนเที่ยวส่วนตัว', 'นางแบบรับงาน'],
        intents:['เอนเตอร์เทนรายชั่วโมง', 'ดูแลแบบเต็มวัน', 'Private VIP Entertain', 'เพื่อนเที่ยวทองหล่อ', 'ปาร์ตี้ไพรเวท'],
        traits:['ลูกคุณหนู', 'ลุคอินเตอร์สายฝอ', 'ใบหน้าเป๊ะ', 'หุ่นนางแบบ', 'ดูแลเอาใจเก่ง', 'ลุคพนักงานออฟฟิศ'],
        hotels:['คอนโดหรูติด BTS', 'โรงแรมย่านสุขุมวิท', 'ที่พักพรีเมียมห้วยขวาง', 'โรงแรมหรูย่านสาทร'],
        services:['ดูแลแบบฟิวแฟนเต็มรูปแบบ', 'เพื่อนเที่ยวกลางคืนทองหล่อ', 'บริการ N-Vip ส่วนตัว'],
        avgPrice: "2,000 - 5,000+",
        uniqueIntro: "เมืองหลวงแห่งแสงสี ที่นี่คือศูนย์รวมตัวท็อปพรีเมียมที่สุดของประเทศ บริการ<strong>รับงานกรุงเทพ</strong>และ<strong>ไซด์ไลน์ กทม.</strong> ครอบคลุมตั้งแต่สุขุมวิท ทองหล่อ ยันรัชดา นัดง่าย เดินทางสะดวกด้วย BTS/MRT คัดเน้นๆ เฉพาะงานคุณภาพระดับ VIP ปลอดภัย จ่ายเงินหน้างาน ไร้กังวลเรื่องมิจฉาชีพ",
        faqs:[
            { q: "น้องๆ รับงานกรุงเทพ ส่วนใหญ่สะดวกโซนไหน?", a: "โซนยอดฮิตคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ นัดหมายตามคอนโดหรือโรงแรมหรูติดรถไฟฟ้าได้สะดวกและเป็นส่วนตัว" },
            { q: "เรียกเด็กเอ็น หรือ ไซด์ไลน์ กทม. ต้องมัดจำไหม?", a: "เพื่อความสบายใจสูงสุดของลูกค้า เราใช้ระบบเจอตัวจริงแล้วค่อยชำระเงิน ไม่มีการบังคับโอนมัดจำล่วงหน้าทุกกรณี" }
        ]
    },
    'lampang': {
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
        zones:['ตัวเมือง', 'พื้นที่ใกล้เคียง', 'โซนยอดฮิต', 'โรงแรมชั้นนำ', 'คอนโดหรู'],
        lsi:['รับงานส่วนตัว', 'สาวไซด์ไลน์', 'sideline พรีเมียม', 'เพื่อนเที่ยว', 'เด็กเอ็น', 'นักศึกษาพาร์ทไทม์', 'สาวสวยตรงปก', 'ดูแลฟิวแฟน'],
        intents:['รับงานเอนเตอร์เทน', 'ดูแลแบบเต็มวัน', 'เพื่อนเที่ยว', 'ฟิวแฟน'],
        traits:['หน้าตาน่ารัก', 'บุคลิกดี', 'เอาใจเก่ง', 'บริการประทับใจ'],
        hotels: ['โรงแรมในตัวเมือง', 'รีสอร์ทส่วนตัว'],
        services:['ฟิวแฟนส่วนตัว', 'เพื่อนเที่ยว-ดูหนัง', 'เอนเตอร์เทนผ่อนคลาย'],
        avgPrice: "1,500 - 3,500",
        uniqueIntro: "หากคุณกำลังมองหาช่วงเวลาการพักผ่อนเหนือระดับ เรารวบรวมน้องๆ <strong>รับงานส่วนตัว</strong>และ<strong>ไซด์ไลน์เกรดพรีเมียม</strong> ที่ผ่านการคัดสรรอย่างเข้มงวด การันตีความตรงปก 100% พร้อมให้บริการในพื้นที่ นัดหมายได้อย่างเป็นส่วนตัว ปลอดภัย ไม่มีการบังคับโอนมัดจำ จ่ายเงินเมื่อเจอตัวจริงเท่านั้น",
        faqs:[
            { q: "ใช้บริการน้องๆ รับงาน ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายเงินสดหน้างานเมื่อเจอตัวน้องจริงเท่านั้น เพื่อความปลอดภัยสูงสุดของคุณ" },
            { q: "รับประกันความตรงปกไหม?", a: "รูปโปรไฟล์ทุกรูปผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปกและพร้อมให้บริการระดับพรีเมียมอย่างแท้จริง" }
        ]
    }
};

const optimizeImg = (path, width = 600, height = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) {
            const transform = `f_auto,q_auto:best,w_${width},h_${height},c_fill,g_face`;
            return path.replace('/upload/', `/upload/${transform}/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=85`;
};

const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    
    const priceRange = data.avgPrice || "1,500 - 3,500";
    const priceParts = priceRange.split('-');
    const startPrice = priceParts[0] ? priceParts[0].trim() : "1,500";
    const endPrice = priceParts[1] ? priceParts[1].trim() : "3,500";

    const otherProvinces = Object.keys(PROVINCE_SEO_DATA)
        .filter(key => key !== provinceKey && key !== 'default')
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    const summaries = [
        `รวบรวมโปรไฟล์น้องๆ งานดีระดับ Top Class ใน${provinceName} ไว้ที่นี่ที่เดียว`,
        `บริการเพื่อนเที่ยวและเอนเตอร์เทนระดับพรีเมียม ครอบคลุมโซน${data.zones[0]} และพื้นที่ใกล้เคียง`,
        `คัดเน้นๆ เฉพาะนางแบบและพริตตี้คุณภาพ การันตีความตรงปกและมารยาทการบริการสูงสุด`
    ];
    const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];

    return `
    <article class="text-left space-y-16 text-gray-300 leading-loose font-light px-4 md:px-12 pb-20">
        
        <section class="text-center max-w-5xl mx-auto pt-10">
            <h2 class="text-2xl md:text-5xl font-serif text-white mb-6 tracking-wider">
                ศูนย์รวม <span class="text-gold italic underline decoration-gold/40 underline-offset-8">ไซด์ไลน์${provinceName}</span> ระดับพรีเมียม
            </h2>
            <div class="flex items-center justify-center gap-4 mb-8">
                <div class="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold"></div>
                <span class="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">The Ultimate Experience</span>
                <div class="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold"></div>
            </div>
            <p class="text-base md:text-lg md:leading-relaxed text-white max-w-3xl mx-auto italic">
                "${data.uniqueIntro}"
            </p>
        </section>

        <section class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div class="lg:col-span-2 bg-white/[0.05] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h3 class="text-xl font-serif text-gold mb-6 flex items-center gap-3 text-left">
                    <i class="fas fa-chart-line text-sm opacity-70"></i>
                    บทวิเคราะห์ตลาดและเรทราคาใน${provinceName}
                </h3>
                <div class="space-y-6 text-left">
                    <p class="text-sm text-gray-200">ปัจจุบันเรามีฐานข้อมูลน้องๆ <strong class="text-white">${count} ท่าน</strong> ที่พร้อมให้บริการในเขต${provinceName} โดยแบ่งตามประเภทงานดังนี้:</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="p-4 rounded-2xl bg-black/60 border border-white/10 group hover:border-gold transition-all">
                            <span class="text-xs text-gray-400 block mb-1">เริ่มต้น (Standard)</span>
                            <div class="flex justify-between items-end">
                                <span class="text-white text-sm italic">${data.lsi[0] || 'สายรับงาน'}</span>
                                <span class="text-gold font-serif text-lg font-bold">฿${startPrice}++</span>
                            </div>
                        </div>
                        <div class="p-4 rounded-2xl bg-black/60 border border-white/10 group hover:border-gold transition-all">
                            <span class="text-xs text-gray-400 block mb-1">พรีเมียม (High-End)</span>
                            <div class="flex justify-between items-end">
                                <span class="text-white text-sm italic">นางแบบ / VIP</span>
                                <span class="text-gold font-serif text-lg font-bold">฿${endPrice}++</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 items-center bg-gold/10 p-4 rounded-xl border border-gold/20 shadow-lg">
                        <i class="fas fa-shield-alt text-gold text-lg"></i>
                        <p class="text-[11px] leading-relaxed text-white">
                            <strong class="text-gold">นโยบายความปลอดภัย:</strong> เว็บไซต์ของเราเน้นย้ำระบบ <span class="underline decoration-gold font-bold">"ไม่โอนมัดจำก่อนเจอตัว"</span> เพื่อป้องกันมิจฉาชีพ 100%
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-gold/10 border border-gold/20 rounded-3xl p-8 flex flex-col justify-center text-center relative overflow-hidden group">
                <h4 class="text-white font-serif text-lg mb-4 relative z-10 font-bold">พร้อมสัมผัสประสบการณ์?</h4>
                <p class="text-xs text-gray-200 mb-8 leading-relaxed relative z-10">คัดกรองน้องๆ ที่ตรงสเปคคุณที่สุดใน${provinceName} ทักสอบถามคิวงานได้ตลอด 24 ชม.</p>
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="relative z-10 block w-full py-4 bg-gold text-black font-bold rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-xl active:scale-95">
                    <i class="fab fa-line mr-2"></i> จองคิวน้องๆ ทันที
                </a>
            </div>
        </section>

        <section>
            <div class="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div class="max-w-xl text-left">
                    <h3 class="text-2xl font-serif text-white mb-4 italic">คู่มือโซนยอดนิยม (Hyper-Local Guide)</h3>
                    <p class="text-sm text-gray-400">${randomSummary}</p>
                </div>
                <div class="text-[10px] uppercase tracking-widest text-gold font-bold border-b border-gold/40 pb-2">
                    Verified Locations in ${provinceName}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${data.zones.slice(0, 6).map((zone, idx) => `
                    <div class="group relative overflow-hidden bg-white/[0.03] border border-white/10 p-6 rounded-2xl hover:bg-white/[0.05] transition-all duration-300 text-left">
                        <div class="absolute -right-4 -top-4 text-5xl font-serif text-white/5 group-hover:text-gold/10 transition-colors">${idx + 1}</div>
                        <h4 class="text-gold font-bold mb-2 flex items-center gap-2">
                            <i class="fas fa-map-marker-alt text-[10px]"></i>
                            โซน${zone}
                        </h4>
                        <p class="text-[11px] text-gray-300 leading-relaxed mb-4">
                            แหล่งรวมโรงแรมและ ${data.hotels[idx % data.hotels.length] || 'ที่พักส่วนตัว'} เหมาะสำหรับการนัดหมายน้องๆ สาย${data.lsi[idx % data.lsi.length]} อย่างเป็นส่วนตัว
                        </p>
                        <div class="flex flex-wrap gap-2">
                            <span class="text-[9px] px-2 py-1 bg-white/10 rounded-md text-white border border-white/10">${data.lsi[idx % data.lsi.length]}</span>
                            <span class="text-[9px] px-2 py-1 bg-white/10 rounded-md text-white border border-white/10">${data.traits[idx % data.traits.length]}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <section class="relative py-12">
            <div class="absolute inset-0 bg-white/[0.02] rounded-[3rem] border border-white/10"></div>
            <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8">
                <div class="text-left">
                    <h3 class="text-xl font-serif text-gold mb-6 tracking-widest uppercase italic font-bold">Exclusive Amenities</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-left">
                        ${data.services.map(srv => `
                            <div class="flex items-center gap-3 group">
                                <div class="w-5 h-5 rounded-full border border-gold flex items-center justify-center group-hover:bg-gold transition-all duration-300">
                                    <i class="fas fa-check text-[8px] text-gold group-hover:text-black"></i>
                                </div>
                                <span class="text-sm text-gray-200 group-hover:text-white transition-colors">${srv}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="border-l border-white/10 pl-8 hidden lg:block text-left">
                    <p class="text-sm italic text-gray-400 leading-loose">
                        "เราคัดสรรพริตตี้และนางแบบใน${provinceName}ด้วยมาตรฐานสูงสุด ไม่เพียงแค่ความสวยภายนอก แต่เรายังให้ความสำคัญกับมารยาท การรักษาความลับลูกค้า และความตรงปก เพื่อให้ทุกการนัดหมายคือความประทับใจที่คุณต้องกลับมาซ้ำ"
                    </p>
                </div>
            </div>
        </section>

        <section class="max-w-4xl mx-auto pt-8">
            <div class="text-center mb-12">
                <h3 class="text-2xl font-serif text-white mb-2">คำถามที่พบบ่อย (FAQ)</h3>
                <p class="text-[10px] text-gold font-bold tracking-[0.2em] uppercase">Everything you need to know</p>
            </div>
            <div class="grid grid-cols-1 gap-4 text-left">
                ${data.faqs.map(faq => `
                    <div class="p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-gold/40 transition-all duration-300 group">
                        <h4 class="text-sm font-bold text-gold mb-3 flex items-center gap-3">
                            <span class="w-1.5 h-1.5 rounded-full bg-gold"></span>
                            ${faq.q}
                        </h4>
                        <p class="text-sm text-gray-300 leading-relaxed pl-4 border-l border-white/10">${faq.a}</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <section class="border-t border-white/10 pt-16 text-left">
            <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 text-center md:text-left">
                <div>
                    <h3 class="text-xl font-serif text-white mb-2 tracking-wide italic font-bold">พื้นที่บริการใกล้เคียงที่น่าสนใจ</h3>
                    <p class="text-xs text-gray-400">สำรวจโปรไฟล์น้องๆ ในจังหวัดอื่นๆ ที่เดินทางสะดวกจาก${provinceName}</p>
                </div>
                <a href="/" class="text-[10px] text-white font-bold uppercase tracking-widest border border-gold px-4 py-2 rounded-full hover:bg-gold hover:text-black transition-all">ดูรายชื่อทั้งหมด</a>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${otherProvinces.map(key => {
                    const pData = PROVINCE_SEO_DATA[key];
                    return `
                        <a href="/${key}" class="group p-4 bg-white/[0.05] border border-white/10 rounded-2xl hover:border-gold transition-all text-center">
                            <span class="block text-white group-hover:text-gold transition-colors font-bold mb-1">
                                ${pData.name}
                            </span>
                            <span class="block text-[10px] text-gray-400 uppercase tracking-tighter group-hover:text-white">
                                Sideline ${key.toUpperCase()}
                            </span>
                        </a>
                    `;
                }).join('')}
            </div>
            
            <div class="mt-12 p-6 bg-white/[0.02] text-center border-t border-white/5">
                <p class="text-[11px] text-gray-400 leading-relaxed max-w-3xl mx-auto">
                    ข้อมูล ไซด์ไลน์${provinceName} นี้จัดทำขึ้นเพื่อรวบรวมโปรไฟล์ที่ผ่านการตรวจสอบเบื้องต้น เพื่อความปลอดภัยสูงสุดกรุณานัดหมายผ่านช่องทางที่ระบุไว้ และปฏิบัติตามกฎความปลอดภัยอย่างเคร่งครัด
                </p>
            </div>
        </section>

    </article>
    `;
};

// ==========================================
// 3. MAIN SSR EDGE FUNCTION
// ==========================================
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


        const [provinceRes, profilesRes, allProvincesRes] = await Promise.all([
            supabase.from('provinces').select('id, nameThai, key').eq('key', provinceKey).maybeSingle(),
            supabase.from('profiles').select('id, slug, name, imagePath, galleryPaths, location, rate, isfeatured, lastUpdated, created_at, active, availability, likes')
                .eq('provinceKey', provinceKey).eq('active', true)
                .order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false }).limit(80),
            supabase.from('provinces').select('key, nameThai').order('nameThai', { ascending: true })
        ]);

        const provinceData = provinceRes.data;
        const profiles = profilesRes.data;
        const allProvinces = allProvincesRes.data;

        if (!provinceData || provinceRes.error) return context.next();

        const safeProfiles = profiles ||[];
        const provinceName = provinceData.nameThai;
        const seoData = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
        const zones = seoData.zones;
        
        const now = new Date();
        const CURRENT_YEAR = now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric' });
        const CURRENT_MONTH = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', month: 'long' });
        const provinceUrl = `${CONFIG.DOMAIN}/location/${provinceKey}`;
        
        const firstImage = safeProfiles.length > 0 
            ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) 
            : `${CONFIG.DOMAIN}/images/seo-default.webp`;


const title = `รับงาน${provinceName} ไซด์ไลน์${provinceName} สาวไซด์ไลน์ เพื่อนเที่ยว (${CURRENT_MONTH} ${CURRENT_YEAR}) | ตรงปก ปลอดภัย ไม่มัดจำ`;

const description = `รวมโปรไฟล์น้องๆ รับงาน${provinceName} ไซด์ไลน์${provinceName} (Sideline) เพื่อนเที่ยวระดับพรีเมียม ${safeProfiles.length} คน โซน ${seoData.zones.slice(0,3).join(', ')} ✓การันตีตรงปก 100% ✓ไม่ต้องโอนมัดจำ จ่ายเงินหน้างาน`;

        const provinceLinksHtml = allProvinces && allProvinces.length > 0 
            ? allProvinces.map(p => `
                <a href="/location/${p.key}" 
                   class="text-[10px] text-white/70 hover:text-gold transition-all duration-300 border-b border-transparent hover:border-gold/30 pb-0.5 py-1.5 whitespace-nowrap">
                   ไซด์ไลน์${p.nameThai}
                </a>
            `).join('')
            : '';

        const latestUpdateDate = safeProfiles.length > 0 && safeProfiles[0].lastUpdated 
            ? new Date(safeProfiles[0].lastUpdated).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

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
                    "telephone": "ติดต่อผ่าน Line Official",
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
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}/#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "isPartOf": { "@id": `${CONFIG.DOMAIN}/#website` },
                    "about": { "@id": `${provinceUrl}/#business` },
                    "breadcrumb": { "@id": `${provinceUrl}/#breadcrumb` },
                    "mainEntity": { "@id": `${provinceUrl}/#itemlist` }
                },
                {
                    "@type": "BreadcrumbList",
                    "@id": `${provinceUrl}/#breadcrumb`,
                    "itemListElement":[
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": "รวมโปรไฟล์", "item": `${CONFIG.DOMAIN}/profiles` },
                        { "@type": "ListItem", "position": 3, "name": `ไซด์ไลน์${provinceName}`, "item": provinceUrl }
                    ]
                },
                {
                    "@type": "ItemList",
                    "@id": `${provinceUrl}/#itemlist`,
                    "numberOfItems": safeProfiles.length,
                    "itemListElement": safeProfiles.map((p, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "url": `${CONFIG.DOMAIN}/sideline/${p.slug || p.id}`
                    }))
                },
                {
                    "@type": "FAQPage",
                    "@id": `${provinceUrl}/#faq`,
                    "mainEntity":[
                        {
                            "@type": "Question",
                            "name": `บริการไซด์ไลน์${provinceName} และเพื่อนเที่ยว ต้องโอนมัดจำไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่มีการโอนมัดจำล่วงหน้าทุกกรณี ลูกค้าจ่ายเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น ปลอดภัย 100%" }
                        },
                        {
                            "@type": "Question",
                            "name": `น้องๆ ใน${provinceName} รับงานโซนไหนบ้าง?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `ครอบคลุมโซนยอดนิยม เช่น ${zones.slice(0, 5).join(', ')} และโรงแรมชั้นนำในตัวเมือง นัดง่ายเดินทางสะดวก` }
                        }
                    ]
                }
            ]
        };


const userAgent = request.headers.get('user-agent') || '';

const isBot = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|lighthouse|chrome-lighthouse|google-structured-data-testing-tool/i.test(userAgent);


const ageGateHTML = ''; 

let cardsHTML = '';
if (safeProfiles && safeProfiles.length > 0) {
    cardsHTML = safeProfiles.map((p, i) => {
        const cleanName = (p.name || 'สาวสวย').replace(/^(น้อง\s?)/, '');
        const profileLocation = p.location || provinceName || 'ไม่ระบุพิกัด';
        

        const busyKeywords = ['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'];
        let isAvailable = true;
        if (p.availability) {
            const availText = p.availability.toLowerCase();
            isAvailable = !busyKeywords.some(kw => availText.includes(kw));
        }
        const statusText = isAvailable ? 'พร้อมรับงาน' : 'ติดจอง';

        // จัดการวันที่ (พ.ศ.)
        const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
        const d = new Date(dateStr);
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const dateDisplay = `${d.getDate()} ${months[d.getMonth()]} ${(d.getFullYear() + 543).toString().slice(-2)}`;
        

        const intents = seoData.intents || ['เพื่อนเที่ยว', 'ฟิวแฟน', 'รับงานเอนเตอร์เทน'];
        const traits = seoData.traits || ['น่ารัก', 'บุคลิกดี', 'บริการประทับใจ'];
        const lsiKeywords = seoData.lsi || [`ไซด์ไลน์${provinceName}`, `รับงาน${provinceName}`];
        
        const targetIntent = intents[i % intents.length];
        const targetTrait = traits[i % traits.length];
        const targetKeyword = lsiKeywords[i % lsiKeywords.length];
        

        const imgAlt = `น้อง${cleanName} ${profileLocation} สไตล์${targetTrait} ${targetIntent}`;
        const profileLink = `/sideline/${p.slug || p.id || '#'}`;


        let badgeHTML = '';
        const rateNum = p.rate ? parseInt(String(p.rate).replace(/\D/g, '')) : 0;
        
        if (rateNum >= 4000) {
            badgeHTML = `<span class="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(168,85,247,0.4)]">VIP Class</span>`;
        } else if (i < 3 && p.isfeatured) {
            badgeHTML = `<span class="bg-gradient-to-r from-orange-600 to-red-600 text-white text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(234,88,12,0.4)]">Trending</span>`;
        } else {
            badgeHTML = `<span class="bg-white/10 text-white/80 border border-white/10 text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase backdrop-blur-sm">Verified</span>`;
        }
        

        const loadingAttr = i < 6 ? 'fetchpriority="high"' : 'loading="lazy"';
        
        return `
<article class="profile-card group relative overflow-hidden flex flex-col h-full bg-[#121212] rounded-[24px] border border-white/5 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
    <a href="${profileLink}" class="absolute inset-0 z-40" aria-label="ดูโปรไฟล์น้อง ${cleanName}"></a>
    
    <div class="relative aspect-[3/4] overflow-hidden">
        <img src="${optimizeImg(p.imagePath, 500, 660)}" 
             alt="${imgAlt}"
             class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
             ${loadingAttr}
             decoding="async">
        
        <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/20 z-10"></div>
        
        <div class="absolute top-3 left-3 z-20">
            <div class="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-2 shadow-lg">
                <span class="h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-rose-500'} ${isAvailable ? 'animate-pulse' : ''}"></span>
                <span class="text-[8px] md:text-[9px] text-white font-bold tracking-[0.1em] uppercase">${statusText}</span>
            </div>
        </div>

        <div class="absolute top-3 right-3 z-20 flex flex-col gap-1.5 items-end">
            ${badgeHTML}
        </div>
    </div>

    <div class="p-5 flex-1 flex flex-col justify-between relative z-20">
        <div>
            <div class="flex justify-between items-center mb-3">
                <span class="text-[10px] text-gold font-bold tracking-[0.15em] uppercase px-2 py-0.5 bg-gold/5 rounded border border-gold/10">
                    ${targetKeyword}
                </span>
                <span class="text-[9px] text-white/30 font-light italic">${dateDisplay}</span>
            </div>

            <h3 class="font-serif text-2xl text-white group-hover:text-gold transition-colors duration-300 truncate leading-tight">
                ${cleanName}
            </h3>
            
            <div class="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/5">
                <div class="space-y-1">
                    <p class="text-[9px] text-white/40 uppercase tracking-[0.1em]">พิกัด</p>
                    <p class="text-xs text-white/80 font-light truncate">
                        <i class="fas fa-map-marker-alt text-gold/60 mr-1.5"></i>${profileLocation}
                    </p>
                </div>
                <div class="space-y-1 text-right">
                    <p class="text-[9px] text-white/40 uppercase tracking-[0.1em]">ค่าขนม</p>
                    <p class="text-[15px] text-gold font-bold tabular-nums">
                        ฿${p.rate || 'สอบถาม'}
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-6 flex items-center justify-between text-[10px] border-t border-white/5 pt-4">
            <span class="text-white/40 uppercase tracking-widest italic font-light">
                <i class="far fa-star text-gold/40 mr-1"></i> ${targetIntent}
            </span>
            <span class="text-white/60 group-hover:text-gold transition-all duration-300 uppercase font-medium tracking-tighter flex items-center">
                ดูรายละเอียด <i class="fas fa-chevron-right ml-1.5 text-[8px] transition-transform group-hover:translate-x-1"></i>
            </span>
        </div>
    </div>
</article>`;
    }).join('');
}
        const html = String.raw`<!DOCTYPE html>
<html lang="th" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    
    <meta name="theme-color" content="#070707">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="sidelinechiangmai">

    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="รับงาน${provinceName}, ไซด์ไลน์${provinceName}, sideline ${provinceName}, ไซต์ไลน์${provinceName}, ไซไล${provinceName}, ไซไลน์${provinceName}, ไซส์ไลน์${provinceName}, สาวไซด์ไลน์${provinceName}, เพื่อนเที่ยว${provinceName}, เด็กเอ็น${provinceName}, ไม่มัดจำ">
    <link rel="canonical" href="${provinceUrl}" />
    
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="google-site-verification" content="0N_IQUDZv9Y2WtNhjqSPTV3TuPsildmmO-TPwdMlSfg" />

    <meta name="geo.region" content="TH" />
    <meta name="geo.placename" content="${provinceName}" />
    <meta name="geo.position" content="13.736717;100.523186" /> <meta name="ICBM" content="13.736717, 100.523186" />

    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="${CONFIG.TWITTER}">
    <meta name="twitter:creator" content="${CONFIG.TWITTER}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${firstImage}">

    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://zxetzqwjaiumqhrpumln.supabase.co" crossorigin>
    
    <link rel="dns-prefetch" href="https://line.me">
    <link rel="dns-prefetch" href="https://www.tiktok.com">
    <link rel="dns-prefetch" href="https://twitter.com">

    <link rel="preload" href="${firstImage}" as="image" fetchpriority="high">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Prompt:wght@300;400;500&display=swap" media="print" onload="this.media='all'">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <script type="application/ld+json">
        ${JSON.stringify(schemaData)}
    </script>


    
</head>

<!-- 🎨 6. แก้ปัญหา Contrast ของเวลาลากคลุมข้อความ (Selection) -->
<body class="selection:bg-gold selection:text-black antialiased text-white/90 bg-[#050505] overflow-x-hidden scroll-smooth">

    <!-- 🤖 นำตัวแปร Age Gate (ที่ผ่านการตรวจสอบ GoogleBot แล้ว) มาแสดงตรงนี้ -->
    ${ageGateHTML}

    <nav class="fixed top-0 w-full z-[100] nav-glass transition-all duration-500 py-4">
        <div class="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-[1400px]">
            <a href="/" class="text-xl md:text-2xl font-serif tracking-[0.2em] text-white hover:text-gold transition-all">
                SIDELINE<span class="text-gold italic ml-1">${provinceData.key.toUpperCase()}</span>
            </a>
            <div class="hidden md:flex items-center gap-10 text-[10px] font-medium tracking-[0.25em] uppercase">
                <a href="/" class="text-white/60 hover:text-white transition-colors">Home</a>
                <a href="/profiles" class="text-white/60 hover:text-white transition-colors">Directory</a>
                <span class="text-gold border-b-2 border-gold/50 pb-1">${provinceName}</span>
            </div>
        </div>
    </nav>

<header class="relative pt-44 pb-24 px-6 hero-glow flex flex-col items-center justify-center text-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-50"></div>

    <div class="max-w-5xl mx-auto space-y-10 z-10">
        <div class="inline-block px-5 py-2 border border-gold/30 rounded-full text-[10px] font-semibold tracking-[0.3em] uppercase text-gold bg-gold/10 mb-2 animate-pulse">
            อัปเดตล่าสุด • ${CURRENT_MONTH} ${new Date().getFullYear() + 543}
        </div>
        
        <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-white">
            <span class="block font-light opacity-95 tracking-tight">
                ไซด์ไลน์<span class="text-gold font-normal">${provinceName}</span>
            </span>
            <span class="block text-xl md:text-3xl lg:text-4xl mt-8 font-sans font-light tracking-[0.1em] text-white/60 max-w-3xl mx-auto leading-relaxed">
                ศูนย์รวมน้องๆสาวๆรับงานฟิวแฟน เด็กเอ็นโปรไฟล์จริง <span class="text-white/80">นางแบบและเพื่อนเที่ยวพรีเมียม</span> 
                <span class="hidden md:inline">มั่นใจความปลอดภัย</span> 
                <span class="text-gold/80 italic">ไม่มีโอนมัดจำ🚨</span>
            </span>
        </h1>
        
        <div class="flex flex-wrap justify-center gap-3 pt-8 max-w-3xl mx-auto">
            ${zones.slice(0, 8).map(z => `
                <a href="/search?zone=${encodeURIComponent(z)}&province=${provinceKey}" 
                   title="หาไซด์ไลน์ ${z} ${provinceName}"
                   class="text-[11px] px-6 py-2.5 rounded-full border border-white/10 font-medium tracking-widest hover:border-gold hover:text-gold text-white/50 hover:bg-gold/5 transition-all duration-500 backdrop-blur-sm">
                   #${z.toUpperCase()}
                </a>
            `).join('')}
        </div>

        <p class="text-[10px] text-white/30 tracking-[0.2em] uppercase pt-4">
            <i class="fas fa-check-circle text-gold/50 mr-2"></i> 
            Verified ${safeProfiles.length} Profiles in ${provinceName}
        </p>
    </div>
</header>

<!-- 🚀 1. ปรับปรุง Stats Bar เพื่อแก้ CLS (ใช้ min-h และล็อคบรรทัดตัวเลข) -->
<div class="border-y border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md relative z-20 mb-16 min-h-[105px] md:min-h-[135px] flex items-center shadow-2xl">
    <div class="container mx-auto px-6 max-w-5xl">
        <div class="grid grid-cols-3 divide-x divide-white/10 py-6">
            <div class="text-center px-2">
                <div class="text-2xl md:text-4xl font-serif text-gold leading-none mb-1.5 h-6 md:h-9">${safeProfiles.length}</div>
                <div class="text-[9px] md:text-[11px] text-white/70 uppercase tracking-widest font-medium mt-1">น้องๆ พร้อมรับงาน</div>
            </div>
            <div class="text-center px-2">
                <div class="text-2xl md:text-4xl font-serif text-white leading-none mb-1.5 h-6 md:h-9">${latestUpdateDate}</div>
                <div class="text-[9px] md:text-[11px] text-white/70 uppercase tracking-widest font-medium mt-1">อัปเดตสถานะล่าสุด</div>
            </div>
            <div class="text-center px-2">
                <div class="text-2xl md:text-4xl font-serif text-emerald-500 leading-none mb-1.5 h-6 md:h-9">100%</div>
                <div class="text-[9px] md:text-[11px] text-white/70 uppercase tracking-widest font-medium mt-1">รับประกันไม่โอนมัดจำ</div>
            </div>
        </div>
    </div>
</div>

<main class="container mx-auto px-6 lg:px-12 max-w-[1400px] pb-32" id="profiles">
        
        <!-- 🎨 2. ปรับ Contrast Breadcrumb (จาก white/40 เป็น white/60) เพื่อให้อ่านง่าย -->
        <nav aria-label="Breadcrumb" class="mb-6">
            <ol class="flex items-center space-x-2 text-[10px] md:text-xs text-white/60 font-medium tracking-widest uppercase">
                <li><a href="/" class="hover:text-gold transition-colors">Home</a></li>
                <li><span class="mx-1 opacity-70">/</span></li>
                <li><a href="/profiles" class="hover:text-gold transition-colors">Directory</a></li>
                <li><span class="mx-1 opacity-70">/</span></li>
                <li class="text-gold" aria-current="page">${provinceName}</li>
            </ol>
        </nav>

        <div class="flex items-end justify-between mb-8 border-b border-white/10 pb-6">
            <h2 class="text-2xl md:text-4xl font-serif text-white tracking-wide">
                โปรไฟล์น้องๆ <span class="text-gold italic font-light">พรีเมียม</span>
            </h2>
            <div class="flex items-center gap-3">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span class="text-[10px] text-white/70 tracking-[0.2em] uppercase font-semibold">${safeProfiles.length} Online Now</span>
            </div>
        </div>
        
        <!-- 🎨 3. ปรับ Contrast Filter Bar -->
        <div class="flex flex-wrap items-center gap-3 mb-12">
            <span class="text-[10px] text-white/60 uppercase tracking-[0.2em] mr-2 hidden md:inline-block font-bold">Filter:</span>
            <button class="text-[10px] md:text-[11px] px-5 py-2.5 rounded-full bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-black font-bold tracking-wider uppercase transition-all duration-300">
                ⭐ มาแรง (Trending)
            </button>
            <button class="text-[10px] md:text-[11px] px-5 py-2.5 rounded-full bg-white/[0.05] text-white/90 border border-white/10 hover:border-gold hover:text-gold font-semibold tracking-wider uppercase transition-all duration-300">
                💰 เรทเริ่มต้น 1,500
            </button>
            <button class="text-[10px] md:text-[11px] px-5 py-2.5 rounded-full bg-white/[0.05] text-white/90 border border-white/10 hover:border-gold hover:text-gold font-semibold tracking-wider uppercase transition-all duration-300">
                💎 VIP Class
            </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10 mb-20">
            ${cardsHTML}
        </div>

        ${safeProfiles.length >= 80 ? `
        <div class="flex justify-center mb-28">
            <a href="/search?province=${provinceKey}" class="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#121212] border border-white/20 text-white text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase rounded-full hover:border-gold hover:text-gold transition-all duration-300 overflow-hidden shadow-2xl hover:-translate-y-1">
                <span class="relative z-10">ดูโปรไฟล์ทั้งหมด</span>
                <i class="fas fa-arrow-right relative z-10 text-[10px] group-hover:translate-x-1 transition-transform"></i>
                <div class="absolute inset-0 h-full w-0 bg-gold/10 group-hover:w-full transition-all duration-500 ease-out z-0"></div>
            </a>
        </div>
        ` : '<div class="mb-28"></div>'}

        <!-- 🎨 4. ปรับ Contrast ส่วน Trust Signals (ข้อความสว่างขึ้น) -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 mb-40 max-w-6xl mx-auto px-4 border-t border-white/5 pt-20">
            <div class="text-center group">
                <div class="w-20 h-20 mx-auto mb-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500 bg-[#0a0a0a]">
                    <i class="fas fa-shield-alt text-3xl text-gold"></i>
                </div>
                <h3 class="text-sm font-bold tracking-[0.2em] uppercase text-white mb-4">No Deposit</h3>
                <p class="text-xs text-white/70 leading-relaxed font-light">ชำระเงินกับผู้ให้บริการโดยตรงเมื่อพบตัวจริง ไม่มีการโอนมัดจำล่วงหน้า ปลอดภัย 100%</p>
            </div>
            <div class="text-center group">
                <div class="w-20 h-20 mx-auto mb-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500 bg-[#0a0a0a]">
                    <i class="fas fa-gem text-3xl text-gold"></i>
                </div>
                <h3 class="text-sm font-bold tracking-[0.2em] uppercase text-white mb-4">Quality Verified</h3>
                <p class="text-xs text-white/70 leading-relaxed font-light">คัดกรองเฉพาะงานคุณภาพ ตรงปก พร้อมการดูแลระดับพรีเมียม</p>
            </div>
            <div class="text-center group">
                <div class="w-20 h-20 mx-auto mb-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500 bg-[#0a0a0a]">
                    <i class="fas fa-user-secret text-3xl text-gold"></i>
                </div>
                <h3 class="text-sm font-bold tracking-[0.2em] uppercase text-white mb-4">Privacy Focus</h3>
                <p class="text-xs text-white/70 leading-relaxed font-light">เราให้ความสำคัญกับความเป็นส่วนตัวของลูกค้าเป็นอันดับหนึ่ง ข้อมูลถูกเก็บเป็นความลับ</p>
            </div>
        </section>

        <div class="max-w-4xl mx-auto">
            ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}
        </div>
    </main>

<!-- 🎨 5. ปรับ Contrast Footer (ตัวหนังสือสว่างขึ้น) -->
<footer class="border-t border-white/10 bg-[#050505] pt-24 pb-12 mt-20">
    <div class="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20">
            <div class="md:col-span-5 space-y-8">
                <h3 class="text-2xl font-serif tracking-[0.3em] text-white uppercase">
                    ไซด์ไลน์<span class="text-gold italic ml-1">${provinceData.key.toUpperCase()}</span>
                </h3>
                <p class="text-[13px] text-white/90 leading-relaxed max-w-sm font-light tracking-wide">
                    Thailand's most prestigious directory for premium personal companion and modeling services. We redefine the standard of excellence, privacy, and safety.
                </p>
                <div class="flex gap-6">
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" aria-label="Twitter" class="text-white/80 hover:text-gold transition-all text-2xl"><i class="fab fa-x-twitter"></i></a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="Line" class="text-white/80 hover:text-gold transition-all text-2xl"><i class="fab fa-line"></i></a>
                </div>
            </div>

            <div class="md:col-span-3">
                <h4 class="text-[10px] font-black text-white/60 tracking-[0.4em] uppercase mb-8">Navigation</h4>
                <ul class="space-y-4 text-[13px] text-white font-medium uppercase tracking-widest">
                    <li><a href="/" class="underline decoration-white/30 underline-offset-8 hover:text-gold transition-colors">Home</a></li>
                    <li><a href="/profiles" class="underline decoration-white/30 underline-offset-8 hover:text-gold transition-colors">Directory</a></li>
                    <li><a href="/location/chiangmai" class="underline decoration-white/30 underline-offset-8 hover:text-gold transition-colors">เชียงใหม่</a></li>
                </ul>
            </div>

            <div class="md:col-span-4">
                <h4 class="text-[10px] font-black text-white/60 tracking-[0.4em] uppercase mb-8">Legal & Privacy</h4>
                <p class="text-[12px] text-white/90 leading-relaxed font-light mb-6 uppercase tracking-wider">
                    Models are independent contractors. You must be 20+ to enter. We provide information only and do not facilitate transactions.
                </p>
                <div class="inline-flex items-center gap-2 border border-gold/50 px-5 py-2 rounded-full text-[10px] text-gold uppercase tracking-[0.25em] font-bold bg-gold/5">
                    <span class="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span> 20+ Only
                </div>
            </div>
        </div>

        <div class="border-t border-white/10 pt-16 mb-20">
            <h4 class="text-[10px] font-bold text-white/70 tracking-[0.5em] uppercase mb-12 text-center">Service Coverage</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
                ${provinceLinksHtml}
            </div>
        </div>

        <div class="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-white/70 uppercase tracking-[0.3em] font-medium">
            <p>&copy; ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. LUXURY DIRECTORY.</p>
            <div class="flex gap-8">
                <a href="/terms" class="hover:text-gold underline decoration-white/30 underline-offset-4 transition-colors">Terms</a>
                <a href="/privacy" class="hover:text-gold underline decoration-white/30 underline-offset-4 transition-colors">Privacy</a>
            </div>
        </div>
    </div>
</footer>

<a href="${CONFIG.SOCIAL_LINKS.line}" 
   target="_blank" 
   rel="noopener noreferrer"
   /* 1. ใช้ transform-gpu เพื่อให้ลื่นไหลและไม่ขยับ Layout ส่วนอื่น */
   /* 2. ระบุ w-auto h-auto และใช้ flex เพื่อให้ขนาดปุ่มนิ่ง */
   class="fixed bottom-10 right-10 z-[90] group transition-transform duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-green-500/50 rounded-full will-change-transform"
   aria-label="ติดต่อสอบถามข้อมูลเพิ่มเติมผ่าน LINE">
    
    /* แก้ Contrast: ใช้ bg-[#067d3b] (เขียวที่เข้มขึ้นเล็กน้อย) เพื่อให้ตัดกับตัวหนังสือสีขาวได้คะแนนสูงขึ้น */
    <div class="bg-[#067d3b] border border-white/40 rounded-full px-6 py-3 flex items-center gap-3 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)] transition-all duration-300">
        
        <div class="relative flex items-center justify-center w-8 h-8">
            /* แก้ไอคอนให้เด่นชัด */
            <i class="fab fa-line text-white text-3xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true"></i>
            
            /* จุดแจ้งเตือน: ใช้สีแดงที่สว่างขึ้นเพื่อให้ตัดกับสีเขียวพื้นหลัง */
            <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-white/20"></span>
            </span>
        </div>

        <div class="flex flex-col items-start leading-none">
            /* แก้ Contrast: ใช้ text-white แบบ 100% (ไม่มี opacity) และเพิ่ม font-bold */
            <span class="text-[11px] text-white uppercase tracking-[0.1em] font-bold opacity-100">Contact Us</span>
            /* เพิ่มขนาดตัวอักษรภาษาไทยเป็น 18px เพื่อการอ่านที่ง่ายขึ้น (Accessibility) */
            <span class="text-[18px] text-white font-black tracking-normal">ติดต่อสอบถาม</span>
        </div>
    </div>
</a>

<script>
    (() => {
        const nav = document.querySelector('nav');
        if (!nav) return;

        let ticking = false;
        const updateNav = () => {
            const scrollPos = window.scrollY || window.pageYOffset;
            nav.classList.toggle('nav-scrolled', scrollPos > 50);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });
        updateNav();
    })();

    document.addEventListener("DOMContentLoaded", () => {
        const ageGate = document.getElementById('age-gate');
        if(!ageGate) return; // ข้ามไปถ้าโดนซ่อนเพราะเป็น GoogleBot
        
        if (localStorage.getItem('ageVerified') === 'true') {
            ageGate.style.display = 'none';
        } else {
            document.body.style.overflow = 'hidden';
        }
    });

    window.acceptAgeGate = function() {
        const ageGate = document.getElementById('age-gate');
        if(!ageGate) return;
        
        localStorage.setItem('ageVerified', 'true');
        ageGate.style.opacity = '0';
        document.body.style.overflow = 'auto'; 
        setTimeout(() => {
            ageGate.style.display = 'none';
        }, 500); 
    };
</script>
</body>
</html>`;

        return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=3600" } });
    } catch (e) {
        console.error('SSR Critical Error:', e);
        return new Response('<div style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;">System is updating. Please try again in a few minutes.</div>', { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
};