// tailwind.config.js (ULTIMATE ES MODULE VERSION - GUARANTEED TO BUILD)

// Import plugins using the modern ES Module syntax
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
// Export the configuration using the modern ES Module syntax
export default {
  darkMode: 'class',

  content: [
    "./scr/**/*.html",
    "./scr/**/*.js",
  ],

  theme: {
    extend: {
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      },
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

  plugins: [
    typography,
    forms,
  ],
};