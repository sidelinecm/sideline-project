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
            { q: "สามารถนัดน้องๆ ให้มาบริการที่รีสอร์ทส่วนตัวได้ไหม?", a: "ได้แน่นอนครับ น้องๆ ยินดีเดินทางไปดูแลคุณถึงที่พัก เพื่อความเป็นส่วนตัวสูงสุด" },
            { q: "ต้องจ่ายเงินมัดจำล่วงหน้าไหม?", a: "ไม่มีการจ่ายมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ จ่ายเมื่อเจอน้องตรงปกแล้วเท่านั้น" },
            { q: "วิธีการจองคิวต้องทำอย่างไร?", a: "เลื่อนดูโปรไฟล์ที่ถูกใจ แล้วกดปุ่มแอดไลน์ ส่งรูปน้องให้แอดมินเช็คคิวได้เลยครับ" }
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
            { q: "เรียกเด็กเอ็น หรือ ไซด์ไลน์ กทม. ต้องมัดจำไหม?", a: "เพื่อความสบายใจสูงสุดของลูกค้า เราใช้ระบบเจอตัวจริงแล้วค่อยชำระเงิน ไม่มีการบังคับโอนมัดจำล่วงหน้าทุกกรณี" },
            { q: "รับประกันความตรงปกไหม?", a: "เรารับประกันความตรงปก 100% ครับ ผ่านการยืนยันตัวตนแล้วทุกคน" },
            { q: "สามารถออกต่างจังหวัดได้ไหม?", a: "มีน้องๆ บางส่วนที่รับงานไปต่างจังหวัดแบบ Private ทริปครับ สอบถามแอดมินเพิ่มเติมได้" }
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
            { q: "รับประกันความตรงปกไหม?", a: "รูปโปรไฟล์ทุกรูปผ่านการคัดกรอง ยืนยันตัวตนแล้วว่าตรงปกและพร้อมให้บริการระดับพรีเมียมอย่างแท้จริง" },
            { q: "ขั้นตอนการจองคิวต้องทำอย่างไร?", a: "ส่งรูปน้องที่สนใจให้แอดมินทาง LINE เพื่อเช็คคิวว่างและยืนยันสถานที่ได้เลยครับ" },
            { q: "สามารถนัดเจอนอกสถานที่ได้ไหม?", a: "ได้ครับ สามารถตกลงนัดเจอกันที่ร้านอาหาร หรือโรงแรมที่ลูกค้าสะดวกได้เลย" }
        ]
    }
};

