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

async function runWebsocket() {
    const ws = await initializeWebSocket();

    ws.on('message', function checkMessageType(data) {
        console.log('received: %s', data);
        const discordPayload = JSON.parse(data);

        if (discordPayload['op'] == 10) {
            heartbeat(discordPayload, ws);
            identify(ws);
        }
    });
}

async function heartbeat(discordPayload, ws) {
    const heartbeatInterval =
        discordPayload['d']['heartbeat_interval'];

    // Wait interval * jitter before sending a heartbeat to discord
    await new Promise(resolve => setTimeout(
        resolve, heartbeatInterval * 0.1,
    ));

    function pulseHeartbeat() {
        const heartbeatJSON = {
            'op': 1,
            'd': null,
        };
        ws.send(JSON.stringify(heartbeatJSON));
    }

    setInterval(pulseHeartbeat, heartbeatInterval);

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
