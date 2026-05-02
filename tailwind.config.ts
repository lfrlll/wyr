import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#2d2933",
        paper: "#fffaf7",
        plum: "#7b5a72",
        rose: "#b8677c",
        sage: "#687d6b",
        mist: "#eef4f1"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(52, 44, 59, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
