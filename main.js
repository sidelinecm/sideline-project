// =================================================================
// MAIN.JS (ULTIMATE FIXED VERSION with Enhanced Robustness and SEO)
// =================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs';

gsap.registerPlugin(ScrollTrigger);

(function () {
    'use strict';

    // =================================================================
    // 1. CONFIGURATION (FIXED: Added DEFAULT_OG_IMAGE Correctly)
    // =================================================================
    const CONFIG = {
        SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
        STORAGE_BUCKET: 'profile-images',
        CACHE_TTL_HOURS: 24,
        KEYS: {
            LAST_PROVINCE: 'sidelinecm_last_province',
            CACHE_PROFILES: 'cachedProfiles',
            LAST_FETCH: 'lastFetchTime',
            AGE_CONFIRMED: 'ageConfirmedTimestamp',
            THEME: 'theme'
        },
        SITE_URL: 'https://sidelinechiangmai.netlify.app',
        DEFAULT_OG_IMAGE: '/images/default_og_image.jpg' // ✅ CORRECT SYNTAX
    };

    // =================================================================
    // 1.1 GLOBAL STATE AND VARIABLES
    // =================================================================
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

    // =================================================================
    // 2. DOM ELEMENTS CACHE
    // =================================================================
    const dom = {};

    // =================================================================
    // 3. SUPABASE CLIENT
    // =================================================================
    let supabase;
    try {
        // Note: The createClient function is imported from Supabase ESM
        supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        window.supabase = supabase;
        console.log("✅ Supabase Connected");
    } catch (e) {
        console.error("❌ Supabase Init Failed:", e);
    }
    
    // =================================================================
    // 3.1 GLOBAL ERROR HANDLER (Ultimate Robustness)
    // =================================================================
    window.onerror = function (message, source, lineno, colno, error) {
        // ดักจับ JavaScript Error ที่ไม่ได้ถูกจัดการ (unhandled) ทั่วทั้งแอปพลิเคชัน
        console.error('🛑 Global Runtime Error:', message, error);
        
        // คืนค่า true เพื่อป้องกันไม่ให้เบราว์เซอร์แสดง Error message มาตรฐาน (Clean User Experience)
        return true; 
    };

    // =================================================================
    // 4. MAIN ENTRY POINT 
    // =================================================================
    document.addEventListener('DOMContentLoaded', initApp);
    
    async function initApp() {
        cacheDOMElements();

        // UI Inits
        initThemeToggle();
        initMobileMenu();
        initAgeVerification();
        initHeaderScrollEffect();
        initMarqueeEffect();
        initMobileSitemapTrigger();
        initFooterLinks();

        updateActiveNavLinks();

        // Main Logic
        await handleRouting();
        await handleDataLoading();

        // Footer Year
        const yearSpan = document.getElementById('currentYearDynamic');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        document.body.classList.add('loaded');

        // Intro Animation (Home only)
        if (window.location.pathname === '/' && !state.currentProfileSlug) {
            try {
                const heroElements = document.querySelectorAll('#hero-h1, #hero-p, #hero-form');
                if (heroElements.length > 0) {
                    gsap.from(heroElements, {
                        y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.3
                    });
                }
            } catch (e) { console.warn("Animation skipped", e); }
        }

        // Navigation Listener
        window.addEventListener('popstate', async () => {
            await handleRouting();
            updateActiveNavLinks();
        });
    }

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

    async function handleDataLoading() {
        if (state.isFetching) return;

        showLoadingState();
        try {
            const success = await fetchDataDelta();
            if (success) {
                initSearchAndFilters();
                initLightboxEvents();
                await handleRouting(true);
                initRealtimeSubscription();
            } else {
                showErrorState();
            }
        } catch (error) {
            console.error('Data loading failed:', error);
            showErrorState();
        } finally {
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

    // ✅ REALTIME SUBSCRIPTION (Unchanged, but included for completeness)
    function initRealtimeSubscription() {
        if (!supabase) return;

        // Cleanup existing subscription
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
                        console.log('🔔 Realtime event:', payload.eventType, payload.new || payload.old);

                        switch (payload.eventType) {
                            case 'INSERT':
                            case 'UPDATE':
                                if (payload.new) {
                                    const processed = processProfileData(payload.new);
                                    if (processed) {
                                        state.allProfiles = mergeProfilesData(state.allProfiles, [processed]);
                                        renderProfiles(state.allProfiles, false);
                                    }
                                }
                                break;

                            case 'DELETE':
                                if (payload.old) {
                                    state.allProfiles = state.allProfiles.filter(p => p && p.id && payload.old && p.id !== payload.old.id);
                                    renderProfiles(state.allProfiles, false);
                                }
                                break;
                        }
                    }
                )
                .subscribe((status) => {
                    console.log('📡 Realtime Status:', status);
                });

            state.realtimeSubscription = subscription;

            // Add to cleanup functions
            state.cleanupFunctions.push(() => {
                if (subscription) {
                    supabase.removeChannel(subscription);
                }
            });
        } catch (error) {
            console.warn('❌ Realtime subscription failed:', error);
        }
    }

// ✅ PROCESS PROFILE DATA (FIXED: เพิ่ม p.stats ลงใน Search String)
function processProfileData(p) {
    // จัดการรูปภาพ (Safe Mode: รูปไม่แตกแน่นอน)
    const imagePaths = [p.imagePath, ...(Array.isArray(p.galleryPaths) ? p.galleryPaths : [])].filter(Boolean);
    const imageObjects = imagePaths.map(path => {
        const { data } = supabase.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
        let url = data?.publicUrl || '/images/placeholder-profile-card.webp';
        let sep = url.includes('?') ? '&' : '?';
        // 💡 ใช้ created_at เป็น fallback สำหรับ versioning ของรูปภาพ
        if (p.lastUpdated || p.created_at) url = `${url}${sep}v=${Math.floor(new Date(p.lastUpdated || p.created_at).getTime() / 1000)}`;
        sep = url.includes('?') ? '&' : '?';
        
        return {
            src: `${url}${sep}width=600`, 
            srcset: [300, 600].map(w => `${url}${sep}width=${w} ${w}w`).join(', ')
        };
    });

    if (imageObjects.length === 0) imageObjects.push({ src: '/images/placeholder-profile.webp', srcset: '' });

    // ✅ ส่วนที่แก้: ดึงชื่อไทยจาก Map มาใช้
    const provinceName = state.provincesMap.get(p.provinceKey) || '';
    const tags = (p.styleTags || []).join(' ');
    
    // 🔴 FIX: เพิ่ม p.stats ลงใน fullSearchString เพื่อให้ค้นหาด้วยคำเช่น "สัดส่วน" หรือ "36-24-36" ได้
    const fullSearchString = `${p.name} ${provinceName} ${p.provinceKey} ${tags} ${p.description || ''} ${p.rate || ''} ${p.stats || ''}`.toLowerCase();

    return { 
        ...p, 
        images: imageObjects, 
        altText: `น้อง${p.name} ${provinceName}`,
        searchString: fullSearchString, // ใช้ค้นหา
        provinceNameThai: provinceName, // ใช้แสดงผล
        _price: Number(p.rate) || 0,
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
    // 6. ROUTING & SEO (UPDATED - FRANCHISE STYLE)
    // =================================================================
    async function handleRouting(dataLoaded = false) {
        const path = window.location.pathname.toLowerCase();
        
        // 1. หน้าโปรไฟล์
        const profileMatch = path.match(/^\/(?:sideline|profile|app)\/([^/]+)/);
        if (profileMatch) {
            const slug = decodeURIComponent(profileMatch[1]);
            state.currentProfileSlug = slug;
            
            let profile = state.allProfiles.find(p => (p.slug || '').toLowerCase() === slug.toLowerCase());
            if (!profile && !dataLoaded) profile = await fetchSingleProfile(slug);

            if (profile) {
                openLightbox(profile);
                updateAdvancedMeta(profile, null);
                dom.profilesDisplayArea?.classList.add('hidden');
                dom.featuredSection?.classList.add('hidden');
            } else if (dataLoaded) {
                history.replaceState(null, '', '/');
                closeLightbox(false);
                dom.profilesDisplayArea?.classList.remove('hidden');
                state.currentProfileSlug = null;
            }
            return;
        } 
        
        // 2. หน้าจังหวัด (Location Page) -> จุดที่แก้ให้สวยๆ
        const provinceMatch = path.match(/^\/(?:location|province)\/([^/]+)/);
        if (provinceMatch) {
            const provinceKey = decodeURIComponent(provinceMatch[1]);
            state.currentProfileSlug = null;
            closeLightbox(false);
            if (dom.provinceSelect) dom.provinceSelect.value = provinceKey;
            
            if (dataLoaded) {
                applyUltimateFilters(false);
                const provinceName = state.provincesMap.get(provinceKey) || provinceKey;
                
                // สร้างข้อมูล SEO (ส่งแค่หัวข้อหลัก เดี๋ยวไปเติมแบรนด์ทีหลัง)
                const seoData = {
                    title: `รับงาน${provinceName} - ไซด์ไลน์${provinceName}`, 
                    description: `รวมน้องๆ ไซด์ไลน์ ${provinceName} คัดคนสวย ตรงปก ปลอดภัย 100% การันตีคุณภาพโดยทีมงาน Sideline Chiangmai สาขา${provinceName}`,
                    canonicalUrl: `${CONFIG.SITE_URL}/location/${provinceKey}`,
                    provinceName: provinceName, 
                    profiles: state.allProfiles.filter(p => p.provinceKey === provinceKey)
                };
                
                updateAdvancedMeta(null, seoData);
                dom.profilesDisplayArea?.classList.remove('hidden');
            }
            return;
        }

        // 3. หน้าแรก
        state.currentProfileSlug = null;
        closeLightbox(false);
        dom.profilesDisplayArea?.classList.remove('hidden');
        if (dataLoaded) {
            applyUltimateFilters(false);
            updateAdvancedMeta(null, null);
        }
    }

    // =================================================================
    // 7. ULTIMATE SEARCH ENGINE (Google Style + Fuse.js)
    // =================================================================
    
    let fuseEngine; 
    function initSearchAndFilters() {
        if (!dom.searchForm) return;

        // ตั้งค่า Search Engine
        const fuseOptions = {
            includeScore: true,
            threshold: 0.3,
            ignoreLocation: true,
            keys: [
                { name: 'name', weight: 1.0 },
                { name: 'provinceNameThai', weight: 1.0 }, // เพิ่มน้ำหนักชื่อจังหวัดไทยให้สูงสุด
                { name: 'provinceKey', weight: 0.8 },
                { name: 'styleTags', weight: 0.5 },
                { name: 'description', weight: 0.2 }
            ]
        };
        
        if (state.allProfiles.length > 0) {
            fuseEngine = new Fuse(state.allProfiles, fuseOptions);
        }

        // Listener สำหรับ Input
        const clearBtn = document.getElementById('clear-search-btn');
        const suggestionsBox = document.getElementById('search-suggestions');
        
        dom.searchInput?.addEventListener('input', (e) => {
            const val = e.target.value;
            if(clearBtn) clearBtn.classList.toggle('hidden', !val);
            // applyUltimateFilters() จะถูกเรียกที่นี่
            applyUltimateFilters(); 
        });

        // ปุ่ม Clear
        clearBtn?.addEventListener('click', () => {
            dom.searchInput.value = '';
            clearBtn.classList.add('hidden');
            dom.searchInput.focus();
            applyUltimateFilters();
        });

        // เปลี่ยนจังหวัดใน Dropdown
        dom.provinceSelect?.addEventListener('change', () => {
            if (dom.searchInput) dom.searchInput.value = ''; // เคลียร์ช่องพิมพ์
            history.pushState(null, '', dom.provinceSelect.value ? `/location/${dom.provinceSelect.value}` : '/');
            applyUltimateFilters(true);
        });

        dom.availabilitySelect?.addEventListener('change', () => applyUltimateFilters(true));
        dom.featuredSelect?.addEventListener('change', () => applyUltimateFilters(true));
        
        // ปุ่ม Reset
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
function applyUltimateFilters(updateUrl = false) {
        let query = {
            text: dom.searchInput?.value?.trim() || '',
            province: dom.provinceSelect?.value || '',
            avail: dom.availabilitySelect?.value || '',
            featured: dom.featuredSelect?.value === 'true'
        };

        // 🟢 จุดที่แก้: เพิ่ม Logic ตรวจสอบว่าคำที่พิมพ์ คือชื่อจังหวัดหรือไม่?
        // ถ้าใช่ -> ให้ระบบเปลี่ยนไปใช้การกรอง "ทั้งจังหวัด" ทันที
        if (query.text) {
            for (let [key, name] of state.provincesMap.entries()) {
                // เช็คว่าคำที่พิมพ์ มีชื่อจังหวัดปนอยู่มั้ย (เช่น "เชียงใหม่", "น้องเชียงใหม่")
                if (name === query.text || name.includes(query.text) || query.text.includes(name)) {
                    
                    // สั่งระบบว่า: "ผู้ใช้ต้องการดูจังหวัดนี้นะ" (Set key จังหวัด)
                    query.province = key; 
                    
                    // *เคล็ดลับ* ลบ text ทิ้ง เพื่อให้ระบบดึง "ทุกคน" ที่มี key นี้ออกมา
                    // (ไม่ใช่แค่คนที่พิมพ์ชื่อจังหวัดไว้ใน Description)
                    query.text = ''; 
                    
                    // Update Dropdown ให้ตรงกันด้วย (เพื่อความเนียน)
                    if(dom.provinceSelect) dom.provinceSelect.value = key;
                    
                    break; // เจอแล้วหยุดหา
                }
            }
        }

        if (query.province && query.province !== 'all') localStorage.setItem(CONFIG.KEYS.LAST_PROVINCE, query.province);

        let filtered = state.allProfiles;

        // 1. กรองด้วย Text (จะทำงานเฉพาะถ้าเราไม่ได้ลบ text ทิ้งข้างบน หรือค้นหาชื่อเล่น)
        if (query.text) {
            if (fuseEngine) {
                const results = fuseEngine.search(query.text);
                filtered = results.map(result => result.item);
            } else {
                const lower = query.text.toLowerCase();
                filtered = filtered.filter(p => p.searchString.includes(lower));
            }
        }

        // 2. กรองด้วย Category/Province 
        // (จุดนี้แหละที่น้องๆ อีก 89 คนจะโผล่ออกมา เพราะเรา set query.province ไว้แล้ว)
        filtered = filtered.filter(p => {
            const provinceMatch = !query.province || query.province === 'all' || p.provinceKey === query.province;
            const availMatch = !query.avail || query.avail === 'all' || query.avail === '' || p.availability === query.avail;
            const featuredMatch = !query.featured || p.isfeatured;
            return provinceMatch && availMatch && featuredMatch;
        });

        // UI Updates
        if (dom.resultCount) {
             dom.resultCount.innerHTML = filtered.length > 0 ? `✅ พบ ${filtered.length} โปรไฟล์` : '❌ ไม่พบข้อมูล';
             dom.resultCount.style.display = 'block';
        }

        // ส่ง Flag ไปบอกว่าตอนนี้กำลังค้นหา (เพื่อให้โชว์หัวข้อแบบ Search Result)
        const isSearchMode = !!dom.searchInput?.value || !!query.province; 
        renderProfiles(filtered, isSearchMode);

        // Update URL
        if (updateUrl) {
            const params = new URLSearchParams();
            if (query.text) params.set('q', query.text);
            const path = (query.province && query.province !== 'all') ? `/location/${query.province}` : '/';
            const qs = params.toString() ? '?' + params.toString() : '';
            if (!window.location.pathname.includes('/sideline/')) history.pushState({}, '', path + qs);
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

function renderProfiles(profiles, isSearching) {
        if (!dom.profilesDisplayArea) return;
        dom.profilesDisplayArea.innerHTML = ''; 

        // --- ส่วน Featured (คงเดิม) ---
        if(dom.featuredSection) {
            // แสดง Featured เฉพาะเมื่ออยู่หน้าแรกจริงๆ (ไม่มีการกรองจังหวัด)
            const isHome = !isSearching && !window.location.pathname.includes('/location/');
            dom.featuredSection.classList.toggle('hidden', !isHome);
            
            if (isHome && dom.featuredContainer && state.allProfiles.length > 0) {
                if (dom.featuredContainer.children.length === 0) {
                     const featured = state.allProfiles.filter(p => p.isfeatured);
                     const frag = document.createDocumentFragment();
                     featured.forEach(p => frag.appendChild(createProfileCard(p)));
                     dom.featuredContainer.appendChild(frag);
                }
            }
        }

        // ถ้าไม่มีข้อมูล
        if (profiles.length === 0) {
            dom.noResultsMessage?.classList.remove('hidden');
            return;
        }
        dom.noResultsMessage?.classList.add('hidden');

        // --- ตัดสินใจการแสดงผล ---
        // เช็คอีกทีว่า URL เป็น location หรือไม่ (เพื่อบังคับโชว์หัวข้อจังหวัด)
        const isLocationPage = window.location.pathname.includes('/location/') || window.location.pathname.includes('/province/');
        
        if (isSearching || isLocationPage) {
            // โหมด 1: ผลลัพธ์การค้นหา / หน้าดูจังหวัดเดี่ยว (แสดงหัวข้อจังหวัด)
            dom.profilesDisplayArea.appendChild(createSearchResultSection(profiles));
        } else {
            // โหมด 2: หน้าแรกดูรวม (แยกเป็น Section ก-ฮ)
            renderByProvince(profiles);
        }

        if(window.ScrollTrigger) ScrollTrigger.refresh();
        initScrollAnimations();
    }

function createSearchResultSection(profiles) {
        let headerText = "ผลการค้นหา";
        
        // ดึงค่าจังหวัดปัจจุบัน จาก Dropdown หรือจากค่าที่เรา Auto Set เมื่อกี้
        const currentProvKey = dom.provinceSelect?.value || localStorage.getItem(CONFIG.KEYS.LAST_PROVINCE); 
        const urlProvMatch = window.location.pathname.match(/\/(?:location|province)\/([^/]+)/);
        
        // ลำดับความสำคัญ: เอาจาก URL ก่อน -> ถ้าไม่มีเอาจาก Dropdown
        let activeKey = urlProvMatch ? urlProvMatch[1] : currentProvKey;
        
        // 🟢 จุดที่แก้: แสดงชื่อจังหวัดสวยๆ แทนคำว่า "ผลการค้นหา"
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
        profiles.forEach(p => frag.appendChild(createProfileCard(p)));
        grid.appendChild(frag);
        return wrapper;
    }
    function createProfileCard(p) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'profile-card-new-container';

        const cardInner = document.createElement('div');
        cardInner.className = 'profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-800 cursor-pointer transform transition-all duration-300';
        cardInner.setAttribute('data-profile-id', p.id);
        cardInner.setAttribute('data-profile-slug', p.slug);
        cardInner.setAttribute('role', 'button');
        cardInner.setAttribute('tabindex', '0');

        cardInner.innerHTML = `<a href="/profile/${p.slug}" class="card-link absolute inset-0 z-20" aria-label="ดูโปรไฟล์ ${p.name}"></a>`;

        const imgObj = p.images[0];
        const img = document.createElement('img');
        img.className = 'card-image w-full h-full object-cover pointer-events-none';
        img.src = imgObj.src;
        img.srcset = imgObj.srcset;
        img.sizes = '(max-width: 640px) 150px, (max-width: 1024px) 250px, 400px';
        img.alt = p.altText;
        img.loading = 'lazy';
        img.decoding = 'async';

        const badges = document.createElement('div');
        badges.className = 'absolute top-2 right-2 flex flex-col gap-1 items-end z-10 pointer-events-none';
        
        let statusClass = 'status-inquire';
        if (p.availability?.includes('ว่าง') || p.availability?.includes('รับงาน')) statusClass = 'status-available';
        else if (p.availability?.includes('ไม่ว่าง')) statusClass = 'status-busy';
        
        badges.innerHTML = `
            <span class="availability-badge ${statusClass}">${p.availability || 'สอบถาม'}</span>
            ${p.isfeatured ? '<span class="featured-badge"><i class="fas fa-star text-[0.7em] mr-1"></i>แนะนำ</span>' : ''}
        `;

        const overlay = document.createElement('div');
        overlay.className = 'card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 pointer-events-none';
        overlay.innerHTML = `
            <div class="card-info transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="text-xl font-bold text-white shadow-sm">${p.name}</h3>
                <p class="text-sm text-gray-200 mt-1 flex items-center">
                    <i class="fas fa-map-marker-alt mr-1.5"></i> 
                    ${state.provincesMap.get(p.provinceKey) || 'ไม่ระบุ'}
                </p>
            </div>
        `;

        cardInner.append(img, badges, overlay);
        cardContainer.appendChild(cardInner);
        return cardContainer;
    }

    // =================================================================
    // 9. LIGHTBOX & HELPER FUNCTIONS
    // =================================================================
    async function fetchSingleProfile(slug) {
        if(!supabase) return null;
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).maybeSingle();
            if (error || !data) return null;
            return processProfileData(data);
        } catch { return null; }
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
        const get = (id) => document.getElementById(id);
        const els = {
            name: get('lightbox-profile-name-main'),
            hero: get('lightboxHeroImage'),
            thumbs: get('lightboxThumbnailStrip'),
            quote: get('lightboxQuote'),
            tags: get('lightboxTags'),
            desc: get('lightboxDescriptionVal'),
            avail: get('lightbox-availability-badge-wrapper'),
            details: get('lightboxDetailsCompact'),
            line: get('lightboxLineLink'),
            lineText: get('lightboxLineLinkText')
        };

        if (els.name) els.name.textContent = p.name || 'ไม่ระบุชื่อ';
        if (els.quote) {
            els.quote.textContent = p.quote ? `"${p.quote}"` : '';
            els.quote.style.display = p.quote ? 'block' : 'none';
        }

        if (els.hero) {
            els.hero.src = p.images?.[0]?.src || '/images/placeholder-profile.webp';
            els.hero.srcset = p.images?.[0]?.srcset || '';
            els.hero.alt = p.altText || p.name;
        }

        if (els.thumbs) {
            els.thumbs.innerHTML = '';
            if (p.images && p.images.length > 1) {
                els.thumbs.style.display = 'grid';
                p.images.forEach((img, i) => {
                    const thumb = document.createElement('img');
                    thumb.className = `thumbnail ${i === 0 ? 'active' : ''}`;
                    thumb.src = img.src;
                    thumb.onclick = () => {
                        els.hero.src = img.src;
                        els.hero.srcset = img.srcset;
                        els.thumbs.querySelector('.active')?.classList.remove('active');
                        thumb.classList.add('active');
                    };
                    els.thumbs.appendChild(thumb);
                });
            } else {
                els.thumbs.style.display = 'none';
            }
        }

        if (els.tags) {
            els.tags.innerHTML = '';
            if (p.styleTags?.length) {
                els.tags.style.display = 'flex';
                p.styleTags.forEach(t => {
                    const span = document.createElement('span');
                    span.className = 'tag-badge';
                    span.textContent = t;
                    els.tags.appendChild(span);
                });
            } else {
                els.tags.style.display = 'none';
            }
        }

        if (els.details) {
            const provinceName = state.provincesMap.get(p.provinceKey) || '';
            
            els.details.innerHTML = `
                <div class="stats-grid-container">
                    <div class="stat-box"><span class="stat-label">อายุ</span><span class="stat-value">${p.age || '-'}</span></div>
                    <div class="stat-box"><span class="stat-label">สัดส่วน</span><span class="stat-value">${p.stats || '-'}</span></div>
                    <div class="stat-box"><span class="stat-label">สูง/หนัก</span><span class="stat-value">${p.height || '-'}/${p.weight || '-'}</span></div>
                </div>
                <div class="info-list-container">
                    <div class="info-row"><div class="info-label"><i class="fas fa-palette info-icon"></i> สีผิว</div><div class="info-value">${p.skinTone || '-'}</div></div>
                    <div class="info-row"><div class="info-label"><i class="fas fa-map-marker-alt info-icon"></i> พิกัด</div><div class="info-value text-primary">${provinceName} (${p.location || '-'})</div></div>
                    <div class="info-row"><div class="info-label"><i class="fas fa-tag info-icon"></i> เรทราคา</div><div class="info-value text-green-600">${p.rate || 'สอบถาม'}</div></div>
                </div>
            `;
        }

        if (els.desc && els.desc.parentElement) {
            els.desc.parentElement.innerHTML = `
                <div class="description-box">
                    <div class="desc-header"><i class="fas fa-align-left"></i> รายละเอียดเพิ่มเติม</div>
                    <div class="desc-content">${p.description ? p.description.replace(/\n/g, '<br>') : '-'}</div>
                </div>
            `;
        }

        const oldWrapper = document.getElementById('line-btn-sticky-wrapper');
        if (oldWrapper) oldWrapper.remove();

        if (p.lineId) {
            const wrapper = document.createElement('div');
            wrapper.id = 'line-btn-sticky-wrapper';
            wrapper.className = 'lb-sticky-footer';

            const link = document.createElement('a');
            link.className = 'btn-line-action';
            link.href = p.lineId.startsWith('http') ? p.lineId : `https://line.me/ti/p/${p.lineId}`;
            link.target = '_blank';
            link.innerHTML = `<i class="fab fa-line"></i> แอดไลน์ ${p.name}`;

            wrapper.appendChild(link);
            const detailsCol = document.querySelector('.lightbox-details');
            if (detailsCol) detailsCol.appendChild(wrapper);
        }

        if (els.avail) {
            els.avail.innerHTML = '';
            let sClass = 'status-inquire';
            let icon = '<i class="fas fa-question-circle"></i>';
            if (p.availability?.includes('ว่าง') || p.availability?.includes('รับงาน')) { sClass = 'status-available'; icon = '<i class="fas fa-check-circle"></i>'; }
            else if (p.availability?.includes('ไม่ว่าง')) { sClass = 'status-busy'; icon = '<i class="fas fa-times-circle"></i>'; }
            
            const badge = document.createElement('div');
            badge.className = `lb-status-badge ${sClass}`;
            badge.innerHTML = `${icon} ${p.availability || 'สอบถาม'}`;
            els.avail.appendChild(badge);
        }
    }

// =================================================================
// 10. SEO META TAGS UPDATER (มาตรฐานสูงสุด - พร้อม Fallback, Locale & Rich Schemas)
// =================================================================

const FAQ_DATA = [
    { 
        question: "บริการ Sideline Chiangmai คืออะไร?", 
        answer: "เราคือศูนย์รวมรายชื่อน้องๆ ไซด์ไลน์ อันดับ 1 ที่มีสำนักงานหลักดูแลมาตรฐานความปลอดภัย และมีเครือข่ายน้องๆ รับงานทั่วประเทศ คัดคนสวย ตรงปก 100%" 
    },
    { 
        question: "วิธีการติดต่อและนัดหมายน้องๆ ทำได้อย่างไร?", 
        answer: "คุณสามารถเลือกดูโปรไฟล์น้องที่สนใจ (เลือกจังหวัดได้) แล้วติดต่อผ่านช่องทาง LINE ID หรือเบอร์โทรศัพท์ที่น้องระบุไว้ในรายละเอียดโปรไฟล์โดยตรง" 
    },
    { 
        question: "เรทราคางานไซด์ไลน์เริ่มต้นที่เท่าไหร่?", 
        answer: "เรทราคาเริ่มต้นจะขึ้นอยู่กับน้องแต่ละคนและพื้นที่ให้บริการ โปรดตรวจสอบในหน้าโปรไฟล์ของน้องโดยตรง หรือสอบถามผ่านช่องทางการติดต่อน้อง" 
    }
];

// =================================================================
// แก้ไขส่วน: updateAdvancedMeta (Franchise Style)
// =================================================================
function updateAdvancedMeta(profile = null, pageData = null) {
    const oldScript = document.getElementById('schema-jsonld');
    if (oldScript) oldScript.remove();

    // ชื่อแบรนด์หลัก
    const BRAND_NAME = "Sideline Chiangmai";
    const GLOBAL_TITLE = `${BRAND_NAME} | ศูนย์รวมไซด์ไลน์ อันดับ 1 ของภาคเหนือ`;
    const GLOBAL_DESC = `ศูนย์รวมน้องๆ ${BRAND_NAME} และรับงานทั่วประเทศ คัดคนสวย ตรงปก ปลอดภัย 100%`;
    
    if (profile) {
        // --- กรณี: หน้าโปรไฟล์ ---
        // ผลลัพธ์: น้องส้ม - ขอนแก่น | Sideline Chiangmai
        const provinceName = state.provincesMap.get(profile.provinceKey) || 'ไม่ระบุ';
        const title = `${profile.name} - ${provinceName} | ${BRAND_NAME}`; 
        
        const richDescription = `📌 ดูโปรไฟล์น้อง ${profile.name} อายุ ${profile.age} รับงาน${provinceName} ดูแลโดย ${BRAND_NAME} ${profile.quote ? `"${profile.quote}"` : ''}`;
        
        document.title = title;
        updateMeta('description', richDescription); 
        updateMeta('robots', 'index, follow'); 
        updateLink('canonical', `${CONFIG.SITE_URL}/sideline/${profile.slug}`);
        
        updateOpenGraphMeta(profile, title, richDescription, 'profile');
        injectSchema(generatePersonSchema(profile, richDescription));
        injectSchema(generateBreadcrumbSchema('profile', profile.name)); 
        
    } else if (pageData) {
        // --- กรณี: หน้าจังหวัด (ตามที่คุณชอบ) ---
        
        // ดึงหัวข้อมาจาก handleRouting ("รับงานขอนแก่น - ไซด์ไลน์ขอนแก่น")
        // แล้วเติมแบรนด์ต่อท้าย -> "รับงานขอนแก่น - ไซด์ไลน์ขอนแก่น | Sideline Chiangmai"
        const pageTitle = `${pageData.title} | ${BRAND_NAME}`;
        const pageDescription = pageData.description || GLOBAL_DESC;
        
        document.title = pageTitle;
        updateMeta('description', pageDescription);
        updateMeta('robots', 'index, follow'); 
        updateLink('canonical', pageData.canonicalUrl);
        
        updateOpenGraphMeta(null, pageTitle, pageDescription, 'website');
        injectSchema(generateListingSchema(pageData));
        injectSchema(generateBreadcrumbSchema('location', pageData.provinceName));
        
        // Schema บอก Google ว่านี่คือแบรนด์ Sideline Chiangmai
        injectSchema({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": pageData.canonicalUrl,
            "name": `${BRAND_NAME} (${pageData.provinceName})`,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${CONFIG.SITE_URL}/?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        });
        
    } else {
        // --- กรณี: หน้าแรก ---
        document.title = GLOBAL_TITLE;
        updateMeta('description', GLOBAL_DESC);
        updateMeta('robots', 'index, follow'); 
        updateLink('canonical', CONFIG.SITE_URL);
        
        updateOpenGraphMeta(null, GLOBAL_TITLE, GLOBAL_DESC, 'website');
        injectSchema(generateWebsiteSchema()); 
        injectSchema(generateOrganizationSchema()); 
    }
}
// Helper: OpenGraph & Twitter Card Updates (ปรับปรุง: เพิ่ม locale และใช้ CONFIG.DEFAULT_OG_IMAGE)
function updateOpenGraphMeta(profile, title, description, type) {
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:url', profile ? `${CONFIG.SITE_URL}/sideline/${profile.slug}` : CONFIG.SITE_URL);
    updateMeta('og:type', type); 
    updateMeta('og:locale', 'th_TH'); // ✅ NEW: ระบุภาษาไทย
    
    let imageUrl = '';
    let imageAlt = '';

    if(profile && profile.images && profile.images[0]) {
        imageUrl = profile.images[0].src;
        imageAlt = `รูปภาพของ ${profile.name} ไซด์ไลน์ ${state.provincesMap.get(profile.provinceKey) || ''}`; 
    } else {
        imageUrl = CONFIG.DEFAULT_OG_IMAGE; // ✅ REFINED: ใช้ค่าจาก CONFIG
        imageAlt = title;
    }
    
    updateMeta('og:image', imageUrl);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', imageUrl);
    updateMeta('twitter:image:alt', imageAlt); 
}

// ✅ Schema: Person (Enhanced) - ปรับปรุงให้รับ Rich Description
function generatePersonSchema(p, descriptionOverride) {
    const provinceName = state.provincesMap.get(p.provinceKey) || '';
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
        "name": p.name,
        "url": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
        "image": p.images[0].src,
        "description": descriptionOverride || p.description, // ✅ REFINED: ใช้ description ที่ส่งมา
        "jobTitle": "Sideline Model",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": provinceName,
            "addressRegion": "Thailand"
        },
        "additionalProperty": [
            { "@type": "PropertyValue", "name": "Age", "value": p.age },
            { "@type": "PropertyValue", "name": "Height", "value": p.height },
            { "@type": "PropertyValue", "name": "Price", "value": p.rate }
        ],
        "sameAs": [] 
    };
}

// ✅ Schema: Breadcrumb (คงเดิม)
function generateBreadcrumbSchema(pageType, entityName = null) {
    let items = [{ "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.SITE_URL }];
    
    if (pageType === 'profile') {
        items.push({ "@type": "ListItem", "position": 2, "name": "น้องไซด์ไลน์", "item": `${CONFIG.SITE_URL}/sideline/` });
        if (entityName) {
             items.push({ "@type": "ListItem", "position": 3, "name": entityName });
        }
    } else if (pageType === 'location') {
        if (entityName) {
             items.push({ "@type": "ListItem", "position": 2, "name": entityName });
        }
    }
    
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            ...item,
            "position": index + 1
        }))
    };
}

