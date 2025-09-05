export async function postUser(uuid) {
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
