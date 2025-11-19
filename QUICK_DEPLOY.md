# Quick Deploy to Netlify - 5 Minutes ⚡

## Prerequisites
- Netlify account (free): https://netlify.com
- Supabase account (free): https://supabase.com

## Step 1: Set Up Database (2 min)

1. Go to https://supabase.com → Create new project
2. Wait for database setup
3. Go to **Settings** → **Database** → Copy **Connection String**
4. Replace `[YOUR-PASSWORD]` with your actual password

## Step 2: Update Schema (1 min)

Replace content of `prisma/schema.prisma` with:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

(Keep everything else the same, just change the datasource section)

## Step 3: Push Database (1 min)

```bash
# Set your Supabase connection string
$env:DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.xxx.supabase.co:5432/postgres"

# Push schema
npx prisma generate
npx prisma db push

# Seed database
npm run db:seed
```

## Step 4: Deploy to Netlify (1 min)

### Option A: Via Dashboard (Easiest)

1. Push code to GitHub
2. Go to https://app.netlify.com
3. Click **"Add new site"** → **"Import from Git"**
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `JWT_SECRET`: Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `NODE_ENV`: `production`
7. Click **Deploy**

### Option B: Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify init

# Set environment variables
netlify env:set DATABASE_URL "your-supabase-url"
netlify env:set JWT_SECRET "your-generated-secret"
netlify env:set NODE_ENV "production"

# Deploy to production
netlify deploy --prod
```

## Done! 🎉

Your app is now live at: `https://your-site-name.netlify.app`

Default login:
- Username: `admin`
- Password: `admin123`

**⚠️ Change the admin password immediately after first login!**

## Auto-Deploy

Every push to `main` branch will automatically deploy to Netlify.

## Troubleshooting

**Build fails?**
- Check Node version is 20 in Netlify settings
- Verify all environment variables are set

**Can't connect to database?**
- Check DATABASE_URL is correct
- Ensure Supabase allows connections from anywhere (0.0.0.0/0)

**Need help?** See full guide: `NETLIFY_DEPLOYMENT.md`
