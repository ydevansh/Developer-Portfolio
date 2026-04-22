import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import contactService from '../services/contactService';

export default function Contact() {
  const whatsappNumber = '+91 6388525760';
  const whatsappLink = 'https://wa.me/916388525760?text=Hello%20Devansh%2C%20I%20would%20like%20to%20connect';

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const emailPattern = /^\S+@\S+\.\S+$/;

  const validateForm = () => {
    const nextErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      nextErrors.name = 'Name is required';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required';
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!trimmedMessage) {
      nextErrors.message = 'Message is required';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage('Please correct the highlighted fields and try again.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      await contactService.submitForm(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setFieldErrors({});
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      const apiErrors = error.response?.data?.errors || [];

      if (apiErrors.length > 0) {
        const mappedErrors = apiErrors.reduce((accumulator, apiError) => {
          accumulator[apiError.field] = apiError.message;
          return accumulator;
        }, {});

        setFieldErrors(mappedErrors);
        setErrorMessage(error.response?.data?.message || 'Please correct the highlighted fields and try again.');
      } else {
        setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (fieldName) =>
    `w-full px-4 py-2 bg-primary-500/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
      fieldErrors[fieldName]
        ? 'border-red-500 focus:border-red-500'
        : 'border-primary-500/30 focus:border-primary-500'
    }`;

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-gray-400">Feel free to reach out for collaborations or inquiries</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <FaWhatsapp size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    WhatsApp
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-white">{whatsappNumber}</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Message me directly for faster replies and project inquiries.
                  </p>
                </div>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-500/25 hover:border-emerald-400"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>

          {success && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-green-400">
              Message sent successfully! I'll get back to you soon.
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-invalid={Boolean(fieldErrors.name)}
                className={inputClasses('name')}
                placeholder="Your name"
              />
              {fieldErrors.name && <p className="mt-2 text-sm text-red-300">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-invalid={Boolean(fieldErrors.email)}
                className={inputClasses('email')}
                placeholder="your@email.com"
              />
              {fieldErrors.email && <p className="mt-2 text-sm text-red-300">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                aria-invalid={Boolean(fieldErrors.message)}
                className={`${inputClasses('message')} resize-none`}
                placeholder="Your message..."
              />
              {fieldErrors.message && <p className="mt-2 text-sm text-red-300">{fieldErrors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
