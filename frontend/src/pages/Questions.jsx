import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { FormError } from '../components/TemoignageForm.jsx';
import { ErrorState, Loader } from '../components/ui.jsx';
import { MEDIAS } from '../content/medias.js';
import { api, useApi } from '../lib/api.js';
import { formaterDate } from '../lib/utils.js';

const CHOIX = [
  { id: 'confidentielle', icone: 'lock', titre: 'Confidentiel' },
  { id: 'publique', icone: 'users', titre: 'Public' },
];

const CHOIX_BTN =
  'flex items-center justify-center gap-2.5 min-w-[210px] px-7 py-[15px] border-[1.5px] rounded-none font-medium text-[1.05rem] cursor-pointer [transition:background_0.2s,color_0.2s,border-color_0.2s,transform_0.2s] hover:[transform:translateY(-2px)] focus-visible:outline-3 focus-visible:outline-tcl focus-visible:outline-offset-3 max-[640px]:min-w-0';
const CHOIX_VARIANTE = {
  confidentielle: 'border-tc bg-tc text-white hover:border-tc-dark hover:bg-tc-dark',
  publique: 'border-coal bg-white text-coal hover:bg-coal hover:text-white',
};
const CARTE = 'mt-5 p-[clamp(18px,4vw,26px)] bg-sand border-[1.5px] border-bdl rounded-(--rad)';
const QA_ITEM = 'p-[18px] bg-white border-[1.5px] border-bdl rounded-(--rad)';
const QA_A = 'mt-2.5 pl-3 border-l-[3px] border-sage text-[0.9rem] text-ts';
const QA_A_LABEL = 'flex items-center gap-[5px] mb-0.5 text-[0.76rem] font-bold text-sage';
const QA_META = 'block mt-2 text-[0.78rem] text-ts';
const MODAL_TITRE = 'mb-7 pr-10 font-semibold text-[1.7rem]';
const MODAL_LIBELLE = 'text-ts font-medium text-[0.78rem] tracking-[0.06em] uppercase';
const CONFIRM_TEXTE = 'mx-auto mb-4 max-w-[460px] text-ts';
const MODAL_SAISIE = 'px-3.5 py-3 border border-bd rounded-none bg-white focus:border-tc';

