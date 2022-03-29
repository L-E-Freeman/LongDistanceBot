import fetch from 'node-fetch';
import 'dotenv/config';
import WebSocket from 'ws';

const bot_token = process.env.BOT_TOKEN;
const apiUrl = 'https://discord.com/api';
const headers = {
    'Authorization': `Bot ${bot_token}`,
};

async function getWebsocketGateway() {

    // does not require bot authorization
    const gatewayGetUrl = apiUrl.concat('/gateway');
    const response = await fetch(gatewayGetUrl);
    const data = await response.json();

    const gatewayUrl = data['url'];

    // returns promise which will need to be accessed by using .then()
    return gatewayUrl;
}

async function initializeWebSocket() {

    const gatewayUrl = await getWebsocketGateway();
    const versionEncoding = '/?v=9&encoding=json';

    const connectionUrl = gatewayUrl.concat(versionEncoding);

    const ws = new WebSocket(connectionUrl);

    ws.on('open', function open() {
        console.log('Connection established');
    });

    return ws;
}


// 'op': Code for type of event
// 's': Sequence number for resuming. Only present when op is 0.
// 't': Event name for the payload.
// 'd': Event data.
async function runWebsocket() {
    const ws = await initializeWebSocket();

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

        // Heartbeat acknowledgement from discord.
        if (discordPayload['op'] == 11) {
            console.log('Heartbeat acknowledged!');
        }

        // Dispatch received.
        if (discordPayload['op'] == 0) {
            // gateway dispatch opcode. store 's'.
        }

        // Ready event.
        if (discordPayload['t'] == 'READY') {
            console.log('received READY data: %s', data);
        }

        // Heartbeat request.
        if (discordPayload['op'] == 1) {
            console.log('Heartbeat requested');
            pulseHeartbeat(ws);
        }


    });
}

async function pulseHeartbeat(ws) {
    const heartbeatJSON = {
        'op': 1,
        'd': null,
    };
    ws.send(JSON.stringify(heartbeatJSON));
    console.log('Heartbeat sent!');
}

async function continueHeartbeat(heartbeatInterval, ws) {

    // Wait interval * jitter before sending a heartbeat to discord
    await new Promise(resolve => setTimeout(
        resolve, heartbeatInterval * 0.1,
    ));

    // Pass argument to setInterval without calling pulseHeartbeat function.
    setInterval(function() { pulseHeartbeat(ws); }, heartbeatInterval);

}

async function identify(ws) {
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

runWebsocket();
