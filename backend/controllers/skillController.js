import Skill from '../models/Skill.js';

export const getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
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
    const skills = await Skill.find({ category }).sort({ order: 1 });

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
    const { name, category, proficiency, icon } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }

    const skill = new Skill({
      name,
      category,
      proficiency,
      icon,
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

    const skill = await Skill.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

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
