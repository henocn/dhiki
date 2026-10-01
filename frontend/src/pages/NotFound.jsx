import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { useLang } from '../i18n/LangContext.jsx';

// Page affichée pour toute URL inconnue.
export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="container page">
      <div className="state-box state-box--lg">
        <Icon name="compass" size={36} />
        <h1>{t('erreur.pageIntrouvable')}</h1>
        <p>{t('erreur.pageIntrouvableTexte')}</p>
        <Link to="/" className="btn btn-primary">
          {t('erreur.retourAccueil')}
        </Link>
      </div>
    </div>
  );
}
