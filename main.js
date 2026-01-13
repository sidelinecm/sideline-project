// =================================================================
// MAIN.JS (THE FINAL, BULLETPROOF & COMPLETE VERSION)
// =================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs';

gsap.registerPlugin(ScrollTrigger);

(function () {
    'use strict';

// 1. CONFIGURATION & STATE
    const CONFIG = {
        SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
        // ✅ บรรทัดนี้คือรหัสที่ถูกต้องครับ (คัดลอกไปวางทับอันเดิมได้เลย)
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
    // 1. STATE MANAGEMENT (เพิ่ม cleanupFunctions เข้าไป)
let state = { 
    allProfiles: [], 
    provincesMap: new Map(), 
    currentProfileSlug: null, 
    lastFocusedElement: null, 
    isFetching: false, 
    lastFetchedAt: '1970-01-01T00:00:00Z', 
    realtimeSubscription: null,
    cleanupFunctions: [] // <--- ต้องเพิ่มบรรทัดนี้ครับ!
};

const dom = {};
let supabase;
let fuseEngine;

// 2. MAIN ENTRY POINT
document.addEventListener('DOMContentLoaded', initApp);
    async function initApp() {
        console.log("🚀 App Initializing...");
        
        initializeSupabase();
        cacheDOMElements();

        initThemeToggle();
        initMobileMenu();
        initAgeVerification();
        initHeaderScrollEffect();
        initMarqueeEffect();
        initMobileSitemapTrigger();
        initFooterLinks();
        initGlobalClickListener();
        updateActiveNavLinks();

        await handleRouting();
        await handleDataLoading();

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

    // 3. CORE INITIALIZATION & HELPER FUNCTIONS
    function initializeSupabase() {
        try {
            supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            window.supabase = supabase;
            console.log("✅ Supabase Connected");
        } catch (e) {
            console.error("❌ Supabase Init Failed:", e);
        }
    }

    function formatDate() {
        try { return new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }); } 
        catch (e) { return "08/01/2569"; }
    }

    // ค้นหาฟังก์ชัน showErrorState ใน main.js แล้วเปลี่ยนเป็น code นี้
function showErrorState(error) {
    console.error("❌ Error:", error);
    hideLoadingState();
    
    // 1. ซ่อนพื้นที่แสดงผลปกติ
    if(dom.profilesDisplayArea) dom.profilesDisplayArea.classList.add('hidden');
    if(dom.featuredSection) dom.featuredSection.classList.add('hidden');

    // 2. แสดงข้อความ Error ที่เตรียมไว้ใน HTML
    if(dom.fetchErrorMessage) {
        dom.fetchErrorMessage.classList.remove('hidden');
        dom.fetchErrorMessage.style.display = 'block'; // บังคับแสดง
    }
    
    // 3. ซ่อนปุ่ม Load More
    const loadMore = document.getElementById('load-more-container');
    if(loadMore) loadMore.classList.add('hidden');
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
        dom.resetSearchBtn = document.getElementById('reset-search-btn');
        dom.resultCount = document.getElementById('result-count');
        dom.featuredSection = document.getElementById('featured-profiles');
        dom.featuredContainer = document.getElementById('featured-profiles-container');
        dom.lightbox = document.getElementById('lightbox');
        dom.lightboxCloseBtn = document.getElementById('closeLightboxBtn');
        dom.lightboxWrapper = document.getElementById('lightbox-content-wrapper-el');
    }

    // แก้ไขฟังก์ชัน handleDataLoading
async function handleDataLoading() {
    if (state.isFetching) return;

    showLoadingState(); // เริ่มหมุนติ้วๆ
    try {
        const success = await fetchDataDelta();
        if (success) {
            initSearchAndFilters();
            await handleRouting(true);
            initRealtimeSubscription();
            
            // ✅ ซ่อน Error message หากโหลดสำเร็จ
            if(dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
            if(dom.profilesDisplayArea) dom.profilesDisplayArea.classList.remove('hidden');
        } else {
            showErrorState("Data fetch returned false");
        }
    } catch (error) {
        showErrorState(error);
    } finally {
        // ✅ สำคัญ: บรรทัดนี้จะทำงานเสมอ ไม่ว่าจะ error หรือไม่
        hideLoadingState(); 
    }
}

// ✅ DELTA FETCH (FIXED: ใช้ created_at แทน updated_at)
    async function fetchDataDelta() {
        if (state.isFetching) return false;
        state.isFetching = true;

        if (!supabase) {
            state.isFetching = false;
            return false;
        }

        try {
            console.log('🔄 Starting delta fetch...');

            // ✅ ดึงข้อมูลจังหวัดและโปรไฟล์พร้อมกัน
            const [provincesRes, profilesRes] = await Promise.all([
                supabase.from('provinces').select('*'),
                supabase.from('profiles')
                    .select('*')
                    .gt('created_at', state.lastFetchedAt) // ✅ FIX: แก้ไข column name
                    .order('created_at', { ascending: false }) // ✅ FIX: แก้ไข column name
            ]);

            // ✅ ตรวจสอบ errors
            if (provincesRes.error) throw provincesRes.error;
            if (profilesRes.error) throw profilesRes.error; // ข้อผิดพลาด 42703 ถูกแก้ไขที่บรรทัดนี้แล้ว

            // ✅ จัดการจังหวัด
            state.provincesMap.clear();
            (provincesRes.data || []).forEach(p => {
                const thName = p.nameThai || p.name_thai || p.thai_name || p.name || p.provinceName;
                const key = p.key || p.slug || p.id;

                if (key && thName) {
                    state.provincesMap.set(key.toString(), thName);
                }
            });

            const fetchedProfiles = profilesRes.data || [];
            console.log(`📊 Fetched ${fetchedProfiles.length} new profiles`);

            // ✅ Process และ Merge ข้อมูล
            if (fetchedProfiles.length > 0) {
                const newProcessedProfiles = fetchedProfiles
                    .map(processProfileData)
                    .filter(Boolean);

                if (newProcessedProfiles.length > 0) {
                    state.allProfiles = mergeProfilesData(state.allProfiles, newProcessedProfiles);

                    // ✅ อัพเดต lastFetchedAt จากข้อมูลใหม่
                    const newestDate = fetchedProfiles
                        .map(p => p.created_at) // ✅ FIX: แก้ไข column name
                        .filter(Boolean)
                        .sort()
                        .pop();

                    if (newestDate) {
                        state.lastFetchedAt = newestDate;
                    }
                }
            }

            // ✅ ถ้าเป็นครั้งแรกที่โหลดหรือไม่มีข้อมูล
            if (state.allProfiles.length === 0) {
                console.log('🔄 No existing data, fetching all profiles...');

                const allProfilesRes = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false }); // ✅ FIX: แก้ไข column name

                if (allProfilesRes.error) throw allProfilesRes.error;

                if (allProfilesRes.data && allProfilesRes.data.length > 0) {
                    state.allProfiles = allProfilesRes.data
                        .map(processProfileData)
                        .filter(Boolean);

                    const newestDate = allProfilesRes.data
                        .map(p => p.created_at) // ✅ FIX: แก้ไข column name
                        .filter(Boolean)
                        .sort()
                        .pop();

                    if (newestDate) {
                        state.lastFetchedAt = newestDate;
                    }
                }
            }

            // ✅ เรียงลำดับข้อมูลโดยอัพเดตล่าสุดก่อน
            state.allProfiles.sort((a, b) => {
                const dateA = new Date(a.lastUpdated || a.created_at || 0); // ✅ FIX: ใช้ created_at
                const dateB = new Date(b.lastUpdated || b.created_at || 0); // ✅ FIX: ใช้ created_at
                return dateB - dateA;
            });

            populateProvinceDropdown();
            // 💡 BUG FIX: การโหลดข้อมูลสำเร็จ จะแก้ปัญหาเรื่องรูปภาพและฟิลเตอร์ที่ใช้งานไม่ได้
            renderProfiles(state.allProfiles, false); 

            // ✅ Cache ข้อมูล
            try {
                localStorage.setItem(CONFIG.KEYS.CACHE_PROFILES, JSON.stringify(state.allProfiles));
                localStorage.setItem(CONFIG.KEYS.LAST_FETCH, Date.now().toString());
            } catch (e) {
                console.warn('Cache save failed:', e);
            }

            state.isFetching = false;
            return true;

        } catch (err) {
            console.error('❌ Fetch Delta Error:', err);

            // ✅ Fallback Cache
            try {
                const cachedJSON = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
                if (cachedJSON) {
                    const cached = JSON.parse(cachedJSON);
                    state.allProfiles = cached
                        .map(processProfileData)
                        .filter(Boolean);

                    populateProvinceDropdown();
                    renderProfiles(state.allProfiles, false);
                    state.isFetching = false;
                    return true;
                }
            } catch (cacheErr) {
                console.error('❌ Cache fallback failed:', cacheErr);
            }

            state.isFetching = false;
            return false;
        }
    }

    // ✅ MERGE PROFILES DATA (Unchanged, but included for completeness)
    function mergeProfilesData(existingProfiles, newProfiles) {
        if (!newProfiles || newProfiles.length === 0) {
            return existingProfiles;
        }

        const profileMap = new Map();

        // Add existing profiles
        existingProfiles.forEach(p => {
            if (p && p.id) {
                profileMap.set(p.id.toString(), p);
            }
        });

        // Update/Add new profiles
        newProfiles.forEach(newProfile => {
            if (newProfile && newProfile.id) {
                profileMap.set(newProfile.id.toString(), newProfile);
            }
        });

        return Array.from(profileMap.values());
    }

/**
 * ✅ REALTIME SUBSCRIPTION (STABLE VERSION)
 */
function initRealtimeSubscription() {
    if (!supabase) return;

    // 1. Cleanup: ลบ Channel เก่าทิ้งก่อนสร้างใหม่
    if (state.realtimeSubscription) {
        try {
            supabase.removeChannel(state.realtimeSubscription);
        } catch (e) { }
    }

    try {
        console.log('📡 Starting realtime subscription...');

        const subscription = supabase
            .channel('profiles-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'profiles' },
                (payload) => {
                    console.log('🔔 Event:', payload.eventType);
                    // ... โค้ดจัดการ Insert/Update/Delete เดิมของคุณ ...
                    if (payload.eventType !== 'DELETE' && payload.new) {
                        const processed = processProfileData(payload.new);
                        if (processed) {
                            state.allProfiles = mergeProfilesData(state.allProfiles, [processed]);
                            renderProfiles(state.allProfiles, false);
                        }
                    } else if (payload.eventType === 'DELETE' && payload.old) {
                        state.allProfiles = state.allProfiles.filter(p => p.id !== payload.old.id);
                        renderProfiles(state.allProfiles, false);
                    }
                }
            )
            .subscribe();

        state.realtimeSubscription = subscription;

        // 2. Safe Push: ตรวจสอบ Array ก่อนบันทึกฟังก์ชัน Cleanup
        if (!Array.isArray(state.cleanupFunctions)) {
            state.cleanupFunctions = [];
        }

        state.cleanupFunctions.push(() => {
            if (subscription) supabase.removeChannel(subscription);
        });

    } catch (error) {
        console.warn('⚠️ Realtime failure:', error.message);
    }
}

function processProfileData(p) {
        if (!p) return null;

        // จัดการรูปภาพ: ใช้ Path จาก DB หรือใช้รูป Default
        const imagePaths = [p.imagePath, ...(Array.isArray(p.galleryPaths) ? p.galleryPaths : [])].filter(Boolean);
        
        let imageObjects = imagePaths.map(path => {
            // ใช้ getPublicUrl เพื่อให้ได้ลิงก์ที่ถูกต้องเสมอ
            const { data } = supabase.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
            return { src: data?.publicUrl || CONFIG.DEFAULT_OG_IMAGE };
        });

        // ถ้าไม่มีรูปเลย ให้ใส่รูป Default กันไว้
        if (imageObjects.length === 0) {
            imageObjects.push({ src: CONFIG.DEFAULT_OG_IMAGE });
        }

        const provinceName = state.provincesMap.get(p.provinceKey) || '';
        const tags = (p.styleTags || []).join(' ');
        
        // รวมคำค้นหาทั้งหมดไว้ใน string เดียว (ตัวเล็กหมดเพื่อให้ค้นง่าย)
        const fullSearchString = `${p.name} ${provinceName} ${p.provinceKey} ${tags} ${p.description || ''} ${p.rate || ''} ${p.stats || ''} ${p.location || ''}`.toLowerCase();

        return { 
            ...p, 
            images: imageObjects, 
            altText: `น้อง${p.name} ไซด์ไลน์${provinceName} รับงาน${provinceName}`,
            searchString: fullSearchString,
            provinceNameThai: provinceName,
            // แปลงค่าตัวเลขเผื่อไว้ใช้คำนวณ
            _price: Number(String(p.rate).replace(/\D/g, '')) || 0, 
            _age: Number(p.age) || 0
        };
    }
// ✅ POPULATE PROVINCE DROPDOWN (Unchanged, but included for completeness)
function populateProvinceDropdown() {
    if (!dom.provinceSelect) return;
    while (dom.provinceSelect.options.length > 1) {
        dom.provinceSelect.remove(1);
    }
    
    const sorted = Array.from(state.provincesMap.entries()).sort((a, b) => a[1].localeCompare(b[1], 'th'));
    const fragment = document.createDocumentFragment();
    sorted.forEach(([key, name]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = name;
        fragment.appendChild(opt);
    });
    dom.provinceSelect.appendChild(fragment);
}
// =================================================================
// [ฉบับแก้ไขสมบูรณ์ 100% - รองรับ Pretty URLs] - handleRouting
// =================================================================
async function handleRouting(dataLoaded = false) {
    // แปลง path ให้เป็นตัวเล็ก เพื่อให้ตรวจสอบง่าย (เช่น /Blog -> /blog)
    // และลบเครื่องหมาย / ท้ายสุดออก (เช่น /blog/ -> /blog) เพื่อความแม่นยำ
    let path = window.location.pathname.toLowerCase();
    if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    // ✅ --- START: ส่วนป้องกันหน้า Static (ฉบับอัปเกรด) ---
    // 1. ระบุรายชื่อหน้า Static ทั้งหมดที่มีในเว็บ (หน้าที่มีไฟล์ HTML จริงๆ)
    // ใส่เพิ่มได้เลยตามที่คุณมี เช่น '/contact', '/rules', '/register'
    const staticPages = ['/blog', '/about', '/faq', '/profiles', '/locations', '/contact', '/policy'];

    // 2. ตรวจสอบเงื่อนไข 3 อย่าง:
    // A: มีนามสกุล .html (แบบเดิม)
    // B: เป็นหน้า Static ที่ระบุไว้ในรายการข้างบน
    // C: หรือเป็นหน้าย่อยของ Static นั้นๆ (เช่น /blog/post-1)
    const isStaticPage = path.endsWith('.html') || 
                         path.endsWith('.htm') || 
                         staticPages.some(p => path === p || path.startsWith(p + '/'));

    if (isStaticPage) {
        console.log(`🛑 Static page detected (${path}). Skipping dynamic logic.`);
        
        // ปิด Lightbox และซ่อนส่วนแสดงผลของแอป เพื่อไม่ให้ทับเนื้อหาจริง
        closeLightbox(false); 
        if(dom.profilesDisplayArea) dom.profilesDisplayArea.classList.add('hidden');
        if(dom.featuredSection) dom.featuredSection.classList.add('hidden');
        
        return; // 🛑 จบการทำงานทันที (Meta Tags ของหน้านั้นจะปลอดภัย)
    }
    // ✅ --- END: ส่วนป้องกัน ---
    
    // -------------------------------------------------------
    // ส่วน Logic เดิม (ถูกต้องแล้ว)
    // -------------------------------------------------------

    // 1. หน้าโปรไฟล์ (Profile Page)
    const profileMatch = path.match(/^\/(?:sideline|profile|app)\/([^/]+)/);
    if (profileMatch) {
        const slug = decodeURIComponent(profileMatch[1]);
        state.currentProfileSlug = slug;
        
        // ลองหาใน Memory ก่อน ถ้าไม่มีค่อย Fetch ใหม่
        let profile = state.allProfiles.find(p => (p.slug || '').toLowerCase() === slug.toLowerCase());
        if (!profile && !dataLoaded) profile = await fetchSingleProfile(slug);

        if (profile) {
            openLightbox(profile);
            updateAdvancedMeta(profile, null); // อัปเดต Meta เฉพาะคน
            // ซ่อนหน้า List เพื่อ focus ที่ Lightbox
            dom.profilesDisplayArea?.classList.add('hidden');
            dom.featuredSection?.classList.add('hidden');
        } else if (dataLoaded) {
            // ถ้าโหลดเสร็จแล้วแต่ไม่เจอ profile -> ดีดกลับหน้าแรก
            history.replaceState(null, '', '/');
            closeLightbox(false);
            dom.profilesDisplayArea?.classList.remove('hidden');
            state.currentProfileSlug = null;
        }
        return;
    } 
    
    // 2. หน้าจังหวัด (Location/Province Page)
    const provinceMatch = path.match(/^\/(?:location|province)\/([^/]+)/);
    if (provinceMatch) {
        const provinceKey = decodeURIComponent(provinceMatch[1]);
        state.currentProfileSlug = null;
        closeLightbox(false);
        
        // ตั้งค่า Dropdown ให้ตรงกับ URL
        if (dom.provinceSelect) dom.provinceSelect.value = provinceKey;
        
        if (dataLoaded) {
            applyUltimateFilters(false); // กรองข้อมูล
            const provinceName = state.provincesMap.get(provinceKey) || provinceKey;
            
            // สร้าง SEO Data สำหรับหน้าจังหวัด
            const completeTitle = `ไซด์ไลน์${provinceName} - รับงาน${provinceName} (ทีมงาน Sideline Chiangmai)`;
            const completeDescription = `รวมน้องๆ ไซด์ไลน์ ${provinceName} คัดคนสวย ตรงปก 100% ปลอดภัย การันตีคุณภาพโดยทีมงาน Sideline Chiangmai สาขา${provinceName}.`;

            const seoData = {
                title: completeTitle, 
                description: completeDescription,
                canonicalUrl: `${CONFIG.SITE_URL}/location/${provinceKey}`,
                provinceName: provinceName, 
                profiles: state.allProfiles.filter(p => p.provinceKey === provinceKey)
            };
            
            updateAdvancedMeta(null, seoData); // อัปเดต Meta จังหวัด
            dom.profilesDisplayArea?.classList.remove('hidden');
        }
        return;
    }

    // 3. หน้าแรก (Home Page - Default)
    // ถ้าไม่เข้าเงื่อนไขข้างบนเลย จะตกมาที่นี่
    state.currentProfileSlug = null;
    closeLightbox(false);
    dom.profilesDisplayArea?.classList.remove('hidden');
    
    if (dataLoaded) {
        applyUltimateFilters(false);
        updateAdvancedMeta(null, null); // อัปเดต Meta หน้าแรก
    }
}

// =================================================================
// 7. ULTIMATE SEARCH ENGINE (เวอร์ชันอัปเกรด)
// =================================================================

function initSearchAndFilters() {
    if (!dom.searchForm) return;

    // ตั้งค่า Search Engine (อัปเกรด Keys ในการค้นหา)
    const fuseOptions = {
        includeScore: true,
        threshold: 0.35, // เพิ่มค่าเล็กน้อยเพื่อให้ค้นหาเจอได้ง่ายขึ้น
        ignoreLocation: true,
        keys: [
            // --- Keys ที่มีอยู่เดิม (ปรับ Weight เล็กน้อย) ---
            { name: 'name', weight: 1.0 },
            { name: 'provinceNameThai', weight: 0.9 },
            { name: 'provinceKey', weight: 0.8 },
            { name: 'styleTags', weight: 0.5 },
            { name: 'description', weight: 0.1 },
            
            // --- ✅ Keys ที่เพิ่มใหม่เพื่อการค้นหาที่สมบูรณ์แบบ ---
            { name: 'location', weight: 0.7 },      // ค้นหาพิกัดย่อย เช่น "นิมมาน", "เจ็ดยอด"
            { name: 'skinTone', weight: 0.6 },      // ค้นหาสีผิว เช่น "ขาวอมชมพู"
            { name: 'stats', weight: 0.5 },         // ค้นหาสัดส่วน เช่น "36-25-35"
            { name: 'rate', weight: 0.4 },          // ค้นหาเรทราคา เช่น "1500"
            { name: 'availability', weight: 0.4 }   // ค้นหาสถานะ เช่น "รับงาน"
        ]
    };
    
    if (state.allProfiles.length > 0) {
        fuseEngine = new Fuse(state.allProfiles, fuseOptions);
    }

    // --- ส่วน Listener ไม่มีการเปลี่ยนแปลง ---
    const clearBtn = document.getElementById('clear-search-btn');
    const suggestionsBox = document.getElementById('search-suggestions');
    
    dom.searchInput?.addEventListener('input', (e) => {
        const val = e.target.value;
        if(clearBtn) clearBtn.classList.toggle('hidden', !val);
        applyUltimateFilters(); 
    });

    clearBtn?.addEventListener('click', () => {
        dom.searchInput.value = '';
        clearBtn.classList.add('hidden');
        dom.searchInput.focus();
        applyUltimateFilters();
    });

    dom.provinceSelect?.addEventListener('change', () => {
        if (dom.searchInput) dom.searchInput.value = '';
        history.pushState(null, '', dom.provinceSelect.value ? `/location/${dom.provinceSelect.value}` : '/');
        applyUltimateFilters(true);
    });

    dom.availabilitySelect?.addEventListener('change', () => applyUltimateFilters(true));
    dom.featuredSelect?.addEventListener('change', () => applyUltimateFilters(true));
    
    dom.resetSearchBtn?.addEventListener('click', () => {
        dom.searchInput.value = '';
        dom.provinceSelect.value = '';
        dom.availabilitySelect.value = '';
        dom.featuredSelect.value = '';
        history.pushState(null, '', '/');
        applyUltimateFilters(true);
    });

    dom.searchForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        applyUltimateFilters(true); 
        if(suggestionsBox) suggestionsBox.classList.add('hidden');
    });
}

    // ✅ ฟังก์ชันช่วยบันทึกข้อมูลแบบปลอดภัย
