const express = require('express');
const Authorization = require('../middlewares/Authorization');

const router = express.Router();

const StudentController = require('../controllers/v1/StudentController');

router.post('/register', Authorization, StudentController.register);
router.post('/suspend', Authorization, StudentController.suspend);
router.post('/retrievefornotifications', Authorization, StudentController.retrieveForNotifications);
router.get('/commonstudents', Authorization, StudentController.commonStudents);

module.exports = router;
