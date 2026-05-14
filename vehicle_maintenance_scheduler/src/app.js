const express = require('express');
const routes = require('./routes/schedulerRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger.requestLoggerMiddleware);

logger.info('config', 'Middleware setup done');

app.use('/api', routes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'Vehicle Maintenance Scheduler' });
});

app.use(errorHandler);

module.exports = app;
