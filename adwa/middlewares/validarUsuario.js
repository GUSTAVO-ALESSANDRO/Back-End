module.exports.validarUsuario = (req, res, next) => {
    const { usuario, senha } = req.body;
    const erros = {};

    // Validação de usuario
    if (!usuario || typeof usuario !== 'string' ||
            usuario.length < 3 || usuario.length > 255) {
        erros.usuario = 'Usuário deve ter entre 3 e 255 caracteres';
    }

    // Validação de senha
    if (!senha || typeof senha !== 'string' ||
            senha.length < 3 || senha.length > 255) {
        erros.senha = 'Senha deve ter entre 3 e 255 caracteres';
    }

    if (Object.keys(erros).length > 0) {
        return res.status(400).json(erros);
    }

    next();
};
