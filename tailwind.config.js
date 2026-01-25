/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#25e2f4",
        secondary: "#a855f7",
        "background-light": "#f5f8f8",
        "background-dark": "#0D1117",
        "surface-dark": "#161b22",
        "border-dark": "#30363d",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #30363d 1px, transparent 1px), linear-gradient(to bottom, #30363d 1px, transparent 1px)",
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

