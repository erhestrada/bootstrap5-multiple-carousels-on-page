export function setupLogin() {
    const navBarLoginButton = document.getElementById('log-in-button');
    const loginModal = document.getElementById('login-modal');
    navBarLoginButton.addEventListener('click', () => loginModal.style.display = 'block');

    const loginModalCloseButton = loginModal.querySelector('.close-btn');
    loginModalCloseButton.addEventListener('click', () => loginModal.style.display='none');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const signUpBtn = document.getElementById('signUpBtn');

    signUpBtn.addEventListener('click', () => handleSignUp(loginModal));

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

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
        loginModal.style.display = 'none';
        }
    });
}

function handleSignUp(loginModal) {
    const header = loginModal.querySelector('h2');
    const submitButton = loginModal.querySelector('#loginBtn');
    const changeModalButton = loginModal.querySelector('#signUpBtn');

    header.innerText = 'Sign up for Clips Tracker';
}