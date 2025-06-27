module.exports.validarProduto = (req, res, next) => {
    const { nome, descricao, preco, dataAtualizado } = req.body;
    const erros = {};

    // Validação de nome
    if (!nome || typeof nome !== 'string' ||
            nome.length < 3 || nome.length > 255) {
        erros.nome = 'Nome deve ter entre 3 e 255 caracteres';
    }

    // Validação de descricao (agora obrigatória)
    if (!descricao || typeof descricao !== 'string' ||
            descricao.length < 3 || descricao.length > 255) {
        erros.descricao = 'Descrição é obrigatória e deve ' +
            'ter entre 3 e 255 caracteres';
    }

    // Validação de preco
    if (preco === undefined || preco === null || preco === '' ||
        isNaN(Number(preco))) {
        erros.preco = 'Preço é obrigatório e deve ser um número válido';
    } else if (Number(preco) < 0) {
        erros.preco = 'Preço deve ser um número válido maior ou igual a zero';
    }

    // Validação de data (opcional)
    if (dataAtualizado) {
        const data = new Date(dataAtualizado);
        const dataMinima = new Date('2000-01-01 00:00:00');
        const dataMaxima = new Date('2025-06-20 23:59:59');

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
