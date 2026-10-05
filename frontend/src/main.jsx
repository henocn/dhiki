import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import '@fontsource/geist-mono/400.css';
import '@fontsource/geist-mono/500.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { LangProvider } from './i18n/LangContext.jsx';
import { UrgenceProvider } from './components/urgence/UrgenceContext.jsx';
import { demarrerTraduction } from './lib/traduction.js';
import './styles/global.css';

demarrerTraduction();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LangProvider>
        <UrgenceProvider>
          <App />
        </UrgenceProvider>
      </LangProvider>
    </BrowserRouter>
  </StrictMode>,
);
