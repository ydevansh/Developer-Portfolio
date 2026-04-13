import Testimonial from '../models/Testimonial.js';

export const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ approved: true })
      .sort({ featured: -1, order: 1, createdAt: -1 });

    res.json({
      message: 'Testimonials fetched successfully',
      testimonials,
    });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const { author, title, message, image, rating, featured } = req.body;

    if (!author || !title || !message) {
      return res.status(400).json({ message: 'Author, title, and message are required' });
    }

    const testimonial = new Testimonial({
      author,
      title,
      message,
      image,
      rating,
      featured: featured || false,
      approved: false, // Admin approval needed
    });

    await testimonial.save();

    res.status(201).json({
      message: 'Testimonial submitted successfully',
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

export const approveTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { approved },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({
      message: 'Testimonial updated successfully',
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({
      message: 'Testimonial updated successfully',
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default { getAllTestimonials, createTestimonial, approveTestimonial, updateTestimonial, deleteTestimonial };
