import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs';

gsap.registerPlugin(ScrollTrigger);

(function () {
    'use strict';

    const CONFIG = {
        SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
        STORAGE_BUCKET: 'profile-images',
        KEYS: {
            LAST_PROVINCE: 'sidelinecm_last_province',
            CACHE_PROFILES: 'cachedProfiles',
            LAST_FETCH: 'lastFetchTime',
            AGE_CONFIRMED: 'ageConfirmedTimestamp',
            THEME: 'theme',
            LIKED_PROFILES: 'liked_profiles'
        },
        SITE_URL: 'https://sidelinechiangmai.netlify.app',
        DEFAULT_OG_IMAGE: '/images/sidelinechiangmai-social-preview.webp'
    };
    
    function getCleanName(rawName) {
        if (!rawName || typeof rawName !== 'string') return "";
        let name = rawName.trim().replace(/^(น้อง\s?)/, '');
        name = name.toLowerCase();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return `น้อง${name}`;
    }

    const SEO_WORDS = {
        styles: ["ฟิวแฟนแท้ๆ", "งานละเมียด", "สายหวานดูแลดี", "คุยสนุกเป็นกันเอง", "งานเนี๊ยบตรงปก"],
        trust: ["ไม่มีมัดจำ", "นัดเจอจ่ายหน้างาน", "ไม่ต้องโอนก่อน", "จ่ายเงินตอนเจอตัว"],
        guarantees: ["ตัวจริงตรงรูป 100%", "รูปปัจจุบันแน่นอน", "ไม่จกตา", "การันตีความสวย"],
        pick: function(group) {
            return this[group][Math.floor(Math.random() * this[group].length)];
        }
    };

    let state = { 
        allProfiles: [], 
        provincesMap: new Map(), 
        currentProfileSlug: null, 
        lastFocusedElement: null, 
        isFetching: false, 
        lastFetchedAt: '1970-01-01T00:00:00Z', 
        realtimeSubscription: null,
        cleanupFunctions: []
    };

    const dom = {};
    let supabase;
    let fuseEngine;

    document.addEventListener('DOMContentLoaded', initApp);
    async function initApp() {
        console.log("🚀 App Initializing...");
        
        initializeSupabase();
        cacheDOMElements();

        initThemeToggle();
        initMobileMenu();
        initAgeVerification();
        initHeaderScrollEffect();
        initGlobalClickListener();
        updateActiveNavLinks();
        initLightboxEvents();

        await handleRouting();
        await handleDataLoading();
         
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                initMarqueeEffect();
                initMobileSitemapTrigger();
                initFooterLinks();
            });
        } else {
            setTimeout(() => {
                initMarqueeEffect();
                initMobileSitemapTrigger();
                initFooterLinks();
            }, 1500);
        }
         
        const yearSpan = document.getElementById('currentYearDynamic');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
        document.body.classList.add('loaded');
        console.log("✅ App Initialized Successfully!");

        if (window.location.pathname === '/' && !state.currentProfileSlug) {
            try {
                const heroElements = document.querySelectorAll('#hero-h1, #hero-p, #hero-form');
                if (heroElements.length > 0) {
                    gsap.from(heroElements, { y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.3 });
                }
            } catch (e) { console.warn("Animation skipped", e); }
        }

        window.addEventListener('popstate', async () => {
            await handleRouting();
            updateActiveNavLinks();
        });
    }
    
    window.addEventListener('beforeunload', () => {
        if (state.realtimeSubscription) {
            supabase?.removeChannel(state.realtimeSubscription);
        }
        
        if (Array.isArray(state.cleanupFunctions)) {
            state.cleanupFunctions.forEach(fn => {
                try { fn(); } catch (e) { console.warn('Cleanup error:', e); }
            });
        }
    });

    function initializeSupabase() {
        try {
            supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            window.supabase = supabase;
            console.log("✅ Supabase Connected");
        } catch (e) {
            console.error("❌ Supabase Init Failed:", e);
        }
    }

    function formatDate(dateString) {
        if (!dateString) return 'ไม่ระบุ';
        try {
            const date = new Date(dateString);
            const thaiMonths = [
                'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
                'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
            ];
            const day = date.getDate();
            const month = thaiMonths[date.getMonth()];
            const year = date.getFullYear() + 543;
            return `${day} ${month} ${year}`;
        } catch (e) {
            return 'ไม่ระบุ';
        }
    }

    function showErrorState(error) {
        console.error("❌ Error:", error);
        hideLoadingState();
        
        if(dom.profilesDisplayArea) dom.profilesDisplayArea.classList.add('hidden');
        if(dom.featuredSection) dom.featuredSection.classList.add('hidden');

        if(dom.fetchErrorMessage) {
            dom.fetchErrorMessage.classList.remove('hidden');
            dom.fetchErrorMessage.style.display = 'block';
        }
        
        const loadMore = document.getElementById('load-more-container');
        if (loadMore) loadMore.classList.add('hidden');
    }
    
// =================================================================
    // 4. EVENT HANDLING (COMPLETE & FIXED)
    // =================================================================
    function initGlobalClickListener() {
        console.log("👂 Global Click Listener is now active.");
        
        document.body.addEventListener('click', (event) => {
            const target = event.target;

            // --- Priority 1: ตรวจสอบการคลิกที่ "ปุ่มหัวใจ" ก่อนเสมอ ---
            const likeButton = target.closest('[data-action="like"]');
            if (likeButton) {
                // หยุดทุกอย่างไม่ให้ทะลุไปโดนการ์ด
                event.preventDefault();
                event.stopPropagation();
                
                const profileId = likeButton.dataset.id;
                
                // ตรวจสอบว่ามี ID และมีฟังก์ชันให้เรียกใช้
                if (profileId && typeof window.handleLikeClick === 'function') {
                    window.handleLikeClick(likeButton, profileId);
                }
                return; // จบการทำงานทันที
            }

            // --- Priority 2: ถ้าไม่ใช่หัวใจ ค่อยเช็ค "การ์ด" เพื่อเปิด Lightbox ---
            const cardLink = target.closest('a.card-link');
            if (cardLink) {
                event.preventDefault(); // หยุดการเปลี่ยนหน้าปกติ
                
                const card = cardLink.closest('.profile-card-new');
                const slug = card ? card.getAttribute('data-profile-slug') : null;
                
                if (slug) {
                    state.lastFocusedElement = card;
                    history.pushState(null, '', `/sideline/${slug}`);
                    handleRouting(); // เปิด Lightbox
                }
                return;
            }
            
            // --- Priority 3: ปุ่มปิด Lightbox ---
            const closeButton = target.closest('#closeLightboxBtn');
            const lightboxBackdrop = target.closest('#lightbox');
            if (closeButton || (lightboxBackdrop && event.target === lightboxBackdrop)) {
                 history.pushState(null, '', '/');
                 handleRouting(); // ปิด Lightbox
            }
        });

        // ปุ่ม ESC ปิด Lightbox
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && state.currentProfileSlug) {
                history.pushState(null, '', '/');
                handleRouting();
            }
        });
    }

    // ✅ [ฟังก์ชันกดไลค์ที่สมบูรณ์: UI + LocalStorage + Database]
    window.handleLikeClick = async function(likeButton, profileId) {
        console.log(`👍 Processing like for profile ID: ${profileId}`);

        // 1. UI UPDATE (อัปเดตหน้าจอทันทีเพื่อให้ลื่นไหล)
        const isLiked = likeButton.classList.toggle('liked');
        const countSpan = likeButton.querySelector('.like-count');
        
        if (countSpan) {
            // แปลงตัวเลข (กันเหนียวเผื่อมี comma)
            let currentLikes = parseInt(countSpan.textContent.replace(/,/g, '') || '0');
            // บวกหรือลบตามสถานะ
            countSpan.textContent = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
        }

        // 2. LOCAL STORAGE (บันทึกลงเครื่องผู้ใช้)
        try {
            const likedProfiles = JSON.parse(localStorage.getItem(CONFIG.KEYS.LIKED_PROFILES) || '{}');
            if (isLiked) {
                likedProfiles[profileId] = true;
            } else {
                delete likedProfiles[profileId];
            }
            localStorage.setItem(CONFIG.KEYS.LIKED_PROFILES, JSON.stringify(likedProfiles));
        } catch (e) {
            console.error("Local storage error:", e);
        }

        // 3. DATABASE UPDATE (ส่งไป Supabase - ส่วนที่ขาดไป)
        if (window.supabase) {
            try {
                // เลือกชื่อฟังก์ชัน SQL
                const rpcName = isLiked ? 'increment_likes' : 'decrement_likes';
                
                // 🔥 ส่งคำสั่งไปฐานข้อมูล (ใช้ชื่อตัวแปร profile_id_to_update ตาม SQL ของคุณ)
                const { error } = await window.supabase.rpc(rpcName, { 
                    profile_id_to_update: profileId 
                });

                if (error) {
                    console.error('❌ Supabase update failed:', error);
                    // กรณี Error จริงจัง อาจจะเขียนโค้ด Rollback UI ตรงนี้ได้ (แต่ปกติไม่ต้องก็ได้)
                } else {
                    console.log(`✅ DB Updated: ${rpcName}`);
                }
            } catch (err) {
                console.error("Connection error:", err);
            }
        }
    };
    
function cacheDOMElements() {
    dom.body = document.body;
    dom.pageHeader = document.getElementById('page-header');
    dom.loadingPlaceholder = document.getElementById('loading-profiles-placeholder');
    dom.profilesDisplayArea = document.getElementById('profiles-display-area');
    dom.noResultsMessage = document.getElementById('no-results-message');
    dom.fetchErrorMessage = document.getElementById('fetch-error-message');
    dom.retryFetchBtn = document.getElementById('retry-fetch-btn');
    dom.searchForm = document.getElementById('search-form');
    dom.searchInput = document.getElementById('search-keyword');
    dom.provinceSelect = document.getElementById('search-province');
    dom.availabilitySelect = document.getElementById('search-availability');
    dom.featuredSelect = document.getElementById('search-featured');
    dom.sortSelect = document.getElementById('sort-select'); // ✅ แก้ไขแล้ว
    dom.resetSearchBtn = document.getElementById('reset-search-btn');
    dom.resultCount = document.getElementById('result-count');
    dom.featuredSection = document.getElementById('featured-profiles');
    dom.featuredContainer = document.getElementById('featured-profiles-container');
    dom.lightbox = document.getElementById('lightbox');
    dom.lightboxCloseBtn = document.getElementById('closeLightboxBtn');
    dom.lightboxWrapper = document.getElementById('lightbox-content-wrapper-el');
}

// =================================================================
// 5. DATA LOADING & PROCESSING (COMPLETED & OPTIMIZED)
// =================================================================

/**
 * ฟังก์ชันหลักในการโหลดข้อมูล พร้อมระบบ Retry และ UI State
 */
async function handleDataLoading() {
    if (state.isFetching) return;
    showLoadingState();

    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const success = await fetchDataDelta();
            if (success) {
                initSearchAndFilters();
                // ส่งสัญญาณว่าโหลดข้อมูลเสร็จแล้วเพื่อให้ handleRouting ทำงานต่อ
                await handleRouting(true);
                initRealtimeSubscription();
                
                dom.fetchErrorMessage?.classList.add('hidden');
                dom.profilesDisplayArea?.classList.remove('hidden');
                hideLoadingState();
                return;
            }
        } catch (error) {
            console.error(`❌ Attempt ${i + 1} failed:`, error);
            if (i === maxRetries - 1) showErrorState(error);
            // หน่วงเวลาก่อนลองใหม่ (Backoff)
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
    hideLoadingState();
}

/**
 * ดึงข้อมูลจังหวัดและโปรไฟล์จาก Supabase พร้อมกัน (Parallel Fetching)
 */
