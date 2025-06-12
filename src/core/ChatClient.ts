import WebSocket from 'ws';
import readline from 'readline';

import type { Message } from './Message';
import AESCrypto from './AESCrypto';

export default class ChatClient {
    private ws: WebSocket;
    private rl: readline.Interface;
    private aes: AESCrypto;
    private username: string = '';

    constructor(url: string = 'ws://localhost:8080', aes: AESCrypto) {
        this.ws = new WebSocket(url);
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.aes = aes;

        this.setupConnection();
    }

    private setupConnection() {
        this.ws.on('open', () => {
            this.promptUsername();
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
            this.listenForInput();
            this.listenForMessages();
        });
    }

    private listenForInput() {
        this.rl.setPrompt('>');
        this.rl.prompt();

        this.rl.on('line', async (line) => {
            if (line.trim() === '/exit') {
                this.ws.close();
            } else {
                const msg: Message = { user: this.username, text: line, time: new Date().toISOString() };

                readline.clearLine(process.stdout, 0); // clear the line
                readline.cursorTo(process.stdout, 0); // move cursor to line start

                const encrypted = await this.aes.encrypt(JSON.stringify(msg));

                this.ws.send(encrypted);
            }

            this.rl.prompt();
        });
    }

    private listenForMessages() {
        this.ws.on('message', async (data) => {
            try {
                const decrypted = await this.aes.decrypt(data.toString());
                const msg: Message = JSON.parse(decrypted);
                const time = new Date(msg.time).toLocaleTimeString();

                readline.moveCursor(process.stdout, 0, -1); // move cursor up one line
                readline.clearLine(process.stdout, 0); // clear the line
                readline.cursorTo(process.stdout, 0); // move cursor to line start

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
    }
}
