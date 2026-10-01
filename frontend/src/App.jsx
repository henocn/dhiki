import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout.jsx';
import Accueil from './pages/Accueil.jsx';
import APropos from './pages/APropos.jsx';
import Article from './pages/Article.jsx';
import Confidentialite from './pages/Confidentialite.jsx';
import Exercice from './pages/Exercice.jsx';
import FaireLePoint from './pages/faire-le-point/FaireLePoint.jsx';
import MentionsLegales from './pages/MentionsLegales.jsx';
import MesEcrits from './pages/MesEcrits.jsx';
import NotFound from './pages/NotFound.jsx';
import Questions from './pages/Questions.jsx';
import Rubrique from './pages/Rubrique.jsx';
import Rubriques from './pages/Rubriques.jsx';

// Déclare toutes les routes du site public ; chaque écran possède sa propre URL partageable.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Accueil />} />
        <Route path="rubriques" element={<Rubriques />} />
        <Route path="rubriques/:slug" element={<Rubrique />} />
        <Route path="articles/:slug" element={<Article />} />
        <Route path="exercices/:slug" element={<Exercice />} />
        <Route path="questions" element={<Questions />} />
        <Route path="faire-le-point" element={<FaireLePoint />} />
        <Route path="mes-ecrits" element={<MesEcrits />} />
        <Route path="a-propos" element={<APropos />} />
        <Route path="confidentialite" element={<Confidentialite />} />
        <Route path="mentions-legales" element={<MentionsLegales />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
