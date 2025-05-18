const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { validarCliente } = require('../middlewares/validarCliente');
const verifyJWT = require('../middlewares/verifyJWT');

// Rota para obter todos os clientes (método GET)
router.get('/', verifyJWT, clientesController.getClientes);

// Rota para criar um novo cliente (método POST)
router.post('/', verifyJWT, validarCliente, clientesController.createCliente);

// Rota para atualizar um cliente existente (método PUT, identificado pelo ID)
router.put('/:id', verifyJWT, validarCliente, clientesController.updateCliente);

// Rota para deletar um cliente (método DELETE, identificado pelo ID)
router.delete('/:id', verifyJWT, clientesController.deleteCliente);

module.exports = router;