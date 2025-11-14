// db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, client_id TEXT, username TEXT UNIQUE, password TEXT)');
// get users
// check if username novel else error
// if valid username post
export default async function signup(username, password) {
    const users = await getUsers();
    const usernames = users.map(user => user.username);
    const usernameExists = usernames.includes(username);
    if (usernameExists) {
        // error message
        console.log('old username');
    } else {
        console.log("new username");
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
