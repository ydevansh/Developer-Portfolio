import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaImage, FaChevronDown, FaCheck } from 'react-icons/fa';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import blogService from '../../services/blogService';
import { truncateText } from '../../utils/helpers';

export default function Blogs() {
  const categoryOptions = [
    {
      value: 'Frontend',
      title: 'Frontend',
      description: 'React, UI, styling, and client-side work',
    },
    {
      value: 'Backend',
      title: 'Backend',
      description: 'APIs, server logic, databases, and auth',
    },
    {
      value: 'AI/Core',
      title: 'AI/Core',
      description: 'AI, machine learning, and core concepts',
    },
    {
      value: 'JavaScript',
      title: 'JavaScript',
      description: 'Language-focused tutorials and notes',
    },
  ];

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: '',
    readTime: '',
    published: true,
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await blogService.getAdminBlogs();
      setBlogs(response.data.blogs || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingBlog(null);
    setFormData({ title: '', content: '', category: '', image: '', readTime: '', published: true });
    setCategoryMenuOpen(false);
    setIsModalOpen(true);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      content: blog.content || '',
      category: blog.category || '',
      image: blog.image || '',
      readTime: blog.readTime || '',
      published: blog.published ?? true,
    });
    setCategoryMenuOpen(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}"?`)) {
      return;
    }

    try {
      await blogService.deleteBlog(blog._id);
      setBlogs((currentBlogs) => currentBlogs.filter((item) => item._id !== blog._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        image: formData.image,
        readTime: formData.readTime,
        published: formData.published,
      };

      if (editingBlog) {
        await blogService.updateBlog(editingBlog._id, payload);
      } else {
        await blogService.createBlog(payload);
      }

      setIsModalOpen(false);
      setEditingBlog(null);
      await fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, category }));
    setCategoryMenuOpen(false);
  };

  const handleCloseModal = () => {
    setCategoryMenuOpen(false);
    setIsModalOpen(false);
  };

  const selectedCategory = categoryOptions.find((option) => option.value === formData.category);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blogs Management</h1>
          <p className="text-gray-400 mt-1">Manage your blog posts</p>
        </div>
        <Button icon={FaPlus} onClick={handleAddClick}>
          Add Blog
        </Button>
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

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            No blogs found. Publish your first post to populate the dashboard.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-500/20">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400">Blog</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400">Category</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400">Read Time</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <motion.tr
                    key={blog._id}
                    whileHover={{ backgroundColor: 'rgba(79, 39, 245, 0.05)' }}
                    className="border-b border-primary-500/10 hover:bg-primary-500/5 transition-colors align-top"
                  >
                    <td className="py-4 px-6 text-sm text-gray-300">
                      <div className="flex items-center gap-3">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="h-16 w-16 rounded-lg object-cover border border-primary-500/20"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg border border-dashed border-primary-500/30 bg-primary-500/10 flex items-center justify-center text-primary-400">
                            <FaImage size={16} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white">{blog.title}</p>
                          <p className="text-xs text-gray-500 mt-1 max-w-sm">{truncateText(blog.content || '', 110)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300">{blog.category || 'Uncategorized'}</td>
                    <td className="py-4 px-6 text-sm text-gray-300">{blog.readTime || '-'}</td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          blog.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <FaEdit size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog)}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <FaTrash size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBlog ? 'Edit Blog' : 'Add New Blog'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Blog title"
              required
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Blog content"
              required
              rows="6"
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setCategoryMenuOpen((open) => !open)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                    categoryMenuOpen
                      ? 'border-primary-500 bg-primary-500/15 shadow-lg shadow-primary-500/10'
                      : 'border-primary-500/20 bg-primary-500/5 hover:bg-primary-500/10 hover:border-primary-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">
                        {selectedCategory ? selectedCategory.title : 'Select a category'}
                      </p>
                      <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                        {selectedCategory
                          ? selectedCategory.description
                          : 'Choose the category that best matches this post'}
                      </p>
                    </div>
                    <FaChevronDown
                      className={`text-gray-400 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`}
                      size={14}
                    />
                  </div>
                </button>

                {categoryMenuOpen && (
                  <div className="rounded-xl border border-primary-500/20 bg-primary-950 shadow-xl overflow-hidden">
                    <div className="max-h-56 overflow-y-auto">
                      {categoryOptions.map((category) => {
                        const isSelected = formData.category === category.value;

                        return (
                          <button
                            key={category.value}
                            type="button"
                            onClick={() => handleCategorySelect(category.value)}
                            className={`w-full px-4 py-3 text-left transition-colors ${
                              isSelected
                                ? 'bg-primary-500/20'
                                : 'hover:bg-primary-500/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-white">{category.title}</p>
                                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                                  {category.description}
                                </p>
                              </div>
                              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-300">
                                {isSelected && <FaCheck className="text-primary-400" size={12} />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <input type="hidden" name="category" value={formData.category} />
                <p className="text-xs text-gray-500">
                  Selected: <span className="text-gray-300">{formData.category || 'None'}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Read Time</label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="e.g., 5 min"
                className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Blog image URL"
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="h-4 w-4 rounded border-primary-500/30 bg-primary-500/10 text-primary-500 focus:ring-primary-500"
            />
            Published
          </label>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" type="submit" loading={saving} disabled={saving}>
              {editingBlog ? 'Update Blog' : 'Add Blog'}
            </Button>
            <Button variant="secondary" onClick={handleCloseModal} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
