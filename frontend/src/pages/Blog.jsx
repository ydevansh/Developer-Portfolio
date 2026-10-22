import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaBrain, FaCode, FaChartLine } from 'react-icons/fa';
import blogService from '../services/blogService';
import {
  fallbackBlogArticles,
  blogFilters,
  blogCategoryKeywords,
} from '../data/blogArticles';
import { slugify } from '../utils/helpers';
import BlogCard from '../components/blog/BlogCard';
import FeaturedBlogCard from '../components/blog/FeaturedBlogCard';
import ScrollProgressBar from '../components/blog/ScrollProgressBar';
import BackToTopButton from '../components/blog/BackToTopButton';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildCollectionSchema } from '../data/seoSchemas';

const blogSeo = {
  title: 'Blog | Devansh Yadav on AI, Web Development & Student Projects',
  description:
    'Read Devansh Yadav’s blog about AI, machine learning, web development, React, Node.js, and student projects from Lucknow and BBDU.',
  keywords: ['Devansh Yadav blog', 'AI blog', 'Web Development', 'React', 'Node.js', 'Lucknow', 'BBDU'],
};

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const estimateReadTime = (value) => {
  const words = normalizeText(value).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(words / 180));
  return `${minutes} min read`;
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

  if (!sourceText) {
    return 'Web Development';
  }

  for (const [label, keywords] of Object.entries(blogCategoryKeywords)) {
    if (keywords.some((keyword) => sourceText.includes(keyword))) {
      return label;
    }
  }

  return 'Web Development';
};

const defaultImageByCategory = {
  'AI & Machine Learning':
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80',
  'Web Development':
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80',
  'Career & Growth':
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
};

const normalizeBlog = (blog, index, source = 'api') => {
  const derivedCategory = inferCategory(blog);
  const content = normalizeText(blog.content);
  const description =
    normalizeText(blog.description) ||
    normalizeText(content).replace(/\s+/g, ' ').slice(0, 170);

  return {
    id: blog._id || blog.id || `${source}-blog-${index + 1}`,
    slug: normalizeText(blog.slug) || slugify(blog.title || `blog-${index + 1}`),
    title: normalizeText(blog.title) || 'Untitled article',
    description,
    category: derivedCategory,
    readTime: normalizeText(blog.readTime) || estimateReadTime(content || description),
    author: 'Devansh Yadav',
    publishedAt: blog.createdAt || blog.publishedAt || new Date().toISOString(),
    image: normalizeText(blog.image) || defaultImageByCategory[derivedCategory],
    featured: Boolean(blog.featured),
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    content,
    source,
  };
};

const fallbackBlogs = fallbackBlogArticles.map((blog, index) => normalizeBlog(blog, index, 'local'));

