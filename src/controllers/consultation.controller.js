const ConsultationService = require('../services/consultation.service');
const { validate, schemas } = require('../utils/validation');
const { HTTP_STATUS } = require('../utils/constants');
const logger = require('../config/logger');

class ConsultationController {
  static async requestConsultation(req, res, next) {
    try {
      const validatedData = validate(schemas.consultation)(req.body);
      const result = await ConsultationService.requestConsultation(
        req.user.id,
        validatedData
      );
      
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      logger.error('Error in requestConsultation controller:', error);
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { consultationId } = req.params;
      const { status } = req.body;

      const result = await ConsultationService.updateConsultationStatus(
        consultationId,
        req.user.id,
        status
      );
      
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      logger.error('Error in updateStatus controller:', error);
      next(error);
    }
  }

  static async getLawyerConsultations(req, res, next) {
    try {
      const consultations = await ConsultationService.getLawyerConsultations(
        req.user.id,
        req.query
      );
      
      res.status(HTTP_STATUS.OK).json(consultations);
    } catch (error) {
      logger.error('Error in getLawyerConsultations controller:', error);
      next(error);
    }
  }
}