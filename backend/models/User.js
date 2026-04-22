import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 604800, // 7 days
        },
      },
    ],
    sessions: [
      {
        sessionId: String,
        ipAddress: String,
        userAgent: String,
        loginAt: {
          type: Date,
          default: Date.now,
        },
        lastActive: {
          type: Date,
          default: Date.now,
        },
        expiresAt: {
          type: Date,
          expires: 604800, // 7 days
        },
      },
    ],
    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
