const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');

router.get('/', verifyJWT, function(req, res) {
    res.send('Você acessou uma rota protegida! Seu id: ' + req.id);
});

module.exports = router;
