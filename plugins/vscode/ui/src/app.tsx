import { useState } from "react";

export function App() {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <h1>Hello World</h1>
      {counter}
      <button onClick={() => setCounter(counter + 1)}>Increment</button>
    </div>
  );
}
