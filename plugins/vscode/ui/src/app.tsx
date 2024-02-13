import { useState } from "react";

import { SCHEMA_ID } from "./config";

export function App() {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <h1>Hello World</h1>
      {counter}
      <button onClick={() => setCounter(counter + 1)}>Increment</button>

      {SCHEMA_ID}
    </div>
  );
}
