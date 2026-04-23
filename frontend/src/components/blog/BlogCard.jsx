import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';

const descriptionClamp = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

export default function BlogCard({ post, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-4 shadow-[0_24px_40px_rgba(2,6,23,0.48)] transition-colors duration-300 hover:border-cyan-300/40"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_-5%,rgba(56,189,248,0.18),transparent_60%)]" />
      </div>

      <div className="relative space-y-4">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
            <FaClock size={11} />
            {post.readTime}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold leading-tight text-white">{post.title}</h3>
          <p className="text-sm leading-relaxed text-gray-300" style={descriptionClamp}>
            {post.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-medium text-gray-200">{post.author}</span>
          <span className="inline-flex items-center gap-1.5">
            <FaCalendarAlt size={10} />
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition-colors hover:text-white"
        >
          Read More
          <FaArrowRight size={11} />
        </Link>
      </div>
    </motion.article>
  );
}
