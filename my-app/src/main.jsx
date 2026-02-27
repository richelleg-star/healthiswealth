import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import "./firebase.jsx";
import app from './firebase.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App firebaseApp={app}/>
  </BrowserRouter>
)