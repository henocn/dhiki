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
- [ ] Initialiser `backend/` avec Node.js et Express en JavaScript.
- [ ] Choisir et uniformiser les modules JavaScript (`type: module` proposé).
- [ ] Ajouter ESLint, Prettier et les scripts communs.
- [ ] Ajouter la validation des variables d'environnement au démarrage du backend.
- [ ] Configurer CORS uniquement pour les origines autorisées.
- [ ] Ajouter un endpoint de santé ne révélant aucune information sensible.

## Phase 2 — Base PostgreSQL

- [ ] Configurer le pool `pg` avec `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` et `PGSSL`.
- [ ] Choisir un outil de migrations compatible JavaScript.
- [ ] Concevoir le schéma initial.
- [ ] Créer les tables de rubriques, contenus, traductions, exercices et médias.
- [ ] Créer les tables de questions publiques et confidentielles sans mélanger leurs accès.
- [ ] Créer les tables de réponses, statuts, attributions et modération.
- [ ] Créer les tables d'utilisateurs backoffice, rôles et permissions.
- [ ] Créer les tables de contacts d'urgence par zone géographique.
- [ ] Créer une table d'audit sans contenu confidentiel en clair.
- [ ] Ajouter les index, contraintes, dates et mécanismes d'archivage nécessaires.
- [ ] Préparer un jeu de données de développement sans données personnelles réelles.

## Phase 3 — Backend/API

- [ ] Définir la convention des routes et le format des réponses d'erreur.
- [ ] Implémenter la lecture des rubriques, articles, exercices et traductions publiés.
- [ ] Implémenter le parcours « Faire le point » sous forme de règles explicables et non diagnostiques.
- [ ] Implémenter l'envoi et la consultation des questions publiques.
- [ ] Implémenter le canal confidentiel retenu en phase 0.
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
