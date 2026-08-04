import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_LOCATION, SITE_ORGANIZATION_DESCRIPTION, SITE_ORGANIZATION_NAME, SITE_SOCIAL_LINKS, SITE_URL } from './siteMetadata';

const BASE_URL = SITE_URL.replace(/\/$/, '');

const absoluteUrl = (path = '/') => `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const buildBreadcrumbSchema = (items, currentPath) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items
    .filter((item) => item && item.name && item.path)
    .map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': absoluteUrl(currentPath),
  },
});

export const buildFaqSchema = (questions, currentPath) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions
    .filter((question) => question && question.question && question.answer)
    .map((question) => ({
      '@type': 'Question',
      name: question.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.answer,
      },
    })),
  url: absoluteUrl(currentPath),
});

export const buildWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: SITE_ORGANIZATION_NAME,
  url: BASE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: 'en-US',
  author: {
    '@type': 'Person',
    name: SITE_AUTHOR,
    url: BASE_URL,
  },
});

export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: SITE_ORGANIZATION_NAME,
  alternateName: SITE_AUTHOR,
  url: BASE_URL,
  description: SITE_ORGANIZATION_DESCRIPTION,
  logo: `${BASE_URL}/og-image.png`,
  image: `${BASE_URL}/og-image.png`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lucknow',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
  },
  sameAs: SITE_SOCIAL_LINKS,
});

export const buildPersonSchema = ({ image, description, jobTitle, alternateName } = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${BASE_URL}/#person`,
  name: SITE_AUTHOR,
  alternateName: alternateName || 'Deva Yadav',
  url: BASE_URL,
  image: image || `${BASE_URL}/og-image.png`,
  jobTitle: jobTitle || 'Python Developer, MERN Stack Developer, and AI & Data Science Learner',
  description: description || SITE_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lucknow',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Babu Banarasi Das University',
    alternateName: 'BBDU',
    url: 'https://bbdu.ac.in',
  },
  knowsAbout: [
    'Python',
    'React',
    'Node.js',
    'MongoDB',
    'Express',
    'Machine Learning',
    'Data Science',
    'Tailwind CSS',
    'REST APIs',
    'Git',
  ],
  sameAs: SITE_SOCIAL_LINKS,
});

export const buildProjectSchema = ({ project, currentPath, position }) => ({
  '@context': 'https://schema.org',
  '@type': 'Project',
  '@id': `${absoluteUrl(currentPath)}#project-${position}`,
  name: project.title,
  description: project.description,
  url: project.deployedLink || project.liveDemoLink || project.githubLink || absoluteUrl(currentPath),
  image: project.image ? [project.image] : undefined,
  keywords: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
  creator: {
    '@type': 'Person',
    name: SITE_AUTHOR,
    url: BASE_URL,
  },
  locationCreated: SITE_LOCATION,
  sameAs: [project.githubLink, project.deployedLink, project.liveDemoLink].filter(Boolean),
});

export const buildCollectionSchema = ({ name, description, currentPath, itemType = 'ListItem', items = [] }) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url: absoluteUrl(currentPath),
  isPartOf: {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: items
      .filter(Boolean)
      .map((item, index) => ({
        '@type': itemType,
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
  },
});

export const buildBlogPostingSchema = ({ post, currentPath }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  image: post.image ? [post.image] : undefined,
  datePublished: post.publishedAt,
  dateModified: post.publishedAt,
  author: {
    '@type': 'Person',
    name: SITE_AUTHOR,
    url: BASE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_ORGANIZATION_NAME,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og-image.png`,
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': absoluteUrl(currentPath),
  },
  articleSection: post.category,
  keywords: Array.isArray(post.tags) ? post.tags.join(', ') : '',
});
