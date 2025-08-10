// =================================================================================
//  main.js (Ultimate Hybrid Rendering & Progressive Hydration Script)
//
//  เวอร์ชัน: สมบูรณ์แบบ (Final, Uncut)
//  ผู้พัฒนา: Gemini AI
//  ลักษณะเด่น:
//  - สถาปัตยกรรมแบบรวมศูนย์ (Centralized State, DOM, Config)
//  - Lifecycle การทำงาน 3 ขั้นตอนเพื่อประสิทธิภาพสูงสุด (Immediate, Core, Deferred)
//  - โหลดไลบรารีแบบ On-Demand (Dynamic Imports)
//  - ประสิทธิภาพ DOM สูงสุดด้วย Event Delegation และ DocumentFragment
//  - การเข้าถึง (Accessibility) และความทนทานของโค้ด (Resilience) ขั้นสูง
//  - รวมทุกฟังก์ชันการทำงานครบถ้วน ไม่มีการตัดทอน
// =================================================================================

(function() {
    'use strict';

    // -----------------------------------------------------------------------------
    //  1. CONFIGURATION & STATE MANAGEMENT
    // -----------------------------------------------------------------------------

    /** รวมศูนย์กลางค่าคงที่ของแอปพลิเคชัน */
    const CONFIG = {
        SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
        STORAGE_BUCKET: 'profile-images',
        PROFILES_PER_PROVINCE_ON_INDEX: 8,
        ABOVE_THE_FOLD_COUNT: 4, // สำคัญ: ต้องตรงกับจำนวน static card ใน HTML เพื่อ LCP
        DEBOUNCE_DELAY: 350,
        PLACEHOLDER_IMAGE: '/images/placeholder-profile.webp'
    };

    /** รวมศูนย์กลางการเข้าถึง DOM Elements (Cache) */
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
        menuToggle: document.getElementById('menu-toggle'),
        sidebar: document.getElementById('sidebar'),
        closeSidebarBtn: document.getElementById('close-sidebar-btn'),
        backdrop: document.getElementById('menu-backdrop'),
        ageVerificationOverlay: document.getElementById('age-verification-overlay'),
        confirmAgeButton: document.getElementById('confirmAgeButton'),
        cancelAgeButton: document.getElementById('cancelAgeButton'),
        lightbox: document.getElementById('lightbox'),
        lightboxContentWrapperEl: document.getElementById('lightbox-content-wrapper-el'),
        closeLightboxBtn: document.getElementById('closeLightboxBtn'),
        yearSpan: document.getElementById('currentYearDynamic')
    };

    /** รวมศูนย์กลางสถานะของแอปพลิเคชัน */
    const appState = {
        supabase: null,
        gsap: null,
        ScrollTrigger: null,
        allProfiles: [],
        provincesMap: new Map(),
        lastFocusedElement: null,
        isMenuOpen: false,
        isLightboxOpen: false,
        isFetchingData: false,
        isInitialLoad: true,
        isAgeVerified: sessionStorage.getItem('ageVerified') === 'true'
    };

    // -----------------------------------------------------------------------------
    //  2. APPLICATION INITIALIZATION LIFECYCLE
    // -----------------------------------------------------------------------------

    /** ฟังก์ชันหลักในการเริ่มต้นแอปพลิเคชัน */
    function initializeApp() {
        performance.mark('initializeApp-start');
        initImmediateUI();
        initCoreLogic();
        initDeferredTasks();
        performance.mark('initializeApp-end');
        performance.measure('initializeApp', 'initializeApp-start', 'initializeApp-end');
    }

    /** [LIFECYCLE 1] UI ที่ต้องทำงานทันทีเพื่อ UX ที่ดี */
    function initImmediateUI() {
        dom.body.classList.add('js-loaded');
        if (dom.yearSpan) dom.yearSpan.textContent = new Date().getFullYear();
        initThemeToggle();
        initMobileMenu();
        initHeaderScrollEffect();
        updateActiveNavLinks();
        initAgeVerification();
    }

    /** [LIFECYCLE 2] ตรรกะหลัก, การดึงข้อมูล, และการ Hydrate */
    async function initCoreLogic() {
        const currentPage = dom.body.dataset.page;
        if (!['home', 'profiles'].includes(currentPage)) return;
        initSearchAndFilters();
        showLoadingState();
        await loadCoreScripts();
        if (!appState.supabase) {
            showErrorState("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
            return;
        }
        const success = await fetchData();
        if (success) {
            applyFilters();
            initLightbox();
        } else {
            showErrorState();
        }
        appState.isInitialLoad = false;
        if (dom.retryFetchBtn) dom.retryFetchBtn.addEventListener('click', handleRetry);
    }

    /** [LIFECYCLE 3] งานที่ไม่เร่งด่วน (Animations, SEO Schema) */
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
            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm"),
                import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm")
            ]);
            appState.gsap = gsapModule.gsap;
            appState.ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            appState.gsap.registerPlugin(appState.ScrollTrigger);
            return true;
        } catch (error) {
            console.error('Animation scripts (GSAP) failed to load. Animations will be disabled.', error);
            return false;
        }
    }

    // -----------------------------------------------------------------------------
    //  4. DATA FETCHING & RENDERING
    // -----------------------------------------------------------------------------

    function showLoadingState() {
        if (dom.loadingPlaceholder && appState.isInitialLoad) {
            dom.loadingPlaceholder.style.display = 'block';
        }
        if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
    }

    function hideLoadingState() {
        if (dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
    }

    function showErrorState(message = 'เกิดข้อผิดพลาดในการดึงข้อมูล') {
        hideLoadingState();
        if (dom.profilesDisplayArea && appState.allProfiles.length === 0) {
            dom.profilesDisplayArea.innerHTML = '';
        }
        if (dom.featuredSection) dom.featuredSection.classList.add('hidden');
        if (dom.fetchErrorMessage) {
            const p = dom.fetchErrorMessage.querySelector('p');
            if (p) p.textContent = message;
            dom.fetchErrorMessage.classList.remove('hidden');
        }
    }

    async function handleRetry() {
        if (appState.isFetchingData) return;
        if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
        showLoadingState();
        const success = await fetchData();
        if (success) {
            applyFilters();
        } else {
            showErrorState();
        }
    }

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
                const allImagePaths = [p.imagePath, ...(p.galleryPaths || [])].filter(Boolean);
                const images = allImagePaths.map(path => {
                    const { data: { publicUrl } } = appState.supabase.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
                    return {
                        small: `${publicUrl}?width=400&quality=80`,
                        medium: `${publicUrl}?width=600&quality=80`,
                        large: `${publicUrl}?width=800&quality=85`
                    };
                });
                if (images.length === 0) {
                    images.push({ small: CONFIG.PLACEHOLDER_IMAGE, medium: CONFIG.PLACEHOLDER_IMAGE, large: CONFIG.PLACEHOLDER_IMAGE });
                }
                const altText = p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name} จังหวัด ${appState.provincesMap.get(p.provinceKey) || ''}`;
                return { ...p, images, altText };
            });
            if (dom.provinceSelect && dom.provinceSelect.options.length <= 1) {
                const fragment = document.createDocumentFragment();
                provincesRes.data.forEach(prov => {
                    const option = document.createElement('option');
                    option.value = prov.key;
                    option.textContent = prov.nameThai;
                    fragment.appendChild(option);
                });
                dom.provinceSelect.appendChild(fragment);
            }
            return true;
        } catch (error) {
            console.error('CRITICAL: Supabase fetch error:', error);
            return false;
        } finally {
            appState.isFetchingData = false;
        }
    }

    function renderProfiles(filteredProfiles, isSearching) {
        if (!dom.profilesDisplayArea) return;
        hideLoadingState();
        if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
        const currentPage = dom.body.dataset.page;
        const mainFragment = document.createDocumentFragment();
        if (dom.featuredSection && dom.featuredContainer) {
            const featuredProfilesList = appState.allProfiles.filter(p => p.isfeatured);
            if (currentPage === 'home' && !isSearching && featuredProfilesList.length > 0) {
                const featuredFragment = document.createDocumentFragment();
                featuredProfilesList.slice(0, CONFIG.ABOVE_THE_FOLD_COUNT).forEach((p, i) => {
                    featuredFragment.appendChild(createProfileCard(p, i, true));
                });
                dom.featuredContainer.innerHTML = '';
                dom.featuredContainer.appendChild(featuredFragment);
                dom.featuredSection.classList.remove('hidden');
            } else {
                dom.featuredSection.classList.add('hidden');
            }
        }
        if (filteredProfiles.length === 0) {
            if (isSearching || currentPage === 'profiles') {
                if (dom.noResultsMessage) dom.noResultsMessage.classList.remove('hidden');
            }
        } else {
            if (currentPage === 'profiles' || (currentPage === 'home' && isSearching)) {
                const gridContainer = document.createElement('div');
                gridContainer.className = 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';
                filteredProfiles.forEach((profile, index) => {
                    gridContainer.appendChild(createProfileCard(profile, index));
                });
                mainFragment.appendChild(gridContainer);
            } else if (currentPage === 'home' && !isSearching) {
                const profilesByProvince = filteredProfiles.reduce((acc, profile) => {
                    const key = profile.provinceKey || 'unknown';
                    (acc[key] = acc[key] || []).push(profile);
                    return acc;
                }, {});
                const provinceOrder = [...new Set(filteredProfiles.map(p => p.provinceKey))].filter(Boolean);
                let cardIndex = dom.featuredContainer?.children.length || 0;
                provinceOrder.forEach(provinceKey => {
                    const provinceProfiles = profilesByProvince[provinceKey] || [];
                    if (provinceProfiles.length === 0) return;
                    const provinceName = appState.provincesMap.get(provinceKey) || "ไม่ระบุ";
                    const provinceSectionEl = document.createElement('section');
                    provinceSectionEl.className = 'province-section';
                    provinceSectionEl.setAttribute('aria-labelledby', `province-heading-${provinceKey}`);
                    const gridContainer = document.createElement('div');
                    gridContainer.className = 'profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4';
                    provinceProfiles.slice(0, CONFIG.PROFILES_PER_PROVINCE_ON_INDEX).forEach(p => {
                        gridContainer.appendChild(createProfileCard(p, cardIndex++));
                    });
                    provinceSectionEl.innerHTML = `<div class="province-section-header"><h3 id="province-heading-${provinceKey}" class="text-2xl font-bold">${provinceName}</h3><a href="/profiles.html?province=${provinceKey}" class="text-sm font-semibold text-primary hover:underline">ดูทั้งหมด</a></div>`;
                    provinceSectionEl.appendChild(gridContainer);
                    mainFragment.appendChild(provinceSectionEl);
                });
            }
        }
        dom.profilesDisplayArea.innerHTML = '';
        dom.profilesDisplayArea.appendChild(mainFragment);
        initScrollAnimations();
    }

    // -----------------------------------------------------------------------------
    //  5. UI FEATURES & EVENT HANDLERS
    // -----------------------------------------------------------------------------

    function initSearchAndFilters() {
        if (!dom.searchForm) return;
        let debounceTimeout;
        const debouncedFilter = () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(applyFilters, CONFIG.DEBOUNCE_DELAY);
        };
        dom.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
        });
        if (dom.resetSearchBtn) dom.resetSearchBtn.addEventListener('click', () => {
            dom.searchForm.reset();
            applyFilters();
        });
        const inputs = [dom.searchInput, dom.provinceSelect, dom.availabilitySelect, dom.featuredSelect];
        inputs.forEach(input => {
            if (input) {
                const eventType = input.tagName === 'INPUT' ? 'input' : 'change';
                input.addEventListener(eventType, debouncedFilter);
            }
        });
    }

    function applyFilters() {
        if (appState.isInitialLoad && appState.allProfiles.length === 0) return;
        const searchTerm = dom.searchInput?.value.toLowerCase().trim() ?? '';
        const selectedProvince = dom.provinceSelect?.value ?? '';
        const selectedAvailability = dom.availabilitySelect?.value ?? '';
        const isFeaturedOnly = dom.featuredSelect?.value === 'true' ?? false;
        const filtered = appState.allProfiles.filter(p =>
            (!searchTerm || (p.name?.toLowerCase().includes(searchTerm)) || (p.location?.toLowerCase().includes(searchTerm)) || (p.styleTags?.some(t => t.toLowerCase().includes(searchTerm)))) &&
            (!selectedProvince || p.provinceKey === selectedProvince) &&
            (!selectedAvailability || p.availability === selectedAvailability) &&
            (!isFeaturedOnly || p.isfeatured)
        );
        const isSearching = searchTerm || selectedProvince || selectedAvailability || isFeaturedOnly;
        renderProfiles(filtered, isSearching);
    }

    function initLightbox() {
        if (!dom.lightbox) return;
        const eventArea = dom.body;
        const openAction = async (triggerElement) => {
            if (appState.isLightboxOpen || !triggerElement) return;
            const profileId = parseInt(triggerElement.dataset.profileId, 10);
            if (isNaN(profileId)) return;
            const profileData = appState.allProfiles.find(p => p.id === profileId);
            if (profileData) {
                appState.isLightboxOpen = true;
                appState.lastFocusedElement = triggerElement;
                populateLightbox(profileData);
                dom.lightbox.classList.remove('hidden');
                dom.body.style.overflow = 'hidden';
                dom.lightbox.setAttribute('aria-hidden', 'false');
                const hasGsap = await loadAnimationScripts();
                if (hasGsap) {
                    appState.gsap.to(dom.lightbox, { opacity: 1, duration: 0.3 });
                    appState.gsap.fromTo(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
                } else {
                    dom.lightbox.style.opacity = '1';
                }
                setTimeout(() => dom.closeLightboxBtn?.focus(), 50);
            }
        };
        const closeAction = () => {
            if (!appState.isLightboxOpen) return;
            appState.isLightboxOpen = false;
            dom.lightbox.setAttribute('aria-hidden', 'true');
            const onComplete = () => {
                dom.lightbox.classList.add('hidden');
                dom.body.style.overflow = '';
                if (appState.lastFocusedElement) appState.lastFocusedElement.focus();
            };
            if (appState.gsap) {
                appState.gsap.to(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
                appState.gsap.to(dom.lightbox, { opacity: 0, duration: 0.3, onComplete });
            } else {
                dom.lightbox.style.opacity = '0';
                setTimeout(onComplete, 300);
            }
        };
        eventArea.addEventListener('click', (event) => {
            const cardTrigger = event.target.closest('.profile-card-new');
            if (cardTrigger) {
                event.preventDefault();
                openAction(cardTrigger);
            }
            if (event.target === dom.lightbox || event.target.closest('#closeLightboxBtn')) {
                closeAction();
            }
        });
        eventArea.addEventListener('keydown', (event) => {
            const cardTrigger = event.target.closest('.profile-card-new');
            if (event.key === 'Enter' && cardTrigger) {
                event.preventDefault();
                openAction(cardTrigger);
            }
            if (event.key === 'Escape' && appState.isLightboxOpen) {
                closeAction();
            }
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
            setTimeout(() => dom.closeSidebarBtn?.focus(), 50);
        };
        const closeMenu = () => {
            if (!appState.isMenuOpen) return;
            appState.isMenuOpen = false;
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
        dom.closeSidebarBtn?.addEventListener('click', closeMenu);
        dom.backdrop?.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && appState.isMenuOpen) closeMenu();
        });
    }

    async function initAgeVerification() {
        if (!dom.ageVerificationOverlay || appState.isAgeVerified) {
            return;
        }
        dom.ageVerificationOverlay.classList.remove('hidden');
        const modalContent = dom.ageVerificationOverlay.querySelector('.age-modal-content');
        const hasGsap = await loadAnimationScripts();
        if (hasGsap && modalContent) {
            appState.gsap.to(dom.ageVerificationOverlay, { opacity: 1, duration: 0.3 });
            appState.gsap.fromTo(modalContent, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 });
        } else {
            dom.ageVerificationOverlay.style.opacity = '1';
        }
        const closeAction = (verified) => {
            if (verified) {
                sessionStorage.setItem('ageVerified', 'true');
                appState.isAgeVerified = true;
            }
            const onComplete = () => {
                dom.ageVerificationOverlay.classList.add('hidden');
                if (!verified) {
                    try { window.history.back(); } catch(e) { window.location.href = 'https://google.com'; }
                }
            };
            if (appState.gsap && modalContent) {
                appState.gsap.to(modalContent, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
                appState.gsap.to(dom.ageVerificationOverlay, { opacity: 0, duration: 0.3, delay: 0.1, onComplete });
            } else {
                dom.ageVerificationOverlay.style.opacity = '0';
                setTimeout(onComplete, 300);
            }
        };
        if (dom.confirmAgeButton) dom.confirmAgeButton.addEventListener('click', () => closeAction(true));
        if (dom.cancelAgeButton) dom.cancelAgeButton.addEventListener('click', () => closeAction(false));
    }

    async function initScrollAnimations() {
        const hasGsap = await loadAnimationScripts();
        if (!hasGsap) return;
        appState.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        appState.ScrollTrigger.refresh();
        const animatedElements = document.querySelectorAll('[data-animate-on-scroll]');
        animatedElements.forEach(el => {
            if (el.classList.contains('gsap-animating')) return;
            el.classList.add('gsap-animating');
            appState.gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    toggleActions: "play none none none",
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => el.classList.remove('gsap-animating')
            });
        });
    }

    function initThemeToggle() {
        const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
        if (themeToggleBtns.length === 0) return;
        const html = document.documentElement;
        const sunIcon = `<i class="fas fa-sun theme-toggle-icon text-lg" aria-hidden="true"></i>`;
        const moonIcon = `<i class="fas fa-moon theme-toggle-icon text-lg" aria-hidden="true"></i>`;
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

    function initHeaderScrollEffect() {
        if (!dom.pageHeader) return;
        let isTicking = false;
        const handleScroll = () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    dom.pageHeader.classList.toggle('scrolled', window.scrollY > 20);
                    isTicking = false;
                });
                isTicking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // -----------------------------------------------------------------------------
    //  6. UTILITY & HELPER FUNCTIONS (FULL IMPLEMENTATIONS)
    // -----------------------------------------------------------------------------

    function createProfileCard(profile, index, isEager = false) {
        const card = document.createElement('div');
        card.className = 'profile-card-new group cursor-pointer';
        card.dataset.profileId = profile.id;
        card.setAttribute('aria-label', `ดูโปรไฟล์ของ ${profile.name ?? 'ไม่ระบุชื่อ'}`);
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.dataset.animateOnScroll = '';
        const mainImage = profile.images[0] || { small: CONFIG.PLACEHOLDER_IMAGE, medium: CONFIG.PLACEHOLDER_IMAGE };
        const isAboveTheFold = index < CONFIG.ABOVE_THE_FOLD_COUNT;
        const img = document.createElement('img');
        img.src = mainImage.medium;
        if (mainImage.small) img.srcset = `${mainImage.small} 400w, ${mainImage.medium} 600w`;
        img.sizes = "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw";
        img.alt = profile.altText;
        img.className = "card-image";
        img.decoding = "async";
        img.width = 300;
        img.height = 400;
        if (isAboveTheFold || isEager) {
            img.loading = 'eager';
            img.setAttribute('fetchpriority', 'high');
        } else {
            img.loading = 'lazy';
        }
        img.onerror = () => { img.onerror = null; img.src = CONFIG.PLACEHOLDER_IMAGE; img.srcset = ''; };
        let availabilityText = profile.availability || "สอบถามคิว";
        let availabilityClass = 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        if (availabilityText.includes('ว่าง') || availabilityText.includes('รับงาน')) { availabilityClass = 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300'; } 
        else if (availabilityText.includes('ไม่ว่าง') || availabilityText.includes('พัก')) { availabilityClass = 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300'; }
        const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l2.034 4.192a.75.75 0 00.564.41l4.625.672c.728.106 1.018.995.494 1.503l-3.348 3.263a.75.75 0 00-.215.664l.79 4.607c.124.724-.636 1.285-1.288.941l-4.135-2.174a.75.75 0 00-.696 0l-4.135 2.174c-.652.344-1.412-.217-1.288-.94l.79-4.607a.75.75 0 00-.215-.665L1.15 9.66c-.524-.508-.234-1.397.494-1.503l4.625-.672a.75.75 0 00.564-.41L9.132 2.884z" clip-rule="evenodd" /></svg>`;
        const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.623-.359 1.445-.835 2.13-1.36.712-.549 1.282-1.148 1.655-1.743.372-.596.59-1.28.59-2.002v-1.996a4.504 4.504 0 00-1.272-3.116A4.47 4.47 0 0013.5 4.513V4.5C13.5 3.12 12.38 2 11 2H9c-1.38 0-2.5 1.12-2.5 2.5v.013a4.47 4.47 0 00-1.728 1.388A4.504 4.504 0 003 9.504v1.996c0 .722.218 1.406.59 2.002.373.595.943 1.194 1.655 1.743.685.525 1.507 1.001 2.13 1.36.254.147.468.27.654-.369a5.745 5.745 0 00.28.14l.019.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>`;
        card.innerHTML = `
            <div class="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
                <span class="${availabilityClass} text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">${availabilityText}</span>
                ${profile.isfeatured ? `<span class="bg-yellow-400 text-black text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">${starIcon}แนะนำ</span>` : ''}
            </div>
            <div class="card-overlay">
                <div class="card-info">
                    <h3 class="text-xl lg:text-2xl font-bold truncate">${profile.name ?? 'N/A'}</h3>
                    <p class="text-sm flex items-center gap-1.5">${locationIcon} ${appState.provincesMap.get(profile.provinceKey) || 'ไม่ระบุ'}</p>
                </div>
            </div>`;
        card.prepend(img);
        return card;
    }

    function populateLightbox(profileData) {
        const { name = 'N/A', images = [], altText = 'รูปโปรไฟล์', quote = '', description = 'ไม่มีรายละเอียดเพิ่มเติม', styleTags = [], availability = 'สอบถามคิว', age = '-', stats = '-', height = '-', weight = '-', skinTone = '-', provinceKey, location, rate = 'สอบถาม', lineId } = profileData;
        document.getElementById('lightbox-header-title')?.textContent = `โปรไฟล์: ${name}`;
        document.getElementById('lightbox-profile-name-main')?.textContent = name;
        const heroImageEl = document.getElementById('lightboxHeroImage');
        if (heroImageEl) {
            heroImageEl.src = images[0]?.large || CONFIG.PLACEHOLDER_IMAGE;
            heroImageEl.alt = altText;
        }
        const quoteEl = document.getElementById('lightboxQuote');
        if (quoteEl) {
            quoteEl.textContent = quote ? `"${quote}"` : '';
            quoteEl.style.display = quote ? 'block' : 'none';
        }
        const descriptionEl = document.getElementById('lightboxDescriptionVal');
        if (descriptionEl) descriptionEl.innerHTML = description.replace(/\n/g, '<br>');
        const thumbnailStripEl = document.getElementById('lightboxThumbnailStrip');
        if (thumbnailStripEl) {
            thumbnailStripEl.innerHTML = '';
            if (images.length > 1) {
                images.forEach((img, index) => {
                    const thumb = document.createElement('img');
                    thumb.src = img.small;
                    thumb.alt = `รูปตัวอย่างที่ ${index + 1} ของ ${name}`;
                    thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                    thumb.addEventListener('click', () => {
                        if (heroImageEl) heroImageEl.src = img.large;
                        thumbnailStripEl.querySelector('.thumbnail.active')?.classList.remove('active');
                        thumb.classList.add('active');
                    });
                    thumbnailStripEl.appendChild(thumb);
                });
                thumbnailStripEl.style.display = 'flex';
            } else {
                thumbnailStripEl.style.display = 'none';
            }
        }
        const tagsEl = document.getElementById('lightboxTags');
        if (tagsEl) {
            tagsEl.innerHTML = '';
            if (styleTags.length > 0) {
                styleTags.forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full';
                    tagEl.textContent = tag;
                    tagsEl.appendChild(tagEl);
                });
                tagsEl.style.display = 'flex';
            } else {
                tagsEl.style.display = 'none';
            }
        }
        const detailsEl = document.getElementById('lightboxDetailsCompact');
        if (detailsEl) {
            let availabilityClass = 'bg-yellow-200 text-yellow-800';
            if (availability.includes('ว่าง') || availability.includes('รับงาน')) { availabilityClass = 'bg-green-200 text-green-800'; } 
            else if (availability.includes('ไม่ว่าง') || availability.includes('พัก')) { availabilityClass = 'bg-red-200 text-red-800'; }
            detailsEl.innerHTML = `
                <div class="availability-badge ${availabilityClass}">${availability}</div>
                <div class="stats-grid">
                    <div class="stat-item"><div class="label">อายุ</div><div class="value">${age} ปี</div></div>
                    <div class="stat-item"><div class="label">สัดส่วน</div><div class="value">${stats}</div></div>
                    <div class="stat-item"><div class="label">สูง/หนัก</div><div class="value">${height}/${weight}</div></div>
                </div>
                <dl class="space-y-2 text-sm">
                    <div class="detail-list-item"><dt class="flex-shrink-0"><i class="fas fa-palette w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt><dd class="value">ผิว: ${skinTone}</dd></div>
                    <div class="detail-list-item"><dt class="flex-shrink-0"><i class="fas fa-map-marker-alt w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt><dd class="value">${appState.provincesMap.get(provinceKey) || ''} (${location || 'ไม่ระบุ'})</dd></div>
                    <div class="detail-list-item"><dt class="flex-shrink-0"><i class="fas fa-money-bill-wave w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt><dd class="value">เรท: ${rate}</dd></div>
                </dl>`;
        }
        const lineLink = document.getElementById('lightboxLineLink');
        const lineLinkText = document.getElementById('lightboxLineLinkText');
        if (lineLink && lineLinkText) {
            if (lineId) {
                lineLink.href = lineId.startsWith('http') ? lineId : `https://line.me/ti/p/${lineId}`;
                lineLink.style.display = 'inline-flex';
                lineLinkText.textContent = `ติดต่อ ${name} ผ่าน LINE`;
            } else {
                lineLink.style.display = 'none';
            }
        }
    }

    function updateActiveNavLinks() {
        try {
            const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
            const navLinks = document.querySelectorAll('#sidebar nav a, header nav a');
            navLinks.forEach(link => {
                const linkPath = new URL(link.href).pathname.replace(/\/$/, "") || "/";
                link.classList.toggle('active-nav-link', linkPath === currentPath);
            });
        } catch (e) {
            console.warn("Could not update active nav links:", e);
        }
    }

    function generateFullSchema() {
        try {
            const pageTitle = document.title;
            const canonicalLink = document.querySelector("link[rel='canonical']");
            const canonicalUrl = canonicalLink ? canonicalLink.href : window.location.href;
            const siteUrl = new URL('/', window.location.href).href;
            const orgName = "SidelineChiangmai - รับงาน ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก";
            const mainSchema = {
                "@context": "https://schema.org",
                "@graph": [{"@type":"Organization","@id":`${siteUrl}#organization`,"name":orgName,"url":siteUrl,"logo":{"@type":"ImageObject","url":`${siteUrl}images/logo-sideline-chiangmai.webp`,"width":245,"height":30},"contactPoint":{"@type":"ContactPoint","contactType":"customer support","url":"https://line.me/ti/p/_faNcjQ3xx"}},{"@type":"WebSite","@id":`${siteUrl}#website`,"url":siteUrl,"name":orgName,"description":"รวมโปรไฟล์ไซด์ไลน์เชียงใหม่, ลำปาง, เชียงราย คุณภาพ บริการฟีลแฟน การันตีตรงปก 100% ปลอดภัย ไม่ต้องมัดจำ","publisher":{"@id":`${siteUrl}#organization`},"inLanguage":"th-TH"},{"@type":"WebPage","@id":`${canonicalUrl}#webpage`,"url":canonicalUrl,"name":pageTitle,"isPartOf":{"@id":`${siteUrl}#website`},"primaryImageOfPage":{"@type":"ImageObject","url":`${siteUrl}images/sideline-chiangmai-social-preview.webp`},"breadcrumb":{"@id":`${canonicalUrl}#breadcrumb`}},{"@type":"LocalBusiness","@id":`${siteUrl}#localbusiness`,"name":"SidelineChiangmai - ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก","image":`${siteUrl}images/sideline-chiangmai-social-preview.webp`,"url":siteUrl,"priceRange":"฿฿","address":{"@type":"PostalAddress","streetAddress":"เจ็ดยอด","addressLocality":"ช้างเผือก","addressRegion":"เชียงใหม่","postalCode":"50300","addressCountry":"TH"},"geo":{"@type":"GeoCoordinates","latitude":"18.814361","longitude":"98.972389"},"hasMap":"https://maps.app.goo.gl/3y8gyAtamm8YSagi9","openingHours":["Mo-Su 00:00-24:00"],"areaServed":[{"@type":"City","name":"Chiang Mai"},{"@type":"City","name":" Lampang"},{"@type":"City","name":"Chiang Rai"}]},{"@type":"BreadcrumbList","@id":`${canonicalUrl}#breadcrumb`,"itemListElement":[{"@type":"ListItem","position":1,"name":"หน้าแรก","item":siteUrl}]},{"@type":"FAQPage","@id":`${siteUrl}faq.html#faq`,"mainEntity":[{"@type":"Question","name":"บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?","acceptedAnswer":{"@type":"Answer","text":"Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้าทุกท่าน ข้อมูลการติดต่อและการจองของท่านจะถูกเก็บรักษาเป็นความลับอย่างเข้มงวด"}},{"@type":"Question","name":"จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการไซด์ไลน์หรือไม่?","acceptedAnswer":{"@type":"Answer","text":"เพื่อความสบายใจของลูกค้าทุกท่าน ท่านไม่จำเป็นต้องโอนเงินมัดจำใดๆ ทั้งสิ้น สามารถชำระค่าบริการเต็มจำนวนโดยตรงกับน้องๆ ที่หน้างานได้เลย"}},{"@type":"Question","name":"น้องๆ ไซด์ไลน์เชียงใหม่ตรงปกตามรูปที่แสดงในโปรไฟล์จริงหรือ?","acceptedAnswer":{"@type":"Answer","text":"เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพของน้องๆ ทุกคนอย่างละเอียด Sideline Chiang Mai กล้าการันตีว่าน้องๆ ตรงปก 100% หากพบปัญหาใดๆ สามารถแจ้งทีมงานเพื่อดำเนินการแก้ไขได้ทันที"}}]}]
            };
            const oldSchema = document.querySelector('script[type="application/ld+json"]');
            if (oldSchema) oldSchema.remove();
            const schemaContainer = document.createElement('script');
            schemaContainer.type = 'application/ld+json';
            schemaContainer.textContent = JSON.stringify(mainSchema);
            document.head.appendChild(schemaContainer);
        } catch (e) {
            console.error("Failed to generate or append JSON-LD schema.", e);
        }
    }

    // -----------------------------------------------------------------------------
    //  7. SCRIPT EXECUTION ENTRY POINT
    // -----------------------------------------------------------------------------

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

})();