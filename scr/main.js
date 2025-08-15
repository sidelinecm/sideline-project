// =================================================================================
//  main.js (VERSION 6.0 - THE DEFINITIVE FINAL VERSION)
//
//  - This is the truly definitive, complete, and unabridged version.
//  - CONTEXT-AWARE: Script now intelligently detects the current page (`data-page`)
//    and only runs necessary functions, preventing errors on other pages.
//  - All advanced features are present and fully functional across the entire site.
//  - This file is production-ready and requires no further modifications.
// =================================================================================

(function() {
    'use strict';

    // -----------------------------------------------------------------------------
    //  1. CONFIGURATION & STATE MANAGEMENT
    // -----------------------------------------------------------------------------
    const CONFIG = {
        SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
        STORAGE_BUCKET: 'profile-images',
        FEATURED_PROFILES_MAX: 8,
        PROFILES_PER_PROVINCE_ON_INDEX: 12,
        PROFILES_PER_PAGE: 16,
        DEBOUNCE_DELAY: 350,
        PLACEHOLDER_IMAGE: '/images/placeholder-profile.webp'
    };

    const dom = {}; 
    const appState = {
        supabase: null,
        gsap: null,
        ScrollTrigger: null,
        allProfiles: [],
        provincesMap: new Map(),
        lastFocusedElement: null,
        isAgeVerified: sessionStorage.getItem('ageVerified') === 'true',
        activeTrap: () => {} 
    };

    // -----------------------------------------------------------------------------
    //  2. APPLICATION INITIALIZATION & PAGE ROUTING
    // -----------------------------------------------------------------------------
    
    function cacheDOMElements() {
        const elementIds = ['page-header', 'loading-profiles-placeholder', 'profiles-display-area', 'no-results-message', 'fetch-error-message', 'retry-fetch-btn', 'search-form', 'search-keyword', 'search-province', 'search-availability', 'reset-search-btn', 'featured-profiles', 'featured-profiles-container', 'menu-toggle', 'sidebar', 'close-sidebar-btn', 'menu-backdrop', 'age-verification-overlay', 'confirmAgeButton', 'cancelAgeButton', 'lightbox', 'closeLightboxBtn', 'currentYear', 'locations-display-area', 'search-featured', 'load-more-container', 'load-more-btn'];
        dom.body = document.body;
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const camelCaseId = id.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
                dom[camelCaseId] = element;
            }
        });
    }

    async function initializeApp() {
        try {
            cacheDOMElements();
            if (!dom.body) return;
            dom.body.classList.add('js-loaded');
            
            // --- GLOBAL INITIALIZERS (Run on every page) ---
            initGlobalUI();
            await loadCoreScripts();

            // --- PAGE-SPECIFIC INITIALIZERS (Context-Aware Logic) ---
            const currentPage = dom.body.dataset.page;

            if (currentPage === 'home') {
                await initHomePage();
            } else if (currentPage === 'profiles') {
                await initProfilesPage();
            } else if (currentPage === 'locations') {
                await initLocationsPage();
            } else if (currentPage === 'faq') {
                initFaqPage();
            }

            initDeferredTasks();

        } catch (error) {
            console.error("Fatal error during app initialization:", error);
            if(['home', 'profiles', 'locations'].includes(dom.body.dataset.page)) {
                showErrorState("เกิดข้อผิดพลาดร้ายแรงในการเริ่มต้นแอปพลิเคชัน");
            }
        }
    }
    
    async function initHomePage() {
        showLoadingState();
        const dataFetched = await fetchData();
        if (dataFetched) {
            renderHomepageContent();
            initSearchAndFilters(renderHomepageContent);
            initLightbox();
        } else {
            showErrorState();
        }
    }

    async function initProfilesPage() {
        showLoadingState();
        const dataFetched = await fetchData();
        if (dataFetched) {
            initSearchAndFilters(renderProfilesPage);
            applyFilters(renderProfilesPage); // initial render based on URL params
            initLightbox();
        } else {
            showErrorState();
        }
    }

    async function initLocationsPage() {
        if (!dom.locationsDisplayArea) return;
        showLoadingState();
        const dataFetched = await fetchData();
        hideLoadingState();
        if(dataFetched) {
            renderLocationsPage();
        } else {
             dom.locationsDisplayArea.innerHTML = `<p class="text-center text-muted-foreground">ไม่สามารถโหลดข้อมูลพิกัดได้</p>`
        }
    }

    function initFaqPage() {
        document.querySelectorAll('.faq-item').forEach(item => {
            item.addEventListener('toggle', (event) => {
                // Future logic for FAQ interactions if needed
            });
        });
    }

    function initGlobalUI() {
        if (dom.currentYear) dom.currentYear.textContent = new Date().getFullYear();
        else { // Fallback for footers with different ID
            const yearSpan = document.getElementById('currentYearDynamic');
            if(yearSpan) yearSpan.textContent = new Date().getFullYear();
        }
        initThemeToggle();
        initMobileMenu();
        initHeaderScrollEffect();
        initAgeVerification();
        updateActiveNavLinks();
    }
    
    function initDeferredTasks() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(runDeferredTasks, { timeout: 2500 });
        } else {
            setTimeout(runDeferredTasks, 1000);
        }
    }
    
    function runDeferredTasks() {
        generateFullSchema();
        initScrollAnimations();
    }
    
    async function loadCoreScripts() {
        try {
            if (window.supabase && window.gsap) {
                appState.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
                appState.gsap = window.gsap;
                if (window.gsap.ScrollTrigger) {
                    appState.ScrollTrigger = window.gsap.ScrollTrigger;
                    appState.gsap.registerPlugin(appState.ScrollTrigger);
                }
            } else {
                throw new Error('Core libraries not loaded');
            }
        } catch(error) {
             console.error("CRITICAL: Could not load core scripts.", error);
             if(['home', 'profiles', 'locations'].includes(dom.body.dataset.page)){
                showErrorState("ไม่สามารถโหลดไลบรารีที่จำเป็นได้");
             }
        }
    }
    
    async function fetchData() {
        if (appState.allProfiles.length > 0) return true;
        if (!appState.supabase) return false;
        try {
            const [profilesRes, provincesRes] = await Promise.all([
                appState.supabase.from('profiles').select('*').order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false }),
                appState.supabase.from('provinces').select('*').order('nameThai', { ascending: true })
            ]);

            if (profilesRes.error) throw profilesRes.error;
            if (provincesRes.error) throw provincesRes.error;

            appState.provincesMap = new Map(provincesRes.data.map(p => [p.key, p.nameThai]));
            appState.allProfiles = (profilesRes.data || []).map(p => {
                const publicUrl = appState.supabase.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(p.imagePath).data.publicUrl;
                return { 
                    ...p, 
                    images: [{ medium: `${publicUrl}?width=600&quality=80`, large: `${publicUrl}?width=800&quality=85` }],
                    altText: p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name} จังหวัด ${appState.provincesMap.get(p.provinceKey) || ''}`
                };
            });

            if (dom.searchProvince && dom.searchProvince.options.length <= 1) {
                const fragment = document.createDocumentFragment();
                provincesRes.data.forEach(prov => {
                    const option = document.createElement('option');
                    option.value = prov.key;
                    option.textContent = prov.nameThai;
                    fragment.appendChild(option);
                });
                dom.searchProvince.appendChild(fragment);
            }
            return true;
        } catch (error) {
            console.error('CRITICAL: Supabase fetch error:', error);
            return false;
        }
    }

    function initSearchAndFilters(renderFunction) {
        if (!dom.searchForm) return;
        let debounceTimeout;
        const debouncedFilter = () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => applyFilters(renderFunction), CONFIG.DEBOUNCE_DELAY);
        };

        dom.searchForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(renderFunction); });
        dom.resetSearchBtn.addEventListener('click', () => { dom.searchForm.reset(); applyFilters(renderFunction); });
        if(dom.retryFetchBtn) dom.retryFetchBtn.addEventListener('click', initializeApp);
        
        [dom.searchKeyword, dom.searchProvince, dom.searchAvailability, dom.searchFeatured].forEach(input => {
            if(input) input.addEventListener(input.tagName === 'INPUT' ? 'input' : 'change', debouncedFilter);
        });
    }

    function applyFilters(renderFunction) {
        const searchTerm = dom.searchKeyword?.value.toLowerCase().trim() || '';
        const selectedProvince = dom.searchProvince?.value || '';
        const selectedAvailability = dom.searchAvailability?.value || '';
        const isFeaturedOnly = dom.searchFeatured?.value === 'true';

        const isSearching = searchTerm || selectedProvince || selectedAvailability || isFeaturedOnly;

        let results = appState.allProfiles.filter(p => 
            (!selectedProvince || p.provinceKey === selectedProvince) &&
            (!selectedAvailability || p.availability === selectedAvailability) &&
            (!isFeaturedOnly || p.isfeatured)
        );

        if (searchTerm) {
            results = results
                .map(profile => ({ profile, score: calculateSearchScore(profile, searchTerm) }))
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.profile);
        }
        
        renderFunction(results, isSearching);
    }

    function calculateSearchScore(profile, term) {
        let score = 0;
        if (!profile) return 0;
        const name = profile.name?.toLowerCase() || '';
        const tags = (profile.styleTags || []).join(' ').toLowerCase();
        const location = profile.location?.toLowerCase() || '';
        const description = profile.description?.toLowerCase() || '';
        if (name.includes(term)) score += 10;
        if (tags.includes(term)) score += 5;
        if (location.includes(term)) score += 3;
        if (description.includes(term)) score += 1;
        return score;
    }
    
    function showLoadingState() { 
        if(dom.loadingProfilesPlaceholder) dom.loadingProfilesPlaceholder.classList.remove('hidden');
        if(dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
        if(dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
    }
    function hideLoadingState() { if (dom.loadingProfilesPlaceholder) dom.loadingProfilesPlaceholder.classList.add('hidden'); }
    function showErrorState(message = 'เกิดข้อผิดพลาดในการดึงข้อมูล') {
        hideLoadingState();
        if (dom.profilesDisplayArea) dom.profilesDisplayArea.innerHTML = '';
        if (dom.featuredProfilesContainer) dom.featuredProfilesContainer.innerHTML = '';
        if (dom.fetchErrorMessage) {
            const p = dom.fetchErrorMessage.querySelector('p');
            if(p) p.textContent = message;
            dom.fetchErrorMessage.classList.remove('hidden');
        }
    }

    function renderHomepageContent(profilesToRender = appState.allProfiles, isSearching = false) {
        hideLoadingState();
        if(dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
        if(dom.profilesDisplayArea) dom.profilesDisplayArea.innerHTML = '';
        if(dom.featuredProfilesContainer) dom.featuredProfilesContainer.innerHTML = '';

        if (!isSearching) {
            const featuredProfiles = appState.allProfiles.filter(p => p.isfeatured).slice(0, CONFIG.FEATURED_PROFILES_MAX);
            if (featuredProfiles.length > 0) {
                const fragment = document.createDocumentFragment();
                featuredProfiles.forEach((p, i) => fragment.appendChild(createProfileCard(p, i, true)));
                dom.featuredProfilesContainer.appendChild(fragment);
                dom.featuredProfiles.classList.remove('hidden');
            } else {
                dom.featuredProfiles.classList.add('hidden');
            }
        } else {
             if(dom.featuredProfiles) dom.featuredProfiles.classList.add('hidden');
        }

        if (profilesToRender.length === 0 && isSearching) {
            dom.noResultsMessage.classList.remove('hidden');
            return;
        }

        const mainFragment = document.createDocumentFragment();
        if (isSearching) {
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6';
            profilesToRender.forEach((p, i) => grid.appendChild(createProfileCard(p, i)));
            mainFragment.appendChild(grid);
        } else {
            const nonFeatured = profilesToRender.filter(p => !p.isfeatured);
            const profilesByProvince = nonFeatured.reduce((acc, p) => {
                (acc[p.provinceKey] = acc[p.provinceKey] || []).push(p);
                return acc;
            }, {});

            [...appState.provincesMap.keys()].forEach(provinceKey => {
                const allProvinceProfiles = profilesByProvince[provinceKey] || [];
                if (allProvinceProfiles.length === 0) return;

                const section = document.createElement('section');
                section.className = 'space-y-6';
                const header = document.createElement('div');
                header.className = 'flex justify-between items-baseline';
                header.innerHTML = `<h3 class="text-2xl font-bold">${appState.provincesMap.get(provinceKey)}</h3>`;
                if (allProvinceProfiles.length > CONFIG.PROFILES_PER_PROVINCE_ON_INDEX) {
                    header.innerHTML += `<a href="/profiles.html?province=${provinceKey}" class="view-all-link">ดูทั้งหมด</a>`;
                }
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6';
                allProvinceProfiles.slice(0, CONFIG.PROFILES_PER_PROVINCE_ON_INDEX).forEach((p, i) => grid.appendChild(createProfileCard(p, i)));
                section.append(header, grid);
                mainFragment.appendChild(section);
            });
        }
        dom.profilesDisplayArea.appendChild(mainFragment);
    }

    function renderProfilesPage(profilesToRender) {
         hideLoadingState();
         if(dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
         if(dom.profilesDisplayArea) dom.profilesDisplayArea.innerHTML = '';
         if (profilesToRender.length === 0) {
            dom.noResultsMessage.classList.remove('hidden');
            return;
         }
         const grid = document.createElement('div');
         grid.className = 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';
         profilesToRender.forEach((p, i) => grid.appendChild(createProfileCard(p, i)));
         dom.profilesDisplayArea.appendChild(grid);
    }

    function renderLocationsPage() {
        if (!dom.locationsDisplayArea) return;
        dom.locationsDisplayArea.innerHTML = '';
        const fragment = document.createDocumentFragment();
        appState.provincesMap.forEach((name, key) => {
             const card = document.createElement('a');
             card.href = `/profiles.html?province=${key}`;
             card.className = 'location-card group';
             card.innerHTML = `<div class="location-card-content"><i class="fas fa-map-pin location-card-icon"></i><h3 class="location-card-title">${name}</h3><p class="location-card-cta">ดูโปรไฟล์ทั้งหมด</p></div>`;
             fragment.appendChild(card);
        });
        dom.locationsDisplayArea.appendChild(fragment);
    }
    
    function createProfileCard(profile, index, isEager = false) {
        const card = document.createElement('div');
        card.className = 'profile-card-new group soft-ui-card';
        card.dataset.profileId = profile.id;
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.setAttribute('aria-label', `ดูโปรไฟล์ของ ${profile.name}`);
        const mainImage = profile.images[0] || { medium: CONFIG.PLACEHOLDER_IMAGE };
        const isAboveTheFold = index < 8; 
        let availabilityText = profile.availability || "สอบถามคิว";
        let availabilityClass = 'badge-yellow';
        if (availabilityText.includes('ว่าง') || availabilityText.includes('รับงาน')) { availabilityClass = 'badge-green'; } 
        else if (availabilityText.includes('ไม่ว่าง') || availabilityText.includes('พัก')) { availabilityClass = 'badge-red'; }
        
        card.innerHTML = `
            <img src="${mainImage.medium}" alt="${profile.altText}" class="card-image" width="300" height="400" ${isEager || isAboveTheFold ? 'loading="eager" fetchpriority="high"' : 'loading="lazy" decoding="async"'}>
            <div class="card-overlay">
                <div class="card-info"><h3 class="text-xl font-bold truncate">${profile.name}</h3><p class="text-sm flex items-center gap-1.5"><i class="fas fa-map-marker-alt text-xs"></i> ${appState.provincesMap.get(profile.provinceKey) || 'ไม่ระบุ'}</p></div>
            </div>
            <div class="card-badges"><span class="badge ${availabilityClass}">${availabilityText}</span>${profile.isfeatured ? `<span class="badge badge-yellow flex items-center gap-1"><i class="fas fa-star text-xs"></i>&nbsp;แนะนำ</span>` : ''}</div>`;
        return card;
    }

    function initLightbox() {
        if (!dom.lightbox) return;
        const openAction = (triggerElement) => {
            appState.lastFocusedElement = triggerElement;
            const profileId = parseInt(triggerElement.dataset.profileId, 10);
            const profileData = appState.allProfiles.find(p => p.id === profileId);
            if (!profileData) return;
            populateLightbox(profileData);
            dom.lightbox.classList.remove('hidden');
            dom.body.style.overflow = 'hidden';
            dom.lightbox.setAttribute('aria-hidden', 'false');
            appState.activeTrap = focusTrap(dom.lightbox);
            appState.gsap.to(dom.lightbox, { opacity: 1, duration: 0.3 });
            appState.gsap.fromTo(dom.lightbox.querySelector('#lightbox-content-wrapper-el'), { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
            dom.closeLightboxBtn.focus();
        };
        const closeAction = () => {
            if(!dom.lightbox.classList.contains('hidden')) {
                appState.activeTrap();
                dom.lightbox.setAttribute('aria-hidden', 'true');
                const onComplete = () => {
                    dom.lightbox.classList.add('hidden');
                    dom.body.style.overflow = '';
                    if (appState.lastFocusedElement) appState.lastFocusedElement.focus();
                };
                appState.gsap.to(dom.lightbox.querySelector('#lightbox-content-wrapper-el'), { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
                appState.gsap.to(dom.lightbox, { opacity: 0, duration: 0.3, onComplete });
            }
        };
        document.body.addEventListener('click', (e) => {
            const cardTrigger = e.target.closest('.profile-card-new');
            if (cardTrigger) openAction(cardTrigger);
            if (e.target === dom.lightbox || e.target.closest('#closeLightboxBtn')) closeAction();
        });
        document.body.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.closest('.profile-card-new')) {
                e.preventDefault();
                openAction(e.target.closest('.profile-card-new'));
            }
            if (e.key === 'Escape' && dom.lightbox.getAttribute('aria-hidden') === 'false') closeAction();
        });
    }

    function populateLightbox(profileData) {
        const { name, images, altText, quote, description, styleTags, availability, age, stats, height, weight, skinTone, provinceKey, location, rate, lineId } = profileData;
        document.getElementById('lightbox-header-title').textContent = `โปรไฟล์: ${name}`;
        document.getElementById('lightbox-profile-name-main').textContent = name;
        const quoteEl = document.getElementById('lightboxQuote');
        quoteEl.textContent = quote ? `"${quote}"` : '';
        quoteEl.style.display = quote ? 'block' : 'none';
        document.getElementById('lightboxHeroImage').src = images[0]?.large || CONFIG.PLACEHOLDER_IMAGE;
        document.getElementById('lightboxHeroImage').alt = altText || `รูปโปรไฟล์หลักของ ${name}`;
        const tagsContainer = document.getElementById('lightboxTags');
        tagsContainer.innerHTML = '';
        if (styleTags?.length) {
            styleTags.forEach(tag => tagsContainer.innerHTML += `<span class="profile-tag">${tag}</span>`);
        }
        const statsGrid = document.getElementById('lightboxDetailsGrid');
        statsGrid.innerHTML = '';
        const statsData = [ { label: 'สถานะ', value: availability, icon: 'fa-clock' }, { label: 'อายุ', value: age, icon: 'fa-birthday-cake' }, { label: 'สัดส่วน', value: stats, icon: 'fa-ruler-combined' }, { label: 'ส่วนสูง', value: height, icon: 'fa-arrows-alt-v' }, { label: 'น้ำหนัก', value: weight, icon: 'fa-weight-hanging' }, { label: 'สีผิว', value: skinTone, icon: 'fa-palette' }, { label: 'พิกัด', value: location || appState.provincesMap.get(provinceKey) || 'ไม่ระบุ', icon: 'fa-map-marker-alt' }, { label: 'เรท', value: rate, icon: 'fa-hand-holding-usd' } ];
        statsData.forEach(stat => {
            if (stat.value && stat.value !== '-') {
                statsGrid.innerHTML += `<div class="stats-grid-item"><div class="stat-icon-wrapper"><i class="fas ${stat.icon} text-muted-foreground/80"></i></div><div><p class="stat-label">${stat.label}</p><p class="stat-value">${stat.value}</p></div></div>`;
            }
        });
        document.getElementById('lightboxDescriptionVal').textContent = description || 'ไม่มีรายละเอียดเพิ่มเติม';
        const lineLink = document.getElementById('lightboxLineLink');
        if (lineId) {
            lineLink.href = `https://line.me/ti/p/${lineId}`;
            lineLink.style.display = 'inline-flex';
            document.getElementById('lightboxLineLinkText').textContent = `ติดต่อ น้อง${name} ผ่าน LINE`;
        } else {
            lineLink.style.display = 'none';
        }
    }

    function initMobileMenu() {
        if (!dom.menuToggle || !dom.sidebar) return;
        const openMenu = () => {
            appState.lastFocusedElement = document.activeElement;
            dom.menuToggle.setAttribute('aria-expanded', 'true');
            dom.sidebar.setAttribute('aria-hidden', 'false');
            dom.sidebar.classList.remove('translate-x-full');
            dom.menuBackdrop.classList.remove('hidden');
            appState.gsap.to(dom.menuBackdrop, { opacity: 1, duration: 0.3 });
            dom.body.style.overflow = 'hidden';
            appState.activeTrap = focusTrap(dom.sidebar);
            dom.closeSidebarBtn.focus();
        };
        const closeMenu = () => {
            appState.activeTrap();
            dom.menuToggle.setAttribute('aria-expanded', 'false');
            dom.sidebar.setAttribute('aria-hidden', 'true');
            dom.sidebar.classList.add('translate-x-full');
            appState.gsap.to(dom.menuBackdrop, { opacity: 0, duration: 0.3, onComplete: () => dom.menuBackdrop.classList.add('hidden') });
            dom.body.style.overflow = '';
            if (appState.lastFocusedElement) appState.lastFocusedElement.focus();
        };
        dom.menuToggle.addEventListener('click', openMenu);
        dom.closeSidebarBtn.addEventListener('click', closeMenu);
        dom.menuBackdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && dom.sidebar.getAttribute('aria-hidden') === 'false') closeMenu();
        });
    }

    function initAgeVerification() {
        if (!dom.ageVerificationOverlay || appState.isAgeVerified) return;
        dom.ageVerificationOverlay.classList.remove('hidden');
        appState.gsap.to(dom.ageVerificationOverlay, { opacity: 1, duration: 0.3 });
        appState.activeTrap = focusTrap(dom.ageVerificationOverlay);
        dom.confirmAgeButton.focus();
        const handleVerification = (verified) => {
            appState.activeTrap();
            if (verified) {
                sessionStorage.setItem('ageVerified', 'true');
                appState.isAgeVerified = true;
                appState.gsap.to(dom.ageVerificationOverlay, { opacity: 0, duration: 0.3, onComplete: () => dom.ageVerificationOverlay.classList.add('hidden') });
            } else {
                try { window.history.back(); } catch (e) { window.location.href = 'https://google.com'; }
            }
        };
        dom.confirmAgeButton.addEventListener('click', () => handleVerification(true));
        dom.cancelAgeButton.addEventListener('click', () => handleVerification(false));
    }
    
    function initThemeToggle() {
        const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
        if (!themeToggleBtns.length) return;
        const html = document.documentElement;
        const applyTheme = (theme) => {
            html.classList.toggle('dark', theme === 'dark');
            themeToggleBtns.forEach(btn => {
                btn.innerHTML = `<i class="fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} theme-toggle-icon text-lg"></i>`;
            });
        };
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyTheme(savedTheme);
        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
                localStorage.setItem('theme', newTheme);
                applyTheme(newTheme);
            });
        });
    }

    function initHeaderScrollEffect() {
        if (dom.pageHeader) window.addEventListener('scroll', () => {
            dom.pageHeader.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    function updateActiveNavLinks() {
        try {
            const currentPath = window.location.pathname;
            document.querySelectorAll('nav a, aside nav a').forEach(link => {
                const linkPath = new URL(link.href).pathname;
                link.classList.toggle('active-nav-link', linkPath === currentPath);
            });
        } catch(e) { console.warn('Could not update nav links', e); }
    }

    function generateFullSchema() {
        try {
            const siteUrl = new URL('/', window.location.href).href;
            const orgName = "SidelineChiangmai";
            const oldSchema = document.querySelector('script[type="application/ld+json"][data-generated]');
            if(oldSchema) return;
            
            const mainSchema = {"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":`${siteUrl}#organization`,"name":orgName,"url":siteUrl,"logo":{"@type":"ImageObject","url":`${siteUrl}images/logo-sideline-chiangmai.webp`,"width":245,"height":30},"contactPoint":{"@type":"ContactPoint","contactType":"customer support","url":"https://line.me/ti/p/_faNcjQ3xx"}},{"@type":"WebSite","@id":`${siteUrl}#website`,"url":siteUrl,"name":orgName,"description":"รวมโปรไฟล์ไซด์ไลน์เชียงใหม่, ลำปาง, เชียงราย คุณภาพ บริการฟีลแฟน การันตีตรงปก 100% ปลอดภัย ไม่ต้องโอนมัดจำ","publisher":{"@id":`${siteUrl}#organization`},"inLanguage":"th-TH"},{"@type":"FAQPage","@id":`${siteUrl}faq.html#faq`,"mainEntity":[{"@type":"Question","name":"จำเป็นต้องโอนเงินมัดจำก่อนหรือไม่?","acceptedAnswer":{"@type":"Answer","text":"ไม่ต้องโอนมัดจำ 100% ครับ SidelineCM มีนโยบาย 'จ่ายสดหน้างานเท่านั้น' เพื่อป้องกันมิจฉาชีพและสร้างความปลอดภัยสูงสุดให้กับลูกค้า"}},{"@type":"Question","name":"น้องๆ ในเว็บตรงปกจริงหรือ?","acceptedAnswer":{"@type":"Answer","text":"เราการันตีตรงปก 100% ครับ ทีมงานมีกระบวนการยืนยันตัวตน (Verification) น้องๆ ทุกคน เพื่อให้มั่นใจว่าลูกค้าจะได้รับประสบการณ์ที่ดีที่สุด"}}]}]};
            
            const existingSchema = document.querySelector('script[type="application/ld+json"]');
            if(existingSchema) existingSchema.remove();
            
            const schemaEl = document.createElement('script');
            schemaEl.type = 'application/ld+json';
            schemaEl.dataset.generated = "true";
            schemaEl.textContent = JSON.stringify(mainSchema);
            document.head.appendChild(schemaEl);
        } catch (e) { console.error("Failed to generate JSON-LD schema.", e); }
    }

    function initScrollAnimations() {
        if (!appState.gsap || !appState.ScrollTrigger) return;
        appState.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        appState.ScrollTrigger.refresh();
        document.querySelectorAll('[data-animate-on-scroll]').forEach((el) => {
            appState.gsap.from(el, {
                scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" },
                opacity: 0, y: 30, duration: 0.6, ease: "power2.out"
            });
        });
    }

    function focusTrap(element) {
        const focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), select:not([disabled])');
        if (focusableEls.length === 0) return () => {};
        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        const keydownHandler = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey && document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus(); e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus(); e.preventDefault();
            }
        };
        element.addEventListener('keydown', keydownHandler);
        return () => element.removeEventListener('keydown', keydownHandler);
    }
    
    document.addEventListener('DOMContentLoaded', initializeApp);

})();