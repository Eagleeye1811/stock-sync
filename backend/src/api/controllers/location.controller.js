const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createLocation = async (req, res, next) => {
  try {
    const location = await prisma.location.create({
      data: req.body
    });
    res.status(201).json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
};

exports.getLocations = async (req, res, next) => {
  try {
    const locations = await prisma.location.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.status(200).json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    next(error);
  }
};

exports.getLocation = async (req, res, next) => {
  try {
    const location = await prisma.location.findUnique({
      where: { id: req.params.id },
      include: { stockLevels: { include: { product: true } } }
    });
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }
    res.status(200).json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const location = await prisma.location.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
};

exports.deleteLocation = async (req, res, next) => {
  try {
    await prisma.location.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });
    res.status(200).json({ success: true, message: 'Location deactivated' });
  } catch (error) {
    next(error);
  }
};

