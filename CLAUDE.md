# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Toolradar is a community-driven software discovery platform (similar to G2/Product Hunt) built with Next.js 14 App Router, Prisma, PostgreSQL, and NextAuth.

## Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database (no migration)
npm run db:migrate   # Create and apply migrations
npm run db:seed      # Seed mainstream tools

# Admin seed via API
GET /api/admin/seed?secret=YOUR_SEED_SECRET
```

## Architecture

### Route Groups (src/app/)
- `(public)/` - Public pages with shared layout (header/footer): tools, categories, compare, vendors
- `(auth)/` - Auth pages (login, register)
- `admin/` - Admin dashboard (requires role="admin")
- `company/` - Company dashboard (requires CompanyMember membership)
- `dashboard/` - User dashboard
- `api/` - API routes

### Key Data Models
- **Tool**: Core entity with editorial/community scores, pricing, categories
- **Company**: Claimable business profiles (auto-created from tool domains)
- **CompanyMember**: Team members with roles (owner/admin/member)
- **ClaimRequest**: Company claim requests pending admin approval
- **Review**: G2-style reviews with ratings and verification

### Auth System (src/lib/)
- `auth.ts` - NextAuth config with Google, LinkedIn, Email providers
- `auth-utils.ts` - Auth helpers:
  - `getCurrentUser()` - Get session user
  - `requireAuth()` / `requireAdminPage()` - Page-level auth (redirects)
  - `requireAdmin()` / `requireCompany()` - API-level auth (returns error response)
  - `requireCompanyMember()` / `requireCompanyAdmin()` / `requireCompanyOwner()` - Membership-based auth

### Components Structure (src/components/)
- `layout/` - Header, MobileMenu, Footer
- `tools/` - ToolCard, ToolLogo (handles fallback for missing logos)
- `categories/` - CategoryIcon (uses DynamicIcon for Lucide icons)
- `admin/` - Moderation components
- `ui/` - Shared UI (DynamicIcon for runtime Lucide icon loading)

### Environment Variables
```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET
RESEND_API_KEY
SEED_SECRET
```

## Conventions

### Icons
Category icons use kebab-case Lucide names (e.g., `bar-chart-2`, `shopping-cart`) via `DynamicIcon` component.

### Tool Logos
Use `cdn.simpleicons.org` or official apple-touch-icons. Avoid seeklogo (blocked by ad blockers).

### API Auth Pattern
```typescript
const result = await requireAdmin();
if ("error" in result) return result.error;
const { user } = result;
```

### Company Claim Flow
1. Companies auto-created from tool website domains (unclaimed)
2. Users submit ClaimRequest via `/companies/[slug]/claim`
3. Admin approves/rejects at `/admin/claims`
4. On approval: CompanyMember created with role="owner"
