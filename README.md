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
