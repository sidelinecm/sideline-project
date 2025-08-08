// --- main.js (ฉบับปรับปรุงประสิทธิภาพขั้นสูง) ---
// ผู้สร้าง: Gemini (ปรับปรุงสำหรับ sidelinechiangmai.netlify.app)
// เวอร์ชัน: 2.0 (Performance-First)
// คำอธิบาย: ไฟล์นี้ถูกปรับโครงสร้างใหม่ทั้งหมดเพื่อเน้นประสิทธิภาพสูงสุด
// โดยใช้กลยุทธ์การหน่วงเวลาโหลดสคริปต์ที่ไม่จำเป็น (GSAP, Analytics)
// เพื่อแก้ปัญหา Main-Thread Blocking และเพิ่มคะแนน Core Web Vitals

"use strict";

// =================================================================
// SECTION 1: การประกาศตัวแปรและค่าคงที่
// =================================================================

let createClient, gsap, ScrollTrigger, supabase;

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const STORAGE_BUCKET = 'profile-images';
const PROFILES_PER_PROVINCE_ON_INDEX = 8;
const SKELETON_CARD_COUNT = 8;
const ABOVE_THE_FOLD_COUNT = 4;

let allProfiles = [];
let provincesMap = new Map();
let lastFocusedElement = null;
let isMenuOpen = false;
let isLightboxOpen = false;

// --- รวมศูนย์กลางการจัดการ DOM Elements เพื่อประสิทธิภาพ ---
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
// SECTION 2: ฟังก์ชันหลักในการเริ่มต้นแอปพลิเคชัน (INITIALIZATION)
// =================================================================

/**
 * ฟังก์ชันหลักที่ทำงานเมื่อหน้าเว็บโหลดเสร็จ
 * จะเริ่มต้นการทำงานที่จำเป็นก่อน แล้วจึงหน่วงเวลาโหลดส่วนที่เหลือ
 */
async function initializeApp() {
    performance.mark('initializeApp-start');

    // --- ส่วนที่ทำงานทันที (Critical Path) ---
    initCriticalUI(); // เริ่มต้น UI ที่สำคัญ เช่น Theme, Mobile Menu
    await loadCoreScripts(); // โหลด Supabase ซึ่งจำเป็นต่อการแสดงข้อมูล
    initAgeVerification(); // เริ่มต้นการตรวจสอบอายุ (เวอร์ชัน CSS ที่เร็ว)
    
    // --- ส่วนที่ทำงานกับข้อมูลหลัก ---
    const currentPage = dom.body.dataset.page;
    if (['home', 'profiles'].includes(currentPage)) {
        showLoadingState();
        const success = await fetchData();
        if (success) {
            initSearchAndFilters();
            initLightbox(); // เริ่มต้น lightbox (แต่ animation จะยังไม่ทำงานจนกว่า GSAP จะโหลด)
            if (dom.retryFetchBtn) dom.retryFetchBtn.addEventListener('click', handleRetry);
        } else {
            showErrorState();
        }
    }

    generateFullSchema();
    
    if (dom.yearSpan) dom.yearSpan.textContent = new Date().getFullYear();
    dom.body.classList.add('loaded');

    // --- [PERFORMANCE] หน่วงเวลาการโหลดสคริปต์ที่ไม่จำเป็น ---
    // จะเริ่มทำงานหลังจากหน้าเว็บแสดงผลเสร็จแล้ว 2.5 วินาที
    setTimeout(loadDelayedScripts, 2500);

    performance.mark('initializeApp-end');
    performance.measure('initializeApp', 'initializeApp-start', 'initializeApp-end');
}


// =================================================================
// SECTION 3: การจัดการสคริปต์และข้อมูล (SCRIPTS & DATA HANDLING)
// =================================================================

/**
 * โหลดสคริปต์ที่ไม่สำคัญหลังจากหน้าเว็บโต้ตอบได้แล้ว
 * นี่คือหัวใจของการแก้ปัญหา Performance
 */
