const express = require('express');
const router = express.Router();
const db = require('../configs/db');
const loginService = require('../services/loginService');

exports.login = async (req, res) => {
  const { user, password } = req.body;

  if (!req.body) {
    return res
        .status(404)
        .json({ message: 'ERRO: Não foram encontrados dados.' });
  }

  try {
    const token = await loginService.autenticar(user, password);
    res.status(200).json({ auth: true, token });
  } catch (error) {
    res.status(401).json({ mensagem: error.message });
  }
};