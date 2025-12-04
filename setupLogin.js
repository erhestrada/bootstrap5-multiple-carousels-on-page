import { signup, login, logout } from "./auth";

export function setupLogin(userId) {
    const navBarLoginButton = document.getElementById('log-in-button');
    const loginModal = document.getElementById('login-modal');
    navBarLoginButton.onclick = () => loginModal.style.display = 'block';

    const loginModalCloseButton = loginModal.querySelector('.close-btn');
    loginModalCloseButton.addEventListener('click', () => closeLoginModal(loginModal));

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    loginBtn.onclick = () => handleLogin(loginModal);
    signUpBtn.onclick = () => toggleLogInSignUp(loginModal);
    logoutBtn.onclick = logout;

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

function toggleLogInSignUp(loginModal) {
    const header = loginModal.querySelector('h2');
    const submitButton = loginModal.querySelector('#loginBtn');
    const changeModalButton = loginModal.querySelector('#signUpBtn');

    const loginActive = submitButton.innerText === "Log In";

    if (loginActive) {
        header.innerText = 'Sign up for Clips Tracker';
        submitButton.innerText = 'Sign Up';
        changeModalButton.innerText = 'Log In';

        submitButton.onclick = () => handleSignup(userId, loginModal);
        changeModalButton.onclick = () => toggleLogInSignUp(loginModal);
    } else {
        header.innerText = 'Log in to Clips Tracker';
        submitButton.innerText = 'Log In';
        changeModalButton.innerText = 'Sign Up';

        submitButton.onclick = () => handleLogin(loginModal);
        changeModalButton.onclick = () => toggleLogInSignUp(loginModal);
    }
}

function handleLogin(loginModal) {
    const username = loginModal.querySelector('#username').value;
    const password = loginModal.querySelector('#password').value;
    login(username, password); 
}

function handleSignup(userId, loginModal) {
    const username = loginModal.querySelector('#username').value;
    const password = loginModal.querySelector('#password').value;
    signup(userId, username, password); 
}

export function closeLoginModal(loginModal) {
    // Hide login
    loginModal.style.display = 'none';

    const usernameElement = loginModal.querySelector('#username');
    const passwordElement = loginModal.querySelector('#password');
    const usernameErrorMessage = document.getElementById("username-error-message");

    // Reset inputs
    usernameElement.value = '';
    passwordElement.value = '';
    usernameErrorMessage.classList.add('hidden');

    // Reset modal to login layout
    const header = loginModal.querySelector('h2');
    const submitButton = loginModal.querySelector('#loginBtn');
    const changeModalButton = loginModal.querySelector('#signUpBtn');

    header.innerText = 'Log in to Clips Tracker';
    submitButton.innerText = 'Log In';
    changeModalButton.innerText = 'Sign Up';
}