import { WebSocketServer, WebSocket } from 'ws';

import type { Message } from './Message';

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

            socket.on('message', (data) => {
                const msg: Message = JSON.parse(data.toString());

                this.broadcast(msg, socket);
            });

            socket.on('close', () => {
                console.log('Client disconnected.');
            });
        });

        console.log(`Chat server is running on ws://localhost:${this.port}`);
    }

    private broadcast(msg: Message, sender: WebSocket) {
        for (const client of this.wss.clients) {
            if (client !== sender && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(msg));
            }
        }
    }
}
