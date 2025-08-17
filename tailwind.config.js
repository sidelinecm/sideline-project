/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // เปิด dark mode แบบ class
  content: [
    "./scr/**/*.{html,js}",
    "./scr/**/*.{ts,jsx,tsx,vue,svelte,mdx}",
  ],
  safelist: [
    'bg-primary', 'bg-secondary', 'text-primary', 'text-secondary', 
    'bg-accent', 'bg-muted', 'bg-card', 'hover:bg-primary', 'focus:bg-primary',
    'rounded-xl', 'rounded-2xl', 'shadow-lg', 'shadow-elevated', 'border-primary'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        'primary-glow': 'hsl(var(--primary-glow))',
        'secondary-glow': 'hsl(var(--secondary-glow))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        accent: 'hsl(var(--accent))',
        'color-available': 'hsl(var(--color-available))',
        'color-busy': 'hsl(var(--color-busy))',
        'color-ask': 'hsl(var(--color-ask))',
        'color-gold': 'hsl(var(--color-gold))',
      },
      fontFamily: {
        sans: ['Prompt', 'Sarabun', 'system-ui', 'sans-serif'],
        display: ['Prompt', 'system-ui', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'elevated': '0 4px 20px -5px hsl(var(--primary-glow) / 0.6)',
        'card': '0 2.8px 2.2px hsl(var(--foreground) / 0.02), 0 6.7px 5.3px hsl(var(--foreground) / 0.028), 0 12.5px 10px hsl(var(--foreground) / 0.035), 0 22.3px 17.9px hsl(var(--foreground) / 0.042), 0 41.8px 33.4px hsl(var(--foreground) / 0.05), 0 100px 80px hsl(var(--foreground) / 0.07)',
        'acrylic': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 16px hsl(var(--primary-glow) / 0.7)',
      },
      keyframes: {
        'aurora-1': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        'aurora-2': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(-360deg)' },
        },
        'pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 hsla(var(--color-available), 0.7)' },
          '50%': { boxShadow: '0 0 0 8px hsla(var(--color-available), 0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        'aurora-1': 'aurora-1 30s linear infinite',
        'aurora-2': 'aurora-2 40s linear infinite reverse',
        'pulse': 'pulse 1.5s infinite cubic-bezier(0.66, 0, 0, 1)',
        'fade-in': 'fade-in 0.6s ease-in',
        'fade-up': 'fade-up 0.7s cubic-bezier(.39,.575,.565,1) both',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, hsl(var(--primary-glow)), hsl(var(--secondary-glow)))',
        'card-radial': 'radial-gradient(circle, hsl(var(--primary-glow) / 0.15), transparent 70%)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            a: {
              color: theme('colors.primary'),
              '&:hover': { color: theme('colors.secondary') }
            },
            h1: { fontWeight: '800' },
            h2: { fontWeight: '700' },
            h3: { fontWeight: '700' },
            blockquote: { fontStyle: 'italic', borderLeftColor: theme('colors.primary') },
            code: { backgroundColor: theme('colors.muted'), color: theme('colors.primary') },
          },
        },
        dark: {
          css: {
            color: theme('colors.foreground'),
            blockquote: { borderLeftColor: theme('colors.secondary') },
            code: { backgroundColor: theme('colors.card') },
          }
        }
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
  corePlugins: {
    preflight: true,
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
}