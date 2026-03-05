import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f7f3e8",
        river: "#0f766e",
        canyon: "#7c2d12",
      },
    },
  },
  plugins: [],
};

export default config;
