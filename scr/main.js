// =================================================================================
//  main.js (DEFINITIVE FINAL VERSION - CORRECTED & STABLE)
//
//  VERSION: 10.2 "Stable & Corrected Imports"
//
//  - CRITICAL JS FIX: Supabase is now loaded via a standard <script> tag in index.html, creating a global `supabase` object. This file now correctly uses that global object (`const { createClient } = supabase`), resolving the fatal "does not provide an export" error.
//  - CRITICAL JS FIX: Corrected GSAP ScrollTrigger import. It's a bare import for side effects.
//  - SECURITY: Supabase keys are correctly loaded from environment variables.
// =================================================================================

// GSAP modules are correctly imported as ES Modules
import { gsap } from '/libs/gsap.min.js';
import '/libs/ScrollTrigger.min.js';

(function() {
    'use strict';

    // ** MAJOR FIX HERE **
    // We access `createClient` from the global `supabase` object
    // that was loaded by the <script> tag in index.html.
    const { createClient } = supabase;

    class SidelineWebApp {
        // --- 1. INITIALIZATION & CONFIGURATION ---
        constructor() {
            // CRITICAL SECURITY FIX: Load keys from environment variables.
            const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
            const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
            
            if (!SUPABASE_URL || !SUPABASE_KEY) {
                console.error("FATAL: Supabase URL or Key is not defined in environment variables.");
                document.body.innerHTML = '<div style="padding: 2rem; text-align: center;"><h1>Configuration Error</h1><p>The application could not be loaded due to a configuration error. Please contact support.</p></div>';
            }

            this.CONFIG = {
                SUPABASE_URL,
                SUPABASE_KEY,
                STORAGE_BUCKET: 'profile-images',
                PROFILES_PER_PROVINCE_ON_INDEX: 8,
                SKELETON_COUNT: 8,
                DEBOUNCE_DELAY: 350,
                PLACEHOLDER_IMAGE: '/images/placeholder-profile.webp'
            };

            this.dom = {};
            this.state = {
                supabase: null,
                gsap: gsap,
                allProfiles: [],
                provincesMap: new Map(),
                filteredProfiles: [],
                lastFocusedElement: null,
                isMenuOpen: false,
                isLightboxOpen: false,
                isFetching: false,
                isAgeVerified: sessionStorage.getItem('ageVerified') === 'true',
                currentLightboxProfileId: null,
                currentPage: 'home'
            };

            Object.getOwnPropertyNames(Object.getPrototypeOf(this))
                .filter(prop => typeof this[prop] === 'function' && prop.startsWith('handle'))
                .forEach(method => { this[method] = this[method].bind(this); });

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.init.bind(this));
            } else {
                this.init();
            }
        }

        async init() {
            try {
                this.cacheDOMElements();
                if (!this.dom.body) throw new Error("CRITICAL: <body> element not found.");
                
                this.state.currentPage = this.dom.body.dataset.page || 'home';
                
                this.initImmediateUI();
                await this.initCoreLogic();
            } catch (error) {
                console.error("FATAL: App initialization failed:", error);
                this.showContentState('error');
            }
        }
        
        initImmediateUI() {
            if(this.dom.yearSpan) this.dom.yearSpan.textContent = new Date().getFullYear();
            this.dom.body.classList.add('js-loaded');
            this.initThemeToggle();
            this.initMobileMenu();
            this.initHeaderScrollEffect();
            this.initBackToTop();
        }

        async initCoreLogic() {
            await this.initAgeVerification();
            
            this.showContentState('loading');
            
            if (!this.CONFIG.SUPABASE_URL || !this.CONFIG.SUPABASE_KEY || typeof createClient !== 'function') {
                 console.error("Supabase client is not available.");
                 this.showContentState('error');
                 return;
            }
            this.state.supabase = createClient(this.CONFIG.SUPABASE_URL, this.CONFIG.SUPABASE_KEY);
            
            gsap.registerPlugin(ScrollTrigger);
            
            const success = await this.fetchData();
            
            if (success) {
                this.initFilters();
                this.initLightbox();
                this.applyFiltersFromURL();
                this.initScrollAnimations();
                this.init3DCardEffect();
                this.generateFullSchema();
            } else {
                this.showContentState('error');
            }
        }
        
        cacheDOMElements() {
            const selectors = {
                body: document.body,
                yearSpan: '#currentYearDynamic',
                pageHeader: '#page-header',
                profilesContentArea: '#profiles-content-area',
                filterForm: '#filter-form',
                filterKeyword: '#filter-keyword',
                filterProvince: '#filter-province',
                filterRating: '#filter-rating',
                resetFiltersBtn: '#reset-filters-btn',
                menuToggle: '#menu-toggle',
                sidebar: '#sidebar',
                closeSidebarBtn: '#close-sidebar-btn',
                backdrop: '#menu-backdrop',
                ageVerificationOverlay: '#age-verification-overlay',
                confirmAgeButton: '#confirmAgeButton',
                cancelAgeButton: '#cancelAgeButton',
                lightbox: '#lightbox',
                closeLightboxBtn: '#closeLightboxBtn',
                lightboxHeaderTitle: '#lightbox-header-title',
                lightboxHeroImage: '#lightboxHeroImage',
                lightboxProfileName: '#lightbox-profile-name-main',
                lightboxQuote: '#lightboxQuote',
                lightboxTags: '#lightboxTags',
                lightboxDetails: '#lightboxDetailsCompact',
                lightboxDescription: '#lightboxDescriptionVal',
                lightboxLineLink: '#lightboxLineLink',
                lightboxLineLinkText: '#lightboxLineLinkText',
                lightboxPrevBtn: '#lightbox-prev-btn',
                lightboxNextBtn: '#lightbox-next-btn',
                lightboxThumbnailStrip: '#lightboxThumbnailStrip',
                backToTopBtn: document.getElementById('back-to-top'),
                noResultsMessage: '#no-results-message',
                fetchErrorMessage: '#fetch-error-message'
            };
            for (const key in selectors) {
                const element = document.querySelector(selectors[key]);
                if (element) {
                    this.dom[key] = element;
                }
            }
        }

        initFilters() {
            if (!this.dom.filterForm) return;
            const debouncedFilter = this.debounce(this.handleFilterChange, this.CONFIG.DEBOUNCE_DELAY);
            this.dom.filterForm.addEventListener('input', debouncedFilter);
            this.dom.filterForm.addEventListener('submit', (e) => e.preventDefault());
            this.dom.filterForm.addEventListener('reset', this.handleFilterReset);
        }
        
        initLightbox() {
            if (!this.dom.lightbox) return;
            this.dom.body.addEventListener('click', this.handleLightboxInteraction);
            document.addEventListener('keydown', this.handleGlobalKeydown);
        }

        initMobileMenu() {
            if (!this.dom.menuToggle || !this.dom.sidebar) return;
            [this.dom.menuToggle, this.dom.closeSidebarBtn, this.dom.backdrop].forEach(el => {
                el?.addEventListener('click', this.handleMobileMenuInteraction);
            });
            document.addEventListener('keydown', this.handleGlobalKeydown);
            this.updateSidebarFocusability(false);
        }

        async fetchData() {
            if (this.state.isFetching) return false;
            this.state.isFetching = true;
            try {
                const [profilesRes, provincesRes] = await Promise.all([
                    this.state.supabase.from('profiles').select('*').order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false }),
                    this.state.supabase.from('provinces').select('*').order('nameThai', { ascending: true })
                ]);
                if (profilesRes.error) throw new Error(`Supabase profiles error: ${profilesRes.error.message}`);
                if (provincesRes.error) throw new Error(`Supabase provinces error: ${provincesRes.error.message}`);

                this.state.provincesMap = new Map(provincesRes.data.map(p => [p.key, p.nameThai]));
                this.state.allProfiles = (profilesRes.data || []).map(p => this.processProfileData(p));
                
                this.populateProvinceFilter();
                return true;
            } catch (error) {
                console.error('CRITICAL: Supabase fetch error:', error);
                return false;
            } finally {
                this.state.isFetching = false;
            }
        }
        
        processProfileData(p) {
            const allImagePaths = [p.imagePath, ...(p.galleryPaths || [])].filter(Boolean);
            const images = allImagePaths.map(path => {
                const { data: { publicUrl } } = this.state.supabase.storage.from(this.CONFIG.STORAGE_BUCKET).getPublicUrl(path);
                return publicUrl;
            });
            if (images.length === 0) images.push(this.CONFIG.PLACEHOLDER_IMAGE);
            
            return {
                ...p,
                images,
                searchable: `${p.name || ''} ${p.styleTags?.join(' ') || ''} ${this.state.provincesMap.get(p.provinceKey) || ''}`.toLowerCase(),
                altText: p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name} จังหวัด ${this.state.provincesMap.get(p.provinceKey) || 'ไม่ระบุ'}`
            };
        }

        getProfileById(id) {
            return this.state.allProfiles.find(p => p.id === id);
        }
        
        applyFiltersFromURL() {
            const params = new URLSearchParams(window.location.search);
            if (this.dom.filterKeyword) this.dom.filterKeyword.value = params.get('q') || '';
            if (this.dom.filterProvince) this.dom.filterProvince.value = params.get('province') || '';
            if (this.dom.filterRating) this.dom.filterRating.value = params.get('rating') || '';
            this.applyFiltersFromForm();
        }

        applyFiltersFromForm() {
            const keyword = this.dom.filterKeyword?.value.toLowerCase().trim() ?? '';
            const province = this.dom.filterProvince?.value ?? '';
            const rating = parseInt(this.dom.filterRating?.value, 10) || 0;
            
            this.updateURL(keyword, province, rating);

            this.state.filteredProfiles = this.state.allProfiles.filter(p =>
                (!keyword || p.searchable.includes(keyword)) &&
                (!province || p.provinceKey === province) &&
                (!rating || (p.rating && p.rating >= rating))
            );
            this.render();
        }

        updateURL(keyword, province, rating) {
            const params = new URLSearchParams();
            if (keyword) params.set('q', keyword);
            if (province) params.set('province', province);
            if (rating) params.set('rating', String(rating));
            const newUrl = `${window.location.pathname}${params.toString() ? '?' : ''}${params.toString()}`;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }
        
        render() {
            if (!this.dom.profilesContentArea) return;
            
            Array.from(this.dom.profilesContentArea.children).forEach(child => {
                if (!child.id.endsWith('-message')) {
                    child.remove();
                }
            });

            if (this.state.allProfiles.length > 0 && this.state.filteredProfiles.length === 0) {
                 this.showContentState('empty');
                 return;
            }
            
            this.showContentState('success');
            
            const byProvince = this.state.filteredProfiles.reduce((acc, p) => {
                (acc[p.provinceKey] = acc[p.provinceKey] || []).push(p);
                return acc;
            }, {});
            
            const provinceOrder = [...this.state.provincesMap.keys()].filter(key => byProvince[key]);
            const fragment = document.createDocumentFragment();
            provinceOrder.forEach(key => {
                fragment.appendChild(
                    this.createSectionHTML(key, this.state.provincesMap.get(key) || 'ไม่ระบุ', byProvince[key])
                );
            });
            this.dom.profilesContentArea.appendChild(fragment);
            
            this.initScrollAnimations(this.dom.profilesContentArea);
        }
        
        showContentState(state) {
            const messageElements = { empty: this.dom.noResultsMessage, error: this.dom.fetchErrorMessage };
            Object.values(messageElements).forEach(el => el?.classList.add('hidden'));

            if (state === 'loading') {
                if (!this.dom.profilesContentArea) return;
                const skeletonContainer = document.createElement('div');
                skeletonContainer.className = 'profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4';
                skeletonContainer.innerHTML = Array(this.CONFIG.SKELETON_COUNT).fill(this.createSkeletonCardHTML()).join('');
                this.dom.profilesContentArea.innerHTML = ''; 
                this.dom.profilesContentArea.appendChild(skeletonContainer);
                Object.values(messageElements).forEach(el => el && this.dom.profilesContentArea.appendChild(el));
            } else if (messageElements[state]) {
                const skeletonGrid = this.dom.profilesContentArea.querySelector('.profile-grid');
                if (skeletonGrid) skeletonGrid.remove();
                messageElements[state].classList.remove('hidden');
            } else if (state === 'success') {
                const skeletonGrid = this.dom.profilesContentArea.querySelector('.profile-grid');
                if (skeletonGrid) skeletonGrid.remove();
            }
        }
        
        createSectionHTML(id, title, profiles) {
            const section = document.createElement('section');
            section.className = 'province-section space-y-6';
            
            const initialLimit = this.CONFIG.PROFILES_PER_PROVINCE_ON_INDEX;
            const gridContainer = document.createElement('div');
            gridContainer.className = 'profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4';
            gridContainer.dataset.provinceGrid = id;
            profiles.slice(0, initialLimit).forEach(p => gridContainer.appendChild(this.createCardHTML(p)));

            section.innerHTML = `
                <div class="province-section-header flex justify-between items-baseline">
                    <h2 id="province-heading-${id}" class="text-2xl font-bold">${title}</h2>
                    ${profiles.length > 0 ? `<a href="/profiles.html?province=${id}" class="text-sm font-semibold text-primary hover:underline">ดูทั้งหมด (${profiles.length})</a>` : ''}
                </div>`;
            section.appendChild(gridContainer);
            
            return section;
        }

        createCardHTML(profile) {
            const card = document.createElement('div');
            card.className = 'profile-card-new group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg';
            card.dataset.profileId = profile.id;
            card.setAttribute('role', 'button');
            card.tabIndex = 0;
            
            const mainImage = profile.images[0] || this.CONFIG.PLACEHOLDER_IMAGE;
            const img = document.createElement('img');
            img.src = `${mainImage}?width=600&quality=80`;
            img.srcset = `${mainImage}?width=400&quality=80 400w, ${mainImage}?width=600&quality=80 600w`;
            img.sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";
            img.alt = profile.altText;
            img.className = "card-image w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110";
            img.decoding = "async";
            img.loading = "lazy";
            img.onerror = () => { img.onerror = null; img.src = this.CONFIG.PLACEHOLDER_IMAGE; img.srcset = ''; };
            
            card.innerHTML = `
                <div class="relative">
                    <div class="overflow-hidden rounded-lg aspect-[3/4] bg-accent">
                        ${img.outerHTML}
                    </div>
                    <div class="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
                        <span class="${this.getAvailabilityClass(profile.availability)} text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">${profile.availability || "สอบถามคิว"}</span>
                        ${profile.isfeatured ? `<span class="bg-yellow-400 text-black text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg"><i class="fas fa-star w-3 h-3"></i>แนะนำ</span>` : ''}
                    </div>
                </div>
                <div class="mt-3">
                    <h3 class="font-bold text-lg truncate text-card-foreground">${profile.name}</h3>
                    <p class="text-sm text-muted-foreground flex items-center gap-1.5"><i class="fas fa-map-marker-alt text-xs"></i> ${this.state.provincesMap.get(profile.provinceKey) || 'ไม่ระบุ'}</p>
                </div>
            `;
            return card;
        }

        createSkeletonCardHTML() {
            return `
                <div class="skeleton-card">
                    <div class="skeleton-img"></div>
                    <div class="space-y-2 px-1 pt-1">
                        <div class="skeleton-text w-3/4"></div>
                        <div class="skeleton-text-sm w-1/2"></div>
                    </div>
                </div>
            `;
        }

        getAvailabilityClass(availability) {
            const text = availability || "";
            if (text.includes('ว่าง')) return 'bg-green-200 text-green-800';
            if (text.includes('ไม่ว่าง')) return 'bg-red-200 text-red-800';
            return 'bg-yellow-200 text-yellow-800';
        }

        async initAgeVerification() {
            if (this.state.isAgeVerified || !this.dom.ageVerificationOverlay) {
                this.dom.ageVerificationOverlay?.remove();
                return;
            }

            return new Promise(resolve => {
                const overlay = this.dom.ageVerificationOverlay;
                overlay.style.display = 'flex';
                this.toggleBodyModalOpen(true);
                
                const modalContent = overlay.querySelector('.age-modal-content');
                
                gsap.to(overlay, { opacity: 1, duration: 0.3 });
                gsap.from(modalContent, { scale: 0.9, opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 });

                const close = (verified) => {
                    this.dom.confirmAgeButton.removeEventListener('click', confirmHandler);
                    this.dom.cancelAgeButton.removeEventListener('click', cancelHandler);

                    const onComplete = () => {
                        this.toggleBodyModalOpen(false);
                        if (verified) {
                            sessionStorage.setItem('ageVerified', 'true');
                            this.state.isAgeVerified = true;
                            overlay.remove();
                            resolve(); 
                        } else {
                            overlay.innerHTML = `<div class="age-modal-content"><p class="text-lg">ขออภัย, คุณต้องมีอายุ 20 ปีขึ้นไปเพื่อเข้าใช้งาน</p></div>`;
                            setTimeout(() => window.location.href = 'about:blank', 2000);
                        }
                    };
                    gsap.to(overlay, { opacity: 0, duration: 0.3, onComplete });
                };

                const confirmHandler = () => close(true);
                const cancelHandler = () => close(false);

                this.dom.confirmAgeButton.addEventListener('click', confirmHandler, { once: true });
                this.dom.cancelAgeButton.addEventListener('click', cancelHandler, { once: true });
            });
        }
        
        openLightbox(triggerElement) {
            if (this.state.isLightboxOpen) return;
            const profileId = parseInt(triggerElement.dataset.profileId, 10);
            const profileData = this.getProfileById(profileId);
            if (!profileData) return;

            this.state.isLightboxOpen = true;
            this.state.lastFocusedElement = triggerElement;
            this.state.currentLightboxProfileId = profileId;
            
            this.toggleBodyModalOpen(true);
            this.dom.lightbox.style.display = 'flex';
            this.populateLightbox(profileData, 0);
            
            gsap.to(this.dom.lightbox, { opacity: 1, duration: 0.3 });
            setTimeout(() => this.dom.closeLightboxBtn?.focus(), 50);
        }

        closeLightbox() {
            if (!this.state.isLightboxOpen) return;
            this.state.isLightboxOpen = false;
            
            gsap.to(this.dom.lightbox, { 
                opacity: 0, 
                duration: 0.3, 
                onComplete: () => {
                    this.dom.lightbox.style.display = 'none';
                    this.toggleBodyModalOpen(false);
                    this.state.lastFocusedElement?.focus();
                    this.state.currentLightboxProfileId = null;
                }
            });
        }

        openMobileMenu() {
            if (this.state.isMenuOpen) return;
            this.state.isMenuOpen = true;
            this.state.lastFocusedElement = document.activeElement;

            this.toggleBodyModalOpen(true);
            this.dom.backdrop.style.display = 'block';
            this.dom.sidebar.setAttribute('aria-hidden', 'false');
            this.updateSidebarFocusability(true);

            gsap.to(this.dom.backdrop, { opacity: 1, duration: 0.3 });
            gsap.to(this.dom.sidebar, { x: 0, duration: 0.3, ease: 'power2.out' });
            setTimeout(() => this.dom.closeSidebarBtn?.focus(), 50);
        }

        closeMobileMenu() {
            if (!this.state.isMenuOpen) return;
            this.state.isMenuOpen = false;
            
            this.dom.sidebar.setAttribute('aria-hidden', 'true');
            this.updateSidebarFocusability(false);
            
            gsap.to(this.dom.backdrop, { 
                opacity: 0, 
                duration: 0.3,
                onComplete: () => this.dom.backdrop.style.display = 'none'
            });
            gsap.to(this.dom.sidebar, { 
                x: '100%', 
                duration: 0.3, 
                ease: 'power2.in',
                onComplete: () => {
                    this.toggleBodyModalOpen(false);
                    this.state.lastFocusedElement?.focus();
                }
            });
        }
        
        updateSidebarFocusability(isFocusable) {
            if (!this.dom.sidebar) return;
            const focusableElements = this.dom.sidebar.querySelectorAll('a[href], button');
            focusableElements.forEach(el => el.tabIndex = isFocusable ? 0 : -1);
        }

        toggleBodyModalOpen(isOpen) {
            this.dom.body.classList.toggle('is-modal-open', isOpen);
        }

        init3DCardEffect() {
            const container = this.dom.profilesContentArea;
            if (!container || window.matchMedia('(pointer: coarse)').matches) return;

            container.addEventListener('mousemove', (e) => {
                const card = e.target.closest('.profile-card-new');
                if (!card) return;

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y / rect.height - 0.5) * -15;
                const rotateY = (x / rect.width - 0.5) * 15;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    scale: 1.03,
                    duration: 0.7,
                    ease: 'power3.out'
                });
            });

            container.addEventListener('mouseleave', () => {
                const cards = container.querySelectorAll('.profile-card-new');
                gsap.to(cards, {
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        }
        
        debounce(func, delay) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        }

        handleFilterChange() { this.applyFiltersFromForm(); }
        
        handleFilterReset(event) {
            event.preventDefault();
            if (this.dom.filterForm) {
                this.dom.filterForm.reset();
                this.applyFiltersFromForm();
            }
        }
        
        handleLightboxInteraction(event) {
            const cardTrigger = event.target.closest('.profile-card-new');
            if (cardTrigger) {
                event.preventDefault();
                this.openLightbox(cardTrigger);
            }
            if (event.target === this.dom.lightbox || event.target.closest('#closeLightboxBtn')) {
                this.closeLightbox();
            }
            const thumb = event.target.closest('.thumbnail');
            if (thumb) {
                const profile = this.getProfileById(this.state.currentLightboxProfileId);
                const heroImg = this.dom.lightbox.querySelector('#lightboxHeroImage');
                if(profile && heroImg){
                    heroImg.src = profile.images[parseInt(thumb.dataset.index)] + '?width=800';
                    this.dom.lightbox.querySelector('.thumbnail.active')?.classList.remove('active');
                    thumb.classList.add('active');
                }
            }
        }
        
        handleMobileMenuInteraction() {
            if (this.state.isMenuOpen) this.closeMobileMenu(); else this.openMobileMenu();
        }

        handleGlobalKeydown(event) {
            if (event.key === 'Escape') {
                if (this.state.isLightboxOpen) this.closeLightbox();
                else if (this.state.isMenuOpen) this.closeMobileMenu();
            }
            if (this.state.isLightboxOpen) {
                if (event.key === 'ArrowRight') this.navigateLightbox(1);
                if (event.key === 'ArrowLeft') this.navigateLightbox(-1);
            }
        }

        initThemeToggle() {
            const themeToggleBtn = document.querySelector('.theme-toggle-btn');
            if (!themeToggleBtn) return;
            const html = document.documentElement;
            const applyTheme = (theme) => {
                html.classList.toggle('dark', theme === 'dark');
            };
            const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            applyTheme(savedTheme);
            themeToggleBtn.addEventListener('click', () => {
                const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
                applyTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }

        initHeaderScrollEffect() {
            if (!this.dom.pageHeader) return;
            let isTicking = false;
            window.addEventListener('scroll', () => {
                if (!isTicking) {
                    window.requestAnimationFrame(() => {
                        this.dom.pageHeader.classList.toggle('scrolled', window.scrollY > 20);
                        isTicking = false;
                    });
                    isTicking = true;
                }
            }, { passive: true });
        }
        
        initBackToTop() {
            if (!this.dom.backToTopBtn) return;
            window.addEventListener('scroll', () => {
                const shouldBeVisible = window.scrollY > 400;
                this.dom.backToTopBtn.classList.toggle('opacity-100', shouldBeVisible);
                this.dom.backToTopBtn.classList.toggle('pointer-events-auto', shouldBeVisible);
            }, { passive: true });
            this.dom.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        initScrollAnimations(context = document) {
            if (!this.state.gsap) return;
            const cards = context.querySelectorAll('.profile-card-new');
            cards.forEach(card => {
                gsap.from(card, {
                    opacity: 0,
                    y: 50,
                    duration: 0.5,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                });
            });
        }

        populateProvinceFilter() {
            if (!this.dom.filterProvince) return;
            const fragment = document.createDocumentFragment();
            this.state.provincesMap.forEach((name, key) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = name;
                fragment.appendChild(option);
            });
            this.dom.filterProvince.appendChild(fragment);
        }

        populateLightbox(profileData, imageIndex = 0) {
            if (!profileData || !this.dom.lightbox) return;
            const { name, images, quote, styleTags, description, lineId, age, stats, height, weight, skinTone, provinceKey, rate } = profileData;

            this.dom.lightboxHeaderTitle.textContent = `โปรไฟล์: ${name || 'N/A'}`;
            if(this.dom.lightboxProfileName) this.dom.lightboxProfileName.textContent = name || 'N/A';
            if(this.dom.lightboxHeroImage) {
                this.dom.lightboxHeroImage.src = images[imageIndex] ? `${images[imageIndex]}?width=800` : this.CONFIG.PLACEHOLDER_IMAGE;
                this.dom.lightboxHeroImage.alt = profileData.altText;
            }
            if(this.dom.lightboxQuote) {
                this.dom.lightboxQuote.textContent = quote ? `"${quote}"` : '';
                this.dom.lightboxQuote.style.display = quote ? 'block' : 'none';
            }
            if(this.dom.lightboxDescription) this.dom.lightboxDescription.innerHTML = description ? description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม';
            
            if(this.dom.lightboxTags) {
                this.dom.lightboxTags.innerHTML = styleTags?.map(tag => `<span class="bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full">${tag}</span>`).join('') || '';
                this.dom.lightboxTags.style.display = styleTags?.length > 0 ? 'flex' : 'none';
            }
            
            if(this.dom.lightboxDetails) {
                 this.dom.lightboxDetails.innerHTML = `
                    <div class="stat-item"><div class="label">อายุ</div><div class="value">${age || '-'} ปี</div></div>
                    <div class="stat-item"><div class="label">สัดส่วน</div><div class="value">${stats || '-'}</div></div>
                    <div class="stat-item"><div class="label">สูง/หนัก</div><div class="value">${height || '-'}/${weight || '-'}</div></div>
                    <div class="stat-item"><div class="label">ผิว</div><div class="value">${skinTone || '-'}</div></div>
                    <div class="stat-item"><div class="label">จังหวัด</div><div class="value">${this.state.provincesMap.get(provinceKey) || '-'}</div></div>
                    <div class="stat-item"><div class="label">เรท</div><div class="value">${rate || 'สอบถาม'}</div></div>
                 `;
            }
            
            if(this.dom.lightboxLineLink) {
                 this.dom.lightboxLineLink.href = lineId ? (lineId.startsWith('http') ? lineId : `https://line.me/ti/p/${lineId}`) : '#';
                 if(this.dom.lightboxLineLinkText) this.dom.lightboxLineLinkText.textContent = `ติดต่อ ${name} ผ่าน LINE`;
            }
            
            if(this.dom.lightboxThumbnailStrip) {
                this.dom.lightboxThumbnailStrip.innerHTML = images.map((img, idx) =>
                    `<button class="thumbnail ${idx === imageIndex ? 'active' : ''}" data-index="${idx}" aria-label="รูปที่ ${idx + 1}">
                        <img src="${img}?width=100&quality=75" alt="Thumbnail ${idx + 1}" width="60" height="80" loading="lazy" decoding="async">
                    </button>`
                ).join('');
            }
            
            if (this.dom.lightboxPrevBtn) this.dom.lightboxPrevBtn.disabled = imageIndex === 0;
            if (this.dom.lightboxNextBtn) this.dom.lightboxNextBtn.disabled = imageIndex >= images.length - 1;
        }

        navigateLightbox(direction) {
            if (!this.state.isLightboxOpen) return;
            const profile = this.getProfileById(this.state.currentLightboxProfileId);
            if (!profile || profile.images.length <= 1) return;
            
            const currentImageSrc = this.dom.lightboxHeroImage.src.split('?')[0];
            const currentIndex = profile.images.findIndex(img => img === currentImageSrc);
            
            let newIndex = currentIndex + direction;
            if (newIndex < 0) newIndex = 0;
            if (newIndex >= profile.images.length) newIndex = profile.images.length - 1;

            if (newIndex !== currentIndex) {
                this.populateLightbox(profile, newIndex);
            }
        }
        
        generateFullSchema() {
            const pageTitle = document.title;
            const canonicalUrl = document.querySelector("link[rel='canonical']")?.href || window.location.href;
            const siteUrl = "https://sidelinechiangmai.netlify.app/";
            const orgName = "Sideline Chiangmai - รับงาน ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก";
            const mainSchema = {
                "@context": "https://schema.org",
                "@graph": [{"@type":"Organization","@id":`${siteUrl}#organization`,"name":orgName,"url":siteUrl,"logo":{"@type":"ImageObject","url":`${siteUrl}images/logo-sideline-chiangmai.webp`,"width":164,"height":40},"contactPoint":{"@type":"ContactPoint","contactType":"customer support","url":"https://line.me/ti/p/_faNcjQ3xx"}},{"@type":"WebSite","@id":`${siteUrl}#website`,"url":siteUrl,"name":orgName,"description":"รวมโปรไฟล์ไซด์ไลน์เชียงใหม่, ลำปาง, เชียงราย คุณภาพ บริการฟีลแฟน การันตีตรงปก 100% ปลอดภัย ไม่ต้องมัดจำ","publisher":{"@id":`${siteUrl}#organization`},"inLanguage":"th-TH"},{"@type":"WebPage","@id":`${canonicalUrl}#webpage`,"url":canonicalUrl,"name":pageTitle,"isPartOf":{"@id":`${siteUrl}#website`},"primaryImageOfPage":{"@type":"ImageObject","url":`${siteUrl}images/sideline-chiangmai-social-preview.webp`},"breadcrumb":{"@id":`${canonicalUrl}#breadcrumb`}},{"@type":"LocalBusiness","@id":`${siteUrl}#localbusiness`,"name":"SidelineChiangmai - ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก","image":`${siteUrl}images/sideline-chiangmai-social-preview.webp`,"url":siteUrl,"priceRange":"฿฿","address":{"@type":"PostalAddress","streetAddress":"เจ็ดยอด","addressLocality":"ช้างเผือก","addressRegion":"เชียงใหม่","postalCode":"50300","addressCountry":"TH"},"geo":{"@type":"GeoCoordinates","latitude":"18.814361","longitude":"98.972389"},"hasMap":"https://maps.app.goo.gl/3y8gyAtamm8YSagi9","openingHours":["Mo-Su 00:00-24:00"],"areaServed":[{"@type":"City","name":"Chiang Mai"},{"@type":"City","name":"Bangkok"},{"@type":"City","name":" Lampang"},{"@type":"City","name":"Chiang Rai"},{"@type":"City","name":"Pattaya"},{"@type":"City","name":"Phuket"}]},{"@type":"BreadcrumbList","@id":`${canonicalUrl}#breadcrumb`,"itemListElement":[{"@type":"ListItem","position":1,"name":"หน้าแรก","item":siteUrl}]},{"@type":"FAQPage","@id":`${siteUrl}#faq`,"mainEntity":[{"@type":"Question","name":"บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?","acceptedAnswer":{"@type":"Answer","text":"Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้าทุกท่าน ข้อมูลการติดต่อและการจองของท่านจะถูกเก็บรักษาเป็นความลับอย่างเข้มงวด"}},{"@type":"Question","name":"จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการไซด์ไลน์หรือไม่?","acceptedAnswer":{"@type":"Answer","text":"เพื่อความสบายใจของลูกค้าทุกท่าน ท่านไม่จำเป็นต้องโอนเงินมัดจำใดๆ ทั้งสิ้น สามารถชำระค่าบริการเต็มจำนวนโดยตรงกับน้องๆ ที่หน้างานได้เลย"}},{"@type":"Question","name":"น้องๆ ไซด์ไลน์เชียงใหม่ตรงปกตามรูปที่แสดงในโปรไฟล์จริงหรือ?","acceptedAnswer":{"@type":"Answer","text":"เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพของน้องๆ ทุกคนอย่างละเอียด Sideline Chiang Mai กล้าการันตีว่าน้องๆ ตรงปก 100% หากพบปัญหาใดๆ สามารถแจ้งทีมงานเพื่อดำเนินการแก้ไขได้ทันที"}}]}]
            };
            const schemaContainer = document.createElement('script');
            schemaContainer.type = 'application/ld+json';
            schemaContainer.textContent = JSON.stringify(mainSchema);
            const oldSchema = document.querySelector('script[type="application/ld+json"]');
            if (oldSchema) oldSchema.remove();
            document.head.appendChild(schemaContainer);
        }
    }

    new SidelineWebApp();

})();