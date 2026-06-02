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
        ink: "#20272C",
        sky: "#8ABFE7",
      },
      boxShadow: {
        panel: "0 22px 70px rgba(0, 0, 0, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
