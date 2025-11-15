// db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, client_id TEXT, username TEXT UNIQUE, password TEXT)');
export default async function signup(userId, username, password) {
    const users = await getUsers();
    if (users.some(user => user.username === username)) {
        const usernameTakenMessage = document.getElementById("username-taken-message");
        usernameTakenMessage.classList.remove('hidden');
        return; // Early return guard clause
    } 
    
    console.log("new username");
    try {
        const result = await patchLogin(userId, username, password);
    } catch (error) {
        // "Something went wrong"
        console.error('Failed to update login information:', error.message);
    }    
}

// move to /users ?
export async function getUsers() {
    try {
        const url = `http://192.168.86.195:3000/users/`;
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
export async function patchLogin(userId, username, password) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/${userId}/login`, {
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
