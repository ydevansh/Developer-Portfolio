import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCode,
  FaServer,
  FaRocket,
  FaCheck,
  FaTimes,
  FaLightbulb,
  FaCoffee,
  FaClock,
  FaLayerGroup,
  FaShieldAlt,
  FaDatabase,
  FaChevronDown,
  FaBriefcase,
  FaUserTie,
  FaGraduationCap,
} from 'react-icons/fa';
import { HiOutlineCpuChip } from 'react-icons/hi2';
import { SiReact, SiNodedotjs, SiMongodb, SiPython, SiTailwindcss, SiFastapi } from 'react-icons/si';
import Seo from '../components/Seo';

/* ─────────────────────────────── SEO ─────────────────────────────── */
const servicesSeo = {
  title: 'Services | Devansh Yadav – Full Stack, AI & Web Development',
  description:
    'Hire Devansh Yadav for Full Stack web development, React frontends, Node.js APIs, and AI integrations. Based in Lucknow, available for freelance and internships.',
  keywords: [
    'hire Devansh Yadav',
    'full stack developer Lucknow',
    'React developer freelance',
    'AI integration developer',
    'Node.js developer',
    'web development services India',
  ],
};

/* ──────────────────────────── CONSTANTS ──────────────────────────── */
const goalCards = [
  {
    id: 'portfolio',
    label: 'Build My Portfolio',
    icon: FaUserTie,
    accent: 'from-cyan-400 via-sky-500 to-blue-500',
    glow: 'from-cyan-500/15 to-sky-500/10',
    tagline: 'Stand out with a stunning personal brand',
    services: ['Custom design system', 'Animated hero section', 'Projects showcase', 'Blog integration', 'SEO optimized'],
    timeline: '1–2 weeks',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    examples: ['Developer portfolio', 'Designer showcase', 'Freelancer site'],
  },
  {
    id: 'business',
    label: 'Business Website',
    icon: FaBriefcase,
    accent: 'from-violet-400 via-fuchsia-500 to-purple-500',
    glow: 'from-violet-500/15 to-fuchsia-500/10',
    tagline: 'Convert visitors into paying customers',
    services: ['Landing page', 'Admin dashboard', 'Contact form + CRM', 'Analytics integration', 'Mobile-first responsive'],
    timeline: '2–4 weeks',
    tech: ['React', 'Node.js', 'MongoDB', 'Express'],
    examples: ['SaaS landing page', 'Agency site', 'Service company'],
  },
  {
    id: 'ai',
    label: 'AI Integration',
    icon: HiOutlineCpuChip,
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
    glow: 'from-emerald-500/15 to-teal-500/10',
    tagline: 'Add intelligence to your product',
    services: ['AI chatbot integration', 'NLP text processing', 'Image recognition API', 'Data analysis dashboards', 'Python ML models'],
    timeline: '3–6 weeks',
    tech: ['Python', 'FastAPI', 'React', 'OpenAI API'],
    examples: ['Smart search', 'Content analyzer', 'Recommendation engine'],
  },
  {
    id: 'college',
    label: 'College Project',
    icon: FaGraduationCap,
    accent: 'from-amber-400 via-orange-500 to-rose-500',
    glow: 'from-amber-500/15 to-orange-500/10',
    tagline: 'Get that A+ with a real-world app',
    services: ['Full documentation', 'Database design + ER diagram', 'CRUD operations', 'Authentication system', 'Deployment ready'],
    timeline: '1–3 weeks',
    tech: ['React', 'Node.js', 'MongoDB', 'Express'],
    examples: ['Library management', 'Hostel system', 'Student portal'],
  },
];

const devProcess = [
  { label: 'Requirement', desc: 'Understand your goals, scope, and user needs.', accent: 'from-cyan-400 to-sky-500', num: '01' },
  { label: 'Planning', desc: 'Architecture, timeline, and tech stack decisions.', accent: 'from-sky-400 to-blue-500', num: '02' },
  { label: 'UI Design', desc: 'Wireframes, color system, and component library.', accent: 'from-blue-400 to-indigo-500', num: '03' },
  { label: 'Development', desc: 'Frontend, backend, APIs, and database built iteratively.', accent: 'from-violet-400 to-fuchsia-500', num: '04' },
  { label: 'Testing', desc: 'Cross-device QA, performance audits, and bug fixes.', accent: 'from-fuchsia-400 to-pink-500', num: '05' },
  { label: 'Deployment', desc: 'Vercel/Render hosting with CI/CD pipeline setup.', accent: 'from-pink-400 to-rose-500', num: '06' },
  { label: 'Support', desc: 'Post-launch help, updates, and improvements.', accent: 'from-rose-400 to-amber-500', num: '07' },
];

