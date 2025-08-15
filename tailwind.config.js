/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ [แก้ไขแล้ว] เพิ่ม './main.js' เพื่อให้ Tailwind สแกนคลาสที่สร้างจาก JavaScript ด้วย
  content: [
    './*.html',
    './main.js', 
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Prompt', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          glow: 'hsl(var(--primary-glow))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          glow: 'hsl(var(--secondary-glow))',
        },
        card: 'hsl(var(--card))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: 'hsl(var(--muted))',
      },
      // ✅ [ปรับปรุง] เพิ่มขนาดความโค้งมนให้ครบตามดีไซน์
      borderRadius: {
        '2xl': 'var(--radius)',
        'xl': 'calc(var(--radius) - 4px)',
        'lg': 'calc(var(--radius) - 8px)',
      },
      // ✅ [ปรับปรุง] เพิ่มค่า scale ที่ใช้บ่อย เพื่อให้เรียกใช้งานง่าย
      scale: {
        '103': '1.03',
      }
    },
  },
  plugins: [],
}