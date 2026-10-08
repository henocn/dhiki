import { ErrorState, Loader, RubriqueCard } from '../components/ui.jsx';
import { useApi } from '../lib/api.js';

// Liste de toutes les rubriques publiées.
export default function Rubriques() {
  const { data, error, loading, reload } = useApi('/rubriques');

  return (
    <div className="container page">
      <header className="page-head">
        <h1>Rubriques</h1>
        <p>Articles, exercices et témoignages par thème.</p>
      </header>
      {loading && <Loader />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (
        <div className="rub-grid">
          {data.map((r) => (
            <RubriqueCard key={r.slug} rubrique={r} />
          ))}
        </div>
      )}
    </div>
  );
}
