module.exports = {
  content: ['./src/**/*.{html,ts,tsx}', './node_modules/flowbite/**/*.js'],
  plugins: [require('flowbite/plugin')],
  theme: {
    extend: {
      colors: {
        ['graphql-otel-dark']: '#221F20',
        ['graphql-otel-green']: '#2F8525',
        ['graphiql-dark']: '#202A3B',
        ['graphiql-medium']: '#2D3648',
        ['graphiql-light']: '#B7C2D7',
        ['graphiql-border']: '#3B4355',
        ['graphiql-pink']: '#FF5794',
      },
    },
  },
};
