export const GROUPES_EMOTIONS = [
  { id: 'bien', libelle: 'Ça va' },
  { id: 'lourd', libelle: 'C’est lourd' },
  { id: 'mal', libelle: 'Ça fait mal' },
];

export const EMOTIONS = [
  { id: 'heureux', groupe: 'bien', libelle: 'Heureux·se', icone: 'faceHeureux', rubriques: ['relations', 'confiance'], negative: false },
  { id: 'calme', groupe: 'bien', libelle: 'Calme', icone: 'faceCalme', rubriques: ['sommeil', 'emotions'], negative: false },
  { id: 'fatigue', groupe: 'lourd', libelle: 'Fatigué·e', icone: 'faceFatigue', rubriques: ['sommeil', 'concentration'], negative: true },
  { id: 'confus', groupe: 'lourd', libelle: 'Perdu·e', icone: 'faceConfus', rubriques: ['identite', 'confiance'], negative: true },
  { id: 'anxieux', groupe: 'lourd', libelle: 'Anxieux·se', icone: 'faceAnxieux', rubriques: ['anxiete', 'concentration'], negative: true },
  { id: 'triste', groupe: 'mal', libelle: 'Triste', icone: 'faceTriste', rubriques: ['deuil', 'emotions'], negative: true },
  { id: 'colere', groupe: 'mal', libelle: 'En colère', icone: 'faceColere', rubriques: ['emotions', 'relations'], negative: true },
  { id: 'sansEspoir', groupe: 'mal', libelle: 'Sans espoir', icone: 'faceSansEspoir', rubriques: ['emotions', 'deuil'], negative: true },
];

export const CONTEXTES = {
  ecole: 'École',
  famille: 'Famille',
  amities: 'Amitiés',
  amour: 'Amour',
  argent: 'Argent',
  avenir: 'Avenir',
  sante: 'Santé',
  solitude: 'Solitude',
  inconnu: 'Je ne sais pas',
};

export const REPONSES_AIDE = { oui: 'Oui', non: 'Non', sais: 'Je ne sais pas' };

export const ACCUSES = {
  calme: "Calme… c'est bon à entendre. Cet espace t'appartient entièrement.",
  heureux: "Heureux·se — c'est une belle chose à ressentir. J'aimerais en savoir un peu plus.",
  anxieux: "L'anxiété, c'est inconfortable à porter. Je t'entends, et c'est bien que tu prennes ce moment.",
  triste: "La tristesse, ça pèse. Prends tout le temps qu'il te faut ici.",
  fatigue: "Fatigué·e… ton corps et ta tête te demandent de ralentir. C'est déjà bien de le reconnaître.",
  colere: "La colère dit quelque chose d'important sur ce qui compte pour toi. Je t'entends.",
  confus: "Se sentir perdu·e, c'est difficile à vivre. Tu n'es pas seul·e dans ça.",
  sansEspoir: "Quand on ne voit plus d'issue, tout paraît lourd. Merci d'avoir mis des mots dessus : c'est déjà un pas.",
};

