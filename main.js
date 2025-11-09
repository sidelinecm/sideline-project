import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";

gsap.registerPlugin(ScrollTrigger);

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
    const STORAGE_BUCKET = 'profile-images'; // ตรวจสอบให้แน่ใจว่านี่คือชื่อ Bucket ของคุณ
    const PROFILES_PER_PAGE = 12;
    const PROFILES_PER_PROVINCE_ON_INDEX = 8;
    const SKELETON_CARD_COUNT = 8;
    const LAST_PROVINCE_KEY = 'sidelinecm_last_province'; // Key for localStorage

    // --- STATE & CACHE ---
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    let allProfiles = [];
    let provincesMap = new Map();
    let lastFocusedElement;
    let isInitialDataLoaded = false; // Flag to track if initial data is loaded

    // --- DOM ELEMENT CACHE ---
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
        searchSuggestions: null // Will be created and assigned in ensureSuggestionContainer
    };

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', main);

async function main() {
    try {
        // ฟังก์ชันหลักทั้งหมดของเว็บ
        initThemeToggle();
        initMobileMenu();
        initAgeVerification();
        initHeaderScrollEffect();
        updateActiveNavLinks();
        generateFullSchema(); // Assuming this function is defined elsewhere and needed

        // ❌ ปิดระบบหมุน 3D ของการ์ดโปรไฟล์ (ป้องกันภาพหมุน)
        // init3dCardHover(); // Assuming this function is defined elsewhere

        const currentPage = dom.body.dataset.page;

        if (currentPage === 'home' || currentPage === 'profiles') {
            showLoadingState();
            const success = await fetchData();
            hideLoadingState();

            if (success) {
                isInitialDataLoaded = true; // Set flag after data is successfully loaded
                initSearchAndFilters();
                initLightbox(); // Assuming this function is defined elsewhere

                if (dom.retryFetchBtn) {
                    dom.retryFetchBtn.addEventListener('click', async () => {
                        showLoadingState();
                        const retrySuccess = await fetchData();
                        hideLoadingState();

                        if (retrySuccess) {
                            applyFilters(false); // Reload data but don't refresh URL
                            if (dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'none';
                        } else {
                            showErrorState();
                        }
                    });
                }
            } else {
                showErrorState();
            }

            // ✅ Animation เฉพาะหน้า Home / Profiles
            gsap.from("#hero-h1, .text-gray-300, #search-form", {
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out"
            });

        } else {
            // หน้าภายในอื่น ๆ ใช้ระบบ scroll animation ตามปกติ
            initScrollAnimations(); // Assuming this function is defined elsewhere
        }

        // อัปเดตปีปัจจุบันอัตโนมัติ
        const yearSpan = document.getElementById('currentYearDynamic');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        // เมื่อทุกอย่างพร้อมแล้ว ค่อยโชว์เว็บ
        dom.body.classList.add('loaded');

    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// --- UI STATE FUNCTIONS ---
function showLoadingState() {
    if (dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'none';
    if (dom.noResultsMessage) dom.noResultsMessage.classList.add('hidden');
    if (dom.profilesDisplayArea) dom.profilesDisplayArea.innerHTML = '';
    if (dom.loadingPlaceholder) {
        const grid = dom.loadingPlaceholder.querySelector('.grid');
        if (grid) {
            grid.innerHTML = Array(SKELETON_CARD_COUNT)
                .fill('<div class="skeleton-card"></div>')
                .join('');
        }
        dom.loadingPlaceholder.style.display = 'block';
    }
}

function hideLoadingState() {
    if (dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
}

function showErrorState() {
    if (dom.loadingPlaceholder) dom.loadingPlaceholder.style.display = 'none';
    if (dom.fetchErrorMessage) dom.fetchErrorMessage.style.display = 'block';
}

// --- DATA FETCHING ---
async function fetchData() {
    try {
        // 1. Fetch Data from Supabase
        const [profilesRes, provincesRes] = await Promise.all([
            supabase
                .from('profiles')
                .select('*')
                .order('isfeatured', { ascending: false }) // Featured profiles first
                .order('lastUpdated', { ascending: false }), // Then by last updated
            supabase
                .from('provinces')
                .select('*')
                .order('nameThai', { ascending: true }) // Alphabetical order for provinces
        ]);

        // 2. Check for errors from Supabase
        if (!profilesRes || profilesRes.error) throw profilesRes?.error || new Error('Unknown error fetching profiles');
        if (!provincesRes || provincesRes.error) throw provincesRes?.error || new Error('Unknown error fetching provinces');

        // 3. Process Provinces Data into a Map
        provincesMap.clear(); // Clear previous map data
        if (Array.isArray(provincesRes.data)) {
            provincesRes.data.forEach(p => {
                // ⚠️ Assumption: 'key' in 'provinces' table corresponds to 'provinceKey' in 'profiles' table.
                // If 'id' is used as the key in 'provinces', change p.key to p.id.
                if (p?.key && p?.nameThai) {
                    provincesMap.set(p.key, p.nameThai);
                }
            });
        }

        // 4. Process Profiles Data (Mapping with Cache Busting)
        if (Array.isArray(profilesRes.data)) {
            allProfiles = profilesRes.data.map(p => {
                const imagePaths = [p.imagePath, ...(Array.isArray(p.galleryPaths) ? p.galleryPaths : [])]
                    .filter(Boolean); // Filter out any null/undefined paths

                // --- 🚀 Enhancement: Cache Busting and Smart URL Generation ---
                const imageObjects = imagePaths.map(path => {
                    const publicUrlData = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
                    let originalUrl = publicUrlData?.data?.publicUrl || '/images/placeholder-profile-card.webp'; // Fallback image

                    let urlSeparator = '?';

                    // ⬇️ 🎯 Core Fix: Cache Busting using 'lastUpdated'
                    // This assumes p.lastUpdated is a valid date string or object.
                    if (p.lastUpdated) {
                        try {
                            const timestampInSeconds = Math.floor(new Date(p.lastUpdated).getTime() / 1000);
                            originalUrl = `${originalUrl}${urlSeparator}v=${timestampInSeconds}`;
                            urlSeparator = '&'; // Switch to '&' after the first parameter
                        } catch (e) {
                            console.warn(`⚠️ Could not parse lastUpdated for image caching: ${p.lastUpdated}`, e);
                        }
                    }
                    // --------------------------------------------------------

                    // Generate srcset for responsive images, using '&' for subsequent parameters
                    const srcset = [300, 600, 900]
                        .map(width => `${originalUrl}${urlSeparator}width=${width}&quality=80 ${width}w`)
                        .join(', ');

                    // Primary src URL
                    return {
                        src: `${originalUrl}${urlSeparator}width=600&quality=80`,
                        srcset: srcset,
                    };
                });
                // --- End of Image Enhancement ---

                // Provide a default image if no paths were found
                if (imageObjects.length === 0) {
                    imageObjects.push({ src: '/images/placeholder-profile-card.webp', srcset: '' });
                }

                const provinceName = provincesMap.get(p.provinceKey) || ''; // Get province name from map
                const altText = p.altText || `โปรไฟล์ไซด์ไลน์ ${p.name} จังหวัด ${provinceName}`; // Default alt text

                return { ...p, images: imageObjects, altText }; // Add processed images and altText to profile object
            });
        } else {
            console.warn('⚠️ profilesRes.data is not an array:', profilesRes.data);
            allProfiles = []; // Ensure allProfiles is an array even if data fetch fails
        }

        // 5. Populate Province Dropdown
        // 💡 Enhancement: Check if dropdown needs population and if data is available.
        // Use the same key (prov.key) as used in provincesMap.
        if (dom.provinceSelect && dom.provinceSelect.options.length <= 1 && Array.isArray(provincesRes.data)) {
            provincesRes.data.forEach(prov => {
                if (prov?.key && prov?.nameThai) {
                    const option = document.createElement('option');
                    // 🚨 Fix: Use the correct key (prov.key) that matches provincesMap and p.provinceKey
                    option.value = prov.key;
                    option.textContent = prov.nameThai;
                    dom.provinceSelect.appendChild(option);
                }
            });
        }

        return true; // Indicate successful data fetch and processing
    } catch (error) {
        console.error('🔥 CRITICAL: Error fetching or processing data:', error);
        allProfiles = []; // Fallback to ensure allProfiles is an array
        provincesMap.clear();
        return false; // Indicate failure
    }
}

// --- SEARCH & FILTERS ---
function initSearchAndFilters() {
    if (!dom.searchForm) { // If search form isn't present, just apply default filters
        applyFilters(false);
        return;
    }

    // Load current filter state from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    dom.searchInput.value = urlParams.get('q') || '';
    dom.provinceSelect.value = urlParams.get('province') || '';
    dom.availabilitySelect.value = urlParams.get('availability') || '';
    dom.featuredSelect.value = urlParams.get('featured') || '';

    // Load last selected province from localStorage if URL province is empty
    if (!dom.provinceSelect.value) {
        const lastProvince = localStorage.getItem(LAST_PROVINCE_KEY);
        // Check if the last province is still a valid option in the dropdown
        if (lastProvince && provincesMap.has(lastProvince)) {
            dom.provinceSelect.value = lastProvince;
        }
    }

    // Debounce function to limit filter application rate
    const debouncedFilter = (() => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => applyFilters(true), 350); // Apply filters after 350ms of inactivity
        };
    })();

    // Event listeners for form submission and filter changes
    dom.searchForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(true); });
    if (dom.resetSearchBtn) {
        dom.resetSearchBtn.addEventListener('click', () => {
            resetFilters();
            applyFilters(true); // Apply filters after reset
        });
    }

    // Input listener for search keyword (triggers suggestions and debounced filter)
    if (dom.searchInput) dom.searchInput.addEventListener('input', () => {
        updateSuggestions(); // Update search suggestions
        debouncedFilter(); // Apply filters
    });
    // Change listeners for dropdowns (triggers debounced filter)
    if (dom.provinceSelect) dom.provinceSelect.addEventListener('change', debouncedFilter);
    if (dom.availabilitySelect) dom.availabilitySelect.addEventListener('change', debouncedFilter);
    if (dom.featuredSelect) dom.featuredSelect.addEventListener('change', debouncedFilter);

    ensureSuggestionContainer(); // Make sure the suggestion dropdown element exists

    // Apply initial filters based on URL and localStorage state
    applyFilters(false); // 'false' means don't update URL on initial load
}

