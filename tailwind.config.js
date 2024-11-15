const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'primary': '#2C3092',
      'primary-hover': '#4A4FB3',
      'secondary': '#ff8a4c',
      'secondary-hover': '#ff5a1f',
    },
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
    },
    extend: {
      fontSize: {
        clamp: "clamp(0.5rem, 5vw, 1.5rem)",
        clampSmall: "clamp(0.5rem, 5vw, 1rem)",
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    require("flowbite/plugin")({
      charts: true,
    }),
  ],
};
