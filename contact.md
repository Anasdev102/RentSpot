Implement a professional Contact Messages system for RENTSPOT.

Context:

* Project: Sports reservation platform
* Backend: Laravel API
* Frontend: React + Vite + Tailwind
* Auth: Laravel Sanctum
* Roles: admin and client/user

Goal:
When a user sends a contact message, save it in the database and show it in the admin dashboard. Do not send email for now.

Requirements:

1. Backend Laravel
   Create a `contacts` table with:

* id
* user_id nullable, foreign key to users
* name
* email
* subject nullable
* message text
* status enum: unread, read, replied
* timestamps

2. Contact API
   Create endpoint:
   POST /api/contact

Behavior:

* Guest users can send messages
* Logged-in users can send messages too
* If user is authenticated, link message with `user_id`
* Validate name, email, message
* Save message in database
* Return JSON success response

3. Admin API
   Create endpoints protected by auth:sanctum and admin middleware:
   GET /api/admin/contact-messages
   GET /api/admin/contact-messages/{id}
   PATCH /api/admin/contact-messages/{id}/read
   PATCH /api/admin/contact-messages/{id}/replied
   DELETE /api/admin/contact-messages/{id}

4. Admin Dashboard UI
   Create a modern admin page called “Contact Messages”.

Display:

* sender name
* email
* subject
* short message preview
* status badge: unread / read / replied
* created date
* actions: view, mark as read, mark as replied, delete

5. Message Details Modal/Page
   When admin clicks view:

* show full message
* show user info if message is linked to an account
* show name, email, subject, message, date, status

6. Frontend Contact Page
   Create or update client Contact page:

* If user is logged in, prefill name and email from account
* If guest, allow manual name and email input
* Fields: name, email, subject, message
* Show success message after sending
* Show validation errors if needed

Design:

* Clean SaaS dashboard style
* Tailwind CSS
* Responsive
* Simple and professional
* No notification bell for client side
* Contact messages are only managed by admin

Important:
Use clean reusable components and organized code structure.