async function fetchDataDelta() {
    if (state.isFetching) return false;
    state.isFetching = true;

    if (!supabase) {
        state.isFetching = false;
        return false;
    }

    try {
        console.log('🔄 Loading all data fresh from database...');

        const [provincesRes, profilesRes] = await Promise.all([
            supabase.from('provinces').select('*'),
            supabase.from('profiles').select('*').order('created_at', { ascending: false })
        ]);

        if (provincesRes.error) throw provincesRes.error;
        if (profilesRes.error) throw profilesRes.error;

        // 1. จัดการชื่อจังหวัด
        state.provincesMap.clear();
        (provincesRes.data || []).forEach(p => {
            const name = p.nameThai || p.name_thai || p.name;
            const key = p.key || p.slug || p.id;
            if (key && name) state.provincesMap.set(key.toString(), name);
        });

        // 2. จัดการโปรไฟล์ (ผ่านฟังก์ชัน processProfileData เพื่อลบเลขซ้ำ)
        const fetchedProfiles = profilesRes.data || [];
        state.allProfiles = fetchedProfiles.map(processProfileData).filter(Boolean);

        // 3. แสดงผล UI
        populateProvinceDropdown();
        // เรียกใช้ renderProfiles (ทำงานแบบ Async Batch)
        renderProfiles(state.allProfiles, false);
        
        // 4. บันทึกลงเครื่อง (Cache)
        localStorage.setItem(CONFIG.KEYS.CACHE_PROFILES, JSON.stringify(state.allProfiles));

        state.isFetching = false;
        return true;

    } catch (err) {
        console.error('❌ fetchDataDelta Error:', err);
        state.isFetching = false;
        return false;
    }
}

/**
 * รวมข้อมูลโปรไฟล์ใหม่เข้ากับข้อมูลเดิม (ใช้ใน Realtime)
 */
function mergeProfilesData(existingProfiles, newProfiles) {
    if (!newProfiles || newProfiles.length === 0) return existingProfiles;
    const profileMap = new Map();
    existingProfiles.forEach(p => { if (p?.id) profileMap.set(p.id.toString(), p); });
    newProfiles.forEach(newP => { if (newP?.id) profileMap.set(newP.id.toString(), newP); });
    return Array.from(profileMap.values());
}

/**
 * ระบบรับข้อมูลอัปเดตแบบ Realtime (Stable Version)
 */
function initRealtimeSubscription() {
    if (!supabase) return;

    if (state.realtimeSubscription) {
        supabase.removeChannel(state.realtimeSubscription);
    }

    try {
        const subscription = supabase
            .channel('profiles-global-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
                console.log('🔔 Realtime Event:', payload.eventType);
                
                if (payload.eventType === 'DELETE') {
                    state.allProfiles = state.allProfiles.filter(p => p.id !== payload.old.id);
                } else {
                    // ประมวลผลข้อมูลใหม่ (ลบเลขซ้ำทันที)
                    const processed = processProfileData(payload.new);
                    if (processed) {
                        state.allProfiles = mergeProfilesData(state.allProfiles, [processed]);
                    }
                }
                // สั่งแรนเดอร์หน้าจอใหม่
                renderProfiles(state.allProfiles, false);
            })
            .subscribe();

        state.realtimeSubscription = subscription;
        if (!Array.isArray(state.cleanupFunctions)) state.cleanupFunctions = [];
        state.cleanupFunctions.push(() => supabase.removeChannel(subscription));

    } catch (error) {
        console.warn('⚠️ Realtime failure:', error.message);
    }
}

/**
 * ฟังก์ชันหัวใจหลักในการแปลงข้อมูลดิบ (🔧 จัดการเลขซ้ำ / SEO / Search String)
 */
function processProfileData(p) {
    if (!p) return null;

    // --- [🔧 🔧 🔧 FIX: กำจัดเลขซ้ำใน SLUG] ---
    // เปลี่ยน "name-99-99-99" ให้เหลือแค่ "name-99" ตลอดไป
    if (p.slug) {
        p.slug = p.slug.trim().replace(/(-\d+)(?:-\d+)+$/, '$1');
    }

    const displayName = getCleanName(p.name); 

    // 1. จัดการรูปภาพ
    const imagePaths = [p.imagePath, ...(Array.isArray(p.galleryPaths) ? p.galleryPaths : [])].filter(Boolean);
    let imageObjects = imagePaths.map(path => {
        if (path.startsWith('http')) return { src: path };
        const { data } = supabase.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
        return { src: data?.publicUrl || CONFIG.DEFAULT_OG_IMAGE };
    });
    if (imageObjects.length === 0) imageObjects.push({ src: CONFIG.DEFAULT_OG_IMAGE });

    // 2. ข้อมูลจังหวัดและ SEO
    const provinceName = state.provincesMap.get(p.provinceKey) || 'เชียงใหม่';
    const v = SEO_WORDS.pick('styles');
    const t = SEO_WORDS.pick('trust');
    const g = SEO_WORDS.pick('guarantees');

    // 3. แกะชื่ออังกฤษจาก Slug เพื่อเพิ่มความเทพในการค้นหา
    let englishName = '';
    if (p.slug) {
        englishName = p.slug.split('-').filter(part => isNaN(part)).join(' ');
    }

    // 4. สร้าง Universal Search String (Genius Search Index)
    const universalSearchString = `
        ${displayName} ${englishName} ${p.id} ${provinceName} ${p.provinceKey || ''}
        ${p.styleTags ? p.styleTags.join(' ') : ''} ${p.description || ''} 
        ${p.location || ''} ${p.stats || ''}
    `.toLowerCase().replace(/\s+/g, ' ').trim();

    return { 
        ...p, 
        displayName,
        englishName,
        images: imageObjects, 
        provinceNameThai: provinceName,
        searchString: universalSearchString,
        _price: Number(String(p.rate).replace(/\D/g, '')) || 0, 
        _age: Number(p.age) || 0
    };
}

/**
 * เติมข้อมูลจังหวัดลงใน Dropdown
 */
function populateProvinceDropdown() {
    if (!dom.provinceSelect) return;
    while (dom.provinceSelect.options.length > 1) { dom.provinceSelect.remove(1); }
    
    const sorted = Array.from(state.provincesMap.entries()).sort((a, b) => a[1].localeCompare(b[1], 'th'));
    const fragment = document.createDocumentFragment();
    sorted.forEach(([key, name]) => {
        const opt = document.createElement('option');
        opt.value = key; opt.textContent = name;
        fragment.appendChild(opt);
    });
    dom.provinceSelect.appendChild(fragment);
}

// =================================================================
// 6. ROUTING SYSTEM (PRETTY URLS & SEO PROTECTION)
// =================================================================

async function handleRouting(dataLoaded = false) {
    let path = window.location.pathname.toLowerCase();
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

    // รายการหน้า Static ที่ห้ามรัน Dynamic Logic
    const staticPages = ['/blog', '/about', '/faq', '/profiles', '/locations', '/contact', '/policy'];
    const isStaticPage = path.endsWith('.html') || staticPages.some(p => path === p || path.startsWith(p + '/'));

    if (isStaticPage) {
        console.log(`🛑 Static page detected (${path}). Skipping dynamic SEO.`);
        closeLightbox(false); 
        if(dom.profilesDisplayArea) dom.profilesDisplayArea.classList.add('hidden');
        if(dom.featuredSection) dom.featuredSection.classList.add('hidden');
        return; 
    }

    // 1. หน้าโปรไฟล์ (/sideline/slug)
    const profileMatch = path.match(/^\/(?:sideline|profile|app)\/([^/]+)/);
    if (profileMatch) {
        let slug = decodeURIComponent(profileMatch[1]);
        // Clean slug ในตัวแปรเพื่อใช้ค้นหาใน Array
        slug = slug.replace(/(-\d+)(?:-\d+)+$/, '$1');
        state.currentProfileSlug = slug;
        
        let profile = state.allProfiles.find(p => (p.slug || '').toLowerCase() === slug.toLowerCase());
        if (!profile && !dataLoaded) profile = await fetchSingleProfile(slug);

        if (profile) {
            openLightbox(profile);
            updateAdvancedMeta(profile, null);
            dom.profilesDisplayArea?.classList.add('hidden');
            dom.featuredSection?.classList.add('hidden');
        } else if (dataLoaded) {
            // โหลดแล้วแต่ไม่เจอ -> ดีดกลับหน้าแรก
            history.replaceState(null, '', '/');
            closeLightbox(false);
            state.currentProfileSlug = null;
        }
        return;
    } 
    
    // 2. หน้าจังหวัด (/location/province-key)
    const provinceMatch = path.match(/^\/(?:location|province)\/([^/]+)/);
    if (provinceMatch) {
        const provinceKey = decodeURIComponent(provinceMatch[1]);
        state.currentProfileSlug = null;
        closeLightbox(false);
        
        if (dom.provinceSelect) dom.provinceSelect.value = provinceKey;
        
        if (dataLoaded) {
            // ใช้ setTimeout เพื่อให้เบราว์เซอร์วาด Loader ก่อนเริ่มกรองข้อมูล (INP Fix)
            setTimeout(() => {
                applyUltimateFilters(false);
                const provinceName = state.provincesMap.get(provinceKey) || provinceKey;
                const seoData = {
                    provinceName: provinceName, 
                    canonicalUrl: `${CONFIG.SITE_URL}/location/${provinceKey}`,
                    profiles: state.allProfiles.filter(p => p.provinceKey === provinceKey)
                };
                updateAdvancedMeta(null, seoData);
                dom.profilesDisplayArea?.classList.remove('hidden');
            }, 10);
        }
        return;
    }

    // 3. หน้าแรก (Home Page)
    state.currentProfileSlug = null;
    closeLightbox(false);
    dom.profilesDisplayArea?.classList.remove('hidden');
    
    if (dataLoaded) {
        setTimeout(() => {
            applyUltimateFilters(false);
            updateAdvancedMeta(null, null);
        }, 10);
    }
}

/**
 * Utility: Debounce ฟังก์ชัน (หน่วงเวลา)
 */
