import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaProjectDiagram, FaBlog, FaEnvelope } from 'react-icons/fa';
import StatCard from '../../components/admin/StatCard';
import ActivityCard from '../../components/admin/ActivityCard';
import Card from '../../components/admin/Card';
import dashboardService from '../../services/dashboardService';
import { truncateText } from '../../utils/helpers';

const initialDashboardState = {
  stats: {
    totalProjects: 0,
    totalBlogs: 0,
    totalMessages: 0,
    unreadMessages: 0,
  },
  recentMessages: [],
  recentProjects: [],
  recentBlogs: [],
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(initialDashboardState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await dashboardService.getSummary();

        if (!isMounted) {
          return;
        }

        setDashboard(response.data.data || initialDashboardState);
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load dashboard data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatRelativeTime = (dateValue) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return 'Recently';
    }

    const diffInMinutes = Math.floor((Date.now() - date.getTime()) / 60000);

    if (diffInMinutes < 1) {
      return 'Just now';
    }

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const messageActivityItems = dashboard.recentMessages.map((message) => ({
    title: message.name,
    description: `${truncateText(message.message, 90)}${message.read ? '' : ' • Unread'}`,
    time: formatRelativeTime(message.createdAt),
    icon: FaEnvelope,
  }));

  const projectActivityItems = dashboard.recentProjects.map((project) => ({
    title: project.title,
    description: project.technologies?.length
      ? project.technologies.join(', ')
      : truncateText(project.description || 'Project added', 90),
    time: formatRelativeTime(project.createdAt),
    icon: FaProjectDiagram,
  }));

  const blogActivityItems = dashboard.recentBlogs.map((blog) => ({
    title: blog.title,
    description: [blog.category, blog.readTime].filter(Boolean).join(' • ') || 'Blog added',
    time: formatRelativeTime(blog.createdAt),
    icon: FaBlog,
  }));

  const renderActivityList = (items, emptyMessage) => {
    if (!items.length) {
      return <p className="text-sm text-gray-500">{emptyMessage}</p>;
    }

    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <ActivityCard key={`${item.title}-${index}`} activity={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Hi Devansh 👑</h1>
        <p className="text-gray-400">Welcome back to your admin panel</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-16">
            <div className="h-12 w-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Projects"
              value={dashboard.stats.totalProjects}
              icon={FaProjectDiagram}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Total Blogs"
              value={dashboard.stats.totalBlogs}
              icon={FaBlog}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              title="Total Messages"
              value={dashboard.stats.totalMessages}
              icon={FaEnvelope}
              color="from-pink-500 to-pink-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Recent Activity</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Latest messages, projects, and blogs from the database
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Latest Messages</h3>
                  <span className="text-xs text-gray-400">{dashboard.stats.unreadMessages} unread</span>
                </div>
                {renderActivityList(messageActivityItems, 'No messages yet.')}
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recently Added Projects</h3>
                  <span className="text-xs text-gray-400">{dashboard.recentProjects.length} items</span>
                </div>
                {renderActivityList(projectActivityItems, 'No projects found yet.')}
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recently Added Blogs</h3>
                  <span className="text-xs text-gray-400">{dashboard.recentBlogs.length} items</span>
                </div>
                {renderActivityList(blogActivityItems, 'No blogs found yet.')}
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
