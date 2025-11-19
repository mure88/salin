const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Initialize Prisma Client without options to avoid compatibility issues
const prisma = new PrismaClient({});

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hashSync('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
      displayName: 'Administrator',
    },
  });

  console.log('✅ Created admin user:', admin.username);

  // Create default categories
  const categories = [
    { name: 'School', color: '#3b82f6', icon: '🎓' },
    { name: 'Work', color: '#8b5cf6', icon: '💼' },
    { name: 'Hobbies', color: '#ec4899', icon: '🎨' },
    { name: 'Home', color: '#10b981', icon: '🏠' },
    { name: 'Health', color: '#f59e0b', icon: '💪' },
    { name: 'Shopping', color: '#06b6d4', icon: '🛒' },
    { name: 'Other', color: '#6366f1', icon: '📌' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Created default categories');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Default admin credentials:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('\n⚠️  Please change the admin password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
