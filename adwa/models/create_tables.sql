-- Tabela para armazenar os clientes.
CREATE TABLE clientes (
    -- Chave primária, com incremento automático.
    id INT AUTO_INCREMENT PRIMARY KEY, 
    -- Nome do cliente, campo obrigatório.
    nome VARCHAR(255) NOT NULL, 
    -- Sobrenome do cliente, campo obrigatório.
    sobrenome VARCHAR(255) NOT NULL, 
    -- Email único para cada cliente, campo obrigatório.
    email VARCHAR(255) NOT NULL UNIQUE, 
    -- Idade do cliente, campo obrigatório.
    idade INT NOT NULL 
);

-- Tabela para armazenar os produtos.
CREATE TABLE produtos (
    -- Chave primária, com incremento automático.
    id INT AUTO_INCREMENT PRIMARY KEY, 
    -- Nome do produto, campo obrigatório.
    nome VARCHAR(255) NOT NULL, 
    -- Descrição do produto, campo opcional.
    descricao VARCHAR(500), 
     -- Preço do produto, com precisão de 10 dígitos e 2 casas decimais, campo obrigatório.
    preco DECIMAL(10, 2) NOT NULL,
    -- Timestamp atualizado automaticamente em cada modificação.
    data_atualizado DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);