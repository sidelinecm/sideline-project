/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}", // สแกนไฟล์ .html และ .js ทั้งหมดที่ root
  ],
  theme: {
    extend: {
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
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
        border: 'hsl(var(--border))',
        accent: 'hsl(var(--accent))',
      },
    },
  },
  plugins: [],
}
