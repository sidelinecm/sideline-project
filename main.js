// =================================================================
// MAIN.JS (ฉบับสมบูรณ์ - FINAL VERSION)
// รวมระบบค้นหาอัจฉริยะ, Caching ที่มีประสิทธิภาพ, และการดึงข้อมูลที่ถูกต้อง
// =================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs';

gsap.registerPlugin(ScrollTrigger);

(function () {
    'use strict';

    // =================================================================
    // 1. CONFIGURATION
    // =================================================================
    const CONFIG = {
        SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
        STORAGE_BUCKET: 'profile-images',
        CACHE_TTL_HOURS: 24,
        KEYS: {
            LAST_PROVINCE: 'sidelinecm_last_province',
            CACHE_PROFILES: 'cachedProfiles',
            LAST_FETCH: 'lastFetchTime',
            AGE_CONFIRMED: 'ageConfirmedTimestamp',
            THEME: 'theme',
            RECENT_SEARCHES: 'recent_searches' // For smart search
        },
        SITE_URL: 'https://sidelinechiangmai.netlify.app',
        DEFAULT_OG_IMAGE: '/images/default_og_image.jpg'
    };

    let state = {
        allProfiles: [],
        provincesMap: new Map(),
        currentProfileSlug: null,
        lastFocusedElement: null,
        isFetching: false,
        lastFetchedAt: '1970-01-01T00:00:00Z',
        realtimeSubscription: null,
        cleanupFunctions: []
    };

    // =================================================================
    // 2. DOM ELEMENTS CACHE & SUPABASE CLIENT
    // =================================================================
    const dom = {};
    let supabase;

    try {
        supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        window.supabase = supabase;
        console.log("✅ Supabase Connected");
    } catch (e) {
        console.error("❌ Supabase Init Failed:", e);
    }
    
    window.onerror = (message, source, lineno, colno, error) => {
        console.error('🛑 Global Runtime Error:', message, error);
        return true; 
    };

    // =================================================================
    // 4. MAIN ENTRY POINT
    // =================================================================
    document.addEventListener('DOMContentLoaded', initApp);
    
    async function initApp() {
        cacheDOMElements();
        initThemeToggle();
        initMobileMenu();
        initAgeVerification();
        initHeaderScrollEffect();
        initMarqueeEffect();
        initMobileSitemapTrigger();
        updateActiveNavLinks();

        await handleDataLoading(); // Main data logic

        const yearSpan = document.getElementById('currentYearDynamic');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        document.body.classList.add('loaded');

        if (window.location.pathname === '/' && !state.currentProfileSlug) {
            try {
                const heroElements = document.querySelectorAll('#hero-h1, #hero-p, #hero-form');
                if (heroElements.length) {
                    gsap.from(heroElements, { y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.3 });
                }
            } catch (e) { console.warn("Animation skipped", e); }
        }

        window.addEventListener('popstate', async () => {
            await handleRouting(true);
            updateActiveNavLinks();
        });
    }

    function cacheDOMElements() {
        Object.assign(dom, {
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
            resultCount: document.getElementById('result-count'),
            featuredSection: document.getElementById('featured-profiles'),
            featuredContainer: document.getElementById('featured-profiles-container'),
            lightbox: document.getElementById('lightbox'),
            lightboxCloseBtn: document.getElementById('closeLightboxBtn'),
            lightboxWrapper: document.getElementById('lightbox-content-wrapper-el'),
            searchSuggestions: document.getElementById('search-suggestions')
        });
    }

    // =================================================================
    // 5. DATA HANDLING LOGIC (REVISED & ROBUST)
    // =================================================================

    async function handleDataLoading() {
        if (state.isFetching) return;
        showLoadingState();
        try {
            const cachedProfiles = loadCache(CONFIG.KEYS.CACHE_PROFILES, CONFIG.CACHE_TTL_HOURS);
            if (cachedProfiles && cachedProfiles.length > 0) {
                state.allProfiles = cachedProfiles;
                console.log("✅ Loaded profiles from smart cache.");
            }

            const success = await fetchDataDelta();
            if (success) {
                initSearchAndFilters();
                initLightboxEvents();
                await handleRouting(true);
                initRealtimeSubscription();
                await initFooterLinks();
            } else if (state.allProfiles.length === 0) {
                showErrorState();
            }
        } catch (error) {
            console.error('Data loading failed:', error);
            showErrorState();
        } finally {
            hideLoadingState();
        }
    }

    async function fetchDataDelta() {
        if (state.isFetching) return false;
        state.isFetching = true;
        if (!supabase) { state.isFetching = false; return false; }

        try {
            console.log('🔄 Starting delta fetch...');
            const lastFetchTimestamp = loadCache(CONFIG.KEYS.LAST_FETCH) || '1970-01-01T00:00:00Z';
            state.lastFetchedAt = new Date(lastFetchTimestamp).toISOString();

            const [provincesRes, profilesRes] = await Promise.all([
                supabase.from('provinces').select('*').order('nameThai', { ascending: true }),
                supabase.from('profiles').select('*').gt('lastUpdated', state.lastFetchedAt).order('lastUpdated', { ascending: false })
            ]);

            if (provincesRes.error) throw provincesRes.error;
            if (profilesRes.error) throw profilesRes.error;

            state.provincesMap.clear();
            (provincesRes.data || []).forEach(p => state.provincesMap.set(p.key, p.nameThai));
            
            const fetchedProfiles = profilesRes.data || [];
            if (fetchedProfiles.length > 0) {
                console.log(`📊 Fetched ${fetchedProfiles.length} new/updated profiles`);
                const newProcessedProfiles = fetchedProfiles.map(processProfileData).filter(Boolean);
                state.allProfiles = mergeProfilesData(state.allProfiles, newProcessedProfiles);
            }
            
            if (state.allProfiles.length === 0) {
                 console.log('🔄 No cache, fetching all profiles...');
                 const allProfilesRes = await supabase.from('profiles').select('*').order('lastUpdated', { ascending: false });
                 if (allProfilesRes.error) throw allProfilesRes.error;
                 if (allProfilesRes.data) {
                    state.allProfiles = allProfilesRes.data.map(processProfileData).filter(Boolean);
                 }
            }

            state.allProfiles.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

            populateProvinceDropdown();
            
            saveCache(CONFIG.KEYS.CACHE_PROFILES, state.allProfiles);
            saveCache(CONFIG.KEYS.LAST_FETCH, Date.now());

            state.isFetching = false;
            return true;

        } catch (err) {
            console.error('❌ Fetch Delta Error:', err);
            state.isFetching = false;
            return state.allProfiles.length > 0;
        }
    }

    function mergeProfilesData(existingProfiles, newProfiles) {
        const profileMap = new Map(existingProfiles.map(p => [p.id, p]));
        newProfiles.forEach(p => profileMap.set(p.id, p));
        return Array.from(profileMap.values());
    }
    
    function initRealtimeSubscription() {
        if (!supabase) return;
        if (state.realtimeSubscription) {
            try { supabase.removeChannel(state.realtimeSubscription); } catch (e) {}
        }

        try {
            console.log('📡 Starting realtime subscription...');
            const subscription = supabase
                .channel('profiles-changes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' },
                    (payload) => {
                        console.log('🔔 Realtime event:', payload.eventType);
                        let needsUpdate = false;
                        switch (payload.eventType) {
                            case 'INSERT':
                            case 'UPDATE':
                                if (payload.new) {
                                    const processed = processProfileData(payload.new);
                                    if (processed) {
                                        state.allProfiles = mergeProfilesData(state.allProfiles, [processed]);
                                        needsUpdate = true;
                                    }
                                }
                                break;
                            case 'DELETE':
                                if (payload.old && payload.old.id) {
                                    state.allProfiles = state.allProfiles.filter(p => p.id !== payload.old.id);
                                    needsUpdate = true;
                                }
                                break;
                        }
                        if(needsUpdate) {
                            applyUltimateFilters();
                            if (state.allProfiles.length > 0) {
                                fuseEngine = new Fuse(state.allProfiles, fuseOptions);
                            }
                        }
                    }
                )
                .subscribe((status) => console.log('📡 Realtime Status:', status));
            state.realtimeSubscription = subscription;
            state.cleanupFunctions.push(() => {
                if (subscription) { supabase.removeChannel(subscription); }
            });
        } catch (error) {
            console.warn('❌ Realtime subscription failed:', error);
        }
    }

    function processProfileData(p) {
        if (!p) return null;

        const imagePaths = [p.imagePath, ...(Array.isArray(p.galleryPaths) ? p.galleryPaths : [])].filter(Boolean);
        const imageObjects = imagePaths.map(path => {
            const { data } = supabase.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
            return {
                src: data?.publicUrl || '/images/placeholder-profile-card.webp',
                srcset: ''
            };
        });

        if (imageObjects.length === 0) {
            imageObjects.push({ src: '/images/placeholder-profile.webp', srcset: '' });
        }

        const provinceName = state.provincesMap.get(p.provinceKey) || '';
        const tags = (Array.isArray(p.styleTags) ? p.styleTags.join(' ') : '');
        const fullSearchString = `${p.name} ${provinceName} ${p.provinceKey} ${tags} ${p.description || ''} ${p.rate || ''} ${p.stats || ''}`.toLowerCase();

        return {
            ...p,
            images: imageObjects,
            altText: `น้อง${p.name} ไซด์ไลน์${provinceName}`,
            searchString: fullSearchString,
            provinceNameThai: provinceName,
            _price: Number(String(p.rate).replace(/[^0-9.-]+/g, "")) || 0,
            _age: Number(p.age) || 0
        };
    }

    function populateProvinceDropdown() {
        if (!dom.provinceSelect) return;
        const currentVal = dom.provinceSelect.value;
        while (dom.provinceSelect.options.length > 1) dom.provinceSelect.remove(1);
        
        const fragment = document.createDocumentFragment();
        state.provincesMap.forEach((name, key) => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = name;
            fragment.appendChild(opt);
        });
        dom.provinceSelect.appendChild(fragment);
        if (currentVal) dom.provinceSelect.value = currentVal;
    }

    // =================================================================
    // 6. ROUTING & SEO
    // =================================================================
    async function handleRouting(dataLoaded = false) {
        const path = window.location.pathname.toLowerCase();
        
        const profileMatch = path.match(/^\/(?:sideline|profile|app)\/([^/]+)/);
        if (profileMatch) {
            const slug = decodeURIComponent(profileMatch[1]);
            state.currentProfileSlug = slug;
            
            let profile = state.allProfiles.find(p => p.slug && p.slug.toLowerCase() === slug.toLowerCase());
            if (!profile && !dataLoaded) profile = await fetchSingleProfile(slug);

            if (profile) {
                openLightbox(profile);
                updateAdvancedMeta(profile, null);
            } else if (dataLoaded) {
                history.replaceState(null, '', '/');
                closeLightbox(false);
                state.currentProfileSlug = null;
                applyUltimateFilters();
            }
            return;
        } 
        
        const provinceMatch = path.match(/^\/(?:location|province)\/([^/]+)/);
        if (provinceMatch) {
            const provinceKey = decodeURIComponent(provinceMatch[1]);
            state.currentProfileSlug = null;
            closeLightbox(false);
            if (dom.provinceSelect) dom.provinceSelect.value = provinceKey;
            
            if (dataLoaded) {
                applyUltimateFilters(false);
                const provinceName = state.provincesMap.get(provinceKey) || provinceKey;
                const seoData = {
                    title: `รับงาน${provinceName} - ไซด์ไลน์${provinceName}`,
                    description: `รวมน้องๆ ไซด์ไลน์ ${provinceName} คัดคนสวย ตรงปก ปลอดภัย 100% โดยทีมงาน Sideline Chiangmai`,
                    canonicalUrl: `${CONFIG.SITE_URL}/location/${provinceKey}`,
                    provinceName: provinceName,
                    profiles: state.allProfiles.filter(p => p.provinceKey === provinceKey)
                };
                updateAdvancedMeta(null, seoData);
            }
            return;
        }

        state.currentProfileSlug = null;
        closeLightbox(false);
        if (dataLoaded) {
            applyUltimateFilters(false);
            updateAdvancedMeta(null, null);
        }
    }

    // =================================================================
    // 7. ULTIMATE SEARCH ENGINE
    // =================================================================
    
    function saveCache(key, data) {
        try {
            const cacheObj = { value: data, timestamp: Date.now() };
            localStorage.setItem(key, JSON.stringify(cacheObj));
        } catch (e) {
            console.error("Cache Full, clearing storage:", e);
            localStorage.clear();
        }
    }

    function loadCache(key, expiryHours = 24) {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        try {
            const cacheObj = JSON.parse(cached);
            if (Date.now() - cacheObj.timestamp > expiryHours * 3600 * 1000) {
                localStorage.removeItem(key);
                return null;
            }
            return cacheObj.value;
        } catch (e) { return null; }
    }
    
    let fuseEngine;
    let fuseOptions;

    function initSearchAndFilters() {
        if (!dom.searchForm) return;

        fuseOptions = {
            includeScore: true, threshold: 0.3, ignoreLocation: true,
            keys: [
                { name: 'name', weight: 1.0 }, { name: 'provinceNameThai', weight: 1.0 },
                { name: 'provinceKey', weight: 0.8 }, { name: 'styleTags', weight: 0.5 },
                { name: 'description', weight: 0.2 }
            ]
        };
        if (state.allProfiles.length > 0) {
            fuseEngine = new Fuse(state.allProfiles, fuseOptions);
        }

        const clearBtn = document.getElementById('clear-search-btn');

        dom.searchInput?.addEventListener('input', (e) => {
            if(clearBtn) clearBtn.classList.toggle('hidden', !e.target.value);
            updateUltimateSuggestions(e.target.value);
        });

        dom.searchInput?.addEventListener('focus', () => {
             updateUltimateSuggestions(dom.searchInput.value);
        });

        document.addEventListener('click', (e) => {
            if (!dom.searchForm.contains(e.target) && dom.searchSuggestions) {
                dom.searchSuggestions.classList.add('hidden');
            }
        });

        clearBtn?.addEventListener('click', () => {
            dom.searchInput.value = '';
            clearBtn.classList.add('hidden');
            dom.searchInput.focus();
            applyUltimateFilters();
        });

        dom.provinceSelect?.addEventListener('change', () => {
            if (dom.searchInput) dom.searchInput.value = '';
            const newPath = dom.provinceSelect.value ? `/location/${dom.provinceSelect.value}` : '/';
            history.pushState(null, '', newPath);
            handleRouting(true);
        });

        dom.availabilitySelect?.addEventListener('change', () => applyUltimateFilters(true));
        dom.featuredSelect?.addEventListener('change', () => applyUltimateFilters(true));
        
        dom.resetSearchBtn?.addEventListener('click', () => {
            dom.searchInput.value = '';
            dom.provinceSelect.value = '';
            dom.availabilitySelect.value = '';
            dom.featuredSelect.value = '';
            history.pushState(null, '', '/');
            applyUltimateFilters(true);
        });

        dom.searchForm.addEventListener('submit', (e) => { 
            e.preventDefault(); 
            saveRecentSearch(dom.searchInput.value);
            applyUltimateFilters(true); 
            if(dom.searchSuggestions) dom.searchSuggestions.classList.add('hidden');
        });
    }

    function updateUltimateSuggestions(val) {
        if (!dom.searchSuggestions) return;
        if (!val) {
            showRecentSearches();
            return;
        }
        if (!fuseEngine) return;

        const results = fuseEngine.search(val).slice(0, 5);
        let html = `<div class="search-dropdown-box">
                    <div class="search-dropdown-header">ผลลัพธ์ที่แนะนำ</div>
                    <div class="search-dropdown-list">`;
        
        if (results.length === 0) {
            html += `<div class="search-dropdown-item-empty">ไม่พบผลลัพธ์</div>`;
        } else {
            results.forEach(({ item }) => {
                const provinceName = state.provincesMap.get(item.provinceKey) || '';
                const isAvailable = item.availability?.includes('รับงาน');
                const imgSrc = item.images[0]?.src || '/images/placeholder.webp';
                html += `
                    <div class="search-dropdown-item group" onclick="window.selectSuggestion('${item.slug}', true)">
                        <div class="search-item-avatar">
                            <img src="${imgSrc}" class="search-item-img" alt="${item.name}">
                            <span class="search-item-status ${isAvailable ? 'available' : 'inquire'}"></span>
                        </div>
                        <div class="search-item-info">
                            <h4 class="search-item-name">${item.name}</h4>
                            <p class="search-item-location">${provinceName}</p>
                        </div>
                        <i class="fas fa-chevron-right search-item-chevron"></i>
                    </div>`;
            });
        }
        
        html += `</div>
                 <div class="search-dropdown-footer" onclick="document.getElementById('search-form').dispatchEvent(new Event('submit'))">
                     ดูผลลัพธ์ทั้งหมดสำหรับ "${val}"
                 </div>
                 </div>`;

        dom.searchSuggestions.innerHTML = html;
        dom.searchSuggestions.classList.remove('hidden');
    }

    window.selectSuggestion = (value, isProfile = false) => {
        if(dom.searchSuggestions) dom.searchSuggestions.classList.add('hidden');
        if (isProfile) {
            if (dom.searchInput) dom.searchInput.value = '';
            document.getElementById('clear-search-btn')?.classList.add('hidden');
            history.pushState(null, '', `/sideline/${value}`);
            handleRouting(); 
        } else {
            if(dom.searchInput) {
                dom.searchInput.value = value;
                saveRecentSearch(value);
                applyUltimateFilters(true);
            }
        }
    };

    function showRecentSearches() {
        if (!dom.searchSuggestions) return;
        const recents = JSON.parse(localStorage.getItem(CONFIG.KEYS.RECENT_SEARCHES) || '[]');
        if (recents.length === 0) {
            dom.searchSuggestions.classList.add('hidden');
            return;
        }

        let html = `<div class="search-dropdown-box">
                    <div class="search-dropdown-header recent">
                        <span>ค้นหาล่าสุด</span>
                        <button onclick="window.clearRecentSearches()" class="clear-history-btn">ล้างประวัติ</button>
                    </div>
                    <div class="search-dropdown-list">`;
        recents.forEach(term => {
            html += `
                <div class="search-dropdown-item history" onclick="window.selectSuggestion('${term}', false)">
                    <i class="fas fa-history history-icon"></i>
                    <span class="history-term">${term}</span>
                </div>`;
        });
        html += `</div></div>`;
        dom.searchSuggestions.innerHTML = html;
        dom.searchSuggestions.classList.remove('hidden');
    }

    function saveRecentSearch(term) {
        if (!term || term.length < 2) return;
        let recents = JSON.parse(localStorage.getItem(CONFIG.KEYS.RECENT_SEARCHES) || '[]');
        recents = [term, ...recents.filter(t => t.toLowerCase() !== term.toLowerCase())];
        if (recents.length > 5) recents.pop();
        localStorage.setItem(CONFIG.KEYS.RECENT_SEARCHES, JSON.stringify(recents));
    }

    window.clearRecentSearches = () => {
        localStorage.removeItem(CONFIG.KEYS.RECENT_SEARCHES);
        if(dom.searchSuggestions) dom.searchSuggestions.classList.add('hidden');
    };
    
    function applyUltimateFilters(updateUrl = false) {
        let query = {
            text: dom.searchInput?.value?.trim() || '',
            province: dom.provinceSelect?.value || '',
            avail: dom.availabilitySelect?.value || '',
            featured: dom.featuredSelect?.value === 'true'
        };

        if (query.text) {
            for (let [key, name] of state.provincesMap.entries()) {
                if (name === query.text || name.includes(query.text) || query.text.includes(name)) {
                    query.province = key; 
                    query.text = '';
                    if(dom.provinceSelect) dom.provinceSelect.value = key;
                    break; 
                }
            }
        }

        if (query.province && query.province !== 'all') localStorage.setItem(CONFIG.KEYS.LAST_PROVINCE, query.province);

        let filtered = state.allProfiles;

        if (query.text) {
            if (fuseEngine) {
                const results = fuseEngine.search(query.text);
                filtered = results.map(result => result.item);
            } else {
                filtered = filtered.filter(p => p.searchString.includes(query.text.toLowerCase()));
            }
        }

        filtered = filtered.filter(p => {
            const provinceMatch = !query.province || query.province === 'all' || p.provinceKey === query.province;
            const availMatch = !query.avail || query.avail === 'all' || p.availability === query.avail;
            const featuredMatch = !query.featured || p.isfeatured;
            return provinceMatch && availMatch && featuredMatch;
        });

        if (dom.resultCount) {
             dom.resultCount.innerHTML = filtered.length > 0 ? `✅ พบ ${filtered.length} โปรไฟล์` : '❌ ไม่พบข้อมูล';
             dom.resultCount.style.display = 'block';
        }

        const isSearchMode = !!query.text || !!query.province || (dom.searchInput && !!dom.searchInput.value);
        renderProfiles(filtered, isSearchMode);

        if (updateUrl) {
            const params = new URLSearchParams();
            if (dom.searchInput?.value) params.set('q', dom.searchInput.value);
            const path = (query.province && query.province !== 'all') ? `/location/${query.province}` : '/';
            const qs = params.toString() ? '?' + params.toString() : '';
            if (!window.location.pathname.includes('/sideline/')) {
                history.pushState({}, '', path + qs);
            }
        }
    }

    // =================================================================
    // 8. RENDERING LOGIC
    // =================================================================

