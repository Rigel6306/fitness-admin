// tailwind.config.js
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", // add this if your components live in /src
  ],
  theme: {
    extend: {
      colors: {
        card: "#2c2c2c93",
        accent: "#FF6B6B",
        heading: "#F0F0F0"
      },
    },
  },
  plugins: [],
};