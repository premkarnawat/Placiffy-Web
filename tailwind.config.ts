import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#f97316",
          dark: "#1c1917",
          cream: "#fffbeb"
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom right, #f97316, #fffbeb)',
      }
    },
  },
  plugins: [],
};
export default config;
