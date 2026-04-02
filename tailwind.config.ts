import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coastal: {
          darkest: "#000000",
          dark: "#111111",
          DEFAULT: "#222222",
          light: "#333333",
        },
        background: "#000000",
        foreground: "#f3f4f6", // gray-100
      },
    },
  },
  plugins: [],
};
export default config;
