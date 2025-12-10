// =================================================================
// 🚀 SIDELINE-CM V4.5 "FIXED & POLISHED"
// แก้ไขบั๊กตัวแปร Mismatch (จังหวัด/ปุ่มปิด/Featured) เรียบร้อยแล้ว
// =================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs'; 

gsap.registerPlugin(ScrollTrigger);

(function () {
    'use strict';
    
    const CONFIG = {
        SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
        STORAGE_BUCKET: 'profile-images',
        KEYS: {
            CACHE_PROFILES: 'sidelinecm_cachedProfiles_v4',
            DATA_VERSION: 'sidelinecm_dataVersion_v4',
            LAST_PROVINCE: 'sidelinecm_last_province',
            AGE_CONFIRMED: 'ageConfirmedTimestamp',
            THEME: 'theme'
        },
        SITE_URL: 'https://sidelinechiangmai.netlify.app'
    };

    let state = {
        allProfiles: [],
        provincesMap: new Map(),
        currentProfileSlug: null,
        lastFocusedElement: null,
        isFetching: false,
        profilesSubscription: null
    };
    const dom = {};
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    
    async function initApp() {
        cacheDOMElements();
        initThemeToggle();
        initMobileMenu();
        initAgeVerification();
        initHeaderScrollEffect();
        initMarqueeEffect();
        initMobileSitemapTrigger();
        initLightboxEvents();
        setupEventListeners();

        updateActiveNavLinks();

        const dataLoadedSuccessfully = await handleDataLoading();

        if (dataLoadedSuccessfully) {
            initSearchAndFilters();
            initRealtimeProfiles();
            initFooterLinks();
            await handleRouting(true);
        }
        
        document.body.classList.add('loaded');
        if (dom.currentYearDynamic) {
            dom.currentYearDynamic.textContent = new Date().getFullYear();
        }
    }

    function cacheDOMElements() {
        // ✅ UPDATE: แก้ไขรายชื่อ ID ให้ตรงกับ HTML เป๊ะๆ
        const ids = [
            'page-header', 'loading-profiles-placeholder', 'profiles-display-area', 
            'no-results-message', 'fetch-error-message', 'retry-fetch-btn',
            'search-form', 'search-keyword', 
            'search-province', // HTML ID: search-province -> dom.searchProvince
            'search-availability', 'search-featured', 'reset-search-btn', 'result-count', 
            'featured-profiles', // HTML ID: featured-profiles -> dom.featuredProfiles (Section)
            'featured-profiles-container', // HTML ID: featured-profiles-container -> dom.featuredProfilesContainer
            'lightbox', 
            'closeLightboxBtn', // HTML ID: closeLightboxBtn -> dom.closeLightboxBtn
            'clear-search-btn',
            'lightbox-content-wrapper-el', 'currentYearDynamic'
        ];
        ids.forEach(id => {
            const camelCaseId = id.replace(/-(\w)/g, (_, c) => c.toUpperCase());
            const el = document.getElementById(id);
            if(el) {
                dom[camelCaseId] = el;
            } else {
                console.warn(`⚠️ Element ID '${id}' not found in HTML.`);
            }
        });
        dom.body = document.body;
    }

    function setupEventListeners() {
        window.addEventListener('popstate', () => handleRouting(true));
        dom.retryFetchBtn?.addEventListener('click', handleDataLoading);
    }

    async function handleDataLoading() {
        showLoadingState();
        dom.fetchErrorMessage?.classList.add('hidden');
        try {
            await fetchDataWithVersioning();
            if (state.allProfiles.length > 0) hideLoadingState();
            return true;
        } catch (error) {
            console.error("Critical error during data loading:", error);
            if (state.allProfiles.length === 0) {
                 hideLoadingState();
                 showErrorState();
            }
            return false;
        }
    }

    async function fetchDataWithVersioning() {
        const { data: serverVersionData, error: versionError } = await supabase
            .from('metadata').select('value').eq('key', 'data_version').single();

        if (versionError) {
            const cachedData = getFromCache();
            if (cachedData) {
                applyDataFromCache(cachedData);
                return;
            }
            // ถ้า error และไม่มี cache ให้ดึงสด
        }

        const serverVersion = serverVersionData?.value;
        const localData = getFromCache();
        const localVersion = localStorage.getItem(CONFIG.KEYS.DATA_VERSION);

        if (localData && localVersion === serverVersion) {
            console.log(`🚀 Cache is up-to-date (v${serverVersion}).`);
            applyDataFromCache(localData);
            return;
        }

        console.log(`Fetch fresh data...`);
        const [profilesRes, provincesRes] = await Promise.all([
            supabase.from('profiles').select('*').order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false }),
            supabase.from('provinces').select('*')
        ]);

        if (profilesRes.error) throw profilesRes.error;
        if (provincesRes.error) throw provincesRes.error;
        
        processAndApplyData(profilesRes.data, provincesRes.data);
        
        saveToCache({
            profiles: state.allProfiles,
            provinces: Array.from(state.provincesMap.entries())
        });
        if(serverVersion) localStorage.setItem(CONFIG.KEYS.DATA_VERSION, serverVersion);
    }

    function processAndApplyData(profilesData, provincesData) {
        state.provincesMap.clear();
        (provincesData || []).forEach(p => {
            const thName = p.nameThai || p.name_thai || p.name || "N/A";
            const key = p.key || p.slug || p.id;
            if (key && thName) state.provincesMap.set(key, thName);
        });
        state.allProfiles = (profilesData || []).map(processProfileData);
        populateProvinceDropdown();
        renderFeaturedProfiles();
        renderProfiles(state.allProfiles, false);
    }

    function applyDataFromCache(cachedData) {
        state.allProfiles = cachedData.profiles;
        state.provincesMap = new Map(cachedData.provinces);
        populateProvinceDropdown();
        renderFeaturedProfiles();
        renderProfiles(state.allProfiles, false);
    }

    function saveToCache(data) {
        try { localStorage.setItem(CONFIG.KEYS.CACHE_PROFILES, JSON.stringify(data)); } catch (e) { console.warn("Cache save failed:", e); }
    }

    function getFromCache() {
        try { return JSON.parse(localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES)); } catch (e) { return null; }
    }
    
    function processProfileData(p) {
        const imagePaths = [p.imagePath, ...(p.galleryPaths || [])].filter(Boolean);
        const imageObjects = imagePaths.map(path => {
            const { data } = supabase.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
            const uniqueUrl = `${data.publicUrl}?t=${new Date(p.lastUpdated || Date.now()).getTime()}`;
            return { src: uniqueUrl, srcset: `${uniqueUrl} 1x` };
        });
        if (imageObjects.length === 0) {
            imageObjects.push({ src: '/images/placeholder-profile.webp', srcset: '' });
        }
        const provinceName = state.provincesMap.get(p.provinceKey) || '';
        const tagsString = Array.isArray(p.styleTags) ? p.styleTags.join(' ') : (p.styleTags || ''); 
        const fullSearchString = [
            p.name, provinceName, p.provinceKey, p.age, p.height, p.weight, p.rate,
            p.location, p.availability, p.status, (p.stats || '').replace(/-/g, ' '),
            p.quote, p.description, tagsString
        ].filter(Boolean).join(' ').toLowerCase();
        return { 
            ...p, images: imageObjects, altText: `น้อง${p.name} ${provinceName}`,
            searchString: fullSearchString, provinceNameThai: provinceName
        };
    }

    function populateProvinceDropdown() {
        // ✅ FIX: ใช้ dom.searchProvince แทน dom.provinceSelect
        const dropdown = dom.searchProvince; 
        if (!dropdown) return;
        
        const selectedValue = dropdown.value;
        while (dropdown.options.length > 1) dropdown.remove(1);
        
        const sorted = Array.from(state.provincesMap.entries()).sort((a, b) => a[1].localeCompare(b[1], 'th'));
        const fragment = document.createDocumentFragment();
        
        sorted.forEach(([key, name]) => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = name;
            fragment.appendChild(opt);
        });
        dropdown.appendChild(fragment);
        if (selectedValue) dropdown.value = selectedValue;
    }

    function initRealtimeProfiles() {
        if (!supabase || state.profilesSubscription) return;
        state.profilesSubscription = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                handleDataLoading();
            })
            .subscribe();
    }