function saveCache(key, data) {
    try {
        const cacheObj = {
            value: data,
            timestamp: Date.now() // เก็บเวลาที่บันทึก
        };
        localStorage.setItem(key, JSON.stringify(cacheObj));
    } catch (e) {
        // ถ้าพื้นที่เต็ม ให้ล้างทิ้งทั้งหมดเพื่อป้องกันเว็บค้าง
        console.error("Cache Full:", e);
        localStorage.clear();
    }
}

// ✅ ฟังก์ชันช่วยโหลดข้อมูลแบบเช็ควันหมดอายุ
function loadCache(key, expiryHours = 24) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    try {
        const cacheObj = JSON.parse(cached);
        const now = Date.now();
        const expiryTime = expiryHours * 60 * 60 * 1000;

        // ถ้าเก่าเกิน 24 ชม. ให้คืนค่า null เพื่อโหลดใหม่จาก Supabase
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

    // จัดการปุ่ม Clear (X)
    if(clearBtn) clearBtn.classList.toggle('hidden', !val);

    if (!box) return;

    // ถ้าช่องว่าง -> แสดงประวัติการค้นหา
    if (!val) {
        showRecentSearches(); 
        return;
    }

    if (!fuseEngine) return;

    // ค้นหา (เอาแค่ 5 อันดับแรก)
    const results = fuseEngine.search(val).slice(0, 5);

    if (results.length === 0) {
        box.classList.add('hidden');
        return;
    }

    // สร้าง HTML Dropdown
    let html = `<div class="search-dropdown-box">`;

    // 1. Header
    html += `<div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">ผลลัพธ์ที่แนะนำ (${results.length})</span>
             </div>`;

    // 2. List Items
    html += `<div class="flex flex-col">`;
    
    results.forEach(({ item }) => {
        const provinceName = state.provincesMap.get(item.provinceKey) || '';
        const isAvailable = item.availability?.includes('ว่าง') || item.availability?.includes('รับงาน');
        
        // รูป Avatar
        const imgSrc = item.images && item.images[0] ? item.images[0].src : '/images/placeholder.webp';

        html += `
            <div class="relative flex items-center gap-3 px-4 py-3 hover:bg-pink-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0 group"
                 onclick="window.selectSuggestion('${item.slug}', true)">
                
                <!-- Avatar + Status Dot -->
                <div class="relative shrink-0">
                    <img src="${imgSrc}" class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm">
                    <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-${isAvailable ? 'green' : 'gray'}-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                </div>

                <!-- Text Info -->
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-pink-600">
                            ${item.name}
                        </h4>
                        ${item.age ? `<span class="text-[10px] bg-gray-100 dark:bg-gray-600 px-1.5 rounded text-gray-500 dark:text-gray-300">${item.age} ปี</span>` : ''}
                    </div>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center">
                            <i class="fas fa-map-marker-alt text-[10px] mr-1 text-pink-400"></i> ${provinceName}
                        </span>
                    </div>
                </div>

                <!-- Chevron Icon -->
                <i class="fas fa-chevron-right text-gray-300 text-xs group-hover:text-pink-400 transform group-hover:translate-x-1 transition-transform"></i>
            </div>
        `;
    });
    html += `</div>`; // End List

    // 3. Footer (View All)
    html += `
        <div onclick="document.getElementById('search-form').dispatchEvent(new Event('submit'))"
             class="px-4 py-3 bg-pink-50/50 dark:bg-gray-800 text-center cursor-pointer hover:bg-pink-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700">
            <span class="text-sm font-bold text-pink-600">
                <i class="fas fa-search mr-1"></i> ดูผลลัพธ์ทั้งหมด
            </span>
        </div>
    </div>`;

    box.innerHTML = html;
    box.classList.remove('hidden');
}
    // ✅ FIXED: 2. แก้ไขฟังก์ชันเมื่อกดเลือก (แยก Logic)
    window.selectSuggestion = (value, isProfile = false) => {
        const box = document.getElementById('search-suggestions');
        const input = document.getElementById('search-keyword');
        
        if (isProfile) {
            // กรณีคลิกที่โปรไฟล์น้อง: ให้เปิดหน้าโปรไฟล์ทันที
            box?.classList.add('hidden');
            if (input) {
                input.value = ''; // ล้างคำค้นหา
                document.getElementById('clear-search-btn')?.classList.add('hidden');
            }
            
            history.pushState(null, '', `/sideline/${value}`);
            handleRouting(); 
        } else {
            // กรณีคลิกที่ประวัติการค้นหา: ให้ทำการค้นหา
            if(input) {
                input.value = value;
                saveRecentSearch(value);
                applyUltimateFilters(true);
                box?.classList.add('hidden');
            }
        }
    };

    // ✅ FIXED: 3. แก้ไขฟังก์ชันแสดงประวัติ (ใส่พื้นหลังทึบ)
    function showRecentSearches() {
        const box = document.getElementById('search-suggestions');
        if (!box) return;
        
        const recents = JSON.parse(localStorage.getItem('recent_searches') || '[]');
        if (recents.length === 0) {
            box.classList.add('hidden');
            return;
        }

        let html = `<div class="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">`;
        html += `<div class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase flex justify-between items-center bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                    <span>ค้นหาล่าสุด</span>
                    <button onclick="window.clearRecentSearches()" class="text-red-400 hover:text-red-600 text-xs">ล้างประวัติ</button>
                 </div>`;
        
        recents.forEach(term => {
            html += `
                <div class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-gray-700 last:border-0"
                     onclick="window.selectSuggestion('${term}', false)">
                    <i class="fas fa-history text-gray-400 min-w-[20px]"></i>
                    <span class="font-medium">${term}</span>
                </div>
            `;
        });
        html += `</div>`;

        box.innerHTML = html;
        box.classList.remove('hidden');
    }
