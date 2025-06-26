// routes/usuariosRoutes.js

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const verifyJWT = require('../middlewares/verifyJWT');
const { cacheMiddlewares } = require('../middlewares/cacheMiddleware');
const { validarUsuario } = require('../middlewares/validarUsuario');

// Rota para criar um novo usuário
router.post('/', validarUsuario, usuariosController.createUsuario);

router.get('/', verifyJWT, cacheMiddlewares, usuariosController.getUsuarios);

// Rota para deletar um usuário (método DELETE, identificado pelo ID)
router.delete('/:id', verifyJWT, usuariosController.deleteUsuario);

// Rota para atualizar um usuário existente (método PUT, identificado pelo ID)
router.put('/:id', verifyJWT, validarUsuario, usuariosController.updateUsuario);

module.exports = router;