const optimizeImg = (path, width = 320, height = 400) => { 
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
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
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
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

        // ดึงข้อมูล 3 ส่วน ครบถ้วน!
        const [provinceRes, profilesRes, allProvincesRes] = await Promise.all([
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
        
        const firstImage = safeProfiles.length > 0 ? optimizeImg(safeProfiles[0].imagePath, 1200, 630) : `${CONFIG.DOMAIN}/images/default.webp`;

        // SEO Title & Description
        const title = `ไซด์ไลน์${provinceName} ฟิวแฟน เด็กเอ็น รับงาน${provinceName} ตรงปก 100%`;
        const description = `รวมโปรไฟล์น้องๆ รับงาน${provinceName} ไซด์ไลน์${provinceName} เด็กเอ็น เกรดพรีเมียม โซน ${(seoData.zones||['ตัวเมือง']).slice(0,3).join(', ')} ✓ตรงปก 100% ✓ไม่โอนมัดจำ ✓จ่ายเงินหน้างานเท่านั้น`;

        const priceParts = (seoData.avgPrice || "1,500 - 3,500").split('-');
        const startPrice = priceParts[0] ? priceParts[0].trim() : "1500";
        const endPrice = priceParts[1] ? priceParts[1].trim() : "5000";
        const validUntil = new Date(now.setFullYear(now.getFullYear() + 1)).toISOString().split('T')[0];

        // 🧠 Schema.org (JSON-LD) ครบทุกมิติ
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
                    "name": `รับงาน${provinceName} - ${CONFIG.BRAND_NAME}`,
                    "image": firstImage,
                    "description": description,
                    "priceRange": `฿${startPrice} - ฿${endPrice}`,
                    "url": provinceUrl,
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
                        "ratingValue": "4.9",
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
                ...(seoData.faqs && seoData.faqs.length > 0 ?[{
                    "@type": "FAQPage",
                    "@id": `${provinceUrl}/#faq`,
                    "mainEntity": seoData.faqs.map(faq => ({
                        "@type": "Question",
                        "name": faq.q,
                        "acceptedAnswer": { "@type": "Answer", "text": faq.a }
                    }))
                }] :[])
            ]
        };

        // 🎨 Profile Cards Generation (Light Theme + Animation Classes)
        let cardsHTML = '';
        if (safeProfiles && safeProfiles.length > 0) {
            cardsHTML = safeProfiles.map((p, i) => {
                const rawName = (p.name || 'ไม่ระบุชื่อ').replace(/^(น้อง\s?)/, '');
                const cleanName = escapeHTML(rawName);
                const profileLocation = escapeHTML(p.location || provinceName);
                const isAvailable = !['ติดจอง', 'ไม่ว่าง', 'พัก', 'หยุด'].some(kw => (p.availability || '').toLowerCase().includes(kw));
                const profileLink = `/sideline/${escapeHTML(p.slug || p.id)}`;
                const displayRate = p.rate ? Number(p.rate).toLocaleString() : 'สอบถาม';
                const lsiKeyword = seoData.lsi && seoData.lsi.length > 0 ? seoData.lsi[i % seoData.lsi.length] : `รับงาน${provinceName}`;
                
                const seoAltText = `น้อง${cleanName} ไซด์ไลน์${provinceName} โซน${profileLocation} ${lsiKeyword}`;
                const imgLoading = i < 4 ? 'fetchpriority="high" loading="eager" decoding="sync"' : 'loading="lazy" decoding="async"';
                const animDelay = (i % 10) * 50; // Delay for Intersection Observer

                return `
                <article class="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up opacity-0" style="animation-delay: ${animDelay}ms; animation-fill-mode: both;">
                    <a href="${profileLink}" aria-label="ดูโปรไฟล์ ${seoAltText}" class="block relative w-full aspect-[4/5] bg-bg overflow-hidden group">
                        
                        <img src="${optimizeImg(p.imagePath, 320, 400)}" 
                             alt="${seoAltText}" 
                             width="320" height="400" 
                             onerror="this.onerror=null;this.src='${CONFIG.DOMAIN}/images/default.webp';"
                             ${imgLoading}
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <!-- Badge Online/Busy -->
                        <div class="absolute top-[12px] left-[12px] z-10 flex items-center gap-[6px] bg-white/95 backdrop-blur-sm px-[10px] py-[4px] rounded-full shadow-sm border border-border">
                            <span class="relative flex h-2 w-2">
                                ${isAvailable ? `<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>` : ''}
                                <span class="relative inline-flex rounded-full h-2 w-2 ${isAvailable ? 'bg-secondary' : 'bg-red-500'}"></span>
                            </span>
                            <span class="text-[10px] font-bold text-textPrimary tracking-wide">${isAvailable ? 'พร้อมรับงาน' : 'ติดจอง'}</span>
                        </div>

                        <!-- Badge HOT -->
                        ${p.isfeatured ? `
                        <div class="absolute top-[12px] right-[12px] z-10 bg-accent text-white text-[10px] font-bold px-[8px] py-[4px] rounded uppercase shadow-md flex items-center gap-1">
                            <svg class="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg>
                            HOT
                        </div>` : ''}

                        <!-- Hover View Action -->
                        <div class="absolute bottom-[16px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                            <span class="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                                ดูโปรไฟล์ <i class="fas fa-arrow-right ml-1"></i>
                            </span>
                        </div>
                    </a>
                    
                    <div class="p-[16px] flex flex-col flex-grow justify-between bg-surface relative z-10">
                        <div class="mb-[8px]">
                            <h3 class="text-[1.25rem] font-bold text-textPrimary leading-[1.3] truncate">${cleanName}</h3>
                            <div class="flex items-center gap-[4px] text-[0.875rem] text-muted mt-[4px]">
                                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span class="truncate">${profileLocation}</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between border-t border-border pt-[12px] mt-[8px]">
                            <span class="text-[0.75rem] text-muted font-bold uppercase tracking-wider">เรทราคา</span>
                            <span class="text-[1.25rem] font-black text-accent tracking-tight">฿${displayRate}</span>
                        </div>
                    </div>
                </article>`;
            }).join('');
        } else {
            cardsHTML = `
            <div class="col-span-full py-[64px] text-center bg-surface border border-border rounded-2xl shadow-sm">
                <svg class="w-16 h-16 text-muted mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 class="text-[1.25rem] font-semibold text-textPrimary mb-2">กำลังอัปเดตข้อมูล</h3>
                <p class="text-[1rem] text-muted">กรุณากลับมาตรวจสอบโปรไฟล์น้องๆ ในโซน${escapeHTML(provinceName)} ใหม่อีกครั้ง</p>
            </div>`;
        }

        const html = `<!DOCTYPE html>
<html lang="th" dir="ltr" class="scroll-smooth bg-[#F9FAFB]">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#FFFFFF">
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${provinceUrl}" />
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${provinceUrl}" />
    <meta property="og:image" content="${firstImage}" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://zxetzqwjaiumqhrpumln.supabase.co" crossorigin />
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'" />

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { 
                        primary: '#6366F1',     /* Indigo */
                        secondary: '#10B981',   /* Emerald */
                        accent: '#F59E0B',      /* Amber */
                        bg: '#F9FAFB',          /* Light Gray */
                        surface: '#FFFFFF',     /* White */
                        textPrimary: '#111827', /* Dark Gray */
                        muted: '#6B7280',       /* Medium Gray */
                        border: '#E5E7EB'       /* Light Border */
                    },
                    fontFamily: { 
                        sans:['Prompt', 'sans-serif']
                    },
                    keyframes: {
                        'fade-in-up': {
                            '0%': { opacity: '0', transform: 'translateY(20px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' }
                        }
                    },
                    animation: {
                        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }
                }
            }
        }
    </script>

    <style>
        body { font-family: 'Prompt', sans-serif; background-color: #F9FAFB; color: #111827; -webkit-tap-highlight-color: transparent; }
        
        /* Required Typography Scale */
        h1 { font-size: 3rem; font-weight: 700; line-height: 1.2; }
        @media (max-width: 768px) { h1 { font-size: 2rem; } }
        h2 { font-size: 2.25rem; font-weight: 600; line-height: 1.3; }
        @media (max-width: 768px) { h2 { font-size: 1.75rem; } }
        h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
        p { font-size: 1rem; font-weight: 400; line-height: 1.6; }
        .text-small { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }

        /* Buttons & Cards */
        .btn-primary { background-color: #6366F1; color: #FFFFFF; font-weight: 600; border-radius: 8px; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2); }
        .btn-primary:hover { background-color: #4F46E5; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3); }
        
        .btn-outline { background-color: #FFFFFF; border: 1px solid #E5E7EB; color: #111827; font-weight: 600; border-radius: 8px; transition: all 0.3s ease; }
        .btn-outline:hover { border-color: #6366F1; color: #6366F1; background-color: #EEF2FF; transform: translateY(-2px); }

        .card { background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        
        /* Utilities */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }

        .pb-safe { padding-bottom: calc(70px + env(safe-area-inset-bottom)); }

        /* Accordion transition */
        .accordion-content { transition: max-height 0.3s ease-out; overflow: hidden; max-height: 0; }
        .accordion-active .accordion-content { max-height: 800px; }
        .accordion-active .accordion-icon { transform: rotate(180deg); }
        .accordion-active .accordion-header { background-color: #EEF2FF; color: #6366F1; }
    </style>
</head>

<body class="flex flex-col min-h-screen pb-safe md:pb-0">

    <!-- Navbar Desktop -->
    <nav class="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-border shadow-sm transition-transform duration-300" id="navbar">
        <div class="max-w-7xl mx-auto px-[16px] md:px-[24px] h-[64px] md:h-[80px] flex items-center justify-between">
            <a href="/" class="flex items-center text-[1.25rem] md:text-[1.5rem] font-bold text-primary">
                ${CONFIG.BRAND_NAME}
            </a>
            
            <div class="hidden md:flex items-center gap-[32px] font-medium text-muted">
                <a href="/" class="hover:text-primary transition-colors">หน้าแรก</a>
                <a href="/profiles.html" class="text-primary font-bold border-b-2 border-primary pb-1">น้องๆ VIP</a>
                <a href="/locations.html" class="hover:text-primary transition-colors">พิกัดบริการ</a>
                <a href="/about.html" class="hover:text-primary transition-colors">เกี่ยวกับเรา</a>
                <a href="/blog.html" class="hover:text-primary transition-colors">บทความ</a>
            </div>
            
            <div class="flex items-center gap-[16px]">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="hidden md:flex items-center gap-[8px] bg-[#00B900] text-white px-[20px] py-[10px] rounded-full font-bold text-small hover:bg-[#009900] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    <i class="fab fa-line text-lg"></i> แอดไลน์จอง
                </a>
                
                <!-- Mobile Hamburger Button -->
                <button id="menu-btn" aria-label="เปิดเมนูมือถือ" class="md:hidden w-10 h-10 flex items-center justify-center text-textPrimary bg-bg rounded-full border border-border focus:outline-none">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </nav>

    <!-- Sidebar Mobile Menu (Restored 100%) -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-textPrimary/80 backdrop-blur-sm z-[60] hidden opacity-0 transition-opacity duration-300"></div>
    <nav id="sidebar-menu" class="fixed top-0 right-0 h-full w-[280px] bg-surface border-l border-border shadow-2xl z-[70] transform translate-x-full transition-transform duration-300 flex flex-col">
        <div class="flex items-center justify-between p-[20px] border-b border-border">
            <span class="text-[1.25rem] font-bold text-primary">MENU</span>
            <button id="close-menu-btn" class="w-8 h-8 flex items-center justify-center rounded-full bg-bg text-muted hover:text-textPrimary hover:bg-border transition-colors">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-[16px] space-y-[8px]">
            <a href="/" class="flex items-center gap-[16px] p-[12px] rounded-xl hover:bg-bg text-muted hover:text-primary transition-colors font-medium"><i class="fas fa-home w-6 text-center"></i> หน้าแรก</a>
            <a href="/profiles.html" class="flex items-center gap-[16px] p-[12px] rounded-xl bg-primary/10 text-primary font-bold"><i class="fas fa-gem w-6 text-center"></i> น้องๆ VIP</a>
            <a href="/locations.html" class="flex items-center gap-[16px] p-[12px] rounded-xl hover:bg-bg text-muted hover:text-primary transition-colors font-medium"><i class="fas fa-map-marker-alt w-6 text-center"></i> พิกัดบริการ</a>
            <a href="/about.html" class="flex items-center gap-[16px] p-[12px] rounded-xl hover:bg-bg text-muted hover:text-primary transition-colors font-medium"><i class="fas fa-info-circle w-6 text-center"></i> เกี่ยวกับเรา</a>
            <a href="/faq.html" class="flex items-center gap-[16px] p-[12px] rounded-xl hover:bg-bg text-muted hover:text-primary transition-colors font-medium"><i class="fas fa-question-circle w-6 text-center"></i> คำถามพบบ่อย</a>
            <a href="/blog.html" class="flex items-center gap-[16px] p-[12px] rounded-xl hover:bg-bg text-muted hover:text-primary transition-colors font-medium"><i class="fas fa-newspaper w-6 text-center"></i> บทความ</a>
        </div>
        <div class="p-[20px] border-t border-border pb-[calc(20px+env(safe-area-inset-bottom))]">
            <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-[8px] w-full bg-[#00B900] text-white py-[14px] rounded-xl font-bold">
                <i class="fab fa-line text-xl"></i> ติดต่อแอดมิน
            </a>
        </div>
    </nav>

    <main class="flex-grow z-20">
        
        <!-- Hero Section -->
        <header class="bg-gradient-to-b from-[#EEF2FF] to-bg pt-[48px] md:pt-[80px] pb-[48px] px-[16px] relative overflow-hidden">
            <!-- Decorative Elements -->
            <div class="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-10 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
            
            <div class="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
                <span class="inline-block bg-primary/10 text-primary font-bold text-xs px-4 py-1.5 rounded-full mb-6 border border-primary/20">Exclusive Escort Service</span>
                <h1 class="text-textPrimary mb-[16px] drop-shadow-sm">${escapeHTML(title)}</h1>
                <p class="text-[1rem] md:text-[1.25rem] text-muted font-medium mb-[32px] max-w-2xl mx-auto leading-relaxed">
                    ค้นหาและจองน้องๆ <strong>ไซด์ไลน์${escapeHTML(provinceName)}</strong> แบบพรีเมียม ปลอดภัย ไม่มัดจำ จ่ายหน้างาน 100%
                </p>
                
                <div class="flex flex-col sm:flex-row items-center justify-center gap-[16px]">
                    <a href="#profiles-grid" class="w-full sm:w-auto btn-primary px-[32px] py-[16px] text-[1.125rem] flex items-center justify-center gap-2">
                        <i class="fas fa-search"></i> ค้นหาโปรไฟล์
                    </a>
                    <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="w-full sm:w-auto btn-outline px-[32px] py-[16px] text-[1.125rem] flex items-center justify-center gap-2">
                        <i class="fab fa-line text-[#00B900] text-xl"></i> แอดไลน์เช็คคิว
                    </a>
                </div>
            </div>
        </header>

        <!-- Trust Badges (3 Cards) -->
        <section class="max-w-5xl mx-auto px-[16px] -mt-[24px] relative z-20 mb-[64px]">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                <div class="card p-[24px] text-center shadow-md bg-surface">
                    <div class="w-[48px] h-[48px] bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                        <i class="fas fa-shield-alt text-primary text-xl"></i>
                    </div>
                    <h3 class="text-[1.125rem] font-bold text-textPrimary mb-[4px]">ไม่มัดจำ 100%</h3>
                    <p class="text-muted text-[0.875rem] m-0">ปลอดภัย ไร้กังวลเรื่องโอนเงินก่อน</p>
                </div>
                <div class="card p-[24px] text-center shadow-md bg-surface">
                    <div class="w-[48px] h-[48px] bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                        <i class="fas fa-money-bill-wave text-secondary text-xl"></i>
                    </div>
                    <h3 class="text-[1.125rem] font-bold text-textPrimary mb-[4px]">จ่ายหน้างาน</h3>
                    <p class="text-muted text-[0.875rem] m-0">เจอตัวจริง ถูกใจ แล้วค่อยชำระเงิน</p>
                </div>
                <div class="card p-[24px] text-center shadow-md bg-surface">
                    <div class="w-[48px] h-[48px] bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                        <i class="fas fa-check-circle text-accent text-xl"></i>
                    </div>
                    <h3 class="text-[1.125rem] font-bold text-textPrimary mb-[4px]">ตรงปกชัวร์</h3>
                    <p class="text-muted text-[0.875rem] m-0">รูปโปรไฟล์ผ่านการยืนยันตัวตนแล้ว</p>
                </div>
            </div>
        </section>

        <!-- Search Form Error Fix (Loading/Fallback Area) -->
        <div class="max-w-7xl mx-auto px-[16px] md:px-[24px] mb-[24px]">
            <div class="bg-surface border border-border p-[16px] md:p-[20px] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-[16px] shadow-sm">
                <h2 class="text-[1.5rem] !mb-0 flex items-center gap-[12px] text-textPrimary font-bold">
                    <i class="fas fa-fire text-accent"></i> ยอดนิยมสัปดาห์นี้
                </h2>
                <div class="relative w-full md:w-[320px]">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="fas fa-search text-muted"></i>
                    </div>
                    <input type="text" placeholder="ค้นหาชื่อน้อง, โซน, หรือสเปค..." class="block w-full pl-11 pr-4 py-3 border border-border rounded-xl bg-bg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-[0.875rem] text-textPrimary placeholder-muted transition-shadow shadow-inner cursor-pointer" readonly onclick="window.location.href='/search'">
                </div>
            </div>
        </div>

        <!-- Profile Grid -->
        <section id="profiles-grid" class="max-w-7xl mx-auto px-[16px] md:px-[24px] mb-[64px] scroll-mt-24">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[12px] md:gap-[24px]">
                ${cardsHTML}
            </div>
            
            ${profiles.length >= 20 ? `
            <div class="mt-[48px] text-center">
                <a href="/search?province=${provinceKey}" class="btn-outline inline-flex items-center gap-[8px] px-[32px] py-[14px] shadow-sm hover:shadow-md">
                    ดูโปรไฟล์น้องๆ เพิ่มเติม <i class="fas fa-arrow-down text-primary"></i>
                </a>
            </div>` : ''}
        </section>

        <!-- Zone Chips (Clickable Pill tags) -->
        <section class="max-w-5xl mx-auto px-[16px] mb-[64px] text-center">
            <h2 class="mb-[24px] flex items-center justify-center gap-3 text-textPrimary">
                <i class="fas fa-map-marked-alt text-primary"></i> โซนบริการยอดฮิต
            </h2>
            <div class="flex flex-wrap justify-center gap-[10px]">
                ${(seoData.zones ||[]).map(z => `
                <a href="/search?province=${provinceKey}&zone=${encodeURIComponent(z)}" class="bg-surface border border-border text-muted rounded-full px-[20px] py-[10px] text-[0.875rem] font-medium hover:border-primary hover:text-primary hover:bg-[#EEF2FF] transition-all cursor-pointer shadow-sm">
                    ${escapeHTML(z)}
                </a>
                `).join('')}
            </div>
        </section>

        <!-- 3 Steps Flow -->
        <section class="bg-surface border-y border-border py-[64px] mb-[64px]">
            <div class="max-w-6xl mx-auto px-[16px]">
                <div class="text-center mb-[48px]">
                    <h2 class="text-textPrimary mb-[8px]">📱 จองง่าย 3 ขั้นตอน</h2>
                    <p class="text-muted text-[1rem]">สะดวกรวดเร็ว ปลอดภัย ไร้กังวลเรื่องมิจฉาชีพ</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-[24px] relative">
                    <!-- Connector line for Desktop -->
                    <div class="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-border z-0"></div>
                    
                    <div class="card p-[32px] text-center shadow-sm relative z-10 hover:-translate-y-1">
                        <div class="absolute -top-[16px] left-1/2 transform -translate-x-1/2 w-[32px] h-[32px] bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">1</div>
                        <div class="w-16 h-16 mx-auto bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-[16px]">
                            <i class="fas fa-search text-3xl text-primary"></i>
                        </div>
                        <h3 class="text-[1.25rem] font-bold mb-[8px]">เลือกค้นหาดูรูป</h3>
                        <p class="text-muted text-[0.875rem]">เลือกโปรไฟล์น้องและเรทราคาที่ตรงใจจากหน้าเว็บไซต์</p>
                    </div>
                    
                    <div class="card p-[32px] text-center shadow-sm relative z-10 hover:-translate-y-1">
                        <div class="absolute -top-[16px] left-1/2 transform -translate-x-1/2 w-[32px] h-[32px] bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">2</div>
                        <div class="w-16 h-16 mx-auto bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-[16px]">
                            <i class="fab fa-line text-3xl text-primary"></i>
                        </div>
                        <h3 class="text-[1.25rem] font-bold mb-[8px]">แอดไลน์เช็คคิว</h3>
                        <p class="text-muted text-[0.875rem]">แคปรูปส่งให้แอดมิน เพื่อเช็คคิวว่างและยืนยันจุดนัดหมาย</p>
                    </div>
                    
                    <div class="card p-[32px] text-center shadow-sm relative z-10 hover:-translate-y-1">
                        <div class="absolute -top-[16px] left-1/2 transform -translate-x-1/2 w-[32px] h-[32px] bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">3</div>
                        <div class="w-16 h-16 mx-auto bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-[16px]">
                            <i class="fas fa-hand-holding-usd text-3xl text-primary"></i>
                        </div>
                        <h3 class="text-[1.25rem] font-bold mb-[8px]">นัดเจอจ่ายสด</h3>
                        <p class="text-muted text-[0.875rem]">เจอตัวจริงตรงปก แล้วค่อยชำระเงินกับน้องโดยตรง</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Advanced SEO & FAQ Accordion -->
        <section class="max-w-4xl mx-auto px-[16px] pb-[80px]">
            <!-- Added SEO Content Area (Restored from generateAppSeoText logic) -->
            <div class="card p-[24px] md:p-[48px] shadow-sm mb-[48px] bg-gradient-to-br from-surface to-bg">
                <div class="text-center mb-[32px]">
                    <span class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"><i class="fas fa-crown"></i> Exclusive Guide</span>
                    <h2 class="text-textPrimary font-bold mb-[16px]">ทำไมต้องเลือก ไซด์ไลน์${escapeHTML(provinceName)} กับเรา?</h2>
                    <p class="text-muted text-[1rem] md:text-[1.125rem] leading-relaxed">${seoData.uniqueIntro}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                    <div class="bg-surface border border-border p-[24px] rounded-2xl">
                        <div class="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center text-primary mb-4"><i class="fas fa-map-marked-alt text-xl"></i></div>
                        <h3 class="text-[1.125rem] font-bold mb-3">ครอบคลุมทุกพื้นที่</h3>
                        <p class="text-muted text-[0.875rem]">ให้บริการในโซนยอดฮิต และสามารถนัดพบในสถานที่ส่วนตัว โรงแรม หรือรีสอร์ทได้อย่างปลอดภัย</p>
                    </div>
                    <div class="bg-surface border border-border p-[24px] rounded-2xl">
                        <div class="w-10 h-10 bg-[#ECFDF5] rounded-xl flex items-center justify-center text-secondary mb-4"><i class="fas fa-user-shield text-xl"></i></div>
                        <h3 class="text-[1.125rem] font-bold mb-3">มาตรฐานความปลอดภัย</h3>
                        <ul class="text-muted text-[0.875rem] space-y-2">
                            <li><i class="fas fa-check text-secondary mr-2"></i> ไม่เก็บมัดจำล่วงหน้า</li>
                            <li><i class="fas fa-check text-secondary mr-2"></i> รักษาความลับลูกค้า 100%</li>
                            <li><i class="fas fa-check text-secondary mr-2"></i> คัดกรองตัวตนอย่างเข้มงวด</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- FAQ Accordion -->
            ${seoData.faqs && seoData.faqs.length > 0 ? `
            <div>
                <h2 class="text-center mb-[32px] text-textPrimary">❓ คำถามที่พบบ่อย (FAQ)</h2>
                <div class="space-y-[12px]">
                    ${seoData.faqs.map(faq => `
                    <div class="bg-surface border border-border rounded-xl overflow-hidden accordion-item shadow-sm">
                        <button class="accordion-header w-full px-[24px] py-[20px] text-left flex justify-between items-center focus:outline-none hover:bg-bg transition-colors">
                            <span class="font-bold text-textPrimary pr-4"><span class="text-primary mr-2">Q:</span>${escapeHTML(faq.q)}</span>
                            <i class="fas fa-chevron-down text-muted transition-transform duration-300 accordion-icon shrink-0"></i>
                        </button>
                        <div class="accordion-content bg-bg">
                            <p class="px-[24px] py-[20px] text-muted border-t border-border m-0 leading-relaxed"><span class="text-secondary font-bold mr-2">A:</span>${escapeHTML(faq.a)}</p>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </section>

    </main>

    <!-- Footer (Restored allProvinces logic) -->
    <footer class="bg-surface border-t border-border pt-[48px] pb-[80px] md:pb-[48px] mt-auto">
        <div class="max-w-7xl mx-auto px-[16px] md:px-[24px]">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-[40px] mb-[48px]">
                
                <div class="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                    <span class="text-[1.5rem] font-bold text-primary mb-[16px]">${CONFIG.BRAND_NAME}</span>
                    <p class="text-muted text-[0.875rem] leading-relaxed mb-[24px]">
                        คลับพักผ่อนระดับพรีเมียม ศูนย์รวมนางแบบและเพื่อนเที่ยวที่ปลอดภัย เราคัดกรองโปรไฟล์อย่างเข้มงวดและรักษาความลับลูกค้าเป็นอันดับหนึ่ง
                    </p>
                    <div class="flex gap-[16px]">
                        <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" class="w-10 h-10 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:bg-[#009900] transition-colors"><i class="fab fa-line text-xl"></i></a>
                        <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank" class="w-10 h-10 rounded-full bg-bg border border-border text-textPrimary flex items-center justify-center hover:bg-border transition-colors"><i class="fab fa-twitter text-lg"></i></a>
                    </div>
                </div>

                <div class="md:col-span-3 text-center md:text-left">
                    <h3 class="text-[1rem] font-bold text-textPrimary uppercase tracking-wider mb-[20px]">เมนูหลัก</h3>
                    <ul class="space-y-[12px] text-[0.875rem] text-muted">
                        <li><a href="/profiles.html" class="hover:text-primary transition-colors">ค้นหาน้องๆ VIP</a></li>
                        <li><a href="/locations.html" class="hover:text-primary transition-colors">โซนให้บริการ</a></li>
                        <li><a href="/faq.html" class="hover:text-primary transition-colors">ขั้นตอนการจอง</a></li>
                        <li><a href="/about.html" class="hover:text-primary transition-colors">เกี่ยวกับเรา</a></li>
                        <li><a href="/blog.html" class="hover:text-primary transition-colors">บทความน่ารู้</a></li>
                    </ul>
                </div>

                <!-- จังหวัดอื่นๆ Loop (Restored!) -->
                <div class="md:col-span-5 text-center md:text-left">
                    <h3 class="text-[1rem] font-bold text-textPrimary uppercase tracking-wider mb-[20px]">จังหวัดที่มีให้บริการ</h3>
                    <ul class="flex flex-col gap-[10px] text-[0.875rem] text-muted h-[160px] overflow-y-auto pr-3 custom-scrollbar">
                        ${allProvinces.map(p => `
                            <li>
                                <a href="/location/${p.key}" class="flex items-center justify-center md:justify-start gap-[8px] hover:text-primary transition-colors group p-1 rounded hover:bg-bg">
                                    <span class="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors"></span>
                                    รับงาน${escapeHTML(p.nameThai)}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>

            </div>

            <div class="border-t border-border pt-[32px] flex flex-col md:flex-row justify-between items-center gap-[16px]">
                <p class="text-small text-muted m-0 text-center md:text-left">© ${CURRENT_YEAR} ${CONFIG.BRAND_NAME}. All rights reserved. <br class="md:hidden"/>สำหรับผู้มีอายุ 20 ปีขึ้นไปเท่านั้น</p>
                <div class="flex gap-[24px] text-small text-muted font-medium">
                    <a href="/privacy-policy.html" class="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="/terms.html" class="hover:text-primary transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Mobile Bottom Navigation bar -->
    <nav class="fixed bottom-0 left-0 w-full md:hidden bg-surface/95 backdrop-blur-md border-t border-border z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <ul class="flex items-center justify-around h-[64px] px-[8px] m-0 list-none">
            <li class="w-full h-full">
                <a href="/" class="flex flex-col items-center justify-center w-full h-full text-muted hover:text-primary transition-colors">
                    <i class="fas fa-home text-[20px] mb-[2px]"></i>
                    <span class="text-[10px] font-medium">หน้าแรก</span>
                </a>
            </li>
            <li class="w-full h-full">
                <a href="/profiles.html" class="flex flex-col items-center justify-center w-full h-full text-primary">
                    <i class="fas fa-gem text-[20px] mb-[2px]"></i>
                    <span class="text-[10px] font-bold">VIP</span>
                </a>
            </li>
            <li class="w-full h-full relative">
                <a href="${CONFIG.SOCIAL_LINKS.line}" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center justify-center w-full h-full group absolute -top-[24px] left-0">
                    <div class="w-[56px] h-[56px] bg-[#00B900] rounded-full flex items-center justify-center text-white border-[4px] border-surface shadow-lg transform group-active:scale-95 transition-transform">
                        <i class="fab fa-line text-[28px]"></i>
                    </div>
                    <span class="text-[10px] font-bold text-textPrimary mt-[4px]">จองคิว</span>
                </a>
            </li>
            <li class="w-full h-full">
                <a href="/locations.html" class="flex flex-col items-center justify-center w-full h-full text-muted hover:text-primary transition-colors">
                    <i class="fas fa-map-marker-alt text-[20px] mb-[2px]"></i>
                    <span class="text-[10px] font-medium">พื้นที่</span>
                </a>
            </li>
            <li class="w-full h-full">
                <a href="/search" class="flex flex-col items-center justify-center w-full h-full text-muted hover:text-primary transition-colors">
                    <i class="fas fa-search text-[20px] mb-[2px]"></i>
                    <span class="text-[10px] font-medium">ค้นหา</span>
                </a>
            </li>
        </ul>
    </nav>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        // 1. App-like Navbar Hide/Show on Scroll
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

        // 2. Sidebar Menu Logic (Restored)
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

        // 3. FAQ Accordion Logic
        const accordions = document.querySelectorAll('.accordion-item');
        accordions.forEach(item => {
            const btn = item.querySelector('button');
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('accordion-active');
                
                // Close all
                accordions.forEach(acc => acc.classList.remove('accordion-active'));
                
                // Open clicked if it was not active
                if (!isActive) {
                    item.classList.add('accordion-active');
                }
            });
        });

        // 4. Safe Scroll Animation (IntersectionObserver Restored safely)
        if ('IntersectionObserver' in window) {
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        entry.target.classList.remove('opacity-0');
                        observer.unobserve(entry.target); 
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.animate-fade-in-up').forEach(el => {
                el.style.animationPlayState = 'paused';
                observer.observe(el);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('.animate-fade-in-up').forEach(el => {
                el.classList.remove('opacity-0');
                el.style.animationPlayState = 'running';
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
        return new Response('<div style="text-align:center;padding:50px;font-family:sans-serif;"><h2>ระบบขัดข้องชั่วคราว</h2><p>กรุณาลองใหม่อีกครั้ง</p></div>', { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
}