function loadDelayedScripts() {
    // 1. เริ่มต้น Scroll Animations (ซึ่งจะโหลด GSAP โดยอัตโนมัติ)
    initScrollAnimations();

    // 2. โหลด Google Analytics
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-H3BT9WPRK5';
    document.head.appendChild(gtagScript);

    const gtagInlineScript = document.createElement('script');
    gtagInlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-H3BT9WPRK5', { anonymize_ip: true });
    `;
    document.head.appendChild(gtagInlineScript);
}


/**
 * โหลดสคริปต์ที่จำเป็นที่สุด (Supabase)
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
 * ดึงข้อมูลโปรไฟล์และจังหวัดจาก Supabase
 */
async function fetchData() {
    if (!supabase) {
        console.error("Supabase client is not available.");
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

        const provinceSelect = document.getElementById('search-province');
        if (provinceSelect && provinceSelect.options.length <= 1) {
            provincesRes.data.forEach(prov => {
                const option = document.createElement('option');
                option.value = prov.key;
                option.textContent = prov.nameThai;
                provinceSelect.appendChild(option);
            });
        }
        return true;
    } catch (error) {
        console.error('CRITICAL: เกิดข้อผิดพลาดในการดึงข้อมูลจาก Supabase:', error);
        return false;
    }
}


// =================================================================
// SECTION 4: การจัดการ UI และการแสดงผล (UI & RENDERING)
// =================================================================

/**
 * เริ่มต้น UI ที่จำเป็นทั้งหมดในครั้งเดียว
 */
function initCriticalUI() {
    initThemeToggle();
    initMobileMenu();
    initHeaderScrollEffect();
    updateActiveNavLinks();
}

/**
 * [PERFORMANCE] Modal ยืนยันอายุเวอร์ชันใหม่ ไม่ใช้ GSAP
 */
function initAgeVerification() {
    if (!dom.ageVerificationOverlay || sessionStorage.getItem('ageVerified') === 'true') {
        return;
    }

    const modalContent = dom.ageVerificationOverlay.querySelector('.age-modal-content');
    dom.ageVerificationOverlay.classList.remove('hidden');
    
    // ใช้ CSS Transition ที่ตั้งค่าไว้ใน styles.css
    setTimeout(() => {
        dom.ageVerificationOverlay.style.opacity = '1';
        if(modalContent) modalContent.style.transform = 'scale(1)';
    }, 10); // หน่วงเวลาเล็กน้อยเพื่อให้ browser จับ transition ได้

    const closeAction = (verified) => {
        if (verified) {
            sessionStorage.setItem('ageVerified', 'true');
        }

        const onComplete = () => {
            dom.ageVerificationOverlay.classList.add('hidden');
            if (!verified) {
                try {
                    window.history.back();
                } catch(e) {
                    window.location.href = 'https://www.google.com';
                }
            }
        };
        
        // ใช้ CSS Transition ตอนปิด
        dom.ageVerificationOverlay.style.opacity = '0';
        if(modalContent) modalContent.style.transform = 'scale(0.95)';
        setTimeout(onComplete, 300); // 300ms คือเวลา transition ใน CSS
    };

    if (dom.confirmAgeButton) dom.confirmAgeButton.addEventListener('click', () => closeAction(true));
    if (dom.cancelAgeButton) dom.cancelAgeButton.addEventListener('click', () => closeAction(false));
}


/**
 * แสดง/ซ่อนสถานะต่างๆ ของ UI
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

function hideLoadingState() {
    if (dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
}

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
        const displayLogic = {
            'profiles': () => {
                const gridContainer = document.createElement('div');
                gridContainer.className = 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';
                gridContainer.append(...filteredProfiles.map((profile, index) => createProfileCard(profile, index)));
                dom.profilesDisplayArea.appendChild(gridContainer);
            },
            'home': () => {
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
                    
                    let dynamicProvinceOrder = [...new Set(filteredProfiles.map(p => p.provinceKey))].filter(Boolean);
                    let accumulatedIndex = dom.featuredContainer ? dom.featuredContainer.children.length : 0;

                    dynamicProvinceOrder.forEach(provinceKey => {
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
        };
        if (displayLogic[currentPage]) {
            displayLogic[currentPage]();
        }
    }
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


// =================================================================
// SECTION 5: ตัวจัดการเหตุการณ์และฟังก์ชันเสริม (EVENT HANDLERS & HELPERS)
// =================================================================

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
 * เริ่มต้นการทำงานของระบบค้นหาและฟิลเตอร์
 */
function initSearchAndFilters() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) {
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

    searchForm.addEventListener('submit', (e) => e.preventDefault());
    
    const searchElements = {
        'search-keyword': 'input',
        'search-province': 'change',
        'search-availability': 'change',
        'search-featured': 'change',
    };

    for (const id in searchElements) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(searchElements[id], debouncedFilter);
        }
    }
    
    const resetSearchBtn = document.getElementById('reset-search-btn');
    if(resetSearchBtn) {
        resetSearchBtn.addEventListener('click', () => {
            if(searchForm) searchForm.reset();
            applyFilters();
        });
    }

    applyFilters();
}

/**
 * กรองข้อมูลโปรไฟล์ตามเงื่อนไข
 */
function applyFilters() {
    const getVal = (id) => document.getElementById(id)?.value || '';
    
    const searchTerm = getVal('search-keyword').toLowerCase().trim();
    const selectedProvince = getVal('search-province');
    const selectedAvailability = getVal('search-availability');
    const isFeaturedOnly = getVal('search-featured') === 'true';

    const filtered = allProfiles.filter(p =>
        (!searchTerm || (p.name?.toLowerCase().includes(searchTerm)) || (p.location?.toLowerCase().includes(searchTerm)) || (p.styleTags?.some(t => t.toLowerCase().includes(searchTerm)))) &&
        (!selectedProvince || p.provinceKey === selectedProvince) &&
        (!selectedAvailability || p.availability === selectedAvailability) &&
        (!isFeaturedOnly || p.isfeatured)
    );
    
    const isSearching = searchTerm || selectedProvince || selectedAvailability || isFeaturedOnly;
    
    renderProfiles(filtered, isSearching);
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
    document.addEventListener('keydown', (e) => e.key === 'Escape' && isMenuOpen && closeMenu());
}

/**
 * เริ่มต้นการทำงานของ Lightbox
 */
function initLightbox() {
    if (!dom.lightbox) return;

    const openAction = async (triggerElement) => {
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

            await loadAnimationScripts(); // โหลด GSAP เมื่อจำเป็นเท่านั้น
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

        if (gsap && dom.lightboxContentWrapperEl) {
            gsap.to(dom.lightboxContentWrapperEl, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
            gsap.to(dom.lightbox, { opacity: 0, duration: 0.3, onComplete });
        } else {
            dom.lightbox.style.opacity = '0';
            if (dom.lightboxContentWrapperEl) dom.lightboxContentWrapperEl.style.transform = 'scale(0.95)';
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
    
    if(dom.closeLightboxBtn) dom.closeLightboxBtn.addEventListener('click', closeAction);
    dom.lightbox.addEventListener('click', e => e.target === dom.lightbox && closeAction());
}

/**
 * เติมข้อมูลของโปรไฟล์ที่เลือกลงใน Lightbox
 */
function populateLightbox(profileData) {
    const setContent = (id, content) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = content;
    };
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    const setAttr = (id, attr, value) => {
        const el = document.getElementById(id);
        if (el) el[attr] = value;
    };
    const setStyle = (id, prop, value) => {
        const el = document.getElementById(id);
        if(el) el.style[prop] = value;
    }

    setText('lightbox-header-title', `โปรไฟล์: ${profileData.name || 'N/A'}`);
    setText('lightbox-profile-name-main', profileData.name || 'N/A');
    setAttr('lightboxHeroImage', 'src', profileData.images[0]?.large || '/images/placeholder-profile.webp');
    setAttr('lightboxHeroImage', 'alt', profileData.altText);
    
    setText('lightboxQuote', profileData.quote ? `"${profileData.quote}"` : '');
    setStyle('lightboxQuote', 'display', profileData.quote ? 'block' : 'none');

    setContent('lightboxDescriptionVal', profileData.description ? profileData.description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม');

    const thumbnailStripEl = document.getElementById('lightboxThumbnailStrip');
    if(thumbnailStripEl){
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
        tagsEl.innerHTML = '';
        const hasTags = profileData.styleTags && profileData.styleTags.length > 0;
        if (hasTags) {
            tagsEl.innerHTML = profileData.styleTags.map(tag => `<span class="bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full">${tag}</span>`).join('');
        }
        tagsEl.style.display = hasTags ? 'flex' : 'none';
    }

    const detailsEl = document.getElementById('lightboxDetailsCompact');
    if(detailsEl) {
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

    const lineLink = document.getElementById('lightboxLineLink');
    if (lineLink) {
        if (profileData.lineId) {
            lineLink.href = profileData.lineId.startsWith('http') ? profileData.lineId : `https://line.me/ti/p/${profileData.lineId}`;
            lineLink.style.display = 'inline-flex';
            setText('lightboxLineLinkText', `ติดต่อ ${profileData.name} ผ่าน LINE`);
        } else {
            lineLink.style.display = 'none';
        }
    }
}

