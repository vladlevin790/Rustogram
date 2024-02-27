/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor: theme => ({
        gradient: ["linear-gradient(#AB97EA, #6EB8E2E5, #8ABAD6)"],
      }),
      backgroundColor: theme => ({
        comment: "#F2F2F2",
      })
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      rustogram:['Kaushan Script', "cursive"]
    },

  },
  plugins: [],
}