const comparisons = [
  { label: 'UI Quality', others: 'Generic UI', me: 'Premium Custom UI' },
  { label: 'Scope', others: 'Basic Website', me: 'Full Dashboard + Admin' },
  { label: 'Support', others: 'Limited / Paid', me: 'Continuous & Responsive' },
  { label: 'Performance', others: 'Unoptimised', me: 'Lighthouse 90+ Score' },
  { label: 'Design', others: 'Template-based', me: 'Modern & Responsive' },
  { label: 'Code Quality', others: 'Spaghetti Code', me: 'Clean, Documented Code' },
];

const statsData = [
  { label: 'Projects Completed', value: 12, suffix: '+', icon: FaRocket, accent: 'from-cyan-400 to-blue-500' },
  { label: 'Technologies Used', value: 20, suffix: '+', icon: FaCode, accent: 'from-violet-400 to-fuchsia-500' },
  { label: 'GitHub Commits', value: 300, suffix: '+', icon: FaLayerGroup, accent: 'from-emerald-400 to-teal-500' },
  { label: 'Learning Hours', value: 500, suffix: '+', icon: FaClock, accent: 'from-amber-400 to-orange-500' },
  { label: 'Coffee Cups', value: 999, suffix: '☕', icon: FaCoffee, accent: 'from-rose-400 to-pink-500' },
];

const featuredServices = [
  {
    title: 'Full Stack Development',
    desc: 'End-to-end web apps with React frontend, Node.js backend, and MongoDB database — production ready.',
    icon: FaLayerGroup,
    accent: 'from-cyan-400 via-sky-500 to-blue-500',
    glow: 'rgba(34,211,238,0.18)',
    tech: ['React', 'Node.js', 'MongoDB', 'Express'],
  },
  {
    title: 'React Frontend',
    desc: 'Pixel-perfect, animated UIs with Tailwind CSS, Framer Motion, and component-driven architecture.',
    icon: SiReact,
    accent: 'from-violet-400 via-fuchsia-500 to-purple-500',
    glow: 'rgba(168,85,247,0.18)',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
  },
  {
    title: 'Backend APIs',
    desc: 'Secure, scalable REST APIs with JWT auth, input validation, error handling, and database integration.',
    icon: FaServer,
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
    glow: 'rgba(16,185,129,0.18)',
    tech: ['Node.js', 'Express', 'MongoDB', 'JWT'],
  },
  {
    title: 'AI Integration',
    desc: 'Add AI features — chatbots, NLP analysis, recommendation engines — to any existing or new product.',
    icon: HiOutlineCpuChip,
    accent: 'from-amber-400 via-orange-500 to-rose-500',
    glow: 'rgba(245,158,11,0.18)',
    tech: ['Python', 'FastAPI', 'OpenAI', 'React'],
  },
];

/* ─────────────────────────── COST CONFIG ────────────────────────── */
const costConfig = {
  type: { portfolio: 0, business: 3000, ecommerce: 7000, custom: 10000 },
  stack: { frontend: 0, fullstack: 4000 },
  adminPanel: 2500,
  auth: 1200,
  aiFeatures: 5000,
  database: 1500,
};

const techStacks = {
  portfolio_frontend: ['React', 'Tailwind CSS', 'Vite'],
  portfolio_fullstack: ['React', 'Node.js', 'MongoDB', 'Vite'],
  business_frontend: ['React', 'Tailwind CSS', 'Framer Motion'],
  business_fullstack: ['React', 'Node.js', 'Express', 'MongoDB'],
  ecommerce_frontend: ['React', 'Redux', 'Tailwind CSS'],
  ecommerce_fullstack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
  custom_fullstack: ['React', 'Node.js', 'MongoDB', 'Python'],
  custom_frontend: ['React', 'TypeScript', 'Tailwind CSS'],
};

