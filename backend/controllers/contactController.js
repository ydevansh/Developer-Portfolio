import Contact from '../models/Contact.js';
import sendContactEmail from '../utils/emailService.js';

export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Save contact to database
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    // Send email notification
    const emailSent = await sendContactEmail(name, email, 'Contact Form Submission', message);

    if (!emailSent) {
      console.warn('⚠️  Contact saved but email notification failed to send');
    }

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Messages fetched successfully',
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Contact.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message fetched successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Contact.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  submitContactForm,
  getAllMessages,
  getMessageById,
  deleteMessage,
};
