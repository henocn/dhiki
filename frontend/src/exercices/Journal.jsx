import { useState } from 'react';
import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { sauvegarderEcrit } from '../lib/ecrits.js';
import { exporterEnPdf } from '../lib/pdf.js';
import { ExoHeader, Fin, Progression } from './commun.jsx';

// Journal guidé (gratitude, émotions, relations) : une question par écran, sauvegarde locale à la fin.
export default function Journal({ exercice }) {
  const { t } = useLang();
  const { questions, sousTitre } = exercice.config;
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState(() => questions.map(() => ''));
  const [sauvegarde, setSauvegarde] = useState(null);

  const texteComplet = questions.map((q, i) => `${q.question}\n${reponses[i] || '—'}`).join('\n\n');

  // Passe à la question suivante ; à la dernière, enregistre l'écrit sur l'appareil.
  function suivant() {
    if (etape === questions.length - 1) setSauvegarde(sauvegarderEcrit(exercice.titre, texteComplet));
    setEtape((e) => e + 1);
  }

  // Remet le journal à zéro.
  function recommencer() {
    setReponses(questions.map(() => ''));
    setSauvegarde(null);
    setEtape(0);
  }

  if (etape >= questions.length) {
    return (
      <Fin
        titre={t('exo.bienJoue')}
        texte={t('exo.journalFin')}
        actions={
          <>
            <Link to="/mes-ecrits" className="btn btn-ghost">
              <Icon name="pen" size={16} />
              {t('nav.ecrits')}
            </Link>
            <button type="button" className="btn btn-ghost" onClick={() => exporterEnPdf(exercice.titre, texteComplet)}>
              <Icon name="file" size={16} />
              {t('ecrits.exporter')}
            </button>
            <button type="button" className="btn btn-primary" onClick={recommencer}>
              {t('commun.recommencer')}
            </button>
          </>
        }
      >
        <ul className="answer-list">
          {questions.map((q, i) => (
            <li key={i}>
              <span>{q.question}</span>
              <p>{reponses[i] || '—'}</p>
            </li>
          ))}
        </ul>
        <p className={sauvegarde ? 'hint-box' : 'warn-box'}>
          <Icon name={sauvegarde ? 'lock' : 'alert'} size={16} />
          {sauvegarde ? t('exo.sauvegarde') : t('exo.sauvegardeEchec')}
        </p>
      </Fin>
    );
  }

  const q = questions[etape];
  return (
    <div className="exo-narrow">
      <ExoHeader titre={exercice.titre} sousTitre={sousTitre} etape={`${etape + 1} / ${questions.length}`} />
      <Progression total={questions.length} courant={etape} />
      <label className="exo-panel field">
        <span className="exo-question">{q.question}</span>
        <textarea
          rows={5}
          value={reponses[etape]}
          placeholder={q.indication}
          onChange={(e) => setReponses((r) => r.map((v, i) => (i === etape ? e.target.value : v)))}
        />
      </label>
      <div className="btn-row btn-row--center">
        {etape > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => setEtape((e) => e - 1)}>
            <Icon name="arrowLeft" size={16} />
            {t('commun.precedent')}
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={suivant}>
          {etape === questions.length - 1 ? t('commun.terminer') : t('commun.suivant')}
          <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}
