import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from "react-router-dom";  // for deep urls
import "./styles/common.css";
import "./index.css";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
      <HashRouter>
        <App />
      </HashRouter>
  
  </StrictMode>,
)
