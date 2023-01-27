/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // bright blue for primary color
        primary: "#F55536",
        secondary: "#FABC3C",
        accent: "#1BC2C1",
        offwhite: "#F2F2F2",
        heading: "#1E1E1E",
        subheading: "#1E1E1E",
        body: "#1E1E1E",
        links: "#1BC2C1",
      },
    },
  },
  plugins: [],
};
