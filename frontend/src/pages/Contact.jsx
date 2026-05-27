import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaLinkedin } from 'react-icons/fa';
import contactService from '../services/contactService';
import Seo from '../components/Seo';

const contactSeo = {
  title: 'Contact Devansh Yadav | AI/ML and Web Developer in Lucknow',
  description:
    'Contact Devansh Yadav for AI/ML, web development, internship, freelance, and collaboration opportunities from Lucknow or remote.',
  keywords: ['Contact Devansh Me', 'Devansh Lucknow', 'Devansh BBD', 'AI/ML Developer', 'Web Developer', 'BBDU'],
};

export default function Contact() {
  const linkedinUrl = 'https://www.linkedin.com/in/ydevansh/';

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
    <div className="relative overflow-hidden pt-32 pb-20">
      <Seo
        title={contactSeo.title}
        description={contactSeo.description}
        keywords={contactSeo.keywords}
        canonicalPath="/contact"
      />

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 left-[-8rem] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-10 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(168,85,247,0.14),transparent_26%),radial-gradient(circle_at_50%_92%,rgba(59,130,246,0.08),transparent_34%)]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a1430]/65 p-5 shadow-[0_24px_60px_rgba(2,6,23,0.35)] sm:p-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.12),transparent_35%)]" />
            <div className="relative space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                  Get in touch
                </span>
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-300">
                  Collaboration · Internship · Freelance
                </span>
                <span className="inline-flex rounded-full border border-violet-300/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium text-violet-100">
                  Lucknow · Remote
                </span>
              </div>

              <div className="space-y-2.5">
                <h1 className="max-w-2xl text-2xl font-bold leading-[1.06] tracking-[-0.04em] text-white sm:text-3xl md:text-4xl">
                  <span className="block">Contact Devansh Yadav</span>
                  <span className="block bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                    for useful ideas and real projects
                  </span>
                </h1>
                <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-[15px]">
                  Feel free to reach out for collaborations, internships, or freelance work from Lucknow or remote.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(59,130,246,0.25)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <FaLinkedin size={14} />
                  Message me on LinkedIn
                </a>

                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-slate-100 transition-colors duration-300 hover:border-cyan-400/35 hover:bg-cyan-500/10"
                >
                  Send a Message
                  <FaArrowRight size={13} />
                </a>
              </div>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300">
                  <FaLinkedin size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                    LinkedIn
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">Devansh Yadav</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Message me directly for collaborations, internships, and professional opportunities.
                  </p>
                </div>
              </div>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/15 px-4 py-2.5 text-sm font-medium text-sky-200 transition-colors hover:bg-sky-500/25 hover:border-sky-400"
              >
                Open LinkedIn Profile
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

          <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
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
