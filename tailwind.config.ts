import type { Config } from "tailwindcss";

// Lowband brings its own look (theme.css); Tailwind is used for layout utilities.
const config: Config = {
  content: ["./**/*.{ts,tsx}", "!./node_modules/**"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
