import { useState } from 'react';
import { Link } from 'react-router';
import Icon from '../../components/Icon.jsx';
import { RubriqueCard } from '../../components/ui.jsx';
import { useUrgence } from '../../components/urgence/UrgenceContext.jsx';
import { useApi } from '../../lib/api.js';
import { ACCUSES, CONTEXTES, EMOTIONS, GROUPES_EMOTIONS, MESSAGES, REPONSES_AIDE } from './data.js';

const QUESTIONS = 4;
const BILAN = QUESTIONS + 1;
const ETAT_INITIAL = { emotion: null, intensite: 5, contextes: [], texte: '', aide: null };

const FLP = 'relative min-h-[calc(100svh-72px)] mx-auto pt-[clamp(24px,5vh,48px)] px-5 pb-16 text-center';
const BTN =
  'inline-flex items-center justify-center gap-2.5 px-[34px] py-[15px] rounded-none font-medium text-[1.05rem] no-underline cursor-pointer [transition:background_0.2s,transform_0.2s] hover:[transform:translateY(-2px)] focus-visible:outline-3 focus-visible:outline-tcl focus-visible:outline-offset-3';
const BTN_PRINCIPAL = `${BTN} border-0 bg-tc text-white hover:bg-tc-dark hover:text-white`;
const BTN_URGENCE = `${BTN} border border-[rgba(247,240,230,0.5)] bg-transparent text-white hover:bg-white hover:text-coal`;
const QUESTION = 'mx-auto max-w-[980px] font-title font-semibold text-[clamp(1.9rem,4vw,2.7rem)] leading-[1.12] text-coal';
const QUESTION_ETAPE = `${QUESTION} mb-[34px] max-[640px]:mb-[26px]`;
const EM = 'text-tc italic';
const CONTEXTE = 'py-3 px-[22px] border border-bd rounded-none font-medium cursor-pointer [transition:border-color_0.2s,background_0.2s,color_0.2s]';
const CONTEXTE_ETAT = {
  normal: 'bg-white text-coal hover:border-tc',
  choisi: 'border-coal bg-coal text-white',
};
const CHOIX_LIGNE = 'flex flex-wrap justify-center gap-2.5 max-w-[620px] mx-auto';
const LARGEUR_BILAN = 'max-w-[760px] mx-auto';

// Renvoie le libellé français d'une émotion à partir de son identifiant.
function libelleEmotion(id) {
  return EMOTIONS.find((e) => e.id === id)?.libelle ?? '';
}

// Traduit une intensité de 1 à 10 en un mot simple.
function motIntensite(valeur) {
  if (valeur <= 3) return 'Un peu';
  if (valeur <= 6) return 'Assez';
  if (valeur <= 8) return 'Beaucoup';
  return 'Énormément';
}

