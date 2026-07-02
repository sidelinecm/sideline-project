
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const CONFIG = {
    get SUPABASE_URL() {
        try { return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co"; } catch { return "https://zxetzqwjaiumqhrpumln.supabase.co"; }
    },
    get SUPABASE_KEY() {
        try { return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; } catch { return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"; }
    },
    ALLOWED_DOMAINS: ["sidelinechiangmai.netlify.app", "localhost", "127.0.0.1"],
    BRAND_NAME: "SIDELINE CHIANGMAI",
    TWITTER: "@sidelinechiangmai",
    DESCRIPTION: "แหล่งข้อมูลเพื่อนเที่ยวและผู้ดูแลทริปพรีเมียม ผ่านการยืนยันตัวตน มีระบบความปลอดภัยด้วยการชำระเงินหน้างาน ปราศจากการโอนมัดจำก่อนพบตัวจริง",
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
    uniqueIntro: `
      <p class="mb-4"><strong>ไซด์ไลน์เชียงใหม่</strong> คือ บริการเพื่อนเที่ยวนางแบบ และเด็กเอ็นเตอร์เทนระดับพรีเมียม ในพื้นที่จังหวัดเชียงใหม่ที่เน้นการดูแลแบบฟิวแฟน (Girlfriend Experience) ปลอดภัย 100% นัดเจอตัวจริงเพื่อชำระเงินหน้างานโดยไม่มีเงื่อนไขโอนมัดจำล่วงหน้าทุกกรณี</p>
      <p class="mb-4">เราพร้อมให้บริการครอบคลุมทุกโซนสำคัญเพื่อความสะดวกในการนัดหมาย ไม่ว่าจะเป็นการเดินเล่นพักผ่อนย่าน <strong>ถนนนิมมานเหมินท์</strong>, คุยงานสไตล์พูลวิลล่าส่วนตัวแถบ <strong>แม่ริม และหางดง</strong>, หรือความเป็นส่วนตัวสูงตามคอนโดพรีเมียมย่าน <strong>เจ็ดยอด และสันติธรรมพลาซ่า</strong> ตลอดจนสันทรายและแถบมหาวิทยาลัยแม่โจ้ ใกล้ห้างสรรพสินค้า MAYA และมหาวิทยาลัยเชียงใหม่ (มช.)</p>
      <p>โปรไฟล์น้องๆ ทุกคนได้รับการตรวจสอบประวัติและถ่ายภาพยืนยันตัวตนว่าตรงปก เพื่อให้คุณได้รับประสบการณ์พักผ่อนอย่างอบอุ่นและเป็นส่วนตัวสูงที่สุดในค่ำคืนนี้อย่างสบายใจ</p>
    `,
    faqs: [
      { q: "หาน้องๆ รับงานเชียงใหม่ โซนไหนเดินทางสะดวกและเป็นส่วนตัวสุด?", a: "โซนนิมมาน สันติธรรม และเจ็ดยอด เป็นทำเลที่น้องๆ พร้อมให้บริการมากที่สุดเนื่องจากมีโรงแรมหรูและคอนโดมิเนียมรองรับการนัดหมายอย่างปลอดภัยและสะดวกสบาย" },
      { q: "ความปลอดภัยในการเรียกสาวไซด์ไลน์เชียงใหม่เป็นอย่างไร?", a: "เราใช้ระบบ 'เจอตัวจริงค่อยชำระค่าขนมหน้างาน' ไม่ต้องมีการโอนมัดจำเพื่อความปลอดภัยและป้องกันกลุ่มมิจฉาชีพ 100% พร้อมเก็บข้อมูลส่วนตัวของลูกค้าเป็นความลับสูงสุด" },
      { q: "น้องๆ สามารถเดินทางไปบริการที่รีสอร์ทส่วนตัวต่างอำเภอในเชียงใหม่ได้ไหม?", a: "ได้แน่นอนครับ น้องๆ ยินดีเดินทางไปดูแลคุณถึงรีสอร์ทหรือพูลวิลล่าส่วนตัวต่างอำเภอ (เช่น แม่ริม, หางดง, สันทราย, สะเมิง) แต่อาจมีค่าเดินทางเพิ่มเติมตามตกลงร่วมกัน" }
    ]
  },
  bangkok: {
    name: "กรุงเทพ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "สาทร", "สีลม", "ทองหล่อ", "เอกมัย", "ปิ่นเกล้า", "บางนา", "เลียบด่วน"],
    lsi: ["รับงานกรุงเทพ", "ไซด์ไลน์ กทม", "สาวไซด์ไลน์กรุงเทพ", "sideline bkk", "พริตตี้ กทม.", "เด็กเอ็นพรีเมียม", "เพื่อนเที่ยวส่วนตัว", "นางแบบรับงาน"],
    uniqueIntro: `
      <p class="mb-4"><strong>ไซด์ไลน์กรุงเทพ (ไซด์ไลน์ กทม.)</strong> คือ แหล่งรวมพริตตี้ นางแบบอิสระ และน้องๆ นักศึกษาพาร์ทไทม์รับงานส่วนตัวในเขตกรุงเทพมหานคร เน้นงานบริการดูแลฟิวแฟน (Girlfriend Experience) ระดับพรีเมียม รูปตรงปกจริง และปลอดภัยสูงสุดด้วยระบบจ่ายเงินหน้างานไร้มัดจำ</p>
      <p class="mb-4">สะดวกสบายด้วยทำเลที่ตั้งครอบคลุมจุดแลนด์มาร์กสำคัญทั่วกรุง ตั้งแต่ย่านธุรกิจใจกลางเมืองอย่าง <strong>สุขุมวิท, ทองหล่อ, เอกมัย, สาทร และสีลม</strong> ไปจนถึงทำเลยอดนิยมของสายบันเทิงอย่าง <strong>รัชดา-ห้วยขวาง</strong> ตลอดจนย่านลาดพร้าว ปิ่นเกล้า และบางนา นัดพบคอนโดหรูและโรงแรมห้าดาว ใกล้สถานีรถไฟฟ้า BTS และ MRT เดินทางนัดหมายสะดวกรวดเร็ว</p>
      <p>มั่นใจได้ในระบบบริการที่เป็นส่วนตัวสูงสุด ปราศจากขั้นตอนการโกงเงินโอนมัดจำ คัดเฉพาะตัวท็อปเพื่องานสังสรรค์ ปาร์ตี้ หรือการพักผ่อนอย่างอบอุ่นสูงสุดของคุณ</p>
    `,
    faqs: [
      { q: "น้องๆ รับงานกรุงเทพ ส่วนใหญ่สะดวกสแตนด์บายแถวไหนบ้าง?", a: "ย่านที่มีน้องๆ ประจำการอยู่หนาแน่นที่สุดคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ ซึ่งเป็นย่านคอนโดมิเนียมหรูและเดินทางด้วยรถไฟฟ้า BTS และ MRT" },
      { q: "เรียกเด็กเอ็น หรือ สาวไซด์ไลน์ กทม. ต้องโอนมัดจำล่วงหน้าก่อนไหม?", a: "ไม่มีนโยบายการเก็บเงินมัดจำล่วงหน้าทุกกรณีครับ เพื่อความปลอดภัยของลูกค้ากทม. จะเป็นการจ่ายเงินสดหรือโอนชำระหน้างานหลังเจอตัวน้องตรงปกแล้วเท่านั้น" }
    ]
  },
  lampang: {
    name: "ลำปาง",
    geo: { lat: 18.2913, lng: 99.4922 },
    zones: ["ตัวเมืองลำปาง", "สวนดอก", "พระบาท", "ม.ราชภัฏลำปาง", "เกาะคา", "แม่ทะ", "น้ำล้อม"],
    lsi: ["รับงานลำปาง", "ไซด์ไลน์ลำปาง", "สาวไซด์ไลน์ลำปาง", "sideline ลำปาง", "นักศึกษาลำปาง", "เพื่อนเที่ยวลำปาง", "เด็กเอ็นลำปาง"],
    uniqueIntro: `
      <p class="mb-4"><strong>ไซด์ไลน์ลำปาง</strong> คือ บริการเพื่อนเที่ยวดูแลแบบคนรู้ใจของน้องๆ สาวเหนือผิวขาวหน้าหวานในจังหวัดลำปาง เหมาะสำหรับผู้ที่ต้องการหาคนเคียงข้างในบรรยากาศผ่อนคลาย อบอุ่นเป็นกันเอง และไม่มีความปลอดภัยที่หละหลวมด้วยข้อตกลงเจอตัวจริงค่อยจ่ายเงิน</p>
      <p class="mb-4">รองรับการนัดหมายตามจุดบริการหลักในพื้นที่ ไม่ว่าจะเป็นย่านคอนโดมิเนียมและโรงแรมแถบ <strong>ตัวเมืองลำปาง, ย่านสวนดอก, ย่านพระบาท</strong> หรือโซนที่พักใกล้กับ <strong>มหาวิทยาลัยราชภัฏลำปาง</strong> ไปจนถึงโซนนอกเมืองอย่างเกาะคาและแม่ทะ น้องๆ ของเรายินดีดูแลทั้งทริปคาเฟ่ชิลๆ ทานข้าว หรือทำหน้าที่เป็นเด็กชงเหล้าในงานเลี้ยงสังสรรค์ส่วนบุคคล</p>
      <p>รูปภาพโปรไฟล์ผ่านการตรวจเทียบว่าตรงปกจริง มารยาทการเทคแคร์ดีเยี่ยม และไม่ต้องเผชิญกับระบบเก็บมัดจำล่วงหน้าที่เสี่ยงต่อความไม่ปลอดภัย</p>
    `,
    faqs: [
      { q: "ค้นหาไซด์ไลน์ลำปาง นัดหมายโซนใดปลอดภัยที่สุด?", a: "พื้นที่ตัวเมืองลำปาง โซนสวนดอก และย่านพระบาท เป็นจุดที่มีโรงแรมและคอนโดคุณภาพดี รองรับการพบปะนัดเจออย่างสงบและปลอดภัยสูงสุด" },
      { q: "มีการรับประกันความตรงปกของน้องๆ ลำปางอย่างไร?", a: "เราคัดกรองโปรไฟล์และข้อมูลสัดส่วนจริง ถ้านัดเจอน้องที่หน้างานลำปางแล้วพบว่าไม่ตรงตามที่ตกลง ลูกค้าสามารถปฏิเสธและยกเลิกคิวได้ทันทีโดยไม่มีค่าใช้จ่าย" }
    ]
  },
  chiangrai: {
    name: "เชียงราย",
    geo: { lat: 19.9071, lng: 99.8325 },
    zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "ม.แม่ฟ้าหลวง", "ม.ราชภัฏเชียงราย", "หอนาฬิกา", "ริมกก"],
    lsi: ["รับงานเชียงราย", "ไซด์ไลน์เชียงราย", "สาวไซด์ไลน์เชียงราย", "sideline เชียงราย", "น้องนักศึกษาเชียงราย", "เด็กเอ็นเชียงราย"],
    uniqueIntro: `
      <p class="mb-4"><strong>ไซด์ไลน์เชียงราย</strong> คือ บริการเพื่อนเที่ยวพาร์ทไทม์ และน้องๆ นักศึกษาลุคเรียบร้อยพูดเพราะในพื้นที่จังหวัดเชียงราย ที่ยินดีรับงานอิสระดูแลเอาใจใส่ลูกค้าสไตล์คู่รักพรีเมียม ปลอดภัยสูง จ่ายเงินสดหน้างาน ไม่มีการเก็บเงินมัดจำล่วงหน้า</p>
      <p class="mb-4">พื้นที่ให้บริการนัดหมายสะดวกสบายครอบคลุมย่านยอดฮิต เช่น ทำเลรอบ <strong>มหาวิทยาลัยแม่ฟ้าหลวง (มฟล.)</strong>, ย่านสถานศึกษาแถว <strong>บ้านดู่ และ ม.ราชภัฏเชียงราย</strong>, ไปจนถึงโรงแรมบูทีคใน <strong>ตัวเมืองเชียงราย และย่านริมแม่น้ำกก</strong> พร้อมร่วมทริปเดินทางท่องเที่ยว คาเฟ่ ทานข้าว หรือทำหน้าที่ดูแลอารมณ์ของคุณอย่างอบอุ่นเป็นกันเอง</p>
      <p>สัมผัสค่ำคืนแสนพิเศษเหนือสุดแดนสยามด้วยโปรไฟล์จริงตรงปก และการให้บริการที่เน้นความปลอดภัย ความลับ และความเป็นส่วนตัวระดับสูงสุดของคุณ</p>
    `,
    faqs: [
      { q: "ต้องการนัดพบน้องนักศึกษาเชียงราย โซน มฟล. หรือบ้านดู่ มีขั้นตอนอย่างไร?", a: "โซน ม.แม่ฟ้าหลวง และบ้านดู่ มีน้องๆ สแตนด์บายเยอะมากครับ สามารถแจ้งคิวและเวลาที่ต้องการกับแอดมิน เพื่อนัดพบตามห้องพัก คอนโด หรือโรงแรมใกล้เคียงได้ทันที" },
      { q: "มีความเสี่ยงที่จะโดนโกงมัดจำสำหรับการเรียกไซด์ไลน์เชียงรายไหม?", a: "เว็บไซต์ของเราใช้ระบบนัดเจอตัวจริงก่อนชำระเงินหน้างาน 100% จึงไม่มีความเสี่ยงเรื่องการโดนหลอกโอนเงินมัดจำล่วงหน้าแน่นอนครับ" }
    ]
  },
  khonkaen: {
    name: "ขอนแก่น",
    geo: { lat: 16.4322, lng: 102.8236 },
    zones: ["มข.", "กังสดาล", "หลังมอ", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
    lsi: ["รับงานขอนแก่น", "ไซด์ไลน์ขอนแก่น", "สาวไซด์ไลน์ขอนแก่น", "sideline ขอนแก่น", "เด็กเอ็นขอนแก่น", "นักศึกษาขอนแก่น"],
    uniqueIntro: `
      <p class="mb-4"><strong>ไซด์ไลน์ขอนแก่น</strong> คือ ศูยน์รวมน้องๆ นักศึกษาพาร์ทไทม์หน้าตาน่ารักและพริตตี้สไตล์แซ่บซนในจังหวัดขอนแก่น คัดเฉพาะผู้ที่มีความจริงใจ มารยาทการดูแลดี และมีระบบป้องกันความปลอดภัยสูงสุดด้วยข้อตกลงเจอตัวจริงเพื่อชำระค่าขนมโดยไม่ต้องโอนเงินจองก่อน</p>
      <p class="mb-4">พื้นที่ให้บริการครอบคลุมทำเลฮิตหลัก ไม่ว่าจะเป็นย่านมหาวิทยาลัยชื่อดังอย่าง <strong>กังสดาล, หลัง มข., โนนม่วง</strong> หรือคอนโดมิเนียมใกล้ห้างดังแถว <strong>เซ็นทรัลพลาซ่าขอนแก่น และโรงแรมวิวสวยแถบบึงแก่นนคร</strong> ยินดีดูแลฟีลแฟนอย่างใกล้ชิดและให้เกียรติลูกค้าสูงสุด</p>
      <p>ตอบโจทย์ทั้งการจัดปาร์ตี้ส่วนตัวหรือหาคนรู้ใจเดินทางไปกินเที่ยว ยืนยันข้อมูลโปรไฟล์ตรงปกไม่ผ่านการตกแต่งเกินจริง เพื่อค่ำคืนที่แสนสุขใจของคุณ</p>
    `,
    faqs: [
      { q: "น้องๆ ไซด์ไลน์ขอนแก่น ส่วนใหญ่เป็นใครและน่าเชื่อถือไหม?", a: "มีทั้งกลุ่มน้องนักศึกษาระดับมหาวิทยาลัยพาร์ทไทม์ และนางแบบอิสระในขอนแก่น ทุกคนผ่านการตรวจสอบข้อมูลโปรไฟล์และตรงปกแน่นอน" },
      { q: "นัดหมายน้องๆ ขอนแก่น แถว มข. มีความปลอดภัยแค่ไหน?", a: "โซน มข. และกังสดาล เป็นแหล่งชุมชนเมืองที่มีความปลอดภัยสูง มีที่พักและคอนโดทันสมัยจำนวนมาก รองรับการนัดเจอที่สะดวกรวดเร็วและรักษาความลับสูงสุด" }
    ]
  },
  chonburi: {
    name: "ชลบุรี",
    geo: { lat: 13.3611, lng: 100.9847 },
    zones: ["พัทยา", "บางแสน", "ศรีราชา", "อมตะนคร", "ตัวเมืองชลบุรี", "ม.บูรพา"],
    lsi: ["รับงานชลบุรี", "ไซด์ไลน์ชลบุรี", "สาวไซด์ไลน์พัทยา", "sideline ชลบุรี", "เพื่อนเที่ยวบางแสน", "เด็กเอ็นพัทยา"],
    uniqueIntro: `
      <p class="mb-4"><strong>ไซด์ไลน์ชลบุรี (ไซด์ไลน์พัทยา-บางแสน)</strong> คือ แหล่งรวมพริตตี้ระดับท็อป สาวสวยหุ่นดีลุคอินเตอร์ และน้องๆ พาร์ทไทม์แถบภาคตะวันออก ที่ยินดีให้บริการเพื่อนเที่ยวฟิวแฟนพรีเมียม สนุกสนาน คลายเครียด และรับประกันความตรงปกด้วยเงื่อนไขจ่ายเงินหน้างานไร้มัดจำ</p>
      <p class="mb-4">รองรับพิกัดนัดเที่ยวและวันหยุดพักผ่อนริมทะเล ไม่ว่าจะเป็นย่านปาร์ตี้ยามค่ำคืนระดับโลกใน <strong>พัทยา</strong>, การท่องเที่ยวแบบชิลๆ ริมหาดวอนนภาแถว <strong>บางแสน และรอบ ม.บูรพา</strong>, หรือพื้นที่เป็นส่วนตัวแถบ <strong>ศรีราชา และนิคมอุตสาหกรรมอมตะนคร</strong> ยินดีช่วยดูแลทั้งทริปพูลวิลล่าและสังสรรค์ส่วนตัว</p>
      <p>จองคิวง่ายและปลอดภัยสูงสุดในเขตชลบุรีและพัทยา คลายกังวลเรื่องการโดนหลอกโอนมัดจำ คัดสรรเฉพาะคนน่ารักบริการประทับใจเพื่อเปลี่ยนวันพักผ่อนของคุณให้พิเศษยิ่งขึ้น</p>
    `,
    faqs: [
      { q: "หาสาวไซด์ไลน์พัทยา-บางแสน รูปตรงปกและไม่โดนหลอกมัดจำได้อย่างไร?", a: "เราเน้นย้ำมาตรฐานความตรงปกและใช้ระบบจ่ายเงินหน้างานเมื่อเจอตัวน้องเท่านั้น ป้องกันปัญหาการหลอกโอนเงินจองคิวก่อนได้แน่นอนครับ" },
      { q: "น้องๆ รับงานพูลวิลล่า ค้างคืน หรือเดินทางไปกับทริปท่องเที่ยวบางแสนไหม?", a: "มีครับ เรามีกลุ่มน้องๆ สายปาร์ตี้เอนเตอร์เทนส่วนตัวที่ชำนาญงานพูลวิลล่าและพร้อมร่วมทริปริมทะเลบางแสน-พัทยาเพื่อดูแลคุณอย่างใกล้ชิด" }
    ]
  },
  phitsanulok: {
    name: "พิษณุโลก",
    geo: { lat: 16.8219, lng: 100.2659 },
    zones: ["ตัวเมืองพิษณุโลก", "ม.นเรศวร", "ริมน้ำน่าน", "เซ็นทรัลพิษณุโลก"],
    lsi: ["รับงานพิษณุโลก", "ไซด์ไลน์พิษณุโลก", "สาวไซด์ไลน์พิษณุโลก", "sideline พิษณุโลก", "น้องนักศึกษามน", "เด็กเอ็นพิษณุโลก"],
    uniqueIntro: `
      <p class="mb-4"><strong>ไซด์ไลน์พิษณุโลก</strong> คือ บริการเพื่อนเทียวนางแบบอิสระ และน้องนักศึกษาพาร์ทไทม์ มหาวิทยาลัยนเรศวร (มน.) ที่รับงานส่วนตัวในเมืองสองแคว เน้นการดูแลประทับใจ ฟีลคู่รักหวานพูดเพราะ และปลอดภัยสูงสุดด้วยระบบนัดเจอตัวชำระเงินหน้างานไม่มีการเรียกมัดจำ</p>
      <p class="mb-4">เลือกนัดพบน้องๆ ได้ตามพิกัดยอดนิยม เช่น คอนโดหรูใกล้มหาวิทยาลัย <strong>ม.นเรศวร (มน.)</strong>, ย่านช้อปปิ้งใจกลางเมืองแถว <strong>เซ็นทรัลพลาซ่าพิษณุโลก</strong> ตลอดจนที่พักริมแม่น้ำสายหลักแถบ <strong>ริมน้ำน่าน</strong> ยินดีควงแขน ทานข้าว ช้อปปิ้ง หรือพูดคุยคลายเครียดในมุมส่วนตัวอย่างเป็นส่วนตัวสูงสุด</p>
      <p>คัดกรองคุณภาพมารยาทและการใส่ใจบริการระดับพรีเมียม รูปตรงปกไม่ดึงภาพฟิลเตอร์ลวงตา เพื่อให้ผู้ใช้บริการมั่นใจในความถูกต้องโปร่งใสสูงสุด</p>
    `,
    faqs: [
      { q: "หาไซด์ไลน์พิษณุโลก แถว มน. นัดหมายยากไหมและสะดวกเวลาใด?", a: "โซน ม.นเรศวร (มน.) มีน้องๆ นักศึกษาพาร์ทไทม์พร้อมบริการหนาแน่นที่สุด สามารถจองและนัดพบตามโรงแรมหรือหอพักใกล้เคียงได้อย่างสะดวกรวดเร็วเกือบตลอดทั้งวัน" },
      { q: "ต้องทำการโอนเงินมัดจำล่วงหน้าก่อนเรียกน้องพิษณุโลกไหม?", a: "ไม่ต้องโอนเงินก่อนใดๆ ทั้งสิ้นครับ ลูกค้าจะจ่ายเงินค่าขนมหลังจากเจอน้องตรงปกหน้างานแถบพิษณุโลกแล้วเท่านั้น เพื่อป้องกันความเสี่ยงอย่างสมบูรณ์แบบ" }
    ]
  },
  default: {
    name: "จังหวัดอื่นๆ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["ตัวเมือง", "พื้นที่ใกล้เคียง"],
    lsi: ["รับงานส่วนตัว", "สาวไซด์ไลน์", "sideline พรีเมียม", "เพื่อนเที่ยว", "เด็กเอ็น", "นักศึกษาพาร์ทไทม์", "สาวสวยตรงปก", "ดูแลฟิวแฟน"],
    uniqueIntro: `
      <p class="mb-4"><strong>บริการรับงานสาวไซด์ไลน์</strong> และเพื่อนเที่ยวเกรดพรีเมียมคัดคุณภาพทั่วประเทศไทย รวบรวมน้องๆ ที่มีใจรักงานบริการ มารยาทเรียบร้อย และเอาใจใส่ดูแลดั่งคู่รักข้างกาย ปลอดภัยมั่นใจได้จริง 100% ด้วยเงื่อนไขการนัดพบหน้างานแล้วค่อยจ่ายเงิน</p>
      <p class="mb-4">น้องๆ ของเราพร้อมทำหน้าที่ดูแลอย่างใกล้ชิดตามจุดสำคัญในเขต <strong>ตัวเมือง และพื้นที่ใกล้เคียง</strong> ทั่วประเทศ ไม่ว่าเป้าหมายของคุณคือการนัดดินเนอร์ ไปเที่ยวคาเฟ่ หรือมองหาเพื่อนร่วมปาร์ตี้เอนเตอร์เทนส่วนตัว ยินดีร่วมสร้างความประทับใจเคียงข้างคุณเสมอ</p>
      <p>เรารักษาข้อมูลส่วนบุคคลของลูกค้าเป็นความลับระดับสูงสุด รูปภาพทุกคนตรวจสอบสิทธิ์แล้วตรงปก ปราศจากขั้นตอนการบังคับโอนค่ามัดจำล่วงหน้าให้เสี่ยงต่อการโดนหลอก</p>
    `,
    faqs: [
      { q: "เรียกใช้บริการน้องๆ เพื่อนเที่ยว ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ เพื่อความปลอดภัยสูงสุดของคุณและป้องกันมิจฉาชีพ ลูกค้าจ่ายเงินค่าขนมหน้างานเมื่อเจอตัวน้องแล้วเท่านั้น" },
      { q: "หากพบตัวจริงของน้องแล้วพบว่าไม่ตรงตามรูปภาพโปรไฟล์ ต้องทำอย่างไร?", a: "โปรไฟล์รูปภาพทุกรูปผ่านการคัดกรองและยืนยันตัวตนแล้วว่าตรงปก หากพบตัวจริงแล้วไม่ตรงปก ลูกค้ามีสิทธิ์ปฏิเสธการร่วมงานและยกเลิกงานได้ทันทีโดยไม่มีค่าปรับหรือค่าใช้จ่ายใดๆ" }
    ]
  }
};

// ปรับปรุงการ Merge โครงสร้างอย่างปลอดภัย ป้องกันความเสี่ยงกรณี Key ตกหล่นจาก default structure
Object.keys(PROVINCE_SEO_DATA).forEach(key => {
    if (key !== "default") {
        PROVINCE_SEO_DATA[key] = { ...PROVINCE_SEO_DATA.default, ...PROVINCE_SEO_DATA[key] };
    }
});

const getFullUrl = (domain, path) => {
    if (!path) return `${domain}/images/default.webp`;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${domain}${cleanPath}`;
};

const optimizeImg = (domain, path, width = 360, height = 480) => {
    if (!path) return getFullUrl(domain, "/images/default.webp");
    if (path.includes("res.cloudinary.com")) {
        if (path.includes("/upload/")) {
            return path.replace("/upload/", `/upload/f_auto,q_auto,w_${width},h_${height},c_fill,g_face/`);
        }
        return path;
    }
    if (path.startsWith("http")) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=50&format=webp`;
};

function verifyHostname(request) {
    const host = request.headers.get("host") || "";
    return CONFIG.ALLOWED_DOMAINS.some(allowed => host.includes(allowed)) || host.endsWith(".netlify.app");
}

function buildErrorPage(statusCode, title, message) {
    return new Response(
        `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${statusCode} - ${escapeHTML(title)}</title>
    <style>
        body { background: #0b0f19; font-family: system-ui, -apple-system, sans-serif; color: white; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
        .box { max-width: 450px; padding: 40px 24px; border-radius: 20px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); }
        .code { font-size: 64px; font-weight: 800; color: #ec4899; margin-bottom: 12px; }
        .title { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
        .msg { color: #9ca3af; margin-bottom: 28px; font-size: 14px; line-height: 1.6; }
        .btn { display: inline-block; padding: 12px 36px; background: #ec4899; color: white; border-radius: 9999px; font-weight: 600; text-decoration: none; transition: opacity 0.2s; }
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="box">
        <div class="code">${statusCode}</div>
        <h1 class="title">${escapeHTML(title)}</h1>
        <p class="msg">${escapeHTML(message)}</p>
        <a href="/" class="btn">กลับสู่หน้าหลัก</a>
    </div>
</body>
</html>`,
        {
            status: statusCode,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=60"
            }
        }
    );
}