function debounce(func, delay = 350) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// =================================================================
// [ฉบับสมบูรณ์] - initSearchAndFilters (Genius Search Engine)
// =================================================================
function initSearchAndFilters() {
    if (!dom.searchForm) return;

    // 1. ตั้งค่า Search Engine (Fuse.js) ---
    const fuseOptions = {
        includeScore: true,
        threshold: 0.3, // ค่า 0.3 ยืดหยุ่นกำลังดี (พิมพ์ผิดนิดหน่อยก็เจอ เช่น Pupe -> Puep)
        ignoreLocation: true,
        useExtendedSearch: true, // เปิดโหมดค้นหาขั้นสูง
        keys: [
            // 🔥 พระเอกของเรา: ให้ความสำคัญสูงสุดกับ searchString (ที่รวมทุกอย่างไว้แล้ว)
            { name: 'searchString', weight: 1.0 },
            
            // 🌟 ตัวช่วยดันคะแนน: ถ้าชื่อตรงเป๊ะๆ ให้คะแนนพิเศษ
            { name: 'name', weight: 0.8 },         // ชื่อไทย
            { name: 'englishName', weight: 0.8 },  // ชื่ออังกฤษ (ที่แกะจาก URL)
            { name: 'id', weight: 0.9 },           // เผื่อค้นหาด้วย ID ตรงๆ
            
            // 🌍 ตัวช่วยรอง: จังหวัดและแท็ก
            { name: 'provinceNameThai', weight: 0.5 },
            { name: 'styleTags', weight: 0.4 }
        ]
    };
    
    // หน่วงเวลาการสร้าง Index เพื่อให้หน้าเว็บโหลด UI หลักเสร็จก่อน (Performance)
    setTimeout(() => {
        if (state.allProfiles.length > 0) {
            console.log("🚀 Building GENIUS search index...");
            fuseEngine = new Fuse(state.allProfiles, fuseOptions);
            console.log("✅ Search index is ready.");
        }
    }, 500);

    // --- 2. ตั้งค่า Event Listeners ---
    const clearBtn = document.getElementById('clear-search-btn');
    const suggestionsBox = document.getElementById('search-suggestions');
    
    // ✅ Input Listener: ใช้ Debounce หน่วงเวลาไม่ให้ค้นหาถี่เกินไป
    dom.searchInput?.addEventListener('input', debounce((e) => {
        const val = e.target.value;
        
        // แสดง/ซ่อน ปุ่มกากบาท (X)
        if(clearBtn) clearBtn.classList.toggle('hidden', !val);
        
        // เรียกฟังก์ชันค้นหาหลัก
        applyUltimateFilters(); 
        
        // (Optional) ถ้าคุณมีระบบ Auto-suggest ให้เรียกใช้ตรงนี้
        if (typeof updateUltimateSuggestions === 'function') {
            updateUltimateSuggestions(val);
        }
    }, 250));

    // ✅ Clear Button Listener: ปุ่มล้างคำค้นหา (X)
    clearBtn?.addEventListener('click', () => {
        if (dom.searchInput) {
            dom.searchInput.value = '';
            dom.searchInput.focus(); // โฟกัสกลับไปที่ช่องพิมพ์
        }
        clearBtn.classList.add('hidden');
        if (suggestionsBox) suggestionsBox.classList.add('hidden');
        
        applyUltimateFilters(); // รีเซ็ตผลการค้นหา
    });

    // ✅ Province Dropdown: เปลี่ยนจังหวัดแล้วค้นหาทันที
    dom.provinceSelect?.addEventListener('change', () => {
        // เมื่อเลือกจังหวัด ให้ล้างช่องค้นหา text เพื่อไม่ให้ตีกัน
        if (dom.searchInput) {
            dom.searchInput.value = '';
            if(clearBtn) clearBtn.classList.add('hidden');
        }
        
        // เปลี่ยน URL ตามจังหวัดที่เลือก (SEO Friendly)
        const newPath = dom.provinceSelect.value ? `/location/${dom.provinceSelect.value}` : '/';
        history.pushState(null, '', newPath);
        
        applyUltimateFilters(true);
    });

    // ✅ Filter Dropdowns อื่นๆ (Availability, Featured, Sort)
    dom.availabilitySelect?.addEventListener('change', () => applyUltimateFilters(true));
    dom.featuredSelect?.addEventListener('change', () => applyUltimateFilters(true));
    dom.sortSelect?.addEventListener('change', () => applyUltimateFilters(true)); // เพิ่มตัวเรียงลำดับด้วย
    
    // ✅ Reset Button: ปุ่มรีเซ็ตค่าทุกอย่าง
    dom.resetSearchBtn?.addEventListener('click', () => {
        // 1. เคลียร์ค่าใน Input และ Select ทั้งหมด
        if (dom.searchInput) dom.searchInput.value = '';
        if (dom.provinceSelect) dom.provinceSelect.value = '';
        if (dom.availabilitySelect) dom.availabilitySelect.value = '';
        if (dom.featuredSelect) dom.featuredSelect.value = '';
        if (dom.sortSelect) dom.sortSelect.value = 'featured';

        // 2. ซ่อนปุ่ม Clear
        if (clearBtn) clearBtn.classList.add('hidden');

        // 3. รีเซ็ต URL กลับหน้าแรก
        history.pushState(null, '', '/');

        // 4. เรียกฟังก์ชันกรองใหม่
        applyUltimateFilters(true);
    });

    // ✅ Form Submit: ป้องกันการ Refresh หน้าเมื่อกด Enter
    dom.searchForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        applyUltimateFilters(true); 
        
        // ซ่อนกล่อง Suggestion เมื่อกด Enter
        if(suggestionsBox) suggestionsBox.classList.add('hidden');
        
        // ปิด Keyboard ในมือถือ
        if (dom.searchInput) dom.searchInput.blur();
    });
}


function saveCache(key, data) {
    try {
        const cacheObj = { value: data, timestamp: Date.now() };
        localStorage.setItem(key, JSON.stringify(cacheObj));
    } catch (e) {
        console.error("Cache Full:", e);
        localStorage.clear();
    }
}

function loadCache(key, expiryHours = 24) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
        const cacheObj = JSON.parse(cached);
        const now = Date.now();
        const expiryTime = expiryHours * 60 * 60 * 1000;
        if (now - cacheObj.timestamp > expiryTime) {
            localStorage.removeItem(key);
            return null;
        }
        return cacheObj.value;
    } catch (e) {
        return null;
    }
}

function updateUltimateSuggestions(val) {
    const box = document.getElementById('search-suggestions');
    const input = document.getElementById('search-keyword');
    const clearBtn = document.getElementById('clear-search-btn');

    if(clearBtn) clearBtn.classList.toggle('hidden', !val);
    if (!box) return;

    if (!val) {
        showRecentSearches(); 
        return;
    }

    if (!fuseEngine) return;
    const results = fuseEngine.search(val).slice(0, 5);

    if (results.length === 0) {
        box.classList.add('hidden');
        return;
    }

    let html = `<div class="search-dropdown-box">`;
    html += `<div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">ผลลัพธ์ที่แนะนำ (${results.length})</span></div>`;
    html += `<div class="flex flex-col">`;
    results.forEach(({ item }) => {
        const provinceName = state.provincesMap.get(item.provinceKey) || '';
        const isAvailable = item.availability?.includes('ว่าง') || item.availability?.includes('รับงาน');
        const imgSrc = item.images && item.images[0] ? item.images[0].src : '/images/placeholder.webp';
        html += `
            <div class="relative flex items-center gap-3 px-4 py-3 hover:bg-pink-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0 group" onclick="window.selectSuggestion('${item.slug}', true)">
                <div class="relative shrink-0">
                    <img src="${imgSrc}" class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm">
                    <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-${isAvailable ? 'green' : 'gray'}-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-pink-600">${item.name}</h4>
                        ${item.age ? `<span class="text-[10px] bg-gray-100 dark:bg-gray-600 px-1.5 rounded text-gray-500 dark:text-gray-300">${item.age} ปี</span>` : ''}
                    </div>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center"><i class="fas fa-map-marker-alt text-[10px] mr-1 text-pink-400"></i> ${provinceName}</span>
                    </div>
                </div>
                <i class="fas fa-chevron-right text-gray-300 text-xs group-hover:text-pink-400 transform group-hover:translate-x-1 transition-transform"></i>
            </div>
        `;
    });
    html += `</div>`;
    html += `
        <div onclick="document.getElementById('search-form').dispatchEvent(new Event('submit'))" class="px-4 py-3 bg-pink-50/50 dark:bg-gray-800 text-center cursor-pointer hover:bg-pink-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700">
            <span class="text-sm font-bold text-pink-600"><i class="fas fa-search mr-1"></i> ดูผลลัพธ์ทั้งหมด</span>
        </div>
    </div>`;
    box.innerHTML = html;
    box.classList.remove('hidden');
}

window.selectSuggestion = (value, isProfile = false) => {
    const box = document.getElementById('search-suggestions');
    const input = document.getElementById('search-keyword');
    
    if (isProfile) {
        box?.classList.add('hidden');
        if (input) {
            input.value = '';
            document.getElementById('clear-search-btn')?.classList.add('hidden');
        }
        history.pushState(null, '', `/sideline/${value}`);
        handleRouting(); 
    } else {
        if(input) {
            input.value = value;
            // saveRecentSearch(value); // This function seems to be missing from the provided code, you might need to re-add it if you use it.
            applyUltimateFilters(true);
            box?.classList.add('hidden');
        }
    }
};

function showRecentSearches() {
    const box = document.getElementById('search-suggestions');
    if (!box) return;
    
    const recents = JSON.parse(localStorage.getItem('recent_searches') || '[]');
    if (recents.length === 0) {
        box.classList.add('hidden');
        return;
    }

    let html = `<div class="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">`;
    html += `<div class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase flex justify-between items-center bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700"><span>ค้นหาล่าสุด</span><button onclick="window.clearRecentSearches()" class="text-red-400 hover:text-red-600 text-xs">ล้างประวัติ</button></div>`;
    recents.forEach(term => {
        html += `
            <div class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-gray-700 last:border-0" onclick="window.selectSuggestion('${term}', false)">
                <i class="fas fa-history text-gray-400 min-w-[20px]"></i>
                <span class="font-medium">${term}</span>
            </div>
        `;
    });
    html += `</div>`;
    box.innerHTML = html;
    box.classList.remove('hidden');
}
    
// =================================================================
// [ฉบับปรับปรุงเพื่อ Performance] - applyUltimateFilters
// =================================================================
async function applyUltimateFilters(updateUrl = true) {
    try {
        // 1. ตอบสนอง UI ทันที (สำคัญมากสำหรับ INP)
        // แสดง Loading ทันที เพื่อให้ User รู้ว่าเครื่องรับคำสั่งแล้ว
        showLoadingState();

        // 2. ใช้ setTimeout เพื่อผลักงานคำนวณหนักๆ ไปไว้ "คิวถัดไป"
        // วิธีนี้จะทำให้ Main Thread ว่างเป็นช่วงสั้นๆ เพื่อรับการคลิก/แตะ
        setTimeout(async () => {
            
            // --- [ส่วนที่ 1: การคำนวณและกรองข้อมูล] ---
            const query = {
                text: (dom.searchInput?.value || '').trim(),
                province: dom.provinceSelect?.value || 'all',
                avail: dom.availabilitySelect?.value || 'all',
                featured: dom.featuredSelect?.value === 'true',
                sort: dom.sortSelect?.value || 'featured'
            };

            // Intent Detection (Logic เดิม)
            if (query.text && state.provincesMap) {
                for (const [key, provinceName] of state.provincesMap.entries()) {
                    const normalizedText = query.text.toLowerCase().trim();
                    const normalizedProvince = provinceName.toLowerCase().trim();
                    if (normalizedText === normalizedProvince || normalizedProvince.includes(normalizedText) || normalizedText.includes(normalizedProvince)) {
                        query.province = key;
                        query.text = '';
                        if (dom.searchInput) dom.searchInput.value = '';
                        if (dom.provinceSelect) dom.provinceSelect.value = key;
                        break;
                    }
                }
            }

            if (query.province && query.province !== 'all') {
                localStorage.setItem(CONFIG.KEYS.LAST_PROVINCE, query.province);
            }

            // กรองข้อมูล (Logic เดิม)
            let filtered = [...state.allProfiles];

            if (query.text) {
                const searchText = query.text.toLowerCase().trim();
                let searchHandled = false;

                if (/^\d+$/.test(searchText)) {
                    const idMatches = filtered.filter(p => String(p.id) === searchText || (p.slug && p.slug.endsWith(`-${searchText}`)));
                    if (idMatches.length > 0) {
                        filtered = idMatches;
                        searchHandled = true;
                    }
                }

                if (!searchHandled) {
                    if (fuseEngine) {
                        const results = fuseEngine.search(query.text, { limit: 500 });
                        filtered = results.map(result => result.item);
                    } else {
                        filtered = filtered.filter(p => p.searchString?.includes(searchText) || p.name?.toLowerCase().includes(searchText));
                    }
                }
            }

            // กรอง Province, Avail, Featured
            if (query.province && query.province !== 'all') filtered = filtered.filter(p => p.provinceKey === query.province);
            if (query.avail && query.avail !== 'all') filtered = filtered.filter(p => p.availability === query.avail);
            if (query.featured) filtered = filtered.filter(p => p.isfeatured === true);

            // Sorting
            filtered.sort((a, b) => {
                if (query.sort === 'featured') {
                    if (a.isfeatured && !b.isfeatured) return -1;
                    if (!a.isfeatured && b.isfeatured) return 1;
                    return (a.name || '').localeCompare(b.name || '');
                }
                if (query.sort === 'name_asc') return (a.name || '').localeCompare(b.name || '');
                if (query.sort === 'name_desc') return (b.name || '').localeCompare(a.name || '');
                if (query.sort === 'rating') return (b.rating || 0) - (a.rating || 0);
                return 0;
            });

            // --- [ส่วนที่ 2: การอัปเดต UI] ---
            
            // อัปเดตตัวเลขผลลัพธ์
            if (dom.resultCount) {
                const count = filtered.length;
                dom.resultCount.textContent = count === 0 ? '❌ ไม่พบโปรไฟล์' : `✅ พบ ${count.toLocaleString()} รายการ`;
                dom.resultCount.style.display = 'block';
                dom.resultCount.classList.toggle('no-results', count === 0);
            }

            // เรียกใช้ renderProfiles (ที่เราปรับปรุงให้เป็น async/batch แล้ว)
            const isSearchMode = query.text || (query.province && query.province !== 'all') || query.avail !== 'all' || query.featured;
            
            // ใช้ await เพื่อรอให้การวาดทีละนิดเสร็จสิ้น
            await renderProfiles(filtered, isSearchMode);

            if (updateUrl) updateUrlFromFilters(query);
            
            state.currentFilters = query;
            state.filteredProfiles = filtered;

            // ซ่อน Loading เมื่อทุกอย่างเสร็จ
            hideLoadingState();
            
        }, 10); // หน่วงเวลา 10ms เพื่อเปิดช่องให้ Browser รับ event คลิก

    } catch (error) {
        console.error('❌ Error:', error);
        hideLoadingState();
    }
}
/**
 * อัปเดต URL จากฟิลเตอร์ปัจจุบัน
 * @param {Object} query - ข้อมูลฟิลเตอร์
 */
