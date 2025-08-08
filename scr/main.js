// --- main.js (ฉบับสมบูรณ์ พร้อมใช้งาน) ---
// เวอร์ชันนี้ได้แก้ไขเรื่องความปลอดภัยและปรับปรุงโค้ดให้สมบูรณ์แล้ว
// **ข้อกำหนดก่อนใช้งาน:** คุณต้องตั้งค่า Environment Variables 2 ตัวนี้ใน Netlify ก่อน:
//   1. VITE_SUPABASE_URL
//   2. VITE_SUPABASE_KEY

// --- การประกาศตัวแปรส่วนกลาง ---
let createClient, gsap, ScrollTrigger, supabase;

// --- ค่าคงที่และตัวแปรหลักของแอปพลิเคชัน ---
// [แก้ไข] ดึงค่า Key และ URL มาจาก Environment Variables ที่ตั้งค่าไว้ใน Netlify เพื่อความปลอดภัยสูงสุด
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const STORAGE_BUCKET = 'profile-images';
const PROFILES_PER_PROVINCE_ON_INDEX = 8;
const SKELETON_CARD_COUNT = 8;
const ABOVE_THE_FOLD_COUNT = 4;

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

/**
 * ฟังก์ชันหลักในการเริ่มต้นแอปพลิเคชัน
 */
async function initializeApp() {
    performance.mark('initializeApp-start');

    // [ตรวจสอบ] เช็คว่า Key ถูกตั้งค่ามาหรือไม่ ถ้าไม่ จะไม่ทำงานต่อเพื่อป้องกันข้อผิดพลาด
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error('CRITICAL: VITE_SUPABASE_URL หรือ VITE_SUPABASE_KEY ไม่ได้ถูกตั้งค่าใน Environment Variables ของ Netlify');
        showErrorState("ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาติดต่อผู้ดูแลเว็บไซต์");
        return;
    }

    initThemeToggle();
    initMobileMenu();
    initHeaderScrollEffect();
    updateActiveNavLinks();

    await loadCoreScripts();
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
    initScrollAnimations();

    if (dom.yearSpan) dom.yearSpan.textContent = new Date().getFullYear();
    dom.body.classList.add('loaded');

    performance.mark('initializeApp-end');
    performance.measure('initializeApp', 'initializeApp-start', 'initializeApp-end');
}

/**
 * โหลดสคริปต์หลักที่จำเป็น (Supabase)
 */
async function loadCoreScripts() {
    try {
        if (!createClient) {
            const supabaseModule = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
            createClient = supabaseModule.createClient;
            supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        }
    } catch (error) {
        console.error('CRITICAL: ไม่สามารถโหลด Supabase client ได้', error);
        showErrorState('เกิดข้อผิดพลาดในการโหลดไลบรารีหลัก');
    }
}

/**
 * โหลดสคริปต์สำหรับ Animation (GSAP)
 */
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

/**
 * แสดงสถานะกำลังโหลด (Skeleton UI)
 */
function showLoadingState() {
    if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
    if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');

    if (dom.loadingPlaceholder) {
        const grid = dom.loadingPlaceholder.querySelector('.grid');
        if (grid && grid.innerHTML === '') {
            grid.innerHTML = Array(SKELETON_CARD_COUNT).fill('<div class="skeleton-card"></div>').join('');
        }
        dom.loadingPlaceholder.style.display = 'block';
    }
}

/**
 * ซ่อนสถานะกำลังโหลด
 */
function hideLoadingState() {
    if (dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
}

/**
 * แสดงสถานะเมื่อการดึงข้อมูลล้มเหลว
 */
function showErrorState(customMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้") {
    hideLoadingState();
    if (dom.profilesDisplayArea) dom.profilesDisplayArea.innerHTML = '';
    if (dom.featuredSection) dom.featuredSection.classList.add('hidden');
    if (dom.fetchErrorMessage) {
        const errorDesc = dom.fetchErrorMessage.querySelector('.error-description');
        if (errorDesc) errorDesc.textContent = customMessage;
        dom.fetchErrorMessage.classList.remove('hidden');
    }
}


/**
 * จัดการการกดปุ่ม "ลองอีกครั้ง"
 */
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

/**
 * ดึงข้อมูลโปรไฟล์และจังหวัดจาก Supabase
 */
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

        provincesRes.data.forEach(p => provincesMap.set(p.key, p.nameThai));

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
        console.error('CRITICAL: เกิดข้อผิดพลาดในการดึงข้อมูลจาก Supabase:', error);
        return false;
    }
}

/**
 * เริ่มต้นการทำงานของระบบค้นหาและฟิลเตอร์
 */
