// --- main.js (เวอร์ชันแก้ไขสมบูรณ์ขั้นสุดท้าย) ---

// ประกาศตัวแปรไว้ด้านบนสุด แต่ยังไม่ import
let createClient, gsap, ScrollTrigger, supabase;

// --- ค่าคงที่และตัวแปรส่วนกลาง ---
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const STORAGE_BUCKET = 'profile-images';
const PROFILES_PER_PROVINCE_ON_INDEX = 8;
const SKELETON_CARD_COUNT = 8;
const ABOVE_THE_FOLD_COUNT = 6;

let allProfiles = [];
let provincesMap = new Map();
let lastFocusedElement = null;
let isMenuOpen = false;
let isLightboxOpen = false;

// --- รวมศูนย์กลางการจัดการ DOM Elements ---
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

// --- ฟังก์ชันหลักในการเริ่มต้นแอป (ฉบับแก้ไขเพื่อทดสอบปัญหา) ---
async function initializeApp() {
    // --- ส่วน UI พื้นฐานที่ "ไม่ใช้" GSAP จะยังทำงานตามปกติ ---
    initThemeToggle();
    initHeaderScrollEffect();
    updateActiveNavLinks();
    generateFullSchema();

    // โหลดข้อมูลซึ่งเป็นหัวใจหลักของเว็บ
    await loadCoreScripts();

    // --- ส่วนที่ "ปิดการใช้งานชั่วคราว" เพื่อทดสอบ ---
    // เราจะปิดทุกฟังก์ชันที่เรียกใช้ GSAP ซึ่งเป็นผู้ต้องสงสัยหลัก
    
    // 1. ปิดการทำงานของเมนูมือถือที่มี Animation
    // initMobileMenu(); 
    
    // 2. ปิดการทำงานของหน้ายืนยันอายุที่มี Animation
    // initAgeVerification();

    // 3. ปิดการทำงานของ Lightbox ที่มี Animation
    // initLightbox();

    // 4. ปิดการทำงานของ Scroll Animation ทั้งหมด (ผู้ต้องสงสัยอันดับ 1)
    // initScrollAnimations();


    // --- ส่วนการโหลดข้อมูลและ Render จะยังทำงานตามปกติ แต่ไม่มี Animation ---
    const currentPage = dom.body.dataset.page;
    if (['home', 'profiles'].includes(currentPage)) {
        showLoadingState();
        const success = await fetchData();
        hideLoadingState();

        if (success) {
            initSearchAndFilters(); // ส่วนนี้สำคัญ ต้องทำงานเพื่อแสดงผลโปรไฟล์
            // initLightbox(); // ถูกปิดไปด้านบนแล้ว
            if (dom.retryFetchBtn) {
                dom.retryFetchBtn.addEventListener('click', handleRetry);
            }
        } else {
            showErrorState();
        }
    }
    
    // --- จัดการส่วนที่เหลือที่ไม่มีปัญหา ---
    if (dom.yearSpan) dom.yearSpan.textContent = new Date().getFullYear();
    dom.body.classList.add('loaded');
}

// --- Dynamic Script Loading ---
async function loadCoreScripts() {
    try {
        if (!createClient) {
            const supabaseModule = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
            createClient = supabaseModule.createClient;
            supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        }
    } catch (error) {
        console.error('CRITICAL: Error loading Supabase client.', error);
        showErrorState();
    }
}

async function loadAnimationScripts() {
    if (gsap) return;
    try {
        const [gsapModule, scrollTriggerModule] = await Promise.all([
            import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm"),
            import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm")
        ]);
        gsap = gsapModule.gsap;
        ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
    } catch (error) {
        console.error('Error loading animation scripts (GSAP). Animations may be disabled.', error);
    }
}

// --- UI State Management ---
function showLoadingState() {
    if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
    if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
    if (dom.profilesDisplayArea) dom.profilesDisplayArea.innerHTML = '';
    
    if (dom.loadingPlaceholder) {
        const grid = dom.loadingPlaceholder.querySelector('.grid');
        if (grid) {
            grid.innerHTML = Array(SKELETON_CARD_COUNT).fill('<div class="skeleton-card"></div>').join('');
        }
        dom.loadingPlaceholder.style.display = 'block';
    }
}

