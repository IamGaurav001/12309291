const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

const sampleDepots = [
    { ID: 1, MechanicHours: 60 },
    { ID: 2, MechanicHours: 135 },
    { ID: 3, MechanicHours: 188 },
    { ID: 4, MechanicHours: 97 },
    { ID: 5, MechanicHours: 164 }
];

async function getDepots() {
    let url = `${config.baseUrl}/depots`;
    logger.info('service', `Fetching depots from: ${url}`);

    try {
        let res = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${config.token}` },
            timeout: 5000
        });
        logger.info('service', `Got ${res.data?.depots?.length || 0} depots from API`);
        return res.data.depots || sampleDepots;
    } catch (err) {
        logger.warn('service', `Depot API failed (${err.message}), using local data`);
        return sampleDepots;
    }
}

async function getDepotById(id) {
    let depots = await getDepots();
    let depotId = parseInt(id, 10);
    let found = depots.find(d => d.ID === depotId);
    if (!found) {
        logger.warn('service', `Depot ${depotId} not found, using first depot`);
        return depots[0];
    }
    return found;
}

module.exports = { getDepots, getDepotById };
