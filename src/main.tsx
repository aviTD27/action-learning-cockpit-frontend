import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import UniAdminDashboard from './uni-admin/pages/UniAdminDashboard';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/uni-admin" element={<UniAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
