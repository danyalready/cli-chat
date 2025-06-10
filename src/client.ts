import ChatClient from './core/ChatClient';
import { getParsedArgs } from './utils/getParsedArgs';

const { server } = getParsedArgs();

new ChatClient(server);
