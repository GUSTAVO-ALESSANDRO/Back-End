// Importa os serviços para manipulação da entidade "clientes".
const clientesService = require('../services/clientesService');

// Controlador para obter todos os clientes.
exports.getClientes = async (req, res) => {
    // Obtém todos os clientes do serviço.
    const clientes = await clientesService.getAll();
    // Retorna o cliente criado com o status 201 (Criado).
    res.json(clientes);
};

// Controlador para criar um novo cliente.
exports.createCliente = async (req, res) => {
    // Captura os dados do corpo da requisição.
    const cliente = req.body;
    // Chama o serviço para criar o cliente.
    const result = await clientesService.create(cliente);
    // Retorna o cliente criado com o status 201 (Criado).
    res.status(201).json(result);
};

// Controlador para atualizar um cliente existente.
exports.updateCliente = async (req, res) => {
    // Captura o ID do cliente a partir dos parâmetros da requisição.
    const { id } = req.params;
    // Captura os dados atualizados do corpo da requisição.
    const cliente = req.body;
    // Atualiza o cliente chamando o serviço.
    const result = await clientesService.update(id, cliente);
    // Retorna o cliente atualizado.
    res.json(result);
};

// Controlador para excluir um cliente.
exports.deleteCliente = async (req, res) => {
    // Captura o ID do cliente a partir dos parâmetros da requisição.
    const { id } = req.params;
    // Chama o serviço para excluir o cliente.
    const result = await clientesService.delete(id);
    // Retorna o resultado da operação.
    res.json(result);
};
