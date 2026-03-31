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
          darkest: "#061222",
          dark: "#123249",
          DEFAULT: "#2D5B75",
          light: "#447794",
        },
        background: "#061222",
        foreground: "#f3f4f6", // gray-100
      },
    },
  },
  plugins: [],
};
export default config;
