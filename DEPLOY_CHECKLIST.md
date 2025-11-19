# ✅ Netlify Deployment Checklist

## Database Setup ✅ COMPLETE

- [x] Supabase project created: `salin`
- [x] Database schema pushed to PostgreSQL
- [x] Database seeded with admin user and categories
- [x] Connection string configured

**Database URL:**
```
postgresql://postgres:JfE59wvv7CUwgEs7@db.oddbqpehuvjphcgxbrde.supabase.co:5432/postgres
```

## Local Setup ✅ COMPLETE

- [x] Schema updated to PostgreSQL
- [x] Prisma client generated
- [x] Database connection tested
- [x] Build tested successfully
- [x] JWT secret generated

## Next Steps: Deploy to Netlify

### Option 1: GitHub + Netlify (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Ready for Netlify deployment with Supabase"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/salin.git
   git push -u origin main
   ```

2. **Deploy on Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `.next`
     - **Node version:** 20
   
3. **Add Environment Variables:**
   Go to Site settings → Environment variables and add:
   
   ```
   DATABASE_URL = postgresql://postgres:JfE59wvv7CUwgEs7@db.oddbqpehuvjphcgxbrde.supabase.co:5432/postgres
   JWT_SECRET = 9e64c299f3f6d7ba0b73f61b97e83b0c3efd6b5fd6510bfd382de12cde20532c
   NEXT_PUBLIC_APP_NAME = Salin Family
   NODE_ENV = production
   ```

4. **Deploy!**
   - Click "Deploy site"
   - Wait 2-3 minutes for build
   - Your site will be live!

### Option 2: Netlify CLI

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Set environment variables
netlify env:set DATABASE_URL "postgresql://postgres:JfE59wvv7CUwgEs7@db.oddbqpehuvjphcgxbrde.supabase.co:5432/postgres"
netlify env:set JWT_SECRET "9e64c299f3f6d7ba0b73f61b97e83b0c3efd6b5fd6510bfd382de12cde20532c"
netlify env:set NEXT_PUBLIC_APP_NAME "Salin Family"
netlify env:set NODE_ENV "production"

# Deploy
netlify deploy --prod
```

## Post-Deployment

1. **Test the deployed site:**
   - Login with: `admin` / `admin123`
   - Create a test task
   - Test language switcher (FI/EN)
   - Test edit/delete functionality

2. **Change admin password:**
   - Go to Admin page
   - Update admin password immediately

3. **Custom domain (optional):**
   - Go to Domain settings in Netlify
   - Add your custom domain
   - Update DNS records

## Default Credentials

**⚠️ IMPORTANT: Change these after first login!**

- Username: `admin`
- Password: `admin123`

## Features Deployed

✅ Finnish/English localization
✅ Task management (Create, Read, Update, Delete)
✅ Task categories (Finnish names)
✅ User management
✅ Priority levels
✅ Due dates
✅ Task assignment
✅ Dashboard statistics
✅ Search and filters
✅ Edit task dialog

## Support

- **Netlify Docs:** https://docs.netlify.com/frameworks/next-js/
- **Supabase Docs:** https://supabase.com/docs
- **Your Supabase Dashboard:** https://supabase.com/dashboard/project/oddbqpehuvjphcgxbrde

## Cost

- **Netlify:** FREE (100GB bandwidth/month)
- **Supabase:** FREE (500MB database, 2GB bandwidth/month)
- **Total:** $0/month 🎉

---

**Ready to deploy!** Choose Option 1 or 2 above and follow the steps.
