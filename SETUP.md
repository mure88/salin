# Salin - Quick Setup Guide

## Initial Setup (First Time)

### 1. Database Setup

You have two options:

#### Option A: Local MySQL (for development)
```bash
# Make sure MySQL is running locally
# Update .env with your local MySQL credentials
DATABASE_URL="mysql://root:password@localhost:3306/salin_dev"
```

#### Option B: cPanel MySQL (for production)
```bash
# Create database in cPanel
# Update .env with cPanel MySQL credentials
DATABASE_URL="mysql://username:password@host:3306/database_name"
```

### 2. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Seed database with admin user and default categories
npm run db:seed
```

This will create:
- **Admin user**: username: `admin`, password: `admin123`
- **Default categories**: School, Work, Hobbies, Home, Health, Shopping, Other

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and login with:
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change the admin password after first login!

## Database Management

### View/Edit Database
```bash
npm run db:studio
```

This opens Prisma Studio in your browser where you can:
- View all users and tasks
- Create new users manually
- Edit or delete data

### Reset Database (if needed)
```bash
# This will delete all data and recreate tables
npx prisma db push --force-reset

# Then re-seed
npm run db:seed
```

## Creating New Users

### Method 1: Via Prisma Studio (Easiest)
1. Run `npm run db:studio`
2. Click on "User" table
3. Click "Add record"
4. Fill in:
   - username: (choose username)
   - passwordHash: (you'll need to hash the password - see below)
   - role: ADMIN or MEMBER
   - displayName: (optional)

### Method 2: Via Seed Script
Edit `prisma/seed.ts` and add more users, then run `npm run db:seed`

### Hashing Passwords
To generate a password hash for manual user creation:

```javascript
// Run in Node.js console or create a small script
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-password', 10);
console.log(hash);
```

## Production Deployment

### 1. Build Application
```bash
npm run build
```

### 2. Set Up Production Database
- Create MySQL database in cPanel
- Update `.env` with production credentials
- Run migrations: `npx prisma db push`
- Seed database: `npm run db:seed`

### 3. Deploy to cPanel
Similar to kohtaanto project:
- Upload built files to server
- Configure Node.js app in cPanel
- Set environment variables

## Environment Variables

Required variables in `.env`:

```env
# Database
DATABASE_URL="mysql://user:pass@host:3306/dbname"

# Authentication (generate a random string for production!)
JWT_SECRET="your-very-long-random-secret-key"

# App Config
NEXT_PUBLIC_APP_NAME="Salin Family"
NODE_ENV="production"
```

## Troubleshooting

### "Cannot connect to database"
- Check MySQL is running
- Verify DATABASE_URL credentials
- Ensure database exists

### "Prisma Client not generated"
Run: `npx prisma generate`

### "Invalid credentials" on login
- Verify user exists in database
- Check password was hashed correctly
- Try re-seeding: `npm run db:seed`

### TypeScript errors about Prisma types
Run: `npx prisma generate` to regenerate types

## Next Steps

After successful setup:
1. ✅ Login with admin credentials
2. ✅ Change admin password
3. ✅ Create family member accounts
4. ✅ Start creating tasks and reminders
5. ✅ Customize categories if needed

## Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev  # Create a new migration
```
