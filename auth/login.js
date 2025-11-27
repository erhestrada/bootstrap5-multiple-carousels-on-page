import { getUsers, displayUsername } from "./signup";

export default async function login(username, password) {
    const users = await getUsers();
    const usernameTakenMessage = document.getElementById("username-error-message");
    
    // if password is correct
    if (users.some(user => user.username === username)) {
        displayUsername();
    } else {
        // username does not exist message
        usernameTakenMessage.innerText = "This username does NOT exist!";
        usernameTakenMessage.classList.remove('hidden');
        console.error('Failed to update login information:', error.message);
    }
    alert('log in');
}

