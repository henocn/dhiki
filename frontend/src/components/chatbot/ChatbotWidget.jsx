import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLang } from '../../i18n/LangContext.jsx';
import Icon from '../Icon.jsx';
import { useUrgence } from '../urgence/UrgenceContext.jsx';

const SUGGESTIONS = [
  { id: 'anxieux', cle: 'chat.sugAnxieux', reponse: 'chat.repAnxieux', action: { cle: 'chat.actRespirer', to: '/exercices/respiration-4-7-8' } },
  { id: 'parler', cle: 'chat.sugParler', reponse: 'chat.repParler', action: { cle: 'chat.actQuestion', to: '/questions' } },
  { id: 'fonctionnement', cle: 'chat.sugFonctionnement', reponse: 'chat.repFonctionnement', action: { cle: 'chat.actApropos', to: '/a-propos' } },
  { id: 'donnees', cle: 'chat.sugDonnees', reponse: 'chat.repDonnees', action: { cle: 'chat.actConfidentialite', to: '/confidentialite' } },
  { id: 'urgence', cle: 'chat.sugUrgence', reponse: 'chat.repUrgence', action: { cle: 'chat.actUrgence', urgence: true } },
];

// Assistant d'accueil (interface préliminaire) : réponses guidées par suggestions, saisie libre pas encore active.
export default function ChatbotWidget() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { ouvrirUrgence } = useUrgence();
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState([]);
  const listeRef = useRef(null);

  useEffect(() => {
    listeRef.current?.scrollTo({ top: listeRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, ouvert]);

  useEffect(() => {
    if (!ouvert) return undefined;
    // Ferme le panneau avec la touche Échap.
    const onKey = (event) => event.key === 'Escape' && setOuvert(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ouvert]);

  // Ajoute la question choisie et la réponse prédéfinie correspondante.
  function choisir(suggestion) {
    setMessages((m) => [
      ...m,
      { de: 'moi', texte: t(suggestion.cle) },
      { de: 'bot', texte: t(suggestion.reponse), action: suggestion.action },
    ]);
  }

  // Exécute l'action proposée par l'assistant (navigation ou ouverture de l'urgence).
  function executer(action) {
    if (action.urgence) {
      ouvrirUrgence();
    } else {
      navigate(action.to);
      setOuvert(false);
    }
  }

  return (
    <>
      {ouvert && (
        <section className="chat-panel" role="dialog" aria-label={t('chat.titre')}>
          <header className="chat-head">
            <div className="chat-avatar">
              <Icon name="bot" size={20} />
            </div>
            <div className="chat-head-text">
              <strong>{t('chat.titre')}</strong>
              <span className="chat-badge">{t('chat.badge')}</span>
            </div>
            <button type="button" className="icon-btn" aria-label={t('commun.fermer')} onClick={() => setOuvert(false)}>
              <Icon name="x" size={20} />
            </button>
          </header>

          <div className="chat-body" ref={listeRef}>
            <div className="chat-msg chat-msg--bot">{t('chat.bienvenue')}</div>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg--${m.de}`}>
                {m.texte}
                {m.action && (
                  <button type="button" className="chat-action" onClick={() => executer(m.action)}>
                    {t(m.action.cle)}
                    <Icon name="arrowRight" size={14} />
                  </button>
                )}
              </div>
            ))}
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s.id} type="button" className="chat-chip" onClick={() => choisir(s)}>
                  {t(s.cle)}
                </button>
              ))}
            </div>
          </div>

          <footer className="chat-foot">
            <p className="chat-disclaimer">{t('chat.disclaimer')}</p>
            <form className="chat-input" onSubmit={(e) => e.preventDefault()}>
              <input type="text" disabled placeholder={t('chat.bientot')} aria-label={t('chat.bientot')} />
              <button type="submit" disabled aria-label={t('chat.envoyer')}>
                <Icon name="send" size={18} />
              </button>
            </form>
          </footer>
        </section>
      )}

      <button
        type="button"
        className={`chat-fab ${ouvert ? 'is-open' : ''}`}
        aria-label={ouvert ? t('chat.fermer') : t('chat.ouvrir')}
        aria-expanded={ouvert}
        onClick={() => setOuvert((o) => !o)}
      >
        <Icon name={ouvert ? 'x' : 'message'} size={24} />
      </button>
    </>
  );
}
