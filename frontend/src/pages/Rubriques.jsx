import { ErrorState, Loader, RubriqueCard } from '../components/ui.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { useApi } from '../lib/api.js';

// Liste de toutes les rubriques publiées.
export default function Rubriques() {
  const { t } = useLang();
  const { data, error, loading, reload } = useApi('/rubriques');

  return (
    <div className="container page">
      <header className="page-head">
        <h1>{t('rubriques.titre')}</h1>
        <p>{t('rubriques.intro')}</p>
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
