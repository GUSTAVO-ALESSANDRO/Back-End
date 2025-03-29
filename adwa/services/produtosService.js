// Importa o módulo de conexão com o banco de dados.
const db = require('../configs/db');

// Serviço para obter todos os produtos.
exports.getAll = async () => {
    // Executa a consulta para obter todos os produtos.
    const [rows] = await db.query('SELECT * FROM produtos');
    return rows; // Retorna os dados encontrados.
};

// Serviço para criar um novo produto.
exports.create = async (produto) => {
    // Desestrutura os dados do produto recebido.
    const { nome, descricao, preco } = produto;
    const [result] = await db.query(
        // Insere os dados do produto no banco.
        'INSERT INTO produtos (nome, descricao, preco) VALUES (?, ?, ?)',
        [nome, descricao, preco], // Valores fornecidos à consulta.
    );
    // Retorna os dados do produto com o ID gerado.
    return { id: result.insertId, ...produto };
};

// Serviço para atualizar um produto existente.
exports.update = async (id, produto) => {
    // Desestrutura os dados atualizados do produto.
    const { nome, descricao, preco } = produto;
    const [result] = await db.query(
        // Atualiza os dados do produto no banco.
        'UPDATE produtos SET nome = ?, descricao = ?, preco = ? WHERE id = ?',
        // Valores fornecidos à consulta, incluindo o ID.
        [nome, descricao, preco, id],
    );
    // Retorna o número de linhas afetadas.
    return { affectedRows: result.affectedRows };
};

// Serviço para excluir um produto.
exports.delete = async (id) => {
    // Exclui o produto pelo ID.
    const [result] = await db.query('DELETE FROM produtos WHERE id = ?', [id]);
    // Retorna o número de linhas afetadas pela operação.
    return { affectedRows: result.affectedRows };
};
