const express = require('express');
const authRoutes = require('./auth.routes');
const lawyerRoutes = require('./lawyer.routes');
const consultationRoutes = require('./consultation.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/lawyers', lawyerRoutes);
router.use('/consultations', consultationRoutes);

module.exports = router;