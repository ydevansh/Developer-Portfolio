import { HiOutlineCodeBracket, HiOutlineCpuChip, HiOutlineSquares2X2 } from 'react-icons/hi2';
import {
  SiC,
  SiGit,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTensorflow,
} from 'react-icons/si';

export const skillCategoryOrder = ['Frontend', 'Backend', 'AI/Core'];

export const skillCategoryMeta = {
  Frontend: {
    titleClass: 'from-fuchsia-300 to-violet-300',
    badgeClass:
      'bg-violet-500/20 text-violet-100 border border-violet-400/35 hover:bg-violet-500/30 hover:border-violet-300/45',
    glowClass: 'from-fuchsia-500/20 via-transparent to-violet-500/20',
    icon: HiOutlineSquares2X2,
  },
  Backend: {
    titleClass: 'from-blue-300 to-cyan-300',
    badgeClass:
      'bg-blue-500/20 text-blue-100 border border-blue-400/35 hover:bg-blue-500/30 hover:border-blue-300/45',
    glowClass: 'from-blue-500/20 via-transparent to-cyan-500/20',
    icon: HiOutlineCodeBracket,
  },
  'AI/Core': {
    titleClass: 'from-cyan-300 to-sky-300',
    badgeClass:
      'bg-cyan-500/20 text-cyan-100 border border-cyan-400/35 hover:bg-cyan-500/30 hover:border-cyan-300/45',
    glowClass: 'from-cyan-500/20 via-transparent to-sky-500/20',
    icon: HiOutlineCpuChip,
  },
};

export const defaultSkillSeeds = [
  { name: 'React', category: 'Frontend', proficiency: 'Advanced', icon: 'SiReact', order: 1 },
  { name: 'JavaScript', category: 'Frontend', proficiency: 'Advanced', icon: 'SiJavascript', order: 2 },
  { name: 'Tailwind CSS', category: 'Frontend', proficiency: 'Advanced', icon: 'SiTailwindcss', order: 3 },
  { name: 'Git', category: 'Frontend', proficiency: 'Intermediate', icon: 'SiGit', order: 4 },
  { name: 'Node.js', category: 'Backend', proficiency: 'Advanced', icon: 'SiNodedotjs', order: 1 },
  { name: 'MongoDB', category: 'Backend', proficiency: 'Intermediate', icon: 'SiMongodb', order: 2 },
  { name: 'SQL', category: 'Backend', proficiency: 'Intermediate', icon: 'SiMysql', order: 3 },
  { name: 'Python', category: 'AI/Core', proficiency: 'Expert', icon: 'SiPython', order: 1 },
  { name: 'Machine Learning', category: 'AI/Core', proficiency: 'Advanced', icon: 'SiTensorflow', order: 2 },
  { name: 'Data Analysis', category: 'AI/Core', proficiency: 'Advanced', icon: 'HiOutlineCpuChip', order: 3 },
  { name: 'Pandas', category: 'AI/Core', proficiency: 'Advanced', icon: 'SiPandas', order: 4 },
  { name: 'NumPy', category: 'AI/Core', proficiency: 'Advanced', icon: 'SiNumpy', order: 5 },
  { name: 'C', category: 'AI/Core', proficiency: 'Intermediate', icon: 'SiC', order: 6 },
];

const normalizeSkillKey = (value) => normalizeText(value).toLowerCase().replace(/[^a-z0-9]/g, '');

