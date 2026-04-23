import bcrypt from 'bcryptjs';

const plainPassword = process.argv[2];
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

if (!plainPassword) {
  console.error('Usage: npm run hash-admin-password -- "your-plain-password"');
  process.exit(1);
}

if (!Number.isInteger(saltRounds) || saltRounds < 10) {
  console.error('BCRYPT_SALT_ROUNDS must be an integer of at least 10');
  process.exit(1);
}

const generateHash = async () => {
  try {
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  } catch (error) {
    console.error('Failed to generate password hash:', error.message);
    process.exit(1);
  }
};

generateHash();
