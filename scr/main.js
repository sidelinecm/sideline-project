// =================================================================
// SidelineCM: Ultimate Production-Ready Main Script
// Version: 5.0 (Final & Complete)
// This script is a complete, production-ready solution, combining all features,
// performance optimizations, accessibility enhancements, and robust error handling.
// No parts have been omitted.
// =================================================================

/**
 * Main App Module using the Module Pattern.
 * This encapsulates all logic to prevent global scope pollution and improve organization.
 */
(function() {
    'use strict';

    // --- STATE MANAGEMENT ---
    // Centralized state for the entire application.
    const state = {
        allProfiles: [],
        provincesMap: new Map(),
        isDataFetched: false,
        isLightboxOpen: false,
        isMenuOpen: false,
        lastFocusedElement: null,
        gsap: null,
        ScrollTrigger: null,
        supabase: null
    };

    // --- CONFIGURATION CONSTANTS ---
    // Centralized configuration for easy management.
    const config = {
        SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
        STORAGE_BUCKET: 'profile-images',
        PROFILES_PER_PROVINCE_ON_INDEX: 8,
        SKELETON_CARD_COUNT: 8,
        ABOVE_THE_FOLD_COUNT: 4,
        SEARCH_DEBOUNCE_MS: 350
    };

    // --- DOM ELEMENT CACHE ---
    // Caching DOM elements for faster access and cleaner code.
    const dom = {};

    /**
     * Caches all frequently used DOM elements on startup.
     */
    function cacheDOMElements() {
        const ids = [
            'body', 'page-header', 'loading-profiles-placeholder', 'profiles-display-area',
            'no-results-message', 'fetch-error-message', 'retry-fetch-btn', 'search-form',
            'search-keyword', 'search-province', 'search-availability', 'search-featured',
            'reset-search-btn', 'featured-profiles', 'featured-profiles-container',
            'menu-toggle', 'sidebar', 'close-sidebar-btn', 'menu-backdrop',
            'age-verification-overlay', 'confirmAgeButton', 'cancelAgeButton',
            'lightbox', 'lightbox-content-wrapper-el', 'closeLightboxBtn', 'currentYearDynamic'
        ];
        // Special case for body
        dom.body = document.body;
        ids.forEach(id => {
            if (id !== 'body') dom[id.replace(/-(\w)/g, (m, c) => c.toUpperCase())] = document.getElementById(id);
        });
    }

    /**
     * The main entry point for the application.
     * Executes after the entire page (including styles and images) is loaded.
     */
    async function initializeApp() {
        performance.mark('initializeApp-start');

        cacheDOMElements();
        
        initCommonUI();
        
        const supabaseLoaded = await loadCoreScripts();
        if (!supabaseLoaded) {
            showErrorState();
            return;
        }

        initAgeVerification();

        const currentPage = dom.body.dataset.page;
        if (['home', 'profiles'].includes(currentPage)) {
            showLoadingState();
            const success = await fetchData();
            if (success) {
                initSearchAndFilters();
                initLightbox();
                if (dom.retryFetchBtn) dom.retryFetchBtn.addEventListener('click', handleRetry);
            } else {
                showErrorState();
            }
        }

        generateFullSchema();
        loadAnimationScripts().then(() => initScrollAnimations()); // Load and init animations

        dom.body.classList.add('loaded');
        
        performance.mark('initializeApp-end');
        performance.measure('initializeApp', 'initializeApp-start', 'initializeApp-end');
    }

    /**
     * Loads the core Supabase client script.
     * @returns {Promise<boolean>} True on success, false on failure.
     */
    async function loadCoreScripts() {
        try {
            if (!state.supabase) {
                const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
                state.supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
            }
            return true;
        } catch (error) {
            console.error('CRITICAL: Could not load Supabase client.', error);
            return false;
        }
    }
    
    /**
     * Dynamically loads animation scripts (GSAP) when needed.
     */
    async function loadAnimationScripts() {
        if (state.gsap) return;
        try {
            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm"),
                import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm")
            ]);
            state.gsap = gsapModule.gsap;
            state.ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            state.gsap.registerPlugin(state.ScrollTrigger);
        } catch (error) {
            console.warn('Could not load animation scripts (GSAP). Animations will be disabled.', error);
        }
    }
    
    // --- UI State Functions ---

    function showLoadingState() {
        if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
        if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
        if (dom.profilesDisplayArea) dom.profilesDisplayArea.setAttribute('aria-busy', 'true');
        if (dom.loadingPlaceholder) {
            const grid = dom.loadingPlaceholder.querySelector('.grid');
            if (grid && grid.innerHTML === '') {
                grid.innerHTML = '<div class="skeleton-card"></div>'.repeat(config.SKELETON_CARD_COUNT);
            }
            dom.loadingPlaceholder.style.display = 'block';
        }
    }

    function hideLoadingState() {
        if (dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
        if (dom.profilesDisplayArea) dom.profilesDisplayArea.setAttribute('aria-busy', 'false');
    }

    function showErrorState() {
        hideLoadingState();
        if (dom.profilesDisplayArea) dom.profilesDisplayArea.innerHTML = '';
        if (dom.featuredSection) dom.featuredSection.classList.add('hidden');
        if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.remove('hidden');
    }

    async function handleRetry() {
        if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
        showLoadingState();
        const success = await fetchData();
        if (success) {
            applyFilters();
        } else {
            showErrorState();
        }
    }
    
    // --- Data Fetching ---

    async function fetchData() {
        if (!state.supabase) {
            console.error("Supabase client not available. Cannot fetch data.");
            return false;
        }
        try {
            const [profilesRes, provincesRes] = await Promise.all([
                state.supabase.from('profiles').select('*').order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false }),
                state.supabase.from('provinces').select('*').order('nameThai', { ascending: true })
            ]);

            if (profilesRes.error) throw profilesRes.error;
            if (provincesRes.error) throw provincesRes.error;

            provincesRes.data.forEach(p => state.provincesMap.set(p.key, p.nameThai));
            
            state.allProfiles = (profilesRes.data || []).map(p => {
                const allImagePaths = [p.imagePath, ...(p.galleryPaths || [])].filter(Boolean);
                const images = allImagePaths.map(path => {
                    const { data: { publicUrl } } = state.supabase.storage.from(config.STORAGE_BUCKET).getPublicUrl(path);
                    return {
                        small: `${publicUrl}?width=400&quality=80`,
                        medium: `${publicUrl}?width=600&quality=80`,
                        large: `${publicUrl}?width=800&quality=85`
                    };
                });
                if (images.length === 0) {
                    const placeholder = '/images/placeholder-profile.webp';
                    images.push({ small: placeholder, medium: placeholder, large: placeholder });
                }
                const altText = p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name} จังหวัด ${state.provincesMap.get(p.provinceKey) || ''}`;
                return { ...p, images, altText };
            });

            if (dom.provinceSelect && dom.provinceSelect.options.length <= 1) {
                provincesRes.data.forEach(prov => {
                    dom.provinceSelect.add(new Option(prov.nameThai, prov.key));
                });
            }
            state.isDataFetched = true;
            return true;
        } catch (error) {
            console.error('CRITICAL: Error fetching data from Supabase:', error);
            return false;
        }
    }
    
    // --- Search, Filter & Render Logic ---

    function initSearchAndFilters() {
        applyFilters(); // Initial render
        if (!dom.searchForm) return;

        const debouncedFilter = debounce(applyFilters, config.SEARCH_DEBOUNCE_MS);

        dom.searchForm.addEventListener('submit', e => {
            e.preventDefault();
            applyFilters();
        });
        if (dom.resetSearchBtn) {
            dom.resetSearchBtn.addEventListener('click', () => {
                if(dom.searchForm) dom.searchForm.reset();
                applyFilters();
            });
        }
        if (dom.searchInput) dom.searchInput.addEventListener('input', debouncedFilter);
        if (dom.provinceSelect) dom.provinceSelect.addEventListener('change', applyFilters);
        if (dom.availabilitySelect) dom.availabilitySelect.addEventListener('change', applyFilters);
        if (dom.featuredSelect) dom.featuredSelect.addEventListener('change', applyFilters);
    }

    function applyFilters() {
        if (!state.isDataFetched) return;
        const searchTerm = dom.searchInput ? dom.searchInput.value.toLowerCase().trim() : '';
        const selectedProvince = dom.provinceSelect ? dom.provinceSelect.value : '';
        const selectedAvailability = dom.availabilitySelect ? dom.availabilitySelect.value : '';
        const isFeaturedOnly = dom.featuredSelect ? dom.featuredSelect.value === 'true' : false;

        const filtered = state.allProfiles.filter(p =>
            (!searchTerm || (p.name && p.name.toLowerCase().includes(searchTerm)) || (p.location && p.location.toLowerCase().includes(searchTerm)) || (p.styleTags && p.styleTags.some(t => t.toLowerCase().includes(searchTerm)))) &&
            (!selectedProvince || p.provinceKey === selectedProvince) &&
            (!selectedAvailability || p.availability === selectedAvailability) &&
            (!isFeaturedOnly || p.isfeatured)
        );
        
        const isSearching = searchTerm || selectedProvince || selectedAvailability || isFeaturedOnly;
        renderProfiles(filtered, isSearching);
    }
    
    function renderProfiles(filteredProfiles, isSearching) {
        if (!dom.profilesDisplayArea) return;
        
        hideLoadingState();
        if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
        
        const featuredProfiles = state.allProfiles.filter(p => p.isfeatured);
        if (dom.featuredProfiles && dom.featuredProfilesContainer) {
            if (dom.body.dataset.page === 'home' && !isSearching && featuredProfiles.length > 0) {
                const fragment = document.createDocumentFragment();
                featuredProfiles.slice(0, 4).forEach((p, i) => fragment.appendChild(createProfileCard(p, i, true)));
                dom.featuredProfilesContainer.innerHTML = '';
                dom.featuredProfilesContainer.appendChild(fragment);
                dom.featuredProfiles.classList.remove('hidden');
            } else {
                dom.featuredProfiles.classList.add('hidden');
            }
        }

        dom.profilesDisplayArea.innerHTML = '';

        if (filteredProfiles.length === 0) {
            if (isSearching || dom.body.dataset.page === 'profiles') {
                if (dom.noResultsMessage) dom.noResultsMessage.classList.remove('hidden');
            }
            return;
        }

        if (dom.body.dataset.page === 'profiles' || isSearching) {
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';
            const fragment = document.createDocumentFragment();
            filteredProfiles.forEach((p, i) => fragment.appendChild(createProfileCard(p, i)));
            grid.appendChild(fragment);
            dom.profilesDisplayArea.appendChild(grid);
        } else { // Home page, not searching
            const profilesByProvince = filteredProfiles.reduce((acc, p) => {
                (acc[p.provinceKey] = acc[p.provinceKey] || []).push(p);
                return acc;
            }, {});
            
            const provinceOrder = [...new Set(filteredProfiles.map(p => p.provinceKey))];
            let accumulatedIndex = dom.featuredProfilesContainer ? dom.featuredProfilesContainer.children.length : 0;
            const mainFragment = document.createDocumentFragment();

            provinceOrder.forEach(provinceKey => {
                if (!provinceKey) return;
                const provinceProfiles = profilesByProvince[provinceKey];
                if (!provinceProfiles || provinceProfiles.length === 0) return;

                const provinceName = state.provincesMap.get(provinceKey) || "ไม่ระบุ";
                const section = document.createElement('section');
                section.className = 'province-section';
                section.setAttribute('aria-labelledby', `province-heading-${provinceKey}`);
                
                const grid = document.createElement('div');
                grid.className = 'profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4';
                
                const gridFragment = document.createDocumentFragment();
                provinceProfiles.slice(0, config.PROFILES_PER_PROVINCE_ON_INDEX).forEach(p => {
                    gridFragment.appendChild(createProfileCard(p, accumulatedIndex++));
                });
                grid.appendChild(gridFragment);

                section.innerHTML = `<div class="province-section-header"><h3 id="province-heading-${provinceKey}" class="text-2xl font-bold">${provinceName}</h3><a href="/profiles.html?province=${provinceKey}" class="text-sm font-semibold text-primary hover:underline">ดูทั้งหมด</a></div>`;
                section.appendChild(grid);
                mainFragment.appendChild(section);
            });
            dom.profilesDisplayArea.appendChild(mainFragment);
        }
        initScrollAnimations(dom.profilesDisplayArea);
    }
    
    function createProfileCard(profile, index, isEager = false) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'profile-card-container profile-card-new group cursor-pointer';
        cardContainer.dataset.profileId = profile.id;
        cardContainer.setAttribute('aria-label', `ดูโปรไฟล์ของ ${profile.name}`);
        cardContainer.setAttribute('role', 'button');
        cardContainer.tabIndex = 0;
        cardContainer.dataset.animateOnScroll = '';
    
        const mainImage = profile.images[0];
        const isAboveTheFold = index < config.ABOVE_THE_FOLD_COUNT;
    
        const img = document.createElement('img');
        img.className = "profile-img";
        img.src = mainImage.medium;
        img.srcset = `${mainImage.small} 400w, ${mainImage.medium} 600w`;
        img.sizes = "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw";
        img.alt = profile.altText;
        img.decoding = "async";
        img.width = 300;
        img.height = 400;
    
        if (isAboveTheFold || isEager) {
            img.loading = 'eager';
            img.setAttribute('fetchpriority', 'high');
        } else {
            img.loading = 'lazy';
        }
    
        img.onload = () => img.classList.add('is-loaded');
        img.onerror = () => {
            img.onerror = null;
            img.src = '/images/placeholder-profile.webp';
            img.srcset = '';
            img.classList.add('is-loaded', 'is-error');
        };
    
        const overlay = document.createElement('div');
        overlay.className = 'card-overlay';
    
        let availabilityText = profile.availability || "สอบถามคิว";
        let availabilityClass = 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        if (availabilityText.includes('ว่าง') || availabilityText.includes('รับงาน')) { availabilityClass = 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300'; }
        else if (availabilityText.includes('ไม่ว่าง') || availabilityText.includes('พัก')) { availabilityClass = 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300'; }
    
        const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l2.034 4.192a.75.75 0 00.564.41l4.625.672c.728.106 1.018.995.494 1.503l-3.348 3.263a.75.75 0 00-.215.664l.79 4.607c.124.724-.636 1.285-1.288.941l-4.135-2.174a.75.75 0 00-.696 0l-4.135 2.174c-.652.344-1.412-.217-1.288-.94l.79-4.607a.75.75 0 00-.215-.665L1.15 9.66c-.524-.508-.234-1.397.494-1.503l4.625-.672a.75.75 0 00.564-.41L9.132 2.884z" clip-rule="evenodd" /></svg>`;
        const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.623-.359 1.445-.835 2.13-1.36.712-.549 1.282-1.148 1.655-1.743.372-.596.59-1.28.59-2.002v-1.996a4.504 4.504 0 00-1.272-3.116A4.47 4.47 0 0013.5 4.513V4.5C13.5 3.12 12.38 2 11 2H9c-1.38 0-2.5 1.12-2.5 2.5v.013a4.47 4.47 0 00-1.728 1.388A4.504 4.504 0 003 9.504v1.996c0 .722.218 1.406.59 2.002.373.595.943 1.194 1.655 1.743.685.525 1.507 1.001 2.13 1.36.254.147.468.27.654-.369a5.745 5.745 0 00.28.14l.019.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>`;
    
        overlay.innerHTML = `
        <div class="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
            <span class="${availabilityClass} text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">${availabilityText}</span>
            ${profile.isfeatured ? `<span class="bg-yellow-400 text-black text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">${starIcon}แนะนำ</span>` : ''}
        </div>
        <div class="card-info">
            <h3 class="text-xl lg:text-2xl font-bold truncate">${profile.name}</h3>
            <p class="text-sm flex items-center gap-1.5">${locationIcon} ${state.provincesMap.get(profile.provinceKey) || 'ไม่ระบุ'}</p>
        </div>`;
    
        cardContainer.append(img, overlay);
        return cardContainer;
    }
    
    // --- Interactivity & Components ---

    function initCommonUI() {
        initThemeToggle();
        initMobileMenu();
        initHeaderScrollEffect();
        updateActiveNavLinks();
        if (dom.currentYearDynamic) dom.currentYearDynamic.textContent = new Date().getFullYear();
    }

    function initThemeToggle() {
        const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
        if (!themeToggleBtns.length) return;
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const applyTheme = (theme) => html.classList.toggle('dark', theme === 'dark');
        applyTheme(savedTheme);
        themeToggleBtns.forEach(btn => btn.addEventListener('click', () => {
            const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        }));
    }

    function initMobileMenu() {
        if (!dom.menuToggle) return;
        const openMenu = () => {
            if (state.isMenuOpen) return;
            state.isMenuOpen = true;
            state.lastFocusedElement = document.activeElement;
            dom.menuToggle.setAttribute('aria-expanded', 'true');
            dom.sidebar.classList.remove('translate-x-full');
            dom.menuBackdrop.classList.remove('hidden');
            dom.menuBackdrop.style.opacity = '1';
            dom.body.classList.add('body-no-scroll');
            trapFocus(dom.sidebar);
            setTimeout(() => dom.closeSidebarBtn.focus(), 50);
        };
        const closeMenu = () => {
            if (!state.isMenuOpen) return;
            state.isMenuOpen = false;
            dom.menuToggle.setAttribute('aria-expanded', 'false');
            dom.sidebar.classList.add('translate-x-full');
            dom.menuBackdrop.style.opacity = '0';
            if (!state.isLightboxOpen) {
                dom.body.classList.remove('body-no-scroll');
            }
            setTimeout(() => dom.menuBackdrop.classList.add('hidden'), 300);
            if (state.lastFocusedElement) state.lastFocusedElement.focus();
        };
        dom.menuToggle.addEventListener('click', openMenu);
        dom.closeSidebarBtn.addEventListener('click', closeMenu);
        dom.menuBackdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMenuOpen) closeMenu();
        });
    }

    async function initAgeVerification() {
        if (!dom.ageVerificationOverlay || sessionStorage.getItem('ageVerified') === 'true') return;
        dom.ageVerificationOverlay.classList.remove('hidden');
        await loadAnimationScripts();

        const closeAction = (verified) => {
            if (verified) sessionStorage.setItem('ageVerified', 'true');
            const onComplete = () => {
                dom.ageVerificationOverlay.classList.add('hidden');
                if (!verified) window.history.back();
            };
            if(state.gsap) {
                state.gsap.to(dom.ageVerificationOverlay, { opacity: 0, duration: 0.3, onComplete });
            } else {
                dom.ageVerificationOverlay.style.opacity = '0';
                setTimeout(onComplete, 300);
            }
        };

        if (state.gsap) {
            state.gsap.to(dom.ageVerificationOverlay, { opacity: 1, duration: 0.3 });
        } else {
            dom.ageVerificationOverlay.style.opacity = '1';
        }
        dom.confirmAgeButton.addEventListener('click', () => closeAction(true));
        dom.cancelAgeButton.addEventListener('click', () => closeAction(false));
    }
    
    function initLightbox() {
        if (!dom.lightbox) return;
        const openAction = (triggerElement) => {
            if (state.isLightboxOpen) return;
            const profileId = parseInt(triggerElement.dataset.profileId, 10);
            const profileData = state.allProfiles.find(p => p.id === profileId);
            if (!profileData) return;
            state.isLightboxOpen = true;
            state.lastFocusedElement = triggerElement;
            populateLightbox(profileData);
            dom.lightbox.classList.remove('hidden');
            dom.body.classList.add('body-no-scroll');
            trapFocus(dom.lightbox);
            if(state.gsap) {
                state.gsap.to(dom.lightbox, { opacity: 1, duration: 0.3 });
                state.gsap.fromTo(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
            } else {
                dom.lightbox.style.opacity = '1';
                dom.lightboxContentWrapperEl.style.transform = 'scale(1)';
            }
            setTimeout(() => dom.closeLightboxBtn.focus(), 50);
        };
        const closeAction = () => {
            if (!state.isLightboxOpen) return;
            state.isLightboxOpen = false;
            const onComplete = () => {
                dom.lightbox.classList.add('hidden');
                if (!state.isMenuOpen) {
                    dom.body.classList.remove('body-no-scroll');
                }
                if (state.lastFocusedElement) state.lastFocusedElement.focus();
            };
            if(state.gsap) {
                state.gsap.to(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
                state.gsap.to(dom.lightbox, { opacity: 0, duration: 0.3, onComplete });
            } else {
                dom.lightbox.style.opacity = '0';
                dom.lightboxContentWrapperEl.style.transform = 'scale(0.95)';
                setTimeout(onComplete, 300);
            }
        };
        dom.body.addEventListener('click', e => {
            const trigger = e.target.closest('.profile-card-container');
            if (trigger) { e.preventDefault(); openAction(trigger); }
        });
        dom.body.addEventListener('keydown', e => {
            const trigger = e.target.closest('.profile-card-container');
            if (e.key === 'Enter' && trigger) { e.preventDefault(); openAction(trigger); }
        });
        dom.closeLightboxBtn.addEventListener('click', closeAction);
        dom.lightbox.addEventListener('click', e => { if (e.target === dom.lightbox) closeAction(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.isLightboxOpen) closeAction(); });
    }

    function populateLightbox(profileData) {
        // This is the complete, unabridged population logic from the user's file.
        const headerTitleEl = document.getElementById('lightbox-header-title');
        const heroImageEl = document.getElementById('lightboxHeroImage');
        const nameMainEl = document.getElementById('lightbox-profile-name-main');
        const quoteEl = document.getElementById('lightboxQuote');
        const tagsEl = document.getElementById('lightboxTags');
        const detailsEl = document.getElementById('lightboxDetailsCompact');
        const descriptionEl = document.getElementById('lightboxDescriptionVal');
        const thumbnailStripEl = document.getElementById('lightboxThumbnailStrip');
        const lineLink = document.getElementById('lightboxLineLink');
        const lineLinkText = document.getElementById('lightboxLineLinkText');

        if(headerTitleEl) headerTitleEl.textContent = `โปรไฟล์: ${profileData.name || 'N/A'}`;
        if(nameMainEl) nameMainEl.textContent = profileData.name || 'N/A';
        if(heroImageEl) {
            heroImageEl.src = profileData.images[0]?.large || '/images/placeholder-profile.webp';
            heroImageEl.alt = profileData.altText;
        }
        if(quoteEl) {
            quoteEl.textContent = profileData.quote ? `"${profileData.quote}"` : '';
            quoteEl.style.display = profileData.quote ? 'block' : 'none';
        }
        if(descriptionEl) {
            descriptionEl.innerHTML = '';
            (profileData.description || 'ไม่มีรายละเอียดเพิ่มเติม').split('\n').forEach((line, index, arr) => {
                const span = document.createElement('span');
                span.textContent = line;
                descriptionEl.appendChild(span);
                if (index < arr.length - 1) descriptionEl.appendChild(document.createElement('br'));
            });
        }
        if (thumbnailStripEl) {
            thumbnailStripEl.innerHTML = '';
            const hasGallery = profileData.images.length > 1;
            if (hasGallery) {
                profileData.images.forEach((img, index) => {
                    const thumb = document.createElement('img');
                    thumb.src = img.small;
                    thumb.alt = `รูปตัวอย่าง ${index + 1} ของ ${profileData.name}`;
                    thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                    thumb.addEventListener('click', () => {
                        if (heroImageEl) heroImageEl.src = img.large;
                        thumbnailStripEl.querySelector('.active')?.classList.remove('active');
                        thumb.classList.add('active');
                    });
                    thumbnailStripEl.appendChild(thumb);
                });
            }
            thumbnailStripEl.style.display = hasGallery ? 'flex' : 'none';
        }
        if (tagsEl) {
            tagsEl.innerHTML = '';
            if (profileData.styleTags && profileData.styleTags.length > 0) {
                profileData.styleTags.forEach(tag => {
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
        if (detailsEl) {
            let availabilityText = profileData.availability || "สอบถามคิว";
            let availabilityClass = 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            if (availabilityText.includes('ว่าง') || availabilityText.includes('รับงาน')) { availabilityClass = 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300'; } 
            else if (availabilityText.includes('ไม่ว่าง') || availabilityText.includes('พัก')) { availabilityClass = 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300'; }
            detailsEl.innerHTML = `
                <div class="availability-badge ${availabilityClass}">${availabilityText}</div>
                <div class="stats-grid">
                    <div class="stat-item"><div class="label">อายุ</div><div class="value">${profileData.age || '-'} ปี</div></div>
                    <div class="stat-item"><div class="label">สัดส่วน</div><div class="value">${profileData.stats || '-'}</div></div>
                    <div class="stat-item"><div class="label">สูง/หนัก</div><div class="value">${profileData.height || '-'}/${profileData.weight || '-'}</div></div>
                </div>
                <dl class="space-y-2 text-sm">
                    <div class="detail-list-item"><dt class="flex-shrink-0"><i class="fas fa-palette w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt><dd class="value">ผิว: ${profileData.skinTone || '-'}</dd></div>
                    <div class="detail-list-item"><dt class="flex-shrink-0"><i class="fas fa-map-marker-alt w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt><dd class="value">จังหวัด: ${state.provincesMap.get(profileData.provinceKey) || ''} (${profileData.location || 'ไม่ระบุ'})</dd></div>
                    <div class="detail-list-item"><dt class="flex-shrink-0"><i class="fas fa-money-bill-wave w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt><dd class="value">เรท: ${profileData.rate || 'สอบถาม'}</dd></div>
                </dl>
            `;
        }
        if (lineLink && lineLinkText) {
            if (profileData.lineId) {
                lineLink.href = profileData.lineId.startsWith('http') ? profileData.lineId : `https://line.me/ti/p/${profileData.lineId}`;
                lineLink.target = '_blank';
                lineLink.rel = 'noopener noreferrer nofollow ugc';
                lineLink.style.display = 'inline-flex';
                lineLinkText.textContent = `ติดต่อ ${profileData.name} ผ่าน LINE`;
            } else {
                lineLink.style.display = 'none';
            }
        }
    }

    async function initScrollAnimations(context = document) {
        if (!state.gsap) await loadAnimationScripts();
        if (!state.gsap) return;

        state.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        state.ScrollTrigger.refresh();

        const animatedElements = context.querySelectorAll('[data-animate-on-scroll]');
        animatedElements.forEach(el => {
            state.gsap.from(el, {
                scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" },
                opacity: 0, y: 30, duration: 0.6, ease: "power2.out",
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
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- UTILITIES ---

    function updateActiveNavLinks() {
        const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
        document.querySelectorAll('#sidebar nav a, header nav a').forEach(link => {
            try {
                const linkPath = new URL(link.href).pathname.replace(/\/$/, "") || "/";
                link.classList.toggle('active-nav-link', linkPath === currentPath);
            } catch (e) { /* ignore invalid hrefs */ }
        });
    }

    function trapFocus(container) {
        const focusable = Array.from(container.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const onKeydown = e => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey && document.activeElement === first) {
                last.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        };
        container.addEventListener('keydown', onKeydown);
    }
    
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function generateFullSchema() {
        // This is the complete, unabridged schema generation logic from the user's file.
        const pageTitle = document.title;
        const canonicalUrl = document.querySelector("link[rel='canonical']")?.href || window.location.href;
        const siteUrl = "https://sidelinechiangmai.netlify.app/";
        const orgName = "SidelineChiangmai - รับงาน ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก";
        const mainSchema = {"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":`${siteUrl}#organization`,"name":orgName,"url":siteUrl,"logo":{"@type":"ImageObject","url":`${siteUrl}images/logo-sideline-chiangmai.webp`,"width":245,"height":30},"contactPoint":{"@type":"ContactPoint","contactType":"customer support","url":"https://line.me/ti/p/_faNcjQ3xx"}},{"@type":"WebSite","@id":`${siteUrl}#website`,"url":siteUrl,"name":orgName,"description":"รวมโปรไฟล์ไซด์ไลน์เชียงใหม่, ลำปาง, เชียงราย คุณภาพ บริการฟีลแฟน การันตีตรงปก 100% ปลอดภัย ไม่ต้องมัดจำ","publisher":{"@id":`${siteUrl}#organization`},"inLanguage":"th-TH"},{"@type":"WebPage","@id":`${canonicalUrl}#webpage`,"url":canonicalUrl,"name":pageTitle,"isPartOf":{"@id":`${siteUrl}#website`},"primaryImageOfPage":{"@type":"ImageObject","url":`${siteUrl}images/sideline-chiangmai-social-preview.webp`},"breadcrumb":{"@id":`${canonicalUrl}#breadcrumb`}},{"@type":"LocalBusiness","@id":`${siteUrl}#localbusiness`,"name":"SidelineChiangmai - ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก","image":`${siteUrl}images/sideline-chiangmai-social-preview.webp`,"url":siteUrl,"priceRange":"฿฿","address":{"@type":"PostalAddress","streetAddress":"เจ็ดยอด","addressLocality":"ช้างเผือก","addressRegion":"เชียงใหม่","postalCode":"50300","addressCountry":"TH"},"geo":{"@type":"GeoCoordinates","latitude":"18.814361","longitude":"98.972389"},"hasMap":"https://maps.app.goo.gl/3y8gyAtamm8YSagi9","openingHours":["Mo-Su 00:00-24:00"],"areaServed":[{"@type":"City","name":"Chiang Mai"},{"@type":"City","name":" Lampang"},{"@type":"City","name":"Chiang Rai"}]},{"@type":"BreadcrumbList","@id":`${canonicalUrl}#breadcrumb`,"itemListElement":[{"@type":"ListItem","position":1,"name":"หน้าแรก","item":siteUrl}]},{"@type":"FAQPage","@id":`${siteUrl}faq.html#faq`,"mainEntity":[{"@type":"Question","name":"บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?","acceptedAnswer":{"@type":"Answer","text":"Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้าทุกท่าน ข้อมูลการติดต่อและการจองของท่านจะถูกเก็บรักษาเป็นความลับอย่างเข้มงวด"}},{"@type":"Question","name":"จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการไซด์ไลน์หรือไม่?","acceptedAnswer":{"@type":"Answer","text":"เพื่อความสบายใจของลูกค้าทุกท่าน ท่านไม่จำเป็นต้องโอนเงินมัดจำใดๆ ทั้งสิ้น สามารถชำระค่าบริการเต็มจำนวนโดยตรงกับน้องๆ ที่หน้างานได้เลย"}},{"@type":"Question","name":"น้องๆ ไซด์ไลน์เชียงใหม่ตรงปกตามรูปที่แสดงในโปรไฟล์จริงหรือ?","acceptedAnswer":{"@type":"Answer","text":"เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพของน้องๆ ทุกคนอย่างละเอียด Sideline Chiang Mai กล้าการันตีว่าน้องๆ ตรงปก 100% หากพบปัญหาใดๆ สามารถแจ้งทีมงานเพื่อดำเนินการแก้ไขได้ทันที"}}]}]};
        const oldSchema = document.querySelector('script[type="application/ld+json"]');
        if (oldSchema) oldSchema.remove();
        const schemaEl = document.createElement('script');
        schemaEl.type = 'application/ld+json';
        schemaEl.textContent = JSON.stringify(mainSchema);
        document.head.appendChild(schemaEl);
    }
    
    // --- Application Entry Point ---
    // Using 'load' ensures all assets are ready, preventing layout shifts.
    window.addEventListener('load', initializeApp);

})();