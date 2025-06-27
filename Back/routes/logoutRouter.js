const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/', verifyJWT, logoutController.logout);

module.exports = router;
