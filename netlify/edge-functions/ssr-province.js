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
        uniqueIntro: "หากคุณกำลังมองหาน้องๆ <strong>รับงานเชียงใหม่</strong> หรือ <strong>สาวไซด์ไลน์เชียงใหม่</strong> ระดับพรีเมียม ที่นี่คือศูนย์รวมนางแบบและเพื่อนเที่ยวสาวเหนือผิวออร่า ที่พร้อมดูแลคุณแบบฟิวแฟน ไม่ว่าคุณจะพักอยู่โซนนิมมาน สันติธรรม หรือรีสอร์ทส่วนตัว เรามีตั้งแต่น้องนักศึกษาไปจนถึงพริตตี้ท้องถิ่น การันตีความตรงปก 100% ปลอดภัย ไร้กังวลเรื่องโอนมัดจำ",
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
        uniqueIntro: "หากคุณกำลังมองหาช่วงเวลาการพักผ่อนเหนือระดับ เรารวบรวมน้องๆ <strong>รับงานส่วนตัว</strong>และ<strong>ไซด์ไลน์เกรดพรีเมียม</strong> ที่ผ่านการคัดสรรอย่างเข้มงวด การันตีความตรงปก 100% พร้อมให้บริการในพื้นที่ นัดหมายได้อย่างเป็นส่วนตัว ปลอดภัย ไม่มีการบังคับโอนมัดจำ จ่ายเงินเมื่อเจอตัวจริงเท่านั้น",
        faqs:[
            { q: "ใช้บริการน้องๆ รับงาน ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำใดๆ ทั้งสิ้น ลูกค้าจ่ายเงินสดหน้างานเมื่อเจอตัวน้องจริงเท่านั้น เพื่อความปลอดภัยสูงสุดของคุณ" },
            { q: "รับประกันความตรงปกไหม?", a: "รูปโปรไฟล์ทุกรูปผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปกและพร้อมให้บริการระดับพรีเมียมอย่างแท้จริง" }
        ]
    }
};

