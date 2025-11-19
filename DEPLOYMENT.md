# Salin - Deployment Guide

Complete guide for deploying Salin Family Task Manager to cPanel hosting.

## Prerequisites

Before deploying, ensure you have:

- ✅ cPanel hosting with Node.js support
- ✅ MySQL database created in cPanel
- ✅ SSH access configured
- ✅ SSH key set up (`C:\Users\murat.salin\.ssh\cpanel_deploy`)
- ✅ Application built and tested locally

## Quick Deployment

### 1. Configure Deployment Settings

Copy the deployment environment file:
```bash
cp .env.deploy.example .env.deploy
```

Edit `.env.deploy` with your server details (already configured for kohtaanto.fi):
```env
DEPLOY_HOST=31.217.196.220
DEPLOY_PORT=22
DEPLOY_USERNAME=utancuom
DEPLOY_KEY_PATH=C:\Users\murat.salin\.ssh\cpanel_deploy
DEPLOY_REMOTE_PATH=/home5/utancuom/public_html/salin
```

### 2. Set Up Production Database

In cPanel MySQL:

1. **Create Database**: `utancuom_salin` (or your preferred name)
2. **Create Database User**: `utancuom_salin_user`
3. **Set Strong Password**: Generate and save securely
4. **Grant All Privileges**: Assign user to database

### 3. Configure Production Environment

Create `.env.production` on the server at `/home5/utancuom/public_html/salin/.env`:

```env
# Database Connection
DATABASE_URL="mysql://utancuom_salin_user:YOUR_PASSWORD@localhost:3306/utancuom_salin"

# JWT Secret (IMPORTANT: Generate a random string!)
JWT_SECRET="your-very-long-random-secret-key-change-this"

# App Configuration
NEXT_PUBLIC_APP_NAME="Salin Family"
NODE_ENV="production"
```

**⚠️ IMPORTANT**: Generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy Application

Run the deployment script:
```bash
npm run deploy
```

This will:
- Build the Next.js application
- Create a backup of existing deployment
- Upload build files to server
- Install production dependencies
- Generate Prisma Client
- Set correct permissions
- Restart the application

### 5. Initialize Database

SSH into your server:
```bash
ssh -i C:\Users\murat.salin\.ssh\cpanel_deploy utancuom@31.217.196.220
```

Navigate to app directory:
```bash
cd /home5/utancuom/public_html/salin
```

Run database migrations:
```bash
npx prisma db push
```

Seed the database with admin user and categories:
```bash
npm run db:seed
```

### 6. Configure cPanel Node.js App

In cPanel:

1. Go to **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `public_html/salin`
   - **Application URL**: `salin` (will be accessible at kohtaanto.fi/salin)
   - **Application startup file**: `server.js` or use Next.js standalone
4. Click **Create**
5. **Restart** the application

### 7. Verify Deployment

Visit: `https://kohtaanto.fi/salin`

Login with default credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT**: Change the admin password immediately after first login!

## Manual Deployment Steps

If automatic deployment fails, follow these manual steps:

### Build Locally
```bash
npm run build
```

### Upload Files via SFTP

Upload these directories/files:
- `.next/` - Build output
- `public/` - Static assets
- `package.json` - Dependencies
- `package-lock.json` - Lock file
- `prisma/` - Database schema

### Install Dependencies on Server
```bash
cd /home5/utancuom/public_html/salin
npm ci --production
npx prisma generate
```

### Set Permissions
```bash
chmod -R 755 /home5/utancuom/public_html/salin
```

## Post-Deployment

### Security Checklist

- [ ] Change default admin password
- [ ] Verify JWT_SECRET is unique and secure
- [ ] Check database credentials are correct
- [ ] Ensure `.env` files are not publicly accessible
- [ ] Test all authentication flows
- [ ] Verify task creation/deletion works
- [ ] Check user management (admin only)

### Performance Optimization

1. **Enable caching** in cPanel
2. **Configure CDN** if available
3. **Monitor database** performance
4. **Set up backups** (automated in cPanel)

### Monitoring

Check application logs:
```bash
cd /home5/utancuom/public_html/salin
tail -f logs/application.log
```

Check Node.js app status in cPanel:
- Setup Node.js App → Your Application → View Logs

## Troubleshooting

### Application Won't Start

1. Check Node.js version: `node --version` (should be 18+)
2. Verify environment variables are set
3. Check database connection
4. Review application logs

### Database Connection Errors

1. Verify DATABASE_URL format
2. Check MySQL user permissions
3. Ensure database exists
4. Test connection: `npx prisma db pull`

### Build Errors

1. Clear local build: `rm -rf .next`
2. Reinstall dependencies: `npm ci`
3. Rebuild: `npm run build`
4. Check for TypeScript errors

### Permission Errors

```bash
chmod -R 755 /home5/utancuom/public_html/salin
chown -R utancuom:utancuom /home5/utancuom/public_html/salin
```

## Updating the Application

### Deploy Updates

1. Make changes locally
2. Test thoroughly: `npm run dev`
3. Deploy: `npm run deploy`

The deployment script automatically:
- Creates a backup
- Uploads new files
- Restarts the application

### Rollback to Previous Version

If deployment fails:
```bash
cd /home5/utancuom/backups
ls -lt  # Find latest backup
cp -r salin_TIMESTAMP /home5/utancuom/public_html/salin
```

### Database Migrations

For schema changes:
```bash
# On server
cd /home5/utancuom/public_html/salin
npx prisma migrate deploy
```

## Backup Strategy

### Automated Backups

The deployment script creates backups in:
```
/home5/utancuom/backups/salin_YYYY-MM-DDTHH-MM-SS/
```

### Manual Backup

Database:
```bash
mysqldump -u utancuom_salin_user -p utancuom_salin > backup.sql
```

Files:
```bash
tar -czf salin_backup.tar.gz /home5/utancuom/public_html/salin
```

### Restore from Backup

Database:
```bash
mysql -u utancuom_salin_user -p utancuom_salin < backup.sql
```

Files:
```bash
tar -xzf salin_backup.tar.gz -C /home5/utancuom/public_html/
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@localhost:3306/db` |
| `JWT_SECRET` | Secret key for JWT tokens | Random 32+ character string |
| `NODE_ENV` | Environment mode | `production` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Application name | `Salin Family` |
| `PORT` | Server port | `3000` |

## Support

### Common URLs

- **Application**: https://kohtaanto.fi/salin
- **cPanel**: https://kohtaanto.fi:2083
- **phpMyAdmin**: Via cPanel

### Useful Commands

```bash
# Check app status
pm2 status

# View logs
pm2 logs salin

# Restart app
pm2 restart salin

# Check Node.js version
node --version

# Test database connection
npx prisma db pull
```

## Next Steps

After successful deployment:

1. ✅ Login and change admin password
2. ✅ Create family member accounts
3. ✅ Test task creation and management
4. ✅ Set up regular database backups
5. ✅ Monitor application performance
6. ✅ Share access with family members

---

**Deployment completed!** Your family can now access Salin at https://kohtaanto.fi/salin 🎉
