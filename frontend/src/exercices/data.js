/* Contenus d'exercices encore codés côté front (à migrer en base pour l'édition depuis le backoffice). */

export const ANCRAGE_ETAPES = [
  { n: 5, icone: 'eye', label: 'choses que tu vois', instruction: 'Regarde autour de toi. Nomme 5 choses que tu peux voir en ce moment.' },
  { n: 4, icone: 'hand', label: 'choses que tu touches', instruction: 'Touche quelque chose près de toi. Nomme 4 textures ou sensations physiques que tu ressens.' },
  { n: 3, icone: 'ear', label: 'choses que tu entends', instruction: 'Ferme les yeux un instant. Nomme 3 sons que tu entends, même les plus discrets.' },
  { n: 2, icone: 'wind', label: 'choses que tu sens', instruction: 'Nomme 2 odeurs que tu peux percevoir — ou rappelle-toi une odeur que tu aimes.' },
  { n: 1, icone: 'coffee', label: 'chose que tu goûtes', instruction: 'Nomme 1 goût en bouche, ou une saveur que tu apprécies particulièrement.' },
];

export const SCAN_ZONES = [
  { label: 'La tête et le visage', instruction: "Remarque les tensions dans ta mâchoire, ton front, tes yeux. Tu n'as pas à les changer — juste les observer. En expirant, laisse-les se relâcher doucement." },
  { label: 'Le cou et les épaules', instruction: 'Beaucoup de stress se loge ici. Remarque si tes épaules sont remontées. En expirant, laisse-les tomber naturellement, loin des oreilles.' },
  { label: 'La poitrine et le dos', instruction: 'Sens ton souffle soulever ta cage thoracique. Y a-t-il une pression dans ta poitrine ? Inspire profondément, retiens 2 secondes, expire longuement.' },
  { label: 'Le ventre', instruction: "C'est ici que le stress se niche souvent. Remarque si ton ventre est contracté. En expirant, laisse-le se détendre complètement." },
  { label: 'Les bras et les mains', instruction: 'Secoue doucement les bras si tu peux. Sens le poids de tes mains. Laisse toute tension partir par le bout de tes doigts.' },
  { label: 'Les jambes et les pieds', instruction: 'Sens le contact de tes pieds sur le sol. Tu es soutenu·e. Contracte les mollets légèrement, puis relâche. Remarque la différence.' },
];
export const SCAN_SECONDES = 30;

export const VALEURS = [
  'Famille', 'Liberté', 'Honnêteté', 'Créativité', 'Respect', 'Amitié',
  'Ambition', 'Paix intérieure', 'Justice', 'Courage', 'Solidarité', 'Joie',
  'Équité', 'Discipline', 'Indépendance', 'Générosité', 'Curiosité', 'Responsabilité',
  'Authenticité', 'Spiritualité', 'Sécurité', 'Épanouissement', 'Communauté', 'Intégrité',
];
export const VALEURS_MAX = 5;

