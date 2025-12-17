(function() {
    'use strict';

    const CONFIG = {
        AGE_KEY: 'ageConfirmedTimestamp',
        AGE_TTL: 3600000, 
        BOT_PATTERN: /googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|discordbot|linkedinbot/i
    };

    // 1. ตรวจสอบ Age Gate: ถ้าเป็น Bot ให้ข้ามเลย
    function handleAgeVerification() {
        const isBot = CONFIG.BOT_PATTERN.test(navigator.userAgent);
        if (isBot) return; 

        const confirmedAt = localStorage.getItem(CONFIG.AGE_KEY);
        const overlay = document.getElementById('age-verification-overlay');
        
        if (!confirmedAt || (Date.now() - parseInt(confirmedAt) > CONFIG.AGE_TTL)) {
            if (overlay) {
                overlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
    }

    // 2. จัดการ Event ปุ่มยืนยันอายุ
    function setupAgeGateListeners() {
        const confirmBtn = document.getElementById('age-confirm');
        const rejectBtn = document.getElementById('age-reject');
        const overlay = document.getElementById('age-verification-overlay');

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                localStorage.setItem(CONFIG.AGE_KEY, Date.now().toString());
                if (overlay) overlay.style.display = 'none';
                document.body.style.overflow = '';
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                window.location.href = 'https://www.google.com';
            });
        }
    }

    // 3. ฟังก์ชันอัปเดต SEO Meta (กรณีเปลี่ยนหน้าแบบ SPA)
    window.updatePageMeta = function(title, desc) {
        if (title) document.title = title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && desc) metaDesc.setAttribute('content', desc);
        
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', window.location.href);
    };

    // เริ่มการทำงาน
    function init() {
        handleAgeVerification();
        setupAgeGateListeners();
        
        // Loader Fade-out
        const loader = document.getElementById('global-loader');
        if (loader) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 500);
                }, 200);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();