const optimizeImg = (path, width = 320, height = 400) => { 
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) return path.replace('/upload/', `/upload/f_auto,q_auto:good,w_${width},h_${height},c_fill,g_face/`);
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
    return `
    <section aria-labelledby="seo-section-title" class="mt-16 md:mt-24 mb-10 px-4">
        <div class="luxury-glass rounded-[2rem] p-8 md:p-14 relative overflow-hidden shadow-[0_15px_50px_rgba(15,5,5,0.8)] border border-luxury-deepwine/60">
            <!-- Ambient Glow -->
            <div class="absolute -top-32 -right-32 w-[400px] h-[400px] bg-luxury-burgundy/10 blur-[120px] rounded-full pointer-events-none" style="contain: strict; transform: translateZ(0);"></div>
            <div class="absolute -bottom-32 -left-32 w-[300px] h-[300px] bg-luxury-gold/5 blur-[100px] rounded-full pointer-events-none" style="contain: strict; transform: translateZ(0);"></div>
            
            <div class="relative z-10 text-center max-w-4xl mx-auto mb-12">
                <span class="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-luxury-gold/20 bg-luxury-deepwine/20 text-[10px] md:text-xs font-light text-luxury-gold uppercase tracking-[0.25em] mb-6">
                    <span class="w-1.5 h-1.5 rounded-full bg-luxury-rosegold" aria-hidden="true"></span> The VIP Standard
                </span>
                <h2 id="seo-section-title" class="text-3xl md:text-5xl font-serif text-luxury-cream mb-6 tracking-wide leading-[1.2]">
                    สิทธิพิเศษแห่งค่ำคืน <br class="md:hidden"/><span class="text-luxury-rosegold italic font-serif">ไซด์ไลน์${escapeHTML(provinceName)}</span>
                </h2>
                <p class="text-luxury-champagne/70 text-sm md:text-base leading-relaxed md:leading-loose max-w-3xl mx-auto font-light tracking-wide">
                    ${data.uniqueIntro} คัดสรรเฉพาะนางแบบระดับพรีเมียมกว่า <strong class="text-luxury-cream font-medium">${count} ท่าน</strong> เพื่อให้มั่นใจว่าคุณจะได้รับประสบการณ์ที่สมบูรณ์แบบที่สุด
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 relative z-10">
                <article class="p-8 rounded-2xl transition-all duration-700 hover:bg-luxury-deepwine/10 border border-luxury-deepwine/30 hover:border-luxury-gold/20 group">
                    <div class="text-luxury-gold text-2xl mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                        <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
                    </div>
                    <h3 class="text-lg md:text-xl font-serif text-luxury-cream mb-5 tracking-wide">จุดนัดพบใน${escapeHTML(provinceName)}</h3>
                    <div class="flex flex-wrap gap-3">
                        ${(data.zones ||['ตัวเมือง']).slice(0, 6).map(z => `<span class="px-4 py-1.5 bg-luxury-base/60 rounded-full text-[11px] md:text-xs font-light text-luxury-champagne/80 border border-luxury-deepwine/40 tracking-[0.1em]">${escapeHTML(z)}</span>`).join('')}
                    </div>
                </article>

                <article class="p-8 rounded-2xl transition-all duration-700 hover:bg-luxury-deepwine/10 border border-luxury-deepwine/30 hover:border-luxury-gold/20 group">
                    <div class="text-luxury-gold text-2xl mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                        <i class="fas fa-shield-check" aria-hidden="true"></i>
                    </div>
                    <h3 class="text-lg md:text-xl font-serif text-luxury-cream mb-5 tracking-wide">เอกสิทธิ์ความปลอดภัย</h3>
                    <ul class="space-y-4">
                        <li class="flex items-start gap-4 text-sm md:text-base text-luxury-champagne/70 font-light leading-relaxed"><i class="fas fa-check text-luxury-gold/70 mt-1" aria-hidden="true"></i> <span><strong class="text-luxury-cream font-normal">ชำระเงินเมื่อพบเจอ:</strong> ปราศจากการโอนล่วงหน้า</span></li>
                        <li class="flex items-start gap-4 text-sm md:text-base text-luxury-champagne/70 font-light leading-relaxed"><i class="fas fa-check text-luxury-gold/70 mt-1" aria-hidden="true"></i> <span><strong class="text-luxury-cream font-normal">ยืนยันตัวตน:</strong> ทุกโปรไฟล์ผ่านการตรวจสอบความถูกต้อง</span></li>
                        <li class="flex items-start gap-4 text-sm md:text-base text-luxury-champagne/70 font-light leading-relaxed"><i class="fas fa-check text-luxury-gold/70 mt-1" aria-hidden="true"></i> <span><strong class="text-luxury-cream font-normal">ความลับขั้นสูงสุด:</strong> ข้อมูลส่วนตัวถูกเก็บเป็นความลับ 100%</span></li>
                    </ul>
                </article>
            </div>

            ${data.faqs && data.faqs.length > 0 ? `
            <div class="mt-16 relative z-10 pt-12 border-t border-luxury-deepwine/30">
                <h3 class="text-2xl md:text-3xl font-serif text-luxury-cream mb-10 text-center tracking-wide">Concierge & FAQ</h3>
                <div class="space-y-4 max-w-4xl mx-auto" id="faq-accordion">
                    ${data.faqs.map((faq, index) => `
                        <div class="faq-item bg-luxury-base/40 rounded-xl overflow-hidden hover:border-luxury-gold/20 transition-all duration-700 border border-luxury-deepwine/20">
                            <button class="faq-question w-full text-left p-6 flex justify-between items-center gap-4 group" aria-expanded="false" aria-controls="faq-answer-${index}">
                                <h4 class="font-normal text-luxury-cream text-sm md:text-base flex gap-4 items-start leading-relaxed tracking-wide">
                                    <span class="text-luxury-gold font-serif italic" aria-hidden="true">Q.</span> ${escapeHTML(faq.q)}
                                </h4>
                                <i class="fas fa-chevron-down text-luxury-champagne/40 group-hover:text-luxury-gold/80 transition-colors duration-500 shrink-0 text-sm" aria-hidden="true"></i>
                            </button>
                            <div id="faq-answer-${index}" class="faq-answer max-h-0 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" role="region" aria-labelledby="faq-question-${index}">
                                <div class="px-6 pb-6 pt-2">
                                    <p class="text-luxury-champagne/70 font-light text-sm md:text-base leading-relaxed flex gap-4 items-start">
                                        <span class="text-luxury-rosegold font-serif italic" aria-hidden="true">A.</span> ${escapeHTML(faq.a)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
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

        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} ฟิวแฟน เด็กเอ็น | VIP Club อัปเดต ${CURRENT_MONTH}`;
        const description = `รวมน้องๆ รับงาน${provinceName} ไซด์ไลน์${provinceName} เด็กเอ็น เกรด VIP ${safeProfiles.length} คน โซน ${(seoData.zones||['ตัวเมือง']).slice(0,3).join(', ')} ✓ตรงปก 100% ✓ไม่โอนมัดจำ ✓จ่ายเงินหน้างานเท่านั้น`;

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
                        { "@type": "ListItem", "position": 2, "name": "Exclusive Escorts", "item": `${CONFIG.DOMAIN}/profiles.html` },
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

                const animDelay = (i % 10) * 50; 
                const lsiKeyword = seoData.lsi && seoData.lsi.length > 0 ? seoData.lsi[i % seoData.lsi.length] : `รับงาน${provinceName}`;
                const myIntent = intents[i % intents.length];
                const myTrait = traits[i % traits.length];
                
                const smartAlt = `${myIntent} น้อง${cleanName} ${profileLocation} ${myTrait} ${lsiKeyword}`;

                const imageAttributes = i < 4 
                    ? 'fetchpriority="high" decoding="sync"' 
                    : 'loading="lazy" decoding="async"';

                // Subtle Status Indicator
                const statusDot = isAvailable ? 'bg-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-[#F87171] shadow-[0_0_8px_rgba(248,113,113,0.5)]';
                const statusText = isAvailable ? 'Available' : 'Reserved';

return `
<article class="block group relative rounded-2xl overflow-hidden transform transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-luxury-base border border-luxury-deepwine/40 hover:border-luxury-gold/30 animate-fade-in-up active:scale-[0.98]" style="animation-delay: ${animDelay}ms; animation-fill-mode: both;">
    
    <a href="${profileLink}" aria-label="ดูโปรไฟล์ ${smartAlt}" class="block absolute inset-0 z-30"></a>
    
    <div class="relative aspect-[4/5] w-full overflow-hidden bg-luxury-base">
        
        <img src="${optimizeImg(p.imagePath, 320, 400)}" 
             width="320" height="400"
             onerror="this.onerror=null;this.src='${CONFIG.DOMAIN}/images/default.webp';"
             alt="${smartAlt}"
             class="absolute inset-0 w-full h-full object-cover transform scale-[1.05] group-hover:scale-[1.12] transition-transform duration-[2s] ease-[cubic-bezier(0.22,1,0.36,1)]"
             style="filter: contrast(1.05) brightness(0.85) saturate(1.1); group-hover:filter: brightness(1);" 
             ${imageAttributes}>
             
        <!-- 🔥 The Critical Fix: Inner Glow Layer (ปรากฏเมื่อ Hover เท่านั้น) -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-10 shadow-[inset_0_0_50px_rgba(128,0,32,0.6)]" aria-hidden="true"></div>
        
        <!-- Deep Burgundy Gradient Overlay (Always there) -->
        <div class="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-luxury-base via-luxury-base/80 to-transparent z-10 pointer-events-none opacity-95"></div>
        
        <!-- Status Indicator -->
        <div class="absolute top-4 left-4 z-20 flex items-center gap-2 bg-luxury-base/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-luxury-deepwine/50">
            <span class="w-1.5 h-1.5 rounded-full ${statusDot}" aria-hidden="true"></span>
            <span class="text-[8px] text-luxury-cream font-light uppercase tracking-widest">${statusText}</span>
        </div>
        
        <!-- Info Area (Emerging from Darkness) -->
        <div class="absolute bottom-0 inset-x-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
            <h3 class="text-2xl md:text-4xl font-serif italic text-luxury-cream leading-tight mb-2 drop-shadow-2xl">${cleanName}</h3>
            
            <div class="flex items-center justify-between border-t border-luxury-gold/10 pt-4 mt-2">
                <div class="text-left">
                    <span class="block text-[8px] text-luxury-champagne/40 uppercase tracking-[0.3em] mb-1">Session Rate</span>
                    <span class="font-serif text-xl text-luxury-gold tracking-widest">฿${displayRate}</span>
                </div>
                <div class="h-8 w-8 rounded-full border border-luxury-gold/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-1000 transform group-hover:rotate-45">
                    <i class="fas fa-arrow-up-right text-luxury-gold text-[10px]"></i>
                </div>
            </div>
        </div>
    </div>
</article>`;
            }).join('');
        } else {
    cardsHTML = `
    <div class="col-span-full relative overflow-hidden py-32 md:py-48 text-center rounded-[3rem] border border-luxury-deepwine/20 bg-luxury-base">
        <!-- Background Artistic Elements -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(74,4,4,0.4),transparent_70%)]"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-luxury-gold/50 to-transparent"></div>
        
        <div class="relative z-10 px-6">
            <div class="mb-10 opacity-30">
                <i class="fas fa-key text-3xl text-luxury-gold"></i>
            </div>
            
            <h3 class="text-4xl md:text-7xl font-serif italic text-luxury-cream mb-8 tracking-tighter leading-none opacity-90">
                A Private <br class="md:hidden"/> Affair...
            </h3>
            
            <p class="text-luxury-champagne/50 text-sm md:text-xl max-w-2xl mx-auto font-light leading-relaxed italic tracking-wide">
                "เรากำลังคัดสรรนางแบบระดับพรีเมียมอย่างพิถีพิถัน <br class="hidden md:block"/> 
                เพื่อสร้างประสบการณ์ที่ไม่มีใครเหมือนในโซนนี้เร็วๆ นี้"
            </p>
            
            <div class="mt-16 flex flex-col md:flex-row items-center justify-center gap-6">
                <a href="/" class="btn-luxury px-12 py-4 rounded-full text-[10px] tracking-[0.4em] font-bold uppercase">
                    The Collection
                </a>
                <a href="${CONFIG.SOCIAL_LINKS.line}" class="text-luxury-gold/60 hover:text-luxury-gold text-[9px] tracking-[0.2em] uppercase font-medium transition-colors">
                    Contact Concierge
                </a>
            </div>
        </div>
        
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-luxury-deepwine to-transparent opacity-30"></div>
    </div>`;
}

        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth bg-luxury-base">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0F0505">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${provinceUrl}" />
    
    <!-- Meta Open Graph & Twitter Cards -->
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
    
    <!-- Royal Burgundy Seduction Fonts -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Prompt:wght@300;400;500&display=swap" as="style">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Prompt:wght@300;400;500&display=swap" media="print" onload="this.media='all'">
    
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
                        luxury: {
                            base: '#0F0505',
                            burgundy: '#800020',
                            deepwine: '#4A0404',
                            gold: '#D4AF37',
                            rosegold: '#B76E79',
                            cream: '#F5F5F5',
                            champagne: '#E5D3B3'
                        }
                    },
                    fontFamily: { 
                        sans:['Prompt', 'Inter', 'sans-serif'],
                        serif: ['Playfair Display', 'serif']
                    },
                    keyframes: {
                        'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                        'scale-in': { '0%': { transform: 'scale(0.97)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
                    },
                    animation: {
                        'fade-in-up': 'fade-in-up 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                        'scale-in': 'scale-in 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
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
            margin: 0; font-family: 'Prompt', sans-serif; background-color: #0F0505; color: #F5F5F5; 
            background-image: radial-gradient(circle at 50% 0%, rgba(74, 4, 4, 0.3) 0px, transparent 60%);
            background-attachment: fixed;
            -webkit-tap-highlight-color: transparent; 
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(74, 4, 4, 0.5); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.5); }

        .btn-luxury {
            background: linear-gradient(135deg, #4A0404 0%, #1A0202 100%);
            color: #E5D3B3;
            border: 1px solid rgba(212, 175, 55, 0.4);
            box-shadow: 0 4px 15px rgba(15, 5, 5, 0.8);
            transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .btn-luxury:hover {
            border-color: rgba(212, 175, 55, 0.9);
            color: #F5F5F5;
            box-shadow: 0 8px 25px rgba(74, 4, 4, 0.6);
            transform: translateY(-2px);
        }
        
        .luxury-glass {
            background: rgba(15, 5, 5, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        
        .pb-safe { padding-bottom: calc(75px + env(safe-area-inset-bottom)); }
        .pt-safe { padding-top: env(safe-area-inset-top); }
        .faq-answer { grid-template-rows: 0fr; }
        .faq-item[aria-expanded="true"] .faq-answer { grid-template-rows: 1fr; }
        .faq-item[aria-expanded="true"] .faq-question i { transform: rotate(180deg); }
    </style>
</head>

<body class="antialiased flex flex-col min-h-screen pb-safe md:pb-0">

    <!-- Desktop & Top Mobile Nav -->
    <nav aria-label="เมนูหลัก" class="fixed top-0 w-full z-50 pt-safe transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" id="navbar" style="background: rgba(15, 5, 5, 0.9); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid rgba(74, 4, 4, 0.6);">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
            <a href="/" class="flex items-center" aria-label="หน้าหลัก ${CONFIG.BRAND_NAME}">
                <img src="/images/logo-sidelinechiangmai.webp" alt="โลโก้ ${CONFIG.BRAND_NAME}" width="168" height="28" class="h-[20px] md:h-[26px] w-auto brightness-200 opacity-90" style="filter: drop-shadow(0 0 5px rgba(74,4,4,0.5));">
            </a>
            
            <div class="hidden md:flex items-center gap-10 text-[11px] font-light text-luxury-champagne/70 tracking-[0.15em] uppercase">
                <a href="/" class="hover:text-luxury-cream transition-colors duration-500">Home</a>
                <a href="/profiles.html" class="text-luxury-gold relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-luxury-gold" aria-current="page">The Collection</a>
                <a href="/locations.html" class="hover:text-luxury-cream transition-colors duration-500">Locations</a>
                <a href="/about.html" class="hover:text-luxury-cream transition-colors duration-500">The Club</a>
            </div>
            
            <div class="flex items-center gap-4">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="ติดต่อแอดมินผ่าน LINE" class="hidden md:flex items-center gap-2 btn-luxury px-7 py-2.5 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase">
                    Make Reservation
                </a>
                
                <button id="menu-btn" aria-label="เปิดเมนูนำทางบนมือถือ" aria-expanded="false" aria-controls="sidebar-menu" class="md:hidden w-10 h-10 flex items-center justify-center text-luxury-gold/80 hover:text-luxury-gold border border-luxury-deepwine/40 rounded-full transition-colors">
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </nav>

    <!-- Mobile Sidebar -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-luxury-base/95 backdrop-blur-xl z-[60] hidden opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" aria-hidden="true"></div>
    <nav id="sidebar-menu" aria-label="เมนูมือถือ" class="fixed top-0 right-0 h-full w-[280px] bg-luxury-base border-l border-luxury-deepwine/40 shadow-[-20px_0_50px_rgba(15,5,5,0.9)] z-[70] transform translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col pt-safe">
        <div class="flex items-center justify-between p-6 border-b border-luxury-deepwine/30">
            <span class="text-xs font-serif italic text-luxury-gold/80 tracking-widest">GUEST MENU</span>
            <button id="close-menu-btn" aria-label="ปิดเมนูนำทางบนมือถือ" class="w-8 h-8 flex items-center justify-center rounded-full text-luxury-champagne/60 hover:text-luxury-cream transition-colors">
                <i class="fas fa-times font-light text-lg" aria-hidden="true"></i>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-6 space-y-4 mt-2">
            <a href="/" class="block text-sm font-light text-luxury-champagne/70 hover:text-luxury-gold transition-colors tracking-wide">Home</a>
            <a href="/profiles.html" class="block text-sm font-serif italic text-luxury-gold tracking-wide">The Collection</a>
            <a href="/locations.html" class="block text-sm font-light text-luxury-champagne/70 hover:text-luxury-gold transition-colors tracking-wide">Service Areas</a>
            <a href="/about.html" class="block text-sm font-light text-luxury-champagne/70 hover:text-luxury-gold transition-colors tracking-wide">About The Club</a>
            <a href="/faq.html" class="block text-sm font-light text-luxury-champagne/70 hover:text-luxury-gold transition-colors tracking-wide">Concierge & FAQ</a>
        </div>
        <div class="p-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-full btn-luxury py-4 rounded-sm text-[10px] font-medium tracking-[0.2em] uppercase">
                Reserve Now
            </a>
        </div>
    </nav>

    <header class="pt-28 pb-10 md:pt-40 md:pb-16 px-4 relative">
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
            <!-- Text Content -->
            <div class="flex-1 text-center lg:text-left z-10 animate-fade-in-up" style="opacity: 0;">
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-luxury-gold/20 bg-transparent text-[9px] md:text-[10px] font-light text-luxury-gold uppercase tracking-[0.25em] mb-6">
                    VIP Services
                </div>
                <h1 class="text-4xl md:text-6xl lg:text-7xl font-serif text-luxury-cream leading-[1.1] mb-6 tracking-wide drop-shadow-md">
                    ไซด์ไลน์<span class="text-luxury-rosegold italic font-serif">${escapeHTML(provinceName)}</span><br/>
                    <span class="text-2xl md:text-4xl text-luxury-champagne/60 font-light italic mt-3 block">Private & Exclusive</span>
                </h1>
                <p class="text-luxury-champagne/70 text-sm md:text-base mb-10 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed tracking-wide">
                    ยกระดับการพักผ่อนด้วยบริการเพื่อนเที่ยวระดับพรีเมียม ปลอดภัย เป็นส่วนตัว และชำระเงินเมื่อพบเจอเท่านั้น สัมผัสความเหนือระดับได้ที่นี่
                </p>
                <div class="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                    <a href="#profiles-grid" class="w-full sm:w-auto btn-luxury px-10 py-4 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-center">
                        View Models
                    </a>
                </div>
            </div>
            
            <!-- Hero Image -->
            <div class="flex-1 w-full max-w-md lg:max-w-full animate-scale-in" style="opacity: 0;">
                <div class="relative rounded-t-[10rem] rounded-b-2xl overflow-hidden aspect-[3/4] md:aspect-[4/5] border border-luxury-deepwine/50 shadow-[0_20px_60px_rgba(15,5,5,0.9)] group">
                    <img src="/images/hero-sidelinechiangmai-1200.webp" 
                         srcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w"
                         sizes="(max-width: 640px) 100vw, 50vw"
                         alt="บริการรับงาน ไซด์ไลน์ ${escapeHTML(provinceName)} ระดับ VIP" 
                         width="1200" height="1500"
                         class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-[cubic-bezier(0.22,1,0.36,1)]"
                         style="filter: contrast(1.05) sepia(0.1) brightness(0.9);"
                         fetchpriority="high">
                    <div class="absolute inset-0 bg-gradient-to-t from-luxury-base via-luxury-deepwine/10 to-transparent opacity-90" aria-hidden="true"></div>
                </div>
            </div>
        </div>

        <!-- Social & Age Verification (Elegant Re-design) -->
        <section aria-label="ช่องทางติดต่อทางการ" class="max-w-6xl mx-auto mt-16 md:mt-24 px-4 animate-fade-in-up" style="animation-delay: 0.6s; opacity: 0;">
            
            <nav aria-label="โซเชียลมีเดีย" class="flex flex-wrap justify-center gap-4 md:gap-6 w-full mx-auto px-4 mb-10">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="text-luxury-champagne/50 hover:text-luxury-gold transition-colors duration-500 text-lg"><i class="fab fa-line" aria-hidden="true"></i></a>
                <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="noopener noreferrer" class="text-luxury-champagne/50 hover:text-luxury-gold transition-colors duration-500 text-lg"><i class="fab fa-x-twitter" aria-hidden="true"></i></a>
                <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="noopener noreferrer" class="text-luxury-champagne/50 hover:text-luxury-gold transition-colors duration-500 text-lg"><i class="fab fa-tiktok" aria-hidden="true"></i></a>
                <a href="${CONFIG.SOCIAL_LINKS.bluesky}" target="_blank" rel="noopener noreferrer" class="text-luxury-champagne/50 hover:text-luxury-gold transition-colors duration-500 text-lg"><i class="fas fa-cloud" aria-hidden="true"></i></a>
                <a href="${CONFIG.SOCIAL_LINKS.linktree}" target="_blank" rel="noopener noreferrer" class="text-luxury-champagne/50 hover:text-luxury-gold transition-colors duration-500 text-lg"><i class="fas fa-link" aria-hidden="true"></i></a>
            </nav>
            
            <div class="flex justify-center">
                <div class="flex items-center gap-4 px-6 py-3 border-y border-luxury-deepwine/40">
                    <span class="text-luxury-rosegold text-xs font-serif italic">Exclusive</span>
                    <div class="w-px h-4 bg-luxury-deepwine/50"></div>
                    <span class="text-[9px] text-luxury-champagne/60 tracking-[0.2em] uppercase font-light">Age 20+ Members Only</span>
                </div>
            </div>
        </section>
    </header>

    <main class="w-full relative z-20">
        <!-- Elegant Filter Bar -->
        <nav aria-label="ตัวกรองและหมวดหมู่" class="sticky top-16 md:top-20 z-40 bg-luxury-base/80 backdrop-blur-xl border-y border-luxury-deepwine/30 py-4 px-4 shadow-[0_10px_30px_rgba(15,5,5,0.8)]">
            <div class="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar gap-4 items-center snap-x">
                <button aria-label="กรองข้อมูลล่าสุด" class="snap-start shrink-0 text-luxury-gold border-b border-luxury-gold px-2 py-1 text-[10px] md:text-xs font-medium tracking-[0.15em] uppercase">Latest Additions</button>
                <button aria-label="กรองโปรไฟล์มาแรง" class="snap-start shrink-0 text-luxury-champagne/50 hover:text-luxury-cream px-2 py-1 text-[10px] md:text-xs font-light tracking-[0.15em] uppercase transition-colors">Trending</button>
                <button aria-label="เลือกโซนให้บริการ" class="snap-start shrink-0 text-luxury-champagne/50 hover:text-luxury-cream px-2 py-1 text-[10px] md:text-xs font-light tracking-[0.15em] uppercase transition-colors flex items-center gap-1.5">Zone <i class="fas fa-chevron-down text-[8px]" aria-hidden="true"></i></button>
            </div>
        </nav>

        <section id="profiles-grid" aria-label="รายการโปรไฟล์น้องๆ" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24 scroll-mt-28">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h2 class="text-2xl md:text-4xl font-serif text-luxury-cream tracking-wide">The <span class="text-luxury-rosegold italic">Collection</span></h2>
                </div>
                <div class="text-[9px] text-luxury-champagne/50 tracking-[0.1em] uppercase font-light">
                    Last Update: ${new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}
                </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                ${cardsHTML}
            </div>
            
            ${safeProfiles.length >= 80 ? `
            <div class="mt-20 text-center">
                <a href="/search?province=${provinceKey}" aria-label="โหลดโปรไฟล์เพิ่มเติม" class="inline-block border border-luxury-gold/30 text-luxury-gold px-12 py-4 rounded-full text-[10px] font-medium tracking-[0.25em] uppercase hover:bg-luxury-gold hover:text-luxury-base transition-colors duration-500">
                    Discover More
                </a>
            </div>` : ''}
        </section>

        <div class="max-w-7xl mx-auto">
            ${generateAppSeoText(provinceName, provinceKey, safeProfiles.length)}
        </div>
    </main>

    <footer class="bg-luxury-base border-t border-luxury-deepwine/40 pt-20 pb-32 md:pb-20 text-left relative z-10 shadow-[0_-20px_50px_rgba(15,5,5,0.9)]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                <div class="md:col-span-5 space-y-6">
                    <img src="/images/logo-sidelinechiangmai.webp" alt="โลโก้ ${CONFIG.BRAND_NAME}" class="h-5 w-auto brightness-200 opacity-80" width="168" height="28" loading="lazy">
                    <p class="text-xs md:text-sm text-luxury-champagne/50 leading-relaxed font-light max-w-sm tracking-wide">
                        คลับส่วนตัวระดับพรีเมียม ศูนย์รวมนางแบบที่ปลอดภัย คัดกรองอย่างเข้มงวดและรักษาความลับลูกค้าเป็นอันดับหนึ่ง
                    </p>
                </div>

                <nav aria-label="ลิงก์ส่วนต่างๆ ภายในเว็บ" class="md:col-span-3">
                    <h3 class="text-luxury-gold text-[10px] font-bold mb-6 tracking-[0.25em] uppercase font-serif">Explore</h3>
                    <ul class="space-y-4 text-xs md:text-sm font-light text-luxury-champagne/70 tracking-wide">
                        <li><a href="/profiles.html" class="hover:text-luxury-cream transition-colors">Exclusive Models</a></li>
                        <li><a href="/locations.html" class="hover:text-luxury-cream transition-colors">Service Areas</a></li>
                        <li><a href="/faq.html" class="hover:text-luxury-cream transition-colors">How to Book</a></li>
                        <li><a href="/about.html" class="hover:text-luxury-cream transition-colors">The Club</a></li>
                    </ul>
                </nav>

                <nav aria-label="พื้นที่ให้บริการทั้งหมด" class="md:col-span-4">
                    <h3 class="text-luxury-rosegold text-[10px] font-bold mb-6 tracking-[0.25em] uppercase font-serif">Locations</h3>
                    <ul class="flex flex-col gap-3 text-xs md:text-sm font-light text-luxury-champagne/70 h-[140px] overflow-y-auto pr-3 custom-scrollbar tracking-wide">
                        ${allProvinces.map(p => `
                            <li>
                                <a href="/location/${p.key}" class="hover:text-luxury-cream transition-colors flex items-center justify-between group">
                                    <span>${escapeHTML(p.nameThai)}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </nav>
            </div>

            <div class="border-t border-luxury-deepwine/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <p class="text-[9px] text-luxury-champagne/40 uppercase tracking-[0.2em] font-light">&copy; ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. All rights reserved.</p>
                <div class="flex gap-6 text-[9px] text-luxury-champagne/40 uppercase tracking-[0.2em] font-light">
                    <a href="/privacy-policy.html" class="hover:text-luxury-cream transition-colors">Privacy</a>
                    <a href="/terms.html" class="hover:text-luxury-cream transition-colors">Terms</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Mobile Bottom App Nav (VIP Glassmorphism) -->
    <nav aria-label="เมนูนำทางหลักบนมือถือ" class="fixed bottom-0 left-0 w-full md:hidden z-50 pb-[env(safe-area-inset-bottom)]" style="background: rgba(15, 5, 5, 0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid rgba(74, 4, 4, 0.4);">
        <ul class="flex items-center justify-around h-[70px] px-2 m-0 list-none">
            <li class="w-full h-full">
                <a href="/" class="flex flex-col items-center justify-center w-full h-full text-luxury-champagne/50 hover:text-luxury-gold transition-colors">
                    <i class="fas fa-home text-[16px] mb-1.5 font-light" aria-hidden="true"></i>
                    <span class="text-[8px] font-light tracking-[0.1em] uppercase">Home</span>
                </a>
            </li>
            <li class="w-full h-full">
                <a href="/profiles.html" class="flex flex-col items-center justify-center w-full h-full text-luxury-gold">
                    <i class="fas fa-gem text-[16px] mb-1.5 drop-shadow-[0_0_5px_rgba(212,175,55,0.3)]" aria-hidden="true"></i>
                    <span class="text-[8px] font-medium tracking-[0.1em] uppercase font-serif">Models</span>
                </a>
            </li>
            <li class="w-full h-full relative">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center justify-center w-full h-full group absolute -top-6 left-0">
                    <div class="w-14 h-14 bg-luxury-base rounded-full flex items-center justify-center text-luxury-gold border border-luxury-gold/40 shadow-[0_5px_15px_rgba(15,5,5,0.9)] group-active:scale-95 transition-transform duration-300">
                        <i class="fas fa-paper-plane text-[18px]" aria-hidden="true"></i>
                    </div>
                </a>
            </li>
            <li class="w-full h-full">
                <a href="/locations.html" class="flex flex-col items-center justify-center w-full h-full text-luxury-champagne/50 hover:text-luxury-gold transition-colors">
                    <i class="fas fa-map-marker-alt text-[16px] mb-1.5 font-light" aria-hidden="true"></i>
                    <span class="text-[8px] font-light tracking-[0.1em] uppercase">Zones</span>
                </a>
            </li>
            <li class="w-full h-full">
                <a href="/search" class="flex flex-col items-center justify-center w-full h-full text-luxury-champagne/50 hover:text-luxury-gold transition-colors">
                    <i class="fas fa-search text-[16px] mb-1.5 font-light" aria-hidden="true"></i>
                    <span class="text-[8px] font-light tracking-[0.1em] uppercase">Search</span>
                </a>
            </li>
        </ul>
    </nav>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        // App-like Navbar Hide/Show
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

        // Sidebar
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
                setTimeout(() => overlay.classList.add('hidden'), 700);
            }
        }

        if(menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
        if(closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
        if(overlay) overlay.addEventListener('click', () => toggleMenu(false));
        
        // FAQ Accordion
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

        // Intersection Observer for Smooth Entrances
        const observerOptions = { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll('#profiles-grid article, header > div > div, header section');
        animateElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
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
        console.error('SSR Critical Error:', e);
        return new Response('<div style="font-family:\'Playfair Display\', serif;text-align:center;padding:50px;color:#D4AF37;background:#0F0505;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="width:50px;height:50px;border:1px solid #4A0404;border-top-color:#D4AF37;border-radius:50%;animation:spin 1.5s cubic-bezier(0.22,1,0.36,1) infinite;margin-bottom:20px;"></div><style>@keyframes spin { 100% { transform: rotate(360deg); } }</style><h1 style="font-size:14px;font-weight:normal;letter-spacing:0.3em;font-style:italic;">Curating Elegance...</h1></div>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
}