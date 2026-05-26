
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

    let isLikeProcessing = false;

    function initGlobalClickListener() {
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
                    state.lastFocusedElement = card; 
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
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && state.currentProfileSlug) {
                history.pushState(null, '', '/');
                handleRouting();
            }
        });
    }

    window.handleLikeClick = async function(likeButton, profileId) {
        if (isLikeProcessing) return; 
        isLikeProcessing = true; 
        
        const isLiked = likeButton.classList.toggle('liked');
        const countSpan = likeButton.querySelector('.like-count');
        
        if (isLiked) {
            const icon = likeButton.querySelector('i');
            if(icon) {
                icon.style.transform = "scale(1.4)";
                setTimeout(() => icon.style.transform = "scale(1)", 200);
            }
        }
        
        if (countSpan) {
            let currentLikes = parseInt(countSpan.textContent.replace(/,/g, '') || '0');
            countSpan.textContent = isLiked ? (currentLikes + 1).toLocaleString() : Math.max(0, currentLikes - 1).toLocaleString();
        }

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

        if (window.supabase) {
            try {
                const rpcName = isLiked ? 'increment_likes' : 'decrement_likes';
                await window.supabase.rpc(rpcName, { profile_id_to_update: profileId });
            } catch (err) {
                console.error("Connection error:", err);
            }
        }
        
        setTimeout(() => { isLikeProcessing = false; }, 1000);
    };
    
    function cacheDOMElements() {
        dom.body = document.body;
        dom.pageHeader = document.getElementById('page-header');
        dom.loadingPlaceholder = document.getElementById('loading-profiles-placeholder');
        dom.profilesDisplayArea = document.getElementById('profiles-display-area');
        dom.noResultsMessage = document.getElementById('no-results-message');
        dom.fetchErrorMessage = document.getElementById('fetch-error-message');
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
            const { data: latestEntry, error: checkError } = await supabase
                .from('profiles')
                .select('lastUpdated')
                .order('lastUpdated', { ascending: false, nullsFirst: false })
                .limit(1)
                .maybeSingle();

            if (checkError) throw checkError;

            const serverTimestamp = latestEntry?.lastUpdated 
                ? new Date(latestEntry.lastUpdated).getTime().toString() 
                : '0';

            const localTimestamp = localStorage.getItem(CONFIG.KEYS.LAST_SYNC);
            const hasCachedProfiles = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
            const hasCachedProvinces = localStorage.getItem(CONFIG.KEYS.CACHE_PROVINCES);

            if (localTimestamp === serverTimestamp && hasCachedProfiles && hasCachedProvinces) {
                state.allProfiles = JSON.parse(hasCachedProfiles);
                const cachedProv = JSON.parse(hasCachedProvinces);
                
                state.provincesMap.clear();
                cachedProv.forEach(p => state.provincesMap.set(p.key.toString(), p.name));
                
                populateProvinceDropdown();
                renderProfiles(state.allProfiles, false);
                
                state.isFetching = false;
                return true;
            }

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
                localStorage.setItem(CONFIG.KEYS.CACHE_PROFILES, JSON.stringify(state.allProfiles));
                localStorage.setItem(CONFIG.KEYS.CACHE_PROVINCES, JSON.stringify(provincesForCache));
                localStorage.setItem(CONFIG.KEYS.LAST_SYNC, serverTimestamp);
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
        if (state.realtimeSubscription) {
            try { supabase.removeChannel(state.realtimeSubscription); } catch (e) { }
            state.realtimeSubscription = null;
        }
        state.cleanupFunctions = state.cleanupFunctions || [];
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
            imageObjects.push({ src: CONFIG.DEFAULT_OG_IMAGE, fullSrc: CONFIG.DEFAULT_OG_IMAGE });
        }

        const provinceName = state.provincesMap.get(p.provinceKey) || p.provinceThai || 'ไม่ระบุ';
        const numericPrice = Number(String(p.rate).replace(/\D/g, '')) || 0;
        const formattedPrice = numericPrice > 0 ? numericPrice.toLocaleString() : 'สอบถาม';

        const universalSearchString = `
            ${displayName} ${p.id} ${provinceName} 
            ${Array.isArray(p.styleTags) ? p.styleTags.join(' ') : ''} 
            ${p.description || ''} ${p.location || ''} 
            ${p.stats || ''} ${p.skinTone || ''}
        `.toLowerCase().replace(/\s+/g, ' ').trim();

        return { 
            ...p, 
            displayName,
            images: imageObjects, 
            provinceNameThai: provinceName,
            displayPrice: formattedPrice,
            _price: numericPrice,         
            searchString: universalSearchString,
            safeHeight: (p.height && p.height.trim()) ? p.height : '-',
            safeWeight: (p.weight && p.weight.trim()) ? p.weight : '-',
            safeStats: (p.stats && p.stats.trim()) ? p.stats : '-',
            safeSkin: (p.skinTone && p.skinTone.trim()) ? p.skinTone : '-',
            safeAge: (p.age && p.age.trim()) ? p.age : '-'
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

        const staticPages = ['/blog', '/about', '/faq', '/profiles', '/locations', '/contact', '/policy'];
        const isStaticPage = path.endsWith('.html') || path.endsWith('.htm') || staticPages.some(p => path === p || path.startsWith(p + '/'));

        if (isStaticPage) {
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

    function updateUltimateSuggestions(val) {
        const box = document.getElementById('search-suggestions');
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

        let html = `<div class="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">`;
        html += `<div class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase flex justify-between items-center bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                    <span>ค้นหาล่าสุด</span>
                    <button onclick="window.clearRecentSearches()" class="text-red-400 hover:text-red-600 text-xs">ล้างประวัติ</button>
                </div>`;
        
        recents.forEach(term => {
            const safeTerm = term.replace(/[<>]/g, '');
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

    window.handleSearchAll = function(searchTerm) {
        const input = document.getElementById('search-keyword');
        if (input) {
            input.value = searchTerm;
            saveRecentSearch(searchTerm);
            applyUltimateFilters(true);
        }
        const box = document.getElementById('search-suggestions');
        if (box) box.classList.add('hidden');
    }

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
                
                if (count === 0) {
                    dom.resultCount.classList.add('no-results');
                } else {
                    dom.resultCount.classList.remove('no-results');
                }
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
            if (dom.resultCount) {
                dom.resultCount.textContent = '⚠️ เกิดข้อผิดพลาดในการกรองข้อมูล';
                dom.resultCount.style.display = 'block';
            }
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

    async function renderCardsIncrementally(container, profiles) {
        if (!container || !profiles) return;
        
        container.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        const BATCH_SIZE = profiles.length > 20 ? 8 : 4; 

        for (let i = 0; i < profiles.length; i++) {
            const card = createProfileCard(profiles[i], i);
            fragment.appendChild(card);

            if ((i + 1) % BATCH_SIZE === 0 || i === profiles.length - 1) {
                container.appendChild(fragment);
                await new Promise(resolve => requestAnimationFrame(resolve));
                if (profiles.length > 40) {
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }
        }
    }

    function createSearchResultSection(profiles) {
        let headerText;
        const currentProvKey = dom.provinceSelect?.value;
        const urlProvMatch = window.location.pathname.match(/\/(?:location|province)\/([^/]+)/);
        let activeKey = urlProvMatch ? urlProvMatch[1] : (currentProvKey !== 'all' && currentProvKey ? currentProvKey : null);

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
                    <div><h2 class="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white leading-tight">${headerText}</h2></div>
                    <div class="flex-shrink-0"><span class="inline-flex items-center px-4 py-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold text-sm border border-pink-100 dark:border-pink-800">พบ ${profiles.length} รายการ</span></div>
                </div>
            </div>
            <div class="profile-grid grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 sm:px-6 pb-12"></div>
        `;
        
        const gridContainer = wrapper.querySelector('.profile-grid');
        renderCardsIncrementally(gridContainer, profiles);

        return wrapper;
    }

    function renderProfiles(profiles, isSearching) {
        if (!dom.profilesDisplayArea) return;
        
        dom.noResultsMessage?.classList.add('hidden');
        if (dom.fetchErrorMessage) dom.fetchErrorMessage.classList.add('hidden');

        if (dom.featuredSection) {
            const isHome = !isSearching && !window.location.pathname.includes('/location/');
            dom.featuredSection.classList.toggle('hidden', !isHome);

            if (isHome && dom.featuredContainer && dom.featuredContainer.children.length === 0) {
                const featured = state.allProfiles.filter(p => p.isfeatured);
                renderCardsIncrementally(dom.featuredContainer, featured);
            }
        }

        if (!profiles || profiles.length === 0) {
            dom.profilesDisplayArea.innerHTML = '';
            dom.noResultsMessage?.classList.remove('hidden');
            if (dom.resultCount) dom.resultCount.style.display = 'none';
            return;
        }

        dom.profilesDisplayArea.innerHTML = '';

        const searchSection = createSearchResultSection(profiles);
        dom.profilesDisplayArea.appendChild(searchSection);

        if (window.ScrollTrigger) {
            setTimeout(() => ScrollTrigger.refresh(), 500);
        }
    }

    function createProfileCard(p, index = 20) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'profile-card-new-container';

        const cardInner = document.createElement('div');
        cardInner.className = 'profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-gray-200 dark:bg-gray-800 cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1';
        
        cardInner.setAttribute('data-profile-id', p.id); 
        cardInner.setAttribute('data-profile-slug', p.slug);
        
        const imgSrc = (p.images && p.images.length > 0) ? p.images[0].src : '/images/placeholder-profile.webp';

        let statusClass = 'status-inquire';
        const availability = (p.availability || '').toLowerCase();
        
        if (availability.includes('ว่าง') || availability.includes('รับงาน')) {
            statusClass = 'status-available';
        } else if (availability.includes('ไม่ว่าง') || availability.includes('พัก')) {
            statusClass = 'status-busy';
        }

        const likedProfiles = JSON.parse(localStorage.getItem('liked_profiles') || '{}');
        const isLikedClass = likedProfiles[p.id] ? 'liked' : '';
        const likeCount = p.likes || 0;

        cardInner.innerHTML = `
            <div class="skeleton-loader absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse z-0"></div>
            <img src="${imgSrc}" 
                 alt="น้อง${p.name} - ไซด์ไลน์${p.provinceNameThai || 'เชียงใหม่'}"
                 class="card-image w-full h-full object-cover transition-opacity duration-700 opacity-0 absolute inset-0 z-0"
                 loading="${index < 4 ? 'eager' : 'lazy'}"
                 width="300" height="400"
                 onload="this.classList.remove('opacity-0'); if(this.previousElementSibling) this.previousElementSibling.remove();"
                 onerror="this.src='/images/placeholder-profile.webp'; this.classList.remove('opacity-0');">
                 
            <div class="absolute top-2 right-2 flex flex-col gap-1 items-end z-20 pointer-events-none">
                <span class="availability-badge ${statusClass} shadow-md backdrop-blur-md bg-white/10 border border-white/20 text-[10px] font-bold px-2 py-1 rounded-full text-white">
                    ${p.availability || 'สอบถาม'}
                </span>
                ${p.isfeatured ? '<span class="featured-badge bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm"><i class="fas fa-star mr-1"></i>แนะนำ</span>' : ''}
            </div>

            <a href="/sideline/${p.slug}" class="card-link absolute inset-0 z-10" aria-labelledby="profile-name-${p.id}" tabindex="-1"></a>

            <div class="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-between pointer-events-none" 
                 style="z-index: 20;">
                
                <div class="card-header mt-8"></div>
                
                <div class="card-footer-content pointer-events-auto">
                    <h3 id="profile-name-${p.id}" class="text-lg font-bold text-white drop-shadow-md leading-tight truncate pr-2">${p.name}</h3>
                    <p class="text-xs text-gray-300 flex items-center mt-0.5 mb-2">
                        <i class="fas fa-map-marker-alt mr-1 text-pink-500"></i> ${p.provinceNameThai || 'เชียงใหม่'}
                    </p>
                    <div class="date-stamp text-[10px] text-gray-400 flex items-center gap-1">
                        <i class="far fa-clock text-[9px]"></i> 
                        <span>อัปเดต: ${formatDate(p.created_at)}</span>
                    </div>
                        
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
        `;

        cardContainer.appendChild(cardInner);
        return cardContainer;
    }

    async function fetchSingleProfile(slug) {
        if (!supabase) return null;
        try {
            let { data, error } = await supabase
                .from('profiles')
                .select('*, provinces(key, nameThai)') 
                .eq('slug', slug)
                .maybeSingle(); 

            if (data) return processProfileData(data);

            const parts = slug.split('-');
            const potentialId = parts[parts.length - 1]; 
            
            if (potentialId && !isNaN(potentialId) && potentialId.trim() !== '') {
                const profileId = parseInt(potentialId);

                const { data: byIdData } = await supabase
                    .from('profiles')
                    .select('*, provinces(key, nameThai)')
                    .eq('id', profileId)
                    .maybeSingle(); 

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

        const cleanup = () => {
            dom.lightbox.classList.add('hidden');
            document.body.style.overflow = ''; 
            
            if (state.lastFocusedElement) {
                try { state.lastFocusedElement.focus({ preventScroll: true }); } catch (e) { }
            }
        };

        if (animate) {
            gsap.to(dom.lightbox, { opacity: 0, pointerEvents: 'none', duration: 0.2 });
            gsap.to(dom.lightboxWrapper, { 
                scale: 0.95, opacity: 0, duration: 0.2, 
                onComplete: () => {
                    dom.lightbox.style.opacity = '0'; 
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
            let text = p.availability || 'สอบถาม';
            
            if (text.includes('ว่าง') || text.includes('รับงาน')) {
                statusClass = 'status-available';
                icon = '<i class="fas fa-check-circle"></i>';
            } else if (text.includes('ไม่ว่าง')) {
                statusClass = 'status-busy';
                icon = '<i class="fas fa-times-circle"></i>';
            }
            
            els.avail.innerHTML = `
                <div class="lb-status-badge ${statusClass}" style="padding: 6px 16px; border-radius: 50px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                    ${icon} <span>${text}</span>
                </div>`;
        }

        if (els.hero) {
            els.hero.src = p.images?.[0]?.src || '/images/placeholder-profile.webp';
            els.hero.alt = p.altText || `รูปโปรไฟล์ ${p.name}`;
            els.hero.style.filter = "brightness(0.85)"; 
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


        if (els.tags) {
            els.tags.innerHTML = '';
            if (Array.isArray(p.styleTags) && p.styleTags.length > 0) {
                p.styleTags.forEach(t => {
                    if (t && t.trim()) {
                        const span = document.createElement('span');
                        span.style.cssText = "background: rgba(255, 255, 255, 0.1); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px);";
                        span.textContent = t.trim();
                        els.tags.appendChild(span);
                    }
                });
                els.tags.style.display = 'flex';
                els.tags.style.flexWrap = 'wrap'; // ✅ ตรงนี้ถูกต้องแล้วครับ
                els.tags.style.gap = '8px';
            } else {
                els.tags.style.display = 'none';
            }
        }

        if (els.detailsContainer) {
            const provinceName = state.provincesMap.get(p.provinceKey) || '';
            const fullLocation = [provinceName, p.location].filter(Boolean).join(' ').trim();
            const formattedDate = formatDate(p.lastUpdated || p.created_at);
            

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

        if (els.descContainer && els.descContent) {
            if (p.description) {
                els.descContent.style.cssText = "color: #e5e7eb; font-size: 15px; line-height: 1.6; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);";
                els.descContent.innerHTML = p.description.replace(/\n/g, '<br>');
                els.descContainer.style.display = 'block';
            } else {
                els.descContainer.style.display = 'none';
            }
        }

        const oldWrapper = document.getElementById('line-btn-sticky-wrapper');
        if (oldWrapper) oldWrapper.remove();
        
        if (p.lineId && els.lineBtnContainer) {
            const wrapper = document.createElement('div');
            wrapper.id = 'line-btn-sticky-wrapper';
            
            wrapper.style.cssText = `
                position: sticky;
                bottom: 20px;
                width: 100%;
                display: flex;
                justify-content: center;
                z-index: 50;
                pointer-events: none; 
                margin-top: 20px;
            `;

            const autoMessage = `สนใจน้อง ${p.name} เห็นจากเว็บ Sideline Chiangmai ครับ`;
            let finalLineUrl = p.lineId.startsWith('http') ? p.lineId : `https://line.me/ti/p/~${p.lineId}`;

            const link = document.createElement('a');
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

            link.onmousedown = () => link.style.transform = "scale(0.95)";
            link.onmouseup = () => link.style.transform = "scale(1)";

            link.onclick = (e) => {
                e.preventDefault();
                if (navigator.clipboard) navigator.clipboard.writeText(autoMessage);
                
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
    // SEO META TAGS UPDATER
    // ==========================================
    let isFirstLoad = true;

    function clearAllDynamicSchemas() {
        const schemaIds = [
            'schema-jsonld-person', 'schema-jsonld-list', 'schema-jsonld-faq', 
            'schema-jsonld-breadcrumb', 'schema-jsonld-org', 'schema-jsonld-website'
        ];
        schemaIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }

    function updateAdvancedMeta(profile = null, pageData = null) {
        if (isFirstLoad) {
            isFirstLoad = false;
            return; 
        }

        const currentPath = window.location.pathname.toLowerCase();
        const isRoot = currentPath === '/' || currentPath === '' || currentPath === '/index.html';

        clearAllDynamicSchemas();

        const YEAR_TH = new Date().getFullYear() + 543;
        const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const d = new Date();
        const CURRENT_DATE = `${d.getDate()} ${thaiMonths[d.getMonth()]} ${YEAR_TH}`;

        const getCleanName = (rawName) => {
            if (!rawName) return "";
            let name = rawName.trim().replace(/^(น้อง\s?)/, '');
            return `น้อง${name.charAt(0).toUpperCase() + name.slice(1)}`;
        };

        if (profile) {
            const displayName = getCleanName(profile.name);
            const province = profile.provinceNameThai || 'เชียงใหม่';
            const priceInfo = profile.rate ? `ราคา ${profile.rate}` : 'สอบถามราคา';
            const workArea = profile.location ? `${profile.location}, ${province}` : province;
            const profileUrl = `${CONFIG.SITE_URL}/sideline/${profile.slug || profile.id}`;
            const provinceUrl = `${CONFIG.SITE_URL}/location/${profile.provinceKey || 'chiangmai'}`;
            
            let statsParts = [];
            if (profile.stats) statsParts.push(`สัดส่วน ${profile.stats}`);
            if (profile.age) statsParts.push(`อายุ ${profile.age}`);
            const detailsSnippet = statsParts.join('. '); 

            const t = SEO_WORDS.pick('trust');
            const g = SEO_WORDS.pick('guarantees');

            const finalTitle = `${displayName} รับงานไซด์ไลน์${province} | ${g} ${t} (${YEAR_TH})`;
            const finalDesc = `โปรไฟล์ ${displayName} สำหรับรับงานไซด์ไลน์ในพื้นที่ ${workArea}. ${priceInfo}. ${detailsSnippet}. ${g} และ ${t} 100%. ปลอดภัย จ่ายเงินหน้างาน. (อัปเดต ${CURRENT_DATE})`;

            document.title = finalTitle;
            updateMeta('description', finalDesc);
            updateMeta('keywords', `${displayName}, ไซด์ไลน์${province}, รับงาน${province}`);
            updateLink('canonical', profileUrl);
            
            updateOpenGraphMeta(profile, finalTitle, finalDesc, 'profile');
            
            injectSchema(generatePersonSchema(profile, finalDesc, province), 'schema-jsonld-person');
            injectSchema(generateBreadcrumbSchema([
                { name: "หน้าแรก", url: CONFIG.SITE_URL },
                { name: `ไซด์ไลน์${province}`, url: provinceUrl },
                { name: displayName, url: profileUrl }
            ]), 'schema-jsonld-breadcrumb');
        } else if (pageData) {
            const province = pageData.provinceName || 'เชียงใหม่';
            const pageUrl = pageData.canonicalUrl || window.location.href;
            const pageTitle = `ไซด์ไลน์${province} รับงานเอง ตรงปก (${YEAR_TH})`;
            const pageDesc = `รวมน้องๆ ไซด์ไลน์${province} รับงานเอง พิกัด${province}. อัปเดตล่าสุด ${CURRENT_DATE}. ปลอดภัย ไม่มัดจำ.`;

            document.title = pageTitle;
            updateMeta('description', pageDesc);
            updateLink('canonical', pageUrl);
            updateOpenGraphMeta(null, pageTitle, pageDesc, 'website');
            
            injectSchema(generateListingSchema(pageData), 'schema-jsonld-list');
            injectSchema(generateBreadcrumbSchema([
                { name: "หน้าแรก", url: CONFIG.SITE_URL },
                { name: `ไซด์ไลน์${province}`, url: pageUrl }
            ]), 'schema-jsonld-breadcrumb');
        } else if (isRoot) {
            const GLOBAL_TITLE = `ไซด์ไลน์เชียงใหม่ รับงานไม่มัดจำ ฟิวแฟนตรงปก (${YEAR_TH})`;
            const GLOBAL_DESC = `เว็บไซต์อันดับ 1 รวมไซด์ไลน์เชียงใหม่ และจังหวัดอื่นๆ ทั่วประเทศ. รับงานเอง ไม่ผ่านเอเย่นต์ ไม่ต้องโอนมัดจำ ปลอดภัย 100%`;

            document.title = GLOBAL_TITLE;
            updateMeta('description', GLOBAL_DESC);
            updateLink('canonical', CONFIG.SITE_URL);
            updateOpenGraphMeta(null, GLOBAL_TITLE, GLOBAL_DESC, 'website');
            
            injectSchema(generateWebsiteSchema(), 'schema-jsonld-website');
            injectSchema(generateOrganizationSchema(), 'schema-jsonld-org');
            injectSchema(generateFAQPageSchema([
                { question: "ต้องโอนมัดจำไหม?", answer: "ไม่ต้องค่ะ แพลตฟอร์มเราให้จ่ายเงินสดหน้างาน 100% เพื่อความปลอดภัย" },
                { question: "การันตีตรงปกไหม?", answer: "เรารับประกันตัวจริงตรงรูป 100% ถ้านัดเจอแล้วไม่ตรงปก สามารถยกเลิกได้ทันทีไม่มีค่าใช้จ่าย" }
            ]), 'schema-jsonld-faq');
        }
    }

    function updateOpenGraphMeta(profile, title, description, type) {
        updateMeta('og:title', title);
        updateMeta('og:description', description);
        updateMeta('og:url', profile ? `${CONFIG.SITE_URL}/sideline/${profile.slug}` : CONFIG.SITE_URL);
        updateMeta('og:type', type); 
        updateMeta('og:locale', 'th_TH'); 
        updateMeta('og:site_name', 'Sideline Chiangmai'); 
        
        let imageUrl = (profile && profile.images && profile.images[0]) ? profile.images[0].src : CONFIG.DEFAULT_OG_IMAGE;
        
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

    // ==========================================
    // UI & EFFECTS
    // ==========================================
    function initHeaderScrollEffect() {
        if (!dom.pageHeader) return;
        
        const updateHeader = () => {
            const isScrolled = window.scrollY > 20;
            dom.pageHeader.classList.toggle('scrolled', isScrolled);
            
            if (isScrolled) {
                dom.pageHeader.style.backgroundColor = 'rgba(15, 23, 42, 0.9)'; 
                dom.pageHeader.style.backdropFilter = 'blur(12px)';
                dom.pageHeader.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            } else {
                dom.pageHeader.style.backgroundColor = 'transparent';
                dom.pageHeader.style.backdropFilter = 'none';
                dom.pageHeader.style.boxShadow = 'none';
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
            l.classList.toggle('text-pink-600', isActive);
            l.classList.toggle('font-bold', isActive);
            if (isActive) {
                l.setAttribute('aria-current', 'page');
            }
        });
    }

    function createGlobalLoader() {
        if (document.getElementById('global-loader-overlay')) return;

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
        gsap.set(loader, { display: 'flex', opacity: 0 });
        gsap.to(loader, { opacity: 1, duration: 0.3, pointerEvents: 'all' });
    }

    function hideLoadingState() {
        const loader = document.getElementById('global-loader-overlay');
        if (loader) {
            try {
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
                loader.style.display = 'none';
            }
        }
        if (typeof dom !== 'undefined' && dom.loadingPlaceholder) {
            dom.loadingPlaceholder.style.display = 'none';
        }
    }

    // ==========================================
    // ADMIN TOOLS (SITEMAP GENERATOR)
    // ==========================================
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

    // ==========================================
    // DYNAMIC FOOTER SYSTEM
    // ==========================================
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
            } catch (e) { console.warn("Footer load failed", e); }
        }

        provincesList.sort((a, b) => a.name.localeCompare(b.name, 'th'));

        const loadingPulse = footerContainer.querySelector('.animate-pulse');
        if (loadingPulse) {
            loadingPulse.parentElement.remove();
        }

        const displayLimit = 20; 
        let addedCount = footerContainer.querySelectorAll('li').length;

        provincesList.forEach(p => {
            const exists = footerContainer.querySelector(`a[href*="/location/${p.key}"]`);
            if (!exists && addedCount < displayLimit) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="/location/${p.key}" title="รับงาน${p.name} | Sideline Chiangmai" class="hover:text-pink-500 transition-colors flex items-center gap-2"><span class="w-1 h-1 bg-gray-300 rounded-full"></span> ไซด์ไลน์${p.name}</a>`;
                footerContainer.appendChild(li);
                addedCount++;
            }
        });

        if (provincesList.length > addedCount && !footerContainer.querySelector('.view-all-link')) {
            const viewAll = document.createElement('li');
            viewAll.className = 'view-all-link';
            viewAll.innerHTML = `<a href="/profiles.html" class="text-pink-500 font-bold hover:underline mt-2 inline-block">ดูจังหวัดอื่นๆ ทั้งหมด (${provincesList.length})</a>`;
            footerContainer.appendChild(viewAll);
        }
    }

})();