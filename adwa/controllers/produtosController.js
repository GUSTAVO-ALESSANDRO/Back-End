// Importa os serviços que contêm a lógica de negócios da entidade "produtos".
const produtosService = require('../services/produtosService');

// Controlador para obter todos os produtos.
exports.getProdutos = async (req, res) => {
    if (!req.body) {
        return res
            .status(404)
            .json({ message: 'Não foram encontrados produtos.' });
    }
    try {
        // Obtém a lista de produtos através do serviço.
        const produtos = await produtosService.getAll();
        // Retorna os produtos em formato JSON.
        res.status(200).json(produtos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para criar um novo produto.
exports.createProduto = async (req, res) => {
    // Recebe os dados do produto a partir do corpo da requisição.
    const produto = req.body;
    if (!produto) {
        return res.status(400).json({ error: 'Nenhum produto encontrado.' });
    }
    try {
        // Chama o serviço para criar o produto.
        const result = await produtosService.create(produto);
        // Retorna o produto criado com o status HTTP 201 (Criado).
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para atualizar um produto existente.
exports.updateProduto = async (req, res) => {
    // Obtém o ID do produto dos parâmetros da requisição.
    const { id } = req.params;
    // Recebe os dados atualizados do produto no corpo da requisição.
    const produto = req.body;

    if (!produto || !id) {
        return res.status(400).json({ error: 'Produto não encontrado' });
    }

    try {
        // Atualiza o produto chamando o serviço.
        const result = await produtosService.update(id, produto);
        res.status(201).json({
            message: 'Produto atualizado com sucesso!',
            result,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para deletar um produto.
exports.deleteProduto = async (req, res) => {
    // Obtém o ID do produto dos parâmetros da requisição.
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Produto não encontrado' });
    }

    try {
        // Chama o serviço para deletar o produto.
        const result = await produtosService.delete(id);
        // Retorna o resultado da operação de exclusão.
        res.status(201).json({
            message: 'Produto deletado com sucesso!',
            result,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
