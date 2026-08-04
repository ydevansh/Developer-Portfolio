import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaLinkedin,
  FaTwitter,
  FaLink,
  FaCheck,
} from 'react-icons/fa';
import blogService from '../services/blogService';
import {
  fallbackBlogArticles,
  blogCategoryKeywords,
} from '../data/blogArticles';
import ScrollProgressBar from '../components/blog/ScrollProgressBar';
import BackToTopButton from '../components/blog/BackToTopButton';
import { formatDate, getOptimizedImageUrl, getOptimizedSrcSet, slugify } from '../utils/helpers';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildBlogPostingSchema } from '../data/seoSchemas';

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const estimateReadTime = (value) => {
  const words = normalizeText(value).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(words / 180));
  return `${minutes} min read`;
};

const defaultImageByCategory = {
  'AI & Machine Learning':
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80',
  'Web Development':
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80',
  'Career & Growth':
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
};

const inferCategory = (blog) => {
  const sourceText = [
    normalizeText(blog.category),
    normalizeText(blog.title),
    normalizeText(blog.description),
    ...(Array.isArray(blog.tags) ? blog.tags : []),
  ]
    .join(' ')
    .toLowerCase();

  for (const [label, keywords] of Object.entries(blogCategoryKeywords)) {
    if (keywords.some((keyword) => sourceText.includes(keyword))) {
      return label;
    }
  }

  return 'Web Development';
};

const normalizeBlog = (blog, index, source = 'api') => {
  const category = inferCategory(blog);
  const content = normalizeText(blog.content);
  const description =
    normalizeText(blog.description) ||
    normalizeText(content).replace(/\s+/g, ' ').slice(0, 180);

  return {
    id: blog._id || blog.id || `${source}-detail-${index + 1}`,
    slug: normalizeText(blog.slug) || slugify(blog.title || `blog-${index + 1}`),
    title: normalizeText(blog.title) || 'Untitled article',
    description,
    category,
    readTime: normalizeText(blog.readTime) || estimateReadTime(content || description),
    author: 'Devansh Yadav',
    publishedAt: blog.createdAt || blog.publishedAt || new Date().toISOString(),
    image: normalizeText(blog.image) || defaultImageByCategory[category],
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    content,
    source,
  };
};

const fallbackBlogMap = fallbackBlogArticles.reduce((collection, blog, index) => {
  const normalized = normalizeBlog(blog, index, 'local');
  collection.set(normalized.slug, normalized);
  return collection;
}, new Map());

