/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#00ADB5",
        "bg-deep": "#222831",
        "bg-elevated": "#393E46",
        "text-primary": "#EEEEEE",
        "text-secondary": "rgba(238,238,238,0.7)",
        success: "hsl(142 71% 45%)",
        warning: "hsl(38 92% 50%)",
        error: "hsl(0 72% 51%)",
  // Use rgb var with <alpha-value> so Tailwind can generate alpha variants like `/50`
  border: "rgb(var(--border) / <alpha-value>)",
      }
    },
  },
  plugins: [
    // Provide a small compatibility utility so existing "border-border" classes work
    // This maps the utility to the CSS variable --border defined in `src/index.css`.
    require('tailwindcss/plugin')(function ({ addUtilities }) {
      addUtilities({
        '.border-border': {
          'border-color': 'hsl(var(--border))',
        },
        // support a common opacity variant used in the codebase
        '.border-border\/50': {
          'border-color': 'hsl(var(--border) / 0.5)',
        },
      });
    }),
  ],
}