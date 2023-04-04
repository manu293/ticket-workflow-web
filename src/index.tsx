// imports
import React from "react";
import ReactDOM from "react-dom/client";

// local imports
import App from "./pages/App";

// styles
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
