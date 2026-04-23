import React, { useEffect, useMemo, useState } from 'react';
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
    const normalizedSearch = searchTerm.trim().toLowerCase();

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
  }, [blogs, searchTerm, activeFilter]);

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

  return (
    <>
      <ScrollProgressBar />
      <div className="relative overflow-hidden pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-[-8%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute top-14 right-[-4%] h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute bottom-10 left-[36%] h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/85 via-blue-950/60 to-slate-900/85 p-7 sm:p-10 shadow-[0_35px_55px_rgba(5,10,30,0.7)]"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Insights & Articles</p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">My Blog</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Sharing my journey in Full Stack Development, AI, and real-world coding experiences.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mb-10 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/65 p-4 shadow-[0_20px_35px_rgba(2,6,23,0.45)] sm:p-5"
          >
            <label className="relative block">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, category, or topic"
                className="w-full rounded-xl border border-white/15 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-cyan-300/55"
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
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all sm:text-[11px] ${
                      active
                        ? 'border-cyan-300/60 bg-cyan-500/20 text-cyan-100 shadow-[0_12px_26px_rgba(6,182,212,0.25)]'
                        : 'border-white/15 bg-white/[0.03] text-gray-300 hover:border-cyan-300/35 hover:text-cyan-100'
                    }`}
                  >
                    {Icon ? <Icon size={11} /> : null}
                    {filter}
                  </button>
                );
              })}
            </div>
          </motion.section>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-500/10 px-5 py-3 text-cyan-100">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
                Loading articles...
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
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {regularBlogs.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-10 text-center text-gray-300"
                >
                  <h2 className="text-2xl font-semibold text-white">No posts found</h2>
                  <p className="mt-3 text-sm text-gray-400">
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
