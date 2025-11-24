import { getUsers } from "./signup";

// TODO: change usernameTakeMessage to something more general like usernameErrorMessage - change evewrywhere
// in x click handler make sure to hide error message (resetting modal)

export default async function login(username, password) {
    const users = await getUsers();
    const usernameTakenMessage = document.getElementById("username-taken-message");
    
    if (users.some(user => user.username === username)) {
        // if password is correct
        // else if password is incorrect
    } else {
        // username does not exist message
        usernameTakenMessage.innerText = "This username does NOT exist!";
        usernameTakenMessage.classList.remove('hidden');
        console.error('Failed to update login information:', error.message);
    }
    alert('log in');
}