export default async (request, context) => {
    if (!verifyHostname(request)) {
        return new Response("403 Forbidden - Access Denied", { status: 403 });
    }

    const url = new URL(request.url);
    const dynamicDomain = `${url.protocol}//${url.host}`;

    const staticExtensions = [".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".json", ".webmanifest", ".map"];
    if (staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
        try { return await context.next(); } catch { return; }
    }

    const staticPages = ["/profiles.html", "/locations.html", "/privacy-policy.html", "/terms.html", "/search", "/admin"];
    if (staticPages.some(page => url.pathname.toLowerCase().startsWith(page))) {
        try { return await context.next(); } catch { return; }
    }

    if (url.pathname === "/robots.txt") {
        return new Response(
            `User-agent: *
Allow: /
Disallow: /search
Disallow: /admin
Disallow: /login

Sitemap: ${dynamicDomain}/sitemap.xml`,
            { headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
    }

    if (url.pathname === "/sitemap.xml") {
        try {
            const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const [provincesRes, profilesRes] = await Promise.all([
                supabase.from("provinces").select("key"),
                supabase.from("profiles").select("slug, lastUpdated").eq("active", true)
            ]);

            const provinces = provincesRes.data || [];
            const profiles = profilesRes.data || [];

            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
            xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
            xml += `  <url>\n    <loc>${dynamicDomain}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

            provinces.forEach(p => {
                if (p.key !== "chiangmai") {
                    xml += `  <url>\n    <loc>${dynamicDomain}/location/${p.key}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
                }
            });

            profiles.forEach(p => {
                const lastMod = p.lastUpdated ? new Date(p.lastUpdated).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
                xml += `  <url>\n    <loc>${dynamicDomain}/sideline/${encodeURIComponent(p.slug)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
            });

            xml += `</urlset>`;

            return new Response(xml, {
                headers: {
                    "Content-Type": "application/xml; charset=utf-8",
                    "Cache-Control": "public, max-age=3600, stale-while-revalidate=1800"
                }
            });
        } catch (e) {
            console.error("Sitemap generation error:", e);
            const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${dynamicDomain}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
            return new Response(fallbackXml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
        }
    }

    try {
        const pathParts = url.pathname.split("/").filter(Boolean);

        const rawProvinceKey = pathParts[pathParts.length - 1] || "chiangmai";
        let provinceKey = rawProvinceKey.toLowerCase();
        try {
            provinceKey = decodeURIComponent(rawProvinceKey).toLowerCase();
        } catch {
            provinceKey = rawProvinceKey.toLowerCase();
        }

        if (pathParts[0] === "location" && provinceKey === "chiangmai") {
            return Response.redirect(new URL("/", url.origin).toString(), 301);
        }

        if (url.searchParams.has("province")) {
            const provinceValue = url.searchParams.get("province")?.toLowerCase();
            if (provinceValue === "chiangmai") {
                return Response.redirect(new URL("/", url.origin).toString(), 301);
            }
            return Response.redirect(new URL(`/location/${provinceValue}`, url.origin).toString(), 301);
        }

        let supabase;
        try {
            supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        } catch (envError) {
            console.error("Environment Variable Error:", envError.message);
            return buildErrorPage(500, "Configuration Error", "Server configuration is incomplete. Please contact administrator.");
        }

        const normalizedSeoKey = (provinceKey || "default").replace(/-/g, "");
        const seoData = PROVINCE_SEO_DATA[normalizedSeoKey] || PROVINCE_SEO_DATA.default;

        const provinceRes = await supabase
            .from("provinces")
            .select("id, nameThai, key")
            .eq("key", provinceKey)
            .maybeSingle();

        const profilesRes = await supabase
            .from("profiles")
            .select("id, slug, name, age, imagePath, location, rate, isfeatured, lastUpdated, active, availability")
            .eq("provinceKey", provinceKey)
            .eq("active", true)
            .order("isfeatured", { ascending: false })
            .order("lastUpdated", { ascending: false })
            .limit(80);

        const allProvincesRes = await supabase
            .from("provinces")
            .select("key, nameThai")
            .order("nameThai", { ascending: true });

        const provinceData = provinceRes.data;
        const safeProfiles = profilesRes.data || [];
        const allProvinces = allProvincesRes.data || [];

        if (!provinceData) {
            return buildErrorPage(404, "404 Not Found", `ไม่พบข้อมูลจังหวัด ${provinceKey}`);
        }

        const provinceName = provinceData.nameThai || seoData.name || "พื้นที่ให้บริการ";
        const currentDate = new Date();
        const CURRENTMONTH = currentDate.toLocaleString("th-TH", { month: "short" });
        const CURRENTYEAR = currentDate.getFullYear();

        const provinceUrl = provinceKey === "chiangmai"
            ? dynamicDomain
            : `${dynamicDomain}/location/${provinceKey}`;

        const zoneText = Array.isArray(seoData.zones) ? seoData.zones.slice(0, 3).join(" / ") : "";
        const title = `${seoData.h1 || provinceName} | ${provinceName} อัปเดตล่าสุด ${CURRENTMONTH} ${CURRENTYEAR}`;
        const description = `${provinceName} ${zoneText} ${seoData.h2 || ""}`.replace(/\s+/g, " ").trim();
        const cleanDescription = stripHTML(description) || `${provinceName} พื้นที่ให้บริการและข้อมูลโปรไฟล์ล่าสุด`;
        const h1Text = seoData.h1 || `บริการเพื่อนเที่ยว ${provinceName}`;
        const h2Text = seoData.h2 || `รวมโปรไฟล์แนะนำใน ${provinceName}`;
        const introHtml = seoData.uniqueIntro || `<p class="mb-4">พื้นที่ ${provinceName} มีข้อมูลโปรไฟล์และโซนบริการพร้อมใช้งาน</p>`;
        const geoLat = seoData.geo?.lat || 13.7563;
        const geoLng = seoData.geo?.lng || 100.5018;
        const firstImage = safeProfiles.length > 0
            ? optimizeImg(dynamicDomain, safeProfiles[0].imagePath, 1200, 630)
            : `${dynamicDomain}/images/hero-sidelinechiangmai-1200.webp`;

        const deterministicRating = safeProfiles.length > 0 ? 4.8 : 4.5;
        const deterministicReviews = safeProfiles.length > 0 ? Math.max(10, safeProfiles.length * 8) : 50;

        const schemaGraph = [
            {
                "@type": "Organization",
                "@id": `${dynamicDomain}#organization`,
                name: CONFIG.BRAND_NAME,
                url: dynamicDomain,
                logo: { "@type": "ImageObject", url: `${dynamicDomain}/logo.png` },
                description: cleanDescription,
                sameAs: CONFIG.SOCIALS,
                contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    telephone: CONFIG.PHONE,
                    availableLanguage: ["th", "en"]
                }
            },
            {
                "@type": "WebSite",
                "@id": `${dynamicDomain}#website`,
                url: dynamicDomain,
                name: CONFIG.BRAND_NAME,
                publisher: { "@id": `${dynamicDomain}#organization` },
                potentialAction: {
                    "@type": "SearchAction",
                    target: `${dynamicDomain}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": ["LocalBusiness", "EntertainmentBusiness"],
                "@id": `${provinceUrl}#localbusiness`,
                name: `ไซด์ไลน์${provinceName} บริการรับงานและเด็กเอ็นเตอร์เทนระดับพรีเมียม`,
                image: firstImage,
                telephone: CONFIG.PHONE,
                url: provinceUrl,
                description: cleanDescription,
                address: {
                    "@type": "PostalAddress",
                    addressLocality: provinceName,
                    addressCountry: "TH"
                },
                geo: {
                    "@type": "GeoCoordinates",
                    latitude: geoLat,
                    longitude: geoLng
                },
                areaServed: [{ "@type": "AdministrativeArea", name: provinceName }],
                containsPlace: Array.isArray(seoData.zones)
                    ? seoData.zones.map(z => ({ "@type": "Place", name: `โซน${z}` }))
                    : [],
                aggregateRating: safeProfiles.length > 0 ? {
                    "@type": "AggregateRating",
                    ratingValue: deterministicRating,
                    reviewCount: String(deterministicReviews)
                } : undefined,
                priceRange: "฿฿฿"
            },
            {
                "@type": "CollectionPage",
                "@id": `${provinceUrl}#webpage`,
                url: provinceUrl,
                name: title,
                description: cleanDescription,
                isPartOf: { "@id": `${dynamicDomain}#website` },
                about: { "@id": `${provinceUrl}#localbusiness` },
                mainEntity: { "@id": `${provinceUrl}#itemlist` }
            },
            {
                "@type": "ItemList",
                "@id": `${provinceUrl}#itemlist`,
                name: `รายชื่อน้องๆ ไซด์ไลน์ ${provinceName}`,
                numberOfItems: safeProfiles.length,
                itemListElement: safeProfiles.map((p, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    item: {
                        "@type": "Person",
                        name: p.name || "ไม่ระบุชื่อ",
                        url: `${dynamicDomain}/sideline/${p.slug || p.id}`,
                        image: optimizeImg(dynamicDomain, p.imagePath, 300, 400),
                        description: `โปรไฟล์น้อง${p.name || ""} รับงานโซน ${p.location || provinceName}`
                    }
                }))
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${provinceUrl}#breadcrumb`,
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "หน้าแรก", item: dynamicDomain },
                    { "@type": "ListItem", position: 2, name: "รวมโปรไฟล์", item: `${dynamicDomain}/profiles.html` },
                    { "@type": "ListItem", position: 3, name: `ไซด์ไลน์${provinceName}`, item: provinceUrl }
                ]
            }
        ];

        if (Array.isArray(seoData.faqs) && seoData.faqs.length > 0) {
            schemaGraph.push({
                "@type": "FAQPage",
                "@id": `${provinceUrl}#faq`,
                mainEntity: seoData.faqs.map(faq => ({
                    "@type": "Question",
                    name: stripHTML(faq.q),
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: stripHTML(faq.a)
                    }
                }))
            });
        }

        const schemaData = { "@context": "https://schema.org", "@graph": schemaGraph };

        const cardsHTML = safeProfiles
            .map((p) => {
                const cleanName = escapeHTML((p.name || "ไม่ระบุชื่อ").replace(/^(น้อง\s?)/, ""));
                const profileLocation = escapeHTML(p.location || provinceName || "ไม่ระบุโซน");
                const profileLink = `/sideline/${encodeURIComponent(p.slug || p.id)}`;
                const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
                const statusClass = isAvailable ? "status-available-neon" : "status-busy-neon";
                const statusText = isAvailable ? "รับงาน" : "ไม่ว่าง/พัก";
                const displayRate = p.rate ? `${parseInt(p.rate).toLocaleString()} ฿` : "สอบถาม";

                return `
                <div class="profile-card relative group flex flex-col justify-between" data-id="${p.id}" data-slug="${p.slug || p.id}">
                    <div class="absolute top-3 left-3 z-20">
                        <span class="neon-badge ${statusClass}">
                            <span class="neon-dot"></span>
                            <span>${statusText}</span>
                        </span>
                    </div>

                    <div class="absolute top-3 right-3 z-20">
                        <button type="button" class="like-button-wrapper w-8 h-8 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10" aria-label="ถูกใจโปรไฟล์น้อง ${cleanName}">
                            <i class="fa-solid fa-heart text-sm"></i>
                        </button>
                    </div>

                    <a href="${profileLink}" class="card-fixed-ratio block" aria-label="ดูโปรไฟล์น้อง ${cleanName}">
                        <img src="${optimizeImg(dynamicDomain, p.imagePath, 300, 400)}"
                             alt="รูปโปรไฟล์น้อง ${cleanName} รับงาน ${provinceName}"
                             class="card-image"
                             width="300" height="400"
                             loading="lazy" decoding="async" />
                        <div class="gradient-overlay-fixed"></div>
                    </a>

                    <div class="mt-4 text-left">
                        <div class="flex items-center justify-between">
                            <h4 class="text-lg font-bold text-gray-900 dark:text-white truncate">น้อง${cleanName}</h4>
                            <span class="text-pink-600 dark:text-pink-400 font-extrabold text-base">${displayRate}</span>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            <i class="fas fa-map-marker-alt text-pink-500 mr-1"></i> ${profileLocation}
                        </p>
                    </div>
                </div>
                `;
            })
            .join("");

        const termsAndConditions = [
            { t: "การจองคิวน้องๆ ส่วนตัว", d: "เพื่อความเป็นส่วนตัวสูงสุดในการเรียกน้องๆ โซน" + escapeHTML(provinceName) + " สมาชิกจองได้ครั้งละ 1 คิว เพื่อรักษามาตรฐานการบริการ" },
            { t: "ความปลอดภัย 100% ไร้มัดจำ", d: "ชำระเงินหน้างานเมื่อเจอตัวน้องจริงเท่านั้น! หมดปัญหาการโดนหลอกโอนมัดจำ" },
            { t: "การตรวจสอบโปรไฟล์เข้มงวด", d: "รับประกันความตรงปก ไม่ตรงปกยกเลิกหน้างานได้ทันทีโดยไม่มีค่าใช้จ่ายใดๆ" },
            { t: "ข้อมูลลับระดับสูงสุด", d: "ข้อมูลการนัดหมายและการสนทนาจะถูกลบและเก็บเป็นความลับสุดยอด (Zero-Log Policy)" }
        ];


} catch (error) {
    console.error("SSR Fatal Error:", error);
    return buildErrorPage(500, "500 - SYSTEM ERROR", "เกิดข้อผิดพลาดในการสร้างหน้า");
};

