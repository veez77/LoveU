# Quick Start Guide

Get LoveU up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Database (Neon or Vercel Postgres)

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Database

### Create Database

Choose one:
- **Neon** (Recommended): https://neon.tech
- **Vercel Postgres**: https://vercel.com/storage

### Configure Environment

Copy and edit `.env.local`:

```env
# Your database URL from Neon or Vercel
POSTGRES_URL="postgresql://user:pass@host/db"

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your-super-secret-key-here"
```

### Run Migration

```bash
npm run migrate
```

Or manually run `src/lib/db/schema.sql` in your database.

## 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 4. Create First Account

1. Click "Complete setup"
2. Fill in:
   - Family Name: "The Smiths"
   - Your First Name: "John"
   - Your Last Name: "Smith"
   - Role: Parent
3. Click "Complete Setup"

## 5. Add Second User

1. Open in another browser/device
2. Go to http://localhost:3000
3. Click "Complete setup"
4. Fill in second user info
5. Both users now share the same calendar!

## 6. Create Your First Event

1. Click "+ New Event" or use mobile nav
2. Fill in event details
3. Save
4. Event appears on shared calendar

## That's It!

You now have a working family calendar. Try:
- Creating different event types
- Switching between Month/Week/Day views
- Swiping left/right on mobile
- Editing/deleting events

## Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions to Vercel.

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for architecture
- Check database with: `SELECT * FROM families;`