function initSearchAndFilters() {
    if (!dom.searchForm) {
        if(allProfiles.length > 0) applyFilters();
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
            if(dom.searchForm) dom.searchForm.reset();
            applyFilters();
        });
    }

    if (dom.searchInput) dom.searchInput.addEventListener('input', debouncedFilter);
    if (dom.provinceSelect) dom.provinceSelect.addEventListener('change', applyFilters);
    if (dom.availabilitySelect) dom.availabilitySelect.addEventListener('change', applyFilters);
    if (dom.featuredSelect) dom.featuredSelect.addEventListener('change', applyFilters);

    applyFilters();
}

/**
 * กรองข้อมูลโปรไฟล์
 */
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

/**
 * แสดงผลโปรไฟล์บนหน้าเว็บ
 */
function renderProfiles(filteredProfiles, isSearching) {
    if (!dom.profilesDisplayArea) return;
    const currentPage = dom.body.dataset.page;
    if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
    hideLoadingState();

    const featuredProfilesList = allProfiles.filter(p => p.isfeatured);
    if (dom.featuredSection && dom.featuredContainer) {
        if (currentPage === 'home' && !isSearching && featuredProfilesList.length > 0) {
            const newContainer = dom.featuredContainer.cloneNode(false);
            newContainer.append(...featuredProfilesList.slice(0, 4).map((p, i) => createProfileCard(p, i, true)));
            dom.featuredContainer.replaceWith(newContainer);
            dom.featuredContainer = newContainer;
            dom.featuredSection.classList.remove('hidden');
        } else {
            dom.featuredSection.classList.add('hidden');
        }
    }

    dom.profilesDisplayArea.innerHTML = '';
    if (filteredProfiles.length === 0 && (isSearching || currentPage === 'profiles')) {
        if (dom.noResultsMessage) dom.noResultsMessage.classList.remove('hidden');
    } else {
        if (currentPage === 'profiles') {
            const gridContainer = document.createElement('div');
            gridContainer.className = 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';
            gridContainer.append(...filteredProfiles.map((profile, index) => createProfileCard(profile, index)));
            dom.profilesDisplayArea.appendChild(gridContainer);
        }
        else if (currentPage === 'home') {
            if (isSearching) {
                const searchResultWrapper = document.createElement('div');
                searchResultWrapper.className = 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';
                searchResultWrapper.append(...filteredProfiles.map((profile, index) => createProfileCard(profile, index)));
                dom.profilesDisplayArea.appendChild(searchResultWrapper);
            } else {
                const profilesByProvince = filteredProfiles.reduce((acc, profile) => {
                    (acc[profile.provinceKey] = acc[profile.provinceKey] || []).push(profile);
                    return acc;
                }, {});

                let dynamicProvinceOrder = [...new Set(filteredProfiles.map(p => p.provinceKey))];
                let accumulatedIndex = dom.featuredContainer ? dom.featuredContainer.children.length : 0;

                dynamicProvinceOrder.forEach(provinceKey => {
                    if (!provinceKey) return;
                    const provinceProfiles = profilesByProvince[provinceKey] || [];
                    if(provinceProfiles.length === 0) return;

                    const provinceName = provincesMap.get(provinceKey) || "ไม่ระบุ";
                    const provinceSectionEl = document.createElement('section');
                    provinceSectionEl.className = 'province-section';
                    provinceSectionEl.setAttribute('aria-labelledby', `province-heading-${provinceKey}`);

                    const gridContainer = document.createElement('div');
                    gridContainer.className = 'profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4';
                    gridContainer.append(...provinceProfiles.slice(0, PROFILES_PER_PROVINCE_ON_INDEX).map(p => createProfileCard(p, accumulatedIndex++)));

                    provinceSectionEl.innerHTML = `<div class="province-section-header"><h3 id="province-heading-${provinceKey}" class="text-2xl font-bold">${provinceName}</h3><a href="/profiles.html?province=${provinceKey}" class="text-sm font-semibold text-primary hover:underline">ดูทั้งหมด</a></div>`;
                    provinceSectionEl.appendChild(gridContainer);
                    dom.profilesDisplayArea.appendChild(provinceSectionEl);
                });
            }
        }
    }

    initScrollAnimations();
}

/**
 * สร้าง HTML Element สำหรับการ์ดโปรไฟล์
 */
