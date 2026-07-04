# ShopHub - E-Commerce Frontend: Complete Interview Preparation Guide

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Routing & Rendering Strategies](#4-routing--rendering-strategies)
5. [State Management (Zustand)](#5-state-management-zustand)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [API Integration](#7-api-integration)
8. [Component Architecture](#8-component-architecture)
9. [Styling Approach (Tailwind CSS v4 + OKLCH)](#9-styling-approach)
10. [Key Features Explained](#10-key-features-explained)
11. [Performance Optimizations](#11-performance-optimizations)
12. [Accessibility (a11y)](#12-accessibility)
13. [Potential Interview Questions & Answers](#13-potential-interview-questions--answers)
14. [Architecture Diagram](#14-architecture-diagram)

---

## 1. Project Overview

**Project Name:** ShopHub (internal package name: `my-project`)  
**Version:** 0.1.0 (private)  
**Type:** Full-stack e-commerce frontend application  
**Runtime:** Node.js (Next.js 16 with App Router)  
**Package Manager:** pnpm (with workspace config)

### What does this project do?
ShopHub is a modern e-commerce frontend that allows users to:
- Browse products with advanced filtering and infinite scroll
- View detailed product information
- Add products to a persistent shopping cart
- Register and login to manage their session
- Access protected routes (cart, products) with authentication

### Key Architectural Highlights
- **Hybrid Rendering:** Uses SSR (Server-Side Rendering), SSG (Static Site Generation), and CSR (Client-Side Rendering) strategically across different routes
- **Edge-Level Auth:** Middleware (`proxy.ts`) runs at the edge to validate authentication before protected pages load
- **URL-Driven Filtering:** All product filter state lives in URL query parameters, making states shareable and bookmarkable
- **Persistent State:** Uses Zustand with `persist` middleware to maintain cart and auth state across sessions via localStorage
- **Token Sync Strategy:** JWT token is stored in localStorage and synced to cookies for SSR/edge middleware access
- **Modern Styling:** Tailwind CSS v4 with OKLCH color space for perceptually uniform colors

---

## 2. Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js (App Router) | 16.2.6 | React framework with file-based routing, SSR, ISR |
| **Language** | TypeScript | 5.7.3 | Type safety, strict mode enabled |
| **State Management** | Zustand | 5.0.14 | Lightweight state management with persist middleware |
| **Styling** | Tailwind CSS | 4.2.0 | Utility-first CSS framework (v4 uses CSS-based config) |
| **PostCSS** | postcss + @tailwindcss/postcss | 8.5 / 4.2.0 | CSS transformation pipeline |
| **UI Primitives** | @base-ui/react | 1.5.0 | Unstyled, accessible React UI primitives |
| **Icons** | lucide-react | 1.16.0 | Clean, consistent SVG icon library |
| **Form Handling** | react-hook-form | 7.80.0 | Performant form validation with minimal re-renders |
| **CSS Utility** | class-variance-authority (cva) | 0.7.1 | Managing variant-based class names |
| **Analytics** | @vercel/analytics | 1.6.1 | Vercel analytics (prod only) |
| **Code Formatting** | Prettier | 3.9.4 | Consistent code formatting |
| **Font** | Geist | — | via `next/font/google`, modern sans-serif |
| **Color Space** | OKLCH | — | Perceptually uniform color space |

### Why these choices?
- **Next.js App Router** over Pages Router: Offers nested layouts, server components, streaming, and better SSR/ISR support
- **Zustand** over Redux/Context: Minimal boilerplate, built-in persist middleware, great TypeScript support, tiny bundle size (~1KB)
- **Tailwind CSS v4** over v3: CSS-based configuration (no config file needed), built-in OKLCH support, better performance
- **OKLCH** over HEX/RGB: Perceptually uniform — a 10% lightness change looks like a 10% change to the human eye
- **pnpm** over npm/yarn: Faster, disk-efficient with content-addressable storage, strict dependency isolation
- **React Hook Form** over Formik: React Hook Form minimizes re-renders by using uncontrolled inputs with refs, has a smaller bundle (~9KB vs ~33KB), and provides a cleaner API with `register()`, `handleSubmit()`, and `formState`

---

## 3. Project Structure

```
e-commerce-frontend/
│
├── .env / .env.example          # Environment variables (API URL, Site URL)
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Prettier config (semi, singleQuote, tabWidth 2, trailingComma es5)
├── components.json              # shadcn/ui-style configuration
├── next.config.ts               # Next.js config (TS errors ignored, unoptimized images, Unsplash remote)
├── package.json                 # Project manifest, scripts, dependencies (pnpm.overrides: hono 4.12.25)
├── pnpm-lock.yaml               # Lock file
├── pnpm-workspace.yaml          # pnpm workspace (allowBuilds for @parcel/watcher, msw, sharp)
├── postcss.config.mjs           # PostCSS with @tailwindcss/postcss
├── proxy.ts                     # Edge auth middleware (Next.js Middleware)
├── tsconfig.json                # TypeScript: strict, bundler module resolution, @/* alias
├── next-env.d.ts                # Next.js TypeScript references
│
├── public/                      # Static assets
│   ├── apple-icon.png, icon*.png, icon.svg    # PWA/favicon icons
│   ├── placeholder*.png/svg/jpg               # Placeholder images
│   ├── placeholder-user.jpg                   # Default user avatar
│   ├── placeholder-logo.png/svg               # Brand logo
│   └── images/                                 # Hero & category images
│       ├── electronics.png, fashion.png, hero.png, hero2.png, home.png, sports.png
│
├── app/                         # Next.js App Router (routes = directories)
│   ├── globals.css              # Global styles, Tailwind, OKLCH theme, animations
│   ├── layout.tsx               # Root layout (fonts, metadata, Header, Footer, Analytics)
│   ├── page.tsx                 # Home page (static, hero, features, categories)
│   ├── auth/
│   │   ├── login/page.tsx       # Login page (wraps LoginForm)
│   │   └── register/page.tsx    # Register page (wraps RegisterForm)
│   ├── cart/page.tsx            # Cart page (wraps CartContent)
│   └── products/
│       ├── page.tsx             # Products listing (SSR, filters + infinite scroll)
│       └── [id]/page.tsx        # Product detail (SSG, via generateStaticParams)
│
├── components/                  # Reusable React components
│   ├── auth/                    # Auth forms
│   │   ├── LoginForm.tsx        # React Hook Form with email/password validation, loading, password visibility toggle
│   │   └── RegisterForm.tsx     # React Hook Form with name/email/password/confirm validation
│   ├── cart/                    # Cart components
│   │   ├── CartContent.tsx      # Cart page layout (items + summary)
│   │   ├── CartItem.tsx         # Line item with quantity controls, remove
│   │   └── CartSummary.tsx      # Subtotal, tax, shipping, total
│   ├── common/                  # Reusable primitives
│   │   ├── EmptyState.tsx       # Icon + message + action for empty states
│   │   ├── ErrorState.tsx       # Error display with retry action
│   │   ├── Loader.tsx           # Spinning loader (sm/md/lg)
│   │   └── Skeleton.tsx         # Loading skeleton (card/detail/text variants)
│   ├── layout/                  # Layout shell components
│   │   ├── CartBadge.tsx        # Cart count badge (99+ max display)
│   │   ├── Container.tsx        # Max-width 7xl wrapper
│   │   ├── Footer.tsx           # 4-column footer
│   │   └── Header.tsx           # Sticky header with auth, cart, mobile menu
│   └── product/                 # Product features
│       ├── InfiniteProducts.tsx # Infinite scroll manager
│       ├── ProductCard.tsx      # Product card with image, rating, price
│       ├── ProductFilters.tsx   # URL-driven sidebar filters
│       ├── ProductGallery.tsx   # Single product image display
│       ├── ProductGrid.tsx      # Auto-fill responsive CSS grid
│       └── ProductInfo.tsx      # Product details + add-to-cart
│
├── hooks/                       # Custom React hooks
│   ├── useDebounce.ts           # Generic debounce hook
│   └── useInfiniteScroll.ts     # IntersectionObserver-based infinite scroll
│
├── lib/                         # Core library
│   ├── api.ts                   # API client (fetch wrapper, token injection, auth/product APIs)
│   └── utils.ts                 # cn() class merge utility (clsx + tailwind-merge)
│
├── store/                       # Zustand state management
│   ├── auth.ts                  # Auth store (user, token, login/register/logout, persist, cookie sync)
│   └── cart.ts                  # Cart store (items, add/remove/update/clear, persist)
│
├── types/                       # TypeScript type definitions
│   └── index.ts                 # All interfaces: User, Product, Category, ApiResponse, CartItem, CartState, AuthState, SortOption
│
├── utils/                       # Utility functions
│   └── currency.ts              # formatPrice() (Intl.NumberFormat for USD)
│
├── .next/                       # Next.js build output (gitignored)
└── node_modules/                # Dependencies (gitignored)
```

---

## 4. Routing & Rendering Strategies

This project uses **Next.js App Router** which provides file-system based routing. Each folder under `app/` becomes a route segment.

### Route Table

| Route | File | Rendering Strategy | Auth Required | Strategy Rationale |
|-------|------|--------------------|---------------|-------------------|
| `/` | `app/page.tsx` | **Static** (default) | No | Content doesn't change frequently; can be pre-built and cached |
| `/products` | `app/products/page.tsx` | **SSR** | Yes | Dynamic content per user (needs auth), filters change URL params |
| `/products/[id]` | `app/products/[id]/page.tsx` | **SSG** | No | Product details change rarely; API is public; SSG pre-builds up to 200 pages at build time |
| `/cart` | `app/cart/page.tsx` | **Static shell + Client content** | Yes (via middleware) | Cart reads from localStorage; shell is static, content is client-rendered |
| `/auth/login` | `app/auth/login/page.tsx` | **Client** | No | Form with client-side state |
| `/auth/register` | `app/auth/register/page.tsx` | **Client** | No | Form with client-side state |

### Rendering Strategy Deep-Dive

**Why SSR for Products Listing?**
- The products page is protected (requires auth) so it cannot be statically generated
- URL query parameters (search, category, price, sort) need to be read server-side for initial data fetch
- Server reads the `authToken` cookie, injects it into the API module, fetches the first page of products and categories, and renders everything server-side
- The client then takes over for subsequent page fetches (infinite scroll) via the API client

**Why SSG for Product Detail?**
- Product detail pages are public (no auth required) so they can be statically generated
- Product information changes infrequently (price, description, stock)
- `generateStaticParams()` pre-builds up to 200 product pages at build time from the first API page
- Benefits: fastest possible page loads (pre-built HTML served directly from CDN), zero server load for these pages
- Since product data is relatively stable, full static generation is appropriate without periodic revalidation

**How SSG works:**
1. At build time: `generateStaticParams()` fetches up to 200 product IDs
2. Each product page is pre-rendered into static HTML during the build
3. Pages are served directly from cache/CDN without any server execution
4. To update content, the application must be rebuilt and redeployed

---

## 5. State Management (Zustand)

The project uses **Zustand** with its `persist` middleware for two stores. Zustand was chosen over Redux/MobX for its simplicity, minimal boilerplate, small bundle size (~1KB), and excellent TypeScript support.

### Auth Store (`store/auth.ts`)

**Purpose:** Manages user authentication state across the entire application.

**Persisted Key:** `auth-storage` (localStorage)  
**Partialize (what gets persisted):** Only `token`, `user`, `isAuthenticated` — NOT `isLoading` or `error` (transient UI state)

**State:**
```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
| Action | Description | API Call |
|--------|-------------|----------|
| `initialize()` | Called on mount. Reads token from localStorage, validates via `GET /api/auth/me`, syncs cookie | `authApi.getCurrentUser()` |
| `login(email, password)` | Authenticates user, stores token + user, syncs to cookie | `authApi.login()` |
| `register(name, email, password)` | Creates account, stores token + user, syncs to cookie | `authApi.register()` |
| `logout()` | Clears token & user from store + localStorage + cookie | — |
| `clearError()` | Resets error message | — |

**Token-to-Cookie Sync:**
- On login/register/rehydration, `setAuthCookie()` writes the JWT token to an `authToken` cookie (7-day expiry, SameSite=Lax)
- This cookie bridge enables SSR and edge middleware to read the token
- Cookie is deleted on logout

**Rehydration:** When Zustand rehydrates from localStorage (on page load), the store re-syncs the token to cookie and sets it in the API module for client-side requests.

### Cart Store (`store/cart.ts`)

**Purpose:** Manages shopping cart items persistently across sessions.

**Persisted Key:** `cart-storage` (localStorage)

**State:**
```typescript
{
  items: CartItem[]  // CartItem = { productId: string, name: string, price: number, image: string, quantity: number }
}
```

**Actions:**
| Action | Description |
|--------|-------------|
| `addItem(item)` | Adds item to cart. If item already exists (by product ID), merges the quantity instead of duplicating |
| `removeItem(productId)` | Removes item by product ID |
| `updateQuantity(productId, quantity)` | Updates quantity. If quantity < 1, removes the item |
| `clearCart()` | Empties all items |

### Why Zustand over alternatives?

| Aspect | Zustand | Redux | Context API |
|--------|---------|-------|-------------|
| Bundle size | ~1KB | ~12KB | 0 (built-in) |
| Boilerplate | Minimal | Actions, reducers, dispatch | Provider, consumer |
| Persist middleware | Built-in | Needs library | Needs library |
| Performance | Selector-based re-renders | Selector-based | Re-renders all consumers |
| TypeScript | Excellent | Good | Good |
| Learning curve | Low | High | Low (but limited) |

---

## 6. Authentication & Authorization

### Architecture Overview

There are **three layers** of authentication in this project:

```
┌─────────────────────────────────────────────┐
│  1. Edge Middleware (proxy.ts)               │
│     - Runs on every protected route request  │
│     - Checks authToken cookie                │
│     - Validates via /api/auth/me             │
│     - Redirects to /auth/login if invalid    │
├─────────────────────────────────────────────┤
│  2. SSR Page (app/products/page.tsx)         │
│     - Reads authToken cookie on server       │
│     - Injects token into API module          │
│     - Fetches data server-side               │
├─────────────────────────────────────────────┤
│  3. Client-Side (store/auth.ts + api.ts)     │
│     - Token stored in localStorage           │
│     - API client injects Bearer token        │
│     - 401 responses trigger redirect to login│
└─────────────────────────────────────────────┘
```

### Layer 1: Edge Middleware (`proxy.ts`)

Next.js Middleware runs at the **edge** (before the request reaches the page) for every matching route.

**Matcher:** `/products/:path*`, `/cart/:path*`

**Flow:**
1. Check for `authToken` cookie in the request
2. **No cookie + protected route** → redirect to `/auth/login?redirect=<original_path>`
3. **Has cookie** → validate by calling `GET /api/auth/me` with Bearer token
4. **Validation fails (non-OK)** → delete cookie, redirect to `/auth/login`
5. **Network error** → allow through (fail-open — prevents blocking users on network issues)

```typescript
// proxy.ts simplified flow
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  if (!token) return redirectToLogin(request);

  const validationResponse = await fetch(`${apiUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!validationResponse.ok) {
    request.cookies.delete('authToken');
    return redirectToLogin(request);
  }

  return NextResponse.next();
}
```

### Layer 2: SSR Auth Bridge

The products page (`app/products/page.tsx`) is a server component that:
1. Accesses the `authToken` cookie via Next.js's `cookies()` function
2. Passes it to the API module via `setServerToken(token)`
3. Fetches initial products and categories server-side
4. Renders HTML with server-fetched data

This means even on the first page load, the user sees fully rendered content — no loading spinners for initial data.

### Layer 3: Client-Side Auth

- Zustand `auth` store persists `token` to localStorage under key `auth-storage`
- On mount, the Header component calls `initialize()` in a `useEffect`, which:
  1. Reads token from localStorage
  2. Validates it via `GET /api/auth/me`
  3. If valid: sets user + isAuthenticated
  4. If invalid: clears token, user is anonymous
- API client (`lib/api.ts`) automatically injects `Authorization: Bearer <token>` into every request
- On 401 response, `clearTokenAndRedirect()` clears auth state and redirects to login

### Protected Routes vs Public Routes

| Route | Protected | Why |
|-------|-----------|-----|
| `/` | No | Landing page, public content |
| `/products` | Yes | Products API requires auth; personalized experience |
| `/products/[id]` | No | Product detail is public; SSG pre-builds at compile time |
| `/cart` | Yes | Cart content is user-specific |
| `/auth/login` | No | Login page must be accessible |
| `/auth/register` | No | Registration must be accessible |

---

## 7. API Integration

### API Client Architecture (`lib/api.ts`)

The API client is a centralized fetch wrapper that handles:
- Base URL injection
- Auth token injection
- Error handling (401 → redirect)
- SSR token bridging
- Type-safe responses

**Key Functions:**

```typescript
// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,         // e.g., "/products?page=1&limit=12"
  options?: RequestOptions  // method, body, headers, isFormData
): Promise<ApiResponse<T>>

// Token sourcing order (client-side):
// 1. localStorage('authToken') — manually stored
// 2. Zustand persisted auth-storage — Zustand's persisted state
// 3. __serverToken — injected by SSR page

// On 401:
// - Clears token from localStorage
// - Deletes authToken cookie
// - Redirects to /auth/login
// - Throws error
```

**API Modules:**

```typescript
// Auth API
authApi = {
  login(email, password): { user, token }         // POST /auth/login
  register(name, email, password): { user, token } // POST /auth/register
  logout(): void                                    // Clears local state
  getCurrentUser(): User                           // GET /auth/me
}

// Product API
productApi = {
  getProducts(params): { data: Product[], meta }   // GET /products?page=&limit=&search=...
  getProductById(id): Product                      // GET /products/:id
  getCategories(): Category[]                      // GET /categories
}
```

**API Response Envelope:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "hasMore": true
  }
}
```

### Filter Parameters (for `getProducts`)

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number (1-indexed) |
| `limit` | number | `12` | Items per page |
| `search` | string | `"wireless"` | Search keyword |
| `category` | string | `"electronics"` | Filter by category slug |
| `minPrice` | number | `10` | Minimum price |
| `maxPrice` | number | `100` | Maximum price |
| `sort` | string | `"price_asc"` | Sort order |

### SSR vs Client Data Flow

**SSR Flow (Products page - first load):**
```
Request → Edge Middleware (validate token) → Server Component
  → Read authToken cookie → setServerToken(token)
  → productApi.getProducts(searchParams) → fetch /api/products?...
  → productApi.getCategories() → fetch /api/categories
  → Render HTML with initial data
  → Send to client
```

**Client Flow (Products page - infinite scroll):**
```
Initial SSR data already rendered → user scrolls → IntersectionObserver fires
  → productApi.getProducts({page: next, ...filters}) → fetch /api/products?...
  → Append deduplicated products to state
  → Re-render grid with new items
```

---

## 8. Component Architecture

### Component Hierarchy

```
app/layout.tsx (RootLayout - Server Component wrapper)
├── Header (Client Component)
│   ├── Logo + "ShopHub" brand
│   ├── Navigation section
│   │   ├── Login/SignUp buttons (if not authenticated)
│   │   └── User name + Logout button (if authenticated)
│   ├── Cart link with CartBadge (reads useCartStore)
│   └── Mobile hamburger menu (responsive)
│
├── <main>{children}</main>
│   ├── Home Page (Static)
│   │   ├── Hero section (gradient background, CTA button)
│   │   ├── Features Bento Grid (3-column grid of feature cards)
│   │   ├── Category Cards (links to /products?category=slug)
│   │   └── CTA Section (secondary call-to-action)
│   │
│   ├── Products Page (SSR + Client interactive)
│   │   ├── ProductFilters (Client)
│   │   │   ├── Search input (debounced 300ms, syncs to URL)
│   │   │   ├── Category checkboxes (collapsible, show more/less for >5)
│   │   │   ├── Price range (min/max inputs)
│   │   │   └── Sort by dropdown (default, price asc/desc, newest, top rated)
│   │   └── InfiniteProducts (Client)
│   │       ├── ProductGrid (CSS grid, auto-fill, minmax(240px, 1fr))
│   │       │   └── ProductCard × N (image, badge, title, rating, price)
│   │       └── Sentinel div (IntersectionObserver target) + Loader/Skeleton
│   │
│   ├── Product Detail Page (SSG)
│   │   ├── Breadcrumb navigation
│   │   ├── ProductGallery (Client - single image, aspect-square, loading state)
│   │   └── ProductInfo (Client)
│   │       ├── Category badge + title + star rating + price
│   │       ├── Description
│   │       ├── Metadata grid (category, stock availability)
│   │       ├── Quantity selector (+/- buttons, stock limit check)
│   │       └── Add to Cart button (auth gate, confirmation feedback)
│   │
│   ├── Cart Page (Static shell + Client content)
│   │   └── CartContent (Client)
│   │       ├── Cart items list
│   │       │   └── CartItem × N (image, name, price, quantity input, remove, line total)
│   │       └── CartSummary (sticky sidebar)
│   │           ├── Subtotal
│   │           ├── Tax (10%)
│   │           ├── Shipping (free)
│   │           └── Total + Checkout button
│   │
│   ├── Login Page
│   │   └── LoginForm (Client)
│   │       ├── Email input
│   │       ├── Password input (with visibility toggle)
│   │       ├── Error alert (on failure)
│   │       └── Submit button (with loading state)
│   │
│   └── Register Page
│       └── RegisterForm (Client)
│           ├── Name input
│           ├── Email input
│           ├── Password input
│           ├── Confirm Password input
│           ├── Validation feedback (required, email format, password match)
│           ├── Error alert (on failure)
│           └── Submit button (with loading state)
│
└── Footer
    ├── Brand column (logo, short description)
    ├── Quick Links column (products, cart, login)
    ├── Support column (contact us, FAQ, shipping info)
    └── Legal column (privacy policy, terms of service, returns)
```

### Client vs Server Component Boundaries

```
Layout (Server by default)
├── Header (CLIENT - needs interactivity: auth toggle, cart badge, mobile menu)
├── Children (depends on page)
└── Footer (can be Server, but currently imports no explicit "use client")

Products Page (SERVER - SSR with searchParams)
├── ProductFilters (CLIENT - needs useState, useSearchParams, interactivity)
└── InfiniteProducts (CLIENT - needs useState, useEffect, IntersectionObserver)

Product Detail (SERVER - SSG with generateStaticParams)
├── ProductGallery (CLIENT - needs useState for loading state)
└── ProductInfo (CLIENT - needs interactivity: quantity, add to cart)
```

### Naming Conventions
- **Files:** PascalCase for components (`ProductCard.tsx`), camelCase for utilities (`currency.ts`, `api.ts`)
- **Components:** PascalCase, descriptive names
- **Hooks:** `use` prefix, camelCase (`useDebounce`, `useInfiniteScroll`)
- **Stores:** lowercase, feature-based (`auth`, `cart`)
- **Types:** PascalCase interfaces (`Product`, `User`, `ApiResponse<T>`)
- **Enums:** PascalCase (`SortOption`)

---

## 9. Styling Approach

### Tailwind CSS v4 Configuration

Unlike Tailwind v3 (which uses a `tailwind.config.js` file), **Tailwind v4 uses CSS-based configuration** via the `@theme` directive in `globals.css`.

```css
/* app/globals.css */
@import "tailwindcss";  /* Single import, no config file needed */

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-heading: var(--font-sans);
  --font-sans: var(--font-geist-sans), 'Geist Fallback';
  --font-mono: var(--font-geist-mono), 'Geist Mono Fallback';
  --color-ring: var(--ring);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}
```

### OKLCH Color Space

OKLCH is a modern color space designed for **perceptual uniformity** — meaning a change of the same magnitude in any direction looks like the same change to the human eye.

**Why OKLCH over HEX/RGB?**
- **Perceptual uniformity:** `oklch(0.5 0.2 250)` and `oklch(0.5 0.2 260)` look equally different from `oklch(0.5 0.2 255)`
- **Easy to create accessible contrast:** Lightness (L) is a direct value — you know `oklch(0.13 ...)` will be dark and `oklch(0.985 ...)` will be light
- **Chroma (C) and Hue (H):** Chroma controls saturation intensity, Hue controls color — intuitive to adjust
- **Dark mode:** Simply swap foreground/background lightness values while keeping the same chroma/hue

**Dark Mode Strategy:**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.13 0.028 261.69);
    --foreground: oklch(0.985 0.003 247.86);
    --card: oklch(0.17 0.028 261.69);
    --primary: oklch(0.707 0.165 254.62);
    --primary-foreground: oklch(0.13 0.028 261.69);
    --secondary: oklch(0.257 0.037 261.69);
    --muted: oklch(0.257 0.037 261.69);
    --muted-foreground: oklch(0.707 0.022 261.69);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 12%);
    --ring: oklch(0.707 0.165 254.62);
  }
}
```

Note: Uses `prefers-color-scheme` media query (system preference), not manual toggle. No dark mode switch UI is implemented.

### CSS Variables Usage

All components use CSS custom properties for theming:
- `bg-background` / `text-foreground` — page background and text
- `bg-card` / `text-card-foreground` — card surfaces
- `border-border` — borders and dividers
- `text-muted-foreground` — secondary/subtle text
- `bg-primary` / `text-primary-foreground` — primary actions
- `bg-destructive` / `text-destructive-foreground` — destructive actions

### Styling Patterns Used

| Pattern | Example | Purpose |
|---------|---------|---------|
| Utility-first | `flex items-center gap-2` | Direct styling without custom CSS |
| Glassmorphism | `bg-background/80 backdrop-blur-lg border-border/40` | Sticky header with blur effect |
| Gradient | `bg-linear-to-r from-primary/80 to-secondary/80` | Hero section, feature cards |
| Hover transitions | `transition-all hover:scale-105` | Interactive feedback |
| Responsive | `max-md:hidden`, `lg:grid-cols-3` | Mobile-first responsive design |
| Focus rings | `focus:ring-2 focus:ring-primary/10` | Keyboard accessibility |
| Animations | `animate-float`, `animate-float-delayed` | Floating background elements |

### `cn()` Utility (`lib/utils.ts`)
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
- `clsx`: Conditionally join class names (handles strings, objects, arrays)
- `tailwind-merge`: Intelligently merges Tailwind classes, resolving conflicts (e.g., `px-4 px-6` → `px-6`)

---

## 10. Key Features Explained

### 10.1 URL-Driven Filtering

**How it works:**
1. `ProductFilters` reads current filter values from URL `searchParams` via `useSearchParams()`
2. When a user changes a filter, `router.push()` updates the URL with new query parameters
3. The URL change triggers the `ProductsPage` server component to re-fetch data with new params
4. Client-side: `InfiniteProducts` reads `searchParams` via `useSearchParams()` and resets the product list

**Filters synced to URL:**
```
/products?search=wireless&category=electronics&category=accessories&minPrice=10&maxPrice=200&sort=price_asc
```

**Why URL-driven?**
- **Shareable:** Users can share filter URLs
- **Bookmarkable:** Save specific filter combinations
- **Back/Forward:** Browser navigation restores filter state
- **SSR-friendly:** Server reads searchParams for initial data fetch

**Search Debouncing:**
- Search input has a 300ms debounce (`useDebounce` hook)
- Prevents excessive URL updates and API calls while user is still typing
- The debounced value is synced to the URL, not the raw input value

**Category Filter UX:**
- Categories are checkboxes (multiple selection allowed)
- Categories are grouped under a collapsible "Categories" section
- If >5 categories, only first 5 are shown with a "Show more" / "Show less" toggle
- Selected categories appear as active filters

### 10.2 Infinite Scroll

**Implementation (`useInfiniteScroll` hook):**
```typescript
function useInfiniteScroll(
  callback: () => void,
  options: { threshold?: number; rootMargin?: string } = {}
): { sentinelRef: RefObject<HTMLDivElement | null> } {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { threshold = 0.1, rootMargin = '0px' } = options;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callback();
      },
      { threshold, rootMargin }
    );

    observer.observe(sentinel);
    return () => observer.unobserve(sentinel);
  }, [callback, threshold, rootMargin]);

  return { sentinelRef };
}
```

**How it's used in `InfiniteProducts`:**
1. Initial SSR data is passed as initial products
2. A sentinel `<div>` is placed at the bottom of the product grid
3. When the sentinel becomes visible (>10% in viewport), `loadMore()` is called
4. `loadMore` fetches the next page via `productApi.getProducts()`
5. New products are appended with deduplication (checks by `product.id`)
6. If `meta.hasMore` is false, the observer stops firing
7. Loading state shows `<Loader>` and `<Skeleton>` components

**Deduplication:**
```typescript
const existingIds = new Set(products.map(p => p.id));
const newUnique = [...data].filter(p => !existingIds.has(p.id));
setProducts(prev => [...prev, ...newUnique]);
```

### 10.3 Add to Cart Flow

```
User clicks "Add to Cart" on ProductInfo page
  → Check if user is authenticated (useAuthStore)
  → If NOT authenticated → redirect to /auth/login?redirect=/products/{id}
  → If authenticated:
    → Call addItem({ product, quantity })
    → Cart store adds/merges item
    → Show confirmation state on button (success feedback)
    → CartBadge updates automatically (reads useCartStore)
```

**Quantity Management:**
- User can increment/decrement quantity via +/- buttons
- Min quantity: 1
- Max quantity: product stock level (`Math.min(product.stock || 99, 99)`)
- If stock is 0: button shows "Out of Stock" and is disabled

### 10.4 Cart Management

**CartItem features:**
- Product image, name, unit price display
- Quantity input with +/- buttons
- Line total (price × quantity) automatically calculated
- Remove button with trash icon
- Quantity update debounced or on blur

**CartSummary features:**
- Subtotal: sum of all line totals
- Tax: 10% of subtotal (hardcoded rate)
- Shipping: Free (not implemented beyond display)
- Total: subtotal + tax + shipping
- Checkout button (no backend endpoint yet — likely placeholder)

**Empty State:**
- When cart has 0 items, CartContent shows `EmptyState` with:
  - ShoppingCart icon
  - Title: "Your cart is empty"
  - Description: "Start shopping to add items to your cart"
  - Action button: "Start Shopping" → links to `/products`

### 10.5 Auth Forms

Both forms use **React Hook Form** for field registration, validation, and submission handling.

**LoginForm:**
- Uses `useForm<LoginFormFields>()` with typed fields
- Email: `register('email', { required, pattern: /^\S+@\S+$/i })`
- Password: `register('password', { required })`
- Password visibility toggle (eye/eye-off icons)
- `handleSubmit(onSubmit)` wraps the async `login()` call
- API errors surface via `setError('root', { message })` and display in a `role="alert"` banner
- Field-level `errors.email?.message` and `errors.password?.message` shown below inputs
- Submit button uses `isSubmitting` for loading state ("Signing in...") and input disabling
- On success: redirects to `/products`

**RegisterForm:**
- Uses `useForm<RegisterFormFields>()` with typed fields
- Name: `register('name', { required })`
- Email: `register('email', { required, pattern })`
- Password: `register('password', { required, minLength: 6 })`
- Confirm Password: `register('confirmPassword', { required, validate: (v) => v === getValues('password') || 'Passwords do not match' })`
- Field-level error messages shown below each input on validation failure
- On success: auto-logged in, redirect to `/products`

---

## 11. Performance Optimizations

| Optimization | Where | How |
|-------------|-------|-----|
| **SSG** | Product detail pages | `generateStaticParams()` — pre-built at build time, served from CDN |
| **SSR** | Products listing | Initial data fetched and rendered server-side, no client waterfall |
| **Image optimization** | next.config.ts | `images.unoptimized: true` (for deployment without Sharp), Unsplash remote pattern |
| **Debounced search** | ProductFilters | 300ms debounce prevents excessive API calls |
| **Infinite scroll** | Products listing | Loads only next page on demand, not all products at once |
| **Deduplication** | InfiniteProducts | Prevents duplicate products from overlapping pagination |
| **Zustand selectors** | All components | Components re-render only when their selected state changes |
| **CSS variables** | globals.css | Theme values computed once, efficient repaints |
| **Backdrop blur** | Header | `backdrop-blur-lg` — hardware-accelerated blur |
| **@vercel/analytics** | layout.tsx | Loaded only in production (`process.env.NODE_ENV === 'production'`) |
| **TypeScript strict** | tsconfig.json | Catches type errors at build time (though build ignores them) |
| **No testing overhead** | — | No test setup means faster CI (but also a gap) |

---

## 12. Accessibility

| Feature | Implementation | Location |
|---------|---------------|----------|
| **ARIA labels** | `aria-label` on interactive icons/buttons | Header, CartBadge, Loader |
| **Role attributes** | `role="alert"` on errors, `role="status"` on loaders | ErrorState, Loader |
| **Busy indicators** | Loader component with `aria-busy` (button uses `disabled` attribute) | LoginForm, RegisterForm, ProductInfo |
| **Screen reader text** | `sr-only` class for text visible only to screen readers | Rating stars, Loader |
| **Focus indicators** | `focus:ring-2 focus:ring-primary/10` on all interactive elements | global |
| **Focus visible** | `focus-visible:outline-none` with ring fallback | global |
| **Semantic HTML** | `<main>`, `<nav>`, `<section>`, `<footer>`, `<aside>` | Layout, pages |
| **Form labels** | `<label>` elements properly associated with inputs | LoginForm, RegisterForm |
| **Field validation** | `errors.field?.message` shown as `<p>` below each input | LoginForm, RegisterForm |
| **Password toggle** | Eye icon button toggles password visibility | LoginForm |
| **Required fields** | React Hook Form `required` validation rule on form fields | LoginForm, RegisterForm |

---

## 13. Potential Interview Questions & Answers

### Architecture & Design

**Q: Why did you choose Next.js App Router over the Pages Router?**
A: The App Router provides native support for server components, nested layouts, streaming, and SSG/ISR. This allows us to strategically choose rendering strategies per route — SSR for dynamic auth-protected pages, SSG for public content, and static generation for landing pages. The file-system routing also makes the codebase more intuitive.

**Q: Why Zustand instead of Redux?**
A: Zustand is significantly lighter (~1KB vs ~12KB), requires far less boilerplate (no reducers, actions, dispatch), has built-in persist middleware, and excellent TypeScript support. For an e-commerce project of this scale, Redux would be overkill. Zustand's selector-based re-rendering also gives us good performance without any configuration.

**Q: How does the authentication flow work end-to-end?**
A: There are three layers. First, the edge middleware (proxy.ts) runs on every protected route request — it checks for an authToken cookie and validates it against /api/auth/me before the page loads. Second, for SSR pages, the server component reads the same cookie and injects the token into the API module for server-side data fetching. Third, on the client side, Zustand persists the token to localStorage, the API client automatically injects it into requests, and 401 responses trigger a redirect to login. This layered approach ensures auth is validated at every level.

**Q: How do you handle state persistence and SSR together?**
A: Zustand's persist middleware saves auth and cart state to localStorage. For SSR, we use a cookie bridge — on login/register/rehydration, we sync the JWT token to an authToken cookie with `setAuthCookie()`. The SSR page and edge middleware read this cookie via `cookies()`. This way, the server can authenticate requests without needing client-side JavaScript.

**Q: Explain the rendering strategy — why SSR for product listing but SSG for product details?**
A: The product listing page requires authentication (every user sees personalized data), so it cannot be statically generated. SSR allows us to fetch data per-request with the authenticated user's context. Product details, however, are public and change infrequently. SSG with `generateStaticParams()` pre-builds up to 200 product pages at build time, giving the fastest possible load speeds since pages are served directly as static HTML without any server execution.

### Technical Implementation

**Q: How does the infinite scroll work?**
A: We use the IntersectionObserver API via a custom `useInfiniteScroll` hook. A sentinel div at the bottom of the product grid triggers a `loadMore` callback when it becomes visible (10% threshold). The callback fetches the next page of products, deduplicates by product ID, and appends to the state. The observer disconnects when `hasMore` is false.

**Q: How are filters synchronized to the URL?**
A: All filter state (search, category, price range, sort) is stored in URL query parameters via `router.push()`. The ProductFilters component reads initial values from `useSearchParams()` and updates the URL on every change. The products page server component reads these params for the initial SSR fetch, and the client component reads them for subsequent interactions. This makes filter states shareable, bookmarkable, and restorable on browser navigation.

**Q: How does the OKLCH color space improve the design?**
A: OKLCH is perceptually uniform — a 10% change in lightness looks like a 10% change to the human eye, unlike HEX/RGB where the same numeric change can look very different. This makes it easy to create accessible color contrast, smooth gradients, and consistent dark mode. With OKLCH, we can define light and dark themes by simply swapping the lightness (L) value while keeping chroma (C) and hue (H) the same.

**Q: Why use React Hook Form instead of Formik or manual state?**
A: React Hook Form uses uncontrolled inputs with refs, so it avoids re-rendering the entire form on every keystroke — only the specific field that changes re-renders. The API is declarative: `register()` connects inputs, validation rules are defined inline, and `handleSubmit` provides `isSubmitting` state automatically. Compared to the manual `useState` approach we replaced, it eliminates boilerplate (no individual setters per field), provides field-level error messages, and integrates naturally with TypeScript via typed form interfaces.

**Q: How do you prevent duplicate products in infinite scroll?**
A: Every time we fetch a new page, we maintain a Set of existing product IDs and filter out any products whose IDs are already in the list before appending. This handles edge cases where the backend might return overlapping results due to data changes between page fetches.

**Q: What happens when the API returns a 401?**
A: The API client's fetch wrapper intercepts all non-OK responses. On 401, it calls `clearTokenAndRedirect()` which removes the token from localStorage, deletes the authToken cookie, and redirects to `/auth/login`. This ensures stale sessions are cleaned up immediately.

### Problem-Solving

**Q: What challenges did you face with this project?**
A: One challenge was the token synchronization between client and server. localStorage isn't available on the server, so we needed a cookie bridge. Another was ensuring the URL-driven filters worked with both SSR (initial server fetch) and client-side navigation. The debounced search also required careful sync — we had to separate the input value (immediate) from the URL-synced value (debounced).

**Q: What would you improve if you had more time?**
A: I'd add: (1) a proper test suite — currently there's no testing infrastructure; (2) error boundaries on each page route; (3) loading states for the cart page; (4) a checkout flow with payment integration; (5) wishlist/favorites feature; (6) proper image optimization with next/image instead of unoptimized mode; (7) dark mode toggle instead of system-only; (8) proper ESLint configuration beyond Next.js defaults.

**Q: The project ignores TypeScript build errors. Why is that a concern?**
A: `next.config.ts` sets `typescript.ignoreBuildErrors: true`. While this prevents build failures from blocking deployment, it means type errors go unnoticed in production builds. In a production environment, we'd want strict type checking during builds to catch bugs early. This was likely a pragmatic choice for rapid development but should be addressed for production readiness.

### Code Quality

**Q: How do you ensure code quality without tests?**
A: Currently, code quality relies on TypeScript strict mode (which catches type errors at development time), Prettier for consistent formatting, and code review. However, the absence of automated tests is a significant gap. Ideally, we'd add unit tests for stores and utilities, integration tests for API flows, and component tests for critical UI interactions.

**Q: What's the `cn()` utility and why is it needed?**
A: `cn()` combines `clsx` (conditional class joining) with `tailwind-merge` (intelligent class conflict resolution). For example, if a component receives `className="px-4"` from props and internally uses `px-6`, `twMerge` resolves the conflict to `px-6` instead of having both classes where the CSS cascade might behave unexpectedly. It's essential for building flexible, composable components with Tailwind.

---

## 14. Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                             BROWSER                                          │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      Next.js App (Client-side)                       │   │
│  │                                                                      │   │
│  │  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌───────────┐              │   │
│  │  │  Auth   │  │   Cart   │  │Product │  │  Common    │              │   │
│  │  │ Forms   │  │Content   │  │Filters │  │ Components │              │   │
│  │  └────┬────┘  └────┬─────┘  └────┬───┘  └───────────┘              │   │
│  │       │             │            │                                  │   │
│  │  ┌────▼─────────────▼────────────▼──────────────────────────┐      │   │
│  │  │              Zustand Stores (Persisted)                   │      │   │
│  │  │  ┌──────────────────┐  ┌────────────────────┐            │      │   │
│  │  │  │   Auth Store     │  │    Cart Store      │            │      │   │
│  │  │  │  - user, token   │  │  - items[]         │            │      │   │
│  │  │  │  - isAuthenticated│  │  - addItem()      │            │      │   │
│  │  │  │  - login/register│  │  - removeItem()    │            │      │   │
│  │  │  │  - logout        │  │  - updateQuantity()│            │      │   │
│  │  │  │  - initialize    │  │  - clearCart()     │            │      │   │
│  │  │  └────────┬─────────┘  └─────────┬──────────┘            │      │   │
│  │  └───────────┼──────────────────────┼───────────────────────┘      │   │
│  │              │                      │                              │   │
│  │         ┌────▼──────────────────────▼────┐                         │   │
│  │         │      API Client (lib/api.ts)    │                        │   │
│  │         │  - fetch wrapper               │                        │   │
│  │         │  - auth token injection         │                        │   │
│  │         │  - 401 → redirect               │                        │   │
│  │         └───────────────┬────────────────┘                         │   │
│  └─────────────────────────┼──────────────────────────────────────────┘   │
│                            │                                              │
└────────────────────────────┼──────────────────────────────────────────────┘
                             │ HTTP/HTTPS
                             │
┌────────────────────────────┼──────────────────────────────────────────────┐
│                    Next.js Server (Edge + Node)                            │
│                                                                           │
│  ┌─────────────────────────▼─────────────────────────────────────────┐   │
│  │                   Edge Middleware (proxy.ts)                        │   │
│  │  Matches: /products/*, /cart/*                                    │   │
│  │  ┌──────────────────────────────────────────────────────────┐     │   │
│  │  │  1. Check authToken cookie                                │     │   │
│  │  │  2. No cookie → redirect /auth/login                     │     │   │
│  │  │  3. Has cookie → validate via /api/auth/me               │     │   │
│  │  │  4. Invalid → delete cookie, redirect to login            │     │   │
│  │  └──────────────────────────────────────────────────────────┘     │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                    Server Components (RSC)                           │ │
│  │                                                                      │ │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                   │ │
│  │  │  Root Layout        │  │  Products Page (SSR)│                   │ │
│  │  │  - fonts (Geist)    │  │  - Read authToken   │                   │ │
│  │  │  - metadata         │  │    from cookies()    │                   │ │
│  │  │  - Header/Footer    │  │  - setServerToken()  │                   │ │
│  │  │  - <Analytics>      │  │  - Fetch products +  │                   │ │
│  │  │  - Auth init        │  │    categories        │                   │ │
│  │  └─────────────────────┘  │  - Render initial    │                   │ │
│  │  ┌─────────────────────┐  │    data in HTML      │                   │ │
│  │  │ Product Detail (SSG) │  └─────────────────────┘                   │ │
│  │  │ - generateStaticParams │                                         │ │
│  │  │ - Public API call   │  ┌─────────────────────┐                   │ │
│  │  │ - Dynamic OG        │  │  Cart Page          │                   │ │
│  │  │   metadata          │  │  - Static shell     │                   │ │
│  │  │ - 404 if not found  │  │  - Client fills     │                   │ │
│  │  └─────────────────────┘  │    content          │                   │ │
│  │                           └─────────────────────┘                   │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
└────────────────────────────┬──────────────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Backend API   │
                    │  (External)     │
                    │                 │
                    │  /api/auth/*    │
                    │  /api/products/*│
                    │  /api/categories│
                    └─────────────────┘
```

---

## Quick Reference: Key Facts

| Topic | Key Point |
|-------|-----------|
| **Framework** | Next.js 16 with App Router |
| **State** | Zustand with persist (localStorage) |
| **Auth** | JWT token → localStorage + cookie bridge → edge middleware validation |
| **Styling** | Tailwind CSS v4 with OKLCH color space |
| **Product listing** | SSR (server-rendered, protected) |
| **Product detail** | SSG (pre-built at build time, up to 200 pages, public) |
| **Cart** | Client-rendered (reads from persisted Zustand store) |
| **Filters** | URL-driven (shareable, bookmarkable) |
| **Scroll** | Infinite scroll via IntersectionObserver |
| **Search** | Debounced 300ms |
| **API** | Fetch wrapper with auto token injection |
| **Font** | Geist (via next/font/google) |
| **Icons** | lucide-react |
| **Form Handling** | react-hook-form |
| **Testing** | ❌ None (gap) |
| **Linting** | ESLint (Next.js built-in) + Prettier |
| **Package manager** | pnpm |
| **Deployment** | Vercel-ready (with @vercel/analytics) |
