const express = require('express');
const router = express.Router(); // Cria um roteador para gerenciar as rotas.
// Importa o controlador de clientes.
const clientesController = require('../controllers/clientesController');
// Importa o middleware de validação
const { validarCliente } = require('../middlewares/validarCliente');

// Rota para obter todos os clientes (método GET)
router.get('/', clientesController.getClientes);

// Rota para criar um novo cliente (método POST)
router.post('/', validarCliente, clientesController.createCliente);

// Rota para atualizar um cliente existente (método PUT, identificado pelo ID)
router.put('/:id', validarCliente, clientesController.updateCliente);

// Rota para deletar um cliente (método DELETE, identificado pelo ID)
router.delete('/:id', clientesController.deleteCliente);

// Exporta o roteador para ser usado na configuração principal da aplicação.
module.exports = router;
