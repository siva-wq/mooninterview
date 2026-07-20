/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      colors: {

        primary: "var(--primary)",

        navy: "var(--navy)",

        gold: "var(--gold)",

        textPrimary: "var(--text-primary)",

        textSecondary: "var(--text-secondary)",

        borderCustom: "var(--border)",

        success: "var(--success)",

        danger: "var(--danger)"

      }

    }
  },
  plugins: [],
}