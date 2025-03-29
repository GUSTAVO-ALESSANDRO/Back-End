// Importa os serviços que contêm a lógica de negócios da entidade "produtos".
const produtosService = require('../services/produtosService');

// Controlador para obter todos os produtos.
exports.getProdutos = async (req, res) => {
    // Obtém a lista de produtos através do serviço.
    const produtos = await produtosService.getAll();
    // Retorna os produtos em formato JSON.
    res.json(produtos);
};

// Controlador para criar um novo produto.
exports.createProduto = async (req, res) => {
    // Recebe os dados do produto a partir do corpo da requisição.
    const produto = req.body;
    // Chama o serviço para criar o produto.
    const result = await produtosService.create(produto);
    // Retorna o produto criado com o status HTTP 201 (Criado).
    res.status(201).json(result);
};

// Controlador para atualizar um produto existente.
exports.updateProduto = async (req, res) => {
    // Obtém o ID do produto dos parâmetros da requisição.
    const { id } = req.params;
    // Recebe os dados atualizados do produto no corpo da requisição.
    const produto = req.body;
    // Atualiza o produto chamando o serviço.
    const result = await produtosService.update(id, produto);
    // Retorna o produto atualizado.
    res.json(result);
};

// Controlador para deletar um produto.
exports.deleteProduto = async (req, res) => {
    // Obtém o ID do produto dos parâmetros da requisição.
    const { id } = req.params;
    // Chama o serviço para deletar o produto.
    const result = await produtosService.delete(id);
    // Retorna o resultado da operação de exclusão.
    res.json(result);
};
