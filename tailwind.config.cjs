/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2266FF",
        "primary-dark": "#1a4db8",
        secondary: "#dc4dda",
        tertiary: "#ff886e",
        quaternary: "#ffcc00",
        highlight: "#f9f871",
        teal: "#1dc198",
        sky: "#1dc1c1",
        purple: "#c11dc1",
        background: {
          1: "#121212",
          2: "#151515",
          3: "#1E1E1E",
          4: "#2B2B2B",
          text: "#888",
        },
        paragraph: "#BBBBBB",
      },
    },
  },
  plugins: [],
};
