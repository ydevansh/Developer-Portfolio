import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Author title/role is required'],
    },
    message: {
      type: String,
      required: [true, 'Testimonial message is required'],
    },
    image: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