function renderProfiles(profiles, isSearching) {
    if (!dom.profilesDisplayArea) return;
    dom.profilesDisplayArea.innerHTML = '';

    // --- ส่วน Featured (แสดงเฉพาะหน้าแรก) ---
    if (dom.featuredSection) {
        const isHome = !isSearching && !window.location.pathname.includes('/location/');
        dom.featuredSection.classList.toggle('hidden', !isHome);
        if (isHome && dom.featuredContainer && state.allProfiles.length > 0) {
            if (dom.featuredContainer.children.length === 0) { // Render featured only once
                
                // ✅ แก้ไขแล้ว: กรองเอาโปรไฟล์แนะนำทั้งหมดโดยไม่จำกัดจำนวน
                const featured = state.allProfiles.filter(p => p.isfeatured);
                
                const frag = document.createDocumentFragment();
                featured.forEach((p, i) => frag.appendChild(createProfileCard(p, i)));
                dom.featuredContainer.innerHTML = '';
                dom.featuredContainer.appendChild(frag);
            }
        }
    }

    // ถ้าไม่มีข้อมูล
    if (profiles.length === 0) {
        dom.noResultsMessage?.classList.remove('hidden');
        return;
    }
    dom.noResultsMessage?.classList.add('hidden');

    // --- ตัดสินใจการแสดงผล ---
    const isLocationPage = window.location.pathname.includes('/location/');
    if (isSearching || isLocationPage) {
        // โหมด 1: ผลลัพธ์การค้นหา หรือ หน้าจังหวัดเดี่ยว
        dom.profilesDisplayArea.appendChild(createSearchResultSection(profiles));
    } else {
        // โหมด 2: หน้าแรกดูรวม (แยกหมวด)
        renderByProvince(profiles);
    }

    if (window.ScrollTrigger) ScrollTrigger.refresh();
    initScrollAnimations();
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
        if (keys.length > 0) {
            keys.forEach(key => {
                const name = state.provincesMap.get(key) || 'ไม่ระบุจังหวัด';
                mainFragment.appendChild(createProvinceSection(key, name, groups[key])); 
            });
        }
        dom.profilesDisplayArea.innerHTML = '';
        dom.profilesDisplayArea.appendChild(mainFragment);
    }
    
    function createProvinceSection(key, name, profiles) {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-content-wrapper province-section mt-12';
        wrapper.id = `province-${key}`;
        wrapper.innerHTML = `
            <div class="p-6 md:p-8 flex justify-between items-end">
                <a href="/location/${key}" class="group block">
                    <h2 class="province-section-header flex items-center gap-2.5 text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-pink-600 transition-colors">
                        📍 จังหวัด ${name}
                        <span class="ml-2 bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded-full">${profiles.length}</span>
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

    function createSearchResultSection(profiles) {
        let headerText;
        const urlProvMatch = window.location.pathname.match(/\/(?:location|province)\/([^/]+)/);
        const provinceKey = urlProvMatch ? urlProvMatch[1] : dom.provinceSelect?.value;

        if (provinceKey && state.provincesMap.has(provinceKey)) {
            headerText = `📍 น้องๆ ในจังหวัด <span class="text-pink-600">${state.provincesMap.get(provinceKey)}</span>`;
        } else if (dom.searchInput?.value) {
            headerText = `🔍 ผลการค้นหาสำหรับ "${dom.searchInput.value}"`;
        } else {
            headerText = `✨ โปรไฟล์ทั้งหมด`;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'section-content-wrapper animate-fade-in-up';
        wrapper.innerHTML = `
            <div class="px-4 sm:px-6 pt-8 pb-4">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div><h3 class="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white leading-tight">${headerText}</h3></div>
                    <div class="flex-shrink-0"><span class="inline-flex items-center px-4 py-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold text-sm border border-pink-100 dark:border-pink-800">พบ ${profiles.length} รายการ</span></div>
                </div>
            </div>
            <div class="profile-grid grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 sm:px-6 pb-12"></div>
        `;
        const grid = wrapper.querySelector('.profile-grid');
        const frag = document.createDocumentFragment();
        profiles.forEach((p, i) => frag.appendChild(createProfileCard(p, i)));
        grid.appendChild(frag);
        return wrapper;
    }

    function createProfileCard(p, index = 10) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'profile-card-new-container';

        const cardInner = document.createElement('div');
        // เพิ่ม 'aspect-[3/4]' เพื่อจองพื้นที่รูปทรงแนวตั้ง และ 'bg-gray-800' เป็นพื้นหลังระหว่างรอ
        cardInner.className = 'profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-gray-800 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 aspect-[3/4] w-full';
        cardInner.setAttribute('data-profile-id', p.id);
        cardInner.setAttribute('data-profile-slug', p.slug);
        cardInner.setAttribute('role', 'button');
        cardInner.setAttribute('tabindex', '0');

        // Link ครอบตัวการ์ด
        cardInner.innerHTML = `<a href="/sideline/${p.slug}" class="card-link absolute inset-0 z-20" aria-label="ดูโปรไฟล์ ${p.name}"></a>`;

        const imgObj = p.images && p.images.length > 0 ? p.images[0] : { src: '' };
        const img = document.createElement('img');
        
        // ใช้ 'absolute inset-0' เพื่อให้รูปแนบสนิทกับกรอบที่จองไว้ ไม่ดันข้อความ
        img.className = 'card-image absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 opacity-0';
        
        img.onload = () => img.classList.remove('opacity-0');
        img.onerror = () => { 
            // ถ้ารูปจากฐานข้อมูลพัง ให้ดึงรูปสำรองที่มีขนาดเท่ากันมาแสดงแทน หน้าเว็บจะไม่เบี้ยว
            img.src = 'https://placehold.co/400x600/2a2a2a/white?text=No+Image'; 
            img.classList.remove('opacity-0'); 
        };
        
        img.src = imgObj.src || 'https://placehold.co/400x600/2a2a2a/white?text=No+Image';
        img.alt = p.altText || `น้อง ${p.name}`;
        img.loading = index < 8 ? 'eager' : 'lazy';
        img.decoding = 'async';
        img.width = 300;
        img.height = 400;

        // ส่วนแสดงสถานะ (Badges)
        const badges = document.createElement('div');
        badges.className = 'absolute top-2 right-2 flex flex-col gap-1 items-end z-10 pointer-events-none';
        let statusClass = p.availability?.includes('รับงาน') ? 'status-available' : 'status-inquire';
        badges.innerHTML = `
            <span class="availability-badge ${statusClass} shadow-sm backdrop-blur-sm">${p.availability || 'สอบถาม'}</span>
            ${p.isfeatured ? '<span class="featured-badge shadow-sm"><i class="fas fa-star text-[0.7em] mr-1"></i>แนะนำ</span>' : ''}
        `;

        // ส่วนแสดงชื่อและจังหวัด (Overlay) - บังคับให้อยู่ด้านล่างสุดเสมอ
        const overlay = document.createElement('div');
        overlay.className = 'card-overlay absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4 pointer-events-none min-h-[50%]';
        overlay.innerHTML = `
            <div class="card-info transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="text-xl font-bold text-white shadow-black drop-shadow-md leading-tight">${p.name}</h3>
                <p class="text-sm text-gray-200 mt-1 flex items-center font-medium">
                    <i class="fas fa-map-marker-alt mr-1.5 text-pink-500"></i> ${p.provinceNameThai || 'ไม่ระบุ'}
                </p>
            </div>
        `;

        cardInner.append(img, badges, overlay);
        cardContainer.appendChild(cardInner);
        return cardContainer;
    }
    // =================================================================
    // 9. LIGHTBOX & HELPER FUNCTIONS
    // =================================================================
    async function fetchSingleProfile(slug) {
        if(!supabase) return null;
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).maybeSingle();
            if (error || !data) return null;
            return processProfileData(data);
        } catch { return null; }
    }

    function initLightboxEvents() {
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a.card-link');
            if (link && link.closest('.profile-card-new')) {
                e.preventDefault(); 
                const card = link.closest('.profile-card-new');
                const slug = card.getAttribute('data-profile-slug');
                if (slug) {
                    state.lastFocusedElement = card;
                    history.pushState(null, '', `/sideline/${slug}`);
                    handleRouting(true);
                }
            }
        });

        const closeAction = () => {
            history.pushState(null, '', '/');
            handleRouting(true);
        };

        if(dom.lightboxCloseBtn) dom.lightboxCloseBtn.addEventListener('click', closeAction);
        if(dom.lightbox) dom.lightbox.addEventListener('click', (e) => { if (e.target === dom.lightbox) closeAction(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.currentProfileSlug) closeAction();
        });
    }

    function openLightbox(p) {
        if (!dom.lightbox) return;
        populateLightboxData(p);
        dom.lightbox.classList.remove('hidden');
        gsap.set(dom.lightbox, { opacity: 0 });
        gsap.to(dom.lightbox, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
        gsap.to(dom.lightboxWrapper, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.2)' });
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox(animate = true) {
        if (!dom.lightbox || dom.lightbox.classList.contains('hidden')) return;

        const onComplete = () => {
            dom.lightbox.classList.add('hidden');
            document.body.style.overflow = '';
            state.lastFocusedElement?.focus();
            state.lastFocusedElement = null;
        };

        if (animate) {
            gsap.to(dom.lightbox, { opacity: 0, pointerEvents: 'none', duration: 0.2 });
            gsap.to(dom.lightboxWrapper, { scale: 0.95, opacity: 0, duration: 0.2, onComplete });
        } else {
            dom.lightbox.style.opacity = '0';
            onComplete();
        }
    }

    function populateLightboxData(p) {
        const get = (id) => document.getElementById(id);
        const els = {
            name: get('lightbox-profile-name-main'),
            hero: get('lightboxHeroImage'),
            thumbs: get('lightboxThumbnailStrip'),
            quote: get('lightboxQuote'),
            tags: get('lightboxTags'),
            desc: get('lightboxDescriptionVal'),
            avail: get('lightbox-availability-badge-wrapper'),
            details: get('lightboxDetailsCompact'),
        };

        if (els.name) els.name.textContent = p.name || 'ไม่ระบุชื่อ';
        if (els.quote) {
            els.quote.textContent = p.quote ? `"${p.quote}"` : '';
            els.quote.style.display = p.quote ? 'block' : 'none';
        }

        if (els.hero) {
            els.hero.src = p.images?.[0]?.src || '/images/placeholder-profile.webp';
            els.hero.srcset = p.images?.[0]?.srcset || '';
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
                        els.hero.src = img.src;
                        els.hero.srcset = img.srcset;
                        els.thumbs.querySelector('.active')?.classList.remove('active');
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
            if (p.styleTags?.length) {
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
            const provinceName = state.provincesMap.get(p.provinceKey) || '';
            els.details.innerHTML = `
                <div class="stats-grid-container">
                    <div class="stat-box"><span class="stat-label">อายุ</span><span class="stat-value">${p.age || '-'}</span></div>
                    <div class="stat-box"><span class="stat-label">สัดส่วน</span><span class="stat-value">${p.stats || '-'}</span></div>
                    <div class="stat-box"><span class="stat-label">สูง/หนัก</span><span class="stat-value">${p.height || '-'}/${p.weight || '-'}</span></div>
                </div>
                <div class="info-list-container">
                    <div class="info-row"><div class="info-label"><i class="fas fa-palette info-icon"></i> สีผิว</div><div class="info-value">${p.skinTone || '-'}</div></div>
                    <div class="info-row"><div class="info-label"><i class="fas fa-map-marker-alt info-icon"></i> พิกัด</div><div class="info-value text-primary">${provinceName} (${p.location || '-'})</div></div>
                    <div class="info-row"><div class="info-label"><i class="fas fa-tag info-icon"></i> เรทราคา</div><div class="info-value text-green-600">${p.rate || 'สอบถาม'}</div></div>
                </div>
            `;
        }

        const descContainer = document.querySelector('.lightbox-description-container');
        if(descContainer) {
            descContainer.innerHTML = `
                <div class="description-box">
                    <div class="desc-header"><i class="fas fa-align-left"></i> รายละเอียดเพิ่มเติม</div>
                    <div class="desc-content">${p.description ? p.description.replace(/\n/g, '<br>') : '-'}</div>
                </div>
            `;
        }
        
        const oldWrapper = document.getElementById('line-btn-sticky-wrapper');
        if (oldWrapper) oldWrapper.remove();
        if (p.lineId) {
            const wrapper = document.createElement('div');
            wrapper.id = 'line-btn-sticky-wrapper';
            wrapper.className = 'lb-sticky-footer';
            const link = document.createElement('a');
            link.className = 'btn-line-action';
            link.href = p.lineId.startsWith('http') ? p.lineId : `https://line.me/ti/p/${p.lineId}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer nofollow';
            link.innerHTML = `<i class="fab fa-line"></i> แอดไลน์ ${p.name}`;
            wrapper.appendChild(link);
            const detailsCol = document.querySelector('.lightbox-details');
            if (detailsCol) detailsCol.appendChild(wrapper);
        }

        if (els.avail) {
            els.avail.innerHTML = '';
            let sClass = 'status-inquire', icon = '<i class="fas fa-question-circle"></i>';
            if (p.availability?.includes('รับงาน')) { sClass = 'status-available'; icon = '<i class="fas fa-check-circle"></i>'; }
            else if (p.availability?.includes('ไม่ว่าง')) { sClass = 'status-busy'; icon = '<i class="fas fa-times-circle"></i>'; }
            
            const badge = document.createElement('div');
            badge.className = `lb-status-badge ${sClass}`;
            badge.innerHTML = `${icon} ${p.availability || 'สอบถาม'}`;
            els.avail.appendChild(badge);
        }
    }

