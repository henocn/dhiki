import { useState } from 'react';
import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { sauvegarderEcrit } from '../lib/ecrits.js';
import { exporterEnPdf } from '../lib/pdf.js';
import { ExoHeader, Fin, Progression } from './commun.jsx';

// Journal guidé (gratitude, émotions, relations) : une question par écran, sauvegarde locale à la fin.
export default function Journal({ exercice }) {
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
        titre="Bien joué. Prends un instant pour remarquer comment tu te sens maintenant."
        texte="Voici ce que tu as écrit. Tu peux le garder dans « Mes écrits »."
        actions={
          <>
            <Link to="/mes-ecrits" className="btn btn-ghost">
              <Icon name="pen" size={16} />
              Mes écrits
            </Link>
            <button type="button" className="btn btn-ghost" onClick={() => exporterEnPdf(exercice.titre, texteComplet)}>
              <Icon name="file" size={16} />
              Exporter en PDF
            </button>
            <button type="button" className="btn btn-primary" onClick={recommencer}>
              Recommencer
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
          {sauvegarde ? 'Sauvegarder dans Mes écrits' : 'Sauvegarde impossible : la limite est atteinte ou le stockage est indisponible.'}
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
            Précédent
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={suivant}>
          {etape === questions.length - 1 ? 'Terminer' : 'Suivant'}
          <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}
