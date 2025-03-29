/**
 * Middleware para validar os dados da entidade "Cliente".
 * Garante que os campos obrigatórios sejam preenchidos corretamente.
 */

module.exports.validarCliente = (req, res, next) => {
    const { nome, sobrenome, email, idade } = req.body;

    // Verifica se "nome" está presente e se é uma string válida
    if (!nome || typeof nome !== 'string') {
        return res.status(400).json({ erro: 'Nome inválido' });
    }

    // Verifica se "sobrenome" está presente e se é uma string válida
    if (!sobrenome || typeof sobrenome !== 'string') {
        return res.status(400).json({ erro: 'Sobrenome inválido' });
    }

    // Valida o formato do e-mail usando uma expressão regular
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ erro: 'E-mail inválido' });
    }

    // Converte "idade" para número e verifica se é válido
    if (!idade || isNaN(Number(idade)) || Number(idade) <= 0) {
        return res.status(400).json(
            { erro: 'Idade deve ser um número válido e maior que zero' });
    }

    // Se todos os dados forem válidos, passa para
    // o próximo middleware ou controller
    next();
};