function createProfileCard(profile, index, isEager = false) {
    const card = document.createElement('div');
    card.className = 'profile-card-new group cursor-pointer';
    card.dataset.profileId = profile.id;
    card.setAttribute('aria-label', `ดูโปรไฟล์ของ ${profile.name}`);
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.dataset.animateOnScroll = '';

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

    if (isAboveTheFold || isEager) {
        img.loading = 'eager';
        img.setAttribute('fetchpriority', 'high');
    } else {
        img.loading = 'lazy';
    }

    img.onerror = () => { img.onerror = null; img.src = '/images/placeholder-profile.webp'; img.srcset = ''; };

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
            <h3 class="text-xl lg:text-2xl font-bold truncate">${profile.name}</h3>
            <p class="text-sm flex items-center gap-1.5">${locationIcon} ${provincesMap.get(profile.provinceKey) || 'ไม่ระบุ'}</p>
        </div>
    </div>`;
    card.prepend(img);
    return card;
}

/**
 * เริ่มต้นการทำงานของปุ่มสลับ Theme
 */
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

/**
 * เริ่มต้นการทำงานของเมนูสำหรับมือถือ
 */
function initMobileMenu() {
    if (!dom.menuToggle || !dom.sidebar || !dom.backdrop || !dom.closeSidebarBtn) return;

    const openMenu = () => {
        if (isMenuOpen) return;
        isMenuOpen = true;
        lastFocusedElement = document.activeElement;

        dom.menuToggle.setAttribute('aria-expanded', 'true');
        dom.sidebar.setAttribute('aria-hidden', 'false');
        dom.sidebar.classList.remove('translate-x-full');
        dom.backdrop.classList.remove('hidden');
        dom.backdrop.style.opacity = '1';
        dom.body.style.overflow = 'hidden';

        setTimeout(() => dom.closeSidebarBtn.focus(), 50);
    };

    const closeMenu = () => {
        if (!isMenuOpen) return;
        isMenuOpen = false;

        dom.menuToggle.setAttribute('aria-expanded', 'false');
        dom.sidebar.setAttribute('aria-hidden', 'true');
        dom.sidebar.classList.add('translate-x-full');
        dom.backdrop.style.opacity = '0';
        dom.body.style.overflow = '';

        setTimeout(() => dom.backdrop.classList.add('hidden'), 300);
        if (lastFocusedElement) lastFocusedElement.focus();
    };

    dom.menuToggle.addEventListener('click', openMenu);
    dom.closeSidebarBtn.addEventListener('click', closeMenu);
    dom.backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });
}

/**
 * เริ่มต้นการทำงานของ Modal ตรวจสอบอายุ
 */
async function initAgeVerification() {
    if (!dom.ageVerificationOverlay || sessionStorage.getItem('ageVerified') === 'true') {
        return;
    }

    await loadAnimationScripts();
    const modalContent = dom.ageVerificationOverlay.querySelector('.age-modal-content');
    dom.ageVerificationOverlay.classList.remove('hidden');

    if (gsap && modalContent) {
        gsap.to(dom.ageVerificationOverlay, { opacity: 1, duration: 0.3 });
        gsap.fromTo(modalContent, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 });
    } else {
        dom.ageVerificationOverlay.style.opacity = '1';
    }

    const closeAction = (verified) => {
        if (verified) {
            sessionStorage.setItem('ageVerified', 'true');
        }

        const onComplete = () => {
            dom.ageVerificationOverlay.classList.add('hidden');
            if (!verified) {
                window.history.back();
            }
        };

        if (gsap && modalContent) {
            gsap.to(modalContent, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
            gsap.to(dom.ageVerificationOverlay, { opacity: 0, duration: 0.3, delay: 0.1, onComplete });
        } else {
            dom.ageVerificationOverlay.style.opacity = '0';
            setTimeout(onComplete, 300);
        }
    };

    if (dom.confirmAgeButton) dom.confirmAgeButton.addEventListener('click', () => closeAction(true));
    if (dom.cancelAgeButton) dom.cancelAgeButton.addEventListener('click', () => closeAction(false));
}

/**
 * เริ่มต้นการทำงานของ Lightbox
 */
async function initLightbox() {
    if (!dom.lightbox || !dom.lightboxContentWrapperEl || !dom.closeLightboxBtn) return;

    await loadAnimationScripts();

    const openAction = (triggerElement) => {
        if (isLightboxOpen || !triggerElement) return;
        const profileId = parseInt(triggerElement.dataset.profileId, 10);
        if (isNaN(profileId)) return;

        const profileData = allProfiles.find(p => p.id === profileId);

        if (profileData) {
            isLightboxOpen = true;
            lastFocusedElement = triggerElement;
            populateLightbox(profileData);

            dom.lightbox.classList.remove('hidden');
            dom.body.style.overflow = 'hidden';

            if (gsap) {
                gsap.to(dom.lightbox, { opacity: 1, duration: 0.3 });
                gsap.fromTo(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
            } else {
                dom.lightbox.style.opacity = '1';
                dom.lightboxContentWrapperEl.style.transform = 'scale(1)';
            }
            setTimeout(() => dom.closeLightboxBtn.focus(), 50);
        }
    };

    const closeAction = () => {
        if (!isLightboxOpen) return;
        isLightboxOpen = false;

        const onComplete = () => {
            dom.lightbox.classList.add('hidden');
            dom.body.style.overflow = '';
            if (lastFocusedElement) lastFocusedElement.focus();
        };

        if (gsap) {
            gsap.to(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
            gsap.to(dom.lightbox, { opacity: 0, duration: 0.3, onComplete });
        } else {
            dom.lightbox.style.opacity = '0';
            dom.lightboxContentWrapperEl.style.transform = 'scale(0.95)';
            setTimeout(onComplete, 300);
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
        const trigger = event.target.closest('.profile-card-new');
        if (event.key === 'Enter' && trigger) {
            event.preventDefault();
            openAction(trigger);
        } else if (event.key === 'Escape' && isLightboxOpen) {
            closeAction();
        }
    });

    dom.closeLightboxBtn.addEventListener('click', closeAction);
    dom.lightbox.addEventListener('click', e => {
        if (e.target === dom.lightbox) closeAction();
    });
}


/**
 * เติมข้อมูลของโปรไฟล์ที่เลือกลงใน Lightbox
 */
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
    if(descriptionEl) descriptionEl.innerHTML = profileData.description ? profileData.description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม';

    if (thumbnailStripEl) {
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
                    if(heroImageEl) heroImageEl.src = img.large;
                    thumbnailStripEl.querySelector('.thumbnail.active')?.classList.remove('active');
                    thumb.classList.add('active');
                });
                thumbnailStripEl.appendChild(thumb);
            });
        }
        thumbnailStripEl.style.display = hasGallery ? 'flex' : 'none';
    }

    if (tagsEl) {
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
                <div class="detail-list-item"><dt class="flex-shrink-0"><i class="fas fa-map-marker-alt w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt><dd class="value">จังหวัด: ${provincesMap.get(profileData.provinceKey) || ''} (${profileData.location || 'ไม่ระบุ'})</dd></div>
                <div class="detail-list-item"><dt class="flex-shrink-0"><i class="fas fa-money-bill-wave w-5 text-center detail-list-item-icon" aria-hidden="true"></i></dt><dd class="value">เรท: ${profileData.rate || 'สอบถาม'}</dd></div>
            </dl>
        `;
    }

    if (lineLink && lineLinkText) {
        if (profileData.lineId) {
            lineLink.href = profileData.lineId.startsWith('http') ? profileData.lineId : `https://line.me/ti/p/${profileData.lineId}`;
            lineLink.style.display = 'inline-flex';
            lineLinkText.textContent = `ติดต่อ ${profileData.name} ผ่าน LINE`;
        } else {
            lineLink.style.display = 'none';
        }
    }
}

