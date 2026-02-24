import "@radix-ui/themes/styles.css"

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import './style-test.css'

// import App from './App-test.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

