import Service from '../models/Service.js';

export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({
      message: 'Services fetched successfully',
      services,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ featured: true }).sort({ order: 1 });
    res.json({
      message: 'Featured services fetched',
      services,
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { name, description, icon, features, featured } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const service = new Service({
      name,
      description,
      icon,
      features,
      featured: featured !== undefined ? featured : true,
    });

    await service.save();

    res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default { getAllServices, getFeaturedServices, createService, updateService, deleteService };
