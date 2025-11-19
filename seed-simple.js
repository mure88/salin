// Simple seed script for SQLite
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
      displayName: 'Administrator',
    },
  });

  console.log('✅ Created admin user:', admin.username);

  // Create default categories
  const categories = [
    { id: 'cat-1', name: 'School', color: '#3b82f6', icon: '🎓' },
    { id: 'cat-2', name: 'Work', color: '#8b5cf6', icon: '💼' },
    { id: 'cat-3', name: 'Hobbies', color: '#ec4899', icon: '🎨' },
    { id: 'cat-4', name: 'Home', color: '#10b981', icon: '🏠' },
    { id: 'cat-5', name: 'Health', color: '#f59e0b', icon: '💪' },
    { id: 'cat-6', name: 'Shopping', color: '#06b6d4', icon: '🛒' },
    { id: 'cat-7', name: 'Other', color: '#6366f1', icon: '📌' },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log('✅ Created 7 default categories');

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
