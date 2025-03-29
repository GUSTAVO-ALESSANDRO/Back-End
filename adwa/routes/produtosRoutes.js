const express = require('express');
const router = express.Router(); // Cria um roteador para gerenciar as rotas.
// Importa o controlador de produtos.
const produtosController = require('../controllers/produtosController');
// Importa o middleware de validação
const { validarProduto } = require('../middlewares/validarProduto');

// Rota para obter todos os produtos (método GET)
router.get('/', produtosController.getProdutos);

// Rota para criar um novo produto (método POST)
router.post('/', validarProduto, produtosController.createProduto);

// Rota para atualizar um produto existente (método PUT, identificado pelo ID)
router.put('/:id', validarProduto, produtosController.updateProduto);

// Rota para deletar um produto (método DELETE, identificado pelo ID)
router.delete('/:id', produtosController.deleteProduto);

// Exporta o roteador para ser usado na configuração principal da aplicação.
module.exports = router;
