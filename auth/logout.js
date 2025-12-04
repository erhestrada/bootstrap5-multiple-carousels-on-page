export default async function logout() {
    hideUsername();
}

function hideUsername() {
    const profileLinkElement = document.getElementById('profile-btn');
    profileLinkElement.textContent = 'Profile';

    const navbarLoginButton = document.getElementById('log-in-button');
    navbarLoginButton.innerText = "Log in";
}
