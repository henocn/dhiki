#!/usr/bin/env bash
# Préparation du serveur (une seule fois) : bash deploy/installer.sh
# - crée backend/.env (sans jamais écraser un .env existant)
# - crée et active le site nginx dhiki.dekaeditions.tg
set -euo pipefail

DOMAINE="dhiki.dekaeditions.tg"
PORT_API=3004
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NGINX_DISPO="/etc/nginx/sites-available/${DOMAINE}"
NGINX_ACTIF="/etc/nginx/sites-enabled/${DOMAINE}"

# Affiche une étape en couleur.
etape() { printf '\n\033[1;33m==> %s\033[0m\n' "$1"; }

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
    -e "s|^PGUSER=.*|PGUSER=dhiki|" \
    -e "s|^SESSION_SECRET=.*|SESSION_SECRET=${SECRET}|" \
    "$APP_DIR/backend/.env"
  chmod 600 "$APP_DIR/backend/.env"
  echo "backend/.env créé : il reste à renseigner PGPASSWORD."
fi

etape "Configuration nginx (${NGINX_DISPO})"
sudo tee "$NGINX_DISPO" >/dev/null <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAINE};

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

etape "Préparation terminée"
cat <<FIN
  1. Renseigner PGPASSWORD dans backend/.env
  2. Premier déploiement :  bash deploy/deployer.sh --seed
  3. HTTPS :  sudo certbot --nginx -d ${DOMAINE}
FIN
