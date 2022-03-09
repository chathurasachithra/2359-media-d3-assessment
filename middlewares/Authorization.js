const ResponseService = require('../services/ResponseService');

module.exports = async (req, res, next) => {
  try {
    // Authorize here
    next();
  } catch (error) {
    ResponseService.unauthorized(res);
  }
};