function updateUrlFromFilters(query) {
    try {
        // สร้าง URL Parameters
        const params = new URLSearchParams();
        
        if (query.text) params.set('q', encodeURIComponent(query.text));
        if (query.province && query.province !== 'all') params.set('province', query.province);
        if (query.avail && query.avail !== 'all') params.set('avail', query.avail);
        if (query.featured) params.set('featured', 'true');
        if (query.sort && query.sort !== 'featured') params.set('sort', query.sort);
        
        const paramsString = params.toString();
        
        // สร้าง pathname
        let pathname = '/';
        if (query.province && query.province !== 'all') {
            pathname = `/location/${encodeURIComponent(query.province)}`;
        }
        
        // สร้าง URL สุดท้าย
        const newUrl = paramsString ? `${pathname}?${paramsString}` : pathname;
        
        // อัปเดต URL โดยไม่ reload หน้า
        if (window.location.pathname + window.location.search !== newUrl) {
            history.pushState({ 
                filters: query,
                timestamp: Date.now() 
            }, '', newUrl);
            
            console.log(`🌐 อัปเดต URL: ${newUrl}`);
        }
        
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการอัปเดต URL:', error);
    }
}



async function renderCardsIncrementally(container, profiles) {
    if (!container || !profiles) return;
    
    // 1. ล้างข้อมูลเดิม
    container.innerHTML = '';
    
    // 2. ปรับ BATCH_SIZE ให้เล็กลงมากสำหรับ Mobile
    // ยิ่ง Batch เล็ก Browser ยิ่งตอบสนองต่อการคลิกได้ไวขึ้น
    const isMobile = window.innerWidth < 768;
    const BATCH_SIZE = isMobile ? 2 : 4; 

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < profiles.length; i++) {
        const card = createProfileCard(profiles[i], i);
        fragment.appendChild(card);

        // เมื่อครบชุด (Batch) หรือใบสุดท้าย
        if ((i + 1) % BATCH_SIZE === 0 || i === profiles.length - 1) {
            container.appendChild(fragment);
            
            // 3. 🛠️ จุดเปลี่ยนสำคัญ (แก้ INP):
            // เปลี่ยนจาก requestAnimationFrame เป็นการ Yield ด้วย Task Queue
            // เราจะสลับกันใช้เพื่อให้ Browser ได้ทั้ง 'วาดภาพ' และ 'รับคำสั่งคลิก'
            if (i < 10) {
                // 10 ใบแรกใช้ rAF เพื่อความเร็วในการแสดงผล (LCP)
                await new Promise(resolve => requestAnimationFrame(resolve));
            } else {
                // ใบต่อๆ ไปใช้ setTimeout(0) เพื่อเปิดช่องให้ User กดคลิก/เลื่อน ได้ (INP)
                // นี่คือการ "คลายล็อก" Main Thread ที่แท้จริง
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            // 4. ถ้าโปรไฟล์เยอะมาก (เช่น หน้าเชียงใหม่ที่มี 100+) 
            // ให้หยุดพักยาวขึ้นทุกๆ 20 ใบ เพื่อลดความร้อนและภาระ CPU
            if (i > 0 && i % 20 === 0) {
                await new Promise(resolve => setTimeout(resolve, 20));
            }
        }
    }
}

// Yielding function for main thread responsiveness
function yieldToMain() {
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    });
}

/**
 * สร้าง Section สำหรับแสดงผลการค้นหา หรือหน้าจังหวัด (ฉบับแก้ไข)
 * @param {Array<Object>} profiles - ข้อมูลโปรไฟล์ที่ผ่านการกรองแล้ว
 * @returns {HTMLElement} - Element ของ Section ที่สร้างเสร็จ
 */
function createSearchResultSection(profiles) {
    let headerText;
    const currentProvKey = dom.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE);
    const urlProvMatch = window.location.pathname.match(/\/(?:location|province)\/([^/]+)/);
    let activeKey = urlProvMatch ? urlProvMatch[1] : currentProvKey;

    if (activeKey && state.provincesMap.has(activeKey) && activeKey !== 'all') {
        const name = state.provincesMap.get(activeKey);
        headerText = `📍 น้องๆ ในจังหวัด <span class="text-pink-600">${name}</span>`;
    } else if (dom.searchInput?.value) {
        headerText = `🔍 ผลการค้นหา "${dom.searchInput.value}"`;
    } else {
        headerText = `✨ โปรไฟล์ทั้งหมด`;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'section-content-wrapper animate-fade-in-up';
    wrapper.innerHTML = `
        <div class="px-4 sm:px-6 pt-8 pb-4">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div><h3 class="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white leading-tight">${headerText}</h3></div>
                <div class="flex-shrink-0"><span class="inline-flex items-center px-4 py-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold text-sm border border-pink-100 dark:border-pink-800">พบ ${profiles.length} รายการ</span></div>
            </div>
        </div>
        <div class="profile-grid grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 sm:px-6 pb-12"></div>
    `;
    
    const gridContainer = wrapper.querySelector('.profile-grid');
    renderCardsIncrementally(gridContainer, profiles); // มอบหมายงานให้ผู้ช่วย

    return wrapper;
}

/**
 * สร้าง Section ของแต่ละจังหวัดสำหรับแสดงผลในหน้าแรก (ฉบับแก้ไข)
 * @param {string} key - Key ของจังหวัด
 * @param {string} name - ชื่อจังหวัด
 * @param {Array<Object>} profiles - โปรไฟล์ในจังหวัดนั้นๆ
 * @returns {HTMLElement} - Element ของ Section จังหวัด
 */
function createProvinceSection(key, name, profiles) {
    const wrapper = document.createElement('div');
    wrapper.className = 'section-content-wrapper province-section mt-12';
    wrapper.id = `province-${key}`;
    wrapper.setAttribute('data-animate-on-scroll', '');
    wrapper.innerHTML = `
        <div class="p-6 md:p-8">
            <a href="/location/${key}" class="group block">
                <h2 class="province-section-header flex items-center gap-2.5 text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-pink-600 transition-colors">
                    📍 จังหวัด ${name}
                    <span class="ml-2 bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded-full">${profiles.length}</span>
                    <i class="fas fa-chevron-right text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0"></i>
                </h2>
            </a>
        </div>
        <div class="profile-grid grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-6 md:px-8 pb-8"></div>
    `;

    const gridContainer = wrapper.querySelector('.profile-grid');
    renderCardsIncrementally(gridContainer, profiles); // มอบหมายงานให้ผู้ช่วย

    return wrapper;
}

/**
 * จัดการแสดงผลหน้าแรกแบบแยกตามจังหวัด (High Performance & SEO Optimized)
 * ทำงานแบบ Asynchronous เพื่อไม่ให้หน้าเว็บค้าง
 */