const parseContentBlocks = (content) => {
  const lines = normalizeText(content).split('\n');
  const blocks = [];
  let paragraphBuffer = [];
  let listBuffer = [];
  let codeBuffer = [];
  let codeLanguage = '';
  let inCodeBlock = false;

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) {
      return;
    }
    blocks.push({
      type: 'paragraph',
      text: paragraphBuffer.join(' ').trim(),
    });
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length === 0) {
      return;
    }
    blocks.push({
      type: 'list',
      items: [...listBuffer],
    });
    listBuffer = [];
  };

  const flushCode = () => {
    if (codeBuffer.length === 0) {
      return;
    }
    blocks.push({
      type: 'code',
      code: codeBuffer.join('\n').trimEnd(),
      language: codeLanguage || 'code',
    });
    codeBuffer = [];
    codeLanguage = '';
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCode();
      } else {
        flushParagraph();
        flushList();
        codeLanguage = trimmed.replace('```', '').trim();
      }

      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    const imageMatch = trimmed.match(/^!\[(.*)\]\((.*)\)$/);
    if (imageMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'image',
        alt: imageMatch[1] || 'Article visual',
        src: imageMatch[2],
      });
      return;
    }

    if (/^###\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 3, text: trimmed.replace(/^###\s+/, '') });
      return;
    }

    if (/^##\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 2, text: trimmed.replace(/^##\s+/, '') });
      return;
    }

    if (/^#\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 1, text: trimmed.replace(/^#\s+/, '') });
      return;
    }

    if (/^-\s+/.test(trimmed)) {
      flushParagraph();
      listBuffer.push(trimmed.replace(/^-\s+/, '').trim());
      return;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    paragraphBuffer.push(trimmed);
  });

  flushParagraph();
  flushList();
  flushCode();

  return blocks;
};

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('Invalid article route');
        setLoading(false);
        return;
      }

      try {
        const response = await blogService.getBlogBySlug(slug);
        const apiBlog = response?.data?.blog;

        if (apiBlog) {
          setPost(normalizeBlog(apiBlog, 0, 'api'));
          setError('');
        } else {
          const localPost = fallbackBlogMap.get(slug);
          if (localPost) {
            setPost(localPost);
            setError('');
          } else {
            setError('Article not found');
          }
        }
      } catch (requestError) {
        const localPost = fallbackBlogMap.get(slug);

        if (localPost) {
          setPost(localPost);
          setError('');
        } else {
          setError('Article not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const contentBlocks = useMemo(() => {
    if (!post) {
      return [];
    }

    const parsed = parseContentBlocks(post.content);

    if (parsed.length > 0) {
      return parsed;
    }

    return [
      {
        type: 'paragraph',
        text: post.description || 'Detailed article content will be available soon.',
      },
    ];
  }, [post]);

  const shareLinks = useMemo(() => {
    const href = typeof window !== 'undefined' ? window.location.href : '';
    const encodedUrl = encodeURIComponent(href);
    const encodedTitle = encodeURIComponent(post?.title || 'Insight article');

    return {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      direct: href,
    };
  }, [post?.title, slug]);

  const seoConfig = useMemo(() => {
    const canonicalPath = slug ? `/blog/${slug}` : '/blog';
    const baseKeywords = ['Devansh Yadav blog', 'AI/ML', 'Web Development', 'Lucknow', 'BBDU'];
    const extraKeywords = [post?.category, ...(Array.isArray(post?.tags) ? post.tags : [])].filter(Boolean);

    return {
      title: post?.title || 'Blog',
      description:
        post?.description || 'Read Devansh Yadav’s blog about AI/ML, web development, and portfolio building from Lucknow and BBDU.',
      keywords: [...baseKeywords, ...extraKeywords],
      canonicalPath,
      image: post?.image,
      imageAlt: post?.title || 'Devansh Yadav blog article',
      type: post ? 'article' : 'website',
      noindex: Boolean(error && !post),
    };
  }, [error, post, slug]);

  const blogStructuredData = useMemo(() => {
    if (!post) {
      return null;
    }

    return [
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug}` },
      ], `/blog/${post.slug}`),
      buildBlogPostingSchema({
        post,
        currentPath: `/blog/${post.slug}`,
      }),
    ];
  }, [post]);

  const handleCopy = async () => {
    try {
      if (!shareLinks.direct || !navigator.clipboard) {
        return;
      }

      await navigator.clipboard.writeText(shareLinks.direct);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch (copyError) {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <>
        <Seo {...seoConfig} structuredData={blogStructuredData} />
        <div className="pt-32 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-4 w-32 rounded bg-white/[0.08]" />

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/88 via-blue-950/58 to-slate-900/88 p-6 sm:p-8 md:p-10 shadow-[0_35px_50px_rgba(2,6,23,0.62)]">
                <div className="h-5 w-24 rounded-full bg-white/[0.1]" />
                <div className="mt-4 h-9 w-4/5 rounded bg-white/[0.1]" />
                <div className="mt-4 h-4 w-full rounded bg-white/[0.08]" />
                <div className="mt-2 h-4 w-11/12 rounded bg-white/[0.08]" />
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="h-4 w-24 rounded bg-white/[0.08]" />
                  <div className="h-4 w-28 rounded bg-white/[0.08]" />
                  <div className="h-4 w-20 rounded bg-white/[0.08]" />
                </div>
              </div>

              <div className="h-[280px] w-full rounded-2xl border border-white/10 bg-white/[0.05] sm:h-[380px]" />

              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-white/[0.08]" />
                <div className="h-4 w-11/12 rounded bg-white/[0.08]" />
                <div className="h-4 w-5/6 rounded bg-white/[0.08]" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Seo {...seoConfig} noindex structuredData={blogStructuredData} />
        <div className="pt-32 pb-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Article Not Found</h1>
            <p className="mt-4 text-gray-400">{error || 'The article you are trying to read does not exist.'}</p>
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="mt-7 rounded-xl border border-cyan-300/35 bg-cyan-500/15 px-5 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-500/25"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo {...seoConfig} structuredData={blogStructuredData} />
      <ScrollProgressBar />
      <div className="relative overflow-hidden pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 right-[-6%] h-80 w-80 rounded-full bg-violet-500/18 blur-3xl" />
          <div className="absolute top-40 left-[-7%] h-72 w-72 rounded-full bg-cyan-500/16 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition-colors hover:text-white"
            >
              <FaArrowLeft size={12} />
              Back to all articles
            </Link>
          </motion.div>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-4xl"
          >
            <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/88 via-blue-950/58 to-slate-900/88 p-6 sm:p-8 md:p-10 shadow-[0_35px_50px_rgba(2,6,23,0.62)]">
              <span className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
                {post.category}
              </span>

              <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{post.title}</h1>

              <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">{post.description}</p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="inline-flex items-center gap-2">
                  <FaUser size={12} />
                  {post.author}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FaCalendarAlt size={12} />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FaClock size={12} />
                  {post.readTime}
                </span>
              </div>
            </header>

            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              <img
                src={getOptimizedImageUrl(post.image, { width: 1400 })}
                srcSet={getOptimizedSrcSet(post.image, [800, 1200, 1400, 1800])}
                sizes="(min-width: 1024px) 56rem, 100vw"
                alt={post.title}
                loading="lazy"
                decoding="async"
                fetchPriority="high"
                className="h-[280px] w-full object-cover sm:h-[380px]"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-6">
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-gray-200 transition-colors hover:border-blue-300/45 hover:text-white"
              >
                <FaLinkedin size={12} />
                Share on LinkedIn
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-gray-200 transition-colors hover:border-cyan-300/45 hover:text-white"
              >
                <FaTwitter size={12} />
                Share on Twitter
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-gray-200 transition-colors hover:border-fuchsia-300/45 hover:text-white"
              >
                {copied ? <FaCheck size={12} /> : <FaLink size={12} />}
                {copied ? 'Link copied' : 'Copy link'}
              </button>
            </div>

            <div className="prose prose-invert prose-headings:font-heading mt-9 max-w-none space-y-6 text-[17px] leading-8 text-gray-200">
              {contentBlocks.map((block, index) => {
                if (block.type === 'heading' && block.level === 1) {
                  return (
                    <h2 key={`h1-${index}`} className="text-3xl font-bold text-white">
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === 'heading' && block.level === 2) {
                  return (
                    <h2 key={`h2-${index}`} className="text-2xl font-bold text-white">
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === 'heading' && block.level === 3) {
                  return (
                    <h3 key={`h3-${index}`} className="text-xl font-semibold text-cyan-100">
                      {block.text}
                    </h3>
                  );
                }

                if (block.type === 'list') {
                  return (
                    <ul key={`list-${index}`} className="list-disc space-y-2 pl-6 text-gray-200">
                      {block.items.map((item, itemIndex) => (
                        <li key={`list-item-${index}-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === 'code') {
                  return (
                    <div key={`code-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-gray-400">
                        <span>{block.language}</span>
                        <span>Code</span>
                      </div>
                      <pre className="overflow-x-auto p-4 text-sm leading-7 text-cyan-100">
                        <code>{block.code}</code>
                      </pre>
                    </div>
                  );
                }

                if (block.type === 'image') {
                  const optimizedSrc = getOptimizedImageUrl(block.src, { width: 1200 });
                  const optimizedSrcSet = getOptimizedSrcSet(block.src, [600, 900, 1200, 1600]);

                  return (
                    <figure key={`image-${index}`} className="space-y-2">
                      <img
                        src={optimizedSrc}
                        srcSet={optimizedSrcSet}
                        sizes="(min-width: 1024px) 56rem, 100vw"
                        alt={block.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full rounded-2xl border border-white/10 object-cover"
                      />
                      {block.alt ? <figcaption className="text-sm text-gray-400">{block.alt}</figcaption> : null}
                    </figure>
                  );
                }

                return (
                  <p key={`paragraph-${index}`} className="text-gray-200 leading-8">
                    {block.text}
                  </p>
                );
              })}
            </div>
          </motion.article>
        </div>
      </div>
      <BackToTopButton />
    </>
  );
}
