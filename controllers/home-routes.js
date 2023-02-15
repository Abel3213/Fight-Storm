const router = require('express').Router();


router.get('/game.html', (req, res) => res.sendFile(__dirname + '/game.html'));



module.exports = router;