import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs';

gsap.registerPlugin(ScrollTrigger);

(function () {
    'use strict';

    const CONFIG = {
        SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
        STORAGE_BUCKET: 'profile-images',
        KEYS: {
            LAST_PROVINCE: 'sidelinecm_last_province',
            
            // ✅ [ใหม่] ระบบ Smart Cache
            CACHE_PROFILES: 'cachedProfiles_v2',   // เปลี่ยนชื่อเพื่อ Reset ของเก่า
            CACHE_PROVINCES: 'cachedProvinces_v2', // แยก Cache จังหวัด
            LAST_SYNC: 'data_last_sync_timestamp', // ตัวเก็บเวลาล่าสุดจาก Server
            
            // [คงเดิม]
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
        pick: function (group) {
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
    cleanupFunctions: [],
    // ✅ เพิ่ม 2 บรรทัดนี้
    currentFilters: null,
    filteredProfiles: [] 
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

function saveRecentSearch(term) {
    if (!term || term.trim() === '') return;
    
    try {
        const recentSearches = JSON.parse(localStorage.getItem('recent_searches') || '[]');
        
        // เอา term เดิมออก (ถ้ามี)
        const filtered = recentSearches.filter(t => t.toLowerCase() !== term.toLowerCase());
        filtered.unshift(term);
        const limited = filtered.slice(0, 10);
        
        localStorage.setItem('recent_searches', JSON.stringify(limited));
    } catch (e) {
        console.error('Error saving recent search:', e);
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
    
    // ✅ ตัวแปรป้องกันการคลิกรัว (Throttle Flag) ประกาศไว้นอกฟังก์ชัน
    let isLikeProcessing = false;

    function initGlobalClickListener() {
        console.log("👂 Global Click Listener is now active.");
        
        document.body.addEventListener('click', (event) => {
            const target = event.target;

            // --- Priority 1: ตรวจสอบการคลิกที่ "ปุ่มหัวใจ" ก่อนเสมอ ---
            // ต้องเช็คก่อนเพื่อป้องกันไม่ให้ Event ทะลุไปโดนการ์ดด้านหลัง
            const likeButton = target.closest('[data-action="like"]');
            if (likeButton) {
                event.preventDefault(); // ห้ามลิ้งก์ทำงาน (ถ้ามี)
                event.stopPropagation(); // ห้าม Event ทะลุไปหา Parent (การ์ด)
                
                const profileId = likeButton.dataset.id;
                
                // เรียกใช้ฟังก์ชันกดไลค์ (ถ้ามี ID)
                if (profileId && typeof window.handleLikeClick === 'function') {
                    window.handleLikeClick(likeButton, profileId);
                }
                return; // จบการทำงานทันที ไม่ไปเช็คเงื่อนไขอื่น
            }

            // --- Priority 2: ถ้าไม่ใช่หัวใจ ค่อยเช็ค "การ์ด" เพื่อเปิด Lightbox ---
            const cardLink = target.closest('a.card-link');
            if (cardLink) {
                event.preventDefault(); // หยุดการเปลี่ยนหน้าแบบปกติ (Link Navigation)
                
                const card = cardLink.closest('.profile-card-new');
                const slug = card ? card.getAttribute('data-profile-slug') : null;
                
                if (slug) {
                    state.lastFocusedElement = card; // จำตำแหน่งเดิมไว้เวลากดปิดจะโฟกัสถูกที่
                    history.pushState(null, '', `/sideline/${slug}`); // เปลี่ยน URL สวยๆ
                    handleRouting(); // เรียกฟังก์ชันเปิด Lightbox
                }
                return;
            }
            
            // --- Priority 3: ปุ่มปิด Lightbox ---
            const closeButton = target.closest('#closeLightboxBtn');
            const lightboxBackdrop = target.closest('#lightbox');
            // เช็คว่ากดปุ่ม X หรือกดที่พื้นหลังสีดำ
            if (closeButton || (lightboxBackdrop && event.target === lightboxBackdrop)) {
                 history.pushState(null, '', '/'); // คืนค่า URL กลับหน้าแรก
                 handleRouting(); // ปิด Lightbox
            }
        });

        // รองรับปุ่ม ESC เพื่อปิด Lightbox
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && state.currentProfileSlug) {
                history.pushState(null, '', '/');
                handleRouting();
            }
        });
    }

    // ✅ [ฟังก์ชันกดไลค์ที่สมบูรณ์: Anti-Spam + Optimistic UI + Database Sync]
    window.handleLikeClick = async function(likeButton, profileId) {
        // 🛡️ 1. Anti-Spam: ถ้ากำลังประมวลผลอยู่ ห้ามกดซ้ำ!
        if (isLikeProcessing) return; 
        isLikeProcessing = true; // ล็อคปุ่มทันที
        
        console.log(`👍 Processing like for profile ID: ${profileId}`);

        // ⚡ 2. UI UPDATE (Optimistic UI): อัปเดตหน้าจอทันที ไม่ต้องรอ Database
        const isLiked = likeButton.classList.toggle('liked');
        const countSpan = likeButton.querySelector('.like-count');
        
        // เอฟเฟกต์เด้งดึ๋งเล็กน้อยเมื่อกด
        if (isLiked) {
            const icon = likeButton.querySelector('i');
            if(icon) {
                icon.style.transform = "scale(1.4)";
                setTimeout(() => icon.style.transform = "scale(1)", 200);
            }
        }
        
        if (countSpan) {
            // แปลงตัวเลข (ลบ comma ออกก่อนคำนวณ)
            let currentLikes = parseInt(countSpan.textContent.replace(/,/g, '') || '0');
            // บวกหรือลบตามสถานะใหม่
            countSpan.textContent = isLiked ? (currentLikes + 1).toLocaleString() : Math.max(0, currentLikes - 1).toLocaleString();
        }

        // 💾 3. LOCAL STORAGE: บันทึกสถานะลงเครื่องผู้ใช้
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

        // ☁️ 4. DATABASE UPDATE: ส่งคำสั่งไป Supabase (RPC)
        if (window.supabase) {
            try {
                // เลือกชื่อฟังก์ชัน SQL ตามสถานะ (ต้องสร้าง RPC ใน Supabase ก่อน)
                const rpcName = isLiked ? 'increment_likes' : 'decrement_likes';
                
                const { error } = await window.supabase.rpc(rpcName, { 
                    profile_id_to_update: profileId 
                });

                if (error) {
                    console.error('❌ Supabase update failed:', error.message);
                    // (Optional) ถ้าซีเรียสเรื่องข้อมูลไม่ตรง สามารถเขียนโค้ด Rollback UI กลับตรงนี้ได้
                } else {
                    // console.log(`✅ DB Updated: ${rpcName} success`);
                }
            } catch (err) {
                console.error("Connection error:", err);
            }
        }
        
        // ⏱️ 5. ปลดล็อค: หน่วงเวลา 1 วินาทีถึงจะกดไลค์ใหม่ได้ (ป้องกันยิง Database รัวๆ)
        setTimeout(() => { isLikeProcessing = false; }, 1000);
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

async function handleDataLoading() {
    if (state.isFetching) return;

    showLoadingState();
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
        try {
            const success = await fetchDataDelta();
            if (success) {
                initSearchAndFilters();
                await handleRouting(true);
                initRealtimeSubscription();
                
                if(dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
                if(dom.profilesDisplayArea) dom.profilesDisplayArea.classList.remove('hidden');
                
                hideLoadingState();
                return;
            }
        } catch (error) {
            console.error(`Attempt ${retryCount + 1} failed:`, error);
            retryCount++;
            
            if (retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
        }
    }
    
    showErrorState("ไม่สามารถโหลดข้อมูลได้หลังจากลองใหม่หลายครั้ง");
    hideLoadingState();
}



async function fetchDataDelta() {
    if (state.isFetching) return false;
    state.isFetching = true;

    try {
        console.log("🔄 Checking for updates via 'lastUpdated'...");

        // 1. ดึงเวลาอัปเดตล่าสุด (ใช้ lastUpdated ตามโครงสร้างฐานข้อมูลจริงของคุณ)
        const { data: latestEntry, error: checkError } = await supabase
            .from('profiles')
            .select('lastUpdated')
            .order('lastUpdated', { ascending: false, nullsFirst: false })
            .limit(1)
            .maybeSingle();

        if (checkError) {
            console.error("Supabase Check Error:", checkError);
            throw checkError;
        }

        // แปลงเวลาเป็น String เพื่อใช้เทียบ (ถ้าไม่มีข้อมูลให้ใช้ '0')
        const serverTimestamp = latestEntry?.lastUpdated 
            ? new Date(latestEntry.lastUpdated).getTime().toString() 
            : '0';

        const localTimestamp = localStorage.getItem(CONFIG.KEYS.LAST_SYNC);
        const hasCachedProfiles = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
        const hasCachedProvinces = localStorage.getItem(CONFIG.KEYS.CACHE_PROVINCES);

        // 🚀 SMART CACHE: ถ้าเวลาตรงกัน ไม่ต้องโหลดใหม่
        if (localTimestamp === serverTimestamp && hasCachedProfiles && hasCachedProvinces) {
            console.log("✅ ข้อมูลเป็นปัจจุบัน (Data Usage: 0)");
            
            state.allProfiles = JSON.parse(hasCachedProfiles);
            const cachedProv = JSON.parse(hasCachedProvinces);
            
            state.provincesMap.clear();
            cachedProv.forEach(p => state.provincesMap.set(p.key.toString(), p.name));
            
            populateProvinceDropdown();
            renderProfiles(state.allProfiles, false);
            
            state.isFetching = false;
            return true;
        }

        // 2. ถ้าข้อมูลไม่อัพเดท ให้โหลดใหม่ทั้งหมด
        console.log("🚀 Found updates! Fetching fresh data...");

        const [provincesRes, profilesRes] = await Promise.all([
            supabase.from('provinces').select('*'),
            supabase.from('profiles')
                .select('*')
                .eq('active', true) // โหลดเฉพาะคนที่ Active
                .order('isfeatured', { ascending: false })
                .order('created_at', { ascending: false })
        ]);

        if (provincesRes.error) throw provincesRes.error;
        if (profilesRes.error) throw profilesRes.error;

        // จัดการข้อมูลจังหวัด (ใช้ nameThai และ key ตาม JSON จริง)
        state.provincesMap.clear();
        const provincesForCache = [];
        (provincesRes.data || []).forEach(p => {
            const name = p.nameThai || p.name;
            const key = p.key || p.slug || p.id;
            if (key && name) {
                state.provincesMap.set(key.toString(), name);
                provincesForCache.push({ key: key.toString(), name: name });
            }
        });

        // 3. ประมวลผลโปรไฟล์ (ใช้ processProfileData ตัวที่แก้ใหม่ด้านล่าง)
        const fetchedProfiles = profilesRes.data || [];
        state.allProfiles = fetchedProfiles.map(p => processProfileData(p)).filter(Boolean);

        // 4. บันทึก Cache
        try {
            localStorage.setItem(CONFIG.KEYS.CACHE_PROFILES, JSON.stringify(state.allProfiles));
            localStorage.setItem(CONFIG.KEYS.CACHE_PROVINCES, JSON.stringify(provincesForCache));
            localStorage.setItem(CONFIG.KEYS.LAST_SYNC, serverTimestamp);
            console.log("💾 Local Cache Updated.");
        } catch (e) {
            console.warn("⚠️ LocalStorage full:", e);
        }

        populateProvinceDropdown();
        renderProfiles(state.allProfiles, false);
        return true;

    } catch (err) {
        console.error('❌ Data load error:', err);
        // Fallback: ถ้าเน็ตเน่า ใช้ของเก่า
        const staleData = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
        if (staleData) {
            state.allProfiles = JSON.parse(staleData);
            renderProfiles(state.allProfiles, false);
        } else {
            showErrorState(err);
        }
        return false;
    } finally {
        state.isFetching = false;
    }
}
// =================================================================
// ส่วนที่ 7: ULTIMATE SEARCH ENGINE (ฉบับแก้ไขสมบูรณ์และทดสอบแล้ว)
// =================================================================


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

function initRealtimeSubscription() {
    // ✅ ปิด Realtime ถาวร เพื่อใช้ระบบ Smart Cache
    // ข้อมูลจะอัปเดตเมื่อ: แอดมินแก้ไข -> ลูกค้ากด Refresh หน้าเว็บ
    
    // Cleanup ของเก่า (ถ้ามี)
    if (state.realtimeSubscription) {
        try {
            supabase.removeChannel(state.realtimeSubscription);
        } catch (e) { }
        state.realtimeSubscription = null;
    }
    
    // ลบ cleanup function เก่าๆ
    state.cleanupFunctions = state.cleanupFunctions || [];
    
    console.log('zzz Realtime disabled. Using Smart Cache Strategy.');
}

// ✅ ฟังก์ชันช่วยดึงรูปและบีบอัดให้ตรงกับระบบหลังบ้าน
function getOptimizedClientImage(path, width = 400) {
    if (!path) return CONFIG.DEFAULT_OG_IMAGE;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/c_scale,w_${width},q_auto,f_auto/`);
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/${CONFIG.STORAGE_BUCKET}/${path}`;
}

// =================================================================
// 1. DATA PROCESSING (Data Layer) - แปลงข้อมูลจาก DB ให้พร้อมใช้
// =================================================================
function processProfileData(p) {
    if (!p) return null;

    // 1. ชื่อ: ตัดคำนำหน้า "น้อง" ออกเพื่อความสวยงาม (ถ้ามี)
    const displayName = getCleanName(p.name); 

    // 2. รูปภาพ: รวม imagePath (รูปปก) และ galleryPaths (อัลบั้ม) เข้าด้วยกัน
    // รองรับทั้ง URL เต็ม (Cloudinary) และ Path ย่อ (Supabase Storage)
    const rawGallery = Array.isArray(p.galleryPaths) ? p.galleryPaths : [];
    const allImagePaths = [p.imagePath, ...rawGallery].filter(Boolean); // ตัดค่า null/undefined ทิ้ง
    
    // กรอง Path ซ้ำ (Unique)
    const uniquePaths = [...new Set(allImagePaths)];

    // สร้าง Object รูปภาพ พร้อม URL 2 ขนาด (รูปเล็กไว้โชว์เร็วๆ / รูปใหญ่ไว้ดูชัดๆ)
    let imageObjects = uniquePaths.map(path => {
        return { 
            src: getOptimizedClientImage(path, 400),  // รูปเล็ก (Thumbnail/Card)
            fullSrc: getOptimizedClientImage(path, 800) // รูปใหญ่ (Lightbox)
        };
    });

    // ถ้าไม่มีรูปเลย ให้ใส่รูป Placeholder กันเว็บพัง
    if (imageObjects.length === 0) {
        imageObjects.push({ 
            src: CONFIG.DEFAULT_OG_IMAGE, 
            fullSrc: CONFIG.DEFAULT_OG_IMAGE 
        });
    }

    // 3. จังหวัด: ดึงชื่อไทยจาก Map
    const provinceName = state.provincesMap.get(p.provinceKey) || p.provinceThai || 'ไม่ระบุ';

    // 4. ราคา: แปลง Text "1500.-" ให้เป็นตัวเลข 1500
    const numericPrice = Number(String(p.rate).replace(/\D/g, '')) || 0;
    const formattedPrice = numericPrice > 0 ? numericPrice.toLocaleString() : 'สอบถาม';

    // 5. String สำหรับระบบค้นหา (Search Engine)
    const universalSearchString = `
        ${displayName} ${p.id} ${provinceName} 
        ${Array.isArray(p.styleTags) ? p.styleTags.join(' ') : ''} 
        ${p.description || ''} ${p.location || ''} 
        ${p.stats || ''} ${p.skinTone || ''}
    `.toLowerCase().replace(/\s+/g, ' ').trim();

    // 6. Return ข้อมูลที่ Clean แล้วกลับไป
    return { 
        ...p, // ข้อมูลเดิมทั้งหมด (id, age, height, weight, etc.)
        displayName,
        images: imageObjects, 
        provinceNameThai: provinceName,
        displayPrice: formattedPrice, // ราคาแบบมีลูกน้ำ (string)
        _price: numericPrice,         // ราคาแบบตัวเลข (number) สำหรับเรียงลำดับ
        searchString: universalSearchString,
        
        // จัดการค่าว่างให้เป็น '-' เพื่อความสวยงาม
        safeHeight: (p.height && p.height.trim()) ? p.height : '-',
        safeWeight: (p.weight && p.weight.trim()) ? p.weight : '-',
        safeStats: (p.stats && p.stats.trim()) ? p.stats : '-',
        safeSkin: (p.skinTone && p.skinTone.trim()) ? p.skinTone : '-',
        safeAge: (p.age && p.age.trim()) ? p.age : '-'
    };
}

function populateProvinceDropdown() {
    if (!dom.provinceSelect) return;
    
    // ล้าง options เก่า (ยกเว้น option แรก)
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
// ✅ [FIXED] handleRouting (แก้หน้าเด้ง - ไม่ซ่อนฉากหลังแล้ว)
// =================================================================
async function handleRouting(dataLoaded = false) {
    let path = window.location.pathname.toLowerCase();
    if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    // --- ส่วนตรวจสอบหน้า Static ---
    const staticPages = ['/blog', '/about', '/faq', '/profiles', '/locations', '/contact', '/policy'];
    const isStaticPage = path.endsWith('.html') || 
                         path.endsWith('.htm') || 
                         staticPages.some(p => path === p || path.startsWith(p + '/'));

    if (isStaticPage) {
        console.log(`🛑 Static page detected (${path}).`);
        closeLightbox(false); 
        // หน้า Static อาจจะซ่อน Profile Area ได้ถ้าต้องการ (เพื่อให้เห็น Content ของหน้า Static ชัดเจน)
        if(dom.profilesDisplayArea) dom.profilesDisplayArea.classList.add('hidden');
        if(dom.featuredSection) dom.featuredSection.classList.add('hidden');
        return; 
    }

    // -------------------------------------------------------
    // ส่วน Dynamic Logic (แก้ไขแล้ว)
    // -------------------------------------------------------

    // 1. หน้าโปรไฟล์ (Profile Page) -> เปิด Lightbox ทับหน้าเดิม
    const profileMatch = path.match(/^\/(?:sideline|profile|app)\/([^/]+)/);
    if (profileMatch) {
        const slug = decodeURIComponent(profileMatch[1]);
        state.currentProfileSlug = slug;
        
        let profile = state.allProfiles.find(p => (p.slug || '').toLowerCase() === slug.toLowerCase());
        if (!profile && !dataLoaded) profile = await fetchSingleProfile(slug);

        if (profile) {
            openLightbox(profile);
            updateAdvancedMeta(profile, null);
            
            // ❌ ลบคำสั่งซ่อนฉากหลังออก! (เพื่อให้ Scroll อยู่ที่เดิม)
            // dom.profilesDisplayArea?.classList.add('hidden'); 
            // dom.featuredSection?.classList.add('hidden');
        } else if (dataLoaded) {
            // ถ้าไม่เจอ profile ให้ดีดกลับหน้าแรก
            history.replaceState(null, '', '/');
            closeLightbox(false);
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
        
        if (dom.provinceSelect) dom.provinceSelect.value = provinceKey;
        
        if (dataLoaded) {
            applyUltimateFilters(false);
            const provinceName = state.provincesMap.get(provinceKey) || provinceKey;
            
            const seoData = {
                title: `ไซด์ไลน์${provinceName} - รับงาน${provinceName}`, 
                description: `รวมน้องๆ ไซด์ไลน์ ${provinceName} คัดคนสวย ตรงปก 100%`,
                canonicalUrl: `${CONFIG.SITE_URL}/location/${provinceKey}`,
                provinceName: provinceName, 
                profiles: state.allProfiles.filter(p => p.provinceKey === provinceKey)
            };
            
            updateAdvancedMeta(null, seoData);
            
            // ✅ ต้องสั่งให้โชว์กลับมา (เผื่อมาจากหน้า Static ที่ถูกซ่อนไว้)
            dom.profilesDisplayArea?.classList.remove('hidden');
            dom.featuredSection?.classList.remove('hidden'); 
        }
        return;
    }

    // 3. หน้าแรก (Home Page)
    state.currentProfileSlug = null;
    closeLightbox(false);
    
    // ✅ ต้องสั่งให้โชว์กลับมาเสมอ
    dom.profilesDisplayArea?.classList.remove('hidden');
    dom.featuredSection?.classList.remove('hidden'); 
    
    if (dataLoaded) {
        applyUltimateFilters(false);
        updateAdvancedMeta(null, null);
    }
}

function debounce(func, delay = 250) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function initSearchAndFilters() {
    if (!dom.searchForm) return;

    // 1. ตั้งค่า Search Engine (Fuse.js)
    const fuseOptions = {
        includeScore: true,
        threshold: 0.3, 
        ignoreLocation: true,
        useExtendedSearch: true, 
        keys: [
            { name: 'searchString', weight: 1.0 },
            { name: 'name', weight: 0.8 },
            { name: 'englishName', weight: 0.8 },
            { name: 'id', weight: 0.9 },
            { name: 'provinceNameThai', weight: 0.5 },
            { name: 'styleTags', weight: 0.4 }
        ]
    };
    
    // ✅ แก้ไข: สร้าง Search Index ทันทีถ้ามีข้อมูล (ไม่ต้องรอ setTimeout)
    // เพราะ fetchDataDelta โหลดข้อมูลเสร็จก่อนเรียกฟังก์ชันนี้อยู่แล้ว
    if (state.allProfiles && state.allProfiles.length > 0) {
        console.log(`🚀 Building Search Index for ${state.allProfiles.length} profiles...`);
        fuseEngine = new Fuse(state.allProfiles, fuseOptions);
    } else {
        // เผื่อกรณียังไม่มีข้อมูลจริงๆ ค่อยรอ
        setTimeout(() => {
            if (state.allProfiles.length > 0 && !fuseEngine) {
                fuseEngine = new Fuse(state.allProfiles, fuseOptions);
            }
        }, 1000);
    }

    // --- 2. ตั้งค่า Event Listeners (ส่วนนี้เหมือนเดิม ดีอยู่แล้ว) ---
    const clearBtn = document.getElementById('clear-search-btn');
    const suggestionsBox = document.getElementById('search-suggestions');
    
    dom.searchInput?.addEventListener('input', debounce((e) => {
        const val = e.target.value;
        if(clearBtn) clearBtn.classList.toggle('hidden', !val);
        applyUltimateFilters(); 
        if (typeof updateUltimateSuggestions === 'function') {
            updateUltimateSuggestions(val);
        }
    }, 350));

    clearBtn?.addEventListener('click', () => {
        if (dom.searchInput) {
            dom.searchInput.value = '';
            dom.searchInput.focus();
        }
        clearBtn.classList.add('hidden');
        if (suggestionsBox) suggestionsBox.classList.add('hidden');
        applyUltimateFilters();
    });

    dom.provinceSelect?.addEventListener('change', () => {
        if (dom.searchInput) {
            dom.searchInput.value = '';
            if(clearBtn) clearBtn.classList.add('hidden');
        }
        const newPath = dom.provinceSelect.value ? `/location/${dom.provinceSelect.value}` : '/';
        history.pushState(null, '', newPath);
        applyUltimateFilters(true);
    });

    dom.availabilitySelect?.addEventListener('change', () => applyUltimateFilters(true));
    dom.featuredSelect?.addEventListener('change', () => applyUltimateFilters(true));
    dom.sortSelect?.addEventListener('change', () => applyUltimateFilters(true));
    
    dom.resetSearchBtn?.addEventListener('click', () => {
        if (dom.searchInput) dom.searchInput.value = '';
        if (dom.provinceSelect) dom.provinceSelect.value = '';
        if (dom.availabilitySelect) dom.availabilitySelect.value = '';
        if (dom.featuredSelect) dom.featuredSelect.value = '';
        if (dom.sortSelect) dom.sortSelect.value = 'featured';

        if (clearBtn) clearBtn.classList.add('hidden');
        history.pushState(null, '', '/');
        applyUltimateFilters(true);
    });

    dom.searchForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        applyUltimateFilters(true); 
        if(suggestionsBox) suggestionsBox.classList.add('hidden');
        if (dom.searchInput) dom.searchInput.blur();
    });
}

// ==========================================
// ✅ ฟังก์ชันจัดการ Cache ฉบับปรับปรุง (Safe Mode)
// ==========================================

// ฟังก์ชันนี้ถูกเรียกใช้ใน fetchDataDelta เพื่อบันทึกข้อมูล
// เปลี่ยนให้รองรับ Error กรณีเมมเต็ม โดยไม่ล้างข้อมูลสำคัญอื่นๆ
function saveCache(key, data) {
    try {
        // บันทึกข้อมูลดิบๆ เลย (ไม่ต้องห่อ timestamp เพราะเรามี LAST_SYNC แยกแล้ว)
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        // เช็คว่า Error เพราะเมมเต็มหรือไม่ (QuotaExceededError)
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            console.warn("⚠️ LocalStorage เต็ม! กำลังพยายามเคลียร์พื้นที่...");
            
            // 1. ลบ Cache เก่า (v1) ที่ไม่ใช้แล้ว
            localStorage.removeItem('cachedProfiles'); 
            
            // 2. ลบประวัติการค้นหา
            localStorage.removeItem('recent_searches');

            // 3. ลองบันทึกอีกครั้ง
            try {
                localStorage.setItem(key, JSON.stringify(data));
                console.log("✅ บันทึกสำเร็จหลังจากเคลียร์พื้นที่");
            } catch (retryError) {
                console.error("❌ พื้นที่เต็มจริงๆ ไม่สามารถบันทึก Cache ได้ (User ใช้งานได้ปกติแต่รอบหน้าจะโหลดใหม่)", retryError);
            }
        } else {
            console.error("❌ Cache Error:", e);
        }
    }
}

// ฟังก์ชันโหลด Cache (ปรับให้คืนค่า null ถ้า error)
function loadCache(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
        return JSON.parse(cached);
    } catch (e) {
        console.warn("⚠️ Cache ไฟล์เสียหาย:", key);
        localStorage.removeItem(key); // ลบไฟล์เสียทิ้ง
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
        <div onclick="handleSearchAll('${val.replace(/'/g, "\\'")}')" class="px-4 py-3 bg-pink-50/50 dark:bg-gray-800 text-center cursor-pointer hover:bg-pink-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700">
            <span class="text-sm font-bold text-pink-600"><i class="fas fa-search mr-1"></i> ดูผลลัพธ์ทั้งหมด</span>
        </div>
    </div>`;
    box.innerHTML = html;
    box.classList.remove('hidden');
}

// 1. แก้ไขฟังก์ชัน selectSuggestion
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
            
            // ✅ บันทึกประวัติการค้นหา
            saveRecentSearch(value);
            
            applyUltimateFilters(true);
            box?.classList.add('hidden');
        }
    }
};

// 2. แก้ไขฟังก์ชัน showRecentSearches
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
        const safeTerm = term.replace(/[<>]/g, ''); // ป้องกัน XSS
        html += `
            <div class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-gray-700 last:border-0" 
                 onclick="window.selectSuggestion(${JSON.stringify(term)}, false)">
                <i class="fas fa-history text-gray-400 min-w-[20px]"></i>
                <span class="font-medium">${safeTerm}</span>
            </div>
        `;
    });
    
    html += `</div>`;
    box.innerHTML = html;
    box.classList.remove('hidden');
}

// 3. เพิ่มฟังก์ชัน handleSearchAll
function handleSearchAll(searchTerm) {
    const input = document.getElementById('search-keyword');
    if (input) {
        input.value = searchTerm;
        saveRecentSearch(searchTerm);
        applyUltimateFilters(true);
    }
    const box = document.getElementById('search-suggestions');
    if (box) box.classList.add('hidden');
}

// =================================================================
// [ฉบับสมบูรณ์ 100%] - applyUltimateFilters (Genius Search Edition)
// =================================================================
function applyUltimateFilters(updateUrl = true) {
    try {
        // 1. รวบรวมค่าจาก UI ทั้งหมด
        const query = {
            text: (dom.searchInput?.value || '').trim(),
            province: dom.provinceSelect?.value || 'all',
            avail: dom.availabilitySelect?.value || 'all',
            featured: dom.featuredSelect?.value === 'true',
            sort: dom.sortSelect?.value || 'featured'
        };

        // ✅ บันทึกประวัติการค้นหา
        if (query.text) {
            saveRecentSearch(query.text);
        }

        // 2. 🔥 INTENT DETECTION: ตรวจจับความตั้งใจผู้ใช้
        // ถ้าผู้ใช้พิมพ์ชื่อจังหวัด -> ให้เปลี่ยนเป็นการกรองจังหวัดแทน
        if (query.text && state.provincesMap) {
            for (const [key, provinceName] of state.provincesMap.entries()) {
                const normalizedText = query.text.toLowerCase().trim();
                const normalizedProvince = provinceName.toLowerCase().trim();
                
                // เช็คหลายเงื่อนไขเพื่อตรวจจับความตั้งใจ
                if (normalizedText === normalizedProvince || 
                    normalizedProvince.includes(normalizedText) ||
                    normalizedText.includes(normalizedProvince)) {
                    
                    // ถ้าตรวจจับได้ว่าเป็นชื่อจังหวัด
                    query.province = key;
                    query.text = ''; // ลบ text เพื่อกรองเฉพาะจังหวัด
                    
                    // อัปเดต UI ให้สอดคล้อง
                    if (dom.searchInput) dom.searchInput.value = '';
                    if (dom.provinceSelect) dom.provinceSelect.value = key;
                    
                    console.log(`🔍 Intent detected: ผู้ใช้ต้องการดูจังหวัด "${provinceName}"`);
                    break;
                }
            }
        }

        // 3. บันทึกจังหวัดล่าสุดสำหรับการใช้งานครั้งต่อไป
        if (query.province && query.province !== 'all') {
            localStorage.setItem(CONFIG.KEYS.LAST_PROVINCE, query.province);
        }

        // 4. กรองข้อมูลตามเงื่อนไข
        let filtered = [...state.allProfiles]; // สร้างสำเนาเพื่อป้องกันการเปลี่ยนแปลงต้นฉบับ

        // 4.1 🔥 กรองด้วยคำค้นหา (GENIUS LOGIC)
        if (query.text) {
            const searchText = query.text.toLowerCase().trim();
            let searchHandled = false;

            // [A] ค้นหาด้วย ID (High Priority): ถ้าพิมพ์ตัวเลขล้วนๆ ให้หา ID ก่อน
            if (/^\d+$/.test(searchText)) {
                // ค้นหาทั้ง ID ตรงๆ และ เลขที่ห้อยท้าย Slug
                const idMatches = filtered.filter(p => 
                    String(p.id) === searchText || 
                    (p.slug && p.slug.endsWith(`-${searchText}`))
                );

                if (idMatches.length > 0) {
                    filtered = idMatches;
                    searchHandled = true;
                    console.log(`⚡ ID Match Found: ${searchText}`);
                }
            }

            // [B] ค้นหาด้วย Fuse.js หรือ Text (ถ้ายังไม่เจอ ID)
            if (!searchHandled) {
                if (fuseEngine) {
                    // ใช้ Fuse.js ที่ตั้งค่าไว้ (ค้นหา searchString, ชื่ออังกฤษ, ชื่อไทย)
                    const results = fuseEngine.search(query.text, { limit: 500 });
                    filtered = results.map(result => result.item);
                } else {
                    // Fallback: ถ้า Fuse ยังไม่พร้อม ให้หาจาก searchString ตรงๆ
                    filtered = filtered.filter(p => 
                        p.searchString?.includes(searchText) || 
                        p.name?.toLowerCase().includes(searchText) ||
                        p.englishName?.includes(searchText)
                    );
                }
            }
        }

        // 4.2 กรองด้วยจังหวัด
        if (query.province && query.province !== 'all') {
            filtered = filtered.filter(p => p.provinceKey === query.province);
        }

        // 4.3 กรองด้วยสถานะ Availability
        if (query.avail && query.avail !== 'all') {
            filtered = filtered.filter(p => p.availability === query.avail);
        }

        // 4.4 กรองด้วย Featured Status
        if (query.featured) {
            filtered = filtered.filter(p => p.isfeatured === true);
        }

        // 5. เรียงลำดับผลลัพธ์
        filtered.sort((a, b) => {
            switch (query.sort) {
                case 'featured':
                    // Featured มาก่อน, แล้วตามด้วยชื่อ A-Z
                    if (a.isfeatured && !b.isfeatured) return -1;
                    if (!a.isfeatured && b.isfeatured) return 1;
                    return (a.name || '').localeCompare(b.name || '');
                    
                case 'name_asc':
                    return (a.name || '').localeCompare(b.name || '');
                    
                case 'name_desc':
                    return (b.name || '').localeCompare(a.name || '');
                    
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                    
                default:
                    return 0;
            }
        });

        // 6. อัปเดต UI - แสดงจำนวนผลลัพธ์
        if (dom.resultCount) {
            const count = filtered.length;
            let message = '';
            
            if (count === 0) {
                message = '❌ ไม่พบโปรไฟล์ที่ตรงกับเงื่อนไข';
            } else if (count === 1) {
                message = '✅ พบ 1 โปรไฟล์';
            } else {
                message = `✅ พบ ${count.toLocaleString()} โปรไฟล์`;
                
                // แสดงจังหวัดที่กรอง (ถ้ามี)
                if (query.province && query.province !== 'all') {
                    const provinceName = state.provincesMap?.get(query.province) || query.province;
                    message += ` ในจังหวัด${provinceName}`;
                }
            }
            
            dom.resultCount.textContent = message;
            dom.resultCount.style.display = 'block';
            
            // ซ่อนผลลัพธ์ถ้าไม่มีข้อมูล
            if (count === 0) {
                dom.resultCount.classList.add('no-results');
            } else {
                dom.resultCount.classList.remove('no-results');
            }
        }

        // 7. Render โปรไฟล์
        const isSearchMode = query.text || (query.province && query.province !== 'all') || 
                            query.avail !== 'all' || query.featured;
        
        renderProfiles(filtered, isSearchMode);

        // 8. อัปเดต URL (ถ้าต้องการ)
        if (updateUrl) {
            updateUrlFromFilters(query);
        }

        // 9. อัปเดต state ปัจจุบัน
        state.currentFilters = query;
        state.filteredProfiles = filtered;

        console.log(`🔍 กรองเสร็จสิ้น: ${filtered.length} โปรไฟล์`, query);

    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดใน applyUltimateFilters:', error);
        
        // แสดงข้อความผิดพลาด
        if (dom.resultCount) {
            dom.resultCount.textContent = '⚠️ เกิดข้อผิดพลาดในการกรองข้อมูล';
            dom.resultCount.style.display = 'block';
        }
    }
}

// ✅ ประกาศฟังก์ชันแยกต่างหาก อยู่นอก showRecentSearches
window.clearRecentSearches = function() {
    if (confirm("ต้องการล้างประวัติการค้นหาทั้งหมดใช่ไหม?")) {
        localStorage.removeItem('recent_searches');
        const box = document.getElementById('search-suggestions');
        if (box) box.classList.add('hidden');
    }
}

// ✅ เพิ่ม Event Listeners ใน DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {

    
    // ✅ เพิ่ม: แสดงประวัติการค้นหาเมื่อหน้าโหลดเสร็จ
    setTimeout(() => {
        const searchInput = document.getElementById('search-keyword');
        if (searchInput && !searchInput.value.trim()) {
            showRecentSearches();
        }
    }, 1000);
});

/**
 * อัปเดต URL จากฟิลเตอร์ปัจจุบัน (SEO Clean URL Version)
 * @param {Object} query - ข้อมูลฟิลเตอร์
 */
function updateUrlFromFilters(query) {
    try {
        // 1. สร้าง Path ที่สะอาดที่สุด (เช่น /location/chiangmai)
        let newUrl = '/';
        if (query.province && query.province !== 'all') {
            newUrl = `/location/${encodeURIComponent(query.province)}`;
        }
        
        // 2. อนุญาตให้ใส่เฉพาะการค้นหา (q) เท่านั้น ส่วนฟิลเตอร์อื่นๆ ให้เปลี่ยนแค่ UI หน้าจอ ไม่ต้องเปลี่ยน URL
        const params = new URLSearchParams();
        if (query.text) params.set('q', query.text); // ไม่ต้อง encodeURIComponent ซ้ำเพราะ URLSearchParams จัดการให้
        
        const paramsString = params.toString();
        if (paramsString) {
            newUrl = `${newUrl}?${paramsString}`;
        }
        
        // 3. อัปเดต URL โดยไม่ reload หน้า และไม่มี ?province= ขยะโผล่มาอีก
        if (window.location.pathname + window.location.search !== newUrl) {
            history.pushState({ 
                filters: query,
                timestamp: Date.now() 
            }, '', newUrl);
            
            console.log(`🌐 SEO URL Updated: ${newUrl}`);
        }
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการอัปเดต URL:', error);
    }
}

async function renderCardsIncrementally(container, profiles) {
    if (!container || !profiles) return;
    
    // ล้างเนื้อหาเดิมในกรณีที่เป็น Grid เปล่า
    container.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    // ถ้าโปรไฟล์เยอะ (เชียงใหม่) ให้วาดทีละ 4 ใบ เพื่อให้ UI ไม่ค้าง
    const BATCH_SIZE = profiles.length > 20 ? 4 : 8; 

    for (let i = 0; i < profiles.length; i++) {
        const card = createProfileCard(profiles[i], i);
        fragment.appendChild(card);

        // เมื่อครบชุด (Batch) หรือใบสุดท้าย ให้เอาลงหน้าจอ
        if ((i + 1) % BATCH_SIZE === 0 || i === profiles.length - 1) {
            container.appendChild(fragment);
            
            // 🟢 จุดสำคัญ: คืน Main Thread ให้ Browser ไปวาดรูปและรับคำสั่งจากผู้ใช้
            // ใช้ requestAnimationFrame เพื่อความนุ่มนวลสูงสุด
            await new Promise(resolve => requestAnimationFrame(resolve));
            
            // ถ้าข้อมูลเยอะมาก ให้หยุดพักเพิ่มอีกนิด (แก้ปัญหาเครื่องร้อน/ค้าง)
            if (profiles.length > 40) {
                await new Promise(resolve => setTimeout(resolve, 10));
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

// =================================================================
// ✅ CREATE PROFILE CARD (FIXED & OPTIMIZED)
// =================================================================
function createProfileCard(p, index = 20) {
    // 1. สร้าง Container หลัก
    const cardContainer = document.createElement('div');
    cardContainer.className = 'profile-card-new-container';

    // 2. สร้าง Card Inner (กรอบการ์ด)
    const cardInner = document.createElement('div');
    cardInner.className = 'profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-gray-200 dark:bg-gray-800 cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1';
    
    cardInner.setAttribute('data-profile-id', p.id); 
    cardInner.setAttribute('data-profile-slug', p.slug);
    
    // เตรียมข้อมูลรูปภาพ
    const imgSrc = (p.images && p.images.length > 0) ? p.images[0].src : '/images/placeholder-profile.webp';

    // เช็คสถานะ (ว่าง/ไม่ว่าง)
    let statusClass = 'status-inquire';
    const availability = (p.availability || '').toLowerCase();
    
    if (availability.includes('ว่าง') || availability.includes('รับงาน')) {
        statusClass = 'status-available';
    } else if (availability.includes('ไม่ว่าง') || availability.includes('พัก')) {
        statusClass = 'status-busy';
    }

    // เช็คการกดไลค์
    const likedProfiles = JSON.parse(localStorage.getItem('liked_profiles') || '{}');
    const isLikedClass = likedProfiles[p.id] ? 'liked' : '';
    const likeCount = p.likes || 0;

    // 3. 🟢 รวม HTML ทั้งหมดไว้ในตัวแปรเดียว (แก้ปัญหาประกาศตัวแปรซ้ำ)
    cardInner.innerHTML = `
        <!-- Layer 0: Skeleton Loader & Image -->
        <div class="skeleton-loader absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse z-0"></div>
        <img src="${imgSrc}" 
             alt="น้อง${p.name} - ไซด์ไลน์${p.provinceNameThai || 'เชียงใหม่'}"
             class="card-image w-full h-full object-cover transition-opacity duration-700 opacity-0 absolute inset-0 z-0"
             loading="${index < 4 ? 'eager' : 'lazy'}"
             width="300" height="400"
             onload="this.classList.remove('opacity-0'); if(this.previousElementSibling) this.previousElementSibling.remove();"
             onerror="this.src='/images/placeholder-profile.webp'; this.classList.remove('opacity-0');">
             
        <!-- Layer 1: Badges (มุมขวาบน) -->
        <div class="absolute top-2 right-2 flex flex-col gap-1 items-end z-20 pointer-events-none">
            <span class="availability-badge ${statusClass} shadow-md backdrop-blur-md bg-white/10 border border-white/20 text-[10px] font-bold px-2 py-1 rounded-full text-white">
                ${p.availability || 'สอบถาม'}
            </span>
            ${p.isfeatured ? '<span class="featured-badge bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm"><i class="fas fa-star mr-1"></i>แนะนำ</span>' : ''}
        </div>

        <!-- Layer 2: Link หลักคลุมการ์ด (อยู่ใต้ปุ่มหัวใจ) -->
        <a href="/sideline/${p.slug}" class="card-link absolute inset-0 z-10" aria-labelledby="profile-name-${p.id}" tabindex="-1"></a>

        <!-- Layer 3: Overlay & Content -->
        <div class="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-between pointer-events-none" 
             style="z-index: 20;">
            
            <div class="card-header mt-8"></div>
            
            <div class="card-footer-content pointer-events-auto">
                <h3 id="profile-name-${p.id}" class="text-lg font-bold text-white drop-shadow-md leading-tight truncate pr-2">${p.name}</h3>
                <p class="text-xs text-gray-300 flex items-center mt-0.5 mb-2">
                    <i class="fas fa-map-marker-alt mr-1 text-pink-500"></i> ${p.provinceNameThai || 'เชียงใหม่'}
                </p>

                <div class="flex justify-between items-end border-t border-white/10 pt-2">
                    <div class="date-stamp text-[10px] text-gray-400">
                        อัปเดต: ${formatDate(p.created_at)}
                    </div>
                    
                    <!-- Layer 4: ปุ่มหัวใจ (Z-Index สูงสุด เพื่อให้กดติดแน่นอน) -->
                    <div class="like-button-wrapper relative flex items-center gap-1.5 text-white cursor-pointer group/like ${isLikedClass} hover:text-pink-400 transition-colors"
                         style="pointer-events: auto !important; z-index: 50 !important; position: relative;"
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

    cardContainer.appendChild(cardInner);
    return cardContainer;
}

// =================================================================
// ✅ [ฉบับแก้ไขสมบูรณ์] - fetchSingleProfile (ไร้ alert() + Debug Friendly)
// =================================================================
async function fetchSingleProfile(slug) {
    if (!supabase) {
        console.error("❌ Supabase Error: ไม่สามารถติดต่อฐานข้อมูลได้");
        return null;
    }
    
    // ไม่มีการใช้ alert() เพื่อไม่ให้กวนใจผู้ใช้
    // console.log("🔍 ระบบกำลังหาข้อมูลโปรไฟล์สำหรับ slug: " + slug);

    try {
        // 1. ลองหาโปรไฟล์ด้วย Slug ตรงตัวก่อน
        let { data, error } = await supabase
            .from('profiles')
            .select('*, provinces(key, nameThai)') // ดึงข้อมูลจังหวัดมาด้วย
            .eq('slug', slug)
            .maybeSingle(); // คาดหวังผลลัพธ์เดียว

        if (error && error.code !== 'PGRST116') { // PGRST116 = ไม่พบข้อมูล
            console.error('❌ Supabase Fetch by Slug Failed:', error.message);
            // ถ้าเป็น error จริงจัง ให้แสดง error ใน console
        }
        
        if (data) {
            // console.log("✅ พบโปรไฟล์ด้วย Slug:", data.name);
            return processProfileData(data);
        }

        // 2. ถ้าไม่พบด้วย Slug ตรงตัว ให้ลองแกะ ID จากท้าย URL
        const parts = slug.split('-');
        const potentialId = parts[parts.length - 1]; // ค่าสุดท้ายของ slug (อาจเป็น ID)
        
        // console.log("⚠️ ไม่พบโปรไฟล์ด้วย Slug ตรงตัว ลองแกะ ID จาก: " + potentialId);

        // ตรวจสอบว่าเป็นตัวเลขหรือไม่ และไม่ให้เป็นค่าว่าง
        if (potentialId && !isNaN(potentialId) && potentialId.trim() !== '') {
            const profileId = parseInt(potentialId);

            const { data: byIdData, error: byIdError } = await supabase
                .from('profiles')
                .select('*, provinces(key, nameThai)')
                .eq('id', profileId)
                .maybeSingle(); // คาดหวังผลลัพธ์เดียว

            if (byIdError && byIdError.code !== 'PGRST116') {
                console.error('❌ Supabase Fetch by ID Failed:', byIdError.message);
            }

            if (byIdData) {
                // console.log("✅ พบโปรไฟล์ด้วย ID:", byIdData.name);
                return processProfileData(byIdData);
            } else {
                console.warn("❌ ไม่พบโปรไฟล์ในฐานข้อมูลด้วย ID:", profileId);
            }
        } else {
            console.warn("❌ รูปแบบ URL slug ไม่ถูกต้อง หรือไม่สามารถหา ID ที่ถูกต้องได้");
        }
        
        // ถ้าไม่พบโปรไฟล์ไม่ว่าจะด้วยวิธีใด ให้คืนค่า null
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

        const cleanup = () => {
            dom.lightbox.classList.add('hidden');
            document.body.style.overflow = ''; // คืนค่า Scroll ให้เลื่อนได้ปกติ
            
            // ✅ Fix: โฟกัสกลับที่เดิมโดย "ห้าม Scroll" (preventScroll: true)
            if (state.lastFocusedElement) {
                try {
                    state.lastFocusedElement.focus({ preventScroll: true });
                } catch (e) { /* browser might not support options */ }
            }
        };

        if (animate) {
            gsap.to(dom.lightbox, { opacity: 0, pointerEvents: 'none', duration: 0.2 });
            gsap.to(dom.lightboxWrapper, { 
                scale: 0.95, opacity: 0, duration: 0.2, 
                onComplete: () => {
                    dom.lightbox.style.opacity = '0'; // ซ่อนให้ชัวร์
                    cleanup();
                }
            });
        } else {
            dom.lightbox.style.opacity = '0';
            cleanup();
        }
    }

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
        let text = p.availability || 'สอบถาม';
        
        if (text.includes('ว่าง') || text.includes('รับงาน')) {
            statusClass = 'status-available';
            icon = '<i class="fas fa-check-circle"></i>';
        } else if (text.includes('ไม่ว่าง')) {
            statusClass = 'status-busy';
            icon = '<i class="fas fa-times-circle"></i>';
        }
        
        // ปรับ Badge ให้ดู Modern ขึ้น
        els.avail.innerHTML = `
            <div class="lb-status-badge ${statusClass}" style="padding: 6px 16px; border-radius: 50px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                ${icon} <span>${text}</span>
            </div>`;
    }

    // --- 3. Image Gallery ---
    if (els.hero) {
        els.hero.src = p.images?.[0]?.src || '/images/placeholder-profile.webp';
        els.hero.alt = p.altText || `รูปโปรไฟล์ ${p.name}`;
        // เพิ่ม Filter ให้รูปมืดลงนิดหน่อย เพื่อให้ตัวหนังสือขาวเด้งขึ้น
        els.hero.style.filter = "brightness(0.85)"; 
    }
    
    // จัดการ Thumbnail (เหมือนเดิม)
    if (els.thumbs) {
        els.thumbs.innerHTML = '';
        const hasGallery = p.images && p.images.length > 1;
        if (hasGallery) {
            const fragment = document.createDocumentFragment();
            p.images.forEach((img, i) => {
                const thumb = document.createElement('img');
                thumb.className = `thumbnail ${i === 0 ? 'active' : ''}`;
                thumb.src = img.src;
                thumb.style.cssText = "width: 50px; height: 50px; border-radius: 10px; object-fit: cover; cursor: pointer; border: 2px solid transparent; transition: all 0.2s;";
                if(i===0) thumb.style.borderColor = "#ec4899";
                
                thumb.onclick = () => {
                    if (els.hero) els.hero.src = img.src;
                    Array.from(els.thumbs.children).forEach(c => c.style.borderColor = "transparent");
                    thumb.style.borderColor = "#ec4899";
                };
                fragment.appendChild(thumb);
            });
            els.thumbs.appendChild(fragment);
            els.thumbs.style.display = 'flex';
            els.thumbs.style.gap = '8px';
            els.thumbs.style.justifyContent = 'center';
            els.thumbs.style.padding = '10px 0';
        } else {
            els.thumbs.style.display = 'none';
        }
    }

    // --- 4. Style Tags ---
    if (els.tags) {
        els.tags.innerHTML = '';
        if (Array.isArray(p.styleTags) && p.styleTags.length > 0) {
            p.styleTags.forEach(t => {
                if (t && t.trim()) {
                    const span = document.createElement('span');
                    // ปรับ Tag ให้ดูเรียบหรู
                    span.style.cssText = "background: rgba(255, 255, 255, 0.1); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px);";
                    span.textContent = t.trim();
                    els.tags.appendChild(span);
                }
            });
            els.tags.style.display = 'flex';
            els.tags.style.flexWrap = 'wrap';
            els.tags.style.gap = '8px';
        } else {
            els.tags.style.display = 'none';
        }
    }

    // --- 5. รายละเอียด (ส่วนที่แก้ให้อ่านง่าย) ---
    if (els.detailsContainer) {
        const provinceName = state.provincesMap.get(p.provinceKey) || '';
        const fullLocation = [provinceName, p.location].filter(Boolean).join(' ').trim();
        const formattedDate = formatDate(p.lastUpdated || p.created_at);

        // สร้างกล่องครอบข้อมูล (Glassmorphism)
        let detailsHTML = `
            <div style="background: rgba(30, 30, 30, 0.6); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 12px;">
                        <div style="font-size: 10px; color: #aaa;">อายุ</div>
                        <div style="font-size: 16px; font-weight: bold; color: #fff;">${p.age || '-'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 12px;">
                        <div style="font-size: 10px; color: #aaa;">สัดส่วน</div>
                        <div style="font-size: 16px; font-weight: bold; color: #fff;">${p.stats || '-'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 12px;">
                        <div style="font-size: 10px; color: #aaa;">สูง/หนัก</div>
                        <div style="font-size: 16px; font-weight: bold; color: #fff;">${p.height||'-'}/${p.weight||'-'}</div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                        <span style="color: #ccc;"><i class="fas fa-map-marker-alt text-pink-500 mr-2"></i>พิกัด</span>
                        <span style="color: #fff; font-weight: 500;">${fullLocation}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                        <span style="color: #ccc;"><i class="fas fa-tag text-green-400 mr-2"></i>เรทราคา</span>
                        <span style="color: #4ade80; font-weight: bold; font-size: 16px;">${p.rate || 'สอบถาม'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                         <span style="color: #ccc;"><i class="fas fa-clock text-blue-400 mr-2"></i>อัปเดต</span>
                        <span style="color: #eee;">${formattedDate}</span>
                    </div>
                </div>
            </div>
        `;
        els.detailsContainer.innerHTML = detailsHTML;
    }

    // --- 6. Description (เนื้อหาที่พี่บ่นว่าอ่านไม่เห็น) ---
    if (els.descContainer && els.descContent) {
        if (p.description) {
            // ใส่ Background สีดำจางๆ ให้ข้อความอ่านออกแน่นอน 100%
            els.descContent.style.cssText = "color: #e5e7eb; font-size: 15px; line-height: 1.6; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);";
            els.descContent.innerHTML = p.description.replace(/\n/g, '<br>');
            els.descContainer.style.display = 'block';
        } else {
            els.descContainer.style.display = 'none';
        }
    }

    // --- 7. LINE Button (แก้ให้ดูแพง ไม่บ้านนอก) ---
    const oldWrapper = document.getElementById('line-btn-sticky-wrapper');
    if (oldWrapper) oldWrapper.remove();
    
    if (p.lineId && els.lineBtnContainer) {
        const wrapper = document.createElement('div');
        wrapper.id = 'line-btn-sticky-wrapper';
        
        // ทำให้ปุ่มลอย (Floating) สวยๆ ไม่ใช่แถบยาวเต็มจอ
        wrapper.style.cssText = `
            position: sticky;
            bottom: 20px;
            width: 100%;
            display: flex;
            justify-content: center;
            z-index: 50;
            pointer-events: none; /* ให้คลิกทะลุพื้นที่ว่างได้ */
            margin-top: 20px;
        `;

        const autoMessage = `สนใจน้อง ${p.name} เห็นจากเว็บ Sideline Chiangmai ครับ`;
        let finalLineUrl = p.lineId.startsWith('http') ? p.lineId : `https://line.me/ti/p/~${p.lineId}`;

        const link = document.createElement('a');
        // ปุ่มทรงแคปซูล เงาสวยๆ สีเขียว LINE แท้
        link.style.cssText = `
            pointer-events: auto;
            display: flex;
            align-items: center;
            gap: 10px;
            background: #06C755;
            color: white;
            padding: 12px 32px;
            border-radius: 100px;
            font-size: 16px;
            font-weight: 700;
            text-decoration: none;
            box-shadow: 0 10px 25px -5px rgba(6, 199, 85, 0.6);
            transition: transform 0.2s, box-shadow 0.2s;
            backdrop-filter: blur(5px);
        `;
        
        link.innerHTML = `<i class="fab fa-line" style="font-size: 24px;"></i> <span>แอดไลน์ ${p.name}</span>`;

        // Animation กดแล้วยุบ
        link.onmousedown = () => link.style.transform = "scale(0.95)";
        link.onmouseup = () => link.style.transform = "scale(1)";

        link.onclick = (e) => {
            e.preventDefault();
            if (navigator.clipboard) navigator.clipboard.writeText(autoMessage);
            
            // Popup แบบ Luxury (เลิกใช้ alert)
            const modal = document.createElement('div');
            modal.style.cssText = "position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s;";
            modal.innerHTML = `
                <div style="background: white; width: 90%; max-width: 320px; border-radius: 24px; padding: 30px 20px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
                    <div style="width: 60px; height: 60px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px;">
                        <i class="fas fa-check"></i>
                    </div>
                    <h3 style="color: #111827; font-size: 20px; font-weight: 800; margin-bottom: 8px;">บันทึกชื่อน้องแล้ว!</h3>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">กด <b>"วาง" (Paste)</b> ในแชทได้เลยครับ</p>
                    <a href="${finalLineUrl}" id="real-line-btn" style="display: block; width: 100%; background: #06C755; color: white; padding: 14px; border-radius: 16px; font-weight: bold; text-decoration: none;">เปิด LINE เดี๋ยวนี้</a>
                    <button id="close-popup" style="margin-top: 15px; background: transparent; border: none; color: #9ca3af; font-size: 13px;">ปิดหน้าต่าง</button>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('#real-line-btn').onclick = () => setTimeout(() => modal.remove(), 1000);
            modal.querySelector('#close-popup').onclick = () => modal.remove();
            modal.onclick = (ev) => { if(ev.target === modal) modal.remove(); };
        };

        wrapper.appendChild(link);
        els.lineBtnContainer.appendChild(wrapper);
    }
}

// ==========================================
// 💎 SEO STRATEGIC POOL (คลังคำศัพท์ LSI)
// ==========================================
const SEO_POOL = {
    styles:[
        "ฟิวแฟนแท้ๆ", "งานเนี๊ยบดูแลดี", "สายหวานคุยสนุก", 
        "เอาใจเก่งสุดๆ", "สไตล์นางแบบ", "น่ารักขี้อ้อน", 
        "งานเอนเตอร์เทน", "คุยเก่งไม่เดดแอร์"
    ],
    trust:[
        "ไม่ต้องโอนก่อน", "ไม่มีมัดจำล่วงหน้า", "ไม่โอนจอง", 
        "จ่ายหน้างาน 100%", "นัดเจอจ่ายสด", "ปลอดภัยไร้กังวล"
    ],
    guarantee:[
        "ตัวจริงตรงรูป 100%", "รูปปัจจุบันไม่จกตา", "การันตีความสวย", 
        "ตรงปกไม่ผิดหวัง", "คัดงานคุณภาพ", "รับประกันความตรงปก"
    ],
    pick: function(group) {
        return this[group][Math.floor(Math.random() * this[group].length)];
    }
};

// =================================================================
// 10. SEO META TAGS UPDATER (ULTIMATE PERFECT VERSION)
// =================================================================

// 🛡️ ตัวแปรช่วยป้องกันการทับข้อมูลของ SSR ในการโหลดหน้าครั้งแรก
let isFirstLoad = true;

// 🧹 ฟังก์ชันล้าง Schema เก่าทิ้งทุกครั้งที่เปลี่ยนหน้า (แก้บั๊ก Schema พอกหางหมู)
function clearAllDynamicSchemas() {
    const schemaIds =[
        'schema-jsonld-person', 'schema-jsonld-list', 'schema-jsonld-faq', 
        'schema-jsonld-breadcrumb', 'schema-jsonld-org', 'schema-jsonld-website'
    ];
    schemaIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });
}

function updateAdvancedMeta(profile = null, pageData = null) {
    // 1. ถ้าเป็นการโหลดครั้งแรกสุด ปล่อยให้ SSR ทำงานไป ไม่ต้องเอา JS ไปกวน
    if (isFirstLoad) {
        console.log("SEO: First load detected. Using SSR Metadata.");
        isFirstLoad = false;
        return; 
    }

    const currentPath = window.location.pathname.toLowerCase();
    const isRoot = currentPath === '/' || currentPath === '' || currentPath === '/index.html';
    const isDynamic = profile || pageData;

    // เคลียร์ Schema เก่าทิ้งก่อนเริ่มสร้างใหม่
    clearAllDynamicSchemas();

    // เตรียมตัวแปรพื้นฐาน
    const YEAR_TH = new Date().getFullYear() + 543;
    const thaiMonths =["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const d = new Date();
    const CURRENT_DATE = `${d.getDate()} ${thaiMonths[d.getMonth()]} ${YEAR_TH}`;

    const getCleanName = (rawName) => {
        if (!rawName) return "";
        let name = rawName.trim().replace(/^(น้อง\s?)/, '');
        return `น้อง${name.charAt(0).toUpperCase() + name.slice(1)}`;
    };

    // ==========================================
    // CASE A: หน้าโปรไฟล์น้องๆ
    // ==========================================
    if (profile) {
        const displayName = getCleanName(profile.name);
        const province = profile.provinceNameThai || 'เชียงใหม่';
        const priceInfo = profile.rate ? `ราคา ${profile.rate}` : 'สอบถามราคา';
        const workArea = profile.location ? `${profile.location}, ${province}` : province;
        const profileUrl = `${CONFIG.SITE_URL}/sideline/${profile.slug || profile.id}`;
        const provinceUrl = `${CONFIG.SITE_URL}/location/${profile.provinceKey || 'chiangmai'}`;
        
        let statsParts =[];
        if (profile.stats) statsParts.push(`สัดส่วน ${profile.stats}`);
        if (profile.age) statsParts.push(`อายุ ${profile.age}`);
        const detailsSnippet = statsParts.join('. '); 

        const t = SEO_POOL.pick('trust');
        const g = SEO_POOL.pick('guarantee');

        const finalTitle = `${displayName} รับงานไซด์ไลน์${province} | ${g} ${t} (${YEAR_TH})`;
        const finalDesc = `โปรไฟล์ ${displayName} สำหรับรับงานไซด์ไลน์ในพื้นที่ ${workArea}. ${priceInfo}. ${detailsSnippet}. ${g} และ ${t} 100%. ปลอดภัย จ่ายเงินหน้างาน. (อัปเดต ${CURRENT_DATE})`;

        document.title = finalTitle;
        updateMeta('description', finalDesc);
        updateMeta('keywords', `${displayName}, ไซด์ไลน์${province}, รับงาน${province}`);
        updateLink('canonical', profileUrl);
        
        updateOpenGraphMeta(profile, finalTitle, finalDesc, 'profile');
        
        // 🚀 ฝัง Schema คู่ (Person + Breadcrumb)
        injectSchema(generatePersonSchema(profile, finalDesc, province), 'schema-jsonld-person');
        injectSchema(generateBreadcrumbSchema([
            { name: "หน้าแรก", url: CONFIG.SITE_URL },
            { name: `ไซด์ไลน์${province}`, url: provinceUrl },
            { name: displayName, url: profileUrl }
        ]), 'schema-jsonld-breadcrumb');
    }

    // ==========================================
    // CASE B: หน้าจังหวัด
    // ==========================================
    else if (pageData) {
        const province = pageData.provinceName || 'เชียงใหม่';
        const pageUrl = pageData.canonicalUrl || window.location.href;
        const pageTitle = `ไซด์ไลน์${province} รับงานเอง ตรงปก (${YEAR_TH})`;
        const pageDesc = `รวมน้องๆ ไซด์ไลน์${province} รับงานเอง พิกัด${province}. อัปเดตล่าสุด ${CURRENT_DATE}. ปลอดภัย ไม่มัดจำ.`;

        document.title = pageTitle;
        updateMeta('description', pageDesc);
        updateLink('canonical', pageUrl);
        updateOpenGraphMeta(null, pageTitle, pageDesc, 'website');
        
        // 🚀 ฝัง Schema คู่ (Listing + Breadcrumb)
        injectSchema(generateListingSchema(pageData), 'schema-jsonld-list');
        injectSchema(generateBreadcrumbSchema([
            { name: "หน้าแรก", url: CONFIG.SITE_URL },
            { name: `ไซด์ไลน์${province}`, url: pageUrl }
        ]), 'schema-jsonld-breadcrumb');
    } 
    
    // ==========================================
    // CASE C: หน้าแรก (Home)
    // ==========================================
    else if (isRoot) {
        const GLOBAL_TITLE = `ไซด์ไลน์เชียงใหม่ รับงานไม่มัดจำ ฟิวแฟนตรงปก (${YEAR_TH})`;
        const GLOBAL_DESC = `เว็บไซต์อันดับ 1 รวมไซด์ไลน์เชียงใหม่ และจังหวัดอื่นๆ ทั่วประเทศ. รับงานเอง ไม่ผ่านเอเย่นต์ ไม่ต้องโอนมัดจำ ปลอดภัย 100%`;

        document.title = GLOBAL_TITLE;
        updateMeta('description', GLOBAL_DESC);
        updateLink('canonical', CONFIG.SITE_URL);
        updateOpenGraphMeta(null, GLOBAL_TITLE, GLOBAL_DESC, 'website');
        
        // 🚀 ฝัง Schema ชุดใหญ่สำหรับหน้าแรก
        injectSchema(generateWebsiteSchema(), 'schema-jsonld-website');
        injectSchema(generateOrganizationSchema(), 'schema-jsonld-org');
        injectSchema(generateFAQPageSchema([
            { question: "ต้องโอนมัดจำไหม?", answer: "ไม่ต้องค่ะ แพลตฟอร์มเราให้จ่ายเงินสดหน้างาน 100% เพื่อความปลอดภัย" },
            { question: "การันตีตรงปกไหม?", answer: "เรารับประกันตัวจริงตรงรูป 100% ถ้านัดเจอแล้วไม่ตรงปก สามารถยกเลิกได้ทันทีไม่มีค่าใช้จ่าย" }
        ]), 'schema-jsonld-faq');
    }
}

// =================================================================
// HELPER FUNCTIONS & SCHEMAS (OPTIMIZED FOR SEO & SOCIAL)
// =================================================================

function updateOpenGraphMeta(profile, title, description, type) {
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:url', profile ? `${CONFIG.SITE_URL}/sideline/${profile.slug}` : CONFIG.SITE_URL);
    updateMeta('og:type', type); 
    updateMeta('og:locale', 'th_TH'); 
    updateMeta('og:site_name', 'Sideline Chiangmai'); 
    
    let imageUrl = (profile && profile.images && profile.images[0]) 
                    ? profile.images[0].src 
                    : CONFIG.DEFAULT_OG_IMAGE;
    
    updateMeta('og:image', imageUrl);
    updateMeta('og:image:secure_url', imageUrl); 
    updateMeta('og:image:width', '800');
    updateMeta('og:image:height', '600');
    updateMeta('og:image:alt', title);

    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', imageUrl);
}

function generatePersonSchema(p, descriptionOverride, provinceName) {
    if (!p) return null;
    const priceNumeric = (p.rate || "0").toString().replace(/\D/g, '');
    let cleanName = (p.name || '').replace(/^น้อง/, '').trim();
    const profileUrl = `${CONFIG.SITE_URL}/sideline/${p.slug}`;
    const imageUrl = (p.images && p.images[0]) ? p.images[0].src : CONFIG.DEFAULT_OG_IMAGE;

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": profileUrl,
        "name": `น้อง${cleanName}`,
        "url": profileUrl,
        "image": imageUrl,
        "description": descriptionOverride || p.description || "",
        "jobTitle": "Freelance Model",
        "gender": "Female",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": provinceName || "Chiang Mai",
            "addressRegion": "Thailand",
            "addressCountry": "TH"
        },
        "offers": {
            "@type": "Offer",
            "url": profileUrl,
            "price": priceNumeric,
            "priceCurrency": "THB",
            "availability": p.availability?.includes('ไม่ว่าง') ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            "description": "ชำระเงินหน้างานเท่านั้น ไม่มีมัดจำ"
        },
        "additionalProperty":[
            { "@type": "PropertyValue", "name": "Age", "value": p.age || "-" },
            { "@type": "PropertyValue", "name": "Stats", "value": p.stats || "-" },
            { "@type": "PropertyValue", "name": "Height", "value": p.height || "-" },
            { "@type": "PropertyValue", "name": "SkinTone", "value": p.skinTone || "-" },
            { "@type": "PropertyValue", "name": "Province", "value": provinceName }
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
            "acceptedAnswer": { "@type": "Answer", "text": item.answer }
        }))
    };
}

// 🚀 อัปเกรดตัวสร้าง Breadcrumb ให้รองรับ Array (ยืดหยุ่น 100%)
function generateBreadcrumbSchema(items) {
    if (!items || items.length === 0) return null;
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
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
        "logo": `${CONFIG.SITE_URL}/images/sidelinechiangmai-social-preview.webp`,
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "description": "มีแอดมินดูแลฟรีตลอดเวลาทำการ"
        }
    };
}

function injectSchema(json, id = 'schema-jsonld') {
    if (!json) return;
    const oldScript = document.getElementById(id);
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(json);
    document.head.appendChild(script);
}

function updateMeta(propertyOrName, content) {
    let el = document.querySelector(`meta[name="${propertyOrName}"], meta[property="${propertyOrName}"]`);
    if (!el) {
        el = document.createElement('meta');
        if (propertyOrName.startsWith('og:') || propertyOrName.startsWith('twitter:')) {
            el.setAttribute('property', propertyOrName);
        } else {
            el.setAttribute('name', propertyOrName);
        }
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function updateLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) { 
        el = document.createElement('link'); 
        el.setAttribute('rel', rel); 
        document.head.appendChild(el); 
    }
    el.setAttribute('href', href);
}

function updateResultCount(count, total, isFiltering) {
    if (!dom.resultCount) return;
    const formattedCount = count.toLocaleString();
    if (count > 0) {
        dom.resultCount.innerHTML = `✅ พบ <span class="font-bold text-pink-600">${formattedCount}</span> โปรไฟล์${isFiltering ? '' : ''}`;
        dom.resultCount.classList.remove('hidden', 'no-results');
        dom.resultCount.style.display = 'block';
    } else {
        dom.resultCount.innerHTML = '❌ ไม่พบโปรไฟล์ตามเงื่อนไข';
        dom.resultCount.classList.add('no-results');
        dom.resultCount.classList.remove('hidden');
        dom.resultCount.style.display = 'block';
    }
}

// =================================================================
// 🚀 PREMIUM UI & EFFECT FUNCTIONS (ฉบับอัปเกรดความเร็วและโหมดมืด)
// =================================================================

    // ✅ 1. 3D Card Effect: เพิ่มความพรีเมียม (ทำงานเฉพาะบนคอมพิวเตอร์เพื่อประหยัดแบตมือถือ)
    function init3dCardHoverDelegate() {
        if (window.innerWidth < 1024) return; // ข้ามถ้าเป็นมือถือ

        document.body.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.profile-card-new');
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // คำนวณองศาการเอียง
            const rotateX = (centerY - y) / 15;
            const rotateY = (x - centerX) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease-out';
        });

        document.body.addEventListener('mouseout', (e) => {
            const card = e.target.closest('.profile-card-new');
            if (card) {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.5s ease-out';
            }
        });
    }

    // ✅ 2. Header Scroll Effect: ปรับให้เนียนตาแบบ Glassmorphism
    function initHeaderScrollEffect() {
        if (!dom.pageHeader) return;
        
        const updateHeader = () => {
            const isScrolled = window.scrollY > 20;
            dom.pageHeader.classList.toggle('scrolled', isScrolled);
            
            // ปรับแต่งสไตล์ผ่าน JS เพื่อความรวดเร็ว
            if (isScrolled) {
                dom.pageHeader.style.backgroundColor = 'rgba(15, 23, 42, 0.9)'; // สีเข้มโปร่งแสง
                dom.pageHeader.style.backdropFilter = 'blur(12px)';
                dom.pageHeader.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            } else {
                dom.pageHeader.style.backgroundColor = 'transparent';
                dom.pageHeader.style.backdropFilter = 'none';
                dom.pageHeader.style.boxShadow = 'none';
            }
        };

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader(); // รันครั้งแรกทันที
    }

    // ✅ 3. Scroll Animations: ใช้คะแนน Performance สูงสุด
    function initScrollAnimations() {
        const els = document.querySelectorAll('[data-animate-on-scroll]');
        if (!els.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        els.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
            obs.observe(el);
        });
    }

    // ✅ 4. Social Marquee: แก้บั๊กกระตุกและเพิ่มความลื่นไหลด้วย GPU
    function initMarqueeEffect() {
        const marquee = document.querySelector('.social-marquee');
        if (!marquee || marquee.dataset.initialized) return;

        marquee.dataset.initialized = "true";
        marquee.innerHTML += marquee.innerHTML; // คัดลอกเนื้อหาเพื่อทำ Loop

        let scroll = 0;
        let speed = 0.6; // ความเร็วที่อ่านง่ายพอดี
        let isHover = false;

        const loop = () => {
            if (!isHover) {
                scroll -= speed;
                if (Math.abs(scroll) >= marquee.scrollWidth / 2) {
                    scroll = 0;
                }
                marquee.style.transform = `translate3d(${scroll}px, 0, 0)`;
            }
            requestAnimationFrame(loop);
        };

        marquee.parentElement.addEventListener('mouseenter', () => isHover = true);
        marquee.parentElement.addEventListener('mouseleave', () => isHover = false);
        loop();
    }

    // ✅ 5. Theme Toggle: ตั้งค่า Dark Mode เป็น Default + สลับไอคอน Sun/Moon
    function initThemeToggle() {
        const btns = document.querySelectorAll('.theme-toggle-btn');
        const icons = document.querySelectorAll('.theme-toggle-icon');

        const apply = (theme) => {
            const isDark = theme === 'dark';
            document.documentElement.classList.toggle('dark', isDark);
            localStorage.setItem(CONFIG.KEYS.THEME, theme);

            // สลับไอคอนอัตโนมัติ
            icons.forEach(icon => {
                if (isDark) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                } else {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            });
        };

        // 🚨 เริ่มต้นที่ DARK MODE (ถ้ายังไม่เคยเลือก)
        const saved = localStorage.getItem(CONFIG.KEYS.THEME) || 'dark';
        apply(saved);

        btns.forEach(b => {
            b.onclick = () => {
                const current = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
                apply(current);
            };
        });
    }

    // ✅ 6. Mobile Menu: ปรับปรุงการล็อค Scroll ให้สมบูรณ์
    function initMobileMenu() {
        const btn = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('menu-backdrop');
        const close = document.getElementById('close-sidebar-btn');
        
        if (!btn || !sidebar) return;

        const toggle = (open) => {
            sidebar.classList.toggle('translate-x-full', !open);
            if (backdrop) {
                backdrop.classList.toggle('hidden', !open);
                setTimeout(() => backdrop.style.opacity = open ? '1' : '0', 10);
            }
            // ล็อค Scroll หน้าเว็บไม่ให้ขยับตอนเปิดเมนู
            document.body.style.overflow = open ? 'hidden' : '';
            document.body.style.touchAction = open ? 'none' : '';
        };

        btn.onclick = () => toggle(true);
        if (close) close.onclick = () => toggle(false);
        if (backdrop) backdrop.onclick = () => toggle(false);
        
        // ปิดเมนูอัตโนมัติเมื่อกดลิงก์
        sidebar.querySelectorAll('a').forEach(link => {
            link.onclick = () => toggle(false);
        });
    }

// ==========================================
// ✨ UPGRADED: VIP AGE GATE (SEO & LUXURY VERSION)
// ==========================================
function initAgeVerification() {
    // 1. 🛡️ SEO Safe Guard: ตรวจสอบ Bot 
    // ถ้าเป็น Googlebot จะไม่สร้าง Overlay เพื่อให้คะแนน SEO พุ่งกระฉูด
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|ia_archiver|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|quora\ link\ preview|outbrain|pinterest\/0\.|vkShare|W3C_Validator/i.test(navigator.userAgent);

    if (isBot) {
        console.log("🚀 SEO Mode: Search Engine detected. Access granted without overlay.");
        return; 
    }

    // 2. ตรวจสอบการยืนยันตัวตนจาก LocalStorage
    const ts = localStorage.getItem(CONFIG.KEYS.AGE_CONFIRMED);
    if (ts && (Date.now() - parseInt(ts)) < 3600000) return;

    // 3. สร้างระบบยืนยันอายุ (VIP UI)
    const div = document.createElement('div');
    div.id = 'age-verification-overlay';
    
    // CSS จัดการ Layout เต็มหน้าจอ
    div.style.cssText = "position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; overflow: hidden;";
    
    div.innerHTML = `
        <div style="position: absolute; inset: 0; background-image: url('/images/placeholder-profile.webp'); background-size: cover; background-position: center; filter: blur(30px); opacity: 0.3; transform: scale(1.1);"></div>
        <div style="position: absolute; inset: 0; background-color: rgba(0, 0, 0, 0.85); backdrop-filter: blur(15px);"></div>

        <div style="position: relative; z-index: 10; width: 100%; max-width: 420px; margin: 16px;">
            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); backdrop-filter: blur(25px); border-radius: 32px; padding: 48px 32px; box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8); text-align: center; overflow: hidden; position: relative;">
                
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, #ec4899, #9333ea, transparent); opacity: 0.8;"></div>
                
                <div style="margin-bottom: 32px;">
                    <p style="font-size: 12px; color: #ec4899; text-transform: uppercase; letter-spacing: 4px; font-weight: 800; margin-bottom: 8px;">Welcome To</p>
                    <h2 style="font-size: 32px; font-weight: 900; color: #ffffff; margin-bottom: 20px; letter-spacing: -1px;">Sideline Chiangmai</h2>
                    
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 68px; border-radius: 9999px; background-color: rgba(236, 72, 153, 0.1); margin-bottom: 20px; border: 1px solid rgba(236, 72, 153, 0.4); box-shadow: 0 0 25px rgba(236, 72, 153, 0.2);">
                        <span style="font-size: 22px; font-weight: 900; color: #ec4899;">20+</span>
                    </div>
                    
                    <h3 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">พื้นที่ส่วนบุคคล (VIP ONLY)</h3>
                    <p style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                        เว็บไซต์นี้จัดหาเนื้อหาสำหรับผู้ใหญ่<br>
                        <span style="color: #d1d5db;">กรุณายืนยันว่าคุณมีอายุ 20 ปีบริบูรณ์เพื่อเข้าชม</span>
                    </p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 14px;">
                    <button id="age-confirm" style="width: 100%; padding: 18px; background: linear-gradient(90deg, #ec4899, #9333ea); color: white; font-weight: 800; border-radius: 16px; border: none; cursor: pointer; font-size: 16px; box-shadow: 0 10px 20px -5px rgba(236, 72, 153, 0.5); transition: all 0.3s ease;">ยืนยันอายุ (ENTER SITE)</button>
                    <button id="age-reject" style="width: 100%; padding: 10px; background: transparent; color: #6b7280; font-size: 13px; border-radius: 12px; border: none; cursor: pointer; opacity: 0.8; hover:opacity: 1;">ออกจากเว็บไซต์ (Exit)</button>
                </div>
                
                <p style="margin-top: 24px; font-size: 10px; color: #4b5563; text-transform: uppercase; letter-spacing: 1px;">Premium Entertainment • Chiang Mai Thailand</p>
            </div>
        </div>
    `;

    document.body.appendChild(div);
    document.body.style.overflow = 'hidden';

    // Animation Effect (GSAP)
    const card = div.querySelector('div[style*="background: rgba"]'); 
    if (window.gsap) {
        gsap.from(card, { 
            scale: 0.9, 
            opacity: 0, 
            duration: 1.2, 
            ease: "expo.out" 
        });
    }

    // ปุ่มยืนยัน
    document.getElementById('age-confirm').onclick = () => {
        localStorage.setItem(CONFIG.KEYS.AGE_CONFIRMED, Date.now());
        if (window.gsap) {
            gsap.to(div, { 
                opacity: 0, 
                duration: 0.6, 
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

    // ปุ่มออก
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