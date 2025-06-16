# web-sockets

To install dependencies:

```bash
bun install
```

To build and create executable (windows)

```bash
npx esbuild src/client.ts   --bundle   --platform=node   --format=cjs   --target=node18   --external:crypto   --outfile=dist/client.js

pkg dist/client.js --targets node18-win-x64 --output dist/client.exe
```
