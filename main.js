import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";

gsap.registerPlugin(ScrollTrigger);

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
    const STORAGE_BUCKET = 'profile-images';
    const PROFILES_PER_PAGE = 20;
    const PROFILES_PER_PROVINCE_ON_INDEX = 20;
    const SKELETON_CARD_COUNT = 20;
    const LAST_PROVINCE_KEY = 'sidelinecm_last_province'; // Key for localStorage

    // --- STATE & CACHE ---
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    let allProfiles = [];
    let provincesMap = new Map();
    let lastFocusedElement;

    // --- DOM ELEMENT CACHE ---
    const dom = {
        body: document.body,
        pageHeader: document.getElementById('page-header'),
        loadingPlaceholder: document.getElementById('loading-profiles-placeholder'),
        profilesDisplayArea: document.getElementById('profiles-display-area'),
        noResultsMessage: document.getElementById('no-results-message'),
        fetchErrorMessage: document.getElementById('fetch-error-message'),
        retryFetchBtn: document.getElementById('retry-fetch-btn'),
        searchForm: document.getElementById('search-form'),
        searchInput: document.getElementById('search-keyword'),
        provinceSelect: document.getElementById('search-province'),
        availabilitySelect: document.getElementById('search-availability'),
        featuredSelect: document.getElementById('search-featured'),
        resetSearchBtn: document.getElementById('reset-search-btn'),
        featuredSection: document.getElementById('featured-profiles'),
        featuredContainer: document.getElementById('featured-profiles-container'),
        // suggestion container will be added dynamically if needed
    };

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', main);

