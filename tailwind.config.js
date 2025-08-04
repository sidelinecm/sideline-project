
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.html', // สแกนไฟล์ .html ทั้งหมดในโฟลเดอร์ app
    './app/main.js',   // สแกนไฟล์ JavaScript หลักในโฟลเดอร์ app
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        prompt: ['Prompt', ...fontFamily.sans],
      },
      colors: {
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
        },
        card: 'hsl(var(--card))',
      },
      height: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
};

