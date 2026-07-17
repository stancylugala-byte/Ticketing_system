import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider }           from './context/AuthContext.jsx';
import { ThemeProvider }          from './context/ThemeContext.jsx';
import { SystemSettingsProvider } from './context/SystemSettingsContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SystemSettingsProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </SystemSettingsProvider>
    </BrowserRouter>
  </StrictMode>,
);
