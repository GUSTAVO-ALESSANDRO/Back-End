const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');

/*Postlogoutlisting.*/
router.post('/', logoutController.logout);

module.exports = router;