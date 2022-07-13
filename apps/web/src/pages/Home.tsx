import { useState } from "react";
import logo from "../../static/logo.svg";
import "../styles/App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>Hello Vite & React!</p>
      <p>
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          count is: {count}
        </button>
      </p>
      <p>{__COMMIT_HASH__}</p>
    </header>
  );
}

export default App;
