import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/fonts.css"
import "./index.css"
import App from "./App.tsx"

console.log(
  "%c\uD83D\uDC4B Hey, you opened DevTools.\n\nYou might be the kind of person who enjoys reading the source. Same.",
  "color: #7aa2f7; font-family: 'Iosevka', monospace; font-size: 13px; line-height: 1.8; padding: 8px 0;",
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