function applyUltimateFilters(updateUrl = false) {
        let query = {
            text: dom.searchInput?.value?.trim() || '',
            province: dom.provinceSelect?.value || '',
            avail: dom.availabilitySelect?.value || '',
            featured: dom.featuredSelect?.value === 'true'
        };

        // 🔥 LOGIC แก้ไข: ดักจับชื่อจังหวัด (Intent Detection)
        // ถ้าสิ่งที่พิมพ์ คือชื่อจังหวัดในระบบ -> ให้เปลี่ยนไปกรองด้วย ID จังหวัดทันที
        if (query.text) {
            for (let [key, name] of state.provincesMap.entries()) {
                // เช็คว่า text ที่พิมพ์ มีชื่อจังหวัดปนอยู่มั้ย
                if (name === query.text || name.includes(query.text) || query.text.includes(name)) {
                    
                    // สั่งระบบว่า: "ผู้ใช้ต้องการดูจังหวัดนี้นะ"
                    query.province = key; 
                    
                    // *สำคัญ* ลบ text ทิ้ง เพื่อให้ระบบดึง "ทุกคน" ที่มี key นี้ออกมา
                    // (ไม่ใช่แค่คนที่พิมพ์ชื่อจังหวัดไว้ใน Bio)
                    query.text = ''; 
                    break; 
                }
            }
        }

        // บันทึกจังหวัดล่าสุด
        if (query.province && query.province !== 'all') localStorage.setItem(CONFIG.KEYS.LAST_PROVINCE, query.province);

        let filtered = state.allProfiles;

        // 1. กรองด้วย Text (จะทำงานเฉพาะถ้าเราไม่ได้ลบ text ทิ้งข้างบน)
        if (query.text) {
            if (fuseEngine) {
                const results = fuseEngine.search(query.text);
                filtered = results.map(result => result.item);
            } else {
                const lower = query.text.toLowerCase();
                filtered = filtered.filter(p => p.searchString.includes(lower));
            }
        }

        // 2. กรองด้วย Category/Province (ตัวนี้จะทำงานดึงทั้งจังหวัดออกมา)
        filtered = filtered.filter(p => {
            const provinceMatch = !query.province || query.province === 'all' || p.provinceKey === query.province;
            const availMatch = !query.avail || query.avail === 'all' || query.avail === '' || p.availability === query.avail;
            const featuredMatch = !query.featured || p.isfeatured;
            return provinceMatch && availMatch && featuredMatch;
        });

        // อัปเดตตัวเลขผลลัพธ์
        if (dom.resultCount) {
             dom.resultCount.innerHTML = filtered.length > 0 ? `✅ พบ ${filtered.length} โปรไฟล์` : '❌ ไม่พบข้อมูล';
             dom.resultCount.style.display = 'block';
        }

        // สั่ง Render
        // ส่ง flag ไปบอกว่า ถ้ามีค่าพวกนี้ ให้แสดงหัวข้อแบบ "ผลการค้นหา" หรือ "จังหวัด"
        const isSearchMode = !!dom.searchInput?.value || !!query.province; 
        renderProfiles(filtered, isSearchMode);

        // Update URL
        if (updateUrl) {
            const params = new URLSearchParams();
            if (query.text) params.set('q', query.text); // ใส่ text กลับไปถ้ามี
            const path = (query.province && query.province !== 'all') ? `/location/${query.province}` : '/';
            const qs = params.toString() ? '?' + params.toString() : '';
            if (!window.location.pathname.includes('/sideline/')) history.pushState({}, '', path + qs);
        }
    }
