const express = require('express');
const LawyerController = require('../../controllers/lawyer.controller');
const { verifyToken, checkRole } = require('../../middleware/auth.middleware');
const { ROLES } = require('../../utils/constants');

const router = express.Router();

// Public routes
router.get('/', LawyerController.searchLawyers);
router.get('/:id', LawyerController.getLawyerProfile);

// Protected routes
router.use(verifyToken);
router.use(checkRole([ROLES.LAWYER]));

router.post('/profile', LawyerController.createProfile);
router.put('/profile', LawyerController.updateProfile);
router.post('/specialties', LawyerController.addSpecialties);
router.delete('/specialties/:specialtyId', LawyerController.removeSpecialty);

module.exports = router;