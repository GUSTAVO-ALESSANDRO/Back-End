// Importa o módulo de conexão com o banco de dados.
const db = require('../configs/db');

// Serviço para obter todos os clientes.
exports.getAll = async () => {
    // Executa uma consulta para obter todos os clientes.
    const [rows] = await db.query('SELECT * FROM clientes');
    return rows; // Retorna os dados encontrados.
};

// Serviço para criar um novo cliente.
exports.create = async (cliente) => {
    // Desestrutura os dados do cliente recebidos.
    const { nome, sobrenome, email, idade } = cliente;
    const [result] = await db.query(
        // Consulta para inserir os dados no banco.
        'INSERT INTO clientes (nome, sobrenome, email, idade)' +
            ' VALUES (?, ?, ?, ?)',
        [nome, sobrenome, email, idade],
    );
    // Retorna os dados do cliente com o ID gerado.
    return { id: result.insertId, ...cliente };
};

// Serviço para atualizar um cliente.
exports.update = async (id, cliente) => {
    // Desestrutura os dados atualizados do cliente.
    const { nome, sobrenome, email, idade } = cliente;
    const [result] = await db.query(
        // Atualiza os campos do cliente.
        'UPDATE clientes SET nome = ?, sobrenome = ?, email= ?,' +
            'idade = ? WHERE id = ?',
        // Valores fornecidos na consulta, incluindo o ID.
        [nome, sobrenome, email, idade, id],
    );
    // Retorna o número de linhas afetadas pela operação.
    return { affectedRows: result.affectedRows };
};

// Serviço para excluir um cliente.
exports.delete = async (id) => {
    // Exclui o cliente pelo ID.
    const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [id]);
    // Retorna o número de linhas afetadas pela operação.
    return { affectedRows: result.affectedRows };
};

exports.getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
    return rows[0] || null;
};
