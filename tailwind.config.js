/* eslint-disable @typescript-eslint/no-require-imports */
// tailwind.config.js

const scrollbar = require("tailwind-scrollbar");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [scrollbar],
};
