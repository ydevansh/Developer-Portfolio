import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import skillService from '../../services/skillService';

const skillCategories = ['Frontend', 'Backend', 'AI/Core'];

const normalizeSkillCategory = (category) => {
  if (category === 'AI/ML') {
    return 'AI/Core';
  }

  if (category === 'Databases' || category === 'Tools') {
    return 'Backend';
  }

  return skillCategories.includes(category) ? category : 'Backend';
};

export default function Skills() {
  const categories = skillCategories;

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Frontend');
  const [editingSkill, setEditingSkill] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 'Intermediate',
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await skillService.getAllSkills();
      setSkills(response.data.skills || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const skillsByCategory = useMemo(
    () =>
      categories.reduce((accumulator, category) => {
        accumulator[category] = skills.filter((skill) => normalizeSkillCategory(skill.category) === category);
        return accumulator;
      }, {}),
    [skills]
  );

  const handleAddSkill = (category = 'Frontend') => {
    setSelectedCategory(category);
    setEditingSkill(null);
    setFormData({
      name: '',
      category,
      proficiency: 'Intermediate',
    });
    setIsModalOpen(true);
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    const normalizedCategory = normalizeSkillCategory(skill.category);
    setSelectedCategory(normalizedCategory);
    setFormData({
      name: skill.name || '',
      category: normalizedCategory,
      proficiency: skill.proficiency || 'Intermediate',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        proficiency: formData.proficiency,
      };

      if (editingSkill) {
        await skillService.updateSkill(editingSkill._id, payload);
      } else {
        await skillService.createSkill(payload);
      }

      setIsModalOpen(false);
      setEditingSkill(null);
      await fetchSkills();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (skill) => {
    if (!window.confirm(`Delete "${skill.name}"?`)) {
      return;
    }

    try {
      await skillService.deleteSkill(skill._id);
      setSkills((currentSkills) => currentSkills.filter((item) => item._id !== skill._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete skill');
    }
  };

  const colors = {
    Frontend: 'from-blue-500 to-blue-600',
    Backend: 'from-purple-500 to-purple-600',
    'AI/Core': 'from-pink-500 to-pink-600',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills Management</h1>
          <p className="text-gray-400 mt-1">Manage your technical skills</p>
        </div>
        <Button icon={FaPlus} onClick={() => handleAddSkill(selectedCategory)}>
          Add Skill
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

      {/* Skills by Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`bg-gradient-to-br ${colors[category]} bg-opacity-10`}>
              <div className="flex items-center justify-between space-x-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[category]}`} />
                  <h2 className="text-xl font-bold">{category}</h2>
                </div>
                <button
                  onClick={() => handleAddSkill(category)}
                  className="px-3 py-1 rounded-md bg-primary-500/20 text-primary-300 text-xs font-medium hover:bg-primary-500/30 transition-colors"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-2">
                {(skillsByCategory[category] || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No skills in this category yet.</p>
                ) : null}
                {(skillsByCategory[category] || []).map((skill) => (
                  <motion.div
                    key={skill._id}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between bg-primary-500/20 px-3 py-2 rounded-lg group"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-200">{skill.name}</p>
                      <p className="mt-1 text-[11px] text-gray-500">{skill.proficiency || 'Intermediate'}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditSkill(skill)}
                        className="p-1 hover:bg-blue-500/20 rounded"
                        aria-label="Edit skill"
                      >
                        <FaEdit size={14} className="text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill)}
                        className="p-1 hover:bg-red-500/20 rounded"
                        aria-label="Delete skill"
                      >
                        <FaTrash size={14} className="text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                {(skillsByCategory[category] || []).length} skill
                {(skillsByCategory[category] || []).length !== 1 ? 's' : ''}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategory(value);
                setFormData((prev) => ({ ...prev, category: value }));
              }}
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skill Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., React, Python, etc."
              required
              autoFocus
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Proficiency</label>
            <select
              name="proficiency"
              value={formData.proficiency}
              onChange={(e) => setFormData((prev) => ({ ...prev, proficiency: e.target.value }))}
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" type="submit" loading={saving} disabled={saving}>
              {editingSkill ? 'Update Skill' : 'Add Skill'}
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
