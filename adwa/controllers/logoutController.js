const logoutService = require('../services/logoutService');
const chalk = require('chalk');

exports.logout = async (req, res) => {
    const userId = req.userId; // Vem do middleware JWT

    if (!userId) {
        console.log(chalk.yellow(
            '[AVISO] ID do usuário não fornecido para logout.'));
        return res.status(401).json({
            mensagem: 'Token inválido ou não fornecido.' });
    }

    try {
        console.log(chalk.blue(
            '[LOGOUT] Tentativa de logout para usuário ID:', userId));
        const usuarioExiste = await logoutService.logout(userId);

        if (!usuarioExiste) {
            console.log(chalk.red(
                '[ERRO] Usuário não encontrado para logout.'));
            return res.status(404).json({
                mensagem: 'Usuário não encontrado.'});
        }

        console.log(chalk.green(
            '[SUCESSO] Logout realizado com sucesso para usuário ID:', userId));
        return res.status(200).json({
            mensagem: 'Logout realizado com sucesso.'});
    } catch (error) {
        console.log(chalk.red(
            '[ERRO] Falha ao realizar logout:', error.message));
        return res.status(500).json({ mensagem: 'Erro ao realizar logout.' });
    }
};
