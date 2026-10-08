#!/usr/bin/env bash
# Mise à jour de DHIKI sur le serveur, à lancer après chaque push :
#   bash deploy/deployer.sh           # code, migrations, build, rechargement PM2
#   bash deploy/deployer.sh --seed    # idem + chargement des contenus (premier déploiement)
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SEED=false
[ "${1:-}" = "--seed" ] && SEED=true

# Affiche une étape en couleur.
etape() { printf '\n\033[1;33m==> %s\033[0m\n' "$1"; }

cd "$APP_DIR"
[ -f backend/.env ] || { echo "backend/.env manquant : lancer d'abord bash deploy/installer.sh" >&2; exit 1; }

etape "Récupération du code"
git pull --ff-only

etape "Dépendances de l'API"
(cd backend && npm ci --omit=dev)

etape "Migrations de la base"
(cd backend && npm run db:migrate)

if [ "$SEED" = true ]; then
  etape "Chargement des contenus"
  (cd backend && npm run db:seed -- --production)
fi

etape "Construction du site public"
(
  cd frontend
  npm ci
  npx vite build --outDir dist.nouveau --emptyOutDir
  rm -rf dist.ancien
  [ -d dist ] && mv dist dist.ancien
  mv dist.nouveau dist
  rm -rf dist.ancien
)

etape "Rechargement de l'API"
pm2 startOrReload deploy/ecosystem.config.cjs --update-env
pm2 save

etape "Déploiement terminé"
curl -fsS "http://127.0.0.1:3004/api/sante" && echo || echo "Attention : l'API ne répond pas encore, voir : pm2 logs dhiki-api"
