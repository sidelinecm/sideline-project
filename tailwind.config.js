/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}", // <-- แก้ไข: ให้มองหาไฟล์ .html และ .js ที่ระดับบนสุด
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        primary: 'hsl(var(--primary))',
        'primary-glow': 'hsl(var(--primary-glow))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        accent: 'hsl(var(--accent))',
      },
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
