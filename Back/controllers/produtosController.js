const produtosService = require('../services/produtosService');
const cache = require('../cache/cache');
const chalk = require('chalk');

// Controlador para obter todos os produtos (com caching dinâmico)
exports.getProdutos = async (req, res) => {
    const chaveCache = `"${req.originalUrl}"`;
    const produtosCache = cache.get(chaveCache);

    if (produtosCache) {
        console.log(chalk.green('[CACHE] Produtos recuperados do cache.'));
        return res.status(200).json(produtosCache);
    }

    try {
        const produtos = await produtosService.getAll();
        cache.set(chaveCache, produtos, 30);
        console.log(chalk.blue(
            '[DB] Produtos recuperados do banco e armazenados no cache.'));
        res.status(200).json(produtos);
    } catch (error) {
        console.log(chalk.red(
            '[ERRO] Falha ao obter produtos:', error.message));
        res.status(400).json({ error: error.message });
    }
};

// Controlador para criar um novo produto (invalida o cache correspondente)
exports.createProduto = async (req, res) => {
    const produto = req.body;
    if (!produto) {
        console.log(chalk.yellow(
            '[AVISO] Nenhum produto enviado na requisição.'));
        return res.status(400).json({ error: 'Nenhum produto encontrado.' });
    }

    try {
        const result = await produtosService.create(produto);
        const chaveCache = `"${req.originalUrl}"`;
        cache.del(chaveCache);
        console.log(chalk.magenta(
            '[CACHE] Cache invalidado após criação de novo produto.'));
        res.status(201).json(result);
    } catch (error) {
        console.log(chalk.red('[ERRO] Falha ao criar produto:', error.message));
        res.status(400).json({ error: error.message });
    }
};

// Controlador para atualizar um produto existente
exports.updateProduto = async (req, res) => {
    const { id } = req.params;
    const produto = req.body;

    if (!produto || !id) {
        console.log(chalk.yellow(
            '[AVISO] Produto ou ID não fornecidos para atualização.'));
        return res.status(400).json({ error: 'Produto não encontrado' });
    }

    try {
        const result = await produtosService.update(id, produto);
        const chaveCache = `"${req.originalUrl}"`;
        cache.del(chaveCache);
        console.log(chalk.magenta(
            '[CACHE] Cache invalidado após atualização do produto.'));
        res.status(201).json({
            message: 'Produto atualizado com sucesso!',
            result,
        });
    } catch (error) {
        console.log(chalk.red(
            '[ERRO] Falha ao atualizar produto:', error.message));
        res.status(400).json({ error: error.message });
    }
};

// Controlador para deletar um produto (invalida cache dinamicamente)
exports.deleteProduto = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        console.log(chalk.yellow(
            '[AVISO] ID do produto não fornecido para exclusão.'));
        return res.status(400).json({ error: 'Produto não encontrado' });
    }

    try {
        const result = await produtosService.delete(id);
        const chaveCache = `"${req.originalUrl}"`;
        cache.del(chaveCache.substring(0, chaveCache.lastIndexOf('/'))+'"');
        console.log(chalk.magenta(
            '[CACHE] Cache invalidado após exclusão do produto.'));
        res.status(201).json({
            message: 'Produto deletado com sucesso!',
            result,
        });
    } catch (error) {
        console.log(chalk.red(
            '[ERRO] Falha ao excluir produto:', error.message));
        res.status(400).json({ error: error.message });
    }
};