// Resets all filter inputs and clears localStorage for last province
function resetFilters() {
    dom.searchInput.value = '';
    dom.provinceSelect.value = ''; // Reset to default empty value
    dom.availabilitySelect.value = '';
    dom.featuredSelect.value = '';
    localStorage.removeItem(LAST_PROVINCE_KEY);
    if (dom.searchSuggestions) dom.searchSuggestions.style.display = 'none'; // Hide suggestions
    console.log("All filters have been reset.");
}

// Normalizes values for case-insensitive and array-based comparisons
function normalize(v) {
    if (v === undefined || v === null) return '';
    if (Array.isArray(v)) return v.join(' ').toString().toLowerCase();
    return String(v).toLowerCase();
}

// Parses a search term into tokens and key-value clauses
function parseSearchQuery(term) {
    const parts = term.split(/\s+/).filter(Boolean); // Split by whitespace and remove empty parts
    const kv = []; // Key-value clauses (e.g., 'province:chiangmai')
    const tokens = []; // General text tokens

    for (const p of parts) {
        const m = p.match(/^([a-zA-Z_]+):(.+)$/); // Regex to find key:value patterns
        if (m) {
            const key = m[1].toLowerCase();
            let val = m[2];
            // Check for specific value types: range, less than, greater than, boolean, list
            const rangeMatch = val.match(/^(\d+)-(\d+)$/);
            const ltMatch = val.match(/^<(\d+)$/);
            const gtMatch = val.match(/^>(\d+)$/);

            if (rangeMatch) {
                kv.push({ key, type: 'range', min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) });
            } else if (ltMatch) {
                kv.push({ key, type: 'lt', value: Number(ltMatch[1]) });
            } else if (gtMatch) {
                kv.push({ key, type: 'gt', value: Number(gtMatch[1]) });
            } else if (val === 'true' || val === 'false') {
                kv.push({ key, type: 'bool', value: val === 'true' });
            } else {
                // Handle comma-separated lists (e.g., tag:A,B,C)
                const list = val.split(',').map(x=>x.trim()).filter(Boolean);
                kv.push({ key, type: 'list', value: list });
            }
        } else {
            tokens.push(p.toLowerCase()); // Add as a general text token
        }
    }
    return { tokens, kv };
}

