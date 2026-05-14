const { Log, loggingMiddleware } = require('../../../logging_middleware');

const logger = {
    info: (pkg, msg) => Log('backend', 'info', pkg, msg),
    warn: (pkg, msg) => Log('backend', 'warn', pkg, msg),
    error: (pkg, msg) => Log('backend', 'error', pkg, msg),
    debug: (pkg, msg) => Log('backend', 'debug', pkg, msg),
    fatal: (pkg, msg) => Log('backend', 'fatal', pkg, msg),
    requestLoggerMiddleware: loggingMiddleware
};

module.exports = logger;
