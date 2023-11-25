/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /** Background Colors */
        ["primary-background"]: "hsl(var(--primary-background))",
        ["secondary-background"]: "hsl(var(--secondary-background))",

        /** Accent Colors */
        ["accent"]: "hsl(var(--accent))",

        /** Text Colors */
        ["neutral"]: "hsla(var(--neutral) / <alpha-value>)",
        ["pink"]: "hsl(var(--pink))",
        ["purple"]: "hsla(var(--purple) / <alpha-value>)",
        ["blue"]: "hsla(var(--blue) / <alpha-value>)",
        ["ochre"]: "hsla(var(--ochre) / <alpha-value>)",
        ["red"]: "hsla(var(--red) / <alpha-value>)",
        ["light-green"]: "hsla(var(--light-green) / <alpha-value>)",
        ["dark-green"]: "hsla(var(--dark-green) / <alpha-value>)",
        ["graphiql-highlight"]: "#444D60",
      },
    },
  },
};
