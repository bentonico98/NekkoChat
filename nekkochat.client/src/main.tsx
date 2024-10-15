//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { userStore } from "./Store/userStore";
import { Provider } from "react-redux";

createRoot(document.getElementById('root')!).render(
    <Provider store={userStore}>
        <App />
    </Provider>
)


/*
//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Provider } from "react-redux"
import { persistor, videocallStore } from './StateManagement/VideocallStore.ts'
import { PersistGate } from 'redux-persist/integration/react'



createRoot(document.getElementById('root')!).render(
    <Provider store={videocallStore}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>

)
*/