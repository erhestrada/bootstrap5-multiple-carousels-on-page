// db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, client_id TEXT, username TEXT UNIQUE, password TEXT)');
export default async function signup(userId, username, password) {
    const users = await getUsers();
    const usernames = users.map(user => user.username);
    const usernameExists = usernames.includes(username);
    if (usernameExists) {
        // error message
        console.log('old username');
    } else {
        console.log("new username");
        patchLogin(userId, username, password);
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
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Updated login:', result);

    } catch (error) {
        console.error('Failed to patch login:', error);
        // throw error if the ui should display something in this case
    }
};