function renderByProvince(profiles) {
        // 1. Group ข้อมูล
        const groups = profiles.reduce((acc, p) => {
            const key = p.provinceKey || 'no_province';
            if (!acc[key]) acc[key] = [];
            acc[key].push(p);
            return acc;
        }, {});

        // 2. Sort ก-ฮ ตามชื่อไทย
        const keys = Object.keys(groups).sort((a, b) => {
            const nA = state.provincesMap.get(a) || a;
            const nB = state.provincesMap.get(b) || b;
            return nA.localeCompare(nB, 'th');
        });

        // 3. Render
        const mainFragment = document.createDocumentFragment();
        
        if (keys.length === 0) {
            // ถ้าไม่มีหมวดหมู่เลย ให้แสดงข้อความเตือน
            dom.noResultsMessage?.classList.remove('hidden');
        } else {
            keys.forEach(key => {
                // ดึงชื่อไทย (สำคัญ: ถ้า state.provincesMap ว่าง ชื่อจะหาย)
                // ดังนั้นการแก้ที่ fetchData ข้อ 1. สำคัญมาก
                const name = state.provincesMap.get(key) || (key === 'no_province' ? 'ไม่ระบุจังหวัด' : key);
                
                // ใช้ createProvinceSection ตัวเดิมที่มีอยู่แล้ว
                mainFragment.appendChild(createProvinceSection(key, name, groups[key]));
            });
        }
        
        dom.profilesDisplayArea.appendChild(mainFragment);
    }
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

        const grid = wrapper.querySelector('.profile-grid');
        const frag = document.createDocumentFragment();
        profiles.forEach(p => frag.appendChild(createProfileCard(p)));
        grid.appendChild(frag);

        return wrapper;
    }

