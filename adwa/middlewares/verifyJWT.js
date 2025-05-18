const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;

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