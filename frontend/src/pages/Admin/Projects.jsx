import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaGithub, FaExternalLinkAlt, FaImage } from 'react-icons/fa';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import projectService from '../../services/projectService';
import { truncateText } from '../../utils/helpers';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    image: '',
    githubLink: '',
    deployedLink: '',
  });
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectService.getAllProjects();
      setProjects(response.data.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      image: '',
      githubLink: '',
      deployedLink: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      image: project.image || '',
      githubLink: project.githubLink || '',
      deployedLink: project.deployedLink || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}"?`)) {
      return;
    }

    try {
      await projectService.deleteProject(project._id);
      setProjects((currentProjects) => currentProjects.filter((item) => item._id !== project._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const technologies = formData.technologies
      .split(',')
      .map((technology) => technology.trim())
      .filter(Boolean);

    if (!technologies.length) {
      setError('Please add at least one technology');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        title: formData.title,
        description: formData.description,
        technologies,
        image: formData.image,
        githubLink: formData.githubLink,
        deployedLink: formData.deployedLink,
      };

      if (editingProject) {
        await projectService.updateProject(editingProject._id, payload);
      } else {
        await projectService.createProject(payload);
      }

      setIsModalOpen(false);
      setEditingProject(null);
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderProjectImage = (project) => {
    if (project.image) {
      return (
        <img
          src={project.image}
          alt={project.title}
          className="h-16 w-16 rounded-lg object-cover border border-primary-500/20"
        />
      );
    }

    return (
      <div className="h-16 w-16 rounded-lg border border-dashed border-primary-500/30 bg-primary-500/10 flex items-center justify-center text-primary-400">
        <FaImage size={16} />
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <Button icon={FaPlus} onClick={handleAddClick}>
          Add Project
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
        ) : projects.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            No projects found. Add your first project to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-500/20">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400">Project</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400">Description</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400">Tech Stack</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400">Links</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <motion.tr
                    key={project._id}
                    whileHover={{ backgroundColor: 'rgba(79, 39, 245, 0.05)' }}
                    className="border-b border-primary-500/10 hover:bg-primary-500/5 transition-colors align-top"
                  >
                    <td className="py-4 px-6 text-sm text-gray-300">
                      <div className="flex items-center gap-3">
                        {renderProjectImage(project)}
                        <div>
                          <p className="font-semibold text-white">{project.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {project.featured ? 'Featured' : 'Regular'} project
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-400 max-w-sm">
                      {truncateText(project.description || '', 120)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300">
                      <div className="flex flex-wrap gap-2">
                        {(project.technologies || []).map((technology) => (
                          <span
                            key={technology}
                            className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300">
                      <div className="flex flex-col gap-2">
                        {project.githubLink ? (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <FaGithub size={12} />
                            GitHub
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">No GitHub link</span>
                        )}
                        {project.deployedLink ? (
                          <a
                            href={project.deployedLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                          >
                            <FaExternalLinkAlt size={11} />
                            Live
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">No live link</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(project)}
                          className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <FaEdit size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project)}
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
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project title"
              required
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Project description"
              required
              rows="3"
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tech Stack</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB"
              required
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Project image URL"
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub Link</label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                placeholder="GitHub URL"
                className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Live Link</label>
              <input
                type="url"
                name="deployedLink"
                value={formData.deployedLink}
                onChange={handleChange}
                placeholder="Live URL"
                className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" type="submit" loading={saving} disabled={saving}>
              {editingProject ? 'Update Project' : 'Add Project'}
            </Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
