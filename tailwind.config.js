/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./scr/**/*.{html,js}", // ตรวจสอบให้แน่ใจว่า path นี้ถูกต้อง (scr)
  ],
  theme: {
    extend: {
      // เพิ่มส่วนนี้เข้าไปเพื่อให้ Tailwind รู้จักฟอนต์และสีที่เรากำหนดเอง
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        primary: 'hsl(var(--primary))',
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
  plugins: [],
}
