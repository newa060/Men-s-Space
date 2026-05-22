# Aesthete Studio Backend Integration Documentation

This document outlines the backend architecture, database schema, authentication setup, and API structure implemented for the **Aesthete Studio** web application.

---

## 1. Supabase Architecture & Database Setup

The backend leverages **Supabase** for PostgreSQL database hosting, authentication, row-level security (RLS), and real-time synchronization.

### Migration Schema
The SQL database is initialized using the migration script at [`supabase/migrations/001_initial_schema.sql`](file:///c:/Users/predator/Desktop/Men's Space/supabase/migrations/001_initial_schema.sql).

It creates the following tables:
- **`profiles`**: User accounts (roles: `customer` and `admin`). Tied to Supabase `auth.users` via a trigger on user registration.
- **`products`**: Inventory items (sizes, images, price in cents, stock, categories).
- **`addresses`**: Customer shipping addresses.
- **`orders`**: Checkout records containing item counts, summaries, total prices, and transaction states.
- **`order_items`**: Individual items associated with an order.
- **`cms_settings`**: Global settings for storefront assets (hero banners, featured category).
- **`feedback`**: Community feedback/testimonials.

### Row-Level Security (RLS)
The database enforces strict RLS policies:
- **`products` / `cms_settings` / `feedback` (Approved)**: Read access is public. Write operations are restricted to `admin` profiles.
- **`profiles` / `addresses` / `orders` / `order_items`**: Read and write operations are restricted to the owner (`auth.uid() = user_id`) or `admin` profiles.

---

## 2. Environment Variables

Create a `.env.local` file in the root directory based on the `.env.local.example` template:

```env
# Supabase API Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary CDN Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 3. Server-Side Contexts & Auth Middleware

### Middleware Auth Guard (`middleware.ts`)
The edge middleware (`middleware.ts`) intercepts requests and protects paths:
- **`/admin/*`**: Checked against Supabase authentication and verified for the `admin` role from the user's metadata/profile. Unauthorized users are redirected to `/sign-in`.
- **Protected Customer Routes**: Ensures valid JWT sessions for checkout and profile access.

---

## 4. API Endpoints Reference

### Public / Storefront API
- **`GET /api/products`**: Fetch all active store products.
- **`GET /api/products/[slug]`**: Fetch product details by slug.
- **`GET /api/cms`**: Fetch public hero sections and landing page settings.
- **`GET /api/feedback`**: Fetch approved community reviews.
- **`POST /api/feedback`**: Submit customer testimonial (defaults to unapproved).

### Auth API
- **`POST /api/auth/register`**: Registers a new user. Automatically invokes the database trigger to seed a profile with a `customer` role.
- **`POST /api/auth/login`**: Authenticates user credentials and sets stateful browser session cookies.
- **`POST /api/auth/logout`**: Destroys active cookies and signs out.
- **`GET /api/auth/session`**: Validates cookie credentials and returns the active user session metadata.

### Customer API (Requires Authentication)
- **`GET /api/customer/addresses`**: Fetch user shipping addresses.
- **`POST /api/customer/addresses`**: Create a new address.
- **`PUT /api/customer/addresses/[id]`**: Update address details.
- **`DELETE /api/customer/addresses/[id]`**: Delete a shipping address.
- **`GET /api/customer/orders`**: List personal checkout order history.
- **`POST /api/customer/orders`**: Secure server-side validation of checkout prices, inventory deduction, and order placement.

### Admin API (Requires Admin Session)
- **`GET /api/admin/products`**: List all database products (including Draft & Archived states).
- **`POST /api/admin/products`**: Insert new products.
- **`PUT /api/admin/products/[id]`**: Update product specifications or status.
- **`DELETE /api/admin/products/[id]`**: Remove product entry.
- **`GET /api/admin/orders`**: View all customer orders.
- **`PUT /api/admin/orders/[id]`**: Update status of an order (`PENDING`, `PROCESSING`, `SHIPPED`, `COMPLETED`, `CANCELLED`).
- **`PUT /api/admin/cms`**: Modify global header, titles, CTA targets, and imagery.
- **`GET /api/admin/feedback`**: List all submitted community feedback.
- **`PUT /api/admin/feedback/[id]`**: Toggle feedback approval status (`approved: true / false`).
- **`POST /api/admin/upload`**: Secure direct upload endpoint integrating Cloudinary.

---

## 5. Development Command Reference

To run the Next.js development server locally:
```bash
npm run dev
```

To run TypeScript compilation validation:
```bash
npx tsc --noEmit
```

To compile and verify production bundles:
```bash
npm run build
```
