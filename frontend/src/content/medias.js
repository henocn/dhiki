/*
 * Médias du site (photos et sons). Déposer les fichiers dans frontend/public/ aux chemins indiqués.
 * Tant qu'un fichier est absent, un fond neutre s'affiche à la place : le site reste propre.
 * Photos : JPG ou WebP, < 300 Ko, personnes ayant signé une autorisation de droit à l'image.
 */
export const MEDIAS = {
  accueilHero: {
    src: '/images/accueil-hero.png',
    alt: 'Un groupe de jeunes femmes assises en cercle, souriantes et enlacées',
  },
  accueilEcoute: {
    src: '/images/accueil-avancer.png',
    alt: 'Une jeune femme sourit, les yeux fermés, au soleil sur un banc',
    position: '35% center',
  },
  accueilEquipe: {
    src: '/images/accueil-consultation.png',
    alt: 'Un psychologue écoute un jeune homme lors d’une consultation',
  },
  respirationAmbiance: {
    src: '/audio/respiration-ambiance.mp3',
  },
};
