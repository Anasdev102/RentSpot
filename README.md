# RENTSPOT

RENTSPOT is a modern full-stack sports field reservation platform built to simplify the process of discovering, booking, and managing sports venues online.

Users can create an account, browse available stadiums, filter fields by sport, city, price, and availability, view detailed stadium pages with images and reviews, create reservations, manage bookings, cancel pending reservations, add stadiums to favorites, simulate payments, submit reviews after completed reservations, receive notifications, and contact support directly from their account.

The application also includes a complete admin dashboard that allows administrators to manage sports, stadiums, stadium images, users, reservations, payments, reviews, contact messages, replies, and notifications through clean reusable CRUD interfaces.

RENTSPOT supports role-based access control, Laravel Sanctum authentication, Google login integration, UUID-based resources, cursor pagination, reservation conflict prevention, fake payment handling with transaction tracking, multilingual UI support in English, French, and Arabic, RTL layout support for Arabic, responsive design, smooth page transitions, animated dropdowns, and modern SaaS-style user interfaces.

## Tech Stack

- Backend: Laravel API
- Authentication: Laravel Sanctum
- Frontend: React + Vite
- State Management: Redux Toolkit
- Styling: Tailwind CSS
- HTTP Client: Axios
- OAuth: Google Login
- Database: MySQL / SQLite for local development
- Payments: Fake payment flow with PayPal-ready structure

## Main Modules

<<<<<<< HEAD
- Public website
- User authentication
- Stadium listing and filters
- Stadium details and image gallery
- Reservation system
- Payment simulation
- Favorites system
- Reviews system
- Contact messages
- User dashboard
- Admin dashboard
- Notifications
- Multilingual interface
=======
- User registration, login, logout, and protected routes
- Google login integration
- Role-based access control for users and admins
- Stadium listing with filters by sport, city, price, and sorting
- Stadium details page with gallery, photos, reviews, and booking card
- Reservation creation with date and time validation
- Protection against double booking
- Automatic completed reservation behavior
- Reservation cancellation for users
- Fake payment flow with payment status and transaction id
- User dashboard with reservations, payments, and review actions
- Favorites system for stadiums
- Contact form linked to the user account when logged in
- Admin contact message management and reply feature
- Notification dropdowns for user/admin context
- Multilingual UI: English, French, and Arabic
- RTL support for Arabic
- Smooth route, section, dropdown, notification, modal, and loading animations

## Admin Features

- Admin dashboard with stats and recent activity
- CRUD for sports
- CRUD for stadiums with image upload support
- CRUD for users
- Reservation management
- Payment management
- Review management
- Contact message management
- Dynamic tables with filters, actions, and reusable admin components

## Project Structure

```text
RentSpot/
  backend/        Laravel API application
  frontend/       React + Vite application
  run-backend.ps1 Local helper script for Laravel server
  run-frontend.ps1 Local helper script for Vite server
```

Important frontend folders:

```text
frontend/src/components/        Reusable UI components
frontend/src/components/admin/  Admin dashboard and CRUD components
frontend/src/components/home/   Home page sections
frontend/src/components/stadiums/
frontend/src/components/stadium-details/
frontend/src/features/          Redux Toolkit slices
frontend/src/i18n/              Language provider and translations
frontend/src/pages/             Route pages
```

Important backend folders:

```text
backend/app/Http/Controllers/Api/
backend/app/Models/
backend/app/Services/
backend/database/migrations/
backend/database/seeders/
backend/routes/api.php
backend/routes/web.php
```

## Local Setup

## Docker Local Development

The recommended local workflow uses Docker Compose with four services:

- `backend`: Laravel API on `http://localhost:8001`
- `frontend`: React/Vite app on `http://localhost:5174`
- `mysql`: MySQL 8 exposed on host port `3307`
- `phpmyadmin`: database UI on `http://localhost:8081`

Start everything:

```bash
docker compose up --build
```

Run migrations and seed demo data:

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

Open the app:

```text
Frontend:   http://localhost:5174
Backend:    http://localhost:8001/api
phpMyAdmin: http://localhost:8081
```

Database credentials for local Docker:

```text
Host from containers: mysql
Host from your machine: 127.0.0.1
Port from your machine: 3307
Database: rentspot
Username: rentspot
Password: rentspot
Root password: root
```