// 1. ฟังก์ชัน Render หลัก (เวอร์ชันอัปเกรด อนิเมชั่นครบถ้วน)
function renderProfiles(profiles, isSearching) {
    if (!dom.profilesDisplayArea) return;
    
    // ล้างหน้าจอเตรียมแสดงผลใหม่
    dom.profilesDisplayArea.innerHTML = '';

    // --- ส่วน Featured (แสดงเฉพาะหน้าแรก) ---
    if (dom.featuredSection) {
        const isHome = !isSearching && !window.location.pathname.includes('/location/');
        dom.featuredSection.classList.toggle('hidden', !isHome);

        if (isHome && dom.featuredContainer && state.allProfiles.length > 0) {
            // ล้างข้อมูลเก่าใน Featured ก่อนถ้ามีการเปลี่ยนแปลง
            dom.featuredContainer.innerHTML = ''; 
            const featured = state.allProfiles.filter(p => p.isfeatured);
            const frag = document.createDocumentFragment();
            // ส่ง index (i) ไปเพื่อให้สร้างอนิเมชั่นดีเลย์ได้
            featured.forEach((p, i) => frag.appendChild(createProfileCard(p, i)));
            dom.featuredContainer.appendChild(frag);
        }
    }

    // กรณีไม่มีข้อมูลที่ตรงตามเงื่อนไข
    if (profiles.length === 0) {
        dom.noResultsMessage?.classList.remove('hidden');
        return;
    }
    dom.noResultsMessage?.classList.add('hidden');

    // --- การตัดสินใจแสดงผลตามหน้า ---
    const isLocationPage = window.location.pathname.includes('/location/') || window.location.pathname.includes('/province/');

    if (isSearching || isLocationPage) {
        // โหมด 1: แสดงเป็นรายการผลการค้นหา หรือหน้าเฉพาะจังหวัด
        dom.profilesDisplayArea.appendChild(createSearchResultSection(profiles));
    } else {
        // โหมด 2: แสดงแยกตามหมวดหมู่จังหวัด (หน้าแรก)
        renderByProvince(profiles);
    }

    // ==========================================
    // ✨ ส่วนที่เพิ่ม: อนิเมชั่นทางเข้า (Entrance Animation)
    // ==========================================
    if (window.gsap) {
        // ใช้ requestAnimationFrame เพื่อให้มั่นใจว่า DOM ถูกวาดเสร็จก่อนรันอนิเมชั่น
        requestAnimationFrame(() => {
            // เลือกการ์ดทั้งหมดที่มีคลาส profile-card-new (หรือชื่อคลาสที่คุณใช้)
            const cards = document.querySelectorAll('.profile-card-new');
            
            if (cards.length > 0) {
                gsap.from(cards, {
                    duration: 0.8,
                    y: 60,                // ดีดขึ้นจากด้านล่าง 60px
                    opacity: 0,           // เริ่มจากจาง
                    scale: 0.9,           // ขยายขึ้นมาเล็กน้อย
                    stagger: {
                        amount: 0.6,      // เฉลี่ยเวลาให้ทยอยโผล่จนครบใน 0.6 วินาที
                        grid: "auto",     // คำนวณลำดับการเด้งตามแถว/คอลัมน์อัตโนมัติ
                        from: "start"     // เริ่มเด้งจากตัวแรกไปตัวสุดท้าย
                    },
                    ease: "back.out(1.4)", // มีจังหวะเด้งเกินนิดๆ ให้ดูมีพลัง (Bouncy)
                    clearProps: "all",     // เมื่อจบให้ลบสไตล์ของ GSAP ออก เพื่อให้ CSS Hover ทำงานได้ปกติ
                    onComplete: () => {
                        // เมื่ออนิเมชั่นจบ สั่งให้ ScrollTrigger ตรวจสอบตำแหน่งใหม่
                        if (window.ScrollTrigger) ScrollTrigger.refresh();
                    }
                });
            }
        });
    }

    // รีเฟรชระบบตรวจจับการเลื่อน
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    
    // เรียกใช้ฟังก์ชันอนิเมชั่นเสริมอื่นๆ (ถ้ามี)
    if (typeof initScrollAnimations === 'function') {
        initScrollAnimations();
    }
} // ✅ ปิด renderProfiles สมบูรณ์แบบ
// 2. ฟังก์ชันสร้างส่วนแสดงผลการค้นหา
function createSearchResultSection(profiles) {
    let headerText = "ผลการค้นหา";

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
                <div>
                    <h3 class="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white leading-tight">
                        ${headerText}
                    </h3>
                </div>
                <div class="flex-shrink-0">
                    <span class="inline-flex items-center px-4 py-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold text-sm border border-pink-100 dark:border-pink-800">
                        พบ ${profiles.length} รายการ
                    </span>
                </div>
            </div>
          </div>
          <div class="profile-grid grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 sm:px-6 pb-12"></div>
        `;

    const grid = wrapper.querySelector('.profile-grid');
    const frag = document.createDocumentFragment();

    // ✅ forEach ส่งค่า i ถูกต้องแล้ว
    profiles.forEach((p, i) => frag.appendChild(createProfileCard(p, i)));

    grid.appendChild(frag);
    return wrapper;
} 

// ✅ 1. ฟังก์ชันสร้างการ์ดฉบับ Ultimate (เร็วสุด + สวยสุด)
function createProfileCard(p, index = 20) {
    // สร้าง Wrapper หลัก
    const cardWrapper = document.createElement('div');
    // ใช้ class 'profile-card-new' เชื่อมกับ CSS
    // เพิ่ม 'group' เพื่อควบคุม Effect ตอน Hover
    cardWrapper.className = 'profile-card-new group relative w-full bg-gray-900 rounded-2xl overflow-hidden shadow-lg';
    
    // Set ID สำหรับระบบ
    cardWrapper.setAttribute('data-profile-id', p.id);
    cardWrapper.setAttribute('data-profile-slug', p.slug);

    // --- Logic: จัดการรูปภาพ ---
    // ถ้าไม่มีรูป ให้ใช้รูป Placeholder
    const imgSrc = (p.images && p.images.length > 0) ? p.images[0].src : '/images/placeholder-profile.webp';
    
    // --- Logic: ประมวลผลสถานะ (Available/Busy) ---
    let statusConfig = { color: '#9ca3af', text: 'สอบถาม', bg: 'bg-gray-500/20', border: 'border-gray-500/50' };
    const availText = (p.availability || 'สอบถาม');
    const availCheck = availText.toLowerCase();

    if (availCheck.includes('ว่าง') || availCheck.includes('รับงาน')) {
        statusConfig = { color: '#22c55e', text: availText, bg: 'bg-green-500/20', border: 'border-green-500/50' }; // เขียว
    } else if (availCheck.includes('ไม่ว่าง') || availCheck.includes('พัก') || availCheck.includes('จอง')) {
        statusConfig = { color: '#ef4444', text: availText, bg: 'bg-red-500/20', border: 'border-red-500/50' }; // แดง
    }

    // --- Logic: เช็คไลค์ ---
    const isLiked = checkIfLiked(p.id); // ฟังก์ชันเช็คไลค์ (ต้องมีอยู่แล้วข้างล่าง)

    // --- HTML Structure (ใช้ Template Literal เพื่อความเร็วในการ Render) ---
    cardWrapper.innerHTML = `
        <div class="relative w-full h-full">
            <img src="${imgSrc}" 
                 alt="น้อง ${p.name}" 
                 class="card-image w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                 loading="${index < 4 ? 'eager' : 'lazy'}" 
                 decoding="async"
                 onerror="this.src='/images/placeholder-profile.webp'">
                 
            <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none z-10"></div>

        <div class="absolute top-3 right-3 z-20 flex flex-col items-end gap-1 pointer-events-none">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border ${statusConfig.border} ${statusConfig.bg} shadow-sm">
                <span class="w-2 h-2 rounded-full animate-pulse" style="background-color: ${statusConfig.color}; box-shadow: 0 0 8px ${statusConfig.color};"></span>
                <span class="text-[10px] font-bold text-white tracking-wide shadow-black drop-shadow-md">${availText}</span>
            </div>
            ${p.isfeatured ? `<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/50 backdrop-blur text-[10px] font-bold text-yellow-300 shadow-sm"><i class="fas fa-crown text-[9px]"></i> แนะนำ</div>` : ''}
        </div>

        <div class="absolute bottom-0 left-0 w-full p-4 z-20 flex flex-col justify-end">
            <div class="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                
                <div class="flex items-end justify-between mb-1">
                    <h3 class="text-lg font-bold text-white leading-none drop-shadow-lg truncate pr-2">${p.name}</h3>
                    ${p.age ? `<span class="text-[11px] font-medium text-gray-200 bg-white/10 px-1.5 py-0.5 rounded border border-white/5 backdrop-blur-sm">${p.age} ปี</span>` : ''}
                </div>
                
                <div class="flex items-center text-xs text-gray-300 mb-3 font-medium">
                    <i class="fas fa-map-marker-alt text-pink-500 mr-1.5"></i>
                    <span class="truncate">${p.provinceNameThai || 'เชียงใหม่'}</span>
                </div>

                <div class="w-full h-px bg-gradient-to-r from-white/20 to-transparent mb-2"></div>

                <div class="flex justify-between items-center h-8">
                     <span class="text-[10px] text-gray-400 font-light flex items-center gap-1">
                        <i class="far fa-clock"></i> ${formatDate ? formatDate(p.created_at) : ''}
                    </span>
                    
                    <button class="like-btn relative z-30 group/like flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-pink-600 backdrop-blur-md transition-all duration-300 border border-white/10 hover:border-pink-500 pointer-events-auto"
                            data-id="${p.id}"
                            onclick="event.preventDefault(); event.stopPropagation(); toggleLike('${p.id}', this)">
                        <i class="fas fa-heart text-xs transition-transform duration-300 group-hover/like:scale-125 ${isLiked ? 'text-white' : 'text-gray-300 group-hover/like:text-white'}"></i>
                    </button>
                </div>
            </div>
        </div>

        <a href="/sideline/${p.slug}" class="absolute inset-0 z-0" aria-label="ดูโปรไฟล์ ${p.name}"></a>
    `;

    return cardWrapper;
}

// ฟังก์ชันเสริม (ถ้ายังไม่มี ให้เพิ่มต่อท้ายไปเลยครับ)
function checkIfLiked(id) {
    try {
        const liked = JSON.parse(localStorage.getItem('liked_profiles') || '{}');
        return !!liked[id];
    } catch(e) { return false; }
}
    // =================================================================
    // 9. LIGHTBOX & HELPER FUNCTIONS
    // =================================================================
// ในไฟล์ main.js.html

async function fetchSingleProfile(slug) {
    if (!supabase) return null;
    try {
        // ✅ แก้ไข: JOIN ตาราง provinces เพื่อดึงชื่อจังหวัดมาพร้อมกัน
        const { data, error } = await supabase
            .from('profiles')
            .select('*, provinces(key, nameThai)') // ดึง key และ nameThai จาก provinces
            .eq('slug', slug)
            .maybeSingle();

        if (error || !data) {
            console.error("Error fetching single profile:", error);
            return null;
        }

        // ✅ เพิ่ม: นำข้อมูลจังหวัดที่ได้มาใหม่ ใส่ลงใน state.provincesMap ทันที
        // เพื่อให้ฟังก์ชัน processProfileData และ updateAdvancedMeta นำไปใช้ได้
        if (data.provinces && data.provinces.key && data.provinces.nameThai) {
            if (!state.provincesMap.has(data.provinces.key)) {
                state.provincesMap.set(data.provinces.key.toString(), data.provinces.nameThai);
            }
        }
        
        // ตอนนี้ processProfileData จะหาชื่อจังหวัดเจอแน่นอน
        return processProfileData(data);

    } catch (err) {
        console.error("Catch Error in fetchSingleProfile:", err);
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

/**
 * [ULTIMATE COMPLETE VERSION]
 * อัปเดตข้อมูลใน Lightbox ทั้งหมดให้ครบถ้วนตามตารางข้อมูล
 */
function populateLightboxData(p) {
    if (!p) {
        console.error("populateLightboxData called with invalid profile data.");
        closeLightbox();
        return;
    }

    // --- Cache DOM elements ---
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
        // ไม่ต้องใช้ dateAddedContainer แล้ว เพราะจะรวมเข้าไปใน detailsContainer
    };

    // --- 1. Header & Quote ---
    if (els.name) els.name.textContent = p.name || 'ไม่ระบุชื่อ';
    if (els.quote) {
        const hasQuote = p.quote && p.quote.trim() !== '';
        els.quote.textContent = hasQuote ? `"${p.quote}"` : '';
        els.quote.style.display = hasQuote ? 'block' : 'none';
    }
    
    // --- 2. Availability Badge ---
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

    // --- 3. Image Gallery ---
    if (els.hero) {
        els.hero.src = p.images?.[0]?.src || '/images/placeholder-profile.webp';
        els.hero.alt = p.altText || `รูปโปรไฟล์ ${p.name}`;
    }
    if (els.thumbs) {
        els.thumbs.innerHTML = '';
        const hasGallery = p.images && p.images.length > 1;
        if (hasGallery) {
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

    // --- 4. Style Tags ---
    if (els.tags) {
        els.tags.innerHTML = '';
        const hasTags = Array.isArray(p.styleTags) && p.styleTags.length > 0 && p.styleTags[0] !== '';
        if (hasTags) {
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

    // --- 5. ✅ สร้าง HTML แสดงรายละเอียดทั้งหมดแบบสมบูรณ์ ---
    if (els.detailsContainer) {
        const provinceName = state.provincesMap.get(p.provinceKey) || '';
        const fullLocation = [provinceName, p.location ? `(${p.location})` : ''].filter(Boolean).join(' ').trim();
        const dateToShow = p.lastUpdated || p.created_at;
        const formattedDate = formatDate(dateToShow);

        let detailsHTML = '';

        // --- ส่วนที่ 1: ข้อมูลทางกายภาพ ---
        detailsHTML += `
            <div class="stats-grid-container">
                ${p.age ? `<div class="stat-box"><span class="stat-label">อายุ</span><span class="stat-value">${p.age} ปี</span></div>` : ''}
                ${p.stats ? `<div class="stat-box"><span class="stat-label">สัดส่วน</span><span class="stat-value">${p.stats}</span></div>` : ''}
                ${(p.height || p.weight) ? `<div class="stat-box"><span class="stat-label">สูง/หนัก</span><span class="stat-value">${p.height || '-'}/${p.weight || '-'}</span></div>` : ''}
            </div>`;

        // --- ส่วนที่ 2: ข้อมูลบริการและอื่นๆ ---
        detailsHTML += '<div class="info-list-container mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">';
        
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

    // --- 6. Description ---
    if (els.descContainer && els.descContent) {
        const hasDescription = p.description && p.description.trim() !== '';
        if (hasDescription) {
            els.descContent.innerHTML = p.description.replace(/\n/g, '<br>');
            els.descContainer.style.display = 'block';
        } else {
            els.descContainer.style.display = 'none';
        }
    }

    // --- 7. LINE Button (Sticky Footer) ---
    const oldWrapper = document.getElementById('line-btn-sticky-wrapper');
    if (oldWrapper) oldWrapper.remove();
    if (p.lineId && els.lineBtnContainer) {
        const wrapper = document.createElement('div');
        wrapper.id = 'line-btn-sticky-wrapper';
        wrapper.className = 'lb-sticky-footer';
        const link = document.createElement('a');
        link.className = 'btn-line-action';
        link.href = p.lineId.startsWith('http') ? p.lineId : `https://line.me/ti/p/${p.lineId}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = `<i class="fab fa-line"></i> แอดไลน์ ${p.name || ''}`;
        wrapper.appendChild(link);
        els.lineBtnContainer.appendChild(wrapper);
    }
}



