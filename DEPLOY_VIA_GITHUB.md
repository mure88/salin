# Deploy Salin to Netlify via GitHub (Recommended)

Due to Windows path issues with local Netlify CLI builds, deploying via GitHub is the recommended approach.

## Quick Steps:

### 1. Create GitHub Repository

Go to https://github.com/new and create a new repository named `salin`

### 2. Push Code to GitHub

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Salin Family Task Manager"

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/salin.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Connect to Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select your `salin` repository
5. Build settings (should auto-detect):
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 20

### 4. Add Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

```
DATABASE_URL = postgresql://postgres:JfE59wvv7CUwgEs7@db.oddbqpehuvjphcgxbrde.supabase.co:5432/postgres
JWT_SECRET = 9e64c299f3f6d7ba0b73f61b97e83b0c3efd6b5fd6510bfd382de12cde20532c
NEXT_PUBLIC_APP_NAME = Salin Family
NODE_ENV = production
```

### 5. Deploy!

Click "Deploy site" and wait 2-3 minutes.

## Auto-Deploy

Every push to `main` branch will automatically trigger a new deployment!

## Default Login

- Username: `admin`
- Password: `admin123`

**⚠️ Change password immediately after first login!**

---

## Why GitHub Instead of CLI?

The Netlify CLI has issues with Windows absolute paths that get embedded in the build output, causing module resolution errors on Netlify's Linux servers. Building directly on Netlify's servers via GitHub avoids this issue entirely.
