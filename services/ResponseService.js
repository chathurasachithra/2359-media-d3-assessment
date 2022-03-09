const ResponseService = {

  /**
   * Error Response
   * @param res
   * @param error
   */
  error: (res, error) => {
    res.status(400).json({
      message: 'error',
      errorMessage: error.message,
    });
  },

  /**
   * Unauthorized Response
   * @param res
   * @param error
   */
  unauthorized: (res) => {
    res.status(401).json({
      message: 'error',
      errorMessage: 'Authentication failed! Please sign-in again',
    });
  },

  /**
   * Success Response
   * @param res
   * @param data
   */
  success: (res, data) => {
    res.status(200).json(data);
  },

  /**
   * Success no content Response
   * @param res
   * @param data
   */
  successNoContent: (res) => {
    res.status(204).json({});
  }
};

module.exports = ResponseService;
