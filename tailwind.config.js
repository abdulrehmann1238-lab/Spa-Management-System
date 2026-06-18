/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#FDFCF9",
          cream: "#F8F6F2",
          marble: "#FAFAF7",
        },
        sage: {
          50: "#F4F7F5",
          100: "#E5ECE7",
          200: "#CBDCD0",
          300: "#A3C2AE",
          400: "#75A083",
          500: "#538162",
          600: "#3C5A4B", // Deep Sage Green (Primary)
          700: "#314B3F",
          800: "#273C33",
          900: "#20312B",
        },
        beige: {
          50: "#FAF9F6",
          100: "#F4F1EA", // Warm Beige (Secondary)
          200: "#E6DEC5",
          300: "#D3C7A3",
          400: "#BFAC7D",
          500: "#AC925C",
        },
        gold: {
          DEFAULT: "#C5A880", // Muted Gold (Accent)
          50: "#F9F6F0",
          100: "#F0EAD9",
          200: "#DFD1B0",
          300: "#CDB687",
          400: "#C5A880",
          500: "#A9885E",
        },
        natural: {
          DEFAULT: "#6B8E23", // Natural Green (Success)
          light: "#EAF2DC",
        },
        amber: {
          DEFAULT: "#D97706", // Warm Amber (Warning)
          light: "#FEF3C7",
        },
        coral: {
          DEFAULT: "#F87171", // Soft Coral (Danger)
          light: "#FEE2E2",
        },
        charcoal: {
          DEFAULT: "#2C302E", // Text
          light: "#4E5451",
          muted: "#7A827E",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        premium: "0 4px 20px -2px rgba(60, 90, 75, 0.04), 0 2px 6px -1px rgba(60, 90, 75, 0.02)",
        'premium-hover': "0 20px 40px -10px rgba(60, 90, 75, 0.08), 0 4px 12px -2px rgba(60, 90, 75, 0.04)",
        card: "0 1px 3px 0 rgba(60, 90, 75, 0.02), 0 1px 2px -1px rgba(60, 90, 75, 0.02)",
      },
    },
  },
  plugins: [],
};
