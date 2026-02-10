# Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free tier)
- Neon or Vercel Postgres database (free tier)

## Step 1: Prepare the Repository

1. Initialize Git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: LoveU School Activities Tracker"
```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name: `loveu-tracker` (or your preferred name)
   - Keep it private (recommended for family use)
   - Don't initialize with README (we have one)

3. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/loveu-tracker.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Database

### Option A: Neon (Recommended)

1. Go to https://neon.tech
2. Sign up with your GitHub account
3. Create a new project: "LoveU Database"
4. Copy the connection string (starts with `postgresql://`)
5. Save for later use in environment variables

### Option B: Vercel Postgres (Legacy)

1. Go to your Vercel dashboard
2. Click "Storage" > "Create Database"
3. Select "Postgres"
4. Copy all connection strings
5. Save for later use

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/Login with your GitHub account
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

## Step 4: Configure Environment Variables

In Vercel project settings, add these environment variables:

### Database (Neon)
```
POSTGRES_URL=postgresql://...
```

### Database (Vercel Postgres - if using)
```
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...
```

### JWT Secret
```
JWT_SECRET=your-super-secret-key-change-this
```

**IMPORTANT**: Generate a secure JWT secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use a password generator for a strong secret
```

## Step 5: Run Database Migration

### Option A: Using Vercel SQL Query Editor

1. Go to Vercel Dashboard > Storage > Your Database > Query
2. Copy the contents of `src/lib/db/schema.sql`
3. Paste and execute the SQL

### Option B: Using psql (Local)

```bash
# Install psql if needed
# Then run:
psql $POSTGRES_URL < src/lib/db/schema.sql
```

### Option C: Using the Migration Script

```bash
# Set environment variables in .env.local first
npm run migrate
```

## Step 6: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete (2-3 minutes)
3. Visit your deployed URL: `https://your-project.vercel.app`

## Step 7: Test the Deployment

1. Open your deployed URL
2. You should be redirected to `/login`
3. Click "Complete setup" to create the first family account
4. Fill in:
   - Family Name: Your family name
   - Your First Name
   - Your Last Name
   - Role: Parent
5. Click "Complete Setup"
6. You should be redirected to the calendar
7. Test creating an event
8. Test all three views (Month/Week/Day)
9. Test on mobile device

## Step 8: Add Second User

1. On a different device or browser, go to your app URL
2. Click "Complete setup" again
3. Fill in the second user's information (e.g., the child)
4. Use the same family name (or it will auto-join the first family)
5. Both users should now see the same events

## Troubleshooting

### Build Fails

- Check build logs in Vercel
- Ensure all dependencies are in package.json
- Check for TypeScript errors locally: `npm run build`

### Database Connection Fails

- Verify POSTGRES_URL is correct
- Check database is accessible
- Ensure database tables are created (run migration)

### JWT Errors

- Ensure JWT_SECRET is set in Vercel environment variables
- Generate a new secret if needed

### Events Not Showing

- Verify both users are in the same family
- Check browser console for API errors
- Verify database has events: Query `SELECT * FROM events`

## Updating the App

1. Make changes locally
2. Test locally: `npm run dev`
3. Commit and push to GitHub:
```bash
git add .
git commit -m "Description of changes"
git push
```
4. Vercel automatically deploys on push to main branch

## Security Notes

- JWT secret should be strong and unique
- Keep database credentials secure
- Consider adding password/PIN protection in future
- HTTPS is automatically enabled by Vercel

## Monitoring

- Check Vercel Analytics for usage
- Monitor database size (free tier: 256MB)
- Check Vercel logs for errors

## Scaling

If you need to scale beyond the free tier:

- **Database**: Upgrade Neon or Vercel Postgres
- **Compute**: Upgrade Vercel plan for more bandwidth
- **Features**: Add password auth, notifications, etc.

## Cost Estimates (Free Tier)

- **Vercel**: 100GB bandwidth, serverless functions
- **Neon**: 256MB storage, 60 compute hours/month
- **Total**: $0/month for typical family use (2 users, ~500 events)

## Support

For issues:
1. Check Vercel deployment logs
2. Check database connection
3. Review browser console errors
4. Check the README.md for development setup