// =================================================================
// 10. SEO META TAGS UPDATER (มาตรฐานสูงสุด - พร้อม Fallback, Locale & Rich Schemas)
// =================================================================

const FAQ_DATA = [
    { 
        question: "บริการ Sideline Chiangmai คืออะไร?", 
        answer: "เราคือศูนย์รวมรายชื่อน้องๆ ไซด์ไลน์ อันดับ 1 ที่มีสำนักงานหลักดูแลมาตรฐานความปลอดภัย และมีเครือข่ายน้องๆ รับงานทั่วประเทศ คัดคนสวย ตรงปก 100%" 
    },
    { 
        question: "วิธีการติดต่อและนัดหมายน้องๆ ทำได้อย่างไร?", 
        answer: "คุณสามารถเลือกดูโปรไฟล์น้องที่สนใจ (เลือกจังหวัดได้) แล้วติดต่อผ่านช่องทาง LINE ID หรือเบอร์โทรศัพท์ที่น้องระบุไว้ในรายละเอียดโปรไฟล์โดยตรง" 
    },
    { 
        question: "เรทราคางานไซด์ไลน์เริ่มต้นที่เท่าไหร่?", 
        answer: "เรทราคาเริ่มต้นจะขึ้นอยู่กับน้องแต่ละคนและพื้นที่ให้บริการ โปรดตรวจสอบในหน้าโปรไฟล์ของน้องโดยตรง หรือสอบถามผ่านช่องทางการติดต่อน้อง" 
    }
];

