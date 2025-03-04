import "./assets/main.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Esperar a que el DOM esté listo antes de renderizar
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error("No se encontró el elemento con id='root'");
  }
});

