const express = require('express');

const {indexRender} = require('../controllers/indexController')
const logginRouter = require('./administrador');

const router = express.Router();

router.get('/', indexRender);

router.use('/loggin', logginRouter);

module.exports = router;