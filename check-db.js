const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany();
  
  console.log('📊 Database Status:');
  console.log(`   Users: ${users.length}`);
  console.log(`   Categories: ${categories.length}`);
  
  if (users.length > 0) {
    console.log('\n👥 Users:');
    users.forEach(u => console.log(`   - ${u.username} (${u.role})`));
  }
  
  if (categories.length > 0) {
    console.log('\n📁 Categories:');
    categories.forEach(c => console.log(`   - ${c.name} ${c.icon}`));
  }
  
  await prisma.$disconnect();
}

check();
