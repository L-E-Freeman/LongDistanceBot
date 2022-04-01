import { ping } from './command_handler.js';
import { countdown } from './command_handler.js';

export const commandDict = {
    'ping': ping,
    'countdown': countdown,
};