// Checks if a profile matches the parsed search query
function matchesProfile(profile, parsed) {
    // Check Key-Value clauses first
    for (const clause of parsed.kv) {
        const k = clause.key;
        let profileValue;

        // Map query keys to actual profile properties
        if (k === 'province' || k === 'provincekey') {
            profileValue = normalize(profile.provinceKey);
        } else if (k === 'age') {
            profileValue = Number(profile.age) || 0;
        } else if (k === 'featured' || k === 'isfeatured') {
            profileValue = Boolean(profile.isfeatured);
        } else if (k === 'tag' || k === 'style' || k === 'styletag' || k === 'tags') {
            profileValue = (profile.styleTags || []).map(t => normalize(t)); // Normalize tags for comparison
        } else if (k === 'rate' || k === 'price') {
            profileValue = Number(profile.rate) || 0;
        } else if (k === 'availability') {
            profileValue = normalize(profile.availability);
        } else {
            // Generic lookup for other keys (case-insensitive)
            profileValue = normalize(profile[k] ?? profile[k.toLowerCase()] ?? '');
        }

        // Apply matching logic based on clause type
        if (clause.type === 'range') {
            // Assumes numeric ranges for age, rate, price
            if (k === 'age' || k === 'rate' || k === 'price') {
                if (profileValue < clause.min || profileValue > clause.max) return false;
            } else { // For potential string ranges (less common)
                if (!String(profileValue).substring(clause.min, clause.max + 1)) return false;
            }
        } else if (clause.type === 'lt') { // Less than
            if (profileValue >= clause.value) return false;
        } else if (clause.type === 'gt') { // Greater than
            if (profileValue <= clause.value) return false;
        } else if (clause.type === 'bool') { // Boolean match (true/false)
            if (profileValue !== clause.value) return false;
        } else if (clause.type === 'list') { // Match any value in the list
            if (k === 'tag' || k === 'style' || k === 'styletag' || k === 'tags') {
                // For tags, check if any of the profile's tags include any of the clause's values
                if (!clause.value.some(v => profileValue.some(pv => pv.includes(v)))) return false;
            } else {
                // For other list types, check for an exact match in the list
                if (!clause.value.some(v => normalize(v) === profileValue)) return false;
            }
        } else { // Single value exact match
            if (profileValue !== normalize(clause.value)) return false;
        }
    }

    // Check general text tokens (must match at least one token)
    for (const token of parsed.tokens) {
        const found =
            normalize(profile.name).includes(token) ||
            normalize(profile.description).includes(token) ||
            normalize(profile.location).includes(token) ||
            normalize(profile.quote).includes(token) ||
            normalize(profile.stats).includes(token) ||
            normalize(profile.skinTone).includes(token) ||
            normalize(profile.provinceKey).includes(token) ||
            normalize(profile.altText).includes(token) ||
            (profile.styleTags || []).some(t => normalize(t).includes(token)); // Check if any tag contains the token
        if (!found) return false; // If any token doesn't match, the profile fails
    }
    return true; // If all checks pass, the profile matches
}

    // --- SUGGESTIONS UI ---
    function ensureSuggestionContainer() {
        if (dom.searchSuggestions) return; // If already exists, do nothing
        const wrap = dom.searchInput?.parentElement || document.body; // Find parent or fallback to body
        const sug = document.createElement('div');
        sug.id = 'search-suggestions';
        sug.style.position = 'absolute';
        sug.style.zIndex = 9999;
        sug.className = 'search-suggestions';
        sug.setAttribute('role','listbox');
        sug.style.display = 'none'; // Initially hidden
        wrap.appendChild(sug);
        dom.searchSuggestions = sug; // Cache the created element

        // Add minimal styles for the suggestions dropdown
        const css = document.createElement('style');
        css.textContent = `
        .search-suggestions{background:var(--surface,white);box-shadow:0 6px 20px rgba(0,0,0,0.08);border-radius:8px;padding:6px 0;min-width:220px;max-height:300px;overflow-y:auto}
        .search-suggestions .item{padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border,rgba(0,0,0,0.05))}
        .search-suggestions .item:last-child{border-bottom:none}
        .search-suggestions .item:hover{background:var(--hover-bg,rgba(0,0,0,0.03))}
        .search-suggestions .item small{display:block;color:var(--muted,#666);font-size:12px}
        `;
        document.head.appendChild(css);
    }

    // Updates the search suggestions dropdown based on user input
    function updateSuggestions() {
        if (!dom.searchSuggestions || !dom.searchInput) return;
        const q = dom.searchInput.value.trim().toLowerCase();
        const items = [];

        // If query is empty, show general suggestions (top provinces, tags, featured toggle)
        if (!q) {
            const provinces = [...new Set(allProfiles.map(p=>p.provinceKey).filter(Boolean))].slice(0,8);
            const tags = [...new Set(allProfiles.flatMap(p=>p.styleTags || []))].slice(0,8);
            provinces.forEach(p=>items.push({type:'province', text:`province:${p}`, hint:`จังหวัด ${provincesMap.get(p) || p}`}));
            tags.forEach(t=>items.push({type:'tag', text:`tag:${t}`, hint:'tag'}));
            items.unshift({type:'toggle', text:'featured:true', hint:'เฉพาะโปรไฟล์แนะนำ'});
        } else {
            // If query exists, try to parse it and provide relevant suggestions
            const parsed = parseSearchQuery(q);
            const lastTypedPart = q.split(/\s+/).pop() || ''; // Get the last word typed

            // Suggest completing key:value pairs (e.g., 'province:')
            if (lastTypedPart.includes(':')) {
                const [keyPrefix] = lastTypedPart.split(':');
                if (keyPrefix === 'province' || keyPrefix === 'provincekey') {
                    // Suggest matching provinces
                    const provinces = [...new Set(allProfiles.map(p=>p.provinceKey).filter(Boolean))]
                                        .filter(x=>x.toLowerCase().startsWith(lastTypedPart.split(':')[1])).slice(0,6);
                    provinces.forEach(p=>items.push({type:'province', text:`province:${p}`, hint:`จังหวัด ${provincesMap.get(p) || p}`}));
                } else if (keyPrefix === 'tag' || keyPrefix === 'style') {
                    // Suggest matching tags
                    const tags = [...new Set(allProfiles.flatMap(p=>p.styleTags || []))]
                                        .filter(x=>x.toLowerCase().startsWith(lastTypedPart.split(':')[1])).slice(0,6);
                    tags.forEach(t=>items.push({type:'tag', text:`tag:${t}`, hint:'tag'}));
                }
            } else { // Suggesting next command or refining existing search
                // Suggest common command keys
                const possibleNextTokens = ['featured', 'province', 'age', 'rate', 'price', 'availability', 'tag'];
                possibleNextTokens.forEach(tk => {
                    if (tk.startsWith(lastTypedPart)) {
                        items.push({type:'template', text:`${tk}:`, hint:`${tk} ...`});
                    }
                });
                // Suggest based on existing tokens for further refinement
                const provinces = [...new Set(allProfiles.map(p=>p.provinceKey).filter(Boolean))]
                                    .filter(x=>x.toLowerCase().includes(lastTypedPart)).slice(0,6);
                provinces.forEach(p=>items.push({type:'province', text:`province:${p}`, hint:`จังหวัด ${provincesMap.get(p) || p}`}));

                const tags = [...new Set(allProfiles.flatMap(p=>p.styleTags || []))]
                                    .filter(x=>x.toLowerCase().includes(lastTypedPart)).slice(0,6);
                tags.forEach(t=>items.push({type:'tag', text:`tag:${t}`, hint:'tag'}));
            }
        }

        const container = dom.searchSuggestions;
        container.innerHTML = ''; // Clear previous suggestions
        if (!items.length) { container.style.display='none'; return; } // Hide if no suggestions

        // Render up to 22 suggestions
        items.slice(0,22).forEach(it=>{
            const el = document.createElement('div');
            el.className='item';
            el.tabIndex = 0;
            el.setAttribute('role','option');
            el.innerHTML = `<div>${it.text}</div>${it.hint ? `<small>${it.hint}</small>` : ''}`;
            el.addEventListener('click', ()=> {
                // Logic to append suggestion to input, handling existing text
                const currentValue = dom.searchInput.value;
                const lastWord = currentValue.split(/\s+/).pop();
                let newValue;
                // If the last word is a key:value pair that can be completed by the suggestion
                if (lastWord && lastWord.includes(':') && it.text.startsWith(lastWord.split(':')[0] + ':')) {
                    const prefix = currentValue.substring(0, currentValue.lastIndexOf(lastWord)); // Get text before the last word
                    newValue = prefix + it.text; // Replace the last word with the suggestion
                } else {
                    // Otherwise, append the suggestion as a new token
                    newValue = currentValue ? `${currentValue} ${it.text}` : it.text;
                }
                dom.searchInput.value = newValue;
                dom.searchInput.focus(); // Keep focus on the input
                container.style.display = 'none'; // Hide suggestions
                applyFilters(true); // Apply filters immediately after selection
            });
            el.addEventListener('keydown', (e)=> {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent form submission
                    el.click(); // Trigger the click event on the suggestion
                }
            });
            container.appendChild(el);
        });

        // Position suggestions dynamically under the input field
        const rect = dom.searchInput.getBoundingClientRect();
        container.style.left = rect.left + 'px';
        container.style.top = (rect.bottom + window.scrollY + 6) + 'px'; // Position below input + small gap
        container.style.minWidth = rect.width + 'px'; // Match input width
        container.style.display = 'block'; // Show suggestions
    }

    // Hide suggestions when clicking outside the dropdown or input field
    document.addEventListener('click', (e) => {
        if (!dom.searchSuggestions) return;
        // Check if the click was outside the suggestions container AND not on the search input itself
        if (!dom.searchSuggestions.contains(e.target) && e.target !== dom.searchInput) {
            dom.searchSuggestions.style.display = 'none';
        }
    });

