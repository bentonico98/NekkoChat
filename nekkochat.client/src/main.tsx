//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { userStore } from "./Store/userStore";
import { Provider } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import CssBaseline from '@mui/material/CssBaseline';

createRoot(document.getElementById('root')!).render(
    <Provider store={userStore}>
        <CssBaseline />
        <App />
    </Provider>
)
