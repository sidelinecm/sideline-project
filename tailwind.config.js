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

      // กำหนดสี Custom ทั้งหมดจาก CSS Variables ใน styles.css
      // เพื่อให้ Tailwind สามารถสร้างเป็น Utility Classes (เช่น bg-background, text-primary, border-border-dark) ได้
      colors: {
        // --- Light & Dark Mode Palette ---
        border: 'hsl(var(--border))',
        'border-dark': 'hsl(var(--border-dark))',
        background: 'hsl(var(--background))',
        'background-dark': 'hsl(var(--background-dark))',
        foreground: 'hsl(var(--foreground))',
        'foreground-dark': 'hsl(var(--foreground-dark))',
        card: 'hsl(var(--card))',
        'card-dark': 'hsl(var(--card-dark))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        'muted-foreground-dark': 'hsl(var(--muted-foreground-dark))',
        accent: 'hsl(var(--accent))',
        'accent-dark': 'hsl(var(--accent-dark))',

        // --- Universal Accent Colors ---
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          glow: 'hsl(var(--primary-glow))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          glow: 'hsl(var(--secondary-glow))',
        },
      },
      
      // (Optional) กำหนดค่าอื่นๆ เพิ่มเติม เช่น borderRadius หรือ keyframes
      borderRadius: {
        '2xl': 'var(--radius)', // ทำให้ .rounded-2xl ใช้ค่า --radius จาก css
      },
      keyframes: {
        'aurora-1': { '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' }, '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' } },
        'aurora-2': { '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' }, '100%': { transform: 'translate(-50%, -50%) rotate(-360deg)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'aurora-1': 'aurora-1 30s linear infinite',
        'aurora-2': 'aurora-2 40s linear infinite reverse',
        shimmer: 'shimmer 1.5s infinite',
      }
    },
  },

  // เพิ่ม Plugins ที่ต้องการใช้งาน
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