function hideLoadingState() {
    if (dom.loadingPlaceholder) dom.loadingPlaceholder.style.setProperty('display', 'none');
}

function showErrorState() {
    hideLoadingState();
    if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.remove('hidden');
}

async function handleRetry() {
    showLoadingState();
    const success = await fetchData();
    hideLoadingState();
    if (success) {
        applyFilters();
        if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
    } else {
        showErrorState();
    }
}

// --- Data Fetching ---
async function fetchData() {
    if (!supabase) {
        console.error("Supabase client is not available. Cannot fetch data.");
        return false;
    }
    try {
        const [profilesRes, provincesRes] = await Promise.all([
            supabase.from('profiles').select('*').order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false }),
            supabase.from('provinces').select('*').order('nameThai', { ascending: true })
        ]);

        if (profilesRes.error) throw profilesRes.error;
        if (provincesRes.error) throw provincesRes.error;

        (provincesRes.data || []).forEach(p => provincesMap.set(p.key, p.nameThai));
        allProfiles = (profilesRes.data || []).map(p => {
            const allImagePaths = [p.imagePath, ...(p.galleryPaths || [])].filter(Boolean);
            const images = allImagePaths.map(path => {
                const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
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
            const altText = p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name} จังหวัด ${provincesMap.get(p.provinceKey) || ''}`;
            return { ...p, images, altText };
        });

        if (dom.provinceSelect && dom.provinceSelect.options.length <= 1) {
            provincesRes.data.forEach(prov => {
                const option = document.createElement('option');
                option.value = prov.key;
                option.textContent = prov.nameThai;
                dom.provinceSelect.appendChild(option);
            });
        }
        return true;
    } catch (error) {
        console.error('CRITICAL: Error fetching data from Supabase:', error);
        return false;
    }
}

// --- Search & Profile Rendering ---
function initSearchAndFilters() {
    if (!dom.searchForm) {
        applyFilters();
        return;
    }
    const debouncedFilter = (() => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(applyFilters, 350);
        };
    })();
    dom.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });
    if (dom.resetSearchBtn) {
        dom.resetSearchBtn.addEventListener('click', () => {
            dom.searchForm.reset();
            applyFilters();
        });
    }
    if (dom.searchInput) dom.searchInput.addEventListener('input', debouncedFilter);
    if (dom.provinceSelect) dom.provinceSelect.addEventListener('change', applyFilters);
    if (dom.availabilitySelect) dom.availabilitySelect.addEventListener('change', applyFilters);
    if (dom.featuredSelect) dom.featuredSelect.addEventListener('change', applyFilters);
    applyFilters();
}

function applyFilters() {
    const searchTerm = dom.searchInput ? dom.searchInput.value.toLowerCase().trim() : '';
    const selectedProvince = dom.provinceSelect ? dom.provinceSelect.value : '';
    const selectedAvailability = dom.availabilitySelect ? dom.availabilitySelect.value : '';
    const isFeaturedOnly = dom.featuredSelect ? dom.featuredSelect.value === 'true' : false;

    const filtered = allProfiles.filter(p =>
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
    const currentPage = dom.body.dataset.page;
    dom.profilesDisplayArea.innerHTML = '';
    if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');

    const featuredProfilesList = allProfiles.filter(p => p.isfeatured);
    if (dom.featuredSection && dom.featuredContainer) {
        if (currentPage === 'home' && !isSearching && featuredProfilesList.length > 0) {
            dom.featuredContainer.innerHTML = '';
            dom.featuredContainer.append(...featuredProfilesList.map((profile, index) => createProfileCard(profile, index)));
            dom.featuredSection.classList.remove('hidden');
        } else {
            dom.featuredSection.classList.add('hidden');
        }
    }

    if (filteredProfiles.length === 0) {
        if (['home', 'profiles'].includes(currentPage)) {
            if (dom.noResultsMessage) dom.noResultsMessage.classList.remove('hidden');
        }
        initScrollAnimations();
        return;
    }

    if (currentPage === 'profiles') {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4';
        gridContainer.append(...filteredProfiles.map((profile, index) => createProfileCard(profile, index)));
        dom.profilesDisplayArea.appendChild(gridContainer);
    } else if (currentPage === 'home') {
        if (isSearching) {
            const searchResultWrapper = createSearchResultSection(filteredProfiles);
            dom.profilesDisplayArea.appendChild(searchResultWrapper);
        } else {
            const profilesByProvince = filteredProfiles.reduce((acc, profile) => {
                (acc[profile.provinceKey] = acc[profile.provinceKey] || []).push(profile);
                return acc;
            }, {});
            const urlParams = new URLSearchParams(window.location.search);
            const priorityLocation = urlParams.get('location');
            let dynamicProvinceOrder = [...new Set(filteredProfiles.map(p => p.provinceKey))];
            if (priorityLocation && dynamicProvinceOrder.includes(priorityLocation)) {
                dynamicProvinceOrder = [priorityLocation, ...dynamicProvinceOrder.filter(pKey => pKey !== priorityLocation)];
            }
            
            let accumulatedIndex = dom.featuredContainer ? dom.featuredContainer.children.length : 0;

            dynamicProvinceOrder.forEach(provinceKey => {
                if (!provinceKey) return;
                const provinceProfiles = profilesByProvince[provinceKey] || [];
                const provinceName = provincesMap.get(provinceKey) || "ไม่ระบุ";
                const provinceSectionEl = createProvinceSection(provinceKey, provinceName, provinceProfiles, accumulatedIndex);
                dom.profilesDisplayArea.appendChild(provinceSectionEl);
                accumulatedIndex += provinceProfiles.slice(0, PROFILES_PER_PROVINCE_ON_INDEX).length;
            });
        }
    }
    initScrollAnimations();
}

function createProfileCard(profile, index) {
    const card = document.createElement('div');
    card.className = 'profile-card-new group cursor-pointer';
    card.setAttribute('data-profile-id', profile.id);
    card.setAttribute('aria-label', `ดูโปรไฟล์ของ ${profile.name}`);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('data-animate-on-scroll', '');

    const mainImage = profile.images[0];
    const isAboveTheFold = index < ABOVE_THE_FOLD_COUNT;

    const img = document.createElement('img');
    img.src = mainImage.medium;
    img.srcset = `${mainImage.small} 400w, ${mainImage.medium} 600w`;
    img.sizes = "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw";
    img.alt = profile.altText;
    img.className = "card-image";
    img.decoding = "async";
    img.width = 300;
    img.height = 400;
    if (!isAboveTheFold) img.loading = 'lazy';
    if (isAboveTheFold) img.setAttribute('fetchpriority', 'high');
    img.onerror = () => {
        img.onerror = null;
        img.src = '/images/placeholder-profile.webp';
        img.srcset = '';
    };

    let availabilityText = profile.availability || "สอบถามคิว";
    let availabilityClass = 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    if (availabilityText.includes('ว่าง') || availabilityText.includes('รับงาน')) {
        availabilityClass = 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    } else if (availabilityText.includes('ไม่ว่าง') || availabilityText.includes('พัก')) {
        availabilityClass = 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }

    const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l2.034 4.192a.75.75 0 00.564.41l4.625.672c.728.106 1.018.995.494 1.503l-3.348 3.263a.75.75 0 00-.215.664l.79 4.607c.124.724-.636 1.285-1.288.941l-4.135-2.174a.75.75 0 00-.696 0l-4.135 2.174c-.652.344-1.412-.217-1.288-.94l.79-4.607a.75.75 0 00-.215-.665L1.15 9.66c-.524-.508-.234-1.397.494-1.503l4.625-.672a.75.75 0 00.564-.41L9.132 2.884z" clip-rule="evenodd" /></svg>`;
    const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.623-.359 1.445-.835 2.13-1.36.712-.549 1.282-1.148 1.655-1.743.372-.596.59-1.28.59-2.002v-1.996a4.504 4.504 0 00-1.272-3.116A4.47 4.47 0 0013.5 4.513V4.5C13.5 3.12 12.38 2 11 2H9c-1.38 0-2.5 1.12-2.5 2.5v.013a4.47 4.47 0 00-1.728 1.388A4.504 4.504 0 003 9.504v1.996c0 .722.218 1.406.59 2.002.373.595.943 1.194 1.655 1.743.685.525 1.507 1.001 2.13 1.36.254.147.468.27.654-.369a5.745 5.745 0 00.28.14l.019.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>`;

    card.innerHTML = `
    <div class="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
        <span class="${availabilityClass} text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">${availabilityText}</span>
        ${profile.isfeatured ? `<span class="bg-yellow-400 text-black text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">${starIcon}แนะนำ</span>` : ''}
    </div>
    <div class="card-overlay">
        <div class="card-info">
            <h3 class="text-xl lg:text-2xl font-bold truncate">${profile.name}</h3>
            <p class="text-sm flex items-center gap-1.5">${locationIcon} ${provincesMap.get(profile.provinceKey) || 'ไม่ระบุ'}</p>
        </div>
    </div>`;
    card.prepend(img);
    return card;
}


// --- UI Interaction Handlers ---
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
    if (!dom.menuToggle || !dom.sidebar || !dom.backdrop || !dom.closeSidebarBtn) return;
    
    const openMenu = async () => {
        if (isMenuOpen) return;
        isMenuOpen = true;
        await loadAnimationScripts();
        
        dom.sidebar.setAttribute('aria-hidden', 'false');
        dom.sidebar.classList.remove('translate-x-full');
        dom.backdrop.classList.remove('hidden');
        if (gsap) {
            gsap.to(dom.backdrop, { opacity: 1, duration: 0.3 });
        }
        dom.body.style.overflow = 'hidden';
        dom.sidebar.focus();
    };

    const closeMenu = async () => {
        if (!isMenuOpen) return;
        isMenuOpen = false;
        await loadAnimationScripts();
        
        if (gsap) {
            gsap.to(dom.backdrop, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    dom.backdrop.classList.add('hidden');
                    dom.sidebar.classList.add('translate-x-full');
                    dom.sidebar.setAttribute('aria-hidden', 'true');
                    dom.body.style.overflow = '';
                }
            });
        } else {
            // Fallback for when GSAP fails to load
            dom.backdrop.classList.add('hidden');
            dom.sidebar.classList.add('translate-x-full');
            dom.sidebar.setAttribute('aria-hidden', 'true');
            dom.body.style.overflow = '';
        }
    };

    dom.menuToggle.addEventListener('click', openMenu);
    dom.closeSidebarBtn.addEventListener('click', closeMenu);
    dom.backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });
}

async function initAgeVerification() {
    if (!dom.ageVerificationOverlay) return;
    if (sessionStorage.getItem('ageVerified') === 'true') {
        dom.ageVerificationOverlay.classList.add('hidden');
        return;
    }

    await loadAnimationScripts();
    const modalContent = dom.ageVerificationOverlay.querySelector('.age-modal-content');
    dom.ageVerificationOverlay.classList.remove('hidden');

    if (gsap && modalContent) {
        gsap.to(dom.ageVerificationOverlay, { opacity: 1, duration: 0.3 });
        gsap.fromTo(modalContent, { scale: 0.9, opacity: 0, y: -20 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 });
    }

    const closeAction = (verified) => {
        if (verified) {
            sessionStorage.setItem('ageVerified', 'true');
        }
        if (gsap && modalContent) {
            gsap.to(modalContent, { scale: 0.95, opacity: 0, y: 10, duration: 0.3, ease: 'power2.in' });
            gsap.to(dom.ageVerificationOverlay, { opacity: 0, duration: 0.3, delay: 0.1, onComplete: () => {
                dom.ageVerificationOverlay.classList.add('hidden');
                if (!verified) window.history.back();
            }});
        } else {
            dom.ageVerificationOverlay.classList.add('hidden');
            if (!verified) window.history.back();
        }
    };
    
    if (dom.confirmAgeButton) dom.confirmAgeButton.addEventListener('click', () => closeAction(true));
    if (dom.cancelAgeButton) dom.cancelAgeButton.addEventListener('click', () => closeAction(false));
}

async function initLightbox() {
    if (!dom.lightbox || !dom.lightboxContentWrapperEl || !dom.closeLightboxBtn) return;

    const openAction = async (triggerElement) => {
        if (isLightboxOpen || !triggerElement) return;
        const profileId = parseInt(triggerElement.dataset.profileId, 10);
        const profileData = allProfiles.find(p => p.id === profileId);
        
        if (profileData) {
            isLightboxOpen = true;
            lastFocusedElement = triggerElement;
            populateLightbox(profileData);
            dom.lightbox.classList.remove('hidden');
            dom.body.style.overflow = 'hidden';

            await loadAnimationScripts();
            if (gsap) {
                gsap.to(dom.lightbox, { opacity: 1, duration: 0.3 });
                gsap.fromTo(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
            }
            const focusableEl = dom.lightbox.querySelector('button, [href]');
            if (focusableEl) {
                focusableEl.focus();
            }
        }
    };

    const closeAction = async () => {
        if (!isLightboxOpen) return;
        isLightboxOpen = false;
        
        await loadAnimationScripts();
        if (gsap) {
            gsap.to(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
            gsap.to(dom.lightbox, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    dom.lightbox.classList.add('hidden');
                    dom.body.style.overflow = '';
                }
            });
        } else {
            dom.lightbox.classList.add('hidden');
            dom.body.style.overflow = '';
        }
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
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
        } else if (event.key === 'Escape' && isLightboxOpen) {
            closeAction();
        }
    });
    dom.closeLightboxBtn.addEventListener('click', closeAction);
    dom.lightbox.addEventListener('click', e => {
        if (e.target === dom.lightbox) closeAction();
    });
}

function populateLightbox(profileData) {
    const nameMainEl = document.getElementById('lightbox-profile-name-main');
    const heroImageEl = document.getElementById('lightboxHeroImage');
    const thumbnailStripEl = document.getElementById('lightboxThumbnailStrip');
    const quoteEl = document.getElementById('lightboxQuote');
    const tagsEl = document.getElementById('lightboxTags');
    const detailsEl = document.getElementById('lightboxDetailsCompact');
    const descriptionEl = document.getElementById('lightboxDescriptionVal');
    const lineLink = document.getElementById('lightboxLineLink');
    const lineLinkText = document.getElementById('lightboxLineLinkText');
    const headerTitleEl = document.getElementById('lightbox-header-title');

    headerTitleEl.textContent = `โปรไฟล์: ${profileData.name || 'N/A'}`;
    nameMainEl.textContent = profileData.name || 'N/A';
    heroImageEl.src = profileData.images[0].large;
    heroImageEl.alt = profileData.altText;
    heroImageEl.width = 800;
    heroImageEl.height = 1067;
    quoteEl.textContent = profileData.quote ? `"${profileData.quote}"` : '';
    quoteEl.style.display = profileData.quote ? 'block' : 'none';
    descriptionEl.innerHTML = profileData.description ? profileData.description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม';

    thumbnailStripEl.innerHTML = '';
    const hasGallery = profileData.images.length > 1;
    if (hasGallery) {
        profileData.images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img.small;
            thumb.alt = `รูปตัวอย่างที่ ${index + 1} ของ ${profileData.name}`;
            thumb.width = 60;
            thumb.height = 80;
            thumb.className = 'thumbnail';
            if (index === 0) thumb.classList.add('active');
            thumb.addEventListener('click', () => {
                heroImageEl.src = img.large;
                const activeThumb = thumbnailStripEl.querySelector('.thumbnail.active');
                if (activeThumb) activeThumb.classList.remove('active');
                thumb.classList.add('active');
            });
            thumbnailStripEl.appendChild(thumb);
        });
    }
    thumbnailStripEl.style.display = hasGallery ? 'flex' : 'none';

    tagsEl.innerHTML = '';
    const hasTags = profileData.styleTags && profileData.styleTags.length > 0;
    if (hasTags) {
        profileData.styleTags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full';
            tagEl.textContent = tag;
            tagsEl.appendChild(tagEl);
        });
    }
    tagsEl.style.display = hasTags ? 'flex' : 'none';

    let availabilityText = profileData.availability || "สอบถามคิว";
    let availabilityClass = 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    if (availabilityText.includes('ว่าง') || availabilityText.includes('รับงาน')) {
        availabilityClass = 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    } else if (availabilityText.includes('ไม่ว่าง') || availabilityText.includes('พัก')) {
        availabilityClass = 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }

    detailsEl.innerHTML = `
        <div class="availability-badge ${availabilityClass}">${availabilityText}</div>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="label">อายุ</div>
                <div class="value">${profileData.age || '-'} ปี</div>
            </div>
            <div class="stat-item">
                <div class="label">สัดส่วน</div>
                <div class="value">${profileData.stats || '-'}</div>
            </div>
            <div class="stat-item">
                <div class="label">สูง/หนัก</div>
                <div class="value">${profileData.height || '-'}/${profileData.weight || '-'}</div>
            </div>
        </div>
        <dl class="space-y-2 text-sm">
            <div class="detail-list-item">
                <dt class="flex-shrink-0"><i class="fas fa-palette w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt>
                <dd class="value">ผิว: ${profileData.skinTone || '-'}</dd>
            </div>
            <div class="detail-list-item">
                <dt class="flex-shrink-0"><i class="fas fa-map-marker-alt w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt>
                <dd class="value">จังหวัด: ${provincesMap.get(profileData.provinceKey) || ''} (${profileData.location || 'ไม่ระบุ'})</dd>
            </div>
            <div class="detail-list-item">
                <dt class="flex-shrink-0"><i class="fas fa-money-bill-wave w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt>
                <dd class="value">เรท: ${profileData.rate || 'สอบถาม'}</dd>
            </div>
        </dl>
    `;

    if (profileData.lineId) {
        lineLink.href = profileData.lineId.startsWith('http') ? profileData.lineId : `https://line.me/ti/p/${profileData.lineId}`;
        lineLink.style.display = 'inline-flex';
        lineLinkText.textContent = `ติดต่อ ${profileData.name} ผ่าน LINE`;
    } else {
        lineLink.style.display = 'none';
    }
}

// --- ฟังก์ชันจัดการ Animation (จะโหลด GSAP เมื่อจำเป็น) ---
async function initScrollAnimations() {
    await loadAnimationScripts();
    if (!gsap) return;

    // *** FIX: 1. ทำลาย ScrollTrigger ของเก่าทั้งหมดทิ้งก่อน เพื่อป้องกัน Memory Leak ***
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // 2. Refresh เพื่อให้ GSAP รู้จักขนาดและตำแหน่งล่าสุดของทุก Element
    ScrollTrigger.refresh();

    // 3. สร้าง Animation สำหรับ Element ที่รอการ Scroll มาถึง
    const animatedElements = document.querySelectorAll('[data-animate-on-scroll]:not(.is-visible)');
    animatedElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
                onEnter: () => el.classList.add('is-visible'),
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power2.out",
        });
    });
    
    // 4. สร้าง Animation สำหรับ Hero Section (ทำเพียงครั้งเดียว)
    const heroH1 = document.querySelector('#hero-h1');
    if (heroH1 && !heroH1._gsap) { // เช็ค _gsap เพื่อให้แน่ใจว่า animation นี้ยังไม่เคยถูกสร้าง
        const heroElements = [heroH1, document.querySelector('#hero-p'), document.querySelector('#hero-form')].filter(Boolean);
        gsap.from(heroElements, { 
            y: 20, 
            opacity: 0, 
            duration: 0.6, 
            stagger: 0.15, 
            ease: 'power2.out', 
            delay: 0.3 
        });
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

function updateActiveNavLinks() {
    const currentPath = window.location.pathname.endsWith('/') ? window.location.pathname.slice(0, -1) || '/' : window.location.pathname;
    const navLinks = document.querySelectorAll('#sidebar nav a, header nav a');
    navLinks.forEach(link => {
        try {
            const linkPath = new URL(link.href).pathname.endsWith('/') ? new URL(link.href).pathname.slice(0, -1) || '/' : new URL(link.href).pathname;
            const isActive = linkPath === currentPath;
            link.classList.toggle('active-nav-link', isActive);
        } catch(e) {
            console.warn("Could not parse nav link href:", link.href);
        }
    });
}

function generateFullSchema() {
    const pageTitle = document.title;
    const canonicalLink = document.querySelector("link[rel='canonical']");
    const canonicalUrl = canonicalLink ? canonicalLink.href : window.location.href;
    const siteUrl = "https://sidelinechiangmai.netlify.app/";
    const orgName = "SidelineChiangmai - รับงาน ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก";
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

// --- เริ่มการทำงานของแอปหลังจาก DOM โหลดเสร็จ ---
document.addEventListener('DOMContentLoaded', initializeApp);
