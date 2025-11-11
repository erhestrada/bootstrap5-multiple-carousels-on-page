export function setupLogin() {
    const navBarLoginButton = document.getElementById('log-in-button');
    const loginModal = document.getElementById('login-modal');
    navBarLoginButton.addEventListener('click', () => loginModal.style.display = 'block');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');

    function toggleLoginButton() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username && password) {
            loginBtn.disabled = false;
            loginBtn.style.backgroundColor = '#007bff';
            loginBtn.style.cursor = 'pointer';
        } else {
            loginBtn.disabled = true;
            loginBtn.style.backgroundColor = '#6c757d';
            loginBtn.style.cursor = 'not-allowed';
        }
    }

    usernameInput.addEventListener('input', toggleLoginButton);
    passwordInput.addEventListener('input', toggleLoginButton);
}