// =================================================================
// 10. SEO META TAGS UPDATER (อัปเกรดขั้นสูง - สูตรลับดันอันดับ GSC)
// =================================================================

const FAQ_DATA = [
    { 
        question: "บริการ Sideline Chiangmai ต้องโอนมัดจำไหม?", 
        answer: "ไม่ต้องโอนมัดจำทุกกรณีครับ ชำระเงินหน้างานกับน้องเท่านั้น ปลอดภัย 100% ตรงปกแน่นอน" 
    },
    { 
        question: "ถ้าน้องตอบช้าหรือมีปัญหาทำอย่างไร?", 
        answer: "เรามีแอดมินดูแลฟรีตลอดเวลาทำการ สามารถติดต่อประสานงานผ่าน LINE ได้เลยค่ะ" 
    },
    { 
        question: "น้องๆ ในเว็บตรงปกไหม?", 
        answer: "เราคัดกรองโปรไฟล์อย่างเข้มงวด รับประกันตรงปก 100% หากไม่ตรงปกสามารถปฏิเสธงานได้ทันที" 
    }
];

// =================================================================
// === ฟังก์ชัน updateAdvancedMeta (ฉบับสมบูรณ์ & ปรับแต่ง SEO) ===
// =================================================================
function updateAdvancedMeta(profile = null, pageData = null) {
    // 1. ล้าง Schema เดิมออกก่อน
    const oldScripts = document.querySelectorAll('script[id^="schema-jsonld"]');
    oldScripts.forEach(s => s.remove());

    const BRAND_NAME = "Sideline Chiangmai";
    
    // 🔥 ปรับ KEYWORDS ตาม GSC: เอา "เชียงใหม่" ขึ้นก่อน, ใส่ "รับงาน", ย้ำ "จ่ายหน้างาน"
    const GLOBAL_TITLE = `ไซด์ไลน์เชียงใหม่ รับงานฟิวแฟน ตรงปก ไม่มัดจำ จ่ายหน้างาน | ${BRAND_NAME}`;
    
    const GLOBAL_DESC = `ศูนย์รวมสาวไซด์ไลน์เชียงใหม่ รับงานฟิวแฟน การันตีรูปตรงปก 100% ปลอดภัยสูง ไม่ต้องโอนมัดจำ ชำระเงินหน้างานเท่านั้น อัปเดตน้องใหม่ทุกวัน มีแอดมินดูแลฟรี`;

    if (profile) {
        // --- กรณี: หน้าโปรไฟล์รายบุคคล ---
        
        // 1. ถ้าไม่ระบุจังหวัด ให้ Default เป็น "เชียงใหม่" (ดีกว่าคำว่า ไม่ระบุ)
        const provinceName = state.provincesMap.get(profile.provinceKey) || 'เชียงใหม่';
        
        // 2. ดึงราคามาใส่ Title (ถ้ามี) คนชอบคลิกที่มีราคาบอกชัดเจน
        const priceText = profile.rate ? ` ราคา ${profile.rate}` : '';
        
        // Title สูตร: [ชื่อ] [จังหวัด] [รับงานเอง] [ราคา] [แบรนด์]
        const title = `น้อง${profile.name} ไซด์ไลน์${provinceName} รับงานเอง${priceText} จ่ายหน้างาน | ${BRAND_NAME}`; 
        
        // Description สูตร: อัดแน่นด้วยรายละเอียด + Trust words
        const richDescription = `น้อง${profile.name} สาวไซด์ไลน์${provinceName} อายุ ${profile.age || '20+'} รับงานฟิวแฟน พิกัด${profile.location || provinceName} รูปตรงปก 100% ไม่ต้องโอนมัดจำ ชำระเงินหน้างาน ${profile.quote ? `"${profile.quote}"` : ''}`;

        document.title = title;
        updateMeta('description', richDescription); 
        updateMeta('keywords', `ไซด์ไลน์${provinceName}, รับงาน${provinceName}, น้อง${profile.name}, สาวไซด์ไลน์, ไม่มัดจำ`); // ✅ เพิ่ม Keywords
        updateMeta('robots', 'index, follow'); 
        updateLink('canonical', `${CONFIG.SITE_URL}/sideline/${profile.slug}`);
        
        updateOpenGraphMeta(profile, title, richDescription, 'profile');
        injectSchema(generatePersonSchema(profile, richDescription), 'schema-jsonld-person');
        injectSchema(generateBreadcrumbSchema('profile', profile.name), 'schema-jsonld-bc');
        
    } else if (pageData) {
        // --- กรณี: หน้าจังหวัด (Location) ---
        
        // ใช้ Title จาก handleRouting หรือสร้างใหม่แบบ Strong
        const pageTitle = pageData.title || `ไซด์ไลน์${pageData.provinceName} รับงาน${pageData.provinceName} ฟิวแฟน ไม่มัดจำ | ${BRAND_NAME}`;
        
        // Description เน้นจังหวัดนั้นๆ
        const pageDescription = `รวมรูปสาวไซด์ไลน์ ${pageData.provinceName} รับงานเอง ${pageData.provinceName} คัดคนสวย ตรงปก 100% ปลอดภัย ไม่ผ่านเอเย่นต์ ไม่ต้องโอนจอง จ่ายเงินหน้างานเท่านั้น`;
        
        document.title = pageTitle;
        updateMeta('description', pageDescription);
        updateMeta('keywords', `ไซด์ไลน์${pageData.provinceName}, รับงาน${pageData.provinceName}, สาวไซด์ไลน์${pageData.provinceName}, ไม่มัดจำ`); // ✅ เพิ่ม Keywords
        updateMeta('robots', 'index, follow'); 
        updateLink('canonical', pageData.canonicalUrl);
        
        updateOpenGraphMeta(null, pageTitle, pageDescription, 'website');
        injectSchema(generateListingSchema(pageData), 'schema-jsonld-list');
        injectSchema(generateBreadcrumbSchema('location', pageData.provinceName), 'schema-jsonld-bc');
        
    } else {
        // --- กรณี: หน้าแรก (Home) ---
        
        // เช็คก่อนว่า Title ว่างอยู่หรือเปล่า (กันพลาด)
        if (!document.title || document.title === BRAND_NAME) document.title = GLOBAL_TITLE; 
        
        updateMeta('description', GLOBAL_DESC);
        updateMeta('keywords', 'ไซด์ไลน์เชียงใหม่, รับงานเชียงใหม่, ไซด์ไลน์, ฟิวแฟน, ไม่มัดจำ, จ่ายหน้างาน, สาวไซด์ไลน์, เชียงใหม่'); // ✅ เพิ่ม Keywords
        updateMeta('robots', 'index, follow'); 
        updateLink('canonical', CONFIG.SITE_URL);
        
        updateOpenGraphMeta(null, GLOBAL_TITLE, GLOBAL_DESC, 'website');
        injectSchema(generateWebsiteSchema(), 'schema-jsonld-web'); 
        injectSchema(generateOrganizationSchema(), 'schema-jsonld-org'); 
        injectSchema(generateFAQPageSchema(FAQ_DATA), 'schema-jsonld-faq');
    }
}