async function main() {
    try {
        // ฟังก์ชันหลักทั้งหมดของเว็บ
        initThemeToggle();
        initMobileMenu();
        initAgeVerification();
        initHeaderScrollEffect();
        updateActiveNavLinks();
        generateFullSchema();
        
        // ❌ ปิดระบบหมุน 3D ของการ์ดโปรไฟล์ (ป้องกันภาพหมุน)
        // init3dCardHover();

        const currentPage = dom.body.dataset.page;

        if (currentPage === 'home' || currentPage === 'profiles') {
            showLoadingState();
            const success = await fetchData();
            hideLoadingState();

            if (success) {
                initSearchAndFilters(); // ใช้งานระบบค้นหาและกรองตามปกติ
                initLightbox();

                if (dom.retryFetchBtn) {
                    dom.retryFetchBtn.addEventListener('click', async () => {
                        showLoadingState();
                        const retrySuccess = await fetchData();
                        hideLoadingState();

                        if (retrySuccess) {
                            applyFilters(false); // โหลดข้อมูลใหม่แต่ไม่รีเฟรช URL
                            if (dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'none';
                        } else {
                            showErrorState();
                        }
                    });
                }
            } else {
                showErrorState();
            }

            // แอนิเมชันเปิดหน้าแรก (ยังคงไว้เหมือนเดิม)
            if (currentPage === 'home' && success) {
                gsap.from(['#hero-h1', '#hero-p', '#hero-form'], {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power2.out',
                    delay: 0.3
                });
            }

        } else {
            // หน้าภายในอื่น ๆ ใช้ระบบ scroll animation ตามปกติ
            initScrollAnimations();
        }

        // อัปเดตปีปัจจุบันอัตโนมัติ
        const yearSpan = document.getElementById('currentYearDynamic');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        // เมื่อทุกอย่างพร้อมแล้ว ค่อยโชว์เว็บ
        dom.body.classList.add('loaded');

    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

    // --- UI STATE FUNCTIONS ---
    function showLoadingState() {
        if(dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'none';
        if(dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
        if(dom.profilesDisplayArea) dom.profilesDisplayArea.innerHTML = '';
        if(dom.loadingPlaceholder) {
            const grid = dom.loadingPlaceholder.querySelector('.grid');
            if (grid) {
                grid.innerHTML = Array(SKELETON_CARD_COUNT).fill('<div class="skeleton-card"></div>').join('');
            }
            dom.loadingPlaceholder.style.display = 'block';
        }
    }
    
    function hideLoadingState() {
        if(dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
    }

    function showErrorState() {
        if(dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
        if(dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'block';
    }

async function fetchData() {
  try {
    // --- 1. ตรวจสอบโหมดการดึงข้อมูล ---
    const lastFetchTimeStr = localStorage.getItem('lastFetchTime');
    const isFullSync = !lastFetchTimeStr;
    const fetchTimeKey = lastFetchTimeStr || '1970-01-01T00:00:00.000Z';

    // --- 2. ดึงข้อมูลจาก Supabase ---
    const [profilesRes, provincesRes] = await Promise.all([
      supabase.from('profiles').select('*').gt('lastUpdated', fetchTimeKey),
      supabase.from('provinces').select('*').order('nameThai', { ascending: true })
    ]);
    if (profilesRes.error || !profilesRes.data) throw profilesRes.error;
    if (provincesRes.error || !provincesRes.data) throw provincesRes.error;

    const deltaProfiles = profilesRes.data;

    // --- 3. จัดการข้อมูลจังหวัด ---
    provincesMap.clear();
    provincesRes.data.forEach(p => {
      if (p?.key && p?.nameThai) {
        provincesMap.set(p.key, p.nameThai);
      }
    });

    // --- 4. รวมข้อมูลโปรไฟล์ (ทั้งเก่าและใหม่) ---
    let currentProfiles = [];
    if (isFullSync) {
      currentProfiles = deltaProfiles;
    } else {
      const cachedProfilesJSON = localStorage.getItem('cachedProfiles');
      if (cachedProfilesJSON) {
        try {
          const cachedProfiles = JSON.parse(cachedProfilesJSON);
          const deltaIds = new Set(deltaProfiles.map(p => p.id));
          // กรองข้อมูลเก่าไม่ซ้ำ
          currentProfiles = cachedProfiles.filter(p => !deltaIds.has(p.id));
          // รวมข้อมูลใหม่
          currentProfiles.push(...deltaProfiles);
        } catch (e) {
          console.error("Cache เสียหาย ล้าง cache เพื่อ full sync ครั้งถัดไป");
          localStorage.removeItem('lastFetchTime');
          localStorage.removeItem('cachedProfiles');
          currentProfiles = deltaProfiles;
        }
      } else {
        currentProfiles = deltaProfiles;
      }
    }

    // --- 5. ประมวลผลข้อมูลโปรไฟล์ ---
    allProfiles = currentProfiles.map(p => {
      const imagePaths = [p.imagePath, ...(Array.isArray(p.galleryPaths) ? p.galleryPaths : [])].filter(Boolean);

      const imageObjects = imagePaths.map(path => {
        const publicUrlData = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        let originalUrl = publicUrlData?.data?.publicUrl || '/images/placeholder-profile-card.webp';

        let urlSeparator = '?';
        if (p.lastUpdated) {
          const timestampInSeconds = Math.floor(new Date(p.lastUpdated).getTime() / 1000);
          originalUrl = `${originalUrl}${urlSeparator}v=${timestampInSeconds}`;
          urlSeparator = '&';
        }

        const srcset = [300, 600, 900]
          .map(w => `${originalUrl}${urlSeparator}width=${w}&quality=80 ${w}w`)
          .join(', ');

        return {
          src: `${originalUrl}${urlSeparator}width=600&quality=80`,
          srcset,
        };
      });
      if (imageObjects.length === 0) {
        imageObjects.push({ src: '/images/placeholder-profile.webp', srcset: '' });
      }

      const provinceName = provincesMap.get(p.provinceKey) || '';
      const altText = p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name} จังหวัด ${provinceName}`;

      return { ...p, images: imageObjects, altText };
    });

    // สร้าง Index จังหวัด
    window.indexByProvince = new Map();
    allProfiles.forEach(p => {
      if (p.provinceKey) {
        if (!window.indexByProvince.has(p.provinceKey)) {
          window.indexByProvince.set(p.provinceKey, []);
        }
        window.indexByProvince.get(p.provinceKey).push(p);
      }
    });

    // --- 6. บันทึก cache และ lastFetchTime ---
    if (allProfiles.length > 0) {
      localStorage.setItem('cachedProfiles', JSON.stringify(currentProfiles));
      if (deltaProfiles.length > 0) {
        const maxTime = Math.max(...deltaProfiles.map(p => new Date(p.lastUpdated).getTime()));
        if (maxTime && !isNaN(maxTime)) {
          localStorage.setItem('lastFetchTime', new Date(maxTime).toISOString());
        }
      }
    }

    // --- 7. สร้าง dropdown จังหวัด ถ้ายังไม่มี ---
    if (dom.provinceSelect && dom.provinceSelect.options.length <= 1) {
      provincesRes.data.forEach(prov => {
        if (prov?.key && prov?.nameThai) {
          const option = document.createElement('option');
          option.value = prov.key;
          option.textContent = prov.nameThai;
          dom.provinceSelect.appendChild(option);
        }
      });
    }

    // เรียกแสดงข้อมูลทั้งหมด
    renderAllProfiles();

    return true;
  } catch (err) {
    console.error('fetchData error:', err);
    localStorage.removeItem('lastFetchTime');
    localStorage.removeItem('cachedProfiles');
    allProfiles = [];
    window.indexByProvince = new Map();
    return false;
  }
}
// --- SEARCH & FILTERS ---
function initSearchAndFilters() {
    if (!dom.searchForm) {
        applyFilters(false);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    dom.searchInput.value = urlParams.get('q') || '';
    dom.provinceSelect.value = urlParams.get('province') || '';
    dom.availabilitySelect.value = urlParams.get('availability') || '';
    dom.featuredSelect.value = urlParams.get('featured') || '';

    if (!dom.provinceSelect.value) {
        const lastProvince = localStorage.getItem(LAST_PROVINCE_KEY);
        if (lastProvince) {
            dom.provinceSelect.value = lastProvince;
        }
    }

    const debouncedFilter = (() => {
        let timeout;
        return () => { clearTimeout(timeout); timeout = setTimeout(() => applyFilters(true), 350); };
    })();

    dom.searchForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(true); });
    if (dom.resetSearchBtn) {
        dom.resetSearchBtn.addEventListener('click', () => {
            resetFilters();
            applyFilters(true);
        });
    }

    if (dom.searchInput) dom.searchInput.addEventListener('input', () => {
        updateSuggestions();
        debouncedFilter();
    });
    if (dom.provinceSelect) dom.provinceSelect.addEventListener('change', debouncedFilter);
    if (dom.availabilitySelect) dom.availabilitySelect.addEventListener('change', debouncedFilter);
    if (dom.featuredSelect) dom.featuredSelect.addEventListener('change', debouncedFilter);

    ensureSuggestionContainer();

    applyFilters(false);
}

function resetFilters() {
    dom.searchInput.value = '';
    dom.provinceSelect.value = '';
    dom.availabilitySelect.value = '';
    dom.featuredSelect.value = '';
    localStorage.removeItem(LAST_PROVINCE_KEY);
    if (dom.searchSuggestions) dom.searchSuggestions.style.display = 'none';
    console.log("All filters have been reset.");
}

function normalize(v) {
    if (v === undefined || v === null) return '';
    if (Array.isArray(v)) return v.join(' ').toString().toLowerCase();
    return String(v).toLowerCase();
}

function parseSearchQuery(term) {
    const parts = term.split(/\s+/).filter(Boolean);
    const kv = [];
    const tokens = [];
    for (const p of parts) {
        const m = p.match(/^([a-zA-Z_]+):(.+)$/);
        if (m) {
            const key = m[1].toLowerCase();
            let val = m[2];
            const rangeMatch = val.match(/^(\d+)-(\d+)$/);
            const ltMatch = val.match(/^<(\d+)$/);
            const gtMatch = val.match(/^>(\d+)$/);
            if (rangeMatch) {
                kv.push({ key, type: 'range', min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) });
            } else if (ltMatch) {
                kv.push({ key, type: 'lt', value: Number(ltMatch[1]) });
            } else if (gtMatch) {
                kv.push({ key, type: 'gt', value: Number(gtMatch[1]) });
            } else if (val === 'true' || val === 'false') {
                kv.push({ key, type: 'bool', value: val === 'true' });
            } else {
                const list = val.split(',').map(x=>x.trim()).filter(Boolean);
                kv.push({ key, type: 'list', value: list });
            }
        } else {
            tokens.push(p.toLowerCase());
        }
    }
    return { tokens, kv };
}

function matchesProfile(profile, parsed) {
    for (const clause of parsed.kv) {
        const k = clause.key;
        if (k === 'province' || k === 'provincekey') {
            const val = normalize(profile.provinceKey);
            if (clause.type === 'list') {
                if (!clause.value.some(v => val === v.toLowerCase())) return false;
            } else {
                if (!val.includes(String(clause.value).toLowerCase())) return false;
            }
        } else if (k === 'age') {
            const age = Number(profile.age) || 0;
            if (clause.type === 'range') {
                if (age < clause.min || age > clause.max) return false;
            } else if (clause.type === 'lt') {
                if (!(age < clause.value)) return false;
            } else if (clause.type === 'gt') {
                if (!(age > clause.value)) return false;
            } else if (clause.type === 'list') {
                if (!clause.value.some(v => Number(v) === age)) return false;
            } else if (clause.type === 'bool') {
                return false;
            } else {
                if (Number(clause.value) !== age) return false;
            }
        } else if (k === 'featured' || k === 'isfeatured') {
            const want = clause.type === 'bool' ? clause.value : (String(clause.value[0]) === 'true');
            if (Boolean(profile.isfeatured) !== want) return false;
        } else if (k === 'tag' || k === 'style' || k === 'styletag' || k === 'tags') {
            const tags = (profile.styleTags || []).map(t=>t.toLowerCase());
            const list = clause.type === 'list' ? clause.value : [clause.value];
            if (!list.some(v => tags.some(t => t.includes(v.toLowerCase())))) return false;
        } else if (k === 'rate' || k === 'price') {
            const rate = Number(profile.rate) || 0;
            if (clause.type === 'range') {
                if (rate < clause.min || rate > clause.max) return false;
            } else if (clause.type === 'lt') {
                if (!(rate < clause.value)) return false;
            } else if (clause.type === 'gt') {
                if (!(rate > clause.value)) return false;
            } else if (clause.type === 'list') {
                if (!clause.value.some(v => Number(v) === rate)) return false;
            } else {
                if (rate !== Number(clause.value)) return false;
            }
        } else if (k === 'availability') {
            const val = normalize(profile.availability);
            if (clause.type === 'list') {
                if (!clause.value.some(v => val.includes(v.toLowerCase()))) return false;
            } else {
                if (!val.includes(String(clause.value).toLowerCase())) return false;
            }
        } else {
            const pv = normalize(profile[k] ?? profile[k.toLowerCase()] ?? '');
            if (clause.type === 'list') {
                if (!clause.value.some(v => pv.includes(v.toLowerCase()))) return false;
            } else {
                if (!pv.includes(String(clause.value).toLowerCase())) return false;
            }
        }
    }

    for (const token of parsed.tokens) {
        const found =
            normalize(profile.name).includes(token) ||
            normalize(profile.description).includes(token) ||
            normalize(profile.location).includes(token) ||
            normalize(profile.quote).includes(token) ||
            normalize(profile.stats).includes(token) ||
            normalize(profile.skinTone).includes(token) ||
            normalize(profile.provinceKey).includes(token) ||
            normalize(profile.altText).includes(token) ||
            (profile.styleTags || []).some(t => normalize(t).includes(token));
        if (!found) return false;
    }
    return true;
}

    // --- SUGGESTIONS UI ---
    function ensureSuggestionContainer() {
        if (dom.searchSuggestions) return;
        const wrap = dom.searchInput?.parentElement || document.body;
        const sug = document.createElement('div');
        sug.id = 'search-suggestions';
        sug.style.position = 'absolute';
        sug.style.zIndex = 9999;
        sug.className = 'search-suggestions';
        sug.setAttribute('role','listbox');
        sug.style.display = 'none';
        wrap.appendChild(sug);
        dom.searchSuggestions = sug;
        // minimal styles
        const css = document.createElement('style');
        css.textContent = `
        .search-suggestions{background:var(--surface,white);box-shadow:0 6px 20px rgba(0,0,0,0.08);border-radius:8px;padding:6px 0;min-width:220px}
        .search-suggestions .item{padding:8px 12px;cursor:pointer}
        .search-suggestions .item:hover{background:rgba(0,0,0,0.03)}
        .search-suggestions .item small{display:block;color:var(--muted,#666);font-size:12px}
        `;
        document.head.appendChild(css);
    }

    function updateSuggestions() {
        if (!dom.searchSuggestions || !dom.searchInput) return;
        const q = dom.searchInput.value.trim().toLowerCase();
        const items = [];
        if (!q) {
            // show top suggested provinces and tags
            const provinces = [...new Set(allProfiles.map(p=>p.provinceKey).filter(Boolean))].slice(0,20);
            const tags = [...new Set(allProfiles.flatMap(p=>p.styleTags || []))].slice(0,20);
            provinces.forEach(p=>items.push({type:'province', text:`province:${p}`, hint:`จังหวัด ${provincesMap.get(p) || p}`}));
            tags.forEach(t=>items.push({type:'tag', text:`tag:${t}`, hint:`tag`}));
            items.unshift({type:'toggle', text:'featured:true', hint:'เฉพาะโปรไฟล์แนะนำ'});
        } else {
            // typed: produce suggestions from matching provinces / tags / quick toggles
            const lastPart = q.split(/\s+/).pop();
            const provinces = [...new Set(allProfiles.map(p=>p.provinceKey).filter(Boolean))]
                                .filter(x=>x.toLowerCase().includes(lastPart)).slice(0,6);
            const tags = [...new Set(allProfiles.flatMap(p=>p.styleTags || []))]
                                .filter(x=>x.toLowerCase().includes(lastPart)).slice(0,6);
            provinces.forEach(p=>items.push({type:'province', text:`province:${p}`, hint:`จังหวัด ${provincesMap.get(p) || p}`}));
            tags.forEach(t=>items.push({type:'tag', text:`tag:${t}`, hint:'tag'}));
            if ('featured'.startsWith(lastPart)) items.unshift({type:'toggle', text:'featured:true', hint:'เฉพาะโปรไฟล์แนะนำ'});
            if ('age'.startsWith(lastPart)) items.unshift({type:'template', text:'age:18-25', hint:'ช่วงอายุ'});
            if ('rate'.startsWith(lastPart) || 'price'.startsWith(lastPart)) items.unshift({type:'template', text:'rate:500-1500', hint:'ช่วงราคา'});
        }

        const container = dom.searchSuggestions;
        container.innerHTML = '';
        if (!items.length) { container.style.display='none'; return; }
        items.slice(0,20).forEach(it=>{
            const el = document.createElement('div');
            el.className='item';
            el.tabIndex = 0;
            el.innerHTML = `<div>${it.text}</div>${it.hint ? `<small>${it.hint}</small>` : ''}`;
            el.addEventListener('click', ()=> {
                dom.searchInput.value = dom.searchInput.value ? dom.searchInput.value + ' ' + it.text : it.text;
                dom.searchInput.focus();
                container.style.display = 'none';
                applyFilters(true);
            });
            el.addEventListener('keydown', (e)=> {
                if (e.key === 'Enter') { el.click(); }
            });
            container.appendChild(el);
        });
        // position under input
        const rect = dom.searchInput.getBoundingClientRect();
        container.style.left = rect.left + 'px';
        container.style.top = (rect.bottom + window.scrollY + 6) + 'px';
        container.style.minWidth = rect.width + 'px';
        container.style.display = 'block';
    }

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!dom.searchSuggestions) return;
        if (!dom.searchSuggestions.contains(e.target) && e.target !== dom.searchInput) {
            dom.searchSuggestions.style.display = 'none';
        }
    });

// ==========================================================
// 🔍 APPLY FILTERS (ใช้ smart parsing และ matchesProfile - **ADVANCED VERSION**)
// 💡 ปรับปรุงการกรองด้วย Array.prototype.every และแยก Logic การอัปเดต URL
// ==========================================================
/**
 * ประมวลผลและกรองโปรไฟล์ทั้งหมดตามตัวกรองที่เลือกและอัปเดต UI/URL
 * @param {boolean} updateUrl - กำหนดว่าจะอัปเดต URL ด้วย history.pushState หรือไม่
 */
function applyFilters(updateUrl = true) {
    // 1. **Securely Get Filter Values**
    const searchTermRaw = dom.searchInput?.value?.trim() || '';
    const selectedProvince = dom.provinceSelect?.value || '';
    const selectedAvailability = dom.availabilitySelect?.value || '';
    const isFeaturedOnly = dom.featuredSelect?.value === 'true';

    // 2. **State Persistence (LocalStorage)**
    if (selectedProvince) {
        localStorage.setItem(LAST_PROVINCE_KEY, selectedProvince);
    } else {
        localStorage.removeItem(LAST_PROVINCE_KEY);
    }

    // 3. **Smart Parsing & Filtering**
    const parsedSearch = parseSearchQuery(searchTermRaw);
    
    // **ประสิทธิภาพสูง (Optimized Filtering): ใช้ Array.prototype.every สำหรับเงื่อนไข AND**
    const filtered = allProfiles.filter(p => {
        try {
            return [
                !selectedProvince || p.provinceKey === selectedProvince,
                !selectedAvailability || p.availability === selectedAvailability,
                !isFeaturedOnly || p.isfeatured,
                !searchTermRaw || matchesProfile(p, parsedSearch)
            ].every(condition => condition); // ทุกเงื่อนไขต้องเป็นจริง (AND Logic)
        } catch (err) {
            console.error('Search match error for profile:', p, 'Error:', err);
            return false;
        }
    });

    // 4. **URL Management (SEO & User Experience)**
    if (updateUrl) {
        updateURLState({ searchTermRaw, selectedProvince, selectedAvailability, isFeaturedOnly });
    }

    // 5. **Render**
    const isSearching = !!(searchTermRaw || selectedProvince || selectedAvailability || isFeaturedOnly);
    renderProfiles(filtered, isSearching);
}

function renderAllProfiles() {
    if (!dom.profilesDisplayArea) return;
    dom.profilesDisplayArea.innerHTML = '';

    // เรียกใช้ createProfileCard สำหรับแต่ละ profile
allProfiles.forEach(profile => {

        const card = createProfileCard(profile);
        dom.profilesDisplayArea.appendChild(card);
    });
}

// ==========================================================
// 🧩 Helper: อัปเดต URL และ History State (แยก Logic จาก applyFilters)
// 💡 จัดการ Path Parameter (Province) และ Query Parameters อย่างแม่นยำ
// ==========================================================
/**
 * อัปเดต URL ให้เป็นแบบ SEO-Friendly เช่น /chiangmai แทน ?province=chiangmai
 */
function updateURLState({ searchTermRaw, selectedProvince, selectedAvailability, isFeaturedOnly }) {
    let newPath = window.location.pathname;
    
    // 1. จัดการ Path: ใช้จังหวัดเป็น Path Parameter
    if (selectedProvince) {
        newPath = `/${selectedProvince}`;
    } else {
        // ถ้าไม่มีจังหวัด ให้กลับไป Root Path (/) หรือ Path หลักที่ตั้งไว้
        // (ในกรณีนี้กำหนดให้กลับไปที่ / เสมอ หากไม่มีจังหวัดที่ถูกเลือก)
        newPath = '/'; 
    }

    // 2. จัดการ Query Parameters
    const urlParams = new URLSearchParams();
    if (searchTermRaw) urlParams.set('q', searchTermRaw);
    if (selectedAvailability) urlParams.set('availability', selectedAvailability);
    if (isFeaturedOnly) urlParams.set('featured', 'true');

    let newUrl = window.location.origin + newPath;
    const queryStr = urlParams.toString();
    if (queryStr) newUrl += `?${queryStr}`;
    
    // 3. อัปเดต URL โดยไม่ reload หน้า (history.pushState)
    if (newUrl !== window.location.href) {
        history.pushState(null, '', newUrl);
    }
}
// ==========================================================
// 🧩 Helper: Render Province Sections (ฟังก์ชันที่หายไป)
// 💡 ทำหน้าที่จัดกลุ่มโปรไฟล์ตามจังหวัด แล้วเรียกใช้ createProvinceSection
// ==========================================================
/**
 * จัดกลุ่มโปรไฟล์ตามจังหวัดและเรนเดอร์เป็นส่วนๆ
 * @param {Array} filteredProfiles - รายชื่อโปรไฟล์ที่กรองแล้ว
 * @param {HTMLElement} container - Element ที่จะใส่ Section ของจังหวัด (dom.profilesDisplayArea)
 */
function renderProfilesByProvince(filteredProfiles, container) {
  
  // 1. จัดกลุ่มโปรไฟล์ทั้งหมดตาม provinceKey
  const profilesByProvince = filteredProfiles.reduce((acc, profile) => {
    // ใช้ 'unknown' หากโปรไฟล์ใดไม่มี provinceKey
    const key = profile.provinceKey || 'unknown'; 
    (acc[key] = acc[key] || []).push(profile);
    return acc;
  }, {});

  // 2. วนลูปตาม Key ของจังหวัดที่จัดกลุ่มไว้
  Object.keys(profilesByProvince).forEach(provinceKey => {
    
    // 3. ดึงชื่อจังหวัดจริงๆ จาก 'provincesMap' ที่เราโหลดมาตอนเริ่ม
    const provinceName = provincesMap.get(provinceKey) || 'ไม่ระบุจังหวัด';
    
    // 4. ดึงรายชื่อโปรไฟล์ของจังหวัดนั้น
    const profiles = profilesByProvince[provinceKey];

    // 5. เรียกใช้ฟังก์ชัน 'createProvinceSection' ที่คุณมีอยู่แล้ว
    // เพื่อสร้าง HTML ทั้ง Section ของจังหวัดนั้น
    const provinceSectionElement = createProvinceSection(provinceKey, provinceName, profiles);
    
    // 6. เพิ่ม Section ที่สร้างเสร็จแล้วลงใน Container หลัก
    container.appendChild(provinceSectionElement);
  });
}

// ==========================================================
// 🔍 RENDERING PROFILES (Dynamic Province + SEO Optimized)
// 💡 ปรับปรุง Logic การสร้าง SEO Meta Tag และ Schema ให้แม่นยำยิ่งขึ้น
// ==========================================================
function renderProfiles(filteredProfiles, isSearching) {
    if (!dom.profilesDisplayArea) return;

    // 1. **Clear UI** (ใช้ replaceChildren เพื่อประสิทธิภาพที่สูงขึ้น)
    dom.profilesDisplayArea.replaceChildren();
    dom.noResultsMessage?.classList.add('hidden');
    
    // 2. **Featured Section Logic**
    handleFeaturedSection(isSearching);
    
    // 3. **No Results Handling**
    if (filteredProfiles.length === 0) {
        dom.noResultsMessage?.classList.remove('hidden');
        initScrollAnimations();
        return;
    }

    // 4. **Generate SEO & Page Data**
    const pageData = generatePageData(filteredProfiles, isSearching);

    // 5. **Update Meta Tags**
    updateAdvancedMeta(pageData);

    // 6. **Render UI**
    if (isSearching) {
        const searchResultWrapper = createSearchResultSection(filteredProfiles);
        dom.profilesDisplayArea.appendChild(searchResultWrapper);
    } else {
        renderProfilesByProvince(filteredProfiles, dom.profilesDisplayArea);
    }

    initScrollAnimations();
}

// ----------------------------------------------------------------------------------
// **Helper Functions ที่ได้รับการปรับปรุง Logic** (ต้องมีใน Global Scope)
// ----------------------------------------------------------------------------------

// **Helper: Featured Section** (ใช้ dom object ที่กำหนดไว้)
function handleFeaturedSection(isSearching) {
    if (dom.featuredSection) {
        const currentPage = dom.body.dataset.page || 'home';
        const featuredProfilesList = allProfiles.filter(p => p.isfeatured);

        if (currentPage === 'home' && !isSearching && featuredProfilesList.length > 0) {
            dom.featuredContainer.replaceChildren();
            const topFeaturedProfiles = featuredProfilesList.slice(0, 20);
            dom.featuredContainer.append(...topFeaturedProfiles.map(createProfileCard));
            dom.featuredSection.classList.remove('hidden');
        } else {
            dom.featuredSection.classList.add('hidden');
        }
    }
}

// **Helper: Generate SEO Data based on Context**
function generatePageData(filteredProfiles, isSearching) {
    const uniqueProvinces = [...new Set(filteredProfiles.map(p => p.province))];
    const searchTerm = dom.searchInput?.value?.trim() || '';
    const currentUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
    const defaultImage = '/images/og-default.webp';

    let title = 'รวมโปรไฟล์สาวไซด์ไลน์ทั่วประเทศ | SidelineChiangmai';
    let description = 'รวมสาวไซด์ไลน์จากทุกจังหวัดทั่วประเทศไทย อัปเดตล่าสุดทุกวัน พร้อมภาพสวยคมชัดและรายละเอียดครบถ้วน';
    let ogImage = defaultImage;

    if (filteredProfiles.length === 1 && !isSearching) {
        // หน้าโปรไฟล์เดียว
        const profile = filteredProfiles[0];
        const provinceName = provincesMap.get(profile.province) || '';
        title = `${profile.name} - โปรไฟล์สาวใน${provinceName}`;
        description = `ดูโปรไฟล์ของ ${profile.name} ใน${provinceName} อัปเดตล่าสุด พร้อมภาพและรายละเอียด`;
        ogImage = profile.image || defaultImage;
    } else if (isSearching) {
        // หน้าผลการค้นหา
        if (uniqueProvinces.length === 1) {
            const provinceName = provincesMap.get(uniqueProvinces[0]) || '';
            title = `ไซด์ไลน์${searchTerm}ใน${provinceName} - โปรไฟล์สาวสวยใน${provinceName}`;
            description = `ผลการค้นหา "${searchTerm}" ใน${provinceName} อัปเดตล่าสุด พร้อมภาพและรายละเอียด`;
        } else {
            title = `ไซด์ไลน์ รับงานฟิวแฟนตรงปก${searchTerm}ทั่วประเทศ - โปรไฟล์สาวสวยอัปเดตทุกวัน`;
            description = `รวมโปรไฟล์น้องๆ ไซด์ไลน์ "${searchTerm}" จากทั่วประเทศ อัปเดตล่าสุด พร้อมรูปภาพและข้อมูลติดต่อครบถ้วน`;
        }
        ogImage = defaultImage;
    } else if (filteredProfiles.length > 1 && uniqueProvinces.length === 1) {
        // หน้าแสดงกลุ่มในจังหวัดเดียว
        const provinceName = provincesMap.get(uniqueProvinces[0]) || '';
        title = `โปรไฟล์สาวใน${provinceName} | SidelineChiangmai`;
        description = `รวมโปรไฟล์สาวใน${provinceName} อัปเดตล่าสุด พร้อมภาพและรายละเอียด`;
        ogImage = filteredProfiles[0].image || defaultImage;
    }

    return {
        title,
        description,
        canonicalUrl: currentUrl,
        image: ogImage,
        profiles: filteredProfiles
    };
}

// **Helper: อัปเดต Meta Tags, Open Graph, Canonical และ JSON-LD Schema**
function updateAdvancedMeta({ title, description, canonicalUrl, image, profiles }) {
    document.title = title;

    const ensureMeta = (attr, value, isProperty = false) => {
        const selector = isProperty ? `meta[property="${attr}"]` : `meta[name="${attr}"]`;
        let tag = document.querySelector(selector);
        if (!tag) {
            tag = document.createElement('meta');
            if (isProperty) {
                tag.setAttribute('property', attr);
            } else {
                tag.setAttribute('name', attr);
            }
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', value);
    };

    // Meta Tags สำหรับ SEO และ Social
    ensureMeta('description', description);
    ensureMeta('og:title', title, true);
    ensureMeta('og:description', description, true);
    ensureMeta('og:image', image, true);
    ensureMeta('og:url', canonicalUrl, true);
    ensureMeta('twitter:title', title);
    ensureMeta('twitter:description', description);
    ensureMeta('twitter:image', image);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // สร้าง Schema JSON-LD สำหรับโปรไฟล์
    updateSchemaJSONLD(title, description, canonicalUrl, image, profiles);
}

// **Helper: สร้าง Schema JSON-LD สำหรับโปรไฟล์**
function updateSchemaJSONLD(title, description, canonicalUrl, image, profiles) {
    const existingSchema = document.getElementById('schema-list');
    if (existingSchema) existingSchema.remove();

    const itemListElements = profiles.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `${window.location.origin}/${p.province || ''}#${p.id || i}`,
        "item": {
            "@type": "Person",
            "name": p.name || "ไม่ระบุชื่อ",
            "image": p.image || image,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": provincesMap.get(p.province) || ""
            }
        }
    }));

    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": title,
        "description": description,
        "url": canonicalUrl,
        "itemListElement": itemListElements
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-list';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}
// ==========================================================
// 🧱 Profile Card (ไม่มี Schema) - เวอร์ชันสมบูรณ์
// ==========================================================
function createProfileCard(profile = {}) {
    const card = document.createElement('div');
    card.className = 'profile-card-new-container';

    const cardInner = document.createElement('div');
    cardInner.className = 'profile-card-new group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-800 transition-transform duration-300 hover:scale-105 hover:shadow-xl';
    cardInner.setAttribute('data-profile-id', profile.id || '');
    cardInner.setAttribute('aria-label', `ดูโปรไฟล์ของ ${profile.name || 'ไม่ระบุชื่อ'}`);
    cardInner.setAttribute('role', 'button');
    cardInner.setAttribute('tabindex', '0');

    // 🖼️ ภาพหลัก
    const mainImage = (profile.images && profile.images[0]) ? profile.images[0] : {
        src: '/images/placeholder-profile.webp',
        alt: profile.name || 'profile',
        width: 600,
        height: 800
    };
    const baseUrl = mainImage.src?.split('?')[0] || '/images/placeholder-profile.webp';

    const img = document.createElement('img');
    img.className = 'card-image w-full h-[75%] object-cover aspect-[3/4] transition-transform duration-300 ease-in-out';
    img.src = `${baseUrl}?width=400&quality=80`;
    img.srcset = `
        ${baseUrl}?width=150&quality=70 150w,
        ${baseUrl}?width=250&quality=75 250w,
        ${baseUrl}?width=600&quality=80 600w
    `;
    img.sizes = '(max-width: 640px) 150px, (max-width: 1024px) 250px, 600px';
    img.alt = mainImage.alt || `รูปโปรไฟล์ของ ${profile.name || 'ไม่ระบุชื่อ'}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = function () {
        this.src = '/images/placeholder-profile.webp';
        this.srcset = '';
    };
    cardInner.appendChild(img);

    // 🎖️ Badge (Availability)
    const badges = document.createElement('div');
    badges.className = 'absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10';

    const availSpan = document.createElement('span');
    let statusClass = 'status-inquire';
    if (profile.availability?.includes('ว่าง') || profile.availability?.includes('รับงาน')) {
        statusClass = 'status-available';
    } else if (profile.availability?.includes('ไม่ว่าง') || profile.availability?.includes('พัก')) {
        statusClass = 'status-busy';
    }
    availSpan.className = `availability-badge ${statusClass}`;
    availSpan.textContent = profile.availability || 'สอบถามคิว';
    badges.appendChild(availSpan);

    // ถ้ามีความเป็น Featured
    if (profile.isfeatured) {
        const feat = document.createElement('span');
        feat.className = 'featured-badge';
        feat.innerHTML = `<i class="fas fa-star" style="font-size:0.7em;margin-right:4px;"></i> แนะนำ`;
        badges.appendChild(feat);
    }
    cardInner.appendChild(badges);

    // 🔤 Overlay ข้อมูล
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay flex items-end p-4 bg-gradient-to-t from-black/70 via-transparent to-transparent absolute inset-0';
    const info = document.createElement('div');
    info.className = 'card-info';

    const h3 = document.createElement('h3');
    h3.className = 'text-lg sm:text-xl lg:text-2xl font-semibold text-white drop-shadow-md';
    h3.textContent = profile.name || 'ไม่ระบุชื่อ';

    const provinceName = provincesMap.get(profile.provinceKey) || 'ไม่ระบุ';
    const p = document.createElement('p');
    p.className = 'text-sm flex items-center gap-1.5 text-white/90 mt-2';
    p.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${provinceName}`;

    info.appendChild(h3);
    info.appendChild(p);
    overlay.appendChild(info);
    cardInner.appendChild(overlay);

    // 🔹 คลิกเพื่อเปิด Lightbox
    cardInner.addEventListener('click', () => {
        populateLightbox(profile);
        gsap.to("#lightbox", { opacity: 1, duration: 0.3, pointerEvents: "auto" });
        gsap.to("#lightbox-content-wrapper-el", { scale: 1, duration: 0.3 });
    });

    // 🔹 รองรับการเปิด Lightbox ด้วยคีย์ Enter
    cardInner.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            cardInner.click();
        }
    });

    card.appendChild(cardInner);
    return card;
}

// ==========================================================
// 📍 Province Section (ไม่แตะ Title/Meta แล้ว)
// ==========================================================
function createProvinceSection(key, name, provinceProfiles) {
    const totalCount = provinceProfiles.length;
    const sectionWrapper = document.createElement('div');
    sectionWrapper.className = 'section-content-wrapper';
    sectionWrapper.setAttribute('data-animate-on-scroll', '');

    sectionWrapper.innerHTML = `
        <div class="p-6 md:p-8">
            <h2 class="province-section-header flex items-center gap-2.5 text-lg font-semibold">
                📍 จังหวัด ${name}
                <span class="profile-count-badge ml-2 inline-block bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded">
                    ${totalCount} โปรไฟล์
                </span>
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
                เลือกดูน้องๆ ที่พร้อมให้บริการในพื้นที่ ${name}
            </p>
        </div>
        <div class="profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 
                    sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4 
                    px-6 md:px-8 pb-6 md:pb-8"></div>
        <div class="view-more-container px-6 md:px-8 pb-6 md:pb-8 -mt-4 text-center" style="display:none;">
            <button 
                type="button"
                class="view-more-btn inline-flex items-center gap-2 rounded-full 
                bg-gradient-to-r from-pink-500 to-pink-700 px-6 py-2 
                text-sm font-semibold text-white shadow-lg hover:from-pink-600 
                hover:to-pink-800 focus:outline-none focus:ring-2 
                focus:ring-pink-500 focus:ring-offset-2 transition-transform"
                aria-label="ดูน้องๆ ในจังหวัด ${name} ทั้งหมด">
                ดูน้องๆ ใน ${name} ทั้งหมด →
            </button>
        </div>`;

    const grid = sectionWrapper.querySelector('.profile-grid');
    const profilesToDisplay = provinceProfiles.slice(0, 20);
    grid.append(...profilesToDisplay.map(createProfileCard));

    const viewMoreContainer = sectionWrapper.querySelector('.view-more-container');
    const viewMoreBtn = sectionWrapper.querySelector('.view-more-btn');

    if (viewMoreContainer && totalCount > 20) {
        viewMoreContainer.style.display = 'block';
        viewMoreBtn.addEventListener('click', () => {
            window.location.href = `/province/${key}`;
        });
    }

    return sectionWrapper;
}

// ==========================================================
// 🔍 Search Result Section
// ==========================================================
function createSearchResultSection(profiles = []) {
    const wrapper = document.createElement('div');
    wrapper.className = 'section-content-wrapper';
    wrapper.setAttribute('data-animate-on-scroll', '');
    const count = Array.isArray(profiles) ? profiles.length : 0;

    wrapper.innerHTML = `
      <div class="p-6 md:p-8">
        <h3 class="search-results-header">ผลการค้นหา</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          ${count > 0 ? `พบ <span class="search-count-highlight">${count}</span> โปรไฟล์ที่ตรงกับเงื่อนไข` : 'ไม่พบโปรไฟล์ที่ตรงกับเงื่อนไข'}
        </p>
      </div>
      <div class="profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 
                  sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4 
                  px-6 md:px-8 pb-6 md:pb-8"></div>
    `;

    const grid = wrapper.querySelector('.profile-grid');
    if (count > 0) {
        grid.append(...profiles.map(createProfileCard));
    }
    return wrapper;
}

// ==========================================================
// 🧠 Utilities
// ==========================================================
function updateMetaDescription(content) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = content;
}

    // --- OTHER INITIALIZERS & UTILITIES ---

    // ✅ [UX] Initialize 3D hover effect for profile cards
    function init3dCardHover() {
        document.body.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.profile-card-new');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -7; // Max rotation 7 degrees
                const rotateY = ((x - centerX) / centerX) * 7;  // Max rotation 7 degrees

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                card.style.setProperty('--rotate-x', `${rotateX}deg`);
                card.style.setProperty('--rotate-y', `${rotateY}deg`);
            });
        });
    }

    // ... (The rest of the initializers remain the same) ...
    function initThemeToggle() {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    if (themeToggleBtns.length === 0) return;
    const html = document.documentElement;
    const sunIcon = `<svg class="sun-icon text-lg" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg class="moon-icon text-lg" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const applyTheme = (theme) => {
        html.classList.toggle('dark', theme === 'dark');
        themeToggleBtns.forEach(btn => {
            btn.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
        });
    };
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });
}
    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const closeSidebarBtn = document.getElementById('close-sidebar-btn');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('menu-backdrop');
        if (!menuToggle || !sidebar || !backdrop || !closeSidebarBtn) return;
        const openMenu = () => {
            sidebar.classList.add('open');
            sidebar.setAttribute('aria-hidden', 'false');
            sidebar.classList.remove('translate-x-full');
            backdrop.classList.remove('hidden');
            gsap.to(backdrop, { opacity: 1, duration: 0.3 });
            dom.body.style.overflow = 'hidden';
            sidebar.focus();
        };
        const closeMenu = () => {
            sidebar.classList.remove('open');
            gsap.to(backdrop, {
                opacity: 0, duration: 0.3, onComplete: () => {
                    backdrop.classList.add('hidden');
                    sidebar.classList.add('translate-x-full');
                    sidebar.setAttribute('aria-hidden', 'true');
                    dom.body.style.overflow = '';
                }
            });
        };
        menuToggle.addEventListener('click', openMenu);
        closeSidebarBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu();
        });
    }

    // ✅ ตรวจสอบและแสดง Age Verification Overlay ทุกครั้ง (ยกเว้นบอท)
    function initAgeVerification() {
  const ageKey = "ageConfirmedTimestamp";
  const now = Date.now();
  const lastConfirmed = parseInt(localStorage.getItem(ageKey), 10);
  const oneHour = 60 * 60 * 1000;

  // ✅ ถ้ามี timestamp และยังไม่หมดอายุ (ภายใน 1 ชม.)
  if (!isNaN(lastConfirmed) && now - lastConfirmed < oneHour) {
    return; // ผ่านแล้ว ไม่ต้องแสดง modal อีก
  }

  // ❌ ถ้าไม่มีข้อมูลหรือหมดอายุ ให้สร้าง modal ใหม่
  createAgeModal();
}

function createAgeModal() {
  // ลบ modal เดิมถ้ามี
  document.getElementById("age-verification-overlay")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "age-verification-overlay";
  overlay.className =
    "fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity opacity-0";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "age-modal-title");

  overlay.innerHTML = `
    <div class="age-modal-content relative space-y-6 bg-gray-900 text-white rounded-2xl p-6 max-w-md w-full shadow-2xl scale-95 opacity-0 transition-all">
      <h2 id="age-modal-title" class="text-2xl font-bold uppercase leading-tight text-center">
        <span class="text-primary">Sideline Chiangmai</span> is an Adults Only
        <span class="age-badge-inline">20+</span> Website!
      </h2>
      <p class="text-sm text-gray-300 leading-relaxed text-center">
        คุณกำลังจะเข้าสู่เว็บไซต์ที่มีเนื้อหาสำหรับผู้ใหญ่ 
        คุณควรเข้าเว็บไซต์นี้ก็ต่อเมื่อคุณมีอายุอย่างน้อย 
        <span class="font-bold text-red-400">20 ปีบริบูรณ์</span>
      </p>
      <div class="flex justify-center gap-4 pt-2">
        <button id="cancelAgeButton" class="age-btn age-btn-cancel bg-red-600 text-white px-5 py-2 rounded-full shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400">
          ออก
        </button>
        <button id="confirmAgeButton" class="age-btn age-btn-confirm bg-green-600 text-white px-5 py-2 rounded-full shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">
          ยืนยัน
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const modal = overlay.querySelector(".age-modal-content");

  // ✅ แสดง modal ด้วย animation
  requestAnimationFrame(() => {
    overlay.classList.remove("opacity-0");
    modal.classList.remove("opacity-0", "scale-95");
  });

  // 🔒 จัดการ focus trap (เข้าถึงได้)
  const focusable = modal.querySelectorAll("button");
  let focusIndex = 0;
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      focusIndex = (focusIndex + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      focusable[focusIndex].focus();
    } else if (e.key === "Escape") {
      window.location.href = "https://www.google.com";
    }
  });

  focusable[0].focus();

  const confirmBtn = modal.querySelector("#confirmAgeButton");
  const cancelBtn = modal.querySelector("#cancelAgeButton");

  const closeModal = (confirmed = false) => {
    // ✅ ถ้ากดยืนยัน → บันทึกเวลาใหม่
    if (confirmed) {
      localStorage.setItem("ageConfirmedTimestamp", Date.now().toString());
    }

    modal.classList.add("scale-95", "opacity-0");
    overlay.classList.add("opacity-0");

    setTimeout(() => {
      overlay.remove();
    }, 300);
  };

  // ✅ กดยืนยัน → บันทึก + ปิด modal
  confirmBtn.addEventListener("click", () => closeModal(true));

  // ❌ กดยกเลิก → ออกจากเว็บ
  cancelBtn.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
}

