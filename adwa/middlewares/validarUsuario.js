module.exports.validarUsuario = (req, res, next) => {
    const { usuario, senha } = req.body;
    const erros = {};

    // Validação de usuario
    if (!usuario || typeof usuario !== 'string' ||
            usuario.length < 3 || usuario.length > 255) {
        erros.usuario = 'Usuário deve ter entre 3 e 255 caracteres';
    }

    // Validação de senha (apenas se for criação de usuário)
    if (!senha || typeof senha !== 'string' ||
            senha.length < 3 || senha.length > 255) {
        erros.senha = 'Senha deve ter entre 3 e 255 caracteres';
    }

    if (Object.keys(erros).length > 0) {
        return res.status(400).json(erros);
    }

    next();
};

module.exports.validarAtualizacaoUsuario = (req, res, next) => {
    const { usuario, senhaAntiga, senhaNova } = req.body;
    const erros = {};

    // Validação de usuario
    if (!usuario || typeof usuario !== 'string' ||
            usuario.length < 3 || usuario.length > 255) {
        erros.usuario = 'Usuário deve ter entre 3 e 255 caracteres';
    }

    // Validação de senha antiga (apenas se for alterar senha)
    if (senhaNova && (!senhaAntiga || typeof senhaAntiga !== 'string' ||
            senhaAntiga.length < 3 || senhaAntiga.length > 255)) {
        erros['senha-antiga'] = 'Senha atual deve ter entre 3 e 255 caracteres';
    }

    // Validação de senha nova (apenas se for alterar senha)
    if (senhaNova && (!senhaNova || typeof senhaNova !== 'string' ||
            senhaNova.length < 3 || senhaNova.length > 255)) {
        erros['senha-nova'] = 'Nova senha deve ter entre 3 e 255 caracteres';
    }

    if (Object.keys(erros).length > 0) {
        return res.status(400).json(erros);
    }

    next();
};
