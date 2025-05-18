const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../configs/db');
require('dotenv').config();

const secret = process.env.SECRET;

exports.autenticar = async (user, password) => {
  // Busca o usuário no banco
  const [usuarios] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [user]);
  const usuario = usuarios[0];

  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  if (usuario.senha !== password) {
    throw new Error('Senha incorreta');
  }

  // Gera o token JWT
  const token = jwt.sign({ id: usuario.id }, secret, { expiresIn: 120 });

  // Atualiza o token no banco de dados
  await db.query('UPDATE usuarios SET token = ? WHERE id = ?', [token, usuario.id]);

  return token;
};