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

async function isTokenValid() {
	const token = getToken();
	if (!token) return false;
	try {
		// Tenta acessar um endpoint protegido
		const res = await fetch(`${baseUrl}/usuarios`, {
			headers: { 'x-access-token': token }
		});
		if (res.status === 200) return true;
		clearToken();
		return false;
	} catch {
		clearToken();
		return false;
	}
}

async function updateAuthUI() {
	const loginLink = document.getElementById('login-link');
	const logoutLink = document.getElementById('logout-link');
	const authStatus = document.getElementById('auth-status');
	const isValid = await isTokenValid();
	if (isValid) {
		if (loginLink) loginLink.style.display = 'none';
		if (logoutLink) logoutLink.style.display = '';
		if (authStatus) authStatus.innerText = 'Usuário autenticado';
	} else {
		if (loginLink) loginLink.style.display = '';
		if (logoutLink) logoutLink.style.display = 'none';
		if (authStatus) authStatus.innerText = 'Não autenticado';
	}
}

window.updateAuthUI = updateAuthUI;
document.addEventListener('DOMContentLoaded', updateAuthUI); 