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
