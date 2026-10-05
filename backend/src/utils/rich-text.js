import sanitizeHtml from 'sanitize-html';

const OPTIONS = {
  allowedTags: ['p', 'br', 'h2', 'h3', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'a', 'hr'],
  allowedAttributes: { a: ['href', 'target', 'rel'], blockquote: ['class'] },
  allowedClasses: { blockquote: ['article-pullquote'] },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
    h1: 'h2',
    b: 'strong',
    i: 'em',
  },
  exclusiveFilter: (frame) => ['p', 'h2', 'h3', 'li'].includes(frame.tag) && !frame.text.trim(),
};

// Nettoie le HTML produit par l'éditeur de texte riche du back-office (balises de mise en forme uniquement).
export function nettoyerHtml(html) {
  return sanitizeHtml(html ?? '', OPTIONS).trim();
}

// Extrait le texte brut d'un contenu HTML.
export function texteBrut(html) {
  return sanitizeHtml(html ?? '', { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();
}

// Estime la durée de lecture en minutes (environ 200 mots par minute, minimum 1).
export function dureeLecture(html) {
  const mots = texteBrut(html).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(mots / 200));
}

// Propose une description à partir des premières phrases complètes, sinon coupe proprement sur un mot.
export function descriptionParDefaut(html, max = 180) {
  const texte = texteBrut(html);
  if (texte.length <= max) return texte;
  let description = '';
  for (const phrase of texte.split(/(?<=[.!?])\s+/)) {
    if ((description + ' ' + phrase).trim().length > max) break;
    description = (description + ' ' + phrase).trim();
  }
  if (description) return description;
  return `${texte.slice(0, texte.lastIndexOf(' ', max)).replace(/[,;:.\s—-]+$/, '')}…`;
}
