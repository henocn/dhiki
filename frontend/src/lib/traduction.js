const COOKIE = 'googtrans';

// Lit la langue cible de la traduction automatique dans le cookie Google Translate (fr par défaut).
export function langueTraduite() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/fr\/([a-z-]+)/i);
  return match ? match[1] : 'fr';
}

// Écrit ou efface le cookie de traduction sur le domaine courant et ses parents, puis recharge la page.
export function appliquerTraduction(code) {
  const domaines = ['', location.hostname, `.${location.hostname.split('.').slice(-2).join('.')}`];
  for (const d of domaines) {
    const domaine = d ? `;domain=${d}` : '';
    document.cookie = `${COOKIE}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${domaine}`;
    if (code !== 'fr') document.cookie = `${COOKIE}=/fr/${code};path=/${domaine}`;
  }
  location.reload();
}

// Empêche React de planter quand le traducteur a remplacé des nœuds texte du DOM.
function proteger() {
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (enfant) {
    return enfant.parentNode === this ? removeChild.call(this, enfant) : enfant;
  };
  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (nouveau, reference) {
    return reference && reference.parentNode !== this ? nouveau : insertBefore.call(this, nouveau, reference);
  };
}

// Charge le traducteur automatique uniquement si une langue autre que le français est choisie.
export function demarrerTraduction() {
  if (langueTraduite() === 'fr') return;
  proteger();
  const conteneur = document.createElement('div');
  conteneur.id = 'traducteur';
  conteneur.hidden = true;
  document.body.appendChild(conteneur);
  // Initialise le widget Google une fois le script chargé.
  window.dhikiInitTraduction = () => {
    new window.google.translate.TranslateElement({ pageLanguage: 'fr', includedLanguages: 'en,ee', autoDisplay: false }, 'traducteur');
  };
  const script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=dhikiInitTraduction';
  script.async = true;
  document.body.appendChild(script);
}
