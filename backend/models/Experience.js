import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Education', 'Work Experience'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title/Position is required'],
    },
    organization: {
      type: String,
      required: [true, 'Organization/Company is required'],
    },
    description: {
      type: String,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isCurrently: {
      type: Boolean,
      default: false,
    },
    technologies: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Experience', experienceSchema);
