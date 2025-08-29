import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";

gsap.registerPlugin(ScrollTrigger);

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
    const STORAGE_BUCKET = 'profile-images';
    const PROFILES_PER_PAGE = 12;
    const PROFILES_PER_PROVINCE_ON_INDEX = 8;
    const SKELETON_CARD_COUNT = 8;
    const LAST_PROVINCE_KEY = 'sidelinecm_last_province'; // Key for localStorage

    // --- STATE & CACHE ---
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    let allProfiles = [];
    let provincesMap = new Map();
    let lastFocusedElement;

    // --- DOM ELEMENT CACHE ---
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
    };

    // --- INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', main);

    async function main() {
        initThemeToggle();
        initMobileMenu();
        initAgeVerification();
        initHeaderScrollEffect();
        updateActiveNavLinks();
        generateFullSchema();
        init3dCardHover(); // ✅ Initialize 3D hover effect

        const currentPage = dom.body.dataset.page;
        if (currentPage === 'home' || currentPage === 'profiles') {
            showLoadingState();
            const success = await fetchData();
            hideLoadingState();

            if (success) {
                initSearchAndFilters(); // Now handles URL params and localStorage
                initLightbox();
                if (dom.retryFetchBtn) {
                    dom.retryFetchBtn.addEventListener('click', async () => {
                        showLoadingState();
                        const retrySuccess = await fetchData();
                        hideLoadingState();
                        if (retrySuccess) {
                            applyFilters(false); // Don't update URL on retry
                            if (dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'none';
                        } else {
                            showErrorState();
                        }
                    });
                }
            } else {
                showErrorState();
            }

            if (currentPage === 'home' && success) {
                gsap.from(['#hero-h1', '#hero-p', '#hero-form'], {
                    y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.3
                });
            }
        } else {
            initScrollAnimations();
        }

        const yearSpan = document.getElementById('currentYearDynamic');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
        
        dom.body.classList.add('loaded');
    }

    // --- UI STATE FUNCTIONS ---
    function showLoadingState() {
        if(dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'none';
        if(dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
        if(dom.profilesDisplayArea) dom.profilesDisplayArea.innerHTML = '';
        if(dom.loadingPlaceholder) {
            const grid = dom.loadingPlaceholder.querySelector('.grid');
            if (grid) {
                grid.innerHTML = Array(SKELETON_CARD_COUNT).fill('<div class="skeleton-card"></div>').join('');
            }
            dom.loadingPlaceholder.style.display = 'block';
        }
    }
    
    function hideLoadingState() {
        if(dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
    }

    function showErrorState() {
        if(dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
        if(dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'block';
    }

    // --- DATA FETCHING ---
    async function fetchData() {
        try {
            const [profilesRes, provincesRes] = await Promise.all([
                supabase.from('profiles').select('*').order('isfeatured', { ascending: false }).order('lastUpdated', { ascending: false }),
                supabase.from('provinces').select('*').order('nameThai', { ascending: true })
            ]);

            if (profilesRes.error) throw profilesRes.error;
            if (provincesRes.error) throw provincesRes.error;

            (provincesRes.data || []).forEach(p => provincesMap.set(p.key, p.nameThai));

            allProfiles = (profilesRes.data || []).map(p => {
                const imageObjects = [p.imagePath, ...(p.galleryPaths || [])]
                    .filter(Boolean)
                    .map(path => {
                        const originalUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
                        // ✅ [PERFORMANCE] Generate srcset for responsive images
                        const srcset = [300, 600, 900]
                            .map(width => `${originalUrl}?width=${width}&quality=80 ${width}w`)
                            .join(', ');
                        return {
                            src: `${originalUrl}?width=600&quality=80`, // Fallback src
                            srcset: srcset,
                        };
                    });
                
                if (imageObjects.length === 0) {
                    imageObjects.push({ src: '/images/placeholder-profile-card.webp', srcset: '' });
                }

                const altText = p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name} จังหวัด ${provincesMap.get(p.provinceKey) || ''}`;
                return { ...p, images: imageObjects, altText };
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

    // --- SEARCH & FILTERS ---
    function initSearchAndFilters() {
        if (!dom.searchForm) {
            applyFilters(false); // Initial render without updating URL
            return;
        }

        // ✅ [UX] Populate filters from URL on page load
        const urlParams = new URLSearchParams(window.location.search);
        dom.searchInput.value = urlParams.get('q') || '';
        dom.provinceSelect.value = urlParams.get('province') || '';
        dom.availabilitySelect.value = urlParams.get('availability') || '';
        dom.featuredSelect.value = urlParams.get('featured') || '';

        // ✅ [UX] If no province in URL, try to load from localStorage for personalization
        if (!dom.provinceSelect.value) {
            const lastProvince = localStorage.getItem(LAST_PROVINCE_KEY);
            if (lastProvince) {
                dom.provinceSelect.value = lastProvince;
            }
        }

        const debouncedFilter = (() => {
            let timeout;
            return () => { clearTimeout(timeout); timeout = setTimeout(() => applyFilters(true), 350); };
        })();
        
        dom.searchForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(true); });
        dom.resetSearchBtn.addEventListener('click', () => { 
            dom.searchForm.reset(); 
            applyFilters(true); 
        });

        dom.searchInput.addEventListener('input', debouncedFilter);
        dom.provinceSelect.addEventListener('change', () => applyFilters(true));
        dom.availabilitySelect.addEventListener('change', () => applyFilters(true));
        dom.featuredSelect.addEventListener('change', () => applyFilters(true));
        
        applyFilters(false); // Initial render based on URL/localStorage values
    }

    function applyFilters(updateUrl = true) {
        const searchTerm = dom.searchInput?.value.toLowerCase().trim() || '';
        const selectedProvince = dom.provinceSelect?.value || '';
        const selectedAvailability = dom.availabilitySelect?.value || '';
        const isFeaturedOnly = dom.featuredSelect?.value === 'true';

        // ✅ [UX] Save last selected province to localStorage
        if (selectedProvince) {
            localStorage.setItem(LAST_PROVINCE_KEY, selectedProvince);
        }

        // ✅ [UX] Update URL with current filter state
        if (updateUrl) {
            const urlParams = new URLSearchParams();
            if (searchTerm) urlParams.set('q', searchTerm);
            if (selectedProvince) urlParams.set('province', selectedProvince);
            if (selectedAvailability) urlParams.set('availability', selectedAvailability);
            if (isFeaturedOnly) urlParams.set('featured', 'true');
            
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({}, '', newUrl);
        }

        const filtered = allProfiles.filter(p => 
            (!searchTerm || p.name?.toLowerCase().includes(searchTerm) || p.location?.toLowerCase().includes(searchTerm) || p.styleTags?.some(t => t.toLowerCase().includes(searchTerm))) &&
            (!selectedProvince || p.provinceKey === selectedProvince) &&
            (!selectedAvailability || p.availability === selectedAvailability) &&
            (!isFeaturedOnly || p.isfeatured)
        );

        const isSearching = searchTerm || selectedProvince || selectedAvailability || isFeaturedOnly;
        renderProfiles(filtered, isSearching);
    }

    // --- RENDERING ---
    function renderProfiles(filteredProfiles, isSearching) {
        if (!dom.profilesDisplayArea) return;
        const currentPage = dom.body.dataset.page;
        dom.profilesDisplayArea.innerHTML = '';
        dom.noResultsMessage.classList.add('hidden');
    
        if (dom.featuredSection) {
            const featuredProfilesList = allProfiles.filter(p => p.isfeatured);
            if (currentPage === 'home' && !isSearching && featuredProfilesList.length > 0) {
                dom.featuredContainer.innerHTML = '';
                dom.featuredContainer.append(...featuredProfilesList.map(createProfileCard));
                dom.featuredSection.classList.remove('hidden');
                dom.featuredSection.setAttribute('data-animate-on-scroll', '');
            } else {
                dom.featuredSection.classList.add('hidden');
            }
        }
    
        if (filteredProfiles.length === 0) {
            if (currentPage === 'home' || currentPage === 'profiles') {
                dom.noResultsMessage.classList.remove('hidden');
            }
            initScrollAnimations();
            return;
        }
    
        if (currentPage === 'profiles') {
            const gridContainer = document.createElement('div');
            gridContainer.className = 'profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4';
            gridContainer.append(...filteredProfiles.map(createProfileCard));
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
    
                dynamicProvinceOrder.forEach(provinceKey => {
                    if (!provinceKey) return;
                    const provinceProfiles = profilesByProvince[provinceKey] || [];
                    const provinceName = provincesMap.get(provinceKey) || "ไม่ระบุ";
                    const provinceSectionEl = createProvinceSection(provinceKey, provinceName, provinceProfiles);
                    dom.profilesDisplayArea.appendChild(provinceSectionEl);
                });
            }
        }
        initScrollAnimations();
    }

    // --- UI COMPONENT CREATORS ---
    function createProfileCard(profile) {
        const card = document.createElement('div');
        card.className = 'profile-card-new-container'; // Wrapper for perspective
    
        const cardInner = document.createElement('div');
        cardInner.className = 'profile-card-new group cursor-pointer';
        cardInner.setAttribute('data-profile-id', profile.id);
        cardInner.setAttribute('aria-label', `ดูโปรไฟล์ของ ${profile.name}`);
        cardInner.setAttribute('role', 'button');
        cardInner.setAttribute('tabindex', '0');
    
        const mainImage = profile.images[0];
        let availabilityText = profile.availability || "สอบถามคิว";
        let availabilityClass = 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        if (availabilityText.includes('ว่าง') || availabilityText.includes('รับงาน')) {
            availabilityClass = 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        } else if (availabilityText.includes('ไม่ว่าง') || availabilityText.includes('พัก')) {
            availabilityClass = 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        }

        const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l2.034 4.192a.75.75 0 00.564.41l4.625.672c.728.106 1.018.995.494 1.503l-3.348 3.263a.75.75 0 00-.215.664l.79 4.607c.124.724-.636 1.285-1.288.941l-4.135-2.174a.75.75 0 00-.696 0l-4.135 2.174c-.652.344-1.412-.217-1.288-.94l.79-4.607a.75.75 0 00-.215-.665L1.15 9.66c-.524-.508-.234-1.397.494-1.503l4.625-.672a.75.75 0 00.564-.41L9.132 2.884z" clip-rule="evenodd" /></svg>`;
        const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.623-.359 1.445-.835 2.13-1.36.712-.549 1.282-1.148 1.655-1.743.372-.596.59-1.28.59-2.002v-1.996a4.504 4.504 0 00-1.272-3.116A4.47 4.47 0 0013.5 4.513V4.5C13.5 3.12 12.38 2 11 2H9c-1.38 0-2.5 1.12-2.5 2.5v.013a4.47 4.47 0 00-1.728 1.388A4.504 4.504 0 003 9.504v1.996c0 .722.218 1.406.59 2.002.373.595.943 1.194 1.655 1.743.685.525 1.507 1.001 2.13 1.36.254.147.468.27.654.369a5.745 5.745 0 00.28.14l.019.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>`;
    
    // ✅ [PERFORMANCE] Use srcset for responsive images
    cardInner.innerHTML = `
        <img src="${mainImage.src}" srcset="${mainImage.srcset}" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" alt="${profile.altText}" class="card-image" loading="lazy" decoding="async" width="600" height="800" onerror="this.onerror=null;this.src='/images/placeholder-profile.webp';">
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
        
        card.appendChild(cardInner);
        return card;
    }

    // ... (The rest of the component creators remain the same) ...

    function createProvinceSection(key, name, provinceProfiles) {
        const totalCount = provinceProfiles.length;
        const sectionWrapper = document.createElement('div');
        sectionWrapper.className = 'section-content-wrapper bg-secondary-soft';
        sectionWrapper.setAttribute('data-animate-on-scroll', '');
        const mapIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="text-xl" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.623-.359 1.445-.835 2.13-1.36.712-.549 1.282-1.148 1.655-1.743.372-.596.59-1.28.59-2.002v-1.996a4.504 4.504 0 00-1.272-3.116A4.47 4.47 0 0013.5 4.513V4.5C13.5 3.12 12.38 2 11 2H9c-1.38 0-2.5 1.12-2.5 2.5v.013a4.47 4.47 0 00-1.728 1.388A4.504 4.504 0 003 9.504v1.996c0 .722.218 1.406.59 2.002.373.595.943 1.194 1.655 1.743.685.525 1.507 1.001 2.13 1.36.254.147.468.27.654.369a5.745 5.745 0 00.28.14l.019.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>`;
        const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="ml-1 text-xs inline" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 6.28a.75.75 0 111.04-1.06l4.5 4.25a.75.75 0 010 1.06l-4.5 4.25a.75.75 0 11-1.04-1.06l4.158-3.94H3.75A.75.75 0 013 10z" clip-rule="evenodd" /></svg>`;
        sectionWrapper.innerHTML = `
            <div class="p-6 md:p-8">
                <h3 class="text-xl sm:text-2xl font-bold text-secondary flex items-center gap-2.5">
                    ${mapIcon}
                    <span>ไซด์ไลน์${name} รับงาน</span>
                    <span class="text-xs text-muted-foreground font-medium bg-card px-2.5 py-1 rounded-full shadow-sm">${totalCount} โปรไฟล์</span>
                </h3>
                <p class="mt-2 text-sm text-muted-foreground">เลือกดูน้องๆ ที่พร้อมให้บริการในพื้นที่ ${name}</p>
            </div>
            <div class="profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4 px-6 md:px-8 pb-6 md:pb-8"></div>
            <div class="view-more-container px-6 md:px-8 pb-6 md:pb-8 -mt-4 text-center" style="display:none;">
                <a class="font-semibold text-primary hover:underline" href="profiles.html?province=${key}">ดูน้องๆ ใน ${name} ทั้งหมด ${arrowIcon}</a>
            </div>`;
        
        const grid = sectionWrapper.querySelector('.profile-grid');
        const profilesToDisplay = provinceProfiles.slice(0, PROFILES_PER_PROVINCE_ON_INDEX);
        grid.append(...profilesToDisplay.map(createProfileCard));
        const viewMoreContainer = sectionWrapper.querySelector('.view-more-container');
        if (viewMoreContainer && totalCount > PROFILES_PER_PROVINCE_ON_INDEX) {
            viewMoreContainer.style.display = 'block';
        }
        return sectionWrapper;
    }
    
    function createSearchResultSection(profiles) {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-content-wrapper bg-accent';
        wrapper.setAttribute('data-animate-on-scroll', '');
        wrapper.innerHTML = `
            <div class="p-6 md:p-8">
                <h3 class="text-xl sm:text-2xl font-bold text-foreground">ผลการค้นหา</h3>
                <p class="mt-2 text-sm text-muted-foreground">พบ ${profiles.length} โปรไฟล์ที่ตรงกับเงื่อนไข</p>
            </div>
            <div class="profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4 px-6 md:px-8 pb-6 md:pb-8"></div>`;
        const grid = wrapper.querySelector('.profile-grid');
        grid.append(...profiles.map(createProfileCard));
        return wrapper;
    }



// ✅ [PERFORMANCE] Optimized 3D hover effect for profile cards
function init3dCardHover() {
    // ใช้ container ที่เก็บโปรไฟล์ทั้งหมดเป็นตัวดักจับ event
    const cardContainer = document.getElementById('profiles-display-area') || document.body;
    let currentCard = null; // เก็บการ์ดที่กำลัง active อยู่

    cardContainer.addEventListener('mousemove', (e) => {
        // หาการ์ดที่เมาส์กำลังชี้อยู่เท่านั้น
        const targetCard = e.target.closest('.profile-card-new');

        // ถ้าเมาส์ไม่ได้อยู่บนการ์ดใบไหน
        if (!targetCard) {
            // ถ้าเคยมีการ์ดที่ active อยู่ ให้ reset ค่ามันกลับเป็นปกติ
            if (currentCard) {
                currentCard.style.removeProperty('--rotate-x');
                currentCard.style.removeProperty('--rotate-y');
                currentCard.style.removeProperty('--mouse-x');
                currentCard.style.removeProperty('--mouse-y');
                currentCard = null;
            }
            return; // จบการทำงาน
        }

        // คำนวณตำแหน่งและอัปเดตสไตล์เฉพาะการ์ดใบที่ active อยู่เท่านั้น!
        currentCard = targetCard;
        const rect = currentCard.getBoundingClientRect(); // <--- คำนวณแค่ใบเดียว ไม่ใช่ทั้งหมด
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        currentCard.style.setProperty('--mouse-x', `${x}px`);
        currentCard.style.setProperty('--mouse-y', `${y}px`);
        currentCard.style.setProperty('--rotate-x', `${rotateX}deg`);
        currentCard.style.setProperty('--rotate-y', `${rotateY}deg`);
    });

    // เพิ่ม event listener เพื่อ reset การ์ดเมื่อเมาส์ออกจากพื้นที่ container
    cardContainer.addEventListener('mouseleave', () => {
        if (currentCard) {
            currentCard.style.removeProperty('--rotate-x');
            currentCard.style.removeProperty('--rotate-y');
            currentCard.style.removeProperty('--mouse-x');
            currentCard.style.removeProperty('--mouse-y');
            currentCard = null;
        }
    });
}



    // ... (The rest of the initializers remain the same) ...
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
        const menuToggle = document.getElementById('menu-toggle');
        const closeSidebarBtn = document.getElementById('close-sidebar-btn');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('menu-backdrop');
        if (!menuToggle || !sidebar || !backdrop || !closeSidebarBtn) return;
        const openMenu = () => {
            sidebar.classList.add('open');
            sidebar.setAttribute('aria-hidden', 'false');
            sidebar.classList.remove('translate-x-full');
            backdrop.classList.remove('hidden');
            gsap.to(backdrop, { opacity: 1, duration: 0.3 });
            dom.body.style.overflow = 'hidden';
            sidebar.focus();
        };
        const closeMenu = () => {
            sidebar.classList.remove('open');
            gsap.to(backdrop, {
                opacity: 0, duration: 0.3, onComplete: () => {
                    backdrop.classList.add('hidden');
                    sidebar.classList.add('translate-x-full');
                    sidebar.setAttribute('aria-hidden', 'true');
                    dom.body.style.overflow = '';
                }
            });
        };
        menuToggle.addEventListener('click', openMenu);
        closeSidebarBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu();
        });
    }

    function initAgeVerification() {
        const overlay = document.getElementById('age-verification-overlay');
        if (!overlay) return;
        const modalContent = overlay.querySelector('.age-modal-content');
        if (!modalContent || sessionStorage.getItem('ageVerified') === 'true') {
            overlay.classList.add('hidden');
            return;
        }
        overlay.classList.remove('hidden');
        gsap.to(overlay, { opacity: 1, duration: 0.3 });
        gsap.fromTo(modalContent, { scale: 0.9, opacity: 0, y: -20 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 });
        const confirmBtn = document.getElementById('confirmAgeButton');
        const cancelBtn = document.getElementById('cancelAgeButton');
        const closeAction = () => {
             gsap.to(modalContent, { scale: 0.95, opacity: 0, y: 10, duration: 0.3, ease: 'power2.in' });
             gsap.to(overlay, { opacity: 0, duration: 0.3, delay: 0.1, onComplete: () => overlay.classList.add('hidden') });
        }
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                sessionStorage.setItem('ageVerified', 'true');
                closeAction();
            });
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeAction);
        }
    }

    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const wrapper = document.getElementById('lightbox-content-wrapper-el');
        const closeBtn = document.getElementById('closeLightboxBtn');
        if (!lightbox || !wrapper || !closeBtn) return;
        const openAction = (triggerElement) => {
            if (!triggerElement) return;
            const profileId = parseInt(triggerElement.dataset.profileId, 10);
            const profileData = allProfiles.find(p => p.id === profileId);
            if (profileData) {
                lastFocusedElement = triggerElement;
                populateLightbox(profileData);
                lightbox.classList.remove('hidden');
                dom.body.style.overflow = 'hidden';
                gsap.to(lightbox, { opacity: 1, duration: 0.3 });
                gsap.fromTo(wrapper, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
                wrapper.querySelector('button, [href]')?.focus();
            }
        };
        const closeAction = () => {
            if (lightbox.classList.contains('hidden')) return;
            gsap.to(lightbox, { opacity: 0, duration: 0.3, onComplete: () => {
                lightbox.classList.add('hidden');
                dom.body.style.overflow = '';
            }});
            gsap.to(wrapper, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
            lastFocusedElement?.focus();
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
            } else if (event.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                closeAction();
            }
        });
        closeBtn.addEventListener('click', closeAction);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeAction(); });
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
    heroImageEl.src = profileData.images[0].src;
    heroImageEl.srcset = profileData.images[0].srcset;
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
            thumb.src = img.src;
            thumb.srcset = img.srcset;
            thumb.alt = `รูปตัวอย่างที่ ${index + 1} ของ ${profileData.name}`;
            thumb.width = 60;
            thumb.height = 60;
            thumb.className = 'thumbnail';
            if (index === 0) thumb.classList.add('active');
            thumb.addEventListener('click', () => {
                heroImageEl.src = img.src;
                heroImageEl.srcset = img.srcset;
                thumbnailStripEl.querySelector('.thumbnail.active')?.classList.remove('active');
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
    const paletteIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="detail-list-item-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 4a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 4zM10 18a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 0110 18zM5.932 7.033a.75.75 0 011.05-1.07l1.5 1.5a.75.75 0 01-1.05 1.07l-1.5-1.5zM12.95 14.05a.75.75 0 01-1.05 1.07l-1.5-1.5a.75.75 0 011.05-1.07l1.5 1.5zM4 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 014 10zM13.75 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM7.033 12.95a.75.75 0 011.07-1.05l1.5 1.5a.75.75 0 01-1.07 1.05l-1.5-1.5zM14.05 7.05a.75.75 0 01-1.07-1.05l1.5-1.5a.75.75 0 011.07 1.05l-1.5 1.5z"/></svg>`;
    const mapIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="detail-list-item-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.623-.359 1.445-.835 2.13-1.36.712-.549 1.282-1.148 1.655-1.743.372-.596.59-1.28.59-2.002v-1.996a4.504 4.504 0 00-1.272-3.116A4.47 4.47 0 0013.5 4.513V4.5C13.5 3.12 12.38 2 11 2H9c-1.38 0-2.5 1.12-2.5 2.5v.013a4.47 4.47 0 00-1.728 1.388A4.504 4.504 0 003 9.504v1.996c0 .722.218 1.406.59 2.002.373.595.943 1.194 1.655 1.743.685.525 1.507 1.001 2.13 1.36.254.147.468.27.654.369a5.745 5.745 0 00.28.14l.019.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>`;
    const moneyIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="detail-list-item-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 10.837a1 1 0 00-1.5 0 1 1 0 000 1.413l.001.001 2.25 2.25a1 1 0 001.414 0l.001-.001 2.688-2.688a1 1 0 000-1.414 1 1 0 00-1.414 0l-1.937 1.937-1.5-1.5z" /><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1a.5.5 0 000 1h8a.5.5 0 000-1H5z" clip-rule="evenodd" /></svg>`;
    detailsEl.innerHTML = `
        <div class="availability-badge ${availabilityClass}">${availabilityText}</div>
        <div class="stats-grid">
            <div class="stat-item"><div class="label">อายุ</div><div class="value">${profileData.age || '-'} ปี</div></div>
            <div class="stat-item"><div class="label">สัดส่วน</div><div class="value">${profileData.stats || '-'}</div></div>
            <div class="stat-item"><div class="label">สูง/หนัก</div><div class="value">${profileData.height || '-'}/${profileData.weight || '-'}</div></div>
        </div>
        <div class="space-y-1">
            <div class="detail-list-item">${paletteIcon}<div class="value">ผิว: ${profileData.skinTone || '-'}</div></div>
            <div class="detail-list-item">${mapIcon}<div class="value">จังหวัด: ${provincesMap.get(profileData.provinceKey) || ''} (${profileData.location || 'ไม่ระบุ'})</div></div>
            <div class="detail-list-item">${moneyIcon}<div class="value">เรท: ${profileData.rate || 'สอบถาม'}</div></div>
        </div>`;
    if (profileData.lineId) {
        lineLink.href = profileData.lineId.startsWith('http') ? profileData.lineId : `https://line.me/ti/p/${profileData.lineId}`;
        lineLink.style.display = 'inline-flex';
        lineLinkText.textContent = `ติดต่อ ${profileData.name} ผ่าน LINE`;
    } else {
        lineLink.style.display = 'none';
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

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate-on-scroll]');
        if (animatedElements.length === 0) return;
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => {
            if (!el.classList.contains('is-visible')) observer.observe(el);
        });
    }

    function updateActiveNavLinks() {
        const currentPath = window.location.pathname.endsWith('/') ? window.location.pathname.slice(0, -1) || '/' : window.location.pathname;
        const navLinks = document.querySelectorAll('#sidebar nav a, header nav a');
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname.endsWith('/') ? new URL(link.href).pathname.slice(0, -1) || '/' : new URL(link.href).pathname;
            const isActive = linkPath === currentPath;
            link.classList.toggle('active-nav-link', isActive);
        });
    }

    function generateFullSchema() {
        const pageTitle = document.title;
        const canonicalUrl = document.querySelector("link[rel='canonical']")?.href || window.location.href;
        const siteUrl = "https://sidelinechiangmai.netlify.app/";
        const orgName = "Sideline Chiangmai - รับงาน ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก";
        const mainSchema = {
            "@context": "https://schema.org",
            "@graph": [{
                "@type": "Organization",
                "@id": `${siteUrl}#organization`,
                "name": orgName,
                "url": siteUrl,
                "logo": { "@type": "ImageObject", "url": `${siteUrl}images/logo-sideline-chiangmai.webp`, "width": 164, "height": 40 },
                "contactPoint": { "@type": "ContactPoint", "contactType": "customer support", "url": "https://line.me/ti/p/_faNcjQ3xx" }
            }, {
                "@type": "WebSite",
                "@id": `${siteUrl}#website`,
                "url": siteUrl,
                "name": orgName,
                "description": "รวมโปรไฟล์ไซด์ไลน์เชียงใหม่, ลำปาง, เชียงราย คุณภาพ บริการฟีลแฟน การันตีตรงปก 100% ปลอดภัย ไม่ต้องมัดจำ",
                "publisher": { "@id": `${siteUrl}#organization` },
                "inLanguage": "th-TH"
            }, {
                "@type": "WebPage",
                "@id": `${canonicalUrl}#webpage`,
                "url": canonicalUrl,
                "name": pageTitle,
                "isPartOf": { "@id": `${siteUrl}#website` },
                "primaryImageOfPage": { "@type": "ImageObject", "url": `${siteUrl}images/sideline-chiangmai-social-preview.webp` },
                "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` }
            }, {
                "@type": "LocalBusiness",
                "@id": `${siteUrl}#localbusiness`,
                "name": "SidelineChiangmai - ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก",
                "image": `${siteUrl}images/sideline-chiangmai-social-preview.webp`,
                "url": siteUrl,
                "priceRange": "฿฿",
                "address": { "@type": "PostalAddress", "streetAddress": "เจ็ดยอด", "addressLocality": "ช้างเผือก", "addressRegion": "เชียงใหม่", "postalCode": "50300", "addressCountry": "TH" },
                "geo": { "@type": "GeoCoordinates", "latitude": "18.814361", "longitude": "98.972389" },
                "hasMap": "https://maps.app.goo.gl/3y8gyAtamm8YSagi9",
                "openingHours": ["Mo-Su 00:00-24:00"],
                "areaServed": [{"@type":"City","name":"Chiang Mai"},{"@type":"City","name":"Bangkok"},{"@type":"City","name":" Lampang"},{"@type":"City","name":"Chiang Rai"},{"@type":"City","name":"Pattaya"},{"@type":"City","name":"Phuket"}]
            }, {
                "@type": "BreadcrumbList",
                "@id": `${canonicalUrl}#breadcrumb`,
                "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": siteUrl }]
            }, {
                "@type": "FAQPage",
                "@id": `${siteUrl}#faq`,
                "mainEntity": [{
                    "@type": "Question",
                    "name": "บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้าทุกท่าน ข้อมูลการติดต่อและการจองของท่านจะถูกเก็บรักษาเป็นความลับอย่างเข้มงวด" }
                }, {
                    "@type": "Question",
                    "name": "จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการไซด์ไลน์หรือไม่?",
                    "acceptedAnswer": { "@type": "Answer", "text": "เพื่อความสบายใจของลูกค้าทุกท่าน ท่านไม่จำเป็นต้องโอนเงินมัดจำใดๆ ทั้งสิ้น สามารถชำระค่าบริการเต็มจำนวนโดยตรงกับน้องๆ ที่หน้างานได้เลย" }
                }, {
                    "@type": "Question",
                    "name": "น้องๆ ไซด์ไลน์เชียงใหม่ตรงปกตามรูปที่แสดงในโปรไฟล์จริงหรือ?",
                    "acceptedAnswer": { "@type": "Answer", "text": "เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพของน้องๆ ทุกคนอย่างละเอียด Sideline Chiang Mai กล้าการันตีว่าน้องๆ ตรงปก 100% หากพบปัญหาใดๆ สามารถแจ้งทีมงานเพื่อดำเนินการแก้ไขได้ทันที" }
                }]
            }]
        };
        const schemaContainer = document.createElement('script');
        schemaContainer.type = 'application/ld+json';
        schemaContainer.textContent = JSON.stringify(mainSchema);
        const oldSchema = document.querySelector('script[type="application/ld+json"]');
        if (oldSchema) oldSchema.remove();
        document.head.appendChild(schemaContainer);
    }

})();