// Parcours « Faire le point » : accueil, 4 questions puis bilan. Tout reste sur l'appareil, rien n'est envoyé.
export default function FaireLePoint() {
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState(ETAT_INITIAL);

  // Met à jour une réponse du parcours.
  const maj = (champ, valeur) => setReponses((r) => ({ ...r, [champ]: valeur }));

  // Passe à l'étape suivante.
  const suivant = () => setEtape((e) => Math.min(e + 1, BILAN));

  // Recommence le parcours depuis l'accueil.
  function recommencer() {
    setReponses(ETAT_INITIAL);
    setEtape(0);
  }

  // Ajoute ou retire un contexte sélectionné.
  function basculerContexte(id) {
    maj('contextes', reponses.contextes.includes(id) ? reponses.contextes.filter((c) => c !== id) : [...reponses.contextes, id]);
  }

  if (etape === 0) return <Accueil onCommencer={suivant} />;

  return (
    <div className={`${FLP} max-w-[980px]`}>
      <section key={etape} className="pt-[clamp(16px,5vh,48px)] animate-entree motion-reduce:animate-none">
        <Accuse etape={etape} reponses={reponses} />

        {etape === 1 && (
          <>
            <h1 className={QUESTION_ETAPE}>
              Comment te <span style={{ whiteSpace: 'nowrap' }}>sens-tu,</span> là, maintenant ?
            </h1>
            <div className="grid grid-cols-3 gap-6 max-w-[900px] mx-auto text-left max-[700px]:grid-cols-1 max-[700px]:gap-5" role="radiogroup" aria-label="Comment te sens-tu ?">
              {GROUPES_EMOTIONS.map((g) => (
                <div key={g.id}>
                  <p className="mb-2.5 text-ts font-medium text-[0.78rem] tracking-[0.1em] uppercase max-[700px]:text-center">{g.libelle}</p>
                  <div className="flex flex-col gap-2.5 max-[700px]:grid max-[700px]:grid-cols-2">
                    {EMOTIONS.filter((e) => e.groupe === g.id).map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        role="radio"
                        aria-checked={reponses.emotion === e.id}
                        className={`group flex items-center gap-3.5 py-3.5 px-[18px] border rounded-none font-medium text-left cursor-pointer [transition:border-color_0.2s,background_0.2s,color_0.2s,transform_0.2s] hover:border-tc hover:[transform:translateX(3px)] max-[700px]:px-3 ${reponses.emotion === e.id ? 'border-tc bg-tc text-white' : 'border-bd bg-white text-coal'}`}
                        onClick={() => {
                          maj('emotion', e.id);
                          setTimeout(suivant, 260);
                        }}
                      >
                        <Icon
                          name={e.icone}
                          size={28}
                          strokeWidth={1.5}
                          className={`shrink-0 [transition:color_0.2s,transform_0.3s] group-hover:[transform:scale(1.1)] ${reponses.emotion === e.id ? 'text-white' : 'text-tc'}`}
                        />
                        <span>{e.libelle}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {etape === 2 && (
          <>
            <h1 className={QUESTION_ETAPE}>À quel point ?</h1>
            <div className="max-w-[520px] mx-auto mb-9">
              <p className="text-tc font-medium text-[0.85rem] tracking-[0.1em] uppercase">{motIntensite(reponses.intensite)}</p>
              <p className="mb-[18px] font-title font-semibold text-[5rem] leading-none text-coal max-[640px]:text-[4rem]">
                {reponses.intensite}
                <small className="text-ts font-medium text-[1.4rem]"> / 10</small>
              </p>
              <input
                type="range"
                className="w-full"
                min={1}
                max={10}
                value={reponses.intensite}
                onChange={(e) => maj('intensite', Number(e.target.value))}
                aria-label="Intensité de 1 à 10"
                style={{ '--val': `${((reponses.intensite - 1) / 9) * 100}%` }}
              />
              <div className="flex justify-between mt-2.5 text-ts text-[0.85rem]">
                <span>Légèrement</span>
                <span>Énormément</span>
              </div>
            </div>
            <BoutonSuivant onClick={suivant} />
          </>
        )}

        {etape === 3 && (
          <>
            <h1 className={QUESTION_ETAPE}>Qu’est-ce qui pèse le plus ?</h1>
            <p className="-mt-[22px] mb-[26px] text-ts">Choisis tout ce qui te parle.</p>
            <div className={`${CHOIX_LIGNE} mb-[38px]`}>
              {Object.keys(CONTEXTES).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={reponses.contextes.includes(c)}
                  className={`${CONTEXTE} ${reponses.contextes.includes(c) ? CONTEXTE_ETAT.choisi : CONTEXTE_ETAT.normal}`}
                  onClick={() => basculerContexte(c)}
                >
                  {CONTEXTES[c]}
                </button>
              ))}
            </div>
            <BoutonSuivant onClick={suivant} />
          </>
        )}

        {etape === 4 && (
          <>
            <h1 className={QUESTION_ETAPE}>Aimerais-tu en parler à quelqu’un ?</h1>
            <div className={`${CHOIX_LIGNE} mb-[26px]`} role="radiogroup" aria-label="Aimerais-tu en parler à quelqu’un ?">
              {Object.keys(REPONSES_AIDE).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={reponses.aide === v}
                  className={`${CONTEXTE} min-w-[130px] ${reponses.aide === v ? CONTEXTE_ETAT.choisi : CONTEXTE_ETAT.normal}`}
                  onClick={() => maj('aide', v)}
                >
                  {REPONSES_AIDE[v]}
                </button>
              ))}
            </div>
            <textarea
              className="block w-full max-w-[560px] mx-auto mb-8 px-4 py-3.5 border border-bd rounded-none bg-white text-coal leading-[1.55] resize-y focus:border-tc focus:outline-none focus:shadow-[0_0_0_3px_rgba(194,98,63,0.12)]"
              rows={3}
              value={reponses.texte}
              onChange={(e) => maj('texte', e.target.value)}
              placeholder="Si tu veux, écris ce que tu as sur le cœur. Ça reste sur ton appareil."
            />
            <BoutonSuivant onClick={suivant} libelle="Voir mon bilan" />
          </>
        )}

        {etape === BILAN && <Bilan reponses={reponses} onRecommencer={recommencer} />}
      </section>
    </div>
  );
}

// Écran d'accueil du parcours, avec un cercle qui respire lentement.
function Accueil({ onCommencer }) {
  return (
    <div className={`${FLP} pleine-page flex items-center justify-center overflow-hidden`}>
      <img src="/images/faire-le-point.jpg" alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover object-[20%_30%] opacity-20" />
      <div className="relative max-w-[1000px]">
        <h1 className="mb-5 font-title font-semibold text-[clamp(2.6rem,6vw,4.2rem)] leading-[1.04] text-coal">
          Prends une minute <em className={EM}>pour toi.</em>
        </h1>
        <figure className="max-w-[760px] mx-auto mb-8">
          <blockquote className="font-title italic text-[clamp(1.08rem,2.2vw,1.25rem)] leading-[1.6] text-coal text-pretty">
            « Entre ce qui nous arrive et la façon dont nous y répondons, il existe un espace. Dans cet espace se trouvent notre liberté et notre force. Prendre une minute pour écouter
            ce que l’on ressent, c’est agrandir cet espace, doucement, à son rythme. »
          </blockquote>
          <figcaption className="mt-3 text-tc font-medium text-[0.8rem] tracking-[0.12em] uppercase">D’après Viktor Frankl, psychiatre</figcaption>
        </figure>
        <button type="button" className={BTN_PRINCIPAL} onClick={onCommencer}>
          Commencer
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </div>
  );
}

// Bouton « Continuer » centré sous une question.
function BoutonSuivant({ onClick, libelle = 'Continuer' }) {
  return (
    <button type="button" className={BTN_PRINCIPAL} onClick={onClick}>
      {libelle}
      <Icon name="arrowRight" size={18} />
    </button>
  );
}

// Phrase bienveillante qui rebondit sur la réponse précédente, au-dessus de la question.
function Accuse({ etape, reponses }) {
  let message = null;
  if (etape === 2 && reponses.emotion) message = ACCUSES[reponses.emotion];
  if (etape === 3) {
    if (reponses.intensite <= 3) message = 'Merci de prendre ce moment pour toi.';
    else if (reponses.intensite <= 6) message = 'C’est important de le reconnaître.';
    else message = 'C’est intense. Tu as bien fait de venir ici.';
  }
  if (etape === 4) {
    message = reponses.contextes.length && !reponses.contextes.includes('inconnu') ? 'Ce sont des choses qui pèsent. C’est normal d’en être touché·e.' : 'Pas facile de savoir d’où ça vient, et c’est normal.';
  }
  if (!message) return null;
  return <p className="max-w-[900px] mx-auto mb-3.5 text-tc font-title italic text-[1.12rem] leading-[1.5]">{message}</p>;
}

// Bilan final : message adapté, orientation vers l'aide si besoin, rubriques suggérées.
function Bilan({ reponses, onRecommencer }) {
  const { ouvrirUrgence } = useUrgence();
  const { data: rubriques } = useApi('/rubriques');
  const emotion = EMOTIONS.find((e) => e.id === reponses.emotion);
  const niveau = reponses.intensite <= 3 ? 0 : reponses.intensite <= 6 ? 1 : 2;
  const suggestions = (rubriques ?? []).filter((r) => emotion.rubriques.includes(r.slug));
  const besoinAide = reponses.aide === 'oui' || reponses.aide === 'sais' || emotion.id === 'sansEspoir' || (emotion.negative && reponses.intensite >= 8);

  return (
    <div className="pt-[clamp(8px,3vh,32px)]">
      <Icon name={emotion.icone} size={44} strokeWidth={1.3} className="block mx-auto mb-3.5 text-tc" />
      <h1 className={`${QUESTION} mb-5`}>
        Tu te sens {libelleEmotion(emotion.id).toLowerCase()}, <em className={EM}>{`${reponses.intensite} sur 10.`}</em>
      </h1>
      <p className="max-w-[820px] mx-auto mb-10 text-coal text-[1.15rem] leading-[1.7]">{MESSAGES[emotion.id][niveau]}</p>

      {besoinAide && (
        <div className={`${LARGEUR_BILAN} mb-12 py-[30px] px-7 bg-coal text-cr`}>
          <p className="max-w-[820px] mx-auto mb-5 leading-[1.6]">
            <strong className="text-white">Tu n’as pas à porter ça seul·e.</strong> Un·e professionnel·le peut t’écouter, sans connaître ton nom.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/questions" className={BTN_PRINCIPAL}>
              Poser une question
            </Link>
            <button type="button" className={BTN_URGENCE} onClick={ouvrirUrgence}>
              <Icon name="lifebuoy" size={17} />
              Besoin d’aide maintenant
            </button>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className={`${LARGEUR_BILAN} mb-9 text-left`}>
          <h2 className="mb-[18px] font-title font-semibold text-[1.4rem] text-center">Pour aller plus loin</h2>
          <div className="rub-grid rub-grid--2">
            {suggestions.map((r) => (
              <RubriqueCard key={r.slug} rubrique={r} />
            ))}
          </div>
        </div>
      )}

      <button type="button" className="inline-flex items-center gap-2 py-2 border-b border-current text-coal font-medium cursor-pointer" onClick={onRecommencer}>
        <Icon name="refresh" size={15} />
        Refaire le point
      </button>
      <p className="mt-[18px] text-ts text-[0.85rem]">Ce bilan n’est pas un diagnostic, il sert seulement à t’orienter.</p>
    </div>
  );
}
