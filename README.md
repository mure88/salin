# Salin Family Task Manager

A private family task and reminder management app built with Next.js, TypeScript, and MySQL.

## Features

- 🔐 Secure authentication (username/password only)
- 👨‍👩‍👧‍👦 Family-focused task management
- 📅 Tasks with categories, priorities, and due dates
- 🔄 Recurring reminders
- 👑 Admin-only user management
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🌙 Dark mode support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your MySQL credentials:

```env
DATABASE_URL="mysql://username:password@localhost:3306/salin_db"
JWT_SECRET="your-random-secret-key-here"
NEXT_PUBLIC_APP_NAME="Salin Family"
NODE_ENV="development"
```

### 3. Set Up Database

Create a MySQL database and run Prisma migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate dev --name init
```

### 4. Create Admin User

You'll need to create the first admin user manually. Use the Prisma Studio or run a script:

```bash
npx prisma studio
```

Or create a seed script to add your first admin user.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to the login page.

## Database Schema

- **Users**: Username, password (hashed), role (ADMIN/MEMBER)
- **Tasks**: Title, description, category, priority, status, due date, recurring pattern
- **Categories**: Name, color, icon

## Deployment

This app is designed to be deployed to cPanel hosting:

1. Build the application: `npm run build`
2. Upload to your server (similar to kohtaanto deployment)
3. Set up MySQL database on cPanel
4. Configure environment variables
5. Run migrations on production database

## Admin Features

Only users with ADMIN role can:
- Create new users
- Delete users
- Manage all tasks

## Security

- Passwords are hashed with bcrypt
- Sessions use JWT with httpOnly cookies
- No email or personal data required
- Admin-only user registration
