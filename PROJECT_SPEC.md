# SOMO Project Specification & Architecture Guide

## 1. Project Overview
SOMO is a modern web application featuring an interactive, animated landing page, a maximum-security authentication system with Passkeys and 2FA, subscription billing, and a real-time collaborative dashboard.

---

## 2. Core Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js (App Router, TypeScript)** | SSR/SSG for landing page performance, React Server Components, server actions, and dashboard routing. |
| **Styling** | **CSS Modules / SCSS** | Scoped, modular styles without utility framework bloat. Strict exclusion of Tailwind CSS. |
| **Animations** | **GSAP (GreenSock) + ScrollTrigger** | High-performance timeline choreography, SVG path animations, and scroll interactions. |
| **Authentication** | **Better Auth + WebAuthn/Passkeys + 2FA** | Hardware-backed passwordless passkeys (FaceID/TouchID), TOTP 2FA, brute-force rate limiting, and encrypted server sessions. |
| **Backend & DB** | **Supabase (PostgreSQL + RLS + Storage)** | Relational database with strict Row Level Security (RLS) policies and storage. |
| **Realtime Co-op** | **Supabase Realtime / WebSockets** | Live user presence, cursor syncing, state broadcasting, and shared workspace collaboration. |
| **Billing & Payments** | **Stripe (Checkout & Webhooks)** | Subscription tier management, customer portal, and invoice handling. |

---

## 3. Security & Authentication Architecture

SOMO implements a **Defense-in-Depth** security model:

1. **Passkeys (WebAuthn / FIDO2)**:
   - Primary passwordless authentication mechanism using device biometrics / security keys.
   - Eliminates phishing, brute force, and credential stuffing vectors.
2. **Two-Factor Authentication (TOTP / 2FA)**:
   - Authenticator app support with encrypted one-time backup codes for recovery.
3. **Session & Cookie Security**:
   - Database-persisted, revocable session management.
   - Strictly `HttpOnly`, `SameSite=Lax/Strict`, and `Secure` cookie configuration to prevent XSS session theft.
4. **Brute-Force & Bot Mitigation**:
   - Sliding-window rate limiting on all login, registration, and recovery endpoints.
5. **Database-Level Row Level Security (RLS)**:
   - All tenant data in PostgreSQL is gated by native Postgres RLS policies based on the authenticated session context.
   - Data access is enforced at the database level even in the event of API route logic flaws.

---

## 4. Project Structure

```
SOMO/
├── logo.png
├── PROJECT_SPEC.md
├── public/
│   ├── assets/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── (marketing)/          # Landing page, pricing, public views
│   │   │   ├── page.tsx
│   │   │   └── page.module.scss
│   │   ├── (auth)/               # Passkey login, register, 2FA verify
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── 2fa/
│   │   ├── (dashboard)/          # Protected collaborative workspace
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/
│   │   └── api/                  # Auth endpoints, Stripe webhooks
│   ├── components/
│   │   ├── animation/            # GSAP scene controllers and triggers
│   │   ├── auth/                 # Passkey prompt, 2FA input, login forms
│   │   ├── coop/                 # Live presence, collaborative widgets
│   │   ├── layout/               # Nav, header, footer
│   │   └── ui/                   # Reusable components (buttons, modals, inputs)
│   ├── hooks/                    # Realtime hooks, animation hooks, auth hooks
│   ├── lib/                      # Better Auth client/server, Supabase client, Stripe helpers
│   ├── styles/                   # Global tokens, reset, typography, variables
│   └── types/                    # Database, user, and session TypeScript definitions
```

---

## 5. Design & Technical Rules

### Styling & Aesthetics
- **No Tailwind CSS**: All styles must be built using scoped CSS Modules or SCSS.
- **Visual Standards**: Avoid generic AI visual clichés (no harsh gradients, thick cartoonish shadows, or arbitrary purple accents).
- **Custom Typography**: Use dedicated typography styling rather than unstyled system font fallbacks.
- **State Handling**: Always implement real states (0-data/empty states, loading skeletons, disabled actions, and active states).

### Code & Architecture
- **Animation Performance**: Isolate heavy GSAP animations inside dedicated client components (`"use client"`). Clean up GSAP timelines on component unmount (`ctx.revert()`).
- **Real-Time Safety**: Keep collaborative room payloads lightweight. Synchronize operational diffs or events rather than sending massive state blobs over WebSockets.
- **Data Protection**: Enforce Row Level Security (RLS) policies on all Supabase tables so tenants only access their authorized workspace data.
- **Concise Code**: Avoid dead boilerplate, excessive abstractions, or unnecessary comment bloat.

