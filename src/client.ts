import ChatClient from './core/ChatClient';
import { getParsedArgs } from './utils/getParsedArgs';

const { server, ncpKey } = getParsedArgs();

if (!ncpKey) throw new Error('No args are provided.');

const keyBytes = new TextEncoder().encode(ncpKey);
const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);

new ChatClient(server, cryptoKey);