// ✅ เรียกเมื่อ DOM โหลดเสร็จ
document.addEventListener("DOMContentLoaded", initAgeVerification);

       
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const wrapper = document.getElementById('lightbox-content-wrapper-el');
        const closeBtn = document.getElementById('closeLightboxBtn');
        if (!lightbox || !wrapper || !closeBtn) return;
        const openAction = (triggerElement) => {
            if (!triggerElement) return;
            const profileId = parseInt(triggerElement.dataset.profileId, 10);
            const profileData = allProfiles.find(p => p.id === profileId);
            if (profileData) {
                lastFocusedElement = triggerElement;
                populateLightbox(profileData);
                lightbox.classList.remove('hidden');
                dom.body.style.overflow = 'hidden';
                gsap.to(lightbox, { opacity: 1, duration: 0.3 });
                gsap.fromTo(wrapper, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
                wrapper.querySelector('button, [href]')?.focus();
            }
        };
        const closeAction = () => {
            if (lightbox.classList.contains('hidden')) return;
            gsap.to(lightbox, { opacity: 0, duration: 0.3, onComplete: () => {
                lightbox.classList.add('hidden');
                dom.body.style.overflow = '';
            }});
            gsap.to(wrapper, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
            lastFocusedElement?.focus();
        };
        document.body.addEventListener('click', (event) => {
            const trigger = event.target.closest('.profile-card-new');
            if (trigger) {
                event.preventDefault();
                openAction(trigger);
            }
        });
        document.body.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && event.target.closest('.profile-card-new')) {
                event.preventDefault();
                openAction(event.target.closest('.profile-card-new'));
            } else if (event.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                closeAction();
            }
        });
        closeBtn.addEventListener('click', closeAction);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeAction(); });
    }
    
    // ✅ [ULTIMATE VERSION] - แทนที่ฟังก์ชัน populateLightbox เดิมด้วยอันนี้
    function populateLightbox(profileData) {
        // Cache DOM elements
        const getEl = (id) => document.getElementById(id);
        const nameMainEl = getEl('lightbox-profile-name-main');
        const heroImageEl = getEl('lightboxHeroImage');
        const thumbnailStripEl = getEl('lightboxThumbnailStrip');
        const quoteEl = getEl('lightboxQuote');
        const tagsEl = getEl('lightboxTags');
        const detailsEl = getEl('lightboxDetailsCompact');
        const descriptionEl = getEl('lightboxDescriptionVal');
        const lineLink = getEl('lightboxLineLink');
        const lineLinkText = getEl('lightboxLineLinkText');
        const availabilityWrapper = getEl('lightbox-availability-badge-wrapper');

        // --- Main Header ---
        nameMainEl.textContent = profileData.name || 'N/A';
        quoteEl.textContent = profileData.quote ? `"${profileData.quote}"` : '';
        quoteEl.style.display = profileData.quote ? 'block' : 'none';

        // --- Availability Badge (Upgraded) ---
        availabilityWrapper.innerHTML = ''; // Clear previous
        let availabilityText = profileData.availability || "สอบถามคิว";
        let availabilityStatus = 'inquire'; // default
        if (availabilityText.includes('ว่าง') || availabilityText.includes('รับงาน')) {
            availabilityStatus = 'available';
        } else if (availabilityText.includes('ไม่ว่าง') || availabilityText.includes('พัก')) {
            availabilityStatus = 'busy';
        }
        const availabilityBadge = document.createElement('div');
        availabilityBadge.className = `availability-badge-upgraded status-${availabilityStatus}`;
        availabilityBadge.textContent = availabilityText;
        availabilityWrapper.appendChild(availabilityBadge);
        
        // --- Gallery ---
        heroImageEl.src = profileData.images[0]?.src || '/images/placeholder-profile.webp';
        heroImageEl.srcset = profileData.images[0]?.srcset || '';
        heroImageEl.alt = profileData.altText;
        
        thumbnailStripEl.innerHTML = '';
        if (profileData.images.length > 1) {
            profileData.images.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img.src;
                thumb.srcset = img.srcset;
                thumb.alt = `รูปตัวอย่างที่ ${index + 1} ของ ${profileData.name}`;
                thumb.className = 'thumbnail';
                if (index === 0) thumb.classList.add('active');
                
                thumb.addEventListener('click', () => {
                    heroImageEl.src = img.src;
                    heroImageEl.srcset = img.srcset;
                    thumbnailStripEl.querySelector('.thumbnail.active')?.classList.remove('active');
                    thumb.classList.add('active');
                });
                thumbnailStripEl.appendChild(thumb);
            });
            thumbnailStripEl.style.display = 'grid';
        } else {
            thumbnailStripEl.style.display = 'none';
        }

        // --- Tags (Upgraded Class) ---
        tagsEl.innerHTML = '';
        if (profileData.styleTags?.length > 0) {
            profileData.styleTags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'tag-badge'; // Use new class from upgraded css
                tagEl.textContent = tag;
                tagsEl.appendChild(tagEl);
            });
            tagsEl.style.display = 'flex';
        } else {
            tagsEl.style.display = 'none';
        }

        // --- Details Section (Complete Redesign) ---
        const paletteIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 4a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 4zM10 18a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 0110 18zM5.932 7.033a.75.75 0 011.05-1.07l1.5 1.5a.75.75 0 01-1.05 1.07l-1.5-1.5zM12.95 14.05a.75.75 0 01-1.05 1.07l-1.5-1.5a.75.75 0 011.05-1.07l1.5 1.5zM4 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 014 10zM13.75 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM7.033 12.95a.75.75 0 011.07-1.05l1.5 1.5a.75.75 0 01-1.07 1.05l-1.5-1.5zM14.05 7.05a.75.75 0 01-1.07-1.05l1.5-1.5a.75.75 0 011.07 1.05l-1.5 1.5z"/></svg>`;
        const mapIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.623-.359 1.445-.835 2.13-1.36.712-.549 1.282-1.148 1.655-1.743.372-.596.59-1.28.59-2.002v-1.996a4.504 4.504 0 00-1.272-3.116A4.47 4.47 0 0013.5 4.513V4.5C13.5 3.12 12.38 2 11 2H9c-1.38 0-2.5 1.12-2.5 2.5v.013a4.47 4.47 0 00-1.728 1.388A4.504 4.504 0 003 9.504v1.996c0 .722.218 1.406.59 2.002.373.595.943 1.194 1.655 1.743.685.525 1.507 1.001 2.13 1.36.254.147.468.27.654.369a5.745 5.745 0 00.28.14l.019.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>`;
        const moneyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 10.837a1 1 0 00-1.5 0 1 1 0 000 1.413l.001.001 2.25 2.25a1 1 0 001.414 0l.001-.001 2.688-2.688a1 1 0 000-1.414 1 1 0 00-1.414 0l-1.937 1.937-1.5-1.5z" /><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1a.5.5 0 000 1h8a.5.5 0 000-1H5z" clip-rule="evenodd" /></svg>`;
        
        detailsEl.innerHTML = `
            <div class="details-grid-upgraded">
                <div class="detail-item-grid"><div class="label">อายุ</div><div class="value">${profileData.age || '-'} ปี</div></div>
                <div class="detail-item-grid"><div class="label">สัดส่วน</div><div class="value">${profileData.stats || '-'}</div></div>
                <div class="detail-item-grid"><div class="label">สูง/หนัก</div><div class="value">${profileData.height || '-'}/${profileData.weight || '-'}</div></div>
            </div>
            <div class="detail-list-upgraded">
                <div class="detail-item-list"><div class="detail-item-list-icon">${paletteIcon}</div><div class="value">ผิว: <strong>${profileData.skinTone || '-'}</strong></div></div>
                <div class="detail-item-list"><div class="detail-item-list-icon">${mapIcon}</div><div class="value">จังหวัด: <strong>${provincesMap.get(profileData.provinceKey) || ''}</strong> (${profileData.location || 'ไม่ระบุ'})</div></div>
                <div class="detail-item-list"><div class="detail-item-list-icon">${moneyIcon}</div><div class="value">เรท: <strong>${profileData.rate || 'สอบถาม'}</strong></div></div>
            </div>`;

        // --- Description ---
        descriptionEl.innerHTML = profileData.description ? profileData.description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม';

        // --- Line Button (Upgraded) ---
        lineLink.className = "btn-line-shared-upgraded"; 
        
        if (profileData.lineId) {
            lineLink.href = profileData.lineId.startsWith('http') ? profileData.lineId : `https://line.me/ti/p/${profileData.lineId}`;
            lineLink.style.display = 'inline-flex';
            lineLinkText.textContent = `ติดต่อ LINE: ${profileData.name}`;
        } else {
            lineLink.style.display = 'none';
        }
    }

    function initHeaderScrollEffect() {
        const header = document.getElementById('page-header');
        if (!header) return;
        const handleScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        handleScroll(); 
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate-on-scroll]');
        if (animatedElements.length === 0) return;
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => {
            if (!el.classList.contains('is-visible')) observer.observe(el);
        });
    }

    function updateActiveNavLinks() {
        const currentPath = window.location.pathname.endsWith('/') ? window.location.pathname.slice(0, -1) || '/' : window.location.pathname;
        const navLinks = document.querySelectorAll('#sidebar nav a, header nav a');
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname.endsWith('/') ? new URL(link.href).pathname.slice(0, -1) || '/' : new URL(link.href).pathname;
            const isActive = linkPath === currentPath;
            link.classList.toggle('active-nav-link', isActive);
        });
    }
    
    document.addEventListener("DOMContentLoaded", function() {
        const marquee = document.querySelector('.social-marquee');
        if (!marquee) return;   // ✅ ป้องกัน error ถ้าไม่เจอ element

        const wrapper = marquee.parentElement;
        if (!wrapper) return;   // ✅ กันเผื่อว่ามันไม่มี parent จริง ๆ

        // clone เนื้อหาเพื่อให้เลื่อนต่อเนื่อง
        const clone = marquee.innerHTML;
        marquee.innerHTML += clone;

        let speed = 0.5;
        let scroll = 0;
        let isDragging = false;
        let startX = 0;
        let scrollStart = 0;

        function animateMarquee() {
            if (!isDragging) {
                scroll += speed;
            }
            if (scroll >= marquee.scrollWidth / 2) scroll = 0;
            if (scroll < 0) scroll = marquee.scrollWidth / 2 - 1;
            marquee.style.transform = `translateX(-${scroll}px)`;
            requestAnimationFrame(animateMarquee);
        }

        animateMarquee();

        // Hover pause
        wrapper.addEventListener('mouseenter', () => { speed = 0; });
        wrapper.addEventListener('mouseleave', () => { if (!isDragging) speed = 0.5; });

        // Mouse drag
        wrapper.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.pageX;
            scrollStart = scroll;
            speed = 0;
            e.preventDefault();
        });
        wrapper.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const delta = e.pageX - startX;
            scroll = scrollStart - delta;
        });
        wrapper.addEventListener('mouseup', () => { isDragging = false; speed = 0.5; });
        wrapper.addEventListener('mouseleave', () => { isDragging = false; speed = 0.5; });

        // Touch drag
        wrapper.addEventListener('touchstart', e => {
            isDragging = true;
            startX = e.touches[0].pageX;
            scrollStart = scroll;
            speed = 0;
        });
        wrapper.addEventListener('touchmove', e => {
            if (!isDragging) return;
            const delta = e.touches[0].pageX - startX;
            scroll = scrollStart - delta;
        });
        wrapper.addEventListener('touchend', () => { isDragging = false; speed = 0.5; });
    });

