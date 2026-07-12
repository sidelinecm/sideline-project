
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs';

gsap.registerPlugin(ScrollTrigger);

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

(function () {
    'use strict';

    const CONFIG = {
        SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
        STORAGE_BUCKET: 'profile-images',
        KEYS: {
            LAST_PROVINCE: 'sidelinecm_last_province',
            CACHE_PROFILES: 'cachedProfiles_v2',   
            CACHE_PROVINCES: 'cachedProvinces_v2', 
            LAST_SYNC: 'data_last_sync_timestamp', 
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

    const SEO_POOL = {
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
        currentFilters: null,
        filteredProfiles: [],
        renderId: 0 
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
        if (yearSpan) yearSpan.textContent = "2026";
        document.body.classList.add('loaded');
        console.log("✅ App Initialized Successfully!");

        if (window.location.pathname === '/' && !state.currentProfileSlug) {
            try {
                const heroElements = document.querySelectorAll('#hero-h1, #hero-p, #hero-form');
                if (heroElements.length > 0 && window.gsap) {
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
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) return 'เมื่อครู่นี้';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชม.ที่แล้ว`;
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} วันที่แล้ว`;

            const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
            const day = date.getDate();
            const month = thaiMonths[date.getMonth()];
            const year = (date.getFullYear() + 543).toString().slice(-2); 
            
            return `${day} ${month} ${year}`;
        } catch (e) {
            return 'ไม่ระบุ';
        }
    }

    function saveRecentSearch(term) {
        if (!term || term.trim() === '') return;
        try {
            const recentSearches = JSON.parse(localStorage.getItem('recent_searches') || '[]');
            const filtered = recentSearches.filter(t => t.toLowerCase() !== term.toLowerCase());
            filtered.unshift(term);
            const limited = filtered.slice(0, 10);
            localStorage.setItem('recent_searches', JSON.stringify(limited));
        } catch (e) {
            console.error('Error saving recent search:', e);
        }
    }
    
    function showErrorState(error) {
        console.error("❌ เกิดข้อผิดพลาดร้ายแรง:", error);
        hideLoadingState();
        
        if(dom.profilesDisplayArea) {
            dom.profilesDisplayArea.classList.remove('hidden');
            dom.profilesDisplayArea.innerHTML = `
                <div style="text-align: center; padding: 48px 16px; color: #EF4444; max-width: 500px; margin: 48px auto; background-color: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 24px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 16px; color: var(--primary-purple);</i>
                    <h3 style="font-size: 18px; font-weight: 800; color: white; margin: 0;">ระบบเชื่อมต่อขัดข้องชั่วคราว</h3>
                    <p style="margin-top: 12px; color: var(--text-gray); font-size: 13px; line-height: 1.6;">ไม่สามารถดึงข้อมูลโปรไฟล์ได้ในขณะนี้ กรุณาตรวจสอบสัญญาณเครือข่ายมือถือหรืออินเทอร์เน็ตของคุณใหม่อีกครั้งครับ</p>
                    <button onclick="window.location.reload()" 
                            style="margin-top: 24px; padding: 12px 28px; background-color: var(--primary-purple); color: white; border-radius: 100px; border: none; cursor: pointer; font-weight: 800; font-size: 13px; box-shadow: 0 4px 15px rgba(90, 44, 190, 0.3); transition: transform 0.2s;"
                            onmousedown="this.style.transform='scale(0.96)'" onmouseup="this.style.transform='scale(1)'">
                        <i class="fas fa-sync-alt" style="margin-right: 8px;"></i> รีโหลดหน้าเว็บ
                    </button>
                </div>
            `;
        }
        if(dom.featuredSection) dom.featuredSection.classList.add('hidden');
        if(dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
        
        const loadMore = document.getElementById('load-more-container');
        if (loadMore) loadMore.classList.add('hidden');
    }
    
    let isLikeProcessing = false;

function initGlobalClickListener() {
    console.log("👂 Global Click Listener is now active.");
    
    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // 1. ดักจับคลิกปุ่มหัวใจ (Like)
        const likeButton = target.closest('[data-action="like"]');
        if (likeButton) {
            event.preventDefault(); 
            event.stopPropagation(); 
            
            const profileId = likeButton.dataset.id;
            if (profileId && typeof window.handleLikeClick === 'function') {
                window.handleLikeClick(likeButton, profileId);
            }
            return; 
        }

        // 2. ดักจับคลิกการ์ดโปรไฟล์
        const cardLink = target.closest('a.card-link');
        if (cardLink) {
            event.preventDefault(); 
            
            const card = cardLink.closest('.profile-card-new');
            const slug = card ? card.getAttribute('data-profile-slug') : null;
            
            if (slug) {
                state.lastFocusedElement = cardLink; 
                history.pushState(null, '', `/sideline/${slug}`); 
                handleRouting(); 
            }
            return;
        }
        
        // 3. ดักจับคลิกปุ่มปิด Lightbox หรือคลิกพื้นหลังสีดำ
        const closeButton = target.closest('#closeLightboxBtn');
        const lightboxBackdrop = target.closest('#lightbox');
        if (closeButton || (lightboxBackdrop && event.target === lightboxBackdrop)) {
             history.pushState(null, '', '/'); 
             handleRouting(); 
             
             if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
                 state.lastFocusedElement.focus();
             }
             return; 
        }

        // 4. ดักจับคลิกผลการค้นหาแนะนำที่ระบบสร้างขึ้นขณะพิมพ์ (Dynamic Suggestions)
        const sugClick = target.closest('.suggestion-item[data-action="suggestion"]');
        if (sugClick) {
            event.preventDefault();
            const slug = sugClick.dataset.slug;
            const isProfile = sugClick.dataset.isProfile === "true";
            
            if (typeof window.selectSuggestion === 'function') {
                window.selectSuggestion(slug, isProfile);
            }
            return; 
        }

        // 🟢 5. ดักจับคลิกปุ่มล้างประวัติการค้นหาล่าสุด (CSP Safe)
        const clearRecentBtn = target.closest('[data-action="clear-recent"]');
        if (clearRecentBtn) {
            event.preventDefault();
            event.stopPropagation();
            if (typeof window.clearRecentSearches === 'function') {
                window.clearRecentSearches();
            }
            return; 
        }

        // 🟢 6. ดักจับคลิกแถบดูผลลัพธ์ทั้งหมดสำหรับการค้นหา (CSP Safe)
        const searchAllDiv = target.closest('[data-action="search-all"]');
        if (searchAllDiv) {
            event.preventDefault();
            event.stopPropagation();
            const queryTerm = searchAllDiv.dataset.query;
            if (queryTerm && typeof window.handleSearchAll === 'function') {
                window.handleSearchAll(queryTerm);
            }
            return; 
        }

        // 7. ดักจับคลิกประวัติ "ค้นหาล่าสุด" ย้อนหลังแบบเก่า (ทำงานเป็นระบบ Fallback)
        const suggestionItem = target.closest('[onclick^="window.selectSuggestion"]');
        if (suggestionItem) {
            event.preventDefault(); 
            
            try {
                const onclickAttr = suggestionItem.getAttribute('onclick');
                const match = onclickAttr.match(/window\.selectSuggestion\('([^']*)',\s*(true|false)\)/);
                if (match && typeof window.selectSuggestion === 'function') {
                    const term = match[1];
                    const isProfile = match[2] === 'true';
                    window.selectSuggestion(term, isProfile);
                }
            } catch (e) {
                console.warn("⚠️ Suggestion parsing failed", e);
            }
            return; 
        }
    });

    // ดักจับการกดปุ่ม ESC บนคีย์บอร์ด
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && state.currentProfileSlug) {
            history.pushState(null, '', '/');
            handleRouting();
            
            if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
                state.lastFocusedElement.focus();
            }
        }
    });
}

