const LawyerService = require('../services/lawyer.service');
const { validate, schemas } = require('../utils/validation');
const { HTTP_STATUS } = require('../utils/constants');
const logger = require('../config/logger');

class LawyerController {
  static async createProfile(req, res, next) {
    try {
      const validatedData = validate(schemas.lawyerProfile)(req.body);
      const profile = await LawyerService.createProfile(req.user.id, validatedData);
      
      res.status(HTTP_STATUS.CREATED).json(profile);
    } catch (error) {
      logger.error('Error in createProfile controller:', error);
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const validatedData = validate(schemas.lawyerProfile)(req.body);
      const profile = await LawyerService.updateProfile(req.user.id, validatedData);
      
      res.status(HTTP_STATUS.OK).json(profile);
    } catch (error) {
      logger.error('Error in updateProfile controller:', error);
      next(error);
    }
  }

  static async getLawyerProfile(req, res, next) {
    try {
      const profile = await LawyerService.getProfile(req.params.id);
      if (!profile) {
        throw { status: HTTP_STATUS.NOT_FOUND, message: 'Lawyer profile not found' };
      }
      
      res.status(HTTP_STATUS.OK).json(profile);
    } catch (error) {
      logger.error('Error in getLawyerProfile controller:', error);
      next(error);
    }
  }

  static async searchLawyers(req, res, next) {
    try {
      const lawyers = await LawyerService.searchLawyers(req.query);
      res.status(HTTP_STATUS.OK).json(lawyers);
    } catch (error) {
      logger.error('Error in searchLawyers controller:', error);
      next(error);
    }
  }

  static async addSpecialties(req, res, next) {
    try {
      const result = await LawyerService.addSpecialties(req.user.id, req.body.specialties);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      logger.error('Error in addSpecialties controller:', error);
      next(error);
    }
  }

  static async removeSpecialty(req, res, next) {
    try {
      await LawyerService.removeSpecialty(req.user.id, req.params.specialtyId);
      res.status(HTTP_STATUS.OK).json({ message: 'Specialty removed successfully' });
    } catch (error) {
      logger.error('Error in removeSpecialty controller:', error);
      next(error);
    }
  }
}