// ==========================================================
// 🔍 APPLY FILTERS (SEO + UX Enhanced)
// ==========================================================
function applyFilters(updateUrl = true) {
    const searchTermRaw = dom.searchInput?.value?.trim() || '';
    const selectedProvince = dom.provinceSelect?.value || '';
    const selectedAvailability = dom.availabilitySelect?.value || '';
    const isFeaturedOnly = dom.featuredSelect?.value === 'true';

    // ✅ Save last selected province to localStorage for persistence
    if (selectedProvince) {
        localStorage.setItem(LAST_PROVINCE_KEY, selectedProvince);
    } else {
        localStorage.removeItem(LAST_PROVINCE_KEY); // Remove if selection is cleared
    }

    // ✅ Update URL for SEO and Shareability
    if (updateUrl) {
        let newUrl = window.location.origin;

        // Construct URL: Use province slug if available, otherwise default to base path
        const provinceSlug = selectedProvince ? `/${selectedProvince}` : '';
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1); // Get path up to the last slash

        // Determine the base path for home/profiles pages
        if (dom.body.dataset.page === 'home' || dom.body.dataset.page === 'profiles') {
            newUrl += provinceSlug || basePath; // Use province slug or default path (e.g., / or /profiles/)
        } else {
            newUrl += currentPath; // Keep current path for other pages (e.g., /about, /contact)
        }

        // Add other filters as query parameters if they are set
        const urlParams = new URLSearchParams();
        if (searchTermRaw) urlParams.set('q', searchTermRaw);
        if (selectedAvailability) urlParams.set('availability', selectedAvailability);
        if (isFeaturedOnly) urlParams.set('featured', 'true');

        const queryStr = urlParams.toString();
        if (queryStr) newUrl += `?${queryStr}`; // Append query string if it exists

        // Update the browser's history without reloading the page
        history.pushState({}, '', newUrl);
    }

    // ✅ Parse the raw search term for advanced filtering logic
    const parsed = parseSearchQuery(searchTermRaw);

    // ✅ Filter the 'allProfiles' array based on all selected criteria
    const filtered = allProfiles.filter(p => {
        try {
            // Province filter: Check if selected province matches profile's provinceKey
            if (selectedProvince && p.provinceKey !== selectedProvince) return false;
            // Availability filter: Check if selected availability matches profile's availability
            if (selectedAvailability && p.availability !== selectedAvailability) return false;
            // Featured only filter: Check if profile is featured if the option is selected
            if (isFeaturedOnly && !p.isfeatured) return false;

            // Advanced search query matching: If a search term exists, use the parser
            if (searchTermRaw) {
                return matchesProfile(p, parsed);
            }
            return true; // If no search term, include the profile by default
        } catch (err) {
            console.error('Search match error', err, p); // Log any errors during matching
            return false; // Exclude profile if an error occurs
        }
    });

    // ✅ Determine if a search is currently active for UI feedback
    const isSearching = !!(searchTermRaw || selectedProvince || selectedAvailability || isFeaturedOnly);

    // ✅ Render the filtered profiles to the display area
    renderProfiles(filtered, isSearching);
}

// ==========================================================
// 🔄 Rendering Profiles (SEO + UX Enhanced)
// ==========================================================
function renderProfiles(filteredProfiles, isSearching) {
    if (!dom.profilesDisplayArea) return; // Exit if display area is not found
    const currentPage = dom.body.dataset.page;
    dom.profilesDisplayArea.innerHTML = ''; // Clear previous content
    dom.noResultsMessage.classList.add('hidden'); // Hide no results message by default

    // --- FEATURED SECTION (Only for Home Page) ---
    if (dom.featuredSection && currentPage === 'home') {
        const featuredProfilesList = allProfiles.filter(p => p.isfeatured);
        // Show featured section only if not searching, there are featured profiles, and on home page
        if (!isSearching && featuredProfilesList.length > 0) {
            dom.featuredContainer.innerHTML = ''; // Clear previous featured items
            const topFeaturedProfiles = featuredProfilesList.slice(0, 22); // Limit displayed featured profiles
            dom.featuredContainer.append(...topFeaturedProfiles.map(createProfileCard)); // Append cards
            dom.featuredSection.classList.remove('hidden'); // Show the section
            dom.featuredSection.setAttribute('data-animate-on-scroll', ''); // Ensure animation attribute is present
        } else {
            dom.featuredSection.classList.add('hidden'); // Hide if not applicable
        }
    } else {
        // Hide featured section if not on home page or if searching
        if (dom.featuredSection) dom.featuredSection.classList.add('hidden');
    }

    // --- NO RESULTS MESSAGE ---
    if (filteredProfiles.length === 0) {
        // Show no results message only on home or profiles pages
        if (currentPage === 'home' || currentPage === 'profiles') {
            dom.noResultsMessage.classList.remove('hidden');
            // Update message text based on context (searching vs. no data)
            if (isSearching) {
                dom.noResultsMessage.textContent = "ไม่พบโปรไฟล์ที่ตรงกับคำค้นหาของคุณ";
            } else {
                dom.noResultsMessage.textContent = "ยังไม่มีโปรไฟล์ในขณะนี้";
            }
        }
        initScrollAnimations(); // Re-apply scroll animations even if no results
        return;
    }

    // --- RENDERING LOGIC BASED ON PAGE AND SEARCH STATE ---
    if (currentPage === 'profiles') {
        if (isSearching) {
            // If searching on profiles page, display as a simple grid
            const gridContainer = document.createElement('div');
            gridContainer.className =
                'profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4';
            gridContainer.append(...filteredProfiles.map(createProfileCard));
            dom.profilesDisplayArea.appendChild(gridContainer);
        } else {
            // If not searching on profiles page, render grouped by province
            renderProfilesByProvince(filteredProfiles, dom.profilesDisplayArea);
        }
        // Update Title and Meta for Profiles Page
        document.title = 'รวมโปรไฟล์สาวไซด์ไลน์ทั่วประเทศ'; // Basic title
        updateMetaDescription('รวมโปรไฟล์สาวไซด์ไลน์จากทุกจังหวัดทั่วประเทศไทย'); // Basic meta description
    }

    else if (currentPage === 'home') {
        if (isSearching) {
            // If searching on home page, display results in a dedicated section
            const searchResultWrapper = createSearchResultSection(filteredProfiles);
            dom.profilesDisplayArea.appendChild(searchResultWrapper);
        } else {
            // If not searching on home page, render grouped by province
            renderProfilesByProvince(filteredProfiles, dom.profilesDisplayArea);
        }
        // Update Title and Meta for Home Page
        document.title = 'ไซด์ไลน์ทั่วประเทศ - รวมสาวสวยทุกจังหวัด'; // More specific title for home
        updateMetaDescription('รวมสาวไซด์ไลน์จากทุกจังหวัด ทั้งว่างและไม่ว่าง พร้อมรายละเอียดและภาพสวยคมชัด'); // More descriptive meta for home
    }

    initScrollAnimations(); // Re-apply scroll animations after rendering new content
}

