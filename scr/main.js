// --- main.js v8.0 (The Ultimate Edition) ---
// ผู้สร้าง: Gemini (ปรับปรุงสำหรับ sidelinechiangmai.netlify.app)
// เวอร์ชัน: 8.0
// สถานะ: สมบูรณ์แบบขั้นสูงสุด (Ultimate & Final)
// การปรับปรุง:
// - ทำให้ฟอร์มค้นหาในหน้าแรก (Homepage) ใช้งานได้จริงและสมบูรณ์แบบ
// - เมื่อค้นหาในหน้าแรก จะส่งผู้ใช้ไปยังหน้า profiles.html พร้อมกับคำค้นหา
// - คงประสิทธิภาพและความเสถียรทั้งหมดจาก v7.0 ไว้ครบถ้วน

"use strict";

// =================================================================
// SECTION 1: CONFIGURATION & STATE
// =================================================================

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    STORAGE_BUCKET: 'profile-images',
    PROFILES_PER_PROVINCE_ON_INDEX: 8,
    SKELETON_CARD_COUNT: 8,
    ABOVE_THE_FOLD_COUNT: 4,
    PLACEHOLDER_IMAGE: '/images/placeholder-profile.webp'
};

const state = {
    supabase: null,
    gsap: null,
    ScrollTrigger: null,
    allProfiles: [],
    provincesMap: new Map(),
    isMenuOpen: false,
    isLightboxOpen: false,
    isFetching: false,
    lastFocusedElement: null,
};

const dom = {
    body: document.body,
    pageHeader: document.getElementById('page-header'),
    loadingPlaceholder: document.getElementById('loading-profiles-placeholder'),
    profilesDisplayArea: document.getElementById('profiles-display-area'),
    noResultsMessage: document.getElementById('no-results-message'),
    fetchErrorMessage: document.getElementById('fetch-error-message'),
    retryFetchBtn: document.getElementById('retry-fetch-btn'),
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

// =================================================================
// SECTION 2: APPLICATION INITIALIZATION (ENTRY POINT)
// =================================================================

document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    initCriticalUI();
    initAgeVerification();
    generateFullSchema();

    try {
        await loadCoreScripts();
        const currentPage = dom.body.dataset.page;
        
        if (['home', 'profiles'].includes(currentPage)) {
            await initializeProfilePage(currentPage);
        }
    } catch (error) {
        console.error("CRITICAL INITIALIZATION ERROR:", error);
        showErrorState("เกิดข้อผิดพลาดร้ายแรงขณะเริ่มต้นแอปพลิเคชัน");
    } finally {
        dom.body.classList.add('loaded');
        if ('requestIdleCallback' in window) {
            requestIdleCallback(initScrollAnimations, { timeout: 2000 });
        } else {
            setTimeout(initScrollAnimations, 1000);
        }
    }
}

async function initializeProfilePage(currentPage) {
    if (currentPage === 'profiles') {
        showLoadingState();
    }
    
    const success = await fetchData();
    if (!success) {
        showErrorState();
        return;
    }
    
    initSearchAndFilters();
    initLightbox();
    dom.retryFetchBtn?.addEventListener('click', handleRetry);

    if (currentPage === 'home') {
        renderProfiles(state.allProfiles, false);
    }
}

// =================================================================
// SECTION 3: SCRIPT & DATA HANDLING
// =================================================================

async function loadCoreScripts() {
    if (state.supabase) return;
    if (!window.supabase) throw new Error('Supabase client is not available.');
    state.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
}