async function renderByProvince(profiles) {
    // 1. Group ข้อมูล (จัดกลุ่มน้องๆ ตามจังหวัด)
    const groups = profiles.reduce((acc, p) => {
        const key = p.provinceKey || 'no_province';
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {});

    // 2. Sort Keys (เรียงชื่อจังหวัด ก-ฮ)
    const keys = Object.keys(groups).sort((a, b) => {
        const nA = state.provincesMap.get(a) || a;
        const nB = state.provincesMap.get(b) || b;
        return nA.localeCompare(nB, 'th');
    });

    // 3. ตรวจสอบข้อมูล
    if (keys.length === 0) {
        dom.noResultsMessage?.classList.remove('hidden');
        return;
    }


    for (const key of keys) {
        const name = state.provincesMap.get(key) || (key === 'no_province' ? 'ไม่ระบุจังหวัด' : key);
        
        // สร้าง Section ของจังหวัดนั้น
        const provinceSection = createProvinceSection(key, name, groups[key]);
        
        // เพิ่ม Animation ให้สวยงาม (Fade In)
        provinceSection.style.opacity = '0';
        provinceSection.style.transform = 'translateY(20px)';
        provinceSection.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        // แปะลงหน้าเว็บ
        dom.profilesDisplayArea.appendChild(provinceSection);

        // สั่งให้ Browser วาดทันที (Force Reflow) แล้วค่อยเล่น Animation
        requestAnimationFrame(() => {
            provinceSection.style.opacity = '1';
            provinceSection.style.transform = 'translateY(0)';
        });

        // 🟢 สำคัญ: พักการทำงานชั่วครู่ เพื่อให้ UI ตอบสนองได้ (แก้ INP)
        await yieldToMain();
    }
}

function renderProfiles(profiles, isSearching) {
    if (!dom.profilesDisplayArea) return;
    
    // 1. ซ่อน Error และ No Results ก่อนเริ่มงาน
    dom.noResultsMessage?.classList.add('hidden');
    if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');

    // 2. จัดการส่วน Featured (แนะนำ)
    if (dom.featuredSection) {
        const isHome = !isSearching && !window.location.pathname.includes('/location/');
        dom.featuredSection.classList.toggle('hidden', !isHome);

        if (isHome && dom.featuredContainer && dom.featuredContainer.children.length === 0) {
            const featured = state.allProfiles.filter(p => p.isfeatured);
            renderCardsIncrementally(dom.featuredContainer, featured);
        }
    }

    // 3. กรณีไม่มีข้อมูล
    if (!profiles || profiles.length === 0) {
        dom.profilesDisplayArea.innerHTML = '';
        dom.noResultsMessage?.classList.remove('hidden');
        if (dom.resultCount) dom.resultCount.style.display = 'none';
        return;
    }

    // 4. ตัดสินใจโหมดการวาด (ค้นหา/จังหวัด หรือ หน้าแรกแยกตามจังหวัด)
    const isLocationPage = window.location.pathname.includes('/location/') || window.location.pathname.includes('/province/');
    
    // ล้างพื้นที่แสดงผลหลัก "ครั้งเดียว" ก่อนเริ่มวาดใหม่
    dom.profilesDisplayArea.innerHTML = '';

    if (isSearching || isLocationPage) {
        // [โหมด A] หน้าค้นหา หรือ หน้าจังหวัด (เช่น เชียงใหม่)
        const searchSection = createSearchResultSection(profiles);
        dom.profilesDisplayArea.appendChild(searchSection);
        
        // สั่งวาดการ์ดใน Grid ของ Search Section
        const grid = searchSection.querySelector('.profile-grid');
        renderCardsIncrementally(grid, profiles);
    } else {
        // [โหมด B] หน้าแรกแบบแยกจังหวัด (ทยอยวาดทีละจังหวัด)
        renderByProvince(profiles);
    }

    // 5. อัปเดต ScrollTrigger เพื่อให้ Animation ทำงานถูกต้อง
    if (window.ScrollTrigger) {
        setTimeout(() => ScrollTrigger.refresh(), 500);
    }
}

function createProfileCard(p, index = 20) {
    // 1. สร้าง Container หลัก
    const cardContainer = document.createElement('div');
    cardContainer.className = 'profile-card-new-container';

    // 2. สร้าง Card Inner (กรอบการ์ด)
    const cardInner = document.createElement('div');
    cardInner.className = 'profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-gray-200 dark:bg-gray-800 cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1';
    
    cardInner.setAttribute('data-profile-id', p.id); 
    cardInner.setAttribute('data-profile-slug', p.slug);
    
    const imgSrc = (p.images && p.images.length > 0) ? p.images[0].src : '/images/placeholder-profile.webp';

    cardInner.innerHTML = `
        <div class="skeleton-loader absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse z-0"></div>
        <img src="${imgSrc}" 
             alt="น้อง${p.name} - ไซด์ไลน์${p.provinceNameThai || 'เชียงใหม่'} รับงานเอง ฟิวแฟน ตรงปก 100%"
             class="card-image w-full h-full object-cover transition-opacity duration-700 opacity-0 absolute inset-0 z-0"
             loading="${index < 4 ? 'eager' : 'lazy'}"
             style="object-position: center top;"
             onload="this.classList.remove('opacity-0'); if(this.previousElementSibling) this.previousElementSibling.remove();"
             onerror="this.src='/images/placeholder-profile.webp'; this.classList.remove('opacity-0'); if(this.previousElementSibling) this.previousElementSibling.remove();">
             
        <a href="/sideline/${p.slug}" class="card-link absolute inset-0 z-10" aria-labelledby="profile-name-${p.id}"></a>
    `;

    let statusClass = 'status-inquire';
    const availability = (p.availability || '').toLowerCase();
    
    if (availability.includes('ว่าง') || availability.includes('รับงาน')) {
        statusClass = 'status-available';
    } else if (availability.includes('ไม่ว่าง') || availability.includes('พัก')) {
        statusClass = 'status-busy';
    }
    
    const badgesHTML = `
        <div class="absolute top-2 right-2 flex flex-col gap-1 items-end z-20 pointer-events-none">
            <span class="availability-badge ${statusClass} shadow-md backdrop-blur-md bg-white/10 border border-white/20 text-[10px] font-bold px-2 py-1 rounded-full text-white">
                ${p.availability || 'สอบถาม'}
            </span>
            ${p.isfeatured ? '<span class="featured-badge bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm"><i class="fas fa-star mr-1"></i>แนะนำ</span>' : ''}
        </div>
    `;

    const likedProfiles = JSON.parse(localStorage.getItem('liked_profiles') || '{}');
    const isLikedClass = likedProfiles[p.id] ? 'liked' : '';
    const likeCount = p.likes || 0;

    const overlayHTML = `
        <div class="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-between" 
             style="z-index: 20; pointer-events: none;">
            
            <div class="card-header mt-8"></div>
            
            <div class="card-footer-content">
                <h3 id="profile-name-${p.id}" class="text-lg font-bold text-white drop-shadow-md leading-tight truncate pr-2">${p.name}</h3>
                <p class="text-xs text-gray-300 flex items-center mt-0.5 mb-2">
                    <i class="fas fa-map-marker-alt mr-1 text-pink-500"></i> ${p.provinceNameThai || 'เชียงใหม่'}
                </p>

                <div class="flex justify-between items-end border-t border-white/10 pt-2">
                    <div class="date-stamp text-[10px] text-gray-400">
                        อัปเดต: ${formatDate(p.created_at)}
                    </div>
                    
                    <div class="like-button-wrapper relative flex items-center gap-1.5 text-white cursor-pointer group/like ${isLikedClass} hover:text-pink-400 transition-colors"
                         style="pointer-events: auto !important; z-index: 30 !important;"
                         data-action="like" 
                         data-id="${p.id}"
                         role="button" 
                         tabindex="0"
                         aria-pressed="${isLikedClass ? 'true' : 'false'}"
                         aria-label="ถูกใจโปรไฟล์ ${p.name}">
                        <i class="fas fa-heart text-lg transition-transform duration-200 group-hover/like:scale-110"></i>
                        <span class="like-count text-sm font-bold">${likeCount}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardInner.insertAdjacentHTML('beforeend', badgesHTML);
    cardInner.insertAdjacentHTML('beforeend', overlayHTML);
    cardContainer.appendChild(cardInner);

    return cardContainer;
}

async function fetchSingleProfile(slug) {
    if (!supabase) {
        console.error("❌ Supabase Error: ไม่สามารถติดต่อฐานข้อมูลได้");
        return null;
    }

    try {
        let { data, error } = await supabase
            .from('profiles')
            .select('*, provinces(key, nameThai)')
            .eq('slug', slug)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('❌ Supabase Fetch by Slug Failed:', error.message);
        }
        
        if (data) return processProfileData(data);

        const parts = slug.split('-');
        const potentialId = parts[parts.length - 1]; 
        
        if (potentialId && !isNaN(potentialId) && potentialId.trim() !== '') {
            const profileId = parseInt(potentialId);
            const { data: byIdData, error: byIdError } = await supabase
                .from('profiles')
                .select('*, provinces(key, nameThai)')
                .eq('id', profileId)
                .maybeSingle();

            if (byIdError && byIdError.code !== 'PGRST116') {
                console.error('❌ Supabase Fetch by ID Failed:', byIdError.message);
            }

            if (byIdData) return processProfileData(byIdData);
        }
        return null;
    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาดร้ายแรงขณะดึงโปรไฟล์:", err.message, err);
        return null;
    }
}

function initLightboxEvents() {
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a.card-link');
        if (link && link.closest('.profile-card-new')) {
            e.preventDefault(); 
            const card = link.closest('.profile-card-new');
            const slug = card.getAttribute('data-profile-slug');
            if (slug) {
                state.lastFocusedElement = card;
                history.pushState(null, '', `/sideline/${slug}`);
                handleRouting();
            }
        }
    });

    const closeAction = () => {
        history.pushState(null, '', '/');
        handleRouting();
    };

    if(dom.lightboxCloseBtn) dom.lightboxCloseBtn.addEventListener('click', closeAction);
    if(dom.lightbox) dom.lightbox.addEventListener('click', (e) => { if (e.target === dom.lightbox) closeAction(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.currentProfileSlug) closeAction();
    });
}

function openLightbox(p) {
    if (!dom.lightbox) return;
    populateLightboxData(p);
    dom.lightbox.classList.remove('hidden');
    gsap.set(dom.lightbox, { opacity: 0 });
    gsap.to(dom.lightbox, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
    gsap.to(dom.lightboxWrapper, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.2)' });
    document.body.style.overflow = 'hidden';
}

function closeLightbox(animate = true) {
    if (!dom.lightbox || dom.lightbox.classList.contains('hidden')) return;

    if (animate) {
        gsap.to(dom.lightbox, { opacity: 0, pointerEvents: 'none', duration: 0.2 });
        gsap.to(dom.lightboxWrapper, { 
            scale: 0.95, opacity: 0, duration: 0.2, 
            onComplete: () => {
                dom.lightbox.classList.add('hidden');
                document.body.style.overflow = '';
                state.lastFocusedElement?.focus();
            }
        });
    } else {
        dom.lightbox.classList.add('hidden');
        dom.lightbox.style.opacity = '0';
        document.body.style.overflow = '';
    }
}

function populateLightboxData(p) {
    if (!p) {
        console.error("populateLightboxData called with invalid profile data.");
        closeLightbox();
        return;
    }

    const els = {
        name: document.getElementById('lightbox-profile-name-main'),
        hero: document.getElementById('lightboxHeroImage'),
        thumbs: document.getElementById('lightboxThumbnailStrip'),
        quote: document.getElementById('lightboxQuote'),
        tags: document.getElementById('lightboxTags'),
        avail: document.getElementById('lightbox-availability-badge-wrapper'),
        detailsContainer: document.getElementById('lightboxDetailsCompact'),
        descContainer: document.getElementById('lightboxDescriptionContainer'),
        descContent: document.getElementById('lightboxDescriptionContent'),
        lineBtnContainer: document.querySelector('.lightbox-details')
    };

    if (els.name) els.name.textContent = p.name || 'ไม่ระบุชื่อ';
    if (els.quote) {
        const hasQuote = p.quote && p.quote.trim() !== '';
        els.quote.textContent = hasQuote ? `"${p.quote}"` : '';
        els.quote.style.display = hasQuote ? 'block' : 'none';
    }
    
    if (els.avail) {
        let statusClass = 'status-inquire';
        let icon = '<i class="fas fa-question-circle"></i>';
        if (p.availability?.toLowerCase().includes('ว่าง') || p.availability?.toLowerCase().includes('รับงาน')) {
            statusClass = 'status-available';
            icon = '<i class="fas fa-check-circle"></i>';
        } else if (p.availability?.toLowerCase().includes('ไม่ว่าง')) {
            statusClass = 'status-busy';
            icon = '<i class="fas fa-times-circle"></i>';
        }
        els.avail.innerHTML = `<div class="lb-status-badge ${statusClass}">${icon} ${p.availability || 'สอบถาม'}</div>`;
    }

    if (els.hero) {
        els.hero.src = p.images?.[0]?.src || '/images/placeholder-profile.webp';
        els.hero.alt = p.altText || `รูปโปรไฟล์ ${p.name}`;
    }
    if (els.thumbs) {
        els.thumbs.innerHTML = '';
        if (p.images && p.images.length > 1) {
            const fragment = document.createDocumentFragment();
            p.images.forEach((img, i) => {
                const thumb = document.createElement('img');
                thumb.className = `thumbnail ${i === 0 ? 'active' : ''}`;
                thumb.src = img.src;
                thumb.alt = `รูปภาพ ${i + 1} ของ ${p.name}`;
                thumb.loading = 'lazy';
                thumb.onclick = () => {
                    if (els.hero) els.hero.src = img.src;
                    els.thumbs.querySelector('.active')?.classList.remove('active');
                    thumb.classList.add('active');
                };
                fragment.appendChild(thumb);
            });
            els.thumbs.appendChild(fragment);
            els.thumbs.style.display = 'grid';
        } else {
            els.thumbs.style.display = 'none';
        }
    }

    if (els.tags) {
        els.tags.innerHTML = '';
        if (Array.isArray(p.styleTags) && p.styleTags.length > 0 && p.styleTags[0] !== '') {
            p.styleTags.forEach(t => {
                if (t && t.trim() !== '') {
                    const span = document.createElement('span');
                    span.className = 'tag-badge';
                    span.textContent = t.trim();
                    els.tags.appendChild(span);
                }
            });
            els.tags.style.display = 'flex';
        } else {
            els.tags.style.display = 'none';
        }
    }

    if (els.detailsContainer) {
        const provinceName = state.provincesMap.get(p.provinceKey) || '';
        const fullLocation = [provinceName, p.location ? `(${p.location})` : ''].filter(Boolean).join(' ').trim();
        const dateToShow = p.lastUpdated || p.created_at;
        const formattedDate = formatDate(dateToShow);

        let detailsHTML = `
            <div class="stats-grid-container">
                ${p.age ? `<div class="stat-box"><span class="stat-label">อายุ</span><span class="stat-value">${p.age} ปี</span></div>` : ''}
                ${p.stats ? `<div class="stat-box"><span class="stat-label">สัดส่วน</span><span class="stat-value">${p.stats}</span></div>` : ''}
                ${(p.height || p.weight) ? `<div class="stat-box"><span class="stat-label">สูง/หนัก</span><span class="stat-value">${p.height || '-'}/${p.weight || '-'}</span></div>` : ''}
            </div>
            <div class="info-list-container mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">`;

        const infoRows = [
            { label: 'สีผิว', value: p.skinTone, icon: 'fa-palette' },
            { label: 'พิกัด', value: fullLocation, icon: 'fa-map-marker-alt', class: 'text-primary' },
            { label: 'เรทราคา', value: p.rate, icon: 'fa-tag', class: 'text-green-600 dark:text-green-400' },
            { label: 'อัปเดตล่าสุด', value: formattedDate, icon: 'fa-camera' }
        ];

        infoRows.forEach(row => {
            if (row.value) {
                detailsHTML += `
                    <div class="info-row">
                        <div class="info-label"><i class="fas ${row.icon} info-icon"></i> ${row.label}</div>
                        <div class="info-value ${row.class || ''}">${row.value}</div>
                    </div>`;
            }
        });
        detailsHTML += '</div>';
        els.detailsContainer.innerHTML = detailsHTML;
    }

    if (els.descContainer && els.descContent) {
        if (p.description && p.description.trim() !== '') {
            els.descContent.innerHTML = p.description.replace(/\n/g, '<br>');
            els.descContainer.style.display = 'block';
        } else {
            els.descContainer.style.display = 'none';
        }
    }

    // LINE Button Logic
    const oldWrapper = document.getElementById('line-btn-sticky-wrapper');
    if (oldWrapper) oldWrapper.remove();
    
    if (p.lineId && els.lineBtnContainer) {
        const wrapper = document.createElement('div');
        wrapper.id = 'line-btn-sticky-wrapper';
        wrapper.className = 'lb-sticky-footer';

        const profileUrl = `${CONFIG.SITE_URL}/sideline/${p.slug}`;
        const autoMessage = `สวัสดีครับ สนใจน้อง ${p.name} เห็นจากเว็บ Sideline Chiangmai ครับ\n${profileUrl}`;
        let finalLineUrl = p.lineId.startsWith('http') ? p.lineId : `https://line.me/ti/p/~${p.lineId}`;

        const link = document.createElement('a');
        link.className = 'btn-line-action';
        link.href = '#';
        link.innerHTML = `<i class="fab fa-line text-xl"></i> แอดไลน์ ${p.name || ''}`;

        link.onclick = (e) => {
            e.preventDefault();
            if (navigator.clipboard) navigator.clipboard.writeText(autoMessage).catch(console.error);

            const modal = document.createElement('div');
            modal.style.cssText = "position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); animation: fadeIn 0.2s ease-out;";
            modal.innerHTML = `
                <div style="background: white; width: 100%; max-width: 340px; border-radius: 24px; padding: 30px 24px; text-align: center; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                    <div style="width: 70px; height: 70px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 0 8px rgba(209, 250, 229, 0.3);">
                        <i class="fas fa-check" style="font-size: 32px; color: #059669;"></i>
                    </div>
                    <h3 style="font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 10px;">คัดลอกข้อมูลแล้ว!</h3>
                    <p style="color: #4b5563; font-size: 15px; margin-bottom: 24px;">ระบบบันทึกชื่อน้องให้แล้วครับ เมื่อแอปเปิดขึ้นมา <span style="font-weight: bold; color: #db2777;">กรุณากด "วาง" (Paste) ในแชท</span></p>
                    <a href="${finalLineUrl}" id="go-to-line-btn" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: #06c755; color: white; font-weight: bold; border-radius: 14px; text-decoration: none; font-size: 16px; box-shadow: 0 4px 15px rgba(6, 199, 85, 0.4);">
                        <i class="fab fa-line" style="font-size: 24px;"></i> เปิด LINE ทันที
                    </a>
                    <button id="close-modal-btn" style="margin-top: 16px; background: transparent; border: none; color: #9ca3af; font-size: 14px; cursor: pointer; padding: 8px;">ยกเลิก</button>
                </div>`;
            document.body.appendChild(modal);
            modal.querySelector('#close-modal-btn').onclick = () => { modal.style.opacity = '0'; setTimeout(() => modal.remove(), 200); };
            modal.querySelector('#go-to-line-btn').onclick = () => { setTimeout(() => { modal.remove(); }, 500); };
        };
        wrapper.appendChild(link);
        els.lineBtnContainer.appendChild(wrapper);
    }
}

