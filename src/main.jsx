import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Optional: Auto enable dark mode if system prefers
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
