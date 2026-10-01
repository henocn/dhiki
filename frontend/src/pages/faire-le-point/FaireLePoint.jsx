import { useState } from 'react';
import { Link } from 'react-router';
import Icon from '../../components/Icon.jsx';
import { RubriqueCard } from '../../components/ui.jsx';
import { useUrgence } from '../../components/urgence/UrgenceContext.jsx';
import { useLang } from '../../i18n/LangContext.jsx';
import { useApi } from '../../lib/api.js';
import { ACCUSES, CONTEXTES, EMOTIONS, MESSAGES } from './data.js';

const ETAPES = 5;
const ETAT_INITIAL = { emotion: null, intensite: 5, contextes: [], texte: '', aide: null };

// Parcours « Faire le point » en 5 étapes, entièrement local : aucune réponse n'est envoyée au serveur.
export default function FaireLePoint() {
  const { t } = useLang();
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState(ETAT_INITIAL);
  const [alerteEmotion, setAlerteEmotion] = useState(false);

  // Met à jour une réponse du parcours.
  const maj = (champ, valeur) => setReponses((r) => ({ ...r, [champ]: valeur }));

  // Passe à l'étape suivante (une émotion est obligatoire à la première étape).
  function suivant() {
    if (etape === 0 && !reponses.emotion) {
      setAlerteEmotion(true);
      return;
    }
    setEtape((e) => Math.min(e + 1, ETAPES - 1));
  }

  // Recommence le parcours depuis le début.
  function recommencer() {
    setReponses(ETAT_INITIAL);
    setEtape(0);
  }

  // Ajoute ou retire un contexte sélectionné.
  function basculerContexte(id) {
    maj('contextes', reponses.contextes.includes(id) ? reponses.contextes.filter((c) => c !== id) : [...reponses.contextes, id]);
  }

  return (
    <div className="container page page--narrow">
      <header className="page-head">
        <h1>{t('nav.flp')}</h1>
        <p className="lead-note">
          <Icon name="lock" size={15} />
          {t('flp.intro')}
        </p>
      </header>

      <div className="steps" aria-label={t('flp.progression', { n: etape + 1, total: ETAPES })}>
        {Array.from({ length: ETAPES }, (_, i) => (
          <span key={i} className={`step-dot ${i < etape ? 'is-done' : ''} ${i === etape ? 'is-current' : ''}`} />
        ))}
      </div>

      <Accuse etape={etape} reponses={reponses} />

      {etape === 0 && (
        <section>
          <h2 className="flp-q">{t('flp.q.emotion')}</h2>
          <div className={`emo-grid ${alerteEmotion ? 'is-alert' : ''}`} role="radiogroup" aria-label={t('flp.q.emotion')}>
            {EMOTIONS.map((e) => (
              <button
                key={e.id}
                type="button"
                role="radio"
                aria-checked={reponses.emotion === e.id}
                className={`emo-btn ${reponses.emotion === e.id ? 'is-selected' : ''}`}
                onClick={() => {
                  maj('emotion', e.id);
                  setAlerteEmotion(false);
                  setTimeout(() => setEtape(1), 220);
                }}
              >
                <Icon name={e.icone} size={34} strokeWidth={1.5} />
                <span>{t(`flp.emo.${e.id}`)}</span>
              </button>
            ))}
          </div>
          {alerteEmotion && <p className="form-error">{t('flp.choisisEmotion')}</p>}
        </section>
      )}

      {etape === 1 && (
        <section>
          <h2 className="flp-q">{t('flp.q.intensite')}</h2>
          <div className="range-labels">
            <span>{t('flp.legerement')}</span>
            <span>{t('flp.beaucoup')}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={reponses.intensite}
            onChange={(e) => maj('intensite', Number(e.target.value))}
            aria-label={t('flp.q.intensite')}
            style={{ '--val': `${((reponses.intensite - 1) / 9) * 100}%` }}
          />
          <div className="range-value">{reponses.intensite} / 10</div>
        </section>
      )}

      {etape === 2 && (
        <section>
          <h2 className="flp-q">{t('flp.q.contexte')}</h2>
          <div className="chips">
            {CONTEXTES.map((c) => (
              <button key={c} type="button" aria-pressed={reponses.contextes.includes(c)} className={`chip ${reponses.contextes.includes(c) ? 'is-selected' : ''}`} onClick={() => basculerContexte(c)}>
                {t(`flp.ctx.${c}`)}
              </button>
            ))}
          </div>
        </section>
      )}

      {etape === 3 && (
        <section>
          <h2 className="flp-q">{t('flp.q.texte')}</h2>
          <textarea className="textarea" rows={4} value={reponses.texte} onChange={(e) => maj('texte', e.target.value)} placeholder={t('flp.textePlaceholder')} />
          <h2 className="flp-q">{t('flp.q.aide')}</h2>
          <div className="yn-row" role="radiogroup" aria-label={t('flp.q.aide')}>
            {['oui', 'non', 'sais'].map((v) => (
              <button key={v} type="button" role="radio" aria-checked={reponses.aide === v} className={`chip chip--block ${reponses.aide === v ? 'is-selected' : ''}`} onClick={() => maj('aide', v)}>
                {t(`flp.aide.${v}`)}
              </button>
            ))}
          </div>
        </section>
      )}

      {etape === 4 && <Resultat reponses={reponses} />}

      <div className={`flp-nav ${etape === 0 ? 'is-hidden' : ''}`}>
        {etape > 0 && etape < ETAPES - 1 && (
          <button type="button" className="btn btn-ghost" onClick={() => setEtape((e) => e - 1)}>
            <Icon name="arrowLeft" size={16} />
            {t('commun.precedent')}
          </button>
        )}
        {etape < ETAPES - 1 ? (
          <button type="button" className="btn btn-primary" onClick={suivant}>
            {etape === ETAPES - 2 ? t('flp.voirResultat') : t('commun.continuer')}
            <Icon name="arrowRight" size={16} />
          </button>
        ) : (
          <>
            <button type="button" className="btn btn-ghost" onClick={recommencer}>
              <Icon name="refresh" size={16} />
              {t('commun.recommencer')}
            </button>
            <Link to="/questions" className="btn btn-primary">
              {t('nav.questions')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// Message d'accueil bienveillant affiché au-dessus des étapes 2 à 4.
function Accuse({ etape, reponses }) {
  const { t } = useLang();
  let message = null;
  if (etape === 1 && reponses.emotion) message = ACCUSES[reponses.emotion];
  if (etape === 2) {
    const emotion = t(`flp.emo.${reponses.emotion}`).toLowerCase();
    if (reponses.intensite <= 3) message = t('flp.ackFaible', { emotion });
    else if (reponses.intensite <= 6) message = t('flp.ackModere', { emotion, n: reponses.intensite });
    else message = t('flp.ackFort', { n: reponses.intensite });
  }
  if (etape === 3) {
    message = reponses.contextes.length
      ? t('flp.ackContexte', { liste: reponses.contextes.map((c) => t(`flp.ctx.${c}`)).join(', ') })
      : t('flp.ackSansContexte');
  }
  if (!message) return null;
  return (
    <p key={etape} className="flp-ack">
      {message}
    </p>
  );
}

// Résultat final : message adapté à l'intensité, rubriques suggérées et orientation vers l'aide si demandée.
function Resultat({ reponses }) {
  const { t } = useLang();
  const { ouvrirUrgence } = useUrgence();
  const { data: rubriques } = useApi('/rubriques');
  const emotion = EMOTIONS.find((e) => e.id === reponses.emotion);
  const niveau = reponses.intensite <= 3 ? 0 : reponses.intensite <= 6 ? 1 : 2;
  const suggestions = (rubriques ?? []).filter((r) => emotion.rubriques.includes(r.slug));
  const besoinAide = reponses.aide === 'oui' || reponses.aide === 'sais';
  const signalFort = emotion.negative && reponses.intensite >= 8;

  return (
    <section className="flp-result">
      <p className="flp-result-lead">
        <Icon name="sparkles" size={16} />
        {t('flp.resultatLead')}
      </p>
      <h2>
        <Icon name={emotion.icone} size={28} strokeWidth={1.6} />
        {t('flp.tuTeSens', { emotion: t(`flp.emo.${emotion.id}`).toLowerCase() })}
      </h2>
      <p className="muted small">{t('flp.intensiteResultat', { n: reponses.intensite })}</p>
      <p>{MESSAGES[emotion.id][niveau]}</p>

      {(besoinAide || signalFort) && (
        <div className="help-box">
          <Icon name="shieldCheck" size={22} />
          <div>
            <strong>{t('flp.aideTitre')}</strong>
            <p>{t('flp.aideTexte')}</p>
            <div className="btn-row">
              <Link to="/questions" className="btn btn-primary btn-sm">
                {t('nav.questions')}
              </Link>
              <button type="button" className="btn btn-urgence-outline btn-sm" onClick={ouvrirUrgence}>
                <Icon name="lifebuoy" size={15} />
                {t('urgence.besoinAide')}
              </button>
            </div>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <>
          <h3 className="flp-sugg-title">{t('flp.suggestions')}</h3>
          <div className="rub-grid rub-grid--2">
            {suggestions.map((r) => (
              <RubriqueCard key={r.slug} rubrique={r} />
            ))}
          </div>
        </>
      )}
      <p className="muted small flp-disclaimer">{t('flp.disclaimer')}</p>
    </section>
  );
}
