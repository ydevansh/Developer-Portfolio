import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaLinkedin } from 'react-icons/fa';
import contactService from '../services/contactService';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildFaqSchema } from '../data/seoSchemas';

const contactSeo = {
  title: 'Contact Devansh Yadav | Hire a Python, MERN & React Developer in Lucknow',
  description:
    'Contact Devansh Yadav for freelancing, internships, collaboration, full stack development, and AI projects from Lucknow or remotely.',
  keywords: ['Contact Devansh Yadav', 'Deva Yadav', 'Python Developer', 'MERN Stack Developer', 'React Developer', 'Lucknow'],
};

const contactFaq = [
  {
    question: 'How quickly does Devansh Yadav reply?',
    answer: 'I usually reply as soon as possible and try to respond within one to two working days depending on the request.',
  },
  {
    question: 'What can I contact Devansh Yadav for?',
    answer: 'You can contact me for internships, freelance work, portfolio websites, full stack development, AI integration, and student project help.',
  },
  {
    question: 'Do you work with remote clients?',
    answer: 'Yes. I am open to remote collaboration across India and can also work on location-specific projects in Lucknow and Uttar Pradesh.',
  },
];

export default function Contact() {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ], '/contact'),
    buildFaqSchema(contactFaq, '/contact'),
  ];

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

  /* Terminal-style input classes */
  const inputClasses = (fieldName) =>
    `font-mono w-full px-4 py-2.5 bg-black border text-white placeholder-[#A1A1AA]/50 focus:outline-none transition-colors ${
      fieldErrors[fieldName]
        ? 'border-red-500/70 focus:border-red-400'
        : 'border-[#00E5FF]/25 focus:border-[#00E5FF]/70 hover:border-[#00E5FF]/40'
    }`;

  return (
    <div className="relative overflow-x-hidden pt-32 pb-20">
      <Seo
        title={contactSeo.title}
        description={contactSeo.description}
        keywords={contactSeo.keywords}
        canonicalPath="/contact"
        structuredData={structuredData}
      />

      {/* Subtle starfield bg — no colored orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.04),transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Concise Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div
                className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF]"
                style={{ borderRadius: '0px' }}
              >
                <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
                $ contact --init
              </div>
              <span className="font-mono text-xs text-gray-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_6px_rgba(0,229,255,0.6)]" />
                Lucknow · Remote
              </span>
            </div>

            <h1 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Let&apos;s build something <span className="text-[#00E5FF]">together</span>.
            </h1>

            <p className="font-sans text-sm sm:text-base leading-relaxed text-gray-300">
              Open for internships, freelance projects, and collaborations. Drop a message below or connect directly on LinkedIn.
            </p>

            <div className="pt-1">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/50 bg-[#00E5FF]/5 px-4 py-2 text-xs sm:text-sm font-semibold text-[#00E5FF] transition-all duration-300 hover:bg-[#00E5FF] hover:text-black"
                style={{ borderRadius: '0px' }}
              >
                <FaLinkedin size={15} />
                Message on LinkedIn
                <FaArrowRight size={11} className="ml-0.5" />
              </a>
            </div>
          </motion.section>

          {success && (
            <div className="font-mono border border-[#00E5FF]/50 bg-[#00E5FF]/10 p-4 text-[#00E5FF]" style={{ borderRadius: '0px' }}>
              ✓ Message sent successfully! I&apos;ll get back to you soon.
            </div>
          )}

          {errorMessage && (
            <div className="font-mono border border-red-500/50 bg-red-500/10 p-4 text-red-300" style={{ borderRadius: '0px' }}>
              ✗ {errorMessage}
            </div>
          )}

          {/* Contact Form */}
          <form id="contact-form" onSubmit={handleSubmit} className="relative space-y-5 border border-[#00E5FF]/20 bg-black/80 p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" style={{ borderRadius: '0px' }}>
            {/* Terminal corner accents */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#00E5FF]/60" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#00E5FF]/60" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#00E5FF]/60" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#00E5FF]/60" />

            <div className="flex items-center justify-between pb-2 border-b border-[#00E5FF]/10">
              <span className="font-mono text-xs text-[#00E5FF] font-semibold tracking-wider">$ send_message.sh</span>
              <span className="font-mono text-[11px] text-gray-500">all fields required</span>
            </div>

            <div>
              <label className="font-mono block text-xs uppercase tracking-wider text-gray-400 mb-2">&gt; name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-invalid={Boolean(fieldErrors.name)}
                className={inputClasses('name')}
                style={{ borderRadius: '0px' }}
                placeholder="Devansh Yadav"
              />
              {fieldErrors.name && <p className="font-mono mt-2 text-sm text-red-400">✗ {fieldErrors.name}</p>}
            </div>

            <div>
              <label className="font-mono block text-xs uppercase tracking-wider text-gray-400 mb-2">&gt; email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-invalid={Boolean(fieldErrors.email)}
                className={inputClasses('email')}
                style={{ borderRadius: '0px' }}
                placeholder="your@email.com"
              />
              {fieldErrors.email && <p className="font-mono mt-2 text-sm text-red-400">✗ {fieldErrors.email}</p>}
            </div>

            <div>
              <label className="font-mono block text-xs uppercase tracking-wider text-gray-400 mb-2">&gt; message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                aria-invalid={Boolean(fieldErrors.message)}
                className={`${inputClasses('message')} resize-none`}
                style={{ borderRadius: '0px' }}
                placeholder="Your message here..."
              />
              {fieldErrors.message && <p className="font-mono mt-2 text-sm text-red-400">✗ {fieldErrors.message}</p>}
            </div>

            <button
              type="submit"
              id="contact-submit-btn"
              disabled={loading}
              className="font-mono w-full px-6 py-3 border border-[#00E5FF]/60 text-[#00E5FF] font-medium transition-all duration-300 hover:bg-[#00E5FF] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: '0px' }}
            >
              {loading ? '$ sending...' : '$ send --message'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