// ✅ อัปเกรดการแสดงผลโซเชียล: ใช้รูป .webp และใส่ Alt Text คีย์เวิร์ด
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

/**
 * [COMPLETE FUNCTION 3/3]
 * สร้าง Schema สำหรับ SEO พร้อมข้อมูล "วันที่เผยแพร่"
 */
function generatePersonSchema(p, descriptionOverride) {
    const provinceName = state.provincesMap.get(p.provinceKey) || '';
    const publishedDate = p.image_updated_at || p.created_at || new Date().toISOString();
    
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
        "name": p.name,
        "url": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
        "image": p.images[0].src,
        "description": descriptionOverride,
        "jobTitle": "Independent Model",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": provinceName,
            "addressRegion": "Thailand"
        },
        "offers": {
            "@type": "Offer",
            "price": p.rate,
            "priceCurrency": "THB",
            "description": "ชำระเงินหน้างานเท่านั้น ไม่มีมัดจำทุกกรณี",
            "availability": "https://schema.org/InStock"
        },
        "datePublished": new Date(publishedDate).toISOString()
    };

    return schema;
}
// --- START OF COMPLETE FUNCTIONS ---

/**
 * [COMPLETE FUNCTION 1/3]
 * สร้าง Schema สำหรับหน้าคำถามที่พบบ่อย (FAQPage)
 * @param {Array} faqData - อาร์เรย์ของ { question, answer }
 * @returns {Object|null} - JSON-LD object หรือ null ถ้าไม่มีข้อมูล
 */
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

/**
 * [COMPLETE FUNCTION 2/3]
 * สร้าง Schema สำหรับ Breadcrumb (เส้นทางนำทาง)
 * @param {string} type - 'profile' หรือ 'location'
 * @param {string} name - ชื่อโปรไฟล์ หรือ ชื่อจังหวัด
 * @returns {Object} - JSON-LD object สำหรับ BreadcrumbList
 */
function generateBreadcrumbSchema(type, name) {
    const home = {
        "@type": "ListItem",
        "position": 1,
        "name": "หน้าแรก",
        "item": CONFIG.SITE_URL
    };

    let secondItem;
    if (type === 'profile') {
        secondItem = {
            "@type": "ListItem",
            "position": 2,
            "name": name
        };
    } else if (type === 'location') {
        secondItem = {
            "@type": "ListItem",
            "position": 2,
            "name": `จังหวัด ${name}`
        };
    }

    const list = secondItem ? [home, secondItem] : [home];
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": list
    };
}

/**
 * [COMPLETE FUNCTION 3/3]
 * สร้าง Schema สำหรับหน้ารายการ (ItemList) เช่น หน้าจังหวัด
 * @param {Object} pageData - ข้อมูลของหน้าเว็บ รวมถึง profiles array
 * @returns {Object|null} - JSON-LD object หรือ null ถ้าไม่มีข้อมูล
 */
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

// --- END OF COMPLETE FUNCTIONS ---
// ✅ อัปเกรด Website/Org: ระบุชื่อแบรนด์ให้ตรงกับ URL
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

// ✅ ปรับปรุงระบบฉีด Schema (รองรับหลาย ID และความปลอดภัย)
function injectSchema(json, id = 'schema-jsonld') {
    if (!json) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(json);
    document.head.appendChild(script);
}

// ✅ ปรับปรุง Helper functions ให้รองรับทั้ง meta name และ property (สำหรับ OG)
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

