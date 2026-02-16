import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource/iosevka/400.css"
import "@fontsource/iosevka/500.css"
import "@fontsource/iosevka/600.css"
import "@fontsource/iosevka/700.css"
import "@fontsource-variable/inter"
import "./index.css"
import App from "./App.tsx"

console.log(
  "%c\uD83D\uDC4B Hey, you opened DevTools.\n\nYou might be the kind of person who'd enjoy what's hidden here.\nTry the Konami code. Or press Ctrl+` if you know what you're doing.",
  "color: #7aa2f7; font-family: 'Iosevka', monospace; font-size: 13px; line-height: 1.8; padding: 8px 0;"
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
