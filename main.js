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
    

function getCleanName(rawName) {
    if (!rawName || typeof rawName !== 'string') return "";
    // ตัดคำว่า "น้อง" ออกก่อน และล้างช่องว่าง
    let name = rawName.trim().replace(/^(น้อง\s?)/, '');
    // ปรับมาตรฐานตัวอักษร: mimi -> Mimi | ส้ม -> ส้ม
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

// ✅ SUPREME FETCH DELTA (FIXED & SEO INTEGRATED)
// ใช้ created_at เป็นหลักและเชื่อมโยงระบบ SEO ให้สมบูรณ์
async function fetchDataDelta() {
    if (state.isFetching) return false;
    state.isFetching = true;

    if (!supabase) {
        state.isFetching = false;
        console.error("❌ Supabase client not initialized");
        return false;
    }

    try {
        console.log('🔄 Starting supreme delta fetch...');

        // 1. ดึงข้อมูลจังหวัดและโปรไฟล์พร้อมกัน (Optimized Performance)
        const [provincesRes, profilesRes] = await Promise.all([
            supabase.from('provinces').select('*'),
            supabase.from('profiles')
                .select('*')
                .gt('created_at', state.lastFetchedAt || '1970-01-01T00:00:00Z') 
                .order('created_at', { ascending: false })
        ]);

        if (provincesRes.error) throw provincesRes.error;
        if (profilesRes.error) throw profilesRes.error;

        // 2. จัดการ Mapping จังหวัด (เพื่อให้ชื่อจังหวัดใน SEO ถูกต้อง)
        state.provincesMap.clear();
        (provincesRes.data || []).forEach(p => {
            const thName = p.nameThai || p.name_thai || p.thai_name || p.name || p.provinceName;
            const key = p.key || p.slug || p.id;
            if (key && thName) {
                state.provincesMap.set(key.toString(), thName.trim());
            }
        });

        const fetchedProfiles = profilesRes.data || [];
        console.log(`📊 Fetched ${fetchedProfiles.length} new profiles`);

        // 3. Process ข้อมูลใหม่พร้อมฉีดระบบ SEO
        if (fetchedProfiles.length > 0) {
            const newProcessedProfiles = fetchedProfiles
                .map(p => processProfileData(p)) // ฟังก์ชันนี้จะทำ getCleanName และสร้าง Alt Text
                .filter(Boolean);

            if (newProcessedProfiles.length > 0) {
                // Merge ข้อมูลใหม่เข้ากับข้อมูลเดิม (ไม่ให้ข้อมูลซ้ำ)
                state.allProfiles = mergeProfilesData(state.allProfiles, newProcessedProfiles);

                // อัปเดตตัวแปรเวลาล่าสุดเพื่อใช้ในการโหลดครั้งต่อไป
                const newestDate = fetchedProfiles
                    .map(p => p.created_at)
                    .filter(Boolean)
                    .sort()
                    .pop();

                if (newestDate) state.lastFetchedAt = newestDate;
            }
        }

        // 4. กรณีไม่มีข้อมูลใน State เลย (เช่น เปิดเว็บครั้งแรก) ให้ดึงทั้งหมด
        if (state.allProfiles.length === 0) {
            console.log('🔄 Initial load: Fetching all records...');
            const allRes = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (allRes.error) throw allRes.error;

            state.allProfiles = (allRes.data || [])
                .map(p => processProfileData(p))
                .filter(Boolean);

            const newest = allRes.data?.map(p => p.created_at).filter(Boolean).sort().pop();
            if (newest) state.lastFetchedAt = newest;
        }

        // 5. จัดเรียงข้อมูล (อัปเดตล่าสุดขึ้นก่อน) และแสดงผล
        state.allProfiles.sort((a, b) => {
            const dateA = new Date(a.created_at || 0);
            const dateB = new Date(b.created_at || 0);
            return dateB - dateA;
        });

        // 6. อัปเดต UI และ Cache
        populateProvinceDropdown();
        renderProfiles(state.allProfiles, false); 

        // เก็บลง LocalStorage เพื่อความเร็วในการเข้าครั้งถัดไป
        try {
            localStorage.setItem(CONFIG.KEYS.CACHE_PROFILES, JSON.stringify(state.allProfiles));
            localStorage.setItem(CONFIG.KEYS.LAST_FETCH, Date.now().toString());
            localStorage.setItem('lastFetchedAt', state.lastFetchedAt); // เก็บเวลาล่าสุดไว้ด้วย
        } catch (e) {
            console.warn('⚠️ LocalStorage limit reached, cache not saved');
        }

        state.isFetching = false;
        return true;

    } catch (err) {
        console.error('❌ Fetch Delta Critical Error:', err);
        
        // Fallback: ใช้ข้อมูลเก่าจาก Cache ถ้า API พัง
        const cachedJSON = localStorage.getItem(CONFIG.KEYS.CACHE_PROFILES);
        if (cachedJSON) {
            state.allProfiles = JSON.parse(cachedJSON).map(p => processProfileData(p)).filter(Boolean);
            renderProfiles(state.allProfiles, false);
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


// ✅ 2. ฟังก์ชันประมวลผลข้อมูล (วางทับของเดิม)
function processProfileData(p) {
    if (!p) return null;

    const displayName = getCleanName(p.name); 

    // จัดการรูปภาพ
    const imagePaths = [p.imagePath, ...(Array.isArray(p.galleryPaths) ? p.galleryPaths : [])].filter(Boolean);
    let imageObjects = imagePaths.map(path => {
        const { data } = supabase.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
        return { src: data?.publicUrl || CONFIG.DEFAULT_OG_IMAGE };
    });
    if (imageObjects.length === 0) imageObjects.push({ src: CONFIG.DEFAULT_OG_IMAGE });

    // สุ่มคำ SEO
    const v = SEO_WORDS.pick('styles');
    const t = SEO_WORDS.pick('trust');
    const g = SEO_WORDS.pick('guarantees');

    const provinceName = state.provincesMap.get(p.provinceKey) || 'เชียงใหม่';
    const statsText = p.stats ? `สัดส่วน ${p.stats}` : '';
    const locationText = p.location ? `พิกัด ${p.location}` : '';

    // สร้าง Alt Text สำหรับ Google Image Search
    const richAltText = `รูปตัวจริง${displayName} ไซด์ไลน์${provinceName} ${v} ${g} ${t} ${statsText} รับงานเอง ตรงปก`;
    const imgTitleText = `${displayName} (${provinceName}) - ${v} ${g} [คลิกดูรูปเพิ่ม]`;

    return { 
        ...p, 
        displayName,
        images: imageObjects, 
        altText: richAltText,
        imgTitle: imgTitleText,
        provinceNameThai: provinceName,
        searchString: `${displayName} ${provinceName} ${p.provinceKey} ${p.description || ''} ${p.rate || ''} ${p.stats || ''} ${locationText} ${v} ${t}`.toLowerCase(),
        _price: Number(String(p.rate).replace(/\D/g, '')) || 0, 
        _age: Number(p.age) || 0
    };
}
// =================================================================
// 3. POPULATE LIGHTBOX DATA (ฉบับเต็ม: รายละเอียดครบ + Line Button)
// =================================================================
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

    // 1. Header Name
    if (els.name) els.name.textContent = p.name || 'ไม่ระบุชื่อ';

    // 2. Quote
    if (els.quote) {
        const hasQuote = p.quote && p.quote.trim() !== '';
        els.quote.textContent = hasQuote ? `"${p.quote}"` : '';
        els.quote.style.display = hasQuote ? 'block' : 'none';
    }
    
    // 3. Availability Badge
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

    // 4. Hero Image (รูปใหญ่)
    if (els.hero) {
        els.hero.src = p.images?.[0]?.src || '/images/placeholder-profile.webp';
        els.hero.alt = p.altText;
        els.hero.title = p.imgTitle;
    }

    // 5. Thumbnails (อัลบั้มรูป)
    if (els.thumbs) {
        els.thumbs.innerHTML = '';
        const hasGallery = p.images && p.images.length > 1;
        if (hasGallery) {
            const fragment = document.createDocumentFragment();
            p.images.forEach((img, i) => {
                const thumb = document.createElement('img');
                thumb.className = `thumbnail ${i === 0 ? 'active' : ''}`;
                thumb.src = img.src;
                
                // สร้าง Alt Text แยกย่อยแต่ละรูป
                let thumbAlt = '';
                if (i === 0) thumbAlt = `รูปโปรไฟล์ ${p.name} ${p.provinceNameThai} หน้าตาดี`;
                else if (i === 1) thumbAlt = `รูปเต็มตัว น้อง${p.name} สัดส่วน ${p.stats || 'ดี'}`;
                else thumbAlt = `อัลบั้มรูปภาพ ${p.name} รูปที่ ${i+1} บรรยากาศจริง`;
                
                thumb.alt = thumbAlt;
                thumb.title = `คลิกเพื่อดูรูปขนาดใหญ่ (รูปที่ ${i+1})`;
                thumb.loading = 'lazy';
                
                thumb.onclick = () => {
                    if (els.hero) {
                        els.hero.src = img.src;
                        els.hero.alt = thumbAlt; 
                        els.hero.classList.remove('fade-in'); 
                        void els.hero.offsetWidth; 
                        els.hero.classList.add('fade-in');
                    }
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

    // 6. Tags
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

    // 7. Details (ข้อมูลรายละเอียด)
    if (els.detailsContainer) {
        const provinceName = p.provinceNameThai || ''; 
        const fullLocation = [provinceName, p.location ? `(${p.location})` : ''].filter(Boolean).join(' ').trim();
        const dateToShow = p.lastUpdated || p.created_at;
        const formattedDate = formatDate(dateToShow);

        let detailsHTML = '';

        // ข้อมูลกายภาพ
        detailsHTML += `
            <div class="stats-grid-container">
                ${p.age ? `<div class="stat-box"><span class="stat-label">อายุ</span><span class="stat-value">${p.age} ปี</span></div>` : ''}
                ${p.stats ? `<div class="stat-box"><span class="stat-label">สัดส่วน</span><span class="stat-value">${p.stats}</span></div>` : ''}
                ${(p.height || p.weight) ? `<div class="stat-box"><span class="stat-label">สูง/หนัก</span><span class="stat-value">${p.height || '-'}/${p.weight || '-'}</span></div>` : ''}
            </div>`;

        // ข้อมูลบริการ
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

    // 8. Description
    if (els.descContainer && els.descContent) {
        const hasDescription = p.description && p.description.trim() !== '';
        if (hasDescription) {
            els.descContent.innerHTML = p.description.replace(/\n/g, '<br>');
            els.descContainer.style.display = 'block';
        } else {
            els.descContainer.style.display = 'none';
        }
    }

    // 9. LINE Button (Sticky + Popup Modal)
    const oldWrapper = document.getElementById('line-btn-sticky-wrapper');
    if (oldWrapper) oldWrapper.remove();
    
    if (p.lineId && els.lineBtnContainer) {
        const wrapper = document.createElement('div');
        wrapper.id = 'line-btn-sticky-wrapper';
        wrapper.className = 'lb-sticky-footer';

        const profileUrl = `${CONFIG.SITE_URL}/sideline/${p.slug}`;
        const autoMessage = `สวัสดีครับ สนใจน้อง ${p.name} เห็นจากเว็บ Sideline Chiangmai ครับ\n${profileUrl}`;
        
        let finalLineUrl = p.lineId;
        if (!p.lineId.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${p.lineId}`;
        }

        const link = document.createElement('a');
        link.className = 'btn-line-action';
        link.href = '#'; 
        link.innerHTML = `<i class="fab fa-line text-xl"></i> แอดไลน์ ${p.name || ''}`;

        link.onclick = (e) => {
            e.preventDefault();

            if (navigator.clipboard) {
                navigator.clipboard.writeText(autoMessage).catch(console.error);
            }

            const modal = document.createElement('div');
            modal.style.cssText = "position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); animation: fadeIn 0.2s ease-out;";
            
            modal.innerHTML = `
                <div style="background: white; width: 100%; max-width: 340px; border-radius: 24px; padding: 30px 24px; text-align: center; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                    <div style="width: 70px; height: 70px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 0 8px rgba(209, 250, 229, 0.3);">
                        <i class="fas fa-check" style="font-size: 32px; color: #059669;"></i>
                    </div>
                    <h3 style="font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 10px; line-height: 1.3;">คัดลอกข้อมูลแล้ว!</h3>
                    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                        ระบบบันทึกชื่อน้องให้แล้วครับ<br>
                        เมื่อแอป LINE เปิดขึ้นมา<br>
                        <span style="background: #fdf2f8; padding: 4px 12px; border-radius: 6px; font-weight: bold; color: #db2777; display: inline-block; margin-top: 4px; border: 1px solid #fbcfe8;">กรุณากด "วาง" (Paste) ในแชท</span>
                    </p>
                    <a href="${finalLineUrl}" id="go-to-line-btn" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: #06c755; color: white; font-weight: bold; border-radius: 14px; text-decoration: none; font-size: 16px; box-shadow: 0 4px 15px rgba(6, 199, 85, 0.4); transition: transform 0.1s;">
                        <i class="fab fa-line" style="font-size: 24px;"></i> เปิด LINE ทันที
                    </a>
                    <button id="close-modal-btn" style="margin-top: 16px; background: transparent; border: none; color: #9ca3af; font-size: 14px; cursor: pointer; padding: 8px;">
                        ยกเลิก
                    </button>
                </div>
            `;

            document.body.appendChild(modal);

            const closeBtn = modal.querySelector('#close-modal-btn');
            const goBtn = modal.querySelector('#go-to-line-btn');

            const closeModal = () => {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 200);
            };

            closeBtn.onclick = closeModal;
            modal.onclick = (ev) => { if(ev.target === modal) closeModal(); }; 
            
            goBtn.onclick = () => {
                setTimeout(closeModal, 500);
            };
        };
        
        wrapper.appendChild(link);
        els.lineBtnContainer.appendChild(wrapper);
    }
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

// 1. ฟังก์ชัน Render หลัก
function renderProfiles(profiles, isSearching) {
    if (!dom.profilesDisplayArea) return;
    dom.profilesDisplayArea.innerHTML = '';

    // --- ส่วน Featured (แสดงเฉพาะหน้าแรก) ---
    if (dom.featuredSection) {
        const isHome = !isSearching && !window.location.pathname.includes('/location/');
        dom.featuredSection.classList.toggle('hidden', !isHome);

        if (isHome && dom.featuredContainer && state.allProfiles.length > 0) {
            if (dom.featuredContainer.children.length === 0) {
                const featured = state.allProfiles.filter(p => p.isfeatured);
                const frag = document.createDocumentFragment();
                // ✅ ส่ง index (i) ไปด้วย
                featured.forEach((p, i) => frag.appendChild(createProfileCard(p, i)));
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
    const isLocationPage = window.location.pathname.includes('/location/') || window.location.pathname.includes('/province/');

    if (isSearching || isLocationPage) {
        // โหมด 1: ผลลัพธ์การค้นหา หรือ หน้าจังหวัดเดี่ยว
        dom.profilesDisplayArea.appendChild(createSearchResultSection(profiles));
    } else {
        // โหมด 2: หน้าแรกดูรวม (แยกหมวด)
        renderByProvince(profiles);
    }

    if (window.ScrollTrigger) ScrollTrigger.refresh();
    initScrollAnimations();
} // ✅ ปิด renderProfiles

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

// =================================================================
// 2. CREATE PROFILE CARD (ฉบับสมบูรณ์ที่สุด: SEO Image + Lazy Load + Interaction)
// =================================================================
function createProfileCard(p, index = 20) {
    if (!p) return document.createElement('div');

    const cardContainer = document.createElement('div');
    cardContainer.className = 'profile-card-new-container';

    const cardInner = document.createElement('div');
    // เพิ่มการจัดการ Dark/Light mode และ Transition ที่ลื่นไหล
    cardInner.className = 'profile-card-new group relative overflow-hidden rounded-2xl shadow-lg bg-gray-200 dark:bg-gray-800 cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2';
    
    cardInner.setAttribute('data-profile-id', p.id); 
    cardInner.setAttribute('data-profile-slug', p.slug || p.id);
    
    // ดึงรูปภาพแรก (ใช้ค่าเริ่มต้นหากไม่มีรูป)
    const imgSrc = (p.images && p.images.length > 0) ? p.images[0].src : CONFIG.DEFAULT_OG_IMAGE;

    /**
     * 🔥 SEO & Performance Strategy:
     * 1. index < 4 ให้โหลดทันที (eager) เพื่อคะแนน LCP (Largest Contentful Paint)
     * 2. index >= 4 ให้โหลดเมื่อเลื่อนถึง (lazy) เพื่อประหยัดเน็ตและเปิดเว็บไว
     * 3. ใส่ alt และ title ที่ถูกประมวลผลมาจาก processProfileData (สุ่มคีย์เวิร์ด)
     */
    const loadingAttr = index < 4 ? 'eager' : 'lazy';

    cardInner.innerHTML = `
        <div class="skeleton-loader absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse z-0"></div>

        <img src="${imgSrc}" 
             alt="${p.altText || `น้อง${p.name} ไซด์ไลน์${p.provinceNameThai || 'เชียงใหม่'}`}" 
             title="${p.imgTitle || `คลิกดูโปรไฟล์ น้อง${p.name}`}"
             class="card-image w-full h-full object-cover transition-opacity duration-700 opacity-0 absolute inset-0 z-0"
             loading="${loadingAttr}"
             width="300" height="400" 
             style="object-position: center top;"
             onload="this.classList.remove('opacity-0'); if(this.previousElementSibling) this.previousElementSibling.remove();"
             onerror="this.src='${CONFIG.DEFAULT_OG_IMAGE}'; this.classList.remove('opacity-0');">
             
        <a href="/sideline/${p.slug || p.id}" 
           class="card-link absolute inset-0 z-10" 
           aria-label="ดูรายละเอียดน้อง${p.displayName} ${p.provinceNameThai}"></a>
    `;

    // --- ส่วนที่ 1: Badges (สถานะ & แนะนำ) ---
    let statusClass = 'status-inquire';
    const availability = (p.availability || '').toLowerCase();
    if (availability.includes('ว่าง') || availability.includes('รับงาน')) {
        statusClass = 'status-available';
    } else if (availability.includes('ไม่ว่าง') || availability.includes('พัก')) {
        statusClass = 'status-busy';
    }
    
    const badgesHTML = `
        <div class="absolute top-3 right-3 flex flex-col gap-1.5 items-end z-20 pointer-events-none">
            <span class="availability-badge ${statusClass} shadow-md backdrop-blur-md bg-black/30 border border-white/20 text-[10px] font-bold px-2.5 py-1 rounded-full text-white uppercase tracking-wider">
                ${p.availability || 'สอบถาม'}
            </span>
            ${p.isfeatured ? `
                <span class="featured-badge bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center">
                    <i class="fas fa-star mr-1 animate-pulse"></i>แนะนำ
                </span>
            ` : ''}
        </div>
    `;

    // --- ส่วนที่ 2: Overlay ข้อมูลด้านล่าง ---
    const likedProfiles = JSON.parse(localStorage.getItem('liked_profiles') || '{}');
    const isLikedClass = likedProfiles[p.id] ? 'liked text-pink-500' : 'text-white';
    const likeCount = p.likes || 0;

    const overlayHTML = `
        <div class="card-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent p-4 flex flex-col justify-end" 
             style="z-index: 20; pointer-events: none;">
            
            <div class="card-info">
                <h3 class="text-xl font-bold text-white drop-shadow-lg leading-tight truncate mb-1">
                    ${p.displayName || p.name}
                </h3>
                
                <div class="flex items-center justify-between mb-3">
                    <p class="text-sm text-gray-200 flex items-center">
                        <i class="fas fa-map-marker-alt mr-1.5 text-pink-500"></i>
                        ${p.provinceNameThai || 'เชียงใหม่'}
                    </p>
                    ${p.rate ? `<span class="text-pink-400 font-bold text-sm">฿${p.rate}</span>` : ''}
                </div>

                <div class="flex justify-between items-center border-t border-white/20 pt-3">
                    <div class="date-stamp text-[10px] text-gray-400 font-medium">
                        <i class="far fa-clock mr-1"></i> ${formatDate(p.created_at)}
                    </div>
                    
                    <div class="like-button-wrapper relative flex items-center gap-2 cursor-pointer group/like ${isLikedClass} hover:text-pink-400 transition-all duration-300"
                         style="pointer-events: auto !important; z-index: 30 !important;"
                         data-action="like" 
                         data-id="${p.id}"
                         role="button"
                         aria-label="กดถูกใจ">
                        <i class="fas fa-heart text-xl transition-transform duration-300 group-hover/like:scale-125"></i>
                        <span class="like-count text-sm font-black">${likeCount}</span>
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

    // =================================================================
    // 9. LIGHTBOX & HELPER FUNCTIONS
    // =================================================================


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
        // ✅ FIX: ใช้ p.provinceNameThai ที่ถูกเตรียมไว้แล้วจาก processProfileData โดยตรง!
        const provinceName = p.provinceNameThai || ''; 
        
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

// --- 7. LINE Button (Popup Guide Version - แบบมีหน้าต่างแจ้งเตือนลูกค้า) ---
    const oldWrapper = document.getElementById('line-btn-sticky-wrapper');
    if (oldWrapper) oldWrapper.remove();
    
    if (p.lineId && els.lineBtnContainer) {
        const wrapper = document.createElement('div');
        wrapper.id = 'line-btn-sticky-wrapper';
        wrapper.className = 'lb-sticky-footer';

        // 1. เตรียมข้อมูลสำหรับ Copy
        const profileUrl = `${CONFIG.SITE_URL}/sideline/${p.slug}`;
        const autoMessage = `สวัสดีครับ สนใจน้อง ${p.name} เห็นจากเว็บ Sideline Chiangmai ครับ\n${profileUrl}`;
        
        // 2. เตรียมลิงก์ LINE (รองรับทั้ง ID ธรรมดา และ Link เต็ม)
        let finalLineUrl = p.lineId;
        if (!p.lineId.startsWith('http')) {
            // ใช้ ti/p/~ เพื่อไปหน้าเพิ่มเพื่อน
            finalLineUrl = `https://line.me/ti/p/~${p.lineId}`;
        }

        const link = document.createElement('a');
        link.className = 'btn-line-action';
        link.href = '#'; // ใส่ # ไว้ก่อนเพื่อดัก event
        link.innerHTML = `<i class="fab fa-line text-xl"></i> แอดไลน์ ${p.name || ''}`;

        // 🔥 Event: กดปุ่มแล้วเด้ง Popup แจ้งเตือน
        link.onclick = (e) => {
            e.preventDefault();

            // A. สั่ง Copy ข้อความทันที
            if (navigator.clipboard) {
                navigator.clipboard.writeText(autoMessage).catch(console.error);
            }

            // B. สร้าง Popup (Modal) ขึ้นมาบังหน้าจอ
            const modal = document.createElement('div');
            // ใส่ Style แบบ Inline เพื่อให้มั่นใจว่าแสดงผลถูกต้องแน่นอน
            modal.style.cssText = "position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); animation: fadeIn 0.2s ease-out;";
            
            modal.innerHTML = `
                <div style="background: white; width: 100%; max-width: 340px; border-radius: 24px; padding: 30px 24px; text-align: center; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                    
                    <!-- ไอคอนเช็คถูก -->
                    <div style="width: 70px; height: 70px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 0 8px rgba(209, 250, 229, 0.3);">
                        <i class="fas fa-check" style="font-size: 32px; color: #059669;"></i>
                    </div>

                    <h3 style="font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 10px; line-height: 1.3;">คัดลอกข้อมูลแล้ว!</h3>
                    
                    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                        ระบบบันทึกชื่อน้องให้แล้วครับ<br>
                        เมื่อแอป LINE เปิดขึ้นมา<br>
                        <span style="background: #fdf2f8; padding: 4px 12px; border-radius: 6px; font-weight: bold; color: #db2777; display: inline-block; margin-top: 4px; border: 1px solid #fbcfe8;">กรุณากด "วาง" (Paste) ในแชท</span>
                    </p>

                    <!-- ปุ่มไป LINE -->
                    <a href="${finalLineUrl}" id="go-to-line-btn" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: #06c755; color: white; font-weight: bold; border-radius: 14px; text-decoration: none; font-size: 16px; box-shadow: 0 4px 15px rgba(6, 199, 85, 0.4); transition: transform 0.1s;">
                        <i class="fab fa-line" style="font-size: 24px;"></i> เปิด LINE ทันที
                    </a>

                    <!-- ปุ่มปิด -->
                    <button id="close-modal-btn" style="margin-top: 16px; background: transparent; border: none; color: #9ca3af; font-size: 14px; cursor: pointer; padding: 8px;">
                        ยกเลิก
                    </button>
                </div>
            `;

            document.body.appendChild(modal);

            // C. จัดการปุ่มใน Popup
            const closeBtn = modal.querySelector('#close-modal-btn');
            const goBtn = modal.querySelector('#go-to-line-btn');

            const closeModal = () => {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 200);
            };

            closeBtn.onclick = closeModal;
            modal.onclick = (ev) => { if(ev.target === modal) closeModal(); }; // กดพื้นหลังปิด
            
            // พอกดปุ่มเขียว ให้ปิด Modal แล้วไป LINE
            goBtn.onclick = () => {
                setTimeout(closeModal, 500);
            };
        };
        
        wrapper.appendChild(link);
        els.lineBtnContainer.appendChild(wrapper);
    }
}



// ==========================================
// 💎 SEO STRATEGIC POOL (ฉบับจัดเต็ม)
// ==========================================
const SEO_POOL = {
    styles: [
        "ฟิวแฟนแท้ๆ", 
        "งานเนี๊ยบดูแลดี", 
        "สายหวานคุยสนุก", 
        "เป็นกันเองสุดๆ", 
        "งานละเมียดใส่ใจ", 
        "สายอ้อนน่ารัก", 
        "งานคุณภาพตรงปก"
    ],
    trust: [
        "ไม่มีมัดจำ", 
        "นัดเจอจ่ายหน้างาน", 
        "ไม่ต้องโอนก่อน", 
        "จ่ายเงินตอนเจอตัว", 
        "ปลอดภัยไม่โดนโกง", 
        "เช็คของก่อนจ่าย"
    ],
    guarantee: [
        "ตัวจริงตรงรูป 100%", 
        "รูปปัจจุบันแน่นอน", 
        "ไม่จกตา", 
        "การันตีความสวย", 
        "คัดคนงานดี", 
        "ตรงปกไม่ผิดหวัง"
    ],
    pick: function(group) {
        return this[group][Math.floor(Math.random() * this[group].length)];
    }
};

// =================================================================
// 10. SEO META TAGS UPDATER (THE BEST VERSION - PRICE INCLUDED)
// =================================================================

/**
 * 🔥 SUPREME DYNAMIC SEO ENGINE - FULL VERSION
 * จัดการ Title, Meta, และ JSON-LD Schema แบบละเอียดที่สุด
 */
function updateAdvancedMeta(profile = null, pageData = null) {
    // --- 1. การจัดการความสะอาดของระบบ ---
    // ล้าง Schema เดิมทั้งหมดเพื่อป้องกันข้อมูลขยะขัดขวางการจัดอันดับของ Google
    const oldScripts = document.querySelectorAll('script[id^="schema-jsonld"]');
    oldScripts.forEach(s => s.remove());

    // --- 2. การตั้งค่าตัวแปรเวลา (Freshness Factor) ---
    // Google ให้คะแนนหน้าที่ระบุวันเวลาปัจจุบันสูงกว่า
    const YEAR_TH = new Date().getFullYear() + 543; // ปี พ.ศ.
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const d = new Date();
    const CURRENT_DATE = `${d.getDate()} ${thaiMonths[d.getMonth()]} ${YEAR_TH}`;

    // --- 3. ฟังก์ชันภายใน: ล้างชื่อให้สมบูรณ์ (จุดที่ 1 ที่ต้องแก้) ---
    const getCleanName = (rawName) => {
        if (!rawName) return "";
        let name = rawName.trim().replace(/^(น้อง\s?)/, ''); // ตัด "น้อง" ที่อาจซ้ำซ้อน
        name = name.toLowerCase(); // ปรับมาตรฐานตัวพิมพ์เล็กก่อน
        // ปรับตัวแรกเป็นตัวใหญ่ (Proper Noun) เพื่อให้ Google มองว่าเป็นชื่อเฉพาะที่มีคุณภาพ
        return `น้อง${name.charAt(0).toUpperCase() + name.slice(1)}`;
    };

    // ==========================================
    // CASE A: หน้าโปรไฟล์รายบุคคล (เน้นปิดการขาย)
    // ==========================================
    if (profile) {
        const displayName = getCleanName(profile.name);
        const cleanNameOnly = displayName.replace('น้อง', '');
        const province = profile.provinceNameThai || 'เชียงใหม่';
        
        // รวบรวมข้อมูลดิบ
        const priceTag = profile.rate ? `ราคา ${profile.rate}` : 'รับงานเอง'; 
        const stats = profile.stats ? `สัดส่วน ${profile.stats}` : '';
        const age = profile.age ? `อายุ ${profile.age}` : '';
        const location = profile.location ? `พิกัด ${profile.location}` : province;

        // ดึงพลังจากการสุ่มคำ (จุดที่ 2 เพื่อความไม่ตายตัว)
        const v = SEO_POOL.pick('styles');
        const t = SEO_POOL.pick('trust');
        const g = SEO_POOL.pick('guarantee');

        // 🔥 STRATEGIC TITLE: [ชื่อ] [จังหวัด] [ราคา] | [จุดเด่น] [ความปลอดภัย] [การันตี]
        // โครงสร้างนี้ถูกวิเคราะห์มาแล้วว่าครอบคลุมการค้นหา (Search Intent) มากที่สุด
        const finalTitle = `${displayName} ไซด์ไลน์${province} ${priceTag} | ${v} ${t} ${g} (${YEAR_TH})`;

        // 🔥 STRATEGIC DESCRIPTION: เน้น Keyword หนาแน่นแต่เป็นธรรมชาติ
        const finalDesc = `ดูโปรไฟล์ ${displayName} ไซด์ไลน์${province} ${priceTag}. ${stats} ${age} พิกัด: ${location}. บริการสไตล์${v} ${g}. มั่นใจปลอดภัยสูงสุดด้วยระบบ${t} จ่ายหน้างาน 100% ไม่มีการโอนก่อน อัปเดตข้อมูลล่าสุด ${CURRENT_DATE}.`;

        // 🎯 อัปเดตลง DOM จริง
        document.title = finalTitle;
        updateMeta('description', finalDesc);
        updateMeta('keywords', `${displayName}, ไซด์ไลน์${province}, รับงาน${province}, ${cleanNameOnly} ${t}, ${v}, ${g}`);
        updateLink('canonical', `${CONFIG.SITE_URL}/sideline/${profile.slug || profile.id}`);
        
        // 🎯 ส่งข้อมูลไปที่ Social Media Meta
        updateOpenGraphMeta(profile, finalTitle, finalDesc, 'profile');

        // 🎯 ฝังโครงสร้างข้อมูลเชิงลึก (JSON-LD)
        injectSchema(generatePersonSchema(profile, finalDesc, province), 'schema-jsonld-person');
        injectSchema(generateBreadcrumbSchema('profile', displayName, province), 'schema-jsonld-breadcrumb');

    } 
    // ==========================================
    // CASE B: หน้าจังหวัด / หน้าหมวดหมู่ (Listing)
    // ==========================================
    else if (pageData) {
        const province = pageData.provinceName || 'เชียงใหม่';
        const count = pageData.profiles ? pageData.profiles.length : 'หลาย';
        const t = SEO_POOL.pick('trust');

        const pageTitle = `ไซด์ไลน์${province} ${t} ราคาดีที่สุด | รวมรูปน้องๆ ${province} ตรงปก (${YEAR_TH})`;
        const pageDesc = `รวมรายชื่อน้องๆ ไซด์ไลน์${province} และเด็กเอ็นฯ คุณภาพ พิกัด${province} กว่า ${count} คน. ข้อมูลชัดเจน รูปตรงปก ${t} นัดเจอจ่ายเงินหน้างานเท่านั้น อัปเดตล่าสุด ${CURRENT_DATE}.`;

        document.title = pageTitle;
        updateMeta('description', pageDesc);
        updateMeta('keywords', `ไซด์ไลน์${province}, รับงาน${province}, เด็กเอ็น${province}, ${province} ไม่มัดจำ`);
        updateLink('canonical', pageData.canonicalUrl || window.location.href);
        
        updateOpenGraphMeta(null, pageTitle, pageDesc, 'website');
        injectSchema(generateListingSchema(pageData), 'schema-jsonld-list');
        injectSchema(generateBreadcrumbSchema('location', province), 'schema-jsonld-breadcrumb');
    } 
    // ==========================================
    // CASE C: หน้าแรก (Home) - พลังของ FAQ & Trust
    // ==========================================
    else {
        // ป้องกันการทับซ้อนหน้า Static อื่นๆ
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '/index.html' && currentPath !== '') {
            return; 
        }

        const GLOBAL_TITLE = `ไซด์ไลน์เชียงใหม่ รับงานเอง ไม่มัดจำ ตรงปก 100% | Sideline Chiangmai (${YEAR_TH})`;
        const GLOBAL_DESC = `ศูนย์รวมไซด์ไลน์เชียงใหม่ และทั่วประเทศไทย แสดงราคาชัดเจน คัดน้องๆ งานฟิวแฟน รับงานเอง ไม่มีการโอนมัดจำล่วงหน้า ปลอดภัย 100% นัดเจอเช็คความตรงปกแล้วจ่ายหน้างาน (${CURRENT_DATE})`;

        document.title = GLOBAL_TITLE;
        updateMeta('description', GLOBAL_DESC);
        updateMeta('keywords', 'ไซด์ไลน์เชียงใหม่, ราคาไซด์ไลน์, รับงานฟิวแฟน, ไซด์ไลน์ไม่มัดจำ, ตรงปก');
        updateLink('canonical', CONFIG.SITE_URL);
        
        updateOpenGraphMeta(null, GLOBAL_TITLE, GLOBAL_DESC, 'website');
        
        // Schemas ชุดใหญ่สำหรับหน้าแรก
        injectSchema(generateWebsiteSchema(), 'schema-jsonld-web');
        injectSchema(generateOrganizationSchema(), 'schema-jsonld-org');
        
        const FAQ_DATA = [
            { question: "ต้องโอนมัดจำก่อนไหม? มีความเสี่ยงโดนโกงหรือเปล่า?", answer: "สบายใจได้เลยค่ะ ที่นี่มีกฎเหล็ก 'ไม่รับโอนมัดจำทุกกรณี' (No Deposit) พี่ๆ สามารถเดินทางไปเจอตัวน้อง เช็คความตรงปกที่หน้างาน แล้วค่อยชำระเงินสดกับน้องโดยตรงค่ะ ปลอดภัย 100% ไม่เสี่ยงโดนโกงแน่นอนค่ะ" },
            { question: "การันตีความตรงปกไหม? ถ้าไม่เหมือนในรูปทำอย่างไร?", answer: "ทางเราคัดกรองน้องๆ จากรูปตัวจริงปัจจุบันเท่านั้นค่ะ การันตีความสวยตรงปกแน่นอน หากพี่ๆ ไปถึงหน้างานแล้วพบว่า 'ตัวจริงไม่เหมือนรูป' สามารถปฏิเสธงานได้ทันทีโดยไม่มีค่าปรับใดๆ ค่ะ" },
            { question: "ขั้นตอนการจองและติดต่อ ยากไหม?", answer: "ง่ายและเป็นส่วนตัวมากค่ะ 1. เลือกน้องที่ถูกใจ 2. กดแอดไลน์เพื่อคุยกับน้องโดยตรง 3. เดินทางไปตามพิกัด 4. จ่ายเงินหน้างาน จบ ครบ ง่าย ไม่ต้องสมัครสมาชิกค่ะ" }
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
                    <h1 style="font-size: 32px; font-weight: 900; color: #ffffff; margin-bottom: 20px; letter-spacing: -1px;">Sideline Chiangmai</h1>
                    
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 68px; border-radius: 9999px; background-color: rgba(236, 72, 153, 0.1); margin-bottom: 20px; border: 1px solid rgba(236, 72, 153, 0.4); box-shadow: 0 0 25px rgba(236, 72, 153, 0.2);">
                        <span style="font-size: 22px; font-weight: 900; color: #ec4899;">20+</span>
                    </div>
                    
                    <h2 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">พื้นที่ส่วนบุคคล (VIP ONLY)</h2>
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
        // Animation ตอนจบ: หดตัวและจางหาย (Expo style)
        gsap.to(loader, {
            opacity: 0,
            scale: 1.05,
            duration: 0.6,
            ease: "expo.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                gsap.set(loader, { scale: 1 }); // reset scale สำหรับรอบหน้า
                // อัปเดต ScrollTrigger ของ GSAP เพื่อให้การเลื่อนหน้าเว็บไม่สะดุด
                if (window.ScrollTrigger) ScrollTrigger.refresh();
            }
        });
    }
    // ซ่อนตัว Placeholder เก่า (ถ้ามี)
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