import crypto from 'crypto';

export default class AESCrypto {
    constructor(private key: CryptoKey) {}

    async encrypt(plainText: string): Promise<string> {
        const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
        const plainBytes = new TextEncoder().encode(plainText);

        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, this.key, plainBytes);

        // Join IV and encrypted content together
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        // Convert to Base64 string
        return btoa(String.fromCharCode(...combined));
    }

    async decrypt(cipherTextBase64: string): Promise<string> {
        const combined = Uint8Array.from(atob(cipherTextBase64), (c) => c.charCodeAt(0));

        const iv = combined.slice(0, 12);
        const encrypted = combined.slice(12);

        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, this.key, encrypted);

        return new TextDecoder().decode(decrypted);
    }
}
