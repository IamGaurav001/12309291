const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const server = app.listen(config.port, () => {
    logger.info('config', `Server running on port ${config.port}`);
});

process.on('SIGTERM', () => {
    logger.warn('config', 'SIGTERM received, shutting down...');
    server.close(() => {
        logger.info('config', 'Server closed');
        process.exit(0);
    });
});

process.on('unhandledRejection', (reason) => {
    logger.fatal('config', `Unhandled rejection: ${reason}`);
});
