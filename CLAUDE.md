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

## Environment Variables

For Netlify deployment, set these in the Netlify dashboard:

```
NEXT_PUBLIC_SITE_URL=https://nexos.necofindjob.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@necofindjob.com
```

No other env vars required for MVP (no external DB, no auth provider).

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## What's Next (Priority Order)

1. **Real auth**: NextAuth.js / Supabase Auth with email + password
2. **Database**: Prisma + PostgreSQL / Supabase for persistence
3. **Image upload**: Clinic logos, cover photos via object storage
4. **Email notifications**: Application received, status change
5. **AI features**: Job description optimization, candidate matching
6. **Page builder**: Drag-and-drop section reordering
7. **Multi-tenant routing**: Subdomain per clinic (clinic-name.nexos.necofindjob.com)
