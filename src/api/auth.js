import { API_URL } from "./apiConfig.js";
import { closeLoginModal } from "../../setupLogin.js";

// TODO: hide error message when modal closed e.g. This userNAME DOES not exist persisting
export async function login(username, password) {
    const users = await getUsers();
    const usernameErrorMessage = document.getElementById("username-error-message");
    
    // if password is correct
    if (users.some(user => user.username === username)) {
        displayUsername();
    } else {
        // username does not exist message
        usernameErrorMessage.innerText = "This username does NOT exist!";
        usernameErrorMessage.classList.remove('hidden');
        console.error('Failed to update login information:', error.message);
    }
    alert('log in');
}

export async function logout() {
    hideUsername();
}

function hideUsername() {
    const profileLinkElement = document.getElementById('saved-clips-button'); //TODO: make id more descriptive
    profileLinkElement.textContent = 'Profile';

    const navbarLoginButton = document.getElementById('log-in-button');
    navbarLoginButton.innerText = "Log in";

    const loginModal = document.getElementById('login-modal');
    navbarLoginButton.onclick = () => loginModal.style.display = 'block'; // TODO: login button color needs to go back to grey
}

// db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, client_id TEXT, username TEXT UNIQUE, password TEXT)');
export async function signup(userId, username, password) {
    const users = await getUsers();
    const usernameTakenMessage = document.getElementById("username-error-message");
    const navbarLoginButton = document.getElementById('log-in-button');

    if (users.some(user => user.username === username)) {
        usernameTakenMessage.innerText = "This is someone else's username!";
        usernameTakenMessage.classList.remove('hidden');
        return; // Early return guard clause
    } 
    
    console.log("new username");
    try {
        await patchLogin(userId, username, password);
        const loginModal = document.getElementById('login-modal');
        closeLoginModal(loginModal);

        navbarLoginButton.innerText = 'Log Out';
        navbarLoginButton.onclick = logout;
        displayUsername();
    } catch (error) {
        usernameTakenMessage.innerText = "Something went wrong";
        usernameTakenMessage.classList.remove('hidden');
        console.error('Failed to update login information:', error.message);
    }    
}

// move to /users ?
export async function getUsers() {
    try {
        const url = API_URL + `users/`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const users = await response.json();
        console.log('users: ', users);
        return users;

    } catch (error) {
        console.error('Error getting users', error);
        return [];
    }
}

// TODO: remove, unused
export async function patchLogin(userId, username, password) {
    try {
        const response = await fetch(API_URL + `users/${userId}/login`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const result = await response.json(); // Parse json to get error
            throw new Error(result.error || `HTTP error; status: ${response.status}`);
        }

    } catch (error) {
        console.error('Failed to patch login:', error.message);
        throw error; // Throw error so UI knows to display error message
    }
};

export function displayUsername() {
    const profileLinkElement = document.getElementById('profile-btn');
    profileLinkElement.textContent = username;
}