function getTimelineWeeks(cost) {
  if (cost < 5000) return '1–2 weeks';
  if (cost < 10000) return '2–4 weeks';
  if (cost < 18000) return '4–6 weeks';
  return '6–10 weeks';
}

function getComplexity(cost) {
  if (cost < 5000) return { label: 'Simple', color: 'text-emerald-300', bar: 25 };
  if (cost < 10000) return { label: 'Medium', color: 'text-cyan-300', bar: 50 };
  if (cost < 18000) return { label: 'Complex', color: 'text-violet-300', bar: 75 };
  return { label: 'Advanced', color: 'text-rose-300', bar: 95 };
}

/* ─────────────────────────── IDEA CONFIG ────────────────────────── */
const ideaDatabase = [
  {
    keywords: ['hostel', 'dormitory', 'room allocation', 'boarding'],
    result: {
      type: 'Management System',
      difficulty: 'Medium',
      duration: '3–5 weeks',
      tech: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT'],
      features: ['Student registration & login', 'Room allocation dashboard', 'Fee payment tracker', 'Admin panel', 'Notification system'],
    },
  },
  {
    keywords: ['portfolio', 'personal site', 'resume', 'personal brand'],
    result: {
      type: 'Personal Portfolio',
      difficulty: 'Easy',
      duration: '1–2 weeks',
      tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
      features: ['Animated hero section', 'Projects showcase', 'Skills display', 'Contact form', 'SEO optimized'],
    },
  },
  {
    keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'buy', 'sell', 'product', 'cart', 'marketplace'],
    result: {
      type: 'E-Commerce Platform',
      difficulty: 'Hard',
      duration: '6–10 weeks',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
      features: ['Product catalog & search', 'Shopping cart & checkout', 'Payment gateway (Stripe)', 'Order management', 'Seller dashboard'],
    },
  },
  {
    keywords: ['blog', 'article', 'cms', 'content', 'post', 'write'],
    result: {
      type: 'Blog / CMS Platform',
      difficulty: 'Easy–Medium',
      duration: '2–3 weeks',
      tech: ['React', 'Node.js', 'MongoDB', 'Rich Text Editor'],
      features: ['Article editor (rich text)', 'Category & tag system', 'Search & filtering', 'Comments section', 'Author dashboard'],
    },
  },
  {
    keywords: ['social', 'network', 'friends', 'post', 'feed', 'follow', 'twitter', 'instagram clone'],
    result: {
      type: 'Social Network',
      difficulty: 'Hard',
      duration: '8–12 weeks',
      tech: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Cloudinary'],
      features: ['User profiles & follow system', 'Real-time feed & posts', 'Chat & notifications (Socket.io)', 'Media uploads', 'Explore & trending'],
    },
  },
  {
    keywords: ['dashboard', 'analytics', 'report', 'chart', 'data', 'visualize', 'metrics'],
    result: {
      type: 'Analytics Dashboard',
      difficulty: 'Medium',
      duration: '3–5 weeks',
      tech: ['React', 'Chart.js', 'Node.js', 'MongoDB', 'D3.js'],
      features: ['Interactive charts & graphs', 'Real-time data updates', 'Filterable reports', 'CSV/PDF export', 'Role-based access'],
    },
  },
  {
    keywords: ['ai', 'ml', 'machine learning', 'chatbot', 'nlp', 'predict', 'classification', 'recommend'],
    result: {
      type: 'AI-Powered Application',
      difficulty: 'Advanced',
      duration: '5–9 weeks',
      tech: ['Python', 'FastAPI', 'React', 'OpenAI API', 'MongoDB'],
      features: ['AI/ML model integration', 'NLP text processing', 'Intelligent recommendations', 'Data pipeline', 'Interactive AI interface'],
    },
  },
  {
    keywords: ['library', 'book', 'issue', 'return', 'catalog', 'lending'],
    result: {
      type: 'Library Management System',
      difficulty: 'Medium',
      duration: '2–4 weeks',
      tech: ['React', 'Node.js', 'MongoDB', 'Express'],
      features: ['Book catalog & search', 'Issue & return tracking', 'Member management', 'Fine calculation', 'Reports & analytics'],
    },
  },
  {
    keywords: ['task', 'todo', 'project management', 'kanban', 'trello', 'jira'],
    result: {
      type: 'Project Management Tool',
      difficulty: 'Medium',
      duration: '3–5 weeks',
      tech: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Drag & Drop'],
      features: ['Kanban board with drag-drop', 'Task assignment & deadlines', 'Real-time collaboration', 'Progress tracking', 'Team notifications'],
    },
  },
];

