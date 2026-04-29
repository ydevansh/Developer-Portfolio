import Skill from '../models/Skill.js';

const skillCategories = ['Frontend', 'Backend', 'AI/Core'];
const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const normalizeText = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeSkillCategory = (category) => {
  const normalizedCategory = normalizeText(category);
  const lowerCategory = normalizedCategory.toLowerCase();

  if (skillCategories.includes(normalizedCategory)) {
    return normalizedCategory;
  }

  if (['frontend', 'web development'].includes(lowerCategory)) {
    return 'Frontend';
  }

  if (['backend', 'back-end', 'databases', 'database', 'tools'].includes(lowerCategory)) {
    return 'Backend';
  }

  if (
    ['ai/core', 'ai & data science', 'ai and data science', 'ai & machine learning', 'ai/ml', 'machine learning', 'ai'].includes(
      lowerCategory
    )
  ) {
    return 'AI/Core';
  }

  return null;
};

const normalizeIcon = (value) => {
  const normalizedIcon = normalizeText(value);
  return normalizedIcon || null;
};

const getDuplicateSkill = async ({ name, category, excludeId = null }) => {
  const query = {
    category,
    name: { $regex: `^${escapeRegExp(name)}$`, $options: 'i' },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Skill.findOne(query);
};

const getNextOrder = async (category) => {
  const lastSkill = await Skill.findOne({ category }).sort({ order: -1, createdAt: -1 }).select('order');
  const lastOrder = Number(lastSkill?.order);

  return Number.isFinite(lastOrder) ? lastOrder + 1 : 1;
};

export const getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 });
    res.json({
      message: 'Skills fetched successfully',
      skills,
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const normalizedCategory = normalizeSkillCategory(category);

    if (!normalizedCategory) {
      return res.status(400).json({ message: 'Invalid skill category' });
    }

    const skills = await Skill.find({ category: normalizedCategory }).sort({ order: 1, name: 1 });

    res.json({
      message: 'Skills fetched successfully',
      skills,
    });
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const { name, category, proficiency, icon, order } = req.body;
    const normalizedName = normalizeText(name);
    const normalizedCategory = normalizeSkillCategory(category);
    const normalizedIcon = normalizeIcon(icon);
    const parsedOrder = Number(order);

    if (!normalizedName || !normalizedCategory) {
      return res.status(400).json({ message: 'Name and category are required' });
    }

    if (await getDuplicateSkill({ name: normalizedName, category: normalizedCategory })) {
      return res.status(409).json({ message: 'Skill already exists in this category' });
    }

    const nextOrder = Number.isFinite(parsedOrder) && parsedOrder >= 0 ? parsedOrder : await getNextOrder(normalizedCategory);

    const skill = new Skill({
      name: normalizedName,
      category: normalizedCategory,
      proficiency: proficiencyLevels.includes(proficiency) ? proficiency : 'Intermediate',
      icon: normalizedIcon,
      order: nextOrder,
    });

    await skill.save();

    res.status(201).json({
      message: 'Skill created successfully',
      skill,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const currentSkill = await Skill.findById(id);

    if (!currentSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const normalizedName = normalizeText(updates.name ?? currentSkill.name);
    const normalizedCategory = normalizeSkillCategory(updates.category ?? currentSkill.category);

    if (!normalizedName || !normalizedCategory) {
      return res.status(400).json({ message: 'Name and category are required' });
    }

    if (await getDuplicateSkill({ name: normalizedName, category: normalizedCategory, excludeId: id })) {
      return res.status(409).json({ message: 'Skill already exists in this category' });
    }

    const normalizedUpdates = {
      name: normalizedName,
      category: normalizedCategory,
      proficiency: proficiencyLevels.includes(updates.proficiency) ? updates.proficiency : currentSkill.proficiency,
      icon: updates.icon !== undefined ? normalizeIcon(updates.icon) : currentSkill.icon,
      order: Number.isFinite(Number(updates.order)) ? Math.max(0, Number(updates.order)) : currentSkill.order,
    };

    const skill = await Skill.findByIdAndUpdate(id, normalizedUpdates, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: 'Skill updated successfully',
      skill,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default { getAllSkills, getSkillsByCategory, createSkill, updateSkill, deleteSkill };