function generateFullSchema() {
    const pageTitle = document.title;
    const canonicalUrl = document.querySelector("link[rel='canonical']")?.href || window.location.href;
    const siteUrl = "https://sidelinechiangmai.netlify.app/";
    const orgName = "Sideline Chiangmai - รับงาน ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก";

    const mainSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${siteUrl}#organization`,
                "name": orgName,
                "url": siteUrl,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${siteUrl}images/logo-sideline-chiangmai.webp`,
                    "width": 164,
                    "height": 40
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer support",
                    "url": "https://line.me/ti/p/_faNcjQ3xx"
                }
            },
            {
                "@type": "WebSite",
                "@id": `${siteUrl}#website`,
                "url": siteUrl,
                "name": orgName,
                "description": "รวมโปรไฟล์ไซด์ไลน์เชียงใหม่, ลำปาง, เชียงราย คุณภาพ บริการฟีลแฟน การันตีตรงปก 100% ปลอดภัย ไม่ต้องมัดจำ",
                "publisher": { "@id": `${siteUrl}#organization` },
                "inLanguage": "th-TH"
            },
            {
                "@type": "WebPage",
                "@id": `${canonicalUrl}#webpage`,
                "url": canonicalUrl,
                "name": pageTitle,
                "isPartOf": { "@id": `${siteUrl}#website` },
                "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": `${siteUrl}images/sideline-chiangmai-social-preview.webp`
                },
                "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` }
            },
            {
                "@type": "LocalBusiness",
                "@id": `${siteUrl}#localbusiness`,
                "name": "SidelineChiangmai - ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก",
                "image": `${siteUrl}images/sideline-chiangmai-social-preview.webp`,
                "url": siteUrl,
                "priceRange": "฿฿",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "เจ็ดยอด",
                    "addressLocality": "ช้างเผือก",
                    "addressRegion": "เชียงใหม่",
                    "postalCode": "50300",
                    "addressCountry": "TH"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "18.814361",
                    "longitude": "98.972389"
                },
                "hasMap": "https://maps.app.goo.gl/3y8gyAtamm8YSagi9",
                "openingHours": ["Mo-Su 00:00-24:00"],
                "areaServed": [
                    { "@type": "City", "name": "Chiang Mai" },
                    { "@type": "City", "name": "Bangkok" },
                    { "@type": "City", "name": "Lampang" },
                    { "@type": "City", "name": "Chiang Rai" },
                    { "@type": "City", "name": "Pattaya" },
                    { "@type": "City", "name": "Phuket" }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${canonicalUrl}#breadcrumb`,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": siteUrl }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": `${siteUrl}#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้าทุกท่าน ข้อมูลการติดต่อและการจองของท่านจะถูกเก็บรักษาเป็นความลับอย่างเข้มงวด"
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการไซด์ไลน์หรือไม่?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "เพื่อความสบายใจของลูกค้าทุกท่าน ท่านไม่จำเป็นต้องโอนเงินมัดจำใดๆ ทั้งสิ้น สามารถชำระค่าบริการเต็มจำนวนโดยตรงกับน้องๆ ที่หน้างานได้เลย"
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "น้องๆ ไซด์ไลน์เชียงใหม่ตรงปกตามรูปที่แสดงในโปรไฟล์จริงหรือ?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพของน้องๆ ทุกคนอย่างละเอียด Sideline Chiang Mai กล้าการันตีว่าน้องๆ ตรงปก 100% หากพบปัญหาใดๆ สามารถแจ้งทีมงานเพื่อดำเนินการแก้ไขได้ทันที"
                        }
                    }
                ]
            }
        ]
    };

    // ลบ script เก่าแล้วสร้างใหม่
        const schemaContainer = document.createElement('script');
        schemaContainer.type = 'application/ld+json';
        schemaContainer.textContent = JSON.stringify(mainSchema);
        const oldSchema = document.querySelector('script[type="application/ld+json"]');
        if (oldSchema) oldSchema.remove();
        document.head.appendChild(schemaContainer);
    }

})(); 
