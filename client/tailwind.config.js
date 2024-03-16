/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideX: {
          "0%": {
            transform: "translateX(40%)",
          },

          "100%": {
            transform: "translateX(-100%))",
          },
        },
        reverseX: {
          "0%": {
            transform: "translateX(-20%)",
          },

          "100%": {
            transform: "translateX(100%))",
          },
        },
        slideY: {
          "0%": {
            transform: "translateY(-100%)",
          },

          "100%": {
            transform: "translateY(0%)",
          },
        },
        reverseY: {
          "0%": {
            transform: "translateY(10%)",
          },

          "100%": {
            transform: "translateY(-100%)",
          },
        },
      },
      animation: {
        slideX: "slideX 0.5s ease",
        reverseX: "reverseX 0.5s ease",
        slideY: "slideY 0.5s ease",
        reverseY: "reverseY 0.5s ease",
      },
    },
  },
  plugins: [],
};
