import Blog from '../models/Blog.js';

const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const getAllBlogs = async (req, res, next) => {
  try {
    const { featured } = req.query;
    let query = { published: true };

    if (featured === 'true') {
      query.featured = true;
    }

    const blogs = await Blog.find(query)
      .select('-content')
      .sort({ featured: -1, order: 1, createdAt: -1 });

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
    const { title, description, content, image, tags, featured, published } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: 'Title, description, and content are required' });
    }

    const blog = new Blog({
      title,
      description,
      content,
      image,
      tags,
      featured: featured || false,
      published: published || false,
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
