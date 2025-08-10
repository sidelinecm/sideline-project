/** @type {import('tailwindcss').Config} */
module.exports = {
  // ตรวจสอบให้แน่ใจว่า path ถูกต้องตรงกับโครงสร้างโปรเจกต์ของคุณ
  content: [
    "./scr/**/*.{html,js}",
    "./dist/**/*.html" 
  ],
  
  theme: {
    extend: {
      // --- เพิ่มส่วนนี้เข้าไป ---
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
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
      },
      // --- สิ้นสุดส่วนที่เพิ่ม ---
      keyframes: {
        "aurora-1": {
          "0%, 100%": { transform: "translateX(-10%) translateY(5%)" },
          "50%": { transform: "translateX(10%) translateY(-5%)" },
        },
        "aurora-2": {
          "0%, 100%": { transform: "translateX(10%) translateY(-5%)" },
          "50%": { transform: "translateX(-10%) translateY(5%)" },
        },
      },
      animation: {
        "aurora-1": "aurora-1 20s ease-in-out infinite",
        "aurora-2": "aurora-2 20s ease-in-out infinite",
      },
    },
  },
  // เพิ่ม plugins ที่จำเป็นซึ่งมีอยู่ใน package.json ของคุณแล้ว
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
