const baseUrl = "http://localhost:3000";

// Adiciona a função getToken do session.js se não existir
if (typeof getToken === 'undefined') {
  function getToken() {
    return localStorage.getItem('token');
  }
}

// Função para obter o token JWT
defaultGetToken = typeof getToken !== 'undefined' ? getToken : () => localStorage.getItem('token');

// Carregar a lista de usuários ao iniciar a página
if (document.getElementById("usuarios-container")) {
  checarAutenticacaoOuRedirecionar().then((autenticado) => {
    if (autenticado) renderizarUsuarios();
  });
}

// Função para renderizar a lista de usuários
async function renderizarUsuarios() {
  await checarAutenticacaoOuRedirecionar();
  const token = defaultGetToken();
  const response = await fetch(`${baseUrl}/usuarios`, {
    headers: { 'x-access-token': token }
  });
  if (response.status === 401) {
    window.location.href = 'login.html';
    return;
  }
  const usuarios = await response.json();
  const container = document.getElementById("usuarios-container");
  container.innerHTML = "";

  usuarios.forEach((usuario) => {
    const card = document.createElement("div");
    card.classList.add("usuario-card");
    card.innerHTML = `
      <div class="info">
        <strong>Usuário:</strong> ${usuario.usuario}
      </div>
      <div class="actions">
        <button onclick="window.location.href='atualizarUsuario.html?id=${usuario.id}&usuario=${encodeURIComponent(usuario.usuario)}'">Editar</button>
        <button onclick="excluirUsuario('${usuario.id}')">Excluir</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Função para confirmar exclusão de usuário
function confirmarExcluirUsuario(id) {
  if (!id) {
    throw new Error(`Erro ao carregar usuário: ID não encontrado.`);
  }
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    excluirUsuario(id);
  }
}

// Função para excluir usuário
async function excluirUsuario(id) {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
  const token = defaultGetToken();
  const response = await fetch(`${baseUrl}/usuarios/${id}`, {
    method: "DELETE",
    headers: { 'x-access-token': token }
  });
  if (response.status === 401) {
    window.location.href = 'login.html';
    return;
  }
  if (!response.ok) {
    const data = await response.json();
    alert(data.error || 'Erro ao excluir usuário');
    return;
  }
  alert('Usuário excluído com sucesso!');
  renderizarUsuarios();
}

// Função para editar usuário
async function editarUsuario(usuario) {
  const id = encodeURIComponent(usuario.id);
  const nome = encodeURIComponent(usuario.usuario);
  window.location.href = `atualizarUsuario.html?id=${id}&usuario=${nome}`;
}

// Função para carregar os dados do usuário na página de atualização
async function carregarDadosUsuario() {
  await checarAutenticacaoOuRedirecionar();
  const params = new URLSearchParams(window.location.search);
  const usuario = params.get("usuario");
  if (usuario) {
    document.getElementById("usuario-nome").value = decodeURIComponent(usuario);
  }
}

// Função para atualizar usuário
async function atualizarUsuario() {
  await checarAutenticacaoOuRedirecionar();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const usuario = document.getElementById("usuario-nome").value;
  const senha = document.getElementById("usuario-senha").value;
  const token = defaultGetToken();
  const body = senha ? { usuario, senha } : { usuario };
  const response = await fetch(`${baseUrl}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'x-access-token': token
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    alert(data.error || 'Erro ao atualizar usuário');
    return;
  }
  alert('Usuário atualizado com sucesso!');
  window.location.href = "usuarios.html";
}

// Chama a função para carregar os dados do usuário ao carregar a página de edição
if (window.location.pathname.includes("atualizarUsuario.html")) {
  carregarDadosUsuario();
}

function abrirFormularioAdicionarUsuario() {
  document.getElementById('form-adicionar-usuario').style.display = 'block';
}

function fecharFormularioAdicionarUsuario() {
  document.getElementById('form-adicionar-usuario').style.display = 'none';
}

async function criarUsuario() {
  await checarAutenticacaoOuRedirecionar();
  const usuario = document.getElementById('usuario-nome').value;
  const senha = document.getElementById('usuario-senha').value;
  const response = await fetch(`${baseUrl}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  });
  const data = await response.json();
  if (!response.ok) {
    alert(data.error || 'Erro ao adicionar usuário');
    return;
  }
  alert('Usuário adicionado com sucesso!');
  window.location.href = 'usuarios.html';
}

// Função para checar autenticação e redirecionar para login se necessário
async function checarAutenticacaoOuRedirecionar() {
  const token = defaultGetToken();
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  try {
    const res = await fetch(`${baseUrl}/usuarios`, { headers: { 'x-access-token': token } });
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