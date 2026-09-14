function parseRateToNumber(rate) {
  if (!rate) return 1500;
  const str = String(rate).trim().toLowerCase();
  if (str.includes("k")) {
    const floatVal = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(floatVal) ? 1500 : Math.round(floatVal * 1000);
  }
  const cleanDigits = str.replace(/\D/g, "");
  const num = parseInt(cleanDigits, 10);
  if (isNaN(num) || num <= 0) return 1500;
  if (num < 10) return num * 1000;  // กรณีพิมพ์ 1 หรือ 2 ให้เป็น 1,000 หรือ 2,000
  if (num < 500) return num * 10;   // ✅ กรณีพิมพ์ 150 ให้เป็น 1,500 (ตรงกับ render-bot.js)
  return num;
}
window.parseRateToNumber = parseRateToNumber;


// 🟢 โหลด Supabase แบบ Dynamic Singleton
let supabaseClient = null;
let supabasePromise = null;

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (supabasePromise) return supabasePromise;

  supabasePromise = (async () => {
    try {
      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.42.0");
      supabaseClient = createClient(
        "https://zxetzqwjaiumqhrpumln.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      );
      window.supabase = supabaseClient;
      return supabaseClient;
    } catch (e) {
      console.warn("Supabase dynamic import fallback:", e);
      return null;
    }
  })();

  return supabasePromise;
}

