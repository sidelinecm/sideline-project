
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs';

import { 
    state, CONFIG, supabase, initializeSupabase, getCleanName, formatDate, 
    saveRecentSearch, saveCache, getOptimizedClientImage, processProfileData, 
    fetchSingleProfile, fetchDataDelta, initRealtimeSubscription 
} from './data.js';

import { 
    dom, cacheDOMElements, showErrorState, createGlobalLoader, showLoadingState, 
    hideLoadingState, createProfileCard, openLightbox, closeLightbox, populateLightboxData, 
    initLightboxEvents, renderCardsIncrementally, yieldToMain, createSearchResultSection, 
    createProvinceSection, renderByProvince, renderProfiles, populateProvinceDropdown, 
    initHeaderScrollEffect, initMarqueeEffect, initThemeToggle, initMobileMenu, 
    updateActiveNavLinks, initFooterLinks, updateResultCount 
} from './ui.js';

gsap.registerPlugin(ScrollTrigger);

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

const SEO_POOL = {
    styles: ["ฟิวแฟนแท้ๆ", "งานละเมียด", "สายหวานดูแลดี", "คุยสนุกเป็นกันเอง", "งานเนี๊ยบตรงปก"],
    trust: ["ไม่มีมัดจำ", "นัดเจอจ่ายหน้างาน", "ไม่ต้องโอนก่อน", "จ่ายเงินตอนเจอตัว"],
    guarantees: ["ตัวจริงตรงรูป 100%", "รูปปัจจุบันแน่นอน", "ไม่จกตา", "การันตีความสวย"],
    pick: function (group) {
        return this[group][Math.floor(Math.random() * this[group].length)];
    }
};

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

async function handleDataLoading() {
    if (state.isFetching) return;

    // 🟢 1. หากพบข้อมูล SSR ส่งตรงมาจากเซิร์ฟเวอร์ ให้เปิดสัญญานป้องกันการเรนเดอร์ซ้ำทันทีตั้งแต่เริ่มต้น
    if (window.profilesData && window.profilesData.length > 0) {
        state.isHydrating = true; 
        console.log("⚡ [Hydration] โหลดสเปกรายชื่อโปรไฟล์สำเร็จจาก SSR!");
        
        try {
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
            
            if (state.provincesMap.size === 0) {
                try {
                    const { data } = await supabase.from('provinces').select('*');
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
            initRealtimeSubscription();
            
        } catch (hydrationError) {
            console.error("❌ Hydration process crashed, falling back to network fetch:", hydrationError);
            
            // 🟢 2. กรณีเกิดความผิดพลาดระหว่าง Hydration ให้ปิดสัญญานกลับเป็นปกติเพื่ออนุญาตให้ Client เรนเดอร์ใหม่ได้
            state.isHydrating = false; 
            window.profilesData = null;
            await fetchDataDelta().catch(console.error);
        } finally {
            hideLoadingState();
        }
        return; 
    }

    // 🟢 3. กรณีโหลดแบบ Fallback ปกติ (ไม่ได้ใช้ข้อมูล SSR) มั่นใจได้ว่า isHydrating จะเป็น false 
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
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
            }
        }
        showErrorState("ไม่สามารถโหลดข้อมูลได้หลังจากลองใหม่หลายครั้ง");
    } finally {
        hideLoadingState(); 
    }
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
                    initRealtimeSubscription();
                    
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
        
        // 🟢 ตรวจสอบและเลือกข้ามการ Render ฝั่ง Client ในรอบแรกเพื่อรักษาโครงสร้าง SSR HTML (แก้ปัญหา Hydration Overwrite)
        const hasSsrHtml = window.profilesData && window.profilesData.length > 0;
        const isInitialLoadNoSearch = isFirstLoad && !isSearchMode;

        if (hasSsrHtml && isInitialLoadNoSearch) {
            console.log("⚡ [Hydration] Preserving server-rendered HTML. Skipping client-side rebuild.");
        } else {
            renderProfiles(filtered, isSearchMode);
        }

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

    const storageKey = (CONFIG && CONFIG.KEYS && CONFIG.KEYS.LIKED_PROFILES) 
        ? CONFIG.KEYS.LIKED_PROFILES 
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

    if (supabase) {
        try {
            const rpcName = isLiked ? 'increment_likes' : 'decrement_likes';
            const { error } = await supabase.rpc(rpcName, { 
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

// อัปเดตวันที่เวอร์ชันไทย
const now = new Date();
const thaiDate = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
const timeEl = document.getElementById('last-updated-time');
if (timeEl) timeEl.innerText = thaiDate;

// ลงทะเบียน Service Worker เมื่อโหลดหน้าเว็บเสร็จสมบูรณ์
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