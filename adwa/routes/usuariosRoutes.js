// routes/usuariosRoutes.js

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const verifyJWT = require('../middlewares/verifyJWT');
const { cacheMiddlewares } = require('../middlewares/cacheMiddleware');

// Rota para criar um novo usuário
router.post('/', usuariosController.createUsuario);

router.get('/', verifyJWT, cacheMiddlewares, usuariosController.getUsuarios);

module.exports = router;
