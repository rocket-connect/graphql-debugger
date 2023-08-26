module.exports = {
  content: ["./src/**/*.{html,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  plugins: [require("flowbite/plugin")],
  theme: {
    extend: {
      colors: {
        ["graphql-otel-dark"]: "#221F20",
        ["graphql-otel-green"]: "#2F8525",
      },
    },
  },
};
