import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const CONFIG = {
  get SUPABASE_URL() {
    try {
      return Deno.env.get("SUPABASE_URL") || "https://zxetzqwjaiumqhrpumln.supabase.co"
    } catch {
      return "https://zxetzqwjaiumqhrpumln.supabase.co"
    }
  },
  get SUPABASE_KEY() {
    try {
      return Deno.env.get("SUPABASE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"
    } catch {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4"
    }
  },
  get MAPS_SHARE_URL() {
    return "https://share.google/THArcPBibRkBAiSOd"
  },
  BRAND_NAME: "First Model Hub",
  SOCIAL_LINKS: {
    line: "https://line.me/ti/p/ksLUWB89Y_",
    tiktok: "https://tiktok.com/@firstmodelhub",
    twitter: "https://twitter.com/firstmodelhub",
    linkedin: "https://www.linkedin.com/in/cuteti-sexythailand-398567280?trk=contact-info",
    biosite: "https://bio.site/firstfiwfans.com",
    linktree: "https://linktr.ee/firstmodelhub",
    bluesky: "https://bsky.app/profile/firstmodelhub.bsky.social"
  }
};

const PROVINCE_CUSTOM_METADATA = {
  bangkok: {
    title: "สาวรับงานกรุงเทพ ไซด์ไลน์ กทม เพื่อนเที่ยวฟิวแฟนตรงปก 2026 | จ่ายหน้างาน ไม่มัดจำ",
    desc: "รวมพิกัดสาวรับงานกรุงเทพ ไซด์ไลน์ กทม และเพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟน การันตีตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มีเก็บมัดจำล่วงหน้า ครอบคลุมพิกัดสุขุมวิท รัชดา ลาดพร้าว"
  },
  chonburi: {
    title: "สาวรับงานชลบุรี ไซด์ไลน์พัทยา บางแสน เพื่อนเที่ยวฟิวแฟน 2026 | จ่ายหน้างาน ไม่มัดจำ",
    desc: "สารบัญสาวรับงานชลบุรี เพื่อนเที่ยวพัทยา และน้องๆ ไซด์ไลน์บางแสน พรีเมียมดูแลใส่ใจสไตล์ฟิวแฟน ปลอดภัยสูงสุดชำระค่าบริการหน้างานเมื่อเจอตัวจริง ปราศจากการโอนจองล่วงหน้า"
  }
};

const PROVINCE_SEO_DATA = {
  bangkok: {
    name: "กรุงเทพ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "สาทร", "สีลม", "ทองหล่อ", "เอกมัย", "ปิ่นเกล้า", "บางนา", "เลียบด่วน"],
    faqs: [
      { q: "น้องๆ สาวรับงานกรุงเทพ ส่วนใหญ่สะดวกสแตนด์บายแถวไหนบ้าง?", a: "ย่านที่มีน้องๆ ประจำการอยู่หนาแน่นที่สุดคือ รัชดา-ห้วยขวาง และสุขุมวิท-ทองหล่อ ซึ่งเป็นย่านคอนโดมิเนียมหรูและเดินทางด้วยรถไฟฟ้า BTS และ MRT" },
      { q: "เรียกเด็กเอ็น หรือ สาวไซด์ไลน์ กทม. ต้องโอนมัดจำล่วงหน้าก่อนไหม?", a: "ไม่มีนโยบายการเก็บเงินมัดจำล่วงหน้าทุกกรณีครับ เพื่อความปลอดภัยของลูกค้ากทม. จะเป็นการจ่ายเงินสดหรือโอนชำระหน้างานหลังเจอตัวน้องตรงปกแล้วเท่านั้น" }
    ]
  },
  lampang: {
    name: "ลำปาง",
    geo: { lat: 18.2913, lng: 99.4922 },
    zones: ["ตัวเมืองลำปาง", "สวนดอก", "พระบาท", "ม.ราชภัฏลำปาง", "เกาะคา", "แม่ทะ", "น้ำล้อม"],
    faqs: [
      { q: "ค้นหาไซด์ไลน์ลำปาง นัดหมายโซนใดปลอดภัยที่สุด?", a: "พื้นที่ตัวเมืองลำปาง โซนสวนดอก และย่านพระบาท เป็นจุดที่มีโรงแรมและคอนโดคุณภาพดี รองรับการนัดเจออย่างสงบและปลอดภัยสูงสุด" },
      { q: "มีการรับประกันความตรงปกของน้องๆ ลำปางอย่างไร?", a: "เราคัดกรองโปรไฟล์และข้อมูลสัดส่วนจริง ถ้านัดเจอน้องที่หน้างานลำปางแล้วพบว่าไม่ตรงตามที่ตกลง ลูกค้าสามารถปฏิเสธและยกเลิกคิวได้ทันทีโดยไม่มีค่าใช้จ่าย" }
    ]
  },
  chiangrai: {
    name: "เชียงราย",
    geo: { lat: 19.9071, lng: 99.8325 },
    zones: ["ตัวเมืองเชียงราย", "บ้านดู่", "ม.แม่ฟ้าหลวง", "ม.ราชภัฏเชียงราย", "หอนาฬิกา", "ริมกก"],
    faqs: [
      { q: "ต้องการนัดพบน้องนักศึกษาเชียงราย โซน มฟล. หรือบ้านดู่ มีขั้นตอนอย่างไร?", a: "โซน ม.แม่ฟ้าหลวง และบ้านดู่ มีน้องๆ สแตนด์บายเยอะมากครับ สามารถแจ้งคิวและเวลาที่ต้องการกับแอดมิน เพื่อนัดพบตามห้องพัก คอนโด หรือโรงแรมใกล้เคียงได้ทันที" },
      { q: "มีความเสี่ยงที่จะโดนโกงมัดจำสำหรับการเรียกไซด์ไลน์เชียงรายไหม?", a: "เว็บไซต์ของเราใช้ระบบนัดเจอตัวจริงก่อนชำระเงินหน้างาน 100% จึงไม่มีความเสี่ยงเรื่องการโดนหลอกโอนเงินมัดจำล่วงหน้าแน่นอนครับ" }
    ]
  },
  khonkaen: {
    name: "ขอนแก่น",
    geo: { lat: 16.4322, lng: 102.8236 },
    zones: ["มข.", "กังสดาล", "หลังมอ", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
    faqs: [
      { q: "น้องๆ ไซด์ไลน์ขอนแก่น ส่วนใหญ่เป็นใครและน่าเชื่อถือไหม?", a: "มีทั้งกลุ่มน้องนักศึกษาระดับมหาวิทยาลัยพาร์ทไทม์ และนางแบบอิสระในขอนแก่น ทุกคนผ่านการตรวจสอบข้อมูลโปรไฟล์และตรงปกแน่นอน" },
      { q: "นัดหมายน้องๆ ขอนแก่น แถว มข. มีความปลอดภัยแค่ไหน?", a: "โซน มข. และกังสดาล เป็นแหล่งชุมชนเมืองที่มีความปลอดภัยสูง มีที่พักและคอนโดมิเนียมจำนวนมาก รองรับการนัดเจอที่สะดวกรวดเร็วและรักษาความลับสูงสุด" }
    ]
  },
  chonburi: {
    name: "ชลบุรี",
    geo: { lat: 13.3611, lng: 100.9847 },
    zones: ["พัทยา", "บางแสน", "ศรีราชา", "อมตะนคร", "ตัวเมืองชลบุรี", "ม.บูรพา"],
    faqs: [
      { q: "หาสาวไซด์ไลน์พัทยา-บางแสน รูปตรงปกและไม่โดนหลอกมัดจำได้อย่างไร?", a: "เราเน้นย้ำมาตรฐานความตรงปกและใช้ระบบจ่ายเงินหน้างานเมื่อเจอตัวน้องเท่านั้น ป้องกันปัญหาการหลอกโอนเงินจองคิวก่อนได้แน่นอนครับ" },
      { q: "น้องๆ รับงานพูลวิลล่า ค้างคืน หรือเดินทางไปกับทริปท่องเที่ยวบางแสนไหม?", a: "มีครับ เรามีกลุ่มน้องๆ สายปาร์ตี้เอนเตอร์เทนส่วนตัวที่ชำนาญงานพูลวิลล่าและพร้อมร่วมทริปริมทะเลบางแสน-พัทยาเพื่อดูแลคุณอย่างใกล้ชิด" }
    ]
  },
  phitsanulok: {
    name: "พิษณุโลก",
    geo: { lat: 16.8219, lng: 100.2659 },
    zones: ["ตัวเมืองพิษณุโลก", "ม.นเรศวร", "ริมน้ำน่าน", "เซ็นทรัลพิษณุโลก"],
    faqs: [
      { q: "หาไซด์ไลน์พิษณุโลก แถว มน. นัดหมายยากไหมและสะดวกเวลาใด?", a: "โซน ม.นเรศวร (มน.) มีน้องๆ นักศึกษาพาร์ทไทม์พร้อมบริการหนาแน่นที่สุด สามารถจองและนัดพบตามโรงแรมหรือหอพักใกล้เคียงได้อย่างสะดวกรวดเร็วเกือบตลอดทั้งวัน" },
      { q: "ต้องทำการโอนเงินมัดจำล่วงหน้าก่อนเรียกน้องพิษณุโลกไหม?", a: "ไม่ต้องโอนเงินก่อนใดๆ ทั้งสิ้นครับ ลูกค้าจะจ่ายเงินค่าขนมหลังจากเจอน้องตรงปกหน้างานแถบพิษณุโลกแล้วเท่านั้น เพื่อป้องกันความเสี่ยงอย่างสมบูรณ์แบบ" }
    ]
  },
  chiangmai: {
    name: "เชียงใหม่",
    geo: { lat: 18.8140717, lng: 98.972096 },
    zones: ["นิมมาน", "เจ็ดยอด", "สันติธรรม", "ช้างเผือก"],
    faqs: [
      { q: "จองคิวเพื่อนเที่ยวหรือน้องไซด์ไลน์ในตัวเมืองเชียงใหม่ โซนไหนสะดวกและเป็นส่วนตัวที่สุด?", a: "พื้นที่ถนนนิมมานเหมินท์, สันติธรรม ช้างเผือก และรอบหอพักหรือคอนโดมิเนียมย่านเจ็ดยอด เป็นพิกัดที่ผู้ดูแลส่วนใหญ่พำนักอยู่จริง สมาชิกจึงสามารถส่งขอนัดหมาย ลิสต์ร้านอาหาร หรือชวนน้องๆ นัดเจอเพื่อเริ่มต้นเดินทางร่วมกันได้อย่างรวดเร็วและเป็นส่วนตัวสูง" },
      { q: "ระบบรับประกันความปลอดภัยและการชำระค่าบริการมีความโปร่งใสอย่างไร?", a: "ทางแพลตฟอร์มใช้นโยบาย “เจอตัวจริงค่อยชำระเงินโดยตรงหน้างาน” ซึ่งเป็นมาตรการป้องกันความเสียหายทางการเงินและคุ้มครองผู้ใช้งานจากการแอบอ้างโดยมิจฉาชีพได้ 100% พร้อมทั้งมีนโยบายเก็บรักษาข้อมูลความประสงค์ส่วนตัวนัดหมายของท่านไว้ภายใต้โครงสร้างที่เป็นความลับสูงสุด" },
      { q: "กระบวนการยืนยันประวัติ (Live Verified) ป้องกันการนำรูปคนอื่นมาสวมรอยอย่างไร?", a: "ผู้ลงประกาศโปรไฟล์และผู้ให้บริการเอนเตอร์เทนทุกคน จะต้องส่งวิดีโอยืนยันตนแบบเรียลไทม์ พร้อมแสดงหลักฐานสัดส่วนพิกัดรับงานตรงต่อแอดมิน เพื่อตรวจสอบความสอดคล้องของรูปโปรไฟล์อย่างรอบคอบ เพื่อความสบายใจสูงสุดของลูกค้าสมาชิกทุกท่าน" }
    ]
  },
  default: {
    name: "จังหวัดอื่นๆ",
    geo: { lat: 13.7563, lng: 100.5018 },
    zones: ["ตัวเมือง", "พื้นที่ใกล้เคียง"],
    faqs: [
      { q: "เรียกใช้บริการน้องๆ เพื่อนเที่ยว ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ เพื่อความปลอดภัยสูงสุดของคุณและป้องกันมิจฉาชีพ ลูกค้าจ่ายเงินค่าขนมหน้างานเมื่อเจอตัวน้องแล้วเท่านั้น" },
      { q: "หากพบตัวจริงของน้องแล้วพบว่าไม่ตรงตามรูปภาพโปรไฟล์ ต้องทำอย่างไร?", a: "โปรไฟล์รูปภาพทุกรูปผ่านการคัดกรองและยืนยันตัวตนแล้วว่าตรงปก หากพบตัวจริงแล้วไม่ตรงปก ลูกค้ามีสิทธิ์ปฏิเสธการร่วมงานและยกเลิกงานได้ทันทีโดยไม่มีค่าปรับหรือค่าใช้จ่ายใดๆ" }
    ]
  }
};

Object.keys(PROVINCE_SEO_DATA).forEach(key => {
  if (key !== "default") {
    PROVINCE_SEO_DATA[key] = { ...PROVINCE_SEO_DATA.default, ...PROVINCE_SEO_DATA[key] };
  }
});

const getDynamicIntro = (provinceName, zones) => {
  let processedZones = zones ? [...zones] : [];
  
  if (provinceName === "เชียงใหม่" && processedZones.includes("นิมมาน")) {
    processedZones = processedZones.map(zone => 
      zone === "นิมมาน" 
        ? `<a href="/nimman" class="text-[#C084FC] hover:underline font-bold transition-colors">นิมมาน</a>`
        : zone
    );
  }

  const zoneSnippet = processedZones && processedZones.length > 0 
    ? ` ครอบคลุมพิกัดสำคัญ เช่น โซน${processedZones.slice(0, 4).join(", โซน")}` 
    : " ครอบคลุมเขตตัวเมืองและบริเวณใกล้เคียง";

  return `
    <p>ยินดีต้อนรับสู่แพลตฟอร์มศูนย์กลางข้อมูลแนะนำ <strong>สาวรับงาน${provinceName}</strong> และ <strong>เพื่อนเที่ยวไซด์ไลน์${provinceName}</strong> แหล่งรวบรวมโปรไฟล์ผู้ดูแลระดับพรีเมียมที่เน้นความโปร่งใส ปลอดภัย และเพียบพร้อมด้วยการดูแลเอาใจใส่สไตล์ฟิวแฟน (Girlfriend Experience - GFE) อย่างสุภาพเรียบร้อยเป็นธรรมชาติ ปราศจากเงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี</p>
    <p>เพื่อตอบสนองความสะดวกในการนัดหมายพิกัดบริการในพื้นที่ ${provinceName} น้อง ๆ ในระบบของเรากระจายตัวอยู่ในจุดที่เหมาะสม${zoneSnippet} ไม่ว่าจะเป็นโรงแรมชั้นนำ คอนโดมิเนียมส่วนตัว หรือพิกัดยอดนิยม เดินทางสะดวกสบายและมีความปลอดภัยสูง พร้อมร่วมเดินทางท่องเที่ยว ทานอาหาร หรือพูดคุยเพื่อสร้างความผ่อนคลายและคลายเหงาให้แก่คุณในโอกาสพิเศษ</p>
    <p>รูปภาพและข้อมูลรายละเอียดสัดส่วน of น้อง ๆ ได้รับการคัดกรองและตรวจสอบยืนยันตัวตน (Verified System) อย่างรอบคอบ เพื่อให้สมาชิกมั่นใจได้ว่าข้อมูลถูกต้อง ตรงตามปก และได้รับประสบการณ์การใช้บริการที่ปลอดภัยและมีความสุขที่สุดในค่ำคืนนี้</p>
  `;
};

const getDynamicReviews = provinceName => {
  const t = new Date();
  const isChiangMai = provinceName === "เชียงใหม่";

  return [
    {
      author: "คุณชลสิทธิ์ (C.)",
      location: isChiangMai ? "ย่านนิมมาน เชียงใหม่" : `ตัวเมือง${provinceName}`,
      text: isChiangMai 
        ? `"นัดเจอน้องแถวย่านนิมมาน เชียงใหม่ เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับสำหรับคนที่หาเพื่อนเที่ยวฟิวแฟนดีๆ แถวนิมมาน"`
        : `"นัดเจอน้องในจังหวัด${provinceName} เรียบร้อยตรงเวลาดีมากครับ คุยสนุก อัธยาศัยดี สุภาพเรียบร้อย ที่สำคัญระบบไม่เก็บเงินมัดจำล่วงหน้าทำให้มั่นใจในความปลอดภัย แนะนำเลยครับสำหรับคนที่หาเพื่อนเที่ยวฟิวแฟนดีๆ"`,
      date: "เมื่อสัปดาห์ที่แล้ว",
      datePublished: new Date(t.getTime() - 691200000).toISOString().split("T")[0]
    },
    {
      author: "คุณอภิชาติ (A.)",
      location: isChiangMai ? "โซนยอดนิยม นิมมาน เชียงใหม่" : `โซนยอดนิยมใน${provinceName}`,
      text: isChiangMai
        ? '"น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยมเสมือนมีเพื่อนร่วมทางคนพิเศษคอยเคียงข้าง นัดเจอแถวนิมมานตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ"'
        : '"น้องน่ารักมาก มารยาทการเทคแคร์ดีเยี่ยมเสมือนมีเพื่อนร่วมทางคนพิเศษคอยเคียงข้าง ตัวจริงตรงตามรูปไม่มีแอบอ้างมัดจำเลย สบายใจและประทับใจมากครับ"',
      date: "เมื่อ 2 สัปดาห์ก่อน",
      datePublished: new Date(t.getTime() - 1296000000).toISOString().split("T")[0]
    }
  ];
};

const getFullUrl = (hostUrl, path) => {
  if (!path) return `${hostUrl}/images/default.webp`;
  if (path.startsWith("http")) return path;
  return `${hostUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const optimizeImg = (hostUrl, path, width = 320, height = 420) => {
  if (!path) return getFullUrl(hostUrl, "/images/default.webp");
  
  if (path.includes("res.cloudinary.com")) {
    if (path.includes("/upload/")) {
      return path.replace("/upload/", `/upload/f_avif,q_auto:good,w_${width},h_${height},c_fill,g_face/`);
    }
    return path;
  }
  
  if (path.startsWith("http")) return path;
  
  return `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover&quality=75&format=avif`;
};

const escapeHTML = str => str ? String(str).replace(/[&<>'"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[m] || m)) : "";

const formatDateSSR = dateStr => {
  if (!dateStr) return "เมื่อครู่นี้";
  try {
    const t = new Date(dateStr),
      months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
      date = t.getDate(),
      month = months[t.getMonth()];
    return `${date} ${month} ${(t.getFullYear() + 543).toString().slice(-2)}`;
  } catch {
    return "เมื่อครู่นี้";
  }
};

const stripHTML = str => str ? str.replace(/<[^>]*>?/gm, "") : "";

const smartLinkify = (text, flag, zones) => {
  if (!text) return "";
  let res = text;
  if (zones && zones.length > 0) {
    zones.slice(0, 3).forEach(zone => {
      const regex = new RegExp(`(${zone})(?![^<>]*>)`, "g");
      res = res.replace(regex, `<a href="/search?q=${encodeURIComponent(zone)}" class="text-[#C084FC] hover:underline font-bold transition-colors">$1</a>`);
    });
  }
  ["เด็กเอ็น", "ไซด์ไลน์", "พรีเมียม", "ฟีลแฟน", "รับงาน", "ฟิวแฟน", "สาวรับงาน"].forEach(keyword => {
    const regex = new RegExp(`(${keyword})(?![^<>]*>)`, "g");
    res = res.replace(regex, '<span class="highlight text-[#C084FC] font-extrabold">$1</span>');
  });
  return res;
};

const replaceGlobal = (source, target, replacement) => source.split(target).join(replacement);

const FLOATING_DOCK_HTML = `
<style>
.floating-app-dock {
  display: none;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 480px;
  height: 64px;
  background: rgba(13, 8, 30, 0.85);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(147, 51, 234, 0.35);
  border-radius: 100px;
  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  justify-content: space-around;
  align-items: center;
  padding: 0 16px;
}
.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #94A3B8;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  gap: 4px;
  transition: all 0.2s;
}
.dock-item i {
  font-size: 18px;
}
.dock-item.active, .dock-item:hover {
  color: #C084FC !important;
}
.dock-item-line {
  background: #05963E;
  color: white !important;
  padding: 8px 16px;
  border-radius: 100px;
  flex-direction: row !important;
  gap: 6px !important;
  font-size: 13px !important;
}
@media (max-width: 768px) {
  .floating-app-dock {
    display: flex;
  }
  main {
    padding-bottom: 100px !important;
  }
}
</style>
<nav class="floating-app-dock" aria-label="แถบควบคุมลอยตัวสำหรับมือถือ">
  <a href="/" class="dock-item active">
    <i class="fas fa-home"></i>
    <span>หน้าแรก</span>
  </a>
  <a href="#search-section" class="dock-item">
    <i class="fas fa-search"></i>
    <span>ตัวกรอง</span>
  </a>
  <a href="/profiles" class="dock-item">
    <i class="fas fa-user-friends"></i>
    <span>รวมน้องๆ</span>
  </a>
  <a href="https://line.me/ti/p/ksLUWB89Y_" target="_blank" rel="noopener nofollow" class="dock-item dock-item-line">
    <i class="fab fa-line"></i>
    <span>จองคิว</span>
  </a>
</nav>
`;

function verifyHostname(req) {
  const host = req.headers.get("host") || "";
  return ["firstmodelhub.com", "sidelinechiangmai.netlify.app", "localhost"].some(h => host.includes(h)) || host.endsWith(".netlify.app");
}

function buildErrorPage(code, title, message) {
  return new Response(`<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${code} - ${escapeHTML(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
        body { background: #000000; color: #fff; font-family: 'Prompt', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin:0; padding: 16px; overflow:hidden;}
        .card { max-width: 400px; width:100%; border: 1px solid rgba(255,255,255,0.08); background: rgba(14,9,30,0.6); padding: 40px; border-radius: 24px; text-align:center; backdrop-filter: blur(20px); }
        .code { font-size: 72px; font-weight:800; color: #5A2CBE; margin-bottom: 24px; }
        .back-btn { display: inline-block; background-color: #ffffff; color: #000000; padding: 14px 28px; border-radius: 100px; text-decoration:none; font-weight: 700; margin-top: 24px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="code">${code}</div>
        <h1 style="font-size:20px; font-weight:800; margin-bottom:12px;">${escapeHTML(title)}</h1>
        <p style="font-size:14px; color:#A1A1AA; line-height:1.6;">${escapeHTML(message)}</p>
        <a href="/" class="back-btn">กลับหน้าหลัก</a>
    </div>
</body>
</html>`, { status: code, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=60" } });
}

function customMetaTitle(province, customMeta) {
  return customMeta && customMeta.title ? customMeta.title : `ไซด์ไลน์${province} เพื่อนเที่ยวตรงปก 2026 | สาวรับงาน${province} ไม่มัดจำ`;
}

function customMetaDesc(province, seo, customMeta) {
  if (customMeta && customMeta.desc) return customMeta.desc;
  return `รวมไซด์ไลน์${province} สาวรับงาน${province} เพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟนตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มีโอนมัดจำล่วงหน้า${seo.zones && seo.zones.length > 0 ? ` ครอบคลุมพิกัด ${seo.zones.slice(0, 4).join(", ")}` : ""}`;
}

const generatePersonSchema = (profile, province, targetUrl, hostUrl) => {
  const priceVal = (profile.rate || "0").toString().replace(/\D/g, "");
  const cleanName = (profile.name || "").replace(/^น้อง/, "").trim();
  return {
    "@type": "Person",
    "@id": `${targetUrl}/#person`,
    "name": `น้อง${cleanName}`,
    "url": targetUrl,
    "image": optimizeImg(hostUrl, profile.imagePath, 1200, 630),
    "description": profile.description || `โปรไฟล์แนะนำน้อง${cleanName} สาวรับงานพิกัด ${profile.location || province} สไตล์เพื่อนเที่ยวดูแลดี ฟิวแฟน ตรงปก 100% ไม่มีมัดจำ`,
    "jobTitle": "Freelance Companion & Entertainer",
    "gender": "Female",
    "knowsAbout": ["Companion Services", "Tour Guide Services", "Entertainment Services"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": profile.location || province,
      "addressRegion": province,
      "addressCountry": "TH"
    },
    "offers": {
      "@type": "Offer",
      "url": targetUrl,
      "price": priceVal,
      "priceCurrency": "THB",
      "priceValidUntil": "2027-12-31",
      "availability": !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (profile.availability || "").toLowerCase().includes(kw))
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      "description": "นัดเจอตัวจ่ายค่าบริการโดยตรงหน้างาน ไม่มีโอนเงินมัดจำล่วงหน้าเพื่อความปลอดภัยสูงสุด"
    }
  };
};

const generateDynamicFAQsHTML = faqs => {
  if (!faqs) return "";
  return faqs.map(item => `
        <div class="interactive-card" style="padding: 20px;">
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <h3 style="font-weight: 800; font-size: 14px; display: flex; align-items: start; gap: 10px;">
                  <span style="display: flex; height: 24px; width: 24px; align-items: center; justify-content: center; border-radius: 8px; background-color: rgba(90, 44, 190, 0.1); color: var(--primary-purple); font-size: 12px; font-weight: 900; border: 1px solid rgba(90, 44, 190, 0.2); shrink: 0;">Q</span>
                  <span class="text-gradient-sub">${escapeHTML(item.q)}</span>
                </h3>
                <div style="padding-left: 34px; color: var(--text-gray); font-size: 12px; line-height: 1.6; border-left: 2px solid rgba(90, 44, 190, 0.2); padding-top: 8px;">
                  ${escapeHTML(item.a)}
                </div>
            </div>
        </div>
    `).join("");
};

export default async (req, context) => {
  if (!verifyHostname(req)) return new Response("403 Forbidden - Access Denied", { status: 403 });

  const url = new URL(req.url),
    hostUrl = `${url.protocol}//${url.host}`;

  if (url.pathname === "/index.html") {
    if (req.headers.get("x-ssr-bypass") === "true") {
      try {
        return await context.next();
      } catch {
        return new Response("Bypass fetch failed", { status: 500 });
      }
    }
    return Response.redirect(new URL("/", url.origin).toString(), 301);
  }

  if (req.headers.get("x-ssr-bypass") === "true") {
    try {
      return await context.next();
    } catch {
      return new Response("Bypass fetch failed", { status: 500 });
    }
  }

  if ([".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".json", ".webmanifest", ".map", ".woff", ".woff2"].some(ext => url.pathname.toLowerCase().endsWith(ext))) {
    try {
      return await context.next();
    } catch {
      return;
    }
  }

  const paths = url.pathname.split("/").filter(Boolean);
  let s = "chiangmai", o = "";

  if (paths.length > 0) {
    if ("location" === paths[0] && paths[1]) {
      try {
        s = decodeURIComponent(paths[1]).toLowerCase();
      } catch {
        s = paths[1].toLowerCase();
      }
    } else if ("sideline" === paths[0] && paths[1]) {
      o = decodeURIComponent(paths[1]);
    } else {
      const lastSegment = paths[paths.length - 1] || "chiangmai";
      try {
        s = decodeURIComponent(lastSegment).toLowerCase();
      } catch {
        s = lastSegment.toLowerCase();
      }
    }
  }

  if ("location" === paths[0] && "chiangmai" === s || "chiang_mai" === s) {
    return Response.redirect(new URL("/", url.origin).toString(), 301);
  }

  if ("/robots.txt" === url.pathname) {
    return new Response(`User-agent: *\nAllow: /\nDisallow: /search\nDisallow: /admin\n\nSitemap: ${hostUrl}/sitemap.xml`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  if ("/sitemap.xml" === url.pathname) {
    try {
      const e = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY),
        [provRes, profRes] = await Promise.all([
          e.from("provinces").select("key"),
          e.from("profiles").select("slug, lastUpdated, name, imagePath").eq("active", true)
        ]),
        provList = provRes.data || [],
        profList = profRes.data || [];

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
      xml += `  <url>\n    <loc>${hostUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

      provList.forEach(p => {
        if ("chiangmai" !== p.key && "chiang_mai" !== p.key) {
          xml += `  <url>\n    <loc>${hostUrl}/location/${p.key}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        }
      });

      profList.forEach(p => {
        const lastMod = p.lastUpdated ? new Date(p.lastUpdated).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          profileLoc = `${hostUrl}/sideline/${encodeURIComponent(p.slug)}`;
        let imgXml = "";
        if (p.imagePath) {
          imgXml = `\n    <image:image>\n      <image:loc>${optimizeImg(hostUrl, p.imagePath, 1200, 630).replace(/&/g, "&amp;")}</image:loc>\n      <image:title>${escapeHTML(p.name || "Profile Image")}</image:title>\n    </image:image>`;
        }
        xml += `  <url>\n    <loc>${profileLoc}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>${imgXml}\n  </url>\n`;
      });

      xml += "</urlset>";
      return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, stale-while-revalidate=1800" } });
    } catch (e) {
      console.error("Sitemap generation error:", e);
      return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${hostUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
    }
  }

  try {
    let e = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY),
      matchedProfile = null;

    if (o) {
      const { data: profileData } = await e.from("profiles").select("provinceKey, name, rate, location, age, imagePath, description, availability").eq("slug", o).eq("active", true).maybeSingle();
      if (profileData) {
        matchedProfile = profileData;
        s = profileData.provinceKey || "chiangmai";
      } else {
        s = "chiangmai";
      }
    } else if ("/" === url.pathname) {
      s = "chiangmai";
    }

    const provinceParam = s.replace(/-/g, ""),
      [provSingleRes, profListRes, provListRes] = await Promise.all([
        e.from("provinces").select("id, nameThai, key").eq("key", s).maybeSingle(),
        e.from("profiles").select("id, slug, name, age, imagePath, galleryPaths, provinceKey, location, rate, isfeatured, lastUpdated, active, availability, description, height, weight, stats, skin_tone, bust, waist, hips, cup_size, has_video, verified, line_id, quote, style_tags").eq("provinceKey", s).eq("active", true).order("isfeatured", { ascending: false }).order("lastUpdated", { ascending: false }).limit(80),
        e.from("provinces").select("key, nameThai").order("nameThai", { ascending: true })
      ]),
      provinceData = provSingleRes.data;

    if (!provinceData) return buildErrorPage(404, "404 - ไม่พบหน้าเว็บ", "ไม่พบพิกัดจังหวัดที่คุณต้องการหาในขณะนี้");

    const profileList = profListRes.data || [],
      provinceThaiName = provinceData.nameThai,
      customMeta = PROVINCE_CUSTOM_METADATA[provinceParam] || null,
      seoData = PROVINCE_SEO_DATA[provinceParam] || PROVINCE_SEO_DATA.default,
      canonUrl = "chiangmai" === s ? hostUrl : `${hostUrl}/location/${s}`,
      mainImgPath = matchedProfile?.imagePath || (profileList.length > 0 ? profileList[0].imagePath : null),
      metaImgUrl = mainImgPath ? optimizeImg(hostUrl, mainImgPath, 1200, 630) : `${hostUrl}/images/hero-sidelinechiangmai-1200.webp`;

    let dbReviews = [];
    try {
      const { data: reviewsData } = await e.from("reviews")
        .select("id, created_at, author_name, location_detail, rating_score, review_body, province_key")
        .eq("province_key", s)
        .eq("active_status", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (reviewsData && reviewsData.length > 0) {
        dbReviews = reviewsData;
      }
    } catch (err) {
      console.warn("Reviews table check failed, standard offline fallbacks applied.", err);
    }

    let finalReviews = [];
    if (dbReviews.length > 0) {
      finalReviews = dbReviews.map(r => ({
        author: r.author_name || "คุณผู้ใช้บริการ",
        location: r.location_detail || `ตัวเมือง${provinceThaiName}`,
        text: r.review_body || "ดูแลประทับใจดีสไตล์ฟิวแฟน ตรงปกปลอดภัย แนะนำครับ",
        rating: Number(r.rating_score) || 5,
        date: formatDateSSR(r.created_at),
        datePublished: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
      }));
    } else {
      const dynamicList = getDynamicReviews(provinceThaiName);
      finalReviews = dynamicList.map(r => ({
        author: r.author,
        location: r.location,
        text: r.text,
        rating: 5,
        date: r.date,
        datePublished: r.datePublished
      }));
    }

    let pageTitle = customMetaTitle(provinceThaiName, customMeta),
      pageDesc = customMetaDesc(provinceThaiName, seoData, customMeta);

    if (matchedProfile) {
      const cleanProfileName = (matchedProfile.name || "").replace(/^น้อง/, "").trim();
      pageTitle = `น้อง${cleanProfileName}${matchedProfile.age ? ` (${matchedProfile.age} ปี)` : ""} ไซด์ไลน์${provinceThaiName} เพื่อนเที่ยวตรงปก | จ่ายหน้างาน ไม่มัดจำ`;
      pageDesc = `รายละเอียดโปรไฟล์น้อง${cleanProfileName} สาวรับงานไซด์ไลน์พิกัดย่าน ${matchedProfile.location || provinceThaiName} ตรงปก 100% ค่าขนม ${matchedProfile.rate || "สอบถาม"} ดูแลสไตล์ฟิวแฟน ไม่มีโอนมัดจำล่วงหน้า`;
    }

    const strippedDesc = stripHTML(pageDesc),
      finalRatingValue = finalReviews.length > 0 
        ? (finalReviews.reduce((sum, rev) => sum + rev.rating, 0) / finalReviews.length).toFixed(1) 
        : (profileList.length > 0 ? (4.6 + profileList.length % 4 / 10).toFixed(1) : "4.8"),
      finalReviewCount = finalReviews.length > 0 ? finalReviews.length : (profileList.length > 0 ? 30 + 3 * profileList.length : 18);
      
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent("สาวรับงาน " + provinceThaiName)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    const schemaGraph = [
      {
        "@type": "Organization",
        "@id": `${hostUrl}/#organization`,
        "name": CONFIG.BRAND_NAME,
        "url": hostUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${hostUrl}/images/logo-sidelinechiangmai.webp`
        },
        "description": strippedDesc,
        "sameAs": Object.values(CONFIG.SOCIAL_LINKS),
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "telephone": "LINE: @firstmodelhub",
          "availableLanguage": ["th", "en"]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${hostUrl}/#website`,
        "url": hostUrl,
        "name": CONFIG.BRAND_NAME,
        "publisher": { "@id": `${hostUrl}/#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${hostUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ];

    if (o && matchedProfile) {
      const profileUrl = `${hostUrl}/sideline/${encodeURIComponent(o)}`;
      schemaGraph.push(generatePersonSchema(matchedProfile, provinceThaiName, profileUrl, hostUrl));
      schemaGraph.push({
        "@type": "BreadcrumbList",
        "@id": `${profileUrl}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": hostUrl },
          { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceThaiName}`, "item": "chiangmai" === s ? hostUrl : `${hostUrl}/location/${s}` },
          { "@type": "ListItem", "position": 3, "name": `น้อง${(matchedProfile.name || "").replace(/^น้อง/, "").trim()}`, "item": profileUrl }
        ]
      });
    } else {
      schemaGraph.push({
        "@type": ["LocalBusiness", "EntertainmentBusiness"],
        "@id": `${canonUrl}/#localbusiness`,
        "name": `สาวรับงาน${provinceThaiName} ไลน์${provinceThaiName} สารบัญเพื่อนเที่ยวระดับพรีเมียม`,
        "image": metaImgUrl,
        "telephone": "LINE: @firstmodelhub",
        "priceRange": "฿฿",
        "url": canonUrl,
        "description": strippedDesc,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": seoData.zones.slice(0, 4).join(", "),
          "addressLocality": provinceThaiName,
          "addressRegion": provinceThaiName,
          "addressCountry": "TH"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": seoData.geo ? seoData.geo.lat : 13.7563,
          "longitude": seoData.geo ? seoData.geo.lng : 100.5018
        },
        "hasMap": mapEmbedUrl,
        "areaServed": [
          { "@type": "AdministrativeArea", "name": provinceThaiName },
          ...seoData.zones.map(z => ({ "@type": "AdministrativeArea", "name": "โซน" + z }))
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": Number(finalRatingValue),
          "reviewCount": Number(finalReviewCount),
          "bestRating": 5,
          "worstRating": 1
        },
        "review": finalReviews.map(r => ({
          "@type": "Review",
          "author": { "@type": "Person", "name": r.author },
          "datePublished": r.datePublished,
          "reviewBody": stripHTML(r.text),
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": Number(r.rating),
            "bestRating": 5,
            "worstRating": 1
          }
        }))
      });

      schemaGraph.push({
        "@type": "CollectionPage",
        "@id": `${canonUrl}/#webpage`,
        "name": pageTitle,
        "description": strippedDesc,
        "isPartOf": { "@id": `${hostUrl}/#website` },
        "about": { "@id": `${canonUrl}/#localbusiness` },
        "mainEntity": { "@id": `${canonUrl}/#itemlist` }
      });

      schemaGraph.push({
        "@type": "ItemList",
        "@id": `${canonUrl}/#itemlist`,
        "name": `รายชื่อสาวรับงานและเพื่อนเที่ยว${provinceThaiName}`,
        "numberOfItems": profileList.length,
        "itemListElement": profileList.map((p, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Person",
            "name": p.name || "ผู้ให้บริการ",
            "url": `${hostUrl}/sideline/${p.slug || p.id}`,
            "image": optimizeImg(hostUrl, p.imagePath, 360, 480),
            "description": `โปรไฟล์แนะนำน้อง${p.name || ""} สาวรับงานพิกัด ${p.location || provinceThaiName} ตรงปก 100% ปลอดภัยไม่มีมัดจำ`
          }
        }))
      });

      schemaGraph.push({
        "@type": "BreadcrumbList",
        "@id": `${canonUrl}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": hostUrl },
          { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceThaiName}`, "item": canonUrl }
        ]
      });
    }

    if (seoData.faqs && !o) {
      schemaGraph.push({
        "@type": "FAQPage",
        "@id": `${canonUrl}/#faq`,
        "mainEntity": seoData.faqs.map(faq => ({
          "@type": "Question",
          "name": stripHTML(faq.q),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": stripHTML(faq.a)
          }
        }))
      });
    }

    const schemaJson = { "@context": "https://schema.org", "@graph": schemaGraph };

    const cardsHtml = profileList.map(p => {
      const pName = escapeHTML((p.name || "ไม่ระบุชื่อ").trim().replace(/^(น้อง\s?)+/gi, "")),
        pLoc = escapeHTML(p.location || provinceThaiName),
        pUrl = `/sideline/${encodeURIComponent(p.slug || p.id)}`,
        isAvail = !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw)),
        badgeClass = isAvail ? "status-available-neon" : "status-busy-neon",
        statusText = isAvail ? "รับงาน" : "ไม่ว่าง/พัก",
        pAge = p.age || "",
        ageDisplay = pAge && "-" !== pAge ? ` (${escapeHTML(pAge)})` : "";

      let pStats = "-";
      if (p.bust && p.waist && p.hips) {
        const cup = p.cup_size ? p.cup_size.toUpperCase() : "";
        pStats = `${p.bust}${cup}-${p.waist}-${p.hips}`;
      } else if (p.stats) {
        pStats = p.stats;
      }

      const pSkin = p.skin_tone || p.skinTone || "-",
        isVer = p.verified === true,
        hasVid = p.has_video === true;

      return `
                <div class="province-card profile-card-new interactive-card" \n                     data-id="${p.id}"
                     data-profile-id="${p.id}"
                     data-profile-slug="${p.slug}"
                     data-name="น้อง${pName}"
                     data-region="${pLoc}"
                     data-desc=""
                     style="aspect-ratio: 3/4; width: 100%; position: relative; border-radius: 24px; overflow: hidden; padding:0; cursor: pointer;"
                     role="listitem">
                    
                    <a href="${pUrl}" class="card-link absolute-fill z-20" aria-label="ดูโปรไฟล์น้อง${pName}"></a>

                    <img src="${optimizeImg(hostUrl, p.imagePath, 300, 400)}" 
                         alt="น้อง${pName} สาวรับงาน${provinceThaiName} ไซด์ไลน์${provinceThaiName} ฟิวแฟน" 
                         width="300"
                         height="400"
                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; position: absolute; inset: 0; z-index: 0;"
                         loading="lazy" decoding="async" />

                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%, transparent 100%); z-index: 10; pointer-events: none;"></div>

                    <div style="position: absolute; top: 12px; left: 12px; z-index: 30; display: flex; flex-direction: column; gap: 6px; align-items: flex-start;">
                        <span class="neon-badge ${badgeClass}">
                            <span class="neon-dot"></span>
                            <span>${statusText}</span>
                        </span>
                        ${p.isfeatured ? `
                        <span style="background-color: #5A2CBE; border: 1px solid rgba(147, 51, 234, 0.4); color: white; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 100px; box-shadow: 0 4px 10px rgba(90, 44, 190, 0.3); display: flex; align-items: center; gap: 4px;"><i class="fas fa-star" style="font-size: 8px;"></i>แนะนำ</span>
                        ` : ""}
                        ${hasVid ? `
                        <span style="background-color: #FF2E63; border: 1px solid rgba(255, 46, 99, 0.4); color: white; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 100px; display: flex; align-items: center; gap: 4px;"><i class="fas fa-video" style="font-size: 8px;"></i>วิดีโอ</span>
                        ` : ""}
                        ${isVer ? `
                        <span style="background-color: #FBBF24; border: 1px solid rgba(251, 191, 36, 0.4); color: #000000; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 100px; display: flex; align-items: center; gap: 4px;"><i class="fas fa-check-circle" style="font-size: 8px;"></i>ยืนยันแล้ว</span>
                        ` : ""}
                    </div>

                    <div style="position: absolute; top: 12px; right: 12px; z-index: 30;">
                        <button type="button" class="circle-btn-el" data-action="like" data-id="${p.id}" style="width: 32px; height: 32px; border-radius: 50%;" aria-label="เพิ่มลงในรายการโปรด">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>

                    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; align-items: center; gap: 6px; width: 100%;">
                            <h3 style="font-size: 16px; font-weight: 800; color: white; margin: 0; text-shadow: 0 1.5px 3px rgba(0,0,0,0.8); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">น้อง${pName}${ageDisplay}</h3>
                        </div>

                        <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #D4D4D8; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.8); flex-wrap: wrap;">
                            <span style="font-family: monospace; letter-spacing: 0.05em; background-color: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 4px; color: #FFFFFF;">${escapeHTML(pStats)}</span>
                            <span style="background-color: rgba(147, 51, 234, 0.2); color: #C084FC; padding: 1px 6px; border-radius: 4px; font-size: 9px;">หญิง</span>
                            ${"-" !== pSkin ? `<span style="color: #A1A1AA; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75px;">${escapeHTML(pSkin)}</span>` : ""}
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-gray); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px;">
                            <span style="text-shadow: 0 1px 2px rgba(0,0,0,0.8); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0;">
                                <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 4px;"></i> ${pLoc}
                            </span>
                            <span style="color: #C084FC; font-weight: 900; font-size: 13px; text-shadow: 0 1.5px 3px rgba(0,0,0,0.9); flex-shrink: 0; white-space: nowrap;">
                                ${p.rate || "สอบถาม"}
                            </span>
                        </div>
                    </div>
                </div>
                `;
    }).join("");

    const introTemplate = seoData.uniqueIntro || getDynamicIntro(provinceThaiName, seoData.zones);

    const reviewsHtml = finalReviews.map(r => `
            <div class="interactive-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="height: 40px; width: 40px; border-radius: 50%; background-color: #27272A; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-weight: 700; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);">${escapeHTML((r.author || "K").charAt(0).toUpperCase())}</div>
                    <div>
                      <span style="display: block; font-size: 12px; font-weight: 800; color: white;">${escapeHTML(r.author)}</span>
                      <span style="display: block; font-size: 10px; color: var(--text-muted); font-weight: 700;">นัดเจอใน${escapeHTML(r.location)}</span>
                    </div>
                  </div>
                  <div class="stars" style="display: flex; gap: 2px; color: #FBBF24; font-size: 10px;" aria-label="${r.rating} ดาว" role="img">
                    ${Array.from({ length: 5 }).map((_, i) => `<i class="fas fa-star" style="color: ${i < r.rating ? "#FBBF24" : "#71717A"};" aria-hidden="true"></i>`).join("")}
                  </div>
                </div>
                <p style="font-size: 12px; color: var(--text-gray); line-height: 1.6;">
                  ${escapeHTML(r.text)}
                </p>
                <span style="display: block; font-size: 9px; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">ยืนยันการใช้บริการจริง • ${escapeHTML(r.date)}</span>
            </div>
        `).join("");

    const faqsHtml = generateDynamicFAQsHTML(seoData.faqs),
      matchedZones = seoData.zones.slice(0, 4).join(", ");

    const templateUrl = new URL("/index.html", url.origin);
    const mainTemplate = await fetch(templateUrl, {
      headers: { "x-ssr-bypass": "true" }
    });
    let rawHtml = await mainTemplate.text();

    const seoIntroContent = smartLinkify(introTemplate, 0, seoData.zones);

    const popularLocationsHtml = provListRes.data ? provListRes.data.map(p => {
      const key = p.key || p.slug || p.id;
      const name = p.nameThai || p.name;
      if (key === "chiangmai") {
        return `<li><a href="/" title="ดูรายชื่อไซด์ไลน์ในจังหวัด เชียงใหม่" style="color: var(--primary-purple); text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='#C084FC'" onmouseleave="this.style.color='var(--text-gray)'" class="active" aria-current="page">ไซด์ไลน์เชียงใหม่</a></li>`;
      }
      return `<li><a href="/location/${key}" title="ดูรายชื่อไซด์ไลน์ในจังหวัด ${name}" style="color: var(--text-gray); text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='#C084FC'" onmouseleave="this.style.color='var(--text-gray)'">ไซด์ไลน์${name}</a></li>`;
    }).join("") : "";

    rawHtml = replaceGlobal(rawHtml, "{{SEO_TITLE}}", pageTitle);
    rawHtml = replaceGlobal(rawHtml, "{{SEO_DESCRIPTION}}", strippedDesc);
    rawHtml = replaceGlobal(rawHtml, "{{SEO_CANONICAL}}", canonUrl);
    rawHtml = replaceGlobal(rawHtml, "{{SEO_IMAGE}}", metaImgUrl);
    rawHtml = replaceGlobal(rawHtml, "{{SCHEMA_JSON}}", JSON.stringify(schemaJson));
    rawHtml = replaceGlobal(rawHtml, "{{PROFILES_CARDS_HTML}}", cardsHtml);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_NAME}}", provinceThaiName);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_ZONES}}", matchedZones);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_SEO_CONTENT}}", seoIntroContent);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_REVIEWS_HTML}}", reviewsHtml);
    rawHtml = replaceGlobal(rawHtml, "{{PROVINCE_FAQS_HTML}}", faqsHtml);
    rawHtml = replaceGlobal(rawHtml, "<!-- รายชื่อจังหวัดสวมรอยอัตโนมัติประจำระบบ Edge -->", popularLocationsHtml);
    rawHtml = replaceGlobal(rawHtml, "{{MAP_EMBED_URL}}", mapEmbedUrl);

    rawHtml = replaceGlobal(rawHtml, "{{PROFILES_JSON}}", JSON.stringify(profileList.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      age: p.age,
      height: p.height || "",
      weight: p.weight || "",
      stats: p.stats || "",
      skinTone: p.skin_tone || p.skinTone || "",
      skin_tone: p.skin_tone || p.skinTone || "",
      bust: p.bust || "",
      waist: p.waist || "",
      hips: p.hips || "",
      cup_size: p.cup_size || "",
      imagePath: p.imagePath,
      galleryPaths: p.galleryPaths || p.gallery_paths || [],
      provinceKey: p.provinceKey,
      provinceThai: provinceThaiName,
      location: p.location,
      rate: p.rate,
      availability: p.availability,
      lastUpdated: p.lastUpdated,
      isfeatured: p.isfeatured,
      verified: p.verified || p.isVerified,
      hasVideo: p.has_video || p.hasVideo || false,
      has_video: p.has_video || p.hasVideo || false,
      description: p.description || "",
      lineId: p.line_id || p.lineId || "",
      line_id: p.line_id || p.lineId || "",
      quote: p.quote || "",
      styleTags: p.style_tags || p.styleTags || [],
      style_tags: p.style_tags || p.styleTags || []
    }))));

    rawHtml = replaceGlobal(rawHtml, "</body>", `${FLOATING_DOCK_HTML}\n</body>`);

    return new Response(rawHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=900"
      }
    });

  } catch (err) {
    console.error("Critical rendering error:", err);
    return buildErrorPage(500, "500 - ข้อผิดพลาดภายในระบบ", "ระบบประมวลผลหลังบ้านเกิดขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้งในภายหลัง");
  }
};