const htmlTemplate = `<!DOCTYPE html>
<html lang="th" class="scroll-smooth antialiased dark">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#db2777">

  <title>${escapeHTML(title)}</title>
  <meta name="description" content="${escapeHTML(cleanDescription)}"/>
  <meta name="keywords" content="ไซด์ไลน์${escapeHTML(provinceName)}, รับงาน${escapeHTML(provinceName)}, เด็กเอ็น${escapeHTML(provinceName)}, ฟิวแฟน, ตรงปก, ไม่มีโอนมัดจำ">

  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" id="canonical-link" href="${provinceUrl}">

  <meta property="og:locale" content="th_TH">
  <meta property="og:site_name" content="Sideline Chiangmai">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHTML(title)}">
  <meta property="og:description" content="${escapeHTML(cleanDescription)}">
  <meta property="og:url" content="${provinceUrl}">
  <meta property="og:image" content="${firstImage}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ไซด์ไลน์${escapeHTML(provinceName)} รับงาน${escapeHTML(provinceName)} ฟิวแฟน | ไม่มัดจำ จ่ายหน้างาน">
  <meta name="twitter:description" content="${escapeHTML(cleanDescription)}">
  <meta name="twitter:image" content="${firstImage}">

  <link rel="shortcut icon" href="/images/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">

  <link rel="preconnect" href="https://hgzbgpbmymoiwjpaypvl.supabase.co" crossorigin>
  <link rel="dns-prefetch" href="https://hgzbgpbmymoiwjpaypvl.supabase.co">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>

  <link rel="preload" href="/fonts/prompt-v11-latin_thai-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/prompt-v11-latin_thai-regular.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="modulepreload" href="/main.js">

  <link rel="stylesheet" href="/styles.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            pink: {
              400: '#f472b6',
              500: '#ec4899',
              600: '#db2777',
            }
          }
        }
      }
    }
  </script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <link rel="preload" href="/images/hero-sidelinechiangmai-1200.webp" as="image" imagesrcset="/images/hero-sidelinechiangmai-1200.webp 1200w" imagesizes="1200px" fetchpriority="high">

  <script type="application/ld+json">${JSON.stringify(schemaData)}</script>

  <style>
    @keyframes shimmer { 0% { background-position: -100% 0; } 100% { background-position: 100% 0; } }
    .profile-image img { image-orientation: none; }
    .profile-card {
      background: linear-gradient(180deg, rgba(17,24,39,0.98), rgba(24,24,27,0.96));
      border-radius: 18px;
      padding: 14px;
      text-align: center;
      box-shadow: 0 12px 30px rgba(0,0,0,0.18);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .profile-card:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(0,0,0,0.24); }

    @media (max-width: 767px) {
      #profiles-container { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
      .profile-card { padding: 10px; border-radius: 14px; }
    }

    .like-button-wrapper .fa-heart {
      text-shadow: 0 1px 4px rgba(0,0,0,0.6);
      color: rgba(255,255,255,0.82);
      transition: all 0.2s ease-in-out;
    }
    .like-button-wrapper:hover .fa-heart { transform: scale(1.15); color: rgba(255,255,255,1); }
    .like-button-wrapper.liked .fa-heart { color: #ec4899; animation: heart-beat-animation 0.3s ease-in-out; }
    .like-button-wrapper.liked:hover .fa-heart { color: #f472b6; }

    @keyframes heart-beat-animation {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }

    .neon-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 9999px;
      font-family: 'Prompt', sans-serif;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.5px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.15);
      z-index: 20;
    }
    .neon-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: relative;
      z-index: 1;
    }
    .neon-dot::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
    }
    .status-available-neon .neon-dot { background-color: #00E676; box-shadow: 0 0 8px #00E676; }
    .status-busy-neon .neon-dot { background-color: #FF2E63; box-shadow: 0 0 8px #FF2E63; }

    .card-fixed-ratio {
      position: relative;
      width: 100%;
      padding-top: 133.33%;
      overflow: hidden;
      border-radius: 12px;
    }
    .card-fixed-ratio img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .gradient-overlay-fixed {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
      pointer-events: none;
    }

    .glass-panel {
      background: rgba(10, 10, 15, 0.45) !important;
      backdrop-filter: blur(24px) !important;
      -webkit-backdrop-filter: blur(24px) !important;
      border: 1px solid rgba(255,255,255,0.04) !important;
    }
  </style>
</head>

<body class="antialiased bg-white dark:bg-[#07070a] text-gray-900 dark:text-gray-100" data-page="home">
<header id="page-header" class="fixed top-0 left-0 w-full z-40 border-b border-transparent bg-white/80 dark:bg-[#07070a]/80 backdrop-blur-md">
  <div class="container mx-auto px-4 h-14 flex items-center justify-between">
    <div class="flex items-center">
      <a href="/" aria-label="ไปที่หน้าแรก Sideline Chiangmai" class="flex items-center">
        <img src="/images/logo-sidelinechiangmai.webp" alt="Sideline Chiangmai Official Logo" class="h-[26px] w-auto brightness-200 object-contain" width="220" height="26" loading="eager" />
      </a>
    </div>

    <div class="flex items-center justify-center flex-1">
      <div class="hidden sm:block absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-700 dark:text-gray-300">
        ข้อมูลอัปเดตระบบ: <span id="last-updated-time" class="font-semibold">${CURRENTMONTH} ${CURRENTYEAR}</span>
      </div>
    </div>

    <div class="flex items-center gap-1">
      <nav class="hidden lg:flex items-center gap-1 text-xs font-semibold mr-2" aria-label="เมนูหลัก">
        <a href="/profiles.html" class="px-3 py-2 text-gray-700 dark:text-gray-200 rounded-full hover:bg-pink-600/10 hover:text-pink-600 transition-colors">รวมโปรไฟล์แนะนำ</a>
        <a href="/locations.html" class="px-3 py-2 text-gray-700 dark:text-gray-200 rounded-full hover:bg-pink-600/10 hover:text-pink-600 transition-colors">พื้นที่ให้บริการ</a>
      </nav>

      <button class="theme-toggle-btn w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" type="button" aria-label="สลับโหมดหน้าจอ">
        <i class="fas fa-sun theme-toggle-icon text-sm"></i>
      </button>

      <button id="menu-toggle" class="lg:hidden w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" type="button" aria-label="เปิดเมนูนำทาง">
        <i class="fas fa-bars text-base"></i>
      </button>
    </div>
  </div>
</header>

<div id="sidebar-overlay" class="fixed inset-0 bg-[#07070A]/80 backdrop-blur-sm z-[2000] hidden opacity-0 transition-opacity duration-242" aria-hidden="true"></div>

<nav id="sidebar-menu" aria-label="เมนูมือถือ" class="fixed top-0 right-0 h-full w-[260px] bg-white dark:bg-[#07070A] border-l border-gray-200 dark:border-white/10 z-[2420] transform translate-x-full transition-transform duration-242 flex flex-col shadow-2xl">
  <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
    <span class="text-xs text-gray-700 dark:text-white/50 tracking-widest font-bold">เมนูนำทาง</span>
    <button id="close-menu-btn" aria-label="ปิดเมนู" class="text-gray-700 dark:text-white/50 hover:text-gray-900 dark:hover:text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors">
      <i class="fas fa-times text-base" aria-hidden="true"></i>
    </button>
  </div>

  <nav aria-label="เมนูนำทางหลักในแถบด้านข้าง" class="flex-grow overflow-y-auto p-4 space-y-4">
    <a href="/" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
      <i class="fas fa-home w-5 text-center text-gray-500 dark:text-gray-300" aria-hidden="true"></i>
      <span>หน้าแรก</span>
    </a>
    <a href="/profiles.html" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
      <i class="fas fa-users w-5 text-center text-gray-500 dark:text-gray-300" aria-hidden="true"></i>
      <span>น้องๆ ทั้งหมด</span>
    </a>
    <a href="/locations.html" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
      <i class="fas fa-map-marker-alt w-5 text-center text-gray-500 dark:text-gray-300" aria-hidden="true"></i>
      <span>พิกัดบริการ</span>
    </a>
    <a href="/about.html" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
      <i class="fas fa-info-circle w-5 text-center text-gray-500 dark:text-gray-300" aria-hidden="true"></i>
      <span>เกี่ยวกับเรา</span>
    </a>
    <a href="/faq.html" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
      <i class="fas fa-question-circle w-5 text-center text-gray-500 dark:text-gray-300" aria-hidden="true"></i>
      <span>คำถามพบบ่อย</span>
    </a>
    <a href="/blog.html" class="flex items-center gap-4 py-3 px-4 font-medium text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
      <i class="fas fa-newspaper w-5 text-center text-gray-500 dark:text-gray-300" aria-hidden="true"></i>
      <span>บทความ</span>
    </a>
  </nav>

  <div class="p-4 border-t border-gray-200 dark:border-white/10 shrink-0">
    <a href="https://line.me/ti/p/ksLUWB89Y_" target="_blank" rel="noopener nofollow" class="btn-line-shared flex items-center justify-center gap-2 w-full bg-[#058235] hover:bg-[#046f2d] text-white py-3 rounded-xl text-sm font-bold tracking-wider transition-colors shadow-lg">
      <i class="fab fa-line text-lg" aria-hidden="true"></i>
      <span>ติดต่อผ่าน LINE</span>
    </a>
  </div>
</nav>

<main class="pt-20 pb-12 bg-white dark:bg-[#07070a] text-gray-900 dark:text-gray-100">
  <div class="container mx-auto px-4 max-w-6xl space-y-12">
    <section class="relative overflow-hidden rounded-[28px] border border-gray-200/80 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-white/[0.03] dark:to-white/[0.015] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_28%)]"></div>
      <div class="relative px-5 py-10 md:px-10 md:py-14 text-center space-y-6">
        <div class="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/8 px-4 py-2 text-[11px] md:text-xs font-semibold tracking-[0.24em] uppercase text-pink-700 dark:text-pink-300">
          <span class="h-2 w-2 rounded-full bg-pink-500"></span>
          ${escapeHTML(provinceName)} Update
        </div>

        <div class="mx-auto max-w-4xl space-y-4">
          <h1 id="hero-h1" class="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.05] tracking-[-0.03em] text-gray-900 dark:text-white">
            ${escapeHTML(h1Text)}
          </h1>
          <p class="mx-auto max-w-2xl text-sm sm:text-base md:text-lg leading-7 text-gray-600 dark:text-gray-300">
            ${escapeHTML(h2Text)}
          </p>
        </div>

        <div class="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
          <div class="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] px-4 py-4 text-left backdrop-blur">
            <div class="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">พื้นที่บริการ</div>
            <div class="mt-1 text-sm font-bold text-gray-900 dark:text-white">${escapeHTML(provinceName)}</div>
          </div>
          <div class="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] px-4 py-4 text-left backdrop-blur">
            <div class="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">โซนแนะนำ</div>
            <div class="mt-1 text-sm font-bold text-gray-900 dark:text-white">${escapeHTML(zoneText || "พื้นที่ใกล้เคียง")}</div>
          </div>
          <div class="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] px-4 py-4 text-left backdrop-blur">
            <div class="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">อัปเดตล่าสุด</div>
            <div class="mt-1 text-sm font-bold text-gray-900 dark:text-white">${escapeHTML(CURRENTMONTH)} ${CURRENTYEAR}</div>
          </div>
        </div>

        <div class="mx-auto max-w-4xl overflow-hidden rounded-[24px] border border-gray-200 dark:border-white/10 bg-black/5 dark:bg-white/[0.03] shadow-lg">
          <img src="${firstImage}" alt="ภาพแนะนำพื้นที่ ${escapeHTML(provinceName)}" width="1200" height="630" class="h-auto w-full object-cover aspect-[16/9]" loading="eager" fetchpriority="high" />
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="rounded-[26px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <h2 class="text-xl md:text-2xl font-extrabold tracking-[-0.02em] text-gray-900 dark:text-white">
          ${escapeHTML(h2Text)}
        </h2>
        <div class="mt-5 space-y-4 text-sm md:text-base leading-7 text-gray-600 dark:text-gray-300">
          ${smartLinkify(introHtml, provinceKey, provinceZones)}
        </div>
      </div>

      <div class="rounded-[26px] border border-gray-200 dark:border-white/10 bg-gradient-to-b from-pink-50 to-white dark:from-white/[0.04] dark:to-white/[0.02] p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div class="flex items-center justify-between gap-4">
          <h3 class="text-base md:text-lg font-bold text-gray-900 dark:text-white">ข้อมูลพื้นที่</h3>
          <span class="rounded-full bg-pink-600 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-white">SEO READY</span>
        </div>

        <div class="mt-5 space-y-3">
          <div class="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-4">
            <div class="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">จังหวัด</div>
            <div class="mt-1 text-sm font-bold text-gray-900 dark:text-white">${escapeHTML(provinceName)}</div>
          </div>
          <div class="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-4">
            <div class="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">พิกัด</div>
            <div class="mt-1 text-sm font-bold text-gray-900 dark:text-white">${geoLat.toFixed(4)}, ${geoLng.toFixed(4)}</div>
          </div>
          <div class="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-4">
            <div class="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">LSI</div>
            <div class="mt-2 flex flex-wrap gap-2">
              ${(provinceLsi || []).slice(0, 8).map(item => `
                <span class="rounded-full border border-pink-500/20 bg-pink-500/8 px-3 py-1 text-xs font-medium text-pink-700 dark:text-pink-300">
                  ${escapeHTML(item)}
                </span>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-5">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h3 class="text-xl md:text-2xl font-extrabold tracking-[-0.02em] text-gray-900 dark:text-white">
            โปรไฟล์แนะนำในเขตพื้นที่ ${escapeHTML(provinceName)}
          </h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            ${safeProfiles.length} รายการ • เรียงแบบอ่านง่ายบนมือถือและเดสก์ท็อป
          </p>
        </div>
      </div>

      <div id="profiles-container" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        ${cardsHTML}
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-[26px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <h3 class="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white">
          ข้อมูลและภาพรวมบรรยากาศพื้นที่ ${escapeHTML(provinceName)}
        </h3>
        <div class="mt-4 space-y-4 text-sm md:text-base leading-7 text-gray-600 dark:text-gray-300">
          ${smartLinkify(introHtml, provinceKey, provinceZones)}
        </div>
      </div>

      <div class="rounded-[26px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <h3 class="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white">
          ขอบเขตทางภูมิศาสตร์และการดูแล
        </h3>
        <div class="mt-4 overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 aspect-[16/10] bg-gray-100 dark:bg-black/20">
          <iframe src="https://maps.google.com/maps?q=${encodeURIComponent(provinceName)}&t=&z=12&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" title="แผนที่พื้นที่ให้บริการ ${escapeHTML(provinceName)}"></iframe>
        </div>
      </div>
    </section>

    <section class="rounded-[26px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
      <h3 class="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white">
        แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัย
      </h3>
      <div class="mt-5 grid gap-4 md:grid-cols-2">
        ${termsAndConditions.map(item => `
          <div class="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] p-5">
            <div class="text-sm font-bold text-gray-900 dark:text-white">${escapeHTML(item.t)}</div>
            <div class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">${escapeHTML(item.d)}</div>
          </div>
        `).join("")}
      </div>
    </section>
  </div>
</main>

<footer class="bg-gray-50 dark:bg-[#040406] py-12 text-center border-t border-gray-200 dark:border-white/10">
  <div class="max-w-4xl mx-auto px-6 space-y-8">
    <h4 class="text-lg font-bold text-gray-900 dark:text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 uppercase tracking-widest">
      SIDELINE CHIANGMAI
    </h4>

    <a href="https://line.me/ti/p/ksLUWB89Y_" target="_blank" rel="noopener noreferrer" class="btn-line-shared inline-flex items-center justify-center gap-2 max-w-sm mx-auto bg-[#058235] hover:bg-[#046f2d] text-white px-5 py-3 rounded-xl font-semibold shadow-lg">
      <i class="fab fa-line text-lg"></i> แอดไลน์จองและปรึกษา แอดมินให้บริการ 24 ชม.
    </a>

    <div class="pt-4 border-t border-gray-200 dark:border-white/10">
      <div class="pt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] text-gray-600 dark:text-gray-300">
        <p>© ${CURRENTYEAR} SIDELINE CHIANGMAI. ALL RIGHTS RESERVED.</p>
        <div class="flex gap-4">
          <a href="/privacy-policy.html" class="hover:text-pink-700 dark:hover:text-pink-400 transition-colors">นโยบายส่วนบุคคล</a>
          <a href="/terms.html" class="hover:text-pink-700 dark:hover:text-pink-400 transition-colors">เงื่อนไขการใช้งาน</a>
        </div>
      </div>
    </div>
  </div>
</footer>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebarMenu = document.getElementById('sidebar-menu');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const closeMenuBtn = document.getElementById('close-menu-btn');

  function openMenu() {
    sidebarOverlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      sidebarOverlay.classList.remove('opacity-0');
      sidebarMenu.classList.remove('translate-x-full');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sidebarOverlay.classList.add('opacity-0');
    sidebarMenu.classList.add('translate-x-full');
    document.body.style.overflow = '';
    setTimeout(() => sidebarOverlay.classList.add('hidden'), 242);
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMenu);

  const themeBtn = document.querySelector('.theme-toggle-btn');
  const icon = document.querySelector('.theme-toggle-icon');
  if (themeBtn && icon) {
    themeBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      icon.classList.toggle('fa-sun', !isDark);
      icon.classList.toggle('fa-moon', isDark);
    });
  }
});
</script>

<script type="module" src="/main.js"></script>
</body>
</html>`;

return new Response(htmlTemplate, {
  headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=0, s-maxage=10, stale-while-revalidate=604800, must-revalidate",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  }
});