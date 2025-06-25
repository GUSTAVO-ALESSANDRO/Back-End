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
    const { nome, descricao, preco, dataAtualizado } = produto;
    let query;
    let params;
    if (dataAtualizado) {
        query = 'INSERT INTO produtos '+
            '(nome, descricao, preco, dataAtualizado) VALUES (?, ?, ?, ?)';
        params = [nome, descricao, preco, dataAtualizado];
    } else {
        query = 'INSERT INTO produtos ' +
            '(nome, descricao, preco) VALUES (?, ?, ?)';
        params = [nome, descricao, preco];
    }
    const [result] = await db.query(query, params);
    return { id: result.insertId, ...produto };
};

// Serviço para atualizar um produto existente.
exports.update = async (id, produto) => {
    const { nome, descricao, preco, dataAtualizado } = produto;
    let query;
    let params;
    if (dataAtualizado) {
        query = 'UPDATE produtos SET nome = ?, descricao = ?, ' +
            'preco = ?, dataAtualizado = ? WHERE id = ?';
        params = [nome, descricao, preco, dataAtualizado, id];
    } else {
        query = 'UPDATE produtos SET nome = ?, ' +
            'descricao = ?, preco = ? WHERE id = ?';
        params = [nome, descricao, preco, id];
    }
    const [result] = await db.query(query, params);
    return { affectedRows: result.affectedRows };
};

// Serviço para excluir um produto.
exports.delete = async (id) => {
    const [result] = await db.query('DELETE FROM produtos WHERE id = ?', [id]);
    return { affectedRows: result.affectedRows };
};
