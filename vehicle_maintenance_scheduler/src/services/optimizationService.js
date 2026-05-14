const depotService = require('./depotService');
const vehicleService = require('./vehicleService');
const { solveKnapsack } = require('../utils/knapsack');
const logger = require('../utils/logger');

async function getScheduleForDepot(depotId) {
    logger.info('service', `Starting optimization for depot ${depotId}`);

    let depot = await depotService.getDepotById(depotId);
    let hours = depot.MechanicHours;

    let vehicles = await vehicleService.getVehicles();

    let result = solveKnapsack(vehicles, hours);

    let output = {
        depotId: depot.ID,
        mechanicHours: hours,
        selectedTasks: result.selectedTasks,
        totalDuration: result.totalDuration,
        totalImpact: result.totalImpact
    };

    logger.info('service', `Optimization done for depot ${depot.ID}`);
    return output;
}

async function getAllSchedules() {
    logger.info('service', 'Running optimization for all depots');
    let depots = await depotService.getDepots();
    let results = [];

    for (let depot of depots) {
        let schedule = await getScheduleForDepot(depot.ID);
        results.push(schedule);
    }

    return results;
}

module.exports = { getScheduleForDepot, getAllSchedules };
