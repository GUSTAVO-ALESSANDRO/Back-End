const baseUrl = "http://localhost:3000";

// Carregar a lista de produtos ao iniciar a página
// Verifica se está na página de produtos antes de chamar renderizarProdutos
if (document.getElementById("produtos-container")) {
  renderizarProdutos();
}

// Função para formatar a data no formato dd/mm/aaaa hh:mm
function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

// Função para renderizar a lista de produtos
async function renderizarProdutos() {
  try {
    const response = await fetch(`${baseUrl}/produtos`);
    const produtos = await response.json();

    if (!response.ok)
      throw new Error(`Erro ${response.status}: ${response.statusText}`);

    const container = document.getElementById("produtos-container");

    container.innerHTML = "";

    produtos.forEach((produto) => {
      const produtoCard = document.createElement("div");
      produtoCard.classList.add("produto-card");

      produtoCard.innerHTML = `
                <div class="info">
                    <strong>Nome:</strong> ${produto.nome} <br>
                    <strong>Descrição:</strong> ${produto.descricao} <br>
                    <strong>Preço:</strong> R$ ${produto.preco} <br>
                    <strong>Última Atualização:</strong> ${formatarData(produto.dataAtualizado)} <br>
                </div>
                <div class="actions">
                    <button class="editar" onclick='editarProduto(${JSON.stringify(
                      produto
                    )})'>Editar</button>
                    <button class="excluir" onclick="confirmarExcluir(${
                      produto.id
                    })">Excluir</button>
                </div>
            `;

      container.appendChild(produtoCard);
    });
  } catch (error) {
    alert(`Não foi possível carregar os produtos. ${error}`);
  }
}

// Função para editar produto
async function editarProduto(produto) {
  const id = encodeURIComponent(produto.id);
  const nome = encodeURIComponent(produto.nome);
  const descricao = encodeURIComponent(produto.descricao);
  const preco = encodeURIComponent(produto.preco);

  window.location.href = `atualizarProduto.html?id=${id}&nome=${nome}&descricao=${descricao}&preco=${preco}`;
}

// Função para confirmar exclusão
function confirmarExcluir(id) {
  if (!id) {
    throw new Error(`Erro ao carregar produto: ID não encontrado.`);
  }

  if (confirm("Tem certeza que deseja excluir este produto?")) {
    excluirProduto(id);
  }
}

// Função para excluir produto
async function excluirProduto(id) {
  try {
    const response = await fetch(`${baseUrl}/produtos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao excluir produto: ${response.status} ${response.statusText}`
      );
    }

    alert("Produto excluído com sucesso!");
    renderizarProdutos();
  } catch (error) {
    alert(`Não foi possível excluir o produto. ${error.message}`);
  }
}

async function criarProduto() {
  try {
    const nome = document.getElementById("produto-nome").value;
    const descricao = document.getElementById("produto-descricao").value;
    const preco = document.getElementById("produto-preco").value;

    // Limpa mensagens de erros anteriores
    document
      .querySelectorAll(".erro-msg")
      .forEach((element) => (element.innerHTML = ""));

    const response = await fetch(`${baseUrl}/produtos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, descricao, preco }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    alert("Produto adicionado com sucesso!");
    window.location.href = "produtos.html";
  } catch (error) {
    const detalhesErro = JSON.parse(error.message);
    const mensagem = Object.entries(detalhesErro)
      .map(([campo, msg]) => `${msg}`)
      .join(`\n`);
    alert(mensagem);

    // Aplica estilos para erro
    const formataErro = (campo, mensagem) => {
      const elementoErro = document.getElementById(`erro-${campo}`);
      if (elementoErro) {
        elementoErro.innerText = mensagem;
      }
    };

    // Aplica estilos para sucesso
    const formataAcerto = (campo) => {
      const elemento = document.getElementById(`produto-${campo}`);
      if (elemento) {
        elemento.style.fontWeight = "italic";
        elemento.style.color = "green";
      }
    };

    // Percorre os campos verificando erros, se existirem
    const campos = ["nome", "descricao", "preco"];
    campos.forEach((campo) => {
      if (detalhesErro?.[campo]) {
        // Verifica se o erro existe antes de acessar
        formataErro(campo, detalhesErro[campo]);
      } else {
        formataAcerto(campo);
      }
    });
  }
}

// Função para carregar os dados do produto na página de atualização
async function carregarDadosProduto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const nome = params.get("nome");
  const descricao = params.get("descricao");
  const preco = params.get("preco");

  // Preenche os campos do formulário com os dados do produto
  if (id && nome && descricao && preco) {
    document.getElementById("produto-nome").value = decodeURIComponent(nome);
    document.getElementById("produto-descricao").value =
      decodeURIComponent(descricao);
    document.getElementById("produto-preco").value = decodeURIComponent(preco);
  } else {
    alert("Erro: Parâmetros do produto não encontrados.");
  }
}
// Função para atualizar produto
async function atualizarProduto() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const nome = document.getElementById("produto-nome").value;
    const descricao = document.getElementById("produto-descricao").value;
    const preco = document.getElementById("produto-preco").value;

    // Limpa mensagens de erros anteriores
    //document.querySelectorAll(".erro-msg").forEach((element) => (element.innerHTML = ""));

    const response = await fetch(`${baseUrl}/produtos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, descricao, preco }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    alert("Produto atualizado com sucesso!");
    window.location.href = "produtos.html";
  } catch (error) {
    const detalhesErro = JSON.parse(error.message);
    const mensagem = Object.entries(detalhesErro)
      .map(([campo, msg]) => `${msg}`)
      .join(`\n`);
    alert(mensagem);

    // Aplica estilos para erro
    const formataErro = (campo, mensagem) => {
      const elementoErro = document.getElementById(`erro-${campo}`);
      if (elementoErro) {
        elementoErro.innerText = mensagem;
      }
    };

    // Aplica estilos para sucesso
    const formataAcerto = (campo) => {
      const elemento = document.getElementById(`produto-${campo}`);
      if (elemento) {
        elemento.style.fontWeight = "italic";
        elemento.style.color = "green";
      }
    };

    // Percorre os campos verificando erros, se existirem
    const campos = ["nome", "descricao", "preco"];
    campos.forEach((campo) => {
      if (detalhesErro?.[campo]) {
        // Verifica se o erro existe antes de acessar
        formataErro(campo, detalhesErro[campo]);
      } else {
        formataAcerto(campo);
      }
    });
  }
}

// Chama a função para carregar os dados do produto ao carregar a página de edição
if (window.location.pathname.includes("atualizarProduto.html")) {
  carregarDadosProduto();
}

