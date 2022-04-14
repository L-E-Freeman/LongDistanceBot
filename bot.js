// Required packages
import fetch from 'node-fetch';
import 'dotenv/config';
import WebSocket from 'ws';

// Command handler functions
import { commandDict } from './commands.js';
import { ping } from './command_handler.js';
import { countdown } from './command_handler.js';


const bot_token = process.env.BOT_TOKEN;
const apiUrl = 'https://discord.com/api/v8/';
const headers = {
    'Authorization': `Bot ${bot_token}`,
};


async function getWebSocketGateway() {

    // does not require bot authorization
    const gatewayGetUrl = apiUrl.concat('/gateway');
    const response = await fetch(gatewayGetUrl);
    const data = await response.json();

    const gatewayUrl = data['url'];

    return gatewayUrl;
}

async function initializeWebSocket() {

    const gatewayUrl = await getWebSocketGateway();
    const versionEncoding = '/?v=9&encoding=json';

    const connectionUrl = gatewayUrl.concat(versionEncoding);

    const ws = new WebSocket(connectionUrl);

    ws.on('open', function open() {
        console.log('Connection established');
    });

    return ws;
}

/**
 * Initializes websocket object. Acts on information sent via payload and
 * responds appropriately. Handles websocket connection, heartbeating, and
 * the receiving of slash command interactions.
 *
 * 'op': Int - Code for event type.
 * 's': Int - Sequence number for resuming.
 * 't': Str - Event name.
 * 'd': Any JSON value - Event data.
 */
export async function runBot(websocket) {
    const ws = websocket

    ws.on('message', function checkMessageType(data) {
        const discordPayload = JSON.parse(data);

        // 'Hello' opcode.
        if (discordPayload['op'] == 10) {
            console.log('Received "hello" from Discord.');
            const heartbeatInterval =
            discordPayload['d']['heartbeat_interval'];
            continueHeartbeat(heartbeatInterval, ws);
            identify(ws);
        }

        // Ready event.
        if (discordPayload['t'] == 'READY') {
            console.log('Discord READY!');
        }

        // Heartbeat request received.
        if (discordPayload['op'] == 1) {
            console.log('Heartbeat requested');
            pulseHeartbeat(ws);
        }

        // Heartbeat acknowledgement received.
        if (discordPayload['op'] == 11) {
            console.log(`${ Date.now() / 1000 }: Heartbeat Acknowledged!`);
        }

        // Dispatch received.
        if (discordPayload['op'] == 0) {
            // TODO: Store sequence number used for resuming here.
            
            // User has used a command, check command against command 
            // dictionary and call corresponding function if exists.
            if (discordPayload['t'] == 'INTERACTION_CREATE') {
                const commandName = discordPayload['d']['data']['name'];
                if (commandName in commandDict) {
                    commandDict[commandName](discordPayload);
                }
                else { 
                    console.log('No matching command found.')
                }
            }
        }
    });
}

export async function pulseHeartbeat(ws) {
    const heartbeatJSON = {
        'op': 1,
        'd': null,
    };
    ws.send(JSON.stringify(heartbeatJSON));
    console.log(`${ Date.now() / 1000 }: Heartbeat sent!`);
}

export async function continueHeartbeat(heartbeatInterval, ws) {

    // Wait interval * jitter before sending a heartbeat to discord
    await new Promise(resolve => setTimeout(
        resolve, heartbeatInterval * 0.1,
    ));

    // Pass argument to setInterval without calling pulseHeartbeat function.
    setInterval(function() { pulseHeartbeat(ws); }, heartbeatInterval);

}

export async function identify(ws) {
    const identifyJSON = {
        'op': 2,
        'd': {
            'token': bot_token,
            'intents': 512,
            'properties': {
                '$os': 'windows',
                '$browser': 'LongDistanceBot',
                '%device': 'LongDistanceBot',
            },
        },
    };

    ws.send(JSON.stringify(identifyJSON));
}

runBot(await initializeWebSocket());
