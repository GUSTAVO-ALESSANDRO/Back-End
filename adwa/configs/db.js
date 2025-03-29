// Importa o módulo mysql2 para realizar conexões com o banco de dados.
const mysql = require('mysql2');
// Carrega as variáveis de ambiente definidas no
//      arquivo .env para uso seguro e dinâmico.
require('dotenv').config();

// Cria um pool de conexões ao banco de dados.
const pool = mysql.createPool({
    // O endereço do servidor do banco de dados,
    //  definido na variável de ambiente DB_HOST.
    host: process.env.DB_HOST,
    // O nome de usuário para acessar o banco,
    //  configurado na variável DB_USER.
    user: process.env.DB_USER,
    // A senha do usuário para o banco de dados, armazenada em DB_PASSWORD.
    password: process.env.DB_PASSWORD,
    // O nome do banco de dados que será utilizado, definido em DB_NAME.
    database: process.env.DB_NAME,
});

// Exporta o pool de conexões como uma promessa para
//      usar async/await nas operações de banco de dados.
module.exports = pool.promise();
