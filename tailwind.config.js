// tailwind.config.js (ULTIMATE & CORRECT VERSION)

/** @type {import('tailwindcss').Config} */
module.exports = {
  // เปิดใช้งาน Dark Mode โดยใช้ class 'dark' บน <html> tag
  darkMode: 'class',

  // ระบุ Path ของไฟล์ทั้งหมดที่ใช้ Tailwind classes เพื่อให้สแกนได้ครบถ้วน
  content: [
    "./scr/**/*.html",
    "./scr/**/*.js",
  ],

  theme: {
    extend: {
      // กำหนดฟอนต์หลักของโปรเจกต์
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      },

      // กำหนดสี Custom ทั้งหมดจาก CSS Variables
      // Tailwind จะสร้างคลาส เช่น bg-background, text-primary, border-border
      // และจะสลับค่าสีให้อัตโนมัติเมื่ออยู่ใน Dark Mode
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          glow: 'hsl(var(--primary-glow))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          glow: 'hsl(var(--secondary-glow))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 4px)`,
        sm: 'calc(var(--radius) - 8px)',
      },
      keyframes: {
        'aurora-1': { '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' }, '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' } },
        'aurora-2': { '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' }, '100%': { transform: 'translate(-50%, -50%) rotate(-360deg)' } },
        'spin': { 'to': { transform: 'rotate(360deg)' } },
      },
      animation: {
        'aurora-1': 'aurora-1 30s linear infinite',
        'aurora-2': 'aurora-2 40s linear infinite reverse',
        'spin': 'spin 1s linear infinite',
      }
    },
  },

  // เพิ่ม Plugins ที่ต้องการใช้งาน
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'), // แนะนำให้เพิ่ม plugin นี้เพื่อสไตล์ฟอร์มที่สวยงามขึ้น
  ],
}