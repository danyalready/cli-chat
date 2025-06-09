import WebSocket from 'ws';
import readline from 'readline';

export default class ChatClient {
    private ws: WebSocket;
    private rl: readline.Interface;
    private username: string = '';

    constructor(private url: string = 'ws://localhost:8080') {
        this.ws = new WebSocket(this.url);
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        this.setupConnection();
    }

    private setupConnection() {
        this.ws.on('open', () => {
            this.promptUsername();
        });

        this.ws.on('message', (data) => {
            console.log(data.toString());
        });

        this.ws.on('close', () => {
            console.log('Disconnected from server.');
            this.rl.close();
        });

        this.ws.on('error', (err) => {
            console.error('Connection error:', err.message);
            this.rl.close();
        });
    }

    private promptUsername() {
        this.rl.question('Enter your name: ', (name) => {
            this.username = name;
            console.log(`Hello, ${this.username}! Start chatting:`);
            this.listenForInput();
        });
    }

    private listenForInput() {
        this.rl.on('line', (line) => {
            if (line.trim() === '/exit') {
                this.ws.close();
            } else {
                this.ws.send(`${this.username}: ${line}`);
            }
        });
    }
}
