import { getUsers } from "./signup";

export default async function login(username, password) {
    const users = await getUsers();
    
    if (users.contains(username)) {
        // if password is correct
        // else if password is incorrect
    } else {
        // username does not exist message
    }
    alert('log in');
}

