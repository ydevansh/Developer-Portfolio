import Project from '../models/Project.js';

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({
      message: 'Projects fetched successfully',
      projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ featured: true })
      .sort({ order: 1 })
      .limit(3);
    res.json({
      message: 'Featured projects fetched',
      projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project fetched successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { title, description, image, technologies, githubLink, deployedLink, featured } =
      req.body;

    if (!title || !description || !technologies) {
      return res.status(400).json({ message: 'Title, description, and technologies are required' });
    }

    const project = new Project({
      title,
      description,
      image,
      technologies,
      githubLink,
      deployedLink,
      featured: featured || false,
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const project = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default { getAllProjects, getFeaturedProjects, getProjectById, createProject, updateProject, deleteProject };
