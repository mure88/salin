# 🚀 Salin - Quick Start (5 Minutes)

## Prerequisites
- Node.js installed
- MySQL running (local or remote)

## Step-by-Step

### 1. Configure Database (1 min)
Edit `.env` file:
```env
DATABASE_URL="mysql://root:password@localhost:3306/salin_dev"
```
Replace with your MySQL credentials.

### 2. Setup Database (2 min)
```bash
# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma db push

# Add admin user and categories
npm run db:seed
```

### 3. Start App (1 min)
```bash
npm run dev
```

### 4. Login (1 min)
Open http://localhost:3000

**Login credentials:**
- Username: `admin`
- Password: `admin123`

## That's it! 🎉

You're now logged into the Salin Family dashboard.

## What's Next?

1. **Change admin password** (important!)
2. **Add family members** via Prisma Studio:
   ```bash
   npm run db:studio
   ```
3. **Start using the app** - tasks coming in Phase 2!

## Need Help?

- Full setup guide: `SETUP.md`
- Project status: `PROJECT_STATUS.md`
- README: `README.md`

## Common Issues

**"Cannot connect to database"**
- Make sure MySQL is running
- Check DATABASE_URL in `.env`

**"Prisma Client not found"**
- Run: `npx prisma generate`

**"Login not working"**
- Make sure you ran: `npm run db:seed`
