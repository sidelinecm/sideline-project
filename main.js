// --- PART 1: IMMEDIATE UI SETUP (Lightweight) ---
// This code runs as soon as the HTML is ready.
// It sets up basic UI that doesn't depend on heavy libraries.
document.addEventListener('DOMContentLoaded', () => {
    initializeStaticUI();

    let heavyScriptsInitialized = false;
    const initializeHeavyScripts = () => {
        if (heavyScriptsInitialized) return;
        heavyScriptsInitialized = true;
        console.log("User interaction detected. Loading heavy scripts (Supabase, GSAP)...");
        runFullApp(); 
    };

    // Triggers to load the main application logic
    window.addEventListener('scroll', initializeHeavyScripts, { once: true });
    window.addEventListener('mousemove', initializeHeavyScripts, { once: true });
    window.addEventListener('touchstart', initializeHeavyScripts, { once: true });
    
    // Fallback timer: If no interaction after 3.5 seconds, load it anyway.
    setTimeout(initializeHeavyScripts, 3500);
});


// --- PART 2: STATIC UI INITIALIZATION ---
// Functions that set up the basic, non-dynamic parts of the site.
function initializeStaticUI() {
    // This function runs immediately without waiting for heavy libraries.
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    if (themeToggleBtns.length > 0) {
        const html = document.documentElement;
        const sunIcon = `<svg class="sun-icon text-lg" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        const moonIcon = `<svg class="moon-icon text-lg" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        const applyTheme = (theme) => {
            html.classList.toggle('dark', theme === 'dark');
            themeToggleBtns.forEach(btn => { btn.innerHTML = theme === 'dark' ? moonIcon : sunIcon; });
        };
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyTheme(savedTheme);
        themeToggleBtns.forEach(btn => btn.addEventListener('click', () => {
            const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        }));
    }

    const yearSpan = document.getElementById('currentYearDynamic');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    // Fade in the body once the basic styles are likely applied
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    document.body.classList.remove('opacity-0');
}

