import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {QueryClient, QueryClientContext} from "@tanstack/react-query";

const queryClient = new QueryClient ();

createRoot(document.getElementById('root')).render(
  <QueryClientContext client={queryClient}>
    <App />
  </QueryClientContext>,
)