// ==========================================================
// 📦 Helper: Display profiles grouped by province
// ==========================================================
function renderProfilesByProvince(filteredProfiles, container) {
    // Group profiles by provinceKey
    const profilesByProvince = filteredProfiles.reduce((acc, profile) => {
        (acc[profile.provinceKey] = acc[profile.provinceKey] || []).push(profile);
        return acc;
    }, {});

    const urlParams = new URLSearchParams(window.location.search);
    const priorityLocation = urlParams.get('location'); // Get a priority location from URL if specified

    // Determine the order of provinces to display
    let dynamicProvinceOrder = [...new Set(filteredProfiles.map(p => p.provinceKey))];

    // Prioritize a specific province if specified in URL and exists in the current results
    if (priorityLocation && dynamicProvinceOrder.includes(priorityLocation)) {
        dynamicProvinceOrder = [
            priorityLocation, // Put priority location first
            ...dynamicProvinceOrder.filter(p => p !== priorityLocation) // Then add the rest
        ];
    }

    // Optional: Limit the number of provinces displayed for performance or UI reasons
    // dynamicProvinceOrder = dynamicProvinceOrder.slice(0, 15);

    // Iterate through the determined province order and create sections
    dynamicProvinceOrder.forEach(provinceKey => {
        if (!provinceKey) return; // Skip if provinceKey is null or undefined
        const provinceProfiles = profilesByProvince[provinceKey] || []; // Get profiles for this province
        const provinceName = provincesMap.get(provinceKey) || "ไม่ระบุ"; // Get province name, fallback if not found
        const provinceSectionEl = createProvinceSection(provinceKey, provinceName, provinceProfiles); // Create section element
        container.appendChild(provinceSectionEl); // Add section to the main container
    });
}


// ==========================================================
// 🧱 Profile Card (ไม่มี Schema) - เวอร์ชันสมบูรณ์
// ==========================================================
function createProfileCard(profile = {}) {
    const card = document.createElement('div');
    card.className = 'profile-card-new-container';

    const cardInner = document.createElement('div');
    cardInner.className = 'profile-card-new group cursor-pointer relative overflow-hidden rounded-2xl';
    cardInner.setAttribute('data-profile-id', profile.id || '');
    cardInner.setAttribute('aria-label', `ดูโปรไฟล์ของ ${profile.name || 'ไม่ระบุชื่อ'}`);
    cardInner.setAttribute('role', 'button');
    cardInner.setAttribute('tabindex', '0');

    // 🖼️ ภาพหลัก
    const mainImage = (profile.images && profile.images[0]) ? profile.images[0] : {
        src: '/images/placeholder-profile.webp',
        alt: profile.name || 'profile',
        width: 600,
        height: 800
    };
    const baseUrl = mainImage.src?.split('?')[0] || '/images/placeholder-profile.webp';

    const img = document.createElement('img');
    img.className = 'card-image w-full h-auto object-cover aspect-[3/4]';
    img.src = `${baseUrl}?width=400&quality=80`;
    img.srcset = `
        ${baseUrl}?width=150&quality=70 150w,
        ${baseUrl}?width=250&quality=75 250w,
        ${baseUrl}?width=600&quality=80 600w
    `;
    img.sizes = '(max-width: 640px) 150px, (max-width: 1024px) 250px, 600px';
    img.alt = mainImage.alt || `รูปโปรไฟล์ของ ${profile.name || 'ไม่ระบุชื่อ'}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = function () {
        this.src = '/images/placeholder-profile.webp';
        this.srcset = '';
    };
    cardInner.appendChild(img);

    // 🎖️ Badge
    const badges = document.createElement('div');
    badges.className = 'absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10';

    const availSpan = document.createElement('span');
    let statusClass = 'status-inquire';
    if (profile.availability?.includes('ว่าง') || profile.availability?.includes('รับงาน')) {
        statusClass = 'status-available';
    } else if (profile.availability?.includes('ไม่ว่าง') || profile.availability?.includes('พัก')) {
        statusClass = 'status-busy';
    }
    availSpan.className = `availability-badge ${statusClass}`;
    availSpan.textContent = profile.availability || 'สอบถามคิว';
    badges.appendChild(availSpan);

    if (profile.isfeatured) {
        const feat = document.createElement('span');
        feat.className = 'featured-badge';
        feat.innerHTML = `<i class="fas fa-star" style="font-size:0.7em;margin-right:4px;"></i> แนะนำ`;
        badges.appendChild(feat);
    }
    cardInner.appendChild(badges);

    // 🔤 Overlay ข้อมูล
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    const info = document.createElement('div');
    info.className = 'card-info';

    const h3 = document.createElement('h3');
    h3.className = 'text-lg sm:text-xl lg:text-2xl font-semibold text-white drop-shadow';
    h3.textContent = profile.name || 'ไม่ระบุชื่อ';

    const provinceName = provincesMap.get(profile.provinceKey) || 'ไม่ระบุ';
    const p = document.createElement('p');
    p.className = 'text-sm flex items-center gap-1.5 text-white/90';
    p.innerHTML = `<i class="fas fa-map-marker-alt opacity-80"></i> ${provinceName}`;

    info.appendChild(h3);
    info.appendChild(p);
    overlay.appendChild(info);
    cardInner.appendChild(overlay);

    // 🔹 คลิกเพื่อเปิด Lightbox
    cardInner.addEventListener('click', () => {
        populateLightbox(profile); // ฟังก์ชัน ULTIMATE
        gsap.to("#lightbox", { opacity: 1, duration: 0.3, pointerEvents: "auto" });
        gsap.to("#lightbox-content-wrapper-el", { scale: 1, duration: 0.3 });
    });

    // 🔹 รองรับการเปิด Lightbox ด้วยคีย์ Enter (accessibility)
    cardInner.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            cardInner.click();
        }
    });

    card.appendChild(cardInner);
    return card;
}

// ==========================================================
// 📍 Province Section (ไม่แตะ Title/Meta แล้ว)
// ==========================================================
function createProvinceSection(key, name, provinceProfiles) {
    const totalCount = provinceProfiles.length;
    const sectionWrapper = document.createElement('div');
    sectionWrapper.className = 'section-content-wrapper';
    sectionWrapper.setAttribute('data-animate-on-scroll', '');

    sectionWrapper.innerHTML = `
        <div class="p-6 md:p-8">
            <h2 class="province-section-header flex items-center gap-2.5 text-lg font-semibold">
                📍 จังหวัด ${name}
                <span class="profile-count-badge ml-2 inline-block bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded">
                    ${totalCount} โปรไฟล์
                </span>
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
                เลือกดูน้องๆ ที่พร้อมให้บริการในพื้นที่ ${name}
            </p>
        </div>
        <div class="profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 
                    sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4 
                    px-6 md:px-8 pb-6 md:pb-8"></div>
        <div class="view-more-container px-6 md:px-8 pb-6 md:pb-8 -mt-4 text-center" style="display:none;">
            <button 
                type="button"
                class="view-more-btn inline-flex items-center gap-2 rounded-full 
                bg-gradient-to-r from-pink-500 to-pink-700 px-6 py-2 
                text-sm font-semibold text-white shadow-lg hover:from-pink-600 
                hover:to-pink-800 focus:outline-none focus:ring-2 
                focus:ring-pink-500 focus:ring-offset-2 transition-transform"
                aria-label="ดูน้องๆ ในจังหวัด ${name} ทั้งหมด">
                ดูน้องๆ ใน ${name} ทั้งหมด →
            </button>
        </div>`;

    const grid = sectionWrapper.querySelector('.profile-grid');
    const profilesToDisplay = provinceProfiles.slice(0, 8);
    grid.append(...profilesToDisplay.map(createProfileCard));

    const viewMoreContainer = sectionWrapper.querySelector('.view-more-container');
    const viewMoreBtn = sectionWrapper.querySelector('.view-more-btn');

    if (viewMoreContainer && totalCount > 10) {
        viewMoreContainer.style.display = 'block';
        viewMoreBtn.addEventListener('click', () => {
            window.location.href = `/province/${key}`;
        });
    }

    return sectionWrapper;
}

// ==========================================================
// 🔍 Search Result Section
// ==========================================================
function createSearchResultSection(profiles = []) {
    const wrapper = document.createElement('div');
    wrapper.className = 'section-content-wrapper';
    wrapper.setAttribute('data-animate-on-scroll', '');
    const count = Array.isArray(profiles) ? profiles.length : 0;

    wrapper.innerHTML = `
      <div class="p-6 md:p-8">
        <h3 class="search-results-header">ผลการค้นหา</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          ${count > 0 ? `พบ <span class="search-count-highlight">${count}</span> โปรไฟล์ที่ตรงกับเงื่อนไข` : 'ไม่พบโปรไฟล์ที่ตรงกับเงื่อนไข'}
        </p>
      </div>
      <div class="profile-grid grid grid-cols-2 gap-x-3.5 gap-y-5 
                  sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4 
                  px-6 md:px-8 pb-6 md:pb-8"></div>
    `;

    const grid = wrapper.querySelector('.profile-grid');
    if (count > 0) {
        grid.append(...profiles.map(createProfileCard));
    }
    return wrapper;
}

// ==========================================================
// 🧠 Utilities
// ==========================================================
function updateMetaDescription(content) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = content;
}

    // --- OTHER INITIALIZERS & UTILITIES ---

    // ✅ [UX] Initialize 3D hover effect for profile cards
    function init3dCardHover() {
        document.body.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.profile-card-new');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -7; // Max rotation 7 degrees
                const rotateY = ((x - centerX) / centerX) * 7;  // Max rotation 7 degrees

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                card.style.setProperty('--rotate-x', `${rotateX}deg`);
                card.style.setProperty('--rotate-y', `${rotateY}deg`);
            });
        });
    }

    // ... (The rest of the initializers remain the same) ...
    function initThemeToggle() {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    if (themeToggleBtns.length === 0) return;
    const html = document.documentElement;
    const sunIcon = `<svg class="sun-icon text-lg" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg class="moon-icon text-lg" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const applyTheme = (theme) => {
        html.classList.toggle('dark', theme === 'dark');
        themeToggleBtns.forEach(btn => {
            btn.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
        });
    };
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });
}
    function initMobileMenu() {
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
            gsap.to(backdrop, {
                opacity: 0, duration: 0.3, onComplete: () => {
                    backdrop.classList.add('hidden');
                    sidebar.classList.add('translate-x-full');
                    sidebar.setAttribute('aria-hidden', 'true');
                    dom.body.style.overflow = '';
                }
            });
        };
        menuToggle.addEventListener('click', openMenu);
        closeSidebarBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu();
        });
    }

    // ✅ ตรวจสอบและแสดง Age Verification Overlay ทุกครั้ง (ยกเว้นบอท)
    function initAgeVerification() {
  const ageKey = "ageConfirmedTimestamp";
  const now = Date.now();
  const lastConfirmed = parseInt(localStorage.getItem(ageKey), 10);
  const oneHour = 60 * 60 * 1000;

  // ✅ ถ้ามี timestamp และยังไม่หมดอายุ (ภายใน 1 ชม.)
  if (!isNaN(lastConfirmed) && now - lastConfirmed < oneHour) {
    return; // ผ่านแล้ว ไม่ต้องแสดง modal อีก
  }

  // ❌ ถ้าไม่มีข้อมูลหรือหมดอายุ ให้สร้าง modal ใหม่
  createAgeModal();
}

