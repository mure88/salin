# Netlify Deployment Guide for Salin App

## Prerequisites

Since Netlify is serverless and doesn't support SQLite, you need a hosted database. We recommend **Supabase** (free PostgreSQL database).

## Step 1: Set Up Supabase Database (Free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to be provisioned (~2 minutes)
4. Go to **Project Settings** → **Database**
5. Copy the **Connection String** (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

## Step 2: Update Database Configuration

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

2. Update your `.env` file:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
JWT_SECRET="your-random-secret-key-here"
NEXT_PUBLIC_APP_NAME="Salin Family"
NODE_ENV="production"
```

3. Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Migrate Database to PostgreSQL

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Seed the database
npm run db:seed
```

## Step 4: Deploy to Netlify

### Option A: Deploy via Netlify CLI (Recommended)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize and deploy:
```bash
netlify init
```

Follow the prompts:
- Create & configure a new site
- Choose your team
- Site name: `salin-family` (or your preferred name)
- Build command: `npm run build`
- Publish directory: `.next`

4. Set environment variables:
```bash
netlify env:set DATABASE_URL "your-supabase-connection-string"
netlify env:set JWT_SECRET "your-generated-secret"
netlify env:set NEXT_PUBLIC_APP_NAME "Salin Family"
netlify env:set NODE_ENV "production"
```

5. Deploy:
```bash
netlify deploy --prod
```

### Option B: Deploy via Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 20

5. Add environment variables in **Site settings** → **Environment variables**:
   - `DATABASE_URL`: Your Supabase connection string
   - `JWT_SECRET`: Your generated secret
   - `NEXT_PUBLIC_APP_NAME`: Salin Family
   - `NODE_ENV`: production

6. Click **Deploy site**

## Step 5: Post-Deployment

1. Your site will be live at: `https://your-site-name.netlify.app`
2. Set up a custom domain (optional):
   - Go to **Domain settings** → **Add custom domain**
   - Follow DNS configuration instructions

3. Enable HTTPS (automatic with Netlify)

## Automatic Deployments

Once connected to Git:
- Every push to `main` branch triggers automatic deployment
- Pull requests create preview deployments
- Rollback to previous deployments anytime

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret key for JWT tokens | Random 64-char hex |
| `NEXT_PUBLIC_APP_NAME` | App display name | `Salin Family` |
| `NODE_ENV` | Environment mode | `production` |

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version is 20

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure IP allowlist in Supabase allows all IPs (0.0.0.0/0)

### API Routes Not Working
- Ensure `@netlify/plugin-nextjs` is installed
- Check `netlify.toml` configuration
- Verify environment variables are set

## Cost

- **Netlify**: Free tier (100GB bandwidth, 300 build minutes/month)
- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Total**: $0/month for small family use

## Support

For issues, check:
- [Netlify Next.js Docs](https://docs.netlify.com/frameworks/next-js/)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
