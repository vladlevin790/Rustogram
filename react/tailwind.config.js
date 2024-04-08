/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor: theme => ({
        gradient: "linear-gradient(to right, pink, red)",
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