/**
 * เริ่มต้น Animation ที่จะทำงานเมื่อ scroll
 */
async function initScrollAnimations() {
    await loadAnimationScripts();
    if (!gsap) return;

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollTrigger.refresh();

    const animatedElements = document.querySelectorAll('[data-animate-on-scroll]');
    animatedElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 95%",
                end: "bottom top",
                toggleActions: "play none none none",
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out",
        });
    });

    const heroH1 = document.querySelector('#hero-h1');
    if (heroH1 && !heroH1.classList.contains('gsap-animated')) {
        heroH1.classList.add('gsap-animated');
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

/**
 * เพิ่ม/ลดเงาที่ Header เมื่อ scroll
 */
function initHeaderScrollEffect() {
    const header = dom.pageHeader;
    if (!header) return;

    let isTicking = false;
    const handleScroll = () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 20);
                isTicking = false;
            });
            isTicking = true;
        }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * อัปเดตสถานะ "active" ของลิงก์ใน Navigation Bar
 */
function updateActiveNavLinks() {
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
    const navLinks = document.querySelectorAll('#sidebar nav a, header nav a');
    navLinks.forEach(link => {
        try {
            const linkPath = new URL(link.href).pathname.replace(/\/$/, "") || "/";
            link.classList.toggle('active-nav-link', linkPath === currentPath);
        } catch(e) {
            console.warn("Could not parse nav link href:", link.href);
        }
    });
}

/**
 * สร้าง JSON-LD Schema สำหรับ SEO
 */