Useful Docker commands:

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose exec backend php artisan test
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
docker compose down
docker compose down -v
```

`docker compose down -v` removes the MySQL volume and deletes local Docker database data.

### Docker Files

- `docker-compose.yml`: local development stack with MySQL and phpMyAdmin.
- `backend/Dockerfile`: Laravel development image with PHP, Composer, MySQL client, and hot reload through mounted source code.
- `backend/docker/entrypoint.sh`: installs Composer dependencies when needed, creates `.env`, waits for MySQL, generates `APP_KEY`, runs migrations, and starts Laravel.
- `frontend/Dockerfile`: Vite development image with Node 20 and hot reload.
- `backend/.dockerignore` and `frontend/.dockerignore`: keep secrets, dependencies, build output, and logs out of Docker build contexts.

## Production Docker Preview

A second deployment-oriented setup is included for later production work:

- `docker-compose.prod.yml`: production-style stack with MySQL, Laravel PHP-FPM, backend Nginx, and frontend Nginx.
- `backend/Dockerfile.prod`: optimized Laravel PHP-FPM image with production Composer dependencies.
- `backend/Dockerfile.nginx-prod`: backend Nginx image with Laravel public assets and storage proxy support.
- `backend/docker/nginx.prod.conf`: Nginx config for the Laravel API.
- `backend/docker/php.prod.ini`: PHP production settings and OPcache.
- `backend/docker/entrypoint.prod.sh`: waits for MySQL, caches Laravel config/routes/views, and optionally runs migrations.
- `frontend/Dockerfile.prod`: builds the React app and serves static files with Nginx.
- `frontend/nginx.prod.conf`: serves React routes and proxies `/api`, `/auth`, and `/storage` to the Laravel backend.

Before production deployment, create a real `.env` file or host environment variables with secure values:

```text
APP_KEY=base64:...
APP_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com
MYSQL_ROOT_PASSWORD=strong-root-password
MYSQL_PASSWORD=strong-app-password
```

Build and start the production-style stack locally:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Run production migrations only when you intend to apply schema changes:

```bash
RUN_MIGRATIONS=true docker compose -f docker-compose.prod.yml up --build
```

For real deployment, put the frontend behind HTTPS, use managed MySQL or persistent encrypted volumes, configure mail, configure storage for stadium images, and set the deployed Google OAuth redirect URI.

### Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --host 127.0.0.1 --port 8001
```

Backend API:

```text
http://localhost:8001/api
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev -- --host 127.0.0.1 --port 5174
```

Frontend URL:

```text
http://127.0.0.1:5174
```

## Environment Notes

Backend `.env.example` includes:

```text
APP_URL=http://localhost:8001
FRONTEND_URL=http://localhost:5174
DB_HOST=mysql
DB_DATABASE=rentspot
GOOGLE_REDIRECT_URI=http://localhost:8001/api/auth/google/callback
```

Frontend `.env.example` includes:

```text
VITE_API_URL=http://localhost:8001/api
VITE_BACKEND_URL=http://localhost:8001
```

For Google OAuth, add the exact redirect URI in Google Cloud Console:

```text
http://localhost:8001/api/auth/google/callback
```

## Seeded Accounts

Admin:

```text
Email: elidrissi@gmail.com
Password: celia@2006
```

Demo user:

```text
Email: user@rentspot.test
Password: password
```

Default admin:

```text
Email: admin@rentspot.test
Password: password
```

## API Overview

Public routes:

- `GET /api/sports`
- `GET /api/stadium-cities`
- `GET /api/stadiums`
- `GET /api/stadiums/{stadium}`
- `POST /api/contact`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/google/redirect`
- `GET /api/auth/google/callback`

Authenticated user routes:

- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/reservations`
- `POST /api/reservations`
- `PATCH /api/reservations/{reservation}/cancel`
- `POST /api/reservations/{reservation}/pay`
- `POST /api/reviews`
- `GET /api/favorites`
- `POST /api/favorites/{stadium}`
- `DELETE /api/favorites/{stadium}`
- `GET /api/notifications`

Admin routes:

- `GET /api/admin/dashboard`
- `apiResource /api/admin/sports`
- `apiResource /api/admin/stadiums`
- `apiResource /api/admin/users`
- `apiResource /api/admin/reservations`
- `apiResource /api/admin/payments`
- `apiResource /api/admin/reviews`
- Contact message and admin notification routes

## Production Notes

- Do not commit `.env`, `vendor`, `node_modules`, build output, local database files, or logs.
- Replace fake payment with a real PayPal flow before accepting real money.
- Configure production mail settings before using admin replies.
- Configure production storage for stadium images.
- Set correct Google OAuth redirect URI for the deployed domain.
- Run `npm run build` before deploying the frontend.
- Run Laravel migrations on the production database.

## Current Status

The project is functional locally with seeded data, admin/user roles, stadium reservations, fake payments, favorites, reviews, multilingual UI, and admin management tools.
>>>>>>> aa3d46a (dockerize RentSpot development environment)
