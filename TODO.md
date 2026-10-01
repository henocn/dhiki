# TODO — DHIKI

Ce document organise le travail par étapes. Les cases de la phase 0 doivent être validées avant de commencer l'implémentation.

## Phase 0 — Validation produit et sécurité

- [ ] Valider le résumé produit et le périmètre MVP du `README.md`.
- [ ] Confirmer le public cible et les pays couverts au lancement.
- [ ] Confirmer les langues du MVP : français et/ou éwé.
- [ ] Définir qui peut être présenté comme « professionnel » sur la plateforme.
- [ ] Confirmer la capacité opérationnelle à répondre sous 48 heures.
- [ ] Choisir le parcours des questions confidentielles sans compte : code secret, lien temporaire ou autre solution.
- [ ] Définir la politique concernant les mineurs, le consentement et le signalement d'un danger immédiat.
- [ ] Faire vérifier tous les contacts et numéros d'urgence locaux.
- [ ] Faire valider les contenus de santé mentale et les messages de recommandation par un professionnel qualifié.
- [ ] Décider si les témoignages du prototype sont réels, fictifs ou à remplacer.
- [ ] Définir les durées de conservation, l'export et la suppression des données.
- [ ] Choisir les environnements et l'hébergement : développement, préproduction et production.

## Phase 1 — Initialisation des applications

- [ ] Initialiser `frontend/` avec React.js et Vite en JavaScript.
- [ ] Initialiser `backoffice/` avec React.js et Vite en JavaScript.
- [x] Initialiser `backend/` avec Node.js et Express en JavaScript.
- [x] Choisir et uniformiser les modules JavaScript (`type: module`).
- [ ] Ajouter ESLint, Prettier et les scripts communs.
- [x] Ajouter la validation des variables d'environnement au démarrage du backend (zod).
- [x] Configurer CORS uniquement pour les origines autorisées.
- [x] Ajouter un endpoint de santé ne révélant aucune information sensible (`GET /api/sante`).

## Phase 2 — Base PostgreSQL

- [x] Configurer le pool `pg` avec `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` et `PGSSL`.
- [x] Choisir un outil de migrations : runner SQL maison (`npm run db:migrate`, table `schema_migrations`).
- [x] Concevoir le schéma initial (`001_schema_initial.sql`).
- [x] Créer les tables de rubriques, articles, exercices et témoignages.
- [ ] Ajouter les traductions (français/éwé) et les médias (audios des exercices) une fois la décision de langue prise.
- [x] Créer les tables de questions publiques et confidentielles sans mélanger leurs accès (deux tables distinctes).
- [x] Créer les colonnes de réponses, statuts, attributions et modération.
- [x] Créer la table d'utilisateurs backoffice avec rôles (admin, éditeur, modérateur, professionnel).
- [x] Créer la table de contacts d'urgence par pays.
- [x] Créer une table d'audit sans contenu confidentiel en clair.
- [x] Ajouter les index, contraintes et dates.
- [ ] Planifier la purge des questions confidentielles expirées (`expire_le`, 90 jours par défaut, à valider).
- [x] Préparer un jeu de données de développement extrait du prototype (`npm run db:seed`).
- [ ] Déplacer en base le contenu des exercices encore codé en dur dans le prototype (ancrage, scan, valeurs, écoute active, limites).

## Phase 3 — Backend/API

- [x] Définir la convention des routes et le format des réponses d'erreur.
- [x] Implémenter la lecture des rubriques, articles et exercices publiés.
- [x] Garder « Faire le point » côté navigateur (aucune donnée envoyée) ; règles à faire valider par un professionnel.
- [x] Implémenter l'envoi (avec modération préalable) et la consultation des questions publiques.
- [x] Implémenter un canal confidentiel par code de suivi (proposition à valider en phase 0).
- [ ] Implémenter l'authentification du backoffice.
- [ ] Implémenter les rôles administrateur, éditeur, modérateur et professionnel.
- [ ] Implémenter la gestion éditoriale et le workflow brouillon/relecture/publication.
- [ ] Implémenter l'attribution et la réponse aux questions.
- [ ] Implémenter la gestion des ressources d'urgence.
- [ ] Ajouter validation, assainissement, limitation de débit et protections anti-abus.
- [ ] Ajouter des journaux techniques excluant les textes sensibles.
- [ ] Ajouter les tests unitaires et d'intégration.

## Phase 4 — Frontend public