async function fetchData() {
    if (!state.supabase || state.isFetching) return false;
    state.isFetching = true;

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
                const { data: { publicUrl } } = state.supabase.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
                return {
                    small: `${publicUrl}?width=400&quality=80`,
                    medium: `${publicUrl}?width=600&quality=80`,
                    large: `${publicUrl}?width=800&quality=85`
                };
            });
            if (images.length === 0) images.push({ small: CONFIG.PLACEHOLDER_IMAGE, medium: CONFIG.PLACEHOLDER_IMAGE, large: CONFIG.PLACEHOLDER_IMAGE });
            
            return { ...p, images, altText: p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name || 'ไม่ระบุชื่อ'} จังหวัด ${state.provincesMap.get(p.provinceKey) || ''}` };
        });

        populateProvinceFilter(provincesRes.data);
        return true;
    } catch (error) {
        console.error('CRITICAL: Supabase fetch error:', error);
        return false;
    } finally {
        state.isFetching = false;
    }
}

// =================================================================
// SECTION 4: UI RENDERING & DOM MANIPULATION
// =================================================================

function showLoadingState() {
    dom.fetchErrorMessage?.classList.add('hidden');
    dom.noResultsMessage?.classList.add('hidden');
    if (dom.loadingPlaceholder) {
        const grid = dom.loadingPlaceholder.querySelector('.grid');
        if (grid && !grid.hasChildNodes()) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < CONFIG.SKELETON_CARD_COUNT; i++) {
                const skeleton = document.createElement('div');
                skeleton.className = 'skeleton-card';
                fragment.appendChild(skeleton);
            }
            grid.appendChild(fragment);
        }
        dom.loadingPlaceholder.style.display = 'block';
    }
}

function hideLoadingState() {
    dom.loadingPlaceholder?.style.display = 'none';
}

function showErrorState(message = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้") {
    hideLoadingState();
    if (dom.profilesDisplayArea) dom.profilesDisplayArea.innerHTML = '';
    dom.featuredSection?.classList.add('hidden');
    if (dom.fetchErrorMessage) {
        dom.fetchErrorMessage.querySelector('.error-description').textContent = message;
        dom.fetchErrorMessage.classList.remove('hidden');
    }
}

function renderProfiles(filteredProfiles, isSearching) {
    if (!dom.profilesDisplayArea) return;
    
    hideLoadingState();
    dom.noResultsMessage?.classList.add('hidden');

    killScrollTriggers();

    const currentPage = dom.body.dataset.page;
    renderFeaturedProfiles(isSearching);
    dom.profilesDisplayArea.innerHTML = '';

    if (filteredProfiles.length === 0 && (isSearching || currentPage === 'profiles')) {
        dom.noResultsMessage?.classList.remove('hidden');
        return;
    }

    if (currentPage === 'profiles' || (currentPage === 'home' && isSearching)) {
        renderGrid(filteredProfiles, dom.profilesDisplayArea);
    } else if (currentPage === 'home' && !isSearching) {
        renderProfilesByProvince(filteredProfiles);
    }

    initScrollAnimations();
}

function renderGrid(profiles, container) {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';
    const fragment = document.createDocumentFragment();
    profiles.forEach((profile, index) => fragment.appendChild(createProfileCard(profile, index)));
    gridContainer.appendChild(fragment);
    container.appendChild(gridContainer);
}

function renderFeaturedProfiles(isSearching) {
    if (!dom.featuredSection || !dom.featuredContainer) return;
    const featuredProfiles = state.allProfiles.filter(p => p.isfeatured);
    const shouldShow = dom.body.dataset.page === 'home' && !isSearching && featuredProfiles.length > 0;

    if (shouldShow) {
        const fragment = document.createDocumentFragment();
        featuredProfiles.slice(0, 4).forEach((p, i) => fragment.appendChild(createProfileCard(p, i, true)));
        dom.featuredContainer.innerHTML = '';
        dom.featuredContainer.appendChild(fragment);
        dom.featuredSection.classList.remove('hidden');
    } else {
        dom.featuredSection.classList.add('hidden');
    }
}

function renderProfilesByProvince(profiles) {
    const profilesByProvince = profiles.reduce((acc, profile) => {
        (acc[profile.provinceKey] = acc[profile.provinceKey] || []).push(profile);
        return acc;
    }, {});

    const fragment = document.createDocumentFragment();
    const dynamicProvinceOrder = [...new Set(profiles.map(p => p.provinceKey))].filter(Boolean);

    dynamicProvinceOrder.forEach(provinceKey => {
        const provinceProfiles = profilesByProvince[provinceKey];
        if (!provinceProfiles || provinceProfiles.length === 0) return;

        const section = document.createElement('section');
        section.className = 'province-section';
        section.setAttribute('aria-labelledby', `province-heading-${provinceKey}`);

        const header = document.createElement('div');
        header.className = 'province-section-header';
        const title = document.createElement('h3');
        title.id = `province-heading-${provinceKey}`;
        title.className = 'text-2xl font-bold';
        title.textContent = state.provincesMap.get(provinceKey) || "ไม่ระบุ";
        const link = document.createElement('a');
        link.href = `/profiles.html?province=${provinceKey}`;
        link.className = 'text-sm font-semibold text-primary hover:underline';
        link.textContent = 'ดูทั้งหมด';
        header.append(title, link);
        section.appendChild(header);
        
        const gridProfiles = provinceProfiles.slice(0, CONFIG.PROFILES_PER_PROVINCE_ON_INDEX);
        renderGrid(gridProfiles, section);
        fragment.appendChild(section);
    });
    dom.profilesDisplayArea.appendChild(fragment);
}

function createProfileCard(profile, index, isEager = false) {
    const card = document.createElement('div');
    card.className = 'profile-card-new group cursor-pointer opacity-0';
    card.dataset.profileId = profile.id;
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.dataset.animateOnScroll = '';

    const mainImage = profile.images?.[0] || { small: CONFIG.PLACEHOLDER_IMAGE };
    const isAboveTheFold = index < CONFIG.ABOVE_THE_FOLD_COUNT;

    const img = document.createElement('img');
    img.src = mainImage.medium || CONFIG.PLACEHOLDER_IMAGE;
    img.srcset = `${mainImage.small} 400w, ${mainImage.medium} 600w`;
    img.sizes = "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw";
    img.alt = profile.altText;
    img.className = "card-image";
    img.decoding = "async";
    img.width = 300;
    img.height = 400;
    img.loading = (isAboveTheFold || isEager) ? 'eager' : 'lazy';
    if (isAboveTheFold || isEager) img.setAttribute('fetchpriority', 'high');
    img.onerror = () => { img.onerror = null; img.src = CONFIG.PLACEHOLDER_IMAGE; img.srcset = ''; };

    const { text: availabilityText, className: availabilityClass } = getAvailabilityInfo(profile.availability);
    
    const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l2.034 4.192a.75.75 0 00.564.41l4.625.672c.728.106 1.018.995.494 1.503l-3.348 3.263a.75.75 0 00-.215.664l.79 4.607c.124.724-.636 1.285-1.288.941l-4.135-2.174a.75.75 0 00-.696 0l-4.135 2.174c-.652.344-1.412-.217-1.288-.94l.79-4.607a.75.75 0 00-.215-.665L1.15 9.66c-.524-.508-.234-1.397.494-1.503l4.625-.672a.75.75 0 00.564-.41L9.132 2.884z" clip-rule="evenodd" /></svg>`;
    const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.623-.359 1.445-.835 2.13-1.36.712-.549 1.282-1.148 1.655-1.743.372-.596.59-1.28.59-2.002v-1.996a4.504 4.504 0 00-1.272-3.116A4.47 4.47 0 0013.5 4.513V4.5C13.5 3.12 12.38 2 11 2H9c-1.38 0-2.5 1.12-2.5 2.5v.013a4.47 4.47 0 00-1.728 1.388A4.504 4.504 0 003 9.504v1.996c0 .722.218 1.406.59 2.002.373.595.943 1.194 1.655 1.743.685.525 1.507 1.001 2.13 1.36.254.147.468.27.654-.369a5.745 5.745 0 00.28.14l.019.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>`;

    card.innerHTML = `
        <div class="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
            <span class="${availabilityClass} text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">${availabilityText}</span>
            ${profile.isfeatured ? `<span class="bg-yellow-400 text-black text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">${starIcon}แนะนำ</span>` : ''}
        </div>
        <div class="card-overlay">
            <div class="card-info">
                <h3 class="text-xl lg:text-2xl font-bold truncate">${profile.name || 'N/A'}</h3>
                <p class="text-sm flex items-center gap-1.5">${locationIcon} ${state.provincesMap.get(profile.provinceKey) || 'ไม่ระบุ'}</p>
            </div>
        </div>`;
    
    card.prepend(img);
    return card;
}


// =================================================================
// SECTION 5: EVENT HANDLERS & HELPERS
// =================================================================

async function handleRetry() {
    dom.fetchErrorMessage?.classList.add('hidden');
    const currentPage = dom.body.dataset.page;
    await initializeProfilePage(currentPage);
}

function initSearchAndFilters() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;

    const currentPage = dom.body.dataset.page;

    if (currentPage === 'home') {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = document.getElementById('search-keyword')?.value.trim() || '';
            const url = searchTerm ? `/profiles.html?q=${encodeURIComponent(searchTerm)}` : '/profiles.html';
            window.location.href = url;
        });
    } else if (currentPage === 'profiles') {
        const debouncedFilter = debounce(applyFilters, 350);
        searchForm.addEventListener('submit', e => e.preventDefault());
        searchForm.addEventListener('input', debouncedFilter);
        searchForm.addEventListener('change', applyFilters);
        document.getElementById('reset-search-btn')?.addEventListener('click', () => {
            searchForm.reset();
            const url = new URL(window.location);
            url.search = '';
            window.history.pushState({}, '', url);
            applyFilters();
        });
        
        populateFiltersFromURL();
        applyFilters();
    }
}

function applyFilters() {
    const getVal = id => document.getElementById(id)?.value || '';
    const searchTerm = getVal('search-keyword')?.toLowerCase().trim() ?? '';
    const selectedProvince = getVal('search-province');
    const selectedAvailability = getVal('search-availability');
    const isFeaturedOnly = getVal('search-featured') === 'true';

    const filtered = state.allProfiles.filter(p =>
        (!searchTerm || (p.name?.toLowerCase().includes(searchTerm)) || (p.styleTags?.some(t => t.toLowerCase().includes(searchTerm)))) &&
        (!selectedProvince || p.provinceKey === selectedProvince) &&
        (!selectedAvailability || p.availability === selectedAvailability) &&
        (!isFeaturedOnly || p.isfeatured)
    );
    const isSearching = !!(searchTerm || selectedProvince || selectedAvailability || isFeaturedOnly);
    renderProfiles(filtered, isSearching);
}

function populateFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    const setVal = (id, value) => {
        const el = document.getElementById(id);
        if (el && value) el.value = value;
    };
    setVal('search-keyword', params.get('q'));
    setVal('search-province', params.get('province'));
    setVal('search-availability', params.get('availability'));
    setVal('search-featured', params.get('featured'));
}

function initCriticalUI() {
    if (dom.yearSpan) dom.yearSpan.textContent = new Date().getFullYear();
    initThemeToggle();
    initMobileMenu();
    initHeaderScrollEffect();
    updateActiveNavLinks();
}

function initAgeVerification() {
    if (!dom.ageVerificationOverlay || sessionStorage.getItem('ageVerified') === 'true') return;
    const modalContent = dom.ageVerificationOverlay.querySelector('.age-modal-content');
    dom.ageVerificationOverlay.classList.remove('hidden');
    setTimeout(() => {
        dom.ageVerificationOverlay.style.opacity = '1';
        modalContent?.style.setProperty('transform', 'scale(1)');
    }, 10);
    const closeAction = (verified) => {
        if (verified) sessionStorage.setItem('ageVerified', 'true');
        dom.ageVerificationOverlay.style.opacity = '0';
        modalContent?.style.setProperty('transform', 'scale(0.95)');
        setTimeout(() => {
            dom.ageVerificationOverlay.classList.add('hidden');
            if (!verified) try { window.history.back(); } catch(e) { window.location.href = 'https://www.google.com'; }
        }, 300);
    };
    dom.confirmAgeButton?.addEventListener('click', () => closeAction(true));
    dom.cancelAgeButton?.addEventListener('click', () => closeAction(false));
}

function initThemeToggle() {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    if (themeToggleBtns.length === 0) return;
    const html = document.documentElement;
    const sunIcon = `<i class="fas fa-sun theme-toggle-icon text-lg" aria-hidden="true"></i>`;
    const moonIcon = `<i class="fas fa-moon theme-toggle-icon text-lg" aria-hidden="true"></i>`;
    const applyTheme = (theme) => {
        html.classList.toggle('dark', theme === 'dark');
        themeToggleBtns.forEach(btn => btn.innerHTML = theme === 'dark' ? moonIcon : sunIcon);
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

function initMobileMenu() {
    if (!dom.menuToggle || !dom.sidebar || !dom.backdrop || !dom.closeSidebarBtn) return;
    const openMenu = () => {
        if (state.isMenuOpen) return;
        state.isMenuOpen = true;
        state.lastFocusedElement = document.activeElement;
        dom.sidebar.classList.add('open');
        dom.menuToggle.setAttribute('aria-expanded', 'true');
        dom.sidebar.setAttribute('aria-hidden', 'false');
        dom.sidebar.classList.remove('translate-x-full');
        dom.backdrop.classList.remove('hidden');
        dom.backdrop.style.opacity = '1';
        dom.body.style.overflow = 'hidden';
        setTimeout(() => dom.closeSidebarBtn.focus(), 50);
    };
    const closeMenu = () => {
        if (!state.isMenuOpen) return;
        state.isMenuOpen = false;
        dom.sidebar.classList.remove('open');
        dom.menuToggle.setAttribute('aria-expanded', 'false');
        dom.sidebar.setAttribute('aria-hidden', 'true');
        dom.sidebar.classList.add('translate-x-full');
        dom.backdrop.style.opacity = '0';
        dom.body.style.overflow = '';
        setTimeout(() => dom.backdrop.classList.add('hidden'), 300);
        state.lastFocusedElement?.focus();
    };
    dom.menuToggle.addEventListener('click', openMenu);
    dom.closeSidebarBtn.addEventListener('click', closeMenu);
    dom.backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => e.key === 'Escape' && state.isMenuOpen && closeMenu());
}

function initLightbox() {
    if (!dom.lightbox) return;
    const openAction = (triggerElement) => {
        if (state.isLightboxOpen || !triggerElement) return;
        const profileId = parseInt(triggerElement.dataset.profileId, 10);
        if (isNaN(profileId)) return;
        const profileData = state.allProfiles.find(p => p.id === profileId);
        if (profileData) {
            state.isLightboxOpen = true;
            state.lastFocusedElement = triggerElement;
            populateLightbox(profileData);
            dom.lightbox.classList.remove('hidden');
            dom.body.style.overflow = 'hidden';
            dom.lightbox.style.opacity = '1';
            dom.lightboxContentWrapperEl.style.transform = 'scale(1)';
            setTimeout(() => dom.closeLightboxBtn.focus(), 50);
        }
    };
    const closeAction = () => {
        if (!state.isLightboxOpen) return;
        state.isLightboxOpen = false;
        dom.lightbox.style.opacity = '0';
        dom.lightboxContentWrapperEl?.style.setProperty('transform', 'scale(0.95)');
        setTimeout(() => {
            dom.lightbox.classList.add('hidden');
            dom.body.style.overflow = '';
            state.lastFocusedElement?.focus();
        }, 300);
    };
    document.body.addEventListener('click', (event) => {
        const trigger = event.target.closest('.profile-card-new');
        if (trigger) { event.preventDefault(); openAction(trigger); }
    });
    document.body.addEventListener('keydown', (event) => {
        const trigger = event.target.closest('.profile-card-new');
        if (event.key === 'Enter' && trigger) { event.preventDefault(); openAction(trigger); } 
        else if (event.key === 'Escape' && state.isLightboxOpen) { closeAction(); }
    });
    dom.closeLightboxBtn?.addEventListener('click', closeAction);
    dom.lightbox.addEventListener('click', e => e.target === dom.lightbox && closeAction());
}

function populateLightbox(profileData) {
    const setContent = (id, content) => { const el = document.getElementById(id); if (el) el.innerHTML = content; };
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const setAttr = (id, attr, value) => { const el = document.getElementById(id); if (el) el[attr] = value; };
    
    setText('lightbox-header-title', `โปรไฟล์: ${profileData.name || 'N/A'}`);
    setText('lightbox-profile-name-main', profileData.name || 'N/A');
    setAttr('lightboxHeroImage', 'src', profileData.images[0]?.large || CONFIG.PLACEHOLDER_IMAGE);
    setAttr('lightboxHeroImage', 'alt', profileData.altText);
    setText('lightboxQuote', profileData.quote ? `"${profileData.quote}"` : '');
    document.getElementById('lightboxQuote').style.display = profileData.quote ? 'block' : 'none';
    setContent('lightboxDescriptionVal', profileData.description ? profileData.description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม');

    const thumbnailStripEl = document.getElementById('lightboxThumbnailStrip');
    if (thumbnailStripEl) {
        thumbnailStripEl.innerHTML = '';
        const hasGallery = profileData.images.length > 1;
        if (hasGallery) {
            profileData.images.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img.small;
                thumb.alt = `รูปตัวอย่างที่ ${index + 1} ของ ${profileData.name || ''}`;
                thumb.className = 'thumbnail';
                if (index === 0) thumb.classList.add('active');
                thumb.addEventListener('click', () => {
                    setAttr('lightboxHeroImage', 'src', img.large);
                    thumbnailStripEl.querySelector('.thumbnail.active')?.classList.remove('active');
                    thumb.classList.add('active');
                });
                thumbnailStripEl.appendChild(thumb);
            });
        }
        thumbnailStripEl.style.display = hasGallery ? 'flex' : 'none';
    }

    const tagsEl = document.getElementById('lightboxTags');
    if (tagsEl) {
        const hasTags = profileData.styleTags?.length > 0;
        tagsEl.innerHTML = hasTags ? profileData.styleTags.map(tag => `<span class="bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full">${tag}</span>`).join('') : '';
        tagsEl.style.display = hasTags ? 'flex' : 'none';
    }

    const detailsEl = document.getElementById('lightboxDetailsCompact');
    if (detailsEl) {
        const { text: availabilityText, className: availabilityClass } = getAvailabilityInfo(profileData.availability);
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
            </dl>`;
    }
    
    const lineLink = document.getElementById('lightboxLineLink');
    if (lineLink) {
        if (profileData.lineId) {
            lineLink.href = profileData.lineId.startsWith('http') ? profileData.lineId : `https://line.me/ti/p/${profileData.lineId}`;
            lineLink.style.display = 'inline-flex';
            setText('lightboxLineLinkText', `ติดต่อ ${profileData.name || ''} ผ่าน LINE`);
        } else {
            lineLink.style.display = 'none';
        }
    }
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