function renderFeaturedProfiles() {
    // เช็คว่ามี Container และมีข้อมูลไหม
    if(!dom.featuredSection || !dom.featuredContainer || state.allProfiles.length === 0) return;
    
    // กรองเอาเฉพาะ isfeatured = true และเอาแค่ 8 คนแรก
    const featuredProfiles = state.allProfiles.filter(p => p.isfeatured).slice(0, 8);
    
    if (featuredProfiles.length > 0) {
        const frag = document.createDocumentFragment();
        featuredProfiles.forEach(p => frag.appendChild(createProfileCard(p)));
        
        dom.featuredContainer.innerHTML = '';
        dom.featuredContainer.appendChild(frag);
        dom.featuredSection.style.display = 'block'; // แสดง Section
    } else {
        dom.featuredSection.style.display = 'none'; // ซ่อนถ้าไม่มีข้อมูล
    }
}
function renderProfiles(profiles, isSearching) {
    if (!dom.profilesDisplayArea) return;

    // ซ่อน/แสดง Featured ตามสถานะการค้นหา
    if (dom.featuredSection) {
        dom.featuredSection.style.display = isSearching ? 'none' : 'block';
        // ถ้าไม่ได้ค้นหา และมี Featured ให้แสดง Featured กลับมา (ถ้าข้อมูลมี)
        if (!isSearching && state.allProfiles.some(p => p.isfeatured)) {
            dom.featuredSection.style.display = 'block'; 
        }
    }

    dom.profilesDisplayArea.innerHTML = '';
    
    // จัดการข้อความ "ไม่พบผลลัพธ์"
    if (dom.noResultsMessage) {
        dom.noResultsMessage.classList.toggle('hidden', profiles.length > 0);
    }

    if (profiles.length > 0) {
        // เช็คว่าเป็นหน้า Location หรือมีการค้นหา/กรอง หรือไม่
        const isLocationPage = window.location.pathname.includes('/location/');
        
        if (isSearching || isLocationPage) {
            // โหมดค้นหา/เจาะจงจังหวัด: แสดงแบบรวม (Grid เดียว)
            dom.profilesDisplayArea.appendChild(createSearchResultSection(profiles));
        } else {
            // โหมดหน้าแรกปกติ: แสดงแยกตามจังหวัด
            renderByProvince(profiles);
        }
    }
    
    // กระตุ้น ScrollTrigger (ถ้ามี)
    if(window.ScrollTrigger) ScrollTrigger.refresh();
    initScrollAnimations();
}
    async function handleRouting(dataLoaded = false) {
        const path = window.location.pathname.toLowerCase();
        const profileMatch = path.match(/^\/(?:sideline|profile|app)\/([^/]+)/);

        if (profileMatch) {
            const slug = decodeURIComponent(profileMatch[1]);
            if (state.currentProfileSlug !== slug) {
                state.currentProfileSlug = slug;
                let profile = state.allProfiles.find(p => (p.slug || '').toLowerCase() === slug);
                if (!profile && dataLoaded) profile = await fetchSingleProfile(slug);
                if (profile) openLightbox(profile);
                else if (dataLoaded) history.replaceState(null, '', '/');
            }
            return;
        }
        
        if (state.currentProfileSlug) {
             closeLightbox();
             state.currentProfileSlug = null;
        }

        const provinceMatch = path.match(/^\/(?:location|province)\/([^/]+)/);
        if (provinceMatch && dom.searchProvince) {
            dom.searchProvince.value = decodeURIComponent(provinceMatch[1]);
        }
        
        if (dataLoaded) {
            applyUltimateFilters();
            updateSeoForCurrentPage();
        }
    }

    function updateSeoForCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        const provinceMatch = path.match(/^\/(?:location|province)\/([^/]+)/);
        if (provinceMatch) {
            const provinceKey = decodeURIComponent(provinceMatch[1]);
            const provinceName = state.provincesMap.get(provinceKey) || provinceKey;
            const seoData = {
                title: `รับงาน${provinceName} | ไซด์ไลน์${provinceName} ฟิวแฟน`,
                description: `รวมน้องๆ ไซด์ไลน์ ${provinceName} รับงานเอง ไม่ผ่านเอเย่นต์`,
                canonicalUrl: `${CONFIG.SITE_URL}/location/${provinceKey}`,
                profiles: state.allProfiles.filter(p => p.provinceKey === provinceKey)
            };
            updateAdvancedMeta(null, seoData);
        } else {
            updateAdvancedMeta(null, null);
        }
    }

    function debounce(func, delay = 400) {
        let timeout;
        return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), delay); };
    }

    let fuseEngine; 
    function initSearchAndFilters() {
        if (!dom.searchForm) return;
        if (state.allProfiles.length > 0) {
            fuseEngine = new Fuse(state.allProfiles, {
                includeScore: true, threshold: 0.3, keys: [ 'name', 'provinceNameThai', 'styleTags', 'searchString' ]
            });
        }
        
        const debouncedApplyFilters = debounce(applyUltimateFilters);
        // ✅ FIX: ใช้ dom.searchKeyword ให้ตรง Cache
        dom.searchKeyword?.addEventListener('input', (e) => {
            if(dom.clearSearchBtn) dom.clearSearchBtn.classList.toggle('hidden', !e.target.value);
            debouncedApplyFilters();
        });
        dom.clearSearchBtn?.addEventListener('click', () => {
            if(dom.searchKeyword) dom.searchKeyword.value = '';
            dom.clearSearchBtn?.classList.add('hidden');
            dom.searchKeyword?.focus();
            applyUltimateFilters();
        });

        const immediateApplyFilters = () => applyUltimateFilters();
        // ✅ FIX: ใช้ dom.searchProvince
        dom.searchProvince?.addEventListener('change', immediateApplyFilters);
        dom.searchAvailability?.addEventListener('change', immediateApplyFilters);
        dom.searchFeatured?.addEventListener('change', immediateApplyFilters);
        
        dom.resetSearchBtn?.addEventListener('click', () => {
            dom.searchForm.reset();
            if(dom.clearSearchBtn) dom.clearSearchBtn.classList.add('hidden');
            applyUltimateFilters();
        });
        dom.searchForm.addEventListener('submit', (e) => e.preventDefault());
    }
    
    function applyUltimateFilters() {
        let textQuery = dom.searchKeyword?.value?.trim().toLowerCase() || '';
        let provinceQuery = dom.searchProvince?.value || ''; // ✅ FIX
        const availQuery = dom.searchAvailability?.value || '';
        const featuredQuery = dom.searchFeatured?.value === 'true';

        let filtered = state.allProfiles;

        if (fuseEngine && textQuery) {
            filtered = fuseEngine.search(textQuery).map(result => result.item);
        }

        filtered = filtered.filter(p => {
            const provinceMatch = !provinceQuery || p.provinceKey === provinceQuery;
            const availMatch = !availQuery || p.availability === availQuery;
            const featuredMatch = !featuredQuery || p.isfeatured;
            return provinceMatch && availMatch && featuredMatch;
        });

        const isFiltering = textQuery || provinceQuery || availQuery || featuredQuery;
        
        if (dom.resultCount) {
            dom.resultCount.innerHTML = isFiltering ? (filtered.length > 0 ? `✅ พบ ${filtered.length} โปรไฟล์` : '❌ ไม่พบข้อมูล') : '';
            dom.resultCount.style.display = isFiltering ? 'block' : 'none';
        }
        
        renderProfiles(filtered, isFiltering);
    }

    function renderFeaturedProfiles() {
        // ✅ FIX: ใช้ ID ที่ถูกต้อง (dom.featuredProfiles, dom.featuredProfilesContainer)
        if(!dom.featuredProfiles || !dom.featuredProfilesContainer || state.allProfiles.length === 0) return;
        
        const featuredProfiles = state.allProfiles.filter(p => p.isfeatured).slice(0, 8);
        
        if (featuredProfiles.length > 0) {
            const frag = document.createDocumentFragment();
            featuredProfiles.forEach(p => frag.appendChild(createProfileCard(p)));
            dom.featuredProfilesContainer.innerHTML = '';
            dom.featuredProfilesContainer.appendChild(frag);
            dom.featuredProfiles.style.display = 'block';
        } else {
            dom.featuredProfiles.style.display = 'none';
        }
    }

    function renderProfiles(profiles, isFiltering) {
        if (!dom.profilesDisplayArea) return;
        
        // ✅ FIX: ซ่อน Featured Section เมื่อมีการค้นหา
        if(dom.featuredProfiles) {
            dom.featuredProfiles.style.display = isFiltering ? 'none' : 'block';
            // ถ้าไม่มีโปรไฟล์แนะนำ ก็ซ่อนอยู่ดี
            const hasFeatured = state.allProfiles.some(p => p.isfeatured);
            if (!isFiltering && hasFeatured) {
                renderFeaturedProfiles(); // Refresh to be sure
            }
        }
        
        dom.profilesDisplayArea.innerHTML = '';
        dom.noResultsMessage?.classList.toggle('hidden', profiles.length > 0);

        if (profiles.length > 0) {
            const isLocationPage = window.location.pathname.includes('/location/');
            if (isFiltering || isLocationPage) {
                dom.profilesDisplayArea.appendChild(createSearchResultSection(profiles));
            } else {
                renderByProvince(profiles);
            }
        }
        if(window.ScrollTrigger) ScrollTrigger.refresh();
        initScrollAnimations();
    }

    function createSearchResultSection(profiles) {
        let headerText;
        const currentProvKey = dom.searchProvince?.value;
        if (currentProvKey && state.provincesMap.has(currentProvKey)) {
            headerText = `📍 น้องๆ ในจังหวัด <span class="text-pink-600">${state.provincesMap.get(currentProvKey)}</span>`;
        } else if (dom.searchKeyword?.value) {
            headerText = `🔍 ผลการค้นหา "${dom.searchKeyword.value}"`;
        } else {
            headerText = `✨ โปรไฟล์ทั้งหมด`;
        }
        const wrapper = document.createElement('div');
        wrapper.className = 'section-content-wrapper animate-fade-in-up';
        wrapper.innerHTML = `
          <div class="px-4 sm:px-6 pt-8 pb-4">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div><h3 class="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white leading-tight">${headerText}</h3></div>
                <div class="flex-shrink-0"><span class="inline-flex items-center px-4 py-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold text-sm">พบ ${profiles.length} รายการ</span></div>
            </div>
          </div>
          <div class="profile-grid grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 sm:px-6 pb-12"></div>
        `;
        const grid = wrapper.querySelector('.profile-grid');
        const frag = document.createDocumentFragment();
        profiles.forEach(p => frag.appendChild(createProfileCard(p)));
        grid.appendChild(frag);
        return wrapper;
    }

    function renderByProvince(profiles) {
        const groups = profiles.reduce((acc, p) => {
            const key = p.provinceKey || 'no_province';
            if (!acc[key]) acc[key] = [];
            acc[key].push(p);
            return acc;
        }, {});
        const keys = Object.keys(groups).sort((a, b) => (state.provincesMap.get(a) || a).localeCompare(state.provincesMap.get(b) || b, 'th'));
        const mainFragment = document.createDocumentFragment();
        keys.forEach(key => {
            const name = state.provincesMap.get(key) || (key === 'no_province' ? 'ไม่ระบุจังหวัด' : key);
            mainFragment.appendChild(createProvinceSection(key, name, groups[key]));
        });
        dom.profilesDisplayArea.appendChild(mainFragment);
    }
    
    function createProvinceSection(key, name, profiles) {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-content-wrapper province-section mt-12';
        wrapper.innerHTML = `
            <div class="p-6 md:p-8">
                <a href="/location/${key}" class="group block">
                    <h2 class="province-section-header flex items-center gap-2.5 text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-pink-600 transition-colors">
                        📍 จังหวัด ${name} <span class="ml-2 bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded-full">${profiles.length}</span>
                        <i class="fas fa-chevron-right text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0"></i>
                    </h2>
                </a>
            </div>
            <div class="profile-grid grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-6 md:px-8 pb-8"></div>
        `;
        const grid = wrapper.querySelector('.profile-grid');
        const frag = document.createDocumentFragment();
        profiles.forEach(p => frag.appendChild(createProfileCard(p)));
        grid.appendChild(frag);
        return wrapper;
    }

    function createProfileCard(p) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'profile-card-new-container';
        const cardInner = document.createElement('div');
        cardInner.className = 'profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-gray-200 dark:bg-gray-700 cursor-pointer transform transition-all duration-300';
        cardInner.setAttribute('data-profile-id', p.id);
        cardInner.setAttribute('data-profile-slug', p.slug);
        cardInner.setAttribute('role', 'button');
        cardInner.setAttribute('tabindex', '0');
        cardInner.innerHTML = `<a href="/profile/${p.slug}" class="card-link absolute inset-0 z-20" aria-label="ดูโปรไฟล์ ${p.name}"></a>`;
        
        const img = document.createElement('img');
        img.className = 'card-image w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105';
        const imgObj = p.images && p.images[0] ? p.images[0] : { src: '/images/placeholder-profile.webp', srcset: '' };
        img.src = imgObj.src;
        if (imgObj.srcset) img.srcset = imgObj.srcset;
        img.alt = p.altText || `รูปโปรไฟล์น้อง ${p.name}`;
        img.loading = 'lazy';
        
        const badges = document.createElement('div');
        badges.className = 'absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end z-10 pointer-events-none';
        let statusClass = 'status-inquire';
        if (p.availability?.includes('ว่าง') || p.availability?.includes('รับงาน')) statusClass = 'status-available';
        else if (p.availability?.includes('ไม่ว่าง')) statusClass = 'status-busy';
        let badgesHTML = `<span class="availability-badge ${statusClass}">${p.availability || 'สอบถาม'}</span>`;
        if (p.isfeatured) {
            badgesHTML += `<span class="featured-badge"><i class="fas fa-star text-[0.7em] mr-1"></i>แนะนำ</span>`;
        }
        badges.innerHTML = badgesHTML;
        
        const overlay = document.createElement('div');
        overlay.className = 'card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 pointer-events-none';
        overlay.innerHTML = `
            <div class="card-info transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                <h3 class="text-xl font-bold text-white text-shadow">${p.name}</h3>
                <p class="text-sm text-gray-200 mt-0.5 flex items-center text-shadow-sm">
                    <i class="fas fa-map-marker-alt mr-1.5 opacity-80"></i> 
                    ${state.provincesMap.get(p.provinceKey) || 'ไม่ระบุ'}
                </p>
            </div>
        `;
        cardInner.append(img, badges, overlay);
        cardContainer.appendChild(cardInner);
        return cardContainer;
    }

    async function fetchSingleProfile(slug) {
        if(!supabase) return null;
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).single();
            if (error) throw error;
            return processProfileData(data);
        } catch(e) { 
            console.error("Fetch single profile failed:", e); 
            return null; 
        }
    }

    function initLightboxEvents() {
        // Event Delegate for Card Clicks
        document.body.addEventListener('click', (e) => {
            const cardLink = e.target.closest('a.card-link');
            if (cardLink && cardLink.closest('.profile-card-new')) {
                e.preventDefault(); 
                const card = cardLink.closest('.profile-card-new');
                const slug = card.getAttribute('data-profile-slug');
                if (slug) {
                    state.lastFocusedElement = card;
                    history.pushState({ profileSlug: slug }, '', `/profile/${slug}`);
                    handleRouting(true);
                }
            }
        });
        
        const closeAction = () => {
            const newPath = window.location.pathname.split('/profile/')[0] || '/';
            history.pushState({}, '', newPath);
            handleRouting(true);
        };

        // ✅ FIX: ใช้ dom.closeLightboxBtn (จาก cacheDOMElements)
        if(dom.closeLightboxBtn) {
            dom.closeLightboxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeAction();
            });
        }
        
        if(dom.lightbox) {
            dom.lightbox.addEventListener('click', (e) => { 
                if (e.target === dom.lightbox) closeAction(); 
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.currentProfileSlug) closeAction();
        });
    }

    function openLightbox(p) {
        if (!p || !dom.lightbox) return;
        populateLightboxData(p);
        document.body.style.overflow = 'hidden';
        dom.lightbox.classList.remove('hidden');
        gsap.to(dom.lightbox, { opacity: 1, duration: 0.3 });
        gsap.fromTo(dom.lightboxWrapper, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.2)' });
        updateAdvancedMeta(p);
    }

    function closeLightbox(animate = true) {
        if (!dom.lightbox || dom.lightbox.classList.contains('hidden')) return;
        const onComplete = () => {
            dom.lightbox.classList.add('hidden');
            document.body.style.overflow = '';
            if(state.lastFocusedElement) state.lastFocusedElement.focus();
            state.lastFocusedElement = null;
            updateSeoForCurrentPage();
        };
        if (animate) {
            gsap.to(dom.lightbox, { opacity: 0, duration: 0.2, onComplete });
            gsap.to(dom.lightboxWrapper, { scale: 0.95, opacity: 0, duration: 0.2 });
        } else {
            dom.lightbox.style.opacity = '0';
            onComplete();
        }
    }

    function populateLightboxData(p) {
        const get = (id) => document.getElementById(id);
        const els = {
            name: get('lightbox-profile-name-main'), hero: get('lightboxHeroImage'),
            thumbs: get('lightboxThumbnailStrip'), quote: get('lightboxQuote'),
            tags: get('lightboxTags'), desc: get('lightboxDescriptionVal'),
            avail: get('lightbox-availability-badge-wrapper'), details: get('lightboxDetailsCompact'),
        };

        if (els.name) els.name.textContent = p.name || 'ไม่ระบุชื่อ';
        if (els.quote) {
            els.quote.textContent = p.quote ? `"${p.quote}"` : '';
            els.quote.style.display = p.quote ? 'block' : 'none';
        }

        if (els.hero) {
            els.hero.src = p.images?.[0]?.src || '/images/placeholder-profile.webp';
            els.hero.alt = p.altText || p.name;
        }

        if (els.thumbs) {
            els.thumbs.innerHTML = '';
            if (p.images && p.images.length > 1) {
                els.thumbs.style.display = 'grid';
                p.images.forEach((img, i) => {
                    const thumb = document.createElement('img');
                    thumb.className = `thumbnail ${i === 0 ? 'active' : ''}`;
                    thumb.src = img.src;
                    thumb.onclick = () => {
                        if(els.hero) els.hero.src = img.src;
                        els.thumbs.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    };
                    els.thumbs.appendChild(thumb);
                });
            } else {
                els.thumbs.style.display = 'none';
            }
        }

        if (els.tags) {
            els.tags.innerHTML = '';
            if (p.styleTags && p.styleTags.length > 0) {
                els.tags.style.display = 'flex';
                p.styleTags.forEach(t => {
                    const span = document.createElement('span');
                    span.className = 'tag-badge';
                    span.textContent = t;
                    els.tags.appendChild(span);
                });
            } else {
                els.tags.style.display = 'none';
            }
        }

        if (els.details) {
            const provinceName = state.provincesMap.get(p.provinceKey) || 'ไม่ระบุ';
            els.details.innerHTML = `
                <div class="stats-grid-container">
                    <div class="stat-box"><span class="stat-label">อายุ</span><span class="stat-value">${p.age || '-'}</span></div>
                    <div class="stat-box"><span class="stat-label">สัดส่วน</span><span class="stat-value text-pink-600">${p.stats || '-'}</span></div>
                    <div class="stat-box"><span class="stat-label">สูง/หนัก</span><span class="stat-value">${p.height || '-'}/${p.weight || '-'}</span></div>
                </div>
                <div class="info-list-container">
                    <div class="info-row"><div class="info-label"><i class="fas fa-palette info-icon"></i> สีผิว</div><div class="info-value">${p.skinTone || '-'}</div></div>
                    <div class="info-row"><div class="info-label"><i class="fas fa-map-marker-alt info-icon"></i> พิกัด</div><div class="info-value text-primary">${provinceName} <span class="text-xs text-gray-500">(${p.location || '-'})</span></div></div>
                    <div class="info-row"><div class="info-label"><i class="fas fa-tag info-icon"></i> เรทราคา</div><div class="info-value text-green-600 font-extrabold">${p.rate || 'สอบถาม'}</div></div>
                </div>
            `;
        }

        if (els.desc && els.desc.parentElement) {
            const cleanDesc = p.description ? p.description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม';
            els.desc.parentElement.innerHTML = `
                <div class="description-box">
                    <div class="desc-header"><i class="fas fa-align-left text-pink-500"></i> รายละเอียดเพิ่มเติม</div>
                    <div class="desc-content">${cleanDesc}</div>
                </div>
            `;
        }
        
        const oldWrapper = document.getElementById('line-btn-sticky-wrapper');
        if (oldWrapper) oldWrapper.remove();
        if (p.lineId) {
            const wrapper = document.createElement('div');
            wrapper.id = 'line-btn-sticky-wrapper';
            wrapper.className = 'lb-sticky-footer';
            const lineUrl = p.lineId.startsWith('http') ? p.lineId : `https://line.me/ti/p/${p.lineId}`;
            wrapper.innerHTML = `<a href="${lineUrl}" target="_blank" class="btn-line-action"><i class="fab fa-line"></i> แอดไลน์ ${p.name}</a>`;
            document.querySelector('.lightbox-details')?.appendChild(wrapper);
        }

        if (els.avail) {
            let sClass = 'status-inquire';
            if (p.availability?.includes('ว่าง') || p.availability?.includes('รับงาน')) sClass = 'status-available';
            else if (p.availability?.includes('ไม่ว่าง')) sClass = 'status-busy';
            els.avail.innerHTML = `<div class="lb-status-badge ${sClass} flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold shadow-sm">${p.availability || 'สอบถาม'}</div>`;
        }
    }
    
    function updateAdvancedMeta(profile = null, pageData = null) {
        if (profile) {
            document.title = `${profile.name} - ${state.provincesMap.get(profile.provinceKey) || ''} | Sideline Chiangmai`;
        } else if (pageData) {
            document.title = pageData.title;
        } else {
            document.title = 'ไซด์ไลน์เชียงใหม่ | รับงาน Sideline ฟิวแฟน ตรงปก 100%';
        }
    }

    function initHeaderScrollEffect() {
        if (!dom.pageHeader) return;
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    dom.pageHeader.classList.toggle('scrolled', window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    function initScrollAnimations() {
        const els = document.querySelectorAll('[data-animate-on-scroll]:not(.is-visible)');
        if (!els.length) return;
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
    }

    function initMarqueeEffect() {
        const marquee = document.querySelector('.social-marquee');
        if (!marquee || marquee.dataset.marqueeInit) return;
        marquee.dataset.marqueeInit = 'true';
        marquee.innerHTML += marquee.innerHTML;
        let scrollPosition = 0;
        const speed = 0.5;
        function loop() {
            scrollPosition -= speed;
            if (Math.abs(scrollPosition) >= marquee.scrollWidth / 2) scrollPosition = 0;
            marquee.style.transform = `translate3d(${scrollPosition}px, 0, 0)`;
            requestAnimationFrame(loop);
        }
        loop();
    }

    function initThemeToggle() {
        const buttons = document.querySelectorAll('.theme-toggle-btn');
        const applyTheme = (theme) => {
            document.documentElement.classList.toggle('dark', theme === 'dark');
            localStorage.setItem(CONFIG.KEYS.THEME, theme);
        };
        const savedTheme = localStorage.getItem(CONFIG.KEYS.THEME) || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyTheme(savedTheme);
        buttons.forEach(btn => btn.onclick = () => {
            const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    function initMobileMenu() {
        const btn = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('menu-backdrop');
        const closeBtn = document.getElementById('close-sidebar-btn');
        if (!btn || !sidebar || !backdrop || !closeBtn) return;
        
        const toggleMenu = (open) => {
            sidebar.classList.toggle('translate-x-full', !open);
            backdrop.classList.toggle('hidden', !open);
            document.body.style.overflow = open ? 'hidden' : '';
        };
        btn.onclick = () => toggleMenu(true);
        closeBtn.onclick = () => toggleMenu(false);
        backdrop.onclick = () => toggleMenu(false);
    }

    function initAgeVerification() {
        if (localStorage.getItem(CONFIG.KEYS.AGE_CONFIRMED)) return;
        const overlay = document.createElement('div');
        overlay.id = 'age-verification-overlay';
        overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4';
        overlay.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
                <h2 class="text-2xl font-bold text-red-600 mb-2">20+ Only</h2>
                <p class="mb-6 text-gray-600 dark:text-gray-300">เว็บไซต์นี้สำหรับผู้ใหญ่เท่านั้น</p>
                <button id="age-confirm" class="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold w-full">ยืนยัน (20+)</button>
            </div>`;
        document.body.appendChild(overlay);
        document.getElementById('age-confirm').onclick = () => {
            localStorage.setItem(CONFIG.KEYS.AGE_CONFIRMED, Date.now().toString());
            overlay.remove();
        };
    }

    function updateActiveNavLinks() {
        const path = window.location.pathname;
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.toggle('text-pink-600', link.getAttribute('href') === path);
        });
    }

    function showLoadingState() { if(dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'grid'; }
    function hideLoadingState() { if(dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none'; }
    function showErrorState() { if(dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'block'; }
    
    function initMobileSitemapTrigger() { /* ... (Admin tool preserved) ... */ }

    function initFooterLinks() { 
        const footerContainer = document.getElementById('popular-locations-footer');
        if (!footerContainer || state.provincesMap.size === 0) return;
        const provincesList = Array.from(state.provincesMap.entries())
            .map(([key, name]) => ({ key, name }))
            .sort((a, b) => a.name.localeCompare(b.name, 'th'))
            .slice(0, 15);
        footerContainer.innerHTML = provincesList.map(p => `<li><a href="/location/${p.key}" class="hover:text-pink-500 transition">ไซด์ไลน์${p.name}</a></li>`).join('');
    }

    document.addEventListener('DOMContentLoaded', initApp);

})();