/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#06f7f7", // This sets the primary color
        secondary: {
          DEFAULT: "#374151", // Dark background
          lighter: "#4B5563", // Lighter variant for contrast
        },
      },
    },
  },
  variants: {
    extend: {
      display: ["responsive", "group-hover", "group-focus"],
    },
  },
  plugins: [],
};
