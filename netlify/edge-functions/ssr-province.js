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
            const transform = `f_auto,q_auto:good,w_${width},h_${height},c_fill,g_face`;
            return path.replace('/upload/', `/upload/${transform}/`);
        }
        return path;
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=75`;
};

// ==========================================
// SEO & CONTENT GENERATOR (Dark Mode Ready)
// ==========================================
const generateUltimateSeoText = (provinceName, provinceKey, count) => {
    const data = PROVINCE_SEO_DATA[provinceKey] || PROVINCE_SEO_DATA['default'];
    
    return `
    <article class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700 p-5 md:p-10 my-10 md:my-14 transition-colors duration-300">
        
        <div class="max-w-3xl mx-auto text-center mb-8 md:mb-10">
            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mb-3 md:mb-4 leading-tight">
                ศูนย์รวม <span class="text-accent dark:text-pink-500">ไซด์ไลน์${provinceName}</span> ระดับพรีเมียม
            </h2>
            <p class="text-slate-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                ${data.uniqueIntro} ปัจจุบันเรามีฐานข้อมูลน้องๆ ที่ผ่านการยืนยันตัวตนแล้วกว่า <strong class="text-slate-800 dark:text-white font-bold">${count} ท่าน</strong> ในพื้นที่
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8 md:mb-12">
            <div class="bg-slate-50 dark:bg-gray-900/50 p-5 md:p-6 rounded-xl border border-slate-100 dark:border-gray-700">
                <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-accent dark:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    โซนยอดนิยมใน${provinceName}
                </h3>
                <ul class="space-y-3">
                    ${(data.zones || ['ในเมือง']).slice(0, 5).map(z => `
                        <li class="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300">
                            <div class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-gray-500" aria-hidden="true"></div>
                            โซน${z}
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div class="bg-slate-50 dark:bg-gray-900/50 p-5 md:p-6 rounded-xl border border-slate-100 dark:border-gray-700">
                <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    จุดเด่นและนโยบายของเรา
                </h3>
                <ul class="space-y-4">
                    <li class="flex items-start gap-2">
                        <div class="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-success/20 flex items-center justify-center" aria-hidden="true"><div class="w-1.5 h-1.5 rounded-full bg-success"></div></div>
                        <p class="text-sm text-slate-700 dark:text-gray-300"><strong class="text-slate-800 dark:text-white">ไร้มัดจำ 100%:</strong> ชำระเงินเมื่อพบตัวน้องจริงเท่านั้น ป้องกันมิจฉาชีพเด็ดขาด</p>
                    </li>
                    <li class="flex items-start gap-2">
                        <div class="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center" aria-hidden="true"><div class="w-1.5 h-1.5 rounded-full bg-blue-600"></div></div>
                        <p class="text-sm text-slate-700 dark:text-gray-300"><strong class="text-slate-800 dark:text-white">ความลับลูกค้า:</strong> ปกปิดข้อมูลการใช้บริการเป็นความลับขั้นสูงสุด</p>
                    </li>
                    <li class="flex items-start gap-2">
                        <div class="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-warning/20 flex items-center justify-center" aria-hidden="true"><div class="w-1.5 h-1.5 rounded-full bg-warning"></div></div>
                        <p class="text-sm text-slate-700 dark:text-gray-300"><strong class="text-slate-800 dark:text-white">โปรไฟล์ตรงปก:</strong> ทีมงานตรวจสอบรูปภาพและตัวตนจริงก่อนอนุมัติลงเว็บ</p>
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-slate-200 dark:border-gray-700 pt-6 md:pt-8">
            <div class="text-center mb-6 md:mb-8">
                <h2 class="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-1">คำถามที่พบบ่อย (FAQ)</h2>
                <p class="text-sm text-slate-600 dark:text-gray-400">ข้อสงสัยยอดฮิตเกี่ยวกับการเรียกใช้บริการไซด์ไลน์${provinceName}</p>
            </div>
            <div class="grid grid-cols-1 gap-3 md:gap-4 max-w-4xl mx-auto">
                ${(data.faqs ||[]).map(faq => `
                    <div class="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg border border-slate-200 dark:border-gray-700 hover:border-accent/30 transition-colors">
                        <h3 class="font-bold text-slate-800 dark:text-white text-sm md:text-base mb-2 flex items-start gap-2">
                            <span class="text-accent dark:text-pink-500 text-base md:text-lg leading-none" aria-hidden="true">Q:</span> <span>${faq.q}</span>
                        </h3>
                        <p class="text-sm text-slate-600 dark:text-gray-300 leading-relaxed pl-6 md:pl-7 border-l-2 border-slate-100 dark:border-gray-700">${faq.a}</p>
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
        const zones = seoData.zones || ['ในเมือง'];
        
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

        const priceRange = seoData.avgPrice || "1,500 - 3,500";
        const priceParts = priceRange.split('-');
        const startPrice = priceParts[0] ? priceParts[0].trim() : "1,500";
        const endPrice = priceParts[1] ? priceParts[1].trim() : "5,000";
        const totalReviews = safeProfiles.length > 0 ? safeProfiles.length * 15 + 42 : 156;

        // Calculate Price Valid Until (1 year from now to satisfy Google)
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const validUntil = nextYear.toISOString().split('T')[0];

        // ---------------------------------------------------------
        // ULTIMATE SCHEMA.ORG FOR RICH SNIPPETS & LOCAL SEO
        // ---------------------------------------------------------
        const schemaData = {
            "@context": "https://schema.org",
            "@graph":[
                {
                    "@type": "WebSite",
                    "@id": `${CONFIG.DOMAIN}/#website`,
                    "url": CONFIG.DOMAIN,
                    "name": CONFIG.BRAND_NAME,
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
                    "about": { "@id": `${provinceUrl}/#business` },
                    "breadcrumb": { "@id": `${provinceUrl}/#breadcrumb` },
                    "mainEntity": { "@id": `${provinceUrl}/#itemlist` }
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
                    "name": `ไซด์ไลน์${provinceName} - ${CONFIG.BRAND_NAME}`,
                    "url": provinceUrl,
                    "image": firstImage,
                    "description": description,
                    "telephone": "ติดต่อผ่าน Line Official",
                    "priceRange": `฿${startPrice} - ฿${endPrice}`,
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
                    "areaServed": { "@type": "State", "name": provinceName },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.8",
                        "reviewCount": String(totalReviews),
                        "bestRating": "5",
                        "worstRating": "1"
                    },
                    "offers": safeProfiles.length > 0 ? {
                        "@type": "AggregateOffer",
                        "offerCount": String(safeProfiles.length),
                        "lowPrice": startPrice.replace(/,/g, ''),
                        "highPrice": endPrice.replace(/,/g, ''),
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "priceValidUntil": validUntil
                    } : undefined,
                    "sameAs": Object.values(CONFIG.SOCIAL_LINKS)
                }
            ]
        };

        const provinceLinksHtml = allProvinces.map(p => `
            <a href="/location/${p.key}" class="text-slate-400 hover:text-white transition-colors py-1" aria-label="รับงาน ${p.nameThai}">
               ${p.nameThai}
            </a>
        `).join('');

        // ---------------------------------------------------------
        // Generate Profile Cards HTML (LSI Injection & CLS Fix)
        // ---------------------------------------------------------
        let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                const cleanName = (p.name || 'ไม่ระบุชื่อ').replace(/^(น้อง\s?)/, '');
                const profileLocation = p.location || provinceName;
                
                const busyKeywords =['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'];
                const availText = (p.availability || '').toLowerCase();
                const isAvailable = !busyKeywords.some(kw => availText.includes(kw));
                
                const profileLink = `/sideline/${p.slug || p.id}`;
                const mockRating = (4.6 + Math.random() * 0.4).toFixed(1); 
                const mockReviews = Math.floor(Math.random() * 80) + 12;

                // SEO Magic: Dynamic LSI Keyword Injection into Image ALT
                const lsiKeyword = seoData.lsi && seoData.lsi.length > 0 
                    ? seoData.lsi[i % seoData.lsi.length] 
                    : `รับงาน${provinceName}`;

                let badgeHTML = '';
                if (i < 3 || p.isfeatured) {
                    badgeHTML = `<span class="absolute top-2 right-2 md:top-3 md:right-3 bg-accent text-white text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded shadow-sm flex items-center gap-1 z-20">
                        <svg class="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg> 
                        ฮอต
                    </span>`;
                }

                const loadingAttr = i < 6 ? 'fetchpriority="high"' : 'loading="lazy"';
                const defaultImg = `${CONFIG.DOMAIN}/images/default.webp`;

                return `
                <article class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-slate-100 dark:border-gray-700 hover:border-accent/30 dark:hover:border-accent/50 group relative">
                    <a href="${profileLink}" class="absolute inset-0 z-10 bottom-[80px]" aria-label="ดูโปรไฟล์น้อง ${cleanName}"></a>
                    
                    <div class="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-gray-900">
                        <img src="${optimizeImg(p.imagePath, 400, 500)}" 
                             width="400" height="500"
                             onerror="this.onerror=null;this.src='${defaultImg}';"
                             alt="น้อง${cleanName} ${lsiKeyword} โซน${profileLocation}"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                             ${loadingAttr} decoding="async">
                        
                        <div class="absolute top-2 left-2 md:top-3 md:left-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2 py-1 md:px-2.5 md:py-1 rounded-full shadow-sm border border-slate-100 dark:border-gray-700 flex items-center gap-1.5 z-20">
                            <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isAvailable ? 'bg-success animate-pulse' : 'bg-slate-400'}" aria-hidden="true"></span>
                            <span class="text-[9px] md:text-[10px] font-bold text-slate-800 dark:text-gray-100 tracking-wide">${isAvailable ? 'ออนไลน์ตอนนี้' : 'ติดจอง'}</span>
                        </div>
                        
                        ${badgeHTML}
                        
                        <div class="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-slate-900/95 to-transparent pointer-events-none"></div>
                        
                        <div class="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 flex justify-between items-end z-20 pointer-events-none">
                            <div class="overflow-hidden pr-1">
                                <h3 class="font-bold text-base md:text-lg text-white drop-shadow-md leading-tight truncate mb-0.5">${cleanName}</h3>
                                <p class="text-[10px] md:text-xs text-slate-200 flex items-center gap-1 truncate">
                                    <svg class="w-3 h-3 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    <span class="truncate">${profileLocation}</span>
                                </p>
                            </div>
                            <div class="text-right flex-shrink-0">
                                <span class="block text-[9px] text-slate-300 mb-0.5">เริ่มต้น</span>
                                <span class="font-bold text-sm md:text-base text-white drop-shadow-md leading-none">฿${p.rate || 'สอบถาม'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 flex flex-col justify-between bg-white dark:bg-gray-800 z-20 relative border-t border-slate-50 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-1">
                                <span class="text-warning text-[11px] md:text-sm font-bold" aria-label="คะแนน ${mockRating} ดาว">⭐ ${mockRating}</span>
                                <span class="text-[9px] md:text-[10px] text-slate-600 dark:text-gray-400 underline decoration-slate-300 dark:decoration-gray-600 underline-offset-2">(${mockReviews})</span>
                            </div>
                            <div class="flex items-center gap-1 text-[9px] md:text-[10px] text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-bold border border-blue-100 dark:border-blue-800">
                                <svg class="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span>ยืนยันแล้ว</span>
                            </div>
                        </div>

                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" aria-label="แอดไลน์น้อง ${cleanName}" class="w-full bg-rose-50 dark:bg-pink-900/20 text-accent dark:text-pink-400 hover:bg-accent hover:text-white dark:hover:bg-pink-600 border border-rose-100 dark:border-pink-800 hover:border-accent transition-colors duration-300 py-2 rounded-lg font-bold text-[13px] md:text-[14px] flex items-center justify-center gap-1.5 relative overflow-hidden group/btn">
                            <svg class="w-4 h-4 md:w-4 md:h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.039.756.018.948-.027.261-.131.847-.131.847-.053.308.243.435.485.308 0 0 2.584-1.42 4.708-3.086 1.706-1.338 4.827-4.27 4.827-9.217z"/></svg>
                            <span class="relative z-10">แอด LINE ทันที</span>
                            <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                        </a>
                    </div>
                </article>`;
            }).join('');
        } else {
            cardsHTML = `<div class="col-span-full text-center py-16 text-slate-700 dark:text-gray-300 text-sm md:text-base font-medium">กำลังอัปเดตโปรไฟล์น้องๆ ในโซนนี้ กรุณากลับมาตรวจสอบอีกครั้ง</div>`;
        }

        // ==========================================
        // MAIN HTML STRUCTURE
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth dark:bg-gray-900 dark:text-gray-100 dark">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#db2777">
    
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="รับงาน${provinceName}, ไซด์ไลน์${provinceName}, สาวไซด์ไลน์${provinceName}, เพื่อนเที่ยว${provinceName}, ไม่มัดจำ, โปรไฟล์จริง">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${provinceUrl}" />
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${provinceUrl}">
    <meta property="og:image" content="${firstImage}">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Prompt:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#0F172A',
                        accent: '#db2777', 
                        bg: '#F8FAFC',
                        success: '#15803D',
                        warning: '#D97706'
                    },
                    fontFamily: {
                        sans: ['Prompt', 'Inter', 'sans-serif'],
                        inter:['Inter', 'sans-serif'],
                    },
                    keyframes: {
                        shimmer: {
                            '100%': { transform: 'translateX(100%)' }
                        }
                    }
                }
            }
        }
    </script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <script type="application/ld+json">
        ${JSON.stringify(schemaData)}
    </script>

    <style>
        body { margin: 0; font-family: 'Prompt', sans-serif; background: linear-gradient(135deg, #0D0D0D, #4B0082); color: #fff; min-height: 100vh; }
        .hero-pattern { background-color: transparent; }
        .nav-glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid transparent; }
        .dark .nav-glass { background: rgba(17, 24, 39, 0.8); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .social-marquee::-webkit-scrollbar { display: none; }
    </style>
</head>

<body class="antialiased flex flex-col min-h-screen">

    <nav class="fixed top-0 w-full z-50 nav-glass transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">
            <a href="/" class="flex items-center" aria-label="หน้าหลัก ${CONFIG.BRAND_NAME}">
                <img src="/images/logo-sidelinechiangmai.webp" alt="Sideline Chiangmai Logo" class="h-[28px] w-auto">
            </a>
            
            <div class="hidden md:flex items-center gap-6 text-[14px] font-bold text-gray-800 dark:text-gray-200">
                <a href="/" class="hover:text-pink-500 transition-colors">หน้าแรก</a>
                <a href="/profiles.html" class="hover:text-pink-500 transition-colors">น้องๆทั้งหมด</a>
                <a href="/locations.html" class="hover:text-pink-500 transition-colors">พิกัดพื้นที่</a>
                <a href="/about.html" class="hover:text-pink-500 transition-colors">เกี่ยวกับเรา</a>
                <a href="/faq.html" class="hover:text-pink-500 transition-colors">คำถามพบบ่อย</a>
                <a href="/blog.html" class="hover:text-pink-500 transition-colors">บทความ</a>
            </div>
            
            <button id="mobile-menu-btn" class="md:hidden text-gray-800 dark:text-gray-200 w-10 h-10 flex items-center justify-center focus:outline-none rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="เปิดเมนูนำทาง">
                <i class="fas fa-bars text-xl"></i>
            </button>
        </div>
    </nav>

    <!-- Slide-in Sidebar Menu (เหมือน index.html) -->
    <div id="menu-backdrop" class="fixed inset-0 z-40 hidden opacity-0 transition-opacity duration-300 ease-in-out bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>
    
    <div id="sidebar" class="fixed top-0 right-0 w-64 sm:w-72 h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col md:hidden" role="dialog" aria-labelledby="sidebar-nav-heading" aria-hidden="true" tabindex="-1">
        <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
            <h3 id="sidebar-nav-heading" class="text-lg font-bold text-pink-600 dark:text-pink-500">เมนู</h3>
            <button id="close-sidebar-btn" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300" aria-label="ปิดเมนู">
                <i class="fas fa-times text-lg"></i>
            </button>
        </div>
        
        <nav aria-label="เมนูนำทางหลักในแถบด้านข้าง" class="flex-grow overflow-y-auto p-4 space-y-2">
            <a href="/" class="flex items-center gap-4 py-3 px-4 font-bold text-base text-gray-800 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl transition-colors"><i class="fas fa-home w-5 text-center text-gray-400"></i><span>หน้าแรก</span></a>
            <a href="/profiles.html" class="flex items-center gap-4 py-3 px-4 font-bold text-base text-gray-800 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl transition-colors"><i class="fas fa-users w-5 text-center text-gray-400"></i><span>น้องๆ ทั้งหมด</span></a>
            <a href="/locations.html" class="flex items-center gap-4 py-3 px-4 font-bold text-base text-gray-800 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl transition-colors"><i class="fas fa-map-marker-alt w-5 text-center text-gray-400"></i><span>พิกัดบริการ</span></a>
            <a href="/about.html" class="flex items-center gap-4 py-3 px-4 font-bold text-base text-gray-800 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl transition-colors"><i class="fas fa-info-circle w-5 text-center text-gray-400"></i><span>เกี่ยวกับเรา</span></a>
            <a href="/faq.html" class="flex items-center gap-4 py-3 px-4 font-bold text-base text-gray-800 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl transition-colors"><i class="fas fa-question-circle w-5 text-center text-gray-400"></i><span>คำถามพบบ่อย</span></a>
            <a href="/blog.html" class="flex items-center gap-4 py-3 px-4 font-bold text-base text-gray-800 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl transition-colors"><i class="fas fa-newspaper w-5 text-center text-gray-400"></i><span>บทความ</span></a>
        </nav>
        
        <div class="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener nofollow" class="w-full flex items-center justify-center gap-2 bg-[#06c755] text-white py-3 rounded-xl font-bold hover:bg-[#05a546] transition-colors shadow-lg shadow-green-500/20"><i class="fab fa-line text-xl" aria-hidden="true"></i><span>ติดต่อผ่าน LINE</span></a>
        </div>
    </div>

    <header class="pt-24 pb-10 md:pt-32 md:pb-16 px-4 hero-pattern text-center space-y-4 relative z-10">
        <h1 class="text-3xl md:text-4xl font-extrabold text-white leading-tight" style="text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
            ไซด์ไลน์${provinceName} ฟิวแฟน เด็กเอ็น รับงาน${provinceName} ตรงปก
        </h1>

        <a href="/" class="block mx-auto rounded-2xl overflow-hidden shadow-lg max-w-3xl focus:outline-none transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src="/images/hero-sidelinechiangmai-1200.webp"
              srcset="/images/hero-sidelinechiangmai-600.webp 600w, 
                      /images/hero-sidelinechiangmai-800.webp 800w, 
                      /images/hero-sidelinechiangmai-1200.webp 1200w"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
              alt="ภาพสวยๆ น้องๆสาวๆ รับงานฟิวแฟน ไซด์ไลน์${provinceName} ตรงปก 100% ไม่ต้องมัดจำ ปลอดภัย"
              width="1200" height="800"
              class="w-full h-auto rounded-2xl object-cover aspect-[3/2]"
              loading="eager" decoding="async" fetchpriority="high" />
        </a>

        <h2 class="text-xl md:text-2xl font-bold text-white mt-6">
            บริการไซด์ไลน์${provinceName}ระดับพรีเมียม คัดเกรดเพื่อคุณ
        </h2>
        <p class="mt-2 text-lg text-pink-400 font-medium">
            ยินดีให้บริการค่ะ
        </p>

        <div class="max-w-3xl mx-auto mt-8 px-4">
            <div class="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4 rounded-2xl text-center shadow-sm backdrop-blur-sm">
                <h3 class="text-green-400 font-extrabold text-lg md:text-xl flex items-center justify-center gap-2">
                    <i class="fas fa-shield-alt"></i> การันตีความโปร่งใส 100%
                </h3>
                <p class="text-gray-200 text-sm md:text-base mt-1">
                    <span class="font-bold text-pink-400">❌ ไม่ต้องโอนมัดจำ</span> | 
                    <span class="font-bold text-pink-400">❌ ไม่ต้องจ่ายค่าสมาชิก</span> | 
                    <span class="font-bold text-green-400">✅ จ่ายเงินหน้างานเท่านั้น</span>
                </p>
                <p class="text-[10px] md:text-xs text-gray-400 mt-2 uppercase tracking-widest">
                    ติดต่อน้องๆได้เฉพาะทาง line ที่ปรากฏบนหน้าเว็บไซต์ของเราเท่านั้น
                </p>
            </div>
        </div>

        <section class="text-center py-8 md:py-10 bg-gray-900/90 rounded-2xl shadow-inner mt-8 md:mt-12 max-w-4xl mx-auto border border-gray-800 px-2 backdrop-blur-md">
            <div>
                <h2 class="text-sm md:text-base text-gray-100 max-w-xl mx-auto px-4 font-extrabold" style="text-shadow:0 0 4px rgba(255,255,255,.3)">
                  ติดตามเราบน Social Media 
                  <i class="fas fa-hand-point-down ml-1" aria-hidden="true"></i>
                </h2>
                <p class="text-sm md:text-base font-medium text-gray-300 m-0 leading-tight mt-1">
                  อัปเดตโปรไฟล์ใหม่ล่าสุดและโปรโมชั่นพิเศษได้ก่อนใคร
                </p>
            </div>

            <div class="overflow-x-auto mt-4 pb-2 social-marquee">
                <div class="flex flex-nowrap justify-start sm:justify-center gap-3 sm:gap-4 text-sm sm:text-base whitespace-nowrap py-2 px-4">
                  <a href="${CONFIG.SOCIAL_LINKS.linkedin}" target="_blank" rel="nofollow noopener noreferrer" class="inline-flex items-center font-bold text-white bg-[#0077b5] hover:bg-[#006097] rounded-lg px-3 py-1 transition-colors"><i class="fa-brands fa-linkedin mr-1"></i>LinkedIn</a>
                  <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="nofollow noopener noreferrer" class="inline-flex items-center font-bold text-white bg-green-700 hover:bg-green-800 rounded-lg px-3 py-1 transition-colors"><i class="fab fa-line mr-1"></i>LINE</a>
                  <a href="${CONFIG.SOCIAL_LINKS.tiktok}" target="_blank" rel="nofollow noopener noreferrer" class="inline-flex items-center font-bold text-white bg-black hover:bg-gray-800 rounded-lg px-3 py-1 transition-colors border border-gray-700"><i class="fab fa-tiktok mr-1"></i>TikTok</a>
                  <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" rel="nofollow noopener noreferrer" class="inline-flex items-center font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg px-3 py-1 transition-colors"><i class="fab fa-twitter mr-1"></i>Twitter</a>
                  <a href="${CONFIG.SOCIAL_LINKS.biosite}" target="_blank" rel="nofollow noopener noreferrer" class="inline-flex items-center gap-2 font-bold text-black bg-rose-400 hover:bg-rose-500 rounded-lg px-4 py-1.5 transition-colors shadow-sm"><img src="/images/favicon-32x32.png" alt="Bio.site" class="w-4 h-4">Bio.site</a>
                  <a href="${CONFIG.SOCIAL_LINKS.linktree}" target="_blank" rel="nofollow noopener noreferrer" class="inline-flex items-center font-bold text-white bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1 transition-colors border border-gray-600"><i class="fas fa-link mr-1"></i>Linktree</a>
                  <a href="${CONFIG.SOCIAL_LINKS.bluesky}" target="_blank" rel="nofollow noopener noreferrer" class="inline-flex items-center font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-3 py-1 transition-colors"><i class="fas fa-cloud mr-1"></i>Bluesky</a>
                </div>
            </div>

            <p class="text-xs md:text-sm text-center font-extrabold text-white bg-red-800 max-w-xl mx-auto px-4 py-2 mt-4 rounded-lg shadow-md leading-tight" role="alert">
                <strong>เว็บไซต์นี้สำหรับผู้ที่มีอายุ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</strong>
            </p>
        </section>
    </header>

    <main id="profiles" class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10 bg-white dark:bg-gray-900 rounded-t-[2rem] shadow-2xl mt-8">
        
        <div class="flex flex-col lg:flex-row justify-between lg:items-end mb-6 md:mb-8 gap-4 pt-6">
            <div>
                <h2 class="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    เลือกน้องที่ใช่ ในโซน<span class="text-pink-600 dark:text-pink-500">${provinceName}</span>
                </h2>
                <p class="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-bold">พบกับโปรไฟล์คุณภาพที่พร้อมดูแลคุณ (${safeProfiles.length} คน)</p>
            </div>
            
            <div class="flex flex-row overflow-x-auto scrollbar-hide pb-2 lg:pb-0 gap-2 w-full lg:w-auto snap-x">
                <button class="snap-start flex-shrink-0 px-4 py-2 bg-pink-600 text-white rounded-full text-xs font-bold shadow-sm hover:bg-pink-700 transition" aria-label="กรองโปรไฟล์ที่มาแรง">
                    ⭐ มาแรง
                </button>
                <button class="snap-start flex-shrink-0 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-bold shadow-sm hover:border-pink-500 transition" aria-label="กรองเรทราคาเริ่มต้น 1500 บาท">
                    เรทเริ่มต้น 1,500
                </button>
                <button class="snap-start flex-shrink-0 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-bold shadow-sm hover:border-pink-500 transition flex items-center" aria-label="เปิดเมนูเลือกโซน">
                    เลือกโซน <i class="fas fa-chevron-down ml-1 text-[10px]" aria-hidden="true"></i>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            ${cardsHTML}
        </div>

        ${safeProfiles.length >= 80 ? `
        <div class="text-center mt-10 md:mt-12">
            <a href="/search?province=${provinceKey}" class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs md:text-sm rounded-full hover:border-pink-500 hover:text-pink-500 transition-all shadow-sm" aria-label="คลิกเพื่อโหลดและดูโปรไฟล์เพิ่มเติม">
                โหลดโปรไฟล์เพิ่มเติม
                <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </a>
        </div>
        ` : ''}

        ${generateUltimateSeoText(provinceName, provinceKey, safeProfiles.length)}

    </main>

    <footer itemscope itemtype="https://schema.org/Organization" class="bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 pt-16 pb-8 border-t border-gray-100 dark:border-gray-800 relative z-10">
        <h2 class="sr-only">ข้อมูลส่วนท้ายและการนำทางของเว็บไซต์</h2>
        <meta itemprop="name" content="${CONFIG.BRAND_NAME}">
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                <div class="md:col-span-4 space-y-4">
                    <a href="/" class="mb-4 inline-block opacity-90 hover:opacity-100 transition-opacity" aria-label="กลับสู่หน้าหลัก">
                         <img src="/images/logo-sidelinechiangmai.webp" alt="Sideline Chiangmai Logo" class="h-7 w-auto grayscale hover:grayscale-0 transition-all duration-500">
                    </a>
                    <p itemprop="description" class="text-xs leading-relaxed max-w-sm">
                        แพลตฟอร์มศูนย์รวมนางแบบและเพื่อนเที่ยวที่ปลอดภัยและน่าเชื่อถือที่สุด เราคัดกรองโปรไฟล์อย่างเข้มงวดและรักษาความลับลูกค้าเป็นอันดับหนึ่ง
                    </p>
                </div>

                <div class="md:col-span-2 md:col-start-6">
                    <h3 class="text-gray-900 dark:text-white text-sm font-bold mb-4">บริการของเรา</h3>
                    <ul class="space-y-2.5 text-xs">
                        <li><a href="/" class="hover:text-pink-500 transition-colors">หน้าแรก</a></li>
                        <li><a href="/profiles.html" class="hover:text-pink-500 transition-colors">ค้นหาน้องๆ</a></li>
                        <li><a href="/locations.html" class="hover:text-pink-500 transition-colors">พิกัดบริการ</a></li>
                        <li><a href="/faq.html" class="hover:text-pink-500 transition-colors">คำถามที่พบบ่อย</a></li>
                        <li><a href="/blog.html" class="hover:text-pink-500 transition-colors">บทความน่ารู้</a></li>
                    </ul>
                </div>

                <div class="md:col-span-3">
                    <h3 class="text-gray-900 dark:text-white text-sm font-bold mb-4">พื้นที่ให้บริการอื่นๆ</h3>
                    <div class="flex flex-col gap-2 text-xs h-32 overflow-y-auto scrollbar-hide pr-2">
                        ${allProvinces.map(p => `<a href="/location/${p.key}" class="hover:text-pink-500 transition-colors flex items-center gap-2"><span class="w-1 h-1 bg-gray-300 rounded-full"></span> รับงาน${p.nameThai}</a>`).join('')}
                    </div>
                </div>

                <div class="md:col-span-3">
                    <h3 class="text-gray-900 dark:text-white text-sm font-bold mb-4">ติดต่อเรา</h3>
                    <p class="text-xs mb-4">แอดมินตอบแชทไว 10.00 - 04.00 น.</p>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 bg-[#06c755] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#05a546] transition-all w-full shadow-lg shadow-green-500/20">
                        <i class="fab fa-line text-lg"></i> แอดไลน์จองคิว
                    </a>
                </div>
            </div>

            <div class="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-[10px] text-gray-400 uppercase tracking-widest">&copy; ${CURRENT_YEAR} <span itemprop="legalName">${CONFIG.BRAND_NAME}</span>. All rights reserved.</p>
                <div class="flex gap-6 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    <a href="/privacy-policy.html" class="hover:text-pink-500 transition-colors">Privacy Policy</a>
                    <a href="/terms.html" class="hover:text-pink-500 transition-colors">Terms of Service</a>
                </div>
            </div>
            <div class="mt-8 text-[10px] text-gray-400 text-center max-w-2xl mx-auto leading-relaxed opacity-60">
                เว็บไซต์นี้เป็นเพียงสื่อกลางในการแนะนำข้อมูลพิกัดและโปรไฟล์เท่านั้น ทางเว็บไซต์ไม่มีส่วนเกี่ยวข้องกับการกระทำผิดกฎหมายใดๆ ทั้งสิ้น ข้อมูลทั้งหมดถูกคัดกรองเพื่อความบันเทิงและเป็นข้อมูลสำหรับผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น
            </div>
        </div>
    </footer>

    <a href="${CONFIG.SOCIAL_LINKS.line}" 
       target="_blank" 
       rel="noopener noreferrer"
       class="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[90] animate-float group"
       aria-label="ติดต่อจองคิวด่วนผ่านแอพพลิเคชัน LINE">
        <div class="bg-[#06c755] text-white px-4 py-2.5 md:px-5 md:py-3 rounded-full flex items-center gap-2 shadow-[0_8px_20px_rgba(6,199,85,0.4)] hover:scale-105 transition-transform duration-300 border-2 border-white/20">
            <i class="fab fa-line text-xl md:text-2xl" aria-hidden="true"></i>
            <span class="font-bold text-xs md:text-sm tracking-wide hidden sm:block">จองคิวด่วน</span>
        </div>
    </a>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        // Navbar Scroll Effect
        const nav = document.querySelector('nav');
        if (nav) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 10) {
                    nav.classList.add('shadow-md');
                } else {
                    nav.classList.remove('shadow-md');
                }
            }, { passive: true });
        }

        // Sidebar Menu Logic (เหมือน index.html)
        const menuBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('close-sidebar-btn');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('menu-backdrop');

        function openMenu() {
            backdrop.classList.remove('hidden');
            // Trigger reflow
            void backdrop.offsetWidth;
            backdrop.classList.remove('opacity-0');
            sidebar.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            backdrop.classList.add('opacity-0');
            sidebar.classList.add('translate-x-full');
            document.body.style.overflow = '';
            setTimeout(() => {
                backdrop.classList.add('hidden');
            }, 300); // Wait for transition
        }

        if(menuBtn) menuBtn.addEventListener('click', openMenu);
        if(closeBtn) closeBtn.addEventListener('click', closeMenu);
        if(backdrop) backdrop.addEventListener('click', closeMenu);
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
        return new Response('<div style="font-family:sans-serif;text-align:center;padding:50px;color:#fff;background:#111827;height:100vh;display:flex;align-items:center;justify-content:center;"><h1 style="font-size:20px;">เกิดข้อผิดพลาดในการโหลดระบบ กรุณาลองใหม่อีกครั้ง</h1></div>', { 
            status: 500, 
            headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
    }
};