// ==========================================
// 💎 SEO STRATEGIC POOL (คลังคำศัพท์ LSI)
// ==========================================
const SEO_POOL = {
    styles: [
        "ฟิวแฟนแท้ๆ", "งานเนี๊ยบดูแลดี", "สายหวานคุยสนุก", 
        "เอาใจเก่งสุดๆ", "สไตล์นางแบบ", "น่ารักขี้อ้อน", 
        "งานเอนเตอร์เทน", "คุยเก่งไม่เดดแอร์"
    ],
    trust: [
        "ไม่ต้องโอนก่อน", "ไม่มีมัดจำล่วงหน้า", "ไม่โอนจอง", 
        "จ่ายหน้างาน 100%", "นัดเจอจ่ายสด", "ปลอดภัยไร้กังวล"
    ],
    guarantee: [
        "ตัวจริงตรงรูป 100%", "รูปปัจจุบันไม่จกตา", "การันตีความสวย", 
        "ตรงปกไม่ผิดหวัง", "คัดงานคุณภาพ", "รับประกันความตรงปก"
    ],
    pick: function(group) {
        return this[group][Math.floor(Math.random() * this[group].length)];
    }
};

// =================================================================
// 10. SEO META TAGS UPDATER (THE ULTIMATE VERSION)
// =================================================================
function updateAdvancedMeta(profile = null, pageData = null) {
    // Safety check: only run for dynamic pages or root
    const currentPath = window.location.pathname.toLowerCase();
    const isRoot = currentPath === '/' || currentPath === '' || currentPath === '/index.html';
    const isDynamic = profile || pageData;

    if (!isDynamic && !isRoot) {
        return; // 🛑 Prevent meta updates on static pages
    }

    // Clear existing JSON-LD scripts
    document.querySelectorAll('script[id^="schema-jsonld"]').forEach(s => s.remove());

    const YEAR_TH = new Date().getFullYear() + 543;
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const d = new Date();
    const CURRENT_DATE = `${d.getDate()} ${thaiMonths[d.getMonth()]} ${YEAR_TH}`;

    const getCleanName = (rawName) => {
        if (!rawName) return "";
        let name = rawName.trim().replace(/^(น้อง\s?)/, '');
        name = name.toLowerCase();
        return `น้อง${name.charAt(0).toUpperCase() + name.slice(1)}`;
    };

    // ==========================================
    // CASE A: หน้าโปรไฟล์ (สูตรที่คุณต้องการ)
    // ==========================================
    if (profile) {
        const displayName = getCleanName(profile.name);
        const province = profile.provinceNameThai || 'เชียงใหม่';
        
        // ข้อมูล
        const priceInfo = profile.rate ? `ราคา ${profile.rate}` : 'สอบถามราคา';
        const workArea = profile.location ? `${profile.location}, ${province}` : province;
        
        let statsParts = [];
        if (profile.stats) statsParts.push(`สัดส่วน ${profile.stats}`);
        if (profile.age) statsParts.push(`อายุ ${profile.age}`);
        const detailsSnippet = statsParts.join('. '); 

        const t = SEO_POOL.pick('trust');
        const g = SEO_POOL.pick('guarantee');

        // 🏆 TITLE: [ชื่อ] รับงานไซด์ไลน์[จังหวัด] | [การันตี] [ความน่าเชื่อถือ] (ปี)
        // (ไม่มีราคาในชื่อ ตามที่ขอ)
        const finalTitle = `${displayName} รับงานไซด์ไลน์${province} | ${g} ${t} (${YEAR_TH})`;

        // 🚀 DESCRIPTION: เรียงตามสูตรเป๊ะ
        // โปรไฟล์... พื้นที่... ราคา... สัดส่วน... การันตี... Call to Action...
        const finalDesc = `โปรไฟล์ ${displayName} สำหรับรับงานไซด์ไลน์ในพื้นที่ ${workArea}. ${priceInfo}. ${detailsSnippet}. ${g} และ ${t} 100%. ปลอดภัย จ่ายเงินหน้างาน. คลิกเพื่อดูรูปภาพเพิ่มเติม, อ่านรีวิว และแอดไลน์เพื่อนัดหมายได้ทันที. (อัปเดต ${CURRENT_DATE})`;

        const keywords = [
            displayName,
            `รับงานไซด์ไลน์${province}`,
            `ไซด์ไลน์${province}`,
            `รับงาน${province}`,
            profile.location,
            priceInfo,
            t, g
        ].filter(Boolean).join(', ');

        // Update
        document.title = finalTitle;
        updateMeta('description', finalDesc);
        updateMeta('keywords', keywords);
        updateLink('canonical', `${CONFIG.SITE_URL}/sideline/${profile.slug || profile.id}`);
        
        updateOpenGraphMeta(profile, finalTitle, finalDesc, 'profile');
        injectSchema(generatePersonSchema(profile, finalDesc, province), 'schema-jsonld-person');
        injectSchema(generateBreadcrumbSchema('profile', displayName, province), 'schema-jsonld-breadcrumb');
    }

    // ==========================================
    // CASE B: หน้าจังหวัด
    // ==========================================
    else if (pageData) {
        const province = pageData.provinceName || 'เชียงใหม่';
        const count = pageData.profiles ? pageData.profiles.length : 'หลาย';
        const t = SEO_POOL.pick('trust');
        const g = SEO_POOL.pick('guarantee');

        const pageTitle = `ไซด์ไลน์${province} รับงานเอง ${t} | รวมรูปน้องๆ ${province} ตรงปก (${YEAR_TH})`;
        const pageDesc = `รวมรายชื่อน้องๆ ไซด์ไลน์${province} รับงานเอง พิกัด${province} กว่า ${count} คน. ข้อมูลชัดเจน รูปตรงปก ${g}. ${t} นัดเจอจ่ายเงินหน้างานเท่านั้น. อัปเดตล่าสุด ${CURRENT_DATE}.`;

        document.title = pageTitle;
        updateMeta('description', pageDesc);
        updateMeta('keywords', `ไซด์ไลน์${province}, รับงาน${province}, เด็กเอ็น${province}, ${province} ไม่มัดจำ`);
        updateLink('canonical', pageData.canonicalUrl || window.location.href);
        
        updateOpenGraphMeta(null, pageTitle, pageDesc, 'website');
        injectSchema(generateListingSchema(pageData), 'schema-jsonld-list');
        injectSchema(generateBreadcrumbSchema('location', province), 'schema-jsonld-breadcrumb');
    } 
    
    // ==========================================
    // CASE C: หน้าแรก (Home Page - Authority)
    // ==========================================
    else {
        // 🛡️ DOUBLE CHECK: ถ้าไม่ใช่ Root Path จริงๆ ห้ามทำ
        if (currentPath !== '/' && currentPath !== '' && currentPath !== '/index.html') return;

        const GLOBAL_TITLE = `Sideline Chiangmai - ศูนย์รวมไซด์ไลน์เชียงใหม่และทั่วไทย รับงานเอง ไม่ผ่านเอเย่นต์ (${YEAR_TH})`;
        const GLOBAL_DESC = `เว็บไซต์อันดับ 1 รวมไซด์ไลน์เชียงใหม่ และจังหวัดอื่นๆ ทั่วประเทศ. คัดเน้นๆ สวยตรงปก 100%. ระบบปลอดภัย ไม่ต้องโอนมัดจำ (No Deposit). เช็คเรทราคา รูปภาพ และรีวิวตัวจริงได้ที่นี่ อัปเดตใหม่ทุกวัน`;

        document.title = GLOBAL_TITLE;
        updateMeta('description', GLOBAL_DESC);
        updateMeta('keywords', 'ไซด์ไลน์เชียงใหม่, รับงานไซด์ไลน์, ไซด์ไลน์ไม่มัดจำ, ตรงปก');
        updateLink('canonical', CONFIG.SITE_URL);
        
        updateOpenGraphMeta(null, GLOBAL_TITLE, GLOBAL_DESC, 'website');
        injectSchema(generateWebsiteSchema(), 'schema-jsonld-web');
        injectSchema(generateOrganizationSchema(), 'schema-jsonld-org');
        
        const FAQ_DATA = [
            { question: "ต้องโอนมัดจำก่อนไหม?", answer: "ไม่ต้องค่ะ! เราเน้นความปลอดภัยสูงสุด สมาชิกสามารถนัดเจอและจ่ายเงินหน้างานกับน้องๆ ได้โดยตรง 100% ไม่มีการเรียกเก็บเงินก่อนค่ะ" },
            { question: "การันตีความตรงปกไหม?", answer: "ทางเราคัดกรองรูปภาพให้เป็นปัจจุบันที่สุด พร้อมการันตีความตรงปก หากไม่เหมือนในรูป สามารถปฏิเสธหน้างานได้ทันทีค่ะ" }
        ];
        injectSchema(generateFAQPageSchema(FAQ_DATA), 'schema-jsonld-faq');
    }
}