---

## 6. Development Roadmap

1. **Scaffold & Setup**: Initialize Next.js with TypeScript and SCSS/CSS modules.
2. **Landing Page & Animations**: Build semantic layout, hero section, and GSAP timeline animations.
3. **Max-Security Auth System**: Integrate Better Auth with Passkeys/WebAuthn, 2FA TOTP, session cookies, and rate limiting against Supabase Postgres with RLS.
4. **Dashboard & Real-time Co-op**: Build workspace view, presence indicators, and live multi-user interactions.
5. **Stripe Billing Integration**: Implement subscription tiers, checkout sessions, and webhook listeners.

---

## 7. Dashboard Design System & Component Patterns

### 7.1. Header & Navigation
- **Height & Docking**: `52px` fixed header with subtle bottom border (`1px solid #1c2230`).
- **Tab Layout**:
  - `Premium`: Left-aligned button triggering the flush left slide-in drawer.
  - `Home`: Center button; resets canvas view, closes all drawers and open creation boxes.
  - `Account`: Right-aligned button triggering the flush right profile drawer.
- **Tab Aesthetics**:
  - Typography: `$font-sans` (Plus Jakarta Sans), `0.875rem`, `font-weight: 600`.
  - Border radius: `$radius-sm: 4px` subtle corners matching landing page button language.
  - Y-Centering: Strict vertical alignment (`line-height: 1; display: inline-flex; align-items: center; justify-content: center`).
  - Active indicator: Colored border (`#f16b24` for Premium, `#439b38` for Account).

### 7.2. Flush Sidebars (Premium & Account)
- **Zero Exterior Gaps**: Docked flush to viewport edges (`top: 52px; bottom: 0; left: 0` for Premium, `right: 0` for Account). Width `380px`, `max-width: 90vw`.
- **Canvas Blur Transition**: Smooth transition (`0.35s cubic-bezier(0.16, 1, 0.3, 1)`) adding `filter: blur(4px); opacity: 0.55` to canvas behind dark backdrop (`rgba(10, 12, 16, 0.55)`).
- **Account Actions Stack**:
  - Full width pills (`width: 100%`) stacked vertically: **Details**, **Security**, **Data**, **Subscription**.
  - Dimensions: `height: 48px; border-radius: 30px; padding: 0 24px`.
  - Stretched Typography: `$font-sans`, `font-size: 1.125rem` (18px), `font-weight: 700`, `letter-spacing: 0.12em`, `text-indent: 0.12em` to eliminate dead horizontal space across the pill.
  - Surface: Base `#18202d`, border `1px solid #293444`, hover `#232e40` with border `#3c4b62`.
- **Premium Subscription CTA ("Get premium")**:
  - Proportions match account pills: `height: 48px; border-radius: 30px; font-size: 1.125rem; font-weight: 700; letter-spacing: 0.12em; text-indent: 0.12em`.
  - Filled with brand orange `#f16b24`, hover `#d95a1b`.

### 7.3. Canvas & Project Card Hierarchy
- **Canvas Alignment Modes**:
  - *Empty State*: Vertically and horizontally centered. Features solid-fill interactive tilted boxes (`#f16b24` large, `#439b38` small), `"No projects yet..."`, and `"Create new one?"` action link.
  - *Active Projects / Creation*: Aligned to top (`justify-content: flex-start; padding-top: 56px;`), preventing the project box from being centered.
- **Project Card (`.projectCard`)**:
  - Dimensions: `width: 100%; max-width: 680px; height: 72px; border-radius: 20px; overflow: hidden`.
  - Surface: `#10141c` with `1px solid #222937`.
  - Project Name: Left chamber with `padding: 0 24px`. Styled with `$font-sans`, `font-size: 1.35rem`, `font-weight: 700`, `letter-spacing: -0.02em`.
  - Forward Slash Divider: Skewed divider (`width: 2px; height: 100%; transform: skewX(-20deg); background-color: #222937`).
  - Action Button (`.seeProjectBtn`):
    - Stacked 2 lines (`SEE` above `PROJECT`), `line-height: 1.15`, `$font-sans`, `font-size: 0.9375rem`, `font-weight: 800`, `text-transform: uppercase`, `letter-spacing: 0.05em`.
    - Pure transparent background (no rectangular hover fill that clashes with the slanted divider). Only text color transitions to brand orange (`#f16b24`) on hover and `#d95a1b` on active.
