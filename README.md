# Desafio Back-End Express

Este projeto utiliza diversas tecnologias como Mysql2, nodemon e outras disponiveis em packege.json.

Pré requisitos, ter o node e npm, criar as tabelas no banco de dados que estão em adwa/model/, e ativar o servidor para conexão dos dados.

Para iniciar o projeto, clone-o com 

```
git clone https://github.com/GUSTAVO-ALESSANDRO/Back-End.git
```

Logo após isso, crie o .env em adwa/ com as seguintes informações:

```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
PORT=
```

Após isso ainda em adwa/, abra o terminal e digite 

```
npm install
```

para a instalação das dependências

Logo após, inicie o projeto com

```
npm run dev
```

Arvore de arquivos do repositório

```
Pasta raiz
├── adwa
│   ├── app.js
│   ├── configs
│   │   └── db.js
│   ├── controllers
│   │   ├── clientesController.js
│   │   └── produtosController.js
│   ├── middlewares
│   │   ├── validarCliente.js
│   │   └── validarProduto.js
│   ├── models
│   │   └── create_tables.sql
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── routes
│   │   ├── clientesRoutes.js
│   │   └── produtosRoutes.js
│   ├── services
│   │   ├── clientesService.js
│   │   └── produtosService.js
│   └── views
│       └── index.jade
└── Front
    ├── adicionarCliente.html
    ├── adicionarProduto.html
    ├── atualizarCliente.html
    ├── atualizarProduto.html
    ├── clientes.html
    ├── clientes.js
    ├── home.html
    ├── produtos.html
    ├── produtos.js
    └── style.css
 
10 directories, 25 files
```