/* Trois niveaux par émotion : faible (1-3), modéré (4-6), fort (7-10). À faire valider par un professionnel. */
export const MESSAGES = {
  calme: [
    "Ce calme que tu ressens, c'est une vraie richesse. Profites-en pour ancrer de bonnes habitudes et explorer ce qui te nourrit vraiment.",
    "Ton calme intérieur est une ressource solide. Tu peux avancer avec sérénité — continue à cultiver cet espace de paix en toi.",
    "Un calme aussi profond est précieux, mais veille à ne pas le confondre avec une mise à distance de tes émotions. Reste en contact avec toi-même et avec les personnes qui comptent pour toi.",
  ],
  heureux: [
    "C'est beau de se sentir heureux·se comme ça. Savoure ce moment — ces instants de joie légère sont une réserve d'énergie pour les jours plus difficiles.",
    "Le bonheur que tu ressens est réel et tu mérites de le vivre pleinement. Partage-le, profites-en — il te revient entièrement.",
    "Quand le bonheur est aussi intense, il peut parfois venir avec la peur de le perdre. Tu n'as pas à le tenir — permets-toi juste d'être là, dans ce moment, sans pression.",
  ],
  anxieux: [
    "L'anxiété que tu ressens, même légère, mérite d'être écoutée. Elle te dit quelque chose — essaie de repérer ce qui la déclenche.",
    "Ce niveau d'anxiété peut peser lourd au quotidien. Tu n'es pas seul·e dans ce que tu vis, et il y a des outils concrets pour t'aider à souffler.",
    "Ce que tu ressens là est intense et réel. C'est courageux de le reconnaître. Prendre soin de toi maintenant, c'est une priorité — et si tu en as besoin, parler à quelqu'un est une force, pas une faiblesse.",
  ],
  triste: [
    "Une petite tristesse peut s'installer sans raison apparente. C'est humain. Accueille ce que tu ressens avec douceur, sans te forcer à aller bien.",
    "La tristesse que tu portes est réelle, et elle mérite ta compassion — envers toi-même d'abord. Prends le temps dont tu as besoin, sans te presser.",
    "Une tristesse aussi profonde mérite une attention particulière. Tu n'as pas à la traverser seul·e. Parler à quelqu'un de confiance — un·e ami·e, un proche, un professionnel — peut vraiment faire une différence.",
  ],
  fatigue: [
    "Un peu de fatigue après une période chargée, c'est normal. Ton corps te demande de ralentir — écoute-le sans culpabiliser.",
    "La fatigue que tu ressens est un signal important. Ton corps et ton esprit ont besoin de vrai repos — pas juste de nuits courtes, mais d'espace pour récupérer.",
    "Une fatigue aussi profonde ne se résout pas avec une bonne nuit. Prends-la au sérieux. Si elle persiste, parler à un·e professionnel·le peut vraiment t'aider à comprendre ce qui se passe.",
  ],
  colere: [
    "Une pointe de colère peut être un signal utile — elle te montre ce qui compte pour toi et ce que tu ne veux plus tolérer. Écoute-la.",
    "La colère que tu ressens a sa raison d'être. Elle mérite d'être entendue, pas réprimée. Trouve un espace pour l'exprimer sans te faire du mal.",
    "Quand la colère est aussi forte, elle peut être épuisante à porter. Ne la laisse pas s'accumuler. Parler, écrire, bouger — trouve ce qui te permet de la traverser sans qu'elle te traverse toi.",
  ],
  confus: [
    "Se sentir un peu perdu·e, c'est souvent le début d'une réflexion importante. L'incertitude n'est pas une ennemie — elle peut être le signe que tu grandis.",
    "La confusion que tu ressens signale souvent une période de transition. Tu cherches quelque chose — et c'est une démarche courageuse, même si elle est inconfortable.",
    "Se sentir aussi perdu·e peut être vraiment déstabilisant. Tu n'as pas à trouver toutes les réponses seul·e. Parfois, mettre des mots sur ce qu'on ressent avec quelqu'un d'autre aide à y voir plus clair.",
  ],
  sansEspoir: [
    "Ce sentiment que rien ne bougera peut s'installer doucement. Il ne dit pas la vérité sur ton avenir : il dit surtout que tu es fatigué·e de porter quelque chose. En parler à quelqu'un de confiance peut alléger ce poids.",
    "Se sentir sans espoir, c'est épuisant. Ce n'est pas une faiblesse, et ce n'est pas définitif, même si ça en a l'air. Tu mérites du soutien : un·e professionnel·le peut t'aider à retrouver un peu de lumière, pas à pas.",
    "Ce que tu ressens est très lourd, et tu n'as pas à le porter seul·e. Parle dès maintenant à quelqu'un : un proche, un·e professionnel·le, ou l'aide d'urgence si tu as des pensées qui te font peur. Ta vie compte.",
  ],
};
