const express = require('express');
const controller = require('../controllers/schedulerController');
const logger = require('../utils/logger');

const router = express.Router();

logger.info('route', 'Setting up API routes');

router.get('/schedule', controller.getSchedule);
router.get('/depots', controller.listDepots);
router.get('/vehicles', controller.listVehicles);

module.exports = router;