// Page « Questions » : visuel d'accueil avec les deux choix (confidentiel / public), suivi par code, questions récentes.
export default function Questions() {
  const [type, setType] = useState(null);
  const publiques = useApi('/questions/publiques');
  const fermer = useCallback(() => setType(null), []);

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-10 bg-blanc-photo text-center max-[640px]:pb-12">
        <img
          className="relative left-1/2 block w-auto max-w-none h-[clamp(300px,52vh,480px)] -translate-x-1/2 [mask-image:linear-gradient(#000_64%,transparent_86%)] max-[640px]:h-[340px]"
          src={MEDIAS.questionsHero.src}
          alt={MEDIAS.questionsHero.alt}
        />
        <div className="relative z-1 max-w-[1100px] mx-auto mt-[calc(clamp(300px,52vh,480px)*-0.17)] max-[640px]:-mt-10">
          <h1 className="mb-3.5 font-title font-semibold text-[clamp(1.9rem,3.6vw,2.7rem)] leading-[1.1] text-coal">
            Une question te trotte dans la tête ? <em className="text-tc italic">Pose-la.</em>
          </h1>
          <p className="max-w-[900px] mx-auto text-ts text-[1.06rem] leading-[1.6]">
            Un·e professionnel·le de l’équipe te répond, sans jugement et sans te demander ton nom. Aucune question n’est bête.
          </p>
          <div className="flex justify-center gap-3.5 mt-[26px] max-[640px]:flex-col max-[640px]:items-stretch">
            {CHOIX.map((c) => (
              <button key={c.id} type="button" className={`${CHOIX_BTN} ${CHOIX_VARIANTE[c.id]}`} onClick={() => setType(c.id)}>
                <Icon name={c.icone} size={19} />
                {c.titre}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container page page--narrow pt-10">
        <QuestionModal type={type} onFermer={fermer} />

        <SuiviForm />

        <section className="section">
          <h2 className="sec-title">Questions récentes</h2>
          {publiques.loading && <Loader />}
          {publiques.error && <ErrorState error={publiques.error} onRetry={publiques.reload} />}
          {publiques.data?.length === 0 && <p className="muted">Aucune question publiée pour le moment.</p>}
          <ul className="list">
            {publiques.data?.map((q) => (
              <li key={q.id} className={QA_ITEM}>
                <p className="font-semibold">{q.contenu}</p>
                {q.statut === 'repondue' ? (
                  <div className={QA_A}>
                    <span className={QA_A_LABEL}>
                      <Icon name="shieldCheck" size={15} />
                      Réponse d’un·e professionnel·le
                    </span>
                    {q.reponse}
                  </div>
                ) : (
                  <span className="tag tag--warn">En attente de réponse</span>
                )}
                <span className={QA_META}>
                  {q.pseudo || 'Anonyme'} · {formaterDate(q.creeLe)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

// Fenêtre de question (confidentielle ou publique) : formulaire puis confirmation, fermeture par Échap ou clic extérieur.
function QuestionModal({ type, onFermer }) {
  const [resultat, setResultat] = useState(null);

  useEffect(() => {
    if (!type) return undefined;
    setResultat(null);
    document.body.classList.add('no-scroll');
    // Ferme la fenêtre avec la touche Échap.
    const onKey = (event) => event.key === 'Escape' && onFermer();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [type, onFermer]);

  if (!type) return null;
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onFermer()}>
      <div className="sheet max-w-[540px] p-[36px_36px_30px] rounded-none shadow-[0_30px_80px_rgba(44,26,18,0.28)]" role="dialog" aria-modal="true" aria-labelledby="q-titre">
        <button type="button" className="sheet-close icon-btn top-[18px] right-[18px] rounded-none bg-transparent" aria-label="Fermer" onClick={onFermer}>
          <Icon name="x" size={20} />
        </button>
        {resultat ? <Confirmation resultat={resultat} onFermer={onFermer} /> : <QuestionForm type={type} onSent={setResultat} onFermer={onFermer} />}
      </div>
    </div>
  );
}

// Formulaire d'une question publique ou confidentielle (pseudo uniquement pour les questions publiques).
function QuestionForm({ type, onSent, onFermer }) {
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
    <form onSubmit={envoyer} noValidate>
      <p className="mb-1 text-tc font-medium text-[0.8rem] tracking-[0.08em] uppercase">{type === 'publique' ? 'Question publique' : 'Question confidentielle'}</p>
      <h2 id="q-titre" className={MODAL_TITRE}>
        {type === 'publique' ? 'Pose ta question à tous' : 'Pose ta question en privé'}
      </h2>
      {type === 'publique' && (
        <label className="field">
          <span className={MODAL_LIBELLE}>Pseudo</span>
          <input type="text" className={MODAL_SAISIE} value={pseudo} onChange={(e) => setPseudo(e.target.value)} maxLength={40} placeholder="Ex. : Kofi" />
        </label>
      )}
      <label className="field">
        <span className={MODAL_LIBELLE}>Ta question</span>
        <textarea
          autoFocus
          className={`${MODAL_SAISIE} min-h-[130px] resize-y`}
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          rows={6}
          maxLength={2000}
          placeholder="Écris-la comme elle te vient…"
        />
        <span className="field-hint">{`${longueur} / 2000`}</span>
      </label>
      {etat.erreur && <FormError error={etat.erreur} />}
      <div className="form-actions mt-[22px] pt-5 border-t border-bdl">
        <button type="button" className="btn btn-ghost rounded-none border-transparent bg-transparent" onClick={onFermer}>
          Annuler
        </button>
        <button type="submit" className="btn btn-primary rounded-none" disabled={etat.envoi || longueur < 10}>
          <Icon name="send" size={16} />
          {etat.envoi ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
}

// Confirmation d'envoi ; pour une question confidentielle, affiche le code de suivi une seule fois.
function Confirmation({ resultat, onFermer }) {
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
    <div className={`${CARTE} text-center`}>
      <Icon name="checkCircle" size={36} className="mx-auto mb-2.5 text-sage" />
      <h2 className={MODAL_TITRE}>Question envoyée</h2>
      {resultat.type === 'publique' ? (
        <p className={CONFIRM_TEXTE}>Elle sera publiée après relecture par notre équipe.</p>
      ) : (
        <>
          <p className={CONFIRM_TEXTE}>Note ce code : c’est le seul moyen de retrouver la réponse.</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mx-auto mb-3.5 p-3.5 max-w-[480px] bg-white border-2 border-dashed border-tc rounded-xl">
            <code className="text-[clamp(1rem,4.5vw,1.3rem)] font-bold tracking-[0.08em] text-coal break-all">{resultat.codeSuivi}</code>
            <button type="button" className="btn btn-secondary btn-sm" onClick={copier}>
              <Icon name={copie ? 'check' : 'copy'} size={15} />
              {copie ? 'Copié' : 'Copier'}
            </button>
          </div>
          <p className="warn-box mx-auto mb-4 max-w-[480px] text-left text-ts">
            <Icon name="alert" size={16} />
            {`Nous ne pouvons pas te renvoyer ce code. Ta question sera supprimée le ${formaterDate(resultat.expireLe)}.`}
          </p>
        </>
      )}
      <button type="button" className="btn btn-primary" onClick={onFermer}>
        Fermer
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
    <details className={`group ${CARTE} [&_.form-error]:mt-3.5`}>
      <summary className="flex items-center gap-2.5 min-h-8 font-bold cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <Icon name="lock" size={18} />
        J’ai déjà un code de suivi
        <Icon name="chevronDown" size={16} className="ml-auto [transition:transform_0.2s] group-open:[transform:rotate(180deg)]" />
      </summary>
      <form className="flex flex-wrap items-end gap-2.5 mt-3.5" onSubmit={consulter}>
        <label className="field min-w-[220px] mb-0">
          <span>Code de suivi</span>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX" autoComplete="off" spellCheck={false} />
        </label>
        <button type="submit" className="btn btn-secondary" disabled={etat.envoi || code.replace(/[^a-z0-9]/gi, '').length < 16}>
          Voir la réponse
        </button>
      </form>
      {etat.erreur && (etat.erreur.status === 404 ? <p className="form-error">Aucune question ne correspond à ce code, ou elle a expiré.</p> : <FormError error={etat.erreur} />)}
      {etat.question && (
        <div className={`${QA_ITEM} mt-3.5`}>
          <p className="font-semibold">{etat.question.contenu}</p>
          {etat.question.reponse ? (
            <div className={QA_A}>
              <span className={QA_A_LABEL}>
                <Icon name="shieldCheck" size={15} />
                Réponse d’un·e professionnel·le
              </span>
              {etat.question.reponse}
            </div>
          ) : (
            <span className="tag tag--warn">En attente de réponse</span>
          )}
          <span className={QA_META}>{`Envoyée le ${formaterDate(etat.question.creeLe)}`}</span>
        </div>
      )}
      <p className="muted small mt-3">
        Le code ressemble à ABCD-EFGH-JKLM-NPQR.{' '}
        <Link to="/confidentialite#questions" className="text-tc font-semibold underline underline-offset-2">
          Confidentialité
        </Link>
      </p>
    </details>
  );
}
