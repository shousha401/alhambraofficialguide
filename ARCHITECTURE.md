# Architecture - Guía Oficial de la Alhambra

## File Tree

```
gedo/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Redirect / -> /en or /es
│   │   ├── sitemap.ts                 # Dynamic sitemap (EN + ES)
│   │   ├── [locale]/                  # Localized routes
│   │   │   ├── layout.tsx             # Locale layout (Header, Footer, hreflang)
│   │   │   ├── globals.css
│   │   │   ├── page.tsx               # Home
│   │   │   ├── tours/
│   │   │   │   ├── page.tsx           # Tours list
│   │   │   │   └── [slug]/page.tsx    # Tour detail
│   │   │   ├── availability/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── [slug]/page.tsx        # Legal: privacy, terms, cancellation
│   │   ├── api/
│   │   │   ├── tour-request/route.ts  # POST tour inquiry
│   │   │   ├── availability/route.ts  # GET slots
│   │   │   └── admin/
│   │   │       └── tours/[id]/route.ts
│   │   └── admin/                     # No locale prefix
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── tours/page.tsx
│   │       ├── tours/[id]/page.tsx
│   │       ├── faqs/page.tsx
│   │       ├── blog/page.tsx
│   │       ├── requests/page.tsx
│   │       └── legal/page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── HreflangTags.tsx
│   │   ├── ContactForm.tsx
│   │   ├── FaqAccordion.tsx
│   │   ├── AvailabilityChecker.tsx
│   │   └── admin/
│   │       └── TourEditor.tsx
│   ├── i18n/
│   │   ├── request.ts                 # getRequestConfig
│   │   ├── routing.ts                 # locales, defaultLocale
│   │   ├── navigation.ts              # Link, useRouter, usePathname
│   │   └── messages/
│   │       ├── en.json
│   │       └── es.json
│   ├── lib/
│   │   ├── supabase/client.ts         # Browser client
│   │   ├── supabase/server.ts         # Server + Admin clients
│   │   └── email.ts                   # Resend + bilingual templates
│   ├── types/
│   │   └── database.types.ts
│   └── middleware.ts                  # Locale detection, redirect
├── supabase/
│   └── migrations/
│       ├── 20240207000001_initial_schema.sql
│       └── 20240207000002_seed_sample_tour.sql
├── package.json
├── next.config.js
├── tailwind.config.ts
├── .env.example
├── README.md
└── ARCHITECTURE.md
```

## Data Flow

### Tour Request Workflow
1. User fills ContactForm (locale from page)
2. POST /api/tour-request with locale, name, email, message, etc.
3. Supabase: insert into tour_requests
4. Resend: send email to admin in user's locale (EN or ES)

### Availability Check
1. User selects tour + date in AvailabilityChecker
2. GET /api/availability?tourId=&date=
3. Supabase: query availability_slots where tour_id + slot_date
4. Return available times; user clicks to go to contact with pre-filled query params

### i18n Flow
1. Middleware: intercepts requests, detects locale (cookie → Accept-Language), redirects / → /en or /es
2. getRequestConfig: loads messages for locale
3. createNavigation: Link, useRouter, usePathname auto-prefix locale

## SEO

- **hreflang**: HreflangTags component in layout head (en, es, x-default)
- **Metadata**: generateMetadata per page, localized title/description
- **Canonical**: alternates.canonical in metadata
- **Sitemap**: /sitemap.xml with EN and ES URLs for all pages, tours, blog posts