// =================================================================
// แก้ไขส่วน: updateAdvancedMeta (Franchise Style) - ✅ REVISED FOR MAXIMUM SEO
// =================================================================
function updateAdvancedMeta(profile = null, pageData = null) {
    // ล้าง Schema เก่าออกก่อน
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"]');
    oldScripts.forEach(s => s.remove());

    // --- ค่าเริ่มต้นและชื่อแบรนด์ ---
    const BRAND_NAME = "Sideline Chiangmai";
    const GLOBAL_TITLE = `${BRAND_NAME} | ศูนย์รวมไซด์ไลน์ อันดับ 1 ของภาคเหนือ`;
    const GLOBAL_DESC = `ศูนย์รวมน้องๆ ${BRAND_NAME} และรับงานทั่วประเทศ คัดคนสวย ตรงปก ปลอดภัย 100%`;
    
    if (profile) {
        // --- กรณี: หน้าโปรไฟล์ (ปรับปรุงใหม่ทั้งหมด) ---
        const provinceName = state.provincesMap.get(profile.provinceKey) || 'จังหวัด';
        const location = profile.location || provinceName; // ใช้พิกัดย่อยถ้ามี, ไม่มีก็ใช้ชื่อจังหวัด

        // ✅ NEW: สร้าง Title ที่มี Keyword ครบถ้วนและเป็นธรรมชาติ
        // ผลลัพธ์: "น้องเดียร์ ไซด์ไลน์เชียงใหม่ รับงานในเมือง | Sideline Chiangmai"
        const title = `น้อง${profile.name} ไซด์ไลน์${provinceName} รับงาน${location} | ${BRAND_NAME}`;

        // ✅ NEW: สร้าง Description ที่ดึงข้อมูลจริงมาใช้เพื่อความน่าสนใจและไม่ซ้ำใคร
        const styleTagsText = (profile.styleTags && profile.styleTags.length > 0) ? ` สไตล์: ${profile.styleTags.join(', ')}` : '';
        const richDescription = `ติดต่อ น้อง${profile.name} (${profile.age || 'ไม่ระบุ'} ปี) ไซด์ไลน์${provinceName}. สัดส่วน ${profile.stats || 'สอบถาม'}.${styleTagsText} ${profile.quote || 'บริการดี เป็นกันเอง.'} คลิกดูรูปและข้อมูลติดต่อที่นี่!`;
        
        // --- อัปเดต DOM และ Meta Tags ---
        document.title = title;
        updateMeta('description', richDescription); 
        updateMeta('robots', 'index, follow'); 
        updateLink('canonical', `${CONFIG.SITE_URL}/sideline/${profile.slug}`);
        
        updateOpenGraphMeta(profile, title, richDescription, 'profile');
        injectSchema(generatePersonSchema(profile, richDescription));
        injectSchema(generateBreadcrumbSchema('profile', profile.name)); 
        
    } else if (pageData) {
        // --- กรณี: หน้าจังหวัด (ปรับปรุงใหม่ทั้งหมด) ---
        const profileCount = pageData.profiles ? pageData.profiles.length : 0;

        // ✅ NEW: สร้าง Title โดยใส่จำนวนคนเพื่อเพิ่มความน่าเชื่อถือ
        // ผลลัพธ์: "ไซด์ไลน์เชียงใหม่ (25 คน) คัดสวย ตรงปก อัปเดตล่าสุด | Sideline Chiangmai"
        const pageTitle = `ไซด์ไลน์${pageData.provinceName} (${profileCount} คน) คัดสวย ตรงปก | ${BRAND_NAME}`;

        // ✅ NEW: สร้าง Description ที่ใช้ตัวเลขดึงดูดสายตาและบอกความสดใหม่
        const pageDescription = `รวมน้องๆ ไซด์ไลน์${pageData.provinceName}เกรดพรีเมียมกว่า ${profileCount} คน อัปเดตล่าสุด. ค้นหาน้องๆ ที่รับงานในพื้นที่${pageData.provinceName}ได้ทันที พร้อมรีวิวและข้อมูลติดต่อ`;
        
        // --- อัปเดต DOM และ Meta Tags ---
        document.title = pageTitle;
        updateMeta('description', pageDescription);
        updateMeta('robots', 'index, follow'); 
        updateLink('canonical', pageData.canonicalUrl);
        
        updateOpenGraphMeta(null, pageTitle, pageDescription, 'website');
        
        // ✅ REVISED: ส่ง Title ใหม่เข้าไปใน Schema เพื่อให้ข้อมูลตรงกัน
        injectSchema(generateListingSchema({ ...pageData, title: pageTitle }));
        injectSchema(generateBreadcrumbSchema('location', pageData.provinceName));
        
        injectSchema({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": pageData.canonicalUrl,
            "name": `${BRAND_NAME} (${pageData.provinceName})`,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${CONFIG.SITE_URL}/?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        });
        
    } else {
        // --- กรณี: หน้าแรก (คงเดิม) ---
        document.title = GLOBAL_TITLE;
        updateMeta('description', GLOBAL_DESC);
        updateMeta('robots', 'index, follow'); 
        updateLink('canonical', CONFIG.SITE_URL);
        
        updateOpenGraphMeta(null, GLOBAL_TITLE, GLOBAL_DESC, 'website');
        injectSchema(generateWebsiteSchema()); 
        injectSchema(generateOrganizationSchema()); 
        // ✅ NEW: เพิ่ม FAQ Schema ในหน้าแรก
        injectSchema(generateFAQPageSchema(FAQ_DATA));
    }
}

