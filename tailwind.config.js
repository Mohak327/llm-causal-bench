/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        porcelain: "#EEF1F5",
        glaze: "#D5DCE6",
        cobalt: { DEFAULT: "#1D3A9E", soft: "#4E66B8", mist: "#DCE3F4" },
        ink: { DEFAULT: "#131A2E", soft: "#4A5470", faint: "#7D869C" },
        tea: { DEFAULT: "#C8862A", deep: "#9A5F12", mist: "#F4E6CF" },
        kiln: { DEFAULT: "#B4362C", mist: "#F5DCD8" },
        leaf: { DEFAULT: "#2F7D5B", mist: "#D7EBE1" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
