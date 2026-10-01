import { useParams } from 'react-router';
import { BackLink, ErrorState, Loader } from '../components/ui.jsx';
import Ancrage from '../exercices/Ancrage.jsx';
import Ecriture from '../exercices/Ecriture.jsx';
import Journal from '../exercices/Journal.jsx';
import Pomodoro from '../exercices/Pomodoro.jsx';
import { EcouteActive, PoserLimites } from '../exercices/Quiz.jsx';
import Respiration from '../exercices/Respiration.jsx';
import Scan from '../exercices/Scan.jsx';
import Valeurs from '../exercices/Valeurs.jsx';
import { useApi } from '../lib/api.js';

const COMPOSANTS = {
  respiration: Respiration,
  journal: Journal,
  ancrage: Ancrage,
  scan: Scan,
  valeurs: Valeurs,
  ecriture: Ecriture,
  ecoute: EcouteActive,
  limites: PoserLimites,
  pomodoro: Pomodoro,
};

// Page d'un exercice : charge sa définition depuis l'API puis affiche le composant correspondant à son type.
export default function Exercice() {
  const { slug } = useParams();
  const { data: exercice, error, loading, reload } = useApi(`/exercices/${encodeURIComponent(slug)}`);
  const Composant = exercice ? COMPOSANTS[exercice.type] : null;

  return (
    <div className="container page">
      <BackLink fallback={exercice?.rubrique ? `/rubriques/${exercice.rubrique.slug}?onglet=exercices` : '/rubriques'} />
      {loading && <Loader />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {Composant && (
        <div className="exo-player">
          <Composant key={exercice.slug} exercice={exercice} />
        </div>
      )}
    </div>
  );
}