// Helper: OpenGraph & Twitter Card Updates (คงเดิม, ทำงานร่วมกับโค้ดใหม่ได้ดี)
function updateOpenGraphMeta(profile, title, description, type) {
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:url', profile ? `${CONFIG.SITE_URL}/sideline/${profile.slug}` : CONFIG.SITE_URL);
    updateMeta('og:type', type); 
    updateMeta('og:locale', 'th_TH');
    
    let imageUrl = '';
    let imageAlt = '';

    if(profile && profile.images && profile.images[0]) {
        imageUrl = profile.images[0].src;
        imageAlt = `รูปภาพของ ${profile.name} ไซด์ไลน์ ${state.provincesMap.get(profile.provinceKey) || ''}`; 
    } else {
        imageUrl = CONFIG.DEFAULT_OG_IMAGE;
        imageAlt = title;
    }
    
    updateMeta('og:image', imageUrl);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', imageUrl);
    updateMeta('twitter:image:alt', imageAlt); 
}

// Schema: Person (ปรับปรุงให้รับ Rich Description ได้ดีอยู่แล้ว)
function generatePersonSchema(p, descriptionOverride) {
    const provinceName = state.provincesMap.get(p.provinceKey) || '';
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
        "name": p.name,
        "url": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
        "image": p.images[0].src,
        "description": descriptionOverride || p.description,
        "jobTitle": "Sideline Model",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": provinceName,
            "addressRegion": "Thailand"
        },
        "additionalProperty": [
            { "@type": "PropertyValue", "name": "Age", "value": p.age },
            { "@type": "PropertyValue", "name": "Height", "value": p.height },
            { "@type": "PropertyValue", "name": "Price", "value": p.rate }
        ],
        "sameAs": [] 
    };
}

