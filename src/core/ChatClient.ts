import WebSocket from 'ws';
import readline from 'readline';

import type { Message } from './Message';

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
            try {
                const msg: Message = JSON.parse(data.toString());
                const time = new Date(msg.time).toLocaleTimeString();

                // Clear current prompt line
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0);

                if (msg.system) {
                    console.log(`[${msg.time}] ${msg.user}: ${msg.text}`);
                } else {
                    console.log(`[${time}] ${msg.user}: ${msg.text}`);
                }

                // Re-show prompt
                this.rl.prompt(true); // true = preserve typed text
            } catch {
                this.rl.pause();
                console.error('Malformed message:', data.toString());
                this.rl.resume();
            }
        });

        this.ws.on('close', () => {
            console.log('Disconnected from server.');
            this.rl.close();
            process.exit(0);
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
        this.rl.setPrompt('>');
        this.rl.prompt();

        this.rl.on('line', (line) => {
            if (line.trim() === '/exit') {
                this.ws.close();
            } else {
                const msg: Message = { user: this.username, text: line, time: new Date().toISOString() };

                this.ws.send(JSON.stringify(msg));
            }

            this.rl.prompt();
        });
    }
}
