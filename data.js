// data.js - ส่วนเชื่อมต่อข้อมูลดิบและประสิทธิภาพหลังบ้าน (ฉบับแก้ไขเสร็จสมบูรณ์)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { populateProvinceDropdown, renderProfiles, showErrorState } from './ui.js';

export const CONFIG = {
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

// ค้นหาตำแหน่งนี้ใน data.js แล้วเพิ่มฟิลด์ลงไป
export let state = { 
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
    renderId: 0,
    isHydrating: false // 🟢 เติมตัวแปรนี้เพื่อเปิดกลไกควบคุมสถานะ Hydration ข้ามไฟล์
};

export let supabase;

export function initializeSupabase() {
    try {
        supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        window.supabase = supabase;
        console.log("✅ Supabase Connected");
    } catch (e) {
        console.error("❌ Supabase Init Failed:", e);
    }
}

export function getCleanName(rawName) {
    if (!rawName || typeof rawName !== 'string') return "";
    let name = rawName.trim().replace(/^(น้อง\s?)/, '');
    name = name.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return `น้อง${name}`;
}

export function formatDate(dateString) {
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

export function saveRecentSearch(term) {
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

export function saveCache(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            console.warn("⚠️ LocalStorage เต็ม! กำลังพยายามเคลียร์พื้นที่...");
            localStorage.removeItem(CONFIG.KEYS.CACHE_PROFILES); 
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

export function getOptimizedClientImage(path, width = 400) {
    if (!path) return CONFIG.DEFAULT_OG_IMAGE;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/c_scale,w_${width},q_auto,f_auto/`);
    }
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/${CONFIG.STORAGE_BUCKET}/${path}`;
}

export function processProfileData(p) {
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

export async function fetchSingleProfile(slug) {
    if (!supabase) return null;
    try {
        let { data, error } = await supabase
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

export async function fetchDataDelta() {
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
            // นำการสั่งวาดหน้าจอซ้ำซ้อนออก เพื่อให้แอปพลิเคชันหลักจัดการตามเส้นทาง URL (Router)
            
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
        // นำการสั่งวาดหน้าจอซ้ำซ้อนออก เพื่อส่งต่อหน้าที่ให้แอปพลิเคชันหลักคุมรอบการวาดหน้าจอที่แม่นยำ
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

export function initRealtimeSubscription() {
    if (!supabase) return;

    if (state.realtimeSubscription) {
        try {
            supabase.removeChannel(state.realtimeSubscription);
        } catch (e) { console.warn('Realtime cleanup error:', e); }
        state.realtimeSubscription = null;
    }

    console.log('📡 [Realtime] ระบบอัปเดตอัจฉริยะกำลังทำงาน...');

    let connectionRetries = 0;
    const maxRetries = 5; 

    const channel = supabase.channel('public:profiles_realtime_sync')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'profiles' },
            (payload) => {
                console.log('📡 [Realtime] ตรวจพบข้อมูลเปลี่ยนแปลงในฐานข้อมูล:', payload);
                const { eventType, new: newRecord, old: oldRecord } = payload;
                
                if (eventType === 'INSERT') {
                    if (newRecord && newRecord.active) {
                        const processed = processProfileData(newRecord);
                        if (processed) {
                            state.allProfiles.unshift(processed);
                        }
                    }
                } else if (eventType === 'UPDATE') {
                    if (newRecord) {
                        const idx = state.allProfiles.findIndex(p => p.id === newRecord.id);
                        if (newRecord.active) {
                            const processed = processProfileData(newRecord);
                            if (processed) {
                                if (idx !== -1) {
                                    state.allProfiles[idx] = processed;
                                } else {
                                    state.allProfiles.push(processed);
                                }
                            }
                        } else {
                            if (idx !== -1) {
                                state.allProfiles.splice(idx, 1);
                            }
                        }
                    }
                } else if (eventType === 'DELETE') {
                    if (oldRecord) {
                        const idx = state.allProfiles.findIndex(p => p.id === oldRecord.id);
                        if (idx !== -1) {
                            state.allProfiles.splice(idx, 1);
                        }
                    }
                }

                // สั่งอัปเดตแคชภายในเครื่องทันทีเพื่อให้ทำงานสอดคล้องกับคลาวด์
                try {
                    saveCache(CONFIG.KEYS.CACHE_PROFILES, state.allProfiles);
                } catch (e) {
                    console.warn("⚠️ ไม่สามารถเขียนอัปเดตเรียลไทม์ลงแคชภายในได้:", e);
                }

                // กระตุ้นระบบสเปกค้นหาและวาดหน้าจอใหม่สด ๆ บนแอปพลิเคชันหลัก
                if (typeof window.initSearchAndFilters === 'function') {
                    window.initSearchAndFilters();
                }
                if (typeof window.applyUltimateFilters === 'function') {
                    window.applyUltimateFilters(false);
                }
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
                        supabase.removeChannel(channel);
                    } catch (e) { console.error(e); }
                }
            }
        });

    state.realtimeSubscription = channel;
}