// Schema: Breadcrumb (คงเดิม)
function generateBreadcrumbSchema(pageType, entityName = null) {
    let items = [{ "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.SITE_URL }];
    
    if (pageType === 'profile') {
        items.push({ "@type": "ListItem", "position": 2, "name": "น้องไซด์ไลน์", "item": `${CONFIG.SITE_URL}/profiles.html` }); // ✅ REVISED: ลิงก์ไปยังหน้ารวมโปรไฟล์
        if (entityName) {
             items.push({ "@type": "ListItem", "position": 3, "name": entityName });
        }
    } else if (pageType === 'location') {
        if (entityName) {
             items.push({ "@type": "ListItem", "position": 2, "name": entityName });
        }
    }
    
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
    };
}

// Schema: Website (คงเดิม)
function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": CONFIG.SITE_URL,
        "name": "Sideline Chiangmai",
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${CONFIG.SITE_URL}/?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };
}

// Schema: Organization (คงเดิม)
function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Sideline Chiangmai",
        "url": CONFIG.SITE_URL,
        "logo": `${CONFIG.SITE_URL}/images/logo.png`
    };
}

// Schema: FAQPage (คงเดิม)
function generateFAQPageSchema(faqData) {
    if (!faqData || faqData.length === 0) return null;
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };
}

// Schema: ItemList (คงเดิม)
function generateListingSchema(data) {
    const profiles = Array.isArray(data.profiles) ? data.profiles : [];
    
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": data.title,
        "url": data.canonicalUrl,
        "numberOfItems": profiles.length,
        "itemListElement": profiles.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
            "name": p.name
        }))
    };
}

// Helper functions (คงเดิม)
function injectSchema(json) {
    if (!json) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(json, null, 2); // ✅ REVISED: จัดฟอร์แมตให้อ่านง่ายตอน debug
    document.head.appendChild(script);
}

function updateMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function updateLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        document.head.appendChild(el);
    }
    el.href = href;
}
    // =================================================================
    // 11. UI & UTILS
    // =================================================================
    function updateResultCount(count, total, isFiltering) {
        if (!dom.resultCount) return;
        if (count > 0) {
            dom.resultCount.innerHTML = `✅ พบ ${count} โปรไฟล์${isFiltering ? ` จาก ${total}` : ''}`;
            dom.resultCount.style.display = 'block';
        } else {
            dom.resultCount.innerHTML = '❌ ไม่พบโปรไฟล์ตามเงื่อนไข';
            dom.resultCount.style.display = 'block';
        }
    }

    function init3dCardHoverDelegate() {
        // Disabled for now
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
        const obs = new IntersectionObserver((entries, o) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('is-visible'); o.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
    }

    function initMarqueeEffect() {
        const marquee = document.querySelector('.social-marquee');
        if (!marquee) return;
        const wrapper = marquee.parentElement;
        marquee.innerHTML += marquee.innerHTML;
        let scroll = 0; let speed = 0.5; let isHover = false;
        function loop() {
            if (!isHover) {
                scroll -= speed;
                if (scroll <= -marquee.scrollWidth / 2) scroll = 0;
                marquee.style.transform = `translate3d(${scroll}px, 0, 0)`;
            }
            requestAnimationFrame(loop);
        }
        loop();
        wrapper.addEventListener('mouseenter', () => isHover = true);
        wrapper.addEventListener('mouseleave', () => isHover = false);
    }

    function initThemeToggle() {
        const btns = document.querySelectorAll('.theme-toggle-btn');
        const apply = (theme) => {
            document.documentElement.classList.toggle('dark', theme === 'dark');
            localStorage.setItem(CONFIG.KEYS.THEME, theme);
        };
        const saved = localStorage.getItem(CONFIG.KEYS.THEME) || 'light';
        apply(saved);
        btns.forEach(b => b.onclick = () => apply(document.documentElement.classList.contains('dark') ? 'light' : 'dark'));
    }

    function initMobileMenu() {
        const btn = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('menu-backdrop');
        const close = document.getElementById('close-sidebar-btn');
        if (!btn || !sidebar) return;
        const toggle = (open) => {
            sidebar.classList.toggle('translate-x-full', !open);
            sidebar.classList.toggle('open', open);
            backdrop?.classList.toggle('hidden', !open);
            document.body.style.overflow = open ? 'hidden' : '';
        };
        btn.onclick = () => toggle(true);
        close.onclick = () => toggle(false);
        backdrop.onclick = () => toggle(false);
    }

// ==========================================
// ✨ NEW FEATURE: VIP AGE GATE (SEO & BOT FRIENDLY)
// ==========================================
function initAgeVerification() {
    // 1. 🛡️ ตรวจสอบ Bot ทันที (SEO Stealth Mode)
    // เพิ่มการตรวจจับ Bot ทุกค่าย รวมถึงตัว Crawler ของโซเชียลมีเดีย
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|ia_archiver|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|quora\ link\ preview|outbrain|pinterest\/0\.|vkShare|W3C_Validator/i.test(navigator.userAgent);

    // 🔥 ถ้าเป็น Bot ให้ "Return" ออกไปทันที (ทะลุผ่าน) ไม่ต้องสร้างหน้ากั้นอายุ
    if (isBot) {
        console.log("SEO Mode: Search Engine detected. Bypassing age verification for full indexing.");
        return; 
    }

    // 2. ตรวจสอบสถานะเดิมสำหรับ User ทั่วไป (คน)
    const ts = localStorage.getItem(CONFIG.KEYS.AGE_CONFIRMED);
    if (ts && (Date.now() - parseInt(ts)) < 3600000) return;

    // 3. เริ่มสร้าง UI สำหรับคนปกติ (ถ้าไม่ใช่ Bot และยังไม่ได้กดยืนยัน)
    const div = document.createElement('div');
    div.id = 'age-verification-overlay';
    
    // ใช้ Inline Style ผสม Tailwind เพื่อความชัวร์เรื่อง Layout
    div.style.cssText = "position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; overflow: hidden;";
    
    div.innerHTML = `
        <!-- พื้นหลังรูปภาพ (เบลอ) -->
        <div style="position: absolute; inset: 0; background-image: url('/images/placeholder-profile.webp'); background-size: cover; background-position: center; filter: blur(20px); opacity: 0.4; transform: scale(1.1);"></div>
        <!-- พื้นหลังสีดำทับ -->
        <div style="position: absolute; inset: 0; background-color: rgba(0, 0, 0, 0.75); backdrop-filter: blur(10px);"></div>

        <!-- การ์ด VIP (Glassmorphism) -->
        <div style="position: relative; z-index: 10; width: 100%; max-width: 380px; margin: 16px;">
            <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(16px); border-radius: 24px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); text-align: center; overflow: hidden;">
                
                <!-- แสงพาดด้านบน -->
                <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 50%; height: 4px; background: linear-gradient(90deg, transparent, #ec4899, transparent); opacity: 0.8;"></div>
                
                <div style="margin-bottom: 24px;">
                    <!-- วงกลม 20+ -->
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 70px; height: 70px; border-radius: 9999px; background-color: rgba(236, 72, 153, 0.15); margin-bottom: 16px; border: 1px solid rgba(236, 72, 153, 0.5); box-shadow: 0 0 20px rgba(236, 72, 153, 0.2);">
                        <span style="font-size: 24px; font-weight: 800; color: #ec4899;">20+</span>
                    </div>
                    
                    <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Restricted Area</h2>
                    <p style="color: #d1d5db; font-size: 14px; line-height: 1.6;">
                        เว็บไซต์นี้มีเนื้อหาสำหรับผู้ใหญ่<br>
                        กรุณายืนยันว่าคุณมีอายุ 20 ปีบริบูรณ์
                    </p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button id="age-confirm" style="width: 100%; padding: 14px; background: linear-gradient(90deg, #ec4899, #9333ea); color: white; font-weight: 700; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4); transition: transform 0.2s;">
                        ยืนยัน (เข้าสู่เว็บไซต์)
                    </button>
                    <button id="age-reject" style="width: 100%; padding: 12px; background: transparent; color: #9ca3af; font-size: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">
                        ออกจากเว็บไซต์
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(div);
    document.body.style.overflow = 'hidden';

    // Animation Effect (GSAP)
    const card = div.querySelector('div[style*="background: rgba"]'); 
    if (window.gsap) {
        gsap.from(card, { 
            y: 50, 
            opacity: 0, 
            duration: 0.8, 
            ease: "back.out(1.2)",
            delay: 0.2 
        });
    }

    // Event Listeners
    document.getElementById('age-confirm').onclick = () => {
        localStorage.setItem(CONFIG.KEYS.AGE_CONFIRMED, Date.now());
        if (window.gsap) {
            gsap.to(card, { scale: 0.9, opacity: 0, duration: 0.3 });
            gsap.to(div, { 
                opacity: 0, 
                duration: 0.5, 
                onComplete: () => {
                    div.remove();
                    document.body.style.overflow = '';
                }
            });
        } else {
            div.remove();
            document.body.style.overflow = '';
        }
    };

    document.getElementById('age-reject').onclick = () => {
        window.location.href = 'https://google.com';
    };
}
    function updateActiveNavLinks() {
        const path = window.location.pathname;
        document.querySelectorAll('nav a').forEach(l => {
            l.classList.toggle('text-pink-600', l.getAttribute('href') === path);
        });
    }

function createGlobalLoader() {
    if (document.getElementById('global-loader-overlay')) return;

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes bounce-gentle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        .animate-bounce-gentle { animation: bounce-gentle 1.5s infinite ease-in-out; }
    `;
    document.head.appendChild(style);

    const loaderHTML = `
        <div id="global-loader-overlay" style="position: fixed; inset: 0; z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #ffffff; transition: background-color 0.3s;" class="dark:bg-gray-900">
            <div style="position: relative; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: #ec4899; opacity: 0.2;" class="animate-ping"></div>
                <div style="position: absolute; inset: 10px; border-radius: 9999px; background-color: #ec4899; opacity: 0.4;" class="animate-pulse"></div>
                <div style="position: relative; z-index: 10; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); box-shadow: 0 10px 25px -5px rgba(236, 72, 153, 0.4);">
                    <i class="fas fa-heart animate-bounce-gentle" style="font-size: 36px; color: #ffffff;"></i>
                </div>
            </div>
            
            <div style="margin-top: 24px; text-align: center;">
                <!-- ✅ แก้ตรงนี้ให้เป็นตัวใหญ่ Sideline Chiangmai -->
                <h3 style="font-size: 18px; font-weight: 800; color: #374151; letter-spacing: 0.1em; text-transform: uppercase;" class="dark:text-white">Sideline Chiangmai</h3>
                <p style="font-size: 12px; color: #ec4899; margin-top: 4px; font-weight: 500;">กำลังคัดเลือกคนสวย...</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loaderHTML);
}
function showLoadingState() {
    let loader = document.getElementById('global-loader-overlay');
    if (!loader) {
        createGlobalLoader();
        loader = document.getElementById('global-loader-overlay');
    }
    // ใช้ GSAP ดึงกลับมาถ้ามันซ่อนอยู่
    gsap.set(loader, { display: 'flex', opacity: 1, pointerEvents: 'all' });
}

function hideLoadingState() {
    const loader = document.getElementById('global-loader-overlay');
    if (loader) {
        // Animation ตอนโหลดเสร็จ: ขยายวงออกแล้วจางหาย
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                // Trigger ให้ ScrollTrigger ทำงานใหม่หลังจาก Loader หาย
                ScrollTrigger.refresh();
            }
        });
    }
    if(dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
}
// =================================================================
    // 12. ADMIN TOOLS (SITEMAP GENERATOR) - สำหรับจัดการด้วยมือถือ
    // =================================================================
    function initMobileSitemapTrigger() {
        // สร้างปุ่มล่องหนที่มุมขวาล่าง (กด 5 ครั้งเพื่อเปิดเมนูแอดมิน)
        const ghostBtn = document.createElement('div');
        Object.assign(ghostBtn.style, { 
            position: 'fixed', bottom: '0', right: '0', 
            width: '60px', height: '60px', zIndex: '99999', 
            cursor: 'pointer', background: 'transparent', 
            touchAction: 'manipulation' 
        });
        document.body.appendChild(ghostBtn);

        let clicks = 0; 
        let timeout;

        ghostBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            clicks++; 
            clearTimeout(timeout);
            timeout = setTimeout(() => { clicks = 0; }, 1500);

            if (clicks >= 5) {
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                
                if (state.allProfiles.length === 0) { 
                    alert("⚠️ ข้อมูลยังโหลดไม่เสร็จ กรุณารอสักครู่"); 
                    clicks = 0; return; 
                }

                const confirmGen = confirm(`⚙️ Admin Menu:\nพบข้อมูล ${state.allProfiles.length} รายการ\nต้องการดาวน์โหลด sitemap.xml ใช่ไหม?`);
                if (confirmGen) { 
                    try { 
                        const xml = generateSitemapXML(); 
                        downloadFile('sitemap.xml', xml); 
                    } catch (err) { 
                        alert("❌ เกิดข้อผิดพลาด: " + err.message); 
                    } 
                }
                clicks = 0;
            }
        });
    }

    function generateSitemapXML() {
        const baseUrl = CONFIG.SITE_URL.replace(/\/$/, '');
        const urls = [];

        const escapeXml = (str) => {
            if (!str) return '';
            return str.replace(/&/g, '&amp;').replace(/'/g, '&apos;')
                      .replace(/"/g, '&quot;').replace(/>/g, '&gt;')
                      .replace(/</g, '&lt;');
        };

        const processUrl = (path) => {
            const encodedPath = encodeURIComponent(path).replace(/%2F/g, '/');
            return escapeXml(`${baseUrl}/${encodedPath}`);
        };

        // 1. หน้าแรก
        urls.push({ loc: processUrl(''), priority: '1.0', freq: 'daily' });

        // 2. หน้า Profile น้องๆ + รูปภาพ (SEO หัวใจสำคัญ)
        state.allProfiles.forEach(p => { 
            if (p.slug) { 
                let imageTag = '';
                if (p.images && p.images.length > 0 && p.images[0].src) {
                    const imgUrl = escapeXml(p.images[0].src);
                    imageTag = `
        <image:image>
            <image:loc>${imgUrl}</image:loc>
            <image:title>${escapeXml(p.name || 'Profile Image')}</image:title>
        </image:image>`;
                }

                urls.push({ 
                    loc: processUrl(`sideline/${p.slug.trim()}`), 
                    priority: '0.9', 
                    freq: 'daily',
                    imageXml: imageTag 
                }); 
            } 
        });

        // 3. หน้า Location (จังหวัด)
        if (state.provincesMap && state.provincesMap.size > 0) { 
            state.provincesMap.forEach((name, key) => { 
                urls.push({ loc: processUrl(`location/${key}`), priority: '0.8', freq: 'daily' }); 
            }); 
        }

        // 4. หน้า Static อื่นๆ
        ['blog.html', 'about.html', 'faq.html', 'profiles.html', 'locations.html'].forEach(page => { 
            urls.push({ loc: processUrl(page), priority: '0.7', freq: 'weekly' }); 
        });

        const xmlContent = urls.map(u => 
            `<url>
            <loc>${u.loc}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>${u.freq}</changefreq>
            <priority>${u.priority}</priority>${u.imageXml || ''}
        </url>`
        ).join('');

        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlContent}
</urlset>`;
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        setTimeout(() => { URL.revokeObjectURL(url); alert("✅ ดาวน์โหลด Sitemap สำเร็จ! นำไฟล์นี้ไปวางที่ root ของเว็บไซต์"); }, 100);
    }

    // =================================================================
    // 13. SEO & CANONICAL SYSTEM (ปลดล็อก Google ให้เจอทุกหน้า)
    // =================================================================
    function updateSEO(title, description, imagePath, path = window.location.pathname) {
        const DOMAIN = 'https://sidelinechiangmai.netlify.app';
        const fullUrl = `${DOMAIN}${path}`;
        
        // จัดการเรื่องรูปภาพ OG Image
        let fullImageUrl = `${DOMAIN}/images/default_og_image.jpg`;
        if (imagePath) {
            fullImageUrl = imagePath.startsWith('http') ? imagePath : `https://hgzbgpbmymoiwjpaypvl.supabase.co/storage/v1/object/public/profile-images/${imagePath}`;
        }

        // 1. เปลี่ยน Title
        document.title = title;

        // 2. อัปเดต Meta Description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', description);

        // 3. อัปเดต Canonical Link (ID ต้องตรงกับใน index.html)
        let canonical = document.getElementById('canonical-link');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.id = 'canonical-link';
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', fullUrl);

        // 4. อัปเดต Social Media Tags (OG)
        const updateMeta = (prop, val) => {
            const el = document.querySelector(`meta[property="${prop}"]`);
            if (el) el.setAttribute('content', val);
        };
        updateMeta('og:title', title);
        updateMeta('og:url', fullUrl);
        updateMeta('og:image', fullImageUrl);
        updateMeta('og:description', description);
    }

    // =================================================================
    // 14. DYNAMIC FOOTER SYSTEM
    // =================================================================
    async function initFooterLinks() {
        const footerContainer = document.getElementById('popular-locations-footer');
        if (!footerContainer) return;

        let provincesList = [];

        if (state.provincesMap && state.provincesMap.size > 0) {
            state.provincesMap.forEach((name, key) => {
                provincesList.push({ key: key, name: name });
            });
        }

        provincesList.sort((a, b) => a.name.localeCompare(b.name, 'th'));

        const loadingPulse = footerContainer.querySelector('.animate-pulse');
        if (loadingPulse) {
            loadingPulse.parentElement.remove();
        }

        const displayLimit = 9999; 
        let addedCount = footerContainer.querySelectorAll('li').length;

        provincesList.forEach(p => {
            const exists = footerContainer.querySelector(`a[href*="/location/${p.key}"]`);
            if (!exists && addedCount < displayLimit) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="/location/${p.key}" title="รับงาน${p.name} | Sideline Chiangmai" class="hover:text-pink-500 transition-colors">ไซด์ไลน์${p.name}</a>`;
                footerContainer.appendChild(li);
                addedCount++;
            }
        });

        if (provincesList.length > addedCount && !footerContainer.querySelector('.view-all-link')) {
            const viewAll = document.createElement('li');
            viewAll.className = 'view-all-link';
            viewAll.innerHTML = `<a href="/profiles.html" class="text-pink-500 font-bold hover:underline mt-2 inline-block">ดูจังหวัดทั้งหมด (${provincesList.length})</a>`;
            footerContainer.appendChild(viewAll);
        }
    }

    // =================================================================
    // START APPLICATION
    // =================================================================
    initMobileSitemapTrigger();
    initFooterLinks();

})();