function createAgeModal() {
  // ลบ modal เดิมถ้ามี
  document.getElementById("age-verification-overlay")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "age-verification-overlay";
  overlay.className =
    "fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity opacity-0";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "age-modal-title");

  overlay.innerHTML = `
    <div class="age-modal-content relative space-y-6 bg-gray-900 text-white rounded-2xl p-6 max-w-md w-full shadow-2xl scale-95 opacity-0 transition-all">
      <h2 id="age-modal-title" class="text-2xl font-bold uppercase leading-tight text-center">
        <span class="text-primary">Sideline Chiangmai</span> is an Adults Only
        <span class="age-badge-inline">20+</span> Website!
      </h2>
      <p class="text-sm text-gray-300 leading-relaxed text-center">
        คุณกำลังจะเข้าสู่เว็บไซต์ที่มีเนื้อหาสำหรับผู้ใหญ่ 
        คุณควรเข้าเว็บไซต์นี้ก็ต่อเมื่อคุณมีอายุอย่างน้อย 
        <span class="font-bold text-red-400">20 ปีบริบูรณ์</span>
      </p>
      <div class="flex justify-center gap-4 pt-2">
        <button id="cancelAgeButton" class="age-btn age-btn-cancel bg-red-600 text-white px-5 py-2 rounded-full shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400">
          ออก
        </button>
        <button id="confirmAgeButton" class="age-btn age-btn-confirm bg-green-600 text-white px-5 py-2 rounded-full shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">
          ยืนยัน
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const modal = overlay.querySelector(".age-modal-content");

  // ✅ แสดง modal ด้วย animation
  requestAnimationFrame(() => {
    overlay.classList.remove("opacity-0");
    modal.classList.remove("opacity-0", "scale-95");
  });

  // 🔒 จัดการ focus trap (เข้าถึงได้)
  const focusable = modal.querySelectorAll("button");
  let focusIndex = 0;
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      focusIndex = (focusIndex + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      focusable[focusIndex].focus();
    } else if (e.key === "Escape") {
      window.location.href = "https://www.google.com";
    }
  });

  focusable[0].focus();

  const confirmBtn = modal.querySelector("#confirmAgeButton");
  const cancelBtn = modal.querySelector("#cancelAgeButton");

  const closeModal = (confirmed = false) => {
    // ✅ ถ้ากดยืนยัน → บันทึกเวลาใหม่
    if (confirmed) {
      localStorage.setItem("ageConfirmedTimestamp", Date.now().toString());
    }

    modal.classList.add("scale-95", "opacity-0");
    overlay.classList.add("opacity-0");

    setTimeout(() => {
      overlay.remove();
    }, 300);
  };

  // ✅ กดยืนยัน → บันทึก + ปิด modal
  confirmBtn.addEventListener("click", () => closeModal(true));

  // ❌ กดยกเลิก → ออกจากเว็บ
  cancelBtn.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
}

// ✅ เรียกเมื่อ DOM โหลดเสร็จ
document.addEventListener("DOMContentLoaded", initAgeVerification);

       
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const wrapper = document.getElementById('lightbox-content-wrapper-el');
        const closeBtn = document.getElementById('closeLightboxBtn');
        if (!lightbox || !wrapper || !closeBtn) return;
        const openAction = (triggerElement) => {
            if (!triggerElement) return;
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
            gsap.to(wrapper, { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
            lastFocusedElement?.focus();
        };
        document.body.addEventListener('click', (event) => {
            const trigger = event.target.closest('.profile-card-new');
            if (trigger) {
                event.preventDefault();
                openAction(trigger);
            }
        });
        document.body.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && event.target.closest('.profile-card-new')) {
                event.preventDefault();
                openAction(event.target.closest('.profile-card-new'));
            } else if (event.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                closeAction();
            }
        });
        closeBtn.addEventListener('click', closeAction);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeAction(); });
    }
    
    // ✅ [ULTIMATE VERSION] - แทนที่ฟังก์ชัน populateLightbox เดิมด้วยอันนี้
    function populateLightbox(profileData) {
        // Cache DOM elements
        const getEl = (id) => document.getElementById(id);
        const nameMainEl = getEl('lightbox-profile-name-main');
        const heroImageEl = getEl('lightboxHeroImage');
        const thumbnailStripEl = getEl('lightboxThumbnailStrip');
        const quoteEl = getEl('lightboxQuote');
        const tagsEl = getEl('lightboxTags');
        const detailsEl = getEl('lightboxDetailsCompact');
        const descriptionEl = getEl('lightboxDescriptionVal');
        const lineLink = getEl('lightboxLineLink');
        const lineLinkText = getEl('lightboxLineLinkText');
        const availabilityWrapper = getEl('lightbox-availability-badge-wrapper');

        // --- Main Header ---
        nameMainEl.textContent = profileData.name || 'N/A';
        quoteEl.textContent = profileData.quote ? `"${profileData.quote}"` : '';
        quoteEl.style.display = profileData.quote ? 'block' : 'none';

        // --- Availability Badge (Upgraded) ---
        availabilityWrapper.innerHTML = ''; // Clear previous
        let availabilityText = profileData.availability || "สอบถามคิว";
        let availabilityStatus = 'inquire'; // default
        if (availabilityText.includes('ว่าง') || availabilityText.includes('รับงาน')) {
            availabilityStatus = 'available';
        } else if (availabilityText.includes('ไม่ว่าง') || availabilityText.includes('พัก')) {
            availabilityStatus = 'busy';
        }
        const availabilityBadge = document.createElement('div');
        availabilityBadge.className = `availability-badge-upgraded status-${availabilityStatus}`;
        availabilityBadge.textContent = availabilityText;
        availabilityWrapper.appendChild(availabilityBadge);
        
        // --- Gallery ---
        heroImageEl.src = profileData.images[0]?.src || '/images/placeholder-profile.webp';
        heroImageEl.srcset = profileData.images[0]?.srcset || '';
        heroImageEl.alt = profileData.altText;
        
        thumbnailStripEl.innerHTML = '';
        if (profileData.images.length > 1) {
            profileData.images.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img.src;
                thumb.srcset = img.srcset;
                thumb.alt = `รูปตัวอย่างที่ ${index + 1} ของ ${profileData.name}`;
                thumb.className = 'thumbnail';
                if (index === 0) thumb.classList.add('active');
                
                thumb.addEventListener('click', () => {
                    heroImageEl.src = img.src;
                    heroImageEl.srcset = img.srcset;
                    thumbnailStripEl.querySelector('.thumbnail.active')?.classList.remove('active');
                    thumb.classList.add('active');
                });
                thumbnailStripEl.appendChild(thumb);
            });
            thumbnailStripEl.style.display = 'grid';
        } else {
            thumbnailStripEl.style.display = 'none';
        }

        // --- Tags (Upgraded Class) ---
        tagsEl.innerHTML = '';
        if (profileData.styleTags?.length > 0) {
            profileData.styleTags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'tag-badge'; // Use new class from upgraded css
                tagEl.textContent = tag;
                tagsEl.appendChild(tagEl);
            });
            tagsEl.style.display = 'flex';
        } else {
            tagsEl.style.display = 'none';
        }

        // --- Details Section (Complete Redesign) ---
        const paletteIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 4a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 4zM10 18a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 0110 18zM5.932 7.033a.75.75 0 011.05-1.07l1.5 1.5a.75.75 0 01-1.05 1.07l-1.5-1.5zM12.95 14.05a.75.75 0 01-1.05 1.07l-1.5-1.5a.75.75 0 011.05-1.07l1.5 1.5zM4 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 014 10zM13.75 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM7.033 12.95a.75.75 0 011.07-1.05l1.5 1.5a.75.75 0 01-1.07 1.05l-1.5-1.5zM14.05 7.05a.75.75 0 01-1.07-1.05l1.5-1.5a.75.75 0 011.07 1.05l-1.5 1.5z"/></svg>`;
        const mapIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.623-.359 1.445-.835 2.13-1.36.712-.549 1.282-1.148 1.655-1.743.372-.596.59-1.28.59-2.002v-1.996a4.504 4.504 0 00-1.272-3.116A4.47 4.47 0 0013.5 4.513V4.5C13.5 3.12 12.38 2 11 2H9c-1.38 0-2.5 1.12-2.5 2.5v.013a4.47 4.47 0 00-1.728 1.388A4.504 4.504 0 003 9.504v1.996c0 .722.218 1.406.59 2.002.373.595.943 1.194 1.655 1.743.685.525 1.507 1.001 2.13 1.36.254.147.468.27.654.369a5.745 5.745 0 00.28.14l.019.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>`;
        const moneyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 10.837a1 1 0 00-1.5 0 1 1 0 000 1.413l.001.001 2.25 2.25a1 1 0 001.414 0l.001-.001 2.688-2.688a1 1 0 000-1.414 1 1 0 00-1.414 0l-1.937 1.937-1.5-1.5z" /><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1a.5.5 0 000 1h8a.5.5 0 000-1H5z" clip-rule="evenodd" /></svg>`;
        
        detailsEl.innerHTML = `
            <div class="details-grid-upgraded">
                <div class="detail-item-grid"><div class="label">อายุ</div><div class="value">${profileData.age || '-'} ปี</div></div>
                <div class="detail-item-grid"><div class="label">สัดส่วน</div><div class="value">${profileData.stats || '-'}</div></div>
                <div class="detail-item-grid"><div class="label">สูง/หนัก</div><div class="value">${profileData.height || '-'}/${profileData.weight || '-'}</div></div>
            </div>
            <div class="detail-list-upgraded">
                <div class="detail-item-list"><div class="detail-item-list-icon">${paletteIcon}</div><div class="value">ผิว: <strong>${profileData.skinTone || '-'}</strong></div></div>
                <div class="detail-item-list"><div class="detail-item-list-icon">${mapIcon}</div><div class="value">จังหวัด: <strong>${provincesMap.get(profileData.provinceKey) || ''}</strong> (${profileData.location || 'ไม่ระบุ'})</div></div>
                <div class="detail-item-list"><div class="detail-item-list-icon">${moneyIcon}</div><div class="value">เรท: <strong>${profileData.rate || 'สอบถาม'}</strong></div></div>
            </div>`;

        // --- Description ---
        descriptionEl.innerHTML = profileData.description ? profileData.description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม';

        // --- Line Button (Upgraded) ---
        lineLink.className = "btn-line-shared-upgraded"; 
        
        if (profileData.lineId) {
            lineLink.href = profileData.lineId.startsWith('http') ? profileData.lineId : `https://line.me/ti/p/${profileData.lineId}`;
            lineLink.style.display = 'inline-flex';
            lineLinkText.textContent = `ติดต่อ LINE: ${profileData.name}`;
        } else {
            lineLink.style.display = 'none';
        }
    }

    function initHeaderScrollEffect() {
        const header = document.getElementById('page-header');
        if (!header) return;
        const handleScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        handleScroll(); 
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate-on-scroll]');
        if (animatedElements.length === 0) return;
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => {
            if (!el.classList.contains('is-visible')) observer.observe(el);
        });
    }

    function updateActiveNavLinks() {
        const currentPath = window.location.pathname.endsWith('/') ? window.location.pathname.slice(0, -1) || '/' : window.location.pathname;
        const navLinks = document.querySelectorAll('#sidebar nav a, header nav a');
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname.endsWith('/') ? new URL(link.href).pathname.slice(0, -1) || '/' : new URL(link.href).pathname;
            const isActive = linkPath === currentPath;
            link.classList.toggle('active-nav-link', isActive);
        });
    }
    
    document.addEventListener("DOMContentLoaded", function() {
        const marquee = document.querySelector('.social-marquee');
        if (!marquee) return;   // ✅ ป้องกัน error ถ้าไม่เจอ element

        const wrapper = marquee.parentElement;
        if (!wrapper) return;   // ✅ กันเผื่อว่ามันไม่มี parent จริง ๆ

        // clone เนื้อหาเพื่อให้เลื่อนต่อเนื่อง
        const clone = marquee.innerHTML;
        marquee.innerHTML += clone;

        let speed = 0.5;
        let scroll = 0;
        let isDragging = false;
        let startX = 0;
        let scrollStart = 0;

        function animateMarquee() {
            if (!isDragging) {
                scroll += speed;
            }
            if (scroll >= marquee.scrollWidth / 2) scroll = 0;
            if (scroll < 0) scroll = marquee.scrollWidth / 2 - 1;
            marquee.style.transform = `translateX(-${scroll}px)`;
            requestAnimationFrame(animateMarquee);
        }

        animateMarquee();

        // Hover pause
        wrapper.addEventListener('mouseenter', () => { speed = 0; });
        wrapper.addEventListener('mouseleave', () => { if (!isDragging) speed = 0.5; });

        // Mouse drag
        wrapper.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.pageX;
            scrollStart = scroll;
            speed = 0;
            e.preventDefault();
        });
        wrapper.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const delta = e.pageX - startX;
            scroll = scrollStart - delta;
        });
        wrapper.addEventListener('mouseup', () => { isDragging = false; speed = 0.5; });
        wrapper.addEventListener('mouseleave', () => { isDragging = false; speed = 0.5; });

        // Touch drag
        wrapper.addEventListener('touchstart', e => {
            isDragging = true;
            startX = e.touches[0].pageX;
            scrollStart = scroll;
            speed = 0;
        });
        wrapper.addEventListener('touchmove', e => {
            if (!isDragging) return;
            const delta = e.touches[0].pageX - startX;
            scroll = scrollStart - delta;
        });
        wrapper.addEventListener('touchend', () => { isDragging = false; speed = 0.5; });
    });

