import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';

const featuredDescriptionClamp = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

export default function FeaturedBlogCard({ post }) {
  if (!post) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-3xl border border-cyan-300/25 bg-gradient-to-br from-slate-900/90 via-blue-950/60 to-violet-950/50 shadow-[0_30px_55px_rgba(5,10,35,0.7)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(75%_50%_at_15%_0%,rgba(59,130,246,0.25),transparent_70%),radial-gradient(60%_45%_at_90%_0%,rgba(168,85,247,0.25),transparent_72%)]" />

      <div className="relative grid gap-0 lg:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-64 w-full object-cover lg:h-full"
          />
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <span className="inline-flex rounded-full border border-fuchsia-300/40 bg-fuchsia-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia-100">
            Featured
          </span>

          <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">{post.title}</h2>

          <p className="text-gray-200/90 leading-relaxed" style={featuredDescriptionClamp}>
            {post.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-cyan-100/90">
            <span className="inline-flex items-center gap-2">
              <FaClock size={12} />
              {post.readTime}
            </span>
            <span className="inline-flex items-center gap-2">
              <FaCalendarAlt size={12} />
              {formatDate(post.publishedAt)}
            </span>
            <span className="font-semibold">{post.author}</span>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-500/15 px-5 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-500/25 hover:text-white"
          >
            Read Featured Story
            <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
