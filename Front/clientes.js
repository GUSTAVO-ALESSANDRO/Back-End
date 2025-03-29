const baseUrl = 'http://localhost:3000';

// Função para renderizar a lista de clientes
async function renderizarClientes() {
    const response = await fetch(`${baseUrl}/clientes`);
    const clientes = await response.json();
    
    const container = document.getElementById('clientes-container');
    container.innerHTML = '';

    clientes.forEach(cliente => {
        const clienteCard = document.createElement('div');
        clienteCard.classList.add('cliente-card');
        
        clienteCard.innerHTML = `
            <div class="info">
                <strong>ID:</strong> ${cliente.id} <br>
                <strong>Nome:</strong> ${cliente.nome} <br>
                <strong>Sobrenome:</strong> ${cliente.sobrenome} <br>
                <strong>Email:</strong> ${cliente.email} <br>
                <strong>Idade:</strong> ${cliente.idade} <br>
            </div>
            <div class="actions">
                <button class="editar" onclick='editarCliente(${JSON.stringify(cliente)})'>Editar</button>
                <button class="excluir" onclick="confirmarExcluir(${cliente.id})">Excluir</button>
            </div>
        `;
    
        container.appendChild(clienteCard);
    });
}

// Função para editar cliente (chamada na página de clientes)
function editarCliente(cliente) {
    // Usando encodeURIComponent para garantir que os valores especiais sejam tratados corretamente
    const id = encodeURIComponent(cliente.id);
    const nome = encodeURIComponent(cliente.nome);
    const sobrenome = encodeURIComponent(cliente.sobrenome);
    const email = encodeURIComponent(cliente.email);
    const idade = encodeURIComponent(cliente.idade);

    // Redirecionando para a página de atualização com os dados na URL
    window.location.href = `atualizarCliente.html?id=${id}&nome=${nome}&sobrenome=${sobrenome}&email=${email}&idade=${idade}`;
}

// Função para confirmar exclusão
function confirmarExcluir(id) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        excluirCliente(id);
    }
}

// Função para excluir cliente
async function excluirCliente(id) {
    await fetch(`${baseUrl}/clientes/${id}`, {
        method: 'DELETE',
    });
    renderizarClientes();
}

// Carregar a lista de clientes
renderizarClientes();

// Atualizar cliente
async function criarCliente() {
    const nome = document.getElementById('cliente-nome').value;
    const sobrenome = document.getElementById('cliente-sobrenome').value;
    const email = document.getElementById('cliente-email').value;
    const idade = document.getElementById('cliente-idade').value;

    const response = await fetch(`${baseUrl}/clientes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            sobrenome,
            email,
            idade
        })
    });

    const cliente = await response.json();
    //alert('Cliente adicionado com sucesso!');
    window.location.href = 'clientes.html'; // Redireciona de volta para a página de clientes
}

// Função para carregar os dados do cliente na página de atualização
async function carregarDadosCliente() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const nome = params.get('nome');
    const sobrenome = params.get('sobrenome');
    const email = params.get('email');
    const idade = params.get('idade');

    // Verificando se os parâmetros existem
    if (id && nome && sobrenome && email && idade) {
        document.getElementById('cliente-nome').value = decodeURIComponent(nome);
        document.getElementById('cliente-sobrenome').value = decodeURIComponent(sobrenome);
        document.getElementById('cliente-email').value = decodeURIComponent(email);
        document.getElementById('cliente-idade').value = decodeURIComponent(idade);
    } else {
        console.error("Parâmetros não encontrados na URL");
    }
}

// Função para atualizar cliente
async function atualizarCliente() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const nome = document.getElementById('cliente-nome').value;
    const sobrenome = document.getElementById('cliente-sobrenome').value;
    const email = document.getElementById('cliente-email').value;
    const idade = document.getElementById('cliente-idade').value;

    const response = await fetch(`${baseUrl}/clientes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            sobrenome,
            email,
            idade
        })
    });

    const cliente = await response.json();
    //alert('Cliente atualizado com sucesso!');
    window.location.href = 'clientes.html'; // Redireciona de volta para a página de clientes
}

// Chama a função para carregar os dados do cliente ao carregar a página de edição
if (window.location.pathname.includes('atualizarCliente.html')) {
    carregarDadosCliente();
}
