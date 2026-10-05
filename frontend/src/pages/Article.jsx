import { Link, useParams } from 'react-router';
import Icon from '../components/Icon.jsx';
import { Auteur, BackLink, ErrorState, Loader } from '../components/ui.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { useApi } from '../lib/api.js';

// Indique si la description reprend simplement le début du texte (pour ne pas l'afficher deux fois).
function debutDuTexte(article) {
  const texte = new DOMParser().parseFromString(article.corpsHtml, 'text/html').body.textContent.replace(/\s+/g, ' ').trim();
  return texte.startsWith(article.description.replace(/…$/, '').trim());
}

// Lecteur d'article (corps HTML éditorial fourni par l'API).
export default function Article() {
  const { slug } = useParams();
  const { t } = useLang();
  const { data: article, error, loading, reload } = useApi(`/articles/${encodeURIComponent(slug)}`);

  return (
    <div className="container page">
      <BackLink fallback={article ? `/rubriques/${article.rubrique.slug}` : '/rubriques'} />
      {loading && <Loader />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {article && (
        <article className="article">
          <p className="article-meta">
            <Link to={`/rubriques/${article.rubrique.slug}`}>{article.rubrique.nom}</Link>
            {article.dureeLectureMin && <> · {t('commun.minutesLecture', { n: article.dureeLectureMin })}</>}
          </p>
          <h1 className="article-title">{article.titre}</h1>
          {article.description && !debutDuTexte(article) && <p className="article-lead">{article.description}</p>}
          <Auteur auteur={article.auteur} />
          <div className="article-body prose" dangerouslySetInnerHTML={{ __html: article.corpsHtml }} />

          <aside className="article-end">
            <p>{t('article.utile')}</p>
            <div className="btn-row">
              <Link to="/questions" className="btn btn-primary">
                <Icon name="message" size={16} />
                {t('nav.questions')}
              </Link>
              <Link to={`/rubriques/${article.rubrique.slug}?onglet=exercices`} className="btn btn-ghost">
                {t('article.voirExercices')}
              </Link>
            </div>
          </aside>
        </article>
      )}
    </div>
  );
}
