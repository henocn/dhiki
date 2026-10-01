export const EMOTIONS = [
  { id: 'calme', icone: 'faceCalme', rubriques: ['sommeil', 'emotions'], negative: false },
  { id: 'heureux', icone: 'faceHeureux', rubriques: ['relations', 'confiance'], negative: false },
  { id: 'anxieux', icone: 'faceAnxieux', rubriques: ['anxiete', 'concentration'], negative: true },
  { id: 'triste', icone: 'faceTriste', rubriques: ['deuil', 'emotions'], negative: true },
  { id: 'fatigue', icone: 'faceFatigue', rubriques: ['sommeil', 'concentration'], negative: true },
  { id: 'colere', icone: 'faceColere', rubriques: ['emotions', 'relations'], negative: true },
  { id: 'confus', icone: 'faceConfus', rubriques: ['identite', 'confiance'], negative: true },
  { id: 'espoir', icone: 'sprout', rubriques: ['confiance', 'identite'], negative: false },
];

export const CONTEXTES = ['ecole', 'famille', 'amities', 'amour', 'argent', 'avenir', 'sante', 'solitude', 'inconnu'];

export const ACCUSES = {
  calme: "Calme… c'est bon à entendre. Cet espace t'appartient entièrement.",
  heureux: "Heureux·se — c'est une belle chose à ressentir. J'aimerais en savoir un peu plus.",
  anxieux: "L'anxiété, c'est inconfortable à porter. Je t'entends, et c'est bien que tu prennes ce moment.",
  triste: "La tristesse, ça pèse. Prends tout le temps qu'il te faut ici.",
  fatigue: "Fatigué·e… ton corps et ta tête te demandent de ralentir. C'est déjà bien de le reconnaître.",
  colere: "La colère dit quelque chose d'important sur ce qui compte pour toi. Je t'entends.",
  confus: "Se sentir perdu·e, c'est difficile à vivre. Tu n'es pas seul·e dans ça.",
  espoir: "De l'espoir — c'est précieux et ça mérite d'être nourri. Je suis là.",
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
  espoir: [
    "L'espoir que tu portes est une lumière douce en toi. Garde-le précieusement — il t'appartient.",
    "Ton espoir est une vraie force. Il t'aide à avancer même quand les choses sont complexes. Nourris-le avec des actions concrètes, aussi petites soient-elles.",
    "Un espoir aussi fort peut parfois porter de grandes attentes. Reste ancré·e dans le présent aussi — chaque petit pas compte autant que la destination.",
  ],
};
