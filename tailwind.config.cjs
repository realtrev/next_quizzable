/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // bright blue for primary color
        primary: "#0197F6",
        secondary: "#FABC3C",
        accent: "#1BC2C1",
        offwhite: "#F6F6F6",
        heading: "#1E1E1E",
        subheading: "#1E1E1E",
        body: "#1E1E1E",
        links: "#1BC2C1",
      },
    },
  },
  plugins: [],
};
