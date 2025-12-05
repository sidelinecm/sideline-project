
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";

gsap.registerPlugin(ScrollTrigger);

(function () {
    'use strict';
    const CONFIG = {
        SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
        STORAGE_BUCKET: 'profile-images',
        CACHE_TTL_HOURS: 24,
        KEYS: {
            LAST_PROVINCE: 'sidelinecm_last_province',
            CACHE_PROFILES: 'cachedProfiles',
            LAST_FETCH: 'lastFetchTime',
            AGE_CONFIRMED: 'ageConfirmedTimestamp'
        },
        SITE_URL: 'https://sidelinechiangmai.netlify.app'
    };

    // =================================================================
    // 2. GLOBAL STATE
    // =================================================================
    let state = {
        allProfiles: [],
        provincesMap: new Map(),
        currentProfileSlug: null,
        lastFocusedElement: null,
        isFetching: false
    };

    const dom = {};

    // =================================================================
    // 3. SUPABASE CLIENT
    // =================================================================
    let supabase;
    try {
        if (!window.supabaseClient && typeof createClient !== 'undefined') {
            window.supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        }
        supabase = window.supabaseClient || createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    } catch (e) {
        console.error("Supabase Init Failed:", e);
    }

    // =================================================================
    // 4. MAIN ENTRY POINT
    // =================================================================
    document.addEventListener('DOMContentLoaded', initApp);

    async function initApp() {
        cacheDOMElements();
        
        // UI Inits
        if (typeof window.initThemeToggle === 'function') window.initThemeToggle(); else initThemeToggle();
        if (typeof window.initMobileMenu === 'function') window.initMobileMenu(); else initMobileMenu();
        if (typeof window.initAgeVerification === 'function') window.initAgeVerification(); else initAgeVerification();

        initHeaderScrollEffect();
        initMarqueeEffect();
        initMobileSitemapTrigger(); // Invisible Admin Button
        
        if (typeof updateActiveNavLinks === 'function') updateActiveNavLinks();

        // Main Logic
        await handleRouting(); 
        await handleDataLoading();

        // Footer Year
        const yearSpan = document.getElementById('currentYearDynamic');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        document.body.classList.add('loaded');
        
        // Intro Animation
        if (window.location.pathname === '/' && !state.currentProfileSlug) {
            try {
                gsap.from(['#hero-h1', '#hero-p', '#hero-form'], {
                    y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.3
                });
            } catch(e){}
        }

        // Navigation Listener
        window.addEventListener('popstate', async () => {
            await handleRouting();
            if (typeof updateActiveNavLinks === 'function') updateActiveNavLinks();
        });
    }

    function cacheDOMElements() {
        dom.body = document.body;
        dom.pageHeader = document.getElementById('page-header');
        dom.loadingPlaceholder = document.getElementById('loading-profiles-placeholder');
        dom.profilesDisplayArea = document.getElementById('profiles-display-area');
        dom.noResultsMessage = document.getElementById('no-results-message');
        dom.fetchErrorMessage = document.getElementById('fetch-error-message');
        dom.retryFetchBtn = document.getElementById('retry-fetch-btn');
        dom.searchForm = document.getElementById('search-form');
        dom.searchInput = document.getElementById('search-keyword');
        dom.provinceSelect = document.getElementById('search-province');
        dom.availabilitySelect = document.getElementById('search-availability');
        dom.featuredSelect = document.getElementById('search-featured');
        dom.resetSearchBtn = document.getElementById('reset-search-btn');
        dom.resultCount = document.getElementById('result-count');
        dom.featuredSection = document.getElementById('featured-profiles');
        dom.featuredContainer = document.getElementById('featured-profiles-container');
        dom.lightbox = document.getElementById('lightbox');
        dom.lightboxCloseBtn = document.getElementById('closeLightboxBtn');
        dom.lightboxWrapper = document.getElementById('lightbox-content-wrapper-el');
    }

    // =================================================================
    // 5. SMART DATA SYNC
    // =================================================================
    async function handleDataLoading() {
        showLoadingState();
        const success = await fetchData();
        hideLoadingState();

        if (success) {
            initSearchAndFilters();
            initLightboxEvents(); // ✅ สำคัญ: เริ่มระบบดักจับการคลิก
            init3dCardHoverDelegate();
            await handleRouting(true);

            if (dom.retryFetchBtn) {
                dom.retryFetchBtn.onclick = async () => {
                    dom.fetchErrorMessage.style.display = 'none';
                    await handleDataLoading();
                };
            }
        } else {
            showErrorState();
        }
    }

    async function fetchData() {
        if (state.isFetching) return false;
        state.isFetching = true;

        try {
            const NOW = new Date();
            const lastFetchTimeStr = localStorage.getItem(CONFIG.KEYS.LAST_FETCH);
            let isFullSync = !lastFetchTimeStr;
            let fetchTimeKey = lastFetchTimeStr || '1970-01-01T00:00:00.000Z';

            if (lastFetchTimeStr) {
                const hoursDiff = (NOW - new Date(lastFetchTimeStr)) / (1000 * 60 * 60);
                if (hoursDiff > CONFIG.CACHE_TTL_HOURS) {
                    isFullSync = true;
                    fetchTimeKey = '1970-01-01T00:00:00.000Z';
                }
            }

            let profilesQuery = supabase.from('profiles').select('*');
            if (!isFullSync) profilesQuery.gt('lastUpdated', fetchTimeKey);

            const [profilesRes, provincesRes] = await Promise.all([
                profilesQuery,
                supabase.from('provinces').select('*').order('nameThai', { ascending: true })
            ]);

            if (profilesRes.error) throw profilesRes.error;
            if (provincesRes.error) throw provincesRes.error;

            const fetchedProfiles = profilesRes.data || [];
            
            state.provincesMap.clear();
            (provincesRes.data || []).forEach(p => {
                if (p?.key && p?.nameThai) state.provincesMap.set(p.key, p.nameThai);
            });

            let currentProfiles = [];
            if (isFullSync) {
                currentProfiles = fetchedProfiles;
            } else {
                try {
                    const cachedJSON = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
                    const cachedProfiles = cachedJSON ? JSON.parse(cachedJSON) : [];
                    const profileMap = new Map(cachedProfiles.map(p => [p.id, p]));
                    fetchedProfiles.forEach(p => profileMap.set(p.id, p));
                    currentProfiles = Array.from(profileMap.values());
                } catch {
                    currentProfiles = fetchedProfiles;
                }
            }

            state.allProfiles = currentProfiles.map(processProfileData);
            state.allProfiles.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));

            if (state.allProfiles.length > 0) {
                try {
                    localStorage.setItem(CONFIG.KEYS.CACHE_PROFILES, JSON.stringify(currentProfiles));
                    let newFetchTime = NOW.toISOString();
                    if (!isFullSync && fetchedProfiles.length > 0) {
                        const maxTime = Math.max(...fetchedProfiles.map(p => new Date(p.lastUpdated).getTime()));
                        if (!isNaN(maxTime)) newFetchTime = new Date(maxTime).toISOString();
                    } else if (isFullSync) {
                        newFetchTime = NOW.toISOString();
                    }
                    localStorage.setItem(CONFIG.KEYS.LAST_FETCH, newFetchTime);
                } catch (e) {
                    console.warn("Storage Quota Exceeded", e);
                }
            }

            populateProvinceDropdown();
            renderProfiles(state.allProfiles, false);
            
            state.isFetching = false;
            return true;
        } catch (err) {
            console.error('Fetch Error:', err);
            const cachedJSON = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
            if (cachedJSON) {
                try {
                    const cached = JSON.parse(cachedJSON);
                    state.allProfiles = cached.map(processProfileData);
                    populateProvinceDropdown();
                    renderProfiles(state.allProfiles, false);
                    state.isFetching = false;
                    return true;
                } catch(e){}
            }
            state.isFetching = false;
            return false;
        }
    }

    function processProfileData(p) {
        const imagePaths = [p.imagePath, ...(Array.isArray(p.galleryPaths) ? p.galleryPaths : [])].filter(Boolean);
        const imageObjects = imagePaths.map(path => {
            const { data } = supabase.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
            let url = data?.publicUrl || '/images/placeholder-profile-card.webp';
            let sep = url.includes('?') ? '&' : '?';
            if (p.lastUpdated) {
                url = `${url}${sep}v=${Math.floor(new Date(p.lastUpdated).getTime() / 1000)}`;
            }
            return {
                src: `${url}${url.includes('?') ? '&' : '?'}width=600&quality=80`,
                srcset: [300, 600].map(w => `${url}${url.includes('?') ? '&' : '?'}width=${w}&quality=80 ${w}w`).join(', ')
            };
        });

        if (imageObjects.length === 0) imageObjects.push({ src: '/images/placeholder-profile.webp', srcset: '' });

        const provinceName = state.provincesMap.get(p.provinceKey) || '';
        
        const tags = (p.styleTags || []).join(' ');
        const fullSearchString = `${p.name} ${p.description} ${p.provinceKey} ${provinceName} ${tags} ${p.height} ${p.weight} ${p.skinTone} ${p.rate}`.toLowerCase();

        return { 
            ...p, 
            images: imageObjects, 
            altText: p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name} จังหวัด ${provinceName}`,
            searchString: fullSearchString,
            _price: Number(p.rate) || 0,
            _age: Number(p.age) || 0
        };
    }

    function populateProvinceDropdown() {
        if (!dom.provinceSelect || dom.provinceSelect.options.length > 1) return;
        const sorted = Array.from(state.provincesMap.entries()).sort((a, b) => a[1].localeCompare(b[1], 'th'));
        const fragment = document.createDocumentFragment();
        sorted.forEach(([key, name]) => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = name;
            fragment.appendChild(opt);
        });
        dom.provinceSelect.appendChild(fragment);
    }

    // =================================================================
    // 6. ROUTING & SEO
    // =================================================================
    async function handleRouting(dataLoaded = false) {
        const path = window.location.pathname.toLowerCase();
        
        // Profile Page
        const profileMatch = path.match(/^\/profile\/([^/]+)/);
        if (profileMatch) {
            const slug = decodeURIComponent(profileMatch[1]);
            state.currentProfileSlug = slug;
            
            let profile = state.allProfiles.find(p => (p.slug || '').toLowerCase() === slug.toLowerCase());
            if (!profile && !dataLoaded) {
                profile = await fetchSingleProfile(slug);
            }

            if (profile) {
                openLightbox(profile);
                updateAdvancedMeta(profile, null);
                if(dom.profilesDisplayArea) dom.profilesDisplayArea.style.display = 'none';
            } else if (dataLoaded) {
                history.replaceState(null, '', '/');
                closeLightbox(false);
                if(dom.profilesDisplayArea) dom.profilesDisplayArea.style.display = 'block';
                state.currentProfileSlug = null;
            }
            return;
        } 
        
        // Province Page
        const provinceMatch = path.match(/^\/province\/([^/]+)/);
        if (provinceMatch) {
            const provinceKey = decodeURIComponent(provinceMatch[1]);
            state.currentProfileSlug = null;
            closeLightbox(false);
            if (dom.provinceSelect) dom.provinceSelect.value = provinceKey;
            
            if (dataLoaded) {
                applyFilters(false);
                const provinceName = state.provincesMap.get(provinceKey) || provinceKey;
                const seoData = {
                    title: `รับงาน${provinceName} | รวมสาวไซด์ไลน์${provinceName} ฟิวแฟน`,
                    description: `รวมน้องๆ ไซด์ไลน์ ${provinceName} รับงานเอง ไม่ผ่านเอเย่นต์ คัดคนสวย ตรงปก ปลอดภัย`,
                    canonicalUrl: `${CONFIG.SITE_URL}/province/${provinceKey}`,
                    profiles: state.allProfiles.filter(p => p.provinceKey === provinceKey)
                };
                updateAdvancedMeta(null, seoData);
                if(dom.profilesDisplayArea) dom.profilesDisplayArea.style.display = 'block';
            }
            return;
        }

        // Home Page
        state.currentProfileSlug = null;
        closeLightbox(false);
        if(dom.profilesDisplayArea) dom.profilesDisplayArea.style.display = 'block';
        if (dataLoaded) {
            applyFilters(false);
            updateAdvancedMeta(null, null);
        }
    }

    // =================================================================
    // 7. SMART SEARCH & FILTER ENGINE
    // =================================================================
    function initSearchAndFilters() {
        if (!dom.searchForm) return;

        const urlParams = new URLSearchParams(window.location.search);
        if (dom.searchInput) dom.searchInput.value = urlParams.get('q') || '';
        
        const pathProvince = window.location.pathname.match(/^\/province\/([^/]+)/);
        if (pathProvince) {
            if (dom.provinceSelect) dom.provinceSelect.value = pathProvince[1];
        } else {
            if (dom.provinceSelect) dom.provinceSelect.value = urlParams.get('province') || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || '';
        }

        const debounce = (fn, delay) => {
            let timeout;
            return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => fn(...args), delay); };
        };

        const onFilterChange = debounce(() => applyFilters(true), 300);

        dom.searchForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(true); });
        dom.resetSearchBtn?.addEventListener('click', () => { resetFilters(); applyFilters(true); });
        dom.searchInput?.addEventListener('input', () => { updateSuggestions(); onFilterChange(); });
        
        dom.provinceSelect?.addEventListener('change', () => {
            const val = dom.provinceSelect.value;
            if (val && val !== 'all') {
                history.pushState(null, '', `/province/${val}`);
                handleRouting(true);
            } else {
                history.pushState(null, '', '/');
                handleRouting(true);
            }
        });

        dom.availabilitySelect?.addEventListener('change', onFilterChange);
        dom.featuredSelect?.addEventListener('change', onFilterChange);
        ensureSuggestionContainer();
    }

    function resetFilters() {
        if (dom.searchInput) dom.searchInput.value = '';
        if (dom.provinceSelect) dom.provinceSelect.value = '';
        if (dom.availabilitySelect) dom.availabilitySelect.value = '';
        if (dom.featuredSelect) dom.featuredSelect.value = '';
        localStorage.removeItem(CONFIG.KEYS.LAST_PROVINCE);
        history.pushState(null, '', '/');
        handleRouting(true);
    }

    function applyFilters(updateUrl = true) {
        const query = {
            text: dom.searchInput?.value?.trim() || '',
            province: dom.provinceSelect?.value || '',
            avail: dom.availabilitySelect?.value || '',
            featured: dom.featuredSelect?.value === 'true'
        };

        if (query.province && query.province !== 'all') localStorage.setItem(CONFIG.KEYS.LAST_PROVINCE, query.province);
        else localStorage.removeItem(CONFIG.KEYS.LAST_PROVINCE);

        const parsedSearch = parseSmartSearch(query.text);

        const filtered = state.allProfiles.filter(p => {
            try {
                const basicMatch = 
                    (!query.province || query.province === 'all' || p.provinceKey === query.province) &&
                    (!query.avail || query.avail === 'all' || p.availability === query.avail) &&
                    (!query.featured || p.isfeatured);

                if (!basicMatch) return false;
                return matchesSmartProfile(p, parsedSearch);
            } catch { return false; }
        });

        if (updateUrl) {
            const params = new URLSearchParams(window.location.search);
            if (query.text) params.set('q', query.text); else params.delete('q');
            if (query.avail && query.avail !== 'all') params.set('availability', query.avail); else params.delete('availability');
            if (query.featured) params.set('featured', 'true'); else params.delete('featured');
            
            const currentPath = window.location.pathname;
            const search = params.toString();
            if (!currentPath.includes('/province/')) {
                 const newUrl = currentPath + (search ? '?' + search : '');
                 history.pushState({}, '', newUrl);
            }
        }

        const isSearching = !!(query.text || (query.province && query.province !== 'all') || (query.avail && query.avail !== 'all') || query.featured);
        updateResultCount(filtered.length, state.allProfiles.length, isSearching);
        renderProfiles(filtered, isSearching);
    }

    function parseSmartSearch(term) {
        if (!term) return { tokens: [], ranges: [] };
        const rawTokens = term.toLowerCase().split(/\s+/).filter(Boolean);
        const tokens = [];
        const ranges = [];

        rawTokens.forEach(t => {
            const explicit = t.match(/^([a-z]+):(.+)$/);
            if (explicit) {
                const key = explicit[1];
                const val = explicit[2];
                if (key === 'price' || key === 'rate') {
                    if (val.includes('-')) {
                        const [min, max] = val.split('-');
                        ranges.push({ key: 'price', min: +min, max: +max });
                    } else if (val.startsWith('<')) ranges.push({ key: 'price', max: +val.substring(1) });
                    else if (val.startsWith('>')) ranges.push({ key: 'price', min: +val.substring(1) });
                    else ranges.push({ key: 'price', exact: +val });
                } else if (key === 'age') {
                    if (val.includes('-')) {
                        const [min, max] = val.split('-');
                        ranges.push({ key: 'age', min: +min, max: +max });
                    } else ranges.push({ key: 'age', exact: +val });
                } else tokens.push(val);
                return;
            }
            if (/^\d+$/.test(t)) {
                const num = parseInt(t);
                if (num >= 100) ranges.push({ key: 'price', max: num + 500 });
                else if (num >= 18 && num <= 60) ranges.push({ key: 'age', exact: num });
                else tokens.push(t);
                return;
            }
            if (/^\d+-\d+$/.test(t)) {
                const [min, max] = t.split('-').map(Number);
                if (max > 100) ranges.push({ key: 'price', min, max });
                else ranges.push({ key: 'age', min, max });
                return;
            }
            tokens.push(t);
        });
        return { tokens, ranges };
    }

    function matchesSmartProfile(p, parsed) {
        for (const r of parsed.ranges) {
            const val = r.key === 'price' ? p._price : p._age;
            if (r.exact !== undefined && val !== r.exact) return false;
            if (r.min !== undefined && val < r.min) return false;
            if (r.max !== undefined && val > r.max) return false;
        }
        for (const token of parsed.tokens) {
            if (!p.searchString.includes(token)) return false;
        }
        return true;
    }

    // =================================================================
    // 8. RENDERING SYSTEM
    // =================================================================
    function renderProfiles(profiles, isSearching) {
        if (!dom.profilesDisplayArea) return;

        dom.profilesDisplayArea.replaceChildren();
        
        if(dom.featuredSection) {
            const showFeatured = !isSearching || (isSearching && dom.featuredSelect?.value === 'true');
            dom.featuredSection.classList.toggle('hidden', !showFeatured);
            
            if (showFeatured && dom.featuredContainer && state.allProfiles.length > 0) {
                if (dom.featuredContainer.children.length === 0) {
                     const featured = state.allProfiles.filter(p => p.isfeatured);
                     const frag = document.createDocumentFragment();
                     featured.forEach(p => frag.appendChild(createProfileCard(p)));
                     dom.featuredContainer.appendChild(frag);
                }
            }
        }

        if (profiles.length === 0) {
            if (dom.noResultsMessage) dom.noResultsMessage.classList.remove('hidden');
            return;
        }
        if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');

        if (isSearching || window.location.pathname.includes('/province/')) {
            dom.profilesDisplayArea.appendChild(createSearchResultSection(profiles));
        } else {
            renderByProvince(profiles);
        }

        initScrollAnimations();
    }

    function renderByProvince(profiles) {
        const groups = profiles.reduce((acc, p) => {
            const key = p.provinceKey || 'no_province';
            (acc[key] = acc[key] || []).push(p);
            return acc;
        }, {});

        const keys = Object.keys(groups).sort((a, b) => {
            const nA = state.provincesMap.get(a) || a;
            const nB = state.provincesMap.get(b) || b;
            return nA.localeCompare(nB, 'th');
        });

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
        wrapper.id = `province-${key}`;
        wrapper.setAttribute('data-animate-on-scroll', '');

        wrapper.innerHTML = `
            <div class="p-6 md:p-8">
                <a href="/province/${key}" class="group block">
                    <h2 class="province-section-header flex items-center gap-2.5 text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-pink-600 transition-colors">
                        📍 จังหวัด ${name}
                        <span class="ml-2 bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded-full">${profiles.length}</span>
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

    function createSearchResultSection(profiles) {
        let headerText = "ผลการค้นหา";
        const path = window.location.pathname;
        if (path.includes('/province/')) {
            const match = path.match(/\/province\/([^/]+)/);
            if (match) {
                const name = state.provincesMap.get(match[1]) || match[1];
                headerText = `📍 น้องๆในจังหวัด ${name}`;
            }
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'section-content-wrapper';
        wrapper.setAttribute('data-animate-on-scroll', '');
        wrapper.innerHTML = `
          <div class="p-6 md:p-8">
            <h3 class="text-xl font-bold">${headerText}</h3>
            <p class="mt-2 text-sm text-muted-foreground">พบ ${profiles.length} โปรไฟล์</p>
          </div>
          <div class="profile-grid grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 px-6 md:px-8 pb-8"></div>
        `;
        const grid = wrapper.querySelector('.profile-grid');
        const frag = document.createDocumentFragment();
        profiles.forEach(p => frag.appendChild(createProfileCard(p)));
        grid.appendChild(frag);
        return wrapper;
    }

    // ✅ FIX: Create Profile Card with SEO Link + Pointer Events
    function createProfileCard(p) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'profile-card-new-container';

        const cardInner = document.createElement('div');
        cardInner.className = 'profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-800 cursor-pointer transform transition-all duration-300';
        cardInner.setAttribute('data-profile-id', p.id);
        cardInner.setAttribute('data-profile-slug', p.slug);
        cardInner.setAttribute('role', 'button');
        cardInner.setAttribute('tabindex', '0');

        // ✅ Link SEO Overlay
        cardInner.innerHTML = `<a href="/profile/${p.slug}" class="card-link absolute inset-0 z-20" aria-label="ดูโปรไฟล์ ${p.name}"></a>`;

        const imgObj = p.images[0];
        const img = document.createElement('img');
        // ✅ Pointer Events None to allow click-through
        img.className = 'card-image w-full h-full object-cover pointer-events-none';
        img.src = imgObj.src;
        img.srcset = imgObj.srcset;
        img.sizes = '(max-width: 640px) 150px, (max-width: 1024px) 250px, 400px';
        img.alt = p.altText;
        img.loading = 'lazy';
        img.decoding = 'async';

        const badges = document.createElement('div');
        badges.className = 'absolute top-2 right-2 flex flex-col gap-1 items-end z-10 pointer-events-none';
        
        let statusClass = 'status-inquire';
        if (p.availability?.includes('ว่าง') || p.availability?.includes('รับงาน')) statusClass = 'status-available';
        else if (p.availability?.includes('ไม่ว่าง')) statusClass = 'status-busy';
        
        badges.innerHTML = `
            <span class="availability-badge ${statusClass}">${p.availability || 'สอบถาม'}</span>
            ${p.isfeatured ? '<span class="featured-badge"><i class="fas fa-star text-[0.7em] mr-1"></i>แนะนำ</span>' : ''}
        `;

        const overlay = document.createElement('div');
        overlay.className = 'card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 pointer-events-none';
        overlay.innerHTML = `
            <div class="card-info transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="text-xl font-bold text-white shadow-sm">${p.name}</h3>
                <p class="text-sm text-gray-200 mt-1 flex items-center">
                    <i class="fas fa-map-marker-alt mr-1.5"></i> 
                    ${state.provincesMap.get(p.provinceKey) || 'ไม่ระบุ'}
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
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).maybeSingle();
            if (error || !data) return null;
            return processProfileData(data);
        } catch { return null; }
    }

    // ✅ FIX: Lightbox Event Delegation Logic
    function initLightboxEvents() {
        document.body.addEventListener('click', (e) => {
            // 1. Check if clicked element is the card link or inside a profile card
            const link = e.target.closest('a.card-link');
            
            if (link && link.closest('.profile-card-new')) {
                e.preventDefault(); // ⛔ Stop Navigation
                
                const card = link.closest('.profile-card-new');
                const slug = card.getAttribute('data-profile-slug');
                
                if (slug) {
                    state.lastFocusedElement = card;
                    history.pushState(null, '', `/profile/${slug}`);
                    handleRouting();
                }
            }
        });

        const closeAction = () => {
            history.pushState(null, '', '/');
            handleRouting();
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

        if (animate) {
            gsap.to(dom.lightbox, { opacity: 0, pointerEvents: 'none', duration: 0.2 });
            gsap.to(dom.lightboxWrapper, { 
                scale: 0.95, opacity: 0, duration: 0.2, 
                onComplete: () => {
                    dom.lightbox.classList.add('hidden');
                    document.body.style.overflow = '';
                    state.lastFocusedElement?.focus();
                }
            });
        } else {
            dom.lightbox.classList.add('hidden');
            dom.lightbox.style.opacity = '0';
            document.body.style.overflow = '';
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
            line: get('lightboxLineLink'),
            lineText: get('lightboxLineLinkText')
        };

        // 1. Header & Quote
        if (els.name) els.name.textContent = p.name || 'ไม่ระบุชื่อ';
        if (els.quote) {
            els.quote.textContent = p.quote ? `"${p.quote}"` : '';
            els.quote.style.display = p.quote ? 'block' : 'none';
        }

        // 2. Images
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

        // 3. Tags
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

        // 4. Details Section (Clean Grid & List)
        if (els.details) {
            const provinceName = state.provincesMap.get(p.provinceKey) || '';
            
            els.details.innerHTML = `
                <!-- Stats Grid -->
                <div class="stats-grid-container">
                    <div class="stat-box">
                        <span class="stat-label">อายุ</span>
                        <span class="stat-value">${p.age || '-'}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">สัดส่วน</span>
                        <span class="stat-value">${p.stats || '-'}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">สูง/หนัก</span>
                        <span class="stat-value">${p.height || '-'}/${p.weight || '-'}</span>
                    </div>
                </div>

                <!-- Info List -->
                <div class="info-list-container">
                    <div class="info-row">
                        <div class="info-label"><i class="fas fa-palette info-icon"></i> สีผิว</div>
                        <div class="info-value">${p.skinTone || '-'}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label"><i class="fas fa-map-marker-alt info-icon"></i> พิกัด</div>
                        <div class="info-value text-primary">${provinceName} (${p.location || '-'})</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label"><i class="fas fa-tag info-icon"></i> เรทราคา</div>
                        <div class="info-value text-green-600">${p.rate || 'สอบถาม'}</div>
                    </div>
                </div>
            `;
        }

        // 5. Description
        if (els.desc) {
            // สร้าง Wrapper ใหม่เพื่อควบคุม CSS
            els.desc.parentElement.innerHTML = `
                <div class="description-box">
                    <div class="desc-header"><i class="fas fa-align-left"></i> รายละเอียดเพิ่มเติม</div>
                    <div class="desc-content">${p.description ? p.description.replace(/\n/g, '<br>') : '-'}</div>
                </div>
            `;
            // Reset Reference เพราะเราเขียนทับ parentElement
            // (ไม่ต้องทำอะไรเพิ่มเพราะ HTML ถูกเขียนลงไปแล้ว)
        }

        // 6. Sticky LINE Button
        const oldWrapper = document.getElementById('line-btn-sticky-wrapper');
        if (oldWrapper) oldWrapper.remove();

        if (p.lineId) {
            const wrapper = document.createElement('div');
            wrapper.id = 'line-btn-sticky-wrapper';
            wrapper.className = 'lb-sticky-footer'; // Class CSS ใหม่

            const link = document.createElement('a');
            link.className = 'btn-line-action'; // Class CSS ใหม่
            link.href = p.lineId.startsWith('http') ? p.lineId : `https://line.me/ti/p/${p.lineId}`;
            link.target = '_blank';
            link.innerHTML = `<i class="fab fa-line"></i> แอดไลน์ ${p.name}`;

            wrapper.appendChild(link);
            
            // หา Container หลักของ Lightbox (ขวามือ)
            const detailsCol = document.querySelector('.lightbox-details');
            if (detailsCol) {
                detailsCol.appendChild(wrapper); // แปะไว้ล่างสุดของคอลัมน์ขวา
            }
        }

        // 7. Status Badge
        if (els.avail) {
            els.avail.innerHTML = '';
            let sClass = 'status-inquire';
            let icon = '<i class="fas fa-question-circle"></i>';
            if (p.availability?.includes('ว่าง') || p.availability?.includes('รับงาน')) { sClass = 'status-available'; icon = '<i class="fas fa-check-circle"></i>'; }
            else if (p.availability?.includes('ไม่ว่าง')) { sClass = 'status-busy'; icon = '<i class="fas fa-times-circle"></i>'; }
            
            const badge = document.createElement('div');
            badge.className = `lb-status-badge ${sClass}`;
            badge.innerHTML = `${icon} ${p.availability || 'สอบถาม'}`;
            els.avail.appendChild(badge);
        }
    }
    // =================================================================
    // 10. SEO META TAGS UPDATER
    // =================================================================
    function updateAdvancedMeta(profile = null, pageData = null) {
        const oldScript = document.getElementById('schema-jsonld');
        if (oldScript) oldScript.remove();

        if (profile) {
            const title = `${profile.name} - ${state.provincesMap.get(profile.provinceKey)} | Sideline Chiangmai`;
            document.title = title;
            updateMeta('description', `ดูโปรไฟล์น้อง ${profile.name} อายุ ${profile.age} ${state.provincesMap.get(profile.provinceKey)} ${profile.quote || ''}`);
            updateLink('canonical', `${CONFIG.SITE_URL}/profile/${profile.slug}`);
            injectSchema(generatePersonSchema(profile));
        } else if (pageData) {
            document.title = pageData.title || 'Sideline Chiangmai | ไซด์ไลน์ เชียงใหม่';
            updateMeta('description', pageData.description);
            updateLink('canonical', pageData.canonicalUrl);
            injectSchema(generateListingSchema(pageData));
        } else {
            document.title = 'ไซด์ไลน์เชียงใหม่ | รับงาน Sideline ฟิวแฟน ตรงปก 100%';
            updateMeta('description', 'ศูนย์รวมน้องๆสาวๆ รับงานไซด์ไลน์ เด็กเอ็น ฟิวแฟน ตรงปก100% ที่เยอะที่สุด');
            updateLink('canonical', CONFIG.SITE_URL);
            injectSchema(generateListingSchema({ title: document.title, canonicalUrl: CONFIG.SITE_URL, profiles: state.allProfiles.slice(0, 20) }));
        }
    }

    function generatePersonSchema(p) {
        return {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": p.name,
            "url": `${CONFIG.SITE_URL}/profile/${p.slug}`,
            "image": p.images[0].src,
            "description": p.description,
            "jobTitle": "Sideline Model",
            "address": { "@type": "PostalAddress", "addressLocality": state.provincesMap.get(p.provinceKey) },
            "additionalProperty": [
                { "@type": "PropertyValue", "name": "Age", "value": p.age },
                { "@type": "PropertyValue", "name": "Height", "value": p.height },
                { "@type": "PropertyValue", "name": "Price", "value": p.rate }
            ]
        };
    }

    function generateListingSchema(data) {
        return {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": data.title,
            "url": data.canonicalUrl,
            "numberOfItems": data.profiles.length,
            "itemListElement": data.profiles.map((p, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "url": `${CONFIG.SITE_URL}/profile/${p.slug}`,
                "name": p.name
            }))
        };
    }

    function injectSchema(json) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'schema-jsonld';
        script.textContent = JSON.stringify(json);
        document.head.appendChild(script);
    }

    function updateMeta(name, content) {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
        el.content = content;
    }

    function updateLink(rel, href) {
        let el = document.querySelector(`link[rel="${rel}"]`);
        if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
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
        let rafId;
        document.body.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.profile-card-new');
            if (!card) return;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cX = rect.width / 2;
                const cY = rect.height / 2;
                const rX = ((y - cY) / cY) * -7;
                const rY = ((x - cX) / cX) * 7;
                card.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
        }, { passive: true });
        document.body.addEventListener('mouseout', (e) => {
             const card = e.target.closest('.profile-card-new');
             if(card) card.style.transform = '';
        }, { passive: true });
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

    function initAgeVerification() {
        const ts = localStorage.getItem(CONFIG.KEYS.AGE_CONFIRMED);
        if (ts && (Date.now() - parseInt(ts)) < 3600000) return;
        const div = document.createElement('div');
        div.id = 'age-verification-overlay';
        div.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4';
        div.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm text-center shadow-2xl animate-fade-in">
                <h2 class="text-2xl font-bold text-red-600 mb-2">20+ Only</h2>
                <p class="mb-6 text-gray-600 dark:text-gray-300">เว็บไซต์นี้มีเนื้อหาสำหรับผู้ใหญ่</p>
                <div class="flex gap-4 justify-center">
                    <button id="age-reject" class="px-4 py-2 bg-gray-200 rounded-lg">ออก</button>
                    <button id="age-confirm" class="px-4 py-2 bg-pink-600 text-white rounded-lg">ยืนยัน (20+)</button>
                </div>
            </div>`;
        document.body.appendChild(div);
        document.getElementById('age-confirm').onclick = () => { localStorage.setItem(CONFIG.KEYS.AGE_CONFIRMED, Date.now()); div.remove(); };
        document.getElementById('age-reject').onclick = () => window.location.href = 'https://google.com';
    }

    function ensureSuggestionContainer() {
        if (dom.searchSuggestions) return;
        const div = document.createElement('div');
        div.id = 'search-suggestions';
        div.className = 'absolute z-50 bg-white dark:bg-gray-800 shadow-xl rounded-lg w-full mt-1 hidden max-h-60 overflow-y-auto';
        dom.searchInput.parentElement.appendChild(div);
        dom.searchSuggestions = div;
        document.addEventListener('click', (e) => {
            if (!dom.searchInput.contains(e.target) && !div.contains(e.target)) div.style.display = 'none';
        });
    }

    function updateSuggestions() {
        if (!dom.searchSuggestions) return;
        const val = dom.searchInput.value.trim().toLowerCase();
        if (!val) { dom.searchSuggestions.style.display = 'none'; return; }
        const matches = new Set();
        state.allProfiles.forEach(p => {
             if (p.provinceKey?.includes(val)) matches.add(`province:${p.provinceKey}`);
             p.styleTags?.forEach(t => { if(t.toLowerCase().includes(val)) matches.add(`tag:${t}`); });
        });
        const list = Array.from(matches).slice(0, 5);
        if(!list.length) { dom.searchSuggestions.style.display = 'none'; return; }
        dom.searchSuggestions.innerHTML = list.map(t => `<div class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">${t}</div>`).join('');
        dom.searchSuggestions.style.display = 'block';
        Array.from(dom.searchSuggestions.children).forEach(el => {
            el.onclick = () => { dom.searchInput.value = el.textContent; dom.searchSuggestions.style.display = 'none'; applyFilters(true); };
        });
    }

    function updateActiveNavLinks() {
        const path = window.location.pathname;
        document.querySelectorAll('nav a').forEach(l => {
            l.classList.toggle('text-pink-600', l.getAttribute('href') === path);
        });
    }

    function showLoadingState() { if(dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'block'; }
    function hideLoadingState() { if(dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none'; }
    function showErrorState() { if(dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'block'; }

    // =================================================================
    // 12. ADMIN TOOLS (SITEMAP GENERATOR - INVISIBLE BUTTON VERSION)
    // =================================================================
    function initMobileSitemapTrigger() {
        // 1. สร้างปุ่มล่องหน (Invisible Button)
        const ghostBtn = document.createElement('div');
        
        Object.assign(ghostBtn.style, {
            position: 'fixed',
            bottom: '0',
            right: '0',
            width: '60px',        // ขนาดกว้างพอให้นิ้วจิ้มโดน
            height: '60px',       // ขนาดสูงพอ
            zIndex: '99999',      // อยู่บนสุดทับทุกอย่าง
            cursor: 'pointer',
            background: 'transparent', // โปร่งใส
            touchAction: 'manipulation' // ป้องกันการซูม
        });

        document.body.appendChild(ghostBtn);

        // 2. Logic การกดรัวๆ
        let clicks = 0;
        let timeout;

        ghostBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clicks++;
            
            // ถ้าหยุดกดเกิน 1.5 วินาที ให้เริ่มนับใหม่
            clearTimeout(timeout);
            timeout = setTimeout(() => { clicks = 0; }, 1500);

            // ครบ 5 ครั้ง ทำงานทันที
            if (clicks >= 5) {
                // สั่นเตือน (Android)
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                
                const confirmGen = confirm("⚙️ Admin Menu:\nต้องการโหลด sitemap.xml ใช่ไหม?");
                if (confirmGen) {
                    const xml = generateSitemapXML();
                    downloadFile('sitemap.xml', xml);
                }
                clicks = 0;
            }
        });
    }

    function generateSitemapXML() {
        const baseUrl = CONFIG.SITE_URL;
        const urls = [baseUrl];
        
        state.allProfiles.forEach(p => {
            if(p.slug) urls.push(`${baseUrl}/profile/${p.slug}`);
        });
        
        Array.from(state.provincesMap.keys()).forEach(k => {
            if(k) urls.push(`${baseUrl}/province/${k}`);
        });
        
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url === baseUrl ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

})();