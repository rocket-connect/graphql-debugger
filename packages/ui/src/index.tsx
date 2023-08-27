import { createRoot } from 'react-dom/client';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { App } from './App';

import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
  url: 'http://localhost:16686/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

const root = createRoot(document.querySelector('#root'));
root.render(
  <Provider value={client}>
    <App />
  </Provider>
);