const filterIcons = {
  'All': null,
  'AI & Machine Learning': FaBrain,
  'Web Development': FaCode,
  'Career & Growth': FaChartLine,
};

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const skeletonCards = useMemo(() => Array.from({ length: 4 }), []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogService.getAllBlogs();
        const apiBlogs = Array.isArray(response?.data?.blogs) ? response.data.blogs : [];
        const normalizedBlogs = apiBlogs.map((blog, index) => normalizeBlog(blog, index, 'api'));

        setBlogs(normalizedBlogs.length > 0 ? normalizedBlogs : fallbackBlogs);
      } catch (error) {
        console.error('Unable to load blogs from API, using local fallback:', error);
        setBlogs(fallbackBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = deferredSearchTerm.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesFilter = activeFilter === 'All' || blog.category === activeFilter;

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableContent = [blog.title, blog.description, blog.category, ...(blog.tags || [])]
        .join(' ')
        .toLowerCase();

      return searchableContent.includes(normalizedSearch);
    });
  }, [blogs, deferredSearchTerm, activeFilter]);

  const featuredBlog = useMemo(() => {
    if (filteredBlogs.length === 0) {
      return null;
    }

    return filteredBlogs.find((blog) => blog.featured) || filteredBlogs[0];
  }, [filteredBlogs]);

  const regularBlogs = useMemo(() => {
    if (!featuredBlog) {
      return filteredBlogs;
    }

    return filteredBlogs.filter((blog) => blog.slug !== featuredBlog.slug);
  }, [featuredBlog, filteredBlogs]);

  const structuredData = useMemo(() => [
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
    ], '/blog'),
    buildCollectionSchema({
      name: 'Devansh Yadav Blog',
      description: blogSeo.description,
      currentPath: '/blog',
      items: blogs.map((post) => ({
        name: post.title,
        url: `/blog/${post.slug}`,
      })),
    }),
  ], [blogs]);

  return (
    <>
      <Seo
        title={blogSeo.title}
        description={blogSeo.description}
        keywords={blogSeo.keywords}
        canonicalPath="/blog"
        structuredData={structuredData}
      />

      <ScrollProgressBar />
      <div className="relative overflow-x-hidden pt-32 pb-20 sm:pt-36">
        {/* Minimal background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.04),transparent_50%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-12 border border-[#00E5FF]/20 bg-black/80 p-7 sm:p-10"
            style={{ borderRadius: '0px' }}
          >
            {/* Corner decorators */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00E5FF]/60" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00E5FF]/60" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00E5FF]/60" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00E5FF]/60" />
            <div
              className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00E5FF] mb-4"
              style={{ borderRadius: '0px' }}
            >
              <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
              $ cat ./insights
            </div>
            <h1 className="font-mono text-4xl font-bold leading-tight sm:text-5xl text-white">Devansh Yadav <span className="text-[#00E5FF]">Blog</span></h1>
            <p className="font-mono mt-4 max-w-3xl text-base leading-relaxed text-[#A1A1AA] sm:text-lg">
              Sharing my journey in AI/ML, web development, and real-world coding experiences from Lucknow and BBDU.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mb-10 grid gap-4 border border-[#00E5FF]/15 bg-black/60 p-4 sm:p-5"
            style={{ borderRadius: '0px' }}
          >
            <label className="relative block">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#00E5FF]/60" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="$ search --query=..."
                className="font-mono w-full border border-[#00E5FF]/20 bg-black/80 py-3 pl-11 pr-4 text-sm text-white placeholder:text-[#A1A1AA]/40 outline-none transition-colors focus:border-[#00E5FF]/60 hover:border-[#00E5FF]/35"
                style={{ borderRadius: '0px' }}
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {blogFilters.map((filter) => {
                const Icon = filterIcons[filter];
                const active = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`font-mono inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all sm:text-[11px] ${
                      active
                        ? 'border-[#00E5FF]/60 bg-[#00E5FF]/10 text-[#00E5FF]'
                        : 'border-white/10 bg-white/[0.02] text-[#A1A1AA] hover:border-[#00E5FF]/35 hover:text-[#00E5FF]'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    {Icon ? <Icon size={11} /> : null}
                    {filter}
                  </button>
                );
              })}
            </div>
          </motion.section>

          {loading ? (
            <div className="space-y-6">
              {/* Terminal-style skeleton */}
              <div className="animate-pulse border border-[#00E5FF]/15 bg-black/60" style={{ borderRadius: '0px' }}>
                <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
                  <div className="h-40 w-full bg-white/[0.03] lg:h-full" />
                  <div className="space-y-4 p-5 sm:p-6">
                    <div className="h-4 w-20 bg-[#00E5FF]/10" />
                    <div className="h-6 w-3/4 bg-white/[0.06]" />
                    <div className="h-3 w-full bg-white/[0.04]" />
                    <div className="h-3 w-5/6 bg-white/[0.04]" />
                    <div className="flex flex-wrap gap-3">
                      <div className="h-4 w-24 bg-[#00E5FF]/5" />
                      <div className="h-4 w-28 bg-[#00E5FF]/5" />
                      <div className="h-4 w-20 bg-[#00E5FF]/5" />
                    </div>
                    <div className="h-9 w-44 bg-[#00E5FF]/10" />
                  </div>
                </div>
              </div>

              <div className="grid justify-items-center gap-4 md:grid-cols-2">
                {skeletonCards.map((_, index) => (
                  <div
                    key={`blog-skeleton-${index}`}
                    className="w-full max-w-[28rem] animate-pulse border border-[#00E5FF]/10 bg-black/60 p-3"
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="h-32 w-full bg-white/[0.04]" />
                    <div className="mt-3 flex items-center justify-between">
                      <div className="h-4 w-24 bg-[#00E5FF]/8" />
                      <div className="h-3 w-16 bg-white/[0.04]" />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="h-4 w-5/6 bg-white/[0.04]" />
                      <div className="h-4 w-full bg-white/[0.04]" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="h-3 w-20 bg-white/[0.03]" />
                      <div className="h-3 w-20 bg-white/[0.03]" />
                    </div>
                    <div className="mt-3 h-4 w-24 bg-white/[0.04]" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {featuredBlog && (
                <div className="mb-10">
                  <FeaturedBlogCard post={featuredBlog} />
                </div>
              )}

              {regularBlogs.length > 0 ? (
                <div className="grid justify-items-center gap-4 md:grid-cols-2">
                  {regularBlogs.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-[#00E5FF]/20 bg-black/60 p-10 text-center"
                  style={{ borderRadius: '0px' }}
                >
                  <h2 className="font-mono text-2xl font-semibold text-white">$ no posts found</h2>
                  <p className="font-mono mt-3 text-sm text-[#A1A1AA]">
                    Try changing your search or selected filter to discover more articles.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      <BackToTopButton />
    </>
  );
}
