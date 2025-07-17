import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { keepAlive } from "./lib/api";

// Start keep-alive for Render free tier
if (import.meta.env.PROD) {
  keepAlive();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