(function () {
  "use strict";

  const CACHE_STORAGE_KEY = "cachedProfiles_v3_2026";
  const DEFAULT_FALLBACK_IMG = "https://firstmodelhub.com/images/firstmodelhub.webp";

  const isEN = document.documentElement.lang === "en" || window.location.pathname.includes("-en");
  const PROVINCE_EN_MAP = {
    chiangmai: "Chiang Mai",
    chiangrai: "Chiang Rai",
    lampang: "Lampang",
    lamphun: "Lamphun",
    phitsanulok: "Phitsanulok",
    bangkok: "Bangkok",
    chonburi: "Chonburi",
    "khon-kaen": "Khon Kaen",
    khonkaen: "Khon Kaen",
    phuket: "Phuket",
    udonthani: "Udon Thani",
    "phra-nakhon-si-ayutthaya": "Ayutthaya",
    ayutthaya: "Ayutthaya",
    "surat-thani": "Surat Thani",
    suratthani: "Surat Thani",
    "ubon-ratchathani": "Ubon Ratchathani",
    ubon: "Ubon Ratchathani",
    national: "Nationwide (Thailand)"
  };

  const SEO_PROVINCES_DATA = {
    chiangmai: {
      zones: ["ทั้งหมด", "นิมมาน", "สันติธรรม", "เจ็ดยอด", "หลัง มช.", "ช้างเผือก", "สันทราย", "ห้วยแก้ว", "รวมโชค"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">ศูนย์รวมสาวรับงานเชียงใหม่ อันดับ 1 ตรงปก ไม่มัดจำ</h3>
          <p style="margin-bottom: 8px;">หากคุณกำลังมองหา <strong>ไซด์ไลน์เชียงใหม่</strong>, <strong>เพื่อนเที่ยวกลางคืน</strong> หรือ <strong>เด็กเอ็นเชียงใหม่ (EN VIP)</strong> ที่การันตีความปลอดภัยสูงสุด เราคือแพลตฟอร์มที่คัดสรรน้องๆ สาวสวยระดับพรีเมียม สไตล์ฟิวแฟน (Girlfriend Experience) แท้ๆ ดูแลเอาใจใส่ ไม่เร่งเวลา ให้ความรู้สึกอบอุ่นเหมือนแฟนตัวจริง</p>
          <p style="margin-bottom: 8px;">หมดปัญหาโดนหลอกโอนมัดจำ เพราะระบบของเรายึดหลัก <strong>"เจอน้องตัวจริงตรงปกก่อน ค่อยชำระเงินหน้างาน 100%"</strong></p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดยอดฮิต สแตนด์บายพร้อมดูแล</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>โซนนิมมานเหมินท์:</strong> แหล่งรวมร้านชิลและโรงแรมหรู น้องๆ พร้อมเดินทางไปหาภายใน 15-30 นาที</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>โซนเจ็ดยอด - สันติธรรม:</strong> พิกัดฮิตสำหรับน้องๆ นักศึกษา วัยใส ตัวเล็ก สเปคยอดนิยม</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>ตัวเมือง - หลัง มช.:</strong> บริการเพื่อนเที่ยว หาคนกินข้าว คลายเหงาในวันหยุดพักผ่อน</span></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">บริการครอบคลุม (ชั่วคราว / ค้างคืน)</h3>
          <p>ให้บริการตอบโจทย์ทุกไลฟ์สไตล์ ทั้งนัดพบส่วนตัวแบบชั่วคราว (Short Time) หรือต้องการคนดูแลยาวๆ แบบค้างคืน (Long Time / Overnight) เรทเริ่มต้นเพียง 1,500 บาท ข้อมูลสัดส่วนและราคาแสดงชัดเจนบนหน้าโปรไฟล์</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "นัดหมายสาวรับงานเชียงใหม่ โซนไหนเดินทางสะดวกที่สุด?", a: "ย่านนิมมานเหมินท์, สันติธรรม, ช้างเผือก และเจ็ดยอด เป็นพิกัดหลักที่มีน้องๆ สแตนด์บายเยอะที่สุด เดินทางไปหาที่โรงแรมได้รวดเร็วภายใน 20-30 นาทีครับ" },
        { q: "เรทราคาเริ่มต้น 1,500 บาท ได้รับบริการแบบไหนบ้าง?", a: "เริ่มต้น 1,500.- บาท คุณจะได้รับการดูแลเทคแคร์สไตล์ฟิวแฟน (GFE) อย่างสุภาพเรียบร้อย เป็นกันเอง ให้เกียรติลูกค้า และไม่เร่งเวลาครับ" },
        { q: "มีน้องๆ รับงานค้างคืน (Overnight) ไหม?", a: "มีครับ น้องๆ ไซด์ไลน์หลายคนรับงานแบบค้างคืน (Long Time) สามารถเช็คเรทราคาเหมาคืนได้ที่กล่องอัตราค่าบริการในหน้าโปรไฟล์" },
        { q: "หากต้องการเด็กเอ็น (EN) ไปนั่งดื่มชงเหล้า มีบริการไหม?", a: "มีบริการเด็กเอ็นเตอร์เทน (EN VIP) สำหรับชงเหล้า คุยสนุก นั่งเป็นเพื่อนที่ร้านอาหารหรือร้านเหล้าในเชียงใหม่ครับ" },
        { q: "เรียกใช้บริการ ต้องโอนมัดจำล่วงหน้าหรือไม่?", a: "ไม่มีการเก็บเงินโอนมัดจำล่วงหน้าทุกกรณีครับ ระบบเราคือ 'นัดพบเจอตัวจริง ตรวจสอบความตรงปก แล้วจึงชำระเงินโดยตรงกับน้องหน้างาน'" }
      ]
    },

    chiangrai: {
      zones: ["ทั้งหมด", "ตัวเมืองเชียงราย", "บ้านดู่", "มฟล.", "หอนาฬิกา", "แม่สาย", "รอบเวียง"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">สาวรับงานเชียงราย ไซด์ไลน์ตรงปก ไม่โอนมัดจำ</h3>
          <p style="margin-bottom: 8px;">หากคุณพักอยู่เชียงรายและต้องการหา <strong>เพื่อนเที่ยวเชียงราย</strong> หรือ <strong>เด็กเอ็นเชียงราย</strong> เราคัดสรรน้องๆ วัยใส นักศึกษา และสาวสวยสไตล์ฟิวแฟน ที่พร้อมดูแลคุณถึงที่พัก ไม่ว่าจะเป็นโรงแรมหรือรีสอร์ทส่วนตัว</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดบริการยอดนิยมในเชียงราย</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>โซนหน้า มฟล. และ บ้านดู่:</strong> แหล่งรวมน้องๆ นักศึกษา น่ารัก เฟรนด์ลี่ บริการสไตล์ฟิวแฟนแท้ๆ</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>ตัวเมืองเชียงราย (หอนาฬิกา - รอบเวียง):</strong> สะดวกสบาย น้องเดินทางไว เหมาะสำหรับการพักผ่อนแบบชั่วคราวและค้างคืน</span></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">นัดง่าย ปลอดภัย จ่ายหน้างาน</h3>
          <p>เรารับประกันความปลอดภัยของลูกค้าเป็นอันดับหนึ่ง นัดเจอน้องๆ ชำระเงินหน้างาน (Pay on Arrival) ไร้ความเสี่ยงจากการโดนหลอกมัดจำ พร้อมบริการทั้งเพื่อนเที่ยวกลางคืน งานเอนเตอร์เทน และดูแลส่วนตัว</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "สาวรับงานเชียงราย โซนบ้านดู่ และ มฟล. นัดหมายสะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำอยู่ในโซนบ้านดู่ หน้ามหาวิทยาลัยแม่ฟ้าหลวง และใจกลางเมืองเชียงราย พร้อมเดินทางไปดูแลที่พักของท่านรวดเร็ว" },
        { q: "ไซด์ไลน์เชียงราย การันตีตรงปกและปลอดภัยอย่างไร?", a: "โปรไฟล์ของน้องๆ ทุกคนผ่านการยืนยันตัวตน 100% ปลอดภัยด้วยระบบนัดเจอตัวจริงหน้างานเรียบร้อยแล้วค่อยชำระค่าบริการ" },
        { q: "มีบริการรับงานแบบค้างคืน (Long Time) ในเชียงรายหรือไม่?", a: "มีครับ น้องๆ หลายท่านรับงานแบบค้างคืน ดูแลยาวๆ จนถึงเช้า สามารถตกลงเรทราคาที่หน้าโปรไฟล์ได้เลย" },
        { q: "ต้องการเด็กเอ็นไปร้านเหล้าแถวหอนาฬิกา มีไหม?", a: "มีครับ เรามีน้องๆ สายปาร์ตี้ EN VIP ที่สามารถไปชงเหล้า เอ็นเตอร์เทนที่ร้านอาหารหรือผับในตัวเมืองได้ครับ" }
      ]
    },

    lampang: {
      zones: ["ทั้งหมด", "ตัวเมืองลำปาง", "สวนดอก", "รอบเวียง", "ม.ราชภัฏลำปาง", "สบตุ๋ย", "เซ็นทรัลลำปาง"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">ไซด์ไลน์ลำปาง สาวรับงานลำปาง ตัวท็อป ฟิวแฟน</h3>
          <p style="margin-bottom: 8px;">พบกับ <strong>สาวรับงานลำปาง</strong> โปรไฟล์คุณภาพที่ผ่านการคัดกรองมาแล้ว ไม่ว่าคุณจะต้องการ <strong>เพื่อนเที่ยวลำปาง</strong>, เด็กเอ็น (EN) สำหรับงานปาร์ตี้ หรือฟิวแฟนส่วนตัว เรามีน้องๆ พร้อมสแตนด์บายให้บริการอย่างมืออาชีพ</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดบริการในลำปาง</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>ตัวเมือง - สวนดอก - สบตุ๋ย:</strong> ศูนย์กลางที่น้องๆ สามารถเรียกใช้บริการได้ตลอด 24 ชม.</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>โซน ม.ราชภัฏลำปาง:</strong> น้องนักศึกษา วัยใส เอาใจเก่ง พร้อมดูแลสไตล์ฟิวแฟนแบบใกล้ชิด</span></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">ความเป็นส่วนตัวสูงสุด ไม่ต้องมัดจำ</h3>
          <p>หมดความกังวลเรื่องข้อมูลหลุด นัดเจอที่พักส่วนตัว จ่ายเงินสดหรือโอนหน้างานเท่านั้น รับประกันตรงปก 100%</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "นัดพบสาวรับงานลำปาง ในตัวเมืองหรือแถวไหนสะดวกที่สุด?", a: "พิกัดยอดนิยมคือโรงแรมชั้นนำในตัวเมืองลำปาง, ย่านสวนดอก, ถนนรอบเวียง และละแวก ม.ราชภัฏลำปาง เดินทางสะดวกและเป็นส่วนตัวครับ" },
        { q: "การนัดหมายไซด์ไลน์ลำปาง ต้องมีเงินมัดจำล่วงหน้าไหม?", a: "ไม่มีการโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ เจอน้องตัวจริง ยืนยันความตรงปกหน้างานแล้วค่อยชำระค่าบริการ" },
        { q: "มีน้องเด็กเอ็น (EN) ไปนั่งทานข้าวเป็นเพื่อนไหม?", a: "มีครับ บริการเพื่อนเที่ยว ทานข้าว ดูหนัง (GFE) เป็นบริการหลักของเรา น้องๆ สุภาพและวางตัวดีมากครับ" }
      ]
    },

    lamphun: {
      zones: ["ทั้งหมด", "ตัวเมืองลำพูน", "นิคมลำพูน", "เวียงยอง", "ป่าซาง", "เหมืองง่า", "บ้านกลาง"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">ไซด์ไลน์ลำพูน สาวรับงานลำพูน บริการด่วน ไม่มัดจำ</h3>
          <p style="margin-bottom: 8px;">คลายความเหนื่อยล้าจากการทำงานด้วยบริการ <strong>สาวรับงานลำพูน</strong> และ <strong>เพื่อนเที่ยวลำพูน</strong> ที่ดูแลคุณแบบเหนือระดับ เรามีน้องๆ ครอบคลุมทั้งโซนนิคมอุตสาหกรรมและตัวเมือง</p>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">ความลับลูกค้าคือหัวใจสำคัญ</h3>
          <p>เราเน้นความปลอดภัยและรักษาความลับลูกค้าเป็นที่หนึ่ง ไม่มีการเก็บมัดจำ นัดเจอน้อง ตรวจสอบความตรงปก แล้วจ่ายหน้างานเท่านั้น ให้คุณผ่อนคลายได้อย่างเต็มที่</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "สาวรับงานลำพูน โซนนิคมอุตสาหกรรมนัดหมายอย่างไร?", a: "น้องๆ สแตนด์บายพร้อมดูแลทั้งในโซนนิคมลำพูน ตัวเมืองลำพูน และเวียงยอง สามารถแจ้งพิกัดโรงแรมหรือที่พักให้น้องเดินทางไปหาได้เลยครับ" },
        { q: "บริการฟิวแฟน (GFE) คืออะไร?", a: "คือบริการดูแลเทคแคร์เสมือนแฟนตัวจริง กอด จูบ ลูบ คลำได้ มีความสุภาพ อ่อนโยน และไม่เร่งเวลาลูกค้าครับ" },
        { q: "จ่ายเงินช่องทางไหนได้บ้าง?", a: "สามารถชำระด้วยเงินสดหรือโอนเข้าบัญชีน้องได้โดยตรง 'ที่หน้างานเมื่อเจอตัวจริงแล้วเท่านั้น' ครับ" }
      ]
    },

    phitsanulok: {
      zones: ["ทั้งหมด", "ตัวเมืองพิษณุโลก", "รอบ มน.", "ท่าโพธิ์", "สมอแข", "ท็อปแลนด์", "เซ็นทรัลพิษณุโลก"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">สาวรับงานพิษณุโลก ไซด์ไลน์พรีเมียม สไตล์ฟิวแฟน</h3>
          <p style="margin-bottom: 8px;">รวมโปรไฟล์ <strong>สาวรับงานพิษณุโลก</strong> และ <strong>เด็กเอ็นพิษณุโลก</strong> คุณภาพเยี่ยม การันตีตรงปก 100% เหมาะสำหรับท่านที่ต้องการความผ่อนคลาย เพื่อนเที่ยว (GFE)</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดบริการในพิษณุโลก</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>โซนรอบ มน. (ม.นเรศวร) - ท่าโพธิ์:</strong> พิกัดยอดฮิต รวมน้องนักศึกษา น่ารัก อัธยาศัยดี เอาใจเก่ง</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>ตัวเมือง - เซ็นทรัล - ท็อปแลนด์:</strong> นัดเจอง่าย เดินทางสะดวก เหมาะสำหรับลูกค้าที่พักโรงแรมในเมือง</span></li>
          </ul>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "สาวรับงานพิษณุโลก รอบ ม.นเรศวร (มน.) นัดหมายอย่างไร?", a: "มีน้องๆ ประจำอยู่ในโซนรอบ มน., ท่าโพธิ์ และใจกลางเมือง ลูกค้าสามารถทักไลน์นัดหมายแจ้งพิกัดโรงแรมได้เลยครับ" },
        { q: "บริการตรงปก 100% จริงไหม?", a: "จริงครับ โปรไฟล์ผ่านการตรวจสอบ (Verified) ถ้ารูปไม่ตรงปก ลูกค้ามีสิทธิ์ยกเลิกหน้างานได้ทันทีโดยไม่เสียเงินครับ" },
        { q: "มีน้องเด็กเอ็น (EN) สายปาร์ตี้ ชงเหล้า ไหม?", a: "มีบริการเด็กเอ็นเตอร์เทน (EN) ไปดูแลชงเหล้าที่ร้านอาหาร ผับ หรือปาร์ตี้ส่วนตัวในบ้านพักครับ" }
      ]
    },

    bangkok: {
      zones: ["ทั้งหมด", "สุขุมวิท", "รัชดา", "ห้วยขวาง", "ลาดพร้าว", "ทองหล่อ", "เอกมัย", "สาทร", "บางนา"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">ศูนย์รวม ไซด์ไลน์กรุงเทพ สาวรับงาน กทม. ระดับ VIP</h3>
          <p style="margin-bottom: 8px;">สัมผัสประสบการณ์ระดับไฮเอนด์กับ <strong>ไซด์ไลน์กรุงเทพ</strong> และ <strong>เด็กเอ็น กทม. (EN VIP)</strong> เราคัดสรรสาวสวย หุ่นนางแบบ พริตตี้MC และนักศึกษา ที่พร้อมมอบบริการสไตล์ฟิวแฟน (GFE) ดูแลอย่างเหนือระดับ ตอบโจทย์นักธุรกิจและผู้ที่ต้องการความผ่อนคลายอย่างเป็นส่วนตัว</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 ครอบคลุมโซนธุรกิจและแหล่งบันเทิง</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>สุขุมวิท - ทองหล่อ - เอกมัย:</strong> แหล่งรวมสาวสวยระดับพรีเมียม สื่อสารภาษาอังกฤษได้ (สายฝอ) รองรับลูกค้าต่างชาติ</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>รัชดา - ห้วยขวาง - ลาดพร้าว:</strong> พิกัดยอดฮิต เดินทางง่าย บริการ Outcall ส่งตรงถึงคอนโดและโรงแรมหรู</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>สาทร - สีลม - บางนา:</strong> ตอบโจทย์หนุ่มออฟฟิศ นักธุรกิจ นัดพบหลังเลิกงาน</span></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">จ่ายหน้างาน ปลอดภัย 100%</h3>
          <p>หลีกเลี่ยงมิจฉาชีพในวงการด้วยระบบ ไม่เก็บเงินมัดจำล่วงหน้า นัดหมายและชำระค่าบริการหน้างานเมื่อพบตัวจริง บริการครอบคลุมทั้ง Short Time, Long Time และงานปาร์ตี้ EN</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "สาวรับงานกรุงเทพฯ ครอบคลุมโซนไหนบ้าง?", a: "ครอบคลุมทุกโซนสำคัญ ทั้งสุขุมวิท, รัชดา, ห้วยขวาง, ลาดพร้าว, ทองหล่อ, สาทร และบางนา นัดพบในโรงแรมหรือคอนโดส่วนตัวได้เลยครับ" },
        { q: "มีน้องที่พูดภาษาอังกฤษได้ (English Speaking) ไหม?", a: "มีครับ โซนสุขุมวิท ทองหล่อ มีน้องๆ พรีเมียมที่สื่อสารภาษาอังกฤษได้ดีเยี่ยม เหมาะสำหรับดูแลลูกค้าชาวต่างชาติ (Expat/Tourist)" },
        { q: "มีบริการรับงานนอกสถานที่ (Outcall) หรือไม่?", a: "บริการส่วนใหญ่ของกรุงเทพฯ เป็นรูปแบบ Outcall คือน้องๆ จะเดินทางไปหาลูกค้าที่พิกัดโรงแรมหรือห้องพักของลูกค้าครับ" },
        { q: "เด็กเอ็น VIP สำหรับดินเนอร์หรู มีบริการไหม?", a: "มีครับ บริการเพื่อนเที่ยวทานข้าว ดินเนอร์ ออกงานสังคม (Companion) น้องๆ โปรไฟล์ระดับพริตตี้ วางตัวดี สวยงามครับ" }
      ]
    },

    chonburi: {
      zones: ["ทั้งหมด", "พัทยา", "บางแสน", "ศรีราชา", "ตัวเมืองชลบุรี", "จอมเทียน", "อมตะนคร", "แหลมฉบัง"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">สาวรับงานพัทยา ไซด์ไลน์ชลบุรี ฟิวแฟนริมทะเล</h3>
          <p style="margin-bottom: 8px;">มาเที่ยวทะเลทั้งที ต้องมีคนรู้ใจคอยดูแล! ค้นหา <strong>สาวรับงานพัทยา</strong>, <strong>ไซด์ไลน์บางแสน</strong> และ <strong>เด็กเอ็นชลบุรี</strong> น้องๆ น่ารัก สดใส พร้อมไปปาร์ตี้พูลวิลล่า นั่งชิลริมหาด หรือดูแลส่วนตัวที่โรงแรมสไตล์ฟิวแฟน (GFE)</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดบริการในชลบุรีและพัทยา</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>โซนพัทยา - จอมเทียน:</strong> รวมสาวสวยสายฝอ สายปาร์ตี้ EN VIP รองรับพูลวิลล่าและโรงแรมทั่วพัทยา</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>โซนบางแสน - ศรีราชา:</strong> น้องนักศึกษามหาวิทยาลัย น่ารัก สไตล์เจแปนนิส เอาใจเก่ง</span></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">รับงานพูลวิลล่า ปาร์ตี้ส่วนตัว ไม่มีมัดจำ</h3>
          <p>บริการหลากหลาย ทั้งรับงานชั่วคราว (Short Time) หรือเหมาค้างคืน (Overnight) จ่ายหน้างาน 100% ปลอดภัย ไร้กังวลเรื่องโอนเงินก่อน</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "เรียกสาวรับงานพัทยา บางแสน จ่ายเงินอย่างไร?", a: "ชำระตรงหน้างานเมื่อเจอน้องตัวจริงเรียบร้อยแล้วเท่านั้น ไม่มีโอนมัดจำก่อนเพื่อความปลอดภัย 100% ครับ" },
        { q: "รับงานปาร์ตี้ พูลวิลล่า ในพัทยาไหม?", a: "รับครับ มีบริการเด็กเอ็น (EN) สำหรับปาร์ตี้สระว่ายน้ำ พูลวิลล่า ชงเหล้า เอ็นเตอร์เทน สร้างบรรยากาศสนุกสนาน" },
        { q: "ศรีราชา มีน้องสไตล์ไหนบ้าง?", a: "โซนศรีราชา บางแสน มีน้องๆ สไตล์วัยใส นักศึกษา ผิวขาว น่ารัก เอาใจเก่ง (GFE) สแตนด์บายเยอะมากครับ" },
        { q: "หาเด็กเอ็นที่สามารถพูดภาษาอังกฤษได้ มีไหม?", a: "โซนพัทยาและจอมเทียน มีน้องๆ พรีเมียมที่สื่อสารภาษาอังกฤษได้ดี พร้อมดูแลลูกค้าชาวต่างชาติครับ" }
      ]
    },

    "khon-kaen": {
      zones: ["ทั้งหมด", "ในตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">สาวรับงานขอนแก่น ไซด์ไลน์ขอนแก่น (อันดับ 1 อีสาน)</h3>
          <p style="margin-bottom: 8px;">ค้นหา <strong>สาวรับงานขอนแก่น</strong> และ <strong>เด็กเอ็นขอนแก่น</strong> โปรไฟล์ตัวท็อปของภาคอีสาน เรารวมน้องๆ นักศึกษา วัยใส และสาวสวยสุดฮอต ที่พร้อมให้บริการเพื่อนเที่ยวฟิวแฟน (GFE) ดูแลอย่างดี ไม่มีเร่งเวลา</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดบริการในขอนแก่น</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>โซนกังสดาล - หลัง มข. - โนนม่วง:</strong> อาณาจักรของน้องๆ นักศึกษา สไตล์วัยใส น่ารัก ขี้อ้อน บริการฟิวแฟนเยี่ยม</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>ตัวเมือง - เซ็นทรัล - บึงแก่นนคร:</strong> นัดเจอตามโรงแรมชั้นนำกลางเมือง สะดวกรวดเร็ว ทั้งชั่วคราวและค้างคืน</span></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">ปลอดภัย นัดเจอตัวจริงค่อยจ่ายเงิน</h3>
          <p>เราให้ความสำคัญกับความปลอดภัยลูกค้า ไม่ต้องโอนมัดจำล่วงหน้า นัดเจอตัวจริง เช็คความตรงปก แล้วค่อยชำระเงินโดยตรงกับน้องหน้างานเท่านั้น</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "นัดหมายสาวรับงานขอนแก่น โซนกังสดาล และหลัง มข. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำทั้งโซนกังสดาล หลัง มข. และโรงแรมชั้นนำใจกลางเมืองขอนแก่น นัดหมายปุ๊บเดินทางไวครับ" },
        { q: "บริการฟิวแฟนขอนแก่น ทำอะไรได้บ้าง?", a: "ฟิวแฟน (GFE) คือบริการที่น้องจะเทคแคร์เสมือนแฟนจริงๆ กอด จูบ ลูบ คลำได้ มีความอ่อนโยน สุภาพ และไม่เร่งเวลาครับ" },
        { q: "รับงานค้างคืน (Long Time) ต้องจ่ายเท่าไหร่?", a: "เรทค้างคืนจะเฉลี่ยอยู่ที่ประมาณ 4,000 - 6,000 บาทขึ้นไป ขึ้นอยู่กับโปรไฟล์น้องๆ สามารถตรวจสอบราคาได้ที่หน้าโปรไฟล์ครับ" },
        { q: "หาเพื่อนเที่ยว นั่งชิลร้านเหล้าแถว มข. มีไหม?", a: "มีบริการเด็กเอ็น (EN) ไปนั่งดื่มเป็นเพื่อน ชงเหล้า เอ็นเตอร์เทนที่ร้านอาหารและผับบาร์ในขอนแก่นครับ" }
      ]
    },

    khonkaen: {
      zones: ["ทั้งหมด", "ในตัวเมืองขอนแก่น", "กังสดาล", "หลัง มข.", "เซ็นทรัลขอนแก่น", "บึงแก่นนคร", "โนนม่วง"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">สาวรับงานขอนแก่น ไซด์ไลน์ขอนแก่น (อันดับ 1 อีสาน)</h3>
          <p style="margin-bottom: 8px;">ค้นหา <strong>สาวรับงานขอนแก่น</strong> และ <strong>เด็กเอ็นขอนแก่น</strong> โปรไฟล์ตัวท็อปของภาคอีสาน เรารวมน้องๆ นักศึกษา วัยใส และสาวสวยสุดฮอต ที่พร้อมให้บริการเพื่อนเที่ยวฟิวแฟน (GFE) ดูแลอย่างดี ไม่มีเร่งเวลา</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดบริการในขอนแก่น</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>โซนกังสดาล - หลัง มข. - โนนม่วง:</strong> อาณาจักรของน้องๆ นักศึกษา สไตล์วัยใส น่ารัก ขี้อ้อน บริการฟิวแฟนเยี่ยม</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>ตัวเมือง - เซ็นทรัล - บึงแก่นนคร:</strong> นัดเจอตามโรงแรมชั้นนำกลางเมือง สะดวกรวดเร็ว ทั้งชั่วคราวและค้างคืน</span></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">ปลอดภัย นัดเจอตัวจริงค่อยจ่ายเงิน</h3>
          <p>เราให้ความสำคัญกับความปลอดภัยลูกค้า ไม่ต้องโอนมัดจำล่วงหน้า นัดเจอตัวจริง เช็คความตรงปก แล้วค่อยชำระเงินโดยตรงกับน้องหน้างานเท่านั้น</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "นัดหมายสาวรับงานขอนแก่น โซนกังสดาล และหลัง มข. สะดวกไหม?", a: "สะดวกมากครับ มีน้องๆ ประจำทั้งโซนกังสดาล หลัง มข. และโรงแรมชั้นนำใจกลางเมืองขอนแก่น นัดหมายปุ๊บเดินทางไวครับ" },
        { q: "บริการฟิวแฟนขอนแก่น ทำอะไรได้บ้าง?", a: "ฟิวแฟน (GFE) คือบริการที่น้องจะเทคแคร์เสมือนแฟนจริงๆ กอด จูบ ลูบ คลำได้ มีความอ่อนโยน สุภาพ และไม่เร่งเวลาครับ" },
        { q: "รับงานค้างคืน (Long Time) ต้องจ่ายเท่าไหร่?", a: "เรทค้างคืนจะเฉลี่ยอยู่ที่ประมาณ 4,000 - 6,000 บาทขึ้นไป ขึ้นอยู่กับโปรไฟล์น้องๆ สามารถตรวจสอบราคาได้ที่หน้าโปรไฟล์ครับ" }
      ]
    },

    phuket: {
      zones: ["ทั้งหมด", "ป่าตอง", "กะทู้", "ฉลอง", "กะรน", "กะตะ", "บางเทา", "ราไวย์", "เชิงทะเล"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">สาวรับงานภูเก็ต ไซด์ไลน์ภูเก็ต (VIP Escorts Phuket)</h3>
          <p style="margin-bottom: 8px;">ยกระดับวันหยุดพักผ่อนของคุณกับ <strong>สาวรับงานภูเก็ต</strong>, เด็กเอ็นวีไอพี (EN VIP) และ <strong>Phuket Escort</strong> เราคัดสรรสาวสวยหุ่นนางแบบ โปรไฟล์พรีเมียม สื่อสารภาษาอังกฤษได้ (สายฝอ) พร้อมไปปาร์ตี้พูลวิลล่าหรือล่องเรือยอร์ช</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดบริการ ทั่วเกาะภูเก็ต</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>ป่าตอง - กะทู้:</strong> ศูนย์กลางความบันเทิง น้องๆ พร้อมบริการทั้งชั่วคราวและค้างคืนในโรงแรมชั้นนำ</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>บางเทา - เชิงทะเล:</strong> สำหรับลูกค้าที่ต้องการความไฮเอนด์ พูลวิลล่าหรู น้องๆ พร้อมเดินทางไปดูแลส่วนตัว</span></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">ไม่โอนมัดจำ รับประกันตัวจริงตรงปก</h3>
          <p>เพิ่มความมั่นใจด้วยระบบยืนยันตัวตน ไม่มีมัดจำ นัดเจอน้องที่พูลวิลล่าหรือโรงแรม แล้วชำระเงินหน้างาน บริการเป็นมืออาชีพ ให้คุณเที่ยวภูเก็ตอย่างมีความสุขที่สุด</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "นัดหมายสาวรับงานภูเก็ต ป่าตอง จ่ายเงินอย่างไร?", a: "นัดเจอตัวจริงตรงปกหน้างานแล้วค่อยชำระเงินตรงกับน้อง ไม่มีโอนมัดจำล่วงหน้าทุกกรณีครับ" },
        { q: "รับงานพูลวิลล่า หรือไปเที่ยวเกาะด้วยได้ไหม?", a: "ได้ครับ มีบริการเพื่อนเที่ยว (Companion) ทั้งแบบรายวันและค้างคืน พาไปปาร์ตี้พูลวิลล่าหรือล่องเรือยอร์ชได้ครับ" },
        { q: "มีน้องที่พูดภาษาอังกฤษได้ (English Speaking) ไหม?", a: "มีจำนวนมากครับ ภูเก็ตเป็นเมืองท่องเที่ยว น้องๆ ระดับพรีเมียมสามารถสื่อสารภาษาอังกฤษเพื่อดูแลลูกค้าต่างชาติได้เป็นอย่างดี" },
        { q: "ถ้าพักอยู่ไกล เช่น แถวบางเทา หรือ เชิงทะเล น้องไปได้ไหม?", a: "ไปได้แน่นอนครับ บริการเราเป็น Outcall ทั่วเกาะภูเก็ต (อาจมีค่าเดินทางเพิ่มเติมตามระยะทางเล็กน้อย ตกลงก่อนได้ครับ)" }
      ]
    },

    udonthani: {
      zones: ["ทั้งหมด", "ตัวเมืองอุดร", "UD Town", "หนองประจักษ์", "เซ็นทรัลอุดร", "บ้านจาน", "โพศรี"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">สาวรับงานอุดรธานี ไซด์ไลน์อุดร ไม่โอนมัดจำ</h3>
          <p style="margin-bottom: 8px;">สัมผัสความน่ารักของ <strong>สาวรับงานอุดรธานี</strong> และ <strong>เพื่อนเที่ยวอุดร</strong> คัดโปรไฟล์น้องๆ สเปคสวย ตัวเล็ก ผิวขาว สไตล์ฟิวแฟน (GFE) พร้อมให้บริการดูแลคุณตลอดเวลาในตัวเมืองอุดรธานี</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">📍 พิกัดบริการในอุดรธานี</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>ย่าน UD Town - เซ็นทรัลอุดร:</strong> นัดเจอง่าย เดินทางสะดวก มีน้องๆ สแตนด์บายพร้อมบริการ Outcall ถึงที่พัก</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>รอบหนองประจักษ์ - โพศรี:</strong> บริการระดับพรีเมียม เป็นส่วนตัว น้องๆ เทคแคร์เอาใจใส่ ไม่เร่งเวลา</span></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">โปร่งใส ชัดเจน จ่ายหน้างาน 100%</h3>
          <p>เรารับประกันความตรงปก โปรไฟล์ผ่านการตรวจสอบ นัดเจอน้องที่โรงแรมในเมืองอุดรธานี ตรวจสอบความพึงพอใจแล้วจึงจ่ายเงิน ปลอดภัยจากมิจฉาชีพเด็ดขาด</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "สาวรับงานอุดรธานี นัดพบแถวไหนสะดวกที่สุด?", a: "ย่านใจกลางเมืองอุดรธานี, UD Town, เซ็นทรัลอุดร และรอบสวนสาธารณะหนองประจักษ์ เป็นจุดนัดพบที่โรงแรมหาง่ายและเดินทางสะดวกสุดครับ" },
        { q: "ต้องการน้องไปชงเหล้าที่ร้านอาหาร หรือผับในอุดร มีไหม?", a: "มีครับ เรามีบริการเด็กเอ็น (EN) สำหรับเอ็นเตอร์เทน ชงเหล้า คุยสนุก คอยดูแลคุณและเพื่อนๆ ที่ร้านอาหารหรือปาร์ตี้ครับ" },
        { q: "บริการแบบชั่วคราว (Short Time) ใช้เวลาเท่าไหร่?", a: "เรทมาตรฐาน Short Time จะอยู่ที่ประมาณ 1.5 - 2 ชั่วโมงครับ ให้บริการเทคแคร์สไตล์ฟิวแฟน ไม่เร่งเวลา" },
        { q: "ต้องโอนมัดจำเพื่อจองคิวไหม?", a: "ไม่ต้องโอนมัดจำครับ! ระบบของเราให้ลูกค้าเจอน้องตัวจริงก่อน แล้วค่อยชำระเงินเต็มจำนวนหน้างาน" }
      ]
    },

    national: {
      zones: ["ทั้งหมด", "กรุงเทพฯ", "เชียงใหม่", "ชลบุรี", "พัทยา", "ภูเก็ต", "ขอนแก่น", "อุดรธานี", "เชียงราย"],
      seoContent: `
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">ศูนย์รวมสาวรับงาน ไซด์ไลน์ ทั่วไทย อันดับ 1</h3>
          <p style="margin-bottom: 8px;">First Model Hub คือแพลตฟอร์มที่รวบรวม <strong>สาวรับงานทั่วไทย</strong>, <strong>ไซด์ไลน์ทั่วไทย</strong> และ <strong>เด็กเอ็น (EN VIP)</strong> ครอบคลุม 77 จังหวัด เราคัดสรรเฉพาะน้องๆ โปรไฟล์พรีเมียม วัยใส นักศึกษา และสาวสวยหุ่นนางแบบ ที่พร้อมให้บริการสไตล์ฟิวแฟน (GFE) ดูแลดุจคนรัก</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">🛡️ นโยบายความปลอดภัยสูงสุด (Zero-Deposit)</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; gap: 6px; display: flex; flex-direction: column;">
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>จ่ายเงินหน้างานเท่านั้น:</strong> ป้องกันมิจฉาชีพ 100% ไม่มีการบังคับโอนเงินมัดจำล่วงหน้าทุกกรณี</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>การันตีตรงปก 100%:</strong> โปรไฟล์ผ่านการตรวจสอบ หากตัวจริงไม่ตรงปก สามารถยกเลิกได้ทันทีฟรี!</span></li>
             <li style="display: flex; align-items: flex-start; gap: 6px;"><i class="fas fa-check-circle" style="color: #059669; font-size: 12px; margin-top: 3px;"></i> <span><strong>รักษาความลับลูกค้า:</strong> บริการ Outcall ส่งน้องๆ ไปยังโรงแรมหรือที่พักส่วนตัวของท่านอย่างมิดชิด</span></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 14px; color: #7C3AED; font-weight: 800; margin-bottom: 8px;">บริการครอบคลุมทุกความต้องการ</h3>
          <p>เรามีบริการหลากหลาย ไม่ว่าจะเป็นเพื่อนเที่ยวทานข้าว, ดินเนอร์, เด็กเอ็นชงเหล้า, บริการแบบชั่วคราว (Short Time) หรือดูแลทั้งคืน (Overnight) เลือกจังหวัดที่คุณอยู่แล้วนัดหมายได้เลย!</p>
        </div>
      `,
      reviews: [],
      faqs: [
        { q: "เรียกใช้บริการน้องๆ สาวรับงาน เด็กเอ็น First Model Hub ต้องโอนมัดจำล่วงหน้าไหม?", a: "ไม่ต้องโอนมัดจำล่วงหน้าใดๆ ทั้งสิ้นครับ ลูกค้าตกลงชำระค่าบริการหน้างานเมื่อเจอน้องตัวจริงตรงปกแล้วเท่านั้น ปลอดภัย 100%" },
        { q: "ถ้าสั่งจองแล้ว น้องมาถึงแต่ไม่ตรงปก ทำอย่างไร?", a: "เราการันตีตรงปกครับ หากลูกค้าพบว่ารูปภาพและตัวจริงไม่เหมือนกัน สามารถปฏิเสธการรับบริการและยกเลิกหน้างานได้ทันทีโดยไม่มีค่าใช้จ่าย" },
        { q: "บริการฟิวแฟน (GFE) คืออะไร แตกต่างจากการรับงานทั่วไปอย่างไร?", a: "ฟิวแฟน คือบริการที่เน้นการเทคแคร์ เอาใจใส่ กอด จูบ ลูบ คลำได้เสมือนแฟนจริง น้องๆ จะมีความอ่อนโยน ไม่เร่งเวลา และให้เกียรติลูกค้าครับ" },
        { q: "มีน้องที่รับงานแบบค้างคืน (Overnight) ไหม?", a: "มีครอบคลุมทุกจังหวัดครับ ลูกค้าสามารถเช็คเรทราคาเหมาค้างคืนได้ที่หน้ารายละเอียดโปรไฟล์ของน้องๆ แต่ละคน" },
        { q: "เปิดให้บริการตลอด 24 ชั่วโมงหรือไม่?", a: "ระบบแอดมินและการประสานงานของเราเปิดให้บริการตั้งแต่ช่วงสายถึงดึก (ตามเวลาที่ระบุหน้าเว็บ) แต่น้องๆ หลายคนสแตนด์บายรับงานตลอด 24 ชม. ครับ" }
      ]
    }
  };

  
  const REVIEW_POOL = [
    { name: "คุณชลสิทธิ์", text: "ตรงเวลามากครับ น้องน่ารัก อัธยาศัยดี พูดจาสุภาพ ดูแลสไตล์ฟิวแฟนแท้ๆ ประทับใจมากครับ" },
    { name: "คุณเอก", text: "ตัวจริงสวยตรงปกเลยครับ คุยสนุก เป็นกันเองมาก ปลอดภัยนัดเจอจ่ายหน้างานสบายใจสุดๆ" },
    { name: "พี่โจ", text: "จองง่าย ไม่ต้องโอนมัดจำล่วงหน้า ไปเจอน้องตัวจริงแล้วค่อยจ่าย สบายใจและปลอดภัย 100% ครับ" },
    { name: "คุณกอล์ฟ", text: "น้องน่ารักสไตล์ผู้ดี มารยาทดีมาก เทคแคร์เอาใจใส่เป็นธรรมชาติ แนะนำคนนี้เลยครับ" },
    { name: "พี่ยอด", text: "ตรงปกไม่จกตาครับ น้องสุภาพ เรียบร้อย ไม่มีเร่งเวลาเลย นั่งทานข้าวด้วยกันเพลินมาก" },
    { name: "คุณต้น", text: "บริการประทับใจมากครับ ให้เกียรติลูกค้า น่ารัก ยิ้มเก่ง คลายเหงาได้ดีเยี่ยมเลยครับ" },
    { name: "พี่บอล", text: "ฟิวแฟนของแท้เลยครับ น้องเทคแคร์ดีมาก ขี้อ้อน น่ารัก ตรงตามรูปในโปรไฟล์ทุกอย่าง" },
    { name: "คุณอภิชาติ", text: "ระบบจองสะดวกมาก น้องตรงเวลา สะอาด มารยาทการดูแลดีเยี่ยม ไร้กังวลเรื่องมัดจำครับ" },
    { name: "พี่เมฆ", text: "น่ารักและเป็นกันเองมากครับ น้องคุยสนุก ไม่มีเกร็งเลย เหมือนได้ไปเดทกับแฟนจริงๆ" },
    { name: "คุณวิทย์", text: "ตัวจริงสวยกว่าในรูปอีกครับ ผิวพรรณดี สุภาพเรียบร้อย เอาใจใส่ทุกรายละเอียด แนะนำครับ" },
    { name: "พี่นัท", text: "จ่ายเงินหน้างานตรงกับน้อง มั่นใจในความปลอดภัยได้เต็มร้อย บริการด้วยความจริงใจมากครับ" },
    { name: "คุณบอย", text: "น้องตรงต่อเวลามาก น่ารัก สดใส พูดเพราะ ให้ความรู้สึกอบอุ่นและผ่อนคลายสุดๆ ครับ" },
    { name: "คุณป้อง", text: "เทคแคร์ดีมากครับ สุภาพ อารมณ์ดีตลอดเวลา คุ้มค่าและประทับใจมากครับ" },
    { name: "พี่ยุทธ", text: "โปรไฟล์ยืนยันตัวตนจริง ตัวจริงตรงปก 100% สบายใจเรื่องความปลอดภัย แนะนำต่อเลยครับ" },
    { name: "คุณอาร์ม", text: "น่ารัก ขี้อ้อน คุยเก่งมากครับ ชวนคุยเพลิน ไม่มีช่วงเงียบเลย ประทับใจมากครับ" },
    { name: "พี่ก้อง", text: "รักษาเวลาดีเยี่ยม สุภาพ สะอาด ให้เกียรติซึ่งกันและกัน มีโอกาสจะนัดหมายอีกแน่นอนครับ" },
    { name: "คุณเต้", text: "นัดหมายปลอดภัย ไม่มีความเสี่ยงทางการเงิน น้องน่ารัก มารยาทดี สมราคาครับ" },
    { name: "คุณเจ", text: "บริการด้วยความจริงใจ ฟีลแฟนอบอุ่น ดูแลเอาใจใส่เป็นธรรมชาติ ไม่ผิดหวังครับ" }
  ];

 

  const appState = {
    allProfiles: [],
    provincesMap: new Map(),
    currentProfileSlug: null,
    isFetching: false,
    currentFilters: null,
    filteredProfiles: [],
    activePillTag: "all",
    renderId: 0
  };

  const domCache = {};
  
  // 🟢 1. NATIVE HAPTIC FEEDBACK (สั่นเบาๆ ตอบสนองนิ้วมือแบบแอปแท้ๆ)
  function triggerHaptic(type = "light") {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        if (type === "light") {
          navigator.vibrate(12); // สั่นแตะเบาๆ 12ms ตอนกดปุ่ม/ฟิลเตอร์
        } else if (type === "medium") {
          navigator.vibrate(20); // สั่นพอดีๆ ตอนเปิดการ์ดโปรไฟล์
        } else if (type === "success") {
          navigator.vibrate([15, 40, 15]); // สั่นสองจังหวะตอนเปิดอ่านหรือจองคิว
        }
      } catch (_) {}
    }
  }
  window.triggerHaptic = triggerHaptic;
  
  

  function sanitizeThaiText(text) {
    if (!text || typeof text !== "string") return "";
    return text
      .replace(/([\u0E31\u0E34-\u0E3A\u0E47-\u0E4E])\1+/g, "$1")
      .replace(/เจ็+ดยอด/g, "เจ็ดยอด")
      .replace(/นิมาน|นิทาน/g, "นิมมาน")
      .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
      .replace(/พาพับ/g, "พายัพ")
      .replace(/ของแก่น/g, "ขอนแก่น")
      .replace(/ฟื้นที่/g, "พื้นที่")
      .replace(/อมสด|จูบแลกลิ้น|แตกบนตัว|จู๋ทำ\+500|69|➏➒|เอาร่องนม|ดูดสด/gi, "บริการดูแลสไตล์ฟิวแฟน")
      .replace(/1น้ำ\/1ชม/gi, "1 ชม.")
      .replace(/ฟรีถุงยาง!/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function formatDisplayName(name) {
    if (!name || typeof name !== "string") return "";
    let clean = name.trim().replace(/^(น้อง\s?)+/gi, "");
    clean = clean.toLowerCase();
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    return isEN ? clean : `น้อง${clean}`;
  }

  function escapeHTML(str) {
    return str ? String(str).replace(/[&<>'"]/g, tag => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[tag] || tag)) : "";
  }

  function formatLuxuryRate(rate) {
    if (!rate) return "1.5k";
    const num = parseInt(String(rate).replace(/\D/g, ""), 10);
    if (isNaN(num) || num <= 0) return "1.5k";
    if (num >= 1000) {
      const kVal = num / 1000;
      return (kVal % 1 === 0 ? kVal : kVal.toFixed(1)) + "k";
    }
    return String(num);
  }

 function optimizeImg(imagePath, width = 400, height = 560) {
  const DEFAULT_FALLBACK_IMG = "https://firstmodelhub.com/images/firstmodelhub.webp";
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) return DEFAULT_FALLBACK_IMG;

  const cleanPath = imagePath.trim();
  const isThumb = width <= 150;
  const isFull = width >= 800; // 👈 1. ตรวจจับรูปใหญ่ใน Lightbox Modal

  // 🟢 ปรับคุณภาพ 3 ระดับ: เล็ก (120), การ์ดหน้าแรก (400x560), รูปใหญ่ใน Modal (800x1120 คมชัดระดับ HD แท้)
  let transform = "f_auto,q_auto:eco,w_400,h_560,c_fill,g_face";
  if (isThumb) {
    transform = "f_auto,q_auto:eco,w_120,h_120,c_fill,g_face";
  } else if (isFull) {
    transform = "f_auto,q_auto:good,w_800,h_1120,c_fill,g_face"; // 👈 คมชัดระดับ Retina ไม่เบลอ ไม่แตก
  }

  if (cleanPath.includes("res.cloudinary.com")) {
    const uploadIdx = cleanPath.indexOf("/upload/");
    if (uploadIdx !== -1) {
      const base = cleanPath.substring(0, uploadIdx + 8);
      let rest = cleanPath.substring(uploadIdx + 8);
      rest = rest.replace(/^(?:[a-z]{1,4}_[a-z0-9_:-]+,?)+\//i, "");
      return `${base}${transform}/${rest}`;
    }
    return cleanPath;
  }

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  let formatted = cleanPath.replace(/^\/+/, "");
  return `https://res.cloudinary.com/dyynjlbuj/image/upload/${transform}/${formatted}`;
}

  function normalizeProfile(raw) {
    if (!raw || typeof raw !== "object") return null;

    const displayName = formatDisplayName(raw.name || raw.displayName || raw.title || "Model");
    const mainImg = raw.imagePath || raw.image_url || raw.imageUrl || raw.image || raw.photo || raw.avatar;
    const gallery = raw.galleryPaths || raw.gallery_paths || raw.gallery || raw.photos || raw.images || [];
    const combinedPhotos = [
      mainImg,
      ...(Array.isArray(gallery) ? gallery : typeof gallery === "string" ? gallery.split(",").map(s => s.trim()) : [])
    ].filter(Boolean);

    let images = [...new Set(combinedPhotos)].map(img => {
      let srcUrl = DEFAULT_FALLBACK_IMG;
      let fullSrcUrl = DEFAULT_FALLBACK_IMG;

      if (typeof img === "object" && img !== null) {
        srcUrl = img.src || img.url || img.imagePath || img.image_url || DEFAULT_FALLBACK_IMG;
        fullSrcUrl = img.fullSrc || img.fullUrl || srcUrl;
      } else if (typeof img === "string" && img.trim()) {
        srcUrl = img.trim();
        fullSrcUrl = img.trim();
      }

      return {
        src: optimizeImg(srcUrl, 400, 560),
        fullSrc: optimizeImg(fullSrcUrl, 1000, null)
      };
    });

    if (images.length === 0) {
      images.push({ src: DEFAULT_FALLBACK_IMG, fullSrc: DEFAULT_FALLBACK_IMG });
    }

    let pKey = (raw.provinceKey || raw.province_slug || raw.province_key || raw.province || "").toString().toLowerCase().trim();
    
    // ตรวจจับจังหวัดจากข้อความ ป้องกันตกไปอยู่เชียงใหม่ซ้ำ
    const fullText = `${raw.location || ''} ${raw.provinceThai || ''} ${raw.description || ''} ${raw.name || ''}`.toLowerCase();
    if (fullText.includes("ขอนแก่น") || fullText.includes("กังสดาล") || fullText.includes("มข")) pKey = "khonkaen";
    else if (fullText.includes("กรุงเทพ") || fullText.includes("กทม") || fullText.includes("สุขุมวิท") || fullText.includes("รัชดา")) pKey = "bangkok";
    else if (fullText.includes("ชลบุรี") || fullText.includes("พัทยา") || fullText.includes("บางแสน")) pKey = "chonburi";
    else if (fullText.includes("ภูเก็ต") || fullText.includes("ป่าตอง")) pKey = "phuket";
    else if (fullText.includes("เชียงราย") || fullText.includes("บ้านดู่")) pKey = "chiangrai";
    else if (fullText.includes("ลำปาง")) pKey = "lampang";
    else if (fullText.includes("ลำพูน")) pKey = "lamphun";
    else if (fullText.includes("พิษณุโลก") || fullText.includes("มน.")) pKey = "phitsanulok";
    else if (fullText.includes("อุดร")) pKey = "udonthani";
    else if (fullText.includes("เชียงใหม่") || fullText.includes("นิมมาน") || fullText.includes("เจ็ดยอด")) pKey = "chiangmai";
    else if (!pKey || pKey === "no_province") pKey = "chiangmai";

    if (pKey === "chiang_mai" || pKey === "chiang-mai") pKey = "chiangmai";
    if (pKey === "khon-kaen") pKey = "khonkaen";
    const provinceThai = appState.provincesMap.get(pKey) || raw.provinceThai || raw.province_thai || raw.provinceName || "เชียงใหม่";
    
    // 🟢 แก้ไข: ใช้ parseRateToNumber ป้องกันบั๊กราคา 15.-
    const rawRate = raw.rate || raw.price || raw.fee || raw.cost || 0;
    const numPrice = parseRateToNumber(rawRate);
    const displayPrice = numPrice > 0 ? `${numPrice.toLocaleString()}.-` : (isEN ? "Inquire" : "สอบถาม");

    let statsStr = "-";
    const bust = raw.bust || raw.breast || "";
    const waist = raw.waist || "";
    const hips = raw.hip || raw.hips || "";
    const cup = (raw.cup_size || raw.cupSize || raw.cup || "").toString().toUpperCase().trim();

    if (bust && waist && hips) {
      statsStr = `${bust}${cup}-${waist}-${hips}`;
    } else if (raw.stats || raw.proportion || raw.proportions) {
      statsStr = String(raw.stats || raw.proportion || raw.proportions).trim();
    }

    const rawAge = raw.age || raw.profile_age;
    const cleanAge = rawAge && String(rawAge).trim() !== "-" && String(rawAge).trim() !== "0" ? String(rawAge).replace(/\D/g, "") : null;
    const ageDisplay = cleanAge ? (isEN ? `${cleanAge} yrs` : `${cleanAge} ปี`) : (isEN ? "N/A" : "ไม่ระบุ");

    const rawHeight = raw.height || raw.profile_height;
    const cleanHeight = rawHeight && String(rawHeight).trim() !== "-" && String(rawHeight).trim() !== "0" ? String(rawHeight).replace(/\D/g, "") : null;
    const heightDisplay = cleanHeight ? `${cleanHeight} cm` : (isEN ? "N/A" : "ไม่ระบุ");

    const rawWeight = raw.weight || raw.profile_weight;
    const cleanWeight = rawWeight && String(rawWeight).trim() !== "-" && String(rawWeight).trim() !== "0" ? String(rawWeight).replace(/\D/g, "") : null;
    const weightDisplay = cleanWeight ? `${cleanWeight} kg` : (isEN ? "N/A" : "ไม่ระบุ");

    const rawSkin = raw.skin_tone || raw.skinTone || raw.skin_color || raw.skinColor || raw.skin;
    const skinDisplay = rawSkin && String(rawSkin).trim() !== "-" ? String(rawSkin).trim() : (isEN ? "Fair" : "ไม่ระบุ");
    const statsDisplay = statsStr && statsStr !== "-" ? statsStr : (isEN ? "N/A" : "ไม่ระบุ");

    const slogan = raw.slogan || raw.quote || raw.tagline || (isEN ? "Romantic Girlfriend Experience, verified photos" : "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน");
    const rawTags = raw.style_tags || raw.styleTags || raw.tags || [];
    const styleTags = Array.isArray(rawTags) ? rawTags : typeof rawTags === "string" ? rawTags.split(",").map(s => s.trim()) : [];

    const availabilityStatus = raw.availability || raw.status || (isEN ? "Available" : "รับงาน");
    const isAvail = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "off", "busy"].some(s => availabilityStatus.toLowerCase().includes(s));
    const lineId = (raw.line_id || raw.lineId || raw.line || "").toString().replace(/^@/, "").trim();

    return {
      ...raw,
      id: raw.id,
      slug: raw.slug || String(raw.id),
      location: isEN ? (PROVINCE_EN_MAP[pKey] || pKey) : sanitizeThaiText(raw.location || provinceThai),
      description: sanitizeThaiText(raw.description || ""),
      quote: isEN ? slogan : sanitizeThaiText(slogan),
      slogan: isEN ? slogan : sanitizeThaiText(slogan),
      displayName,
      images,
      provinceNameThai: provinceThai,
      provinceKey: pKey,
      displayPrice,
      _price: numPrice,
      bust: String(bust),
      cup,
      safeAge: cleanAge || "-",
      safeAgeDisplay: ageDisplay,
      safeHeight: heightDisplay,
      safeWeight: weightDisplay,
      safeStats: statsDisplay,
      safeSkin: skinDisplay,
      isAvailable: isAvail,
      availability: availabilityStatus,
      isVerified: raw.verified === true || raw.isVerified === true || raw.is_verified === true,
      hasVideo: raw.has_video === true || raw.hasVideo === true || raw.hasVideoClip === true,
      isfeatured: raw.isfeatured === true || raw.is_featured === true || raw.isFeatured === true,
      lineId,
      styleTags
    };
  }

  function populateInitialComponents() {
    if (domCache.provinceSelect) {
      while (domCache.provinceSelect.options.length > 1) {
        domCache.provinceSelect.remove(1);
      }
      const sortedProvinces = Array.from(appState.provincesMap.entries()).sort((a, b) => a[1].localeCompare(b[1], "th"));
      const fragment = document.createDocumentFragment();
      sortedProvinces.forEach(([k, nameThai]) => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = isEN ? (PROVINCE_EN_MAP[k] || nameThai) : nameThai;
        fragment.appendChild(opt);
      });
      domCache.provinceSelect.appendChild(fragment);
    }
    
    initAgencyStories();

    const routeMatch = window.location.pathname.match(/^\/(?:location|province)\/([^/]+)/);
    const activeProvinceSlug = routeMatch ? decodeURIComponent(routeMatch[1]).toLowerCase() : window.currentProvinceSlug || "";
    if (domCache.provinceSelect && activeProvinceSlug && activeProvinceSlug !== "national") {
      domCache.provinceSelect.value = activeProvinceSlug;
    }

    const hasExistingSSRProfiles = domCache.profilesDisplayArea && domCache.profilesDisplayArea.children.length > 0;
    if (!hasExistingSSRProfiles) {
      executeFilterAndRender(false);
    }

    const vipSwiperEl = document.getElementById("vip-swiper-container");
    if (!vipSwiperEl || vipSwiperEl.children.length > 0) return;
    
    // 🟢 ดึงเฉพาะคนสไตล์ฟิวแฟน
    let hotCandidate = appState.allProfiles.filter(p => {
      const combinedKeywords = `${(Array.isArray(p.styleTags) ? p.styleTags : []).join(" ")} ${p.slogan || ""} ${p.quote || ""}`.toLowerCase();
      return combinedKeywords.includes("ฟิวแฟน") || combinedKeywords.includes("ฟิลแฟน") || combinedKeywords.includes("gfe");
    });

    if (hotCandidate.length === 0) hotCandidate = appState.allProfiles;

    // 🛡️ กรองตัดคนซ้ำทิ้งเด็ดขาด (ชื่อเดียวกัน หรือรูปเดียวกัน จะโผล่ได้แค่รอบเดียว)
    const seenHotNames = new Set();
    const hotProfiles = [];
    for (const p of hotCandidate) {
      const cleanName = (p.displayName || p.name || "").replace(/^(น้อง|สาว|พี่)\s*/gi, "").trim().toLowerCase();
      if (seenHotNames.has(cleanName)) continue; // ถ้าชื่อซ้ำข้ามทันที
      seenHotNames.add(cleanName);
      hotProfiles.push(p);
      if (hotProfiles.length >= 10) break;
    }
    vipSwiperEl.innerHTML = hotProfiles.map((p, idx) => {
      const rankBadge = `#${idx + 1} HOT`;
      const pKey = (p.provinceKey || "national").toLowerCase();
      const locationText = isEN ? (PROVINCE_EN_MAP[pKey] || pKey) : (p.location || p.provinceNameThai || "ทั่วไทย");
      const slug = encodeURIComponent(p.slug || p.id);
      const imgSrc = p.images[0]?.src || DEFAULT_FALLBACK_IMG;
      const isOnline = p.isAvailable !== undefined ? p.isAvailable : !(p.availability || "").toLowerCase().includes("ไม่ว่าง");
      const statusLabel = isEN ? (isOnline ? "Available" : "Inquire") : (isOnline ? "รับงาน" : "สอบถาม");

      return `
        <div class="vip-card-item ${idx === 0 ? "active-glow" : ""}" data-profile-id="${p.id}" data-profile-slug="${slug}">
          <span class="vip-status-chip"><span aria-hidden="true">🟢</span> ${statusLabel}</span>
          <span class="hot-rank-badge">${rankBadge}</span>
    <img src="${imgSrc}" 
     alt="${escapeHTML(p.displayName)}" 
     width="175" 
     height="245" 
     loading="${idx === 0 ? "eager" : "lazy"}" 
     fetchpriority="${idx === 0 ? "high" : "auto"}" 
     decoding="async" 
     onerror="this.onerror=null; this.src='${DEFAULT_FALLBACK_IMG}';">
          <div class="vip-card-overlay"></div>
          <a href="/sideline/${slug}" class="card-link" aria-label="ดูโปรไฟล์ ${escapeHTML(p.displayName)}"></a>
          <div class="vip-card-info">
            <h3 class="vip-name" style="margin:0; font-size:14px; font-weight:900;">${escapeHTML(p.displayName)}</h3>
            <div class="vip-location">${escapeHTML(locationText)}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  function executeFilterAndRender(isUserTriggered = true) {
    try {
      const pathMatch = window.location.pathname.toLowerCase().match(/^\/(?:location|province)\/([^/]+)/);
      const urlProvince = pathMatch ? decodeURIComponent(pathMatch[1]) : null;

      let activeProvince = "all";
      if (urlProvince && urlProvince !== "profiles") {
        activeProvince = urlProvince;
      } else if (domCache.provinceSelect && domCache.provinceSelect.value && domCache.provinceSelect.value !== "") {
        activeProvince = domCache.provinceSelect.value;
      }
      if (activeProvince === "chiang_mai") activeProvince = "chiangmai";

      const currentCriteria = {
        text: (domCache.searchInput?.value || "").trim(),
        province: activeProvince,
        avail: domCache.availabilitySelect?.value || "all",
        featured: domCache.featuredSelect?.value === "true",
        sort: domCache.sortSelect?.value || "featured"
      };

      let results = [...appState.allProfiles];

      if (activeProvince !== "all" && activeProvince !== "national") {
        const cleanActive = activeProvince.toLowerCase().replace(/[-_]/g, "");
        results = results.filter(p => {
          const cleanK = (p.provinceKey || p.province_slug || p.province || "").toString().toLowerCase().replace(/[-_]/g, "");
          return cleanK === cleanActive;
        });
      }

      if (appState.activePillTag && appState.activePillTag !== "all") {
        const filterTag = appState.activePillTag.toLowerCase().trim();
        results = results.filter(p => {
          const tagStr = (Array.isArray(p.styleTags) ? p.styleTags.join(" ") : (p.styleTags || "")).toLowerCase();
          const descStr = (p.description || "").toLowerCase();
          const sloganStr = (p.slogan || p.quote || "").toLowerCase();
          const locStr = (p.location || "").toLowerCase();
          const combined = `${tagStr} ${descStr} ${sloganStr} ${locStr}`;

          if (filterTag === "ตรงปก") return p.isVerified || combined.includes("ตรงปก");
          return combined.includes(filterTag);
        });
      }

      if (currentCriteria.text) {
        const cleanQuery = currentCriteria.text.toLowerCase().trim();
        let baseQuery = cleanQuery.replace(/^(น้อง|สาว|พี่|รับงาน|ไซด์ไลน์|ย่าน|โซน)\s*/gi, "").trim();
        if (!baseQuery) baseQuery = cleanQuery;
        const keywords = baseQuery.split(/\s+/).filter(Boolean);

        results = results.filter(p => {
          const name = (p.displayName || p.name || "").toLowerCase();
          const cleanName = name.replace(/^(น้อง\s?)+/gi, "").trim();
          const loc = (p.location || "").toLowerCase();
          const pName = (p.provinceNameThai || "").toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const slogan = (p.slogan || p.quote || "").toLowerCase();
          const tags = Array.isArray(p.styleTags) ? p.styleTags.join(" ").toLowerCase() : (p.styleTags || "").toLowerCase();
          const idStr = String(p.id || "");
          const ageStr = String(p.safeAge || p.age || "");
          const priceStr = String(p._price || p.rate || "");

          return keywords.every(k => (
            idStr === k ||
            name.includes(k) ||
            cleanName.includes(k) ||
            loc.includes(k) ||
            pName.includes(k) ||
            desc.includes(k) ||
            slogan.includes(k) ||
            tags.includes(k) ||
            ageStr === k ||
            priceStr.includes(k)
          ));
        });

        results.sort((a, b) => {
          const nameA = (a.displayName || a.name || "").toLowerCase().replace(/^(น้อง\s?)+/gi, "").trim();
          const nameB = (b.displayName || b.name || "").toLowerCase().replace(/^(น้อง\s?)+/gi, "").trim();
          return nameA === baseQuery || String(a.id) === cleanQuery ? -1 : nameB === baseQuery || String(b.id) === cleanQuery ? 1 : nameA.startsWith(baseQuery) ? -1 : nameB.startsWith(baseQuery) ? 1 : 0;
        });
      }

      if (currentCriteria.avail && currentCriteria.avail !== "all") {
        results = results.filter(p => p.availability === currentCriteria.avail);
      }

      if (currentCriteria.featured) {
        results = results.filter(p => p.isfeatured === true);
      }

      if (!currentCriteria.text) {
        results.sort((a, b) => {
          switch (currentCriteria.sort) {
            case "featured":
              return (b.isfeatured ? 1 : 0) - (a.isfeatured ? 1 : 0) || (a.name || "").localeCompare(b.name || "");
            case "name_asc":
              return (a.name || "").localeCompare(b.name || "");
            case "name_desc":
              return (b.name || "").localeCompare(a.name || "");
            case "rating":
              return (b.rating || 0) - (a.rating || 0);
            default:
              return 0;
          }
        });
      }

     const isAllOrNational = activeProvince === "all" || activeProvince === "national";
      const resolvedSlug = isAllOrNational ? "national" : activeProvince;
      const provinceDisplayName = isEN 
        ? (PROVINCE_EN_MAP[resolvedSlug] || "Thailand") 
        : (isAllOrNational ? "ทั่วไทย" : appState.provincesMap.get(resolvedSlug) || "ทั่วไทย");

      renderDisplayArea(results, activeProvince !== "all" || Boolean(currentCriteria.text) || appState.activePillTag !== "all");
      appState.currentFilters = currentCriteria;
      appState.filteredProfiles = results;
      replaceDomPlaceholders(provinceDisplayName, results.length, activeProvince);
    } catch (err) {
      console.error("Filter error:", err);
    }
  }

  // 🟢 ดักจับคลิกโลโก้: กดแล้วรีเฟรชหน้าแรก หรือกลับหน้าแรกทันที 100% (ทำงานทุกอุปกรณ์)
  if (!window.__logoClickRegistered) {
    window.__logoClickRegistered = true;
    document.addEventListener('click', (e) => {
      const logoEl = e.target.closest('.brand-luxe-logo');
      if (!logoEl) return;

      if (typeof triggerHaptic === 'function') triggerHaptic('light');

      if (typeof window.closeLightboxModal === 'function') {
        window.closeLightboxModal(false);
      }

      const isHome = (window.location.pathname === '/' || window.location.pathname === '') && !window.location.search;
      if (isHome) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.location.reload(); // บังคับรีเฟรชหน้าเว็บทันที
      } else {
        e.preventDefault();
        window.location.href = '/'; // พากลับหน้าแรก
      }
    }, { capture: true });
  }

  async function renderDisplayArea(profiles, isFilteredOrLocationView) {
    if (!domCache.profilesDisplayArea) return;

    appState.renderId = (appState.renderId || 0) + 1;
    const activeRenderId = appState.renderId;

    domCache.noResultsMessage?.classList.add("hidden");
    domCache.fetchErrorMessage?.classList.add("hidden");

    if (domCache.featuredSection) {
      const isHomeView = !isFilteredOrLocationView && !window.location.pathname.includes("/location/") && !window.location.pathname.includes("/province/") && (!appState.activePillTag || appState.activePillTag === "all");
      const featuredList = appState.allProfiles.filter(p => p.isfeatured).slice(0, 8);
      const hasFeatured = featuredList.length > 0;
      
      domCache.featuredSection.classList.toggle("hidden", !isHomeView || !hasFeatured);
      if (isHomeView && hasFeatured && domCache.featuredContainer) {
        await renderProfilesBatch(domCache.featuredContainer, featuredList, activeRenderId);
      }
    }

    if (!profiles || profiles.length === 0) {
      domCache.profilesDisplayArea.innerHTML = "";
      domCache.noResultsMessage?.classList.remove("hidden");
      return;
    }

    const isExplicitLocationPath = window.location.pathname.includes("/location/") || window.location.pathname.includes("/province/");

    if (isFilteredOrLocationView || isExplicitLocationPath || (appState.activePillTag && appState.activePillTag !== "all")) {
      const routeMatch = window.location.pathname.match(/^\/(?:location|province)\/([^/]+)/);
      const currentLocSlug = routeMatch ? decodeURIComponent(routeMatch[1]).toLowerCase() : domCache.provinceSelect?.value || "chiangmai";
      const provinceLabel = isEN ? (PROVINCE_EN_MAP[currentLocSlug] || currentLocSlug) : (appState.provincesMap.get(currentLocSlug) || "เชียงใหม่");
      const searchKeyword = domCache.searchInput?.value?.trim();
      
      let sectionTitle = isEN ? `📍 Models in <span class="province-name-highlight">${escapeHTML(provinceLabel)}</span>` : `📍 น้องๆ ในจังหวัด <span class="province-name-highlight">${escapeHTML(provinceLabel)}</span>`;
      
      if (searchKeyword) {
        sectionTitle = isEN ? `🔍 Results for "${escapeHTML(searchKeyword)}"` : `🔍 ผลการค้นหา "${escapeHTML(searchKeyword)}"`;
      } else if (appState.activePillTag && appState.activePillTag !== "all") {
        sectionTitle = `✨ หมวดหมู่: <span class="province-name-highlight">#${escapeHTML(appState.activePillTag)}</span>`;
      }

    const countBadgeText = `${profiles.length} โปรไฟล์`;
      const wrapper = document.createElement("div");
      wrapper.className = "section-content-wrapper";
      wrapper.style.cssText = "margin-top: 24px; margin-bottom: 14px; width: 100%; box-sizing: border-box;";
      wrapper.innerHTML = `
        <div class="province-header-row">
            <h2 class="province-clean-title">
                ${sectionTitle}
            </h2>
            <span class="province-count-pill">
                <span class="pulse-dot-el"></span>
                <span>${countBadgeText}</span>
            </span>
        </div>
        <div class="profile-grid profiles-grid-row"></div>
      `;

      domCache.profilesDisplayArea.innerHTML = "";
      domCache.profilesDisplayArea.appendChild(wrapper);
      const gridContainer = wrapper.querySelector(".profile-grid");
      await renderProfilesBatch(gridContainer, profiles, activeRenderId);
    } else {
      const groupedByProvince = profiles.reduce((acc, p) => {
        const k = p.provinceKey || "no_province";
        acc[k] = acc[k] || [];
        acc[k].push(p);
        return acc;
      }, {});

      const sortedProvinceKeys = Object.keys(groupedByProvince).sort((a, b) => {
        const nameA = String(appState.provincesMap.get(a) || a || "");
        const nameB = String(appState.provincesMap.get(b) || b || "");
        return nameA.localeCompare(nameB, "th");
      });

      if (sortedProvinceKeys.length > 0) {
        domCache.profilesDisplayArea.innerHTML = "";
        for (const pKey of sortedProvinceKeys) {
          if (appState.renderId !== activeRenderId) return;
          const provName = isEN ? (PROVINCE_EN_MAP[pKey] || pKey) : (appState.provincesMap.get(pKey) || pKey);
          const sectionEl = createProvinceSectionDOM(pKey, provName, groupedByProvince[pKey]);
          domCache.profilesDisplayArea.appendChild(sectionEl);
          const gridEl = sectionEl.querySelector(".profile-grid");
          await renderProfilesBatch(gridEl, groupedByProvince[pKey], activeRenderId);
        }
      } else {
        domCache.profilesDisplayArea.innerHTML = "";
        domCache.noResultsMessage?.classList.remove("hidden");
      }
    }
  }

  function replaceDomPlaceholders(provinceName, count, currentSlug) {
    const totalCount = typeof count === "number" ? count : appState.filteredProfiles?.length ?? appState.allProfiles?.length ?? 0;
    const isAllOrNational = !currentSlug || currentSlug === "national" || currentSlug === "all";
    const targetName = isAllOrNational ? "ทั่วไทย" : (provinceName || "ทั่วไทย");

    const liveCounterEl = document.getElementById("live-profile-count");
    if (liveCounterEl) {
      liveCounterEl.textContent = `${totalCount}`;
    }

    const liveProvinceEl = document.getElementById("live-province-count");
    if (liveProvinceEl) {
      const totalProvincesCount = appState.provincesMap.size || (window.provincesData ? window.provincesData.length : 0);
      liveProvinceEl.textContent = isAllOrNational ? `${totalProvincesCount}` : "1";
    }

   // ✅ โค้ดแก้ไขใน main.js ให้ตรงกับ SSR
const heroH1 = document.getElementById("hero-h1");
if (heroH1) {
  if (isEN) {
    const enLocName = isAllOrNational ? "Thailand" : (PROVINCE_EN_MAP[currentSlug] || currentSlug);
    heroH1.innerHTML = `
      <span class="h1-line-1">${escapeHTML(enLocName)} Escorts & VIP Companions</span>
      <span class="h1-line-2">100% Real Photos • Pay on Arrival</span>
    `;
  } else {
    const line1 = isAllOrNational 
      ? "เพื่อนเที่ยว & ไซด์ไลน์ทั่วไทย" 
      : `เพื่อนเที่ยว & ไซด์ไลน์${escapeHTML(targetName)}`;
    const line2 = "สาวสวยสไตล์ฟิวแฟน ตรงปก 100%";

    heroH1.innerHTML = `
      <span class="h1-line-1">${line1}</span>
      <span class="h1-line-2">${line2}</span>
    `;
  }
}

    const featuredH2 = document.getElementById("featured-heading");
    if (featuredH2) {
      if (isEN) {
        const enLocName = isAllOrNational ? "Thailand" : (PROVINCE_EN_MAP[currentSlug] || currentSlug);
        featuredH2.innerHTML = `Featured Companions in <span class="province-name-highlight">${escapeHTML(enLocName)}</span>`;
      } else {
        featuredH2.innerHTML = `น้องๆ รับงาน <span class="province-name-highlight">ไซด์ไลน์${escapeHTML(targetName)}</span>`;
      }
    }

    const mapIframe = document.getElementById("google-map");
    if (mapIframe) {
      const zoom = isAllOrNational ? 6 : 12;
      let query = "";
      if (isEN) {
        const enLocName = isAllOrNational ? "Thailand" : (PROVINCE_EN_MAP[currentSlug] || "Thailand");
        query = encodeURIComponent(enLocName);
      } else {
        query = isAllOrNational ? encodeURIComponent("ประเทศไทย") : encodeURIComponent(`จังหวัด${targetName}`);
      }
      
      const newMapSrc = `https://maps.google.com/maps?q=${query}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
      if (mapIframe.src !== newMapSrc) {
        mapIframe.src = newMapSrc;
      }
    }

    if (isEN) return;

    try {
      const resolvedKey = isAllOrNational ? "national" : currentSlug;
      const seoData = SEO_PROVINCES_DATA[resolvedKey] || SEO_PROVINCES_DATA.national || {};

      const seoDrawerInner = document.querySelector("#seo-drawer-wrapper .seo-content-inner");
      if (seoDrawerInner && (!seoDrawerInner.innerHTML || seoDrawerInner.innerHTML.trim() === "")) {
        if (seoData.seoContent) seoDrawerInner.innerHTML = seoData.seoContent;
      }
    } catch (err) {
      console.error("replaceDomPlaceholders error:", err);
    }
  }

  function showSearchSuggestions(inputVal) {
    const popover = document.getElementById("search-suggestions");
    const clearBtn = document.getElementById("clear-search-btn");

    if (clearBtn) clearBtn.style.display = inputVal ? "block" : "none";
    if (!popover) return;

    const query = (inputVal || "").toLowerCase().trim();

    if (!query) {
      const activeProvince = domCache.provinceSelect?.value || window.currentProvinceSlug || "chiangmai";
      const configObj = SEO_PROVINCES_DATA[activeProvince] || SEO_PROVINCES_DATA.national;
      const topZones = configObj && configObj.zones ? configObj.zones.filter(z => z !== "ทั้งหมด").slice(0, 4) : ["ตัวเมือง"];

      const labelTopSearch = isEN ? "Popular Searches:" : "คำค้นหายอดนิยม:";
      const labelGFE = isEN ? "❤️ #GFE" : "❤️ #ฟิวแฟน";

      let html = '<div style="background-color: #FFFFFF; border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; padding: 14px; box-shadow: 0 10px 30px rgba(20, 10, 40, 0.08);">';
      html += `<div style="font-size: 11.5px; font-weight: 800; color: #7C3AED; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;"><i class="fas fa-lightbulb" style="color: #D97706;"></i> ${labelTopSearch}</div>`;
      html += '<div style="display: flex; flex-wrap: wrap; gap: 6px;">';
      html += `<span data-action="suggestion" data-slug="${isEN ? "GFE" : "ฟิวแฟน"}" data-is-profile="false" style="background: #FFE4E6; border: 1px solid rgba(225, 29, 72, 0.2); color: #E11D48; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">${labelGFE}</span>`;
      html += '<span data-action="suggestion" data-slug="1500" data-is-profile="false" style="background: rgba(5, 150, 105, 0.08); border: 1px solid rgba(5, 150, 105, 0.2); color: #059669; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">💰 1,500.-</span>';

      topZones.forEach(z => {
        html += `<span data-action="suggestion" data-slug="${z}" data-is-profile="false" style="background: #EFE9F8; border: 1px solid rgba(0,0,0,0.06); color: #362E47; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; cursor: pointer;">📍 ${z}</span>`;
      });

      html += "</div></div>";
      popover.innerHTML = html;
      popover.style.display = "block";
      return;
    }

    const matchedProvinces = Array.from(appState.provincesMap.entries())
      .filter(([k, nameThai]) => nameThai.toLowerCase().includes(query) || k.toLowerCase().includes(query))
      .slice(0, 2);

    const cleanKeyword = query.replace(/^(น้อง\s?)+/gi, "").trim();
    const matchedProfiles = appState.allProfiles.filter(p => {
      const name = (p.displayName || p.name || "").toLowerCase().replace(/^(น้อง\s?)+/gi, "").trim();
      const loc = (p.location || "").toLowerCase();
      const idStr = String(p.id || "");
      return name.includes(cleanKeyword) || loc.includes(query) || idStr === query;
    }).slice(0, 4);

    if (matchedProvinces.length === 0 && matchedProfiles.length === 0) {
      popover.style.display = "none";
      return;
    }

    let popoverHtml = '<div style="background-color: #FFFFFF; border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(20, 10, 40, 0.08);">';

    if (matchedProvinces.length > 0) {
      popoverHtml += `<div style="padding: 7px 12px; background: #EDE9FE; font-size: 11px; font-weight: 800; color: #7C3AED;">${isEN ? "🗺️ Browse Province" : "🗺️ ไปที่หน้าจังหวัด"}</div>`;
      matchedProvinces.forEach(([k, nameThai]) => {
        const provTitle = isEN ? (PROVINCE_EN_MAP[k] || nameThai) : `ไซด์ไลน์${nameThai}`;
        popoverHtml += `
          <div onclick="window.location.href='/location/${k}'" style="padding: 10px 14px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); color: #0D081B; font-size: 13px; font-weight: 700; transition: background 0.2s;" onmouseover="this.style.background='#EFE9F8'" onmouseout="this.style.background='transparent'">
            <span>📍 ${provTitle}</span>
            <i class="fas fa-arrow-right" style="color: #7C3AED; font-size: 12px;"></i>
          </div>
        `;
      });
    }

    if (matchedProfiles.length > 0) {
      popoverHtml += `<div style="padding: 7px 12px; background: #EDE9FE; font-size: 11px; font-weight: 800; color: #7C3AED;">${isEN ? "✨ Featured Companions" : "✨ โปรไฟล์แนะนำ"}</div>`;
      matchedProfiles.forEach(p => {
        const avatar = p.images && p.images[0] ? p.images[0].src : DEFAULT_FALLBACK_IMG;
        popoverHtml += `
          <div class="suggestion-item" data-action="suggestion" data-slug="${encodeURIComponent(p.slug || p.id)}" data-is-profile="true" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0,0,0,0.04); transition: background 0.2s;" onmouseover="this.style.background='#EFE9F8'" onmouseout="this.style.background='transparent'">
              <img src="${avatar}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(124,58,237,0.15);">
              <div style="flex: 1; min-width: 0; text-align: left;">
                  <div style="font-size: 13px; font-weight: 800; color: #0D081B;">${p.displayName || p.name}</div>
                  <div style="font-size: 11px; color: #716486;">📍 ${p.location || p.provinceNameThai}</div>
              </div>
              <span style="color: #059669; font-weight: 800; font-size: 13px;">${p.displayPrice}</span>
          </div>
        `;
      });
    }

    popoverHtml += "</div>";
    popover.innerHTML = popoverHtml;
    popover.style.display = "block";
  }

 function createProfileCardDOM(p, index = 20) {
    const container = document.createElement("div");
    container.className = "profile-card-new-container";

    const article = document.createElement("article");
    article.className = "profile-card-new interactive-card";
    article.setAttribute("data-profile-id", p.id);
    article.setAttribute("data-profile-slug", p.slug || p.id);

    const rawImg = p.imagePath || p.image_url || p.imageUrl || (p.images && p.images[0] ? p.images[0].src : "") || DEFAULT_FALLBACK_IMG;
    const imgSrc = optimizeImg(rawImg, 400, 560);
    
    const pKey = (p.provinceKey || p.province_slug || "national").toString().toLowerCase();
    let rawName = p.displayName || p.name || "Model";
    const modelName = isEN ? (p.name_en || rawName.replace(/^(น้อง|สาว|พี่)\s?/gi, "").trim()) : formatDisplayName(rawName);
    
    const ageVal = p.safeAge || p.age;
    const ageDisplay = ageVal && String(ageVal).trim() !== "-" && String(ageVal).trim() !== "0" 
      ? (isEN ? `${String(ageVal).replace(/\D/g, "")} yrs` : `${String(ageVal).replace(/\D/g, "")} ปี`) 
      : "";
    
    let rawLoc = String(isEN ? (PROVINCE_EN_MAP[pKey] || p.location || "Thailand") : (p.location || p.provinceNameThai || "ทั่วไทย"));
    let locName = rawLoc
      .replace(/^(ในตัวเมือง|ตัวเมือง|โซน|ย่าน)\s*(\/|และ)?\s*/gi, "")
      .split(/[,/]|และใกล้/)[0]
      .trim();
    if (!locName) locName = rawLoc;

    const isOnline = p.isAvailable !== undefined 
      ? Boolean(p.isAvailable) 
      : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "busy", "off"].some(s => String(p.availability || p.status || "").toLowerCase().includes(s));
      
    const statusClass = isOnline ? "status-online" : "status-busy";
    const availText = isEN ? (isOnline ? "Available" : "Inquire") : (isOnline ? "รับงาน" : "สอบถาม");
    const luxuryPrice = formatLuxuryRate(p.rate || p._price || p.price);
    const profileSlug = encodeURIComponent(p.slug || p.id);

    const rawTags = Array.isArray(p.styleTags) ? p.styleTags : (Array.isArray(p.style_tags) ? p.style_tags : []);
    const cleanTags = rawTags
      .map(t => String(t).replace(/^#/, "").trim())
      .filter(t => t && !t.includes("รับงาน") && !t.includes("ไซด์ไลน์") && t.length <= 8)
      .map(t => {
        if (!isEN) return t;
        const tagMap = {
          "ตรงปก": "Verified", "น่ารัก": "Cute", "ผิวขาว": "Fair", "ตัวเล็ก": "Petite",
          "ฟิวแฟน": "GFE", "ฟิลแฟน": "GFE", "เอาใจเก่ง": "Caring", "คุยสนุก": "Friendly",
          "สายฝอ": "Exotic", "อวบ": "Curvy", "ไม่เร่งรีบ": "Relaxed"
        };
        return tagMap[t] || t;
      });

    const defaultTag = isEN ? "#GFE" : "#ฟิวแฟน";
    const vibeTagsHtml = cleanTags.length > 0
      ? cleanTags.slice(0, 2).map(t => `<span class="card-vibe-pill">#${escapeHTML(t)}</span>`).join("")
      : `<span class="card-vibe-pill">${defaultTag}</span>`;

    const isFiwFan = rawTags.some(t => {
      const cleanTag = String(t).replace(/^#/, "").trim().toLowerCase();
      return cleanTag === "ฟิวแฟน" || cleanTag === "ฟิลแฟน" || cleanTag === "gfe" || cleanTag.includes("ฟิวแฟน");
    });

    let rightBadgeHtml = isFiwFan
      ? `<span class="badge-hot-tag"><span aria-hidden="true">🔥</span> HOT</span>` 
      : `<span class="badge-verified-top"><span aria-hidden="true">✦</span> ${isEN ? "Verified" : "ตรงปก"}</span>`;

    const viewProfileAria = isEN ? `View profile of ${modelName}` : `ดูโปรไฟล์ ${modelName}`;
    
    // 🟢 ประกาศตัวแปร richAltText ให้ถูกต้องตรงนี้ (แก้ ReferenceError 100%)
    const richAltText = `${modelName} สาวรับงาน${p.provinceNameThai || ''} ย่าน${locName} สไตล์ฟิวแฟน ตรงปก 100% - FirstModelHub`;

    article.innerHTML = `
      <img src="${imgSrc}" 
           alt="${escapeHTML(richAltText)}"
           width="400"
           height="560"
           class="profile-card-img"
           loading="${index < 4 ? "eager" : "lazy"}"
           fetchpriority="${index === 0 ? "high" : "auto"}"
           decoding="async"
           onerror="this.onerror=null; this.src='${DEFAULT_FALLBACK_IMG}';" />
           
      <div class="profile-card-gradient-overlay"></div>

      <div class="profile-card-badges-top">
          <div class="badges-left">
              <span class="badge-status ${statusClass}">
                  <span class="status-dot"></span>
                  <span>${availText}</span>
              </span>
          </div>
          <div class="badges-right">
              ${rightBadgeHtml}
          </div>
      </div>
      
      <a href="/sideline/${profileSlug}" class="card-link" aria-label="${escapeHTML(viewProfileAria)}"></a>

      <div class="profile-card-info-content">
          <div class="profile-card-tags-row">
              ${vibeTagsHtml}
          </div>
          <div class="profile-card-title-row">
              <h3 class="profile-card-name">${escapeHTML(modelName)}</h3>
              ${ageDisplay ? `<span class="profile-card-age-tag">${ageDisplay}</span>` : ""}
          </div>
          <div class="profile-card-bottom-row">
              <span class="profile-card-location" title="${escapeHTML(rawLoc)}">
                  <i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${escapeHTML(locName)}
              </span>
              <span class="profile-card-price">${luxuryPrice}</span>
          </div>
      </div>
    `;

    container.appendChild(article);
    return container;
  }

  async function renderProfilesBatch(containerEl, profilesList, renderId) {
    if (!containerEl || !profilesList) return;
    containerEl.dataset.activeRenderId = renderId;
    containerEl.innerHTML = "";

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < profilesList.length; i++) {
      if (renderId !== undefined && Number(containerEl.dataset.activeRenderId) !== renderId) return;
      const cardEl = createProfileCardDOM(profilesList[i], i);
      fragment.appendChild(cardEl);
    }
    containerEl.appendChild(fragment);
  }

  function createProvinceSectionDOM(provinceKey, provinceName, profilesList) {
    const wrapper = document.createElement("div");
    wrapper.className = "section-content-wrapper province-section";
    wrapper.id = `province-${provinceKey}`;
    wrapper.style.cssText = "margin-top: 36px; margin-bottom: 16px; width: 100%; box-sizing: border-box;";
    
    const displayTitle = isEN ? (PROVINCE_EN_MAP[provinceKey] || provinceName) : provinceName;
    const badgeText = `${profilesList.length} โปรไฟล์`;
    const headerPrefix = isEN ? `Models in` : `น้องๆ ในจังหวัด`;

    wrapper.innerHTML = `
      <div class="province-header-row">
          <a href="/location/${provinceKey}" class="province-title-link">
              <h2 class="province-clean-title">
                  <span class="province-pin-icon"><i class="fas fa-map-marker-alt" aria-hidden="true"></i></span>
                  <span class="province-prefix">${headerPrefix}</span>
                  <span class="province-name-highlight">${escapeHTML(displayTitle)}</span>
              </h2>
          </a>
          <a href="/location/${provinceKey}" class="province-count-pill">
              <span class="pulse-dot-el"></span>
              <span>${badgeText}</span>
              <i class="fas fa-chevron-right arrow-mini" aria-hidden="true"></i>
          </a>
      </div>
      <div class="profile-grid profiles-grid-row"></div>
    `;
    return wrapper;
  }

// 🟢 ฟังก์ชัน Lightbox ที่ถูกต้องและสมบูรณ์ 100% (รองรับปัดซ้าย-ขวาดูรูป + ปัดลงปิดหน้าต่าง)
  let currentActivePhotoIdx = 0;
  let currentActivePhotoList = [];

  // ฟังก์ชันเปลี่ยนรูปภาพใหญ่พร้อมแอนิเมชันและปรับจุดไข่ปลา
  function updateLightboxPhoto(idx) {
    if (!currentActivePhotoList || currentActivePhotoList.length <= 1) return;

    // วนลูปรูปภาพ (ถ้าปัดเกินให้วนกลับมาหน้าแรก/หลังสุด)
    if (idx < 0) idx = currentActivePhotoList.length - 1;
    if (idx >= currentActivePhotoList.length) idx = 0;

    currentActivePhotoIdx = idx;
    const heroImg = document.getElementById("lightboxHeroImage");
    if (!heroImg) return;

    if (typeof triggerHaptic === "function") triggerHaptic("light");

    heroImg.style.opacity = "0.25";
    heroImg.style.transform = "scale(0.98)";
    setTimeout(() => {
      heroImg.src = currentActivePhotoList[idx].fullSrc || currentActivePhotoList[idx].src || DEFAULT_FALLBACK_IMG;
      heroImg.style.opacity = "1";
      heroImg.style.transform = "scale(1)";
    }, 110);

    // ปรับสถานะ Active บนแถบ Thumbnail
    const thumbStrip = document.getElementById("lightboxThumbnailStrip");
    if (thumbStrip) {
      thumbStrip.querySelectorAll(".lightbox-thumb-item").forEach((t, i) => {
        t.classList.toggle("active", i === idx);
        if (i === idx) {
          t.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      });
    }

    // ปรับสถานะจุดไข่ปลา (Dots Indicator)
    const dotsContainer = document.getElementById("lightbox-dots-indicator");
    if (dotsContainer) {
      dotsContainer.querySelectorAll(".gallery-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === idx);
      });
    }
  }

  // ระบบตรวจจับการปัดรูปซ้าย-ขวาบนภาพใหญ่
  function initLightboxImageSwipe() {
    const heroContainer = document.querySelector(".lightbox-hero-container");
    if (!heroContainer || heroContainer.dataset.swipeBound === "true") return;
    heroContainer.dataset.swipeBound = "true";

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    heroContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchEndX = touchStartX;
      touchEndY = touchStartY;
    }, { passive: true });

    heroContainer.addEventListener("touchmove", (e) => {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    }, { passive: true });

    heroContainer.addEventListener("touchend", () => {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // 🔒 ตรวจสอบว่าเป็นการปัดแนวนอนชัดเจน (แกน X ต้องเคลื่อนที่มากกว่าแกน Y 1.3 เท่า และระยะเกิน 38px)
      if (Math.abs(diffX) > 38 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
        if (diffX < 0) {
          updateLightboxPhoto(currentActivePhotoIdx + 1); // ปัดซ้าย -> รูปถัดไป
        } else {
          updateLightboxPhoto(currentActivePhotoIdx - 1); // ปัดขวา -> รูปก่อนหน้า
        }
      }
    }, { passive: true });
  }

