import AESCrypto from './core/AESCrypto';
import ChatClient from './core/ChatClient';
import { getParsedArgs } from './utils/getParsedArgs';

const { server, ncpKey } = getParsedArgs();

if (!ncpKey) throw new Error('No args are provided.');

const aes = await AESCrypto.create(ncpKey);

new ChatClient(server, aes);
