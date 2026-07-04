# ShopHub — E-Commerce Frontend

A full stack e-commerce frontend built with Next.js 16 App Router, Tailwind CSS v4, and Zustand. SSR/ISR pages, infinite scroll, URL-driven filters, persistent cart, and JWT auth with edge-level token validation.

## 🚀 Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** TypeScript (strict)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + OKLCH color space
- **State Management:** [Zustand v5](https://zustand-demo.pmnd.rs/) + `persist` middleware
- **UI Primitives:** [@base-ui/react](https://base-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Tooling:** ESLint, Prettier, pnpm

## 📁 Project Structure

```
├── proxy.ts                # Edge auth proxy — validates token before protected routes
├── app/                    # Next.js App Router (pages, layouts, globals.css)
│   ├── auth/               # Login & Register pages
│   ├── cart/               # Cart page
│   ├── products/           # Product listing (SSR) & detail (ISR) pages
│   ├── layout.tsx          # Root layout with Header, Footer, SEO metadata
│   └── page.tsx            # Landing page
├── components/             # Reusable React components
│   ├── auth/               # LoginForm, RegisterForm
│   ├── cart/               # CartContent, CartItem, CartSummary
│   ├── common/             # Skeleton, ErrorState, EmptyState, Loader
│   ├── layout/             # Container, Header, Footer, CartBadge
│   └── product/            # ProductGrid, ProductCard, ProductFilters,
│                           # ProductGallery, ProductInfo, InfiniteProducts
├── hooks/                  # useDebounce, useInfiniteScroll
├── lib/                    # api.ts — fetch wrapper with SSR auth bridge
├── store/                  # cart.ts, auth.ts (Zustand stores)
├── types/                  # TypeScript interfaces
└── utils/                  # currency.ts
```

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v8+
- A running backend API (see [Backend Setup](#-backend-setup))

## 🏃 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd e-commerce-frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your values:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |

## 🎨 Features

### Pages

| Page | Route | Rendering |
|------|-------|-----------|
| Home / Landing | `/` | Static |
| Product List | `/products` | **SSR** — server-side rendered with cookie auth |
| Product Detail | `/products/[id]` | **ISR** — revalidates every hour |
| Cart | `/cart` | Client (protected by proxy) |
| Login | `/auth/login` | Client |
| Register | `/auth/register` | Client |

### Product List (`/products`)
- Server-side rendered (SSR) with auth token injected from cookie
- Responsive CSS grid layout (`auto-fill`, 1-3 columns)
- **Infinite scrolling** via IntersectionObserver + sentinel element
- **Sticky filter sidebar** (left) on desktop
- Filters: search, category, price range, sort
- **All filter state synced to URL** — shareable and restorable
- Loading skeletons, empty state, error state with retry

### Product Detail (`/products/[id]`)
- Incremental Static Regeneration (ISR) with `revalidate = 3600`
- Image gallery (left) + product details (right) layout
- Add to Cart button with confirmation state
- Dynamic OG metadata per product

### Cart (`/cart`)
- Item list with quantity +/- and remove
- Subtotal, tax (10%), free shipping, total
- **Persists via Zustand `persist` middleware** (localStorage)
- Accessible from Header badge, Product Detail, Cart page

### Authentication
- JWT-based login/register with localStorage token
- Login and Register forms use **React Hook Form** with field-level validation rules (required, email pattern, password min-length, confirm match)
- API errors surface via `setError('root')` and display in an inline banner
- Form submission uses `isSubmitting` for loading state and input disabling
- Token synced to cookie (`setAuthCookie`) for SSR access
- **Edge proxy** (`proxy.ts`) validates token with `GET /api/auth/me` before protected routes
- Invalid/expired tokens are cleared from both localStorage and cookie, with redirect to login
- 401 responses also clear cookie and redirect

### UI/UX
- Premium landing page with glassmorphism, gradient backgrounds, floating animations
- Loading skeletons (3 variants: card, detail, text)
- Reusable error and empty state components
- Responsive: mobile-first with breakpoints at md/lg
- Dark mode via `prefers-color-scheme`
- Custom scrollbar styling

## 🔌 API Contract

All product data comes from **your own backend API**.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products?page=&limit=&search=&category=&minPrice=&maxPrice=&sort=` | Required | Paginated product list |
| GET | `/api/products/:id` | Public | Single product (404 if not found) |
| GET | `/api/categories` | Required | All categories |
| POST | `/api/auth/login` | Public | Login → JWT |
| POST | `/api/auth/register` | Public | Register → JWT |
| GET | `/api/auth/me` | Required | Current user |

**Response envelope:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": {},
  "meta": { "page": 1, "limit": 12, "total": 50, "hasMore": true }
}
```

## 🗄 Backend Setup

The backend is a separate application. Requirements:

1. Choose any stack: Express/FastAPI/ASP.NET Core/etc.
2. Use a relational database (PostgreSQL, SQL Server, MySQL)
3. Create `users`, `products`, `categories` tables matching the data model
4. Seed with 50+ products across multiple categories
5. Implement endpoints with **server-side SQL pagination/search/filtering**
6. Enable CORS for `http://localhost:3000`
7. JWT authentication for protected routes
8. Return proper HTTP status codes (200, 201, 400, 401, 404, 500)
9. `GET /api/products/:id` should be public (no auth) for ISR
10. Run on port 8000 (or configure `NEXT_PUBLIC_API_URL`)