function analyzeIdea(input) {
  const lower = input.toLowerCase();
  for (const entry of ideaDatabase) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.result;
    }
  }
  return {
    type: 'Custom Web Application',
    difficulty: 'Medium',
    duration: '3–6 weeks',
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
    features: ['User authentication', 'Interactive dashboard', 'REST API backend', 'Database integration', 'Responsive UI design'],
  };
}

/* ─────────────────────────── HOOKS ──────────────────────────────── */
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCounter(target, inView, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(start); }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

/* ─────────────────────── SUB-COMPONENTS ────────────────────────── */
function StatCounter({ item, inView }) {
  const count = useCounter(item.value, inView);
  const Icon = item.icon;
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-center backdrop-blur-xl"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-[0.07]`} />
      <div className="relative">
        <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} shadow-lg`}>
          <Icon className="text-lg text-white" />
        </div>
        <p className={`text-4xl font-extrabold bg-gradient-to-r ${item.accent} bg-clip-text text-transparent`}>
          {count.toLocaleString()}{item.suffix}
        </p>
        <p className="mt-2 text-xs font-medium text-slate-400">{item.label}</p>
      </div>
    </motion.div>
  );
}

function ProcessStep({ step, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="relative flex flex-col items-center text-center"
    >
      {/* Connector line */}
      {index < devProcess.length - 1 && (
        <div className="absolute left-[calc(50%+2rem)] top-5 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-white/20 to-transparent md:block" style={{ left: 'calc(50% + 2.5rem)', width: 'calc(100% - 5rem)' }} />
      )}
      <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} shadow-[0_8px_20px_rgba(0,0,0,0.3)] text-xs font-bold text-white`}>
        {step.num}
      </div>
      <h3 className="mt-3 text-sm font-bold text-white">{step.label}</h3>
      <p className="mt-1.5 max-w-[120px] text-[11px] leading-5 text-slate-400">{step.desc}</p>
    </motion.div>
  );
}

