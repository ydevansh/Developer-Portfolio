import api from './api.js';

const BLOG_CACHE_KEY = 'portfolio_blog_cache_v1';
const BLOG_CACHE_TTL = 10 * 60 * 1000;
let inMemoryCache = null;
let inMemoryTimestamp = 0;
let inflightRequest = null;

const isCacheFresh = (timestamp) => Date.now() - timestamp < BLOG_CACHE_TTL;

const readCache = () => {
  if (inMemoryCache && isCacheFresh(inMemoryTimestamp)) {
    return inMemoryCache;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(BLOG_CACHE_KEY);
    if (!raw) {
      return null;
    }

    const payload = JSON.parse(raw);
    if (!payload?.blogs || !payload?.timestamp || !isCacheFresh(payload.timestamp)) {
      return null;
    }

    inMemoryCache = payload.blogs;
    inMemoryTimestamp = payload.timestamp;
    return payload.blogs;
  } catch (error) {
    return null;
  }
};

const writeCache = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0 || typeof window === 'undefined') {
    return;
  }

  const payload = {
    blogs,
    timestamp: Date.now(),
  };

  inMemoryCache = blogs;
  inMemoryTimestamp = payload.timestamp;

  try {
    window.localStorage.setItem(BLOG_CACHE_KEY, JSON.stringify(payload));
  } catch (error) {
    // Ignore storage write errors.
  }
};

const getCachedBlogBySlug = (slug) => {
  if (!slug) {
    return null;
  }

  const cachedBlogs = readCache();
  if (!cachedBlogs) {
    return null;
  }

  return cachedBlogs.find((blog) => blog?.slug === slug) || null;
};

export const blogService = {
  getAllBlogs: (params = {}) => {
    const isCacheable = !params || Object.keys(params).length === 0;

    if (isCacheable) {
      const cached = readCache();
      if (cached) {
        return Promise.resolve({ data: { blogs: cached }, cached: true });
      }
    }

    if (isCacheable && inflightRequest) {
      return inflightRequest;
    }

    const request = api
      .get('/blog/all', { params })
      .then((response) => {
        const blogs = Array.isArray(response?.data?.blogs) ? response.data.blogs : [];
        if (isCacheable && blogs.length > 0) {
          writeCache(blogs);
        }
        return response;
      })
      .finally(() => {
        if (isCacheable) {
          inflightRequest = null;
        }
      });

    if (isCacheable) {
      inflightRequest = request;
    }

    return request;
  },
  getAdminBlogs: () => api.get('/blog/all', { params: { admin: true } }),
  getBlogBySlug: (slug) => {
    const cachedBlog = getCachedBlogBySlug(slug);
    if (cachedBlog) {
      return Promise.resolve({ data: { blog: cachedBlog }, cached: true });
    }

    return api.get(`/blog/${slug}`);
  },
  createBlog: (data) => api.post('/blog', data),
  updateBlog: (id, data) => api.put(`/blog/${id}`, data),
  deleteBlog: (id) => api.delete(`/blog/${id}`),
};

export default blogService;
