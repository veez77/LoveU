# LoveU - School Activities Tracker

A web app to help parents and teens track school activities (exams, projects, book reports, events, private lessons) in a centralized calendar.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Vercel Postgres (migrating to Neon)
- **Auth:** Custom JWT with httpOnly cookies
- **UI:** Tailwind CSS + shadcn/ui
- **Calendar:** Custom implementation with date-fns
- **Internationalization:** next-intl (English + Hebrew)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
POSTGRES_URL=""
JWT_SECRET="your-secret-key"
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & setup pages
│   ├── (app)/           # Protected calendar & event pages
│   └── api/             # Auth & events API routes
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── calendar/        # Calendar views
│   └── events/          # Event management
├── lib/
│   ├── db/              # Database client & queries
│   ├── auth/            # JWT & session management
│   └── calendar/        # Date utilities
├── types/               # TypeScript interfaces
└── i18n/                # Translations
```

## Features

- Name-based authentication for family members
- Shared calendar with multiple views (Month/Week/Day)
- Event types: exam, project, book report, school event, private lesson
- Mobile-optimized with swipe gestures
- Ready for Hebrew localization (RTL support)

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Connect repository to Vercel
3. Set up Vercel Postgres (or Neon)
4. Configure environment variables
5. Deploy
