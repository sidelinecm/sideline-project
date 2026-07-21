
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
        ENABLE_REALTIME: false, // 🛠️ แก้ไขปัญหาที่ 3: ปิด Realtime WebSocket เป็น False ป้องกันอาการลูปเชื่อมต่อล้มเหลวจน Console Error
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
        let name = rawName.trim().replace(/^(น้อง\s?)+/g, '');
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

    // ตัวช่วยจัดการแบ่งเธรดการประมวลผลโค้ดที่ไม่ได้มีความจำเป็นเร่งด่วน (INP / TBT Optimization)
    function runDeferredTask(fn, delay = 0) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => fn());
        } else {
            setTimeout(fn, delay);
        }
    }

    document.addEventListener('DOMContentLoaded', initApp);
    async function initApp() {
        console.log("🚀 App Initializing...");
        
        initializeSupabase();
        cacheDOMElements();

        initThemeToggle();
        initMobileMenu();
        initGlobalClickListener();
        initAccordion(); // 🛠️ แก้ไขปัญหาที่ 1 & 4: ดึงคำสั่งควบคุม Accordion สลับเปลี่ยน aria-expanded มารันที่นี่แบบรวมศูนย์
        initStarRating(); // 🛠️ แก้ไขปัญหาที่ 1 & 4: ดึงคำสั่งตั้งระดับคะแนนดาวมารันที่นี่แบบรวมศูนย์แทนการเขียนซ้ำใน index.html
        updateActiveNavLinks();
        initLightboxEvents(); 

        await handleRouting();
        await handleDataLoading();
        
        // เรียกใช้งานระบบกวาดล้างตัวแปรแผนสำรอง (Fallback)
        clearRawPlaceholdersFallback();
         
        // ปรับหน่วงระบบและไลบรารีเสริมเพื่อให้ประมวลผล FCP ของหน้าจอเสร็จสมบูรณ์ก่อน
        runDeferredTask(() => {
            initHeaderScrollEffect();
            initMarqueeEffect();
            initMobileSitemapTrigger();
            initFooterLinks();
            initReviewForm();
        }, 1200);
         
        const yearSpan = document.getElementById('currentYearDynamic');
        if (yearSpan) yearSpan.textContent = "2026";
        document.body.classList.add('loaded');
        console.log("✅ App Initialized Successfully!");

        requestAnimationFrame(() => {
            if (window.location.pathname === '/' && !state.currentProfileSlug) {
                try {
                    const heroElements = document.querySelectorAll('#hero-h1, #hero-p, #hero-form');
                    if (heroElements.length > 0 && window.gsap) {
                        gsap.from(heroElements, { y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.3 });
                    }
                } catch (e) { console.warn("Animation skipped", e); }
            }
        });

        window.addEventListener('popstate', async () => {
            await handleRouting();
            updateActiveNavLinks();
        });
    }

    function clearRawPlaceholdersFallback() {
        const activeProvinceKey = (dom.provinceSelect && dom.provinceSelect.value) 
            || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) 
            || "chiangmai";
        const provinceName = state.provincesMap.get(activeProvinceKey) || "เชียงใหม่";

        const dynamicSchemaEl = document.getElementById('dynamic-schema');
        if (dynamicSchemaEl && dynamicSchemaEl.textContent.includes('{{SCHEMA_JSON}}')) {
            console.warn("⚠️ Found raw schema placeholder. Injecting clean default website schema.");
            const defaultWebsiteSchema = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": CONFIG.SITE_URL,
                "name": "Sideline Chiangmai",
                "description": "ศูนย์รวมน้องๆ ไซด์ไลน์ ฟิวแฟน ตรงปก 100% ไม่มัดจำ"
            };
            dynamicSchemaEl.textContent = JSON.stringify(defaultWebsiteSchema);
        }

        function walkAndReplace(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.nodeValue.includes('{{PROVINCE_NAME}}')) {
                    node.nodeValue = node.nodeValue.replace(/\{\{PROVINCE_NAME\}\}/g, provinceName);
                }
                if (node.nodeValue.includes('{{SEO_TITLE}}')) {
                    node.nodeValue = node.nodeValue.replace(/\{\{SEO_TITLE\}\}/g, document.title || `ไซด์ไลน์${provinceName}`);
                }
                if (node.nodeValue.includes('{{PROVINCE_ZONES}}')) {
                    node.nodeValue = node.nodeValue.replace(/\{\{PROVINCE_ZONES\}\}/g, "ตัวเมือง");
                }
                if (node.nodeValue.includes('{{SEO_DESCRIPTION}}')) {
                    node.nodeValue = node.nodeValue.replace(/\{\{SEO_DESCRIPTION\}\}/g, "");
                }
            } else {
                if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
                    for (let child of node.childNodes) {
                        walkAndReplace(child);
                    }
                }
            }
        }
        walkAndReplace(document.body);

        if (document.title.includes('{{SEO_TITLE}}') || document.title.includes('{{PROVINCE_NAME}}')) {
            document.title = `ไซด์ไลน์${provinceName} เพื่อนเที่ยวตรงปก 2026 | สาวรับงาน${provinceName} ไม่มัดจำ`;
        }
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
                    <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 16px; color: var(--primary-purple);"></i>
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

            const clearRecentBtn = target.closest('[data-action="clear-recent"]');
            if (clearRecentBtn) {
                event.preventDefault();
                event.stopPropagation();
                if (typeof window.clearRecentSearches === 'function') {
                    window.clearRecentSearches();
                }
                return; 
            }

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

        if (window.profilesData && window.profilesData.length > 0) {
            console.log("⚡ [Hydration] โหลดสเปกรายชื่อโปรไฟล์สำเร็จจาก SSR!");
            
            try {
                const hasCachedProvinces = localStorage.getItem(CONFIG.KEYS.CACHE_PROVINCES);
                if (hasCachedProvinces) {
                    try {
                        const cachedProv = JSON.parse(hasCachedProvinces);
                        state.provincesMap.clear();
                        if (Array.isArray(cachedProv)) {
                            cachedProv.forEach(p => {
                                if (p && p.key && p.name) {
                                    state.provincesMap.set(p.key.toString(), p.name);
                                }
                            });
                        }
                    } catch (jsonErr) {
                        console.warn("⚠️ Local cached provinces parsing failed, resetting cache.", jsonErr);
                        localStorage.removeItem(CONFIG.KEYS.CACHE_PROVINCES);
                    }
                }
                
                if (state.provincesMap.size === 0 && window.supabase) {
                    try {
                        const { data } = await window.supabase.from('provinces').select('*');
                        if (data) {
                            data.forEach(p => {
                                const k = p.key || p.slug || p.id;
                                const n = p.nameThai || p.name;
                                if (k && n) state.provincesMap.set(k.toString(), n);
                            });
                            const provincesForCache = Array.from(state.provincesMap.entries()).map(([k, n]) => ({ key: k, name: n }));
                            localStorage.setItem(CONFIG.KEYS.CACHE_PROVINCES, JSON.stringify(provincesForCache));
                        }
                    } catch (e) { 
                        console.warn("Fallback provinces fetch failed", e); 
                    }
                }

                state.allProfiles = window.profilesData.map(p => {
                    try {
                        return processProfileData(p);
                    } catch (err) {
                        console.error("❌ Profile processing failed for profile:", p, err);
                        return null;
                    }
                }).filter(Boolean);
                
                initSearchAndFilters();
                populateProvinceDropdown(); 
                await handleRouting(true);

                // เรียกใช้ Realtime Subscription เฉพาะเมื่อเปิด CONFIG.ENABLE_REALTIME เป็น True เท่านั้น
                if (CONFIG.ENABLE_REALTIME) {
                    initRealtimeSubscription();
                }
                
            } catch (hydrationError) {
                console.error("❌ Hydration process crashed, falling back to network fetch:", hydrationError);
                window.profilesData = null;
                await fetchDataDelta().catch(console.error);
            } finally {
                hideLoadingState();
            }
            return; 
        }

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

                        // ควบคุมระบบอัปเดตสดแบบปลอดภัย
                        if (CONFIG.ENABLE_REALTIME) {
                            initRealtimeSubscription();
                        }
                        
                        if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');
                        if (dom.profilesDisplayArea) dom.profilesDisplayArea.classList.remove('hidden');
                        
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
        // 🛠️ แก้ไขตรงนี้: หาก CONFIG ปิดการเชื่อมต่อแบบ Realtime ให้ยกเลิกการเปิด WebSocket ทั้งหมด
        if (!CONFIG.ENABLE_REALTIME || !window.supabase) return;

        if (state.realtimeSubscription) {
            try {
                window.supabase.removeChannel(state.realtimeSubscription);
            } catch (e) { console.warn('Realtime cleanup error:', e); }
            state.realtimeSubscription = null;
        }

        console.log('📡 [Realtime] ระบบอัปเดตอัจฉริยะกำลังทำงาน...');

        let connectionRetries = 0;
        const maxRetries = 5;

        const channel = window.supabase.channel('public:profiles_realtime_sync')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'profiles' },
                (payload) => {
                    fetchDataDelta().catch(console.error);
                }
            )
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ [Realtime] เชื่อมต่อฐานข้อมูลสดเรียบร้อย!');
                    connectionRetries = 0; 
                }
                
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
                src: getOptimizedClientImage(path, 300),  
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
            if (clearBtn) clearBtn.classList.toggle('hidden', !val);
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
                if (clearBtn) clearBtn.classList.add('hidden');
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
            if (suggestionsBox) suggestionsBox.classList.add('hidden');
            if (dom.searchInput) dom.searchInput.blur();
        });

        const regionTabs = document.querySelectorAll('.region-tab');
        if (regionTabs.length > 0) {
            regionTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    regionTabs.forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    const region = e.target.dataset.region;
                    if (dom.searchInput) {
                        dom.searchInput.value = (region === 'ทั้งหมด') ? '' : region;
                        if (clearBtn) clearBtn.classList.toggle('hidden', !dom.searchInput.value);
                    }
                    
                    if (suggestionsBox) suggestionsBox.classList.add('hidden');
                    applyUltimateFilters(true);
                });
            });
        }
    }

    // ปรับเปลี่ยนโครงสร้าง saveCache และการเขียนหน่วยความจำใน localStorage แบบหน่วงแบ่งจังหวะ (Microtask caching)
    function saveCache(key, data) {
        runDeferredTask(() => {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                if (e.name === 'QuotaExceededError' || e.code === 22) {
                    console.warn("⚠️ LocalStorage full! เคลียร์พื้นที่หน่วยความจำไม่จำเป็น...");
                    localStorage.removeItem('cachedProfiles'); 
                    localStorage.removeItem('recent_searches');
                    try {
                        localStorage.setItem(key, JSON.stringify(data));
                        console.log("✅ บันทึกสำเร็จหลังล้างความจำสำรอง");
                    } catch (retryError) {
                        console.error("❌ พื้นที่จำกัดจำกัด ไม่สามารถเก็บแคชโปรไฟล์ได้", retryError);
                    }
                } else {
                    console.error("❌ Cache Error:", e);
                }
            }
        }, 1500);
    }
    
    function updateUrlFromFilters(query) {
    const currentPath = window.location.pathname;
    let targetPath = '/';
    if (query.province && query.province !== 'all' && query.province !== 'chiangmai') {
        targetPath = `/location/${query.province}`;
    }
    if (currentPath !== targetPath) {
        history.pushState(null, '', targetPath);
    }
}

    function updateUltimateSuggestions(val) {
        const box = document.getElementById('search-suggestions');
        const input = document.getElementById('search-keyword');
        const clearBtn = document.getElementById('clear-search-btn');

        if (clearBtn) clearBtn.classList.toggle('hidden', !val);
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
            // 🛠️ แก้ไขตรงนี้: แก้ไขปัญหา contrast ต่ำของ var(--primary-purple) โดยบังคับใช้รหัสสีม่วงสว่าง #C084FC โดยตรง
            headerText = `📍 น้องๆ ในจังหวัด <span style="color: #C084FC;">${name}</span>`;
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
        
        const imgSrc = (p.images && p.images.length > 0) ? p.images[0].src : '/images/placeholder-profile.webp';

        let statusClass = 'status-inquire';
        const availability = (p.availability || '').toLowerCase();
        if (availability.includes('ว่าง') || availability.includes('รับงาน')) {
            statusClass = 'status-available';
        } else if (availability.includes('ไม่ว่าง') || availability.includes('พัก') || availability.includes('ติดจอง')) {
            statusClass = 'status-busy';
        }

        const likedProfiles = JSON.parse(localStorage.getItem('liked_profiles') || '{}');
        const isLikedClass = likedProfiles[p.id] ? 'liked' : '';

        // 🛠️ ล้างชื่อซ้ำซ้อนให้มีคำนำหน้า "น้อง" เพียงหนึ่งเดียวเสมอ และเขียนระบุคีย์เวิร์ดพื้นที่ในรูปภาพหลักให้ครบถ้วน
        const rawName = p.displayName || p.name || 'สาวสวย';
        let cleanName = rawName.trim().replace(/^(น้อง\s?)+/gi, '');
        const displayName = `น้อง${cleanName}`;
        const altText = `${displayName} สาวรับงาน${p.provinceNameThai || 'เชียงใหม่'} ไซด์ไลน์${p.provinceNameThai || 'เชียงใหม่'} ฟิวแฟน`;

        const ageText = p.safeAge || p.age || '';
        const ageDisplay = (ageText && ageText !== '-') ? ` (${ageText})` : '';
        const statsDisplay = p.safeStats || p.stats || '-';
        const skinText = p.safeSkin || p.skin_tone || p.skinTone || '-';
        const isVerified = p.verified || p.isVerified;
        const hasVideo = p.has_video || p.hasVideo;

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
                 
            <div style="position: absolute; top: 12px; left: 12px; z-index: 30; pointer-events: none; display: flex; flex-direction: column; gap: 6px; align-items: flex-start;">
                <span class="neon-badge ${statusClass === 'status-available' ? 'status-available-neon' : 'status-busy-neon'}" style="background-color: rgba(0,0,0,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 100px; color: white; display: flex; align-items: center; gap: 6px;">
                    <span class="neon-dot" style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${statusClass === 'status-available' ? '#00E676' : '#FF2E63'}; box-shadow: 0 0 6px ${statusClass === 'status-available' ? '#00E676' : '#FF2E63'};"></span>
                    <span>${p.availability || 'สอบถาม'}</span>
                </span>
                
                ${p.isfeatured ? `
                <span style="background-color: #5A2CBE; border: 1px solid rgba(147, 51, 234, 0.4); color: white; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 100px; box-shadow: 0 4px 10px rgba(90, 44, 190, 0.3); display: flex; align-items: center; gap: 4px;"><i class="fas fa-star" style="font-size: 8px;"></i>แนะนำ</span>
                ` : ''}

                ${hasVideo ? `
                <span style="background-color: #FF2E63; border: 1px solid rgba(255, 46, 99, 0.4); color: white; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 100px; display: flex; align-items: center; gap: 4px;"><i class="fas fa-video" style="font-size: 8px;"></i>วิดีโอ</span>
                ` : ''}

                ${isVerified ? `
                <span style="background-color: #FBBF24; border: 1px solid rgba(251, 191, 36, 0.4); color: #000000; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 100px; display: flex; align-items: center; gap: 4px;"><i class="fas fa-check-circle" style="font-size: 8px;"></i>ยืนยันแล้ว</span>
                ` : ''}
            </div>

            <div style="position: absolute; top: 12px; right: 12px; z-index: 30; pointer-events: auto;">
                <button type="button" class="profile-card-like-btn ${isLikedClass}" data-action="like" data-id="${p.id}" aria-label="เพิ่มลงในรายการโปรด">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
            
            <a href="/sideline/${p.slug}" class="card-link" style="position: absolute; inset: 0; z-index: 25;" aria-label="ดูโปรไฟล์${displayName}"></a>

            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.5) 40%, transparent 80%); z-index: 10; pointer-events: none; border-radius: 20px;"></div>

            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; z-index: 20; pointer-events: none; text-align: left; display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 6px; width: 100%;">
                    <h3 id="profile-name-${p.id}" style="font-size: 14px; font-weight: 800; color: white; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 4px rgba(0,0,0,0.8); flex: 1; min-width: 0;">${displayName}${ageDisplay}</h3>
                </div>
                
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #D4D4D8; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.8); flex-wrap: wrap;">
                    <span style="font-family: monospace; letter-spacing: 0.05em; background-color: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 4px; color: #FFFFFF;">${statsDisplay}</span>
                    <span style="background-color: rgba(147, 51, 234, 0.2); color: #C084FC; padding: 1px 6px; border-radius: 4px; font-size: 9px;">หญิง</span>
                    ${skinText !== '-' ? `<span style="color: #A1A1AA; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75px;">${skinText}</span>` : ''}
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #D4D4D8; gap: 8px; width: 100%; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px; margin-top: 2px;">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.8); flex: 1; min-width: 0;">
                        <i class="fas fa-map-marker-alt" style="color: #C084FC; margin-right: 4px;"></i> ${p.location || 'เชียงใหม่'}
                    </span>
                    <span style="color: #00E676; font-weight: 900; font-size: 13px; text-shadow: 0 1.5px 3px rgba(0,0,0,0.9); flex-shrink: 0; white-space: nowrap;">
                        ${p.rate || 'สอบถาม'}
                    </span>
                </div>
            </div>
        `;

        cardContainer.appendChild(cardInner);
        return cardContainer;
    }

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

    function openLightbox(p) {
        const lightbox = document.getElementById('lightbox');
        const lightboxWrapper = document.getElementById('lightbox-content-wrapper-el');
        if (!lightbox) return;

        populateLightboxData(p);
        
        lightbox.classList.add('active');
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        if (window.gsap) {
            window.gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            window.gsap.fromTo(lightboxWrapper, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.2)" });
        }
    }

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
        
        if (window.location.pathname !== '/') {
            history.pushState(null, '', '/');
        }
    }

    function populateLightboxData(p) {
        if (!p) return;

        // ตัดคำว่า "น้อง" ทับซ้อนทิ้งทั้งหมด ไม่ว่าจะซ้อนกี่รอบ (เช่น น้องน้องไตเติ้ล -> ไตเติ้ล)
        const cleanName = (p.displayName || p.name || 'ไม่ระบุชื่อ')
            .trim()
            .replace(/^(น้อง\s?)+/g, '');

        const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
        const statusText = p.availability || 'สอบถาม';
        const dotColor = isAvailable ? '#00E676' : '#FF2E63';

        // 1. Header Name & Verification (เมื่อต่อคำว่า "น้อง" ด้านหน้า จะมีเพียงตัวเดียวเสมอ)
        const nameHeaderEl = document.getElementById('lightbox-profile-name-main');
        if (nameHeaderEl) {
            nameHeaderEl.innerHTML = `
                <span class="text-gradient-main" style="font-size: 24px; font-weight: 800;">น้อง${cleanName}</span>
                ${p.isVerified ? '<i class="fas fa-check-circle" style="color: #FBBF24; margin-left: 8px; font-size: 18px;"></i>' : ''}
            `;
        }

        // 2. Status Badge
        const badgeEl = document.getElementById('lightbox-availability-badge-wrapper');
        if (badgeEl) {
            badgeEl.innerHTML = `
                <span style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 6px 16px; border-radius: 100px; display: inline-flex; align-items: center; gap: 8px;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 10px ${dotColor};"></span>
                    <span style="color: white; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">${statusText}</span>
                </span>
            `;
        }

        // 3. Hero Image
        const heroImg = document.getElementById('lightboxHeroImage');
        if (heroImg) {
            heroImg.src = p?.images?.[0]?.src || p?.imagePath || '/images/placeholder-profile.webp';
        }

        // 4. Thumbnails
        const thumbStrip = document.getElementById('lightboxThumbnailStrip');
        if (thumbStrip) {
            thumbStrip.innerHTML = '';
            if (p.images && p.images.length > 1) {
                p.images.forEach((img, idx) => {
                    const thumb = document.createElement('img');
                    thumb.src = img.src;
                    thumb.style.cssText = "width: 60px; height: 70px; object-fit: cover; border-radius: 12px; cursor: pointer; border: 2px solid transparent; opacity: 0.5; transition: all 0.3s;";
                    if (idx === 0) { 
                        thumb.style.borderColor = "var(--primary-purple)"; 
                        thumb.style.opacity = "1"; 
                    }
                    thumb.onclick = () => {
                        if (heroImg) heroImg.src = img.src;
                        Array.from(thumbStrip.children).forEach(t => { 
                            t.style.borderColor = "transparent"; 
                            t.style.opacity = "0.5"; 
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
        }

        // 5. Quote
        const quoteBox = document.getElementById('lightboxQuote');
        if (quoteBox) {
            quoteBox.textContent = p.quote || "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน ยินดีที่ได้รู้จักค่ะ";
        }

        // 6. Tags
        const tagsContainer = document.getElementById('lightboxTags');
        if (tagsContainer) {
            tagsContainer.innerHTML = '';
            (Array.isArray(p.styleTags) ? p.styleTags : []).forEach(tag => {
                const span = document.createElement('span');
                span.style.cssText = "background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.3); color: #D8B4FE; font-size: 10px; padding: 4px 12px; border-radius: 100px; font-weight: 600;";
                span.textContent = tag.startsWith('#') ? tag : `#${tag}`;
                tagsContainer.appendChild(span);
            });
        }

        // 7. Bento Stats
        const compactDetailsEl = document.getElementById('lightboxDetailsCompact');
        if (compactDetailsEl) {
            compactDetailsEl.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                    <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 12px; text-align: center;"><div style="font-size: 9px; color: #71717A;">อายุ</div><div style="font-weight: 700;">${p.age || p.safeAge || '-'} ปี</div></div>
                    <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 12px; text-align: center;"><div style="font-size: 9px; color: #71717A;">สัดส่วน</div><div style="font-weight: 700;">${p.stats || p.safeStats || '-'}</div></div>
                    <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 12px; text-align: center;"><div style="font-size: 9px; color: #71717A;">ส่วนสูง</div><div style="font-weight: 700;">${p.height || p.safeHeight || '-'}</div></div>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between;"><span style="color: #A1A1AA;">ค่าขนม</span><span style="color: #10B981; font-weight: 800;">${p.rate || 'สอบถาม'}</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #A1A1AA;">พิกัดงาน</span><span style="color: white; font-weight: 600;">${p.location || 'เชียงใหม่'}</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #A1A1AA;">สีผิว</span><span style="color: white; font-weight: 600;">${p.skinTone || p.skin_tone || p.safeSkin || '-'}</span></div>
                </div>
            `;
        }

        // 8. Description
        const descContainer = document.getElementById('lightboxDescriptionContainer');
        const descContent = document.getElementById('lightboxDescriptionContent');
        if (descContent) {
            descContent.innerHTML = (p.description || `น้อง${cleanName} ยืนยันตัวตนตรงปก พร้อมให้บริการเพื่อนเที่ยวฟิวแฟนในพิกัดย่าน${p.location || 'เชียงใหม่'} ดูแลสุภาพ เรียบร้อย เป็นกันเอง สนใจสอบถามคิวงานได้เลยค่ะ`).replace(/\n/g, '<br>');
        }
        if (descContainer) {
            descContainer.style.display = 'block';
        }

        // 9. Sticky Line Button
        const detailsPanel = document.querySelector('.lightbox-details');
        if (detailsPanel) {
            const existingBtn = document.getElementById('line-btn-sticky-wrapper');
            if (existingBtn) existingBtn.remove();
            
            if (p.lineId) {
                const lineUrl = p.lineId.startsWith('http') ? p.lineId : `https://line.me/ti/p/~${p.lineId}`;
                const newBtnWrapper = document.createElement('div');
                newBtnWrapper.id = 'line-btn-sticky-wrapper';
                
                // ปรับความสูง bottom และการ padding หนีจากเมนู Floating Dock 64px ของระบบพกพาให้สวยงามขึ้น
                newBtnWrapper.style.cssText = `
                    margin-top: 20px; 
                    position: sticky; 
                    bottom: 0; 
                    padding-bottom: calc(85px + env(safe-area-inset-bottom, 0px)); 
                    z-index: 100;
                    background: transparent;
                `;
                newBtnWrapper.innerHTML = `
                    <a href="${lineUrl}" target="_blank" rel="noopener nofollow" style="display: flex; align-items: center; justify-content: center; gap: 12px; background: #06C755; color: white; padding: 16px; border-radius: 100px; font-weight: 800; text-decoration: none; box-shadow: 0 10px 25px rgba(6,199,85,0.3); transition: transform 0.2s;">
                        <i class="fab fa-line" style="font-size: 22px;"></i> แอดไลน์จองคิวน้อง${cleanName}
                    </a>
                `;
                detailsPanel.appendChild(newBtnWrapper);
            }
        }
    }

    function initLightboxEvents() {
        console.log("ℹ️ Lightbox events bound cleanly to global listener.");
    }

    const ORIGINAL_HOME_META = {
        title: "ไซด์ไลน์เชียงใหม่ เพื่อนเที่ยวตรงปก 2026 | สาวรับงานเชียงใหม่ ไม่มัดจำ",
        description: "รวมไซด์ไลน์เชียงใหม่ สาวรับงานเชียงใหม่ เพื่อนเที่ยวพรีเมียมสไตล์ฟิวแฟนตรงปก 100% ปลอดภัย จ่ายหน้างาน ไม่มีโอนมัดจำล่วงหน้า ครอบคลุมนิมมาน เจ็ดยอด สันติธรรม",
        keywords: "สาวรับงานเชียงใหม่, ไซด์ไลน์เชียงใหม่, เพื่อนเที่ยวเชียงใหม่, รับงานเชียงใหม่, สาวรับงานเชียงใหม่ ไม่มัดจำ",
        canonical: "https://sidelinechiangmai.netlify.app/",
        ogImage: "https://sidelinechiangmai.netlify.app/images/sidelinechiangmai-social-preview.webp"
    };

    let isFirstLoad = true;

    // ล้างและควบคุม schema เก่าเพื่อป้องกันการซ้อนทับ
    function clearAllDynamicSchemas() {
        const schemaIds = [
            'dynamic-schema', 'schema-jsonld-person', 'schema-jsonld-list', 'schema-jsonld-faq', 
            'schema-jsonld-breadcrumb', 'schema-jsonld-org', 'schema-jsonld-website'
        ];
        schemaIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }

    // ปรับแต่งโครงสร้าง Dynamic Meta และ Schema Client-side สอดรับตามมาตรฐานหลักเกณฑ์ SSR
    function updateAdvancedMeta(profile = null, pageData = null) {
        const currentPath = window.location.pathname.toLowerCase();
        const isRoot = currentPath === '/' || currentPath === '' || currentPath === '/index.html' || currentPath === '/index';
        
        const staticPages = ['/blog', '/about', '/faq', '/profiles', '/locations', '/contact', '/policy', '/terms-of-service', '/privacy-policy'];
        const isStaticPage = currentPath.endsWith('.html') || 
                             currentPath.endsWith('.htm') || 
                             staticPages.some(p => currentPath === p || currentPath.startsWith(p + '/'));

        if (isStaticPage) {
            return;
        }

        if (isFirstLoad) {
            isFirstLoad = false;
            console.log("SEO: First load detected. Preserving server-rendered metadata.");
            return;
        }

        if (isRoot) {
            console.log("🛡️ SEO Restoration: Restoring original home page metadata.");
            document.title = ORIGINAL_HOME_META.title;
            updateMeta('description', ORIGINAL_HOME_META.description);
            updateMeta('keywords', ORIGINAL_HOME_META.keywords);
            updateLink('canonical', ORIGINAL_HOME_META.canonical);
            
            updateMeta('og:title', ORIGINAL_HOME_META.title);
            updateMeta('og:description', ORIGINAL_HOME_META.description);
            updateMeta('og:url', ORIGINAL_HOME_META.canonical);
            updateMeta('og:type', 'website');
            updateMeta('og:image', ORIGINAL_HOME_META.ogImage);
            updateMeta('og:image:secure_url', ORIGINAL_HOME_META.ogImage);
            
            updateMeta('twitter:title', ORIGINAL_HOME_META.title);
            updateMeta('twitter:description', ORIGINAL_HOME_META.description);
            updateMeta('twitter:image', ORIGINAL_HOME_META.ogImage);

            clearAllDynamicSchemas();
            return;
        }

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
            const g = (SEO_POOL && typeof SEO_POOL.pick === 'function') ? SEO_POOL.pick('guarantees') : 'ตัวจริงตรงรูป 100%';

            // ปรับแต่งหัวข้อและคำบรรยายเฉพาะเจาะจงให้มีสัดส่วน CTR สูงขึ้น
            const finalTitle = `น้อง${displayName.replace(/^น้อง/, '')}${profile.age ? ` (${profile.age} ปี)` : ""} ไซด์ไลน์${province} เพื่อนเที่ยวตรงปก | จ่ายหน้างาน ไม่มัดจำ`;
            const finalDesc = `รายละเอียดโปรไฟล์น้อง${displayName.replace(/^น้อง/, '')} สาวรับงานไซด์ไลน์พิกัดย่าน ${workArea} ตรงปก 100% ค่าขนม ${profile.rate || "สอบถาม"} ดูแลสไตล์ฟิวแฟน ไม่มีโอนมัดจำล่วงหน้า (อัปเดต ${CURRENT_DATE})`;

            document.title = finalTitle;
            updateMeta('description', finalDesc);
            updateMeta('keywords', `${displayName}, ไซด์ไลน์${province}, รับงาน${province}, เพื่อนเที่ยว${province}`);
            updateLink('canonical', profileUrl);
            
            updateOpenGraphMeta(profile, finalTitle, finalDesc, 'profile');
            
            // สร้าง Person Schema ใหม่เฉพาะของโปรไฟล์
            injectSchema({
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": `${profileUrl}/#person`,
                "name": `น้อง${displayName.replace(/^น้อง/, '')}`,
                "url": profileUrl,
                "image": profile.images && profile.images[0] ? profile.images[0].fullSrc : CONFIG.DEFAULT_OG_IMAGE,
                "description": finalDesc,
                "jobTitle": "Freelance Companion & Entertainer",
                "gender": "Female",
                "knowsAbout": ["Companion Services", "Tour Guide Services", "Entertainment Services"],
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": profile.location || province,
                    "addressRegion": province,
                    "addressCountry": "TH"
                },
                "offers": {
                    "@type": "Offer",
                    "url": profileUrl,
                    "price": (profile.rate || "0").toString().replace(/\D/g, ""),
                    "priceCurrency": "THB",
                    "priceValidUntil": "2027-12-31",
                    "availability": !["ติดจอง", "not_available", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (profile.availability || "").toLowerCase().includes(kw)) 
                        ? "https://schema.org/InStock" 
                        : "https://schema.org/SoldOut",
                    "description": "นัดเจอตัวจ่ายค่าบริการโดยตรงหน้างาน ไม่มีโอนเงินมัดจำล่วงหน้าเพื่อความปลอดภัยสูงสุด"
                }
            }, 'schema-jsonld-person');

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

    // 🛠️ แก้ไขตรงนี้: เพิ่มฟังก์ชันควบคุม Accordion คอร์เซ็ตปุ่ม aria-expanded แก้ไขปัญหา ARIA และ SEO
    function initAccordion() {
        const ruleItems = document.querySelectorAll(".rule-item");
        ruleItems.forEach(item => {
            const trigger = item.querySelector(".rule-trigger");
            if (trigger) {
                trigger.addEventListener("click", () => {
                    const isCurrentlyOpen = !item.classList.contains("collapsed");
                    
                    ruleItems.forEach(otherItem => {
                        otherItem.classList.add("collapsed");
                        const otherTrigger = otherItem.querySelector(".rule-trigger");
                        if (otherTrigger) {
                            otherTrigger.setAttribute("aria-expanded", "false");
                        }
                    });
                    
                    if (!isCurrentlyOpen) {
                        item.classList.remove("collapsed");
                        trigger.setAttribute("aria-expanded", "true");
                    } else {
                        trigger.setAttribute("aria-expanded", "false");
                    }
                });
            }
        });
    }

    // 🛠️ แก้ไขตรงนี้: เพิ่มฟังก์ชันเลือกดาวรีวิวแบบเป็นระเบียบ ปิดการซ้ำซ้อนของคำสั่ง
    function initStarRating() {
        const starRatingContainer = document.querySelector(".star-rating-input-container");
        const hiddenRatingInput = document.getElementById("review-rating-value");
        if (starRatingContainer && hiddenRatingInput) {
            const stars = starRatingContainer.querySelectorAll(".star-rating-input-item");
            stars.forEach(star => {
                star.addEventListener("click", () => {
                    const value = parseInt(star.getAttribute("data-value"));
                    hiddenRatingInput.value = value;
                    
                    stars.forEach(s => {
                        const starVal = parseInt(s.getAttribute("data-value"));
                        if (starVal <= value) {
                            s.classList.add("active");
                        } else {
                            s.classList.remove("active");
                        }
                    });
                });
            });
        }
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

        let provincesList = [];

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
            } catch (e) { 
                console.warn("Footer load failed", e); 
            }
        }

        provincesList.sort((a, b) => a.name.localeCompare(b.name, 'th'));

        const loadingPulse = footerContainer.querySelector('.animate-pulse');
        if (loadingPulse) {
            loadingPulse.parentElement.remove();
        }

        const displayLimit = 20; 
        let addedCount = footerContainer.querySelectorAll('li').length;

        for (const p of provincesList) {
            if (addedCount >= displayLimit) break; 

            const exists = footerContainer.querySelector(`a[href*="/location/${p.key}"]`);
            
            if (!exists) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="/location/${p.key}" 
                       title="ดูรายชื่อไซด์ไลน์ในจังหวัด ${p.name}" 
                       style="color: var(--text-gray); text-decoration: none; transition: color 0.2s;"
                       onmouseenter="this.style.color='var(--primary-purple)'"
                       onmouseleave="this.style.color='var(--text-gray)'">
                       ไซด์ไลน์${p.name}
                    </a>`;
                footerContainer.appendChild(li);
                addedCount++;
            }
        }

        if (provincesList.length > addedCount && !footerContainer.querySelector('.view-all-link')) {
            const viewAll = document.createElement('li');
            viewAll.className = 'view-all-link';
            viewAll.innerHTML = `
                <a href="/profiles.html" 
                   style="color: var(--primary-purple); font-weight: 700; text-decoration: underline; margin-top: 8px; display: inline-block;">
                   ดูจังหวัดอื่นๆ ทั้งหมด (${provincesList.length})
                </a>`;
            footerContainer.appendChild(viewAll);
        }
    }

    function initReviewForm() {
        const form = document.getElementById('review-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'กำลังส่งข้อมูล...';
            }

            const author = document.getElementById('review-author')?.value.trim();
            const location = document.getElementById('review-location')?.value.trim();
            const rating = parseInt(document.getElementById('review-rating-value')?.value || '5', 10);
            const reviewText = document.getElementById('review-text')?.value.trim();
            const currentProvinceKey = dom.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE) || 'chiangmai';

            if (!author || !reviewText) {
                showToast('❌ กรุณากรอกข้อมูลชื่อผู้ใช้งานและรายละเอียดรีวิวน้องให้ครบถ้วนด้วยครับ', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'ส่งคำติชมเพื่อยืนยันประวัติเข้าระบบ';
                }
                return;
            }

            try {
                if (!supabase) {
                    throw new Error('Supabase client is not connected');
                }

                const { error } = await supabase.from('reviews').insert([{
                    author_name: author,
                    location_detail: location || 'ไม่ระบุโซน',
                    rating_score: rating,
                    review_body: reviewText,
                    province_key: currentProvinceKey,
                    active_status: false 
                }]);

                if (error) throw error;

                showToast('✅ ส่งรีวิวเสร็จสิ้นแล้ว! ขณะนี้ข้อมูลของคุณกำลังรอผู้ดูแลแอดมินหลังบ้านอนุมัติตรวจสอบประวัติครับ', 'success');
                form.reset();
                
                const hiddenRatingInput = document.getElementById('review-rating-value');
                if (hiddenRatingInput) hiddenRatingInput.value = '5';
                const stars = form.querySelectorAll('.star-rating-input-item');
                stars.forEach(s => s.classList.add('active'));

            } catch (err) {
                console.error('Submission failed:', err);
                showToast('❌ ระบบบันทึกขัดข้อง กรุณาตรวจสอบสัญญาณเน็ตเวิร์กแล้วลองใหม่อีกครั้งครับ', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'ส่งคำติชมเพื่อยืนยันประวัติเข้าระบบ';
                }
            }
        });
    }

    function showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%); z-index: 10000; display: flex; flex-direction: column; gap: 8px; width: 90%; max-width: 400px; pointer-events: none;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const isSuccess = type === 'success';
        toast.style.cssText = `
            background-color: ${isSuccess ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        toast.innerHTML = `
            <span>${message}</span>
            <button style="background: none; border: none; color: white; cursor: pointer; font-size: 14px; padding: 0 4px;"><i class="fas fa-times"></i></button>
        `;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        const closeBtn = toast.querySelector('button');
        closeBtn.onclick = () => removeToast(toast);

        const timeout = setTimeout(() => {
            removeToast(toast);
        }, 5000);

        function removeToast(el) {
            clearTimeout(timeout);
            el.style.transform = 'translateY(20px)';
            el.style.opacity = '0';
            setTimeout(() => {
                el.remove();
                if (container.children.length === 0) container.remove();
            }, 300);
        }
    }

    const now = new Date();
    const thaiDate = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeEl = document.getElementById('last-updated-time');
    if (timeEl) timeEl.innerText = thaiDate;

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

})();