// --- PART 3: THE FULL APPLICATION (Heavy) ---
// This function contains EVERYTHING that requires Supabase and GSAP.
// It will only be called after user interaction.
async function runFullApp() {
    
    // Dynamically import the heavy libraries
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    const { gsap } = await import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm");
    const { ScrollTrigger } = await import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm");
    gsap.registerPlugin(ScrollTrigger);

    // --- All original variables and functions from your first main.js ---
    const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY8MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
    const STORAGE_BUCKET = 'profile-images';
    const PROFILES_PER_PROVINCE_ON_INDEX = 8;
    const SKELETON_CARD_COUNT = 8;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    let allProfiles = [];
    let provincesMap = new Map();
    let lastFocusedElement;

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
    
    async function initializeApp() {
        initMobileMenuWithGsap(gsap);
        initAgeVerificationWithGsap(gsap);
        initHeaderScrollEffect();
        updateActiveNavLinks();
        generateFullSchema();

        const currentPage = dom.body.dataset.page;
        if (currentPage === 'home' || currentPage === 'profiles') {
            showLoadingState();
            const success = await fetchData();
            hideLoadingState();

            if (success) {
                initSearchAndFilters();
                initLightbox(gsap);
                if (dom.retryFetchBtn) {
                    dom.retryFetchBtn.addEventListener('click', async () => {
                        showErrorState(false); // Hide error
                        showLoadingState();
                        const retrySuccess = await fetchData();
                        hideLoadingState();
                        if (retrySuccess) applyFilters();
                        else showErrorState(true); // Show error
                    });
                }
                if (currentPage === 'home') {
                     gsap.from(['#hero-h1', '#hero-p', '#hero-form'], { y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.3 });
                }
            } else {
                showErrorState(true);
            }
        } else {
            initScrollAnimations(gsap);
        }
    }

    function showLoadingState() {
        if (dom.loadingPlaceholder) {
            const grid = dom.loadingPlaceholder.querySelector('.grid');
            if (grid) {
                grid.innerHTML = Array(SKELETON_CARD_COUNT).fill('<div class="skeleton-card"></div>').join('');
            }
            dom.loadingPlaceholder.style.display = 'block';
        }
    }

    function hideLoadingState() {
        if (dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
    }

    function showErrorState(show = true) {
        if (dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = show ? 'block' : 'none';
    }
    
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
                const imageUrls = [p.imagePath, ...(p.galleryPaths || [])].filter(Boolean).map(path => 
                    `${supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl}?width=600&quality=80`
                );
                if (imageUrls.length === 0) imageUrls.push('/images/placeholder-profile-card.webp');
                const altText = p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name} จังหวัด ${provincesMap.get(p.provinceKey) || ''}`;
                return { ...p, images: imageUrls, altText };
            });

            if (dom.provinceSelect && dom.provinceSelect.options.length <= 1) {
                provincesRes.data.forEach(prov => {
                    dom.provinceSelect.appendChild(new Option(prov.nameThai, prov.key));
                });
            }
            return true;
        } catch (error) {
            console.error('CRITICAL: Error fetching data from Supabase:', error);
            return false;
        }
    }

    function initSearchAndFilters() {
        if (!dom.searchForm) { applyFilters(); return; }
        const debouncedFilter = (() => {
            let timeout;
            return () => { clearTimeout(timeout); timeout = setTimeout(applyFilters, 350); };
        })();
        dom.searchForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(); });
        dom.resetSearchBtn?.addEventListener('click', () => { dom.searchForm.reset(); applyFilters(); });
        dom.searchInput?.addEventListener('input', debouncedFilter);
        dom.provinceSelect?.addEventListener('change', applyFilters);
        dom.availabilitySelect?.addEventListener('change', applyFilters);
        dom.featuredSelect?.addEventListener('change', applyFilters);
        applyFilters();
    }

    function applyFilters() {
        const searchTerm = dom.searchInput?.value.toLowerCase().trim() || '';
        const selectedProvince = dom.provinceSelect?.value || '';
        const selectedAvailability = dom.availabilitySelect?.value || '';
        const isFeaturedOnly = dom.featuredSelect?.value === 'true';

        const filtered = allProfiles.filter(p =>
            (!searchTerm || p.name?.toLowerCase().includes(searchTerm) || p.location?.toLowerCase().includes(searchTerm) || p.styleTags?.some(t => t.toLowerCase().includes(searchTerm))) &&
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
        if(dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');

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
            if ((currentPage === 'home' && isSearching) || currentPage === 'profiles') {
                if(dom.noResultsMessage) dom.noResultsMessage.classList.remove('hidden');
            }
            initScrollAnimations(gsap);
            return;
        }

        if (currentPage === 'profiles' || (currentPage === 'home' && isSearching)) {
            const gridContainer = document.createElement('div');
            if (isSearching && currentPage === 'home') {
                 const searchResultWrapper = createSearchResultSection(filteredProfiles);
                 searchResultWrapper.querySelector('.profile-grid').append(...filteredProfiles.map(createProfileCard));
                 dom.profilesDisplayArea.appendChild(searchResultWrapper);
            } else {
                 gridContainer.className = 'grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4';
                 gridContainer.append(...filteredProfiles.map(createProfileCard));
                 dom.profilesDisplayArea.appendChild(gridContainer);
            }
        } else if (currentPage === 'home' && !isSearching) {
            const profilesByProvince = filteredProfiles.reduce((acc, profile) => {
                (acc[profile.provinceKey] = acc[profile.provinceKey] || []).push(profile);
                return acc;
            }, {});
            [...provincesMap.keys()].forEach(provinceKey => {
                const provinceProfiles = profilesByProvince[provinceKey] || [];
                if (provinceProfiles.length > 0) {
                    const provinceName = provincesMap.get(provinceKey);
                    const provinceSectionEl = createProvinceSection(provinceKey, provinceName, provinceProfiles);
                    dom.profilesDisplayArea.appendChild(provinceSectionEl);
                }
            });
        }
        initScrollAnimations(gsap);
    }

    function createProfileCard(profile) {
        const card = document.createElement('div');
        card.className = 'profile-card-new group cursor-pointer';
        card.setAttribute('data-profile-id', profile.id);
        card.setAttribute('aria-label', `ดูโปรไฟล์ของ ${profile.name}`);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const mainImage = profile.images[0];
        let availabilityText = profile.availability || "สอบถามคิว";
        let availabilityClass = 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        if (['ว่าง', 'รับงาน'].includes(availabilityText)) { availabilityClass = 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300'; }
        else if (['ไม่ว่าง', 'พัก'].includes(availabilityText)) { availabilityClass = 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300'; }
        const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`;
        const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>`;

        card.innerHTML = `
        <img src="${mainImage}" alt="${profile.altText}" class="card-image" loading="lazy" decoding="async" width="300" height="400" onerror="this.onerror=null;this.src='/images/placeholder-profile.webp';">
        <div class="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
            <span class="${availabilityClass} text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">${availabilityText}</span>
            ${profile.isfeatured ? `<span class="bg-yellow-400 text-black text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">${starIcon} แนะนำ</span>` : ''}
        </div>
        <div class="card-overlay">
            <div class="card-info">
                <h3 class="text-xl lg:text-2xl font-bold truncate">${profile.name}</h3>
                <p class="text-sm flex items-center gap-1.5">${locationIcon} ${provincesMap.get(profile.provinceKey) || 'ไม่ระบุ'}</p>
            </div>
        </div>`;
        return card;
    }
    
    function createProvinceSection(key, name, provinceProfiles) {
        const totalCount = provinceProfiles.length;
        const sectionWrapper = document.createElement('div');
        sectionWrapper.className = 'section-content-wrapper';
        sectionWrapper.setAttribute('data-animate-on-scroll', '');
        const mapIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="text-xl" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>`;
        const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="ml-1 text-xs inline" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
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
                <a class="font-semibold text-primary hover:underline" href="profiles.html?location=${key}">ดูน้องๆ ใน ${name} ทั้งหมด ${arrowIcon}</a>
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
        return wrapper;
    }

    function initMobileMenuWithGsap(gsap) {
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
            gsap.to(backdrop, { opacity: 0, duration: 0.3, onComplete: () => {
                backdrop.classList.add('hidden');
                sidebar.classList.add('translate-x-full');
                sidebar.setAttribute('aria-hidden', 'true');
                dom.body.style.overflow = '';
            }});
        };
        menuToggle.addEventListener('click', openMenu);
        closeSidebarBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu(); });
    }

    function initAgeVerificationWithGsap(gsap) {
        const overlay = document.getElementById('age-verification-overlay');
        if (!overlay || sessionStorage.getItem('ageVerified') === 'true') {
            overlay?.classList.add('hidden');
            return;
        }
        const modalContent = overlay.querySelector('.age-modal-content');
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        gsap.to(overlay, { opacity: 1, duration: 0.3 });
        gsap.fromTo(modalContent, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 });
        const confirmBtn = document.getElementById('confirmAgeButton');
        const cancelBtn = document.getElementById('cancelAgeButton');
        const closeAction = () => {
            sessionStorage.setItem('ageVerified', 'true');
            gsap.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => {
                overlay.classList.add('hidden');
                overlay.classList.remove('flex');
            }});
        }
        confirmBtn?.addEventListener('click', closeAction);
        cancelBtn?.addEventListener('click', () => { window.location.href = 'https://www.google.com'; });
    }

    function initLightbox(gsap) {
        const lightbox = document.getElementById('lightbox');
        const wrapper = document.getElementById('lightbox-content-wrapper-el');
        const closeBtn = document.getElementById('closeLightboxBtn');
        if (!lightbox || !wrapper || !closeBtn) return;
        const openAction = (triggerElement) => {
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
            lastFocusedElement?.focus();
        };
        document.body.addEventListener('click', (event) => {
            const trigger = event.target.closest('.profile-card-new');
            if (trigger) { event.preventDefault(); openAction(trigger); }
        });
        document.body.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && event.target.closest('.profile-card-new')) { event.preventDefault(); openAction(event.target.closest('.profile-card-new')); }
            else if (event.key === 'Escape' && !lightbox.classList.contains('hidden')) { closeAction(); }
        });
        closeBtn.addEventListener('click', closeAction);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeAction(); });
    }
    
    function populateLightbox(profileData) {
        document.getElementById('lightbox-header-title').textContent = `โปรไฟล์: ${profileData.name || 'N/A'}`;
        document.getElementById('lightbox-profile-name-main').textContent = profileData.name || 'N/A';
        document.getElementById('lightboxHeroImage').src = profileData.images[0];
        document.getElementById('lightboxHeroImage').alt = profileData.altText;
        document.getElementById('lightboxQuote').textContent = profileData.quote ? `"${profileData.quote}"` : '';
        document.getElementById('lightboxDescriptionVal').innerHTML = profileData.description ? profileData.description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม';
        const thumbnailStripEl = document.getElementById('lightboxThumbnailStrip');
        thumbnailStripEl.innerHTML = '';
        if (profileData.images.length > 1) {
            profileData.images.forEach((imgSrc, index) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                thumb.alt = `รูปตัวอย่าง ${index + 1}`;
                thumb.className = 'thumbnail';
                if (index === 0) thumb.classList.add('active');
                thumb.addEventListener('click', () => {
                    document.getElementById('lightboxHeroImage').src = imgSrc;
                    thumbnailStripEl.querySelector('.thumbnail.active')?.classList.remove('active');
                    thumb.classList.add('active');
                });
                thumbnailStripEl.appendChild(thumb);
            });
            thumbnailStripEl.style.display = 'flex';
        } else {
            thumbnailStripEl.style.display = 'none';
        }
        const lineLink = document.getElementById('lightboxLineLink');
        if (profileData.lineId) {
            lineLink.href = profileData.lineId.startsWith('http') ? profileData.lineId : `https://line.me/ti/p/${profileData.lineId}`;
            lineLink.style.display = 'inline-flex';
            document.getElementById('lightboxLineLinkText').textContent = `ติดต่อ ${profileData.name} ผ่าน LINE`;
        } else {
            lineLink.style.display = 'none';
        }
    }

    function initHeaderScrollEffect() {
        const header = document.getElementById('page-header');
        if (!header) return;
        const handleScroll = () => { header.classList.toggle('scrolled', window.scrollY > 20); };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    function initScrollAnimations(gsap) {
        gsap.utils.toArray('[data-animate-on-scroll]').forEach(el => {
            gsap.from(el, {
                opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 90%', }
            });
        });
    }

    function updateActiveNavLinks() {
        const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
        document.querySelectorAll('#sidebar nav a, header nav a').forEach(link => {
            const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/';
            link.classList.toggle('active-nav-link', linkPath === currentPath);
        });
    }

    function generateFullSchema() { /* Your existing schema generation logic */ }

    initializeApp();
}