export const skillDetailCatalog = {
  react: {
    description: 'A component-based library I use to build interactive and reusable user interfaces.',
    usage: 'Frontend pages, portfolio sections, dashboards, and reusable UI components.',
    portfolioUse: 'Homepage sections, the skills modal, admin dashboards, and reusable UI components.',
    useCases: ['Building responsive interfaces', 'Managing component state', 'Creating dynamic views'],
    relatedTools: ['React Router', 'Vite', 'Tailwind CSS'],
  },
  javascript: {
    description: 'The core scripting language I use for interactive logic and application behavior.',
    usage: 'Frontend interactions, async data handling, and general-purpose application logic.',
    portfolioUse: 'Form handling, API calls, modal interactions, and UI behavior across the portfolio.',
    useCases: ['DOM behavior', 'API requests', 'Event handling'],
    relatedTools: ['ES6+', 'Fetch API', 'Node.js'],
  },
  tailwindcss: {
    description: 'A utility-first CSS framework I use to create clean, responsive, and consistent interfaces quickly.',
    usage: 'Styling cards, layouts, spacing, and responsive UI patterns across the portfolio.',
    portfolioUse: 'Card spacing, gradients, responsive grids, and the dark gradient theme used throughout the site.',
    useCases: ['Responsive design', 'Design consistency', 'Fast UI composition'],
    relatedTools: ['CSS variables', 'PostCSS', 'Responsive breakpoints'],
  },
  git: {
    description: 'A version control system I use to track changes, manage branches, and collaborate safely.',
    usage: 'Version control for frontend and backend work, feature branches, and deployments.',
    portfolioUse: 'Source control for the portfolio codebase, feature updates, and deployment changes.',
    useCases: ['Branch management', 'Code history tracking', 'Collaborative development'],
    relatedTools: ['GitHub', 'GitHub Desktop', 'VS Code source control'],
  },
  nodejs: {
    description: 'A JavaScript runtime I use for backend APIs, automation, and server-side logic.',
    usage: 'Backend services, admin APIs, and server-side request handling.',
    portfolioUse: 'Admin authentication, APIs for projects/blogs/skills, and server-side business logic.',
    useCases: ['REST APIs', 'Authentication flows', 'Server utilities'],
    relatedTools: ['Express', 'npm', 'MongoDB'],
  },
  mongodb: {
    description: 'A document database I use to store flexible app data with a simple schema model.',
    usage: 'Admin content, skills, blog posts, projects, and contact messages.',
    portfolioUse: 'Storing skills, blogs, projects, testimonials, and contact messages for admin management.',
    useCases: ['Storing content records', 'CRUD operations', 'Flexible data modeling'],
    relatedTools: ['Mongoose', 'MongoDB Atlas', 'Node.js'],
  },
  sql: {
    description: 'A structured query language I use for relational data handling and database queries.',
    usage: 'Querying structured data and working with database concepts in backend projects.',
    portfolioUse: 'Backend learning and future relational-data workflows in portfolio projects.',
    useCases: ['Filtering records', 'Joining data', 'Relational query logic'],
    relatedTools: ['MySQL', 'PostgreSQL', 'Database design'],
  },
  python: {
    description: 'A versatile language I use for AI, scripting, data work, and backend problem solving.',
    usage: 'AI/ML work, automation scripts, and learning-based project prototypes.',
    portfolioUse: 'AI/ML learning, experiments, and backend utility scripts used in the portfolio journey.',
    useCases: ['AI experiments', 'Data workflows', 'Automation scripts'],
    relatedTools: ['Pandas', 'NumPy', 'TensorFlow'],
  },
  machinelearning: {
    description: 'A field I use to build predictive systems that learn patterns from data.',
    usage: 'AI projects, model experimentation, and practical learning workflows.',
    portfolioUse: 'AI study projects, model practice, and future intelligent application features.',
    useCases: ['Prediction tasks', 'Model training', 'Feature-based learning'],
    relatedTools: ['Scikit-learn', 'TensorFlow', 'Python'],
  },
  dataanalysis: {
    description: 'I use data analysis to clean, inspect, and interpret datasets before modeling or decision-making.',
    usage: 'AI preparation, data exploration, and problem-solving with real datasets.',
    portfolioUse: 'Dataset exploration and preparation for AI/ML learning and project work.',
    useCases: ['Dataset cleaning', 'Exploratory analysis', 'Insight discovery'],
    relatedTools: ['Pandas', 'NumPy', 'Jupyter Notebook'],
  },
  pandas: {
    description: 'A Python library I use to work with tabular data efficiently and clearly.',
    usage: 'Dataframes, CSV processing, and data preparation tasks.',
    portfolioUse: 'Data cleaning and tabular data handling for AI and learning exercises.',
    useCases: ['Filtering rows', 'Transforming data', 'Reading CSV files'],
    relatedTools: ['Python', 'NumPy', 'Jupyter Notebook'],
  },
  numpy: {
    description: 'A numerical computing library I use for arrays, math operations, and fast data handling.',
    usage: 'Data math, array processing, and machine learning preparation.',
    portfolioUse: 'Numerical operations and data preparation in AI/ML study work.',
    useCases: ['Array operations', 'Linear algebra', 'Numerical computation'],
    relatedTools: ['Python', 'Pandas', 'TensorFlow'],
  },
  c: {
    description: 'A low-level language I use for strong programming fundamentals and efficient logic building.',
    usage: 'Core programming practice, algorithm thinking, and system-level understanding.',
    portfolioUse: 'Programming fundamentals and logic-building practice that supports my development skills.',
    useCases: ['Logic building', 'Fundamentals practice', 'Algorithm design'],
    relatedTools: ['GCC/Clang', 'VS Code', 'Programming fundamentals'],
  },
};

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const normalizeIconKey = (value) => normalizeText(value).toLowerCase().replace(/[^a-z0-9]/g, '');

const categoryAliases = {
  frontend: 'Frontend',
  'web development': 'Frontend',
  backend: 'Backend',
  'back-end': 'Backend',
  databases: 'Backend',
  database: 'Backend',
  tools: 'Backend',
  languages: 'Backend',
  'ai/core': 'AI/Core',
  'ai & data science': 'AI/Core',
  'ai and data science': 'AI/Core',
  'ai & machine learning': 'AI/Core',
  'ai/ml': 'AI/Core',
  'machine learning': 'AI/Core',
  ai: 'AI/Core',
};