// ฟังก์ชัน generateBreadcrumbSchema, generateFAQPageSchema, generateListingSchema 
// ให้ใช้ตามโครงสร้างเดิมที่คุณส่งมา แต่ตรวจสอบให้แน่ใจว่าได้เรียกใช้ใน updateAdvancedMeta แล้ว
    // =================================================================
    // 11. UI & UTILS
    // =================================================================
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
// ✨ NEW FEATURE: VIP AGE GATE (SEO & BOT FRIENDLY)
// ==========================================
function initAgeVerification() {
    // 1. 🛡️ ตรวจสอบ Bot ทันที (SEO Stealth Mode)
    // เพิ่มการตรวจจับ Bot ทุกค่าย รวมถึงตัว Crawler ของโซเชียลมีเดีย
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|ia_archiver|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|quora\ link\ preview|outbrain|pinterest\/0\.|vkShare|W3C_Validator/i.test(navigator.userAgent);

    // 🔥 ถ้าเป็น Bot ให้ "Return" ออกไปทันที (ทะลุผ่าน) ไม่ต้องสร้างหน้ากั้นอายุ
    if (isBot) {
        console.log("SEO Mode: Search Engine detected. Bypassing age verification for full indexing.");
        return; 
    }

    // 2. ตรวจสอบสถานะเดิมสำหรับ User ทั่วไป (คน)
    const ts = localStorage.getItem(CONFIG.KEYS.AGE_CONFIRMED);
    if (ts && (Date.now() - parseInt(ts)) < 3600000) return;

    // 3. เริ่มสร้าง UI สำหรับคนปกติ (ถ้าไม่ใช่ Bot และยังไม่ได้กดยืนยัน)
    const div = document.createElement('div');
    div.id = 'age-verification-overlay';
    
    // ใช้ Inline Style ผสม Tailwind เพื่อความชัวร์เรื่อง Layout
    div.style.cssText = "position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; overflow: hidden;";
    
    div.innerHTML = `
        <!-- พื้นหลังรูปภาพ (เบลอ) -->
        <div style="position: absolute; inset: 0; background-image: url('/images/placeholder-profile.webp'); background-size: cover; background-position: center; filter: blur(20px); opacity: 0.4; transform: scale(1.1);"></div>
        <!-- พื้นหลังสีดำทับ -->
        <div style="position: absolute; inset: 0; background-color: rgba(0, 0, 0, 0.75); backdrop-filter: blur(10px);"></div>

        <!-- การ์ด VIP (Glassmorphism) -->
        <div style="position: relative; z-index: 10; width: 100%; max-width: 380px; margin: 16px;">
            <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(16px); border-radius: 24px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); text-align: center; overflow: hidden;">
                
                <!-- แสงพาดด้านบน -->
                <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 50%; height: 4px; background: linear-gradient(90deg, transparent, #ec4899, transparent); opacity: 0.8;"></div>
                
                <div style="margin-bottom: 24px;">
                    <!-- วงกลม 20+ -->
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 70px; height: 70px; border-radius: 9999px; background-color: rgba(236, 72, 153, 0.15); margin-bottom: 16px; border: 1px solid rgba(236, 72, 153, 0.5); box-shadow: 0 0 20px rgba(236, 72, 153, 0.2);">
                        <span style="font-size: 24px; font-weight: 800; color: #ec4899;">20+</span>
                    </div>
                    
                    <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Restricted Area</h2>
                    <p style="color: #d1d5db; font-size: 14px; line-height: 1.6;">
                        เว็บไซต์นี้มีเนื้อหาสำหรับผู้ใหญ่<br>
                        กรุณายืนยันว่าคุณมีอายุ 20 ปีบริบูรณ์
                    </p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button id="age-confirm" style="width: 100%; padding: 14px; background: linear-gradient(90deg, #ec4899, #9333ea); color: white; font-weight: 700; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4); transition: transform 0.2s;">
                        ยืนยัน (เข้าสู่เว็บไซต์)
                    </button>
                    <button id="age-reject" style="width: 100%; padding: 12px; background: transparent; color: #9ca3af; font-size: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">
                        ออกจากเว็บไซต์
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(div);
    document.body.style.overflow = 'hidden';

    // Animation Effect (GSAP)
    const card = div.querySelector('div[style*="background: rgba"]'); 
    if (window.gsap) {
        gsap.from(card, { 
            y: 50, 
            opacity: 0, 
            duration: 0.8, 
            ease: "back.out(1.2)",
            delay: 0.2 
        });
    }

    // Event Listeners
    document.getElementById('age-confirm').onclick = () => {
        localStorage.setItem(CONFIG.KEYS.AGE_CONFIRMED, Date.now());
        if (window.gsap) {
            gsap.to(card, { scale: 0.9, opacity: 0, duration: 0.3 });
            gsap.to(div, { 
                opacity: 0, 
                duration: 0.5, 
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

    document.getElementById('age-reject').onclick = () => {
        window.location.href = 'https://google.com';
    };
}
    function updateActiveNavLinks() {
        const path = window.location.pathname;
        document.querySelectorAll('nav a').forEach(l => {
            l.classList.toggle('text-pink-600', l.getAttribute('href') === path);
        });
    }

function createGlobalLoader() {
    if (document.getElementById('global-loader-overlay')) return;

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes bounce-gentle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        .animate-bounce-gentle { animation: bounce-gentle 1.5s infinite ease-in-out; }
    `;
    document.head.appendChild(style);

    const loaderHTML = `
        <div id="global-loader-overlay" style="position: fixed; inset: 0; z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #ffffff; transition: background-color 0.3s;" class="dark:bg-gray-900">
            <div style="position: relative; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: #ec4899; opacity: 0.2;" class="animate-ping"></div>
                <div style="position: absolute; inset: 10px; border-radius: 9999px; background-color: #ec4899; opacity: 0.4;" class="animate-pulse"></div>
                <div style="position: relative; z-index: 10; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); box-shadow: 0 10px 25px -5px rgba(236, 72, 153, 0.4);">
                    <i class="fas fa-heart animate-bounce-gentle" style="font-size: 36px; color: #ffffff;"></i>
                </div>
            </div>
            
            <div style="margin-top: 24px; text-align: center;">
                <!-- ✅ แก้ตรงนี้ให้เป็นตัวใหญ่ Sideline Chiangmai -->
                <h3 style="font-size: 18px; font-weight: 800; color: #374151; letter-spacing: 0.1em; text-transform: uppercase;" class="dark:text-white">Sideline Chiangmai</h3>
                <p style="font-size: 12px; color: #ec4899; margin-top: 4px; font-weight: 500;">กำลังคัดเลือกคนสวย...</p>
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
    // ใช้ GSAP ดึงกลับมาถ้ามันซ่อนอยู่
    gsap.set(loader, { display: 'flex', opacity: 1, pointerEvents: 'all' });
}

function hideLoadingState() {
    const loader = document.getElementById('global-loader-overlay');
    if (loader) {
        // Animation ตอนโหลดเสร็จ: ขยายวงออกแล้วจางหาย
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                // Trigger ให้ ScrollTrigger ทำงานใหม่หลังจาก Loader หาย
                ScrollTrigger.refresh();
            }
        });
    }
    if(dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
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

    const processUrl = (path) => {
        const encodedPath = encodeURIComponent(path).replace(/%2F/g, '/');
        const fullUrl = `${baseUrl}/${encodedPath}`;
        return fullUrl.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
    };

    // 1. หน้าแรก
    urls.push({ loc: processUrl(''), priority: '1.0', freq: 'daily' });

    // 2. หน้า Profile น้องๆ (จุดสำคัญที่เพิ่มรูปภาพ)
    state.allProfiles.forEach(p => { 
        if (p.slug) { 
            // ดึงข้อมูลรูปภาพจาก object ที่ process แล้ว
            let imageTag = '';
            if (p.images && p.images.length > 0 && p.images[0].src) {
                // ต้อง Escape URL รูปภาพด้วยเพื่อให้ XML ถูกต้อง
                const imgUrl = p.images[0].src.replace(/&/g, '&amp;');
                imageTag = `
        <image:image>
            <image:loc>${imgUrl}</image:loc>
            <image:title>${p.name || 'Profile Image'}</image:title>
        </image:image>`;
            }

            urls.push({ 
                loc: processUrl(`sideline/${p.slug.trim()}`), 
                priority: '0.9', 
                freq: 'daily',
                // เพิ่มฟิลด์พิเศษสำหรับเก็บ html รูปภาพ
                imageXml: imageTag 
            }); 
        } 
    });

    // 3. หน้า Location
    if (state.provincesMap && state.provincesMap.size > 0) { 
        state.provincesMap.forEach((name, key) => { 
            urls.push({ loc: processUrl(`location/${key}`), priority: '0.8', freq: 'daily' }); 
        }); 
    }

    // 4. หน้า Static
    ['blog.html', 'about.html', 'faq.html', 'profiles.html', 'locations.html'].forEach(page => { 
        urls.push({ loc: processUrl(page), priority: '0.7', freq: 'weekly' }); 
    });

    // สร้างเนื้อหา XML
    const xmlContent = urls.map(u => 
        `<url>
            <loc>${u.loc}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>${u.freq}</changefreq>
            <priority>${u.priority}</priority>${u.imageXml || ''}
        </url>` // เพิ่ม u.imageXml ตรงนี้
    ).join(''); // ลบ \n ออกเพื่อให้ไฟล์เล็กลง (Optional)

    // คืนค่าพร้อม Header ที่ถูกต้อง (เพิ่ม xmlns:image)
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
// ... (โค้ดอื่นๆ ของพี่ด้านบน) ...

    // 1. วางฟังก์ชัน showErrorState ไว้ก่อน
    function showErrorState(error) {
        console.error("❌ เกิดข้อผิดพลาดร้ายแรง:", error);
        hideLoadingState();
        const displayArea = document.getElementById('profiles-display-area');
        if (displayArea) {
            displayArea.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <h3 style="font-size: 20px; font-weight: bold;">โหลดข้อมูลไม่สำเร็จ</h3>
                    <p style="margin-top: 8px; color: #374151;">ระบบไม่สามารถดึงข้อมูลได้ในขณะนี้<br>กรุณาตรวจสอบอินเทอร์เน็ต หรือลองใหม่อีกครั้ง</p>
                    <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 24px; background-color: #ec4899; color: white; border-radius: 99px; border: none; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-sync-alt mr-2"></i> ลองใหม่
                    </button>
                </div>
            `;
        }
    }

const now = new Date();
const thaiDate = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
const timeEl = document.getElementById('last-updated-time');
if (timeEl) timeEl.innerText = thaiDate;

})();