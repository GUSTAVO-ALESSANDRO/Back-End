module.exports.validarCliente = (req, res, next) => {
    const { nome, sobrenome, email, idade } = req.body;
    const erros = {};

    // Validação de nome
    if (!nome || typeof nome !== 'string' ||
            nome.length < 3 || nome.length > 255) {
        erros.nome = 'Nome deve ter entre 3 e 255 caracteres';
    }

    // Validação de sobrenome
    if (!sobrenome || typeof sobrenome !== 'string' ||
            sobrenome.length < 3 || sobrenome.length > 255) {
        erros.sobrenome = 'Sobrenome deve ter entre 3 e 255 caracteres';
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
    } else if (isNaN(Number(idade)) ||
            Number(idade) <= 0 || Number(idade) >= 120) {
        erros.idade = 'Idade deve ser um número válido entre 1 e 119';
    }

    if (Object.keys(erros).length > 0) {
        return res.status(400).json(erros);
    }

    next();
};
