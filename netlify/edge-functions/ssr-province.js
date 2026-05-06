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

const optimizeImg = (path, width = 400, height = 500) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        if (path.includes('/upload/')) {
            return path.replace('/upload/', `/upload/f_auto,q_auto:good,w_${width},h_${height},c_fill,g_face/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=75`;
};

// ==========================================
// APP-STYLE SEO & CONTENT GENERATOR 
// ==========================================
const generateAppSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    return `
    <section class="mt-12 md:mt-20 mb-10 px-4">
        <div class="bg-gradient-to-b from-zinc-900 to-black rounded-[2.5rem] border border-white/5 p-6 md:p-12 relative overflow-hidden shadow-2xl">
            <div class="absolute -top-32 -right-32 w-[300px] h-[300px] bg-rose-600/10 blur-[80px] rounded-full pointer-events-none"></div>
            <div class="absolute -bottom-32 -left-32 w-[300px] h-[300px] bg-pink-600/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div class="relative z-10 text-center max-w-3xl mx-auto mb-10">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-4">
                    <i class="fas fa-crown"></i> Exclusive Guide
                </span>
                <h2 class="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                    ทำไมต้องเลือก <br class="md:hidden"/><span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">ไซด์ไลน์${provinceName}</span> กับเรา?
                </h2>
                <p class="text-zinc-400 text-sm md:text-base leading-relaxed">
                    ${data.uniqueIntro} คัดสรรน้องๆ ระดับ Top Class กว่า <strong class="text-white">${count} ท่าน</strong>
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
                <div class="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                    <div class="w-12 h-12 bg-gradient-to-br from-rose-500/20 to-pink-500/10 rounded-2xl flex items-center justify-center text-rose-400 text-xl mb-4 border border-rose-500/20">
                        <i class="fas fa-map-marked-alt"></i>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-3">ครอบคลุมทุกโซนใน${provinceName}</h3>
                    <div class="flex flex-wrap gap-2">
                        ${(data.zones ||['ตัวเมือง']).slice(0, 6).map(z => `<span class="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-zinc-300 border border-white/5">${z}</span>`).join('')}
                    </div>
                </div>

                <div class="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                    <div class="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-2xl flex items-center justify-center text-emerald-400 text-xl mb-4 border border-emerald-500/20">
                        <i class="fas fa-shield-check"></i>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-3">มาตรฐานความปลอดภัยสูงสุด</h3>
                    <ul class="space-y-3">
                        <li class="flex items-center gap-3 text-sm text-zinc-400"><i class="fas fa-check-circle text-emerald-500"></i> <strong class="text-white">ไม่มัดจำ:</strong> เจอตัวจริงค่อยจ่ายเงิน</li>
                        <li class="flex items-center gap-3 text-sm text-zinc-400"><i class="fas fa-check-circle text-emerald-500"></i> <strong class="text-white">ตรงปก:</strong> ตรวจสอบโปรไฟล์ทุกเคส</li>
                        <li class="flex items-center gap-3 text-sm text-zinc-400"><i class="fas fa-check-circle text-emerald-500"></i> <strong class="text-white">ความลับ:</strong> ปกปิดข้อมูลลูกค้า 100%</li>
                    </ul>
                </div>
            </div>

            ${data.faqs && data.faqs.length > 0 ? `
            <div class="mt-10 relative z-10 border-t border-white/5 pt-10">
                <h3 class="text-xl font-bold text-white mb-6 text-center">คำถามที่พบบ่อย (FAQ)</h3>
                <div class="space-y-4 max-w-4xl mx-auto" id="faq-accordion">
                    ${data.faqs.map((faq, index) => `
                        <div class="faq-item bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                            <button class="faq-question w-full text-left p-5 md:p-6 flex justify-between items-center gap-4 group" aria-expanded="false" aria-controls="faq-answer-${index}">
                                <h4 class="font-bold text-white text-sm md:text-base flex gap-2 items-start">
                                    <span class="text-rose-500">Q:</span> ${faq.q}
                                </h4>
                                <i class="fas fa-chevron-down text-zinc-400 group-hover:text-white transition-transform duration-300 shrink-0"></i>
                            </button>
                            <div id="faq-answer-${index}" class="faq-answer max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                                <div class="px-5 md:px-6 pb-5 md:pb-6">
                                    <p class="text-zinc-400 text-sm md:text-base leading-relaxed flex gap-2 items-start border-t border-white/10 pt-4">
                                        <span class="text-zinc-400">A:</span> ${faq.a}
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

// ==========================================
// MAIN SSR EDGE FUNCTION
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

        const title = `ไซด์ไลน์${provinceName} รับงาน${provinceName} ฟิวแฟน เด็กเอ็น | ไม่มัดจำ อัปเดต ${CURRENT_MONTH}`;
        const description = `รวมน้องๆ รับงาน${provinceName} ไซด์ไลน์${provinceName} เด็กเอ็น เกรด VIP ${safeProfiles.length} คน โซน ${(seoData.zones||['ตัวเมือง']).slice(0,3).join(', ')} ✓ตรงปก 100% ✓ไม่โอนมัดจำ ✓จ่ายเงินหน้างาน`;

        const priceParts = (seoData.avgPrice || "1,500 - 3,500").split('-');
        const startPrice = priceParts[0] ? priceParts[0].trim() : "1,500";
        const endPrice = priceParts[1] ? priceParts[1].trim() : "5,000";
        const validUntil = new Date(now.setFullYear(now.getFullYear() + 1)).toISOString().split('T')[0];

        // ---------------------------------------------------------
        // Schema.org For Local SEO
        // ---------------------------------------------------------
        const schemaData = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "WebSite",
                    "@id": `${CONFIG.DOMAIN}/#website`,
                    "url": CONFIG.DOMAIN,
                    "name": CONFIG.BRAND_NAME,
                    "potentialAction": { "@type": "SearchAction", "target": `${CONFIG.DOMAIN}/search?q={search_term_string}`, "query-input": "required name=search_term_string" }
                },
                {
                    "@type": "CollectionPage",
                    "@id": `${provinceUrl}/#webpage`,
                    "url": provinceUrl,
                    "name": title,
                    "description": description,
                    "isPartOf": { "@id": `${CONFIG.DOMAIN}/#website` },
                    "breadcrumb": { "@id": `${provinceUrl}/#breadcrumb` }
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
                    "address": { "@type": "PostalAddress", "addressRegion": provinceName, "addressCountry": "TH" },
                    "geo": { "@type": "GeoCoordinates", "latitude": seoData.geo.lat, "longitude": seoData.geo.lng },
                    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": String(safeProfiles.length * 12 + 85), "bestRating": "5", "worstRating": "1" },
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

        // UI/UX APP-STYLE PROFILE CARDS
        let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                const cleanName = (p.name || 'ไม่ระบุชื่อ').replace(/^(น้อง\s?)/, '');
                const profileLocation = p.location || provinceName;
                const isAvailable = !['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'].some(kw => (p.availability || '').toLowerCase().includes(kw));
                const profileLink = `/sideline/${p.slug || p.id}`;
                const mockRating = (4.8 + Math.random() * 0.2).toFixed(1); 
                const animDelay = (i % 10) * 50;
                const lsiKeyword = seoData.lsi && seoData.lsi.length > 0 ? seoData.lsi[i % seoData.lsi.length] : `รับงาน${provinceName}`;
                
                // Prioritize LCP images
                const loadingAttr = i < 4 ? 'fetchpriority="high"' : 'loading="lazy"';

                return `
                <a href="${profileLink}" class="block group relative bg-zinc-900 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.3)] animate-fade-in-up active:scale-95" style="animation-delay: ${animDelay}ms; animation-fill-mode: both;" aria-label="ดูโปรไฟล์น้อง ${cleanName}">
                    <div class="relative aspect-[4/5] w-full overflow-hidden bg-zinc-950">
                        <img src="${optimizeImg(p.imagePath, 400, 500)}" 
                             width="400" height="500"
                             onerror="this.onerror=null;this.src='${CONFIG.DOMAIN}/images/default.webp';"
                             alt="${cleanName} ${lsiKeyword}"
                             class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                             ${loadingAttr}>
                        
                        <div class="absolute top-3 left-3 md:top-4 md:left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/10 shadow-lg">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${isAvailable ? 'bg-green-400' : 'bg-red-400'} opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}"></span>
                            </span>
                            <span class="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider">${isAvailable ? 'พร้อมรับงาน' : 'ติดจอง'}</span>
                        </div>
                        
                        ${(i < 3 || p.isfeatured) ? `
                        <div class="absolute top-3 right-3 md:top-4 md:right-4 z-20 bg-gradient-to-r from-rose-500 to-pink-600 px-2.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1">
                            <i class="fas fa-fire text-white text-[9px] md:text-[10px] animate-pulse"></i>
                            <span class="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider">งานดี</span>
                        </div>` : ''}
                        
                        <div class="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none"></div>
                        
                        <div class="absolute bottom-0 inset-x-0 p-4 md:p-5 z-20">
                            <div class="flex items-end justify-between gap-2">
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-xl md:text-3xl font-bold text-white leading-none mb-1.5 truncate drop-shadow-lg">${cleanName}</h3>
                                    <div class="flex items-center gap-1.5 text-zinc-300 text-[10px] md:text-sm">
                                        <i class="fas fa-map-marker-alt text-rose-400"></i>
                                        <span class="truncate">${profileLocation}</span>
                                    </div>
                                </div>
                                <div class="text-right shrink-0">
                                    <span class="block text-[9px] md:text-[10px] text-zinc-400 font-medium uppercase tracking-wider mb-0.5">เรทเริ่ม</span>
                                    <span class="font-black text-lg md:text-xl text-white drop-shadow-md tracking-tight">฿${p.rate || 'สอบถาม'}</span>
                                </div>
                            </div>
                            
                            <div class="mt-3 md:mt-4 flex items-center justify-between md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
                                <div class="flex items-center gap-1 text-yellow-400 text-[10px] md:text-xs font-bold bg-white/10 backdrop-blur-sm px-2 py-1 rounded-lg">
                                    <i class="fas fa-star"></i> ${mockRating}
                                </div>
                                <div class="bg-white text-black text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-1.5">
                                    ดูโปรไฟล์ <i class="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>`;
            }).join('');
        } else {
            cardsHTML = `<div class="col-span-full flex flex-col items-center justify-center py-24 text-center">
                <i class="fas fa-hourglass-half text-4xl text-zinc-700 mb-4 animate-pulse"></i>
                <h3 class="text-xl font-bold text-white mb-2">กำลังอัปเดตระบบ</h3>
                <p class="text-zinc-400 text-sm">ไม่พบโปรไฟล์ในโซนนี้ขณะนี้ กรุณาลองใหม่อีกครั้ง</p>
            </div>`;
        }

        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth bg-black">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#000000">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${provinceUrl}" />
    
    <!-- Meta Open Graph -->
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">

    <!-- High Performance Loading & Preconnects -->
    <link rel="preconnect" href="https://cdn.tailwindcss.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://zxetzqwjaiumqhrpumln.supabase.co" crossorigin>
    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
    
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Prompt:wght@300;400;500;600;700;800&display=swap" as="style">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Prompt:wght@300;400;500;600;700;800&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Prompt:wght@300;400;500;600;700;800&display=swap"></noscript>
    
    <!-- Hero Image Preload -->
    <link rel="preload" as="image" href="/images/hero-sidelinechiangmai-600.webp" media="(max-width: 640px)" fetchpriority="high">
    <link rel="preload" as="image" href="/images/hero-sidelinechiangmai-1200.webp" media="(min-width: 641px)" fetchpriority="high">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { zinc: { 900: '#18181b', 950: '#09090b' } },
                    fontFamily: { sans:['Prompt', 'Inter', 'sans-serif'] },
                    keyframes: {
                        'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                        'scale-in': { '0%': { transform: 'scale(0.9)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
                        'slide-in': { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } }
                    },
                    animation: {
                        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        'scale-in': 'scale-in 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        'slide-in': 'slide-in 0.3s ease-out forwards'
                    }
                }
            }
        }
    </script>

    <!-- FontAwesome -->
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

    <style>
        body { 
            margin: 0; font-family: 'Prompt', sans-serif; background-color: #000; color: #fff; 
            background-image: radial-gradient(at 50% 0%, rgba(225, 29, 72, 0.15) 0px, transparent 60%);
            -webkit-tap-highlight-color: transparent; 
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); }

        .glass-nav { background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .glass-bottom { background: rgba(10, 10, 10, 0.9); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid rgba(255, 255, 255, 0.1); }
        
        .pb-safe { padding-bottom: calc(70px + env(safe-area-inset-bottom)); }
        .pt-safe { padding-top: env(safe-area-inset-top); }
        .faq-answer { grid-template-rows: 0fr; }
        .faq-item[aria-expanded="true"] .faq-answer { grid-template-rows: 1fr; }
        .faq-item[aria-expanded="true"] .faq-question i { transform: rotate(180deg); }
    </style>
</head>

<body class="antialiased flex flex-col min-h-screen pb-safe md:pb-0">

    <!-- Top App Bar -->
    <nav class="fixed top-0 w-full z-50 glass-nav pt-safe transition-transform duration-300" id="navbar">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-20 flex items-center justify-between">
            <a href="/" class="flex items-center" aria-label="หน้าหลัก ${CONFIG.BRAND_NAME}">
                <img src="/images/logo-sidelinechiangmai.webp" alt="Logo" width="168" height="28" class="h-[24px] md:h-[30px] w-auto brightness-200">
            </a>
            
            <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                <a href="/" class="hover:text-white transition-colors">หน้าแรก</a>
                <a href="/profiles.html" class="text-white font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-pink-500 after:to-rose-500">น้องๆ VIP</a>
                <a href="/locations.html" class="hover:text-white transition-colors">พิกัดบริการ</a>
                <a href="/about.html" class="hover:text-white transition-colors">เกี่ยวกับเรา</a>
                <a href="/blog.html" class="hover:text-white transition-colors">บทความ</a>
            </div>
            
            <div class="flex items-center gap-3">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="ติดต่อแอดมินผ่าน LINE" class="hidden md:flex items-center gap-2 bg-[#048839] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#03702e] transition-colors">
                    <i class="fab fa-line text-lg"></i> แอดไลน์จอง
                </a>
                
                <button id="menu-btn" aria-label="เปิดเมนูนำทาง" class="md:hidden w-10 h-10 flex items-center justify-center text-white bg-white/5 rounded-full border border-white/10 hover:bg-white/10">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </nav>

    <!-- Slide-out Sidebar Menu (Mobile) -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] hidden opacity-0 transition-opacity duration-300"></div>
    <div id="sidebar-menu" class="fixed top-0 right-0 h-full w-72 bg-zinc-950 border-l border-white/10 z-[70] transform translate-x-full transition-transform duration-300 flex flex-col pt-safe">
        <div class="flex items-center justify-between p-5 border-b border-white/5">
            <h2 class="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 uppercase tracking-widest">Menu</h2>
            <button id="close-menu-btn" aria-label="ปิดเมนูนำทาง" class="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
            <a href="/" class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"><i class="fas fa-home w-6 text-center text-rose-500"></i> หน้าแรก</a>
            <a href="/profiles.html" class="flex items-center gap-4 p-3 rounded-xl bg-white/5 text-white font-bold border border-white/5"><i class="fas fa-gem w-6 text-center text-rose-500"></i> น้องๆ VIP</a>
            <a href="/locations.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"><i class="fas fa-map-marker-alt w-6 text-center text-rose-500"></i> พิกัดบริการ</a>
            <a href="/about.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"><i class="fas fa-info-circle w-6 text-center text-rose-500"></i> เกี่ยวกับเรา</a>
            <a href="/faq.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"><i class="fas fa-question-circle w-6 text-center text-rose-500"></i> คำถามพบบ่อย</a>
            <a href="/blog.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"><i class="fas fa-newspaper w-6 text-center text-rose-500"></i> บทความ</a>
        </div>
        <div class="p-5 border-t border-white/5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="ติดต่อแอดมินผ่าน LINE" class="flex items-center justify-center gap-2 w-full bg-[#048839] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(4,136,57,0.3)] hover:bg-[#03702e] transition-colors">
                <i class="fab fa-line text-xl"></i> ติดต่อแอดมิน
            </a>
        </div>
    </div>

    <!-- Cinematic Hero Section -->
    <header class="pt-24 pb-8 md:pt-32 md:pb-16 px-4">
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div class="flex-1 text-center lg:text-left z-10 animate-fade-in-up">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-semibold text-white uppercase tracking-widest mb-4 md:mb-6">
                    <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-500 animate-pulse"></span> Exclusive Escort
                </div>
                <h1 class="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-4 md:mb-6 tracking-tight">
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">${provinceName}</span><br/>
                    Premium Service
                </h1>
                <p class="text-zinc-400 text-sm md:text-lg mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 font-light">
                    ยกระดับการพักผ่อนด้วยบริการระดับ VIP ตรงปก ปลอดภัย ไม่มีการบังคับโอนมัดจำล่วงหน้า จ่ายเงินเมื่อเจอตัวจริงเท่านั้น
                </p>
                <div class="flex flex-col sm:flex-row items-center gap-3 md:gap-4 justify-center lg:justify-start">
                    <a href="#profiles-grid" class="w-full sm:w-auto bg-white text-black px-8 py-3.5 md:py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform text-center shadow-lg">
                        ดูโปรไฟล์น้องๆ
                    </a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="ติดต่อแอดมินผ่าน LINE" class="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-8 py-3.5 md:py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                        <i class="fab fa-line text-lg"></i> ปรึกษาแอดมิน
                    </a>
                </div>
            </div>
            
            <div class="flex-1 w-full max-w-md lg:max-w-full animate-scale-in">
                <div class="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden aspect-[4/5] md:aspect-square border border-white/10 shadow-[0_0_40px_rgba(225,29,72,0.15)] group">
                    <img src="/images/hero-sidelinechiangmai-1200.webp" 
                         srcset="/images/hero-sidelinechiangmai-600.webp 600w, /images/hero-sidelinechiangmai-800.webp 800w, /images/hero-sidelinechiangmai-1200.webp 1200w"
                         sizes="(max-width: 640px) 100vw, 50vw"
                         alt="VIP Escort ${provinceName}" 
                         width="1200" height="1200"
                         class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                         fetchpriority="high">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                        <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg"><i class="fas fa-shield-check text-lg md:text-xl"></i></div>
                        <div>
                            <p class="text-white font-bold text-sm tracking-wide">Verified & Safe</p>
                            <p class="text-zinc-400 text-[10px] md:text-xs font-light mt-0.5">คัดกรองประวัติและยืนยันตัวตนแล้ว</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Social Marquee -->
        <div class="max-w-4xl mx-auto mt-10 md:mt-16 px-4 animate-fade-in-up" style="animation-delay: 0.4s;">
            <div class="text-center mb-4">
                <p class="text-xs md:text-sm text-zinc-400 font-medium uppercase tracking-widest">Connect With Us</p>
            </div>
            <div class="overflow-x-auto no-scrollbar pb-4">
                <div class="flex flex-nowrap justify-start sm:justify-center gap-3 w-max mx-auto px-2">
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="nofollow noopener" class="inline-flex items-center gap-2 px-4 py-2 bg-[#00c300]/10 border border-[#00c300]/30 rounded-full text-xs font-bold text-[#00c300] hover:bg-[#00c300]/20 transition-colors"><i class="fab fa-line text-sm"></i> LINE</a>
                    <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="nofollow noopener" class="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/30 rounded-full text-xs font-bold text-sky-400 hover:bg-sky-500/20 transition-colors"><i class="fab fa-twitter text-sm"></i> Twitter</a>
                    <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="nofollow noopener" class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-white hover:bg-white/20 transition-colors"><i class="fab fa-tiktok text-sm"></i> TikTok</a>
                </div>
            </div>
            
            <div class="mt-2 flex justify-center">
                <span class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-inner backdrop-blur-sm">
                    <i class="fas fa-exclamation-triangle"></i> เว็บไซต์นี้สำหรับผู้ที่มีอายุ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น
                </span>
            </div>
        </div>
    </header>

    <main class="w-full">
        <!-- Sticky Horizontal Filter Bar -->
        <div class="sticky top-14 md:top-20 z-40 bg-black/80 backdrop-blur-xl border-y border-white/5 py-2.5 md:py-3 px-4 shadow-xl">
            <div class="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar gap-2.5 items-center snap-x">
                <button aria-label="กรองล่าสุด" class="snap-start shrink-0 bg-white text-black px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap">ล่าสุด</button>
                <button aria-label="กรองมาแรง" class="snap-start shrink-0 bg-zinc-900 border border-white/10 text-white px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap hover:bg-zinc-800 flex items-center gap-1.5"><i class="fas fa-fire text-rose-500"></i> มาแรง</button>
                <button aria-label="เลือกโซน" class="snap-start shrink-0 bg-zinc-900 border border-white/10 text-white px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap hover:bg-zinc-800 flex items-center gap-1.5"><i class="fas fa-map-marker-alt text-rose-400"></i> เลือกโซน <i class="fas fa-chevron-down text-[10px] ml-1 opacity-50"></i></button>
                <button aria-label="ราคาต่ำกว่า 2000" class="snap-start shrink-0 bg-zinc-900 border border-white/10 text-white px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap hover:bg-zinc-800">< 2,000 ฿</button>
                <button aria-label="ราคา 2000 ถึง 3500" class="snap-start shrink-0 bg-zinc-900 border border-white/10 text-white px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap hover:bg-zinc-800">2,000 - 3,500 ฿</button>
            </div>
        </div>

        <!-- Profiles Grid Area -->
        <div id="profiles-grid" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 scroll-mt-24">
            <div class="flex items-end justify-between mb-6 md:mb-8">
                <div>
                    <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">Discover</h2>
                    <p class="text-zinc-400 text-[10px] md:text-sm font-light mt-1">คอลเลกชันน้องๆ ไซด์ไลน์ โซน${provinceName}</p>
                </div>
                <div class="text-[10px] md:text-xs text-zinc-400 flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span> อัปเดต: ${new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}
                </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 lg:gap-6">
                ${cardsHTML}
            </div>
            
            ${safeProfiles.length >= 80 ? `
            <div class="mt-12 md:mt-16 text-center">
                <a href="/search?province=${provinceKey}" class="inline-flex items-center gap-2 bg-zinc-900 border border-white/10 text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest group">
                    โหลดข้อมูลเพิ่มเติม <i class="fas fa-arrow-down text-rose-500 group-hover:translate-y-1 transition-transform"></i>
                </a>
            </div>` : ''}
        </div>

        <!-- SEO Editorial Content -->
        <div class="max-w-7xl mx-auto">
            ${generateAppSeoText(provinceName, provinceKey, safeProfiles.length)}
        </div>
    </main>

    <!-- Luxury Footer -->
    <footer class="bg-zinc-950 border-t border-white/5 pt-12 pb-24 md:pb-12 text-left relative z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                <div class="md:col-span-5 space-y-5">
                    <img src="/images/logo-sidelinechiangmai.webp" alt="Logo" class="h-8 w-auto brightness-200" width="168" height="28" loading="lazy">
                    <p class="text-sm text-zinc-400 leading-relaxed font-light max-w-sm">
                        คลับพักผ่อนระดับพรีเมียม ศูนย์รวมนางแบบและเพื่อนเที่ยวที่ปลอดภัย เราคัดกรองโปรไฟล์อย่างเข้มงวดและรักษาความลับลูกค้าเป็นอันดับหนึ่ง
                    </p>
                </div>

                <div class="md:col-span-3">
                    <h3 class="text-white text-sm font-bold mb-6 tracking-widest uppercase">Explore</h3>
                    <ul class="space-y-4 text-sm font-medium text-zinc-400">
                        <li><a href="/profiles.html" class="hover:text-rose-400 transition-colors">ค้นหาน้องๆ VIP</a></li>
                        <li><a href="/locations.html" class="hover:text-rose-400 transition-colors">โซนให้บริการ</a></li>
                        <li><a href="/faq.html" class="hover:text-rose-400 transition-colors">ขั้นตอนการจอง</a></li>
                        <li><a href="/about.html" class="hover:text-rose-400 transition-colors">เกี่ยวกับเรา</a></li>
                        <li><a href="/blog.html" class="hover:text-rose-400 transition-colors">บทความน่ารู้</a></li>
                    </ul>
                </div>

                <div class="md:col-span-4">
                    <h3 class="text-white text-sm font-bold mb-6 tracking-widest uppercase">พื้นที่ให้บริการทั้งหมด</h3>
                    <div class="flex flex-col gap-3 text-sm font-medium text-zinc-400 h-[180px] overflow-y-auto pr-3 custom-scrollbar">
                        ${allProvinces.map(p => `
                            <a href="/location/${p.key}" class="hover:text-rose-400 transition-colors flex items-center justify-between group">
                                <div class="flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-rose-500 transition-colors"></span>
                                    รับงาน${p.nameThai}
                                </div>
                                <i class="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-rose-500"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <p class="text-[10px] md:text-xs text-zinc-400 uppercase tracking-widest font-medium">&copy; ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. All rights reserved.</p>
                <div class="flex gap-6 text-[10px] md:text-xs text-zinc-400 font-medium uppercase tracking-widest justify-center">
                    <a href="/privacy-policy.html" class="hover:text-white transition-colors">Privacy</a>
                    <a href="/terms.html" class="hover:text-white transition-colors">Terms</a>
                </div>
            </div>
            
            <p class="mt-6 text-[10px] text-zinc-400 leading-relaxed font-light text-center">
                แพลตฟอร์มนี้เป็นเพียงสื่อกลางข้อมูล การติดต่อและชำระเงินเกิดขึ้นระหว่างลูกค้าและผู้ให้บริการโดยตรง จัดทำขึ้นสำหรับผู้มีอายุ 20 ปีขึ้นไปเท่านั้น
            </p>
        </div>
    </footer>

    <!-- MOBILE BOTTOM NAVIGATION (App UI for Mobile Only) -->
    <div class="fixed bottom-0 left-0 w-full glass-bottom md:hidden z-50 pb-[env(safe-area-inset-bottom)]">
        <div class="flex items-center justify-around h-[60px] px-2">
            <a href="/" class="flex flex-col items-center justify-center w-full h-full text-zinc-400 hover:text-white transition-colors">
                <i class="fas fa-home text-[18px] mb-1"></i>
                <span class="text-[9px] font-medium tracking-wide">หน้าแรก</span>
            </a>
            <a href="/profiles.html" class="flex flex-col items-center justify-center w-full h-full text-rose-500">
                <i class="fas fa-gem text-[18px] mb-1 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"></i>
                <span class="text-[9px] font-bold tracking-wide">VIP</span>
            </a>
            
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" aria-label="ติดต่อแอดมินผ่าน LINE" class="flex flex-col items-center justify-center w-full h-full group relative -top-4">
                <div class="w-12 h-12 bg-gradient-to-tr from-[#048839] to-[#03702e] rounded-full flex items-center justify-center text-white shadow-[0_5px_15px_rgba(4,136,57,0.4)] group-active:scale-95 transition-transform border-[3px] border-black">
                    <i class="fab fa-line text-[22px]"></i>
                </div>
                <span class="text-[10px] font-bold text-white mt-1 uppercase tracking-wider">จองคิว</span>
            </a>

            <a href="/locations.html" class="flex flex-col items-center justify-center w-full h-full text-zinc-400 hover:text-white transition-colors">
                <i class="fas fa-map-marker-alt text-[18px] mb-1"></i>
                <span class="text-[9px] font-medium tracking-wide">พื้นที่</span>
            </a>
            <a href="/search" class="flex flex-col items-center justify-center w-full h-full text-zinc-400 hover:text-white transition-colors">
                <i class="fas fa-search text-[18px] mb-1"></i>
                <span class="text-[9px] font-medium tracking-wide">ค้นหา</span>
            </a>
        </div>
    </div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        // App-like Navbar Hide/Show on Scroll
        let lastScrollY = window.scrollY;
        const navbar = document.getElementById('navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                if (window.scrollY > lastScrollY) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                    navbar.classList.add('shadow-lg');
                }
            } else {
                navbar.style.transform = 'translateY(0)';
                navbar.classList.remove('shadow-lg');
            }
            lastScrollY = window.scrollY;
        }, { passive: true });

        // Sidebar Menu Logic
        const menuBtn = document.getElementById('menu-btn');
        const closeBtn = document.getElementById('close-menu-btn');
        const sidebar = document.getElementById('sidebar-menu');
        const overlay = document.getElementById('sidebar-overlay');

        function toggleMenu(show) {
            if (show) {
                overlay.classList.remove('hidden');
                void overlay.offsetWidth; 
                overlay.classList.remove('opacity-0');
                sidebar.classList.remove('translate-x-full');
                document.body.style.overflow = 'hidden';
            } else {
                overlay.classList.add('opacity-0');
                sidebar.classList.add('translate-x-full');
                document.body.style.overflow = '';
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        }

        if(menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
        if(closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
        if(overlay) overlay.addEventListener('click', () => toggleMenu(false));
        
        // FAQ Accordion Logic
        const faqContainer = document.getElementById('faq-accordion');
        if (faqContainer) {
            const faqItems = faqContainer.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const questionButton = item.querySelector('.faq-question');
                const answerPanel = item.querySelector('.faq-answer');
                
                questionButton.addEventListener('click', () => {
                    const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';
                    
                    // Close all items before opening the new one
                    faqItems.forEach(i => {
                        i.setAttribute('aria-expanded', 'false');
                        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                        i.querySelector('.faq-answer').style.maxHeight = '0px';
                        i.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
                    });
                    
                    if (!isExpanded) {
                        item.setAttribute('aria-expanded', 'true');
                        questionButton.setAttribute('aria-expanded', 'true');
                        answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
                        questionButton.querySelector('i').style.transform = 'rotate(180deg)';
                    }
                });
            });
        }
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
        return new Response('<div style="font-family:sans-serif;text-align:center;padding:50px;color:#fff;background:#000;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="width:40px;height:40px;border:3px solid #333;border-top-color:#f43f5e;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:15px;"></div><style>@keyframes spin { 100% { transform: rotate(360deg); } }</style><h1 style="font-size:18px;font-weight:bold;">Loading Premium Experience</h1></div>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
};