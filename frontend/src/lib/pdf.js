const STYLE = `
  body{font-family:Georgia,serif;max-width:680px;margin:60px auto;padding:0 40px;color:#2C1A12;line-height:1.8;font-size:16px}
  h1{font-size:1.5rem;color:#C2623F;margin-bottom:4px}
  .meta{font-size:.85rem;color:#6A544A;margin-bottom:40px;border-bottom:1px solid #E2D4C3;padding-bottom:16px}
  .content{white-space:pre-wrap}
  .footer{margin-top:60px;font-size:.8rem;color:#6A544A;border-top:1px solid #E2D4C3;padding-top:16px;text-align:center}
`;

// Ouvre une page imprimable d'un écrit ; le texte est inséré via textContent pour éviter toute injection HTML.
export function exporterEnPdf(label, contenu, date = new Date()) {
  const win = window.open('', '_blank');
  if (!win) return false;
  const doc = win.document;
  doc.open();
  doc.write('<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>DHIKI</title></head><body></body></html>');
  doc.close();

  const style = doc.createElement('style');
  style.textContent = STYLE;
  doc.head.appendChild(style);
  doc.title = `DHIKI — ${label}`;

  const ajouter = (tag, className, texte) => {
    const el = doc.createElement(tag);
    if (className) el.className = className;
    el.textContent = texte;
    doc.body.appendChild(el);
  };
  ajouter('h1', null, label);
  ajouter('div', 'meta', `DHIKI · ${new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}`);
  ajouter('div', 'content', contenu);
  ajouter('div', 'footer', 'Exporté depuis DHIKI · Bien-être mental');

  setTimeout(() => win.print(), 300);
  return true;
}
