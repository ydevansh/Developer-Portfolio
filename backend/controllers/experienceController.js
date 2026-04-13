import Experience from '../models/Experience.js';

export const getAllExperience = async (req, res, next) => {
  try {
    const experience = await Experience.find().sort({ order: 1, startDate: -1 });
    res.json({
      message: 'Experience fetched successfully',
      experience,
    });
  } catch (error) {
    next(error);
  }
};

export const getExperienceByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const experience = await Experience.find({ type }).sort({ order: 1, startDate: -1 });

    res.json({
      message: 'Experience fetched successfully',
      experience,
    });
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (req, res, next) => {
  try {
    const { type, title, organization, description, startDate, endDate, isCurrently, technologies } =
      req.body;

    if (!type || !title || !organization || !startDate) {
      return res.status(400).json({ message: 'Type, title, organization, and startDate are required' });
    }

    const experience = new Experience({
      type,
      title,
      organization,
      description,
      startDate,
      endDate,
      isCurrently,
      technologies,
    });

    await experience.save();

    res.status(201).json({
      message: 'Experience created successfully',
      experience,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const experience = await Experience.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json({
      message: 'Experience updated successfully',
      experience,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json({
      message: 'Experience deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default { getAllExperience, getExperienceByType, createExperience, updateExperience, deleteExperience };