export const ECOUTE_SCENARIOS = [
  {
    contexte: 'Ton ami Koffi, 20 ans, te dit :',
    message: "« J'ai raté mon concours. J'ai tellement travaillé et ça n'a pas suffi. Je me sens nul. »",
    choix: [
      { texte: '« T\'inquiète pas, tu vas réussir la prochaine fois ! »', ok: false, pourquoi: "Cette réponse minimise la douleur de Koffi. Il a besoin d'être entendu avant d'être encouragé." },
      { texte: "« Tu dois te sentir vraiment déçu. Tu veux me raconter ce qui s'est passé ? »", ok: true, pourquoi: "Tu nommes son émotion et tu l'invites à parler. C'est l'écoute active : d'abord comprendre, ensuite aider." },
      { texte: "« Moi aussi j'ai raté des choses. C'est la vie. »", ok: false, pourquoi: "Ramener la conversation à toi déplace le focus. Koffi a besoin que l'espace lui appartienne." },
    ],
  },
  {
    contexte: 'Ta sœur Ama, 16 ans, te dit :',
    message: '« Maman me crie dessus pour tout. Je ne peux rien faire de bien à la maison. »',
    choix: [
      { texte: '« Maman a ses propres problèmes, tu dois comprendre. »', ok: false, pourquoi: "Tu expliques les raisons de maman, mais Ama n'a pas encore eu la place d'exprimer ce qu'elle ressent." },
      { texte: '« C\'est toujours pareil à la maison. »', ok: false, pourquoi: "Tu généralises sans explorer ce qu'Ama vit vraiment. Cela peut la faire se sentir incomprise." },
      { texte: "« Tu te sens épuisée de ne pas te sentir à ta place chez toi. C'est dur. Qu'est-ce qui s'est passé aujourd'hui ? »", ok: true, pourquoi: "Tu valides son ressenti et tu poses une question ouverte. C'est exactement ça, écouter vraiment." },
    ],
  },
  {
    contexte: 'Ton camarade Edem, 22 ans, te dit :',
    message: "« Je pense que personne dans le groupe ne m'aime vraiment. J'ai l'impression d'être juste là. »",
    choix: [
      { texte: '« Mais non, tout le monde t\'aime ! Tu te fais des idées. »', ok: false, pourquoi: 'Contredire son ressenti risque de le faire se sentir incompris ou ridicule.' },
      { texte: "« Tu te sens seul même entouré. C'est une sensation très douloureuse. Tu peux m'en dire plus ? »", ok: true, pourquoi: 'Tu reformules sans juger et tu ouvres un espace. Edem peut continuer à parler en sécurité.' },
      { texte: '« Tu devrais faire des efforts pour t\'intégrer. »', ok: false, pourquoi: "Ce conseil n'a pas été demandé. Avant de donner des solutions, il faut d'abord comprendre la situation." },
    ],
  },
  {
    contexte: 'Ta meilleure amie Abla, 19 ans, te dit :',
    message: "« Je suis tellement fatiguée. J'ai l'impression de ne jamais avoir de pause. Je travaille, j'aide à la maison, je révise… Je n'en peux plus. »",
    choix: [
      { texte: '« Repose-toi ce week-end, ça va aller ! »', ok: false, pourquoi: "Un conseil rapide ne lui laisse pas l'espace d'exprimer ce qu'elle vit vraiment. Elle a besoin d'être entendue d'abord." },
      { texte: '« Tu portes vraiment beaucoup sur tes épaules. Comment tu te sens par rapport à tout ça ? »', ok: true, pourquoi: "Tu reconnais le poids qu'elle porte et tu l'invites à en dire plus. Elle se sent vue et pas jugée." },
      { texte: '« Tout le monde est fatigué en ce moment. »', ok: false, pourquoi: "Comparer sa situation à celle des autres minimise ce qu'elle ressent. Ce qu'elle vit lui appartient." },
    ],
  },
  {
    contexte: 'Ton grand frère Yao, 26 ans, te dit :',
    message: "« Je me sens bloqué dans ma vie. J'ai 26 ans et je n'ai pas avancé. Tout le monde avance sauf moi. »",
    choix: [
      { texte: '« Mais si, tu as avancé ! Tu as un travail, un appartement… »', ok: false, pourquoi: "Lister ses accomplissements sans accueillir son ressenti d'abord peut le faire se sentir incompris ou critiqué." },
      { texte: "« Ce sentiment d'être bloqué, ça doit être vraiment lourd à porter. Tu peux me dire ce qui te donne cette impression ? »", ok: true, pourquoi: "Tu valides son ressenti sans le nier ni le corriger, et tu cherches à comprendre. C'est l'écoute active." },
      { texte: "« À 26 ans c'est normal de ne pas savoir où on en est. »", ok: false, pourquoi: "Normaliser trop vite peut sembler condescendant. Yao a besoin d'être entendu, pas rassuré d'office." },
    ],
  },
  {
    contexte: 'Ta camarade de classe Kafui, 17 ans, te dit :',
    message: "« J'ai honte de moi. J'ai triché à l'examen et maintenant je ne peux plus me regarder dans la glace. »",
    choix: [
      { texte: "« C'est mal de tricher. Tu aurais dû mieux préparer. »", ok: false, pourquoi: "Ce jugement ne l'aidera pas. Elle connaît déjà ses erreurs. Ce dont elle a besoin, c'est d'être entendue." },
      { texte: '« Tout le monde triche parfois. C\'est pas si grave. »', ok: false, pourquoi: 'Minimiser son sentiment de honte l\'empêche de le traverser vraiment. Elle a besoin que son vécu soit pris au sérieux.' },
      { texte: "« Tu portes beaucoup de honte là. C'est difficile. Qu'est-ce qui s'est passé pour que tu en arrives là ? »", ok: true, pourquoi: "Tu accueilles son émotion sans la juger ni la minimiser, et tu l'aides à explorer ce qui l'a conduite là." },
    ],
  },
  {
    contexte: 'Ton ami Komlan, 21 ans, te dit :',
    message: "« J'ai l'impression que mes parents ne me font pas confiance. Ils contrôlent tout. Je suffoque. »",
    choix: [
      { texte: "« Ils font ça parce qu'ils t'aiment. Tu devrais les remercier. »", ok: false, pourquoi: "Justifier le comportement des parents sans entendre Komlan d'abord ne l'aide pas à se sentir compris." },
      { texte: "« Tu te sens étouffé, sans espace pour toi. C'est épuisant. Tu peux m'en dire plus sur ce qui te pèse le plus ? »", ok: true, pourquoi: 'Tu nommes son ressenti précisément et tu l\'invites à approfondir. Il se sent entendu et en sécurité.' },
      { texte: '« Moi aussi mes parents étaient comme ça. Ça va passer. »', ok: false, pourquoi: "Ramener l'expérience à la tienne et promettre que ça passera ne l'aide pas à se sentir écouté maintenant." },
    ],
  },
  {
    contexte: 'Ta cousine Séna, 15 ans, te dit :',
    message: "« À l'école, il y a des filles qui parlent de moi dans mon dos. Je ne veux plus y aller. »",
    choix: [
      { texte: '« Ignore-les, elles sont jalouses de toi. »', ok: false, pourquoi: "L'interpréter à sa place sans l'écouter d'abord ne l'aide pas. Elle a besoin que tu accueilles ce qu'elle vit." },
      { texte: "« Tu te sens trahie et blessée. C'est vraiment difficile de se sentir exclue. Tu veux me raconter ce qui se passe ? »", ok: true, pourquoi: 'Tu nommes ses émotions avec précision et tu lui ouvres un espace pour parler. Elle ne se sent plus seule.' },
      { texte: "« C'est normal à cet âge, ça fait partie de la vie. »", ok: false, pourquoi: 'Dire que c\'est normal banalise sa douleur. Ce qu\'elle ressent est réel et mérite d\'être pris au sérieux.' },
    ],
  },
];

