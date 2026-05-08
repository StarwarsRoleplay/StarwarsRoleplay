const express = require('express');
const router = express.Router();
const factionsController = require('../controllers/factionsController');

router.get('/', factionsController.getFactions);

module.exports = router;