/* ───────────────────────── MAIN COMPONENT ───────────────────────── */
export default function Services() {
  /* Goal cards state */
  const [openGoal, setOpenGoal] = useState(null);

  /* Cost estimator state */
  const [cost, setCost] = useState({
    type: 'portfolio',
    stack: 'frontend',
    adminPanel: false,
    auth: false,
    aiFeatures: false,
    database: false,
  });

  /* Idea analyzer state */
  const [idea, setIdea] = useState('');
  const [ideaResult, setIdeaResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  /* InView refs */
  const [statsRef, statsInView] = useInView(0.2);
  const [processRef, processInView] = useInView(0.1);
  const [compareRef, compareInView] = useInView(0.2);
  const [featuredRef, featuredInView] = useInView(0.1);
  const [ctaRef, ctaInView] = useInView(0.3);

  /* ── Cost calculation ── */
  const totalCost = (() => {
    let base = 2000;
    base += costConfig.type[cost.type] || 0;
    base += costConfig.stack[cost.stack] || 0;
    if (cost.adminPanel) base += costConfig.adminPanel;
    if (cost.auth) base += costConfig.auth;
    if (cost.aiFeatures) base += costConfig.aiFeatures;
    if (cost.database) base += costConfig.database;
    return base;
  })();

  const costRange = `₹${totalCost.toLocaleString('en-IN')} – ₹${(totalCost * 1.35).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const timeline = getTimelineWeeks(totalCost);
  const complexity = getComplexity(totalCost);
  const techKey = `${cost.type}_${cost.stack}`;
  const recommendedStack = techStacks[techKey] || techStacks['custom_fullstack'];

  /* ── Idea analyzer ── */
  const handleAnalyze = useCallback(() => {
    if (!idea.trim()) return;
    setAnalyzing(true);
    setIdeaResult(null);
    setTimeout(() => {
      setIdeaResult(analyzeIdea(idea));
      setAnalyzing(false);
    }, 1200);
  }, [idea]);

  /* ── section fade variant ── */
  const sectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="relative overflow-hidden pb-20 pt-28 lg:pt-32">
      <Seo
        title={servicesSeo.title}
        description={servicesSeo.description}
        keywords={servicesSeo.keywords}
        canonicalPath="/services"
      />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-28 left-[-10rem] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-20 right-[-8rem] h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-40 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(168,85,247,0.14),transparent_28%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-24">

        {/* ═══════════════════ 1. HERO ═══════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="border-b border-white/10 pb-12"
        >
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-300/80">Services</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Services I{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Offer
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            I build modern Full Stack web applications, AI-powered tools, and responsive websites — from concept
            to deployment. Whether it&apos;s a personal portfolio, a business platform, or an AI integration,
            I deliver clean code and premium design.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(99,102,241,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(34,211,238,0.3)]"
            >
              Hire Me <FaArrowRight size={13} />
            </Link>
            <a
              href="https://wa.me/916388525760?text=Hello%20Devansh%2C%20I%20want%20to%20discuss%20a%20project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              Discuss Your Project
            </a>
          </div>
        </motion.section>

        {/* ═══════════════════ 2. CHOOSE YOUR GOAL ═══════════════════ */}
        <motion.section
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-6"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-300/80">What do you need?</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Choose Your Goal</h2>
            <p className="mt-2 text-sm text-slate-400">Click a card to see the full details for that goal.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {goalCards.map((card) => {
              const Icon = card.icon;
              const isOpen = openGoal === card.id;
              return (
                <motion.div
                  key={card.id}
                  layout
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className={`relative overflow-hidden rounded-2xl border bg-slate-950/50 backdrop-blur-xl cursor-pointer transition-colors duration-300 ${
                    isOpen ? 'border-white/20' : 'border-white/10 hover:border-white/15'
                  }`}
                  onClick={() => setOpenGoal(isOpen ? null : card.id)}
                >
                  {/* top accent bar */}
                  <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${card.accent}`} />
                  {/* bg glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.glow} opacity-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'group-hover:opacity-60'}`} />

                  <div className="relative p-5">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} shadow-lg`}>
                          <Icon className="text-lg text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{card.label}</h3>
                          <p className="text-[11px] text-slate-400">{card.tagline}</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0 text-slate-400"
                      >
                        <FaChevronDown size={14} />
                      </motion.div>
                    </div>

                    {/* Expandable content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.38, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 border-t border-white/10 pt-5 space-y-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/70 mb-2">Services Included</p>
                              <ul className="space-y-1.5">
                                {card.services.map((s) => (
                                  <li key={s} className="flex items-center gap-2 text-sm text-slate-300">
                                    <FaCheck size={10} className="text-emerald-400 shrink-0" /> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">Timeline</p>
                                <p className="text-sm font-semibold text-cyan-300">{card.timeline}</p>
                              </div>
                              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">Examples</p>
                                <p className="text-xs text-slate-300">{card.examples[0]}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">Technologies</p>
                              <div className="flex flex-wrap gap-2">
                                {card.tech.map((t) => (
                                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">{t}</span>
                                ))}
                              </div>
                            </div>
                            <Link
                              to="/contact"
                              onClick={(e) => e.stopPropagation()}
                              className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${card.accent} px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5`}
                            >
                              Get Started <FaArrowRight size={12} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ═══════════════════ 3. COST ESTIMATOR ═══════════════════ */}
        <motion.section
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-6"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-violet-300/80">Budgeting tool</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Project Cost Estimator</h2>
            <p className="mt-2 text-sm text-slate-400">Configure your requirements and see a live estimate.</p>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6 backdrop-blur-xl shadow-[0_24px_70px_rgba(2,6,23,0.28)] sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(139,92,246,0.12),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.1),transparent_42%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_0.85fr]">

              {/* Controls */}
              <div className="space-y-6">
                {/* Project Type */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-3">Project Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { id: 'portfolio', label: 'Portfolio' },
                      { id: 'business', label: 'Business' },
                      { id: 'ecommerce', label: 'E-Commerce' },
                      { id: 'custom', label: 'Custom App' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setCost((prev) => ({ ...prev, type: t.id }))}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                          cost.type === t.id
                            ? 'border-violet-400/50 bg-violet-500/20 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stack */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-3">Development Stack</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ id: 'frontend', label: 'Frontend Only' }, { id: 'fullstack', label: 'Full Stack' }].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setCost((prev) => ({ ...prev, stack: s.id }))}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                          cost.stack === s.id
                            ? 'border-cyan-400/50 bg-cyan-500/20 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feature toggles */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-3">Add-on Features</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'adminPanel', label: 'Admin Panel', icon: FaLayerGroup, color: 'violet' },
                      { key: 'auth', label: 'Authentication', icon: FaShieldAlt, color: 'cyan' },
                      { key: 'aiFeatures', label: 'AI Features', icon: HiOutlineCpuChip, color: 'emerald' },
                      { key: 'database', label: 'Database', icon: FaDatabase, color: 'amber' },
                    ].map(({ key, label, icon: Icon, color }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCost((prev) => ({ ...prev, [key]: !prev[key] }))}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                          cost[key]
                            ? `border-${color}-400/40 bg-${color}-500/15 text-white`
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <Icon size={12} className={cost[key] ? `text-${color}-300` : 'text-slate-500'} />
                        {label}
                        <span className={`ml-auto text-[9px] rounded px-1 py-0.5 ${cost[key] ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-600'}`}>
                          {cost[key] ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-5 shadow-[0_0_40px_rgba(139,92,246,0.12)]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-violet-300/80">Estimated Cost Range</p>
                  <p className="mt-2 text-3xl font-extrabold text-white">{costRange}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">INR · negotiable for college projects</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">Timeline</p>
                    <p className="text-sm font-bold text-cyan-300">{timeline}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">Complexity</p>
                    <p className={`text-sm font-bold ${complexity.color}`}>{complexity.label}</p>
                  </div>
                </div>

                {/* Complexity bar */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Complexity Meter</p>
                    <p className={`text-[11px] font-semibold ${complexity.color}`}>{complexity.bar}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${complexity.bar}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-2">Recommended Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {recommendedStack.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-1 text-[11px] text-slate-200">{t}</span>
                    ))}
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(99,102,241,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Request a Quote <FaArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════ 4. IDEA ANALYZER ═══════════════════ */}
        <motion.section
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-6"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-emerald-300/80">AI-powered planner</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Describe Your Idea</h2>
            <p className="mt-2 text-sm text-slate-400">Tell me what you want to build, and I&apos;ll break it down for you.</p>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6 backdrop-blur-xl shadow-[0_24px_70px_rgba(2,6,23,0.28)] sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.1),transparent_40%)]" />
            <div className="relative space-y-4">
              <div className="relative">
                <textarea
                  value={idea}
                  onChange={(e) => { setIdea(e.target.value); if (ideaResult) setIdeaResult(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAnalyze(); }}
                  rows={4}
                  placeholder={`e.g. "I need a hostel management system with room allocation, fee tracking, and an admin panel."`}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 transition-colors duration-200 focus:border-emerald-400/40 focus:bg-emerald-500/5 focus:outline-none"
                />
                <p className="absolute bottom-3 right-3 text-[10px] text-slate-600">Ctrl+Enter to analyze</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!idea.trim() || analyzing}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(16,185,129,0.25)] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {analyzing ? (
                    <>
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-block">⚙</motion.span>
                      Analyzing…
                    </>
                  ) : (
                    <><FaLightbulb size={13} /> Analyze</>
                  )}
                </button>
                {idea && (
                  <button
                    type="button"
                    onClick={() => { setIdea(''); setIdeaResult(null); }}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-slate-400 transition-colors hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              <AnimatePresence>
                {ideaResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="border-t border-white/10 pt-6 space-y-5"
                  >
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {[
                        { label: 'Project Type', value: ideaResult.type, color: 'text-cyan-300' },
                        { label: 'Difficulty', value: ideaResult.difficulty, color: 'text-violet-300' },
                        { label: 'Duration', value: ideaResult.duration, color: 'text-emerald-300' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">{item.label}</p>
                          <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-2.5">Suggested Technologies</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ideaResult.tech.map((t) => (
                            <span key={t} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-200">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-2.5">Expected Features</p>
                        <ul className="space-y-1">
                          {ideaResult.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                              <FaCheck size={9} className="text-emerald-400 shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(16,185,129,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      Let&apos;s Build It <FaArrowRight size={13} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════ 5. DEVELOPMENT PROCESS ═══════════════════ */}
        <motion.section
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-8"
          ref={processRef}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-300/80">How I work</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Development Process</h2>
            <p className="mt-2 text-sm text-slate-400">A structured workflow ensuring quality at every stage.</p>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6 backdrop-blur-xl sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.1),transparent_50%)]" />
            <div className="relative grid grid-cols-2 gap-8 sm:grid-cols-4 md:grid-cols-7">
              {devProcess.map((step, i) => (
                <ProcessStep key={step.label} step={step} index={i} inView={processInView} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════ 6. WHY CHOOSE ME ═══════════════════ */}
        <motion.section
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-6"
          ref={compareRef}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-violet-300/80">Why Devansh?</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Why Choose Me</h2>
            <p className="mt-2 text-sm text-slate-400">How I compare to generic freelancers.</p>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/45 backdrop-blur-xl shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.08),transparent_55%)]" />

            {/* Table header */}
            <div className="relative grid grid-cols-3 border-b border-white/10 px-6 py-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Category</p>
              <p className="text-center text-[11px] uppercase tracking-[0.2em] text-slate-500">Others</p>
              <p className="text-center text-[11px] uppercase tracking-[0.2em] text-emerald-300">Me</p>
            </div>

            {comparisons.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -12 }}
                animate={compareInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`relative grid grid-cols-3 items-center px-6 py-4 ${i < comparisons.length - 1 ? 'border-b border-white/[0.06]' : ''} transition-colors duration-200 hover:bg-white/[0.02]`}
              >
                <p className="text-sm font-medium text-white">{row.label}</p>
                <div className="flex items-center justify-center gap-2">
                  <FaTimes size={11} className="text-rose-400 shrink-0" />
                  <span className="text-xs text-slate-400">{row.others}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FaCheck size={11} className="text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-200">{row.me}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════ 7. ANIMATED STATS ═══════════════════ */}
        <motion.section
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-6"
          ref={statsRef}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-300/80">By the numbers</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">The Stats</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {statsData.map((item) => (
              <StatCounter key={item.label} item={item} inView={statsInView} />
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════ 8. FEATURED SERVICES ═══════════════════ */}
        <motion.section
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-6"
          ref={featuredRef}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-fuchsia-300/80">What I build</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Featured Services</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.article
                  key={svc.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-5 backdrop-blur-xl cursor-default shadow-[0_18px_40px_rgba(2,6,23,0.3)] transition-shadow duration-300"
                  style={{ '--glow': svc.glow }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"
                    style={{ background: `radial-gradient(circle at 40% 40%, ${svc.glow}, transparent 65%)` }}
                  />
                  {/* Top gradient bar */}
                  <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${svc.accent}`} />

                  <div className="relative space-y-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${svc.accent} shadow-lg`}>
                      <Icon className="text-xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{svc.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{svc.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {svc.tech.map((t) => (
                        <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">{t}</span>
                      ))}
                    </div>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 transition-colors duration-200 group-hover:text-white"
                    >
                      Get a Quote <FaArrowRight size={10} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* ═══════════════════ 9. FINAL CTA ═══════════════════ */}
        <motion.section
          ref={ctaRef}
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-8 text-center backdrop-blur-xl shadow-[0_30px_80px_rgba(2,6,23,0.35)] sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.22),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(34,211,238,0.14),transparent_55%)]" />

            <div className="relative">
              <p className="inline-flex rounded-full border border-violet-400/25 bg-violet-500/15 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-violet-200">
                READY TO BUILD?
              </p>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Let&apos;s Build Something{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Amazing
                </span>{' '}
                Together
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
                Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss your idea and
                turn it into a real product that people will love.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(99,102,241,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(34,211,238,0.35)]"
                >
                  Contact Me <FaArrowRight size={14} />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-slate-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-500/10"
                >
                  View Projects
                </Link>
              </div>

              {/* Decorative bottom icons */}
              <div className="mt-10 flex items-center justify-center gap-5 opacity-30">
                <SiReact size={22} className="text-cyan-400" />
                <SiNodedotjs size={22} className="text-emerald-400" />
                <SiMongodb size={22} className="text-green-400" />
                <SiPython size={22} className="text-yellow-400" />
                <SiTailwindcss size={22} className="text-sky-400" />
                <SiFastapi size={22} className="text-teal-400" />
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
