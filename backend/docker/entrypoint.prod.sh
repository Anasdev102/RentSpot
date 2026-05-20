#!/usr/bin/env sh
set -e

if [ -n "$DB_HOST" ]; then
  until mysqladmin ping -h"$DB_HOST" -P"${DB_PORT:-3306}" -u"$DB_USERNAME" -p"$DB_PASSWORD" --silent; do
    echo "Waiting for MySQL at $DB_HOST:${DB_PORT:-3306}..."
    sleep 2
  done
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  php artisan migrate --force
fi

exec "$@"
