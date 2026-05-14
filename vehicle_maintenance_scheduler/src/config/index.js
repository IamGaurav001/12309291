require('dotenv').config();
const logger = require('../utils/logger');

const config = {
    port: process.env.PORT || 3000,
    baseUrl: process.env.EVALUATION_SERVICE_BASE_URL || 'http://4.224.186.213/evaluation-service',
    token: process.env.EVALUATION_TOKEN || process.env.BEARER_TOKEN || 'TRvZWq',
    env: process.env.NODE_ENV || 'development'
};

logger.info('config', `Config loaded for env: ${config.env}`);

module.exports = config;