// ==============================================================================
  // 💎 LUXURY LIGHTBOX MODAL (เวอร์ชันใหม่ คมชัดระดับ Retina + ปุ่มกระชับมืออาชีพ)
  // ==============================================================================
  window.openLightboxModal = function (profile) {
    if (!profile) return;
    const lightboxEl = document.getElementById("lightbox");
    const contentWrapperEl = document.getElementById("lightbox-content-wrapper-el");
    if (!lightboxEl) return;

    const fallbackImg = (typeof DEFAULT_FALLBACK_IMG !== "undefined") 
      ? DEFAULT_FALLBACK_IMG 
      : "https://firstmodelhub.com/images/firstmodelhub.webp";

    const isEn = document.documentElement.lang === "en" || window.location.pathname.includes("-en");
    const cleanName = (profile.name || "สาวสวย").replace(/^(น้อง\s?)+/gi, "").trim();
    const displayName = isEn ? cleanName : `น้อง${cleanName}`;
    const pProvinceThai = profile.provinceThai || profile.provinceNameThai || "เชียงใหม่";
    const pLocation = profile.location || pProvinceThai;
    const primaryZone = pLocation.replace(/^(ในตัวเมือง|ตัวเมือง|โซน|ย่าน)\s*(\/|และ)?\s*/gi, "").split(/[,/]|และใกล้/)[0].trim() || pProvinceThai;
    const profileSlug = encodeURIComponent(profile.slug || profile.id);
    const canonicalProfileUrl = `https://firstmodelhub.com/sideline/${profileSlug}`;

    // 🟢 1. SEO & Meta
    const dynamicTitle = isEn
      ? `${displayName} - VIP Companion in ${pProvinceThai} | FirstModelHub`
      : `${displayName} เพื่อนเที่ยวฟิวแฟน${pProvinceThai} ย่าน${primaryZone} ตัวจริงตรงปก จ่ายหน้างาน | FirstModelHub`;
    document.title = dynamicTitle;

    const canonicalLink = document.getElementById("canonical-link") || document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.href = canonicalProfileUrl;

    const isAvail = profile.isAvailable !== undefined
      ? Boolean(profile.isAvailable)
      : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "busy", "off"].some(s => String(profile.availability || "").toLowerCase().includes(s));
    
    const availStatus = isAvail ? "รับงาน" : "สอบถามคิว";

    // 🟢 2. ชื่อ และ ป้ายสถานะ
    const nameMainEl = document.getElementById("lightbox-profile-name-main");
    if (nameMainEl) {
      nameMainEl.innerHTML = `
        <span class="lb-main-title">${displayName}</span>
        ${profile.isVerified ? '<span class="lb-verified-badge"><i class="fas fa-check-circle"></i> ตรงปก 100%</span>' : ""}
      `;
    }

    const availBadgeWrapper = document.getElementById("lightbox-availability-badge-wrapper");
    if (availBadgeWrapper) {
      availBadgeWrapper.innerHTML = `
        <div class="lb-status-pill ${isAvail ? "online" : "busy"}">
            <span class="lb-pulse-dot"></span>
            <span>${availStatus}</span>
        </div>
      `;
    }

    // 🟢 3. รูปภาพใหญ่
    const images = Array.isArray(profile.images) && profile.images.length > 0
      ? profile.images
      : [{ src: fallbackImg, fullSrc: fallbackImg }];

    currentActivePhotoList = images;
    currentActivePhotoIdx = 0;

    const heroImg = document.getElementById("lightboxHeroImage");
    if (heroImg) {
      heroImg.src = images[0]?.fullSrc || images[0]?.src || fallbackImg;
      heroImg.alt = `${displayName} รูปถ่ายตัวจริงตรงปก 100%`;
      heroImg.style.opacity = "1";
    }

    const heroContainer = document.querySelector(".lightbox-hero-container");
    let dotsContainer = document.getElementById("lightbox-dots-indicator");
    if (heroContainer) {
      if (!dotsContainer) {
        dotsContainer = document.createElement("div");
        dotsContainer.id = "lightbox-dots-indicator";
        dotsContainer.className = "lightbox-dots-wrapper";
        heroContainer.appendChild(dotsContainer);
      }
      if (images.length > 1) {
        dotsContainer.style.display = "flex";
        dotsContainer.innerHTML = images.map((_, i) => `
          <span class="gallery-dot ${i === 0 ? "active" : ""}"></span>
        `).join("");
      } else {
        dotsContainer.style.display = "none";
      }
    }

    // 🟢 4. คำคม
    const quoteEl = document.getElementById("lightboxQuote");
    if (quoteEl) {
      quoteEl.innerHTML = `
        <div class="lb-quote-box">
          <i class="fas fa-heart lb-quote-icon"></i>
          <span>${profile.quote || profile.slogan || "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน ไม่เร่งเวลา"}</span>
        </div>
      `;
      quoteEl.style.display = "block";
    }

    // 🟢 5. แท็กสไตล์ Jewelry Pill
    const tagsEl = document.getElementById("lightboxTags");
    if (tagsEl) {
      tagsEl.innerHTML = "";
      const rawTagsList = Array.isArray(profile.styleTags) ? profile.styleTags : [];
      rawTagsList.forEach(tag => {
        const cleanTag = tag.replace(/^#/, "").trim();
        if (!cleanTag) return;
        const pill = document.createElement("span");
        pill.className = "lb-tag-jewel";
        pill.textContent = `#${cleanTag}`;
        tagsEl.appendChild(pill);
      });
    }

    // 🟢 6. สเปก 3 ช่อง (Bento) + แถบราคา
    const rawAge = profile.safeAgeDisplay || (profile.age ? `${profile.age} ปี` : "22 ปี");
    const rawStats = profile.safeStats || profile.stats || "มาตรฐาน";
    const rawHeight = profile.safeHeight || (profile.height ? `${profile.height} cm` : "162 cm");
    const displayPrice = profile.displayPrice || (profile.rate ? `${parseInt(profile.rate, 10).toLocaleString()}.-` : "1,500.-");

    const detailsCompactEl = document.getElementById("lightboxDetailsCompact");
    if (detailsCompactEl) {
      detailsCompactEl.innerHTML = `
        <div class="lb-bento-grid">
            <div class="lb-bento-card">
                <span class="lb-bento-label">อายุ</span>
                <strong class="lb-bento-val">${rawAge}</strong>
            </div>
            <div class="lb-bento-card highlight">
                <span class="lb-bento-label">สัดส่วน</span>
                <strong class="lb-bento-val">${rawStats}</strong>
            </div>
            <div class="lb-bento-card">
                <span class="lb-bento-label">ส่วนสูง</span>
                <strong class="lb-bento-val">${rawHeight}</strong>
            </div>
        </div>

        <div class="lb-ticket-strip">
            <div class="lb-ticket-item">
                <span class="lb-ticket-label"><i class="fas fa-tag"></i> ค่าดูแลเริ่มต้น</span>
                <span class="lb-ticket-price">${displayPrice}</span>
            </div>
            <div class="lb-ticket-divider"></div>
            <div class="lb-ticket-item">
                <span class="lb-ticket-label"><i class="fas fa-map-marker-alt"></i> พิกัดสแตนด์บาย</span>
                <span class="lb-ticket-location">${pLocation}</span>
            </div>
        </div>
      `;
    }

    // 🟢 7. กล่องข้อความดูแล (ปรับให้กระชับ ไม่โหวงเหวง)
    const descContainer = document.getElementById("lightboxDescriptionContainer");
    const descContent = document.getElementById("lightboxDescriptionContent");
    if (descContent) {
      const defaultDesc = `พร้อมดูแลเพื่อนเที่ยวสไตล์ฟิวแฟน สุภาพ เรียบร้อย เอาใจเก่ง ตรงปก 100% สอบถามคิวงานได้เลยค่ะ`;
      const rawDesc = (profile.description && profile.description.trim()) ? profile.description : defaultDesc;
      const safeText = (typeof escapeHTML === "function") ? escapeHTML(rawDesc) : rawDesc;
      
      descContent.innerHTML = `
        <div class="lb-bio-compact">
          <div class="lb-bio-title"><i class="fas fa-comment-dots"></i> ข้อความจากน้อง</div>
          <div class="lb-bio-text">${safeText.replace(/\n/g, "<br>")}</div>
        </div>
      `;
    }
    if (descContainer) descContainer.style.display = "block";

    // 🟢 8. ปุ่มแอดไลน์ขนาดกระชับ (Modern Sleek Pill - ไม่ใหญ่เทอะทะ)
    const rawLine = String(profile.lineId || profile.line_id || profile.line || "u8Bz9HsaY8").trim();
    let lineUrl = "https://line.me/ti/p/u8Bz9HsaY8";
    if (rawLine.startsWith("http://") || rawLine.startsWith("https://")) {
      lineUrl = rawLine;
    } else if (rawLine.startsWith("@")) {
      const cleanOA = rawLine.replace(/[^a-zA-Z0-9_\-\.@]/g, "").trim();
      lineUrl = `https://line.me/R/ti/p/${cleanOA}`;
    } else {
      const cleanHandle = rawLine.replace(/[^a-zA-Z0-9_\-\.]/g, "").trim();
      lineUrl = cleanHandle ? `https://line.me/ti/p/~${cleanHandle}` : "https://line.me/ti/p/u8Bz9HsaY8";
    }

    const lineWrapper = document.getElementById("line-btn-sticky-wrapper");
    if (lineWrapper) {
      lineWrapper.innerHTML = `
        <div class="lb-cta-container">
          <a href="${lineUrl}" target="_blank" rel="noopener nofollow" class="lb-compact-line-btn" onclick="window.handleLineBooking('${profile.id}', '${lineUrl}')">
              <i class="fab fa-line lb-btn-line-icon"></i>
              <span>ทักไลน์จองคิว ${displayName}</span>
              <i class="fas fa-arrow-right lb-btn-arrow"></i>
          </a>
          <span class="lb-cta-subtext"><i class="fas fa-shield-alt"></i> เจอตัวจริงตรวจสอบความตรงปกก่อนชำระเงิน • ไม่มีมัดจำ</span>
        </div>
      `;
    }

    const parseFn = window.parseRateToNumber || (typeof parseRateToNumber === "function" ? parseRateToNumber : ((r) => 1500));
    const rateNum = parseFn(profile._price || profile.rate || profile.price);

    // 🟢 9. ตารางเรทราคา 3 กล่องคมชัด
    const ratesGrid = document.getElementById("lightboxRatesGrid");
    if (ratesGrid) {
      ratesGrid.innerHTML = `
        <div class="lb-rate-box">
          <div class="lb-rate-duration">1 ชั่วโมง</div>
          <div class="lb-rate-tag">ชั่วคราว</div>
          <strong class="lb-rate-num">${rateNum.toLocaleString()}.-</strong>
        </div>
        <div class="lb-rate-box">
          <div class="lb-rate-duration">2 ชั่วโมง</div>
          <div class="lb-rate-tag">ฟิวแฟน</div>
          <strong class="lb-rate-num">${Math.floor(rateNum * 1.8).toLocaleString()}.-</strong>
        </div>
        <div class="lb-rate-box vip-best">
          <span class="lb-best-badge">ยอดนิยม</span>
          <div class="lb-rate-duration">ค้างคืน</div>
          <div class="lb-rate-tag">Overnight</div>
          <strong class="lb-rate-num">${Math.floor(rateNum * 4.5).toLocaleString()}.-</strong>
        </div>
      `;
    }

    // 🟢 10. คำถามพบบ่อย (FAQ)
    const faqTitle = document.getElementById("lightboxFaqTitle");
    if (faqTitle) faqTitle.innerHTML = `<i class="fas fa-question-circle" style="color: #7C3AED;"></i> คำถามพบบ่อยเกี่ยวกับ ${displayName}`;
    
    const faqList = document.getElementById("lightboxFaqList");
    if (faqList) {
      const ageNum = profile.safeAge && profile.safeAge !== "-" ? profile.safeAge : "22";
      const heightNum = profile.height && String(profile.height).trim() !== "-" ? String(profile.height).replace(/\D/g, "") : "162";

      faqList.innerHTML = `
        <div class="lb-faq-card">
          <div class="lb-faq-q"><span class="q-badge">Q</span> ${displayName} สัดส่วนและพิกัดบริการ?</div>
          <div class="lb-faq-a">อายุ ${ageNum} ปี สัดส่วน ${rawStats} สูง ${heightNum} ซม. สแตนด์บายดูแลในพื้นที่ <strong>${pLocation}</strong> ตรงปก 100% ค่ะ</div>
        </div>
        <div class="lb-faq-card">
          <div class="lb-faq-q"><span class="q-badge">Q</span> เงื่อนไขการจ่ายเงินและมัดจำ?</div>
          <div class="lb-faq-a">เรทเริ่มต้น <strong>${rateNum.toLocaleString()}.-</strong> นัดพบเจอน้องหน้างานแล้วจึงชำระเงิน <strong>ไม่มีการโอนมัดจำล่วงหน้าทุกกรณี</strong></div>
        </div>
      `;
    }

    // 🟢 11. รีวิว
    const reviewsList = document.getElementById("lightboxReviewsList");
    if (reviewsList) {
      const defaultReviews = [
        { name: "พี่บอล", text: "ฟิวแฟนของแท้เลยครับ น้องเทคแคร์ดีมาก ขี้อ้อน น่ารัก ตรงตามรูปในโปรไฟล์ทุกอย่าง" },
        { name: "คุณเอก", text: "ตัวจริงสวยตรงปกเลยครับ คุยสนุก เป็นกันเองมาก ปลอดภัยนัดเจอจ่ายหน้างานสบายใจสุดๆ" }
      ];
      const pool = (typeof REVIEW_POOL !== "undefined" && Array.isArray(REVIEW_POOL)) ? REVIEW_POOL : defaultReviews;
      const poolLen = pool.length;
      const seed = `${profile.id || ""}_${profile.slug || ""}_${profile.name || ""}`;
      const hash = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      
      const selectedReviews = [pool[hash % poolLen], pool[(hash + 2) % poolLen]];
      reviewsList.innerHTML = selectedReviews.map(r => `
        <div class="lb-review-card">
          <div class="lb-review-top">
            <strong class="lb-reviewer-name">${r.name}</strong>
            <span class="lb-review-stars">★★★★★</span>
          </div>
          <p class="lb-review-msg">"${r.text}"</p>
        </div>
      `).join("");
    }

    // 🟢 12. น้องๆ แนะนำเพิ่มเติม
    const allList = (typeof appState !== "undefined" && appState.allProfiles && appState.allProfiles.length > 0) 
      ? appState.allProfiles 
      : (window.profilesData || []);

    const relatedTitle = document.getElementById("lightboxRelatedTitle");
    if (relatedTitle) relatedTitle.innerHTML = `<i class="fas fa-user-friends" style="color: #7C3AED;"></i> น้องๆ แนะนำในโซน${pProvinceThai}`;
    
    const relatedGrid = document.getElementById("lightboxRelatedGrid");
    const relatedMore = document.getElementById("lightboxRelatedMoreLink");
    if (relatedGrid) {
      const pKey = (profile.provinceKey || "chiangmai").toLowerCase();

      let candidates = allList.filter(m => String(m.id) !== String(profile.id) && (m.provinceKey || "").toLowerCase() === pKey);
      if (candidates.length < 3) {
        const otherProvinces = allList.filter(m => String(m.id) !== String(profile.id) && !candidates.some(c => String(c.id) === String(m.id)));
        candidates = [...candidates, ...otherProvinces];
      }

      const shuffledList = [...candidates].sort(() => Math.random() - 0.5);
      const relatedList = shuffledList.slice(0, 3);

      if (relatedList.length > 0) {
        relatedGrid.innerHTML = relatedList.map(rm => {
          const rmName = rm.displayName || ((typeof formatDisplayName === "function") ? formatDisplayName(rm.name) : rm.name);
          const rmImg = rm.images && rm.images[0] ? (rm.images[0].src || rm.images[0]) : (rm.imagePath || fallbackImg);
          return `
            <div class="lb-related-card" data-profile-slug="${rm.slug || rm.id}">
              <div class="lb-related-img-wrap">
                <img src="${rmImg}" alt="${rmName}" loading="lazy">
              </div>
              <div class="lb-related-name">${rmName}</div>
            </div>
          `;
        }).join("");

        relatedGrid.querySelectorAll(".lb-related-card").forEach(card => {
          card.addEventListener("click", function(e) {
            e.preventDefault();
            const targetSlug = this.getAttribute("data-profile-slug");
            const targetProfile = allList.find(m => String(m.slug) === String(targetSlug) || String(m.id) === String(targetSlug));
            if (targetProfile) {
              history.pushState(null, "", `/sideline/${encodeURIComponent(targetProfile.slug || targetProfile.id)}`);
              const scrollBody = document.getElementById("lightboxScrollBody");
              if (scrollBody) scrollBody.scrollTop = 0;
              window.openLightboxModal(targetProfile);
            }
          });
        });
      }
    }

    if (relatedMore) {
      relatedMore.innerHTML = `
        <a href="/location/${profile.provinceKey || "chiangmai"}" class="lb-view-all-btn">
          ดูน้องๆ ทั้งหมดในโซนนี้ <i class="fas fa-arrow-right"></i>
        </a>
      `;
    }

    // 🟢 13. แสดงผล Modal
    if (typeof triggerHaptic === "function") triggerHaptic("medium");
    lightboxEl.style.display = "flex";
    lightboxEl.style.pointerEvents = "auto";
    lightboxEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    const scrollBodyEl = document.getElementById("lightboxScrollBody");
    if (scrollBodyEl) scrollBodyEl.scrollTop = 0;

    requestAnimationFrame(() => {
      lightboxEl.classList.add("active");
      lightboxEl.style.opacity = "1";
      if (contentWrapperEl) {
        contentWrapperEl.style.transform = "translateY(0) scale(1)";
        contentWrapperEl.style.opacity = "1";
      }
    });
  };
  // ==============================================================================
  // 🟢 ฟังก์ชันปิดหน้าต่างโปรไฟล์ LIGHTBOX (เวอร์ชันสมบูรณ์แบบสูงสุด 100% ไร้รอยต่อ)
  // ==============================================================================
  window.closeLightboxModal = function (updateHistory = true) {
    const lightboxEl = document.getElementById("lightbox");
    const contentWrapperEl = document.getElementById("lightbox-content-wrapper-el");
    if (!lightboxEl) return;

    // 🛡️ 1. ป้องกันการกดปิดซ้ำซ้อนขณะกำลังเล่นแอนิเมชัน (Debounce Guard)
    if (lightboxEl.dataset.isClosing === "true") return;
    lightboxEl.dataset.isClosing = "true";

    // 🛡️ 2. แอนิเมชันสไลด์ลงนุ่มนวล 60 FPS
    if (contentWrapperEl) {
      contentWrapperEl.style.transition = "transform 0.24s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease";
      contentWrapperEl.style.transform = "translateY(40px) scale(0.97)";
      contentWrapperEl.style.opacity = "0";
    }
    lightboxEl.style.transition = "opacity 0.24s ease";
    lightboxEl.style.opacity = "0";

    // 🛡️ 3. ปลดล็อกการเลื่อนหน้าเว็บทันที
    document.body.classList.remove("lightbox-open");
    document.body.style.overflow = "";

    // 🛡️ 4. ซ่อนองค์ประกอบเมื่อแอนิเมชันจบ พร้อมรีเซ็ต Scroll
    setTimeout(() => {
      lightboxEl.style.display = "none";
      lightboxEl.classList.remove("active");
      lightboxEl.style.pointerEvents = "none";
      lightboxEl.setAttribute("aria-hidden", "true");
      lightboxEl.dataset.isClosing = "false";

      const scrollBody = document.getElementById("lightboxScrollBody");
      if (scrollBody) scrollBody.scrollTop = 0;
    }, 240);

    // 🛡️ 5. จัดการ URL และคืนค่า SEO Meta Tags ทั้งหมดให้ตรงกับหน้าเดิม 100%
    if (updateHistory && (window.location.pathname.includes("/profile/") || window.location.pathname.includes("/sideline/"))) {
      const slug = window.currentProvinceSlug || (domCache.provinceSelect && domCache.provinceSelect.value) || "";
      const canonicalLink = document.getElementById("canonical-link") || document.querySelector('link[rel="canonical"]');
      const defaultHeroImg = (typeof DEFAULT_FALLBACK_IMG !== "undefined") ? DEFAULT_FALLBACK_IMG : "https://firstmodelhub.com/images/firstmodelhub.webp";

      let targetUrl = "";
      let targetTitle = "";
      let targetDesc = "";

      if (slug && slug !== "national" && slug !== "all") {
        targetUrl = `/location/${slug}`;
        const provName = appState.provincesMap.get(slug) || "เชียงใหม่";

        targetTitle = isEN 
          ? `${provName} Escorts & Companions | FirstModelHub` 
          : `เพื่อนเที่ยว${provName} ไซด์ไลน์ สาวสวยฟิวแฟนตรงปก จ่ายหน้างาน | FirstModelHub`;

        targetDesc = isEN
          ? `Verified escorts & companions in ${provName}. Romantic Girlfriend Experience, pay on arrival.`
          : `ศูนย์รวมเพื่อนเที่ยวและไซด์ไลน์${provName} สไตล์ฟิวแฟน (GFE) คัดสรรสาวสวยตรงปก 100% ปลอดภัยนัดพบจ่ายหน้างาน ปราศจากการโอนเงินมัดจำล่วงหน้าทุกกรณี`;

        if (domCache.provinceSelect) domCache.provinceSelect.value = slug;
      } else {
        targetUrl = isEN ? "/index-en" : "/";
        
        targetTitle = isEN 
          ? "Thailand Escorts & VIP Companions | FirstModelHub" 
          : "เพื่อนเที่ยว & ไซด์ไลน์ทั่วไทย สาวสวยฟิวแฟนตรงปก จ่ายหน้างาน | FirstModelHub";

        targetDesc = isEN
          ? "Premium VIP companions and escorts across Thailand. 100% real photos, pay on arrival."
          : "ศูนย์รวมเพื่อนเที่ยวและไซด์ไลน์ทั่วไทย สไตล์ฟิวแฟน (GFE) ครอบคลุมทุกจังหวัด การันตีตัวจริงตรงปก 100% ปลอดภัยนัดเจอจ่ายหน้างาน ไร้กังวลเรื่องโอนมัดจำล่วงหน้า";

        if (domCache.provinceSelect) domCache.provinceSelect.value = "";
      }

      // ⚡ สำคัญ: ใช้ replaceState แทน pushState เพื่อแก้ปัญหาปุ่ม Back วนลูป 100%
      history.replaceState(null, "", targetUrl);

      // 🟢 คืนค่า Title
      document.title = targetTitle;

      // 🟢 คืนค่า Canonical Link
      const fullCanonical = `https://firstmodelhub.com${targetUrl === "/" ? "" : targetUrl}`;
      if (canonicalLink) canonicalLink.href = fullCanonical;

      // 🟢 คืนค่า Meta Tags (Description และ OpenGraph) ป้องกันรูปและข้อมูลน้องค้าง
      const metaDescEl = document.querySelector('meta[name="description"]');
      if (metaDescEl) metaDescEl.setAttribute("content", targetDesc);

      const ogTitleEl = document.querySelector('meta[property="og:title"]');
      if (ogTitleEl) ogTitleEl.setAttribute("content", targetTitle);

      const ogDescEl = document.querySelector('meta[property="og:description"]');
      if (ogDescEl) ogDescEl.setAttribute("content", targetDesc);

      const ogUrlEl = document.querySelector('meta[property="og:url"]');
      if (ogUrlEl) ogUrlEl.setAttribute("content", fullCanonical);

      const ogImgEl = document.querySelector('meta[property="og:image"]');
      if (ogImgEl) ogImgEl.setAttribute("content", defaultHeroImg);
    }

    appState.currentProfileSlug = null;
  };

 // 🟢 ระบบ Swipe-to-Dismiss อัจฉริยะ (แก้ไขปีกกาปิดสมบูรณ์ 100%)
  function initLightboxSwipeDown() {
    const lightboxEl = document.getElementById("lightbox");
    const contentEl = document.getElementById("lightbox-content-wrapper-el");
    const dragBar = document.getElementById("lightbox-drag-bar");
    const scrollBody = document.getElementById("lightboxScrollBody");
    if (!lightboxEl || !contentEl) return;

    initLightboxImageSwipe();

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let isEligible = false;
    let isHorizontalGesture = false;

    const onTouchStart = (e) => {
      if (e.target.closest(".lightbox-hero-container") && !e.target.closest(".sheet-drag-pill-bar")) {
        isEligible = false;
        return;
      }

      const isFromDragBar = dragBar && dragBar.contains(e.target);
      const isTopHeader = e.target.closest(".lightbox-top-brand") || e.target.closest(".sheet-drag-pill-bar");
      const isAtTop = !scrollBody || scrollBody.scrollTop <= 0;

      if (isFromDragBar || isTopHeader || isAtTop) {
        isEligible = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentX = startX;
        currentY = startY;
        isHorizontalGesture = false;
      }
    };

    const onTouchMove = (e) => {
      if (!isEligible) return;

      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      const deltaX = Math.abs(currentX - startX);
      const deltaY = currentY - startY;

      if (deltaX > deltaY && deltaX > 15) {
        isHorizontalGesture = true;
      }

      if (isHorizontalGesture) {
        if (isDragging) {
          contentEl.style.transform = "translateY(0)";
          isDragging = false;
        }
        return;
      }

      if (deltaY > 0 && deltaY > deltaX && (!scrollBody || scrollBody.scrollTop <= 0)) {
        if (e.cancelable) e.preventDefault();
        isDragging = true;
        contentEl.style.transition = "none";
        const resistanceY = Math.pow(deltaY, 0.92);
        contentEl.style.transform = `translateY(${resistanceY}px)`;
      } else {
        if (isDragging) {
          contentEl.style.transform = "translateY(0)";
          isDragging = false;
        }
      }
    };

    const onTouchEnd = () => {
      if (!isEligible && !isDragging) return;

      const deltaY = currentY - startY;
      isEligible = false;

      if (isDragging && !isHorizontalGesture) {
        isDragging = false;
        contentEl.style.transition = "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)";

        if (deltaY > 80) {
          if (typeof triggerHaptic === "function") triggerHaptic("light");
          window.closeLightboxModal(true);
        } else {
          contentEl.style.transform = "translateY(0)";
        }
      }
      startX = 0;
      startY = 0;
      currentX = 0;
      currentY = 0;
      isHorizontalGesture = false;
    };

    contentEl.addEventListener("touchstart", onTouchStart, { passive: true });
    contentEl.addEventListener("touchmove", onTouchMove, { passive: false });
    contentEl.addEventListener("touchend", onTouchEnd, { passive: true });
    contentEl.addEventListener("touchcancel", onTouchEnd, { passive: true });
  }
  
  function hideGlobalLoader() {
    const loader = document.getElementById("global-loader-overlay");
    if (loader) loader.style.display = "none";
  }

  // ใน main.js ภายในฟังก์ชัน handleUrlRouting หรือ initApplication:
