/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./scr/**/*.{html,js}",
    "./scr/**/*.html",
    "./scr/**/*.js",
    "./scr/blog/**/*.html", // <-- เพิ่มบรรทัดนี้เข้าไป
  ],
  theme: {
    extend: {
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'primary-glow': 'hsl(var(--primary-glow))',
        secondary: 'hsl(var(--secondary))',
        'secondary-glow': 'hsl(var(--secondary-glow))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        accent: 'hsl(var(--accent))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // <-- เพิ่ม Plugin นี้
  ],
}
