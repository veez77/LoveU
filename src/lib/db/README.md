# Database Setup

## Vercel Postgres Setup (or Neon)

**Note:** @vercel/postgres is deprecated. For new projects, use [Neon](https://neon.tech/) with Vercel integration.

### Option 1: Vercel Postgres (Legacy)

1. Go to your Vercel project dashboard
2. Navigate to Storage > Create Database
3. Select Postgres
4. Copy the connection strings to `.env.local`

### Option 2: Neon (Recommended)

1. Go to [Vercel Marketplace](https://vercel.com/integrations/neon)
2. Install Neon integration
3. Create a database through the integration
4. Connection strings will be automatically added to your project

## Environment Variables

Add these to `.env.local`:

```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

## Running the Schema

### Option 1: Manual (SQL Client)

Connect to your database using psql or a GUI client and run:

```bash
psql $POSTGRES_URL < src/lib/db/schema.sql
```

### Option 2: Vercel Dashboard

1. Go to Storage > Your Database > Query
2. Copy and paste the contents of `schema.sql`
3. Execute

### Option 3: Using the migration script

```bash
node scripts/migrate.js
```

## Schema Overview

### Tables

- **families**: Family groups (supports multi-family scaling)
- **users**: Family members with name-based auth
- **events**: School activities with types and date/time info

### Event Types

- `exam`: Tests and quizzes
- `project`: Long-term assignments
- `book_report`: Reading assignments
- `school_event`: School activities (field trips, performances)
- `private_lesson`: Tutoring, music lessons, etc.

### Constraints

- Users must have unique first_name + last_name within a family
- Events are limited to ±12 months from current date
- End time must be after start time when both specified
- All data is scoped to family_id (prevents cross-family data leakage)

## Testing Queries

You can test the database with sample data:

```sql
-- Create a test family
INSERT INTO families (name) VALUES ('Test Family');

-- Create test users
INSERT INTO users (family_id, first_name, last_name, role)
VALUES (1, 'Parent', 'Smith', 'parent');

INSERT INTO users (family_id, first_name, last_name, role)
VALUES (1, 'Teen', 'Smith', 'child');

-- Create a test event
INSERT INTO events (
  family_id, created_by, title, event_type,
  start_date, start_time, is_all_day
) VALUES (
  1, 1, 'Math Exam', 'exam',
  CURRENT_DATE + INTERVAL '3 days', '10:00:00', false
);
```
