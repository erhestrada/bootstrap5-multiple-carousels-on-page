export default async function logout() {
    hideUsername();
}

function hideUsername() {
    const profileLinkElement = document.getElementById('profile-btn');
    profileLinkElement.textContent = 'Profile';

    const navbarLoginButton = document.getElementById('log-in-button');
    navbarLoginButton.innerText = "Log in";

    const loginModal = document.getElementById('login-modal');
    navbarLoginButton.onclick = () => loginModal.style.display = 'block'; // TODO: login button color needs to go back to grey
}
