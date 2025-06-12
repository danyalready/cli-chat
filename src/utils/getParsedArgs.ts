const FLAGS = {
    server: ['--server', '-s'],
    ncpKey: ['--ncpKey', '-n'],
    help: ['--help', '-h'],
};

interface Options {
    server: string;
    ncpKey: string;
}

export function getParsedArgs(): Options {
    const [, , ...args] = process.argv;

    const options: Options = {
        server: 'ws://localhost:8080',
        ncpKey: '',
    };

    for (let i = 0; i < args.length; i++) {
        const currArg = args[i] as string;

        if (FLAGS.server.includes(currArg)) {
            const value = args[i + 1];

            if (value) {
                options.server = value;
                i++;
            }
        } else if (FLAGS.ncpKey.includes(currArg)) {
            const value = args[i + 1];

            if (value) {
                options.ncpKey = value;
                i++;
            }
        } else if (FLAGS.help.includes(currArg)) {
            console.log(`
Chat Client CLI

Usage:
  bun src/client.ts [--server ws://your-server]

Options:
  --server, -s   WebSocket server URL (default: ws://localhost:3000)
  --help, -h     Show this help message
      `);
            process.exit(0);
        }
    }

    return options;
}
