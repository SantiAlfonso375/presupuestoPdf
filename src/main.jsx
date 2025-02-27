import "./assets/main.css";

// import React from "react";
// import ReactDOM from "react-dom/client";
import App from "./App";
//
// document.addEventListener("DOMContentLoaded", () => {
//   ReactDOM.createRoot(document.getElementById("root")).render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>,
//   );
// });
import * as React from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.body);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
