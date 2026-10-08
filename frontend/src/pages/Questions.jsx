import { useState } from 'react';
import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { FormError } from '../components/TemoignageForm.jsx';
import { ErrorState, Loader } from '../components/ui.jsx';
import { api, useApi } from '../lib/api.js';
import { formaterDate } from '../lib/utils.js';

// Page « Poser une question » : question publique ou confidentielle, suivi par code, questions récentes.
export default function Questions() {
  const [resultat, setResultat] = useState(null);
  const publiques = useApi('/questions/publiques');

  return (
    <div className="container page page--narrow">
      <header className="page-head">
        <h1>Questions</h1>
        <p>Un·e professionnel·le te répond. Pas besoin de donner ton nom.</p>
      </header>

      {resultat ? <Confirmation resultat={resultat} onReset={() => setResultat(null)} /> : <QuestionForm onSent={setResultat} />}

      <SuiviForm />

      <section className="section">
        <h2 className="sec-title">Questions récentes</h2>
        {publiques.loading && <Loader />}
        {publiques.error && <ErrorState error={publiques.error} onRetry={publiques.reload} />}
        {publiques.data?.length === 0 && <p className="muted">Aucune question publiée pour le moment.</p>}
        <ul className="list">
          {publiques.data?.map((q) => (
            <li key={q.id} className="qa-item">
              <p className="qa-q">{q.contenu}</p>
              {q.statut === 'repondue' ? (
                <div className="qa-a">
                  <span className="qa-a-label">
                    <Icon name="shieldCheck" size={15} />
                    Réponse d’un·e professionnel·le
                  </span>
                  {q.reponse}
                </div>
              ) : (
                <span className="tag tag--warn">En attente de réponse</span>
              )}
              <span className="qa-meta">
                {q.pseudo || 'Anonyme'} · {formaterDate(q.creeLe)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// Formulaire de question avec choix publique / confidentielle (pseudo uniquement pour les questions publiques).
function QuestionForm({ onSent }) {
  const [type, setType] = useState('confidentielle');
  const [contenu, setContenu] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [etat, setEtat] = useState({ envoi: false, erreur: null });
  const longueur = contenu.trim().length;

  // Envoie la question à l'API puis affiche la confirmation.
  async function envoyer(event) {
    event.preventDefault();
    setEtat({ envoi: true, erreur: null });
    try {
      const body = type === 'publique' ? { contenu, pseudo: pseudo || undefined } : { contenu };
      const data = await api(`/questions/${type === 'publique' ? 'publiques' : 'confidentielles'}`, { method: 'POST', body });
      onSent({ type, ...data });
    } catch (error) {
      setEtat({ envoi: false, erreur: error });
    }
  }

  return (
    <form className="form-card" onSubmit={envoyer} noValidate>
      <div className="segmented" role="radiogroup" aria-label="Type de question">
        {[
          { id: 'confidentielle', icone: 'lock', titre: 'Confidentielle' },
          { id: 'publique', icone: 'users', titre: 'Publique' },
        ].map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={type === o.id} className={type === o.id ? 'is-active' : ''} onClick={() => setType(o.id)}>
            <Icon name={o.icone} size={16} />
            {o.titre}
          </button>
        ))}
      </div>
      <p className="segmented-hint">{type === 'publique' ? 'Publiée après relecture, la réponse peut aider d’autres jeunes.' : 'Lue uniquement par l’équipe. Tu recevras un code pour voir la réponse.'}</p>
      <label className="field">
        <span className="sr-only">{type === 'publique' ? 'Ta question publique' : 'Ta question confidentielle'}</span>
        <textarea value={contenu} onChange={(e) => setContenu(e.target.value)} rows={5} maxLength={2000} placeholder="Écris ta question ici…" />
        <span className="field-hint">{`${longueur} / ${2000} caractères`}</span>
      </label>
      {type === 'publique' && (
        <label className="field">
          <span>Pseudo (facultatif)</span>
          <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} maxLength={40} placeholder="Ex. : Kofi" />
        </label>
      )}
      {etat.erreur && <FormError error={etat.erreur} />}
      <div className="form-actions form-actions--split">
        <span className="muted small">{type === 'publique' ? 'N’indique ni nom, ni école, ni numéro.' : 'Garde bien le code affiché après l’envoi.'}</span>
        <button type="submit" className="btn btn-primary" disabled={etat.envoi || longueur < 10}>
          <Icon name="send" size={16} />
          {etat.envoi ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
}

// Confirmation d'envoi ; pour une question confidentielle, affiche le code de suivi une seule fois.
function Confirmation({ resultat, onReset }) {
  const [copie, setCopie] = useState(false);

  // Copie le code de suivi dans le presse-papiers.
  async function copier() {
    try {
      await navigator.clipboard.writeText(resultat.codeSuivi);
      setCopie(true);
    } catch {
      setCopie(false);
    }
  }

  return (
    <div className="confirm-box">
      <Icon name="checkCircle" size={36} />
      <h2>Question envoyée</h2>
      {resultat.type === 'publique' ? (
        <p>Elle sera publiée après relecture par notre équipe.</p>
      ) : (
        <>
          <p>Note ce code : c’est le seul moyen de retrouver la réponse.</p>
          <div className="code-box">
            <code>{resultat.codeSuivi}</code>
            <button type="button" className="btn btn-secondary btn-sm" onClick={copier}>
              <Icon name={copie ? 'check' : 'copy'} size={15} />
              {copie ? 'Copié' : 'Copier'}
            </button>
          </div>
          <p className="warn-box">
            <Icon name="alert" size={16} />
            {`Nous ne pouvons pas te renvoyer ce code. Ta question sera supprimée le ${formaterDate(resultat.expireLe)}.`}
          </p>
        </>
      )}
      <button type="button" className="btn btn-primary" onClick={onReset}>
        Poser une autre question
      </button>
    </div>
  );
}

// Consultation d'une question confidentielle grâce à son code de suivi.
function SuiviForm() {
  const [code, setCode] = useState('');
  const [etat, setEtat] = useState({ envoi: false, erreur: null, question: null });

  // Interroge l'API avec le code saisi.
  async function consulter(event) {
    event.preventDefault();
    setEtat({ envoi: true, erreur: null, question: null });
    try {
      const question = await api('/questions/confidentielles/suivi', { method: 'POST', body: { code } });
      setEtat({ envoi: false, erreur: null, question });
    } catch (error) {
      setEtat({ envoi: false, erreur: error, question: null });
    }
  }

  return (
    <details className="suivi">
      <summary>
        <Icon name="lock" size={18} />
        J’ai déjà un code de suivi
        <Icon name="chevronDown" size={16} className="suivi-chevron" />
      </summary>
      <form className="suivi-form" onSubmit={consulter}>
        <label className="field">
          <span>Code de suivi</span>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX" autoComplete="off" spellCheck={false} />
        </label>
        <button type="submit" className="btn btn-secondary" disabled={etat.envoi || code.replace(/[^a-z0-9]/gi, '').length < 16}>
          Voir la réponse
        </button>
      </form>
      {etat.erreur && (etat.erreur.status === 404 ? <p className="form-error">Aucune question ne correspond à ce code, ou elle a expiré.</p> : <FormError error={etat.erreur} />)}
      {etat.question && (
        <div className="qa-item">
          <p className="qa-q">{etat.question.contenu}</p>
          {etat.question.reponse ? (
            <div className="qa-a">
              <span className="qa-a-label">
                <Icon name="shieldCheck" size={15} />
                Réponse d’un·e professionnel·le
              </span>
              {etat.question.reponse}
            </div>
          ) : (
            <span className="tag tag--warn">En attente de réponse</span>
          )}
          <span className="qa-meta">{`Envoyée le ${formaterDate(etat.question.creeLe)}`}</span>
        </div>
      )}
      <p className="muted small">
        Le code ressemble à ABCD-EFGH-JKLM-NPQR. <Link to="/confidentialite#questions">Confidentialité</Link>
      </p>
    </details>
  );
}