export const ECOUTE_CLES = [
  { ok: true, texte: "Nommer l'émotion de l'autre (« Tu te sens… »)" },
  { ok: true, texte: '« Tu peux m\'en dire plus ? » : poser des questions ouvertes' },
  { ok: false, texte: 'Éviter de minimiser (« T\'inquiète pas »)' },
  { ok: false, texte: 'Éviter les conseils non sollicités' },
];

export const LIMITES_SCENARIOS = [
  {
    contexte: "Un ami t'appelle à 23 h pour parler de ses problèmes. C'est la troisième fois cette semaine. Tu es épuisé·e.",
    message: 'Comment répondre en posant une limite tout en restant bienveillant·e ?',
    choix: [
      { texte: '« Allô ? Oui bien sûr, je t\'écoute… »', ok: false, pourquoi: "Ne pas poser de limite t'épuise. Une relation saine se construit aussi sur le respect mutuel de l'espace de chacun." },
      { texte: '« Je ne peux pas parler maintenant. Je suis fatigué·e et j\'ai besoin de dormir. On peut se parler demain ? »', ok: true, pourquoi: "Tu exprimes ton besoin clairement et tu proposes une alternative. C'est une limite saine et bienveillante." },
      { texte: '« Ne m\'appelle plus aussi tard ! » (et tu raccroches)', ok: false, pourquoi: "Poser une limite, c'est bien. Mais sans explication ni alternative, la relation peut être blessée inutilement." },
    ],
  },
  {
    contexte: 'Ton cousin te demande de faire ses devoirs à sa place « juste cette fois ». Mais ça fait plusieurs fois déjà.',
    message: 'Comment dire non sans te sentir coupable ?',
    choix: [
      { texte: '« D\'accord, donne-moi tes affaires. »', ok: false, pourquoi: "Tu sacrifies ton temps et tu ne l'aides pas à apprendre à se débrouiller. Ce n'est pas lui rendre service." },
      { texte: '« Je ne peux pas faire ça pour toi. Mais si tu veux, on regarde ensemble comment tu peux t\'y prendre ? »', ok: true, pourquoi: "Tu poses une limite claire et tu offres une alternative positive. C'est respectueux pour toi et pour lui." },
      { texte: '« Non je ne fais pas ça. » (sans rien ajouter)', ok: false, pourquoi: "C'est une limite valide, mais ajouter une alternative ou une explication peut éviter un froid inutile." },
    ],
  },
  {
    contexte: "Ta patronne te demande de rester travailler le samedi alors que vous n'avez pas convenu de ça au départ.",
    message: 'Comment répondre professionnellement en défendant ton espace personnel ?',
    choix: [
      { texte: '« Oui, pas de problème. » (mais tu bouillonnes intérieurement)', ok: false, pourquoi: "Accepter sans l'exprimer nourrit la frustration. Les limites non exprimées s'accumulent et explosent plus tard." },
      { texte: "« Je comprends le besoin, mais le samedi est mon temps personnel. Je ne peux pas être disponible ce jour-là. Est-ce qu'on peut trouver une autre solution ? »", ok: true, pourquoi: "Tu reconnais la situation, tu exprimes ta limite clairement et tu proposes une ouverture. C'est professionnel et assertif." },
      { texte: '« Je ne travaille pas le samedi, c\'est comme ça. »', ok: false, pourquoi: 'La limite est valide, mais le ton peut créer inutilement une tension. Une formulation respectueuse passe mieux.' },
    ],
  },
  {
    contexte: "Un proche te pose des questions très personnelles sur ta vie amoureuse lors d'un repas de famille. Tu n'as pas envie d'en parler.",
    message: 'Comment rediriger sans créer de conflit ?',
    choix: [
      { texte: '« Ça ne te regarde pas. » (devant tout le monde)', ok: false, pourquoi: "La limite est légitime mais la forme peut humilier l'autre et créer une tension familiale inutile." },
      { texte: '« C\'est gentil de t\'intéresser, mais je préfère garder ça pour moi pour l\'instant. »', ok: true, pourquoi: "Tu poses une limite avec douceur et dignité. Tu n'as pas à justifier ton choix. C'est suffisant." },
      { texte: '« Euh… rien de spécial… » (et tu réponds vaguement)', ok: false, pourquoi: "Éluder n'est pas poser une limite. L'autre peut continuer à insister. Être clair·e est plus respectueux." },
    ],
  },
  {
    contexte: "Ton meilleur ami partage régulièrement des choses que tu lui dis en confidence avec d'autres personnes.",
    message: 'Comment aborder ce sujet difficile avec lui ?',
    choix: [
      { texte: '« Tu as encore parlé de moi ! Je ne te fais plus confiance ! »', ok: false, pourquoi: "La confrontation directe sous forme d'accusation peut mettre l'autre sur la défensive et fermer la conversation." },
      { texte: "« Il y a quelque chose qui m'a blessé·e récemment que j'aimerais te dire. Est-ce qu'on peut en parler ? »", ok: true, pourquoi: "Tu ouvres la conversation avec bienveillance. L'autre peut t'entendre sans se sentir attaqué d'entrée." },
      { texte: '« C\'est bon, laisse tomber. » (et tu gardes pour toi)', ok: false, pourquoi: 'Avaler la blessure sans la nommer nourrit une distance silencieuse. La relation mérite une conversation honnête.' },
    ],
  },
];

export const LIMITES_CLES = [
  { ok: true, texte: 'Exprimer ton besoin avec « Je » (pas « Tu fais toujours… »)' },
  { ok: true, texte: 'Proposer une alternative quand c\'est possible' },
  { ok: true, texte: "Rester calme : une limite s'exprime, elle ne s'impose pas" },
  { ok: false, texte: "Tu n'as pas à te justifier longuement" },
];
