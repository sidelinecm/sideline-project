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
        primary: 'hsl(var(--primary))',
        'primary-glow': 'hsl(var(--primary-glow))',
        secondary: 'hsl(var(--secondary))',
        'secondary-glow': 'hsl(var(--secondary-glow))',
        foreground: 'hsl(var(--foreground))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}