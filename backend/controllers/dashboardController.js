import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import Contact from '../models/Contact.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const [totalProjects, totalBlogs, totalMessages, unreadMessages, recentMessages, recentProjects, recentBlogs] =
      await Promise.all([
        Project.countDocuments(),
        Blog.countDocuments(),
        Contact.countDocuments(),
        Contact.countDocuments({ read: { $ne: true } }),
        Contact.find().sort({ createdAt: -1 }).limit(5),
        Project.find().sort({ createdAt: -1 }).limit(5),
        Blog.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      success: true,
      message: 'Dashboard summary fetched successfully',
      data: {
        stats: {
          totalProjects,
          totalBlogs,
          totalMessages,
          unreadMessages,
        },
        recentMessages,
        recentProjects,
        recentBlogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardSummary,
};