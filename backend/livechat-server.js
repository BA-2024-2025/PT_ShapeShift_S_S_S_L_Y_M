const WebSocket = require('ws');

// Create the WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('A new client connected.');

    // Broadcast a message when a new message is received from a client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Broadcast the message to all other clients
        wss.clients.forEach(client => {
            if ( client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('A client disconnected.');
    });

    // Send a welcome message to the new client
    ws.send('System: Welcome to the live chat!');
});

console.log('Live chat server is running on ws://localhost:8080');
