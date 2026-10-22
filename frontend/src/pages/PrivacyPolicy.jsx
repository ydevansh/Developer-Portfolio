import React from 'react';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';

const privacySeo = {
  title: 'Privacy Policy | Devansh Yadav',
  description: 'Privacy policy for the Devansh Yadav portfolio website.',
  keywords: ['Privacy Policy', 'Devansh Yadav portfolio'],
};

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-20">
      <Seo
        title={privacySeo.title}
        description={privacySeo.description}
        keywords={privacySeo.keywords}
        canonicalPath="/privacy-policy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.article
          className="relative border border-[#00E5FF]/20 bg-black/80 p-6 sm:p-8 md:p-10 space-y-8"
          style={{ borderRadius: '0px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Corner decorators */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00E5FF]/60" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00E5FF]/60" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00E5FF]/60" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00E5FF]/60" />

          <header className="space-y-3 border-b border-[#00E5FF]/15 pb-6">
            <div className="font-mono text-[11px] text-[#00E5FF]/50 mb-2 tracking-widest">$ cat privacy-policy.md</div>
            <h1 className="font-mono text-3xl md:text-4xl font-bold text-white">Privacy <span className="text-[#00E5FF]">Policy</span></h1>
            <p className="font-mono text-sm text-[#A1A1AA]/60">Last Updated: April 23, 2026</p>
            <p className="font-mono text-[#A1A1AA] leading-relaxed">
              This Privacy Policy explains how information is collected, used, and protected when you visit this personal developer
              portfolio website. This website is operated as an individual portfolio and not as a large commercial organization.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-mono text-xl md:text-2xl font-semibold text-white border-l-2 border-[#00E5FF] pl-3">1. Information We Collect</h2>
            <p className="font-mono text-[#A1A1AA] leading-relaxed">
              Personal information is collected only when you voluntarily submit the contact form. The information collected may include:
            </p>
            <ul className="font-mono space-y-2 text-[#A1A1AA] pl-4">
              <li className="flex gap-2"><span className="text-[#00E5FF]">&gt;</span> Your name</li>
              <li className="flex gap-2"><span className="text-[#00E5FF]">&gt;</span> Your email address</li>
              <li className="flex gap-2"><span className="text-[#00E5FF]">&gt;</span> Your message or inquiry details</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-mono text-xl md:text-2xl font-semibold text-white border-l-2 border-[#00E5FF] pl-3">2. How We Use Information</h2>
            <p className="font-mono text-[#A1A1AA] leading-relaxed">The collected information is used solely for the following purposes:</p>
            <ul className="font-mono space-y-2 text-[#A1A1AA] pl-4">
              <li className="flex gap-2"><span className="text-[#00E5FF]">&gt;</span> Responding to your messages or inquiries</li>
              <li className="flex gap-2"><span className="text-[#00E5FF]">&gt;</span> Communicating regarding potential collaborations or professional opportunities</li>
              <li className="flex gap-2"><span className="text-[#00E5FF]">&gt;</span> Improving the overall user experience of this website</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-mono text-xl md:text-2xl font-semibold text-white border-l-2 border-[#00E5FF] pl-3">3. Data Protection</h2>
            <p className="font-mono text-[#A1A1AA] leading-relaxed">
              Reasonable technical and administrative measures are used to safeguard personal information. Personal data is not sold,
              rented, traded, or shared with third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-mono text-xl md:text-2xl font-semibold text-white border-l-2 border-[#00E5FF] pl-3">4. Cookies</h2>
            <p className="font-mono text-[#A1A1AA] leading-relaxed">
              This website may use minimal cookies or similar technologies required for basic functionality and performance. These do
              not intentionally collect personally identifiable information through browsing alone.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold text-white">5. Third-Party Links</h2>
            <p className="text-gray-300 leading-relaxed">
              This website may contain links to third-party platforms such as GitHub, LinkedIn, or other external sites. Their privacy
              practices are governed by their own policies, and this website is not responsible for those external practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold text-white">6. User Consent</h2>
            <p className="text-gray-300 leading-relaxed">
              By using this website and submitting information through the contact form, you acknowledge and consent to the practices
              described in this Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold text-white">7. Policy Updates</h2>
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy may be revised from time to time to reflect updates in website functionality or legal requirements.
              Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section className="space-y-3 border-t border-primary-500/20 pt-6">
            <h2 className="text-xl md:text-2xl font-semibold text-white">8. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">For any questions regarding this Privacy Policy, please contact:</p>
            <p className="text-gray-200">
              Email:{' '}
              <a
                href="mailto:yaduvanshidevansh3336@gmail.com"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                yaduvanshidevansh3336@gmail.com
              </a>
            </p>
          </section>
        </motion.article>
      </div>
    </div>
  );
}
