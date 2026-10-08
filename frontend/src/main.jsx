import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/700.css';
import '@fontsource/fraunces/500-italic.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/400-italic.css';
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
