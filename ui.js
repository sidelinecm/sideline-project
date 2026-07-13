
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import { state, CONFIG, supabase } from './data.js';

gsap.registerPlugin(ScrollTrigger);

export const dom = {};

export function cacheDOMElements() {
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

export function showErrorState(error) {
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

export function createProfileCard(p, index = 20) {
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

export function openLightbox(p) {
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

export function closeLightbox(animate = true) {
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

export function populateLightboxData(p) {
    if (!p) return;

    const cleanName = (p.displayName || p.name || 'ไม่ระบุชื่อ').trim();
    const isAvailable = !["ติดจอง", "ไม่ว่าง", "พัก", "หยุด"].some(kw => (p.availability || "").toLowerCase().includes(kw));
    const statusText = p.availability || 'สอบถาม';
    const dotColor = isAvailable ? '#00E676' : '#FF2E63';

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

    const quoteBox = document.getElementById('lightboxQuote');
    if (quoteBox) {
        quoteBox.textContent = p.quote || "ดูแลเทคแคร์น่ารัก อัธยาศัยดีสไตล์ฟิวแฟน ยินดีที่ได้รู้จักค่ะ";
    }

    const heroImg = document.getElementById('lightboxHeroImage');
    const mainImg = p?.images?.[0]?.src || p?.imagePath || '/images/placeholder-profile.webp';
    heroImg.src = mainImg;

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

    const tagsContainer = document.getElementById('lightboxTags');
    tagsContainer.innerHTML = '';
    const tags = Array.isArray(p.styleTags) ? p.styleTags : [];
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.style.cssText = "background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.2); color: #C084FC; font-size: 10px; padding: 4px 12px; border-radius: 100px; font-weight: 700;";
        span.textContent = tag.startsWith('#') ? tag : `#${tag}`;
        tagsContainer.appendChild(span);
    });

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

    const descContainer = document.getElementById('lightboxDescriptionContainer');
    const descContent = document.getElementById('lightboxDescriptionContent');
    if (p.description && p.description.trim() !== '') {
        descContent.innerHTML = p.description.replace(/\n/g, '<br>');
        descContainer.style.display = 'block';
    } else {
        descContent.textContent = `น้อง${cleanName} ยืนยันตัวตนตรงปก พร้อมให้บริการเพื่อนเที่ยวฟิวแฟนในพิกัดย่าน${p.location || 'เชียงใหม่'} ดูแลสุภาพ เรียบร้อย เป็นกันเอง สนใจสอบถามคิวงานได้เลยค่ะ`;
        descContainer.style.display = 'block';
    }

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

export function initLightboxEvents() {
    console.log("ℹ️ Lightbox events bound cleanly to global listener.");
}

export async function renderCardsIncrementally(container, profiles, renderId) {
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

export function yieldToMain() {
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    });
}

export function createSearchResultSection(profiles, renderId) {
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

export function createProvinceSection(key, name, profiles, renderId) {
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

export async function renderByProvince(profiles, renderId) {
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

export function renderProfiles(profiles, isSearching) {
    if (!dom.profilesDisplayArea) return;
    
    // 🟢 แก้ไขปัญหาที่ 1: ตรวจสอบสถานะ Hydration เพื่อข้ามการเรนเดอร์ทับ HTML ที่มาจากเซิร์ฟเวอร์ในการโหลดครั้งแรก
    if (state.isHydrating) {
        console.log("⚡ [Hydration] ข้ามการวาดการ์ดโปรไฟล์ใหม่บนเบราว์เซอร์ เพื่อรักษา SSR HTML ดั้งเดิม");
        state.isHydrating = false; // ปิดโหมด Hydration ทันทีหลังจากผ่านการโหลดหน้าแรก
        
        if (window.ScrollTrigger) {
            setTimeout(() => ScrollTrigger.refresh(), 500);
        }
        return;
    }
    
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

export function populateProvinceDropdown() {
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

export function initHeaderScrollEffect() {
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

export function initMarqueeEffect() {
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

export function initThemeToggle() {
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

export function initMobileMenu() {
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

export function updateActiveNavLinks() {
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

export function createGlobalLoader() {
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

export function showLoadingState() {
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

export function hideLoadingState() {
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

export async function initFooterLinks() {
    const footerContainer = document.getElementById('popular-locations-footer');
    if (!footerContainer) return;

    let provincesList = [];

    if (state.provincesMap && state.provincesMap.size > 0) {
        state.provincesMap.forEach((name, key) => {
            provincesList.push({ key: key, name: name });
        });
    } else if (supabase) {
        try {
            const { data } = await supabase.from('provinces').select('*');
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

export function updateResultCount(count, total, isFiltering) {
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