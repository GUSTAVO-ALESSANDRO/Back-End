module.exports.validarProduto = (req, res, next) => {
    const { nome, descricao, preco, dataAtualizado } = req.body;
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

    // Validação de data
    if (!dataAtualizado) {
        erros.dataAtualizado = 'Data de atualização é obrigatória';
    } else {
        const data = new Date(dataAtualizado);
        const dataMinima = new Date('2000-01-01');
        const dataMaxima = new Date('2025-06-20');

        if (isNaN(data.getTime())) {
            erros.dataAtualizado = 'Data de atualização inválida';
        } else if (data < dataMinima || data > dataMaxima) {
            erros.dataAtualizado =
                'Data de atualização deve estar entre 01/01/2000 e 20/06/2025';
        }
    }

    if (Object.keys(erros).length > 0) {
        return res.status(400).json(erros);
    }

    next();
};
