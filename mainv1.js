/* ==============================================================================
   🛡️ FIRST MODEL HUB - ULTRA-DEEP SYSTEM & SEO AUDIT ENGINE (2026 S-TIER)
   ============================================================================== */

(function () {
  "use strict";

  // 1. Global JS Error Capture System
  window.__SYSTEM_ERRORS__ = window.__SYSTEM_ERRORS__ || [];
  if (!window.__ERROR_LISTENER_BOUND__) {
    window.addEventListener('error', (e) => {
      window.__SYSTEM_ERRORS__.push({
        type: 'JS Runtime Error',
        msg: e.message || 'Unknown Error',
        src: e.filename ? e.filename.split('/').pop() : 'inline',
        line: e.lineno || 0,
        time: new Date().toLocaleTimeString('th-TH')
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      window.__SYSTEM_ERRORS__.push({
        type: 'Unhandled Promise Error',
        msg: e.reason?.message || String(e.reason),
        src: 'Promise/Async',
        line: '-',
        time: new Date().toLocaleTimeString('th-TH')
      });
    });
    window.__ERROR_LISTENER_BOUND__ = true;
  }

  // Timeout Safety Function (2.5 วินาทีตัดจบกันค้าง)
  const withTimeout = (promise, ms = 2500, fallbackVal = null) => {
    return Promise.race([
      promise,
      new Promise(res => setTimeout(() => res(fallbackVal), ms))
    ]);
  };

  // 2. Inject Diagnostic Dashboard CSS
  const injectStyles = () => {
    if (document.getElementById('scanner-styles')) return;
    const style = document.createElement('style');
    style.id = 'scanner-styles';
    style.innerHTML = `
      #scanner-fab {
        position: fixed; bottom: 85px; right: 16px; z-index: 999998;
        background: linear-gradient(135deg, #7C3AED 0%, #FF1493 100%); color: #FFF; 
        border: 1px solid rgba(255,255,255,0.4); border-radius: 50px;
        padding: 10px 18px; font-family: 'Prompt', sans-serif; font-size: 12px; font-weight: 800;
        box-shadow: 0 10px 30px rgba(124, 58, 237, 0.6); cursor: pointer; transition: all 0.3s ease;
        display: flex; align-items: center; gap: 8px;
      }
      #scanner-fab:hover { transform: translateY(-3px) scale(1.05); }
      
      #scanner-modal {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(4, 2, 12, 0.95); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
        z-index: 999999; display: none; align-items: center; justify-content: center;
        font-family: 'Prompt', system-ui, sans-serif; padding: 12px; box-sizing: border-box;
      }
      #scanner-modal.active { display: flex !important; }
      
      .scanner-card {
        width: 100%; max-width: 950px; height: 92vh; max-height: 880px; background: #0F172A; border: 1px solid #334155;
        border-radius: 20px; color: #F8FAFC; display: flex; flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); overflow: hidden;
      }
      .scanner-header {
        padding: 16px 20px; background: #1E293B; border-bottom: 1px solid #334155;
        display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
      }
      .scanner-title { font-size: 16px; font-weight: 900; color: #C084FC; display: flex; align-items: center; gap: 8px; }
      .scanner-close { background: none; border: none; color: #94A3B8; font-size: 24px; cursor: pointer; padding: 4px; }
      .scanner-close:hover { color: #FFF; }
      
      .scanner-body { 
        flex: 1; padding: 16px; overflow-y: auto !important; -webkit-overflow-scrolling: touch;
        display: flex; flex-direction: column; gap: 16px;
      }
      
      .scanner-scores-wrapper { display: grid; grid-template-columns: repeat(1, 1fr); gap: 10px; }
      @media (min-width: 640px) { .scanner-scores-wrapper { grid-template-columns: repeat(2, 1fr); } }

      .score-box-card {
        padding: 14px 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1);
        display: flex; align-items: center; justify-content: space-between;
      }

      .scanner-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
      @media (min-width: 640px) { .scanner-stats-grid { grid-template-columns: repeat(4, 1fr); } }
      
      .scanner-stat-box { background: #1E293B; padding: 12px; border-radius: 12px; border: 1px solid #334155; text-align: center; }
      .scanner-stat-label { font-size: 11px; color: #94A3B8; margin-bottom: 4px; font-weight: 600; }
      .scanner-stat-val { font-size: 16px; font-weight: 900; }
      
      .scanner-table-wrapper { background: #1E293B; border-radius: 12px; border: 1px solid #334155; overflow: hidden; flex-shrink: 0; }
      .scanner-table-title { padding: 10px 14px; background: #0F172A; font-weight: 800; font-size: 13px; border-bottom: 1px solid #334155; color: #38BDF8; display: flex; justify-content: space-between; align-items: center; }
      .scanner-table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; }
      .scanner-table th { background: #1E293B; padding: 8px 12px; color: #94A3B8; border-bottom: 1px solid #334155; font-size: 11px; }
      .scanner-table td { padding: 8px 12px; border-bottom: 1px solid #334155; color: #E2E8F0; word-break: break-word; }
      
      .badge-pass { background: #065F46; color: #34D399; padding: 2px 7px; border-radius: 6px; font-size: 10px; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; }
      .badge-fail { background: #991B1B; color: #FCA5A5; padding: 2px 7px; border-radius: 6px; font-size: 10px; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; }
      .badge-warn { background: #854D0E; color: #FDE047; padding: 2px 7px; border-radius: 6px; font-size: 10px; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; }
      
      .scanner-footer { padding: 12px 16px; background: #1E293B; border-top: 1px solid #334155; display: flex; justify-content: space-between; gap: 10px; flex-shrink: 0; }
      .btn-scan { background: #7C3AED; color: #FFF; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; }
      .btn-scan:hover { background: #6D28D9; }
    `;
    document.head.appendChild(style);
  };

  // 3. Inject Modal Container
  const injectUI = () => {
    if (document.getElementById('scanner-fab')) return;

    const fab = document.createElement('button');
    fab.id = 'scanner-fab';
    fab.type = 'button';
    fab.innerHTML = `<span>🛡️</span> <span>System & SEO Audit</span>`;
    fab.onclick = () => window.scanSystemUI();
    document.body.appendChild(fab);

    const modal = document.createElement('div');
    modal.id = 'scanner-modal';
    modal.innerHTML = `
      <div class="scanner-card">
        <div class="scanner-header">
          <div class="scanner-title">🛡️ System Health & SEO Audit Dashboard</div>
          <button type="button" class="scanner-close" onclick="document.getElementById('scanner-modal').classList.remove('active')">&times;</button>
        </div>
        <div class="scanner-body" id="scanner-modal-body">
          <div style="text-align: center; padding: 40px; color: #94A3B8;">กำลังเริ่มต้นสแกนระบบและวิเคราะห์ SEO...</div>
        </div>
        <div class="scanner-footer">
          <button type="button" class="btn-scan" onclick="window.scanSystemUI()">🔄 สแกนวิเคราะห์อีกครั้ง</button>
          <button type="button" class="btn-scan" style="background: #334155;" onclick="document.getElementById('scanner-modal').classList.remove('active')">ปิดหน้าต่าง</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  // 4. MASTER ULTRA-DEEP SYSTEM & SEO SCANNER
  window.runSystemScan = async function () {
    const report = {
      timestamp: new Date().toLocaleTimeString('th-TH'),
      healthScore: 100,
      seoScore: 100,
      totalChecks: 0,
      passedChecks: 0,
      runtime: { pass: true, items: [] },
      dom: { pass: true, items: [] },
      supabase: { pass: true, latency: "0ms", profiles: 0, provinces: 0, reviews: 0, error: null, items: [] },
      storage: { pass: true, localStorage: false, indexedDB: false, details: "", items: [] },
      seoText: { pass: true, items: [] },
      seoSchema: { pass: true, items: [] },
      eeat: { pass: true, items: [] },
      media: { pass: true, totalImages: 0, brokenImages: [], fontPromptLoaded: false, items: [] },
      jsErrors: window.__SYSTEM_ERRORS__ || []
    };

    const addCheck = (category, name, pass, detail = "", isSeoMetric = false) => {
      report.totalChecks++;
      if (pass) {
        report.passedChecks++;
      } else {
        category.pass = false;
        if (isSeoMetric) {
          report.seoScore = Math.max(0, report.seoScore - 5);
        } else {
          report.healthScore = Math.max(0, report.healthScore - 4);
        }
      }
      if (category && Array.isArray(category.items)) {
        category.items.push({ name, pass, detail });
      }
    };

    // -------------------------------------------------------------
    // A. RUNTIME & GLOBAL BINDINGS AUDIT
    // -------------------------------------------------------------
    const sbClient = window.supabase || (typeof supabaseClient !== "undefined" ? supabaseClient : null);
    addCheck(report.runtime, "Supabase Client (`window.supabase`)", !!sbClient, sbClient ? "พร้อมใช้งาน" : "ไม่พบ Instance");
    addCheck(report.runtime, "GSAP Engine (`window.gsap`)", !!window.gsap, window.gsap ? "พร้อมใช้งาน" : "ไม่พบ GSAP");
    addCheck(report.runtime, "ScrollTrigger (`window.ScrollTrigger`)", !!window.ScrollTrigger, window.ScrollTrigger ? "พร้อมใช้งาน" : "ไม่พบ Plugin");
    addCheck(report.runtime, "Global Function: `handleLikeClick`", typeof window.handleLikeClick === "function", typeof window.handleLikeClick === "function" ? "พร้อม" : "ไม่พบ");
    addCheck(report.runtime, "Global Function: `openFilterModal`", typeof window.openFilterModal === "function", typeof window.openFilterModal === "function" ? "พร้อม" : "ไม่พบ");
    addCheck(report.runtime, "Global Function: `closeFilterModal`", typeof window.closeFilterModal === "function", typeof window.closeFilterModal === "function" ? "พร้อม" : "ไม่พบ");

    // -------------------------------------------------------------
    // B. DOM NODES AUDIT
    // -------------------------------------------------------------
    const domTargets = [
      { id: "page-header", name: "Header หลัก (#page-header)" },
      { id: "menu-toggle", name: "ปุ่มเปิดเมนูมือถือ (#menu-toggle)" },
      { id: "sidebar-menu", name: "เมนู Sidebar มือถือ (#sidebar-menu)" },
      { id: "search-form", name: "ฟอร์มค้นหาซ่อน (#search-form)" },
      { id: "search-keyword", name: "Input คำค้นหา (#search-keyword)" },
      { id: "search-province", name: "Input จังหวัด (#search-province)" },
      { id: "profiles-display-area", name: "พื้นที่แสดงการ์ดโปรไฟล์ (#profiles-display-area)" },
      { id: "filter-modal-overlay", name: "หน้าต่าง Modal ตัวกรอง (#filter-modal-overlay)" },
      { id: "lightbox", name: "หน้าต่าง Modal Lightbox (#lightbox)" },
      { id: "review-form", name: "ฟอร์มเขียนรีวิว (#review-form)" }
    ];

    domTargets.forEach(t => {
      const el = document.getElementById(t.id);
      addCheck(report.dom, t.name, !!el, el ? "พบในระบบ" : "ไม่พบ (MISSING)");
    });

    // -------------------------------------------------------------
    // C. SUPABASE DATABASE (SAFE TIMEOUT)
    // -------------------------------------------------------------
    const t0 = performance.now();
    try {
      if (!sbClient) throw new Error("ไม่พบ Supabase Client Object");

      const sbQueryTask = Promise.all([
        sbClient.from("profiles").select("id", { count: "exact", head: true }).eq("active", true),
        sbClient.from("provinces").select("id", { count: "exact", head: true })
      ]);

      const res = await withTimeout(sbQueryTask, 2500, null);

      report.supabase.latency = `${Math.round(performance.now() - t0)}ms`;
      if (!res) throw new Error("Supabase Query Timeout (ตอบสนองช้าเกิน 2.5 วินาที)");

      const [pRes, provRes] = res;
      report.supabase.profiles = pRes?.count || 0;
      report.supabase.provinces = provRes?.count || 0;

      addCheck(report.runtime, "Supabase Database Ping", true, `ตอบสนองใน ${report.supabase.latency}`);
    } catch (err) {
      report.supabase.pass = false;
      report.supabase.error = err.message || String(err);
      addCheck(report.runtime, "Supabase Database Connection", false, report.supabase.error);
    }

    // -------------------------------------------------------------
    // D. STORAGE & INDEXEDDB
    // -------------------------------------------------------------
    try {
      localStorage.setItem("__test_item__", "1");
      localStorage.removeItem("__test_item__");
      report.storage.localStorage = true;
      addCheck(report.runtime, "LocalStorage Access", true, "ปกติ");
    } catch (e) {
      addCheck(report.runtime, "LocalStorage Access", false, "ถูกบล็อก");
    }

    try {
      const idbTask = new Promise((res) => {
        const idbReq = indexedDB.open("FirstModelHubDB", 3);
        idbReq.onsuccess = () => res(true);
        idbReq.onerror = () => res(false);
        idbReq.onblocked = () => res(false);
      });
      const idbOk = await withTimeout(idbTask, 1500, false);
      report.storage.indexedDB = idbOk;
      addCheck(report.runtime, "IndexedDB Cache (`FirstModelHubDB`)", idbOk, idbOk ? "ปกติ" : "ไม่ตอบสนอง");
    } catch (e) {
      addCheck(report.runtime, "IndexedDB Cache (`FirstModelHubDB`)", false, "เกิดข้อผิดพลาด");
    }

    // -------------------------------------------------------------
    // E. 🎯 DEEP ON-PAGE SEO & TEXT ARCHITECTURE AUDIT
    // -------------------------------------------------------------
    const title = document.title || "";
    const titleLen = title.trim().length;
    const isTitleGood = titleLen >= 30 && titleLen <= 70 && !title.includes("{{");
    addCheck(report.seoText, "Document Title Length (30-70 ตัวอักษร)", isTitleGood, `ความยาว ${titleLen} ตัวอักษร ("${title.slice(0, 30)}...")`, true);

    const desc = document.querySelector('meta[name="description"]')?.content || "";
    const descLen = desc.trim().length;
    const isDescGood = descLen >= 80 && descLen <= 170 && !desc.includes("{{");
    addCheck(report.seoText, "Meta Description Length (80-170 ตัวอักษร)", isDescGood, `ความยาว ${descLen} ตัวอักษร`, true);

    const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
    const isCanonicalGood = !!canonical && !canonical.includes("{{");
    addCheck(report.seoText, "Canonical URL Tag", isCanonicalGood, canonical || "ไม่มี Canonical Tag", true);

    const h1Tags = document.querySelectorAll('h1');
    const isH1Good = h1Tags.length === 1;
    addCheck(report.seoText, "H1 Tag Hierarchy (ต้องมี 1 แท็กพอดี)", isH1Good, `พบทั้งหมด ${h1Tags.length} แท็ก H1`, true);

    const h2Tags = document.querySelectorAll('h2');
    addCheck(report.seoText, "H2 Section Headings (โครงสร้างหัวข้อย่อย)", h2Tags.length >= 2, `พบ ${h2Tags.length} แท็ก H2 ในหน้าเว็บ`, true);

    // Unreplaced Placeholder Check
    const pageHtml = document.body ? document.body.innerHTML : "";
    const placeholderMatches = pageHtml.match(/\{\{[A-Z0-9_]+\}\}/g) || [];
    const uniquePlaceholders = Array.from(new Set(placeholderMatches));
    const noPlaceholdersLeft = uniquePlaceholders.length === 0;
    addCheck(report.seoText, "ตรวจจับ Template Tag ตกค้าง (`{{...}}`)", noPlaceholdersLeft, 
      noPlaceholdersLeft ? "สมบูรณ์ (ไม่พบแท็กหลงเหลือ)" : `พบหลงเหลือ: ${uniquePlaceholders.join(", ")}`, true);

    // -------------------------------------------------------------
    // F. 🕸️ SCHEMA JSON-LD GRAPH & RICH SNIPPETS AUDIT
    // -------------------------------------------------------------
    const schemaScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    let hasProductSchema = false, hasBreadcrumbSchema = false, hasFaqSchema = false, hasOrgSchema = false;

    schemaScripts.forEach(script => {
      try {
        const text = script.textContent || "";
        if (text.includes("Product") || text.includes("ProfilePage") || text.includes("CollectionPage")) hasProductSchema = true;
        if (text.includes("BreadcrumbList")) hasBreadcrumbSchema = true;
        if (text.includes("FAQPage")) hasFaqSchema = true;
        if (text.includes("Organization") || text.includes("EntertainmentBusiness")) hasOrgSchema = true;
      } catch (e) {}
    });

    addCheck(report.seoSchema, "Schema: Product / Collection / Profile", hasProductSchema, hasProductSchema ? "ปลดล็อกดาวสีทอง Google SERP" : "ไม่พบ Schema หมวดนี้", true);
    addCheck(report.seoSchema, "Schema: BreadcrumbList (ลำดับลิงก์)", hasBreadcrumbSchema, hasBreadcrumbSchema ? "สร้างโครงสร้าง URL ให้ Google" : "ไม่พบ Breadcrumb Schema", true);
    addCheck(report.seoSchema, "Schema: FAQPage (คำถามพบบ่อย)", hasFaqSchema, hasFaqSchema ? "เพิ่มพูนเนื้อหาบน Google Snippet" : "ไม่พบ FAQ Schema", true);
    addCheck(report.seoSchema, "Schema: Organization / Business", hasOrgSchema, hasOrgSchema ? "ยืนยันความน่าเชื่อถือของแบรนด์" : "ไม่พบ Org Schema", true);

    // -------------------------------------------------------------
    // G. 🛡️ E-E-A-T & TRUST SIGNALS AUDIT
    // -------------------------------------------------------------
    const hasRules = !!document.querySelector('.rules-accordion');
    addCheck(report.eeat, "Safe-Play Framework (เงื่อนไขและกฎ)", hasRules, hasRules ? "มีส่วนระบุกฎความปลอดภัย" : "ไม่พบ", true);

    const hasTrust = !!document.getElementById('verification-process');
    addCheck(report.eeat, "Editorial Trust & Verified Process", hasTrust, hasTrust ? "มีส่วนการันตีตรงปกไม่โอนมัดจำ" : "ไม่พบ", true);

    const hasMap = !!document.getElementById('map-section');
    addCheck(report.eeat, "Google Map Service Area Embed", hasMap, hasMap ? "มีแผนที่พิกัดพื้นที่บริการ" : "ไม่พบแผนที่", true);

    const hasSocial = !!document.querySelector('.social-links-grid-wrapper');
    addCheck(report.eeat, "Social Media Links (LINE, TikTok, etc.)", hasSocial, hasSocial ? "มีช่องทางติดต่อครบถ้วน" : "ไม่พบ", true);

    // -------------------------------------------------------------
    // H. MEDIA & CORE WEB VITALS AUDIT
    // -------------------------------------------------------------
    const imgs = Array.from(document.querySelectorAll('img'));
    report.media.totalImages = imgs.length;
    imgs.forEach((img, i) => {
      if (img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:image/svg')) {
        report.media.brokenImages.push({ index: i, src: img.src });
      }
    });

    addCheck(report.media, "ตรวจสอบรูปภาพเสีย (Broken Images)", report.media.brokenImages.length === 0,
      report.media.brokenImages.length === 0 ? `ตรวจสอบทั้งหมด ${imgs.length} รูป (ปกติ)` : `พบรูปเสีย ${report.media.brokenImages.length} รูป`);

    return report;
  };

  // 5. RENDER DIAGNOSTIC DASHBOARD
  window.scanSystemUI = async function () {
    try {
      injectStyles();
      injectUI();

      const modal = document.getElementById('scanner-modal');
      const body = document.getElementById('scanner-modal-body');
      modal.classList.add('active');

      body.innerHTML = `
        <div style="text-align: center; padding: 50px 10px;">
          <div style="font-size: 32px; margin-bottom: 10px;">🛡️</div>
          <div style="color: #38BDF8; font-weight: 800; font-size: 15px;">กำลังสแกนวิเคราะห์เชิงลึกทั้งระบบ & SEO...</div>
          <div style="color: #94A3B8; font-size: 12px; margin-top: 6px;">(ตรวจสอบ DOM, Supabase, SEO Text, Schema Graph, E-E-A-T และ JS Runtime)</div>
        </div>
      `;

      const r = await window.runSystemScan();

      let sysScoreColor = "#34D399";
      if (r.healthScore < 80) sysScoreColor = "#FDE047";
      if (r.healthScore < 60) sysScoreColor = "#FCA5A5";

      let seoScoreColor = "#34D399";
      if (r.seoScore < 80) seoScoreColor = "#FDE047";
      if (r.seoScore < 60) seoScoreColor = "#FCA5A5";

      let html = `
        <!-- DUAL SCORE CARDS -->
        <div class="scanner-scores-wrapper">
          <div class="score-box-card" style="background: linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%); border-color: #4338CA;">
            <div>
              <div style="font-size: 11px; color: #A5B4FC; font-weight: 700;">SYSTEM HEALTH SCORE</div>
              <div style="font-size: 26px; font-weight: 900; color: ${sysScoreColor}; margin-top: 2px;">
                ${r.healthScore}%
              </div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #94A3B8;">
              ระบบ & DB สมบูรณ์
            </div>
          </div>

          <div class="score-box-card" style="background: linear-gradient(135deg, #31103F 0%, #0F172A 100%); border-color: #831843;">
            <div>
              <div style="font-size: 11px; color: #F472B6; font-weight: 700;">SEO POWER SCORE</div>
              <div style="font-size: 26px; font-weight: 900; color: ${seoScoreColor}; margin-top: 2px;">
                ${r.seoScore}%
              </div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #94A3B8;">
              ความแข็งแกร่ง SEO
            </div>
          </div>
        </div>

        <div class="scanner-stats-grid">
          <div class="scanner-stat-box">
            <div class="scanner-stat-label">Supabase Latency</div>
            <div class="scanner-stat-val" style="color: ${r.supabase.pass ? '#34D399' : '#FCA5A5'};">
              ${r.supabase.pass ? r.supabase.latency : 'ERROR'}
            </div>
          </div>
          <div class="scanner-stat-box">
            <div class="scanner-stat-label">องค์ประกอบ DOM</div>
            <div class="scanner-stat-val" style="color: ${r.dom.pass ? '#34D399' : '#FCA5A5'};">
              ${r.dom.items.filter(i=>i.pass).length}/${r.dom.items.length}
            </div>
          </div>
          <div class="scanner-stat-box">
            <div class="scanner-stat-label">รูปภาพเสีย (Broken)</div>
            <div class="scanner-stat-val" style="color: ${r.media.brokenImages.length === 0 ? '#34D399' : '#FCA5A5'};">
              ${r.media.brokenImages.length} รูป
            </div>
          </div>
          <div class="scanner-stat-box">
            <div class="scanner-stat-label">JS Runtime Errors</div>
            <div class="scanner-stat-val" style="color: ${r.jsErrors.length === 0 ? '#34D399' : '#FCA5A5'};">
              ${r.jsErrors.length} ข้อผิดพลาด
            </div>
          </div>
        </div>

        <!-- SEO TEXT & ON-PAGE AUDIT -->
        <div class="scanner-table-wrapper">
          <div class="scanner-table-title">
            <span>🎯 On-Page SEO & Content Architecture</span>
            <span class="${r.seoText.pass ? 'badge-pass' : 'badge-warn'}">${r.seoText.pass ? 'สมบูรณ์' : 'ควรปรับปรุง'}</span>
          </div>
          <table class="scanner-table">
            <thead><tr><th>รายการตรวจสอบ SEO</th><th>สถานะ</th><th>รายละเอียด / ค่าที่วัดได้</th></tr></thead>
            <tbody>
              ${r.seoText.items.map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.pass ? '<span class="badge-pass">🟢 ดีเยี่ยม</span>' : '<span class="badge-warn">🟡 ปรับปรุง</span>'}</td>
                  <td style="color: #E2E8F0;">${i.detail}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- SCHEMA JSON-LD GRAPH AUDIT -->
        <div class="scanner-table-wrapper">
          <div class="scanner-table-title">
            <span>🕸️ Schema JSON-LD Graph (Google Rich Snippets)</span>
            <span class="${r.seoSchema.pass ? 'badge-pass' : 'badge-warn'}">${r.seoSchema.pass ? 'สมบูรณ์' : 'ควรตรวจสอบ'}</span>
          </div>
          <table class="scanner-table">
            <thead><tr><th>ประเภท Schema</th><th>สถานะ</th><th>ผลต่อการแสดงผลบน Google</th></tr></thead>
            <tbody>
              ${r.seoSchema.items.map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.pass ? '<span class="badge-pass">🟢 มีในระบบ</span>' : '<span class="badge-fail">🔴 ไม่พบ</span>'}</td>
                  <td style="color: #E2E8F0;">${i.detail}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- E-E-A-T & TRUST AUDIT -->
        <div class="scanner-table-wrapper">
          <div class="scanner-table-title">
            <span>🛡️ Google E-E-A-T & Trust Signals Audit</span>
            <span class="${r.eeat.pass ? 'badge-pass' : 'badge-warn'}">${r.eeat.pass ? 'สมบูรณ์' : 'ควรตรวจสอบ'}</span>
          </div>
          <table class="scanner-table">
            <thead><tr><th>สัญญาณความน่าเชื่อถือ</th><th>สถานะ</th><th>รายละเอียด</th></tr></thead>
            <tbody>
              ${r.eeat.items.map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.pass ? '<span class="badge-pass">🟢 ผ่าน</span>' : '<span class="badge-warn">🟡 ไม่พบ</span>'}</td>
                  <td style="color: #E2E8F0;">${i.detail}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- RUNTIME & GLOBALS TABLE -->
        <div class="scanner-table-wrapper">
          <div class="scanner-table-title">
            <span>🤖 การผูกตัวแปร Runtime & Global Functions</span>
            <span class="${r.runtime.pass ? 'badge-pass' : 'badge-fail'}">${r.runtime.pass ? 'ผ่าน' : 'มีข้อผิดพลาด'}</span>
          </div>
          <table class="scanner-table">
            <thead><tr><th>รายการตรวจสอบ</th><th>สถานะ</th><th>รายละเอียด</th></tr></thead>
            <tbody>
              ${r.runtime.items.map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.pass ? '<span class="badge-pass">🟢 ปกติ</span>' : '<span class="badge-fail">🔴 ไม่พบ</span>'}</td>
                  <td style="color: ${i.pass ? '#94A3B8' : '#FCA5A5'};">${i.detail}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- DOM NODES TABLE -->
        <div class="scanner-table-wrapper">
          <div class="scanner-table-title">
            <span>🧱 ความถูกต้องของโครงสร้าง DOM Elements</span>
            <span class="${r.dom.pass ? 'badge-pass' : 'badge-fail'}">${r.dom.items.filter(i=>i.pass).length}/${r.dom.items.length} พบในระบบ</span>
          </div>
          <table class="scanner-table">
            <thead><tr><th>ชื่อองค์ประกอบ</th><th>สถานะ</th><th>การประเมิน</th></tr></thead>
            <tbody>
              ${r.dom.items.map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.pass ? '<span class="badge-pass">🟢 พบในระบบ</span>' : '<span class="badge-fail">🔴 MISSING</span>'}</td>
                  <td style="color: ${i.pass ? '#94A3B8' : '#FCA5A5'};">${i.detail}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      if (r.jsErrors.length > 0) {
        html += `
          <div class="scanner-table-wrapper" style="border-color: #991B1B;">
            <div class="scanner-table-title" style="background: #450A0A; color: #FCA5A5;">⚠️ รายการ JavaScript Runtime Errors</div>
            <table class="scanner-table">
              <thead><tr><th>เวลา</th><th>ประเภท</th><th>รายละเอียดข้อผิดพลาด</th><th>ไฟล์/บรรทัด</th></tr></thead>
              <tbody>
                ${r.jsErrors.map(e => `
                  <tr>
                    <td style="color: #94A3B8;">${e.time}</td>
                    <td><span class="badge-fail">${e.type}</span></td>
                    <td style="color: #FCA5A5;">${e.msg}</td>
                    <td style="color: #CBD5E1;">${e.src}:${e.line}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }

      body.innerHTML = html;

    } catch (fatalErr) {
      console.error("Scanner Engine Fatal Error:", fatalErr);
      const body = document.getElementById('scanner-modal-body');
      if (body) {
        body.innerHTML = `
          <div style="padding: 30px 10px; text-align: center; color: #FCA5A5;">
            <div style="font-size: 36px; margin-bottom: 10px;">⚠️</div>
            <h3 style="font-size: 16px; font-weight: 800; margin: 0 0 8px 0; color: #FFF;">เกิดข้อผิดพลาดในการสแกนวิเคราะห์</h3>
            <p style="font-size: 12px; color: #FCA5A5; background: rgba(153,27,27,0.3); padding: 12px; border-radius: 8px; border: 1px solid #991B1B; text-align: left; word-break: break-all;">
              ${fatalErr.message || String(fatalErr)}
            </p>
            <button type="button" onclick="window.scanSystemUI()" class="btn-scan" style="margin-top: 16px;">🔄 ลองใหม่อีกครั้ง</button>
          </div>
        `;
      }
    }
  };

  // 6. Safe Auto Initialization
  const initScannerEngine = () => {
    injectStyles();
    injectUI();
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initScannerEngine);
  } else {
    initScannerEngine();
  }
})();