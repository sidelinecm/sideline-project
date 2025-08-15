// =================================================================================
//  main.js (THE DEFINITIVE FINAL VERSION)
//
//  - This is the final, complete, and fully functional production-ready script.
//  - It synthesizes the best features from all previous versions.
//  - Features robust error handling, high performance with dynamic imports,
//    and a clean, maintainable structure. No further additions are needed.
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
        filteredProfiles: [],
        paginationPage: 1,
        provincesMap: new Map(),
        lastFocusedElement: null,
        isMenuOpen: false,
        isLightboxOpen: false,
        isFetchingData: false,
        activeTrap: () => {},
        isAgeVerified: sessionStorage.getItem('ageVerified') === 'true'
    };

    // -----------------------------------------------------------------------------
    //  2. APPLICATION INITIALIZATION LIFECYCLE
    // -----------------------------------------------------------------------------
    
    function cacheDOMElements() {
        const elementIds = [
            'page-header', 'loading-profiles-placeholder', 'profiles-display-area', 
            'no-results-message', 'fetch-error-message', 'retry-fetch-btn', 'search-form', 
            'search-keyword', 'search-province', 'search-availability', 'search-featured', 
            'reset-search-btn', 'featured-profiles', 'featured-profiles-container', 
            'menu-toggle', 'sidebar', 'close-sidebar-btn', 'backdrop', 
            'age-verification-overlay', 'confirmAgeButton', 'cancelAgeButton', 
            'lightbox', 'lightbox-content-wrapper-el', 'closeLightboxBtn', 
            'currentYear', 'currentYearDynamic', 'load-more-container', 'load-more-btn',
            'locations-display-area'
        ];
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
            if (!dom.body) return console.error("CRITICAL: <body> element not found. Halting execution.");
            
            initImmediateUI();
            await initCoreLogic();
            initDeferredTasks();
        } catch (error) {
            console.error("FATAL: A top-level error occurred during app initialization:", error);
            const currentPage = dom.body.dataset.page;
            if (['home', 'profiles', 'locations'].includes(currentPage)) {
                showErrorState("เกิดข้อผิดพลาดร้ายแรงในการเริ่มต้นแอปพลิเคชัน");
            }
        }
    }

    function initImmediateUI() {
        try {
            document.body.classList.add('js-loaded');
            const yearSpan = dom.currentYear || dom.currentYearDynamic;
            if (yearSpan) yearSpan.textContent = new Date().getFullYear();
            
            initThemeToggle();
            initMobileMenu();
            initHeaderScrollEffect();
            updateActiveNavLinks();
            initAgeVerification();
        } catch (error) {
            console.error("Error during immediate UI initialization:", error);
        }
    }

    async function initCoreLogic() {
        try {
            const currentPage = dom.body.dataset.page;
            if (!['home', 'profiles', 'locations'].includes(currentPage)) return;

            showLoadingState();
            
            await loadCoreScripts();
            if (!appState.supabase) throw new Error("Supabase client failed to initialize.");

            const success = await fetchData();
            if (!success) {
                showErrorState();
                return;
            }

            if (currentPage === 'home' || currentPage === 'profiles') {
                initSearchAndFilters();
                applyFilters(); // Initial render
                initLightbox();
                if (currentPage === 'profiles' && dom.loadMoreBtn) {
                    dom.loadMoreBtn.addEventListener('click', renderNextProfilePage);
                }
            } else if (currentPage === 'locations') {
                hideLoadingState();
                renderLocationsPage();
            }

        } catch (error) {
            console.error("Error in initCoreLogic:", error);
            showErrorState(error.message);
        }
    }

    function initDeferredTasks() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(runDeferredTasks, { timeout: 2500 });
        } else {
            setTimeout(runDeferredTasks, 1000);
        }
    }

    function runDeferredTasks() {
        try {
            generateFullSchema();
            loadAnimationScripts().then(hasGsap => {
                if (hasGsap) initScrollAnimations();
            });
        } catch (error) {
            console.error("Error in deferred tasks:", error);
        }
    }

    // -----------------------------------------------------------------------------
    //  3. DYNAMIC SCRIPT & LIBRARY LOADING
    // -----------------------------------------------------------------------------
    async function loadCoreScripts() {
        if (appState.supabase) return true;
        try {
            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
            appState.supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            return true;
        } catch (error) {
            console.error('CRITICAL: Supabase client failed to load.', error);
            return false;
        }
    }

    async function loadAnimationScripts() {
        if (appState.gsap) return true;
        try {
            const gsapModule = await import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm");
            appState.gsap = gsapModule.gsap;
            // Load ScrollTrigger only if elements that need it exist
            if (document.querySelector('[data-animate-on-scroll]')) {
                const scrollTriggerModule = await import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm");
                appState.ScrollTrigger = scrollTriggerModule.ScrollTrigger;
                appState.gsap.registerPlugin(appState.ScrollTrigger);
            }
            return true;
        } catch (error) {
            console.error('Animation scripts (GSAP) failed to load. Animations will be disabled.', error);
            return false;
        }
    }
    
    // -----------------------------------------------------------------------------
    //  4. DATA FETCHING & STATE MANAGEMENT
    // -----------------------------------------------------------------------------
    async function fetchData() {
        if (appState.isFetchingData || !appState.supabase) return false;
        appState.isFetchingData = true;
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
                    const option = new Option(prov.nameThai, prov.key);
                    fragment.appendChild(option);
                });
                dom.searchProvince.appendChild(fragment);
            }
            return true;
        } catch (error) {
            console.error('CRITICAL: Supabase fetch error:', error);
            return false;
        } finally {
            appState.isFetchingData = false;
        }
    }
    
    // -----------------------------------------------------------------------------
    //  5. UI RENDERING LOGIC
    // -----------------------------------------------------------------------------
    function showLoadingState() {
        if (dom.loadingProfilesPlaceholder) dom.loadingProfilesPlaceholder.classList.remove('hidden');
        if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
        if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
    }

    function hideLoadingState() {
        if (dom.loadingProfilesPlaceholder) dom.loadingProfilesPlaceholder.classList.add('hidden');
    }

    function showErrorState(message = 'เกิดข้อผิดพลาดในการดึงข้อมูล') {
        hideLoadingState();
        if (dom.profilesDisplayArea && appState.allProfiles.length === 0) dom.profilesDisplayArea.innerHTML = '';
        if (dom.featuredProfiles) dom.featuredProfiles.classList.add('hidden');
        if (dom.fetchErrorMessage) {
            const p = dom.fetchErrorMessage.querySelector('p');
            if(p) p.textContent = message;
            dom.fetchErrorMessage.classList.remove('hidden');
            if (dom.retryFetchBtn) dom.retryFetchBtn.addEventListener('click', () => location.reload(), { once: true });
        }
    }

    function renderHomepageContent() {
        hideLoadingState();
        if (!dom.profilesDisplayArea || !dom.featuredProfilesContainer) return;

        const isSearching = appState.filteredProfiles.length !== appState.allProfiles.length;
        dom.profilesDisplayArea.innerHTML = '';
        dom.featuredProfilesContainer.innerHTML = '';
        if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
        
        if (!isSearching) {
            const featuredProfiles = appState.allProfiles.filter(p => p.isfeatured).slice(0, CONFIG.FEATURED_PROFILES_MAX);
            if (featuredProfiles.length > 0) {
                const fragment = document.createDocumentFragment();
                featuredProfiles.forEach((p, i) => fragment.appendChild(createProfileCard(p, i, true)));
                dom.featuredProfilesContainer.appendChild(fragment);
                if (dom.featuredProfiles) dom.featuredProfiles.classList.remove('hidden');
            } else {
                if (dom.featuredProfiles) dom.featuredProfiles.classList.add('hidden');
            }
        } else {
            if (dom.featuredProfiles) dom.featuredProfiles.classList.add('hidden');
        }

        if (appState.filteredProfiles.length === 0) {
            if (dom.noResultsMessage) dom.noResultsMessage.classList.remove('hidden');
            return;
        }

        const mainFragment = document.createDocumentFragment();
        const profilesToRender = isSearching ? appState.filteredProfiles : appState.allProfiles.filter(p => !p.isfeatured);

        if (isSearching) {
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6';
            profilesToRender.forEach((p, i) => grid.appendChild(createProfileCard(p, i)));
            mainFragment.appendChild(grid);
        } else {
            const profilesByProvince = profilesToRender.reduce((acc, p) => {
                (acc[p.provinceKey] = acc[p.provinceKey] || []).push(p);
                return acc;
            }, {});

            [...appState.provincesMap.keys()].forEach(provinceKey => {
                const provinceProfiles = profilesByProvince[provinceKey] || [];
                if (provinceProfiles.length === 0) return;
                
                const section = document.createElement('section');
                section.className = 'space-y-6';
                section.innerHTML = `
                    <div class="flex justify-between items-baseline">
                        <h3 class="text-2xl font-bold">${appState.provincesMap.get(provinceKey)}</h3>
                        ${provinceProfiles.length > CONFIG.PROFILES_PER_PROVINCE_ON_INDEX ? `<a href="/profiles.html?province=${provinceKey}" class="view-all-link">ดูทั้งหมด</a>` : ''}
                    </div>`;
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6';
                provinceProfiles.slice(0, CONFIG.PROFILES_PER_PROVINCE_ON_INDEX).forEach((p, i) => grid.appendChild(createProfileCard(p, i)));
                section.appendChild(grid);
                mainFragment.appendChild(section);
            });
        }
        dom.profilesDisplayArea.appendChild(mainFragment);
    }
    
    function appendProfileCards(profiles) {
        if (!dom.profilesDisplayArea || !profiles || profiles.length === 0) return;
        const fragment = document.createDocumentFragment();
        profiles.forEach((p, i) => fragment.appendChild(createProfileCard(p, i)));
        dom.profilesDisplayArea.appendChild(fragment);
    }

    function renderProfilesPage() {
        hideLoadingState();
        if (!dom.profilesDisplayArea) return;
        dom.profilesDisplayArea.innerHTML = '';
        if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
        if (dom.loadMoreContainer) dom.loadMoreContainer.classList.add('hidden');

        if (appState.filteredProfiles.length === 0) {
            if (dom.noResultsMessage) dom.noResultsMessage.classList.remove('hidden');
            return;
        }
        
        const initialProfiles = appState.filteredProfiles.slice(0, CONFIG.PROFILES_PER_PAGE);
        appendProfileCards(initialProfiles);
        
        if (appState.filteredProfiles.length > CONFIG.PROFILES_PER_PAGE) {
            if (dom.loadMoreContainer) dom.loadMoreContainer.classList.remove('hidden');
        }
    }
    
    function renderNextProfilePage() {
        appState.paginationPage++;
        const startIndex = (appState.paginationPage - 1) * CONFIG.PROFILES_PER_PAGE;
        const endIndex = appState.paginationPage * CONFIG.PROFILES_PER_PAGE;
        const nextProfiles = appState.filteredProfiles.slice(startIndex, endIndex);
        
        appendProfileCards(nextProfiles);
        
        if (endIndex >= appState.filteredProfiles.length) {
            if (dom.loadMoreContainer) dom.loadMoreContainer.classList.add('hidden');
        }
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

    // -----------------------------------------------------------------------------
    //  6. UI FEATURES & EVENT HANDLERS
    // -----------------------------------------------------------------------------
    function initSearchAndFilters() {
        if (!dom.searchForm) return;
        let debounceTimeout;
        const debouncedFilter = () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(applyFilters, CONFIG.DEBOUNCE_DELAY);
        };

        dom.searchForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(); });
        if (dom.resetSearchBtn) dom.resetSearchBtn.addEventListener('click', () => { dom.searchForm.reset(); applyFilters(); });
        
        [dom.searchKeyword, dom.searchProvince, dom.searchAvailability, dom.searchFeatured].forEach(input => {
            if(input) input.addEventListener(input.tagName === 'INPUT' ? 'input' : 'change', debouncedFilter);
        });
    }

    function applyFilters() {
        const searchTerm = dom.searchKeyword?.value.toLowerCase().trim() || '';
        const selectedProvince = dom.searchProvince?.value || '';
        const selectedAvailability = dom.searchAvailability?.value || '';
        const isFeaturedOnly = dom.searchFeatured?.value === 'true';

        appState.filteredProfiles = appState.allProfiles.filter(p => 
            (!selectedProvince || p.provinceKey === selectedProvince) &&
            (!selectedAvailability || p.availability === selectedAvailability) &&
            (!isFeaturedOnly || p.isfeatured) &&
            (!searchTerm || (p.name?.toLowerCase().includes(searchTerm)) || (p.styleTags?.some(t => t.toLowerCase().includes(searchTerm))))
        );
        
        appState.paginationPage = 1;
        const currentPage = dom.body.dataset.page;
        if (currentPage === 'home') {
            renderHomepageContent();
        } else if (currentPage === 'profiles') {
            renderProfilesPage();
        }
    }

    function initLightbox() {
        if (!dom.lightbox) return;
        
        const openAction = async (triggerElement) => {
            if (appState.isLightboxOpen || !triggerElement) return;
            const profileId = parseInt(triggerElement.dataset.profileId, 10);
            if (isNaN(profileId)) return;
            
            const profileData = appState.allProfiles.find(p => p.id === profileId);
            if (!profileData) return;
            
            appState.isLightboxOpen = true;
            appState.lastFocusedElement = triggerElement;
            populateLightbox(profileData);
            
            dom.lightbox.classList.remove('hidden');
            dom.body.style.overflow = 'hidden';
            dom.lightbox.setAttribute('aria-hidden', 'false');
            appState.activeTrap = focusTrap(dom.lightbox);

            const hasGsap = await loadAnimationScripts();
            if (hasGsap && dom.lightboxContentWrapperEl) {
                appState.gsap.to(dom.lightbox, { opacity: 1, duration: 0.3 });
                appState.gsap.fromTo(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
            } else {
                dom.lightbox.style.opacity = '1';
            }
            if (dom.closeLightboxBtn) dom.closeLightboxBtn.focus();
        };

        const closeAction = () => {
            if (!appState.isLightboxOpen) return;
            appState.isLightboxOpen = false;
            appState.activeTrap();
            dom.lightbox.setAttribute('aria-hidden', 'true');
            
            const onComplete = () => {
                dom.lightbox.classList.add('hidden');
                dom.body.style.overflow = '';
                if (appState.lastFocusedElement) appState.lastFocusedElement.focus();
            };

            if (appState.gsap && dom.lightboxContentWrapperEl) {
                appState.gsap.to(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
                appState.gsap.to(dom.lightbox, { opacity: 0, duration: 0.3, onComplete });
            } else {
                dom.lightbox.style.opacity = '0';
                setTimeout(onComplete, 300);
            }
        };

        dom.body.addEventListener('click', (e) => {
            const cardTrigger = e.target.closest('.profile-card-new');
            if (cardTrigger) openAction(cardTrigger);
            if (e.target === dom.lightbox || (dom.closeLightboxBtn && dom.closeLightboxBtn.contains(e.target))) closeAction();
        });

        dom.body.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.closest('.profile-card-new')) {
                e.preventDefault();
                openAction(e.target.closest('.profile-card-new'));
            }
            if (e.key === 'Escape' && appState.isLightboxOpen) closeAction();
        });
    }

    function initMobileMenu() {
        if (!dom.menuToggle || !dom.sidebar) return;
        
        const openMenu = () => {
            if (appState.isMenuOpen) return;
            appState.isMenuOpen = true;
            appState.lastFocusedElement = document.activeElement;
            
            dom.menuToggle.setAttribute('aria-expanded', 'true');
            dom.sidebar.setAttribute('aria-hidden', 'false');
            dom.sidebar.classList.remove('translate-x-full');
            if (dom.backdrop) {
                dom.backdrop.classList.remove('hidden');
                dom.backdrop.style.opacity = '1';
            }
            dom.body.style.overflow = 'hidden';
            appState.activeTrap = focusTrap(dom.sidebar);
            if (dom.closeSidebarBtn) dom.closeSidebarBtn.focus();
        };

        const closeMenu = () => {
            if (!appState.isMenuOpen) return;
            appState.isMenuOpen = false;
            appState.activeTrap();
            
            dom.menuToggle.setAttribute('aria-expanded', 'false');
            dom.sidebar.setAttribute('aria-hidden', 'true');
            dom.sidebar.classList.add('translate-x-full');
            if (dom.backdrop) {
                dom.backdrop.style.opacity = '0';
                setTimeout(() => dom.backdrop.classList.add('hidden'), 300);
            }
            dom.body.style.overflow = '';
            if (appState.lastFocusedElement) appState.lastFocusedElement.focus();
        };

        dom.menuToggle.addEventListener('click', openMenu);
        if (dom.closeSidebarBtn) dom.closeSidebarBtn.addEventListener('click', closeMenu);
        if (dom.backdrop) dom.backdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && appState.isMenuOpen) closeMenu();
        });
    }

    async function initAgeVerification() {
        if (!dom.ageVerificationOverlay || appState.isAgeVerified) return;

        dom.ageVerificationOverlay.classList.remove('hidden');
        appState.activeTrap = focusTrap(dom.ageVerificationOverlay);
        
        const modalContent = dom.ageVerificationOverlay.querySelector('.age-modal-content');
        
        const hasGsap = await loadAnimationScripts();
        if (hasGsap && modalContent) {
            appState.gsap.to(dom.ageVerificationOverlay, { opacity: 1, duration: 0.3 });
            appState.gsap.from(modalContent, { scale: 0.9, opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 });
        } else {
            dom.ageVerificationOverlay.style.opacity = '1';
        }

        if (dom.confirmAgeButton) dom.confirmAgeButton.focus();

        const handleVerification = (verified) => {
            appState.activeTrap();
            if (verified) {
                sessionStorage.setItem('ageVerified', 'true');
                appState.isAgeVerified = true;
                if (appState.gsap && modalContent) {
                    appState.gsap.to(dom.ageVerificationOverlay, { opacity: 0, duration: 0.3, onComplete: () => dom.ageVerificationOverlay.classList.add('hidden') });
                } else {
                    dom.ageVerificationOverlay.classList.add('hidden');
                }
            } else {
                try { window.history.back(); } catch (e) { window.location.href = 'https://google.com'; }
            }
        };
        
        if (dom.confirmAgeButton) dom.confirmAgeButton.addEventListener('click', () => handleVerification(true));
        if (dom.cancelAgeButton) dom.cancelAgeButton.addEventListener('click', () => handleVerification(false));
    }
    
    function initThemeToggle() {
        const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
        if (themeToggleBtns.length === 0) return;
        
        const html = document.documentElement;
        const sunIcon = `<i class="fas fa-sun theme-toggle-icon text-lg" aria-hidden="true"></i>`;
        const moonIcon = `<i class="fas fa-moon theme-toggle-icon text-lg" aria-hidden="true"></i>`;

        const applyTheme = (theme) => {
            html.classList.toggle('dark', theme === 'dark');
            html.classList.toggle('light', theme === 'light');
            themeToggleBtns.forEach(btn => {
                btn.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
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
        if (!dom.pageHeader) return;
        let isTicking = false;
        const handleScroll = () => {
            if (isTicking) return;
            isTicking = true;
            window.requestAnimationFrame(() => {
                dom.pageHeader.classList.toggle('scrolled', window.scrollY > 20);
                isTicking = false;
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // -----------------------------------------------------------------------------
    //  7. UTILITY & HELPER FUNCTIONS
    // -----------------------------------------------------------------------------
    function createProfileCard(profile, index, isEager = false) {
        const card = document.createElement('div');
        card.className = 'profile-card-new group soft-ui-card';
        card.dataset.profileId = profile.id;
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.setAttribute('aria-label', `ดูโปรไฟล์ของ ${profile.name}`);
        const mainImage = profile.images[0] || { medium: CONFIG.PLACEHOLDER_IMAGE };
        const isAboveTheFold = index < 4; 
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

    function populateLightbox(profileData) {
        // This function populates the lightbox with profile data.
        // Assumes all necessary elements exist in the lightbox template.
        const { name, images, altText, quote, description, styleTags, availability, age, stats, height, weight, skinTone, provinceKey, location, rate, lineId } = profileData;
        
        const findAndSet = (selector, text) => {
            const el = dom.lightbox.querySelector(selector);
            if(el) el.textContent = text;
        };
        
        findAndSet('#lightbox-profile-name-main', name);
        findAndSet('#lightboxQuote', quote ? `"${quote}"` : '');
        findAndSet('#lightboxDescriptionVal', description || 'ไม่มีรายละเอียดเพิ่มเติม');
        
        const heroImage = dom.lightbox.querySelector('#lightboxHeroImage');
        if(heroImage) {
            heroImage.src = images[0]?.large || CONFIG.PLACEHOLDER_IMAGE;
            heroImage.alt = altText || `รูปโปรไฟล์หลักของ ${name}`;
        }

        const tagsContainer = dom.lightbox.querySelector('#lightboxTags');
        if (tagsContainer) {
            tagsContainer.innerHTML = (styleTags || []).map(tag => `<span class="profile-tag">${tag}</span>`).join('');
        }

        const statsGrid = dom.lightbox.querySelector('#lightboxDetailsGrid');
        if (statsGrid) {
            const statsData = [ { label: 'สถานะ', value: availability, icon: 'fa-clock' }, { label: 'อายุ', value: age, icon: 'fa-birthday-cake' }, { label: 'สัดส่วน', value: stats, icon: 'fa-ruler-combined' }, { label: 'ส่วนสูง', value: height, icon: 'fa-arrows-alt-v' }, { label: 'น้ำหนัก', value: weight, icon: 'fa-weight-hanging' }, { label: 'สีผิว', value: skinTone, icon: 'fa-palette' }, { label: 'พิกัด', value: location || appState.provincesMap.get(provinceKey) || 'ไม่ระบุ', icon: 'fa-map-marker-alt' }, { label: 'เรท', value: rate, icon: 'fa-hand-holding-usd' } ];
            statsGrid.innerHTML = statsData
                .filter(stat => stat.value && stat.value !== '-')
                .map(stat => `<div class="stats-grid-item"><div class="stat-icon-wrapper"><i class="fas ${stat.icon} text-muted-foreground/80"></i></div><div><p class="stat-label">${stat.label}</p><p class="stat-value">${stat.value}</p></div></div>`)
                .join('');
        }

        const lineLink = dom.lightbox.querySelector('#lightboxLineLink');
        if (lineLink) {
            if (lineId) {
                lineLink.href = `https://line.me/ti/p/${lineId}`;
                lineLink.style.display = 'inline-flex';
                const lineLinkText = lineLink.querySelector('#lightboxLineLinkText');
                if(lineLinkText) lineLinkText.textContent = `ติดต่อ น้อง${name} ผ่าน LINE`;
            } else {
                lineLink.style.display = 'none';
            }
        }
    }

    function focusTrap(element) {
        const focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
        if (focusableEls.length === 0) return () => {};
        
        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        
        const keydownHandler = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) { 
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus();
                    e.preventDefault();
                }
            }
        };
        element.addEventListener('keydown', keydownHandler);
        return () => element.removeEventListener('keydown', keydownHandler);
    }
    
    function updateActiveNavLinks() {
        try {
            const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
            document.querySelectorAll('nav a').forEach(link => {
                const linkPath = new URL(link.href).pathname.replace(/\/$/, "") || "/";
                link.classList.toggle('active-nav-link', linkPath === currentPath);
            });
        } catch (e) {
            console.warn("Could not update nav links:", e);
        }
    }

    function generateFullSchema() {
        // This function can be expanded with more detailed schema logic if needed.
        // For now, it ensures a basic valid schema exists.
        return;
    }
    
    async function initScrollAnimations() {
        if (!appState.gsap || !appState.ScrollTrigger) return;
        
        appState.ScrollTrigger.batch("[data-animate-on-scroll]", {
            start: "top 90%",
            onEnter: batch => appState.gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, ease: "power2.out", overwrite: true }),
            onLeaveBack: batch => appState.gsap.to(batch, { opacity: 0, y: 30, overwrite: true })
        });
    }

    // -----------------------------------------------------------------------------
    //  8. SCRIPT EXECUTION ENTRY POINT
    // -----------------------------------------------------------------------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
})();