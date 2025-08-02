/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './blog/**/*.html',
    './main.js'
  ],
  theme: {
    extend: {
      colors: {
        // เพิ่มสีทั้งหมดที่ประกาศด้วยตัวแปร CSS ที่นี่
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          glow: 'hsl(var(--primary-glow))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          glow: 'hsl(var(--secondary-glow))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))', // เพิ่ม accent-foreground ด้วยเผื่อมีการใช้งาน
        },
        card: 'hsl(var(--card))',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}