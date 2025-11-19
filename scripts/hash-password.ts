import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('❌ Please provide a password to hash');
  console.log('Usage: npm run hash-password <password>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\n✅ Password hashed successfully!');
console.log('\nHash:', hash);
console.log('\nYou can use this hash in Prisma Studio or database directly.');
