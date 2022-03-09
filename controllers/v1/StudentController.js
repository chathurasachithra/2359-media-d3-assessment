/* eslint-disable import/order */
const ResponseService = require('../../services/ResponseService');
const StudentService = require('../../services/StudentService');
const log = require('simple-node-logger').createSimpleLogger();

const StudentController = {

  /**
   * Register students under teacher
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  register: async (req, res) => {
    try {
      const result = await StudentService.register(req.body);
      log.info('StudentController register result', result);
      ResponseService.successNoContent(res);
    } catch (error) {
      log.error('StudentController register error ', error);
      ResponseService.error(res, error.message);
    }
  },

  /**
   * Get common students
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  commonStudents: async (req, res) => {
    try {
      const result = await StudentService.commonStudents(req.query);
      ResponseService.success(res, result);
    } catch (error) {
      log.error('StudentController commonStudents error ', error);
      ResponseService.error(res, error.message);
    }
  },

  /**
   * Suspend student
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  suspend: async (req, res) => {
    try {
      const result = await StudentService.suspend(req.body);
      log.info('StudentController suspend result', result);
      ResponseService.successNoContent(res);
    } catch (error) {
      log.error('StudentController suspend error ', error);
      ResponseService.error(res, error.message);
    }
  },

  /**
   * Get student list for retrieve for notifications
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  retrieveForNotifications: async (req, res) => {
    try {
      const result = await StudentService.retrieveForNotifications(req.body);
      ResponseService.success(res, result);
    } catch (error) {
      log.error('StudentController retrieveForNotifications error ', error);
      ResponseService.error(res, error.message);
    }
  }
};
module.exports = StudentController;