function generateFullSchema() {
    const pageTitle = document.title;
    const canonicalUrl = document.querySelector("link[rel='canonical']")?.href || window.location.href;
    const siteUrl = "https://sidelinechiangmai.netlify.app/";
    const orgName = "Sideline Chiangmai - รับงาน ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก";

    const mainSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${siteUrl}#organization`,
                "name": orgName,
                "url": siteUrl,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${siteUrl}images/logo-sideline-chiangmai.webp`,
                    "width": 164,
                    "height": 40
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer support",
                    "url": "https://line.me/ti/p/_faNcjQ3xx"
                }
            },
            {
                "@type": "WebSite",
                "@id": `${siteUrl}#website`,
                "url": siteUrl,
                "name": orgName,
                "description": "รวมโปรไฟล์ไซด์ไลน์เชียงใหม่, ลำปาง, เชียงราย คุณภาพ บริการฟีลแฟน การันตีตรงปก 100% ปลอดภัย ไม่ต้องมัดจำ",
                "publisher": { "@id": `${siteUrl}#organization` },
                "inLanguage": "th-TH"
            },
            {
                "@type": "WebPage",
                "@id": `${canonicalUrl}#webpage`,
                "url": canonicalUrl,
                "name": pageTitle,
                "isPartOf": { "@id": `${siteUrl}#website` },
                "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": `${siteUrl}images/sideline-chiangmai-social-preview.webp`
                },
                "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` }
            },
            {
                "@type": "LocalBusiness",
                "@id": `${siteUrl}#localbusiness`,
                "name": "SidelineChiangmai - ไซด์ไลน์เชียงใหม่ ฟีลแฟน ตรงปก",
                "image": `${siteUrl}images/sideline-chiangmai-social-preview.webp`,
                "url": siteUrl,
                "priceRange": "฿฿",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "เจ็ดยอด",
                    "addressLocality": "ช้างเผือก",
                    "addressRegion": "เชียงใหม่",
                    "postalCode": "50300",
                    "addressCountry": "TH"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "18.814361",
                    "longitude": "98.972389"
                },
                "hasMap": "https://maps.app.goo.gl/3y8gyAtamm8YSagi9",
                "openingHours": ["Mo-Su 00:00-24:00"],
                "areaServed": [
                    { "@type": "City", "name": "Chiang Mai" },
                    { "@type": "City", "name": "Bangkok" },
                    { "@type": "City", "name": "Lampang" },
                    { "@type": "City", "name": "Chiang Rai" },
                    { "@type": "City", "name": "Pattaya" },
                    { "@type": "City", "name": "Phuket" }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${canonicalUrl}#breadcrumb`,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": siteUrl }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": `${siteUrl}#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้าทุกท่าน ข้อมูลการติดต่อและการจองของท่านจะถูกเก็บรักษาเป็นความลับอย่างเข้มงวด"
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการไซด์ไลน์หรือไม่?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "เพื่อความสบายใจของลูกค้าทุกท่าน ท่านไม่จำเป็นต้องโอนเงินมัดจำใดๆ ทั้งสิ้น สามารถชำระค่าบริการเต็มจำนวนโดยตรงกับน้องๆ ที่หน้างานได้เลย"
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "น้องๆ ไซด์ไลน์เชียงใหม่ตรงปกตามรูปที่แสดงในโปรไฟล์จริงหรือ?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพของน้องๆ ทุกคนอย่างละเอียด Sideline Chiang Mai กล้าการันตีว่าน้องๆ ตรงปก 100% หากพบปัญหาใดๆ สามารถแจ้งทีมงานเพื่อดำเนินการแก้ไขได้ทันที"
                        }
                    }
                ]
            }
        ]
    };

    // ลบ script เก่าแล้วสร้างใหม่
        const schemaContainer = document.createElement('script');
        schemaContainer.type = 'application/ld+json';
        schemaContainer.textContent = JSON.stringify(mainSchema);
        const oldSchema = document.querySelector('script[type="application/ld+json"]');
        if (oldSchema) oldSchema.remove();
        document.head.appendChild(schemaContainer);
    }

})(); 