window.handleLikeClick = async function(likeButton, profileId) {
    if (isLikeProcessing) return; 
    isLikeProcessing = true; 
    
    console.log(`👍 Processing like for profile ID: ${profileId}`);

    const isLiked = likeButton.classList.toggle('liked');
    const icon = likeButton.querySelector('i');
    
    if (icon) {
        if (isLiked) {
            icon.style.transform = "scale(1.3)";
            setTimeout(() => icon.style.transform = "scale(1)", 200);
        } else {
            icon.style.transform = "scale(0.9)";
            setTimeout(() => icon.style.transform = "scale(1)", 200);
        }
    }
    
    const countSpan = likeButton.querySelector('.like-count');
    if (countSpan) {
        const currentLikes = parseInt(countSpan.textContent.replace(/,/g, '') || '0', 10);
        const newLikes = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
        countSpan.textContent = newLikes.toLocaleString();
    }

    const storageKey = (window.CONFIG && window.CONFIG.KEYS && window.CONFIG.KEYS.LIKED_PROFILES) 
        ? window.CONFIG.KEYS.LIKED_PROFILES 
        : 'liked_profiles';

    try {
        const likedProfiles = JSON.parse(localStorage.getItem(storageKey) || '{}');
        if (isLiked) {
            likedProfiles[profileId] = true;
        } else {
            delete likedProfiles[profileId];
        }
        localStorage.setItem(storageKey, JSON.stringify(likedProfiles));
    } catch (e) {
        console.warn("⚠️ Local storage update failed:", e);
    }

    if (window.supabase) {
        try {
            const rpcName = isLiked ? 'increment_likes' : 'decrement_likes';
            const { error } = await window.supabase.rpc(rpcName, { 
                profile_id_to_update: profileId 
            });

            if (error) {
                console.error(`❌ Supabase update failed (${rpcName}):`, error.message);
            } else {
                console.log(`✅ Database updated successfully via ${rpcName}`);
            }
        } catch (err) {
            console.error("🔌 Network/Database connection error:", err);
        }
    }
    
    setTimeout(() => { 
        isLikeProcessing = false; 
    }, 300);
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
        dom.sortSelect = document.getElementById('sort-select'); 
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

    // 1. ตรรกะ Hydration: ดึงตัวแปร profilesData มาใช้งานทันทีเพื่อความเร็วระดับสูงสุด
    if (window.profilesData && window.profilesData.length > 0) {
        console.log("⚡ [Hydration] โหลดสเปกรายชื่อโปรไฟล์สำเร็จจาก SSR!");
        
        try {
            // 🚨 ป้องกันข้อผิดพลาดจาก Cache: โหลดข้อมูลจังหวัดอย่างปลอดภัย
            const hasCachedProvinces = localStorage.getItem(CONFIG.KEYS.CACHE_PROVINCES);
            if (hasCachedProvinces) {
                try {
                    const cachedProv = JSON.parse(hasCachedProvinces);
                    state.provincesMap.clear();
                    cachedProv.forEach(p => state.provincesMap.set(p.key.toString(), p.name));
                } catch (jsonErr) {
                    console.warn("⚠️ Local cached provinces parsing failed, resetting cache.", jsonErr);
                    localStorage.removeItem(CONFIG.KEYS.CACHE_PROVINCES);
                }
            }
            
            // ดึงข้อมูลกรณีไม่มี Cache ในเครื่อง
            if (state.provincesMap.size === 0) {
                try {
                    const { data } = await supabase.from('provinces').select('*');
                    if (data) {
                        data.forEach(p => {
                            const k = p.key || p.slug || p.id;
                            const n = p.nameThai || p.name;
                            if (k && n) state.provincesMap.set(k.toString(), n);
                        });
                        // อัปเดตเก็บเข้า Cache ใหม่เพื่อความเร็วในรอบหน้า
                        const provincesForCache = Array.from(state.provincesMap.entries()).map(([k, n]) => ({ key: k, name: n }));
                        localStorage.setItem(CONFIG.KEYS.CACHE_PROVINCES, JSON.stringify(provincesForCache));
                    }
                } catch (e) { 
                    console.warn("Fallback provinces fetch failed", e); 
                }
            }

            // ประมวลผลข้อมูลโปรไฟล์แบบปลอดภัย ป้องกันโปรไฟล์ชำรุดตัวเดียวทำระบบล่มทั้งหมด
            state.allProfiles = window.profilesData.map(p => {
                try {
                    return processProfileData(p);
                } catch (err) {
                    console.error("❌ Profile processing failed for profile:", p, err);
                    return null;
                }
            }).filter(Boolean);
            
            // เตรียมความพร้อมของข้อมูลและฟังก์ชันบนหน้าเว็บ
            initSearchAndFilters();
            populateProvinceDropdown(); 
            await handleRouting(true);
            initRealtimeSubscription();
            
        } catch (hydrationError) {
            console.error("❌ Hydration process crashed, falling back to network fetch:", hydrationError);
            // หากระบบ Hydration พังกลางคัน ให้สั่งล้างค่าเพื่ออนุญาตให้เข้าตรรกะ Fallback ไปโหลดใหม่จากเซิร์ฟเวอร์
            window.profilesData = null;
            await fetchDataDelta().catch(console.error);
        } finally {
            hideLoadingState();
        }
        return; 
    }

    // 2. ตรรกะ Fallback: ทำงานกรณีเข้าเว็บโดยไม่มีข้อมูล SSR ฝังมา (เช่น เปิดผ่านเส้นทางย่อยแบบคลีน)
    showLoadingState(); 
    let retryCount = 0;
    const maxRetries = 3;
    
    try {
        while (retryCount < maxRetries) {
            try {
                const success = await fetchDataDelta();
                if (success) {
                    initSearchAndFilters();
                    await handleRouting(true);
                    initRealtimeSubscription();
                    
                    if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
                    if (dom.profilesDisplayArea) dom.profilesDisplayArea.classList.remove('hidden');
                    
                    return; 
                }
            } catch (error) {
                console.error(`Attempt ${retryCount + 1} failed:`, error);
                retryCount++;
                if (retryCount < maxRetries) {
                    // หน่วงเวลาก่อนส่งขอดึงข้อมูลใหม่อีกครั้งเพื่อลดภาระเซิร์ฟเวอร์
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
            }
        }
        showErrorState("ไม่สามารถโหลดข้อมูลได้หลังจากลองใหม่หลายครั้ง");
    } finally {
        hideLoadingState(); 
    }
}

    async function fetchDataDelta() {
        if (state.isFetching) return false;
        state.isFetching = true;

        try {
            console.log("🔄 Checking for updates via 'lastUpdated'...");

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

            const serverTimestamp = latestEntry?.lastUpdated 
                ? new Date(latestEntry.lastUpdated).getTime().toString() 
                : '0';

            const localTimestamp = localStorage.getItem(CONFIG.KEYS.LAST_SYNC);
            const hasCachedProfiles = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
            const hasCachedProvinces = localStorage.getItem(CONFIG.KEYS.CACHE_PROVINCES);

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

            console.log("🚀 Found updates! Fetching fresh data...");

            const [provincesRes, profilesRes] = await Promise.all([
                supabase.from('provinces').select('*'),
                supabase.from('profiles')
                    .select('*')
                    .eq('active', true) 
                    .order('isfeatured', { ascending: false })
                    .order('created_at', { ascending: false })
            ]);

            if (provincesRes.error) throw provincesRes.error;
            if (profilesRes.error) throw profilesRes.error;

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

            const fetchedProfiles = profilesRes.data || [];
            state.allProfiles = fetchedProfiles.map(p => processProfileData(p)).filter(Boolean);

            try {
                saveCache(CONFIG.KEYS.CACHE_PROFILES, state.allProfiles);
                saveCache(CONFIG.KEYS.CACHE_PROVINCES, provincesForCache);
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

    function initRealtimeSubscription() {
    if (!window.supabase) return;

    if (state.realtimeSubscription) {
        try {
            window.supabase.removeChannel(state.realtimeSubscription);
        } catch (e) { console.warn('Realtime cleanup error:', e); }
        state.realtimeSubscription = null;
    }

    console.log('📡 [Realtime] ระบบอัปเดตอัจฉริยะกำลังทำงาน...');

    let connectionRetries = 0;
    const maxRetries = 5; // จำกัดจำนวนครั้งในการพยายามต่อใหม่

    const channel = window.supabase.channel('public:profiles_realtime_sync')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'profiles' },
            (payload) => {
                // ... (โค้ดประมวลผลเดิมของท่านคงไว้ตามปกติ) ...
            }
        )
        .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
                console.log('✅ [Realtime] เชื่อมต่อฐานข้อมูลสดเรียบร้อย!');
                connectionRetries = 0; // รีเซ็ตเมื่อสำเร็จ
            }
            
            // หากพบปัญหาการเชื่อมต่อขัดข้อง หรือมี Error ระดับ DNS
            if (status === 'CHANNEL_ERROR' || err) {
                connectionRetries++;
                console.warn(`⚠️ [Realtime] การเชื่อมต่อขัดข้องครั้งที่ ${connectionRetries}/${maxRetries}`);
                
                if (connectionRetries >= maxRetries) {
                    console.error('❌ [Realtime] เกินพิกัดทดลองเชื่อมต่อใหม่ ระบบยกเลิกการต่ออัตโนมัติเพื่อคงประสิทธิภาพเว็บ');
                    try {
                        window.supabase.removeChannel(channel);
                    } catch (e) { console.error(e); }
                }
            }
        });

    state.realtimeSubscription = channel;
}

    function getOptimizedClientImage(path, width = 400) {
        if (!path) return CONFIG.DEFAULT_OG_IMAGE;
        if (path.includes('res.cloudinary.com')) {
            return path.replace('/upload/', `/upload/c_scale,w_${width},q_auto,f_auto/`);
        }
        if (path.startsWith('http')) return path;
        return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/${CONFIG.STORAGE_BUCKET}/${path}`;
    }

    function processProfileData(p) {
        if (!p) return null;

        const displayName = getCleanName(p.name); 
        const rawGallery = Array.isArray(p.galleryPaths) ? p.galleryPaths : [];
        const allImagePaths = [p.imagePath, ...rawGallery].filter(Boolean);
        const uniquePaths = [...new Set(allImagePaths)];

        let imageObjects = uniquePaths.map(path => {
            return { 
                src: getOptimizedClientImage(path, 400),  
                fullSrc: getOptimizedClientImage(path, 800) 
            };
        });

        if (imageObjects.length === 0) {
            imageObjects.push({ 
                src: CONFIG.DEFAULT_OG_IMAGE, 
                fullSrc: CONFIG.DEFAULT_OG_IMAGE 
            });
        }

        const provinceName = state.provincesMap.get(p.provinceKey) || p.provinceThai || 'ไม่ระบุ';
        const numericPrice = Number(String(p.rate).replace(/\D/g, '')) || 0;
        const formattedPrice = numericPrice > 0 ? numericPrice.toLocaleString() : 'สอบถาม';

        let bwhFormat = '-';
        if (p.bust && p.waist && p.hips) {
            const cup = p.cup_size ? p.cup_size.toUpperCase() : '';
            bwhFormat = `${p.bust}${cup}-${p.waist}-${p.hips}`;
        } else if (p.stats) {
            bwhFormat = p.stats; 
        }

        const universalSearchString = `
            ${displayName} ${p.id} ${provinceName} 
            ${Array.isArray(p.styleTags) ? p.styleTags.join(' ') : ''} 
            ${p.description || ''} ${p.location || ''} 
            ${bwhFormat} ${p.skin_tone || ''}
        `.toLowerCase().replace(/\s+/g, ' ').trim();

        return { 
            ...p, 
            displayName,
            images: imageObjects, 
            provinceNameThai: provinceName,
            displayPrice: formattedPrice, 
            _price: numericPrice,         
            searchString: universalSearchString,
            
            safeHeight: p.height || '-',
            safeWeight: p.weight || '-',
            safeStats: bwhFormat,
            safeSkin: p.skin_tone || '-',
            safeAge: p.age || '-',
            isVerified: p.verified === true, 
            hasVideo: p.has_video === true
        };
    }

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

    async function handleRouting(dataLoaded = false) {
        let path = window.location.pathname.toLowerCase();
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        const staticPages = ['/blog', '/about', '/faq', '/profiles', '/locations', '/contact', '/policy', '/terms-of-service', '/privacy-policy'];
        const isStaticPage = path.endsWith('.html') || 
                             path.endsWith('.htm') || 
                             staticPages.some(p => path === p || path.startsWith(p + '/'));

        if (isStaticPage) {
            console.log(`🛑 Static page detected (${path}).`);
            closeLightbox(false); 
            if(dom.profilesDisplayArea) dom.profilesDisplayArea.classList.add('hidden');
            if(dom.featuredSection) dom.featuredSection.classList.add('hidden');
            return; 
        }

        const profileMatch = path.match(/^\/(?:sideline|profile|app)\/([^/]+)/);
        if (profileMatch) {
            const slug = decodeURIComponent(profileMatch[1]);
            state.currentProfileSlug = slug;
            
            let profile = state.allProfiles.find(p => (p.slug || '').toLowerCase() === slug.toLowerCase());
            if (!profile && !dataLoaded) profile = await fetchSingleProfile(slug);

            if (profile) {
                openLightbox(profile);
                updateAdvancedMeta(profile, null);
            } else if (dataLoaded) {
                history.replaceState(null, '', '/');
                closeLightbox(false);
                state.currentProfileSlug = null;
            }
            return;
        } 
        
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
                dom.profilesDisplayArea?.classList.remove('hidden');
                dom.featuredSection?.classList.remove('hidden'); 
            }
            return;
        }

        state.currentProfileSlug = null;
        closeLightbox(false);
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
        
        if (state.allProfiles && state.allProfiles.length > 0) {
            console.log(`🚀 Building Search Index for ${state.allProfiles.length} profiles...`);
            fuseEngine = new Fuse(state.allProfiles, fuseOptions);
        } else {
            setTimeout(() => {
                if (state.allProfiles.length > 0 && !fuseEngine) {
                    fuseEngine = new Fuse(state.allProfiles, fuseOptions);
                }
            }, 1000);
        }

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

            // เคลียร์ปุ่ม Tab ให้กลับไปสถานะ "ทั้งหมด"
            const regionTabs = document.querySelectorAll('.region-tab');
            regionTabs.forEach(t => t.classList.remove('active'));
            const allTab = document.querySelector('.region-tab[data-region="ทั้งหมด"]');
            if (allTab) allTab.classList.add('active');

            history.pushState(null, '', '/');
            applyUltimateFilters(true);
        });

        dom.searchForm.addEventListener('submit', (e) => { 
            e.preventDefault(); 
            applyUltimateFilters(true); 
            if(suggestionsBox) suggestionsBox.classList.add('hidden');
            if (dom.searchInput) dom.searchInput.blur();
        });

        // ==========================================
        // 🟢 ระบบจัดการปุ่ม Tab (ภาคเหนือ / กรุงเทพฯ / ทั้งหมด)
        // ==========================================
        const regionTabs = document.querySelectorAll('.region-tab');
        if (regionTabs.length > 0) {
            regionTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    // 1. เปลี่ยนสีปุ่มที่ถูกกดให้เป็น Active
                    regionTabs.forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // 2. นำคำจากปุ่มไปใส่ในช่องค้นหา (ถ้าเป็น "ทั้งหมด" ให้เคลียร์ช่องค้นหา)
                    const region = e.target.dataset.region;
                    if (dom.searchInput) {
                        dom.searchInput.value = (region === 'ทั้งหมด') ? '' : region;
                        // โชว์/ซ่อน ปุ่ม (X) ล้างข้อความในช่องค้นหา
                        if (clearBtn) clearBtn.classList.toggle('hidden', !dom.searchInput.value);
                    }
                    
                    // 3. ปิดกล่อง Suggestion (ถ้าเปิดอยู่)
                    if (suggestionsBox) suggestionsBox.classList.add('hidden');

                    // 4. สั่งรันระบบตัวกรองเพื่อค้นหาโปรไฟล์ทันที
                    applyUltimateFilters(true);
                });
            });
        }
    }

    function saveCache(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.code === 22) {
                console.warn("⚠️ LocalStorage เต็ม! กำลังพยายามเคลียร์พื้นที่...");
                localStorage.removeItem('cachedProfiles'); 
                localStorage.removeItem('recent_searches');
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                    console.log("✅ บันทึกสำเร็จหลังจากเคลียร์พื้นที่");
                } catch (retryError) {
                    console.error("❌ พื้นที่เต็มจริงๆ ไม่สามารถบันทึก Cache ได้", retryError);
                }
            } else {
                console.error("❌ Cache Error:", e);
            }
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

        let html = `
            <div style="background-color: #121214; border: 1px solid rgba(147, 51, 234, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div style="padding: 10px 16px; background-color: #09090B; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; tracking: 0.05em;">ผลลัพธ์ที่แนะนำ (${results.length})</span>
                </div>
                <div style="display: flex; flex-direction: column;">
        `;

        results.forEach(({ item }) => {
            const provinceName = state.provincesMap.get(item.provinceKey) || '';
            const isAvailable = item.availability?.includes('ว่าง') || item.availability?.includes('รับงาน');
            const imgSrc = item.images && item.images[0] ? item.images[0].src : '/images/placeholder.webp';
            
            // 🟢 เปลี่ยนมาใช้ data-action และ data-slug (ลบ onclick/onmouseenter/onmouseleave ออก)
            html += `
                <div class="suggestion-item" 
                     data-action="suggestion"
                     data-slug="${item.slug}"
                     data-is-profile="true"
                     style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.03); transition: background-color 0.2s;">
                    <div style="position: relative; width: 40px; height: 40px; shrink: 0; pointer-events: none;">
                        <img src="${imgSrc}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);" alt="รูปแนะคีย์เสิร์ช">
                        <span style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background-color: ${isAvailable ? '#00E676' : '#9CA3AF'}; border: 2px solid #121214; border-radius: 50%;"></span>
                    </div>
                    <div style="flex: 1; min-width: 0; text-align: left; pointer-events: none;">
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                            <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin: 0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${item.name}</div>
                            ${item.age ? `<span style="font-size: 9px; background-color: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; color: var(--text-gray); font-weight: 700;">${item.age} ปี</span>` : ''}
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                            <span style="font-size: 11px; color: var(--text-gray); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                                <i class="fas fa-map-marker-alt" style="font-size: 9px; color: var(--primary-purple); margin-right: 4px;"></i> ${provinceName}
                            </span>
                        </div>
                    </div>
                    <i class="fas fa-chevron-right" style="color: rgba(255,255,255,0.15); font-size: 10px; pointer-events: none;"></i>
                </div>
            `;
        });

html += `</div>`;
    html += `
        <div data-action="search-all" data-query="${val.replace(/'/g, "\\'")}" 
             style="padding: 12px; background-color: #09090B; text-align: center; cursor: pointer; border-top: 1px solid rgba(255,255,255,0.05); transition: background-color 0.2s;"
             onmouseenter="this.style.backgroundColor='rgba(147, 51, 234, 0.05)'"
             onmouseleave="this.style.backgroundColor='#09090B'">
            <span style="font-size: 12px; font-weight: 800; color: var(--primary-purple);"><i class="fas fa-search" style="margin-right: 6px;"></i> ดูผลลัพธ์ทั้งหมด</span>
        </div>
    </div>`;
    
    box.innerHTML = html;
    box.classList.remove('hidden');
} // 📌 วงเล็บปีกกานี้ทำหน้าที่ปิดฟังก์ชัน updateUltimateSuggestions อย่างสมบูรณ์และถูกต้อง

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
        if (input) {
            input.value = value;
            saveRecentSearch(value);
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

        let html = `<div style="background-color: #121214; border: 1px solid rgba(147, 51, 234, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">`;
        html += `<div style="padding: 10px 16px; background-color: #09090B; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">ค้นหาล่าสุด</span>
            <button data-action="clear-recent" style="background:none; border:none; color:#EF4444; font-size:11px; font-weight:700; cursor:pointer;">ล้างประวัติ</button>
         </div>`;
        
        // 🟢 โค้ดใหม่ที่สะอาด ปลอดภัย และถูกต้องสมบูรณ์แบบ:
recents.forEach(term => {
    const safeTerm = term.replace(/[<>]/g, ''); 
    const escapedTerm = term.replace(/'/g, "\\'");
    html += `
        <div data-action="suggestion" data-slug="${escapedTerm}" data-is-profile="false"
             style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.03); transition: background-color 0.2s;" 
             onmouseenter="this.style.backgroundColor='rgba(147, 51, 234, 0.05)'"
             onmouseleave="this.style.backgroundColor='transparent'">
            <i class="fas fa-history" style="color: var(--text-muted); font-size: 12px;"></i>
            <span style="font-size: 13px; color: #FFFFFF; font-weight: 600;">${safeTerm}</span>
        </div>
    `;
});
        
        html += `</div>`;
        box.innerHTML = html;
        box.classList.remove('hidden');
    }

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
    window.handleSearchAll = handleSearchAll;

    function applyUltimateFilters(updateUrl = true) {
        try {
            const query = {
                text: (dom.searchInput?.value || '').trim(),
                province: dom.provinceSelect?.value || 'all',
                avail: dom.availabilitySelect?.value || 'all',
                featured: dom.featuredSelect?.value === 'true',
                sort: dom.sortSelect?.value || 'featured'
            };

            if (query.text) {
                saveRecentSearch(query.text);
            }

            if (query.text && state.provincesMap) {
                for (const [key, provinceName] of state.provincesMap.entries()) {
                    const normalizedText = query.text.toLowerCase().trim();
                    const normalizedProvince = provinceName.toLowerCase().trim();
                    
                    if (normalizedText === normalizedProvince || 
                        normalizedProvince.includes(normalizedText) ||
                        normalizedText.includes(normalizedProvince)) {
                        
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

            let filtered = [...state.allProfiles]; 

            if (query.text) {
                const searchText = query.text.toLowerCase().trim();
                let searchHandled = false;

                if (/^\d+$/.test(searchText)) {
                    const idMatches = filtered.filter(p => 
                        String(p.id) === searchText || 
                        (p.slug && p.slug.endsWith(`-${searchText}`))
                    );

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
                        filtered = filtered.filter(p => 
                            p.searchString?.includes(searchText) || 
                            p.name?.toLowerCase().includes(searchText) ||
                            p.englishName?.includes(searchText)
                        );
                    }
                }
            }

            if (query.province && query.province !== 'all') {
                filtered = filtered.filter(p => p.provinceKey === query.province);
            }

            if (query.avail && query.avail !== 'all') {
                filtered = filtered.filter(p => p.availability === query.avail);
            }

            if (query.featured) {
                filtered = filtered.filter(p => p.isfeatured === true);
            }

            filtered.sort((a, b) => {
                switch (query.sort) {
                    case 'featured':
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

            if (dom.resultCount) {
                const count = filtered.length;
                let message = '';
                
                if (count === 0) {
                    message = '❌ ไม่พบโปรไฟล์ที่ตรงกับเงื่อนไข';
                } else if (count === 1) {
                    message = '✅ พบ 1 โปรไฟล์';
                } else {
                    message = `✅ พบ ${count.toLocaleString()} โปรไฟล์`;
                    if (query.province && query.province !== 'all') {
                        const provinceName = state.provincesMap?.get(query.province) || query.province;
                        message += ` ในจังหวัด${provinceName}`;
                    }
                }
                dom.resultCount.textContent = message;
                dom.resultCount.style.display = 'block';
            }

            const isSearchMode = query.text || (query.province && query.province !== 'all') || 
                                query.avail !== 'all' || query.featured;
            
            renderProfiles(filtered, isSearchMode);

            if (updateUrl) {
                updateUrlFromFilters(query);
            }

            state.currentFilters = query;
            state.filteredProfiles = filtered;

        } catch (error) {
            console.error('❌ เกิดข้อผิดพลาดใน applyUltimateFilters:', error);
        }
    }

    window.clearRecentSearches = function() {
        if (confirm("ต้องการล้างประวัติการค้นหาทั้งหมดใช่ไหม?")) {
            localStorage.removeItem('recent_searches');
            const box = document.getElementById('search-suggestions');
            if (box) box.classList.add('hidden');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            const searchInput = document.getElementById('search-keyword');
            if (searchInput && !searchInput.value.trim()) {
                showRecentSearches();
            }
        }, 1000);
    });

    function updateUrlFromFilters(query) {
        try {
            let newUrl = '/';
            if (query.province && query.province !== 'all') {
                newUrl = `/location/${encodeURIComponent(query.province)}`;
            }
            
            const params = new URLSearchParams();
            if (query.text) params.set('q', query.text); 
            
            const paramsString = params.toString();
            if (paramsString) {
                newUrl = `${newUrl}?${paramsString}`;
            }
            
            if (window.location.pathname + window.location.search !== newUrl) {
                history.pushState({ 
                    filters: query,
                    timestamp: Date.now() 
                }, '', newUrl);
            }
        } catch (error) {
            console.error('❌ เกิดข้อผิดพลาดในการอัปเดต URL:', error);
        }
    }

    async function renderCardsIncrementally(container, profiles, renderId) {
        if (!container || !profiles) return;
        
        container.dataset.activeRenderId = renderId;
        container.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        const BATCH_SIZE = profiles.length > 20 ? 4 : 8; 

        for (let i = 0; i < profiles.length; i++) {
            if (renderId !== undefined && Number(container.dataset.activeRenderId) !== renderId) {
                return;
            }

            const card = createProfileCard(profiles[i], i);
            fragment.appendChild(card);

            if ((i + 1) % BATCH_SIZE === 0 || i === profiles.length - 1) {
                container.appendChild(fragment);
                await new Promise(resolve => requestAnimationFrame(resolve));
                if (profiles.length > 40) {
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
        }
    }

    function yieldToMain() {
        return new Promise(resolve => {
            setTimeout(resolve, 0);
        });
    }

    function createSearchResultSection(profiles, renderId) {
        let headerText;
        const currentProvKey = dom.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE);
        const provinceMatch = window.location.pathname.match(/^\/(?:location|province)\/([^/]+)/);
        let activeKey = provinceMatch ? decodeURIComponent(provinceMatch[1]) : currentProvKey;

        if (activeKey && state.provincesMap.has(activeKey) && activeKey !== 'all') {
            const name = state.provincesMap.get(activeKey);
            headerText = `📍 น้องๆ ในจังหวัด <span style="color: var(--primary-purple);">${name}</span>`;
        } else if (dom.searchInput?.value) {
            headerText = `🔍 ผลการค้นหา "${dom.searchInput.value}"`;
        } else {
            headerText = `✨ โปรไฟล์ทั้งหมด`;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'section-content-wrapper';
        wrapper.style.cssText = "margin-top: 48px;";
        wrapper.innerHTML = `
            <div style="padding: 24px 16px; border-bottom: 1px solid rgba(255,255,255,0.03); margin-bottom: 24px;">
                <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
                    <div><h3 style="font-size: 24px; font-weight: 800; color: white; tracking-tight: -0.01em; margin: 0;">${headerText}</h3></div>
                </div>
            </div>
            <div class="profile-grid profiles-grid-row"></div>
        `;
        
        const gridContainer = wrapper.querySelector('.profile-grid');
        renderCardsIncrementally(gridContainer, profiles, renderId);
        return wrapper;
    }

    function createProvinceSection(key, name, profiles, renderId) {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-content-wrapper province-section';
        wrapper.id = `province-${key}`;
        wrapper.style.cssText = "margin-top: 48px;";
        wrapper.innerHTML = `
            <div style="padding: 16px;">
                <a href="/location/${key}" class="group" style="text-decoration: none; display: inline-block;">
                    <h2 class="province-section-header" style="display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 800; color: white; margin: 0; transition: color 0.2s;"
                        onmouseenter="this.style.color='var(--primary-purple)'"
                        onmouseleave="this.style.color='white'">
                        📍 จังหวัด ${name}
                        <span style="margin-left: 8px; background-color: rgba(90, 44, 190, 0.15); border: 1px solid rgba(147, 51, 234, 0.25); color: white; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 100px;">${profiles.length}</span>
                        <i class="fas fa-chevron-right" style="font-size: 14px; margin-left: 6px; color: var(--primary-purple);"></i>
                    </h2>
                </a>
            </div>
            <div class="profile-grid profiles-grid-row"></div>
        `;

        const gridContainer = wrapper.querySelector('.profile-grid');
        renderCardsIncrementally(gridContainer, profiles, renderId);
        return wrapper;
    }

    async function renderByProvince(profiles, renderId) {
        const groups = profiles.reduce((acc, p) => {
            const key = p.provinceKey || 'no_province';
            if (!acc[key]) acc[key] = [];
            acc[key].push(p);
            return acc;
        }, {});

        const keys = Object.keys(groups).sort((a, b) => {
            const nA = state.provincesMap.get(a) || a;
            const nB = state.provincesMap.get(b) || b;
            return nA.localeCompare(nB, 'th');
        });

        if (keys.length === 0) {
            dom.noResultsMessage?.classList.remove('hidden');
            return;
        }

        for (const key of keys) {
            if (renderId !== undefined && state.renderId !== renderId) {
                return;
            }

            const name = state.provincesMap.get(key) || (key === 'no_province' ? 'ไม่ระบุจังหวัด' : key);
            const provinceSection = createProvinceSection(key, name, groups[key], renderId); 
            
            provinceSection.style.opacity = '0';
            provinceSection.style.transform = 'translateY(20px)';
            provinceSection.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            dom.profilesDisplayArea.appendChild(provinceSection);

            requestAnimationFrame(() => {
                provinceSection.style.opacity = '1';
                provinceSection.style.transform = 'translateY(0)';
            });

            await yieldToMain();
        }
    }

    function renderProfiles(profiles, isSearching) {
        if (!dom.profilesDisplayArea) return;
        
        state.renderId = (state.renderId || 0) + 1;
        const currentRenderId = state.renderId;

        dom.noResultsMessage?.classList.add('hidden');
        if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');

        if (dom.featuredSection) {
            const isHome = !isSearching && !window.location.pathname.includes('/location/');
            dom.featuredSection.classList.toggle('hidden', !isHome);

            if (isHome && dom.featuredContainer && dom.featuredContainer.children.length === 0) {
                const featured = state.allProfiles.filter(p => p.isfeatured);
                renderCardsIncrementally(dom.featuredContainer, featured, currentRenderId); 
            }
        }

        if (!profiles || profiles.length === 0) {
            dom.profilesDisplayArea.innerHTML = '';
            dom.noResultsMessage?.classList.remove('hidden');
            if (dom.resultCount) dom.resultCount.style.display = 'none';
            return;
        }

        const isLocationPage = window.location.pathname.includes('/location/') || window.location.pathname.includes('/province/');
        
        dom.profilesDisplayArea.innerHTML = '';

        if (isSearching || isLocationPage) {
            const searchSection = createSearchResultSection(profiles, currentRenderId); 
            dom.profilesDisplayArea.appendChild(searchSection);
        } else {
            renderByProvince(profiles, currentRenderId); 
        }

        if (window.ScrollTrigger) {
            setTimeout(() => ScrollTrigger.refresh(), 500);
        }
    }

    /* ==========================================================================
   SECTION: PROFILE CARD & LIGHTBOX SYSTEM (COMPLETE VERSION)
   ========================================================================== */

/**
 * 1. ฟังก์ชันสร้างการ์ดโปรไฟล์หน้าแรก
 */
function createProfileCard(p, index = 20) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'profile-card-new-container';

    const cardInner = document.createElement('div');
    cardInner.className = 'profile-card-new interactive-card';
    
    cardInner.style.cssText = `
        aspect-ratio: 3/4; 
        width: 100%; 
        position: relative; 
        border-radius: 20px; 
        overflow: hidden; 
        background-color: #09090B; 
        border: 1px solid rgba(255,255,255,0.05); 
        box-shadow: 0 4px 20px rgba(0,0,0,0.4); 
        cursor: pointer;
    `;
    
    cardInner.setAttribute('data-profile-id', p.id); 
    cardInner.setAttribute('data-profile-slug', p.slug);
    
    // ดึงรูปภาพแรกจากอาร์เรย์ images หรือใช้ Placeholder
    const imgSrc = (p.images && p.images.length > 0) ? p.images[0].src : '/images/placeholder-profile.webp';

    // ตรวจสอบสถานะการรับงาน
    let statusClass = 'status-inquire';
    const availability = (p.availability || '').toLowerCase();
    if (availability.includes('ว่าง') || availability.includes('รับงาน')) {
        statusClass = 'status-available';
    } else if (availability.includes('ไม่ว่าง') || availability.includes('พัก') || availability.includes('ติดจอง')) {
        statusClass = 'status-busy';
    }

    const likedProfiles = JSON.parse(localStorage.getItem('liked_profiles') || '{}');
    const isLikedClass = likedProfiles[p.id] ? 'liked' : '';
    const altText = `น้อง${p.displayName || p.name} สาวรับงาน${p.provinceNameThai || 'เชียงใหม่'} ไซด์ไลน์${p.provinceNameThai || 'เชียงใหม่'} ฟิวแฟน`;

    cardInner.innerHTML = `
        <div class="skeleton-loader" style="position: absolute; inset: 0; background-color: #121214; z-index: 0; border-radius: 20px;"></div>
        <img src="${imgSrc}" 
             alt="${altText}"
             width="300"
             height="400"
             style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85); transition: opacity 0.7s; opacity: 0; z-index: 0; border-radius: 20px;"
             loading="${index < 4 ? 'eager' : 'lazy'}"
             onload="this.style.opacity = '1'; if(this.previousElementSibling) this.previousElementSibling.remove();"
             onerror="this.onerror=null; this.src='/images/placeholder-profile.webp'; this.style.opacity = '1';">
             
        <div style="position: absolute; top: 12px; left: 12px; z-index: 30; pointer-events: none;">
            <span class="neon-badge ${statusClass === 'status-available' ? 'status-available-neon' : 'status-busy-neon'}" style="background-color: rgba(0,0,0,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 100px; color: white; display: flex; align-items: center; gap: 6px;">
                <span class="neon-dot" style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${statusClass === 'status-available' ? '#00E676' : '#FF2E63'}; box-shadow: 0 0 6px ${statusClass === 'status-available' ? '#00E676' : '#FF2E63'};"></span>
                <span>${p.availability || 'สอบถาม'}</span>
            </span>
        </div>

        ${p.isfeatured ? `
        <div style="position: absolute; top: 40px; left: 12px; z-index: 30; pointer-events: none;">
            <span style="background-color: #5A2CBE; color: white; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 100px; box-shadow: 0 4px 10px rgba(90, 44, 190, 0.3); display: flex; align-items: center; gap: 4px;"><i class="fas fa-star" style="font-size: 8px;"></i>แนะนำ</span>
        </div>
        ` : ''}
