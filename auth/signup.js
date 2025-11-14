// db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, client_id TEXT, username TEXT UNIQUE, password TEXT)');
export default async function signup(username, password) {
    const users = await getUsers();
    const usernames = users.map(user => user.username);
    const usernameExists = usernames.includes(username);
    if (usernameExists) {
        // error message
        console.log('old username');
    } else {
        console.log("new username");
        patchUser(clientId, username, password);
        // post/patch username password
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

export async function patchUser(clientId, username, password) {
    try {
        const response = await fetch('http://192.168.86.195:3000/postUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uuid })
        });
        const result = await response.json();
        console.log('Data Stored:', result);

    } catch (error) {
        console.error('Error storing data:', error);
    }
};
