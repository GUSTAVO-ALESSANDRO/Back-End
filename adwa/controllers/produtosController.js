const produtosService = require('../services/produtosService');
const cache = require('../cache/cache');

// Controlador para obter todos os produtos (com caching dinâmico)
exports.getProdutos = async (req, res) => {
    const chaveCache = `"${req.originalUrl}"`; // Usa apenas a parte fixa da URL
    const produtosCache = cache.get(chaveCache);

    if (produtosCache) {
        console.log("[CACHE] Produtos recuperados do cache.");
        return res.status(200).json(produtosCache);
    }

    try {
        const produtos = await produtosService.getAll();
        cache.set(chaveCache, produtos, 30); // Armazena no cache por 30 segundos
        console.log("[DB] Produtos recuperados do banco e armazenados no cache.");
        res.status(200).json(produtos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para criar um novo produto (invalida apenas o cache relacionado)
exports.createProduto = async (req, res) => {
    const produto = req.body;
    if (!produto) {
        return res.status(400).json({ error: 'Nenhum produto encontrado.' });
    }

    try {
        const result = await produtosService.create(produto);
        const chaveCache = `"${req.originalUrl}"`;
        cache.del(chaveCache); // Invalida apenas o cache relacionado ao endpoint atual
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para atualizar um produto existente (invalida cache dinamicamente)
exports.updateProduto = async (req, res) => {
    const { id } = req.params;
    const produto = req.body;

    if (!produto || !id) {
        return res.status(400).json({ error: 'Produto não encontrado' });
    }

    try {
        const result = await produtosService.update(id, produto);
        const chaveCache = `"${req.originalUrl}"`;
        cache.del(chaveCache); // Invalida apenas o cache da rota atual
        res.status(201).json({ message: 'Produto atualizado com sucesso!', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para deletar um produto (invalida cache dinamicamente)
exports.deleteProduto = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Produto não encontrado' });
    }

    try {
        const result = await produtosService.delete(id);
        const chaveCache = `"${req.originalUrl}"`;
        cache.del(chaveCache.substring(0, chaveCache.lastIndexOf('/'))+'"'); // Invalida apenas o cache da rota atual
        res.status(201).json({ message: 'Produto deletado com sucesso!', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
