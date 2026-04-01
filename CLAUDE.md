# NEXOS — Project Context

## What is NEXOS?

**NEXOSは、医療機関が自院ブランドの採用ページを作成・公開・運用でき、必要に応じてNecoが共同編集・共同運用できる「共同管理型の採用OS」である。**

見え方: 各病院・クリニックが、自前の人材紹介子会社 / 採用専業チームを持ったように見えるSaaS。
実態: NEXOSが裏側の共通基盤を担い、Necoも編集・改善・運用に入れる構造。

## Core Principle

**表は医療機関ブランド、裏はNEXOS共通基盤、必要時にNecoが共同運用**

## Production

- URL: https://nexos.necofindjob.com
- Contact: contact@necofindjob.com
- Hosting: Netlify
- Branch: `claude/build-nexos-platform-uONhD`

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + Framer Motion
- Zod validation
- In-memory seed data (MVP — no external DB yet)
- Netlify deployment with `@netlify/plugin-nextjs`

## Architecture

### Roles (4 types)
| Role | Scope | Description |
|------|-------|-------------|
| `neco_admin` | All clinics | Neco platform operator — full cross-clinic access |
| `neco_editor` | Assigned clinics | Neco co-editor — can edit pages/jobs for assigned clinics |
| `clinic_admin` | Own clinic | Clinic owner/admin — full access to own clinic |
| `clinic_editor` | Own clinic | Clinic staff — limited edit access |

### Key Data Models
- `Clinic` → has `ClinicBrandConfig` + `ClinicPageSection[]`
- `JobPosting` → belongs to Clinic, tracks `lastEditedBy`
- `Application` → belongs to JobPosting, has `CandidateNote[]` with `authorRole`
- `AdminUser` → has `role: UserRole` + `clinicIds[]`

### Route Structure
- Public: `/`, `/jobs`, `/jobs/[id]`, `/clinics/[slug]`, `/apply/[jobId]`
- Dashboard: `/dashboard`, `/dashboard/jobs`, `/dashboard/candidates`, `/dashboard/analytics`, `/dashboard/page-editor`
- API: `/api/applications`, `/api/applications/stage`, `/api/applications/notes`, `/api/jobs`
- Legal: `/privacy`, `/terms`

### Co-Management Pattern
The dashboard supports role-based access:
- Neco users see a yellow "Neco管理モード" banner
- User switcher in sidebar allows demo-mode role switching
- Notes and edits record `authorId` + `authorRole` for audit trail
- Page editor shows who last edited each section

## Tech Stack (Full)

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + Framer Motion
- Prisma 6 + Neon PostgreSQL (serverless driver)
- NextAuth.js v5 (credentials login)
- S3-compatible storage (image uploads)
- Resend (transactional email)
- Anthropic Claude (AI features via Vercel AI SDK)
- Zod validation on all API routes
- Netlify deployment

## Environment Variables

See `.env.example` for full list. Key services:

| Service | Variable | Required? |
|---------|----------|-----------|
| Public URL | `NEXT_PUBLIC_SITE_URL` | Yes |
| Neon PostgreSQL | `DATABASE_URL`, `DIRECT_DATABASE_URL` | For DB mode |
| NextAuth | `AUTH_SECRET`, `AUTH_URL` | For auth mode |
| S3 Storage | `S3_*` vars | For image upload |
| Resend | `RESEND_API_KEY` | For email notifications |
| Anthropic | `ANTHROPIC_API_KEY` | For AI features |

**MVP mode**: Without `DATABASE_URL`, the app runs with in-memory seed data and mock auth.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build

# Database (when DATABASE_URL is set)
npm run db:generate  # generate Prisma client
npm run db:push      # push schema to DB
npm run db:seed      # seed with sample data
npm run db:studio    # open Prisma Studio
```

## Infrastructure Status

| Feature | Status | Notes |
|---------|--------|-------|
| Auth (NextAuth.js) | Ready | Credentials login, JWT sessions, middleware protection |
| Database (Prisma) | Ready | Full schema, seed script, CLI commands |
| Image Upload (S3) | Ready | Pre-signed URLs, file validation, public URL generation |
| Email (Resend) | Ready | 3 templates: application received, status changed, admin notification |
| AI (Anthropic) | Ready | Job description optimizer, candidate matching scorer |
| In-memory fallback | Active | Works without any external services |

## What's Next

1. **Drag-and-drop page builder**: Reorder sections, add custom blocks
2. **Multi-tenant routing**: Subdomain per clinic (clinic-name.nexos.necofindjob.com)
3. **Billing**: Stripe integration for clinic subscriptions
4. **Webhooks**: Notify external systems on events
5. **Analytics V2**: Real-time dashboards, cohort analysis
