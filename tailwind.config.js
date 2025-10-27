/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#1877F2",
        "dark-blue": "#166FE5",
        "light-gray": "#f5f5f5",
        "medium-gray": "#e4e6eb",
        "dark-gray": "#65676b",
        "text-dark": "#050505",
        "border-gray": "#CED0D4",
      },
      fontFamily: {
        handwritten: [
          '"Comic Sans MS"',
          '"Chalkboard SE"',
          '"Bradley Hand"',
          "cursive",
        ],
      },
    },
  },
  plugins: [],
};
