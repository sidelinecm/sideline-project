/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}", // สแกนไฟล์ .html และ .js ที่อยู่ในโฟลเดอร์ root
    // หากมีไฟล์ในโฟลเดอร์อื่นที่ใช้ class ของ Tailwind ก็เพิ่มเข้ามาที่นี่
    // เช่น "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // กำหนดชื่อฟอนต์ที่ใช้ใน CSS ของคุณ เพื่อให้เรียกใช้ใน class ของ Tailwind ได้
        // เช่น <body class="font-prompt">
        prompt: ['Prompt', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
      },
      colors: {
        // คุณสามารถย้ายตัวแปรสีจาก :root ใน CSS มาไว้ที่นี่ได้
        // เพื่อให้เรียกใช้เป็น class ได้ เช่น bg-primary, text-primary
        primary: 'hsl(var(--primary))',
        'primary-glow': 'hsl(var(--primary-glow))',
        secondary: 'hsl(var(--secondary))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        // เพิ่มสีอื่นๆ ตามต้องการ
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // เปิดใช้งานปลั๊กอิน typography
  ],
}