async function handleUrlRouting(isInitial = false) {
  let rawPath = window.location.pathname.replace(/\/+$/, "") || "/";

  // 🟢 ตรวจสอบว่าหน้าเว็บปัจจุบันเป็นหน้า Standalone Profile ที่เรนเดอร์มาจาก render-bot.js หรือไม่
  const isStandaloneProfile = document.querySelector('article.interactive-card') && !document.getElementById('profiles-display-area');
  if (isStandaloneProfile) {
    // ถ้าเป็นหน้าโปรไฟล์เดี่ยวแล้ว ให้หยุดทำงานส่วน SPA Routing ทันที ไม่ต้องเปิด Lightbox ซ้อน
    return;
  }

  // 1. ตรวจสอบ Sideline Lightbox Route สำหรับหน้าหลัก
  const sidelineMatch = rawPath.match(/^\/(?:sideline|profile|app)\/([^/]+)/i);
  if (sidelineMatch) {
    let slugVal = decodeURIComponent(sidelineMatch[1]).trim();
    appState.currentProfileSlug = slugVal;

    let foundProfile = appState.allProfiles.find(p => 
      String(p.slug || "").toLowerCase() === slugVal.toLowerCase() || 
      String(p.id) === slugVal
    );

    if (foundProfile) {
      window.openLightboxModal(foundProfile);
    }
    return;
  }

    // 2. ข้ามการ Re-render ซ้ำซ้อน หากหน้าเว็บมี SSR Render มาแล้ว
    const hasExistingSSR = domCache.profilesDisplayArea && domCache.profilesDisplayArea.children.length > 0;
    if (isInitial && hasExistingSSR) {
      const routeMatch = rawPath.match(/^\/(?:location|province)\/([^/]+)/i);
      const locSlug = routeMatch ? decodeURIComponent(routeMatch[1]).toLowerCase().trim() : "national";
      window.currentProvinceSlug = locSlug;
      if (domCache.provinceSelect && locSlug !== "national") {
        domCache.provinceSelect.value = locSlug;
      }
      return;
    }

    // 3. ตรวจสอบหน้ารายจังหวัด
    const locationMatch = rawPath.match(/^\/(?:location|province)\/([^/]+)/i);
    if (locationMatch) {
      let locSlug = "";
      try {
        locSlug = decodeURIComponent(locationMatch[1]).toLowerCase().trim();
      } catch {
        locSlug = locationMatch[1].toLowerCase().trim();
      }
      if (locSlug === "chiang_mai") locSlug = "chiangmai";

      appState.currentProfileSlug = null;
      window.closeLightboxModal(false);
      window.currentProvinceSlug = locSlug;
      if (domCache.provinceSelect) domCache.provinceSelect.value = locSlug;

      executeFilterAndRender(false);
      return;
    }

    // 4. กรณีหน้าหลักทั่วไป (Default)
    appState.currentProfileSlug = null;
    window.currentProvinceSlug = "national";
    window.closeLightboxModal(false);
    if (domCache.provinceSelect) domCache.provinceSelect.value = "";

    executeFilterAndRender(false);
  }

  async function initApplication() {
    // 🟢 1. ตรวจสอบทันที: ถ้าเป็นหน้าโปรไฟล์เดี่ยว (ที่สร้างจาก render-bot.js)
    // ให้หยุดทำงานทันที ไม่ต้องไปดึง Database Supabase 100+ คน และไม่ต้องเปิด Lightbox ซ้อน
    const isStandaloneProfile = document.querySelector('article.interactive-card') && !document.getElementById('profiles-display-area');
    if (isStandaloneProfile) {
        hideGlobalLoader();
        return; // ⛔ ออกจากการทำงานทันที ประหยัดเน็ต ประหยัด RAM 100%
    }

    domCache.body = document.body;
    domCache.profilesDisplayArea = document.getElementById("profiles-display-area");
    domCache.noResultsMessage = document.getElementById("no-results-message");
    domCache.fetchErrorMessage = document.getElementById("fetch-error-message");
    domCache.searchForm = document.getElementById("search-form");
    domCache.searchInput = document.getElementById("search-keyword");
    domCache.provinceSelect = document.getElementById("search-province");
    domCache.availabilitySelect = document.getElementById("search-availability");
    domCache.featuredSelect = document.getElementById("search-featured");
    domCache.sortSelect = document.getElementById("sort-select");
    domCache.resetSearchBtn = document.getElementById("reset-search-btn");
    domCache.featuredSection = document.getElementById("featured-profiles");
    domCache.featuredContainer = document.getElementById("featured-profiles-container");

    const menuToggleBtn = document.getElementById("menu-toggle");
    const sidebarMenuEl = document.getElementById("sidebar-menu");
    const sidebarOverlayEl = document.getElementById("sidebar-overlay");
    const closeMenuBtn = document.getElementById("close-menu-btn");

    const toggleSidebar = (isOpen) => {
      if (sidebarMenuEl) {
        sidebarMenuEl.classList.toggle("active", isOpen);
        sidebarMenuEl.style.pointerEvents = isOpen ? "auto" : "none";
        sidebarMenuEl.style.visibility = isOpen ? "visible" : "hidden";
      }
      if (sidebarOverlayEl) {
        sidebarOverlayEl.classList.toggle("active", isOpen);
        sidebarOverlayEl.style.pointerEvents = isOpen ? "auto" : "none";
        sidebarOverlayEl.style.visibility = isOpen ? "visible" : "hidden";
      }
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    if (menuToggleBtn) menuToggleBtn.onclick = () => toggleSidebar(true);
    if (closeMenuBtn) closeMenuBtn.onclick = () => toggleSidebar(false);
    if (sidebarOverlayEl) sidebarOverlayEl.onclick = () => toggleSidebar(false);
    if (sidebarMenuEl) {
      sidebarMenuEl.querySelectorAll("a").forEach(link => {
        link.onclick = () => toggleSidebar(false);
      });
    }

    const openFilterDockBtn = document.getElementById("open-filter-dock-btn");
    const closeSearchDrawerBtn = document.getElementById("close-search-drawer-btn");
    const applyFilterBtn = document.getElementById("apply-filter-btn");
    const searchBottomSheetEl = document.getElementById("search-bottom-sheet");
    const searchDrawerOverlayEl = document.getElementById("search-drawer-overlay");

    const toggleSearchDrawer = (isOpen) => {
      if (searchBottomSheetEl) {
        searchBottomSheetEl.classList.toggle("active", isOpen);
        searchBottomSheetEl.style.pointerEvents = isOpen ? "auto" : "none";
        searchBottomSheetEl.style.visibility = isOpen ? "visible" : "hidden";
      }
      if (searchDrawerOverlayEl) {
        searchDrawerOverlayEl.classList.toggle("active", isOpen);
        searchDrawerOverlayEl.style.pointerEvents = isOpen ? "auto" : "none";
        searchDrawerOverlayEl.style.visibility = isOpen ? "visible" : "hidden";
      }
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    if (openFilterDockBtn) {
      openFilterDockBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSearchDrawer(true);
      };
    }
    if (closeSearchDrawerBtn) closeSearchDrawerBtn.onclick = () => toggleSearchDrawer(false);
    if (searchDrawerOverlayEl) searchDrawerOverlayEl.onclick = () => toggleSearchDrawer(false);
    if (applyFilterBtn) {
      applyFilterBtn.onclick = () => {
        executeFilterAndRender(true);
        toggleSearchDrawer(false);
      };
    }

    if (domCache.provinceSelect) {
      domCache.provinceSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (isEN) {
          executeFilterAndRender(true);
        } else {
          window.location.href = val && val !== "all" && val !== "national" ? `/location/${val}` : "/";
        }
      });
    }

    if (domCache.searchInput) {
      domCache.searchInput.addEventListener("input", (e) => {
        clearTimeout(window.searchTimeout);
        const queryText = e.target.value;
        const clearBtn = document.getElementById("clear-search-btn");
        if (clearBtn) clearBtn.style.display = queryText ? "block" : "none";
        window.searchTimeout = setTimeout(() => {
          executeFilterAndRender(true);
          showSearchSuggestions(queryText);
        }, 200);
      });

      domCache.searchInput.addEventListener("focus", () => {
        showSearchSuggestions(domCache.searchInput.value);
      });
    }

    const clearSearchBtn = document.getElementById("clear-search-btn");
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        if (domCache.searchInput) domCache.searchInput.value = "";
        clearSearchBtn.style.display = "none";
        const popover = document.getElementById("search-suggestions");
        if (popover) popover.style.display = "none";
        executeFilterAndRender(true);
      });
    }

    document.querySelectorAll(".filter-pill-tab").forEach(pill => {
      pill.addEventListener("click", function (e) {
        e.preventDefault();
        triggerHaptic("light"); // 👈 เติมบรรทัดนี้: สั่นคลิกเบาๆ 12ms
        document.querySelectorAll(".filter-pill-tab").forEach(p => p.classList.remove("active"));
        this.classList.add("active");
 
        
        const selectedTag = this.getAttribute("data-tag") || "all";
        appState.activePillTag = selectedTag;
        executeFilterAndRender(true);
      });
    });

    // 🟢 Global Click Delegation
    document.body.addEventListener("click", (e) => {
      const searchInputEl = document.getElementById("search-keyword");
      const suggestionsEl = document.getElementById("search-suggestions");
      if (suggestionsEl && searchInputEl && !searchInputEl.contains(e.target) && !suggestionsEl.contains(e.target)) {
        suggestionsEl.style.display = "none";
      }

      const suggestionTarget = e.target.closest('[data-action="suggestion"]');
      if (suggestionTarget) {
        const slug = suggestionTarget.dataset.slug;
        const isProfile = suggestionTarget.dataset.isProfile === "true";
        if (isProfile) {
          if (suggestionsEl) suggestionsEl.style.display = "none";
          toggleSearchDrawer(false);
          history.pushState(null, "", `/sideline/${encodeURIComponent(slug)}`);
          handleUrlRouting();
          return;
        } else {
          if (domCache.searchInput) {
            domCache.searchInput.value = slug;
            if (suggestionsEl) suggestionsEl.style.display = "none";
            executeFilterAndRender(true);
          }
          return;
        }
      }

      const cardElement = e.target.closest(".profile-card-new, .vip-card-item, .interactive-card");
      if (cardElement) {
        const profileId = cardElement.getAttribute("data-profile-id");
        const profileSlug = cardElement.getAttribute("data-profile-slug");

        if (profileId || profileSlug) {
          e.preventDefault();

          const searchId = String(profileId || "");
          const searchSlug = String(profileSlug || "");

          let targetProfile = appState.allProfiles.find(p => 
            String(p.id) === searchId || 
            (p.slug && String(p.slug) === searchSlug) ||
            (searchSlug && String(p.id) === searchSlug)
          );

          if (!targetProfile && window.profilesData && Array.isArray(window.profilesData)) {
            const rawP = window.profilesData.find(p => String(p.id) === searchId || String(p.slug) === searchSlug);
            if (rawP) targetProfile = normalizeProfile(rawP);
          }

          if (targetProfile) {
            history.pushState(null, "", `/sideline/${encodeURIComponent(targetProfile.slug || targetProfile.id)}`);
            window.openLightboxModal(targetProfile);
          } else {
            window.location.href = `/sideline/${encodeURIComponent(profileSlug || profileId)}`;
          }
          return;
        }
      }

      const closeLightboxBtn = e.target.closest("#closeLightboxBtn");
      const lightboxModal = document.getElementById("lightbox");
      if (closeLightboxBtn || e.target === lightboxModal) {
        window.closeLightboxModal(true);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        window.closeLightboxModal(true);
        toggleSidebar(false);
        toggleSearchDrawer(false);
      }
    });

    if (domCache.availabilitySelect) domCache.availabilitySelect.addEventListener("change", () => executeFilterAndRender(true));
    if (domCache.featuredSelect) domCache.featuredSelect.addEventListener("change", () => executeFilterAndRender(true));
    if (domCache.sortSelect) domCache.sortSelect.addEventListener("change", () => executeFilterAndRender(true));

    if (domCache.resetSearchBtn) {
      domCache.resetSearchBtn.addEventListener("click", () => {
        if (domCache.searchInput) domCache.searchInput.value = "";
        if (domCache.availabilitySelect) domCache.availabilitySelect.value = "";
        if (domCache.featuredSelect) domCache.featuredSelect.value = "";
        if (domCache.sortSelect) domCache.sortSelect.value = "featured";

        const clearBtn = document.getElementById("clear-search-btn");
        if (clearBtn) clearBtn.style.display = "none";
        const suggestionsEl = document.getElementById("search-suggestions");
        if (suggestionsEl) suggestionsEl.style.display = "none";

        executeFilterAndRender(true);
      });
    }

    document.querySelectorAll(".region-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".region-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const region = tab.getAttribute("data-region");
        if (region === "ทั้งหมด") window.location.href = isEN ? "/index-en" : "/";
        else if (region === "ภาคเหนือ") window.location.href = "/location/chiangmai";
        else if (region === "ภาคอีสาน") window.location.href = "/location/khon-kaen";
      });
    });

    const toggleSeoDrawerBtn = document.getElementById("toggle-seo-drawer-btn");
    const seoDrawerWrapper = document.getElementById("seo-drawer-wrapper");
    if (toggleSeoDrawerBtn && seoDrawerWrapper) {
      toggleSeoDrawerBtn.onclick = () => {
        const isCollapsed = seoDrawerWrapper.classList.toggle("collapsed");
        toggleSeoDrawerBtn.querySelector("span").textContent = isCollapsed ? (isEN ? "Read More" : "ดูข้อมูลพื้นที่บริการทั้งหมด") : (isEN ? "Collapse" : "ย่อข้อความ");
        toggleSeoDrawerBtn.querySelector("i").className = isCollapsed ? "fas fa-chevron-down" : "fas fa-chevron-up";
      };
    }

    window.trackLineClick = function(profileId) {
  try {
    const idNum = parseInt(profileId, 10);
    if (isNaN(idNum)) return;

    // 🛡️ ป้องกันยิงซ้ำ: ตรวจสอบว่าใน Session นี้เคยกดไปแล้วหรือยัง
    const sessionKey = `tracked_line_${idNum}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, "true");

    fetch("https://zxetzqwjaiumqhrpumln.supabase.co/rest/v1/rpc/increment_likes", {
      method: "POST",
      headers: {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ profile_id_to_update: idNum }),
      keepalive: true
    }).catch(() => {});
  } catch (_) {}
};

    window.handleLineBooking = function(profileId, lineUrl) {
      triggerHaptic("success"); // 👈 เติมบรรทัดนี้: สั่นจังหวะ Success ยืนยันการกดจอง
      window.trackLineClick(profileId);
    };

    (function initDockAutoHide() {
      const floatingDock = document.querySelector('.floating-app-dock');
      if (!floatingDock) return;

      let lastScrollY = window.scrollY;
      let ticking = false;

      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 120) {
              floatingDock.classList.add('dock-hidden');
            } else {
              floatingDock.classList.remove('dock-hidden');
            }
            lastScrollY = Math.max(0, currentScrollY);
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    })();

  // ==========================================================================
    // 🟢 ระบบดึงข้อมูล: ดักกรองชื่อว่าง + ตัดรูปซ้ำ + กันข้อมูลขยะ 100%
    // ==========================================================================
    await (async function initializeData() {
      if (appState.isFetching) return false;
      appState.isFetching = true;

      // 🛡️ ฟังก์ชันคัดกรองข้อมูลให้สะอาดสมบูรณ์แบบ
      function filterValidProfiles(list) {
        if (!list || !Array.isArray(list)) return [];
        const seenIds = new Set();
        const seenNames = new Set();
        const seenImgs = new Set();
        const validProfiles = [];

        for (const raw of list) {
          if (!raw) continue;

          // 1. กรองทิ้งทันที ถ้าไม่มีชื่อ หรือเป็นชื่อว่าง/ขยะ
          const rawName = (raw.name || "").trim();
          const cleanName = rawName.toLowerCase().replace(/^(น้อง|สาว|พี่)\s*/gi, "");
          if (!cleanName || cleanName === "model" || cleanName === "สาวสวย" || cleanName === "-") {
            continue; // 👈 ข้ามการ์ดที่ไม่มีชื่อ ไม่ให้หลุดไปหน้าเว็บ
          }

          // 2. กรอง ID ซ้ำ
          if (raw.id && seenIds.has(String(raw.id))) continue;

          // 3. กรองชื่อซ้ำในจังหวัดเดียวกัน
          const pKey = (raw.provinceKey || raw.province_slug || "").toLowerCase();
          const nameSig = `${cleanName}_${pKey}`;
          if (seenNames.has(nameSig)) continue;

          // 4. กรองรูปภาพซ้ำ (รวมถึงรูป Placeholder / Fallback)
          const rawImg = (raw.imagePath || raw.image_url || raw.imageUrl || "").trim().toLowerCase();
          let imgSig = "";
          if (rawImg) {
            const parts = rawImg.split("?")[0].split("/");
            imgSig = parts[parts.length - 1].replace(/\.(webp|jpg|jpeg|png|avif)$/i, "");
          }

          // ถ้าไม่มีรูป หรือรูปนี้เคยแสดงไปแล้ว ให้ข้ามทันที
          if (imgSig && seenImgs.has(imgSig)) continue;

          if (raw.id) seenIds.add(String(raw.id));
          seenNames.add(nameSig);
          if (imgSig) seenImgs.add(imgSig);

          validProfiles.push(raw);
        }

        return validProfiles;
      }

      try {
        // 1. ดึงรายชื่อจังหวัด
        const provSource = (window.provincesData && Array.isArray(window.provincesData)) 
          ? window.provincesData 
          : (await (await getSupabaseClient())?.from("provinces").select("*"))?.data;

        if (provSource && Array.isArray(provSource)) {
          appState.provincesMap.clear();
          provSource.forEach(p => {
            const nameThai = p.nameThai || p.name_thai || p.name;
            let k = (p.key || p.slug || p.id || "").toString().toLowerCase();
            if (k === "chiang_mai" || k === "chiang-mai") k = "chiangmai";
            if (k && nameThai) appState.provincesMap.set(k, nameThai);
          });
        }

        // 2. กรณีมีข้อมูลจาก SSR (window.profilesData)
        if (window.profilesData && Array.isArray(window.profilesData) && window.profilesData.length > 0) {
          const cleanProfiles = filterValidProfiles(window.profilesData);
          appState.allProfiles = cleanProfiles.map(normalizeProfile).filter(Boolean);
          populateInitialComponents();
          return true;
        }

        // 3. Fallback: ดึงสดจาก Supabase (ถ้าไม่มี SSR)
        const client = await getSupabaseClient();
        if (!client) throw new Error("Supabase client not initialized");

        const { data: rawDbProfiles } = await client
          .from("profiles")
          .select("*")
          .eq("active", true)
          .order("isfeatured", { ascending: false })
          .order("created_at", { ascending: false });

        if (rawDbProfiles && rawDbProfiles.length > 0) {
          const cleanProfiles = filterValidProfiles(rawDbProfiles);
          appState.allProfiles = cleanProfiles.map(normalizeProfile).filter(Boolean);
          populateInitialComponents();
          return true;
        }

        return false;
      } catch (fetchErr) {
        console.error("Data Fetch Error:", fetchErr);
        domCache.fetchErrorMessage?.classList.remove("hidden");
        return false;
      } finally {
        appState.isFetching = false;
        hideGlobalLoader();
      }
    })();

    // จัดการ Routing ของ URL และซ่อนตัวโหลด
    await handleUrlRouting(true);
    hideGlobalLoader();

    // ดักจับการกดย้อนกลับ/ไปข้างหน้าของเบราว์เซอร์
    window.addEventListener("popstate", async () => {
      await handleUrlRouting(false);
    });
  } // 🟢 ปิดฟังก์ชัน initApplication

  // ==========================================================================
  // 🟢 ฟังก์ชัน Stories: ทำงานสมบูรณ์ 100% (โหลดไว 3KB, เปิด Lightbox ได้ทันที, Zero CLS)
  // ==========================================================================
  function initAgencyStories() {
    const trackEl = document.getElementById("agency-stories-track");
    if (!trackEl) return;

    // 1. ถ้าใน HTML มีการเรนเดอร์มาแล้ว ให้หยุดทำงานทันที ป้องกันเรนเดอร์ซ้ำ
    if (trackEl.children.length > 0) return;

    const profiles = appState.allProfiles;
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) return;

    // 2. คัดกรองเฉพาะโปรไฟล์ที่มีรูปภาพ และเลือกมา 10 คนแรกเพื่อประหยัดแบนด์วิดท์
    const validProfiles = profiles
      .filter(p => p && (p.imagePath || p.image_url || (p.images && p.images.length > 0)))
      .slice(0, 10);

    if (validProfiles.length === 0) return;

    const fallbackImg = "https://firstmodelhub.com/images/firstmodelhub.webp";

    // ฟังก์ชันสร้าง Story Item HTML แต่ละใบ
    const createStoryItemHtml = (p, idx, isAriaHidden = false) => {
      const rawName = p.displayName || p.name || "โมเดล";
      const cleanName = rawName.replace(/^(น้อง\s?)+/gi, "").trim();
      const fullName = isEN ? cleanName : `น้อง${cleanName}`;
      
      const rawImg = p.imagePath || p.image_url || (p.images && p.images[0] ? p.images[0].src : "") || fallbackImg;
      // 🟢 บีบอัดรูปวงกลม Story ให้เหลือ 120x120px โฟกัสใบหน้า (ขนาดไฟล์เหลือเพียง 3-5KB คมชัดระดับ Retina)
      const storyImg = typeof optimizeImg === "function" ? optimizeImg(rawImg, 120, 120) : rawImg;
      
      const slug = encodeURIComponent(p.slug || p.id || cleanName);
      const profileId = p.id || "";
      
      const isOnline = p.isAvailable !== undefined 
        ? Boolean(p.isAvailable) 
        : !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด", "busy", "off"].some(s => String(p.availability || "").toLowerCase().includes(s));
      
      const statusClass = isOnline ? "online" : "busy";
      const hiddenAttr = isAriaHidden ? 'aria-hidden="true" tabindex="-1"' : '';

      return `
        <a href="/sideline/${slug}" 
           class="story-item-el interactive-card" 
           data-profile-id="${escapeHTML(String(profileId))}" 
           data-profile-slug="${slug}" 
           aria-label="${isAriaHidden ? '' : `ดูโปรไฟล์ ${escapeHTML(fullName)}`}" 
           ${hiddenAttr}>
          <div class="story-ring-wrap">
            <div class="story-ring-glow">
              <img src="${storyImg}" 
                   alt="${escapeHTML(cleanName)}" 
                   loading="${idx < 4 && !isAriaHidden ? "eager" : "lazy"}" 
                   decoding="async" 
                   width="52" 
                   height="52" 
                   onerror="this.onerror=null; this.src='${fallbackImg}';">
            </div>
            <span class="story-status-dot ${statusClass}" aria-hidden="true"></span>
          </div>
          <span class="story-label">${escapeHTML(cleanName)}</span>
        </a>
      `;
    };

  // 🟢 ชุดที่ 1: ชุดหลักสำหรับการคลิกดูข้อมูล และให้ Googlebot สแกน (SEO Friendly)
    const primaryHtml = validProfiles.map((p, idx) => createStoryItemHtml(p, idx, false)).join("");
    
    // 🟢 ชุดที่ 2: ชุดโคลนสำหรับทำ CSS Infinite Loop (ซ่อนจาก Screen Reader ไม่ให้อ่านซ้ำ)
    const cloneHtml = validProfiles.map((p, idx) => createStoryItemHtml(p, idx, true)).join("");

   trackEl.innerHTML = primaryHtml + cloneHtml;
  }

  // ==========================================================================
  // 🕵️‍♂️ STEALTH ADMIN CACHE PURGE (พร้อมกล่องแจ้งเตือนสถานะ สำเร็จ/ล้มเหลว)
  // ==========================================================================
  function showAdminStatusModal(status, title, message) {
    let modal = document.getElementById("admin-status-hud");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "admin-status-hud";
      modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        background: rgba(15, 23, 42, 0.96);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        border-radius: 24px;
        padding: 24px 28px;
        z-index: 999999;
        color: #FFFFFF;
        text-align: center;
        width: 90%;
        max-width: 380px;
        box-shadow: 0 25px 60px rgba(0,0,0,0.6);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        opacity: 0;
        pointer-events: none;
        box-sizing: border-box;
      `;
      document.body.appendChild(modal);
    }

    let iconHtml = "";
    let borderStyle = "";

    if (status === "loading") {
      iconHtml = `<div style="font-size: 38px; margin-bottom: 12px; animation: spin 1s linear infinite; display: inline-block;">⚡</div>`;
      borderStyle = "1.5px solid rgba(124, 58, 237, 0.6)";
    } else if (status === "success") {
      iconHtml = `<div style="font-size: 42px; margin-bottom: 12px; color: #00E676; text-shadow: 0 0 20px #00E676;">✓</div>`;
      borderStyle = "2px solid #00E676";
      if (typeof triggerHaptic === "function") triggerHaptic("success");
    } else if (status === "error") {
      iconHtml = `<div style="font-size: 42px; margin-bottom: 12px; color: #FF1493; text-shadow: 0 0 20px #FF1493;">✕</div>`;
      borderStyle = "2px solid #FF1493";
      if (typeof triggerHaptic === "function") triggerHaptic("medium");
    }

    modal.style.border = borderStyle;
    modal.innerHTML = `
      ${iconHtml}
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 900;">${title}</h3>
      <p style="margin: 0; font-size: 12.5px; color: #CBD5E1; line-height: 1.6;">${message}</p>
      ${status === "error" ? `
        <button type="button" onclick="document.getElementById('admin-status-hud').style.opacity='0'; document.getElementById('admin-status-hud').style.pointerEvents='none';" 
          style="margin-top: 16px; background: rgba(255,255,255,0.15); border: none; color: #FFFFFF; padding: 8px 24px; border-radius: 100px; font-weight: 800; font-size: 12px; cursor: pointer;">
          ปิดหน้าต่าง
        </button>` : ""}
    `;

    modal.style.opacity = "1";
    modal.style.pointerEvents = "auto";
    modal.style.transform = "translate(-50%, -50%) scale(1)";
  }

  // ==========================================================================
  // 🕵️‍♂️ STEALTH ADMIN CACHE PURGE (แก้ไขให้ล้างแคชได้ 100% ไม่ Error)
  // ==========================================================================
  function initStealthAdminPurge() {
    const starElements = document.querySelectorAll(".brand-logo-text .star, .dancing-neon-star, .star");
    if (!starElements || starElements.length === 0) return;

    let tapCount = 0;
    let resetTimer = null;
    const ADMIN_SECRET = "fmh_super_admin_2026";
    const ADMIN_PIN = "8888";

    starElements.forEach(star => {
      star.style.cursor = "pointer";
      star.style.userSelect = "none";
      star.style.webkitUserSelect = "none";

      const handleTap = (e) => {
        e.preventDefault();
        e.stopPropagation();

        tapCount++;
        if (typeof triggerHaptic === "function") triggerHaptic("light");

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          tapCount = 0;
        }, 1200);

        if (tapCount >= 5) {
          tapCount = 0;
          clearTimeout(resetTimer);
          if (typeof triggerHaptic === "function") triggerHaptic("medium");

          setTimeout(async () => {
            const inputPin = prompt("🔑 [ADMIN CONTROL HUB]\nกรุณาใส่รหัสผ่านเพื่อล้างแคชและดึงข้อมูลสดล่าสุด:");
            
            if (inputPin === ADMIN_PIN) {
              showAdminStatusModal(
                "loading", 
                "กำลังล้างแคชระบบทั้งหมด...", 
                "ระบบกำลังเคลียร์ Cache Storage, Service Worker และ Edge Memory กรุณารอสักครู่..."
              );

              try {
                // 1. ล้างแคชระดับ Client (Storage & PWA Cache)
                if (window.sessionStorage) sessionStorage.clear();
                if (window.localStorage) localStorage.clear();
                
                if ("caches" in window) {
                  const cacheKeys = await caches.keys();
                  await Promise.all(cacheKeys.map(k => caches.delete(k)));
                }

                // 2. ขอยิงล้างแคชที่ Edge Server (ส่งทั้ง API และ Headers)
                try {
                  await fetch(`/api/clear-cache?secret=${ADMIN_SECRET}`, {
                    method: "GET",
                    headers: { "x-purge-secret": ADMIN_SECRET },
                    cache: "no-store"
                  });
                } catch (_) {
                  // ถ้า API /api/ ไม่ได้ต่อไว้ ให้ข้ามไปใช้ Force Refresh ผ่าน URL ได้เลย
                }

                showAdminStatusModal(
                  "success", 
                  "ล้างแคชสำเร็จ 100%!", 
                  "ล้างหน่วยความจำและดึงข้อมูลสดจาก Database เรียบร้อย กำลังรีโหลดหน้าเว็บ..."
                );

                // 3. รีโหลดหน้าเว็บพร้อมพารามิเตอร์บายพาสแคช Edge และ Service Worker
                setTimeout(() => {
                  const cleanUrl = window.location.pathname;
                  window.location.href = `${cleanUrl}?refresh=${ADMIN_SECRET}&purge=1&t=${Date.now()}`;
                }, 1000);

              } catch (err) {
                // กรณีฉุกเฉิน: บังคับรีโหลดทันที
                window.location.href = `${window.location.pathname}?refresh=${ADMIN_SECRET}&t=${Date.now()}`;
              }

            } else if (inputPin !== null) {
              showAdminStatusModal(
                "error", 
                "รหัสผ่านไม่ถูกต้อง!", 
                "คุณไม่มีสิทธิ์ในการสั่งล้างแคชระบบ (Access Denied)"
              );
            }
          }, 50);
        }
      };

      star.addEventListener("click", handleTap);
      star.addEventListener("touchend", handleTap, { passive: false });
    });
  }

  // ==========================================================================
  // 🟢 เริ่มต้นการทำงานของระบบ (พร้อมปุ่มลับแอดมิน)
  // ==========================================================================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initApplication();
      initLightboxSwipeDown();
      initStealthAdminPurge();
    });
  } else {
    initApplication();
    initLightboxSwipeDown();
    initStealthAdminPurge();
  }
})();