- **Project Ordering**:
  - Chronological ascending order (`createdAt ASC`).
  - Older projects remain at the top; newer projects are placed **under** existing ones.
  - In creation mode, the new project input box appears **under** existing cards, directly above the circular `(+)` button.

### 7.4. Micro-Interactions & Animations
- **Slide-Up Arrival**: `@keyframes slideUpFromBottom` (`translateY(80px)` to `0`, `opacity: 0` to `1` over `0.35s`).
  - Input field automatically selects default placeholder text (`"New Project"`) with brand orange highlight (`rgba(241, 107, 36, 0.35)`).
- **Squeeze-Out Exit**: `@keyframes squeezeOut` (`scaleX(0.65)` and `scaleY(0.05)` with `opacity: 0` over `0.25s`).
  - Triggered when clicking away outside the box, pressing `Escape`, or clicking `Home`.
  - Empty state shapes smoothly fade back in (`@keyframes fadeInState`).

### 7.5. Database Persistence
- **Postgres Schema**: `project` table (`id text PRIMARY KEY`, `name text NOT NULL`, `userId text REFERENCES "user"(id) ON DELETE CASCADE`, `createdAt timestamptz DEFAULT now()`, `updatedAt timestamptz DEFAULT now()`, `data jsonb DEFAULT '{}'::jsonb`).
- **Connection Pool**: Centralized `Pool` in `src/lib/db.ts` shared with Better Auth.
- **API Routes**: `GET /api/projects` (`ORDER BY "createdAt" ASC`), `POST /api/projects`, and `PATCH /api/projects/[id]`, `DELETE /api/projects/[id]`.
- **Client Synchronization**: Optimistic state updates backed by `localStorage` and real-time database sync.

### 7.6. Project Canvas & Viewport Transition
- **Sliding Viewport Choreography**:
  - Clicking `"SEE PROJECT"` on any card or creating a project transitions the workspace view:
    - `.projectsSlidePanel`: Slides smoothly out to the left (`transform: translateX(-100%); opacity: 0; pointer-events: none;`) over `0.45s cubic-bezier(0.16, 1, 0.3, 1)`.
    - `.canvasSlidePanel`: Slides smoothly in from the right (`transform: translateX(0); opacity: 1; pointer-events: auto;`) over `0.45s cubic-bezier(0.16, 1, 0.3, 1)`.
  - Clicking `"Home"` in the top navigation reverses the transition, sliding the canvas back out to the right and restoring the project list from the left.
- **Dynamic Header Context**:
  - When a project is active, the right tab in the top header dynamically switches from `"Account"` to `"Settings"`.
  - Clicking `"Settings"` triggers the Project Settings sidebar.
- **Project Settings Sidebar**:
  - Docked flush to the right (`top: 52px; right: 0; width: 380px; z-index: 40`).
  - **Rename Project**: Text input with save action, updating state and sending `PATCH /api/projects/[id]`.
  - **Sharp Lines Toggle**: `"Sharp lines?"` button toggling `sharpLines` boolean. When active, removes border radius (`border-radius: 0 !important;`) on all canvas cards and tiles.
  - **Delete Project**: Direct deletion action with database cascading cleanup.
- **Project Canvas Bento Grid**:
  - **Fonts** (Top Left): Font library with typography previews (`Aa Z-z Word 123`), add font prompt, and inline font name addition.
  - **Signature Elements** (Bottom Left): 4-quadrant brand elements grid (`EL / E / ME / NTS` or custom brand marks).
  - **Color Palette** (Top Center): Vertical interactive swatch strips with hover hex labels, color picker editing, and `+` color additions.
  - **Brand Identity & Icons** (Middle Center):
    - Upper sub-card: Logo mark badge with brand title and tagline.
    - Lower sub-card: Grid of brand utility icons with popover icon picker (Instagram, YouTube, Mail, Pen, GitHub, LinkedIn, Globe, Atom, Code, Sparkles).
  - **Pictures Card** (Right Column, Full Canvas Height): 2x3 image moodboard grid with file uploads, sample presets, and picture removal.

