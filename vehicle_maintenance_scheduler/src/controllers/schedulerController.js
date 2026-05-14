const optimizationService = require('../services/optimizationService');
const depotService = require('../services/depotService');
const vehicleService = require('../services/vehicleService');
const logger = require('../utils/logger');

async function getSchedule(req, res, next) {
    try {
        let depotId = req.query.depotId || 1;
        logger.info('controller', `Schedule request for depot: ${depotId}`);

        if (depotId === 'all') {
            let results = await optimizationService.getAllSchedules();
            return res.status(200).json(results);
        }

        let schedule = await optimizationService.getScheduleForDepot(depotId);
        logger.info('controller', `Schedule ready for depot ${schedule.depotId}`);
        return res.status(200).json(schedule);
    } catch (err) {
        logger.error('controller', `Schedule error: ${err.message}`);
        next(err);
    }
}

async function listDepots(req, res, next) {
    try {
        logger.info('controller', 'Fetching all depots');
        let depots = await depotService.getDepots();
        return res.status(200).json({ depots });
    } catch (err) {
        logger.error('controller', `Depot list error: ${err.message}`);
        next(err);
    }
}

async function listVehicles(req, res, next) {
    try {
        logger.info('controller', 'Fetching all vehicles');
        let vehicles = await vehicleService.getVehicles();
        return res.status(200).json({ vehicles });
    } catch (err) {
        logger.error('controller', `Vehicle list error: ${err.message}`);
        next(err);
    }
}

module.exports = { getSchedule, listDepots, listVehicles };
