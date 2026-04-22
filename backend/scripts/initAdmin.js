import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const initializeAdmin = async () => {
  try {
    const adminEmail = typeof process.env.ADMIN_EMAIL === 'string' ? process.env.ADMIN_EMAIL.trim() : '';
    const adminPassword = typeof process.env.ADMIN_PASSWORD === 'string' ? process.env.ADMIN_PASSWORD.trim() : '';

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD is missing from .env');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📝 Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('✅ Admin user already exists');
      console.log(`   Email: ${adminExists.email}`);
      console.log(`   Name: ${adminExists.fullName}`);
      process.exit(0);
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      fullName: 'Devansh Yadav',
      role: 'admin',
    });

    await admin.save();

    console.log('✅ Admin user created successfully');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.fullName}`);
    console.log(`   Password: ${adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    process.exit(1);
  }
};

initializeAdmin();
