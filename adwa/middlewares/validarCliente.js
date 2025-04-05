module.exports.validarCliente = (req, res, next) => {
    const { nome, sobrenome, email, idade } = req.body;
    const erros = {};

    // Validação de nome
    if (!nome || typeof nome !== 'string') {
        erros.nome = 'Nome inválido';
    }

    // Validação de sobrenome
    if (!sobrenome || typeof sobrenome !== 'string') {
        erros.sobrenome = 'Sobrenome inválido';
    }

    // Validação de email
    if (!email) {
        erros.email = 'E-mail é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        erros.email = 'E-mail inválido';
    }

    // Validação de idade
    if (!idade) {
        erros.idade = 'Idade é obrigatória';
    } else if (isNaN(Number(idade)) || Number(idade) <= 0) {
        erros.idade = 'Idade deve ser um número válido e maior que zero';
    }

    if (Object.keys(erros).length > 0) {
        return res.status(400).json(erros);
    }

    next();
};
