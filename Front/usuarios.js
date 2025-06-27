const baseUrl = "http://localhost:3000";

if (typeof getToken === 'undefined') {
  function getToken() {
    return localStorage.getItem('token');
  }
}

// Checa autenticação antes de renderizar usuários
async function checarAutenticacaoOuRedirecionar() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  try {
    const res = await fetch(`${baseUrl}/usuarios`, { headers: { 'authorization': `Bearer ${token}` } });
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

if (document.getElementById("usuarios-container")) {
  checarAutenticacaoOuRedirecionar().then((autenticado) => {
    if (autenticado) renderizarUsuarios();
  });
}

// Renderiza lista de usuários
async function renderizarUsuarios() {
  try {
    const token = getToken();
    const response = await fetch(`${baseUrl}/usuarios`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const usuarios = await response.json();

    if (!response.ok)
      throw new Error(`Erro ${response.status}: ${response.statusText}`);

    const container = document.getElementById("usuarios-container");
    container.innerHTML = "";

    usuarios.forEach((usuario) => {
      const usuarioCard = document.createElement("div");
      usuarioCard.innerHTML = `
        <div class="info">
          <strong>Nome de Usuário:</strong> ${usuario.usuario ? usuario.usuario : '(Sem nome)'}
        </div>
        <div class="actions">
          <button class="editar" onclick='editarUsuario(${JSON.stringify(usuario)})'>Editar</button>
          <button class="excluir" onclick="confirmarExcluir(${usuario.id})">Excluir</button>
        </div>
      `;
      container.appendChild(usuarioCard);
    });
  } catch (error) {
    alert(`Não foi possível carregar os usuários. ${error}`);
  }
}

// Editar usuário: passa o objeto para garantir o nome
function editarUsuario(usuario) {
  const id = encodeURIComponent(usuario.id);
  window.location.href = `atualizarUsuario.html?id=${id}`;
}

// Confirma exclusão
function confirmarExcluir(id) {
  if (!id) {
    throw new Error(`Erro ao carregar usuário: ID não encontrado.`);
  }
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    excluirUsuario(id);
  }
}

// Excluir usuário
async function excluirUsuario(id) {
  try {
    const token = getToken();
    const response = await fetch(`${baseUrl}/usuarios/${id}`, {
      method: "DELETE",
      headers: { 'authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      throw new Error(`Erro ao excluir usuário: ${response.status} ${response.statusText}`);
    }
    alert("Usuário excluído com sucesso!");
    renderizarUsuarios();
  } catch (error) {
    alert(`Não foi possível excluir o usuário. ${error.message}`);
  }
}

// Criar usuário
async function criarUsuario() {
  try {
    const usuario = document.getElementById("usuario-usuario").value;
    const senha = document.getElementById("usuario-senha").value;
    document.querySelectorAll(".erro-msg").forEach((element) => (element.innerHTML = ""));
    const response = await fetch(`${baseUrl}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }
    alert("Usuário adicionado com sucesso!");
    window.location.href = "usuarios.html";
  } catch (error) {
    let detalhesErro = {};
    try { detalhesErro = JSON.parse(error.message); } catch {}
    const mensagem = Object.entries(detalhesErro)
      .map(([campo, msg]) => `${msg}`)
      .join(`\n`);
    alert(mensagem);
    const formataErro = (campo, mensagem) => {
      const elementoErro = document.getElementById(`erro-${campo}`);
      if (elementoErro) {
        elementoErro.innerText = mensagem;
      }
    };
    const campos = ["usuario", "senha"];
    campos.forEach((campo) => {
      if (detalhesErro?.[campo]) {
        formataErro(campo, detalhesErro[campo]);
      }
    });
  }
}

// Carregar dados do usuário na página de atualização (busca do banco)
async function carregarDadosUsuario() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}/usuarios/${id}`, {
        headers: { 'authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao buscar usuário');
      const usuario = await response.json();
      document.getElementById("usuario-usuario").value = usuario.usuario || '';
    } catch (e) {
      alert("Erro ao buscar dados do usuário.");
    }
  } else {
    alert("Erro: Parâmetro do usuário não encontrado.");
  }
}

// Atualizar usuário
async function atualizarUsuario() {
  try {
    const token = getToken();
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const usuario = document.getElementById("usuario-usuario").value;
    const senhaAntiga = document.getElementById("usuario-senha-antiga").value;
    const senhaNova = document.getElementById("usuario-senha-nova").value;
    
    document.querySelectorAll(".erro-msg").forEach((element) => (element.innerHTML = ""));
    
    // Só enviar senhaNova se ela foi preenchida
    const dados = { usuario };
    if (senhaNova && senhaNova.trim() !== '') {
      dados.senhaAntiga = senhaAntiga;
      dados.senhaNova = senhaNova;
    }
    
    const response = await fetch(`${baseUrl}/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dados),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }
    alert("Usuário atualizado com sucesso!");
    window.location.href = "usuarios.html";
  } catch (error) {
    let detalhesErro = {};
    try { detalhesErro = JSON.parse(error.message); } catch {}
    const mensagem = Object.entries(detalhesErro)
      .map(([campo, msg]) => `${msg}`)
      .join(`\n`);
    alert(mensagem);
    const formataErro = (campo, mensagem) => {
      const elementoErro = document.getElementById(`erro-${campo}`);
      if (elementoErro) {
        elementoErro.innerText = mensagem;
      }
    };
    const campos = ["usuario", "senha-antiga", "senha-nova"];
    campos.forEach((campo) => {
      if (detalhesErro?.[campo]) {
        formataErro(campo, detalhesErro[campo]);
      }
    });
  }
}

if (window.location.pathname.includes("atualizarUsuario.html")) {
  carregarDadosUsuario();
}