- [ ] Extraire les couleurs, typographies et composants visuels du prototype.
- [ ] Construire la navigation responsive et accessible.
- [ ] Construire l'accueil, les rubriques et le lecteur d'article.
- [ ] Recréer les exercices guidés du prototype.
- [ ] Construire le parcours « Faire le point » avec messages de prudence appropriés.
- [ ] Construire les questions publiques et confidentielles.
- [ ] Conserver les écrits personnels localement par défaut.
- [ ] Ajouter le sélecteur de langue et le système de traduction.
- [ ] Rendre le bouton d'aide immédiate disponible partout.
- [ ] Prévoir les connexions lentes et une expérience mobile prioritaire.
- [ ] Vérifier clavier, lecteur d'écran, contrastes et tailles de texte.
- [ ] Ajouter les tests de composants et de parcours critiques.

### Corrections à reporter depuis le prototype `dhiki-v2_3.html`

- [ ] « Faire le point » : le résultat est calculé en passant de l'étape 2 à 3, donc avant la réponse « besoin d'aide » ; le bloc « Consulter un professionnel » ne s'affiche jamais.
- [ ] Urgence : « Commencer maintenant » lance la respiration dans un écran masqué (`showScreen('s-exo')` n'est pas appelé quand `isUrgence` est vrai).
- [ ] Minuteurs (respiration, scan, Pomodoro) qui continuent de tourner après le bouton « ← Retour ».
- [ ] Bouton « À propos » : le texte reste blanc (invisible) après avoir quitté la page ; la page est en dehors de `<main>` (marges différentes).
- [ ] Failles XSS : questions, réponses de journal et d'ancrage injectées sans échappement dans `innerHTML` ; export PDF construit dans un attribut `onclick`.
- [ ] Animation de respiration aux durées fixes (4 s / 4 s / 6 s) désynchronisée des phases réelles (ex. 4-7-8).
- [ ] Fichiers audio `audio/respiration.mp3` et `audio/ancrage-sensoriel.mp3` absents ; un seul audio pour toutes les respirations.
- [ ] Compteurs codés en dur sur l'accueil (« 8 thèmes », « Relations : 1 exercice » alors qu'il y en a 3) : les calculer via l'API.
- [ ] Question publique : affichée immédiatement sans modération et sans champ pseudo ; question anonyme jamais transmise ni consultable.
- [ ] Historique de navigation dupliqué quand un exercice se relance lui-même (plusieurs « Retour » nécessaires).
- [ ] Animation `shake` utilisée dans « Clarifier tes valeurs » mais jamais définie.
- [ ] Aucun menu sur mobile (la navigation est masquée sous 640 px).
- [ ] Écrits limités à 30 : le plus ancien est supprimé sans avertissement.
- [ ] L'accueil annonce « en français et en éwé » alors que seul le français existe.
- [ ] Numéro du CPASE fictif (`+22890000000`) : ne rien afficher tant qu'un contact n'est pas vérifié.

## Phase 5 — Backoffice

- [ ] Construire la connexion et la gestion de session.
- [ ] Construire le tableau de bord.
- [ ] Construire l'éditeur de rubriques, articles, exercices et traductions.
- [ ] Construire le workflow de validation et publication.
- [ ] Construire la file des questions avec filtres, statuts et priorités.
- [ ] Construire l'attribution aux professionnels et l'éditeur de réponse.
- [ ] Construire les outils de modération et de signalement.
- [ ] Construire la gestion des contacts d'urgence.
- [ ] Construire la gestion des membres, rôles et habilitations.
- [ ] Construire la consultation des traces d'audit selon les permissions.
- [ ] Ajouter les tests des permissions et des parcours sensibles.

## Phase 6 — Qualité, conformité et mise en ligne

- [ ] Réaliser une revue de sécurité et corriger les risques identifiés.
- [ ] Réaliser une revue clinique/éditoriale avec des professionnels qualifiés.
- [ ] Rédiger mentions légales, confidentialité, conditions d'utilisation et avertissements.
- [ ] Mettre en place sauvegardes, restauration et surveillance.
- [ ] Configurer HTTPS, en-têtes de sécurité et gestion des secrets.
- [ ] Tester la suppression et l'expiration des données.
- [ ] Tester le parcours de crise avec l'équipe responsable.
- [ ] Réaliser des tests utilisateurs avec le public cible.
- [ ] Préparer le déploiement de préproduction.
- [ ] Valider avant le passage en production.

## Hors MVP proposé

- [ ] Comptes publics et synchronisation des journaux.
- [ ] Application mobile native.
- [ ] Chat en temps réel.
- [ ] Téléconsultation ou prise de rendez-vous.
- [ ] Notifications push.
- [ ] Personnalisation avancée ou recommandations automatisées.
- [ ] Extension à de nouvelles langues et de nouveaux pays.

Ces éléments restent hors périmètre tant que le cœur gratuit, sûr et modérable n'est pas stabilisé.