<div style="position: absolute; top: 12px; right: 12px; z-index: 30; pointer-events: auto;">
    <button type="button" class="profile-card-like-btn ${isLikedClass}" data-action="like" data-id="${p.id}" aria-label="เพิ่มลงในรายการโปรด">
        <i class="fa-solid fa-heart"></i>
    </button>
</div>
        

        <a href="/sideline/${p.slug}" class="card-link" style="position: absolute; inset: 0; z-index: 25;" aria-label="ดูโปรไฟล์น้อง${p.name}"></a>

        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.4) 45%, transparent 80%); z-index: 10; pointer-events: none; border-radius: 20px;"></div>

        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 14px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%;">
                <h3 id="profile-name-${p.id}" style="font-size: 14px; font-weight: 800; color: white; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 4px rgba(0,0,0,0.8); flex: 1; min-width: 0;">${p.displayName || p.name}</h3>
                <span style="color: #C084FC; font-weight: 900; font-size: 14px; text-shadow: 0 2px 4px rgba(0,0,0,0.9); flex-shrink: 0; white-space: nowrap;">${p.rate || 'สอบถาม'}</span>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #D4D4D8; gap: 8px; width: 100%;">
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.8); flex: 1; min-width: 0;">
                    <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 4px;"></i> ${p.location || 'เชียงใหม่'}
                </span>
                <span style="white-space: nowrap; opacity: 0.85; text-shadow: 0 1px 2px rgba(0,0,0,0.8); flex-shrink: 0;">
                    <i class="far fa-clock" style="margin-right: 2px;"></i> ${p.lastUpdated ? new Date(p.lastUpdated).toLocaleDateString('th-TH') : 'ล่าสุด'}
                </span>
            </div>
        </div>
    `;

    cardContainer.appendChild(cardInner);
    return cardContainer;
}

/**
 * 2. ฟังก์ชันดึงข้อมูลโปรไฟล์เดี่ยว
 */
async function fetchSingleProfile(slug) {
    if (!window.supabase) return null;
    try {
        let { data, error } = await window.supabase
            .from('profiles')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

        if (data) return processProfileData(data);
        return null;
    } catch (err) {
        console.error("❌ Error fetching profile:", err);
        return null;
    }
}

/**
 * 3. ฟังก์ชันเปิด Lightbox
 */
function openLightbox(p) {
    const lightbox = document.getElementById('lightbox');
    const lightboxWrapper = document.getElementById('lightbox-content-wrapper-el');
    if (!lightbox) return;

    populateLightboxData(p);
    
    lightbox.classList.add('active');
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Animation เล็กน้อยถ้ามี GSAP
    if (window.gsap) {
        window.gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        window.gsap.fromTo(lightboxWrapper, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.2)" });
    }
}

/**
 * 4. ฟังก์ชันจัดการปิด Lightbox
 */
function closeLightbox(animate = true) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;

    const cleanup = () => {
        lightbox.classList.remove('active');
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; 
    };

    if (animate && window.gsap) {
        window.gsap.to(lightbox, { opacity: 0, duration: 0.2, onComplete: cleanup });
    } else {
        cleanup();
    }
    
    // เปลี่ยน URL กลับเป็นหน้าแรก
    if (window.location.pathname !== '/') {
        history.pushState(null, '', '/');
    }
}

/**
 * 5. ฟังก์ชันใส่ข้อมูลลงใน Lightbox (จุดสำคัญที่แก้ไขเรื่องข้อมูลไม่ครบ)
 */
function populateLightboxData(p) {
    if (!p) return;

    // ประมวลผลชื่อและสถานะ
    const cleanName = (p.displayName || p.name || 'ไม่ระบุชื่อ').trim();
    const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
    const statusText = p.availability || 'สอบถาม';
    const dotColor = isAvailable ? '#00E676' : '#FF2E63';

    // ล้างและใส่ข้อมูลพื้นฐาน
    document.getElementById('lightbox-profile-name-main').innerHTML = `
        <span class="text-gradient-main">น้อง${cleanName}</span>
        ${p.isVerified ? '<i class="fas fa-check-circle" style="color: #FBBF24; margin-left: 8px;"></i>' : ''}
    `;

    document.getElementById('lightbox-availability-badge-wrapper').innerHTML = `
        <span class="neon-badge" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 5px 12px; border-radius: 100px; display: flex; align-items: center; gap: 8px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 8px ${dotColor};"></span>
            <span style="color: white; font-size: 11px; font-weight: 700;">${statusText}</span>
        </span>
    `;

    // จัดการคำโปรย (Quote)
    const quoteBox = document.getElementById('lightboxQuote');
    if (quoteBox) {
        quoteBox.textContent = p.quote || "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน ยินดีที่ได้รู้จักค่ะ";
    }

    // จัดการรูปภาพหลัก
    const heroImg = document.getElementById('lightboxHeroImage');
    const mainImg = p?.images?.[0]?.src || p?.imagePath || '/images/placeholder-profile.webp';
    heroImg.src = mainImg;

    // จัดการ Gallery (ถ้ามีหลายรูป)
    const thumbStrip = document.getElementById('lightboxThumbnailStrip');
    thumbStrip.innerHTML = '';
    if (p.images && p.images.length > 1) {
        p.images.forEach((img, idx) => {
            const thumb = document.createElement('img');
            thumb.src = img.src;
            thumb.style.cssText = "width: 50px; height: 60px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; opacity: 0.7; transition: all 0.2s;";
            if (idx === 0) {
                thumb.style.borderColor = "var(--primary-purple)";
                thumb.style.opacity = "1";
            }
            thumb.onclick = () => {
                heroImg.src = img.src;
                Array.from(thumbStrip.children).forEach(t => {
                    t.style.borderColor = "transparent";
                    t.style.opacity = "0.7";
                });
                thumb.style.borderColor = "var(--primary-purple)";
                thumb.style.opacity = "1";
            };
            thumbStrip.appendChild(thumb);
        });
        thumbStrip.style.display = 'flex';
    } else {
        thumbStrip.style.display = 'none';
    }

    // ใส่ Tag สไตล์
    const tagsContainer = document.getElementById('lightboxTags');
    tagsContainer.innerHTML = '';
    const tags = Array.isArray(p.styleTags) ? p.styleTags : [];
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.style.cssText = "background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.2); color: #C084FC; font-size: 10px; padding: 4px 12px; border-radius: 100px; font-weight: 700;";
        span.textContent = tag.startsWith('#') ? tag : `#${tag}`;
        tagsContainer.appendChild(span);
    });

    // --- ส่วนแสดงผลข้อมูลสถิติจริง (Micro-Bento Stats Grid) ---
    const detailsContainer = document.getElementById('lightboxDetailsCompact');
    detailsContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="lightbox-bento-stats">
                <div class="bento-stat-box">
                    <div class="stat-label">อายุ</div>
                    <div class="stat-value">${p.age || p.safeAge || '-'} ปี</div>
                </div>
                <div class="bento-stat-box">
                    <div class="stat-label">สัดส่วน</div>
                    <div class="stat-value">${p.stats || p.safeStats || '-'}</div>
                </div>
                <div class="bento-stat-box">
                    <div class="stat-label">ส่วนสูง/น้ำหนัก</div>
                    <div class="stat-value">${p.height || p.safeHeight || '-'}/${p.weight || p.safeWeight || '-'}</div>
                </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                    <span style="color: #A1A1AA;"><i class="fas fa-tag" style="margin-right: 8px; color: var(--primary-purple); width: 16px; text-align: center;"></i> ค่าขนม</span>
                    <span style="color: #10B981; font-weight: 800; font-size: 14px;">${p.rate || 'สอบถาม'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                    <span style="color: #A1A1AA;"><i class="fas fa-map-marker-alt" style="margin-right: 8px; color: var(--primary-purple); width: 16px; text-align: center;"></i> พิกัดงาน</span>
                    <span style="color: white; font-weight: 600;">${p.location || 'เชียงใหม่'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                    <span style="color: #A1A1AA;"><i class="fas fa-palette" style="margin-right: 8px; color: var(--primary-purple); width: 16px; text-align: center;"></i> สีผิว</span>
                    <span style="color: white; font-weight: 600;">${p.skinTone || p.skin_tone || p.safeSkin || '-'}</span>
                </div>
            </div>
        </div>
    `;

    // รายละเอียดข้อความเพิ่มเติม (Description)
    const descContainer = document.getElementById('lightboxDescriptionContainer');
    const descContent = document.getElementById('lightboxDescriptionContent');
    if (p.description && p.description.trim() !== '') {
        descContent.innerHTML = p.description.replace(/\n/g, '<br>');
        descContainer.style.display = 'block';
    } else {
        descContent.textContent = `น้อง${cleanName} ยืนยันตัวตนตรงปก พร้อมให้บริการเพื่อนเที่ยวฟิวแฟนในพิกัดย่าน${p.location || 'เชียงใหม่'} ดูแลสุภาพ เรียบร้อย เป็นกันเอง สนใจสอบถามคิวงานได้เลยค่ะ`;
        descContainer.style.display = 'block';
    }

    // ปุ่ม LINE สำหรับการจองคิว
    const lineWrapper = document.getElementById('line-btn-sticky-wrapper');
    if (lineWrapper) lineWrapper.remove();

    if (p.lineId) {
        const detailsPanel = document.querySelector('.lightbox-details');
        const newBtnWrapper = document.createElement('div');
        newBtnWrapper.id = 'line-btn-sticky-wrapper';
        newBtnWrapper.style.cssText = "margin-top: 12px; position: sticky; bottom: 0; padding-top: 10px; background: none; width: 100%;";
        
        const lineUrl = p.lineId.startsWith('http') ? p.lineId : `https://line.me/ti/p/~${p.lineId}`;
        
        newBtnWrapper.innerHTML = `
            <a href="${lineUrl}" target="_blank" rel="noopener nofollow" 
               style="display: flex; align-items: center; justify-content: center; gap: 10px; background: #06C755; color: white; padding: 14px; border-radius: 100px; font-weight: 800; font-size: 13.5px; text-decoration: none; box-shadow: 0 8px 20px rgba(6,199,85,0.25); transition: all 0.2s;">
               <i class="fab fa-line" style="font-size: 20px;"></i> แอดไลน์จองคิวน้อง${cleanName}
            </a>
        `;
        detailsPanel.appendChild(newBtnWrapper);
    }
}

    // ฟังก์ชันความเข้ากันได้ ป้องกันปัญหา ReferenceError กรณีโค้ดพยายามเรียกหาการจองคิวของ Lightbox
    function initLightboxEvents() {
        console.log("ℹ️ Lightbox events bound cleanly to global listener.");
    }

    // กำหนดค่า Meta มาตรฐานของหน้าแรกเพื่อใช้ในการกู้คืนค่ากลับมา (Restoration)
    const ORIGINAL_HOME_META = {
        title: "ไซด์ไลน์เชียงใหม่ เพื่อนเที่ยวตรงปก 2026 | สาวรับงานเชียงใหม่ ไม่มัดจำ",
        description: "รวมไซด์ไลน์เชียงใหม่ สาวรับงานเชียงใหม่ เพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟนตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มีโอนมัดจำล่วงหน้า ครอบคลุมนิมมาน เจ็ดยอด สันติธรรม",
        keywords: "สาวรับงานเชียงใหม่, ไซด์ไลน์เชียงใหม่, เพื่อนเที่ยวเชียงใหม่, รับงานเชียงใหม่, สาวรับงานเชียงใหม่ ไม่มัดจำ",
        canonical: "https://sidelinechiangmai.netlify.app/",
        ogImage: "https://sidelinechiangmai.netlify.app/images/sidelinechiangmai-social-preview.webp"
    };

    let isFirstLoad = true;

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
        const currentPath = window.location.pathname.toLowerCase();
        const isRoot = currentPath === '/' || currentPath === '' || currentPath === '/index.html' || currentPath === '/index';
        
        const staticPages = ['/blog', '/about', '/faq', '/profiles', '/locations', '/contact', '/policy', '/terms-of-service', '/privacy-policy'];
        const isStaticPage = currentPath.endsWith('.html') || 
                             currentPath.endsWith('.htm') || 
                             staticPages.some(p => currentPath === p || currentPath.startsWith(p + '/'));

        // 1. ถ้าเป็นหน้าโครงสร้างสแตติกทั่วไป (ที่ไม่ใช่หน้าแรกหลัก) จะไม่มีการแก้ไข Meta
        if (isStaticPage) {
            return;
        }

        // 2. สำหรับการโหลดหน้าเว็บครั้งแรกสุด (First Load) ไม่ว่าจะหน้าไหน 
        // ระบบจะคงค่าดั้งเดิมจากเซิร์ฟเวอร์เอาไว้ (SSR HTML) เพื่อป้องกัน Layout Shift/Flicker
        if (isFirstLoad) {
            isFirstLoad = false;
            console.log("SEO: First load detected. Preserving server-rendered metadata.");
            return;
        }

        // 3. หากผู้ใช้งานวนกลับมาที่หน้าแรกหลัก (Homepage) ให้สั่งรีเซ็ตค่ากลับเป็นค่าดั้งเดิมของเชียงใหม่ทันที
        if (isRoot) {
            console.log("🛡️ SEO Restoration: Restoring original home page metadata.");
            document.title = ORIGINAL_HOME_META.title;
            updateMeta('description', ORIGINAL_HOME_META.description);
            updateMeta('keywords', ORIGINAL_HOME_META.keywords);
            updateLink('canonical', ORIGINAL_HOME_META.canonical);
            
            // กู้คืน Open Graph / Facebook Tags ของหน้าหลัก
            updateMeta('og:title', ORIGINAL_HOME_META.title);
            updateMeta('og:description', ORIGINAL_HOME_META.description);
            updateMeta('og:url', ORIGINAL_HOME_META.canonical);
            updateMeta('og:type', 'website');
            updateMeta('og:image', ORIGINAL_HOME_META.ogImage);
            updateMeta('og:image:secure_url', ORIGINAL_HOME_META.ogImage);
            
            // กู้คืน Twitter Tags ของหน้าหลัก
            updateMeta('twitter:title', ORIGINAL_HOME_META.title);
            updateMeta('twitter:description', ORIGINAL_HOME_META.description);
            updateMeta('twitter:image', ORIGINAL_HOME_META.ogImage);

            clearAllDynamicSchemas();
            return;
        }

        // 4. หากไม่ได้อยู่หน้าแรก (เช่น หน้าคัดกรองจังหวัด หรือหน้าโปรไฟล์น้องๆ) ให้เปลี่ยนตามข้อมูลไดนามิก
        clearAllDynamicSchemas();

        const YEAR_TH = new Date().getFullYear() + 543;
        const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const d = new Date();
        const CURRENT_DATE = `${d.getDate()} ${thaiMonths[d.getMonth()]} ${YEAR_TH}`;

        if (profile) {
            const displayName = getCleanName(profile.name);
            const province = profile.provinceNameThai || 'เชียงใหม่';
            const priceInfo = profile.rate ? `ราคา ${profile.rate}` : 'สอบถามราคา';
            const workArea = profile.location ? `${profile.location}, ${province}` : province;
            const profileUrl = `${CONFIG.SITE_URL}/sideline/${profile.slug || profile.id}`;
            const provinceUrl = `${CONFIG.SITE_URL}/location/${profile.provinceKey || 'chiangmai'}`;
            
            const statsVal = profile.safeStats || profile.stats;
            const ageVal = profile.safeAge || profile.age;
            
            let statsParts = [];
            if (statsVal && statsVal !== '-') {
                statsParts.push(`สัดส่วน ${statsVal}`);
            }
            if (ageVal && ageVal !== '-') {
                statsParts.push(`อายุ ${ageVal} ปี`);
            }
            const detailsSnippet = statsParts.length > 0 ? statsParts.join('. ') : 'ข้อมูลสเปกยืนยันตัวตนแล้ว'; 

            const t = (SEO_POOL && typeof SEO_POOL.pick === 'function') ? SEO_POOL.pick('trust') : 'ไม่ต้องโอนก่อน';
            const g = (SEO_POOL && typeof SEO_POOL.pick === 'function') ? SEO_POOL.pick('guarantee') : 'ตัวจริงตรงรูป 100%';

            const finalTitle = `${displayName} รับงานไซด์ไลน์${province} | ${g} ${t} (${YEAR_TH})`;
            const finalDesc = `โปรไฟล์ ${displayName} สำหรับรับงานไซด์ไลน์ในพื้นที่ ${workArea}. ${priceInfo}. ${detailsSnippet}. ${g} และ ${t} 100%. ปลอดภัย จ่ายเงินหน้างาน. (อัปเดต ${CURRENT_DATE})`;

            document.title = finalTitle;
            updateMeta('description', finalDesc);
            updateMeta('keywords', `${displayName}, ไซด์ไลน์${province}, รับงาน${province}, เพื่อนเที่ยว${province}`);
            updateLink('canonical', profileUrl);
            
            updateOpenGraphMeta(profile, finalTitle, finalDesc, 'profile');
            
            injectSchema(generatePersonSchema(profile, finalDesc, province), 'schema-jsonld-person');
            injectSchema(generateBreadcrumbSchema([
                { name: "หน้าแรก", url: CONFIG.SITE_URL },
                { name: `ไซด์ไลน์${province}`, url: provinceUrl },
                { name: displayName, url: profileUrl }
            ]), 'schema-jsonld-breadcrumb');
        }
        else if (pageData) {
            const province = pageData.provinceName || 'เชียงใหม่';
            const pageUrl = pageData.canonicalUrl || window.location.href;
            const pageTitle = `ไซด์ไลน์${province} รับงานเอง ตรงปกไม่มัดจำ (${YEAR_TH})`;
            const pageDesc = `รวมน้องๆ เพื่อนเที่ยวไซด์ไลน์${province} รับงานเอง พิกัด${province}. อัปเดตล่าสุดวันต่อวัน ${CURRENT_DATE}. ปลอดภัย จ่ายเงินหน้างาน ไม่ต้องโอนมัดจำ.`;

            document.title = pageTitle;
            updateMeta('description', pageDesc);
            updateMeta('keywords', `ไซด์ไลน์${province}, รับงาน${province}, เด็กเอ็น${province}, เพื่อนเที่ยว${province}`);
            updateLink('canonical', pageUrl);
            updateOpenGraphMeta(null, pageTitle, pageDesc, 'website');
            
            injectSchema(generateListingSchema(pageData), 'schema-jsonld-list');
            injectSchema(generateBreadcrumbSchema([
                { name: "หน้าแรก", url: CONFIG.SITE_URL },
                { name: `ไซด์ไลน์${province}`, url: pageUrl }
            ]), 'schema-jsonld-breadcrumb');
        }
    }

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
            dom.resultCount.innerHTML = `✅ พบ <span class="font-bold" style="color: var(--primary-purple);">${formattedCount}</span> โปรไฟล์ที่ตรงตามเงื่อนไข`;
            dom.resultCount.classList.remove('hidden', 'no-results');
            dom.resultCount.style.display = 'block';
        } else {
            dom.resultCount.innerHTML = '❌ ไม่พบโปรไฟล์ตามเงื่อนไข';
            dom.resultCount.classList.add('no-results');
            dom.resultCount.classList.remove('hidden');
            dom.resultCount.style.display = 'block';
        }
    }

    function initHeaderScrollEffect() {
        if (!dom.pageHeader) return;
        
        let isScrolledPrev = null;
        const updateHeader = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled === isScrolledPrev) return; 
            isScrolledPrev = isScrolled;
            
            dom.pageHeader.classList.toggle('scrolled', isScrolled);
            
            if (isScrolled) {
                dom.pageHeader.style.setProperty('background', 'rgba(13, 8, 30, 0.85)', 'important');
                dom.pageHeader.style.setProperty('backdrop-filter', 'blur(20px)', 'important');
                dom.pageHeader.style.setProperty('webkitBackdropFilter', 'blur(20px)', 'important');
                dom.pageHeader.style.setProperty('boxShadow', '0 10px 40px rgba(0, 0, 0, 0.6)', 'important');
                dom.pageHeader.style.setProperty('borderColor', 'rgba(147, 51, 234, 0.4)', 'important');
            } else {
                dom.pageHeader.style.setProperty('background', 'rgba(13, 8, 30, 0.65)', 'important');
                dom.pageHeader.style.setProperty('backdrop-filter', 'blur(16px)', 'important');
                dom.pageHeader.style.setProperty('webkitBackdropFilter', 'blur(16px)', 'important');
                dom.pageHeader.style.setProperty('boxShadow', '0 10px 30px rgba(0, 0, 0, 0.4)', 'important');
                dom.pageHeader.style.setProperty('borderColor', 'rgba(147, 51, 234, 0.25)', 'important');
            }
        };

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader(); 
    }

    function initMarqueeEffect() {
        const marquee = document.querySelector('.social-marquee');
        if (!marquee || marquee.dataset.initialized) return;

        marquee.dataset.initialized = "true";
        marquee.innerHTML += marquee.innerHTML; 

        let scroll = 0;
        let speed = 0.6; 
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

    function initThemeToggle() {
        const btns = document.querySelectorAll('.theme-toggle-btn');
        const icons = document.querySelectorAll('.theme-toggle-icon');

        const apply = (theme) => {
            const isDark = theme === 'dark';
            document.documentElement.classList.toggle('dark', isDark);
            localStorage.setItem(CONFIG.KEYS.THEME, theme);

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

        const saved = localStorage.getItem(CONFIG.KEYS.THEME) || 'dark';
        apply(saved);

        btns.forEach(b => {
            b.onclick = () => {
                const current = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
                apply(current);
            };
        });
    }

    function initMobileMenu() {
        const btn = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar-menu'); 
        const backdrop = document.getElementById('sidebar-overlay'); 
        const close = document.getElementById('close-menu-btn'); 
        
        if (!btn || !sidebar) return;

        const toggle = (open) => {
            sidebar.classList.toggle('active', open); 
            if (backdrop) {
                backdrop.style.display = open ? 'block' : 'none';
                setTimeout(() => backdrop.style.opacity = open ? '1' : '0', 10);
            }
            document.body.style.overflow = open ? 'hidden' : '';
            document.body.style.touchAction = open ? 'none' : '';
        };

        btn.onclick = () => toggle(true);
        if (close) close.onclick = () => toggle(false);
        if (backdrop) backdrop.onclick = () => toggle(false);
        
        sidebar.querySelectorAll('a').forEach(link => {
            link.onclick = () => toggle(false);
        });
    }

    function updateActiveNavLinks() {
        const path = window.location.pathname;
        document.querySelectorAll('nav a').forEach(l => {
            const isActive = l.getAttribute('href') === path;
            l.classList.toggle('active', isActive);
            
            l.style.color = isActive ? 'var(--primary-purple)' : '#D4D4D8';
            l.style.fontWeight = isActive ? '800' : '600';
            
            if (isActive) {
                l.setAttribute('aria-current', 'page');
            }
        });
    }

    function createGlobalLoader() {
        if (document.getElementById('global-loader-overlay')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin-clockwise-loader {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes pulse-glow-loader {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255, 46, 99, 0.2)); }
                50% { transform: scale(1.1); filter: drop-shadow(0 0 15px rgba(255, 46, 99, 0.7)); }
            }
            @keyframes text-blink-loader {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 1; }
            }
            .anim-spin-slow-loader { animation: spin-clockwise-loader 2s linear infinite; }
            .anim-pulse-loader { animation: pulse-glow-loader 1.5s infinite ease-in-out; }
            .anim-blink-loader { animation: text-blink-loader 1.5s infinite ease-in-out; }
        `;
        document.head.appendChild(style);

        const loaderHTML = `
            <div id="global-loader-overlay" 
                 style="position: fixed; inset: 0; z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #07070a; transition: opacity 0.4s ease; pointer-events: all;" 
                 class="dark:bg-[#07070a]">
                
                <div style="position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                    <div style="position: absolute; inset: 0; border-radius: 9999px; border: 2px dashed rgba(212, 175, 55, 0.15);" class="anim-spin-slow-loader"></div>
                    <div style="position: absolute; inset: 6px; border-radius: 9999px; border: 2.5px solid transparent; border-top-color: #D4AF37; border-right-color: #FCF6BA;" class="anim-spin-slow-loader"></div>
                    
                    <div style="position: relative; z-index: 10; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: linear-gradient(135deg, #FF2E63 0%, #FF8E53 100%); box-shadow: 0 10px 30px -5px rgba(255, 46, 99, 0.5);" class="anim-pulse-loader">
                        <i class="fas fa-heart" style="font-size: 18px; color: #ffffff;"></i>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <h3 class="anim-blink-loader" style="font-size: 14px; font-weight: 700; color: #D4AF37; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;">
                        กำลังตรวจสอบโปรไฟล์ตรงปก...
                    </h3>
                    <p style="font-size: 10px; color: #6b7280; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;">
                        SIDELINE CHIANGMAI PREMIUM SELECTION
                    </p>
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
        loader.style.pointerEvents = 'all';
        loader.style.display = 'flex';
        
        try {
            if (window.gsap) {
                gsap.killTweensOf(loader);
                gsap.set(loader, { opacity: 0 });
                gsap.to(loader, { opacity: 1, duration: 0.2, ease: 'power2.out' });
            } else {
                loader.style.opacity = '1';
            }
        } catch (e) {
            loader.style.opacity = '1';
        }
    }

    function hideLoadingState() {
        const loader = document.getElementById('global-loader-overlay');
        if (loader) {
            loader.style.pointerEvents = 'none'; 
            try {
                if (window.gsap) {
                    gsap.killTweensOf(loader);
                    gsap.to(loader, {
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.inOut",
                        onComplete: () => {
                            loader.style.display = 'none';
                            if (window.ScrollTrigger) ScrollTrigger.refresh();
                        }
                    });
                } else {
                    loader.style.display = 'none';
                }
            } catch (e) {
                loader.style.display = 'none';
            }
        }
        if (dom.loadingPlaceholder) {
            dom.loadingPlaceholder.style.display = 'none';
        }
    }

    function initMobileSitemapTrigger() {
        const ghostBtn = document.createElement('div');
        Object.assign(ghostBtn.style, { position: 'fixed', bottom: '0', right: '0', width: '60px', height: '60px', zIndex: '99999', cursor: 'pointer', background: 'transparent', touchAction: 'manipulation' });
        document.body.appendChild(ghostBtn);
        let clicks = 0; let timeout;
        ghostBtn.addEventListener('click', (e) => {
            e.preventDefault(); clicks++; clearTimeout(timeout);
            timeout = setTimeout(() => { clicks = 0; }, 1500);
            if (clicks >= 5) {
                if (navigator.vibrate && typeof navigator.vibrate === 'function') {
                    try { navigator.vibrate([100, 50, 100]); } catch(e) {}
                }
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

        urls.push({ loc: processUrl(''), priority: '1.0', freq: 'daily' });

        state.allProfiles.forEach(p => { 
            if (p.slug) { 
                let imageTag = '';
                if (p.images && p.images.length > 0 && p.images[0].src) {
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
                    imageXml: imageTag 
                }); 
            } 
        });

        if (state.provincesMap && state.provincesMap.size > 0) { 
            state.provincesMap.forEach((name, key) => { 
                urls.push({ loc: processUrl(`location/${key}`), priority: '0.8', freq: 'daily' }); 
            }); 
        }

        ['blog.html', 'about.html', 'faq.html', 'profiles.html', 'locations.html'].forEach(page => { 
            urls.push({ loc: processUrl(page), priority: '0.7', freq: 'weekly' }); 
        });

        const xmlContent = urls.map(u => 
            `<url>
                <loc>${u.loc}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>${u.freq}</changefreq>
                <priority>${u.priority}</priority>${u.imageXml || ''}
            </url>`
        ).join(''); 

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

    async function initFooterLinks() {
    const footerContainer = document.getElementById('popular-locations-footer');
    if (!footerContainer) return;

    // การตั้งค่า Smart Cache
    const CACHE_KEY = 'smart_cache_provinces';
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // กำหนดอายุ Cache ไว้ที่ 24 ชั่วโมง
    
    let provincesList = [];
    let shouldUpdateCache = false;

    // ลำดับ 1: ดึงจาก Memory (window.state)
    if (window.state?.provincesMap && window.state.provincesMap.size > 0) {
        window.state.provincesMap.forEach((name, key) => {
            provincesList.push({ key: key, name: name });
        });
    } else {
        // ลำดับ 2: ดึงจาก Smart Cache (LocalStorage)
        try {
            const cachedString = localStorage.getItem(CACHE_KEY);
            if (cachedString) {
                const cachedData = JSON.parse(cachedString);
                const now = new Date().getTime();
                
                // ตรวจสอบว่า Cache ยังไม่หมดอายุ และมีข้อมูลอยู่จริง
                if (cachedData.timestamp && (now - cachedData.timestamp < CACHE_TTL_MS) && Array.isArray(cachedData.data)) {
                    provincesList = cachedData.data;
                    console.log('⚡ Loaded provinces from Smart Cache');
                }
            }
        } catch (error) {
            console.warn("Smart Cache read failed, proceeding to network fetch:", error);
        }

        // ลำดับ 3: ดึงจาก Supabase (Network Fetch) กรณีไม่มี Cache หรือหมดอายุ
        if (provincesList.length === 0 && window.supabase) {
            try {
                const { data } = await window.supabase.from('provinces').select('*');
                if (data) {
                    provincesList = data.map(p => ({
                        key: p.key || p.slug || p.id,
                        name: p.nameThai || p.name_thai || p.name
                    })).filter(p => p.key && p.name);
                    
                    shouldUpdateCache = true; // ตั้งค่า Flag เพื่อบอกให้บันทึก Cache ใหม่
                }
            } catch (e) { 
                console.warn("Supabase fetch failed", e); 
            }
        }
    }

    // เขียนข้อมูลลง Smart Cache ถ้ามีการดึงข้อมูลใหม่จาก Supabase
    if (shouldUpdateCache && provincesList.length > 0) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: new Date().getTime(),
                data: provincesList
            }));
            console.log('💾 Smart Cache for provinces updated');
        } catch (error) {
            console.warn("Smart Cache write failed (Quota exceeded?):", error);
        }
    }

    // เรียงตามอักษรภาษาไทย
    provincesList.sort((a, b) => a.name.localeCompare(b.name, 'th'));

    // นำตัว Loading ออก
    const loadingPulse = footerContainer.querySelector('.animate-pulse');
    if (loadingPulse) {
        loadingPulse.parentElement.remove();
    }

    const displayLimit = 20; 
    let addedCount = footerContainer.querySelectorAll('li:not(.view-all-link)').length;

    // สร้าง Set เพื่อเช็คความซ้ำซ้อนแบบ O(1)
    const existingKeys = new Set(
        Array.from(footerContainer.querySelectorAll('a[href*="/location/"]'))
             .map(a => a.getAttribute('href').split('/').pop())
    );

    // ใช้ DocumentFragment เพื่อลดการเกิด DOM Reflow / Repaint
    const fragment = document.createDocumentFragment();

    for (const p of provincesList) {
        if (addedCount >= displayLimit) break;

        if (!existingKeys.has(p.key)) {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="/location/${p.key}" 
                   title="ดูรายชื่อไซด์ไลน์ในจังหวัด ${p.name}" 
                   style="color: var(--text-gray); text-decoration: none; transition: color 0.2s;"
                   onmouseenter="this.style.color='var(--primary-purple)'"
                   onmouseleave="this.style.color='var(--text-gray)'">
                   ไซด์ไลน์${p.name}
                </a>`;
            fragment.appendChild(li);
            addedCount++;
            existingKeys.add(p.key);
        }
    }

    // สร้างลิงก์ "ดูทั้งหมด" ถ้ามีจำนวนเหลือ
    if (provincesList.length > addedCount && !footerContainer.querySelector('.view-all-link')) {
        const viewAll = document.createElement('li');
        viewAll.className = 'view-all-link';
        viewAll.innerHTML = `
            <a href="/profiles.html" 
               style="color: var(--primary-purple); font-weight: 700; text-decoration: underline; margin-top: 8px; display: inline-block;">
               ดูจังหวัดอื่นๆ ทั้งหมด (${provincesList.length})
            </a>`;
        fragment.appendChild(viewAll);
    }

    // นำ Fragment ใส่ DOM ในครั้งเดียว
    footerContainer.appendChild(fragment);
}

/* ==============================================================
   โซนที่ 1: COMPACT OVERRIDE PACK (ฟังก์ชันระดับ Global)
   ต้องรันก่อนเสมอ เพื่อให้ UI และ Event ต่างๆ เรียกใช้ได้ทันที
============================================================== */
(function () {
  'use strict';

  const __compactText = {
    empty: 'ไม่พบข้อมูล',
    loading: 'กำลังโหลด...',
    noResult: 'ไม่พบผลลัพธ์ที่ตรงกับเงื่อนไข',
    error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
  };

  window.getCleanName = function (rawName) {
    if (!rawName || typeof rawName !== 'string') return '';
    let name = rawName.trim().replace(/^(น้อง\s?)/, '');
    if (!name) return '';
    name = name.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return `น้อง${name}`;
  };

  window.formatDate = function (dateString) {
    if (!dateString) return 'ไม่ระบุ';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      if (diffInSeconds < 60) return 'เมื่อครู่นี้';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชม.ที่แล้ว`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} วันที่แล้ว`;
      const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${(date.getFullYear() + 543).toString().slice(-2)}`;
    } catch {
      return 'ไม่ระบุ';
    }
  };

  window.saveRecentSearch = function (term) {
    if (!term || !term.trim()) return;
    try {
      const key = 'recent_searches';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = arr.filter(t => String(t).toLowerCase() !== String(term).toLowerCase());
      filtered.unshift(term.trim());
      localStorage.setItem(key, JSON.stringify(filtered.slice(0, 10)));
    } catch {}
  };

  window.showErrorState = function (error) {
    console.error('Compact patch error:', error);
    const area = document.getElementById('profiles-display-area');
    const loading = document.getElementById('loading-profiles-placeholder');
    const fetchError = document.getElementById('fetch-error-message');
    const noResults = document.getElementById('no-results-message');
    const featured = document.getElementById('featured-profiles');
    const loadMore = document.getElementById('load-more-container');

    if (loading) loading.classList.add('hidden');
    if (featured) featured.classList.add('hidden');
    if (loadMore) loadMore.style.display = 'none';
    if (fetchError) fetchError.classList.add('hidden');
    if (noResults) noResults.classList.add('hidden');

    if (area) {
      area.classList.remove('hidden');
      area.innerHTML = `
        <div style="text-align:center;padding:32px 16px;max-width:520px;margin:0 auto;border:1px solid rgba(239,68,68,0.14);background:rgba(127,29,29,0.08);border-radius:20px;color:#FCA5A5;">
          <div style="font-size:34px;line-height:1;margin-bottom:12px;">!</div>
          <div style="font-size:15px;font-weight:800;color:#fff;margin-bottom:8px;">${__compactText.error}</div>
          <div style="font-size:12px;line-height:1.6;color:#D4D4D8;">โปรดลองรีเฟรชหน้าเว็บ หรือรอสักครู่แล้วเปิดใหม่อีกครั้ง</div>
        </div>
      `;
    }
  };

  window.processProfileData = function (p) {
    if (!p) return null;
    const displayName = window.getCleanName ? window.getCleanName(p.name) : (p.name || '');
    const rawGallery = Array.isArray(p.galleryPaths) ? p.galleryPaths : [];
    const imagePaths = [p.imagePath, ...rawGallery].filter(Boolean);
    const uniquePaths = [...new Set(imagePaths)];
    const images = uniquePaths.map(path => ({
      src: path,
      fullSrc: path
    }));
    const firstImage = images[0]?.src || '/images/sidelinechiangmai-social-preview.webp';
    const provinceName = p.provinceThai || p.provinceNameThai || p.provinceKey || '';
    const numericPrice = Number(String(p.rate || '').replace(/[^\d]/g, '')) || 0;
    const displayPrice = numericPrice > 0 ? numericPrice.toLocaleString() : '';
    const searchString = [
      displayName,
      p.slug,
      provinceName,
      p.location,
      p.description,
      p.availability,
      p.stats,
      p.skinTone || p.skintone,
      p.age
    ].filter(Boolean).join(' ').toLowerCase();

    return {
      ...p,
      displayName,
      images,
      firstImage,
      provinceNameThai: provinceName,
      displayPrice,
      price: numericPrice,
      searchString,
      safeAge: p.age || '-',
      safeHeight: p.height || '-',
      safeWeight: p.weight || '-',
      isVerified: p.verified === true,
      hasVideo: p.hasVideo || p.hasvideo === true
    };
  };

  window.renderProfileCardCompact = function (profile) {
    if (!profile) return '';
    const name = escapeHtml(profile.displayName || profile.name || '');
    const location = escapeHtml(profile.location || profile.provinceNameThai || '');
    const img = profile.images?.[0]?.src || profile.firstImage || '/images/sidelinechiangmai-social-preview.webp';
    const slug = encodeURIComponent(profile.slug || '');
    const statusText = /available|ว่าง|พร้อม|รับงาน/i.test(String(profile.availability || '')) ? 'Available' : 'Busy';
    const statusClass = statusText === 'Available' ? 'status-available-neon' : 'status-busy-neon';
    const rate = profile.displayPrice ? `<span>${profile.displayPrice}</span>` : '';

    return `
      <div class="profile-card-new-container">
        <div class="profile-card-new interactive-card" data-profile-id="${profile.id || ''}" data-profile-slug="${slug}" style="aspect-ratio:3/4;width:100%;position:relative;border-radius:18px;overflow:hidden;background-color:#09090B;border:1px solid rgba(255,255,255,0.05);box-shadow:0 4px 18px rgba(0,0,0,0.35);cursor:pointer;">
          <img src="${img}" alt="${name}" width="300" height="400" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.86);z-index:0;" />
          <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.42) 45%, transparent 80%);z-index:10;pointer-events:none;"></div>

          <div style="position:absolute;top:10px;left:10px;z-index:30;">
            <span class="neon-badge ${statusClass}" style="background-color:rgba(0,0,0,0.6);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);font-size:10px;font-weight:700;padding:4px 10px;border-radius:999px;color:white;display:flex;align-items:center;gap:6px;">
              <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:${statusText === 'Available' ? '#00E676' : '#FF2E63'};box-shadow:0 0 6px ${statusText === 'Available' ? '#00E676' : '#FF2E63'};"></span>
              ${statusText}
            </span>
          </div>

          ${profile.isfeatured ? `
          <div style="position:absolute;top:42px;left:10px;z-index:30;">
            <span style="background-color:#5A2CBE;color:white;font-size:9px;font-weight:800;padding:4px 10px;border-radius:999px;box-shadow:0 4px 10px rgba(90,44,190,0.3);display:flex;align-items:center;gap:4px;">
              <i class="fas fa-star" style="font-size:8px;"></i> FEATURED
            </span>
          </div>` : ''}

          <div style="position:absolute;top:10px;right:10px;z-index:30;">
            <button type="button" class="profile-card-like-btn" data-action="like" data-id="${profile.id || ''}" aria-label="Like profile" style="width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.1);color:white;display:flex;align-items:center;justify-content:center;">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>

          <a href="/sideline/${slug}" class="card-link" style="position:absolute;inset:0;z-index:25;" aria-label="${name}"></a>

          <div style="position:absolute;bottom:0;left:0;right:0;padding:14px;z-index:20;text-align:left;pointer-events:none;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;">
              <h3 style="font-size:14px;font-weight:800;color:white;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 2px 4px rgba(0,0,0,0.8);flex:1;min-width:0;">${name}</h3>
              ${rate}
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#D4D4D8;gap:8px;">
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,0.8);flex:1;min-width:0;">
                <i class="fas fa-map-marker-alt" style="color:#C084FC;margin-right:4px;"></i>${location}
              </span>
              <span style="text-shadow:0 1px 2px rgba(0,0,0,0.8);white-space:nowrap;">${profile.safeAge || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  window.renderProfiles = function (profiles, append = false) {
    const area = document.getElementById('profiles-display-area');
    if (!area) return;
    const list = Array.isArray(profiles) ? profiles : [];
    const html = list.map(window.renderProfileCardCompact).join('');

    if (!append) area.innerHTML = '';
    area.classList.remove('hidden');

    const grid = document.createElement('div');
    grid.className = 'profiles-grid-row';
    grid.innerHTML = html || `
      <div style="grid-column:1/-1;text-align:center;padding:28px 16px;color:#A1A1AA;">
        <div style="font-size:14px;font-weight:700;">${__compactText.noResult}</div>
      </div>
    `;
    area.appendChild(grid);
  };

  window.updateUltimateSuggestions = function (val) {
    const box = document.getElementById('search-suggestions');
    if (!box) return;
    const q = String(val || '').trim();

    if (!q) {
      const recents = JSON.parse(localStorage.getItem('recent_searches') || '[]');
      if (!recents.length) {
        box.classList.add('hidden');
        return;
      }
      box.innerHTML = `
        <div style="background:#121214;border:1px solid rgba(147,51,234,0.25);border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <div style="padding:10px 16px;background:#09090B;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Recent searches</span>
          </div>
          ${recents.slice(0,5).map(term => `
            <div class="suggestion-item" data-action="suggestion" data-slug="${String(term).replace(/"/g,'&quot;')}" data-is-profile="false" style="padding:12px 16px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.03);">
              <span style="font-size:13px;color:#fff;font-weight:600;">${escapeHtml(term)}</span>
            </div>
          `).join('')}
        </div>
      `;
      box.classList.remove('hidden');
      return;
    }

    const items = (window.state?.allProfiles || []).slice(0, 8).filter(p => {
      const s = String(p.searchString || '').toLowerCase();
      return s.includes(q.toLowerCase());
    }).slice(0, 5);

    if (!items.length) {
      box.classList.add('hidden');
      return;
    }

    box.innerHTML = `
      <div style="background:#121214;border:1px solid rgba(147,51,234,0.25);border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
        <div style="padding:10px 16px;background:#09090B;border-bottom:1px solid rgba(255,255,255,0.05);">
          <span style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Results</span>
        </div>
        ${items.map(item => `
          <div class="suggestion-item" data-action="suggestion" data-slug="${item.slug}" data-is-profile="true" style="display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.03);">
            <div style="width:40px;height:40px;flex:0 0 40px;overflow:hidden;border-radius:50%;border:1px solid rgba(255,255,255,0.08);">
              <img src="${item.images?.[0]?.src || '/images/sidelinechiangmai-social-preview.webp'}" alt="" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <div style="flex:1;min-width:0;text-align:left;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                <span style="font-size:13px;font-weight:800;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(item.displayName || item.name || '')}</span>
                <span style="font-size:9px;background:rgba(255,255,255,0.05);padding:2px 6px;border-radius:4px;color:var(--text-gray);font-weight:700;">${escapeHtml(String(item.safeAge || '-'))}</span>
              </div>
              <div style="font-size:11px;color:var(--text-gray);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                <i class="fas fa-map-marker-alt" style="font-size:9px;color:var(--primary-purple);margin-right:4px;"></i>${escapeHtml(item.provinceNameThai || '')}
              </div>
            </div>
            <i class="fas fa-chevron-right" style="color:rgba(255,255,255,0.15);font-size:10px;"></i>
          </div>
        `).join('')}
      </div>
    `;
    box.classList.remove('hidden');
  };

  window.showRecentSearches = function () {
    window.updateUltimateSuggestions('');
  };

  window.applyUltimateFilters = function (preserveScroll = false) {
    const input = document.getElementById('search-keyword');
    const province = document.getElementById('search-province');
    const availability = document.getElementById('search-availability');
    const featured = document.getElementById('search-featured');
    const sort = document.getElementById('sort-select');
    const area = document.getElementById('profiles-display-area');
    const resultCount = document.getElementById('result-count');
    const noResults = document.getElementById('no-results-message');

    let data = Array.isArray(window.state?.allProfiles) ? [...window.state.allProfiles] : [];
    const q = String(input?.value || '').trim().toLowerCase();
    const pv = String(province?.value || '').trim().toLowerCase();
    const av = String(availability?.value || '').trim().toLowerCase();
    const ft = String(featured?.value || '').trim().toLowerCase();

    if (q) data = data.filter(p => String(p.searchString || '').toLowerCase().includes(q));
    if (pv) data = data.filter(p => String(p.provinceKey || '').toLowerCase() === pv);
    if (av) {
      data = data.filter(p => {
        const s = String(p.availability || '').toLowerCase();
        return av === 'available' ? /available|ว่าง|รับงาน/.test(s) : /notavailable|busy|ไม่ว่าง|ปิด/.test(s);
      });
    }
    if (ft) data = data.filter(p => String(Boolean(p.isfeatured)) === ft);

    switch (String(sort?.value || 'featured')) {
      case 'nameasc':
        data.sort((a, b) => String(a.displayName || a.name || '').localeCompare(String(b.displayName || b.name || ''), 'th'));
        break;
      case 'namedesc':
        data.sort((a, b) => String(b.displayName || b.name || '').localeCompare(String(a.displayName || a.name || ''), 'th'));
        break;
      case 'rating':
        data.sort((a, b) => (Number(b.rate) || 0) - (Number(a.rate) || 0));
        break;
      default:
        data.sort((a, b) => Number(Boolean(b.isfeatured)) - Number(Boolean(a.isfeatured)));
    }

    if (resultCount) resultCount.textContent = `${data.length}`;
    if (area) {
      area.innerHTML = '';
      window.renderProfiles(data, false);
    }

    if (noResults) {
      noResults.style.display = data.length ? 'none' : 'block';
      noResults.textContent = data.length ? '' : __compactText.noResult;
    }

    if (!preserveScroll) {
      const top = document.getElementById('search-section');
      if (top) top.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.openLightbox = function (profile) {
    const lb = document.getElementById('lightbox');
    const title = document.getElementById('lightbox-profile-name-main');
    const hero = document.getElementById('lightboxHeroImage');
    const strip = document.getElementById('lightboxThumbnailStrip');
    const tags = document.getElementById('lightboxTags');
    const quote = document.getElementById('lightboxQuote');
    const details = document.getElementById('lightboxDetailsCompact');
    const descWrap = document.getElementById('lightboxDescriptionContainer');
    const descContent = document.getElementById('lightboxDescriptionContent');

    if (!lb || !profile) return;

    title && (title.textContent = profile.displayName || profile.name || '');
    if (hero) hero.src = profile.images?.[0]?.fullSrc || profile.images?.[0]?.src || profile.firstImage || '/images/sidelinechiangmai-social-preview.webp';

    if (strip) {
      strip.innerHTML = (profile.images || []).slice(0, 6).map(img => `
        <button type="button" style="width:52px;height:72px;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);background:none;padding:0;flex:0 0 auto;">
          <img src="${img.src}" alt="" style="width:100%;height:100%;object-fit:cover;" />
        </button>
      `).join('');
    }

    if (tags) {
      tags.innerHTML = [
        profile.provinceNameThai,
        profile.safeAge !== '-' ? `${profile.safeAge} ปี` : '',
        profile.safeHeight !== '-' ? `${profile.safeHeight} cm` : '',
        profile.safeWeight !== '-' ? `${profile.safeWeight} kg` : ''
      ].filter(Boolean).map(t => `<span style="padding:4px 10px;border-radius:999px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);font-size:11px;color:#E5E7EB;">${escapeHtml(String(t))}</span>`).join('');
    }

    if (quote) quote.innerHTML = `<div style="font-size:12px;color:var(--text-gray);line-height:1.6;">${escapeHtml(profile.description || 'Compact profile detail')}</div>`;
    if (details) {
      details.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
          <div style="padding:12px;border-radius:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);font-size:12px;color:#D4D4D8;">Province<br><strong style="color:#fff;">${escapeHtml(profile.provinceNameThai || '')}</strong></div>
          <div style="padding:12px;border-radius:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);font-size:12px;color:#D4D4D8;">Status<br><strong style="color:#fff;">${escapeHtml(profile.availability || '')}</strong></div>
        </div>
      `;
    }

    if (descWrap && descContent) {
      if (profile.description) {
        descWrap.style.display = 'block';
        descContent.textContent = profile.description;
      } else {
        descWrap.style.display = 'none';
      }
    }

    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();


