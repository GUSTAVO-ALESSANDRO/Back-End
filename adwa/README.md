# Projeto ADWA

## Descrição
Aplicação para manipulação de banco de dados com tabelas de clientes e produtos.

## Estrutura do Projeto
- **configs/**: Arquivos de configuração.
- **controllers/**: Lógica de negócios.
- **middlewares/**: Validações de requisições.
- **models/**: Scripts SQL para criação de tabelas e manipulação de dados.
- **routes/**: APIs e endpoints.
- **services/**: Chamadas ao banco de dados.
- **views/**: Camada de apresentação.

## Como executar
1. Configure o arquivo `.env` com as credenciais do banco de dados.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   npm start
   ```

## Endpoints
- **GET /**: Retorna uma mensagem de boas-vindas.
- **/clientes**: Endpoints para gerenciar clientes (GET, POST, PUT, DELETE).
- **/produtos**: Endpoints para gerenciar produtos (GET, POST, PUT, DELETE).