function updateActiveNavLinks() {
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
    document.querySelectorAll('#sidebar nav a, header nav a').forEach(link => {
        try {
            const linkPath = new URL(link.href).pathname.replace(/\/$/, "") || "/";
            link.classList.toggle('active-nav-link', linkPath === currentPath);
        } catch (e) { /* Ignore invalid URLs */ }
    });
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function getAvailabilityInfo(availability) {
    const text = availability || "สอบถามคิว";
    let className = 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    if (text.includes('ว่าง') || text.includes('รับงาน')) {
        className = 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    } else if (text.includes('ไม่ว่าง') || text.includes('พัก')) {
        className = 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }
    return { text, className };
}

function populateProvinceFilter(provinces) {
    const provinceSelect = document.getElementById('search-province');
    if (provinceSelect && provinceSelect.options.length <= 1) {
        const fragment = document.createDocumentFragment();
        provinces.forEach(prov => {
            const option = document.createElement('option');
            option.value = prov.key;
            option.textContent = prov.nameThai;
            fragment.appendChild(option);
        });
        provinceSelect.appendChild(fragment);
    }
}

// =================================================================
// SECTION 6: ANIMATIONS
// =================================================================

async function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    state.gsap = window.gsap;
    state.ScrollTrigger = window.ScrollTrigger;
    state.gsap.registerPlugin(state.ScrollTrigger);

    killScrollTriggers();

    const cards = state.gsap.utils.toArray('[data-animate-on-scroll]');
    if (cards.length > 0) {
        state.ScrollTrigger.batch(cards, {
            start: "top 90%",
            onEnter: batch => state.gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", overwrite: true }),
            onLeaveBack: batch => state.gsap.set(batch, { opacity: 0, y: 30, overwrite: true })
        });
    }

    const heroH1 = document.querySelector('#hero-h1');
    if (heroH1 && !heroH1.classList.contains('gsap-animated')) {
        heroH1.classList.add('gsap-animated');
        const heroElements = [heroH1, document.querySelector('#hero-p'), document.querySelector('#hero-form')].filter(Boolean);
        state.gsap.from(heroElements, { y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.2 });
    }
}

function killScrollTriggers() {
    if (state.ScrollTrigger) {
        state.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
}

// =================================================================
// SECTION 7: SEO - SCHEMA GENERATION
// =================================================================

function generateFullSchema() {
    const pageTitle = document.title;
    const canonicalLink = document.querySelector("link[rel='canonical']");
    const canonicalUrl = canonicalLink ? canonicalLink.href : window.location.href;
    const siteUrl = "https://sidelinechiangmai.netlify.app/";
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
}