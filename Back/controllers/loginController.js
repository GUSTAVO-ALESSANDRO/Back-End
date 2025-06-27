const loginService = require('../services/loginService');
const chalk = require('chalk');

exports.login = async (req, res) => {
    const { usuario, senha } = req.body;

    if (!req.body) {
        console.log(chalk.yellow(
            '[AVISO] Nenhum dado foi enviado na requisição.'));
        return res.status(400).json({
            message: 'ERRO: Não foram encontrados dados.' });
    }

    if (!usuario || !senha) {
        console.log(chalk.yellow(
            '[AVISO] Usuário ou senha não fornecidos.'));
        return res.status(400).json({
            message: 'Usuário e senha são obrigatórios.' });
    }

    try {
        console.log(chalk.blue(
            '[LOGIN] Tentativa de autenticação para usuário:', usuario));
        const token = await loginService.autenticar(usuario, senha);
        console.log(chalk.green(
            '[SUCESSO] Autenticação realizada com sucesso! Token gerado.'));
        res.status(200).json({ auth: true, token });
    } catch (error) {
        console.log(chalk.red('[ERRO] Falha na autenticação:', error.message));
        res.status(401).json({ mensagem: error.message });
    }
};
