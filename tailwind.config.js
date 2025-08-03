/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js}", // ค้นหาทุกไฟล์ .html และ .js ในโปรเจกต์
  ],
  theme: {
    extend: {
      // แนะนำ: นำค่าสีและฟอนต์จาก styles.css มาไว้ที่นี่
      // เพื่อให้เรียกใช้เป็นคลาสได้โดยตรงและจัดการง่าย
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      },
      colors: {
        primary: 'hsl(var(--primary))',
        'primary-glow': 'hsl(var(--primary-glow))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        card: 'hsl(var(--card))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        accent: 'hsl(var(--accent))',
      },
    },
  },
  plugins: [],
}