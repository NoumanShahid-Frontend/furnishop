# Furniture Website (React)

A modern furniture e‑commerce frontend built with React, Tailwind CSS, and React Router. It includes user auth, product browsing, cart/checkout, profile management, and an Admin Dashboard with summary graphs.

## Features
- Product catalog, details, search, and cart/checkout flow
- User registration, login, and profile management
- Admin panel to manage products, orders, and users
- Dashboard overview with interactive charts (Recharts)
- Responsive UI styled with Tailwind CSS

## Tech Stack
- React 18, React Router
- Tailwind CSS
- Axios for API requests
- Recharts for dashboard charts

## Prerequisites
- Node.js (LTS recommended) and npm
- Backend API available at `http://localhost:5000/api`

The frontend axios instance is configured here: `src/api/axios.js` with:
```
baseURL: http://localhost:5000/api
```
Ensure your backend is running on that address or update the baseURL accordingly.

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Start development server:
   ```
   npm start
   ```
3. Build for production:
   ```
   npm run build
   ```
4. Run tests:
   ```
   npm test
   ```

## Admin Dashboard Charts
The Admin Dashboard shows:
- Orders (Last 14 Days) — bar chart of daily order counts
- Revenue (Last 14 Days) — line chart of daily revenue totals
- Order Status — bar chart of paid/unpaid and delivered/undelivered
- Top Categories — bar chart of product categories by count

Implementation uses Recharts and lives in:
- `src/pages/AdminDashboard.js`

Access the admin panel at `/admin`. It requires an authenticated user with admin privileges (`isAdmin`).

## Styling
- Tailwind CSS is configured in `tailwind.config.js`
- Primary color and theme utilities are available and used across components

## Project Structure (selected)
- `src/pages` — page components (Home, Products, Cart, Checkout, Profile, AdminDashboard)
- `src/components` — shared and admin components
- `src/context` — Auth and Cart contexts
- `src/api/axios.js` — axios instance

## Notes
- Update `src/api/axios.js` `baseURL` if your backend runs on a different host/port.
- Ensure your backend exposes routes `/products`, `/orders`, and `/users` used by the dashboard.

