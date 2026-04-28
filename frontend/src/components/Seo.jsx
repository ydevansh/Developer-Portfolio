import React, { useEffect } from 'react';
import profileImage from '../assets/profile.jpg';
import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_THEME_COLOR,
  SITE_TITLE_SUFFIX,
  SITE_URL,
} from '../data/siteMetadata';

const managedSelector = '[data-seo-managed="true"]';

const normalizePath = (path = '/') => (path.startsWith('/') ? path : `/${path}`);

const buildAbsoluteUrl = (path = '/') => new URL(normalizePath(path), SITE_URL).toString();

const setMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      element.setAttribute(key, value);
    }
  });

  element.setAttribute('data-seo-managed', 'true');
  return element;
};

const setLinkTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      element.setAttribute(key, value);
    }
  });

  element.setAttribute('data-seo-managed', 'true');
  return element;
};

const clearManagedTags = () => {
  document.head.querySelectorAll(managedSelector).forEach((node) => node.remove());
};

export default function Seo({
  title,
  description = SITE_DESCRIPTION,
  keywords = SITE_KEYWORDS,
  canonicalPath = '/',
  image = profileImage,
  imageAlt,
  type = 'website',
  noindex = false,
  structuredData = null,
}) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    clearManagedTags();

    const fullTitle = title
      ? title.includes(SITE_TITLE_SUFFIX)
        ? title
        : `${title} | ${SITE_TITLE_SUFFIX}`
      : SITE_NAME;
    const canonicalUrl = buildAbsoluteUrl(canonicalPath);
    const keywordContent = Array.isArray(keywords) ? keywords.filter(Boolean).join(', ') : String(keywords || '');
    const robotsContent = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    const resolvedImage = image || profileImage;
    const resolvedImageAlt = imageAlt || title || SITE_NAME;

    document.title = fullTitle;

    setMetaTag('meta[name="description"]', {
      name: 'description',
      content: description,
    });
    setMetaTag('meta[name="keywords"]', {
      name: 'keywords',
      content: keywordContent,
    });
    setMetaTag('meta[name="author"]', {
      name: 'author',
      content: SITE_AUTHOR,
    });
    setMetaTag('meta[name="robots"]', {
      name: 'robots',
      content: robotsContent,
    });
    setMetaTag('meta[name="theme-color"]', {
      name: 'theme-color',
      content: SITE_THEME_COLOR,
    });
    setMetaTag('meta[property="og:type"]', {
      property: 'og:type',
      content: type,
    });
    setMetaTag('meta[property="og:title"]', {
      property: 'og:title',
      content: fullTitle,
    });
    setMetaTag('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    setMetaTag('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    });
    setMetaTag('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: SITE_NAME,
    });
    setMetaTag('meta[property="og:image"]', {
      property: 'og:image',
      content: resolvedImage,
    });
    setMetaTag('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: resolvedImageAlt,
    });
    setMetaTag('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    setMetaTag('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: fullTitle,
    });
    setMetaTag('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });
    setMetaTag('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: resolvedImage,
    });
    setMetaTag('meta[name="twitter:image:alt"]', {
      name: 'twitter:image:alt',
      content: resolvedImageAlt,
    });
    setLinkTag('link[rel="canonical"]', {
      rel: 'canonical',
      href: canonicalUrl,
    });

    if (structuredData) {
      const items = Array.isArray(structuredData) ? structuredData : [structuredData];

      items.forEach((data, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-managed', 'true');
        script.setAttribute('data-seo-structured-data', String(index));
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }

    return () => {
      clearManagedTags();
    };
  }, [canonicalPath, description, image, imageAlt, keywords, noindex, structuredData, title, type]);

  return null;
}