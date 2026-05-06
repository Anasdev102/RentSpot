# RENTSPOT Design Guidelines

## Project
RENTSPOT is a sports field reservation web app.
Users can search stadiums, view details, reserve time slots, pay online, and leave reviews.
Admins can manage sports, stadiums, reservations, payments, users, and reviews.

## Visual Style
The design must be modern, clean, sporty, premium, and dynamic.
Avoid static or old-style layouts.

Use:
- Rounded cards
- Soft shadows
- Smooth hover effects
- Clean spacing
- Responsive layout
- Modern SaaS booking style

## Colors
Use these colors consistently:

- Primary Blue: #0066FF
- Secondary Green: #35C85A
- Accent Gold: #F5B700
- Light Background: #F8F9FA
- Gray Text: #4A4A4A
- Black Text: #0A0A0A
- White Cards: #FFFFFF
- Dark Footer: #061A33

Rules:
- Background should mostly be #F8F9FA
- Cards should be white
- Main buttons should be blue
- Hover states can use green
- Gold should be used only for ratings, badges, and small highlights
- Do not overuse green and gold

## Typography
Use a modern sans-serif font.
Titles should be bold and clear.
Text must be readable with good contrast.

## Home Page Structure

### 1. Navbar
- Logo: RENTSPOT
- Links: Home, Stadiums, How It Works, Contact
- Right side: Login, Get Started
- Sticky navbar
- White/glass style
- Active link uses blue or green underline

### 2. Hero Section
- Large gradient background from blue to green
- Stadium/sports field image overlay
- Main title:
  “Reserve Your Sports Field in Seconds”
- Subtitle:
  “Find football, padel, tennis and basketball fields near you. Choose your time, pay online, and enjoy the game.”
- Badge row:
  Fast Booking / Secure Payment / Instant Confirmation
- Search box:
  Sport select
  City select
  Date picker
  Search button
- Search box should be white/glass, rounded, with shadow

### 3. Popular Sports
Cards for:
- Football
- Padel
- Tennis
- Basketball

Each card:
- Sport icon
- Sport name
- Small description
- Hover scale + shadow

### 4. Featured Stadiums
Display 3 or 6 stadium cards.

Each card:
- Image
- Available badge
- Favorite icon
- Stadium name
- City
- Price per hour
- Rating
- View Details button

### 5. How It Works
3 steps:
1. Choose a field
2. Select date & time
3. Pay online & play

Use icons and horizontal step layout on desktop.
Use vertical layout on mobile.

### 6. Why Choose RENTSPOT
4 benefit cards:
- Real-time availability
- Secure online payment
- Easy booking
- Trusted fields

### 7. Contact Section
Split layout:
Left side:
- Title: Need Help?
- Text: Contact us for support or reservation questions.
- Phone
- Email
- Location

Right side form:
- Full name
- Email address
- Phone number
- Message
- Send Message button

### 8. Footer
Dark blue footer.
Include:
- Logo
- Short description
- Quick links
- Popular sports
- Legal links
- Newsletter input
- Social icons
- Copyright

## Other Pages

### Stadiums Listing Page
- Filter sidebar: sport, city, price, availability
- Stadium cards grid
- Search results header
- Sort dropdown
- Responsive layout

### Stadium Details Page
- Image gallery
- Stadium info
- City, address, sport, capacity
- Description
- Price per hour
- Rating and reviews
- Date picker
- Available time slots
- Booking summary card
- Reserve button

### Reservation / Checkout Page
- Reservation summary
- Stadium info
- Date and time
- Total price
- Online payment section
- Payment status
- Confirm payment button

### User Dashboard
- Welcome user card
- Profile information
- My reservations
- Reservation status badges:
  pending, confirmed, cancelled, completed
- Payment status badges:
  unpaid, paid, failed, refunded
- Review button after completed reservation

### Admin Dashboard
- Sidebar layout
- Stats cards:
  total users, total sports, total stadiums, reservations, revenue
- Recent reservations table
- Charts section
- Quick actions

### Admin CRUD Pages
Create modern management pages for:
- Sports
- Stadiums
- Reservations
- Payments
- Users
- Reviews

Use:
- Tables
- Search
- Filters
- Add/Edit modals or pages
- Delete confirmation
- Status badges

## Components
Create reusable components:
- Navbar
- Footer
- Button
- Card
- StadiumCard
- SportCard
- SearchBar
- StatusBadge
- SectionHeader
- ContactForm
- AdminSidebar
- DashboardCard
- DataTable

## Responsive Design
The app must work well on:
- Desktop
- Tablet
- Mobile

Mobile:
- Navbar becomes menu
- Cards become one column
- Forms become stacked
- Search bar becomes vertical

## Animation
Use subtle animations only:
- Hover scale on cards
- Button hover transition
- Image zoom on stadium cards
- Smooth section reveal if possible

Do not make animations heavy.

## Important
The final result should look like a real modern SaaS sports booking platform, not a static template.
Keep colors consistent across all pages.
Use the database context file for fields and entities.