const keywordCategories = [
  { category: 'Frontend', keywords: ['react', 'javascript', 'typescript', 'tailwind', 'html', 'css'] },
  { category: 'Backend', keywords: ['node', 'mongodb', 'sql', 'express', 'api', 'server', 'database', 'git'] },
  {
    category: 'AI/Core',
    keywords: ['python', 'machine learning', 'data analysis', 'pandas', 'numpy', 'tensorflow', 'ai', 'ml', 'c'],
  },
];

const skillIconMap = {
  react: SiReact,
  sireact: SiReact,
  javascript: SiJavascript,
  sijavascript: SiJavascript,
  tailwindcss: SiTailwindcss,
  sitailwindcss: SiTailwindcss,
  nodejs: SiNodedotjs,
  'sinodedotjs': SiNodedotjs,
  node: SiNodedotjs,
  git: SiGit,
  sigit: SiGit,
  mongodb: SiMongodb,
  simongodb: SiMongodb,
  sql: SiMysql,
  simysql: SiMysql,
  python: SiPython,
  sipython: SiPython,
  machinelearning: SiTensorflow,
  sitensorflow: SiTensorflow,
  dataanalysis: HiOutlineCpuChip,
  hioutlinecpuchip: HiOutlineCpuChip,
  pandas: SiPandas,
  sipandas: SiPandas,
  numpy: SiNumpy,
  sinumpy: SiNumpy,
  c: SiC,
  sic: SiC,
  hioutlinecodebracket: HiOutlineCodeBracket,
  hioutlinesquares2x2: HiOutlineSquares2X2,
};

export const normalizeSkillCategory = (category, name = '') => {
  const normalizedCategory = normalizeText(category).toLowerCase();

  if (skillCategoryOrder.includes(category)) {
    return category;
  }

  if (categoryAliases[normalizedCategory]) {
    return categoryAliases[normalizedCategory];
  }

  const normalizedName = normalizeText(name).toLowerCase();
  const matchedCategory = keywordCategories.find(({ keywords }) =>
    keywords.some((keyword) => {
      if (keyword === 'c') {
        return normalizedName === 'c';
      }

      return normalizedName.includes(keyword);
    })
  );

  return matchedCategory?.category || 'Backend';
};

export const resolveSkillIcon = (skill) => {
  const skillIconKey = normalizeIconKey(skill?.icon);
  if (skillIconKey && skillIconMap[skillIconKey]) {
    return skillIconMap[skillIconKey];
  }

  const nameIconKey = normalizeIconKey(skill?.name);
  return skillIconMap[nameIconKey] || null;
};

export const getSkillDetails = (skill) => {
  const category = normalizeSkillCategory(skill?.category, skill?.name);
  const level = normalizeText(skill?.proficiency) || 'Intermediate';
  const normalizedName = normalizeSkillKey(skill?.name);
  const catalogEntry = skillDetailCatalog[normalizedName];

  if (catalogEntry) {
    return {
      name: skill?.name || 'Skill',
      category,
      level,
      description: catalogEntry.description,
      usage: catalogEntry.usage,
      portfolioUse: catalogEntry.portfolioUse || catalogEntry.usage,
      useCases: catalogEntry.useCases,
      relatedTools: catalogEntry.relatedTools,
    };
  }

  return {
    name: skill?.name || 'Skill',
    category,
    level,
    description: `I use ${skill?.name || 'this skill'} to support practical ${category.toLowerCase()} work and project building.`,
    usage:
      category === 'Frontend'
        ? 'Frontend interfaces, styling, and user interaction.'
        : category === 'Backend'
          ? 'Server logic, APIs, and data handling.'
          : 'AI, data work, and core problem solving.',
    portfolioUse:
      category === 'Frontend'
        ? 'Used across the portfolio UI, cards, layouts, and interactive components.'
        : category === 'Backend'
          ? 'Used in admin authentication, APIs, and database-driven features.'
          : 'Used in AI learning, data preparation, and future project experiments.',
    useCases: ['Project development', 'Practice and learning', 'Real-world implementation'],
    relatedTools: [skill?.name || 'Skill', 'VS Code', 'GitHub'],
  };
};

export const groupSkillsByCategory = (skills = []) => {
  const groupedSkills = skillCategoryOrder.reduce((accumulator, category) => {
    accumulator[category] = [];
    return accumulator;
  }, {});

  skills.forEach((skill) => {
    const category = normalizeSkillCategory(skill.category, skill.name);
    if (!groupedSkills[category]) {
      groupedSkills[category] = [];
    }

    groupedSkills[category].push(skill);
  });

  Object.values(groupedSkills).forEach((items) => {
    items.sort((left, right) => {
      const leftOrder = Number.isFinite(Number(left.order)) ? Number(left.order) : Number.MAX_SAFE_INTEGER;
      const rightOrder = Number.isFinite(Number(right.order)) ? Number(right.order) : Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return normalizeText(left.name).localeCompare(normalizeText(right.name));
    });
  });

  return groupedSkills;
};
