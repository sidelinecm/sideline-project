// tailwind.config.js (ULTIMATE ES MODULE VERSION)

import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [ "./scr/**/*.html", "./scr/**/*.js" ],
  theme: {
    extend: {
      // ... (เนื้อหา extend ทั้งหมดเหมือนเดิม) ...
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... (สีทั้งหมดเหมือนเดิม) ...
      },
    },
  },
  plugins: [
    typography,
    forms,
  ],
};

