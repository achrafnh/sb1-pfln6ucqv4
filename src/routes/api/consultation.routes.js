const express = require('express');
const ConsultationController = require('../../controllers/consultation.controller');
const { verifyToken, checkRole } = require('../../middleware/auth.middleware');
const { ROLES } = require('../../utils/constants');

const router = express.Router();

// Protected routes - require authentication
router.use(verifyToken);

// Client routes
router.post(
  '/request',
  checkRole([ROLES.CLIENT]),
  ConsultationController.requestConsultation
);

// Lawyer routes
router.get(
  '/lawyer',
  checkRole([ROLES.LAWYER]),
  ConsultationController.getLawyerConsultations
);

router.patch(
  '/:consultationId/status',
  checkRole([ROLES.LAWYER]),
  ConsultationController.updateStatus
);

module.exports = router;