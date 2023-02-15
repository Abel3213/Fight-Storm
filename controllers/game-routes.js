const router = require('express').Router();


router.get('/index.html', (req, res) => res.sendFile(__dirname + '/index.html'));



module.exports = router;