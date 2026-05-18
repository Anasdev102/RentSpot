# RENTSPOT

RENTSPOT is a full-stack sports field reservation platform. It allows users to discover stadiums, filter by sport or city, view stadium details and photos, create reservations, simulate payments, save favorites, submit reviews, and contact the platform support team. It also includes a complete admin dashboard for managing the main resources of the application.

## Tech Stack

- Backend: Laravel API
- Authentication: Laravel Sanctum
- Frontend: React + Vite
- State Management: Redux Toolkit
- Styling: Tailwind CSS
- HTTP Client: Axios
- Database: MySQL by default, SQLite supported for local testing
- OAuth: Google Login structure via Laravel Socialite
- Payments: Fake payment flow with PayPal-ready structure

## Main Features

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
http://127.0.0.1:8001/api
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
FRONTEND_URL=http://127.0.0.1:5174
GOOGLE_REDIRECT_URI=http://127.0.0.1:8001/auth/google/callback
```

Frontend `.env.example` includes:

```text
VITE_API_URL=http://127.0.0.1:8001/api
VITE_BACKEND_URL=http://localhost:8001
```

For Google OAuth, add the exact redirect URI in Google Cloud Console:

```text
http://127.0.0.1:8001/auth/google/callback
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
- `GET /auth/google/callback`

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
