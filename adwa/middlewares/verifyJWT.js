const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;

// Necessario para o lint:
/**
 * Middleware para validar JWT.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @param {Function} next - Função para passar para o próximo middleware.
 * @return {void} Não retorna um valor explícito.
 */
function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).end();

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();
        req.id = decoded.id;
        next();
    });
}

module.exports = verifyJWT;
