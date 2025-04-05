module.exports.validarProduto = (req, res, next) => {
    const { nome, descricao, preco, } = req.body;
    const erros = {};

    // Validação de nome
    if (!nome || typeof nome !== 'string') {
        erros.nome = 'Nome inválido';
    }

    // Validação de descricao
    if (!descricao || typeof descricao !== 'string') {
        erros.descricao = 'Descrição inválida';
    }

    // Validação de preco
    if (!preco) {
        erros.preco = 'Preço é obrigatório';
    } else if (isNaN(Number(preco)) || Number(preco) <= 0) {
        erros.preco = 'Preço deve ser um número válido e maior que zero';
    }

    if (Object.keys(erros).length > 0) {
        return res.status(400).json(erros);
    }

    next();
};
