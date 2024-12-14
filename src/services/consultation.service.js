const ConsultationModel = require('../models/consultation.model');
const LawyerModel = require('../models/lawyer.model');
const NotificationService = require('./notification.service');
const { CONSULTATION_STATUS } = require('../utils/constants');
const logger = require('../config/logger');

class ConsultationService {
  static async requestConsultation(clientId, consultationData) {
    try {
      // Verify lawyer exists and is available
      const lawyer = await LawyerModel.findById(consultationData.lawyerId);
      if (!lawyer) {
        throw { status: 404, message: 'Lawyer not found' };
      }

      if (!lawyer.isAvailable) {
        throw { status: 400, message: 'Lawyer is not available for consultations' };
      }

      // Create consultation request
      const consultationId = await ConsultationModel.create({
        clientId,
        ...consultationData
      });

      // Send notifications
      await NotificationService.notifyNewConsultation(lawyer.id, consultationId);

      return { consultationId };
    } catch (error) {
      logger.error('Error in requestConsultation:', error);
      throw error;
    }
  }

  static async updateConsultationStatus(consultationId, lawyerId, status) {
    const consultation = await ConsultationModel.findById(consultationId);
    
    if (!consultation) {
      throw { status: 404, message: 'Consultation not found' };
    }

    if (consultation.lawyer_id !== lawyerId) {
      throw { status: 403, message: 'Unauthorized access to consultation' };
    }

    await ConsultationModel.updateStatus(consultationId, status);
    
    // Send appropriate notifications based on status
    if (status === CONSULTATION_STATUS.SCHEDULED) {
      await NotificationService.notifyConsultationScheduled(
        consultation.client.id,
        consultationId
      );
    }

    return { success: true };
  }

  static async getLawyerConsultations(lawyerId, filters) {
    return ConsultationModel.findByLawyer(lawyerId, filters);
  }
}