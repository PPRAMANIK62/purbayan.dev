import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/fonts.css"
import "./index.css"
import App from "./App.tsx"

console.log(
  "%cYou opened DevTools.\n\nIf you like poking at interfaces, press `i` anywhere on the page.",
  "color: #d0ff3c; font-family: ui-monospace, monospace; font-size: 13px; line-height: 1.8; padding: 8px 0;",
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
