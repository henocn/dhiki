import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useLang } from '../../i18n/LangContext.jsx';
import ChatbotWidget from '../chatbot/ChatbotWidget.jsx';
import UrgenceModal from '../urgence/UrgenceModal.jsx';
import Footer from './Footer.jsx';
import Header from './Header.jsx';

// Remonte en haut de page à chaque changement d'URL, ou fait défiler jusqu'à l'ancre (#section) si présente.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const id = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80);
    return () => clearTimeout(id);
  }, [pathname, hash]);
  return null;
}

// Gabarit commun à toutes les pages : en-tête, contenu, pied de page, urgence et assistant.
export default function Layout() {
  const { t } = useLang();
  return (
    <>
      <a href="#contenu" className="skip-link">
        {t('commun.allerContenu')}
      </a>
      <ScrollToTop />
      <Header />
      <main id="contenu" className="site-main">
        <Outlet />
      </main>
      <Footer />
      <UrgenceModal />
      <ChatbotWidget />
    </>
  );
}
