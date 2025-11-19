const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📁 Updating categories to Finnish...');

  const updates = [
    { old: 'School', new: 'Koulu' },
    { old: 'Work', new: 'Työ' },
    { old: 'Hobbies', new: 'Harrastukset' },
    { old: 'Home', new: 'Koti' },
    { old: 'Health', new: 'Terveys' },
    { old: 'Shopping', new: 'Ostokset' },
    { old: 'Other', new: 'Muu' },
  ];

  for (const update of updates) {
    try {
      await prisma.category.update({
        where: { name: update.old },
        data: { name: update.new },
      });
      console.log(`✅ Updated: ${update.old} → ${update.new}`);
    } catch (err) {
      console.log(`⚠️  ${update.old} not found, skipping...`);
    }
  }

  console.log('\n🎉 Categories updated to Finnish!');
  await prisma.$disconnect();
}

main();
