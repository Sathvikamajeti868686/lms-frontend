import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2400,
          style: {
            borderRadius: '12px',
            padding: '10px 12px',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#ecfeff',
              color: '#155e75',
              border: '1px solid #a5f3fc',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
