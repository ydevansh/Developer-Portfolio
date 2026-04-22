import Blog from '../models/Blog.js';

const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const buildDescription = (content, description) => {
  if (description && description.trim()) {
    return description.trim();
  }

  if (!content) {
    return '';
  }

  return content
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const { featured, admin } = req.query;
    const query = {};

    if (admin !== 'true') {
      query.published = true;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let blogQuery = Blog.find(query).sort({ featured: -1, order: 1, createdAt: -1 });

    if (admin !== 'true') {
      blogQuery = blogQuery.select('-content');
    }

    const blogs = await blogQuery;

    res.json({
      message: 'Blogs fetched successfully',
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug, published: true });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      message: 'Blog fetched successfully',
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      description,
      content,
      category,
      image,
      readTime,
      tags,
      featured,
      published,
      order,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const blog = new Blog({
      title,
      description: buildDescription(content, description),
      content,
      category,
      image,
      readTime,
      tags,
      featured: featured ?? false,
      published: published ?? true,
      order: order ?? 0,
    });

    await blog.save();

    res.status(201).json({
      message: 'Blog created successfully',
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.title) {
      updates.slug = generateSlug(updates.title);
    }

    if (updates.content) {
      updates.description = buildDescription(updates.content, updates.description);
    }

    const blog = await Blog.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };
