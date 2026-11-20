import type { Config } from "tailwindcss";

// Lowband brings its own look (src/styles/theme.css); Tailwind is used for layout utilities.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
