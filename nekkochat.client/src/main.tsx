//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Provider } from "react-redux"
import { videocallStore, persistor } from './StateManagement/VideocallStore.ts'



createRoot(document.getElementById('root')!).render(
    <Provider store={videocallStore}>
        <App />
        {persistor.persist()}
    </Provider>

)
