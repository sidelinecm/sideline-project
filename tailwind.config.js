/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "aurora-1": {
          "0%, 100%": { transform: "translateX(-10%) translateY(5%)" },
          "50%": { transform: "translateX(10%) translateY(-5%)" },
        },
        "aurora-2": {
          "0%, 100%": { transform: "translateX(10%) translateY(-5%)" },
          "50%": { transform: "translateX(-10%) translateY(5%)" },
        },
      },
      animation: {
        "aurora-1": "aurora-1 20s ease-in-out infinite",
        "aurora-2": "aurora-2 20s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