/* ==============================================================
   โซนที่ 2: HYDRATION & DOM INITIALIZATION
   รันเมื่อหน้าเว็บโหลดเสร็จ เชื่อมต่อข้อมูล SSR เข้ากับระบบค้นหา
============================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 2.1 เชื่อมต่อข้อมูล JSON จาก Edge Function เข้าสู่ State (หัวใจของระบบ Filter/Search)
    window.state = window.state || {};
    
    // สมมติว่าใน HTML ดั้งเดิมของคุณ (หลัง Edge Function ทำงาน) มีสคริปต์ประกาศตัวแปรระดับ Global ไว้
    // เช่น: <script> const PROFILES_DATA_FROM_SSR = {{PROFILES_JSON}}; </script>
    // ดึงข้อมูลเหล่านั้นเข้ากระบวนการ processProfileData
    if (typeof PROFILES_DATA_FROM_SSR !== 'undefined' && Array.isArray(PROFILES_DATA_FROM_SSR)) {
        window.state.allProfiles = PROFILES_DATA_FROM_SSR.map(window.processProfileData);
    } else {
        // Fallback เผื่อใช้ตัวแปรชื่ออื่น หรือให้ดึงจาก DOM แทน
        console.warn('SSR Data not found natively, client search might be empty.');
        window.state.allProfiles = []; 
    }

    // 2.2 อัปเดตวันที่เวอร์ชันไทย
    const now = new Date();
    const thaiDate = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeEl = document.getElementById('last-updated-time');
    if (timeEl) timeEl.innerText = thaiDate;
});


/* ==============================================================
   โซนที่ 3: PWA SERVICE WORKER
   แยกออกมาต่างหากเพื่อความคลีน ให้ทำงานหลังจากองค์ประกอบหลักเสร็จแล้ว
============================================================== */
if ('serviceWorker' in navigator) {
    const registerServiceWorker = () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('⚡ PWA: Service Worker ทำงานสำเร็จ บนขอบเขต:', registration.scope);
            })
            .catch((error) => {
                console.error('❌ PWA: การลงทะเบียน Service Worker ขัดข้อง:', error);
            });
    };

    if (document.readyState === 'complete') {
        registerServiceWorker();
    } else {
        window.addEventListener('load', registerServiceWorker);
    }
}