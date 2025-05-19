const logoutService = require('../services/logoutService');
const chalk = require('chalk');

exports.logout = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        console.log(chalk.yellow(
            '[AVISO] ID do usuário não fornecido para logout.'));
        return res.status(400).json({
            mensagem: 'ID do usuário não fornecido.' });
    }

    try {
        console.log(chalk.blue(
            '[LOGOUT] Tentativa de logout para usuário ID:', id));
        const usuarioExiste = await logoutService.logout(id);

        if (!usuarioExiste) {
            console.log(chalk.red(
                '[ERRO] Usuário não encontrado para logout.'));
            return res.status(404).json({
                mensagem: 'Usuário não encontrado.'});
        }

        console.log(chalk.green(
            '[SUCESSO] Logout realizado com sucesso para usuário ID:', id));
        return res.status(200).json({
            mensagem: 'Logout realizado com sucesso.'});
    } catch (error) {
        console.log(chalk.red(
            '[ERRO] Falha ao realizar logout:', error.message));
        return res.status(500).json({ mensagem: 'Erro ao realizar logout.' });
    }
};
