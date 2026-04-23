import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const normalizeValue = (value) => (typeof value === 'string' ? value.trim() : '');
const isValidBcryptHash = (value) => /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);

const initializeAdmin = async () => {
  try {
    const adminEmail = normalizeValue(process.env.ADMIN_EMAIL).toLowerCase();
    const adminPasswordHash = normalizeValue(process.env.ADMIN_PASSWORD_HASH);

    if (!adminEmail || !adminPasswordHash) {
      throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD_HASH is missing from .env');
    }

    if (!isValidBcryptHash(adminPasswordHash)) {
      throw new Error('ADMIN_PASSWORD_HASH must be a valid bcrypt hash');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📝 Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      adminExists.password = adminPasswordHash;
      await adminExists.save();

      console.log('✅ Admin user already exists and password hash was synchronized');
      console.log(`   Email: ${adminExists.email}`);
      console.log(`   Name: ${adminExists.fullName}`);
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      email: adminEmail,
      password: adminPasswordHash,
      fullName: 'Devansh Yadav',
      role: 'admin',
    });

    await admin.save();

    console.log('✅ Admin user created successfully');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.fullName}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    process.exit(1);
  }
};

initializeAdmin();
