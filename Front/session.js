// session.js

const baseUrl = "http://localhost:3000";

function getToken() {
	return localStorage.getItem('token');
}

function setToken(token) {
	localStorage.setItem('token', token);
}

function clearToken() {
	localStorage.removeItem('token');
}

function isAuthenticated() {
	return getToken() !== null;
}

async function authenticatedFetch(url, options = {}) {
	const token = getToken();
	if (!token) {
		throw new Error('Usuário não autenticado');
	}

	const defaultOptions = {
		headers: {
			'Content-Type': 'application/json',
			'authorization': `Bearer ${token}`
		}
	};

	const finalOptions = { ...defaultOptions, ...options };
	if (finalOptions.body && typeof finalOptions.body === 'object') {
		finalOptions.body = JSON.stringify(finalOptions.body);
	}

	const response = await fetch(url, finalOptions);
	
	if (response.status === 401) {
		clearToken();
		window.location.href = 'login.html';
		throw new Error('Token expirado ou inválido');
	}

	return response;
}

function updateAuthUI() {
	const loginLink = document.getElementById('login-link');
	const logoutLink = document.getElementById('logout-link');
	const authStatus = document.getElementById('auth-status');

	if (isAuthenticated()) {
		if (loginLink) loginLink.style.display = 'none';
		if (logoutLink) logoutLink.style.display = 'inline';
		if (authStatus) authStatus.textContent = '✅ Autenticado';
	} else {
		if (loginLink) loginLink.style.display = 'inline';
		if (logoutLink) logoutLink.style.display = 'none';
		if (authStatus) authStatus.textContent = '❌ Não autenticado';
	}
}

window.updateAuthUI = updateAuthUI;
if (typeof document !== 'undefined') {
	updateAuthUI();
} 