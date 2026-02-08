# Guía Oficial de la Alhambra

Production-ready bilingual (EN/ES) tours-only website for official Alhambra guided tours in Granada, Spain.

## Features

- **Full i18n**: English + Spanish with localized routes (`/en`, `/es`)
- **Language switcher** in header and mobile menu
- **Cookie/localStorage** for language preference
- **Auto-detect** browser language on first visit
- **SEO**: hreflang tags, localized metadata, sitemap, canonical URLs
- **Supabase** for data (tours, FAQs, blog, requests)
- **Tour request workflow** with email notifications (EN/ES)
- **Admin dashboard** with bilingual side-by-side editor

## Tech Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (PostgreSQL, Storage)
- Zod + React Hook Form
- Resend (transactional emails)
- next-intl (i18n)

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Localized public pages
│   │   ├── page.tsx       # Home
│   │   ├── tours/         # Tours list + detail
│   │   ├── availability/  # Availability checker
│   │   ├── about/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── blog/
│   │   └── [slug]/        # Legal: privacy, terms, cancellation
│   ├── api/
│   │   ├── tour-request/  # Submit tour inquiry
│   │   ├── availability/  # Check slots
│   │   └── admin/         # Admin API
│   ├── admin/             # Admin dashboard (no locale prefix)
│   ├── sitemap.ts
│   └── layout.tsx
├── components/
├── i18n/
│   ├── messages/          # en.json, es.json
│   ├── request.ts
│   └── routing.ts
├── lib/
│   ├── supabase/
│   └── email.ts
└── middleware.ts
supabase/
└── migrations/
    └── 20240207000001_initial_schema.sql
```

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in Supabase URL and keys
   - Add Resend API key for emails
   - Set `NEXT_PUBLIC_SITE_URL` for production

3. **Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Run migrations: `supabase db push` or run `supabase/migrations/20240207000001_initial_schema.sql` in SQL Editor
   - (Optional) Enable Supabase Auth for admin protection

4. **Run locally**
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

1. **Connect repo** to Vercel
2. **Add environment variables** (same as `.env.local`)
3. **Build command**: `npm run build`
4. **Output**: Next.js (default)

### Vercel environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_EMAIL`
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://guiaoficialalhambra.com`)

## Database Schema

- **tours**: Bilingual fields (`title_en`, `title_es`, etc.), itinerary, inclusions/exclusions
- **faqs**: Question/answer in EN and ES
- **blog_posts**: Title, excerpt, content in EN and ES
- **tour_requests**: Inquiries with locale for email language
- **availability_slots**: Tour slots for date/time
- **legal_pages**: Privacy, Terms, Cancellation in EN and ES

## Admin Dashboard

- `/admin` – Dashboard overview
- `/admin/tours` – Edit tours (side-by-side EN/ES)
- `/admin/faqs` – Edit FAQs
- `/admin/blog` – Edit blog posts
- `/admin/requests` – View tour requests
- `/admin/legal` – Edit legal pages

**Note**: Add Supabase Auth or API protection before production use.

## License

Private – Guía Oficial de la Alhambra
