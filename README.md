# Sistema de Gerenciamento de Clientes, Produtos e Usuários

Este projeto é uma aplicação completa composta por um **Back-End** (API RESTful com Node.js/Express, MySQL, autenticação JWT, cache e testes automatizados) e um **Front-End** (HTML, CSS, JS puro) para gerenciamento de clientes, produtos e usuários.

---

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Requisitos](#requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Executar](#como-executar)
- [Detalhes do Back-End](#detalhes-do-back-end)
  - [Rotas e Endpoints](#rotas-e-endpoints)
  - [Cache](#cache)
  - [Autenticação JWT](#autenticação-jwt)
  - [Testes Automatizados](#testes-automatizados)
- [Detalhes do Front-End](#detalhes-do-front-end)

---

## Visão Geral

O sistema permite:
- Gerenciar clientes, produtos e usuários via API RESTful.
- Proteger rotas sensíveis com autenticação JWT.
- Utilizar cache para otimizar consultas.
- Testar endpoints com scripts automatizados.
- Utilizar uma interface web para operações CRUD (clientes, produtos, usuários).

---

## Funcionalidades

- **Clientes:** CRUD completo, com validação e cache.
- **Produtos:** CRUD completo, com validação e cache.
- **Usuários:** Cadastro, autenticação (login/logout), atualização e exclusão.
- **Autenticação:** JWT para rotas protegidas.
- **Cache:** NodeCache para respostas rápidas.
- **Testes:** Testes automatizados para rotas principais.
- **Front-End:** Interface web para todas as operações.

---

## Estrutura do Projeto

```
Back-End/
│
├── Back/
│   ├── app.js                # Inicialização do Express e rotas
│   ├── server.js             # Inicialização do servidor
│   ├── package.json          # Dependências e scripts
│   ├── cache/
│   │   └── cache.js          # Configuração do NodeCache
│   ├── configs/
│   │   └── db.js             # Configuração do banco MySQL
│   ├── controllers/          # Lógica das rotas (clientes, produtos, usuários, login, logout)
│   ├── middlewares/          # Validações, autenticação JWT, cache
│   ├── models/
│   │   └── create_tables.sql # Script SQL para criar tabelas
│   ├── routes/               # Definição dos endpoints
│   ├── services/             # Lógica de negócio e acesso ao banco
│   ├── testes/               # Testes automatizados
│   └── views/                # Templates (ex: index.jade)
│
├── Front/
│   ├── *.html                # Páginas da interface
│   ├── *.js                  # Scripts de interação com a API
│   └── style.css             # Estilos
│
└── README.md                 # Este arquivo
```

---

## Requisitos

- Node.js (>= 12)
- npm
- MySQL

---

## Instalação e Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/GUSTAVO-ALESSANDRO/Back-End
   cd Back-End/Back
   ```

2. **Crie o arquivo `.env`**
   ```
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=nome_do_banco
   DB_PORT=3306
   SECRET=sua_chave_jwt
   PORT=3000
   ```

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Configure o banco de dados**
   - Crie o banco no MySQL.
   - Execute o script `models/create_tables.sql` para criar as tabelas.

---

## Como Executar

- **Back-End:**  
  Na pasta `Back`:
  ```bash
  npm run dev
  ```
  A API estará em `http://localhost:3000`.

- **Front-End:**  
  Basta abrir os arquivos HTML da pasta `Front` no navegador.  
  > **Atenção:** O front-end espera que a API esteja rodando em `localhost:3000`.

---

## Detalhes do Back-End

### Rotas e Endpoints

#### Clientes (`/clientes`)
- `GET /clientes` - Lista todos (protegido, usa cache)
- `GET /clientes/:id` - Detalha um cliente (protegido)
- `POST /clientes` - Cria cliente (protegido, validação)
- `PUT /clientes/:id` - Atualiza cliente (protegido, validação)
- `DELETE /clientes/:id` - Remove cliente (protegido, invalida cache)

#### Produtos (`/produtos`)
- `GET /produtos` - Lista todos (protegido, usa cache)
- `GET /produtos/:id` - Detalha um produto (protegido)
- `POST /produtos` - Cria produto (protegido, validação)
- `PUT /produtos/:id` - Atualiza produto (protegido, validação)
- `DELETE /produtos/:id` - Remove produto (protegido, invalida cache)

#### Usuários (`/usuarios`)
- `GET /usuarios` - Lista todos (protegido)
- `GET /usuarios/:id` - Detalha usuário (protegido)
- `POST /usuarios` - Cria usuário (validação)
- `PUT /usuarios/:id` - Atualiza usuário (protegido, validação)
- `DELETE /usuarios/:id` - Remove usuário (protegido)

#### Autenticação
- `POST /login` - Login, retorna JWT
- `POST /logout` - Logout, invalida JWT
- `GET /protegido` - Exemplo de rota protegida

### Cache

- Implementado com NodeCache.
- Respostas de listagem de clientes e produtos são armazenadas em cache para acelerar requisições.
- Cache é invalidado automaticamente em operações de criação, atualização ou exclusão.

### Autenticação JWT

- Usuário faz login e recebe um token JWT.
- Rotas protegidas exigem o header `Authorization: Bearer <token>`.
- O middleware `verifyJWT` valida o token em cada requisição protegida.
- Logout remove o token do banco/cache, invalidando o acesso.

### Testes Automatizados

- Testes para rotas de clientes, produtos, usuários e autenticação.
- Localizados em `Back/testes/`.
- Para rodar:
  ```bash
  npm test
  ```

---

## Detalhes do Front-End

- **clientes.html / clientes.js:**  
  Lista, adiciona, edita e remove clientes. Usa autenticação JWT.  
- **produtos.html / produtos.js:**  
  Lista, adiciona, edita e remove produtos.  
- **usuarios.html / usuarios.js:**  
  Lista, adiciona, edita e remove usuários.  
- **login.html:**  
  Tela de login, armazena token JWT no localStorage.  
- **logout.html:**  
  Realiza logout, remove token do localStorage.  
- **session.js:**  
  Gerencia sessão do usuário (token).  
- **style.css:**  
  Estilização das páginas.

> **Observação:** O front-end depende do back-end estar rodando e do fluxo de autenticação JWT.
