import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import { AuthReducerProvider } from './Context/AuthReducer.jsx'
import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthReducerProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthReducerProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
