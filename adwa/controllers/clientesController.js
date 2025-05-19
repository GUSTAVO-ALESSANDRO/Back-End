const clientesService = require('../services/clientesService');
const cache = require('../cache/cache');

const chalk = require('chalk');

// Controlador para obter todos os clientes
exports.getClientes = async (req, res) => {
    const chaveCache = `"${req.originalUrl}"`;
    const clientesCache = cache.get(chaveCache);

    if (clientesCache) {
        console.log(chalk.green("[CACHE] Clientes recuperados do cache."));
        return res.status(200).json(clientesCache);
    }

    try {
        const clientes = await clientesService.getAll();
        cache.set(chaveCache, clientes, 30);
        console.log(chalk.red("[DB] Clientes recuperados do banco e armazenados no cache."));
        res.status(200).json(clientes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para criar um novo cliente
exports.createCliente = async (req, res) => {
    const cliente = req.body;
    if (!cliente) {
        return res.status(400).json({ error: 'Nenhum cliente encontrado.' });
    }

    try {
        const result = await clientesService.create(cliente);
        const chaveCache = `"${req.originalUrl}"`;
        cache.del(chaveCache);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para atualizar um cliente existente
exports.updateCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = req.body;

    if (!cliente || !id) {
        return res.status(400).json({ error: 'Cliente não encontrado' });
    }

    try {
        const result = await clientesService.update(id, cliente);
        const chaveCache = `"${req.originalUrl}"`;
        cache.del(chaveCache);
        res.status(201).json({
            message: 'Cliente atualizado com sucesso!',
            result,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para excluir um cliente
exports.deleteCliente = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Cliente não encontrado' });
    }

    try {
        const result = await clientesService.delete(id);
        const chaveCache = `"${req.originalUrl}"`;
        cache.del(chaveCache.substring(0, chaveCache.lastIndexOf('/'))+'"');
        res.status(201).json({
            message: 'Cliente deletado com sucesso!',
            result,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
