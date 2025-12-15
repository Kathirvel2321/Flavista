import Area from '../models/Area.js';

/**
 * Middleware to validate and attach area to request
 * Looks for areaName or areaId in query params
 */
export const areaMiddleware = async (req, res, next) => {
  try {
    const { areaName, areaId, area } = req.query;

    if (areaName || areaId) {
      let foundArea;

      if (areaId) {
        foundArea = await Area.findById(areaId);
      } else if (areaName) {
        foundArea = await Area.findOne({ name: new RegExp(`^${areaName}$`, 'i') });
      }

      if (foundArea) {
        req.area = foundArea;
        req.areaId = foundArea._id;
      }
    }

    next();
  } catch (error) {
    console.error('Area middleware error:', error.message);
    // Continue without area if error occurs
    next();
  }
};
