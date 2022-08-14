/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        bgAccent: "white",
        bgNeutral: "#D9E2EC",
        textMain: "#102A43",
        textAccent: "#014D40",
        primary: "#65D6AD",
        primaryFocus: "#8EEDC7",
        secondary: "#690CB0",
        secondaryFocus: "#B990FF",
        textPrimary: "#014D40",
        focus: "#EFFCF6",
        gray: "#BCCCDC",
        error: "#E12D39",
        disabled: "#BCCCDC",
        disabledLight: "#F0F4F8",
      },
      gridTemplateColumns: {
        "1-auto-1": "32px 1fr 32px",
      },
      boxShadow: {
        input: "0 0 0 .25em #8EEDC7",
      },
    },
  },
  plugins: [],
};