// =================================================================
// HELPER FUNCTIONS & SCHEMAS (UPDATED)
// =================================================================

function updateOpenGraphMeta(profile, title, description, type) {
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:url', profile ? `${CONFIG.SITE_URL}/sideline/${profile.slug}` : CONFIG.SITE_URL);
    updateMeta('og:type', type); 
    updateMeta('og:locale', 'th_TH'); 
    
    let imageUrl = (profile && profile.images && profile.images[0]) 
                    ? profile.images[0].src 
                    : CONFIG.DEFAULT_OG_IMAGE;
    
    updateMeta('og:image', imageUrl);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', imageUrl);
}

function generatePersonSchema(p, descriptionOverride, provinceName) {
    const priceNumeric = (p.rate || "0").toString().replace(/\D/g, '');
    let cleanName = (p.name || '').replace(/^น้อง/, '').trim();

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
        "name": `น้อง${cleanName}`,
        "url": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
        "image": (p.images && p.images[0]) ? p.images[0].src : CONFIG.DEFAULT_OG_IMAGE,
        "description": descriptionOverride,
        "jobTitle": "Freelance Model",
        "gender": "Female",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": provinceName,
            "addressRegion": "Thailand",
            "addressCountry": "TH"
        },
        "offers": {
            "@type": "Offer",
            "price": priceNumeric,
            "priceCurrency": "THB",
            "availability": p.availability?.includes('ไม่ว่าง') ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            "description": "ชำระเงินหน้างานเท่านั้น ไม่มีมัดจำ (Cash on arrival only)"
        },
        "additionalProperty": [
            { "@type": "PropertyValue", "name": "Age", "value": p.age },
            { "@type": "PropertyValue", "name": "Stats", "value": p.stats },
            { "@type": "PropertyValue", "name": "Height", "value": p.height },
            { "@type": "PropertyValue", "name": "SkinTone", "value": p.skinTone }
        ]
    };
}

function generateFAQPageSchema(faqData) {
    if (!faqData || faqData.length === 0) return null;
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };
}

function generateBreadcrumbSchema(type, name) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "หน้าแรก",
            "item": CONFIG.SITE_URL
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": type === 'location' ? `จังหวัด ${name}` : name,
            "item": type === 'location' ? `${CONFIG.SITE_URL}/location/${encodeURIComponent(name)}` : undefined 
        }]
    };
}

function generateListingSchema(pageData) {
    if (!pageData || !pageData.profiles || pageData.profiles.length === 0) return null;
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `รายชื่อไซด์ไลน์ในจังหวัด ${pageData.provinceName}`,
        "description": pageData.description,
        "numberOfItems": pageData.profiles.length,
        "itemListElement": pageData.profiles.map((p, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Person",
                "name": p.name,
                "url": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
                "image": (p.images && p.images.length > 0) ? p.images[0].src : CONFIG.DEFAULT_OG_IMAGE
            }
        }))
    };
}

function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": CONFIG.SITE_URL,
        "name": "Sideline Chiangmai",
        "description": "ศูนย์รวมน้องๆ ไซด์ไลน์ ฟิวแฟน ตรงปก 100% ไม่มัดจำ",
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${CONFIG.SITE_URL}/?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };
}

function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Sideline Chiangmai",
        "url": CONFIG.SITE_URL,
        "logo": "https://sidelinechiangmai.netlify.app/images/sidelinechiangmai-social-preview.webp",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "description": "มีแอดมินดูแลฟรีตลอดเวลาทำการ"
        }
    };
}

function injectSchema(json, id = 'schema-jsonld') {
    if (!json) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(json);
    document.head.appendChild(script);
}

function updateMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    if (!el) {
        el = document.createElement('meta');
        if (name.startsWith('og:')) el.setAttribute('property', name);
        else el.name = name;
        document.head.appendChild(el);
    }
    el.content = content;
}

function updateLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
    el.href = href;
}


    function updateResultCount(count, total, isFiltering) {
        if (!dom.resultCount) return;
        if (count > 0) {
            dom.resultCount.innerHTML = `✅ พบ ${count} โปรไฟล์${isFiltering ? ` จาก ${total}` : ''}`;
            dom.resultCount.style.display = 'block';
        } else {
            dom.resultCount.innerHTML = '❌ ไม่พบโปรไฟล์ตามเงื่อนไข';
            dom.resultCount.style.display = 'block';
        }
    }

    function init3dCardHoverDelegate() {
        // Disabled for now
    }

    function initHeaderScrollEffect() {
        if (!dom.pageHeader) return;
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    dom.pageHeader.classList.toggle('scrolled', window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    function initScrollAnimations() {
        const els = document.querySelectorAll('[data-animate-on-scroll]:not(.is-visible)');
        if (!els.length) return;
        const obs = new IntersectionObserver((entries, o) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('is-visible'); o.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
    }

    function initMarqueeEffect() {
        const marquee = document.querySelector('.social-marquee');
        if (!marquee) return;
        const wrapper = marquee.parentElement;
        marquee.innerHTML += marquee.innerHTML;
        let scroll = 0; let speed = 0.5; let isHover = false;
        function loop() {
            if (!isHover) {
                scroll -= speed;
                if (scroll <= -marquee.scrollWidth / 2) scroll = 0;
                marquee.style.transform = `translate3d(${scroll}px, 0, 0)`;
            }
            requestAnimationFrame(loop);
        }
        loop();
        wrapper.addEventListener('mouseenter', () => isHover = true);
        wrapper.addEventListener('mouseleave', () => isHover = false);
    }

    function initThemeToggle() {
        const btns = document.querySelectorAll('.theme-toggle-btn');
        const apply = (theme) => {
            document.documentElement.classList.toggle('dark', theme === 'dark');
            localStorage.setItem(CONFIG.KEYS.THEME, theme);
        };
        const saved = localStorage.getItem(CONFIG.KEYS.THEME) || 'light';
        apply(saved);
        btns.forEach(b => b.onclick = () => apply(document.documentElement.classList.contains('dark') ? 'light' : 'dark'));
    }

    function initMobileMenu() {
        const btn = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('menu-backdrop');
        const close = document.getElementById('close-sidebar-btn');
        if (!btn || !sidebar) return;
        const toggle = (open) => {
            sidebar.classList.toggle('translate-x-full', !open);
            sidebar.classList.toggle('open', open);
            backdrop?.classList.toggle('hidden', !open);
            document.body.style.overflow = open ? 'hidden' : '';
        };
        btn.onclick = () => toggle(true);
        close.onclick = () => toggle(false);
        backdrop.onclick = () => toggle(false);
    }


// ==========================================
// ✨ UPGRADED: VIP AGE GATE (SEO, LUXURY & PROPORTIONAL)
// ==========================================
function initAgeVerification() {
    // 1. 🛡️ SEO Safe Guard: อนุญาตให้ Search Engine บอทข้ามไปเก็บข้อมูลเนื้อหาหลักได้
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|ia_archiver|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|quora\ link\ preview|outbrain|pinterest\/0\.|vkShare|W3C_Validator|lighthouse|inspectiontool/i.test(navigator.userAgent);

    if (isBot) {
        console.log("🚀 SEO Mode: Indexing allowed.");
        return; 
    }

    // 2. ตรวจสอบการยืนยันตัวตน (ไม่แสดงซ้ำถ้าเพิ่งยืนยันไปไม่เกิน 1 ชม.)
    const ts = localStorage.getItem(CONFIG.KEYS.AGE_CONFIRMED);
    if (ts && (Date.now() - parseInt(ts)) < 3600000) return;

    // 3. สร้างระบบยืนยันอายุ (Luxury UI)
    const div = document.createElement('div');
    div.id = 'age-verification-overlay';
    
    // จัด Layout เต็มหน้าจอ
    div.style.cssText = "position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000;";
    
    div.innerHTML = `
        <!-- Background Layer: ใช้รูป Hero มาเบลอเพื่อคุมโทนเว็บ -->
        <div style="position: absolute; inset: 0; background-image: url('/images/hero-sidelinechiangmai-800.webp'); background-size: cover; background-position: center; filter: blur(40px); opacity: 0.25; transform: scale(1.1);"></div>
        <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, #000 100%);"></div>

        <!-- Card Container -->
        <div id="age-card-wrapper" style="position: relative; z-index: 10; width: 100%; max-width: 400px; padding: 24px;">
            <div style="background: rgba(22, 22, 22, 0.85); border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border-radius: 48px; padding: 55px 40px; box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.9); text-align: center; overflow: hidden; position: relative;">
                
                <!-- Glow Line Top: เส้นเรืองแสงด้านบนเพิ่มความหรูหรา -->
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, #ec4899, #9333ea, transparent); opacity: 0.7;"></div>
                
                <!-- Content Section -->
                <div style="margin-bottom: 40px;">
                    <p style="font-size: 10px; color: #ec4899; text-transform: uppercase; letter-spacing: 6px; font-weight: 800; margin-bottom: 15px; opacity: 0.9;">Welcome To</p>
                    <h2 style="font-size: 28px; font-weight: 900; color: #ffffff; margin-bottom: 30px; letter-spacing: -0.5px; line-height: 1.1;">Sideline <span style="color: #ec4899;">Chiangmai</span></h2>
                    
                    <!-- 20+ Badge -->
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 50%; background: rgba(236, 72, 153, 0.05); margin-bottom: 30px; border: 1.5px solid rgba(236, 72, 153, 0.4); box-shadow: 0 0 25px rgba(236, 72, 153, 0.15);">
                        <span style="font-size: 22px; font-weight: 900; color: #ec4899;">20+</span>
                    </div>
                    
                    <h3 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 12px; letter-spacing: 0.5px;">พื้นที่ส่วนบุคคล (VIP ONLY)</h3>
                    <p style="color: #d1d5db; font-size: 14px; line-height: 1.7; max-width: 280px; margin: 0 auto; font-weight: 400; opacity: 0.9;">
                        เว็บไซต์นี้จัดหาเนื้อหาสำหรับผู้ใหญ่<br>
                        กรุณายืนยันอายุเพื่อเข้าสู่ระบบ
                    </p>
                </div>

                <!-- Action Buttons: จัดเรียงแบบเน้นความสมมาตร -->
                <div style="display: flex; flex-direction: column; gap: 20px; align-items: center;">
                    <!-- ปุ่มเข้าสู่เว็บ (เด่น) -->
                    <button id="age-confirm" style="width: 100%; max-width: 280px; height: 58px; background: linear-gradient(90deg, #ec4899, #9333ea); color: white; font-weight: 800; border-radius: 100px; border: none; cursor: pointer; font-size: 16px; box-shadow: 0 15px 30px -8px rgba(236, 72, 153, 0.5); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); letter-spacing: 1px;">
                        ยืนยันอายุ (ENTER SITE)
                    </button>
                    
                    <!-- ปุ่มออก (มองเห็นชัดเจนขึ้น) -->
                    <button id="age-reject" style="background: transparent; color: #9ca3af; font-size: 13px; font-weight: 600; border: none; cursor: pointer; padding: 5px 15px; transition: all 0.3s ease; text-decoration: underline; text-underline-offset: 4px;">
                        ออกจากเว็บไซต์ (Exit Site)
                    </button>
                </div>
                
                <!-- Footer Info -->
                <div style="margin-top: 45px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                    <p style="font-size: 9px; color: #555; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">Premium Entertainment • Chiang Mai</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(div);
    document.body.style.overflow = 'hidden';

    // --- 4. ANIMATION & INTERACTION ---
    
    // เอฟเฟกต์การปรากฏตัว (GSAP)
    if (window.gsap) {
        gsap.fromTo("#age-card-wrapper", 
            { scale: 0.94, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
        );
    }

    // Hover Effect สำหรับปุ่ม Confirm
    const btnEnter = document.getElementById('age-confirm');
    btnEnter.onmouseover = () => btnEnter.style.filter = "brightness(1.1)";
    btnEnter.onmouseout = () => btnEnter.style.filter = "brightness(1)";

    // Hover Effect สำหรับปุ่ม Exit (เปลี่ยนสีให้ชัดขึ้นเมื่อเอาเมาส์จี้)
    const btnExit = document.getElementById('age-reject');
    btnExit.onmouseover = () => btnExit.style.color = "#ffffff";
    btnExit.onmouseout = () => btnExit.style.color = "#9ca3af";

    // 5. LOGIC: ปุ่มยืนยันอายุ
    document.getElementById('age-confirm').onclick = () => {
        localStorage.setItem(CONFIG.KEYS.AGE_CONFIRMED, Date.now());
        
        if (window.gsap) {
            gsap.to(div, { 
                opacity: 0, 
                scale: 1.05,
                duration: 0.5, 
                ease: "power2.inOut",
                onComplete: () => {
                    div.remove();
                    document.body.style.overflow = '';
                } 
            });
        } else {
            div.remove();
            document.body.style.overflow = '';
        }
    };

    // 6. LOGIC: ปุ่มออกจากเว็บ
    document.getElementById('age-reject').onclick = () => {
        window.location.href = 'https://google.com';
    };
}

// ==========================================
// 🚀 NAVIGATION & GLOBAL LOADER SYSTEM
// ==========================================

function updateActiveNavLinks() {
    const path = window.location.pathname;
    document.querySelectorAll('nav a').forEach(l => {
        // เพิ่มความเนียนด้วยการเช็ค path และปรับสีชมพู (pink-600) เมื่ออยู่หน้านั้นๆ
        const isActive = l.getAttribute('href') === path;
        l.classList.toggle('text-pink-600', isActive);
        l.classList.toggle('font-bold', isActive);
        if (isActive) {
            l.setAttribute('aria-current', 'page');
        }
    });
}

function createGlobalLoader() {
    if (document.getElementById('global-loader-overlay')) return;

    // เพิ่ม Style สำหรับ Keyframes ที่ดูนุ่มนวลกว่าเดิม
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes heart-pulse-custom {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(236, 72, 153, 0)); }
            50% { transform: scale(1.15); filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.4)); }
        }
        .animate-heart-pulse { animation: heart-pulse-custom 1.2s infinite ease-in-out; }
    `;
    document.head.appendChild(style);

    const loaderHTML = `
        <div id="global-loader-overlay" 
             style="position: fixed; inset: 0; z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #0b0f19; transition: opacity 0.5s ease;" 
             class="dark:bg-gray-950">
            
            <div style="position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; inset: 0; border-radius: 9999px; border: 2px dashed rgba(236, 72, 153, 0.2);" class="animate-spin"></div>
                <div style="position: absolute; inset: 5px; border-radius: 9999px; background-color: #ec4899; opacity: 0.15;" class="animate-ping"></div>
                
                <div style="position: relative; z-index: 10; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); box-shadow: 0 10px 30px -5px rgba(236, 72, 153, 0.5);">
                    <i class="fas fa-heart animate-heart-pulse" style="font-size: 34px; color: #ffffff;"></i>
                </div>
            </div>
            
            <div style="margin-top: 32px; text-align: center;">
                <h3 style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px;">Sideline Chiangmai</h3>
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <p style="font-size: 13px; color: #ec4899; font-weight: 600; letter-spacing: 1px;">PREMIUM CURATED SELECTION</p>
                    <div class="flex gap-1">
                        <span class="w-1 h-1 bg-pink-500 rounded-full animate-bounce"></span>
                        <span class="w-1 h-1 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                        <span class="w-1 h-1 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loaderHTML);
}

function showLoadingState() {
    let loader = document.getElementById('global-loader-overlay');
    if (!loader) {
        createGlobalLoader();
        loader = document.getElementById('global-loader-overlay');
    }
    // ใช้ GSAP ทำให้การปรากฏตัวนุ่มนวล
    gsap.set(loader, { display: 'flex', opacity: 0 });
    gsap.to(loader, { opacity: 1, duration: 0.3, pointerEvents: 'all' });
}

function hideLoadingState() {
    const loader = document.getElementById('global-loader-overlay');
    if (loader) {
        try {
            // ลองสั่งงานแอนิเมชัน
            gsap.to(loader, {
                opacity: 0,
                scale: 1.05,
                duration: 0.6,
                ease: "expo.inOut",
                onComplete: () => {
                    loader.style.display = 'none';
                    gsap.set(loader, { scale: 1 });
                    if (window.ScrollTrigger) ScrollTrigger.refresh();
                }
            });
        } catch (e) {
            // หากเกิด error (เช่น gsap โหลดไม่ขึ้น) ให้ซ่อนหน้าต่างโหลดไปเลยทันที
            console.error("GSAP failed, hiding loader manually.", e);
            loader.style.display = 'none';
        }
    }
    if (typeof dom !== 'undefined' && dom.loadingPlaceholder) {
        dom.loadingPlaceholder.style.display = 'none';
    }
}

    // =================================================================
    // 12. ADMIN TOOLS (SITEMAP GENERATOR)
    // =================================================================
    function initMobileSitemapTrigger() {
        const ghostBtn = document.createElement('div');
        Object.assign(ghostBtn.style, { position: 'fixed', bottom: '0', right: '0', width: '60px', height: '60px', zIndex: '99999', cursor: 'pointer', background: 'transparent', touchAction: 'manipulation' });
        document.body.appendChild(ghostBtn);
        let clicks = 0; let timeout;
        ghostBtn.addEventListener('click', (e) => {
            e.preventDefault(); clicks++; clearTimeout(timeout);
            timeout = setTimeout(() => { clicks = 0; }, 1500);
            if (clicks >= 5) {
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                if (state.allProfiles.length === 0) { alert("⚠️ ข้อมูลยังโหลดไม่เสร็จ"); clicks = 0; return; }
                const confirmGen = confirm(`⚙️ Admin Menu:\nพบข้อมูล ${state.allProfiles.length} รายการ\nต้องการโหลด sitemap.xml ใช่ไหม?`);
                if (confirmGen) { try { const xml = generateSitemapXML(); downloadFile('sitemap.xml', xml); } catch (err) { alert("❌ เกิดข้อผิดพลาด: " + err.message); console.error(err); } }
                clicks = 0;
            }
        });
    }

function generateSitemapXML() {
    const baseUrl = CONFIG.SITE_URL.replace(/\/$/, '');
    const urls = [];

    // ฟังก์ชันสำหรับจัดการอักขระพิเศษใน XML
    const escapeXml = (unsafe) => {
        if (!unsafe) return '';
        return unsafe.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    };

    const processUrl = (path) => {
        const encodedPath = encodeURIComponent(path).replace(/%2F/g, '/');
        const fullUrl = `${baseUrl}/${encodedPath}`;
        // ป้องกัน & ใน URL พัง
        return fullUrl.replace(/&/g, '&amp;');
    };

    // 1. หน้าแรก (Priority สูงสุด)
    urls.push({ loc: processUrl(''), priority: '1.0', freq: 'daily' });

    // 2. หน้า Profile น้องๆ (ส่วนที่แก้ไขเรื่องเลขซ้ำและรูปภาพ)
    state.allProfiles.forEach(p => { 
        if (p.slug) { 
            // 🔧 🔧 จุดสำคัญ: ทำความสะอาด Slug (เปลี่ยน "name-99-99" เป็น "name-99")
            const cleanSlug = p.slug.trim().replace(/(-\d+)(?:-\d+)+$/, '$1');

            // จัดการข้อมูลรูปภาพ
            let imageTag = '';
            if (p.images && p.images.length > 0 && p.images[0].src) {
                const imgUrl = p.images[0].src.replace(/&/g, '&amp;');
                const imgTitle = escapeXml(p.name || 'รูปโปรไฟล์');
                imageTag = `
        <image:image>
            <image:loc>${imgUrl}</image:loc>
            <image:title>${imgTitle}</image:title>
        </image:image>`;
            }

            urls.push({ 
                loc: processUrl(`sideline/${cleanSlug}`), 
                priority: '0.9', 
                freq: 'daily',
                imageXml: imageTag 
            }); 
        } 
    });

    // 3. หน้า Location (จังหวัด)
    if (state.provincesMap && state.provincesMap.size > 0) { 
        state.provincesMap.forEach((name, key) => { 
            urls.push({ 
                loc: processUrl(`location/${key}`), 
                priority: '0.8', 
                freq: 'daily' 
            }); 
        }); 
    }

    // 4. หน้า Static (Content Pages)
    ['blog', 'about', 'faq', 'profiles', 'locations', 'contact'].forEach(page => { 
        urls.push({ 
            loc: processUrl(page), 
            priority: '0.7', 
            freq: 'weekly' 
        }); 
    });

    // สร้างเนื้อหา XML (รวมทุกลิงก์)
    const xmlContent = urls.map(u => `
    <url>
        <loc>${u.loc}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${u.freq}</changefreq>
        <priority>${u.priority}</priority>${u.imageXml || ''}
    </url>`).join('');

    // คืนค่าโครงสร้าง XML ที่สมบูรณ์
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlContent}
</urlset>`;
}
function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url); alert("✅ ดาวน์โหลดเรียบร้อย!"); }, 100);
    }
    
// =================================================================
// 13. DYNAMIC FOOTER SYSTEM (SMART APPEND VERSION)
// =================================================================
async function initFooterLinks() {
    const footerContainer = document.getElementById('popular-locations-footer');
    if (!footerContainer) return;

    let provincesList = [];

    // 1. ดึงข้อมูลจังหวัด (จาก Memory หรือ Supabase)
    if (state.provincesMap && state.provincesMap.size > 0) {
        state.provincesMap.forEach((name, key) => {
            provincesList.push({ key: key, name: name });
        });
    } else if (window.supabase) {
        try {
            const { data } = await window.supabase.from('provinces').select('*');
            if (data) {
                provincesList = data.map(p => ({
                    key: p.key || p.slug || p.id,
                    name: p.nameThai || p.name_thai || p.name
                })).filter(p => p.key && p.name);
            }
        } catch (e) { console.warn("Footer load failed", e); }
    }

    // 2. เรียงลำดับ ก-ฮ
    provincesList.sort((a, b) => a.name.localeCompare(b.name, 'th'));

    // 3. 🟢 ลบตัว Loading ออก (ถ้ามี)
    const loadingPulse = footerContainer.querySelector('.animate-pulse');
    if (loadingPulse) {
        loadingPulse.parentElement.remove();
    }

    // 4. 🟢 วนลูปเช็คและเติมจังหวัดที่ "ยังไม่มี" ใน HTML
    const displayLimit = 20; // จำกัดจำนวนลิงก์รวมทั้งหมดไม่ให้ยาวเกินไป
    let addedCount = footerContainer.querySelectorAll('li').length;

    provincesList.forEach(p => {
        // ตรวจสอบว่ามีลิงก์จังหวัดนี้อยู่แล้วหรือยัง (เช็คจาก URL)
        const exists = footerContainer.querySelector(`a[href*="/location/${p.key}"]`);
        
        if (!exists && addedCount < displayLimit) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/location/${p.key}" title="รับงาน${p.name} | Sideline Chiangmai" class="hover:text-pink-500 transition-colors">ไซด์ไลน์${p.name}</a>`;
            footerContainer.appendChild(li);
            addedCount++;
        }
    });

    // 5. กรณีมีจังหวัดเยอะมาก ให้เติมปุ่ม "ดูทั้งหมด"
    if (provincesList.length > addedCount && !footerContainer.querySelector('.view-all-link')) {
        const viewAll = document.createElement('li');
        viewAll.className = 'view-all-link';
        viewAll.innerHTML = `<a href="/profiles.html" class="text-pink-500 font-bold hover:underline mt-2 inline-block">ดูจังหวัดอื่นๆ ทั้งหมด (${provincesList.length})</a>`;
        footerContainer.appendChild(viewAll);
    }
}

    
    
    
const now = new Date();
const thaiDate = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
const timeEl = document.getElementById('last-updated-time');
if (timeEl) timeEl.innerText = thaiDate;


})();