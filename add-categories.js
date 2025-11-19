const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📁 Adding categories...');

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
    console.log(`✅ Added: ${category.name} ${category.icon}`);
  }

  console.log('\n🎉 All categories added!');
  await prisma.$disconnect();
}

main();
