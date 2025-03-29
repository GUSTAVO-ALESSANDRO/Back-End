/**
 * Middleware para validar os dados da entidade "Produto".
 * Garante que os campos obrigatórios sejam preenchidos corretamente.
 */

module.exports.validarProduto = (req, res, next) => {
    const { nome, descricao, preco } = req.body;

    // Verifica se "nome" está presente e se é uma string válida
    if (!nome || typeof nome !== 'string') {
        return res.status(400).json({ erro: 'Nome do produto inválido' });
    }

    // Verifica se "descricao" está presente e se é uma string válida
    if (!descricao || typeof descricao !== 'string') {
        return res.status(400).json({ erro: 'Descrição inválida' });
    }

    // Converte "preco" para número e verifica se é válido
    if (!preco || isNaN(Number(preco)) || Number(preco) <= 0) {
        return res.status(400).json(
            { erro: 'Preço deve ser um número válido e maior que zero' });
    }

    // Se todos os dados forem válidos, passa para
    //      o próximo middleware ou controller
    next();
};
