import { getUsers, displayUsername } from "./signup";

// TODO: hide error message when modal closed e.g. This userNAME DOES not exist persisting
export default async function login(username, password) {
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

