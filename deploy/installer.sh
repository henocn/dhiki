#!/usr/bin/env bash
# Installation initiale de DHIKI sur le serveur (à lancer une seule fois, en utilisateur normal) :
#   bash deploy/installer.sh
# - crée backend/.env à partir de .env.example (sans jamais écraser un .env existant)
# - installe les dépendances, construit le site public
# - enregistre l'API dans PM2 (port 3004)
# - crée et active le site nginx dhiki.tg (sudo demandé)
set -euo pipefail

DOMAINE="dhiki.tg"
PORT_API=3004
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NGINX_DISPO="/etc/nginx/sites-available/${DOMAINE}"
NGINX_ACTIF="/etc/nginx/sites-enabled/${DOMAINE}"

# Affiche une étape en couleur.
etape() { printf '\n\033[1;33m==> %s\033[0m\n' "$1"; }

# Arrête le script avec un message d'erreur.
echec() { printf '\033[1;31mErreur : %s\033[0m\n' "$1" >&2; exit 1; }

etape "Vérification des prérequis"
command -v node >/dev/null || echec "Node.js n'est pas installé (version 20 minimum)."
[ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ] || echec "Node.js 20 minimum requis (actuel : $(node -v))."
command -v npm >/dev/null || echec "npm n'est pas installé."
command -v pm2 >/dev/null || echec "PM2 n'est pas installé : sudo npm install -g pm2"
command -v nginx >/dev/null || echec "nginx n'est pas installé : sudo apt install nginx"

etape "Fichier backend/.env"
if [ -f "$APP_DIR/backend/.env" ]; then
  echo "backend/.env existe déjà : il n'est pas modifié."
else
  cp "$APP_DIR/backend/.env.example" "$APP_DIR/backend/.env"
  SECRET="$(node -e 'console.log(require("crypto").randomBytes(48).toString("hex"))')"
  sed -i \
    -e "s|^NODE_ENV=.*|NODE_ENV=production|" \
    -e "s|^PORT=.*|PORT=${PORT_API}|" \
    -e "s|^FRONTEND_ORIGIN=.*|FRONTEND_ORIGIN=https://${DOMAINE}|" \
    -e "s|^SESSION_SECRET=.*|SESSION_SECRET=${SECRET}|" \
    "$APP_DIR/backend/.env"
  chmod 600 "$APP_DIR/backend/.env"
  echo "backend/.env créé (secret de session généré). Il reste à renseigner les accès PostgreSQL (PG*) et, si besoin, le SMTP."
fi

etape "Dépendances de l'API"
(cd "$APP_DIR/backend" && npm ci --omit=dev)

etape "Construction du site public"
(cd "$APP_DIR/frontend" && npm ci && npm run build)

etape "Enregistrement de l'API dans PM2 (port ${PORT_API})"
pm2 startOrReload "$APP_DIR/deploy/ecosystem.config.cjs" --update-env
pm2 save

etape "Configuration nginx (${NGINX_DISPO})"
sudo tee "$NGINX_DISPO" >/dev/null <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAINE} www.${DOMAINE};

    root ${APP_DIR}/frontend/dist;
    index index.html;
    client_max_body_size 1m;

    location /api/ {
        proxy_pass http://127.0.0.1:${PORT_API};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
NGINX
sudo ln -sfn "$NGINX_DISPO" "$NGINX_ACTIF"
sudo nginx -t
sudo systemctl reload nginx

etape "Installation terminée"
cat <<FIN
Étapes suivantes :
  1. Renseigner les accès PostgreSQL dans backend/.env (PGHOST, PGDATABASE, PGUSER, PGPASSWORD…).
  2. Premier déploiement avec chargement des contenus :  bash deploy/deployer.sh --seed
  3. HTTPS (recommandé) :  sudo certbot --nginx -d ${DOMAINE} -d www.${DOMAINE}
  4. Redémarrage automatique de PM2 au boot :  pm2 startup  (puis lancer la commande affichée)
FIN
