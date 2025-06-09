import { WebSocketServer, WebSocket } from 'ws';

export default class ChatServer {
    private wss: WebSocketServer;
    private port: number;

    constructor(port: number = 8080) {
        this.port = port;
        this.wss = new WebSocketServer({ port: this.port });

        this.setupServer();
    }

    private setupServer() {
        this.wss.on('connection', (socket) => {
            console.log('Client connected.');
            socket.send('Welcome to the chat!');

            socket.on('message', (message) => {
                console.log(`Received: ${message}`);
                this.broadcast(message.toString(), socket);
            });

            socket.on('close', () => {
                console.log('Client disconnected.');
            });
        });

        console.log(`Chat server is running on ws://localhost:${this.port}`);
    }

    private broadcast(message: string, sender: WebSocket) {
        for (const client of this.wss.clients) {
            if (client !== sender && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }
}
