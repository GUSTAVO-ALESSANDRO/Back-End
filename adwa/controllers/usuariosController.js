const usuariosService = require('../services/usuariosService');
const chalk = require('chalk');
const cache = require('../cache/cache');

exports.createUsuario = async (req, res) => {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
        console.log(chalk.yellow(
            '[USUÁRIOS] Usuário ou senha não fornecidos.'));
        return res.status(400).json({
            error: 'Usuário e senha são obrigatórios.' });
    }
    try {
        const novoUsuario = await usuariosService.create(usuario, senha);
        const chaveCache = '"/usuarios"';
        cache.del(chaveCache);
        console.log(chalk.green('[USUÁRIOS] Usuário criado com sucesso!'));
        res.status(201).json(novoUsuario);
    } catch (error) {
        console.log(chalk.red(
            '[USUÁRIOS] Erro ao criar usuário:', error.message));
        res.status(400).json({ error: error.message });
    }
};

exports.getUsuarios = async (req, res) => {
    const chaveCache = `"${req.originalUrl}"`;
    const usuariosCache = cache.get(chaveCache);

    if (usuariosCache) {
        console.log(chalk.green('[CACHE] Usuários recuperados do cache.'));
        return res.status(200).json(usuariosCache);
    }

    try {
        const usuarios = await usuariosService.getAll();
        cache.set(chaveCache, usuarios, 30); // Cache de 30 segundos
        console.log(chalk.blue(
            '[DB] Usuários recuperados do banco e armazenados no cache.'));
        res.status(200).json(usuarios);
    } catch (error) {
        console.log(chalk.red(
            '[ERRO] Falha ao obter usuários:', error.message));
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUsuario = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        console.log(chalk.yellow(
            '[AVISO] ID do usuário não fornecido para exclusão.'));
        return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    try {
        const result = await usuariosService.delete(id);
        const chaveCache = `"${req.originalUrl}"`;
        cache.del(chaveCache.substring(0, chaveCache.lastIndexOf('/')) + '"');

        console.log(chalk.magenta(
            '[CACHE] Cache invalidado após exclusão do usuário.'));
        res.status(201).json({
            message: 'Usuário deletado com sucesso!', result });
    } catch (error) {
        console.log(chalk.red(
            '[ERRO] Falha ao excluir usuário:', error.message));
        res.status(400).json({ error: error.message });
    }
};

exports.updateUsuario = async (req, res) => {
    const { id } = req.params;
    const usuario = req.body;

    if (!usuario || !id) {
        console.log(chalk.yellow(
            '[AVISO] Usuário ou ID não fornecidos para atualização.'));
        return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    try {
        const result = await usuariosService.update(id, usuario);
        const chaveCache = '"/usuarios"';
        cache.del(chaveCache);
        console.log(chalk.magenta(
            '[CACHE] Cache invalidado após atualização do usuário.'));
        res.status(201).json({
            message: 'Usuário atualizado com sucesso!',
            result,
        });
    } catch (error) {
        console.log(chalk.red(
            '[ERRO] Falha ao atualizar usuário:', error.message));
        res.status(400).json({ error: error.message });
    }
};
