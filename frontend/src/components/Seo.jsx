/**
 * Seo.jsx — Per-page SEO metadata manager
 *
 * Injects and cleans up all head meta tags on route change.
 * Always writes English-only metadata; also enforces:
 *   • <html lang="en" dir="ltr">
 *   • og:locale = en_US
 *   • Content-Language = en  (via <meta http-equiv>)
 *
 * Usage:
 *   <Seo title="Page Title" description="..." canonicalPath="/path" />
 */

import { useEffect } from 'react';
import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_THEME_COLOR,
  SITE_TITLE_SUFFIX,
  SITE_URL,
} from '../data/siteMetadata';

const MANAGED = '[data-seo-managed="true"]';
const BASE_URL = SITE_URL.replace(/\/$/, '');

const absUrl = (path = '/') =>
  `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/* ── Low-level DOM helpers ──────────────────────────────────────── */
const upsertMeta = (selector, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) { el = document.createElement('meta'); document.head.appendChild(el); }
  Object.entries(attrs).forEach(([k, v]) => {
    if (v != null && v !== '') el.setAttribute(k, v);
  });
  el.setAttribute('data-seo-managed', 'true');
};

const upsertLink = (selector, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) { el = document.createElement('link'); document.head.appendChild(el); }
  Object.entries(attrs).forEach(([k, v]) => {
    if (v != null && v !== '') el.setAttribute(k, v);
  });
  el.setAttribute('data-seo-managed', 'true');
};

const clearManaged = () =>
  document.head.querySelectorAll(MANAGED).forEach(n => n.remove());

/* ── Component ──────────────────────────────────────────────────── */
export default function Seo({
  title,
  description  = SITE_DESCRIPTION,
  keywords     = SITE_KEYWORDS,
  canonicalPath = '/',
  image        = `${BASE_URL}/og-image.png`,
  imageAlt,
  type         = 'website',
  noindex      = false,
  structuredData = null,
}) {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    /* Force the HTML element to declare English on every navigation */
    document.documentElement.lang = 'en';
    document.documentElement.dir  = 'ltr';

    clearManaged();

    const fullTitle    = title
      ? (title.includes(SITE_TITLE_SUFFIX) ? title : `${title} | ${SITE_TITLE_SUFFIX}`)
      : SITE_NAME;
    const canonicalUrl = absUrl(canonicalPath);
    const kwStr        = Array.isArray(keywords)
      ? keywords.filter(Boolean).join(', ')
      : String(keywords || '');
    const robots       = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    const resolvedImg  = image || `${BASE_URL}/og-image.png`;
    const resolvedAlt  = imageAlt || title || SITE_NAME;

    /* ── Page title ─────────────────────────────────────────────── */
    document.title = fullTitle;

    /* ── Language signals (the critical fix) ─────────────────────── */
    upsertMeta('meta[http-equiv="Content-Language"]', {
      'http-equiv': 'Content-Language',
      content: 'en',
    });
    upsertMeta('meta[name="language"]', {
      name: 'language',
      content: 'English',
    });

    /* ── Primary tags ────────────────────────────────────────────── */
    upsertMeta('meta[name="description"]',  { name: 'description',  content: description });
    upsertMeta('meta[name="keywords"]',     { name: 'keywords',     content: kwStr });
    upsertMeta('meta[name="author"]',       { name: 'author',       content: SITE_AUTHOR });
    upsertMeta('meta[name="robots"]',       { name: 'robots',       content: robots });
    upsertMeta('meta[name="theme-color"]',  { name: 'theme-color',  content: SITE_THEME_COLOR });

    /* ── Open Graph ──────────────────────────────────────────────── */
    upsertMeta('meta[property="og:locale"]',      { property: 'og:locale',      content: 'en_US' });
    upsertMeta('meta[property="og:type"]',        { property: 'og:type',        content: type });
    upsertMeta('meta[property="og:title"]',       { property: 'og:title',       content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]',         { property: 'og:url',         content: canonicalUrl });
    upsertMeta('meta[property="og:site_name"]',   { property: 'og:site_name',   content: SITE_NAME });
    upsertMeta('meta[property="og:image"]',       { property: 'og:image',       content: resolvedImg });
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
    upsertMeta('meta[property="og:image:height"]',{ property: 'og:image:height',content: '630' });
    upsertMeta('meta[property="og:image:alt"]',   { property: 'og:image:alt',   content: resolvedAlt });

    /* ── Twitter Card ────────────────────────────────────────────── */
    upsertMeta('meta[name="twitter:card"]',        { name: 'twitter:card',        content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:site"]',        { name: 'twitter:site',        content: '@yxdevansh' });
    upsertMeta('meta[name="twitter:creator"]',     { name: 'twitter:creator',     content: '@yxdevansh' });
    upsertMeta('meta[name="twitter:title"]',       { name: 'twitter:title',       content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]',       { name: 'twitter:image',       content: resolvedImg });
    upsertMeta('meta[name="twitter:image:alt"]',   { name: 'twitter:image:alt',   content: resolvedAlt });

    /* ── Canonical ───────────────────────────────────────────────── */
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });

    /* ── Structured data (JSON-LD) ───────────────────────────────── */
    if (structuredData) {
      const items = Array.isArray(structuredData) ? structuredData : [structuredData];
      items.forEach((data, i) => {
        const script = document.createElement('script');
        script.type  = 'application/ld+json';
        script.setAttribute('data-seo-managed', 'true');
        script.setAttribute('data-seo-index', String(i));
        script.textContent = JSON.stringify(data, null, 0);
        document.head.appendChild(script);
      });
    }

    return () => { clearManaged(); };
  }, [canonicalPath, description, image, imageAlt, keywords, noindex, structuredData, title, type]);

  return null;
}