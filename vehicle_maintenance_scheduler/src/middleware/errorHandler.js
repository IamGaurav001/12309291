const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    let code = err.status || err.statusCode || 500;
    
    logger.error('middleware', `Error caught: ${err.message}`);

    res.status(code).json({
        success: false,
        error: {
            message: code === 500 ? 'Internal Server Error' : err.message,
            code: code
        }
    });
}

module.exports = errorHandler;
