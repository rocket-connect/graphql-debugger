/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-background": "hsla(var(--primary-background))",
        "secondary-background": "hsla(var(--secondary-background))",
        "text-primary": "hsla(var(--text-primary))",
        accent: "hsla(var(--accent))",
        ["neutral"]: "hsla(var(--neutral) / <alpha-value>)",
        ["primary"]: "hsla(var(--primary) / <alpha-value>)",
        ["secondary-purple"]: "hsla(var(--secondary-purple) / <alpha-value>)",
        ["secondary-blue"]: "hsla(var(--secondary-blue) / <alpha-value>)",
        ["secondary-ochre"]: "hsla(var(--secondary-ochre) / <alpha-value>)",
        ["secondary-red"]: "hsla(var(--secondary-red) / <alpha-value>)",
        ["secondary-green"]: "hsla(var(--secondary-green) / <alpha-value>)",
        ["neutral-100"]: "hsla(var(--neutral-100))",
        ["graphql-otel-dark"]: "#221F20",
        ["graphql-otel-green"]: "#2F8525",
        ["graphiql-dark"]: "#202A3B",
        ["graphiql-medium"]: "#2D3648",
        ["graphiql-light"]: "#B7C2D7",
        ["graphiql-border"]: "#3B4355",
        ["graphiql-pink"]: "#FF5794",
        ["graphiql-highlight"]: "#444D60",
        ["app-blue"]: "#3A4B68",
        ["error-red"]: "#EF4444",
      },
    },
  },
};
