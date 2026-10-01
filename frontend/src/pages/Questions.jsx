import { useState } from 'react';
import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { FormError } from '../components/TemoignageForm.jsx';
import { ErrorState, Loader } from '../components/ui.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { api, useApi } from '../lib/api.js';
import { formaterDate } from '../lib/utils.js';

// Page « Poser une question » : question publique ou confidentielle, suivi par code, questions récentes.
export default function Questions() {
  const { t, langue } = useLang();
  const [resultat, setResultat] = useState(null);
  const publiques = useApi('/questions/publiques');

  return (
    <div className="container page page--narrow">
      <header className="page-head">
        <h1>{t('qa.titre')}</h1>
        <p>{t('qa.intro')}</p>
      </header>

      {resultat ? <Confirmation resultat={resultat} onReset={() => setResultat(null)} /> : <QuestionForm onSent={setResultat} />}

      <SuiviForm />

      <section className="section">
        <h2 className="sec-title">{t('qa.recentes')}</h2>
        {publiques.loading && <Loader />}
        {publiques.error && <ErrorState error={publiques.error} onRetry={publiques.reload} />}
        {publiques.data?.length === 0 && <p className="muted">{t('qa.aucune')}</p>}
        <ul className="list">
          {publiques.data?.map((q) => (
            <li key={q.id} className="qa-item">
              <p className="qa-q">{q.contenu}</p>
              {q.statut === 'repondue' ? (
                <div className="qa-a">
                  <span className="qa-a-label">
                    <Icon name="shieldCheck" size={15} />
                    {t('qa.reponsePro')}
                  </span>
                  {q.reponse}
                </div>
              ) : (
                <span className="tag tag--warn">{t('qa.enAttente')}</span>
              )}
              <span className="qa-meta">
                {q.pseudo || t('qa.anonyme')} · {formaterDate(q.creeLe, langue)}
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
  const { t } = useLang();
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
          { id: 'confidentielle', icone: 'lock', titre: t('qa.confidentielleTitre') },
          { id: 'publique', icone: 'users', titre: t('qa.publiqueTitre') },
        ].map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={type === o.id} className={type === o.id ? 'is-active' : ''} onClick={() => setType(o.id)}>
            <Icon name={o.icone} size={16} />
            {o.titre}
          </button>
        ))}
      </div>
      <p className="segmented-hint">{type === 'publique' ? t('qa.publiqueTexte') : t('qa.confidentielleTexte')}</p>
      <label className="field">
        <span className="sr-only">{type === 'publique' ? t('qa.labelPublique') : t('qa.labelConfidentielle')}</span>
        <textarea value={contenu} onChange={(e) => setContenu(e.target.value)} rows={5} maxLength={2000} placeholder={t('qa.placeholder')} />
        <span className="field-hint">{t('commun.caracteres', { n: longueur, max: 2000 })}</span>
      </label>
      {type === 'publique' && (
        <label className="field">
          <span>{t('qa.pseudo')}</span>
          <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} maxLength={40} placeholder={t('qa.pseudoPlaceholder')} />
        </label>
      )}
      {etat.erreur && <FormError error={etat.erreur} />}
      <div className="form-actions form-actions--split">
        <span className="muted small">{type === 'publique' ? t('qa.hintPublique') : t('qa.hintConfidentielle')}</span>
        <button type="submit" className="btn btn-primary" disabled={etat.envoi || longueur < 10}>
          <Icon name="send" size={16} />
          {etat.envoi ? t('commun.envoiEnCours') : t('commun.envoyer')}
        </button>
      </div>
    </form>
  );
}

// Confirmation d'envoi ; pour une question confidentielle, affiche le code de suivi une seule fois.
function Confirmation({ resultat, onReset }) {
  const { t, langue } = useLang();
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
      <h2>{t('qa.envoyeeTitre')}</h2>
      {resultat.type === 'publique' ? (
        <p>{t('qa.envoyeePublique')}</p>
      ) : (
        <>
          <p>{t('qa.envoyeeConfidentielle')}</p>
          <div className="code-box">
            <code>{resultat.codeSuivi}</code>
            <button type="button" className="btn btn-secondary btn-sm" onClick={copier}>
              <Icon name={copie ? 'check' : 'copy'} size={15} />
              {copie ? t('qa.copie') : t('qa.copier')}
            </button>
          </div>
          <p className="warn-box">
            <Icon name="alert" size={16} />
            {t('qa.codeAvertissement', { date: formaterDate(resultat.expireLe, langue) })}
          </p>
        </>
      )}
      <button type="button" className="btn btn-primary" onClick={onReset}>
        {t('qa.autre')}
      </button>
    </div>
  );
}

// Consultation d'une question confidentielle grâce à son code de suivi.
function SuiviForm() {
  const { t, langue } = useLang();
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
        {t('qa.suiviTitre')}
        <Icon name="chevronDown" size={16} className="suivi-chevron" />
      </summary>
      <form className="suivi-form" onSubmit={consulter}>
        <label className="field">
          <span>{t('qa.suiviLabel')}</span>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX" autoComplete="off" spellCheck={false} />
        </label>
        <button type="submit" className="btn btn-secondary" disabled={etat.envoi || code.replace(/[^a-z0-9]/gi, '').length < 16}>
          {t('qa.suiviBouton')}
        </button>
      </form>
      {etat.erreur && (etat.erreur.status === 404 ? <p className="form-error">{t('qa.suiviIntrouvable')}</p> : <FormError error={etat.erreur} />)}
      {etat.question && (
        <div className="qa-item">
          <p className="qa-q">{etat.question.contenu}</p>
          {etat.question.reponse ? (
            <div className="qa-a">
              <span className="qa-a-label">
                <Icon name="shieldCheck" size={15} />
                {t('qa.reponsePro')}
              </span>
              {etat.question.reponse}
            </div>
          ) : (
            <span className="tag tag--warn">{t('qa.enAttente')}</span>
          )}
          <span className="qa-meta">{t('qa.envoyeeLe', { date: formaterDate(etat.question.creeLe, langue) })}</span>
        </div>
      )}
      <p className="muted small">
        {t('qa.suiviAide')} <Link to="/confidentialite#questions">{t('nav.confidentialite')}</Link>
      </p>
    </details>
  );
}