/**
 * เพิ่ม/ลดเงาที่ Header เมื่อ scroll
 */
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
    handleScroll(); // Run on init
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
            // Fails silently if a link is invalid
        }
    });
}


// =================================================================
// SECTION 6: ANIMATIONS & SEO
// =================================================================

/**
 * [PERFORMANCE] โหลดสคริปต์สำหรับ Animation (GSAP)
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
        console.error('Error loading animation scripts (GSAP). Animations will be disabled.', error);
    }
}

/**
 * เริ่มต้น Animation ที่จะทำงานเมื่อ scroll (จะถูกเรียกใช้แบบหน่วงเวลา)
 */
async function initScrollAnimations() {
    await loadAnimationScripts();
    if (!gsap) return;

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollTrigger.refresh();

    // Card fade-in animation
    const animatedElements = document.querySelectorAll('[data-animate-on-scroll]');
    animatedElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 95%",
                toggleActions: "play none none none",
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out",
        });
    });
    
    // Hero section text animation
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
            delay: 0.2
        });
    }
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
        "@graph": [{"@type":"Organization","@id":`${siteUrl}#organization`,"name":orgName,"url":siteUrl,"logo":{"@type":"ImageObject","url":`${siteUrl}images/logo-sideline-chiangmai.webp`,"width":245,"height":30},"contactPoint":{"@type":"ContactPoint","contactType":"customer support","url":"https://line.me/ti/p/_faNcjQ3xx"}},{"@type":"WebSite","@id":`${siteUrl}#website`,"url":siteUrl,"name":orgName,"description":"รวมโปรไฟล์ไซด์ไลน์เชียงใหม่, ลำปาง, เชียงราย คุณภาพ บริการฟีลแฟน การันตีตรงปก 100% ปลอดภัย ไม่ต้องมัดจำ","publisher":{"@id":`${siteUrl}#organization`},"inLanguage":"th-TH"},{"@type":"WebPage","@id":`${canonicalUrl}#webpage`,"url":canonicalUrl,"name":pageTitle,"isPartOf":{"@id":`${siteUrl}#website`},"primaryImageOfPage":{"@type":"ImageObject","url":`${siteUrl}images/sideline-chiangmai-social-preview.webp`},"breadcrumb":{"@id":`${canonicalUrl}#breadcrumb`}},{"@type":"LocalBusiness","@id":`${siteUrl}#localbusiness`,"name":"SidelineChiangmai - ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก","image":`${siteUrl}images/sideline-chiangmai-social-preview.webp`,"url":siteUrl,"priceRange":"฿฿","address":{"@type":"PostalAddress","streetAddress":"เจ็ดยอด","addressLocality":"ช้างเผือก","addressRegion":"เชียงใหม่","postalCode":"50300","addressCountry":"TH"},"geo":{"@type":"GeoCoordinates","latitude":"18.814361","longitude":"98.972389"},"hasMap":"https://maps.app.goo.gl/3y8gyAtamm8YSagi9","openingHours":["Mo-Su 00:00-24:00"],"areaServed":[{"@type":"City","name":"Chiang Mai"},{"@type":"City","name":" Lampang"},{"@type":"City","name":"Chiang Rai"}]},{"@type":"BreadcrumbList","@id":`${canonicalUrl}#breadcrumb`,"itemListElement":[{"@type":"ListItem","position":1,"name":"หน้าแรก","item":siteUrl}]},{"@type":"FAQPage","@id":`${siteUrl}faq.html#faq`,"mainEntity":[{"@type":"Question","name":"บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?","acceptedAnswer":{"@type":"Answer","text":"Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้าทุกท่าน ข้อมูลการติดต่อและการจองของท่านจะถูกเก็บรักษาเป็นความลับอย่างเข้มงวด"}},{"@type":"Question","name":"จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการไซด์ไลน์หรือไม่?","acceptedAnswer":{"@type":"Answer","text":"เพื่อความสบายใจของลูกค้าทุกท่าน ท่านไม่จำเป็นต้องโอนเงินมัดจำใดๆ ทั้งสิ้น สามารถชำระค่าบริการเต็มจำนวนโดยตรงกับน้องๆ ที่หน้างานได้เลย"}},{"@type":"Question","name":"น้องๆ ไซด์ไลน์เชียงใหม่ตรงปกตามรูปที่แสดงในโปรไฟล์จริงหรือ?","acceptedAnswer":{"@type":"Answer","text":"เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพของน้องๆ ทุกคนอย่างละเอียด Sideline Chiang Mai กล้าการันตีว่าน้องๆ ตรงปก 100% หากพบปัญหาใดๆ สามารถแจ้งทีมงานเพื่อดำเนินการแก้ไขได้ทันที"}}]}]
    };
    const oldSchema = document.querySelector('script[type="application/ld+json"]');
    if (oldSchema) oldSchema.remove();
    const schemaContainer = document.createElement('script');
    schemaContainer.type = 'application/ld+json';
    schemaContainer.textContent = JSON.stringify(mainSchema);
    document.head.appendChild(schemaContainer);
}

// =================================================================
// SECTION 7: จุดเริ่มต้นการทำงาน (ENTRY POINT)
// =================================================================
document.addEventListener('DOMContentLoaded', initializeApp);