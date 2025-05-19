const loginService = require('../services/loginService');
const chalk = require('chalk');

exports.login = async (req, res) => {
    const { user, password } = req.body;

    if (!req.body) {
        console.log(chalk.yellow(
            '[AVISO] Nenhum dado foi enviado na requisição.'));
        return res.status(404).json({
            message: 'ERRO: Não foram encontrados dados.' });
    }

    try {
        console.log(chalk.blue(
            '[LOGIN] Tentativa de autenticação para usuário:', user));
        const token = await loginService.autenticar(user, password);
        console.log(chalk.green(
            '[SUCESSO] Autenticação realizada com sucesso! Token gerado.'));
        res.status(200).json({ auth: true, token });
    } catch (error) {
        console.log(chalk.red('[ERRO] Falha na autenticação:', error.message));
        res.status(401).json({ mensagem: error.message });
    }
};