function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": CONFIG.SITE_URL,
        "name": "Sideline Club Thailand", // ใช้ชื่อกลางๆ ที่ดูยิ่งใหญ่
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
        "name": "Sideline Club Thailand", // ใช้ชื่อกลางๆ
        "url": CONFIG.SITE_URL,
        "logo": `${CONFIG.SITE_URL}/images/logo.png`
    };
}
// ✅ Schema: FAQPage (ปรับปรุง: รับ data จากภายนอก)
function generateFAQPageSchema(faqData) {
    if (!faqData || faqData.length === 0) return null; // ป้องกันถ้าไม่มีข้อมูล
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

// ✅ Schema: ItemList (คงเดิม)
function generateListingSchema(data) {
    // ป้องกันการทำงานหาก data.profiles ไม่ใช่ Array
    const profiles = Array.isArray(data.profiles) ? data.profiles : [];
    
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": data.title,
        "url": data.canonicalUrl,
        "numberOfItems": profiles.length,
        "itemListElement": profiles.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `${CONFIG.SITE_URL}/sideline/${p.slug}`,
            "name": p.name
        }))
    };
}

// Helper functions (คงเดิม)
function injectSchema(json) {
    if (!json) return; // เพิ่มความปลอดภัย
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-jsonld';
    script.textContent = JSON.stringify(json);
    document.head.appendChild(script);
}

function updateMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
    el.content = content;
}

function updateLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
    el.href = href;
}
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
// ✨ NEW FEATURE: VIP AGE GATE (HARDCODED COLORS)
// ==========================================
function initAgeVerification() {
    const ts = localStorage.getItem(CONFIG.KEYS.AGE_CONFIRMED);
    if (ts && (Date.now() - parseInt(ts)) < 3600000) return;

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
                    <!-- ปุ่มยืนยัน (Gradient Pink-Purple) -->
                    <button id="age-confirm" style="width: 100%; padding: 14px; background: linear-gradient(90deg, #ec4899, #9333ea); color: white; font-weight: 700; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4); transition: transform 0.2s;">
                        ยืนยัน (เข้าสู่เว็บไซต์)
                    </button>
                    
                    <!-- ปุ่มออก -->
                    <button id="age-reject" style="width: 100%; padding: 12px; background: transparent; color: #9ca3af; font-size: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">
                        ออกจากเว็บไซต์
                    </button>
                </div>

                <div style="margin-top: 24px; font-size: 10px; color: #6b7280;">
                    By entering, you agree to our Terms & Privacy Policy.
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(div);
    document.body.style.overflow = 'hidden';

    // Animation Effect (GSAP)
    const card = div.querySelector('div[style*="background: rgba"]'); // เลือกตัวการ์ด
    gsap.from(card, { 
        y: 50, 
        opacity: 0, 
        duration: 0.8, 
        ease: "back.out(1.2)",
        delay: 0.2 
    });

    // Hover Effect แบบบ้านๆ ด้วย JS (เผื่อ CSS ไม่ทำงาน)
    const btn = document.getElementById('age-confirm');
    btn.onmouseover = () => btn.style.transform = "scale(1.03)";
    btn.onmouseout = () => btn.style.transform = "scale(1)";

    document.getElementById('age-confirm').onclick = () => {
        localStorage.setItem(CONFIG.KEYS.AGE_CONFIRMED, Date.now());
        
        gsap.to(card, { scale: 0.9, opacity: 0, duration: 0.3 });
        gsap.to(div, { 
            opacity: 0, 
            duration: 0.5, 
            delay: 0.1,
            onComplete: () => {
                div.remove();
                document.body.style.overflow = '';
            }
        });
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
        urls.push({ loc: processUrl(''), priority: '1.0', freq: 'daily' });
        state.allProfiles.forEach(p => { if (p.slug) { urls.push({ loc: processUrl(`sideline/${p.slug.trim()}`), priority: '0.9', freq: 'daily' }); } });
        if (state.provincesMap && state.provincesMap.size > 0) { state.provincesMap.forEach((name, key) => { urls.push({ loc: processUrl(`location/${key}`), priority: '0.8', freq: 'daily' }); }); }
        ['blog.html', 'about.html', 'faq.html', 'profiles.html', 'locations.html'].forEach(page => { urls.push({ loc: processUrl(page), priority: '0.7', freq: 'weekly' }); });
        const xmlContent = urls.map(u => `<url><loc>${u.loc}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`).join('\n');
        return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlContent}</urlset>`;
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
    // 13. DYNAMIC FOOTER SYSTEM (COMPLETE VERSION)
    // =================================================================
    async function initFooterLinks() {
        const footerContainer = document.getElementById('popular-locations-footer');
        if (!footerContainer) return;

        let provincesList = [];

        // 1. พยายามดึงจาก Memory ก่อน (เร็วที่สุด)
        if (state.provincesMap && state.provincesMap.size > 0) {
            state.provincesMap.forEach((name, key) => {
                provincesList.push({ key: key, name: name });
            });
        } 
        // 2. ถ้า Memory ว่าง (เช่น เข้าหน้านี้โดยตรง) ให้ดึงจาก Supabase
        else if (window.supabase) {
            try {
                const { data, error } = await window.supabase
                    .from('provinces')
                    .select('*'); // ดึงมาทั้งหมดแล้วค่อยเลือกฟิลด์
                
                if (!error && data) {
                    provincesList = data.map(p => ({
                        key: p.key || p.slug || p.id,
                        name: p.nameThai || p.name_thai || p.thai_name || p.name // รองรับทุกชื่อคอลัมน์
                    })).filter(p => p.key && p.name);
                }
            } catch (e) {
                console.warn("Footer fallback load failed", e);
            }
        }

        // 3. กรณีเลวร้ายสุด: ไม่เจอข้อมูลเลย (ป้องกันหน้าขาว)
        if (provincesList.length === 0) {
            // ให้ลิงก์กลับหน้าแรกแทนการ Hardcode ไปจังหวัดใดจังหวัดหนึ่ง
            footerContainer.innerHTML = `<li><a href="/" class="hover:text-pink-500 transition-colors">✨ ดูโปรไฟล์น้องๆ ทั้งหมด</a></li>`;
            return;
        }

        // 4. เรียงลำดับ ก-ฮ
        provincesList.sort((a, b) => a.name.localeCompare(b.name, 'th'));

        // 5. แสดงผล (จำกัด 15 จังหวัดยอดฮิต เพื่อไม่ให้ Footer ยาวเกิน)
        const displayLimit = 15;
        const html = provincesList.slice(0, displayLimit).map(p => 
            `<li><a href="/location/${p.key}" title="รับงาน${p.name} | Sideline Chiangmai" class="hover:text-pink-500 transition-colors">ไซด์ไลน์${p.name}</a></li>`
        ).join('');

        // 6. ปุ่ม "ดูทั้งหมด" ถ้ามีมากกว่า 15 จังหวัด
        let viewAllLink = '';
        if (provincesList.length > displayLimit) {
            viewAllLink = `<li><a href="/" class="text-pink-500 font-bold hover:underline mt-2 inline-block">🔥 ดูจังหวัดอื่นๆ เพิ่มเติม (${provincesList.length - displayLimit}+)</a></li>`;
        }

        footerContainer.innerHTML = html + viewAllLink;
    }
})();