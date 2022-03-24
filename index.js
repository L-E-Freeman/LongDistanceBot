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

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
}

initializeWebSocket();