# DHIKI

DHIKI est une plateforme gratuite de bien-être mental, née à Lomé et pensée en priorité pour les jeunes de 12 à 25 ans. Son objectif est d'offrir un espace calme, accessible et sans jugement pour mieux comprendre ce que l'on ressent, trouver des outils concrets et demander de l'aide lorsque cela devient nécessaire.

Ce dépôt prépare la transformation du prototype `dhiki-v2_3.html` en trois applications JavaScript séparées :

- `frontend/` : site public React.js ;
- `backend/` : API Node.js et accès PostgreSQL ;
- `backoffice/` : interface React.js réservée à l'équipe DHIKI et aux professionnels habilités.

Le prototype HTML sert uniquement de référence produit et visuelle. Il n'est pas encore intégré au projet.

## Idée générale comprise

DHIKI veut devenir une « safe place » numérique centrée sur cinq besoins :

1. **Comprendre** : lire des contenus simples et contextualisés sur l'anxiété, le sommeil, les relations, la confiance en soi, le deuil, l'identité, les études et les émotions.
2. **Agir immédiatement** : utiliser des exercices guidés de respiration, d'ancrage, de journal, de scan corporel ou de concentration.
3. **Faire le point** : décrire son émotion, son intensité et son contexte, puis recevoir des suggestions de ressources adaptées. Cette fonction ne doit pas être présentée comme un diagnostic.
4. **Parler à quelqu'un** : poser une question publique ou confidentielle et recevoir une réponse d'un professionnel habilité.
5. **Trouver de l'aide en urgence** : afficher immédiatement des contacts locaux vérifiés et des gestes simples d'apaisement, sans remplacer les services d'urgence.

Les principes observés dans le prototype sont : gratuité, bienveillance, anonymat, simplicité, adaptation aux réalités africaines, contenus en français et à terme en éwé, et absence de compte obligatoire pour le public.

## Périmètre proposé pour le MVP

### Frontend public

- accueil et présentation de la mission ;
- catalogue de rubriques ;
- lecture d'articles ;
- exercices guidés interactifs ;
- parcours « Faire le point » avec recommandations non médicales ;
- questions publiques et dépôt de questions confidentielles ;
- bloc d'aide immédiate accessible depuis toutes les pages ;
- écrits personnels conservés uniquement sur l'appareil par défaut ;
- interface responsive et accessible ;
- préparation du multilingue français/éwé.

### Backend

- API REST Node.js en JavaScript ;
- accès PostgreSQL avec le paquet `pg` ;
- contenus, rubriques, exercices et traductions ;
- réception, modération, attribution et réponse aux questions ;
- gestion des professionnels et administrateurs ;
- contacts d'urgence configurables par pays ou zone ;
- rôles et permissions ;
- journal d'audit pour les actions sensibles ;
- validation des entrées, limitation de débit et protections de sécurité usuelles.

### Backoffice

- authentification sécurisée ;
- tableau de bord ;
- création, modification, publication et archivage des contenus ;
- gestion des versions française et éwé ;
- file des questions publiques et confidentielles ;
- attribution des questions à un professionnel ;
- rédaction, validation et publication des réponses ;
- modération et signalement ;
- gestion des contacts d'urgence ;
- gestion des comptes, rôles et traces d'activité.

## Architecture technique envisagée

| Dossier | Technologie | Port de développement proposé | Rôle |
| --- | --- | ---: | --- |
| `frontend/` | React.js + Vite, JavaScript | 5173 | Application publique |
| `backend/` | Node.js + Express, JavaScript | 4000 | API et logique métier |
| `backoffice/` | React.js + Vite, JavaScript | 5174 | Administration |
| PostgreSQL | PostgreSQL | 5432 | Données persistantes |

Les choix détaillés de bibliothèques seront figés après validation. Aucun TypeScript n'est prévu.

## Structure actuelle

```text
.
├── backend/
│   └── .env.example
├── backoffice/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
├── .gitignore
├── README.md
└── TODO.md
```

À ce stade, les applications ne sont volontairement pas initialisées : cette première étape sert à valider le périmètre et l'architecture avant de générer le code.

## Configuration PostgreSQL

La connexion à PostgreSQL utilisera des variables séparées et **pas** une variable `DATABASE_URL`.

1. Copier `backend/.env.example` vers `backend/.env`.
2. Renseigner les valeurs locales.
3. Ne jamais versionner le fichier `.env` réel.

Variables prévues :

```dotenv
PGHOST=localhost
PGPORT=5432
PGDATABASE=dhiki
PGUSER=dhiki_app
PGPASSWORD=change_me
PGSSL=false
```

Le backend construira le pool PostgreSQL directement à partir de ces variables (`host`, `port`, `database`, `user`, `password`, `ssl`).

## Principes de confidentialité et de sécurité

DHIKI traite des informations potentiellement très sensibles, parfois fournies par des mineurs. Les règles suivantes doivent guider l'implémentation :

- collecter le minimum de données personnelles ;
- ne pas envoyer les journaux personnels au serveur sans consentement explicite ;
- chiffrer les communications en production ;
- ne jamais journaliser le contenu des questions confidentielles ;
- séparer strictement questions publiques et confidentielles ;
- limiter l'accès aux professionnels autorisés selon leur rôle ;
- conserver une trace des accès et modifications sensibles ;
- prévoir des durées de conservation et une suppression des données ;
- faire valider les contenus, recommandations et protocoles de crise par des professionnels qualifiés ;
- afficher clairement que DHIKI ne remplace ni un diagnostic, ni une consultation, ni les services d'urgence.

Les numéros, centres et délais visibles dans le prototype sont à considérer comme des exemples tant qu'ils n'ont pas été vérifiés par l'équipe DHIKI.

## Décisions à valider avant le développement

- zone de lancement : Togo uniquement ou plusieurs pays ;
- langues du premier lancement : français seul ou français + éwé ;
- procédure réelle de réponse sous 48 heures et personnes habilitées ;
- fonctionnement d'une réponse confidentielle sans création de compte ;
- politique de consentement et de protection des utilisateurs mineurs ;
- coordonnées d'urgence officielles à afficher ;
- règles de publication des témoignages et preuve de consentement ;
- politique de conservation et de suppression des questions ;
- hébergement du backend, de PostgreSQL et des médias.

La suite détaillée est suivie dans [TODO.md](./TODO.md).
