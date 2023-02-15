const router = require('express').Router();

const homeRoutes = require('./home-routes.js');

const gameRoutes = require('./game-routes.js');

router.use('/', homeRoutes);

router.use('/fightStorm', gameRoutes);

module.exports = router;