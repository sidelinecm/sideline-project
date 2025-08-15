/** @type {import('tailwindcss').Config} */
module.exports = {
  // ระบุ Path ของไฟล์ทั้งหมดที่ใช้ Tailwind classes เพื่อให้สแกนได้ครบถ้วน
  content: [
    "./scr/**/*.html",
    "./scr/**/*.js",
    "./scr/blog/**/*.html",
  ],

  theme: {
    extend: {
      // กำหนดฟอนต์หลักของโปรเจกต์
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
        // หากมีฟอนต์ Sarabun ด้วย สามารถเพิ่มตรงนี้ได้
        // sarabun: ['Sarabun', 'sans-serif'], 
      },

      // กำหนดสี Custom ทั้งหมดที่ต้องการให้ Tailwind สร้างเป็น Utility Classes
      colors: {
        // --- สีหลักที่ต้องการให้ Tailwind สร้างคลาสให้ (เช่น bg-primary, ring-primary) ---
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        'muted-foreground': 'hsl(var(--muted-foreground))',

        // --- สีที่ใช้เป็นตัวแปรใน CSS เท่านั้น (ไม่ต้องสร้างคลาสโดยตรง) ---
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'primary-glow': 'hsl(var(--primary-glow))',
        'secondary-glow': 'hsl(var(--secondary-glow))',
        muted: 'hsl(var(--muted))',
        border: 'hsl(var(--border))',
        accent: 'hsl(var(--accent))',
      },
    },
  },

  // เพิ่ม Plugins ที่ต้องการใช้งาน
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
