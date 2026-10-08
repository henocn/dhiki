import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Icon from '../Icon.jsx';
import { useUrgence } from '../urgence/UrgenceContext.jsx';

const SUGGESTIONS = [
  { id: 'anxieux', libelle: 'Je me sens anxieux·se', reponse: 'Merci de me le dire. Quand l’anxiété monte, la respiration est un bon premier geste : elle calme le corps en quelques minutes.', action: { libelle: 'Faire l’exercice 4-7-8', to: '/exercices/respiration-4-7-8' } },
  { id: 'parler', libelle: 'Je veux parler à quelqu’un', reponse: 'Tu peux poser une question, publique ou confidentielle. Un·e professionnel·le te répondra, sans que tu aies à donner ton nom.', action: { libelle: 'Poser une question', to: '/questions' } },
  { id: 'fonctionnement', libelle: 'Comment marche DHIKI ?', reponse: 'DHIKI propose des articles, des exercices et un espace de questions et gratuitement.', action: { libelle: 'En savoir plus', to: '/a-propos' } },
  { id: 'donnees', libelle: 'Que faites-vous de mes données ?', reponse: 'Nous collectons le strict minimum : pas de compte, pas de nom. Tes écrits restent sur ton appareil.', action: { libelle: 'Lire la politique de confidentialité', to: '/confidentialite' } },
  { id: 'urgence', libelle: 'Je ne vais vraiment pas bien', reponse: 'Je suis désolé que tu traverses ça. Tu n’as pas à rester seul·e : ouvre l’aide d’urgence pour trouver quelqu’un à contacter maintenant.', action: { libelle: 'Ouvrir l’aide d’urgence', urgence: true } },
];

// Assistant d'accueil (interface préliminaire) : réponses guidées par suggestions, saisie libre pas encore active.
export default function ChatbotWidget() {
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
      { de: 'moi', texte: suggestion.libelle },
      { de: 'bot', texte: suggestion.reponse, action: suggestion.action },
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
        <section className="chat-panel" role="dialog" aria-label="Assistant DHIKI">
          <header className="chat-head">
            <div className="chat-avatar">
              <Icon name="bot" size={20} />
            </div>
            <div className="chat-head-text">
              <strong>Assistant DHIKI</strong>
              <span className="chat-badge">Version de démonstration</span>
            </div>
            <button type="button" className="icon-btn" aria-label="Fermer" onClick={() => setOuvert(false)}>
              <Icon name="x" size={20} />
            </button>
          </header>

          <div className="chat-body" ref={listeRef}>
            <div className="chat-msg chat-msg--bot">Bonjour ! Je suis l’assistant de DHIKI. Je peux t’orienter vers le bon contenu. Choisis une question ci-dessous.</div>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg--${m.de}`}>
                {m.texte}
                {m.action && (
                  <button type="button" className="chat-action" onClick={() => executer(m.action)}>
                    {m.action.libelle}
                    <Icon name="arrowRight" size={14} />
                  </button>
                )}
              </div>
            ))}
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s.id} type="button" className="chat-chip" onClick={() => choisir(s)}>
                  {s.libelle}
                </button>
              ))}
            </div>
          </div>

          <footer className="chat-foot">
            <p className="chat-disclaimer">Cet assistant ne remplace pas un professionnel. En cas de danger, utilise le bouton Urgence.</p>
            <form className="chat-input" onSubmit={(e) => e.preventDefault()}>
              <input type="text" disabled placeholder="La saisie libre arrive bientôt" aria-label="La saisie libre arrive bientôt" />
              <button type="submit" disabled aria-label="Envoyer">
                <Icon name="send" size={18} />
              </button>
            </form>
          </footer>
        </section>
      )}

      <button
        type="button"
        className={`chat-fab ${ouvert ? 'is-open' : ''}`}
        aria-label={ouvert ? 'Fermer l’assistant' : 'Ouvrir l’assistant'}
        aria-expanded={ouvert}
        onClick={() => setOuvert((o) => !o)}
      >
        <Icon name={ouvert ? 'x' : 'message'} size={24} />
      </button>
    </>
  );
}
