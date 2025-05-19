# Projeto Back-End com API RESTful (e Front-End Desatualizado) - Em Desenvolvimento

Este projeto é uma API RESTful desenvolvida com Node.js e Express, que gerencia clientes e produtos, além de oferecer autenticação JWT para rotas protegidas. O back-end se integra com um banco de dados MySQL e utiliza caching (por meio do NodeCache) para melhorar a performance. A estrutura conta também com um front-end, localizado na pasta `/Front`, que foi desenvolvido anteriormente à implementação da autenticação e, por esse motivo, encontra-se desatualizado para a versão atual da API.

> **Atenção:**  
> O projeto está em fase de desenvolvimento. Sendo assim, o front-end atual (localizado na pasta `/Front`) não funciona plenamente com a nova versão do back-end que implementa autenticação JWT. Atualizações estarão disponíveis em versões futuras para integrar corretamente o fluxo de autenticação.

---

## Índice

- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Instalação](#configuração-e-instalação)
- [Execução da API](#execução-da-api)
- [Considerações sobre Autenticação](#considerações-sobre-autenticação)
- [Observações sobre o Front-End](#observações-sobre-o-front-end)
- [Testando a API](#testando-a-api)
- [Contribuição e Desenvolvimento Futuro](#contribuição-e-desenvolvimento-futuro)

---

## Descrição

Este projeto oferece:
- Endpoints para **clientes**: criação, consulta, atualização e exclusão.
- Endpoints para **produtos**: criação, consulta, atualização e exclusão.
- Endpoints para **autenticação**: login (geração de token JWT) e logout (invalidação de token).
- Middlewares de validação para garantir a integridade dos dados e middleware para verificação do JWT em acessos restritos.
- Uso de cache para otimização de performance nas requisições de clientes e produtos.

---

## Funcionalidades

- **Clientes**
  - **GET `/clientes`**: Retorna todos os clientes (proteção via token JWT e caching).
  - **POST `/clientes`**: Cria um novo cliente (dados validados).
  - **PUT `/clientes/:id`**: Atualiza um cliente existente.
  - **DELETE `/clientes/:id`**: Exclui um cliente e invalida o cache correspondente.

- **Produtos**
  - **GET `/produtos`**: Retorna todos os produtos (com caching dinâmico).
  - **POST `/produtos`**: Cria um novo produto (dados validados).
  - **PUT `/produtos/:id`**: Atualiza um produto existente.
  - **DELETE `/produtos/:id`**: Exclui um produto e invalida o cache associado.

- **Autenticação**
  - **POST `/login`**: Autentica o usuário e gera um token JWT.
  - **POST `/logout`**: Realiza o logout removendo o token do usuário.
  - **GET `/protegido`**: Rota de exemplo protegida, acessível apenas com token JWT válido.

---

## Estrutura do Projeto

O projeto está organizado em duas principais áreas:

### Back-End (Pasta `adwa`)

- **app.js**  
  Ponto de entrada do aplicativo Express e definição das rotas.

- **cache/**  
  Arquivo `cache.js` com configuração do NodeCache para armazenar dados temporariamente.

- **configs/**  
  Arquivo `db.js` que configura o pool de conexões com o MySQL.

- **controllers/**  
  Controladores para clientes, produtos, login e logout.

- **middlewares/**  
  Middlewares para:  
  - Validação dos dados de entrada (clientes e produtos)  
  - Verificação de cache antes da execução das rotas  
  - Verificação do JWT para proteger rotas.

- **models/**  
  Script SQL (`create_tables.sql`) para criação das tabelas necessárias (clientes, produtos e usuários).

- **routes/**  
  Definição dos endpoints para clientes, produtos, login, logout e rota protegida.

- **services/**  
  Lógica de negócio que interage com o banco de dados (clientes, produtos, autenticação e logout).

- **views/**  
  Exemplos de templates (por exemplo, `index.jade`).

### Front-End (Pasta `Front`)

- Contém arquivos HTML, CSS e JavaScript para uma interface de usuário.
- Páginas para gerenciamento de clientes e produtos (inclusão, atualização, listagem, etc.).
- **Atenção:** O front-end foi desenvolvido antes da implementação da autenticação JWT e, portanto, não está integrado com as proteções atualmente ativas na API. Ainda está em modo experimental.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 12 ou superior)
- [MySQL](https://www.mysql.com/)
- [npm](https://www.npmjs.com/)

---

## Configuração e Instalação

1. **Clone o Repositório**

   ```bash
   git clone https://github.com/GUSTAVO-ALESSANDRO/Back-End
   cd Back-End/adwa
   ```

2. **Crie o Arquivo `.env`**

   No diretório `adwa/`, crie um arquivo chamado `.env` com o seguinte conteúdo:

   ```env
   DB_HOST=seu_host_do_banco
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=nome_do_banco
   DB_PORT=porta_do_banco
   SECRET=sua_chave_secreta_para_jwt
   PORT=3000
   ```

   Ajuste os valores de acordo com a sua configuração local.

3. **Instale as Dependências**

   Execute o comando abaixo para instalar todas as dependências definidas no `package.json`:

   ```bash
   npm install
   ```

4. **Configuração do Banco de Dados**

   - Crie um banco de dados MySQL com o nome definido na variável `DB_NAME`.
   - Execute o script SQL localizado em `models/create_tables.sql` para criar as tabelas necessárias:

     ```sql
     SOURCE caminho/para/o/arquivo/create_tables.sql;
     ```

---

## Execução da API

Inicie o servidor em modo de desenvolvimento utilizando o [nodemon](https://nodemon.io/):

```bash
npm run dev
```

O servidor iniciará na porta definida na variável `PORT` (padrão: 3000). A API estará disponível em:

```
http://localhost:3000
```

---

## Considerações sobre Autenticação

- O back-end utiliza o JSON Web Token (JWT) para proteger as rotas sensíveis.
- Para acessar as rotas protegidas, inclua o header `x-access-token` com o token JWT obtido no endpoint `/login`.
- O endpoint `/logout` remove o token ja armazenado no banco de dados, invalidando o acesso.

---

## Observações sobre o Front-End

- A pasta `/Front` contém os arquivos que formam a interface do usuário.
- Atualmente, o front-end **não funciona** com a versão atual da API, pois foi desenvolvido sem considerar a autenticação JWT.
- A integração do front-end com os novos mecanismos de segurança (autenticação) ainda está em desenvolvimento.
- Portanto, recomenda-se testar a API utilizando ferramentas como Postman ou Insomnia para o fluxo completo de autenticação e acesso.

---

## Testando a API

Você pode testar os endpoints utilizando ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/). Exemplos:

- **Requisição de Login (POST `/login`):**

  ```json
  {
    "user": "seu_usuario",
    "password": "sua_senha"
  }
  ```

- **Acesso a Endpoints Protegidos:**

  Adicione o header:
  ```http
  x-access-token: seu_token_jwt
  ```

---

## Contribuição e Desenvolvimento Futuro

- O projeto está em fase de desenvolvimento e melhorias.  
- Atualizações futuras incluirão:
  - Integração completa entre front-end e back-end (suporte ao fluxo de autenticação no front).
  - Implementação de testes automatizados.
  - Funcionalidades adicionais, como paginação, filtros dinâmicos, dentre outras.
- Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para sugerir melhorias.
- 
---