function generateFullSchema() {
    const pageTitle = document.title;
    const canonicalLink = document.querySelector("link[rel='canonical']");
    const canonicalUrl = canonicalLink ? canonicalLink.href : window.location.href;
    const siteUrl = "https://sidelinechiangmai.netlify.app/";
    const orgName = "SidelineChiangmai - รับงาน ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก";
    const mainSchema = {
        "@context": "https://schema.org",
        "@graph": [{"@type":"Organization","@id":`${siteUrl}#organization`,"name":orgName,"url":siteUrl,"logo":{"@type":"ImageObject","url":`${siteUrl}images/logo-sideline-chiangmai.webp`,"width":245,"height":30},"contactPoint":{"@type":"ContactPoint","contactType":"customer support","url":"https://line.me/ti/p/_faNcjQ3xx"}},{"@type":"WebSite","@id":`${siteUrl}#website`,"url":siteUrl,"name":orgName,"description":"รวมโปรไฟล์ไซด์ไลน์เชียงใหม่, ลำปาง, เชียงราย คุณภาพ บริการฟีลแฟน การันตีตรงปก 100% ปลอดภัย ไม่ต้องมัดจำ","publisher":{"@id":`${siteUrl}#organization`},"inLanguage":"th-TH"},{"@type":"WebPage","@id":`${canonicalUrl}#webpage`,"url":canonicalUrl,"name":pageTitle,"isPartOf":{"@id":`${siteUrl}#website`},"primaryImageOfPage":{"@type":"ImageObject","url":`${site.url}images/sideline-chiangmai-social-preview.webp`},"breadcrumb":{"@id":`${canonicalUrl}#breadcrumb`}},{"@type":"LocalBusiness","@id":`${siteUrl}#localbusiness`,"name":"SidelineChiangmai - ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก","image":`${siteUrl}images/sideline-chiangmai-social-preview.webp`,"url":siteUrl,"priceRange":"฿฿","address":{"@type":"PostalAddress","streetAddress":"เจ็ดยอด","addressLocality":"ช้างเผือก","addressRegion":"เชียงใหม่","postalCode":"50300","addressCountry":"TH"},"geo":{"@type":"GeoCoordinates","latitude":"18.814361","longitude":"98.972389"},"hasMap":"https://maps.app.goo.gl/3y8gyAtamm8YSagi9","openingHours":["Mo-Su 00:00-24:00"],"areaServed":[{"@type":"City","name":"Chiang Mai"},{"@type":"City","name":" Lampang"},{"@type":"City","name":"Chiang Rai"}]},{"@type":"BreadcrumbList","@id":`${canonicalUrl}#breadcrumb`,"itemListElement":[{"@type":"ListItem","position":1,"name":"หน้าแรก","item":siteUrl}]},{"@type":"FAQPage","@id":`${siteUrl}faq.html#faq`,"mainEntity":[{"@type":"Question","name":"บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?","acceptedAnswer":{"@type":"Answer","text":"Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้าทุกท่าน ข้อมูลการติดต่อและการจองของท่านจะถูกเก็บรักษาเป็นความลับอย่างเข้มงวด"}},{"@type":"Question","name":"จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการไซด์ไลน์หรือไม่?","acceptedAnswer":{"@type":"Answer","text":"เพื่อความสบายใจของลูกค้าทุกท่าน ท่านไม่จำเป็นต้องโอนเงินมัดจำใดๆ ทั้งสิ้น สามารถชำระค่าบริการเต็มจำนวนโดยตรงกับน้องๆ ที่หน้างานได้เลย"}},{"@type":"Question","name":"น้องๆ ไซด์ไลน์เชียงใหม่ตรงปกตามรูปที่แสดงในโปรไฟล์จริงหรือ?","acceptedAnswer":{"@type":"Answer","text":"เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพของน้องๆ ทุกคนอย่างละเอียด Sideline Chiang Mai กล้าการันตีว่าน้องๆ ตรงปก 100% หากพบปัญหาใดๆ สามารถแจ้งทีมงานเพื่อดำเนินการแก้ไขได้ทันที"}}]}]
    };
    const oldSchema = document.querySelector('script[type="application/ld+json"]');
    if (oldSchema) oldSchema.remove();
    const schemaContainer = document.createElement('script');
    schemaContainer.type = 'application/ld+json';
    schemaContainer.textContent = JSON.stringify(mainSchema);
    document.head.appendChild(schemaContainer);
}

// --- จุดเริ่มต้นการทำงานของสคริปต์ ---
window.addEventListener('load', initializeApp);