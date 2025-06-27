const baseUrl = "http://localhost:3000";

// Adiciona a função getToken do session.js
if (typeof getToken === 'undefined') {
  function getToken() {
    return localStorage.getItem('token');
  }
}

// Carregar a lista de clientes ao iniciar a página
// Verifica se está na página de clientes antes de chamar renderizarClientes
async function checarAutenticacaoOuRedirecionar() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  try {
    const res = await fetch(`${baseUrl}/clientes`, { headers: { 'authorization': `Bearer ${token}` } });
    if (res.status !== 200) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  } catch {
    window.location.href = 'login.html';
    return false;
  }
}

if (document.getElementById("clientes-container")) {
  checarAutenticacaoOuRedirecionar().then((autenticado) => {
    if (autenticado) renderizarClientes();
  });
}

// Função para renderizar a lista de clientes
async function renderizarClientes() {
  try {
    const token = getToken();
    const response = await fetch(`${baseUrl}/clientes`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const clientes = await response.json();

    if (!response.ok)
      throw new Error(`Erro ${response.status}: ${response.statusText}`);

    const container = document.getElementById("clientes-container");

    container.innerHTML = "";

    clientes.forEach((cliente) => {
      const clienteCard = document.createElement("div");
      clienteCard.classList.add("cliente-card");

      clienteCard.innerHTML = `
                <div class="info">
                    <strong>Nome:</strong> ${cliente.nome} <br>
                    <strong>Sobrenome:</strong> ${cliente.sobrenome} <br>
                    <strong>Email:</strong> ${cliente.email} <br>
                    <strong>Idade:</strong> ${cliente.idade} <br>
                </div>
                <div class="actions">
                    <button class="editar" onclick='editarCliente(${JSON.stringify(
                      cliente
                    )})'>Editar</button>
                    <button class="excluir" onclick="confirmarExcluir(${
                      cliente.id
                    })">Excluir</button>
                </div>
            `;

      container.appendChild(clienteCard);
    });
  } catch (error) {
    alert(`Não foi possível carregar os clientes. ${error}`);
  }
}

// Função para editar cliente
async function editarCliente(cliente) {
  const id = encodeURIComponent(cliente.id);
  const nome = encodeURIComponent(cliente.nome);
  const sobrenome = encodeURIComponent(cliente.sobrenome);
  const email = encodeURIComponent(cliente.email);
  const idade = encodeURIComponent(cliente.idade);

  window.location.href = `atualizarCliente.html?id=${id}&nome=${nome}&sobrenome=${sobrenome}&email=${email}&idade=${idade}`;
}

// Função para confirmar exclusão
function confirmarExcluir(id) {
  if (!id) {
    throw new Error(`Erro ao carregar cliente: ID não encontrado.`);
  }

  if (confirm("Tem certeza que deseja excluir este cliente?")) {
    excluirCliente(id);
  }
}

// Função para excluir cliente
async function excluirCliente(id) {
  try {
    const token = getToken();
    const response = await fetch(`${baseUrl}/clientes/${id}`, {
      method: "DELETE",
      headers: { 'authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao excluir cliente: ${response.status} ${response.statusText}`
      );
    }

    alert("Cliente excluído com sucesso!");
    renderizarClientes();
  } catch (error) {
    alert(`Não foi possível excluir o cliente. ${error.message}`);
  }
}

async function criarCliente() {
  try {
    const token = getToken();
    const nome = document.getElementById("cliente-nome").value;
    const sobrenome = document.getElementById("cliente-sobrenome").value;
    const email = document.getElementById("cliente-email").value;
    const idade = document.getElementById("cliente-idade").value;

    // Limpa mensagens de erros anteriores
    document
      .querySelectorAll(".erro-msg")
      .forEach((element) => (element.innerHTML = ""));

    const response = await fetch(`${baseUrl}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome, sobrenome, email, idade }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    alert("Cliente adicionado com sucesso!");
    window.location.href = "clientes.html";
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
      const elemento = document.getElementById(`cliente-${campo}`);
      if (elemento) {
        elemento.style.fontWeight = "italic";
        elemento.style.color = "green";
      }
    };

    // Percorre os campos verificando erros, se existirem
    const campos = ["nome", "sobrenome", "email", "idade"];
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

// Função para carregar os dados do cliente na página de atualização (busca do banco)
async function carregarDadosCliente() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}/clientes/${id}`, {
        headers: { 'authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao buscar cliente');
      const cliente = await response.json();
      document.getElementById("cliente-nome").value = cliente.nome || '';
      document.getElementById("cliente-sobrenome").value = cliente.sobrenome || '';
      document.getElementById("cliente-email").value = cliente.email || '';
      document.getElementById("cliente-idade").value = cliente.idade || '';
    } catch (e) {
      alert("Erro ao buscar dados do cliente.");
    }
  } else {
    alert("Erro: Parâmetro do cliente não encontrado.");
  }
}

// Função para atualizar cliente
async function atualizarCliente() {
  try {
    const token = getToken();
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const nome = document.getElementById("cliente-nome").value;
    const sobrenome = document.getElementById("cliente-sobrenome").value;
    const email = document.getElementById("cliente-email").value;
    const idade = document.getElementById("cliente-idade").value;

    // Limpa mensagens de erros anteriores
    //document.querySelectorAll(".erro-msg").forEach((element) => (element.innerHTML = ""));

    const response = await fetch(`${baseUrl}/clientes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome, sobrenome, email, idade }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    alert("Cliente atualizado com sucesso!");
    window.location.href = "clientes.html";
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
      const elemento = document.getElementById(`cliente-${campo}`);
      if (elemento) {
        elemento.style.fontWeight = "italic";
        elemento.style.color = "green";
      }
    };

    // Percorre os campos verificando erros, se existirem
    const campos = ["nome", "sobrenome", "email", "idade"];
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

// Chama a função para carregar os dados do cliente ao carregar a página de edição
if (window.location.pathname.includes("atualizarCliente.html")) {
  carregarDadosCliente();
}
